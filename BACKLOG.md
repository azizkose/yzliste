# yzliste Backlog

Aşama: pre-traffic. yzliste.com canlı, Polish-1~13 + HOTFIX-01~04 + Sentry tamamlandı. Demo hazırlığı.

**Kurallar:**
- Detaylı spec: `archive/specs-completed/{ID}.md` (29 Nis 2026'dan beri arşivde)
- Bir iş bittiğinde `Tamamlandı (YYYY-MM-DD)` yaz, yarım iş `[x]` olmaz
- Tamamlanan büyük paketler `BACKLOG-DONE.md`'de ve commit history'de

---

## 🔴 Açık iş — Öncelik

### P0 — Acil

| ID | Başlık | Durum | Detay |
|---|---|---|---|
| ~~POST-HF-01~~ | /uret metin foto+metin patladı | ✅ Tamamlandı (2026-05-04) | Code teşhis + fix |
| ~~INPUT-MAP-01~~ | 4 tab input alanları haritası | ✅ Tamamlandı (2026-05-04) | `docs/icerik-input-map.md` |
| AUTH-01 | Mobilde kayıt — Turnstile devre dışı | Kod OK, mobil test kaldı | Aziz manuel test |
| FY-01 | Fiyat 49/129/299 TL | Kod OK, test kaldı | Aziz manuel test |
| CI-01 | CI lint hataları (12 error) | Kısmen | inline (setState in effect + prototype) |
| ~~SEO-DOMAIN-01~~ | Canonical URL tutarlılık temizliği | ✅ Tamamlandı (2026-05-04) | 4 dosya, sadece metadata |

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
| T6R-06 (P1) | /profil anonim 200 + root canonical (SEO duplicate) |

**P0.5 prompt iyileştirme:**

| ID | Başlık |
|---|---|
| AI-PROMPT-01 | Sistem prompt'a bugünün tarihi context (2024 hashtag → 2026) |
| AI-PROMPT-02 | Türkçe yazım kontrolü post-process ("hoşça deyin", "stilish") |
| AI-PROMPT-03 | Hashtag uydurma engelleme |
| AI-PROMPT-04 (P2) | CTA güçlendirme |
| TEST-01 | Smoke test'e /api/uret + tüm üretim API'ları |

### P1.5 — Monitoring (Sentry tamam, PostHog kaldı)

| ID | Başlık | Durum | Süre |
|---|---|---|---|
| MON-03 | PostHog projeyi kur | Aziz manuel | 20 dk |
| MON-04 | PostHog 12 event implement | Code | 2-3 saat |
| MON-05 | Cookie consent gating | Code | 30 dk |
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
| K2 | PostHog 9 event + consent | Audit kaldı (MON-04) |
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
