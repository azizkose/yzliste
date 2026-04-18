'use client'

import { useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { PAKET_LISTESI } from '@/lib/paketler'
import { analytics } from '@/lib/analytics'

type Kullanici = {
  id: string
  email: string | null
  kredi: number
  toplam_kullanilan: number
  is_admin: boolean
  anonim?: boolean
  ton?: string
  marka_adi?: string
}

interface PaketModalProps {
  kullanici: Kullanici
  onKapat: () => void
}

export default function PaketModal({ kullanici, onKapat }: PaketModalProps) {
  const [seciliPaket, setSeciliPaket] = useState<string | null>(null)
  const [yukleniyor, setYukleniyor] = useState(false)
  const [odemeAcik, setOdemeAcik] = useState(false)
  const [kosullarOnay, setKosullarOnay] = useState(false)
  const [mesafeliOnay, setMesafeliOnay] = useState(false)
  const [kvkkOnay, setKvkkOnay] = useState(false)
  const formRef = useRef<HTMLDivElement>(null)
  const tumOnaylar = kosullarOnay && mesafeliOnay && kvkkOnay

  const paketler = PAKET_LISTESI

  const odemeBaslat = async (paketId: string) => {
    // Fatura bilgisi kontrolü — ödeme başlamadan önce
    const { data: profilKontrol } = await supabase
      .from('profiles')
      .select('ad_soyad, fatura_tipi, tc_kimlik, vergi_no')
      .eq('id', kullanici.id)
      .single()
    const eksik =
      !profilKontrol?.ad_soyad ||
      (profilKontrol?.fatura_tipi === 'bireysel' && !profilKontrol?.tc_kimlik) ||
      (profilKontrol?.fatura_tipi === 'kurumsal' && !profilKontrol?.vergi_no)
    if (eksik) {
      onKapat()
      alert('Ödeme yapabilmek için önce profil sayfasından fatura bilgilerinizi doldurun.')
      window.location.href = '/profil'
      return
    }

    setSeciliPaket(paketId)
    setYukleniyor(true)
    const paket = PAKET_LISTESI.find((p) => p.id === paketId)
    analytics.creditPurchaseStarted({ package_id: paketId, price: paket?.fiyat ?? 0 })

    try {
      const res = await fetch('/api/odeme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paket: paketId, userId: kullanici.id, email: kullanici.email }),
      })
      const data = await res.json()
      if (data.checkoutFormContent) {
        setOdemeAcik(true)
        setTimeout(() => {
          if (formRef.current) {
            formRef.current.innerHTML = data.checkoutFormContent
            const scriptlar = formRef.current.querySelectorAll('script')
            scriptlar.forEach((eskiScript) => {
              const yeniScript = document.createElement('script')
              if (eskiScript.src) yeniScript.src = eskiScript.src
              else yeniScript.textContent = eskiScript.textContent
              eskiScript.parentNode?.replaceChild(yeniScript, eskiScript)
            })
          }
        }, 100)
      } else {
        alert(data.hata || 'Ödeme başlatılamadı, tekrar deneyin.')
      }
    } catch {
      alert('Bir hata oluştu, tekrar deneyin.')
    }
    setYukleniyor(false)
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">İçerik Üretim Kredisi Satın Al</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Mevcut kredin:{' '}
              <span className="font-semibold text-indigo-500">{kullanici.kredi}</span>
            </p>
          </div>
          <button onClick={onKapat} className="text-gray-400 hover:text-gray-600 text-2xl font-light">
            ×
          </button>
        </div>

        {!odemeAcik ? (
          <div className="p-6 space-y-4">
            {paketler.map((p) => (
              <div key={p.id} className={`border-2 ${p.renk} rounded-2xl p-5 relative`}>
                {p.rozet && (
                  <span className="absolute -top-3 left-4 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    En Popüler
                  </span>
                )}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-800">{p.isim}</p>
                    <p className="text-sm text-gray-500">{p.krediStr}</p>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{p.fiyatStr}</p>
                </div>
                <button
                  onClick={() => odemeBaslat(p.id)}
                  disabled={yukleniyor || !tumOnaylar}
                  className={`w-full mt-4 ${p.butonRenk} text-white font-semibold py-2.5 rounded-xl text-sm transition-colors disabled:bg-gray-300`}
                >
                  {yukleniyor && seciliPaket === p.id
                    ? '⏳ Yükleniyor...'
                    : !tumOnaylar
                    ? 'Onayları işaretle'
                    : 'Satın Al'}
                </button>
              </div>
            ))}

            {/* F-07d: 3 zorunlu onay checkbox'ı */}
            <div className="space-y-2 border-t border-gray-100 pt-4">
              {[
                { state: kosullarOnay, set: setKosullarOnay, href: '/kosullar', metin: 'Kullanım Koşulları' },
                { state: mesafeliOnay, set: setMesafeliOnay, href: '/mesafeli-satis', metin: 'Mesafeli Satış Sözleşmesi' },
                { state: kvkkOnay, set: setKvkkOnay, href: '/kvkk-aydinlatma', metin: 'KVKK Aydınlatma Metni' },
              ].map(({ state, set, href, metin }) => (
                <label key={href} className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={state}
                    onChange={(e) => set(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-gray-300 flex-shrink-0"
                  />
                  <span className="text-xs text-gray-600">
                    <a href={href} target="_blank" className="text-indigo-500 hover:underline font-medium">
                      {metin}
                    </a>
                    &apos;ni okudum ve kabul ediyorum.
                  </span>
                </label>
              ))}
            </div>
            <p className="text-xs text-gray-400 text-center pt-2">🔒 Güvenli ödeme — iyzico altyapısı</p>
          </div>
        ) : (
          <div className="p-4">
            <div ref={formRef} id="iyzipay-checkout-form" className="popup" />
          </div>
        )}
      </div>
    </div>
  )
}
