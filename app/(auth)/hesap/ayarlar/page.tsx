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
  const [exportYukleniyor, setExportYukleniyor] = useState(false)
  const [silmeModal, setSilmeModal] = useState(false)
  const [silmeOnay, setSilmeOnay] = useState(false)
  const [silmeYukleniyor, setSilmeYukleniyor] = useState(false)
  const [silmeMesaj, setSilmeMesaj] = useState('')

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

  const handleExport = async () => {
    setExportYukleniyor(true)
    try {
      const res = await fetch('/api/hesap/export')
      if (!res.ok) { setExportYukleniyor(false); return }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `yzliste-verilerim-${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)
    } catch { /* sessiz hata */ }
    setExportYukleniyor(false)
  }

  const handleHesapSil = async () => {
    if (!silmeOnay) { setSilmeMesaj('Onay kutusunu işaretlemeniz gerekiyor.'); return }
    setSilmeYukleniyor(true)
    setSilmeMesaj('')
    try {
      const res = await fetch('/api/hesap-sil', { method: 'DELETE' })
      if (res.ok) {
        router.push('/?hesap-silindi=1')
      } else {
        setSilmeMesaj('Hesap silinemedi, tekrar deneyin.')
      }
    } catch {
      setSilmeMesaj('Bir hata oluştu.')
    }
    setSilmeYukleniyor(false)
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
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <input
              type="password"
              placeholder="Yeni şifre (tekrar)"
              value={yeniSifreTekrar}
              onChange={(e) => setYeniSifreTekrar(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
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
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-4">
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

        {/* Verilerimi İndir */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-4">
          <h2 className="font-semibold text-gray-800 mb-2">Verilerimi İndir</h2>
          <p className="text-xs text-gray-400 mb-4">Hesabınıza ait tüm veriler (üretimler, ödemeler) JSON formatında indirilir. KVKK Madde 11 kapsamındaki hakkınızdır.</p>
          <button
            onClick={handleExport}
            disabled={exportYukleniyor}
            className="w-full bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 text-gray-700 font-medium py-3 rounded-xl text-sm transition-colors"
          >
            {exportYukleniyor ? '⏳ Hazırlanıyor...' : '⬇ Verilerimi İndir (JSON)'}
          </button>
        </div>

        {/* Hesabı Sil */}
        <div className="bg-white rounded-2xl border border-red-100 p-6 shadow-sm">
          <h2 className="font-semibold text-red-600 mb-2">Hesabı Sil</h2>
          <p className="text-xs text-gray-400 mb-4">
            Hesabınız silinmek üzere işaretlenir. Kalan krediler ve tüm veriler 30 gün içinde kalıcı olarak silinir.
            Bu süre içinde geri almak için destek@yzliste.com adresine yazabilirsiniz.
          </p>
          <button
            onClick={() => { setSilmeModal(true); setSilmeOnay(false); setSilmeMesaj('') }}
            className="w-full border border-red-300 text-red-500 hover:bg-red-50 font-medium py-3 rounded-xl text-sm transition-colors"
          >
            Hesabımı Sil
          </button>
        </div>
      </div>

      {/* Hesap Silme Onay Modal */}
      {silmeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="font-bold text-gray-900 mb-2">Hesabı silmek istediğinizden emin misiniz?</h3>
            <p className="text-xs text-gray-500 mb-4">
              Bu işlem geri alınamaz. Hesabınız ve tüm verileriniz 30 gün içinde kalıcı olarak silinir.
            </p>
            <label className="flex items-start gap-3 mb-4 cursor-pointer">
              <input
                type="checkbox"
                checked={silmeOnay}
                onChange={(e) => setSilmeOnay(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-red-500 focus:ring-red-400"
              />
              <span className="text-sm text-gray-700">Hesabımı silmek istediğimi onaylıyorum</span>
            </label>
            {silmeMesaj && <p className="text-xs text-red-500 mb-3">{silmeMesaj}</p>}
            <div className="flex gap-3">
              <button
                onClick={() => setSilmeModal(false)}
                className="flex-1 border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium py-2.5 rounded-xl text-sm transition-colors"
              >
                Vazgeç
              </button>
              <button
                onClick={handleHesapSil}
                disabled={silmeYukleniyor}
                className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
              >
                {silmeYukleniyor ? '...' : 'Hesabı Sil'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
