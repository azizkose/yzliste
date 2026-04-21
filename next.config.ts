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
    ];
  },
};

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG || "",
  project: process.env.SENTRY_PROJECT || "",
  silent: true,
  disableLogger: true,
});
