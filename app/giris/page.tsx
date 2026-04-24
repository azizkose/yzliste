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

export default async function GirisPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>
}) {
  const params = await searchParams;
  const redirectTo = params.redirect || '/uret';

  return (
    <main className="min-h-screen bg-[#FAFAF8] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/yzliste_logo.png" alt="yzliste" className="h-9 mx-auto" />
          </Link>
          <h1 className="text-2xl font-medium text-[#1A1A17] mt-4">Hesabınıza giriş yapın</h1>
        </div>
        <div className="bg-white rounded-xl border border-[#D8D6CE] p-6">
          <AuthForm defaultMode="giris" redirectTo={redirectTo} />
        </div>
      </div>
    </main>
  )
}
