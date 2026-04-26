# yzliste · Strateji kararları arşivi

**Son güncelleme:** Nisan 2026
**Amaç:** Bu dosya Cowork'e gitmez. Senin kaydın — bir karar 6 ay sonra sorgulandığında "neden böyle karar vermiştik" diye bakılır. Değiştirirken eski gerekçenin üstüne yeni gerekçe yazılır, karar geçmişi korunur.

---

## 1. Platform vizyonu

### Karar
yzliste tek ürün değil, **çatı marka**. Altında 4 modül:

1. **Yzlisting** (mevcut) — listing metni, AI görsel, video, sosyal medya
2. **Yzstudio** (0-4 ay) — premium görsel + video stüdyosu, üst düzey profesyonel kalite
3. **Yzcustomerservice** (4-8 ay) — müşteri yorum/soru AI yanıt asistanı
4. **Yzanalysis** (8-14 ay) — performans, fiyat, listing kontrol, "neden satmıyor" analizi

### Gerekçe
- Mikro satıcının tüm iş akışını tek yerden yönetme ihtiyacı var (Roketfy 1.199 TL/ay'a sunduğu paket bunu kanıtlıyor)
- Çok modüllü yapı: tek modülle rekabet etmekten kurumsal konumlanmaya geçiş
- Müşteri başına gelir (ARPU) çoklu modül ile 1.5-3x'e çıkar

### Sıralama gerekçesi
**Yzanalysis neden en sona?** Trendyol public API kısıtlı (fiyat verir, satış verisi vermez), scraping gri alan, Roketfy ile doğrudan çatışma. Önceki modüllerden veri birikimi gelecek, güçlenme zamanına ihtiyaç var.

### Hedef fiyat yapısı (12. ay sonu)
- Yzlisting: 329 TL/ay
- Yzstudio: 199 TL/ay
- Yzcs: 149 TL/ay
- Yzanalysis: 299 TL/ay
- **Tam paket bundle: 749 TL/ay** (%23 indirim — Roketfy 1.199 TL Pro'dan %38 ucuz)

### Ne zaman gözden geçir
Her modül lansmanı sonrası 3 ay kullanım/ödeme verisiyle.

---

## 2. Fiyatlama

### Karar (Nisan 2026)
**Mevcut yapı korunur:** 49 TL / 129 TL / 299 TL kredi paketleri. Abonelik sonra eklenecek.

### Tartışılan alternatifler (reddedildi)
- Giriş 89 TL / 20 kredi + Orta 349 TL / 90 kredi + abonelik 329 TL/ay / 80 kredi — kompleks buldu
- 3 paket + abonelik + ek kredi perki — fazla değişken
- Paket fiyatlarını büyütme (video kredisi 5sn=10, 10sn=20 olduğu için) — zorlayıcı geldi

### Neden şimdi değiştirmedik
- Mevcut 49/129/299 yapısı canlı ve çalışıyor
- Önce UI'ı düzeltelim, fiyat değişikliği ayrı bir yük
- Abonelik kısmı Yzstudio lansmanıyla birlikte düşünülecek — premium modülle abonelik daha anlamlı

### API maliyet uyarısı (akılda kalsın)
- 10 saniye video API maliyeti: 20-80 TL arası
- Mevcut Büyük paket (299 TL / 100 kredi) → 5 adet 10sn video = 100 kredi = brüt 299 TL, API maliyeti 100-400 TL
- **Yani ağır video kullanıcısında paket zarar ediyor.** Bu kullanıcı profili veride izlenmeli.

### Ne zaman yeniden tartışılır
Yzstudio lansmanı öncesi (Ekim 2026 civarı hedef).

---

## 3. Design system

### Kararlar (özet)
- **Primary:** Deep Trust Blue `#1E4DD8`
- **Accent:** Warm Earth `#A87847` (sadece premium konteksti)
- **Font:** Inter + Inter Display (Geist'ten geçiş)
- **Neutral:** Warm Gray (#FAFAF8 → #1A1A17, pure siyah/beyaz yerine)
- **İkonlar:** Lucide (emoji yok)

### Gerekçeler

**Primary neden Deep Trust Blue?**
- İyzico/Akbank gibi Türk finans markalarının tonuna yakın — "para orada" hissi
- Indigo Navy (`#1A3A8F`) çok kurumsal, mikro satıcıya ağır gelir
- Electric Cobalt (`#2563EB`) Linear/Vercel/ChatGPT tonu — "çakma AI" eleştirisini sürdürür
- Risk: indigo'ya yakın. Accent + tipografi disiplini ile dengelenir.

**Accent neden Warm Earth?**
- 5 aday arasından seçildi: Warm Earth, Muted Gold, Deep Rose, Forest Sage, Terracotta
- Deep Rose (moda), Forest Sage (organik), Terracotta (dinamik) — hepsi sektör çağrıştırıyor
- Mikro satıcı sektör-agnostik olmalı — giyim de satıyor, kozmetik de, ev de
- Warm Earth ve Muted Gold en nötr; Warm Earth "zanaatkar premium" hissi mikro satıcıya daha yakın (Etsy, el yapımı, butik)
- Muted Gold daha kurumsal, daha "banker premium" — tercih edilmedi ama yedekte
- **Kritik kural:** accent sadece premium kontekstinde kullanılır, her yerde değil. Nadir kullanım = güçlü etki.

**Font neden Inter?**
- Geist Vercel ekosistemine çok bağlı, "kendi karakteri" zayıf
- Inter: Türkçe karakter desteği (ğ, ş, ç, ı) en iyi açık kaynak font
- Google Fonts, ücretsiz, subset edilmiş, hızlı
- Inter Display başlıklar için optik düzeltmeli — büyük başlıklardaki "amatör harf aralıkları" sorununu çözer
- Karakterli fontlara (Satoshi, General Sans) geçiş için ürün olgun değil
- Ücretli fontlar (Söhne 800$/yıl) 12-18 ay sonra marka revizyonunda

### Değişmeyen prensipler
1. UI'da emoji yok (Lucide ikonlar)
2. Gölge yok (1px border)
3. İki yazı ağırlığı (400 ve 500)
4. Sentence case
5. Tek ana renk sistemi (modül başına farklı renk yok)
6. Accent sadece premium
7. Üç radius değeri (4, 8, 12)
8. Stage direction yok

### Ne zaman gözden geçir
6 ay sonra dönüşüm verisiyle. Önemli değişiklikler (Söhne gibi ücretli font, ana rengin değişmesi) tam bir yeniden tasarım gerektirir — kolay değiştirilmez.

---

## 4. UI redesign sıralaması

### Karar
1. **Üretim ekranı (/uret)** — ilk (amatör hissinin zirvesi, design system en çok burada test edilir)
2. Landing sayfası (/) — sonra
3. Çıktı ekranı (listing sonuçları) — sonra
4. Fiyat sayfası — fiyat değişikliği gelince

### Gerekçe
- Üretim ekranı: kullanıcının ürünü "denediği" yer. Kötü görünüm = siler çıkar = trial→conversion düşer
- Emoji bombardımanı, renk kakofonisi, shadow fazlalığı en görünür burada
- Design system'in en çok komponenti (form, sekme, buton, info bar, select, textarea, card) burada test edilir
- Sonraki sayfalar bu ekranın stilini miras alır — kararlar burada kilitlenir

---

## 5. Veri ve ölçüm

### Kritik metrikler (takip edilecek)
- **Trial → ilk üretim dönüşümü** — UI değişikliği öncesi/sonrası karşılaştır
- **Trial → satın alma dönüşümü** — 30 gün bazlı
- **API maliyet / ortalama paket kullanımı** — video ağırlıklı kullanıcı zarar veriyor mu?
- **Modül kullanım dağılımı** — hangi içerik türü en çok üretiliyor (metin vs görsel vs video vs sosyal)

### Bu veriler olmadan
- Renk değişikliğinin konversiyona etkisi ölçülemez
- Video krediler ağır mı/hafif mi bilinmez
- Hangi modülün (Yzstudio/Yzcs/Yzanalysis) daha önce lansmanı yapılmalı belirsiz

### Ne zaman PostHog/Mixpanel kur
UI redesign bittikten sonra ilk iş. Şu an mevcut HTML'de PostHog (`eu.i.posthog.com`) var, büyük ihtimalle minimal kurulu. İlk iş: funnel event'leri tanımla.

---

## 6. Açık sorular (karar bekliyor)

- **Yzstudio fiyatlaması ne olacak?** — Tek fiyatta (199 TL/ay) mı, freemium mu (5 görsel ücretsiz sonra ödeme) mi?
- **Müşteri servisi modülü dil desteği?** — Türkçe yeterli mi, yoksa çok dilli kurulsun mu (Etsy/Amazon USA için İngilizce şart)?
- **Roketfy ile pazarlama iletişimi?** — Direkt karşılaştırmalı ("Roketfy'nin yarı fiyatına...") mı yoksa kendi dilimizi mi kuralım?
- **Landing sayfasındaki "abonelik yok" sloganı** — abonelik gelince bu slogan neye dönecek?

---

## 7. Sonraki adımlar

### Bu hafta
- [ ] Üretim ekranı (/uret) için Cowork ticket'ı aç — dosyalar hazır
- [ ] Geliştirici (veya Claude Code) ile ticket'ı tartış — dosya yolunu doğrula
- [ ] Lucide + Inter paketleme PR'ı — altyapı değişikliği

### Bu ay
- [ ] /uret redesign tamamlan
- [ ] Landing sayfası redesign ticket'ı aç (/uret bittikten sonra)
- [ ] PostHog funnel event'leri tanımla

### Bu çeyrek
- [ ] Tüm mevcut sayfalar yeni design system'e geçmiş
- [ ] Yzstudio teknik planlaması başlamış
- [ ] Kullanım verileri ilk analizi

---

## 8. Geçmiş kararlar (iptal edildi / ertelendi)

- ~~Giriş 89 TL / 20 kredi paketine geçiş~~ (Nisan 2026 — fiyat değişikliği durduruldu)
- ~~Abonelik 329 TL/ay 80 kredi~~ (Nisan 2026 — Yzstudio lansmanıyla birlikte tekrar değerlendirilecek)
- ~~Geist font korunsun~~ (Nisan 2026 — Inter'e geçildi)
