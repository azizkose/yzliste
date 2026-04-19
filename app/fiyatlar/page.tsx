import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { PAKET_LISTESI, MIN_FIYAT, MAX_FIYAT } from "@/lib/paketler";
import FiyatlarCta from "@/components/ui/FiyatlarCta";

export const metadata: Metadata = {
  title: "Fiyatlar — E-ticaret Listing Üretici",
  description:
    "Trendyol, Hepsiburada ve Amazon için listing metni ve AI görsel üretimine dair tüm fiyatlar. Aylık abonelik yok, kullandığın kadar öde. 3 ücretsiz kredi ile başla.",
  keywords: [
    "yzliste fiyatlar",
    "e-ticaret listing fiyat",
    "trendyol listing ücreti",
    "ai görsel üretim fiyat",
    "kredi paketi",
  ],
  openGraph: {
    title: "Fiyatlar | yzliste",
    description: "Kullandığın kadar öde. 3 ücretsiz kredi, abonelik yok.",
    url: "https://www.yzliste.com/fiyatlar",
    type: "website",
    siteName: "yzliste",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "yzliste fiyatlar" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fiyatlar | yzliste",
    description: "Kullandığın kadar öde. 3 ücretsiz kredi, abonelik yok.",
  },
  alternates: {
    canonical: "https://www.yzliste.com/fiyatlar",
    languages: { 'tr': 'https://www.yzliste.com/fiyatlar', 'x-default': 'https://www.yzliste.com/fiyatlar' },
  },
  robots: { index: true, follow: true },
};

// Paketler lib/paketler.ts'den geliyor — fiyat değişikliği için orayı güncelle
const paketler = PAKET_LISTESI;

const krediAciklamalari = [
  {
    ikon: "🎁",
    baslik: "3 ücretsiz kredi ile başla",
    icerik:
      "Kayıt olunca 3 ücretsiz kredi tanımlanır — kredi kartı gerekmez. İstediğin içerik türünü (metin, görsel, video, sosyal medya) denemek için kullanabilirsin.",
  },
  {
    ikon: "📝",
    baslik: "Listing metni — 1 kredi",
    icerik:
      "1 kredi = 1 ürün için tam listing metni. Başlık, madde madde özellikler, açıklama ve arama etiketlerinin tamamı tek seferde gelir. Hepsi ayrı kutularda, tek tıkla kopyalanır.",
  },
  {
    ikon: "📷",
    baslik: "AI görsel — stil başına 1 kredi",
    icerik:
      "7 farklı stil (Beyaz, Koyu, Lifestyle, Mermer, Ahşap, Gradient, Doğal). Seçtiğin her stil için 1 görsel üretilir, kredi üretimde düşer. 1 stil = 1 görsel = 1 kredi.",
  },
  {
    ikon: "🎬",
    baslik: "Video — 5sn: 5 kredi · 10sn: 8 kredi",
    icerik:
      "Ürün fotoğrafından tanıtım videosu üretilir. 5 saniyelik video için 5 kredi, 10 saniyelik için 8 kredi. Dikey (9:16 · Reels/TikTok), kare (1:1 · Feed) veya yatay (16:9 · YouTube) format seçilebilir.",
  },
  {
    ikon: "📱",
    baslik: "Sosyal medya — 1 kredi",
    icerik:
      "1 kredi = Instagram, TikTok, Facebook ve Twitter/X için platform uyumlu caption + hashtag seti. Her platform için ayrı ton ve format ayarlanır.",
  },
  {
    ikon: "🎬",
    baslik: "Video üretimi — 5 veya 8 kredi",
    icerik:
      "Tek ürün fotoğrafından kısa tanıtım videosu üretilir. 5 saniyelik video 5 kredi, 10 saniyelik video 8 kredi tüketir. Instagram Reels, TikTok ve ürün sayfaları için ideal.",
  },
  {
    ikon: "📱",
    baslik: "Sosyal medya içeriği — 1 kredi",
    icerik:
      "Instagram, TikTok, Facebook ve Twitter/X için hazır caption metni ve hashtag listesi. Her üretim 1 kredi tüketir. Platform, ton ve marka profiline göre özelleşir.",
  },
  {
    ikon: "🔀",
    baslik: "Tüm içerik türleri aynı krediden",
    icerik:
      "Kredileri listing metni, görsel, video ve sosyal medya arasında dilediğin gibi kullanabilirsin. Hiçbir kategori kısıtlaması yok.",
  },
  {
    ikon: "♾️",
    baslik: "Süre sınırı yok",
    icerik:
      "Satın aldığın krediler sona erene kadar geçerlidir. Ay sonu sıfırlanma yok, kullanmadığın krediler kaybolmaz.",
  },
  {
    ikon: "💳",
    baslik: "Aylık abonelik yok",
    icerik:
      "Yoğun dönemde büyük paket al, durgun dönemde alma. Zorla abonelik yok. İstediğin zaman istediğin paketi alabilirsin.",
  },
];

const sss = [
  {
    soru: "Satın aldığım krediler ne zaman sona erer?",
    cevap:
      "Kredilerin sona erme tarihi yoktur. Tüm kullandığın krediler bitene kadar hesabında kalır.",
  },
  {
    soru: "Görsel üretimde kredi nasıl düşer?",
    cevap:
      "Seçtiğin her stil için 1 görsel üretilir ve kredi üretim anında düşer. Birden fazla stil seçersen her biri ayrı kredi harcar. İndirme bedavadır.",
  },
  {
    soru: "Video üretimi kaç kredi tutar?",
    cevap:
      "5 saniyelik video 5 kredi, 10 saniyelik video 8 kredi tüketir. Dikey (9:16 · Reels/TikTok), kare (1:1 · Feed) veya yatay (16:9 · YouTube) format seçebilirsin. Video MP4 formatında indirilir.",
  },
  {
    soru: "Sosyal medya içeriği hangi platformları kapsıyor?",
    cevap:
      "Instagram, TikTok, Facebook ve Twitter/X için ayrı caption + hashtag seti üretilir. Her platform için uygun ton ve karakter sayısı otomatik ayarlanır.",
  },
  {
    soru: "Metin + görsel + video aynı anda üretebilir miyim?",
    cevap:
      "Her içerik türü ayrı üretilir ancak aynı ürün bilgisini kullanabilirsin. Önce listing metni, ardından görsel, video ve sosyal medya içeriğini sırayla üretebilirsin. Her biri kendi kredisini tüketir.",
  },
  {
    soru: "Paket satın almak için ne gerekiyor?",
    cevap:
      "Hesap oluşturup fatura bilgilerini (ad soyad + TC kimlik veya vergi numarası) profil sayfandan girmen yeterli. Ödeme iyzico altyapısıyla güvenle yapılır.",
  },
  {
    soru: "Hangi platformlar için listing üretebiliyorum?",
    cevap:
      "Trendyol, Hepsiburada, Amazon TR, N11, Etsy ve Amazon USA. Her platform için ayrı format ve dil desteği (Türkçe/İngilizce) mevcuttur.",
  },
  {
    soru: "İade politikası nedir?",
    cevap:
      "Kullanılmamış krediler için iade talebi oluşturabilirsiniz. Kullanılan krediler iade edilmez. Detaylar için destek@yzliste.com adresine yazabilirsiniz.",
  },
];

// JSON-LD: Pricing schema — Product + Offer (Google rich result uyumlu)
function PricingJsonLd() {
  const offers = PAKET_LISTESI.map((p) => ({
    "@type": "Offer",
    name: `${p.isim} Paketi — ${p.krediStr}`,
    description: p.aciklama,
    price: String(p.fiyat),
    priceCurrency: "TRY",
    availability: "https://schema.org/InStock",
    url: "https://www.yzliste.com/fiyatlar",
  }))

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          name: "yzliste — AI E-ticaret Listing Üretici",
          description: "Trendyol, Hepsiburada, Amazon TR, N11, Etsy ve Amazon USA için AI destekli listing metni, stüdyo görseli ve sosyal medya içeriği üretim platformu.",
          brand: { "@type": "Brand", name: "yzliste" },
          url: "https://www.yzliste.com",
          offers,
        }),
      }}
    />
  );
}

export default function FiyatlarPage() {
  return (
    <main className="min-h-screen bg-white font-sans">
      <PricingJsonLd />
      <SiteHeader aktifSayfa="fiyatlar" />

      {/* HERO */}
      <section className="px-4 sm:px-6 pt-14 pb-10 text-center max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
          Kullandığın kadar öde,<br />
          <span className="text-indigo-500">abonelik yok</span>
        </h1>
        <p className="text-gray-500 text-base mb-6">
          3 ücretsiz krediyle başla, beğenince istediğin paketi al. Krediler listing metni, görsel, video ve sosyal medya içeriği arasında serbestçe kullanılır.
        </p>
        <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 text-sm font-medium px-4 py-2 rounded-full border border-green-200">
          🎁 Yeni kayıtta 3 ücretsiz kredi · Kredi kartı gerekmez
        </div>
      </section>

      {/* KREDİ AÇIKLAMALARI */}
      <section className="px-4 sm:px-6 py-10 bg-gray-50 border-y border-gray-100">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-800 text-center mb-8">Kredi nasıl çalışır?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {krediAciklamalari.map((k, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <div className="text-2xl mb-3">{k.ikon}</div>
                <h3 className="font-semibold text-gray-800 text-sm mb-2">{k.baslik}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{k.icerik}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PAKETLER */}
      <section className="px-4 sm:px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-3">Paketler</h2>
          <p className="text-center text-sm text-gray-400 mb-10">
            Bir kez al, sona erene kadar kullan. Süre sınırı yok.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {paketler.map((p) => (
              <div key={p.id} className={`border-2 ${p.renk} rounded-2xl p-6 relative flex flex-col`}>
                {p.rozet && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                    En Popüler
                  </span>
                )}
                <div className="mb-4">
                  <p className="font-bold text-gray-800 text-lg">{p.isim}</p>
                  <p className="text-3xl font-extrabold text-gray-900 mt-1">{p.fiyat}</p>
                  <p className="text-sm text-gray-500 mt-1">{p.kredi} kredi</p>
                  <p className="text-xs text-gray-400 mt-2 leading-relaxed">{p.aciklama}</p>
                </div>
                <ul className="space-y-2 flex-1 mb-6">
                  {p.ozellikler.map((o, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                      <span className="text-green-500 flex-shrink-0 mt-0.5">✓</span>
                      {o}
                    </li>
                  ))}
                </ul>
                <FiyatlarCta variant="paket" paketButonRenk={p.butonRenk} />
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-gray-400 mt-8">
            🔒 Güvenli ödeme — iyzico altyapısı · Fatura her alışverişte e-postayla gönderilir
          </p>
        </div>
      </section>

      {/* KREDİ HESAPLAYICI — basit örnek tablo */}
      <section className="px-4 sm:px-6 py-14 bg-indigo-50 border-y border-indigo-100">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-gray-800 text-center mb-2">Örnek kullanım senaryoları</h2>
          <p className="text-center text-sm text-gray-400 mb-8">Kredileri metin ve görsel arasında dilediğin gibi bölebilirsin</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-indigo-200">
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">Senaryo</th>
                  <th className="text-center py-3 px-4 text-gray-600 font-semibold">Kullanılan kredi</th>
                  <th className="text-center py-3 px-4 text-gray-600 font-semibold">Önerilen paket</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-indigo-100">
                {[
                  { senaryo: "10 ürün için listing metni", kredi: "10 kredi", paket: "Başlangıç (₺39)" },
                  { senaryo: "5 ürün metin + 5 stil görsel", kredi: "10 kredi", paket: "Başlangıç (₺39)" },
                  { senaryo: "2 adet 5sn ürün videosu", kredi: "10 kredi", paket: "Başlangıç (₺39)" },
                  { senaryo: "20 ürün metin + 10 stil görsel", kredi: "30 kredi", paket: "Popüler (₺99)" },
                  { senaryo: "30 ürün listing metni + 30 sosyal medya seti", kredi: "60 kredi", paket: "Büyük (₺249)" },
                  { senaryo: "100 ürün listing metni (toplu)", kredi: "100 kredi", paket: "Büyük (₺249)" },
                ].map((row, i) => (
                  <tr key={i} className="bg-white/60">
                    <td className="py-3 px-4 text-gray-700">{row.senaryo}</td>
                    <td className="py-3 px-4 text-center font-semibold text-indigo-600">{row.kredi}</td>
                    <td className="py-3 px-4 text-center text-gray-500">{row.paket}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* SSS */}
      <section className="px-4 sm:px-6 py-16">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-10">Sık sorulan sorular</h2>
          <div className="space-y-5">
            {sss.map((s, i) => (
              <div key={i} className="border border-gray-100 rounded-2xl p-5 bg-white shadow-sm">
                <p className="font-semibold text-gray-800 text-sm mb-2">{s.soru}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{s.cevap}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 sm:px-6 py-14 bg-gray-50 border-t border-gray-100 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Hemen ücretsiz dene</h2>
        <p className="text-gray-500 text-sm mb-6">3 kredi, kredi kartı yok. Hesap oluştur, hemen başla.</p>
        <FiyatlarCta
          className="inline-block bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-10 py-4 rounded-2xl text-base transition-colors shadow-lg shadow-indigo-100"
        />
      </section>

      <SiteFooter />
    </main>
  );
}
