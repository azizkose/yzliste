'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useCredits } from '@/lib/hooks/useCredits'
import { CreditCard, FileText } from 'lucide-react'

type Odeme = {
  id: string; paket: string; kredi: number; tutar: number | null; created_at: string; durum: string
}

const PAKET_ETIKET: Record<string, string> = {
  baslangic: 'Başlangıç paketi',
  populer: 'Popüler paket',
  buyuk: 'Büyük paket',
}

export default function KredilerPage() {
  const router = useRouter()
  const { data: kredi } = useCredits()
  const [yukleniyor, setYukleniyor] = useState(true)
  const [odemeler, setOdemeler] = useState<Odeme[]>([])

  useEffect(() => {
    async function yukle() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/giris'); return }

      const odemeRes = await supabase
        .from('payments')
        .select('id, paket, kredi, tutar, created_at, durum')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20)

      setOdemeler((odemeRes.data ?? []) as Odeme[])
      setYukleniyor(false)
    }
    yukle()
  }, [router])

  if (yukleniyor) return <main className="min-h-screen bg-[#FAFAF8]" />

  const sonBasariliOdeme = odemeler.find(o => o.durum === 'basarili')
  const krediDeger = kredi ?? 0

  return (
    <main className="min-h-screen bg-[#FAFAF8] px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/hesap" className="text-sm text-[#908E86] hover:text-[#5A5852]">← Hesap</Link>
          <h1 className="text-2xl font-medium text-[#1A1A17]">Krediler</h1>
        </div>

        <div className="bg-white rounded-xl border border-[#D8D6CE] p-6 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CreditCard size={24} strokeWidth={1.5} className="text-[#1E4DD8]" />
            <div>
              <p className="text-xs text-[#908E86]">Mevcut kredi</p>
              <p className="text-3xl font-medium text-[#1E4DD8] mt-0.5">{krediDeger}</p>
            </div>
          </div>
          <Link href="/fiyatlar" className="bg-[#1E4DD8] text-white text-sm font-medium px-5 py-3 rounded-lg hover:bg-[#163B9E] transition-colors">
            Kredi al →
          </Link>
        </div>

        {sonBasariliOdeme && (
          <div className="bg-[#F0F4FB] border border-[#BAC9EB] rounded-xl p-4 mb-6">
            <p className="text-xs text-[#7B9BD9] font-medium mb-1">Son satın alınan</p>
            <p className="text-sm font-medium text-[#1E4DD8]">
              {PAKET_ETIKET[sonBasariliOdeme.paket] ?? sonBasariliOdeme.paket} — {sonBasariliOdeme.kredi} kredi
            </p>
            <p className="text-xs text-[#7B9BD9] mt-0.5">
              {new Date(sonBasariliOdeme.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
              {sonBasariliOdeme.tutar ? ` · ₺${sonBasariliOdeme.tutar}` : ''}
            </p>
          </div>
        )}

        <div className="bg-white rounded-xl border border-[#D8D6CE]">
          <div className="px-6 py-4 border-b border-[#F1F0EB] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText size={16} strokeWidth={1.5} className="text-[#908E86]" />
              <h2 className="font-medium text-[#5A5852]">Ödeme geçmişi</h2>
            </div>
            <Link href="/hesap/faturalar" className="text-xs text-[#1E4DD8] hover:text-[#163B9E]">Faturaları görüntüle →</Link>
          </div>
          {odemeler.length === 0 ? (
            <div className="px-6 py-8 text-center text-sm text-[#908E86]">
              Henüz ödeme geçmişi yok.
            </div>
          ) : (
            <div className="divide-y divide-[#F1F0EB]">
              {odemeler.map((o) => (
                <div key={o.id} className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#1A1A17]">{o.kredi} kredi</p>
                    <p className="text-xs text-[#908E86] mt-0.5">
                      {new Date(o.created_at).toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-[#5A5852]">{o.tutar ? `₺${o.tutar}` : '—'}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
