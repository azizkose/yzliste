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
| PZ-07 | ContentRenderer: Text type | Bekliyor | DS-08, PZ-06 | 4 OutputField (Başlık, Özellikler, Açıklama, Etiketler). Her field'da CopyButton. Özellikler bullet dot'u platform renginde. Etiketler pill chip. 300ms fade geçişi. |
| PZ-08 | ContentRenderer: Image type | Bekliyor | PZ-06 | 4'lü görsel grid (placeholder: Lucide ImageIcon + label, emoji değil). "Tümünü indir" butonu. Stil notu kutusu (platform renk left border). |
| PZ-09 | ContentRenderer: Video type | Bekliyor | PZ-06 | Video player mockup, aspect ratio platforma göre (9:16 / 16:9 / 1:1). Play butonu (Lucide). Video spec etiketi. Sahne planı listesi (timestamp + Lucide ikon + açıklama, emoji değil). |
| PZ-10 | ContentRenderer: Social type | Bekliyor | DS-08, PZ-06 | Instagram + TikTok/Pinterest mockup'ları (platforma göre). CopyButton her post'ta. Instagram'da hashtag chip'leri + engagement ikonları (Lucide). |
| PZ-11 | Mobile responsive pass | Bekliyor | PZ-07~PZ-10 | Mobile: tek kolon, sticky off, tab'lar yatay scroll. Tablet: 2 kolon dar input. Desktop: tam mockup. Hiçbir breakpoint'te overflow yok. |
| PZ-12 | A11y pass | Bekliyor | PZ-11 | `role="tablist/tab"`, `aria-selected`, `aria-controls`. Arrow Left/Right navigasyon. Focus-visible ring. `aria-live="polite"` kopyala bildirimi. WCAG AA kontrast. |
| PZ-13 | Acceptance review | Bekliyor | PZ-12 | Aziz preview URL'de kontrol eder. 12 kombinasyon (4 × 3) test. Performans: Lighthouse >90, CLS <0.05. Console error yok. Bundle <30KB gzip. |

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
| IT-08 | A11y pass | Bekliyor | IT-07 | `role="button"`, `tabIndex="0"`, Enter/Space ile kart aktive. Modal: `role="dialog"`, `aria-modal`, `aria-labelledby`, focus trap. X butonu `aria-label="Kapat"`. WCAG AA kontrast. |
| IT-09 | Acceptance review | Bekliyor | IT-08 | Aziz preview'da kontrol. 4 kart hover + 4 modal test. CLS yok. Console error yok. |

### Hero Bölümü (Trust Strip + Nav + Hero)

| ID | Başlık | Durum | Bağımlılık | Kabul Kriteri |
|---|---|---|---|---|
| HR-01 | Constants & data layer | Bekliyor | DS-01 | `lib/constants/hero.ts` — TRUST_STRIP_ITEMS, NAV_LINKS, HERO_TRUST_PILLS, HERO_COPY, HERO_BADGES. Emoji yerine Lucide ikon string. |
| HR-02 | TrustStrip component | Bekliyor | HR-01 | `components/sections/HeroBlock/TrustStrip.tsx` — slate-50 bg, 3 öğe ortalı, Lucide ikonları (Flag, Lock, Zap), mobilde wrap. Sticky değil (scroll ile kaybolur). |
| HR-03 | Nav component (sticky + blur) | Bekliyor | DS-02, HR-01 | `components/sections/HeroBlock/Nav.tsx` — sticky, blur bg, logo (Manrope 800) + "Beta" badge, nav linkleri, "Giriş yap" (outline) + "İçerik üret" (primary) butonları. `-webkit-backdrop-filter` prefix. |
| HR-04 | Mobile hamburger menü | Bekliyor | HR-03 | Mobilde nav linklerini gizle, hamburger ikon göster. Overlay menü: focus trap, Escape ile kapanır. Basit implementasyon yeterli. |
| HR-05 | HeroSection scaffold + grid + soft bg | Bekliyor | HR-01 | `components/sections/HeroBlock/HeroSection.tsx` — 2 kolon grid (1.05fr 1fr, gap 64px). Radial mavi glow üstte (çok hafif, rgba 0.08). |
| HR-06 | HeroContent (sol kolon) | Bekliyor | DS-02, DS-04, DS-05, HR-05 | Eyebrow (pulse dot + metin), H1 (Manrope 800, clamp 40-64px, "AI ile" mavi), subtitle, TrustPills (4 adet, hover efekt), CTA grubu (primary + ghost video), reassurance satırı (Check ikon + metin). |
| HR-07 | AppScreenshotMockup (sağ kolon) | Bekliyor | HR-05 | Browser chrome (3 dot + URL bar), step indicator (3 adım), input metodu kartları, upload preview (Lucide ikon, emoji değil), marka input, generate butonu (Lucide Zap, emoji değil). Placeholder — gerçek screenshot sonra gelecek. |
| HR-08 | StickerBadge primitive | Bekliyor | DS-01 | `components/primitives/StickerBadge.tsx` — pill shape, white bg, renkli border, shadow, ikon + metin. Reusable. Position absolute ile kart dışına taşar. |
| HR-09 | Float-in animasyonları | Bekliyor | HR-06, HR-07 | Sol: fade+slide-up 600ms. Sağ: aynı, 150ms delay. `prefers-reduced-motion` kontrolü. CSS keyframe yeterli (framer-motion gerekmez). |
| HR-10 | "Nasıl çalışır?" video modal | Bekliyor | HR-06 | Ghost CTA tıklayınca video modal açılır. Backdrop + X + Escape ile kapanır. Pilot için YouTube/placeholder embed yeterli. |
| HR-11 | Mobile responsive pass | Bekliyor | HR-04~HR-10 | Mobile: tek kolon, visual üstte content altta. TrustPills 2x2 grid. CTA full width, dikey. Sticker badge'ler taşmaz. |
| HR-12 | A11y pass | Bekliyor | HR-11 | H1 tek (semantic). Nav `<nav>`. Sticker badge'ler decorative (`aria-hidden`). Pulse dot `aria-hidden`. CTA focus-visible. Screenshot `role="img" aria-label`. |
| HR-13 | Performance pass | Bekliyor | HR-12 | LCP < 2.5s (H1 target). CLS < 0.05. Lighthouse > 90. |
| HR-14 | Gerçek screenshot entegrasyonu | Bekliyor | HR-07 | Aziz onayı sonrası: gerçek `/uret` sayfası screenshot'ı mockup'a yerleştirilir. |
| HR-15 | Acceptance review | Bekliyor | HR-13 | Aziz preview'da kontrol. Nav sticky çalışıyor, H1 doğru, CTA'lar fonksiyonel, responsive tam. |

### 3 Adımda Hazır Bölümü — Bölüm 04

| ID | Başlık | Durum | Bağımlılık | Kabul Kriteri |
|---|---|---|---|---|
| UA-01 | Constants (`lib/constants/uc-adim.ts`) | Bekliyor | DS-01 | UC_ADIM_STEPS (3 adım: title, description, duration, mockupType), TOTAL_TIME. |
| UA-02 | Section scaffold + SectionHeader + bg | Bekliyor | DS-07, UA-01 | `components/sections/UcAdimSection.tsx`. bg-white. Eyebrow "KOLAY KULLANIM", h2 "3 adımda hazır", subtitle. |
| UA-03 | StepCard + NumberCircle | Bekliyor | UA-02 | 80×80 outline circle, Manrope 800 sayı, title (h3), description, DurationLabel (Clock ikon + süre). Ortalı layout. |
| UA-04 | MiniMockup — Step1: InputMockup | Bekliyor | UA-03 | 3 input metodu kartı (Fotoğraf seçili) + upload preview. slate-50 bg, border, min-h 180px. |
| UA-05 | MiniMockup — Step2: SelectionMockup | Bekliyor | UA-03 | 4 platform chip (2 seçili) + 4 içerik tipi ikonu (2 seçili). |
| UA-06 | MiniMockup — Step3: OutputMockup | Bekliyor | UA-03 | 2 çıktı kartı + "ve 2 tane daha..." satırı. |
| UA-07 | ConnectorLine (dashed, desktop-only) | Bekliyor | UA-03 | `border-top: 2px dashed slate-300`, absolute, NumberCircle ortasıyla hizalı. Mobilde gizli. |
| UA-08 | TotalTimeBar | Bekliyor | UA-02 | primary-50 bg, Clock ikon + "Ortalama tamamlama: **30 saniye**". Max-w 420px, ortalı. |
| UA-09 | (Opsiyonel) Scroll-triggered reveal | Bekliyor | UA-03 | Stagger fade-in 100ms aralık. `prefers-reduced-motion` kontrolü. CSS veya framer-motion. |
| UA-10 | Mobile responsive pass | Bekliyor | UA-07, UA-08 | Mobile: 1 kolon, connector gizli, gap 48px. Tablet: 3 kolon dar. Desktop: tam. |
| UA-11 | A11y pass | Bekliyor | UA-10 | h2→h3 hiyerarşi. NumberCircle/ConnectorLine `aria-hidden`. Mockup'lar `role="img"`. WCAG AA. |
| UA-12 | Acceptance review | Bekliyor | UA-11 | Aziz preview kontrolü. |

### Marka Bilgileri Bölümü — Bölüm 05

| ID | Başlık | Durum | Bağımlılık | Kabul Kriteri |
|---|---|---|---|---|
| MB-01 | Constants (`lib/constants/marka-bilgileri.ts`) | Bekliyor | DS-01 | BRAND_FEATURES (4 item), TONE_CHIPS (samimi/profesyonel/premium + çıktı metinleri), BRAND_FORM_FIELDS. |
| MB-02 | Section scaffold + grid + bg | Bekliyor | DS-07, MB-01 | `components/sections/MarkaBilgileriSection.tsx`. bg-slate-50. 2 kolon grid (gap 64px). |
| MB-03 | LeftColumn (eyebrow + heading + features + CTA) | Bekliyor | MB-02 | Turuncu Sparkles eyebrow "YENİ ÖZELLİK". Heading. 4 feature item (icon box + title + desc). CTA link "Marka profilimi oluştur →". |
| MB-04 | BrandFormPreview card scaffold | Bekliyor | MB-02 | `components/sections/MarkaBilgileriSection/BrandFormPreview.tsx`. white bg, shadow-sm, border. Header "Marka Profili" + yeşil "Aktif" badge. |
| MB-05 | Static fields (Mağaza adı, Hedef kitle) | Bekliyor | MB-04 | 2 read-only field: slate-50 bg, label + value. |
| MB-06 | Marka tonu radio group (3 chip) | Bekliyor | MB-04 | 3 chip (samimi/profesyonel/premium). `role="radiogroup"`, `aria-checked`. Arrow Left/Right navigasyon. Default: samimi. |
| MB-07 | OutputPreview + fade animation | Bekliyor | MB-06 | slate-50 bg. Sparkles eyebrow "AI çıktısı — {tone} tonda". 400ms fade+slide-up on tone change. `aria-live="polite"`. |
| MB-08 | Hint text | Bekliyor | MB-07 | "↑ Tonu değiştir, AI çıktısı değişiyor" — italic, gri, ortalı. |
| MB-09 | Mobile responsive pass | Bekliyor | MB-08 | Mobile: tek kolon (sol önce sağ sonra). Desktop: 2 kolon. Overflow yok. |
| MB-10 | A11y pass | Bekliyor | MB-09 | radiogroup ARIA. focus-visible. `prefers-reduced-motion`. WCAG AA. |
| MB-11 | Acceptance review | Bekliyor | MB-10 | Aziz preview kontrolü. 3 ton test. |

### Neden yzliste? Bölümü — Bölüm 06

| ID | Başlık | Durum | Bağımlılık | Kabul Kriteri |
|---|---|---|---|---|
| NY-01 | Constants (`lib/constants/neden-yzliste.ts`) | Bekliyor | DS-01 | NEDEN_YZLISTE_COMPARISONS (6 satır: generic vs yzliste), NEDEN_YZLISTE_FOOTNOTE. |
| NY-02 | Section scaffold + SectionHeader | Bekliyor | DS-07, NY-01 | `components/sections/NedenYzlisteSection.tsx`. bg-white. Container max-w 900px. Eyebrow "NEDEN YZLISTE". H2 provokatif başlık. Subtitle. |
| NY-03 | ComparisonTable (semantic `<table>`) | Bekliyor | NY-02 | `<table>` + `<thead>` + `<tbody>`. `aria-label`. border + radius 16px + shadow. overflow hidden. |
| NY-04 | Table headers (Generic + yzliste) | Bekliyor | NY-03 | Generic: slate-50 bg, "GENEL AI ARAÇLARI" eyebrow, "ChatGPT · Claude · Gemini". yzliste: primary-50 bg, "YZLISTE" eyebrow, "E-ticaret için özel inşa edildi". |
| NY-05 | ComparisonRow (6 satır) | Bekliyor | NY-03 | Generic cell: ❌ kırmızı yuvarlak + slate-500 metin. yzliste cell: ✓ yeşil yuvarlak + slate-900 metin + `#FAFCFF` bg tint. Ince border arası. |
| NY-06 | Footnote | Bekliyor | NY-02 | italic gri yazı, ortalı. "ChatGPT ve Claude harika asistanlardır..." |
| NY-07 | Mobile responsive pass | Bekliyor | NY-05 | Mobile: dikey karşılaştırma (her satır içinde alt alta). border-right kaldırılır. Desktop: 2 kolon tablo. |
| NY-08 | A11y pass | Bekliyor | NY-07 | Semantic `<table>`, `scope="col"`. Icon'lar `aria-hidden`. WCAG AA kontrast. |
| NY-09 | Acceptance review | Bekliyor | NY-08 | Aziz preview kontrolü. |

### Fiyatlar Bölümü — Bölüm 07

| ID | Başlık | Durum | Bağımlılık | Kabul Kriteri |
|---|---|---|---|---|
| FY-01 | Gerçek paket verilerini `/fiyatlar`'dan oku + constants | Bekliyor | DS-01 | `lib/constants/fiyatlar.ts` — PACKAGES (isim, fiyat, kredi, features), CREDIT_PER_PRODUCT, SLIDER config. **Gerçek fiyatlar Aziz'den onay sonrası.** |
| FY-02 | Section scaffold + SectionHeader + bg | Bekliyor | DS-07, FY-01 | `components/sections/FiyatlarSection.tsx`. bg-slate-50. Eyebrow "FİYATLANDIRMA". H2, subtitle. |
| FY-03 | CreditCalculator scaffold | Bekliyor | FY-02 | `components/sections/FiyatlarSection/CreditCalculator.tsx`. white card, shadow, border. Header + 2 kolon grid (slider sol, recommendation sağ). |
| FY-04 | Slider component (custom CSS) | Bekliyor | FY-03 | Range input 1-100. Mavi gradient dolu kısım. Beyaz thumb mavi border. Klavye Arrow key kontrolü. `role="slider"`, `aria-valuemin/max/now`. |
| FY-05 | RecommendationCard + hesaplama | Bekliyor | FY-04 | primary-50 bg. "SANA UYGUN PAKET" eyebrow. `useMemo` ile recommendedPackage. Tahmini ihtiyaç = productCount × CREDIT_PER_PRODUCT. |
| FY-06 | PackageCard component | Bekliyor | FY-01 | `components/sections/FiyatlarSection/PackageCard.tsx`. Default + popular (2px primary border, translateY -8px, "★ EN POPÜLER" rozet) varyantları. Fiyat Manrope 800 36px. Features ✓ listesi. CTA solid/outline. |
| FY-07 | "SENİN İÇİN" badge logic | Bekliyor | FY-05, FY-06 | Slider'a göre recommended package'a yeşil badge. Badge slider değiştikçe hareket eder. |
| FY-08 | FooterNote (trust points) | Bekliyor | FY-02 | 4 trust point yatay: Aboneliksiz, Krediler süresiz, iyzico, Faturalandırma. Ayraçlar `·`. |
| FY-09 | CTA route entegrasyonu | Bekliyor | FY-06 | Paket "Seç" butonu doğru route'a yönlendirir. Route Aziz'den gelecek. |
| FY-10 | Mobile responsive pass | Bekliyor | FY-08 | Mobile: calculator tek kolon, paketler tek kolon (popular en üstte, translateY kaldırılır). Slider touch friendly. |
| FY-11 | A11y pass | Bekliyor | FY-10 | Slider ARIA. `aria-live="polite"` recommendation güncelleme. Focus-visible. WCAG AA. |
| FY-12 | Acceptance review | Bekliyor | FY-11 | Aziz preview kontrolü. Slider test, 3 paket görsel kontrol. |

### SSS Bölümü — Bölüm 08

| ID | Başlık | Durum | Bağımlılık | Kabul Kriteri |
|---|---|---|---|---|
| SS-01 | Constants (`lib/constants/sss.ts`) | Bekliyor | DS-01 | FAQ_ITEMS (6 soru-cevap), SSS_COPY (header metinleri). |
| SS-02 | Section scaffold + SectionHeader + grid | Bekliyor | DS-07, SS-01 | `components/sections/SSSSection.tsx`. bg-white. 2 kolon grid (mobilde 1). |
| SS-03 | FAQItem (collapsible + animation) | Bekliyor | SS-02 | `grid-template-rows: 0fr→1fr` trick. +/− ikon dönüşümü. Açık: primary-50/30 bg, primary-200 border. 200ms geçiş. İlk item default açık. |
| SS-04 | ContactNote | Bekliyor | SS-02 | Mail ikon + "Daha fazla soru?" + email mailto link + "Tüm sorular →" link. slate-50 bg. |
| SS-05 | A11y + responsive pass | Bekliyor | SS-03, SS-04 | `aria-expanded`. Klavye aç/kapat. Mobile: 1 kolon. WCAG AA. |
| SS-06 | Acceptance review | Bekliyor | SS-05 | Aziz preview kontrolü. 6 item test. |

### Final CTA Bölümü — Bölüm 09

| ID | Başlık | Durum | Bağımlılık | Kabul Kriteri |
|---|---|---|---|---|
| FC-01 | Constants (`lib/constants/final-cta.ts`) | Bekliyor | DS-01 | FINAL_CTA_COPY (eyebrow, heading, subheading, ctaText, reassurance). |
| FC-02 | Section + gradient bg | Bekliyor | DS-02, FC-01 | `components/sections/FinalCTASection.tsx`. `linear-gradient(135deg, primary-600, primary-700)`. |
| FC-03 | Container + content | Bekliyor | FC-02 | Max-w 720px. EyebrowBadge (beyaz transparan). H2 white. Sub white/80. CTA (white bg, primary-700 text, shadow, hover lift). ReassuranceLine white/70. |
| FC-04 | (Opsiyonel) Background pattern | Bekliyor | FC-02 | Subtle dot pattern veya radial glow. |
| FC-05 | Mobile responsive + a11y | Bekliyor | FC-03 | Mobile: CTA full width. Focus-visible. Semantic h2. |
| FC-06 | Acceptance review | Bekliyor | FC-05 | Aziz preview kontrolü. |

### Footer Bölümü — Bölüm 10

| ID | Başlık | Durum | Bağımlılık | Kabul Kriteri |
|---|---|---|---|---|
| FT-01 | Constants (`lib/constants/footer.ts`) | Bekliyor | DS-01 | FOOTER_BRAND, FOOTER_COLUMNS (3 sütun: Ürün/Şirket/Yasal), FOOTER_DISCLAIMER, COMPANY_INFO. |
| FT-02 | Footer scaffold + grid | Bekliyor | FT-01 | `components/sections/Footer.tsx`. bg-slate-50, border-top. 4 kolon grid. |
| FT-03 | BrandColumn | Bekliyor | FT-02 | Logo (Manrope 800) + tagline + lokasyon (Lucide MapPin, bayrak emojisi yerine). |
| FT-04 | Link columns (3 sütun) | Bekliyor | FT-02 | Ürün, Şirket, Yasal. Title uppercase. Links hover primary-700. Email mailto. |
| FT-05 | FooterMid (copyright + badges) | Bekliyor | FT-02 | Copyright sol, iyzico + SSL badge sağ. |
| FT-06 | FooterDisclaimer | Bekliyor | FT-02 | 12px italic slate-500, max-w 800px. Pazaryeri isimleri hakkında yasal not. |
| FT-07 | iyzico + SSL badge asset | Bekliyor | FT-05 | PNG/SVG asset public/ altına. Aziz'den asset gelecek. |
| FT-08 | Mobile responsive | Bekliyor | FT-06 | Mobile: 1 kolon. FooterMid dikey. |
| FT-09 | A11y (semantic `<footer>`) | Bekliyor | FT-08 | `<footer>` tag. Link labels. WCAG AA. |
| FT-10 | Acceptance review | Bekliyor | FT-09 | Aziz preview kontrolü. |

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

## Tamamlanan

(henüz yok)

---

## İptal / Revert edilen

(henüz yok)
