'use client'

import { useState } from 'react'
import { FileText, Image as ImageIcon, Video, Share2, ArrowRight } from 'lucide-react'
import SectionHeader from '@/components/primitives/SectionHeader'
import { cn } from '@/lib/utils'
import { ICERIK_TURLERI, BOTTOM_NOTE } from '@/lib/constants/icerik-turleri'
import type { IcerikTuruId } from '@/lib/constants/icerik-turleri'

// ---- Icon map ----

const CARD_ICON_MAP = {
  FileText,
  Image: ImageIcon,
  Video,
  Share2,
} as const

type CardIconKey = keyof typeof CARD_ICON_MAP

// ---- ContentTypeCard ----

type IcerikTuruItem = (typeof ICERIK_TURLERI)[number]

interface ContentTypeCardProps {
  type: IcerikTuruItem
  onOpen: () => void
}

function ContentTypeCard({ type, onOpen }: ContentTypeCardProps) {
  const [hovered, setHovered] = useState(false)
  const IconComp = CARD_ICON_MAP[type.icon as CardIconKey]

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onOpen()
        }
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        '--focus-ring-color': type.color,
        ...(hovered
          ? {
              borderColor: type.color,
              transform: 'translateY(-2px)',
              boxShadow: `0 8px 24px color-mix(in srgb, ${type.color} 12%, transparent)`,
            }
          : {}),
      } as React.CSSProperties}
      className={cn(
        'flex flex-col bg-white border border-slate-200 rounded-2xl p-6',
        'transition-all duration-200 cursor-pointer',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring-color)] focus-visible:ring-offset-2',
      )}
    >
      {/* IconBox */}
      <div
        style={{ backgroundColor: type.bgColor }}
        className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
      >
        {IconComp && (
          <IconComp size={28} strokeWidth={2} style={{ color: type.color }} />
        )}
      </div>

      {/* Title */}
      <h3 className="font-rd-display text-xl font-bold text-slate-900 mt-4">
        {type.title}
      </h3>

      {/* Tagline */}
      <p className="text-sm text-slate-500 leading-relaxed min-h-[42px] mt-1">
        {type.tagline}
      </p>

      {/* Contains label */}
      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-400 mt-4 mb-2">
        İçerir
      </p>

      {/* Contains list */}
      <ul className="space-y-1.5 flex-1">
        {type.contains.map((item) => (
          <li key={item} className="flex items-center gap-2">
            <span
              style={{ backgroundColor: type.color }}
              className="w-1.5 h-1.5 rounded-full shrink-0"
            />
            <span className="text-sm text-slate-600">{item}</span>
          </li>
        ))}
      </ul>

      {/* Divider */}
      <div className="border-t border-slate-100 my-4" />

      {/* PricingRow */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-400">Kredi</p>
          <p className="text-sm font-semibold text-slate-900">{type.pricing}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-400">Süre</p>
          <p className="text-sm font-semibold text-slate-900">{type.duration}</p>
        </div>
      </div>

      {/* InlineCTA */}
      <div
        style={{ color: type.color }}
        className="mt-4 flex items-center gap-1.5 text-sm font-medium hover:opacity-80 transition-opacity"
      >
        <span>Örnek çıktıyı gör</span>
        <ArrowRight size={14} strokeWidth={2} />
      </div>
    </div>
  )
}

// ---- Section ----

export default function IcerikTurleriSection() {
  const [openModal, setOpenModal] = useState<IcerikTuruId | null>(null)

  // BOTTOM_NOTE — IT-06'da kullanılacak
  void BOTTOM_NOTE

  return (
    <section className="bg-rd-neutral-50 py-20">
      <div className="mx-auto max-w-[1200px] px-6">
        <SectionHeader
          eyebrow="4 araç, tek platform"
          eyebrowColor="primary"
          title="Tek platformda 4 içerik türü"
          subtitle="Listing metni, ürün görseli, tanıtım videosu ve sosyal medya kit'i — hepsini aynı yerde, aynı krediyle üret."
          align="center"
        />

        {/* Cards Grid */}
        <div className="mt-12 md:mt-16 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-4">
          {ICERIK_TURLERI.map((type) => (
            <ContentTypeCard
              key={type.id}
              type={type}
              onOpen={() => setOpenModal(type.id)}
            />
          ))}
        </div>

        {/* BottomNote — IT-06 */}
        <div className="mt-10 text-center text-sm text-rd-neutral-400">
          [BottomNote — IT-06]
        </div>

        {/* SampleModal — IT-05 (openModal state'ini kullanacak) */}
        {openModal !== null && null}
      </div>
    </section>
  )
}
