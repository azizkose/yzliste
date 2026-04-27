import Link from 'next/link'
import { Zap, Play, Check, Plug, CreditCard, Target } from 'lucide-react'
import { HERO_COPY, HERO_TRUST_PILLS, NAV_CTAS } from '@/lib/constants/hero'
import Button from '@/components/primitives/Button'

const TRUST_PILL_ICONS: Record<string, React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>> = {
  Plug,
  CreditCard,
  Target,
  Zap,
}

export default function HeroContent() {
  return (
    <div className="flex flex-col gap-8">
      {/* Eyebrow with pulse dot */}
      <div className="flex items-center gap-2">
        <span
          className="inline-block h-2 w-2 animate-pulse rounded-full bg-rd-content-social"
          aria-hidden="true"
        />
        <span className="font-rd-body text-xs font-semibold uppercase tracking-[0.1em] text-rd-primary">
          {HERO_COPY.eyebrow}
        </span>
      </div>

      {/* H1 — 3-part: plain + highlight + plain */}
      <h1
        className="font-rd-display font-bold leading-[1.15] tracking-[-0.02em] text-slate-900"
        style={{ fontSize: 'clamp(40px, 5vw, 64px)' }}
      >
        {HERO_COPY.h1Pre}{' '}
        <span className="text-rd-primary">{HERO_COPY.h1Highlight}</span>{' '}
        {HERO_COPY.h1Post}
      </h1>

      {/* Subtitle */}
      <p className="max-w-[480px] text-lg leading-relaxed text-slate-600">
        {HERO_COPY.sub}
      </p>

      {/* Trust pills */}
      <div className="flex flex-wrap gap-2" role="list" aria-label="Özellikler">
        {HERO_TRUST_PILLS.map((pill) => {
          const Icon = TRUST_PILL_ICONS[pill.icon]
          return (
            <div
              key={pill.label}
              role="listitem"
              className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 transition-colors hover:border-rd-primary-200 hover:bg-rd-primary-50"
            >
              {Icon && (
                <Icon
                  size={13}
                  strokeWidth={2}
                  className="text-rd-primary"
                  aria-hidden="true"
                />
              )}
              <span className="text-xs font-medium text-slate-700">{pill.label}</span>
            </div>
          )
        })}
      </div>

      {/* CTA group */}
      <div className="flex flex-wrap items-center gap-3">
        <Link href={NAV_CTAS.primary.href} tabIndex={-1}>
          <Button
            variant="primary"
            size="lg"
            icon={<Zap size={16} aria-hidden="true" />}
          >
            {HERO_COPY.ctaPrimary}
          </Button>
        </Link>
        <Button
          variant="ghost"
          size="lg"
          icon={<Play size={16} aria-hidden="true" />}
        >
          {HERO_COPY.ctaSecondary}
        </Button>
      </div>

      {/* Reassurance line */}
      <div className="flex items-center gap-1.5 text-sm text-slate-500">
        <Check
          size={13}
          strokeWidth={2}
          className="shrink-0 text-rd-content-social"
          aria-hidden="true"
        />
        <span>{HERO_COPY.reassurance}</span>
      </div>
    </div>
  )
}
