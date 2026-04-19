import { Metadata } from 'next'
import Link from 'next/link'
import SiteHeader from "@/components/SiteHeader"
import SiteFooter from "@/components/SiteFooter"

export const metadata: Metadata = {
  title: 'Kullanım Koşulları',
  description: 'yzliste kullanım koşulları ve hizmet şartları.',
  openGraph: { title: 'Kullanım Koşulları | yzliste' },
  alternates: {
    canonical: 'https://www.yzliste.com/kosullar',
    languages: { 'tr': 'https://www.yzliste.com/kosullar', 'x-default': 'https://www.yzliste.com/kosullar' },
  },
}

export default function KosullarPage() {
  return (
    <>
    <SiteHeader />
    <main className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 prose prose-sm text-gray-700">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Kullanım Koşulları</h1>
        <p className="text-gray-400 text-sm mb-8">Son güncelleme: Nisan 2026</p>

        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-8 text-sm text-gray-600">
          Bu metin geçici bir çerçeve olarak yayındadır; nihai versiyon hukuk müşaviri onayıyla yayınlanacaktır.
        </div>

        <h2 className="text-lg font-bold text-gray-800 mt-6">1. Taraflar</h2>
        <p>Bu sözleşme, SIMOON PAZARLAMA VE DANISMANLIK LIMITED SIRKETI (&quot;yzliste&quot;, vergi no: 7701113995) ile yzliste platformunu kullanan gerçek veya tüzel kişi (&quot;Kullanıcı&quot;) arasında akdedilmektedir.</p>

        <h2 className="text-lg font-bold text-gray-800 mt-6">2. Hizmet Tanımı</h2>
        <p>yzliste, e-ticaret platformları için yapay zeka destekli listing metni, görsel, video ve sosyal medya içeriği üretim hizmeti sunar. Hizmet kredi bazlı çalışır; abonelik modeli yoktur.</p>

        <h2 className="text-lg font-bold text-gray-800 mt-6">3. Kullanıcı Yükümlülükleri</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Yüklenen görsellerin tüm telif ve kullanım haklarına sahip olmak</li>
          <li>Üretilen içerikleri ilgili pazaryerine yüklemeden önce uygunluğunu kontrol etmek</li>
          <li>Hesap bilgilerini üçüncü taraflarla paylaşmamak</li>
          <li>Sistemi otomatik veya toplu çağrılarla kötüye kullanmamak</li>
          <li>Platformu yasalara aykırı amaçlarla kullanmamak</li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 mt-6">4. Kredi ve Ödeme</h2>
        <p>Satın alınan kredilerin son kullanma tarihi yoktur. Kullanılmamış krediler satın alma tarihinden itibaren 3 gün içinde iade talebine konu olabilir. Detaylar için <Link href="/teslimat-iade" className="text-indigo-500 hover:underline">İade Politikası</Link> sayfasına bakın.</p>

        <h2 className="text-lg font-bold text-gray-800 mt-6">5. Fikri Mülkiyet</h2>
        <p>Kullanıcı tarafından yüklenen içerikler kullanıcıya aittir. Yapay zeka ile üretilen içerikler, ilgili kredi kullanıldığında kullanıcıya ticari kullanım için sınırsız, münhasır olmayan lisansla devredilir.</p>

        <h2 className="text-lg font-bold text-gray-800 mt-6">6. AI Çıktılarında Sorumluluk Sınırı</h2>
        <p>Yapay zeka ile üretilen içerikler yanlış yazı, marka logosuna benzer öğe veya ürün özelliklerinde hata içerebilir. Kullanıcı, içerikleri ilgili pazaryerinde yayınlamadan önce doğrulamakla yükümlüdür. yzliste, bu tür hatalardan kaynaklanan dolaylı zararlardan sorumlu değildir.</p>

        <h2 className="text-lg font-bold text-gray-800 mt-6">7. Pazaryeri Kabulü</h2>
        <p>yzliste, üretilen içeriklerin Trendyol, Hepsiburada, Amazon, N11, Etsy veya diğer pazaryerlerinde onaylanacağını garanti etmez. Pazaryeri red kararlarında kullanılan krediler iade edilmez.</p>

        <h2 className="text-lg font-bold text-gray-800 mt-6">8. Değişiklikler</h2>
        <p>yzliste bu koşulları e-posta bildirimi ile güncelleyebilir. Bildirim sonrası hizmet kullanımına devam etmek, yeni koşulların kabulü anlamına gelir.</p>

        <h2 className="text-lg font-bold text-gray-800 mt-6">9. Uyuşmazlık</h2>
        <p>Bu sözleşmeden doğan uyuşmazlıklarda Türk Hukuku uygulanır. Yetkili mahkemeler İstanbul Merkez Tüketici Mahkemeleri ve İstanbul Tahkim Merkezi&apos;dir.</p>

        <h2 className="text-lg font-bold text-gray-800 mt-6">10. İletişim</h2>
        <p><a href="mailto:destek@yzliste.com" className="text-indigo-500 hover:underline">destek@yzliste.com</a></p>
      </div>
      <SiteFooter />
    </main>
    </>
  )
}
