import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Ödeme Hatası',
  robots: { index: false, follow: false },
}

export default function OdemeHataPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl">✗</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Ödeme Başarısız</h1>
          <p className="text-gray-500 text-sm mb-8 leading-relaxed">
            Ödeme işlemi tamamlanamadı. Krediniz çekilmedi. Lütfen tekrar deneyin veya farklı bir kart kullanın.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/kredi-yukle"
              className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 rounded-xl text-sm transition-colors"
            >
              Tekrar Dene →
            </Link>
            <a
              href="mailto:destek@yzliste.com"
              className="text-sm text-gray-400 hover:text-gray-600 py-2"
            >
              Destek al: destek@yzliste.com
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
