import { Metadata } from 'next'
import Link from 'next/link'
import AuthForm from '@/components/auth/AuthForm'

export const metadata: Metadata = {
  title: 'Giriş Yap',
  description: 'yzliste hesabınıza giriş yapın.',
  openGraph: { title: 'Giriş Yap | yzliste' },
  robots: { index: false, follow: false },
  alternates: { canonical: 'https://www.yzliste.com/giris' },
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
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <AuthForm defaultMode="giris" redirectTo="/uret" />
        </div>
      </div>
    </main>
  )
}
