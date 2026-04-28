'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, AlertCircle, MailCheck, Loader2 } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import TurnstileWidget from './TurnstileWidget'

type AuthMode = 'giris' | 'kayit'

interface AuthFormProps {
  defaultMode?: AuthMode
  redirectTo?: string
  onSuccess?: () => void
}

function turkceHata(msg: string): string {
  if (msg.includes('Password should be at least 6 characters')) return 'Şifre en az 6 karakter olmalıdır.'
  if (msg.includes('Invalid login credentials')) return 'E-posta veya şifre hatalı.'
  if (msg.includes('Email not confirmed')) return 'E-posta adresinizi doğrulayın.'
  if (msg.includes('User already registered')) return 'Bu e-posta adresi zaten kayıtlı.'
  if (msg.includes('invalid') && msg.includes('email')) return 'Geçerli bir e-posta adresi girin.'
  if (msg.includes('rate limit') || msg.includes('too many')) return 'Çok fazla deneme. Lütfen biraz bekleyin.'
  return 'Bir hata oluştu. Lütfen tekrar deneyin.'
}

// ─── Google logo SVG ────────────────────────────────────────────────────────
function GoogleLogo() {
  return (
    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

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

// ─── E-posta gönderildi success state ──────────────────────────────────────
function EmailGonderildiUI({
  email,
  onDuzelt,
  onTekrarGonder,
  cooldown,
  yukleniyor,
}: {
  email: string
  onDuzelt: () => void
  onTekrarGonder: () => void
  cooldown: number
  yukleniyor: boolean
}) {
  return (
    <div className="text-center py-4 space-y-5">
      <div className="flex justify-center">
        <MailCheck size={48} className="text-rd-success-600" strokeWidth={1.5} aria-hidden="true" />
      </div>
      <div>
        <p className="font-bold text-rd-neutral-900" style={{ fontFamily: 'var(--font-rd-display)' }}>
          E-postanı kontrol et
        </p>
        <p className="text-sm text-rd-neutral-500 mt-1 leading-relaxed">
          <span className="font-medium text-rd-neutral-700">{email}</span> adresine doğrulama
          bağlantısı gönderdik. Bağlantıyı tıklayarak hesabını aktive et.
        </p>
      </div>
      <div className="space-y-2">
        <button
          onClick={onTekrarGonder}
          disabled={cooldown > 0 || yukleniyor}
          className="w-full flex items-center justify-center gap-2 rounded-lg border border-rd-neutral-200 py-2.5 text-sm text-rd-neutral-700 hover:bg-rd-neutral-50 disabled:opacity-50 transition-colors"
        >
          {yukleniyor && <Loader2 size={14} className="animate-spin" aria-hidden="true" />}
          {cooldown > 0 ? `Tekrar gönder (${cooldown}s)` : 'Tekrar gönder'}
        </button>
        <button
          onClick={onDuzelt}
          className="w-full text-sm text-rd-primary-600 hover:text-rd-primary-700 transition-colors py-1"
        >
          Yanlış e-posta? Düzelt
        </button>
      </div>
    </div>
  )
}

// ─── Ana component ──────────────────────────────────────────────────────────
export default function AuthForm({ defaultMode = 'kayit', redirectTo = '/', onSuccess }: AuthFormProps) {
  const [mod, setMod] = useState<AuthMode>(defaultMode)
  const [email, setEmail] = useState('')
  const [sifre, setSifre] = useState('')
  const [sozlesme, setSozlesme] = useState(false)
  const [hata, setHata] = useState('')
  const [yukleniyor, setYukleniyor] = useState(false)
  const [sifreGoster, setSifreGoster] = useState(false)
  const [kayitBasarili, setKayitBasarili] = useState(false)
  const [resendYukleniyor, setResendYukleniyor] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const turnstileEnabled = false

  const router = useRouter()
  const queryClient = useQueryClient()

  // Cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return
    const t = setTimeout(() => setResendCooldown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [resendCooldown])

  const handleTurnstileVerify = useCallback((token: string) => setTurnstileToken(token), [])
  const handleTurnstileExpire = useCallback(() => setTurnstileToken(null), [])

  const handleModDegistir = (yeniMod: AuthMode) => {
    setMod(yeniMod)
    setEmail('')
    setSifre('')
    setHata('')
    setSozlesme(false)
    setKayitBasarili(false)
    setSifreGoster(false)
  }

  const handleGoogleGiris = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      // window.location.origin → preview'da preview URL, prod'da yzliste.com
      options: { redirectTo: `${window.location.origin}${redirectTo}` },
    })
    if (error) { setHata('Google ile giriş başlatılamadı.'); return }
    if (data?.url) window.location.href = data.url
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!email.trim()) { setHata('E-posta adresi girin.'); return }
    if (!sifre.trim()) { setHata('Şifre girin.'); return }
    if (mod === 'kayit' && !sozlesme) { setHata('Devam etmek için sözleşmeleri kabul edin.'); return }
    if (turnstileEnabled && !turnstileToken) { setHata('Lütfen robot olmadığınızı doğrulayın.'); return }

    setYukleniyor(true)
    setHata('')

    if (turnstileEnabled && turnstileToken) {
      const verifyRes = await fetch('/api/turnstile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: turnstileToken }),
      })
      if (!verifyRes.ok) {
        setHata('Robot doğrulama başarısız. Lütfen tekrar deneyin.')
        setYukleniyor(false)
        setTurnstileToken(null)
        return
      }
    }

    if (mod === 'kayit') {
      const { data: signUpData, error } = await supabase.auth.signUp({ email, password: sifre })
      if (error) {
        setHata(turkceHata(error.message))
      } else {
        const refCode = document.cookie.match(/(?:^|;\s*)ref_code=([^;]+)/)?.[1]
        if (refCode && signUpData.user?.id) {
          fetch('/api/referral/link', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: signUpData.user.id, refCode }),
          }).catch(() => {})
        }
        setKayitBasarili(true)
        setResendCooldown(60)
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password: sifre })
      if (error) {
        setHata(turkceHata(error.message))
      } else {
        queryClient.invalidateQueries({ queryKey: ['currentUser'] })
        queryClient.invalidateQueries({ queryKey: ['credits'] })
        if (onSuccess) onSuccess()
        else router.push(redirectTo)
      }
    }

    setYukleniyor(false)
  }

  const handleTekrarGonder = async () => {
    setResendYukleniyor(true)
    await supabase.auth.resend({ type: 'signup', email })
    setResendYukleniyor(false)
    setResendCooldown(60)
  }

  // Kayıt başarılı → e-posta UI
  if (kayitBasarili) {
    return (
      <EmailGonderildiUI
        email={email}
        onDuzelt={() => { setKayitBasarili(false); setSifre('') }}
        onTekrarGonder={handleTekrarGonder}
        cooldown={resendCooldown}
        yukleniyor={resendYukleniyor}
      />
    )
  }

  return (
    <div className="space-y-5">
      {/* Google OAuth */}
      <button
        type="button"
        onClick={handleGoogleGiris}
        className="w-full flex items-center justify-center gap-2.5 rounded-lg border border-rd-neutral-200 bg-white px-4 py-3 text-sm font-medium text-rd-neutral-700 hover:bg-rd-neutral-50 transition-colors"
      >
        <GoogleLogo />
        Google ile devam et
      </button>

      {/* Ayraç */}
      <div className="flex items-center gap-3" aria-hidden="true">
        <div className="flex-1 h-px bg-rd-neutral-200" />
        <span className="text-xs text-rd-neutral-400">veya e-posta ile</span>
        <div className="flex-1 h-px bg-rd-neutral-200" />
      </div>

      {/* Mod seçici — underline tabs */}
      <div role="tablist" className="flex gap-6 border-b border-rd-neutral-200">
        {([['kayit', 'Kayıt ol'], ['giris', 'Giriş yap']] as const).map(([m, label]) => (
          <button
            key={m}
            role="tab"
            type="button"
            aria-selected={mod === m}
            onClick={() => handleModDegistir(m)}
            className={[
              'pb-2.5 text-sm font-medium border-b-2 transition-colors -mb-px',
              mod === m
                ? 'border-rd-primary-600 text-rd-neutral-900'
                : 'border-transparent text-rd-neutral-400 hover:text-rd-neutral-700',
            ].join(' ')}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3" noValidate>
        {/* E-posta */}
        <div>
          <label htmlFor="auth-email" className="block text-xs font-medium text-rd-neutral-500 mb-1.5">
            E-posta adresi
          </label>
          <input
            id="auth-email"
            type="email"
            placeholder="ornek@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            aria-describedby={hata ? 'auth-hata' : undefined}
            className="w-full min-h-[44px] border border-rd-neutral-200 rounded-lg px-4 py-3 text-sm text-rd-neutral-900 placeholder:text-rd-neutral-400 bg-white focus:outline-none focus:ring-2 focus:ring-rd-primary-300 focus:border-rd-primary-500 transition-shadow"
          />
        </div>

        {/* Şifre */}
        <div>
          <label htmlFor="auth-sifre" className="block text-xs font-medium text-rd-neutral-500 mb-1.5">
            Şifre
          </label>
          <div className="relative">
            <input
              id="auth-sifre"
              type={sifreGoster ? 'text' : 'password'}
              placeholder={mod === 'kayit' ? 'En az 6 karakter' : '••••••••'}
              value={sifre}
              onChange={(e) => setSifre(e.target.value)}
              required
              autoComplete={mod === 'kayit' ? 'new-password' : 'current-password'}
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

        {/* Mod'a özgü alanlar */}
        {mod === 'kayit' && (
          <label className="flex items-start gap-3 cursor-pointer pt-1 group">
            <input
              type="checkbox"
              checked={sozlesme}
              onChange={(e) => setSozlesme(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-rd-neutral-300 flex-shrink-0 accent-rd-primary-600"
              aria-label="Kullanım koşulları ve KVKK aydınlatma metni onayı"
            />
            <span className="text-xs text-rd-neutral-500 leading-relaxed">
              <Link href="/kosullar" target="_blank" className="text-rd-primary-600 hover:underline font-medium">Kullanım koşulları</Link>{' '}
              ve{' '}
              <Link href="/kvkk-aydinlatma" target="_blank" className="text-rd-primary-600 hover:underline font-medium">KVKK aydınlatma metni</Link>
              {`'ni okudum, kabul ediyorum.`}
            </span>
          </label>
        )}

        {mod === 'giris' && (
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-rd-neutral-300 accent-rd-primary-600"
                aria-label="Beni hatırla"
              />
              <span className="text-xs text-rd-neutral-500">Beni hatırla</span>
            </label>
            <Link
              href="/sifre-sifirla"
              className="text-xs text-rd-primary-600 hover:text-rd-primary-700 transition-colors"
            >
              Şifremi unuttum
            </Link>
          </div>
        )}

        {/* Hata */}
        {hata && <InlineError mesaj={hata} />}

        <TurnstileWidget onVerify={handleTurnstileVerify} onExpire={handleTurnstileExpire} />

        {/* Submit */}
        <button
          type="submit"
          disabled={yukleniyor || (mod === 'kayit' && !sozlesme) || (turnstileEnabled && !turnstileToken)}
          aria-busy={yukleniyor}
          className="w-full min-h-[44px] flex items-center justify-center gap-2 bg-rd-primary-600 hover:bg-rd-primary-700 disabled:bg-rd-neutral-200 disabled:text-rd-neutral-400 text-white font-medium py-3 rounded-lg text-sm transition-colors"
        >
          {yukleniyor && <Loader2 size={14} className="animate-spin" aria-hidden="true" />}
          {yukleniyor
            ? 'Bekleyin...'
            : mod === 'kayit' ? 'Ücretsiz hesap oluştur' : 'Giriş yap'
          }
        </button>
      </form>
    </div>
  )
}
