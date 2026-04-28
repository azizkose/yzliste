import { Metadata } from 'next'
import Link from 'next/link'
import { Check } from 'lucide-react'
import AuthForm from '@/components/auth/AuthForm'

export const metadata: Metadata = {
  title: 'Kayıt Ol',
  description: "3 ücretsiz kredi ile yzliste'ye ücretsiz kayıt olun. Kredi kartı gerekmez.",
  openGraph: { title: 'Kayıt Ol | yzliste' },
  robots: { index: false, follow: false },
  alternates: { canonical: 'https://www.yzliste.com/kayit' },
}

const OZELLIKLER = [
  '3 ücretsiz kredi — hemen başla, kart gerekmez',
  'Trendyol, Hepsiburada, Amazon TR, N11, Etsy, Amazon USA',
  'Listing metni · Stüdyo görseli · Ürün videosu · Sosyal medya',
  'Krediler süresiz geçerli · Abonelik yok',
]

export default function KayitPage() {
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
              Kayıt
            </p>
            <h1
              className="text-3xl font-bold text-rd-neutral-900 mb-1"
              style={{ fontFamily: 'var(--font-rd-display)', letterSpacing: '-0.02em', lineHeight: '1.3' }}
            >
              Hesabını oluştur
            </h1>
            <p className="text-sm text-rd-neutral-500 mb-8">
              3 ücretsiz kredi ile hemen başla · Kredi kartı gerekmez
            </p>

            {/* Form kartı */}
            <div className="rounded-xl border border-rd-neutral-200 bg-white p-6">
              <AuthForm defaultMode="kayit" redirectTo="/uret" />
            </div>

            <p className="text-sm text-rd-neutral-500 text-center mt-5">
              Zaten hesabın var mı?{' '}
              <Link href="/giris" className="text-rd-primary-600 hover:text-rd-primary-700 font-medium transition-colors">
                Giriş yap
              </Link>
            </p>
          </div>

          {/* Sağ kolon — özellikler (mobile gizlenir) */}
          <div className="hidden lg:block">
            <div className="rounded-2xl border border-rd-neutral-200 bg-white p-8">
              <p
                className="text-xs font-semibold tracking-[0.1em] uppercase text-rd-primary-600 mb-4"
                style={{ fontFamily: 'var(--font-rd-display)' }}
              >
                Neden yzliste?
              </p>
              <h2
                className="text-xl font-bold text-rd-neutral-900 mb-6"
                style={{ fontFamily: 'var(--font-rd-display)', letterSpacing: '-0.01em' }}
              >
                Ücretsiz dene,<br />beğenince devam et
              </h2>
              <ul className="space-y-3">
                {OZELLIKLER.map((o, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-rd-success-50 border border-rd-success-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check size={11} strokeWidth={2.5} className="text-rd-success-600" aria-hidden="true" />
                    </div>
                    <span className="text-sm text-rd-neutral-600 leading-relaxed">{o}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 pt-6 border-t border-rd-neutral-100">
                <p className="text-xs text-rd-neutral-400 leading-relaxed">
                  KVKK kapsamında verileriniz güvende. İstediğinizde hesabınızı ve
                  verilerinizi silebilirsiniz.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  )
}
