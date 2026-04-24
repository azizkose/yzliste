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
    <main className="min-h-screen bg-[#FAFAF8] flex flex-col">
      <div className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8 text-sm text-[#5A5852] leading-relaxed">
        <div>
          <h1 className="text-3xl font-medium text-[#1A1A17] mb-1">Çerez politikası</h1>
          <p className="text-[#908E86] text-xs">Son güncelleme: Nisan 2026</p>
        </div>

        <section>
          <h2 className="text-base font-medium text-[#1A1A17] mb-2">Çerez nedir?</h2>
          <p>Çerezler, tarayıcınıza kaydedilen küçük metin dosyalarıdır. Oturumunuzu açık tutmak, tercihlerinizi hatırlamak ve site kullanımını analiz etmek için kullanılır.</p>
        </section>

        <section>
          <h2 className="text-base font-medium text-[#1A1A17] mb-3">Kullandığımız çerezler</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-[#F1F0EB]">
                  {['Kategori', 'Çerez adı', 'Kaynak', 'Süre', 'Açıklama'].map(h => (
                    <th key={h} className="border border-[#D8D6CE] px-3 py-2 text-left text-[#5A5852]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CEREZLER.map(c => (
                  <tr key={c.isim}>
                    <td className="border border-[#D8D6CE] px-3 py-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${c.kategori === 'Zorunlu' ? 'bg-[#F0F4FB] text-[#1E4DD8]' : 'bg-[#F1F0EB] text-[#5A5852]'}`}>
                        {c.kategori}
                      </span>
                    </td>
                    <td className="border border-[#D8D6CE] px-3 py-2 font-mono text-[#1A1A17]">{c.isim}</td>
                    <td className="border border-[#D8D6CE] px-3 py-2">{c.kaynak}</td>
                    <td className="border border-[#D8D6CE] px-3 py-2">{c.sure}</td>
                    <td className="border border-[#D8D6CE] px-3 py-2">{c.aciklama}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-base font-medium text-[#1A1A17] mb-2">Tercihlerinizi değiştirme</h2>
          <p className="mb-2">Sayfanın sol altında çıkan çerez banner&apos;ından veya tarayıcı ayarlarından tercihlerinizi değiştirebilirsiniz.</p>
          <p>Zorunlu çerezler devre dışı bırakılamaz — bunlar olmadan oturum açma çalışmaz.</p>
        </section>

        <div className="flex flex-wrap gap-4 pt-4 border-t border-[#D8D6CE] text-xs">
          <Link href="/gizlilik" className="text-[#1E4DD8] hover:text-[#163B9E]">Gizlilik politikası</Link>
          <Link href="/kvkk-aydinlatma" className="text-[#1E4DD8] hover:text-[#163B9E]">KVKK aydınlatma</Link>
        </div>
      </div>
      <SiteFooter />
    </main>
    </>
  )
}
