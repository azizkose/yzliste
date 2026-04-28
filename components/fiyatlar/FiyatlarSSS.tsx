"use client";

import { Mail } from "lucide-react";
import Accordion, { type AccordionItem } from "@/components/primitives/Accordion";

const SSS_ITEMS = [
  {
    soru: "Kredi nedir, nasıl çalışır?",
    cevap:
      "Her içerik üretimi kredi tüketir. Listing metni 1 kredi, görsel 1 kredi (stil başına), sosyal medya 1 kredi, video 10-20 kredi. Kayıt olunca 3 ücretsiz kredi hediye edilir.",
  },
  {
    soru: "Satın aldığım krediler ne zaman sona erer?",
    cevap:
      "Kredilerin sona erme tarihi yoktur. Tüm kullandığın krediler bitene kadar hesabında kalır.",
  },
  {
    soru: "Görsel üretimde kredi nasıl düşer?",
    cevap:
      "Seçtiğin her stil için 1 görsel üretilir ve kredi üretim anında düşer. Birden fazla stil seçersen her biri ayrı kredi harcar. İndirme bedavadır.",
  },
  {
    soru: "Video üretimi kaç kredi tutar?",
    cevap:
      "5 saniyelik video 10 kredi, 10 saniyelik video 20 kredi tüketir. Dikey (9:16 · Reels/TikTok), kare (1:1 · Feed) veya yatay (16:9 · YouTube) format seçebilirsin. Video MP4 formatında indirilir.",
  },
  {
    soru: "Hangi platformlar için listing üretebiliyorum?",
    cevap:
      "Trendyol, Hepsiburada, Amazon TR, N11, Etsy ve Amazon USA. Her platform için başlık uzunlukları, özellik sayısı ve dil kuralları (Türkçe/İngilizce) ayrı ayrı optimize edilmiştir.",
  },
  {
    soru: "Paket satın almak için ne gerekiyor?",
    cevap:
      "Hesap oluşturup fatura bilgilerini (ad soyad + TC kimlik veya vergi numarası) profil sayfandan girmen yeterli. Ödeme iyzico altyapısıyla güvenle yapılır.",
  },
  {
    soru: "İade politikası nedir?",
    cevap:
      "Kullanılmamış krediler için iade talebi oluşturabilirsiniz. Kullanılan krediler iade edilmez. Detaylar için destek@yzliste.com adresine yazabilirsiniz.",
  },
];

const accordionItems: AccordionItem[] = SSS_ITEMS.map((item, i) => ({
  id: `fiyatlar-sss-${i}`,
  trigger: item.soru,
  content: item.cevap,
}));

export default function FiyatlarSSS() {
  return (
    <section
      className="px-4 sm:px-6 py-16 bg-white"
      aria-labelledby="fiyatlar-sss-heading"
    >
      <div className="max-w-3xl mx-auto">
        <p
          className="text-xs font-medium tracking-[0.1em] uppercase text-rd-primary-600 text-center mb-3"
          style={{ fontFamily: "var(--font-rd-display)" }}
        >
          Sık sorulan sorular
        </p>
        <h2
          id="fiyatlar-sss-heading"
          className="text-2xl font-medium text-rd-neutral-900 text-center mb-10"
          style={{
            fontFamily: "var(--font-rd-display)",
            letterSpacing: "-0.01em",
          }}
        >
          Merak ettiklerin
        </h2>

        <Accordion
          items={accordionItems}
          defaultOpen={0}
          idPrefix="fiyatlar-sss"
        />

        <div className="mt-10 flex flex-col items-center gap-3 rounded-lg bg-rd-neutral-50 p-6 text-center sm:flex-row sm:justify-between sm:text-left">
          <div className="flex items-center gap-3">
            <Mail
              className="h-5 w-5 text-rd-neutral-400"
              aria-hidden="true"
            />
            <div>
              <p className="text-sm font-medium text-rd-neutral-700">
                Başka soruların mı var?
              </p>
              <a
                href="mailto:destek@yzliste.com"
                className="text-sm text-rd-primary-600 hover:text-rd-primary-700 transition-colors"
              >
                destek@yzliste.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
