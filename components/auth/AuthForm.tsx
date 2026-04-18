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
  const turnstileEnabled = !!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
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

  const handleSubmit = async () => {
    if (!email.trim()) { setMesaj('E-posta adresi girin.'); return }
    if (!sifre.trim()) { setMesaj('Şifre girin.'); return }
    if (mod === 'kayit' && !sozlesme) { setMesaj('Devam etmek için sözleşmeleri kabul edin.'); return }
    if (turnstileEnabled && !turnstileToken) { setMesaj('Lütfen robot olmadığınızı doğrulayın.'); return }

setYukleniyor(true)
    setMesaj('')

    // Turnstile sunucu tarafı doğrulama
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
      const { error } = await supabase.auth.signUp({ email, password: sifre })
      if (error) { setMesaj(turkceHata(error.message)) }
      else {
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
        className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Google ile Devam Et
      </button>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-gray-100" />
        <span className="text-xs text-gray-400">veya e-posta ile</span>
        <div className="flex-1 h-px bg-gray-100" />
      </div>

      {/* Mod seçici */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => handleModDegistir('kayit')}
          className={`flex-1 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${
            mod === 'kayit' ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-white text-indigo-500 border-indigo-200'
          }`}
        >
          🎁 Kayıt Ol
        </button>
        <button
          type="button"
          onClick={() => handleModDegistir('giris')}
          className={`flex-1 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${
            mod === 'giris' ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-600 border-gray-200'
          }`}
        >
          Giriş Yap
        </button>
      </div>

      {/* Inputs */}
      <input
        type="email"
        placeholder="E-posta"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        autoComplete="email"
        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
      <input
        type="password"
        placeholder="Şifre"
        value={sifre}
        onChange={(e) => setSifre(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        required
        autoComplete={mod === 'kayit' ? 'new-password' : 'current-password'}
        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />

      {/* Kayıt: sözleşme */}
      {mod === 'kayit' && (
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={sozlesme}
            onChange={(e) => setSozlesme(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-gray-300 flex-shrink-0"
          />
          <span className="text-xs text-gray-500 leading-relaxed">
            <a href="/kosullar" target="_blank" className="text-indigo-500 hover:underline">Kullanım Koşulları</a> ve{' '}
            <a href="/gizlilik" target="_blank" className="text-indigo-500 hover:underline">Gizlilik Politikası</a>
            &apos;nı okudum, kabul ediyorum.
          </span>
        </label>
      )}

      {/* Şifre sıfırlama başarı */}
      {sifreSifirlamaGonderildi && (
        <p className="text-xs text-green-600 bg-green-50 p-3 rounded-lg">
          ✓ Şifre sıfırlama bağlantısı e-postanıza gönderildi.
        </p>
      )}

      {/* Mesaj */}
      {mesaj && (
        <p className={`text-xs ${mesaj.includes('başarılı') || mesaj.includes('gönderildi') ? 'text-green-600' : 'text-red-500'}`}>
          {mesaj}
        </p>
      )}

      {/* Turnstile */}
      <TurnstileWidget
        onVerify={handleTurnstileVerify}
        onExpire={handleTurnstileExpire}
      />

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={yukleniyor || (mod === 'kayit' && !sozlesme) || (turnstileEnabled && !turnstileToken)}
        className="w-full bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-300 text-white font-semibold py-3 rounded-xl text-sm transition-colors"
      >
        {yukleniyor ? '...' : mod === 'kayit' ? 'Ücretsiz Hesap Oluştur' : 'Giriş Yap'}
      </button>

      {/* Şifre sıfırla (sadece giriş modunda) */}
      {mod === 'giris' && !sifreSifirlamaGonderildi && (
        <button
          onClick={handleSifreSifirla}
          disabled={yukleniyor}
          className="w-full text-xs text-gray-400 hover:text-gray-600 transition-colors py-1"
        >
          Şifremi unuttum
        </button>
      )}
    </div>
  )
}
