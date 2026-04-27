'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import SectionHeader from '@/components/primitives/SectionHeader'
import {
  FIYATLAR_HEADER,
  SLIDER_CONFIG,
  PAKET_LISTESI,
  CREDIT_PER_PRODUCT,
  RECOMMENDATION_EYEBROW,
  TRUST_POINTS,
  FIYATLAR_CTA_ROUTE,
} from '@/lib/constants/fiyatlar-landing'
import { Check } from 'lucide-react'

export default function FiyatlarSection() {
  const [productCount, setProductCount] = useState(SLIDER_CONFIG.defaultValue)
  const sliderRef = useRef<HTMLInputElement>(null)

  const recommendedPackage = useMemo(() => {
    const needed = productCount * CREDIT_PER_PRODUCT
    return PAKET_LISTESI.find(p => p.kredi >= needed) ?? PAKET_LISTESI[PAKET_LISTESI.length - 1]
  }, [productCount])

  const calcFillPct = (val: number) =>
    ((val - SLIDER_CONFIG.min) / (SLIDER_CONFIG.max - SLIDER_CONFIG.min)) * 100

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.style.setProperty('--slider-fill', `${calcFillPct(SLIDER_CONFIG.defaultValue)}%`)
    }
  }, [])

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value)
    setProductCount(val)
    e.target.style.setProperty('--slider-fill', `${calcFillPct(val)}%`)
  }

  return (
    <section className="py-20 md:py-28 bg-rd-neutral-50" aria-labelledby="fiyatlar-heading">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeader
          eyebrow={FIYATLAR_HEADER.eyebrow}
          eyebrowColor="primary"
          title={FIYATLAR_HEADER.title}
          subtitle={FIYATLAR_HEADER.subtitle}
          id="fiyatlar-heading"
        />

        {/* CreditCalculator */}
        <div className="mt-12 rounded-xl border border-rd-neutral-200 bg-white p-6 md:p-8">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">

            {/* Sol: Slider */}
            <div>
              <label htmlFor="product-slider" className="block text-sm font-medium text-rd-neutral-600 mb-6">
                {SLIDER_CONFIG.label}
              </label>

              <div className="flex items-center gap-4">
                <span className="text-sm text-rd-neutral-400 tabular-nums w-8 text-right">{SLIDER_CONFIG.min}</span>
                <input
                  id="product-slider"
                  ref={sliderRef}
                  type="range"
                  min={SLIDER_CONFIG.min}
                  max={SLIDER_CONFIG.max}
                  value={productCount}
                  onChange={handleSliderChange}
                  className="fiyatlar-slider flex-1"
                  role="slider"
                  aria-valuemin={SLIDER_CONFIG.min}
                  aria-valuemax={SLIDER_CONFIG.max}
                  aria-valuenow={productCount}
                  aria-valuetext={`${productCount} ürün`}
                />
                <span className="text-sm text-rd-neutral-400 tabular-nums w-8">{SLIDER_CONFIG.max}</span>
              </div>

              {/* Seçilen değer */}
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

            {/* Sağ: Recommendation */}
            <div
              className="rounded-lg bg-rd-primary-50 p-5 border border-rd-primary-100"
              aria-live="polite"
            >
              <p className="text-xs font-medium text-rd-primary-600 uppercase tracking-wider mb-2">
                {RECOMMENDATION_EYEBROW}
              </p>
              <p
                className="text-xl font-bold text-rd-neutral-900"
                style={{ fontFamily: 'var(--font-rd-display)' }}
              >
                {recommendedPackage.isim}
              </p>
              <p className="mt-1 text-sm text-rd-neutral-500">
                {recommendedPackage.kredi} kredi · {recommendedPackage.fiyatStr}
              </p>
              <p className="mt-2 text-xs text-rd-neutral-400">
                {productCount} ürün × {CREDIT_PER_PRODUCT} kredi = {productCount * CREDIT_PER_PRODUCT} kredi ihtiyacı
              </p>
            </div>

          </div>
        </div>

        {/* PackageCards — 3 kolon grid */}
        <div className="mt-12 grid gap-6 md:grid-cols-3 items-start">
          {PAKET_LISTESI.map(paket => {
            const isPopular = paket.rozet === true
            const isRecommended = paket.id === recommendedPackage.id

            return (
              <div
                key={paket.id}
                className={[
                  'relative rounded-xl border bg-white p-6 transition-transform duration-200',
                  isPopular
                    ? 'border-rd-primary-500 border-2 md:-translate-y-2'
                    : 'border-rd-neutral-200',
                ].join(' ')}
              >
                {/* EN POPÜLER rozet — sadece popular pakette */}
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center rounded-full bg-rd-primary-600 px-3 py-1 text-xs font-medium text-white tracking-wide">
                      En popüler
                    </span>
                  </div>
                )}

                {/* SENİN İÇİN badge — slider'a göre recommended pakette */}
                {isRecommended && (
                  <div className={`absolute -top-3 ${isPopular ? 'right-4' : 'left-1/2 -translate-x-1/2'}`}>
                    <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium text-white tracking-wide" style={{ backgroundColor: '#059669' }}>
                      Senin için
                    </span>
                  </div>
                )}

                {/* Paket adı */}
                <h3 className="text-lg font-medium text-rd-neutral-900">{paket.isim}</h3>
                <p className="mt-1 text-sm text-rd-neutral-500">{paket.aciklama}</p>

                {/* Fiyat */}
                <p className="mt-5">
                  <span
                    className="text-4xl font-extrabold text-rd-neutral-900 tabular-nums"
                    style={{ fontFamily: 'var(--font-rd-display)' }}
                  >
                    {paket.fiyatStr}
                  </span>
                  <span className="ml-1 text-sm text-rd-neutral-400">/ {paket.krediStr}</span>
                </p>

                {/* CTA */}
                <a
                  href={FIYATLAR_CTA_ROUTE}
                  className={[
                    'mt-5 block w-full rounded-lg py-2.5 text-center text-sm font-medium transition-colors',
                    isPopular
                      ? 'bg-rd-primary-600 text-white hover:bg-rd-primary-700'
                      : 'border border-rd-neutral-300 text-rd-neutral-700 hover:bg-rd-neutral-50',
                  ].join(' ')}
                >
                  Paketi seç
                </a>

                {/* Özellikler */}
                <ul className="mt-5 space-y-2.5" role="list">
                  {paket.ozellikler.map((ozellik, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-rd-neutral-600">
                      <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-rd-primary-500" aria-hidden="true" />
                      <span>{ozellik}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        {/* Trust points */}
        <p className="mt-10 text-center text-sm text-rd-neutral-400">
          {TRUST_POINTS.map((point, i) => (
            <span key={i}>
              {i > 0 && <span className="mx-2" aria-hidden="true">·</span>}
              {point}
            </span>
          ))}
        </p>
      </div>
    </section>
  )
}
