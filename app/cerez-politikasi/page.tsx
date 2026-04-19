import { Metadata } from 'next'
import Link from 'next/link'
import SiteHeader from "@/components/SiteHeader"
import SiteFooter from "@/components/SiteFooter"

export const metadata: Metadata = {
  title: 'Çerez Politikası',
  description: 'yzliste çerez politikası — hangi çerezlerin kullanıldığı ve nasıl kontrol edeceğiniz.',
  openGraph: { title: 'Çerez Politikası | yzliste' },
  alternates: {
    canonical: '/cerez-politikasi',
    languages: { 'tr': 'https://www.yzliste.com/cerez-politikasi', 'x-default': 'https://www.yzliste.com/cerez-politikasi' },
  },
}

const CEREZLER = [
  { kategori: 'Zorunlu', isim: 'sb-*-auth-token', kaynak: 'Supabase', sure: 'Oturum', aciklama: 'Giriş oturumunu yönetir. Olmadan site çalışmaz.' },
  { kategori: 'Zorunlu', isim: 'cc_cookie', kaynak: 'yzliste', sure: '1 yıl', aciklama: 'Çerez tercihlerinizi hatırlar.' },
  { kategori: 'Analitik', isim: 'ph_*', kaynak: 'PostHog EU', sure: '1 yıl', aciklama: 'Anonim kullanım istatistikleri. Sadece onay verilirse yüklenir.' },
  { kategori: 'Analitik', isim: '_ga, _ga_*', kaynak: 'Google Analytics', sure: '2 yıl', aciklama: 'Sayfa görüntüleme istatistikleri. Sadece onay verilirse yüklenir.' },
]

export default function CerezPolitikasiPage() {
  return (
    <>
    <SiteHeader />
    <main className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8 text-sm text-gray-700 leading-relaxed">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Çerez Politikası</h1>
          <p className="text-gray-400 text-xs">Son güncelleme: Nisan 2026</p>
        </div>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-2">Çerez Nedir?</h2>
          <p>Çerezler, tarayıcınıza kaydedilen küçük metin dosyalarıdır. Oturumunuzu açık tutmak, tercihlerinizi hatırlamak ve site kullanımını analiz etmek için kullanılır.</p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">Kullandığımız Çerezler</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  {['Kategori', 'Çerez Adı', 'Kaynak', 'Süre', 'Açıklama'].map(h => (
                    <th key={h} className="border border-gray-200 px-3 py-2 text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CEREZLER.map(c => (
                  <tr key={c.isim}>
                    <td className="border border-gray-200 px-3 py-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${c.kategori === 'Zorunlu' ? 'bg-blue-100 text-blue-700' : 'bg-indigo-100 text-indigo-700'}`}>
                        {c.kategori}
                      </span>
                    </td>
                    <td className="border border-gray-200 px-3 py-2 font-mono">{c.isim}</td>
                    <td className="border border-gray-200 px-3 py-2">{c.kaynak}</td>
                    <td className="border border-gray-200 px-3 py-2">{c.sure}</td>
                    <td className="border border-gray-200 px-3 py-2">{c.aciklama}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-2">Tercihlerinizi Değiştirme</h2>
          <p className="mb-2">Sayfanın sol altında çıkan çerez banner&apos;ından veya tarayıcı ayarlarından tercihlerinizi değiştirebilirsiniz.</p>
          <p>Zorunlu çerezler devre dışı bırakılamaz — bunlar olmadan oturum açma çalışmaz.</p>
        </section>

        <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-100 text-xs">
          <Link href="/gizlilik" className="text-indigo-500 hover:underline">Gizlilik Politikası</Link>
          <Link href="/kvkk-aydinlatma" className="text-indigo-500 hover:underline">KVKK Aydınlatma</Link>
        </div>
      </div>
      <SiteFooter />
    </main>
    </>
  )
}
