'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import {
  RotateCcw, ChevronRight, Sparkles, Download,
  ImagePlus, PenLine,
  FileText, PlayCircle, MessageSquare,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Hızlı video — 2x hızda 360° dönüş
function HizliVideo({ className }: { className?: string }) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = 2.0
  }, [])
  return (
    <video
      ref={videoRef}
      src="/video-ornekler/360-donus.mp4"
      autoPlay
      loop
      muted
      playsInline
      onLoadedData={() => setLoaded(true)}
      className={`${className ?? ""} transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
      aria-hidden="true"
    />
  )
}

const STEP_DURATION = 3000

// ---- Step 1 canvas: Ürünü tanıt ----

function Step1Canvas({ reduced, inactive }: { reduced: boolean; inactive?: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'flex flex-col items-center justify-center gap-3 px-4 py-4 transition-opacity duration-300',
        inactive && 'opacity-60',
      )}
    >
      {/* ImagePlus VEYA PenLine yatay */}
      <div className={cn('flex items-center gap-3', !reduced && !inactive && 'animate-step-photo-in')}>
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-1.5 rounded-xl bg-rd-warm-50 border border-rd-warm-200 px-4 py-2.5">
            <ImagePlus size={20} strokeWidth={1.5} className="text-rd-warm-700 shrink-0" />
            <span className="text-xs text-rd-warm-700 font-medium">Fotoğraf</span>
          </div>
        </div>
        <span
          className={cn(
            'text-xs uppercase tracking-[0.15em] text-rd-neutral-400 font-medium',
            !reduced && !inactive && 'animate-step-or-fade',
          )}
        >
          VEYA
        </span>
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-1.5 rounded-xl border border-rd-neutral-200 bg-rd-neutral-50 px-4 py-2.5">
            <PenLine size={20} strokeWidth={1.5} className="text-rd-neutral-500 shrink-0" />
            <span className="text-xs text-rd-neutral-500 font-medium">Açıklama</span>
          </div>
        </div>
      </div>
      {/* Typing preview */}
      <div className={cn('w-full max-w-[220px]', !reduced && !inactive && 'animate-step-text-in')}>
        <div className="rounded-lg border border-rd-neutral-200 bg-rd-neutral-50 px-3 py-2">
          <p className="text-xs text-rd-neutral-400 leading-snug">
            Profesyonel basketbol topu 7 numara FIBA...
          </p>
        </div>
      </div>
    </div>
  )
}

// ---- Step 2 canvas: Pazaryeri ve içerik seç ----

const MARKET_CHIPS = [
  { label: 'Trendyol', pulse: true },
  { label: 'Hepsiburada', pulse: false },
  { label: 'Amazon TR', pulse: false },
  { label: 'Amazon USA', pulse: false },
  { label: 'N11', pulse: false },
  { label: 'Etsy', pulse: false },
  { label: 'Çiçeksepeti', pulse: false },
]

const CONTENT_CHIPS = [
  { label: 'Metin' },
  { label: 'Görsel' },
  { label: 'Video' },
  { label: 'Sosyal' },
]

function Step2Canvas({ reduced, inactive }: { reduced: boolean; inactive?: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'flex flex-col gap-3 px-4 py-4 transition-opacity duration-300',
        inactive && 'opacity-60',
      )}
    >
      <div>
        <p className="text-xs uppercase tracking-[0.1em] text-rd-neutral-400 mb-1.5">
          Pazaryerleri
        </p>
        <div className="flex flex-wrap gap-1.5">
          {MARKET_CHIPS.map((chip, i) => (
            <span
              key={chip.label}
              className={cn(
                'text-xs font-medium px-2 py-0.5 rounded-full border transition-colors',
                chip.pulse
                  ? 'border-rd-primary-700 bg-rd-primary-50 text-rd-primary-700'
                  : 'border-rd-neutral-300 bg-white text-rd-neutral-500',
                !reduced && !inactive && `animate-step-chip-${i}`,
                chip.pulse && !reduced && !inactive && 'animate-pulse-soft',
              )}
            >
              {chip.label}
            </span>
          ))}
        </div>
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.1em] text-rd-neutral-400 mb-1.5">
          İçerik türleri
        </p>
        <div className="flex flex-wrap gap-1.5">
          {CONTENT_CHIPS.map((chip, i) => (
            <span
              key={chip.label}
              className={cn(
                'text-xs font-medium px-2 py-0.5 rounded-full border transition-colors',
                'border-rd-primary-700 bg-rd-primary-50 text-rd-primary-700',
                !reduced && !inactive && `animate-step-chip-${i + 5}`,
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
    content: 'Profesyonel Kompozit Deri Basketbol Topu 7 Numara...',
    isText: true,
    isVideo: false,
  },
  {
    icon: null,
    label: 'Görsel',
    colorClass: 'text-rd-primary-700',
    animClass: 'animate-step-card-2',
    imgSrc: '/ornek_beyaz.jpg',
    isText: false,
    isVideo: false,
  },
  {
    icon: PlayCircle,
    label: 'Video',
    colorClass: 'text-rd-primary-700',
    animClass: 'animate-step-card-3',
    content: null,
    isText: false,
    isVideo: true,
  },
  {
    icon: MessageSquare,
    label: 'Sosyal',
    colorClass: 'text-rd-primary-700',
    animClass: 'animate-step-card-4',
    content: 'Sahaya çıkmadan önce doğru top şart...',
    isText: true,
    isVideo: false,
  },
]

function Step3Canvas({ reduced, inactive }: { reduced: boolean; inactive?: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'flex flex-col gap-2.5 px-4 py-4 transition-opacity duration-300',
        inactive && 'opacity-60',
      )}
    >
      <div className={cn('flex items-center gap-1.5', !reduced && !inactive && 'animate-step-sparkle-in')}>
        <Sparkles size={13} strokeWidth={2} className="text-rd-primary-700" />
        <span className="text-xs text-rd-neutral-500 font-medium">AI üretiyor...</span>
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
                !reduced && !inactive && card.animClass,
              )}
            >
              <div className="flex items-center gap-1 mb-1">
                {Icon && <Icon size={10} strokeWidth={1.5} className={card.colorClass} />}
                <span className={cn('text-xs font-medium', card.colorClass)}>{card.label}</span>
              </div>
              {card.isText ? (
                <p className="text-xs text-rd-neutral-500 leading-snug line-clamp-2">{card.content}</p>
              ) : card.isVideo ? (
                <HizliVideo className="h-8 w-full rounded object-contain bg-rd-neutral-100" />
              ) : 'imgSrc' in card ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={card.imgSrc as string} alt={card.label} className="h-7 w-full rounded object-contain bg-rd-neutral-50" />
              ) : (
                <div className="h-7 w-full rounded bg-rd-neutral-200" />
              )}
            </div>
          )
        })}
      </div>
      <button
        tabIndex={-1}
        aria-hidden="true"
        className={cn(
          'self-start mt-0.5 flex items-center gap-1.5 text-xs font-medium',
          'text-rd-primary-700 border border-rd-primary-200 rounded-lg px-2.5 py-1.5',
          'bg-rd-primary-50',
          !reduced && !inactive && 'animate-step-download-in',
        )}
      >
        <Download size={11} strokeWidth={2} />
        İndir
      </button>
    </div>
  )
}

// ---- Step config ----

const STEPS = [
  {
    number: '1',
    title: 'Fotoğraf VE/VEYA kısa açıklama',
    description: 'Fotoğraf yükle, barkod tara veya bilgileri kendin gir.',
    Canvas: Step1Canvas,
  },
  {
    number: '2',
    title: 'Pazaryeri ve içerik seç',
    description: 'Hangi platformlar için, hangi içerik türleri — sen seçersin.',
    Canvas: Step2Canvas,
  },
  {
    number: '3',
    title: 'AI senin için hazırlasın',
    description: 'Saniyeler içinde platform kurallarına uygun içerik hazır.',
    Canvas: Step3Canvas,
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
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto_1fr] gap-2 md:gap-0 md:items-stretch">
        {STEPS.map((step, i) => {
          const isActive = currentStep === i
          const StepCanvas = step.Canvas

          return (
            <>
              {/* Step card */}
              <div
                key={`step-${i}`}
                className={cn(
                  'rounded-xl border transition-all duration-300 overflow-hidden flex flex-col',
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
                        'font-rd-display font-medium text-sm tabular-nums leading-none',
                        isActive ? 'text-rd-primary-700' : 'text-rd-neutral-400',
                      )}
                    >
                      {step.number}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p
                      className={cn(
                        'text-base font-semibold transition-colors duration-300 leading-snug',
                        isActive ? 'text-rd-neutral-900' : 'text-rd-neutral-500',
                      )}
                    >
                      {step.title}
                    </p>
                    <p className={cn(
                      'text-xs leading-snug mt-0.5 hidden md:block',
                      isActive ? 'text-rd-neutral-500' : 'text-rd-neutral-400',
                    )}>
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Canvas — flex-1 so all cards fill equal height */}
                <div className="flex-1 flex flex-col justify-center">
                  {isActive ? (
                    <div key={animKey}>
                      <StepCanvas reduced={reduced} inactive={false} />
                    </div>
                  ) : (
                    <StepCanvas reduced={reduced} inactive={true} />
                  )}
                </div>
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

      {reduced && (
        <p className="sr-only">
          3 adım: Fotoğraf veya açıklama ver, pazaryeri seç, AI üretsin.
        </p>
      )}
    </div>
  )
}
