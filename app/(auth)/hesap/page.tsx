import { Metadata } from 'next'
import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabase-server'

export const metadata: Metadata = {
  title: 'Hesabım — yzliste',
  robots: { index: false, follow: false },
}

export default async function HesapPage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profil } = await supabase
    .from('profiles')
    .select('kredi, toplam_kullanilan, marka_adi')
    .eq('id', user.id)
    .single()

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Hesabım</h1>
            <p className="text-sm text-gray-400 mt-1">{user.email}</p>
          </div>
          <Link href="/" className="text-sm bg-orange-500 text-white px-4 py-2 rounded-xl hover:bg-orange-600 transition-colors font-medium">
            İçerik Üret →
          </Link>
        </div>

        {/* Metrik kartları */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { etiket: 'Kalan Kredi', deger: profil?.kredi ?? 0, renk: 'text-orange-500', ikon: '💳' },
            { etiket: 'Toplam Üretim', deger: profil?.toplam_kullanilan ?? 0, renk: 'text-blue-500', ikon: '📝' },
            { etiket: 'Marka', deger: profil?.marka_adi ?? '—', renk: 'text-gray-700', ikon: '🏪' },
            { etiket: 'Tahmini Tasarruf', deger: `~${Math.round((profil?.toplam_kullanilan ?? 0) * 0.5)}sa`, renk: 'text-green-500', ikon: '⏱️' },
          ].map((m) => (
            <div key={m.etiket} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <div className="text-xl mb-2">{m.ikon}</div>
              <p className={`text-2xl font-bold ${m.renk}`}>{m.deger}</p>
              <p className="text-xs text-gray-400 mt-1">{m.etiket}</p>
            </div>
          ))}
        </div>

        {/* Hızlı linkler */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { href: '/hesap/profil', baslik: 'Profil', aciklama: 'Marka bilgileri ve fatura ayarları', ikon: '👤' },
            { href: '/hesap/krediler', baslik: 'Krediler', aciklama: 'Kredi geçmişi ve satın alma', ikon: '💳' },
            { href: '/hesap/ayarlar', baslik: 'Ayarlar', aciklama: 'E-posta ve şifre değiştir', ikon: '⚙️' },
          ].map((l) => (
            <Link key={l.href} href={l.href} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:border-orange-200 hover:shadow-md transition-all group">
              <div className="text-2xl mb-3">{l.ikon}</div>
              <p className="font-semibold text-gray-800 group-hover:text-orange-600 transition-colors">{l.baslik}</p>
              <p className="text-xs text-gray-400 mt-1">{l.aciklama}</p>
            </Link>
          ))}
        </div>

        {/* Kredi azaldı uyarısı */}
        {(profil?.kredi ?? 0) > 0 && (profil?.kredi ?? 0) < ((profil?.toplam_kullanilan ?? 0) * 0.2 + 2) && (
          <div className="mt-6 bg-orange-50 border border-orange-200 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-orange-800">Krediniz azalıyor!</p>
              <p className="text-xs text-orange-600 mt-0.5">+50 kredi %15 indirimle satın alın</p>
            </div>
            <Link href="/kredi-yukle" className="text-sm bg-orange-500 text-white px-4 py-2 rounded-xl hover:bg-orange-600 transition-colors font-medium flex-shrink-0">
              Kredi Yükle
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}
