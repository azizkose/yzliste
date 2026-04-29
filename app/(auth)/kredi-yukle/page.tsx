'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Check, ShieldCheck, FileText, Loader2, CreditCard } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useCredits } from '@/lib/hooks/useCredits'
import { PAKET_LISTESI, type PaketId } from '@/lib/paketler'
import Toast, { type ToastMessage } from '@/components/primitives/Toast'

// ─── Trust strip ───────────────────────────────────────────────────────────
function TrustStrip() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 py-4 text-xs text-rd-neutral-400">
      <span className="flex items-center gap-1.5">
        <ShieldCheck size={13} strokeWidth={1.5} aria-hidden="true" />
        iyzico güvencesi
      </span>
      <span className="flex items-center gap-1.5">
        <FileText size={13} strokeWidth={1.5} aria-hidden="true" />
        e-Arşiv fatura
      </span>
      <span className="flex items-center gap-1.5">
        <ShieldCheck size={13} strokeWidth={1.5} aria-hidden="true" />
        KVKK uyumlu
      </span>
    </div>
  )
}

// ─── Paket seçim kartı ─────────────────────────────────────────────────────
function PaketKart({
  paket,
  isSelected,
  isPopuler,
  yukleniyor,
  tumOnaylar,
  onSatinAl,
}: {
  paket: (typeof PAKET_LISTESI)[number]
  isSelected: boolean
  isPopuler: boolean
  yukleniyor: boolean
  tumOnaylar: boolean
  onSatinAl: () => void
}) {
  return (
    <div
      className={[
        'relative flex flex-col rounded-xl border bg-white p-6 transition-all duration-150',
        isSelected
          ? 'border-2 border-rd-primary-500 md:-translate-y-1'
          : 'border border-rd-neutral-200',
      ].join(' ')}
    >
      {isPopuler && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center rounded-full bg-rd-primary-600 px-3 py-1 text-xs font-medium text-white tracking-wide">
            En popüler
          </span>
        </div>
      )}

      <div className="mb-4">
        <p
          className="font-bold text-rd-neutral-900 text-lg"
          style={{ fontFamily: 'var(--font-rd-display)' }}
        >
          {paket.isim}
        </p>
        <p
          className="text-3xl font-bold text-rd-neutral-900 mt-1 tabular-nums"
          style={{ fontFamily: 'var(--font-rd-display)' }}
        >
          {paket.fiyatStr}
        </p>
        <p className="text-sm text-rd-neutral-500 mt-1">
          {paket.kredi} kredi ·{' '}
          <span className="text-rd-neutral-400">
            {(paket.fiyat / paket.kredi).toFixed(2).replace('.', ',')}₺/kredi
          </span>
        </p>
        <p className="text-xs text-rd-neutral-400 mt-2 leading-relaxed">{paket.aciklama}</p>
      </div>

      <ul className="space-y-2 flex-1 mb-6" role="list">
        {paket.ozellikler.map((o, i) => (
          <li key={i} className="flex items-start gap-2 text-xs text-rd-neutral-600">
            <Check
              size={12}
              strokeWidth={2}
              className="text-rd-success-600 flex-shrink-0 mt-0.5"
              aria-hidden="true"
            />
            {o}
          </li>
        ))}
      </ul>

      <button
        onClick={onSatinAl}
        disabled={yukleniyor || !tumOnaylar}
        aria-busy={yukleniyor}
        className={[
          'flex items-center justify-center gap-2 w-full py-3 rounded-lg text-sm font-medium transition-colors',
          'disabled:bg-rd-neutral-200 disabled:text-rd-neutral-400 disabled:cursor-not-allowed',
          isSelected
            ? 'bg-rd-primary-600 hover:bg-rd-primary-700 text-white'
            : 'border border-rd-neutral-300 text-rd-neutral-700 hover:bg-rd-neutral-50',
        ].join(' ')}
      >
        {yukleniyor ? (
          <>
            <Loader2 size={14} className="animate-spin" aria-hidden="true" />
            Yükleniyor...
          </>
        ) : (
          <>
            <CreditCard size={14} strokeWidth={1.5} aria-hidden="true" />
            Satın al
          </>
        )}
      </button>
    </div>
  )
}

// ─── İçerik (useSearchParams içerdiği için Suspense'e sarılır) ─────────────
function KrediYukleIcerik() {
  const searchParams = useSearchParams()
  const urlPaket = searchParams.get('paket') as PaketId | null

  const { data: kredi } = useCredits()
  const [yukleniyor, setYukleniyor] = useState<string | null>(null)
  const [odemeForm, setOdemeForm] = useState<string | null>(null)
  const [sozlesmeOnay, setSozlesmeOnay] = useState(false)
  const [mesafeliOnay, setMesafeliOnay] = useState(false)
  const [kvkkOnay, setKvkkOnay] = useState(false)
  const [toast, setToast] = useState<ToastMessage | null>(null)

  const tumOnaylar = sozlesmeOnay && mesafeliOnay && kvkkOnay

  // URL param geçerliyse o paketi seç, yoksa "populer"
  const defaultId: PaketId =
    urlPaket && PAKET_LISTESI.some(p => p.id === urlPaket) ? urlPaket : 'populer'
  const [selectedId, setSelectedId] = useState<PaketId>(defaultId)

  // URL değişince (navig.) güncelle
  useEffect(() => {
    if (urlPaket && PAKET_LISTESI.some(p => p.id === urlPaket)) {
      setSelectedId(urlPaket)
    }
  }, [urlPaket])

  const odemeBaslat = async (paketId: string) => {
    setYukleniyor(paketId)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setYukleniyor(null); return }

      const res = await fetch('/api/odeme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paket: paketId, userId: user.id, email: user.email }),
      })
      const data = await res.json()
      if (data.checkoutFormContent) {
        setOdemeForm(data.checkoutFormContent)
      } else {
        setToast({
          id: Date.now().toString(),
          type: 'error',
          message: data.hata || 'Ödeme başlatılamadı, tekrar dene.',
        })
      }
    } catch {
      setToast({
        id: Date.now().toString(),
        type: 'error',
        message: 'Bir hata oluştu, tekrar deneyin.',
      })
    }
    setYukleniyor(null)
  }

  return (
    <>
      <main className="min-h-screen bg-rd-neutral-50 px-4 py-12">
        <div className="max-w-xl mx-auto">

          {/* Logo */}
          <div className="flex items-center justify-center mb-10">
            <Link href="/" aria-label="yzliste anasayfa">
              <img src="/yzliste_logo.png" alt="yzliste" className="h-7" />
            </Link>
          </div>

          {/* Başlık */}
          {!odemeForm && (
            <div className="text-center mb-8">
              <p
                className="text-xs font-semibold tracking-[0.1em] uppercase text-rd-primary-600 mb-2"
                style={{ fontFamily: 'var(--font-rd-display)' }}
              >
                Kredi yükle
              </p>
              <h1
                className="text-2xl font-bold text-rd-neutral-900 mb-1"
                style={{ fontFamily: 'var(--font-rd-display)', letterSpacing: '-0.01em' }}
              >
                Paket seç
              </h1>
              <p className="text-sm text-rd-neutral-400">
                Bir kez öde, sona erene kadar kullan. Süre sınırı yok.
              </p>
            </div>
          )}

          {/* Mevcut kredi */}
          {!odemeForm && kredi !== undefined && (
            <div className="rounded-xl border border-rd-neutral-200 bg-white px-5 py-4 mb-6 flex items-center justify-between">
              <p className="text-sm text-rd-neutral-500">Mevcut krediniz</p>
              <p className="text-xl font-bold text-rd-neutral-900 tabular-nums"
                 style={{ fontFamily: 'var(--font-rd-display)' }}>
                {kredi ?? '–'}
                <span className="text-sm font-normal text-rd-neutral-400 ml-1">kredi</span>
              </p>
            </div>
          )}

          {/* iyzico form */}
          {odemeForm ? (
            <div className="bg-white rounded-xl border border-rd-neutral-200 p-4">
              <div
                id="iyzipay-checkout-form"
                className="popup"
                dangerouslySetInnerHTML={{ __html: odemeForm }}
              />
            </div>
          ) : (
            <>
              {/* Paket kartları */}
              <div
                className="grid grid-cols-1 gap-5 mb-6 sm:grid-cols-3 items-stretch"
                role="radiogroup"
                aria-label="Kredi paketi seçimi"
              >
                {PAKET_LISTESI.map((p) => (
                  <div
                    key={p.id}
                    role="radio"
                    aria-checked={selectedId === p.id}
                    onClick={() => setSelectedId(p.id)}
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedId(p.id) }}
                    className="cursor-pointer outline-none"
                  >
                    <PaketKart
                      paket={p}
                      isSelected={selectedId === p.id}
                      isPopuler={p.rozet === true}
                      yukleniyor={yukleniyor === p.id}
                      tumOnaylar={tumOnaylar}
                      onSatinAl={() => odemeBaslat(p.id)}
                    />
                  </div>
                ))}
              </div>

              {/* Yasal onaylar */}
              <div
                className="rounded-xl border border-rd-neutral-200 bg-white p-5 space-y-3 mb-4"
                role="group"
                aria-label="Satın alma onayları"
              >
                <p className="text-xs font-semibold text-rd-neutral-600 mb-1">
                  Satın almak için aşağıdakileri onaylayın:
                </p>

                {[
                  { id: 'onay-sozlesme', checked: sozlesmeOnay, onChange: setSozlesmeOnay, href: '/kosullar', label: 'Kullanım Koşulları' },
                  { id: 'onay-mesafeli', checked: mesafeliOnay, onChange: setMesafeliOnay, href: '/mesafeli-satis', label: 'Mesafeli Satış Sözleşmesi' },
                  { id: 'onay-kvkk', checked: kvkkOnay, onChange: setKvkkOnay, href: '/kvkk-aydinlatma', label: 'KVKK Aydınlatma Metni' },
                ].map(({ id, checked, onChange, href, label }) => (
                  <label key={id} className="flex items-start gap-3 cursor-pointer">
                    <input
                      id={id}
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => onChange(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-rd-neutral-300 accent-rd-primary-600"
                    />
                    <span className="text-xs text-rd-neutral-600">
                      <Link
                        href={href}
                        target="_blank"
                        className="text-rd-primary-600 hover:underline font-medium"
                      >
                        {label}
                      </Link>
                      &#39;nı okudum ve kabul ediyorum.
                    </span>
                  </label>
                ))}

                {!tumOnaylar && (
                  <p className="text-xs text-rd-warning-600 pt-1">
                    Satın almak için tüm sözleşmeleri onaylamanız gerekiyor.
                  </p>
                )}
              </div>

              {/* Trust strip */}
              <TrustStrip />
            </>
          )}

        </div>
      </main>

      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </>
  )
}

// ─── Default export — Suspense wrapper (useSearchParams zorunlu) ───────────
export default function KrediYuklePage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-rd-neutral-50 flex items-center justify-center">
          <Loader2 className="animate-spin text-rd-neutral-300" size={24} />
        </main>
      }
    >
      <KrediYukleIcerik />
    </Suspense>
  )
}
