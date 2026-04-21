interface FeatureCardsProps {
  minFiyat: number;
  onSatinAlClick: () => void;
}

export default function FeatureCards({ minFiyat, onSatinAlClick }: FeatureCardsProps) {
  return (
    <section className="px-4 sm:px-6 py-8 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Ne üretebilirsin?</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
            <div className="bg-blue-50 px-5 pt-6 pb-4">
              <div className="text-2xl mb-2">📝</div>
              <h3 className="font-bold text-gray-800">Listing Metni</h3>
              <p className="text-xs text-gray-500 mt-1">1 kredi / ürün</p>
            </div>
            <div className="p-5 flex-1">
              <p className="text-sm text-gray-600 leading-relaxed mb-3">Platforma özel optimize başlık, madde madde özellikler, satışa dönen açıklama ve arama etiketleri.</p>
              <ul className="space-y-1.5">
                {["Manuel metin girişi", "Fotoğraftan otomatik analiz", "Barkod ile ürün tanıma"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px]">✓</span>{f}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
            <div className="bg-violet-50 px-5 pt-6 pb-4">
              <div className="text-2xl mb-2">📷</div>
              <h3 className="font-bold text-gray-800">Stüdyo Görseli</h3>
              <p className="text-xs text-gray-500 mt-1">Stil başına 1 kredi</p>
            </div>
            <div className="p-5 flex-1">
              <p className="text-sm text-gray-600 leading-relaxed mb-3">Tek fotoğraftan 7 farklı stüdyo stili. 1 stil = 1 görsel = 1 kredi.</p>
              <div className="grid grid-cols-3 gap-1.5 mb-3">
                {[{ src: "/ornek_beyaz.jpg", label: "Beyaz" }, { src: "/ornek_koyu.jpg", label: "Koyu" }, { src: "/ornek_lifestyle.jpg", label: "Lifestyle" }].map((s) => (
                  <div key={s.label} className="rounded-lg overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.src} alt={s.label} className="w-full aspect-square object-cover rounded-lg" />
                    <p className="text-[9px] text-center text-gray-500 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400">+ Mermer, Ahşap, Gradient, Doğal</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
            <div className="bg-amber-50 px-5 pt-6 pb-4">
              <div className="text-2xl mb-2">🎬</div>
              <h3 className="font-bold text-gray-800">Ürün Videosu</h3>
              <p className="text-xs text-gray-500 mt-1">5sn: 10 kredi · 10sn: 20 kredi</p>
            </div>
            <div className="p-5 flex-1">
              <p className="text-sm text-gray-600 leading-relaxed mb-3">Ürün fotoğrafından profesyonel tanıtım videosu. Reels, TikTok ve pazaryeri için hazır.</p>
              <ul className="space-y-1.5">
                {["Dikey (9:16) · Reels / TikTok", "Kare (1:1) · Feed / Pazaryeri", "Yatay (16:9) · YouTube"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-[10px]">✓</span>{f}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
            <div className="bg-emerald-50 px-5 pt-6 pb-4">
              <div className="text-2xl mb-2">📱</div>
              <h3 className="font-bold text-gray-800">Sosyal Medya</h3>
              <p className="text-xs text-gray-500 mt-1">1 kredi / platform seti</p>
            </div>
            <div className="p-5 flex-1">
              <p className="text-sm text-gray-600 leading-relaxed mb-3">Her platform için ayrı caption ve hashtag seti. Ürün fotoğrafından veya metinden üretilir.</p>
              <ul className="space-y-1.5">
                {["Instagram · Caption + Hashtag", "TikTok · Kısa açıklama", "Facebook · Paylaşım metni", "Twitter/X · Tweet metni"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px]">✓</span>{f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={onSatinAlClick}
            className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold px-10 py-4 rounded-2xl text-base transition-colors shadow-lg shadow-indigo-100"
          >
            Paket Satın Al — {minFiyat}₺&apos;den başlıyor
          </button>
          <p className="text-xs text-gray-400 mt-3">veya 3 ücretsiz kredi ile başla, kredi kartı gerekmez</p>
        </div>
      </div>
    </section>
  );
}
