import { Metadata } from 'next'
import Link from 'next/link'
import { FileText, Camera, Clapperboard, Share2 } from 'lucide-react'
import AuthForm from '@/components/auth/AuthForm'

export const metadata: Metadata = {
  title: 'Giriş Yap',
  description: 'yzliste hesabınıza giriş yapın.',
  openGraph: { title: 'Giriş Yap | yzliste' },
  robots: { index: false, follow: false },
  alternates: { canonical: 'https://www.yzliste.com/giris' },
}

const DEGER_ONERILERI = [
  { Ikon: FileText, baslik: 'Listing metni', detay: '6 pazaryeri için optimize başlık + açıklama' },
  { Ikon: Camera, baslik: 'Stüdyo görseli', detay: 'Fotoğraftan profesyonel ürün görseli' },
  { Ikon: Clapperboard, baslik: 'Ürün videosu', detay: 'Reels, TikTok ve YouTube formatları' },
  { Ikon: Share2, baslik: 'Sosyal medya', detay: 'Instagram, TikTok, Facebook caption + hashtag' },
]

export default async function GirisPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>
}) {
  const params = await searchParams
  const redirectTo = params.redirect || '/uret'

  return (
    <main className="min-h-screen bg-rd-neutral-50 flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-5xl mx-auto">
        <div className="grid gap-12 lg:grid-cols-2 items-center">

          {/* Sol kolon — form */}
          <div className="w-full max-w-md mx-auto lg:mx-0">
            {/* Logo */}
            <Link href="/" className="inline-block mb-8" aria-label="yzliste anasayfa">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/yzliste_logo.png" alt="yzliste" className="h-7" />
            </Link>

            {/* Başlık */}
            <p
              className="text-xs font-semibold tracking-[0.1em] uppercase text-rd-primary-600 mb-2"
              style={{ fontFamily: 'var(--font-rd-display)' }}
            >
              Giriş
            </p>
            <h1
              className="text-3xl font-bold text-rd-neutral-900 mb-1"
              style={{ fontFamily: 'var(--font-rd-display)', letterSpacing: '-0.02em', lineHeight: '1.3' }}
            >
              Tekrar hoş geldin
            </h1>
            <p className="text-sm text-rd-neutral-500 mb-8">
              Hesabına giriş yap, üretmeye devam et.
            </p>

            {/* Form kartı */}
            <div className="rounded-xl border border-rd-neutral-200 bg-white p-6">
              <AuthForm defaultMode="giris" redirectTo={redirectTo} />
            </div>

            <p className="text-sm text-rd-neutral-500 text-center mt-5">
              Hesabın yok mu?{' '}
              <Link href="/kayit" className="text-rd-primary-600 hover:text-rd-primary-700 font-medium transition-colors">
                Ücretsiz kayıt ol
              </Link>
            </p>
          </div>

          {/* Sağ kolon — değer önermesi (mobile gizlenir) */}
          <div className="hidden lg:block">
            <div className="rounded-2xl bg-rd-primary-600 p-8 text-white">
              <p
                className="text-xs font-semibold tracking-[0.1em] uppercase text-white/60 mb-4"
                style={{ fontFamily: 'var(--font-rd-display)' }}
              >
                yzliste ile
              </p>
              <h2
                className="text-2xl font-bold text-white mb-6"
                style={{ fontFamily: 'var(--font-rd-display)', letterSpacing: '-0.01em', lineHeight: '1.3' }}
              >
                Ürün içeriklerini<br />dakikalar içinde üret
              </h2>
              <ul className="space-y-4">
                {DEGER_ONERILERI.map(({ Ikon, baslik, detay }) => (
                  <li key={baslik} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Ikon size={15} strokeWidth={1.5} className="text-white" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{baslik}</p>
                      <p className="text-xs text-white/70 mt-0.5">{detay}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-8 pt-6 border-t border-white/20">
                <p className="text-sm text-white/80">
                  Yeni kayıtta <span className="font-medium text-white">3 ücretsiz kredi</span> · Kredi kartı gerekmez
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  )
}
