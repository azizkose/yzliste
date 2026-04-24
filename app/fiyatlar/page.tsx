import type { Metadata } from "next";
import { Gift, Check, Lock } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { PAKET_LISTESI } from "@/lib/paketler";
import FiyatlarCta from "@/components/ui/FiyatlarCta";
import { Icon3D } from "@/components/ui/Icon3D";

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
    ikon: <Gift size={40} strokeWidth={1.5} className="text-[#1E4DD8]" />,
    baslik: "3 ücretsiz kredi ile başla",
    icerik:
      "Kayıt olunca 3 ücretsiz kredi tanımlanır — kredi kartı gerekmez. İstediğin içerik türünü (metin, görsel, video, sosyal medya) denemek için kullanabilirsin.",
  },
  {
    ikon: <Icon3D name="pencil" size={48} bgColor="#F0F4FB" />,
    baslik: "Listing metni — 1 kredi",
    icerik:
      "1 kredi = 1 ürün için tam listing metni. Başlık, madde madde özellikler, açıklama ve arama etiketlerinin tamamı tek seferde gelir. Hepsi ayrı kutularda, tek tıkla kopyalanır.",
  },
  {
    ikon: <Icon3D name="camera" size={48} bgColor="#FBEAF0" />,
    baslik: "AI görsel — stil başına 1 kredi",
    icerik:
      "7 farklı stil (Beyaz, Koyu, Lifestyle, Mermer, Ahşap, Gradient, Doğal). Seçtiğin her stil için 1 görsel üretilir, kredi üretimde düşer. 1 stil = 1 görsel = 1 kredi.",
  },
  {
    ikon: <Icon3D name="video-cam" size={48} bgColor="#FAEEDA" />,
    baslik: "Video — 5sn: 10 kredi · 10sn: 20 kredi",
    icerik:
      "Ürün fotoğrafından tanıtım videosu üretilir. 5 saniyelik video için 10 kredi, 10 saniyelik için 20 kredi. Dikey (9:16 · Reels/TikTok), kare (1:1 · Feed) veya yatay (16:9 · YouTube) format seçilebilir.",
  },
  {
    ikon: <Icon3D name="mobile" size={48} bgColor="#E1F5EE" />,
    baslik: "Sosyal medya — 1 kredi / platform · Kit: 3 kredi (4 platform)",
    icerik:
      "Tek platform için 1 kredi: Instagram, TikTok, Facebook veya Twitter/X. Sosyal Medya Kiti ile 4 platform birden sadece 3 kredi — %25 tasarruf. Her platform için ayrı ton ve format.",
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
      "5 saniyelik video 10 kredi, 10 saniyelik video 20 kredi tüketir. Dikey (9:16 · Reels/TikTok), kare (1:1 · Feed) veya yatay (16:9 · YouTube) format seçebilirsin. Video MP4 formatında indirilir.",
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
    hasMerchantReturnPolicy: {
      "@type": "MerchantReturnPolicy",
      applicableCountry: "TR",
      returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
      merchantReturnDays: 3,
      returnMethod: "https://schema.org/ReturnByMail",
      returnFees: "https://schema.org/FreeReturn",
    },
    shippingDetails: {
      "@type": "OfferShippingDetails",
      shippingRate: {
        "@type": "MonetaryAmount",
        value: "0",
        currency: "TRY",
      },
      shippingDestination: {
        "@type": "DefinedRegion",
        addressCountry: "TR",
      },
      deliveryTime: {
        "@type": "ShippingDeliveryTime",
        handlingTime: {
          "@type": "QuantitativeValue",
          minValue: 0,
          maxValue: 0,
          unitCode: "d",
        },
        transitTime: {
          "@type": "QuantitativeValue",
          minValue: 0,
          maxValue: 0,
          unitCode: "d",
        },
      },
    },
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
          image: "https://www.yzliste.com/yzliste_og.png",
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
        <h1 className="text-3xl sm:text-4xl font-medium text-[#1A1A17] mb-4" style={{ letterSpacing: "-0.02em" }}>
          Kullandığın kadar öde,<br />
          <span className="text-[#1E4DD8]">abonelik yok</span>
        </h1>
        <p className="text-[#5A5852] text-base mb-6">
          3 ücretsiz krediyle başla, beğenince istediğin paketi al. Krediler listing metni, görsel, video ve sosyal medya içeriği arasında serbestçe kullanılır.
        </p>
        <div className="inline-flex items-center gap-2 bg-[#E8F5EE] text-[#0F5132] text-sm font-medium px-4 py-2 rounded-full border border-[#0F5132]/20">
          <Gift size={14} strokeWidth={1.5} />
          Yeni kayıtta 3 ücretsiz kredi · Kredi kartı gerekmez
        </div>
      </section>

      {/* KREDİ AÇIKLAMALARI */}
      <section className="px-4 sm:px-6 py-10 bg-[#F1F0EB] border-y border-[#D8D6CE]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-medium text-[#1A1A17] text-center mb-8">Kredi nasıl çalışır?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
            {krediAciklamalari.map((k, i) => (
              <div key={i} className="bg-white rounded-xl p-5 border border-[#D8D6CE]">
                <div className="mb-3">{k.ikon}</div>
                <h3 className="font-medium text-[#1A1A17] text-sm mb-2">{k.baslik}</h3>
                <p className="text-xs text-[#5A5852] leading-relaxed">{k.icerik}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-[#908E86] flex items-center justify-center gap-1.5">
            <Check size={12} strokeWidth={2} className="text-[#0F5132]" />
            Krediler tüm içerik türlerinde kullanılır · Süre sınırı yok · Abonelik yok
          </p>
        </div>
      </section>

      {/* PAKETLER */}
      <section className="px-4 sm:px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-medium text-[#1A1A17] text-center mb-3" style={{ letterSpacing: "-0.01em" }}>Paketler</h2>
          <p className="text-center text-sm text-[#908E86] mb-10">
            Bir kez al, sona erene kadar kullan. Süre sınırı yok.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {paketler.map((p) => (
              <div key={p.id} className={`border-2 ${p.renk} rounded-xl p-6 relative flex flex-col`}>
                {p.rozet && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1E4DD8] text-white text-xs font-medium px-4 py-1 rounded-full">
                    Önerilen
                  </span>
                )}
                <div className="mb-4">
                  <p className="font-medium text-[#1A1A17] text-lg">{p.isim}</p>
                  <p className="text-3xl font-medium text-[#1A1A17] mt-1">{p.fiyatStr}</p>
                  <p className="text-sm text-[#5A5852] mt-1">{p.kredi} kredi · <span className="text-[#908E86]">{(p.fiyat / p.kredi).toFixed(2).replace('.', ',')}₺/kredi</span></p>
                  <p className="text-xs text-[#908E86] mt-2 leading-relaxed">{p.aciklama}</p>
                </div>
                <ul className="space-y-2 flex-1 mb-6">
                  {p.ozellikler.map((o, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-[#5A5852]">
                      <Check size={12} strokeWidth={2} className="text-[#0F5132] flex-shrink-0 mt-0.5" />
                      {o}
                    </li>
                  ))}
                </ul>
                <FiyatlarCta variant="paket" paketButonRenk={p.butonRenk} paketFiyatStr={p.fiyatStr} />
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-[#908E86] mt-8 flex items-center justify-center gap-1.5">
            <Lock size={11} strokeWidth={1.5} />
            Güvenli ödeme — iyzico altyapısı · Fatura her alışverişte e-postayla gönderilir
          </p>
        </div>
      </section>

      {/* KREDİ HESAPLAYICI — basit örnek tablo */}
      <section className="px-4 sm:px-6 py-14 bg-[#F0F4FB] border-y border-[#BAC9EB]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-medium text-[#1A1A17] text-center mb-2">Örnek kullanım senaryoları</h2>
          <p className="text-center text-sm text-[#908E86] mb-8">Kredileri metin ve görsel arasında dilediğin gibi bölebilirsin</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#BAC9EB]">
                  <th className="text-left py-3 px-4 text-[#5A5852] font-medium">Senaryo</th>
                  <th className="text-center py-3 px-4 text-[#5A5852] font-medium">Kullanılan kredi</th>
                  <th className="text-center py-3 px-4 text-[#5A5852] font-medium">Önerilen paket</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#BAC9EB]">
                {[
                  { senaryo: "10 ürün için listing metni", kredi: "10 kredi", paket: "Başlangıç (₺49)" },
                  { senaryo: "5 ürün metin + 5 stil görsel", kredi: "10 kredi", paket: "Başlangıç (₺49)" },
                  { senaryo: "2 adet 5sn ürün videosu", kredi: "20 kredi", paket: "Popüler (₺129)" },
                  { senaryo: "20 ürün metin + 10 stil görsel", kredi: "30 kredi", paket: "Popüler (₺129)" },
                  { senaryo: "30 ürün listing metni + 30 sosyal medya seti", kredi: "60 kredi", paket: "Büyük (₺299)" },
                  { senaryo: "100 ürün listing metni (toplu)", kredi: "100 kredi", paket: "Büyük (₺299)" },
                ].map((row, i) => (
                  <tr key={i} className="bg-white/60">
                    <td className="py-3 px-4 text-[#5A5852]">{row.senaryo}</td>
                    <td className="py-3 px-4 text-center font-medium text-[#1E4DD8]">{row.kredi}</td>
                    <td className="py-3 px-4 text-center text-[#908E86]">{row.paket}</td>
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
          <h2 className="text-2xl font-medium text-[#1A1A17] text-center mb-10" style={{ letterSpacing: "-0.01em" }}>Sık sorulan sorular</h2>
          <div className="space-y-5">
            {sss.map((s, i) => (
              <div key={i} className="border border-[#D8D6CE] rounded-xl p-5 bg-white">
                <p className="font-medium text-[#1A1A17] text-sm mb-2">{s.soru}</p>
                <p className="text-xs text-[#5A5852] leading-relaxed">{s.cevap}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 sm:px-6 py-14 bg-[#F1F0EB] border-t border-[#D8D6CE] text-center">
        <h2 className="text-2xl font-medium text-[#1A1A17] mb-3" style={{ letterSpacing: "-0.01em" }}>Hemen ücretsiz dene</h2>
        <p className="text-[#5A5852] text-sm mb-6">3 kredi, kredi kartı yok. Hesap oluştur, hemen başla.</p>
        <FiyatlarCta
          className="inline-block bg-[#1E4DD8] hover:bg-[#163B9E] text-white font-medium px-10 py-4 rounded-xl text-base transition-colors"
        />
      </section>

      <SiteFooter />
    </main>
  );
}
