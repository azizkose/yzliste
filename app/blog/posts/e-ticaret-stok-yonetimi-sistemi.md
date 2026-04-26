---
slug: e-ticaret-stok-yonetimi-sistemi
baslik: E-Ticarette Stok Yönetimi: Tükenmeden Önce Tedarik Eden Sistem
ozet: E-ticaret stok yönetimi nasıl yapılır? Min/max seviyeler, ABC analizi, tedarik süresi planlaması ve ERP entegrasyonu için pratik rehber burada.
yayinTarihi: 2026-04-23
yazarAdi: yzliste Ekibi
okumaSuresi: 5
kategori: İşletme ve SEO
etiketler: stok yönetimi,envanter,tedarik zinciri,abc analizi,erp,operasyon
kapakGorsel: 
---

# GİRİŞ

Stok bittiğinde sipariş kaçırırsın; stok fazla olduğunda nakit akışı tıkanır ve depolama maliyeti birikir. İki uç arasındaki dengeyi tutturmak e-ticaretin temel disiplinlerinden biri. Stok yönetimi sezgi ile değil sistem ile yapılmalı. Bu rehberde e-ticaret stok yönetiminin temel kavramlarını, pratik araçlarını ve büyüyen mağaza için altyapı kararlarını ele alacağız.

## Temel Kavramlar

Stok yönetiminde bilmen gereken temel terimler:

Min stok: bu seviyenin altına düşmemesi gereken tampon. Tedarik süresi boyunca satılacak miktar + güvenlik tamponu.

Max stok: depolama maliyeti açısından tutulabilir üst sınır. Aşırı stok hem yer hem nakit kayıp.

Reorder point: yeni tedarik siparişi vermen gereken seviye. Min stok + tedarik süresi içinde beklenen satış.

Lead time (tedarik süresi): siparişin üreticiye/distribütöre verilmesinden ürünün depona ulaşmasına kadar geçen süre.

Stok devir hızı: yıllık satış/ortalama stok. Yüksek devir hızı sağlıklı, düşük devir hızı şişmiş envanter işareti.

Bu kavramları anlamak stok kararlarını netleştiriyor.

## ABC Analizi

ABC analizi, ürünleri ciroya katkılarına göre sınıflandırma yöntemi.

A grubu ürünler: ciroyun %70-80'ini oluşturan, en kritik ürünler. Genelde toplam ürünlerin %15-20'si. Bu grupta stoksuz kalmak felaket; sıkı takip ve cömert güvenlik tamponu gerekli.

B grubu: cironun %15-20'si, toplam ürünlerin %30'u. Orta öncelikli; düzenli takip yeterli.

C grubu: cironun %5-10'u, toplam ürünlerin %50'si. Düşük öncelikli; aşırı stok bağlama, talep geldiğinde getir mantığı uygun.

ABC analizi 3 ayda bir yenilenmeli; ürünlerin grupları zamanla değişebiliyor.

## Tedarik Süresi Planlaması

Tedarik süresi tedarikçi, ülke ve ürün tipine göre değişiyor:

- Yerel tedarikçi (Türkiye): 1-2 hafta
- Avrupa tedarikçisi: 3-4 hafta
- Çin tedarikçisi: 4-8 hafta (deniz yolu) veya 1-2 hafta (hava)
- Kendi üretim: 1-3 hafta (atölye kapasitesine göre)

Tedarik süresine ek olarak gümrük, kabul, depo girişi gibi süreler eklenir. Toplam "kapı-kapı" süre dikkate alınmalı.

Tedarik süresi içinde beklenen satış miktarı = günlük ortalama satış × tedarik gün sayısı. Bu miktar reorder point hesabında kullanılıyor.

## Güvenlik Tamponu

Hesaplanan tedarik miktarına ek olarak güvenlik tamponu eklenir. Tampon nedenleri:

- Talep dalgalanması (sezon, kampanya, viral patlama)
- Tedarik gecikmesi (gümrük, üretim sorunu)
- Kargo hasarı (gelen üründen bir kısmı kullanılamaz)
- Beklenmeyen pazaryeri kampanyası

Tampon büyüklüğü tedarik süresinin %20-30'u kadar olmalı. 4 haftalık tedarik süresinde 1 haftalık ekstra tampon mantıklı.

A grubu ürünler için tampon daha cömert (%30-40), C grubu için daha az (%10-15).

## Stok Takip Yazılımları

Excel ile stok takibi başlangıç için yeterli ama 50+ SKU (ürün çeşidi) olduğunda hatasız sürdürmek zor. Yazılım çözümleri:

ERP sistemleri: Logo, Mikro, SAP gibi büyük çözümler. Pahalı (aylık 500-3000 TL) ama tüm operasyonu (satın alma, stok, satış, muhasebe) tek yerde.

E-ticaret odaklı: Ticimax, IdeaSoft kendi e-ticaret platformlarında stok yönetimi var. Aylık 200-800 TL.

SaaS stok yöneticileri: Lokoo, Stoksay, Inventory Planner gibi özel araçlar. Aylık 300-1000 TL.

Pazaryeri entegratörleri: Kolaysoft, Sentos, Hepsibada-trendyol entegrasyon araçları. Stok senkronizasyonu pazaryerleri arasında otomatik.

## 💡 İpucu

Pazaryerleri arası stok senkronizasyonu büyük problem. Trendyol'da 5 adet stoğun var, Hepsiburada'da da aynı 5 adet gösteriliyor. Aynı anda iki sipariş gelirse 1 müşteriyi bekletmek zorunda kalıyorsun. Pazaryeri entegrasyon yazılımı ile stok merkezi havuzdan beslenmeli; bir pazaryerinde satılan ürün diğerinde otomatik düşmeli. Bu altyapı yokken çoklu pazaryeri operasyonu sürekli kriz.

## Sezonluk Stok Planlama

Sezonluk ürünlerde stok planlaması farklı disiplin. Yaz koleksiyonu Mayıs-Haziran patlar, Eylül'de düşer; sonbahar Ekim-Kasım, kış Aralık-Şubat.

Sezonluk planlama:

3 ay öncesi tedarik başlat. Yaz koleksiyonu Şubat-Martta tedarik edilmeli; Nisan'da depoya girmeli.

Sezon zirvesi öncesi stok tampon yüksek tut. Yaz başında 2-3 aylık satış kapasitesi.

Sezon sonu indirimle erit. Eylül-Ekim'de yaz stoğu indirimle satılmalı; Kasım'a sezonsuz stok kalmamalı.

Sonraki yıl için sezon analizi yap. Hangi ürün patladı, hangisi söndü; sonraki sezon hangileri büyütülmeli.

## Stoksuz Kalma Maliyeti

Stoksuz kalmak cüzdan sızıntısı. Açık maliyetler:

- Kaçırılan satış (anlık ciro kaybı)
- Algoritmik düşüş (pazaryeri stoksuz ürünleri sıralamada geriye iter)
- Sıralamayı geri kazanma maliyeti (yeniden reklam, organik temel kayıp)
- Müşteri kaybı (sıkça stoksuz olan satıcıyı alıcı terk eder)

Bir günlük stoksuzluk algoritmik geri dönüş için 1-2 hafta kayıp anlamına gelebiliyor. Bu yüzden A grubu ürünlerinde tampon cömert olmalı.

## Aşırı Stok Riski

Diğer uç olan aşırı stok da maliyetli:

- Depolama ücreti
- Nakit akışında bağlanma
- Eskime/modası geçme riski (özellikle moda ve elektronikte)
- Yer kaybı (yeni ürünlere alan azalır)

Aşırı stok belirtisi: stok devir hızı kategoriye göre düşük (yılda 4'ten az tur), depo sürekli dolu, indirim kampanyalarına çok ihtiyaç var.

Aşırı stoğun çözümü: indirimli kampanya, paket teklifler (1 al 1 bedava), satış sonrası B2B toptan satış kanalları.

## SONUÇ

Stok yönetimi sezgi ile değil sistemle yapılan bir disiplin. ABC analizi, min/max seviyeler, güvenlik tamponu ve doğru yazılım ile dengeli bir envanter mümkün. Tükenmeden tedarik etmek, şişmeden satmak — bu denge cironun istikrarını ve marjın korunmasını birlikte sağlıyor. Listing içerikleri stok hareketinden bağımsız çalışmıyor; popüler ürünlerin listing'i güçlü olmalı ki stok hızlı dönsün. yzliste ile pazaryeri optimize listing'ler üreterek stok devir hızını desteklemek envanter yönetiminin tamamlayıcı parçası.
