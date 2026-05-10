---
slug: yzliste-toplu-yukleme-csv-excel-rehberi
baslik: yzliste ile Toplu Listing: CSV ve Excel'den 100 Ürün Yükleme Rehberi
ozet: 50, 100 hatta 500 üründen oluşan envanteri tek tek yüklemek günler alır. yzliste'nin toplu yükleme akışı ile CSV/Excel listenizden tüm pazaryerlerine uyumlu listing'leri hazırlama rehberi.
yayinTarihi: 2026-04-07
yazarAdi: yzliste Ekibi
okumaSuresi: 6
kategori: Ürün Rehberleri
etiketler: yzliste,toplu yükleme,csv,excel,operasyon,çoklu pazaryeri,hız
kapakGorsel: 
---

# GİRİŞ

10 ürünü 1 saatte yüklemek hızlıdır; ama 100 ürün için aynı yöntem 10 saat eder. Hacim büyüdüğünde tek tek listing yapma alışkanlığı sürdürülemez. yzliste'nin toplu yükleme akışı, CSV veya Excel olarak hazırladığınız ürün listesini saniyeler içinde okur ve her satır için pazaryerlerine uyumlu listing içeriklerini üretir. Bu yazıda toplu yükleme sürecini adım adım anlatıyor, dosyanızı nasıl hazırlamanız gerektiğini gösteriyoruz.

---

## Toplu Yükleme Hangi Durumda Kullanılır?

Toplu yükleme şu senaryolar için tasarlanmıştır:

- Yeni bir mağaza açılıyor; mevcut envanter (50-500 ürün) kısa sürede listelenecek.
- Yeni bir pazaryerine geçiş yapılıyor; aynı ürünler farklı format ve kurallarla orada da yer almalı.
- Toplu fiyat veya açıklama güncellemesi gerekiyor.
- Aynı ürün ailesinin (örn. 30 farklı renk-beden kombinasyonu) listing içeriği üretilecek.

Tek tek yapmanın anlamlı olduğu durum, manuel inceleme gereken hassas premium ürünlerdir. Standart envanterde toplu akış neredeyse her zaman daha verimlidir.

---

## Dosya Hazırlama: Hangi Sütunlar Olmalı?

yzliste'nin toplu yükleme akışı esnek bir şablon kullanır. Şu sütunlar zorunludur:

- **SKU:** Tekil ürün kodu (örn: YZ-MUG-001)
- **Ürün adı:** Marka + model + ana özellik (örn: "Yzliste Beyaz Seramik Kupa 350ml")
- **Kategori:** Ürünün ait olduğu pazaryeri kategorisi (örn: "Mutfak / Bardak ve Kupalar")
- **Renk / beden / varyant:** İlgiliyse doldurulur
- **Görsel URL'si veya dosya yolu:** Ana görsel için tek link (varsa karusel için ek sütunlar)

İsteğe bağlı sütunlar ise süreci hızlandırır:

- **Fiyat:** Pazaryerlerine birlikte gönderilecekse
- **Stok:** Adet bilgisi
- **Marka:** Ayrı sütun olarak (kategori filtreleri için)
- **Notlar:** Ürünle ilgili özel bilgi (malzeme, paketleme tipi vb.)

---

## Yükleme Adımları

Süreç tipik olarak 5 adımda tamamlanır:

1. **Şablonu indirin:** yzliste panelindeki "Toplu Yükleme" sekmesinden hazır CSV şablonunu indirin.
2. **Dosyayı doldurun:** Excel veya Google Sheets'te şablona göre satırları girin. Görselleri klasör olarak hazırlayın veya URL ile bağlayın.
3. **Yükleyin ve eşleştirin:** Dosyayı yzliste'ye yükleyin. Sistem her sütunu otomatik tanır; gerekirse eşleştirmeyi düzeltirsiniz.
4. **Pazaryerlerini seçin:** Hangi pazaryerleri için listing üretileceğini seçersiniz (Trendyol, Hepsiburada, Amazon TR/USA, N11, Etsy).
5. **Üretimi başlatın:** Sistem her ürün için seçtiğiniz pazaryerlerine uygun başlık, açıklama, anahtar kelime ve özellik seti üretir. Sonuçları inceleyip indirebilirsiniz.

100 ürünlük bir liste için tüm süreç ortalama 10-15 dakika sürer; geleneksel yöntemde aynı iş 1 hafta alabilir.

---

## Çıkan Sonucu Nasıl Kullanırsınız?

yzliste, üretilen içeriği iki formatta sunar:

- **Pazaryeri-spesifik CSV/Excel:** Her pazaryerinin kendi ürün yükleme şablonuna uygun dosya. Trendyol için "Toplu ürün ekleme" şablonu, Amazon için "Inventory Loader" formatı gibi. Doğrudan pazaryeri paneline yükleyebilirsiniz.
- **API entegrasyonu:** Aktif entegrasyonu olan pazaryerlerinde ürünleri tek tıkla göndererek panele uğramadan yayınlayabilirsiniz.

İlk yüklemeden önce 5-10 ürün için sonucu test etmenizi öneririz. Şablon doğru oturduktan sonra geri kalan toplu üretim sorunsuz akar.

---

## BİLGİ KUTUSU

💡 İpucu: Görsellerinizi yüklerken dosya adını SKU ile eşleştirin (YZ-MUG-001.jpg gibi). Sistem dosyaları SKU üzerinden otomatik eşleştirir; manuel sürükle-bırak gerekmez.

---

## Sık Yapılan Hatalar

Toplu yüklemede en çok karşılaşılan sorunlar:

- **Tutarsız SKU:** Bazı satırlarda boşluklu, bazılarında tireli yazılmış SKU'lar sistem eşleşmesini bozar.
- **Eksik kategori bilgisi:** Kategori boş kaldığında AI varsayılan bir kategori atar; pazaryerinde yanlış yere düşebilir.
- **Görsel formatı:** PNG ve JPG dışında format göndermeyin; HEIC veya RAW dosyalar bazı pazaryerlerinde reddedilir.
- **Fiyat birim hatası:** Trendyol KDV dahil, Amazon USA dolar bazlı; aynı sütunu tüm pazaryerlerine vermek hatalıdır.

Bu hatalar üretim öncesi önizlemede yakalanırsa, geri dönüş kolay olur.

---

## Önizleme ve Kalite Kontrolü

yzliste her toplu üretimde sonuçları yayına almadan önce bir "önizleme" sunar. Bu adımda 100 ürün listesinden 5-10 örneği rastgele seçip incelemenizi şiddetle öneririz. Bakacağınız temel noktalar:

- **Başlık doğruluğu:** Marka adı doğru mu, model bilgisi tam mı, anahtar kelime başta mı?
- **Açıklama uyumu:** Üründen bahsediyor mu yoksa genelleme mi yapmış? Kategoriye uygun teknik detay var mı?
- **Özellik seti:** Pazaryerinin zorunlu alanları doldurulmuş mu? "Diğer" veya "Belirtilmemiş" değerleri ne kadar?
- **Anahtar kelime tekrarı:** Aynı kelime başlık ve açıklamada gereğinden fazla geçmiyor mu?

Önizleme aşamasında yakalanan tutarsızlıkların büyük kısmı, şablon dosyasındaki bir sütunu düzelterek toplu olarak çözülür. Bu yüzden ilk hatayı tek tek düzeltmek yerine kök nedeni aramak daha verimlidir.

---

## İleri Kullanım: Şablonu Kendi İş Akışınıza Uydurma

Operasyon olgunlaştıkça yzliste'nin toplu yükleme şablonunu kendi iç sisteminize bağlamak işleri hızlandırır. ERP veya envanter yazılımınızdan günlük olarak çıkan ürün listesini doğrudan yzliste şablonuna dönüştüren bir "ara katman" hazırlayabilirsiniz. Bu sayede yeni ürün geldiğinde, manuel yükleme adımı tamamen ortadan kalkar.

API entegrasyonu olan müşteriler için süreç daha da otomatikleşir; yeni ürün ERP'ye düştüğü anda yzliste içerik üretir, içerik onaylandıktan sonra pazaryeri panellerine otomatik aktarılır. Bu kurulumu bir kez yaptığınızda, satıştan sonraki büyüme aşamasında insan kaynağına yatırım yapmadan listing kapasitesi artırabilirsiniz.

---

## SONUÇ

Toplu yükleme, hacim arttığında yzliste'nin en çok tasarruf sağladığı akıştır. CSV/Excel dosyanızı pazaryeri kurallarını bilen bir AI ile saniyelerde işleyip, doğrudan yükleme dosyalarını alıp panele kayıt edebilirsiniz. Operasyonel zamandan kazandığınız saatleri büyüme, pazarlama ve müşteri hizmetlerine ayırabilirsiniz.

[Hemen dene — ücretsiz başla](/uret)
