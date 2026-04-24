'use client'

import { Camera } from 'lucide-react'

interface FotoEkleAlaniProps {
  id: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  renk?: 'gray' | 'purple' | 'red' | 'pink'
  metin?: string
  altMetin?: string
}

export default function FotoEkleAlani({
  id,
  onChange,
  renk = 'gray',
  metin = 'Fotoğraf ekle',
  altMetin,
}: FotoEkleAlaniProps) {
  // Tüm varyantlar aynı design system renklerini kullanır
  const sinirRenk: Record<string, string> = {
    gray:   'border-[#D8D6CE] hover:border-[#1E4DD8] hover:bg-[#EBF1FB]',
    purple: 'border-[#D8D6CE] hover:border-[#1E4DD8] hover:bg-[#EBF1FB]',
    red:    'border-[#D8D6CE] hover:border-[#1E4DD8] hover:bg-[#EBF1FB]',
    pink:   'border-[#D8D6CE] hover:border-[#1E4DD8] hover:bg-[#EBF1FB]',
  }
  const metinRenk: Record<string, string> = {
    gray: 'text-[#5A5852]', purple: 'text-[#5A5852]', red: 'text-[#5A5852]', pink: 'text-[#5A5852]',
  }
  const altRenk: Record<string, string> = {
    gray: 'text-[#908E86]', purple: 'text-[#908E86]', red: 'text-[#908E86]', pink: 'text-[#908E86]',
  }

  return (
    <label
      htmlFor={id}
      className={`block border border-dashed ${sinirRenk[renk]} rounded-xl p-6 text-center cursor-pointer transition-all`}
    >
      <div className="flex justify-center mb-2">
        <Camera size={28} strokeWidth={1.5} className="text-[#908E86]" />
      </div>
      <p className={`text-sm font-medium ${metinRenk[renk]}`}>{metin}</p>
      {altMetin && <p className={`text-xs ${altRenk[renk]} mt-1`}>{altMetin}</p>}
      <input type="file" accept="image/*" onChange={onChange} className="hidden" id={id} />
    </label>
  )
}
