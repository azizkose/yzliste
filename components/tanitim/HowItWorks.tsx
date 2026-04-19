const ADIMLAR = [
  { no: "1", ikon: "📦", baslik: "Ürünü anlat", aciklama: "Fotoğraf yükle, barkod tara veya elle yaz. YZ ürünü otomatik analiz eder.", renk: "bg-blue-50 text-blue-600" },
  { no: "2", ikon: "🛒", baslik: "Platform seç", aciklama: "Trendyol, Amazon, Etsy... Her platformun kuralları otomatik uygulanır.", renk: "bg-violet-50 text-violet-600" },
  { no: "3", ikon: "✨", baslik: "İçeriğini al", aciklama: "Metin, görsel, video, sosyal medya — hepsi tek seferde, kopyala yapıştır hazır.", renk: "bg-indigo-50 text-indigo-600" },
];

export default function HowItWorks() {
  return (
    <section id="nasil-calisir" className="px-4 sm:px-6 py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">3 adımda hazır</h2>
        <p className="text-center text-sm text-gray-400 mb-10">Metin, görsel, video, sosyal medya — hepsi aynı ürün bilgisinden</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {ADIMLAR.map((adim) => (
            <div key={adim.no} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex gap-4">
              <div className={`w-10 h-10 rounded-xl ${adim.renk} flex items-center justify-center text-xl flex-shrink-0`}>{adim.ikon}</div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${adim.renk}`}>{adim.no}</span>
                  <h3 className="font-semibold text-gray-800 text-sm">{adim.baslik}</h3>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">{adim.aciklama}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
