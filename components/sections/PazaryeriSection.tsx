'use client'

import { useState } from 'react'
import SectionHeader from '@/components/primitives/SectionHeader'
import { CONTENT_TYPES, PLATFORMS } from '@/lib/constants/pazaryeri'
import type { ContentTypeId, PlatformId } from '@/lib/constants/pazaryeri'

// Tip tanımı — sonraki ticket'larda kullanılacak
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface PazaryeriSectionState {
  activeContentType: ContentTypeId
  activePlatform: PlatformId
  copiedField: string | null
}

export default function PazaryeriSection() {
  const [activeContentType, setActiveContentType] = useState<ContentTypeId>('text')
  const [activePlatform, setActivePlatform] = useState<PlatformId>('trendyol')
  const [copiedField, setCopiedField] = useState<string | null>(null)

  // State'ler sonraki ticket'larda (PZ-03+) kullanılacak
  void setActiveContentType
  void setActivePlatform
  void setCopiedField
  void CONTENT_TYPES
  void PLATFORMS

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

        {/* Adım 1: ContentTypeStep — sonraki ticket (PZ-03) */}
        <div className="mb-8 text-center text-sm text-rd-neutral-400">
          [ContentTypeStep — PZ-03] · aktif: {activeContentType}
        </div>

        {/* FlowConnector — sonraki ticket (PZ-03) */}

        {/* Adım 2: OutputContainer — sonraki ticket'lar (PZ-04~10) */}
        <div className="mb-8 text-center text-sm text-rd-neutral-400">
          [OutputContainer — PZ-04+] · platform: {activePlatform}
        </div>

        {/* CopyField state göstergesi */}
        {copiedField && (
          <div className="text-center text-xs text-rd-neutral-400">
            Kopyalanan alan: {copiedField}
          </div>
        )}

        {/* CTA Footer — sonraki ticket (PZ-07 sonrası) */}
      </div>
    </section>
  )
}
