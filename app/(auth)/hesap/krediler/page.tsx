import { Metadata } from 'next'
import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'


export const metadata: Metadata = {
  title: 'Krediler',
  robots: { index: false, follow: false },
}

export default async function KredilerPage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profil } = await supabase
    .from('profiles')
    .select('kredi, toplam_kullanilan')
    .eq('id', user.id)
    .single()

  // Ödeme geçmişi (tablo henüz oluşturulmadıysa boş gelir)
  const { data: odemeler } = await supabase
    .from('payments')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(20)

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/hesap" className="text-sm text-gray-400 hover:text-gray-600">← Hesap</Link>
          <h1 className="text-2xl font-bold text-gray-900">Krediler</h1>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Mevcut Kredi</p>
            <p className="text-3xl font-bold text-indigo-500 mt-1">{profil?.kredi ?? 0}</p>
          </div>
          <Link href="/kredi-yukle" className="bg-indigo-500 text-white text-sm font-semibold px-5 py-3 rounded-xl hover:bg-indigo-600 transition-colors">
            Kredi Yükle →
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">Ödeme Geçmişi</h2>
            <Link href="/hesap/faturalar" className="text-xs text-indigo-500 hover:underline font-medium">Faturaları Görüntüle →</Link>
          </div>
          {!odemeler || odemeler.length === 0 ? (
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
