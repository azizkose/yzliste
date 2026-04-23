# yzliste · Design Tokens

**Versiyon:** v2 · Nisan 2026
**Durum:** Kilitli. 6 ay sonra dönüşüm verisiyle gözden geçirilecek.
**Kullanım:** Tüm UI ticketlarında bu dosya referans alınır. Kod değişikliklerinde burada olmayan bir renk/font kullanılmaz.

---

## 1. Renk paleti

### Primary — Deep Trust Blue
Ana marka rengi. CTA butonlar, linkler, aktif durum, marka vurgusu.

| Stop | Hex | Kullanım |
|------|-----|----------|
| 50 | `#F0F4FB` | En açık zemin, subtle info kutuları |
| 100 | `#BAC9EB` | Açık zemin, rozet arka planı |
| 300 | `#7B9BD9` | Border hover, disabled state |
| **500** | **`#1E4DD8`** | **Ana marka rengi — butonlar, linkler, aktif** |
| 700 | `#163B9E` | Hover state, pressed |
| 900 | `#0E2558` | Koyu zeminlerde, dark mode primary |

### Accent — Warm Earth
**Sadece premium konteksti** — Yzstudio rozeti, Pro/Enterprise seviyeler, özel etiketler. Her yerde kullanılmaz — kullanımı seyrek olduğu için etkili kalır.

| Stop | Hex | Kullanım |
|------|-----|----------|
| 50 | `#FAF4ED` | Premium rozet arka planı |
| 100 | `#EED8BD` | Premium vurgu zemini |
| 300 | `#D4A87A` | Premium border, ince vurgu |
| **500** | **`#A87847`** | **Ana accent — Yzstudio butonu, premium badge** |
| 700 | `#7D5630` | Premium hover state |
| 900 | `#3D2710` | Koyu zeminde premium metin |

### Neutral — Warm Gray
Siyah/beyaz yerine sıcak gri. Steril teknoloji değil, sıcak ama pro.

| Token | Hex | Kullanım |
|-------|-----|----------|
| bg | `#FAFAF8` | Sayfa arka planı |
| surface | `#F1F0EB` | Kart alt zemini, metrik kartlar |
| border | `#D8D6CE` | 1px border, ayırıcılar |
| muted | `#908E86` | Disabled metin, hint |
| secondary | `#5A5852` | İkincil metin, açıklama |
| primary | `#1A1A17` | Ana metin, başlık (pure black değil) |

### Semantik renkler
Sadece durum için. Dekoratif kullanılmaz.

| Durum | Text | Bg | Kullanım |
|-------|------|-----|----------|
| success | `#0F5132` | `#E8F5EE` | Başarı mesajı, onay |
| warning | `#8B4513` | `#FEF4E7` | Dikkat, yumuşak uyarı |
| danger | `#7A1E1E` | `#FCECEC` | Hata, kritik uyarı |
| info | `#0E2558` | `#EBF1FB` | Bilgi, nötr not |

---

## 2. Tipografi

### Font yükleme (Next.js)

```tsx
// app/layout.tsx
import { Inter, Inter_Display } from 'next/font/google'

const inter = Inter({
  subsets: ['latin', 'latin-ext'], // latin-ext Türkçe karakterler için
  variable: '--font-inter',
  display: 'swap',
})

// Inter Display ayrıca: başlıklar için optik olarak düzeltilmiş
```

> **Not:** Geist'ten Inter'e geçiş bir değişiklik. Önceki Geist font import'u kaldırılır.

### Ölçekler

| Kullanım | Boyut / Ağırlık | Tracking | Line-height |
|----------|-----------------|----------|-------------|
| Display (hero) | 32 / 500 | -0.02em | 1.2 |
| H1 (sayfa) | 22 / 500 | -0.01em | 1.3 |
| H2 (bölüm) | 18 / 500 | 0 | 1.4 |
| H3 (kart) | 15 / 500 | 0 | 1.4 |
| Body | 15 / 400 | 0 | 1.6 |
| Caption | 13 / 400 | 0 | 1.5 |
| Mono (kredi, sayı) | 13 / 400 | 0 | 1.4 |

### Ağırlık kuralı
**Sadece 400 (regular) ve 500 (medium).** 600 ve 700 kullanılmaz — heavy durur, amatör hissi verir.

### Case kuralı
Sentence case: "Listing metni" olur. Title Case ("Listing Metni") veya ALL CAPS ("LISTING METNİ") kullanılmaz. Sadece teknik etiketlerde (MONO SMALL CAPS tracking: 0.5px uppercase) kullanılabilir.

---

## 3. Spacing

4px grid. Tailwind default'ı kullanılıyor, ek özel değer yok.

| Token | Değer | Kullanım |
|-------|-------|----------|
| xs | 4px | Icon gap, çok yakın elementler |
| sm | 8px | Buton içi padding, form label → input |
| md | 12px | Kart içi padding, grid gap |
| lg | 16px | Kart padding, section içi spacing |
| xl | 24px | Section aralığı (küçük) |
| 2xl | 32px | Section aralığı (büyük) |
| 3xl | 48px | Hero → content geçişi |

---

## 4. Radius

**Sadece 3 değer.** Daha fazlası kaos yaratır.

| Token | Değer | Kullanım |
|-------|-------|----------|
| radius-badge | 4px | Rozet, label, küçük pill |
| radius-control | 8px | Buton, input, select, küçük kart |
| radius-card | 12px | Büyük kart, panel, modal |

**Yasak:** 16px, 20px, 24px ve üstü radius. "rounded-2xl / 3xl" sınıfları kullanılmaz.

---

## 5. Border

- Renk: `#D8D6CE` (neutral border token)
- Kalınlık: 1px (her yerde)
- Vurgu için 2px sadece **featured card** içinde (primary renkte, örn. "önerilen paket")

---

## 6. Shadow

**Gölge yok.** Sadece form elementlerinin focus ring'i:

```css
input:focus, button:focus-visible {
  outline: 2px solid #1E4DD8;
  outline-offset: 2px;
}
```

---

## 7. İkonlar

### Paket
**[Lucide React](https://lucide.dev/icons/)** — `lucide-react` npm paketi.

```bash
npm install lucide-react
```

### Kural
- Stroke weight: 1.5 (default 2 değil — daha ince, pro durur)
- Boyut: 16px (body içinde), 20px (kartta), 24px (hero'da)
- Renk: `currentColor` (parent'tan miras)
- Hiçbir ikonun rengi hard-coded olmaz

### Örnek
```tsx
import { FileText, Image, Video, MessageCircle } from 'lucide-react'

<FileText size={16} strokeWidth={1.5} />
```

### Emoji politikası
**UI'da emoji yok.** Ne başlıklarda ne butonlarda ne listelerde.

**İstisna:** Kullanıcının ürettiği içerik (listing metinleri, sosyal medya caption'ları) — orada kullanıcıya seçim hakkı verilir ("canlı" vs "sade" mod).

---

## 8. Component baz stilleri

### Buton

**Primary:**
```tsx
className="bg-[#1E4DD8] hover:bg-[#163B9E] text-white font-medium text-sm px-4 py-2.5 rounded-lg transition-colors"
```

**Secondary (outline):**
```tsx
className="bg-white hover:bg-[#FAFAF8] text-[#1A1A17] font-medium text-sm px-4 py-2.5 rounded-lg border border-[#D8D6CE] transition-colors"
```

**Accent (premium):**
```tsx
className="bg-[#A87847] hover:bg-[#7D5630] text-white font-medium text-sm px-4 py-2.5 rounded-lg transition-colors"
```

**Ghost / text link:**
```tsx
className="text-[#1E4DD8] hover:text-[#163B9E] font-medium text-sm transition-colors"
```

### Kart

**Standart:**
```tsx
className="bg-white border border-[#D8D6CE] rounded-xl p-5"
```

**Featured (önerilen):**
```tsx
className="bg-white border-2 border-[#1E4DD8] rounded-xl p-5 relative"
```

**Metrik kartı (sayılar için):**
```tsx
className="bg-[#F1F0EB] rounded-lg p-4"
```

### Input

```tsx
className="w-full border border-[#D8D6CE] rounded-lg px-3.5 py-2.5 text-sm placeholder:text-[#908E86] focus:outline-none focus:border-[#1E4DD8] focus:ring-2 focus:ring-[#1E4DD8]/20 transition-colors"
```

### Rozet / Badge

**Nötr:**
```tsx
className="bg-[#F1F0EB] text-[#5A5852] text-xs px-2.5 py-0.5 rounded"
```

**Info:**
```tsx
className="bg-[#EBF1FB] text-[#0E2558] text-xs font-medium px-2.5 py-0.5 rounded"
```

**Premium:**
```tsx
className="bg-[#FAF4ED] text-[#3D2710] text-xs font-medium px-2.5 py-0.5 rounded"
```

---

## 9. Değişmeyen prensipler (sorgulanmaz)

1. **UI'da emoji yok.** Lucide ikonlar kullanılır.
2. **Gölge yok.** 1px border ile ayrım yapılır.
3. **İki yazı ağırlığı.** 400 ve 500. 600/700 yok.
4. **Sentence case.** Title Case yok.
5. **Tek ana renk sistemi.** Her modüle farklı renk atanmaz.
6. **Accent sadece premium'da.** Warm earth her yerde kullanılmaz.
7. **Üç radius değeri.** 4, 8, 12 — başka yok.
8. **Stage direction yok.** "↑ Önce fotoğraf yükle" tarzı metinler yerine UI kendi kendini anlatır.

---

## 10. Değişiklik kaydı

| Tarih | Değişiklik | Gerekçe |
|-------|------------|---------|
| Nisan 2026 | İlk sürüm (v2) | Çakma ChatGPT eleştirisi + platform vizyonu |

---

## 11. Yararlı linkler

- [Inter font](https://fonts.google.com/specimen/Inter)
- [Lucide ikonlar](https://lucide.dev/icons/)
- [Next.js font optimization](https://nextjs.org/docs/app/api-reference/components/font)
- [Tailwind arbitrary values](https://tailwindcss.com/docs/adding-custom-styles#using-arbitrary-values)
