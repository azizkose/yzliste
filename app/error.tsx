'use client'

import Link from 'next/link'
import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <Link href="/">
            <img src="/yzliste_logo.png" alt="yzliste" className="h-9 mx-auto" />
          </Link>
        </div>
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10">
          <p className="text-5xl mb-4">⚠️</p>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Bir sorun oluştu</h1>
          <p className="text-sm text-gray-500 mb-8">
            Beklenmedik bir hata meydana geldi. Lütfen tekrar deneyin.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => reset()}
              className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 rounded-xl text-sm transition-colors"
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
    </main>
  )
}
