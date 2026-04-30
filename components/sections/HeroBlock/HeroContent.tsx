'use client'

import Link from 'next/link'
import { ArrowRight, Check, Plug, CreditCard, Target, Zap } from 'lucide-react'
import { HERO_COPY, HERO_TRUST_PILLS, NAV_CTAS } from '@/lib/constants/hero'
import Button from '@/components/primitives/Button'

// const VideoModal = dynamic(() => import('./VideoModal'), { ssr: false })
// Video CTA geçici olarak pasife çekildi — video hazırlanınca aç (LP-04)

const TRUST_PILL_ICONS: Record<string, React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>> = {
  Plug,
  CreditCard,
  Target,
  Zap,
}

export default function HeroContent() {

  return (
    <div className="animate-hero-float-in-left">
      {/* Eyebrow pill */}
      <div className="inline-flex items-center gap-2 rounded-full border border-rd-primary-200 bg-rd-primary-50 px-3.5 py-1.5">
        <span
          className="h-1.5 w-1.5 rounded-full bg-rd-primary-500 animate-[pulse-soft_2s_ease-in-out_infinite]"
          aria-hidden="true"
        />
        <span className="font-rd-body text-xs font-semibold tracking-wide text-rd-primary-700">
          {HERO_COPY.eyebrow}
        </span>
      </div>

      {/* H1 — 3-part: plain + highlight + plain */}
      <h1
        className="mt-6 font-rd-display font-bold leading-[1.05] tracking-[-0.025em] text-rd-neutral-900"
        style={{ fontSize: 'clamp(40px, 5.5vw, 64px)' }}
      >
        {HERO_COPY.h1Pre}{' '}
        <span className="text-rd-primary-700">{HERO_COPY.h1Highlight}</span>{' '}
        {HERO_COPY.h1Post}
      </h1>

      {/* Subtitle */}
      <p className="mb-8 mt-5 max-w-[520px] text-lg leading-relaxed text-rd-neutral-600">
        Ürününü anlat veya fotoğrafını yükle — listing metni, stüdyo görseli, tanıtım videosu
        ve sosyal medya içeriği{' '}
        <strong className="font-semibold text-rd-neutral-900">dakikalar içinde</strong>{' '}
        hazır. Aylık abonelik yok.
      </p>

      {/* Trust pills */}
      <div className="flex flex-wrap gap-2" role="list" aria-label="Özellikler">
        {HERO_TRUST_PILLS.map((pill) => {
          const Icon = TRUST_PILL_ICONS[pill.icon]
          return (
            <div
              key={pill.label}
              role="listitem"
              className="flex items-center gap-1.5 rounded-lg border border-rd-neutral-200 bg-white px-3 py-2 text-sm font-medium text-rd-neutral-700 transition-all duration-150 hover:border-rd-neutral-300 hover:bg-rd-neutral-50"
            >
              {Icon && (
                <Icon
                  size={14}
                  strokeWidth={2.2}
                  className="text-rd-primary-700"
                  aria-hidden="true"
                />
              )}
              {pill.label}
            </div>
          )
        })}
      </div>

      {/* CTA group */}
      <div className="mb-5 mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
        <Link href={NAV_CTAS.primary.href} tabIndex={-1} className="w-full sm:w-auto">
          <Button
            variant="primary"
            size="lg"
            className="w-full sm:w-auto"
            iconRight={<ArrowRight size={16} strokeWidth={2.5} aria-hidden="true" />}
          >
            {HERO_COPY.ctaPrimary}
          </Button>
        </Link>
        {/* "Nasıl çalışır?" video CTA — LP-04: pasife çekildi, video hazırlanınca aç
        <button
          type="button"
          onClick={() => setVideoOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-[15px] font-medium text-slate-600 transition-colors duration-200 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rd-primary-500"
          aria-label="Nasıl çalışır videosunu izle"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100">
            <Play size={12} fill="currentColor" className="text-rd-primary-700" />
          </span>
          {HERO_COPY.ctaSecondary}
        </button>
        */}
      </div>

      {/* Reassurance line */}
      <div className="flex items-center gap-2 text-sm text-rd-neutral-500">
        <Check
          size={14}
          strokeWidth={2.5}
          className="shrink-0 text-emerald-500"
          aria-hidden="true"
        />
        <span>{HERO_COPY.reassurance}</span>
      </div>

      {/* <VideoModal isOpen={videoOpen} onClose={() => setVideoOpen(false)} /> */}
    </div>
  )
}
