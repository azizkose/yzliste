'use client'

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { Bolum } from "./BolumRenderer"
import type { BlogBolum } from "../icerikler"

const MOBILE_PREVIEW = 3

interface Props {
  icerik: BlogBolum[]
}

export default function BlogIcerikCollapse({ icerik }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <div className="space-y-4">
      {/* İlk MOBILE_PREVIEW bölüm: her zaman görünür */}
      {icerik.slice(0, MOBILE_PREVIEW).map((bolum, i) => (
        <Bolum key={i} bolum={bolum} />
      ))}

      {/* Kalan bölümler: mobile'da open olmadıkça gizli, desktop'ta her zaman görünür */}
      {icerik.length > MOBILE_PREVIEW && (
        <>
          <div className={open ? "block space-y-4" : "hidden lg:block space-y-4"}>
            {icerik.slice(MOBILE_PREVIEW).map((bolum, i) => (
              <Bolum key={MOBILE_PREVIEW + i} bolum={bolum} />
            ))}
          </div>

          {!open && (
            <button
              onClick={() => setOpen(true)}
              className="lg:hidden flex items-center gap-1.5 text-sm text-rd-neutral-500 hover:text-rd-neutral-700 border border-rd-neutral-200 rounded-xl px-4 py-3 w-full justify-center bg-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rd-primary focus-visible:ring-offset-2"
            >
              <ChevronDown size={15} strokeWidth={1.5} aria-hidden="true" />
              Devamını oku ({icerik.length - MOBILE_PREVIEW} bölüm daha)
            </button>
          )}
        </>
      )}
    </div>
  )
}
