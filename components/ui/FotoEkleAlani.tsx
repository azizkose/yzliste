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
    gray:   'border-rd-neutral-200 hover:border-rd-primary-800 hover:bg-rd-primary-100',
    purple: 'border-rd-neutral-200 hover:border-rd-primary-800 hover:bg-rd-primary-100',
    red:    'border-rd-neutral-200 hover:border-rd-primary-800 hover:bg-rd-primary-100',
    pink:   'border-rd-neutral-200 hover:border-rd-primary-800 hover:bg-rd-primary-100',
  }
  const metinRenk: Record<string, string> = {
    gray: 'text-rd-neutral-600', purple: 'text-rd-neutral-600', red: 'text-rd-neutral-600', pink: 'text-rd-neutral-600',
  }
  const altRenk: Record<string, string> = {
    gray: 'text-rd-neutral-400', purple: 'text-rd-neutral-400', red: 'text-rd-neutral-400', pink: 'text-rd-neutral-400',
  }

  return (
    <label
      htmlFor={id}
      className={`block border border-dashed ${sinirRenk[renk]} rounded-xl p-6 text-center cursor-pointer transition-all`}
    >
      <div className="flex justify-center mb-2">
        <Camera size={28} strokeWidth={1.5} className="text-rd-neutral-400" />
      </div>
      <p className={`text-sm font-medium ${metinRenk[renk]}`}>{metin}</p>
      {altMetin && <p className={`text-xs ${altRenk[renk]} mt-1`}>{altMetin}</p>}
      <input type="file" accept="image/*" onChange={onChange} className="hidden" id={id} />
    </label>
  )
}
