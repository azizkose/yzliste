# yzliste — Görsel V2 Prompt Kütüphanesi

> **Versiyon:** v2.0 (5 May 2026)
> **Strateji belgesi:** `docs/gorsel-strateji-2026-05-05.md`
> **Yapı:** 5 kategori × 7 stil = 35 prompt + her kategori için negatif prompt + ortak kurallar

---

## Ortak kurallar (tüm prompt'lara dahil)

```
COMMON_POSITIVE_SUFFIX = "professional e-commerce product photography, marka tutarlılığı, high resolution, sharp focus on product, accurate color reproduction, brand-appropriate aesthetic"

COMMON_NEGATIVE_BASE = "no distortion, no aspect ratio stretching, no extra products, no duplicates, no hallucinated objects, no watermark, no text overlay unless on product itself, no color halos, no glowing effects, no fake shadows, no body parts unless requested, no reflections that don't make sense"
```

Her prompt builder fonksiyonunda otomatik append edilir.

---

## 1. GİYİM (giyim)

### Negatif prompt (giyim-spesifik)
```
no clothes hanger, no display rack, no hook, no human figure unless explicitly requested, no mannequin unless explicitly requested, no body parts, no extra clothing items, no stacked garments, no folded duplicates, no hallucinated garments, no shadows that imply person wearing it
```

### 7 stil prompt

| Stil | Prompt |
|---|---|
| **beyaz** | `flat-lay clothing photography, single garment isolated on solid pure white (#FFFFFF) seamless studio cyclorama background, soft diffused even lighting from all sides, garment fills 80-90% of frame, preserve original fabric texture pattern color and detail, garment laid flat or floating naturally, no model no mannequin no hanger` |
| **koyu** | `single garment on solid pure black (#000000) seamless studio background, luxury apparel photography, dramatic moody lighting from above, soft subtle contact shadow only, garment fills 75-85% of frame, preserve original fabric and details, no glowing halos, no model no mannequin no hanger` |
| **lifestyle** | `single garment styled in modern minimalist interior, draped naturally on a wooden bench or marble counter, warm natural daylight from large window, shallow depth of field with softly blurred background featuring neutral decor and subtle greenery, garment as clear hero filling 65-75% of frame, editorial fashion lifestyle photography, no human, no hanger, no mannequin` |
| **mermer** | `single garment laid elegantly on white marble surface with subtle gray veining, luxury fashion editorial photography, soft overhead studio lighting with gentle reflections, garment fills 70-80% of frame, preserve original fabric details, premium aesthetic, no hanger no model no mannequin` |
| **ahsap** | `single garment laid on warm natural wood surface with visible grain texture, rustic artisan fashion photography, soft warm directional lighting from the side, shallow depth of field, garment fills 75-85% of frame, handcraft and organic aesthetic, no hanger no model no mannequin` |
| **gradient** | `single garment floating on smooth modern gradient background transitioning from soft pastel tones, contemporary minimalist fashion photography, even studio lighting, garment fills 80-90% of frame, clean lifestyle brand aesthetic, no hanger no model no mannequin` |
| **dogal** | `single garment styled in outdoor natural setting with soft sunlight and green foliage in blurred background, draped on a natural stone or wooden surface, shallow depth of field, garment fills 70-80% of frame, fresh and organic fashion photography, no human no hanger no mannequin` |

---

## 2. AYAKKABI/ÇANTA (ayakkabi_canta)

### Negatif prompt
```
no human feet inside shoes, no human body, no extra shoes unless pair, no duplicates, no shoeboxes unless explicitly requested, no shopping bags unless product is bag, no hallucinated accessories
```

### 7 stil prompt

| Stil | Prompt |
|---|---|
| **beyaz** | `single shoe or bag isolated on solid pure white (#FFFFFF) seamless studio cyclorama background, soft diffused even lighting, product centered and filling 75-85% of frame, very subtle contact shadow beneath, preserve original material texture and stitching detail, professional e-commerce footwear and accessory photography` |
| **koyu** | `single shoe or bag on solid pure black (#000000) seamless studio background, luxury footwear or accessory photography, soft overhead spotlight, subtle contact shadow, product fills 70-80% of frame, preserve original material and hardware details, premium aesthetic, no glowing halos` |
| **lifestyle** | `single shoe or bag styled in modern minimalist interior, placed on wooden console or marble shelf with neutral decor, warm natural daylight, shallow depth of field with blurred background, product fills 60-70% of frame, editorial lifestyle photography, no human` |
| **mermer** | `single shoe or bag on white marble surface with subtle gray veining, luxury accessory photography, soft overhead studio lighting with gentle reflections on marble, product fills 70-80% of frame, premium fashion aesthetic` |
| **ahsap** | `single shoe or bag on warm natural wood surface with visible grain, rustic artisan accessory photography, soft warm directional lighting from side, shallow depth of field, product fills 75-85% of frame, handcraft aesthetic` |
| **gradient** | `single shoe or bag on smooth modern gradient background with soft pastel tones, contemporary minimalist photography, even studio lighting, product fills 80-90% of frame, clean tech and lifestyle brand aesthetic` |
| **dogal** | `single shoe or bag in outdoor natural setting with soft sunlight and green foliage in blurred background, placed on natural stone or wooden surface, shallow depth of field, product fills 70-80% of frame, fresh and organic photography` |

---

## 3. KOZMETİK/BAKIM (kozmetik)

### Negatif prompt
```
no human hand unless holding the product purposefully, no duplicates, no extra cosmetics, no medical claims visible in scene, no hallucinated label text changes, preserve original packaging and label exactly
```

### 7 stil prompt

| Stil | Prompt |
|---|---|
| **beyaz** | `single cosmetic or skincare product on solid pure white (#FFFFFF) seamless studio background, clean beauty product photography, soft diffused even lighting, product centered filling 65-75% of frame, subtle contact shadow, preserve original label text and packaging colors, sharp focus on label, professional e-commerce beauty photography` |
| **koyu** | `single cosmetic product on solid pure black (#000000) seamless background, luxury beauty editorial photography, soft top lighting, product fills 60-70% of frame, preserve label and packaging exactly, premium aesthetic with subtle highlights on glass or plastic surface` |
| **lifestyle** | `single beauty product in modern bathroom or vanity setting, placed on marble counter or wooden tray with subtle skincare ritual elements like rolled towel or eucalyptus sprig, warm natural light, shallow depth of field with softly blurred background, product fills 50-60% of frame, editorial beauty lifestyle photography, no human face, preserve original label` |
| **mermer** | `single beauty product on white marble surface with subtle gray veining, luxury beauty editorial, soft overhead studio lighting with gentle marble reflections, product fills 65-75% of frame, premium spa and skincare aesthetic` |
| **ahsap** | `single beauty product on warm natural wood surface with visible grain, organic and natural beauty aesthetic, soft warm directional lighting, shallow depth of field, product fills 70-80% of frame, artisan and clean beauty vibe` |
| **gradient** | `single beauty product on smooth modern gradient background with soft pastel beauty tones, contemporary minimalist beauty photography, even studio lighting, product fills 75-85% of frame, clean modern brand aesthetic` |
| **dogal** | `single beauty product in outdoor natural setting with soft sunlight and green foliage softly blurred, placed on natural stone, shallow depth of field, product fills 65-75% of frame, organic and natural beauty photography` |

---

## 4. TAKI/AKSESUAR (taki_aksesuar)

### Negatif prompt
```
no human hand or body part unless model wearing for scale, no duplicates, no extra jewelry, no hallucinated stones or details, preserve original metal color and gemstone exactly, no fake reflections, sharp macro detail
```

### 7 stil prompt

| Stil | Prompt |
|---|---|
| **beyaz** | `single jewelry piece or accessory on solid pure white (#FFFFFF) seamless studio background, macro jewelry photography with shallow depth of field, soft diffused lighting that highlights metal shine and gemstone clarity, product centered filling 50-70% of frame depending on size, subtle contact shadow, professional luxury accessory photography, sharp focus on details` |
| **koyu** | `single jewelry piece on solid pure black (#000000) seamless background, luxury jewelry editorial macro photography, soft directional lighting that emphasizes metal shine and gem brilliance, product fills 50-65% of frame, preserve metal color exactly (gold, silver, rose gold), no glowing artifacts` |
| **lifestyle** | `single jewelry piece in modern minimalist setting, placed on velvet tray or marble vanity with subtle decorative elements, warm soft lighting, shallow macro depth of field, product fills 55-70% of frame, editorial luxury accessory photography, no human` |
| **mermer** | `single jewelry piece on white marble surface with subtle gray veining, luxury jewelry editorial, soft overhead lighting that highlights gemstones, macro depth of field, product fills 60-75% of frame, premium aesthetic` |
| **ahsap** | `single jewelry piece on warm natural wood surface, artisan and handmade jewelry photography, soft warm directional lighting, macro depth of field with blurred wood grain background, product fills 60-75% of frame, handcraft aesthetic` |
| **gradient** | `single jewelry piece on smooth modern gradient background with soft pastel tones, contemporary minimalist accessory photography, soft even lighting that highlights metal and stones, product fills 65-80% of frame, clean modern brand aesthetic` |
| **dogal** | `single jewelry piece on natural stone or moss with soft sunlight, organic accessory photography with macro depth of field, blurred green foliage background, product fills 60-75% of frame, fresh and earthy aesthetic` |

---

## 5. EV & DİĞER (genel)

### Negatif prompt
```
no duplicates, no extra products, no hallucinated objects, preserve original product shape and color, no fake details, no human unless product is interactive (toy held by hand etc.)
```

### 7 stil prompt

| Stil | Prompt |
|---|---|
| **beyaz** | `single product on solid pure white (#FFFFFF) seamless studio cyclorama background, soft diffused even lighting from all sides, product centered filling 70-85% of frame, very subtle contact shadow, preserve original product color shape and material, professional e-commerce product photography` |
| **koyu** | `single product on solid pure black (#000000) seamless studio background, luxury product photography, soft overhead lighting, product fills 65-80% of frame, subtle contact shadow, preserve original product details, no glowing halos or color shifts` |
| **lifestyle** | `single product in modern minimalist interior setting, placed on appropriate surface (table for kitchenware, shelf for decor, desk for electronics), warm natural daylight, shallow depth of field with softly blurred background, product fills 55-70% of frame, editorial lifestyle product photography` |
| **mermer** | `single product on white marble surface with subtle gray veining, clean luxury product photography, soft overhead studio lighting with gentle marble reflections, product fills 65-80% of frame, premium aesthetic` |
| **ahsap** | `single product on warm natural wood surface with visible grain texture, rustic and organic product photography, soft warm directional lighting from side, shallow depth of field, product fills 70-85% of frame, handcraft and artisan aesthetic` |
| **gradient** | `single product on smooth modern gradient background transitioning from soft pastel tones, contemporary minimalist product photography, even studio lighting, product fills 75-90% of frame, clean tech and lifestyle brand aesthetic` |
| **dogal** | `single product in outdoor natural setting with soft sunlight and green foliage softly blurred in background, placed on natural stone or wooden surface, shallow depth of field, product fills 65-80% of frame, fresh and organic product photography` |

---

## Çiçek/Buket alt-türü (genel kategorinin parçası)

Çiçeksepeti'ne özel bağlam: Eğer kullanıcı **çiçek/buket** ürünü yüklerse ve kategori "genel" seçtiyse, vision Pass 1 bunu tespit edebilir. Bu durumda prompt suffix:

```
[BASE_PROMPT] + ", floral arrangement photography, preserve flower colors and freshness, soft natural petal detail, no wilted flowers, no extra bouquets"
```

---

## Brand context injection

Her prompt'a profile'dan gelen brand bilgisi eklenir:

```ts
const brandSuffix = [
  profil.marka_adi && `brand: ${profil.marka_adi}`,
  profil.ton && TON_EN_MAP[profil.ton],
  profil.hedef_kitle && `targeted at: ${profil.hedef_kitle}`,
  profil.fiyat_bandi && `price segment: ${profil.fiyat_bandi}`,
].filter(Boolean).join(', ')

const finalPrompt = `${KATEGORI_STIL_PROMPT}, ${brandSuffix}, ${COMMON_POSITIVE_SUFFIX}`
```

## Kullanıcı `ekPrompt` injection

Kullanıcı isteğe bağlı ek prompt yazarsa **sonuna** eklenir:

```ts
const finalPrompt = ekPrompt
  ? `${BASE_PROMPT}. Ek talep: ${ekPrompt}`
  : BASE_PROMPT
```

## Versiyon takibi

```ts
export const GORSEL_PROMPT_VERSION = "gorsel-v2.0"
```

Her üretimde PostHog event'inde `prompt_version` property olarak gönderilir (MON-04 pattern).
