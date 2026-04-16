'use client'

import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useCredits } from '@/lib/hooks/useCredits'
import { useInvalidateCredits } from '@/lib/hooks/useCredits'

const PAKETLER = [
  { id: 'baslangic', isim: 'Başlangıç', fiyat: '₺29', kredi: 10, renk: 'border-gray-200', butonRenk: 'bg-gray-800 hover:bg-gray-900' },
  { id: 'populer', isim: 'Popüler', fiyat: '₺79', kredi: 30, renk: 'border-orange-400 ring-2 ring-orange-400', butonRenk: 'bg-orange-500 hover:bg-orange-600', rozet: true },
  { id: 'buyuk', isim: 'Büyük', fiyat: '₺149', kredi: 100, renk: 'border-gray-200', butonRenk: 'bg-gray-800 hover:bg-gray-900' },
]

export default function KrediYuklePage() {
  const { data: kredi } = useCredits()
  const invalidateCredits = useInvalidateCredits()
  const [yukleniyor, setYukleniyor] = useState<string | null>(null)
  const [odemeForm, setOdemeForm] = useState<string | null>(null)
  const [hata, setHata] = useState('')

  const odemeBaslat = async (paketId: string) => {
    setHata('')
    setYukleniyor(paketId)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const res = await fetch('/api/odeme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paket: paketId, userId: user.id, email: user.email }),
      })
      const data = await res.json()
      if (data.checkoutFormContent) {
        setOdemeForm(data.checkoutFormContent)
      } else {
        setHata(data.hata || 'Ödeme başlatılamadı.')
      }
    } catch {
      setHata('Bir hata oluştu, tekrar deneyin.')
    }
    setYukleniyor(null)
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="max-w-xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <img src="/yzliste_logo.png" alt="yzliste" className="h-8" />
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm text-gray-500">Mevcut krediniz</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">{kredi ?? '–'} <span className="text-lg font-normal text-gray-400">kredi</span></p>
        </div>

        {odemeForm ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <div
              id="iyzipay-checkout-form"
              className="popup"
              dangerouslySetInnerHTML={{ __html: odemeForm }}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <h1 className="text-xl font-bold text-gray-900 mb-4">Kredi Yükle</h1>
            {PAKETLER.map((p) => (
              <div key={p.id} className={`bg-white border-2 ${p.renk} rounded-2xl p-5 relative`}>
                {p.rozet && (
                  <span className="absolute -top-3 left-4 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    En Popüler
                  </span>
                )}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-800">{p.isim}</p>
                    <p className="text-sm text-gray-500">{p.kredi} kredi</p>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{p.fiyat}</p>
                </div>
                <button
                  onClick={() => odemeBaslat(p.id)}
                  disabled={yukleniyor !== null}
                  className={`w-full mt-4 ${p.butonRenk} text-white font-semibold py-2.5 rounded-xl text-sm transition-colors disabled:bg-gray-300`}
                >
                  {yukleniyor === p.id ? '⏳ Yükleniyor...' : 'Satın Al'}
                </button>
              </div>
            ))}
            {hata && <p className="text-xs text-red-500 text-center">{hata}</p>}
            <p className="text-xs text-gray-400 text-center pt-2">🔒 Güvenli ödeme — iyzico altyapısı</p>
          </div>
        )}
      </div>
    </main>
  )
}
