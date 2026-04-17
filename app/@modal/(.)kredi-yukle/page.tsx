import Modal from '@/components/modal/Modal'
import Link from 'next/link'

const PAKETLER = [
  { id: 'baslangic', isim: 'Başlangıç', fiyat: '₺29', kredi: 10, renk: 'border-gray-200', butonRenk: 'bg-gray-800 hover:bg-gray-900' },
  { id: 'populer', isim: 'Popüler', fiyat: '₺79', kredi: 30, renk: 'border-indigo-400 ring-2 ring-indigo-400', butonRenk: 'bg-indigo-500 hover:bg-indigo-600', rozet: true },
  { id: 'buyuk', isim: 'Büyük', fiyat: '₺149', kredi: 100, renk: 'border-gray-200', butonRenk: 'bg-gray-800 hover:bg-gray-900' },
]

// Modal içinde basit paket listesi + /kredi-yukle tam sayfasına yönlendir
export default function KrediYukleModal() {
  return (
    <Modal title="Kredi Yükle">
      <div className="space-y-4">
        {PAKETLER.map((p) => (
          <div key={p.id} className={`border-2 ${p.renk} rounded-2xl p-4 relative`}>
            {p.rozet && (
              <span className="absolute -top-3 left-4 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                En Popüler
              </span>
            )}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-800 text-sm">{p.isim}</p>
                <p className="text-xs text-gray-500">{p.kredi} kredi</p>
              </div>
              <p className="text-xl font-bold text-gray-900">{p.fiyat}</p>
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
