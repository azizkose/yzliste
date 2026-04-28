'use client'

import { useMemo } from 'react'
import { Sparkles } from 'lucide-react'
import { generatePreview, type PreviewTone } from '@/lib/markaPreviewTemplates'

interface BrandedAIPreviewProps {
  tone: PreviewTone
  storeName: string
  ozellik: string
  kategori: string
}

export default function BrandedAIPreview({ tone, storeName, ozellik, kategori }: BrandedAIPreviewProps) {
  const listing = useMemo(
    () => generatePreview(tone, 'listing', { brand: storeName, ozellik, kategori }),
    [tone, storeName, ozellik, kategori]
  )
  const sosyal = useMemo(
    () => generatePreview(tone, 'sosyal', { brand: storeName, kategori }),
    [tone, storeName, kategori]
  )

  const transitionKey = `${tone}-${storeName}-${kategori}`

  return (
    <div className="rounded-xl border-2 border-rd-primary-200 bg-rd-primary-50 p-5">
      <div className="flex items-center gap-1.5 mb-4">
        <Sparkles size={14} className="text-rd-primary-700" />
        <span className="text-[10px] uppercase tracking-[0.15em] font-medium text-rd-primary-700">Marka ile</span>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.12em] text-rd-primary-600 mb-1.5">Listing metni</p>
          <p
            key={transitionKey + '-l'}
            className="text-sm text-rd-neutral-800 leading-relaxed font-[family-name:var(--font-rd-display)] animate-fade-in"
          >
            {listing}
          </p>
        </div>

        <div className="border-t border-rd-primary-100 pt-4">
          <p className="text-[10px] uppercase tracking-[0.12em] text-rd-primary-600 mb-1.5">Sosyal medya</p>
          <p
            key={transitionKey + '-s'}
            className="text-sm text-rd-neutral-800 leading-relaxed font-[family-name:var(--font-rd-display)] animate-fade-in"
          >
            {sosyal}
          </p>
        </div>
      </div>
    </div>
  )
}
