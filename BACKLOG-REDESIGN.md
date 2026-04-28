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

#### HS-01~HS-04 Birleşik Prompt (Hesabım anasayfa)

```
ÖNEMLİ — KURAL OVERRIDE:
Bu görev `claude/redesign-modern-ui` branch'inde. CLAUDE.md UI 
kuralları GEÇERSİZ. BACKLOG-REDESIGN.md başındaki redesign branch 
kuralları geçerli (Manrope+Inter, rd-* token, Lucide ikon).

Branch: claude/redesign-modern-ui
Görev: HS-01~HS-04 — /hesap sayfası refactor (kullanıcı login sonrası 
ilk burayı görür, retention için kritik).

Mevcut sayfa: app/(auth)/hesap/page.tsx — önce oku, mevcut yapıyı anla.

Reuse: components/primitives/{StatusBadge}.tsx (uyarı durumları için 
extend gerekebilir — "warning"/"info" durumları zaten var).

KAPSAM DIŞI:
- Tasarruf metrik backend hesabı (frontend approximation yeter)
- Davet sistemi backend (frontend zero-state ve 1+ state UI hazır 
  olur, backend sonra)

────────────────────────────────────────────
BÖLÜM 1 — HS-01: Scaffold + tasarruf rozeti + 3 KPI grid
────────────────────────────────────────────

1. Sayfa rd-* token swap.

2. Sayfa başlığı:
   - Eyebrow: text-[10px] uppercase tracking-[0.15em] text-rd-primary-700 
     "HESABIM"
   - H1 (font-display): text-3xl md:text-4xl text-rd-neutral-900 
     "Hoş geldin, [kullanıcı adı]" — kullanıcı adı yoksa fallback 
     "Hoş geldin"
   - Subtitle: text-rd-neutral-600 — "Hesap durumun ve sıradaki 
     adımların."

3. Tasarruf rozeti (sayfa hero):
   - bg-gradient-to-br from-rd-warm-50 to-rd-warm-100 (warm-earth 
     gradient — Aziz spec mavi diyor ama warm-earth premium pozisyon 
     için daha uygun; mavi tercih edilirse bg-rd-primary-50 to 
     bg-rd-primary-100)
   - border border-rd-warm-200 rounded-xl p-5 md:p-6
   - Lucide Trophy size-8 text-rd-warm-700
   - Sol metin: eyebrow "TASARRUF" text-xs + "₺X" font-display text-3xl 
     text-rd-warm-900
   - Sağ açıklama: "yzliste ile birlikte tasarruf ettin"
   - Hesaplama: krediKullanim * 5 (1 kredi ≈ ₺5 stüdyo/copywriter 
     tasarrufu approximation). Pre-traffic kullanıcı için 0 ise: 
     "yzliste ile birlikte tasarruf etmeye başla — ilk üretim için 
     ücretsiz ipuçları" (CTA: /uret)

4. 3 KPI grid (rozetin altında):
   - grid grid-cols-1 md:grid-cols-3 gap-4
   - Her KPI: rounded-xl border p-5 + Lucide ikon (size-6) + label 
     (text-xs uppercase) + value (font-display text-2xl)
   - **Kalan kredi:** Lucide Coins, "Kalan kredi" + sayı. Eğer ≤5: 
     border-rd-danger-300 bg-rd-danger-50 + ikon text-rd-danger-700. 
     Tüm KPI Link href="/kredi-yukle" + ChevronRight (PR pattern reuse).
   - **Bu ay üretim:** Lucide TrendingUp, "Bu ay" + sayı. Link 
     href="/hesap/uretimler".
   - **Toplam üretim:** Lucide Activity, "Toplam" + sayı. Link 
     href="/hesap/uretimler".
   - "Favori platform" KPI YOK (Aziz spec: 4→3 KPI).

5. Data fetching: useCredits + supabase.from('generations').select('*', 
   { count: 'exact' }).eq('user_id', userId) toplam ve ay filtreli.

Commit: feat(hesap): HS-01 scaffold + tasarruf rozeti + 3 KPI grid

────────────────────────────────────────────
BÖLÜM 2 — HS-02: 6 menü kartı + uyarı durumları
────────────────────────────────────────────

1. Bölüm başlığı: "Hesap menün" (font-display text-xl md:text-2xl)

2. Grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4

3. 6 kart (her biri Link, hover lift -translate-y-0.5 transition):
   - rounded-xl border border-rd-neutral-200 bg-white p-5 hover:
     border-rd-primary-300
   - Üst: Lucide ikon (size-6 text-rd-primary-700) + sağda 
     ChevronRight + (varsa) badge
   - Başlık (font-medium text-rd-neutral-900)
   - Alt mikro-metin (text-sm text-rd-neutral-600)

4. 6 kart:
   - **Marka profili** → /hesap/marka (Lucide Building2). Mikro: 
     "AI metinlerini kişiselleştir." Uyarı: marka boşsa veya 
     storeName yoksa → border-rd-warm-300 + StatusBadge "preparing" 
     "Eksik" (warm tonu, danger değil — uyarı kibar)
   - **Profil** → /hesap/profil (Lucide User). Mikro: "Kişisel ve 
     fatura bilgilerin."
   - **Üretimler** → /hesap/uretimler (Lucide FileText). Mikro: 
     "Geçmiş üretimlerini gör."
   - **Krediler** → /hesap/krediler (Lucide Coins). Mikro: 
     "Kredi geçmişin ve paketler." Uyarı: kredi ≤5 → 
     border-rd-danger-300 + StatusBadge "error" "Düşük"
   - **Faturalar** → /hesap/faturalar (Lucide Receipt). Mikro: 
     "Ödeme geçmişin." Uyarı: error status'lü fatura varsa → 
     border-rd-danger-300 + StatusBadge "error" "Hata"
   - **Ayarlar** → /hesap/ayarlar (Lucide Settings). Mikro: 
     "Şifre, e-posta, hesap silme."

5. Uyarı bilgisi:
   - Marka profil status: profiles.marka_data null veya storeName 
     boş → "eksik"
   - Kredi ≤5: useCredits.data <= 5
   - Fatura error: faturalar tablosunda status='error' var mı

Commit: feat(hesap): HS-02 6 menü kartı + uyarı durumları

────────────────────────────────────────────
BÖLÜM 3 — HS-03: Denenmemiş özellikler + davet kutusu
────────────────────────────────────────────

1. **Denenmemiş özellikler keşif:**
   - generations tablosundan kullanıcının yaptığı content_type'ları çek
   - Eksik olanlar (yapmadığı): 4 tip - yapılan = eksik
   - Yeni kullanıcı (hiç üretim yok): tüm 4 tipi göster
   - UI: bölüm başlığı "Henüz denemediğin" + 2-4 kart (tip başına)
     - Kart: rounded-xl bg-rd-warm-50 border border-rd-warm-200 p-4
     - Lucide Sparkles size-5 text-rd-warm-700
     - Başlık: "Video try-on", "Görsel üretim", "Sosyal medya kit", 
       "Listing metni"
     - Mikro: "5sn video, 13 kredi" gibi ipucu
     - CTA: Link → /uret veya /yzstudio
   - Tüm 4 tip yapıldıysa: bu bölüm gizlen (boş listeden boş bölüm 
     gösterme)

2. **Davet kutusu basitleştirme:**
   - Mevcut sayfada davet sistemi varsa kullan, yoksa yeni komponent 
     komponents/hesap/InviteBox.tsx (basit)
   - 0 davet (count === 0):
     - bg-rd-primary-50 border border-rd-primary-200 rounded-xl p-5
     - Lucide UserPlus size-6 text-rd-primary-700
     - Başlık: "Arkadaşını davet et"
     - p: "Sen ve arkadaşın bonus kredi alır."
     - CTA: "Davet linkimi kopyala" (clipboard) veya "Davet et" 
       button → modal/page (sonra)
   - 1+ davet (count >= 1):
     - Aynı kart yapı ama:
     - "X arkadaş davet ettin, Y bonus aldın" istatistik
     - CTA daha küçük: "Daha fazla davet et"

   - Backend: davetler tablosu/sütunu var mı kontrol. Yoksa 
     count = 0 default + UI hazır olur, backend sonra. BACKLOG'a 
     HS-03b not düş.

Commit: feat(hesap): HS-03 denenmemiş özellikler keşif + davet kutusu

────────────────────────────────────────────
BÖLÜM 4 — HS-04: Mobile + a11y polish
────────────────────────────────────────────

1. **Mobile (375px):**
   - Tasarruf rozeti: ikon üstte + metin altta dikey
   - 3 KPI grid: tek kolon
   - 6 menü kartı: tek kolon
   - Denenmemiş kartlar: tek kolon
   - Davet kutusu: full width, ikon küçülür

2. **A11y:**
   - main aria-labelledby h1
   - KPI Link aria-label net (örn "Krediler — kalan: X")
   - Menü kartları role="link" + aria-label başlık + uyarı durumu
   - Uyarı badge'leri aria-live="polite" YOK (statik bilgi)
   - Lucide ikonlar aria-hidden="true"
   - Klavye Tab: KPI'lar → menü kartları → denenmemiş → davet kutusu

3. **Edge case'ler:**
   - useCredits null: KPI'da "—" placeholder
   - generations fetch hata: "Üretim sayısı yüklenemedi" + "Toplam: —"
   - Marka data fetching: hover state'i değiştirme, "yükleniyor" 
     skeleton

Commit: chore(hesap): HS-04 mobile + a11y polish

────────────────────────────────────────────
Test
────────────────────────────────────────────

- npm run build temiz
- Localde /hesap:
  - Eyebrow + Manrope H1 (kullanıcı adı varsa)
  - Tasarruf rozeti gradient + Trophy
  - 3 KPI clickable, kalan kredi ≤5'te kırmızı
  - 6 menü kartı, marka eksikse warm uyarı, kredi düşükse danger uyarı
  - Denenmemiş kartlar (yeni kullanıcı = 4 tip)
  - Davet kutusu 0 state CTA
  - 375px mobile sıkıntısız
  - Klavye Tab full tour

Commit özeti (4 atomik) VEYA tek:
feat(hesap): HS-01~HS-04 /hesap anasayfa refactor

BACKLOG-REDESIGN.md'de HS-01~HS-04 [x] işaretle. Backend bağımlı 
ticket'lar (davet sistemi, tasarruf metrik) için BACKLOG'a 
not düş (HS-03b vs).

Bittikten sonra rapor:
- Commit listesi
- Yeni dosyalar (InviteBox vs)
- Davet sistemi backend kararı
- Tasarruf rozeti hesaplama (approximation mı gerçek metrik mi)
- Açık riskler / Aziz preview test
```

### Grup 4 — Fiyatlar `/fiyatlar`

**Aziz kararı:** Anasayfadaki Fiyatlar bölümü "anasayfayı bozuyor" — H-21A'da kaldırma vs. minik bant kararı verilecek.

| ID | Başlık | Durum | Bağımlılık | Kabul Kriteri |
|---|---|---|---|---|
| H-21A | Anasayfa FY bölümü kararı | Bekliyor | H-01 | A=kaldır, B=minik bant, C=mevcut. Cowork önerisi: B. |
| H-22 | "Önerilen" → "En popüler" | Bekliyor | H-01 | Terim değişikliği. |
| H-23 | Kredi calculator entegrasyonu | Bekliyor | H-01, FY done | Landing reuse. |
| H-24 | SSS bölümü | Bekliyor | H-01 | 4-6 soru kredi/fiyat. |
| H-25 | ~~Karşılaştırma tablosu~~ | Atlandı | — | Aziz kararı. |
| H-26 | Trust strip alt bant | Bekliyor | H-01 | Landing reuse. |

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

| ID | Başlık | Durum | Bağımlılık | Kabul Kriteri |
|---|---|---|---|---|
| H-36 | `/hesap/krediler` sayfası | Bekliyor | H-01 | Bakiye, kredi geçmişi, "Kredi yükle" CTA, ≤5 uyarı. |
| H-37 | `/hesap/uretimler` sayfası | Bekliyor | H-01, SR-03 | Geçmiş liste, filtre, kart, tekrar üret/indir, pagination. |
| H-38 | `/hesap/ayarlar` sayfası | Bekliyor | H-01 | Hesap, parola, e-posta tercihleri, KVKK, hesap silme. |
| H-39 | `/hesap/faturalar` sayfası | Bekliyor | H-01 | Paraşüt e-Arşiv liste. |
| H-40 | `/kredi-yukle` sayfası | Bekliyor | H-01, FY-09 | PackageCard reuse, iyzico checkout. |
| H-41 | Modal versiyonları | Bekliyor | H-40, H-30, H-31 | (.)giris, (.)kayit, (.)kredi-yukle. |

**Faz 3 toplam:** 35 + 6 = 41 ticket.

---

## 15 — Auth Sayfaları (Faz 4)

| ID | Başlık | Durum | Bağımlılık | Kabul Kriteri |
|---|---|---|---|---|
| AU-01 | `/giris` form layout | Bekliyor | Landing done | 2 kolon, input ring, password göz, "Beni hatırla", "Şifremi unuttum". H-30/31 absorb. |
| AU-02 | `/giris` Google OAuth | Bekliyor | AU-01 | "veya" ayracı, Google logosu + outline. |
| AU-03 | `/giris` hata durumları | Bekliyor | AU-01 | Inline error, Turnstile uyumlu. |
| AU-04 | `/kayit` form layout | Bekliyor | AU-01 | "Şifre tekrar", KVKK + koşullar checkbox. |
| AU-05 | `/kayit` e-posta doğrulama UI | Bekliyor | AU-04 | "E-posta gönderildi", MailCheck. |
| AU-06 | `/sifre-sifirla` form | Bekliyor | AU-01 | KeyRound, 2 step. |
| AU-07 | Mobile responsive | Bekliyor | AU-06 | Tek kolon. |
| AU-08 | A11y + acceptance | Bekliyor | AU-07 | Form aria, autocomplete. |
| AU-09 | Google OAuth preview URL fix | Bekliyor | AU-02 | Aziz 28 Nis bulgusu: Google ile giriş preview deployment'ında canlı yzliste.com'a yönlendiriyor. Email+şifre OK. Çözüm 2 adımda: (1) Supabase dashboard → Authentication → URL Configuration → Redirect URLs listesine `https://*.vercel.app/**` pattern ekle. (2) Google Cloud Console → APIs → Credentials → OAuth 2.0 Client → Authorized redirect URIs listesine Vercel preview URL pattern eklenmiyor (Google wildcard kabul etmiyor) — onaylı redirect URI'ları olarak Supabase callback URL (`https://<project>.supabase.co/auth/v1/callback`) tek başına yeterli olmalı, çünkü Google Supabase'e geri döner, Supabase de Site URL/Redirect URL listesindeki en yakın eşleşmeye gönderir. Kontrol: Supabase config doğruysa Google whitelist sorun değildir. Kod tarafı temiz (AuthForm.tsx `window.location.origin` kullanıyor, hardcoded yok). |

**Faz 4 toplam:** 9 ticket.

---

## 16 — İçerik Sayfaları (Faz 5)

| ID | Başlık | Durum | Bağımlılık | Kabul Kriteri |
|---|---|---|---|---|
| IC-01 | `/blog` liste | Bekliyor | Landing done | Hero + arama + kategori chip, kart grid, hover lift, pagination. |
| IC-02 | `/blog/[slug]` tipografi | Bekliyor | IC-01 | Article max-w 720, prose, kod blok, line-height 1.75. |
| IC-03 | `/blog/[slug]` meta + paylaş | Bekliyor | IC-02 | Yazar/tarih/okuma süresi, kategori, sosyal paylaş. |
| IC-04 | `/blog/[slug]` ilgili + CTA | Bekliyor | IC-03 | Yazı sonu CTA + 3 ilgili. |
| IC-05 | `/sss` redesign | Bekliyor | Landing done | SSSSection reuse + kategori filtre + arama. |
| IC-06 | `/hakkimizda` redesign | Bekliyor | Landing done | DR-03 metni korunur, kurucu warm-earth accent. |
| IC-07 | Mobile responsive | Bekliyor | IC-06 | Blog kart 1 kolon. |
| IC-08 | A11y + acceptance | Bekliyor | IC-07 | Article semantic HTML. |

**Faz 5 toplam:** 8 ticket.

---

## 17 — Yasal + Hata Sayfaları (Faz 6 — Toplu Pas)

**Yaklaşım:** Düz metin sayfaları. Tek toplu pasta global token swap, header/footer reuse.

| ID | Başlık | Durum | Bağımlılık | Kabul Kriteri |
|---|---|---|---|---|
| LG-01 | 6 yasal sayfa global token swap | Bekliyor | Landing done | `/kvkk-aydinlatma`, `/gizlilik`, `/kosullar`, `/cerez-politikasi`, `/mesafeli-satis`, `/teslimat-iade` — rd-* paleti, Manrope, prose body. |
| LG-02 | 404 not-found | Bekliyor | LG-01 | "Sayfa bulunamadı" H1, anasayfa CTA, MapOff illustrasyon. |
| LG-03 | error.tsx | Bekliyor | LG-01 | "Bir şeyler ters gitti", AlertTriangle, "Tekrar dene". |
| LG-04 | loading.tsx tutarlı loader | Bekliyor | LG-01 | Loader2 + animate-spin. |
| LG-05 | Acceptance | Bekliyor | LG-04 | 9 sayfa hızlı pas. |

**Faz 6 toplam:** 5 ticket.

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

## Faz Özeti — Roadmap

| Faz | Bölüm | Sayfa | Ticket | Durum |
|---|---|---|---|---|
| 1 | Landing (4-10) | 1 | ~64 | ✅ Tamam (HR-14/15 kalan) |
| **1.5** | **Anasayfa reroll (18)** | **1** | **6** | **✅ Tamam (792e182)** |
| 2 | Üretim akışı (11, 13) | 4 | 42 | ✅ Tamam (28 Nis). Açık: SR-04b (ZIP/PDF) + OD-02b (payment_failed analytics) + YS-11 (yol haritası) Faz 3'e ertelendi. TryonAyarlar.tsx orphan temizlik bekliyor. |
| 3 | Hesap alanı (12, 14) | 10 | ~50 | Marka profili MP-01~07 birleşik prompt HAZIR (Bölüm 12 Grup 2). Sıra: Marka profili → Profil → Faturalar UI → Krediler → Üretimler |
| 4 | Auth (15) | 3 | 9 | Bekliyor (+1: AU-09 Google OAuth preview URL fix — Supabase + Google Cloud Console whitelist) |
| 5 | İçerik (16) | 4 | 8 | Bekliyor |
| 6 | Yasal + hata (17) | 9 | 5 | Bekliyor |

**Toplam kalan:** ~72 ticket (Faz 3 + 4 + 5 + 6). Faz 1, 1.5, 2 ✅ Tamam.

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
