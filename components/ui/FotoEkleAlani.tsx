'use client'

interface FotoEkleAlaniProps {
  id: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  renk?: 'gray' | 'purple' | 'red' | 'pink'
  metin?: string
  ikon?: string
  altMetin?: string
}

export default function FotoEkleAlani({
  id,
  onChange,
  renk = 'gray',
  metin = 'Fotoğraf ekle',
  ikon = '📷',
  altMetin,
}: FotoEkleAlaniProps) {
  const sinirRenk: Record<string, string> = {
    gray:   'border-gray-300 hover:border-indigo-400 hover:bg-indigo-50',
    purple: 'border-violet-300 hover:border-violet-400 hover:bg-violet-50',
    red:    'border-amber-200 hover:border-amber-400 hover:bg-amber-50',
    pink:   'border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50',
  }
  const metinRenk: Record<string, string> = {
    gray: 'text-gray-500', purple: 'text-violet-700', red: 'text-amber-600', pink: 'text-emerald-500',
  }
  const altRenk: Record<string, string> = {
    gray: 'text-gray-400', purple: 'text-violet-400', red: 'text-amber-400', pink: 'text-emerald-400',
  }

  return (
    <label
      htmlFor={id}
      className={`block border-2 border-dashed ${sinirRenk[renk]} rounded-xl p-6 text-center cursor-pointer transition-all`}
    >
      <div className="text-3xl mb-2">{ikon}</div>
      <p className={`text-sm font-medium ${metinRenk[renk]}`}>{metin}</p>
      {altMetin && <p className={`text-xs ${altRenk[renk]} mt-1`}>{altMetin}</p>}
      <input type="file" accept="image/*" onChange={onChange} className="hidden" id={id} />
    </label>
  )
}
