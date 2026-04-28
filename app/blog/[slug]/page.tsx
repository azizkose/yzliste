import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft,
  User,
  Calendar,
  Clock,
} from "lucide-react";
import {
  getYazilar,
  yaziGetir,
  type BlogYazisi,
  type BlogBolum,
} from "../icerikler";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import BlogPaylas from "./BlogPaylas";

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
      images: [
        {
          url: yazi.kapakGorsel
            ? `https://www.yzliste.com${yazi.kapakGorsel}`
            : `https://www.yzliste.com/api/og?title=${encodeURIComponent(yazi.baslik)}&kategori=${encodeURIComponent(yazi.kategori)}`,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: yazi.baslik,
      description: yazi.ozet,
      images: [
        yazi.kapakGorsel
          ? `https://www.yzliste.com${yazi.kapakGorsel}`
          : `https://www.yzliste.com/api/og?title=${encodeURIComponent(yazi.baslik)}&kategori=${encodeURIComponent(yazi.kategori)}`,
      ],
    },
    alternates: {
      canonical: `https://www.yzliste.com/blog/${yazi.slug}`,
      languages: {
        tr: `https://www.yzliste.com/blog/${yazi.slug}`,
        "x-default": `https://www.yzliste.com/blog/${yazi.slug}`,
      },
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
  type Token =
    | { type: "link"; label: string; href: string }
    | { type: "text"; value: string };
  const tokens: Token[] = [];
  const regex = /\[([^\]]+)\]\(([^)]+)\)|(yzliste)/gi;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex)
      tokens.push({ type: "text", value: text.slice(lastIndex, match.index) });
    if (match[1])
      tokens.push({ type: "link", label: match[1], href: match[2] });
    else tokens.push({ type: "link", label: "yzliste", href: "/uret" });
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length)
    tokens.push({ type: "text", value: text.slice(lastIndex) });

  return (
    <>
      {tokens.map((t, i) =>
        t.type === "link" ? (
          t.href.startsWith("http") ? (
            <a
              key={i}
              href={t.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-rd-primary-600 hover:text-rd-primary-700 underline underline-offset-2"
            >
              {t.label}
            </a>
          ) : (
            <Link
              key={i}
              href={t.href}
              className="text-rd-primary-600 hover:text-rd-primary-700 underline underline-offset-2"
            >
              {t.label}
            </Link>
          )
        ) : (
          t.value
        )
      )}
    </>
  );
}

function Bolum({ bolum }: { bolum: BlogBolum }) {
  switch (bolum.tip) {
    case "giris":
      return (
        <p className="text-base text-rd-neutral-600 leading-relaxed font-medium border-l-4 border-rd-primary-300 pl-4 italic">
          <MetinLink text={bolum.metin ?? ""} />
        </p>
      );
    case "baslik":
      return (
        <div className="mt-8 pt-4 border-t border-rd-neutral-100">
          <h2
            className="text-xl font-medium text-rd-neutral-900 mb-3"
            style={{ fontFamily: "var(--font-rd-display)" }}
          >
            {bolum.baslik}
          </h2>
          {bolum.metin && (
            <p className="text-sm text-rd-neutral-600 leading-relaxed">
              <MetinLink text={bolum.metin} />
            </p>
          )}
        </div>
      );
    case "paragraf":
      return (
        <p className="text-sm text-rd-neutral-600 leading-relaxed">
          <MetinLink text={bolum.metin ?? ""} />
        </p>
      );
    case "liste":
      return (
        <ul className="space-y-2 my-2">
          {(bolum.maddeler ?? []).map((madde, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-rd-neutral-600">
              <span className="w-5 h-5 rounded-full bg-rd-primary-50 text-rd-primary-700 flex items-center justify-center text-[10px] font-medium flex-shrink-0 mt-0.5">
                {i + 1}
              </span>
              <MetinLink text={madde} />
            </li>
          ))}
        </ul>
      );
    case "bilgi-kutusu":
      return (
        <div className="bg-rd-primary-50 border border-rd-primary-200 rounded-xl p-5 my-4">
          <p className="text-sm text-rd-primary-700 leading-relaxed">
            <MetinLink text={bolum.metin ?? ""} />
          </p>
        </div>
      );
    case "sonuc":
      return (
        <div className="bg-rd-neutral-100 border border-rd-neutral-200 rounded-xl p-5 my-4">
          <p className="text-xs font-medium text-rd-neutral-500 uppercase tracking-wide mb-2">
            Sonuç
          </p>
          <p className="text-sm text-rd-neutral-600 leading-relaxed">
            <MetinLink text={bolum.metin ?? ""} />
          </p>
        </div>
      );
    case "video-grid": {
      const maddeler = bolum.maddeler ?? [];
      const gridClass =
        maddeler.length === 1
          ? "grid grid-cols-1 gap-3 my-6 max-w-sm"
          : "grid grid-cols-2 gap-3 my-6";
      return (
        <div className={gridClass}>
          {maddeler.map((madde, i) => {
            const [src, etiket] = madde.split("|");
            const trimmedSrc = src?.trim();
            const isVideo = trimmedSrc?.match(/\.(mp4|webm|mov)$/i);
            return (
              <div
                key={i}
                className="rounded-xl overflow-hidden border border-rd-neutral-200 bg-rd-neutral-100"
              >
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
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={trimmedSrc}
                    alt={etiket?.trim() ?? ""}
                    className="w-full aspect-video object-cover"
                  />
                )}
                {etiket && (
                  <p className="text-xs text-center text-rd-neutral-500 py-1.5">
                    {etiket.trim()}
                  </p>
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
    <main className="min-h-screen bg-rd-neutral-50 font-sans">
      <ArticleJsonLd yazi={yazi} />

      <SiteHeader aktifSayfa="blog" />

      {/* GERİ LİNK */}
      <div className="px-4 sm:px-6 py-4 max-w-3xl mx-auto">
        <nav aria-label="Geri">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-xs text-rd-neutral-500 hover:text-rd-primary-600 transition-colors"
          >
            <ChevronLeft size={14} strokeWidth={1.5} aria-hidden="true" />
            Tüm yazılar
          </Link>
        </nav>
      </div>

      {/* MAKALE */}
      <article
        aria-labelledby="blog-yazi-baslik"
        className="px-4 sm:px-6 pb-16 max-w-3xl mx-auto"
      >
        <header className="mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-xs bg-rd-warm-50 text-rd-warm-700 border border-rd-warm-200 px-3 py-1 rounded font-medium">
              {yazi.kategori}
            </span>
            <span className="text-xs text-rd-neutral-400">
              {yazi.okumaSuresi} dakika okuma
            </span>
          </div>

          <h1
            id="blog-yazi-baslik"
            className="text-2xl sm:text-3xl font-medium text-rd-neutral-900 leading-snug mb-4"
            style={{
              fontFamily: "var(--font-rd-display)",
              letterSpacing: "-0.01em",
            }}
          >
            {yazi.baslik}
          </h1>

          <p className="text-sm text-rd-neutral-600 leading-relaxed mb-5">
            {yazi.ozet}
          </p>

          <div className="flex flex-wrap items-center gap-3 text-xs text-rd-neutral-500 pb-5 border-b border-rd-neutral-100">
            <span className="flex items-center gap-1.5">
              <User size={12} strokeWidth={1.5} aria-hidden="true" />
              {yazi.yazarAdi || "yzliste ekibi"}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar size={12} strokeWidth={1.5} aria-hidden="true" />
              {new Date(yazi.yayinTarihi).toLocaleDateString("tr-TR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
            {yazi.guncellemeTarihi &&
              yazi.guncellemeTarihi !== yazi.yayinTarihi && (
                <span className="flex items-center gap-1.5">
                  <Clock size={12} strokeWidth={1.5} aria-hidden="true" />
                  Güncellendi:{" "}
                  {new Date(yazi.guncellemeTarihi).toLocaleDateString("tr-TR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              )}
          </div>

          <div className="mt-4">
            <BlogPaylas url={`/blog/${yazi.slug}`} title={yazi.baslik} />
          </div>
        </header>

        {yazi.kapakGorsel && (
          <div className="mb-8 rounded-xl overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
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
        <div className="mt-10 pt-6 border-t border-rd-neutral-100">
          <div className="flex flex-wrap gap-2">
            {yazi.etiketler.map((e) => (
              <span
                key={e}
                className="text-xs text-rd-neutral-500 bg-rd-neutral-100 px-3 py-1 rounded-full"
              >
                #{e}
              </span>
            ))}
          </div>
        </div>
      </article>

      {/* CTA — warm-earth */}
      <section className="px-4 sm:px-6 py-12">
        <div className="max-w-3xl mx-auto rounded-xl border border-rd-warm-300 bg-rd-warm-50 p-6 md:p-8">
          <p className="text-xs font-medium tracking-[0.1em] uppercase text-rd-warm-600 mb-3">
            Bu yazıdan ilham
          </p>
          <h3
            className="text-xl font-medium text-rd-neutral-900 mb-2"
            style={{ fontFamily: "var(--font-rd-display)" }}
          >
            yzliste&apos;yi ücretsiz dene
          </h3>
          <p className="text-sm text-rd-neutral-600 mb-5">
            Listing yazımı, görsel üretimi, video try-on — tek platformda.
          </p>
          <Link
            href="/uret"
            className="inline-block bg-rd-primary-700 hover:bg-rd-primary-800 text-white font-medium px-8 py-3.5 rounded-lg text-sm transition-colors"
          >
            Hemen başla →
          </Link>
        </div>
      </section>

      {/* İLGİLİ YAZILAR */}
      {digerYazilar.length > 0 && (
        <section className="px-4 sm:px-6 py-12 border-t border-rd-neutral-100">
          <div className="max-w-4xl mx-auto">
            <h2
              className="text-lg font-medium text-rd-neutral-900 mb-6"
              style={{ fontFamily: "var(--font-rd-display)" }}
            >
              Devamı
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {digerYazilar.map((y) => {
                const titleId = `ilgili-kart-${y.slug}`;
                return (
                  <article key={y.slug} aria-labelledby={titleId}>
                    <Link
                      href={`/blog/${y.slug}`}
                      className="group flex flex-col h-full border border-rd-neutral-200 rounded-xl p-4 hover:border-rd-primary-300 transition-colors bg-white"
                    >
                      <span className="text-xs text-rd-warm-700 bg-rd-warm-50 border border-rd-warm-200 px-2 py-0.5 rounded font-medium self-start mb-2">
                        {y.kategori}
                      </span>
                      <h3
                        id={titleId}
                        className="text-sm font-medium text-rd-neutral-900 group-hover:text-rd-primary-700 transition-colors line-clamp-3 flex-1"
                      >
                        {y.baslik}
                      </h3>
                      <p className="text-xs text-rd-primary-600 mt-2">
                        Oku →
                      </p>
                    </Link>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <SiteFooter />
    </main>
  );
}
