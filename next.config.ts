import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// CSP: unsafe-inline required for PostHog snippet + gtag dataLayer + Tailwind
// iyzico checkout form injects scripts from js.iyzipay.com + frames from pay.iyzipay.com
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://js.iyzipay.com https://www.googletagmanager.com https://www.google-analytics.com https://challenges.cloudflare.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data: https://*.supabase.co https://www.google-analytics.com https://*.fal.media https://fal.media;
  font-src 'self';
  connect-src 'self' https://*.supabase.co wss://*.supabase.co https://eu.i.posthog.com https://api.anthropic.com https://www.google-analytics.com https://challenges.cloudflare.com;
  frame-src 'self' https://pay.iyzipay.com https://checkout.iyzipay.com https://challenges.cloudflare.com;
  object-src 'none';
  base-uri 'self';
  form-action 'self' https://*.iyzipay.com;
  frame-ancestors 'none';
  upgrade-insecure-requests;
`
  .replace(/\s{2,}/g, " ")
  .trim();

const securityHeaders = [
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  {
    key: "Permissions-Policy",
    value: "camera=(self), microphone=(), geolocation=(), interest-cohort=()",
  },
  { key: "Content-Security-Policy", value: cspHeader },
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
    ];
  },
};

export default nextConfig;
