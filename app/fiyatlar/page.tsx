import type { Metadata } from "next";
import { Gift, Check, Lock, FileText, Camera, Clapperboard, Share2, Infinity as InfinityIcon } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { PAKET_LISTESI } from "@/lib/paketler";
import FiyatlarCta from "@/components/ui/FiyatlarCta";
import KrediCalculator from "@/components/fiyatlar/KrediCalculator";
import FiyatlarSSS from "@/components/fiyatlar/FiyatlarSSS";

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
      shippingRate: { "@type": "MonetaryAmount", value: "0", currency: "TRY" },
      shippingDestination: { "@type": "DefinedRegion", addressCountry: "TR" },
      deliveryTime: {
        "@type": "ShippingDeliveryTime",
        handlingTime: { "@type": "QuantitativeValue", minValue: 0, maxValue: 0, unitCode: "d" },
        transitTime: { "@type": "QuantitativeValue", minValue: 0, maxValue: 0, unitCode: "d" },
      },
    },
  }));

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
    <main className="min-h-screen bg-white">
      <PricingJsonLd />
      <SiteHeader aktifSayfa="fiyatlar" />

      {/* HERO */}
      <section className="px-4 sm:px-6 pt-14 pb-10 text-center max-w-2xl mx-auto">
        <p
          className="text-xs font-semibold tracking-[0.1em] uppercase text-rd-primary-600 mb-4"
          style={{ fontFamily: 'var(--font-rd-display)' }}
        >
          Fiyatlar
        </p>
        <h1
          className="text-3xl sm:text-4xl font-bold text-rd-neutral-900 mb-4"
          style={{ fontFamily: 'var(--font-rd-display)', letterSpacing: '-0.02em', lineHeight: '1.3' }}
        >
          Sade kredi paketleri
        </h1>
        <p className="text-rd-neutral-500 text-base mb-6 leading-relaxed">
          3 ücretsiz krediyle başla, beğenince istediğin paketi al. Krediler listing metni, görsel,
          video ve sosyal medya içeriği arasında serbestçe kullanılır.
        </p>
        <div className="inline-flex items-center gap-2 bg-rd-success-50 text-rd-success-700 text-sm font-medium px-4 py-2 rounded-full border border-rd-success-200">
          <Gift size={14} strokeWidth={1.5} aria-hidden="true" />
          Yeni kayıtta 3 ücretsiz kredi · Kredi kartı gerekmez
        </div>
      </section>

      {/* PAKETLER */}
      <section
        className="px-4 sm:px-6 py-16"
        aria-labelledby="paketler-heading"
      >
        <div className="max-w-4xl mx-auto">
          <h2
            id="paketler-heading"
            className="text-2xl font-bold text-rd-neutral-900 text-center mb-3"
            style={{ fontFamily: 'var(--font-rd-display)', letterSpacing: '-0.01em' }}
          >
            Paketler
          </h2>
          <p className="text-center text-sm text-rd-neutral-400 mb-10">
            Bir kez al, sona erene kadar kullan. Süre sınırı yok.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 items-stretch">
            {PAKET_LISTESI.map((p) => (
              <div
                key={p.id}
                className={[
                  'relative flex flex-col rounded-xl border bg-white p-6',
                  p.rozet
                    ? 'border-2 border-rd-primary-500'
                    : 'border border-rd-neutral-200',
                ].join(' ')}
              >
                {p.rozet && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center rounded-full bg-rd-primary-600 px-3 py-1 text-xs font-medium text-white tracking-wide">
                      En popüler
                    </span>
                  </div>
                )}

                <div className="mb-4">
                  <p
                    className="font-bold text-rd-neutral-900 text-lg"
                    style={{ fontFamily: 'var(--font-rd-display)' }}
                  >
                    {p.isim}
                  </p>
                  <p
                    className="text-3xl font-bold text-rd-neutral-900 mt-1 tabular-nums"
                    style={{ fontFamily: 'var(--font-rd-display)' }}
                  >
                    {p.fiyatStr}
                  </p>
                  <p className="text-sm text-rd-neutral-500 mt-1">
                    {p.kredi} kredi ·{' '}
                    <span className="text-rd-neutral-400">
                      {(p.fiyat / p.kredi).toFixed(2).replace('.', ',')}₺/kredi
                    </span>
                  </p>
                  <p className="text-xs text-rd-neutral-400 mt-2 leading-relaxed">{p.aciklama}</p>
                </div>

                <ul className="space-y-2 flex-1 mb-6" role="list">
                  {p.ozellikler.map((o, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-rd-neutral-600">
                      <Check size={12} strokeWidth={2} className="text-rd-success-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                      {o}
                    </li>
                  ))}
                </ul>

                <FiyatlarCta
                  variant="paket"
                  paketButonRenk={p.rozet ? 'bg-rd-primary-600 hover:bg-rd-primary-700' : 'bg-rd-neutral-900 hover:bg-rd-neutral-800'}
                  paketFiyatStr={p.fiyatStr}
                />
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-rd-neutral-400 mt-8 flex items-center justify-center gap-1.5">
            <Lock size={11} strokeWidth={1.5} aria-hidden="true" />
            Güvenli ödeme — iyzico altyapısı · Fatura her alışverişte e-postayla gönderilir
          </p>
        </div>
      </section>

      {/* KREDİ NASIL ÇALIŞIR */}
      <section
        className="px-4 sm:px-6 py-10 border-b border-rd-neutral-200 bg-rd-neutral-50"
        aria-labelledby="kredi-nasil-heading"
      >
        <div className="max-w-2xl mx-auto">
          <h2
            id="kredi-nasil-heading"
            className="text-base font-bold text-rd-neutral-900 mb-5"
            style={{ fontFamily: 'var(--font-rd-display)' }}
          >
            Kredi nasıl çalışır?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { Ikon: FileText, baslik: "Listing metni", detay: "1 kredi" },
              { Ikon: Camera, baslik: "Stüdyo görseli", detay: "Stil başına 1 kredi" },
              { Ikon: Clapperboard, baslik: "Ürün videosu", detay: "5sn = 10 kredi · 10sn = 20 kredi" },
              { Ikon: Share2, baslik: "Sosyal medya", detay: "1 kredi · Kit (4 platform) = 3 kredi" },
            ].map((item) => (
              <div
                key={item.baslik}
                className="flex items-start gap-3 rounded-xl border border-rd-neutral-200 bg-white px-4 py-3"
              >
                <div className="w-7 h-7 flex items-center justify-center rounded-lg bg-rd-primary-50 flex-shrink-0 mt-0.5">
                  <item.Ikon size={14} strokeWidth={1.5} className="text-rd-primary-600" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-rd-neutral-900">{item.baslik}</p>
                  <p className="text-xs text-rd-neutral-400 mt-0.5">{item.detay}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-4 text-xs text-rd-neutral-500">
            <InfinityIcon size={13} strokeWidth={1.5} className="text-rd-neutral-400 flex-shrink-0" aria-hidden="true" />
            Krediler süresiz geçerlidir — sona erme tarihi yoktur. Paketler tek seferlik ödeme.
          </div>
        </div>
      </section>

      {/* KREDİ HESAPLAYICI */}
      <KrediCalculator />

      {/* SSS */}
      <FiyatlarSSS />

      {/* CTA */}
      <section className="px-4 sm:px-6 py-14 bg-rd-neutral-50 border-t border-rd-neutral-200 text-center">
        <p
          className="text-xs font-semibold tracking-[0.1em] uppercase text-rd-primary-600 mb-3"
          style={{ fontFamily: 'var(--font-rd-display)' }}
        >
          Hemen başla
        </p>
        <h2
          className="text-2xl font-bold text-rd-neutral-900 mb-3"
          style={{ fontFamily: 'var(--font-rd-display)', letterSpacing: '-0.01em' }}
        >
          Ücretsiz dene
        </h2>
        <p className="text-rd-neutral-500 text-sm mb-6">3 kredi, kredi kartı yok. Hesap oluştur, hemen başla.</p>
        <FiyatlarCta
          className="inline-block bg-rd-primary-600 hover:bg-rd-primary-700 text-white font-medium px-10 py-4 rounded-xl text-base transition-colors"
        />
      </section>

      <SiteFooter />
    </main>
  );
}
