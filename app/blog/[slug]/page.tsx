import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getYazilar, yaziGetir, type BlogYazisi, type BlogBolum } from "../icerikler";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const revalidate = 3600;

export async function generateStaticParams() {
  const yazilar = await getYazilar();
  return yazilar.map((y) => ({ slug: y.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const yazi = await yaziGetir(slug);
  if (!yazi) return { title: { absolute: "Yazı bulunamadı | yzliste" } };

  return {
    title: yazi.baslik,
    description: yazi.ozet,
    keywords: yazi.etiketler,
    authors: [{ name: yazi.yazarAdi }],
    openGraph: {
      title: yazi.baslik,
      description: yazi.ozet,
      url: `https://www.yzliste.com/blog/${yazi.slug}`,
      type: "article",
      publishedTime: yazi.yayinTarihi,
      modifiedTime: yazi.guncellemeTarihi ?? yazi.yayinTarihi,
      authors: [yazi.yazarAdi],
      tags: yazi.etiketler,
      images: [{ url: yazi.kapakGorsel ? `https://www.yzliste.com${yazi.kapakGorsel}` : `https://www.yzliste.com/api/og?title=${encodeURIComponent(yazi.baslik)}&kategori=${encodeURIComponent(yazi.kategori)}`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: yazi.baslik,
      description: yazi.ozet,
      images: [yazi.kapakGorsel ? `https://www.yzliste.com${yazi.kapakGorsel}` : `https://www.yzliste.com/api/og?title=${encodeURIComponent(yazi.baslik)}&kategori=${encodeURIComponent(yazi.kategori)}`],
    },
    alternates: {
      canonical: `https://www.yzliste.com/blog/${yazi.slug}`,
      languages: { 'tr': `https://www.yzliste.com/blog/${yazi.slug}`, 'x-default': `https://www.yzliste.com/blog/${yazi.slug}` },
    },
    robots: { index: true, follow: true },
  };
}

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
          url: `https://www.yzliste.com/blog/${yazi.slug}`,
          inLanguage: "tr",
          author: { "@id": "https://www.yzliste.com/#organization" },
          publisher: { "@id": "https://www.yzliste.com/#organization" },
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

function MetinLink({ text }: { text: string }) {
  type Token = { type: 'link'; label: string; href: string } | { type: 'text'; value: string }
  const tokens: Token[] = []
  const regex = /\[([^\]]+)\]\(([^)]+)\)|(yzliste)/gi
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) tokens.push({ type: 'text', value: text.slice(lastIndex, match.index) })
    if (match[1]) tokens.push({ type: 'link', label: match[1], href: match[2] })
    else tokens.push({ type: 'link', label: 'yzliste', href: '/uret' })
    lastIndex = regex.lastIndex
  }
  if (lastIndex < text.length) tokens.push({ type: 'text', value: text.slice(lastIndex) })

  return (
    <>
      {tokens.map((t, i) =>
        t.type === 'link' ? (
          t.href.startsWith('http') ? (
            <a key={i} href={t.href} target="_blank" rel="noopener noreferrer" className="text-[#1E4DD8] hover:text-[#163B9E] underline">{t.label}</a>
          ) : (
            <Link key={i} href={t.href} className="text-[#1E4DD8] hover:text-[#163B9E] underline">{t.label}</Link>
          )
        ) : (
          t.value
        )
      )}
    </>
  )
}

function Bolum({ bolum }: { bolum: BlogBolum }) {
  switch (bolum.tip) {
    case "giris":
      return (
        <p className="text-base text-[#5A5852] leading-relaxed font-medium border-l-4 border-[#7B9BD9] pl-4 italic">
          <MetinLink text={bolum.metin ?? ""} />
        </p>
      );
    case "baslik":
      return (
        <div className="mt-8 pt-4 border-t border-[#F1F0EB]">
          <h2 className="text-xl font-medium text-[#1A1A17] mb-3">{bolum.baslik}</h2>
          {bolum.metin && (
            <p className="text-sm text-[#5A5852] leading-relaxed"><MetinLink text={bolum.metin} /></p>
          )}
        </div>
      );
    case "paragraf":
      return (
        <p className="text-sm text-[#5A5852] leading-relaxed"><MetinLink text={bolum.metin ?? ""} /></p>
      );
    case "liste":
      return (
        <ul className="space-y-2 my-2">
          {(bolum.maddeler ?? []).map((madde, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-[#5A5852]">
              <span className="w-5 h-5 rounded-full bg-[#F0F4FB] text-[#1E4DD8] flex items-center justify-center text-[10px] font-medium flex-shrink-0 mt-0.5">
                {i + 1}
              </span>
              <MetinLink text={madde} />
            </li>
          ))}
        </ul>
      );
    case "bilgi-kutusu":
      return (
        <div className="bg-[#F0F4FB] border border-[#BAC9EB] rounded-xl p-5 my-4">
          <p className="text-sm text-[#1E4DD8] leading-relaxed"><MetinLink text={bolum.metin ?? ""} /></p>
        </div>
      );
    case "sonuc":
      return (
        <div className="bg-[#F1F0EB] border border-[#D8D6CE] rounded-xl p-5 my-4">
          <p className="text-xs font-medium text-[#908E86] uppercase tracking-wide mb-2">Sonuç</p>
          <p className="text-sm text-[#5A5852] leading-relaxed"><MetinLink text={bolum.metin ?? ""} /></p>
        </div>
      );
    case "video-grid": {
      const maddeler = bolum.maddeler ?? [];
      const gridClass = maddeler.length === 1 ? "grid grid-cols-1 gap-3 my-6 max-w-sm" : "grid grid-cols-2 gap-3 my-6";
      return (
        <div className={gridClass}>
          {maddeler.map((madde, i) => {
            const [src, etiket] = madde.split("|");
            const trimmedSrc = src?.trim();
            const isVideo = trimmedSrc?.match(/\.(mp4|webm|mov)$/i);
            return (
              <div key={i} className="rounded-xl overflow-hidden border border-[#D8D6CE] bg-[#F1F0EB]">
                {isVideo ? (
                  <video
                    src={trimmedSrc}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full aspect-video object-cover"
                  />
                ) : (
                  <img
                    src={trimmedSrc}
                    alt={etiket?.trim() ?? ""}
                    className="w-full aspect-video object-cover"
                  />
                )}
                {etiket && (
                  <p className="text-xs text-center text-[#908E86] py-1.5">{etiket.trim()}</p>
                )}
              </div>
            );
          })}
        </div>
      );
    }
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
  const digerYazilar = yazilar
    .filter((y) => y.slug !== yazi.slug)
    .map((y) => ({
      yazi: y,
      score:
        y.etiketler.filter((e) => yazi.etiketler.includes(e)).length * 2 +
        (y.kategori === yazi.kategori ? 1 : 0),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((s) => s.yazi);

  return (
    <main className="min-h-screen bg-[#FAFAF8] font-sans">
      <ArticleJsonLd yazi={yazi} />

      <SiteHeader aktifSayfa="blog" />

      {/* BREADCRUMB */}
      <div className="px-4 sm:px-6 py-4 max-w-3xl mx-auto">
        <nav aria-label="Breadcrumb" className="text-xs text-[#908E86] flex items-center gap-1.5">
          <Link href="/" className="hover:text-[#1E4DD8]">Ana Sayfa</Link>
          <span>›</span>
          <Link href="/blog" className="hover:text-[#1E4DD8]">Blog</Link>
          <span>›</span>
          <span className="text-[#5A5852] truncate max-w-[200px]">{yazi.baslik}</span>
        </nav>
      </div>

      {/* MAKALE */}
      <article className="px-4 sm:px-6 pb-16 max-w-3xl mx-auto">
        <header className="mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-xs bg-[#F0F4FB] text-[#1E4DD8] border border-[#BAC9EB] px-3 py-1 rounded font-medium">
              {yazi.kategori}
            </span>
            <span className="text-xs text-[#908E86]">{yazi.okumaSuresi} dakika okuma</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-medium text-[#1A1A17] leading-snug mb-4">
            {yazi.baslik}
          </h1>

          <p className="text-sm text-[#5A5852] leading-relaxed mb-5">{yazi.ozet}</p>

          <div className="flex items-center gap-3 text-xs text-[#908E86] pb-6 border-b border-[#F1F0EB]">
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

        {yazi.kapakGorsel && (
          <div className="mb-8 rounded-xl overflow-hidden">
            <img
              src={yazi.kapakGorsel}
              alt={yazi.baslik}
              className="w-full object-cover max-h-72"
            />
          </div>
        )}

        <div className="space-y-4">
          {yazi.icerik.map((bolum, i) => (
            <Bolum key={i} bolum={bolum} />
          ))}
        </div>

        {/* Etiketler */}
        <div className="mt-10 pt-6 border-t border-[#F1F0EB]">
          <div className="flex flex-wrap gap-2">
            {yazi.etiketler.map((e) => (
              <span key={e} className="text-xs text-[#908E86] bg-[#F1F0EB] px-3 py-1 rounded-full">
                #{e}
              </span>
            ))}
          </div>
        </div>
      </article>

      {/* CTA */}
      <section className="px-4 sm:px-6 py-12 bg-[#F0F4FB] border-y border-[#BAC9EB] text-center">
        <h2 className="text-xl font-medium text-[#1A1A17] mb-2">Okuduktan sonra dene</h2>
        <p className="text-sm text-[#5A5852] mb-5">
          3 ücretsiz kredi ile listing metni ve AI görsel üret. Kayıt olmadan misafir olarak başla.
        </p>
        <a
          href="/kayit"
          className="inline-block bg-[#1E4DD8] hover:bg-[#163B9E] text-white font-medium px-8 py-3.5 rounded-lg text-sm transition-colors"
        >
          Ücretsiz dene →
        </a>
      </section>

      {/* İLGİLİ YAZILAR */}
      {digerYazilar.length > 0 && (
        <section className="px-4 sm:px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-lg font-medium text-[#1A1A17] mb-6">İlgili yazılar</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {digerYazilar.map((y) => (
                <Link
                  key={y.slug}
                  href={`/blog/${y.slug}`}
                  className="group border border-[#D8D6CE] rounded-xl p-4 hover:border-[#1E4DD8]/40 transition-colors bg-white"
                >
                  <span className="text-xs text-[#1E4DD8] font-medium">{y.kategori}</span>
                  <h3 className="text-sm font-medium text-[#1A1A17] mt-1 group-hover:text-[#1E4DD8] transition-colors line-clamp-3">
                    {y.baslik}
                  </h3>
                  <p className="text-xs text-[#1E4DD8] mt-2">Oku →</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <SiteFooter />
    </main>
  );
}
