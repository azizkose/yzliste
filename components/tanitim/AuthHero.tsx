import Link from "next/link";

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
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-white border border-white/20">
            Trendyol · Hepsiburada · Amazon TR · N11 · Etsy · Amazon USA
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-white border border-white/20">
            Metin · Görsel · Video · Sosyal Medya
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-medium text-white leading-tight mb-4">
          E-ticaret içeriğini<br />
          <span className="text-[#BAC9EB]">AI ile üret</span>
        </h1>

        <p className="text-white/80 text-lg max-w-xl mb-8">
          Ürün bilgini gir — listing metni, stüdyo görseli, tanıtım videosu ve sosyal medya içeriğini dakikalar içinde al.
        </p>

        <div className="flex flex-col gap-2 max-w-lg mb-8">
          {[
            "Yazılım kurulumu veya entegrasyon yok — tarayıcıdan kullan",
            "Aylık abonelik yok — sadece kullandığın kadar öde",
            "7 pazaryerinin kurallarını bilir — platforma özel üretir",
            "Prompt yazmana gerek yok — formu doldur, butona bas",
          ].map((t) => (
            <div key={t} className="flex items-center gap-2 text-white/80 text-sm">
              <span className="w-5 h-5 rounded-full bg-white/15 text-white flex items-center justify-center text-xs flex-shrink-0">✓</span>
              {t}
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-3">
          <Link
            href="/kayit"
            className="bg-[#1E4DD8] hover:bg-[#163B9E] text-white px-7 py-3.5 rounded-xl font-medium text-base transition-colors"
          >
            Ücretsiz başla — 3 kredi hediye →
          </Link>
          <a href="/#araclar" className="border-2 border-white text-white hover:bg-white/10 px-7 py-3.5 rounded-xl font-medium text-base transition-colors">
            Araçları incele ↓
          </a>
        </div>
        <p className="text-white/40 text-xs">Kredi kartı gerekmez</p>
      </div>
    </section>
  );
}
