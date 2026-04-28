import { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import SSSListesi, { type SSSItem } from "./SSSListesi";

export const metadata: Metadata = {
  title: "Sık Sorulan Sorular",
  description:
    "yzliste hakkında en sık sorulan sorular ve cevapları. Krediler, ödeme, iade ve platformlar hakkında her şey.",
  openGraph: { title: "Sık Sorulan Sorular | yzliste" },
  alternates: {
    canonical: "https://www.yzliste.com/sss",
    languages: {
      tr: "https://www.yzliste.com/sss",
      "x-default": "https://www.yzliste.com/sss",
    },
  },
};

const SORULAR: SSSItem[] = [
  {
    s: "Kredi nedir, nasıl çalışır?",
    c: "Her içerik üretimi 1 kredi tüketir. Listing metni (başlık + özellikler + açıklama + etiketler) 1 kredi, görsel üretimi (1 stil = 1 görsel) 1 kredi, video üretimi 5–8 kredi, sosyal medya içeriği 1 kredidir. Kayıt olunca 3 ücretsiz kredi hediye edilir.",
    kategori: "Kredi & Fiyatlama",
  },
  {
    s: "Kredilerim ne zaman expire olur?",
    c: "Satın alınan kredilerin son kullanma tarihi yoktur. Hesabınızda kaldığı sürece geçerlidir.",
    kategori: "Kredi & Fiyatlama",
  },
  {
    s: "İade nasıl yapılır?",
    c: "Kullanılmamış krediler için satın alma tarihinden itibaren 14 gün içinde destek@yzliste.com adresine yazarak iade talep edebilirsiniz. Kullanılmış krediler iade edilemez.",
    kategori: "Kredi & Fiyatlama",
  },
  {
    s: "Hangi pazaryerlerini destekliyorsunuz?",
    c: "Trendyol, Hepsiburada, Amazon TR, N11, Etsy ve Amazon USA için platforma özel format ve dil desteği sunuyoruz. Her platform için başlık uzunlukları, özellik sayısı ve dil kuralları ayrı ayrı optimize edilmiştir.",
    kategori: "Genel",
  },
  {
    s: "Ürünü Trendyol'a nasıl yüklerim?",
    c: "yzliste'de ürettiğiniz metni kopyalayarak Trendyol Satıcı Paneli'ndeki ürün ekleme formuna yapıştırabilirsiniz. Her bölüm (başlık, özellikler, açıklama) ayrı kutuda verilir; tek tıkla kopyalanır.",
    kategori: "Üretim",
  },
  {
    s: "Fotoğraf olmadan kullanabilir miyim?",
    c: "Evet. Ürün adı ve birkaç özellik yazarak metin üretebilirsiniz. Ancak fotoğraf yüklerseniz AI ürünü otomatik analiz eder ve daha doğru içerik üretir.",
    kategori: "Üretim",
  },
  {
    s: "Görsel üretiminde kredi ne zaman düşer?",
    c: "Seçtiğin her stil için 1 görsel üretilir ve kredi üretim anında düşer. Birden fazla stil seçebilirsin — her biri ayrı 1 kredi. İndirme bedavadır.",
    kategori: "Üretim",
  },
  {
    s: "Abonelik var mı?",
    c: "Hayır. yzliste tamamen kullandığın kadar öde modeli ile çalışır. Aylık abonelik yoktur. 29₺'den başlayan kredi paketleri mevcuttur.",
    kategori: "Kredi & Fiyatlama",
  },
  {
    s: "Verilerimi güvende mi?",
    c: "Evet. Tüm veriler Supabase altyapısında şifrelenmiş olarak saklanır. Ürün bilgileri ve üretilen içerikler sadece size aittir; üçüncü taraflarla paylaşılmaz.",
    kategori: "Teknik",
  },
  {
    s: "Teknik destek nasıl alırım?",
    c: "destek@yzliste.com adresine e-posta gönderebilir veya sitedeki sohbet widgetını kullanabilirsiniz. Yanıt süremiz 24 saattir.",
    kategori: "KVKK & Hesap",
  },
];

function FaqJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: SORULAR.map((item) => ({
            "@type": "Question",
            name: item.s,
            acceptedAnswer: { "@type": "Answer", text: item.c },
          })),
        }),
      }}
    />
  );
}

export default function SSSPage() {
  return (
    <main className="min-h-screen bg-rd-neutral-50">
      <FaqJsonLd />
      <SiteHeader />

      <section
        className="px-4 sm:px-6 pt-14 pb-8 max-w-3xl mx-auto text-center"
        aria-labelledby="sss-baslik"
      >
        <Eyebrow color="primary" className="mb-3 justify-center">
          SSS
        </Eyebrow>
        <h1
          id="sss-baslik"
          className="text-3xl sm:text-4xl font-medium text-rd-neutral-900 mb-3"
          style={{
            fontFamily: "var(--font-rd-display)",
            letterSpacing: "-0.01em",
          }}
        >
          Sıkça sorulanlar
        </h1>
        <p className="text-sm text-rd-neutral-500">
          Cevabını bulamazsan{" "}
          <a
            href="mailto:destek@yzliste.com"
            className="text-rd-primary-600 hover:text-rd-primary-700 underline underline-offset-2"
          >
            destek@yzliste.com
          </a>
          &apos;a yaz.
        </p>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-16">
        <SSSListesi sorular={SORULAR} />
      </div>

      <SiteFooter />
    </main>
  );
}
