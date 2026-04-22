"use client";
import { useState, useEffect } from "react";

type PlatformKey = "trendyol" | "amazon" | "etsy";

const platformVerileri: Record<PlatformKey, {
  etiket: string;
  aciklamaKisa: string;
  bolumler: { ikon: string; baslik: string; icerik: string; renk: string }[];
}> = {
  trendyol: {
    etiket: "Trendyol",
    aciklamaKisa: "Max 100 karakter başlık · Türkçe · Keyword-yoğun",
    bolumler: [
      {
        ikon: "📌",
        baslik: "Başlık",
        icerik: "Selin Porselen Çiçek Desenli Kahve Fincanı 6'lı Set 80ml Altın Yaldızlı Hediye",
        renk: "border-l-orange-400",
      },
      {
        ikon: "🔹",
        baslik: "Özellikler",
        icerik: `🏆 Birinci Kalite Porselen — Kurşunsuz, gıda güvenli materyal; günlük kullanıma uygun dayanıklılık.
☕ 80ml Espresso & Türk Kahvesi Hacmi — Geleneksel Türk kahvesi ve espresso severler için ideal boyut.
🌸 El İşlemeli Çiçek Deseni + 24 Ayar Altın Yaldız — Her fincan benzersiz, özel gün hediyesi için birebir.
🎁 6 Fincan + 6 Tabak Komple Set — Şık hediye kutusunda teslim; düğün, nişan ve çeyiz hediyesi.
✅ Bulaşık Makinesine Uygun — Yaldız detayları bozulmadan güvenle yıkanır.`,
        renk: "border-l-orange-400",
      },
      {
        ikon: "📄",
        baslik: "Açıklama",
        icerik: "Selin Porselen'in el işlemeli çiçek desenli fincan seti, Türk kahvesi ritüelinize zarafet katıyor. 80ml hacmiyle espresso ve Türk kahvesine ideal boyutta tasarlanan set, 24 ayar altın yaldız detaylarıyla misafirlerinizi etkileyecek. Düğün, nişan ve doğum günü hediyesi arayanlar için şık kutusunda hazır.",
        renk: "border-l-green-400",
      },
      {
        ikon: "🏷️",
        baslik: "Arama Etiketleri",
        icerik: "porselen fincan seti, kahve fincanı hediye, altın yaldızlı fincan, 6lı fincan takımı, türk kahvesi fincanı, düğün hediyesi fincan, çeyiz fincan seti, espresso fincanı, dekoratif fincan",
        renk: "border-l-violet-400",
      },
    ],
  },

  amazon: {
    etiket: "Amazon TR",
    aciklamaKisa: "Max 200 karakter başlık · Keyword-stuffed · A+ bullet'lar",
    bolumler: [
      {
        ikon: "📌",
        baslik: "Başlık",
        icerik: "Selin Porselen Çiçek Desenli Kahve Fincanı 6'lı Set | 80ml Espresso & Türk Kahvesi Fincanı | Altın Yaldızlı El İşlemeli Porselen | Hediye Kutusunda | Düğün Nişan Çeyiz Hediyesi",
        renk: "border-l-amber-400",
      },
      {
        ikon: "🔹",
        baslik: "Özellikler",
        icerik: `PREMIUM KALİTE PORSELEN: Yüksek ateşte pişirilen birinci sınıf porselen. Kurşunsuz ve kadmiyumsuz — FDA standartlarına uygun gıda güvenli malzeme.
İDEAL BOYUT — 80ML: Türk kahvesi, espresso ve menengiç kahvesi için tasarlanmış hacim. Ne çok büyük ne çok küçük — tam kıvamında sunum.
24 AYAR ALTIN YALDIZ DETAYLARI: El işlemeli çiçek deseni ve gerçek altın yaldız ile lüks görünüm. Her fincan ayrı ayrı kalite kontrolünden geçer.
KOMPLE 12 PARÇA SET: 6 fincan + 6 tabak, özel tasarım hediye kutusunda. Ekstra ambalaja gerek kalmadan direkt hediye edilebilir.
BULAŞIK MAKİNESİ GÜVENLİ: Altın yaldız detayları bulaşık makinesinde 500+ yıkama döngüsüne dayanıklı olarak test edilmiştir.`,
        renk: "border-l-amber-400",
      },
      {
        ikon: "📄",
        baslik: "Açıklama",
        icerik: "Selin Porselen Çiçek Desenli Kahve Fincanı Seti, geleneksel Türk porseleninin zarafetini modern dayanıklılıkla buluşturuyor. El işlemeli çiçek motifleri ve 24 ayar altın yaldız detaylarıyla her bir fincan, sofranıza sanat eseri niteliğinde bir dokunuş katıyor. 80ml hacmiyle Türk kahvesi, espresso ve menengiç için mükemmel boyutta tasarlanan fincanlar, birinci sınıf porselenden yüksek ateşte üretilmiştir. Düğün, nişan, çeyiz ve özel gün hediyesi olarak şık hediye kutusunda sunulan 12 parçalık set, hem günlük kullanım hem misafir ağırlama için idealdir.",
        renk: "border-l-green-400",
      },
      {
        ikon: "🏷️",
        baslik: "Arama Etiketleri",
        icerik: "kahve fincanı seti, porselen fincan 6lı, altın yaldızlı fincan seti, türk kahvesi fincanı, espresso fincan takımı, düğün hediyesi, nişan hediyesi, çeyiz seti, dekoratif porselen, hediye fincan seti",
        renk: "border-l-violet-400",
      },
    ],
  },

  etsy: {
    etiket: "Etsy",
    aciklamaKisa: "İngilizce · Hikaye anlatımı · Handmade & artisan vurgusu",
    bolumler: [
      {
        ikon: "📌",
        baslik: "Title",
        icerik: "Turkish Coffee Cup Set of 6 — Hand-Painted Floral Porcelain with Gold Trim, 80ml Espresso Cups, Gift Boxed",
        renk: "border-l-rose-400",
      },
      {
        ikon: "🔹",
        baslik: "Features",
        icerik: `☕ Artisan-Crafted — Each cup is hand-painted by skilled artisans, making every piece one-of-a-kind with delicate floral motifs.
✨ Real Gold Detailing — 24K gold trim applied by hand adds timeless elegance to your coffee ritual.
🎁 Complete Gift Set — 6 cups + 6 saucers arrive in a premium gift box, ready to give for weddings, housewarmings, or special occasions.
🌿 Food-Safe & Lead-Free — Fired at high temperatures for durability. Meets international food safety standards.
💛 Perfect 80ml Size — Designed specifically for Turkish coffee, espresso, and macchiato lovers who appreciate a perfectly proportioned cup.`,
        renk: "border-l-rose-400",
      },
      {
        ikon: "📄",
        baslik: "Description",
        icerik: "There's something magical about sipping coffee from a cup that someone shaped and painted by hand. This set of six porcelain cups carries a tradition passed down through generations of Turkish artisans — each one adorned with hand-painted floral patterns and finished with real 24K gold trim. At 80ml, they're sized just right for Turkish coffee or a perfect espresso shot. Whether you're treating yourself or searching for a meaningful gift for a wedding, engagement, or housewarming, this set arrives in a beautiful gift box ready to make someone's day.",
        renk: "border-l-green-400",
      },
      {
        ikon: "🏷️",
        baslik: "Tags",
        icerik: "turkish coffee cup, espresso cup set, hand painted porcelain, gold trim cup, coffee lover gift, wedding gift set, housewarming gift, artisan ceramics, floral cup set",
        renk: "border-l-violet-400",
      },
    ],
  },
};

const KUTULAR = [
  { idx: 0, ikon: "📝", baslik: "Listing Metni", aciklama: "Başlık, özellikler, açıklama, etiketler", kredi: "1 kredi", ring: "ring-blue-400", bg: "bg-blue-50", badge: "text-blue-600 bg-blue-100" },
  { idx: 1, ikon: "📷", baslik: "Görsel", aciklama: "7 stil, stil başına 1 görsel", kredi: "Stil başına 1 kredi", ring: "ring-violet-400", bg: "bg-violet-50", badge: "text-violet-600 bg-violet-100" },
  { idx: 2, ikon: "🎬", baslik: "Video", aciklama: "Ürün tanıtım videosu, 1080p", kredi: "5sn veya 10sn", ring: "ring-amber-400", bg: "bg-amber-50", badge: "text-amber-600 bg-amber-100" },
  { idx: 3, ikon: "📱", baslik: "Sosyal Medya", aciklama: "Caption + hashtag, tüm platformlar", kredi: "1 kredi / platform · Kit: 3 kredi", ring: "ring-emerald-400", bg: "bg-emerald-50", badge: "text-emerald-600 bg-emerald-100" },
];

const BORDER_TOP_MAP = ["border-t-blue-400", "border-t-violet-400", "border-t-amber-400", "border-t-emerald-400"];

export default function FeaturesTabbed() {
  const [ozellikTab, setOzellikTab] = useState(0);
  const [platformTab, setPlatformTab] = useState<PlatformKey>("trendyol");

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      const map: Record<string, number> = {
        "#arac-metin": 0,
        "#arac-gorsel": 1,
        "#arac-video": 2,
        "#arac-sosyal": 3,
      };
      if (hash in map) {
        setOzellikTab(map[hash]);
        setTimeout(() => {
          document.getElementById("araclar")?.scrollIntoView({ behavior: "smooth" });
          history.replaceState(null, "", window.location.pathname);
        }, 100);
      }
    };
    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  return (
    <section id="araclar" className="px-4 sm:px-6 py-16 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Tek platformda 4 içerik türü</h2>
        <p className="text-center text-base text-gray-500 max-w-2xl mx-auto mt-2 mb-6">Pazaryerlerinde ürün listelemek için metin, görsel, video ve sosyal içerik gerekir. Ayrı ayrı araçlarla uğraşmak yerine hepsini tek platformdan üretin.</p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {KUTULAR.map((k) => (
            <button
              key={k.idx}
              type="button"
              onClick={() => setOzellikTab(k.idx)}
              className={`cursor-pointer text-left rounded-2xl border-2 overflow-hidden transition-all shadow-sm hover:shadow-md ${
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

        <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden border-t-4 ${BORDER_TOP_MAP[ozellikTab]}`}>
          {ozellikTab === 0 && (
            <div className="p-5 sm:p-7">
              <p className="text-sm text-gray-600 mb-4">Her pazaryerinin kendine özel karakter limiti, format kuralları ve yasaklı kelimeleri var. yzliste bunları bilir — platforma özel başlık, madde madde özellikler, SEO uyumlu açıklama ve arama etiketleri üretir.</p>
              <div className="flex gap-2 mb-1">
                {(Object.keys(platformVerileri) as PlatformKey[]).map((key) => {
                  const p = platformVerileri[key];
                  const aktif = platformTab === key;
                  const renkMap: Record<PlatformKey, string> = {
                    trendyol: aktif ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-500 hover:bg-orange-50 hover:text-orange-600",
                    amazon:   aktif ? "bg-amber-500 text-white"  : "bg-gray-100 text-gray-500 hover:bg-amber-50 hover:text-amber-600",
                    etsy:     aktif ? "bg-rose-500 text-white"   : "bg-gray-100 text-gray-500 hover:bg-rose-50 hover:text-rose-600",
                  };
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setPlatformTab(key)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${renkMap[key]}`}
                    >
                      {p.etiket}
                    </button>
                  );
                })}
              </div>
              <p className="text-[11px] text-gray-400 mb-4">{platformVerileri[platformTab].aciklamaKisa}</p>
              <div className="space-y-3">
                {platformVerileri[platformTab].bolumler.map((bolum, i) => (
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
                {["Manuel metin girişi", "Fotoğraftan otomatik analiz", "Barkod ile ürün tanıma", "7 platform desteği"].map((f) => (
                  <span key={f} className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[9px]">✓</span>{f}
                  </span>
                ))}
              </div>
              <div className="mt-4 rounded-xl bg-blue-50 border border-blue-100 p-3 text-[11px] text-blue-700 leading-relaxed">
                💡 <strong>Her pazaryerinin kuralları farklı:</strong> Trendyol max 100 karakter başlık ister, Amazon 200&apos;e kadar keyword kabul eder, Etsy İngilizce + hikaye anlatımı sever. yzliste hepsini tek fotoğraftan üretir.
              </div>
              <div className="mt-5 pt-4 border-t border-gray-100 text-center">
                <a href="/uret?tab=metin" className="inline-block bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors shadow-lg shadow-indigo-100">
                  Listing Metni Üret →
                </a>
              </div>
            </div>
          )}

          {ozellikTab === 1 && (
            <div className="p-5 sm:p-7">
              <p className="text-sm text-gray-600 mb-4">Tek bir ürün fotoğrafından profesyonel stüdyo görselleri oluşturun. Arka plan otomatik temizlenir, 7 farklı stüdyo stilinden seçin — ya da sahnenizi anlatın, kendi fonunuzu yükleyin.</p>
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
              <div className="mt-5 pt-4 border-t border-gray-100 text-center">
                <a href="/uret?tab=gorsel" className="inline-block bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors shadow-lg shadow-indigo-100">
                  Stüdyo Görseli Üret →
                </a>
              </div>
            </div>
          )}

          {ozellikTab === 2 && (
            <div className="p-5 sm:p-7">
              <p className="text-sm text-gray-600 mb-4">Ürün fotoğrafınızdan AI ile tanıtım videosu oluşturun. 6 ön tanımlı hareket stilinden seçin ya da kendi yönetmenliğinizi yapın — Reels, TikTok, YouTube ve pazaryeri formatlarında.</p>
              <p className="text-sm font-semibold text-gray-700 mb-1">Ürün fotoğrafından tanıtım videosu</p>
              <p className="text-xs text-gray-400 mb-5">Ürünü hareket ettiren, platform uyumlu dikey/kare video — MP4 olarak indir</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                {[
                  { src: "/video-ornekler/360-donus.mp4", ikon: "🔄", baslik: "360° Dönüş", aciklama: "Ürün kendi ekseni etrafında döner. Tüm açılar görünür. Takı, aksesuar, elektronik için ideal." },
                  { src: "/video-ornekler/zoom-yaklasim.mp4", ikon: "🔍", baslik: "Zoom Yaklaşım", aciklama: "Kamera ürüne doğru yaklaşır. Doku ve detay hissi. El yapımı ve tekstil ürünler için güçlü." },
                  { src: "/video-ornekler/dramatik-isik.mp4", ikon: "💡", baslik: "Dramatik Işık", aciklama: "Karanlık sahnede spotlight açılır. Premium ve lüks his. Kozmetik ve elektronik için etkili." },
                  { src: "/video-ornekler/dogal-ortam.mp4", ikon: "🌿", baslik: "Doğal Ortam", aciklama: "Yapraklar sallanır, ışık oynar. Organik ve sıcak his. Gıda, bitki, doğal ürünler için ideal." },
                  { src: "/video-ornekler/detay-tarama.mp4", ikon: "🔬", baslik: "Detay Tarama", aciklama: "Kamera yüzeyi soldan sağa tarar. Doku, işçilik, malzeme kalitesi ortaya çıkar. Elektronik ve deri ürünler için güçlü." },
                  { src: "/video-ornekler/kumas-hareketi.mp4", ikon: "👕", baslik: "Kumaş Hareketi", aciklama: "Hafif esinti kumaşı hareket ettirir. Döküm ve akışkanlık hissi verir. Elbise, şal, perde için ideal." },
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
                  { ikon: "⏱️", baslik: "5 saniyelik", aciklama: "Story · Reels", etiket: "10 kredi" },
                  { ikon: "🎞️", baslik: "10 saniyelik", aciklama: "Showcase · Pazaryeri", etiket: "20 kredi" },
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
              <div className="mt-5 pt-4 border-t border-gray-100 text-center">
                <a href="/uret?tab=video" className="inline-block bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors shadow-lg shadow-indigo-100">
                  Ürün Videosu Üret →
                </a>
              </div>
            </div>
          )}

          {ozellikTab === 3 && (
            <div className="p-5 sm:p-7">
              <p className="text-sm text-gray-600 mb-4">Her platform için ayrı formatta caption ve hashtag seti üretin. Instagram, TikTok, Facebook ve X — hepsi tek tıkla.</p>
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
                    El yapımı çiçek deseni ve altın yaldızlarıyla bu porselen fincan seti her sofrayı şölen sofrasına dönüştürüyor ✨☕{"\n\n"}
                    Sevdiklerinize en güzel hediye — 6 kişilik komple set, özel kutusunda! 🎁
                  </p>
                </div>
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-gray-600">🏷️ Hashtag Seti</span>
                    <span className="text-xs bg-white border border-gray-200 text-gray-400 px-2 py-0.5 rounded-lg">Kopyala</span>
                  </div>
                  <p className="text-sm text-emerald-700 leading-relaxed">
                    #porselen #kahvefincanı #porselenfincan #altınyaldız #hediye #türkkahvesi #elyapımı #fincanSeti #çeyiz #düğünhediyesi #porseleneserleri #handmade
                  </p>
                </div>
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-gray-600">🐦 Twitter/X (280 karakter)</span>
                    <span className="text-xs bg-white border border-gray-200 text-gray-400 px-2 py-0.5 rounded-lg">Kopyala</span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    El yapımı porselen + altın yaldız + 6 kişilik set = mükemmel hediye 🎁☕ Her sipariş özel kutusunda geliyor. #porselen #hediye
                  </p>
                </div>
              </div>
              <div className="mt-5 pt-4 border-t border-gray-100 text-center">
                <a href="/uret?tab=sosyal" className="inline-block bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors shadow-lg shadow-indigo-100">
                  Sosyal İçerik Üret →
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
