import { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { Eyebrow } from "@/components/primitives/Eyebrow";

export const metadata: Metadata = {
  title: "Gizlilik Politikası ve KVKK Aydınlatma",
  description:
    "yzliste gizlilik politikası, kişisel veri işleme ve KVKK kapsamındaki haklarınız.",
  openGraph: { title: "Gizlilik Politikası | yzliste" },
  alternates: {
    canonical: "https://www.yzliste.com/gizlilik",
    languages: {
      tr: "https://www.yzliste.com/gizlilik",
      "x-default": "https://www.yzliste.com/gizlilik",
    },
  },
};

export default function GizlilikPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-rd-neutral-50">
        <div className="max-w-prose mx-auto px-4 sm:px-6 py-12">
          <div className="mb-8">
            <Eyebrow color="neutral" className="mb-3">
              GİZLİLİK
            </Eyebrow>
            <h1
              className="text-2xl sm:text-3xl font-medium text-rd-neutral-900 mb-1"
              style={{
                fontFamily: "var(--font-rd-display)",
                letterSpacing: "-0.01em",
              }}
            >
              Gizlilik politikası
            </h1>
            <p className="text-xs text-rd-neutral-500">
              Son güncelleme: Nisan 2026
            </p>
          </div>

          <div className="space-y-8 text-sm text-rd-neutral-700 leading-relaxed">
            <section>
              <h2 className="text-base font-medium text-rd-neutral-900 mb-2">
                1. Veri sorumlusu
              </h2>
              <p>
                6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;)
                kapsamında veri sorumlusu:{" "}
                <strong className="text-rd-neutral-900">
                  SIMOON PAZARLAMA VE DANISMANLIK LIMITED SIRKETI
                </strong>{" "}
                (&quot;yzliste&quot;) — destek@yzliste.com.
              </p>
            </section>

            <section>
              <h2 className="text-base font-medium text-rd-neutral-900 mb-2">
                2. İşlenen kişisel veri kategorileri
              </h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong className="text-rd-neutral-900">Kimlik:</strong> Ad
                  soyad, TC kimlik numarası (fatura için)
                </li>
                <li>
                  <strong className="text-rd-neutral-900">İletişim:</strong>{" "}
                  E-posta adresi
                </li>
                <li>
                  <strong className="text-rd-neutral-900">İşlem:</strong>{" "}
                  Üretilen içerikler, kredi geçmişi, oturum logları
                </li>
                <li>
                  <strong className="text-rd-neutral-900">Ödeme:</strong> Fatura
                  bilgileri (kart bilgisi iyzico altyapısında saklanır)
                </li>
                <li>
                  <strong className="text-rd-neutral-900">Kullanım:</strong>{" "}
                  Sayfa görüntülemeleri, tıklamalar (yalnızca analitik onayı
                  verilirse)
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-medium text-rd-neutral-900 mb-3">
                3. İşleme amacı ve hukuki sebep
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="bg-rd-neutral-100">
                      <th className="border border-rd-neutral-200 px-3 py-2 text-left text-rd-neutral-700">
                        Amaç
                      </th>
                      <th className="border border-rd-neutral-200 px-3 py-2 text-left text-rd-neutral-700">
                        Hukuki sebep (KVKK Md. 5)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      [
                        "Hesap oluşturma ve kimlik doğrulama",
                        "Sözleşmenin ifası",
                      ],
                      [
                        "Hizmet sunumu (içerik üretimi)",
                        "Sözleşmenin ifası",
                      ],
                      [
                        "Ödeme ve e-Arşiv fatura",
                        "Hukuki yükümlülük",
                      ],
                      ["Müşteri desteği", "Meşru menfaat"],
                      ["Kullanım analizi (PostHog)", "Açık rıza"],
                      [
                        "Güvenlik ve dolandırıcılık önleme",
                        "Meşru menfaat / Hukuki yükümlülük",
                      ],
                    ].map(([a, h]) => (
                      <tr key={a}>
                        <td className="border border-rd-neutral-200 px-3 py-2 text-rd-neutral-700">
                          {a}
                        </td>
                        <td className="border border-rd-neutral-200 px-3 py-2 text-rd-neutral-600">
                          {h}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-base font-medium text-rd-neutral-900 mb-2">
                4. Kişisel verilerin aktarımı
              </h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong className="text-rd-neutral-900">
                    Supabase (Almanya — AB):
                  </strong>{" "}
                  Kimlik ve hesap verileri
                </li>
                <li>
                  <strong className="text-rd-neutral-900">iyzico:</strong> Ödeme
                  verileri (PCI-DSS uyumlu)
                </li>
                <li>
                  <strong className="text-rd-neutral-900">
                    Anthropic / FAL AI (ABD):
                  </strong>{" "}
                  Üretim girdileri — SCC kapsamında
                </li>
                <li>
                  <strong className="text-rd-neutral-900">
                    PostHog EU Cloud (AB):
                  </strong>{" "}
                  Kullanım analizi — yalnızca onay verilmişse
                </li>
                <li>
                  <strong className="text-rd-neutral-900">
                    Yasal yükümlülük:
                  </strong>{" "}
                  Yetkili kamu kurumları
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-medium text-rd-neutral-900 mb-2">
                5. Saklama süreleri
              </h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  Hesap verileri: Silme talebinden 30 gün sonra kalıcı silinir
                </li>
                <li>
                  Fatura ve ödeme kayıtları: 10 yıl (Türk Ticaret Kanunu)
                </li>
                <li>Analitik veriler: 1 yıl</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-medium text-rd-neutral-900 mb-2">
                6. KVKK Madde 11 — Haklarınız
              </h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>Verilerinizin işlenip işlenmediğini öğrenme</li>
                <li>İşlenmişse bilgi talep etme ve düzeltme isteme</li>
                <li>
                  Koşullar ortadan kalktığında silinmesini isteme
                </li>
                <li>Yurt içi / dışı aktarım bilgisi alma</li>
                <li>Otomatik karar sonuçlarına itiraz etme</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-medium text-rd-neutral-900 mb-2">
                7. Başvuru yolu
              </h2>
              <p>
                KVKK taleplerinizi{" "}
                <a
                  href="mailto:destek@yzliste.com"
                  className="text-rd-primary-600 hover:text-rd-primary-700 underline underline-offset-2"
                >
                  destek@yzliste.com
                </a>{" "}
                adresine &quot;KVKK Başvurusu&quot; konu başlığıyla
                iletebilirsiniz. 30 gün içinde yanıtlanır.
              </p>
            </section>
          </div>

          <div className="flex flex-wrap gap-4 pt-6 mt-8 border-t border-rd-neutral-200 text-xs">
            <Link
              href="/cerez-politikasi"
              className="text-rd-primary-600 hover:text-rd-primary-700"
            >
              Çerez politikası
            </Link>
            <Link
              href="/kvkk-aydinlatma"
              className="text-rd-primary-600 hover:text-rd-primary-700"
            >
              KVKK aydınlatma metni
            </Link>
            <Link
              href="/kosullar"
              className="text-rd-primary-600 hover:text-rd-primary-700"
            >
              Kullanım koşulları
            </Link>
          </div>
        </div>
        <SiteFooter />
      </main>
    </>
  );
}
