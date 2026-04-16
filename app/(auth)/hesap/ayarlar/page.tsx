'use client'

import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useCurrentUser } from '@/lib/hooks/useCurrentUser'

export default function AyarlarPage() {
  const { data: user } = useCurrentUser()
  const router = useRouter()
  const [yeniSifre, setYeniSifre] = useState('')
  const [yeniSifreTekrar, setYeniSifreTekrar] = useState('')
  const [sifreMesaj, setSifreMesaj] = useState('')
  const [sifireYukleniyor, setSifreYukleniyor] = useState(false)
  const [cikisYukleniyor, setCikisYukleniyor] = useState(false)

  const handleSifreDegistir = async () => {
    if (!yeniSifre.trim()) { setSifreMesaj('Yeni şifre girin.'); return }
    if (yeniSifre.length < 6) { setSifreMesaj('Şifre en az 6 karakter olmalıdır.'); return }
    if (yeniSifre !== yeniSifreTekrar) { setSifreMesaj('Şifreler eşleşmiyor.'); return }

    setSifreYukleniyor(true)
    setSifreMesaj('')
    const { error } = await supabase.auth.updateUser({ password: yeniSifre })
    if (error) setSifreMesaj('Şifre değiştirilemedi: ' + error.message)
    else { setSifreMesaj('Şifre başarıyla değiştirildi.'); setYeniSifre(''); setYeniSifreTekrar('') }
    setSifreYukleniyor(false)
  }

  const handleCikis = async () => {
    setCikisYukleniyor(true)
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="max-w-xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/hesap" className="text-sm text-gray-400 hover:text-gray-600">← Hesap</Link>
          <h1 className="text-2xl font-bold text-gray-900">Ayarlar</h1>
        </div>

        {/* E-posta */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-4">
          <h2 className="font-semibold text-gray-800 mb-3">E-posta Adresi</h2>
          <p className="text-sm text-gray-600 bg-gray-50 rounded-xl px-4 py-3">{user?.email ?? '—'}</p>
          <p className="text-xs text-gray-400 mt-2">E-posta değişikliği için destek@yzliste.com adresine yazın.</p>
        </div>

        {/* Şifre */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-4">
          <h2 className="font-semibold text-gray-800 mb-4">Şifre Değiştir</h2>
          <div className="space-y-3">
            <input
              type="password"
              placeholder="Yeni şifre"
              value={yeniSifre}
              onChange={(e) => setYeniSifre(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <input
              type="password"
              placeholder="Yeni şifre (tekrar)"
              value={yeniSifreTekrar}
              onChange={(e) => setYeniSifreTekrar(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            {sifreMesaj && (
              <p className={`text-xs ${sifreMesaj.includes('başarıyla') ? 'text-green-600' : 'text-red-500'}`}>
                {sifreMesaj}
              </p>
            )}
            <button
              onClick={handleSifreDegistir}
              disabled={sifireYukleniyor}
              className="w-full bg-gray-800 hover:bg-gray-900 disabled:bg-gray-300 text-white font-semibold py-3 rounded-xl text-sm transition-colors"
            >
              {sifireYukleniyor ? '...' : 'Şifreyi Değiştir'}
            </button>
          </div>
        </div>

        {/* Çıkış */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-2">Oturumu Kapat</h2>
          <p className="text-xs text-gray-400 mb-4">Tüm cihazlarda oturumunuz kapatılır.</p>
          <button
            onClick={handleCikis}
            disabled={cikisYukleniyor}
            className="w-full border border-red-200 text-red-500 hover:bg-red-50 font-medium py-3 rounded-xl text-sm transition-colors"
          >
            {cikisYukleniyor ? '...' : 'Çıkış Yap'}
          </button>
        </div>
      </div>
    </main>
  )
}
