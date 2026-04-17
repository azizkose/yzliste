import type { MetadataRoute } from "next";
import { getYazilar } from "./blog/icerikler";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.yzliste.com";

  const now = new Date()

  // Ana sayfalar
  const mainPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      changeFrequency: "daily",
      priority: 1,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/auth`,
      changeFrequency: "weekly",
      priority: 0.8,
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

  return [...mainPages, ...blogPages];
}
