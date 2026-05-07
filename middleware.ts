import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

const PROTECTED_PATHS = ['/app', '/hesap', '/kredi-yukle', '/admin', '/yzstudio']

const PUBLIC_CACHEABLE_PATHS = [
  '/', '/blog', '/fiyatlar', '/sss', '/hakkimizda',
  '/gizlilik', '/kosullar', '/kvkk-aydinlatma',
  '/cerez-politikasi', '/mesafeli-satis', '/teslimat-iade',
]

function isPublicCacheable(pathname: string): boolean {
  if (PUBLIC_CACHEABLE_PATHS.includes(pathname)) return true
  if (pathname.startsWith('/blog/')) return true
  return false
}

const BOT_UA_PATTERN = /googlebot|bingbot|slurp|duckduckbot|baiduspider|yandexbot|sogou|exabot|facebot|ia_archiver/i

// SHA-256 hash of the GA Consent Mode inline script in app/layout.tsx
// Allows the script to run without a nonce (needed for statically rendered public pages)
const GA_CONSENT_HASH = "'sha256-wap7CwPtYKe8hUIXSTPFBNrEp+Q9It4BlBcGgGaS8ls='"

// Public pages: statically rendered → no per-request nonce available.
// Next.js'in streaming hydration output'u 20+ dinamik inline script üretir
// (self.__next_f.push, React resume helpers, vs.) — bunların hash'i önceden
// bilinemez. 'unsafe-inline' inline script XSS korumasını kaldırır ama public
// sayfalarda kullanıcı input'u/auth yok, kabul edilebilir trade-off.
// 'unsafe-inline' yanına nonce/hash KOYMA — biri varsa 'unsafe-inline' ignore edilir.
function buildPublicCsp(dev: boolean): string {
  return [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline'${dev ? " 'unsafe-eval'" : ""} https://js.iyzipay.com https://www.googletagmanager.com https://www.google-analytics.com https://challenges.cloudflare.com`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' blob: data: https://*.supabase.co https://www.google-analytics.com https://*.fal.media https://fal.media",
    "font-src 'self'",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://eu.i.posthog.com https://api.anthropic.com https://www.google-analytics.com https://challenges.cloudflare.com",
    "frame-src 'self' https://pay.iyzipay.com https://checkout.iyzipay.com https://challenges.cloudflare.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self' https://*.iyzipay.com",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join('; ')
}

// Private/dynamic pages: nonce + strict-dynamic for full XSS protection.
// Hash also included for the GA consent script (layout is non-async, script has no nonce).
function buildPrivateCsp(nonce: string, dev: boolean): string {
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' ${GA_CONSENT_HASH}${dev ? " 'unsafe-eval'" : ""} https://js.iyzipay.com https://www.googletagmanager.com https://www.google-analytics.com https://challenges.cloudflare.com`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' blob: data: https://*.supabase.co https://www.google-analytics.com https://*.fal.media https://fal.media",
    "font-src 'self'",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://eu.i.posthog.com https://api.anthropic.com https://www.google-analytics.com https://challenges.cloudflare.com",
    "frame-src 'self' https://pay.iyzipay.com https://checkout.iyzipay.com https://challenges.cloudflare.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self' https://*.iyzipay.com",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join('; ')
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isDev = process.env.NODE_ENV === 'development'

  // Crawler'lar korumalı sayfaya gelince redirect yerine 404 dön
  const isProtectedEarly = PROTECTED_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + '/')
  )
  if (isProtectedEarly) {
    const ua = request.headers.get('user-agent') || ''
    if (BOT_UA_PATTERN.test(ua)) {
      const res = new NextResponse(null, { status: 404 })
      res.headers.set('Content-Security-Policy', buildPrivateCsp('bot-blocked', isDev))
      return res
    }
  }

  // Public sayfa: statically rendered → Supabase atlıyoruz → Set-Cookie yok → CDN cacheable.
  // CSP: nonce'suz, strict-dynamic yok, URL allowlist + hash bazlı.
  if (isPublicCacheable(pathname)) {
    const response = NextResponse.next()
    response.headers.set('Cache-Control', 'public, max-age=0, must-revalidate')
    response.headers.set('Content-Security-Policy', buildPublicCsp(isDev))
    return response
  }

  // Private pages: per-request nonce oluştur, x-nonce header'ı ile layout'a ilet
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')
  const csp = buildPrivateCsp(nonce, isDev)

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-nonce', nonce)

  const addCsp = (res: NextResponse) => {
    res.headers.set('Content-Security-Policy', csp)
    return res
  }

  let response = NextResponse.next({ request: { headers: requestHeaders } })

  // Env var guard — preview env'de eksik olabilir
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!supabaseUrl || !supabaseKey) {
    return addCsp(response)
  }

  // Supabase session cookie'lerini refresh et
  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        )
        response = NextResponse.next({ request: { headers: requestHeaders } })
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        )
      },
    },
  })

  let user = null
  try {
    const { data } = await supabase.auth.getUser()
    user = data.user
  } catch {
    // Supabase erişilemiyor — korumalı route'lara erişimi engelle
    const isProtected = PROTECTED_PATHS.some(
      (p) => pathname === p || pathname.startsWith(p + '/')
    )
    if (isProtected) {
      const loginUrl = new URL('/giris', request.url)
      return addCsp(NextResponse.redirect(loginUrl))
    }
    return addCsp(response)
  }

  const isProtected = PROTECTED_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + '/')
  )

  if (isProtected && !user) {
    const loginUrl = new URL('/giris', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return addCsp(NextResponse.redirect(loginUrl))
  }

  // Logged-in kullanıcılar /giris ve /kayit'e gelince ana sayfaya yönlendir
  const AUTH_ONLY_PATHS = ['/giris', '/kayit']
  if (user && !user.is_anonymous && AUTH_ONLY_PATHS.includes(pathname)) {
    return addCsp(NextResponse.redirect(new URL('/uret', request.url)))
  }

  return addCsp(response)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
