---
slug: yzliste-api-entegrasyon-erp-baglanti-rehberi
baslik: yzliste API ve ERP Entegrasyonu: Stok, Sipariş ve Listing Akışını Otomatikleştir
ozet: yzliste'in API ve ERP entegrasyon olanakları; ürün senkronizasyonu, stok güncelleme ve sipariş akışını ölçeklendirmek için pratik bir rehber.
yayinTarihi: 2026-04-25
yazarAdi: yzliste Ekibi
okumaSuresi: 7
kategori: Ürün Rehberleri
etiketler: yzliste,api,erp,otomasyon,entegrasyon
kapakGorsel: 
---

# GİRİŞ

Bir noktada her e-ticaret satıcısı manuel kullanımın tıkandığı yere geliyor. Ürün adedi yüzleri geçince, pazaryeri sayısı arttıkça ve sipariş hacmi büyüdükçe panelde tek tek işlem yapmak verim kaybına dönüşüyor. Bu noktada yzliste'in API ve ERP entegrasyon olanakları devreye giriyor. Bu rehberde yzliste'i mevcut iş akışınla nasıl bağlayabileceğini, hangi süreçlerin otomatikleştirilebileceğini ve entegrasyon kurarken nelere dikkat etmen gerektiğini anlatacağız.

---

## Ne zaman entegrasyona ihtiyaç duyarsın?

Manuel kullanım belirli bir ölçeğe kadar verimli. Ama şu sinyaller geldiğinde entegrasyona zaman ayırmanın zamanı gelmiş demektir:

- Ürün sayın 200'ü aştı; tek tek listing güncellemek zaman alıyor
- Birden fazla pazaryerinde aynı ürünü farklı formatta tekrar üretiyorsun
- Stok bilgilerini panel panel girmek günlük rutin haline geldi
- Ürün fiyatını her platformda ayrı düzenliyorsun
- Sipariş sayısı arttı, fatura kesimini manuel takip etmek zorlaşıyor
- ERP ya da muhasebe yazılımın ile pazaryerleri arasında bilgi kopukluğu var

Bu sinyallerin biri bile geldiyse, ölçeği büyütmek için entegrasyon zorunlu. Manuel devam etmek operasyon maliyetini hızla yukarı çekiyor ve hata oranı artıyor.

---

## yzliste API neyi sağlıyor?

yzliste API, dış sistemlerin yzliste'e ürün, listing ve görsel oluşturma işleri için bağlanmasına izin veriyor. Tipik kullanım senaryoları:

- Bir ürün ERP'de oluşturulduğunda yzliste'te otomatik listing taslağı yaratmak
- Mevcut listing'leri sürdürebilmek için fiyat ve stok güncellemelerini API üzerinden iletmek
- Ürün için AI görsel üretimini API çağrısıyla tetiklemek
- Üretilen listing içeriğini doğrudan pazaryeri panellerine ya da kendi e-ticaret sitenize push etmek

API, REST mimarisinde çalışıyor. JSON gövdesiyle istek yapılıyor, yanıt da JSON olarak geri dönüyor. Authorization Bearer token üzerinden yetki yönetimi yapılıyor; her organizasyon kendi API anahtarına sahip oluyor.

API üzerinden yapabileceğin temel işlemler:

- Ürün oluşturma ve güncelleme
- Listing taslağı çekme ve gönderme
- AI görsel üretimini tetikleme
- Stok ve fiyat güncellemesi
- Webhook ile geri bildirim alma

---

## ERP entegrasyonu nasıl kurulur?

ERP yazılımı (Logo, Mikro, Netsis, SAP, Odoo gibi) tipik olarak ürün ve stok yönetiminin merkezinde. yzliste'i ERP ile bağlamak için iki temel yaklaşım var:

**1. Yön: ERP'den yzliste'e**

Yeni bir ürün ERP'ye girildiğinde, yzliste API'sine otomatik olarak push ediliyor. ERP tarafında bir trigger ya da zamanlanmış görev yazılıyor; her değişiklik yzliste'e iletiliyor. Bu yaklaşımın faydası ürünün tek hakikat kaynağı (single source of truth) ERP olarak korunuyor.

**2. Yön: yzliste'ten pazaryerine**

yzliste'te oluşturulan listing, hangi pazaryeri için üretildiyse o platforma push ediliyor. Webhook üzerinden ERP de haberdar edilebiliyor; sipariş geldiğinde stok bilgisi tutarlı kalsın diye.

Pratik uygulama akışı genellikle şöyle çalışıyor:

- ERP'de ürün oluşur — yzliste'e gider
- yzliste AI ile listing taslağı üretir
- Operasyon ekibi taslağı kontrol eder, onay verir
- Onaylı listing pazaryerlerine push edilir
- Sipariş geldiğinde stok düşürülür, ERP haberdar edilir
- Faturalandırma muhasebe sistemine geçer

Tüm akış kurulduğunda satıcının manuel müdahalesi sadece "onay" adımında kalıyor.

---

## Webhook ve geri bildirim akışı

Webhook, yzliste'te bir olay gerçekleştiğinde dış sisteme otomatik bildirim göndermeyi sağlıyor. Tipik webhook tetikleyicileri:

- Listing oluşturma tamamlandı
- AI görsel üretimi bitti
- Pazaryeri push'u başarılı/başarısız oldu
- Kredi tüketimi sınırı aşıldı

Bu olayları kendi sistemine yönlendirip operasyon panelinde takip edebiliyorsun. Örnek kullanım: AI görsel üretimi tamamlandığında ekibe Slack bildirimi gönderme, başarısız push'ları PagerDuty'a düşürme, tükenen kredide muhasebeye uyarı yollatma.

Webhook entegrasyonu kurarken iki şeye dikkat etmek önemli:

- Yetkilendirme — gelen webhook'un gerçekten yzliste'ten geldiğini imza ile doğrula
- Tekrarsızlık — aynı olayın birden fazla kez tetiklenebileceğini düşün; idempotency key kullan

---

## Stok ve fiyat senkronizasyonu

Çoklu pazaryerinde satış yapan satıcı için en sık yaşanan operasyonel hata, stok eşitsizliği. Aynı ürünü Trendyol'da, Hepsiburada'da ve Amazon'da satıyorsun; biri stoktan düşürdüğünde diğerleri haberdar olmuyor. Müşteri sipariş veriyor, ürün yok, iade.

API tabanlı stok senkronizasyonu bu sorunu çözüyor. Tipik çalışma:

- Stok merkezi ERP'de tutulur (örn. depodaki gerçek stok)
- ERP, periyodik olarak (her 5 dakikada bir) yzliste'e güncel stok yollar
- yzliste, bağlı pazaryerlerinin her birine stok bilgisini iletir
- Müşteri sipariş verince, ilgili platform stoktan düşürür ve ERP'ye haber verir

Fiyat senkronizasyonu da benzer mantıkla çalışıyor. ERP'de fiyat güncellendiğinde otomatik olarak tüm pazaryerlerine yansıyor. Pazaryeri özel komisyon farklarını da hesaba katacak şekilde, yzliste API'si platform başına farklı fiyat tanımlayabiliyor.

---

## Entegrasyon kurarken dikkat edilmesi gerekenler

Entegrasyon teknik bir iş ve dikkatsizce yapıldığında yarar yerine zarar getirebiliyor. Pratik öneriler:

- Önce test ortamında dene — yzliste'in sandbox ortamında veri kaybetmeden test yap
- Tek seferde her şeyi entegre etme — önce ürün senkronizasyonu, sonra stok, sonra sipariş
- Hata loglarını izle — her API çağrısının başarı/başarısızlık logu ayrı bir dashboardda olsun
- Geriye dönüş planı hazırla — entegrasyonda hata çıkarsa hangi süreç manuel devam edecek
- Yetki sınırla — API anahtarını sadece gereken yerlerde kullan, hassas bilgi sınırlandır

ERP entegrasyonu kurarken iç ekibinizdeki yazılım geliştiriciyle yzliste teknik desteği arasında hızlı iletişim kurmak süreyi kısaltıyor. Tipik bir ERP entegrasyonu birkaç hafta içinde stabil çalışacak hale geliyor.

---

## BİLGİ KUTUSU

💡 Entegrasyona başlamadan önce mevcut iş akışını bir flowchart ile çiz. Hangi sistem hangi bilgiyi tutuyor, kim kime veri yolluyor, çakışma yaşanan noktalar neresi — net görünür kıldığında entegrasyon planı çok daha sağlıklı çıkıyor. Manuel işlerin %30'unu otomatize ettiğin nokta, çoğunlukla yatırımın geri dönüş yaptığı eşik.

---

## SONUÇ

yzliste API ve ERP entegrasyonu, manuel kullanımın tıkadığı yerden ölçek üzerine çıkmak isteyen satıcılar için tasarlanmış. Doğru kurgulandığında ürün, stok, fiyat ve sipariş süreçleri büyük ölçüde otomatize oluyor; ekip enerjisi operasyonel detay yerine ürün ve müşteri tarafına yöneliyor. Entegrasyon karmaşık bir iş gibi görünse de doğru sırayla, test ortamında ve sınırlı kapsamla başlayan satıcı, birkaç hafta içinde stabil bir akışa kavuşuyor.

yzliste API dokümantasyonu, satıcı panelinin Geliştirici sekmesi altında erişilebilir durumda. Entegrasyon planı için yzliste teknik desteği ekibe özel danışmanlık veriyor. Manuel ile başlayıp ölçeklendikçe API'ye geçmek, çoğu satıcı için doğal yol haritası — yzliste her iki kullanım modeline de aynı zeminden hizmet veriyor.
