'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Loader2, Download } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function AyarlarPage() {
  const [email, setEmail] = useState('')
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push('/giris'); return }
      setEmail(data.user.email ?? '')
    })
  }, [router])
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
    <main className="min-h-screen bg-[#FAFAF8] px-4 py-12">
      <div className="max-w-xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/hesap" className="text-sm text-[#908E86] hover:text-[#5A5852]">← Hesap</Link>
          <h1 className="text-2xl font-medium text-[#1A1A17]">Ayarlar</h1>
        </div>

        {/* E-posta */}
        <div className="bg-white rounded-xl border border-[#D8D6CE] p-6 mb-4">
          <h2 className="font-medium text-[#1A1A17] mb-3">E-posta adresi</h2>
          <p className="text-sm text-[#5A5852] bg-[#F1F0EB] rounded-lg px-4 py-3">{email || '—'}</p>
          <p className="text-xs text-[#908E86] mt-2">E-posta değişikliği için destek@yzliste.com adresine yazın.</p>
        </div>

        {/* Şifre */}
        <div className="bg-white rounded-xl border border-[#D8D6CE] p-6 mb-4">
          <h2 className="font-medium text-[#1A1A17] mb-4">Şifre değiştir</h2>
          <div className="space-y-3">
            <input
              type="password"
              placeholder="Yeni şifre"
              value={yeniSifre}
              onChange={(e) => setYeniSifre(e.target.value)}
              className="w-full border border-[#D8D6CE] rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#BAC9EB]"
            />
            <input
              type="password"
              placeholder="Yeni şifre (tekrar)"
              value={yeniSifreTekrar}
              onChange={(e) => setYeniSifreTekrar(e.target.value)}
              className="w-full border border-[#D8D6CE] rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#BAC9EB]"
            />
            {sifreMesaj && (
              <p className={`text-xs ${sifreMesaj.includes('başarıyla') ? 'text-[#0F5132]' : 'text-[#7A1E1E]'}`}>
                {sifreMesaj}
              </p>
            )}
            <button
              onClick={handleSifreDegistir}
              disabled={sifireYukleniyor}
              className="w-full bg-[#1A1A17] hover:bg-[#333330] disabled:bg-[#D8D6CE] text-white font-medium py-3 rounded-lg text-sm transition-colors"
            >
              {sifireYukleniyor ? '...' : 'Şifreyi değiştir'}
            </button>
          </div>
        </div>

        {/* Çıkış */}
        <div className="bg-white rounded-xl border border-[#D8D6CE] p-6 mb-4">
          <h2 className="font-medium text-[#1A1A17] mb-2">Oturumu kapat</h2>
          <p className="text-xs text-[#908E86] mb-4">Tüm cihazlarda oturumunuz kapatılır.</p>
          <button
            onClick={handleCikis}
            disabled={cikisYukleniyor}
            className="w-full border border-[#7A1E1E]/30 text-[#7A1E1E] hover:bg-[#FCECEC] font-medium py-3 rounded-lg text-sm transition-colors"
          >
            {cikisYukleniyor ? '...' : 'Çıkış yap'}
          </button>
        </div>

        {/* Verilerimi İndir */}
        <div className="bg-white rounded-xl border border-[#D8D6CE] p-6 mb-4">
          <h2 className="font-medium text-[#1A1A17] mb-2">Verilerimi indir</h2>
          <p className="text-xs text-[#908E86] mb-4">Hesabınıza ait tüm veriler (üretimler, ödemeler) JSON formatında indirilir. KVKK Madde 11 kapsamındaki hakkınızdır.</p>
          <button
            onClick={handleExport}
            disabled={exportYukleniyor}
            className="w-full bg-[#F1F0EB] hover:bg-[#D8D6CE] disabled:bg-[#F1F0EB] text-[#5A5852] font-medium py-3 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
          >
            {exportYukleniyor ? (
              <>
                <Loader2 size={16} strokeWidth={1.5} className="animate-spin" /> Hazırlanıyor...
              </>
            ) : (
              <>
                <Download size={16} strokeWidth={1.5} /> Verilerimi indir (JSON)
              </>
            )}
          </button>
        </div>

        {/* Hesabı Sil */}
        <div className="bg-white rounded-xl border border-[#7A1E1E]/20 p-6">
          <h2 className="font-medium text-[#7A1E1E] mb-2">Hesabı sil</h2>
          <p className="text-xs text-[#908E86] mb-4">
            Hesabınız silinmek üzere işaretlenir. Kalan krediler ve tüm veriler 30 gün içinde kalıcı olarak silinir.
            Bu süre içinde geri almak için destek@yzliste.com adresine yazabilirsiniz.
          </p>
          <button
            onClick={() => { setSilmeModal(true); setSilmeOnay(false); setSilmeMesaj('') }}
            className="w-full border border-[#7A1E1E]/30 text-[#7A1E1E] hover:bg-[#FCECEC] font-medium py-3 rounded-lg text-sm transition-colors"
          >
            Hesabımı sil
          </button>
        </div>
      </div>

      {/* Hesap Silme Onay Modal */}
      {silmeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl border border-[#D8D6CE] p-6 max-w-sm w-full">
            <h3 className="font-medium text-[#1A1A17] mb-2">Hesabı silmek istediğinizden emin misiniz?</h3>
            <p className="text-xs text-[#908E86] mb-4">
              Bu işlem geri alınamaz. Hesabınız ve tüm verileriniz 30 gün içinde kalıcı olarak silinir.
            </p>
            <label className="flex items-start gap-3 mb-4 cursor-pointer">
              <input
                type="checkbox"
                checked={silmeOnay}
                onChange={(e) => setSilmeOnay(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-[#D8D6CE] text-[#7A1E1E] focus:ring-[#7A1E1E]/30"
              />
              <span className="text-sm text-[#5A5852]">Hesabımı silmek istediğimi onaylıyorum</span>
            </label>
            {silmeMesaj && <p className="text-xs text-[#7A1E1E] mb-3">{silmeMesaj}</p>}
            <div className="flex gap-3">
              <button
                onClick={() => setSilmeModal(false)}
                className="flex-1 border border-[#D8D6CE] text-[#5A5852] hover:bg-[#F1F0EB] font-medium py-2.5 rounded-lg text-sm transition-colors"
              >
                Vazgeç
              </button>
              <button
                onClick={handleHesapSil}
                disabled={silmeYukleniyor}
                className="flex-1 bg-[#7A1E1E] hover:bg-[#5a1616] disabled:bg-[#D8D6CE] text-white font-medium py-2.5 rounded-lg text-sm transition-colors"
              >
                {silmeYukleniyor ? '...' : 'Hesabı sil'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
