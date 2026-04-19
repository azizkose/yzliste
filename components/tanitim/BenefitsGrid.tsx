import Link from "next/link";

const OZELLIKLER = [
  { ikon: "🧠", baslik: "Genel amaçlı AI değil, pazaryeri uzmanı AI", aciklama: "Genel amaçlı AI araçları her pazaryerinin karakter limiti, yasaklı kelime listesi ve kategori yapısını bilmez. yzliste; Trendyol, Hepsiburada, Amazon TR, N11, Etsy ve Amazon USA'nın güncel kurallarına göre üretir." },
  { ikon: "📦", baslik: "Metin, görsel, video, sosyal medya — tek fotoğraftan", aciklama: "Ayrı ayrı araçlarla uğraşma. Bir ürün fotoğrafı yükle, 4 içerik türünü tek platformdan üret." },
  { ikon: "🎯", baslik: "Senin markanı, senin dilini konuşur", aciklama: "Mağaza adını, hedef kitlenin yaşını, metin tonunu bir kere gir — her üretimde otomatik uygulanır." },
  { ikon: "💰", baslik: "Abonelik yok, teknik bilgi gerekmiyor", aciklama: "Aylık ödeme yok, API entegrasyonu yok, prompt mühendisliği yok. Formu doldur, butona bas — içeriğin hazır." },
];

export default function BenefitsGrid() {
  return (
    <>
      <section className="px-4 sm:px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-3">Neden yzliste?</h2>
          <p className="text-center text-sm text-gray-400 mb-10">Genel amaçlı AI araçlarından farkımız</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {OZELLIKLER.map((o, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="text-2xl mb-3">{o.ikon}</div>
                <h3 className="font-semibold text-gray-800 text-sm mb-1">{o.baslik}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{o.aciklama}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 py-12 bg-indigo-50 border-y border-indigo-100 text-center">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Hemen dene</h2>
        <p className="text-sm text-gray-500 mb-6">3 ücretsiz kredi ile listing metni, görsel veya video üret. Kredi kartı gerekmez.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/kayit" className="inline-block bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-8 py-4 rounded-xl text-base transition-colors shadow-lg shadow-indigo-100">
            Ücretsiz Hesap Oluştur →
          </Link>
          <Link href="/uret" className="inline-block border-2 border-indigo-500 text-indigo-600 font-semibold px-8 py-4 rounded-xl text-base transition-colors hover:bg-indigo-50">
            Hemen Dene →
          </Link>
        </div>
      </section>
    </>
  );
}
