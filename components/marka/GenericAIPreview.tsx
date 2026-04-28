import { AlertCircle } from 'lucide-react'

const GENERIC_LISTING =
  'Porselen kahve fincanı seti, 6\'lı, beyaz. Isıya dayanıklı malzeme. Dishwasher safe. Ölçüler: 8x9 cm, 250ml.'

const GENERIC_SOSYAL =
  'Kahve fincanı seti. 6\'lı, porselen. Fiyat için DM.'

export default function GenericAIPreview() {
  return (
    <div className="rounded-xl border border-rd-neutral-300 bg-rd-neutral-50 p-5 opacity-90">
      <div className="flex items-center gap-1.5 mb-4">
        <AlertCircle size={14} className="text-rd-neutral-400" />
        <span className="text-[10px] uppercase tracking-[0.15em] font-medium text-rd-neutral-500">Marka olmadan</span>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.12em] text-rd-neutral-400 mb-1.5">Listing metni</p>
          <p className="text-sm text-rd-neutral-600 leading-relaxed">{GENERIC_LISTING}</p>
        </div>

        <div className="border-t border-rd-neutral-200 pt-4">
          <p className="text-[10px] uppercase tracking-[0.12em] text-rd-neutral-400 mb-1.5">Sosyal medya</p>
          <p className="text-sm text-rd-neutral-600 leading-relaxed">{GENERIC_SOSYAL}</p>
        </div>
      </div>
    </div>
  )
}
