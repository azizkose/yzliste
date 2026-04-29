'use client'
import Link from 'next/link'
import { Sparkles, CreditCard } from 'lucide-react'
import { useCredits } from '@/lib/hooks/useCredits'

export default function StudioHeader() {
  const { data: kredi } = useCredits()

  return (
    <div className="border-b border-rd-neutral-200 bg-white">
      {/* Premium eyebrow strip */}
      <div className="flex items-center justify-center gap-1.5 py-1.5 bg-rd-warm-50 border-b border-rd-warm-200">
        <Sparkles size={11} strokeWidth={1.5} className="text-rd-warm-700" aria-hidden="true" />
        <span className="text-[10px] uppercase tracking-[0.15em] text-rd-warm-700 font-medium">
          Premium Araç
        </span>
      </div>

      {/* Main header row */}
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1
            className="text-2xl md:text-3xl font-medium tracking-[-0.01em] text-rd-neutral-900"
            style={{ fontFamily: 'var(--font-rd-display)' }}
          >
            yzstudio
          </h1>
          <span className="hidden sm:inline bg-rd-warm-50 text-rd-warm-900 text-xs font-medium px-2.5 py-0.5 rounded border border-rd-warm-200">
            Premium · Beta
          </span>
          <span className="sm:hidden bg-rd-warm-50 text-rd-warm-900 text-xs font-medium px-1.5 py-0.5 rounded border border-rd-warm-200">
            beta
          </span>
        </div>
        <div className="flex items-center gap-2">
          {kredi !== undefined && kredi !== null && (
            <span className="text-sm text-rd-neutral-500">{kredi} kredi</span>
          )}
          <Link
            href="/kredi-yukle"
            className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg bg-rd-primary-700 text-white hover:bg-rd-primary-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rd-primary-500 focus-visible:ring-offset-2"
          >
            <CreditCard size={14} strokeWidth={1.5} aria-hidden="true" />
            <span className="hidden sm:inline">Kredi yükle</span>
            <span className="sm:hidden">Yükle</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
