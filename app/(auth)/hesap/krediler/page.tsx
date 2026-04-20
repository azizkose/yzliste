'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

type Odeme = {
  id: string; paket: string; kredi: number; tutar: number | null; created_at: string; durum: string
}

const PAKET_ETIKET: Record<string, string> = {
  baslangic: 'Başlangıç Paketi',
  populer: 'Popüler Paket',
  buyuk: 'Büyük Paket',
}

export default function KredilerPage() {
  const router = useRouter()
  const [yukleniyor, setYukleniyor] = useState(true)
  const [kredi, setKredi] = useState(0)
  const [odemeler, setOdemeler] = useState<Odeme[]>([])

  useEffect(() => {
    async function yukle() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/giris'); return }

      const [profilRes, odemeRes] = await Promise.all([
        supabase.from('profiles').select('kredi').eq('id', user.id).single(),
        supabase.from('payments').select('id, paket, kredi, tutar, created_at, durum').eq('user_id', user.id).order('created_at', { ascending: false }).limit(20),
      ])

      setKredi(profilRes.data?.kredi ?? 0)
      setOdemeler((odemeRes.data ?? []) as Odeme[])
      setYukleniyor(false)
    }
    yukle()
  }, [router])

  if (yukleniyor) return <main className="min-h-screen bg-gray-50" />

  const sonBasariliOdeme = odemeler.find(o => o.durum === 'basarili')

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/hesap" className="text-sm text-gray-400 hover:text-gray-600">← Hesap</Link>
          <h1 className="text-2xl font-bold text-gray-900">Krediler</h1>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Mevcut Kredi</p>
            <p className="text-3xl font-bold text-indigo-500 mt-1">{kredi}</p>
          </div>
          <Link href="/fiyatlar" className="bg-indigo-500 text-white text-sm font-semibold px-5 py-3 rounded-xl hover:bg-indigo-600 transition-colors">
            Kredi Al →
          </Link>
        </div>

        {sonBasariliOdeme && (
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 mb-6 flex items-center justify-between">
            <div>
              <p className="text-xs text-indigo-400 font-medium uppercase tracking-wide mb-1">Son Satın Alınan</p>
              <p className="text-sm font-bold text-indigo-800">
                {PAKET_ETIKET[sonBasariliOdeme.paket] ?? sonBasariliOdeme.paket} — {sonBasariliOdeme.kredi} kredi
              </p>
              <p className="text-xs text-indigo-400 mt-0.5">
                {new Date(sonBasariliOdeme.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                {sonBasariliOdeme.tutar ? ` · ₺${sonBasariliOdeme.tutar}` : ''}
              </p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">Ödeme Geçmişi</h2>
            <Link href="/hesap/faturalar" className="text-xs text-indigo-500 hover:underline font-medium">Faturaları Görüntüle →</Link>
          </div>
          {odemeler.length === 0 ? (
            <div className="px-6 py-8 text-center text-sm text-gray-400">
              Henüz ödeme geçmişi yok.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {odemeler.map((o) => (
                <div key={o.id} className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{o.kredi} kredi</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(o.created_at).toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-gray-700">{o.tutar ? `₺${o.tutar}` : '—'}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
