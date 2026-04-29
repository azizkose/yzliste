'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'

interface KopyalaButonProps {
  metin: string
  getDuzenlenmisMevin?: () => string
}

export default function KopyalaButon({ metin, getDuzenlenmisMevin }: KopyalaButonProps) {
  const [kopyalandi, setKopyalandi] = useState(false)

  const kopyala = () => {
    const kopyalanacak = getDuzenlenmisMevin ? getDuzenlenmisMevin() : metin
    navigator.clipboard.writeText(kopyalanacak)
    setKopyalandi(true)
    setTimeout(() => setKopyalandi(false), 2000)
  }

  return (
    <button
      onClick={kopyala}
      className={`text-xs font-medium px-3 py-1 rounded-lg transition-all duration-200 ${
        kopyalandi
          ? 'bg-rd-success-50 text-rd-success-700 border border-rd-success-700/20 scale-95'
          : 'bg-rd-neutral-100 text-rd-neutral-400 hover:bg-rd-primary-50 hover:text-rd-primary-800'
      }`}
    >
      {kopyalandi ? (
        <span className="flex items-center gap-1 text-rd-success-700">
          <Check size={12} strokeWidth={2} /> Kopyalandı
        </span>
      ) : (
        'Kopyala'
      )}
    </button>
  )
}
