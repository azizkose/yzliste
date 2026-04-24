import Modal from '@/components/modal/Modal'
import Link from 'next/link'
import { PAKET_LISTESI } from '@/lib/paketler'

export default function KrediYukleModal() {
  return (
    <Modal title="Kredi Yükle">
      <div className="space-y-4">
        {PAKET_LISTESI.map((p) => (
          <div key={p.id} className={`border-2 ${p.renk} rounded-2xl p-4 relative`}>
            {p.rozet && (
              <span className="absolute -top-3 left-4 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                En Popüler
              </span>
            )}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-800 text-sm">{p.isim}</p>
                <p className="text-xs text-gray-500">{p.krediStr}</p>
              </div>
              <p className="text-xl font-bold text-gray-900">{p.fiyatStr}</p>
            </div>
          </div>
        ))}
        <Link
          href="/kredi-yukle"
          className="block w-full text-center bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 rounded-xl text-sm transition-colors"
        >
          Satın Al →
        </Link>
        <p className="text-xs text-gray-400 text-center">🔒 Güvenli ödeme — iyzico altyapısı</p>
      </div>
    </Modal>
  )
}
