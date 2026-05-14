# yzliste — Görsel V2 Code Refactor Spec

> **Strateji:** `docs/gorsel-strateji-2026-05-05.md`
> **Promptlar:** `docs/gorsel-prompts-v2.md`
> **Branch:** `claude/gorsel-v2-pipeline`
> **Tahmini süre:** 2-3 gün Code

---

## Özet

Mevcut `app/api/gorsel/route.ts` tek model (`bria/product-shot`) kullanıyor, kıyafet/askı/boyut sorunları var. Yeni V2 pipeline:
1. Kategori dropdown UI (zorunlu)
2. Vision classify (Pass 1) — sessiz doğrulama
3. Kategori-aware RMBG (Pass 2)
4. Model routing + 35 prompt template (Pass 3)
5. Sharp post-process (Pass 4) — boyut/oran garanti
6. Feature flag `GORSEL_V2` ile kademeli rollout

---

## 1. Database migration

`supabase migration new gorsel_v2_kategori`

```sql
-- gorsel_uretim tablosuna yeni sütunlar (PostHog ve test analytics için)
ALTER TABLE gorsel_uretim
  ADD COLUMN IF NOT EXISTS kategori text CHECK (kategori IN ('giyim', 'ayakkabi_canta', 'kozmetik', 'taki_aksesuar', 'genel')),
  ADD COLUMN IF NOT EXISTS model_kullanilan text,
  ADD COLUMN IF NOT EXISTS prompt_version text DEFAULT 'gorsel-v2.0',
  ADD COLUMN IF NOT EXISTS pipeline_version text DEFAULT 'v1',  -- v1 (mevcut) / v2 (yeni)
  ADD COLUMN IF NOT EXISTS vision_classified_kategori text,    -- Pass 1 ne dedi
  ADD COLUMN IF NOT EXISTS user_kategori_overridden boolean DEFAULT false;

-- Index for analytics queries
CREATE INDEX IF NOT EXISTS idx_gorsel_uretim_kategori ON gorsel_uretim(kategori);
CREATE INDEX IF NOT EXISTS idx_gorsel_uretim_pipeline ON gorsel_uretim(pipeline_version);
```

---

## 2. Yeni dosya yapısı

```
lib/fal/
├── rmbg.ts (mevcut, Pass 2'de kategori-aware refactor)
├── vision-classify.ts (YENİ — Pass 1)
├── product-shot-router.ts (YENİ — kategori → model routing)
├── post-process.ts (YENİ — Pass 4 Sharp)
└── prompts/
    ├── _common.ts (COMMON_POSITIVE_SUFFIX, COMMON_NEGATIVE_BASE)
    ├── giyim.ts
    ├── ayakkabi-canta.ts
    ├── kozmetik.ts
    ├── taki-aksesuar.ts
    ├── genel.ts
    └── index.ts (kategori → prompt builder export)

components/uret/
└── KategoriSelector.tsx (YENİ — dropdown)
```

---

## 3. Vision-classify (Pass 1)

`lib/fal/vision-classify.ts`:

```ts
import { fal } from '@fal-ai/client'

export type Kategori = 'giyim' | 'ayakkabi_canta' | 'kozmetik' | 'taki_aksesuar' | 'genel'

const KATEGORI_DESCRIPTIONS = {
  giyim: 'clothing apparel garment shirt dress pants jacket',
  ayakkabi_canta: 'shoes footwear sneakers boots bag handbag backpack wallet',
  kozmetik: 'cosmetics skincare beauty product cream serum perfume makeup',
  taki_aksesuar: 'jewelry accessory necklace earring ring watch sunglasses',
  genel: 'home goods electronics food toy decor general merchandise',
}

/**
 * Vision ile fotoğrafın kategorisini tespit eder.
 * Kullanıcı seçimi ile karşılaştırılır — uyumsuzluk durumunda UI uyarı verir.
 *
 * Maliyet: ~$0.001/çağrı
 * Süre: ~1-2 saniye (paralel başlatılır, kullanıcıyı bekletmez)
 */
export async function visionKategoriTespit(imageUrl: string): Promise<{
  kategori: Kategori
  confidence: number  // 0-1
}> {
  try {
    const prompt = `Bu fotoğrafta ne tür bir ürün var?
Sadece şu 5 kategoriden birini seç:
- giyim (kıyafet, gömlek, elbise, pantolon, ceket)
- ayakkabi_canta (ayakkabı, çanta, cüzdan)
- kozmetik (krem, parfüm, makyaj, bakım ürünü)
- taki_aksesuar (kolye, küpe, yüzük, saat, gözlük)
- genel (ev eşyası, elektronik, gıda, hediye, çiçek, diğer)

Tek kelime cevap (örn: "giyim"). Açıklama yapma.`

    // GPT-4o-mini veya benzeri ucuz vision model
    const result = await fal.subscribe('fal-ai/any-llm/vision', {
      input: {
        prompt,
        image_url: imageUrl,
        model: 'openai/gpt-4o-mini', // ucuz + hızlı
      },
    }) as unknown as { data: { output: string } }

    const cevap = result?.data?.output?.trim().toLowerCase() ?? 'genel'
    const kategori = (Object.keys(KATEGORI_DESCRIPTIONS) as Kategori[])
      .find(k => cevap.includes(k)) ?? 'genel'

    return { kategori, confidence: 0.9 }  // confidence şimdilik sabit
  } catch (err) {
    // Hata durumunda fallback "genel"
    return { kategori: 'genel', confidence: 0 }
  }
}
```

**Not:** fal.ai'da `any-llm/vision` benzeri bir endpoint var mı Code 1. günde araştırsın. Yoksa OpenAI direkt çağrı (Anthropic API key zaten var).

---

## 4. Model router (Pass 3)

`lib/fal/product-shot-router.ts`:

```ts
import type { Kategori } from './vision-classify'

export type ModelChoice =
  | 'fal-ai/bria/product-shot'
  | 'fal-ai/flux-pro/kontext'
  | 'fal-ai/fashn/tryon/v1.5'
  | 'fal-ai/image-apps-v2/product-photography'

interface ModelConfig {
  primary: ModelChoice
  fallback: ModelChoice
  inputAdapter: (input: BaseInput) => Record<string, unknown>
}

interface BaseInput {
  imageUrl: string
  cleanImageUrl: string  // RMBG sonrası
  prompt: string
  shotSize: [number, number]
  manualPlacement: string
}

export const KATEGORI_MODEL_MAP: Record<Kategori, ModelConfig> = {
  giyim: {
    primary: 'fal-ai/flux-pro/kontext',
    fallback: 'fal-ai/bria/product-shot',
    inputAdapter: (i) => ({
      image_url: i.imageUrl,
      prompt: i.prompt,
      // Kontext parameters — Code araştıracak
    }),
  },
  ayakkabi_canta: {
    primary: 'fal-ai/bria/product-shot',
    fallback: 'fal-ai/flux-pro/kontext',
    inputAdapter: (i) => briaInput(i),
  },
  kozmetik: {
    primary: 'fal-ai/bria/product-shot',
    fallback: 'fal-ai/image-apps-v2/product-photography',
    inputAdapter: (i) => briaInput(i),
  },
  taki_aksesuar: {
    primary: 'fal-ai/bria/product-shot',
    fallback: 'fal-ai/flux-pro/kontext',
    inputAdapter: (i) => briaInput(i),
  },
  genel: {
    primary: 'fal-ai/bria/product-shot',
    fallback: 'fal-ai/image-apps-v2/product-photography',
    inputAdapter: (i) => briaInput(i),
  },
}

function briaInput(i: BaseInput) {
  return {
    image_url: i.cleanImageUrl,
    scene_description: i.prompt,
    optimize_description: true,
    num_results: 1,
    fast: true,
    placement_type: 'manual_placement',
    manual_placement_selection: i.manualPlacement,
    shot_size: i.shotSize,
  }
}
```

---

## 5. Post-process (Pass 4)

`lib/fal/post-process.ts`:

```ts
import sharp from 'sharp'

interface PostProcessInput {
  outputUrl: string
  inputAspectRatio: number
  targetMinFillRatio: number  // ürünün frame'i doldurması gereken minimum oran
}

interface PostProcessOutput {
  finalUrl: string
  productFillRatio: number
  aspectRatioPreserved: boolean
}

/**
 * Pass 4 — Sharp ile post-process:
 * 1. Output'u oku
 * 2. Aspect ratio doğrula (input ile uyumlu mu)
 * 3. Eğer ürün <%50 frame → bria/expand veya cropping ile büyüt (opsiyonel)
 * 4. JPEG quality 90 encode + Supabase storage'a yükle
 */
export async function postProcess(input: PostProcessInput): Promise<PostProcessOutput> {
  const response = await fetch(input.outputUrl)
  const buffer = Buffer.from(await response.arrayBuffer())

  const meta = await sharp(buffer).metadata()
  const outputAspect = (meta.width ?? 1) / (meta.height ?? 1)

  // Aspect ratio koruma toleransı (%5)
  const aspectDiff = Math.abs(outputAspect - input.inputAspectRatio) / input.inputAspectRatio
  const aspectRatioPreserved = aspectDiff < 0.05

  // Şimdilik basit: JPEG encode + Supabase'e yükle
  // İleride: bounding box detection + auto crop/expand
  const finalBuffer = await sharp(buffer)
    .jpeg({ quality: 90 })
    .toBuffer()

  // Supabase storage upload (kalıp Code'un mevcut pattern'ini kullansın)
  const finalUrl = await uploadToSupabase(finalBuffer)

  return {
    finalUrl,
    productFillRatio: 0.8,  // Şimdilik tahmin, ileride vision ile ölç
    aspectRatioPreserved,
  }
}
```

**Bağımlılık:** `sharp` paketi yoksa kur:
```bash
npm install sharp
```

---

## 6. Prompt builder

`lib/fal/prompts/index.ts`:

```ts
import type { Kategori } from '../vision-classify'
import { GIYIM_STIL, GIYIM_NEGATIVE } from './giyim'
import { AYAKKABI_STIL, AYAKKABI_NEGATIVE } from './ayakkabi-canta'
import { KOZMETIK_STIL, KOZMETIK_NEGATIVE } from './kozmetik'
import { TAKI_STIL, TAKI_NEGATIVE } from './taki-aksesuar'
import { GENEL_STIL, GENEL_NEGATIVE } from './genel'
import { COMMON_POSITIVE_SUFFIX, COMMON_NEGATIVE_BASE } from './_common'

export const GORSEL_PROMPT_VERSION = 'gorsel-v2.0'

export type Stil = 'beyaz' | 'koyu' | 'lifestyle' | 'mermer' | 'ahsap' | 'gradient' | 'dogal'

const KATEGORI_PROMPTS: Record<Kategori, {
  stiller: Record<Stil, string>
  negative: string
}> = {
  giyim: { stiller: GIYIM_STIL, negative: GIYIM_NEGATIVE },
  ayakkabi_canta: { stiller: AYAKKABI_STIL, negative: AYAKKABI_NEGATIVE },
  kozmetik: { stiller: KOZMETIK_STIL, negative: KOZMETIK_NEGATIVE },
  taki_aksesuar: { stiller: TAKI_STIL, negative: TAKI_NEGATIVE },
  genel: { stiller: GENEL_STIL, negative: GENEL_NEGATIVE },
}

export function buildPrompt({
  kategori,
  stil,
  brandContext,
  ekPrompt,
}: {
  kategori: Kategori
  stil: Stil
  brandContext?: string
  ekPrompt?: string
}): { positive: string; negative: string } {
  const config = KATEGORI_PROMPTS[kategori]
  const basePrompt = config.stiller[stil]

  const positive = [
    basePrompt,
    brandContext,
    COMMON_POSITIVE_SUFFIX,
    ekPrompt && `Ek talep: ${ekPrompt}`,
  ].filter(Boolean).join(', ')

  const negative = `${COMMON_NEGATIVE_BASE}, ${config.negative}`

  return { positive, negative }
}
```

`lib/fal/prompts/giyim.ts` (örnek, diğerleri aynı yapı):

```ts
export const GIYIM_NEGATIVE = `no clothes hanger, no display rack, no hook, no human figure unless explicitly requested, no mannequin unless explicitly requested, no body parts, no extra clothing items, no stacked garments, no folded duplicates, no hallucinated garments, no shadows that imply person wearing it`

export const GIYIM_STIL = {
  beyaz: `flat-lay clothing photography, single garment isolated on solid pure white (#FFFFFF) seamless studio cyclorama background, soft diffused even lighting from all sides, garment fills 80-90% of frame, preserve original fabric texture pattern color and detail, garment laid flat or floating naturally, no model no mannequin no hanger`,
  koyu: `single garment on solid pure black (#000000) seamless studio background, luxury apparel photography, dramatic moody lighting from above, soft subtle contact shadow only, garment fills 75-85% of frame, preserve original fabric and details, no glowing halos, no model no mannequin no hanger`,
  lifestyle: `single garment styled in modern minimalist interior, draped naturally on a wooden bench or marble counter, warm natural daylight from large window, shallow depth of field with softly blurred background featuring neutral decor and subtle greenery, garment as clear hero filling 65-75% of frame, editorial fashion lifestyle photography, no human, no hanger, no mannequin`,
  mermer: `single garment laid elegantly on white marble surface with subtle gray veining, luxury fashion editorial photography, soft overhead studio lighting with gentle reflections, garment fills 70-80% of frame, preserve original fabric details, premium aesthetic, no hanger no model no mannequin`,
  ahsap: `single garment laid on warm natural wood surface with visible grain texture, rustic artisan fashion photography, soft warm directional lighting from the side, shallow depth of field, garment fills 75-85% of frame, handcraft and organic aesthetic, no hanger no model no mannequin`,
  gradient: `single garment floating on smooth modern gradient background transitioning from soft pastel tones, contemporary minimalist fashion photography, even studio lighting, garment fills 80-90% of frame, clean lifestyle brand aesthetic, no hanger no model no mannequin`,
  dogal: `single garment styled in outdoor natural setting with soft sunlight and green foliage in blurred background, draped on a natural stone or wooden surface, shallow depth of field, garment fills 70-80% of frame, fresh and organic fashion photography, no human no hanger no mannequin`,
} as const
```

(Diğer 4 kategori dosyası `docs/gorsel-prompts-v2.md`'den birebir alınacak.)

---

## 7. Frontend — KategoriSelector

`components/uret/KategoriSelector.tsx`:

```tsx
'use client'

import { Shirt, ShoppingBag, Sparkles, Gem, Package } from 'lucide-react'
import { cn } from '@/lib/utils'

export type Kategori = 'giyim' | 'ayakkabi_canta' | 'kozmetik' | 'taki_aksesuar' | 'genel'

const KATEGORILER: { id: Kategori; label: string; icon: any; aciklama: string }[] = [
  { id: 'giyim', label: 'Giyim', icon: Shirt, aciklama: 'Tişört, gömlek, kazak, elbise, pantolon, ceket' },
  { id: 'ayakkabi_canta', label: 'Ayakkabı/Çanta', icon: ShoppingBag, aciklama: 'Ayakkabı, bot, çanta, sırt çantası, cüzdan' },
  { id: 'kozmetik', label: 'Kozmetik/Bakım', icon: Sparkles, aciklama: 'Krem, serum, parfüm, makyaj, şampuan' },
  { id: 'taki_aksesuar', label: 'Takı/Aksesuar', icon: Gem, aciklama: 'Kolye, küpe, yüzük, saat, gözlük' },
  { id: 'genel', label: 'Ev & Diğer', icon: Package, aciklama: 'Mutfak, dekor, elektronik, gıda, hediye' },
]

interface Props {
  value: Kategori | null
  onChange: (k: Kategori) => void
  visionUyumsuz?: { tespit: Kategori; secilen: Kategori } | null
  onUyariOnay?: () => void
  onUyariReddet?: () => void
}

export default function KategoriSelector({ value, onChange, visionUyumsuz, onUyariOnay, onUyariReddet }: Props) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-rd-neutral-700">
        Ürün tipi <span className="text-rd-danger-700">*</span>
      </label>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        {KATEGORILER.map((k) => {
          const Icon = k.icon
          const seçili = value === k.id
          return (
            <button
              key={k.id}
              type="button"
              onClick={() => onChange(k.id)}
              className={cn(
                'flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl border transition-colors',
                seçili
                  ? 'border-rd-primary-700 bg-rd-primary-50 text-rd-primary-700'
                  : 'border-rd-neutral-200 bg-white text-rd-neutral-600 hover:bg-rd-neutral-50',
              )}
              aria-pressed={seçili}
            >
              <Icon size={20} strokeWidth={1.5} />
              <span className="text-xs font-medium text-center leading-tight">{k.label}</span>
            </button>
          )
        })}
      </div>

      {visionUyumsuz && (
        <div className="rounded-xl bg-rd-warning-50 border border-rd-warning-200 p-4">
          <p className="text-sm font-medium text-rd-warning-700 mb-2">
            Yapay zeka bu fotoğrafı &quot;{KATEGORILER.find(k => k.id === visionUyumsuz.tespit)?.label}&quot; olarak tanıdı. Sen ise &quot;{KATEGORILER.find(k => k.id === visionUyumsuz.secilen)?.label}&quot; seçmişsin.
          </p>
          <p className="text-xs text-rd-warning-700 mb-3">Devam edersek sonuç beklediğin gibi olmayabilir.</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onUyariOnay}
              className="text-xs font-medium px-3 py-1.5 rounded-lg bg-rd-warning-700 text-white"
            >
              {KATEGORILER.find(k => k.id === visionUyumsuz.tespit)?.label}'a değiştir
            </button>
            <button
              type="button"
              onClick={onUyariReddet}
              className="text-xs font-medium px-3 py-1.5 rounded-lg bg-white border border-rd-warning-200 text-rd-warning-700"
            >
              Seçimimde kal
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
```

**CLAUDE.md uyumluluk notu:** font-medium ✓, rd-* renkler ✓, rounded-xl ✓, lucide-react ✓ (emoji yok), shadow yok ✓.

---

## 8. Yeni `app/api/gorsel/route.ts` (V2)

Pseudocode:

```ts
import { visionKategoriTespit } from '@/lib/fal/vision-classify'
import { KATEGORI_MODEL_MAP } from '@/lib/fal/product-shot-router'
import { buildPrompt, GORSEL_PROMPT_VERSION } from '@/lib/fal/prompts'
import { rmbgKategoriAware } from '@/lib/fal/rmbg'
import { postProcess } from '@/lib/fal/post-process'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { foto, kategori, stiller, ekPrompt, userId, inputBoyut } = body

  // Validasyon
  if (!kategori) return NextResponse.json({ hata: 'Kategori zorunlu' }, { status: 400 })
  // ... mevcut validasyonlar

  // Feature flag
  const v2Enabled = await isV2Enabled(userId)
  if (!v2Enabled) {
    // Eski pipeline'a yönlendir
    return handleV1Request(body)
  }

  // Brand context (mevcut)
  const profil = await getProfile(userId)
  const brandContext = buildBrandContext(profil)

  try {
    const imageUrl = await fal.storage.upload(...)

    // Pass 1 — Vision classify (paralel başlat, sonucu beklet ya da log)
    const visionPromise = visionKategoriTespit(imageUrl)

    // Pass 2 — Kategori-aware RMBG
    const cleanImageUrl = await rmbgKategoriAware(imageUrl, kategori)

    // Vision sonucu — uyumsuzluk varsa DB'ye logla (kullanıcı zaten önceden uyarıldı)
    const visionResult = await visionPromise
    const visionUyumsuz = visionResult.kategori !== kategori

    // Pass 3 — Her stil için model routing + prompt
    const jobs = await Promise.all(
      stiller.map(async (stil) => {
        const { positive, negative } = buildPrompt({ kategori, stil, brandContext, ekPrompt })
        const config = KATEGORI_MODEL_MAP[kategori]
        const shotSize = computeShotSize(inputBoyut, sosyalFormat)
        const input = config.inputAdapter({ imageUrl, cleanImageUrl, prompt: positive, shotSize, manualPlacement: pozisyonSec(stil) })

        const queued = await fal.queue.submit(config.primary, { input })

        // DB log
        await supabaseAdmin.from('gorsel_uretim').insert({
          request_id: queued.request_id,
          kategori,
          model_kullanilan: config.primary,
          prompt_version: GORSEL_PROMPT_VERSION,
          pipeline_version: 'v2',
          vision_classified_kategori: visionResult.kategori,
          user_kategori_overridden: visionUyumsuz,
          // ...
        })

        return { requestId: queued.request_id, label: stilEtiketleri[stil], stil }
      })
    )

    return NextResponse.json({ jobs, visionUyumsuz, isAdmin })
  } catch (e) {
    // ... mevcut error handling + fallback model dene
  }
}
```

**Pass 4 (post-process)** poll endpoint'inde çalışır — model bitince sonucu Sharp'tan geçir, son URL'yi döndür.

---

## 9. Feature flag `GORSEL_V2`

`lib/feature-flags.ts` (mevcut dosyaya ekle):

```ts
export async function isGorselV2Enabled(userId?: string): Promise<boolean> {
  if (!userId) return false  // anonim kullanıcı V1
  if (process.env.GORSEL_V2_ALL === 'true') return true  // global override

  // Kademeli rollout
  const rolloutPercent = parseInt(process.env.GORSEL_V2_PERCENT ?? '0', 10)
  if (rolloutPercent === 0) return false
  if (rolloutPercent === 100) return true

  // Hash-based deterministic rollout
  const hash = simpleHash(userId)
  return (hash % 100) < rolloutPercent
}
```

`.env.local` ekle:
```
GORSEL_V2_PERCENT=10  # ilk açılışta %10
GORSEL_V2_ALL=false
```

---

## 10. Test stratejisi (Code yapacak)

### Faz 1 — Açık soruları araştır (1 saat)

Code WebFetch ile fal.ai docs'tan şunları doğrulasın:
1. `fal-ai/flux-pro/kontext` — image-to-image input parametreleri
2. `fal-ai/fashn/tryon/v1.5` — flat-lay mode var mı, yoksa try-on only mu
3. `fal-ai/bria/eraser` — specific object erase ("hanger") destekliyor mu
4. `fal-ai/any-llm/vision` veya alternatif vision endpoint
5. `fal-ai/image-apps-v2/product-photography` — bria'dan farkı

Çıktı: `docs/gorsel-models-arastirma-2026-05-XX.md`

### Faz 2 — Implementasyon (2 gün)

1. Migration + database (1 saat)
2. Yeni dosya yapısı + prompt'lar (3 saat)
3. Vision-classify + RMBG kategori-aware (2 saat)
4. Model router + V2 route handler (3 saat)
5. Post-process (Sharp) (2 saat)
6. KategoriSelector UI + frontend integration (3 saat)
7. Feature flag + V1 fallback (1 saat)

### Faz 3 — A/B test (1 gün)

50 test görseli (Aziz toplayacak, kategori başına 10):
- 10 giyim, 10 ayakkabı/çanta, 10 kozmetik, 10 takı, 10 genel
- Her birini V1 + V2'de paralel çalıştır → 100 üretim
- Skor matrisi:
  - Ürün boyutu (frame %)
  - Aspect ratio koruma
  - Askı/extra elemanlar yok mu
  - Sahne kalitesi (1-5)
  - Marka tutarlılığı (1-5)

Çıktı: `docs/gorsel-test-sonuclari-2026-05-XX.md`

### Faz 4 — Rollout

- V2 skoru V1'den **belirgin** üstün → `GORSEL_V2_PERCENT=10` → 1 hafta gözle
- Sentry error rate < %1 + PostHog negative feedback < %10 → `=50` → 3 gün
- Hâlâ iyi → `=100` → V1 deprecate (BACKLOG)

---

## 11. Kabul kriterleri

- [ ] Database migration uygulandı
- [ ] 7 yeni dosya oluşturuldu (vision-classify, router, post-process, 5 prompt dosyası)
- [ ] KategoriSelector UI çalışıyor (CLAUDE.md uyumlu)
- [ ] V2 endpoint kategori parametresi alıyor, doğruluyor
- [ ] Feature flag `GORSEL_V2_PERCENT` çalışıyor
- [ ] V1 endpoint ENV=0'da hâlâ çalışıyor (fallback)
- [ ] PostHog event'lerinde `pipeline_version` + `kategori` + `model_kullanilan` property'leri var
- [ ] Sentry yeni hata yok
- [ ] tsc + build + 27 unit test geçiyor
- [ ] CLAUDE.md UI kuralları (KategoriSelector için: emoji yok, font-medium, rd-* palette, rounded-xl)

## 12. CHANGELOG

```
feat(gorsel): V2 pipeline — kategori bazlı model routing + 4-pass (vision/rmbg/compose/post-process) + 35 prompt template + KategoriSelector UI + feature flag GORSEL_V2_PERCENT
```

## 13. BACKLOG güncelle

| ID | Başlık | Durum |
|---|---|---|
| ~~GORSEL-V2-A~~ | Database migration kategori | ✅ Tamamlandı |
| ~~GORSEL-V2-B~~ | Prompt kütüphanesi 35 template | ✅ Tamamlandı |
| ~~GORSEL-V2-C~~ | Vision classify Pass 1 | ✅ Tamamlandı |
| ~~GORSEL-V2-D~~ | Model router + V2 route | ✅ Tamamlandı |
| ~~GORSEL-V2-E~~ | Sharp post-process Pass 4 | ✅ Tamamlandı |
| ~~GORSEL-V2-F~~ | KategoriSelector UI | ✅ Tamamlandı |
| ~~GORSEL-V2-G~~ | Feature flag GORSEL_V2 | ✅ Tamamlandı |
| GORSEL-V2-H | A/B test 50 görsel + skor (Aziz manuel) | ⏳ Bekliyor |
| GORSEL-V2-I | Rollout %10 → %50 → %100 | ⏳ Bekliyor |

## 14. Deploy

`claude/gorsel-v2-pipeline` → preview merge → Aziz test (3-5 farklı kategori örnek görseli ile) → main merge → `GORSEL_V2_PERCENT=10` → 1 hafta gözle → kademeli artış.
