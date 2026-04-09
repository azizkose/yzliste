import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getYazilar, yaziGetir, type BlogYazisi, type BlogBolum } from "../icerikler";

export const revalidate = 3600; // 1 saat ISR cache

// Statik sayfalar oluştur (SSG)
export async function generateStaticParams() {
  const yazilar = await getYazilar();
  return yazilar.map((y) => ({ slug: y.slug }));
}

// Dinamik metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const yazi = await yaziGetir(slug);
  if (!yazi) return { title: "Yazı bulunamadı | yzliste" };

  return {
    title: `${yazi.baslik} | yzliste Blog`,
    description: yazi.ozet,
    keywords: yazi.etiketler,
    authors: [{ name: yazi.yazarAdi }],
    openGraph: {
      title: yazi.baslik,
      description: yazi.ozet,
      url: `https://yzliste.com/blog/${yazi.slug}`,
      type: "article",
      publishedTime: yazi.yayinTarihi,
      modifiedTime: yazi.guncellemeTarihi ?? yazi.yayinTarihi,
      authors: [yazi.yazarAdi],
      tags: yazi.etiketler,
      images: yazi.kapakGorsel
        ? [{ url: `https://yzliste.com${yazi.kapakGorsel}` }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: yazi.baslik,
      description: yazi.ozet,
    },
    alternates: {
      canonical: `https://yzliste.com/blog/${yazi.slug}`,
    },
    robots: { index: true, follow: true },
  };
}

// JSON-LD: Article schema
function ArticleJsonLd({ yazi }: { yazi: BlogYazisi }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: yazi.baslik,
          description: yazi.ozet,
          datePublished: yazi.yayinTarihi,
          dateModified: yazi.guncellemeTarihi ?? yazi.yayinTarihi,
          url: `https://yzliste.com/blog/${yazi.slug}`,
          inLanguage: "tr",
          author: {
            "@type": "Organization",
            name: yazi.yazarAdi,
            url: "https://yzliste.com",
          },
          publisher: {
            "@type": "Organization",
            name: "yzliste",
            url: "https://yzliste.com",
            logo: {
              "@type": "ImageObject",
              url: "https://yzliste.com/yzliste_logo.png",
            },
          },
          image: yazi.kapakGorsel
            ? `https://yzliste.com${yazi.kapakGorsel}`
            : "https://yzliste.com/yzliste_logo.png",
          keywords: yazi.etiketler.join(", "),
          articleSection: yazi.kategori,
        }),
      }}
    />
  );
}

// İçerik bölümü render'ı
function Bolum({ bolum }: { bolum: BlogBolum }) {
  switch (bolum.tip) {
    case "giris":
      return (
        <p className="text-base text-gray-600 leading-relaxed font-medium border-l-4 border-orange-300 pl-4 italic">
          {bolum.metin}
        </p>
      );
    case "baslik":
      return (
        <div className="mt-8 pt-4 border-t border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-3">{bolum.baslik}</h2>
          {bolum.metin && (
            <p className="text-sm text-gray-600 leading-relaxed">{bolum.metin}</p>
          )}
        </div>
      );
    case "paragraf":
      return (
        <p className="text-sm text-gray-600 leading-relaxed">{bolum.metin}</p>
      );
    case "liste":
      return (
        <ul className="space-y-2 my-2">
          {(bolum.maddeler ?? []).map((madde, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
              <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                {i + 1}
              </span>
              {madde}
            </li>
          ))}
        </ul>
      );
    case "bilgi-kutusu":
      return (
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 my-4">
          <p className="text-sm text-orange-800 leading-relaxed">{bolum.metin}</p>
        </div>
      );
    case "sonuc":
      return (
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 my-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Sonuç</p>
          <p className="text-sm text-gray-700 leading-relaxed">{bolum.metin}</p>
        </div>
      );
    default:
      return null;
  }
}

export default async function BlogYaziPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const yazi = await yaziGetir(slug);
  if (!yazi) notFound();

  const yazilar = await getYazilar();
  const digerYazilar = yazilar.filter((y) => y.slug !== yazi.slug).slice(0, 3);

  return (
    <main className="min-h-screen bg-white font-sans">
      <ArticleJsonLd yazi={yazi} />

      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-100 px-4 sm:px-6 py-2.5">
        <div className="max-w-6xl mx-auto flex items-center gap-2">
          <a href="/" className="flex-shrink-0 mr-1">
            <img src="/yzliste_logo.png" alt="yzliste" className="h-8" />
          </a>
          <nav className="flex items-center gap-0.5 text-xs sm:text-sm text-gray-500">
            <a href="/fiyatlar" className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-gray-100 hover:text-gray-800 transition-colors whitespace-nowrap">Fiyatlar</a>
            <a href="/blog" className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-orange-600 font-medium whitespace-nowrap">Blog</a>
          </nav>
          <div className="flex gap-1 sm:gap-2 ml-auto items-center">
            <a href="/auth" className="text-xs sm:text-sm text-gray-500 hover:text-gray-800 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap">Giriş Yap</a>
            <a href="/auth" className="hidden sm:block text-xs sm:text-sm bg-orange-500 text-white px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-orange-600 transition-colors font-medium whitespace-nowrap">Ücretsiz Başla</a>
          </div>
        </div>
      </header>

      {/* BREADCRUMB */}
      <div className="px-4 sm:px-6 py-4 max-w-3xl mx-auto">
        <nav aria-label="Breadcrumb" className="text-xs text-gray-400 flex items-center gap-1.5">
          <a href="/" className="hover:text-orange-500">Ana Sayfa</a>
          <span>›</span>
          <a href="/blog" className="hover:text-orange-500">Blog</a>
          <span>›</span>
          <span className="text-gray-600 truncate max-w-[200px]">{yazi.baslik}</span>
        </nav>
      </div>

      {/* MAKALE */}
      <article className="px-4 sm:px-6 pb-16 max-w-3xl mx-auto">
        {/* Meta bilgi */}
        <header className="mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-xs bg-orange-50 text-orange-600 border border-orange-100 px-3 py-1 rounded-full font-medium">
              {yazi.kategori}
            </span>
            <span className="text-xs text-gray-400">{yazi.okumaSuresi} dakika okuma</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-snug mb-4">
            {yazi.baslik}
          </h1>

          <p className="text-sm text-gray-500 leading-relaxed mb-5">{yazi.ozet}</p>

          <div className="flex items-center gap-3 text-xs text-gray-400 pb-6 border-b border-gray-100">
            <span>
              {new Date(yazi.yayinTarihi).toLocaleDateString("tr-TR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
            {yazi.guncellemeTarihi && yazi.guncellemeTarihi !== yazi.yayinTarihi && (
              <>
                <span>·</span>
                <span>
                  Güncellendi:{" "}
                  {new Date(yazi.guncellemeTarihi).toLocaleDateString("tr-TR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </>
            )}
            <span>·</span>
            <span>{yazi.yazarAdi}</span>
          </div>
        </header>

        {/* Kapak görseli */}
        {yazi.kapakGorsel && (
          <div className="mb-8 rounded-2xl overflow-hidden">
            <img
              src={yazi.kapakGorsel}
              alt={yazi.baslik}
              className="w-full object-cover max-h-72"
            />
          </div>
        )}

        {/* İçerik */}
        <div className="space-y-4">
          {yazi.icerik.map((bolum, i) => (
            <Bolum key={i} bolum={bolum} />
          ))}
        </div>

        {/* Etiketler */}
        <div className="mt-10 pt-6 border-t border-gray-100">
          <div className="flex flex-wrap gap-2">
            {yazi.etiketler.map((e) => (
              <span key={e} className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                #{e}
              </span>
            ))}
          </div>
        </div>
      </article>

      {/* CTA */}
      <section className="px-4 sm:px-6 py-12 bg-orange-50 border-y border-orange-100 text-center">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Okuduktan sonra dene</h2>
        <p className="text-sm text-gray-500 mb-5">
          3 ücretsiz kredi ile listing metni ve AI görsel üret. Kayıt olmadan misafir olarak başla.
        </p>
        <a
          href="/auth"
          className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3.5 rounded-xl text-sm transition-colors shadow-lg shadow-orange-100"
        >
          Ücretsiz Dene →
        </a>
      </section>

      {/* DİĞER YAZILAR */}
      {digerYazilar.length > 0 && (
        <section className="px-4 sm:px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-lg font-bold text-gray-800 mb-6">Diğer yazılar</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {digerYazilar.map((y) => (
                <Link
                  key={y.slug}
                  href={`/blog/${y.slug}`}
                  className="group border border-gray-100 rounded-2xl p-4 hover:shadow-md transition-shadow bg-white"
                >
                  <span className="text-xs text-orange-600 font-medium">{y.kategori}</span>
                  <h3 className="text-sm font-semibold text-gray-800 mt-1 group-hover:text-orange-600 transition-colors line-clamp-3">
                    {y.baslik}
                  </h3>
                  <p className="text-xs text-orange-500 mt-2 font-medium">Oku →</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

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
