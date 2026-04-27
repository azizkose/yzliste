'use client'

import Link from 'next/link'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { XCircle, Mail } from 'lucide-react'
import TrustStrip from '@/components/odeme/TrustStrip'

function OdemeHataIcerik() {
  const searchParams = useSearchParams()
  const reason = searchParams.get('reason') ?? searchParams.get('errorCode') ?? null

  return (
    <main className="min-h-screen bg-rd-neutral-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-xl border border-rd-neutral-200 p-8 md:p-10">

          {/* İkon */}
          <div className="w-16 h-16 bg-rd-danger-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle
              size={28}
              strokeWidth={2}
              className="text-rd-danger-700"
              aria-hidden="true"
            />
          </div>

          {/* Başlık */}
          <h1
            className="text-2xl md:text-3xl font-medium text-rd-neutral-900 mb-2"
            style={{ fontFamily: 'var(--font-rd-display)', letterSpacing: '-0.01em' }}
          >
            Ödeme tamamlanamadı
          </h1>

          {/* Açıklama */}
          <p className="text-rd-neutral-600 text-sm md:text-base leading-relaxed mb-6">
            Ödeme işlemi tamamlanamadı. Krediniz çekilmedi. Tekrar deneyebilir veya farklı bir kart kullanabilirsin.
          </p>

          {/* Hata kodu (varsa) */}
          {reason && (
            <div
              role="status"
              className="mb-6 text-left bg-rd-neutral-100 border border-rd-neutral-200 rounded-lg p-3 text-xs text-rd-neutral-600 font-mono"
            >
              Hata kodu: {reason}
            </div>
          )}

          {/* CTA'lar */}
          <div className="flex flex-col gap-3">
            <Link
              href="/kredi-yukle"
              className="block bg-rd-primary-700 hover:bg-rd-primary-800 text-white font-medium py-3 rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rd-primary-500 focus-visible:ring-offset-2"
            >
              Tekrar dene
            </Link>
            <a
              href="mailto:destek@yzliste.com"
              className="inline-flex items-center justify-center gap-1.5 text-sm text-rd-neutral-500 hover:text-rd-neutral-700 py-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rd-primary-500 focus-visible:ring-offset-2 rounded"
            >
              <Mail size={14} aria-hidden="true" />
              Destek al
            </a>
          </div>
        </div>
      </div>

      {/* Trust strip */}
      <TrustStrip />
    </main>
  )
}

export default function OdemeHataPage() {
  return (
    <Suspense fallback={null}>
      <OdemeHataIcerik />
    </Suspense>
  )
}
