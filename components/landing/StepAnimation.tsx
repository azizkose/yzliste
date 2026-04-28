'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  RotateCcw, ChevronRight, Sparkles, Download,
  ImagePlus, PenLine,
  FileText, Image as ImageIcon, PlayCircle, MessageSquare,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const STEP_DURATION = 3000

// ---- Step 1 canvas: Ürünü tanıt ----

function Step1Canvas({ reduced }: { reduced: boolean }) {
  return (
    <div
      aria-hidden="true"
      className="flex flex-col items-center justify-center gap-2.5 min-h-[140px] px-4 py-3"
    >
      {/* Foto yükle kutusu */}
      <div className={cn('flex flex-col items-center gap-1', !reduced && 'animate-step-photo-in')}>
        <div className="flex items-center gap-2 rounded-xl bg-rd-warm-50 border border-rd-warm-200 px-3 py-2">
          <ImagePlus size={18} strokeWidth={1.5} className="text-rd-warm-700 shrink-0" />
          <span className="text-[10px] text-rd-warm-700 font-medium">Fotoğraf yükle</span>
        </div>
      </div>
      <span
        className={cn(
          'text-[9px] uppercase tracking-[0.15em] text-rd-neutral-400 font-medium',
          !reduced && 'animate-step-or-fade',
        )}
      >
        VEYA
      </span>
      {/* Metin gir kutusu */}
      <div className={cn('w-full max-w-[200px]', !reduced && 'animate-step-text-in')}>
        <div className="flex items-start gap-2 rounded-lg border border-rd-neutral-200 bg-rd-neutral-50 px-3 py-2">
          <PenLine size={13} strokeWidth={1.5} className="text-rd-neutral-400 mt-0.5 shrink-0" />
          <p className="text-[10px] text-rd-neutral-400 leading-snug">
            Selin Porselen Çiçek Desenli Kahve Fincanı 6&apos;lı Set 80ml...
          </p>
        </div>
      </div>
    </div>
  )
}

// ---- Step 2 canvas: Pazaryeri ve içerik seç ----

const MARKET_CHIPS = [
  { label: 'Trendyol', active: true },
  { label: 'Hepsiburada', active: true },
  { label: 'Amazon TR', active: true },
  { label: 'Amazon USA', active: false },
  { label: 'N11', active: false },
  { label: 'Etsy', active: false },
  { label: 'Çiçeksepeti', active: false },
]

const CONTENT_CHIPS = [
  { label: 'Metin', active: true },
  { label: 'Görsel', active: true },
  { label: 'Video', active: false },
  { label: 'Sosyal', active: false },
]

function Step2Canvas({ reduced }: { reduced: boolean }) {
  return (
    <div aria-hidden="true" className="flex flex-col gap-3 px-4 py-3 min-h-[140px]">
      <div>
        <p className="text-[9px] uppercase tracking-[0.1em] text-rd-neutral-400 mb-1.5">
          Pazaryerleri
        </p>
        <div className="flex flex-wrap gap-1.5">
          {MARKET_CHIPS.map((chip, i) => (
            <span
              key={chip.label}
              className={cn(
                'text-[10px] font-medium px-2 py-0.5 rounded-full border transition-colors',
                chip.active
                  ? 'border-rd-primary-700 bg-rd-primary-50 text-rd-primary-700'
                  : 'border-rd-neutral-300 bg-white text-rd-neutral-500',
                !reduced && `animate-step-chip-${i}`,
              )}
            >
              {chip.label}
            </span>
          ))}
        </div>
      </div>
      <div>
        <p className="text-[9px] uppercase tracking-[0.1em] text-rd-neutral-400 mb-1.5">
          İçerik türleri
        </p>
        <div className="flex flex-wrap gap-1.5">
          {CONTENT_CHIPS.map((chip, i) => (
            <span
              key={chip.label}
              className={cn(
                'text-[10px] font-medium px-2 py-0.5 rounded-full border transition-colors',
                chip.active
                  ? 'border-rd-primary-700 bg-rd-primary-50 text-rd-primary-700'
                  : 'border-rd-neutral-300 bg-white text-rd-neutral-500',
                !reduced && `animate-step-chip-${i + 5}`,
              )}
            >
              {chip.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

// ---- Step 3 canvas: AI hazırlasın — 4 çıktı kartı ----

const OUTPUT_CARDS_STEP3 = [
  {
    icon: FileText,
    label: 'Listing',
    colorClass: 'text-rd-primary-700',
    animClass: 'animate-step-card-1',
    content: 'Selin Porselen Çiçek Desenli Kahve Fincanı 6\'lı Set...',
    isText: true,
  },
  {
    icon: ImageIcon,
    label: 'Görsel',
    colorClass: 'text-violet-600',
    animClass: 'animate-step-card-2',
    content: null,
    isText: false,
  },
  {
    icon: PlayCircle,
    label: 'Video',
    colorClass: 'text-red-500',
    animClass: 'animate-step-card-3',
    content: null,
    isText: false,
  },
  {
    icon: MessageSquare,
    label: 'Sosyal',
    colorClass: 'text-emerald-600',
    animClass: 'animate-step-card-4',
    content: 'Sabah kahvenizi daha özel kılacak bir set var...',
    isText: true,
  },
]

function Step3Canvas({ reduced }: { reduced: boolean }) {
  return (
    <div aria-hidden="true" className="flex flex-col gap-2.5 px-4 py-3 min-h-[140px]">
      <div className={cn('flex items-center gap-1.5', !reduced && 'animate-step-sparkle-in')}>
        <Sparkles size={13} strokeWidth={2} className="text-rd-primary-700" />
        <span className="text-[10px] text-rd-neutral-500 font-medium">AI üretiyor...</span>
      </div>
      {/* 4 çıktı kartı 2×2 grid */}
      <div className="grid grid-cols-2 gap-1.5">
        {OUTPUT_CARDS_STEP3.map((card) => {
          const Icon = card.icon
          return (
            <div
              key={card.label}
              className={cn(
                'rounded-lg border border-rd-neutral-200 bg-white p-2',
                !reduced && card.animClass,
              )}
            >
              <div className="flex items-center gap-1 mb-1">
                <Icon size={10} strokeWidth={1.5} className={card.colorClass} />
                <span className={cn('text-[9px] font-medium', card.colorClass)}>{card.label}</span>
              </div>
              {card.isText ? (
                <p className="text-[9px] text-rd-neutral-500 leading-snug line-clamp-2">{card.content}</p>
              ) : (
                <div className="h-6 w-full rounded bg-rd-neutral-100 flex items-center justify-center">
                  <Icon size={12} strokeWidth={1.5} className="text-rd-neutral-300" />
                </div>
              )}
            </div>
          )
        })}
      </div>
      <button
        tabIndex={-1}
        aria-hidden="true"
        className={cn(
          'self-start mt-0.5 flex items-center gap-1.5 text-[10px] font-medium',
          'text-rd-primary-700 border border-rd-primary-200 rounded-lg px-2.5 py-1.5',
          'bg-rd-primary-50',
          !reduced && 'animate-step-download-in',
        )}
      >
        <Download size={11} strokeWidth={2} />
        İndir
      </button>
    </div>
  )
}

// ---- Step 1 static (inactive) ----
function Step1Static() {
  return (
    <div
      aria-hidden="true"
      className="flex flex-col items-center justify-center gap-2 min-h-[140px] px-4 py-3 opacity-40"
    >
      <div className="flex items-center gap-2 rounded-xl bg-rd-warm-50 border border-rd-warm-200 px-3 py-2">
        <ImagePlus size={16} strokeWidth={1.5} className="text-rd-warm-700 shrink-0" />
        <span className="text-[10px] text-rd-warm-700">Fotoğraf yükle</span>
      </div>
      <div className="w-full max-w-[160px] rounded-lg border border-rd-neutral-200 bg-rd-neutral-50 px-3 py-2">
        <p className="text-[10px] text-rd-neutral-400 leading-snug">Selin Porselen...</p>
      </div>
    </div>
  )
}

// ---- Step 2 static (inactive) ----
function Step2Static() {
  return (
    <div
      aria-hidden="true"
      className="flex flex-col gap-2.5 px-4 py-3 min-h-[140px] opacity-40"
    >
      <div className="flex flex-wrap gap-1.5">
        {MARKET_CHIPS.map((chip) => (
          <span
            key={chip.label}
            className={cn(
              'text-[10px] font-medium px-2 py-0.5 rounded-full border',
              chip.active
                ? 'border-rd-primary-700 bg-rd-primary-50 text-rd-primary-700'
                : 'border-rd-neutral-300 bg-white text-rd-neutral-500',
            )}
          >
            {chip.label}
          </span>
        ))}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {CONTENT_CHIPS.map((chip) => (
          <span
            key={chip.label}
            className={cn(
              'text-[10px] font-medium px-2 py-0.5 rounded-full border',
              chip.active
                ? 'border-rd-primary-700 bg-rd-primary-50 text-rd-primary-700'
                : 'border-rd-neutral-300 bg-white text-rd-neutral-500',
            )}
          >
            {chip.label}
          </span>
        ))}
      </div>
    </div>
  )
}

// ---- Step 3 static (inactive) ----
function Step3Static() {
  return (
    <div
      aria-hidden="true"
      className="flex flex-col gap-2.5 px-4 py-3 min-h-[140px] opacity-40"
    >
      <div className="flex items-center gap-1.5">
        <Sparkles size={13} strokeWidth={2} className="text-rd-primary-700" />
        <span className="text-[10px] text-rd-neutral-500 font-medium">AI üretiyor...</span>
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        {OUTPUT_CARDS_STEP3.map((card) => {
          const Icon = card.icon
          return (
            <div key={card.label} className="rounded-lg border border-rd-neutral-200 bg-white p-2">
              <div className="flex items-center gap-1 mb-1">
                <Icon size={10} strokeWidth={1.5} className={card.colorClass} />
                <span className={cn('text-[9px] font-medium', card.colorClass)}>{card.label}</span>
              </div>
              <div className="h-5 w-full rounded bg-rd-neutral-100" />
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ---- Step config ----

const STEPS = [
  {
    number: '1',
    title: 'Ürünü tanıt',
    description: 'Fotoğraf yükle, barkod tara veya bilgileri kendin gir.',
    ActiveCanvas: Step1Canvas,
    StaticCanvas: Step1Static,
  },
  {
    number: '2',
    title: 'Pazaryeri ve içerik seç',
    description: 'Hangi platformlar için, hangi içerik türleri — sen seçersin.',
    ActiveCanvas: Step2Canvas,
    StaticCanvas: Step2Static,
  },
  {
    number: '3',
    title: 'AI senin için hazırlasın',
    description: 'Saniyeler içinde platform kurallarına uygun içerik hazır.',
    ActiveCanvas: Step3Canvas,
    StaticCanvas: Step3Static,
  },
]

// ---- StepAnimation ----

export function StepAnimation() {
  const [currentStep, setCurrentStep] = useState(0)
  const [animKey, setAnimKey] = useState(0)
  const [cycleKey, setCycleKey] = useState(0)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    if (reduced) return
    const interval = setInterval(() => {
      setCurrentStep((s) => (s + 1) % 3)
      setAnimKey((k) => k + 1)
    }, STEP_DURATION)
    return () => clearInterval(interval)
  }, [reduced, cycleKey])

  const handleReplay = useCallback(() => {
    setCurrentStep(0)
    setAnimKey((k) => k + 1)
    setCycleKey((k) => k + 1)
  }, [])

  const progressWidth = `${((currentStep + 1) / 3) * 100}%`

  return (
    <div role="region" aria-label="3 adım üretim animasyonu" className="relative pt-6">
      {/* Replay button */}
      <div className="absolute top-0 right-0">
        <button
          onClick={handleReplay}
          aria-label="Animasyonu baştan oynat"
          className={cn(
            'flex items-center gap-1 text-xs text-rd-neutral-500 hover:text-rd-neutral-700',
            'transition-colors focus-visible:outline-none focus-visible:ring-2',
            'focus-visible:ring-rd-primary-300 rounded px-1',
          )}
        >
          <RotateCcw size={13} strokeWidth={1.5} aria-hidden="true" />
          <span>Tekrar oynat</span>
        </button>
      </div>

      {/* Steps — desktop: row, mobile: col */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto_1fr] gap-2 md:gap-0 md:items-start">
        {STEPS.map((step, i) => {
          const isActive = currentStep === i
          const ActiveCanvas = step.ActiveCanvas
          const StaticCanvas = step.StaticCanvas

          return (
            <>
              {/* Step card */}
              <div
                key={`step-${i}`}
                className={cn(
                  'rounded-xl border transition-all duration-300 overflow-hidden',
                  isActive
                    ? 'border-2 border-rd-primary-700 bg-white'
                    : 'border border-rd-neutral-200 bg-rd-neutral-50',
                )}
                style={
                  isActive
                    ? { boxShadow: 'var(--shadow-rd-md)' }
                    : undefined
                }
              >
                {/* Card header */}
                <div className="flex items-start gap-3 px-4 pt-4 pb-1">
                  <div
                    className={cn(
                      'w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-300 shrink-0 mt-0.5',
                      isActive
                        ? 'border-rd-primary-700 bg-rd-primary-50 scale-110'
                        : 'border-rd-neutral-300 bg-white',
                    )}
                  >
                    <span
                      className={cn(
                        'font-rd-display font-bold text-sm tabular-nums leading-none',
                        isActive ? 'text-rd-primary-700' : 'text-rd-neutral-400',
                      )}
                    >
                      {step.number}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p
                      className={cn(
                        'text-sm font-medium transition-colors duration-300 leading-snug',
                        isActive ? 'text-rd-neutral-900' : 'text-rd-neutral-400',
                      )}
                    >
                      {step.title}
                    </p>
                    <p className="text-[11px] text-rd-neutral-400 leading-snug mt-0.5 hidden md:block">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Canvas */}
                {isActive ? (
                  <div key={animKey}>
                    <ActiveCanvas reduced={reduced} />
                  </div>
                ) : (
                  <StaticCanvas />
                )}
              </div>

              {/* Connector (between steps) */}
              {i < 2 && (
                <div
                  key={`connector-${i}`}
                  aria-hidden="true"
                  className="flex items-center justify-center py-1 md:py-0 md:px-1 md:mt-10"
                >
                  <ChevronRight
                    size={16}
                    strokeWidth={1.5}
                    className="text-rd-neutral-300 rotate-90 md:rotate-0"
                  />
                </div>
              )}
            </>
          )
        })}
      </div>

      {/* Progress bar */}
      <div
        aria-hidden="true"
        className="mt-4 h-0.5 bg-rd-neutral-200 rounded-full overflow-hidden"
      >
        <div
          className="h-full bg-rd-primary-700 rounded-full transition-all duration-500 ease-out"
          style={{ width: progressWidth }}
        />
      </div>

      {/* Mobile step description */}
      <p className="md:hidden text-xs text-rd-neutral-500 text-center mt-3">
        {STEPS[currentStep].description}
      </p>

      {/* Reduced motion: ImageIcon for decorative illustration hint */}
      {reduced && (
        <p className="sr-only">
          3 adım: Ürünü tanıt, pazaryeri seç, AI üretsin.
        </p>
      )}
    </div>
  )
}

