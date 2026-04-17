import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "yzliste — AI ile E-ticaret Listing Üret",
  description:
    "Trendyol, Hepsiburada, Amazon ve N11 için AI destekli listing metni, stüdyo görseli ve ürün videosu üret. Fotoğraf yükle, gerisini YZ halleder.",
  openGraph: {
    title: "yzliste — AI ile E-ticaret Listing Üret",
    description:
      "Trendyol, Hepsiburada, Amazon ve N11 için AI destekli listing metni, stüdyo görseli ve ürün videosu üret.",
    url: "https://www.yzliste.com/auth",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "yzliste — AI ile E-ticaret Listing Üret",
    description:
      "Trendyol, Hepsiburada, Amazon ve N11 için AI destekli listing metni ve görsel üret.",
  },
  alternates: {
    canonical: "https://www.yzliste.com/auth",
  },
  robots: { index: true, follow: true },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
