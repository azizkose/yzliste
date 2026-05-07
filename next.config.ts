import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

// CSP is set dynamically (nonce-based) in middleware.ts
// Only static security headers that don't require nonce go here
const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  {
    key: "Permissions-Policy",
    value: "camera=(self), microphone=(), geolocation=(), interest-cohort=()",
  },
];

// Public sayfalarda Googlebot'a doğru sinyal: "public, her istekte yeniden doğrula"
// max-age=0 → browser cache yok, must-revalidate → her zaman origin'e sor
// next.config.ts headers(), Next.js'in dynamic page no-store'unu ezer (GSC-003)
const PUBLIC_CACHE_HEADER = {
  key: "Cache-Control",
  value: "public, max-age=0, must-revalidate",
}

const PUBLIC_CACHEABLE_SOURCES = [
  "/",
  "/blog",
  "/blog/:slug*",
  "/fiyatlar",
  "/sss",
  "/hakkimizda",
  "/gizlilik",
  "/kosullar",
  "/kvkk-aydinlatma",
  "/cerez-politikasi",
  "/mesafeli-satis",
  "/teslimat-iade",
]

const nextConfig: NextConfig = {
  async headers() {
    const publicCacheRules = PUBLIC_CACHEABLE_SOURCES.map((source) => ({
      source,
      headers: [PUBLIC_CACHE_HEADER],
    }))

    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      ...publicCacheRules,
    ];
  },
  async redirects() {
    return [
      { source: "/login", destination: "/giris", permanent: true },
      { source: "/register", destination: "/kayit", permanent: true },
      { source: "/pricing", destination: "/fiyatlar", permanent: true },
      { source: "/privacy", destination: "/gizlilik", permanent: true },
      { source: "/auth", destination: "/", permanent: true },
      // Blog slug düzeltmeleri — Google'da indexli ama 404 veren eski URL'ler
      { source: "/blog/trendyol-urun-listeleme-rehberi", destination: "/blog/trendyol-listing-nasil-yazilir", permanent: true },
      { source: "/blog/amazon-a9-algoritmasi-ile-satis-katlama", destination: "/blog/amazon-a9-algoritmasi", permanent: true },
    ];
  },
};

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG || "",
  project: process.env.SENTRY_PROJECT || "",
  authToken: process.env.SENTRY_AUTH_TOKEN,
  widenClientFileUpload: true,
  silent: true,
  disableLogger: true,
});
