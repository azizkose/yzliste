# yzliste.com — Haftalık Kapsamlı Test Playbook v2

> Oluşturma: 2026-04-18 · 8 persona · 3 katman · Tek birleşik rapor
> Önceki versiyon: `yzliste-audit-brief.docx` (v1, 5 persona)

## Genel Kurallar

- **Sıklık:** Haftalık (Pazartesi sabah), istenirse elle tetiklenebilir
- **Rapor dili:** Türkçe
- **Rapor formatı:** Markdown → `health-reports/` klasörüne kaydet
- **Ciddi bulgu varsa:** Gmail ile azizkose@gmail.com'a özet gönder
- **Puanlama:** Her kategori 1-10 arası, genel ağırlıklı ortalama
- **Bulgu kodu:** `T4-XX` formatı (Tur 4, sıra numarası). Sonraki turlar T5, T6...
- **Önceki bulgular:** `BACKLOG.md` içindeki QA-XX, HC-XX, PQ-XX maddelerini oku — düzelmiş mi kontrol et

---

## Persona Tanımları (8 Şapka)

### Katman A — Temel Denetim (her turda koşar)

| # | Persona | Odak | Ne arar? |
|---|---------|------|----------|
| 1 | **QA Tester** | Teknik doğruluk | Bozuk akış, JS hata, 404, console error, race condition, state tutarsızlığı |
| 2 | **İlk Kez Gelen Kullanıcı** | Anlaşılabilirlik | 5 saniye testi, bilişsel yük, jargon, kaybolma noktaları, "ne yapacağım?" anları |
| 3 | **SaaS Ürün Yöneticisi** | İş değeri | Değer önermesi, onboarding, aktivasyon metriği, özellik keşfedilebilirliği, retention hook |
| 4 | **CRO Uzmanı** | Dönüşüm | Huni sızıntısı, CTA netliği, fiyatlandırma psikolojisi, sosyal kanıt, friction noktaları |
| 5 | **Sistem Denetçisi** | Güvenlik + uyum | KVKK, consent, SSL, CSP header, veri işleme şeffaflığı, yasal belgeler |

### Katman B — Uzman Denetim (her turda koşar)

| # | Persona | Odak | Ne arar? |
|---|---------|------|----------|
| 6 | **SEO Uzmanı** | Arama görünürlüğü | Aşağıda detaylı kontrol listesi |
| 7 | **Mobil UX Tester** | Mobil deneyim | Aşağıda detaylı kontrol listesi |

### Katman C — İçerik Kalite Testi (her turda koşar, kredi harcar)

| # | Persona | Odak | Ne arar? |
|---|---------|------|----------|
| 8 | **Content Tester** | Çıktı kalitesi | Aşağıda detaylı test matrisi |

---

## Katman A — Temel Denetim Kontrol Listesi

### A1. Giriş Öncesi Deneyim (Pre-Login)
- [ ] Ürün 5 saniyede ne yaptığını anlatıyor mu? (Hero başlık + alt başlık)
- [ ] Değer önermesi net mi? Hangi problemi, kime, nasıl çözdüğü anlaşılıyor mu?
- [ ] Güven kırıcıları var mı? (yazım hataları, kırık görsel, tutarsız tasarım)
- [ ] Demo / örnek çıktı / ücretsiz deneme kolayca görülebiliyor mu?
- [ ] CTA'lar tutarlı mı? (Aynı hedefe farklı metinler → kafa karışıklığı)

### A2. Kayıt / Giriş Akışı
- [ ] Kayıt akışı: adım sayısı, gereksiz alan, friction
- [ ] Google giriş çalışıyor mu?
- [ ] Şifre politikası makul mü?
- [ ] Hata mesajları: net, yapıcı, Türkçe mi?
- [ ] "Şifremi unuttum" akışı uçtan uca çalışıyor mu?
- [ ] E-posta doğrulama: kaç saniye, spam'e düşüyor mu?

### A3. Giriş Sonrası İlk Deneyim
- [ ] Doğru sayfaya yönlendirme var mı?
- [ ] İlk ekran beklentiyle örtüşüyor mu?
- [ ] Ana eylem butonu göze batıyor mu?
- [ ] İlk aktivasyon için kaç tıklama gerekiyor? (Hedef: ≤ 3)

### A4. Ana Kullanıcı Akışı (Metin Üretimi)
- [ ] Ürün bilgisi girişi → platform seçimi → üretim → sonuç akışı sorunsuz mu?
- [ ] Loading state'leri anlamlı mı? Tahmini süre gösteriyor mu?
- [ ] Hata durumunda kullanıcıya ne söyleniyor?
- [ ] Sonuç sayfasında kopyalama/indirme çalışıyor mu?

### A5. Ödeme Akışı
- [ ] Kredi satın alma modal'ı düzgün açılıyor mu?
- [ ] Fiyatlar doğru gösteriliyor mu?
- [ ] iyzico entegrasyonu çalışıyor mu? (test ortamında)
- [ ] Başarılı/başarısız ödeme redirect'leri doğru mu?

### A6. Hesap Yönetimi
- [ ] Profil bilgileri görüntüleme/düzenleme
- [ ] Kredi geçmişi doğru mu?
- [ ] Hesap silme akışı çalışıyor mu?
- [ ] Çıkış yapınca tüm state temizleniyor mu?

### A7. KVKK + Yasal Uyum
- [ ] Cookie consent banner görünüyor mu?
- [ ] "Tümünü kabul" ve "Sadece zorunlu" eşit ağırlıkta mı?
- [ ] Gizlilik politikası linki çalışıyor, içerik güncel mi?
- [ ] Kullanım koşulları linki çalışıyor mu?
- [ ] TC Kimlik alanında KVKK aydınlatma + açık rıza var mı?
- [ ] Kayıt checkbox metni doğru sözleşmelere mi referans veriyor?

### A8. Destek + İletişim
- [ ] Destek kanalı (chatbot, e-posta, SSS) erişilebilir mi?
- [ ] SSS sayfası güncel ve yeterli mi?
- [ ] İletişim bilgileri var mı?

---

## Katman B — SEO Uzmanı Kontrol Listesi

### B1. Teknik SEO — Crawlability
- [ ] `robots.txt` — doğru dizinler engelleniyor mu? Blog, fiyatlar gibi public sayfalar açık mı?
- [ ] `sitemap.xml` — tüm public sayfalar var mı? Korumalı sayfalar (/hesap, /odeme, /auth) yok mu?
- [ ] Her sayfanın canonical tag'ı kendi URL'sine mi işaret ediyor?
- [ ] www vs non-www tutarlı mı? (301 redirect)
- [ ] HTTP → HTTPS redirect var mı?
- [ ] Trailing slash tutarlılığı

### B2. Sayfa Bazlı Meta Kontrol
Her public sayfa için kontrol et:

| Sayfa | title (60-80 kar) | description (150-160 kar) | og:title | og:description | og:image | canonical |
|-------|-------------------|---------------------------|----------|----------------|----------|-----------|
| `/` | | | | | | |
| `/giris` | | | | | | |
| `/kayit` | | | | | | |
| `/fiyatlar` | | | | | | |
| `/blog` | | | | | | |
| `/blog/[her-post]` | | | | | | |
| `/sss` | | | | | | |
| `/gizlilik` | | | | | | |
| `/kosullar` | | | | | | |

- [ ] Hiçbir sayfada duplicate title yok
- [ ] Hiçbir sayfada description eksik değil
- [ ] og:image tüm sayfalarda var (1200×630px)

### B3. Yapısal Veri (JSON-LD)
- [ ] Ana sayfa: `Organization` veya `WebSite` schema
- [ ] Blog yazıları: `Article` veya `BlogPosting` schema
- [ ] SSS: `FAQPage` schema
- [ ] Fiyatlar: `Product` veya `SoftwareApplication` schema (opsiyonel)
- [ ] JSON-LD syntax hatasız mı? (Google Rich Results Test)

### B4. İç Link Yapısı
- [ ] Kırık iç link var mı? (tüm href'leri tara, 404 dönen var mı?)
- [ ] Yetim sayfalar var mı? (sitemap'te ama hiçbir yerden linklenmeyen)
- [ ] Blog yazıları birbirine cross-link yapıyor mu?
- [ ] Footer'da tüm önemli sayfalar var mı?

### B5. Performans (Core Web Vitals)
- [ ] LCP (Largest Contentful Paint) < 2.5s
- [ ] FID/INP (Interaction to Next Paint) < 200ms
- [ ] CLS (Cumulative Layout Shift) < 0.1
- [ ] Toplam sayfa boyutu (JS + CSS + images)
- [ ] Render-blocking kaynaklar

### B6. Blog SEO
- [ ] Her blog post'ta H1 var mı? (tek H1)
- [ ] Heading hiyerarşisi doğru mu? (H1 → H2 → H3, atlama yok)
- [ ] İç linkler ve CTA var mı?
- [ ] Yayın tarihi güncel mi? (Gelecek tarihli post yok)
- [ ] Etiketler/kategoriler SEO dostu mu?

---

## Katman C — Mobil UX Tester Kontrol Listesi

### C1. Viewport Testi
Her sayfayı 3 viewport'ta test et:

| Viewport | Cihaz | Genişlik |
|----------|-------|----------|
| Küçük | iPhone SE | 375px |
| Orta | iPhone 14/15 | 390px |
| Tablet | iPad Mini | 768px |

### C2. Sayfa Bazlı Mobil Kontrol

Her sayfa ve her viewport için:
- [ ] İçerik taşıyor mu? (horizontal scroll)
- [ ] Metin okunabilir mi? (min 14px, yeterli kontrast)
- [ ] Touch target'lar yeterli mi? (min 44×44px)
- [ ] Butonlar arası yeterli boşluk var mı? (yanlış tıklama riski)
- [ ] Görseller responsive mi? (aspect ratio bozulmuyor mu?)
- [ ] Modal/popup mobilde düzgün açılıyor/kapanıyor mu?
- [ ] Form input'ları: klavye tipi doğru mu? (email → email klavye, tel → numpad)
- [ ] Sticky header/footer içeriği kapatıyor mu?

### C3. Mobil Spesifik Akışlar
- [ ] Hamburger menü çalışıyor mu? Tüm linkler erişilebilir mi?
- [ ] Swipe/gesture davranışları beklenen gibi mi?
- [ ] Landscape modda layout bozuluyor mu?
- [ ] Sanal klavye açılınca form kayıyor mu / buton gizleniyor mu?
- [ ] Dosya upload (ürün fotoğrafı) mobilde çalışıyor mu?

### C4. Mobil Performans
- [ ] Sayfa yüklenme süresi 3G'de kabul edilebilir mi?
- [ ] Gereksiz büyük asset var mı? (mobilde lazy load)
- [ ] Font yüklenene kadar FOUT/FOIT var mı?

---

## Katman D — Content Tester (İçerik Kalite Testi)

### D1. Test Matrisi

5 ürün kategorisi × 3 platform × 3 çıktı tipi:

**Test Ürünleri (sabit — her turda aynı ürünlerle test et, trendi gör):**

| # | Kategori | Ürün | Marka |
|---|----------|------|-------|
| 1 | Kozmetik | Nemlendirici krem 50ml | Farmasi |
| 2 | Elektronik | Kablosuz kulaklık | Anker |
| 3 | Giyim | Kadın trençkot | Koton |
| 4 | Gıda | Organik zeytinyağı 1L | Tariş |
| 5 | Takı/Aksesuar | Gümüş kolye | El yapımı (markasız) |

**Platform × Çıktı Matrisi:**

| Ürün | Trendyol Metin | Amazon Metin | Etsy Metin | Görsel (3 stil) | Video (2 şablon) |
|------|---------------|-------------|------------|-----------------|-----------------|
| Kozmetik | ✓ | ✓ | ✓ | ✓ | ✓ |
| Elektronik | ✓ | ✓ | - | ✓ | ✓ |
| Giyim | ✓ | ✓ | ✓ | ✓ | ✓ |
| Gıda | ✓ | ✓ | - | ✓ | - |
| Takı | ✓ | - | ✓ | ✓ | ✓ |

**Toplam test sayısı:** ~13 metin + 15 görsel (5×3 stil) + 4 video = ~32 üretim

### D2. Metin Kalite Rubriği (her metin için 1-10)

| Kriter | Ağırlık | Ne kontrol edilir? |
|--------|---------|-------------------|
| **Doğruluk** | %25 | Halüsinasyon var mı? Uydurma özellik/fayda yazılmış mı? |
| **Platform Uyumu** | %25 | Karakter limiti aşılıyor mu? Yasaklı kelime var mı? Platform formatına uygun mu? |
| **Türkçe Kalitesi** | %20 | Gramer, akış, doğallık. Çeviri gibi mi kokuyor? |
| **SEO Uyumu** | %15 | Anahtar kelimeler başlıkta mı? Arama yapan birinin bulacağı terimler var mı? |
| **Satış Gücü** | %15 | Fayda odaklı mı? Duygu tetikliyor mu? CTA var mı? |

**Kritik hatalar (otomatik 0 puan):**
- Yanlış marka adı
- Olmayan özellik iddiası (halüsinasyon)
- Başka ürün/kategori bilgisi karışması
- Rakip marka adı geçmesi
- Platform yasaklı kelime kullanımı

### D3. Görsel Kalite Rubriği (her görsel için 1-10)

| Kriter | Ağırlık | Ne kontrol edilir? |
|--------|---------|-------------------|
| **Ürün Tanınabilirliği** | %30 | Ürün net görünüyor mu? Orijinal fotoğrafa benziyor mu? |
| **Arka Plan Uyumu** | %25 | Stil ile arka plan uyumlu mu? Kenar artefakt var mı? |
| **Profesyonellik** | %25 | Pazaryeri standartlarına uygun mu? Satın alır mısın? |
| **Teknik Kalite** | %20 | Çözünürlük yeterli mi? Renk doğru mu? Bozulma var mı? |

**Kritik hatalar:**
- Ürün tanınmıyor / deforme olmuş
- Arka plan kaldırma başarısız (ürün parçası kesilmiş)
- Metin/watermark artefaktı
- Boyut/oran platform gereksinimine uymuyor

### D4. Video Kalite Rubriği (her video için 1-10)

| Kriter | Ağırlık | Ne kontrol edilir? |
|--------|---------|-------------------|
| **Akışkanlık** | %30 | Donma, atlama, kesinti var mı? |
| **Ürün Sunumu** | %30 | Ürün doğru gösterilmiyor mu? Zoom/pan mantıklı mı? |
| **Profesyonellik** | %20 | Sosyal medyada paylaşılır mı? |
| **Süre/Tempo** | %20 | Çok uzun / çok kısa değil mi? Ritmi doğru mu? |

### D5. Trend Takibi

Her turda aynı ürünleri test et. Raporda önceki turla karşılaştır:
- Ortalama metin puanı: ↑ / ↓ / →
- Ortalama görsel puanı: ↑ / ↓ / →
- Kritik hata sayısı: önceki tur vs bu tur
- En çok gelişen / gerileyen kategori

---

## Rapor Formatı

```
# yzliste.com Haftalık Test Raporu — Tur X (YYYY-MM-DD)

## Özet Skor Tablosu
| Kategori | Skor | Değişim | Kritik Bulgu |
|----------|------|---------|-------------|

## Katman A — Temel Denetim
### Yeni bulgular (T{X}-01, T{X}-02...)
### Önceki bulgular kontrolü (QA-XX, HC-XX düzelmiş mi?)

## Katman B — SEO Denetimi
### Meta tag tablosu
### Kırık link listesi
### Core Web Vitals

## Katman B — Mobil UX
### Viewport test sonuçları (375/390/768)
### Mobil spesifik sorunlar

## Katman C — İçerik Kalitesi
### Puan matrisi (ürün × platform × çıktı tipi)
### Trend (önceki tura göre)
### Kritik hatalar

## Aksiyon Listesi
| # | Bulgu | Öncelik | Persona |
```

---

## Zamanlama

- **Haftalık çalışma:** Her Pazartesi 09:00
- **Manuel tetikleme:** İstenildiğinde "run" ile
- **İlk birkaç hafta:** Günlük de çalıştırılabilir (özellikle kod düzeltmeleri sonrası)
- **Kredi bütçesi:** Content testi turda ~32 üretim ≈ 32 kredi. Haftalık kabul edilebilir mi Aziz'e sor.

---

## Önceki Test Geçmişi

| Tur | Tarih | Tip | Persona Sayısı | Bulgu |
|-----|-------|-----|----------------|-------|
| 1 | 2026-04-16 | Audit (HTML dump) | 5 | 32 bulgu (F-01~F-32) |
| 2 | 2026-04-17 | QA keşif (Chrome) | 1 (QA) | 14 bulgu (B-001~B-014) |
| 3 | 2026-04-18 | QA regresyon (Chrome) | 1 (QA) | 5 yeni + regresyon |
| 4+ | 2026-04-21+ | Kapsamlı (8 persona) | 8 | Bu playbook ile |
