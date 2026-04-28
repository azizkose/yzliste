import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { Eyebrow } from "@/components/primitives/Eyebrow";

export const metadata: Metadata = {
  title: "Mesafeli Satış Sözleşmesi",
  description:
    "yzliste kredi paketleri için mesafeli satış sözleşmesi. 6502 sayılı TKHK kapsamında yasal metin.",
  alternates: { canonical: "https://www.yzliste.com/mesafeli-satis" },
  robots: { index: false, follow: false },
};

export default function MesafeliSatisPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-rd-neutral-50">
        <div className="max-w-prose mx-auto px-4 sm:px-6 py-12">
          <div className="mb-8">
            <Eyebrow color="neutral" className="mb-3">
              MESAFELİ SATIŞ
            </Eyebrow>
            <h1
              className="text-2xl sm:text-3xl font-medium text-rd-neutral-900 mb-1"
              style={{
                fontFamily: "var(--font-rd-display)",
                letterSpacing: "-0.01em",
              }}
            >
              Mesafeli satış sözleşmesi
            </h1>
            <p className="text-xs text-rd-neutral-500">
              Son güncelleme: Nisan 2026
            </p>
          </div>

          <div className="space-y-6 text-sm text-rd-neutral-700 leading-relaxed">
            <section>
              <h2 className="text-base font-medium text-rd-neutral-900 mb-2">
                1. Taraflar
              </h2>
              <div className="space-y-1">
                <p>
                  <span className="font-medium text-rd-neutral-900">
                    Satıcı ünvanı:
                  </span>{" "}
                  SIMOON PAZARLAMA VE DANISMANLIK LIMITED SIRKETI
                </p>
                <p>
                  <span className="font-medium text-rd-neutral-900">
                    Adres:
                  </span>{" "}
                  Mehmet Akif Mah. Ulubatlı Hasan Cad. Paradise City Sitesi C1
                  Blok No: 43L İç Kapı No: 31 Çekmeköy / İstanbul
                </p>
                <p>
                  <span className="font-medium text-rd-neutral-900">
                    Vergi dairesi / No:
                  </span>{" "}
                  Sarıgazi / 7701113995
                </p>
                <p>
                  <span className="font-medium text-rd-neutral-900">
                    E-posta:
                  </span>{" "}
                  <a
                    href="mailto:destek@yzliste.com"
                    className="text-rd-primary-600 hover:text-rd-primary-700 underline underline-offset-2"
                  >
                    destek@yzliste.com
                  </a>
                </p>
                <p className="mt-2">
                  <span className="font-medium text-rd-neutral-900">
                    Alıcı:
                  </span>{" "}
                  Platforma kayıtlı kullanıcı
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-base font-medium text-rd-neutral-900 mb-2">
                2. Sözleşmenin konusu
              </h2>
              <p>
                İşbu sözleşme, Alıcının yzliste.com platformunda satın aldığı
                dijital kullanım haklarına (kredi paketleri) ilişkin koşulları
                düzenlemektedir.
              </p>
            </section>

            <section>
              <h2 className="text-base font-medium text-rd-neutral-900 mb-2">
                3. Hizmet ve fiyat bilgileri
              </h2>
              <ul className="list-disc ml-5 space-y-1">
                <li>Başlangıç Paketi: 10 kredi — 49 TL (KDV dahil)</li>
                <li>Popüler Paket: 30 kredi — 129 TL (KDV dahil)</li>
                <li>Büyük Paket: 100 kredi — 299 TL (KDV dahil)</li>
              </ul>
              <p className="mt-2">
                Kullanım hakları ödeme tamamlandıktan hemen sonra hesaba
                tanımlanır.
              </p>
            </section>

            <section>
              <h2 className="text-base font-medium text-rd-neutral-900 mb-2">
                4. Ödeme
              </h2>
              <p>
                Ödemeler iyzico ödeme altyapısı üzerinden güvenli şekilde
                gerçekleştirilir. Kredi kartı, banka kartı ve taksit seçenekleri
                mevcuttur.
              </p>
            </section>

            <section>
              <h2 className="text-base font-medium text-rd-neutral-900 mb-2">
                5. Teslimat
              </h2>
              <p>
                Satın alınan kullanım hakları, ödemenin onaylanmasının ardından
                anında kullanıcı hesabına tanımlanır. Dijital hizmet niteliğinde
                olduğundan fiziksel teslimat söz konusu değildir.
              </p>
            </section>

            <section>
              <h2 className="text-base font-medium text-rd-neutral-900 mb-2">
                6. Cayma hakkı
              </h2>
              <p>
                6502 sayılı Tüketicinin Korunması Hakkında Kanun&apos;un 49.
                maddesi ve Mesafeli Sözleşmeler Yönetmeliği uyarınca; dijital
                içerik ve hizmetler, tüketicinin onayıyla ifaya başlandığı
                andan itibaren cayma hakkı kapsamı dışında tutulabilir.
              </p>
              <p className="mt-2">
                Kullanıcı, satın alma işlemini tamamlayarak dijital hizmetin
                hemen kullanılabilir hale getirilmesine onay vermiş sayılır ve
                bu durumda cayma hakkından feragat etmiş kabul edilir.
              </p>
              <p className="mt-2">
                Hiç kullanılmamış krediler için 3 gün içinde
                destek@yzliste.com adresine başvurulabilir.
              </p>
            </section>

            <section>
              <h2 className="text-base font-medium text-rd-neutral-900 mb-2">
                7. Uyuşmazlık çözümü
              </h2>
              <p>
                İşbu sözleşmeden doğacak uyuşmazlıklarda İstanbul mahkemeleri
                ve tüketici hakem heyetleri yetkilidir.
              </p>
            </section>

            <section>
              <h2 className="text-base font-medium text-rd-neutral-900 mb-2">
                8. Yürürlük
              </h2>
              <p>
                Alıcı, satın alma işlemini tamamlayarak işbu sözleşmeyi
                okuduğunu, anladığını ve kabul ettiğini beyan eder.
              </p>
            </section>
          </div>
        </div>
        <SiteFooter />
      </main>
    </>
  );
}
