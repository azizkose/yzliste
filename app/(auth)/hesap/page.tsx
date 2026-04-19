import { Metadata } from 'next'
import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Hesabım',
  robots: { index: false, follow: false },
}

const PLATFORM_ETIKET: Record<string, string> = {
  trendyol: 'Trendyol',
  hepsiburada: 'Hepsiburada',
  amazon: 'Amazon TR',
  n11: 'N11',
  etsy: 'Etsy',
  amazon_usa: 'Amazon USA',
}

export default async function HesapPage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const ayBaslangic = new Date()
  ayBaslangic.setDate(1)
  ayBaslangic.setHours(0, 0, 0, 0)

  const [profilRes, buAyRes, enCokPlatformRes, sonUretimlerRes] = await Promise.all([
    supabase
      .from('profiles')
      .select('kredi, toplam_kullanilan, marka_adi')
      .eq('id', user.id)
      .single(),
    supabase
      .from('generations')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', ayBaslangic.toISOString()),
    supabase
      .from('generations')
      .select('platform')
      .eq('user_id', user.id),
    supabase
      .from('generations')
      .select('id, platform, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(3),
  ])

  const profil = profilRes.data
  const buAyUretim = buAyRes.count ?? 0
  const kredi = profil?.kredi ?? 0

  // Favori platform hesapla
  const platformSayac: Record<string, number> = {}
  for (const r of (enCokPlatformRes.data ?? [])) {
    if (r.platform) platformSayac[r.platform] = (platformSayac[r.platform] ?? 0) + 1
  }
  const favoriPlatform = Object.entries(platformSayac).sort((a, b) => b[1] - a[1])[0]?.[0]

  const toplamUretim = profil?.toplam_kullanilan ?? 0
  const krediDusuk = kredi > 0 && kredi <= Math.max(5, Math.round(toplamUretim * 0.2))

  const sonUretimler = (sonUretimlerRes.data ?? []) as {
    id: string; platform: string; created_at: string
  }[]

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Hesabım</h1>
            <p className="text-sm text-gray-400 mt-1">{user.email}</p>
          </div>
          <Link href="/" className="text-sm bg-indigo-500 text-white px-4 py-2 rounded-xl hover:bg-indigo-600 transition-colors font-medium">
            İçerik Üret →
          </Link>
        </div>

        {/* F-22b: Kredi azaldı banner */}
        {krediDusuk && (
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-amber-800">⚠️ Krediniz azalıyor — {kredi} kredi kaldı</p>
              <p className="text-xs text-amber-600 mt-0.5">+50 kredi satın alarak üretimlerinize devam edin</p>
            </div>
            <Link href="/kredi-yukle" className="text-sm bg-amber-500 text-white px-4 py-2 rounded-xl hover:bg-amber-600 transition-colors font-medium flex-shrink-0">
              Kredi Yükle
            </Link>
          </div>
        )}

        {/* F-22a: 4 metrik kartı */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { etiket: 'Bu Ay Üretim', deger: buAyUretim, renk: 'text-blue-500', ikon: '📝' },
            { etiket: 'Kalan Kredi', deger: kredi, renk: 'text-indigo-500', ikon: '💳' },
            { etiket: 'Favori Platform', deger: favoriPlatform ? PLATFORM_ETIKET[favoriPlatform] ?? favoriPlatform : '—', renk: 'text-violet-500', ikon: '🏆' },
            { etiket: 'Tahmini Tasarruf', deger: `~${Math.round(toplamUretim * 0.5)}sa`, renk: 'text-emerald-500', ikon: '⏱️' },
          ].map((m) => (
            <div key={m.etiket} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <div className="text-xl mb-2">{m.ikon}</div>
              <p className={`text-2xl font-bold ${m.renk}`}>{m.deger}</p>
              <p className="text-xs text-gray-400 mt-1">{m.etiket}</p>
            </div>
          ))}
        </div>

        {/* F-22c: Son 3 üretim */}
        {sonUretimler.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-8">
            <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-700">Son Üretimler</h2>
              <Link href="/" className="text-xs text-indigo-500 hover:underline">Tümünü gör →</Link>
            </div>
            <div className="divide-y divide-gray-50">
              {sonUretimler.map((u) => (
                <div key={u.id} className="px-5 py-3 flex items-center gap-3">
                  <span className="text-lg">📄</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800">{PLATFORM_ETIKET[u.platform] ?? u.platform}</p>
                    <p className="text-xs text-gray-400">İçerik üretimi</p>
                  </div>
                  <p className="text-xs text-gray-300 whitespace-nowrap">
                    {new Date(u.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hızlı linkler */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { href: '/hesap/profil', baslik: 'Profil', aciklama: 'Marka bilgileri ve fatura ayarları', ikon: '👤' },
            { href: '/hesap/krediler', baslik: 'Krediler', aciklama: 'Kredi geçmişi ve satın alma', ikon: '💳' },
            { href: '/hesap/faturalar', baslik: 'Faturalar', aciklama: 'e-Arşiv fatura indir ve gönder', ikon: '🧾' },
            { href: '/hesap/ayarlar', baslik: 'Ayarlar', aciklama: 'E-posta ve şifre değiştir', ikon: '⚙️' },
          ].map((l) => (
            <Link key={l.href} href={l.href} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:border-indigo-200 hover:shadow-md transition-all group">
              <div className="text-2xl mb-3">{l.ikon}</div>
              <p className="font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">{l.baslik}</p>
              <p className="text-xs text-gray-400 mt-1">{l.aciklama}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
