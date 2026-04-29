import Image from 'next/image'
import { FileText } from 'lucide-react'

export default function TrustStrip() {
  return (
    <div className="mt-6 mx-auto max-w-md flex flex-wrap items-center justify-center gap-3 text-xs text-rd-neutral-400">
      <span className="flex items-center gap-1.5">
        <Image
          src="/iyzico_footer_logo.png"
          alt="iyzico"
          width={48}
          height={20}
          className="opacity-60"
        />
        <span>Güvenli ödeme</span>
      </span>
      <span className="text-rd-neutral-300">·</span>
      <span className="flex items-center gap-1">
        <FileText size={12} aria-hidden="true" />
        e-Arşiv fatura
      </span>
    </div>
  )
}
