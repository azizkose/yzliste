import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { Eyebrow } from "@/components/primitives/Eyebrow";

export const metadata: Metadata = {
  title: "Teslimat ve İade",
  description:
    "yzliste dijital hizmet teslimatı ve iade politikası. Satın alınan kredilerin iadesi hakkında bilgi.",
  alternates: { canonical: "https://www.yzliste.com/teslimat-iade" },
  robots: { index: false, follow: false },
};

export default function TeslimatIadePage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-rd-neutral-50">
        <div className="max-w-prose mx-auto px-4 sm:px-6 py-12">
          <div className="mb-8">
            <Eyebrow color="neutral" className="mb-3">
              TESLİMAT VE İADE
            </Eyebrow>
            <h1
              className="text-2xl sm:text-3xl font-medium text-rd-neutral-900 mb-1"
              style={{
                fontFamily: "var(--font-rd-display)",
                letterSpacing: "-0.01em",
              }}
            >
              Teslimat ve iade koşulları
            </h1>
            <p className="text-xs text-rd-neutral-500">
              Son güncelleme: Nisan 2026
            </p>
          </div>

          <div className="space-y-6 text-sm text-rd-neutral-700 leading-relaxed">
            <section>
              <h2 className="text-base font-medium text-rd-neutral-900 mb-2">
                Teslimat
              </h2>
              <p>
                yzliste, dijital bir hizmet platformudur. Satın alınan kullanım
                hakları ödeme işlemi tamamlandıktan hemen sonra kullanıcı
                hesabına otomatik olarak tanımlanır. Fiziksel bir teslimat söz
                konusu değildir.
              </p>
              <p className="mt-2">
                Teknik bir sorun nedeniyle kredileriniz hesabınıza
                yansımadıysa lütfen destek@yzliste.com adresine ödeme
                dekontunuzla birlikte başvurunuz. En geç 1 iş günü içinde
                sorununuz çözülecektir.
              </p>
            </section>

            <section>
              <h2 className="text-base font-medium text-rd-neutral-900 mb-2">
                İade politikası
              </h2>
              <p>
                Dijital hizmet niteliğinde olan kullanım hakları, teslim
                edildiği andan itibaren kullanılabilir durumdadır. Bu nedenle,
                6502 sayılı Tüketicinin Korunması Hakkında Kanun&apos;un 49.
                maddesi uyarınca dijital içerik ve hizmetlerde cayma hakkı
                kullanılamaz.
              </p>
              <p className="mt-2">
                Ancak hiç kullanılmamış krediler için iade talebi, satın alma
                tarihinden itibaren 3 (üç) gün içinde destek@yzliste.com
                adresine iletilmesi halinde değerlendirmeye alınacaktır.
              </p>
              <p className="mt-2">
                İade kararı verilmesi durumunda, ödeme yönteminize bağlı
                olarak 3-10 iş günü içinde hesabınıza iade edilir.
              </p>
            </section>

            <section className="border-t border-rd-neutral-200 pt-6">
              <h2 className="text-base font-medium text-rd-neutral-900 mb-2">
                İletişim
              </h2>
              <p>SIMOON PAZARLAMA VE DANISMANLIK LIMITED SIRKETI</p>
              <p className="mt-1">
                Mehmet Akif Mah. Ulubatlı Hasan Cad. Paradise City Sitesi C1
                Blok No: 43L İç Kapı No: 31 Çekmeköy / İstanbul
              </p>
              <p className="mt-1">
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
