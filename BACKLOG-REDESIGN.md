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
| RD-00 | Branch kurulumu + Vercel preview doğrulama | ✅ Tamam | — | Branch açıldı, push edildi |

### Design System Primitives

| ID | Başlık | Durum | Bağımlılık | Kabul Kriteri |
|---|---|---|---|---|
| DS-01 | Design token'ları kur | ✅ Tamam | RD-00 | Commit `447c2a6` — Tailwind v4 `@theme` bloğu, 55 renk + 4 shadow + 4 radius + 2 font token. Manrope eklendi. |
| DS-02 | Button primitive | ✅ Tamam | DS-01 | Commit `b537444` — 4 varyant, 3 boyut, loading spinner, ikon desteği. |
| DS-03 | Card primitive | ✅ Tamam | DS-01 | Commit `b537444` — 3 varyant, 4 padding seçeneği. |
| DS-04 | Badge primitive | ✅ Tamam | DS-01 | Commit `b537444` — 6 renk, 2 boyut, pill shape. |
| DS-05 | Eyebrow primitive | ✅ Tamam | DS-01 | Commit `56f4c51` — 3 renk, opsiyonel ikon, uppercase + tracking. |
| DS-06 | Tab primitive | ✅ Tamam | DS-01 | Commit `56f4c51` — TabList + TabItem (pill) + TabItemUnderline, tam a11y. |
| DS-07 | SectionHeader primitive | ✅ Tamam | DS-05 | Commit `56f4c51` — Eyebrow kullanıyor, Manrope display, responsive, pill eyebrow. |
| DS-08 | CopyButton primitive | ✅ Tamam | DS-01 | Commit `56f4c51` — clipboard + fallback, timeout reset, aria-live. |

### Pazaryeri Bölümü — Pilot 1

| ID | Başlık | Durum | Bağımlılık | Kabul Kriteri |
|---|---|---|---|---|
| PZ-01 | Constants & data layer | ✅ Tamam | DS-01 | Commit `69dc14e` — CONTENT_TYPES, PLATFORMS, PAZARYERI_DEMO_DATA (12 kombinasyon), INPUT_METHODS, SAMPLE_PRODUCT. Tüm emoji→Lucide dönüşüm yapıldı. |
| PZ-02 | Component scaffold + SectionHeader | ✅ Tamam | DS-07, PZ-01 | Commit `18eefc3` — PazaryeriSection.tsx iskelet. 3 state, SectionHeader entegre, placeholder'lar state değerlerini gösteriyor. |
| PZ-03 | ContentTypeStep (üst tab'lar) + FlowConnector | ✅ Tamam | DS-06, PZ-02 | Commit `dc1cd33` — 4 pill tab (inline color), ARIA tablist, Arrow key nav, FlowConnector subtle-bounce, color transition 300ms. |
| PZ-04 | DynamicTitleBar + OutputCard frame | ✅ Tamam | PZ-03 | Commit `992a628` — Ikon+eyebrow+başlık, kredi badge, OutputCard 2 kolon layout, border-color geçişli, ArrowRight pulse. |
| PZ-05 | ProductInputCard (sol kart, sticky) | ✅ Tamam | DS-03, PZ-02 | Commit `50c45f0` — ImageIcon placeholder, specs grid 2x2, 3 input kartı (Camera seçili), md:sticky, ScanLine icon mapping. |
| PZ-06 | PlatformTabs + PlatformRulesBar | ✅ Tamam | DS-06, PZ-04 | Commit `88d7ad5` — 3 platform tab (letter circle + platform rengi, inline style), PlatformRulesBar (platform soft bg, PAZARYERI_DEMO_DATA rules, sm:grid-cols-2, RULE_ICONS map). |
| PZ-07 | ContentRenderer: Text type | ✅ Tamam | DS-08, PZ-06 | Commit `77ac639` — 4 OutputField (Başlık/Özellikler/Açıklama/Etiketler), CopyButton her alanda, platform renkli bullet dot (inline style), pill chip etiketler, fade-in animasyonu (key-driven remount), copiedField state kaldırıldı. |
| PZ-08 | ContentRenderer: Image type | ✅ Tamam | PZ-06 | Commit `08f3a16` — 6 gallery item (2×3 grid), Lucide ikon placeholder, ana görsel vurgulu (border-2 primary), StyleNote kutusu (platform soft bg + sol border), "Tümünü indir" butonu, fade-in animasyon. |
| PZ-09 | ContentRenderer: Video type | ✅ Tamam | PZ-06 | Video player mockup (slate-900 bg, Play/HD/0:30 overlay), aspect ratio platforma göre (Trendyol 1:1, Amazon 16:9, Etsy 4:5), video spec etiketi (Monitor ikon), sahne planı 6 sahne (zaman w-10 tabular-nums + ikon platform rengi), RotateCw/Tag/Play/Monitor import, fade-in. |
| PZ-10 | ContentRenderer: Social type | ✅ Tamam | DS-08, PZ-06 | Instagram + TikTok/Pinterest kartları (Trendyol→TikTok, Amazon/Etsy→Pinterest), caption whitespace-pre-line, CopyButton header + hashtag bölümünde ayrı, hashtag chip'leri platform rengi inline style, Music/MapPin import, fade-in. Tüm 4 renderer tamamlandı, placeholder div'ler kaldırıldı. |
| PZ-11 | Mobile responsive pass | ✅ Tamam | PZ-07~PZ-10 | Commit `cb406ce` — Section padding responsive (py-12/16/20), FlowConnector spacing (mt/mb-4/6), OutputCard padding (p-4/5/6) + min-h (300/400), mobile ArrowRight (flex md:hidden), h3 font-size responsive (sm/base/lg, truncate kaldırıldı), platform tab gap (1.5/2). |
| PZ-12 | A11y pass | ✅ Tamam | PZ-11 | Commit `cb406ce` — Platform tablist Arrow Left/Right nav (platformTablistRef + handler), aria-controls + tabpanel, FlowConnector + ArrowRight aria-hidden, section aria-label, text-slate-400→slate-500 kontrast düzeltme (10 label, dekoratif korundu). |
| PZ-13 | Acceptance review | ✅ Tamam | PZ-12 | 12 kombinasyon ✅, ARIA/keyboard ✅ (1 düzeltme: dış div'e role="tabpanel"), responsive ✅, kural uyumu ✅, build ✅. **Pazaryeri bölümü (PZ-01~13) tamamen kapalı.** |

### İçerik Türleri Bölümü — Pilot 2

| ID | Başlık | Durum | Bağımlılık | Kabul Kriteri |
|---|---|---|---|---|
| IT-01 | Constants & data layer | ✅ Tamam | DS-01 | Commit `69dc14e` — ICERIK_TURLERI (4 kart + sample), BOTTOM_NOTE, IcerikTuruId type. |
| IT-02 | Component scaffold + SectionHeader + section bg | ✅ Tamam | DS-07, IT-01 | Commit `18eefc3` — IcerikTurleriSection.tsx iskelet. openModal state, SectionHeader entegre, 4 kart placeholder grid (lg:grid-cols-4). |
| IT-03 | ContentTypeCard component | ✅ Tamam | DS-03, IT-02 | Commit `dc1cd33` — 4 kart, flex eşit yükseklik, IconBox renkli, hover translateY+renkli gölge, focus-visible ring kart rengi, Tab/Enter/Space aktive. |
| IT-04 | Hover state'leri + transitions | ✅ Tamam | IT-03 | Commit `dc1cd33` — IT-03 ile birlikte yapıldı. Hover translateY(-2px), renkli border+gölge, focus-visible ring, role="button" tabIndex="0". |
| IT-05 | SampleModal component | ✅ Tamam | IT-03 | Commit `992a628` — Focus trap, Escape/backdrop/X kapanma, body scroll lock, prevFocusRef restore, ARIA dialog, slideUp+scale animasyon, 4 kart renk+içerik. |
| IT-06 | BottomNote | ✅ Tamam | IT-02 | Commit `50c45f0` — Sparkles ikon + metin + ArrowRight link, flex-wrap mobil uyumlu. |
| IT-07 | Mobile responsive pass | ✅ Tamam | IT-05, IT-06 | Commit `88d7ad5` — Section py-16 md:py-20 lg:py-28, modal p-6 md:p-8. Grid 1→2→4 kolon zaten sağlıklı. |
| IT-08 | A11y pass | ✅ Tamam | IT-07 | Commit `77ac639` — Kart id eklendi, kontrast düzeltme (slate-400→500: "İçerir", "Kredi", "Süre"), Sparkles aria-hidden, font-semibold→font-medium (kural uyumu), rounded-2xl→rounded-xl. |
| IT-09 | Acceptance review | ✅ Tamam | IT-08 | Commit `08f3a16` — 4 kart hover ✅, 4 modal ✅, CLS ✅, console error yok ✅. Değişiklik gerekmedi, doğrulandı. |

### Hero Bölümü (Trust Strip + Nav + Hero)

| ID | Başlık | Durum | Bağımlılık | Kabul Kriteri |
|---|---|---|---|---|
| HR-01 | Constants & data layer | ✅ Tamam | DS-01 | Commit `48bd4b6` — lib/constants/hero.ts: TRUST_STRIP_ITEMS (Flag/Lock/Zap), NAV_LINKS (/uret/fiyatlar/blog), NAV_BRAND, NAV_CTAS (/giris+/kayit), HERO_COPY (h1 3 parça), HERO_TRUST_PILLS (4), HERO_BADGES, MOCKUP_STEPS, MOCKUP_INPUT_METHODS. Emoji→Lucide, "28sn"→"Saniyeler içinde". |
| HR-02 | TrustStrip component | ✅ Tamam | HR-01 | Commit `48bd4b6` — components/sections/HeroBlock/TrustStrip.tsx: bg-rd-neutral-50, border-b slate-200, 3 öğe ortalı (Flag/Lock/Zap 13px + text-xs), flex-wrap mobil, max-w-[1200px], aria-hidden ikonlar. |
| HR-03 | Nav component (sticky + blur) | ✅ Tamam | DS-02, HR-01 | Commit `b51a9c7` + fix `877ada2` — Nav.tsx: sticky top-0 z-50, bg-white/85 backdrop-blur-md, -webkit prefix, logo Manrope 800 22px + Beta badge, 3 nav link, "Giriş yap" outline + "İçerik üret" primary ArrowRight CTA. |
| HR-04 | Mobile hamburger menü | ✅ Tamam | HR-03 | Commit `b51a9c7` — Slide-out panel + backdrop, focus trap (closeRef focus + hamburgerRef restore), Escape kapanma, body scroll lock, aria-expanded/controls/modal. Spec'ten daha iyi a11y. |
| HR-05 | HeroSection scaffold + grid + soft bg | ✅ Tamam | HR-01 | Commit `a9dcbd2` + fix `877ada2` — HeroSection.tsx: 2 kolon grid (1.05fr 1fr), radial mavi glow (rgba 59,130,246 0.08, 900x600 top-200), responsive padding (pt-10/14/16 pb-16/20/24), max-w-[1200px]. |
| HR-06 | HeroContent (sol kolon) | ✅ Tamam | DS-02, DS-04, DS-05, HR-05 | Commit `a9dcbd2` + fix `877ada2` — Eyebrow pill (bg-primary-50, border-primary-200, pulse-soft mavi dot), H1 Manrope 800 clamp(40-64px) "AI ile" primary-700, subtitle "dakikalar içinde" bold, 4 TrustPill (rounded-lg 13px nötr hover 150ms), primary CTA ArrowRight /kayit, ghost Play daire, reassurance Check emerald. |
| HR-07 | AppScreenshotMockup (sağ kolon) | ✅ Tamam | HR-05 | Commit `a9dcbd2` + fix `877ada2` — Browser chrome (3 dot + URL bar yzliste.com/uret), step indicator (3 adım constants'tan), 3 input metodu kartı (Fotoğraf seçili), upload preview (fincan_01.jpg + Yüklendi 2.4MB), marka input, generate Zap butonu, role="img" aria-label. |
| HR-08 | StickerBadge primitive | ✅ Tamam | DS-01 | StickerBadge.tsx primitive: pill (rounded-full), bg-white, shadow-rd-md, 11px font-semibold Inter, ikon renk+border inline style, position dışarıdan className. AppScreenshotMockup'a 2 badge: sağ üst Check mavi (#1E40AF / #DBEAFE), sol alt Zap turuncu (#EA580C / #FED7AA). |
| HR-09 | Float-in animasyonları | ✅ Tamam | HR-06, HR-07 | globals.css: hero-float-in keyframe (opacity 0→1, translateY 8→0) + pulse-soft keyframe. HeroContent: animate-hero-float-in-left (600ms, delay 0). AppScreenshotMockup: animate-hero-float-in-right (600ms, delay 150ms). prefers-reduced-motion → animation: none. |
| HR-10 | "Nasıl çalışır?" video modal | ✅ Tamam | HR-06 | VideoModal.tsx: fixed z-50 ortalı dialog (max-w-800 aspect-video rounded-xl bg-black), backdrop bg-black/60 blur tıkla-kapat, X butonu bg-black/40, Escape + body scroll lock + focus management (triggerRef restore). HeroContent 'use client' + useState + onClick bağlı. Mevcut modal-backdrop-in/panel-in keyframe'leri. Placeholder: Play + "Video yakında eklenecek". HeroContent truncated bug da düzeltildi (git restore). |
| HR-11 | Mobile responsive pass | ✅ Tamam | HR-04~HR-10 | Commit `aa55a4d` — CTA flex-col/sm:flex-row, primary CTA w-full sm:w-auto, ghost CTA justify-center, StickerBadge hidden sm:flex sm:absolute. |
| HR-12 | A11y pass | ✅ Tamam | HR-11 | Commit `aa55a4d` — Ghost buton focus-visible ring eklendi, VideoModal text-white/80 kontrast düzeltildi. |
| HR-13 | Performance pass | ✅ Tamam | HR-12 | Commit `aa55a4d` — VideoModal dynamic import (next/dynamic, ssr:false). |
| HR-14 | Gerçek screenshot entegrasyonu | Bekliyor | HR-07 | Aziz onayı sonrası: gerçek `/uret` sayfası screenshot'ı mockup'a yerleştirilir. |
| HR-15 | Acceptance review | Bekliyor | HR-13 | Aziz preview'da kontrol. Nav sticky çalışıyor, H1 doğru, CTA'lar fonksiyonel, responsive tam. |

> Prompt arşivlendi → `BACKLOG-REDESIGN-ARCHIVE.md`

---

### 3 Adımda Hazır Bölümü — Bölüm 04

| ID | Başlık | Durum | Bağımlılık | Kabul Kriteri |
|---|---|---|---|---|
| UA-01 | Constants (`lib/constants/uc-adim.ts`) | ✅ Tamam | DS-01 | UC_ADIM_STEPS + TOTAL_TIME. Süreler muğlak ("Birkaç saniyede"). |
| UA-02 | Section scaffold + SectionHeader + bg | ✅ Tamam | DS-07, UA-01 | bg-white. Eyebrow "KOLAY KULLANIM", h2 "3 adımda hazır". |
| UA-03 | StepCard + NumberCircle | ✅ Tamam | UA-02 | 80×80 outline circle (border-2 slate-200), Manrope 800, h3, desc, DurationLabel. |
| UA-04 | MiniMockup — Step1: InputMockup | ✅ Tamam | UA-03 | 3 input metodu kartı (Fotoğraf seçili) + upload preview (fincan_01.jpg). |
| UA-05 | MiniMockup — Step2: SelectionMockup | ✅ Tamam | UA-03 | 4 platform chip (Trendyol+Amazon seçili) + 4 içerik tipi (Metin+Görsel seçili). |
| UA-06 | MiniMockup — Step3: OutputMockup | ✅ Tamam | UA-03 | 2 çıktı kartı (Trendyol listing + Amazon görsel) + "ve 2 tane daha...". |
| UA-07 | ConnectorLine (dashed, desktop-only) | ✅ Tamam | UA-03 | 2px dashed #CBD5E1, absolute top-10, calc(100%/6), hidden lg:block, aria-hidden. |
| UA-08 | TotalTimeBar + stagger animasyon | ✅ Tamam | UA-02 | rd-primary-50 bg, Clock ikon + "Saniyeler içinde tamamlanır". Max-w 420px. |
| UA-09 | Mobile responsive + a11y pass | ✅ Tamam | UA-07, UA-08 | md: breakpoint (lg→md), NumberCircle aria-hidden+rd-primary-200 border, mockup role="img" taşındı, max-w-[280px] mx-auto, stagger fade-in (globals.css), prefers-reduced-motion. |
| UA-10 | Acceptance review | ✅ Tamam | UA-09 ✅ | Aziz onayladı (27 Nisan 2026). md breakpoint, a11y, responsive, build OK. |

> Prompt arşivlendi → `BACKLOG-REDESIGN-ARCHIVE.md`

---

### Marka Bilgileri Bölümü — Bölüm 05

| ID | Başlık | Durum | Bağımlılık | Kabul Kriteri |
|---|---|---|---|---|
| MB-01 | Constants (`lib/constants/marka-bilgileri.ts`) | ✅ Tamam | DS-01 | BRAND_FEATURES (4 item), TONE_CHIPS (samimi/profesyonel/premium + çıktı metinleri), BRAND_FORM_FIELDS. |
| MB-02 | Section scaffold + grid + bg | ✅ Tamam | DS-07, MB-01 | `components/sections/MarkaBilgileriSection.tsx`. bg-neutral-50. 2 kolon grid. |
| MB-03 | LeftColumn (eyebrow + heading + features + CTA) | ✅ Tamam | MB-02 | Accent Sparkles eyebrow "Yeni özellik". Heading. 4 feature item (icon box + title + desc). CTA link. |
| MB-04 | BrandFormPreview card scaffold | ✅ Tamam | MB-02 | BrandFormPreview aynı dosyada. white bg, border. Header "Marka Profili" + yeşil "Aktif" badge. |
| MB-05 | Static fields (Mağaza adı, Hedef kitle) | ✅ Tamam | MB-04 | 2 read-only field: primary-50 + neutral-50. |
| MB-06 | Marka tonu radio group (3 chip) | ✅ Tamam | MB-04 | 3 chip (samimi/profesyonel/premium). `role="radiogroup"`, `aria-checked`. Arrow Left/Right. Default: samimi. |
| MB-07 | OutputPreview + fade animation | ✅ Tamam | MB-06 | neutral-50 bg. Accent eyebrow "AI çıktısı — {tone} tonda". 300ms fade+slide-up on tone change. `aria-live="polite"`. |
| MB-08 | Hint text | ✅ Tamam | MB-07 | "Tonu değiştir, AI çıktısının nasıl değiştiğini gör" — italic, gri, ortalı. |
| MB-09 | Mobile responsive pass | ✅ Tamam | MB-08 | Mobile: tek kolon (sol önce sağ sonra). Desktop: 2 kolon. flex-wrap tone chips. |
| MB-10 | A11y pass | ✅ Tamam | MB-09 | radiogroup ARIA + roving tabindex. focus-visible. `prefers-reduced-motion`. WCAG AA. |
| MB-11 | Acceptance review | ✅ Tamam | MB-10 | Aziz onayladı (27 Nisan 2026). Build OK, rd-* token, emoji yok, responsive OK. Commit 4ef11f5. |

> Prompt arşivlendi → `BACKLOG-REDESIGN-ARCHIVE.md`

---

### Neden yzliste? Bölümü — Bölüm 06

| ID | Başlık | Durum | Bağımlılık | Kabul Kriteri |
|---|---|---|---|---|
| NY-01 | Constants (`lib/constants/neden-yzliste.ts`) | ✅ Tamam | DS-01 | NEDEN_HEADER, COMPARISONS (6 satır), FOOTNOTE. |
| NY-02 | Section scaffold + SectionHeader | ✅ Tamam | DS-07, NY-01 | `components/sections/NedenYzlisteSection.tsx`. bg-white. max-w 900px. |
| NY-03 | ComparisonTable (semantic `<table>`) | ✅ Tamam | NY-02 | Semantic table, border, rounded-xl, overflow hidden. |
| NY-04 | Table headers (Generic + yzliste) | ✅ Tamam | NY-03 | 2 kolon header: neutral-100 vs primary-50. |
| NY-05 | ComparisonRow (6 satır) | ✅ Tamam | NY-03 | X (kirmizi) vs Check (yesil) Lucide ikon. |
| NY-06 | Footnote | ✅ Tamam | NY-02 | italic, gri, ortalı. |
| NY-07 | Mobile responsive + a11y | ✅ Tamam | NY-05, NY-06 | Mobilde kart layout, semantic table, scope, aria-hidden, WCAG AA. |
| NY-08 | Acceptance review | ✅ Tamam | NY-07 | Aziz onayladı (27 Nisan 2026). Semantic table, mobil kartlar, Lucide ikon, build OK. Commit ae19f42. |

> Prompt arşivlendi → `BACKLOG-REDESIGN-ARCHIVE.md`

---

### Fiyatlar Bölümü — Bölüm 07

| ID | Başlık | Durum | Bağımlılık | Kabul Kriteri |
|---|---|---|---|---|
| FY-01 | Gerçek paket verilerini `/fiyatlar`'dan oku + constants | ✅ Tamam | DS-01 | `lib/constants/fiyatlar.ts` — PACKAGES (isim, fiyat, kredi, features), CREDIT_PER_PRODUCT, SLIDER config. **Gerçek fiyatlar Aziz'den onay sonrası.** |
| FY-02 | Section scaffold + SectionHeader + bg | ✅ Tamam | DS-07, FY-01 | `components/sections/FiyatlarSection.tsx`. bg-slate-50. Eyebrow "FİYATLANDIRMA". H2, subtitle. |
| FY-03 | CreditCalculator scaffold | ✅ Tamam | FY-02 | `components/sections/FiyatlarSection/CreditCalculator.tsx`. white card, shadow, border. Header + 2 kolon grid (slider sol, recommendation sağ). |
| FY-04 | Slider component (custom CSS) | ✅ Tamam | FY-03 | Range input 1-100. Mavi gradient dolu kısım. Beyaz thumb mavi border. Klavye Arrow key kontrolü. `role="slider"`, `aria-valuemin/max/now`. |
| FY-05 | RecommendationCard + hesaplama | ✅ Tamam | FY-04 | primary-50 bg. "SANA UYGUN PAKET" eyebrow. `useMemo` ile recommendedPackage. Tahmini ihtiyaç = productCount × CREDIT_PER_PRODUCT. |
| FY-06 | PackageCard component | ✅ Tamam | FY-01 | `components/sections/FiyatlarSection/PackageCard.tsx`. Default + popular (2px primary border, translateY -8px, "★ EN POPÜLER" rozet) varyantları. Fiyat Manrope 800 36px. Features ✓ listesi. CTA solid/outline. |
| FY-07 | "SENİN İÇİN" badge logic | ✅ Tamam | FY-05, FY-06 | Slider'a göre recommended package'a yeşil badge. Badge slider değiştikçe hareket eder. |
| FY-08 | FooterNote (trust points) | ✅ Tamam | FY-02 | 4 trust point yatay: Aboneliksiz, Krediler süresiz, iyzico, Faturalandırma. Ayraçlar `·`. |
| FY-09 | CTA route entegrasyonu | ✅ Tamam | FY-06 | Paket "Seç" butonu doğru route'a yönlendirir. Route Aziz'den gelecek. |
| FY-10 | Mobile responsive pass | ✅ Tamam | FY-08 | Mobile: calculator tek kolon, paketler tek kolon (popular en üstte, translateY kaldırılır). Slider touch friendly. |
| FY-11 | A11y pass | ✅ Tamam | FY-10 | Slider ARIA. `aria-live="polite"` recommendation güncelleme. Focus-visible. WCAG AA. |
| FY-12 | Acceptance review | Bekliyor | FY-11 | Aziz preview kontrolü. Slider test, 3 paket görsel kontrol. |
| FY-FIX-01 | Mavi border slider'la dinamik geçsin + CTA pozisyonu | ✅ Tamam | FY-11 | (1) Mavi border + 2px + md:-translate-y-2 + filled CTA → `isRecommended` ile bağla (slider'a göre dinamik). (2) "Senin için" yeşil badge'i KALDIR. (3) "En popüler" rozeti orta pakette statik kalır ama küçük (üstte rozet, border etkilemez). (4) "Paketi seç" CTA özelliklerin **altına** taşı (Header → Fiyat → Özellikler → CTA). (5) Mobil + desktop'ta her 3 paket için CTA görünür ve tıklanabilir. |

**Durum:** Prompt hazır — Claude Code'a verilebilir.

#### FY-01~11 Birleşik Prompt

> **ÖNEMLİ — İÇERİK KURALI:** Canlı sitedeki örnek çıktıları (üretilmiş text örnekleri, görsel örnekler, video örnekler, sosyal medya çıktı örnekleri) olduğu gibi koru — yeniden görsel/video üretmeye gerek olmasın. Diğer metinler (başlık, açıklama, CTA, feature listesi) tasarıma uygun şekilde değiştirilebilir.

> **Hedef:** Landing page'e "Fiyatlar" bölümü ekle. Kullanıcı ürün sayısını slider ile seçer, ona uygun paket önerilir, 3 paket kartı yan yana görünür. Altta güven noktaları.

---

##### FY-01: Constants — `lib/constants/fiyatlar-landing.ts`

**Gerçek fiyat verileri `lib/paketler.ts`'den gelecek.** Bu constants dosyası sadece landing page'e özel UI metinlerini ve slider config'ini tutar.

```ts
// lib/constants/fiyatlar-landing.ts

import { PAKET_LISTESI, type Paket } from '@/lib/paketler'

// Re-export — section component sadece bu dosyayı import etsin
export { PAKET_LISTESI }
export type { Paket }

export const FIYATLAR_HEADER = {
  eyebrow: 'Fiyatlandırma',
  title: 'Kullandıkça öde, abonelik yok',
  subtitle: 'Kredi paketini al, istediğin içerik türünde kullan. Süre sınırı yok.',
}

export const SLIDER_CONFIG = {
  min: 1,
  max: 100,
  defaultValue: 15,
  label: 'Aylık ürün sayısı',
}

// Kredi maliyetleri (landing page gösterimi için)
export const CREDIT_PER_PRODUCT = 1 // listing metni = 1 kredi
// Not: Video (10-20 kr) ve try-on (3 kr) farklı ama slider sadece listing bazlı hesap yapar

export const RECOMMENDATION_EYEBROW = 'Sana uygun paket'

export const TRUST_POINTS = [
  'Abonelik yok',
  'Krediler süresiz',
  'iyzico güvencesi',
  'e-Arşiv fatura',
] as const

export const FIYATLAR_CTA_ROUTE = '/fiyatlar'
```

---

##### FY-02: Section scaffold — `components/sections/FiyatlarSection.tsx`

`'use client'` — slider state gerektirir.

```tsx
// components/sections/FiyatlarSection.tsx
'use client'

import { useState, useMemo } from 'react'
import SectionHeader from '@/components/primitives/SectionHeader'
import {
  FIYATLAR_HEADER,
  SLIDER_CONFIG,
  PAKET_LISTESI,
  CREDIT_PER_PRODUCT,
  RECOMMENDATION_EYEBROW,
  TRUST_POINTS,
  FIYATLAR_CTA_ROUTE,
} from '@/lib/constants/fiyatlar-landing'

export default function FiyatlarSection() {
  const [productCount, setProductCount] = useState(SLIDER_CONFIG.defaultValue)

  const recommendedPackage = useMemo(() => {
    const needed = productCount * CREDIT_PER_PRODUCT
    // İlk yeten paketi bul, yoksa son paketi döndür
    return PAKET_LISTESI.find(p => p.kredi >= needed) ?? PAKET_LISTESI[PAKET_LISTESI.length - 1]
  }, [productCount])

  return (
    <section className="py-20 md:py-28 bg-rd-neutral-50" aria-labelledby="fiyatlar-heading">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeader
          eyebrow={FIYATLAR_HEADER.eyebrow}
          eyebrowColor="primary"
          title={FIYATLAR_HEADER.title}
          subtitle={FIYATLAR_HEADER.subtitle}
          id="fiyatlar-heading"
        />

        {/* CreditCalculator */}
        {/* PackageCards grid */}
        {/* TrustFooter */}
      </div>
    </section>
  )
}
```

Section bg: `bg-rd-neutral-50`. `_tanitim-redesign.tsx`'de NedenYzlisteSection'dan **sonra** ekle.

---

##### FY-03 + FY-04 + FY-05: CreditCalculator (slider + recommendation)

Section içinde, SectionHeader'dan sonra. Ayrı component dosyası **gerekmez** — section içinde inline yeterli.

**Layout:** Tek white kart, içinde 2 kolon (lg grid). Sol: slider. Sağ: recommendation.

```tsx
{/* CreditCalculator — SectionHeader'dan sonra, mt-12 */}
<div className="mt-12 rounded-xl border border-rd-neutral-200 bg-white p-6 md:p-8">
  <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">

    {/* Sol: Slider */}
    <div>
      <label htmlFor="product-slider" className="block text-sm font-medium text-rd-neutral-600 mb-6">
        {SLIDER_CONFIG.label}
      </label>

      <div className="flex items-center gap-4">
        <span className="text-sm text-rd-neutral-400 tabular-nums w-8 text-right">{SLIDER_CONFIG.min}</span>
        <input
          id="product-slider"
          type="range"
          min={SLIDER_CONFIG.min}
          max={SLIDER_CONFIG.max}
          value={productCount}
          onChange={e => setProductCount(Number(e.target.value))}
          className="fiyatlar-slider flex-1"
          role="slider"
          aria-valuemin={SLIDER_CONFIG.min}
          aria-valuemax={SLIDER_CONFIG.max}
          aria-valuenow={productCount}
          aria-valuetext={`${productCount} ürün`}
        />
        <span className="text-sm text-rd-neutral-400 tabular-nums w-8">{SLIDER_CONFIG.max}</span>
      </div>

      {/* Seçilen değer */}
      <p className="mt-4 text-center">
        <span className="text-3xl font-bold text-rd-primary-700 tabular-nums" style={{ fontFamily: 'var(--font-rd-display)' }}>
          {productCount}
        </span>
        <span className="ml-2 text-sm text-rd-neutral-500">ürün / ay</span>
      </p>
    </div>

    {/* Sağ: Recommendation */}
    <div className="rounded-lg bg-rd-primary-50 p-5 border border-rd-primary-100" aria-live="polite">
      <p className="text-xs font-medium text-rd-primary-600 uppercase tracking-wider mb-2">
        {RECOMMENDATION_EYEBROW}
      </p>
      <p className="text-xl font-bold text-rd-neutral-900" style={{ fontFamily: 'var(--font-rd-display)' }}>
        {recommendedPackage.isim}
      </p>
      <p className="mt-1 text-sm text-rd-neutral-500">
        {recommendedPackage.kredi} kredi · {recommendedPackage.fiyatStr}
      </p>
      <p className="mt-2 text-xs text-rd-neutral-400">
        {productCount} ürün × {CREDIT_PER_PRODUCT} kredi = {productCount * CREDIT_PER_PRODUCT} kredi ihtiyacı
      </p>
    </div>

  </div>
</div>
```

**Slider custom CSS** — `globals.css`'e ekle:

```css
/* Fiyatlar slider */
.fiyatlar-slider {
  -webkit-appearance: none;
  appearance: none;
  height: 6px;
  border-radius: 3px;
  background: linear-gradient(to right, var(--color-rd-primary-500) var(--slider-fill, 0%), var(--color-rd-neutral-200) var(--slider-fill, 0%));
  outline: none;
  cursor: pointer;
}

.fiyatlar-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: white;
  border: 2px solid var(--color-rd-primary-500);
  cursor: pointer;
  transition: box-shadow 150ms ease;
}

.fiyatlar-slider::-webkit-slider-thumb:hover {
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--color-rd-primary-500) 15%, transparent);
}

.fiyatlar-slider:focus-visible::-webkit-slider-thumb {
  box-shadow: 0 0 0 3px var(--color-rd-primary-200);
}

.fiyatlar-slider::-moz-range-thumb {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: white;
  border: 2px solid var(--color-rd-primary-500);
  cursor: pointer;
}

.fiyatlar-slider::-moz-range-track {
  height: 6px;
  border-radius: 3px;
  background: var(--color-rd-neutral-200);
}

.fiyatlar-slider::-moz-range-progress {
  height: 6px;
  border-radius: 3px;
  background: var(--color-rd-primary-500);
}
```

**Slider fill JS** — gradient background'u slider değerine göre güncelle. `onChange` handler'a ekle:

```ts
const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const val = Number(e.target.value)
  setProductCount(val)
  const pct = ((val - SLIDER_CONFIG.min) / (SLIDER_CONFIG.max - SLIDER_CONFIG.min)) * 100
  e.target.style.setProperty('--slider-fill', `${pct}%`)
}
```

Slider'ın `onChange`'ini bu fonksiyonla değiştir. Ayrıca `useEffect` ile ilk render'da da `--slider-fill`'i set et (defaultValue'ya göre).

---

##### FY-06 + FY-07: PackageCard grid + "SENİN İÇİN" badge

CreditCalculator'dan sonra, `mt-12`.

```tsx
{/* PackageCards — 3 kolon grid */}
<div className="mt-12 grid gap-6 md:grid-cols-3 items-start">
  {PAKET_LISTESI.map(paket => {
    const isPopular = paket.rozet === true
    const isRecommended = paket.id === recommendedPackage.id

    return (
      <div
        key={paket.id}
        className={`
          relative rounded-xl border bg-white p-6 transition-transform duration-200
          ${isPopular
            ? 'border-rd-primary-500 border-2 md:-translate-y-2'
            : 'border-rd-neutral-200'
          }
        `}
      >
        {/* EN POPÜLER rozet — sadece popular pakette */}
        {isPopular && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <span className="inline-flex items-center rounded-full bg-rd-primary-600 px-3 py-1 text-xs font-medium text-white tracking-wide">
              En popüler
            </span>
          </div>
        )}

        {/* SENİN İÇİN badge — slider'a göre recommended pakette */}
        {isRecommended && (
          <div className={`absolute -top-3 ${isPopular ? 'right-4' : 'left-1/2 -translate-x-1/2'}`}>
            <span className="inline-flex items-center rounded-full bg-emerald-600 px-3 py-1 text-xs font-medium text-white tracking-wide">
              Senin için
            </span>
          </div>
        )}

        {/* Paket adı */}
        <h3 className="text-lg font-medium text-rd-neutral-900">{paket.isim}</h3>
        <p className="mt-1 text-sm text-rd-neutral-500">{paket.aciklama}</p>

        {/* Fiyat */}
        <p className="mt-5">
          <span className="text-4xl font-extrabold text-rd-neutral-900 tabular-nums" style={{ fontFamily: 'var(--font-rd-display)' }}>
            {paket.fiyatStr}
          </span>
          <span className="ml-1 text-sm text-rd-neutral-400">/ {paket.krediStr}</span>
        </p>

        {/* CTA */}
        <a
          href={FIYATLAR_CTA_ROUTE}
          className={`
            mt-5 block w-full rounded-lg py-2.5 text-center text-sm font-medium transition-colors
            ${isPopular
              ? 'bg-rd-primary-600 text-white hover:bg-rd-primary-700'
              : 'border border-rd-neutral-300 text-rd-neutral-700 hover:bg-rd-neutral-50'
            }
          `}
        >
          Paketi seç
        </a>

        {/* Özellikler — Lucide Check ikonu ile */}
        <ul className="mt-5 space-y-2.5" role="list">
          {paket.ozellikler.map((ozellik, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-rd-neutral-600">
              <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-rd-primary-500" aria-hidden="true" />
              <span>{ozellik}</span>
            </li>
          ))}
        </ul>
      </div>
    )
  })}
</div>
```

Import'a `Check` from `lucide-react` ekle.

**"SENİN İÇİN" badge davranışı:**
- Slider değiştikçe `recommendedPackage` useMemo ile güncellenir
- Badge ilgili karttan kaybolur, yeni karta geçer
- `isPopular && isRecommended` durumunda: popular rozet sol-üstte (veya üst-orta), senin için sağ-üstte — çakışmasın
- Badge position: popular pakette `right-4`, diğerlerinde `left-1/2 -translate-x-1/2`

---

##### FY-08: FooterNote (trust points)

PackageCards'dan sonra, `mt-10`.

```tsx
{/* Trust points */}
<p className="mt-10 text-center text-sm text-rd-neutral-400">
  {TRUST_POINTS.map((point, i) => (
    <span key={i}>
      {i > 0 && <span className="mx-2" aria-hidden="true">·</span>}
      {point}
    </span>
  ))}
</p>
```

---

##### FY-09: CTA route

Paket "Seç" butonu: `href={FIYATLAR_CTA_ROUTE}` → `/fiyatlar`.

Tüm 3 paket kartında aynı route. `/fiyatlar` sayfasında kullanıcı detaylı karşılaştırma + satın alma yapacak.

---

##### FY-10: Mobile responsive

- CreditCalculator: `lg:grid-cols-2` → mobilde tek kolon (default `grid-cols-1`)
- PackageCards: `md:grid-cols-3` → mobilde tek kolon
- Mobilde popular paket `md:-translate-y-2` → mobilde translateY yok (class zaten `md:` prefix ile)
- Mobilde popular paketi **ilk sıraya** almak önerilir ama `PAKET_LISTESI` sırası Başlangıç → Popüler → Büyük. Sıralama değiştirmeyeceğiz, mobilde de bu sıra kalır. (İstenmezse mobile'da `order-first` eklenebilir.)
- Slider: thumb boyutu 22px, touch-friendly (minimum 44px hit area — padding ile sağla)
- Slider min/max label'ları mobilde de görünsün

---

##### FY-11: A11y

- Slider: `role="slider"`, `aria-valuemin`, `aria-valuemax`, `aria-valuenow`, `aria-valuetext`
- Recommendation: `aria-live="polite"` — slider değiştikçe screen reader yeni paketi okur
- Section: `aria-labelledby="fiyatlar-heading"`
- Trust points ayraçları: `aria-hidden="true"`
- Check ikonları: `aria-hidden="true"`
- PackageCard: semantic `h3`
- Focus-visible: slider thumb'da ring
- Keyboard: Arrow keys ile slider kontrolü (native `<input type="range">` zaten destekler)

---

##### Kabul kontrol listesi (FY-12)

- [ ] `lib/constants/fiyatlar-landing.ts` oluştu, `lib/paketler.ts`'den import ediyor
- [ ] `components/sections/FiyatlarSection.tsx` oluştu, `'use client'`
- [ ] Slider 1-100 arası çalışıyor, mavi gradient fill
- [ ] Recommendation değişiyor (slider değerine göre)
- [ ] `aria-live="polite"` recommendation div'inde
- [ ] 3 paket kartı görünüyor, popular olanın 2px primary border + translateY
- [ ] "Senin için" yeşil badge slider'a göre doğru pakete geçiyor
- [ ] "En popüler" ve "Senin için" badge'leri çakışmıyor
- [ ] Trust points 4 madde, `·` ayraçlı
- [ ] CTA route: `/fiyatlar`
- [ ] `_tanitim-redesign.tsx`'e NedenYzlisteSection sonrası eklendi
- [ ] `globals.css`'e slider CSS eklendi
- [ ] Mobile: tek kolon, slider touch-friendly
- [ ] `npm run build` hatasız
- [ ] Emoji YOK
- [ ] Commit: `feat: FY-01~11 fiyatlar landing bölümü`

---

### SSS Bölümü — Bölüm 08

| ID | Başlık | Durum | Bağımlılık | Kabul Kriteri |
|---|---|---|---|---|
| SS-01 | Constants (`lib/constants/sss.ts`) | ✅ Tamam | DS-01 | FAQ_ITEMS (6 soru-cevap), SSS_COPY (header metinleri). |
| SS-02 | Section scaffold + SectionHeader + grid | ✅ Tamam | DS-07, SS-01 | `components/sections/SSSSection.tsx`. bg-white. 2 kolon grid (mobilde 1). |
| SS-03 | FAQItem (collapsible + animation) | ✅ Tamam | SS-02 | `grid-template-rows: 0fr→1fr` trick. +/− ikon dönüşümü. Açık: primary-50/30 bg, primary-200 border. 200ms geçiş. İlk item default açık. |
| SS-04 | ContactNote | ✅ Tamam | SS-02 | Mail ikon + "Daha fazla soru?" + email mailto link + "Tüm sorular →" link. slate-50 bg. |
| SS-05 | A11y + responsive pass | ✅ Tamam | SS-03, SS-04 | `aria-expanded`. Klavye aç/kapat. Mobile: 1 kolon. WCAG AA. |
| SS-06 | Acceptance review | Bekliyor | SS-05 | Aziz preview kontrolü. 6 item test. |

**Durum:** Prompt hazır — Claude Code'a verilebilir.

#### SS-01~05 Birleşik Prompt

> **ÖNEMLİ — İÇERİK KURALI:** Canlı sitedeki örnek çıktıları (üretilmiş text/görsel/video/sosyal örnekleri) olduğu gibi koru. Diğer metinler (başlık, açıklama, SSS cevapları, CTA) tasarıma uygun şekilde değiştirilebilir.

> **Hedef:** Landing page'e "Sık sorulan sorular" bölümü ekle. Mevcut `/sss` sayfasından en kritik 6 soruyu seç, collapsible accordion UI, iletişim notu.

---

##### SS-01: Constants — `lib/constants/sss-landing.ts`

Mevcut `app/sss/page.tsx`'deki `SORULAR` dizisinden landing page için en önemli 6 soru seçildi. Fiyat güncellendi (49₺).

```ts
// lib/constants/sss-landing.ts

export const SSS_HEADER = {
  eyebrow: 'Sık sorulan sorular',
  title: 'Merak ettiklerin',
  subtitle: 'Cevabını bulamazsan destek@yzliste.com adresine yaz.',
}

export const FAQ_ITEMS = [
  {
    question: 'Kredi nedir, nasıl çalışır?',
    answer: 'Her içerik üretimi kredi tüketir. Listing metni 1 kredi, görsel 1 kredi (stil başına), sosyal medya 1 kredi, video 10-20 kredi. Kayıt olunca 3 ücretsiz kredi hediye edilir.',
  },
  {
    question: 'Kredilerim süresiz mi?',
    answer: 'Evet. Satın alınan kredilerin son kullanma tarihi yoktur. Hesabınızda kaldığı sürece geçerlidir.',
  },
  {
    question: 'Abonelik var mı?',
    answer: 'Hayır. yzliste tamamen kullandığın kadar öde modeli ile çalışır. Aylık abonelik yoktur. 49₺\'den başlayan kredi paketleri mevcuttur.',
  },
  {
    question: 'Hangi pazaryerlerini destekliyorsunuz?',
    answer: 'Trendyol, Hepsiburada, Amazon TR, N11, Etsy ve Amazon USA. Her platform için başlık uzunlukları, özellik sayısı ve dil kuralları ayrı ayrı optimize edilmiştir.',
  },
  {
    question: 'Fotoğraf olmadan kullanabilir miyim?',
    answer: 'Evet. Ürün adı ve birkaç özellik yazarak metin üretebilirsiniz. Fotoğraf yüklerseniz AI ürünü otomatik analiz eder ve daha doğru içerik üretir.',
  },
  {
    question: 'İade nasıl yapılır?',
    answer: 'Kullanılmamış krediler için satın alma tarihinden itibaren 14 gün içinde destek@yzliste.com adresine yazarak iade talep edebilirsiniz.',
  },
] as const

export const CONTACT_NOTE = {
  text: 'Daha fazla soru mu var?',
  email: 'destek@yzliste.com',
  allQuestionsLink: '/sss',
  allQuestionsText: 'Tüm sorular',
}
```

---

##### SS-02: Section scaffold — `components/sections/SSSSection.tsx`

`'use client'` — accordion state gerektirir.

```tsx
// components/sections/SSSSection.tsx
'use client'

import { useState } from 'react'
import SectionHeader from '@/components/primitives/SectionHeader'
import { ChevronDown, Mail, ArrowRight } from 'lucide-react'
import {
  SSS_HEADER,
  FAQ_ITEMS,
  CONTACT_NOTE,
} from '@/lib/constants/sss-landing'

export default function SSSSection() {
  // İlk item default açık
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggle = (i: number) => {
    setOpenIndex(prev => (prev === i ? null : i))
  }

  return (
    <section className="py-20 md:py-28 bg-white" aria-labelledby="sss-heading">
      <div className="mx-auto max-w-3xl px-5">
        <SectionHeader
          eyebrow={SSS_HEADER.eyebrow}
          eyebrowColor="primary"
          title={SSS_HEADER.title}
          subtitle={SSS_HEADER.subtitle}
          id="sss-heading"
        />

        {/* FAQ list */}
        <div className="mt-12 divide-y divide-rd-neutral-200" role="list">
          {FAQ_ITEMS.map((item, i) => (
            <FAQItem
              key={i}
              question={item.question}
              answer={item.answer}
              isOpen={openIndex === i}
              onToggle={() => toggle(i)}
              index={i}
            />
          ))}
        </div>

        {/* ContactNote */}
        {/* ... */}
      </div>
    </section>
  )
}
```

**Not:** `max-w-3xl` (768px) — FAQ tek kolon, geniş ekranda bile dar tutulur (okunabilirlik). 2 kolon grid ticket'ta vardı ama 6 soru için tek kolon daha okunur. Claude Code bunu `max-w-3xl` ile yapsın; **2 kolon gerekmez.**

---

##### SS-03: FAQItem (collapsible + animation)

Section dosyası içinde inline component (ayrı dosya gerekmez).

```tsx
function FAQItem({
  question,
  answer,
  isOpen,
  onToggle,
  index,
}: {
  question: string
  answer: string
  isOpen: boolean
  onToggle: () => void
  index: number
}) {
  const id = `faq-${index}`

  return (
    <div role="listitem">
      <button
        id={`${id}-trigger`}
        aria-expanded={isOpen}
        aria-controls={`${id}-panel`}
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 py-5 text-left transition-colors hover:text-rd-primary-600"
      >
        <span className="text-sm font-medium text-rd-neutral-900">{question}</span>
        <ChevronDown
          className={`h-4 w-4 flex-shrink-0 text-rd-neutral-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      <div
        id={`${id}-panel`}
        role="region"
        aria-labelledby={`${id}-trigger`}
        className="grid transition-[grid-template-rows] duration-200 ease-out"
        style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <p className="pb-5 text-sm leading-relaxed text-rd-neutral-500">
            {answer}
          </p>
        </div>
      </div>
    </div>
  )
}
```

**Animasyon detayları:**
- `grid-template-rows: 0fr → 1fr` trick — smooth height animation
- `overflow-hidden` on inner div
- `duration-200 ease-out`
- ChevronDown `rotate-180` when open
- İlk item (`index === 0`) default açık (`openIndex` state = 0)
- Aynı anda sadece 1 item açık (accordion behavior)

**Açık item'da ek stil yok** — ticket'ta "primary-50 bg, primary-200 border" vardı ama 6 item'lık düz accordion'da gereksiz. Sadece hover + ChevronDown dönüşü yeterli. Claude Code bu basit versiyonu implemente etsin.

---

##### SS-04: ContactNote

FAQ listesinden sonra, `mt-10`.

```tsx
{/* ContactNote */}
<div className="mt-10 flex flex-col items-center gap-3 rounded-lg bg-rd-neutral-50 p-6 text-center sm:flex-row sm:justify-between sm:text-left">
  <div className="flex items-center gap-3">
    <Mail className="h-5 w-5 text-rd-neutral-400" aria-hidden="true" />
    <div>
      <p className="text-sm font-medium text-rd-neutral-700">{CONTACT_NOTE.text}</p>
      <a
        href={`mailto:${CONTACT_NOTE.email}`}
        className="text-sm text-rd-primary-600 hover:text-rd-primary-700 transition-colors"
      >
        {CONTACT_NOTE.email}
      </a>
    </div>
  </div>
  <a
    href={CONTACT_NOTE.allQuestionsLink}
    className="inline-flex items-center gap-1 text-sm text-rd-primary-600 hover:text-rd-primary-700 transition-colors"
  >
    {CONTACT_NOTE.allQuestionsText}
    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
  </a>
</div>
```

---

##### SS-05: A11y + responsive

**A11y:**
- `role="list"` on container, `role="listitem"` on each FAQItem
- `aria-expanded` on trigger button
- `aria-controls` pointing to panel id
- `role="region"` on panel with `aria-labelledby`
- ChevronDown `aria-hidden="true"`
- Mail + ArrowRight icons `aria-hidden="true"`
- Keyboard: Enter/Space toggle (native `<button>` handles this)

**Responsive:**
- `max-w-3xl` → mobilde de full width (padding handles it)
- ContactNote: `flex-col` → `sm:flex-row`
- No 2-column → single column throughout
- Touch targets: button `py-5` = 40px+ height, adequate

**Reduced motion:**
- `grid-template-rows` transition + ChevronDown rotation: Add `@media (prefers-reduced-motion: reduce)` to disable both → `globals.css`'e ekle:
```css
@media (prefers-reduced-motion: reduce) {
  [id^="faq-"][role="region"] {
    transition: none;
  }
}
```

---

##### SS-02~SS-05 entegrasyon notu

`_tanitim-redesign.tsx`'de FiyatlarSection'dan **sonra** ekle:

```tsx
import SSSSection from '@/components/sections/SSSSection'

// ... inside <main>
<FiyatlarSection />
<SSSSection />
```

---

##### Kabul kontrol listesi (SS-06)

- [ ] `lib/constants/sss-landing.ts` oluştu, 6 soru-cevap doğru
- [ ] Fiyat "49₺" doğru (eski "29₺"/"39₺" yok)
- [ ] `components/sections/SSSSection.tsx` oluştu, `'use client'`
- [ ] Accordion çalışıyor: tıklayınca aç/kapat, aynı anda sadece 1 açık
- [ ] İlk item default açık
- [ ] `grid-template-rows` animasyonu smooth
- [ ] ChevronDown 180° dönüyor
- [ ] `aria-expanded` doğru toggle oluyor
- [ ] ContactNote: email mailto link, "Tüm sorular" → `/sss`
- [ ] `_tanitim-redesign.tsx`'e FiyatlarSection sonrası eklendi
- [ ] Mobile: tek kolon, touch-friendly
- [ ] `npm run build` hatasız
- [ ] Emoji YOK
- [ ] Commit: `feat: SS-01~05 sss landing bölümü`

---

### Final CTA Bölümü — Bölüm 09

| ID | Başlık | Durum | Bağımlılık | Kabul Kriteri |
|---|---|---|---|---|
| FC-01 | Constants (`lib/constants/final-cta.ts`) | ✅ Tamam | DS-01 | FINAL_CTA_COPY (eyebrow, heading, subheading, ctaText, reassurance). |
| FC-02 | Section + gradient bg | ✅ Tamam | DS-02, FC-01 | `components/sections/FinalCTASection.tsx`. `linear-gradient(135deg, primary-600, primary-700)`. |
| FC-03 | Container + content | ✅ Tamam | FC-02 | Max-w 720px. EyebrowBadge (beyaz transparan). H2 white. Sub white/80. CTA (white bg, primary-700 text, shadow, hover lift). ReassuranceLine white/70. |
| FC-04 | (Opsiyonel) Background pattern | ✅ Tamam | FC-02 | Subtle dot pattern veya radial glow. |
| FC-05 | Mobile responsive + a11y | ✅ Tamam | FC-03 | Mobile: CTA full width. Focus-visible. Semantic h2. |
| FC-06 | Acceptance review | Bekliyor | FC-05 | Aziz preview kontrolü. |
| FC-FIX-01 | `--color-rd-primary-600` token eksikliği + FC render | ✅ Tamam | FC-05 | globals.css'te `--color-rd-primary-600: #2563EB;` (Tailwind blue-600) tanımı eklendi (satır 24). Sıra: 500 → **600** → 700. |
| FC-FIX-02 | FC gradient hâlâ render olmuyor — `-z-10` stacking context bug | ✅ Tamam | FC-FIX-01 | Gradient `<section style>` üzerine taşındı, `-z-10` kaldırıldı, radial glow `pointer-events-none` overlay. Preview'da mavi gradient + H1 + beyaz CTA görünüyor. |
| TOKEN-FIX-01 | Faz 2 öncesi eksik token'ları tamamla | ✅ Tamam | FT-09 | globals.css'te eksik renkler ve platformlar eklenir. **Semantik:** rd-success (50, 600, 700), rd-warning (50, 600, 700), rd-danger (50, 600, 700). **Platform:** rd-platform-hepsiburada + bg, rd-platform-n11 + bg. /uret refactor'da bunlar olmadan tıkanırız (yetersiz kredi danger, marka eksik warning, başarı success). |
| FY-FIX-02 | (kontrol) Popüler rozeti hâlâ render oluyor mu | Bekliyor | FY-FIX-01 | Aziz screenshot'ında orta paket üstünde "En popüler" rozeti görünmüyor olabilir. Önce Aziz scroll ile doğrulayacak; gerçekten yoksa Claude Code rozet bloğunun (FiyatlarSection.tsx satır 135-141) hâlâ render olduğunu doğrulasın. |

**Durum:** Prompt hazır — Claude Code'a verilebilir.

#### FC-01~05 Birleşik Prompt

> **ÖNEMLİ — İÇERİK KURALI:** Canlı sitedeki örnek çıktıları (üretilmiş text/görsel/video/sosyal örnekleri) olduğu gibi koru. Diğer metinler (başlık, açıklama, CTA) tasarıma uygun şekilde değiştirilebilir.

> **Hedef:** Landing page'in son bölümü olarak güçlü bir CTA bandı ekle. Gradient bg, kısa mesaj, tek buton. Kullanıcıyı kayıt sayfasına yönlendir.

---

##### FC-01: Constants — `lib/constants/final-cta.ts`

```ts
// lib/constants/final-cta.ts

export const FINAL_CTA = {
  eyebrow: 'Hemen başla',
  title: 'İlk 3 kredi hediye',
  subtitle: 'Kayıt ol, ürün fotoğrafını yükle, saniyeler içinde listing metni hazır.',
  ctaText: 'Ücretsiz başla',
  ctaRoute: '/kayit',
  reassurance: 'Kredi kartı gerekmez · 3 ücretsiz kredi · Abonelik yok',
}
```

---

##### FC-02 + FC-03: Section — `components/sections/FinalCTASection.tsx`

Server component yeterli (state yok).

```tsx
// components/sections/FinalCTASection.tsx
import { ArrowRight } from 'lucide-react'
import { FINAL_CTA } from '@/lib/constants/final-cta'

export default function FinalCTASection() {
  return (
    <section className="relative overflow-hidden py-20 md:py-28" aria-labelledby="final-cta-heading">
      {/* Gradient background */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: 'linear-gradient(135deg, var(--color-rd-primary-600), var(--color-rd-primary-700))',
        }}
        aria-hidden="true"
      />

      {/* Optional: subtle radial glow */}
      <div
        className="absolute inset-0 -z-10 opacity-30"
        style={{
          background: 'radial-gradient(ellipse at 30% 50%, var(--color-rd-primary-400), transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div className="mx-auto max-w-2xl px-5 text-center">
        {/* Eyebrow */}
        <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white/90 tracking-wide backdrop-blur-sm">
          {FINAL_CTA.eyebrow}
        </span>

        {/* Title */}
        <h2
          id="final-cta-heading"
          className="mt-5 text-3xl font-bold text-white md:text-4xl"
          style={{ fontFamily: 'var(--font-rd-display)', letterSpacing: '-0.02em', lineHeight: '1.3' }}
        >
          {FINAL_CTA.title}
        </h2>

        {/* Subtitle */}
        <p className="mt-4 text-base text-white/80 leading-relaxed md:text-lg">
          {FINAL_CTA.subtitle}
        </p>

        {/* CTA Button — white bg, primary text */}
        <div className="mt-8">
          <a
            href={FINAL_CTA.ctaRoute}
            className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-medium text-rd-primary-700 transition-all hover:bg-white/90 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-rd-primary-700"
          >
            {FINAL_CTA.ctaText}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>

        {/* Reassurance */}
        <p className="mt-5 text-sm text-white/60">
          {FINAL_CTA.reassurance}
        </p>
      </div>
    </section>
  )
}
```

**Tasarım notları:**
- Gradient: `primary-600 → primary-700` (135°) — derin mavi
- Radial glow: `primary-400` opacity 30% — opsiyonel subtle ışık efekti (FC-04)
- Eyebrow: white/15 bg + backdrop-blur — transparan rozet
- CTA: beyaz bg, primary-700 text, hover lift (`-translate-y-0.5`)
- `max-w-2xl` (672px) — dar ve odaklı
- `font-bold` kullanıldı (redesign branch'te 400-800 serbest)

---

##### FC-04: Background pattern (opsiyonel)

Yukarıdaki radial glow yeterli. Dot pattern eklemek istenirse:

```css
/* globals.css — opsiyonel */
.final-cta-dots {
  background-image: radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px);
  background-size: 24px 24px;
}
```

Kullanım: `<div className="absolute inset-0 -z-10 final-cta-dots" aria-hidden="true" />` — gradient'in üstüne. Claude Code bunu atlayabilir, radial glow yeterli.

---

##### FC-05: Responsive + a11y

**Responsive:**
- `py-20 md:py-28` — mobilde daha sıkı
- `text-3xl md:text-4xl` — mobilde biraz küçük
- CTA buton: mobilde de inline, full width gerekmez (kısa metin)
- `max-w-2xl px-5` — mobilde side padding yeterli

**A11y:**
- `aria-labelledby="final-cta-heading"`
- Gradient + glow divler `aria-hidden="true"`
- ArrowRight `aria-hidden="true"`
- Focus-visible: white ring with offset (gradient bg'da görünsün)
- Kontrast: white text on primary-600/700 → AA geçer (4.5:1+)

---

##### Entegrasyon

`_tanitim-redesign.tsx`'de SSSSection'dan **sonra**, Footer'dan **önce** ekle:

```tsx
import FinalCTASection from '@/components/sections/FinalCTASection'

// ... inside <main>
<SSSSection />
<FinalCTASection />
```

---

##### Kabul kontrol listesi (FC-06)

- [ ] `lib/constants/final-cta.ts` oluştu
- [ ] `components/sections/FinalCTASection.tsx` oluştu, server component
- [ ] Gradient bg mavi (primary-600 → primary-700)
- [ ] Eyebrow transparan rozet (white/15)
- [ ] CTA beyaz buton, hover lift
- [ ] Reassurance text white/60
- [ ] `_tanitim-redesign.tsx`'e SSSSection sonrası eklendi
- [ ] Mobile: düzgün padding, text responsive
- [ ] Kontrast: beyaz metin okunuyor
- [ ] `npm run build` hatasız
- [ ] Emoji YOK
- [ ] Commit: `feat: FC-01~05 final cta bölümü`

---

### Footer Bölümü — Bölüm 10

| ID | Başlık | Durum | Bağımlılık | Kabul Kriteri |
|---|---|---|---|---|
| FT-01 | Constants (`lib/constants/footer.ts`) | ✅ Tamam | DS-01 | FOOTER_BRAND, FOOTER_COLUMNS (3 sütun: Ürün/Şirket/Yasal), FOOTER_DISCLAIMER, COMPANY_INFO. |
| FT-02 | Footer scaffold + grid | ✅ Tamam | FT-01 | `components/sections/Footer.tsx`. bg-slate-50, border-top. 4 kolon grid. |
| FT-03 | BrandColumn | ✅ Tamam | FT-02 | Logo (Manrope 800) + tagline + lokasyon (Lucide MapPin, bayrak emojisi yerine). |
| FT-04 | Link columns (3 sütun) | ✅ Tamam | FT-02 | Ürün, Şirket, Yasal. Title uppercase. Links hover primary-700. Email mailto. |
| FT-05 | FooterMid (copyright + badges) | ✅ Tamam | FT-02 | Copyright sol, iyzico + SSL badge sağ. |
| FT-06 | FooterDisclaimer | ✅ Tamam | FT-02 | 12px italic slate-500, max-w 800px. Pazaryeri isimleri hakkında yasal not. |
| FT-07 | iyzico + SSL badge asset | ✅ Tamam | FT-05 | PNG/SVG asset public/ altına. Aziz'den asset gelecek. |
| FT-08 | Mobile responsive | ✅ Tamam | FT-06 | Mobile: 1 kolon. FooterMid dikey. |
| FT-09 | A11y (semantic `<footer>`) | ✅ Tamam | FT-08 | `<footer>` tag. Link labels. WCAG AA. |
| FT-10 | Acceptance review | Bekliyor | FT-09 | Aziz preview kontrolü. |

**Durum:** Prompt hazır — Claude Code'a verilebilir.

#### FT-01~09 Birleşik Prompt

> **ÖNEMLİ — İÇERİK KURALI:** Canlı sitedeki örnek çıktıları (üretilmiş text/görsel/video/sosyal örnekleri) ve mevcut görsel öğeleri (toplar vb.) olduğu gibi koru. Diğer metinler (footer linkleri, copyright, disclaimer) tasarıma uygun şekilde değiştirilebilir.

> **Hedef:** Landing page footer'ı. 4 kolon grid (brand + 3 link grubu), altında copyright + iyzico badge, en altta yasal disclaimer. Mevcut `SiteFooter.tsx` referans, redesign token'larına taşınacak.

---

##### FT-01: Constants — `lib/constants/footer-landing.ts`

```ts
// lib/constants/footer-landing.ts

export const FOOTER_BRAND = {
  name: 'yzliste',
  tagline: 'Pazaryeri içeriklerini AI ile üret',
  location: 'Türkiye',
}

export const FOOTER_COLUMNS = [
  {
    title: 'Ürün',
    links: [
      { label: 'Fiyatlar', href: '/fiyatlar' },
      { label: 'Blog', href: '/blog' },
      { label: 'Sık sorulan sorular', href: '/sss' },
    ],
  },
  {
    title: 'Şirket',
    links: [
      { label: 'Hakkımızda', href: '/hakkimizda' },
      { label: 'İletişim', href: 'mailto:destek@yzliste.com' },
    ],
  },
  {
    title: 'Yasal',
    links: [
      { label: 'Kullanım koşulları', href: '/kosullar' },
      { label: 'Gizlilik politikası', href: '/gizlilik' },
      { label: 'Mesafeli satış', href: '/mesafeli-satis' },
      { label: 'Teslimat ve iade', href: '/teslimat-iade' },
      { label: 'KVKK aydınlatma', href: '/kvkk-aydinlatma' },
      { label: 'Çerez politikası', href: '/cerez-politikasi' },
    ],
  },
] as const

export const FOOTER_COPYRIGHT = '© 2026 yzliste · SIMOON PAZARLAMA VE DANISMANLIK LIMITED SIRKETI'

export const FOOTER_DISCLAIMER = 'yzliste; Trendyol, Hepsiburada, Amazon, N11 ve Etsy ile resmi bir iş birliği içinde değildir. Belirtilen marka adları yalnızca desteklenen pazaryerlerini tanımlamak için kullanılmaktadır. Tüm markalar kendi sahiplerine aittir.'

export const FOOTER_IYZICO_LOGO = '/iyzico_footer_logo.png'
```

---

##### FT-02 + FT-03 + FT-04: Footer scaffold + grid

Server component (state yok).

```tsx
// components/sections/FooterSection.tsx
import Link from 'next/link'
import { MapPin } from 'lucide-react'
import {
  FOOTER_BRAND,
  FOOTER_COLUMNS,
  FOOTER_COPYRIGHT,
  FOOTER_DISCLAIMER,
  FOOTER_IYZICO_LOGO,
} from '@/lib/constants/footer-landing'

export default function FooterSection() {
  return (
    <footer className="border-t border-rd-neutral-200 bg-rd-neutral-50 pt-12 pb-8" role="contentinfo">
      <div className="mx-auto max-w-6xl px-5">

        {/* Top grid: brand + 3 link columns */}
        <div className="grid gap-8 md:grid-cols-4">

          {/* Brand column */}
          <div>
            <p
              className="text-lg font-bold text-rd-neutral-900"
              style={{ fontFamily: 'var(--font-rd-display)' }}
            >
              {FOOTER_BRAND.name}
            </p>
            <p className="mt-2 text-sm text-rd-neutral-500">{FOOTER_BRAND.tagline}</p>
            <p className="mt-3 flex items-center gap-1.5 text-xs text-rd-neutral-400">
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              {FOOTER_BRAND.location}
            </p>
          </div>

          {/* Link columns */}
          {FOOTER_COLUMNS.map(col => (
            <div key={col.title}>
              <p className="text-xs font-medium text-rd-neutral-400 uppercase tracking-wider">
                {col.title}
              </p>
              <ul className="mt-3 space-y-2" role="list">
                {col.links.map(link => (
                  <li key={link.href}>
                    {link.href.startsWith('mailto:') ? (
                      <a
                        href={link.href}
                        className="text-sm text-rd-neutral-600 transition-colors hover:text-rd-primary-600"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-rd-neutral-600 transition-colors hover:text-rd-primary-600"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="mt-10 border-t border-rd-neutral-200" aria-hidden="true" />

        {/* FooterMid: copyright + iyzico */}
        <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <p className="text-xs text-rd-neutral-400">{FOOTER_COPYRIGHT}</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={FOOTER_IYZICO_LOGO}
            alt="iyzico ile güvenli ödeme"
            className="h-6 w-auto"
          />
        </div>

        {/* Disclaimer */}
        <p className="mt-6 mx-auto max-w-3xl text-center text-xs italic text-rd-neutral-400 leading-relaxed">
          {FOOTER_DISCLAIMER}
        </p>

      </div>
    </footer>
  )
}
```

**Tasarım notları:**
- `bg-rd-neutral-50` + `border-t border-rd-neutral-200` — soft separator
- Brand name: Manrope 800 (`font-bold` + display font)
- Location: Lucide MapPin (bayrak emojisi yasak)
- Link columns: uppercase title, text links hover primary-600
- `<Link>` for internal, `<a>` for mailto
- iyzico logo: mevcut `public/iyzico_footer_logo.png` kullanılır

---

##### FT-05: FooterMid (copyright + badges)

Yukarıdaki kodda zaten var. `sm:flex-row sm:justify-between` — mobilde dikey, masaüstünde yatay.

**FT-07 (iyzico asset):** Mevcut `public/iyzico_footer_logo.png` dosyası kullanılacak. Yeni asset gerekmez. SSL badge şimdilik yok — Aziz'den gelirse eklenebilir.

---

##### FT-08: Mobile responsive

- Grid: `md:grid-cols-4` → mobilde `grid-cols-1` (default)
- Mobilde brand column üstte, link columns alta sıralanır
- FooterMid: `flex-col` → `sm:flex-row`
- Disclaimer: `max-w-3xl mx-auto text-center` — mobilde de okunur

---

##### FT-09: A11y

- `<footer>` semantic tag + `role="contentinfo"`
- Link listleri `role="list"` + `<li>` items
- MapPin + divider `aria-hidden="true"`
- iyzico logo: `alt="iyzico ile güvenli ödeme"`
- Focus-visible: links default browser outline yeterli (veya `focus-visible:text-rd-primary-600`)

---

##### Entegrasyon

`_tanitim-redesign.tsx`'de FinalCTASection'dan **sonra**, `</main>`'den sonra ekle (footer main dışında):

```tsx
import FooterSection from '@/components/sections/FooterSection'

// ... layout
<main>
  ...
  <FinalCTASection />
</main>
<FooterSection />
```

---

##### Kabul kontrol listesi (FT-10)

- [ ] `lib/constants/footer-landing.ts` oluştu
- [ ] `components/sections/FooterSection.tsx` oluştu, server component
- [ ] 4 kolon grid: brand + Ürün + Şirket + Yasal
- [ ] Brand: Manrope, MapPin lokasyon (emoji yok)
- [ ] Linkler doğru route'lara gidiyor
- [ ] iyzico logo görünüyor
- [ ] Copyright doğru
- [ ] Disclaimer italic, küçük
- [ ] `_tanitim-redesign.tsx`'e main dışında, en sonda eklendi
- [ ] Mobile: tek kolon, FooterMid dikey
- [ ] `npm run build` hatasız
- [ ] Emoji YOK
- [ ] Commit: `feat: FT-01~09 footer bölümü`

---

### Açık Sorular (Aziz kararı bekliyor)

**Grup A — Route'lar (tek seferde cevaplanabilir)**

| # | Kaynak | Soru | Varsayılan |
|---|---|---|---|
| Q1 | Hero | "Giriş yap" buton route | ✅ Mevcut auth route | Cowork bulacak |
| Q2 | IT-02 | "Hemen üret" CTA | ✅ `/uret` | — |
| Q3 | Marka | "Marka profilimi oluştur →" CTA | ✅ `/uret` | — |
| Q4 | Fiyatlar | Paket "Seç" butonu | ✅ `/fiyatlar` | — |
| Q5 | Final CTA | "Ücretsiz başla" CTA | ✅ `/kayit` | — |

**Grup B — Rakam doğrulamaları**

| # | Kaynak | Soru | Varsayılan |
|---|---|---|---|
| Q6 | Hero | "28 saniyede üretildi" | ✅ Muğlak yap | "Saniyeler içinde üretildi" kullanılacak |
| Q7 | 3 Adım | "5sn / 10sn / 15sn → 30 saniye toplam" | ✅ Muğlak yap | Kesin rakam yerine "birkaç saniye" / "kısa sürede" |
| Q8 | IT | Süre rakamları (10sn, 30sn, 2dk, 20sn) | ✅ Muğlak yap | "~saniyeler", "~1 dakika" gibi yumuşak ifadeler |
| Q9 | IT | Kredi rakamları (1, 1/stil, 2-3, 3/kit) | ✅ Muğlak yap | Kesin rakam verilmez, "düşük kredi" gibi ifadeler |
| Q10 | Fiyatlar | Gerçek paket isimleri ve fiyatları? | ⏳ Cevap bekliyor | Cowork `/fiyatlar`'dan okuyacak, Aziz onaylayacak |
| Q11 | Fiyatlar | CREDIT_PER_PRODUCT = 4 varsayımı | ⏳ Cevap bekliyor | Fiyatlar bölümüne gelince netleşecek |
| Q12 | Fiyatlar | "Faturalandırma desteği" doğru mu? | ⏳ Cevap bekliyor | Fiyatlar bölümüne gelince netleşecek |

**Grup C — İçerik/metin kararları**

| # | Kaynak | Soru | Varsayılan |
|---|---|---|---|
| Q13 | Pazaryeri | Görsel placeholder: gerçek ürün görseli mi, Lucide ikon mi? | Pilot: Lucide |
| Q14 | Pazaryeri | Demo metinler: mockup "Selin Porselen" mi, gerçek ürün mü? | Pilot: mockup metni |
| Q15 | Pazaryeri | Sosyal medya: Trendyol→Instagram+TikTok, Amazon/Etsy→Instagram+Pinterest? | Evet |
| Q16 | Neden | "Türkçe karakterler ve gramer zayıf" satırı | ✅ Jargon versiyonu | "Türk e-ticaret jargonunu bilmez" olacak |
| Q17 | Neden | Provokatif başlık — rakip isimleri | ✅ Marka isimleri YOK | "Neden genel AI araçları değil?" gibi, ChatGPT/Claude ismen anılmayacak |
| Q18 | Neden | Footnote | ✅ Güncellenmeli | Marka isimleri yerine "Genel AI araçları harika asistanlardır..." |
| Q19 | Marka | Ton metinleri mockup'tan mı, gerçek AI çıktısı mı? | Pilot: mockup |
| Q20 | Marka | Hedef kitle örneği "25-45 yaş kadın · Çeyiz, hediye" ok mu? | Evet |
| Q21 | 3 Adım | Mini mockup içerikleri (fincan, Trendyol+Amazon) ok mu? | Evet |
| Q22 | SSS | Pazaryeri listesi: PttAVM dahil mi? | Mevcut siteyi kontrol |
| Q23 | SSS | `destek@yzliste.com` doğru email mi? | Evet varsayıldı |

**Grup D — Teknik/asset soruları**

| # | Kaynak | Soru | Varsayılan |
|---|---|---|---|
| Q24 | Hero | `/uret` sayfası screenshot için kaliteli mi, yoksa redesign bekliyor mu? | Placeholder kullan |
| Q25 | Hero | "Nasıl çalışır?" video mevcut mu? (YouTube/Vimeo/mp4) | Pilot: placeholder |
| Q26 | Hero | Logo yanında "Beta" badge olsun mu? | Olsun |
| Q27 | Footer | /hakkimizda, /iletisim, /blog sayfaları mevcut mu? | Cowork kontrol eder |
| Q28 | Footer | iyzico logo asset (PNG/SVG) mevcut mu? | Aziz sağlar |
| Q29 | Footer | Yasal sayfalar (KVKK, gizlilik vb.) güncel ve dolu mu? | Cowork kontrol eder |

---

## /uret Sayfası UX Refactor

**Yaklaşım:** Hafif refaktör (Yaklaşım A) — mevcut iskelet korunur, 5 UX iyileştirmesi.
**Spec:** `uret-ux-redesign-spec.md` | **Mockup:** `uret-redesign-mockup.jsx` | **Kararlar:** `uret-redesign-kararlar.md`
**Branch:** `claude/redesign-modern-ui` (anasayfa redesign ile aynı branch)
**Korunacaklar:** 4 sekme yapısı, 7 stüdyo stil grid, 5 video hareket preset, karakter limit eyebrow, üst fotoğraf yükleme alanı.

**Karar özeti (27 Nisan 2026):**
- "ADIM 1/3" kalıyor (3 adım akışıyla uyumlu)
- Yetersiz kredi → disabled buton + tooltip "Yetersiz kredi. Paket al →" + `/fiyatlar` link
- Marka profili kayıt → `/profil` sayfasına yönlendirme
- Demo tonu → sadece önizleme, gerçek üretimde kullanılmaz
- "Sosyal medya kiti" konsepti → kaldırıldı, tek akış yeterli
- Tooltip metinleri → kısa versiyonlar ("Önce ürün adını yaz")
- Emoji → mockup'taki emojiler Lucide ikonlarla değiştirilecek (Coffee, Heart, Briefcase, Sparkles)

### Grup 1 — Renk Paleti Uyumu (bağımlılık: hepsinden önce)

| ID | Başlık | Durum | Bağımlılık | Kabul Kriteri |
|---|---|---|---|---|
| U-01 | Renk paleti: bej → slate dönüşümü | Bekliyor | — | `#F1F0EB`→`slate-100`, `#D8D6CE`→`slate-200`, `#FAFAF8`→`slate-50`, `#5A5852`→`slate-600`, `#1A1A17`→`slate-900`, `#908E86`→`slate-400`, `#1E4DD8`→`#1E40AF`. Tüm `/uret` sayfasında eski renk kodu kalmamış. |

### Grup 2 — Niyet Hatırlatıcı (Intent Banner)

| ID | Başlık | Durum | Bağımlılık | Kabul Kriteri |
|---|---|---|---|---|
| U-02 | Sarı marka uyarısı banner'ını kaldır | Bekliyor | U-01 | Mevcut sarı "Marka profilinizi doldurun" banner'ı kaldırılmış veya taşınmış. |
| U-03 | IntentBanner component ekle | Bekliyor | U-02 | Sayfanın en üstünde: Eyebrow "ADIM 1 / 3 — NE ÜRETMEK İSTİYORSUN?" + H1 "İçerik türünü seç" + subtitle. White bg, slate-200 border, 16px radius, 24px padding. |

### Grup 3 — Marka Profili Interaktif Demo

| ID | Başlık | Durum | Bağımlılık | Kabul Kriteri |
|---|---|---|---|---|
| U-04 | BrandProfileBlock scaffold (collapsible) | Bekliyor | U-02 | Kapalıyken: turuncu border-left, "Marka profili eksik" + "Önce dene" buton. Açıkken: demo alanı görünür. Collapsible animasyon. |
| U-05 | ToneSelector (3 chip, radio group) | Bekliyor | U-04 | 3 chip: Samimi (Heart ikon) / Profesyonel (Briefcase) / Premium (Sparkles). `role="radiogroup"`, `aria-checked`. Arrow Left/Right. Sadece biri aktif. |
| U-06 | AIPreview (canlı değişen çıktı, fade) | Bekliyor | U-05 | Ton seçilince 300ms fade ile AI çıktı önizlemesi değişir. `aria-live="polite"`. Banner turuncu→yeşil dönüşür. Not: "Bu sadece önizleme. Tonu kalıcı yapmak için profilini kaydet." |
| U-07 | "Profili düzenle" CTA → `/profil` | Bekliyor | U-04 | Tıklayınca `/profil` sayfasına yönlendiriyor. Outline stil buton. |

### Grup 4 — Canlı Kredi Maliyeti (Sticky Submit Bar)

| ID | Başlık | Durum | Bağımlılık | Kabul Kriteri |
|---|---|---|---|---|
| U-08 | `calculateCredits()` hook | Bekliyor | — | Metin=1, Görsel=seçili stil sayısı, Video=5sn:10/10sn:20, Sosyal=platform sayısı×1. Sekme/seçim değişince reactive güncelleme. |
| U-09 | StickySubmitBar component | Bekliyor | U-08 | Sticky bottom:20px, white bg, slate-200 border, 16px radius, shadow. Sol: "BU ÜRETİMİN MALİYETİ" eyebrow + büyük kredi rakamı + kalan kredi. Sağ: "İçerik üret" primary buton. Mobile: dikey istif (cost üst, buton alt). |
| U-10 | Yetersiz kredi durumu | Bekliyor | U-09 | Bakiye < maliyet → buton disabled + tooltip "Yetersiz kredi. Paket al →" (tıklanabilir `/fiyatlar` link). Mobile: buton altında inline uyarı satırı. |

### Grup 5 — Disabled Buton Tooltip

| ID | Başlık | Durum | Bağımlılık | Kabul Kriteri |
|---|---|---|---|---|
| U-11 | `getCTAState()` hook | Bekliyor | — | Sekme bazlı validation: Metin→ürün adı, Görsel→fotoğraf+stil, Video→fotoğraf, Sosyal→ürün adı+platform. `{ disabled, reason }` döner. |
| U-12 | Tooltip primitive | Bekliyor | — | Üstte 8px offset, slate-900 bg, white text, 8px radius, 13px font, pointer üçgen, 200ms fade-in. `role="tooltip"`. Mobile: tap/focus'ta görünür, 2sn auto-dismiss. |
| U-13 | Disabled buton + tooltip entegrasyonu | Bekliyor | U-11, U-12 | Form eksikken buton disabled (slate-300 bg) + hover/focus'ta neden tooltip. Form tamamlanınca buton aktif, tooltip kayboluyor. `aria-disabled="true"` + `aria-describedby`. |

### Grup 6 — Şeffaf Kredi Etiketleri

| ID | Başlık | Durum | Bağımlılık | Kabul Kriteri |
|---|---|---|---|---|
| U-14 | Form içi kredi yazılarını kaldır | Bekliyor | U-09 | Tüm sekmelerdeki inline "X kredi" yazıları kaldırılmış. Kredi bilgisi sadece sticky bar'da. |
| U-15 | "∞ kredi" ve "0 kredi" yazılarını kaldır | Bekliyor | U-14 | Anlamsız etiketler temizlenmiş. |
| U-16 | "Sosyal medya kiti" CTA'sını kaldır | Bekliyor | U-14 | Sosyal sekmesinde tek "İçerik üret" CTA'sı var. "Kit" konsepti kaldırılmış. Platform seç → kredi hesaplanır → tek butonla üret. |
| U-17 | Login gerektiren tooltip + redirect | Bekliyor | U-12 | Login gerekirken tooltip: "Önce giriş yap". Tıklayınca `/giris`'e redirect. |

### Grup 7 — Polish & PR

| ID | Başlık | Durum | Bağımlılık | Kabul Kriteri |
|---|---|---|---|---|
| U-18 | Mobile responsive sweep | Bekliyor | U-01~U-17 | Sticky bar, formlar, collapsible, tooltip — hepsi mobile'da sorunsuz. 375px'te overflow yok. |
| U-19 | A11y audit | Bekliyor | U-18 | Radio group ARIA, tooltip ARIA, focus management, WCAG AA kontrast. |
| U-20 | Lighthouse pass | Bekliyor | U-19 | Performance >90, CLS <0.05, a11y >90. |
| U-21 | Aziz kabul | Bekliyor | U-20 | Preview URL'de test, onay. |

---

## 12 — Hesap Alanı + Diğer Sayfalar Refactor

**Spec:** `specs/hesap-alani-refactor-spec.md`
**Mockup'lar:** `specs/marka-profili-mockup.jsx`, `specs/hesabim-mockup.jsx`
**Durum:** Landing page tamamlandıktan sonra başlayacak.

### Aziz Kararları (2026-04-27)

1. **Canlı önizleme:** Hazır şablon (template-based). Ton seçimine göre önceden yazılmış metin şablonları. AI çağrısı yok, maliyetsiz, anlık.
2. **Düşük kredi eşiği:** 5 kredi. Uyarı (kırmızı border, "Kredi al" vurgusu) 5 ve altında tetiklenir.
3. **Referans istatistikleri:** İlk davetten sonra göster. 0 davet = sadece CTA, 1+ davet = istatistikler görünür.
4. **Fiyatlar SSS:** Kredi ve fiyat odaklı. Landing page SSS'den kredi/fiyat olanları seç + fiyatlara özel 1-2 soru ekle.
5. **Karşılaştırma tablosu:** Şimdilik gerekli değil, atlıyoruz.
6. **Üretim sonuç sayfası:** Kapsama dahil ama ayrı iş — `/uret` spec'inde ele alınacak.

### Genel İçerik Kuralı

Canlı sitedeki örnek çıktıları (üretilmiş text/görsel/video/sosyal örnekleri) ve mevcut görsel öğeleri (toplar vb.) olduğu gibi koru — yeniden üretim gerektirmesin. Diğer metinler (başlık, açıklama, CTA, UI copy) tasarıma uygun şekilde değiştirilebilir.

### Mockup Uyarıları

- Mockup'larda emoji var (ton chip'leri, "Neden bu önemli?" vb.) — CLAUDE.md kuralı gereği Lucide ikonlarıyla değiştirilecek.
- Mockup paleti (slate scale + #1E40AF) landing page redesign token'larıyla uyumlu.

### Grup 1 — Renk Paleti Uyumu (bağımlılık, önce yapılacak)

| ID | Başlık | Durum | Bağımlılık | Kabul Kriteri |
|---|---|---|---|---|
| H-01 | Anasayfa paletini tüm sayfalara uygula | Bekliyor | Landing page done | `/hesap`, `/hesap/marka`, `/hesap/profil`, `/fiyatlar`, `/blog`, `/giris` sayfalarında redesign token'ları (`rd-` prefix) kullanılıyor. Eski `#D8D6CE`, `#908E86`, `#1E4DD8` renkleri kalmamış. |

### Grup 2 — Marka Profili `/hesap/marka` (en büyük iş)

| ID | Başlık | Durum | Bağımlılık | Kabul Kriteri |
|---|---|---|---|---|
| H-02 | ProgressIndicator component | Bekliyor | H-01 | Header'da ilerleme çubuğu. 6px yükseklik. Renk: <50% slate, 50-99% primary, 100% success. |
| H-03 | Form alanları (5 alan) | Bekliyor | H-01 | storeName, tone, audience, features, extraInfo. Label + input + helper + tamamlandı tik. |
| H-04 | Ton chip selector | Bekliyor | H-03 | 3 chip (samimi/profesyonel/premium), radio group. Lucide ikonları (emoji yok). |
| H-05 | `generatePreview()` şablon fonksiyonu | Bekliyor | H-04 | Ton seçimine göre hazır metin şablonları. AI yok. 3 varyasyon. `useMemo`. |
| H-06 | BrandedAIPreview (sticky kolon) | Bekliyor | H-05 | Sağ kolon sticky. Form değişince fade animasyonuyla güncellenir. |
| H-07 | GenericAIPreview (kıyas paneli) | Bekliyor | H-06 | Statik "marka bilgisi olmadan" örneği. Branded ile yan yana. |
| H-08 | WhyItMatters tooltip | Bekliyor | H-01 | Lucide Info ikonu + tooltip. Hover/focus ile açılır. |
| H-09 | StickySaveBar | Bekliyor | H-03 | Yapışkan bar. Dirty state'te görünür. "Kaydet" + durum mesajı. |
| H-10 | `beforeunload` dirty state warning | Bekliyor | H-09 | Kaydedilmemişse sayfa kapatmada tarayıcı uyarısı. |
| H-11 | Save POST `/api/marka-profili` | Bekliyor | H-09 | API'ye POST. Loading, error handling, success toast. |
| H-12 | Toast başarı bildirimi | Bekliyor | H-11 | Yeşil toast. 3sn auto-dismiss. |
| H-13 | Mobile responsive | Bekliyor | H-06 | Tek kolon (form üst, preview alt). 375px overflow yok. |
| H-14 | A11y pass | Bekliyor | H-13 | Radio group ARIA, focus, `aria-live`, WCAG AA. |

### Grup 3 — Hesabım `/hesap`

| ID | Başlık | Durum | Bağımlılık | Kabul Kriteri |
|---|---|---|---|---|
| H-15 | Tasarruf rozeti | Bekliyor | H-01 | Mavi gradient badge, Trophy ikonu. "X içerik — Y TL tasarruf". |
| H-16 | 3 KPI grid | Bekliyor | H-01 | Kalan kredi (<=5'te kırmızı + "Kredi al" CTA), bu ay üretim, toplam üretim. |
| H-17 | Denenmemiş özellikler keşif bloğu | Bekliyor | H-01 | Dinamik grid. Her kart ilgili sayfaya yönlendirir. |
| H-18 | 6 menü kartı + uyarı durumları | Bekliyor | H-01 | Marka (eksikse turuncu), Profil, Üretimler, Krediler (<=5'te kırmızı), Faturalar, Ayarlar. |
| H-19 | Davet kutusu basitleştirme | Bekliyor | H-01 | Amber gradient, Gift ikonu. 0 davet=CTA only; 1+=istatistik. |
| H-20 | "Favori platform" KPI kaldırma | Bekliyor | H-16 | 4 KPI -> 3 KPI. |
| H-21 | Mobile responsive | Bekliyor | H-19 | 375px overflow yok. |

### Grup 4 — Fiyatlar `/fiyatlar`

| ID | Başlık | Durum | Bağımlılık | Kabul Kriteri |
|---|---|---|---|---|
| H-22 | "Önerilen" -> "En popüler" güncelle | Bekliyor | H-01 | Terim değişikliği. |
| H-23 | Kredi calculator entegrasyonu | Bekliyor | H-01, FY done | Landing page CreditCalculator reuse. |
| H-24 | SSS bölümü | Bekliyor | H-01 | 4-6 soru, kredi/fiyat odaklı. Landing SSS component reuse. |
| H-25 | ~~Karşılaştırma tablosu~~ | Atlandı | — | Gerekli değil (Aziz kararı). |
| H-26 | Trust strip alt bant | Bekliyor | H-01 | Landing page güven noktaları tekrarı. |

### Grup 5 — Blog `/blog`

| ID | Başlık | Durum | Bağımlılık | Kabul Kriteri |
|---|---|---|---|---|
| H-27 | Kategori filtre state'leri | Bekliyor | H-01 | Aktif primary bg, pasif neutral. |
| H-28 | Kart hover state | Bekliyor | H-01 | Lift + shadow (redesign branch'te OK). |
| H-29 | Arama input focus | Bekliyor | H-01 | Primary ring. |

### Grup 6 — Giriş `/giris`

| ID | Başlık | Durum | Bağımlılık | Kabul Kriteri |
|---|---|---|---|---|
| H-30 | Form input focus ring | Bekliyor | H-01 | Primary ring. |
| H-31 | Tab aktif/pasif border | Bekliyor | H-01 | Primary 2px aktif, neutral pasif. |

### Grup 7 — Polish & QA

| ID | Başlık | Durum | Bağımlılık | Kabul Kriteri |
|---|---|---|---|---|
| H-32 | Cross-page navigation | Bekliyor | H-01~H-31 | Tüm geçişler sorunsuz. |
| H-33 | Lighthouse pass | Bekliyor | H-32 | 5 sayfada Performance >90, a11y >90. |
| H-34 | A11y audit | Bekliyor | H-33 | WCAG AA tüm sayfalarda. |
| H-35 | Aziz kabul | Bekliyor | H-34 | Preview'da 5 sayfa test + onay. |

**Bağımlılıklar:** H-01 hepsinden önce. Grup 2-6 paralel. Grup 7 en son.

---

## 13 — Üretim ve Premium Sayfaları (Faz 2)

**Branch:** `claude/redesign-modern-ui` (aynı branch).
**Yaklaşım:** Landing page'den öğrenilen pattern (rd-* token, Manrope display + Inter body, eyebrow + H2 + subtitle, 2-kolon grid, Lucide ikonlar, fade animasyonlar, mobile-first, a11y-first). Ticket başına detaylı prompt sayfa sırası gelince eklenecek.
**Bağımlılık:** Landing page (Faz 1) tamamlanmadan başlama — pattern olgunlaşıyor.
**Öncelik gerekçesi:** Kullanıcı kayıttan ödemeye giderken bu 4 sayfayı sırayla görüyor. Landing modern → /uret eski → sonuç sayfası eski → ödeme eski geçişi dönüşüm öldürür.

### Grup 1 — /uret refaktörü (Bölüm 11 ile paralel)

Mevcut Bölüm 11 (U-01~U-21) zaten 21 ticket detaylı tanımlı — burada tekrarlanmıyor. Faz 2 sırası gelince **U-01 öncesi her grup için** detaylı prompt yazılacak (U-01, U-02-03, U-04-07, U-08-10, U-11-13, U-14-17, U-18-21 grupları).

### Grup 2 — /yzstudio premium araçlar sayfası

| ID | Başlık | Durum | Bağımlılık | Kabul Kriteri |
|---|---|---|---|---|
| YS-01 | Sayfa scaffold + redesign token swap | Bekliyor | Landing done | rd-* token'lar, Manrope display, eski palet temizlendi. |
| YS-02 | Hero block (premium pozisyonlama) | Bekliyor | YS-01 | Eyebrow "PREMIUM ARAÇLAR" warm-earth accent, H1, subtitle, 1 CTA. |
| YS-03 | Mankene Giydirme (FASHN) tab/kart | Bekliyor | YS-01 | Tab-pattern (DS-06 reuse), 2 kolon (input sol, demo sağ), 3 kredi rozet. |
| YS-04 | Video Try-On tab/kart | Bekliyor | YS-03 | FASHN→Kling pipeline açıklaması, 13/23 kredi rozeti, demo video placeholder. |
| YS-05 | Kullanım kuralları + örnek galeri | Bekliyor | YS-04 | "Düz çekim ürün fotosu", "model fotosu" rehberi, 4-6 örnek görsel mevcut. |
| YS-06 | Mobile responsive | Bekliyor | YS-05 | Tab dikey istif veya scroll, demo görseller tek kolon. |
| YS-07 | A11y + acceptance | Bekliyor | YS-06 | Tab ARIA, focus, kontrast. Aziz preview onayı. |

### Grup 3 — Üretim sonuç sayfası `/(auth)/app/sonuc/[id]`

| ID | Başlık | Durum | Bağımlılık | Kabul Kriteri |
|---|---|---|---|---|
| SR-01 | Sayfa scaffold + token swap | Bekliyor | Landing done | rd-* paleti aktif. |
| SR-02 | Sonuç başlığı + üretim metadata | Bekliyor | SR-01 | "Üretim hazır" eyebrow + Sparkles, ürün adı, platform, içerik tipi, kredi düşüm bilgisi. |
| SR-03 | İçerik tipine göre output renderer | Bekliyor | SR-02 | PZ-07~10'daki ContentRenderer pattern reuse: text/image/video/social. |
| SR-04 | Kopyala/indir aksiyonları | Bekliyor | SR-03 | CopyButton (DS-08 reuse), ZIP indir, PDF indir butonları. |
| SR-05 | "Yeni üretim" + "Geçmiş üretimler" CTA | Bekliyor | SR-04 | İki CTA — primary `/uret`, ghost `/hesap/uretimler`. |
| SR-06 | Mobile + a11y + acceptance | Bekliyor | SR-05 | Aziz preview onayı. |

### Grup 4 — Ödeme sonuç sayfaları

| ID | Başlık | Durum | Bağımlılık | Kabul Kriteri |
|---|---|---|---|---|
| OD-01 | `/odeme/basarili` redesign | Bekliyor | Landing done | CheckCircle2 büyük ikon (success-700), eyebrow + H2 "Ödemen alındı", kredi yüklendiği rozet, "Üretime başla" primary + "Hesabım" ghost CTA. |
| OD-02 | `/odeme/hata` redesign | Bekliyor | Landing done | XCircle danger ikon, hata sebebi metni (Aziz onayı sonrası), "Tekrar dene" primary + "Destek" link, calm ton. |
| OD-03 | E-Arşiv fatura + iyzico güvence rozeti | Bekliyor | OD-01 | Footer alt: iyzico logo, e-Arşiv açıklaması. |
| OD-04 | A11y + acceptance | Bekliyor | OD-03 | aria-live başarı/hata mesajı, focus management, Aziz preview onayı. |

**Faz 2 toplam:** ~21 (U) + 7 (YS) + 6 (SR) + 4 (OD) = 38 ticket.

---

## 14 — Hesap Detay Sayfaları Genişletme (Faz 3 eklentisi)

Bölüm 12'deki H-01~H-35 5 ana sayfayı kapsıyordu. Burada eksik 5 hesap sayfası ekleniyor — H ID serisi devam ediyor.

| ID | Başlık | Durum | Bağımlılık | Kabul Kriteri |
|---|---|---|---|---|
| H-36 | `/hesap/krediler` sayfası | Bekliyor | H-01 | Mevcut bakiye kartı, kredi geçmişi tablosu (DataTable pattern), "Kredi yükle" primary CTA → `/kredi-yukle`, düşük kredi uyarısı (≤5). |
| H-37 | `/hesap/uretimler` sayfası | Bekliyor | H-01, SR-03 | Geçmiş üretim listesi, içerik tipine göre filtre chip'leri, kart başına thumbnail + metadata, "tekrar üret" + "indir" aksiyonları, infinite scroll veya pagination. |
| H-38 | `/hesap/ayarlar` sayfası | Bekliyor | H-01 | Hesap bilgileri, parola değiştir, e-posta tercihleri (toggle'lar), KVKK veri indirme/silme talepleri, hesap silme (red destructive). |
| H-39 | `/hesap/faturalar` sayfası | Bekliyor | H-01 | Paraşüt e-Arşiv fatura listesi, indir butonları, fatura no + tarih + tutar tablosu. |
| H-40 | `/kredi-yukle` sayfası | Bekliyor | H-01, FY-09 | FiyatlarSection'daki PackageCard reuse, paket seç → iyzico checkout flow'a yönlendir. Sticky paket özet kartı (mobile). |
| H-41 | Modal versiyonları (`@modal/(.)` rotaları) | Bekliyor | H-40, H-30, H-31 | `(.)giris`, `(.)kayit`, `(.)kredi-yukle` — backdrop blur + modal panel, ana sayfayla aynı stil, focus trap, Escape kapatma. |

**Faz 3 toplam:** Bölüm 12'deki 35 + Bölüm 14'teki 6 = 41 ticket.

---

## 15 — Auth Sayfaları (Faz 4)

Mevcut Bölüm 12'de H-30/H-31 sadece /giris için 2 ticket vardı. Burada `/giris` genişletiliyor + `/kayit`, `/sifre-sifirla` ekleniyor.

| ID | Başlık | Durum | Bağımlılık | Kabul Kriteri |
|---|---|---|---|---|
| AU-01 | `/giris` form layout (H-30/31'i kapsayacak) | Bekliyor | Landing done | 2 kolon (form sol, marka pitch sağ — gradient + 1-2 trust point), input ring primary, password toggle göz ikonu, "Beni hatırla" checkbox, "Şifremi unuttum" link. H-30/H-31 burada birleşiyor. |
| AU-02 | `/giris` Google ile giriş + ayraç | Bekliyor | AU-01 | "veya" ayracı, Google logosu + "Google ile devam et" outline buton (mevcut OAuth korunur). |
| AU-03 | `/giris` hata durumları | Bekliyor | AU-01 | Inline error mesajları (kırmızı eyebrow), Cloudflare Turnstile entegrasyonu görsel uyumlu. |
| AU-04 | `/kayit` form layout | Bekliyor | AU-01 | AU-01 ile simetrik, "Şifre tekrar" alanı, KVKK + kullanım koşulları onay checkbox'ları (link'ler tıklanabilir). |
| AU-05 | `/kayit` e-posta doğrulama akışı UI | Bekliyor | AU-04 | Kayıt sonrası "E-posta gönderildi" empty state, MailCheck ikon, "Tekrar gönder" link, ipucu metni. |
| AU-06 | `/sifre-sifirla` form | Bekliyor | AU-01 | Tek input (e-posta), KeyRound ikon, success state ("Link gönderildi"), 2 step (e-posta gir → yeni şifre). |
| AU-07 | Mobile responsive (3 sayfa) | Bekliyor | AU-06 | Tek kolon, sağ marka pitch mobilde gizli veya altta küçük. |
| AU-08 | A11y + acceptance | Bekliyor | AU-07 | Form label/aria, error aria-live, autocomplete attr, Aziz preview onayı. |

**Faz 4 toplam:** 8 ticket (H-30/31 burada absorb edildi, Bölüm 12'den çıkarılacak).

---

## 16 — İçerik Sayfaları (Faz 5)

Mevcut Bölüm 12'de H-27/28/29 sadece blog liste için 3 ticket vardı. Burada blog detay + sss + hakkımızda ekleniyor. SEO + okunabilirlik öncelikli.

| ID | Başlık | Durum | Bağımlılık | Kabul Kriteri |
|---|---|---|---|---|
| IC-01 | `/blog` liste sayfası (H-27~29 dahil) | Bekliyor | Landing done | Hero başlık + arama + kategori chip filtresi (TabList primitive reuse), blog kartları grid (3 kolon desktop, 1 kolon mobile), kart hover lift, "Daha fazla yükle" pagination. |
| IC-02 | `/blog/[slug]` detay sayfası tipografi | Bekliyor | IC-01 | Article max-w 720px, prose tipografi (h2/h3/p/ul/ol/blockquote), kod blok rd-neutral-900 bg, görsel rounded-xl + caption italic, line-height 1.75. |
| IC-03 | `/blog/[slug]` meta + paylaş | Bekliyor | IC-02 | Yazar + tarih + okuma süresi eyebrow, kategori badge'leri, sosyal paylaş (Twitter/LinkedIn/WhatsApp), "Daha önce yazılanlar" bölümü 3 kart. |
| IC-04 | `/blog/[slug]` İlgili yazılar + CTA | Bekliyor | IC-03 | Yazı sonu CTA bandı (rd-primary-50 bg, "Hemen üret" → /uret), 3 ilgili yazı kartı. |
| IC-05 | `/sss` sayfa redesign | Bekliyor | Landing done | Landing'deki SSSSection (Bölüm 08) component reuse, ek olarak kategoriye göre filtreleme (Genel/Krediler/Faturalandırma/Teknik), arama. |
| IC-06 | `/hakkimizda` sayfa redesign | Bekliyor | Landing done | Mevcut metin korunur (DR-03 elden geçirilmişti), tipografi + spacing redesign'a uyarlanır, kurucu fotoğraf bloğu warm-earth accent (premium ton). |
| IC-07 | Mobile responsive (4 sayfa) | Bekliyor | IC-06 | Blog kart 1 kolon, article tipografi mobile-friendly, SSS accordion. |
| IC-08 | A11y + acceptance | Bekliyor | IC-07 | Article semantic HTML, blog listesi tablist ARIA, Aziz preview onayı. |

**Faz 5 toplam:** 8 ticket.

---

## 17 — Yasal + Hata Sayfaları (Faz 6 — Toplu Pas)

**Yaklaşım:** Bu sayfalar düz metin içeriği. Ticket başına ayrı redesign verimli değil — tek toplu pasta global token swap, header/footer redesign component reuse, link rengi tutarlılığı sağlanacak.

| ID | Başlık | Durum | Bağımlılık | Kabul Kriteri |
|---|---|---|---|---|
| LG-01 | 6 yasal sayfa global token swap | Bekliyor | Landing done | `/kvkk-aydinlatma`, `/gizlilik`, `/kosullar`, `/cerez-politikasi`, `/mesafeli-satis`, `/teslimat-iade` — rd-* paleti, Manrope h1/h2/h3, prose body, max-w 720px, redesign Header + Footer aktif. |
| LG-02 | 404 not-found sayfası | Bekliyor | LG-01 | "Sayfa bulunamadı" H1, kısa mesaj, anasayfa primary CTA + popüler linkler ghost CTA, illustrasyon (Lucide MapOff veya benzeri büyük). |
| LG-03 | error.tsx genel hata sayfası | Bekliyor | LG-01 | "Bir şeyler ters gitti" H1, AlertTriangle danger ikon, "Tekrar dene" primary buton (reset() çağrısı), destek e-postası link. |
| LG-04 | loading.tsx tutarlı loader | Bekliyor | LG-01 | Skeleton veya spinner — site genelinde tek pattern. Lucide Loader2 + animate-spin. |
| LG-05 | Acceptance | Bekliyor | LG-04 | Aziz preview'da 6 yasal + 3 utility = 9 sayfa hızlı pas. |

**Faz 6 toplam:** 5 ticket.

---

## Faz Özeti — Roadmap

| Faz | Bölüm | Sayfa sayısı | Ticket sayısı | Durum |
|---|---|---|---|---|
| 1 | Landing (4-10) | 1 (anasayfa) | ~30 kalan | FY done, SSS sırada |
| 2 | Üretim akışı (11, 13) | 4 (/uret, /yzstudio, /sonuc, /odeme) | 38 | Bekliyor (Landing done sonrası) |
| 3 | Hesap alanı (12, 14) | 10 (5 ana + 5 detay) | 41 | Bekliyor (Faz 2 sonrası) |
| 4 | Auth (15) | 3 (/giris, /kayit, /sifre-sifirla) | 8 | Bekliyor |
| 5 | İçerik (16) | 4 (blog liste/detay, sss, hakkımızda) | 8 | Bekliyor |
| 6 | Yasal + hata (17) | 9 (6 yasal + 3 utility) | 5 | Bekliyor |

**Toplam kalan:** ~130 ticket. Tahmini süre 3-4 ay (UA+MB+NY+FY tempo: ~10-15 ticket/hafta).

**Kapsam dışı (Aziz onayı):** `/admin`, `/hesap/admin/feedback`, `/(auth)/app` (eski), `/profil` (eski — `/hesap/profil` aktif), `/toplu` (zaten kaldırılıyor — UX-03'le `/uret` text sekmesine taşındı).

**Detaylı prompt yazım kuralı:** Her ticket grubu için Cowork detaylı prompt'u BACKLOG'un ilgili bölümüne yazar, ondan sonra Aziz Claude Code'a verir. Prompt sırası gelmeden Claude Code ticket'a dokunmaz. (HR-FIX'te öğrendik: prompt olmadan 23 sapma çıkıyor.)
