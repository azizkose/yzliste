import { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { Eyebrow } from "@/components/primitives/Eyebrow";

export const metadata: Metadata = {
  title: "KVKK Aydınlatma Metni",
  description:
    "6698 sayılı KVKK kapsamında yzliste kişisel veri aydınlatma metni.",
  openGraph: { title: "KVKK Aydınlatma Metni | yzliste" },
  alternates: {
    canonical: "/kvkk-aydinlatma",
    languages: {
      tr: "https://www.yzliste.com/kvkk-aydinlatma",
      "x-default": "https://www.yzliste.com/kvkk-aydinlatma",
    },
  },
};

export default function KVKKAydinlatmaPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-rd-neutral-50">
        <div className="max-w-prose mx-auto px-4 sm:px-6 py-12">
          <div className="mb-8">
            <Eyebrow color="neutral" className="mb-3">
              KVKK
            </Eyebrow>
            <h1
              className="text-2xl sm:text-3xl font-medium text-rd-neutral-900 mb-1"
              style={{
                fontFamily: "var(--font-rd-display)",
                letterSpacing: "-0.01em",
              }}
            >
              KVKK aydınlatma metni
            </h1>
            <p className="text-xs text-rd-neutral-500">
              6698 Sayılı Kişisel Verilerin Korunması Kanunu Md. 10 Kapsamında
              · Nisan 2026
            </p>
          </div>

          <div className="space-y-6 text-sm text-rd-neutral-700 leading-relaxed">
            <p>
              <strong className="text-rd-neutral-900">
                SIMOON PAZARLAMA VE DANISMANLIK LIMITED SIRKETI
              </strong>{" "}
              (&quot;Şirket&quot;) olarak, kişisel verilerinizi aşağıda
              açıklanan amaçlar doğrultusunda, KVKK&apos;nın 10. maddesi
              gereğince sizleri aydınlatmak amacıyla bu metni hazırladık.
            </p>

            <section>
              <h2 className="text-base font-medium text-rd-neutral-900 mb-2">
                A. Veri sorumlusu
              </h2>
              <p>
                SIMOON PAZARLAMA VE DANISMANLIK LIMITED SIRKETI ·
                destek@yzliste.com
              </p>
            </section>

            <section>
              <h2 className="text-base font-medium text-rd-neutral-900 mb-2">
                B. Toplanan kişisel veriler
              </h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>E-posta adresi (kayıt ve iletişim)</li>
                <li>Ad soyad, TC/VKN, adres (fatura zorunluluğu)</li>
                <li>Kullanım verileri — içerik girdileri, üretim geçmişi</li>
                <li>IP adresi ve teknik log verileri (güvenlik)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-medium text-rd-neutral-900 mb-2">
                C. Kişisel verilerin işlenme amacı
              </h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>Kullanıcı hesabı oluşturma ve kimlik doğrulama</li>
                <li>AI içerik üretim hizmetinin sunulması</li>
                <li>
                  Ödeme işlemlerinin gerçekleştirilmesi ve yasal fatura
                  düzenlenmesi
                </li>
                <li>Müşteri destek hizmetleri</li>
                <li>
                  Hizmet güvenliğinin sağlanması ve kötüye kullanımın
                  önlenmesi
                </li>
                <li>Onay verilmesi halinde: anonim kullanım analizi</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-medium text-rd-neutral-900 mb-2">
                D. Hukuki işleme sebepleri (Md. 5)
              </h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong className="text-rd-neutral-900">
                    Sözleşmenin ifası:
                  </strong>{" "}
                  Hesap ve hizmet verileri
                </li>
                <li>
                  <strong className="text-rd-neutral-900">
                    Hukuki yükümlülük:
                  </strong>{" "}
                  Fatura ve ödeme kayıtları
                </li>
                <li>
                  <strong className="text-rd-neutral-900">
                    Meşru menfaat:
                  </strong>{" "}
                  Güvenlik, destek
                </li>
                <li>
                  <strong className="text-rd-neutral-900">Açık rıza:</strong>{" "}
                  Analitik çerezler
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-medium text-rd-neutral-900 mb-2">
                E. Kişisel verilerin aktarıldığı taraflar
              </h2>
              <p>
                Verileriniz; hizmet altyapısını sağlayan Supabase (AB), ödeme
                hizmeti iyzico, AI altyapıları Anthropic ve FAL AI ile yasal
                zorunluluk halinde yetkili kamu kurumlarıyla paylaşılmaktadır.
                Yurt dışı aktarımlarda KVKK Md. 9 kapsamında standart sözleşme
                maddeleri uygulanmaktadır.
              </p>
            </section>

            <section>
              <h2 className="text-base font-medium text-rd-neutral-900 mb-2">
                F. KVKK Md. 11 kapsamındaki haklarınız
              </h2>
              <p className="mb-2">
                Veri sahibi olarak şu haklara sahipsiniz:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  Kişisel verilerinizin işlenip işlenmediğini öğrenme
                </li>
                <li>İşlenmişse bilgi talep etme</li>
                <li>Amacı ve amaca uygunluğunu öğrenme</li>
                <li>
                  Yurt içi/dışında kimlere aktarıldığını öğrenme
                </li>
                <li>Eksik/hatalı verilerin düzeltilmesini isteme</li>
                <li>
                  Silme veya yok edilmesini isteme (yasal saklama
                  yükümlülükleri saklı)
                </li>
                <li>
                  Silme/düzeltme işleminin aktarılan üçüncü taraflara
                  bildirilmesini isteme
                </li>
                <li>
                  Otomatik sistemler aracılığıyla analiz sonuçlarına itiraz
                  etme
                </li>
                <li>Zararın tazmin edilmesini talep etme</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-medium text-rd-neutral-900 mb-2">
                G. Başvuru yöntemi
              </h2>
              <p>
                Başvurularınızı{" "}
                <a
                  href="mailto:destek@yzliste.com"
                  className="text-rd-primary-600 hover:text-rd-primary-700 underline underline-offset-2"
                >
                  destek@yzliste.com
                </a>{" "}
                adresine &quot;KVKK Başvurusu&quot; konu başlığıyla yazılı
                olarak iletebilirsiniz. Başvurular en geç{" "}
                <strong className="text-rd-neutral-900">30 gün</strong> içinde
                yanıtlanır; talep gereği ücretsizdir, işlemin ayrıca bir
                maliyet gerektirmesi halinde Kurul tarifesi uygulanır.
              </p>
            </section>
          </div>

          <div className="flex flex-wrap gap-4 pt-6 mt-8 border-t border-rd-neutral-200 text-xs">
            <Link
              href="/gizlilik"
              className="text-rd-primary-600 hover:text-rd-primary-700"
            >
              Gizlilik politikası
            </Link>
            <Link
              href="/cerez-politikasi"
              className="text-rd-primary-600 hover:text-rd-primary-700"
            >
              Çerez politikası
            </Link>
          </div>
        </div>
        <SiteFooter />
      </main>
    </>
  );
}
