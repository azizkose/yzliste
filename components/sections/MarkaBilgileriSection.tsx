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
import { EXAMPLE_MARKA_KIYAS } from "@/lib/data/exampleContent"

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

      {/* Kıyas: marka boş vs marka dolu */}
      <div className="mt-5 space-y-2">
        {/* Marka bilgisi yokken */}
        <div className="rounded-xl border border-rd-neutral-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-rd-neutral-400 mb-2">
            {EXAMPLE_MARKA_KIYAS.markaBos.eyebrow}
          </p>
          <p className="text-xs font-medium text-rd-neutral-700 leading-snug">
            {EXAMPLE_MARKA_KIYAS.markaBos.baslik}
          </p>
          <p className="text-xs text-rd-neutral-400 mt-1">{EXAMPLE_MARKA_KIYAS.markaBos.aciklama}</p>
        </div>
        {/* Marka ile üretildiğinde */}
        <div className="rounded-xl border-2 border-rd-warm-300 bg-rd-warm-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-rd-warm-700 mb-2">
            {EXAMPLE_MARKA_KIYAS.markaDolu.eyebrow}
          </p>
          <p className="text-xs font-medium text-rd-neutral-900 leading-snug mb-2"
            style={{ fontFamily: "var(--font-rd-display)" }}>
            {EXAMPLE_MARKA_KIYAS.markaDolu.baslik}
          </p>
          <p className="text-xs text-rd-neutral-700 leading-relaxed mb-3">
            {EXAMPLE_MARKA_KIYAS.markaDolu.aciklama}
          </p>
          <div className="flex flex-wrap gap-1">
            {[
              EXAMPLE_MARKA_KIYAS.markaDolu.markaInputlari.storeName,
              EXAMPLE_MARKA_KIYAS.markaDolu.markaInputlari.ton,
              EXAMPLE_MARKA_KIYAS.markaDolu.markaInputlari.hedefKitle,
              ...EXAMPLE_MARKA_KIYAS.markaDolu.markaInputlari.hizmetVurgulari,
            ].map((chip, i) => (
              <span key={i} className="text-xs font-medium bg-rd-warm-100 text-rd-warm-800 border border-rd-warm-200 px-2 py-0.5 rounded-full">
                {chip}
              </span>
            ))}
          </div>
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
      className="bg-white py-16 md:py-20"
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

            <h2 className="font-rd-display text-3xl md:text-4xl font-bold tracking-[-0.01em] text-rd-neutral-900">
              {MB_HEADER.title}
            </h2>

            <p className="text-base text-rd-neutral-600 leading-relaxed mt-4">
              {MB_HEADER.subtitle}
            </p>

            <div className="mt-4 p-3 rounded-lg bg-rd-primary-50 border border-rd-primary-200">
              <p className="text-xs text-rd-primary-700 leading-relaxed">
                <strong className="font-semibold">Metin tonu</strong> kelime tercihini belirler —
                aynı bilgiler, farklı ses.{' '}
                <strong className="font-semibold">Marka bilgisi</strong> içeriğe ne kadar kişisel
                detay katar — mağaza adı, hedef kitle, hizmet vurguları.
              </p>
            </div>

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
