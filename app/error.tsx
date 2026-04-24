'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'
import * as Sentry from "@sentry/nextjs"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
    Sentry.captureException(error)
  }, [error])

  return (
    <main className="min-h-screen bg-[#FAFAF8] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <Link href="/">
            <img src="/yzliste_logo.png" alt="yzliste" className="h-9 mx-auto" />
          </Link>
        </div>
        <div className="bg-white rounded-xl border border-[#D8D6CE] p-10">
          <div className="flex justify-center mb-4">
            <AlertTriangle size={48} strokeWidth={1.5} className="text-[#908E86]" />
          </div>
          <h1 className="text-xl font-medium text-[#1A1A17] mb-2">Bir sorun oluştu</h1>
          <p className="text-sm text-[#908E86] mb-8">
            Beklenmedik bir hata meydana geldi. Lütfen tekrar deneyin.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => reset()}
              className="bg-[#1E4DD8] hover:bg-[#163B9E] text-white font-medium py-3 rounded-lg text-sm transition-colors"
            >
              Tekrar dene
            </button>
            <Link
              href="/"
              className="text-sm text-[#908E86] hover:text-[#5A5852] py-2"
            >
              Ana sayfaya dön
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
