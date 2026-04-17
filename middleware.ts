import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

const PROTECTED_PATHS = ['/app', '/hesap', '/kredi-yukle']

const BOT_UA_PATTERN = /googlebot|bingbot|slurp|duckduckbot|baiduspider|yandexbot|sogou|exabot|facebot|ia_archiver/i

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Crawler'lar korumalı sayfaya gelince redirect yerine 404 dön
  const isProtectedEarly = PROTECTED_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + '/')
  )
  if (isProtectedEarly) {
    const ua = request.headers.get('user-agent') || ''
    if (BOT_UA_PATTERN.test(ua)) {
      return new NextResponse(null, { status: 404 })
    }
  }

  let response = NextResponse.next({ request })

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
          response = NextResponse.next({ request })
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
      return NextResponse.redirect(loginUrl)
    }
    return response
  }

  const isProtected = PROTECTED_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + '/')
  )

  if (isProtected && !user) {
    const loginUrl = new URL('/giris', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
