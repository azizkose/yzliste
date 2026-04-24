# yzliste Backlog

Aşama: pre-traffic. Demo hazırlığı — içerik kalitesi 1 numara öncelik.

**Kurallar:**
- Her oturumun başında bu dosyayı oku, nerede kaldığımızı anla.
- Detaylı spec gerekiyorsa `specs/{ID}.md` dosyasını oku.
- Bir iş bittiğinde `- [ ]` → `- [x]` olarak güncelle. Yarım iş `[x]` olmaz.
- Tamamlanmış kümelerin detayı `BACKLOG-DONE.md` dosyasında.

---

## Açık işler — Öncelik sırasına göre

### P0 — Acil / Kritik

| ID | Başlık | Durum | Spec |
|---|---|---|---|
| AUTH-01 | Mobilde kayıt engeli — Turnstile devre dışı | Kod OK, mobil test kaldı | inline |
| FY-01 | Fiyat artışı — 49/129/299 TL | Kod OK, test kaldı | inline |
| OPS-07 | Sentry error monitoring | Kısmen OK, DSN sonrası 3 madde | inline |

### P1 — Yakın vadeli

| ID | Başlık | Durum | Spec |
|---|---|---|---|
| LP-08 | Araçlar dropdown — hero kartları + CTA | Tamamlandı | [specs/lp-08.md](specs/lp-08.md) |
| NF-02 | yzstudio — premium araçlar sayfası | Faz 1-3 OK, Faz 4-5 kaldı | [specs/nf-02-yzstudio.md](specs/nf-02-yzstudio.md) |
| NF-06 | Kredi tüketim UX — bilgilendirme + onay | Tamamlandı | [specs/nf-06.md](specs/nf-06.md) |
| REF-01 | Referans programı — davet et, +10 kredi | Tamamlandı | [specs/ref-01.md](specs/ref-01.md) |
| UX-03 | Üretim sayfası navigasyon düzenlemesi | Tamamlandı | [specs/ux-03.md](specs/ux-03.md) |
| LS-01 | Listing skor + ücretsiz revize | Tamamlandı | [specs/ls-01.md](specs/ls-01.md) |
| HERO-VID | Hero video tam versiyon + kırpmasız | Tamamlandı | [specs/hero-video-tam.md](specs/hero-video-tam.md) |
| DA-01 | /uret sayfası tasarım denetimi — 8 düzeltme | Tamamlandı | [specs/da-01-uret-tasarim-denetimi.md](specs/da-01-uret-tasarim-denetimi.md) |
| DA-02 | Ana sayfa tasarım denetimi — 9 düzeltme | Tamamlandı | [specs/da-02-anasayfa-tasarim-denetimi.md](specs/da-02-anasayfa-tasarim-denetimi.md) |
| DA-03 | /giris sayfası UX revizyonu — best practice | Tamamlandı | [specs/da-03-giris-sayfasi-redesign.md](specs/da-03-giris-sayfasi-redesign.md) |
| DA-04 | /yzstudio dark→light + UX revizyonu — 10 madde | Tamamlandı | [specs/da-04-yzstudio-tasarim-denetimi.md](specs/da-04-yzstudio-tasarim-denetimi.md) |
| OPS-20 | KVKK + yasal uyumluluk tamamlama | Aziz — hukuki | [specs/kume-11.md](specs/kume-11.md) |

### P2 — Orta vadeli

| ID | Başlık | Durum | Spec |
|---|---|---|---|
| KF-05 | Blog yazısı güncelle — video hareket | Tamamlandı | [specs/kf-05.md](specs/kf-05.md) |
| LP-10 | Araçlar dropdown — buton düzeni | Açık | inline |
| KG-01 | Kredi geçmişi + kullanım analitiği | Tamamlandı | [specs/kg-01.md](specs/kg-01.md) |
| MP-01 | Mağaza profili genişletme — 4 yeni alan | Tamamlandı | [specs/mp-01.md](specs/mp-01.md) |
| OVERSCROLL | Sayfa sonu overscroll / boş alan temizliği | iOS fix OK, sticky footer kaldı | inline |
| KREDİ-SYNC | Kredi gösterimi tutarsızlığı — tek kaynak | Açık | inline |
| SC-04 | Blog meta description güncelle | Açık | inline |
| NF-04 | fal.ai model takip scheduled task | Açık | inline |
| OPS-14~19 | KÜME 11 — operasyonel olgunluk faz 2 | Açık | [specs/kume-11.md](specs/kume-11.md) |

### P3 — Gelecek / Ertelenmiş

| ID | Başlık | Durum | Spec |
|---|---|---|---|
| NF-01 | Video Kling 3.0 Pro + ses desteği | Ertelenmiş | [specs/nf-01.md](specs/nf-01.md) |
| NF-05 | Premium video — Seedance 2.0 | Ertelenmiş | inline |
| SC-07 | Product snippets — aggregateRating | Gerçek review gelince | inline |

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

### LP-10: Araçlar Dropdown Buton Düzeni

```
components/SiteHeader.tsx'de:
1. "Detaylar" sola, "Kullan →" sağa
2. "Kullan →" buton stili (bg-[#1E4DD8] text-white px-3 py-1 rounded-lg)
3. Mobil hamburger'de de aynı
```

### OVERSCROLL: Sayfa Sonu Boş Alan

iOS overscroll-behavior: none eklendi. Kalan:
- [ ] `/cerez-politikasi`, `/teslimat-iade` — kısa içerik, footer'a kadar boşluk → `flex-1` ile düzelt

### KREDİ-SYNC: Kredi Gösterimi Tutarsızlığı

Tüm kredi gösterimlerini `useCredits()` hook'una bağla. `/hesap/page.tsx` RSC'deki kredi kartını client component'a çevir. staleTime düşür veya invalidate ekle.
- [ ] Üretim sonrası kredi hemen düşsün
- [ ] Kredi satın al → tüm sayfalarda yeni değer
- [ ] `/hesap` → profil → geri → aynı kredi

### NF-04: fal.ai Model Takip

Cowork scheduled task: haftalık Pazartesi, kullandığımız modellerin (Kling, Bria, FASHN) yeni versiyonlarını kontrol et.

### NF-05: Premium Video — Seedance 2.0

Ertelenmiş. Seedance 2.0 fal.ai'de mevcut, 2K@60fps, native audio. Maliyet ~$0.24-0.30/sn. Demo sonrası değerlendirilecek.

### SC-04: Blog Meta Description Güncelle

`app/blog/page.tsx` description'ı dar. 40 blog yazısının kapsamı geniş — description + keywords + OG/Twitter + JSON-LD güncelle.

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

---

## Search Console — Bekleyen aksiyonlar

### SC-02: 14 sayfa "Discovered — currently not indexed"
**Aziz manuel:** Search Console → URL Inspection → Request Indexing: `/blog`, `/fiyatlar`, blog yazıları. Sitemap yeniden submit.

### SC-06: Merchant Listings — image field ✅ DONE
### SC-07: Product Snippets — aggregateRating eksik → gerçek review gelince

---

## Notlar

- **Tamamlanan işler:** `BACKLOG-DONE.md` dosyasında (RD-01~RD-04, IC-01, LP-01~LP-09, PQ-01~PQ-34, QA-01~QA-21, KÜME 9, KÜME 12, ve daha fazlası).
- **yzstudio detaylı spec:** `specs/nf-02-yzstudio.md` (549 satır).
- **Design system referans:** `docs/redesign/yzliste-design-tokens.md`.
- **UI kuralları:** `CLAUDE.md` dosyasında.
- Bir iş için detaylı bilgi gerekiyorsa → `specs/{ID}.md` dosyasını oku.
- `[DECIDE]` olmayan her karar default'la git: TanStack Query v5, PostHog EU, Upstash Redis,