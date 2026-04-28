'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useCredits } from '@/lib/hooks/useCredits'
import { useCurrentUser } from '@/lib/hooks/useCurrentUser'
import {
  Trophy,
  Coins,
  TrendingUp,
  Activity,
  Building2,
  User,
  FileText,
  Receipt,
  Settings,
  ChevronRight,
  Sparkles,
  Camera,
  Video,
  MessageSquare,
} from 'lucide-react'
import StatusBadge from '@/components/primitives/StatusBadge'
import InviteBox from '@/components/hesap/InviteBox'

// ─── İçerik tip kataloğu ─────────────────────────────────────────────────────

const ICERIK_TIPLERI = [
  {
    tip: 'metin',
    baslik: 'Listing metni',
    mikro: 'Pazaryeri başlık ve açıklama',
    Ikon: FileText,
    href: '/uret',
  },
  {
    tip: 'gorsel',
    baslik: 'Stüdyo görseli',
    mikro: 'Beyaz fon, profesyonel ürün görseli',
    Ikon: Camera,
    href: '/uret',
  },
  {
    tip: 'video',
    baslik: 'Ürün videosu',
    mikro: '5 sn ürün videosu, sosyal medya için',
    Ikon: Video,
    href: '/yzstudio',
  },
  {
    tip: 'sosyal',
    baslik: 'Sosyal medya kiti',
    mikro: 'Instagram ve TikTok metinleri',
    Ikon: MessageSquare,
    href: '/uret',
  },
] as const

type IcerikTip = (typeof ICERIK_TIPLERI)[number]['tip']

// ─── Sayfa ───────────────────────────────────────────────────────────────────

export default function HesapPage() {
  const router = useRouter()
  const { data: krediData, isLoading: krediYukleniyor } = useCredits()
  const { data: currentUser } = useCurrentUser()

  const [buAyUretim, setBuAyUretim] = useState<number | null>(null)
  const [toplamUretim, setToplamUretim] = useState<number | null>(null)
  const [kullaniciTipleri, setKullaniciTipleri] = useState<IcerikTip[]>([])
  const [dataYukleniyor, setDataYukleniyor] = useState(true)

  useEffect(() => {
    async function yukle() {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push('/giris')
        return
      }

      const bugun = new Date()
      const ayBaslangic = new Date(bugun.getFullYear(), bugun.getMonth(), 1).toISOString()

      const [buAyRes, toplamRes, tiplerRes] = await Promise.all([
        supabase
          .from('uretimler')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .gte('created_at', ayBaslangic),
        supabase
          .from('uretimler')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id),
        supabase
          .from('uretimler')
          .select('content_type')
          .eq('user_id', user.id)
          .not('content_type', 'is', null),
      ])

      setBuAyUretim(buAyRes.count ?? 0)
      setToplamUretim(toplamRes.count ?? 0)

      const tipler = new Set<string>()
      for (const row of tiplerRes.data ?? []) {
        if (row.content_type) tipler.add(row.content_type)
      }
      setKullaniciTipleri(Array.from(tipler) as IcerikTip[])

      setDataYukleniyor(false)
    }
    yukle()
  }, [router])

  // ─── Türetilen değerler ───────────────────────────────────────────────────

  const isAdmin = currentUser?.is_admin ?? false
  const kredi = krediYukleniyor ? null : (krediData ?? 0)
  const krediDusuk = !isAdmin && kredi !== null && kredi <= 5
  const toplamKullanilan = currentUser?.toplam_kullanilan ?? 0
  const tasarruf = toplamKullanilan * 5

  const markaEksik = !currentUser?.marka_adi

  // İlk kelime veya e-posta prefix'i
  const kullaniciAdi = currentUser?.email?.split('@')[0] ?? ''

  const denenmemisler = ICERIK_TIPLERI.filter((t) => !kullaniciTipleri.includes(t.tip))

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <main
      className="min-h-screen bg-rd-neutral-50 pb-16"
      aria-labelledby="hesap-baslik"
    >
      <div className="max-w-3xl mx-auto px-4 py-8">

        {/* ── Başlık ────────────────────────────────────────────────────── */}
        <div className="mb-6">
          <p className="text-[10px] uppercase tracking-[0.15em] font-medium text-rd-primary-700 mb-1">
            Hesabım
          </p>
          <h1
            id="hesap-baslik"
            className="font-[family-name:var(--font-rd-display)] text-3xl md:text-4xl font-medium text-rd-neutral-900 leading-tight tracking-tight mb-1"
          >
            Hoş geldin{kullaniciAdi ? `, ${kullaniciAdi}` : ''}
          </h1>
          <p className="text-sm text-rd-neutral-600">
            Hesap durumun ve sıradaki adımların.
          </p>
        </div>

        {/* ── Tasarruf rozeti ───────────────────────────────────────────── */}
        <div className="bg-gradient-to-br from-rd-warm-50 to-rd-warm-100 border border-rd-warm-200 rounded-xl p-5 md:p-6 mb-6">
          {tasarruf > 0 ? (
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-4 flex-1">
                <div className="bg-rd-warm-200/60 rounded-xl p-3 shrink-0">
                  <Trophy size={28} className="text-rd-warm-700" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.15em] font-medium text-rd-warm-600 mb-0.5">
                    Tasarruf
                  </p>
                  <p className="font-[family-name:var(--font-rd-display)] text-3xl font-medium text-rd-warm-900">
                    ₺{tasarruf.toLocaleString('tr-TR')}
                  </p>
                </div>
              </div>
              <p className="text-sm text-rd-warm-700 sm:text-right sm:max-w-[180px] leading-relaxed">
                yzliste ile birlikte tasarruf ettin
              </p>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-4 flex-1">
                <div className="bg-rd-warm-200/60 rounded-xl p-3 shrink-0">
                  <Trophy size={28} className="text-rd-warm-700" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.15em] font-medium text-rd-warm-600 mb-0.5">
                    Tasarruf
                  </p>
                  <p className="font-[family-name:var(--font-rd-display)] text-2xl font-medium text-rd-warm-900">
                    İlk üretimini yap
                  </p>
                  <p className="text-sm text-rd-warm-700 mt-0.5">
                    Tasarruf etmeye başla
                  </p>
                </div>
              </div>
              <Link
                href="/uret"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-rd-warm-700 border border-rd-warm-300 hover:border-rd-warm-400 bg-white/60 hover:bg-white/80 px-4 py-2.5 rounded-lg transition-colors shrink-0"
              >
                Üretmeye başla
                <ChevronRight size={14} aria-hidden="true" />
              </Link>
            </div>
          )}
        </div>

        {/* ── 3 KPI grid ───────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

          {/* Kalan kredi */}
          <Link
            href="/kredi-yukle"
            className={`rounded-xl border p-5 flex flex-col gap-2 hover:-translate-y-0.5 transition-all group ${
              krediDusuk
                ? 'border-rd-danger-300 bg-rd-danger-50'
                : 'border-rd-neutral-200 bg-white'
            }`}
            aria-label={`Krediler — kalan: ${isAdmin ? '∞' : (kredi ?? '—')}`}
          >
            <div className="flex items-center justify-between">
              <Coins
                size={24}
                className={krediDusuk ? 'text-rd-danger-700' : 'text-rd-primary-700'}
                aria-hidden="true"
              />
              <ChevronRight
                size={16}
                className="text-rd-neutral-400 group-hover:text-rd-neutral-600 transition-colors"
                aria-hidden="true"
              />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.1em] font-medium text-rd-neutral-400 mb-0.5">
                Kalan kredi
              </p>
              <p
                className={`font-[family-name:var(--font-rd-display)] text-2xl font-medium ${
                  krediDusuk ? 'text-rd-danger-800' : 'text-rd-neutral-900'
                }`}
              >
                {isAdmin ? '∞' : kredi === null ? '—' : kredi}
              </p>
            </div>
          </Link>

          {/* Bu ay üretim */}
          <Link
            href="/hesap/uretimler"
            className="rounded-xl border border-rd-neutral-200 bg-white p-5 flex flex-col gap-2 hover:-translate-y-0.5 transition-all group"
            aria-label={`Bu ay üretim — ${buAyUretim ?? '—'}`}
          >
            <div className="flex items-center justify-between">
              <TrendingUp size={24} className="text-rd-primary-700" aria-hidden="true" />
              <ChevronRight
                size={16}
                className="text-rd-neutral-400 group-hover:text-rd-neutral-600 transition-colors"
                aria-hidden="true"
              />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.1em] font-medium text-rd-neutral-400 mb-0.5">
                Bu ay
              </p>
              <p className="font-[family-name:var(--font-rd-display)] text-2xl font-medium text-rd-neutral-900">
                {dataYukleniyor ? '—' : (buAyUretim ?? '—')}
              </p>
            </div>
          </Link>

          {/* Toplam üretim */}
          <Link
            href="/hesap/uretimler"
            className="rounded-xl border border-rd-neutral-200 bg-white p-5 flex flex-col gap-2 hover:-translate-y-0.5 transition-all group"
            aria-label={`Toplam üretim — ${toplamUretim ?? '—'}`}
          >
            <div className="flex items-center justify-between">
              <Activity size={24} className="text-rd-primary-700" aria-hidden="true" />
              <ChevronRight
                size={16}
                className="text-rd-neutral-400 group-hover:text-rd-neutral-600 transition-colors"
                aria-hidden="true"
              />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.1em] font-medium text-rd-neutral-400 mb-0.5">
                Toplam
              </p>
              <p className="font-[family-name:var(--font-rd-display)] text-2xl font-medium text-rd-neutral-900">
                {dataYukleniyor ? '—' : (toplamUretim ?? '—')}
              </p>
            </div>
          </Link>
        </div>

        {/* ── Hesap menü ────────────────────────────────────────────────── */}
        <h2 className="font-[family-name:var(--font-rd-display)] text-xl md:text-2xl font-medium text-rd-neutral-900 mb-4">
          Hesap menün
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">

          {/* Marka profili */}
          <Link
            href="/hesap/marka"
            className={`rounded-xl border bg-white p-5 hover:-translate-y-0.5 transition-all group flex flex-col ${
              markaEksik ? 'border-rd-warm-300' : 'border-rd-neutral-200 hover:border-rd-primary-300'
            }`}
            aria-label={`Marka profili${markaEksik ? ' — eksik bilgi var' : ''}`}
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <Building2 size={24} className="text-rd-primary-700" aria-hidden="true" />
              <div className="flex items-center gap-2">
                {markaEksik && <StatusBadge status="preparing" label="Eksik" />}
                <ChevronRight
                  size={16}
                  className="text-rd-neutral-400 group-hover:text-rd-neutral-600 transition-colors"
                  aria-hidden="true"
                />
              </div>
            </div>
            <p className="font-medium text-rd-neutral-900 mb-1">Marka profili</p>
            <p className="text-sm text-rd-neutral-600">AI metinlerini kişiselleştir.</p>
          </Link>

          {/* Profil */}
          <Link
            href="/hesap/profil"
            className="rounded-xl border border-rd-neutral-200 bg-white p-5 hover:border-rd-primary-300 hover:-translate-y-0.5 transition-all group flex flex-col"
            aria-label="Profil — kişisel ve fatura bilgilerin"
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <User size={24} className="text-rd-primary-700" aria-hidden="true" />
              <ChevronRight
                size={16}
                className="text-rd-neutral-400 group-hover:text-rd-neutral-600 transition-colors"
                aria-hidden="true"
              />
            </div>
            <p className="font-medium text-rd-neutral-900 mb-1">Profil</p>
            <p className="text-sm text-rd-neutral-600">Kişisel ve fatura bilgilerin.</p>
          </Link>

          {/* Üretimler */}
          <Link
            href="/hesap/uretimler"
            className="rounded-xl border border-rd-neutral-200 bg-white p-5 hover:border-rd-primary-300 hover:-translate-y-0.5 transition-all group flex flex-col"
            aria-label="Üretimler — geçmiş üretimlerini gör"
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <FileText size={24} className="text-rd-primary-700" aria-hidden="true" />
              <ChevronRight
                size={16}
                className="text-rd-neutral-400 group-hover:text-rd-neutral-600 transition-colors"
                aria-hidden="true"
              />
            </div>
            <p className="font-medium text-rd-neutral-900 mb-1">Üretimler</p>
            <p className="text-sm text-rd-neutral-600">Geçmiş üretimlerini gör.</p>
          </Link>

          {/* Krediler */}
          <Link
            href="/hesap/krediler"
            className={`rounded-xl border bg-white p-5 hover:-translate-y-0.5 transition-all group flex flex-col ${
              krediDusuk
                ? 'border-rd-danger-300'
                : 'border-rd-neutral-200 hover:border-rd-primary-300'
            }`}
            aria-label={`Krediler — kredi geçmişin ve paketler${krediDusuk ? ', düşük kredi uyarısı' : ''}`}
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <Coins size={24} className="text-rd-primary-700" aria-hidden="true" />
              <div className="flex items-center gap-2">
                {krediDusuk && <StatusBadge status="error" label="Düşük" />}
                <ChevronRight
                  size={16}
                  className="text-rd-neutral-400 group-hover:text-rd-neutral-600 transition-colors"
                  aria-hidden="true"
                />
              </div>
            </div>
            <p className="font-medium text-rd-neutral-900 mb-1">Krediler</p>
            <p className="text-sm text-rd-neutral-600">Kredi geçmişin ve paketler.</p>
          </Link>

          {/* Faturalar */}
          <Link
            href="/hesap/faturalar"
            className="rounded-xl border border-rd-neutral-200 bg-white p-5 hover:border-rd-primary-300 hover:-translate-y-0.5 transition-all group flex flex-col"
            aria-label="Faturalar — ödeme geçmişin"
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <Receipt size={24} className="text-rd-primary-700" aria-hidden="true" />
              <ChevronRight
                size={16}
                className="text-rd-neutral-400 group-hover:text-rd-neutral-600 transition-colors"
                aria-hidden="true"
              />
            </div>
            <p className="font-medium text-rd-neutral-900 mb-1">Faturalar</p>
            <p className="text-sm text-rd-neutral-600">Ödeme geçmişin.</p>
          </Link>

          {/* Ayarlar */}
          <Link
            href="/hesap/ayarlar"
            className="rounded-xl border border-rd-neutral-200 bg-white p-5 hover:border-rd-primary-300 hover:-translate-y-0.5 transition-all group flex flex-col"
            aria-label="Ayarlar — şifre, e-posta, hesap silme"
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <Settings size={24} className="text-rd-primary-700" aria-hidden="true" />
              <ChevronRight
                size={16}
                className="text-rd-neutral-400 group-hover:text-rd-neutral-600 transition-colors"
                aria-hidden="true"
              />
            </div>
            <p className="font-medium text-rd-neutral-900 mb-1">Ayarlar</p>
            <p className="text-sm text-rd-neutral-600">Şifre, e-posta, hesap silme.</p>
          </Link>
        </div>

        {/* ── Henüz denemediğin ─────────────────────────────────────────── */}
        {!dataYukleniyor && denenmemisler.length > 0 && (
          <section className="mb-8" aria-label="Henüz denemediğin özellikler">
            <h2 className="font-[family-name:var(--font-rd-display)] text-xl font-medium text-rd-neutral-900 mb-4">
              Henüz denemediğin
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {denenmemisler.map(({ tip, baslik, mikro, Ikon, href }) => (
                <Link
                  key={tip}
                  href={href}
                  className="rounded-xl bg-rd-warm-50 border border-rd-warm-200 p-4 flex items-start gap-3 hover:-translate-y-0.5 transition-all group"
                  aria-label={`${baslik} dene — ${mikro}`}
                >
                  <div className="bg-rd-warm-100 rounded-lg p-2 shrink-0 group-hover:bg-rd-warm-200 transition-colors">
                    <Sparkles size={18} className="text-rd-warm-700" aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <Ikon size={14} className="text-rd-warm-600 shrink-0" aria-hidden="true" />
                      <p className="font-medium text-rd-warm-900">{baslik}</p>
                    </div>
                    <p className="text-sm text-rd-warm-700">{mikro}</p>
                  </div>
                  <ChevronRight
                    size={16}
                    className="text-rd-warm-400 group-hover:text-rd-warm-600 transition-colors shrink-0 mt-1"
                    aria-hidden="true"
                  />
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── Davet kutusu ──────────────────────────────────────────────── */}
        {currentUser?.id && <InviteBox userId={currentUser.id} />}

      </div>
    </main>
  )
}
