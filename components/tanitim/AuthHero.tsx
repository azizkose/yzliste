import Link from "next/link";

export default function AuthHero() {
  return (
    <section className="px-4 sm:px-6 pt-12 sm:pt-16 pb-12 text-center max-w-3xl mx-auto">
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1.5 rounded-full tracking-wide">Trendyol · Hepsiburada · Amazon TR · N11 · Etsy · Amazon USA</span>
        <span className="inline-block bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-full tracking-wide">🆕 Video + Sosyal Medya</span>
      </div>
      <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-5">
        Ürünün için her içeriği<br />
        <span className="text-indigo-500">tek platformda üret</span>
      </h1>
      <p className="text-base sm:text-lg text-gray-500 mb-6 max-w-2xl mx-auto leading-relaxed">
        Listing metni, stüdyo görseli, ürün videosu, sosyal medya içeriği —<br className="hidden sm:block" />
        <strong className="text-gray-700">fotoğraf yükle ya da barkod tara</strong>, gerisini YZ halleder.
      </p>
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {[
          { ikon: "📝", label: "Listing Metni", sub: "1 kredi" },
          { ikon: "📷", label: "AI Görsel", sub: "1 kredi / stil" },
          { ikon: "🎬", label: "Video", sub: "5–8 kredi" },
          { ikon: "📱", label: "Sosyal Medya", sub: "1 kredi" },
        ].map((f) => (
          <div key={f.label} className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-3 py-1.5 shadow-sm">
            <span className="text-base">{f.ikon}</span>
            <span className="text-xs font-semibold text-gray-700">{f.label}</span>
            <span className="text-[11px] text-gray-400">· {f.sub}</span>
          </div>
        ))}
      </div>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/kayit" className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-8 py-4 rounded-xl text-base transition-colors shadow-lg shadow-indigo-100">
          Ücretsiz Başla — 3 Kredi Hediye →
        </Link>
        <Link href="/uret" className="border-2 border-indigo-500 text-indigo-600 font-semibold px-8 py-4 rounded-xl text-base transition-colors hover:bg-indigo-50">
          Hemen Dene →
        </Link>
      </div>
      <p className="text-xs text-gray-400 mt-4">Kredi kartı gerekmez · Hesap oluşturunca 3 kredi hemen tanımlanır</p>
    </section>
  );
}
