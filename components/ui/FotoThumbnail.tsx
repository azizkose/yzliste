'use client'

import { Check } from 'lucide-react'

interface FotoThumbnailProps {
  src: string
  onKaldir: () => void
  renk?: 'green' | 'red' | 'pink'
}

export default function FotoThumbnail({ src, onKaldir, renk = 'green' }: FotoThumbnailProps) {
  const renkler: Record<string, { bg: string; border: string; text: string }> = {
    green: { bg: 'bg-[#E8F5EE]', border: 'border-[#0F5132]/20', text: 'text-[#0F5132]' },
    red:   { bg: 'bg-[#FEF4E7]', border: 'border-[#8B4513]/20', text: 'text-[#8B4513]' },
    pink:  { bg: 'bg-[#E8F5EE]', border: 'border-[#0F5132]/20', text: 'text-[#0F5132]' },
  }
  const cls = renkler[renk] || renkler.green

  return (
    <div className={`flex items-center gap-3 ${cls.bg} border ${cls.border} rounded-xl p-3`}>
      <img src={src} alt="Ürün" className={`w-12 h-12 object-cover rounded-lg border ${cls.border}`} />
      <div className="flex-1">
        <p className={`text-xs font-medium ${cls.text} flex items-center gap-1`}>
          <Check size={12} strokeWidth={2} /> Fotoğraf hazır
        </p>
      </div>
      <button onClick={onKaldir} className="text-xs text-[#7A1E1E] hover:text-[#5a1616] underline font-medium">
        Kaldır
      </button>
    </div>
  )
}
