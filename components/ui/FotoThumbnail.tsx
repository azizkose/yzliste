'use client'

interface FotoThumbnailProps {
  src: string
  onKaldir: () => void
  renk?: 'green' | 'red' | 'pink'
}

export default function FotoThumbnail({ src, onKaldir, renk = 'green' }: FotoThumbnailProps) {
  const renkler: Record<string, string> = {
    green: 'bg-green-50 border-green-200 text-green-700 text-green-500',
    red:   'bg-amber-50 border-amber-200 text-amber-700 text-amber-400',
    pink:  'bg-emerald-50 border-emerald-200 text-emerald-700 text-emerald-400',
  }
  const cls = renkler[renk] || renkler.green
  const parts = cls.split(' ')

  return (
    <div className={`flex items-center gap-3 ${parts[0]} border ${parts[1]} rounded-xl p-3`}>
      <img src={src} alt="Ürün" className={`w-12 h-12 object-cover rounded-lg border ${parts[1]}`} />
      <div className="flex-1">
        <p className={`text-xs font-medium ${parts[2]}`}>✓ Fotoğraf hazır</p>
      </div>
      <button onClick={onKaldir} className="text-xs text-red-400 hover:text-red-600 underline font-medium">
        Kaldır
      </button>
    </div>
  )
}
