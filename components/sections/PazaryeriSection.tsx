'use client'

import { useState, useRef } from 'react'
import { FileText, Image as ImageIcon, Video, Share2, ChevronDown } from 'lucide-react'
import SectionHeader from '@/components/primitives/SectionHeader'
import { cn } from '@/lib/utils'
import { CONTENT_TYPES, PLATFORMS } from '@/lib/constants/pazaryeri'
import type { ContentTypeId, PlatformId } from '@/lib/constants/pazaryeri'

const CONTENT_TYPE_ICONS = {
  FileText,
  Image: ImageIcon,
  Video,
  Share2,
} as const

type ContentTypeIconKey = keyof typeof CONTENT_TYPE_ICONS

export default function PazaryeriSection() {
  const [activeContentType, setActiveContentType] = useState<ContentTypeId>('text')
  const [activePlatform, setActivePlatform] = useState<PlatformId>('trendyol')
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const tablistRef = useRef<HTMLDivElement>(null)

  // setActivePlatform, setCopiedField, PLATFORMS — sonraki ticket'larda (PZ-05+) kullanılacak
  void setActivePlatform
  void setCopiedField
  void PLATFORMS

  const activeType = CONTENT_TYPES.find((ct) => ct.id === activeContentType)!

  const handleTabKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const tabs = tablistRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')
    if (!tabs) return
    const arr = Array.from(tabs)
    const idx = arr.indexOf(document.activeElement as HTMLButtonElement)
    let next: number | null = null
    if (e.key === 'ArrowRight') next = (idx + 1) % arr.length
    else if (e.key === 'ArrowLeft') next = (idx - 1 + arr.length) % arr.length
    if (next !== null) { e.preventDefault(); arr[next].focus() }
  }

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-[1200px] px-6">
        <SectionHeader
          eyebrow="Tek üründen, 4 içerik · 3 platform"
          eyebrowColor="primary"
          title="Aynı üründen, her pazaryeri için ayrı içerik"
          subtitle="Metin, görsel, video, sosyal medya — her biri için her platformun kendi kuralı var. yzliste hepsini bilir, formatı ona göre hazırlar."
          align="center"
        />

        {/* ContentTypeStep — 4 pill tab */}
        <div
          ref={tablistRef}
          role="tablist"
          aria-label="İçerik türü seçimi"
          onKeyDown={handleTabKeyDown}
          className="mt-10 md:mt-12 flex flex-wrap justify-center gap-3"
        >
          {CONTENT_TYPES.map((ct) => {
            const isActive = activeContentType === ct.id
            const IconComp = CONTENT_TYPE_ICONS[ct.icon as ContentTypeIconKey]
            return (
              <button
                key={ct.id}
                role="tab"
                aria-selected={isActive}
                aria-controls="pazaryeri-output"
                onClick={() => setActiveContentType(ct.id)}
                style={
                  isActive
                    ? { borderColor: ct.color, backgroundColor: ct.bgColor, color: ct.color }
                    : undefined
                }
                className={cn(
                  'flex items-center gap-2 rounded-full px-4 py-2.5 text-sm',
                  'transition-all duration-200',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rd-primary/40 focus-visible:ring-offset-2',
                  isActive
                    ? 'border-2 font-semibold'
                    : 'border border-slate-200 bg-white text-slate-600 font-medium hover:border-slate-300 hover:bg-slate-50',
                )}
              >
                {IconComp && <IconComp size={16} strokeWidth={2} />}
                <span>{ct.label}</span>
              </button>
            )
          })}
        </div>

        {/* FlowConnector */}
        <div className="mb-6 mt-6 flex flex-col items-center">
          <div
            style={{ borderColor: activeType.color }}
            className="flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors duration-300"
          >
            <ChevronDown
              size={16}
              strokeWidth={2}
              style={{ color: activeType.color }}
              className="animate-[subtle-bounce_3s_ease-in-out_infinite] transition-colors duration-300"
            />
          </div>
          <div
            style={{ borderLeftColor: activeType.color }}
            className="h-2 border-l-2 border-dashed transition-colors duration-300"
          />
        </div>

        {/* OutputContainer — PZ-04+ */}
        <div id="pazaryeri-output" className="mb-8 text-center text-sm text-rd-neutral-400">
          [OutputContainer — PZ-04+] · platform: {activePlatform}
        </div>

        {copiedField && (
          <div className="text-center text-xs text-rd-neutral-400">
            Kopyalanan alan: {copiedField}
          </div>
        )}

        {/* CTA Footer — PZ-07 sonrası */}
      </div>
    </section>
  )
}
