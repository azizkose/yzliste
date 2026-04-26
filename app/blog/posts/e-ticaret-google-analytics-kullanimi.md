---
slug: e-ticaret-google-analytics-kullanimi
baslik: E-Ticaret İçin Google Analytics Kullanımı: GA4 Kurulum ve Raporlar
ozet: E-ticaret mağazanızda Google Analytics 4 nasıl kurulur? Dönüşüm takibi, kaynak analizi ve satış hunisini görselleştirmek için pratik satıcı rehberi.
yayinTarihi: 2026-04-23
yazarAdi: yzliste Ekibi
okumaSuresi: 5
kategori: İşletme ve SEO
etiketler: google analytics,ga4,analitik,dönüşüm takibi,e-ticaret,kpi
kapakGorsel: 
---

# GİRİŞ

E-ticaret sitesi çalıştırıyorsan veya kendi markanın web sitesi pazaryeri yanında açıksa Google Analytics 4 (GA4) temel ölçüm aracın. GA4, eski Universal Analytics'i değiştirdi ve e-ticaret için dönüşüm takibi, kullanıcı yolculuğu analizi ve gelir attribution sunuyor. Ancak GA4 kurulumu ilk bakışta karmaşık; doğru yapılmadığında yanlış veri topluyor. Bu rehberde GA4'ün e-ticaret için pratik kullanımını ele alacağız.

## GA4 Nedir?

GA4, Google'ın 2023'te geçtiği yeni analitik platformu. Eski versiyon (Universal Analytics) sayfa görüntüleme odaklıyken GA4 olay (event) odaklı. Her kullanıcı etkileşimi bir olay; "ürün görüntüleme", "sepete ekleme", "satın alma" ayrı olaylar olarak kaydediliyor.

Bu yaklaşım e-ticaret için çok daha anlamlı; kullanıcının satın alma yolculuğu aşama aşama takip edilebiliyor. Hangi adımda kaç kullanıcı düştü, hangi kaynaktan gelen kullanıcı en kârlı, hangi ürün en çok görüntülendi — hepsi net görünüyor.

GA4 ücretsiz. Aylık 10 milyon etkinliğe kadar limit yok; küçük-orta e-ticaret satıcılarının büyük çoğunluğu için ücretsiz sürüm yeterli.

## Kurulum Adımları

GA4 kurulumu:

1. analytics.google.com'a gir, hesap oluştur
2. "Mülk" oluştur (mülk = website veya app)
3. Ölçüm kimliği (G-XXXXXXXXXX) al
4. Bu kimliği web sitesinde her sayfanın <head> bölümüne yerleştir (Google Tag Manager ile veya doğrudan)
5. E-ticaret olaylarını aktifleştir

Woocommerce, Shopify, Ticimax, IdeaSoft gibi yaygın platformlar GA4 entegrasyon eklentisi sunuyor. Eklenti ile kurulum 10-15 dakikaya iniyor; manuel kurulum 1-2 saat.

Kurulumdan sonra 24-48 saat veri birikmesini bekle; sonra raporlar anlamlı hale geliyor.

## E-Ticaret Olayları

GA4'te takip edilmesi gereken temel e-ticaret olayları:

- view_item_list: kategori sayfası görüntüleme
- view_item: ürün detay sayfası görüntüleme
- add_to_cart: sepete ekleme
- view_cart: sepet sayfası görüntüleme
- begin_checkout: ödemeye geçme
- add_payment_info: ödeme bilgisi girme
- purchase: satın alma tamamlandı

Bu olaylar aktif edildiğinde GA4 otomatik olarak "satış hunisi" raporu üretiyor. Hangi adımda kaç kullanıcı düştü net görünüyor.

Ekstra olaylar: login, sign_up, search (arama), share (paylaşım). Bu olaylar kullanıcı davranışını detaylandırıyor.

## Önemli Raporlar

GA4'te e-ticaret için en değerli raporlar:

Kullanıcı Edinme: kullanıcılar hangi kaynaktan geldi? Google arama, reklam, sosyal medya, doğrudan, referans. Her kaynağın dönüşüm oranını görmek reklam bütçesi kararında kritik.

Dönüşüm Hunisi: ürün görüntüleme → sepet → ödeme → satın alma adımlarında kullanıcı düşüşü. Hangi adım kritik kayıp yaratıyor belirlemek iyileştirme yol haritasını veriyor.

Ürün Performansı: hangi ürün en çok görüntülendi, hangisi en çok satıldı, hangisi sepete eklendi ama satın alınmadı. Ürün sayfası optimizasyonu için ham veri.

Kullanıcı Yaşam Boyu Değeri (LTV): tek alışverişlik müşteri mi, tekrar alışveriş yapan mı? LTV ölçümü pazarlama bütçesi kararlarını destekliyor.

Gerçek Zamanlı Rapor: şu anda kaç kullanıcı sitede, hangi sayfadalar, ne yapıyorlar. Kampanya dönemlerinde anlık izleme için değerli.

## UTM Parametreleri

Trafik kaynağını doğru ölçmek için UTM parametreleri gerekli. Her reklam veya sosyal medya linki UTM'li olmalı:

- utm_source: trafik kaynağı (google, facebook, instagram, newsletter)
- utm_medium: kanal (cpc, social, email)
- utm_campaign: kampanya adı (summer_sale_2026)
- utm_content: reklam/post içeriği (banner_a, banner_b)

UTM'siz paylaşılan link "doğrudan trafik" olarak görünüyor; hangi kanaldan geldiği kaybolur. Tüm pazarlama linklerinde UTM disiplini şart.

## 💡 İpucu

GA4'ün "Keşif" özelliğini kullan. Hazır raporlar genel görünüm verir ama kendin özel sorular sormak için Keşif modülü ile serbest-form sorgular oluşturabilirsin. "Mobile kullanıcılar için dönüşüm oranı haftalık değişim" gibi sorular hazır raporlarda yoktur; Keşif'te sen oluşturuyorsun. İlk ay GA4'te Keşif'i keşfetmek uzun vadeli analiz derinliğini açıyor.

## Pazaryeri vs Web Sitesi

Pazaryerinde (Trendyol, Hepsiburada) GA4 yok; pazaryerinin kendi paneli var. GA4 sadece kendi web sitende işe yarıyor. Eğer hem pazaryerinde hem kendi sitende satış yapıyorsan:

Kendi site: GA4 ile detaylı analiz.
Pazaryeri: her pazaryerinin kendi satıcı paneli analytics.

İki veri setini birleştirmek manuel iş. Excel'de ay sonu raporunda her iki kaynağı birleştirirsen toplam performans görünüyor.

## Google Ads Entegrasyonu

Google Ads reklamı yapıyorsan GA4'ü Ads hesabıyla eşleştir. Bu entegrasyon sayesinde hangi reklamın hangi dönüşümü getirdiği otomatik takip ediliyor.

Entegrasyon sonrası Ads panelinde "dönüşüm" sütunu görünüyor. Reklam kampanya optimizasyonu için bu veri kritik; tıklama getiren ama dönüştürmeyen reklamları hızla tespit edip kapatabiliyorsun.

## Gizlilik ve KVKK

GA4 kullanırken KVKK uyumu şart. Gerekenler:

- Gizlilik politikanda GA4 kullanımını belirt
- Cookie consent banner (çerez onay kutusu) göster
- IP anonimleştirme aktif et (GA4'te varsayılan açık)
- Kullanıcının "takibi kapatma" seçeneği olsun

Bu uyum sağlanmadan ciddi para cezası riski var. Cookie consent için vanilla-cookieconsent v3 gibi ücretsiz çözümler mevcut.

## Hedef ve Dönüşüm Kurulumu

GA4'te dönüşüm hedeflerini doğru kurman raporları anlamlı kılıyor. "purchase" olayını otomatik olarak dönüşüm sayar; ama özel dönüşümler de ekleyebilirsin: form doldurma, e-bülten kaydı, hesap oluşturma.

Her dönüşüm için para değeri belirleyebiliyorsun. Satın alma için sipariş tutarı; bültene kayıt için tahmini LTV (örnek: ortalama bülten kaydı 50 TL gelir getiriyorsa 50 TL değer). Bu değerlendirme reklam ROI hesaplamalarını netleştiriyor.

## Yedek ve İhraç

GA4 verisini düzenli olarak ihraç et. Google Sheets entegrasyonu veya CSV export ile aylık veri yedeklemesi yap. GA4'te veri saklama süresi varsayılan 14 ay; uzun vadeli analiz için kendi yedeğin önemli.

## SONUÇ

Google Analytics 4, e-ticaret sitesi olan her satıcının temel veri aracı. Doğru kurulum, UTM disiplini ve düzenli rapor incelemesi ile pazarlama bütçesi, ürün sayfası ve satış hunisi kararları veriyle alınıyor. GA4'ten çıkan içgörüler çoğu zaman listing içeriğinde iyileştirme fırsatlarına işaret ediyor; yzliste ile ürettiğin açıklamaları bu verilere göre güncellemek dönüşüm oranını kademeli olarak yükseltiyor.
