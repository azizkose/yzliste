'use client'

import { useState } from 'react'
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

function LogoItem({ src, name }: { src: string; name: string }) {
  const [hata, setHata] = useState(false)

  if (hata) {
    return (
      <span className="text-sm font-medium text-rd-neutral-400 whitespace-nowrap px-1">
        {name}
      </span>
    )
  }

  return (
    <Image
      src={src}
      alt={name}
      width={120}
      height={36}
      className="object-contain opacity-60 hover:opacity-100 transition-opacity duration-200"
      onError={() => setHata(true)}
    />
  )
}

export default function PazaryeriLogoStrip() {
  return (
    <div
      className="relative overflow-hidden border-y border-rd-neutral-200 bg-white py-4 md:py-5"
      aria-label={`Desteklenen pazaryerleri: ${LOGOLAR.map((l) => l.name).join(', ')}`}
    >
      <div
        className="flex items-center animate-marquee motion-reduce:animate-none hover:[animation-play-state:paused]"
        aria-hidden="true"
      >
        {[...LOGOLAR, ...LOGOLAR].map((logo, i) => (
          <div
            key={i}
            className="mx-8 flex shrink-0 items-center justify-center"
            style={{ minWidth: 120, height: 36 }}
          >
            <LogoItem src={logo.src} name={logo.name} />
          </div>
        ))}
      </div>
    </div>
  )
}
