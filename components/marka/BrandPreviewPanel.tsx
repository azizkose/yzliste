'use client'

import { useState } from 'react'
import { Info, ChevronDown } from 'lucide-react'
import Tooltip from '@/components/primitives/Tooltip'
import BrandedAIPreview from './BrandedAIPreview'
import GenericAIPreview from './GenericAIPreview'
import type { PreviewTone } from '@/lib/markaPreviewTemplates'

interface BrandPreviewPanelProps {
  tone: PreviewTone
  storeName: string
  ozellik: string
  kategori: string
  collapsibleOnMobile?: boolean
}

export default function BrandPreviewPanel({
  tone,
  storeName,
  ozellik,
  kategori,
  collapsibleOnMobile,
}: BrandPreviewPanelProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const content = (
    <div className="space-y-3">
      <BrandedAIPreview
        tone={tone}
        storeName={storeName}
        ozellik={ozellik}
        kategori={kategori}
      />
      <GenericAIPreview />
      <p className="text-xs text-rd-neutral-500 leading-relaxed">
        Bu şablon önizleme. Gerçek üretimde AI marka bilgini kullanarak özgün metin yazar.
      </p>
    </div>
  )

  if (collapsibleOnMobile) {
    return (
      <aside>
        {/* Mobile accordion */}
        <div className="lg:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-rd-neutral-200 bg-white text-sm font-medium text-rd-neutral-900"
          >
            Canlı önizleme
            <ChevronDown
              size={16}
              className={`text-rd-neutral-500 transition-transform ${mobileOpen ? 'rotate-180' : ''}`}
            />
          </button>
          {mobileOpen && <div className="mt-3">{content}</div>}
        </div>

        {/* Desktop sticky */}
        <div className="hidden lg:block lg:sticky lg:top-24 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-rd-neutral-900">Canlı önizleme</p>
            <Tooltip content="Form değiştikçe örnek metin güncellenir. AI gerçek üretimde marka bilgini kullanır.">
              <button type="button" aria-label="Önizleme hakkında bilgi">
                <Info size={15} className="text-rd-neutral-400 cursor-help" />
              </button>
            </Tooltip>
          </div>
          {content}
        </div>
      </aside>
    )
  }

  return (
    <aside className="lg:sticky lg:top-24 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-rd-neutral-900">Canlı önizleme</p>
        <Tooltip content="Form değiştikçe örnek metin güncellenir. AI gerçek üretimde marka bilgini kullanır.">
          <button type="button" aria-label="Önizleme hakkında bilgi">
            <Info size={15} className="text-rd-neutral-400 cursor-help" />
          </button>
        </Tooltip>
      </div>
      {content}
    </aside>
  )
}
