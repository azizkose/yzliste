'use client'

import Link from 'next/link'
import { ArrowRight, AlertCircle } from 'lucide-react'
import Tooltip from '@/components/primitives/Tooltip'
import { type CTAState } from './useCTAState'

interface StickySubmitBarProps {
  cost: number
  remainingCredits: number
  isInsufficientCredit: boolean
  ctaState: CTAState
  onSubmit: () => void
  isSubmitting?: boolean
  ctaLabel?: string
}

export default function StickySubmitBar({
  cost,
  remainingCredits,
  isInsufficientCredit,
  ctaState,
  onSubmit,
  isSubmitting = false,
  ctaLabel = 'İçerik üret',
}: StickySubmitBarProps) {
  const isLoginRequired = ctaState.disabled && ctaState.reason === 'Önce giriş yap'

  return (
    <div className="sticky bottom-5 z-40 mx-auto mt-8 w-full max-w-3xl px-4 sm:px-0">
      <div className="rounded-2xl border border-rd-neutral-200 bg-white shadow-rd-lg p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
        {/* Cost summary (sol) */}
        <div className="flex-1">
          <p className="text-xs font-medium text-rd-neutral-500 uppercase tracking-wider">
            Bu üretimin maliyeti
          </p>
          <div className="mt-1 flex items-baseline gap-2">
            <span
              className="text-2xl font-bold text-rd-neutral-900 tabular-nums"
              style={{ fontFamily: 'var(--font-rd-display)' }}
            >
              {cost} kredi
            </span>
            <span className={`text-xs ${isInsufficientCredit ? 'text-rd-danger-600 font-medium' : 'text-rd-neutral-500'}`}>
              {isInsufficientCredit
                ? `Bakiyenizde ${remainingCredits} kredi var`
                : `Üretim sonrası: ${Math.max(0, remainingCredits - cost)} kredi kalır`}
            </span>
          </div>
        </div>

        {/* CTA (sağ) */}
        <div className="w-full sm:w-auto">
          {isInsufficientCredit ? (
            <div className="flex flex-col gap-2">
              <button
                type="button"
                disabled
                aria-disabled="true"
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-rd-neutral-300 px-5 py-2.5 text-sm font-medium text-rd-neutral-500 cursor-not-allowed sm:w-auto"
              >
                {ctaLabel}
              </button>
              <Link
                href="/fiyatlar"
                className="inline-flex items-center justify-center gap-1 text-xs font-medium text-rd-danger-700 hover:underline"
              >
                <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
                Yetersiz kredi · Paket al
              </Link>
            </div>
          ) : isLoginRequired ? (
            <Tooltip content="Önce giriş yap" side="top">
              <button
                type="button"
                onClick={() => { window.location.href = '/giris' }}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-rd-neutral-300 px-5 py-2.5 text-sm font-medium text-rd-neutral-500 hover:bg-rd-neutral-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rd-primary-500 focus-visible:ring-offset-2 sm:w-auto"
              >
                {ctaLabel}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </Tooltip>
          ) : (
            <Tooltip content={ctaState.disabled ? ctaState.reason : null}>
              <button
                type="button"
                onClick={ctaState.disabled ? undefined : onSubmit}
                disabled={isSubmitting}
                aria-disabled={ctaState.disabled || undefined}
                className={[
                  'inline-flex w-full items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rd-primary-500 focus-visible:ring-offset-2 sm:w-auto disabled:opacity-60',
                  ctaState.disabled
                    ? 'bg-rd-neutral-300 text-rd-neutral-500 cursor-not-allowed'
                    : 'bg-rd-primary-700 text-white hover:bg-rd-primary-800',
                ].join(' ')}
              >
                {isSubmitting ? 'Üretiliyor…' : ctaLabel}
                {!isSubmitting && !ctaState.disabled && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
              </button>
            </Tooltip>
          )}
        </div>
      </div>
    </div>
  )
}
