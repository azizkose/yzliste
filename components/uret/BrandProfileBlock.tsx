'use client'

import { useState } from 'react'
import { Sparkles, ChevronDown } from 'lucide-react'
import ToneSelector from './ToneSelector'
import AIPreview from './AIPreview'
import type { ToneKey } from '@/lib/constants/marka-bilgileri'

export type BrandTone = ToneKey

export default function BrandProfileBlock() {
  const [showDemo, setShowDemo] = useState(false)
  const [activeTone, setActiveTone] = useState<ToneKey | null>(null)

  const isToneSelected = activeTone !== null
  const accentClass = isToneSelected ? 'border-l-rd-success-600' : 'border-l-rd-accent-600'
  const iconColor = isToneSelected ? 'text-rd-success-600' : 'text-rd-accent-600'
  const headerTitle = isToneSelected
    ? `Marka tonu: ${capitalizeTone(activeTone)}`
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
          <ToneSelector activeTone={activeTone} onChange={setActiveTone} />
          <AIPreview activeTone={activeTone} />
        </div>
      )}
    </div>
  )
}

function capitalizeTone(tone: ToneKey): string {
  const map: Record<ToneKey, string> = {
    samimi: 'Samimi',
    profesyonel: 'Profesyonel',
    premium: 'Premium',
  }
  return map[tone]
}
