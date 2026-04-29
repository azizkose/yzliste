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
| DS-02 | Button primitive | ✅ Tamam | DS-01 | Commit `b537444` |
| DS-03 | Card primitive | ✅ Tamam | DS-01 | Commit `b537444` |
| DS-04 | Badge primitive | ✅ Tamam | DS-01 | Commit `b537444` |
| DS-05 | Eyebrow primitive | ✅ Tamam | DS-01 | Commit `56f4c51` |
| DS-06 | Tab primitive | ✅ Tamam | DS-01 | Commit `56f4c51` — TabList + TabItem (pill) + TabItemUnderline, tam a11y. |
| DS-07 | SectionHeader primitive | ✅ Tamam | DS-05 | Commit `56f4c51` |
| DS-08 | CopyButton primitive | ✅ Tamam | DS-01 | Commit `56f4c51` |

### Pazaryeri Bölümü — Pilot 1

PZ-01~PZ-13 hepsi ✅ Tamam. **Pazaryeri bölümü tamamen kapalı.**

> Detay tablo + prompt arşivlendi → git history

### İçerik Türleri Bölümü — Pilot 2

IT-01~IT-09 hepsi ✅ Tamam. **İçerik türleri bölümü tamamen kapalı.**

> Detay tablo + prompt arşivlendi → git history

### Hero Bölümü (Trust Strip + Nav + Hero)

HR-01~HR-13 ✅ Tamam. HR-14 (gerçek screenshot) + HR-15 (acceptance) bekliyor.

> Prompt arşivlendi → `BACKLOG-REDESIGN-ARCHIVE.md`

### 3 Adımda Hazır Bölümü — Bölüm 04

UA-01~UA-10 hepsi ✅ Tamam (Aziz onayladı 27 Nis 2026).

> Prompt arşivlendi → `BACKLOG-REDESIGN-ARCHIVE.md`

### Marka Bilgileri Bölümü — Bölüm 05

MB-01~MB-11 hepsi ✅ Tamam (Aziz onayladı 27 Nis 2026, commit `4ef11f5`).

> Prompt arşivlendi → `BACKLOG-REDESIGN-ARCHIVE.md`

### Neden yzliste? Bölümü — Bölüm 06

NY-01~NY-08 hepsi ✅ Tamam (Aziz onayladı 27 Nis 2026, commit `ae19f42`).

> Prompt arşivlendi → `BACKLOG-REDESIGN-ARCHIVE.md`

---

### Fiyatlar Bölümü — Bölüm 07

| ID | Başlık | Durum | Notlar |
|---|---|---|---|
| FY-01~11 | Constants + section + slider + paket kartları + responsive + a11y | ✅ Tamam | Commit'ler `28b221c`, `42e95de`, `ad2719f`, `fec994f`, `29d4e61`, `fd9a2aa`, `b9faf36`, `464b40b`, `6a0c641` |
| FY-12 | Acceptance review | ✅ Tamam | Aziz onayladı 27 Nis 2026 |
| FY-FIX-01 | Mavi border slider'la dinamik geçsin + CTA pozisyonu | ✅ Tamam | isRecommended ile bağlandı, "Senin için" badge kaldırıldı, CTA özelliklerin altına alındı |
| FY-FIX-02 | (kontrol) Popüler rozeti hâlâ render oluyor mu | Bekliyor | Aziz scroll ile doğrulayacak, yoksa rozet bloğu geri eklenir |

> Prompt arşivlendi → git history

---

### SSS Bölümü — Bölüm 08

| ID | Başlık | Durum | Notlar |
|---|---|---|---|
| SS-01~05 | Constants + accordion + ContactNote + reduced-motion + a11y | ✅ Tamam | Commit'ler `f7fc05d`, `379c723`, `6a444c0` |
| SS-06 | Acceptance review | ✅ Tamam | Aziz onayladı 27 Nis 2026 |

> Prompt arşivlendi → git history

---

### Final CTA Bölümü — Bölüm 09

| ID | Başlık | Durum | Notlar |
|---|---|---|---|
| FC-01~05 | Constants + section + gradient + CTA + a11y | ✅ Tamam | Commit'ler `c44c2df`, `25c4436`, `faaa45b` |
| FC-06 | Acceptance review | ✅ Tamam | Aziz onayladı 27 Nis 2026 (FC-FIX-02 sonrası) |
| FC-FIX-01 | `--color-rd-primary-600` token eksikliği | ✅ Tamam | globals.css satır 24'e `#2563EB` eklendi |
| FC-FIX-02 | Gradient stacking context bug | ✅ Tamam | Gradient `<section style>` üzerine taşındı, `-z-10` kaldırıldı |
| TOKEN-FIX-01 | Faz 2 öncesi eksik token'ları tamamla (success/warning/danger + Hepsiburada/N11) | ✅ Tamam | globals.css'e eklendi |

> Prompt arşivlendi → git history

---

### Footer Bölümü — Bölüm 10

| ID | Başlık | Durum | Notlar |
|---|---|---|---|
| FT-01~09 | Constants + scaffold + brand + linkler + iyzico + disclaimer + responsive + a11y | ✅ Tamam | iyzico logo public/iyzico_footer_logo.png mevcut |
| FT-10 | Acceptance review | ✅ Tamam | Aziz onayladı 27 Nis 2026 |

> Prompt arşivlendi → git history

---

### Açık Sorular (Aziz kararı bekliyor)

**Grup A — Route'lar:** Q1-Q5 hepsi ✅ kararlaştı.
**Grup B — Rakam doğrulamaları:** Q6-Q12 hepsi ✅ kararlaştı (Q10 fiyatlar `lib/paketler.ts`'den, Q11 CREDIT_PER_PRODUCT=1, Q12 "e-Arşiv fatura").
**Grup C — İçerik:** Q13-Q23 hepsi kararlaştı ve uygulandı.
**Grup D — Teknik:** Q24-Q29 hepsi çözüldü.

---

## /uret Sayfası UX Refactor — Bölüm 11

**Yaklaşım:** Hafif refaktör — mevcut iskelet korunur, 5 UX iyileştirmesi.
**Spec:** `uret-ux-redesign-spec.md` | **Mockup:** `uret-redesign-mockup.jsx` | **Kararlar:** `uret-redesign-kararlar.md`
**Branch:** `claude/redesign-modern-ui` (anasayfa redesign ile aynı)

**Karar özeti (27 Nisan 2026):**
- "ADIM 1/3" kalıyor
- Yetersiz kredi → disabled buton + tooltip "Yetersiz kredi. Paket al →" + `/fiyatlar`
- Marka profili kayıt → `/profil`
- Demo tonu → sadece önizleme
- "Sosyal medya kiti" konsepti → kaldırıldı
- Emoji → Lucide

### Grup 1 — Renk Paleti Uyumu

| ID | Başlık | Durum | Notlar |
|---|---|---|---|
| U-01 | Renk paleti: bej → rd-* token dönüşümü | ✅ Tamam | 8 dosyada eski hex → rd-neutral/rd-primary token'ları. Premium amber (#A87847, #7D5630) korundu (Yzstudio için). |

> Prompt arşivlendi → git history

### Grup 2 — Niyet Hatırlatıcı (Intent Banner)

| ID | Başlık | Durum | Notlar |
|---|---|---|---|
| U-02 | Sarı marka uyarısı banner'ını kaldır | ✅ Tamam | app/uret/page.tsx eski sarı conditional kaldırıldı |
| U-03 | IntentBanner component | ✅ Tamam | components/uret/IntentBanner.tsx — "ADIM 1/3" eyebrow + "İçerik türünü seç" H1 + subtitle |

> Prompt arşivlendi → git history

### Grup 3 — Marka Profili Interaktif Demo

| ID | Başlık | Durum | Notlar |
|---|---|---|---|
| U-04 | BrandProfileBlock scaffold (collapsible) | ✅ Tamam | components/uret/BrandProfileBlock.tsx — accent border-left, "Önce dene" buton |
| U-05 | ToneSelector (3 chip, radio group) | ✅ Tamam | components/uret/ToneSelector.tsx — Heart/Briefcase/Sparkles, ARIA radio, Arrow Left/Right |
| U-06 | AIPreview (canlı değişen çıktı, fade) | ✅ Tamam | components/uret/AIPreview.tsx — TONE_CHIPS.output reuse, fade animasyon, banner turuncu→yeşil |
| U-07 | "Profili düzenle" CTA → `/profil` | ✅ Tamam | BrandProfileBlock demo açıkken AIPreview altında outline link |

> Prompt arşivlendi → git history

### Grup 4 — Canlı Kredi Maliyeti (Sticky Submit Bar)

| ID | Başlık | Durum | Notlar |
|---|---|---|---|
| U-08 | `calculateCredits()` hook | ✅ Tamam | components/uret/useCalculateCredits.ts — sekme bazlı reactive |
| U-09 | StickySubmitBar component | ✅ Tamam | components/uret/StickySubmitBar.tsx — sticky bottom, cost summary + CTA |
| U-10 | Yetersiz kredi durumu | ✅ Tamam | Bakiye < maliyet → buton disabled + "Yetersiz kredi · Paket al" → `/fiyatlar` |

> Prompt arşivlendi → git history

### Grup 5 — Disabled Buton Tooltip

| ID | Başlık | Durum | Notlar |
|---|---|---|---|
| U-11 | `getCTAState()` hook | ✅ Tamam | components/uret/useCTAState.ts — sekme bazlı validation, `{ disabled, reason }` |
| U-12 | Tooltip primitive | ✅ Tamam | components/primitives/Tooltip.tsx — fade-in, mobile tap auto-dismiss, ARIA |
| U-13 | Disabled buton + tooltip entegrasyonu | ✅ Tamam | StickySubmitBar Tooltip ile sarmalandı, ctaState prop, aria-disabled |

> Prompt arşivlendi → git history

### Grup 6 — Şeffaf Kredi Etiketleri

| ID | Başlık | Durum | Notlar |
|---|---|---|---|
| U-14 | Form içi kredi yazılarını kaldır | ✅ Tamam | Tüm sekmelerdeki inline "X kredi" yazıları kaldırıldı, kredi sadece sticky bar'da |
| U-15 | "∞ kredi" / "0 kredi" yazılarını kaldır | ✅ Tamam | Anlamsız etiketler temizlendi |
| U-16 | "Sosyal medya kiti" CTA'sını kaldır | ✅ Tamam | Sosyal sekmede tek "İçerik üret" CTA, "kit" konsepti kaldırıldı |
| U-17 | Login gerektiren tooltip + redirect | ✅ Tamam | "Önce giriş yap" tooltip + `/giris` redirect |

> Prompt arşivlendi → git history (U-11~U-17 7 ticket tek paket olarak gitti)

### Grup 7 — Polish & PR (sıradaki)

| ID | Başlık | Durum | Bağımlılık | Kabul Kriteri |
|---|---|---|---|---|
| U-18 | Mobile responsive sweep | ✅ Tamam | U-01~U-17 | Commit `6c7447f` — IntentBanner p-4 sm:p-6, BrandProfileBlock flex-shrink-0 + justify-start sm:justify-end, Tooltip max-w mobile, page.tsx pb-40. |
| U-19 | A11y audit | ✅ Tamam | U-18 | Commit `6c7447f` — Tooltip aria-describedby cloneElement (gerçek child'a), StickySubmitBar disabled→aria-disabled (focus-accessible), prefers-reduced-motion animate-fade-in. |
| U-20 | Lighthouse optimizasyonları | ✅ Tamam | U-19 | Commit `6c7447f` — animate-fade-in @theme'e eklendi (Tailwind v4), prefers-reduced-motion guard. font-display:swap ✓, img boyutları ✓, lucide named imports ✓. |
| U-21 | Aziz kabul | ✅ Tamam | U-20 | 28 Nis Aziz "Faz 2'yi kapat" dedi. Preview test email+şifre ile mümkündü; Google OAuth Faz 4 AU-09'a ertelendi. |

#### U-18 + U-19 + U-20 Birleşik Prompt (Polish paket)

```
ÖNEMLİ — KURAL OVERRIDE:
Bu görev `claude/redesign-modern-ui` branch'inde. CLAUDE.md "yzliste — 
UI değişiklikleri için kalıcı kurallar" bölümü bu branch'te GEÇERSİZ. 
Bunun yerine BACKLOG-REDESIGN.md başındaki redesign branch UI 
kuralları geçerli (font 400-800 serbest, gölge serbest, rounded-2xl 
serbest, Manrope+Inter, rd-* token'lar, sadece emoji yasak — Lucide 
ikon kullan).

Branch: claude/redesign-modern-ui
Görev: U-18~U-20 — /uret refactor polish (Mobile + A11y + Lighthouse opt)

Kapsam: Bölüm 11'de yaptığımız /uret refactor'unun tüm yeni component'leri 
+ entegrasyonları. Mevcut açık bug yok ama büyük bir refactor 17 ticket 
bitti, sapma riski var. Bu paket tarama + düzeltme.

Kapsam dışı: U-21 Aziz acceptance — kullanıcı testi, kod değil.

────────────────────────────────────────────
BÖLÜM 1 — U-18: Mobile responsive sweep
────────────────────────────────────────────

375px (iPhone SE) viewport'ta tüm /uret bileşenleri test edilecek. 
Chrome DevTools mobile emulation veya gerçek cihaz.

Kontrol listesi (her bileşen için):

1. **IntentBanner** (components/uret/IntentBanner.tsx)
   - H1 "İçerik türünü seç" 375px'te taşmıyor mu? (md:text-3xl mobil text-2xl)
   - Padding p-6 dar değil mi? Mobil için p-5 veya p-4 daha uygun olabilir.

2. **BrandProfileBlock** (components/uret/BrandProfileBlock.tsx)
   - Header'daki Sparkles + title + "Önce dene" butonu 375px'te tek satırda 
     bozulmuyor mu? Çok dar geliyorsa flex-wrap koru.
   - Demo açıkken md:grid-cols-[1fr_1.2fr] zaten mobilde tek kolon olur. 
     Doğrula.
   - "Profili düzenle" butonu mobil tek kolona düşünce justify-end yerine 
     justify-start veya full width (w-full sm:w-auto) daha iyi olabilir.

3. **ToneSelector** (components/uret/ToneSelector.tsx)
   - 3 chip flex-wrap zaten var. 375px'te 3 chip yan yana sığar mı? 
     Sığmıyorsa flex-wrap yapacak, OK.
   - Focus ring ekrandan taşmıyor mu (ring-offset-2 düzgün mü)?

4. **AIPreview** (components/uret/AIPreview.tsx)
   - Mock AI çıktısı (samimi/profesyonel/premium TONE_CHIPS.output) uzun 
     metin — taşma yok mu? leading-relaxed ile satır kaydırmalı.
   - "Bu sadece önizleme..." italic gri satırı taşmıyor mu?

5. **StickySubmitBar** (components/uret/StickySubmitBar.tsx)
   - sticky bottom-5 mobilde gerçekten sticky kalıyor mu (Android Chrome 
     iOS Safari)?
   - Mobil flex-col düzeni: cost summary üst, CTA alt, full width
   - "Bakiyenizde X kredi var" ve "Yetersiz kredi · Paket al" satırları 
     uzun mobilde overflow olmasın
   - Klavye odakta çakışma var mı (input focus + sticky bar)?
   - Aksiyon: max-w-3xl mobilde dar geliyorsa max-w-full + px-3 yap

6. **Tooltip** (components/primitives/Tooltip.tsx)
   - Mobil tap → 2sn auto-dismiss çalışıyor mu?
   - whitespace-nowrap uzun reason metni için ekran kenarına taşıyor mu? 
     Eğer "En az bir platform seç" gibi uzun metin viewport'tan taşıyorsa 
     responsive class ekle: max-w-[calc(100vw-2rem)] whitespace-normal sm:whitespace-nowrap

7. **/uret form alanları** (components/tabs/MetinSekmesi/GorselSekmesi/
   VideoSekmesi/SosyalSekmesi.tsx)
   - U-01 sonrası palet OK ama form input padding/font mobilde çok küçük mü?
   - Karakter limit eyebrow'lar mobilde okunabilir mi?

8. **Genel /uret/page.tsx**
   - IntentBanner + BrandProfileBlock + sekmeler + form + sticky bar — bu 
     dikey istif mobilde yeterli boşluklu mu (gap-4/gap-6)?
   - Sticky bar form içeriğini örtüyor mu? Footer padding ekle (mb-32 gibi).

Her sorunu Edit ile düzelt, küçük commit'ler at:
- fix(uret): U-18 [bileşen] mobile responsive

────────────────────────────────────────────
BÖLÜM 2 — U-19: A11y audit
────────────────────────────────────────────

Kontrol listesi:

1. **Radio group ARIA** (ToneSelector)
   - role="radiogroup" var ✓
   - Her chip role="radio", aria-checked
   - Roving tabindex (sadece active veya ilk chip 0, diğerleri -1)
   - Doğrula: Tab girince tek bir chip focus olur, Arrow Left/Right ile 
     diğerlerine geçer

2. **Tooltip ARIA** (Tooltip primitive)
   - role="tooltip" + id var ✓
   - Children'a aria-describedby={tooltipId} eklenmiş mi? — şu an wrapper 
     span'a ekledim ama gerçek button'a geçmiyor olabilir. React.Children 
     mapping ile gerçek child'a propla yansıt. Veya en basit: button bileşeni 
     tooltip'in dışında ama ID'yi açıkça aria-describedby ile bağla.

3. **Disabled buton** (StickySubmitBar)
   - aria-disabled="true" tooltip'le birlikte
   - Disabled durumda focus alabilir mi? (HTML disabled focus alamaz; 
     aria-disabled görsel disabled ama focus alabilir — bu daha iyi a11y)
   - Eğer button HTML disabled ise tooltip görünmez (mouse event'ler 
     disabled buton üzerinde tetiklenmez). Bu sorunlu — aria-disabled'a geç, 
     onClick'i preventDefault yap.

4. **BrandProfileBlock**
   - aria-expanded butonda var ✓
   - aria-controls collapsible div'in id'si ile eşleşiyor ✓

5. **IntentBanner**
   - aria-labelledby h1 id'sine bağlı ✓

6. **Kontrast (WCAG AA)**
   - text-rd-neutral-500 (#64748B) on bg-rd-neutral-50 (#F8FAFC): 4.5:1 
     üstünde mi kontrol et
   - text-rd-primary-700 (#1D4ED8) on white: kesin üstünde, OK
   - Tooltip text white on bg-rd-neutral-900 (#0F172A): kesin üstünde
   - Disabled text-rd-neutral-500 on bg-rd-neutral-300: bu KRİTİK, dikkat
     et. WCAG AA disabled için zorunlu değil ama UX için en az 3:1 olsun.

7. **Klavye navigation full /uret tour**
   - Tab → IntentBanner → BrandProfileBlock buton → ToneSelector chip'ler 
     (Arrow ile gez) → "Profili düzenle" → form alanları → sticky bar buton 
   - Hiçbir focus tuzağı yok mu (tooltip focus'u tutmuyor)?
   - Escape ile collapsible kapanmıyor (gerek yok ama dene)

8. **prefers-reduced-motion**
   - Tooltip animate-fade-in, AIPreview fade — globals.css'te zaten 
     prefers-reduced-motion kuralı var, doğrula

Düzeltmeler için commit:
- fix(uret): U-19 a11y audit (radio roving tabindex, aria-describedby, 
  aria-disabled, kontrast)

────────────────────────────────────────────
BÖLÜM 3 — U-20: Lighthouse optimizasyon önerileri
────────────────────────────────────────────

Lighthouse'u Code çalıştıramaz (preview URL gerekir). Aziz çalıştıracak. 
Code'un yapacağı: bilinen pattern'lerle önden iyileştirme.

Yapılacak optimizasyonlar:

1. **Image optimization** — /uret sayfasında <img> kullanılıyorsa next/image'a 
   geçir (varsa). Mevcut FotoEkleAlani.tsx kontrol et.

2. **Dynamic import (Code splitting)**
   - Tooltip primitive küçük, dynamic gerek yok
   - StickySubmitBar SSR'da gereksiz mi? — sticky için JS gerekli, client 
     component zaten 'use client' ile. Dynamic'e gerek yok.
   - BrandProfileBlock collapsible — küçük, dynamic'e gerek yok
   - YANİ: dynamic import için /uret'te belirgin bir aday yok. Atla.

3. **Font-display swap** (font yükleme)
   - app/layout.tsx'te next/font ile Manrope + Inter düzgün yüklü mü?
   - display: 'swap' ile FOIT engelleniyor mu? Kontrol et, gerekirse ekle.

4. **CLS (Cumulative Layout Shift) kontrolü**
   - StickySubmitBar mount oldu mu olmadı mı diye sayfa sıçrıyor mu? 
     Eğer sıçrıyorsa: parent'a min-height ekle veya bar her zaman render 
     olsun (loading state'te de görünsün).
   - BrandProfileBlock collapsible açıldığında sayfa içeriğini itiyor mu? 
     Bu doğal davranış, CLS değil — ama smooth animation eklenebilir.
   - Image placeholder'lar (FotoEkleAlani) aspect-ratio ile boyut ayrılmış mı?

5. **Hover-only interactions mobile'a uyarlandı mı?**
   - U-18'de Tooltip mobile tap çözüldü ✓

6. **Bundle size**
   - lucide-react import'larını tek tek yapıyoruz (full library import yok). 
     Doğrula.
   - Gereksiz client component yok mu? Form input'lar 'use client' gerektirir 
     ama sticky bar ile aynı sayfada olduklarından zaten client.

Düzeltmeler için commit:
- perf(uret): U-20 Lighthouse optimization (image, font-display, CLS guard)

NOT: Eğer hiçbir değişiklik yapmazsan — yapısal olarak iyiyiz — sadece 
"U-20: kontrol edildi, optimizasyon ihtiyacı yok" notu commit mesajına 
ekle, BACKLOG'da [x] işaretle.

────────────────────────────────────────────
Test (commit öncesi)
────────────────────────────────────────────

- npm run build temiz
- TypeScript clean
- /uret preview'da:
  - 375px viewport: hiçbir bileşen taşmıyor, sticky bar düzgün
  - Klavye Tab/Arrow ile tüm interaktif öğeleri ulaş
  - Tooltip'ler hem mouse hem klavye focus'ta görünüyor
  - aria-disabled durumunda tooltip görünüyor (HTML disabled değil)
  - prefers-reduced-motion aç → fade animasyonlar duruyor

Commit özeti:
- fix(uret): U-18 mobile responsive sweep (X dosya)
- fix(uret): U-19 a11y audit (radio + tooltip + kontrast)
- perf(uret): U-20 lighthouse optimizasyonları

Veya tek commit: chore(uret): U-18~U-20 polish pass

BACKLOG-REDESIGN.md'de U-18, U-19, U-20 [x] işaretle. U-21 Aziz'e kalır.

Bittikten sonra commit listesi + değişen dosyalar + 
yapılan düzeltmeler özetini ver.
```

---

## 12 — Hesap Alanı + Diğer Sayfalar Refactor

**Spec:** `specs/hesap-alani-refactor-spec.md`
**Mockup'lar:** `specs/marka-profili-mockup.jsx`, `specs/hesabim-mockup.jsx`
**Durum:** Faz 2 (/uret + diğerleri) tamamlandıktan sonra başlayacak.

### Aziz Kararları (2026-04-27)

1. **Canlı önizleme:** Hazır şablon (template-based). AI çağrısı yok.
2. **Düşük kredi eşiği:** 5 kredi.
3. **Referans istatistikleri:** İlk davetten sonra göster.
4. **Fiyatlar SSS:** Kredi ve fiyat odaklı.
5. **Karşılaştırma tablosu:** Atlandı.
6. **Üretim sonuç sayfası:** `/uret` spec'inde ele alınacak.

### Genel İçerik Kuralı

Canlı sitedeki örnek çıktıları (text/görsel/video/sosyal) ve mevcut görsel öğeleri olduğu gibi koru.

### Mockup Uyarıları

- Mockup emoji'leri Lucide ile değiştirilecek
- Mockup paleti landing redesign token'larıyla uyumlu

### Grup 1 — Renk Paleti Uyumu (önce)

| ID | Başlık | Durum | Bağımlılık | Kabul Kriteri |
|---|---|---|---|---|
| H-01 | Anasayfa paletini tüm sayfalara uygula | Bekliyor | Landing page done | `/hesap`, `/hesap/marka`, `/hesap/profil`, `/fiyatlar`, `/blog`, `/giris` rd-* token'larında. |

### Grup 2 — Marka Profili `/hesap/marka`

**Done:** 28 Nis (commits fb264a4 → 46b41bc, 4 commit). Aziz preview test bekliyor.

| ID | Başlık | Durum |
|---|---|---|
| MP-01 | Form scaffold + 8 alan + ProgressIndicator | ✅ |
| MP-02 | ChipSelector primitive (single+multi) | ✅ |
| MP-03 | BrandPreviewPanel canlı önizleme (sayfanın kalbi) | ✅ |
| MP-04 | Bilgi banner kompakt + collapsible | ✅ |
| MP-05 | StickySaveBar + dirty state + beforeunload | ✅ |
| MP-06 | Save (Supabase .update) + Toast | ✅ |
| MP-07 | Mobile (collapsibleOnMobile) + a11y | ✅ |

**Yeni reusable primitive'ler (gelecek paketlerde reuse):** components/primitives/{ChipSelector, Toast}.tsx
**Yeni komponentler:** components/marka/{BrandPreviewPanel, BrandedAIPreview, GenericAIPreview, StickySaveBar}.tsx + lib/markaPreviewTemplates.ts (3 ton × 2 içerik = 6 şablon)
**Save kararı:** /api/marka-profili endpoint yok → Supabase direkt `.update()` (mevcut pattern).
**Aziz preview kontrol:** Ton seçince sağ panel canlı update ediyor mu, 375px collapsible accordion düzgün mü, dirty save bar görünür mü.


### Grup 2B — Profil `/hesap/profil` (Aziz 28 Nis spec, EX.6~EX.11)

**Spec:** uploads/hesap-alti-sayfalar-ek-spec.md (Sayfa 2)
**Aziz tespiti:** "∞" kredi bug yanlış bilgi gösteriyor (KRİTİK), adres tek satır textarea (e-Fatura için yapılandırılmalı), tamamlanma yüzdesi yok, üst CTA tekrarı.

| ID | Başlık | Durum | Bağımlılık | Kabul Kriteri |
|---|---|---|---|---|
| PR-01 | Form scaffold + ProgressIndicator + rd-* swap | ✅ Tamam | MP done | Commit `65ed268` |
| PR-02 | ∞ kredi bug fix + KPI rozeti tıklanabilir | ✅ Tamam | PR-01 | Commit `65ed268` — isLoading "—", admin ∞ intentional, KPI → Link /kredi-yukle, CTA kaldırıldı |
| PR-03 | Adres yapılandırma (7 alan) | ✅ Tamam | PR-01 | Commit `65ed268` — mahalle/cadde/binaNo/daire/postaKodu/ilçe/il. JSON serialize adres kolonu. |
| PR-04 | İl/İlçe veritabanı + Save flow | ✅ Tamam | PR-03 | Commit `bca1ce7` — statik lib/data/turkiye-il-ilce.ts (NPM yok). StickySaveBar + Toast reuse. |
| PR-05 | Mobile + a11y polish | ✅ Tamam | PR-04 | Commit `65ed268` — native select, aria-invalid, aria-label, htmlFor/id, Tab tour. |

**Aziz açık karar (sonra cevaplanır, Cowork önerisi):**
- TC kimlik no + Vergi no + Şirket adı alanları? Paraşüt geldiğinde e-Fatura için gerekli. **Önerim: bu pakete dahil etme**, Faturalar paketinde gündeme getir (Faturalar UI Aziz'e e-Fatura adres düzeltme linki gerektiriyor — orada tetiklenir).


### Grup 2C — Faturalar `/hesap/faturalar` (Aziz 28 Nis spec, EX.21~EX.27)

**Spec:** uploads/hesap-alti-sayfalar-ek-spec.md (Sayfa 5)
**Mockup:** uploads/faturalar-mockup.jsx
**Aziz kararı:** "Paraşüt henüz yok, sonra bırakalım ama sayfa hazır olsa iyi olur" (28 Nis). UI mock data ile çalışır, Paraşüt entegrasyonu geldiğinde gerçek data otomatik akar.
**Mevcut sorun:** Tüm faturalar "Fatura oluşturuluyor" durumda, PDF indirme yok, durum sistemi yok, filtre yok.

| ID | Başlık | Durum | Bağımlılık | Kabul Kriteri |
|---|---|---|---|---|
| FT-01 | Sayfa scaffold + bilgi banner + yıllık toplam + filtre | ✅ Tamam | PR done | faa14be + e4fb33b + 4ec6bfe |
| FT-02 | StatusBadge primitive (4 durum) | ✅ Tamam | FT-01 | faa14be — components/primitives/StatusBadge.tsx |
| FT-03 | Liste + İndir + Gönder + boş state | ✅ Tamam | FT-02 | 4ec6bfe — FATURALAR_DEMO mock data, 5 entry |
| FT-04 | Hatalı fatura "profili düzenle" link | ✅ Tamam | FT-03 | 4ec6bfe — bg-rd-danger-50 footer + /hesap/profil link |
| FT-05 | Mobile + a11y polish | ✅ Tamam | FT-04 | 4ec6bfe — role=list/listitem, aria-label filter, dikey mobile |

**Mock data kararı (FT-01'de Code karar verir):**
- Mevcut faturalar tablosu Supabase'de: status field var mı kontrol et
- Yoksa: tüm faturalar status='preparing' kabul (default), schema değişikliği bu paketin DIŞINDA
- VE Aziz sayfa demo'sunda 4 durumu birden görmek isteyebilir → opsiyonel "demo mode" prop ile mock veriler gösterilebilir, Aziz preview'da görür, prod'da gerçek data akar
- Code önerebilir: feature flag (FF.FATURALAR_DEMO) ile statik 5 örnek (mockup'taki gibi) göster, prod'da kapat

**Açık ticket'lar (FT bittikten sonra Faz 7+ Paraşüt paketinde):**
- Paraşüt API entegrasyonu (status field'ı backend güncelleme)
- PDF blob URL generation (Paraşüt e-Arşiv)
- "E-postama gönder" backend endpoint
- profiles tablosuna TC kimlik + Vergi no + Şirket adı kolonu (PR'da ertelenmişti)


### Grup 3 — Hesabım `/hesap` (HS-01~HS-04, eski H-15~21 birleştirildi)

**Mevcut sayfa:** app/(auth)/hesap/page.tsx (kullanıcı login sonrası ilk burayı görür — retention için kritik)

| ID | Başlık | Durum | Bağımlılık | Kabul Kriteri |
|---|---|---|---|---|
| HS-01 | Scaffold + Manrope + tasarruf rozeti + 3 KPI grid | ✅ Tamam | FT done | fa48477 — eyebrow+H1, warm-earth rozet, 3 KPI |
| HS-02 | 6 menü kartı + uyarı durumları | ✅ Tamam | HS-01 | fa48477 — marka eksik→warm, kredi düşük→danger, StatusBadge reuse |
| HS-03 | Denenmemiş özellikler keşif + davet kutusu | ✅ Tamam | HS-01 | 7a0f839+fa48477 — InviteBox + content_type keşif; HS-03b: davet backend mevcut (/api/referral/stats) |
| HS-04 | Mobile + a11y polish | ✅ Tamam | HS-03 | fa48477 — grid-cols-1 mobile, aria-label KPI, aria-hidden ikonlar |

**Açık karar (Cowork önerisi):**
- Tasarruf hesabı pre-traffic'te 0 — placeholder göster ("yzliste ile birlikte tasarruf etmeye başla") VEYA gizle, gerçek metrik geldiğinde aç. **Önerim: placeholder göster** (boş kalmasın), value = `Math.max(0, krediKullanim * 5)` gibi yaklaşık hesap (1 kredi ≈ ₺5 işçi tasarrufu).
- "Henüz denemediklerin" — kullanıcının üretim geçmişine bağlı. generations tablosundan content_type'lar çekilir, eksik olanlar listelenir. Veri yoksa: tüm 4 içerik tipi gösterilir (yeni kullanıcı için onboarding).

### Grup 3B — Krediler `/hesap/krediler` (Aziz 28 Nis spec, EX.12~EX.14)

**Spec:** uploads/hesap-alti-sayfalar-ek-spec.md (Sayfa 3)
**Mevcut sorun:** "Bu ay tüketim" istatistiği yok, ödeme geçmişinde işlem türü etiketi yok (satın alım vs hediye vs iade belirsiz), satıra tıklayınca detay açılmıyor.

| ID | Başlık | Durum | Bağımlılık | Kabul Kriteri |
|---|---|---|---|---|
| KR-01 | Sayfa scaffold + 3 mini stat (mevcut + bu ay + geçen ay) | ✅ Tamam | HS done | 6e67de2+12f6852 — uretimler count ile bu/geçen ay |
| KR-02 | İşlem geçmişi + işlem türü etiketi | ✅ Tamam | KR-01 | 6e67de2 — TransactionBadge ayrı primitive; KR-02b: kredi_log tablosu yok, payments heuristic (tümü satin_alim), KREDILER_DEMO ile 4 tür görünür |
| KR-03 | Detay accordion + Mobile + a11y | ✅ Tamam | KR-02 | 12f6852 — aria-expanded/controls/region, ChevronDown rotate, mobile dikey |

**Mock data kararı:** Mevcut kredi log tablosunda işlem_turu (transaction_type) kolonu var mı kontrol et. Yoksa: tüm geçmiş "Satın alım" varsayılır + KR-02b ticket aç ("Backend: kredi_log işlem_turu kolonu"). Demo flag kullanılabilir (FT-01'deki gibi env-based) preview'da 4 türü görmek için.

**KR-02b (Backend ticket):** `kredi_log` tablosu yok — krediler `payments` tablosundan çekiliyor, tüm kayıtlar `satin_alim` varsayılan. Çözüm: `kredi_log` tablosu oluştur (id, user_id, islem_turu, miktar, created_at, detay JSONB). `KREDILER_DEMO=true` ile dev'de 4 tür görünür.

### Grup 3C — Üretimler `/hesap/uretimler` (Aziz 28 Nis spec, EX.15~EX.20)

**Spec:** uploads/hesap-alti-sayfalar-ek-spec.md (Sayfa 4)
**Aziz tespiti:** Sayfa "zaten çok iyi" — sadece kullanıcı 50+ üretim olunca lazım olacak özellikler eksik.

| ID | Başlık | Durum | Bağımlılık | Kabul Kriteri |
|---|---|---|---|---|
| UR-01 | Sayfa scaffold + filtre chip bar | ✅ Tamam | KR done | rd-* swap. Manrope eyebrow "ÜRETİMLER" + H1 "Tüm üretimlerin". 3 filtre satırı: Platform (Trendyol/Amazon TR/Amazon USA/Hepsiburada/N11/Etsy + Tümü), İçerik tipi (Metin/Görsel/Video/Sosyal + Tümü), Tarih (Bu ay/Geçen ay/Bu yıl/Tümü). ChipSelector primitive reuse (multi mode + "Tümü" seçenek). |
| UR-02 | Arama input + sıralama dropdown | ✅ Tamam | UR-01 | Arama input (Lucide Search): debounced 300ms live filter, "Ürün adı veya başlık ara". Sıralama dropdown (native select): Yeniden eskiye / Eskiden yeniye / Platform / Kredi. |
| UR-03 | Üretim kart + Kopyala + Yeniden üret + boş içerik placeholder | ✅ Tamam | UR-02 | Mevcut accordion yapısı korunur (Aziz: "çok iyi"). Her kart altına 3 buton: "Kopyala" (mevcut), "Yeniden üret" (Lucide RefreshCw — /uret'e query params ile yönlendirir, kullanıcı parametreleri görür sonra üretir, kredi otomatik düşmez), "Excel'e indir" (sadece toplu üretim için, opsiyonel). Boş içerik tipi (kullanıcı sadece metin üretmiş): "Bu üretimde görsel yok. Eklemek için yeniden üret" alt-not + CTA. |
| UR-03b | /uret pre-fill (query params okuma) | Bekliyor | UR-03 | app/uret/page.tsx URL searchParams oku: onceki/platform/tip varsa form'u pre-fill et. "Yeniden üret" butonu sadece yönlendiriyor; /uret tarafı bu params'ı henüz okumuyor. |
| UR-04 | Pagination veya lazy load | ✅ Tamam | UR-03 | TanStack Query useInfiniteQuery (proje default). 20 üretim/sayfa. "Daha fazla yükle" buton (infinite scroll yerine — daha kontrollü, batch size belli). Pre-traffic 5-10 üretim için zaten görünmez. |
| UR-05 | Mobile + a11y polish | ✅ Tamam | UR-04 | 375px: filtre chip'leri yatay scroll (overflow-x-auto), sıralama dropdown ve arama input dikey. Kart kompakt (ChevronDown sağa hizalı). ARIA list semantics. |

**"Yeniden üret" karar (Cowork önerisi):** Frontend approach — `/uret?onceki=[id]&platform=X&tip=Y...` query params ile yönlendir. Kullanıcı parametreleri görür, onaylar, kredi düşer. Bu daha güvenli (kullanıcı kontrolü, kredi otomatik kaybolmaz). Backend yeni endpoint gerekmez.


### Grup 4 — Fiyatlar `/fiyatlar` + Anasayfa fiyatlar revize (FY-01~FY-05)

**Aziz kararı (28 Nis akşam):** Anasayfada fiyat bölümü TAMAMEN KALDIRILIYOR (A seçeneği). Header'da "Fiyatlar" linki zaten var, kullanıcı oraya gider. Anasayfa sade kalır.

| ID | Başlık | Durum | Bağımlılık | Kabul Kriteri |
|---|---|---|---|---|
| FY-01 | /fiyatlar scaffold + 3 paket kart + "En popüler" terim | ✅ Tamam | UR done | Commit `44e9b92` — rd-* swap, Manrope eyebrow, "En popüler" badge, PackageCard rd-* tokens. |
| FY-02 | Kredi calculator entegrasyonu | ✅ Tamam | FY-01 | Commit `44e9b92` — components/fiyatlar/KrediCalculator.tsx (slider + öneri kutusu). |
| FY-03 | SSS bölümü (kredi/fiyat 7 soru) | ✅ Tamam | FY-01 | Commit `44e9b92` — components/fiyatlar/FiyatlarSSS.tsx accordion, mevcut SSS metinleri korundu. |
| FY-04 | Anasayfa fiyat bölümü KALDIR | ✅ Tamam | FY-03 | Commit `5857aef` — FiyatlarSection kaldırıldı. Yeni sıra: Hero → 3 Adım → Marka → Neden → SSS → Final CTA. |
| FY-05 | Mobile + a11y polish | ✅ Tamam | FY-04 | Commit `44e9b92` — 375px 1-col grid, aria-live, aria-expanded, role="list", role="listitem" tüm accordion'da. |


### Grup 5 — Blog `/blog`

| ID | Başlık | Durum | Bağımlılık | Kabul Kriteri |
|---|---|---|---|---|
| H-27 | Kategori filtre state'leri | Bekliyor | H-01 | Aktif primary, pasif neutral. |
| H-28 | Kart hover state | Bekliyor | H-01 | Lift + shadow. |
| H-29 | Arama input focus | Bekliyor | H-01 | Primary ring. |

### Grup 6 — Giriş `/giris`

| ID | Başlık | Durum | Bağımlılık | Kabul Kriteri |
|---|---|---|---|---|
| H-30 | Form input focus ring | Bekliyor | H-01 | Primary ring. (AU-01'e absorb edilecek) |
| H-31 | Tab aktif/pasif border | Bekliyor | H-01 | Primary 2px aktif. (AU-01'e absorb) |

### Grup 7 — Polish & QA

| ID | Başlık | Durum | Bağımlılık | Kabul Kriteri |
|---|---|---|---|---|
| H-32 | Cross-page navigation | Bekliyor | H-01~H-31 | Tüm geçişler sorunsuz. |
| H-33 | Lighthouse pass | Bekliyor | H-32 | Performance >90, a11y >90. |
| H-34 | A11y audit | Bekliyor | H-33 | WCAG AA. |
| H-35 | Aziz kabul | Bekliyor | H-34 | 5 sayfa test. |

**Bağımlılıklar:** H-01 hepsinden önce. Grup 2-6 paralel. Grup 7 en son.

---

## 13 — Üretim ve Premium Sayfaları (Faz 2 devamı)

**Branch:** `claude/redesign-modern-ui`
**Yaklaşım:** Landing pattern (rd-* token, Manrope+Inter, eyebrow + H2, Lucide ikonlar, fade animasyonlar). Detaylı prompt sayfa sırası gelince eklenecek.
**Bağımlılık:** /uret refactor (Bölüm 11) bittikten sonra.

### Grup 2 — /yzstudio premium araçlar sayfası

| ID | Başlık | Durum | Bağımlılık | Kabul Kriteri |
|---|---|---|---|---|
**ESKİ PLAN İPTAL (27 Nis akşam):** Aziz "studio sayfası taslak, ciddi UX/tasarım sorunu var, baştan ele al" dedi. Mevcut yapı incelendi (StudioHeader, StudioSekmeler 3-tab 2-disabled, TryonSekmesi 2-kolon, GarmentUpload, ModelPicker 3-alt-tab, TryonAyarlar, TryonSonuc + Video toggle). 12 ana sorun tespit edildi: yarım hizmet hissi (2 disabled tab), karar yorgunluğu (15+ ön plan seçim), step/progress yok, AI manken yan ürün gibi gizli, Video Try-On gizli toggle, premium kimlik tutarsız, çok dolu mavi buton yarışıyor, sticky CTA yok, beta uyarısı altta küçük, empty state zayıf, hex hardcoded, Manrope yok.

**Aziz kararları (27 Nis akşam — Cowork önerisini kabul etti):**
1. Disabled tab'ları KALDIR — tek araca odaklan ("Mankene giydirme" sayfanın kendisi). "Stüdyo çekimi" ve "Arka plan değiştirme" /yzstudio'dan tamamen çıkar; gelecekte gelirse ayrı sayfa veya footer roadmap olur.
2. Step-by-step DEĞİL, **görsel hibrit** — tek sayfa form ama büyük adım numarası ("1", "2", "3") + dikey bağlantı çizgisi ile akış netliği.
3. Video Try-On gizli toggle DEĞİL, **görünür kart** — sonuç ekranında "Şimdi videoyu da üret · 13-23 kredi" + örnek video preview thumbnail.

**Vizyon:** yzstudio = tek araca odaklı, rehberli, premium ürün. Workflow: kıyafet yükle → manken seç → giydir → (görünür CTA) videoya çevir. Premium kimlik tüm sayfada tutarlı warm-earth aksanı + Manrope display + Lucide ikon + rd-* primary CTA.

| ID | Başlık | Durum | Bağımlılık | Kabul Kriteri |
|---|---|---|---|---|
| YS-01 | StudioHeader redesign + premium kimlik | ✅ Tamam | Landing done | rd-* token swap. Manrope text-2xl md:text-3xl "yzstudio". Eyebrow `warm-earth-300` "PREMIUM ARAÇ" üstte. Beta rozet kalır. Kredi + "Kredi yükle" CTA sticky kalır. |
| YS-02 | StudioSekmeler tab UI'sı kaldırılır | ✅ Tamam | YS-01 | StudioSekmeler.tsx silinir veya minimal hale gelir. /yzstudio sayfası direkt TryonSekmesi içeriğini render eder. Sayfa state'inden `aktifSekme` kaldırılır. |
| YS-03 | Step numbered layout (1-2-3 görsel akış) | ✅ Tamam | YS-02 | Sol kolonda 3 büyük adım kartı. Her kart sol başında büyük dairesel numara (1, 2, 3 — warm-earth-700 bg + white text 28px). Adımlar arasında dikey bağlantı çizgisi (border-l rd-neutral-200). Adımların başlığı font-display text-lg md:text-xl. |
| YS-04 | Beta uyarısı üst banner'a taşı | ✅ Tamam | YS-01 | Mevcut alt banner kaldırılır, üst kısma (StudioHeader altına) tek satır banner: warm-earth-50 bg + warm-earth-700 text + Lucide Info ikon + "yzstudio beta — sonuçlar değişkenlik gösterebilir, yeniden üretebilirsin". Kullanıcı kredi harcamadan önce görür. |
| YS-05 | GarmentUpload (Adım 1) refactor | ✅ Tamam | YS-03 | rd-* token swap. "Kıyafet fotoğrafı" → font-display text-lg "1 · Kıyafet fotoğrafı". Drop zone büyütülür (min-h-[260px] mobil, daha çağrılı görünüm). Foto tipi + Kategori chip'leri "DOLU MAVI"DEN ghost outline'a (sadece seçili = bg-rd-primary-700, diğer = border + text). Lucide ikon yerleri korunur. |
| YS-06 | ModelPicker (Adım 2) refactor | ✅ Tamam | YS-03 | rd-* token swap. Başlık font-display text-lg "2 · Manken seç". 3 alt-tab (Hazır/Oluştur/Yükle) korunur AMA `bg-rd-neutral-100` segmented control'e dönüşür. "Oluştur" tab'ı içinde AI manken formu sadeleşir — etiketler text-sm font-medium (text-xs değil), inputlar büyür. Stok manken grid (kalır) + üretilen manken küçük preview kalır. |
| YS-07 | TryonAyarlar → Sticky bottom bar | ✅ Tamam | YS-03 | TryonAyarlar inline form yerine /uret StickySubmitBar pattern'i reuse: sayfa altında sticky bar, sol kısımda kalite modu chip'leri + varyasyon stepper + maliyet özeti, sağ kısımda büyük "Mankene giydir" CTA (bg-rd-primary-700). Yetersiz kredi durumu Tooltip primitive ile (mevcut /uret altyapısı). Onay modalı (`onayAktif` flow) korunur. |
| YS-08 | TryonSonuc redesign + Video kart | ✅ Tamam | YS-07 | rd-* token swap. Üst başlık font-display "Giydirme sonucu". Sonuç görselleri korunur (grid). Sonuç altına BÜYÜK görünür video kart: warm-earth-50 bg + warm-earth-200 border, "Şimdi videoyu da üret" + Lucide PlayCircle (warm-earth-700) + alt text "5sn · 13 kredi  •  10sn · 23 kredi" + "Video üret" CTA. ChevronDown toggle KALDIRILIR. Tıklayınca TryonVideoAyarlar açılır (mevcut). Video sonucu yine TryonVideoSonuc'da. |
| YS-09 | Empty state premium showcase | ✅ Tamam | YS-03 | TryonSonuc render edilmiyorken sağ kolon (mevcut OrnekCiktilar) yeniden tasarlanır. "Nasıl çalışıyor?" başlığı altında 3 mini kart (kıyafet → manken → sonuç ikonları) + 1 küçük "AI ile saniyeler içinde" mikrocopy + 2 örnek before/after kartı. Placeholder gri kareler kalkar — gerçek FASHN örneği varsa public/'te kullanılır, yoksa kalitatif placeholder (rd-neutral-100 bg + Lucide ImageIcon). |
| YS-10 | Mobile + a11y + acceptance | ✅ Tamam | YS-09 | 375px sweep: numbered step kartları tek kolon, her adım tam genişlik, sticky bar dikey. ARIA: step kartları `<section aria-labelledby>`, video kart aria-describedby. Klavye Tab: foto upload → foto tipi → kategori → manken alt-tab → manken seçim → kalite mod → varyasyon → üret. Kontrast (warm-earth-700 on warm-earth-50 doğrula). |
| YS-11 | "Yakında" araçlar için yol haritası | Bekliyor | YS-02 | Footer veya `/yzstudio/yol-haritasi` ayrı sayfada "Stüdyo çekimi (Q3 2026)" + "Arka plan değiştirme (Q4 2026)" mini liste. /yzstudio sayfasının kendisi temiz kalır, roadmap ayrı yerde. **OPSİYONEL** — Aziz "şimdi gerek yok, sonra" derse [İptal] olarak kapatılır. |

**Karar verilecek (YS prompt yazılırken):**
- YS-11 dahil mi, dışarıda mı? (Aziz redesign sonrası değerlendirir)
- "Adım 3" sticky bar mı yoksa adım 3 kartı + üret butonu kart içi mi? Vizyonda sticky bar — kullanıcı scroll ederken CTA görünür. Ama numbered step görsel akışı bozar mı? Code'a "her ikisini de değerlendir, sticky bar default" yazılır.
- AI manken oluşturma (ModelPicker "Oluştur" alt-tab) ileride kendi sayfasına çıkacak mı? Şu an alt-tab kalır, Faz 3 sonrası karar.

#### YS-01~YS-10 Birleşik Prompt (yzstudio sıfırdan rehberli premium pasaj)

```
ÖNEMLİ — KURAL OVERRIDE:
Bu görev `claude/redesign-modern-ui` branch'inde. CLAUDE.md "yzliste — 
UI değişiklikleri için kalıcı kurallar" bölümü bu branch'te GEÇERSİZ. 
Bunun yerine BACKLOG-REDESIGN.md başındaki redesign branch UI 
kuralları geçerli (font 400-800 serbest, gölge serbest, rounded-2xl 
serbest, Manrope+Inter, rd-* token'lar, sadece emoji yasak — Lucide 
ikon kullan).

Branch: claude/redesign-modern-ui
Görev: YS-01~YS-10 — /yzstudio sayfasını "tek araca odaklı, rehberli, 
premium" hale getir. Mevcut yapı taslak, ciddi UX/tasarım sorunu var, 
baştan ele alınıyor. YS-11 (yol haritası sayfası) bu prompt'a DAHİL 
DEĞİL, opsiyonel, ayrı yapılır.

Mevcut yapı:
- app/yzstudio/page.tsx (StudioHeader + StudioSekmeler + TryonSekmesi 
  + alt beta uyarı bandı)
- app/yzstudio/components/StudioHeader.tsx
- app/yzstudio/components/StudioSekmeler.tsx (3 tab: 1 aktif + 2 disabled)
- app/yzstudio/components/tryon/TryonSekmesi.tsx (2 kolon grid)
- app/yzstudio/components/tryon/GarmentUpload.tsx
- app/yzstudio/components/tryon/ModelPicker.tsx (3 alt-tab: Hazır / 
  Oluştur (5 kr) / Yükle)
- app/yzstudio/components/tryon/TryonAyarlar.tsx (kalite mod + 
  varyasyon + onay flow + Üret)
- app/yzstudio/components/tryon/TryonSonuc.tsx (sonuç görseller + 
  "Bu görseli videoya dönüştür" gizli toggle)
- app/yzstudio/components/tryon/TryonVideoAyarlar.tsx
- app/yzstudio/components/tryon/TryonVideoSonuc.tsx

İşlevsellik KORUNUR:
- Tüm API call'ları (FASHN tryon, AI manken /api/studio/manken, Kling 
  video) aynı kalır
- useTryonUretim hook, useCredits, useCurrentUser, useFeatureFlag 
  (FF.YZSTUDIO) aynı kalır
- Stok mankenler, manken üretim parametreleri, kredi mantığı aynı kalır
- yzstudio kapalı state'i (yzstudioEnabled === false) korunur

Kapsam DIŞI:
- YS-11 yol haritası ayrı sayfa (Aziz redesign sonrası karar verecek)
- AI manken oluşturmayı kendi sayfasına çıkarma (Faz 3 sonrası)
- Backend / API değişiklikleri (sadece UI/UX)

────────────────────────────────────────────
BÖLÜM 1 — YS-01: StudioHeader redesign + premium kimlik
────────────────────────────────────────────

Mevcut StudioHeader: kompakt, h1 "yzstudio" + Premium·Beta rozet + 
kredi + "Kredi yükle" CTA.

Değişiklikler:

1. Renk paleti rd-* token'a geçir (tüm hardcoded hex):
   - bg-[#FAFAF8] → bg-rd-neutral-50
   - bg-white → bg-white (kalır)
   - border-[#D8D6CE] → border-rd-neutral-200
   - text-[#1A1A17] → text-rd-neutral-900
   - text-[#908E86] → text-rd-neutral-500
   - text-[#5A5852] → text-rd-neutral-700
   - bg-[#FAF4ED] → bg-rd-warm-50 (premium accent — yeni token gerekli mi 
     kontrol et, yoksa hex bırak ve tailwind config'e ekle)
   - text-[#3D2710] → text-rd-warm-900
   - bg-[#1E4DD8] → bg-rd-primary-700
   - hover:bg-[#163B9E] → hover:bg-rd-primary-800

2. Premium pozisyonlama:
   - Header'ın TAM ÜSTÜNDE küçük eyebrow strip (yeni element):
     - text-[10px] uppercase tracking-[0.15em] text-rd-warm-700 
       font-medium
     - "PREMIUM ARAÇ" (sağa veya ortaya hizalı)
     - Üstüne ufak `<Sparkles size-3 strokeWidth=1.5>` ikon
   - H1 "yzstudio" font-display (Manrope) text-2xl md:text-3xl 
     font-medium tracking-[-0.01em]
   - "Premium · Beta" rozet warm-earth tonunda kalır (zaten doğru)

3. StudioHeader'ı yeni dosya olarak çıkar (mevcut JSX page.tsx içine 
   gömülü) — components/yzstudio/StudioHeader.tsx (varsa kullan, yoksa 
   page.tsx'ten ayır).

────────────────────────────────────────────
BÖLÜM 2 — YS-02: Tab UI'sını kaldır
────────────────────────────────────────────

1. app/yzstudio/components/StudioSekmeler.tsx tamamen sil VEYA içini 
   boş export yap (silmek tercih edilir).

2. app/yzstudio/page.tsx:
   - `useState("tryon")` ve `aktifSekme` state'ini kaldır
   - `<StudioSekmeler aktif={aktifSekme} onChange={setAktifSekme} />` 
     satırını kaldır
   - `{aktifSekme === "tryon" && <TryonSekmesi />}` → `<TryonSekmesi />` 
     direkt
   - Import temizle

3. Bu adım sonrası sayfa yapısı: StudioHeader → BetaBanner → TryonSekmesi 
   → SiteFooter.

────────────────────────────────────────────
BÖLÜM 3 — YS-04: Beta uyarısını üst banner'a taşı (önce, akışta yerini 
                 bulsun)
────────────────────────────────────────────

1. Mevcut alt banner (page.tsx ~satır 75): `<div className="bg-[#FAF4ED] 
   border border-[#EED8BD]...>yzstudio beta sürümünde</div>` — kaldır.

2. StudioHeader'ın HEMEN ALTINA yeni component: 
   components/yzstudio/BetaBanner.tsx (yeni)
   - Tek satır banner: bg-rd-warm-50 border-b border-rd-warm-200 
     px-4 py-2.5
   - Flex items-center justify-center gap-2 max-w-5xl mx-auto
   - Lucide Info size-4 strokeWidth=1.5 text-rd-warm-700
   - Text: text-xs md:text-sm text-rd-warm-800 — "yzstudio beta — 
     sonuçlar değişkenlik gösterebilir, beğenmediğin sonucu yeniden 
     üretebilirsin"
   - aria-live yok (statik bilgi), role="status" opsiyonel

────────────────────────────────────────────
BÖLÜM 4 — YS-03: Step numbered layout
────────────────────────────────────────────

TryonSekmesi'ni yeniden yapılandır. Sol kolon = 3 ADIM kartı dikey 
istif. Her adım kartı:

```jsx
<section aria-labelledby="adim-1-baslik" 
  className="relative pl-16 md:pl-20 pb-8 last:pb-0 
             border-l-2 border-rd-neutral-200 last:border-transparent 
             ml-6">
  {/* Sol başında dairesel numara */}
  <div className="absolute -left-6 top-0 size-12 rounded-full 
                  bg-rd-warm-700 text-white font-display 
                  text-xl font-medium flex items-center 
                  justify-center">
    1
  </div>
  
  <div className="space-y-4">
    <h2 id="adim-1-baslik" 
        className="font-display text-lg md:text-xl 
                   text-rd-neutral-900 font-medium">
      1 · Kıyafet fotoğrafı
    </h2>
    
    {/* Adım içeriği */}
    <GarmentUpload ... />
  </div>
</section>
```

3 adım:
- 1 · Kıyafet fotoğrafı → GarmentUpload bileşeni
- 2 · Manken seç → ModelPicker bileşeni
- 3 · Üret → TryonAyarlar (sticky barda — aşağıda YS-07)

ÖNEMLİ: 3. adım kartının İÇİ mini bilgi metni ("3 mod, varyasyon sayısı 
sticky barda — aşağıda hazır olunca üret") olabilir. ASIL submit 
sticky bottom barda. Adım 3 kartı bu yönlendirici bilgi + maliyet özeti 
göstersin (toplam X kredi). Veya adım 3 kartı tamamen kalksın, sticky 
bar tek başına yeterli — tercihini commit notunda söyle.

Bağlantı çizgisi: her adımın sol border'ı bir sonrakine bağlı (border-l-2 
border-rd-neutral-200). Son adımda border yok (last:border-transparent).

Mobile (375px): 
- Numbered circle size-10 (büyük olma 12), text-base
- pl-12 (mobil daha az ofset)
- ml-5 (numara konumu ayarla)

────────────────────────────────────────────
BÖLÜM 5 — YS-05: GarmentUpload (Adım 1) refactor
────────────────────────────────────────────

1. Renk paleti rd-* swap (tüm hex'leri sözleşmeli token'lara).

2. Drop zone büyütülür:
   - Mevcut min-height: 160 → 260 (daha çağrılı)
   - paddingBottom: 133% kalır (foto var durumu)
   - Empty state'te orta text-base "Fotoğraf yükle veya sürükle bırak" 
     kalır
   - Empty state ikon: ImageUp size-8 (24'ten büyüt)

3. Foto tipi + Kategori chip'leri "DOLU MAVI"DEN ghost outline'a:
   - Seçili: `border-2 border-rd-primary-700 bg-rd-primary-50 
     text-rd-primary-700` (dolu beyaz değil — açık-fon vurgu)
   - Seçili değil: `border border-rd-neutral-300 text-rd-neutral-700 
     hover:border-rd-primary-400 hover:bg-rd-neutral-50`
   - Daha az "yarışan" mavi blok, hierarchy temizlenir

4. Bölüm başlığı KALDIRILIR (mevcut "Kıyafet fotoğrafı" h3) — adım 
   kartı zaten "1 · Kıyafet fotoğrafı" diyor. Çift başlık olmasın.

5. Foto tipi + Kategori altbölüm başlıkları kalır ama text-xs uppercase 
   tracking-wide text-rd-neutral-500 olarak (eyebrow stili).

────────────────────────────────────────────
BÖLÜM 6 — YS-06: ModelPicker (Adım 2) refactor
────────────────────────────────────────────

1. Renk paleti rd-* swap.

2. Bölüm başlığı KALDIRILIR (adım kartı zaten "2 · Manken seç" diyor).

3. 3 alt-tab segmented control:
   - Mevcut yapı korunur (bg-rd-neutral-100 border'lı container)
   - Aktif tab: bg-white shadow-sm (redesign'da serbest) 
     text-rd-neutral-900
   - Pasif tab: text-rd-neutral-600 hover:text-rd-neutral-900
   - Tab label'ları: "Hazır mankenler" / "Oluştur (5 kr)" / "Fotoğraf 
     yükle". Mobile kısa: "Hazır" / "Oluştur 5kr" / "Fotoğraf"

4. "Oluştur" alt-tab içindeki AI manken formu sadeleşir:
   - Etiketler text-sm font-medium text-rd-neutral-700 (text-xs 
     text-[#908E86] DEĞİL — okunabilirlik düşük)
   - Input padding büyür: px-3 py-2 → px-4 py-2.5
   - Chip butonları aynı outline pattern (Bölüm 5'teki gibi)
   - Manken oluştur CTA: bg-rd-primary-700 hover:bg-rd-primary-800, 
     yetersiz kredi durumunda Tooltip primitive (mevcut /uret 
     altyapısı) kullan

5. "Hazır mankenler" grid: kart hover lift (-translate-y-0.5 
   transition), seçili kart border-2 border-rd-primary-700.

6. "Fotoğraf yükle" alt-tab: drop zone min-h 200, ikon büyür.

────────────────────────────────────────────
BÖLÜM 7 — YS-07: TryonAyarlar → Sticky bottom bar
────────────────────────────────────────────

Mevcut TryonAyarlar inline form. Yeni: /uret StickySubmitBar pattern'i 
reuse — sayfa altında sticky.

1. components/yzstudio/StudioStickyBar.tsx (yeni — /uret StickySubmitBar 
   primitive'i göz at, benzer yapı kur):
   - position fixed bottom-0 left-0 right-0 (mobil) / sticky bottom-5 
     (desktop)
   - bg-white border-t border-rd-neutral-200
   - max-w-5xl mx-auto px-4 py-3
   - Flex layout:
     - Sol: kalite mod chip'leri (3 mod — ghost outline pattern, 
       seçili = bg-rd-primary-50 border-rd-primary-700) + varyasyon 
       stepper (Minus/Plus + sayı, kompakt)
     - Sağ: maliyet özeti ("X varyasyon · Y kredi") + "Mankene giydir" 
       CTA (bg-rd-primary-700)
   - Yetersiz kredi durumu Tooltip ("Yetersiz kredi · Paket al" → 
     /kredi-yukle) — /uret'teki getCTAState pattern'i benzeri

2. Onay modalı (mevcut `onayAktif` flow) korunur — sticky bar'da CTA 
   tıklayınca modal/inline onay açılır, aynı UX.

3. TryonAyarlar.tsx içeriği ya StudioStickyBar'a taşınır ya da 
   TryonAyarlar yeniden kullanılır (kolay yol: TryonAyarlar'ı sticky 
   container içine sar).

4. Sayfa içeriğinin altına pb-32 (mobil) / pb-24 (desktop) ekle ki 
   sticky bar form'u örtmesin.

────────────────────────────────────────────
BÖLÜM 8 — YS-08: TryonSonuc redesign + Video kart
────────────────────────────────────────────

1. Renk paleti rd-* swap.

2. Sonuç başlığı: font-display text-lg md:text-xl text-rd-neutral-900 
   "Giydirme sonucu" + sağında "Tekrar üret" link (mevcut RefreshCw + 
   text-rd-neutral-500 hover).

3. Sonuç görseller grid: korunur (1 veya 2 kolon).

4. **Video kart redesign — ÖNEMLİ:**
   Mevcut: `<button>Bu görseli videoya dönüştür <ChevronDown></button>` — 
   gizli toggle. KALDIR.
   
   Yeni: BÜYÜK görünür kart (sonuç görsellerin ALTINDA, otomatik açık):
   ```jsx
   <div className="rounded-xl border-2 border-rd-warm-200 
                   bg-rd-warm-50 p-5 md:p-6">
     <div className="flex items-start gap-4">
       <div className="size-12 rounded-lg bg-white 
                       border border-rd-warm-200 
                       flex items-center justify-center flex-shrink-0">
         <PlayCircle size-7 strokeWidth={1.5} 
                     className="text-rd-warm-700" />
       </div>
       <div className="flex-1">
         <p className="text-[10px] uppercase tracking-[0.15em] 
                       text-rd-warm-700 font-medium mb-1">
           PREMIUM
         </p>
         <h3 className="font-display text-base md:text-lg 
                        text-rd-neutral-900 font-medium mb-1">
           Şimdi videoyu da üret
         </h3>
         <p className="text-sm text-rd-neutral-600 mb-3">
           Görseli kısa videoya dönüştür — sosyal medyaya direkt yükle
         </p>
         <div className="flex items-center gap-3 text-xs 
                         text-rd-neutral-500 mb-4">
           <span>5sn · 13 kredi</span>
           <span className="text-rd-neutral-300">·</span>
           <span>10sn · 23 kredi</span>
         </div>
         <button onClick={() => onVideoAktifToggle(true)} 
                 className="bg-rd-primary-700 hover:bg-rd-primary-800 
                            text-white text-sm font-medium 
                            px-4 py-2 rounded-lg">
           Video üret
         </button>
       </div>
     </div>
   </div>
   ```

5. Tıklayınca videoAktif=true → TryonVideoAyarlar açılır (mevcut, 
   sadeleştirme isteniyorsa minimum rd-* swap). Video kart kendisi 
   gizlenir, yerine TryonVideoAyarlar render olur.

6. videoSonuc varsa TryonVideoSonuc altta render olur (mevcut).

────────────────────────────────────────────
BÖLÜM 9 — YS-09: Empty state premium showcase
────────────────────────────────────────────

Mevcut OrnekCiktilar (TryonSekmesi içinde) — 2 boş gri kare + etiket. 
Refactor:

1. Sağ kolon empty state (`sonuclar.length === 0 && !yukleniyor`):
   - Üstte küçük eyebrow: "NASIL ÇALIŞIYOR" text-[10px] uppercase 
     tracking-[0.15em] text-rd-warm-700
   - H3 font-display: "AI saniyeler içinde giydirir"
   - 3 mini step görsel (yatay flex):
     - Lucide Shirt + "Kıyafet" + arrow Lucide ChevronRight
     - Lucide UserSquare + "Manken" + arrow
     - Lucide Sparkles + "Sonuç"
   - Altında 2 örnek before/after kartı (gerçek FASHN örnek varsa 
     `public/yzstudio-orn ek-1.jpg` gibi, yoksa gri bg + Lucide 
     ImageIcon placeholder + "Örnek yakında")
   - Önce kontrol et: `public/yzstudio*` veya `public/ornek*` klasörü 
     var mı? Glob ile ara.

2. Yukarı kayan animasyon yok (statik), prefers-reduced-motion uyumlu.

────────────────────────────────────────────
BÖLÜM 10 — YS-10: Mobile + a11y + acceptance
────────────────────────────────────────────

1. **Mobile (375px):**
   - Step numbered kartlar: numara size-10 (12 yerine), pl-12, ml-5
   - GarmentUpload + ModelPicker + TryonSonuc tek kolon (zaten lg: 
     breakpoint'te grid)
   - Sticky bottom bar mobil dikey: kalite mod alt satıra düşer, 
     varyasyon + CTA aynı satırda
   - Video kart mobil: ikon üstte ortalanmış, başlık + içerik altında
   - 3 alt-tab segmented control mobile'da label kısaltılmış kalır

2. **A11y:**
   - Her adım `<section aria-labelledby="adim-N-baslik">`
   - Numbered daire `aria-hidden="true"` (sadece dekoratif)
   - Lucide ikonlar `aria-hidden="true"`
   - 3 alt-tab `role="tablist"` + tab'lar `role="tab" aria-selected`
   - Stok manken grid: kartlar `role="radio"`, `aria-checked`, parent 
     `role="radiogroup" aria-label="Hazır manken seç"`
   - Sticky bar Üret butonu: yetersiz kredi durumda aria-disabled + 
     Tooltip aria-describedby
   - Video kart `<article aria-labelledby>`

3. **Kontrast (WCAG AA):**
   - text-rd-warm-700 on bg-rd-warm-50 — hesapla, AA değilse rd-warm-800
   - text-rd-warm-800 on bg-rd-warm-50 — kontrol
   - Numbered daire white on rd-warm-700 — AA üstünde olmalı
   - Sticky bar text contrast tüm CTA durumları

4. **Edge case'ler:**
   - yzstudioEnabled === false → mevcut "yzstudio şu an erişime kapalı" 
     ekran rd-* token'a swap (page.tsx içinde mevcut)
   - kredi yok / 0 → sticky bar disabled, tooltip "Kredi yükle" 
     /kredi-yukle'ye yönlendir
   - Stok manken seçili değil + foto yok + giydir CTA: hangi adım 
     eksik diye kullanıcıya anlatan mikro mesaj sticky bar üstünde 
     görünsün ("Önce kıyafet fotoğrafı + manken seç")

────────────────────────────────────────────
Test (commit öncesi)
────────────────────────────────────────────

- npm run build temiz, TypeScript clean
- Localde /yzstudio:
  - Eyebrow "PREMIUM ARAÇ" + Manrope H1 görünür
  - Beta banner üstte (kredi harcamadan önce)
  - 3 numbered step kartı dikey istif, dairesel numara warm-earth
  - Foto upload büyük drop zone + outline chip'ler
  - Manken segmented control 3 alt-tab, "Oluştur" alt-tab'da AI form 
    sadeleşmiş
  - Sticky bottom bar: kalite mod + varyasyon + maliyet + Üret CTA
  - Sonuç gelince video kart BÜYÜK görünür, "Video üret" CTA tıklanır
  - Empty state "Nasıl çalışıyor" 3 ikon akışı + örnek kartlar
  - 375px mobile: tek kolon, sticky bar dikey, hiçbir taşma yok
  - Klavye Tab: foto upload → foto tipi → kategori → manken alt-tab → 
    manken seçim → sticky bar (mod/varyasyon/üret)
  - "yzstudio kapalı" durumda eyebrow/banner render olmuyor (kapalı 
    state korundu)

Commit özeti (bölünmüş öneri — büyük refactor, atomik commit kolaylığı):
- feat(yzstudio): YS-01 StudioHeader rd-* + Manrope + premium eyebrow
- feat(yzstudio): YS-02 tab UI kaldırıldı (StudioSekmeler silindi)
- feat(yzstudio): YS-04 BetaBanner üst banner'a taşındı
- feat(yzstudio): YS-03 step numbered layout (1-2-3 görsel akış)
- feat(yzstudio): YS-05 GarmentUpload outline chip + büyük drop zone
- feat(yzstudio): YS-06 ModelPicker segmented control + AI form sade
- feat(yzstudio): YS-07 StudioStickyBar (kalite+varyasyon+üret sticky)
- feat(yzstudio): YS-08 TryonSonuc redesign + video premium kart
- feat(yzstudio): YS-09 empty state showcase (nasıl çalışıyor + örnekler)
- chore(yzstudio): YS-10 mobile + a11y + acceptance polish

VEYA tek commit: feat(yzstudio): YS-01~YS-10 sıfırdan rehberli premium 
redesign

BACKLOG-REDESIGN.md'de YS-01~YS-10 [x] işaretle. YS-11 (yol haritası 
sayfası) BACKLOG'da kalır, Aziz redesign sonrası karar verir.

Bittikten sonra rapor:
- Commit listesi
- Değişen dosyalar (yeni: components/yzstudio/StudioHeader.tsx, 
  components/yzstudio/BetaBanner.tsx, components/yzstudio/StudioStickyBar.tsx, 
  silinen: app/yzstudio/components/StudioSekmeler.tsx)
- Adım 3 kartı kararı (kart kalktı mı, mini bilgi kartı oldu mu?)
- Empty state örnek görsel kararı (gerçek public/ varsa kullanıldı mı, 
  placeholder mı)
- rd-warm-* token Tailwind config'e eklendi mi (yoksa hex bırakıldı mı)
- Açık riskler / Faz 2 toplu acceptance'ta dikkat edilmesi gereken
- (Opsiyonel) Aziz preview'da test ederken nelere bakmalı kısa liste
```

### Grup 3 — Üretim sonuç sayfası `/(auth)/app/sonuc/[id]`

| ID | Başlık | Durum | Bağımlılık | Kabul Kriteri |
|---|---|---|---|---|
| SR-01 | Sayfa scaffold + token swap | ✅ Tamam | Landing done | Commit `f9af79b` — bg-rd-neutral-50, rd-* tüm renkler. |
| SR-02 | Sonuç başlığı + üretim metadata | ✅ Tamam | SR-01 | Commit `f9af79b` — CheckCircle2 eyebrow, Manrope H1, platform·tip·tarih subtitle. |
| SR-03 | İçerik tipine göre output renderer | ✅ Tamam | SR-02 | Commit `f9af79b` — A branch (text-only). generations tablosu sadece output/sonuc. Boş durum kutusu + CTA. |
| SR-04 | Kopyala/indir aksiyonları | ✅ Tamam | SR-03 | Commit `f9af79b` — CopyButton Lucide+aria-live, DownloadButton .txt blob. ZIP/PDF → SR-04b (bekliyor). |
| SR-05 | "Yeni üretim" + "Geçmiş" CTA | ✅ Tamam | SR-04 | Commit `f9af79b` — iki kart, /uret + /hesap/uretimler (mevcut). |
| SR-06 | Mobile + a11y + acceptance | ✅ Tamam | SR-05 | Commit `f9af79b` — flex-col mobile, aria-labelledby, sr-only H2, aria-hidden ikonlar. Aziz preview onayı bekliyor. |
| SR-04b | ZIP/PDF indir (multimedia üretimler için) | Bekliyor | SR-04 | Kapsam dışı bırakıldı, gelecek ticket. |

#### SR-01~SR-06 Birleşik Prompt (Üretim sonuç sayfası)

```
ÖNEMLİ — KURAL OVERRIDE:
Bu görev `claude/redesign-modern-ui` branch'inde. CLAUDE.md "yzliste — 
UI değişiklikleri için kalıcı kurallar" bölümü bu branch'te GEÇERSİZ. 
Bunun yerine BACKLOG-REDESIGN.md başındaki redesign branch UI 
kuralları geçerli (font 400-800 serbest, gölge serbest, rounded-2xl 
serbest, Manrope+Inter, rd-* token'lar, sadece emoji yasak — Lucide 
ikon kullan).

Branch: claude/redesign-modern-ui
Görev: SR-01~SR-06 — `/(auth)/app/sonuc/[id]` sayfası redesign

Mevcut durum: app/(auth)/app/sonuc/[id]/page.tsx — eski paletli 
(bg-indigo-*, gri-tonlu), tek text output gösteren basit sayfa 
(~80 satır). Faz 2'nin geri kalanı için redesign pattern'ine geçecek.

Kapsam DIŞI:
- /hesap/uretimler liste sayfası (Faz 3 — H-37'de)
- ZIP / PDF indir (gelecek ticket — bu sürümde sadece kopyala + .txt indir)
- Yeni ContentRenderer primitive yazımı (aşağıda koşullu)

────────────────────────────────────────────
BÖLÜM 1 — SR-01 + SR-02: Scaffold + sayfa başlığı + metadata
────────────────────────────────────────────

1. Sayfa düzeyinde rd-* paletine geçiş:
   - bg-gray-50 → bg-rd-neutral-50
   - text-gray-* → text-rd-neutral-*
   - bg-indigo-100/700 (eyebrow rozet) ve bg-indigo-500/600 (CTA) → 
     rd-primary-* veya rd-success-* (aşağıda nerede ne kullanılacak yazılı)
   - rounded-2xl + shadow-sm korunur (redesign'da serbest)
   - Manrope display başlık, Inter body — globals.css'te yüklü, sadece 
     font-display class'ı uygula

2. Yeni sayfa başlık bloğu (eski rozet+başlık yapısının üstünde):
   - Eyebrow: `text-xs uppercase tracking-wider text-rd-success-700 
     flex items-center gap-1.5` — Lucide CheckCircle2 (size-3.5) + 
     "ÜRETİM HAZIR"
   - H1 (font-display): text-3xl md:text-4xl text-rd-neutral-900 
     "İçerik üretildi"
   - Subtitle: text-rd-neutral-600 text-sm md:text-base — pazaryeri + 
     içerik tipi + tarih birleşik. Örn: "Trendyol · Listing metni · 
     27 Nisan 2026". Ayraç ortasında: <span className="text-rd-neutral-300 
     mx-2">·</span>
   - Geri linki: header'ın sol üstünde küçük `text-rd-neutral-500 
     hover:text-rd-neutral-700` Lucide ChevronLeft (size-4) + "Üretime dön". 
     Hedef href="/uret".

3. Metadata: title aynı, description'a "İçerik kopyalanabilir, indirilebilir, 
   yeniden üretilebilir." ek cümle.

────────────────────────────────────────────
BÖLÜM 2 — SR-03: İçerik tipine göre output renderer
────────────────────────────────────────────

ÖNCE: lib/database.types.ts (veya supabase migration'ları) generations 
tablosunda hangi alanlar olduğunu söyler. Olası alanlar:
- output / sonuc (text)
- image_url / images (görsel)
- video_url (video)
- social_pack (JSON — sosyal medya paketi)
- content_type ("metin" | "gorsel" | "video" | "sosyal")

Karar ağacı:

A) Eğer sadece text alanı varsa (output/sonuc): bu ticket'ta SADECE 
   text renderer yap. <pre> bloğunu rd-* palette ile sarmala:
   - Wrapper: bg-rd-neutral-100 border border-rd-neutral-200 rounded-xl 
     p-5 md:p-6
   - Text: text-rd-neutral-800 text-sm md:text-base leading-relaxed 
     whitespace-pre-wrap font-sans
   - Üst başlık (eyebrow): text-xs uppercase tracking-wider 
     text-rd-neutral-500 mb-3 — "ÜRETİLEN İÇERİK"

B) Eğer image_url/video_url/social_pack alanları VARSA: components/landing/ 
   altında PZ-07~10'dan kalan ContentRenderer benzeri bir primitive var mı 
   kontrol et (Grep "ContentRenderer" veya "ListingPreview"). 
   - Varsa import et ve content_type'a göre branşla
   - Yoksa: bu ticket'ta YENİ ContentRenderer YAZMA. SADECE text branch'ini 
     yap, BACKLOG-REDESIGN.md'de "SR-03b — multimedia renderer" yeni 
     ticket'ı oluştur ve [ ] olarak bırak. Diğer alanlar için fallback: 
     image_url varsa <Image> ile göster, video_url varsa <video controls>, 
     social_pack varsa <pre>JSON</pre> (geçici, etiketle "Ham veri").

ÖNEMLİ: Bu bölümde sürpriz bir "ContentRenderer primitive sıfırdan yaz" 
işine girme — sayfa renderı 30 dakikadan uzun sürerse opsiyon B-fallback'e 
geç ve ticket aç.

────────────────────────────────────────────
BÖLÜM 3 — SR-04: Kopyala + indir aksiyonları
────────────────────────────────────────────

1. CopyButton (components/ui/CopyButton.tsx) rd-* palette uyumlu mu 
   kontrol et. Değilse:
   - bg-rd-neutral-900 hover:bg-rd-neutral-800 text-white
   - Kopyalandı state: bg-rd-success-700 text-white + Lucide Check
   - Default: Lucide Copy (size-4) + "Kopyala"
   - Transition + 2sn sonra default'a dön (mevcut davranış)
   - aria-live="polite" status mesajı

2. Yeni İndir butonu (.txt only — bu sürümde):
   - Outline ghost: border border-rd-neutral-300 text-rd-neutral-700 
     hover:bg-rd-neutral-100
   - Lucide Download (size-4) + "İndir (.txt)"
   - 'use client' küçük component (DownloadButton.tsx — components/sonuc/ 
     altında). onClick:
     ```ts
     const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
     const url = URL.createObjectURL(blob)
     const a = document.createElement('a')
     a.href = url
     a.download = `yzliste-uretim-${id.slice(0, 8)}.txt`
     a.click()
     URL.revokeObjectURL(url)
     ```
   - Boş içerikse buton disabled + tooltip "İçerik bulunamadı"

3. Layout: aksiyon barı flex gap-3 mt-6
   - Mobile: flex-col, butonlar w-full
   - Desktop (sm:): flex-row sm:w-auto

ZIP/PDF: bu sürüme dahil değil — BACKLOG-REDESIGN.md'de "SR-04b — 
ZIP/PDF indir (multimedia üretimler için)" yeni ticket aç [ ].

────────────────────────────────────────────
BÖLÜM 4 — SR-05: "Sıradaki adım" CTA bloğu
────────────────────────────────────────────

Sayfa altı bölümü (border-t border-rd-neutral-200 pt-8 mt-12):

- Heading: text-rd-neutral-700 text-sm font-medium "Sıradaki adım"

- İki kart (grid grid-cols-1 md:grid-cols-2 gap-4):

  Sol kart — Yeni üretim (primary):
  - bg-rd-primary-50 border border-rd-primary-200 rounded-xl p-5
  - Lucide Sparkles (size-5 text-rd-primary-700)
  - H3 (font-display): text-rd-neutral-900 "Yeni üretim yap"
  - p: text-rd-neutral-600 text-sm "Aynı veya farklı pazaryeri için 
    tekrar üret"
  - CTA: Link href="/uret" — bg-rd-primary-700 hover:bg-rd-primary-800 
    text-white px-4 py-2 rounded-lg

  Sağ kart — Geçmiş (ghost):
  - bg-rd-neutral-50 border border-rd-neutral-200 rounded-xl p-5
  - Lucide History (size-5 text-rd-neutral-600)
  - H3: "Tüm üretimlerin"
  - p: text-rd-neutral-600 text-sm "Geçmiş üretimleri filtrele, 
    tekrar üret veya indir"
  - CTA: Link href="/hesap/uretimler" — border border-rd-neutral-300 
    hover:bg-rd-neutral-100 text-rd-neutral-700 px-4 py-2 rounded-lg

- Hover: kartlar -translate-y-0.5 transition

NOT: /hesap/uretimler şu an mock veya yok olabilir — ticket H-37'de 
yazılacak. Link verirken sayfanın varlığını teyit et:
- Eğer app/(auth)/hesap/uretimler/page.tsx varsa link ver
- Yoksa kart CTA'sını disabled yap + altına "Yakında" küçük etiket 
  (text-rd-neutral-400 text-xs)

────────────────────────────────────────────
BÖLÜM 5 — SR-06: Mobile + a11y + acceptance
────────────────────────────────────────────

1. Mobile (375px):
   - H1 text-3xl mobil okunaklı, taşma yok
   - Subtitle pazaryeri+tip+tarih satırı flex-wrap, text-sm
   - Text output box p-4 mobil
   - Buton grupu flex-col w-full mobil
   - "Sıradaki adım" iki kart üst üste tek kolon

2. A11y:
   - main aria-labelledby="sonuc-h1", h1'e id="sonuc-h1"
   - Eyebrow span aria-hidden="true"
   - Lucide ikonlar aria-hidden="true" (decorative)
   - CopyButton aria-label="İçeriği kopyala", İndir butonu aria-label=
     "İçeriği .txt olarak indir"
   - Kopyalandı feedback aria-live="polite"
   - H1 → H2 ("Üretilen içerik" — text output başlığı görünür mü 
     görünmez mi tartışmalı; sr-only H2 ekle minimum) → H3 (sıradaki 
     adım kartları)
   - Focus ring rd-primary-700/30 ile, klavye Tab sırası: Geri → 
     Kopyala → İndir → Yeni üretim → Geçmiş

3. Kontrast (WCAG AA — 4.5:1 normal, 3:1 büyük metin):
   - text-rd-success-700 on bg-rd-neutral-50 doğrula
   - text-rd-neutral-600 on bg-rd-neutral-50 doğrula
   - text-rd-primary-700 on bg-rd-primary-50 doğrula

4. Edge case'ler:
   - uretim.output ve uretim.sonuc ikisi de null → "İçerik bulunamadı" 
     boş durum kutusu + Yeni üretim CTA. <pre> render etme.
   - uretim.platform null → "—" yer tutucu
   - uretim.created_at parse hatası → fallback "Tarih bilinmiyor"

────────────────────────────────────────────
Test (commit öncesi)
────────────────────────────────────────────

- npm run build temiz
- TypeScript clean
- Localde /sonuc/[gerçek-id] preview'da:
  - rd-* renkleri uygulanmış (eski indigo yok)
  - Manrope display başlık + Inter body
  - Lucide ikonlar (CheckCircle2, Copy, Download, Sparkles, History, 
    ChevronLeft, Check)
  - Kopyala çalışıyor + "Kopyalandı" feedback 2sn
  - İndir .txt blob download (dosya adı yzliste-uretim-XXXXXXXX.txt)
  - Yeni üretim → /uret, Geçmiş → /hesap/uretimler (varsa)
  - 375px mobile sıkıntısız
  - Klavye Tab sırası doğru, focus visible

Commit özeti (tek commit OK):
- feat(sonuc): SR-01~SR-06 üretim sonuç sayfası redesign 
  (rd-* palette, Manrope, kopyala+indir, sıradaki adım CTA)

VEYA bölünmüş:
- feat(sonuc): SR-01~02 scaffold + sayfa başlığı (rd-* palette)
- feat(sonuc): SR-03 text-only renderer
- feat(sonuc): SR-04 kopyala + .txt indir
- feat(sonuc): SR-05 sıradaki adım CTA'ları
- chore(sonuc): SR-06 mobile + a11y polish

BACKLOG-REDESIGN.md'de SR-01~SR-06 [x] işaretle. Eğer Bölüm 2'de 
B-fallback aldıysan SR-03b ticket'ı [ ] olarak ekle. Eğer Bölüm 3'te 
ZIP/PDF kapsam dışı bıraktıysan SR-04b ticket'ı [ ] olarak ekle.

Bittikten sonra:
- Commit listesi
- Değişen dosyalar (yeni: components/sonuc/DownloadButton.tsx? 
  Değişen: app/(auth)/app/sonuc/[id]/page.tsx, components/ui/CopyButton.tsx?)
- ContentRenderer kararı (A: text-only mi, B: mevcut primitive mi, 
  B-fallback: yeni ticket mı?)
- Açık riskler / Aziz'in test etmesi gereken yerler
```

### Grup 4 — Ödeme sonuç sayfaları

| ID | Başlık | Durum | Bağımlılık | Kabul Kriteri |
|---|---|---|---|---|
| OD-01 | `/odeme/basarili` redesign | ✅ Tamam | Landing done | Commit `d0c97c4` — CheckCircle2, rd-* token swap, Manrope H1, kredi rozet (Coins), href /uret. |
| OD-02 | `/odeme/hata` redesign | ✅ Tamam | Landing done | Commit `d0c97c4` — XCircle danger, Manrope H1, hata kodu kutu (monospace), Mail CTA, Suspense+client, layout.tsx robots. |
| OD-03 | E-Arşiv + iyzico rozeti | ✅ Tamam | OD-01 | Commit `d0c97c4` — TrustStrip.tsx: iyzico_footer_logo.png + e-Arşiv FileText; her iki sayfada. |
| OD-04 | A11y + acceptance | ✅ Tamam | OD-03 | Commit `d0c97c4` — aria-hidden ikonlar, focus-visible ring, role="status" hata kutusu, klavye sırası doğru. Aziz preview onayı bekliyor. |
| OD-02b | `payment_failed` analytics event | Bekliyor | OD-02 | lib/analytics.ts'e paymentFailed method ekle, /odeme/hata'da fire et. |

#### OD-01~OD-04 Birleşik Prompt (Ödeme sonuç sayfaları)

```
ÖNEMLİ — KURAL OVERRIDE:
Bu görev `claude/redesign-modern-ui` branch'inde. CLAUDE.md "yzliste — 
UI değişiklikleri için kalıcı kurallar" bölümü bu branch'te GEÇERSİZ. 
Bunun yerine BACKLOG-REDESIGN.md başındaki redesign branch UI 
kuralları geçerli (font 400-800 serbest, gölge serbest, rounded-2xl 
serbest, Manrope+Inter, rd-* token'lar, sadece emoji yasak — Lucide 
ikon kullan).

Branch: claude/redesign-modern-ui
Görev: OD-01~OD-04 — `/odeme/basarili` ve `/odeme/hata` sayfaları redesign

Mevcut durum:
- app/odeme/basarili/page.tsx — zaten canlı paletteyle (#1E4DD8, 
  #FAFAF8, #D8D6CE, #0F5132); analytics.creditPurchaseCompleted ve 
  invalidateCredits davranışları KORUNACAK. rd-* token'a swap + 
  Manrope display + ufak detaylar.
- app/odeme/hata/page.tsx — tamamen eski (bg-gray-50, bg-red-100, 
  "✗" karakter, font-bold, rounded-3xl, bg-indigo-500, "→" ok). 
  Sıfırdan redesign gerekiyor, başarılı sayfasının simetriği olacak.

Kapsam DIŞI: Faz 2 toplu acceptance Aziz tarafından yapılacak — bu 
ticket'ta sadece kod, klavye+ekran okuyucu test'i kendin yap.

────────────────────────────────────────────
BÖLÜM 1 — OD-01: /odeme/basarili redesign
────────────────────────────────────────────

Mevcut sayfanın işlevselliğini KORU:
- 'use client' + Suspense
- searchParams'tan paket okuma
- analytics.creditPurchaseCompleted call
- useInvalidateCredits call
- Layout merkezi card + 2 CTA

Değişiklikler:

1. Renk paleti: hardcoded hex'leri rd-* token'a çevir
   - bg-[#FAFAF8] → bg-rd-neutral-50
   - bg-white → bg-white (kalır)
   - border-[#D8D6CE] → border-rd-neutral-200
   - bg-[#E8F5EE] (success bg) → bg-rd-success-50
   - text-[#0F5132] (success text) → text-rd-success-700
   - text-[#1A1A17] (heading) → text-rd-neutral-900
   - text-[#908E86] (muted) → text-rd-neutral-500
   - bg-[#1E4DD8] hover:bg-[#163B9E] → bg-rd-primary-700 hover:bg-rd-primary-800
   - text-[#5A5852] → text-rd-neutral-700

2. İkon: `Check` → `CheckCircle2` (Lucide). Boyut size-7 (~28px), 
   strokeWidth=2. Renk text-rd-success-700.

3. Tipografi:
   - H1: font-display (Manrope) text-2xl md:text-3xl font-medium 
     "Ödeme başarılı" (ünlem yok — sade, kurumsal)
   - p: text-rd-neutral-600 text-sm md:text-base leading-relaxed

4. Yeni: Kredi miktarı rozet (paket biliniyorsa)
   - p mesajının altında, CTA'ların üstünde
   - Card içi ufak vurgu: bg-rd-primary-50 border border-rd-primary-200 
     rounded-lg px-4 py-2 inline-flex items-center gap-2
   - Lucide Coins (size-4 text-rd-primary-700)
   - Text: text-rd-primary-700 font-medium "X kredi yüklendi"
   - Eğer paket bilinmiyorsa rozeti gösterme

5. CTA'lar (mevcut iki link):
   - Primary "İçerik üret" → bg-rd-primary-700 hover:bg-rd-primary-800 
     text-white font-medium py-3 rounded-lg text-sm. href="/uret" 
     (ana sayfa "/" yerine — kullanıcı kredi yükledikten sonra direkt 
     üretime gitsin)
   - Ghost "Kredi geçmişini gör" → text-rd-neutral-500 
     hover:text-rd-neutral-700 py-2 (mevcut href="/hesap/krediler" kalır 
     — H-36'da gelecek; yoksa /hesap'a redirect veya disabled fallback)

6. Card stil: bg-white border border-rd-neutral-200 rounded-xl p-8 md:p-10 
   (rounded-2xl serbest ama rounded-xl daha sakin; Aziz'in canlı tarzına 
   yakın)

────────────────────────────────────────────
BÖLÜM 2 — OD-02: /odeme/hata redesign
────────────────────────────────────────────

Tamamen yeniden yaz. Başarılı sayfasının simetriği ama danger ton.

1. Server component kalabilir (mevcut Metadata, robots no-index korunur) 
   AMA URL searchParams'tan ?reason= veya ?errorCode= okumak için 
   client'a çevirmek faydalı olabilir. Karar: 'use client' + Suspense 
   wrapper (başarılı sayfasıyla simetrik). Metadata için ayrı 
   layout.tsx veya `export const metadata` kalır.

2. Layout: başarılı ile aynı (merkezi card, max-w-md).

3. İçerik:
   - İkon: Lucide XCircle (size-7, strokeWidth=2 text-rd-danger-700)
   - İkon arkaplan: bg-rd-danger-50 rounded-full size-16 (mevcut yapı)
   - H1 (font-display): "Ödeme tamamlanamadı" (ünlem yok, "Başarısız" 
     yerine daha nötr — kullanıcıyı ürkütmesin)
   - p: text-rd-neutral-600 text-sm md:text-base leading-relaxed
     "Ödeme işlemi tamamlanamadı. Krediniz çekilmedi. Tekrar deneyebilir 
     veya farklı bir kart kullanabilirsin."
   
4. Hata sebebi (varsa):
   - URL searchParams'tan ?reason= veya ?errorCode= oku (iyzico tipik 
     parametreleri)
   - Varsa: ufak gri kutu, ana mesajın altında — bg-rd-neutral-100 
     border border-rd-neutral-200 rounded-lg p-3 text-xs 
     text-rd-neutral-600 monospace
     "Hata kodu: <reason>" formatında
   - Yoksa: bu kutuyu gösterme

5. CTA'lar:
   - Primary "Tekrar dene" → href="/kredi-yukle" — 
     bg-rd-primary-700 hover:bg-rd-primary-800 text-white font-medium 
     py-3 rounded-lg text-sm. (Ok karakteri "→" KULLANMA — sade label)
   - Ghost "Destek al" → mailto:destek@yzliste.com — 
     text-rd-neutral-500 hover:text-rd-neutral-700 py-2 
     (text-sm + Lucide Mail size-3.5 yanında)

6. EMOJİ YASAK — mevcut sayfadaki "✗" karakteri (text-2xl span) Lucide 
   XCircle ile değiştir. Mevcut "→" karakteri sade label ile değiştir.

7. Eski class'ları sil:
   - rounded-3xl → rounded-xl
   - shadow-sm → kaldır (redesign'da serbest ama bu sayfada gerek yok)
   - font-bold → font-medium (Manrope display zaten ağırlık veriyor)
   - bg-indigo-500/600 → bg-rd-primary-700/800
   - bg-red-100 → bg-rd-danger-50

8. Analytics: hata sayfasında payment_failed event firle (varsa). 
   lib/analytics.ts'te paymentFailed gibi bir method var mı kontrol 
   et — yoksa eklemeyi atla, BACKLOG'a "OD-02b — payment_failed 
   analytics event" ticket'ı [ ] olarak düş.

────────────────────────────────────────────
BÖLÜM 3 — OD-03: E-Arşiv + iyzico rozeti
────────────────────────────────────────────

Her iki sayfada (basarili + hata) card'ın ALTINA, sayfa footer'ının 
hemen üstüne küçük bir trust strip:

- mt-6 mx-auto max-w-md
- flex flex-row items-center justify-center gap-4
- text-xs text-rd-neutral-400

İçerik (sıralı):
1. iyzico rozeti
   - public/iyzico-logo.* var mı kontrol et (Glob: public/**/iyzico*)
   - Varsa: <Image> ile (height ~20px, width auto)
   - Yoksa: text "Güvenli ödeme · iyzico" + Lucide Lock (size-3)
2. Ayraç: <span className="text-rd-neutral-300">·</span>
3. E-Arşiv: text "e-Arşiv fatura" + Lucide FileText (size-3)
   - Tıklanabilir değil, sadece bilgi etiketi (KVKK / şeffaflık)

Bu trip her iki sayfada DA gösterilir (başarılı = "ödemen güvenli + 
faturan e-Arşiv"; hata = "kart bilgilerin iyzico'da güvende, 
çekim yapılmadı" güvencesi).

────────────────────────────────────────────
BÖLÜM 4 — OD-04: A11y + bitirme kontrol
────────────────────────────────────────────

1. ARIA:
   - main role="main" implicit — gerek yok ek attribute
   - h1 sayfa başlığı tek (her iki sayfa)
   - İkonlar (CheckCircle2, XCircle, Coins, Mail, Lock, FileText) 
     aria-hidden="true"
   - Hata sayfası: hata sebebi kutusu role="status" (passive) — 
     navigasyondan sonra okunması yeterli, aria-live yok
   - Başarılı sayfası: ana içerik render olduğunda screen reader 
     başlığı okur, aria-live yok (sayfa zaten yenilendi)

2. Klavye:
   - Tab sırası: H1 (focus alamaz, ok) → Primary CTA → Ghost CTA → 
     trust strip linkleri (yoksa skip)
   - Focus visible: ring-2 ring-rd-primary-700/30 ring-offset-2

3. Kontrast (WCAG AA):
   - text-rd-success-700 (#0F5132) on bg-rd-success-50: 4.5:1+ ✓
   - text-rd-danger-700 (#7A1E1E) on bg-rd-danger-50 (#FCECEC): 
     hesapla, AA değilse rd-danger-800'e geç
   - text-rd-neutral-500 (#908E86) on bg-rd-neutral-50: ufak metin 
     için sınırda — text-rd-neutral-600'a yükselt eğer body p ise
   - text-rd-primary-700 on bg-rd-primary-50: ✓

4. Mobile (375px):
   - Card max-w-md mobil otomatik viewport - 2rem padding
   - CTA'lar full width zaten
   - Trust strip uzun düşerse flex-wrap koru (gap-4 → gap-2)

5. Edge case'ler:
   - /odeme/basarili?paket=undefined → kredi rozeti gizle, 
     analytics call yine fire (mevcut davranış)
   - /odeme/hata reason yok → hata kodu kutusu gizle
   - Suspense fallback={null} mevcut — bırak

────────────────────────────────────────────
Test (commit öncesi)
────────────────────────────────────────────

- npm run build temiz, TypeScript clean
- Localde:
  - /odeme/basarili?paket=populer → CheckCircle2, "30 kredi yüklendi" 
    rozet, "İçerik üret" → /uret, trust strip görünür
  - /odeme/basarili (paket yok) → rozet gizli, sayfa hatasız
  - /odeme/hata?reason=card_declined → XCircle, "Hata kodu: 
    card_declined" kutusu, "Tekrar dene" → /kredi-yukle, "Destek 
    al" mailto, trust strip görünür
  - /odeme/hata (param yok) → kod kutusu gizli
  - 375px her iki sayfa: card düzgün, taşma yok
  - Klavye: Tab → Primary → Ghost → (trust links yoksa son)

Commit özeti (tek commit OK):
- feat(odeme): OD-01~OD-04 ödeme sonuç sayfaları redesign 
  (rd-* palette, Manrope, kredi rozet, hata kodu, iyzico+e-Arşiv 
  trust strip)

VEYA bölünmüş:
- feat(odeme): OD-01 /odeme/basarili rd-* token swap + Manrope
- feat(odeme): OD-02 /odeme/hata redesign (XCircle, hata kodu)
- feat(odeme): OD-03 iyzico + e-Arşiv trust strip
- chore(odeme): OD-04 a11y + acceptance polish

BACKLOG-REDESIGN.md'de OD-01~OD-04 [x] işaretle. Eğer OD-02'de 
analytics event eksikse OD-02b yeni ticket [ ] aç.

Bittikten sonra:
- Commit listesi
- Değişen dosyalar (app/odeme/basarili/page.tsx, app/odeme/hata/page.tsx, 
  varsa public/iyzico-logo, components/odeme/TrustStrip.tsx?)
- iyzico logo durumu (public'te var mıydı, text fallback mi kullandın)
- Açık riskler / Faz 2 toplu acceptance'ta dikkat edilmesi gereken
```

**Faz 2 toplam:** 21 (U) + 11 (YS) + 6 (SR) + 4 (OD) = 42 ticket. **U-01~20 + SR-01~06 + OD-01~04 done (30), kalan 12 (U-21 + YS-01~11). Aziz toplu acceptance Faz 2 sonu.**

---

## 14 — Hesap Detay Sayfaları Genişletme (Faz 3 eklentisi)

| ID | Başlık | Durum |
|---|---|---|
| H-36 → KR | /hesap/krediler | ✅ Tamam (Grup 3B) |
| H-37 → UR | /hesap/uretimler | ✅ Tamam (Grup 3C) |
| H-39 → FT | /hesap/faturalar | ✅ Tamam (Grup 2C) |
| H-38 → HD-01 | /hesap/ayarlar | Bekliyor (HD paketi) |
| H-40 → HD-02 | /kredi-yukle | Bekliyor (HD paketi) |
| H-41 → MD | Modal versiyonları (.)giris/(.)kayit/(.)kredi-yukle | Faz 4 (Auth) |

### HD-01~HD-03 (Faz 3 son paketi — /hesap/ayarlar + /kredi-yukle)

| ID | Başlık | Durum | Bağımlılık | Kabul Kriteri |
|---|---|---|---|---|
| HD-01 | `/hesap/ayarlar` refactor | ✅ Tamam | FY done | Commit `HD-commit` — rd-* swap, Manrope eyebrow, 3 bölüm (Hesap/Bildirimler/KVKK), Toggle bileşeni, StickySaveBar + Toast reuse. KVKK API'leri mevcut. |
| HD-01b | Bildirim tercihleri backend | Bekliyor | HD-01 | Supabase `profiles` tablosuna `bildirim_tercihleri` JSONB kolonu ekle. /api/profil/bildirimler PUT endpoint. Şu an UI local state. |
| HD-02 | `/kredi-yukle` refactor | ✅ Tamam | FY done | Commit `HD-commit` — rd-* swap, Manrope eyebrow, PackageCard FY pattern reuse, ?paket= pre-select, radiogroup ARIA, Suspense wrapper, Trust strip. |
| HD-03 | Mobile + a11y polish | ✅ Tamam | HD-02 | Commit `HD-commit` — 375px 1-col grid, role="radiogroup"/radio, role="switch", aria-checked, aria-modal, aria-busy tüm butonlarda. |

**Faz 3 ✅ TAMAM (28 Nis akşam).** 8/8 paket done: MP+PR+FT+HS+KR+UR+FY+HD. KVKK endpoint'leri /api/hesap/export + /api/hesap-sil mevcut çıktı. HD-01b backend ticket: bildirim_tercihleri persist (UI hazır, simulate). iyzico popup CSS global korundu.

---

## 15 — Auth Sayfaları (Faz 4)

**Mevcut sayfalar:** app/giris/page.tsx, app/kayit/page.tsx, app/@modal/(.)giris/page.tsx, app/@modal/(.)kayit/page.tsx + components/auth/AuthForm.tsx (zaten mevcut). Mevcut auth flow CHALIŞIYOR (Aziz email+şifre ile preview test edebildi). Sadece UI redesign + Google OAuth preview URL fix.

| ID | Başlık | Durum | Bağımlılık | Kabul Kriteri |
|---|---|---|---|---|
| AU-01 | `/giris` komple (form + Google OAuth + hata + Turnstile) | ✅ Tamam | Landing done | Commit `AU-commit` — rd-* swap, 2-kolon layout (sağ: değer önermesi rd-primary kart), Eye toggle, "Beni hatırla" + "Şifremi unuttum", AlertCircle inline hata, Turnstile korundu. |
| AU-02 | `/kayit` komple (form + e-posta doğrulama UI + KVKK) | ✅ Tamam | AU-01 | Commit `AU-commit` — AuthForm içinde kayitBasarili state, MailCheck success UI, 60s resend cooldown (supabase.auth.resend), KVKK /kvkk-aydinlatma + /kosullar link. |
| AU-03 | `/sifre-sifirla` komple (2 step) | ✅ Tamam | AU-01 | Commit `AU-commit` — Step1 (email form + KeyRound + MailCheck success), Step2 (code exchange + yeni şifre + Eye toggle). Suspense wrapper. |
| AU-04 | Modal versiyonları (.)giris/(.)kayit/(.)kredi-yukle | ✅ Tamam | AU-01, AU-02 | Commit `AU-commit` — Modal.tsx rd-* swap + X Lucide ikon + role=dialog aria-modal. (.)giris korundu, (.)kayit rd-* güncellendi, (.)kredi-yukle rd-* + "En popüler" badge. |
| AU-05 | Mobile + a11y + Google OAuth preview URL fix | ✅ Tamam | AU-04 | Commit `AU-commit` — min-h-[44px] tüm inputlar, aria-hidden ikonlar, label htmlFor + autocomplete, aria-busy submit, docs/auth-config.md oluşturuldu (Aziz Supabase config talimatı). |

**Faz 4 toplam:** 5 birleşik ticket (eski AU-01~09 + H-41 absorb).

**AU-01~AU-05 ✅ Tamam (28 Nis akşam).** AuthForm.tsx tam rd-* rewrite (Eye toggle + inline error + KVKK linkleri + 60s resend cooldown), 2-kolon layout /giris+/kayit, /sifre-sifirla 2 step + Suspense, Modal.tsx rd-* (mobile bottom-sheet), @modal/(.) parallel routes korundu, docs/auth-config.md eklendi (Aziz Supabase Redirect URLs config talimatı).

**Açık riskler:**
- supabase.auth.resend SDK versiyon farkı: `{ type: 'signup', email }` vs `{ type: 'email', email }` — TS hata verirse alternatif
- Supabase Redirect URLs config Aziz dönüşünde Cowork yapacak (MCP üzerinden veya talimat ile)

<!-- AU prompt detay silindi — Code uyguladı, detay commit'lerde + docs/auth-config.md
ÖNEMLİ — KURAL OVERRIDE:
Bu görev `claude/redesign-modern-ui` branch'inde. CLAUDE.md UI 
kuralları GEÇERSİZ. BACKLOG-REDESIGN.md başındaki redesign branch 
kuralları geçerli (Manrope+Inter, rd-* token, Lucide ikon).

Branch: claude/redesign-modern-ui
Görev: AU-01~AU-05 — /giris + /kayit + /sifre-sifirla + Modal 
versiyonları + Google OAuth preview URL fix (Faz 4 Auth).

Mevcut sayfalar:
- app/giris/page.tsx
- app/kayit/page.tsx
- app/sifre-sifirla/page.tsx (varsa, yoksa yeni)
- app/@modal/(.)giris/page.tsx (varsa)
- app/@modal/(.)kayit/page.tsx (varsa)
- components/auth/AuthForm.tsx (paylaşılan form — önce oku)

Mevcut auth flow ÇALIŞIYOR (Aziz email+şifre ile preview test etti). 
Sadece UI redesign + Google OAuth Supabase config talimatı.

Reuse: components/primitives/{Toast}.tsx (form success/error için).

KAPSAM DIŞI:
- Backend Supabase auth değişikliği (mevcut çalışan flow korunur)
- Cloudflare Turnstile yapılandırma (varsa korunur)
- Google Cloud Console / Supabase config işlemleri (Aziz manuel 
  yapacak, Code sadece talimat verir)

────────────────────────────────────────────
BÖLÜM 1 — AU-01: /giris komple
────────────────────────────────────────────

1. Sayfa rd-* swap.

2. Layout: 2 kolon (lg:grid-cols-2 gap-12) max-w-6xl mx-auto:
   - Sol kolon: form (max-w-md)
   - Sağ kolon: değer önermesi (Lucide Sparkles ikon + 3-4 bullet 
     "yzliste ile ne yapabilirsin"). Mobile gizlenir (hidden lg:block).

3. Sol kolon başlık:
   - Eyebrow text-rd-primary-700 "GİRİŞ"
   - H1 (font-display): text-3xl md:text-4xl text-rd-neutral-900 
     "Tekrar hoş geldin"
   - Subtitle: text-rd-neutral-600 — "Hesabına giriş yap, üretmeye 
     devam et."

4. Form:
   - **E-posta input:** type="email", autocomplete="email", aria-label, 
     Lucide Mail size-4 sol başında, focus:ring-rd-primary-500
   - **Şifre input:** type="password" (toggleable), 
     autocomplete="current-password", Lucide Lock + Eye/EyeOff toggle 
     buton sağında
   - **"Beni hatırla" checkbox:** flex items-center, Lucide Square/
     CheckSquare ikon
   - **"Şifremi unuttum" link:** text-sm text-rd-primary-700 hover, 
     sağa hizalı (justify-between with checkbox)
   - **Submit buton:** bg-rd-primary-700 text-white py-3 rounded-lg 
     "Giriş yap"

5. **Google OAuth bölümü:**
   - Form'un altında "veya" ayracı (line + text)
   - Google buton: outline border-rd-neutral-300 hover:bg-rd-neutral-50 
     + Google logo (mevcut SVG veya Lucide alternatif) + "Google ile 
     devam et"
   - Tıklayınca AuthForm.tsx'teki signInWithOAuth flow korunur

6. **Inline error:**
   - Form altında: bg-rd-danger-50 border border-rd-danger-200 
     text-rd-danger-700 rounded-lg p-3
   - Lucide AlertCircle + hata mesajı (Türkçe)
   - aria-live="polite"

7. **Turnstile:** mevcut entegrasyon korunur (görünür widget veya 
   invisible challenge — kod tarafında var, dokunma).

8. Sayfa sonu: "Hesabın yok mu? Kayıt ol →" link to /kayit

Commit: feat(auth): AU-01 /giris komple refactor

────────────────────────────────────────────
BÖLÜM 2 — AU-02: /kayit komple
────────────────────────────────────────────

1. Sayfa rd-* swap. AU-01 ile aynı 2 kolon layout.

2. Sol kolon başlık:
   - Eyebrow "KAYIT"
   - H1: "Hesabını oluştur"
   - Subtitle: "Ücretsiz başla, kullandıkça öde."

3. Form:
   - E-posta input
   - Şifre input + autocomplete="new-password"
   - Şifre tekrar input + eşleşme kontrol (inline hata "Şifreler 
     uyuşmuyor" eşleşmiyorsa)
   - **KVKK + koşullar checkbox:** "[KVKK Aydınlatma Metni](/kvkk-aydinlatma) 
     ve [Kullanım Koşulları](/kosullar)nı okudum, onaylıyorum"
   - Submit buton: "Hesap oluştur"

4. **E-posta doğrulama UI** (submit sonrası — aynı sayfa veya 
   /kayit/dogrula):
   - Form gizlenir, success state render olur
   - Lucide MailCheck size-12 text-rd-success-700
   - H2 "E-postanı kontrol et"
   - p: "[email] adresine doğrulama linki gönderdik. Linkin gelmemesi 
     halinde spam klasörünü kontrol et."
   - "Yanlış e-posta? Düzelt" link → form'a geri dön
   - "Tekrar gönder" buton (60sn cooldown timer)

5. Google OAuth bölümü AU-01 ile aynı.

6. Sayfa sonu: "Zaten hesabın var mı? Giriş yap →" link to /giris

Commit: feat(auth): AU-02 /kayit komple refactor + e-posta 
doğrulama UI

────────────────────────────────────────────
BÖLÜM 3 — AU-03: /sifre-sifirla komple
────────────────────────────────────────────

1. Sayfa rd-* swap. Layout tek kolon max-w-md mx-auto.

2. Başlık:
   - Eyebrow "ŞİFRE SIFIRLA"
   - H1: "Şifreni sıfırla"
   - Lucide KeyRound size-8 text-rd-primary-700 (başlık üstünde)

3. **Step 1: E-posta input + sıfırlama linki gönder:**
   - E-posta input + autocomplete
   - Submit "Sıfırlama linki gönder"
   - Mevcut Supabase resetPasswordForEmail flow korunur

4. **Step 1 sonrası success state:**
   - Lucide MailCheck + "Sıfırlama linki gönderildi"
   - p: "[email] adresine link geldi, üzerine tıkla."

5. **Step 2 (link tıklanınca, ayrı sayfa veya query param ile aynı):**
   - Yeni şifre input + autocomplete="new-password"
   - Şifre tekrar input
   - Submit "Şifreyi güncelle"
   - Mevcut Supabase updateUser flow korunur

6. Sayfa sonu: "Giriş yap →" link to /giris

Commit: feat(auth): AU-03 /sifre-sifirla 2 step

────────────────────────────────────────────
BÖLÜM 4 — AU-04: Modal versiyonları
────────────────────────────────────────────

Next.js parallel routes intercepting. Mevcut yapı: app/@modal/
(.)giris, (.)kayit. Eğer (.)kredi-yukle yoksa ekle.

1. Modal layout (components/auth/AuthModal.tsx — yeni veya mevcut):
   - Backdrop: fixed inset-0 bg-black/50 backdrop-blur-sm
   - Modal kart: max-w-md mx-auto bg-white rounded-2xl p-6 md:p-8 
     shadow-2xl
   - Close buton: sağ üst Lucide X size-5
   - Escape klavye + backdrop click → modal kapanır (router.back())
   - aria-modal="true" + aria-labelledby

2. İçerik: AU-01/AU-02 form'larını reuse (AuthForm.tsx zaten 
   ortak). Modal layout sadece wrapper.

3. URL behavior:
   - /giris veya /kayit normal navigasyonla full sayfa
   - In-page tıklama (örn header "Giriş" buton) → intercepting route 
     ile modal açılır
   - Modal'dan close → router.back() URL'i geri döner

4. (.)kredi-yukle modal:
   - app/@modal/(.)kredi-yukle/page.tsx (yoksa oluştur)
   - HD-02'deki /kredi-yukle içeriğini reuse, modal wrapper içinde

Commit: feat(auth): AU-04 modal versiyonları (giris/kayit/kredi-yukle)

────────────────────────────────────────────
BÖLÜM 5 — AU-05: Mobile + a11y + Google OAuth preview fix
────────────────────────────────────────────

1. **Mobile (375px):**
   - Layout 2 kolon → tek kolon (sağ kolon hidden lg:block, mobile'da 
     gösterilmez)
   - Form input min-h 44px (tap-friendly)
   - Submit buton full width
   - Modal mobile: full screen (max-w-full + h-full)

2. **A11y:**
   - Form: her input id + label htmlFor
   - autocomplete attribute: email / current-password / new-password
   - Inline error aria-live="polite" + aria-describedby
   - Şifre göz toggle aria-label "Şifreyi göster/gizle"
   - Modal: aria-modal + focus trap (focus close butona) + Escape 
     kapatır
   - Klavye Tab full tour
   - Lucide ikonlar aria-hidden

3. **Google OAuth preview URL fix (Aziz 28 Nis bulgusu):**
   
   **Kod tarafı:** AuthForm.tsx'teki `signInWithOAuth` çağrısını 
   review et:
   ```ts
   await supabase.auth.signInWithOAuth({
     provider: 'google',
     options: {
       redirectTo: `${window.location.origin}/auth/callback`,
     },
   });
   ```
   - `window.location.origin` doğru: preview URL'inde preview origin, 
     prod'da yzliste.com
   - Eğer kodda hardcoded URL varsa → düzelt
   - Yoksa kod tarafı temiz

   **Config tarafı (Aziz manuel yapacak — Code sadece README'ye 
   talimat ekler):**
   - README.md veya docs/auth-config.md'ye ekle:
     ```
     ## Google OAuth Preview URL Configuration
     
     Preview deployment'larda Google ile girişin canlı siteye 
     yönlendirme bug'ı için:
     
     1. **Supabase Dashboard → Authentication → URL Configuration:**
        - Site URL: https://yzliste.com
        - Redirect URLs (her birini ayrı satıra ekle):
          - https://yzliste.com/**
          - https://*.vercel.app/**
          - http://localhost:3000/**
     
     2. **Google Cloud Console:** Authorized redirect URIs zaten 
        Supabase callback URL ile çalışıyor, ek değişiklik gereksiz:
        - https://<supabase-project>.supabase.co/auth/v1/callback
     
     3. **Test:** Preview deployment URL'inde "Google ile devam et" 
        → Google sayfası → preview URL'e geri dönmeli (canlı yzliste 
        DEĞİL).
     ```

4. **Edge case'ler:**
   - Yanlış şifre: error toast + form korunur (input clear yok)
   - Network fail: "Bağlantı hatası, tekrar dene" toast
   - Modal escape: dirty form varsa onay sor
   - Şifre sıfırlama linki süresi dolmuş: "Link süresi dolmuş, tekrar 
     iste" + sıfırlama ekranına geri

Commit: chore(auth): AU-05 mobile + a11y + Google OAuth preview 
talimatı (README)

────────────────────────────────────────────
Test
────────────────────────────────────────────

- npm run build temiz
- Localde:
  - /giris: 2 kolon, form çalışır, Google buton, hata durumları
  - /kayit: e-posta doğrulama UI submit sonrası
  - /sifre-sifirla: 2 step flow
  - Modal versiyonları: header'dan tıklayınca modal açılır
  - 375px mobile sıkıntısız, tek kolon
  - Klavye Tab full tour
  - Şifre göz toggle çalışır

Commit özeti (5 atomik) VEYA tek:
feat(auth): AU-01~AU-05 /giris + /kayit + /sifre-sifirla + modal 
versiyonları + Google OAuth README talimatı

BACKLOG'da AU-01~AU-05 [x] işaretle.

Bittikten sonra rapor:
- Commit listesi
- AuthForm.tsx redirectTo durumu (kod temiz mi, hardcoded var mı)
- Modal versiyonları mevcut yapı korundu mu yoksa yeni mi
- README/docs auth-config.md eklendi mi
- Açık riskler / Aziz preview test (Google OAuth Supabase config 
  manuel adımları)
```
-->

---

## 16 — İçerik Sayfaları (Faz 5)

**Mevcut sayfalar:** app/blog/page.tsx, app/blog/[slug]/page.tsx, app/sss/page.tsx, app/hakkimizda/page.tsx. Hepsi var, sadece UI redesign.

| ID | Başlık | Durum | Bağımlılık | Kabul Kriteri |
|---|---|---|---|---|
| IC-01 | `/blog` liste komple | ✅ Tamamlandı | Auth done | rd-* swap. Manrope eyebrow "BLOG" + H1 "yzliste blog". Hero + arama input + kategori chip filter (ChipSelector reuse, "Tümü" + kategoriler). Kart grid (md:grid-cols-2 lg:grid-cols-3 gap-6): kapak + kategori badge + başlık (font-display) + özet + tarih + okuma süresi. Hover lift -translate-y-0.5. Pagination veya useInfiniteQuery (UR pattern reuse). |
| IC-02 | `/blog/[slug]` komple (tipografi + meta + paylaş + ilgili + CTA) | ✅ Tamamlandı | IC-01 | rd-* swap. Article max-w-prose (~720px) mx-auto. font-display H1, prose-rd typography (line-height 1.75, p mb-4, h2/h3 spacing, code block bg-rd-neutral-100). Üstte meta: kategori badge + yazar + tarih + "X dk okuma". Sağda veya altta sosyal paylaş (X / LinkedIn / kopya link, Lucide ikonlar). Yazı sonu CTA kart (warm-earth bg + "yzliste'yi dene" + Link to /uret). 3 ilgili yazı kart (kategoriye göre). |
| IC-03 | `/sss` redesign | ✅ Tamamlandı | IC-01 | rd-* swap. Manrope eyebrow "SSS" + H1 "Sıkça sorulanlar". components/landing/SSSSection veya FY-03'teki FiyatlarSSS pattern reuse. Kategori filter chip (ChipSelector reuse): Genel / Kredi / Üretim / Teknik / KVKK. Arama input (debounced live filter). Accordion her soru. |
| IC-04 | `/hakkimizda` redesign | ✅ Tamamlandı | IC-01 | rd-* swap. Manrope eyebrow "HAKKIMIZDA" + H1 "yzliste neden var". Aziz kuralı: mevcut metinleri koru, yeni yazma (DR-03 metni mevcut sitede). Bölümler: Vizyon / Hikaye / Kurucu (warm-earth accent rozet) / İletişim. Kurucu kart: foto (varsa) + isim + rol + LinkedIn. |
| IC-05 | Mobile + a11y polish | ✅ Tamamlandı | IC-04 | 375px: blog kart 1 kolon, /sss arama tek satır, /hakkımızda kurucu kart kompakt. Article semantic HTML (article > header > h1 + h2 hiyerarşi), aria-labelledby, ChipSelector ARIA reuse, blog kart role="article". |

**Faz 5 toplam:** 5 birleşik ticket (eski IC-01~08 sıkıştırıldı).

**IC-01~IC-05 ✅ Tamam (28 Nis gece).** /blog liste + post + /sss + /hakkımızda refactor. Yeni: components/blog/{BlogListesi, BlogPaylas, SSSListesi}.tsx. Kararlar: prose-rd custom kurulmadı (mevcut Bolum bileşen sistemi yeterli), Accordion primitive'e taşıma "ileride" (Faz 6 cleanup'a alınabilir), Aziz metin kuralı korundu (sadece kategori field eklendi SSS'e).

<!-- IC prompt detay silindi — Code uyguladı, detay commit'lerde
ÖNEMLİ — KURAL OVERRIDE:
Bu görev `claude/redesign-modern-ui` branch'inde. CLAUDE.md UI 
kuralları GEÇERSİZ. BACKLOG-REDESIGN.md başındaki redesign branch 
kuralları geçerli (Manrope+Inter, rd-* token, Lucide ikon).

Branch: claude/redesign-modern-ui
Görev: IC-01~IC-05 — /blog liste + /blog/[slug] + /sss + /hakkimizda 
refactor (Faz 5 İçerik).

Mevcut sayfalar:
- app/blog/page.tsx (liste)
- app/blog/[slug]/page.tsx (post)
- app/sss/page.tsx
- app/hakkimizda/page.tsx

Reuse: components/primitives/{ChipSelector, Toast}.tsx + 
components/landing/SSSSection (varsa) + components/fiyatlar/FiyatlarSSS 
pattern + UR pagination pattern (useInfiniteQuery).

Aziz kuralı: Mevcut sitedeki metinleri koru, yeni metin yazma. Tüm 
metin değişiklikleri Aziz preview'da kontrol eder.

KAPSAM DIŞI:
- Backend blog API değişikliği (mevcut MD/MDX veya headless CMS 
  korunur)
- Yeni içerik yazımı

────────────────────────────────────────────
BÖLÜM 1 — IC-01: /blog liste
────────────────────────────────────────────

1. Sayfa rd-* swap.

2. Hero bölümü:
   - Eyebrow text-rd-primary-700 "BLOG"
   - H1 (font-display): text-3xl md:text-5xl text-rd-neutral-900 
     "yzliste blog"
   - Subtitle: text-rd-neutral-600 — "Pazaryeri rehberleri, AI listing 
     ipuçları, satış stratejileri."

3. Filter satırı:
   - Sol: Arama input (Lucide Search) — placeholder "Yazı ara...", 
     debounced 300ms (UR pattern reuse)
   - Sağ: Kategori ChipSelector (single mode + "Tümü" default — UR 
     pattern reuse). Kategoriler MD frontmatter'dan veya headless 
     CMS'ten dinamik çek

4. Kart grid:
   - grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
   - Her kart (Link href={`/blog/${slug}`}):
     - rounded-xl border border-rd-neutral-200 bg-white overflow-hidden 
       hover:border-rd-primary-300 hover:-translate-y-0.5 transition
     - Üst: kapak image (varsa, aspect-[16/9] object-cover)
     - İçerik p-5: kategori badge (rd-warm tonu eyebrow) + H3 başlık 
       (font-display text-lg) + özet (text-rd-neutral-600 line-clamp-2) 
       + alt satır flex (tarih + "X dk okuma")

5. Pagination:
   - 12 yazı/sayfa (UR pattern reuse useInfiniteQuery)
   - "Daha fazla yükle" buton altta

6. Boş state:
   - Filtre/arama sonucu boş: "Sonuç bulunamadı" + "Tümünü göster" 
     CTA (filtre temizle)

Commit: feat(blog): IC-01 /blog liste refactor (kart grid + filter + 
pagination)

────────────────────────────────────────────
BÖLÜM 2 — IC-02: /blog/[slug]
────────────────────────────────────────────

1. Sayfa rd-* swap.

2. Layout: max-w-prose (~720px) mx-auto px-4 py-12.

3. Üst kısım (article header):
   - Geri linki: Lucide ChevronLeft + "Tüm yazılar" → /blog
   - Kategori badge: rd-warm-50 bg + text-rd-warm-700
   - H1 (font-display): text-3xl md:text-5xl text-rd-neutral-900 
     leading-tight
   - Meta satırı: flex items-center gap-3 text-sm text-rd-neutral-500
     - Yazar: Lucide User + isim (varsa avatar küçük)
     - Tarih: Lucide Calendar + tarih
     - Okuma süresi: Lucide Clock + "X dk okuma" (kelime sayısı / 200 
       hesaplama)

4. Kapak görseli (varsa): aspect-[16/9] rounded-xl overflow-hidden 
   my-8.

5. **Article body — prose typography:**
   - .prose-rd custom CSS sınıfı veya Tailwind Typography (varsa)
   - Tipografi:
     - p: text-base md:text-lg text-rd-neutral-800 leading-relaxed mb-5
     - h2: font-display text-2xl md:text-3xl mt-12 mb-4
     - h3: font-display text-xl md:text-2xl mt-8 mb-3
     - ul/ol: list-disc ml-6 mb-5, li mb-2
     - blockquote: border-l-4 border-rd-warm-300 pl-4 italic 
       text-rd-neutral-700
     - code (inline): bg-rd-neutral-100 px-1.5 py-0.5 rounded 
       text-sm font-mono
     - pre: bg-rd-neutral-900 text-white p-4 rounded-xl overflow-x-auto 
       font-mono text-sm
     - a: text-rd-primary-700 hover:text-rd-primary-800 underline 
       underline-offset-2
     - img: rounded-xl my-6
   - line-height: 1.75 (default leading-relaxed)

6. **Sosyal paylaş (sticky sağ kenar veya altta):**
   - Lucide Share2 + "Paylaş" başlığı
   - 3 buton (size-9 rounded-full bg-rd-neutral-100 hover:bg-rd-primary-50):
     - X (Twitter): Lucide Twitter
     - LinkedIn: Lucide Linkedin
     - Kopya link: Lucide Link2 (clipboard + Toast "Link kopyalandı")
   - Desktop sticky sol kenar (lg:fixed lg:left-8 lg:top-32), mobile 
     altta yatay

7. **Yazı sonu CTA:**
   - mt-16 rounded-xl border-2 border-rd-warm-300 bg-rd-warm-50 p-6 
     md:p-8
   - Eyebrow: "BU YAZIDAN İLHAM"
   - H3 (font-display): "yzliste'yi ücretsiz dene"
   - p: "Listing yazımı, görsel üretimi, video try-on — tek platformda."
   - CTA: bg-rd-primary-700 text-white "Hemen başla" → /uret

8. **3 ilgili yazı:**
   - Aynı kategoriden, yazıya en yakın 3 (tarih veya tag bazlı)
   - "Devamı" başlığı + 3 mini kart (IC-01 pattern, daha kompakt)

Commit: feat(blog): IC-02 /blog/[slug] tipografi + meta + paylaş + 
ilgili + CTA

────────────────────────────────────────────
BÖLÜM 3 — IC-03: /sss redesign
────────────────────────────────────────────

1. Sayfa rd-* swap.

2. Hero:
   - Eyebrow "SSS"
   - H1: "Sıkça sorulanlar"
   - Subtitle: "Cevabını bulamazsan destek@yzliste.com'a yaz."

3. Filter satırı:
   - Arama input (debounced)
   - Kategori ChipSelector (single + "Tümü"):
     - Tümü
     - Genel
     - Kredi & Fiyatlama
     - Üretim
     - Teknik
     - KVKK & Hesap
   - Kategoriler: SSS data'sındaki tag/kategori field'ından dinamik

4. Accordion liste:
   - components/landing/SSSSection veya FY-03 FiyatlarSSS pattern 
     reuse (uniformity için tek primitive'e taşımak ileride: 
     components/primitives/Accordion.tsx)
   - Filter sonucu boş: "Soru bulunamadı" + filtre temizle CTA
   - Mevcut SSS data'sı korunur (Aziz kuralı: yeni metin yazma)

5. Sayfa altı: "Cevabını bulamadın mı?" CTA → mailto:destek

Commit: feat(sss): IC-03 /sss kategori filter + arama + accordion

────────────────────────────────────────────
BÖLÜM 4 — IC-04: /hakkımızda redesign
────────────────────────────────────────────

1. Sayfa rd-* swap.

2. Hero:
   - Eyebrow "HAKKIMIZDA"
   - H1 (font-display): "yzliste neden var" (mevcut metinden — Aziz 
     kuralı koruma)
   - Subtitle: mevcut DR-03 metni

3. Bölümler (mevcut metinleri koru):
   
   **Vizyon:**
   - text-lg leading-relaxed
   - Lucide Sparkles ikon eyebrow
   
   **Hikaye:**
   - text-base leading-relaxed
   - Anekdot/timeline tarzında olabilir
   
   **Kurucu:**
   - rounded-xl border-2 border-rd-warm-300 bg-rd-warm-50 p-6 md:p-8 
     (warm-earth premium accent — Aziz spec)
   - Avatar (varsa) + isim + rol + 1-2 cümle bio
   - LinkedIn link (Lucide Linkedin)
   
   **İletişim:**
   - mailto:destek@yzliste.com + KVKK/koşullar linkleri
   - Footer reuse opsiyonel

4. Mevcut metni AYNEN korumak için: Code önce sayfayı oku, mevcut 
   string'leri al, sadece UI/layout değişimi yap. Yeni cümle yazma.

Commit: feat(hakkimizda): IC-04 /hakkimizda refactor (warm-earth 
kurucu accent, mevcut metin korundu)

────────────────────────────────────────────
BÖLÜM 5 — IC-05: Mobile + a11y polish
────────────────────────────────────────────

1. **Mobile (375px):**
   - /blog: kart grid tek kolon, filter satırı dikey (arama üstte, 
     kategori chip yatay scroll)
   - /blog/[slug]: max-w-prose mobile px-4, sosyal paylaş altta yatay 
     (sticky değil)
   - /sss: arama tek satır, kategori chip yatay scroll, accordion 
     full width
   - /hakkımızda: kurucu kart kompakt (avatar üst + metin alt)

2. **A11y:**
   - article semantic HTML: <article> wrapper + <header> meta + 
     <main> body + <footer> CTA
   - aria-labelledby h1 id'sine bağlı
   - Blog kart role="article" + aria-labelledby kart başlık id
   - Sosyal paylaş buton aria-label net (örn "X'te paylaş")
   - Lucide ikonlar aria-hidden
   - Kategori filter ChipSelector ARIA (zaten var)
   - Klavye Tab full tour
   - Article heading hierarchy doğru (H1 sayfa başlığı, H2/H3 prose 
     içinde)

3. **Edge case'ler:**
   - Blog kapak yok: placeholder rd-neutral-100 + Lucide FileText
   - Yazar yok: "yzliste ekibi" fallback
   - İlgili yazı 3'ten az: olduğu kadar göster (gizleme)
   - SSS data fetch fail: "SSS yüklenemedi, destek@yzliste.com" 
     fallback

Commit: chore(icerik): IC-05 mobile + a11y polish

────────────────────────────────────────────
Test
────────────────────────────────────────────

- npm run build temiz
- Localde:
  - /blog: kart grid + arama + kategori filter
  - /blog/[slug]: prose tipografi + meta + paylaş + ilgili
  - /sss: kategori filter + arama + accordion
  - /hakkımızda: warm-earth kurucu accent
  - 375px mobile sıkıntısız
  - Klavye Tab full tour

Commit özeti (5 atomik) VEYA tek:
feat(icerik): IC-01~IC-05 /blog + /blog/[slug] + /sss + /hakkımızda 
refactor

BACKLOG'da IC-01~IC-05 [x] işaretle.

Bittikten sonra rapor:
- Commit listesi
- prose-rd CSS sınıfı veya Tailwind Typography reuse durumu
- Accordion primitive'e taşındı mı (FY-03 + IC-03 ortak pattern)
- Aziz kuralı korundu mu (mevcut metinler değişmedi)
- Açık riskler / Aziz preview test
```
-->

---

## 17 — Yasal + Hata Sayfaları + Post-redesign Cleanup (Faz 6 SON PAKET)

**Yaklaşım:** Faz 6 = redesign'ın SON paketi. 3 ana iş: (1) yasal/hata sayfaları toplu pas, (2) post-redesign code cleanup (orphan dosyalar), (3) final QA (metin taraması + Lighthouse + scheduled task reaktivasyon).

| ID | Başlık | Durum | Bağımlılık | Kabul Kriteri |
|---|---|---|---|---|
| LG-01 | 6 yasal sayfa global token swap | ✅ Tamamlandı | IC done | /kvkk-aydinlatma, /gizlilik, /kosullar, /cerez-politikasi, /mesafeli-satis, /teslimat-iade — rd-* paleti, Manrope eyebrow + H1, prose body (IC-02 Bolum sistem reuse). Tek mekanik pas. |
| LG-02 | 404 not-found + error.tsx + loading.tsx | ✅ Tamamlandı | LG-01 | app/not-found.tsx: Lucide MapOff size-16 + "Sayfa bulunamadı" + "Anasayfaya dön" CTA. app/error.tsx: Lucide AlertTriangle + "Bir şeyler ters gitti" + "Tekrar dene" + sentry log (varsa). app/loading.tsx: Lucide Loader2 animate-spin tutarlı global loader. Tüm route segment'lerde global. |
| LG-03 | Post-redesign code cleanup | ✅ Tamamlandı | LG-02 | **Orphan dosya silme:** app/yzstudio/components/tryon/TryonAyarlar.tsx (yzstudio refactor sonrası import edilmiyor), components/RefDavetBolumu.tsx veya benzeri (HS InviteBox sonrası eski). components/sections/_archive/ klasörü Aziz onayında silinir veya kalır (git history ile geri alınabilir). **Accordion primitive'e taşıma:** FY-03 + IC-03 inline accordion → components/primitives/Accordion.tsx (FiyatlarSSS + SSSListesi reuse'a geçer). |
| LG-04 | Scheduled tasks reaktivasyon + backend ticket listesi | ✅ Tamamlandı | LG-03 | 5 PAUSED scheduled task (blog-seo-yazisi dahil) → enabled:true. Backend bekleyen ticket'lar net listele (HD-01b bildirim_tercihleri, KR-02b kredi_log işlem_turu, OD-02b payment_failed analytics, UR-03b /uret pre-fill, SR-04b ZIP/PDF, FT için Paraşüt entegrasyonu, profiles TC kimlik/Vergi no kolonları) → BACKLOG.md'ye taşı (canlı site backlog'u). |
| LG-05 | Final QA + acceptance | ✅ Tamamlandı | LG-04 | (1) Post-redesign metin taraması: spec dosyaları vs canlı sitedeki metin tutarlılığı (Aziz kuralı: mevcut metinler korundu varsayım — fark bulunursa rapor). (2) Lighthouse mobil + desktop tüm sayfalarda (≥85 perf, ≥90 a11y, <0.1 CLS hedef). (3) Aziz toplu acceptance: 9+ sayfa preview testi. (4) main'e merge hazırlığı (CI temiz, Vercel build OK). |

**Faz 6 toplam:** 5 ticket.

**LG-01~LG-05 ✅ Tamam (28 Nis gece — redesign Code-side BİTTİ).**
- LG-01: 6 yasal sayfa rd-* swap, mevcut metinler korundu
- LG-02: not-found.tsx (FileQuestion), error.tsx (rd-warning-600), loading.tsx
- LG-03: Accordion primitive yaratıldı (FY + IC reuse), 5 orphan dosya silindi, _tanitim.tsx archive bağı kesildi
- LG-04: BACKLOG.md'ye P2b backend ticket tablosu eklendi (8 ticket)
- LG-05: docs/lighthouse-checklist.md + docs/metin-tarama.md, build + tsc temiz

**Aziz acceptance + main merge bekleniyor.**

<!-- LG prompt detay silindi
ÖNEMLİ — KURAL OVERRIDE:
Bu görev `claude/redesign-modern-ui` branch'inde. CLAUDE.md UI 
kuralları GEÇERSİZ. BACKLOG-REDESIGN.md başındaki redesign branch 
kuralları geçerli (Manrope+Inter, rd-* token, Lucide ikon).

Branch: claude/redesign-modern-ui
Görev: LG-01~LG-05 — Faz 6 SON paket. Yasal sayfalar + hata sayfaları 
+ post-redesign code cleanup + final QA. Bu paket bittiğinde redesign 
tamam, main'e merge hazır.

Mevcut sayfalar:
- app/kvkk-aydinlatma/page.tsx
- app/gizlilik/page.tsx
- app/kosullar/page.tsx
- app/cerez-politikasi/page.tsx
- app/mesafeli-satis/page.tsx
- app/teslimat-iade/page.tsx
- app/not-found.tsx (varsa, yoksa yeni)
- app/error.tsx (varsa, yoksa yeni)
- app/loading.tsx (varsa, yoksa yeni)

Reuse: components/blog/[slug]'daki Bolum bileşen sistemi (giris/baslik/
paragraf/liste — yasal sayfalar için ideal), components/primitives/* 
(StatusBadge, Toast, vs — hata sayfasında).

Aziz kuralı: Mevcut metinler korunur, sadece UI/layout değişimi.

────────────────────────────────────────────
BÖLÜM 1 — LG-01: 6 yasal sayfa global swap
────────────────────────────────────────────

Her sayfa için:

1. Sayfa rd-* swap.

2. Yapı:
   - SiteHeader (mevcut, dokunma)
   - Container: max-w-prose mx-auto px-4 py-12
   - Eyebrow + H1 (font-display, sayfaya göre):
     - /kvkk-aydinlatma: "KVKK" / "KVKK Aydınlatma Metni"
     - /gizlilik: "GİZLİLİK" / "Gizlilik politikası"
     - /kosullar: "KULLANIM KOŞULLARI" / "Kullanım koşulları"
     - /cerez-politikasi: "ÇEREZ POLİTİKASI" / "Çerez politikası"
     - /mesafeli-satis: "MESAFELİ SATIŞ" / "Mesafeli satış sözleşmesi"
     - /teslimat-iade: "TESLİMAT VE İADE" / "Teslimat ve iade koşulları"
   - Subtitle/sürüm bilgisi: "Son güncelleme: [tarih]" text-sm 
     text-rd-neutral-500
   - Article body: IC-02'deki Bolum bileşen sistemi reuse
     (giris/baslik/paragraf/liste/bilgi-kutusu) — mevcut metinler 
     KORUNUR
   - SiteFooter (mevcut)

3. Mevcut metinler korunur (KVKK uyumu için doğru metin önemli — 
   Aziz onaylanan içerik). Sadece layout/token değişimi.

Commit: feat(yasal): LG-01 6 yasal sayfa rd-* swap (mevcut metin 
korundu)

────────────────────────────────────────────
BÖLÜM 2 — LG-02: 404 + error.tsx + loading.tsx
────────────────────────────────────────────

1. **app/not-found.tsx:**
   - SiteHeader (varsa) + center container
   - Lucide MapOff size-16 text-rd-neutral-300
   - H1 (font-display): "Sayfa bulunamadı"
   - p: "Aradığın sayfa taşınmış veya hiç var olmamış olabilir."
   - 2 CTA:
     - Primary: "Anasayfaya dön" → / (bg-rd-primary-700)
     - Ghost: "Üretmeye başla" → /uret (border)
   - SiteFooter

2. **app/error.tsx:**
   - 'use client'
   - Center container
   - Lucide AlertTriangle size-16 text-rd-warning-700
   - H1 (font-display): "Bir şeyler ters gitti"
   - p: "Hatamız için özür dileriz. Tekrar denersen düzelir, ya da 
     destek@yzliste.com'a yaz."
   - 2 CTA:
     - "Tekrar dene" → reset() prop (bg-rd-primary-700)
     - "Anasayfa" → / (ghost)
   - Sentry log: error nesnesini Sentry'ye gönder (sentry/nextjs 
     varsa, lib/sentry.ts veya benzeri kontrol et)

3. **app/loading.tsx:**
   - Tutarlı global loader
   - Center container
   - Lucide Loader2 size-8 text-rd-primary-700 animate-spin
   - text-sm text-rd-neutral-500 "Yükleniyor..."

4. Tüm route segment'lerde otomatik geçerli (Next.js convention).

Commit: feat(hata): LG-02 not-found + error + loading global

────────────────────────────────────────────
BÖLÜM 3 — LG-03: Post-redesign code cleanup
────────────────────────────────────────────

1. **Orphan dosya tespit + sil:**
   - app/yzstudio/components/tryon/TryonAyarlar.tsx — yzstudio 
     refactor sonrası import edilmiyor, sil
   - components/RefDavetBolumu.tsx (veya benzeri) — HS InviteBox 
     sonrası eski, sil
   - Grep ile orphan import kalıntısı: tüm dosyalardan referans yok 
     mu kontrol et
   - components/sections/_archive/ klasörü: git history korur, 
     klasörü sil (Aziz onayında)

2. **Accordion primitive'e taşıma:**
   - components/fiyatlar/FiyatlarSSS.tsx + components/blog/SSSListesi.tsx
     içinde inline accordion var (her ikisi de)
   - Yeni: components/primitives/Accordion.tsx (single + multiple mode)
     - role="region" + aria-expanded + aria-controls
     - ChevronDown rotate-180 transition
     - Dışarıdan items prop alır
   - FiyatlarSSS + SSSListesi → primitive Accordion'u reuse eder

3. **Build temiz:**
   - npm run build sonrası uyarı yok
   - TypeScript clean
   - Unused import yok (eslint --no-unused-vars)

Commit: chore(cleanup): LG-03 post-redesign cleanup (orphan dosyalar 
sil + Accordion primitive)

────────────────────────────────────────────
BÖLÜM 4 — LG-04: Scheduled tasks + backend ticket listesi
────────────────────────────────────────────

1. **Scheduled tasks reaktivasyon:**
   - 5 PAUSED scheduled task'ın enabled:true yapılması (blog-seo-yazisi 
     dahil)
   - Bu Cowork'ün veya Aziz'in scheduled task UI'ından yapacağı iş 
     (Code dokunmaz, sadece talimat verir)
   - Code: docs/post-redesign-checklist.md veya BACKLOG.md'ye yaz: 
     "Redesign main'e merge sonrası 5 scheduled task enabled:true 
     yapılacak"

2. **Backend bekleyen ticket'lar BACKLOG.md'ye taşı (canlı site 
   backlog'u):**
   - HD-01b: profiles.bildirim_tercihleri JSONB + /api/profil/bildirimler
   - KR-02b: kredi_log tablosu + işlem_turu kolonu
   - OD-02b: payment_failed analytics event lib/analytics.ts
   - UR-03b: /uret pre-fill query params okuma (yeniden üret tamamlama)
   - SR-04b: ZIP/PDF indir multimedia üretimler
   - Paraşüt entegrasyonu (FT için: status field, PDF, email send)
   - profiles TC kimlik / Vergi no / Şirket adı kolonları (e-Fatura)
   - YS-11: /yzstudio/yol-haritasi sayfası (opsiyonel)
   
   BACKLOG-REDESIGN.md'den BACKLOG.md'ye taşı (priority Aziz seçer).

Commit: docs(cleanup): LG-04 scheduled task reaktivasyon talimatı + 
backend ticket'lar BACKLOG'a taşındı

────────────────────────────────────────────
BÖLÜM 5 — LG-05: Final QA + acceptance
────────────────────────────────────────────

1. **Post-redesign metin taraması:**
   - Aziz kuralı: "Canlı sitedeki mevcut metinleri koru, yeni metin 
     yazma" — bu kontrolü yap
   - Tüm spec dosyalarındaki metin örneklerini canlı/preview siteyle 
     karşılaştır
   - Fark bulursan: spec mi eski mı, canlı mi yanlış mı karar ver
   - Rapor: docs/metin-tarama.md veya BACKLOG'da yeni bölüm

2. **Lighthouse pass (mobil + desktop):**
   - Tüm ana sayfalar: /, /uret, /yzstudio, /fiyatlar, /sss, /hakkımızda, 
     /blog, /hesap, /hesap/marka, /hesap/profil, /hesap/krediler, 
     /hesap/uretimler, /hesap/faturalar, /hesap/ayarlar, /kredi-yukle, 
     /giris, /kayit
   - Hedef: Perf ≥85 (animasyonlu sayfalar 80), A11y ≥90, CLS <0.1
   - Code çalıştıramaz (Aziz preview'da yapacak); Code: docs/
     lighthouse-checklist.md'ye sayfa listesi + hedefler ekle

3. **Aziz toplu acceptance:**
   - Her ana sayfa için preview test
   - Mobile (375px) + desktop
   - Klavye Tab tour
   - Aziz onaylayınca redesign tamam → main'e merge

4. **main'e merge hazırlığı:**
   - CI temiz (npm run build + npm run lint exit 0)
   - Tüm Faz 1-6 ticket [x]
   - Conflict yok (claude/redesign-modern-ui ↔ main rebase OK)
   - Aziz onayı sonrası `git checkout main && git merge 
     claude/redesign-modern-ui --no-ff` veya PR açılır

Commit: chore(redesign): LG-05 final QA + acceptance hazırlığı

────────────────────────────────────────────
Test
────────────────────────────────────────────

- npm run build temiz
- TypeScript clean
- Localde:
  - 6 yasal sayfa: rd-* + Manrope + mevcut metinler korundu
  - /not-found-test gibi var olmayan URL → 404 sayfası
  - error.tsx test (geçici hata throw)
  - loading.tsx route geçişlerinde
  - Build sonrası unused import yok
  - Accordion primitive test (FiyatlarSSS + SSSListesi reuse)

Commit özeti (5 atomik) VEYA tek:
chore(redesign): LG-01~LG-05 Faz 6 son paket — yasal + hata + cleanup 
+ final QA

BACKLOG'da LG-01~LG-05 [x] işaretle.

Bittikten sonra rapor:
- Commit listesi
- Orphan dosya silme listesi (kaç dosya silindi)
- Accordion primitive entegrasyonu (FiyatlarSSS + SSSListesi reuse 
  başarılı mı)
- Scheduled task + backend ticket'lar BACKLOG.md'ye taşındı mı
- Lighthouse + metin taraması checklist eklendi mi
- Aziz preview test'e hazır mı (CI temiz, build OK)
```
-->

**Redesign Code-side TAMAM (28 Nis gece).** Sıradaki adımlar Aziz tarafında:
1. Preview URL'de toplu acceptance (docs/lighthouse-checklist.md + docs/metin-tarama.md rehberi)
2. Supabase Redirect URLs config doğruluğu test (Google OAuth incognito + preview)
3. main'e merge → Vercel auto-deploy → canlı yzliste.com yeni tasarım
4. 5 PAUSED scheduled task → enabled:true (blog-seo-yazisi vs)
5. Faz 7+ canlı BACKLOG.md (P2b backend ticket'lar — 8 adet)

---

## 18 — Anasayfa Reroll (Faz 1.5)

**Spec:** uploads/anasayfa-kisaltma-spec.md | **Mockup:** uploads/3-adim-animasyonlu-mockup-v2.html
**Branch:** claude/redesign-modern-ui | **Done:** 28 Nis 2026 (7ba9071 → a409341, 7 commit)

Anasayfa 9 → 7 bölüm. Eski Bölüm 3 ("4 içerik türü") + 4 ("Aynı üründen") `components/sections/_archive/`'a taşındı. Yeni "3 Adım Animasyonlu + InfoStrip" tek section'da gömülü.

**Yeni dosyalar:** components/landing/{StepAnimation, InfoStrip, StepSection}.tsx + lib/data/exampleContent.ts. globals.css'e 7 keyframe + 14 animasyon class + reduced-motion block. Sosyal caption: lib/constants/pazaryeri.ts'teki gerçek AI üretim metinleri (uydurma değil — Code tespit etti).

| ID | Başlık | Durum |
|---|---|---|
| AS-01 | Eski Bölüm 3-4 → _archive/ | ✅ |
| AS-02 | StepAnimation (3 adım, 9sn döngü, replay, progress) | ✅ |
| AS-03 | InfoStrip (4 sekme + detay accordion) | ✅ |
| AS-04 | lib/data/exampleContent.ts tek kaynak | ✅ |
| AS-05 | StepSection wrapper (StepAnimation + InfoStrip) | ✅ |
| AS-06 | Mobile + a11y + reduced-motion (useReducedMotion hook) | ✅ |

**Aziz preview kontrol noktaları (Faz 2 toplu acceptance'a katılır):**
- 9sn döngü timing OK mı (A/B test ileride)
- 375px step canvas yüksekliği (3 card desktop'ta farklı render olabilir)
- "Detaya bak" default kapalı OK mı (açık olsun derse `useState(true)` tek satır)
- Lighthouse mobile (Code çalıştırmadı; Aziz preview'da skor verir)

## 20 — /fiyatlar yerleşim + /uret 3 aşama akış (Faz 1.7 — Aziz acceptance 2. tur)

**Aziz preview'da gördükleri (28 Nis gece, 2. tur acceptance):** İki sayfa yapısal iyileştirme. LP-01~10 (anasayfa polish) Code'da çalışıyor → bu paket sonra alınır.

| ID | Başlık | Durum | Kabul Kriteri |
|---|---|---|---|
| LP-11 | /fiyatlar 2-kolon hibrit (Calculator + Paketler) | ✅ Tamam | Hero korunur. Yeni "PAKETLER + CALCULATOR" birleşik bölüm: desktop lg:grid-cols-2 gap-8, sol — KrediCalculator card (sticky lg:sticky top-24), sağ — 3 paket kart vertical grid. Mobile dikey istif: Calculator önce, paketler altta. Slider hareket edince önerilen paket border-2 border-rd-primary-700 highlight + smooth scroll-into-view. "Kredi nasıl çalışır" 4-mini bölümü KALDIRILABİLİR (paket bullet'lerinde zaten var) veya çok kompakt footer üstüne çekilir. SSS + CTA korunur. |
| LP-12 | /uret 3 aşama yapısal akış + görsel rehber | ✅ Tamam | Mevcut karmaşık akış (IntentBanner+Sekmeler+Platform+Foto+Form+Sticky) yeniden düzenlendi. Yeni: 3 numbered aşama kartı (warm-earth daire numara + dikey çizgi), her aşama kartı sırayla doldurulur, aşama tamamlanınca next'e smooth scroll. Üstte horizontal ProgressIndicator (1-2-3, tamamlanan CheckCircle2, aktif pulse). Fonksiyonalite KORUNUR (tüm tab hooks, auth, kredi). |

#### LP-11 + LP-12 Birleşik Prompt (Sayfa akış optimizasyonu)

```
ÖNEMLİ — KURAL OVERRIDE:
Bu görev `claude/redesign-modern-ui` branch'inde. CLAUDE.md UI 
kuralları GEÇERSİZ. BACKLOG-REDESIGN.md başındaki redesign branch 
kuralları geçerli (Manrope+Inter, rd-* token, Lucide ikon).

Branch: claude/redesign-modern-ui
Görev: LP-11 + LP-12 — /fiyatlar yerleşim + /uret 3 aşama yapısal akış 
(Aziz acceptance 2. tur).

Bu paket LP-01~10 (anasayfa polish) bittikten sonra alınır. İki sayfa 
ayrı dosya, paralel iş.

KAPSAM DIŞI:
- Backend değişikliği (auth, kredi, üretim hooks korunur)
- /yzstudio dokunulmaz (pattern referans için kullanılır, kopyalanmaz)
- Yeni primitive yaratma (mevcut yzstudio numbered daire pattern reuse)

────────────────────────────────────────────
LP-11: /fiyatlar 2-kolon hibrit yerleşim
────────────────────────────────────────────

Mevcut sayfa: app/fiyatlar/page.tsx
Mevcut sıra: Hero → Paketler → Kredi nasıl çalışır → Calculator → SSS → CTA

Yeni sıra:
1. Hero (kompakt, korunur)
2. **Paketler + Calculator birleşik bölüm** (yeni layout)
3. Kredi nasıl çalışır (KOMPAKT veya KALDIRILDI — Aziz preview'da karar verir)
4. SSS (korunur)
5. CTA (korunur)

**Birleşik bölüm yapısı:**

```jsx
<section className="px-4 sm:px-6 py-16">
  <div className="max-w-6xl mx-auto">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 
                    items-start">
      {/* SOL — Calculator (desktop sticky) */}
      <div className="lg:sticky lg:top-24 order-2 lg:order-1">
        <KrediCalculator onPaketOner={setOnerilenPaket} />
      </div>
      
      {/* SAĞ — 3 paket kart vertical */}
      <div className="space-y-4 order-1 lg:order-2">
        {PAKET_LISTESI.map((p) => (
          <PaketKart 
            paket={p} 
            highlighted={onerilenPaket === p.id}
            ref={highlighted ? scrollRef : null}
          />
        ))}
      </div>
    </div>
  </div>
</section>
```

**Önemli:**
- Mobile order: Calculator önce (order-2 lg:order-1), paketler sonra 
  (order-1 lg:order-2 — desktop tersine çevrilir; kullanıcı mobile'da 
  scroll ile önce calculator görür)
- Calculator state'i `onerilenPaketId` döner, parent state'e push eder
- Paket kart: `highlighted={paket.id === onerilenPaketId}` ile 
  border-2 border-rd-primary-700 + scale-[1.02] + scroll-into-view 
  (smooth)
- "En popüler" rozet (mevcut, 129 TL paketinde) korunur — ayrı bir 
  vurgu mekanizması (calculator önerisi geçici, popüler kalıcı)

**Calculator komponentinde değişiklik:**
- components/fiyatlar/KrediCalculator.tsx
- Mevcut slider 1-100 ürün korunur
- Yeni callback prop: onPaketOner(paketId: string) — slider değerine 
  göre uygun paket id'si döner
- Calculator card height kompakt (mobile için)

**"Kredi nasıl çalışır" 4-mini bölümü:**
- Mevcut: paketler altında, py-10
- Karar: KALDIRILDI (paket bullet'lerinde zaten her tip kredi açıklı), 
  veya çok kompakt — Aziz preview'da görür, gerekirse geri eklenir
- Şimdilik KALDIR, footer öncesi gerekirse geri eklenir

Commit: feat(fiyatlar): LP-11 2-kolon hibrit Calculator + Paketler

────────────────────────────────────────────
LP-12: /uret 3 aşama yapısal akış + görsel rehber
────────────────────────────────────────────

Mevcut sayfa: app/uret/page.tsx
Mevcut karmaşa: IntentBanner + Sekmeler + Platform select + Foto + 
Tab content + Sticky — kullanıcı "ne yapmam gerek?" anlamıyor.

Yeni yapı: 3 numbered aşama kartı (yzstudio pattern reuse).

**Sayfa düzeni:**

```jsx
<main>
  <SiteHeader />
  
  {/* Hero + ProgressIndicator (üstte yatay) */}
  <header className="max-w-5xl mx-auto pt-6 px-4">
    <div className="text-center mb-6">
      <p className="eyebrow">İÇERİK ÜRET</p>
      <h1 className="font-display text-3xl md:text-4xl">
        Ürününü tanıt, AI senin için yapsın
      </h1>
    </div>
    <ProgressIndicator step={currentStep} />  {/* 1-2-3 horizontal */}
  </header>

  {/* Mevcut auth/hata banner'ları */}
  {!kullanici && <AuthBanner />}
  {hata && <ErrorBanner />}
  
  {/* 3 aşama kartı dikey */}
  <div className="max-w-5xl mx-auto px-4 space-y-6">
    
    {/* AŞAMA 1 */}
    <StepCard number={1} title="Ne üreteceksin?" 
              completed={step1Done} active={currentStep === 1}>
      {/* İçerik tipi 4 büyük kart */}
      <ContentTypeGrid 
        active={anaSekme} 
        onChange={setAnaSekme} 
      />
      {/* Platform select */}
      <PlatformSelect value={platform} onChange={setPlatform} />
    </StepCard>
    
    {/* AŞAMA 2 */}
    <StepCard number={2} title="Ürünü tanıt" 
              completed={step2Done} active={currentStep === 2}>
      {/* Foto upload paylaşılan */}
      <FotoUpload fotolar={fotolar} setFotolar={setFotolar} />
      {/* Aktif sekmenin form alanları */}
      <TabContent activeTab={anaSekme} {...allHooks} />
      {/* BrandProfileBlock yan-akış (collapsible) */}
      <BrandProfileToggle />
    </StepCard>
    
    {/* AŞAMA 3 */}
    <StepCard number={3} title="Üret" 
              completed={step3Done} active={currentStep === 3}>
      {/* Maliyet özeti */}
      <CostSummary cost={cost} remaining={remainingCredits} />
      {/* Üret bilgisi (sticky bar zaten alttta) */}
      <p>Aşağıdaki "Üret" butonuna bas.</p>
    </StepCard>
    
  </div>
  
  {/* Sticky submit bar (mevcut, korunur) */}
  <StickySubmitBar ... />
  
  <SiteFooter />
</main>
```

**StepCard komponenti (yzstudio pattern reuse):**
```jsx
<section aria-labelledby={`step-${number}-title`}
         className={`relative pl-16 md:pl-20 pb-8 last:pb-0 
                     border-l-2 ${active ? 'border-rd-primary-200' : 'border-rd-neutral-200'}
                     last:border-transparent ml-6`}>
  {/* Sol başında dairesel numara */}
  <div className={`absolute -left-6 top-0 size-12 rounded-full 
                   ${completed ? 'bg-rd-success-700' : active ? 'bg-rd-warm-700' : 'bg-rd-neutral-300'}
                   text-white font-display text-xl font-medium 
                   flex items-center justify-center transition-all
                   ${active ? 'animate-pulse-soft scale-110' : ''}`}>
    {completed ? <CheckCircle2 size={24} /> : number}
  </div>
  
  <div className="space-y-4">
    <h2 id={`step-${number}-title`} 
        className="font-display text-xl md:text-2xl 
                   text-rd-neutral-900 font-medium">
      {number} · {title}
    </h2>
    {children}
  </div>
</section>
```

Mobile (375px): numbered daire size-10, pl-12, ml-5.

**ProgressIndicator (üstte yatay):**
```jsx
<div className="flex items-center justify-center gap-2 max-w-md mx-auto">
  {[1, 2, 3].map((step, i) => (
    <>
      <button onClick={() => scrollToStep(step)}
              className={`size-8 rounded-full flex items-center justify-center 
                          ${step < currentStep ? 'bg-rd-success-700 text-white' : 
                            step === currentStep ? 'bg-rd-primary-700 text-white' : 
                            'bg-rd-neutral-200 text-rd-neutral-500'}`}>
        {step < currentStep ? <Check size={14} /> : step}
      </button>
      {i < 2 && (
        <div className={`flex-1 h-0.5 ${step < currentStep ? 'bg-rd-success-700' : 'bg-rd-neutral-200'}`} />
      )}
    </>
  ))}
</div>
```

**Aşama tamamlanma kriterleri:**
- Step 1 done: anaSekme seçili + platform seçili (her ikisi default 
  değerlerinden farklı veya kullanıcı tıklamış olmalı)
- Step 2 done: foto VEYA form alanları min. doldurulmuş (sekmeye göre 
  değişir — örn. metin için urunAdi var, görsel için seciliStiller > 0)
- Step 3 done: cost <= remainingCredits + ctaState.canSubmit

**currentStep hesaplama (useState veya useMemo):**
```ts
const currentStep = useMemo(() => {
  if (!step1Done) return 1;
  if (!step2Done) return 2;
  return 3;
}, [step1Done, step2Done, step3Done]);
```

**Aşama tamamlanınca next'e scroll:**
```ts
useEffect(() => {
  if (step1Done && !prevStep1Done) {
    document.getElementById('step-2')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  // ...
}, [step1Done, step2Done]);
```

prefers-reduced-motion guard ile.

**ContentTypeGrid (Aşama 1 — 4 büyük kart):**
- IntentBanner + Sekmeler birleştirilir
- 4 kart: grid grid-cols-2 lg:grid-cols-4 gap-3
- Her kart: rounded-xl border, Lucide ikon size-8 + isim (font-medium) + 
  1 satır açıklama + kredi maliyet ipucu (text-xs)
- Aktif: border-2 border-rd-primary-700 + bg-rd-primary-50
- 4 tipler: Metin / Görsel / Video / Sosyal medya
- Tıklayınca anaSekme set + step1 progress check

**PlatformSelect:**
- Mevcut native select korunur (tek seçim, çok pratik) VEYA 
- ChipSelector pattern (single mode + 7 pazaryeri chip)
- Cowork önerisi: ChipSelector (görsel olarak daha güçlü, 7 pazaryeri 
  net görünür, native select boring). Ama mobile yatay scroll gerekir.
- Karar: ChipSelector single mode, mobile yatay scroll

**FotoUpload (Aşama 2):**
- Mevcut paylaşılan foto bloğu (satır 384-413) korunur ama büyütülür
- Tek bir büyük drop zone (min-h 200) — fotolar.length > 0 ise küçük 
  thumbnail + değiştir/kaldır

**BrandProfileToggle (Aşama 2 yan-akış):**
- Mevcut BrandProfileBlock collapsible şu an Aşama 2 üstünde
- Yeni yer: Aşama 2 içinde, foto+form altında — opsiyonel link 
  "Marka profilim ile özelleştir →" (Lucide Sparkles)
- Tıklayınca BrandProfileBlock açılır
- Kullanıcı bilinçli olarak isterse marka profili ekler

**BrandProfileBlock korunur (sadece konumu değişir).**

**Mevcut tab content (MetinSekmesi/GorselSekmesi/VideoSekmesi/
SosyalSekmesi):** İçerikleri AYNEN korunur, sadece StepCard 
wrapper'ının `<TabContent>` slot'una yerleştirilir. Tab hooks'ları 
(useMetinUretim vs) dokunulmaz.

**StickySubmitBar:** Korunur, alt sticky pozisyon.

**Auth banner / kredi düşük banner / hata banner:** Korunur, sayfa 
en üstünde.

────────────────────────────────────────────
Mobile + a11y polish
────────────────────────────────────────────

1. **Mobile (375px):**
   - StepCard pl-12 ml-5 (size-10 daire)
   - ProgressIndicator: 3 daire + 2 ince çizgi mobile'da uygun
   - ContentTypeGrid 2 cols (grid-cols-2)
   - PlatformSelect ChipSelector yatay scroll
   - Foto upload mobile compact

2. **A11y:**
   - ProgressIndicator: aria-label "İlerleme: 1/3"
   - Her StepCard: section role + aria-labelledby
   - Numbered daire aria-hidden (decorative)
   - Tamamlanan adım: aria-label "Adım 1 tamamlandı"
   - Aktif adım: aria-current="step"
   - ProgressIndicator buton: tıklanır + Tab focus + Enter/Space
   - prefers-reduced-motion guard (smooth scroll + pulse animation)

3. **Edge case'ler:**
   - Tüm 3 aşama tamam + sticky bar disabled (yetersiz kredi): tooltip 
     ile bilgi
   - Aşama 1 değişince Aşama 2 form reset gerekiyor mu? Hayır — 
     kullanıcı sekme değiştirince form'da kalan değer kaybolmasın 
     (mevcut davranış korunur)
   - Skeleton state: authYukleniyor sırasında ProgressIndicator gri

Commit özeti (atomik 4-5):
- feat(uret): LP-12 ProgressIndicator + StepCard primitive
- feat(uret): LP-12 Aşama 1 (içerik tipi grid + platform chip)
- feat(uret): LP-12 Aşama 2 (foto + form + brand toggle)
- feat(uret): LP-12 Aşama 3 (maliyet + sticky bar bağlantı)
- chore(uret): LP-12 mobile + a11y polish

VEYA tek: feat(uret): LP-12 3 aşama yapısal akış + numbered görsel 
rehber

────────────────────────────────────────────
Test
────────────────────────────────────────────

- npm run build temiz, TypeScript clean
- Localde:
  - /fiyatlar: 2-kolon Calculator + Paketler, slider değişince paket 
    highlight + scroll
  - /uret: 3 numbered aşama kartı, üstte ProgressIndicator
  - Aşama 1 tamamlanınca Aşama 2'ye smooth scroll
  - Aşama tamamlanma daire bg-success-700 + Check ikon
  - 375px mobile sıkıntısız
  - Klavye Tab full tour (ProgressIndicator + her aşama içeriği)
  - prefers-reduced-motion: smooth scroll devre dışı, animasyon yok

BACKLOG'da LP-11 + LP-12 [x] işaretle.

Bittikten sonra rapor:
- Commit listesi
- /fiyatlar layout kararı (2-kolon, "kredi nasıl çalışır" bölümü 
  kaldırıldı mı)
- /uret aşama tamamlanma kriterleri (her aşama için doneCheck logic)
- StepCard primitive'e taşıma kararı (yzstudio reuse mi, /uret kopyası mı)
- ContentTypeGrid + PlatformSelect ChipSelector kararı
- Açık riskler / Aziz preview test
```

**Aziz preview'da gördükleri (28 Nis gece, acceptance sırasında):** Anasayfada 10 ufak iyileştirme. Code-side redesign tamam ama bu polish maddeleri main'e merge'den ÖNCE halledilmeli.

| ID | Başlık | Durum | Kabul Kriteri |
|---|---|---|---|
| LP-01 | TrustStrip "Türkiye'de geliştirildi" → "E-ticaret için yapay zeka stüdyosu" | ✅ Tamam | lib/constants/hero.ts satır 11. "Türkiye'de geliştirildi" yerine veya yanına "E-ticaret için yapay zeka stüdyosu" — daha net pozisyonlama. Cowork önerisi: tek label değiştir (Türkiye'de geliştirildi → E-ticaret için yapay zeka stüdyosu) çünkü trust strip 3 öğeli, dengeli. |
| LP-02 | Hero subtitle "fotoğraf yükle" → "metin VEYA foto" | ✅ Tamam | components/sections/HeroBlock/HeroContent.tsx satır 47-51 + lib/constants/hero.ts HERO_COPY.sub. Yeni metin: "Ürününü anlat veya fotoğrafını yükle — listing metni, stüdyo görseli, tanıtım videosu ve sosyal medya içeriği dakikalar içinde hazır. Aylık abonelik yok." Vurgu: kullanıcı text de girebilir, sadece foto değil. |
| LP-03 | AppScreenshotMockup görsel revize (input → output net) | ✅ Tamam | components/sections/HeroBlock/AppScreenshotMockup.tsx. Mevcut görsel kullanıcının NE BEKLEDİĞİNİ göstermiyor. Yeni: ya gerçek bir input (foto veya metin) → 4 output kart (listing/görsel/video/sosyal) animatif geçiş, ya da before/after shots. Code mevcut mockup'ı oku, gerçek beklenti yansıtacak revizeye karar ver. |
| LP-04 | "Nasıl çalışır" video CTA pasife çek | ✅ Tamam | components/sections/HeroBlock/HeroContent.tsx satır 89-99 + VideoModal. Videomuz yok → secondary CTA buton GİZLE (yorum satırı veya display:none). VideoModal import'u ve setVideoOpen state'i de temizle. Sonradan video hazırlanınca açılır. |
| LP-05 | StepAnimation 3 adım netleştir | ✅ Tamam | components/landing/StepAnimation.tsx. **Adım 1 "Ürünü tanıt":** mevcut foto VEYA "Selin Porselen..." text — ikisi de görünür (foto+VEYA+text). **Adım 2 "Pazaryeri ve içerik seç":** 5 değil 7 pazaryeri (Trendyol/Hepsiburada/Amazon TR/Amazon USA/N11/Etsy + 1 daha kontrol et) + 4 içerik tipi tam set net. **Adım 3 "AI senin için hazırlasın":** **Cowork önerisi:** mevcut sparkle+bar yerine 4 mini çıktı kartı (listing başlık + görsel placeholder + video play ikonu + sosyal caption snippet) sırayla pop animasyonu — kullanıcı somut çıktıyı görür. |
| LP-06 | InfoStrip "4 içerik türü, 7 pazaryeri için" boş kutu içeriği | ✅ Tamam | components/landing/InfoStrip.tsx. Her sekme kartına (Metin/Görsel/Video/Sosyal) altına 1-2 satır mikro açıklama ekle: "Listing başlık + açıklama + arama etiketleri", "Stüdyo standardı 1200×1200, 6 görsel", "5 saniyelik dikey 9:16", "Instagram + TikTok + Pinterest caption". Boş kutu hissi gider. |
| LP-07 | "kr" kısaltma → "kredi" tam yaz | ✅ Tamam | Tüm site grep "kr" → "kredi". Etkilenen dosyalar: InfoStrip kart pill'leri, KrediCalculator, fiyatlar paket kartları, /uret kredi etiketleri, /yzstudio sticky bar, vs. Code grep ile bul, "1 kr" → "1 kredi", "2 kr" → "2 kredi" şeklinde. |
| LP-08 | MarkaBilgileriSection sağ şablon revize (gerçek çıktı) | ✅ Tamam | components/sections/MarkaBilgileriSection.tsx. Sağda "marka bilgilerini gir, sana özel içerik" örnek şablonu mevcut — Aziz: "gerçek şablon değil, revize". Yeni: gerçek bir AI üretim çıktısı (lib/data/exampleContent.ts'ten Selin Porselen veya benzeri gerçek metin) + şablon boyutları daha kompakt. |
| LP-09 | "Genel araçlarla aynı şey değil" kıyas tablosu kompakt + marka ismi YOK | ✅ Tamam | MarkaBilgileriSection altındaki kıyas tablosu. Marka ismi (ChatGPT, Claude, vs) ASLA yazılmaz — etik+yasal. "Genel AI araçları" / "Pazaryeri-özel olmayan AI'lar" gibi nötr ifade. Tablo kompakt: 3-4 satır max, gereksiz bullet sil, derli toplu. |
| LP-10 | MarkaBilgileri altı boşluk kontrolü | ✅ Tamam | Tablo bittikten sonra alt section ile arasında gereksiz padding/margin var mı kontrol. Layout sıkıştır gerekirse. py-16 → py-12 gibi. |

**Cowork tahmin:** "Ege" = "AI" ses-yazım hatası varsayımı. Yanlışsa Aziz düzeltir, Hero H1 zaten "E-ticaret içeriğini AI ile üret".

#### LP-01~LP-10 Birleşik Prompt (Anasayfa Polish — Faz 1.6)

```
ÖNEMLİ — KURAL OVERRIDE:
Bu görev `claude/redesign-modern-ui` branch'inde. CLAUDE.md UI 
kuralları GEÇERSİZ. BACKLOG-REDESIGN.md başındaki redesign branch 
kuralları geçerli (Manrope+Inter, rd-* token, Lucide ikon).

Branch: claude/redesign-modern-ui
Görev: LP-01~LP-10 — Anasayfa polish iterasyonu (Aziz acceptance 
bulguları). Main'e merge öncesi son tüning.

Anasayfa: app/_tanitim-redesign.tsx → TrustStrip + Nav + HeroSection 
+ StepSection + MarkaBilgileriSection + NedenYzlisteSection + 
SSSSection + FinalCTASection + FooterSection.

KAPSAM DIŞI:
- Yeni sayfa eklenmesi
- Backend değişikliği
- Faz 7 P2b backend ticket'ları (Paraşüt vs)

────────────────────────────────────────────
LP-01: TrustStrip metin güncelle
────────────────────────────────────────────

Dosya: lib/constants/hero.ts
Satır 11: `{ icon: 'Flag', label: "Türkiye'de geliştirildi" }` 
→ `{ icon: 'Sparkles', label: "E-ticaret için yapay zeka stüdyosu" }`

Sebep: pozisyonlama net olsun. "Türkiye'de geliştirildi" jenerik, 
yeni metin ne olduğumuzu söylüyor. Diğer 2 trust item (256-bit SSL + 
Saniyeler içinde üretim) korunur.

Commit: feat(landing): LP-01 trust strip pozisyonlama metni

────────────────────────────────────────────
LP-02: Hero subtitle metni güncelle
────────────────────────────────────────────

Dosya: lib/constants/hero.ts HERO_COPY.sub + HeroContent.tsx satır 
47-51 (kullanılıyor mu kontrol et — ya constants'tan ya inline).

Eski: "Ürün fotoğrafını yükle — listing metni, stüdyo görseli, 
tanıtım videosu ve sosyal medya içeriği dakikalar içinde hazır. 
Aylık abonelik yok."

Yeni: "Ürününü anlat veya fotoğrafını yükle — listing metni, 
stüdyo görseli, tanıtım videosu ve sosyal medya içeriği dakikalar 
içinde hazır. Aylık abonelik yok."

Vurgu: kullanıcı text de girebilir, sadece foto değil. /uret 
sayfasında zaten her ikisi de mevcut.

Commit: feat(landing): LP-02 hero subtitle metin/foto vurgusu

────────────────────────────────────────────
LP-03: AppScreenshotMockup görsel revize
────────────────────────────────────────────

Dosya: components/sections/HeroBlock/AppScreenshotMockup.tsx

Mevcut mockup ne göstermiyor: kullanıcının NE BEKLEDİĞİ. Aziz: "ne 
anlayacağını ne beklediğini gösterecek şekilde değiştirelim".

Yeni yaklaşım (Cowork önerisi):
- Sol: input bölümü (küçük foto thumbnail + "Selin Porselen Çiçek 
  Desenli Kahve Fincanı" text input)
- Ok ileri (Lucide ChevronRight)
- Sağ: 4 output kartı 2x2 grid:
  - Listing metni (kısa preview)
  - Görsel (placeholder thumbnail)
  - Video (Lucide PlayCircle)
  - Sosyal (Instagram caption snippet)
- Animatif geçiş: input → output kartlar sırayla pop

VEYA before/after format:
- Sol: "Önce" basit foto + minimal text
- Sağ: "Sonra" 4 platform için 4 farklı zenginleştirilmiş çıktı

Code mevcut mockup'ı oku, en uygun revizeye karar ver. lib/data/
exampleContent.ts'teki Selin Porselen örneği reuse edilebilir.

Commit: feat(landing): LP-03 hero mockup input→output net göster

────────────────────────────────────────────
LP-04: "Nasıl çalışır" video CTA pasife çek
────────────────────────────────────────────

Dosya: components/sections/HeroBlock/HeroContent.tsx satır 89-99 
(secondary CTA buton + VideoModal). lib/constants/hero.ts 
HERO_COPY.ctaSecondary.

Yapılacak:
- Secondary CTA buton (Play ikon + "Nasıl çalışır?") — JSX'i comment 
  out VEYA `{false && (...)}` ile gizle
- VideoModal import + dynamic import + setVideoOpen state — 
  KALDIRILABİLİR ama sonradan açılması kolay olsun diye comment out 
  daha iyi
- Primary CTA tek başına kalır (full width mobile, w-auto desktop)

Commit: chore(landing): LP-04 nasıl çalışır video CTA pasife çekildi 
(video hazırlanınca aç)

────────────────────────────────────────────
LP-05: StepAnimation 3 adım netleştir
────────────────────────────────────────────

Dosya: components/landing/StepAnimation.tsx

**Adım 1 "Ürünü tanıt":**
- Mevcut: kahve fincanı emoji veya Coffee ikon → VEYA → text
- Yeni doğrulama: foto thumbnail + "VEYA" + text input görsel olarak 
  ikisi de net ayırt edilebilir olmalı. Foto kısmı: Lucide ImagePlus 
  size-12 + "Fotoğraf yükle" altında. VEYA ayracı (text-rd-neutral-400 
  ortada). Text kısmı: Lucide PenLine + "Ürününü anlat" + Selin 
  Porselen örnek metin yazılır.

**Adım 2 "Pazaryeri ve içerik seç":**
- 5 pazaryeri chip → 7 pazaryeri (Trendyol / Hepsiburada / Amazon TR / 
  Amazon USA / N11 / Etsy + Çiçeksepeti veya benzeri 7. — Aziz onayı 
  veya mevcut listeyi koru)
- Önemli: lib/constants/pazaryeri.ts'te tam liste var, oradan dinamik 
  çek
- 4 içerik tipi tam set: Metin / Görsel / Video / Sosyal
- Animasyon: chip'ler stagger pop, ilk 3 pazaryeri + Metin+Görsel 
  pulse aktif olur

**Adım 3 "AI senin için hazırlasın":**
- Mevcut: Sparkles + 4 renkli bar + Download
- Yeni (Cowork önerisi): 4 mini çıktı kartı 2x2 grid sırayla pop:
  - Sol üst: Listing kart — başlık + 2 satır açıklama snippet
  - Sağ üst: Görsel kart — placeholder + Lucide ImageIcon
  - Sol alt: Video kart — placeholder + Lucide PlayCircle
  - Sağ alt: Sosyal kart — Instagram caption snippet
- Stagger animation (0.3s gecikme her kart)
- Sonunda Lucide Download + "İndir" buton pop

Commit: feat(landing): LP-05 step animation 3 adım net (foto+text + 
7 pazaryeri + 4 çıktı kart)

────────────────────────────────────────────
LP-06: InfoStrip kutu içerikleri
────────────────────────────────────────────

Dosya: components/landing/InfoStrip.tsx

4 sekme kartı (Metin/Görsel/Video/Sosyal) — her birinin altında 
mevcut: "1 kr · ~10sn" gibi minimum etiket. Aziz: "kutular çok boş, 
kısa açıklama gerekli".

Yeni — her kartın altında mikro açıklama satırı:
- Metin: "Listing başlık + açıklama + arama etiketleri"
- Görsel: "Stüdyo standardı 1200×1200, 6 görsel"
- Video: "5 saniyelik dikey 9:16"
- Sosyal: "Instagram + TikTok + Pinterest caption"

text-xs text-rd-neutral-500 leading-relaxed mt-1.

Commit: feat(landing): LP-06 InfoStrip kart açıklamaları

────────────────────────────────────────────
LP-07: "kr" → "kredi" tam yaz
────────────────────────────────────────────

Tüm site grep "kr" → "kredi". Etkilenen muhtemel dosyalar:
- components/landing/InfoStrip.tsx (kredi pill'leri)
- components/fiyatlar/KrediCalculator.tsx
- app/fiyatlar/page.tsx (3 paket kart)
- /uret kredi etiketleri (components/uret/* StickySubmitBar)
- /yzstudio sticky bar (components/yzstudio/StudioStickyBar)
- /hesap kredi sayıları
- lib/constants/* — kredi metin sabitleri

Pattern: "1 kr", "10 kr", "X kr" → "1 kredi", "10 kredi", "X kredi"
Dikkat: "kredi kartı" gibi compound kelimeler etkilenmesin (regex 
boundary).

Commit: chore: LP-07 "kr" kısaltma → "kredi" tam yazım

────────────────────────────────────────────
LP-08: MarkaBilgileri sağ şablon revize
────────────────────────────────────────────

Dosya: components/sections/MarkaBilgileriSection.tsx

Sağda "marka bilgilerini gir → sana özel içerik" şablonu var. Aziz: 
"gerçek şablon değil, revize".

Yeni:
- Şablon kompaktlaştır (max 3-4 satır görsel kart)
- İçerik: gerçek AI çıktısı kalitesinde — lib/data/exampleContent.ts 
  EXAMPLE_CONTENT.metin.trendyol.title + ilk 1-2 madde features kullan
- "Selin Porselen Çiçek Desenli Kahve Fincanı 6'lı Set" gibi gerçek 
  başlık + 2 madde bullet
- Görsel: warm-earth border + sticky kart hissi

Commit: feat(landing): LP-08 marka şablon gerçek AI çıktısı

────────────────────────────────────────────
LP-09: Kıyas tablosu kompakt + marka ismi YOK
────────────────────────────────────────────

Dosya: MarkaBilgileriSection altındaki "Genel araçlarla aynı şey 
değil" kıyas tablosu.

KRİTİK kural: ChatGPT / Claude / Gemini gibi rakip MARKA İSİMLERİ 
YAZMA. Etik + yasal risk. Nötr ifade kullan.

Yeni:
- Sol kolon: "Genel AI araçları" (veya "Pazaryeri-özel olmayan AI'lar")
- Sağ kolon: "yzliste"
- 3-4 satır max:
  - Listing/SEO kuralları → "Manuel ayarla" / "Otomatik 7 pazaryeri"
  - Görsel boyut/format → "Manuel ayarla" / "Pazaryeri standartı"
  - Marka tonu → "Her seferinde anlat" / "Bir kez ayarla, hatırlar"
  - Hız → "Saatler" / "Saniyeler"
- Tablo kompakt: rounded-xl border, padding p-4 (p-6 yerine), 
  satır arası space-y-2

Commit: feat(landing): LP-09 kıyas tablosu kompakt + marka ismi 
çıkarıldı

────────────────────────────────────────────
LP-10: MarkaBilgileri altı boşluk kontrolü
────────────────────────────────────────────

MarkaBilgileriSection ile bir sonraki section (NedenYzlisteSection) 
arasındaki boşluk doğru mu kontrol et:
- Section padding: py-16 md:py-20 standart
- Eğer çift padding (alt+üst) varsa azalt
- Görsel olarak Aziz preview'da kontrol eder

Commit: chore(landing): LP-10 spacing kontrol

────────────────────────────────────────────
Test
────────────────────────────────────────────

- npm run build temiz, TypeScript clean
- Localde:
  - TrustStrip metin "E-ticaret için yapay zeka stüdyosu"
  - Hero subtitle "Ürününü anlat veya fotoğrafını yükle"
  - Hero mockup yeni input→output göstergesi
  - Hero "Nasıl çalışır" buton GİZLİ
  - StepAnimation: foto+text + 7 pazaryeri + 4 çıktı kart
  - InfoStrip kartlarda mikro açıklama satırı
  - "kr" yok, "kredi" tam yazım
  - MarkaBilgileri sağ şablon gerçek içerik
  - Kıyas tablo kompakt + marka ismi yok
  - 375px mobile sıkıntısız

Commit özeti (10 atomik) VEYA tek:
chore(landing): LP-01~LP-10 anasayfa polish (Aziz acceptance bulguları)

BACKLOG'da LP-01~LP-10 [x] işaretle.

Bittikten sonra rapor:
- Commit listesi
- "kr" → "kredi" grep sonucu (kaç yerde değişti)
- AppScreenshotMockup revize yaklaşımı (4 kart 2x2 mı, before/after 
  mı, başka mı)
- StepAnimation Adım 3 yeni 4 kart animasyon kararı
- Açık riskler / Aziz preview test
```

---

## 21 — Polish-3: Anasayfa içerik + üret akış 2. iter (Faz 1.8 — Aziz acceptance 3. tur)

**Aziz preview test bulguları (28 Nis gece, 3. tur acceptance):** 10 madde — anasayfa içerik (basketbol topu asset reuse, FeaturesTabbed pattern InfoStrip'e uygula) + üret sayfa akış 2. iterasyon (Adım 2/3 yeniden ayır, default seçimsiz, marka profil hibrit rozet).

**Aziz kararları (28 Nis gece):**
- AppScreenshotMockup: gerçek basketbol topu asset'leri (public/ornek_*.{jpg,png} + hero-video.mp4 — zaten mevcut)
- A2 listing içerik: Trendyol + Amazon TR basketbol topu, Etsy el yapımı bakır cezve seti (Cowork yazdı)
- A6 InfoStrip detay panelleri: canlı FeaturesTabbed.tsx pattern reuse — bölmeler + Kopyala butonu + 3 platform sub-tab + alt info kutuları
- U2 marka profil: hibrit rozet (boşsa motivasyon, doluysa yeşil onay) — kart üstünde compact
- U5 Adım 2/3: ürün bilgisi (Adım 2) + içerik seçimi & üretim (Adım 3) ayrımı

| ID | Başlık | Durum | Kabul Kriteri |
|---|---|---|---|
| P3-A1 | AppScreenshotMockup metin + asset güncelleme | ✅ Tamam | "4 dosyayı indir" → "Üretilen içerikleri indir". Selin fincan placeholder → public/ornek_once.jpg (girdi) + 4 output kart: ornek_beyaz.jpg (görsel slot), Listing snippet (basketbol topu Trendyol başlığı + 1-2 satır), hero-video.mp4 thumbnail (video slot), sosyal caption snippet. |
| P3-A2 | StepAnimation kutu boyut + okunabilirlik + içerik | ✅ Tamam | 3 kart eşit yükseklik (flex-1 min-h-[X]). Text: text-xs → text-sm md:text-base. Pasif text-rd-neutral-500 (opacity-50 DEĞİL). 1. kart "Fotoğraf VE/VEYA kısa açıklama" (ImagePlus + "VEYA" + PenLine yan yana, ikonlar büyük). 2. kart: tek pazaryeri seçimi animasyonu (Trendyol pulse, diğer 6 pasif). 3. kart: 4 çıktı kart 2x2 grid (basketbol topu görselleri reuse — public/ornek_*). |
| P3-A3 | InfoStrip → FeaturesTabbed pattern (üretim çıktısı + Kopyala) | ✅ Tamam | components/landing/InfoStrip.tsx YERİNE components/tanitim/FeaturesTabbed.tsx pattern reuse — rd-* token'a çevir, _tanitim-redesign.tsx'e yerleştir. Yapı: 4 sekme (Listing/Görsel/Video/Sosyal — KUTULAR), her sekmede üst açıklama + 3 platform sub-tab (Listing için) + bölmeler (Başlık/Özellikler/Açıklama/Etiketler) + Kopyala butonları + alt info kutusu + CTA. Görsel sekmesi: 8'li grid (ornek_once + 7 stil). Video sekmesi: 6 video grid (canlıdaki /video-ornekler/*.mp4). Sosyal sekmesi: 4 platform tab + caption örneği. |
| P3-A4 | lib/data/exampleContent.ts + FeaturesTabbed metin güncelleme | ✅ Tamam | Trendyol + Amazon TR: basketbol topu (Cowork metinleri aşağıda). Etsy: el yapımı bakır cezve seti (Cowork metni aşağıda). Mevcut Selin Porselen verileri _archive/ veya kaldırılır. |
| P3-A5 | MarkaBilgileriSection güncel marka inputları + sağ şablon | ✅ Tamam | Sol metin: marka profili özelliklerini güncel alan setine göre revize (storeName + tone + audience + features + kategori + fiyat bandı + hizmet vurguları + extraInfo — 8 alan). Sağ şablon: basketbol topu için marka profili kullanılan AI çıktısı örneği (gerçek metin, lib/data/exampleContent.ts'ten çek). Kıyas tablosu kompakt (LP-09 zaten yapıldı, kontrol et). |
| P3-U1 | /uret 1. Adım default seçimsiz + ChipSelector görsel ağırlık | ✅ Tamam | anaSekme initial null (seçilmemiş), platform initial null. Kullanıcı aktif olarak seçmeden Adım 2 disabled. PlatformChips ChipSelector görsel ağırlığı içerik tipi 4 kartla aynı: text-sm + py-3 + size büyüt (mevcut text-xs küçük geliyor). step1Interacted true olur ancak kullanıcı hem içerik tipi hem platform seçtiğinde. |
| P3-U2 | /uret 2. Adım marka profil hibrit rozet | ✅ Tamam | Adım 2 kart üstünde compact rozet: Marka profili boşsa warning toned (rd-warm-50 + Lucide AlertCircle + "Marka profilini doldur, AI sana özel yazsın" + "Aç" link → /hesap/marka). Doluysa success toned (rd-success-50 + CheckCircle2 + "Marka profilim aktif" + "Düzenle" link). Rozet form içeriğine yapışık değil, üstte ayrı kart. |
| P3-U3 | /uret 2. Adım foto opsiyonel/zorunlu sekmeye göre | ✅ Tamam | Foto upload bölümü mevcut paylaşılan. Etiket dinamik: anaSekme="metin" veya "sosyal" → "Fotoğraf opsiyonel — ekle, sonucu iyileştirsin". anaSekme="gorsel" veya "video" → "Fotoğraf gerekli". Drop zone alt mikro metin değişir, sert ifade yok. |
| P3-U4 | Listing giriş tipi açıklayıcı + URL pre-fill fix (LP-12b) | ✅ Tamam | MetinSekmesi giris tipi (manuel/foto/barkod/excel) seçim chip'leri açıklayıcı: her chip altında 1 satır "Manuel yaz", "Fotoğraftan tara — barkod/etiket", "Barkod numarası gir", "Excel ile toplu" mikro açıklama. **LP-12b fix:** kullaniciyiKontrolEt fonksiyonuna `setStep1Interacted(true)` ekle (URL'den ?tab=gorsel ile gelen kullanıcı için). |
| P3-U5 | /uret Adım 2/3 yeniden ayır | ✅ Tamam | **Adım 2 (Ürün bilgisi):** foto + ürün adı + kategori + özellikler + hedef kitle + fiyat segmenti — sekmeden bağımsız genel ürün bilgisi. **Adım 3 (İçerik seçimi & üretim):** sekmeye göre özel + sticky bar bağlantısı: Metin sekmesinde sadece "Üret" + maliyet özet, Görsel: stiller + ek prompt, Video: süre + format + ek prompt, Sosyal: platform + ton + sezon. Tab hooks state'leri korunur, sadece UI placement değişir. |

**Cowork basketbol topu listing metni (P3-A4 için):**

**TRENDYOL:**
- Başlık: "Profesyonel Kompozit Deri Basketbol Topu 7 Numara FIBA Onaylı İç-Dış Saha Antrenman Maç Topu"
- Özellikler: (5 madde — FIBA Onaylı 7 Numara, Kompozit Deri Yüzey, 8 Panel Sıkı Dikiş, Kuru Pompa Hediye, 7 Yaş Üstü Kullanım — açıklamaları yukarıda)
- Açıklama: "Profesyonel basketbol antrenman ve maç deneyimi için tasarlanmış 7 numara FIBA standardı kompozit deri basketbol topu. Ter emici dokulu yüzey kaplaması her hava koşulunda yüksek tutuş sağlarken, 8 panel sıkı dikişli yapı uzun ömürlü kullanımı garanti eder. İç saha parke ve dış saha asfalt zeminlerde aynı performansı sergileyen top, okul takımları, gençlik ligi ve hobi sporcular için tam profesyonel histir. Hediye kuru-tip pompa ve iğne ile birlikte gönderilir — kutudan çıkar çıkmaz oyuna hazır."
- Etiketler: basketbol topu, 7 numara basketbol, FIBA onaylı top, kompozit deri basketbol, antrenman topu, maç topu, profesyonel basketbol, dış saha basketbol topu, iç saha basketbol topu, basketbol topu pompalı

**AMAZON TR:**
- Başlık: "Profesyonel Basketbol Topu 7 Numara | FIBA Onaylı Kompozit Deri Maç ve Antrenman Topu | İç-Dış Saha Kullanım | 8 Panel Sıkı Dikiş | Kuru Pompa Hediyeli | Okul Takımları için İdeal"
- Özellikler: A+ stili büyük harf vurgu (FIBA STANDARTI 7 NUMARA, HAVA KOŞULUNA DAYANIKLI YÜZEY, 8 PANEL HAVA SIZDIRMAZ, KUTUDA POMPA + İĞNE, GENİŞ KULLANIM ARALIĞI)
- Açıklama: Trendyol açıklaması + 1 paragraf "neden bu top, neden Amazon"
- Etiketler: Trendyol + long-tail varyantları

**ETSY (el yapımı bakır cezve seti):**
- Title: "Handmade Hammered Copper Turkish Coffee Pot Set — Cezve with 2 Porcelain Cups, Authentic Anatolian Craftsmanship, Wedding Gift"
- Highlights: Hand-Hammered Copper Cezve / Complete Set with 2 Cups / Tin-Lined Interior / Made in Turkey (Gaziantep workshop) / Includes Brewing Guide
- Description: "There's something quietly beautiful about copper that's been shaped by human hands. This Turkish coffee set — a hammered copper cezve paired with two delicate porcelain cups — comes from a tiny workshop in Gaziantep, where families have been hammering copper for more than a century. Every dent, every curve, every pattern is unique. It's the kind of piece that turns a five-minute coffee ritual into something you'll look forward to all day. Whether you're brewing for yourself or sharing with someone you love, this set arrives in a fitted gift box with a printed brewing guide."
- Tags: turkish coffee set, copper cezve, handmade copper pot, anatolian craftsmanship, hand hammered copper, turkish coffee gift, traditional coffee maker, gift for coffee lover, wedding gift set, housewarming gift, made in turkey, artisan home goods, copper kitchenware

#### P3-A1~P3-U5 Birleşik Prompt (Polish-3 — Faz 1.8)

```
ÖNEMLİ — KURAL OVERRIDE:
Bu görev `claude/redesign-modern-ui` branch'inde. CLAUDE.md UI 
kuralları GEÇERSİZ. BACKLOG-REDESIGN.md başındaki redesign branch 
kuralları geçerli (Manrope+Inter, rd-* token, Lucide ikon).

Branch: claude/redesign-modern-ui
Görev: P3-A1~P3-U5 — Polish-3 (Aziz acceptance 3. tur). 10 madde: 
anasayfa içerik + üret akış 2. iterasyon. Bu paket sonrası redesign 
toplu acceptance + main merge.

Mevcut canlı pattern: components/tanitim/FeaturesTabbed.tsx — Aziz 
beğendiği üretim çıktısı tarzı (4 sekme + bölmeler + Kopyala 
butonları). InfoStrip.tsx YERİNE bu yapı redesign rd-* tokenıyla 
yeniden yazılacak.

Mevcut asset'ler:
- public/ornek_once.jpg (basketbol topu ham fotoğraf)
- public/ornek_{beyaz,koyu,lifestyle,mermer,ahsap,gradient,dogal}.{jpg,png}
- public/hero-video.mp4 (basketbol topu tanıtım videosu)
- public/video-ornekler/*.mp4 (6 hareket stili — kontrol et, varsa 
  reuse)

Reuse: components/tanitim/FeaturesTabbed.tsx pattern (yapı + 
mantık), rd-* token'a çevirip yeni component yarat: 
components/landing/RDFeaturesTabbed.tsx (veya InfoStrip yeniden 
yaz). Mevcut FeaturesTabbed.tsx canlı landing için korunur 
(_tanitim.tsx'ten import edilebilir, eğer hâlâ kullanılıyorsa).

KAPSAM DIŞI:
- /uret backend hooks (tab hooks, auth, kredi — değişmez)
- Canlı FeaturesTabbed.tsx silme (sadece redesign'a kopya/adapt)

────────────────────────────────────────────
P3-A1: AppScreenshotMockup
────────────────────────────────────────────

Dosya: components/sections/HeroBlock/AppScreenshotMockup.tsx

1. Metin: "4 dosyayı indir" → "Üretilen içerikleri indir"

2. Asset güncelleme:
   - Input thumbnail: /ornek_once.jpg (basketbol topu)
   - Listing snippet: basketbol topu Trendyol başlığı + 1-2 satır 
     özet (lib/data/exampleContent.ts'ten çek — P3-A4 sonrası)
   - Görsel: /ornek_beyaz.jpg veya /ornek_lifestyle.jpg
   - Video: hero-video.mp4 ilk frame thumbnail VEYA Lucide 
     PlayCircle + "Tanıtım videosu" placeholder
   - Sosyal: caption snippet (Instagram tarzı kısa metin)

3. Layout korunur (Code önceki LP-03'te dikey akış seçti — devam et)

Commit: feat(landing): P3-A1 AppScreenshotMockup metin + basketbol 
topu asset

────────────────────────────────────────────
P3-A2: StepAnimation kutu boyut + okunabilirlik
────────────────────────────────────────────

Dosya: components/landing/StepAnimation.tsx

1. **Eşit kutu yüksekliği:**
   - 3 kart container: grid-cols-3 + items-stretch (zaten varsa OK)
   - Her kart: flex-1 + min-h-[400px] (veya en uzun kartı baz al)
   - İçerik dikey: justify-between (üst ikon, orta animasyon, alt 
     etiket)

2. **Text okunabilirlik:**
   - Pasif kart: opacity-50 KALDIR. Yerine: text-rd-neutral-500 
     (gri ama okunabilir)
   - Aktif kart: text-rd-neutral-900 + animation
   - Kart text size: text-xs → text-sm md:text-base (en azından 
     adım başlığı)

3. **1. kart "Ürünü tanıt" yeni içerik:**
   - Başlık: "Fotoğraf ver VE/VEYA kısa açıklama yaz"
   - Görsel: ImagePlus size-12 + "VEYA" text + PenLine size-12 yan 
     yana (3 öğe horizontal flex)
   - Animasyon: ImagePlus pop → "VEYA" fade → PenLine pop → text 
     yazılır ("Profesyonel basketbol topu...")

4. **2. kart "Pazaryeri ve içerik seç" tek pazaryeri:**
   - Mevcut 5 pazaryeri stagger korunur AMA pulse aktivasyonu 
     SADECE Trendyol'da
   - Diğer 6 pazaryeri pasif (border, no fill)
   - İçerik tipi: 4 chip stagger, hepsi aktif (Metin/Görsel/Video/
     Sosyal — kullanıcı hepsini seçebilir mantığı)
   - Mantık: "Tek pazaryeri (Trendyol) seçildi" + "4 içerik tipinin 
     hepsi mümkün"

5. **3. kart "AI senin için hazırlasın" gerçek görseller:**
   - 4 çıktı kart 2x2 grid (LP-05'te zaten yapıldı, kontrol et)
   - Görseller basketbol topu reuse: ornek_beyaz.jpg / ornek_koyu.jpg 
     görsel slot'lara, hero-video.mp4 thumbnail video slot'una
   - Listing snippet basketbol topu Trendyol başlığı

Commit: feat(landing): P3-A2 StepAnimation eşit kutu + okunabilir 
text + basketbol içerik

────────────────────────────────────────────
P3-A3: InfoStrip → FeaturesTabbed pattern
────────────────────────────────────────────

components/landing/InfoStrip.tsx YERİNE components/tanitim/
FeaturesTabbed.tsx pattern reuse. Yeni component: 
components/landing/RDFeaturesTabbed.tsx (rd-* token'larıyla).

**Yapı:**

1. **4 sekme kart üst (KUTULAR — canlıdaki gibi):**
   - Listing Metni / Görsel / Video / Sosyal Medya
   - Her kart: Lucide ikon + başlık + açıklama + kredi pill
   - Aktif kart border-rd-primary-700 + bg-rd-primary-50, alt border 
     yok (içeri açılmış görünür)

2. **Tab content alanı (aktif sekmeye göre):**

   **Listing sekmesi (sekme 0):**
   - Üst açıklama: "Her pazaryerinin kendine özel karakter limiti, 
     format kuralları ve yasaklı kelimeleri var. yzliste bunları 
     bilir — platforma özel başlık, madde madde özellikler, SEO 
     uyumlu açıklama ve arama etiketleri üretir."
   - 3 platform sub-tab: Trendyol (orange), Amazon (amazon orange), 
     Etsy (rose)
   - Her platformda 4 bölme:
     - Başlık (Tag ikon + Kopyala buton)
     - Özellikler (Bullet ikon + Kopyala)
     - Açıklama (FileText ikon + Kopyala)
     - Etiketler (Hash ikon + Kopyala)
   - Bölme stili: rounded-xl border-l-4 (renkli) + border + 
     bg-rd-neutral-50 + p-4
   - Kopyala buton: text-xs bg-white border + onClick clipboard + 
     Toast "Kopyalandı"
   - Alt info bant: "Manuel girişi · Foto analiz · Barkod tanıma · 
     7 platform" (4 öğe Check ikon)
   - Alt mavi info kutusu: "Her pazaryerinin kuralları farklı: 
     Trendyol max 100 karakter başlık ister, Amazon 200'e kadar 
     keyword kabul eder, Etsy İngilizce + hikaye anlatımı sever."
   - CTA: "Listing metni üret →" /uret?tab=metin

   **Görsel sekmesi (sekme 1):**
   - Üst açıklama: "Tek bir ürün fotoğrafından profesyonel stüdyo 
     görselleri oluşturun. Arka plan otomatik temizlenir, 7 farklı 
     stüdyo stilinden seçin — ya da sahnenizi anlatın, kendi 
     fonunuzu yükleyin."
   - "Tek fotoğraftan 7 farklı stüdyo stili" başlık
   - "Stil başına 1 kredi · Üretimde düşer, indirme bedava" alt
   - 8 grid (4 col × 2 row): Ham fotoğraf (ornek_once.jpg + "Ham 
     fotoğraf" badge) + 7 stil (Beyaz zemin, Koyu zemin, Lifestyle, 
     Mermer, Ahşap, Gradient, Doğal) — public/ornek_*.jpg/png reuse
   - Alt: "3 farklı yöntemle sahne oluştur" 3 chip (Hazır stiller, 
     Kendi promptun, Arka plan fotoğrafı ver)
   - CTA: "Stüdyo görseli üret →" /uret?tab=gorsel

   **Video sekmesi (sekme 2):**
   - Üst açıklama: "Ürün fotoğrafınızdan AI ile tanıtım videosu 
     oluşturun. 6 ön tanımlı hareket stilinden seçin ya da kendi 
     yönetmenliğinizi yapın — Reels, TikTok, YouTube ve pazaryeri 
     formatlarında."
   - 6 video grid (2 col): 360° Dönüş, Zoom yaklaşım, Dramatik ışık, 
     Doğal ortam, Detay tarama, Kumaş hareketi
   - Her video kart: video element (autoplay loop muted) + 
     başlık + açıklama
   - Asset: public/video-ornekler/*.mp4 (varsa reuse)
   - 3 format kart (5sn 10kr / 10sn 20kr / 3 format)
   - "Nasıl çalışır?" 4 step
   - CTA: "Ürün videosu üret →" /uret?tab=video

   **Sosyal sekmesi (sekme 3):**
   - Üst açıklama: "Her platform için ayrı formatta caption ve 
     hashtag seti üretin. Instagram, TikTok, Facebook ve X — hepsi 
     tek tıkla."
   - 4 platform tab (Instagram/TikTok/Facebook/Twitter)
   - Her platform için caption + hashtag örneği (Cowork bakır 
     cezve veya basketbol topu için 4 platforma metin yazar — 
     Code talimat alır lib/data'dan)
   - CTA: "Sosyal içerik üret →" /uret?tab=sosyal

3. **rd-* token'a çevrim:**
   - #1E4DD8 → rd-primary-700
   - #163B9E → rd-primary-800
   - #F0F4FB → rd-primary-50
   - #BAC9EB → rd-primary-200
   - #FAFAF8 → rd-neutral-50
   - #F1F0EB → rd-neutral-100
   - #D8D6CE → rd-neutral-200
   - #908E86 → rd-neutral-500
   - #5A5852 → rd-neutral-600
   - #1A1A17 → rd-neutral-900
   - #0F5132 → rd-success-700
   - Trendyol orange-500, Amazon #E47911, Etsy rose-500 KORUNUR 
     (platform brand renkleri)

4. **_tanitim-redesign.tsx'te InfoStrip yerine RDFeaturesTabbed:**
   - StepSection altında veya StepSection içinde (mevcut yapıya göre)
   - Eski InfoStrip.tsx _archive/ veya silinir

Commit: feat(landing): P3-A3 RDFeaturesTabbed (canlı pattern reuse 
+ rd-* token + 4 sekme detay paneli)

────────────────────────────────────────────
P3-A4: lib/data/exampleContent.ts + içerik metinleri
────────────────────────────────────────────

Dosya: lib/data/exampleContent.ts (ve gerekirse FeaturesTabbed 
veya RDFeaturesTabbed içine inline)

Yeni içerik (yukarıdaki Cowork metinleri):

```ts
export const EXAMPLE_PRODUCT_TR = {
  brand: 'yzliste örnek',
  name: 'Profesyonel Basketbol Topu 7 Numara',
  category: 'Spor & Outdoor',
} as const;

export const EXAMPLE_CONTENT_TR = {
  metin: {
    trendyol: {
      title: 'Profesyonel Kompozit Deri Basketbol Topu 7 Numara FIBA Onaylı İç-Dış Saha Antrenman Maç Topu',
      features: [
        'FIBA Onaylı Resmi Boyut — 7 numara, 75-78 cm çevre, 567-650 g ağırlık, profesyonel maç standartı',
        'Kompozit Deri Yüzey — Yüksek tutuş, ter emici dokulu kaplama; iç-dış saha kullanımına uygun',
        '8 Panel Sıkı Dikiş — Hava sızdırmaz iç tüp, uzun ömürlü performans, basınç stabilizasyonu',
        'Kuru Pompa Hediye — Set içinde kuru-tip pompa ve iğne; satın alır almaz kullanıma hazır',
        '7 Yaş Üstü Kullanıma Uygun — Antrenman, okul takımları, yarı-profesyonel ve hobi kullanım için ideal',
      ],
      description: 'Profesyonel basketbol antrenman ve maç deneyimi için tasarlanmış 7 numara FIBA standardı kompozit deri basketbol topu. Ter emici dokulu yüzey kaplaması her hava koşulunda yüksek tutuş sağlarken, 8 panel sıkı dikişli yapı uzun ömürlü kullanımı garanti eder. İç saha parke ve dış saha asfalt zeminlerde aynı performansı sergileyen top, okul takımları, gençlik ligi ve hobi sporcular için tam profesyonel histir. Hediye kuru-tip pompa ve iğne ile birlikte gönderilir — kutudan çıkar çıkmaz oyuna hazır.',
      tags: ['basketbol topu', '7 numara basketbol', 'FIBA onaylı top', 'kompozit deri basketbol', 'antrenman topu', 'maç topu', 'profesyonel basketbol', 'dış saha basketbol topu', 'iç saha basketbol topu', 'basketbol topu pompalı'],
    },
    amazon: { /* Aynı yapı, Amazon TR uzun başlık + A+ stil özellikler */ },
  },
};

export const EXAMPLE_CONTENT_ETSY = {
  product: 'Handmade Hammered Copper Turkish Coffee Pot Set',
  metin: {
    title: 'Handmade Hammered Copper Turkish Coffee Pot Set — Cezve with 2 Porcelain Cups, Authentic Anatolian Craftsmanship, Wedding Gift',
    highlights: [/* 5 madde, yukarıdaki Cowork önerisi */],
    description: '...',  // yukarıdaki uzun storytelling
    tags: [/* 13 tag */],
  },
};
```

components/tanitim/FeaturesTabbed.tsx (canlı) ve components/landing/
RDFeaturesTabbed.tsx (redesign) bu data'dan beslenir. Inline 
hard-coded metin temizlenir.

Commit: feat(data): P3-A4 exampleContent.ts basketbol topu + bakır 
cezve (Trendyol/Amazon TR/Etsy)

────────────────────────────────────────────
P3-A5: MarkaBilgileriSection güncel + sağ şablon
────────────────────────────────────────────

Dosya: components/sections/MarkaBilgileriSection.tsx

1. **Sol metin güncel:** marka profili 8 alan setine göre revize.
   - Eski: "marka adı + ton + hedef kitle + özellikler" 
   - Yeni: 8 alan listesi (storeName + tone + audience + features + 
     kategori + fiyat bandı + hizmet vurguları + extraInfo)
   - Mikro açıklama her alan için (tooltip veya alt metin)

2. **Sağ şablon basketbol topu çıktısı:**
   - lib/data/exampleContent.ts EXAMPLE_CONTENT_TR.metin.trendyol'dan 
     başlık + 2 özellik bullet + tag chip row çek
   - Şablon kompakt rounded-xl border + p-5 (LP-08'den daha sade)
   - Üstte eyebrow "MARKA İLE ÜRETİLEN" (warm-earth tone)

3. **Kıyas tablosu:** LP-09'da yapıldı, kontrol et — marka ismi 
   yok + kompakt durmuyor mu?

Commit: feat(landing): P3-A5 MarkaBilgileri 8 alan + basketbol sağ 
şablon

────────────────────────────────────────────
P3-U1: /uret 1. Adım default seçimsiz
────────────────────────────────────────────

Dosya: app/uret/page.tsx

1. anaSekme initial: `useState<AnaSekme | null>(null)` (önceden 
   "metin" idi — null yap)
2. platform initial: `useState<string | null>(null)` (önceden 
   "trendyol" idi)
3. Adım 1 ContentTypeGrid: anaSekme === null → hiçbir kart aktif 
   değil
4. PlatformChips: platform === null → hiçbir chip aktif değil
5. step1Interacted: anaSekme !== null AND platform !== null
6. Adım 2 disabled: !step1Interacted → opacity-50 pointer-events-none
7. **PlatformChips görsel ağırlık (ChipSelector size büyüt):**
   - Mevcut text-xs px-3 py-1.5 → text-sm px-4 py-3
   - 7 chip (Trendyol/Hepsiburada/Amazon TR/Amazon USA/N11/Etsy/
     Çiçeksepeti — eğer 7 ise)
   - Mobile yatay scroll (overflow-x-auto)
   - Aktif: bg-rd-primary-50 + border-2 + text-rd-primary-700 + 
     font-medium
8. Tab hooks (useMetinUretim vs) initial state'leri etkilenmez 
   (URL'den ?tab= varsa P3-U4 fix devreye girer)

Commit: feat(uret): P3-U1 default seçimsiz + ChipSelector görsel 
ağırlık

────────────────────────────────────────────
P3-U2: /uret 2. Adım marka profili hibrit rozet
────────────────────────────────────────────

Dosya: app/uret/page.tsx StepCard 2

1. Marka profili durum check: kullanici.marka_adi var mı?
   - markaProfilDolu = !!(kullanici?.marka_adi && kullanici?.ton)
2. StepCard 2 üstünde rozet (form içeriğinden ayrı):
   ```jsx
   <div className={`rounded-xl border p-3 mb-4 flex items-center 
                    justify-between gap-3 ${
     markaProfilDolu ? 'bg-rd-success-50 border-rd-success-200' :
                       'bg-rd-warm-50 border-rd-warm-200'
   }`}>
     <div className="flex items-center gap-2">
       {markaProfilDolu ? <CheckCircle2 size-4 text-rd-success-700 /> 
                         : <AlertCircle size-4 text-rd-warm-700 />}
       <p className="text-sm">
         {markaProfilDolu 
           ? `Marka profilim aktif — AI senin tarzında yazacak`
           : `Marka profilini doldur, AI sana özel yazsın`}
       </p>
     </div>
     <Link href="/hesap/marka" className="text-sm font-medium 
                                          underline">
       {markaProfilDolu ? 'Düzenle' : 'Aç'}
     </Link>
   </div>
   ```
3. Mevcut BrandProfileBlock collapsible yan-akış: KALDIRILABİLİR 
   (yeni rozet yeterli, kullanıcı /hesap/marka'ya direkt gider). 
   Veya küçük "Hızlı düzenle" toggle olarak kalır — Code karar.

Commit: feat(uret): P3-U2 marka profili hibrit rozet

────────────────────────────────────────────
P3-U3: /uret foto opsiyonel/zorunlu sekmeye göre
────────────────────────────────────────────

Dosya: app/uret/page.tsx foto upload bölümü (paylaşılan 
fotolar[0] kontrolü)

Etiket dinamik:
```ts
const fotoEtiketi = anaSekme === 'metin' || anaSekme === 'sosyal'
  ? 'Fotoğraf opsiyonel — ekle, sonucu iyileştirsin'
  : 'Fotoğraf gerekli';
```

Drop zone empty state'te bu etiket gösterilir. Sert ifade yok 
(zorunlu büyük harf YASAK kelimesi yok), sade bilgilendirme.

Commit: feat(uret): P3-U3 foto opsiyonel/zorunlu sekmeye göre 
dinamik etiket

────────────────────────────────────────────
P3-U4: Listing giriş tipi açıklayıcı + LP-12b URL fix
────────────────────────────────────────────

1. **MetinSekmesi giriş tipi chip'leri açıklayıcı:**
   - Mevcut chip etiketleri: muhtemelen "Manuel", "Foto", "Barkod", 
     "Excel"
   - Yeni etiketler:
     - "Manuel yaz" — Lucide PenLine + "Ürün adını ve özellikleri 
       sen yaz"
     - "Fotoğraftan tara" — Lucide Camera + "Foto yükle, AI ürünü 
       tanır"
     - "Barkod ile bul" — Lucide Barcode + "Barkod numarasını gir"
     - "Excel ile toplu" — Lucide FileSpreadsheet + "Excel yükle, 
       toplu üret"
   - Her chip alt-mikro: text-xs text-rd-neutral-500
   - Aktif chip: bg-rd-primary-50 border-rd-primary-700

2. **LP-12b URL pre-fill fix:**
   - Dosya: app/uret/page.tsx kullaniciyiKontrolEt fonksiyonu
   - Mevcut: tabParam varsa setAnaSekme(tabParam)
   - Eklenecek: setStep1Interacted(true) (URL'den gelirse step1 
     yapılmış sayılır)
   - Ayrıca platform set ediliyorsa step1 tam, etmiyorsa platform 
     hâlâ null → kullanıcı platform seçtiğinde step1Interacted 
     etkilenir

Commit: feat(uret): P3-U4 listing giriş tipi açıklayıcı + URL 
pre-fill fix

────────────────────────────────────────────
P3-U5: /uret Adım 2 / Adım 3 yeniden ayır
────────────────────────────────────────────

Mevcut yapı: Adım 2 = foto + tüm form, Adım 3 = maliyet özet.
Aziz kararı: Adım 2 = ürün bilgisi (genel), Adım 3 = içerik seçimi 
+ üret.

**Adım 2 — Ürün bilgisi (sekmeden bağımsız):**
- Foto upload (paylaşılan)
- Ürün adı (urunAdi)
- Kategori (kategori)
- Özellikler (ozellikler)
- Hedef kitle (hedefKitle — sadece Metin sekmesinde mevcut, ama 
  Adım 2'de göster, opsiyonel)
- Fiyat segmenti (fiyatSegmenti — aynı)

**Adım 3 — İçerik seçimi & üretim (sekmeye göre):**
- **Metin:** sadece "Üret" maliyet özet kart (özel seçim yok, 
  Adım 2'deki ürün bilgisi yeterli)
- **Görsel:** Stiller (seciliStiller multi) + ek prompt 
  (gorselEkPrompt) + referans görsel
- **Video:** Süre (5/10sn) + format (9:16/1:1/16:9) + ek prompt
- **Sosyal:** Platform (Instagram/TikTok/Facebook/X) + ton + 
  sezon + içerik tipi + ek bilgi

Code refactor: MetinSekmesi/GorselSekmesi/VideoSekmesi/
SosyalSekmesi içeriklerini iki bölüme ayır:
- Üst yarı: Adım 2 slot'una (ortak ürün bilgisi)
- Alt yarı: Adım 3 slot'una (sekmeye özel seçimler)

Tab hooks state'leri DOKUNULMAZ — sadece JSX placement ayrılır. 
useMetinUretim vs hook'lar olduğu gibi kalır.

Karmaşıklık: her sekmenin alanları farklı yere taşınmalı. Code 
mevcut sekme component'lerini iki props ile böl: 
`<MetinSekmesi step={2|3} ...rest>` veya iki ayrı component:
`<MetinUrunBilgisi>` + `<MetinIcerikSecimi>` ayrımı.

**Önerim:** sub-component ayırma (her sekme component'i kendisini 
2 sub'a böl). Daha temiz.

Commit: feat(uret): P3-U5 Adım 2/3 yeniden ayrım (ürün bilgisi vs 
içerik seçimi)

────────────────────────────────────────────
Mobile + a11y polish (her ticket içinde)
────────────────────────────────────────────

Her ticket'ta:
- 375px viewport test
- ARIA: role="region" / aria-labelledby / aria-expanded
- Klavye Tab tour
- prefers-reduced-motion guard

────────────────────────────────────────────
Test
────────────────────────────────────────────

- npm run build temiz, TypeScript clean
- Localde:
  - / : "Üretilen içerikleri indir" + basketbol topu mockup
  - / StepAnimation: 3 kart eşit, text okunaklı, basketbol topu 
    görseller
  - / RDFeaturesTabbed: 4 sekme, üretim çıktısı + Kopyala butonları, 
    basketbol topu (Trendyol/Amazon) + bakır cezve (Etsy)
  - / MarkaBilgileri: 8 alan + basketbol sağ şablon
  - /uret: default seçimsiz, ChipSelector görsel ağırlık eşit
  - /uret Adım 2: marka profili hibrit rozet (boş/dolu)
  - /uret Adım 2: foto opsiyonel etiketi sekmeye göre
  - /uret listing giriş tipi açıklayıcı chip'ler
  - /uret?tab=gorsel URL pre-fill (step1Interacted=true)
  - /uret Adım 2 = ürün bilgisi, Adım 3 = içerik seçimi + Üret
  - 375px mobile, klavye Tab tour, reduced-motion

Commit özeti (10 atomik) VEYA tek:
chore(redesign): P3-A1~P3-U5 polish-3 (Aziz acceptance 3. tur)

BACKLOG'da P3-A1~P3-U5 [x] işaretle.

Bittikten sonra rapor:
- Commit listesi
- RDFeaturesTabbed komponenti (yeni mi, FeaturesTabbed kopya/adapt 
  mi)
- exampleContent.ts yapısı
- /uret Adım 2/3 ayrımı (sub-component mi prop tabanlı mı)
- BrandProfileBlock akıbeti (rozetle yer değişti mi, kalktı mı)
- Açık riskler / Aziz preview test
```

---

## 22 — Polish-4: Anasayfa içerik refinement (Faz 1.9 — Aziz acceptance 4. tur)

**Aziz preview test bulguları (29 Nis):** P3 sonrası 3 madde — anasayfa içerik refinement. RDFeaturesTabbed yeni tasarım yerine canlı FeaturesTabbed tasarımına dön + MarkaBilgileri ürün değiştir + boş video kutuları doldur.

| ID | Başlık | Durum | Kabul Kriteri |
|---|---|---|---|
| P4-A1 | RDFeaturesTabbed → canlı FeaturesTabbed tasarımına dön | ✅ Tamamlandı | Code P3-A3'te yeni layout uyguladı — Aziz canlı FeaturesTabbed.tsx tasarımını istedi (sadece içerik değişecekti). Çözüm: components/landing/RDFeaturesTabbed.tsx'i components/tanitim/FeaturesTabbed.tsx tasarımı **birebir** kopya, sadece (a) rd-* token'a swap (b) içerik basketbol+cezve (P3-A4 ile zaten yapıldı). Yeni-yorum tasarım YOK — canlı yapı bire bir. |
| P4-A2 | MarkaBilgileri ürün → bakır cezve seti (marka etkisi belirgin) | ✅ Tamamlandı | Mevcut basketbol topu örneği marka profili etkisini göstermiyor (teknik ürün). Cowork önerisi: bakır cezve seti — Etsy listing zaten yazıldı (Anatolian craftsmanship hikayesi), Türkçe versiyonu MarkaBilgileri sağ şablona yazılır. Marka boş vs marka dolu kıyas çok belirgin: "Bakır cezve, 250ml" vs "Anadolu'nun yüz yıllık bakırcılığı...". |
| P4-A3 | Boş video kutuları → zoom-yaklasim.mp4 hızlandırılmış | ✅ Tamamlandı | RDFeaturesTabbed video sekmesinde 6 hareket stili kart var ama bazıları boş (asset yok). Tüm 6 kutuya `/video-ornekler/zoom-yaklasim.mp4` koy. JS ile `videoRef.current.playbackRate = 2.0` ile hızlandır (CSS değil, HTML5 video API). useEffect'te ref attach + playbackRate set. |

**Cowork MarkaBilgileri Türkçe metni (P4-A2 için):**

**Marka boş (sade ürün açıklaması):**
> Bakır cezve, 250ml, 2 fincan dahil. Türk kahvesine uygun.

**Marka dolu** (storeName: "Anadolu Bakır", ton: premium, kategori: Ev & Yaşam, hedef kitle: Türk kahvesi sevenler, hizmet vurguları: el dövme + hediye paketi):
> Anadolu'nun yüz yıllık bakırcılığını mutfağına taşı. Anadolu Bakır'ın Gaziantep'te dövülmüş cezvesi, sabah kahvesi ritüelini sanat eserine dönüştürür. Hediye kutusunda, kullanım rehberi ile birlikte.

#### P4-A1~P4-A3 Birleşik Prompt (Polish-4 — Faz 1.9)

```
ÖNEMLİ — KURAL OVERRIDE:
Bu görev `claude/redesign-modern-ui` branch'inde. CLAUDE.md UI 
kuralları GEÇERSİZ. BACKLOG-REDESIGN.md başındaki redesign branch 
kuralları geçerli (Manrope+Inter, rd-* token, Lucide ikon).

Branch: claude/redesign-modern-ui
Görev: P4-A1~P4-A3 — Polish-4 (Aziz acceptance 4. tur). 3 madde, 
anasayfa içerik refinement. Bu paket sonrası tekrar preview test → 
main merge.

Mevcut sayfalar:
- components/landing/RDFeaturesTabbed.tsx (P3-A3'te yapıldı, 
  yeniden çalışacak)
- components/sections/MarkaBilgileriSection.tsx (P3-A5'te güncel)
- components/tanitim/FeaturesTabbed.tsx (canlı pattern referansı)

KAPSAM DIŞI:
- RDFeaturesTabbed yeniden yarat değil — canlı FeaturesTabbed 
  birebir kopya (sadece rd-* swap)
- /uret sayfası dokunulmaz
- Backend yok

────────────────────────────────────────────
P4-A1: RDFeaturesTabbed → canlı FeaturesTabbed tasarımına dön
────────────────────────────────────────────

**Önemli:** Code P3-A3'te yeni layout uyguladı, Aziz canlı pattern'i 
istedi. Bu kez **birebir kopya** + sadece rd-* token swap.

Adımlar:

1. components/tanitim/FeaturesTabbed.tsx tüm yapıyı oku (4 sekme 
   KUTULAR + her sekme için tab content + Listing'de 3 platform 
   sub-tab + bölmeler + Kopyala butonları).

2. components/landing/RDFeaturesTabbed.tsx tamamen yeniden yaz:
   - Layout: FeaturesTabbed.tsx ile birebir aynı
   - Renk swap (FeaturesTabbed'in kullandığı):
     * #1E4DD8 → rd-primary-700
     * #163B9E → rd-primary-800
     * #F0F4FB → rd-primary-50
     * #BAC9EB → rd-primary-200
     * #FAFAF8 → rd-neutral-50
     * #F1F0EB → rd-neutral-100
     * #D8D6CE → rd-neutral-200
     * #908E86 → rd-neutral-500
     * #5A5852 → rd-neutral-600
     * #1A1A17 → rd-neutral-900
     * #0F5132 → rd-success-700
     * Trendyol orange-500, Amazon #E47911, Etsy rose-500 KORUNUR 
       (platform brand)
   - İçerik: P3-A4'te yazılan basketbol+cezve (lib/data/
     exampleContent.ts'ten çek, hardcode değil)

3. _tanitim-redesign.tsx'te RDFeaturesTabbed import'u zaten var, 
   tasarım değişimi sayfaya otomatik yansır.

**Kritik kural:** "yeni-yorum tasarım YOK". Canlı FeaturesTabbed 
nasılsa, RDFeaturesTabbed öyle olsun. Aziz beğendiği layout zaten.

Commit: feat(landing): P4-A1 RDFeaturesTabbed canlı pattern birebir 
+ rd-* token

────────────────────────────────────────────
P4-A2: MarkaBilgileri ürün → bakır cezve seti
────────────────────────────────────────────

Dosya: components/sections/MarkaBilgileriSection.tsx

Sağ şablonda mevcut basketbol topu örneği YERİNE bakır cezve seti 
kıyası. Marka profili etkisini belirgin gösteren ürün.

1. **Marka boş şablonu:**
   - Container: rounded-xl border border-rd-neutral-200 bg-white p-5
   - Eyebrow: "MARKA BILGISI YOKKEN" text-rd-neutral-500
   - Başlık: "Bakır cezve, 250ml, 2 fincan dahil"
   - Alt: "Türk kahvesine uygun."
   - Sade, jenerik ürün açıklaması — vurgu yok

2. **Marka dolu şablonu:**
   - Container: rounded-xl border-2 border-rd-warm-300 bg-rd-warm-50 
     p-5 (warm-earth premium accent)
   - Eyebrow: "MARKA İLE ÜRETİLDİĞİNDE" text-rd-warm-700
   - Başlık (font-display): "Anadolu Bakır El Dövme Cezve — Hediye 
     Kutusunda 2 Fincan ile"
   - Açıklama: "Anadolu'nun yüz yıllık bakırcılığını mutfağına taşı. 
     Anadolu Bakır'ın Gaziantep'te dövülmüş cezvesi, sabah kahvesi 
     ritüelini sanat eserine dönüştürür. Hediye kutusunda, kullanım 
     rehberi ile birlikte."
   - Marka profili etiketleri (chip): "Anadolu Bakır" + "premium ton" 
     + "Türk kahvesi sevenler" + "hediye paketi" (chip pill)

3. lib/data/exampleContent.ts'e EXAMPLE_MARKA_KIYAS objesi ekle:
   ```ts
   export const EXAMPLE_MARKA_KIYAS = {
     urunAdi: 'Bakır cezve seti',
     markaBos: {
       baslik: 'Bakır cezve, 250ml, 2 fincan dahil',
       aciklama: 'Türk kahvesine uygun.',
     },
     markaDolu: {
       baslik: 'Anadolu Bakır El Dövme Cezve — Hediye Kutusunda 2 Fincan ile',
       aciklama: 'Anadolu\'nun yüz yıllık bakırcılığını mutfağına taşı. Anadolu Bakır\'ın Gaziantep\'te dövülmüş cezvesi, sabah kahvesi ritüelini sanat eserine dönüştürür. Hediye kutusunda, kullanım rehberi ile birlikte.',
       markaInputlari: {
         storeName: 'Anadolu Bakır',
         ton: 'premium',
         kategori: 'Ev & Yaşam',
         hedefKitle: 'Türk kahvesi sevenler',
         hizmetVurgulari: ['el dövme', 'hediye paketi'],
       },
     },
   };
   ```

4. **Sol metin:** P3-A5'te 8 alanlık marka profili güncel — kontrol 
   et. Eğer hâlâ basketbol topu referansı varsa bakır cezveye 
   uyarla.

Commit: feat(landing): P4-A2 MarkaBilgileri bakır cezve kıyas (marka 
etkisi belirgin)

────────────────────────────────────────────
P4-A3: Boş video kutuları → zoom-yaklasim.mp4 hızlandırılmış
────────────────────────────────────────────

Dosya: components/landing/RDFeaturesTabbed.tsx (Video sekmesi)

P3-A3'te 6 video kart yapıldı (360° Dönüş, Zoom yaklaşım, Dramatik 
ışık, Doğal ortam, Detay tarama, Kumaş hareketi). Bazı kutularda 
asset yok → boş veya placeholder görünüyor.

Çözüm: tüm 6 kutuya **aynı video** (`/video-ornekler/zoom-yaklasim.mp4`) 
koy + JS ile `playbackRate = 2.0` ile hızlandır.

Implementation:

```tsx
const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);

useEffect(() => {
  videoRefs.current.forEach((video) => {
    if (video) {
      video.playbackRate = 2.0; // 2x hız
    }
  });
}, []);

// JSX:
{HAREKET_STILLERI.map((stil, i) => (
  <div key={stil.baslik} className="...">
    <video
      ref={(el) => { videoRefs.current[i] = el; }}
      src="/video-ornekler/zoom-yaklasim.mp4"
      autoPlay
      loop
      muted
      playsInline
      className="..."
    />
    <div>
      <stil.Ikon />
      {stil.baslik}
    </div>
    <p>{stil.aciklama}</p>
  </div>
))}
```

Eğer playbackRate=2.0 hâlâ yavaş kalırsa 2.5 veya 3.0 dene. Aziz 
preview'da görsel olarak kontrol eder.

**Not:** zoom-yaklasim videosunun her kutuda farklı içerik 
göstermediği aşikar — ama 6 ayrı video asset'i yok, en iyi seçenek 
aynı video. Aziz onayında kalır.

Commit: feat(landing): P4-A3 video kutuları zoom-yaklasim 2x hız

────────────────────────────────────────────
Test
────────────────────────────────────────────

- npm run build temiz, TypeScript clean
- Localde:
  - / RDFeaturesTabbed: canlı FeaturesTabbed birebir tasarım, rd-* 
    renkler, basketbol topu (Trendyol/Amazon) + bakır cezve (Etsy)
  - / MarkaBilgileri: bakır cezve kıyası, marka boş vs marka dolu 
    fark belirgin
  - / Video sekmesi: 6 kutu hepsinde zoom-yaklasim 2x hızlı oynar
  - 375px mobile sıkıntısız

Commit özeti (3 atomik) VEYA tek:
chore(redesign): P4-A1~P4-A3 polish-4 (Aziz acceptance 4. tur)

BACKLOG'da P4-A1~P4-A3 [x] işaretle.

Bittikten sonra rapor:
- Commit listesi
- RDFeaturesTabbed tasarım birebir mi (canlı FeaturesTabbed ile 
  diff kontrolü)
- MarkaBilgileri kıyas görsel olarak fark veriyor mu (Aziz preview 
  bakacak)
- Video playbackRate 2x yeterli mi yoksa daha yüksek mi (Aziz 
  karar)
- Açık riskler / Aziz preview test
```

---

| Faz | Bölüm | Sayfa | Ticket | Durum |
|---|---|---|---|---|
| 1 | Landing (4-10) | 1 | ~64 | ✅ Tamam (HR-14/15 kalan) |
| **1.5** | **Anasayfa reroll (18)** | **1** | **6** | **✅ Tamam (792e182)** |
| 2 | Üretim akışı (11, 13) | 4 | 42 | ✅ Tamam (28 Nis). Açık: SR-04b (ZIP/PDF) + OD-02b (payment_failed analytics) + YS-11 (yol haritası) Faz 3'e ertelendi. TryonAyarlar.tsx orphan temizlik bekliyor. |
| 3 | Hesap alanı (12, 14) | 10 | 8 paket | ✅ Tamam (28 Nis): MP+PR+FT+HS+KR+UR+FY+HD |
| 4 | Auth (15) | 4 | 5 paket | ✅ Tamam (28 Nis): AU-01~05. Aziz devam dediğinde Cowork Supabase Redirect URLs config yapacak |
| 5 | İçerik (16) | 4 | 5 paket | ✅ Tamam (28 Nis): IC-01~05 |
| 6 | Yasal + hata + cleanup (17) | 9+ | 5 paket | ✅ Tamam (28 Nis): LG-01~05 |

**🎯 REDESIGN Code-side TAMAM (28 Nis gece).** 7 faz, ~130 başlangıç ticket → ~40 birleşik paket. Aziz acceptance + main merge bekliyor.

**Aziz acceptance adımları:**
1. Preview URL'de toplu test (docs/lighthouse-checklist.md + docs/metin-tarama.md rehber)
2. Google OAuth incognito + preview test (Supabase config doğru)
3. main'e merge (`git merge claude/redesign-modern-ui --no-ff`) → Vercel auto-deploy
4. 5 PAUSED scheduled task enabled:true
5. Faz 7+ canlı BACKLOG.md (P2b backend ticket'lar — 8 adet)

**Kapsam dışı (Aziz onayı):** `/admin`, `/hesap/admin/feedback`, `/(auth)/app` (eski), `/profil` (eski), `/toplu` (kaldırılıyor).

**Detaylı prompt yazım kuralı:** Her ticket grubu için Cowork detaylı prompt'u BACKLOG'un ilgili bölümüne yazar, Aziz Claude Code'a verir. Prompt sırası gelmeden Claude Code dokunmaz.

**Override kuralı:** Her redesign prompt başında CLAUDE.md UI kuralları override edilir (memory: feedback_redesign_overrides_claudemd.md).

---

## Redesign Sonrası Kontrol Listesi

Faz 6 (Yasal + Hata) bittiğinde, redesign main'e merge edilmeden önce:

### Scheduled Tasks Reaktivasyonu
27 Nis 2026'da 5 task pause edildi (memory: `project_scheduled_tasks_paused.md`). Açma sırası:

- [ ] `yzliste-daily-health` — `enabled: true` (cron: `0 8 * * *`) — production health, ÖNCE
- [ ] `yzliste-weekly-audit` — `enabled: true` (cron: `0 9 * * 1`)
- [ ] `weekly-comprehensive-test` — `enabled: true` (cron: `0 9 * * 1`)
- [ ] `ai-denetim-haftalik` — `enabled: true` (cron: `0 6 * * 0`)
- [ ] `blog-seo-yazisi` — `enabled: true` (cron: `0 10 * * 1,4`) — EN SON

### Toplu Metin Kontrolü
Memory: `project_metin_kontrol.md`. UA/MB/NY/FY/SS/FC/FT bölümlerinde Claude Code spec'ten farklı metinler uyguladıysa toplu doğrulama.

### CI Onayı
CI-01 hâlâ açıksa redesign main'e merge öncesi çözülmeli (12 lint error).

### Faz 1 Senaryosu — Aziz Acceptance
- [ ] Anasayfa tüm bölümler scroll
- [ ] Tüm CTA route'ları test
- [ ] Footer linkleri 6 yasal sayfa
- [ ] Mobile 375 + 768 + 1024
- [ ] Klavye nav tam landing'de

### Production Hazırlık
- [ ] Vercel preview → preview branch → main akışı
- [ ] iyzico, Paraşüt, Supabase env değişkenleri
- [ ] PostHog event'leri redesign sayfalarda
