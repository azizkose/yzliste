import { ArrowRight } from 'lucide-react'
import { FINAL_CTA } from '@/lib/constants/final-cta'

export default function FinalCTASection() {
  return (
    <section className="relative overflow-hidden py-20 md:py-28" aria-labelledby="final-cta-heading">
      {/* Gradient background */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: 'linear-gradient(135deg, var(--color-rd-primary-600), var(--color-rd-primary-700))',
        }}
        aria-hidden="true"
      />

      {/* Radial glow */}
      <div
        className="absolute inset-0 -z-10 opacity-30"
        style={{
          background: 'radial-gradient(ellipse at 30% 50%, var(--color-rd-primary-400), transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div className="mx-auto max-w-2xl px-5 text-center">
        {/* Eyebrow */}
        <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white/90 tracking-wide backdrop-blur-sm">
          {FINAL_CTA.eyebrow}
        </span>

        {/* Title */}
        <h2
          id="final-cta-heading"
          className="mt-5 text-3xl font-bold text-white md:text-4xl"
          style={{ fontFamily: 'var(--font-rd-display)', letterSpacing: '-0.02em', lineHeight: '1.3' }}
        >
          {FINAL_CTA.title}
        </h2>

        {/* Subtitle */}
        <p className="mt-4 text-base text-white/80 leading-relaxed md:text-lg">
          {FINAL_CTA.subtitle}
        </p>

        {/* CTA Button */}
        <div className="mt-8">
          <a
            href={FINAL_CTA.ctaRoute}
            className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-medium text-rd-primary-700 transition-all hover:bg-white/90 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-rd-primary-700"
          >
            {FINAL_CTA.ctaText}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>

        {/* Reassurance */}
        <p className="mt-5 text-sm text-white/60">
          {FINAL_CTA.reassurance}
        </p>
      </div>
    </section>
  )
}
