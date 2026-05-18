import type { MetadataRoute } from "next";
import { getYazilar, kategoriler } from "./blog/icerikler";

// P1-6 SEO fix: kategori slug helper (page.tsx ile aynı mantık)
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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.yzliste.com";


  // Ana sayfalar
  const mainPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      changeFrequency: "daily",
      priority: 1,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/uret`,
      changeFrequency: "weekly",
      priority: 0.9,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/blog`,
      changeFrequency: "weekly",
      priority: 0.9,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/fiyatlar`,
      changeFrequency: "monthly",
      priority: 0.8,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/sss`,
      changeFrequency: "monthly",
      priority: 0.5,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/hakkimizda`,
      changeFrequency: "monthly",
      priority: 0.4,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/gizlilik`,
      changeFrequency: "monthly",
      priority: 0.3,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/kosullar`,
      changeFrequency: "monthly",
      priority: 0.3,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/kvkk-aydinlatma`,
      changeFrequency: "monthly",
      priority: 0.3,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/cerez-politikasi`,
      changeFrequency: "monthly",
      priority: 0.3,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/mesafeli-satis`,
      changeFrequency: "monthly",
      priority: 0.3,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/teslimat-iade`,
      changeFrequency: "monthly",
      priority: 0.3,
      lastModified: new Date(),
    },
  ];

  // Blog yazıları — dinamik
  const yazilar = await getYazilar();
  const blogPages: MetadataRoute.Sitemap = yazilar.map((yazi) => ({
    url: `${baseUrl}/blog/${yazi.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
    lastModified: yazi.guncellemeTarihi
      ? new Date(yazi.guncellemeTarihi)
      : new Date(yazi.yayinTarihi),
  }));

  // P1-6: kategori bazlı hub sayfaları
  const cats = await kategoriler();
  const kategoriPages: MetadataRoute.Sitemap = cats.map((kategori) => ({
    url: `${baseUrl}/blog/kategori/${kategoriToSlug(kategori)}`,
    changeFrequency: "weekly" as const,
    priority: 0.6,
    lastModified: new Date(),
  }));

  return [...mainPages, ...blogPages, ...kategoriPages];
}
