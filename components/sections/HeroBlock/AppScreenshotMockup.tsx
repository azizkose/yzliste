'use client'

import { useEffect, useRef } from 'react'
import {
  Check,
  Zap,
  FileText,
  PlayCircle,
  MessageSquare,
  Download,
} from 'lucide-react'
import StickerBadge from '@/components/primitives/StickerBadge'
import { HERO_BADGES } from '@/lib/constants/hero'
import { EXAMPLE_CONTENT_TR } from '@/lib/data/exampleContent'

const trendyolTitle = EXAMPLE_CONTENT_TR.metin.trendyol.title

// Hızlı video — 3x hızda 360° dönüş
function HizliVideo() {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = 3.0
  }, [])
  return (
    <video
      ref={videoRef}
      src="/video-ornekler/360-donus.mp4"
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      className="h-8 w-full rounded object-cover bg-rd-neutral-200"
      aria-hidden="true"
    />
  )
}

const OUTPUT_CARDS = [
  {
    icon: FileText,
    label: 'Listing',
    color: 'text-rd-primary-700',
    content: (
      <p className="text-xs text-rd-neutral-700 leading-snug line-clamp-2">
        {trendyolTitle.slice(0, 60)}…
      </p>
    ),
  },
  {
    icon: null,
    label: 'Görsel',
    color: 'text-rd-primary-700',
    content: (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src="/ornek_beyaz.jpg"
        alt="Basketbol topu beyaz zemin"
        className="h-10 w-full object-contain rounded"
      />
    ),
  },
  {
    icon: PlayCircle,
    label: 'Video',
    color: 'text-rd-primary-700',
    content: <HizliVideo />,
  },
  {
    icon: MessageSquare,
    label: 'Sosyal',
    color: 'text-rd-primary-700',
    content: (
      <p className="text-xs text-rd-neutral-500 leading-snug line-clamp-2">
        Sahaya çıkmadan önce doğru top şart. 7 numara FIBA standardı...
      </p>
    ),
  },
]

export default function AppScreenshotMockup() {
  return (
    <div className="relative animate-hero-float-in-right" role="img" aria-label="Uygulama önizlemesi">
      <StickerBadge
        icon={<Check size={14} strokeWidth={2} />}
        label={HERO_BADGES.topRight.label}
        color="#1E40AF"
        borderColor="#DBEAFE"
        className="hidden sm:flex sm:absolute sm:-top-3 sm:right-5 z-10"
      />
      <StickerBadge
        icon={<Zap size={14} strokeWidth={2} />}
        label={HERO_BADGES.bottomLeft.label}
        color="#EA580C"
        borderColor="#FED7AA"
        className="hidden sm:flex sm:absolute sm:-bottom-3 sm:-left-3 z-10"
      />

      {/* Browser chrome */}
      <div className="overflow-hidden rounded-xl border border-rd-neutral-200 bg-white">
        {/* Browser top bar */}
        <div className="flex items-center gap-3 border-b border-rd-neutral-200 bg-rd-neutral-50 px-4 py-3">
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <span className="h-3 w-3 rounded-full bg-red-400" />
            <span className="h-3 w-3 rounded-full bg-amber-400" />
            <span className="h-3 w-3 rounded-full bg-green-400" />
          </div>
          <div className="flex flex-1 items-center justify-center rounded-md border border-rd-neutral-200 bg-white px-3 py-1">
            <span className="text-xs text-rd-neutral-400">yzliste.com/uret</span>
          </div>
        </div>

        {/* App content */}
        <div className="p-5">
          {/* INPUT: ürün fotoğrafı */}
          <div
            className="mb-4 flex items-center gap-3 rounded-xl border border-rd-neutral-200 bg-rd-neutral-50 p-3"
            aria-hidden="true"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/ornek_once.jpg"
              alt="Basketbol topu ham fotoğraf"
              className="h-10 w-10 shrink-0 rounded-lg object-cover border border-rd-neutral-200"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-rd-neutral-700">
                Profesyonel Basketbol Topu 7 Numara
              </p>
              <p className="mt-0.5 text-xs text-rd-neutral-400">
                Trendyol · Metin + Görsel + Video + Sosyal
              </p>
            </div>
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rd-success-50 border border-rd-success-700/20">
              <Check size={11} strokeWidth={2.5} className="text-rd-success-700" />
            </div>
          </div>

          {/* AI Transform arrow */}
          <div className="mb-4 flex items-center gap-2" aria-hidden="true">
            <div className="h-px flex-1 bg-rd-neutral-200" />
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-rd-primary-700">
              <Zap size={13} strokeWidth={2} className="text-white" />
            </div>
            <div className="h-px flex-1 bg-rd-neutral-200" />
          </div>

          {/* OUTPUT: 4 kart 2x2 grid */}
          <div className="grid grid-cols-2 gap-2" aria-hidden="true">
            {OUTPUT_CARDS.map((card) => {
              const Icon = card.icon
              return (
                <div key={card.label} className="rounded-lg border border-rd-neutral-200 bg-white p-2.5">
                  <div className="mb-1.5 flex items-center gap-1">
                    {Icon && <Icon size={11} strokeWidth={1.5} className={card.color} aria-hidden="true" />}
                    <span className={`text-xs font-medium ${card.color}`}>{card.label}</span>
                  </div>
                  {card.content}
                </div>
              )
            })}
          </div>

          {/* Download button */}
          <div
            className="mt-3 flex items-center justify-center gap-1.5 rounded-[10px] bg-rd-primary-700 py-2.5"
            aria-hidden="true"
          >
            <Download size={13} strokeWidth={2} className="text-white" />
            <span className="text-sm font-medium text-white">Üretilen içerikleri indir</span>
          </div>
        </div>
      </div>
    </div>
  )
}
