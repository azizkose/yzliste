import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { token } = await req.json()

  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) {
    // Turnstile yapılandırılmamış — geç
    return NextResponse.json({ success: true })
  }

  if (!token) {
    return NextResponse.json({ success: false, error: 'Token eksik' }, { status: 400 })
  }

  const ip = req.headers.get('CF-Connecting-IP') ?? req.headers.get('x-forwarded-for') ?? ''

  const formData = new FormData()
  formData.append('secret', secret)
  formData.append('response', token)
  if (ip) formData.append('remoteip', ip)

  const result = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: formData,
  })

  const outcome = await result.json()

  if (!outcome.success) {
    return NextResponse.json({ success: false, error: 'Doğrulama başarısız' }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}
