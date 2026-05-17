# yzliste Backlog

Aşama: pre-traffic. yzliste.com canlı, Polish-1~13 + HOTFIX-01~04 + Sentry tamamlandı. Demo hazırlığı.

**Kurallar:**
- Detaylı spec: `archive/specs-completed/{ID}.md` (29 Nis 2026'dan beri arşivde)
- Bir iş bittiğinde `Tamamlandı (YYYY-MM-DD)` yaz, yarım iş `[x]` olmaz
- Tamamlanan büyük paketler `BACKLOG-DONE.md`'de ve commit history'de

---

## 🔴 Açık iş — Öncelik

### P0 — Acil

| ID | Başlık | Sahip | Durum | Detay |
|---|---|---|---|---|
| **GSC-001** | Redirect error fix (yzliste.com → www) | Aziz canlı debug → Code fix | **P0 — Yeniden açıldı (2026-05-11)** | May 11 taramada 2 URL (önceden 1) — sorun yayılıyor. Etkilenen: `/` + `/blog/trendyol-listing-nasil-yazilir`. `specs/GSC-001.md` "EK BÖLÜM" — bot UA Cache-Control fix talimatı |
| ~~AUTH-UX-01~~ | Giriş yaptıktan sonra anasayfada hâlâ "Giriş yap" | Code | ✅ Tamamlandı (2026-05-07) | setQueryData instant cache + isFetching&&!currentUser guard — preview'da test bekliyor |
| ~~URET-MODE-01~~ | Görsel + Video sekmeleri geçici kapat | Code | ✅ Tamamlandı (2026-05-07) | "Yakında" badge + disabled; URL fallback gorsel/video→metin |
| ~~URET-SCROLL-01~~ | "Üret" sonrası output alanına scroll YOK | Code | ✅ Tamamlandı (2026-05-07) | doScrollToStep3() sticky bar + MetinSekmesi wrapper |
| ~~URET-INPUT-01~~ | Ürün adı input'a yazınca sayfa aşağı kayıyor | Code | ✅ Tamamlandı (2026-05-07) | step2Done→step-3 auto-scroll effect kaldırıldı |
| ~~URET-KATEGORI-01~~ | Kategori zorunlu ama UI tutarsız | Code | ✅ Tamamlandı (2026-05-07) | getCTAState hasGorselKategori + GorselSekmesi alt buton check |
| ~~REVIZE-01~~ | Revize 1'den 0'a düşmüyor + uyarı yok | Code | ✅ Tamamlandı (2026-05-07) | 0 olunca buton gizli + banner + metin değişimi |
| ~~URET-FILTER-01~~ | /hesap/uretimler sosyal union | Code | ✅ Tamamlandı (önceden yapılmıştı) | sosyal_uretimler union + disabled chips zaten kodda vardı |
| ~~REVIZE-02~~ | Her revize sonrası kalite skoru güncellenmiyor | Code | ✅ Tamamlandı (2026-05-07) | listingSkorHesapla backend'e eklendi; setSkor/setOneriler hook'tan expose edildi; mikro() success handler güncellendi |
| ~~AUTH-UX-02~~ | Login durumu belirsiz — kullanıcı adı/email gösterilmiyor | Code | ✅ Tamamlandı (2026-05-07) | SiteHeader "Hesabım" yanına email baş harfi avatar |
| ~~URET-KATEGORI-V2~~ | Kategori hibrit sistemi (4 sekme paylaşımlı üst + metin alt kategori) | Code | ✅ Tamamlandı (2026-05-07) | 5 enum üst kategori (KategoriSelector) + ALT_KATEGORI_MAP + getCTAState global guard + ustKategori state lifting |
| ~~UX-CTA-CLEANUP~~ | /uret sayfasında 3 duplicate CTA temizliği | Code | ✅ Tamamlandı (2026-05-07) | SiteHeader "İçerik Üret →" aktifSayfa==="icerik" iken gizlendi; StickySubmitBar tek CTA |
| ~~UX-PAKETI-03~~ | Kart-içi CTA labels + kategori hibrit tamamlama | Code | ✅ Tamamlandı (2026-05-08) | Metin→"Listing metnini üret", Görsel→"Görseli oluştur", Video→"Videoyu oluştur"; UST_KATEGORI_PROMPT_LABELS; sosyal/kit API'ye ustKategori; Sentry fallback |
| ~~UX-FIX-04~~ | /uret tabs aktif + üst kategori 9'a genişletme + alt kategori metin düzeltme | Code | ✅ Tamamlandı (2026-05-08) | Görsel+Video disabled kaldırıldı; UstKategori 5→9 enum (ev_dekor/elektronik/bebek_oyuncak/gida_hediye/diger); UST_TO_GORSEL_KATEGORI fallback map; "AI tahmin etsin"→"Detaylı kategori seç" |
| ~~FIYAT-BLOG-BAKIM~~ | Fiyat güncellemesi + blog tarih dağıtımı | Code | ✅ Tamamlandı (2026-05-10) | ₺49/129/299→39/99/249 TL; kredi 30→25 & 100→80; 5 dosya güncellendi; 118 blog yazısı 3 günde 1 dağıtımla yeniden tarihlendi (2025-05-24→2026-05-10) |
| MOBIL-SPRINT | Mobil deneyim + anasayfa tutundurma | Aziz + Cowork + Code | P0 — yeni session'da başla | Aziz şikayeti (2026-05-11): "Mobil deneyim kötü, anasayfa tutundurmuyor". Plan: (1) Tanı — telefon test + Lighthouse mobile + PostHog mobile bounce/session/scroll, (2) Quick wins — buton boyutu 44px, font 16px, LCP, layout shift, yatay scroll, (3) İçerik/akış — hero mesaj netliği, CTA above the fold, sosyal kanıt, session replay |
| AUTH-UX-CLEANUP | Nav.tsx + NAV_CTAS/NAV_LINKS silme | Code | P3 — sonraki sprint | `components/sections/HeroBlock/Nav.tsx` artık kullanılmıyor (V2 ile SiteHeader'a geçildi); slate-* renk ihlalleri de var. Güvenli silme: grep ile son kez kontrol et |
| GORSEL-V2-A~G | Görsel V2 pipeline refactor | Code | ✅ Tamamlandı (2026-05-05) | Faz 1 araştırma + Faz 2 implementasyon |
| ~~GORSEL-V2.2.1~~ | Composite pipeline (Sharp + flux-schnell) | ✅ Tamamlandı (2026-05-06) | preview'da READY |
| ~~GORSEL-V2.3~~ | Hibrit pipeline (bria atmosfer + Sharp re-overlay) | ✅ Tamamlandı (2026-05-06) | preview'da READY, GORSEL_V3_PERCENT=100 |
| GORSEL-V2-H | A/B test — 5 senaryo manuel skor | Aziz | Bekliyor | V2.3 preview URL'de test: beyaz/lifestyle/mermer + giyim/takı; `pipelineVersion: "v2.3"` network kontrolü |
| GORSEL-V2-I | Kademeli rollout %10 → %100 production | Aziz + Cowork | Bekliyor | V2.3 test geçince main → GORSEL_V3_PERCENT=10 production'a |
| GORSEL-V2.3.1 | Re-overlay edge blending kalitesi | Aziz test sonrası | Aziz test sonrası belirlenecek |
| ~~POST-HF-01~~ | /uret metin foto+metin patladı | ✅ Tamamlandı (2026-05-04) | Code teşhis + fix |
| ~~INPUT-MAP-01~~ | 4 tab input alanları haritası | ✅ Tamamlandı (2026-05-04) | `docs/icerik-input-map.md` |
| AUTH-01 | Mobilde kayıt — Turnstile devre dışı | Kod OK, mobil test kaldı | Aziz manuel test |
| ~~FY-01~~ | Fiyat 39/99/249 TL | ✅ Tamamlandı (2026-05-10) | FIYAT-BLOG-BAKIM ile güncellendi |
| CI-01 | CI lint hataları (12 error) | Kısmen | inline (setState in effect + prototype) |
| ~~SEO-DOMAIN-01~~ | Canonical URL tutarlılık temizliği | ✅ Tamamlandı (2026-05-04) | 4 dosya, sadece metadata |
| ~~URET-BUG-1A~~ | Metin revize sayacı düşmüyor | ✅ Tamamlandı (2026-05-05) | mikro() try/catch + setYenidenUretHakki(prev-1) |
| ~~URET-BUG-1B~~ | Üretim loading state yok | ✅ Tamamlandı (2026-05-05) | revize banner + tüm butonlar disabled |
| ~~URET-BUG-2A~~ | Görsel ürün küçük (aspect mismatch) | ✅ Tamamlandı (2026-05-05) | shotSizeFromAspect() + inputBoyut frontend→backend |
| ~~URET-BUG-2B~~ | Görsel oran bozulması (stretch) | ✅ Tamamlandı (2026-05-05) | 2A fix ile doğru aspect seçilince stretch kalkmaz |
| ~~URET-BUG-2C~~ | Görsel askı silinmiyor | ✅ Tamamlandı (2026-05-05) | NO_HANGER_PREFIX tüm stilSahneleri'ne eklendi |
| ~~T9-01~~ | /hesap/profil sonsuz spinner | ✅ Tamamlandı (2026-05-05) | (auth)/layout.tsx auth check kaldırıldı, try/finally eklendi |
| ~~T9-02~~ | /hesap/krediler bakiye "—" + header auth kayboluyor | ✅ Tamamlandı (2026-05-05) | T9-01 ile aynı kök neden — auth layout fix |
| ~~T9-03~~ | /hakkimizda double brand title | ✅ Tamamlandı (2026-05-05) | "Hakkımızda — yzliste" → "Hakkımızda" |
| ~~T9-04~~ | UTF-8 mojibake og:title/description | ✅ Tamamlandı (2026-05-05) | app/layout.tsx + mesafeli-satis + teslimat-iade |
| ~~T9-05~~ | UI kural ihlalleri (font-bold, yasak renkler) | ✅ Tamamlandı (2026-05-05) | 20+ dosya: font-medium, rd-* palette |

### P1 — Yakın vadeli

**Cowork haftalık taslak (4 May 2026):**

| ID | Başlık | Detay |
|---|---|---|
| ~~AI-VIS-01~~ | yzliste SEO derin audit + quick wins | ✅ Tamamlandı (2026-05-04) | `docs/seo-audit-2026-05-04.md` + T6R/SEO commit'leri |
| **BLOG-02** | 5 blog başlığı (pazaryeri-spesifik) | (1) Çiçeksepeti rehber (2) N11 65 char title (3) Etsy 13 tag (4) Hepsi 255 char (5) AI sanal kabin kategorileri |
| **DEMO-01** | Demo senaryo script | Cowork yazsın — Anadolu Spor/Bakır vitrin akışı + tekrarlanabilir |
| **CTA-01** | Landing 7 pazaryeri vurgu | Hero/CTA copy variations — "7 pazaryeri tek araçtan" |
| ~~Polish-14~~ | Mobil "Devamını oku" collapse | ✅ Tamamlandı (2026-05-04) | MarkaBilgileri + NedenYzliste + blog/hakkimizda |

**T6R bulguları (Cowork test raporu):**

| ID | Başlık |
|---|---|
| T6R-04 (P1) | Chatbot widget production'da yok (kasıtlı mı?) |
| ~~T6R-05~~ | /sifre-sifirla `<title>` anasayfa title gösteriyor | ✅ Tamamlandı (2026-05-04) |
| ~~T6R-06~~ | /profil anonim 200 + root canonical | ✅ Tamamlandı (2026-05-05) | noindex eklendi, redirect 307 doğrulandı |

**GSC denetim bulguları (2026-05-06, güncelleme 2026-05-11):**

| ID | Başlık | Öncelik | Detay |
|---|---|---|---|
| **GSC-001** | Redirect error (yzliste.com → www) | **P0 — Yeniden açıldı (2026-05-11)** | May 4 (1 URL) → May 11 (2 URL) — sorun yayılıyor. `specs/GSC-001.md` "EK BÖLÜM" — Aşama A canlı debug + B/C fix talimatı. Aziz GSC URL Inspection canlı test yapacak, sonra Code fix uygulayacak. |
| ~~GSC-002~~ | /auth robots.txt'e ekle | ✅ Tamamlandı (2026-05-17) | `specs/GSC-002.md` — /auth ve /auth/ disallow eklendi (commit 2ca7d72). |
| GSC-003 V2 | Public sayfalara Cache-Control (route-level static) | P2 — AUTH-UX-01 sonrası | `specs/GSC-003-V2.md` — V1 başarısız, geri alındı. V2 mimari değişiklik (route-level `dynamic=force-static`). AUTH-UX-01 bekliyor. |
| ~~GSC-004~~ | Blog yazılarına BreadcrumbList JSON-LD | ✅ **Tamamlandı (önceden)** | `app/blog/[slug]/page.tsx:108-125` — BreadcrumbJsonLd component implement edilmiş. Spec aktif olarak işaretliydi, gerçekte iş bitmiş. |
| ~~GSC-005~~ | /uret indexability (yanlış alarm) | Kapatıldı → **GSC-007'ye dönüştü** | İlk değerlendirme zamanlama meselesi sandı. Gerçek kök sebep: /uret tamamen `"use client"` → Googlebot render edemiyor. `specs/GSC-007.md`'ye taşındı. |
| GSC-006 | Manuel Request Indexing 5 sayfa | P2 | `specs/GSC-006.md` — Aziz manuel. GSC-001 + GSC-007 sonrası tetiklenmeli. |
| **GSC-007** | /uret server component refactor (SEO) | **P1 — yeni (2026-05-11)** | `specs/GSC-007.md` — /uret tamamen client component, Googlebot anlamlı içerik göremiyor. Aşama 0 (Aziz GSC canlı debug) → Aşama 1 (Code: server component + UretClient island). GSC-005'in gerçek kök sebebi. |

**P0.5 prompt iyileştirme:**

| ID | Başlık | Durum |
|---|---|---|
| ~~AI-PROMPT-01~~ | Sistem prompt'a bugünün tarihi context | ✅ Tamamlandı (2026-05-05) |
| ~~AI-PROMPT-02~~ | Türkçe yazım post-process ("hoşça deyin", "stilish") | ✅ Tamamlandı (2026-05-05) |
| ~~AI-PROMPT-03~~ | Hashtag uydurma engelleme | ✅ Tamamlandı (2026-05-05) |
| ~~AI-PROMPT-04~~ | CTA güçlendirme emir kipi | ✅ Tamamlandı (2026-05-05) |
| ~~AI-PROMPT-05~~ | Input completeness audit + sosyalEkBilgi UI fix | ✅ Tamamlandı (2026-05-05) |
| ~~TEST-01~~ | Vitest smoke test — /api/uret + /api/sosyal + /api/health | ✅ Tamamlandı (2026-05-05) |

**P3 — gelecek:**

| ID | Başlık | Detay |
|---|---|---|
| CI-02 | GitHub Actions smoke test CI | Vitest local çalışıyor, CI sonra |
| AI-PROMPT-06 | MetinSekmesi — anahtar kelime + etiket + backend terim UI alanları | Şu an ozellikler textarea'sına yazılıyor |
| AI-PROMPT-07 | markaliUrun UI toggle — profilde marka_adi varsa otomatik true | Şu an hardcoded false |

### P1.5 — Monitoring (Sentry tamam, PostHog kaldı)

| ID | Başlık | Durum | Süre |
|---|---|---|---|
| ~~MON-03~~ | PostHog projeyi kur | ✅ Tamamlandı (2026-05-05) | EU Cloud, env Vercel'da |
| ~~MON-04~~ | PostHog 12 event implement | ✅ Tamamlandı (2026-05-05) | `docs/posthog-events-2026-05-05.md` |
| ~~MON-05~~ | Cookie consent gating | ✅ Tamamlandı (2026-05-05) | CookieConsent.tsx doğrulandı |
| MON-06 | PostHog 3 funnel dashboard | Aziz manuel UI | 30 dk |
| MON-07 | Daily Monitoring Agent | Cowork scheduled task | 1-2 saat |

### P1.6 — Cowork Scheduled Tasks

| ID | Task | Frequency | Durum |
|---|---|---|---|
| ST-01 | pazaryeri-kural-takip | Aylık 1'i 09:00 TR | ✅ Kuruldu |
| ST-02 | yzliste-haftalik-brief | Haftalık | ✅ Aktif |
| ST-03 | icerik-kalite-testi | Aylık? | ✅ Aktif (Tur 6 raporu üretti) |
| ST-04 | icerik-disi-hersey-testi | Aylık? | ✅ Aktif (T6R bulguları üretti) |
| ST-05 | searchfit-seo (içerik haftalık) | Haftalık | ✅ Aktif |
| ST-06 | fal.ai pricing takip | Aylık (öneri) | Bekliyor |
| ST-07 | Blog URL canlılık | Haftalık (öneri) | Bekliyor |
| ST-08 | Vercel build health | Haftalık (öneri) | Bekliyor |

### P2 — Orta vadeli (Cowork haftalık taslak)

| ID | Başlık |
|---|---|
| SUPABASE-GRANT-01 | Migration'lara eksik GRANT'ları ekle (deadline: 2026-10-30) — 6 tablo: `deletion_log`, `feedback`, `user_feedback`, `consent_log`, `referrals`, `sosyal_uretimler`, `gorsel_uretim` — RLS var ama `authenticated`/`service_role` grant'ı yok. Ekim 2026'da Supabase zorunlu hale getiriyor. |
| ~~SEO-01~~ | /blog `<title>` 74 → 58 char | ✅ Tamamlandı (2026-05-04) |
| SEO-02 | OG description HTML entity bug (`&#x27;`) |
| SEO-03 | Homepage H1 doğrulama (h1 vs div) |
| SEO-04 | Hreflang etiketi (gelecek için not) |
| BLOG-03 | Yasaklı ifade taraması (2 örnek yazı) |
| GROWTH-01 | Ücretsiz kredi kancası strateji kararı |
| GROWTH-02 | WhatsApp/Telegram satıcı topluluğu araştırma |
| GROWTH-03 | Welcome e-posta dizisi taslağı (3 e-posta) |
| KW-01 | 8 anahtar kelime fırsatı blog hedefleme |
| AUDIT-01 | Rakip blog feed izleme (TrendioAI/Sopyo/Roketfy) |
| T6R-07 | Title Case ihlali (sentence case kuralı) |
| T6R-08 | /hesap/krediler title brand suffix eksik |
| OPS-20 | KVKK + yasal uyumluluk | Aziz hukuki |
| BLOG-04 | Search Console 14 sayfa indexleme talebi (SC-02) |

### P2b — Backend (redesign sonrası)

| ID | Başlık |
|---|---|
| HD-01b | Profil fotoğrafı yükleme (Storage + avatar URL) |
| HD-02b | profiles tablosuna TC kimlik/vergi numarası |
| KR-02b | iyzico ödeme webhook idempotency |
| OD-02b | Sipariş geçmişi listele (iyzico) |
| UR-03b | /uret kullanılmış kredi geçmişi tablosu |
| SR-04b | blog-seo-yazisi cron reaktivasyon |
| FT-01 | Paraşüt e-Arşiv entegrasyonu |
| YS-11 | yzstudio Faz 5 production test + stok foto |
| YS-12 | yzstudio çoklu fotoğraf workflow (ön/arka 2 ayrı seans) |

### P3 — Ertelenmiş

| ID | Başlık |
|---|---|
| NF-01 | Video Kling 3.0 Pro + ses |
| NF-05 | Premium video Seedance 2.0 |
| LP-08 | Araçlar dropdown hero kartları |
| REF-01 | Referans programı +10 kredi |
| UX-03 | Üretim sayfası navigasyon |
| LS-01 | Listing skor + ücretsiz revize |
| HERO-VID | Hero video tam versiyon |

### Test kalan (kod tamamlandı)

PE-01~PE-11 (RMBG, düzenleme, video prompt, sosyal ton, görsel marka, atomik kredi, foto eksik alanlar, tonEnMap), RF-01 (dead code), DoD-K0 (5 ürün × 3 platform demo)

---

## ✅ Tamamlananlar — referans (kompakt)

**HOTFIX (1-2 May 2026):** HOTFIX-01 (/api/uret 404), HOTFIX-02 (/api/sosyal kredi sızıntısı), HOTFIX-03 (/hesap/* hydration kilidi), HOTFIX-04 (/fiyatlar anonim CTA)

**Monitoring (4 May):** OPS-07/MON-01 (Sentry hesap+DSN), MON-02 (Sentry source maps + alert)

**AI iyileştirmeler:** AI-01~19 (chatbot prompt, merkezi config, marka bağlamı, platform limit, ton genişlet, max_tokens, çıktı doğrulama, blog paket düzelt, /uret/duzenle, rate limit, prompt_version, /toplu, /studio/manken, helper, küçük fix'ler, GORSEL_STILLER)

**UI/UX:** DR-03 /hakkimizda, DA-05 /uret modern, UI-01 araçlar dropdown, UI-02 /fiyatlar kredi, CI-01 lint, BLOG-01 cron 100 yazı

**Redesign:** Polish-1~13 (anasayfa redesign + 7 pazaryeri + Sosyal UX + Hero video + vitrin metinler — detay BACKLOG-REDESIGN.md ve archive/)

**KÜME:** OPS-14~19 operasyonel olgunluk

**Tarihsel:** archive/specs-completed/ (32 spec) + archive/backlog-redesign/ (3 dosya, Polish-1~13 prompt'lar)

---

## DoD — Küme bazlı

| Küme | DoD | Durum |
|---|---|---|
| K0 | 5 ürün × 3 platform = 15 listing | Test kaldı |
| K1 | Geri tuşu modal, /fiyatlar SSR, kredi 3 yer | Kısmen |
| K2 | PostHog 12 event + consent | ✅ MON-04/05 tamamlandı (2026-05-05) |
| K3 | Sitemap submit, view-source title, Rich Results | Kısmen |
| K4 | Security headers, 60. istek 429, CSP | Test kaldı |
| K5 | 3 belge hukuk onay | Aziz |
| K6 | Test ödeme → Paraşüt → e-posta → indir | Test kaldı |
| K7 | Platform kuralları, markalı ürün, dashboard | Kısmen |
| K8 | Chatbot fiyat, feedback DB | Test kaldı |
| K10 | Sentry test, npm test, CI main | Kısmen (Sentry ✅) |

---

## Trafik eşiği gelince aç

Eşik: 1.000 tekil/ay, 100 kayıtlı, 20 ödeme, 50 günlük üretim — 2'si gerçekleşince:
F-05 abonelik, F-24 webhook idempotency, F-15 mobil QA, F-27 moderasyon, F-29 destek widget, F-21 a11y audit, F-32 changelog, F-33 kredi süre, DR-CRO/EMAIL/VIRAL/SOCIAL/COMMUNITY/ANNUAL/CALC/ONBOARD/EEAT

---

## Notlar
- Tamamlanan iş arşivi: `BACKLOG-DONE.md` + `archive/specs-completed/` + commit history
- Aktif scheduled tasks 5 adet (P1.6'da liste)
- Memory: `project_yzliste_current_state.md` (sürekli güncel)
