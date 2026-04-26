'use client'

import { useState } from 'react'
import SectionHeader from '@/components/primitives/SectionHeader'
import { ICERIK_TURLERI } from '@/lib/constants/icerik-turleri'
import type { IcerikTuruId } from '@/lib/constants/icerik-turleri'

export default function IcerikTurleriSection() {
  const [openModal, setOpenModal] = useState<IcerikTuruId | null>(null)

  // openModal kullanımı sonraki ticket'ta (IT-05) gelecek
  void openModal
  void setOpenModal

  return (
    <section className="bg-rd-neutral-50 py-20">
      <div className="mx-auto max-w-[1200px] px-6">
        <SectionHeader
          eyebrow="4 araç, tek platform"
          eyebrowColor="primary"
          title="Tek platformda 4 içerik türü"
          subtitle="Listing metni, ürün görseli, tanıtım videosu ve sosyal medya kit'i — hepsini aynı yerde, aynı krediyle üret."
          align="center"
        />

        {/* Cards Grid — sonraki ticket (IT-03) */}
        <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {ICERIK_TURLERI.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-rd-neutral-200 bg-white p-6 text-center text-sm text-rd-neutral-400"
            >
              [{item.title} kartı — IT-03]
            </div>
          ))}
        </div>

        {/* BottomNote — sonraki ticket (IT-06) */}
        <div className="text-center text-sm text-rd-neutral-400">
          [BottomNote — IT-06]
        </div>

        {/* SampleModal — sonraki ticket (IT-05) */}
      </div>
    </section>
  )
}
