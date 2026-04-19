"use client";
import { useState } from "react";

const ornekBolumler = [
  {
    ikon: "📌",
    baslik: "Başlık",
    icerik: "Kütahya Porselen Çiçek Desenli Kahve Fincanı 6'lı Set | 80ml | Altın Yaldızlı | Dishwasher Safe",
    renk: "border-l-blue-400",
  },
  {
    ikon: "🔹",
    baslik: "Özellikler",
    icerik: `• 🏆 Birinci Kalite Porselen — Kurşunsuz, gıda güvenli materyal; zarif sunum sağlar.
• ☕ 80ml Espresso Hacmi — Türk kahvesi, espresso ve menengiç kahvesi için ideal boyut.
• 🌸 El Yapımı Çiçek Deseni + Altın Yaldız — Benzersiz baskı, özel gün hediyesi için ideal.
• 🎁 6 Kişilik Komple Set — Fincan ve tabaklar dahil, özel hediye kutusunda teslim.
• ✅ Bulaşık Makinesine Uyumlu — Yaldızlar bozulmadan yıkanabilir.`,
    renk: "border-l-blue-400",
  },
  {
    ikon: "📄",
    baslik: "Açıklama",
    icerik: "Kütahya'nın 500 yıllık porselen geleneğinden ilham alarak tasarlanan bu fincan seti, hem estetik hem işlevselliği bir arada sunar. Düğün, nişan ve doğum günü hediyesi olarak tercih edilen bu set, sevdiklerinize kalıcı bir değer sunmak isteyenler için biçilmiş kaftandır.",
    renk: "border-l-green-400",
  },
  {
    ikon: "🏷️",
    baslik: "Arama Etiketleri",
    icerik: "porselen fincan seti, kahve fincanı hediye, kütahya porselen, altın yaldızlı fincan, 6lı fincan seti, türk kahvesi fincanı, düğün hediyesi fincan, çeyiz fincan seti",
    renk: "border-l-violet-400",
  },
];

const KUTULAR = [
  { idx: 0, ikon: "📝", baslik: "Listing Metni", aciklama: "Başlık, özellikler, açıklama, etiketler", kredi: "1 kredi", ring: "ring-blue-400", bg: "bg-blue-50", badge: "text-blue-600 bg-blue-100" },
  { idx: 1, ikon: "📷", baslik: "Görsel", aciklama: "7 stil, stil başına 1 görsel", kredi: "Stil başına 1 kredi", ring: "ring-violet-400", bg: "bg-violet-50", badge: "text-violet-600 bg-violet-100" },
  { idx: 2, ikon: "🎬", baslik: "Video", aciklama: "Ürün tanıtım videosu, 1080p", kredi: "5sn veya 10sn", ring: "ring-amber-400", bg: "bg-amber-50", badge: "text-amber-600 bg-amber-100" },
  { idx: 3, ikon: "📱", baslik: "Sosyal Medya", aciklama: "Caption + hashtag, tüm platformlar", kredi: "1 kredi / platform · Kit: 3 kredi", ring: "ring-emerald-400", bg: "bg-emerald-50", badge: "text-emerald-600 bg-emerald-100" },
];

export default function FeaturesTabbed() {
  const [ozellikTab, setOzellikTab] = useState(0);

  return (
    <section className="px-4 sm:px-6 py-16 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Tek platformda 4 içerik türü</h2>
        <p className="text-center text-sm text-gray-400 mb-8">İhtiyacın olanı seç — örnek çıktıyı hemen gör</p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {KUTULAR.map((k) => (
            <button
              key={k.idx}
              type="button"
              onClick={() => setOzellikTab(k.idx)}
              className={`text-left rounded-2xl border-2 overflow-hidden transition-all shadow-sm hover:shadow-md ${
                ozellikTab === k.idx ? `border-transparent ring-2 ${k.ring} ${k.bg}` : "border-gray-100 bg-white hover:border-gray-200"
              }`}
            >
              <div className="px-4 pt-5 pb-4">
                <div className="text-2xl mb-2">{k.ikon}</div>
                <p className="font-bold text-gray-800 text-sm">{k.baslik}</p>
                <p className="text-xs text-gray-400 mt-1 leading-snug">{k.aciklama}</p>
                <span className={`inline-block mt-2 text-[11px] font-semibold px-2 py-0.5 rounded-full ${k.badge}`}>{k.kredi}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {ozellikTab === 0 && (
            <div className="p-5 sm:p-7">
              <div className="flex items-center gap-2 mb-5">
                <span className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
                <span className="text-xs font-semibold text-blue-700">Trendyol formatında örnek çıktı</span>
              </div>
              <div className="space-y-3">
                {ornekBolumler.map((bolum, i) => (
                  <div key={i} className={`rounded-xl border-l-4 ${bolum.renk} border border-gray-100 bg-gray-50 p-4`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-700">{bolum.ikon} {bolum.baslik}</span>
                      <span className="text-xs bg-white border border-gray-200 text-gray-400 px-2 py-0.5 rounded-lg">Kopyala</span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{bolum.icerik}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 pt-4 border-t border-gray-100 flex flex-wrap gap-3 text-xs text-gray-500">
                {["Manuel metin girişi", "Fotoğraftan otomatik analiz", "Barkod ile ürün tanıma", "6 platform desteği"].map((f) => (
                  <span key={f} className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[9px]">✓</span>{f}
                  </span>
                ))}
              </div>
            </div>
          )}

          {ozellikTab === 1 && (
            <div className="p-5 sm:p-7">
              <p className="text-sm font-semibold text-gray-700 mb-1">Tek fotoğraftan 7 farklı stüdyo stili</p>
              <p className="text-xs text-gray-400 mb-5">Stil başına 1 kredi · Üretimde düşer, indirme bedava</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="flex flex-col">
                  <div className="relative rounded-xl overflow-hidden border-2 border-gray-200 bg-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/ornek_once.jpg" alt="önce" className="w-full aspect-square object-contain" />
                    <div className="absolute top-2 left-2"><span className="bg-gray-800/80 text-white text-[10px] px-2 py-1 rounded-full">Ham fotoğraf</span></div>
                  </div>
                  <div className="bg-red-50 rounded-lg p-2 border border-red-100 mt-2">
                    <p className="text-[11px] text-red-600 font-medium">✗ Dağınık arka plan</p>
                  </div>
                </div>
                {[
                  { src: "/ornek_beyaz.jpg", etiket: "⬜ Beyaz Zemin" },
                  { src: "/ornek_koyu.jpg", etiket: "⬛ Koyu Zemin" },
                  { src: "/ornek_lifestyle.jpg", etiket: "🏠 Lifestyle" },
                ].map((item) => (
                  <div key={item.etiket} className="flex flex-col">
                    <div className="rounded-xl overflow-hidden border-2 border-violet-200 bg-gray-50">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.src} alt={item.etiket} className="w-full aspect-square object-contain" />
                    </div>
                    <p className="text-[11px] text-gray-700 font-semibold text-center mt-1.5">{item.etiket}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
                {[
                  { src: "/ornek_mermer.jpg", etiket: "🪨 Mermer" },
                  { src: "/ornek_ahsap.jpg", etiket: "🪵 Ahşap" },
                  { src: "/ornek_gradient.jpg", etiket: "🎨 Gradient" },
                  { src: "/ornek_dogal.jpg", etiket: "🌿 Doğal" },
                ].map((item) => (
                  <div key={item.etiket} className="flex flex-col">
                    <div className="rounded-xl overflow-hidden border-2 border-violet-200 bg-gray-50">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.src} alt={item.etiket} className="w-full aspect-square object-contain" />
                    </div>
                    <p className="text-[11px] text-gray-700 font-semibold text-center mt-1.5">{item.etiket}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500 font-medium mb-2">3 farklı yöntemle sahne oluştur:</p>
                <div className="flex flex-wrap gap-2">
                  {["Hazır stiller (Beyaz, Koyu…)", "Kendi promptunu yaz", "Arka plan fotoğrafı ver"].map((t, i) => (
                    <span key={i} className="text-xs bg-violet-50 text-violet-700 px-3 py-1 rounded-full border border-violet-100">{i + 1}. {t}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {ozellikTab === 2 && (
            <div className="p-5 sm:p-7">
              <p className="text-sm font-semibold text-gray-700 mb-1">Ürün fotoğrafından tanıtım videosu</p>
              <p className="text-xs text-gray-400 mb-5">Ürünü hareket ettiren, platform uyumlu dikey/kare video — MP4 olarak indir</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                {[
                  { src: "/video-ornekler/360-donus.mp4", ikon: "🔄", baslik: "360° Dönüş", aciklama: "Ürün kendi ekseni etrafında döner. Tüm açılar görünür. Takı, aksesuar, elektronik için ideal." },
                  { src: "/video-ornekler/zoom-yaklasim.mp4", ikon: "🔍", baslik: "Zoom Yaklaşım", aciklama: "Kamera ürüne doğru yaklaşır. Doku ve detay hissi. El yapımı ve tekstil ürünler için güçlü." },
                  { src: "/video-ornekler/dramatik-isik.mp4", ikon: "💡", baslik: "Dramatik Işık", aciklama: "Karanlık sahnede spotlight açılır. Premium ve lüks his. Kozmetik ve elektronik için etkili." },
                  { src: "/video-ornekler/dogal-ortam.mp4", ikon: "🌿", baslik: "Doğal Ortam", aciklama: "Yapraklar sallanır, ışık oynar. Organik ve sıcak his. Gıda, bitki, doğal ürünler için ideal." },
                ].map((v, i) => (
                  <div key={i} className="flex gap-3 rounded-xl border border-amber-100 bg-amber-50 p-3">
                    <video src={v.src} autoPlay loop muted playsInline className="w-24 h-24 rounded-lg object-cover flex-shrink-0 bg-black" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-gray-800 mb-1">{v.ikon} {v.baslik}</p>
                      <p className="text-[11px] text-gray-500 leading-relaxed">{v.aciklama}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  { ikon: "⏱️", baslik: "5 saniyelik", aciklama: "Story · Reels", etiket: "5 kredi" },
                  { ikon: "🎞️", baslik: "10 saniyelik", aciklama: "Showcase · Pazaryeri", etiket: "8 kredi" },
                  { ikon: "📐", baslik: "3 format", aciklama: "9:16 · 1:1 · 16:9", etiket: "Tüm platformlar" },
                ].map((v, i) => (
                  <div key={i} className="rounded-xl border border-amber-100 bg-amber-50 p-3 text-center">
                    <div className="text-xl mb-1">{v.ikon}</div>
                    <p className="text-xs font-semibold text-gray-800">{v.baslik}</p>
                    <p className="text-[10px] text-gray-400 mb-1">{v.aciklama}</p>
                    <span className="text-[10px] font-semibold text-amber-600 bg-white border border-amber-100 px-1.5 py-0.5 rounded-full">{v.etiket}</span>
                  </div>
                ))}
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs font-semibold text-gray-600 mb-2">Nasıl çalışır?</p>
                <div className="space-y-1.5">
                  {["Ürün fotoğrafını yükle", "Süre ve format seç", "AI ürünü animasyonlu videoya dönüştürür (~2 dk)", "MP4 olarak indir, platforma yükle"].map((s, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-gray-600">
                      <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-[9px] font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                      {s}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {ozellikTab === 3 && (
            <div className="p-5 sm:p-7">
              <p className="text-sm font-semibold text-gray-700 mb-1">Platform uyumlu caption + hashtag seti</p>
              <p className="text-xs text-gray-400 mb-5">Instagram, TikTok, Facebook, Twitter/X — her platform için ayrı format · 1 kredi</p>
              <div className="flex gap-2 mb-4 flex-wrap">
                {["📸 Instagram", "🎵 TikTok", "👥 Facebook", "🐦 Twitter/X"].map((p) => (
                  <span key={p} className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full font-medium">{p}</span>
                ))}
              </div>
              <div className="space-y-3">
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-gray-600">📸 Instagram Caption</span>
                    <span className="text-xs bg-white border border-gray-200 text-gray-400 px-2 py-0.5 rounded-lg">Kopyala</span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Kütahya&apos;nın 500 yıllık geleneğiyle yapılmış bu porselen fincan setini görünce kendinizi bir Osmanlı sarayında hissedeceksiniz ✨☕{"\n\n"}
                    El yapımı çiçek deseni ve altın yaldızlarıyla her sofrayı şölen sofrasına dönüştürün. Sevdiklerinize en güzel hediye — 6 kişilik komple set, özel kutusunda! 🎁
                  </p>
                </div>
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-gray-600">🏷️ Hashtag Seti</span>
                    <span className="text-xs bg-white border border-gray-200 text-gray-400 px-2 py-0.5 rounded-lg">Kopyala</span>
                  </div>
                  <p className="text-sm text-emerald-700 leading-relaxed">
                    #porselen #kahvefincanı #kütahyaporselen #altınyaldız #hediye #türkkahvesi #elyapımı #fincanSeti #çeyiz #düğünhediyesi #porseleneserleri #handmade
                  </p>
                </div>
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-gray-600">🐦 Twitter/X (280 karakter)</span>
                    <span className="text-xs bg-white border border-gray-200 text-gray-400 px-2 py-0.5 rounded-lg">Kopyala</span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Kütahya porseleni + altın yaldız + 6 kişilik set = mükemmel hediye 🎁☕ Her sipariş özel kutusunda geliyor. #porselen #hediye
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
