'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
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

export default function AuthForm({ defaultMode = 'kayit', redirectTo = '/', onSuccess }: AuthFormProps) {
  const [mod, setMod] = useState<AuthMode>(defaultMode)
  const [email, setEmail] = useState('')
  const [sifre, setSifre] = useState('')
  const [sozlesme, setSozlesme] = useState(false)
  const [mesaj, setMesaj] = useState('')
  const [yukleniyor, setYukleniyor] = useState(false)
  const [sifreSifirlamaGonderildi, setSifreSifirlamaGonderildi] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const turnstileEnabled = false
  const router = useRouter()
  const queryClient = useQueryClient()

  const handleTurnstileVerify = useCallback((token: string) => {
    setTurnstileToken(token)
  }, [])

  const handleTurnstileExpire = useCallback(() => {
    setTurnstileToken(null)
  }, [])

  const handleModDegistir = (yeniMod: AuthMode) => {
    setMod(yeniMod)
    setEmail('')
    setSifre('')
    setMesaj('')
    setSozlesme(false)
    setSifreSifirlamaGonderildi(false)
  }

  const handleGoogleGiris = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}${redirectTo}` },
    })
    if (error) { setMesaj('Google ile giriş başlatılamadı.'); return }
    if (data?.url) window.location.href = data.url
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!email.trim()) { setMesaj('E-posta adresi girin.'); return }
    if (!sifre.trim()) { setMesaj('Şifre girin.'); return }
    if (mod === 'kayit' && !sozlesme) { setMesaj('Devam etmek için sözleşmeleri kabul edin.'); return }
    if (turnstileEnabled && !turnstileToken) { setMesaj('Lütfen robot olmadığınızı doğrulayın.'); return }

    setYukleniyor(true)
    setMesaj('')

    if (turnstileEnabled && turnstileToken) {
      const verifyRes = await fetch('/api/turnstile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: turnstileToken }),
      })
      if (!verifyRes.ok) {
        setMesaj('Robot doğrulama başarısız. Lütfen tekrar deneyin.')
        setYukleniyor(false)
        setTurnstileToken(null)
        return
      }
    }

    if (mod === 'kayit') {
      const { data: signUpData, error } = await supabase.auth.signUp({ email, password: sifre })
      if (error) { setMesaj(turkceHata(error.message)) }
      else {
        const refCode = document.cookie.match(/(?:^|;\s*)ref_code=([^;]+)/)?.[1]
        if (refCode && signUpData.user?.id) {
          fetch('/api/referral/link', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: signUpData.user.id, refCode }),
          }).catch(() => {})
        }
        setMesaj('Kayıt başarılı! E-postanızı doğrulayın.')
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password: sifre })
      if (error) { setMesaj(turkceHata(error.message)) }
      else {
        queryClient.invalidateQueries({ queryKey: ['currentUser'] })
        queryClient.invalidateQueries({ queryKey: ['credits'] })
        if (onSuccess) onSuccess()
        else router.push(redirectTo)
      }
    }

    setYukleniyor(false)
  }

  const handleSifreSifirla = async () => {
    if (!email.trim()) { setMesaj('Önce e-posta adresinizi girin.'); return }
    setYukleniyor(true)
    setMesaj('')
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/sifre-sifirla`,
    })
    if (error) setMesaj('Şifre sıfırlama e-postası gönderilemedi.')
    else setSifreSifirlamaGonderildi(true)
    setYukleniyor(false)
  }

  return (
    <div className="space-y-4">
      {/* Google */}
      <button
        onClick={handleGoogleGiris}
        className="w-full flex items-center justify-center gap-3 border border-[#D8D6CE] rounded-lg px-4 py-3 text-sm font-medium text-[#5A5852] hover:bg-[#FAFAF8] transition-colors"
      >
        <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Google ile devam et
      </button>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-[#D8D6CE]" />
        <span className="text-xs text-[#908E86]">veya e-posta ile</span>
        <div className="flex-1 h-px bg-[#D8D6CE]" />
      </div>

      {/* Mod seçici — underline tabs */}
      <div role="tablist" className="flex gap-6 border-b border-[#D8D6CE]">
        <button
          role="tab"
          type="button"
          aria-selected={mod === 'kayit'}
          onClick={() => handleModDegistir('kayit')}
          className={`pb-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
            mod === 'kayit'
              ? 'border-[#1E4DD8] text-[#1A1A17]'
              : 'border-transparent text-[#908E86] hover:text-[#5A5852]'
          }`}
        >
          Kayıt ol
        </button>
        <button
          role="tab"
          type="button"
          aria-selected={mod === 'giris'}
          onClick={() => handleModDegistir('giris')}
          className={`pb-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
            mod === 'giris'
              ? 'border-[#1E4DD8] text-[#1A1A17]'
              : 'border-transparent text-[#908E86] hover:text-[#5A5852]'
          }`}
        >
          Giriş yap
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3 pt-1">
        <input
          type="email"
          placeholder="E-posta"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          className="w-full border border-[#D8D6CE] rounded-lg px-4 py-3 text-sm text-[#1A1A17] placeholder:text-[#908E86] focus:outline-none focus:ring-2 focus:ring-[#1E4DD8]/20 focus:border-[#1E4DD8] transition-colors"
        />
        <input
          type="password"
          placeholder="Şifre"
          value={sifre}
          onChange={(e) => setSifre(e.target.value)}
          required
          autoComplete={mod === 'kayit' ? 'new-password' : 'current-password'}
          className="w-full border border-[#D8D6CE] rounded-lg px-4 py-3 text-sm text-[#1A1A17] placeholder:text-[#908E86] focus:outline-none focus:ring-2 focus:ring-[#1E4DD8]/20 focus:border-[#1E4DD8] transition-colors"
        />

        {mod === 'kayit' && (
          <label className="flex items-start gap-3 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={sozlesme}
              onChange={(e) => setSozlesme(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-[#D8D6CE] flex-shrink-0"
            />
            <span className="text-xs text-[#908E86] leading-relaxed">
              <a href="/kosullar" target="_blank" className="text-[#1E4DD8] hover:text-[#163B9E]">Kullanım koşulları</a> ve{' '}
              <a href="/gizlilik" target="_blank" className="text-[#1E4DD8] hover:text-[#163B9E]">gizlilik politikası</a>
              &apos;nı okudum, kabul ediyorum.
            </span>
          </label>
        )}

        {sifreSifirlamaGonderildi && (
          <p className="text-xs text-[#0F5132] bg-[#E8F5EE] px-3 py-2 rounded-lg">
            Şifre sıfırlama bağlantısı e-postanıza gönderildi.
          </p>
        )}

        {mesaj && (
          <p className={`text-xs px-3 py-2 rounded-lg ${
            mesaj.includes('başarılı') || mesaj.includes('gönderildi')
              ? 'text-[#0F5132] bg-[#E8F5EE]'
              : 'text-[#7A1E1E] bg-[#FCECEC]'
          }`}>
            {mesaj}
          </p>
        )}

        <TurnstileWidget
          onVerify={handleTurnstileVerify}
          onExpire={handleTurnstileExpire}
        />

        <button
          type="submit"
          disabled={yukleniyor || (mod === 'kayit' && !sozlesme) || (turnstileEnabled && !turnstileToken)}
          className="w-full bg-[#1E4DD8] hover:bg-[#163B9E] disabled:opacity-50 text-white font-medium py-3 rounded-lg text-sm transition-colors"
        >
          {yukleniyor ? 'Bekleyin...' : mod === 'kayit' ? 'Ücretsiz hesap oluştur' : 'Giriş yap'}
        </button>

        {mod === 'giris' && !sifreSifirlamaGonderildi && (
          <button
            type="button"
            onClick={handleSifreSifirla}
            disabled={yukleniyor}
            className="w-full text-xs text-[#908E86] hover:text-[#5A5852] transition-colors py-1"
          >
            Şifremi unuttum
          </button>
        )}
      </form>
    </div>
  )
}
