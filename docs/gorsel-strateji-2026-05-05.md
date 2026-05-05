# yzliste — Görsel Üretim Stratejisi (5 May 2026)

> **Yazan:** Cowork (Aziz onaylayacak)
> **Status:** TASLAK v1 — Code'a verilmeden önce Aziz onayı gerekli
> **Hedef:** Görsel üretim kalitesini "küsen kullanıcı geri gelmez" standardına çıkar

## 1. Kararlar (Aziz ile mutabık kalınan)

| Karar | Değer |
|---|---|
| Hedef kitle | Bilinmiyor — pre-traffic, PostHog ile öğreneceğiz |
| Bütçe | Kalite > maliyet ($0.05/görsel kabul) |
| Süre | 3-5 günlük doğru sprint |
| Kategori UX | **Kullanıcı zorunlu seçer + biz vision ile sessizce doğrularız** |
| Model stratejisi | **Kategori bazlı routing — her kategoride en iyi model** |
| Test stratejisi | Yol A — hipotez sonra Code A/B test |

## 2. Sorun analizi (mevcut sistem)

Mevcut: Tek model (`fal-ai/bria/product-shot`) tüm kategoriler için. Aziz testlerinde 3 problem:

- **Bug 2A:** Ürün küçük çıkıyor (input dikey kıyafet → output kare içinde %15)
- **Bug 2B:** Aspect ratio bozuluyor (stretching)
- **Bug 2C:** Askı silinmiyor (RMBG kıyafet+askıyı tek nesne görüyor)
- **+ yeni bulgu:** AI ekstra ürün hayal ediyor (istif kazaklar)

**Kök sebep:** bria/product-shot küçük/kompakt ürünler (kozmetik şişesi, takı, ayakkabı) için tasarlanmış. Kıyafet + soft fabric + askıda asılı ürünler için yetersiz. Prompt mühendisliği ile çözülmez.

## 3. Kategori taksonomisi (5 ana kategori)

Kullanıcı /uret görsel sekmesinde **dropdown'dan zorunlu seçim** yapar. Vision AI arka planda doğrular.

| ID | Kategori | Örnek ürünler | Pazaryeri ağırlığı |
|---|---|---|---|
| **giyim** | Giyim | tişört, gömlek, kazak, elbise, pantolon, ceket, etek | Trendyol, Hepsi, Etsy moda |
| **ayakkabi_canta** | Ayakkabı/Çanta | ayakkabı, bot, çanta, sırt çantası, cüzdan | Trendyol, Amazon, Etsy |
| **kozmetik** | Kozmetik/Bakım | krem, serum, parfüm, makyaj, şampuan | Trendyol, Hepsi, Amazon |
| **taki_aksesuar** | Takı/Aksesuar | kolye, küpe, yüzük, saat, gözlük, anahtarlık | Etsy handmade, Amazon, Trendyol |
| **genel** | Ev & Diğer | mutfak, dekor, elektronik, gıda, oyuncak, hediye | Hepsi, Amazon, Çiçeksepeti |

**Not:** Çiçeksepeti'nde çiçek/buket varsa "**genel**" kategorisi yeterli (bria/product-shot lifestyle bağlamında iyi sonuç verir). Özel "çiçek" kategorisi gerekmiyor.

## 4. Kategori × Model matrisi

fal.ai'da **gerçek mevcut modeller** (5 May 2026 araştırması):

| Model | Maliyet | Güçlü yönü | Zayıf yönü |
|---|---|---|---|
| `fal-ai/bria/product-shot` | $0.04/görsel | Kompakt ürünler, sahne kompozisyon | Kıyafet, askı, soft fabric |
| `fal-ai/image-apps-v2/product-photography` | bilinmiyor | Genel ürün fotoğrafı (yeni model) | API parametreleri sınırlı |
| `fal-ai/fashn/tryon/v1.5` | $0.075/görsel | Top/bottom/one-piece, %95+ doğruluk | Sadece try-on (model üzerinde), düz çekim değil |
| `fal-ai/flux-pro/kontext` | $0.04/görsel | İmage editing, garment isolation | Specific bilgi yok |
| `fal-ai/flux-pro/kontext/max/multi` | $0.08/görsel | Multi-image, premium kalite | Pahalı |
| `openai/gpt-image-2` | $0.01-0.41/görsel | Logo/text accuracy, brand consistency | Pahalı (HD), label/packaging odaklı |
| `fal-ai/nano-banana-pro` | $0.08/görsel | Semantic reasoning, character consistency | Pahalı |
| `seedream` | $0.03-0.04/görsel | Cost-sensitive prod pipelines | Daha az kontrollü |
| `fal-ai/bria/genfill` | bilinmiyor | Object addition, transformation | General-purpose |
| `fal-ai/bria/eraser` | bilinmiyor | Specific object removal (askı için) | Sadece erase |
| `fal-ai/bria/expand` | bilinmiyor | Outpainting (ürün küçük kalıyorsa frame büyütme) | Specific |
| `fal-ai/bria/background/remove` (mevcut) | bilinmiyor | RMBG, ürün izolasyonu | Askı dahil siliyor — sorun |

### Önerilen kategori × model eşleşmesi (HIPOTEZ — Code test edecek)

| Kategori | Primary model | Fallback | Gerekçe |
|---|---|---|---|
| **giyim** | `fashn/tryon/v1.5` (flat-lay mode) **veya** `flux-pro/kontext` | `bria/product-shot` | FASHN flat-lay kıyafet için tasarlandı, garment detail koruyor. Kontext alternatif. |
| **ayakkabi_canta** | `bria/product-shot` + custom prompt | `flux-pro/kontext` | bria ayakkabı/çanta gibi rigid forma iyi, tek sorun olabilir prompt detail |
| **kozmetik** | `bria/product-shot` (mevcut) | `gpt-image-2` (label accuracy) | Mevcut zaten iyi çalışıyor. GPT premium fallback. |
| **taki_aksesuar** | `bria/product-shot` makro mode | `flux-pro/kontext` (detail edit) | Takı küçük detay, makro lighting şart |
| **genel** | `bria/product-shot` (mevcut) | `seedream` (cost-effective) | Genel ürün için bria yeterli |

**Kritik not:** FASHN tryon **try-on** modeli — yani kıyafeti modelin üzerine giydirir. **flat-lay** modu var mı netleştirilmeli — Code WebFetch ile fal.ai docs'tan parametre detayını alacak. Eğer flat-lay yoksa giyim için **flux-pro/kontext** primary olur.

## 5. Pipeline mimarisi (4-pass)

Her görsel üretim çağrısı şu 4 aşamadan geçer:

```
[Kullanıcı: foto + kategori + stil seçer]
         ↓
[Pass 1: Vision kategori doğrulama]
   ↓ %85+ uyumlu → devam
   ↓ <%85 uyumlu → kullanıcıya uyarı + override seçeneği
         ↓
[Pass 2: Smart background remove]
   ├─ giyim → bria/eraser (askı + mannequin specific)
   ├─ ayakkabi_canta → bria/background/remove (mevcut)
   ├─ kozmetik → bria/background/remove (mevcut)
   ├─ taki_aksesuar → bria/background/remove + edge enhancement
   └─ genel → bria/background/remove (mevcut)
         ↓
[Pass 3: Compose — kategori × stil prompt + doğru model]
   └─ Model routing (yukarıdaki matriks)
   └─ Stil-spesifik prompt (35 template)
   └─ shot_size = inputAspectRatio'dan dinamik
   └─ num_results: 1, manual_placement, fast: true
         ↓
[Pass 4: Sharp post-process — boyut & oran garantisi]
   ├─ Output'u oku (server-side)
   ├─ Eğer ürün <%50 frame → bria/expand veya cropping ile büyüt
   ├─ Aspect ratio doğrula (input ile uyumlu)
   ├─ JPEG encode (quality: 90)
   └─ Supabase storage'a yükle
         ↓
[Kullanıcıya sonuç döndür]
```

### Pass 1 — Vision kategori doğrulama detayı

`gpt-image-2` (text-only, ucuz) veya `gemini-flash-vision` ile:

```ts
prompt: `Bu fotoğrafta ne tür bir ürün var?
Sadece şu 5 kategoriden birini söyle: giyim, ayakkabi_canta, kozmetik, taki_aksesuar, genel.
Tek kelime cevap.`
```

Eğer cevap kullanıcı seçimiyle ≠ uyumsuz → uyarı banner.

### Pass 4 — Sharp post-process detayı

```ts
import sharp from 'sharp'

const meta = await sharp(outputBuffer).metadata()
// Bounding box detect (vision veya alpha channel)
// Eğer ürün <%50 → expand ile büyüt
// Aspect ratio assert
// JPEG quality 90 encode
```

## 6. Prompt kütüphanesi (35 template)

5 kategori × 7 stil = 35 prompt. Her birinde:
- Pozitif: ürünün korunması, sahne, lighting, kompozisyon
- Negatif: hallucination, askı, mannequin, extra products, distortion

### Pattern (giyim × beyaz örneği)

```
POZİTİF:
flat-lay or hanging clothing photography, single garment isolated,
solid pure white (#FFFFFF) seamless studio cyclorama background,
soft diffused even lighting, garment fills 80-90% of frame,
preserve original garment fabric texture pattern color and detail,
professional e-commerce apparel photography, no model no mannequin

NEGATİF:
no clothes hanger, no display rack, no human figure, no extra clothing,
no stacked items, no duplicates, no hallucinated garments,
no aspect ratio distortion, no body parts, no shadows that imply person
```

### Tüm 35 prompt template Code prompt'unun ekinde verilecek.

## 7. UI/UX değişiklikleri

### /uret görsel sekmesi yeni akış

```
┌─ Foto yükle ─────────────────────────────┐
│ [Foto seçici]                            │
└──────────────────────────────────────────┘

┌─ Ürün tipi (zorunlu) ────────────────────┐
│ ▼ Seç                                    │
│   ◯ Giyim                                │
│   ◯ Ayakkabı/Çanta                       │
│   ◯ Kozmetik/Bakım                       │
│   ◯ Takı/Aksesuar                        │
│   ◯ Ev & Diğer                           │
└──────────────────────────────────────────┘
[Eğer vision uyumsuz tespit ederse:]
┌─ Uyarı ──────────────────────────────────┐
│ ⚠ Bu fotoğraf ayakkabı gibi görünüyor.  │
│ "Giyim" seçimini doğrular mısın?         │
│ [Ayakkabı'ya değiştir] [Devam et]       │
└──────────────────────────────────────────┘

┌─ Stil seç ───────────────────────────────┐
│ [Beyaz] [Koyu] [Lifestyle] [Mermer]      │
│ [Ahşap] [Gradient] [Doğal]               │
└──────────────────────────────────────────┘

[Üret butonu]
```

## 8. Maliyet analizi

| Kategori | Görsel başı maliyet | Kullanıcı kredisi | Marj |
|---|---|---|---|
| giyim (FASHN/Kontext) | $0.04-0.08 | 1 kredi (~$0.15) | %47-72 |
| ayakkabi_canta (bria) | $0.04 | 1 kredi | %72 |
| kozmetik (bria) | $0.04 | 1 kredi | %72 |
| taki_aksesuar (bria) | $0.04 | 1 kredi | %72 |
| genel (bria) | $0.04 | 1 kredi | %72 |
| **+ Pass 1 vision** | $0.001 | dahil | NA |
| **+ Pass 4 sharp** | $0 (server) | dahil | NA |
| **Ortalama** | $0.045 | 1 kredi | %70 |

**Karar:** Mevcut **1 kredi/görsel** modeli korunabilir. Marj sağlıklı. Giyim kategorisinde FASHN $0.075 ise marj %50 — yine de pozitif.

## 9. Test stratejisi (Yol A — hipotez sonra Code A/B test)

### Aziz/Cowork görevi (yapılan)
- Strateji + hipotez (bu belge)

### Code görevi (sonraki sprint)
- Her kategori için 10 test görseli topla (toplam 50)
- Her test görselini **2 model**'de paralel çalıştır (primary + fallback)
- 7 stil × 50 görsel × 2 model = 700 üretim ($30-50 maliyet)
- Sonuçları manuel skorla (Aziz veya Code, GPT vision ile otomatik):
  - Ürün boyutu (frame'in %X'i)
  - Aspect ratio koruma
  - Askı/extra elemanların varlığı
  - Sahne kalitesi (1-5)
  - Marka tutarlılığı (1-5)
- Toplam skor en yüksek model **primary** olur
- Eğer skor yakınsa → maliyet faktörü tiebreaker

### Çıktı: `docs/gorsel-test-sonuclari-2026-05-XX.md`

## 10. Code refactor planı

### Yeni dosya yapısı

```
lib/fal/
├── rmbg.ts (mevcut, kategori-aware olacak)
├── vision-classify.ts (YENİ — Pass 1)
├── product-shot-router.ts (YENİ — kategori → model routing)
├── post-process.ts (YENİ — Pass 4 Sharp)
└── prompts/
    ├── giyim.ts (7 stil)
    ├── ayakkabi-canta.ts
    ├── kozmetik.ts
    ├── taki-aksesuar.ts
    └── genel.ts
```

### Mevcut dosyalar
- `app/api/gorsel/route.ts` — refactor (router pattern)
- `app/api/gorsel/poll/route.ts` — kategori-aware polling
- `lib/hooks/useGorselUretim.ts` — kategori parametresi ekle
- `components/uret/GorselSekmesi.tsx` — kategori dropdown ekle (varsa)
- Database — `gorsel_uretim` tablosuna `kategori`, `model_kullanilan` sütunları (PostHog için kritik)

### Migration sırası
1. Pass 1 vision-classify — ekle, ama kullanıcıya gösterme (silent)
2. Kategori dropdown UI — frontend
3. Database migration
4. Pass 2 kategori-aware RMBG
5. Pass 3 model routing + prompt kütüphanesi
6. Pass 4 Sharp post-process
7. Feature flag `GORSEL_V2` → %10 kullanıcıya aç
8. PostHog metrik karşılaştırma (V1 vs V2 başarı oranı, kullanıcı feedback)
9. %50 → %100 rollout

### Rollback kriterleri
- V2 başarı oranı < V1 → otomatik %10 → %0
- Sentry error rate V2'de %2'den fazla → durdur
- Kullanıcı feedback (👎) V2 > V1 → durdur

## 11. Açık sorular (Code araştıracak)

Bu hipotezler doğrulanmalı, Code 1. günde:

1. **FASHN tryon flat-lay mode var mı?** Yoksa giyim için flux-pro/kontext primary olur.
2. **bria/eraser ile "clothes hanger" specific erase yapılabiliyor mu?** API parametresi var mı?
3. **bria/expand outpainting kullanıcı kredisini etkiler mi?** Yoksa post-process serbest mi?
4. **GPT Image 2'nin product photography modu hangi parametrelerle çağrılıyor?** Ucuz tier ($0.01) yeterli mi yoksa HD ($0.08+) şart mı?
5. **fal-ai/image-apps-v2/product-photography** yeni model mevcut bria'dan farklı mı? API farkı?

## 12. Kabul kriterleri (V2 başarılı sayılır)

- Aziz'in test görsellerinde:
  - Ürün frame'in %70+'ını dolduruyor
  - Aspect ratio bozulması <%5
  - Askı/extra elemanlar yok
  - Hallucination yok (extra ürünler, sahte detaylar)
- 50 test görseli üzerinde:
  - %85+ "iyi" skor (5/5 üzerinden 4+)
- Maliyet: ortalama $0.05/görsel altında
- Hız: P95 < 30 saniye

## 13. Sıradaki adımlar

| # | Sahip | İş | Süre |
|---|---|---|---|
| 1 | Aziz | Bu belgeyi onayla / değişiklik öner | 30 dk |
| 2 | Cowork | Kabul → Code prompt'u yaz (kapsamlı, 6-8 ticket) | 1 saat |
| 3 | Code | 11. bölümdeki açık soruları araştır + raporla | 1 saat |
| 4 | Aziz + Cowork | Hipotez güncelle (gerekirse) | 30 dk |
| 5 | Code | Pipeline implement (Pass 1-4) | 2-3 gün |
| 6 | Code | 50 test görseli A/B test | 1 gün |
| 7 | Aziz | Test sonuçlarını skorla | 2 saat |
| 8 | Cowork + Code | Final tuning + feature flag rollout | 1 gün |

**Toplam: 5-6 iş günü.**

---

## Eklenti A — 35 prompt template

(Kabul sonrası Code prompt'unun ekinde verilecek)

## Eklenti B — Code refactor spec

(Kabul sonrası ayrı bir doküman olarak yazılacak — `docs/gorsel-code-spec-2026-05-XX.md`)

---

**Son not (Cowork):** Bu strateji "doğru tasarım" üzerine kuruldu. Acelecilik değil, ampirik test. 5-6 iş günü uzun gibi görünebilir ama 4. tur bug raporu yerine 1 başarılı launch çok daha değerli.
