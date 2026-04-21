import Link from "next/link";

const KARTLAR = [
  {
    ikon: "📝",
    baslik: "Listing Metni",
    aciklama: "Platforma özel başlık, açıklama, etiket",
    href: "/uret?tab=metin",
  },
  {
    ikon: "📷",
    baslik: "Stüdyo Görseli",
    aciklama: "7 farklı stüdyo stili",
    href: "/uret?tab=gorsel",
  },
  {
    ikon: "🎬",
    baslik: "Ürün Videosu",
    aciklama: "5sn veya 10sn tanıtım klibi",
    href: "/uret?tab=video",
  },
  {
    ikon: "📱",
    baslik: "Sosyal Medya",
    aciklama: "Instagram, TikTok, Facebook, X",
    href: "/uret?tab=sosyal",
  },
];

export default function AuthHero() {
  return (
    <section className="relative overflow-hidden min-h-[60vh] md:min-h-0 md:aspect-video flex items-center bg-gray-900">
      {/* Mobil: statik poster */}
      <img
        src="/hero-poster.jpg"
        alt=""
        className="absolute inset-0 w-full h-full object-cover brightness-[0.4] md:hidden"
      />
      {/* Tablet+: video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        poster="/hero-poster.jpg"
        preload="metadata"
        className="absolute inset-0 w-full h-full object-cover brightness-[0.4] hidden md:block"
        src="/hero-video-full.mp4"
      />
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
          E-ticaret içeriğini<br />
          <span className="text-indigo-300">AI ile üret</span>
        </h1>

        <p className="text-white/80 text-lg max-w-xl mb-8">
          Ürün bilgini gir — listing metni, stüdyo görseli, tanıtım videosu ve sosyal medya içeriğini dakikalar içinde al.
        </p>

        {/* Aksiyon kartları */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-2xl mb-8">
          {KARTLAR.map((k) => (
            <Link
              key={k.href}
              href={k.href}
              className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl px-4 py-4 text-left transition-colors group"
            >
              <div className="text-2xl mb-2">{k.ikon}</div>
              <div className="text-white font-semibold text-sm mb-1">{k.baslik}</div>
              <div className="text-white/60 text-xs leading-relaxed">{k.aciklama}</div>
            </Link>
          ))}
        </div>

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
