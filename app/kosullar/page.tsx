import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Kullanım Koşulları — yzliste',
  description: 'yzliste kullanım koşulları ve hizmet şartları.',
}

export default function KosullarPage() {
  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-gray-100 px-4 sm:px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <Link href="/">
            <img src="/yzliste_logo.png" alt="yzliste" className="h-8" />
          </Link>
          <span className="text-gray-300">|</span>
          <span className="text-sm text-gray-500">Kullanım Koşulları</span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 prose prose-sm text-gray-700">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Kullanım Koşulları</h1>
        <p className="text-gray-400 text-sm mb-8">Son güncelleme: Nisan 2026 · Hukuki kontrol sürecinde — kesin metin yakında yayınlanacaktır.</p>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-sm text-amber-800">
          Bu sayfa yakında hukuki onaylı içerikle güncellenecektir. Sorularınız için <a href="mailto:destek@yzliste.com" className="underline">destek@yzliste.com</a> adresine yazın.
        </div>

        <h2 className="text-lg font-bold text-gray-800 mt-6">1. Taraflar</h2>
        <p>Bu sözleşme, SIMOON PAZARLAMA VE DANISMANLIK LIMITED SIRKETI (&quot;yzliste&quot;) ile yzliste platformunu kullanan gerçek veya tüzel kişi (&quot;Kullanıcı&quot;) arasında akdedilmektedir.</p>

        <h2 className="text-lg font-bold text-gray-800 mt-6">2. Hizmet Tanımı</h2>
        <p>yzliste, e-ticaret platformları için yapay zeka destekli içerik ve görsel üretim hizmeti sunar. Hizmet kredi bazlı çalışır; abonelik modeli yoktur.</p>

        <h2 className="text-lg font-bold text-gray-800 mt-6">3. Kullanıcı Yükümlülükleri</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Platformu yasalara aykırı amaçlarla kullanmamak</li>
          <li>Telif hakkı ihlali içeren içerik üretmemek</li>
          <li>Hesap bilgilerini üçüncü taraflarla paylaşmamak</li>
          <li>Sistemi otomatik araçlarla kötüye kullanmamak</li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 mt-6">4. Kredi ve Ödeme</h2>
        <p>Satın alınan kredilerin son kullanma tarihi yoktur. İade koşulları için <Link href="/teslimat-iade" className="text-indigo-500 hover:underline">İade Politikası</Link> sayfasına bakın.</p>

        <h2 className="text-lg font-bold text-gray-800 mt-6">5. Fikri Mülkiyet</h2>
        <p>Kullanıcı tarafından yüklenen içerikler kullanıcıya aittir. yzliste tarafından üretilen içerikler, kredi karşılığı kullanıcıya lisanslanır.</p>

        <h2 className="text-lg font-bold text-gray-800 mt-6">6. Sorumluluk Sınırı</h2>
        <p>yzliste, üretilen içeriklerin belirli bir platform tarafından kabul edileceğini garanti etmez. İçeriklerin kullanımından doğacak sonuçlar kullanıcının sorumluluğundadır.</p>

        <h2 className="text-lg font-bold text-gray-800 mt-6">7. Değişiklikler</h2>
        <p>yzliste bu koşulları önceden bildirimde bulunarak değiştirme hakkını saklı tutar. Değişiklikler yayınlandıktan sonra hizmet kullanımına devam etmek, yeni koşulların kabulü anlamına gelir.</p>

        <h2 className="text-lg font-bold text-gray-800 mt-6">8. İletişim</h2>
        <p><a href="mailto:destek@yzliste.com" className="text-indigo-500 hover:underline">destek@yzliste.com</a></p>
      </div>
    </main>
  )
}
