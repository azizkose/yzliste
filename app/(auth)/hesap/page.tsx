'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useCredits } from '@/lib/hooks/useCredits'
import { useCurrentUser } from '@/lib/hooks/useCurrentUser'
import { X, AlertTriangle, FileText, CreditCard, Trophy, Rocket, Package, User, Store, ClipboardList, Settings, Image as ImageIcon, Camera, Pencil } from 'lucide-react'
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

  if (yukleniyor) return <main className="min-h-screen bg-[#FAFAF8]" />

  const krediDusuk = profilYuklendi && kredi > 0 && kredi <= Math.max(5, Math.round(toplamKullanilan * 0.2))

  return (
    <main className="min-h-screen bg-[#FAFAF8] px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-medium text-[#1A1A17]">Hesabım</h1>
            <p className="text-sm text-[#908E86] mt-1">{currentUser?.email ?? ''}</p>
          </div>
          <Link href="/uret" className="text-sm bg-[#1E4DD8] text-white px-4 py-2 rounded-xl hover:bg-[#163B9E] transition-colors font-medium">
            İçerik Üret →
          </Link>
        </div>

        {/* Kredi durumu banner */}
        {profilYuklendi && kredi === 0 ? (
          <div className="mb-6 bg-[#FCECEC] border border-[#7A1E1E]/20 rounded-xl p-4 flex items-center justify-between gap-4">
            <div className="flex items-start gap-2">
              <X size={16} strokeWidth={1.5} className="text-[#7A1E1E] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-[#7A1E1E]">Krediniz tükendi — üretim yapamazsınız</p>
                <p className="text-xs text-[#7A1E1E]/70 mt-0.5">Kredi yükleyerek üretimlerinize devam edin</p>
              </div>
            </div>
            <Link href="/fiyatlar" className="text-sm bg-[#7A1E1E] text-white px-4 py-2 rounded-xl hover:bg-[#5C1616] transition-colors font-medium flex-shrink-0">
              Kredi Al
            </Link>
          </div>
        ) : krediDusuk ? (
          <div className="mb-6 bg-[#FEF4E7] border border-[#8B4513]/20 rounded-xl p-4 flex items-center justify-between gap-4">
            <div className="flex items-start gap-2">
              <AlertTriangle size={16} strokeWidth={1.5} className="text-[#8B4513] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-[#8B4513]">Krediniz azalıyor — {kredi} kredi kaldı</p>
                <p className="text-xs text-[#8B4513]/70 mt-0.5">Kredi satın alarak kesintisiz üretim yapın</p>
              </div>
            </div>
            <Link href="/fiyatlar" className="text-sm bg-[#8B4513] text-white px-4 py-2 rounded-xl hover:bg-[#6B3410] transition-colors font-medium flex-shrink-0">
              Kredi Yükle
            </Link>
          </div>
        ) : null}

        {/* 4 metrik kartı */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { etiket: 'Bu Ay Üretim', deger: buAyUretim, Ikon: FileText },
            { etiket: 'Kalan Kredi', deger: kredi, Ikon: CreditCard },
            { etiket: 'Favori Platform', deger: favoriPlatform ? PLATFORM_ETIKET[favoriPlatform] ?? favoriPlatform : '—', Ikon: Trophy },
            { etiket: 'Toplam Üretim', deger: toplamUretimSayisi, Ikon: Rocket },
          ].map((m) => (
            <div key={m.etiket} className="bg-white rounded-xl border border-[#D8D6CE] p-5">
              <m.Ikon size={20} strokeWidth={1.5} className="text-[#1E4DD8] mb-2" />
              <p className="text-2xl font-medium text-[#1A1A17]">{m.deger}</p>
              <p className="text-xs text-[#908E86] mt-1">{m.etiket}</p>
            </div>
          ))}
        </div>

        {/* Platform dağılımı */}
        {toplamUretimSayisi > 0 && Object.keys(platformSayac).length > 0 && (
          <div className="bg-white rounded-xl border border-[#D8D6CE] p-5 mb-6">
            <h2 className="text-sm font-medium text-[#5A5852] mb-3">Platform Dağılımı</h2>
            <div className="space-y-2.5">
              {Object.entries(platformSayac)
                .sort((a, b) => b[1] - a[1])
                .map(([p, sayi]) => (
                  <div key={p} className="flex items-center gap-3">
                    <span className="text-xs text-[#5A5852] w-24 flex-shrink-0 truncate">{PLATFORM_ETIKET[p] ?? p}</span>
                    <div className="flex-1 bg-[#F1F0EB] rounded-full h-1.5">
                      <div
                        className="bg-[#7B9BD9] rounded-full h-1.5 transition-all"
                        style={{ width: `${Math.round((sayi / toplamUretimSayisi) * 100)}%` }}
                      />
                    </div>
                    <span className="text-xs text-[#908E86] w-6 text-right flex-shrink-0">{sayi}</span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Son üretimler */}
        {sonUretimler.length > 0 ? (
          <div className="bg-white rounded-xl border border-[#D8D6CE] mb-8">
            <div className="px-5 py-4 border-b border-[#F1F0EB] flex items-center justify-between">
              <h2 className="text-sm font-medium text-[#5A5852]">Son Üretimler</h2>
              <Link href="/uret" className="text-xs text-[#1E4DD8] hover:underline">Yeni üretim →</Link>
            </div>
            <div className="divide-y divide-[#F1F0EB]">
              {sonUretimler.map((u) => {
                const GirisIkon = u.giris_tipi === 'fotograf' ? ImageIcon : u.giris_tipi === 'barkod' ? Camera : Pencil
                return (
                  <div key={u.id} className="px-5 py-3 flex items-center gap-3">
                    <GirisIkon size={18} strokeWidth={1.5} className="text-[#908E86]" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#1A1A17] truncate">{u.urun_adi || 'İsimsiz üretim'}</p>
                      <p className="text-xs text-[#908E86]">{PLATFORM_ETIKET[u.platform] ?? u.platform}</p>
                    </div>
                    <p className="text-xs text-[#D8D6CE] whitespace-nowrap">
                      {new Date(u.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                )
              })}
            </div>
            <div className="px-5 py-3 border-t border-[#F1F0EB] text-center">
              <Link href="/hesap/uretimler" className="text-xs text-[#1E4DD8] hover:underline transition-colors">
                Tüm üretim geçmişini gör →
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-[#D8D6CE] mb-8 text-center py-12 px-6">
            <Package size={40} strokeWidth={1.5} className="text-[#908E86] mx-auto mb-3" />
            <p className="text-[#5A5852] mb-5">Henüz üretim yapmadın</p>
            <Link href="/uret" className="bg-[#1E4DD8] hover:bg-[#163B9E] text-white px-6 py-3 rounded-xl font-medium text-sm transition-colors">
              İlk içeriğini üret →
            </Link>
          </div>
        )}

        {/* Davet programı */}
        {currentUser?.id && <RefDavetBolumu userId={currentUser.id} />}

        {/* Hızlı linkler */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { href: '/hesap/profil',    baslik: 'Profil',      aciklama: 'Kişisel ve fatura bilgileri',      Ikon: User },
            { href: '/hesap/marka',     baslik: 'Marka',       aciklama: 'Marka profili ve metin tonu',      Ikon: Store },
            { href: '/hesap/uretimler', baslik: 'Üretimler',   aciklama: 'Tüm üretim geçmişi',               Ikon: ClipboardList },
            { href: '/hesap/krediler',  baslik: 'Krediler',    aciklama: 'Kredi geçmişi ve satın alma',      Ikon: CreditCard },
            { href: '/hesap/faturalar', baslik: 'Faturalar',   aciklama: 'e-Arşiv fatura indir ve gönder',   Ikon: FileText },
            { href: '/hesap/ayarlar',   baslik: 'Ayarlar',     aciklama: 'E-posta ve şifre değiştir',        Ikon: Settings },
          ].map((l) => (
            <Link key={l.href} href={l.href} className="bg-white rounded-xl border border-[#D8D6CE] p-5 hover:border-[#1E4DD8]/40 transition-all group">
              <l.Ikon size={22} strokeWidth={1.5} className="text-[#908E86] group-hover:text-[#1E4DD8] mb-3 transition-colors" />
              <p className="font-medium text-[#1A1A17] group-hover:text-[#1E4DD8] transition-colors">{l.baslik}</p>
              <p className="text-xs text-[#908E86] mt-1">{l.aciklama}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
