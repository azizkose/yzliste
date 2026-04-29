'use client'

import { useRef, type KeyboardEvent } from 'react'
import { Heart, Briefcase, Sparkles } from 'lucide-react'
import { TONE_CHIPS, type ToneKey } from '@/lib/constants/marka-bilgileri'

const ICON_MAP = {
  samimi: Heart,
  profesyonel: Briefcase,
  premium: Sparkles,
} as const

interface ToneSelectorProps {
  activeTone: ToneKey | null
  onChange: (tone: ToneKey) => void
}

export default function ToneSelector({ activeTone, onChange }: ToneSelectorProps) {
  const refs = useRef<(HTMLButtonElement | null)[]>([])

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>, idx: number) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
    e.preventDefault()
    const dir = e.key === 'ArrowRight' ? 1 : -1
    const next = (idx + dir + TONE_CHIPS.length) % TONE_CHIPS.length
    refs.current[next]?.focus()
    onChange(TONE_CHIPS[next].key)
  }

  return (
    <div>
      <p className="mb-3 text-xs font-medium text-rd-neutral-500 uppercase tracking-wider">
        Marka tonu
      </p>
      <div role="radiogroup" aria-label="Marka tonu seçimi" className="flex flex-wrap gap-2">
        {TONE_CHIPS.map((chip, idx) => {
          const Icon = ICON_MAP[chip.key]
          const isActive = activeTone === chip.key
          return (
            <button
              key={chip.key}
              ref={el => { refs.current[idx] = el }}
              type="button"
              role="radio"
              aria-checked={isActive}
              tabIndex={isActive || (activeTone === null && idx === 0) ? 0 : -1}
              onClick={() => onChange(chip.key)}
              onKeyDown={e => handleKeyDown(e, idx)}
              className={[
                'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rd-primary-500 focus-visible:ring-offset-2',
                isActive
                  ? 'bg-rd-primary-50 border-rd-primary-300 text-rd-primary-800'
                  : 'bg-white border-rd-neutral-200 text-rd-neutral-700 hover:border-rd-neutral-300',
              ].join(' ')}
            >
              <Icon className="h-3.5 w-3.5" aria-hidden="true" />
              {chip.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
