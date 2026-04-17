'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { analytics } from '@/lib/analytics'
import { useInvalidateCredits } from '@/lib/hooks/useCredits'
import { Suspense } from 'react'

function OdemeBasariliIcerik() {
  const searchParams = useSearchParams()
  const invalidateCredits = useInvalidateCredits()

  useEffect(() => {
    const paket = searchParams.get('paket') ?? 'bilinmiyor'
    const krediMap: Record<string, number> = { baslangic: 10, populer: 30, buyuk: 100 }
    const fiyatMap: Record<string, number> = { baslangic: 29, populer: 79, buyuk: 149 }
    analytics.creditPurchaseCompleted({
      package_id: paket,
      price: fiyatMap[paket] ?? 0,
      credits: krediMap[paket] ?? 0,
    })
    invalidateCredits()
  }, [searchParams, invalidateCredits])

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl">✓</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Ödeme Başarılı!</h1>
          <p className="text-gray-500 text-sm mb-8 leading-relaxed">
            Krediniz hesabınıza eklendi. Hemen içerik üretmeye başlayabilirsiniz.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/"
              className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 rounded-xl text-sm transition-colors"
            >
              İçerik Üret →
            </Link>
            <Link href="/hesap/krediler" className="text-sm text-gray-400 hover:text-gray-600 py-2">
              Kredi geçmişini gör
            </Link>
          </div>
        </div>
      </div>
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
