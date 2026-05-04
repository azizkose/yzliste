'use client'

import { useState } from "react"
import { ChevronDown } from "lucide-react"

interface Props {
  preview: React.ReactNode
  rest: React.ReactNode
}

export default function HakkimizdaCollapse({ preview, rest }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <>
      {preview}

      {/* rest: mobile'da gizli (open olmadıkça), desktop'ta her zaman görünür */}
      <div className={open ? "block" : "hidden lg:block"}>
        {rest}
      </div>

      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="lg:hidden flex items-center gap-1.5 text-sm text-rd-neutral-500 hover:text-rd-neutral-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rd-primary focus-visible:ring-offset-2 rounded mt-2 mb-6"
        >
          <ChevronDown size={15} strokeWidth={1.5} aria-hidden="true" />
          Devamını oku
        </button>
      )}
    </>
  )
}
