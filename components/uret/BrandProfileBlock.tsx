'use client'

import { useState, type ReactNode } from 'react'
import { Sparkles, ChevronDown } from 'lucide-react'

export type BrandTone = 'samimi' | 'profesyonel' | 'premium'

interface BrandProfileBlockProps {
  // U-05/U-06'da çocuk component'ler eklenecek; şimdilik opsiyonel
  children?: ReactNode
}

export default function BrandProfileBlock({ children }: BrandProfileBlockProps) {
  const [showDemo, setShowDemo] = useState(false)
  const [activeTone, setActiveTone] = useState<BrandTone | null>(null)

  // Border + ikon rengi: ton seçilmediyse accent (turuncu),
  // seçildiyse success (yeşil) — U-06'da activeTone set edilince geçiş olacak
  const isToneSelected = activeTone !== null
  const accentClass = isToneSelected ? 'border-l-rd-success-600' : 'border-l-rd-accent-600'
  const iconColor = isToneSelected ? 'text-rd-success-600' : 'text-rd-accent-600'
  const headerTitle = isToneSelected
    ? `Marka tonu: ${capitalizeTone(activeTone!)}`
    : 'Marka profili eksik'
  const headerSubtitle = isToneSelected
    ? 'Bu sadece önizleme. Tonu kalıcı yapmak için profilini kaydet.'
    : 'Tona göre AI çıktısı nasıl değişiyor — canlı dene'

  return (
    <div
      className={`bg-white border border-rd-neutral-200 ${accentClass} border-l-4 rounded-xl mb-6 overflow-hidden transition-colors duration-300`}
    >
      {/* Header */}
      <div className="flex items-start gap-3 p-5">
        <Sparkles className={`mt-0.5 h-5 w-5 flex-shrink-0 ${iconColor}`} aria-hidden="true" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-rd-neutral-900">{headerTitle}</p>
          <p className="mt-0.5 text-xs text-rd-neutral-600">{headerSubtitle}</p>
        </div>
        <button
          type="button"
          onClick={() => setShowDemo(v => !v)}
          aria-expanded={showDemo}
          aria-controls="brand-profile-demo"
          className="inline-flex items-center gap-1.5 rounded-lg border border-rd-neutral-300 px-3 py-1.5 text-xs font-medium text-rd-primary-700 hover:bg-rd-primary-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rd-primary-500 focus-visible:ring-offset-2"
        >
          {showDemo ? 'Gizle' : 'Önce dene'}
          <ChevronDown
            className={`h-3.5 w-3.5 transition-transform duration-200 ${showDemo ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </button>
      </div>

      {/* Demo area (collapsible) */}
      {showDemo && (
        <div
          id="brand-profile-demo"
          className="border-t border-rd-neutral-100 p-5 grid gap-5 md:grid-cols-[1fr_1.2fr]"
        >
          {children ?? (
            <p className="text-sm text-rd-neutral-500 italic md:col-span-2">
              Demo içeriği yakında eklenecek (U-05 + U-06).
            </p>
          )}
        </div>
      )}
    </div>
  )
}

function capitalizeTone(tone: BrandTone): string {
  const map: Record<BrandTone, string> = {
    samimi: 'Samimi',
    profesyonel: 'Profesyonel',
    premium: 'Premium',
  }
  return map[tone]
}
