'use client'

// P3-A5 — Marka Bilgileri Section

import { useRef, useState } from "react"
import { ArrowRight, Check, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { Eyebrow } from "@/components/primitives/Eyebrow"
import Badge from "@/components/primitives/Badge"
import {
  MB_HEADER,
  MB_CTA,
  MB_HINT,
  BRAND_FEATURES,
  BRAND_FORM_FIELDS,
  TONE_CHIPS,
} from "@/lib/constants/marka-bilgileri"
import type { ToneKey } from "@/lib/constants/marka-bilgileri"
import { EXAMPLE_CONTENT_TR } from "@/lib/data/exampleContent"

// ---- BrandFormPreview ----

interface BrandFormPreviewProps {
  selectedTone: ToneKey
  onToneChange: (tone: ToneKey) => void
}

function BrandFormPreview({ selectedTone, onToneChange }: BrandFormPreviewProps) {
  const radioGroupRef = useRef<HTMLDivElement>(null)

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let nextIndex = -1
    if (e.key === "ArrowRight") {
      e.preventDefault()
      nextIndex = (index + 1) % TONE_CHIPS.length
    } else if (e.key === "ArrowLeft") {
      e.preventDefault()
      nextIndex = (index - 1 + TONE_CHIPS.length) % TONE_CHIPS.length
    }
    if (nextIndex >= 0) {
      onToneChange(TONE_CHIPS[nextIndex].key)
      const buttons = radioGroupRef.current?.querySelectorAll<HTMLButtonElement>('[role="radio"]')
      buttons?.[nextIndex]?.focus()
    }
  }

  const currentTone = TONE_CHIPS.find((t) => t.key === selectedTone)!

  return (
    <div className="bg-white rounded-xl border border-rd-neutral-200 p-6 lg:p-8">
      {/* Kart header */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-xs font-medium text-rd-neutral-500 uppercase tracking-widest">
          Marka Profili
        </p>
        <Badge variant="success" size="sm">
          Aktif
        </Badge>
      </div>

      {/* Statik alanlar (örnek) */}
      <div className="space-y-4 mb-6">
        <div>
          <p className="text-xs text-rd-neutral-500 mb-1.5">{BRAND_FORM_FIELDS.storeName.label}</p>
          <div className="bg-rd-primary-50 border border-rd-primary-200 rounded-lg px-3 py-2.5 text-sm text-rd-primary-800 font-medium">
            {BRAND_FORM_FIELDS.storeName.value}
          </div>
        </div>
        <div>
          <p className="text-xs text-rd-neutral-500 mb-1.5">{BRAND_FORM_FIELDS.targetAudience.label}</p>
          <div className="bg-rd-neutral-50 border border-rd-neutral-200 rounded-lg px-3 py-2.5 text-sm text-rd-neutral-700 font-medium">
            {BRAND_FORM_FIELDS.targetAudience.value}
          </div>
        </div>
      </div>

      {/* Metin tonu radio group */}
      <p className="text-xs text-rd-neutral-500 mb-2">Metin tonu</p>
      <div
        ref={radioGroupRef}
        role="radiogroup"
        aria-label="Metin tonu seçimi"
        className="flex flex-wrap gap-2"
      >
        {TONE_CHIPS.map((tone, index) => (
          <button
            key={tone.key}
            role="radio"
            aria-checked={selectedTone === tone.key}
            tabIndex={selectedTone === tone.key ? 0 : -1}
            onClick={() => onToneChange(tone.key)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={cn(
              "px-3.5 py-2 rounded-lg text-xs font-medium transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rd-primary focus-visible:ring-offset-2",
              selectedTone === tone.key
                ? "bg-rd-primary text-white"
                : "bg-rd-neutral-100 text-rd-neutral-600 hover:bg-rd-neutral-200"
            )}
          >
            {tone.label}
          </button>
        ))}
      </div>

      {/* AI çıktı önizleme */}
      <div className="border-t border-rd-neutral-200 my-6" aria-hidden="true" />
      <div
        className="bg-rd-neutral-50 rounded-lg p-4"
        aria-live="polite"
        aria-atomic="true"
      >
        <Eyebrow
          color="accent"
          icon={<Sparkles size={14} aria-hidden="true" />}
          className="mb-3"
        >
          AI çıktısı — {currentTone.label.toLowerCase()} tonda
        </Eyebrow>
        <p
          key={selectedTone}
          className="text-sm text-rd-neutral-700 leading-relaxed animate-output-fade-in"
        >
          {currentTone.output}
        </p>
        <p className="text-xs text-rd-neutral-500 mt-3 flex items-center gap-1">
          <Check size={12} strokeWidth={2} aria-hidden="true" />
          Her üretimde otomatik uygulanır
        </p>
      </div>

      {/* Marka ile üretilen örnek */}
      <div className="mt-5 rounded-xl border border-rd-accent-200 bg-rd-accent-50 p-4">
        <p className="text-[10px] font-medium uppercase tracking-widest text-rd-accent-700 mb-3">
          Marka ile üretilen
        </p>
        <p className="text-xs font-medium text-rd-neutral-900 leading-snug mb-2">
          {EXAMPLE_CONTENT_TR.metin.trendyol.title}
        </p>
        <ul className="space-y-1 mb-3">
          {EXAMPLE_CONTENT_TR.metin.trendyol.features.slice(0, 2).map((f, i) => (
            <li key={i} className="flex items-start gap-1.5 text-xs text-rd-neutral-700">
              <span className="w-1 h-1 rounded-full bg-rd-accent-500 mt-1.5 shrink-0" />
              {f}
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-1">
          {EXAMPLE_CONTENT_TR.metin.trendyol.tags.slice(0, 4).map((tag, i) => (
            <span key={i} className="text-[9px] bg-white border border-rd-neutral-200 text-rd-neutral-600 px-1.5 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

// ---- MarkaBilgileriSection ----

export default function MarkaBilgileriSection() {
  const [selectedTone, setSelectedTone] = useState<ToneKey>("samimi")

  return (
    <section
      className="bg-rd-neutral-50 py-16 md:py-20"
      aria-label="Marka bilgileri"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

          {/* Sol kolon */}
          <div>
            <Eyebrow
              color="accent"
              icon={<Sparkles size={14} aria-hidden="true" />}
              className="bg-rd-accent-50 px-3 py-1.5 rounded-full mb-4"
            >
              {MB_HEADER.eyebrow}
            </Eyebrow>

            <h2 className="font-rd-display text-3xl md:text-4xl font-medium tracking-tight text-rd-neutral-900">
              {MB_HEADER.title}
            </h2>

            <p className="text-base text-rd-neutral-600 leading-relaxed mt-4">
              {MB_HEADER.subtitle}
            </p>

            {/* 8 alan listesi */}
            <div className="mt-8 space-y-4">
              {BRAND_FEATURES.map((feature) => (
                <div key={feature.title} className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-xl bg-rd-accent-50 flex items-center justify-center shrink-0">
                    <feature.icon
                      size={18}
                      strokeWidth={1.5}
                      className="text-rd-accent-700"
                      aria-hidden="true"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-rd-neutral-900">{feature.title}</p>
                    <p className="text-sm text-rd-neutral-600 mt-0.5">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <a
              href={MB_CTA.href}
              className="mt-8 inline-flex items-center gap-2 text-rd-primary font-medium text-sm hover:text-rd-primary-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rd-primary focus-visible:ring-offset-2 rounded"
            >
              {MB_CTA.text}
              <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
            </a>
          </div>

          {/* Sağ kolon — BrandFormPreview */}
          <BrandFormPreview
            selectedTone={selectedTone}
            onToneChange={setSelectedTone}
          />
        </div>

        <p className="text-center text-sm text-rd-neutral-500 italic mt-8 lg:mt-12">
          {MB_HINT}
        </p>
      </div>
    </section>
  )
}
