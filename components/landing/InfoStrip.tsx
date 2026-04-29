'use client'

import { useState, useEffect, useRef } from 'react'
import { FileText, Image as ImageIcon, Video, MessageSquare, ChevronDown, RotateCw, ZoomIn, Lightbulb, Leaf, ScanSearch, Wind, Check, X, Tag, Hash, Camera, Timer, Film, Columns2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { EXAMPLE_CONTENT, EXAMPLE_CONTENT_TR } from '@/lib/data/exampleContent'

type TabId = 'metin' | 'gorsel' | 'video' | 'sosyal'
type MarketId = 'trendyol' | 'amazon' | 'etsy'

const TABS = [
  {
    id: 'metin' as TabId,
    label: 'Metin',
    icon: FileText,
    kredi: '1 kredi',
    sure: '~10sn',
    description: 'Listing başlık + açıklama + arama etiketleri',
  },
  {
    id: 'gorsel' as TabId,
    label: 'Görsel',
    icon: ImageIcon,
    kredi: '1 kredi',
    sure: '~30sn',
    description: 'Stüdyo standardı 1200×1200, 6 görsel',
  },
  {
    id: 'video' as TabId,
    label: 'Video',
    icon: Video,
    kredi: '2 kredi',
    sure: '~2dk',
    description: '5 saniyelik dikey 9:16',
  },
  {
    id: 'sosyal' as TabId,
    label: 'Sosyal',
    icon: MessageSquare,
    kredi: '3 kredi',
    sure: '~20sn',
    description: 'Instagram + TikTok + Pinterest caption',
  },
]

const MARKETS: { id: MarketId; label: string }[] = [
  { id: 'trendyol', label: 'Trendyol' },
  { id: 'amazon', label: 'Amazon TR' },
  { id: 'etsy', label: 'Etsy' },
]

// ---- KopyalaButon ----

function KopyalaButon({ metin }: { metin: string }) {
  const [kopyalandi, setKopyalandi] = useState(false)
  const handle = () => {
    navigator.clipboard.writeText(metin).then(() => {
      setKopyalandi(true)
      setTimeout(() => setKopyalandi(false), 1800)
    })
  }
  return (
    <button
      type="button"
      onClick={handle}
      className={cn(
        'text-xs px-2 py-0.5 rounded-lg transition-colors shrink-0 flex items-center gap-1',
        kopyalandi
          ? 'bg-rd-success-50 border border-rd-success-200 text-rd-success-700'
          : 'bg-white border border-rd-neutral-200 text-rd-neutral-500 hover:text-rd-neutral-800',
      )}
    >
      {kopyalandi && <Check size={11} strokeWidth={2} />}
      {kopyalandi ? 'Kopyalandı' : 'Kopyala'}
    </button>
  )
}

// ---- MetinPanel data ----

const platformVerileriInfoStrip: Record<MarketId, {
  etiket: string
  aciklamaKisa: string
  bolumler: { ikon: string; baslik: string; icerik: string; renk: string }[]
}> = {
  trendyol: {
    etiket: 'Trendyol',
    aciklamaKisa: 'Max 100 karakter başlık · Türkçe · Keyword-yoğun',
    bolumler: [
      { ikon: 'pin', baslik: 'Başlık', icerik: EXAMPLE_CONTENT_TR.metin.trendyol.title, renk: 'border-l-orange-400' },
      { ikon: 'bullet', baslik: 'Özellikler', icerik: EXAMPLE_CONTENT_TR.metin.trendyol.features.join('\n'), renk: 'border-l-orange-400' },
      { ikon: 'filetext', baslik: 'Açıklama', icerik: EXAMPLE_CONTENT_TR.metin.trendyol.description, renk: 'border-l-rd-success-700' },
      { ikon: 'bookmark', baslik: 'Arama Etiketleri', icerik: EXAMPLE_CONTENT_TR.metin.trendyol.tags.join(', '), renk: 'border-l-rd-primary-300' },
    ],
  },
  amazon: {
    etiket: 'Amazon TR',
    aciklamaKisa: 'Max 200 karakter başlık · Keyword-stuffed · A+ bullet\'lar',
    bolumler: [
      { ikon: 'pin', baslik: 'Başlık', icerik: EXAMPLE_CONTENT_TR.metin.amazon.title, renk: 'border-l-[#E47911]' },
      { ikon: 'bullet', baslik: 'Özellikler', icerik: EXAMPLE_CONTENT_TR.metin.amazon.features.join('\n'), renk: 'border-l-[#E47911]' },
      { ikon: 'filetext', baslik: 'Açıklama', icerik: EXAMPLE_CONTENT_TR.metin.amazon.description, renk: 'border-l-rd-success-700' },
      { ikon: 'bookmark', baslik: 'Arama Etiketleri', icerik: EXAMPLE_CONTENT_TR.metin.amazon.tags.join(', '), renk: 'border-l-rd-primary-300' },
    ],
  },
  etsy: {
    etiket: 'Etsy',
    aciklamaKisa: 'İngilizce · Hikaye anlatımı · Handmade & artisan vurgusu',
    bolumler: [
      { ikon: 'pin', baslik: 'Title', icerik: EXAMPLE_CONTENT_TR.metin.etsy.title, renk: 'border-l-rose-400' },
      { ikon: 'bullet', baslik: 'Features', icerik: EXAMPLE_CONTENT_TR.metin.etsy.features.join('\n'), renk: 'border-l-rose-400' },
      { ikon: 'filetext', baslik: 'Description', icerik: EXAMPLE_CONTENT_TR.metin.etsy.description, renk: 'border-l-rd-success-700' },
      { ikon: 'bookmark', baslik: 'Tags', icerik: EXAMPLE_CONTENT_TR.metin.etsy.tags.join(', '), renk: 'border-l-rd-primary-300' },
    ],
  },
}

function BolumIkon({ ikon }: { ikon: string }) {
  if (ikon === 'pin') return <Tag size={14} strokeWidth={1.5} className="text-rd-neutral-600 flex-shrink-0" />
  if (ikon === 'bookmark') return <Hash size={14} strokeWidth={1.5} className="text-rd-neutral-600 flex-shrink-0" />
  if (ikon === 'filetext') return <FileText size={14} strokeWidth={1.5} className="text-rd-neutral-600 flex-shrink-0" />
  return <span className="w-2 h-2 rounded-full bg-rd-neutral-200 flex-shrink-0 mt-1" />
}

// ---- Panels ----

function MetinPanel({ market, setMarket }: { market: MarketId; setMarket: (m: MarketId) => void }) {
  const renkMap: Record<MarketId, string> = {
    trendyol: market === 'trendyol' ? 'bg-orange-500 text-white' : 'bg-rd-neutral-100 text-rd-neutral-600 hover:bg-rd-neutral-200',
    amazon: market === 'amazon' ? 'bg-[#E47911] text-white' : 'bg-rd-neutral-100 text-rd-neutral-600 hover:bg-rd-neutral-200',
    etsy: market === 'etsy' ? 'bg-rose-500 text-white' : 'bg-rd-neutral-100 text-rd-neutral-600 hover:bg-rd-neutral-200',
  }
  return (
    <div>
      <p className="text-sm text-rd-neutral-600 mb-4 leading-relaxed">
        Her pazaryerinin kendine özel karakter limiti, format kuralları ve yasaklı kelimeleri var.
        yzliste bunları bilir — platforma özel başlık, madde madde özellikler, SEO uyumlu açıklama
        ve arama etiketleri üretir.
      </p>
      <div className="flex gap-2 mb-1">
        {(Object.keys(platformVerileriInfoStrip) as MarketId[]).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setMarket(key)}
            className={cn('px-3 py-1.5 rounded-full text-xs font-medium transition-colors', renkMap[key])}
          >
            {platformVerileriInfoStrip[key].etiket}
          </button>
        ))}
      </div>
      <p className="text-xs text-rd-neutral-500 mb-4">{platformVerileriInfoStrip[market].aciklamaKisa}</p>
      <div className="space-y-3">
        {platformVerileriInfoStrip[market].bolumler.map((bolum, i) => (
          <div key={i} className={cn('rounded-xl border-l-4', bolum.renk, 'border border-rd-neutral-200 bg-rd-neutral-50 p-4')}>
            <div className="flex items-center justify-between mb-2">
              <span className="flex items-center gap-1.5 text-sm font-semibold text-rd-neutral-900">
                <BolumIkon ikon={bolum.ikon} />
                {bolum.baslik}
              </span>
              <KopyalaButon metin={bolum.icerik} />
            </div>
            <p className="text-sm text-rd-neutral-600 leading-relaxed whitespace-pre-line">{bolum.icerik}</p>
          </div>
        ))}
      </div>
      <div className="mt-5 pt-4 border-t border-rd-neutral-200 flex flex-wrap gap-3 text-xs text-rd-neutral-600">
        {['Manuel metin girişi', 'Fotoğraftan otomatik analiz', 'Barkod ile ürün tanıma', '7 platform desteği'].map((f) => (
          <span key={f} className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full bg-rd-primary-50 text-rd-primary-700 flex items-center justify-center">
              <Check size={9} strokeWidth={2} />
            </span>
            {f}
          </span>
        ))}
      </div>
      <div className="mt-4 rounded-xl bg-rd-primary-50 border border-rd-primary-200 p-3 text-xs text-rd-primary-700 leading-relaxed">
        <strong className="font-semibold">Her pazaryerinin kuralları farklı:</strong> Trendyol max 100 karakter başlık ister,
        Amazon 200&apos;e kadar keyword kabul eder, Etsy İngilizce + hikaye anlatımı sever.
        yzliste hepsini tek fotoğraftan üretir.
      </div>
      <div className="mt-5 pt-4 border-t border-rd-neutral-200 text-center">
        <a href="/uret?tab=metin" className="inline-block bg-rd-primary-700 hover:bg-rd-primary-800 text-white font-medium px-6 py-3 rounded-xl text-sm transition-colors">
          Listing metni üret →
        </a>
      </div>
    </div>
  )
}

function GorselPanel() {
  return (
    <div>
      <p className="text-sm text-rd-neutral-600 mb-4 leading-relaxed">
        Tek bir ürün fotoğrafından profesyonel stüdyo görselleri oluşturun.
        Arka plan otomatik temizlenir, 7 farklı stüdyo stilinden seçin —
        ya da sahnenizi anlatın, kendi fonunuzu yükleyin.
      </p>
      <p className="text-sm font-semibold text-rd-neutral-900 mb-1">Tek fotoğraftan 7 farklı stüdyo stili</p>
      <p className="text-xs text-rd-neutral-500 mb-5">Stil başına 1 kredi · Üretimde düşer, indirme bedava</p>
      {/* 1. satır: ham + 3 stil */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="flex flex-col">
          <div className="relative rounded-xl overflow-hidden border border-rd-neutral-200 bg-rd-neutral-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/ornek_once.jpg" alt="önce" className="w-full aspect-square object-contain" loading="lazy" />
            <div className="absolute top-2 left-2">
              <span className="bg-rd-neutral-900/80 text-white text-xs px-2 py-1 rounded-full">Ham fotoğraf</span>
            </div>
          </div>
          <div className="bg-rd-danger-50 rounded-lg p-2 border border-rd-danger-200 mt-2">
            <p className="text-xs text-rd-danger-700 font-medium flex items-center gap-1">
              <X size={10} strokeWidth={2} />
              Dağınık arka plan
            </p>
          </div>
        </div>
        {[
          { src: '/ornek_beyaz.jpg', etiket: 'Beyaz zemin' },
          { src: '/ornek_koyu.jpg', etiket: 'Koyu zemin' },
          { src: '/ornek_lifestyle.jpg', etiket: 'Lifestyle' },
        ].map((item) => (
          <div key={item.etiket} className="flex flex-col">
            <div className="rounded-xl overflow-hidden border border-rd-primary-200 bg-rd-neutral-50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.src} alt={item.etiket} className="w-full aspect-square object-contain" loading="lazy" />
            </div>
            <p className="text-xs text-rd-neutral-600 font-medium text-center mt-1.5">{item.etiket}</p>
          </div>
        ))}
      </div>
      {/* 2. satır: 4 stil daha */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
        {[
          { src: '/ornek_mermer.jpg', etiket: 'Mermer' },
          { src: '/ornek_ahsap.jpg', etiket: 'Ahşap' },
          { src: '/ornek_gradient.jpg', etiket: 'Gradient' },
          { src: '/ornek_dogal.jpg', etiket: 'Doğal' },
        ].map((item) => (
          <div key={item.etiket} className="flex flex-col">
            <div className="rounded-xl overflow-hidden border border-rd-primary-200 bg-rd-neutral-50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.src} alt={item.etiket} className="w-full aspect-square object-contain" loading="lazy" />
            </div>
            <p className="text-xs text-rd-neutral-600 font-medium text-center mt-1.5">{item.etiket}</p>
          </div>
        ))}
      </div>
      <div className="mt-5 pt-4 border-t border-rd-neutral-200">
        <p className="text-xs text-rd-neutral-600 font-semibold mb-2">3 farklı yöntemle sahne oluştur:</p>
        <div className="flex flex-wrap gap-2">
          {['Hazır stiller (Beyaz, Koyu…)', 'Kendi promptunu yaz', 'Arka plan fotoğrafı ver'].map((t, i) => (
            <span key={i} className="text-xs bg-rd-primary-50 text-rd-primary-700 px-3 py-1 rounded-full border border-rd-primary-200">{i + 1}. {t}</span>
          ))}
        </div>
      </div>
      <div className="mt-5 pt-4 border-t border-rd-neutral-200 text-center">
        <a href="/uret?tab=gorsel" className="inline-block bg-rd-primary-700 hover:bg-rd-primary-800 text-white font-medium px-6 py-3 rounded-xl text-sm transition-colors">
          Stüdyo görseli üret →
        </a>
      </div>
    </div>
  )
}

const VIDEO_STILLER = [
  { icon: RotateCw, label: '360° döndür' },
  { icon: ZoomIn, label: 'Yakınlaştır' },
  { icon: Lightbulb, label: 'Dramatik ışık' },
  { icon: Leaf, label: 'Doğal ortam' },
  { icon: ScanSearch, label: 'Detay tarama' },
  { icon: Wind, label: 'Kumaş hareketi' },
]

function VideoPanel() {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = 1.5
  }, [])
  return (
    <div className="flex flex-col md:flex-row gap-4 items-start">
      <div className="w-32 md:w-40 shrink-0">
        <video
          ref={videoRef}
          src="/video-ornekler/zoom-yaklasim.mp4"
          muted
          autoPlay
          playsInline
          loop
          className="w-full rounded-lg object-cover bg-rd-neutral-200"
          style={{ aspectRatio: '9/16' }}
          aria-hidden="true"
        />
      </div>
      <div className="flex-1 space-y-2">
        {VIDEO_STILLER.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-2">
            <Icon size={14} strokeWidth={1.5} className="text-rd-neutral-400 shrink-0" aria-hidden="true" />
            <span className="text-sm text-rd-neutral-700">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function SosyalPanel() {
  const { instagram, tiktok, pinterest } = EXAMPLE_CONTENT.sosyal
  const posts = [
    { platform: 'Instagram', data: instagram },
    { platform: 'TikTok', data: tiktok },
    { platform: 'Pinterest', data: pinterest },
  ]
  return (
    <div className="space-y-3">
      {posts.map(({ platform, data }) => (
        <div
          key={platform}
          className="rounded-lg border border-rd-neutral-200 bg-white overflow-hidden"
        >
          <div className="px-3 py-2 border-b border-rd-neutral-100 bg-rd-neutral-50">
            <span className="text-xs font-medium text-rd-neutral-600">{platform}</span>
          </div>
          <div className="px-3 py-2.5">
            <p className="text-sm text-rd-neutral-700 whitespace-pre-line leading-relaxed">
              {data.caption}
            </p>
          </div>
          {data.hashtags && data.hashtags.length > 0 && (
            <div className="px-3 py-2 border-t border-rd-neutral-100">
              <div className="flex flex-wrap gap-1.5">
                {data.hashtags.slice(0, 6).map((tag, i) => (
                  <span key={i} className="text-xs text-rd-primary-700 font-medium">
                    {tag}
                  </span>
                ))}
                {data.hashtags.length > 6 && (
                  <span className="text-xs text-rd-neutral-400">
                    +{data.hashtags.length - 6}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// ---- InfoStrip ----

export function InfoStrip() {
  const [activeTab, setActiveTab] = useState<TabId>('metin')
  const [detailOpen, setDetailOpen] = useState(false)
  const [activeMarket, setActiveMarket] = useState<MarketId>('trendyol')

  const handleTabClick = (tab: TabId) => {
    setActiveTab(tab)
    if (!detailOpen) setDetailOpen(true)
  }

  const activeTabLabel = TABS.find((t) => t.id === activeTab)?.label ?? ''

  return (
    <div>
      {/* Header */}
      <div className="mb-5">
        <p className="text-xs uppercase tracking-[0.15em] text-rd-warm-700 font-semibold mb-1.5">
          İÇERİK TÜRLERİ
        </p>
        <h3 className="font-rd-display text-xl md:text-2xl text-rd-neutral-900 font-semibold">
          4 içerik türü, 7 pazaryeri için
        </h3>
        <p className="text-sm text-rd-neutral-500 mt-1.5 leading-relaxed max-w-[520px]">
          Her tür ayrı kredi · birini, birkaçını veya hepsini birden seçebilirsin. Pazaryeri
          kuralı otomatik uygulanır.
        </p>
      </div>

      {/* 4 content type tabs — always visible */}
      <div
        role="tablist"
        aria-label="İçerik türü seçimi"
        className="grid grid-cols-2 md:grid-cols-4 gap-3"
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              aria-controls="infostrip-detail"
              onClick={() => handleTabClick(tab.id)}
              className={cn(
                'flex flex-col items-start gap-2 p-3 rounded-xl border transition-all duration-200 text-left',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rd-primary-300',
                isActive
                  ? 'bg-rd-primary-50 border-2 border-rd-primary-700 text-rd-primary-700'
                  : 'border-rd-neutral-200 bg-white text-rd-neutral-600 hover:border-rd-primary-300 hover:bg-rd-neutral-50',
              )}
            >
              <Icon
                size={18}
                strokeWidth={1.5}
                aria-hidden="true"
                className={isActive ? 'text-rd-primary-700' : 'text-rd-neutral-400'}
              />
              <span
                className={cn('text-sm font-medium', isActive ? 'text-rd-primary-700' : 'text-rd-neutral-700')}
              >
                {tab.label}
              </span>
              <p className="text-xs text-rd-neutral-500 leading-relaxed">
                {tab.description}
              </p>
              <div className="flex items-center gap-1.5">
                <span
                  className={cn(
                    'text-xs font-medium px-1.5 py-0.5 rounded-full',
                    isActive
                      ? 'bg-rd-primary-100 text-rd-primary-800'
                      : 'bg-rd-neutral-100 text-rd-neutral-500',
                  )}
                >
                  {tab.kredi}
                </span>
                <span className="text-xs text-rd-neutral-400">{tab.sure}</span>
              </div>
            </button>
          )
        })}
      </div>

      {/* Toggle — 4 kartın altında, ortalı */}
      <div className="flex justify-center mt-4 mb-2">
        <button
          onClick={() => setDetailOpen((o) => !o)}
          aria-expanded={detailOpen}
          aria-controls="infostrip-detail"
          className="flex items-center gap-1.5 text-sm text-rd-neutral-600 hover:text-rd-primary-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rd-primary-300 rounded px-2 py-1"
        >
          <span>{detailOpen ? 'Detayı kapat' : 'Detaya bak'}</span>
          <ChevronDown
            size={16}
            strokeWidth={2}
            aria-hidden="true"
            className={cn('transition-transform duration-200', detailOpen && 'rotate-180')}
          />
        </button>
      </div>

      {/* Detail area */}
      {detailOpen && (
        <div
          id="infostrip-detail"
          role="tabpanel"
          aria-label={`${activeTabLabel} içerik türü detayı`}
          className="mt-4 rounded-xl border border-rd-neutral-200 bg-rd-neutral-50 p-4 md:p-5"
        >
          {/* Panel */}
          {activeTab === 'metin' && <MetinPanel market={activeMarket} setMarket={setActiveMarket} />}
          {activeTab === 'gorsel' && <GorselPanel />}
          {activeTab === 'video' && <VideoPanel />}
          {activeTab === 'sosyal' && <SosyalPanel />}
        </div>
      )}
    </div>
  )
}
