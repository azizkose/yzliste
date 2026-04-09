import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ChatWidget from "@/components/ChatWidget";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "yzliste — E-ticaret listing için en kolay çözüm",
  description: "Trendyol, Hepsiburada, Amazon TR ve N11 için AI ile optimize listing metni ve stüdyo görseli üret. Fotoğraf yükle veya barkod tara, gerisini YZ halleder.",
  metadataBase: new URL("https://www.yzliste.com"),
  openGraph: {
    title: "yzliste — E-ticaret listing için en kolay çözüm",
    description: "Trendyol, Hepsiburada, Amazon TR ve N11 için AI ile optimize listing metni ve stüdyo görseli üret.",
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
                highPrice: "149",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <RootJsonLd />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}
