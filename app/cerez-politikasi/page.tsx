import { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { Eyebrow } from "@/components/primitives/Eyebrow";

export const metadata: Metadata = {
  title: "Çerez Politikası",
  description:
    "yzliste çerez politikası — hangi çerezlerin kullanıldığı ve nasıl kontrol edeceğiniz.",
  openGraph: { title: "Çerez Politikası | yzliste" },
  alternates: {
    canonical: "/cerez-politikasi",
    languages: {
      tr: "https://www.yzliste.com/cerez-politikasi",
      "x-default": "https://www.yzliste.com/cerez-politikasi",
    },
  },
};

const CEREZLER = [
  {
    kategori: "Zorunlu",
    isim: "sb-*-auth-token",
    kaynak: "Supabase",
    sure: "Oturum",
    aciklama: "Giriş oturumunu yönetir. Olmadan site çalışmaz.",
  },
  {
    kategori: "Zorunlu",
    isim: "cc_cookie",
    kaynak: "yzliste",
    sure: "1 yıl",
    aciklama: "Çerez tercihlerinizi hatırlar.",
  },
  {
    kategori: "Analitik",
    isim: "ph_*",
    kaynak: "PostHog EU",
    sure: "1 yıl",
    aciklama:
      "Anonim kullanım istatistikleri. Sadece onay verilirse yüklenir.",
  },
  {
    kategori: "Analitik",
    isim: "_ga, _ga_*",
    kaynak: "Google Analytics",
    sure: "2 yıl",
    aciklama:
      "Sayfa görüntüleme istatistikleri. Sadece onay verilirse yüklenir.",
  },
];

export default function CerezPolitikasiPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-rd-neutral-50">
        <div className="max-w-prose mx-auto px-4 sm:px-6 py-12">
          <div className="mb-8">
            <Eyebrow color="neutral" className="mb-3">
              ÇEREZ POLİTİKASI
            </Eyebrow>
            <h1
              className="text-2xl sm:text-3xl font-medium text-rd-neutral-900 mb-1"
              style={{
                fontFamily: "var(--font-rd-display)",
                letterSpacing: "-0.01em",
              }}
            >
              Çerez politikası
            </h1>
            <p className="text-xs text-rd-neutral-500">
              Son güncelleme: Nisan 2026
            </p>
          </div>

          <div className="space-y-8 text-sm text-rd-neutral-700 leading-relaxed">
            <section>
              <h2 className="text-base font-medium text-rd-neutral-900 mb-2">
                Çerez nedir?
              </h2>
              <p>
                Çerezler, tarayıcınıza kaydedilen küçük metin dosyalarıdır.
                Oturumunuzu açık tutmak, tercihlerinizi hatırlamak ve site
                kullanımını analiz etmek için kullanılır.
              </p>
            </section>

            <section>
              <h2 className="text-base font-medium text-rd-neutral-900 mb-3">
                Kullandığımız çerezler
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="bg-rd-neutral-100">
                      {[
                        "Kategori",
                        "Çerez adı",
                        "Kaynak",
                        "Süre",
                        "Açıklama",
                      ].map((h) => (
                        <th
                          key={h}
                          className="border border-rd-neutral-200 px-3 py-2 text-left text-rd-neutral-700"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {CEREZLER.map((c) => (
                      <tr key={c.isim}>
                        <td className="border border-rd-neutral-200 px-3 py-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                              c.kategori === "Zorunlu"
                                ? "bg-rd-primary-50 text-rd-primary-700"
                                : "bg-rd-neutral-100 text-rd-neutral-600"
                            }`}
                          >
                            {c.kategori}
                          </span>
                        </td>
                        <td className="border border-rd-neutral-200 px-3 py-2 font-mono text-rd-neutral-900">
                          {c.isim}
                        </td>
                        <td className="border border-rd-neutral-200 px-3 py-2">
                          {c.kaynak}
                        </td>
                        <td className="border border-rd-neutral-200 px-3 py-2">
                          {c.sure}
                        </td>
                        <td className="border border-rd-neutral-200 px-3 py-2">
                          {c.aciklama}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-base font-medium text-rd-neutral-900 mb-2">
                Tercihlerinizi değiştirme
              </h2>
              <p className="mb-2">
                Sayfanın sol altında çıkan çerez banner&apos;ından veya
                tarayıcı ayarlarından tercihlerinizi değiştirebilirsiniz.
              </p>
              <p>
                Zorunlu çerezler devre dışı bırakılamaz — bunlar olmadan oturum
                açma çalışmaz.
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
              href="/kvkk-aydinlatma"
              className="text-rd-primary-600 hover:text-rd-primary-700"
            >
              KVKK aydınlatma
            </Link>
          </div>
        </div>
        <SiteFooter />
      </main>
    </>
  );
}
