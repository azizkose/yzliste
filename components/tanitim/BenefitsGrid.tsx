import Link from "next/link";

const OZELLIKLER = [
  { ikon: "🧠", baslik: "Pazaryerini bilen AI", aciklama: "Genel AI araçları pazaryeri kurallarını bilmez. yzliste her platformun karakter limiti, yasak kelime ve SEO kuralına göre üretir." },
  { ikon: "📸", baslik: "Fotoğraf yükle, gerisini bırak", aciklama: "Ürün fotoğrafını yükle — AI ürünü tanır, kategori belirler, listing metnini ve görseli otomatik üretir." },
  { ikon: "📦", baslik: "Barkod tara, klavyeye dokunma", aciklama: "Barkodu tarat, ürün bilgilerini veritabanından çek, listing üret — tek tıkla." },
  { ikon: "🎯", baslik: "6 platform, 6 farklı format", aciklama: "Trendyol, Hepsiburada, Amazon TR, N11, Etsy, Amazon USA — her birinin kuralına göre ayrı çıktı." },
  { ikon: "💎", baslik: "Şeffaf kredi sistemi", aciklama: "Kredi üretimde düşer, indirme bedava. Ne kadar harcadığını her zaman görürsün." },
  { ikon: "💰", baslik: "Kullandığın kadar öde", aciklama: "Aylık abonelik yok. 3 ücretsiz kredi ile başla, istediğin zaman paket al." },
];

export default function BenefitsGrid() {
  return (
    <>
      <section className="px-4 sm:px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-3">Neden yzliste?</h2>
          <p className="text-center text-sm text-gray-400 mb-10">ChatGPT&apos;ye &quot;listing yaz&quot; demekten farkımız</p>
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
