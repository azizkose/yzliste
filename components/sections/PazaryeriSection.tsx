'use client'

import { useState, useRef } from 'react'
import {
  FileText, Image as ImageIcon, Video, Share2,
  ChevronDown, ArrowRight, Camera, Pencil, ScanLine,
} from 'lucide-react'
import SectionHeader from '@/components/primitives/SectionHeader'
import { cn } from '@/lib/utils'
import { CONTENT_TYPES, PLATFORMS, SAMPLE_PRODUCT, INPUT_METHODS } from '@/lib/constants/pazaryeri'
import type { ContentTypeId, PlatformId } from '@/lib/constants/pazaryeri'

// ---- Icon maps ----

const CONTENT_TYPE_ICONS = {
  FileText,
  Image: ImageIcon,
  Video,
  Share2,
} as const

const INPUT_METHOD_ICONS = {
  Camera,
  Pencil,
  Barcode: ScanLine,  // ScanLine as Barcode fallback
} as const

type ContentTypeIconKey = keyof typeof CONTENT_TYPE_ICONS
type InputMethodIconKey = keyof typeof INPUT_METHOD_ICONS

// ---- ProductInputCard ----

function ProductInputCard() {
  const specs = [
    { label: 'Ağırlık', value: SAMPLE_PRODUCT.specs.weight },
    { label: 'Malzeme', value: SAMPLE_PRODUCT.specs.material },
    { label: 'Parça', value: SAMPLE_PRODUCT.specs.pieces },
    { label: 'Renk', value: SAMPLE_PRODUCT.specs.color },
  ]

  return (
    <div className="md:sticky md:top-5">
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        {/* ProductImage area */}
        <div className="flex min-h-[140px] flex-col items-center justify-center bg-slate-50 p-6">
          <ImageIcon size={48} strokeWidth={1.5} className="text-slate-300" />
          <p className="mt-2 text-xs text-slate-400">{SAMPLE_PRODUCT.name}</p>
        </div>

        {/* ProductInfo */}
        <div className="p-4">
          <p className="text-sm font-medium text-slate-900">{SAMPLE_PRODUCT.name}</p>
          <p className="mt-0.5 text-xs text-slate-500">{SAMPLE_PRODUCT.brand}</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {specs.map(({ label, value }) => (
              <div key={label} className="rounded-lg bg-slate-50 px-2.5 py-1.5">
                <p className="text-[10px] uppercase tracking-wide text-slate-400">{label}</p>
                <p className="text-xs font-medium text-slate-700">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* InputMethods */}
        <div className="px-4 pb-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.1em] text-slate-400">
            Girdi yöntemi
          </p>
          <div className="flex gap-2">
            {INPUT_METHODS.map((method, idx) => {
              const MethodIcon = INPUT_METHOD_ICONS[method.icon as InputMethodIconKey]
              const isSelected = idx === 0
              return (
                <div
                  key={method.icon}
                  className={cn(
                    'flex-1 rounded-lg border p-2 text-center',
                    isSelected
                      ? 'border-rd-primary bg-rd-primary-50'
                      : 'border-slate-200 bg-white',
                  )}
                >
                  {MethodIcon && (
                    <MethodIcon
                      size={16}
                      strokeWidth={2}
                      className={cn(
                        'mx-auto',
                        isSelected ? 'text-rd-primary' : 'text-slate-400',
                      )}
                    />
                  )}
                  <p
                    className={cn(
                      'mt-1 text-[10px] font-medium leading-tight',
                      isSelected ? 'text-rd-primary' : 'text-slate-500',
                    )}
                  >
                    {method.label}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

// ---- Section ----

export default function PazaryeriSection() {
  const [activeContentType, setActiveContentType] = useState<ContentTypeId>('text')
  const [activePlatform, setActivePlatform] = useState<PlatformId>('trendyol')
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const tablistRef = useRef<HTMLDivElement>(null)

  // setActivePlatform, setCopiedField — PZ-06+ kullanılacak
  void setActivePlatform
  void setCopiedField

  const activeType = CONTENT_TYPES.find((ct) => ct.id === activeContentType)!
  const ActiveIcon = CONTENT_TYPE_ICONS[activeType.icon as ContentTypeIconKey]

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
            const TabIcon = CONTENT_TYPE_ICONS[ct.icon as ContentTypeIconKey]
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
                {TabIcon && <TabIcon size={16} strokeWidth={2} />}
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

        {/* DynamicTitleBar */}
        <div className="flex items-center justify-between rounded-t-xl border border-b-0 border-slate-200 bg-white px-4 py-4 md:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div
              style={{ backgroundColor: activeType.bgColor }}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors duration-300"
            >
              {ActiveIcon && (
                <ActiveIcon
                  size={16}
                  strokeWidth={2}
                  style={{ color: activeType.color }}
                  className="transition-colors duration-300"
                />
              )}
            </div>
            <div className="min-w-0">
              <p
                style={{ color: activeType.color }}
                className="text-[10px] font-semibold uppercase tracking-[0.1em] transition-colors duration-300"
              >
                Üretilen örnek
              </p>
              <h3 className="truncate text-base font-bold text-slate-900 md:text-lg">
                {activeType.label} — {PLATFORMS[activePlatform].name} için
              </h3>
            </div>
          </div>
          <span
            style={{ backgroundColor: activeType.bgColor, color: activeType.color }}
            className="ml-4 shrink-0 rounded-full px-2.5 py-1 text-xs font-medium transition-colors duration-300"
          >
            {activeType.credit}
          </span>
        </div>

        {/* OutputCard frame */}
        <div
          id="pazaryeri-output"
          style={{ borderColor: activeType.color }}
          className="min-h-[400px] rounded-b-xl border bg-white p-5 transition-colors duration-300 md:p-6"
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-start">
            {/* Sol: ProductInputCard */}
            <div className="md:w-[300px] md:shrink-0">
              <ProductInputCard />
            </div>

            {/* ArrowConnector — desktop only */}
            <div className="hidden items-center self-center md:flex">
              <ArrowRight size={20} strokeWidth={1.5} className="animate-pulse text-slate-300" />
            </div>

            {/* Sağ: Output area placeholder (PZ-06+) */}
            <div className="min-w-0 flex-1">
              <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4">
                <p className="mb-1 text-xs text-slate-400">
                  Platform: {activePlatform} · İçerik: {activeContentType}
                </p>
                <p className="text-sm text-slate-400">Output alanı (PZ-06+)</p>
              </div>
            </div>
          </div>
        </div>

        {copiedField && (
          <div className="mt-4 text-center text-xs text-rd-neutral-400">
            Kopyalanan alan: {copiedField}
          </div>
        )}

        {/* CTA Footer — PZ-07 sonrası */}
      </div>
    </section>
  )
}
