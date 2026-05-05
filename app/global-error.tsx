'use client'

import './globals.css'
import { useEffect } from 'react'
import Link from 'next/link'
import * as Sentry from "@sentry/nextjs"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <html lang="tr">
      <body className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-xl border border-rd-neutral-200 p-10">
            <h1 className="text-xl font-medium text-rd-neutral-900 mb-2">Bir sorun oluştu</h1>
            <p className="text-sm text-rd-neutral-500 mb-8">
              Beklenmedik bir hata meydana geldi.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => reset()}
                className="bg-rd-primary-700 hover:bg-rd-primary-800 text-white font-medium py-3 rounded-lg text-sm transition-colors"
              >
                Tekrar Dene
              </button>
              <Link
                href="/"
                className="text-sm text-gray-400 hover:text-gray-600 py-2"
              >
                Ana Sayfaya Dön
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
