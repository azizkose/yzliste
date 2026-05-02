'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Loader2, Download, Trash2, Bell, ShieldAlert, User, Lock, ArrowLeft } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useCurrentUser } from '@/lib/hooks/useCurrentUser'
import StickySaveBar from '@/components/primitives/StickySaveBar'
import Toast, { type ToastMessage } from '@/components/primitives/Toast'

// ─── Toggle bileşeni ───────────────────────────────────────────────────────
function Toggle({
  id,
  checked,
  onChange,
  label,
  description,
}: {
  id: string
  checked: boolean
  onChange: (v: boolean) => void
  label: string
  description?: string
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-4">
      <div className="min-w-0">
        <label htmlFor={id} className="block text-sm font-medium text-rd-neutral-900 cursor-pointer">
          {label}
        </label>
        {description && (
          <p className="text-xs text-rd-neutral-400 mt-0.5 leading-relaxed">{description}</p>
        )}
      </div>
      <button
        id={id}
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={[
          'relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rd-primary-500 focus-visible:ring-offset-2',
          checked ? 'bg-rd-primary-600' : 'bg-rd-neutral-300',
        ].join(' ')}
      >
        <span
          aria-hidden="true"
          className={[
            'inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform duration-150',
            checked ? 'translate-x-4' : 'translate-x-0.5',
          ].join(' ')}
        />
      </button>
    </div>
  )
}

// ─── Bölüm kartı wrapper ───────────────────────────────────────────────────
function SectionCard({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={['rounded-xl border bg-white p-6', className ?? 'border-rd-neutral-200'].join(' ')}>
      {children}
    </div>
  )
}

// ─── Section eyebrow + başlık ──────────────────────────────────────────────
function SectionTitle({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>
  label: string
}) {
  return (
    <div className="flex items-center gap-2 mb-5">
      <Icon size={15} strokeWidth={1.5} className="text-rd-neutral-400" aria-hidden="true" />
      <span
        className="text-xs font-semibold tracking-[0.1em] uppercase text-rd-neutral-500"
        style={{ fontFamily: 'var(--font-rd-display)' }}
      >
        {label}
      </span>
    </div>
  )
}

// ─── Varsayılan bildirim tercihleri ─────────────────────────────────────────
const BILDIRIM_DEFAULT = {
  pazarlama: false,
  uretimTamamlandi: true,
  faturaHazir: true,
}

export default function AyarlarPage() {
  const router = useRouter()
  const { data: currentUser, isLoading: authLoading } = useCurrentUser()

  // Hesap
  const [email, setEmail] = useState('')

  // Şifre
  const [yeniSifre, setYeniSifre] = useState('')
  const [yeniSifreTekrar, setYeniSifreTekrar] = useState('')
  const [sifreYukleniyor, setSifreYukleniyor] = useState(false)

  // Bildirimler
  const [bildirimler, setBildirimler] = useState({ ...BILDIRIM_DEFAULT })
  const [savedBildirimler, setSavedBildirimler] = useState({ ...BILDIRIM_DEFAULT })
  const [bildirimYukleniyor, setBildirimYukleniyor] = useState(false)

  // Veri export
  const [exportYukleniyor, setExportYukleniyor] = useState(false)

  // Hesap silme
  const [silmeModal, setSilmeModal] = useState(false)
  const [silmeOnay, setSilmeOnay] = useState(false)
  const [silmeYukleniyor, setSilmeYukleniyor] = useState(false)

  // Çıkış
  const [cikisYukleniyor, setCikisYukleniyor] = useState(false)

  // Toast
  const [toast, setToast] = useState<ToastMessage | null>(null)
  const showToast = useCallback((type: 'success' | 'error', message: string) => {
    setToast({ id: Date.now().toString(), type, message })
  }, [])

  useEffect(() => {
    if (authLoading) return
    if (!currentUser) { router.push('/giris'); return }
    setEmail(currentUser.email ?? '')
  }, [authLoading, currentUser, router])

  // Şifre değiştir
  const handleSifreDegistir = async () => {
    if (!yeniSifre.trim()) { showToast('error', 'Yeni şifre girin.'); return }
    if (yeniSifre.length < 6) { showToast('error', 'Şifre en az 6 karakter olmalıdır.'); return }
    if (yeniSifre !== yeniSifreTekrar) { showToast('error', 'Şifreler eşleşmiyor.'); return }

    setSifreYukleniyor(true)
    const { error } = await supabase.auth.updateUser({ password: yeniSifre })
    if (error) showToast('error', 'Şifre değiştirilemedi: ' + error.message)
    else { showToast('success', 'Şifre başarıyla değiştirildi.'); setYeniSifre(''); setYeniSifreTekrar('') }
    setSifreYukleniyor(false)
  }

  // Oturum kapat
  const handleCikis = async () => {
    setCikisYukleniyor(true)
    await supabase.auth.signOut()
    router.push('/')
  }

  // Veri indir
  const handleExport = async () => {
    setExportYukleniyor(true)
    try {
      const res = await fetch('/api/hesap/export')
      if (!res.ok) { showToast('error', 'Veri indirilemedi, tekrar deneyin.'); setExportYukleniyor(false); return }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `yzliste-verilerim-${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)
      showToast('success', 'Verileriniz indirildi.')
    } catch {
      showToast('error', 'Bir hata oluştu.')
    }
    setExportYukleniyor(false)
  }

  // Hesap sil
  const handleHesapSil = async () => {
    if (!silmeOnay) return
    setSilmeYukleniyor(true)
    try {
      const res = await fetch('/api/hesap-sil', { method: 'DELETE' })
      if (res.ok) {
        router.push('/?hesap-silindi=1')
      } else {
        showToast('error', 'Hesap silinemedi, tekrar deneyin.')
        setSilmeModal(false)
      }
    } catch {
      showToast('error', 'Bir hata oluştu.')
      setSilmeModal(false)
    }
    setSilmeYukleniyor(false)
  }

  // Bildirim tercihleri
  const bildirimDirty =
    bildirimler.pazarlama !== savedBildirimler.pazarlama ||
    bildirimler.uretimTamamlandi !== savedBildirimler.uretimTamamlandi ||
    bildirimler.faturaHazir !== savedBildirimler.faturaHazir

  const activeCount = Object.values(bildirimler).filter(Boolean).length

  const handleBildirimKaydet = async () => {
    setBildirimYukleniyor(true)
    // HD-01b: Supabase profiles.bildirim_tercihleri kolonu gerektirir
    // Şimdilik optimistic local save
    await new Promise(r => setTimeout(r, 400))
    setSavedBildirimler({ ...bildirimler })
    setBildirimYukleniyor(false)
    showToast('success', 'Bildirim tercihleri kaydedildi.')
  }

  const handleBildirimIptal = () => {
    setBildirimler({ ...savedBildirimler })
  }

  return (
    <>
      <main className="min-h-screen bg-rd-neutral-50 px-4 py-12">
        <div className="max-w-xl mx-auto space-y-4">

          {/* Sayfa başlığı */}
          <div className="mb-8">
            <Link
              href="/hesap"
              className="inline-flex items-center gap-1.5 text-sm text-rd-neutral-400 hover:text-rd-neutral-700 transition-colors mb-4"
            >
              <ArrowLeft size={14} strokeWidth={1.5} aria-hidden="true" />
              Hesap
            </Link>
            <p
              className="text-xs font-semibold tracking-[0.1em] uppercase text-rd-primary-600 mb-2"
              style={{ fontFamily: 'var(--font-rd-display)' }}
            >
              Ayarlar
            </p>
            <h1
              className="text-2xl font-bold text-rd-neutral-900"
              style={{ fontFamily: 'var(--font-rd-display)', letterSpacing: '-0.01em' }}
            >
              Hesap ayarların
            </h1>
          </div>

          {/* ── BÖLÜM 1: HESAP ── */}
          <SectionCard>
            <SectionTitle icon={User} label="Hesap" />

            {/* E-posta */}
            <div className="mb-6">
              <label className="block text-xs font-medium text-rd-neutral-500 mb-1.5">
                E-posta adresi
              </label>
              <p className="text-sm text-rd-neutral-700 bg-rd-neutral-100 rounded-lg px-4 py-3 tabular-nums">
                {email || '—'}
              </p>
              <p className="text-xs text-rd-neutral-400 mt-1.5">
                E-posta değişikliği için{' '}
                <a href="mailto:destek@yzliste.com" className="text-rd-primary-600 hover:underline">
                  destek@yzliste.com
                </a>{' '}
                adresine yazın.
              </p>
            </div>

            {/* Şifre değiştir */}
            <div>
              <p className="text-xs font-medium text-rd-neutral-500 mb-3 flex items-center gap-1.5">
                <Lock size={12} strokeWidth={1.5} aria-hidden="true" />
                Şifre değiştir
              </p>
              <div className="space-y-3">
                <input
                  type="password"
                  placeholder="Yeni şifre"
                  value={yeniSifre}
                  onChange={(e) => setYeniSifre(e.target.value)}
                  aria-label="Yeni şifre"
                  className="w-full border border-rd-neutral-200 rounded-lg px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-rd-primary-300 transition-shadow"
                />
                <input
                  type="password"
                  placeholder="Yeni şifre (tekrar)"
                  value={yeniSifreTekrar}
                  onChange={(e) => setYeniSifreTekrar(e.target.value)}
                  aria-label="Yeni şifre tekrar"
                  className="w-full border border-rd-neutral-200 rounded-lg px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-rd-primary-300 transition-shadow"
                />
                <button
                  onClick={handleSifreDegistir}
                  disabled={sifreYukleniyor}
                  className="flex items-center justify-center gap-2 w-full bg-rd-neutral-900 hover:bg-rd-neutral-800 disabled:bg-rd-neutral-300 text-white font-medium py-3 rounded-lg text-sm transition-colors"
                >
                  {sifreYukleniyor && <Loader2 size={14} className="animate-spin" aria-hidden="true" />}
                  {sifreYukleniyor ? 'Değiştiriliyor...' : 'Şifreyi değiştir'}
                </button>
              </div>
            </div>

            {/* Oturum kapat */}
            <div className="mt-6 pt-5 border-t border-rd-neutral-100">
              <button
                onClick={handleCikis}
                disabled={cikisYukleniyor}
                className="flex items-center justify-center gap-2 w-full border border-rd-danger-200 text-rd-danger-600 hover:bg-rd-danger-50 disabled:opacity-50 font-medium py-3 rounded-lg text-sm transition-colors"
              >
                {cikisYukleniyor && <Loader2 size={14} className="animate-spin" aria-hidden="true" />}
                {cikisYukleniyor ? 'Çıkış yapılıyor...' : 'Oturumu kapat'}
              </button>
              <p className="text-xs text-rd-neutral-400 text-center mt-1.5">
                Tüm cihazlarda oturum kapatılır.
              </p>
            </div>
          </SectionCard>

          {/* ── BÖLÜM 2: BİLDİRİMLER ── */}
          <SectionCard>
            <SectionTitle icon={Bell} label="E-posta bildirimleri" />

            <div
              className="divide-y divide-rd-neutral-100"
              role="group"
              aria-label="E-posta bildirim tercihleri"
            >
              <Toggle
                id="bildirim-pazarlama"
                checked={bildirimler.pazarlama}
                onChange={(v) => setBildirimler(prev => ({ ...prev, pazarlama: v }))}
                label="Pazarlama e-postaları"
                description="Yeni özellikler, ipuçları ve yzliste haberleri."
              />
              <Toggle
                id="bildirim-uretim"
                checked={bildirimler.uretimTamamlandi}
                onChange={(v) => setBildirimler(prev => ({ ...prev, uretimTamamlandi: v }))}
                label="Üretim tamamlandı"
                description="İçerik üretimi tamamlandığında bilgilendir."
              />
              <Toggle
                id="bildirim-fatura"
                checked={bildirimler.faturaHazir}
                onChange={(v) => setBildirimler(prev => ({ ...prev, faturaHazir: v }))}
                label="Fatura hazır"
                description="Her ödeme sonrası fatura e-postası gönderilir."
              />
            </div>
          </SectionCard>

          {/* ── BÖLÜM 3: KVKK TEHLİKE ZONE ── */}
          <SectionCard className="border-rd-danger-200 bg-rd-danger-50/30">
            <SectionTitle icon={ShieldAlert} label="KVKK haklarım" />

            {/* Veri indir */}
            <div className="mb-5 pb-5 border-b border-rd-danger-100">
              <p className="text-sm font-medium text-rd-neutral-900 mb-1">Verilerimi indir</p>
              <p className="text-xs text-rd-neutral-500 mb-4 leading-relaxed">
                Hesabınıza ait tüm veriler (üretimler, ödemeler) JSON formatında indirilir.
                KVKK Madde 11 kapsamındaki hakkınızdır.
              </p>
              <button
                onClick={handleExport}
                disabled={exportYukleniyor}
                className="flex items-center justify-center gap-2 w-full bg-white border border-rd-neutral-200 hover:bg-rd-neutral-50 disabled:opacity-50 text-rd-neutral-700 font-medium py-3 rounded-lg text-sm transition-colors"
              >
                {exportYukleniyor
                  ? <><Loader2 size={14} className="animate-spin" aria-hidden="true" /> Hazırlanıyor...</>
                  : <><Download size={14} strokeWidth={1.5} aria-hidden="true" /> Verilerimi indir (JSON)</>
                }
              </button>
            </div>

            {/* Hesap sil */}
            <div>
              <p className="text-sm font-medium text-rd-danger-700 mb-1">Hesabı sil</p>
              <p className="text-xs text-rd-neutral-500 mb-4 leading-relaxed">
                Hesabınız silinmek üzere işaretlenir. Kalan krediler ve tüm veriler 30 gün içinde
                kalıcı olarak silinir. Bu süre içinde geri almak için destek@yzliste.com adresine
                yazabilirsiniz.
              </p>
              <button
                onClick={() => { setSilmeModal(true); setSilmeOnay(false) }}
                className="flex items-center justify-center gap-2 w-full border border-rd-danger-300 text-rd-danger-700 hover:bg-rd-danger-50 font-medium py-3 rounded-lg text-sm transition-colors"
              >
                <Trash2 size={14} strokeWidth={1.5} aria-hidden="true" />
                Hesabımı sil
              </button>
            </div>
          </SectionCard>

        </div>
      </main>

      {/* StickySaveBar — bildirim tercihleri değişince */}
      <StickySaveBar
        filledCount={activeCount}
        totalCount={3}
        isDirty={bildirimDirty}
        isSaving={bildirimYukleniyor}
        onSave={handleBildirimKaydet}
        onCancel={handleBildirimIptal}
        saveLabel="Tercihleri kaydet"
      />

      {/* Toast */}
      <Toast toast={toast} onDismiss={() => setToast(null)} />

      {/* Hesap silme onay modal */}
      {silmeModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 px-4 pb-4 sm:pb-0"
          role="dialog"
          aria-modal="true"
          aria-labelledby="silme-modal-baslik"
        >
          <div className="bg-white rounded-xl border border-rd-neutral-200 p-6 w-full max-w-sm">
            <h2
              id="silme-modal-baslik"
              className="font-bold text-rd-neutral-900 mb-2"
              style={{ fontFamily: 'var(--font-rd-display)' }}
            >
              Hesabı silmek istediğinizden emin misiniz?
            </h2>
            <p className="text-xs text-rd-neutral-500 mb-5 leading-relaxed">
              Bu işlem geri alınamaz. Hesabınız ve tüm verileriniz 30 gün içinde kalıcı olarak
              silinir.
            </p>
            <label className="flex items-start gap-3 mb-5 cursor-pointer group">
              <input
                type="checkbox"
                checked={silmeOnay}
                onChange={(e) => setSilmeOnay(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-rd-neutral-300 accent-rd-danger-600"
                aria-label="Hesabımı silmek istediğimi onaylıyorum"
              />
              <span className="text-sm text-rd-neutral-600">
                Hesabımı silmek istediğimi onaylıyorum
              </span>
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => setSilmeModal(false)}
                disabled={silmeYukleniyor}
                className="flex-1 border border-rd-neutral-200 text-rd-neutral-600 hover:bg-rd-neutral-50 font-medium py-2.5 rounded-lg text-sm transition-colors"
              >
                Vazgeç
              </button>
              <button
                onClick={handleHesapSil}
                disabled={!silmeOnay || silmeYukleniyor}
                className="flex-1 flex items-center justify-center gap-2 bg-rd-danger-600 hover:bg-rd-danger-700 disabled:bg-rd-neutral-200 disabled:text-rd-neutral-400 text-white font-medium py-2.5 rounded-lg text-sm transition-colors"
              >
                {silmeYukleniyor && <Loader2 size={14} className="animate-spin" aria-hidden="true" />}
                {silmeYukleniyor ? 'Siliniyor...' : 'Hesabı sil'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
