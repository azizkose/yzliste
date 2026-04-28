import { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { Eyebrow } from "@/components/primitives/Eyebrow";

export const metadata: Metadata = {
  title: "Kullanım Koşulları",
  description: "yzliste kullanım koşulları ve hizmet şartları.",
  openGraph: { title: "Kullanım Koşulları | yzliste" },
  alternates: {
    canonical: "https://www.yzliste.com/kosullar",
    languages: {
      tr: "https://www.yzliste.com/kosullar",
      "x-default": "https://www.yzliste.com/kosullar",
    },
  },
};

export default function KosullarPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-rd-neutral-50">
        <div className="max-w-prose mx-auto px-4 sm:px-6 py-12">
          <div className="mb-8">
            <Eyebrow color="neutral" className="mb-3">
              KULLANIM KOŞULLARI
            </Eyebrow>
            <h1
              className="text-2xl sm:text-3xl font-medium text-rd-neutral-900 mb-1"
              style={{
                fontFamily: "var(--font-rd-display)",
                letterSpacing: "-0.01em",
              }}
            >
              Kullanım koşulları
            </h1>
            <p className="text-xs text-rd-neutral-500">
              Son güncelleme: Nisan 2026
            </p>
          </div>

          <div className="space-y-6 text-sm text-rd-neutral-700 leading-relaxed">
            <div className="bg-rd-neutral-100 border border-rd-neutral-200 rounded-xl p-4 text-rd-neutral-600">
              Bu metin geçici bir çerçeve olarak yayındadır; nihai versiyon
              hukuk müşaviri onayıyla yayınlanacaktır.
            </div>

            <section>
              <h2 className="text-base font-medium text-rd-neutral-900 mb-2">
                1. Taraflar
              </h2>
              <p>
                Bu sözleşme, SIMOON PAZARLAMA VE DANISMANLIK LIMITED SIRKETI
                (&quot;yzliste&quot;, vergi no: 7701113995) ile yzliste
                platformunu kullanan gerçek veya tüzel kişi
                (&quot;Kullanıcı&quot;) arasında akdedilmektedir.
              </p>
            </section>

            <section>
              <h2 className="text-base font-medium text-rd-neutral-900 mb-2">
                2. Hizmet tanımı
              </h2>
              <p>
                yzliste, e-ticaret platformları için yapay zeka destekli listing
                metni, görsel, video ve sosyal medya içeriği üretim hizmeti
                sunar. Hizmet kredi bazlı çalışır; abonelik modeli yoktur.
              </p>
            </section>

            <section>
              <h2 className="text-base font-medium text-rd-neutral-900 mb-2">
                3. Kullanıcı yükümlülükleri
              </h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  Yüklenen görsellerin tüm telif ve kullanım haklarına sahip
                  olmak
                </li>
                <li>
                  Üretilen içerikleri ilgili pazaryerine yüklemeden önce
                  uygunluğunu kontrol etmek
                </li>
                <li>
                  Hesap bilgilerini üçüncü taraflarla paylaşmamak
                </li>
                <li>
                  Sistemi otomatik veya toplu çağrılarla kötüye kullanmamak
                </li>
                <li>Platformu yasalara aykırı amaçlarla kullanmamak</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-medium text-rd-neutral-900 mb-2">
                4. Kredi ve ödeme
              </h2>
              <p>
                Satın alınan kredilerin son kullanma tarihi yoktur.
                Kullanılmamış krediler satın alma tarihinden itibaren 3 gün
                içinde iade talebine konu olabilir. Detaylar için{" "}
                <Link
                  href="/teslimat-iade"
                  className="text-rd-primary-600 hover:text-rd-primary-700 underline underline-offset-2"
                >
                  İade Politikası
                </Link>{" "}
                sayfasına bakın.
              </p>
            </section>

            <section>
              <h2 className="text-base font-medium text-rd-neutral-900 mb-2">
                5. Fikri mülkiyet
              </h2>
              <p>
                Kullanıcı tarafından yüklenen içerikler kullanıcıya aittir.
                Yapay zeka ile üretilen içerikler, ilgili kredi kullanıldığında
                kullanıcıya ticari kullanım için sınırsız, münhasır olmayan
                lisansla devredilir.
              </p>
            </section>

            <section>
              <h2 className="text-base font-medium text-rd-neutral-900 mb-2">
                6. AI çıktılarında sorumluluk sınırı
              </h2>
              <p>
                Yapay zeka ile üretilen içerikler yanlış yazı, marka logosuna
                benzer öğe veya ürün özelliklerinde hata içerebilir. Kullanıcı,
                içerikleri ilgili pazaryerinde yayınlamadan önce doğrulamakla
                yükümlüdür. yzliste, bu tür hatalardan kaynaklanan dolaylı
                zararlardan sorumlu değildir.
              </p>
            </section>

            <section>
              <h2 className="text-base font-medium text-rd-neutral-900 mb-2">
                7. Pazaryeri kabulü
              </h2>
              <p>
                yzliste, üretilen içeriklerin Trendyol, Hepsiburada, Amazon,
                N11, Etsy veya diğer pazaryerlerinde onaylanacağını garanti
                etmez. Pazaryeri red kararlarında kullanılan krediler iade
                edilmez.
              </p>
            </section>

            <section>
              <h2 className="text-base font-medium text-rd-neutral-900 mb-2">
                8. Değişiklikler
              </h2>
              <p>
                yzliste bu koşulları e-posta bildirimi ile güncelleyebilir.
                Bildirim sonrası hizmet kullanımına devam etmek, yeni koşulların
                kabulü anlamına gelir.
              </p>
            </section>

            <section>
              <h2 className="text-base font-medium text-rd-neutral-900 mb-2">
                9. Uyuşmazlık
              </h2>
              <p>
                Bu sözleşmeden doğan uyuşmazlıklarda Türk Hukuku uygulanır.
                Yetkili mahkemeler İstanbul Merkez Tüketici Mahkemeleri ve
                İstanbul Tahkim Merkezi&apos;dir.
              </p>
            </section>

            <section>
              <h2 className="text-base font-medium text-rd-neutral-900 mb-2">
                10. İletişim
              </h2>
              <p>
                <a
                  href="mailto:destek@yzliste.com"
                  className="text-rd-primary-600 hover:text-rd-primary-700 underline underline-offset-2"
                >
                  destek@yzliste.com
                </a>
              </p>
            </section>
          </div>
        </div>
        <SiteFooter />
      </main>
    </>
  );
}
