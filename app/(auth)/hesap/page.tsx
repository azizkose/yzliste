'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useCredits } from '@/lib/hooks/useCredits'
import { useCurrentUser } from '@/lib/hooks/useCurrentUser'
import { X, AlertTriangle, FileText, CreditCard, Trophy, Rocket, Package, User, Store, ClipboardList, Settings, Image as ImageIcon, Camera, Pencil, Video, MessageSquare, BarChart2 } from 'lucide-react'
import RefDavetBolumu from '@/components/RefDavetBolumu'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

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

type HaftalikVeri = { hafta: string; sayi: number }

function haftaBaslangici(date: Date): Date {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  const gun = d.getDay()
  d.setDate(d.getDate() - ((gun + 6) % 7)) // Pazartesi başlangıç
  return d
}

function haftalikTrendHesapla(tarihler: string[]): HaftalikVeri[] {
  const bugun = new Date()
  const onikiHaftaOnce = new Date(bugun)
  onikiHaftaOnce.setDate(bugun.getDate() - 83) // ~12 hafta

  const haftalar: Record<string, number> = {}
  for (let i = 11; i >= 0; i--) {
    const d = new Date(bugun)
    d.setDate(bugun.getDate() - i * 7)
    const baslangic = haftaBaslangici(d)
    const key = baslangic.toISOString().slice(0, 10)
    haftalar[key] = 0
  }

  for (const t of tarihler) {
    const d = new Date(t)
    if (d < onikiHaftaOnce) continue
    const key = haftaBaslangici(d).toISOString().slice(0, 10)
    if (key in haftalar) haftalar[key]++
  }

  return Object.entries(haftalar).map(([key, sayi]) => {
    const d = new Date(key)
    const etiket = d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })
    return { hafta: etiket, sayi }
  })
}

// Tahmini freelancer fiyatları (TL)
const DEGER_TAHMIN = { metin: 300, gorsel: 500, video: 2000 }

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
  const [haftalikTrend, setHaftalikTrend] = useState<HaftalikVeri[]>([])
  const [buAyKredi, setBuAyKredi] = useState(0)

  const kredi = krediData ?? 0
  const toplamKullanilan = currentUser?.toplam_kullanilan ?? 0
  const profilYuklendi = krediData !== null && krediData !== undefined

  useEffect(() => {
    async function yukle() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/giris'); return }

      const bugun = new Date()
      const ayBaslangic = new Date(bugun.getFullYear(), bugun.getMonth(), 1)
      const ucAyOnce = new Date(bugun)
      ucAyOnce.setDate(bugun.getDate() - 90)

      const [buAyRes, trendRes, sonUretimlerRes] = await Promise.all([
        supabase.from('uretimler').select('id', { count: 'exact', head: true }).eq('user_id', user.id).gte('created_at', ayBaslangic.toISOString()),
        supabase.from('uretimler').select('platform, created_at').eq('user_id', user.id).gte('created_at', ucAyOnce.toISOString()),
        supabase.from('uretimler').select('id, platform, created_at, urun_adi, giris_tipi').eq('user_id', user.id).order('created_at', { ascending: false }).limit(10),
      ])

      setBuAyUretim(buAyRes.count ?? 0)

      const tumKayitlar = trendRes.data ?? []

      // Platform sayacı (son 90 gün + öncesini de almak için toplamı ayrı çek)
      const platformRes = await supabase.from('uretimler').select('platform').eq('user_id', user.id)
      const sayac: Record<string, number> = {}
      for (const r of (platformRes.data ?? [])) {
        if (r.platform) sayac[r.platform] = (sayac[r.platform] ?? 0) + 1
      }
      setPlatformSayac(sayac)
      setToplamUretimSayisi(platformRes.data?.length ?? 0)
      setFavoriPlatform(Object.entries(sayac).sort((a, b) => b[1] - a[1])[0]?.[0])

      // Haftalık trend (son 12 hafta)
      const tarihler = tumKayitlar.map(r => r.created_at)
      setHaftalikTrend(haftalikTrendHesapla(tarihler))

      // Bu ay kredi harcaması (metin = 1 kredi, yaklaşık)
      setBuAyKredi(buAyRes.count ?? 0)

      setSonUretimler((sonUretimlerRes.data ?? []) as SonUretim[])
      setYukleniyor(false)
    }
    yukle()
  }, [router])

  if (yukleniyor) return <main className="min-h-screen bg-[#FAFAF8]" />

  const krediDusuk = profilYuklendi && kredi > 0 && kredi <= Math.max(5, Math.round(toplamKullanilan * 0.2))
  const tahminiDeger = buAyUretim * DEGER_TAHMIN.metin
  const maxTrend = Math.max(...haftalikTrend.map(h => h.sayi), 1)

  return (
    <main className="min-h-screen bg-[#FAFAF8] px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-medium text-[#1A1A17]">Hesabım</h1>
            <p className="text-sm text-[#908E86] mt-1">{currentUser?.email ?? ''}</p>
          </div>
          <Link href="/uret" className="text-sm bg-[#1E4DD8] text-white px-4 py-2 rounded-lg hover:bg-[#163B9E] transition-colors font-medium">
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
            <Link href="/fiyatlar" className="text-sm bg-[#7A1E1E] text-white px-4 py-2 rounded-lg hover:bg-[#5C1616] transition-colors font-medium flex-shrink-0">
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
            <Link href="/fiyatlar" className="text-sm bg-[#8B4513] text-white px-4 py-2 rounded-lg hover:bg-[#6B3410] transition-colors font-medium flex-shrink-0">
              Kredi Yükle
            </Link>
          </div>
        ) : null}

        {/* Değer mesajı */}
        {buAyUretim >= 3 && (
          <div className="mb-6 bg-[#F0F4FB] border border-[#BAC9EB] rounded-xl p-4">
            <p className="text-sm text-[#1E4DD8]">
              Bu ay <span className="font-medium">{buAyUretim} içerik</span> ürettin — freelancer&apos;a verseydin tahminen{' '}
              <span className="font-medium">₺{tahminiDeger.toLocaleString('tr-TR')}</span> öderdin.
            </p>
          </div>
        )}

        {/* 4 metrik kartı */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { etiket: 'Bu ay üretim', deger: buAyUretim, Ikon: FileText },
            { etiket: 'Kalan kredi', deger: kredi, Ikon: CreditCard },
            { etiket: 'Favori platform', deger: favoriPlatform ? PLATFORM_ETIKET[favoriPlatform] ?? favoriPlatform : '—', Ikon: Trophy },
            { etiket: 'Toplam üretim', deger: toplamUretimSayisi, Ikon: Rocket },
          ].map((m) => (
            <div key={m.etiket} className="bg-white rounded-xl border border-[#D8D6CE] p-5">
              <m.Ikon size={20} strokeWidth={1.5} className="text-[#1E4DD8] mb-2" />
              <p className="text-2xl font-medium text-[#1A1A17]">{m.deger}</p>
              <p className="text-xs text-[#908E86] mt-1">{m.etiket}</p>
            </div>
          ))}
        </div>

        {/* Kredi özeti + içerik türleri */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Kredi tüketimi */}
          <div className="bg-white rounded-xl border border-[#D8D6CE] p-5">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard size={16} strokeWidth={1.5} className="text-[#1E4DD8]" />
              <h2 className="text-sm font-medium text-[#5A5852]">Kredi kullanımı</h2>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#908E86]">Bu ay harcanan</span>
                <span className="text-sm font-medium text-[#1A1A17]">{buAyKredi} kredi</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#908E86]">Kalan kredi</span>
                <span className={`text-sm font-medium ${kredi <= 5 ? 'text-[#7A1E1E]' : 'text-[#0F5132]'}`}>{kredi} kredi</span>
              </div>
            </div>
            {kredi <= 5 && kredi > 0 && (
              <Link href="/fiyatlar" className="mt-3 block text-center text-xs font-medium bg-[#1E4DD8] text-white px-3 py-2 rounded-lg hover:bg-[#163B9E] transition-colors">
                Kredi satın al →
              </Link>
            )}
          </div>

          {/* İçerik türü dağılımı */}
          <div className="bg-white rounded-xl border border-[#D8D6CE] p-5">
            <div className="flex items-center gap-2 mb-3">
              <BarChart2 size={16} strokeWidth={1.5} className="text-[#1E4DD8]" />
              <h2 className="text-sm font-medium text-[#5A5852]">İçerik türleri</h2>
            </div>
            <div className="space-y-2">
              {[
                { tur: 'Listing metni', sayi: toplamUretimSayisi, Ikon: Pencil },
                { tur: 'Stüdyo görseli', sayi: 0, Ikon: ImageIcon },
                { tur: 'Ürün videosu', sayi: 0, Ikon: Video },
                { tur: 'Sosyal medya', sayi: 0, Ikon: MessageSquare },
              ].map(({ tur, sayi, Ikon }) => (
                <div key={tur} className="flex items-center gap-2">
                  <Ikon size={14} strokeWidth={1.5} className="text-[#908E86] flex-shrink-0" />
                  <span className="text-xs text-[#5A5852] flex-1">{tur}</span>
                  <span className="text-xs font-medium text-[#1A1A17]">{sayi}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Haftalık trend */}
        {toplamUretimSayisi > 0 && (
          <div className="bg-white rounded-xl border border-[#D8D6CE] p-5 mb-6">
            <h2 className="text-sm font-medium text-[#5A5852] mb-4">Haftalık üretim trendi (son 12 hafta)</h2>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={haftalikTrend} barSize={10} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis
                  dataKey="hafta"
                  tick={{ fontSize: 10, fill: '#908E86' }}
                  tickLine={false}
                  axisLine={false}
                  interval={2}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 10, fill: '#908E86' }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{ border: '1px solid #D8D6CE', borderRadius: 8, fontSize: 12, color: '#1A1A17' }}
                  cursor={{ fill: '#F1F0EB' }}
                  formatter={(value) => [value as number, 'üretim']}
                />
                <Bar dataKey="sayi" radius={[3, 3, 0, 0]}>
                  {haftalikTrend.map((entry, i) => (
                    <Cell key={i} fill={entry.sayi === maxTrend && entry.sayi > 0 ? '#1E4DD8' : '#BAC9EB'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Platform dağılımı */}
        {toplamUretimSayisi > 0 && Object.keys(platformSayac).length > 0 && (
          <div className="bg-white rounded-xl border border-[#D8D6CE] p-5 mb-6">
            <h2 className="text-sm font-medium text-[#5A5852] mb-3">Platform dağılımı</h2>
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
              <h2 className="text-sm font-medium text-[#5A5852]">Son üretimler</h2>
              <Link href="/uret" className="text-xs text-[#1E4DD8] hover:underline">Yeni üretim →</Link>
            </div>
            <div className="divide-y divide-[#F1F0EB]">
              {sonUretimler.map((u) => {
                const GirisIkon = u.giris_tipi === 'fotograf' ? ImageIcon : u.giris_tipi === 'barkod' ? Camera : Pencil
                return (
                  <div key={u.id} className="px-5 py-3 flex items-center gap-3">
                    <GirisIkon size={18} strokeWidth={1.5} className="text-[#908E86] flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#1A1A17] truncate">{u.urun_adi || 'İsimsiz üretim'}</p>
                      <p className="text-xs text-[#908E86]">{PLATFORM_ETIKET[u.platform] ?? u.platform}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs text-[#D8D6CE]">
                        {new Date(u.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}
                      </p>
                      <p className="text-xs text-[#908E86]">1 kredi</p>
                    </div>
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
