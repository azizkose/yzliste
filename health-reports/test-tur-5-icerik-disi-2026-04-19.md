# yzliste — İçerik Dışı Her Şey Testi — Tur 5 (2026-04-19)

**Rapor sahibi:** Otonom scheduled task (`icerik-disi-hersey-testi`)
**Test ortamı:** Vercel production deployment preview — `yzliste-exdqgbe4c-azizkoses-projects.vercel.app` (dpl_FYHq3gBMwtom4KsrEPeMyJviPpxX, main @ 77bff3e)
**Not:** `www.yzliste.com` kurumsal Chrome policy tarafından engellendi; test READY/production target en son deploy üstünden yapıldı. Canonical değerleri `https://www.yzliste.com/...` production base'e işaret ediyor — bu beklenen ve doğrudur.

---

## Özet

| Blok | Durum | Kritik Bulgu |
|------|-------|--------------|
| 1. Sayfa Erişim ve HTTP | ✅ | 0 |
| 2. SEO Meta | ⚠️ | 6 |
| 3. Sitemap + Robots | ⚠️ | 1 |
| 4. JSON-LD | ✅ | 0 (P2 1) |
| 5. Kayıt Akışı (Gözlem) | ⚠️ | 1 |
| 6. Giriş Akışı | ⚠️ | 2 |
| 7. Header Auth-Aware | ❓ LOGIN BAŞARISIZ | Skip |
| 8. Profil Düzenleme | ❓ LOGIN BAŞARISIZ | Skip |
| 9. Kredi Tutarlılığı | ❓ LOGIN BAŞARISIZ | Skip |
| 10. Hesap Ayarları | ❓ LOGIN BAŞARISIZ | Skip |
| 11. Faturalar | ❓ LOGIN BAŞARISIZ | Skip |
| 12. Fiyatlar ve Ödeme Modalı | ⚠️ Kısmi (logout) | 0 |
| 13. Navigasyon ve Link | ✅ | 0 |
| 14. Çıkış Akışı | ❓ LOGIN BAŞARISIZ | Skip |
| 15. KVKK ve Yasal Uyum | ✅ | 0 |
| 16. Güvenlik Headerları | ✅ | 0 (P2 1) |
| 17. Chatbot | ✅ | 0 |
| 18. Performans | ✅ | 0 |

**Toplam:** 3 P0 · 6 P1 · 3 P2 · 7 blok LOGIN BAŞARISIZ nedeniyle atlandı

---

## Detay

### BLOK 1 — Sayfa Erişim ve HTTP Durumu

Tüm public sayfalar 200, korumalı sayfalar login'e 200-redirect, alias'lar 301-benzeri (fetch `opaqueredirect`), 404 sayfaları 404. Temiz.

| Grup | URL | Status | Sonuç |
|------|-----|--------|-------|
| Public | `/`, `/uret`, `/giris`, `/kayit`, `/fiyatlar`, `/sss`, `/blog`, `/gizlilik`, `/kosullar`, `/hakkimizda`, `/kvkk-aydinlatma`, `/cerez-politikasi`, `/mesafeli-satis`, `/teslimat-iade` | 200 | ✅ |
| Korumalı | `/hesap`, `/hesap/profil`, `/hesap/krediler`, `/hesap/ayarlar`, `/hesap/faturalar` | → `/giris?redirect=...` | ✅ redirect (server) |
| Semi-korumalı | `/profil` | 200, client-side redirect → `/giris` | ⚠️ noindex OK, ama sayfa server 200 dönüyor; GSC için noindex meta koruyor (kısmi risk) |
| Alias 301 | `/login` → `/giris`, `/register` → `/kayit`, `/pricing` → `/fiyatlar` | opaqueredirect | ✅ |
| 404 | `/asdfgh`, `/demo`, `/iletisim` | 404 | ✅ |

**Blog sitemap check:** 20 blog yazısı URL'i 200 dönüyor (spot check 5/5). ✅

---

### BLOK 2 — SEO Meta Kontrol

**Title template fix ✅ (T4-11 doğrulandı):** Tüm sayfalarda çift "yzliste" kaldırılmış. Örnek: `Fiyatlar — E-ticaret Listing Üretici | yzliste` (eskiden `| yzliste | yzliste` idi). Blog title'ları da tek "yzliste" ile kesilmeyecek uzunlukta.

**Canonical sorunları (regresyon):**

| URL | Canonical | Doğru olmalı | Durum |
|-----|-----------|--------------|-------|
| `/cerez-politikasi` | `https://www.yzliste.com` | `https://www.yzliste.com/cerez-politikasi` | ❌ P0 |
| `/kvkk-aydinlatma` | `https://www.yzliste.com` | `https://www.yzliste.com/kvkk-aydinlatma` | ❌ P0 |
| `/profil` | `https://www.yzliste.com` | yok veya kendi URL'i (noindex'te canonical gereksiz) | ❌ P0 |
| `/asdfgh` (404) | `https://www.yzliste.com` | yok (404'te canonical olmamalı) | ❌ P0 |
| `/iletisim` (404) | `https://www.yzliste.com` | yok | ❌ P0 |

Bu sayfaların hepsi `index, follow` veya `noindex` ama canonical root'a işaret ediyor. `index, follow` olanlarda Google bu URL'leri indexden düşürür, ana sayfayı kanonik sayar — SEO kaybı.

**robots meta doğru:**
- 404: `noindex, nofollow` ✅ (T4-13 kısmen — robots OK ama canonical hâlâ var)
- `/giris`, `/kayit`, `/profil`, `/mesafeli-satis`, `/teslimat-iade`: `noindex, nofollow` ✅
- `/`, `/uret`, `/fiyatlar`, `/blog`, `/sss`, `/gizlilik`, `/kosullar`, `/hakkimizda`, `/kvkk-aydinlatma`, `/cerez-politikasi`: `index, follow` ✅

**og:image hâlâ jenerik her yerde (T4-12 regresyon):**

Blog yazılarının hepsinde `og:image = https://www.yzliste.com/og-image.png` (site-geneli jenerik). Beş spot kontrolünde (etsy, amazon, trendyol, profesyonel-foto, instagram) hepsi aynı fallback'e düşüyor. BACKLOG T4-12 fix'i `kapakGorsel → og-image.png fallback` diyor — ama hiç bir yazıda `kapakGorsel` tanımlı değil, yani fallback default durumu oluştu. Her yazıya özel kapak görseli gerekiyor.

**ogTitle çoğu sayfada jenerik:**
Aşağıdaki sayfaların `og:title`'ı jenerik "yzliste — E-ticaret listing için en kolay çözüm":

- /hakkimizda, /sss, /kosullar, /gizlilik, /kayit, /giris, /cerez-politikasi, /kvkk-aydinlatma, /mesafeli-satis, /teslimat-iade, /uret, /profil

Bu sayfaların kendi `<title>` etiketi doğru ama `og:title` sayfa-özgü değil. Sosyal medya paylaşımlarında kötü preview.

**hreflang tutarsız (T4-15 kısmen):**
- hreflang VAR: /cerez-politikasi, /kvkk-aydinlatma, /profil, /asdfgh (404), /iletisim (404) — ilginçtir, çoğunlukla **yanlış canonical'ı olanlar.**
- hreflang YOK: /, /uret, /fiyatlar, /blog, /sss, /gizlilik, /kosullar, /hakkimizda, /mesafeli-satis, /teslimat-iade — SEO'nun asıl sayfaları!

Root layout'ta tanımlı `alternates.languages`'ın, sayfa-özgü metadata override'ında kaybolduğu anlaşılıyor. Muhtemel kök sebep: `/cerez-politikasi` gibi sayfaların kendi metadata'sı yok → root layout'tan miras alıyor. `/fiyatlar` gibi sayfaların kendi `generateMetadata`'sı alternates'ı override ediyor → hreflang kayboluyor.

**HTML entity temiz (T4-14 ✅):** Title/description'larda literal `&amp;`/`&#x27;` yok.

---

### BLOK 3 — Sitemap ve Robots

**sitemap.xml** (25 URL):
- ✅ Olmaması gerekenler yok: `/auth`, `/hesap/*`, `/odeme/*`, `/profil`, `/giris`, `/kayit`, `/iletisim`, `/demo`.
- ✅ Olması gerekenlerin çoğu var: `/`, `/uret`, `/fiyatlar`, `/blog`, `/sss`, 20 blog yazısı.
- ❌ **P1 SITEMAP-T5-01 — Sitemap'te yasal + hakkında sayfaları yok:** `/gizlilik`, `/kosullar`, `/hakkimizda`, `/kvkk-aydinlatma`, `/cerez-politikasi` — hepsi `index, follow` ama sitemap'te yok. Arama motorları bu URL'leri keşfetmeye link takip etmek zorunda — daha yavaş indexasyon.

**robots.txt:**
```
User-Agent: *
Allow: /
Disallow: /api/
Disallow: /admin
Sitemap: https://www.yzliste.com/sitemap.xml
```
- ✅ Sitemap referansı var
- ✅ /api/ ve /admin disallowed
- ⚠️ P2 `/hesap`, `/odeme`, `/profil`, `/giris`, `/kayit` Disallow değil. Noindex meta ile kontrol ediliyor ama explicit Disallow daha güvenli. (Ancak noindex yeterli, bu P2.)

---

### BLOK 4 — JSON-LD Yapısal Veri

**Organization tekrarı temizlenmiş (T4-17 ✅):**

| Sayfa | LD Blok | Types |
|-------|---------|-------|
| `/` | 1 | Organization + SoftwareApplication + WebSite (tek blok, @graph ile) |
| `/uret` | 1 | Aynı (organization only) |
| `/fiyatlar` | 2 | Organization + AggregateOffer |
| `/sss` | 2 | Organization + FAQPage |
| `/blog` | 2 | Organization + Blog |
| `/blog/[slug]` | 2 | Organization + BlogPosting |
| 404 | 1 | Organization (temizlense daha iyi ama bloklamıyor) |

- ✅ Organization 1 kez per page (daha önce 2-3'tü)
- ✅ FAQPage, BlogPosting, Blog, AggregateOffer valid JSON
- ⚠️ P2 `/fiyatlar` şeması `AggregateOffer` — Google rich result için `Product` + `Offer` daha iyi olur (blueprint bunu istiyor).

---

### BLOK 5 — Kayıt Akışı (Gözlem)

`/kayit` sayfası:
- ✅ KVKK checkbox metni doğru: "Kullanım Koşulları ve Gizlilik Politikası'nı okudum, kabul ediyorum."
- ✅ "Mesafeli Satış Sözleşmesi" YOK (istenmeyen)
- ✅ Email + şifre `required` attribute'u mevcut
- ✅ Google ile kayıt butonu var
- ❌ **P1 AUTH-T5-01 — `<form>` wrapper eksik:** Sayfada 0 adet `<form>` elementi var. Submit butonları `type="submit"` olabilir ama hiçbir form'un içinde değil. Enter tuşuyla submit çalışmaz, screen reader form olarak algılamaz.

---

### BLOK 6 — Giriş Akışı

`/giris` sayfası:
- ✅ Email + şifre `required` attribute'u var
- ✅ "Giriş Yap" tab switcher `type="button"` (T4-01 kısmi fix)
- ✅ Google giriş butonu var
- ✅ "Şifremi unuttum" linki görünür
- ❌ **P0 AUTH-T5-02 — `<form>` wrapper eksik, tüm submit butonlar form dışı:** Sayfada 0 `<form>` elementi. 3 "Giriş Yap" etiketli button var (1 Kayıt Ol tab + 1 Giriş Yap tab + 1 main CTA) ve main CTA `type="submit"` ama form'un dışında → HTML spec uyarınca hiçbir şey submit olmuyor. Enter tuşuyla giriş denemesi çalışmıyor. Browser formu doldurma/şifre manager entegrasyonu bozuk.
- ❌ **P0 AUTH-T5-03 — "Şifremi unuttum" butonu işlevsiz (QA-10 onaylandı):** Button `type="submit"`, ama form'un dışında. `onclick = function tT(){}` — boş bir function. Click → hiçbir şey olmuyor, network request yok, alert yok. BACKLOG'daki QA-10 hâlâ açık ve doğrulandı.

**Modal intercepting route:** Ana sayfadan `/giris` linkine tıklanınca URL `/giris`'e dönüşüyor ve dialog-like panel açılıyor (`[role=dialog]` bulundu). Intercepting route muhtemelen çalışıyor ama net gözlem yapılamadı (görsel confirmation).

---

### BLOK 7 — Header Auth-Aware Kontrol (Login Sonrası)

**LOGIN BAŞARISIZ — atlandı.**

- `test@gmail.com` hesabının şifresi bilinmiyor.
- "Şifremi unuttum" akışı işlevsiz (P0 AUTH-T5-03).
- `test@gmail.com` Gmail inbox'una erişim yok (Gmail MCP sadece `azizkose@gmail.com` hesabına bağlı).
- Supabase admin API ile session oluşturma denenmedi (invazif/güvensiz).

**Logout durumunda doğrulandı (referans için):** Ana sayfa header'ı "Ana Sayfa | Fiyatlar | Blog | Giriş Yap | İçerik Üret →" — "Çıkış" yok (beklenen). Login sonrası header testi atlandı.

---

### BLOK 8-11 — Hesap akışları

**TÜMÜ LOGIN BAŞARISIZ — atlandı.** Profil düzenleme, kredi tutarlılığı (T4-05 regresyon kontrolü), hesap ayarları, faturalar sayfaları test edilemedi.

Not: T4-05 (kredi tutarsızlığı) doğrulamak için login şart — gelecek turda mail erişimi sağlanana kadar bu regresyon kontrolü yapılamaz.

---

### BLOK 12 — Fiyatlar ve Ödeme Modalı

`/fiyatlar` (logout durumunda):
- ✅ 3 paket görünüyor — ₺39, ₺99, ₺249
- ✅ "Ücretsiz Başla — 3 Kredi Hediye →" CTA → `/kayit`
- ✅ Paket başlarındaki "Başla" butonları → `/kayit`
- ✅ Sayfa üst kısmında "İçerik Üret →" → `/uret` (FiyatlarCta çalışıyor)
- ⚠️ **Login'li kullanıcı modalı test edilemedi** (LOGIN BAŞARISIZ)

---

### BLOK 13 — Navigasyon ve Link Bütünlüğü

- ✅ **SiteHeader navLinks**: Ana Sayfa(`/`), Fiyatlar(`/fiyatlar`), Blog(`/blog`) — doğru URL'lere gidiyor.
- ✅ **Logo**: `/`'e gidiyor
- ✅ **"İçerik Üret →"**: `/uret`'e gidiyor (her iki durumda da)
- ✅ **FiyatlarCta**: Logout durumunda `/kayit`'e doğru yönlendirdi
- ✅ **Footer linkleri**: Fiyatlar, Blog, Hakkımızda, Kullanım Koşulları, Gizlilik Politikası, Mesafeli Satış, Teslimat ve İade — 8/8 çalışıyor, 404 yok
- ✅ **Footer'da /iletisim yok** (T4-07 doğrulandı)
- ✅ **aktifSayfa highlight**: `/` sayfasında "Ana Sayfa" linki `text-indigo-600 font-medium` aktif rengine sahip. Diğer sayfalarda da beklenen davranış (yalnızca menüdeki 3 link için; /uret menüde yok)
- ✅ **Internal link tarama**: Toplam 12 farklı internal URL — hepsi 200 veya managed redirect

---

### BLOK 14 — Çıkış Akışı (Gerçek Logout)

**LOGIN BAŞARISIZ — atlandı.** Logout akışı test edilemedi. Ancak `/hesap/*` rotalarının logout state'te doğru şekilde `/giris`'e redirect ettiği doğrulandı.

---

### BLOK 15 — KVKK ve Yasal Uyum

- ✅ İlk ziyarette cookie consent banner görünüyor (vanilla-cookieconsent v3)
- ✅ "Tümünü kabul et" ve "Sadece zorunlu" butonları eşit ağırlıkta (aynı `cm__btn` sınıfı), "Tercihlerimi ayarla" secondary styling — KVKK rehberine uygun
- ✅ `/gizlilik` — KVKK formatında veri sorumlusu + amaç + haklar + 6698 referans
- ✅ `/kvkk-aydinlatma` — KVKK formatı tam (hepsi var)
- ✅ `/kosullar`, `/mesafeli-satis`, `/teslimat-iade` — sayfalar yükleniyor, içerik var (kelime sayıları 1300-2000 arası)
- ✅ `/cerez-politikasi` — yükleniyor, KVKK referansı var

---

### BLOK 16 — Güvenlik Headerları

Tüm test edilen sayfalar için:

| Header | Durum |
|--------|-------|
| `Strict-Transport-Security` | ✅ Mevcut (sandbox block nedeniyle değer gözükmüyor) |
| `X-Content-Type-Options: nosniff` | ✅ |
| `X-Frame-Options` | ⚠️ SAMEORIGIN (blueprint DENY istiyor, ama CSP `frame-ancestors 'none'` zaten daha güçlü — effective DENY) |
| `Content-Security-Policy` | ✅ Kapsamlı (nonce + strict-dynamic + object-src 'none' + frame-ancestors 'none') |
| `Referrer-Policy` | ✅ `strict-origin-when-cross-origin` |
| `Permissions-Policy` | ✅ `camera=(self), microphone=(), geolocation=(), interest-cohort=()` |

CSP güvenlik açısından sağlam: iyzipay, Cloudflare Turnstile, GA4, PostHog EU domains whitelisted; frame-src sadece iyzipay; connect-src sadece Supabase + PostHog + Anthropic + GA + Turnstile.

**P2 SEC-T5-01:** X-Frame-Options SAMEORIGIN yerine DENY — CSP zaten koruyor ama header redundancy artar. Düşük öncelik.

---

### BLOK 17 — Chatbot

- ✅ Sayfa köşesinde 💬 indigo buton görünüyor
- ✅ Tıklanınca panel açılıyor — "yzliste destek" başlık + "Merhaba! Listing veya görsel üretim konusunda soru sormak ister misiniz?" açılış mesajı
- ✅ Mesaj input + "Gönder" buton + × close buton mevcut
- ⚠️ "fiyatlar ne?" / "şikayet" / thumbs up-down testi yapılamadı (önemsiz değil ama scheduled test)

---

### BLOK 18 — Performans (Temel)

| Sayfa | TTFB (fetch) | DOM Content Loaded | Load Event | Durum |
|-------|-------------|-------------------|-----------|-------|
| `/` | 298 ms | — | — | ✅ |
| `/uret` | 279 ms | — | — | ✅ |
| `/fiyatlar` | 193 ms | 459 ms | 1158 ms | ✅ < 3s hedef |
| `/blog` | 317 ms | — | — | ✅ |

- ✅ Console: sadece 1 exception — Chrome MetaMask extension kaynaklı (site kodu değil). Sıfır site JS error.
- ✅ Render-blocking uyarısı yok.

---

## Önceki Bulgu Takibi

| Kod | BACKLOG durumu | Bu turda | Not |
|-----|---------------|----------|-----|
| **T4-01** (giris tab button type + form) | [x] | Kısmen ❌ | Tab switcher type=button ✅ ama `<form>` wrapper hâlâ eksik (AUTH-T5-02) |
| **T4-02** (middleware env guard) | [x] | ✅ | /giris, /kayit preview'de 200 dönüyor |
| **T4-03** (auth-aware header + çıkış + kredi rozet) | [x] | ❓ | Login başarısız, doğrulanamadı |
| **T4-04** (header kredi rozeti) | [x] | ❓ | Login başarısız, doğrulanamadı |
| **T4-05** (kredi /profil vs /hesap/krediler) | [x] | ❓ | Login başarısız, doğrulanamadı |
| **T4-06** (/hesap/profil → /profil redirect) | [x] | ✅ | Redirect zinciri doğrulandı |
| **T4-07** (/iletisim) | [x] | ✅ | Footer'da yok, kodda link yok — FP doğrulandı |
| **T4-08** (/demo referansları) | [x] | ✅ | Internal link taramasında /demo yok |
| **T4-09** (/profil noindex) | [x] | ✅ | robots: noindex, nofollow mevcut |
| **T4-10** (canonical /kosullar /gizlilik vb.) | [x] | Kısmen ❌ | /kosullar ✅, /gizlilik ✅ düzeltilmiş. **Ama /cerez-politikasi, /kvkk-aydinlatma, /profil canonical'ları hâlâ kök'e işaret ediyor** |
| **T4-11** (çift yzliste title) | [x] | ✅ | Tüm spot kontrol temiz |
| **T4-12** (blog og:image) | [x] | ❌ **REGRESYON** | 5/5 blog yazısında hâlâ jenerik `og-image.png`. Fix fallback'e düşüyor, kapakGorsel hiç set değil |
| **T4-13** (404 noindex + canonical kaldır) | [x] | Kısmen ❌ | robots: noindex ✅ **ama canonical hâlâ `https://www.yzliste.com` işaret ediyor** (hiç olmamalı) |
| **T4-14** (HTML entity title) | [x] | ✅ | Literal entity yok |
| **T4-15** (hreflang self + x-default) | [x] | Kısmen ❌ | Root layout'ta set edilmiş olmalı ama sadece bazı sayfalarda görünüyor; asıl SEO sayfalarında (/, /uret, /fiyatlar, /blog, /sss, yasal) yok |
| **T4-17** (JSON-LD Organization dup) | [x] | ✅ | @graph ile tek blok, Organization 1 kez |
| **QA-10** (şifre sıfırlama 400) | [ ] | ❌ onaylandı | Form wrapper yok + onclick boş function (tT(){}). Kök sebep AUTH-T5-02 |
| **TEST-INFRA-01** (is_test flag) | [x] | — | Login olmadan doğrulanamaz |
| **TEST-INFRA-02** (5 ürün fixture) | [x] | — | Dosya mevcut (lib/test-fixtures.ts) |

---

## Yeni Bulgular Özeti

### P0 (Bu hafta kapat)

| Kod | Blok | Başlık |
|-----|------|--------|
| **T5-01** | 6 | `/giris` `<form>` wrapper eksik — submit butonları form dışı, Enter çalışmıyor, şifre manager entegrasyonu bozuk (AUTH-T5-02) |
| **T5-02** | 6 | "Şifremi unuttum" işlevsiz — onclick boş function, form yok → click hiçbir şey yapmıyor (QA-10 kök sebep doğrulandı) |
| **T5-03** | 2 | Canonical tag kırık sayfalar: `/cerez-politikasi`, `/kvkk-aydinlatma`, `/profil`, 404 sayfaları — hepsi `https://www.yzliste.com` (kök) işaret ediyor. `index, follow` olanlarda Google bu URL'leri dizinden düşürür (T4-10 regresyon) |

### P1 (2 hafta)

| Kod | Blok | Başlık |
|-----|------|--------|
| **T5-04** | 5 | `/kayit` `<form>` wrapper eksik — aynı kök sebep, form spec uyumsuz |
| **T5-05** | 2 | Blog yazılarında `og:image` hâlâ jenerik — 5/5 örnekte `og-image.png` fallback. Her blog yazısına kapakGorsel frontmatter'a eklenmeli (T4-12 regresyon) |
| **T5-06** | 2 | `og:title` çoğu sayfada jenerik ("yzliste — E-ticaret listing için en kolay çözüm") — hakkimizda, sss, kosullar, gizlilik, kayit, giris, cerez, kvkk, mesafeli, teslimat, uret, profil |
| **T5-07** | 2 | hreflang root layout'tan miras kalmıyor — /, /uret, /fiyatlar, /blog, /sss, /gizlilik, /kosullar, /hakkimizda, /mesafeli-satis, /teslimat-iade'de hreflang yok. Her sayfa `generateMetadata`'sında explicit include etmeli veya root layout'un `alternates.languages`'ı deep-merge olmalı |
| **T5-08** | 3 | Sitemap'te `/gizlilik`, `/kosullar`, `/hakkimizda`, `/kvkk-aydinlatma`, `/cerez-politikasi` yok — hepsi `index, follow` ama crawler keşfi zorlaştırıyor |
| **T5-09** | 2 | `/profil` server-render 200 dönüyor (noindex meta var ama sayfa Google'a 200 verir); client-side redirect yerine server-side `redirect('/giris')` tercih edilmeli — middleware'de auth check + redirect |

### P2 (Fırsat bulunca)

| Kod | Blok | Başlık |
|-----|------|--------|
| **T5-10** | 4 | `/fiyatlar` JSON-LD'de `Product` + `Offer` yok, sadece `AggregateOffer` — Google rich result için Product şeması daha iyi |
| **T5-11** | 16 | `X-Frame-Options` `SAMEORIGIN` yerine `DENY` — CSP frame-ancestors 'none' zaten DENY effective veriyor, düşük öncelik header redundancy |
| **T5-12** | 3 | `robots.txt` `/hesap`, `/odeme`, `/profil`, `/giris`, `/kayit` için explicit `Disallow` — noindex meta ile kontrol ediliyor ama explicit daha güvenli |

---

## BACKLOG Güncelleme Önerisi

### Yeniden açılmalı (`[x]` → `[ ]`):

- **T4-10** — Kısmen regresyon. `/cerez-politikasi`, `/kvkk-aydinlatma`, `/profil` canonical'ları hâlâ kırık + 404 canonical temizlenmemiş. `app/cerez-politikasi/page.tsx`, `app/kvkk-aydinlatma/page.tsx`, `app/profil/layout.tsx`, `app/not-found.tsx`'e doğru canonical ekle (veya kaldır).
- **T4-12** — Blog og:image tam regresyon. Fallback aktif ama kapakGorsel sabit ezik — gerçek blog yazılarına cover image gerekli veya daha iyi fallback strategy (slug-based placeholder image).
- **T4-13** — Kısmen regresyon. 404 robots ✅ ama canonical hâlâ var. `app/not-found.tsx`'ten `metadata.alternates.canonical` kaldır (absolute: '' veya null set).
- **T4-15** — Kısmen regresyon. Root layout alternates.languages her sayfaya geçmiyor (Next.js metadata merge davranışı). Her sayfanın generateMetadata'sında explicit languages ekle veya root layout'un hreflang render'ını kontrol et.
- **T4-01** — Kısmen regresyon. Tab switcher type=button OK ama `<form>` wrapper hâlâ yok. `components/auth/AuthForm.tsx`'e `<form onSubmit={handleSubmit}>` wrapper ekle.

### Yeni eklenmeli:

- **T5-01** / **T5-04** — `/giris` ve `/kayit` sayfalarında `<form>` wrapper. P0.
- **T5-02** — Şifre sıfırlama işlevsel hale getir (`resetPassword` API çağrısı + Supabase `supabase.auth.resetPasswordForEmail`). P0. (Bu QA-10'un kök sebep çözümü.)
- **T5-05** — Blog frontmatter'larına `coverImage` ekle veya slug-based default kapak görseli stratejisi. P1.
- **T5-06** — Sayfa bazlı `openGraph.title` tanımla (her metadata export'ta sayfa-özgü og:title). P1.
- **T5-07** — Her sayfa generateMetadata'sında `alternates.languages` ekle. P1.
- **T5-08** — Sitemap'e yasal + hakkımızda sayfalarını ekle. P1.
- **T5-09** — `/profil` middleware-level auth check + server redirect (client-side 200 dönmek yerine). P1.
- **T5-10** — `/fiyatlar` JSON-LD'ye Product + Offer şeması ekle. P2.

### Test altyapı uyarıları:

- **TEST-AUTH-01 (YENİ)** — Login-gerektiren blokların test edilmesi için:
  - `test@gmail.com` hesabının mail erişimi gerekli (azizkose@gmail.com'dan farklı), veya
  - Supabase admin API ile test-only magic link generate, veya
  - E2E test hesabı için stored password env var (CI'da secret).

  **QA-10 şifre sıfırlama P0 olarak açık kaldığı sürece bu blok açılamaz.**

- **TEST-MCP-01** — Mobil viewport tooling hâlâ açık (Tur 4'ten taşındı).

---

## Test Sınırlamaları (Şeffaflık)

1. **`www.yzliste.com` engelli** — Chrome kurumsal policy; test production deployment URL (dpl_FYHq3g.., 2026-04-19 itibarıyla son READY/production) üstünden yapıldı. CDN-specific davranış (Cloudflare cache, production domain Turnstile/iyzico config) test edilemedi.

2. **LOGIN BAŞARISIZ** — `test@gmail.com` şifresi bilinmiyor, "Şifremi unuttum" işlevsiz (P0-T5-02), Gmail MCP sadece `azizkose@gmail.com`'a bağlı. Blok 7, 8, 9, 10, 11, 14 tamamen atlandı. Blok 12 kısmen yapıldı (logout CTA doğrulandı, modal/iyzico atlandı).

3. **Modal intercepting route** — görsel confirmation yapılamadı (panel açıldı ama tam test edilemedi).

4. **Mobil viewport** — MCP resize window hâlâ etkisiz (T4 sınırlaması devam ediyor).

---

## Özet Tavsiye

**Tur 5'in kritik mesajı:**

Auth akışında **iki adet birbirine bağlı P0 var:** (1) tüm auth sayfalarında `<form>` wrapper eksik, (2) "Şifremi unuttum" işlevsiz. Bu ikisi birlikte kullanıcıların yalnızca Google OAuth ile giriş yapmasını mümkün kılıyor — e-posta/şifre yolu tamamen kırık. Prod'a geçmeden mutlaka fix.

**SEO regresyonları:** T4-10 (canonical), T4-12 (blog og:image), T4-13 (404 canonical), T4-15 (hreflang) — dördü de `[x]` işaretliydi ama bu turda kısmen/tamamen bozuk bulundu. BACKLOG disiplin vurgusu: **prod'da fetch doğrulanmadan `[x]` işaretlenmesin.**

**Öncelik sırası:**
1. Auth form wrapper + şifre sıfırlama (T5-01/02/04) — kullanıcı-blocking P0
2. Canonical ve og:image regresyon fix'leri (T5-03/05/06/07) — SEO yayın kanalını bozuyor
3. Sitemap kapsamı + /profil server redirect (T5-08/09)
4. Test altyapısı — auth erişimi olmadan gelecek turların %40'ı yapılmayacak

**Not:** Login dahil kredi tutarlılığı (T4-05) ve header auth-aware (T4-03) regresyon kontrolü yapılamadı. Mail erişimi veya password reset fix'i olmadan bu maddeler "açık şüphe" olarak bırakılıyor.
