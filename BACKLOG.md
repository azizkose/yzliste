# yzliste Backlog

Aşama: pre-traffic. Demo hazırlığı — içerik kalitesi 1 numara öncelik.

**Kurallar:**
- Her oturumun başında bu dosyayı oku, nerede kaldığımızı anla.
- Detaylı spec gerekiyorsa `specs/{ID}.md` dosyasını oku.
- Bir iş bittiğinde `- [ ]` → `- [x]` olarak güncelle. Yarım iş `[x]` olmaz.
- Tamamlanmış maddelerin detayı `BACKLOG-DONE.md` dosyasında.

---

## Açık işler — Öncelik sırasına göre

### P0 — Acil / Kritik

| ID | Başlık | Durum | Spec |
|---|---|---|---|
| AUTH-01 | Mobilde kayıt engeli — Turnstile devre dışı | Kod OK, mobil test kaldı | inline |
| FY-01 | Fiyat artışı — 49/129/299 TL | Kod OK, test kaldı | inline |
| OPS-07 | Sentry error monitoring | Kısmen OK, DSN sonrası 3 madde | inline |
| CI-01 | CI lint hataları düzelt — 12 error (setState in effect + prototype dosyaları) | Açık | inline |
| AI-01 | Chatbot SYSTEM_PROMPT güncelle — fiyat/platform/stil/yzstudio yanlış | Tamamlandı | [specs/ai-denetim-01.md](specs/ai-denetim-01.md) §P0-1 |
| AI-02 | Merkezi AI config — model + temperature + cost haritası (`lib/ai-config.ts`) | Tamamlandı | [specs/ai-denetim-01.md](specs/ai-denetim-01.md) §P0-2, P0-3 |

### P1 — Yakın vadeli

| ID | Başlık | Durum | Spec |
|---|---|---|---|
| NF-02 | yzstudio — premium araçlar sayfası | Faz 1-3 OK, Faz 4-5 kaldı | [specs/nf-02-yzstudio.md](specs/nf-02-yzstudio.md) |
| DR-03 | /hakkimizda kurucu bölümü — kısa, profesyonel, şirket adı yok | Tamamlandı | [specs/dr-03-hakkimizda-yeniden-yaz.md](specs/dr-03-hakkimizda-yeniden-yaz.md) |
| DA-05 | /uret modern UX — monochrome çözümü | Tamamlandı | [specs/da-05-uret-modern-ux.md](specs/da-05-uret-modern-ux.md) |
| AI-04 | /duzenle marka bağlamı + kategori kuralları eksik | Tamamlandı | [specs/ai-denetim-01.md](specs/ai-denetim-01.md) §P1-1 |
| AI-05 | Platform karakter limiti tutarsızlığı — Hepsiburada 100→150, tek kaynak | Tamamlandı | [specs/ai-denetim-01.md](specs/ai-denetim-01.md) §P1-2 |
| AI-06 | TON_TANIMLARI 3→7 ton genişlet, tek dosyaya taşı | Tamamlandı | [specs/ai-denetim-01.md](specs/ai-denetim-01.md) §P1-3 |
| AI-07 | max_tokens platforma göre + stop_reason:max_tokens yakala | Tamamlandı | [specs/ai-denetim-01.md](specs/ai-denetim-01.md) §P1-4 |
| AI-08 | Çıktı doğrulama — karakter limiti aşımı + yasaklı kelime regex check | Tamamlandı | [specs/ai-denetim-01.md](specs/ai-denetim-01.md) §P1-5 |
| OPS-20 | KVKK + yasal uyumluluk tamamlama | Aziz — hukuki | [specs/kume-11.md](specs/kume-11.md) |

### P2 — Orta vadeli

| ID | Başlık | Durum | Spec |
|---|---|---|---|
| AI-09 | Sosyal üretim DB kaydına prompt_version ekle | Tamamlandı | [specs/ai-denetim-01.md](specs/ai-denetim-01.md) §P2-1 |
| AI-10 | /toplu route sistemPromptOlustur paylaşsın (kategori+yasaklı+marka) | Tamamlandı | [specs/ai-denetim-01.md](specs/ai-denetim-01.md) §P2-2 |
| AI-11 | "Bilinen ürün özellikleri" kuralı kaldır — sadece kullanıcı verisini kullan | Tamamlandı | [specs/ai-denetim-01.md](specs/ai-denetim-01.md) §P2-3 |
| AI-12 | /studio/manken promptuna profil ton + hedef_kitle ekle | Tamamlandı | [specs/ai-denetim-01.md](specs/ai-denetim-01.md) §P2-4 |
| OPS-14~19 | KÜME 11 — operasyonel olgunluk faz 2 | OPS-14/15/16 OK, 17/18/19 açık | [specs/kume-11.md](specs/kume-11.md) |

### P3 — Gelecek / Ertelenmiş

| ID | Başlık | Durum | Spec |
|---|---|---|---|
| NF-01 | Video Kling 3.0 Pro + ses desteği | Ertelenmiş | [specs/nf-01.md](specs/nf-01.md) |
| NF-05 | Premium video — Seedance 2.0 | Ertelenmiş | inline |
| SC-07 | Product snippets — aggregateRating | Gerçek review gelince | inline |
| BLOG-01 | Scheduled task `blog-seo-yazisi` — toplu üretim moduna geçirildi (5-8 yazı/çalışma, çakışma kontrolü, 100 hedef) | Tamamlandı (2026-04-24) | inline |

### Test kalan (kod tamamlandı)

| ID | Başlık | Test |
|---|---|---|
| PE-01 | RMBG video + kit'e ekle | Arka planlı fotoğrafla test |
| PE-02 | Düzenleme API'sine kredi düşümü + sistem prompt | Düzenleme yap → kredi 1 düşsün |
| PE-03 | Video prompt'una stilIpucu ekle | Farklı ton → prompt'ta stil ipucu |
| PE-05 | Video route profil sorgusunu genişlet | Marka profili dolu → video prompt'ta marka bilgisi |
| PE-06 | Sosyal caption ton önceliği | Form ton > profil ton |
| PE-07 | Görsel route'a marka_adi ekle | Scene description'da marka adı |
| PE-08 | Tüm kredi düşümlerini atomik yap | 2 eş zamanlı istek → biri 429 |
| PE-10 | Foto moduna eksik alanlar | Foto modu ek alanlar prompt'ta |
| PE-11 | tonEnMap güncellemesi | Her ton değeriyle test |
| RF-01 | Dead code temizliği | `npm run build && npm run lint` |
| DoD-K0 | KÜME 0 demo testi | 5 ürün × 3 platform = 15 listing |

---

## Inline spec'ler (küçük maddeler)

### AUTH-01: Mobilde Kayıt Engeli — Turnstile Devre Dışı

Kod tamamlandı: `turnstileEnabled = false`. Kalan test:
- [ ] Mobilde kayıt ol → e-posta doğrulama → giriş yap akışı çalışıyor mu?
- [ ] Giriş yap modunda da test

### FY-01: Fiyat Artışı — 49 / 129 / 299 TL

Kod tamamlandı: `lib/paketler.ts` güncellendi, chatbot prompt güncellendi. Kalan test:
- [ ] /fiyatlar sayfasında yeni fiyatlar
- [ ] PaketModal + kredi-yukle doğru fiyat
- [ ] iyzico ödeme doğru tutar

### OPS-07: Sentry Error Monitoring

`@sentry/nextjs` kuruldu. DSN alındıktan sonra:
- [ ] Source maps upload aktif et
- [ ] Alert kuralı: her yeni hata → e-posta
- [ ] Test: kasıtlı hata → Sentry'de görünsün

### CI-01: CI Lint Hataları — 12 Error

`npm run lint` 12 error veriyor, CI kırık. 2 kategori:

**A) `setState in effect` (5 error) — Next.js 15 strict mode kuralı:**
- [ ] `app/(auth)/hesap/marka/page.tsx:64` — setState'i effect dışına al veya `useLayoutEffect` kullan
- [ ] `components/RefBanner.tsx:17` — aynı pattern
- [ ] `components/tanitim/BenefitsGrid.tsx:20` — aynı pattern
- [ ] `components/tanitim/HowItWorks.tsx:18` — aynı pattern
- [ ] `lib/feature-flags.ts:25` — aynı pattern

**B) Prototype dosyaları `<a>` yerine `<Link>` (7 error):**
- [ ] `yzliste-uret-prototype.tsx` (root) — `.eslintignore`'a ekle veya sil
- [ ] `docs/redesign/yzliste-uret-prototype.tsx` — `.eslintignore`'a ekle veya sil

**En hızlı çözüm:** Prototype dosyalarını `.eslintignore`'a ekle (7 error gider), setState hatalarını `startTransition` veya koşullu çağrıya çevir (5 error gider).

### NF-05: Premium Video — Seedance 2.0

Ertelenmiş. Seedance 2.0 fal.ai'de mevcut, 2K@60fps, native audio. Maliyet ~$0.24-0.30/sn. Demo sonrası değerlendirilecek.

---

## DoD (Definition of Done) — Küme bazlı bekleyen testler

| Küme | DoD | Durum |
|---|---|---|
| K0 | 5 ürün × 3 platform = 15 listing, görsel + video | Test kaldı |
| K1 | Geri tuşu modal kapatıyor, /fiyatlar SSR, kredi 3 yerde aynı | Kısmen |
| K2 | PostHog 9 event + $pageview, consent reddi = 0 event | Audit kaldı |
| K3 | Sitemap submit, view-source farklı title, Rich Results pass | Kısmen |
| K4 | Security headers, 60. istekte 429, CSP raporu | Test kaldı |
| K5 | 3 belge hukukçu onayı | Aziz |
| K6 | Test ödeme → Paraşüt fatura → e-posta → indirme | Test kaldı |
| K7 | Platform kuralları, markalı ürün, dashboard metrikleri | Kısmen |
| K8 | Chatbot fiyatları doğru, feedback DB'ye düşüyor | Test kaldı |
| K10 | Sentry test hatası, npm test 5+ pass, CI main'de çalışıyor | Kısmen |

---

## Ertelenmiş (trafik eşiği gelince aç)

Eşik: 1.000 tekil/ay, 100 kayıtlı, 20 gerçek ödeme, 50 günlük üretim — 2'si gerçekleşince backlog'a al.

- F-05 Abonelik paketleri (iyzico subscription)
- F-24 iyzico webhook idempotency + signature verify
- F-15 Mobil QA matrisi (BrowserStack)
- F-27 Görsel/video moderasyon
- F-29 Destek widget + SSS genişletme
- F-21 A11y tam audit (Lighthouse 95+)
- F-32 /changelog + sürüm notu
- F-33 Kredi süre sınırı politikası
- DR-CRO: Sticky CTA + exit-intent modal + CTA sayısı azaltma
- DR-EMAIL: Welcome e-mail dizisi (1/3/7 gün)
- DR-VIRAL: "yzliste ile hazırlandı" rozeti (viral loop)
- DR-SOCIAL: Twitter Card meta + sosyal medya paylaşım önizlemesi
- DR-COMMUNITY: Satıcı topluluğu (Telegram/WhatsApp)
- DR-ANNUAL: Yıllık + kurumsal paket seçenekleri
- DR-CALC: Fiyat sayfası kredi hesaplayıcı widget
- DR-ONBOARD: Kayıt sonrası onboarding wizard (3-4 adım)
- DR-EEAT: Blog sticky tarih + yazar bilgisi (SEO EEAT)

---

## Search Console — Bekleyen aksiyonlar

### SC-02: 14 sayfa "Discovered — currently not indexed"
**Aziz manuel:** Search Console → URL Inspection → Request Indexing: `/blog`, `/fiyatlar`, blog yazıları. Sitemap yeniden submit.

---

## Notlar

- **Tamamlanan işler:** `BACKLOG-DONE.md` dosyasında (RD-01~RD-04, IC-01, LP-01~LP-12, DA-01~DA-04, DR-01~DR-05, PQ-01~PQ-34, QA-01~QA-21, KÜME 9, KÜME 12, ve daha fazlası).
- **AI denetim raporu:** `specs/ai-denetim-01.md` — 12 bulgu, AI-01~AI-12
- **yzstudio detaylı spec:** `specs/nf-02-yzstudio.md`
- **Design system referans:** `docs/redesign/yzliste-design-tokens.md`
            