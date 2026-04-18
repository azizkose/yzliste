import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Sık Sorulan Sorular',
  description: 'yzliste hakkında en sık sorulan sorular ve cevapları. Krediler, ödeme, iade ve platformlar hakkında her şey.',
  alternates: { canonical: 'https://www.yzliste.com/sss' },
}

const SORULAR = [
  {
    s: 'Kredi nedir, nasıl çalışır?',
    c: 'Her içerik üretimi 1 kredi tüketir. Listing metni (başlık + özellikler + açıklama + etiketler) 1 kredi, görsel üretimi (1 stil = 1 görsel) 1 kredi, video üretimi 5–8 kredi, sosyal medya içeriği 1 kredidir. Kayıt olunca 3 ücretsiz kredi hediye edilir.',
  },
  {
    s: 'Kredilerim ne zaman expire olur?',
    c: 'Satın alınan kredilerin son kullanma tarihi yoktur. Hesabınızda kaldığı sürece geçerlidir.',
  },
  {
    s: 'İade nasıl yapılır?',
    c: 'Kullanılmamış krediler için satın alma tarihinden itibaren 14 gün içinde destek@yzliste.com adresine yazarak iade talep edebilirsiniz. Kullanılmış krediler iade edilemez.',
  },
  {
    s: 'Hangi pazaryerlerini destekliyorsunuz?',
    c: 'Trendyol, Hepsiburada, Amazon TR, N11, Etsy ve Amazon USA için platforma özel format ve dil desteği sunuyoruz. Her platform için başlık uzunlukları, özellik sayısı ve dil kuralları ayrı ayrı optimize edilmiştir.',
  },
  {
    s: 'Ürünü Trendyol\'a nasıl yüklerim?',
    c: 'yzliste\'de ürettiğiniz metni kopyalayarak Trendyol Satıcı Paneli\'ndeki ürün ekleme formuna yapıştırabilirsiniz. Her bölüm (başlık, özellikler, açıklama) ayrı kutuda verilir; tek tıkla kopyalanır.',
  },
  {
    s: 'Fotoğraf olmadan kullanabilir miyim?',
    c: 'Evet. Ürün adı ve birkaç özellik yazarak metin üretebilirsiniz. Ancak fotoğraf yüklerseniz AI ürünü otomatik analiz eder ve daha doğru içerik üretir.',
  },
  {
    s: 'Görsel üretiminde kredi ne zaman düşer?',
    c: 'Seçtiğin her stil için 1 görsel üretilir ve kredi üretim anında düşer. Birden fazla stil seçebilirsin — her biri ayrı 1 kredi. İndirme bedavadır.',
  },
  {
    s: 'Abonelik var mı?',
    c: 'Hayır. yzliste tamamen kullandığın kadar öde modeli ile çalışır. Aylık abonelik yoktur. 29₺\'den başlayan kredi paketleri mevcuttur.',
  },
  {
    s: 'Verilerimi güvende mi?',
    c: 'Evet. Tüm veriler Supabase altyapısında şifrelenmiş olarak saklanır. Ürün bilgileri ve üretilen içerikler sadece size aittir; üçüncü taraflarla paylaşılmaz.',
  },
  {
    s: 'Teknik destek nasıl alırım?',
    c: 'destek@yzliste.com adresine e-posta gönderebilir veya sitedeki sohbet widgetını kullanabilirsiniz. Yanıt süremiz 24 saattir.',
  },
]

function FaqJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: SORULAR.map((item) => ({
            '@type': 'Question',
            name: item.s,
            acceptedAnswer: { '@type': 'Answer', text: item.c },
          })),
        }),
      }}
    />
  )
}

export default function SSSPage() {
  return (
    <main className="min-h-screen bg-white">
      <FaqJsonLd />
      <header className="border-b border-gray-100 px-4 sm:px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <Link href="/">
            <img src="/yzliste_logo.png" alt="yzliste" className="h-8" />
          </Link>
          <span className="text-gray-300">|</span>
          <span className="text-sm text-gray-500">Sık Sorulan Sorular</span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Sık Sorulan Sorular</h1>
        <p className="text-gray-500 mb-10">Aklınızdaki soruların cevabını burada bulamazsanız <a href="mailto:destek@yzliste.com" className="text-indigo-500 hover:underline">destek@yzliste.com</a> adresine yazın.</p>

        <div className="space-y-4">
          {SORULAR.map((item, i) => (
            <details key={i} className="group border border-gray-200 rounded-2xl overflow-hidden">
              <summary className="flex items-center justify-between px-6 py-4 cursor-pointer list-none hover:bg-gray-50 transition-colors">
                <span className="font-semibold text-gray-800 text-sm pr-4">{item.s}</span>
                <span className="text-gray-400 flex-shrink-0 group-open:rotate-180 transition-transform">↓</span>
              </summary>
              <div className="px-6 pb-5 pt-1">
                <p className="text-sm text-gray-600 leading-relaxed">{item.c}</p>
              </div>
            </details>
          ))}
        </div>

        <div className="mt-12 text-center bg-indigo-50 rounded-2xl p-8 border border-indigo-100">
          <p className="text-gray-700 font-semibold mb-2">Hâlâ sorunuz mu var?</p>
          <p className="text-sm text-gray-500 mb-4">Yanıt süremiz 24 saattir.</p>
          <a
            href="mailto:destek@yzliste.com"
            className="inline-block bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors"
          >
            destek@yzliste.com
          </a>
        </div>
      </div>
    </main>
  )
}
