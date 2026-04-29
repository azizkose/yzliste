# Redesign Tipografi Sistemi (Cowork referans, 29 Nis 2026)

> **Bu belge `claude/redesign-modern-ui` branch'i için tipografi referansıdır.**
> CLAUDE.md UI kuralları (font-medium 500 zorunluluğu, font-bold yasağı vb.)
> bu branch'te **GEÇERSİZ**. Anasayfa, fiyatlar, üret, hesap, blog, yasal —
> tüm redesign sayfaları aşağıdaki tabloya uyacak.

## Temel ilkeler

1. **Min okunabilir boyut: 12px (`text-xs`).** `text-[9px]`, `text-[10px]`, `text-[11px]` **YASAK** — okunamaz, accessibility sorunu, SEO meta ile karışmaz.
2. **Bold (700) sadece dikkat çekmek istediğin yerde.** Hero H1 ve Section H2'de OK. Subsection H3 ve aşağısında yasak.
3. **Hiyerarşi tutarlı:** Hero H1 > Section H2 > Subsection H3 > Card title > Body. Bir adım atla yok.
4. **Display font (Manrope) sadece başlık + eyebrow.** Body Inter.
5. **Tracking (letter-spacing) seviyeli:** Display başlıklarda negatif (-0.01 / -0.02), eyebrow'da pozitif (+0.15).

## Anasayfa hiyerarşisi

| Eleman | Font ailesi | Tailwind size | Weight | Tracking | Renk | Notlar |
|---|---|---|---|---|---|---|
| **Hero H1** | Manrope display | `text-5xl md:text-6xl` | `font-bold` (700) | `tracking-[-0.02em]` | `text-rd-neutral-900` | Sayfanın en güçlü dikkat noktası. Bold ZORUNLU. |
| **Hero subtitle** | Inter | `text-base md:text-lg` | `font-normal` (400) | normal | `text-rd-neutral-500` | `leading-relaxed`, max 600px |
| **Section H2** (StepSection, MarkaBilgileri, FAQ, CTA, Fiyatlar hero) | Manrope display | `text-3xl md:text-4xl` | `font-bold` (700) | `tracking-[-0.01em]` | `text-rd-neutral-900` | Bölüm girişi — bold çek dikkat |
| **Section subtitle** | Inter | `text-base` | `font-normal` (400) | normal | `text-rd-neutral-500` | `leading-relaxed` |
| **Subsection H3** (InfoStrip "4 içerik türü...", Hesap "Bildirimler", Fiyatlar SSS) | Manrope display | `text-xl md:text-2xl` | `font-semibold` (600) | `tracking-[-0.01em]` | `text-rd-neutral-900` | Bold DEĞİL — H2 ile karışmasın |
| **Card title** (StepAnimation adım başlığı, paket adı, SSS sorusu) | Inter | `text-base md:text-lg` | `font-semibold` (600) | normal | `text-rd-neutral-900` | Aktif vs pasif kart yine aynı boyut |
| **Eyebrow** (her bölümün üstündeki kısa etiket) | Manrope | `text-xs` (12px) | `font-semibold` (600) | `tracking-[0.15em] uppercase` | `text-rd-warm-700` | **9-10px değil, 12px min.** Eyebrow karakteri tracking ile gelir, küçük olmasın. |
| **Body large** (intro paragraf, hero subtitle) | Inter | `text-base md:text-lg` | `font-normal` (400) | normal | `text-rd-neutral-600` | `leading-relaxed` (1.625) |
| **Body** (paragraf, kart açıklama, sekme description) | Inter | `text-sm md:text-base` | `font-normal` (400) | normal | `text-rd-neutral-700` | `leading-relaxed` |
| **Caption / meta** (kart altı, tarih, tip etiketi, "süre", "kredi") | Inter | `text-xs` (12px) | `font-normal` (400) veya `font-medium` (500) | normal | `text-rd-neutral-500` | **min 12px** |
| **Tag / chip** (pazaryeri chip, kategori chip, hashtag) | Inter | `text-xs` (12px) | `font-medium` (500) | normal | varies | Pill içinde min 12px |
| **Mini başlık** (panel içi "Başlık", "Özellikler", "Açıklama") | Inter | `text-xs` (12px) | `font-semibold` (600) | `tracking-[0.1em] uppercase` | `text-rd-neutral-500` | Eyebrow benzeri ama panel içi |
| **Button** (primary CTA) | Inter | `text-sm md:text-base` | `font-medium` (500) | normal | varies | Min 14px |
| **Footer link / nav link** | Inter | `text-sm` | `font-normal` (400) | normal | `text-rd-neutral-600` |

## Yasaklı sınıflar (redesign branch'te)

- `text-[9px]`, `text-[10px]`, `text-[11px]` → **HER DURUMDA `text-xs` (12px)** ile değiştir
- `font-thin` (100), `font-extralight` (200), `font-light` (300) → minimum `font-normal` (400)
- `font-semibold` H2'de → `font-bold` ile değiştir (H2 dikkat çekmeli)
- `font-bold` H3'te → `font-semibold` ile değiştir (H2 ile karışmasın)

## Code'a verirken kural

Her redesign prompt'unun başında:

```
ÖNEMLİ — KURAL OVERRIDE:
Bu görev `claude/redesign-modern-ui` branch'inde. CLAUDE.md UI 
kuralları GEÇERSİZ. docs/redesign-typography.md tablosu uygulanacak.

Özellikle:
- font-bold (700) Hero H1 + Section H2'de ZORUNLU. CLAUDE.md "yasak"
  diyor olabilir — bu branch'te override.
- text-[9px]/text-[10px] HER DURUMDA text-xs (12px) ile değiştir.
- Eyebrow text-xs + font-semibold + tracking + rd-warm-700.
```

## Notlar (gelecekte güncellenecek)

- Mobile (375px) test sonuçları geldikçe boyutlar adapt edilebilir
- Tasarım sisteminin Section H2 vs Subsection H3 ayrımı net kalsın
- Eyebrow rd-warm-700 her sayfada — primary mavi DEĞİL (eyebrow accent rolü)
