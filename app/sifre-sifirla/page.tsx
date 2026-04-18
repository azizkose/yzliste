'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function SifreSifirlaPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [durum, setDurum] = useState<'yukleniyor' | 'form' | 'basarili' | 'hata'>('yukleniyor')
  const [yeniSifre, setYeniSifre] = useState('')
  const [yeniSifreTekrar, setYeniSifreTekrar] = useState('')
  const [mesaj, setMesaj] = useState('')
  const [yukleniyor, setYukleniyor] = useState(false)

  useEffect(() => {
    const code = searchParams.get('code')
    if (!code) {
      setMesaj('Geçersiz veya süresi dolmuş bağlantı. Lütfen tekrar şifre sıfırlama isteği gönderin.')
      setDurum('hata')
      return
    }
    supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
      if (error) {
        setMesaj('Bağlantı geçersiz veya süresi dolmuş. Lütfen tekrar şifre sıfırlama isteği gönderin.')
        setDurum('hata')
      } else {
        setDurum('form')
      }
    })
  }, [searchParams])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (yeniSifre.length < 6) {
      setMesaj('Şifre en az 6 karakter olmalıdır.')
      return
    }
    if (yeniSifre !== yeniSifreTekrar) {
      setMesaj('Şifreler eşleşmiyor.')
      return
    }
    setMesaj('')
    setYukleniyor(true)
    const { error } = await supabase.auth.updateUser({ password: yeniSifre })
    setYukleniyor(false)
    if (error) {
      setMesaj('Şifre güncellenemedi. Lütfen tekrar deneyin.')
    } else {
      setDurum('basarili')
      setTimeout(() => router.push('/'), 2500)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/">
            <img src="/yzliste_logo.png" alt="yzliste" className="h-9 mx-auto" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-4">Yeni Şifre Belirle</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          {durum === 'yukleniyor' && (
            <p className="text-sm text-gray-500 text-center py-4">Bağlantı doğrulanıyor…</p>
          )}

          {durum === 'hata' && (
            <div className="text-center space-y-4">
              <p className="text-sm text-red-600">{mesaj}</p>
              <Link href="/giris" className="text-sm text-indigo-500 hover:underline">
                Giriş sayfasına dön
              </Link>
            </div>
          )}

          {durum === 'basarili' && (
            <div className="text-center space-y-2">
              <p className="text-sm text-green-700 bg-green-50 rounded-xl p-4">
                ✓ Şifreniz başarıyla güncellendi. Yönlendiriliyorsunuz…
              </p>
            </div>
          )}

          {durum === 'form' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="password"
                placeholder="Yeni şifre"
                value={yeniSifre}
                onChange={(e) => setYeniSifre(e.target.value)}
                required
                autoComplete="new-password"
                minLength={6}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <input
                type="password"
                placeholder="Yeni şifre (tekrar)"
                value={yeniSifreTekrar}
                onChange={(e) => setYeniSifreTekrar(e.target.value)}
                required
                autoComplete="new-password"
                minLength={6}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              {mesaj && <p className="text-xs text-red-600">{mesaj}</p>}
              <button
                type="submit"
                disabled={yukleniyor}
                className="w-full bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white font-semibold py-3 rounded-xl text-sm transition-colors"
              >
                {yukleniyor ? 'Güncelleniyor…' : 'Şifremi Güncelle'}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  )
}
