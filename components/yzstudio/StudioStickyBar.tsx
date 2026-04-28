'use client'
import { useState } from 'react'
import { Minus, Plus, Loader, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import Tooltip from '@/components/primitives/Tooltip'
import { STUDIO_KREDI } from '@/lib/studio-constants'

const MODLAR = [
  { id: 'performance' as const, etiket: 'Hızlı', sure: '~15sn' },
  { id: 'balanced' as const, etiket: 'Dengeli', sure: '~25sn' },
  { id: 'quality' as const, etiket: 'En iyi', sure: '~45sn' },
]

interface StudioStickyBarProps {
  mode: 'performance' | 'balanced' | 'quality'
  numSamples: number
  toplamKredi: number
  kredi: number
  yukleniyor: boolean
  onModeChange: (v: 'performance' | 'balanced' | 'quality') => void
  onNumSamplesChange: (v: number) => void
  onUret: () => void
}

export default function StudioStickyBar({
  mode, numSamples, toplamKredi, kredi, yukleniyor,
  onModeChange, onNumSamplesChange, onUret,
}: StudioStickyBarProps) {
  const { minSamples, maxSamples } = STUDIO_KREDI.tryon
  const yetersizKredi = kredi < toplamKredi
  const [onayAktif, setOnayAktif] = useState(false)

  return (
    <div className="sticky bottom-5 z-40 mt-8 w-full">
      <div className="rounded-2xl border border-rd-neutral-200 bg-white shadow-rd-lg px-4 py-3 sm:py-4">
        {onayAktif ? (
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-rd-neutral-700">
              <span className="font-medium">{toplamKredi} kredi</span> harcanacak. Devam?
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setOnayAktif(false)}
                className="px-4 py-2 rounded-lg border border-rd-neutral-200 bg-white text-sm text-rd-neutral-700 hover:border-rd-neutral-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rd-primary-500 focus-visible:ring-offset-2"
              >
                İptal
              </button>
              <button
                type="button"
                onClick={() => { setOnayAktif(false); onUret() }}
                className="px-4 py-2 rounded-lg bg-rd-primary-700 text-white text-sm font-medium hover:bg-rd-primary-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rd-primary-500 focus-visible:ring-offset-2"
              >
                Onayla
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
            {/* Sol: kalite mod + varyasyon stepper */}
            <div className="flex-1 flex flex-col sm:flex-row gap-3 sm:items-center sm:gap-4">
              {/* Kalite mod chip'leri */}
              <div className="flex gap-1.5" role="group" aria-label="Kalite modu seç">
                {MODLAR.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => onModeChange(m.id)}
                    aria-pressed={mode === m.id}
                    className={[
                      'flex-1 sm:flex-none py-1.5 px-2.5 sm:px-3 rounded-lg border text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rd-primary-500 focus-visible:ring-offset-1',
                      mode === m.id
                        ? 'border-rd-primary-700 bg-rd-primary-50 text-rd-primary-700'
                        : 'border-rd-neutral-200 text-rd-neutral-600 hover:border-rd-primary-400 hover:bg-rd-neutral-50',
                    ].join(' ')}
                  >
                    <span className="font-medium">{m.etiket}</span>
                    <span className="ml-1 opacity-60">{m.sure}</span>
                  </button>
                ))}
              </div>

              {/* Varyasyon stepper */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onNumSamplesChange(Math.max(minSamples, numSamples - 1))}
                  disabled={numSamples <= minSamples}
                  aria-label="Varyasyon azalt"
                  className="w-7 h-7 rounded-lg border border-rd-neutral-200 flex items-center justify-center text-rd-neutral-500 hover:border-rd-neutral-300 disabled:text-rd-neutral-300 disabled:cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rd-primary-500 focus-visible:ring-offset-1"
                >
                  <Minus size={12} strokeWidth={1.5} aria-hidden="true" />
                </button>
                <span className="text-sm font-medium text-rd-neutral-900 w-4 text-center tabular-nums" aria-live="polite">
                  {numSamples}
                </span>
                <button
                  type="button"
                  onClick={() => onNumSamplesChange(Math.min(maxSamples, numSamples + 1))}
                  disabled={numSamples >= maxSamples}
                  aria-label="Varyasyon artır"
                  className="w-7 h-7 rounded-lg border border-rd-neutral-200 flex items-center justify-center text-rd-neutral-500 hover:border-rd-neutral-300 disabled:text-rd-neutral-300 disabled:cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rd-primary-500 focus-visible:ring-offset-1"
                >
                  <Plus size={12} strokeWidth={1.5} aria-hidden="true" />
                </button>
                <span className="text-xs text-rd-neutral-500">{numSamples} varyasyon · {toplamKredi} kredi</span>
              </div>
            </div>

            {/* Sağ: CTA */}
            <div className="flex flex-col gap-1.5 sm:flex-none">
              {yetersizKredi ? (
                <>
                  <button
                    type="button"
                    aria-disabled="true"
                    onClick={e => e.preventDefault()}
                    className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-rd-neutral-300 text-rd-neutral-500 text-sm font-medium cursor-not-allowed"
                  >
                    Mankene giydir
                  </button>
                  <Link
                    href="/kredi-yukle"
                    className="inline-flex items-center justify-center gap-1 text-xs font-medium text-rd-danger-700 hover:underline"
                  >
                    <AlertCircle size={12} aria-hidden="true" />
                    Yetersiz kredi · Paket al
                  </Link>
                </>
              ) : (
                <Tooltip content={yukleniyor ? 'İşleniyor...' : null}>
                  <button
                    type="button"
                    onClick={yukleniyor ? undefined : () => setOnayAktif(true)}
                    disabled={yukleniyor}
                    aria-disabled={yukleniyor || undefined}
                    className={[
                      'w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rd-primary-500 focus-visible:ring-offset-2 disabled:opacity-60',
                      yukleniyor
                        ? 'bg-rd-neutral-300 text-rd-neutral-500 cursor-not-allowed'
                        : 'bg-rd-primary-700 text-white hover:bg-rd-primary-800',
                    ].join(' ')}
                  >
                    {yukleniyor ? (
                      <>
                        <Loader size={14} strokeWidth={1.5} className="animate-spin" aria-hidden="true" />
                        Hazırlanıyor...
                      </>
                    ) : 'Mankene giydir'}
                  </button>
                </Tooltip>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
