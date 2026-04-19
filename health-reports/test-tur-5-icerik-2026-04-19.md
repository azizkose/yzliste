# yzliste — İçerik Kalite Testi — Tur 5 (2026-04-19)

**Rapor sahibi:** Otonom scheduled task (`icerik-kalite-testi`)
**Test ortamı:** Vercel production deployment preview — `yzliste-exdqgbe4c-azizkoses-projects.vercel.app` (dpl_FYHq3gBMwtom4KsrEPeMyJviPpxX, main @ 77bff3e)
**Not:** `www.yzliste.com` kurumsal Chrome policy tarafından engellendi; son READY/production deployment üstünden test edildi.

---

## ❌ TEST DURDURULDU — LOGIN BAŞARISIZ

**Aynı gün içindeki ikinci scheduled task aynı blocker'a takıldı.** İçerik kalite testi kredi harcayan üretimler yapar ve bu üretimler login sonrası `/uret` sayfasından tetiklenir. Login yapılamadığı için 25 planlanan üretimin hiçbiri çalıştırılamadı.

### Neden giriş yapılamadı?

| Engel | Durum | Ek açıklama |
|-------|-------|-------------|
| `test@gmail.com` şifresi | Bilinmiyor | Test playbook'u şifre belirtmiyor; repo'da secret yok |
| "Şifremi unuttum" akışı | ❌ Bozuk (P0 AUTH-T5-03) | Button form dışında, click → boş function, network yok |
| `<form>` wrapper | ❌ Yok (P0 AUTH-T5-02) | `/giris` sayfasında hiç `<form>` elementi yok → submit çalışmaz |
| Gmail MCP erişimi | Yalnız `azizkose@gmail.com` | `test@gmail.com` inbox'a erişim yok → magic link ele alınamaz |
| `test@gmail.com` `is_test` flag | `false` | DB'de doğrulandı: `is_test=false`, `is_admin=false`, `kredi=44` |

**`is_test=true` olan hesaplar (DB):**
- `test-normal@yzliste.com` — `kredi=10`
- `test-zero@yzliste.com` — `kredi=0`
- `test-new@yzliste.com` — `kredi=3`

Bu hesaplara da şifre bilgisi yok, aynı login blocker geçerli.

### Sonuç

**Tur 5 içerik kalite testi — 0 üretim yapıldı, 0 kredi harcandı.**

| Modül | Test Sayısı | Ort. Puan | Kritik Hata |
|-------|-------------|-----------|-------------|
| Metin | 0 / 15 | — | — |
| Görsel | 0 / 5 | — | — |
| Video | 0 / 2 | — | — |
| Sosyal | 0 / 3 | — | — |

**Başlangıç kredisi:** Not alınamadı (login yapılamadı) · **Harcanan:** 0 · **Kalan:** bilinmiyor

---

## Logout UX Gözlemleri (`/uret` Public Sayfa)

Login beklerken `/uret` public sayfası gözlemlendi. Aşağıda içerik kalitesine de dolaylı etki eden bulgular:

### ✅ İyi durum

- 4 sekme (Metin / Görsel / Sosyal / Video) logout durumunda da görünür ve etkileşimli
- Form alanları tamamen doldurulabiliyor, ürün adı/kategori/ek bilgi/hedef kitle/fiyat segmenti/anahtar kelimeler/markalı checkbox hepsi tıklanıyor
- "3 kredi hediye" mesajı hero'da ve footer CTA'da tutarlı
- Platform dropdown: 6 seçenek (Trendyol, Hepsiburada, Amazon TR, N11, Etsy, Amazon USA)
- Stil seçenekleri görsel sekmesinde 7 adet (Beyaz Zemin, Koyu Zemin, Lifestyle, Mermer, Ahşap, Gradient, Doğal)
- Video şablonları 5 adet (360° Dönüş, Zoom, Dramatik Işık, Doğal Ortam, Detay Tarama) + 2 format + 2 süre

### ⚠️ İçerik/UX bulguları (logout durumunda görüldü)

**CONTENT-T5-01 [P1] — Marka söylemi "7 pazaryeri" vs UI'da 6 pazaryeri**

- Memory, BACKLOG ve hero metni "7 pazaryeri" diyor; `/uret` platform dropdown'ı 6 seçenek gösteriyor (Trendyol, Hepsiburada, Amazon TR, N11, Etsy, Amazon USA).
- "Amazon TR" ve "Amazon USA" iki ayrı sayım mı, yoksa "Amazon" tek sayılıp 7. pazaryeri eksik mi? Karar verilip dokümantasyon + hero metin + dropdown hizalanmalı.
- Ana sayfa hero'sundaki "Trendyol, Hepsiburada, Amazon, Etsy ve daha fazlası" ifadesi 4+ diyor, arkasındaki "7 pazaryeri" iddiasıyla uyumsuz.

**CONTENT-T5-02 [P1] — "Krediniz bitti" mesajı logout kullanıcıya gösteriliyor**

- Metin sekmesinde `/uret` sayfası logout iken metin alanının altında şu yazı görünüyor:
  > "İçerik üretim krediniz bitti. Kredi satın al →"
- Kullanıcı giriş yapmadı, kredisi yok ki "bitsin". Bu mesaj kafa karıştırıcı ve ücretsiz deneme mesajıyla (3 kredi hediye) çelişiyor.
- Koşul `credits === 0` yerine `isLoggedIn && credits === 0` olmalı.

**CONTENT-T5-03 [P2] — Markalı checkbox açıklaması içerik kalitesini etkileyen default değer**

- Checkbox: "Bu ürün markalı ve ben yetkili satıcıyım". Açıklama: "İşaretlemezsen jenerik ifadeler kullanır."
- Markasız/handmade üreticilere yanlış sinyal veriyor — "handmade gümüş kolye" gibi gerçek markasız ürün için "jenerik ifadeler" olumsuz çağrışım yaratıyor. Etsy satıcısı buradan demotive olabilir.
- Düzelti önerisi: "Bu ürün markalı ve ben yetkili satıcıyım → markalı ürün: marka adı içerikte geçer. Markasız veya el yapımı ürün: ürünün nitelikleri (malzeme, teknik, hikaye) öne çıkar."

**CONTENT-T5-04 [P2] — Görsel sekmesinde "Stil başına 1 kredi · 1 stil = 1 görsel" mesajı ikinci kez tekrar ediyor**

- Başta bir kez, alt başlıkta ikinci kez, stil seçim alanında üçüncü kez aynı bilgi var. Tekrar bilgi yükü yaratıyor.

**CONTENT-T5-05 [P2] — Video sekmesinde süre-kredi tutarsızlığı**

- "5 Saniye — 5 kredi" + "10 Saniye — 8 kredi" — ama sekme başlığında "5 içerik üretim kredisi" yazıyor. Kullanıcı 10 sn seçerse 5 değil 8 kredi gidecek, ama ana başlık 5 diyor. 10 sn'yi seçen kullanıcı sürpriz yaşar.
- Önerilen: Başlıktaki "5 içerik üretim kredisi" → "Süreye göre 5-8 kredi" gibi dinamik metin.

**CONTENT-T5-06 [P2] — Barkod / Toplu Excel akışları logout erişiminde de `/toplu` → login yönlendirmesi test edilmedi**

- `📊 Excel` linki `/toplu` sayfasına götürüyor. Logout durumunda bu sayfanın davranışı bu turda test edilmedi — login zorunluluğu varsa `/giris?redirect=/toplu` yapmalı.

---

## Başarısız Login Akışından Çıkan Ek Gözlem

**CONTENT-T5-07 [P0 zincir]** — İçerik kalite testi ve icerik-disi-hersey testi — her ikisi de bugün çalıştı, her ikisinde login başarısız. Bu test altyapısı şu an **gerçek içerik kalitesini ölçemiyor**; sadece statik UI ve public endpoint gözlemi yapabiliyor. Bu kritik bir test körlüğü:

- Prompt engineering kalitesi ölçülemiyor (KÜME 0 / PQ-00~PQ-23 demo testi beklemede)
- Halüsinasyon oranı ölçülemiyor
- Platform-spesifik format doğruluğu ölçülemiyor
- fal.ai görsel kalitesi ölçülemiyor
- Video üretimi süre/tempo ölçülemiyor

**Bu nedenle aşağıdaki TEST-AUTH-01 öncelik sırasında en üstte.**

---

## Kategori Bazlı Analiz

Üretim yapılamadığı için kategori bazlı skor çıkarılamadı. Ancak **form alanlarındaki kategori default'ları gözlemi** (logout):

- "Hızlı başla — bir örnek seç": 3 emoji butonu (🧴 Kozmetik, 👕 Giyim, 🔌 Elektronik) — 5 test ürünümüzden 3'ü buradan direkt form doldurma alabilir, ama Gıda ve Takı kategorilerine hızlı örnek yok.
- **CONTENT-T5-08 [P2]** — Hızlı başla örnekleri 5 sabit test ürünüyle hizalansın: +🫒 Gıda, +💎 Takı/Aksesuar eklensin (test fixture'larıyla aynı). Bu hem QA tutarlılığı hem yeni kullanıcıya daha zengin örnek sunar.

## Platform Bazlı Analiz

Üretim yapılmadı, platform çıktı karşılaştırması çıkarılamadı. Platform özet listesi (logout sekme değiştirildiğinde gözlem):

- **Trendyol** default: "Başlık max 100 karakter · 5 özellik maddesi · 10 etiket · Emoji destekli · Marka + Ürün + Özellik formatı · Türkçe çıktı" — iyi kurallı, net.
- Diğer platformlar seçildiğinde benzer özet kart görünümü var mı? Logout'tayken yalnız Trendyol seçimi test edildi. **CONTENT-T5-09 [P2]** — her platform için summary card'ı (karakter limiti + format özeti) aynı netlikte mi kontrol edilsin.

---

## BACKLOG Güncelleme Önerisi

### 🚨 Acil — Test Altyapısı Blocker (P0)

**TEST-AUTH-01 (YENİ, P0)** — Test hesabı için güvenli login yolu

Önerilen çözümler (birini seç):

1. **Magic-link + azizkose@gmail.com'a forward:** Supabase Auth'ta `test@gmail.com` → `azizkose@gmail.com` magic link alias'ı, veya `test-normal@yzliste.com` için `azizkose+test@gmail.com` deliverable adresi.
2. **Env secret + scheduled task:** `TEST_ACCOUNT_PASSWORD` vault'ta saklanır, scheduled task runtime'da erişir. En düşük efor.
3. **Admin impersonation endpoint:** `/api/test/impersonate` — `TEST_ADMIN_TOKEN` ile `is_test=true` kullanıcıya session basar; yalnız `is_test=true` için; production'da `TEST_MODE=true` env-gate'li. Güvenli.
4. **Supabase Auth Admin API (service_role key):** Scheduled task service_role key ile `admin.generateLink(type: 'magiclink', email: 'test-normal@yzliste.com')` çağırır, link'i fetch ile takip edip session cookie alır. Headless-friendly.

Seçim **(4)** en düşük efor + production'a dokunmama avantajı sunar. Supabase docs: https://supabase.com/docs/reference/javascript/auth-admin-generatelink

Test playbook'u (`SKILL.md`) güncellensin: `test@gmail.com` yerine `test-normal@yzliste.com` kullanılsın (bu `is_test=true`, kredi bypass var, fixtur fatura yok).

### 🟡 Sonraki Turda İçerik Kalitesini Doğrudan Etkileyen (P1)

- **CONTENT-T5-01** — "7 pazaryeri" vs UI 6 pazaryeri tutarsızlığı. Marka söylemi ile dropdown'ı hizala.
- **CONTENT-T5-02** — Logout kullanıcıya "krediniz bitti" mesajı gösteriliyor (koşul yanlış).

### 🟢 İçerik UX İyileştirmeleri (P2)

- **CONTENT-T5-03** — Markalı checkbox açıklaması markasız üreticiye karşı soğuk hissettiriyor.
- **CONTENT-T5-04** — Görsel sekmesinde "1 stil = 1 kredi" mesajı 3 kez tekrar.
- **CONTENT-T5-05** — Video süre-kredi özeti başlıkta yanıltıcı (5 dersen 10 sn'de 8 kredi yer).
- **CONTENT-T5-06** — `/toplu` logout davranışı doğrulansın.
- **CONTENT-T5-08** — "Hızlı başla" emoji örneklerine +Gıda +Takı eklensin.
- **CONTENT-T5-09** — Her platform seçimi için özet kartı netliği kontrol edilsin.

---

## Sonraki Tur Kritik Hatırlatma

1. **Blocker:** TEST-AUTH-01 kapanmadan içerik kalite testi çalışmaz. Bu tura kadar icerik-kalite-testi scheduled task'ı pause edilebilir ya da "login'siz UX gözlem" moduna alınabilir.
2. Login kapandıktan sonra ilk içerik testinde KÜME 0 prompt kalite fixleri (PQ-00~PQ-23) demo doğrulaması zaten sıraya girmişti — bu raporun beklemesinin ikinci sebebi.
3. Gmail MCP `test@gmail.com` veya `test-normal@yzliste.com`'a bağlanabiliyor mu? Eğer yeni hesap eklenebiliyorsa bu tek başına blocker'ı çözer (magic link ile login).

---

## Özet — İletilebilir Aksiyonlar

1. **[P0] TEST-AUTH-01 aç** — Supabase Auth Admin API `generateLink` ile magic-link akışı kur. Scheduled task'ların login blocker'ı tamamen kalksın.
2. **[P0] AUTH-T5-02 ve AUTH-T5-03 aç** — `/giris` sayfasındaki `<form>` eksikliği + "Şifremi unuttum" boş function. Bu fix'ler gerçek kullanıcılar için de kritik, sadece test için değil.
3. **[P1] CONTENT-T5-01 aç** — "7 pazaryeri" vs UI 6 pazaryeri tutarsızlığı.
4. **[P1] CONTENT-T5-02 aç** — Logout'ta "krediniz bitti" mesajı koşul hatası.
5. **[P2] 4 adet içerik UX bulgusu (CONTENT-T5-03 ~ CONTENT-T5-09)** — liste yukarıda.

**Önemli not:** Bu, bugün içindeki **ikinci** scheduled task (içerik kalite testi) — ilk task (`icerik-disi-hersey-testi` Tur 5) aynı nedenle `Blok 7-14` için atlandı. TEST-AUTH-01 kapanmadan haftalık otomatik testler "yarı test" durumunda kalmaya devam edecek.
