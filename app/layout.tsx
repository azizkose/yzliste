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
};

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
      <body className="min-h-full flex flex-col">
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}
