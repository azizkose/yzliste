'use client'

import Link from 'next/link'
import { useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Check } from 'lucide-react'
import { analytics } from '@/lib/analytics'
import { useInvalidateCredits } from '@/lib/hooks/useCredits'

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
    <main className="min-h-screen bg-[#FAFAF8] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-xl border border-[#D8D6CE] p-10">
          <div className="w-16 h-16 bg-[#E8F5EE] rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={28} strokeWidth={2} className="text-[#0F5132]" />
          </div>
          <h1 className="text-2xl font-medium text-[#1A1A17] mb-2">Ödeme başarılı!</h1>
          <p className="text-[#908E86] text-sm mb-8 leading-relaxed">
            Krediniz hesabınıza eklendi. Hemen içerik üretmeye başlayabilirsiniz.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/"
              className="bg-[#1E4DD8] hover:bg-[#163B9E] text-white font-medium py-3 rounded-lg text-sm transition-colors"
            >
              İçerik üret
            </Link>
            <Link href="/hesap/krediler" className="text-sm text-[#908E86] hover:text-[#5A5852] py-2">
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
