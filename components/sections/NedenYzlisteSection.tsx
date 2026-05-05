import SectionHeader from "@/components/primitives/SectionHeader"
import { NEDEN_HEADER } from "@/lib/constants/neden-yzliste"

const NEDEN_KARTLAR = [
  {
    title: "7 pazaryerinin format kuralları",
    body: "Trendyol 100 karakter, Amazon 200, N11 65, Etsy 13 tag — her biri için ayrı prompt'lar. Genel AI bunu bilmez.",
  },
  {
    title: "Türkçe ve e-ticaret odaklı",
    body: "Pazaryerinin yasaklı kelime listesi, Türkçe SEO ve karakter sayısı kontrolü hazır. Genel AI'da bu sürekli prompt yazmak demek.",
  },
  {
    title: "Stüdyo görseli + video tek araçta",
    body: "Listing yazısı yazan AI'lar görsel üretmez, görsel AI'lar ürünü tanımaz. yzliste fotoğraftan başlık + görsel + video üretir.",
  },
]

export default function NedenYzlisteSection() {
  return (
    <section
      className="bg-rd-neutral-50 py-12 md:py-16"
      aria-label="Neden yzliste"
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <SectionHeader
          eyebrow={NEDEN_HEADER.eyebrow}
          eyebrowColor="primary"
          title={NEDEN_HEADER.title}
          maxWidth="600px"
        />

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {NEDEN_KARTLAR.map((kart) => (
            <div
              key={kart.title}
              className="rounded-xl border border-rd-neutral-200 bg-white p-6"
            >
              <h3 className="font-rd-display text-lg text-rd-neutral-900 mb-2">
                {kart.title}
              </h3>
              <p className="text-sm text-rd-neutral-600 leading-relaxed">
                {kart.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
