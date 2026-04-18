export default function BrandProfile() {
  return (
    <section className="px-4 sm:px-6 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-3xl border border-indigo-100 p-8 sm:p-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="flex-1">
              <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">✨ Yeni özellik</span>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Marka bilgilerini gir,<br />
                <span className="text-indigo-500">sana özel içerikler al</span>
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                Profilinden mağaza adını, hedef kitlenini ve metin tonunu belirle. Bundan sonra her üretimde AI bu bilgileri kullanır — metinler artık senin marka dilinle konuşur.
              </p>
              <div className="space-y-2">
                {[
                  { ikon: "🏪", metin: "Mağaza adın ve marka kimliğin metne yansır" },
                  { ikon: "🎯", metin: "Hedef kitlenin dilinde yazar — '25-40 yaş kadınlar' dedin mi, o kitleye hitap eder" },
                  { ikon: "🎨", metin: "Samimi, profesyonel veya premium — tonunu seç, her üretimde uygular" },
                  { ikon: "💡", metin: "Hızlı kargo, yerli üretim gibi değerlerin her ürüne otomatik eklenir" },
                ].map((m, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm text-gray-600">
                    <span className="flex-shrink-0">{m.ikon}</span>
                    <span>{m.metin}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full sm:w-72 flex-shrink-0">
              <div className="bg-white rounded-2xl shadow-sm border border-indigo-100 p-5 space-y-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Marka Profili</p>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Mağaza adı</p>
                    <div className="bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-2 text-sm text-indigo-700 font-medium">Ayşe Tekstil</div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Metin tonu</p>
                    <div className="flex gap-2">
                      <div className="bg-indigo-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg">Samimi</div>
                      <div className="bg-gray-100 text-gray-500 text-xs px-3 py-1.5 rounded-lg">Profesyonel</div>
                      <div className="bg-gray-100 text-gray-500 text-xs px-3 py-1.5 rounded-lg">Premium</div>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Hedef kitle</p>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600">25-40 yaş kadınlar</div>
                  </div>
                </div>
                <div className="pt-2 border-t border-gray-100">
                  <p className="text-xs text-green-600 font-medium">✓ Her üretimde otomatik uygulanır</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
