import Link from "next/link";

export default function AuthHero() {
  return (
    <section className="relative overflow-hidden aspect-video min-h-[60vh] sm:min-h-0 flex items-center bg-gray-900">
      {/* Mobil: statik poster (performans + doğru oran) */}
      <img
        src="/hero-poster.jpg"
        alt=""
        className="absolute inset-0 w-full h-full object-contain brightness-[0.4] md:hidden"
      />
      {/* Tablet+: video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        poster="/hero-poster.jpg"
        preload="metadata"
        className="absolute inset-0 w-full h-full object-contain brightness-[0.4] hidden md:block"
        src="/hero-video.mp4"
      />
      {/* Header altındaki alanı okunaklı kılan gradyan */}
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/50 to-transparent z-[1]" />

      <div className="relative z-10 w-full flex flex-col items-center justify-center text-center px-6 py-16 sm:py-24 md:py-32">
        <div className="flex gap-2 flex-wrap justify-center mb-4">
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/30 text-indigo-200">
            Trendyol · Hepsiburada · Amazon TR · N11 · Etsy · Amazon USA
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/30 text-emerald-200">
            🆕 Video + Sosyal Medya
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4">
          Fotoğraf yükle,<br />
          <span className="text-indigo-300">pazaryerine hazır içeriğini al</span>
        </h1>

        <p className="text-white/80 text-lg max-w-xl mb-1">
          Listing, görsel, video ve sosyal medya — dakikalar içinde, tüm pazaryerleri için.
        </p>
        <p className="text-white/50 text-sm mb-6">
          Entegrasyon yok, yazılım yok — sadece yükle ve al.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mb-3">
          <Link
            href="/kayit"
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-7 py-3.5 rounded-xl font-semibold text-base transition-colors"
          >
            Ücretsiz Başla — 3 Kredi Hediye →
          </Link>
          <Link
            href="/uret"
            className="border-2 border-white text-white hover:bg-white/10 px-7 py-3.5 rounded-xl font-semibold text-base transition-colors"
          >
            Hemen Dene →
          </Link>
        </div>
        <p className="text-white/40 text-xs">Kredi kartı gerekmez</p>
      </div>
    </section>
  );
}
