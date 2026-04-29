'use client'

import { useState, useEffect, useRef } from 'react'
import { FileText, Image as ImageIcon, Video, MessageSquare, ChevronDown, RotateCw, ZoomIn, Lightbulb, Leaf, ScanSearch, Wind } from 'lucide-react'
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

// ---- Panels ----

function MetinPanel({ market }: { market: MarketId }) {
  const data = EXAMPLE_CONTENT_TR.metin[market]
  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-[0.1em] font-semibold text-rd-neutral-400 mb-1">Başlık</p>
        <p className="text-sm font-medium text-rd-neutral-900 leading-snug">{data.title}</p>
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.1em] font-semibold text-rd-neutral-400 mb-1">
          Özellikler
        </p>
        <ul className="space-y-1">
          {data.features.map((f, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-rd-neutral-700">
              <span className="w-1.5 h-1.5 rounded-full bg-rd-primary-700 mt-1.5 shrink-0" />
              {f}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.1em] font-semibold text-rd-neutral-400 mb-1">Açıklama</p>
        <p className="text-sm text-rd-neutral-700 leading-relaxed">{data.description}</p>
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.1em] font-semibold text-rd-neutral-400 mb-1">Etiketler</p>
        <div className="flex flex-wrap gap-1.5">
          {data.tags.map((tag, i) => (
            <span
              key={i}
              className="text-xs font-medium bg-rd-neutral-100 text-rd-neutral-600 px-2 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

const GORSEL_STILLER = [
  { src: '/ornek_beyaz.jpg', label: 'Beyaz zemin' },
  { src: '/ornek_dogal.jpg', label: 'Doğal' },
  { src: '/ornek_lifestyle.jpg', label: 'Lifestyle' },
  { src: '/ornek_ahsap.jpg', label: 'Ahşap' },
  { src: '/ornek_mermer.jpg', label: 'Mermer' },
  { src: '/ornek_gradient.jpg', label: 'Gradient' },
  { src: '/ornek_koyu.jpg', label: 'Koyu' },
]

function GorselPanel() {
  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {GORSEL_STILLER.map((stil) => (
          <div key={stil.src} className="flex flex-col items-center gap-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={stil.src}
              alt={stil.label}
              className="aspect-square w-full rounded-lg object-cover"
            />
            <span className="text-xs text-rd-neutral-500 text-center leading-tight">{stil.label}</span>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-rd-neutral-400">7 farklı stil — her stilde 1 görsel, 1 kredi</p>
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
          {/* Marketplace selector (only for Metin tab) */}
          {activeTab === 'metin' && (
            <div
              role="radiogroup"
              aria-label="Pazaryeri seç"
              className="flex gap-2 mb-5 flex-wrap"
            >
              {MARKETS.map((market) => (
                <button
                  key={market.id}
                  role="radio"
                  aria-checked={activeMarket === market.id}
                  onClick={() => setActiveMarket(market.id)}
                  className={cn(
                    'text-xs px-3 py-1.5 rounded-full border transition-all',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rd-primary-300',
                    activeMarket === market.id
                      ? 'border-rd-primary-700 bg-rd-primary-50 text-rd-primary-700 font-medium'
                      : 'border-rd-neutral-300 bg-white text-rd-neutral-500 hover:border-rd-primary-300',
                  )}
                >
                  {market.label}
                </button>
              ))}
            </div>
          )}

          {/* Panel */}
          {activeTab === 'metin' && <MetinPanel market={activeMarket} />}
          {activeTab === 'gorsel' && <GorselPanel />}
          {activeTab === 'video' && <VideoPanel />}
          {activeTab === 'sosyal' && <SosyalPanel />}
        </div>
      )}
    </div>
  )
}
