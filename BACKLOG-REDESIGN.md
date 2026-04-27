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

#### UA-01~08 Detaylı Prompt (Claude Code bu bölümü okuyacak)

**Branch:** `claude/redesign-modern-ui` · **Commit önerisi:** `feat: UA-01~08 3 adımda hazır bölümü`

Mevcut pattern'ı takip et: `lib/constants/` → data, `components/sections/` → section component, primitive'ler `components/primitives/`'den import.

---

##### UA-01: Constants — `lib/constants/uc-adim.ts`

```ts
// UA-01 — 3 Adımda Hazır Bölümü Data
// Emoji YASAK: tüm ikonlar Lucide string referansı

export const UC_ADIM_HEADER = {
  eyebrow: 'Kolay kullanım',
  title: '3 adımda hazır',
  subtitle: 'Ürün fotoğrafını yükle, platform ve içerik türünü seç — gerisini AI halleder.',
} as const

export interface UcAdimStep {
  number: number
  title: string
  description: string
  duration: string
  icon: string // Lucide icon name
}

export const UC_ADIM_STEPS: UcAdimStep[] = [
  {
    number: 1,
    title: 'Ürünü yükle',
    description: 'Fotoğraf çek, galeri seç veya barkod tara.',
    duration: '~5 saniye',
    icon: 'Upload',
  },
  {
    number: 2,
    title: 'Seçimini yap',
    description: 'Platform ve içerik türünü belirle.',
    duration: '~5 saniye',
    icon: 'Settings2',
  },
  {
    number: 3,
    title: 'İçeriğini al',
    description: 'AI listing metni, görsel, video ve sosyal içerik üretir.',
    duration: '~20 saniye',
    icon: 'Sparkles',
  },
]

export const UC_ADIM_TOTAL = {
  label: 'Ortalama tamamlama',
  duration: '30 saniye',
} as const

// Step 1 mockup data
export const STEP1_INPUT_METHODS = [
  { icon: 'Camera', label: 'Fotoğraf çek', active: true },
  { icon: 'Image', label: 'Galeriden seç', active: false },
  { icon: 'ScanLine', label: 'Barkod tara', active: false },
] as const

// Step 2 mockup data
export const STEP2_PLATFORMS = [
  { label: 'Trendyol', selected: true, color: '#F27A1A' },
  { label: 'Amazon', selected: true, color: '#FF9900' },
  { label: 'Hepsiburada', selected: false, color: '#4A90D9' },
  { label: 'N11', selected: false, color: '#7B2BFC' },
] as const

export const STEP2_CONTENT_TYPES = [
  { icon: 'FileText', label: 'Metin', selected: true, color: '#1E40AF' },
  { icon: 'Image', label: 'Görsel', selected: true, color: '#7C3AED' },
  { icon: 'Video', label: 'Video', selected: false, color: '#DC2626' },
  { icon: 'Share2', label: 'Sosyal', selected: false, color: '#059669' },
] as const

// Step 3 mockup data
export const STEP3_OUTPUTS = [
  { icon: 'FileText', label: 'Trendyol listing metni', status: 'Hazır' },
  { icon: 'Image', label: 'Amazon ürün görseli', status: 'Hazır' },
] as const

export const STEP3_MORE_COUNT = 2 // "ve 2 tane daha..."
```

---

##### UA-02: Section — `components/sections/UcAdimSection.tsx`

Ana wrapper. `_tanitim-redesign.tsx`'e HeroSection'dan SONRA, IcerikTurleri'nden ÖNCE eklenir.

```tsx
import SectionHeader from '@/components/primitives/SectionHeader'
import { UC_ADIM_HEADER, UC_ADIM_STEPS, UC_ADIM_TOTAL } from '@/lib/constants/uc-adim'
// ... diğer importlar

export default function UcAdimSection() {
  return (
    <section className="bg-white py-16 md:py-20 lg:py-24 px-6" aria-label="Nasıl çalışır">
      <div className="mx-auto max-w-[1200px]">
        <SectionHeader
          eyebrow={UC_ADIM_HEADER.eyebrow}
          title={UC_ADIM_HEADER.title}
          subtitle={UC_ADIM_HEADER.subtitle}
        />

        {/* 3 kolon grid — step kartları */}
        <div className="relative grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8">
          {/* ConnectorLine buraya (UA-07) */}
          {UC_ADIM_STEPS.map((step, i) => (
            <StepCard key={step.number} step={step} index={i} />
          ))}
        </div>

        {/* TotalTimeBar (UA-08) */}
        <TotalTimeBar />
      </div>
    </section>
  )
}
```

**`_tanitim-redesign.tsx`'e ekle:**
```diff
 import HeroSection from '@/components/sections/HeroBlock/HeroSection'
+import UcAdimSection from '@/components/sections/UcAdimSection'
 import IcerikTurleriSection from '@/components/sections/IcerikTurleriSection'
 ...
 <HeroSection />
+<UcAdimSection />
 <IcerikTurleriSection />
```

---

##### UA-03: StepCard (UcAdimSection içinde veya ayrı dosya — tercihen aynı dosyada)

```tsx
function StepCard({ step, index }: { step: UcAdimStep; index: number }) {
  return (
    <div className="flex flex-col items-center text-center">
      {/* NumberCircle */}
      <div
        className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border-2 border-rd-primary-200 bg-white"
        aria-hidden="true"
      >
        <span className="font-rd-display text-3xl font-[800] text-rd-primary-700">
          {step.number}
        </span>
      </div>

      {/* Title */}
      <h3 className="mb-2 font-rd-display text-xl font-bold text-slate-900">
        {step.title}
      </h3>

      {/* Description */}
      <p className="mb-4 text-sm leading-relaxed text-slate-600">
        {step.description}
      </p>

      {/* MiniMockup (UA-04/05/06 — aşağıda) */}
      <div className="mb-4 w-full">
        {index === 0 && <InputMockup />}
        {index === 1 && <SelectionMockup />}
        {index === 2 && <OutputMockup />}
      </div>

      {/* DurationLabel */}
      <div className="inline-flex items-center gap-1.5 text-xs text-slate-500">
        <Clock size={12} strokeWidth={2} aria-hidden="true" />
        <span>{step.duration}</span>
      </div>
    </div>
  )
}
```

Import: `import { Clock } from 'lucide-react'`

---

##### UA-04: InputMockup (Step 1)

```tsx
function InputMockup() {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4" role="img" aria-label="Ürün yükleme ekranı">
      {/* 3 input metodu */}
      <div className="mb-3 flex gap-2">
        {STEP1_INPUT_METHODS.map((m) => {
          const Icon = STEP1_ICONS[m.icon]
          return (
            <div
              key={m.label}
              className={cn(
                'flex flex-1 flex-col items-center gap-1 rounded-lg border px-2 py-2.5 text-[10px] font-medium transition-colors',
                m.active
                  ? 'border-rd-primary-200 bg-rd-primary-50 text-rd-primary-700'
                  : 'border-slate-200 bg-white text-slate-500'
              )}
            >
              {Icon && <Icon size={14} strokeWidth={1.5} />}
              {m.label}
            </div>
          )
        })}
      </div>
      {/* Upload preview */}
      <div className="flex items-center gap-3 rounded-lg border border-dashed border-slate-300 bg-white p-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100">
          <ImageIcon size={16} className="text-slate-400" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-slate-700">fincan_01.jpg</p>
          <p className="text-[10px] text-slate-400">2.4 MB</p>
        </div>
      </div>
    </div>
  )
}
```

Import: `import { Camera, Image as ImageIcon, ScanLine } from 'lucide-react'`

STEP1_ICONS map (dosyanın üstünde):
```tsx
const STEP1_ICONS: Record<string, React.ComponentType<any>> = { Camera, Image: ImageIcon, ScanLine }
```

---

##### UA-05: SelectionMockup (Step 2)

```tsx
function SelectionMockup() {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4" role="img" aria-label="Platform ve içerik seçimi">
      {/* Platform chips */}
      <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-slate-400">Platformlar</p>
      <div className="mb-3 flex flex-wrap gap-1.5">
        {STEP2_PLATFORMS.map((p) => (
          <span
            key={p.label}
            className={cn(
              'rounded-full px-2.5 py-1 text-[10px] font-medium',
              p.selected
                ? 'border border-transparent text-white'
                : 'border border-slate-200 bg-white text-slate-500'
            )}
            style={p.selected ? { backgroundColor: p.color } : undefined}
          >
            {p.label}
          </span>
        ))}
      </div>
      {/* Content type icons */}
      <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-slate-400">İçerik türleri</p>
      <div className="flex gap-2">
        {STEP2_CONTENT_TYPES.map((ct) => {
          const Icon = STEP2_ICONS[ct.icon]
          return (
            <div
              key={ct.label}
              className={cn(
                'flex flex-1 flex-col items-center gap-1 rounded-lg border px-2 py-2 text-[10px] font-medium',
                ct.selected
                  ? 'border-transparent'
                  : 'border-slate-200 bg-white text-slate-400'
              )}
              style={ct.selected ? { backgroundColor: ct.color + '15', color: ct.color, borderColor: ct.color + '30' } : undefined}
            >
              {Icon && <Icon size={14} strokeWidth={1.5} />}
              {ct.label}
            </div>
          )
        })}
      </div>
    </div>
  )
}
```

STEP2_ICONS map: `{ FileText, Image: ImageIcon, Video, Share2 }`
Import: `import { FileText, Video, Share2 } from 'lucide-react'`

---

##### UA-06: OutputMockup (Step 3)

```tsx
function OutputMockup() {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4" role="img" aria-label="Üretilen içerikler">
      <div className="space-y-2">
        {STEP3_OUTPUTS.map((out) => {
          const Icon = STEP3_ICONS[out.icon]
          return (
            <div key={out.label} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2.5">
              {Icon && <Icon size={14} className="shrink-0 text-rd-primary-700" strokeWidth={1.5} />}
              <span className="flex-1 truncate text-xs font-medium text-slate-700">{out.label}</span>
              <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-600">
                <Check size={10} strokeWidth={2.5} />
                {out.status}
              </span>
            </div>
          )
        })}
      </div>
      <p className="mt-2 text-center text-[10px] text-slate-400">
        ve {STEP3_MORE_COUNT} tane daha...
      </p>
    </div>
  )
}
```

STEP3_ICONS map: `{ FileText, Image: ImageIcon }`
Import: `import { Check } from 'lucide-react'` (zaten var olabilir)

---

##### UA-07: ConnectorLine

Grid wrapper (`relative`) içinde, NumberCircle'ların ortasını birleştiren yatay dashed çizgi. Sadece desktop'ta görünür.

```tsx
{/* ConnectorLine — desktop only */}
<div
  className="absolute left-0 right-0 top-10 hidden md:block"
  style={{ marginLeft: 'calc(50% / 3)', marginRight: 'calc(50% / 3)' }}
  aria-hidden="true"
>
  <div className="border-t-2 border-dashed border-slate-300" />
</div>
```

`top-10` = 40px = NumberCircle'ın ortası (80px / 2). Grid container'da zaten `relative` var.

Daha temiz alternatif: NumberCircle yüksekliği h-20 → merkez 40px. Connector `top-[40px]` ve her iki uçta padding bırakarak sadece circle'lar arasında çizgi çiz:

```tsx
<div
  className="pointer-events-none absolute top-[40px] hidden md:block"
  style={{ left: 'calc(100% / 6)', right: 'calc(100% / 6)' }}
  aria-hidden="true"
>
  <div className="border-t-2 border-dashed border-slate-300" />
</div>
```

---

##### UA-08: TotalTimeBar

Grid'in altında, ortalanmış bir bar.

```tsx
function TotalTimeBar() {
  return (
    <div className="mx-auto mt-12 max-w-[420px]">
      <div className="flex items-center justify-center gap-2 rounded-full bg-rd-primary-50 px-6 py-3">
        <Clock size={16} strokeWidth={2} className="text-rd-primary-700" aria-hidden="true" />
        <span className="text-sm text-slate-700">
          {UC_ADIM_TOTAL.label}:{' '}
          <strong className="font-semibold text-rd-primary-700">{UC_ADIM_TOTAL.duration}</strong>
        </span>
      </div>
    </div>
  )
}
```

**Stagger animasyon (opsiyonel ama güzel olur):** Her StepCard'a stagger fade-in ekle. globals.css'teki mevcut `fade-in` keyframe'ini kullan:

```tsx
// StepCard wrapper'ına:
<div
  className="flex flex-col items-center text-center"
  style={{ animation: `fade-in 500ms ease-out ${index * 100}ms both` }}
>
```

Ve globals.css'e reduced motion kontrolü:
```css
@media (prefers-reduced-motion: reduce) {
  .uc-adim-card { animation: none !important; }
}
```
Veya inline style kullanılıyorsa class gerekmez — browser `prefers-reduced-motion` ile inline style'daki animation'ı override edemez. Bu yüzden class bazlı yapmak daha iyi:

```css
.animate-step-card-1 { animation: fade-in 500ms ease-out both; }
.animate-step-card-2 { animation: fade-in 500ms ease-out 100ms both; }
.animate-step-card-3 { animation: fade-in 500ms ease-out 200ms both; }

@media (prefers-reduced-motion: reduce) {
  .animate-step-card-1,
  .animate-step-card-2,
  .animate-step-card-3 { animation: none; }
}
```

StepCard'da: `className={cn("flex flex-col items-center text-center", \`animate-step-card-\${index + 1}\`)}`

---

##### UA-09: Mobile Responsive + A11y (tek geçiş)

**Responsive:**
- Grid zaten `grid-cols-1 md:grid-cols-3` — mobilde tek kolon ✓
- ConnectorLine `hidden md:block` — mobilde gizli ✓
- Mobilde gap: `gap-12 md:gap-8` (12 = 48px mobilde, 8 = 32px desktop'ta)
- MiniMockup max-width: `max-w-[280px] mx-auto` ekle (mobilde çok geniş olmasın)

**A11y:**
- Section: `aria-label="Nasıl çalışır"` ✓
- h2 (SectionHeader) → h3 (StepCard title) hiyerarşi ✓
- NumberCircle: `aria-hidden="true"` ✓
- ConnectorLine: `aria-hidden="true"` ✓
- MiniMockup'lar: `role="img" aria-label="..."` ✓
- DurationLabel Clock ikonu: `aria-hidden="true"` ✓
- Tüm renk kontrastları slate-600 on white = 5.7:1 ✓

---

**Dosya listesi:**

| Dosya | İşlem |
|-------|-------|
| `lib/constants/uc-adim.ts` | YENİ |
| `components/sections/UcAdimSection.tsx` | YENİ (StepCard, InputMockup, SelectionMockup, OutputMockup, TotalTimeBar, ConnectorLine hepsi aynı dosyada) |
| `app/_tanitim-redesign.tsx` | GÜNCELLE (import + render sırası) |
| `app/globals.css` | GÜNCELLE (step-card animasyon class'ları + reduced motion) |

**Kabul kontrol listesi (UA-01~09 topluca):**

- [ ] Constants dosyası: tüm adım verileri, mockup verileri, header metinleri
- [ ] SectionHeader: eyebrow "Kolay kullanım", title "3 adımda hazır"
- [ ] 3 kolon grid desktop, tek kolon mobil
- [ ] Her kart: NumberCircle (80×80, outline, Manrope 800) + h3 + açıklama + mockup + süre
- [ ] Step 1 mockup: 3 input metodu (Fotoğraf seçili), upload preview
- [ ] Step 2 mockup: 4 platform chip (2 seçili, renkli), 4 içerik türü (2 seçili)
- [ ] Step 3 mockup: 2 output satırı (Check + Hazır), "ve 2 tane daha..."
- [ ] ConnectorLine: dashed, desktop-only, circle ortası hizalı
- [ ] TotalTimeBar: primary-50 bg, Clock + "30 saniye" bold
- [ ] Stagger fade-in animasyon (3 kart, 100ms aralık)
- [ ] `prefers-reduced-motion` → animasyon devre dışı
- [ ] `_tanitim-redesign.tsx`'e Hero → **UcAdim** → IcerikTurleri sırasıyla ekli
- [ ] `npm run build` hatasız
- [ ] Emoji YOK
- [ ] Tüm a11y kontrolleri (aria-hidden, role="img", heading hiyerarşi)
- [ ] Commit: `feat: UA-01~08 3 adımda hazır bölümü`

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

#### MB-01~10 Detaylı Prompt (Claude Code bu bölümü okuyacak)

**Genel bilgi:** Marka Bilgileri bölümü — kullanıcıya marka profili oluşturma özelliğini tanıtan interaktif section. Sol tarafta özellik listesi, sağ tarafta canlı form preview kartı. Ton seçimi değiştikçe çıktı metni değişiyor.

**Branch:** `claude/redesign-modern-ui`
**Referans:** Eski `components/tanitim/BrandProfile.tsx` dosyası referans olarak okunabilir.

---

##### MB-01: Constants dosyası

Dosya: `lib/constants/marka-bilgileri.ts`

```ts
import { Store, Target, Palette, Lightbulb } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const MB_HEADER = {
  eyebrow: "Yeni özellik",
  eyebrowColor: "accent" as const,
  title: "Marka bilgilerini gir, sana özel içerikler al",
  subtitle: "Profilinden mağaza adını, hedef kitlenini ve metin tonunu belirle. Bundan sonra her üretimde AI bu bilgileri kullanır.",
};

export interface BrandFeature {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const BRAND_FEATURES: BrandFeature[] = [
  {
    icon: Store,
    title: "Marka kimliği",
    description: "Mağaza adın ve marka kimliğin metne yansır",
  },
  {
    icon: Target,
    title: "Hedef kitle odaklı",
    description: "Hedef kitlenin dilinde yazar — doğru kitleye hitap eder",
  },
  {
    icon: Palette,
    title: "Ton seçimi",
    description: "Samimi, profesyonel veya premium — tonunu seç, her üretimde uygular",
  },
  {
    icon: Lightbulb,
    title: "Marka değerleri",
    description: "Hızlı kargo, yerli üretim gibi değerlerin her ürüne otomatik eklenir",
  },
];

export type ToneKey = "samimi" | "profesyonel" | "premium";

export interface ToneChip {
  key: ToneKey;
  label: string;
  output: string; // OutputPreview'da gösterilecek metin
}

export const TONE_CHIPS: ToneChip[] = [
  {
    key: "samimi",
    label: "Samimi",
    output: "Bu tişört tam sana göre! Yumuşacık kumaşı ve şık kesimi ile her kombine uyum sağlar. Hemen sipariş ver, yarın kapında.",
  },
  {
    key: "profesyonel",
    label: "Profesyonel",
    output: "Premium pamuk karışımı kumaştan üretilmiş, ergonomik kesim tişört. Boyut tablosu için ürün detaylarını inceleyebilirsiniz.",
  },
  {
    key: "premium",
    label: "Premium",
    output: "Özenle seçilmiş Ege pamuğundan, sınırlı üretim koleksiyon parçası. Minimalist tasarımı ile gardırobunuzun vazgeçilmezi olacak.",
  },
];

export const BRAND_FORM_FIELDS = {
  storeName: { label: "Mağaza adı", value: "Ayşe Tekstil" },
  targetAudience: { label: "Hedef kitle", value: "25-40 yaş kadınlar" },
};

export const MB_CTA = {
  text: "Marka profilimi oluştur",
  href: "/uret",
};

export const MB_HINT = "Tonu değiştir, AI çıktısının nasıl değiştiğini gör";
```

---

##### MB-02: Section scaffold + 2 kolon grid

Dosya: `components/sections/MarkaBilgileriSection.tsx`

```
'use client'

import { useState } from "react"
// Tüm sub-component'ler AYNI DOSYADA olacak (UA pattern'i gibi)
```

- Section: `bg-rd-neutral-50 py-16 md:py-20 lg:py-28`
- Container: `max-w-6xl mx-auto px-4 sm:px-6 lg:px-8`
- Grid: `grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start`
- Sol kolon: özellikler + CTA
- Sağ kolon: BrandFormPreview kartı

---

##### MB-03: LeftColumn

Sol kolon içeriği (grid'in ilk child'ı olarak, ayrı component değil inline):

1. **Eyebrow:** `<Eyebrow>` primitive kullan, `color="accent"`, `icon={<Sparkles size={14} />}`. Sparkles lucide-react'tan.
2. **Heading:** `<h2>` — font-rd-display, text-3xl md:text-4xl, font-extrabold, tracking-tight, text-rd-neutral-900. İçerik: `MB_HEADER.title`
3. **Subtitle:** `<p>` — text-lg text-rd-neutral-600 leading-relaxed, mt-4. İçerik: `MB_HEADER.subtitle`
4. **Feature list:** `<div className="mt-8 space-y-5">` — her feature:
   - Flex row: `flex items-start gap-4`
   - Icon box: `w-10 h-10 rounded-xl bg-rd-accent-50 flex items-center justify-center shrink-0`
   - Icon: `<feature.icon size={20} strokeWidth={1.5} className="text-rd-accent-700" />`
   - Text: `<div>` — title `text-sm font-medium text-rd-neutral-900` + description `text-sm text-rd-neutral-600 mt-0.5`
5. **CTA link:** `<a href={MB_CTA.href} className="...">` — mt-8, inline-flex items-center gap-2, text-rd-primary font-medium text-sm, hover:text-rd-primary-800, transition-colors. İçerik: `MB_CTA.text` + ArrowRight ikonu (size 16).

---

##### MB-04: BrandFormPreview kartı

Sağ kolonda (grid'in ikinci child'ı). Ayrı bir function component `BrandFormPreview` ama aynı dosyada.

- Props: `{ selectedTone, onToneChange }` — `ToneKey` tipi
- Kart: `bg-white rounded-xl border border-rd-neutral-200 p-6 lg:p-8`
- **NOT:** shadow yok (redesign branch'de shadow OK ama bu tasarımda border yeterli — spec'e sadık kal)

Kart header:
- Flex row: `flex items-center justify-between mb-6`
- Sol: `<p className="text-xs font-medium text-rd-neutral-500 uppercase tracking-widest">Marka Profili</p>`
- Sağ: `<Badge variant="success" size="sm">Aktif</Badge>` — `@/components/primitives/Badge` import et

---

##### MB-05: Static fields (mağaza adı, hedef kitle)

BrandFormPreview kartı içinde, header'dan sonra:

- Container: `<div className="space-y-4 mb-6">`
- Her field:
  ```
  <div>
    <p className="text-xs text-rd-neutral-500 mb-1.5">{field.label}</p>
    <div className="bg-rd-primary-50 border border-rd-primary-200 rounded-lg px-3 py-2.5 text-sm text-rd-primary-800 font-medium">
      {field.value}
    </div>
  </div>
  ```
  - Mağaza adı field: `bg-rd-primary-50 border-rd-primary-200 text-rd-primary-800`
  - Hedef kitle field: `bg-rd-neutral-50 border-rd-neutral-200 text-rd-neutral-700` (farklı renk — bu field daha nötr)

---

##### MB-06: Marka tonu radio group (3 chip)

BrandFormPreview kartı içinde, static fields'tan sonra:

- Label: `<p className="text-xs text-rd-neutral-500 mb-2">Metin tonu</p>`
- Container: `<div role="radiogroup" aria-label="Metin tonu seçimi" className="flex gap-2">`
- Her chip (TONE_CHIPS.map):
  ```tsx
  <button
    key={tone.key}
    role="radio"
    aria-checked={selectedTone === tone.key}
    onClick={() => onToneChange(tone.key)}
    className={cn(
      "px-3.5 py-2 rounded-lg text-xs font-medium transition-colors",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rd-primary focus-visible:ring-offset-2",
      selectedTone === tone.key
        ? "bg-rd-primary text-white"
        : "bg-rd-neutral-100 text-rd-neutral-600 hover:bg-rd-neutral-200"
    )}
  >
    {tone.label}
  </button>
  ```
- **Klavye:** Arrow Left/Right navigasyon — `onKeyDown` handler:
  - ArrowRight → sonraki chip'e focus + select
  - ArrowLeft → önceki chip'e focus + select
  - `tabIndex={selectedTone === tone.key ? 0 : -1}` (roving tabindex pattern)

---

##### MB-07: OutputPreview + fade animasyon

BrandFormPreview kartı içinde, radio group'tan sonra:

- Ayırıcı: `<div className="border-t border-rd-neutral-200 my-6" />`
- Container: `<div className="bg-rd-neutral-50 rounded-lg p-4" aria-live="polite">`
- Eyebrow: `<Eyebrow color="accent" icon={<Sparkles size={14} />} className="mb-3">AI çıktısı — {selectedTone} tonda</Eyebrow>`
- Output text: 
  ```tsx
  <p
    key={selectedTone} // key değişince remount → animasyon tetiklenir
    className="text-sm text-rd-neutral-700 leading-relaxed animate-output-fade-in"
  >
    {currentTone.output}
  </p>
  ```
- Alt not: `<p className="text-xs text-rd-neutral-500 mt-3 flex items-center gap-1"><Check size={12} strokeWidth={2} /> Her üretimde otomatik uygulanır</p>`

**Animasyon (globals.css'e ekle):**
```css
@keyframes output-fade-in {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-output-fade-in {
  animation: output-fade-in 300ms ease-out;
}
@media (prefers-reduced-motion: reduce) {
  .animate-output-fade-in { animation: none; }
}
```

---

##### MB-08: Hint text

Section'ın en altında (grid'den SONRA, container içinde):

```tsx
<p className="text-center text-sm text-rd-neutral-500 italic mt-8 lg:mt-12">
  {MB_HINT}
</p>
```

**DİKKAT:** Spec'te "↑ Tonu değiştir" yazıyor ama oklu stage direction yasak. Constants'taki metni kullan: "Tonu değiştir, AI çıktısının nasıl değiştiğini gör".

---

##### MB-09: Mobile responsive + A11y (tek geçiş)

**Responsive:**
- Grid zaten `grid-cols-1 lg:grid-cols-2` — mobilde sol kolon üstte, kart altta ✓
- Tone chip'ler: `flex-wrap` ekle (çok dar ekranlarda sarılsın)
- Feature icon box: mobilde aynı boyut (10×10 yeterli)
- Padding: section `py-16 md:py-20 lg:py-28` ✓

**A11y:**
- Section: `aria-label="Marka bilgileri"`
- Radio group: `role="radiogroup"` + `aria-label` + roving tabindex ✓
- OutputPreview: `aria-live="polite"` ✓
- Icon'lar: feature icon'ları `aria-hidden="true"` (başlık bilgiyi taşıyor)
- Heading hiyerarşi: SectionHeader yok (h2 direkt), kart içinde h3 yok (label'lar yeterli)
- Focus-visible: tüm interaktif elemanlar ✓
- Renk kontrastı: rd-neutral-600 on white = 5.7:1 ✓

---

**Dosya listesi:**

| Dosya | İşlem |
|-------|-------|
| `lib/constants/marka-bilgileri.ts` | YENİ |
| `components/sections/MarkaBilgileriSection.tsx` | YENİ ('use client', BrandFormPreview aynı dosyada) |
| `app/_tanitim-redesign.tsx` | GÜNCELLE (import + Pazaryeri'den sonra MarkaBilgileriSection ekle) |
| `app/globals.css` | GÜNCELLE (output-fade-in keyframe + reduced motion) |

**Sıra `_tanitim-redesign.tsx`'te:**
```
Hero → UcAdim → IcerikTurleri → Pazaryeri → MarkaBilgileri
```

**Kabul kontrol listesi (MB-01~10 topluca):**

- [ ] Constants dosyası: header, 4 feature, 3 ton (output metinleriyle), form fields, CTA, hint
- [ ] 2 kolon grid: sol features + sağ kart, mobilde tek kolon
- [ ] Sol kolon: accent Sparkles eyebrow, h2 başlık, subtitle, 4 feature (icon box + title + desc), CTA link
- [ ] Sağ kolon: white kart, "Marka Profili" + yeşil "Aktif" badge
- [ ] 2 static field (Mağaza adı primary-50, Hedef kitle neutral-50)
- [ ] 3 ton chip (radiogroup): samimi seçili (mavi), diğerleri neutral. Tıklayınca değişir.
- [ ] Arrow Left/Right klavye navigasyon (roving tabindex)
- [ ] OutputPreview: accent eyebrow "AI çıktısı — {ton} tonda" + ton output metni
- [ ] Ton değişince 300ms fade+slide-up animasyon
- [ ] `aria-live="polite"` output container'da
- [ ] "Her üretimde otomatik uygulanır" alt not (Check ikonu)
- [ ] Hint text: italic, ortalı, grid altında
- [ ] `prefers-reduced-motion` → animasyon devre dışı
- [ ] `_tanitim-redesign.tsx`'e Pazaryeri'den sonra ekli
- [ ] `npm run build` hatasız
- [ ] Emoji YOK
- [ ] Commit: `feat: MB-01~10 marka bilgileri bölümü`

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
| NY-08 | Acceptance review | Bekliyor | NY-07 | Aziz preview kontrolü. |

#### NY-01~07 Detaylı Prompt (Claude Code bu bölümü okuyacak)

**Genel bilgi:** "Neden yzliste?" bölümü — genel AI araçları (ChatGPT, Claude, Gemini) ile yzliste'yi karşılaştıran tablo. 6 satırlık özellik karşılaştırması. Genel araçlar "yapamaz" (X), yzliste "yapar" (Check).

**Branch:** `claude/redesign-modern-ui`

---

##### NY-01: Constants dosyası

Dosya: `lib/constants/neden-yzliste.ts`

```ts
import type { LucideIcon } from "lucide-react";

export const NEDEN_HEADER = {
  eyebrow: "Neden yzliste",
  eyebrowColor: "primary" as const,
  title: "Genel AI araçlarıyla aynı şey değil",
  subtitle: "ChatGPT, Claude ve Gemini genel amaçlı asistanlardır. yzliste e-ticaret için özel inşa edildi.",
};

export interface ComparisonRow {
  feature: string;
  generic: string;
  yzliste: string;
}

export const NEDEN_COMPARISONS: ComparisonRow[] = [
  {
    feature: "Pazaryeri uyumlu metin",
    generic: "Genel metin, format uyumsuz",
    yzliste: "Trendyol, Hepsiburada, Amazon formatında",
  },
  {
    feature: "SEO optimizasyonu",
    generic: "Anahtar kelime bilmez",
    yzliste: "Pazaryeri arama algoritmasına uygun",
  },
  {
    feature: "Ürün görseli",
    generic: "Görsel üretemez veya düşük kalite",
    yzliste: "Arka plan kaldırma, stüdyo çekim, manken giydirme",
  },
  {
    feature: "Ürün videosu",
    generic: "Video üretemez",
    yzliste: "AI ile ürün tanıtım videosu",
  },
  {
    feature: "Marka tonu",
    generic: "Her seferinde yeniden anlat",
    yzliste: "Profilde bir kez belirle, her üretimde uygulansın",
  },
  {
    feature: "Toplu üretim",
    generic: "Tek tek kopyala yapıştır",
    yzliste: "Excel yükle, yüzlerce ürünü tek seferde üret",
  },
];

export const NEDEN_TABLE_HEADERS = {
  generic: {
    eyebrow: "Genel AI araçları",
    subtitle: "ChatGPT, Claude, Gemini",
  },
  yzliste: {
    eyebrow: "yzliste",
    subtitle: "E-ticaret için özel inşa edildi",
  },
};

export const NEDEN_FOOTNOTE = "ChatGPT, Claude ve Gemini harika genel amaçlı asistanlardır. Ancak e-ticaret listing'i üretmek için tasarlanmamışlardır. yzliste bu ihtiyaç için sıfırdan inşa edildi.";
```

---

##### NY-02: Section scaffold + SectionHeader

Dosya: `components/sections/NedenYzlisteSection.tsx`

- Server component (interaktif state yok — `'use client'` gerekmez)
- Section: `bg-white py-16 md:py-20 lg:py-28`
- Container: `max-w-4xl mx-auto px-4 sm:px-6 lg:px-8`
- `<SectionHeader>` primitive kullan:
  ```tsx
  <SectionHeader
    eyebrow={NEDEN_HEADER.eyebrow}
    eyebrowColor="primary"
    title={NEDEN_HEADER.title}
    subtitle={NEDEN_HEADER.subtitle}
    maxWidth="700px"
  />
  ```

---

##### NY-03 + NY-04 + NY-05: ComparisonTable

Tablo, SectionHeader'dan sonra. Tüm bileşenler aynı dosyada (ayrı component gerekmez, inline yeterli).

**Desktop layout (md ve üstü):** Semantic `<table>`.

```tsx
<div className="mt-12 overflow-hidden rounded-xl border border-rd-neutral-200">
  <table className="w-full" aria-label="yzliste ve genel AI araçları karşılaştırması">
    <thead>
      <tr>
        <th scope="col" className="w-[28%] bg-white px-5 py-4 text-left text-xs font-medium text-rd-neutral-500 uppercase tracking-wider border-b border-rd-neutral-200">
          Özellik
        </th>
        <th scope="col" className="w-[36%] bg-rd-neutral-100 px-5 py-4 text-left border-b border-rd-neutral-200">
          <p className="text-xs font-medium text-rd-neutral-500 uppercase tracking-wider">{NEDEN_TABLE_HEADERS.generic.eyebrow}</p>
          <p className="text-xs text-rd-neutral-400 mt-0.5">{NEDEN_TABLE_HEADERS.generic.subtitle}</p>
        </th>
        <th scope="col" className="w-[36%] bg-rd-primary-50 px-5 py-4 text-left border-b border-rd-neutral-200">
          <p className="text-xs font-medium text-rd-primary uppercase tracking-wider">{NEDEN_TABLE_HEADERS.yzliste.eyebrow}</p>
          <p className="text-xs text-rd-primary-700 mt-0.5">{NEDEN_TABLE_HEADERS.yzliste.subtitle}</p>
        </th>
      </tr>
    </thead>
    <tbody>
      {NEDEN_COMPARISONS.map((row, i) => (
        <tr key={i} className={i < NEDEN_COMPARISONS.length - 1 ? "border-b border-rd-neutral-100" : ""}>
          <td className="px-5 py-4 text-sm font-medium text-rd-neutral-900">{row.feature}</td>
          <td className="bg-rd-neutral-50/50 px-5 py-4">
            <div className="flex items-start gap-2.5">
              <span className="mt-0.5 w-5 h-5 rounded-full bg-red-100 flex items-center justify-center shrink-0" aria-hidden="true">
                <X size={12} strokeWidth={2.5} className="text-red-500" />
              </span>
              <span className="text-sm text-rd-neutral-500">{row.generic}</span>
            </div>
          </td>
          <td className="bg-[#FAFCFF] px-5 py-4">
            <div className="flex items-start gap-2.5">
              <span className="mt-0.5 w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0" aria-hidden="true">
                <Check size={12} strokeWidth={2.5} className="text-emerald-600" />
              </span>
              <span className="text-sm text-rd-neutral-900">{row.yzliste}</span>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
```

**CRITICAL:** `X` ve `Check` Lucide icon'dan import. ASLA emoji kullanma (ne ❌ ne ✓ ne ✅).

Lucide import: `import { X, Check } from "lucide-react"`

---

##### NY-06: Footnote

Tablodan sonra:

```tsx
<p className="mt-8 text-center text-sm text-rd-neutral-500 italic max-w-2xl mx-auto leading-relaxed">
  {NEDEN_FOOTNOTE}
</p>
```

---

##### NY-07: Mobile responsive + a11y (tek geçiş)

**Responsive (mobil alternatif — CRITICAL):**

Mobilde `<table>` layout kötü görünür — satırlar çok dar, metin sarılır. Bunun yerine **mobilde kart tabanlı layout**, desktop'ta tablo göster:

```tsx
{/* Desktop: table (md ve üstü) */}
<div className="hidden md:block mt-12 overflow-hidden rounded-xl border border-rd-neutral-200">
  <table ...> {/* yukarıdaki tablo */} </table>
</div>

{/* Mobile: card layout (md altı) */}
<div className="md:hidden mt-10 space-y-4">
  {NEDEN_COMPARISONS.map((row, i) => (
    <div key={i} className="rounded-xl border border-rd-neutral-200 overflow-hidden">
      <div className="bg-rd-neutral-50 px-4 py-3 border-b border-rd-neutral-100">
        <p className="text-sm font-medium text-rd-neutral-900">{row.feature}</p>
      </div>
      <div className="divide-y divide-rd-neutral-100">
        <div className="px-4 py-3 flex items-start gap-2.5">
          <span className="mt-0.5 w-5 h-5 rounded-full bg-red-100 flex items-center justify-center shrink-0" aria-hidden="true">
            <X size={12} strokeWidth={2.5} className="text-red-500" />
          </span>
          <div>
            <p className="text-xs text-rd-neutral-400 mb-0.5">Genel AI</p>
            <p className="text-sm text-rd-neutral-500">{row.generic}</p>
          </div>
        </div>
        <div className="px-4 py-3 bg-[#FAFCFF] flex items-start gap-2.5">
          <span className="mt-0.5 w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0" aria-hidden="true">
            <Check size={12} strokeWidth={2.5} className="text-emerald-600" />
          </span>
          <div>
            <p className="text-xs text-rd-primary mb-0.5">yzliste</p>
            <p className="text-sm text-rd-neutral-900">{row.yzliste}</p>
          </div>
        </div>
      </div>
    </div>
  ))}
</div>
```

**A11y:**
- Desktop table: `aria-label`, `scope="col"` her `<th>`'de ✓
- Icon'lar: `aria-hidden="true"` ✓
- Mobil kartlar: her kart semantik `<div>`, label metin zaten görünür
- Renk kontrastı: rd-neutral-500 on white = 6.2:1, red-500 on red-100 ✓, emerald-600 on emerald-100 ✓
- Section: `aria-label="Neden yzliste"` ekle

---

**Dosya listesi:**

| Dosya | İşlem |
|-------|-------|
| `lib/constants/neden-yzliste.ts` | YENİ |
| `components/sections/NedenYzlisteSection.tsx` | YENİ (server component, table + mobile cards aynı dosyada) |
| `app/_tanitim-redesign.tsx` | GÜNCELLE (import + MarkaBilgileri'den sonra NedenYzlisteSection ekle) |

**Sıra `_tanitim-redesign.tsx`'te:**
```
Hero → UcAdim → IcerikTurleri → Pazaryeri → MarkaBilgileri → NedenYzliste
```

**Kabul kontrol listesi (NY-01~07 topluca):**

- [ ] Constants dosyası: header, 6 karşılaştırma satırı, tablo başlıkları, footnote
- [ ] SectionHeader: "Neden yzliste" eyebrow, provokatif h2, subtitle
- [ ] Desktop (md+): semantic `<table>`, 3 kolon (özellik / genel AI / yzliste)
- [ ] Tablo header: neutral-100 bg (genel) vs primary-50 bg (yzliste)
- [ ] 6 satır: X (kırmızı circle) + metin vs Check (yeşil circle) + metin
- [ ] yzliste kolonu `#FAFCFF` bg tint
- [ ] Mobil (md altı): kart tabanlı layout, her özellik ayrı kart
- [ ] Footnote: italic, gri, ortalı
- [ ] Lucide X ve Check — ASLA emoji
- [ ] `aria-label`, `scope="col"`, `aria-hidden` icon'larda
- [ ] `_tanitim-redesign.tsx`'e MarkaBilgileri'den sonra ekli
- [ ] `npm run build` hatasız
- [ ] Emoji YOK
- [ ] Commit: `feat: NY-01~07 neden yzliste karşılaştırma bölümü`

---

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
| U-21 | Aziz 