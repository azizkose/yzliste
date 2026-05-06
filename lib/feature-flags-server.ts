/**
 * Server-side feature flags — API route ve server component'lerde kullanılır.
 * React hook'u içermez; istemci tarafında import etme.
 * İstemci tarafı flagler için: lib/feature-flags.ts
 */

function deterministicHash(userId: string): number {
  let hash = 0
  for (let i = 0; i < userId.length; i++) {
    hash = (hash * 31 + userId.charCodeAt(i)) >>> 0
  }
  return hash
}

/**
 * Görsel V2 pipeline'ının etkin olup olmadığını döndürür.
 *
 * .env.local / Vercel env:
 *   GORSEL_V2_PERCENT=0    → kapalı (default)
 *   GORSEL_V2_PERCENT=100  → herkese aç
 *   GORSEL_V2_ALL=true     → tüm kullanıcılara zorla (test override)
 */
export function isGorselV2Enabled(userId?: string): boolean {
  if (!userId) return false
  if (process.env.GORSEL_V2_ALL === 'true') return true
  const pct = parseInt(process.env.GORSEL_V2_PERCENT ?? '0', 10)
  if (pct <= 0) return false
  if (pct >= 100) return true
  return (deterministicHash(userId) % 100) < pct
}

/**
 * Görsel V3 pipeline'ının etkin olup olmadığını döndürür.
 * V3 = bria atmosfer + Sharp re-overlay hibrit pipeline.
 *
 * .env.local / Vercel env:
 *   GORSEL_V3_PERCENT=0    → kapalı (default)
 *   GORSEL_V3_PERCENT=100  → herkese aç
 *   GORSEL_V3_ALL=true     → tüm kullanıcılara zorla (test override)
 */
export function isGorselV3Enabled(userId?: string): boolean {
  if (!userId) return false
  if (process.env.GORSEL_V3_ALL === 'true') return true
  const pct = parseInt(process.env.GORSEL_V3_PERCENT ?? '0', 10)
  if (pct <= 0) return false
  if (pct >= 100) return true
  return (deterministicHash(userId) % 100) < pct
}
