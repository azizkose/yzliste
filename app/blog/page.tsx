import type { Metadata } from "next";
import Link from "next/link";
import { getYazilar, kategoriler } from "./icerikler";

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
    url: "https://yzliste.com/blog",
    type: "website",
  },
  alternates: {
    canonical: "https://yzliste.com/blog",
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
          url: "https://yzliste.com/blog",
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

      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-100 px-3 sm:px-6 py-2 sm:py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3 sm:gap-4">
          <a href="/" className="flex-shrink-0">
            <img src="/yzliste_logo.png" alt="yzliste" className="h-8" />
          </a>
          <nav className="hidden sm:flex items-center gap-1 text-sm text-gray-500">
            <a href="/fiyatlar" className="px-3 py-2 rounded-lg hover:bg-gray-100 hover:text-gray-800 transition-colors whitespace-nowrap">Fiyatlar</a>
            <a href="/blog" className="px-3 py-2 rounded-lg text-orange-600 font-medium whitespace-nowrap">Blog</a>
          </nav>
          <div className="flex gap-1 sm:gap-2 flex-shrink-0 ml-auto">
            <a href="/auth" className="text-xs sm:text-sm text-gray-500 hover:text-gray-800 px-2 sm:px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap">Giriş Yap</a>
            <a href="/auth" className="hidden md:inline-block text-xs sm:text-sm bg-orange-500 text-white px-2 sm:px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors font-medium whitespace-nowrap">Ücretsiz Başla</a>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="px-4 sm:px-6 pt-14 pb-8 max-w-3xl mx-auto text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
          E-ticaret satıcıları için<br />
          <span className="text-orange-500">pratik rehberler</span>
        </h1>
        <p className="text-gray-500 text-base">
          Trendyol, Hepsiburada, Amazon ve Etsy'de listing yazma, AI görsel kullanımı ve platform stratejileri.
        </p>
      </section>

      {/* KATEGORİLER */}
      {cats.length > 1 && (
        <section className="px-4 sm:px-6 pb-6">
          <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-2">
            {cats.map((k) => (
              <span key={k} className="text-xs bg-orange-50 text-orange-700 border border-orange-200 px-3 py-1.5 rounded-full font-medium">
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
                  <div className="w-full h-40 bg-orange-50 flex items-center justify-center">
                    <span className="text-4xl">📝</span>
                  </div>
                )}
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs bg-orange-50 text-orange-600 border border-orange-100 px-2 py-0.5 rounded-full font-medium">
                      {yazi.kategori}
                    </span>
                    <span className="text-xs text-gray-400">{yazi.okumaSuresi} dk okuma</span>
                  </div>
                  <h2 className="font-bold text-gray-800 text-sm leading-snug mb-2 group-hover:text-orange-600 transition-colors line-clamp-3">
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
                    <span className="text-xs text-orange-500 font-medium group-hover:underline">
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
      <section className="px-4 sm:px-6 py-14 bg-orange-50 border-y border-orange-100 text-center">
        <h2 className="text-xl font-bold text-gray-800 mb-3">Okuduktan sonra dene</h2>
        <p className="text-sm text-gray-500 mb-6">3 ücretsiz kredi ile listing ve görsel üret. Kayıt bile olmadan misafir olarak başla.</p>
        <a
          href="/auth"
          className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3.5 rounded-xl text-sm transition-colors shadow-lg shadow-orange-100"
        >
          Ücretsiz Dene →
        </a>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-100 px-4 sm:px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 text-xs text-gray-400">
            <a href="/fiyatlar" className="hover:text-orange-500">Fiyatlar</a>
            <span>·</span>
            <a href="/blog" className="hover:text-orange-500">Blog</a>
            <span>·</span>
            <a href="/hakkimizda" className="hover:text-orange-500">Hakkımızda</a>
            <span>·</span>
            <a href="/gizlilik" className="hover:text-orange-500">Gizlilik Politikası</a>
            <span>·</span>
            <a href="mailto:destek@yzliste.com" className="hover:text-orange-500">destek@yzliste.com</a>
          </div>
          <p className="text-center text-xs text-gray-400">© 2026 yzliste · SIMOON PAZARLAMA VE DANISMANLIK LIMITED SIRKETI</p>
        </div>
      </footer>
    </main>
  );
}
