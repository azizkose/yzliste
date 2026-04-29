'use client'

import { useState, useRef, useCallback } from 'react'
import { Check, Lock } from 'lucide-react'
import { PAKET_LISTESI } from '@/lib/paketler'
import KrediCalculator from '@/components/fiyatlar/KrediCalculator'
import FiyatlarCta from '@/components/ui/FiyatlarCta'

export default function FiyatlarHybridSection() {
  const [onerilenPaketId, setOnerilenPaketId] = useState<string | null>(null)
  const paketRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const handlePaketOner = useCallback((paketId: string) => {
    setOnerilenPaketId(paketId)
    const el = paketRefs.current[paketId]
    if (!el) return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'nearest' })
  }, [])

  return (
    <section className="px-4 sm:px-6 py-16" aria-labelledby="paketler-heading">
      <div className="max-w-6xl mx-auto">
        <h2
          id="paketler-heading"
          className="text-2xl font-bold text-rd-neutral-900 text-center mb-2"
          style={{ fontFamily: 'var(--font-rd-display)', letterSpacing: '-0.01em' }}
        >
          Paketler
        </h2>
        <p className="text-center text-sm text-rd-neutral-400 mb-10">
          Bir kez al, sona erene kadar kullan. Süre sınırı yok.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">

          {/* SOL: Calculator — sticky on desktop, shows first on mobile */}
          <div className="lg:sticky lg:top-24">
            <div className="rounded-xl border border-rd-neutral-200 bg-rd-neutral-50 p-6">
              <p className="text-xs font-medium text-rd-neutral-500 uppercase tracking-wider mb-5">
                Kaç kredi yeter?
              </p>
              <KrediCalculator embedded onPaketOner={handlePaketOner} />
            </div>
            <p className="mt-4 text-center text-xs text-rd-neutral-400 flex items-center justify-center gap-1.5">
              <Lock size={11} strokeWidth={1.5} aria-hidden="true" />
              Güvenli ödeme — iyzico altyapısı · Fatura e-postayla gönderilir
            </p>
          </div>

          {/* SAĞ: 3 paket kart — vertical stack */}
          <div className="space-y-4">
            {PAKET_LISTESI.map((p) => {
              const highlighted = onerilenPaketId === p.id
              return (
                <div
                  key={p.id}
                  ref={(el) => { paketRefs.current[p.id] = el }}
                  className={[
                    'relative flex flex-col rounded-xl bg-white p-6 transition-all duration-300',
                    highlighted
                      ? 'border-2 border-rd-primary-700 scale-[1.01]'
                      : p.rozet
                      ? 'border-2 border-rd-primary-500'
                      : 'border border-rd-neutral-200',
                  ].join(' ')}
                >
                  {/* Badge */}
                  {(highlighted || p.rozet) && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center rounded-full bg-rd-primary-600 px-3 py-1 text-xs font-medium text-white tracking-wide">
                        {highlighted ? 'Sana önerilen' : 'En popüler'}
                      </span>
                    </div>
                  )}

                  <div className="mb-4">
                    <p
                      className="font-bold text-rd-neutral-900 text-lg"
                      style={{ fontFamily: 'var(--font-rd-display)' }}
                    >
                      {p.isim}
                    </p>
                    <p
                      className="text-3xl font-bold text-rd-neutral-900 mt-1 tabular-nums"
                      style={{ fontFamily: 'var(--font-rd-display)' }}
                    >
                      {p.fiyatStr}
                    </p>
                    <p className="text-sm text-rd-neutral-500 mt-1">
                      {p.kredi} kredi ·{' '}
                      <span className="text-rd-neutral-400">
                        {(p.fiyat / p.kredi).toFixed(2).replace('.', ',')}₺/kredi
                      </span>
                    </p>
                    <p className="text-xs text-rd-neutral-400 mt-2 leading-relaxed">{p.aciklama}</p>
                  </div>

                  <ul className="space-y-2 flex-1 mb-6" role="list">
                    {p.ozellikler.map((o, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-rd-neutral-600">
                        <Check
                          size={12}
                          strokeWidth={2}
                          className="text-rd-success-600 flex-shrink-0 mt-0.5"
                          aria-hidden="true"
                        />
                        {o}
                      </li>
                    ))}
                  </ul>

                  <FiyatlarCta
                    variant="paket"
                    paketButonRenk={
                      highlighted
                        ? 'bg-rd-primary-700 hover:bg-rd-primary-800'
                        : p.rozet
                        ? 'bg-rd-primary-600 hover:bg-rd-primary-700'
                        : 'bg-rd-neutral-900 hover:bg-rd-neutral-800'
                    }
                    paketFiyatStr={p.fiyatStr}
                  />
                </div>
              )
            })}
          </div>

        </div>
      </div>
    </section>
  )
}
