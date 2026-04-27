'use client'

import { useState, useRef } from 'react'
import {
  FileText, Image as ImageIcon, Video, Share2,
  ChevronDown, ArrowRight, Camera, Pencil, ScanLine,
  Ruler, Globe, Key, ClipboardList, Maximize, Sparkles,
  Search, Sun, Palette, BookOpen, Timer, Target, Smartphone, Hash,
  Coffee, Leaf, Hand, Gift, Package, Download,
} from 'lucide-react'
import SectionHeader from '@/components/primitives/SectionHeader'
import CopyButton from '@/components/primitives/CopyButton'
import Button from '@/components/primitives/Button'
import { cn } from '@/lib/utils'
import { CONTENT_TYPES, PLATFORMS, PAZARYERI_DEMO_DATA, SAMPLE_PRODUCT, INPUT_METHODS } from '@/lib/constants/pazaryeri'
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

const RULE_ICONS = {
  Ruler, Globe, Key, ClipboardList, Maximize, Sparkles,
  Search, Sun, Palette, BookOpen, Timer, Target, Smartphone, Hash,
} as const

const GALLERY_ICONS = {
  Coffee, Ruler, Package, Sparkles, Leaf, Hand, Gift, Palette, Sun,
} as const

type ContentTypeIconKey = keyof typeof CONTENT_TYPE_ICONS
type InputMethodIconKey = keyof typeof INPUT_METHOD_ICONS
type RuleIconKey = keyof typeof RULE_ICONS
type GalleryIconKey = keyof typeof GALLERY_ICONS

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
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.1em] text-slate-400">
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

// ---- FieldHeader ----

function FieldHeader({ label, copyText }: { label: string; copyText: string }) {
  return (
    <div className="flex items-center justify-between mb-2">
      <span className="text-xs font-medium uppercase tracking-[0.1em] text-slate-400">
        {label}
      </span>
      <CopyButton text={copyText} size="sm" variant="minimal" />
    </div>
  )
}

// ---- ImageContentRenderer ----

interface GalleryItemData {
  label: string
  icon: string
  bg: string
}

interface GalleryItemCardProps {
  item: GalleryItemData
  isFirst: boolean
}

function GalleryItemCard({ item, isFirst }: GalleryItemCardProps) {
  const GalleryIcon = GALLERY_ICONS[item.icon as GalleryIconKey]
  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl bg-white',
        isFirst ? 'border-2 border-rd-primary' : 'border border-slate-200',
      )}
    >
      <div
        className="flex aspect-square items-center justify-center"
        style={{ backgroundColor: item.bg }}
      >
        {GalleryIcon && (
          <GalleryIcon size={32} strokeWidth={1.5} className="text-slate-300" />
        )}
      </div>
      <div className="px-3 py-2">
        <p className="text-xs font-medium text-slate-600">{item.label}</p>
        {isFirst && (
          <span className="text-[10px] font-medium text-rd-primary">Ana görsel</span>
        )}
      </div>
    </div>
  )
}

function ImageContentRenderer({
  gallery,
  styleNote,
  platformColor,
  platformBgColor,
  animKey,
}: {
  gallery: GalleryItemData[]
  styleNote: string
  platformColor: string
  platformBgColor: string
  animKey: string
}) {
  return (
    <div key={animKey} className="animate-[fade-in_300ms_ease-out]">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {gallery.map((item, i) => (
          <GalleryItemCard key={i} item={item} isFirst={i === 0} />
        ))}
      </div>

      <div
        className="mt-4 flex items-center gap-2 rounded-xl px-4 py-3"
        style={{
          backgroundColor: platformBgColor,
          borderLeft: `3px solid ${platformColor}`,
        }}
      >
        <ImageIcon size={14} strokeWidth={2} style={{ color: platformColor }} />
        <p className="text-xs font-medium text-slate-600">{styleNote}</p>
      </div>

      <div className="mt-4">
        <Button
          variant="outline"
          size="sm"
          icon={<Download size={14} strokeWidth={2} />}
          onClick={() => {}}
        >
          Tümünü indir
        </Button>
      </div>
    </div>
  )
}

// ---- TextContentRenderer ----

interface TextFields {
  'Başlık': string
  'Özellikler': string[]
  'Açıklama': string
  'Arama Etiketleri': string[]
}

function TextContentRenderer({
  fields,
  platformColor,
  animKey,
}: {
  fields: TextFields
  platformColor: string
  animKey: string
}) {
  return (
    <div
      key={animKey}
      className="space-y-5 animate-[fade-in_300ms_ease-out]"
    >
      <div>
        <FieldHeader label="Başlık" copyText={fields['Başlık']} />
        <p className="text-sm font-medium text-slate-900 leading-relaxed">
          {fields['Başlık']}
        </p>
      </div>

      <div>
        <FieldHeader label="Özellikler" copyText={fields['Özellikler'].join('\n')} />
        <ul className="space-y-1.5">
          {fields['Özellikler'].map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <span
                className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                style={{ backgroundColor: platformColor }}
              />
              <span className="text-sm text-slate-700 leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <FieldHeader label="Açıklama" copyText={fields['Açıklama']} />
        <p className="text-sm text-slate-700 leading-relaxed">
          {fields['Açıklama']}
        </p>
      </div>

      <div>
        <FieldHeader label="Arama Etiketleri" copyText={fields['Arama Etiketleri'].join(', ')} />
        <div className="flex flex-wrap gap-1.5">
          {fields['Arama Etiketleri'].map((tag, i) => (
            <span
              key={i}
              className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

// ---- Section ----

export default function PazaryeriSection() {
  const [activeContentType, setActiveContentType] = useState<ContentTypeId>('text')
  const [activePlatform, setActivePlatform] = useState<PlatformId>('trendyol')
  const tablistRef = useRef<HTMLDivElement>(null)

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
                    ? 'border-2 font-medium'
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
                className="text-[10px] font-medium uppercase tracking-[0.1em] transition-colors duration-300"
              >
                Üretilen örnek
              </p>
              <h3 className="truncate text-base font-medium text-slate-900 md:text-lg">
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

            {/* Sağ: PlatformTabs + PlatformRulesBar + output placeholder */}
            <div className="min-w-0 flex-1 space-y-4">

              {/* PlatformTabs */}
              <div
                role="tablist"
                aria-label="Platform seçimi"
                className="flex flex-wrap gap-2"
              >
                {(Object.keys(PLATFORMS) as PlatformId[]).map((id) => {
                  const platform = PLATFORMS[id]
                  const isActive = activePlatform === id
                  return (
                    <button
                      key={id}
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setActivePlatform(id)}
                      style={
                        isActive
                          ? { borderColor: platform.color, backgroundColor: platform.bgColor }
                          : undefined
                      }
                      className={cn(
                        'flex items-center gap-2 rounded-xl px-3 py-2 text-sm',
                        'transition-all duration-200',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rd-primary/40 focus-visible:ring-offset-2',
                        isActive
                          ? 'border-2 font-medium'
                          : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50',
                      )}
                    >
                      <span
                        style={
                          isActive
                            ? { backgroundColor: platform.color, color: '#ffffff' }
                            : undefined
                        }
                        className={cn(
                          'inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium',
                          !isActive && 'bg-slate-100 text-slate-500',
                        )}
                      >
                        {platform.letter}
                      </span>
                      <span
                        style={isActive ? { color: platform.color } : undefined}
                        className={cn(!isActive && 'text-slate-600')}
                      >
                        {platform.name}
                      </span>
                    </button>
                  )
                })}
              </div>

              {/* PlatformRulesBar */}
              <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.1em] text-slate-400">
                  Platform kuralları
                </p>
                <ul className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                  {PAZARYERI_DEMO_DATA[activeContentType][activePlatform].rules.map((rule, i) => {
                    const RuleIcon = RULE_ICONS[rule.icon as RuleIconKey]
                    return (
                      <li key={i} className="flex items-center gap-2">
                        {RuleIcon && (
                          <RuleIcon size={13} strokeWidth={2} className="shrink-0 text-slate-400" />
                        )}
                        <span className="text-xs text-slate-600">{rule.text}</span>
                      </li>
                    )
                  })}
                </ul>
              </div>

              {/* Output area */}
              {activeContentType === 'text' && (
                <TextContentRenderer
                  key={`text-${activePlatform}`}
                  fields={PAZARYERI_DEMO_DATA.text[activePlatform].fields}
                  platformColor={PLATFORMS[activePlatform].color}
                  animKey={`text-${activePlatform}`}
                />
              )}
              {activeContentType === 'image' && (
                <ImageContentRenderer
                  key={`image-${activePlatform}`}
                  gallery={PAZARYERI_DEMO_DATA.image[activePlatform].gallery}
                  styleNote={PAZARYERI_DEMO_DATA.image[activePlatform].styleNote}
                  platformColor={PLATFORMS[activePlatform].color}
                  platformBgColor={PLATFORMS[activePlatform].bgColor}
                  animKey={`image-${activePlatform}`}
                />
              )}
              {activeContentType !== 'text' && activeContentType !== 'image' && (
                <div className="min-h-[200px] bg-slate-50 rounded-lg border border-dashed border-slate-300 p-4 flex items-center justify-center text-sm text-slate-400">
                  {activeContentType === 'video' && 'Video çıktısı (PZ-09)'}
                  {activeContentType === 'social' && 'Sosyal medya çıktısı (PZ-10)'}
                </div>
              )}

            </div>
          </div>
        </div>

        {/* CTA Footer — PZ-07 sonrası */}
      </div>
    </section>
  )
}
