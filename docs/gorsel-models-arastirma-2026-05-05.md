# yzliste — Görsel V2 Model Araştırması

> **Tarih:** 5 May 2026
> **Yapan:** Code (WebFetch ile fal.ai docs)
> **Bağlam:** `docs/gorsel-code-spec.md` Bölüm 10/Faz 1 — 5 açık soruyu yanıtlar
> **Durum:** TAMAMLANDI — bulgular KATEGORI_MODEL_MAP'i etkiliyor, aşağıda belirtildi

---

## Soru 1: `fal-ai/flux-pro/kontext` — image-to-image parametreleri

### Bulgular

**Evet, image-to-image destekliyor.**

| Parametre | Tür | Zorunlu | Açıklama |
|---|---|---|---|
| `image_url` | string | ✅ Evet | Referans görsel (edit edilecek kaynak) |
| `prompt` | string | ✅ Evet | Metin talimatı |
| `guidance_scale` | float | Hayır | Default 3.5 |
| `aspect_ratio` | enum | Hayır | 9 seçenek: `21:9`, `16:9`, `4:3`, `3:2`, `1:1`, `2:3`, `3:4`, `9:16`, `9:21` |
| `output_format` | enum | Hayır | `jpeg` veya `png` (default jpeg) |
| `num_images` | integer | Hayır | Default 1 |
| `seed` | integer | Hayır | — |
| `safety_tolerance` | integer | Hayır | 1-6 arası, default 2 |
| `enhance_prompt` | boolean | Hayır | — |
| `sync_mode` | boolean | Hayır | — |

**Fiyat:** $0.04/görsel (fal.ai pricing sayfasında doğrulandı — 25 görsel/$1)

### Kritik fark: bria/product-shot vs kontext input

bria/product-shot `shot_size: [width, height]` alıyor. Kontext **`aspect_ratio` string** alıyor (`"4:3"` gibi). `inputAdapter`'da mapping gerekli:

```ts
function aspectRatioToKontextStr(w: number, h: number): string {
  const ratio = w / h
  const presets: [string, number][] = [
    ['1:1', 1], ['4:3', 1.333], ['3:2', 1.5], ['16:9', 1.778],
    ['21:9', 2.333], ['3:4', 0.75], ['2:3', 0.667], ['9:16', 0.5625], ['9:21', 0.429],
  ]
  return presets.sort((a, b) => Math.abs(a[1] - ratio) - Math.abs(b[1] - ratio))[0][0]
}
```

### Etki: HAYIR — KATEGORI_MODEL_MAP değişmiyor

Kontext giyim için primary model olarak kalıyor. Sadece `inputAdapter` implementasyonunda `aspect_ratio` mapping eklenmeli.

---

## Soru 2: `fal-ai/fashn/tryon/v1.5` — flat-lay modu var mı?

### Bulgular

**Hayır. FASHN flat-lay OUTPUT modu YOKTUR.**

| Parametre | Tür | Açıklama |
|---|---|---|
| `model_image` | image | **Zorunlu** — üzerinde kıyafet giydirilecek manken fotoğrafı |
| `garment_image` | image | **Zorunlu** — kıyafet görseli |
| `category` | enum | `tops`, `bottoms`, `one-pieces`, `auto-detect` |
| `mode` | enum | `performance`, `balanced`, `quality` |
| `garment_photo_type` | enum | `flat-lay`, `model-wearing`, `auto-detect` — bu INPUT görsel tipidir, OUTPUT değil |
| `segmentation_free` | boolean | Human parsing toggle |

**`garment_photo_type: "flat-lay"`** → Bu sadece input kıyafet fotoğrafının tipidir (flat-lay çekimli kıyafetle iş yaptığını söyler). Çıktı her zaman manken üzerinde try-on olarak gelir.

**Fiyat:** API sayfasında belirtilmemiş. Strateji belgesinde $0.075/görsel tahmin edilmişti.

### Etki: EVET — KATEGORI_MODEL_MAP değişiyor

**`fashn/tryon/v1.5` giyim kategorisinden tamamen çıkarılmalı.** Bu model standalone kıyafet ürün fotoğrafı üretemez. Pazaryeri listing için manken görseli zorunlu kılması uygunsuz.

**Giyim için güncellenmiş model:**
- Primary: `fal-ai/flux-pro/kontext` ✅ (spec'te zaten vardı)
- Fallback: `fal-ai/bria/product-shot` ✅ (spec'te zaten vardı)
- Kaldırılan: `fal-ai/fashn/tryon/v1.5` ❌

---

## Soru 3: `fal-ai/bria/eraser` — "clothes hanger" silme

### Bulgular

**Hayır. Text-based hedefleme DESTEKLENMIYOR.**

| Parametre | Tür | Zorunlu | Açıklama |
|---|---|---|---|
| `image_url` | string | ✅ Evet | Silinecek obje içeren görsel |
| `mask_url` | string | ✅ Evet | Binary mask — hangi alanın silineceğini belirler |
| `mask_type` | enum | Hayır | `manual` veya `automatic` |
| `preserve_alpha` | boolean | Hayır | Alpha channel koruma |
| `sync_mode` | boolean | Hayır | — |

Metin prompt'u yok. "clothes hanger" yazarak askı sildirmek mümkün değil. Mask üretmek için önce SAM (Segment Anything) gibi ayrı bir segmentasyon modeli çalıştırmak gerekir — bu ekstra maliyet + gecikme demek.

### Etki: EVET — Pass 2 mimarisi değişiyor

**`bria/eraser` Pass 2'den çıkarılmalı.** Mask üretmek pipeline'ı gereksiz karmaşıklaştırır.

**Giyim için yeni Pass 2 stratejisi:**
- Pass 2: Tüm kategoriler için `bria/background/remove` (RMBG) kullanmaya devam et
- Askı sorununu Pass 3'te (kontext) prompt ile çöz — kontext zaten image editing modeli:

```
prompt: "Remove clothes hanger and display rack, show only the garment floating 
naturally or as flat-lay, keep all garment details and fabric texture intact"
```

Bu yaklaşım kontext'in güçlü yönüyle (targeted local edit) örtüşüyor. Ayrı eraser pass'ına gerek yok.

---

## Soru 4: fal.ai vision endpoint

### Bulgular

**`fal-ai/any-llm/vision` DEPRECATED — artık desteklenmiyor.**

Dökümantasyon: "no longer supported" ibaresi var.

fal.ai'ın güncel LLM modelleri incelendi — vision classification için temiz, ucuz, stabil bir endpoint bulunamadı. Önerilen alternatifler:

| Seçenek | Model | Tahmini Maliyet | Durum |
|---|---|---|---|
| **A (Önerilen)** | Anthropic API — `claude-3-haiku-20240307` | ~$0.0004/görsel | ✅ Key zaten projede var |
| B | OpenAI API — `gpt-4o-mini` | ~$0.001/görsel | Key eklenmesi gerekir |
| C (Riskli) | `fal-ai/any-llm/vision` (deprecated) | Bilinmiyor | ❌ Deprecated |

**Seçenek A öneriliyor:** Projenin zaten Anthropic API key'i var. Claude Haiku vision son derece ucuz, hızlı ve güvenilir. Vision-classify kodunda Anthropic SDK kullanılacak şekilde değişiklik gerekiyor.

```ts
// vision-classify.ts — güncellenmiş yaklaşım
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()

export async function visionKategoriTespit(imageUrl: string): Promise<{
  kategori: Kategori
  confidence: number
}> {
  const response = await client.messages.create({
    model: 'claude-3-haiku-20240307',
    max_tokens: 10,
    messages: [{
      role: 'user',
      content: [
        { type: 'image', source: { type: 'url', url: imageUrl } },
        {
          type: 'text',
          text: `Bu fotoğraftaki ürün tipi nedir? Sadece şu 5 kelimeden birini yaz:
giyim / ayakkabi_canta / kozmetik / taki_aksesuar / genel

Tek kelime, başka hiçbir şey yazma.`,
        },
      ],
    }],
  })

  const cevap = (response.content[0] as { text: string }).text.trim().toLowerCase()
  const kategori = (['giyim', 'ayakkabi_canta', 'kozmetik', 'taki_aksesuar', 'genel'] as Kategori[])
    .find(k => cevap.includes(k)) ?? 'genel'

  return { kategori, confidence: 0.9 }
}
```

### Etki: EVET — vision-classify.ts fal.ai yerine Anthropic SDK kullanacak

---

## Soru 5: `fal-ai/image-apps-v2/product-photography` — bria farkı

### Bulgular

**Çok minimal API — custom prompt desteklemiyor.**

| Parametre | Tür | Zorunlu | Açıklama |
|---|---|---|---|
| `product_image_url` | string | ✅ Evet | Ürün görseli |
| `aspect_ratio` | enum | Hayır | `1:1`, `16:9`, `9:16`, `4:3`, `3:4` |

Sadece **2 parametre.** `scene_description`, `prompt`, stil seçimi yok. Tamamen otomatik, 4K çıktı, ticari kullanım lisansı var.

**bria/product-shot ile farkı:**
- bria/product-shot: `scene_description`, `shot_size`, `manual_placement`, `fast` gibi parametreler → stil kontrolü mümkün
- image-apps-v2: Otomatik sahne seçimi → hangi stil üretileceği kontrol edilemiyor

### Etki: KISMİ — kullanım alanı değişiyor

image-apps-v2 stil-agnostik bir fallback olabilir ama 7 stilden birini üretmek için kullanılamaz. Kullanım alanı:
- "Hızlı bir ürün görseli lazım, stil önemli değil" — son çare fallback
- Bria/product-shot başarısız olup kontext da başarısız olursa

**Önerilen:** Fallback olarak kodda bırak ama `scene_description` geçilemediği için üretilen görsel kullanıcının seçtiği stili yansıtmayabilir. Bunu `console.warn` ile logla.

---

## Özet: KATEGORI_MODEL_MAP güncellemeleri

### Değişen kısımlar

| # | Değişiklik | Etki |
|---|---|---|
| 1 | `fashn/tryon/v1.5` giyim'den çıkar | KATEGORI_MODEL_MAP.giyim güncelle |
| 2 | Giyim primary = `flux-pro/kontext` | Zaten spec'te var, onaylandı |
| 3 | `bria/eraser` Pass 2'den çıkar | rmbg.ts değişmez, kontext prompt'u güçlendir |
| 4 | Vision: fal değil → Anthropic Haiku | vision-classify.ts sıfırdan yazılacak |
| 5 | Kontext inputAdapter'a aspect_ratio mapping | product-shot-router.ts'de adapter |
| 6 | image-apps-v2 fallback olarak kalır | son çare, stil kontrolsüz |

### Güncellenmiş KATEGORI_MODEL_MAP

```ts
export const KATEGORI_MODEL_MAP: Record<Kategori, ModelConfig> = {
  giyim: {
    primary: 'fal-ai/flux-pro/kontext',       // ✅ Onaylandı ($0.04)
    fallback: 'fal-ai/bria/product-shot',      // ✅
    // fashn/tryon/v1.5 KALDIRILDI — try-on only, flat-lay output yok
  },
  ayakkabi_canta: {
    primary: 'fal-ai/bria/product-shot',       // ✅ Değişmedi
    fallback: 'fal-ai/flux-pro/kontext',       // ✅
  },
  kozmetik: {
    primary: 'fal-ai/bria/product-shot',       // ✅ Değişmedi
    fallback: 'fal-ai/image-apps-v2/product-photography', // ⚠️ Stil kontrolsüz
  },
  taki_aksesuar: {
    primary: 'fal-ai/bria/product-shot',       // ✅ Değişmedi
    fallback: 'fal-ai/flux-pro/kontext',       // ✅
  },
  genel: {
    primary: 'fal-ai/bria/product-shot',       // ✅ Değişmedi
    fallback: 'fal-ai/image-apps-v2/product-photography', // ⚠️ Stil kontrolsüz
  },
}
```

### Pass 2 (RMBG) güncellemesi

```ts
// Önceki plan: giyim → bria/eraser (hanger specific)
// YENİ PLAN: tüm kategoriler → bria/background/remove (RMBG)
// Giyim'deki askı sorunu → Pass 3 kontext prompt'unda çözülüyor:
//   "Remove any clothes hanger or display rack from the garment..."
```

---

## Maliyet etkisi

| Pass | Model | Maliyet/görsel | Değişiklik |
|---|---|---|---|
| Pass 1 Vision | Anthropic Haiku (vision) | ~$0.0004 | fal → Anthropic |
| Pass 2 RMBG (giyim) | bria/background/remove | Değişmedi | eraser kaldırıldı (tasarruf) |
| Pass 3 Giyim | flux-pro/kontext | $0.04 | Aynı |
| Pass 3 Diğer | bria/product-shot | $0.04 | Aynı |
| **Toplam (ortalama)** | | **~$0.041** | Tasarruf |

---

## Aziz için aksiyon önerileri

1. **FASHN kaldırma onayı:** `fashn/tryon/v1.5` pipeline'dan çıkarılıyor. Onaylıyor musun?
2. **Askı çözümü onayı:** Ayrı eraser pass yerine kontext prompt'u ile askı silme yaklaşımını onaylıyor musun?
3. **Vision API:** Anthropic Haiku kullanımını onaylıyor musun? (key zaten var, ekstra maliyet ihmal edilebilir ~$0.0004/görsel)
4. **Implementasyona geçiş:** Bulgular belgeye işlendi. Onay gelirse Faz 2'ye başlanabilir.

---

*Araştırma tamamlandı. `docs/gorsel-code-spec.md` Bölüm 10/Faz 1 kapatıldı.*
