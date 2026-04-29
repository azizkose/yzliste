import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
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

const manrope = Manrope({
  subsets: ["latin", "latin-ext"],
  variable: "--font-manrope",
  display: "swap",
});


export const metadata: Metadata = {
  title: {
    default: "yzliste â€” ÃœrÃ¼nÃ¼n iÃ§in metin, gÃ¶rsel, video ve sosyal medya postu",
    template: "%s | yzliste",
  },
  description: "Trendyol, Hepsiburada, Amazon TR, N11, Etsy ve Amazon USA iÃ§in AI ile listing metni, stÃ¼dyo gÃ¶rseli, Ã¼rÃ¼n videosu ve sosyal medya postu Ã¼ret. FotoÄŸraf yÃ¼kle veya barkod tara, gerisini YZ halleder.",
  metadataBase: new URL("https://www.yzliste.com"),
  openGraph: {
    title: "yzliste â€” ÃœrÃ¼nÃ¼n iÃ§in metin, gÃ¶rsel, video ve sosyal medya postu",
    description: "Trendyol, Hepsiburada, Amazon TR, N11, Etsy ve Amazon USA iÃ§in AI ile listing metni, gÃ¶rsel, video ve sosyal medya iÃ§eriÄŸi Ã¼ret.",
    url: "https://www.yzliste.com",
    siteName: "yzliste",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "yzliste" }],
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "yzliste â€” E-ticaret listing iÃ§in en kolay Ã§Ã¶zÃ¼m",
    description: "Trendyol, Hepsiburada, Amazon TR ve N11 iÃ§in AI ile optimize listing metni Ã¼ret.",
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
                "E-ticaret listing metni ve AI gÃ¶rsel Ã¼retim aracÄ±",
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
                "Trendyol, Hepsiburada, Amazon TR ve N11 iÃ§in AI ile optimize listing metni ve stÃ¼dyo gÃ¶rseli Ã¼ret. FotoÄŸraf yÃ¼kle veya barkod tara.",
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
                "AI listing metni Ã¼retimi",
                "AI gÃ¶rsel Ã¼retimi",
                "Trendyol, Hepsiburada, Amazon, N11, Etsy desteÄŸi",
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
      className={`${inter.variable} ${manrope.variable} antialiased`}
    >
      <head>
        <RootJsonLd />
        {/* Google Consent Mode v2 â€” GA yÃ¼klenmeden Ã¶nce default reddedildi */}
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
        {/* Google Analytics Ã–lÃ§Ã¼m KimliÄŸi */}
        <GoogleAnalytics gaId="G-J5VWD7Y74M" />
      </body>
    </html>
  );
}
