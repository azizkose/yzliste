import type { Metadata } from 'next'
import Link from 'next/link'
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: 'Teslimat ve İade',
  description: 'yzliste dijital hizmet teslimatı ve iade politikası. Satın alınan kredilerin iadesi hakkında bilgi.',
  alternates: { canonical: 'https://www.yzliste.com/teslimat-iade' },
  robots: { index: false, follow: false },
}

export default function TeslimatIadePage() {
  return (
    <>
    <SiteHeader />
    <main className="min-h-screen bg-[#FAFAF8] flex flex-col">
      <div className="flex-1 max-w-3xl mx-auto py-12 px-4">
        <div className="mb-8">
          <Link href="/" className="text-sm text-[#908E86] hover:text-[#1E4DD8]">← Ana Sayfa</Link>
        </div>
        <div className="bg-white rounded-xl border border-[#D8D6CE] p-8">
          <h1 className="text-2xl font-medium text-[#1A1A17] mb-6">Teslimat ve iade şartları</h1>
          <div className="space-y-6 text-[#5A5852] text-sm leading-relaxed">

            <div>
              <h2 className="text-base font-medium text-[#1A1A17] mb-2">Teslimat</h2>
              <p>
                yzliste, dijital bir hizmet platformudur. Satın alınan kullanım hakları
                ödeme işlemi tamamlandıktan hemen sonra kullanıcı hesabına otomatik olarak
                tanımlanır. Fiziksel bir teslimat söz konusu değildir.
              </p>
              <p className="mt-2">
                Teknik bir sorun nedeniyle kredileriniz hesabınıza yansımadıysa lütfen
                destek@yzliste.com adresine ödeme dekontunuzla birlikte başvurunuz.
                En geç 1 iş günü içinde sorununuz çözülecektir.
              </p>
            </div>

            <div>
              <h2 className="text-base font-medium text-[#1A1A17] mb-2">İade politikası</h2>
              <p>
                Dijital hizmet niteliğinde olan kullanım hakları, teslim edildiği andan
                itibaren kullanılabilir durumdadır. Bu nedenle, 6502 sayılı Tüketicinin
                Korunması Hakkında Kanun&apos;un 49. maddesi uyarınca dijital içerik ve
                hizmetlerde cayma hakkı kullanılamaz.
              </p>
              <p className="mt-2">
                Ancak hiç kullanılmamış krediler için iade talebi, satın alma tarihinden
                itibaren 3 (üç) gün içinde destek@yzliste.com adresine iletilmesi halinde
                değerlendirmeye alınacaktır.
              </p>
              <p className="mt-2">
                İade kararı verilmesi durumunda, ödeme yönteminize bağlı olarak
                3-10 iş günü içinde hesabınıza iade edilir.
              </p>
            </div>

            <div className="border-t border-[#D8D6CE] pt-4">
              <h2 className="text-base font-medium text-[#1A1A17] mb-2">İletişim</h2>
              <p>SIMOON PAZARLAMA VE DANISMANLIK LIMITED SIRKETI</p>
              <p>Mehmet Akif Mah. Ulubatlı Hasan Cad. Paradise City Sitesi C1 Blok No: 43L İç Kapı No: 31 Çekmeköy / İstanbul</p>
              <p className="mt-1">
                <a href="mailto:destek@yzliste.com" className="text-[#1E4DD8] hover:text-[#163B9E]">destek@yzliste.com</a>
              </p>
            </div>
          </div>
        </div>
      </div>
      <SiteFooter />
    </main>
    </>
  );
}
