'use client'

import { useState, useMemo, useDeferredValue, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useInfiniteQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import {
  FileText,
  Search,
  ChevronDown,
  ChevronLeft,
  Copy,
  RefreshCw,
  Type,
  List,
  AlignLeft,
  Tag,
  AlertCircle,
  Loader2,
} from 'lucide-react'
import ChipSelector from '@/components/primitives/ChipSelector'

// ─── Tipler ──────────────────────────────────────────────────────────────────

type Uretim = {
  id: string
  urun_adi: string | null
  platform: string
  giris_tipi: string | null
  content_type: string | null
  sonuc: string | null
  created_at: string
}

type SonucBolum = { baslik: string; icerik: string }

// ─── Sabitler ────────────────────────────────────────────────────────────────

const PAGE_SIZE = 20

const PLATFORM_ETIKET: Record<string, string> = {
  trendyol: 'Trendyol',
  hepsiburada: 'Hepsiburada',
  amazon: 'Amazon TR',
  n11: 'N11',
  etsy: 'Etsy',
  amazon_usa: 'Amazon USA',
}

const PLATFORM_RENK: Record<string, string> = {
  trendyol: 'bg-rd-platform-trendyol-bg text-rd-platform-trendyol',
  hepsiburada: 'bg-rd-platform-hepsiburada-bg text-rd-platform-hepsiburada',
  amazon: 'bg-rd-platform-amazon-bg text-rd-platform-amazon',
  n11: 'bg-rd-platform-n11-bg text-rd-platform-n11',
  etsy: 'bg-rd-platform-etsy-bg text-rd-platform-etsy',
  amazon_usa: 'bg-rd-platform-amazon-bg text-rd-platform-amazon',
}

const PLATFORM_OPTIONS = [
  { id: 'tumu', label: 'Tümü' },
  { id: 'trendyol', label: 'Trendyol' },
  { id: 'hepsiburada', label: 'Hepsiburada' },
  { id: 'amazon', label: 'Amazon TR' },
  { id: 'amazon_usa', label: 'Amazon USA' },
  { id: 'n11', label: 'N11' },
  { id: 'etsy', label: 'Etsy' },
]

const TIP_OPTIONS = [
  { id: 'tumu', label: 'Tümü' },
  { id: 'metin', label: 'Metin' },
  { id: 'gorsel', label: 'Görsel', disabled: true, disabledTooltip: 'Yakında — şimdilik sadece metin geçmişi' },
  { id: 'video', label: 'Video' },
  { id: 'sosyal', label: 'Sosyal' },
]

const TARIH_OPTIONS = [
  { id: 'tumu', label: 'Tümü' },
  { id: 'bu_ay', label: 'Bu ay' },
  { id: 'gecen_ay', label: 'Geçen ay' },
  { id: 'bu_yil', label: 'Bu yıl' },
]

const SIRALAMA_OPTIONS = [
  { value: 'newest', label: 'Yeniden eskiye' },
  { value: 'oldest', label: 'Eskiden yeniye' },
  { value: 'platform', label: 'Platform' },
]

const BOLUM_IKON: Record<string, React.ElementType> = {
  Başlık: Type,
  Özellikler: List,
  Açıklama: AlignLeft,
  'Arama etiketleri': Tag,
  İçerik: FileText,
}

// ─── Yardımcı fonksiyonlar ────────────────────────────────────────────────────

function sonucuBolumle(sonuc: string): SonucBolum[] {
  if (!sonuc) return []
  const temiz = sonuc.replace(/\*\*/g, '').replace(/\*/g, '')
  const bolumler: SonucBolum[] = []
  const baslikMatch = temiz.match(/(?:📌\s*)?(?:BAŞLIK|Başlık)[:\n]+([^\n🔹📄🏷]+)/i)
  const ozellikMatch = temiz.match(/(?:🔹\s*)?(?:ÖZELLİKLER|Özellikler)[:\n]+([\s\S]+?)(?=📄|🏷|$)/i)
  const aciklamaMatch = temiz.match(/(?:📄\s*)?(?:AÇIKLAMA|Açıklama)[:\n]+([\s\S]+?)(?=🏷|$)/i)
  const etiketMatch = temiz.match(/(?:🏷️?\s*)?(?:ETİKETLER|Etiketler)[:\n]+([\s\S]+?)$/i)
  if (baslikMatch) bolumler.push({ baslik: 'Başlık', icerik: baslikMatch[1].trim() })
  if (ozellikMatch) bolumler.push({ baslik: 'Özellikler', icerik: ozellikMatch[1].trim() })
  if (aciklamaMatch) bolumler.push({ baslik: 'Açıklama', icerik: aciklamaMatch[1].trim() })
  if (etiketMatch) bolumler.push({ baslik: 'Arama etiketleri', icerik: etiketMatch[1].trim() })
  if (bolumler.length === 0 && temiz.trim()) bolumler.push({ baslik: 'İçerik', icerik: temiz.trim() })
  return bolumler
}

function tarihFiltrele(u: Uretim, filtre: string): boolean {
  if (filtre === 'tumu') return true
  const now = new Date()
  const d = new Date(u.created_at)
  if (filtre === 'bu_ay') return d >= new Date(now.getFullYear(), now.getMonth(), 1)
  if (filtre === 'gecen_ay') {
    const start = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const end = new Date(now.getFullYear(), now.getMonth(), 1)
    return d >= start && d < end
  }
  if (filtre === 'bu_yil') return d >= new Date(now.getFullYear(), 0, 1)
  return true
}

// ─── Sayfa ───────────────────────────────────────────────────────────────────

export default function HesapUretimlerPage() {
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)

  const [platformFiltre, setPlatformFiltre] = useState('tumu')
  const [tipFiltre, setTipFiltre] = useState('tumu')
  const [tarihFiltre, setTarihFiltre] = useState('tumu')
  const [searchInput, setSearchInput] = useState('')
  const [siralama, setSiralama] = useState('newest')
  const [acikUretimId, setAcikUretimId] = useState<string | null>(null)
  const [kopyalananKey, setKopyalananKey] = useState<string | null>(null)

  const deferredSearch = useDeferredValue(searchInput)

  // Auth
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.push('/giris')
      else setUserId(user.id)
    })
  }, [router])

  // Data
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['uretimler', userId],
    queryFn: async ({ pageParam }: { pageParam: number }) => {
      if (!userId) return [] as Uretim[]
      const { data } = await supabase
        .from('uretimler')
        .select('id, urun_adi, platform, giris_tipi, content_type, sonuc, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(pageParam, pageParam + PAGE_SIZE - 1)
      return (data ?? []) as Uretim[]
    },
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === PAGE_SIZE ? allPages.flat().length : undefined,
    initialPageParam: 0,
    enabled: !!userId,
  })

  const allUretimler = data?.pages.flat() ?? []

  // Filter + sort pipeline
  const filtrelenmis = useMemo(() => {
    let list = allUretimler

    if (platformFiltre !== 'tumu') {
      list = list.filter((u) => u.platform === platformFiltre)
    }

    if (tipFiltre !== 'tumu') {
      list = list.filter((u) => (u.content_type ?? u.giris_tipi) === tipFiltre)
    }

    list = list.filter((u) => tarihFiltrele(u, tarihFiltre))

    if (deferredSearch.trim()) {
      const q = deferredSearch.trim().toLowerCase()
      list = list.filter(
        (u) =>
          (u.urun_adi ?? '').toLowerCase().includes(q) ||
          (u.sonuc ?? '').toLowerCase().includes(q)
      )
    }

    return [...list].sort((a, b) => {
      if (siralama === 'oldest')
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      if (siralama === 'platform') return a.platform.localeCompare(b.platform)
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })
  }, [allUretimler, platformFiltre, tipFiltre, tarihFiltre, deferredSearch, siralama])

  const filtreAktif =
    platformFiltre !== 'tumu' ||
    tipFiltre !== 'tumu' ||
    tarihFiltre !== 'tumu' ||
    deferredSearch.trim().length > 0

  const filtreleriTemizle = () => {
    setPlatformFiltre('tumu')
    setTipFiltre('tumu')
    setTarihFiltre('tumu')
    setSearchInput('')
  }

  const kopyala = async (key: string, icerik: string) => {
    await navigator.clipboard.writeText(icerik)
    setKopyalananKey(key)
    setTimeout(() => setKopyalananKey(null), 1800)
  }

  // Auth yükleniyor
  if (!userId) {
    return (
      <main className="min-h-screen bg-rd-neutral-50 flex items-center justify-center">
        <Loader2 size={28} className="text-rd-primary-400 animate-spin" aria-hidden="true" />
      </main>
    )
  }

  return (
    <main
      className="min-h-screen bg-rd-neutral-50 pb-16"
      aria-labelledby="uretimler-baslik"
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
              Üretimler
            </p>
            <h1
              id="uretimler-baslik"
              className="font-[family-name:var(--font-rd-display)] text-3xl md:text-4xl font-medium text-rd-neutral-900 leading-tight tracking-tight mb-1"
            >
              Tüm üretimlerin
            </h1>
            <p className="text-sm text-rd-neutral-600">
              Geçmiş üretimleri filtrele, kopyala veya yeniden üret.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {allUretimler.length > 0 && (
              <span className="text-xs font-medium text-rd-neutral-500 bg-rd-neutral-100 px-2.5 py-1 rounded-lg">
                {allUretimler.length} üretim
              </span>
            )}
            <Link
              href="/uret"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-white bg-rd-primary-700 hover:bg-rd-primary-800 px-4 py-2.5 rounded-lg transition-colors"
            >
              Yeni üretim
            </Link>
          </div>
        </div>

        {/* Filtre chip bar */}
        <div className="mb-4 space-y-3">
          <div className="flex items-start gap-3">
            <span className="text-[10px] uppercase tracking-[0.1em] font-medium text-rd-neutral-400 shrink-0 mt-2.5 w-14">
              Platform
            </span>
            <div className="flex-1 overflow-x-auto pb-1">
              <ChipSelector
                mode="single"
                options={PLATFORM_OPTIONS}
                value={platformFiltre}
                onChange={setPlatformFiltre}
                label="Platform filtrele"
              />
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-[10px] uppercase tracking-[0.1em] font-medium text-rd-neutral-400 shrink-0 mt-2.5 w-14">
              İçerik
            </span>
            <div className="flex-1">
              <ChipSelector
                mode="single"
                options={TIP_OPTIONS}
                value={tipFiltre}
                onChange={setTipFiltre}
                label="İçerik tipi filtrele"
              />
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-[10px] uppercase tracking-[0.1em] font-medium text-rd-neutral-400 shrink-0 mt-2.5 w-14">
              Tarih
            </span>
            <div className="flex-1">
              <ChipSelector
                mode="single"
                options={TARIH_OPTIONS}
                value={tarihFiltre}
                onChange={setTarihFiltre}
                label="Tarih filtrele"
              />
            </div>
          </div>
        </div>

        {/* Arama + sıralama */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
          <div className="relative flex-1 sm:max-w-sm">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-rd-neutral-400 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Ürün adı veya başlık ara..."
              aria-label="Üretim ara"
              className="w-full border border-rd-neutral-300 rounded-lg pl-9 pr-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-rd-primary-500/30 focus:border-rd-primary-500"
            />
          </div>
          <select
            value={siralama}
            onChange={(e) => setSiralama(e.target.value)}
            aria-label="Sıralama"
            className="border border-rd-neutral-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-rd-primary-500/30 focus:border-rd-primary-500 sm:w-auto w-full"
          >
            {SIRALAMA_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          {filtreAktif && (
            <button
              onClick={filtreleriTemizle}
              className="text-sm text-rd-primary-700 hover:text-rd-primary-900 font-medium shrink-0"
            >
              Filtreleri temizle
            </button>
          )}
        </div>

        {/* ── İçerik ──────────────────────────────────────────────────────── */}

        {isLoading ? (
          <div className="space-y-2" aria-label="Üretimler yükleniyor">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-rd-neutral-200 p-4 animate-pulse"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-rd-neutral-100 rounded w-3/5" />
                    <div className="h-3 bg-rd-neutral-100 rounded w-2/5" />
                  </div>
                  <div className="h-4 w-4 bg-rd-neutral-100 rounded" />
                </div>
              </div>
            ))}
          </div>

        ) : isError ? (
          <div className="bg-white rounded-xl border border-rd-neutral-200 p-10 text-center">
            <AlertCircle size={36} className="text-rd-danger-300 mx-auto mb-3" aria-hidden="true" />
            <p className="text-sm font-medium text-rd-neutral-800 mb-1">Üretimler yüklenemedi</p>
            <p className="text-xs text-rd-neutral-500 mb-4">Bağlantını kontrol et ve tekrar dene.</p>
            <button
              onClick={() => refetch()}
              className="inline-flex items-center gap-2 text-sm text-rd-primary-700 hover:text-rd-primary-900 font-medium"
            >
              <RefreshCw size={14} aria-hidden="true" />
              Tekrar dene
            </button>
          </div>

        ) : allUretimler.length === 0 ? (
          <div className="bg-white rounded-xl border border-rd-neutral-200 p-12 text-center max-w-sm mx-auto">
            <FileText
              size={40}
              strokeWidth={1.5}
              className="text-rd-neutral-300 mx-auto mb-3"
              aria-hidden="true"
            />
            <h3 className="font-medium text-rd-neutral-900 mb-1">Henüz üretim yapmadın</h3>
            <p className="text-sm text-rd-neutral-500 mb-5">
              İlk içeriğini üret ve burada görün.
            </p>
            <Link
              href="/uret"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-white bg-rd-primary-700 hover:bg-rd-primary-800 px-5 py-2.5 rounded-lg transition-colors"
            >
              İlk üretimi yap
            </Link>
          </div>

        ) : filtrelenmis.length === 0 ? (
          <div className="bg-white rounded-xl border border-rd-neutral-200 p-10 text-center">
            <p className="text-sm font-medium text-rd-neutral-800 mb-1">
              Filtrelere uyan üretim yok
            </p>
            <button
              onClick={filtreleriTemizle}
              className="text-sm text-rd-primary-700 hover:text-rd-primary-900 font-medium mt-2"
            >
              Filtreleri temizle
            </button>
          </div>

        ) : (
          <>
            <ul role="list" className="space-y-2">
              {filtrelenmis.map((u) => {
                const acik = acikUretimId === u.id
                const bolumler = sonucuBolumle(u.sonuc ?? '')
                const platformEtiket = PLATFORM_ETIKET[u.platform] ?? u.platform
                const platformRenk =
                  PLATFORM_RENK[u.platform] ?? 'bg-rd-neutral-100 text-rd-neutral-600'
                const detayId = `uretim-detay-${u.id}`
                const icerikTip = u.content_type ?? u.giris_tipi
                const yenidenUretHref = `/uret?onceki=${u.id}&platform=${u.platform}&tip=${icerikTip ?? ''}`

                return (
                  <li key={u.id} role="listitem">
                    <div
                      className={`rounded-xl border overflow-hidden transition-colors ${
                        acik
                          ? 'border-rd-primary-200'
                          : 'border-rd-neutral-200 bg-white'
                      }`}
                    >
                      {/* Accordion buton */}
                      <button
                        type="button"
                        onClick={() => setAcikUretimId(acik ? null : u.id)}
                        aria-expanded={acik}
                        aria-controls={detayId}
                        className={`w-full text-left p-4 flex items-start justify-between gap-3 hover:bg-rd-neutral-50 transition-colors ${
                          acik ? 'bg-rd-primary-50/40' : 'bg-white'
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-rd-neutral-900 truncate mb-1.5">
                            {u.urun_adi || 'İsimsiz ürün'}
                          </p>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`text-xs px-2 py-0.5 rounded-md font-medium ${platformRenk}`}
                            >
                              {platformEtiket}
                            </span>
                            <span className="text-xs text-rd-neutral-400">
                              {new Date(u.created_at).toLocaleDateString('tr-TR', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                              })}
                            </span>
                          </div>
                        </div>
                        <ChevronDown
                          size={16}
                          className={`text-rd-neutral-400 shrink-0 mt-0.5 transition-transform duration-200 ${
                            acik ? 'rotate-180' : ''
                          }`}
                          aria-hidden="true"
                        />
                      </button>

                      {/* Accordion içerik */}
                      {acik && (
                        <div
                          id={detayId}
                          role="region"
                          className="border-t border-rd-primary-100 px-4 pb-4 pt-3 space-y-2 bg-rd-primary-50/20"
                        >
                          {bolumler.length > 0 ? (
                            bolumler.map((bolum, bi) => {
                              const BolumIkon = BOLUM_IKON[bolum.baslik] ?? FileText
                              const bolumKey = `${u.id}-${bi}`
                              return (
                                <div
                                  key={bi}
                                  className="bg-white rounded-lg border border-rd-neutral-200 p-4"
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-1.5">
                                      <BolumIkon
                                        size={14}
                                        className="text-rd-neutral-500"
                                        aria-hidden="true"
                                      />
                                      <span className="text-sm font-medium text-rd-neutral-800">
                                        {bolum.baslik}
                                      </span>
                                    </div>
                                    <button
                                      onClick={() => kopyala(bolumKey, bolum.icerik)}
                                      className="text-xs font-medium px-2 py-1 rounded-lg transition-colors text-rd-primary-700 hover:bg-rd-primary-50"
                                      aria-label={`${bolum.baslik} içeriğini kopyala`}
                                    >
                                      {kopyalananKey === bolumKey ? (
                                        <span className="text-rd-success-700">Kopyalandı</span>
                                      ) : (
                                        <span className="inline-flex items-center gap-1">
                                          <Copy size={12} aria-hidden="true" />
                                          Kopyala
                                        </span>
                                      )}
                                    </button>
                                  </div>
                                  <p className="text-sm text-rd-neutral-700 leading-relaxed whitespace-pre-line">
                                    {bolum.icerik}
                                  </p>
                                </div>
                              )
                            })
                          ) : (
                            <p className="text-xs text-rd-neutral-400 italic py-2">
                              Bu üretimde içerik bulunamadı.
                            </p>
                          )}

                          {/* Boş görsel placeholder — metin üretimlerinde */}
                          {(icerikTip === 'metin' || icerikTip === null) && (
                            <div className="flex items-center justify-between gap-3 pt-1">
                              <p className="text-xs text-rd-neutral-400 italic">
                                Görsel versiyonu yok.
                              </p>
                              <Link
                                href={`/uret?onceki=${u.id}&platform=${u.platform}&tip=gorsel`}
                                className="text-xs font-medium text-rd-primary-700 hover:text-rd-primary-900 shrink-0 transition-colors"
                              >
                                Görsel üret
                              </Link>
                            </div>
                          )}

                          {/* Aksiyon buton */}
                          <div className="pt-2">
                            <Link
                              href={yenidenUretHref}
                              className="inline-flex items-center gap-1.5 text-xs font-medium text-rd-neutral-700 border border-rd-neutral-300 hover:border-rd-primary-400 hover:text-rd-primary-700 bg-white px-3 py-2 rounded-lg transition-colors"
                              aria-label={`Yeniden üret: ${u.urun_adi || 'İsimsiz ürün'}`}
                            >
                              <RefreshCw size={13} aria-hidden="true" />
                              Yeniden üret
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>

            {/* Daha fazla yükle */}
            {hasNextPage && (
              <div className="mt-4 text-center">
                <button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="inline-flex items-center justify-center gap-2 text-sm font-medium border border-rd-neutral-300 hover:bg-rd-neutral-50 bg-white px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50 w-full sm:w-auto"
                >
                  {isFetchingNextPage ? (
                    <Loader2 size={15} className="animate-spin" aria-hidden="true" />
                  ) : (
                    <ChevronDown size={15} aria-hidden="true" />
                  )}
                  {isFetchingNextPage ? 'Yükleniyor…' : 'Daha fazla yükle'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}
