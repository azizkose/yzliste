'use client'

import './globals.css'
import { useEffect } from 'react'
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
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10">
            <p className="text-5xl mb-4">⚠️</p>
            <h1 className="text-xl font-bold text-gray-900 mb-2">Bir sorun oluştu</h1>
            <p className="text-sm text-gray-500 mb-8">
              Beklenmedik bir hata meydana geldi.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => reset()}
                className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 rounded-xl text-sm transition-colors"
              >
                Tekrar Dene
              </button>
              <a
                href="/"
                className="text-sm text-gray-400 hover:text-gray-600 py-2"
              >
                Ana Sayfaya Dön
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
