import { Metadata } from 'next'
import Link from 'next/link'
import AuthForm from '@/components/auth/AuthForm'

export const metadata: Metadata = {
  title: 'Giriş Yap — yzliste',
  description: 'yzliste hesabınıza giriş yapın.',
  robots: { index: false, follow: false },
}

export default function GirisPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>
}) {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/">
            <img src="/yzliste_logo.png" alt="yzliste" className="h-9 mx-auto" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-4">Giriş Yap</h1>
          <p className="text-sm text-gray-500 mt-1">
            Hesabın yok mu?{' '}
            <Link href="/kayit" className="text-indigo-500 hover:underline font-medium">
              Ücretsiz oluştur
            </Link>
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <AuthForm defaultMode="giris" redirectTo="/" />
        </div>
      </div>
    </main>
  )
}
