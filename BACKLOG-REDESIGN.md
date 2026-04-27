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

#### HR-11~13 Detaylı Prompt (Claude Code bu bölümü okuyacak)

**Branch:** `claude/redesign-modern-ui` · **Commit:** tek commit `feat: HR-11~13 responsive + a11y + perf pass`

---

##### HR-11: Mobile Responsive Pass

Dosyalar: HeroSection.tsx, HeroContent.tsx, AppScreenshotMockup.tsx, Nav.tsx, VideoModal.tsx

**HeroSection.tsx:**
- Grid: `grid-cols-1 lg:grid-cols-[1.05fr_1fr]` (zaten var — doğrula)
- Mobilde sıra: `flex-col-reverse lg:grid` YAPMA — mevcut grid-cols-1 zaten mobilde content üst, visual alt sırasıyla çalışıyor (DOM sırası: HeroContent önce, AppScreenshotMockup sonra). Bu doğru.

**HeroContent.tsx:**
- H1: `clamp(40px, 5.5vw, 64px)` zaten responsive. Ek class gerekmez.
- Trust pills: Mobilde (< 640px) wrap ediyor (`flex-wrap` zaten var). Eğer 4 pill tek satıra sığmıyorsa sorun yok, flex-wrap halleder.
- CTA group: `flex-wrap` zaten var. Mobilde dikey olması için `flex-col sm:flex-row` yap. Ghost buton da dahil.
  ```diff
  - <div className="mb-5 flex flex-wrap items-center gap-3">
  + <div className="mb-5 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
  ```
- Primary CTA: Mobilde full width → Link wrapper'a `className="w-full sm:w-auto"` ekle, Button'a `fullWidth` prop'u EKLEME (sm:w-auto ile çözülmüyor). Bunun yerine:
  ```diff
  - <Link href={NAV_CTAS.primary.href} tabIndex={-1}>
  + <Link href={NAV_CTAS.primary.href} tabIndex={-1} className="w-full sm:w-auto">
  ```
  Ve Button'a `className="w-full sm:w-auto"` ekle.
- Ghost CTA: Mobilde ortalanması için `justify-center` ekle (zaten `inline-flex items-center` var, `justify-center` ekle).

**AppScreenshotMockup.tsx:**
- StickerBadge'ler: Mobilde (< 640px) taşma riski. `sm:absolute` yaparak mobilde static, desktop'ta absolute konumlandır:
  ```
  topRight:  "hidden sm:flex sm:absolute sm:-top-3 sm:right-5 z-10"
  bottomLeft: "hidden sm:flex sm:absolute sm:-bottom-3 sm:-left-3 z-10"
  ```
  Mobilde badge'ler gizlenir (ekran zaten küçük, mockup'ın üstünden taşmasın). Desktop'ta gösterilir.
- Browser chrome text: `.text-[11px]` zaten küçük, değişiklik gerekmez.

**VideoModal.tsx:**
- Mobilde `p-4` padding zaten var. `max-w-[800px]` mobilde doğal olarak ekrana sığar. OK.

**Nav.tsx:**
- Zaten mobile hamburger var (HR-04'te yapıldı). Doğrula: `md:hidden` hamburger, `md:flex` desktop nav.

---

##### HR-12: A11y Pass

Tüm HeroBlock dosyalarını tara, eksik varsa ekle:

| Kontrol | Beklenen | Dosya |
|---------|----------|-------|
| H1 tek | Sayfada tek `<h1>` var (HeroContent'te) | HeroContent.tsx |
| Nav landmark | `<nav>` etiketi | Nav.tsx (zaten var) |
| StickerBadge decorative | `aria-hidden="true"` badge'lerin wrapper'ına | AppScreenshotMockup.tsx |
| Pulse dot | `aria-hidden="true"` | HeroContent.tsx (zaten var) |
| CTA focus-visible | `focus-visible:ring-2 focus-visible:ring-rd-primary-500 focus-visible:ring-offset-2` — Button primitive'de zaten var mı kontrol et. Ghost buton'da yoksa ekle. | HeroContent.tsx |
| Screenshot alt | `role="img" aria-label="Uygulama önizlemesi"` | AppScreenshotMockup.tsx (zaten var) |
| VideoModal | `role="dialog" aria-modal="true" aria-label` | VideoModal.tsx (zaten var) |
| Tab order | Modal açıkken arka plan tabbable olmamalı — `inert` attribute veya focus trap | VideoModal.tsx — `inert` HTML attribute'ü `<main>`'e eklemek yerine, mevcut Escape + backdrop yeterli. İyileştirme: modal dışındaki tüm focusable öğeleri `tabIndex={-1}` yapmak fazla karmaşık. Şimdilik mevcut hali kabul. |
| Color contrast | Tüm text renkleri en az 4.5:1 oranında — `text-slate-500` (#64748B) on white = 4.6:1 ✓, `text-slate-600` on white = 5.7:1 ✓. `text-white/60` on bg-black/60 → kontrol et, düşükse `text-white/80` yap. |
| Ghost CTA focus | Ghost buton'a `focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rd-primary-500` ekle |

**StickerBadge a11y:** Her badge'e `aria-hidden="true"` EKLEME — içeriği (metin) bilgi taşıyor. Bunun yerine badge'ler olduğu gibi kalsın (screen reader label + metin okuyacak). Ama ikon'a `aria-hidden="true"` ekle (ikon zaten dekoratif).

---

##### HR-13: Performance Pass

Hedefler: LCP < 2.5s, CLS < 0.05, Lighthouse > 90

| Kontrol | Aksiyon |
|---------|---------|
| CLS: StickerBadge | Badge'ler absolute → layout shift yok ✓ |
| CLS: Float-in | `opacity: 0` başlangıç → CLS riski. `both` fill mode ile `animation-fill-mode: backwards` eşdeğer — element animasyon başlamadan opacity 0'da. **Sorun yok** çünkü hero ilk render'da zaten görünür alanda, browser animasyonu çok hızlı başlatıyor. |
| CLS: Font | Manrope + Inter `next/font` ile yükleniyor → `font-display: swap` otomatik → küçük FOUT olabilir ama CLS açısından önemsiz (text reflow minimal). |
| LCP target | H1 text veya hero görseli LCP olacak. H1 text = anında render (server component DEĞİL artık, 'use client' var). İyileştirme: HeroContent SSR olabilirdi ama `useState` var (VideoModal). Şimdilik OK. |
| VideoModal lazy | Modal kodu `isOpen` false iken `return null` yapıyor → zaten lazy render. Import ise tree-shake OLMAZ. İyileştirme: `dynamic(() => import('./VideoModal'))` ile lazy import yap. `ssr: false` ekle: |
| | `const VideoModal = dynamic(() => import('./VideoModal'), { ssr: false })` |
| | Bu sayede modal JS'i sadece gerektiğinde yüklenir. HeroContent'te `import dynamic from 'next/dynamic'` ekle, eski `import VideoModal` kaldır. |
| Image | Hero'da gerçek görsel yok (placeholder). HR-14'te eklenecek — o zaman `priority` + `sizes` eklenecek. Şimdilik N/A. |
| Bundle | StickerBadge küçük component (~30 satır). Ek chunk gerekmez. |

**Yapılacak tek şey:** VideoModal'ı dynamic import'a çevir.

---

**Kabul kontrol listesi (HR-11~13 topluca):**

- [ ] CTA group mobilde dikey (`flex-col sm:flex-row`)
- [ ] Primary CTA mobilde full width
- [ ] Ghost CTA'da `justify-center`
- [ ] StickerBadge mobilde gizli (`hidden sm:flex sm:absolute`)
- [ ] Ghost buton'da focus-visible ring var
- [ ] VideoModal'daki `text-white/60` kontrast kontrolü (düşükse /80 yap)
- [ ] VideoModal dynamic import (`next/dynamic`, `ssr: false`)
- [ ] `npm run build` hatasız
- [ ] Emoji yok
- [ ] Mevcut fonksiyonalite korunmuş

---

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
| U-21 | Aziz acceptance review | Bekliyor | U-20 | Aziz preview URL'de 5 iyileştirmeyi kontrol eder. |

**Bağımlılık özeti:**
- U-01 hepsinden önce (renk paleti)
- Grup 2-6 paralel yapılabilir (her biri bağımsız iyileştirme)
- U-18~21 en son (polish)

---

## Tamamlanan

(henüz yok)

-