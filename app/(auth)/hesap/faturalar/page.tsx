'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { FileText, Check, Loader2, Download, Mail } from 'lucide-react'

type Odeme = {
  id: string
  paket: string
  kredi: number
  tutar: number
  durum: string
  parasut_fatura_id: string | null
  fatura_email_gonderildi: boolean
  created_at: string
}

const PAKET_ISIM: Record<string, string> = {
  baslangic: 'Başlangıç Paketi — 10 Kredi',
  populer: 'Popüler Paket — 30 Kredi',
  buyuk: 'Büyük Paket — 100 Kredi',
}

export default function FaturalarPage() {
  const [odemeler, setOdemeler] = useState<Odeme[]>([])
  const [yukleniyor, setYukleniyor] = useState(true)
  const [aksiyonDurum, setAksiyonDurum] = useState<Record<string, 'pdf' | 'email' | null>>({})

  useEffect(() => {
    const yukle = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase
        .from('payments')
        .select('id, paket, kredi, tutar, durum, parasut_fatura_id, fatura_email_gonderildi, created_at')
        .eq('user_id', user.id)
        .eq('durum', 'basarili')
        .order('created_at', { ascending: false })
      setOdemeler(data ?? [])
      setYukleniyor(false)
    }
    yukle()
  }, [])

  const pdfIndir = async (odemeId: string) => {
    setAksiyonDurum((prev) => ({ ...prev, [odemeId]: 'pdf' }))
    try {
      const res = await fetch(`/api/fatura?odemeId=${odemeId}&action=pdf`)
      const data = await res.json()
      if (data.pdf_url) {
        window.open(data.pdf_url, '_blank')
      } else {
        alert(data.hata || 'PDF alınamadı.')
      }
    } catch {
      alert('Bir hata oluştu.')
    }
    setAksiyonDurum((prev) => ({ ...prev, [odemeId]: null }))
  }

  const epostaGonder = async (odemeId: string) => {
    if (!confirm('Fatura e-posta adresinize gönderilsin mi?')) return
    setAksiyonDurum((prev) => ({ ...prev, [odemeId]: 'email' }))
    try {
      const res = await fetch(`/api/fatura?odemeId=${odemeId}&action=email`)
      const data = await res.json()
      if (data.ok) {
        alert('Fatura e-postanıza gönderildi.')
        setOdemeler((prev) =>
          prev.map((o) => o.id === odemeId ? { ...o, fatura_email_gonderildi: true } : o)
        )
      } else {
        alert(data.hata || 'E-posta gönderilemedi.')
      }
    } catch {
      alert('Bir hata oluştu.')
    }
    setAksiyonDurum((prev) => ({ ...prev, [odemeId]: null }))
  }

  return (
    <main className="min-h-screen bg-[#FAFAF8] px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/hesap" className="text-sm text-[#908E86] hover:text-[#5A5852]">← Hesap</Link>
          <h1 className="text-2xl font-medium text-[#1A1A17]">Faturalar</h1>
        </div>

        {yukleniyor ? (
          <div className="bg-white rounded-xl border border-[#D8D6CE] p-8 text-center text-[#908E86]">
            Yükleniyor...
          </div>
        ) : odemeler.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#D8D6CE] p-10 text-center">
            <FileText size={40} strokeWidth={1.5} className="text-[#908E86] mx-auto mb-3" />
            <p className="text-[#5A5852] font-medium">Henüz faturanız yok</p>
            <p className="text-sm text-[#908E86] mt-1">Kredi satın aldıktan sonra faturalarınız burada görünür.</p>
            <Link href="/kredi-yukle" className="inline-block mt-5 bg-[#1E4DD8] text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-[#163B9E] transition-colors">
              Kredi Satın Al →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {odemeler.map((odeme) => {
              const tarih = new Date(odeme.created_at).toLocaleDateString('tr-TR', {
                day: '2-digit', month: 'long', year: 'numeric',
              })
              const aksiyonYukleniyor = aksiyonDurum[odeme.id]

              return (
                <div key={odeme.id} className="bg-white rounded-xl border border-[#D8D6CE] p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="font-medium text-[#1A1A17] text-sm">
                        {PAKET_ISIM[odeme.paket] ?? odeme.paket}
                      </p>
                      <p className="text-xs text-[#908E86] mt-0.5">{tarih}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-sm font-medium text-[#1A1A17]">
                          ₺{odeme.tutar.toLocaleString('tr-TR')}
                        </span>
                        <span className="text-xs bg-[#E8F5EE] text-[#0F5132] font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Check size={10} strokeWidth={2} />
                          Ödendi
                        </span>
                        {!odeme.parasut_fatura_id && (
                          <span className="text-xs bg-[#FEF4E7] text-[#8B4513] font-medium px-2 py-0.5 rounded-full">
                            Fatura oluşturuluyor
                          </span>
                        )}
                      </div>
                    </div>
                    {odeme.parasut_fatura_id && (
                      <div className="flex flex-col gap-2 items-end">
                        <button
                          onClick={() => pdfIndir(odeme.id)}
                          disabled={!!aksiyonYukleniyor}
                          className="flex items-center gap-1.5 text-xs bg-[#F0F4FB] text-[#1E4DD8] hover:bg-[#BAC9EB]/30 font-medium px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 whitespace-nowrap"
                        >
                          {aksiyonYukleniyor === 'pdf'
                            ? <Loader2 size={12} strokeWidth={1.5} className="animate-spin" />
                            : <Download size={12} strokeWidth={1.5} />
                          }
                          PDF İndir
                        </button>
                        <button
                          onClick={() => epostaGonder(odeme.id)}
                          disabled={!!aksiyonYukleniyor}
                          className="flex items-center gap-1.5 text-xs bg-[#F1F0EB] text-[#5A5852] hover:bg-[#D8D6CE] font-medium px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 whitespace-nowrap"
                        >
                          {aksiyonYukleniyor === 'email'
                            ? <Loader2 size={12} strokeWidth={1.5} className="animate-spin" />
                            : odeme.fatura_email_gonderildi
                            ? <Check size={12} strokeWidth={2} />
                            : <Mail size={12} strokeWidth={1.5} />
                          }
                          {odeme.fatura_email_gonderildi ? 'Yeniden Gönder' : 'E-postayla Gönder'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <p className="text-xs text-[#908E86] text-center mt-8">
          Fatura ile ilgili sorunlar için{' '}
          <a href="mailto:destek@yzliste.com" className="text-[#1E4DD8] hover:underline">
            destek@yzliste.com
          </a>
        </p>
      </div>
    </main>
  )
}
