export type BlogYazisi = {
  slug: string;
  baslik: string;
  ozet: string; // 150-160 karakter — meta description olarak kullanılır
  yayinTarihi: string; // ISO 8601: "2026-03-15"
  guncellemeTarihi?: string;
  yazarAdi: string;
  okumaSuresi: number; // dakika
  kategori: string;
  etiketler: string[];
  kapakGorsel?: string; // /blog/ altında bir dosya yolu
  icerik: BlogBolum[]; // yazının bölümleri
};

export type BlogBolum = {
  tip: "giris" | "baslik" | "paragraf" | "liste" | "bilgi-kutusu" | "sonuc";
  baslik?: string; // "baslik" tipi için
  metin?: string; // "paragraf", "giris", "bilgi-kutusu", "sonuc" için
  maddeler?: string[]; // "liste" tipi için
};

// ============================================================
// YAZILARI BURAYA EKLE
// Her yazı için bir obje ekle. slug URL'de kullanılır (küçük harf, tire ile).
// ============================================================

export const yazilar: BlogYazisi[] = [
  {
    slug: "trendyol-listing-nasil-yazilir",
    baslik: "Trendyol'da Satışları Artıran Listing Nasıl Yazılır? (2026 Güncel Rehber)",
    ozet:
      "Trendyol algoritmasının öne çıkardığı listing formatını adım adım öğren. Başlık, özellikler, açıklama ve etiket yazımında dikkat edilmesi gereken her şey bu rehberde.",
    yayinTarihi: "2026-03-10",
    yazarAdi: "yzliste Ekibi",
    okumaSuresi: 7,
    kategori: "Platform Rehberleri",
    etiketler: ["trendyol", "listing", "ürün açıklaması", "e-ticaret", "seo"],
    icerik: [
      {
        tip: "giris",
        metin:
          "Trendyol'da yüz binlerce ürün arasından öne çıkmak için iyi bir fotoğraf tek başına yetmez. Platforma özel formatlanmış, arama motorlarının ve Trendyol algoritmasının anlayacağı şekilde yazılmış bir listing şarttır. Bu rehberde Trendyol listing'inin her bölümünü nasıl yazacağını öğreneceksin.",
      },
      {
        tip: "baslik",
        baslik: "1. Başlık: Trendyol'un 100 karakterlik formülü",
      },
      {
        tip: "paragraf",
        metin:
          "Trendyol başlıkları en fazla 100 karakter kabul eder. Formatın şu sırayla gitmesi gerekir: Marka + Ürün Adı + Ana Özellik + İkincil Özellik. Emoji kullanımı Trendyol'da serbesttir ve dikkat çekicidir. Örnek: 'Columbia Erkek Su Geçirmez Bot 🥾 Hakiki Deri | Kışlık | 42 Numara'",
      },
      {
        tip: "baslik",
        baslik: "2. Özellikler: Madde madde, emoji destekli",
      },
      {
        tip: "paragraf",
        metin:
          "Trendyol'da ürün özellikleri en fazla 5 madde olarak girilir. Her maddenin başına uygun bir emoji koyarak görsel zenginlik yaratabilirsin. Önemli olan özelliklerin alıcıya fayda odaklı olması: 'Hakiki deri' yerine 'Hakiki deri — uzun yıllar dayanır' gibi bir ifade dönüşümü artırır.",
      },
      {
        tip: "baslik",
        baslik: "3. Açıklama: 300 kelimeyi verimli kullan",
      },
      {
        tip: "paragraf",
        metin:
          "Trendyol açıklamasında yaklaşık 300 kelime hedefle. İlk iki cümle en önemli kısmıdır çünkü alıcı 'Devamını gör' butonuna basmadan önce sadece bunları okur. Ürünün hikayesini anlat, kullanım senaryosu yaz, rakiplerden farkını belirt.",
      },
      {
        tip: "baslik",
        baslik: "4. Arama etiketleri: Uzun kuyruklu anahtar kelimeler",
      },
      {
        tip: "liste",
        maddeler: [
          "Trendyol'da 10 etiket girebilirsin — tamamını doldur.",
          "Genel terimler (örn: 'bot') yerine uzun kuyruklu terimler kullan (örn: 'kışlık erkek bot 42 numara').",
          "Rakip markaların ürün isimlerini etiket olarak kullanmak Trendyol'da yasaklanmıştır.",
          "Etiketleri test et: 2 haftada bir farklı kombinasyonlar dene ve tıklama oranını karşılaştır.",
        ],
      },
      {
        tip: "bilgi-kutusu",
        metin:
          "💡 İpucu: yzliste'yi kullanarak platform bazında optimize edilmiş başlık, özellik, açıklama ve etiket içeriklerini saniyeler içinde üretebilirsin. Ürün fotoğrafını yükle ya da barkod tara, gerisini YZ halleder.",
      },
      {
        tip: "sonuc",
        metin:
          "Trendyol listing'inde başarı, algoritmanın sevdiği formatı insan okumaya uygun şekilde doldurmaktan geçiyor. Başlıktan etikete kadar her alanı doldur, fayda odaklı yaz ve düzenli olarak güncelle.",
      },
    ],
  },
  {
    slug: "ai-gorsel-uretimi-e-ticaret",
    baslik: "E-Ticarette AI Görsel Üretimi: Profesyonel Fotoğraf Çektirmeden Nasıl Stüdyo Kalitesi Elde Edilir?",
    ozet:
      "Yapay zeka ile ürün görseli üretmenin e-ticaret satışlarına etkisi, hangi platformlarda kullanılabileceği ve adım adım nasıl yapıldığı. Gerçek örnekler dahil.",
    yayinTarihi: "2026-03-20",
    yazarAdi: "yzliste Ekibi",
    okumaSuresi: 6,
    kategori: "AI ve Görsel",
    etiketler: ["ai görsel", "ürün fotoğrafı", "yapay zeka", "e-ticaret", "trendyol görsel"],
    icerik: [
      {
        tip: "giris",
        metin:
          "Trendyol ve Hepsiburada, standart beyaz zemin fotoğrafını zorunlu tutarken Amazon ABD daha yaratıcı görsellere de izin veriyor. Her iki durumda da profesyonel stüdyo çekimi hem pahalı hem zaman alıcı. AI görsel üretimi bu sorunu çözüyor: tek ham fotoğraftan birden fazla stüdyo kalitesi görsel.",
      },
      {
        tip: "baslik",
        baslik: "AI görsel üretimi nasıl çalışır?",
      },
      {
        tip: "paragraf",
        metin:
          "Modern AI görsel araçları iki aşamada çalışır. Önce ürünün arka planını otomatik olarak kaldırır (background removal). Ardından seçtiğin stile — beyaz zemin, koyu zemin, lifestyle ortam — göre yeni bir arka plan ekler ve ışıklandırmayı düzenler. Sonuç, stüdyo çekimiyle neredeyse ayırt edilemez görseller.",
      },
      {
        tip: "baslik",
        baslik: "Hangi platformlarda AI görsel kullanılabilir?",
      },
      {
        tip: "liste",
        maddeler: [
          "Trendyol: Beyaz zemin zorunlu — AI beyaz zemin görseli bu ihtiyacı karşılar.",
          "Hepsiburada: Beyaz zemin tercih edilir, lifestyle desteklenir.",
          "Amazon TR ve ABD: Beyaz zemin zorunlu (main image), lifestyle ek görsellerde kullanılabilir.",
          "Etsy: Lifestyle görseller daha iyi dönüşüm sağlar, AI bu konuda öne çıkar.",
          "N11: Beyaz zemin ve lifestyle görseller desteklenir.",
        ],
      },
      {
        tip: "bilgi-kutusu",
        metin:
          "💡 yzliste'de tek ürün fotoğrafından 3 farklı stilde görsel (Beyaz Zemin, Koyu Zemin, Lifestyle) üretebilirsin. Her stilden 4 varyasyon çıkar — inceleme ücretsiz, sadece indirince 1 kredi düşer.",
      },
      {
        tip: "sonuc",
        metin:
          "AI görsel üretimi, profesyonel stüdyo çekiminin yerini tam olarak alamaz ama e-ticaret listinglerinin büyük çoğunluğu için yeterli kaliteyi çok daha düşük maliyetle sunuyor. Özellikle çok SKU'lu mağazalar için zaman ve maliyet tasarrufu dramatiktir.",
      },
    ],
  },
  {
    slug: "etsy-listing-ingilizce-nasil-yazilir",
    baslik: "Etsy Listing İngilizce Nasıl Yazılır? Yabancı Alıcıları Çeken Başlık ve Açıklama Rehberi",
    ozet:
      "Etsy'de İngilizce listing yazmak için SEO odaklı başlık formülü, 13 etiket stratejisi ve alıcının diline hitap eden açıklama teknikleri. Türk satıcılar için özel rehber.",
    yayinTarihi: "2026-04-01",
    yazarAdi: "yzliste Ekibi",
    okumaSuresi: 8,
    kategori: "Platform Rehberleri",
    etiketler: ["etsy", "ingilizce listing", "etsy seo", "yurt dışı satış", "handmade"],
    icerik: [
      {
        tip: "giris",
        metin:
          "Etsy'de satış yapan Türk satıcılar için en büyük engel İngilizce listing yazmaktır. Yalnızca çeviri yeterli değil — Etsy'nin algoritması, alıcıların arama alışkanlıkları ve platformun kendine özgü dili anlaşılmadan yüksek görünürlük elde etmek çok zor.",
      },
      {
        tip: "baslik",
        baslik: "Etsy başlığı: 140 karakter ve natural English",
      },
      {
        tip: "paragraf",
        metin:
          "Etsy başlığı 140 karakterdir ve 'natural English' prensibini esas alır: bir insanın Google'da yazacağı gibi, keyword stuffing yapmadan. 'Handmade Turkish Copper Coffee Pot, Cezve Set for Two, Traditional Gift' iyi bir örnektir.",
      },
      {
        tip: "baslik",
        baslik: "13 etiket stratejisi",
      },
      {
        tip: "liste",
        maddeler: [
          "Etsy'de 13 etiket hakkın var — tamamını doldur.",
          "Her etiket birden fazla kelimeden oluşabilir: 'turkish coffee gift' gibi.",
          "Başlıkta zaten geçen tek kelimeli terimleri etikette tekrar kullanma — bant genişliği israfı.",
          "Hedef kitleyi düşün: 'wedding gift', 'housewarming gift', 'kitchen decor' gibi niyet tabanlı etiketler ekle.",
          "Rakiplerin etiketlerini Etsy arama çubuğuyla analiz et.",
        ],
      },
      {
        tip: "bilgi-kutusu",
        metin:
          "💡 yzliste, Etsy için özel olarak İngilizce optimizasyonlu başlık, açıklama ve 13 etiket üretir. Ürünü Türkçe tanımla, platform olarak 'Etsy' seç — çıktı otomatik olarak İngilizce gelir.",
      },
      {
        tip: "sonuc",
        metin:
          "Etsy'de başarı, doğru İngilizce kullanımı ve Etsy algoritmasını anlayan etiket stratejisiyle gelir. Özellikle el yapımı ve geleneksel Türk ürünleri için Batı pazarında ciddi bir talep var — sadece doğru şekilde sunulması gerekiyor.",
      },
    ],
  },
];

// Slug'a göre tek yazı döndür
export function yaziGetir(slug: string): BlogYazisi | undefined {
  return yazilar.find((y) => y.slug === slug);
}

// Kategori listesi
export function kategoriler(): string[] {
  return [...new Set(yazilar.map((y) => y.kategori))];
}
