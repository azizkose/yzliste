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

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      // P0-2 SEO fix: public sayfalara Googlebot-friendly Cache-Control header.
      // Default Vercel + Next.js auth cookies yüzünden "private, no-cache, no-store" dönüyor —
      // bu crawl bütçesini düşürüyor. Public sayfalar için explicit cacheable header gönderiyoruz.
      // NOT: middleware.ts'deki Cache-Control set'i auth cookie response'ları yüzünden ezilebiliyor;
      // bu next.config tarafı kesin override sağlar.
      {
        source: "/",
        headers: [
          { key: "Cache-Control", value: "public, max-age=0, s-maxage=3600, must-revalidate" },
        ],
      },
      {
        source: "/blog",
        headers: [
          { key: "Cache-Control", value: "public, max-age=0, s-maxage=3600, must-revalidate" },
        ],
      },
      {
        source: "/blog/:slug",
        headers: [
          { key: "Cache-Control", value: "public, max-age=0, s-maxage=3600, must-revalidate" },
        ],
      },
      {
        source: "/fiyatlar",
        headers: [
          { key: "Cache-Control", value: "public, max-age=0, s-maxage=3600, must-revalidate" },
        ],
      },
      {
        source: "/sss",
        headers: [
          { key: "Cache-Control", value: "public, max-age=0, s-maxage=3600, must-revalidate" },
        ],
      },
      {
        source: "/hakkimizda",
        headers: [
          { key: "Cache-Control", value: "public, max-age=0, s-maxage=3600, must-revalidate" },
        ],
      },
      {
        source: "/gizlilik",
        headers: [
          { key: "Cache-Control", value: "public, max-age=0, s-maxage=3600, must-revalidate" },
        ],
      },
      {
        source: "/kosullar",
        headers: [
          { key: "Cache-Control", value: "public, max-age=0, s-maxage=3600, must-revalidate" },
        ],
      },
      {
        source: "/kvkk-aydinlatma",
        headers: [
          { key: "Cache-Control", value: "public, max-age=0, s-maxage=3600, must-revalidate" },
        ],
      },
      {
        source: "/cerez-politikasi",
        headers: [
          { key: "Cache-Control", value: "public, max-age=0, s-maxage=3600, must-revalidate" },
        ],
      },
      {
        source: "/mesafeli-satis",
        headers: [
          { key: "Cache-Control", value: "public, max-age=0, s-maxage=3600, must-revalidate" },
        ],
      },
      {
        source: "/teslimat-iade",
        headers: [
          { key: "Cache-Control", value: "public, max-age=0, s-maxage=3600, must-revalidate" },
        ],
      },
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
