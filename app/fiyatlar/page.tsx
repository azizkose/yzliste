import type { Metadata } from "next";
import { Gift } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { PAKET_LISTESI } from "@/lib/paketler";
import FiyatlarCta from "@/components/ui/FiyatlarCta";
import FiyatlarSSS from "@/components/fiyatlar/FiyatlarSSS";
import FiyatlarHybridSection from "@/components/fiyatlar/FiyatlarHybridSection";

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

      {/* PAKETLER + CALCULATOR — 2-kolon hibrit */}
      <FiyatlarHybridSection />

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
