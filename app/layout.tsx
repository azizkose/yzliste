import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import ChatWidget from "@/components/ChatWidget";
import { GoogleAnalytics } from '@next/third-parties/google';
import QueryProvider from "@/components/providers/QueryProvider";
import PostHogProvider from "@/components/providers/PostHogProvider";
import PostHogPageView from "@/components/analytics/PostHogPageView";
import CookieConsentBanner from "@/components/consent/CookieConsent";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});


export const metadata: Metadata = {
  title: {
    default: "yzliste — Ürünün için metin, görsel, video ve sosyal medya postu",
    template: "%s | yzliste",
  },
  description: "Trendyol, Hepsiburada, Amazon TR, N11, Etsy ve Amazon USA için AI ile listing metni, stüdyo görseli, ürün videosu ve sosyal medya postu üret. Fotoğraf yükle veya barkod tara, gerisini YZ halleder.",
  metadataBase: new URL("https://www.yzliste.com"),
  openGraph: {
    title: "yzliste — Ürünün için metin, görsel, video ve sosyal medya postu",
    description: "Trendyol, Hepsiburada, Amazon TR, N11, Etsy ve Amazon USA için AI ile listing metni, görsel, video ve sosyal medya içeriği üret.",
    url: "https://www.yzliste.com",
    siteName: "yzliste",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "yzliste" }],
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "yzliste — E-ticaret listing için en kolay çözüm",
    description: "Trendyol, Hepsiburada, Amazon TR ve N11 için AI ile optimize listing metni üret.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://www.yzliste.com",
    languages: {
      'tr': 'https://www.yzliste.com',
      'x-default': 'https://www.yzliste.com',
    },
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.png", type: "image/png" },
    ],
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

// JSON-LD: Organization + SoftwareApplication
function RootJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              "@id": "https://www.yzliste.com/#organization",
              name: "yzliste",
              url: "https://www.yzliste.com",
              logo: {
                "@type": "ImageObject",
                url: "https://www.yzliste.com/yzliste_logo.png",
                width: 200,
                height: 60,
              },
              description:
                "E-ticaret listing metni ve AI görsel üretim aracı",
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "",
                contactType: "Customer Service",
                email: "destek@yzliste.com",
              },
            },
            {
              "@type": "SoftwareApplication",
              "@id": "https://www.yzliste.com/#software",
              name: "yzliste",
              description:
                "Trendyol, Hepsiburada, Amazon TR ve N11 için AI ile optimize listing metni ve stüdyo görseli üret. Fotoğraf yükle veya barkod tara.",
              url: "https://www.yzliste.com",
              applicationCategory: "BusinessApplication",
              offers: {
                "@type": "AggregateOffer",
                priceCurrency: "TRY",
                highPrice: "249",
                lowPrice: "0",
                offerCount: "4",
              },
              featureList: [
                "AI listing metni üretimi",
                "AI görsel üretimi",
                "Trendyol, Hepsiburada, Amazon, N11, Etsy desteği",
                "Barkod tarama",
              ],
              screenshot: "https://www.yzliste.com/og-image.png",
              publisher: {
                "@type": "Organization",
                "@id": "https://www.yzliste.com/#organization",
              },
            },
            {
              "@type": "WebSite",
              "@id": "https://www.yzliste.com/#website",
              url: "https://www.yzliste.com",
              name: "yzliste",
              inLanguage: "tr",
              isPartOf: {
                "@id": "https://www.yzliste.com/#organization",
              },
            },
          ],
        }),
      }}
    />
  );
}

export default async function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal?: React.ReactNode;
}>) {
  const nonce = (await headers()).get('x-nonce') ?? ''

  return (
    <html
      lang="tr"
      className={`${inter.variable} antialiased`}
    >
      <head>
        <RootJsonLd />
        {/* Google Consent Mode v2 — GA yüklenmeden önce default reddedildi */}
        <script
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('consent', 'default', {
                analytics_storage: 'denied',
                ad_storage: 'denied',
                wait_for_update: 500
              });
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <PostHogProvider>
          <QueryProvider>
            {children}
            {modal}
            <ChatWidget />
            <PostHogPageView />
            <CookieConsentBanner />
          </QueryProvider>
        </PostHogProvider>
        {/* Google Analytics Ölçüm Kimliği */}
        <GoogleAnalytics gaId="G-J5VWD7Y74M" />
      </body>
    </html>
  );
}
