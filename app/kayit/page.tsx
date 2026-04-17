import { Metadata } from 'next'
import Link from 'next/link'
import AuthForm from '@/components/auth/AuthForm'

export const metadata: Metadata = {
  title: 'Kayıt Ol — yzliste',
  description: '3 ücretsiz kredi ile yzliste\'ye ücretsiz kayıt olun. Kredi kartı gerekmez.',
  robots: { index: false, follow: false },
}

export default function KayitPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/">
            <img src="/yzliste_logo.png" alt="yzliste" className="h-9 mx-auto" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-4">Ücretsiz Başla</h1>
          <p className="text-sm text-gray-500 mt-1">
            3 ücretsiz içerik üretim kredisi · Kredi kartı gerekmez
          </p>
          <p className="text-sm text-gray-400 mt-1">
            Zaten hesabın var mı?{' '}
            <Link href="/giris" className="text-indigo-500 hover:underline font-medium">
              Giriş yap
            </Link>
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <AuthForm defaultMode="kayit" redirectTo="/" />
        </div>
      </div>
    </main>
  )
}
