# BACKLOG — Redesign

> **Aktif iş listesi.** Tamamlanan polish'lerin tam içeriği için → `archive/backlog-redesign/BACKLOG-REDESIGN-completed-2026-04-29.md` (5629 satır, 26 bölüm — Polish-1 ila Polish-8 tüm prompt'lar ve commit hash'leri).
>
> **Branch:** `claude/redesign-modern-ui` → preview → main
>
> **Son güncelleme:** 29 Nis 2026 (genel temizlik sonrası)

---

## Faz tablosu — özet (kapsamlı geçmiş archive'da)

| Faz | İş | Durum | Son commit |
|---|---|---|---|
| 1 | Landing Hero + section yapı | ✅ | — |
| 1.5 | Anasayfa reroll | ✅ | a4093418 |
| 1.6 | Anasayfa polish (LP-01~10) | ✅ | 38b10b4 |
| 1.7 | Sayfa akış (LP-11~12) | ✅ | c986919c |
| 1.8 | Polish-3 (P3-A1~U5) | ✅ | 02b07827 |
| 1.9 | Polish-4 (P4-A1~A3) | ⚠️ kısmen | bebfec83 |
| 1.95 | Polish-4 FIX (P4-FIX-1~3) | ✅ | 1258d73 |
| 1.96 | Polish-5 (P5-FIX-1~4 InfoStrip geri) | ✅ | bc65db5 |
| 1.97 | Polish-6 (tipografi + StepAnimation tek Canvas) | ✅ | c9e6d7e |
| 1.98 | Polish-7 (InfoStrip canlı pattern transplant) | ✅ | bccf903 |
| **1.99** | **Polish-8 (Beta+cost+tipografi+ton+hiyerarşi)** | **✅** | **4093053** |
| 2 | Üretim akışı | ✅ | — |
| 3 | Hesap alanı | ✅ | — |
| 4 | Auth | ✅ | eba2681a |
| 5 | İçerik (blog/sss/hakkimizda) | ✅ | 46efb355 |
| 6 | Yasal + hata + cleanup (LG-01~05) | ✅ | ce60e8a2 |

**Önemli son durum:** Polish-8 sonrası anasayfa ~bitiş noktasına yakın. Ufak sorun varsa Polish-9, sonra preview branch → main merge.

---

## Sıradaki açık iş

### 1. Polish-8 acceptance test (Aziz)
- [ ] Vercel preview URL incognito test (yzliste-git-claude-redesign-modern-ui-azizkoses-projects.vercel.app)
- [ ] InfoStrip detay alanı: kart bg-white + zemin neutral-100, alanlar belli mi?
- [ ] /uret aç hiç seçim yapmadan → sticky bar "—" gösteriyor mu?
- [ ] Anasayfa H2'leri tutarlı (font-bold + text-3xl/4xl)
- [ ] Logo "Beta" badge yok
- [ ] MarkaBilgileri 3 ton metni belirgin fark gösteriyor mu (özellikle premium ≠ markaDolu)
- [ ] MarkaBilgileri sol kolonda "Metin tonu vs Marka bilgisi" UX kutusu var
- [ ] Hero text-slate-* hiç yok (HeroContent + TrustStrip rd-* token)

### 2. Polish-9 (varsa Aziz acceptance bulgu)
- TBD — preview test sonrası

### 3. Pre-merge checklist
- [ ] `git tag v1.0-pre-redesign main` (canlı snapshot, redesign main merge öncesi)
- [ ] `git push origin v1.0-pre-redesign`
- [ ] `git worktree add ../yzliste-v1-archive v1.0-pre-redesign` (lokal yedek klasör)
- [ ] preview branch'e merge → preview deploy doğrula
- [ ] main'e merge → Vercel auto deploy
- [ ] post-merge: 5 PAUSED scheduled task → enabled:true

### 4. Post-merge (canlı/main, redesign-dışı)
- BACKLOG.md → P2b backend ticket'lar (8 adet): Paraşüt entegrasyonu (FT), KR-02b kredi_log, OD-02b payment_failed, UR-03b /uret pre-fill, SR-04b ZIP/PDF, HD-01b bildirim_tercihleri, profiles TC kimlik kolonu, YS-11 yol haritası

---

## Reusable redesign primitives (referans)

**components/primitives/:** Tooltip, ChipSelector, Toast, StickySaveBar, StatusBadge, TransactionBadge, Accordion, Eyebrow, SectionHeader, Badge
**components/auth/:** AuthForm, TurnstileWidget
**components/modal/:** Modal
**components/marka/:** BrandPreviewPanel, BrandedAIPreview, GenericAIPreview
**components/uret/:** BrandProfileBlock, IntentBanner, StickySubmitBar, ToneSelector, useCalculateCredits, useCTAState
**components/yzstudio/:** StudioHeader, BetaBanner, StudioStickyBar
**components/landing/:** StepAnimation, StepSection, InfoStrip
**components/fiyatlar/:** KrediCalculator, FiyatlarSSS, FiyatlarHybridSection
**components/blog/:** BlogListesi, BlogPaylas, SSSListesi
**components/hesap/:** InviteBox
**components/sections/HeroBlock/:** TrustStrip, Nav, HeroSection, HeroContent, AppScreenshotMockup, VideoModal
**components/sections/:** MarkaBilgileriSection, NedenYzlisteSection, SSSSection, FinalCTASection, FooterSection, FiyatlarSection
**lib/data/:** markaPreviewTemplates, turkiye-il-ilce, exampleContent (basketbol topu + bakır cezve), EXAMPLE_MARKA_KIYAS
**lib/constants/:** hero, marka-bilgileri, neden-yzliste, sss-landing, ton, fiyatlar-landing, footer-landing, final-cta, icerik-turleri, pazaryeri, uc-adim
**globals.css @theme:** rd-primary/neutral/warm/warning/success/danger token sistemi + animasyonlar
**docs/:** auth-config.md, lighthouse-checklist.md, metin-tarama.md, **redesign-typography.md** (29 Nis Cowork referans tablosu — Hero H1/Section H2 font-bold, eyebrow text-xs, body min text-xs)

---

## Pattern'ler (Faz 1-6 birikimi)

- **Save:** Supabase direkt `.update()` (endpoint API yok)
- **Demo flag:** env-based `process.env.NODE_ENV !== 'production'`
- **Auth redirectTo:** `window.location.origin` (preview/prod auto)
- **"Yeniden üret":** frontend `/uret?onceki=...` (kredi düşmez, kullanıcı kontrol)
- **URL pre-fill:** `/uret?tab=metin/gorsel/video/sosyal`
- **Polish iterasyonları:** Aziz preview test → bulgu → Cowork prompt → Code commit → tekrar preview
- **CLAUDE.md UI override:** redesign branch'te CLAUDE.md geçersiz, `docs/redesign-typography.md` referans tablo

---

## İçerik kararları (29 Nis)

- Anasayfa örnek ürün: **basketbol topu** (Trendyol + Amazon TR — public/ornek_*.{jpg,png} + hero-video.mp4)
- Etsy: **el yapımı bakır cezve seti** (zanaat + Anatolian craftsmanship)
- MarkaBilgileri kıyas: bakır cezve (marka etkisi belirgin)
- "kr" → "kredi" tam yazım
- Anasayfada fiyat bölümü TAMAMEN kaldırıldı (Faz 1.7)
- Logo: "yzliste Beta" badge kaldırıldı (Polish-8)

---

## Fiyatlama

49/129/299 TL — 10/30/100 kredi. Video 5sn=10kr, 10sn=20kr | Try-on 3kr | Listing/Görsel/Sosyal 1kr | Kit 2kr. Krediler süresiz.

---

## Açık öncelikler (canlı/main branch — non-redesign, post-merge)

- **P0:** AUTH-01, FY-01 test, OPS-07 (DSN), CI-01 (lint 12 error)
- **Test kalan:** PE-01~PE-11 (kod DONE, post-redesign Aziz manuel)
- **Detay:** BACKLOG.md (canlı site iş listesi)

---

## Tarihsel arşiv

Tam Polish-1 ila Polish-8 prompt'ları, commit hash'leri, kabul kriterleri:
→ **`archive/backlog-redesign/BACKLOG-REDESIGN-completed-2026-04-29.md`** (5629 satır, 26 bölüm)
