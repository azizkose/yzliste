import type { Metadata } from "next";
import TanitimSayfasi from "./_tanitim";

export const metadata: Metadata = {
  title: { absolute: "yzliste — AI ile E-ticaret Listing, Görsel ve Video Üret" },
  description:
    "Trendyol, Hepsiburada, Amazon, Etsy ve N11 için AI destekli listing metni, stüdyo görseli, ürün videosu ve sosyal medya içeriği üret. Fotoğraf yükle, gerisini YZ halleder.",
  alternates: { canonical: "https://www.yzliste.com" },
  openGraph: {
    title: "yzliste — AI ile E-ticaret Listing, Görsel ve Video Üret",
    description:
      "Trendyol, Hepsiburada, Amazon, Etsy ve N11 için AI destekli listing metni, stüdyo görseli, ürün videosu ve sosyal medya içeriği üret.",
    url: "https://www.yzliste.com",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "yzliste" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "yzliste — AI ile E-ticaret Listing, Görsel ve Video Üret",
    description:
      "Trendyol, Hepsiburada, Amazon, Etsy ve N11 için AI destekli listing metni ve görsel üret.",
  },
};

export default function HomePage() {
  return <TanitimSayfasi />;
}
