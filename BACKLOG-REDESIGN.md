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

> Detay tablo + prompt arşivlendi → git history (commit'ler `69dc14e`, `18eefc3`, `dc1cd33`, `992a628`, `50c45f0`, `88d7ad5`, `77ac639`, `08f3a16`, `cb406ce`)

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

**Grup A — Route'lar (tek seferde cevaplanabilir)**

| # | Kaynak | Soru | Varsayılan |
|---|---|---|---|
| Q1 | Hero | "Giriş yap" buton route | ✅ Mevcut auth route |
| Q2 | IT-02 | "Hemen üret" CTA | ✅ `/uret` |
| Q3 | Marka | "Marka profilimi oluştur →" CTA | ✅ `/uret` |
| Q4 | Fiyatlar | Paket "Seç" butonu | ✅ `/fiyatlar` |
| Q5 | Final CTA | "Ücretsiz başla" CTA | ✅ `/kayit` |

**Grup B — Rakam doğrulamaları**

| # | Kaynak | Soru | Karar |
|---|---|---|---|
| Q6 | Hero | "28 saniyede üretildi" | ✅ "Saniyeler içinde" |
| Q7 | 3 Adım | Süre rakamları | ✅ Muğlak |
| Q8 | IT | Süre rakamları | ✅ Muğlak |
| Q9 | IT | Kredi rakamları | ✅ Muğlak |
| Q10 | Fiyatlar | Gerçek paket isimleri | ✅ `lib/paketler.ts`'den |
| Q11 | Fiyatlar | CREDIT_PER_PRODUCT | ✅ 1 (listing bazlı) |
| Q12 | Fiyatlar | "Faturalandırma desteği" | ✅ "e-Arşiv fatura" |

**Grup C — İçerik kararları kapatıldı:** Q13-Q23 hepsi kararlaştı ve uygulandı.

**Grup D — Teknik:** Q24-Q29 hepsi çözüldü (mockup placeholder'lar, Beta badge, Footer linkleri, iyzico asset, yasal sayfalar listesi).

---

## /uret Sayfası UX Refactor — Bölüm 11

**Yaklaşım:** Hafif refaktör — mevcut iskelet korunur, 5 UX iyileştirmesi.
**Spec:** `uret-ux-redesign-spec.md` | **Mockup:** `uret-redesign-mockup.jsx` | **Kararlar:** `uret-redesign-kararlar.md`
**Branch:** `claude/redesign-modern-ui` (anasayfa redesign ile aynı)
**Korunacaklar:** 4 sekme yapısı, 7 stüdyo stil grid, 5 video hareket preset, karakter limit eyebrow, üst fotoğraf yükleme alanı.

**Karar özeti (27 Nisan 2026):**
- "ADIM 1/3" kalıyor
- Yetersiz kredi → disabled buton + tooltip "Yetersiz kredi. Paket al →" + `/fiyatlar`
- Marka profili kayıt → `/profil`
- Demo tonu → sadece önizleme
- "Sosyal medya kiti" konsepti → kaldırılıyor
- Emoji → Lucide (Coffee, Heart, Briefcase, Sparkles)

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

### Grup 5 — Disabled Buton Tooltip (sıradaki)

| ID | Başlık | Durum | Bağımlılık | Kabul Kriteri |
|---|---|---|---|---|
| U-11 | `getCTAState()` hook | ✅ Tamam | — | Sekme bazlı validation: Metin→ürün adı, Görsel→fotoğraf+stil, Video→fotoğraf, Sosyal→ürün adı+platform. `{ disabled, reason }` döner. |
| U-12 | Tooltip primitive | ✅ Tamam | — | Üstte 8px offset, slate-900 bg, white text, 8px radius, 13px font, pointer üçgen, 200ms fade-in. `role="tooltip"`. Mobile: tap/focus, 2sn auto-dismiss. |
| U-13 | Disabled buton + tooltip entegrasyonu | ✅ Tamam | U-11, U-12 | Form eksikken buton disabled (slate-300 bg) + hover/focus'ta neden tooltip. Form tamamlanınca buton aktif, tooltip kayboluyor. `aria-disabled="true"` + `aria-describedby`. |

#### U-11~U-17 Birleşik Prompt (7 ticket — tek paket)

```
ÖNEMLİ — KURAL OVERRIDE:
Bu görev `claude/redesign-modern-ui` branch'inde. CLAUDE.md "yzliste — 
UI değişiklikleri için kalıcı kurallar" bölümü bu branch'te GEÇERSİZ. 
Bunun yerine BACKLOG-REDESIGN.md başındaki redesign branch UI 
kuralları geçerli (font 400-800 serbest, gölge serbest, rounded-2xl 
serbest, Manrope+Inter, rd-* token'lar, sadece emoji yasak — Lucide 
ikon kullan).

Branch: claude/redesign-modern-ui
Görev: U-11~U-17 — /uret disabled tooltip + form içi kredi etiketleri 
        temizleme + sosyal kit kaldırma + login redirect

Tema: Kullanıcıya HER zaman "neden butona basamıyorum + ne yapmam 
gerek" söyle. Sticky bar zaten kredi info veriyor (Grup 4) — şimdi 
form butonlarındaki çift bilgi (kredi etiketi + içerik kaynağı) 
temizlenip tek bir tutarlı UX kuruluyor.

────────────────────────────────────────────
BÖLÜM 1 — U-11: getCTAState() hook
────────────────────────────────────────────

Yeni dosya: components/uret/useCTAState.ts

```ts
'use client'

import type { ActiveTab } from './useCalculateCredits'

interface CTAStateArgs {
  activeTab: ActiveTab
  productName?: string         // metin + sosyal için zorunlu
  hasPhoto?: boolean            // görsel + video için zorunlu
  selectedStylesCount?: number  // görsel için ≥1
  selectedPlatformsCount?: number // sosyal için ≥1
  isLoggedIn?: boolean
}

export interface CTAState {
  disabled: boolean
  reason: string | null  // disabled === true ise dolu
}

export function getCTAState(args: CTAStateArgs): CTAState {
  const {
    activeTab,
    productName = '',
    hasPhoto = false,
    selectedStylesCount = 0,
    selectedPlatformsCount = 0,
    isLoggedIn = true,
  } = args

  if (!isLoggedIn) return { disabled: true, reason: 'Önce giriş yap' }

  const productNameTrimmed = productName.trim()

  if (activeTab === 'metin') {
    if (!productNameTrimmed) return { disabled: true, reason: 'Önce ürün adını yaz' }
  }
  if (activeTab === 'gorsel') {
    if (!hasPhoto) return { disabled: true, reason: 'Önce fotoğraf yükle' }
    if (selectedStylesCount < 1) return { disabled: true, reason: 'En az bir stil seç' }
  }
  if (activeTab === 'video') {
    if (!hasPhoto) return { disabled: true, reason: 'Önce fotoğraf yükle' }
  }
  if (activeTab === 'sosyal') {
    if (!productNameTrimmed) return { disabled: true, reason: 'Önce ürün adını yaz' }
    if (selectedPlatformsCount < 1) return { disabled: true, reason: 'En az bir platform seç' }
  }

  return { disabled: false, reason: null }
}
```

────────────────────────────────────────────
BÖLÜM 2 — U-12: Tooltip primitive
────────────────────────────────────────────

Yeni dosya: components/primitives/Tooltip.tsx

```tsx
'use client'

import { useState, useRef, useEffect, type ReactNode } from 'react'

interface TooltipProps {
  content: string | null
  children: ReactNode
  side?: 'top' | 'bottom'  // default 'top'
  visible?: boolean         // dışarıdan kontrol (örn. her zaman görünür)
}

export default function Tooltip({ content, children, side = 'top', visible }: TooltipProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const tooltipId = useRef(`tt-${Math.random().toString(36).slice(2, 9)}`)

  const open = () => {
    if (!content) return
    setIsOpen(true)
  }
  const close = () => setIsOpen(false)

  // Mobile tap auto-dismiss after 2s
  const handleTouchStart = () => {
    if (!content) return
    setIsOpen(true)
    if (dismissTimer.current) clearTimeout(dismissTimer.current)
    dismissTimer.current = setTimeout(() => setIsOpen(false), 2000)
  }

  useEffect(() => {
    return () => {
      if (dismissTimer.current) clearTimeout(dismissTimer.current)
    }
  }, [])

  const show = visible ?? (isOpen && !!content)

  // Children'a aria-describedby eklemek mümkün ama wrapper basit tutuyoruz
  return (
    <span className="relative inline-block">
      <span
        onMouseEnter={open}
        onMouseLeave={close}
        onFocus={open}
        onBlur={close}
        onTouchStart={handleTouchStart}
        aria-describedby={show && content ? tooltipId.current : undefined}
      >
        {children}
      </span>
      {show && content && (
        <span
          role="tooltip"
          id={tooltipId.current}
          className={[
            'pointer-events-none absolute left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-lg bg-rd-neutral-900 px-3 py-1.5 text-[13px] font-medium text-white animate-fade-in',
            side === 'top' ? 'bottom-full mb-2' : 'top-full mt-2',
          ].join(' ')}
        >
          {content}
          {/* Pointer üçgeni */}
          <span
            aria-hidden="true"
            className={[
              'absolute left-1/2 -translate-x-1/2 border-[6px] border-transparent',
              side === 'top'
                ? 'top-full border-t-rd-neutral-900'
                : 'bottom-full border-b-rd-neutral-900',
            ].join(' ')}
          />
        </span>
      )}
    </span>
  )
}
```

NOT: animate-fade-in keyframe globals.css'te zaten tanımlı 
(landing'den). 200ms duration zaten orada. Ek CSS gerekmiyor.

────────────────────────────────────────────
BÖLÜM 3 — U-13: Sticky bar + form içi disabled buton + tooltip
────────────────────────────────────────────

components/uret/StickySubmitBar.tsx güncelle — Tooltip ile sarmalama:

  import Tooltip from '@/components/primitives/Tooltip'
  import { type CTAState } from './useCTAState'

  interface StickySubmitBarProps {
    cost: number
    remainingCredits: number
    isInsufficientCredit: boolean
    ctaState: CTAState  // YENİ — form validation'dan gelir
    onSubmit: () => void
    isSubmitting?: boolean
    ctaLabel?: string
  }

  // Render bloğunda CTA buton'u Tooltip ile sar:
  {/* CTA */}
  <div className="w-full sm:w-auto">
    {isInsufficientCredit ? (
      // mevcut yetersiz kredi durumu
    ) : (
      <Tooltip content={ctaState.disabled ? ctaState.reason : null}>
        <button
          type="button"
          onClick={ctaState.disabled ? undefined : onSubmit}
          disabled={isSubmitting || ctaState.disabled}
          aria-disabled={ctaState.disabled || undefined}
          className={[
            'inline-flex w-full items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rd-primary-500 focus-visible:ring-offset-2 sm:w-auto',
            ctaState.disabled
              ? 'bg-rd-neutral-300 text-rd-neutral-500 cursor-not-allowed'
              : 'bg-rd-primary-700 text-white hover:bg-rd-primary-800',
            'disabled:opacity-60',
          ].join(' ')}
        >
          {isSubmitting ? 'Üretiliyor…' : ctaLabel}
          {!isSubmitting && !ctaState.disabled && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
        </button>
      </Tooltip>
    )}
  </div>

app/uret/page.tsx güncelle:
  import { getCTAState } from '@/components/uret/useCTAState'

  const ctaState = getCTAState({
    activeTab,
    productName: urunAdi,  // mevcut state ismine göre
    hasPhoto: Boolean(yuklenenFoto),  // mevcut state'e göre
    selectedStylesCount: selectedStyles?.length,
    selectedPlatformsCount: selectedPlatforms?.length,
    isLoggedIn: !!kullanici && !kullanici.anonim,
  })

  <StickySubmitBar
    ...
    ctaState={ctaState}
  />

────────────────────────────────────────────
BÖLÜM 4 — U-14, U-15: Form içi kredi yazılarını kaldır
────────────────────────────────────────────

Bu dosyalarda inline kredi etiketlerini kaldır — kredi info SADECE 
sticky bar'da kalsın:

- components/tabs/MetinSekmesi.tsx
- components/tabs/GorselSekmesi.tsx
- components/tabs/VideoSekmesi.tsx
- components/tabs/SosyalSekmesi.tsx
- components/ui/KrediButon.tsx (varsa içeriği basitleştir)

Aranıp KALDIRILACAK ifadeler:
- "X kredi" türü statik metinler (button içinde)
- "∞ kredi" — anlamsız
- "0 kredi" — anlamsız
- "Stil başına 1 kredi" gibi eyebrow tekstleri (sekme başlığında)
- "Kredi: X" tarzı sayaç görüntüleri (form içinde)

Form butonu metni "İçerik üret" olarak SADELEŞSİN. Karakter limit 
eyebrow'lar (örn. "Maksimum 80 karakter") KALSIN — bunlar input 
yardımı, kredi info değil.

NOT: Sosyal sekmede ekstra kit yapısı varsa U-16'da temizlenecek.

────────────────────────────────────────────
BÖLÜM 5 — U-16: Sosyal medya kiti kaldır
────────────────────────────────────────────

components/tabs/SosyalSekmesi.tsx — "Sosyal medya kiti" konseptini 
kaldır:

- Eğer "Caption üret" + "Kit üret" diye 2 ayrı CTA varsa → tek 
  "İçerik üret" CTA bırak
- "kit" mantığında özel branching/state varsa kaldır
- Platform seçimi → kredi hesaplaması (Grup 4'te zaten yapıldı: 
  platform sayısı × 1) → tek butonla üret
- Sosyal sekmesinde her platform için ayrı caption üretim akışı 
  kalsın (mevcut backend mantığı), sadece UI'daki "kit" terimi/CTA 
  kaldırılsın

────────────────────────────────────────────
BÖLÜM 6 — U-17: Login redirect
────────────────────────────────────────────

U-11'de zaten `isLoggedIn === false` durumunda reason "Önce giriş yap" 
döndürdük. Şimdi bunu interaktif yap:

StickySubmitBar — disabled durumdayken reason "Önce giriş yap" ise 
butona tıklamak mümkün olsun ve `/giris`'e redirect etsin.

Render mantığı:

  const isLoginRequired = ctaState.disabled && ctaState.reason === 'Önce giriş yap'
  
  // Tooltip wrapper aynı, ama button handler'ı:
  onClick={
    ctaState.disabled
      ? (isLoginRequired ? () => { window.location.href = '/giris' } : undefined)
      : onSubmit
  }
  
  // Buton görsel olarak aynı disabled stil ama tıklanabilir
  // disabled={isSubmitting} — sadece submitting'de gerçek disabled
  // ctaState.disabled durumunda görsel disabled ama tıklanabilir (login ise)

VEYA daha temizi: isLoginRequired durumunda butonu disabled YAPMA, 
tooltip "Giriş yap" göster, onClick → /giris.

İki yaklaşımdan ergonomik olan birini seç ve tutarlı uygula.

────────────────────────────────────────────
Test (commit öncesi)
────────────────────────────────────────────

U-11 + U-12 + U-13:
- /uret aç, herhangi bir form alanı boş bırak (ürün adı yaz)
- Sticky bar'daki "İçerik üret" buton GRİ disabled görünsün
- Üzerine fareyle gel → koyu tooltip "Önce ürün adını yaz" çık
- Klavye Tab → buton focus → tooltip görünür
- Form'u doldur → buton primary mavi olur, tooltip kaybolur
- Mobil 375px tap → tooltip 2sn görünür, sonra kaybolur

Sekmeler:
- Metin: ürün adı boş → "Önce ürün adını yaz"
- Görsel: fotoğraf yok → "Önce fotoğraf yükle"; fotoğraf var stil yok → "En az bir stil seç"
- Video: fotoğraf yok → "Önce fotoğraf yükle"
- Sosyal: ürün adı yok → "Önce ürün adını yaz"; ürün adı var platform yok → "En az bir platform seç"

U-14, U-15:
- Sekmelerde mevcut "X kredi", "∞ kredi", "0 kredi", "Stil başına 1 
  kredi" tarzı yazılar HİÇ yok
- Karakter limit eyebrow'lar kalmış (örn. "Maks 80 karakter")
- Form butonu metni "İçerik üret" (kredi yazısı yok)

U-16:
- Sosyal sekme: tek "İçerik üret" CTA, "kit" sözcüğü hiçbir yerde yok
- Platform seç → sticky bar krediyi günceller → tek butonla üret

U-17:
- Anonim/login olmayan kullanıcı → buton tooltip "Önce giriş yap" 
  + tıklanınca `/giris`'e redirect
- Login olmuş kullanıcı → normal davranış

Genel:
- Build temiz: `npm run build`
- TypeScript clean
- Console'da error yok

Commit mesajları (mantıklı bölünebilir, paket sonu özet):
1. feat(uret): U-11 getCTAState validation hook
2. feat(uret): U-12 Tooltip primitive
3. feat(uret): U-13 sticky bar disabled + tooltip entegrasyonu
4. refactor(uret): U-14+U-15 form içi kredi etiketleri kaldırıldı
5. refactor(uret): U-16 sosyal medya kiti CTA kaldırıldı
6. feat(uret): U-17 login required tooltip + /giris redirect

Veya tek commit: feat(uret): U-11~U-17 disabled tooltip + form temizleme

BACKLOG-REDESIGN.md'de U-11, U-12, U-13, U-14, U-15, U-16, U-17 satırlarını 
[x] (✅ Tamam) işaretle.

Bittikten sonra commit listesi + değişen dosyalar + 
BACKLOG-REDESIGN.md'deki [x] işaretlenenler özetini ver.
```

### Grup 6 — Şeffaf Kredi Etiketleri

| ID | Başlık | Durum | Bağımlılık | Kabul Kriteri |
|---|---|---|---|---|
| U-14 | Form içi kredi yazılarını kaldır | ✅ Tamam | U-09 | Tüm sekmelerdeki inline "X kredi" yazıları kaldırılmış. Kredi sadece sticky bar'da. |
| U-15 | "∞ kredi" / "0 kredi" yazılarını kaldır | ✅ Tamam | U-14 | Anlamsız etiketler temizlenmiş. |
| U-16 | "Sosyal medya kiti" CTA'sını kaldır | ✅ Tamam | U-14 | Sosyal sekmede tek "İçerik üret" CTA'sı. "Kit" konsepti kaldırılmış. |
| U-17 | Login gerektiren tooltip + redirect | ✅ Tamam | U-12 | Login gerekirken tooltip "Önce giriş yap". Tıklayınca `/giris`'e redirect. |

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
**Durum:** Faz 2 (/uret + diğerleri) tamamlandıktan sonra başlayacak.

### Aziz Kararları (2026-04-27)

1. **Canlı önizleme:** Hazır şablon (template-based). Ton seçimine göre önceden yazılmış metin şablonları. AI çağrısı yok, maliyetsiz, anlık.
2. **Düşük kredi eşiği:** 5 kredi. Uyarı (kırmızı border, "Kredi al" vurgusu) 5 ve altında tetiklenir.
3. **Referans istatistikleri:** İlk davetten sonra göster. 0 davet = sadece CTA, 1+ davet = istatistikler.
4. **Fiyatlar SSS:** Kredi ve fiyat odaklı.
5. **Karşılaştırma tablosu:** Atlandı.
6. **Üretim sonuç sayfası:** `/uret` spec'inde ele alınacak.

### Genel İçerik Kuralı

Canlı sitedeki örnek çıktıları (üretilmiş text/görsel/video/sosyal örnekleri) ve mevcut görsel öğeleri (toplar vb.) olduğu gibi koru — yeniden üretim gerektirmesin. Diğer metinler (başlık, açıklama, CTA, UI copy) tasarıma uygun şekilde değiştirilebilir.

### Mockup Uyarıları

- Mockup'lardaki emoji'ler Lucide ile değiştirilecek
- Mockup paleti landing redesign token'larıyla uyumlu

### Grup 1 — Renk Paleti Uyumu (önce yapılacak)

| ID | Başlık | Durum | Bağımlılık | Kabul Kriteri |
|---|---|---|---|---|
| H-01 | Anasayfa paletini tüm sayfalara uygula | Bekliyor | Landing page done | `/hesap`, `/hesap/marka`, `/hesap/profil`, `/fiyatlar`, `/blog`, `/giris` rd-* token'larında. |

### Grup 2 — Marka Profili `/hesap/marka` (en büyük iş)

| ID | Başlık | Durum | Bağımlılık | Kabul Kriteri |
|---|---|---|---|---|
| H-02 | ProgressIndicator | Bekliyor | H-01 | Header'da ilerleme çubuğu. 6px. <50% slate, 50-99% primary, 100% success. |
| H-03 | Form alanları (5 alan) | Bekliyor | H-01 | storeName, tone, audience, features, extraInfo. |
| H-04 | Ton chip selector | Bekliyor | H-03 | 3 chip radio group, Lucide ikonları. |
| H-05 | `generatePreview()` şablon | Bekliyor | H-04 | Hazır metin şablonları, AI yok, useMemo. |
| H-06 | BrandedAIPreview (sticky) | Bekliyor | H-05 | Sağ kolon sticky, fade animasyon. |
| H-07 | GenericAIPreview (kıyas) | Bekliyor | H-06 | Statik "marka bilgisi olmadan" örneği. |
| H-08 | WhyItMatters tooltip | Bekliyor | H-01 | Lucide Info + tooltip. |
| H-09 | StickySaveBar | Bekliyor | H-03 | Dirty state'te görünür. |
| H-10 | `beforeunload` warning | Bekliyor | H-09 | Kaydedilmemişse uyarı. |
| H-11 | Save POST `/api/marka-profili` | Bekliyor | H-09 | Loading, error, success toast. |
| H-12 | Toast başarı | Bekliyor | H-11 | Yeşil, 3sn auto-dismiss. |
| H-13 | Mobile responsive | Bekliyor | H-06 | Tek kolon. |
| H-14 | A11y pass | Bekliyor | H-13 | Radio ARIA, focus, aria-live. |

### Grup 3 — Hesabım `/hesap`

| ID | Başlık | Durum | Bağımlılık | Kabul Kriteri |
|---|---|---|---|---|
| H-15 | Tasarruf rozeti | Bekliyor | H-01 | Mavi gradient, Trophy. |
| H-16 | 3 KPI grid | Bekliyor | H-01 | Kalan kredi (≤5'te kırmızı), bu ay üretim, toplam üretim. |
| H-17 | Denenmemiş özellikler keşif | Bekliyor | H-01 | Dinamik grid. |
| H-18 | 6 menü kartı + uyarı durumları | Bekliyor | H-01 | Marka, Profil, Üretimler, Krediler, Faturalar, Ayarlar. |
| H-19 | Davet kutusu basitleştirme | Bekliyor | H-01 | 0=CTA only, 1+=istatistik. |
| H-20 | "Favori platform" KPI kaldırma | Bekliyor | H-16 | 4→3 KPI. |
| H-21 | Mobile responsive | Bekliyor | H-19 | 375px overflow yok. |

### Grup 4 — Fiyatlar `/fiyatlar`

**Aziz kararı (27 Nis 2026):** Anasayfadaki Fiyatlar bölümü "anasayfayı bozuyor" — H-21A'da kaldırma vs. minik bant kararı verilecek.

| ID | Başlık | Durum | Bağımlılık | Kabul Kriteri |
|---|---|---|---|---|
| H-21A | Anasayfa FY bölümü kararı: kaldır vs. minik özet vs. mevcut | Bekliyor | H-01 | 3 seçenek Aziz'e sunulur. Cowork önerisi: B (minik özet bant). |
| H-22 | "Önerilen" → "En popüler" | Bekliyor | H-01 | Terim değişikliği. |
| H-23 | Kredi calculator entegrasyonu | Bekliyor | H-01, FY done | Landing CreditCalculator reuse. |
| H-24 | SSS bölümü | Bekliyor | H-01 | 4-6 soru kredi/fiyat odaklı. |
| H-25 | ~~Karşılaştırma tablosu~~ | Atlandı | — | Aziz kararı. |
| H-26 | Trust strip alt bant | Bekliyor | H-01 | Landing güven noktaları reuse. |

### Grup 5 — Blog `/blog`

| ID | Başlık | Durum | Bağımlılık | Kabul Kriteri |
|---|---|---|---|---|
| H-27 | Kategori filtre state'leri | Bekliyor | H-01 | Aktif primary bg, pasif neutral. |
| H-28 | Kart hover state | Bekliyor | H-01 | Lift + shadow. |
| H-29 | Arama input focus | Bekliyor | H-01 | Primary ring. |

### Grup 6 — Giriş `/giris`

| ID | Başlık | Durum | Bağımlılık | Kabul Kriteri |
|---|---|---|---|---|
| H-30 | Form input focus ring | Bekliyor | H-01 | Primary ring. (AU-01'e absorb edilecek) |
| H-31 | Tab aktif/pasif border | Bekliyor | H-01 | Primary 2px aktif, neutral pasif. (AU-01'e absorb) |

### Grup 7 — Polish & QA

| ID | Başlık | Durum | Bağımlılık | Kabul Kriteri |
|---|---|---|---|---|
| H-32 | Cross-page navigation | Bekliyor | H-01~H-31 | Tüm geçişler sorunsuz. |
| H-33 | Lighthouse pass | Bekliyor | H-32 | Performance >90, a11y >90. |
| H-34 | A11y audit | Bekliyor | H-33 | WCAG AA tüm sayfalarda. |
| H-35 | Aziz kabul | Bekliyor | H-34 | Preview'da 5 sayfa test. |

**Bağımlılıklar:** H-01 hepsinden önce. Grup 2-6 paralel. Grup 7 en son.

---

## 13 — Üretim ve Premium Sayfaları (Faz 2 devamı)

**Branch:** `claude/redesign-modern-ui`
**Yaklaşım:** Landing pattern (rd-* token, Manrope+Inter, eyebrow + H2 + subtitle, Lucide ikonlar, fade animasyonlar, mobile-first, a11y-first). Detaylı prompt sayfa sırası gelince eklenecek.
**Bağımlılık:** /uret refactor (Bölüm 11) bittikten sonra.

### Grup 1 — /uret refaktörü (Bölüm 11 ile paralel)

Bölüm 11 zaten 21 ticket detaylı tanımlı.

### Grup 2 — /yzstudio premium araçlar sayfası

| ID | Başlık | Durum | Bağımlılık | Kabul Kriteri |
|---|---|---|---|---|
| YS-01 | Sayfa scaffold + redesign token swap | Bekliyor | Landing done | rd-* token'lar, Manrope display, eski palet temizlendi. |
| YS-02 | Hero block (premium pozisyonlama) | Bekliyor | YS-01 | Eyebrow "PREMIUM ARAÇLAR" warm-earth accent, H1, subtitle, 1 CTA. |
| YS-03 | Mankene Giydirme (FASHN) tab/kart | Bekliyor | YS-01 | Tab-pattern, 2 kolon, 3 kredi rozet. |
| YS-04 | Video Try-On tab/kart | Bekliyor | YS-03 | FASHN→Kling pipeline, 13/23 kredi rozeti, demo placeholder. |
| YS-05 | Kullanım kuralları + örnek galeri | Bekliyor | YS-04 | Rehber + 4-6 örnek görsel. |
| YS-06 | Mobile responsive | Bekliyor | YS-05 | Tab dikey istif, demo görseller tek kolon. |
| YS-07 | A11y + acceptance | Bekliyor | YS-06 | Tab ARIA, focus, kontrast. |

### Grup 3 — Üretim sonuç sayfası `/(auth)/app/sonuc/[id]`

| ID | Başlık | Durum | Bağımlılık | Kabul Kriteri |
|---|---|---|---|---|
| SR-01 | Sayfa scaffold + token swap | Bekliyor | Landing done | rd-* paleti aktif. |
| SR-02 | Sonuç başlığı + üretim metadata | Bekliyor | SR-01 | "Üretim hazır" eyebrow, ürün/platform/içerik tipi, kredi düşüm bilgisi. |
| SR-03 | İçerik tipine göre output renderer | Bekliyor | SR-02 | PZ-07~10 ContentRenderer reuse: text/image/video/social. |
| SR-04 | Kopyala/indir aksiyonları | Bekliyor | SR-03 | CopyButton reuse, ZIP/PDF indir. |
| SR-05 | "Yeni üretim" + "Geçmiş üretimler" CTA | Bekliyor | SR-04 | Primary `/uret`, ghost `/hesap/uretimler`. |
| SR-06 | Mobile + a11y + acceptance | Bekliyor | SR-05 | Aziz preview onayı. |

### Grup 4 — Ödeme sonuç sayfaları

| ID | Başlık | Durum | Bağımlılık | Kabul Kriteri |
|---|---|---|---|---|
| OD-01 | `/odeme/basarili` redesign | Bekliyor | Landing done | CheckCircle2 büyük (success-700), H2 "Ödemen alındı", kredi rozet, 2 CTA. |
| OD-02 | `/odeme/hata` redesign | Bekliyor | Landing done | XCircle danger, hata sebebi, "Tekrar dene" + "Destek". |
| OD-03 | E-Arşiv + iyzico rozeti | Bekliyor | OD-01 | Footer alt: iyzico logo, e-Arşiv açıklaması. |
| OD-04 | A11y + acceptance | Bekliyor | OD-03 | aria-live, focus management. |

**Faz 2 toplam:** 21 (U) + 7 (YS) + 6 (SR) + 4 (OD) = 38 ticket. **U-01~10 done, kalan 28.**

---

## 14 — Hesap Detay Sayfaları Genişletme (Faz 3 eklentisi)

| ID | Başlık | Durum | Bağımlılık | Kabul Kriteri |
|---|---|---|---|---|
| H-36 | `/hesap/krediler` sayfası | Bekliyor | H-01 | Bakiye kartı, kredi geçmişi tablosu, "Kredi yükle" CTA, ≤5 uyarı. |
| H-37 | `/hesap/uretimler` sayfası | Bekliyor | H-01, SR-03 | Geçmiş liste, içerik tipi filtresi, kart thumbnail, tekrar üret/indir, pagination. |
| H-38 | `/hesap/ayarlar` sayfası | Bekliyor | H-01 | Hesap, parola, e-posta tercihleri, KVKK indir/sil, hesap silme. |
| H-39 | `/hesap/faturalar` sayfası | Bekliyor | H-01 | Paraşüt e-Arşiv liste, indir, tablo. |
| H-40 | `/kredi-yukle` sayfası | Bekliyor | H-01, FY-09 | PackageCard reuse, paket seç → iyzico checkout, sticky özet (mobile). |
| H-41 | Modal versiyonları (`@modal/(.)`) | Bekliyor | H-40, H-30, H-31 | (.)giris, (.)kayit, (.)kredi-yukle — backdrop blur, focus trap, Escape. |

**Faz 3 toplam:** 35 + 6 = 41 ticket.

---

## 15 — Auth Sayfaları (Faz 4)

| ID | Başlık | Durum | Bağımlılık | Kabul Kriteri |
|---|---|---|---|---|
| AU-01 | `/giris` form layout (H-30/31'i kapsayacak) | Bekliyor | Landing done | 2 kolon (form + marka pitch), input ring, password göz, "Beni hatırla", "Şifremi unuttum". |
| AU-02 | `/giris` Google OAuth + ayraç | Bekliyor | AU-01 | "veya" ayracı, Google logosu + outline buton. |
| AU-03 | `/giris` hata durumları | Bekliyor | AU-01 | Inline error, Cloudflare Turnstile uyumlu. |
| AU-04 | `/kayit` form layout | Bekliyor | AU-01 | AU-01 simetrik, "Şifre tekrar", KVKK + koşullar checkbox. |
| AU-05 | `/kayit` e-posta doğrulama UI | Bekliyor | AU-04 | "E-posta gönderildi" empty state, MailCheck, "Tekrar gönder". |
| AU-06 | `/sifre-sifirla` form | Bekliyor | AU-01 | E-posta input, KeyRound, success state, 2 step. |
| AU-07 | Mobile responsive (3 sayfa) | Bekliyor | AU-06 | Tek kolon, marka pitch mobilde minik. |
| AU-08 | A11y + acceptance | Bekliyor | AU-07 | Form aria, autocomplete, error aria-live. |

**Faz 4 toplam:** 8 ticket.

---

## 16 — İçerik Sayfaları (Faz 5)

| ID | Başlık | Durum | Bağımlılık | Kabul Kriteri |
|---|---|---|---|---|
| IC-01 | `/blog` liste sayfası (H-27~29 dahil) | Bekliyor | Landing done | Hero + arama + kategori chip, blog kartları grid, hover lift, pagination. |
| IC-02 | `/blog/[slug]` detay tipografi | Bekliyor | IC-01 | Article max-w 720, prose, kod blok, görsel rounded-xl + caption, line-height 1.75. |
| IC-03 | `/blog/[slug]` meta + paylaş | Bekliyor | IC-02 | Yazar/tarih/okuma süresi, kategori badge'leri, sosyal paylaş, daha önce yazılanlar. |
| IC-04 | `/blog/[slug]` İlgili yazılar + CTA | Bekliyor | IC-03 | Yazı sonu CTA (rd-primary-50, "Hemen üret" → /uret), 3 ilgili yazı. |
| IC-05 | `/sss` sayfa redesign | Bekliyor | Landing done | Landing SSSSection reuse + kategori filtre + arama. |
| IC-06 | `/hakkimizda` sayfa redesign | Bekliyor | Landing done | DR-03 metni korunur, tipografi + spacing redesign'a uyarlanır, kurucu warm-earth accent. |
| IC-07 | Mobile responsive (4 sayfa) | Bekliyor | IC-06 | Blog kart 1 kolon, article mobile, SSS accordion. |
| IC-08 | A11y + acceptance | Bekliyor | IC-07 | Article semantic HTML, blog tablist ARIA. |

**Faz 5 toplam:** 8 ticket.

---

## 17 — Yasal + Hata Sayfaları (Faz 6 — Toplu Pas)

**Yaklaşım:** Düz metin sayfaları. Tek toplu pasta global token swap, header/footer reuse, link rengi tutarlılığı.

| ID | Başlık | Durum | Bağımlılık | Kabul Kriteri |
|---|---|---|---|---|
| LG-01 | 6 yasal sayfa global token swap | Bekliyor | Landing done | `/kvkk-aydinlatma`, `/gizlilik`, `/kosullar`, `/cerez-politikasi`, `/mesafeli-satis`, `/teslimat-iade` — rd-* paleti, Manrope h1/h2/h3, prose body, max-w 720, redesign Header+Footer. |
| LG-02 | 404 not-found | Bekliyor | LG-01 | "Sayfa bulunamadı" H1, kısa mesaj, anasayfa primary + popüler linkler ghost, MapOff illustrasyon. |
| LG-03 | error.tsx | Bekliyor | LG-01 | "Bir şeyler ters gitti" H1, AlertTriangle danger, "Tekrar dene" reset(), destek e-postası. |
| LG-04 | loading.tsx tutarlı loader | Bekliyor | LG-01 | Site geneli tek pattern. Loader2 + animate-spin. |
| LG-05 | Acceptance | Bekliyor | LG-04 | 6 yasal + 3 utility = 9 sayfa hızlı pas. |

**Faz 6 toplam:** 5 ticket.

---

## Faz Özeti — Roadmap

| Faz | Bölüm | Sayfa | Ticket | Durum |
|---|---|---|---|---|
| 1 | Landing (4-10) | 1 | ~64 | ✅ Tamam (HR-14/15 kalan) |
| 2 | Üretim akışı (11, 13) | 4 | 38 | 🔄 Devam (U-01~10 done, kalan 28) |
| 3 | Hesap alanı (12, 14) | 10 | 41 | Bekliyor |
| 4 | Auth (15) | 3 | 8 | Bekliyor |
| 5 | İçerik (16) | 4 | 8 | Bekliyor |
| 6 | Yasal + hata (17) | 9 | 5 | Bekliyor |

**Toplam kalan:** ~90 ticket (130 başladı, ~40 done).

**Kapsam dışı (Aziz onayı):** `/admin`, `/hesap/admin/feedback`, `/(auth)/app` (eski), `/profil` (eski), `/toplu` (kaldırılıyor).

**Detaylı prompt yazım kuralı:** Her ticket grubu için Cowork detaylı prompt'u BACKLOG'un ilgili bölümüne yazar, Aziz Claude Code'a verir. Prompt sırası gelmeden Claude Code dokunmaz. (HR-FIX dersi: prompt olmadan 23 sapma.)

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
Memory: `project_metin_kontrol.md`. UA/MB/NY/FY/SS/FC/FT bölümlerinde Claude Code spec'ten farklı metinler uyguladıysa toplu doğrulama. Spec dosyaları (specs/) vs canlı preview metni karşılaştır.

### CI Onayı
CI-01 hâlâ açıksa redesign main'e merge öncesi çözülmeli (12 lint error). Branch protection "Lint & Type Check" + "Unit Tests" zorunlu.

### Faz 1 Senaryosu — Aziz Acceptance
- [ ] Anasayfa tüm bölümler preview scroll
- [ ] Tüm CTA route'ları test
- [ ] Footer linkleri 6 yasal sayfa açılıyor mu
- [ ] Mobile 375 + 768 + 1024 breakpoints
- [ ] Klavye nav (Tab/Enter/Esc) tam landing'de

### Production Hazırlık
- [ ] Vercel preview → preview branch → main akışı temiz
- [ ] iyzico, Paraşüt, Supabase production env değişkenleri
- [ ] PostHog event'leri redesign'lı sayfalarda atılıyor mu
