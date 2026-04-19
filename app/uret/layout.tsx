import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "İçerik Üret",
  description:
    "Trendyol, Hepsiburada, Amazon TR, N11, Etsy ve Amazon USA için AI destekli listing metni, stüdyo görseli, ürün videosu ve sosyal medya içeriği üret.",
  openGraph: { title: 'İçerik Üret | yzliste' },
  alternates: {
    canonical: "https://www.yzliste.com/uret",
    languages: { 'tr': 'https://www.yzliste.com/uret', 'x-default': 'https://www.yzliste.com/uret' },
  },
  robots: { index: true, follow: true },
};

export default function UretLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
