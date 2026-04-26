---
slug: ai-listing-prompt-muhendisligi
baslik: AI Destekli Listing Üretiminde Prompt Mühendisliği İpuçları
ozet: AI listing üreticilerden iyi çıktı almak için nasıl prompt yazmalı? Ürün tanımı, ton seçimi, örnek kullanımı ve iterasyon yaklaşımı bu pratik rehberde.
yayinTarihi: 2026-04-23
yazarAdi: yzliste Ekibi
okumaSuresi: 5
kategori: AI ve Görsel
etiketler: prompt mühendisliği,ai listing,yapay zeka,chatgpt,e-ticaret,içerik üretimi
kapakGorsel: 
---

# GİRİŞ

AI listing üretici kullanmak sandığından daha çok prompt yazma becerisine bağlı. Aynı ürüne "şık bir açıklama yaz" diyen biri yüzeysel çıktı alırken, prompt'u doğru yapılandıran biri pazaryeri kurallarına uygun, dönüşüm odaklı bir metin alıyor. Bu yazıda AI listing üretiminde prompt mühendisliğinin pratik ipuçlarını inceleyeceğiz.

## İyi Bir Prompt Neye Benzer?

AI'ın kaliteli çıktı üretmesi için prompt'un üç temel bileşeni taşıması gerekiyor: bağlam, hedef ve format. Bağlam ürünün ne olduğunu, kimlere yönelik olduğunu ve hangi pazaryerinde yayınlanacağını söyler. Hedef neye ulaşmak istediğini belirtir (dönüşüm, anahtar kelime yerleşimi, marka sesi). Format ise çıktının nasıl yapılandırılmasını istediğini tanımlar (başlık + 5 maddelik özellik + açıklama).

Kötü prompt: "Bu ürün için listing yaz."
İyi prompt: "Bu ürün 25-40 yaş kadın hedef kitlesine yönelik, Trendyol'da satılacak, pamuklu yazlık elbise. SEO odaklı 80 karakterlik başlık, dönüşüm odaklı 3 paragraflık açıklama ve 5 maddelik özellik listesi üret. Ton: profesyonel ama sıcak."

İyi prompt 3-4 cümle uzunluğunda olmasına rağmen AI'a nelere odaklanacağını net söylüyor.

## Bağlamı Somutlaştır

AI, soyut bilgiyi somuta çeviremez; ama somut bilgiyi soyuta çevirebilir. Yani ne kadar somut veri verirsen o kadar iyi çıktı alırsın. "Pamuklu tişört" demek yerine "unisex, %100 pamuk, 180 gr kumaş, İstanbul'da üretim, çift dikiş, 4 beden, 5 renk seçeneği, 250 TL satış fiyatı" demek fark yaratıyor.

Pazaryeri kurallarını prompt'a ekle: "Trendyol başlık kuralı: 120 karakter üst sınır, marka adı başta, ürün tipi sonra." AI bu kuralları bilmezse çıktı pazaryeri reddiyle karşılaşabiliyor. yzliste gibi özel amaçlı araçlarda bu kurallar zaten gömülü; kendi başına ChatGPT ile çalışıyorsan kuralları prompt'a geçirmek zorundasın.

Hedef kitlenin yaş, cinsiyet, gelir grubu ve ilgi alanını kısaca tanımla. "Üniversite öğrencisi, bütçe hassas" ile "35 yaş üzeri profesyonel kadın, kalite odaklı" aynı ürün için çok farklı metinler üretir.

## Ton Seçimi

Ton, prompt'un en gözden kaçan kısmı. Tonu tanımlamazsan AI varsayılan "kurumsal + genel" tonunu veriyor; bu ton her ürüne uymaz. Net ton seçenekleri:

- Profesyonel: "Kurumsal, net, güven verici"
- Sıcak: "Sohbet tonu, samimi, dostane"
- Genç: "Enerjik, kısa cümleler, slang minimum"
- Prestij: "Zarif, sakin, kalite vurgulu"
- Pratik: "Doğrudan, işlevsel, fayda odaklı"

Bir ürün için iki ton dene, hangisinin dönüşüme çevirdiğini ölç. Mobilya satıyorsan prestij, spor malzemesi satıyorsan enerjik, anne-bebek ürünü satıyorsan sıcak ton genellikle uyumlu.

## Örnek Gösterme Tekniği (Few-Shot)

AI'a hedeflediğin çıktı formunun bir örneğini vermek, açıklamadan daha etkili. "Şu formatta yaz" yerine "Şu örnekteki gibi yaz" demek AI için daha anlaşılır. Bir başarılı listing'ini örnek olarak prompt'a eklersen AI onun stil yapısını analiz edip yeni ürüne uyarlıyor.

Örnek prompt yapısı:

"Aşağıda iyi bir listing örneği var:
[önceki listing metni]

Şimdi bu ürün için aynı stil ve formatta bir listing yaz:
[yeni ürün bilgileri]"

Bu teknik büyük mağazalarda özellikle verimli çünkü katalog tutarlılığı sağlıyor; tüm ürünler aynı kalite ve dil standardında oluşuyor.

## İterasyon: İlk Çıktıyla Yetinme

AI ilk çıktısı genellikle iyidir, ama mükemmel değildir. İkinci prompt ile "şunu daha da iyileştir" demek kaliteyi belirgin şekilde yükseltiyor. İyileştirme talep ederken net ol:

- "Başlığı daha SEO odaklı yap, anahtar kelimeyi başa al"
- "Açıklamanın ilk cümlesi daha çarpıcı olsun"
- "Özellik listesini madde sayısını 7'ye çıkar"
- "Ton daha samimi olsun"

Üç iterasyon genellikle yeterli; dördüncü iterasyonda çıktı kendini tekrar etmeye başlıyor. Üçüncü çıktı iyi değilse prompt'u baştan yaz; tek tek düzeltmek yerine sıfırdan farklı bir açıdan başlamak daha verimli.

## 💡 İpucu

Prompt'larını şablona dök. Ürün kategorisi bazlı 5-6 şablon hazırla (giyim, elektronik, ev dekor, kozmetik, aksesuar, gıda). Her kategoride prompt yapısı ve ton farkını önceden belirle. Yeni ürün eklediğinde şablonu kopyala, ürün bilgilerini yapıştır, çıktı al. Şablon yöntemiyle 100 ürünlük katalogu tutarlı stilde çıkarmak mümkün.

## Pazaryeri Bazlı Prompt Farklılaşması

Aynı ürün için farklı pazaryerine göre prompt'un içeriği değişiyor. Trendyol'da başlık formatı "[Marka] [Ürün Tipi] [Ana Özellik] [Alt Özellik]" — bu yapıyı prompt'ta belirt. Amazon'da başlık formatı "[Marka] [Model] [Ürün Tipi], [Özellik 1], [Özellik 2]" — farklı yapı.

Etsy'nin algoritması uzun kuyruk anahtar kelimeleri seviyor; prompt'a "başlıkta 3-4 uzun kuyruk anahtar kelime kullan" ifadesini eklemek kritik. Amazon USA İngilizce ve bullet point odaklı; prompt'u İngilizce yaz ve "5 bullet point açıklama" iste.

## Yaygın Hatalar

Prompt mühendisliğinde sık yapılan üç hata var. Birincisi, aşırı uzun prompt. 500+ kelimelik prompt AI'ın odağını dağıtıyor; 100-150 kelime daha etkili. İkincisi, çelişkili talimat. "Hem kısa hem detaylı olsun" veya "hem profesyonel hem esprili" gibi zıt istekler karışık çıktı üretiyor. Üçüncüsü, hedef kitleyi belirtmemek. "Herkese yönelik" yazdırmak aslında kimseye yönelmemek demek.

Bu üç hatadan kaçınmak için prompt'u yazdıktan sonra okuduğunda "ben bu talimatı net olarak uygulayabilir miydim" sorusunu sor. Cevap evet ise AI için de uygulanabilir.

## SONUÇ

AI listing üretici güçlü bir araç ama çıktının kalitesi büyük oranda prompt'un kalitesine bağlı. Bağlam, hedef ve formatı net tanımlamak, tonu seçmek, örnek vermek ve iterasyonla iyileştirmek — bu dört teknik birlikte ortalama çıktıyı iyi çıktıya dönüştürüyor. yzliste gibi özel amaçlı araçlar pazaryeri kurallarını ve format yapısını içselleştirmiş olduğu için karmaşık prompt yazmana gerek kalmıyor; araç ürün kategorisine uygun prompt'u senin için otomatik kuruyor, sen sadece ürün bilgisini girip çıktıyı kontrol ediyorsun.
