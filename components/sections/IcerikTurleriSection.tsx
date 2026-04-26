'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { FileText, Image as ImageIcon, Video, Share2, ArrowRight, X, Info } from 'lucide-react'
import SectionHeader from '@/components/primitives/SectionHeader'
import Button from '@/components/primitives/Button'
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
type IcerikTuruItem = (typeof ICERIK_TURLERI)[number]

// ---- ContentTypeCard ----

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
      <div
        style={{ backgroundColor: type.bgColor }}
        className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
      >
        {IconComp && <IconComp size={28} strokeWidth={2} style={{ color: type.color }} />}
      </div>
      <h3 className="font-rd-display text-xl font-bold text-slate-900 mt-4">{type.title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed min-h-[42px] mt-1">{type.tagline}</p>
      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-400 mt-4 mb-2">
        İçerir
      </p>
      <ul className="space-y-1.5 flex-1">
        {type.contains.map((item) => (
          <li key={item} className="flex items-center gap-2">
            <span style={{ backgroundColor: type.color }} className="w-1.5 h-1.5 rounded-full shrink-0" />
            <span className="text-sm text-slate-600">{item}</span>
          </li>
        ))}
      </ul>
      <div className="border-t border-slate-100 my-4" />
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

// ---- SampleModal ----

interface SampleModalProps {
  type: IcerikTuruItem
  onClose: () => void
}

function SampleModal({ type, onClose }: SampleModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const IconComp = CARD_ICON_MAP[type.icon as CardIconKey]

  // Body scroll lock
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  // Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onClose])

  // Focus panel on mount
  useEffect(() => { panelRef.current?.focus() }, [])

  // Focus trap
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Tab') return
    const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    )
    if (!focusable || focusable.length === 0) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus() }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus() }
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-[modal-backdrop-in_200ms_ease-out]"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Panel wrapper */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="presentation">
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          tabIndex={-1}
          onKeyDown={handleKeyDown}
          className="relative bg-white rounded-[20px] max-w-[520px] w-full p-8 max-h-[90vh] overflow-y-auto animate-[modal-panel-in_250ms_ease-out] focus:outline-none"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Kapat"
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rd-primary/40"
          >
            <X size={16} strokeWidth={2} className="text-slate-500" />
          </button>

          {/* IconBox */}
          <div
            style={{ backgroundColor: type.bgColor }}
            className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
          >
            {IconComp && <IconComp size={28} strokeWidth={2} style={{ color: type.color }} />}
          </div>

          {/* Title */}
          <h2 id="modal-title" className="text-xl font-bold text-slate-900">
            {type.title} — Örnek Çıktı
          </h2>

          {/* Subtitle */}
          <p className="text-sm text-slate-500 mt-1 mb-6">
            {type.sample.platform} için üretildi
          </p>

          {/* SampleBox */}
          <div className="bg-slate-50 rounded-xl p-5 space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-400">Başlık</p>
              <p className="text-sm font-medium text-slate-900 mt-1">{type.sample.title}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-400">Önizleme</p>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">{type.sample.snippet}</p>
            </div>
          </div>

          {/* HintBox */}
          <div
            style={{ borderLeftColor: type.color, backgroundColor: type.bgColor }}
            className="mt-5 p-4 rounded-lg border-l-4 flex items-start gap-2"
          >
            <Info size={14} strokeWidth={2} style={{ color: type.color }} className="shrink-0 mt-0.5" />
            <p className="text-sm text-slate-600">
              Aşağıdaki Pazaryeri sekmeleri bölümünden 12 farklı kombinasyonu canlı dene
            </p>
          </div>

          {/* CTA Button */}
          <Button
            variant="primary"
            fullWidth
            iconRight={<ArrowRight size={16} strokeWidth={2} />}
            className="mt-6"
            onClick={() => { window.location.href = '/uret' }}
          >
            {`${type.title}'i hemen üret`}
          </Button>
        </div>
      </div>
    </>
  )
}

// ---- Section ----

export default function IcerikTurleriSection() {
  const [openModal, setOpenModal] = useState<IcerikTuruId | null>(null)
  const prevFocusRef = useRef<HTMLElement | null>(null)

  // BOTTOM_NOTE — IT-06'da kullanılacak
  void BOTTOM_NOTE

  const handleOpenModal = useCallback((id: IcerikTuruId) => {
    prevFocusRef.current = document.activeElement as HTMLElement
    setOpenModal(id)
  }, [])

  const handleCloseModal = useCallback(() => {
    setOpenModal(null)
    setTimeout(() => prevFocusRef.current?.focus(), 50)
  }, [])

  const activeModalType = openModal
    ? ICERIK_TURLERI.find((t) => t.id === openModal) ?? null
    : null

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
              onOpen={() => handleOpenModal(type.id)}
            />
          ))}
        </div>

        {/* BottomNote — IT-06 */}
        <div className="mt-10 text-center text-sm text-rd-neutral-400">
          [BottomNote — IT-06]
        </div>
      </div>

      {/* SampleModal — fixed-positioned, section dışına taşmaz */}
      {activeModalType && (
        <SampleModal type={activeModalType} onClose={handleCloseModal} />
      )}
    </section>
  )
}
