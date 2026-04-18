import type { Metadata } from "next";
import Link from "next/link";
import { getYazilar, kategoriler } from "./icerikler";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const revalidate = 3600; // 1 saat ISR cache

export const metadata: Metadata = {
  title: "Blog | yzliste — E-ticaret Listing ve AI Görsel Rehberleri",
  description:
    "Trendyol, Hepsiburada, Amazon ve Etsy'de satışlarını artırmak için listing yazma rehberleri, AI görsel kullanımı, platform karşılaştırmaları ve e-ticaret ipuçları.",
  keywords: [
    "e-ticaret blog",
    "trendyol listing rehberi",
    "hepsiburada satış ipuçları",
    "etsy türk satıcı",
    "ürün açıklaması nasıl yazılır",
    "ai görsel e-ticaret",
  ],
  openGraph: {
    title: "Blog | yzliste",
    description: "E-ticaret satıcıları için listing, görsel ve platform rehberleri.",
    url: "https://www.yzliste.com/blog",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "yzliste blog" }],
  },
  alternates: {
    canonical: "https://www.yzliste.com/blog",
  },
  robots: { index: true, follow: true },
  twitter: {
    card: "summary_large_image",
    title: "Blog | yzliste",
    description: "E-ticaret satıcıları için listing, görsel ve platform rehberleri.",
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
          description: "E-ticaret satıcıları için listing ve görsel rehberleri",
          url: "https://www.yzliste.com/blog",
          publisher: {
            "@type": "Organization",
            name: "yzliste",
            url: "https://yzliste.com",
          },
          blogPost: yazilar.map((y) => ({
            "@type": "BlogPosting",
            headline: y.baslik,
            description: y.ozet,
            datePublished: y.yayinTarihi,
            dateModified: y.guncellemeTarihi ?? y.yayinTarihi,
            url: `https://yzliste.com/blog/${y.slug}`,
            author: { "@type": "Organization", name: y.yazarAdi },
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
    <main className="min-h-screen bg-white font-sans">
      <BlogJsonLd />

      <SiteHeader aktifSayfa="blog" />

      {/* HERO */}
      <section className="px-4 sm:px-6 pt-14 pb-8 max-w-3xl mx-auto text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
          E-ticaret satıcıları için<br />
          <span className="text-indigo-500">pratik rehberler</span>
        </h1>
        <p className="text-gray-500 text-base">
          Trendyol, Hepsiburada, Amazon ve Etsy&apos;de listing yazma, AI görsel kullanımı ve platform stratejileri.
        </p>
      </section>

      {/* KATEGORİLER */}
      {cats.length > 1 && (
        <section className="px-4 sm:px-6 pb-6">
          <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-2">
            {cats.map((k) => (
              <span key={k} className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-200 px-3 py-1.5 rounded-full font-medium">
                {k}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* YAZI LİSTESİ */}
      <section className="px-4 sm:px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {yazilar.map((yazi) => (
              <Link
                key={yazi.slug}
                href={`/blog/${yazi.slug}`}
                className="group bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col"
              >
                {yazi.kapakGorsel && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={yazi.kapakGorsel}
                    alt={yazi.baslik}
                    style={{ width: "100%", height: "176px", objectFit: "cover", display: "block" }}
                  />
                )}
                {!yazi.kapakGorsel && (
                  <div className="w-full h-40 bg-indigo-50 flex items-center justify-center">
                    <span className="text-4xl">📝</span>
                  </div>
                )}
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs bg-indigo-50 text-indigo-600 border border-indigo-100 px-2 py-0.5 rounded-full font-medium">
                      {yazi.kategori}
                    </span>
                    <span className="text-xs text-gray-400">{yazi.okumaSuresi} dk okuma</span>
                  </div>
                  <h2 className="font-bold text-gray-800 text-sm leading-snug mb-2 group-hover:text-indigo-600 transition-colors line-clamp-3">
                    {yazi.baslik}
                  </h2>
                  <p className="text-xs text-gray-500 leading-relaxed flex-1 line-clamp-3">
                    {yazi.ozet}
                  </p>
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                    <span className="text-xs text-gray-400">
                      {new Date(yazi.yayinTarihi).toLocaleDateString("tr-TR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                    <span className="text-xs text-indigo-500 font-medium group-hover:underline">
                      Oku →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {yazilar.length === 0 && (
            <div className="text-center py-20 text-gray-400">
              <div className="text-4xl mb-4">✍️</div>
              <p className="text-sm">Yazılar yakında eklenecek.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 sm:px-6 py-14 bg-indigo-50 border-y border-indigo-100 text-center">
        <h2 className="text-xl font-bold text-gray-800 mb-3">Okuduktan sonra dene</h2>
        <p className="text-sm text-gray-500 mb-6">3 ücretsiz kredi ile listing ve görsel üret. Kayıt bile olmadan misafir olarak başla.</p>
        <Link
          href="/?anonim=1"
          className="inline-block bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-8 py-3.5 rounded-xl text-sm transition-colors shadow-lg shadow-indigo-100"
        >
          3 Ücretsiz Kredi ile Başla →
        </Link>
      </section>

      {/* FOOTER */}
      <SiteFooter />
    </main>
  );
}
