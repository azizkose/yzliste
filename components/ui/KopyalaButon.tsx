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
          ? 'bg-[#E8F5EE] text-[#0F5132] border border-[#0F5132]/20 scale-95'
          : 'bg-[#F1F0EB] text-[#908E86] hover:bg-[#F0F4FB] hover:text-[#1E4DD8]'
      }`}
    >
      {kopyalandi ? (
        <span className="flex items-center gap-1 text-[#0F5132]">
          <Check size={12} strokeWidth={2} /> Kopyalandı
        </span>
      ) : (
        'Kopyala'
      )}
    </button>
  )
}
