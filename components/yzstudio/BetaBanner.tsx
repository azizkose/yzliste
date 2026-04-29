import { Info } from 'lucide-react'

export default function BetaBanner() {
  return (
    <div className="bg-rd-warm-50 border-b border-rd-warm-200 px-4 py-2.5">
      <div className="max-w-5xl mx-auto flex items-center justify-center gap-2">
        <Info size={14} strokeWidth={1.5} className="text-rd-warm-700 flex-shrink-0" aria-hidden="true" />
        <p className="text-xs md:text-sm text-rd-warm-800">
          yzstudio beta — sonuçlar değişkenlik gösterebilir, beğenmediğin sonucu yeniden üretebilirsin
        </p>
      </div>
    </div>
  )
}
