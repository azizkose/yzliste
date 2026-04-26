# yzliste Redesign — Backlog

Amaç: Mevcut canlı siteyi koruyarak, ayrı branch'te modern UI redesign çalışması.

**Kurallar:**
- Branch: `claude/redesign-modern-ui` (main'e dokunulmaz)
- Preview: Vercel preview URL'den kontrol
- Her bölüm ayrı commit, ayrı onay
- Merge ancak Aziz onayıyla
- Backend, API, Supabase, env dokunulmaz — sadece frontend

**Dokunulabilir:**
- `app/page.tsx` (anasayfa)
- `app/layout.tsx` (font/global stil)
- `components/sections/*`
- `components/tanitim/*`
- `components/primitives/*` (yeni — design system primitives)
- `lib/constants/*` (yeni — demo data, token constants)
- `tailwind.config.ts` (renk/font tokenları)
- `app/globals.css` (CSS variable'lar)
- `public/` (görsel/font asset)

**Dokunulmaz (Aziz izni olmadan):**
- `app/uret/*`, `app/kayit/*`, `app/fiyatlar/*`, `app/blog/*`
- `app/api/*`, `lib/supabase/*`
- `.env*`, `middleware.ts`

**Redesign branch UI kuralları (CLAUDE.md'den farklılaşan):**
- Font ağırlıkları: 400–800 serbest (mevcut sitede 400–500)
- Gölge: serbest (mevcut sitede yasak)
- Border radius: 16px (rounded-2xl) kartlarda serbest (mevcut max 12px)
- Font: Manrope (display 18px+) + Inter (body) (mevcut sadece Inter)
- Renk paleti: yeni spec paleti geçerli (primary #2563EB, accent #F97316, slate nötrler)
- İçerik türü renkleri: metin #1E40AF, görsel #7C3AED, video #DC2626, sosyal #059669
- **Emoji yasak** — kurallar bandı ve placeholder'larda Lucide ikon kullanılacak

---

## Açık işler

### Altyapı

| ID | Başlık | Durum | Bağımlılık | Notlar |
|---|---|---|---|---|
| RD-00 | Branch kurulumu + Vercel preview doğrulama | Bekliyor | — | `claude/redesign-modern-ui` branch'i aç, push et, preview URL al |

### Design System Primitives

| ID | Başlık | Durum | Bağımlılık | Kabul Kriteri |
|---|---|---|---|---|
| DS-01 | Design token'ları kur | Bekliyor | RD-00 | `tailwind.config.ts`'ye yeni renk/font/radius/shadow token'ları ekle. `globals.css`'ye CSS variable'lar ekle. Manrope font'u `layout.tsx`'e next/font ile ekle. Mevcut token'lar bozulmaz — extend ile ekle. |
| DS-02 | Button primitive | Bekliyor | DS-01 | `components/primitives/Button.tsx` — 4 varyant (primary, secondary, ghost, outline), 3 boyut (sm, md, lg). Hover/focus/disabled state'leri. `font-medium`, `rounded-lg`. TypeScript props, `any` yok. |
| DS-03 | Card primitive | Bekliyor | DS-01 | `components/primitives/Card.tsx` — `rounded-2xl`, ince border, opsiyonel shadow. `variant` prop: default, elevated, bordered. Padding token'dan. |
| DS-04 | Badge primitive | Bekliyor | DS-01 | `components/primitives/Badge.tsx` — 6 renk varyantı (primary, success, warning, danger, neutral, accent). 2 boyut (sm, md). `rounded-full`, pill görünüm. |
| DS-05 | Eyebrow primitive | Bekliyor | DS-01 | `components/primitives/Eyebrow.tsx` — uppercase, `tracking-wider`, `text-xs`, opsiyonel ikon. Renk prop'u. |
| DS-06 | Tab primitive | Bekliyor | DS-01 | `components/primitives/Tab.tsx` — `role="tablist"` + `role="tab"` + `aria-selected`. Klavye navigasyonu (Arrow Left/Right). Pill ve underline varyantları. |
| DS-07 | SectionHeader primitive | Bekliyor | DS-05 | `components/primitives/SectionHeader.tsx` — Eyebrow + h2 (Manrope, display) + subtitle paragraf. Center-aligned. Max-width constraint. |
| DS-08 | CopyButton primitive | Bekliyor | DS-01 | `components/primitives/CopyButton.tsx` — clipboard API + fallback. State: default → copied (1500ms) → default. `aria-live="polite"`. Lucide Copy/Check ikonları. |

### Pazaryeri Bölümü — Pilot 1

| ID | Başlık | Durum | Bağımlılık | Kabul Kriteri |
|---|---|---|---|---|
| PZ-01 | Constants & data layer | Bekliyor | DS-01 | `lib/constants/pazaryeri.ts` — CONTENT_TYPES, PLATFORMS, PAZARYERI_DEMO_DATA. TypeScript strict, `as const`. Mockup'taki demo metinler aynen. Kurallar bandı emoji'leri Lucide ikon string'ine çevrilmiş. |
| PZ-02 | Component scaffold + SectionHeader | Bekliyor | DS-07, PZ-01 | `components/sections/PazaryeriSection.tsx` iskelet. SectionHeader entegre: eyebrow "Tek üründen, 4 içerik · 3 platform", h2, subtitle. State tanımı (activeContentType, activePlatform, copiedField). |
| PZ-03 | ContentTypeStep (üst tab'lar) + FlowConnector | Bekliyor | DS-06, PZ-02 | 4 pill tab (metin/görsel/video/sosyal), her biri kendi rengiyle. Seçili tab vurgulu. FlowConnector "Örnek aşağıda" bounce animasyonu, seçili rengi takip ediyor. |
| PZ-04 | DynamicTitleBar + OutputCard frame | Bekliyor | PZ-03 | Başlık barı: ikon + "Üretilen örnek" eyebrow + "{ContentType} — {Platform} için". OutputCard: üst köşeleri yok (title bar'a yapışık), border-color content type rengini takip ediyor. |
| PZ-05 | ProductInputCard (sol kart, sticky) | Bekliyor | DS-03, PZ-02 | Sol kart: ürün görseli (emoji yerine Lucide ikon placeholder), ürün bilgisi, girdi yöntemleri (Camera, Pencil, Barcode). Desktop'ta `position: sticky; top: 20px`. Mobilde sticky devre dışı. |
| PZ-06 | PlatformTabs + PlatformRulesBar | Bekliyor | DS-06, PZ-04 | 3 platform tab'ı (Trendyol/Amazon/Etsy), platform renkleriyle. Kurallar bandı: platform soft bg, kurallar Lucide ikon + metin (emoji değil). |
| PZ-07 | ContentRenderer: Text type | Bekliyor | DS-08, PZ-06 | 4 OutputField (Başlık, Özellikler, Açıklama, Etiketler). Her field'da CopyButton. Özellikler bullet dot'u platform renginde. Etiketler pill chip. 300ms fade geçişi. |
| PZ-08 | ContentRenderer: Image type | Bekliyor | PZ-06 | 4'lü görsel grid (placeholder: Lucide ImageIcon + label, emoji değil). "Tümünü indir" butonu. Stil notu kutusu (platform renk left border). |
| PZ-09 | ContentRenderer: Video type | Bekliyor | PZ-06 | Video player mockup, aspect ratio platforma göre (9:16 / 16:9 / 1:1). Play butonu (Lucide). Video spec etiketi. Sahne planı listesi (timestamp + Lucide ikon + açıklama, emoji değil). |
| PZ-10 | ContentRenderer: Social type | Bekliyor | DS-08, PZ-06 | Instagram + TikTok/Pinterest mockup'ları (platforma göre). CopyButton her post'ta. Instagram'da hashtag chip'leri + engagement ikonları (Lucide). |
| PZ-11 | Mobile responsive pass | Bekliyor | PZ-07~PZ-10 | Mobile: tek kolon, sticky off, tab'lar yatay scroll. Tablet: 2 kolon dar input. Desktop: tam mockup. Hiçbir breakpoint'te overflow yok. |
| PZ-12 | A11y pass | Bekliyor | PZ-11 | `role="tablist/tab"`, `aria-selected`, `aria-controls`. Arrow Left/Right navigasyon. Focus-visible ring. `aria-live="polite"` kopyala bildirimi. WCAG AA kontrast. |
| PZ-13 | Acceptance review | Bekliyor | PZ-12 | Aziz preview URL'de kontrol eder. 12 kombinasyon (4 × 3) test. Performans: Lighthouse >90, CLS <0.05. Console error yok. Bundle <30KB gzip. |

### Açık Sorular (Aziz kararı bekliyor)

| # | Soru | Varsayılan | Aziz cevabı |
|---|---|---|---|
| Q1 | Görsel placeholder: gerçek ürün görseli mi, Lucide ikon placeholder mı? | Pilot: Lucide ikon placeholder | — |
| Q2 | Demo metinler: mockup'taki "Selin Porselen" mi, gerçek ürün mü? | Pilot: mockup metni | — |
| Q3 | Sosyal medya: Trendyol→Instagram+TikTok, Amazon/Etsy→Instagram+Pinterest? | Evet | — |

---

## Tamamlanan

(henüz yok)

---

## İptal / Revert edilen

(henüz yok)
