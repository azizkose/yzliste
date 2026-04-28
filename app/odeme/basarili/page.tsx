'use client'

import Link from 'next/link'
import { useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { CheckCircle2, Coins } from 'lucide-react'
import { analytics } from '@/lib/analytics'
import { useInvalidateCredits } from '@/lib/hooks/useCredits'
import TrustStrip from '@/components/odeme/TrustStrip'

const KREDI_MAP: Record<string, number> = { baslangic: 10, populer: 30, buyuk: 100 }
const FIYAT_MAP: Record<string, number> = { baslangic: 29, populer: 79, buyuk: 149 }

function OdemeBasariliIcerik() {
  const searchParams = useSearchParams()
  const invalidateCredits = useInvalidateCredits()

  const paket = searchParams.get('paket') ?? 'bilinmiyor'
  const kredi = KREDI_MAP[paket] ?? null

  useEffect(() => {
    analytics.creditPurchaseCompleted({
      package_id: paket,
      price: FIYAT_MAP[paket] ?? 0,
      credits: KREDI_MAP[paket] ?? 0,
    })
    invalidateCredits()
  }, [searchParams, invalidateCredits])

  return (
    <main className="min-h-screen bg-rd-neutral-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-xl border border-rd-neutral-200 p-8 md:p-10">

          {/* İkon */}
          <div className="w-16 h-16 bg-rd-success-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2
              size={28}
              strokeWidth={2}
              className="text-rd-success-700"
              aria-hidden="true"
            />
          </div>

          {/* Başlık */}
          <h1
            className="text-2xl md:text-3xl font-medium text-rd-neutral-900 mb-2"
            style={{ fontFamily: 'var(--font-rd-display)', letterSpacing: '-0.01em' }}
          >
            Ödeme başarılı
          </h1>

          {/* Açıklama */}
          <p className="text-rd-neutral-600 text-sm md:text-base leading-relaxed mb-6">
            Krediniz hesabınıza eklendi. Hemen içerik üretmeye başlayabilirsiniz.
          </p>

          {/* Kredi rozeti */}
          {kredi !== null && (
            <div className="inline-flex items-center gap-2 bg-rd-primary-50 border border-rd-primary-200 rounded-lg px-4 py-2 mb-6">
              <Coins size={16} className="text-rd-primary-700" aria-hidden="true" />
              <span className="text-rd-primary-700 text-sm font-medium">
                {kredi} kredi yüklendi
              </span>
            </div>
          )}

          {/* CTA'lar */}
          <div className="flex flex-col gap-3">
            <Link
              href="/uret"
              className="block bg-rd-primary-700 hover:bg-rd-primary-800 text-white font-medium py-3 rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rd-primary-500 focus-visible:ring-offset-2"
            >
              İçerik üret
            </Link>
            <Link
              href="/hesap/krediler"
              className="block text-sm text-rd-neutral-500 hover:text-rd-neutral-700 py-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rd-primary-500 focus-visible:ring-offset-2 rounded"
            >
              Kredi geçmişini gör
            </Link>
          </div>
        </div>
      </div>

      {/* Trust strip */}
      <TrustStrip />
    </main>
  )
}

export default function OdemeBasariliPage() {
  return (
    <Suspense fallback={null}>
      <OdemeBasariliIcerik />
    </Suspense>
  )
}
