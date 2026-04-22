'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useCredits } from '@/lib/hooks/useCredits'
import { useCurrentUser } from '@/lib/hooks/useCurrentUser'
import RefDavetBolumu from '@/components/RefDavetBolumu'

const PLATFORM_ETIKET: Record<string, string> = {
  trendyol: 'Trendyol',
  hepsiburada: 'Hepsiburada',
  amazon: 'Amazon TR',
  n11: 'N11',
  etsy: 'Etsy',
  amazon_usa: 'Amazon USA',
}

type SonUretim = {
  id: string; platform: string; created_at: string; urun_adi: string; giris_tipi: string
}

export default function HesapPage() {
  const router = useRouter()
  const { data: krediData } = useCredits()
  const { data: currentUser } = useCurrentUser()
  const [yukleniyor, setYukleniyor] = useState(true)
  const [buAyUretim, setBuAyUretim] = useState(0)
  const [toplamUretimSayisi, setToplamUretimSayisi] = useState(0)
  const [platformSayac, setPlatformSayac] = useState<Record<string, number>>({})
  const [favoriPlatform, setFavoriPlatform] = useState<string | undefined>()
  const [sonUretimler, setSonUretimler] = useState<SonUretim[]>([])

  const kredi = krediData ?? 0
  const toplamKullanilan = currentUser?.toplam_kullanilan ?? 0
  const profilYuklendi = krediData !== null && krediData !== undefined

  useEffect(() => {
    async function yukle() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/giris'); return }

      const ayBaslangic = new Date()
      ayBaslangic.setDate(1)
      ayBaslangic.setHours(0, 0, 0, 0)

      const [buAyRes, platformRes, sonUretimlerRes] = await Promise.all([
        supabase.from('uretimler').select('id', { count: 'exact', head: true }).eq('user_id', user.id).gte('created_at', ayBaslangic.toISOString()),
        supabase.from('uretimler').select('platform').eq('user_id', user.id),
        supabase.from('uretimler').select('id, platform, created_at, urun_adi, giris_tipi').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5),
      ])

      setBuAyUretim(buAyRes.count ?? 0)

      const sayac: Record<string, number> = {}
      for (const r of (platformRes.data ?? [])) {
        if (r.platform) sayac[r.platform] = (sayac[r.platform] ?? 0) + 1
      }
      setPlatformSayac(sayac)
      setToplamUretimSayisi(platformRes.data?.length ?? 0)
      setFavoriPlatform(Object.entries(sayac).sort((a, b) => b[1] - a[1])[0]?.[0])
      setSonUretimler((sonUretimlerRes.data ?? []) as SonUretim[])
      setYukleniyor(false)
    }
    yukle()
  }, [router])

  if (yukleniyor) return <main className="min-h-screen bg-gray-50" />

  const krediDusuk = profilYuklendi && kredi > 0 && kredi <= Math.max(5, Math.round(toplamKullanilan * 0.2))

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Hesabım</h1>
            <p className="text-sm text-gray-400 mt-1">{currentUser?.email ?? ''}</p>
          </div>
          <Link href="/uret" className="text-sm bg-indigo-500 text-white px-4 py-2 rounded-xl hover:bg-indigo-600 transition-colors font-medium">
            İçerik Üret →
          </Link>
        </div>

        {/* Kredi durumu banner */}
        {profilYuklendi && kredi === 0 ? (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-red-700">🚫 Krediniz tükendi — üretim yapamazsınız</p>
              <p className="text-xs text-red-500 mt-0.5">Kredi yükleyerek üretimlerinize devam edin</p>
            </div>
            <Link href="/fiyatlar" className="text-sm bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition-colors font-medium flex-shrink-0">
              Kredi Al
            </Link>
          </div>
        ) : krediDusuk ? (
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-amber-800">⚠️ Krediniz azalıyor — {kredi} kredi kaldı</p>
              <p className="text-xs text-amber-600 mt-0.5">Kredi satın alarak kesintisiz üretim yapın</p>
            </div>
            <Link href="/fiyatlar" className="text-sm bg-amber-500 text-white px-4 py-2 rounded-xl hover:bg-amber-600 transition-colors font-medium flex-shrink-0">
              Kredi Yükle
            </Link>
          </div>
        ) : null}

        {/* 4 metrik kartı */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { etiket: 'Bu Ay Üretim', deger: buAyUretim, renk: 'text-blue-500', ikon: '📝' },
            { etiket: 'Kalan Kredi', deger: kredi, renk: 'text-indigo-500', ikon: '💳' },
            { etiket: 'Favori Platform', deger: favoriPlatform ? PLATFORM_ETIKET[favoriPlatform] ?? favoriPlatform : '—', renk: 'text-violet-500', ikon: '🏆' },
            { etiket: 'Toplam Üretim', deger: toplamUretimSayisi, renk: 'text-emerald-500', ikon: '🚀' },
          ].map((m) => (
            <div key={m.etiket} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <div className="text-xl mb-2">{m.ikon}</div>
              <p className={`text-2xl font-bold ${m.renk}`}>{m.deger}</p>
              <p className="text-xs text-gray-400 mt-1">{m.etiket}</p>
            </div>
          ))}
        </div>

        {/* Platform dağılımı */}
        {toplamUretimSayisi > 0 && Object.keys(platformSayac).length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">Platform Dağılımı</h2>
            <div className="space-y-2.5">
              {Object.entries(platformSayac)
                .sort((a, b) => b[1] - a[1])
                .map(([p, sayi]) => (
                  <div key={p} className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 w-24 flex-shrink-0 truncate">{PLATFORM_ETIKET[p] ?? p}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                      <div
                        className="bg-indigo-400 rounded-full h-1.5 transition-all"
                        style={{ width: `${Math.round((sayi / toplamUretimSayisi) * 100)}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400 w-6 text-right flex-shrink-0">{sayi}</span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Son üretimler */}
        {sonUretimler.length > 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-8">
            <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-700">Son Üretimler</h2>
              <Link href="/uret" className="text-xs text-indigo-500 hover:underline">Yeni üretim →</Link>
            </div>
            <div className="divide-y divide-gray-50">
              {sonUretimler.map((u) => {
                const girisIkon = u.giris_tipi === 'fotograf' ? '🖼️' : u.giris_tipi === 'barkod' ? '📷' : '✍️'
                return (
                  <div key={u.id} className="px-5 py-3 flex items-center gap-3">
                    <span className="text-lg">{girisIkon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{u.urun_adi || 'İsimsiz üretim'}</p>
                      <p className="text-xs text-gray-400">{PLATFORM_ETIKET[u.platform] ?? u.platform}</p>
                    </div>
                    <p className="text-xs text-gray-300 whitespace-nowrap">
                      {new Date(u.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                )
              })}
            </div>
            <div className="px-5 py-3 border-t border-gray-50 text-center">
              <Link href="/hesap/uretimler" className="text-xs text-indigo-400 hover:text-indigo-600 hover:underline transition-colors">
                Tüm üretim geçmişini gör →
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-8 text-center py-12 px-6">
            <p className="text-3xl mb-3">📦</p>
            <p className="text-gray-500 mb-5">Henüz üretim yapmadın</p>
            <Link href="/uret" className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors">
              İlk içeriğini üret →
            </Link>
          </div>
        )}

        {/* Davet programı */}
        {currentUser?.id && <RefDavetBolumu userId={currentUser.id} />}

        {/* Hızlı linkler */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { href: '/hesap/profil',    baslik: 'Profil',      aciklama: 'Kişisel ve fatura bilgileri',      ikon: '👤' },
            { href: '/hesap/marka',     baslik: 'Marka',       aciklama: 'Marka profili ve metin tonu',      ikon: '🏪' },
            { href: '/hesap/uretimler', baslik: 'Üretimler',   aciklama: 'Tüm üretim geçmişi',               ikon: '📋' },
            { href: '/hesap/krediler',  baslik: 'Krediler',    aciklama: 'Kredi geçmişi ve satın alma',      ikon: '💳' },
            { href: '/hesap/faturalar', baslik: 'Faturalar',   aciklama: 'e-Arşiv fatura indir ve gönder',   ikon: '🧾' },
            { href: '/hesap/ayarlar',   baslik: 'Ayarlar',     aciklama: 'E-posta ve şifre değiştir',        ikon: '⚙️' },
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
