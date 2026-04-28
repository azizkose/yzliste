import Link from 'next/link'
import { Check, ShieldCheck } from 'lucide-react'
import Modal from '@/components/modal/Modal'
import { PAKET_LISTESI } from '@/lib/paketler'

export default function KrediYukleModal() {
  return (
    <Modal title="Kredi yükle">
      <div className="space-y-4">
        <div className="grid gap-3">
          {PAKET_LISTESI.map((p) => (
            <div
              key={p.id}
              className={[
                'relative rounded-xl border p-4',
                p.rozet
                  ? 'border-2 border-rd-primary-500 bg-rd-primary-50/30'
                  : 'border-rd-neutral-200 bg-white',
              ].join(' ')}
            >
              {p.rozet && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 inline-flex items-center rounded-full bg-rd-primary-600 px-3 py-0.5 text-[10px] font-medium text-white tracking-wide">
                  En popüler
                </span>
              )}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-rd-neutral-900"
                     style={{ fontFamily: 'var(--font-rd-display)' }}>
                    {p.isim}
                  </p>
                  <p className="text-xs text-rd-neutral-500 mt-0.5">{p.krediStr}</p>
                </div>
                <p className="text-xl font-bold text-rd-neutral-900 tabular-nums"
                   style={{ fontFamily: 'var(--font-rd-display)' }}>
                  {p.fiyatStr}
                </p>
              </div>
              <ul className="mt-3 space-y-1">
                {p.ozellikler.slice(0, 2).map((o, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-xs text-rd-neutral-500">
                    <Check size={11} strokeWidth={2} className="text-rd-success-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                    {o}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Link
          href="/kredi-yukle"
          className="block w-full text-center bg-rd-primary-600 hover:bg-rd-primary-700 text-white font-medium py-3 rounded-lg text-sm transition-colors"
        >
          Paketi seç ve satın al
        </Link>

        <p className="flex items-center justify-center gap-1.5 text-xs text-rd-neutral-400">
          <ShieldCheck size={12} strokeWidth={1.5} aria-hidden="true" />
          Güvenli ödeme — iyzico altyapısı
        </p>
      </div>
    </Modal>
  )
}
