# BACKLOG — Redesign

> **Redesign tamamlandı.** Polish-1~13 + REDESIGN-15 ✅ canlıda. Tarihsel detay → `archive/backlog-redesign/`
>
> **Son güncelleme:** 5 May 2026 (REDESIGN-15 sadeleştirme paketi)

---

## Tamamlanan polish özet (sadece referans için)

| Polish | Tarih | Son commit |
|---|---|---|
| 1-8 anasayfa redesign | 29 Nis | 1e513c9 |
| 9 (10 hotfix) | 29 Nis | 1c219a9f |
| 10 (11 UI fix) | 29 Nis | 54d36565 |
| 11 (9 yapısal) | 29 Nis | 755f9a4f |
| 12 (7 pazaryeri + video) | 30 Nis | f8d6f6e |
| 13 (Hero video + vitrin metin + Örnek prefix) | 1 May | (CHANGELOG) |

**Tarihsel:** `archive/backlog-redesign/BACKLOG-REDESIGN-completed-2026-04-29.md` (Polish-1~8) + `BACKLOG-REDESIGN-polish-9-13-2026-04-30.md` (P9~12) + `BACKLOG-REDESIGN-final-polish-13-2026-05-04.md` (P13)

---

## Sıradaki — sadece Polish-14

### Polish-14 — Mobil "Devamını oku" collapse (~1-2 saat Code)
- MarkaBilgileri 8 alan mobile'da 4 + collapse
- NedenYzliste tablo mobile özet (3 satır + detay link)
- /hakkimizda + /blog/[slug] uzun bölümler 2 paragraf + collapse

Bu son redesign paketi. Bittiğinde anasayfa mobil deneyim cilalı.

---

## Reusable redesign primitives (referans)
**components/primitives/:** Tooltip, ChipSelector, Toast, StickySaveBar, StatusBadge, TransactionBadge, Accordion, Eyebrow, SectionHeader, Badge
**components/landing/:** InfoStrip (StepAnimation + StepSection REDESIGN-15'te silindi)
**components/sections/HeroBlock/:** TrustStrip, Nav, HeroSection, HeroContent, AppScreenshotMockup, PazaryeriLogoStrip (yeni)
**components/sections/:** MarkaBilgileriSection, NedenYzlisteSection, FinalCTASection (SSSSection REDESIGN-15'te silindi)
**components/tabs/:** MetinSekmesi, GorselSekmesi, VideoSekmesi, SosyalSekmesi (Kit + 7 pazaryeri)
**components/uret/:** BrandProfileBlock, IntentBanner, StickySubmitBar, ToneSelector, useCalculateCredits
**lib/data/exampleContent.ts:** Anadolu Spor basketbol + Anadolu Bakır cezve
**lib/constants/pazaryeri.ts:** 7 platform PLATFORMS object
**lib/prompts/metin.ts:** PLATFORM_KURALLARI 7 pazaryeri (emoji false, markaEki 8 alan)
**lib/hooks/useCurrentUser.ts:** TanStack Query hook (HOTFIX-03 sonrası tüm hesap sayfaları)

## Pattern'ler — kritik
- **Cowork code-rule:** proje dosyasına dokunmaz, BACKLOG'a yazar, Code implement eder
- **CLAUDE.md UI override:** redesign branch'te geçersiz, docs/redesign-typography.md referans
- **Kart-zemin:** kart bg-white, zemin bg-rd-neutral-100 (aynı renk = göz erimesi)
- **Auth pattern:** TanStack Query useCurrentUser() (HOTFIX-03 sonrası zorunlu, supabase.auth.getUser() server'da session refresh tüketir)
- **/uret URL pre-fill:** `?tab=metin/gorsel/video/sosyal&step=1`
