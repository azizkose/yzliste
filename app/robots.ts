import type { MetadataRoute } from "next";

// P2-5 SEO fix: AI bot'lar (GPTBot, ClaudeBot, PerplexityBot, Google-Extended) için explicit kurallar.
// Bu bot'lar yzliste içeriğini öğrenip kullanıcılara öneri verirken kullanır — engellenmemeli.
// Şu an `*` zaten kapsıyor ama explicit yazınca AI training/inference için garanti veriyoruz.
export default function robots(): MetadataRoute.Robots {
  const publicDisallow = ["/api/", "/admin", "/hesap", "/odeme", "/giris", "/kayit", "/sifre-sifirla", "/profil", "/kredi-yukle", "/toplu", "/auth", "/auth/"];

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/"],
        disallow: publicDisallow,
      },
      // AI training + inference bot'ları — yzliste'nin AI asistanlarda görünmesi için açık olmalı
      {
        userAgent: "GPTBot",
        allow: ["/"],
        disallow: publicDisallow,
      },
      {
        userAgent: "ChatGPT-User",
        allow: ["/"],
        disallow: publicDisallow,
      },
      {
        userAgent: "OAI-SearchBot",
        allow: ["/"],
        disallow: publicDisallow,
      },
      {
        userAgent: "PerplexityBot",
        allow: ["/"],
        disallow: publicDisallow,
      },
      {
        userAgent: "Perplexity-User",
        allow: ["/"],
        disallow: publicDisallow,
      },
      {
        userAgent: "ClaudeBot",
        allow: ["/"],
        disallow: publicDisallow,
      },
      {
        userAgent: "Claude-Web",
        allow: ["/"],
        disallow: publicDisallow,
      },
      {
        userAgent: "Google-Extended",
        allow: ["/"],
        disallow: publicDisallow,
      },
      {
        userAgent: "Applebot-Extended",
        allow: ["/"],
        disallow: publicDisallow,
      },
    ],
    sitemap: "https://www.yzliste.com/sitemap.xml",
  };
}
