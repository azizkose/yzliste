import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import HeaderAuthButtons from "@/components/HeaderAuthButtons";

export const metadata: Metadata = {
  title: "Fiyatlar | yzliste — E-ticaret Listing Üretici",
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
    url: "https://yzliste.com/fiyatlar",
    type: "website",
    siteName: "yzliste",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fiyatlar | yzliste",
    description: "Kullandığın kadar öde. 3 ücretsiz kredi, abonelik yok.",
  },
  alternates: {
    canonical: "https://yzliste.com/fiyatlar",
  },
  robots: { index: true, follow: true },
};

const paketler = [
  {
    id: "baslangic",
    isim: "Başlangıç",
    fiyat: "₺29",
    kredi: 10,
    renk: "border-gray-200",
    butonRenk: "bg-gray-800 hover:bg-gray-900",
    aciklama: "Birkaç ürün denemek isteyenler için ideal başlangıç noktası.",
    ozellikler: [
      "10 kredi (istediğin gibi kullan)",
      "Metin üretimi: Her listing için 1 kredi",
      "Görsel üretimi: Her listing için 1 kredi 8 farklı stil (her stilden 4 varyasyon)",
      "Deneme için küçük başlangıç",
      "Krediler tükenince üretilen içerik silinir",
    ],
  },
  {
    id: "populer",
    isim: "Popüler",
    fiyat: "₺79",
    kredi: 30,
    renk: "border-orange-400 ring-2 ring-orange-400",
    butonRenk: "bg-orange-500 hover:bg-orange-600",
    rozet: true,
    aciklama: "Aktif satıcılar için en çok tercih edilen paket.",
    ozellikler: [
      "30 kredi (istediğin gibi kullan)",
      "Metin üretimi: 30 listing",
      "Metin üretimi: Her listing için 1 kredi",
      "Görsel üretimi: Her listing için 1 kredi 8 farklı stil (her stilden 4 varyasyon)",
      "Tüm platformlar desteklenir",
      "Krediler sona erene kadar geçerli, süre sınırı yok",
    ],
  },
  {
    id: "buyuk",
    isim: "Büyük",
    fiyat: "₺149",
    kredi: 100,
    renk: "border-gray-200",
    butonRenk: "bg-gray-800 hover:bg-gray-900",
    aciklama: "Toplu yükleme yapan mağazalar ve profesyonel satıcılar için.",
    ozellikler: [
      "100 kredi (istediğin gibi kullan)",
      "Metin üretimi: Her listing için 1 kredi",
      "Görsel üretimi: Her listing için 1 kredi 8 farklı stil (her stilden 4 varyasyon)",
      "Toplu kullanım için en ekonomik seçenek",
      "Tüm platformlar desteklenir",
      "Krediler sona erene kadar geçerli, süre sınırı yok",
    ],
  },
];

const krediAciklamalari = [
  {
    ikon: "🎁",
    baslik: "3 ücretsiz kredi ile başla",
    icerik:
      "Kayıt olunca ya da misafir olarak denerken 3 ücretsiz kredi verilir. Kredi kartı gerekmez. İstediğin özelliği (metin veya görsel) denemek için kullanabilirsin.",
  },
  {
    ikon: "📝",
    baslik: "Listing metni — 1 kredi",
    icerik:
      "Her üretimde başlık, madde madde özellikler, açıklama ve arama etiketlerinin tamamı tek seferde gelir. Hepsi ayrı kutularda, tek tıkla kopyalanır. 1 kredi = 1 ürün için tam listing metni.",
  },
  {
    ikon: "📷",
    baslik: "AI görsel — stil başına 1 kredi",
    icerik:
      "Her stil seçiminde (Beyaz Zemin, Koyu Zemin, Lifestyle) 4 farklı varyasyon üretilir. Beğendiğini seçip indirince kredi düşer; sadece inceleme ücretsizdir. 1 stil = 4 görsel = 1 kredi.",
  },
  {
    ikon: "🔀",
    baslik: "Karışık kullanım serbesttir",
    icerik:
      "Kredileri metin ve görsel üretimi arasında dilediğin gibi bölebilirsin. 10 kredilik paketi 5 listing metni + 5 görsel stil olarak da kullanabilirsin. Hiçbir kısıtlama yok.",
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
      "Görsel üretimde önce seçtiğin stil için 4 varyasyon ücretsiz olarak önizlenir. İndirmek istediğin görseli seçince 1 kredi düşer. Beğenmezsen indirmeden çıkabilirsin, kredin yanmaz.",
  },
  {
    soru: "Metin + görsel aynı anda üretebilir miyim?",
    cevap:
      "Evet. Bir üretimde hem listing metnini hem görseli aynı anda talep edebilirsin. Her biri kendi kredisini tüketir: 1 metin + 1 görsel stili = 2 kredi.",
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

// JSON-LD: Pricing schema
function PricingJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "AggregateOffer",
          priceCurrency: "TRY",
          offers: [
            {
              "@type": "Offer",
              name: "Başlangıç Paketi",
              description: "Birkaç ürün denemek isteyenler için ideal başlangıç noktası.",
              price: "29",
              priceCurrency: "TRY",
              availability: "https://schema.org/InStock",
            },
            {
              "@type": "Offer",
              name: "Popüler Paketi",
              description: "Aktif satıcılar için en çok tercih edilen paket.",
              price: "79",
              priceCurrency: "TRY",
              availability: "https://schema.org/InStock",
            },
            {
              "@type": "Offer",
              name: "Büyük Paketi",
              description: "Toplu yükleme yapan mağazalar ve profesyonel satıcılar için.",
              price: "149",
              priceCurrency: "TRY",
              availability: "https://schema.org/InStock",
            },
          ],
        }),
      }}
    />
  );
}

export default function FiyatlarPage() {
  return (
    <main className="min-h-screen bg-white font-sans">
      <PricingJsonLd />
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-100 px-4 sm:px-6 py-2.5">
        <div className="max-w-6xl mx-auto flex items-center gap-2">
          <a href="/" className="flex-shrink-0 mr-1">
            <img src="/yzliste_logo.png" alt="yzliste" className="h-8" />
          </a>
          <nav className="flex items-center gap-0.5 text-xs sm:text-sm text-gray-500">
            <a href="/auth" className="hidden sm:block px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-gray-100 hover:text-gray-800 transition-colors whitespace-nowrap">Ana Sayfa</a>
            <a href="/" className="hidden sm:block px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-gray-100 hover:text-gray-800 transition-colors whitespace-nowrap">İçerik</a>
            <a href="/fiyatlar" className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-orange-600 font-medium whitespace-nowrap">Fiyatlar</a>
            <a href="/blog" className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-gray-100 hover:text-gray-800 transition-colors whitespace-nowrap">Blog</a>
          </nav>
          <HeaderAuthButtons />
        </div>
      </header>

      {/* HERO */}
      <section className="px-4 sm:px-6 pt-14 pb-10 text-center max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
          Kullandığın kadar öde,<br />
          <span className="text-orange-500">abonelik yok</span>
        </h1>
        <p className="text-gray-500 text-base mb-6">
          3 ücretsiz krediyle başla, beğenince istediğin paketi al. Krediler metin ve görsel üretimi arasında serbestçe kullanılır.
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
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-xs font-bold px-4 py-1 rounded-full">
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
                <a
                  href="/auth?kayit=1"
                  className={`block text-center ${p.butonRenk} text-white font-semibold py-3 rounded-xl text-sm transition-colors`}
                >
                  Başla
                </a>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-gray-400 mt-8">
            🔒 Güvenli ödeme — iyzico altyapısı · Fatura her alışverişte e-postayla gönderilir
          </p>
        </div>
      </section>

      {/* KREDİ HESAPLAYICI — basit örnek tablo */}
      <section className="px-4 sm:px-6 py-14 bg-orange-50 border-y border-orange-100">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-gray-800 text-center mb-2">Örnek kullanım senaryoları</h2>
          <p className="text-center text-sm text-gray-400 mb-8">Kredileri metin ve görsel arasında dilediğin gibi bölebilirsin</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-orange-200">
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">Senaryo</th>
                  <th className="text-center py-3 px-4 text-gray-600 font-semibold">Kullanılan kredi</th>
                  <th className="text-center py-3 px-4 text-gray-600 font-semibold">Önerilen paket</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-orange-100">
                {[
                  { senaryo: "10 ürün için sadece listing metni", kredi: "10 kredi", paket: "Başlangıç (₺29)" },
                  { senaryo: "10 ürün metin + her biri için 1 stil görsel", kredi: "20 kredi", paket: "Popüler (₺79)" },
                  { senaryo: "30 ürün için sadece listing metni", kredi: "30 kredi", paket: "Popüler (₺79)" },
                  { senaryo: "20 ürün metin + 2 stil görsel (her ürüne)", kredi: "60 kredi", paket: "Büyük (₺149)" },
                  { senaryo: "100 ürün toplu listing metni", kredi: "100 kredi", paket: "Büyük (₺149)" },
                ].map((row, i) => (
                  <tr key={i} className="bg-white/60">
                    <td className="py-3 px-4 text-gray-700">{row.senaryo}</td>
                    <td className="py-3 px-4 text-center font-semibold text-orange-600">{row.kredi}</td>
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
        <p className="text-gray-500 text-sm mb-6">3 kredi, kredi kartı yok. İstersen kayıt bile olmadan misafir olarak başla.</p>
        <a
          href="/?anonim=1"
          className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold px-10 py-4 rounded-2xl text-base transition-colors shadow-lg shadow-orange-100"
        >
          3 Ücretsiz Kredi ile Başla →
        </a>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-100 px-4 sm:px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 text-xs text-gray-400">
            <a href="/fiyatlar" className="hover:text-orange-500">Fiyatlar</a>
            <span>·</span>
            <a href="/blog" className="hover:text-orange-500">Blog</a>
            <span>·</span>
            <a href="/hakkimizda" className="hover:text-orange-500">Hakkımızda</a>
            <span>·</span>
            <a href="/gizlilik" className="hover:text-orange-500">Gizlilik Politikası</a>
            <span>·</span>
            <a href="/mesafeli-satis" className="hover:text-orange-500">Mesafeli Satış</a>
            <span>·</span>
            <a href="mailto:destek@yzliste.com" className="hover:text-orange-500">destek@yzliste.com</a>
          </div>
          <div className="flex justify-center">
            <Image src="/iyzico_footer_logo.png" alt="iyzico ile öde" width={429} height={32} className="w-44 h-auto" />
          </div>
          <p className="text-center text-xs text-gray-400">© 2026 yzliste · SIMOON PAZARLAMA VE DANISMANLIK LIMITED SIRKETI</p>
        </div>
      </footer>
    </main>
  );
}
