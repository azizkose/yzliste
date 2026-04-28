'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { KeyRound, MailCheck, Eye, EyeOff, AlertCircle, Loader2, ArrowLeft } from 'lucide-react'
import { supabase } from '@/lib/supabase'

// ─── Inline hata kutusu ─────────────────────────────────────────────────────
function InlineError({ mesaj }: { mesaj: string }) {
  if (!mesaj) return null
  return (
    <div
      role="alert"
      aria-live="polite"
      className="flex items-start gap-2.5 rounded-lg border border-rd-danger-200 bg-rd-danger-50 p-3 text-sm text-rd-danger-700"
    >
      <AlertCircle size={15} className="flex-shrink-0 mt-0.5" aria-hidden="true" />
      <span>{mesaj}</span>
    </div>
  )
}

// ─── Ortak sayfa sarmalayıcı ────────────────────────────────────────────────
function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-rd-neutral-50 flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="inline-block mb-8" aria-label="yzliste anasayfa">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/yzliste_logo.png" alt="yzliste" className="h-7" />
        </Link>
        {children}
      </div>
    </main>
  )
}

// ─── Step 1 — e-posta ile sıfırlama linki gönder ───────────────────────────
function Step1() {
  const [email, setEmail] = useState('')
  const [gonderildi, setGonderildi] = useState(false)
  const [hata, setHata] = useState('')
  const [yukleniyor, setYukleniyor] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) { setHata('E-posta adresinizi girin.'); return }
    setYukleniyor(true)
    setHata('')
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/sifre-sifirla`,
    })
    setYukleniyor(false)
    if (error) setHata('Şifre sıfırlama e-postası gönderilemedi. Lütfen tekrar deneyin.')
    else setGonderildi(true)
  }

  if (gonderildi) {
    return (
      <div className="rounded-xl border border-rd-neutral-200 bg-white p-8 text-center space-y-5">
        <div className="flex justify-center">
          <MailCheck size={48} className="text-rd-success-600" strokeWidth={1.5} aria-hidden="true" />
        </div>
        <div>
          <p className="font-bold text-rd-neutral-900" style={{ fontFamily: 'var(--font-rd-display)' }}>
            E-posta gönderildi
          </p>
          <p className="text-sm text-rd-neutral-500 mt-2 leading-relaxed">
            <span className="font-medium text-rd-neutral-700">{email}</span> adresine şifre sıfırlama
            bağlantısı gönderdik. Gelen kutunuzu kontrol edin.
          </p>
        </div>
        <Link
          href="/giris"
          className="inline-flex items-center gap-1.5 text-sm text-rd-primary-600 hover:text-rd-primary-700 transition-colors"
        >
          <ArrowLeft size={13} strokeWidth={1.5} aria-hidden="true" />
          Giriş sayfasına dön
        </Link>
      </div>
    )
  }

  return (
    <>
      <p
        className="text-xs font-semibold tracking-[0.1em] uppercase text-rd-primary-600 mb-2"
        style={{ fontFamily: 'var(--font-rd-display)' }}
      >
        Şifre sıfırla
      </p>
      <h1
        className="text-2xl font-bold text-rd-neutral-900 mb-1"
        style={{ fontFamily: 'var(--font-rd-display)', letterSpacing: '-0.01em' }}
      >
        Şifreni sıfırla
      </h1>
      <p className="text-sm text-rd-neutral-500 mb-8">
        Kayıtlı e-posta adresine sıfırlama bağlantısı gönderilecek.
      </p>

      <div className="rounded-xl border border-rd-neutral-200 bg-white p-6">
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="flex justify-center mb-2">
            <div className="w-12 h-12 rounded-xl bg-rd-primary-50 flex items-center justify-center">
              <KeyRound size={22} strokeWidth={1.5} className="text-rd-primary-600" aria-hidden="true" />
            </div>
          </div>

          <div>
            <label htmlFor="reset-email" className="block text-xs font-medium text-rd-neutral-500 mb-1.5">
              E-posta adresi
            </label>
            <input
              id="reset-email"
              type="email"
              placeholder="ornek@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full min-h-[44px] border border-rd-neutral-200 rounded-lg px-4 py-3 text-sm text-rd-neutral-900 placeholder:text-rd-neutral-400 bg-white focus:outline-none focus:ring-2 focus:ring-rd-primary-300 focus:border-rd-primary-500 transition-shadow"
            />
          </div>

          {hata && <InlineError mesaj={hata} />}

          <button
            type="submit"
            disabled={yukleniyor}
            aria-busy={yukleniyor}
            className="w-full min-h-[44px] flex items-center justify-center gap-2 bg-rd-primary-600 hover:bg-rd-primary-700 disabled:bg-rd-neutral-200 disabled:text-rd-neutral-400 text-white font-medium py-3 rounded-lg text-sm transition-colors"
          >
            {yukleniyor && <Loader2 size={14} className="animate-spin" aria-hidden="true" />}
            {yukleniyor ? 'Gönderiliyor...' : 'Sıfırlama linki gönder'}
          </button>
        </form>
      </div>

      <p className="text-sm text-rd-neutral-500 text-center mt-5">
        <Link
          href="/giris"
          className="inline-flex items-center gap-1.5 text-rd-primary-600 hover:text-rd-primary-700 transition-colors"
        >
          <ArrowLeft size={13} strokeWidth={1.5} aria-hidden="true" />
          Giriş sayfasına dön
        </Link>
      </p>
    </>
  )
}

// ─── Step 2 — kod ile yeni şifre belirleme ──────────────────────────────────
function Step2() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [durum, setDurum] = useState<'yukleniyor' | 'form' | 'basarili' | 'hata'>('yukleniyor')
  const [yeniSifre, setYeniSifre] = useState('')
  const [yeniSifreTekrar, setYeniSifreTekrar] = useState('')
  const [sifreGoster, setSifreGoster] = useState(false)
  const [hata, setHata] = useState('')
  const [yukleniyor, setYukleniyor] = useState(false)

  useEffect(() => {
    const code = searchParams.get('code')
    if (!code) { setHata('Geçersiz bağlantı.'); setDurum('hata'); return }
    supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
      if (error) {
        setHata('Bağlantı geçersiz veya süresi dolmuş. Lütfen tekrar şifre sıfırlama isteği gönderin.')
        setDurum('hata')
      } else {
        setDurum('form')
      }
    })
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (yeniSifre.length < 6) { setHata('Şifre en az 6 karakter olmalıdır.'); return }
    if (yeniSifre !== yeniSifreTekrar) { setHata('Şifreler eşleşmiyor.'); return }
    setHata('')
    setYukleniyor(true)
    const { error } = await supabase.auth.updateUser({ password: yeniSifre })
    setYukleniyor(false)
    if (error) setHata('Şifre güncellenemedi. Lütfen tekrar deneyin.')
    else { setDurum('basarili'); setTimeout(() => router.push('/uret'), 2500) }
  }

  return (
    <>
      <p
        className="text-xs font-semibold tracking-[0.1em] uppercase text-rd-primary-600 mb-2"
        style={{ fontFamily: 'var(--font-rd-display)' }}
      >
        Şifre sıfırla
      </p>
      <h1
        className="text-2xl font-bold text-rd-neutral-900 mb-8"
        style={{ fontFamily: 'var(--font-rd-display)', letterSpacing: '-0.01em' }}
      >
        Yeni şifre belirle
      </h1>

      <div className="rounded-xl border border-rd-neutral-200 bg-white p-6">
        {durum === 'yukleniyor' && (
          <div className="flex items-center justify-center py-8 gap-2 text-rd-neutral-400">
            <Loader2 size={18} className="animate-spin" aria-hidden="true" />
            <span className="text-sm">Bağlantı doğrulanıyor…</span>
          </div>
        )}

        {durum === 'hata' && (
          <div className="text-center space-y-4 py-4">
            <InlineError mesaj={hata} />
            <Link
              href="/sifre-sifirla"
              className="inline-flex items-center gap-1.5 text-sm text-rd-primary-600 hover:text-rd-primary-700 transition-colors"
            >
              Yeni sıfırlama bağlantısı iste
            </Link>
          </div>
        )}

        {durum === 'basarili' && (
          <div className="text-center space-y-3 py-4">
            <div className="flex justify-center">
              <div className="w-12 h-12 rounded-xl bg-rd-success-50 flex items-center justify-center">
                <KeyRound size={22} strokeWidth={1.5} className="text-rd-success-600" aria-hidden="true" />
              </div>
            </div>
            <p className="font-bold text-rd-neutral-900" style={{ fontFamily: 'var(--font-rd-display)' }}>
              Şifre güncellendi
            </p>
            <p className="text-sm text-rd-neutral-500">Yönlendiriliyorsunuz…</p>
          </div>
        )}

        {durum === 'form' && (
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Yeni şifre */}
            <div>
              <label htmlFor="new-password" className="block text-xs font-medium text-rd-neutral-500 mb-1.5">
                Yeni şifre
              </label>
              <div className="relative">
                <input
                  id="new-password"
                  type={sifreGoster ? 'text' : 'password'}
                  placeholder="En az 6 karakter"
                  value={yeniSifre}
                  onChange={(e) => setYeniSifre(e.target.value)}
                  required
                  autoComplete="new-password"
                  minLength={6}
                  className="w-full min-h-[44px] border border-rd-neutral-200 rounded-lg pl-4 pr-11 py-3 text-sm text-rd-neutral-900 placeholder:text-rd-neutral-400 bg-white focus:outline-none focus:ring-2 focus:ring-rd-primary-300 focus:border-rd-primary-500 transition-shadow"
                />
                <button
                  type="button"
                  onClick={() => setSifreGoster(v => !v)}
                  aria-label={sifreGoster ? 'Şifreyi gizle' : 'Şifreyi göster'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-rd-neutral-400 hover:text-rd-neutral-600 transition-colors"
                >
                  {sifreGoster
                    ? <EyeOff size={15} strokeWidth={1.5} aria-hidden="true" />
                    : <Eye size={15} strokeWidth={1.5} aria-hidden="true" />
                  }
                </button>
              </div>
            </div>

            {/* Tekrar */}
            <div>
              <label htmlFor="new-password-confirm" className="block text-xs font-medium text-rd-neutral-500 mb-1.5">
                Yeni şifre (tekrar)
              </label>
              <input
                id="new-password-confirm"
                type="password"
                placeholder="Şifrenizi tekrar girin"
                value={yeniSifreTekrar}
                onChange={(e) => setYeniSifreTekrar(e.target.value)}
                required
                autoComplete="new-password"
                minLength={6}
                className="w-full min-h-[44px] border border-rd-neutral-200 rounded-lg px-4 py-3 text-sm text-rd-neutral-900 placeholder:text-rd-neutral-400 bg-white focus:outline-none focus:ring-2 focus:ring-rd-primary-300 focus:border-rd-primary-500 transition-shadow"
              />
            </div>

            {hata && <InlineError mesaj={hata} />}

            <button
              type="submit"
              disabled={yukleniyor}
              aria-busy={yukleniyor}
              className="w-full min-h-[44px] flex items-center justify-center gap-2 bg-rd-primary-600 hover:bg-rd-primary-700 disabled:bg-rd-neutral-200 disabled:text-rd-neutral-400 text-white font-medium py-3 rounded-lg text-sm transition-colors"
            >
              {yukleniyor && <Loader2 size={14} className="animate-spin" aria-hidden="true" />}
              {yukleniyor ? 'Güncelleniyor…' : 'Şifremi güncelle'}
            </button>
          </form>
        )}
      </div>
    </>
  )
}

// ─── Yönlendirici — ?code varsa Step2, yoksa Step1 ─────────────────────────
function SifreSifirlaIcerik() {
  const searchParams = useSearchParams()
  const hasCode = !!searchParams.get('code')

  return (
    <AuthShell>
      {hasCode ? <Step2 /> : <Step1 />}
    </AuthShell>
  )
}

export default function SifreSifirlaPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-rd-neutral-50 flex items-center justify-center">
          <Loader2 className="animate-spin text-rd-neutral-300" size={24} />
        </main>
      }
    >
      <SifreSifirlaIcerik />
    </Suspense>
  )
}
