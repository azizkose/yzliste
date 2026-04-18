import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: { absolute: 'Sayfa Bulunamadı | yzliste' },
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <Link href="/">
            <img src="/yzliste_logo.png" alt="yzliste" className="h-9 mx-auto" />
          </Link>
        </div>
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10">
          <p className="text-6xl font-extrabold text-indigo-400 mb-4">404</p>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Sayfa bulunamadı</h1>
          <p className="text-sm text-gray-500 mb-8">
            Aradığınız sayfa taşınmış, silinmiş ya da hiç olmamış olabilir.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/"
              className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 rounded-xl text-sm transition-colors"
            >
              Ana Sayfaya Dön →
            </Link>
            <Link
              href="/sss"
              className="text-sm text-gray-400 hover:text-gray-600 py-2"
            >
              Sık Sorulan Sorular
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
