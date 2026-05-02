'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useCredits } from '@/lib/hooks/useCredits'
import { useCurrentUser } from '@/lib/hooks/useCurrentUser'
import {
  Coins,
  TrendingDown,
  Calendar,
  ChevronLeft,
  ChevronDown,
  RefreshCw,
  AlertCircle,
} from 'lucide-react'
import TransactionBadge, { type IslemTuru } from '@/components/primitives/TransactionBadge'
import { KREDILER_DEMO } from '@/lib/feature-flags'

// ─── Tipler ──────────────────────────────────────────────────────────────────

interface Islem {
  id: string
  tur: IslemTuru
  miktar: number        // pozitif = eklendi, negatif = kullanıldı
  tarih: string         // ISO string
  tutar?: number        // ₺ tutarı (satın alımlarda)
  detay?: {
    paket?: string
    sebep?: string
    uretimId?: string
  }
}

// ─── Sabit veriler ────────────────────────────────────────────────────────────

const PAKET_ISIM: Record<string, string> = {
  baslangic: 'Başlangıç Paketi — 10 Kredi',
  populer: 'Popüler Paket — 30 Kredi',
  buyuk: 'Büyük Paket — 100 Kredi',
}

// ─── Mock data (KREDILER_DEMO = true) ────────────────────────────────────────

const MOCK_ISLEMLER: Islem[] = [
  {
    id: 'mk1',
    tur: 'satin_alim',
    miktar: 30,
    tarih: '2026-04-01T10:00:00Z',
    tutar: 129,
    detay: { paket: 'Popüler Paket — 30 Kredi' },
  },
  {
    id: 'mk2',
    tur: 'kullanim',
    miktar: -1,
    tarih: '2026-04-05T14:22:00Z',
    detay: { uretimId: 'mock-uretim-001' },
  },
  {
    id: 'mk3',
    tur: 'kullanim',
    miktar: -1,
    tarih: '2026-04-08T09:11:00Z',
    detay: { uretimId: 'mock-uretim-002' },
  },
  {
    id: 'mk4',
    tur: 'hediye',
    miktar: 10,
    tarih: '2026-03-15T12:00:00Z',
    detay: { sebep: 'Davet bonusu' },
  },
  {
    id: 'mk5',
    tur: 'iade',
    miktar: 5,
    tarih: '2026-03-10T16:45:00Z',
    tutar: 25,
    detay: { sebep: 'Hatalı çekim iadesi' },
  },
  {
    id: 'mk6',
    tur: 'satin_alim',
    miktar: 10,
    tarih: '2026-02-20T08:30:00Z',
    tutar: 49,
    detay: { paket: 'Başlangıç Paketi — 10 Kredi' },
  },
]

// ─── Tarih yardımcıları ───────────────────────────────────────────────────────

function ayBaslangici(yillik: number, ay: number): Date {
  return new Date(yillik, ay, 1)
}

// ─── Sayfa ───────────────────────────────────────────────────────────────────

export default function KredilerPage() {
  const router = useRouter()
  const { data: krediData, isLoading: krediYukleniyor } = useCredits()
  const { data: currentUser, isLoading: authLoading } = useCurrentUser()

  const [islemler, setIslemler] = useState<Islem[]>([])
  const [buAyTuketim, setBuAyTuketim] = useState<number | null>(null)
  const [gecenAyTuketim, setGecenAyTuketim] = useState<number | null>(null)
  const [yukleniyor, setYukleniyor] = useState(!KREDILER_DEMO)
  const [fetchHata, setFetchHata] = useState(false)
  const [aciklar, setAciklar] = useState<Set<string>>(new Set())

  const isAdmin = currentUser?.is_admin ?? false
  const kredi = krediYukleniyor ? null : (krediData ?? 0)

  // ─── Veri yükle ────────────────────────────────────────────────────────────

  const yukle = async () => {
    if (KREDILER_DEMO) {
      const bugun = new Date()
      const buAyBas = ayBaslangici(bugun.getFullYear(), bugun.getMonth())
      const gecenAyBas = ayBaslangici(
        bugun.getMonth() === 0 ? bugun.getFullYear() - 1 : bugun.getFullYear(),
        bugun.getMonth() === 0 ? 11 : bugun.getMonth() - 1
      )

      const buAy = MOCK_ISLEMLER.filter((i) => {
        const t = new Date(i.tarih)
        return i.tur === 'kullanim' && t >= buAyBas
      }).reduce((s, i) => s + Math.abs(i.miktar), 0)

      const gecenAy = MOCK_ISLEMLER.filter((i) => {
        const t = new Date(i.tarih)
        return i.tur === 'kullanim' && t >= gecenAyBas && t < buAyBas
      }).reduce((s, i) => s + Math.abs(i.miktar), 0)

      setIslemler(MOCK_ISLEMLER)
      setBuAyTuketim(buAy)
      setGecenAyTuketim(gecenAy)
      setYukleniyor(false)
      return
    }

    setYukleniyor(true)
    setFetchHata(false)
    try {
      if (!currentUser) {
        router.push('/giris')
        return
      }

      const bugun = new Date()
      const buAyBas = ayBaslangici(bugun.getFullYear(), bugun.getMonth())
      const gecenAyBas = ayBaslangici(
        bugun.getMonth() === 0 ? bugun.getFullYear() - 1 : bugun.getFullYear(),
        bugun.getMonth() === 0 ? 11 : bugun.getMonth() - 1
      )

      // Bu ay ve geçen ay kullanım: uretimler count (1 üretim ≈ 1 kredi)
      const [buAyRes, gecenAyRes, odemeRes] = await Promise.all([
        supabase
          .from('uretimler')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', currentUser.id)
          .gte('created_at', buAyBas.toISOString()),
        supabase
          .from('uretimler')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', currentUser.id)
          .gte('created_at', gecenAyBas.toISOString())
          .lt('created_at', buAyBas.toISOString()),
        supabase
          .from('payments')
          .select('id, paket, kredi, tutar, created_at, durum')
          .eq('user_id', currentUser.id)
          .eq('durum', 'basarili')
          .order('created_at', { ascending: false })
          .limit(50),
      ])

      setBuAyTuketim(buAyRes.count ?? 0)
      setGecenAyTuketim(gecenAyRes.count ?? 0)

      const mapped: Islem[] = (odemeRes.data ?? []).map((o) => ({
        id: o.id,
        tur: 'satin_alim' as IslemTuru,
        miktar: o.kredi,
        tarih: o.created_at,
        tutar: o.tutar ?? undefined,
        detay: { paket: PAKET_ISIM[o.paket] ?? o.paket },
      }))
      setIslemler(mapped)
    } catch {
      setFetchHata(true)
    } finally {
      setYukleniyor(false)
    }
  }

  useEffect(() => {
    if (!KREDILER_DEMO && authLoading) return
    yukle()
  }, [authLoading, currentUser]) // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Accordion ─────────────────────────────────────────────────────────────

  const toggleAcordion = (id: string) => {
    setAciklar((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  // ─── Yardımcılar ───────────────────────────────────────────────────────────

  const formatTarih = (iso: string) =>
    new Date(iso).toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })

  const miktarLabel = (islem: Islem) => {
    const abs = Math.abs(islem.miktar)
    if (islem.tur === 'kullanim') return `−${abs} kredi`
    return `+${abs} kredi`
  }

  const miktarRenk = (islem: Islem) =>
    islem.tur === 'kullanim' ? 'text-rd-neutral-500' : 'text-rd-success-700'

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <main
      className="min-h-screen bg-rd-neutral-50 pb-16"
      aria-labelledby="krediler-baslik"
    >
      <div className="max-w-3xl mx-auto px-4 py-8">

        {/* Geri */}
        <Link
          href="/hesap"
          className="inline-flex items-center gap-1 text-sm text-rd-neutral-500 hover:text-rd-neutral-800 transition-colors mb-6"
        >
          <ChevronLeft size={15} aria-hidden="true" />
          Hesap
        </Link>

        {/* Başlık + CTA */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.15em] font-medium text-rd-primary-700 mb-1">
              Krediler
            </p>
            <h1
              id="krediler-baslik"
              className="font-[family-name:var(--font-rd-display)] text-3xl md:text-4xl font-medium text-rd-neutral-900 leading-tight tracking-tight mb-1"
            >
              Kredi geçmişin
            </h1>
            <p className="text-sm text-rd-neutral-600">
              Mevcut bakiye, tüketim ve satın alma geçmişi.
            </p>
          </div>
          <Link
            href="/kredi-yukle"
            className="shrink-0 inline-flex items-center gap-1.5 text-sm font-medium text-white bg-rd-primary-700 hover:bg-rd-primary-800 px-4 py-2.5 rounded-lg transition-colors"
          >
            Kredi yükle
          </Link>
        </div>

        {/* 3 mini stat */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

          {/* Mevcut */}
          <div className="rounded-xl border border-rd-neutral-200 bg-white p-5">
            <div className="flex items-center gap-2 mb-3">
              <Coins size={20} className="text-rd-primary-700" aria-hidden="true" />
              <p className="text-xs uppercase tracking-[0.1em] font-medium text-rd-neutral-400">Mevcut</p>
            </div>
            <p className="font-[family-name:var(--font-rd-display)] text-3xl font-medium text-rd-neutral-900">
              {isAdmin ? '∞' : kredi === null ? '—' : kredi}
            </p>
          </div>

          {/* Bu ay tüketim */}
          <div className="rounded-xl border border-rd-neutral-200 bg-white p-5">
            <div className="flex items-center gap-2 mb-3">
              <TrendingDown size={20} className="text-rd-neutral-500" aria-hidden="true" />
              <p className="text-xs uppercase tracking-[0.1em] font-medium text-rd-neutral-400">Bu ay</p>
            </div>
            <p className="font-[family-name:var(--font-rd-display)] text-3xl font-medium text-rd-neutral-900">
              {yukleniyor ? '—' : (buAyTuketim ?? '—')}
            </p>
          </div>

          {/* Geçen ay tüketim */}
          <div className="rounded-xl border border-rd-neutral-200 bg-white p-5">
            <div className="flex items-center gap-2 mb-3">
              <Calendar size={20} className="text-rd-neutral-500" aria-hidden="true" />
              <p className="text-xs uppercase tracking-[0.1em] font-medium text-rd-neutral-400">Geçen ay</p>
            </div>
            <p className="font-[family-name:var(--font-rd-display)] text-3xl font-medium text-rd-neutral-900">
              {yukleniyor ? '—' : (gecenAyTuketim ?? '—')}
            </p>
          </div>
        </div>

        {/* İşlem geçmişi başlık */}
        <h2 className="font-[family-name:var(--font-rd-display)] text-xl font-medium text-rd-neutral-900 mb-4">
          İşlem geçmişin
        </h2>

        {/* İçerik */}
        {yukleniyor ? (
          <div className="space-y-2" aria-label="İşlemler yükleniyor">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="rounded-lg border border-rd-neutral-200 bg-white p-4 animate-pulse"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="h-5 w-20 bg-rd-neutral-100 rounded" />
                    <div className="h-4 w-16 bg-rd-neutral-100 rounded" />
                  </div>
                  <div className="h-4 w-12 bg-rd-neutral-100 rounded" />
                </div>
              </div>
            ))}
          </div>

        ) : fetchHata ? (
          <div className="bg-white rounded-xl border border-rd-neutral-200 p-10 text-center">
            <AlertCircle size={36} className="text-rd-danger-300 mx-auto mb-3" aria-hidden="true" />
            <p className="text-sm font-medium text-rd-neutral-800 mb-1">İşlemler yüklenemedi</p>
            <p className="text-xs text-rd-neutral-500 mb-4">Bağlantını kontrol et ve tekrar dene.</p>
            <button
              onClick={yukle}
              className="inline-flex items-center gap-2 text-sm text-rd-primary-700 hover:text-rd-primary-900 font-medium"
            >
              <RefreshCw size={14} aria-hidden="true" />
              Tekrar dene
            </button>
          </div>

        ) : islemler.length === 0 ? (
          <div className="bg-white rounded-xl border border-rd-neutral-200 p-12 text-center max-w-sm mx-auto">
            <Coins size={40} strokeWidth={1.5} className="text-rd-neutral-300 mx-auto mb-3" aria-hidden="true" />
            <h3 className="font-medium text-rd-neutral-900 mb-1">
              {(kredi ?? 0) === 0 ? 'Hoş geldin!' : 'Henüz işlem yok'}
            </h3>
            <p className="text-sm text-rd-neutral-500 mb-5">
              {(kredi ?? 0) === 0
                ? 'Bu sayfada kredi hareketlerin görünür.'
                : 'İlk paketini aldığında burada görünecek.'}
            </p>
            <Link
              href="/kredi-yukle"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-white bg-rd-primary-700 hover:bg-rd-primary-800 px-5 py-2.5 rounded-lg transition-colors"
            >
              İlk paketini al
            </Link>
          </div>

        ) : (
          <ul role="list" className="space-y-2">
            {islemler.map((islem) => {
              const acik = aciklar.has(islem.id)
              const detayId = `islem-detay-${islem.id}`
              const tarihStr = formatTarih(islem.tarih)

              return (
                <li key={islem.id} role="listitem">
                  <div className="rounded-lg border border-rd-neutral-200 bg-white overflow-hidden">

                    {/* Satır */}
                    <button
                      type="button"
                      onClick={() => toggleAcordion(islem.id)}
                      aria-expanded={acik}
                      aria-controls={detayId}
                      className="w-full flex items-center justify-between gap-4 p-4 text-left hover:bg-rd-neutral-50 transition-colors"
                    >
                      {/* Sol: badge + miktar + tarih */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 min-w-0">
                        <TransactionBadge tur={islem.tur} />
                        <span className={`text-sm font-medium ${miktarRenk(islem)}`}>
                          {miktarLabel(islem)}
                        </span>
                        <span className="text-xs text-rd-neutral-400">{tarihStr}</span>
                      </div>

                      {/* Sağ: tutar + chevron */}
                      <div className="flex items-center gap-3 shrink-0">
                        {islem.tutar !== undefined && (
                          <span className="text-sm text-rd-neutral-700 font-medium">
                            ₺{islem.tutar.toLocaleString('tr-TR')}
                          </span>
                        )}
                        <ChevronDown
                          size={16}
                          className={`text-rd-neutral-400 transition-transform duration-200 ${acik ? 'rotate-180' : ''}`}
                          aria-hidden="true"
                        />
                      </div>
                    </button>

                    {/* Detay accordion */}
                    {acik && (
                      <div
                        id={detayId}
                        role="region"
                        className="border-t border-rd-neutral-100 bg-rd-neutral-50 px-4 py-3"
                      >
                        <DetailContent islem={islem} />
                      </div>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        )}

        {/* Faturalar linki */}
        {!yukleniyor && !fetchHata && islemler.length > 0 && (
          <p className="text-xs text-rd-neutral-400 text-center mt-6">
            e-Arşiv faturalarına{' '}
            <Link href="/hesap/faturalar" className="text-rd-primary-700 hover:underline">
              faturalar sayfasından
            </Link>{' '}
            ulaşabilirsin.
          </p>
        )}

      </div>
    </main>
  )
}

// ─── Detay içerik bileşeni ────────────────────────────────────────────────────

function DetailContent({ islem }: { islem: Islem }) {
  const { detay, tur } = islem

  if (!detay) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[KredilerPage] Detay yok: işlem ${islem.id}`)
    }
    return <p className="text-xs text-rd-neutral-500 italic">Detay bilgisi yok.</p>
  }

  if (tur === 'satin_alim') {
    return (
      <dl className="space-y-1">
        {detay.paket && (
          <div className="flex gap-2 text-xs">
            <dt className="text-rd-neutral-400 w-24 shrink-0">Paket</dt>
            <dd className="text-rd-neutral-700">{detay.paket}</dd>
          </div>
        )}
        <div className="flex gap-2 text-xs">
          <dt className="text-rd-neutral-400 w-24 shrink-0">Fatura</dt>
          <dd>
            <Link
              href="/hesap/faturalar"
              className="text-rd-primary-700 hover:underline"
            >
              Faturalar sayfasına git
            </Link>
          </dd>
        </div>
      </dl>
    )
  }

  if (tur === 'hediye' || tur === 'iade') {
    return (
      <dl className="space-y-1">
        {detay.sebep && (
          <div className="flex gap-2 text-xs">
            <dt className="text-rd-neutral-400 w-24 shrink-0">Sebep</dt>
            <dd className="text-rd-neutral-700">{detay.sebep}</dd>
          </div>
        )}
        {!detay.sebep && (
          <p className="text-xs text-rd-neutral-500 italic">Detay bilgisi yok.</p>
        )}
      </dl>
    )
  }

  if (tur === 'kullanim') {
    return (
      <dl className="space-y-1">
        {detay.uretimId ? (
          <div className="flex gap-2 text-xs">
            <dt className="text-rd-neutral-400 w-24 shrink-0">Üretim</dt>
            <dd>
              <Link
                href={`/hesap/uretimler`}
                className="text-rd-primary-700 hover:underline"
              >
                Üretim geçmişine git
              </Link>
            </dd>
          </div>
        ) : (
          <p className="text-xs text-rd-neutral-500 italic">Detay bilgisi yok.</p>
        )}
      </dl>
    )
  }

  return null
}
