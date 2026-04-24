import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/"],
      disallow: ["/api/", "/admin", "/hesap", "/odeme", "/giris", "/kayit", "/sifre-sifirla", "/profil", "/kredi-yukle", "/toplu"],
    },
    sitemap: "https://www.yzliste.com/sitemap.xml",
  };
}
