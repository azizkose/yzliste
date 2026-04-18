import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

const PROTECTED_PATHS = ['/app', '/hesap', '/kredi-yukle']

const BOT_UA_PATTERN = /googlebot|bingbot|slurp|duckduckbot|baiduspider|yandexbot|sogou|exabot|facebot|ia_archiver/i

function buildCsp(nonce: string, dev: boolean): string {
  return [
    "default-src 'self'",
    // nonce + strict-dynamic: scripts with this nonce are trusted; scripts they load are also trusted.
    // URL allowlist is kept as fallback for browsers without nonce support.
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${dev ? " 'unsafe-eval'" : ""} https://js.iyzipay.com https://www.googletagmanager.com https://www.google-analytics.com https://challenges.cloudflare.com`,
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

  // Generate per-request nonce for CSP
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')
  const csp = buildCsp(nonce, isDev)

  // Forward nonce to Server Components via request header (readable via headers() in layouts)
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-nonce', nonce)

  const addCsp = (res: NextResponse) => {
    res.headers.set('Content-Security-Policy', csp)
    return res
  }

  // Crawler'lar korumalı sayfaya gelince redirect yerine 404 dön
  const isProtectedEarly = PROTECTED_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + '/')
  )
  if (isProtectedEarly) {
    const ua = request.headers.get('user-agent') || ''
    if (BOT_UA_PATTERN.test(ua)) {
      return addCsp(new NextResponse(null, { status: 404 }))
    }
  }

  let response = NextResponse.next({ request: { headers: requestHeaders } })

  // Supabase session cookie'lerini refresh et
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          // Preserve nonce headers when creating a new response for cookie updates
          response = NextResponse.next({ request: { headers: requestHeaders } })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

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

  return addCsp(response)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
