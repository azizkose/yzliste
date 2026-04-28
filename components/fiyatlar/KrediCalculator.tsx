'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { PAKET_LISTESI } from '@/lib/paketler'

const SLIDER_MIN = 1
const SLIDER_MAX = 100
const SLIDER_DEFAULT = 15
const CREDIT_PER_PRODUCT = 1

function calcFillPct(val: number) {
  return ((val - SLIDER_MIN) / (SLIDER_MAX - SLIDER_MIN)) * 100
}

export default function KrediCalculator() {
  const [productCount, setProductCount] = useState(SLIDER_DEFAULT)
  const sliderRef = useRef<HTMLInputElement>(null)

  const recommended = useMemo(() => {
    const needed = productCount * CREDIT_PER_PRODUCT
    return PAKET_LISTESI.find(p => p.kredi >= needed) ?? PAKET_LISTESI[PAKET_LISTESI.length - 1]
  }, [productCount])

  useEffect(() => {
    sliderRef.current?.style.setProperty('--slider-fill', `${calcFillPct(SLIDER_DEFAULT)}%`)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value)
    setProductCount(val)
    e.target.style.setProperty('--slider-fill', `${calcFillPct(val)}%`)
  }

  return (
    <section
      className="px-4 sm:px-6 py-14 bg-rd-neutral-50 border-y border-rd-neutral-200"
      aria-labelledby="calculator-heading"
    >
      <div className="max-w-3xl mx-auto">
        <p
          className="text-xs font-semibold tracking-[0.1em] uppercase text-rd-primary-600 text-center mb-3"
          style={{ fontFamily: 'var(--font-rd-display)' }}
        >
          Kaç kredi yeter?
        </p>
        <h2
          id="calculator-heading"
          className="text-xl font-bold text-rd-neutral-900 text-center mb-2"
          style={{ fontFamily: 'var(--font-rd-display)', letterSpacing: '-0.01em' }}
        >
          Kullanımına göre hesapla
        </h2>
        <p className="text-sm text-rd-neutral-500 text-center mb-10">
          Aylık üretmek istediğin ürün sayısını seç, uygun paketi görelim.
        </p>

        <div className="rounded-xl border border-rd-neutral-200 bg-white p-6 md:p-8">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">

            {/* Slider */}
            <div>
              <label
                htmlFor="kredi-slider"
                className="block text-sm font-medium text-rd-neutral-600 mb-6"
              >
                Aylık ürün sayısı
              </label>
              <div className="flex items-center gap-4">
                <span className="text-sm text-rd-neutral-400 tabular-nums w-8 text-right">{SLIDER_MIN}</span>
                <input
                  id="kredi-slider"
                  ref={sliderRef}
                  type="range"
                  min={SLIDER_MIN}
                  max={SLIDER_MAX}
                  value={productCount}
                  onChange={handleChange}
                  className="fiyatlar-slider flex-1"
                  role="slider"
                  aria-valuemin={SLIDER_MIN}
                  aria-valuemax={SLIDER_MAX}
                  aria-valuenow={productCount}
                  aria-valuetext={`${productCount} ürün`}
                />
                <span className="text-sm text-rd-neutral-400 tabular-nums w-8">{SLIDER_MAX}</span>
              </div>
              <p className="mt-4 text-center">
                <span
                  className="text-3xl font-bold text-rd-primary-700 tabular-nums"
                  style={{ fontFamily: 'var(--font-rd-display)' }}
                >
                  {productCount}
                </span>
                <span className="ml-2 text-sm text-rd-neutral-500">ürün / ay</span>
              </p>
            </div>

            {/* Öneri kutusu */}
            <div
              className="rounded-lg bg-rd-primary-50 p-5 border border-rd-primary-100"
              aria-live="polite"
              aria-atomic="true"
            >
              <p className="text-xs font-medium text-rd-primary-600 uppercase tracking-wider mb-2"
                 style={{ fontFamily: 'var(--font-rd-display)' }}>
                Sana uygun paket
              </p>
              <p
                className="text-xl font-bold text-rd-neutral-900"
                style={{ fontFamily: 'var(--font-rd-display)' }}
              >
                {recommended.isim}
              </p>
              <p className="mt-1 text-sm text-rd-neutral-500">
                {recommended.kredi} kredi · {recommended.fiyatStr}
              </p>
              <p className="mt-2 text-xs text-rd-neutral-400">
                {productCount} ürün × {CREDIT_PER_PRODUCT} kredi = {productCount * CREDIT_PER_PRODUCT} kredi ihtiyacı
              </p>
              <a
                href="/kredi-yukle"
                className="mt-4 inline-block w-full rounded-lg bg-rd-primary-600 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-rd-primary-700"
              >
                {recommended.isim} paketini al — {recommended.fiyatStr}
              </a>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
