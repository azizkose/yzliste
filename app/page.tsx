import type { Metadata } from "next";
import TanitimSayfasi from "./_tanitim-redesign";

export const metadata: Metadata = {
  title: { absolute: "yzliste — AI ile E-ticaret Listing, Görsel ve Video Üret" },
  description:
    "Trendyol, Hepsiburada, Amazon, N11, Etsy, Amazon USA ve Çiçeksepeti için yapay zeka destekli listing metni, stüdyo görseli, ürün videosu ve sosyal medya içeriği üret. 7 pazaryeri, fotoğraf yükle gerisini YZ halleder.",
  alternates: { canonical: "https://www.yzliste.com" },
  openGraph: {
    title: "yzliste — AI ile E-ticaret Listing, Görsel ve Video Üret",
    description:
      "Trendyol, Hepsiburada, Amazon, N11, Etsy, Amazon USA ve Çiçeksepeti için yapay zeka destekli listing metni, stüdyo görseli, ürün videosu ve sosyal medya içeriği üret. 7 pazaryeri.",
    url: "https://www.yzliste.com",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "yzliste" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "yzliste — AI ile E-ticaret Listing, Görsel ve Video Üret",
    description:
      "Trendyol, Hepsiburada, Amazon, N11, Etsy, Amazon USA ve Çiçeksepeti için yapay zeka destekli listing metni ve görsel üret. 7 pazaryeri.",
  },
};

export default function HomePage() {
  return <TanitimSayfasi />;
}

