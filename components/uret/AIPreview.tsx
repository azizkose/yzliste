'use client'

import { TONE_CHIPS, type ToneKey } from '@/lib/constants/marka-bilgileri'

interface AIPreviewProps {
  activeTone: ToneKey | null
}

const PLACEHOLDER = 'Solda bir ton seç, AI çıktısının nasıl değiştiğini gör.'

export default function AIPreview({ activeTone }: AIPreviewProps) {
  const chip = activeTone ? TONE_CHIPS.find(c => c.key === activeTone) : null
  const text = chip?.output ?? PLACEHOLDER

  return (
    <div>
      <p className="mb-3 text-xs font-medium text-rd-neutral-500 uppercase tracking-wider">
        AI çıktısı önizleme
      </p>
      <div
        key={activeTone ?? 'placeholder'}
        className="rounded-lg border border-rd-neutral-200 bg-rd-neutral-50 p-4 text-sm leading-relaxed text-rd-neutral-700 animate-fade-in"
        aria-live="polite"
      >
        {text}
      </div>
      {activeTone && (
        <p className="mt-2 text-xs italic text-rd-neutral-500">
          Bu sadece önizleme. Tonu kalıcı yapmak için profilini kaydet.
        </p>
      )}
    </div>
  )
}
