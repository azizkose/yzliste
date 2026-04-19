import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/"],
      disallow: ["/api/", "/admin", "/hesap", "/odeme", "/profil", "/giris", "/kayit"],
    },
    sitemap: "https://www.yzliste.com/sitemap.xml",
  };
}
