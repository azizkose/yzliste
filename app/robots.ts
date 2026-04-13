import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/","/auth"],
      disallow: ["/api/", "/admin"],
    },
    sitemap: "https://www.yzliste.com/sitemap.xml",
  };
}
