'use client'

import { useState } from 'react'

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
          ? 'bg-green-100 text-green-700 border border-green-300 scale-95'
          : 'bg-gray-100 text-gray-500 hover:bg-indigo-50 hover:text-indigo-600'
      }`}
    >
      {kopyalandi ? (
        <span className="flex items-center gap-1 text-green-600">
          <span>✓</span> Kopyalandı
        </span>
      ) : (
        'Kopyala'
      )}
    </button>
  )
}
