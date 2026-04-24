import type { Metadata } from "next";
import Link from "next/link";
import { getYazilar, kategoriler } from "./icerikler";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import BlogListesi from "./BlogListesi";

export const revalidate = 3600; // 1 saat ISR cache

export const metadata: Metadata = {
  title: "Blog — E-ticaret Listing, AI Görsel, Video ve Satış Rehberleri",
  description:
    "Trendyol, Hepsiburada, Amazon, Etsy ve N11'de satış artıran listing rehberleri. AI ürün görseli ve videosu, sosyal medya içeriği, SEO, fiyatlandırma stratejileri ve e-ticaret ipuçları.",
  keywords: [
    "e-ticaret blog",
    "trendyol listing rehberi",
    "hepsiburada satış ipuçları",
    "etsy türk satıcı",
    "ürün açıklaması nasıl yazılır",
    "ai görsel e-ticaret",
    "ai ürün videosu",
    "n11 satış rehberi",
    "e-ticaret seo",
    "sosyal medya e-ticaret",
    "tiktok ürün tanıtımı",
    "e-ticaret fiyatlandırma",
    "amazon listing optimizasyonu",
    "mankene giydirme ai",
  ],
  openGraph: {
    title: "Blog | yzliste",
    description: "Listing yazma, AI görsel ve video üretimi, SEO, fiyatlandırma ve 7 pazaryeri için satış rehberleri.",
    url: "https://www.yzliste.com/blog",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "yzliste blog" }],
  },
  alternates: {
    canonical: "https://www.yzliste.com/blog",
    languages: { 'tr': 'https://www.yzliste.com/blog', 'x-default': 'https://www.yzliste.com/blog' },
  },
  robots: { index: true, follow: true },
  twitter: {
    card: "summary_large_image",
    title: "Blog | yzliste",
    description: "Listing yazma, AI görsel ve video üretimi, SEO, fiyatlandırma ve 7 pazaryeri için satış rehberleri.",
  },
};

// JSON-LD: Blog listing sayfası
async function BlogJsonLd() {
  const yazilar = await getYazilar();
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Blog",
          name: "yzliste Blog",
          description: "Listing yazma, AI görsel ve video üretimi, SEO, fiyatlandırma ve 7 pazaryeri için satış rehberleri",
          url: "https://www.yzliste.com/blog",
          publisher: { "@id": "https://www.yzliste.com/#organization" },
          blogPost: yazilar.map((y) => ({
            "@type": "BlogPosting",
            headline: y.baslik,
            description: y.ozet,
            datePublished: y.yayinTarihi,
            dateModified: y.guncellemeTarihi ?? y.yayinTarihi,
            url: `https://yzliste.com/blog/${y.slug}`,
            author: { "@id": "https://www.yzliste.com/#organization" },
          })),
        }),
      }}
    />
  );
}

export default async function BlogPage() {
  const yazilar = await getYazilar();
  const cats = await kategoriler();

  return (
    <main className="min-h-screen bg-[#FAFAF8] font-sans">
      <BlogJsonLd />

      <SiteHeader aktifSayfa="blog" />

      {/* HERO */}
      <section className="px-4 sm:px-6 pt-14 pb-8 max-w-3xl mx-auto text-center">
        <h1 className="text-3xl sm:text-4xl font-medium text-[#1A1A17] mb-4">
          E-ticaret satıcıları için<br />
          <span className="text-[#1E4DD8]">pratik rehberler</span>
        </h1>
        <p className="text-[#908E86] text-base">
          Trendyol, Hepsiburada, Amazon ve Etsy&apos;de listing yazma, AI görsel kullanımı ve platform stratejileri.
        </p>
      </section>

      <BlogListesi yazilar={yazilar} kategoriler={cats} />

      {/* CTA */}
      <section className="px-4 sm:px-6 py-14 bg-[#F0F4FB] border-y border-[#BAC9EB] text-center">
        <h2 className="text-xl font-medium text-[#1A1A17] mb-3">Okuduktan sonra dene</h2>
        <p className="text-sm text-[#5A5852] mb-6">Ücretsiz hesap oluştur, 3 krediyle hemen listing ve görsel üret.</p>
        <Link
          href="/kayit"
          className="inline-block bg-[#1E4DD8] hover:bg-[#163B9E] text-white font-medium px-8 py-3.5 rounded-lg text-sm transition-colors"
        >
          Ücretsiz hesap oluştur →
        </Link>
      </section>

      {/* FOOTER */}
      <SiteFooter />
    </main>
  );
}
