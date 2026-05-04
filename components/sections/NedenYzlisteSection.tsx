'use client'

// NY-02~07 — Neden yzliste Section

import { useState } from "react"
import { X, Check, ChevronDown } from "lucide-react"
import SectionHeader from "@/components/primitives/SectionHeader"
import {
  NEDEN_HEADER,
  NEDEN_COMPARISONS,
  NEDEN_TABLE_HEADERS,
  NEDEN_FOOTNOTE,
} from "@/lib/constants/neden-yzliste"

const MOBILE_VISIBLE = 3

export default function NedenYzlisteSection() {
  const [showAllMobile, setShowAllMobile] = useState(false)

  const visibleRows = showAllMobile
    ? NEDEN_COMPARISONS
    : NEDEN_COMPARISONS.slice(0, MOBILE_VISIBLE)

  return (
    // NY-02: bg-white, section padding
    <section
      className="bg-rd-neutral-50 py-16 md:py-20 lg:py-28"
      aria-label="Neden yzliste"
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">

        {/* NY-02: SectionHeader */}
        <SectionHeader
          eyebrow={NEDEN_HEADER.eyebrow}
          eyebrowColor="primary"
          title={NEDEN_HEADER.title}
          subtitle={NEDEN_HEADER.subtitle}
          maxWidth="700px"
        />

        {/* NY-03~05: Desktop table (md+) */}
        <div className="hidden md:block mt-12 overflow-hidden rounded-xl border border-rd-neutral-200">
          <table
            className="w-full"
            aria-label="yzliste ve genel AI araçları karşılaştırması"
          >
            {/* NY-04: Table headers */}
            <thead>
              <tr>
                <th
                  scope="col"
                  className="w-[28%] bg-white px-4 py-3 text-left text-xs font-medium text-rd-neutral-500 uppercase tracking-wider border-b border-rd-neutral-200"
                >
                  Özellik
                </th>
                <th
                  scope="col"
                  className="w-[36%] bg-rd-neutral-100 px-4 py-3 text-left border-b border-rd-neutral-200"
                >
                  <p className="text-xs font-medium text-rd-neutral-500 uppercase tracking-wider">
                    {NEDEN_TABLE_HEADERS.generic.eyebrow}
                  </p>
                  <p className="text-xs text-rd-neutral-400 mt-0.5">
                    {NEDEN_TABLE_HEADERS.generic.subtitle}
                  </p>
                </th>
                <th
                  scope="col"
                  className="w-[36%] bg-rd-primary-50 px-4 py-3 text-left border-b border-rd-neutral-200"
                >
                  <p className="text-xs font-medium text-rd-primary uppercase tracking-wider">
                    {NEDEN_TABLE_HEADERS.yzliste.eyebrow}
                  </p>
                  <p className="text-xs text-rd-primary-700 mt-0.5">
                    {NEDEN_TABLE_HEADERS.yzliste.subtitle}
                  </p>
                </th>
              </tr>
            </thead>

            {/* NY-05: Comparison rows */}
            <tbody>
              {NEDEN_COMPARISONS.map((row, i) => (
                <tr
                  key={i}
                  className={
                    i < NEDEN_COMPARISONS.length - 1
                      ? "border-b border-rd-neutral-100"
                      : ""
                  }
                >
                  {/* Feature label */}
                  <td className="px-4 py-3 text-sm font-medium text-rd-neutral-900">
                    {row.feature}
                  </td>

                  {/* Generic AI — X */}
                  <td className="bg-rd-neutral-50/50 px-4 py-3">
                    <div className="flex items-start gap-2.5">
                      <span
                        className="mt-0.5 w-5 h-5 rounded-full bg-red-100 flex items-center justify-center shrink-0"
                        aria-hidden="true"
                      >
                        <X size={12} strokeWidth={2.5} className="text-red-500" />
                      </span>
                      <span className="text-sm text-rd-neutral-500">
                        {row.generic}
                      </span>
                    </div>
                  </td>

                  {/* yzliste — Check */}
                  <td className="bg-[#FAFCFF] px-4 py-3">
                    <div className="flex items-start gap-2.5">
                      <span
                        className="mt-0.5 w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0"
                        aria-hidden="true"
                      >
                        <Check size={12} strokeWidth={2.5} className="text-emerald-600" />
                      </span>
                      <span className="text-sm text-rd-neutral-900">
                        {row.yzliste}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* NY-07: Mobile card layout (md altı) */}
        <div className="md:hidden mt-10 space-y-4">
          {visibleRows.map((row, i) => (
            <div
              key={i}
              className="rounded-xl border border-rd-neutral-200 overflow-hidden"
            >
              {/* Feature header */}
              <div className="bg-rd-neutral-50 px-4 py-3 border-b border-rd-neutral-100">
                <p className="text-sm font-medium text-rd-neutral-900">
                  {row.feature}
                </p>
              </div>

              <div className="divide-y divide-rd-neutral-100">
                {/* Generic AI row */}
                <div className="px-4 py-3 flex items-start gap-2.5">
                  <span
                    className="mt-0.5 w-5 h-5 rounded-full bg-red-100 flex items-center justify-center shrink-0"
                    aria-hidden="true"
                  >
                    <X size={12} strokeWidth={2.5} className="text-red-500" />
                  </span>
                  <div>
                    <p className="text-xs text-rd-neutral-400 mb-0.5">
                      Genel AI
                    </p>
                    <p className="text-sm text-rd-neutral-500">{row.generic}</p>
                  </div>
                </div>

                {/* yzliste row */}
                <div className="px-4 py-3 bg-[#FAFCFF] flex items-start gap-2.5">
                  <span
                    className="mt-0.5 w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0"
                    aria-hidden="true"
                  >
                    <Check size={12} strokeWidth={2.5} className="text-emerald-600" />
                  </span>
                  <div>
                    <p className="text-xs text-rd-primary mb-0.5">yzliste</p>
                    <p className="text-sm text-rd-neutral-900">{row.yzliste}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* "Tüm karşılaştırmayı gör" butonu */}
          {!showAllMobile && NEDEN_COMPARISONS.length > MOBILE_VISIBLE && (
            <button
              onClick={() => setShowAllMobile(true)}
              className="w-full flex items-center justify-center gap-1.5 text-sm text-rd-neutral-500 hover:text-rd-neutral-700 border border-rd-neutral-200 rounded-xl py-3 bg-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rd-primary focus-visible:ring-offset-2"
            >
              <ChevronDown size={15} strokeWidth={1.5} aria-hidden="true" />
              Tüm karşılaştırmayı gör ({NEDEN_COMPARISONS.length - MOBILE_VISIBLE} satır daha)
            </button>
          )}
        </div>

        {/* NY-06: Footnote */}
        <p className="mt-8 text-center text-sm text-rd-neutral-500 italic max-w-2xl mx-auto leading-relaxed">
          {NEDEN_FOOTNOTE}
        </p>
      </div>
    </section>
  )
}
