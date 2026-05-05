'use client'

import Image from 'next/image'

const LOGOLAR = [
  { src: '/pazaryerleri/trendyol.png', name: 'Trendyol' },
  { src: '/pazaryerleri/hepsiburada.png', name: 'Hepsiburada' },
  { src: '/pazaryerleri/amazon-tr.png', name: 'Amazon TR' },
  { src: '/pazaryerleri/n11.png', name: 'N11' },
  { src: '/pazaryerleri/etsy.png', name: 'Etsy' },
  { src: '/pazaryerleri/amazon-usa.png', name: 'Amazon USA' },
  { src: '/pazaryerleri/ciceksepeti.png', name: 'Çiçeksepeti' },
]

export default function PazaryeriLogoStrip() {
  return (
    <div
      className="relative overflow-hidden border-y border-rd-neutral-200 bg-white py-4 md:py-5"
      aria-label={`Desteklenen pazaryerleri: ${LOGOLAR.map((l) => l.name).join(', ')}`}
    >
      <div
        className="flex animate-marquee whitespace-nowrap motion-reduce:animate-none hover:[animation-play-state:paused]"
        aria-hidden="true"
      >
        {[...LOGOLAR, ...LOGOLAR].map((logo, i) => (
          <div
            key={i}
            className="mx-8 flex shrink-0 items-center justify-center"
            style={{ width: 140, height: 40 }}
          >
            <Image
              src={logo.src}
              alt={logo.name}
              width={140}
              height={40}
              className="object-contain opacity-60 transition-opacity duration-200 hover:opacity-100"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
