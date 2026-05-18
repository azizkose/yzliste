// P1-6 SEO fix: Kategori bazlı blog hub sayfaları.
// 5 kategori × her biri ~12-45 yazı. Internal linking için doğal hub, kategori-bazlı keyword cluster için indexable.
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getYazilar, kategoriler } from "../../icerikler";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { Eyebrow } from "@/components/primitives/Eyebrow";

export const revalidate = 3600;
export const dynamicParams = false;

// Slug helpers — kategori adını URL-safe slug'a çevir + tersine
function kategoriToSlug(kategori: string): string {
  return kategori
    .toLocaleLowerCase("tr")
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

async function findKategoriBySlug(slug: string): Promise<string | null> {
  const cats = await kategoriler();
  return cats.find((c) => kategoriToSlug(c) === slug) ?? null;
}

export async function generateStaticParams() {
  const cats = await kategoriler();
  return cats.map((c) => ({ slug: kategoriToSlug(c) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const kategori = await findKategoriBySlug(slug);
  if (!kategori) {
    return {
      title: { absolute: "Kategori bulunamadı | yzliste" },
      robots: { index: false, follow: false },
      alternates: { canonical: undefined },
    };
  }

  const yazilar = await getYazilar();
  const count = yazilar.filter((y) => y.kategori === kategori).length;

  const title = `${kategori} — Blog kategorisi`;
  const description = `${kategori} kategorisindeki ${count} yzliste rehber yazısı. E-ticaret satıcıları için pratik içerik ve stratejiler.`;

  return {
    title,
    description,
    openGraph: {
      title: `${kategori} | yzliste blog`,
      description,
      url: `https://www.yzliste.com/blog/kategori/${slug}`,
      type: "website",
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: kategori }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${kategori} | yzliste blog`,
      description,
    },
    alternates: {
      canonical: `https://www.yzliste.com/blog/kategori/${slug}`,
      languages: {
        tr: `https://www.yzliste.com/blog/kategori/${slug}`,
        "x-default": `https://www.yzliste.com/blog/kategori/${slug}`,
      },
    },
    robots: { index: true, follow: true },
  };
}

export default async function BlogKategoriPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const kategori = await findKategoriBySlug(slug);
  if (!kategori) notFound();

  const yazilar = await getYazilar();
  const kategoriYazilari = yazilar
    .filter((y) => y.kategori === kategori)
    .sort((a, b) => new Date(b.yayinTarihi).getTime() - new Date(a.yayinTarihi).getTime());

  return (
    <main className="min-h-screen bg-rd-neutral-50 font-sans">
      {/* CollectionPage JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: `${kategori} — yzliste blog`,
            description: `${kategori} kategorisindeki ${kategoriYazilari.length} rehber yazısı.`,
            url: `https://www.yzliste.com/blog/kategori/${slug}`,
            inLanguage: "tr",
            isPartOf: { "@id": "https://www.yzliste.com/#website" },
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: kategoriYazilari.length,
              itemListElement: kategoriYazilari.map((y, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: y.baslik,
                url: `https://www.yzliste.com/blog/${y.slug}`,
              })),
            },
          }),
        }}
      />

      {/* Breadcrumb JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Anasayfa", item: "https://www.yzliste.com" },
              { "@type": "ListItem", position: 2, name: "Blog", item: "https://www.yzliste.com/blog" },
              { "@type": "ListItem", position: 3, name: kategori, item: `https://www.yzliste.com/blog/kategori/${slug}` },
            ],
          }),
        }}
      />

      <SiteHeader aktifSayfa="blog" />

      {/* Geri link */}
      <div className="px-4 sm:px-6 py-4 max-w-3xl mx-auto">
        <nav aria-label="Geri">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-xs text-rd-neutral-500 hover:text-rd-primary-600 transition-colors"
          >
            ← Tüm yazılar
          </Link>
        </nav>
      </div>

      {/* HERO */}
      <section className="px-4 sm:px-6 pt-8 pb-8 max-w-3xl mx-auto text-center">
        <Eyebrow color="primary" className="mb-3 justify-center">
          Blog kategorisi
        </Eyebrow>
        <h1
          className="text-3xl sm:text-5xl font-medium text-rd-neutral-900 mb-4"
          style={{ fontFamily: "var(--font-rd-display)", letterSpacing: "-0.01em" }}
        >
          {kategori}
        </h1>
        <p className="text-rd-neutral-600 text-base">
          Bu kategoride {kategoriYazilari.length} rehber yazısı var.
        </p>
      </section>

      {/* Yazı listesi */}
      <section className="px-4 sm:px-6 pb-16 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {kategoriYazilari.map((y) => (
            <article key={y.slug} className="border border-rd-neutral-200 rounded-xl p-4 bg-white hover:border-rd-primary-300 transition-colors">
              <Link href={`/blog/${y.slug}`} className="block group">
                <p className="text-xs text-rd-neutral-400 mb-2">
                  {new Date(y.yayinTarihi).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}
                  {" · "}
                  {y.okumaSuresi} dakika
                </p>
                <h2 className="text-base font-medium text-rd-neutral-900 group-hover:text-rd-primary-700 transition-colors line-clamp-2 mb-2">
                  {y.baslik}
                </h2>
                <p className="text-sm text-rd-neutral-600 line-clamp-2">{y.ozet}</p>
                <p className="text-xs text-rd-primary-600 mt-3">Oku →</p>
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* Diğer kategoriler */}
      <DigerKategoriler current={kategori} />

      <SiteFooter />
    </main>
  );
}

async function DigerKategoriler({ current }: { current: string }) {
  const cats = await kategoriler();
  const others = cats.filter((c) => c !== current);

  if (others.length === 0) return null;

  return (
    <section className="px-4 sm:px-6 py-12 border-t border-rd-neutral-100">
      <div className="max-w-3xl mx-auto">
        <h2
          className="text-lg font-medium text-rd-neutral-900 mb-6"
          style={{ fontFamily: "var(--font-rd-display)" }}
        >
          Diğer kategoriler
        </h2>
        <div className="flex flex-wrap gap-2">
          {others.map((c) => (
            <Link
              key={c}
              href={`/blog/kategori/${kategoriToSlug(c)}`}
              className="text-sm bg-rd-primary-50 text-rd-primary-700 border border-rd-primary-200 px-4 py-2 rounded-lg hover:bg-rd-primary-100 transition-colors"
            >
              {c}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
