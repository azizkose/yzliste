import type { MetadataRoute } from "next";
import { getYazilar } from "./blog/icerikler";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.yzliste.com";

  const now = new Date()

  // Ana sayfalar
  const mainPages: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: "daily", priority: 1, lastModified: now },
    { url: `${baseUrl}/fiyatlar`, changeFrequency: "monthly", priority: 0.9, lastModified: now },
    { url: `${baseUrl}/blog`, changeFrequency: "weekly", priority: 0.9, lastModified: now },
    { url: `${baseUrl}/sss`, changeFrequency: "monthly", priority: 0.7, lastModified: now },
    { url: `${baseUrl}/hakkimizda`, changeFrequency: "monthly", priority: 0.5, lastModified: now },
    { url: `${baseUrl}/giris`, changeFrequency: "yearly", priority: 0.3, lastModified: now },
    { url: `${baseUrl}/kayit`, changeFrequency: "yearly", priority: 0.3, lastModified: now },
    // Yasal — noindex ama sitemap'te olabilir
    { url: `${baseUrl}/gizlilik`, changeFrequency: "yearly", priority: 0.2, lastModified: now },
    { url: `${baseUrl}/cerez-politikasi`, changeFrequency: "yearly", priority: 0.2, lastModified: now },
    { url: `${baseUrl}/kvkk-aydinlatma`, changeFrequency: "yearly", priority: 0.2, lastModified: now },
    { url: `${baseUrl}/kosullar`, changeFrequency: "yearly", priority: 0.2, lastModified: now },
    { url: `${baseUrl}/mesafeli-satis`, changeFrequency: "yearly", priority: 0.2, lastModified: now },
    { url: `${baseUrl}/teslimat-iade`, changeFrequency: "yearly", priority: 0.2, lastModified: now },
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
