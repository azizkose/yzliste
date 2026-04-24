---
slug: e-ticaret-icin-ai-urun-fotografciligi
baslik: E-Ticaret İçin AI Ürün Fotoğrafçılığı: İdeal Input Nasıl Çekilir?
ozet: AI ürün fotoğrafından en iyi sonucu almak için input fotoğrafın nasıl olmalı? Arka plan, ışık, çözünürlük, açı ve kategoriye özel kurallar bu rehberde.
yayinTarihi: 2026-04-22
yazarAdi: yzliste Ekibi
okumaSuresi: 7
kategori: AI ve Görsel
etiketler: ai ürün fotoğrafı,ürün fotoğrafçılığı,e-ticaret,yapay zeka,görsel içerik,listing
kapakGorsel: 
---

# GİRİŞ

AI ürün fotoğrafçılığı sihir değil — input'un kalitesi output'un kalitesini belirler. yzliste'nin sana verdiği görselin ne kadar iyi çıkacağının büyük bölümü senin çektiğin orijinal fotoğrafa bağlı. İyi bir ham fotoğraftan muhteşem sonuç çıkar, kötü bir ham fotoğraftan ise kullanılabilir ama "eksik" bir sonuç. Bu rehberde telefon veya kamera ile çekeceğin input fotoğrafının nasıl olması gerektiğini, AI'ın tam olarak neyi görmek istediğini ve sık yapılan hataları öğreneceksin.

---

## AI Neyi "Görebilir", Neyi Göremez?

AI ürün görseli pipeline'ı kabaca üç aşamadan geçer: **arka plan temizleme** (RMBG), **ürün tespiti ve maskesi çıkarma**, ardından **stüdyo arka planına yerleştirme**. Her aşamanın başarısı, input fotoğrafındaki belirli özelliklere bağlıdır.

Arka plan temizleme için AI, ürün ile arka plan arasındaki kontrasta bakar. Ürün koyu, arka plan açıksa temizleme çok temiz olur. İkisi de benzer tonlardaysa model kenar kayıpları yapabilir. Ürün tespiti için AI, nesnenin nerede başlayıp nerede bittiğini anlayacak kadar keskin bir odak ister — bulanık fotoğrafta sınırlar belirsiz kalır. Yerleştirme aşamasında ise AI, ürünün "hangi açıdan" çekildiğini analiz eder ve yeni arka plana uygun ışıklandırmayı simüle eder; bu yüzden ürünün üç boyutlu algılanabilmesi için açı kritik.

Kısacası AI senin için fotoğraf çekmiyor, senin fotoğrafını "yeniden giydiriyor". Girdi ne kadar iyiyse, çıktı o kadar iyi olur.

---

## Mükemmel Input Fotoğrafının 5 Temel Kuralı

- **Arka plan:** Düz ve tek renk olmalı — tercihen beyaz, açık gri veya krem. Kumaş desenli, mobilyalı veya karışık arka planlar AI'ın ürünü izole etmesini zorlaştırır. Evde beyaz bir duvar veya büyük bir A3 kağıt yeterli.
- **Işık:** Yumuşak ve dağınık olmalı. Direkt flash ve sert güneş ışığı "parlak noktalar" ve keskin gölge bırakır; AI bunları ürünün parçası sanabilir. En iyi seçim: gündüz penceresinin yanında, tül perde ardında çekim.
- **Odak:** Ürün keskin olmalı, arka plan isterse bulanık. Telefonda "portre modu" yerine normal modda, ürüne iki eliyle dokunarak odak kilitle. Bulanık bir input AI'ı da "tahmin"e iter ve detaylar kaybolur.
- **Çerçeveleme:** Ürün karenin tam ortasında, her kenardan en az %10 boşluk bırakılarak çekilmeli. Kenardan taşan, kırpılmış veya çok uzakta küçük kalan ürün, AI'ın çalışma alanını daraltır.
- **Çözünürlük:** En az 1024×1024 piksel — tercihen 2000 piksel üzeri. Sıkıştırılmış WhatsApp fotoğrafları, düşük bit-rate Instagram indirmesi veya ekran görüntüsü kullanma. Telefonun orijinal galeri hali en iyisi.

---

## Ürün Kategorisine Göre Özel Kurallar

Ürün tipi değiştikçe AI'ın beklediği input da değişir. Üç ana kategoride dikkat edilmesi gerekenler:

**Giyim (virtual try-on için):** yzliste'nin try-on özelliği için en iyi sonuç, kıyafetin **düz yere serilmiş (flat-lay)** veya **sade mankende** fotoğrafıdır. Askıda, buruşuk veya katlanmış şekilde çekme — AI kıyafetin gerçek kesimini anlayamaz. Kıyafetin tamamı karede görünmeli, kollar açık, yaka düzgün. Arka plan yine sade olmalı. Portre formatında (dikey) çekmek en uyumlu boyut (864×1296 oranı idealdir).

**Takı, aksesuar ve küçük nesneler:** Makro çekime geç, ürüne yakın dur. Parlak yüzeylerde (altın, gümüş, cam) ışığı 45 derece açıyla ver — direkt ışık yansıma yapar ve AI bu yansımayı "çizik" sanabilir. Beyaz bir karton üzerine koyup üstten ışık al.

**Ev/yaşam, mutfak, elektronik:** Ölçeği doğru iletmek için ürünü belirgin bir yüzeye yerleştir — tezgah, masa, düz zemin. Yansıyan yüzeylerde (paslanmaz çelik, cam kapı) kendi yansımanı görmemek için telefonu biraz yana al. Büyük ürünlerde (koltuk, gardırop) hafifçe yukarıdan, üç-çeyrek açıyla çek: AI derinliği bu açıda daha iyi yakalar. Elektronikte ekranı kapalı çek; açık ekran AI'ı yanıltıp stüdyo arka planına uymayan ışık yansımaları üretmesine yol açar.

---

## 5 Sık Yapılan Hata

Input fotoğraflarında en çok karşılaştığımız sorunlar ve düzeltmeleri:

- **Karışık arka plan:** Halı deseninin üstünde ürün → AI desen parçalarını ürüne yapıştırır. Düzelt: beyaz kağıt/duvar.
- **Sert tavan spotu:** Üstten direkt LED spot → burun düşüren gölge. Düzelt: spot ile ürün arasına tül veya beyaz kağıt tut.
- **Flash kullanımı:** Parlak ve düz görüntü → AI derinlik algılayamaz. Düzelt: flash kapalı, gündüz ışığı.
- **Fotoğrafı WhatsApp'tan indirmek:** %80'e kadar sıkıştırma, detay kaybı. Düzelt: galeri/iCloud/Google Foto orijinal dosyası.
- **Birden fazla ürün tek karede:** AI hangisini ana ürün sanacak? Düzelt: her ürün ayrı fotoğraf.

---

## Telefonla Profesyonel Görünümlü Görseller: 3 Dakikalık Kurulum

Profesyonel ekipmana ihtiyacın yok. Evde büyük bir pencerenin 1 metre önüne beyaz bir A3 kağıt veya masa örtüsü ser. Pencereden gelen ışığı ürüne dik gelecek şekilde konumlan. Telefonun arka kamerasını (ön değil!) kullan, HDR açık, flash kapalı, zoom yok. Ürüne 30-40 cm mesafede dur, ekrana dokunarak ürünün üzerinde odak kilitle. Üç farklı açıdan (önden, üç-çeyrek, üstten) çek ve en net olanı yzliste'ye yükle — gerisini AI halleder.

---

## SONUÇ

AI ürün fotoğrafçılığı, input kalitesini amplifiye eden bir sistem. Temiz arka plan, yumuşak ışık, keskin odak, doğru çerçeveleme ve yüksek çözünürlük — bu beş temel kural, basit telefon çekiminden profesyonel stüdyo görselleri üretilmesini sağlar. Kategoriye özel küçük ayarlar (giyimde flat-lay, takıda açılı ışık) sonucu bir üst kademeye taşır.

yzliste'nin AI motoru, gönderdiğin fotoğrafı arka planından ayırır, 7 pazaryeri için uygun formatlarda stüdyo arka planına yerleştirir ve varyant görselleri üretir. Sen sadece iyi bir ham fotoğraf çek, gerisi 30 saniyede otomatik. Bir denemeye değer — ilk ürününü yükleyip farkı gör.
