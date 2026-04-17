"use client";
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useInvalidateCredits } from "@/lib/hooks/useCredits";
import { analytics } from "@/lib/analytics";

type AnaSekme = "metin" | "gorsel" | "video" | "sosyal";
type SosyalPlatform = "instagram_tiktok" | "facebook" | "twitter";
type SosyalTon = "tanitim" | "indirim" | "hikaye";

type Uretim = {
  id: string;
  urun_adi: string;
  platform: string;
  giris_tipi: string;
  sonuc: string;
  created_at: string;
};

type Kullanici = {
  id: string;
  email: string | null;
  kredi: number;
  toplam_kullanilan: number;
  is_admin: boolean;
  anonim?: boolean;
  ton?: string;
  marka_adi?: string;
};

type SonucBolum = {
  baslik: string;
  ikon: string;
  icerik: string;
};

const PLATFORM_BILGI: Record<string, {
  baslikLimit: number;
  ozellikSayisi: number;
  aciklamaKelime: number;
  etiketSayisi: number;
  renk: string;
  aciklama: string;
  dil: "tr" | "en";
}> = {
  trendyol: { baslikLimit: 100, ozellikSayisi: 5, aciklamaKelime: 300, etiketSayisi: 10, renk: "bg-orange-50 text-orange-700 border-orange-200", aciklama: "Emoji destekli · Marka + Ürün + Özellik formatı", dil: "tr" },
  hepsiburada: { baslikLimit: 150, ozellikSayisi: 5, aciklamaKelime: 350, etiketSayisi: 10, renk: "bg-orange-50 text-orange-600 border-orange-200", aciklama: "Emoji destekli · Teknik detay odaklı", dil: "tr" },
  amazon: { baslikLimit: 200, ozellikSayisi: 5, aciklamaKelime: 400, etiketSayisi: 0, renk: "bg-yellow-50 text-yellow-700 border-yellow-200", aciklama: "Emoji kullanılmaz · Title Case · Backend arama terimleri", dil: "tr" },
  n11: { baslikLimit: 100, ozellikSayisi: 5, aciklamaKelime: 250, etiketSayisi: 8, renk: "bg-blue-50 text-blue-700 border-blue-200", aciklama: "Emoji destekli · Sade ve anlaşılır dil", dil: "tr" },
  etsy: { baslikLimit: 140, ozellikSayisi: 0, aciklamaKelime: 300, etiketSayisi: 13, renk: "bg-orange-50 text-orange-800 border-orange-300", aciklama: "Natural English · 13 multi-word tags · No keyword stuffing", dil: "en" },
  amazon_usa: { baslikLimit: 200, ozellikSayisi: 5, aciklamaKelime: 400, etiketSayisi: 0, renk: "bg-blue-50 text-blue-800 border-blue-300", aciklama: "Title Case · No emoji · Benefit-first bullets · Backend search terms", dil: "en" },
};

const PLATFORM_PLACEHOLDER: Record<string, { urun: string; kategori: string; ozellik: string }> = {
  trendyol: { urun: "örn: Columbia Erkek Su Geçirmez Outdoor Bot", kategori: "örn: Ayakkabı & Çanta / Erkek Bot", ozellik: "örn: 42 numara, kahverengi, hakiki deri, kışlık, garanti belgeli, kutusuyla" },
  hepsiburada: { urun: "örn: Samsung Galaxy S24 128GB Akıllı Telefon", kategori: "örn: Cep Telefonu & Aksesuar / Akıllı Telefon", ozellik: "örn: Siyah renk, 6.1 inç ekran, 50MP kamera, 4000mAh batarya, Türkiye garantili" },
  amazon: { urun: "örn: Philips HD9250 Airfryer XXL", kategori: "örn: Küçük Ev Aletleri / Fritöz", ozellik: "örn: 7.3L kapasite, dijital ekran, yağsız pişirme, 7 program, 2030W, CE belgeli" },
  n11: { urun: "örn: Tefal Ingenio Tencere Seti 13 Parça", kategori: "örn: Mutfak & Yemek / Tencere Seti", ozellik: "örn: Alüminyum, yapışmaz kaplama, 18-28cm, indüksiyon uyumlu, fırına girer" },
  etsy: { urun: "e.g. Handmade Copper Cezve Set, Turkish Coffee Pot", kategori: "e.g. Kitchen & Dining / Coffee Accessories", ozellik: "e.g. handmade, copper, 2-piece set, traditional Turkish style, gift idea" },
  amazon_usa: { urun: "e.g. Turkish Copper Coffee Maker Set, 2 Piece", kategori: "e.g. Kitchen & Dining / Coffee & Espresso", ozellik: "e.g. Solid copper, handcrafted, 2-cup capacity, includes lid, food safe" },
};

function sonucuBolumle(sonuc: string): SonucBolum[] {
  if (!sonuc) return [];
  sonuc = sonuc.replace(/\*\*/g, "").replace(/\*/g, "");
  const bolumler: SonucBolum[] = [];
  const baslikMatch = sonuc.match(/(?:📌\s*)?(?:BAŞLIK|Başlık)[:\n]+([^\n🔹📄🏷]+)/i);
  const ozellikMatch = sonuc.match(/(?:🔹\s*)?(?:ÖZELLİKLER|Özellikler)[:\n]+([\s\S]+?)(?=📄|🏷|$)/i);
  const aciklamaMatch = sonuc.match(/(?:📄\s*)?(?:AÇIKLAMA|Açıklama)[:\n]+([\s\S]+?)(?=🏷|$)/i);
  const etiketMatch = sonuc.match(/(?:🏷️?\s*)?(?:ETİKETLER|Etiketler)[:\n]+([\s\S]+?)$/i);
  if (baslikMatch) bolumler.push({ baslik: "Başlık", ikon: "📌", icerik: baslikMatch[1].trim() });
  if (ozellikMatch) bolumler.push({ baslik: "Özellikler", ikon: "🔹", icerik: ozellikMatch[1].trim() });
  if (aciklamaMatch) bolumler.push({ baslik: "Açıklama", ikon: "📄", icerik: aciklamaMatch[1].trim() });
  if (etiketMatch) bolumler.push({ baslik: "Arama Etiketleri", ikon: "🏷️", icerik: etiketMatch[1].trim() });
  if (bolumler.length === 0) bolumler.push({ baslik: "İçerik", ikon: "📋", icerik: sonuc });
  return bolumler;
}

async function docxIndir(bolumler: SonucBolum[], urunAdi: string) {
  const { Document, Packer, Paragraph, TextRun, HeadingLevel } = await import("docx");
  const { saveAs } = await import("file-saver");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const paragraflar: any[] = [];
  bolumler.forEach((bolum) => {
    paragraflar.push(new Paragraph({ text: `${bolum.ikon} ${bolum.baslik}`, heading: HeadingLevel.HEADING_2, spacing: { before: 300, after: 100 } }));
    bolum.icerik.split("\n").forEach((satir) => {
      if (satir.trim()) paragraflar.push(new Paragraph({ children: [new TextRun({ text: satir, size: 22 })], spacing: { after: 80 } }));
    });
  });
  const doc = new Document({ sections: [{ properties: {}, children: [new Paragraph({ text: `yzliste — ${urunAdi}`, heading: HeadingLevel.HEADING_1, spacing: { after: 200 } }), ...paragraflar] }] });
  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${urunAdi || "listing"}.docx`);
}

function KopyalaButon({ metin, getDuzenlenmisMevin }: { metin: string; getDuzenlenmisMevin?: () => string }) {
  const [kopyalandi, setKopyalandi] = useState(false);
  const kopyala = () => {
    const kopyalanacak = getDuzenlenmisMevin ? getDuzenlenmisMevin() : metin;
    navigator.clipboard.writeText(kopyalanacak);
    setKopyalandi(true);
    setTimeout(() => setKopyalandi(false), 2000);
  };
  return (
    <button onClick={kopyala} className={`text-xs font-medium px-3 py-1 rounded-lg transition-all duration-200 ${kopyalandi ? "bg-green-100 text-green-700 border border-green-300 scale-95" : "bg-gray-100 text-gray-500 hover:bg-orange-50 hover:text-orange-600"}`}>
      {kopyalandi ? <span className="flex items-center gap-1 text-green-600"><span>✓</span> Kopyalandı</span> : "Kopyala"}
    </button>
  );
}

const yukleniyorMesajlari = [
  "Ürün analiz ediliyor...",
  "Alıcı arama alışkanlıkları inceleniyor...",
  "Platform kuralları uygulanıyor...",
  "SEO ve GEO optimizasyonu yapılıyor...",
  "Anahtar kelimeler yerleştiriliyor...",
  "İçerik hazırlanıyor...",
];

function PaketModal({ kullanici, onKapat }: { kullanici: Kullanici; onKapat: () => void }) {
  const [seciliPaket, setSeciliPaket] = useState<string | null>(null);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [odemeAcik, setOdemeAcik] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const paketler = [
    { id: "baslangic", isim: "Başlangıç", fiyat: "₺29", kredi: "10 kredi", renk: "border-gray-200", butonRenk: "bg-gray-800 hover:bg-gray-900" },
    { id: "populer", isim: "Popüler", fiyat: "₺79", kredi: "30 kredi", renk: "border-orange-400 ring-2 ring-orange-400", butonRenk: "bg-orange-500 hover:bg-orange-600", rozet: true },
    { id: "buyuk", isim: "Büyük", fiyat: "₺149", kredi: "100 kredi", renk: "border-gray-200", butonRenk: "bg-gray-800 hover:bg-gray-900" },
  ];

  const odemeBaslat = async (paketId: string) => {
    setSeciliPaket(paketId);
    setYukleniyor(true);
    const fiyatMap: Record<string, number> = { baslangic: 29, populer: 79, buyuk: 149 };
    analytics.creditPurchaseStarted({ package_id: paketId, price: fiyatMap[paketId] ?? 0 });
    try {
      const res = await fetch("/api/odeme", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ paket: paketId, userId: kullanici.id, email: kullanici.email }) });
      const data = await res.json();
      if (data.checkoutFormContent) {
        setOdemeAcik(true);
        setTimeout(() => {
          if (formRef.current) {
            formRef.current.innerHTML = data.checkoutFormContent;
            const scriptlar = formRef.current.querySelectorAll("script");
            scriptlar.forEach((eskiScript) => {
              const yeniScript = document.createElement("script");
              if (eskiScript.src) yeniScript.src = eskiScript.src;
              else yeniScript.textContent = eskiScript.textContent;
              eskiScript.parentNode?.replaceChild(yeniScript, eskiScript);
            });
          }
        }, 100);
      } else {
        alert(data.hata || "Ödeme başlatılamadı, tekrar deneyin.");
      }
    } catch { alert("Bir hata oluştu, tekrar deneyin."); }
    setYukleniyor(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">İçerik Üretim Kredisi Satın Al</h2>
            <p className="text-xs text-gray-500 mt-0.5">Mevcut kredin: <span className="font-semibold text-orange-500">{kullanici.kredi}</span></p>
          </div>
          <button onClick={onKapat} className="text-gray-400 hover:text-gray-600 text-2xl font-light">×</button>
        </div>
        {!odemeAcik ? (
          <div className="p-6 space-y-4">
            {paketler.map((p) => (
              <div key={p.id} className={`border-2 ${p.renk} rounded-2xl p-5 relative`}>
                {p.rozet && <span className="absolute -top-3 left-4 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">En Popüler</span>}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-800">{p.isim}</p>
                    <p className="text-sm text-gray-500">{p.kredi}</p>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{p.fiyat}</p>
                </div>
                <button onClick={() => odemeBaslat(p.id)} disabled={yukleniyor} className={`w-full mt-4 ${p.butonRenk} text-white font-semibold py-2.5 rounded-xl text-sm transition-colors disabled:bg-gray-300`}>
                  {yukleniyor && seciliPaket === p.id ? "⏳ Yükleniyor..." : "Satın Al"}
                </button>
              </div>
            ))}
            <p className="text-xs text-gray-400 text-center pt-2">🔒 Güvenli ödeme — iyzico altyapısı</p>
          </div>
        ) : (
          <div className="p-4"><div ref={formRef} id="iyzipay-checkout-form" className="popup" /></div>
        )}
      </div>
    </div>
  );
}

function ChatWidget() {
  const [acik, setAcik] = useState(false);
  const [mesajlar, setMesajlar] = useState<{ rol: string; metin: string }[]>([
    { rol: "asistan", metin: "Merhaba! Listing veya görsel üretim konusunda soru sormak ister misiniz?" },
  ]);
  const [input, setInput] = useState("");
  const [yukleniyor, setYukleniyor] = useState(false);

  const gonder = async () => {
    if (!input.trim()) return;
    setMesajlar((prev) => [...prev, { rol: "kullanici", metin: input }]);
    setInput("");
    setYukleniyor(true);
    setTimeout(() => {
      setMesajlar((prev) => [...prev, { rol: "asistan", metin: "Bu özellik yakında aktif olacak! Şimdilik yzliste'nin tüm özelliklerini deneyebilirsiniz." }]);
      setYukleniyor(false);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {acik && (
        <div className="mb-3 bg-white rounded-2xl shadow-xl border border-gray-100 w-80 flex flex-col overflow-hidden">
          <div className="bg-orange-500 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
              <span className="text-white text-sm font-semibold">yzliste destek</span>
            </div>
            <button onClick={() => setAcik(false)} className="text-white/80 hover:text-white text-lg">×</button>
          </div>
          <div className="flex-1 p-4 space-y-3 max-h-72 overflow-y-auto bg-gray-50">
            {mesajlar.map((m, i) => (
              <div key={i} className={`flex ${m.rol === "kullanici" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] px-3 py-2 rounded-xl text-xs leading-relaxed ${m.rol === "kullanici" ? "bg-orange-500 text-white" : "bg-white text-gray-700 border border-gray-100"}`}>
                  {m.metin}
                </div>
              </div>
            ))}
            {yukleniyor && <div className="flex justify-start"><div className="bg-white border border-gray-100 px-3 py-2 rounded-xl text-xs text-gray-400">yazıyor...</div></div>}
          </div>
          <div className="p-3 border-t border-gray-100 bg-white flex gap-2">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && gonder()} placeholder="Mesajınızı yazın..." className="flex-1 text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-orange-400" />
            <button onClick={gonder} className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-lg text-xs font-medium">Gönder</button>
          </div>
        </div>
      )}
      <button onClick={() => setAcik(!acik)} className="bg-orange-500 hover:bg-orange-600 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl transition-all">
        {acik ? "×" : "💬"}
      </button>
    </div>
  );
}

// ---- Yardımcı: Fotoğraf thumbnail bileşeni ----
function FotoThumbnail({ src, onKaldir, renk = "green" }: { src: string; onKaldir: () => void; renk?: string }) {
  const renkler: Record<string, string> = {
    green: "bg-green-50 border-green-200 text-green-700 text-green-500",
    red: "bg-red-50 border-red-200 text-red-700 text-red-400",
    pink: "bg-pink-50 border-pink-200 text-pink-700 text-pink-400",
  };
  const cls = renkler[renk] || renkler.green;
  const parts = cls.split(" ");
  return (
    <div className={`flex items-center gap-3 ${parts[0]} border ${parts[1]} rounded-xl p-3`}>
      <img src={src} alt="Ürün" className={`w-12 h-12 object-cover rounded-lg border ${parts[1]}`} />
      <div className="flex-1">
        <p className={`text-xs font-medium ${parts[2]}`}>✓ Fotoğraf hazır</p>
      </div>
      <button onClick={onKaldir} className="text-xs text-red-400 hover:text-red-600 underline font-medium">Kaldır</button>
    </div>
  );
}

// ---- Yardımcı: Boş fotoğraf alanı ----
function FotoEkleAlani({ id, onChange, renk = "gray", metin = "Fotoğraf ekle", ikon = "📷", altMetin }: {
  id: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  renk?: string; metin?: string; ikon?: string; altMetin?: string;
}) {
  const sinirRenk: Record<string, string> = {
    gray: "border-gray-300 hover:border-orange-400 hover:bg-orange-50",
    purple: "border-purple-300 hover:border-purple-400 hover:bg-purple-50",
    red: "border-red-200 hover:border-red-400 hover:bg-red-50",
    pink: "border-pink-200 hover:border-pink-400 hover:bg-pink-50",
  };
  const metin_renk: Record<string, string> = {
    gray: "text-gray-500", purple: "text-purple-700", red: "text-red-600", pink: "text-pink-500",
  };
  const alt_renk: Record<string, string> = {
    gray: "text-gray-400", purple: "text-purple-400", red: "text-red-400", pink: "text-pink-400",
  };
  return (
    <label htmlFor={id} className={`block border-2 border-dashed ${sinirRenk[renk]} rounded-xl p-6 text-center cursor-pointer transition-all`}>
      <div className="text-3xl mb-2">{ikon}</div>
      <p className={`text-sm font-medium ${metin_renk[renk]}`}>{metin}</p>
      {altMetin && <p className={`text-xs ${alt_renk[renk]} mt-1`}>{altMetin}</p>}
      <input type="file" accept="image/*" onChange={onChange} className="hidden" id={id} />
    </label>
  );
}

export default function Home() {
  const router = useRouter();
  const invalidateCredits = useInvalidateCredits();

  // Sekme
  const [anaSekme, setAnaSekme] = useState<AnaSekme>("metin");

  // Kullanıcı
  const [kullanici, setKullanici] = useState<Kullanici | null>(null);
  const [gecmis, setGecmis] = useState<Uretim[]>([]);
  const [seciliUretim, setSeciliUretim] = useState<Uretim | null>(null);
  const [paketModalAcik, setPaketModalAcik] = useState(false);
  const [hata, setHata] = useState<string | null>(null);
  const [profilBannerKapatildi, setProfilBannerKapatildi] = useState(false);

  // Auth popup
  const [authPopupAcik, setAuthPopupAcik] = useState(false);
  const [authPopupMod, setAuthPopupMod] = useState<"giris" | "kayit">("kayit");
  const [authPopupEmail, setAuthPopupEmail] = useState("");
  const [authPopupSifre, setAuthPopupSifre] = useState("");
  const [authPopupSozlesme, setAuthPopupSozlesme] = useState(false);
  const [authPopupMesaj, setAuthPopupMesaj] = useState("");
  const [authPopupYukleniyor, setAuthPopupYukleniyor] = useState(false);
  const [authSonraAksiyon, setAuthSonraAksiyon] = useState<"paket" | null>(null);

  // Metin sekmesi
  const [urunAdi, setUrunAdi] = useState("");
  const [kategori, setKategori] = useState("");
  const [ozellikler, setOzellikler] = useState("");
  const [platform, setPlatform] = useState("trendyol");
  const [dil, setDil] = useState<"tr" | "en">("tr");
  const [sonuc, setSonuc] = useState("");
  const [yukleniyor, setYukleniyor] = useState(false);
  const [yukleniyorMesaj, setYukleniyorMesaj] = useState(0);
  const [fotolar, setFotolar] = useState<string[]>([]);
  const [girisTipi, setGirisTipi] = useState<"manuel" | "foto" | "barkod">("manuel");
  const [barkod, setBarkod] = useState("");
  const [barkodYukleniyor, setBarkodYukleniyor] = useState(false);
  const [barkodBilgi, setBarkodBilgi] = useState<{ isim: string; marka: string; aciklama: string; kategori: string; renk: string; boyut: string } | null>(null);
  const [kameraAcik, setKameraAcik] = useState(false);

  // Görsel sekmesi
  const [gorselEkPrompt, setGorselEkPrompt] = useState("");
  const [seciliStiller, setSeciliStiller] = useState<string[]>([]);
  const [gorselYukleniyor, setGorselYukleniyor] = useState(false);
  const [gorselSonuclar, setGorselSonuclar] = useState<{ stil: string; label: string; gorseller: string[] }[]>([]);
  const [gorselUyariAcik, setGorselUyariAcik] = useState(false);
  const [krediOnayAcik, setKrediOnayAcik] = useState(false);
  const [krediOnayIslem, setKrediOnayIslem] = useState<(() => Promise<void>) | null>(null);

  // Video sekmesi
  // videoFoto kaldırıldı — tüm sekmeler fotolar[0] paylaşır
  const [videoPrompt, setVideoPrompt] = useState("");
  const [videoSure, setVideoSure] = useState<"5" | "10">("5");
  const [videoFormat, setVideoFormat] = useState<"9:16" | "16:9" | "1:1">("9:16");
  const [videoYukleniyor, setVideoYukleniyor] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  // Sosyal sekmesi
  // sosyalFoto kaldırıldı — tüm sekmeler fotolar[0] paylaşır
  const [sosyalUrunAdi, setSosyalUrunAdi] = useState("");
  const [sosyalEkBilgi, setSosyalEkBilgi] = useState("");
  const [sosyalPlatform, setSosyalPlatform] = useState<SosyalPlatform>("instagram_tiktok");
  const [sosyalTon, setSosyalTon] = useState<SosyalTon>("tanitim");
  const [captionYukleniyor, setCaptionYukleniyor] = useState(false);
  const [sosyalCaption, setSosyalCaption] = useState("");
  const [sosyalHashtag, setSosyalHashtag] = useState("");
  const [sosyalSezon, setSosyalSezon] = useState("normal");
  // Sosyal görsel
  const [sosyalGorselFormat, setSosyalGorselFormat] = useState<"1:1" | "9:16" | "16:9">("1:1");
  const [sosyalGorselStil, setSosyalGorselStil] = useState("beyaz");
  const [sosyalGorselYukleniyor, setSosyalGorselYukleniyor] = useState(false);
  const [sosyalGorselSonuclar, setSosyalGorselSonuclar] = useState<string[]>([]);
  // Sosyal Medya Kiti
  type KitCaption = { caption: string; hashtag: string };
  type KitSonuc = { captions: Record<string, KitCaption>; gorselUrls: string[] };
  const [kitYukleniyor, setKitYukleniyor] = useState(false);
  const [kitSonuc, setKitSonuc] = useState<KitSonuc | null>(null);
  const [kitGorselFormat, setKitGorselFormat] = useState<"1:1" | "9:16" | "16:9">("1:1");
  const [kitGorselStil, setKitGorselStil] = useState("beyaz");

  // Refs
  const scannerRef = useRef<unknown>(null);
  const scannerBaslatildi = useRef(false);
  const sorguCalisiyor = useRef(false);
  const mesajInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const platformBilgi = PLATFORM_BILGI[platform] || PLATFORM_BILGI.trendyol;
  const platformPh = PLATFORM_PLACEHOLDER[platform] || PLATFORM_PLACEHOLDER.trendyol;
  const platformDil = platformBilgi.dil || "tr";
  const krediDusuk = kullanici && !kullanici.is_admin && kullanici.kredi <= 2;
  const sonucBolumleri = sonucuBolumle(sonuc);
  const platformRenk: Record<string, string> = { trendyol: "bg-orange-100 text-orange-700", hepsiburada: "bg-orange-100 text-orange-600", amazon: "bg-yellow-100 text-yellow-700", n11: "bg-blue-100 text-blue-700" };

  const turkceHata = (hata: string): string => {
    if (hata.includes("Password should be at least 6 characters")) return "Şifre en az 6 karakter olmalıdır.";
    if (hata.includes("Invalid login credentials")) return "E-posta veya şifre hatalı.";
    if (hata.includes("Email not confirmed")) return "E-posta adresinizi doğrulayın.";
    if (hata.includes("User already registered")) return "Bu e-posta adresi zaten kayıtlı.";
    if (hata.includes("invalid") && hata.includes("email")) return "Geçerli bir e-posta adresi girin.";
    if (hata.includes("rate limit") || hata.includes("too many")) return "Çok fazla deneme. Lütfen biraz bekleyin.";
    return "Bir hata oluştu. Lütfen tekrar deneyin.";
  };

  const handleAuthPopupGiris = async () => {
    if (!authPopupEmail.trim()) { setAuthPopupMesaj("E-posta girin."); return; }
    if (!authPopupSifre.trim()) { setAuthPopupMesaj("Şifre girin."); return; }
    if (authPopupMod === "kayit" && !authPopupSozlesme) { setAuthPopupMesaj("Sözleşmeleri kabul edin."); return; }
    setAuthPopupYukleniyor(true); setAuthPopupMesaj("");
    if (authPopupMod === "kayit") {
      if (kullanici?.anonim) {
        const { error } = await supabase.auth.updateUser({ email: authPopupEmail, password: authPopupSifre });
        if (error) { setAuthPopupMesaj(turkceHata(error.message)); setAuthPopupYukleniyor(false); return; }
        setAuthPopupMesaj("Hesabınız oluşturuldu! E-postanızı doğrulayın, ardından giriş yapın.");
      } else {
        const { error } = await supabase.auth.signUp({ email: authPopupEmail, password: authPopupSifre });
        if (error) { setAuthPopupMesaj(turkceHata(error.message)); setAuthPopupYukleniyor(false); return; }
        setAuthPopupMesaj("Kayıt başarılı! E-postanızı doğrulayın.");
      }
    } else {
      const { error, data } = await supabase.auth.signInWithPassword({ email: authPopupEmail, password: authPopupSifre });
      if (error) { setAuthPopupMesaj("E-posta veya şifre hatalı."); setAuthPopupYukleniyor(false); return; }
      const { data: profil } = await supabase.from("profiles").select("email, kredi, is_admin, ton, marka_adi").eq("id", data.user.id).single();
      if (profil) setKullanici({ id: data.user.id, email: profil.email ?? null, kredi: profil.kredi, toplam_kullanilan: 0, is_admin: profil.is_admin || false, anonim: false, ton: profil.ton ?? undefined, marka_adi: profil.marka_adi ?? undefined });
      gecmisiYukle(data.user.id);
      setAuthPopupAcik(false);
      setAuthPopupEmail(""); setAuthPopupSifre(""); setAuthPopupSozlesme(false); setAuthPopupMesaj("");
      if (authSonraAksiyon === "paket") {
        setAuthSonraAksiyon(null);
        const { data: fatProfil } = await supabase.from("profiles").select("ad_soyad, fatura_tipi, tc_kimlik, vergi_no").eq("id", data.user.id).single();
        const eksik = !fatProfil?.ad_soyad || (fatProfil?.fatura_tipi === "bireysel" && !fatProfil?.tc_kimlik) || (fatProfil?.fatura_tipi === "kurumsal" && !fatProfil?.vergi_no);
        if (eksik) { setHata("Ödeme yapabilmek için önce profil sayfasından fatura bilgilerinizi doldurun."); setTimeout(() => router.push("/profil"), 2500); }
        else { setPaketModalAcik(true); }
      }
    }
    setAuthPopupYukleniyor(false);
  };

  const paketModalAc = async () => {
    if (!kullanici) return;
    if (kullanici.anonim) {
      setAuthSonraAksiyon("paket");
      setAuthPopupMod("kayit");
      setAuthPopupAcik(true);
      return;
    }
    const { data: profil } = await supabase.from("profiles").select("ad_soyad, fatura_tipi, tc_kimlik, vergi_no").eq("id", kullanici.id).single();
    const eksik = !profil?.ad_soyad || (profil?.fatura_tipi === "bireysel" && !profil?.tc_kimlik) || (profil?.fatura_tipi === "kurumsal" && !profil?.vergi_no);
    if (eksik) { setHata("Ödeme yapabilmek için önce profil sayfasından fatura bilgilerinizi doldurun."); setTimeout(() => router.push("/profil"), 2500); return; }
    setPaketModalAcik(true);
  };

  const kullaniciyiKontrolEt = async () => {
    const params = new URLSearchParams(window.location.search);
    const paketParam = params.get("paket") === "ac";
    const odemeParam = params.get("odeme");
    if (paketParam || odemeParam) window.history.replaceState({}, "", "/");

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      // Oturum yok — sayfayı göster, içerik üretiminde auth popup açılır
      if (odemeParam === "hata") setHata("Ödeme tamamlanamadı. Tekrar deneyin.");
      return;
    }

    if (odemeParam === "hata") setHata("Ödeme tamamlanamadı. Tekrar deneyin.");

    const anonim = user.is_anonymous ?? false;
    const { data: profil } = await supabase.from("profiles").select("email, kredi, is_admin, ton, marka_adi").eq("id", user.id).single();
    const { count } = await supabase.from("uretimler").select("*", { count: "exact", head: true }).eq("user_id", user.id);
    if (profil) {
      setKullanici({ id: user.id, email: profil.email ?? null, kredi: profil.kredi, toplam_kullanilan: count || 0, is_admin: profil.is_admin || false, anonim, ton: profil.ton ?? undefined, marka_adi: profil.marka_adi ?? undefined });
      if (!anonim) analytics.identify(user.id, { email: profil.email ?? '', total_generations: count || 0 });
    } else if (anonim) {
      await supabase.from("profiles").insert({ id: user.id, kredi: 3 });
      setKullanici({ id: user.id, email: null, kredi: 3, toplam_kullanilan: 0, is_admin: false, anonim: true });
    }
    gecmisiYukle(user.id);

    if (paketParam) {
      if (anonim) {
        setAuthSonraAksiyon("paket");
        setAuthPopupMod("kayit");
        setAuthPopupAcik(true);
      } else {
        const { data: fatProfil } = await supabase.from("profiles").select("ad_soyad, fatura_tipi, tc_kimlik, vergi_no").eq("id", user.id).single();
        const eksik = !fatProfil?.ad_soyad || (fatProfil?.fatura_tipi === "bireysel" && !fatProfil?.tc_kimlik) || (fatProfil?.fatura_tipi === "kurumsal" && !fatProfil?.vergi_no);
        if (eksik) { setHata("Ödeme yapabilmek için önce profil sayfasından fatura bilgilerinizi doldurun."); setTimeout(() => router.push("/profil"), 2500); }
        else { setPaketModalAcik(true); }
      }
    }
  };

  useEffect(() => {
    kullaniciyiKontrolEt();
    return () => { kameraKapat(); if (mesajInterval.current) clearInterval(mesajInterval.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sekme değişince Metin'deki bilgiyi diğer sekmelere taşı
  useEffect(() => {
    if (anaSekme === "sosyal" && !sosyalUrunAdi && urunAdi) {
      setSosyalUrunAdi(urunAdi);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anaSekme]);

  const gecmisiYukle = async (userId: string) => {
    const { data } = await supabase.from("uretimler").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(10);
    if (data) setGecmis(data);
  };

  const cikisYap = async () => { await supabase.auth.signOut(); router.push("/auth"); };

  const fotoSec = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dosyalar = Array.from(e.target.files || []);
    dosyalar.slice(0, 3 - fotolar.length).forEach((dosya) => {
      const reader = new FileReader();
      reader.onload = () => setFotolar((prev) => (prev.length >= 3 ? prev : [...prev, reader.result as string]));
      reader.readAsDataURL(dosya);
    });
    e.target.value = "";
  };

  const fotoKaldir = (index: number) => { setFotolar((prev) => prev.filter((_, i) => i !== index)); setGorselSonuclar([]); };

  // Fotoğraf boyutlandır — API'ye göndermeden önce
  const resizeFoto = (base64: string, maxSize = 1024): Promise<string> =>
    new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let w = img.width, h = img.height;
        if (w > maxSize || h > maxSize) { if (w > h) { h = Math.round(h * maxSize / w); w = maxSize; } else { w = Math.round(w * maxSize / h); h = maxSize; } }
        canvas.width = w; canvas.height = h;
        canvas.getContext("2d")?.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.src = base64;
    });

  // Tek fotoğraf seç — görsel/video/sosyal sekmeleri için (mevcut fotoğrafın üzerine yazar)
  const tekFotoSec = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dosya = e.target.files?.[0];
    if (!dosya) return;
    const reader = new FileReader();
    reader.onload = () => { setFotolar([reader.result as string]); setGorselSonuclar([]); };
    reader.readAsDataURL(dosya);
    e.target.value = "";
  };

  const barkodSorgula = async (kod: string) => {
    if (!kod || kod.length < 8 || sorguCalisiyor.current) return;
    sorguCalisiyor.current = true;
    setBarkodYukleniyor(true);
    setBarkodBilgi(null);
    try {
      const res = await fetch(`/api/barkod?kod=${kod}`);
      const data = await res.json();
      if (data.bulunamadi) { alert("Bu ürün veritabanında bulunamadı."); setGirisTipi("manuel"); setBarkod(""); }
      else if (data.isim) { setBarkodBilgi(data); setUrunAdi(data.isim); if (data.marka) setKategori(data.marka); if (data.aciklama) setOzellikler(data.aciklama); kameraKapat(); }
    } catch { alert("Barkod sorgulanırken hata oluştu."); }
    setBarkodYukleniyor(false);
    sorguCalisiyor.current = false;
  };

  const kameraAc = async () => {
    if (scannerBaslatildi.current) return;
    setKameraAcik(true);
    setTimeout(async () => {
      try {
        const { Html5Qrcode } = await import("html5-qrcode");
        const scanner = new Html5Qrcode("barkod-okuyucu");
        scannerRef.current = scanner;
        scannerBaslatildi.current = true;
        await scanner.start({ facingMode: "environment" }, { fps: 10, qrbox: { width: 250, height: 150 } },
          (decodedText: string) => { setBarkod(decodedText); barkodSorgula(decodedText); }, () => {});
      } catch (e) { console.log(e); alert("Kamera açılamadı."); setKameraAcik(false); scannerBaslatildi.current = false; }
    }, 300);
  };

  const kameraKapat = async () => {
    if (scannerRef.current && scannerBaslatildi.current) {
      try { const s = scannerRef.current as { stop: () => Promise<void>; clear: () => void }; await s.stop(); s.clear(); } catch (e) { console.log(e); }
      scannerRef.current = null;
      scannerBaslatildi.current = false;
    }
    setKameraAcik(false);
  };

  const uretButonAktif = !yukleniyor && ((girisTipi === "manuel" && urunAdi && kategori) || (girisTipi === "foto" && fotolar.length > 0) || (girisTipi === "barkod" && barkodBilgi !== null));

  const icerikUret = async () => {
    if (!kullanici || kullanici.anonim) { setAuthPopupMod("kayit"); setAuthPopupAcik(true); return; }
    if (!kullanici.is_admin && kullanici.kredi <= 0) { paketModalAc(); return; }
    if (!uretButonAktif) return;
    setYukleniyor(true);
    setSonuc("");
    setYukleniyorMesaj(0);
    analytics.generationStarted({ platform, type: 'metin' });
    mesajInterval.current = setInterval(() => setYukleniyorMesaj((prev) => (prev + 1) % yukleniyorMesajlari.length), 1800);
    try {
      const res = await fetch("/api/uret", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ urunAdi, kategori, ozellikler, platform, fotolar, girisTipi, barkodBilgi, userId: kullanici.id, dil: platformDil }) });
      const data = await res.json();
      if (mesajInterval.current) clearInterval(mesajInterval.current);
      if (res.status === 402) { analytics.creditExhausted(); paketModalAc(); setYukleniyor(false); return; }
      setSonuc(data.icerik);
      if (kullanici.is_admin) setKullanici({ ...kullanici, toplam_kullanilan: kullanici.toplam_kullanilan + 1 });
      else setKullanici({ ...kullanici, kredi: kullanici.kredi - 1, toplam_kullanilan: kullanici.toplam_kullanilan + 1 });
      analytics.generationCompleted({ platform, type: 'metin', credits_remaining: kullanici.kredi - 1 });
      invalidateCredits();
      gecmisiYukle(kullanici.id);
    } catch { if (mesajInterval.current) clearInterval(mesajInterval.current); analytics.generationFailed({ platform, type: 'metin', error: 'network' }); setHata("İçerik üretilemedi. Lütfen tekrar deneyin."); }
    setYukleniyor(false);
    setTimeout(() => document.getElementById("sonuc-alani")?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  };

  // Günlük indirme hakkı — localStorage'da tutulur, kullanıcıya gösterilmez
  const indirmeHakiKullan = (): boolean => {
    const gun = new Date().toISOString().split("T")[0];
    const key = `gih_${gun}`;
    const kullanilan = parseInt(localStorage.getItem(key) || "0", 10);
    if (kullanilan >= 3) return false; // hak tükendi
    localStorage.setItem(key, String(3)); // indirme yapıldı → kalan hak sıfırla
    return true;
  };

  const indirmeHakkiVarMi = (): boolean => {
    const gun = new Date().toISOString().split("T")[0];
    const kullanilan = parseInt(localStorage.getItem(`gih_${gun}`) || "0", 10);
    return kullanilan < 3;
  };

  const indirmeHakiSifirla = () => {
    const gun = new Date().toISOString().split("T")[0];
    localStorage.setItem(`gih_${gun}`, "0");
  };

  const krediOnayla = async () => {
    if (!kullanici) return;
    // 1 kredi düş — 3 yeni indirme hakkı açılır
    await fetch("/api/gorsel", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId: kullanici.id, action: "indir", stil: "unlock" }) });
    setKullanici((k) => k ? { ...k, kredi: Math.max(0, k.kredi - 1) } : k);
    invalidateCredits();
    indirmeHakiSifirla();
    setKrediOnayAcik(false);
    if (krediOnayIslem) { await krediOnayIslem(); setKrediOnayIslem(null); }
  };

  const gorselUret = async () => {
    if (!kullanici || kullanici.anonim) { setAuthPopupMod("kayit"); setAuthPopupAcik(true); return; }
    if (fotolar.length === 0) { alert("Önce bir ürün fotoğrafı ekleyin."); return; }
    if (seciliStiller.length === 0) { alert("En az bir stil seçin."); return; }
    if (!kullanici.is_admin && kullanici.kredi < seciliStiller.length) { paketModalAc(); return; }
    setGorselYukleniyor(true);
    setGorselSonuclar([]);
    try {
      const resizedFoto = await resizeFoto(fotolar[0]);
      const res = await fetch("/api/gorsel", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ foto: resizedFoto, ekPrompt: gorselEkPrompt, stiller: seciliStiller, userId: kullanici?.id }) });
      const data = await res.json();
      if (data.sonuclar) setGorselSonuclar(data.sonuclar);
      else setHata("Görsel üretilemedi. Tekrar deneyin.");
    } catch { setHata("Bir hata oluştu. Lütfen tekrar deneyin."); }
    setGorselYukleniyor(false);
  };

  const videoUret = async () => {
    if (!kullanici || kullanici.anonim) { setAuthPopupMod("kayit"); setAuthPopupAcik(true); return; }
    if (!fotolar[0]) { alert("Önce bir ürün fotoğrafı ekleyin."); return; }
    const videoKredi = videoSure === "10" ? 8 : 5;
    if (!kullanici.is_admin && kullanici.kredi < videoKredi) { paketModalAc(); return; }
    setVideoYukleniyor(true);
    setVideoUrl(null);
    try {
      const res = await fetch("/api/sosyal/video", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ foto: fotolar[0], prompt: videoPrompt, userId: kullanici.id, sure: videoSure, format: videoFormat }) });
      const data = await res.json();
      if (data.videoUrl) { setVideoUrl(data.videoUrl); if (!kullanici.is_admin) { setKullanici({ ...kullanici, kredi: kullanici.kredi - (data.kullanilanKredi ?? videoKredi) }); invalidateCredits(); } }
      else setHata("Video üretilemedi. Tekrar deneyin.");
    } catch { setHata("Bir hata oluştu. Lütfen tekrar deneyin."); }
    setVideoYukleniyor(false);
  };

  const captionUret = async () => {
    if (!kullanici || kullanici.anonim) { setAuthPopupMod("kayit"); setAuthPopupAcik(true); return; }
    if (!sosyalUrunAdi.trim()) return;
    if (!kullanici.is_admin && kullanici.kredi <= 0) { paketModalAc(); return; }
    setCaptionYukleniyor(true);
    setSosyalCaption("");
    setSosyalHashtag("");
    try {
      const res = await fetch("/api/sosyal", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ urunAdi: sosyalUrunAdi, ekBilgi: sosyalEkBilgi, platform: sosyalPlatform, ton: sosyalTon, userId: kullanici.id, sezon: sosyalSezon }) });
      const data = await res.json();
      if (data.caption) setSosyalCaption(data.caption);
      if (data.hashtag) setSosyalHashtag(data.hashtag);
      if (!kullanici.is_admin) { setKullanici({ ...kullanici, kredi: kullanici.kredi - 1 }); invalidateCredits(); }
    } catch { setHata("Paylaşım metni üretilemedi. Tekrar deneyin."); }
    setCaptionYukleniyor(false);
  };

  const sosyalGorselUret = async () => {
    if (!kullanici || kullanici.anonim) { setAuthPopupMod("kayit"); setAuthPopupAcik(true); return; }
    if (!fotolar[0]) { alert("Önce ürün fotoğrafı yükle."); return; }
    if (!kullanici.is_admin && kullanici.kredi <= 0) { paketModalAc(); return; }
    setSosyalGorselYukleniyor(true);
    setSosyalGorselSonuclar([]);
    try {
      const resizedFoto = await resizeFoto(fotolar[0]);
      const res = await fetch("/api/gorsel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ foto: resizedFoto, stiller: [sosyalGorselStil], sosyalFormat: sosyalGorselFormat, userId: kullanici.id }),
      });
      const data = await res.json();
      const gorseller: string[] = data.sonuclar?.[0]?.gorseller || [];
      if (gorseller.length > 0) {
        setSosyalGorselSonuclar(gorseller);
        // Kredi düş: üretimde 1 kredi (görsel sekmesinin indir mantığı yerine)
        if (!kullanici.is_admin) {
          await fetch("/api/gorsel", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId: kullanici.id, action: "indir", stilSayisi: 1 }) });
          setKullanici((k) => k ? { ...k, kredi: Math.max(0, k.kredi - 1) } : k);
        }
      } else {
        setHata("Görsel üretilemedi. Tekrar deneyin.");
      }
    } catch { setHata("Bir hata oluştu. Lütfen tekrar deneyin."); }
    setSosyalGorselYukleniyor(false);
  };

  const kitUret = async () => {
    if (!kullanici || kullanici.anonim) { setAuthPopupMod("kayit"); setAuthPopupAcik(true); return; }
    if (!sosyalUrunAdi.trim()) { alert("Ürün adı gerekli."); return; }
    const krediGereken = fotolar[0] ? 5 : 4;
    if (!kullanici.is_admin && kullanici.kredi < krediGereken) { paketModalAc(); return; }
    setKitYukleniyor(true);
    setKitSonuc(null);
    try {
      const foto = fotolar[0] ? await resizeFoto(fotolar[0]) : null;
      const res = await fetch("/api/sosyal/kit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          urunAdi: sosyalUrunAdi,
          ekBilgi: sosyalEkBilgi,
          ton: sosyalTon,
          userId: kullanici.id,
          foto,
          gorselFormat: kitGorselFormat,
          gorselStil: kitGorselStil,
          sezon: sosyalSezon,
        }),
      });
      const data = await res.json();
      if (data.hata) { setHata(data.hata); }
      else {
        setKitSonuc({ captions: data.captions, gorselUrls: data.gorselUrls || [] });
        if (!kullanici.is_admin) {
          setKullanici((k) => k ? { ...k, kredi: Math.max(0, k.kredi - (data.kullanilanKredi || krediGereken)) } : k);
          invalidateCredits();
        }
      }
    } catch { setHata("Kit üretilemedi. Lütfen tekrar deneyin."); }
    setKitYukleniyor(false);
  };

  return (
    <main className="min-h-screen bg-gray-50 pt-8 pb-24 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-6 gap-2">
          <Link href="/auth" className="flex-shrink-0">
            <img src="/yzliste_logo.png" alt="yzliste" className="h-9" />
          </Link>
          <nav className="hidden sm:flex items-center gap-0.5 text-sm text-gray-500 flex-1">
            <Link href="/auth" className="px-3 py-2 rounded-lg hover:bg-gray-100 hover:text-gray-800 transition-colors whitespace-nowrap">Ana Sayfa</Link>
            <Link href="/" className="px-3 py-2 rounded-lg text-orange-600 font-medium whitespace-nowrap">İçerik</Link>
            <Link href="/fiyatlar" className="px-3 py-2 rounded-lg hover:bg-gray-100 hover:text-gray-800 transition-colors whitespace-nowrap">Fiyatlar</Link>
            <Link href="/blog" className="px-3 py-2 rounded-lg hover:bg-gray-100 hover:text-gray-800 transition-colors whitespace-nowrap">Blog</Link>
          </nav>
          {kullanici && !kullanici.anonim ? (
            <div className="flex items-center gap-3 flex-shrink-0">
              <button onClick={() => paketModalAc()} className={`flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-full transition-colors ${kullanici.is_admin ? "bg-purple-100 text-purple-700" : krediDusuk ? "bg-red-100 text-red-600 animate-pulse" : "bg-orange-100 text-orange-600 hover:bg-orange-200"}`}>
                {kullanici.is_admin ? "∞" : kullanici.kredi} kredi
              </button>
              <span className="text-sm text-gray-400 hidden sm:block">{kullanici.email}</span>
              {kullanici.is_admin && <a href="/admin" className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-lg font-medium">Admin</a>}
              <a href="/profil" className="text-sm text-gray-400 hover:text-gray-600">Profil</a>
              <button onClick={cikisYap} className="text-sm text-gray-400 hover:text-gray-600">Çıkış</button>
            </div>
          ) : (
            <div className="flex gap-1 sm:gap-2 flex-shrink-0">
              <button onClick={() => { setAuthPopupMod("giris"); setAuthPopupAcik(true); }} className="text-xs sm:text-sm text-gray-500 hover:text-gray-800 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap">Giriş Yap</button>
              <button onClick={() => { setAuthPopupMod("kayit"); setAuthPopupAcik(true); }} className="text-xs sm:text-sm bg-orange-500 text-white px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-orange-600 transition-colors font-medium whitespace-nowrap">Ücretsiz Başla</button>
            </div>
          )}
        </div>

        {/* Giriş yok / anonim banner */}
        {(!kullanici || kullanici.anonim) && (
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 mb-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xl flex-shrink-0">🔒</span>
              <div>
                <p className="text-sm font-semibold text-orange-800">İçerik üretmek için hesap gereklidir</p>
                <p className="text-xs text-orange-600 mt-0.5">Ücretsiz hesap oluşturun, 3 kredi hediye edilsin — kredi kartı gerekmez.</p>
              </div>
            </div>
            <button onClick={() => { setAuthPopupMod("kayit"); setAuthPopupAcik(true); }} className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold px-4 py-2 rounded-xl whitespace-nowrap transition-colors flex-shrink-0">
              Hesap Oluştur
            </button>
          </div>
        )}

        {/* Profil eksik banner */}
        {kullanici && !kullanici.anonim && !kullanici.marka_adi && !profilBannerKapatildi && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xl flex-shrink-0">💡</span>
              <div>
                <p className="text-sm font-semibold text-blue-800">Marka profilinizi doldurun</p>
                <p className="text-xs text-blue-600 mt-0.5">Marka adı, hedef kitle ve ton bilgileri girilince AI metinleri ve görseller çok daha kaliteli sonuç verir.</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <a href="/profil" className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-xl whitespace-nowrap transition-colors">Profili Düzenle</a>
              <button onClick={() => setProfilBannerKapatildi(true)} className="text-blue-400 hover:text-blue-600 text-xl leading-none">×</button>
            </div>
          </div>
        )}

        {/* Kredi düşük banner */}
        {krediDusuk && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xl">⚠️</span>
              <div>
                <p className="text-sm font-semibold text-red-800">İçerik üretim krediniz azalıyor</p>
                <p className="text-xs text-red-600 mt-0.5">{kullanici?.kredi} kredi kaldı — tükenince içerik üretemezsiniz.</p>
              </div>
            </div>
            <button onClick={() => paketModalAc()} className="bg-red-500 hover:bg-red-600 text-white text-xs font-semibold px-4 py-2 rounded-xl whitespace-nowrap flex-shrink-0">Kredi Yükle</button>
          </div>
        )}

        {/* Hata banner */}
        {hata && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xl flex-shrink-0">⚠️</span>
              <p className="text-sm text-red-700">{hata}</p>
            </div>
            <button onClick={() => setHata(null)} className="text-red-400 hover:text-red-600 text-xl flex-shrink-0">×</button>
          </div>
        )}

        <div className="flex gap-6 items-start flex-col lg:flex-row">
          <div className="flex-1 w-full">

            {/* SEKMELER */}
            <div className="bg-white rounded-2xl shadow p-1.5 flex gap-1">
              {([
                { id: "metin", label: "📝 Metin", renk: "bg-orange-500", aktif: true },
                { id: "gorsel", label: "📷 Görsel", renk: "bg-purple-500", aktif: true },
                { id: "video", label: "🎬 Video", renk: "bg-red-500", aktif: false },
                { id: "sosyal", label: "📱 Sosyal Medya", renk: "bg-pink-500", aktif: false },
              ] as { id: AnaSekme; label: string; renk: string; aktif: boolean }[]).map((s) => (
                <button key={s.id}
                  onClick={() => { if (s.aktif) { setAnaSekme(s.id); window.scrollTo({ top: 0, behavior: "smooth" }); } }}
                  disabled={!s.aktif}
                  className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    !s.aktif ? "text-gray-300 cursor-not-allowed" :
                    anaSekme === s.id ? `${s.renk} text-white shadow-sm` : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }`}>
                  <span>{s.label}</span>
                  {!s.aktif && <span className="block text-xs font-normal opacity-70">yakında</span>}
                </button>
              ))}
            </div>

            {/* PAYLAŞILAN ÜRÜN FOTOĞRAFI — tüm sekmelerde geçerli */}
            <div className="mt-3 bg-white rounded-2xl shadow p-4">
              {fotolar[0] ? (
                <div className="flex items-center gap-3">
                  <img src={fotolar[0]} alt="ürün" className="w-14 h-14 rounded-xl object-cover border border-gray-100 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-700">Ürün Fotoğrafı</p>
                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                      {[
                        { id: "metin", label: "📝 Metin", renk: "bg-orange-100 text-orange-600" },
                        { id: "gorsel", label: "📷 Görsel", renk: "bg-purple-100 text-purple-600" },
                        { id: "video", label: "🎬 Video", renk: "bg-red-100 text-red-600" },
                        { id: "sosyal", label: "📱 Sosyal", renk: "bg-pink-100 text-pink-600" },
                      ].map((s) => (
                        <span key={s.id} className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${s.renk}`}>{s.label}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                    <label className="text-xs text-blue-500 hover:text-blue-700 cursor-pointer font-medium">
                      Değiştir
                      <input type="file" accept="image/*" className="hidden" onChange={tekFotoSec} />
                    </label>
                    <button onClick={() => { setFotolar([]); setGorselSonuclar([]); }} className="text-xs text-gray-400 hover:text-red-500 transition-colors">Kaldır</button>
                  </div>
                </div>
              ) : (
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="w-14 h-14 rounded-xl border-2 border-dashed border-gray-200 group-hover:border-orange-300 flex items-center justify-center transition-colors flex-shrink-0">
                    <span className="text-xl">📷</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 group-hover:text-orange-600 transition-colors">Ürün fotoğrafı yükle</p>
                    <p className="text-xs text-gray-400 mt-0.5">Metin, Görsel, Video ve Sosyal sekmelerin hepsinde kullanılır</p>
                  </div>
                  <span className="text-xs text-gray-400 group-hover:text-orange-500 transition-colors flex-shrink-0">Seç →</span>
                  <input type="file" accept="image/*" className="hidden" onChange={tekFotoSec} />
                </label>
              )}
            </div>

            {/* ===== METİN SEKMESİ ===== */}
            <div style={{display: anaSekme === "metin" ? "block" : "none"}} className="mt-4 bg-white rounded-2xl shadow p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-gray-800">📋 Listing İçeriği Üret</h2>
                <span className="text-xs text-orange-500 font-medium">1 içerik üretim kredisi</span>
              </div>

              {/* Giriş tipi */}
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Ürünü nasıl eklemek istersin?</p>
                <p className="text-xs text-gray-400 mb-2">İster yazarak, ister ürünün fotoğrafını çekerek, ister barkodunu taratarak, istersen Excel ile toplu yükleyerek içerik üretebilirsin.</p>
                <div className="grid grid-cols-4 gap-2">
                    {(["manuel", "foto", "barkod"] as const).map((tip) => (
                    <button key={tip} onClick={() => setGirisTipi(tip)}
                      className={`py-2 px-2 rounded-xl border-2 text-xs font-semibold transition-all ${girisTipi === tip ? "border-orange-400 bg-orange-50 text-orange-600" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}>
                      {tip === "manuel" ? "✏️ Manuel" : tip === "foto" ? "📷 Fotoğraf" : "🔍 Barkod"}
                      {tip === "barkod" && <span className="block text-gray-400 font-normal text-[10px]">yakında</span>}
                    </button>
                  ))}
                  <a href="/toplu"
                    className="py-2 px-2 rounded-xl border-2 text-xs font-semibold transition-all border-gray-200 text-gray-500 hover:border-orange-300 hover:text-orange-600 hover:bg-orange-50 text-center">
                    📊 Excel
                  </a>
                </div>
              </div>

              {/* Platform */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
                <select value={platform} onChange={(e) => { setPlatform(e.target.value); setDil(PLATFORM_BILGI[e.target.value]?.dil || "tr"); }} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400">
                  <optgroup label="🇹🇷 Türk Pazaryerleri">
                    <option value="trendyol">Trendyol</option>
                    <option value="hepsiburada">Hepsiburada</option>
                    <option value="amazon">Amazon TR</option>
                    <option value="n11">N11</option>
                  </optgroup>
                  <optgroup label="🌍 Yabancı Pazaryerleri (İngilizce)">
                    <option value="etsy">Etsy</option>
                    <option value="amazon_usa">Amazon USA</option>
                  </optgroup>
                </select>
                <div className={`mt-2 flex flex-wrap gap-2 text-xs px-3 py-2 rounded-lg border ${platformBilgi.renk}`}>
                  <span>📌 Başlık max {platformBilgi.baslikLimit} karakter</span>
                  <span>·</span>
                  {platformBilgi.ozellikSayisi > 0 && <span>🔹 {platformBilgi.ozellikSayisi} özellik maddesi</span>}
                  {platformBilgi.ozellikSayisi > 0 && platformBilgi.etiketSayisi > 0 && <span>·</span>}
                  {platformBilgi.etiketSayisi > 0 && <span>🏷️ {platformBilgi.etiketSayisi} etiket</span>}
                  <span>·</span>
                  <span>{platformBilgi.aciklama}</span>
                  <span>·</span>
                  <span>{platformDil === "en" ? "🇬🇧 English output" : "🇹🇷 Türkçe çıktı"}</span>
                </div>
              </div>

              {/* Manuel */}
              {girisTipi === "manuel" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ürün Adı <span className="text-red-400">*</span></label>
                    <input type="text" value={urunAdi} onChange={(e) => setUrunAdi(e.target.value)} placeholder={platformPh.urun} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kategori <span className="text-red-400">*</span></label>
                    <input type="text" value={kategori} onChange={(e) => setKategori(e.target.value)} placeholder={platformPh.kategori} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ek Bilgi <span className="text-gray-400 font-normal">(isteğe bağlı)</span></label>
                    <textarea value={ozellikler} onChange={(e) => setOzellikler(e.target.value)} placeholder={platformPh.ozellik} rows={3} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
                    <p className="text-xs text-gray-400 mt-1">💡 Renk, beden, malzeme, garanti, kutu içeriği, güvenlik bilgisi — ne kadar çok bilgi girersen içerik o kadar spesifik olur; az bilgide sonuç genel kalabilir</p>
                  </div>
                </>
              )}

              {/* Fotoğraf */}
              {girisTipi === "foto" && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kategori <span className="text-gray-400 font-normal">(isteğe bağlı)</span></label>
                    <input type="text" value={kategori} onChange={(e) => setKategori(e.target.value)} placeholder="örn: Ayakkabı & Çanta / Erkek Bot" className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ürün Fotoğrafı</label>
                    {fotolar.length === 0 ? (
                      <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-4 text-center text-xs text-gray-400">
                        Yukarıdan ürün fotoğrafı yükle ↑
                      </div>
                    ) : (
                      <FotoThumbnail src={fotolar[0]} onKaldir={() => fotoKaldir(0)} renk="green" />
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ek Bilgi <span className="text-gray-400 font-normal">(isteğe bağlı)</span></label>
                    <textarea value={ozellikler} onChange={(e) => setOzellikler(e.target.value)} placeholder="örn: kışlık, su geçirmez, 42 numara, garanti belgeli" rows={2} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
                  </div>
                </div>
              )}

              {/* Barkod */}
              {girisTipi === "barkod" && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-center space-y-2">
                  <div className="text-3xl">🔍</div>
                  <p className="text-sm font-semibold text-amber-700">Barkod ile Tanıma — Yakında</p>
                  <p className="text-xs text-amber-600">Bu özellik çok yakında aktif olacak. Manuel ya da fotoğraf seçeneğini kullanabilirsiniz.</p>
                </div>
              )}

              {/* Üret butonu */}
              <button onClick={icerikUret} disabled={!uretButonAktif} className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white font-semibold py-3 rounded-xl transition-colors">
                {yukleniyor ? `⏳ ${yukleniyorMesajlari[yukleniyorMesaj]}` : `İçerik Üret — ${kullanici?.is_admin ? "∞" : "1"} kredi`}
              </button>

              <p className="text-xs text-gray-400 text-center">⚠️ AI hata yapabilir — üretilen içeriği yayınlamadan önce kontrol edin</p>

              {!yukleniyor && !kullanici?.is_admin && (kullanici?.kredi ?? 0) <= 0 && (
                <p className="text-center text-xs text-red-500">İçerik üretim krediniz bitti. <button onClick={() => paketModalAc()} className="underline font-medium">Kredi satın al →</button></p>
              )}

              {yukleniyor && (
                <div className="bg-white rounded-2xl shadow p-8 text-center space-y-4">
                  <div className="flex justify-center"><div className="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" /></div>
                  <p className="text-gray-600 font-medium animate-pulse">{yukleniyorMesajlari[yukleniyorMesaj]}</p>
                  <p className="text-gray-400 text-sm">Bu birkaç saniye sürebilir...</p>
                </div>
              )}

              {sonuc && !yukleniyor && (
                <div id="sonuc-alani" className="space-y-3">
                  <div className="flex justify-between items-center px-1">
                    <h2 className="text-base font-semibold text-gray-800">✅ Üretilen İçerik</h2>
                    <button onClick={() => docxIndir(sonucBolumleri, urunAdi || "listing")} className="flex items-center gap-1.5 text-xs bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium px-3 py-1.5 rounded-lg transition-colors border border-blue-200">
                      📄 Word İndir
                    </button>
                  </div>
                  {sonucBolumleri.map((bolum, i) => {
                    const ref = { current: null as HTMLDivElement | null };
                    return (
                      <div key={i} className="bg-white rounded-2xl shadow p-5">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-sm font-semibold text-gray-700">{bolum.ikon} {bolum.baslik}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-300 hidden sm:block">✎ düzenlenebilir</span>
                            <KopyalaButon metin={bolum.icerik} getDuzenlenmisMevin={() => ref.current?.innerText || bolum.icerik} />
                          </div>
                        </div>
                        <div ref={ref} contentEditable suppressContentEditableWarning
                          onFocus={(e) => { e.currentTarget.style.outline = "2px solid #f97316"; e.currentTarget.style.borderRadius = "8px"; e.currentTarget.style.padding = "8px"; }}
                          onBlur={(e) => { e.currentTarget.style.outline = "none"; e.currentTarget.style.padding = "0"; }}
                          className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed font-sans cursor-text">
                          {bolum.icerik}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ===== GÖRSEL SEKMESİ ===== */}
            <div style={{display: anaSekme === "gorsel" ? "block" : "none"}} className="mt-4 bg-white rounded-2xl shadow p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-gray-800">🖼️ Ürün Görseli Üret</h2>
                <span className="text-xs text-orange-500 font-medium">Stil başına 1 kredi · Her stilden 4 varyasyon</span>
              </div>

              {/* Metin sekmesinden taşınan ürün adı */}
              {urunAdi && (
                <div className="flex items-center gap-2 bg-orange-50 rounded-xl px-3 py-2 border border-orange-100">
                  <span className="text-xs text-orange-600">📝 Metin sekmesinden: <strong>{urunAdi}</strong>{kategori ? ` · ${kategori}` : ""}</span>
                </div>
              )}

              {/* Profil eksik uyarısı */}
              {kullanici && !kullanici.anonim && !kullanici.marka_adi && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 flex items-center justify-between gap-3">
                  <p className="text-xs text-yellow-700">💡 <span className="font-semibold">Marka profili eksik</span> — Ton bilgisi girilince görsel stili markanla uyumlu hale getirilir.</p>
                  <a href="/profil" className="text-xs text-yellow-700 font-semibold underline whitespace-nowrap">Profili doldur →</a>
                </div>
              )}

              <p className="text-xs text-gray-600">
                Tek fotoğraftan 3 farklı stüdyo görseli. Her stilden 4 varyasyon üretilir — inceleme ücretsiz, indirince kredi düşer.{" "}
                <span className="text-xs text-gray-400">  <br /> Örnek: 1 stil seçersen → 4 görsel, 1 kredi <br />2 stil seçersen → 8 görsel, 2 kredi</span>
              </p>

              {fotolar.length === 0 ? (
                <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-4 text-center text-xs text-gray-400">
                  Yukarıdan ürün fotoğrafı yükle ↑
                </div>
              ) : (
                <FotoThumbnail src={fotolar[0]} onKaldir={() => fotoKaldir(0)} renk="green" />
              )}
              <p className="text-xs text-gray-400">
                📸 En iyi sonuç için nasıl fotoğraf çekilmeli?{" "}
                <a href="/blog/ai-gorsel-uretimi-e-ticaret" target="_blank" className="text-purple-500 hover:underline font-medium">
                  Rehberi oku →
                </a>
              </p>

              <div>
                <p className="block text-xs font-medium text-gray-600 mb-2">Stil seç <span className="text-gray-400 font-normal">(birden fazla seçebilirsin — indirirsen her biri için 1 kredi)</span></p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {([
                    { id: "beyaz", label: "⬜ Beyaz Zemin", aciklama: "Trendyol standart", img: "/ornek_beyaz.jpg" },
                    { id: "koyu", label: "⬛ Koyu Zemin", aciklama: "Premium / elektronik", img: "/ornek_koyu.jpg" },
                    { id: "lifestyle", label: "🏠 Lifestyle", aciklama: "Gerçek ortam", img: "/ornek_lifestyle.jpg" },
                    { id: "ozel", label: "✏️ Kendi Sahneni", aciklama: "Prompt yaz", img: null },
                  ] as const).map((s) => (
                    <button key={s.id} onClick={() => setSeciliStiller((prev) => prev.includes(s.id) ? prev.filter((x) => x !== s.id) : [...prev, s.id])}
                      className={`flex flex-col rounded-xl overflow-hidden border-2 transition-all text-left ${seciliStiller.includes(s.id) ? "border-purple-500 shadow-md" : "border-gray-200 hover:border-purple-300"}`}>
                      {s.img ? (
                        <div className="aspect-video w-full overflow-hidden relative">
                          <img src={s.img} alt={s.label} className="w-full h-full object-cover" />
                          {seciliStiller.includes(s.id) && <div className="absolute inset-0 bg-purple-500/20 flex items-center justify-center"><span className="bg-purple-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">✓</span></div>}
                        </div>
                      ) : (
                        <div className={`aspect-video w-full flex items-center justify-center text-2xl ${seciliStiller.includes(s.id) ? "bg-purple-100" : "bg-gray-50"}`}>✏️</div>
                      )}
                      <div className="p-2 bg-white w-full">
                        <p className={`text-xs font-semibold ${seciliStiller.includes(s.id) ? "text-purple-600" : "text-gray-700"}`}>{s.label}</p>
                        <p className="text-xs text-gray-400">{s.aciklama}</p>
                      </div>
                    </button>
                  ))}
                </div>
                {seciliStiller.length > 0 && (
                  <p className="text-xs text-purple-600 font-medium mt-2 text-center">{seciliStiller.length} stil → {seciliStiller.length * 4} görsel · {seciliStiller.length} kredi</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Görsel yönlendirmesi <span className="text-gray-400 font-normal">(isteğe bağlı — Türkçe veya İngilizce)</span></label>
                <textarea value={gorselEkPrompt} onChange={(e) => setGorselEkPrompt(e.target.value)} placeholder="örn: ahşap masada, deniz kıyısında, sonbahar tonları, minimalist..." rows={2} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" />
              </div>

              <button onClick={gorselUret} disabled={gorselYukleniyor || seciliStiller.length === 0 || fotolar.length === 0}
                className="w-full bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 text-white font-semibold py-3 rounded-xl transition-colors">
                {gorselYukleniyor ? `⏳ ${seciliStiller.length * 4} görsel üretiliyor...` : fotolar.length === 0 ? "Önce fotoğraf ekle ↑" : seciliStiller.length === 0 ? "Bir stil seç" : `✨ ${seciliStiller.length * 4} Görsel Üret — ${seciliStiller.length} kredi`}
              </button>

              <p className="text-xs text-gray-400 text-center">⚠️ AI hata yapabilir — üretilen görselleri yayınlamadan önce kontrol edin</p>

              {gorselSonuclar.length > 0 && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between px-1">
                    <p className="text-xs text-gray-500 font-medium">✅ {gorselSonuclar.reduce((t, s) => t + s.gorseller.length, 0)} görsel hazır — inceleme ücretsiz</p>
                    <button
                      onClick={async () => {
                        const zipIslem = async () => {
                          const JSZip = (await import("jszip")).default;
                          const { saveAs } = await import("file-saver");
                          const zip = new JSZip();
                          const folder = zip.folder("yzliste-gorseller");
                          let sayac = 0;
                          for (const stil of gorselSonuclar) {
                            for (let i = 0; i < stil.gorseller.length; i++) {
                              const url = stil.gorseller[i];
                              try {
                                const res = await fetch(url);
                                const blob = await res.blob();
                                folder?.file(`${stil.stil}-${i + 1}.jpg`, blob);
                                sayac++;
                              } catch (e) { console.error("ZIP indirme hatası:", e); }
                            }
                          }
                          if (sayac > 0) {
                            const zipBlob = await zip.generateAsync({ type: "blob" });
                            saveAs(zipBlob, "yzliste-gorseller.zip");
                            indirmeHakiKullan();
                            if (kullanici && !kullanici.is_admin) {
                              const stilSayisi = gorselSonuclar.length;
                              await fetch("/api/gorsel", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId: kullanici.id, action: "indir", stilSayisi }) });
                              setKullanici((k) => k ? { ...k, kredi: Math.max(0, k.kredi - stilSayisi) } : k);
                            }
                          }
                        };
                        if (!indirmeHakkiVarMi()) {
                          if (kullanici?.anonim) { setGorselUyariAcik(true); }
                          else { setKrediOnayIslem(() => zipIslem); setKrediOnayAcik(true); }
                          return;
                        }
                        await zipIslem();
                      }}
                      className="flex items-center gap-1.5 text-xs bg-purple-500 hover:bg-purple-600 text-white font-semibold px-3 py-1.5 rounded-lg transition-colors"
                    >
                      📦 Tümünü ZIP İndir — {gorselSonuclar.length} kredi
                    </button>
                  </div>
                  {gorselSonuclar.map((stil) => (
                    <div key={stil.stil} className="space-y-2">
                      <p className="text-xs font-semibold text-gray-600 px-1">{stil.label}</p>
                      <div className="grid grid-cols-2 gap-2">
                        {stil.gorseller.map((url, i) => (
                          <div key={i} className="relative group rounded-xl overflow-hidden border border-gray-200">
                            <img
                              src={url}
                              alt={`${stil.label} ${i + 1}`}
                              className="w-full aspect-square object-cover select-none"
                              draggable={false}
                              onContextMenu={(e) => e.preventDefault()}
                            />
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ===== VIDEO SEKMESİ ===== */}
            <div style={{display: anaSekme === "video" ? "block" : "none"}} className="mt-4 bg-white rounded-2xl shadow p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-gray-800">🎬 Ürün Videosu Üret</h2>
                <span className="text-xs text-red-500 font-medium">{videoSure === "10" ? "8" : "5"} içerik üretim kredisi</span>
              </div>

              {/* Metin sekmesinden taşınan ürün adı */}
              {urunAdi && (
                <div className="flex items-center gap-2 bg-red-50 rounded-xl px-3 py-2 border border-red-100">
                  <span className="text-xs text-red-600">📝 Metin sekmesinden: <strong>{urunAdi}</strong>{kategori ? ` · ${kategori}` : ""}</span>
                </div>
              )}

              {/* Profil eksik uyarısı */}
              {kullanici && !kullanici.anonim && !kullanici.marka_adi && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 flex items-center justify-between gap-3">
                  <p className="text-xs text-yellow-700">💡 <span className="font-semibold">Marka profili eksik</span> — Ton ve marka bilgisi girilince video prompt otomatik kişiselleştirilir.</p>
                  <a href="/profil" className="text-xs text-yellow-700 font-semibold underline whitespace-nowrap">Profili doldur →</a>
                </div>
              )}

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
                <span className="text-amber-500 flex-shrink-0 mt-0.5">⚡</span>
                <div>
                  <p className="text-xs font-semibold text-amber-700">{videoSure === "10" ? "8" : "5"} içerik üretim kredisi — üretilince kredi düşer</p>
                  <p className="text-xs text-amber-600 mt-0.5">Video AI işlem gücü gerektiriyor. Üretim ~2 dakika sürer.</p>
                </div>
              </div>

              {!fotolar[0] ? (
                <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-4 text-center text-xs text-gray-400">
                  Yukarıdan ürün fotoğrafı yükle ↑
                </div>
              ) : (
                <FotoThumbnail src={fotolar[0]} onKaldir={() => { setFotolar([]); setGorselSonuclar([]); }} renk="green" />
              )}

              {/* Format ve süre seçimi */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Format</label>
                  <div className="flex gap-1.5">
                    {(["9:16", "16:9", "1:1"] as const).map((f) => (
                      <button key={f} onClick={() => setVideoFormat(f)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-all ${videoFormat === f ? "bg-red-500 text-white border-red-500" : "bg-white text-gray-600 border-gray-200 hover:border-red-300"}`}>
                        {f === "9:16" ? "9:16 Reels" : f === "16:9" ? "16:9 Yatay" : "1:1 Kare"}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Süre</label>
                  <div className="flex gap-1.5">
                    {(["5", "10"] as const).map((s) => (
                      <button key={s} onClick={() => setVideoSure(s)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-all ${videoSure === s ? "bg-red-500 text-white border-red-500" : "bg-white text-gray-600 border-gray-200 hover:border-red-300"}`}>
                        {s === "5" ? "5 sn · 5 kredi" : "10 sn · 8 kredi"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Hareket & sahne tarifi <span className="text-gray-400 font-normal">(isteğe bağlı — Türkçe yazabilirsin)</span></label>
                <textarea value={videoPrompt} onChange={(e) => setVideoPrompt(e.target.value)} placeholder="örn: Ürün yavaşça dönsün, dramatik ışıklandırma, siyah arka plan" rows={2} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400" />
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {[
                    {
                      etiket: "360° Dönüş",
                      aciklama: "Ürün kendi ekseni etrafında yavaşça döner. Tüm açılar görünür.",
                      ikon: "🔄",
                      deger: "Smooth slow 360 degree product rotation, studio lighting, clean background",
                    },
                    {
                      etiket: "Zoom Yaklaşım",
                      aciklama: "Kamera ürüne doğru yavaş yaklaşır. Detay ve doku hissi verir.",
                      ikon: "🔍",
                      deger: "Gentle cinematic zoom in towards the product, soft focus background, detail reveal",
                    },
                    {
                      etiket: "Dramatik Işık",
                      aciklama: "Karanlık sahnede ürüne spotlight açılır. Premium ve güçlü görünüm.",
                      ikon: "💡",
                      deger: "Dramatic lighting reveal, dark background, single spotlight effect on product, luxury feel",
                    },
                    {
                      etiket: "Doğal Ortam",
                      aciklama: "Yapraklar hafifçe sallanır, ışık oynar. Organik ve sıcak his.",
                      ikon: "🌿",
                      deger: "Product in natural outdoor setting, soft golden hour light, gentle breeze moving leaves, organic feel",
                    },
                  ].map((p) => (
                    <button key={p.etiket} onClick={() => setVideoPrompt(p.deger)}
                      className={`text-left p-2.5 rounded-xl border-2 transition-all ${videoPrompt === p.deger ? "border-red-400 bg-red-50" : "border-gray-200 hover:border-red-200 hover:bg-red-50/50"}`}>
                      <p className={`text-xs font-semibold ${videoPrompt === p.deger ? "text-red-700" : "text-gray-700"}`}>{p.ikon} {p.etiket}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5 leading-relaxed">{p.aciklama}</p>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-1.5">💡 Boş bırakırsan marka bilgine göre otomatik oluşturulur — genellikle iyi sonuç verir</p>
                <Link href="/blog/ai-urun-videosu-hareket-secenekleri" className="inline-block mt-2 text-xs text-red-500 hover:text-red-700 hover:underline">Bu hareketler ne anlama gelir? Ürün kategorine göre hangisi uygun? →</Link>
              </div>

              <button onClick={videoUret} disabled={videoYukleniyor || !fotolar[0] || (!kullanici?.is_admin && (kullanici?.kredi ?? 0) < (videoSure === "10" ? 8 : 5))}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-gray-300 disabled:to-gray-300 text-white font-semibold py-3 rounded-xl transition-all">
                {videoYukleniyor ? "⏳ Video üretiliyor... (~2 dakika)" : !fotolar[0] ? "Önce fotoğraf ekle ↑" : `🎬 Video Üret — ${kullanici?.is_admin ? "∞" : (videoSure === "10" ? "8" : "5")} kredi`}
              </button>

              {!kullanici?.is_admin && (kullanici?.kredi ?? 0) < (videoSure === "10" ? 8 : 5) && !videoYukleniyor && (
                <p className="text-center text-xs text-red-500">En az {videoSure === "10" ? "8" : "5"} içerik üretim kredisi gerekli. <button onClick={() => paketModalAc()} className="underline font-medium">Kredi satın al →</button></p>
              )}

              {videoYukleniyor && (
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-center space-y-2">
                  <div className="flex justify-center"><div className="w-8 h-8 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" /></div>
                  <p className="text-sm font-medium text-orange-700">AI videonuzu üretiyor</p>
                  <p className="text-xs text-orange-500">Sayfayı kapatmayın, yaklaşık 2 dakika sürer</p>
                </div>
              )}

              {videoUrl && !videoYukleniyor && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-sm font-semibold text-gray-800">✅ Videonuz Hazır</span>
                    <span className="text-xs text-gray-400">{videoFormat} · {videoSure} saniye</span>
                  </div>
                  <video src={videoUrl} controls autoPlay loop className="w-full rounded-xl max-h-96 object-contain bg-black" />
                  <a href={videoUrl} download="urun-video.mp4" target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-900 text-white font-semibold py-3 rounded-xl text-sm transition-colors">⬇️ Videoyu İndir</a>
                  <button onClick={() => { setVideoUrl(null); setVideoPrompt(""); }} className="w-full text-xs text-gray-400 hover:text-gray-600 py-2 transition-colors">Yeni video üret</button>
                </div>
              )}
            </div>

            {/* ===== SOSYAL MEDYA SEKMESİ ===== */}
            <div style={{display: anaSekme === "sosyal" ? "block" : "none"}} className="mt-4 bg-white rounded-2xl shadow p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-gray-800">📱 Sosyal Medya Paylaşımı</h2>
                <span className="text-xs text-pink-500 font-medium">1 içerik üretim kredisi</span>
              </div>

              {/* Profil eksik uyarısı */}
              {kullanici && !kullanici.anonim && !kullanici.marka_adi && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 flex items-center justify-between gap-3">
                  <p className="text-xs text-yellow-700">💡 <span className="font-semibold">Marka profili eksik</span> — Marka adı, hedef kitle ve ton girilince caption çok daha özgün olur.</p>
                  <a href="/profil" className="text-xs text-yellow-700 font-semibold underline whitespace-nowrap">Profili doldur →</a>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ürün Adı <span className="text-red-400">*</span></label>
                <input type="text" value={sosyalUrunAdi} onChange={(e) => setSosyalUrunAdi(e.target.value)} placeholder="örn: Bakır Cezve Set, Kadın Deri Çanta" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ek Bilgi <span className="text-gray-400 font-normal">(isteğe bağlı)</span></label>
                <textarea value={sosyalEkBilgi} onChange={(e) => setSosyalEkBilgi(e.target.value)} placeholder="örn: %20 indirimde, yeni sezon, el yapımı, hediye seçeneği" rows={2} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400" />
              </div>

              {fotolar[0] && (
                <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 border border-gray-100">
                  <img src={fotolar[0]} alt="ürün" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                  <p className="text-xs text-gray-500 flex-1">Ürün fotoğrafı hazır — görsel üretmek için Görsel sekmesine geç</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
                <div className="flex gap-2">
                  {([
                    { id: "instagram_tiktok", label: "📸 Instagram & TikTok" },
                    { id: "facebook", label: "👥 Facebook" },
                    { id: "twitter", label: "🐦 Twitter/X" },
                  ] as { id: SosyalPlatform; label: string }[]).map((p) => (
                    <button key={p.id} onClick={() => setSosyalPlatform(p.id)}
                      className={`flex-1 py-2 px-2 rounded-xl border-2 text-xs font-semibold transition-all ${sosyalPlatform === p.id ? "border-pink-400 bg-pink-50 text-pink-600" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}>
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ton</label>
                <div className="grid grid-cols-3 gap-2">
                  {([
                    { id: "tanitim", label: "📣 Tanıtım", aciklama: "Ürünü öne çıkar" },
                    { id: "indirim", label: "🔥 İndirim", aciklama: "Fırsatı vurgula" },
                    { id: "hikaye", label: "💫 Hikaye", aciklama: "Duygu bağı kur" },
                  ] as { id: SosyalTon; label: string; aciklama: string }[]).map((t) => (
                    <button key={t.id} onClick={() => setSosyalTon(t.id)}
                      className={`p-3 rounded-xl border-2 text-left transition-all ${sosyalTon === t.id ? "border-pink-400 bg-pink-50" : "border-gray-200 hover:border-gray-300"}`}>
                      <p className={`text-xs font-semibold ${sosyalTon === t.id ? "text-pink-700" : "text-gray-700"}`}>{t.label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{t.aciklama}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sezon / Etkinlik</label>
                <select value={sosyalSezon} onChange={(e) => setSosyalSezon(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white">
                  <option value="normal">📅 Normal (Sezon yok)</option>
                  <option value="anneler_gunu">💐 Anneler Günü</option>
                  <option value="babalar_gunu">👔 Babalar Günü</option>
                  <option value="bayram">🌙 Bayram</option>
                  <option value="yilbasi">🎄 Yılbaşı</option>
                  <option value="black_friday">🏷️ Black Friday</option>
                  <option value="sevgililer_gunu">❤️ Sevgililer Günü</option>
                </select>
              </div>

              <button onClick={captionUret} disabled={captionYukleniyor || !sosyalUrunAdi.trim() || (!kullanici?.is_admin && (kullanici?.kredi ?? 0) <= 0)}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 disabled:from-gray-300 disabled:to-gray-300 text-white font-semibold py-3 rounded-xl transition-all">
                {captionYukleniyor ? "⏳ Üretiliyor..." : `📱 Paylaşım Metni Üret — ${kullanici?.is_admin ? "∞" : "1"} kredi`}
              </button>

              {!kullanici?.is_admin && (kullanici?.kredi ?? 0) <= 0 && !captionYukleniyor && (
                <p className="text-center text-xs text-red-500">İçerik üretim krediniz bitti. <button onClick={() => paketModalAc()} className="underline font-medium">Kredi satın al →</button></p>
              )}

              {(sosyalCaption || sosyalHashtag) && (
                <div className="space-y-3">
                  {sosyalCaption && (
                    <div className="bg-white rounded-2xl shadow-sm p-5 border-l-4 border-l-pink-400 border border-gray-100">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-semibold text-gray-700">✍️ Paylaşım Metni</span>
                        <button onClick={() => navigator.clipboard.writeText(sosyalCaption)} className="text-xs font-medium px-3 py-1.5 rounded-lg bg-gray-100 text-gray-500 hover:bg-pink-50 hover:text-pink-600 transition-all">Kopyala</button>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{sosyalCaption}</p>
                    </div>
                  )}
                  {sosyalHashtag && (
                    <div className="bg-white rounded-2xl shadow-sm p-5 border-l-4 border-l-purple-400 border border-gray-100">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-semibold text-gray-700"># Hashtagler</span>
                        <button onClick={() => navigator.clipboard.writeText(sosyalHashtag)} className="text-xs font-medium px-3 py-1.5 rounded-lg bg-gray-100 text-gray-500 hover:bg-purple-50 hover:text-purple-600 transition-all">Kopyala</button>
                      </div>
                      <p className="text-sm text-purple-700 leading-relaxed">{sosyalHashtag}</p>
                    </div>
                  )}
                  <button onClick={() => { setSosyalCaption(""); setSosyalHashtag(""); }} className="w-full text-xs text-gray-400 hover:text-gray-600 py-2 transition-colors">Yeni metin üret</button>
                </div>
              )}

              {/* ── SOSYAL MEDYA GÖRSELİ ── */}
              <div className="border-t border-gray-100 pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-700">📸 Sosyal Medya Görseli Üret</h3>
                  <span className="text-xs text-pink-500 font-medium">1 kredi</span>
                </div>
                <p className="text-xs text-gray-400">Ürün fotoğrafını seçtiğin platforma uygun boyuta getirir, arka planı değiştirir.</p>

                {/* Platform / Format seçici */}
                <div>
                  <p className="text-xs font-medium text-gray-600 mb-1.5">Platform Formatı</p>
                  <div className="grid grid-cols-3 gap-2">
                    {([
                      { id: "1:1",  label: "⬜ 1:1",  aciklama: "Instagram Gönderi",   boyut: "1080×1080" },
                      { id: "9:16", label: "📱 9:16", aciklama: "Reels & TikTok",      boyut: "1080×1920" },
                      { id: "16:9", label: "🖥️ 16:9", aciklama: "Twitter / LinkedIn",  boyut: "1920×1080" },
                    ] as { id: "1:1"|"9:16"|"16:9"; label: string; aciklama: string; boyut: string }[]).map((f) => (
                      <button key={f.id} onClick={() => setSosyalGorselFormat(f.id)}
                        className={`p-2.5 rounded-xl border-2 text-left transition-all ${sosyalGorselFormat === f.id ? "border-pink-400 bg-pink-50" : "border-gray-200 hover:border-gray-300"}`}>
                        <p className={`text-xs font-semibold ${sosyalGorselFormat === f.id ? "text-pink-700" : "text-gray-700"}`}>{f.label}</p>
                        <p className="text-[10px] text-gray-500 mt-0.5">{f.aciklama}</p>
                        <p className="text-[10px] text-gray-400">{f.boyut}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Stil seçici — sosyal medya için curated 4 stil */}
                <div>
                  <p className="text-xs font-medium text-gray-600 mb-1.5">Görsel Stili</p>
                  <div className="grid grid-cols-2 gap-2">
                    {([
                      { id: "beyaz",     label: "⬜ Beyaz Zemin",  aciklama: "Trendyol & pazaryeri standart" },
                      { id: "lifestyle", label: "🏠 Lifestyle",    aciklama: "Organik, gerçek yaşam hissi" },
                      { id: "gradient",  label: "🎨 Gradient",     aciklama: "Modern, göze çarpan arka plan" },
                      { id: "koyu",      label: "⬛ Koyu Zemin",   aciklama: "Premium, elektronik, lüks ürün" },
                    ] as { id: string; label: string; aciklama: string }[]).map((s) => (
                      <button key={s.id} onClick={() => setSosyalGorselStil(s.id)}
                        className={`p-2.5 rounded-xl border-2 text-left transition-all ${sosyalGorselStil === s.id ? "border-pink-400 bg-pink-50" : "border-gray-200 hover:border-gray-300"}`}>
                        <p className={`text-xs font-semibold ${sosyalGorselStil === s.id ? "text-pink-700" : "text-gray-700"}`}>{s.label}</p>
                        <p className="text-[10px] text-gray-500 mt-0.5">{s.aciklama}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <button onClick={sosyalGorselUret}
                  disabled={sosyalGorselYukleniyor || !fotolar[0] || (!kullanici?.is_admin && (kullanici?.kredi ?? 0) <= 0)}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 disabled:from-gray-300 disabled:to-gray-300 text-white font-semibold py-3 rounded-xl transition-all text-sm">
                  {sosyalGorselYukleniyor ? "⏳ Görsel üretiliyor..." : !fotolar[0] ? "Önce fotoğraf yükle ↑" : `📸 Görsel Üret — ${kullanici?.is_admin ? "∞" : "1"} kredi`}
                </button>

                {sosyalGorselYukleniyor && (
                  <div className="flex items-center justify-center gap-3 py-4">
                    <div className="w-6 h-6 border-3 border-pink-200 border-t-pink-500 rounded-full animate-spin" />
                    <p className="text-sm text-pink-600">4 varyasyon üretiliyor...</p>
                  </div>
                )}

                {sosyalGorselSonuclar.length > 0 && !sosyalGorselYukleniyor && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-gray-700">✅ {sosyalGorselSonuclar.length} varyasyon hazır</p>
                    <div className="grid grid-cols-2 gap-2">
                      {sosyalGorselSonuclar.map((url, i) => (
                        <div key={i} className="relative group rounded-xl overflow-hidden border border-gray-100">
                          <img src={url} alt={`varyasyon ${i + 1}`} className="w-full object-cover" />
                          <a href={url} download={`sosyal-gorsel-${i + 1}.jpg`} target="_blank" rel="noopener noreferrer"
                            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold rounded-xl">
                            ⬇️ İndir
                          </a>
                        </div>
                      ))}
                    </div>
                    <button onClick={() => setSosyalGorselSonuclar([])} className="w-full text-xs text-gray-400 hover:text-gray-600 py-1.5 transition-colors">Yeni görsel üret</button>
                  </div>
                )}
              </div>

              {/* ── SOSYAL MEDYA KİTİ ── */}
              <div className="border-t border-gray-100 pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-700">📦 Sosyal Medya Kiti</h3>
                  <span className="text-xs text-pink-500 font-medium">{fotolar[0] ? "5 kredi" : "4 kredi"}</span>
                </div>
                <p className="text-xs text-gray-400">4 platform caption (Instagram, Facebook, Twitter, LinkedIn) {fotolar[0] ? "+ 1 görsel" : ""} birden üretir.</p>

                {/* Kit görsel ayarları — sadece foto varsa */}
                {fotolar[0] && (
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs font-medium text-gray-600 mb-1.5">Görsel Formatı</p>
                      <div className="flex gap-1.5">
                        {(["1:1", "9:16", "16:9"] as const).map((f) => (
                          <button key={f} onClick={() => setKitGorselFormat(f)}
                            className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-all ${kitGorselFormat === f ? "border-pink-400 bg-pink-50 text-pink-700" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}>
                            {f === "1:1" ? "⬜ 1:1" : f === "9:16" ? "📱 9:16" : "🖥 16:9"}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-600 mb-1.5">Görsel Stili</p>
                      <div className="grid grid-cols-2 gap-1.5">
                        {([
                          { id: "beyaz", label: "⬜ Beyaz Zemin" },
                          { id: "lifestyle", label: "🏠 Lifestyle" },
                          { id: "gradient", label: "🎨 Gradient" },
                          { id: "koyu", label: "⬛ Koyu Zemin" },
                        ]).map((s) => (
                          <button key={s.id} onClick={() => setKitGorselStil(s.id)}
                            className={`py-1.5 rounded-lg text-xs font-medium border transition-all ${kitGorselStil === s.id ? "border-pink-400 bg-pink-50 text-pink-700" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}>
                            {s.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <button onClick={kitUret}
                  disabled={kitYukleniyor || !sosyalUrunAdi.trim() || (!kullanici?.is_admin && (kullanici?.kredi ?? 0) < (fotolar[0] ? 5 : 4))}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-300 disabled:to-gray-300 text-white font-semibold py-3 rounded-xl transition-all text-sm">
                  {kitYukleniyor ? "⏳ Kit üretiliyor..." : `📦 Kit Üret — ${kullanici?.is_admin ? "∞" : (fotolar[0] ? "5" : "4")} kredi`}
                </button>

                {kitYukleniyor && (
                  <div className="flex items-center justify-center gap-3 py-4">
                    <div className="w-6 h-6 border-2 border-purple-200 border-t-purple-500 rounded-full animate-spin" />
                    <p className="text-sm text-purple-600">4 platform + görsel üretiliyor...</p>
                  </div>
                )}

                {kitSonuc && !kitYukleniyor && (
                  <div className="space-y-3">
                    {/* Görseller */}
                    {kitSonuc.gorselUrls.length > 0 && (
                      <div className="space-y-1.5">
                        <p className="text-xs font-semibold text-gray-700">📸 Görsel ({kitSonuc.gorselUrls.length} varyasyon)</p>
                        <div className="grid grid-cols-2 gap-2">
                          {kitSonuc.gorselUrls.map((url, i) => (
                            <div key={i} className="relative group rounded-xl overflow-hidden border border-gray-100">
                              <img src={url} alt={`kit görsel ${i + 1}`} className="w-full object-cover" />
                              <a href={url} download={`kit-gorsel-${i + 1}.jpg`} target="_blank" rel="noopener noreferrer"
                                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold rounded-xl">
                                ⬇️ İndir
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Platform captionları */}
                    {([
                      { key: "instagram_tiktok", label: "📸 Instagram & TikTok", renk: "border-l-pink-400" },
                      { key: "facebook", label: "👥 Facebook", renk: "border-l-blue-400" },
                      { key: "twitter", label: "🐦 Twitter/X", renk: "border-l-sky-400" },
                      { key: "linkedin", label: "💼 LinkedIn", renk: "border-l-indigo-400" },
                    ]).map(({ key, label, renk }) => {
                      const c = kitSonuc.captions[key];
                      if (!c?.caption) return null;
                      return (
                        <div key={key} className={`bg-white rounded-xl shadow-sm p-4 border-l-4 ${renk} border border-gray-100`}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-gray-700">{label}</span>
                            <button onClick={() => navigator.clipboard.writeText(c.caption + (c.hashtag ? "\n\n" + c.hashtag : ""))}
                              className="text-xs font-medium px-2.5 py-1 rounded-lg bg-gray-100 text-gray-500 hover:bg-pink-50 hover:text-pink-600 transition-all">
                              Kopyala
                            </button>
                          </div>
                          <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">{c.caption}</p>
                          {c.hashtag && <p className="text-xs text-purple-600 mt-2 leading-relaxed">{c.hashtag}</p>}
                        </div>
                      );
                    })}

                    <button onClick={() => setKitSonuc(null)} className="w-full text-xs text-gray-400 hover:text-gray-600 py-1.5 transition-colors">Yeni kit üret</button>
                  </div>
                )}
              </div>

            </div>

          </div>

          {/* Sağ panel — Geçmiş */}
          <div className="w-full lg:w-72 space-y-4">
            <div className="bg-white rounded-2xl shadow p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-700">Son Üretimler</h3>
                <div className="text-xs text-gray-400">{kullanici?.toplam_kullanilan || 0} toplam</div>
              </div>
              {gecmis.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-4">Henüz üretim yapılmadı</p>
              ) : (
                <div className="space-y-2">
                  {gecmis.map((u) => (
                    <button key={u.id} onClick={() => setSeciliUretim(seciliUretim?.id === u.id ? null : u)}
                      className={`w-full text-left p-3 rounded-xl border transition-colors ${seciliUretim?.id === u.id ? "border-orange-300 bg-orange-50" : "border-gray-100 hover:bg-gray-50"}`}>
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-xs font-medium text-gray-700 truncate flex-1">{u.urun_adi}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${platformRenk[u.platform] || "bg-gray-100 text-gray-600"}`}>{u.platform}</span>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {new Date(u.created_at).toLocaleString("tr-TR", { timeZone: "Europe/Istanbul", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </div>
                      {seciliUretim?.id === u.id && (
                        <div className="mt-3 pt-3 border-t border-orange-200 space-y-2">
                          {sonucuBolumle(u.sonuc).map((bolum, bi) => (
                            <div key={bi} className="bg-gray-50 rounded-xl p-3">
                              <div className="flex items-center justify-between mb-1.5">
                                <span className="text-xs font-semibold text-gray-600">{bolum.ikon} {bolum.baslik}</span>
                                <span role="button" tabIndex={0} onClick={(e) => {
                                  e.stopPropagation();
                                  navigator.clipboard.writeText(bolum.icerik);
                                  const el = e.currentTarget as HTMLSpanElement;
                                  el.textContent = "✓ Kopyalandı"; el.style.color = "#16a34a"; el.style.background = "#dcfce7";
                                  setTimeout(() => { el.textContent = "Kopyala"; el.style.color = ""; el.style.background = ""; }, 2000);
                                }} className="text-xs text-orange-500 hover:text-orange-600 cursor-pointer">Kopyala</span>
                              </div>
                              <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line line-clamp-4">{bolum.icerik}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Kullanım</h3>
              <div className="flex gap-3">
                <div className="flex-1 bg-orange-50 rounded-xl px-3 py-2 text-center">
                  <div className={`text-xl font-bold ${kullanici?.is_admin ? "text-purple-500" : krediDusuk ? "text-red-500" : "text-orange-500"}`}>
                    {kullanici?.is_admin ? "∞" : kullanici?.kredi ?? "-"}
                  </div>
                  <div className="text-xs text-gray-500">Kalan kredi</div>
                </div>
                <div className="flex-1 bg-gray-50 rounded-xl px-3 py-2 text-center">
                  <div className="text-xl font-bold text-gray-700">{kullanici?.toplam_kullanilan ?? "-"}</div>
                  <div className="text-xs text-gray-500">Kullanılan</div>
                </div>
              </div>
              <button onClick={() => paketModalAc()} className="w-full mt-3 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold py-2 rounded-xl transition-colors">
                + İçerik Üretim Kredisi Al
              </button>
            </div>
          </div>
        </div>

        {/* Auth Popup */}
        {authPopupAcik && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) setAuthPopupAcik(false); }}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">
                  {authPopupMod === "kayit" ? "Hesap Oluştur" : "Giriş Yap"}
                </h2>
                <button onClick={() => setAuthPopupAcik(false)} className="text-gray-400 hover:text-gray-600 text-2xl font-light">×</button>
              </div>
              <div className="p-5 space-y-3">
                <button
                  onClick={async () => {
                    const { data, error } = await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${window.location.origin}/` } });
                    if (!error && data?.url) window.location.href = data.url;
                  }}
                  className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Google ile Devam Et
                </button>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-gray-100" />
                  <span className="text-xs text-gray-400">veya e-posta ile</span>
                  <div className="flex-1 h-px bg-gray-100" />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setAuthPopupMod("kayit")} className={`flex-1 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${authPopupMod === "kayit" ? "bg-orange-500 text-white border-orange-500" : "bg-white text-orange-500 border-orange-200"}`}>🎁 Kayıt Ol</button>
                  <button onClick={() => setAuthPopupMod("giris")} className={`flex-1 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${authPopupMod === "giris" ? "bg-gray-800 text-white border-gray-800" : "bg-white text-gray-600 border-gray-200"}`}>Giriş Yap</button>
                </div>
                <input type="email" placeholder="E-posta" value={authPopupEmail} onChange={(e) => setAuthPopupEmail(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
                <input type="password" placeholder="Şifre" value={authPopupSifre} onChange={(e) => setAuthPopupSifre(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAuthPopupGiris()} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
                {authPopupMod === "kayit" && (
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" checked={authPopupSozlesme} onChange={(e) => setAuthPopupSozlesme(e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-gray-300 flex-shrink-0" />
                    <span className="text-xs text-gray-500 leading-relaxed">
                      <a href="/gizlilik" target="_blank" className="text-orange-500 hover:underline">Gizlilik Politikası</a> ve <a href="/mesafeli-satis" target="_blank" className="text-orange-500 hover:underline">Mesafeli Satış Sözleşmesi</a>&apos;ni okudum.
                    </span>
                  </label>
                )}
                {authPopupMesaj && <p className={`text-xs ${authPopupMesaj.includes("başarılı") || authPopupMesaj.includes("oluşturuldu") ? "text-green-600" : "text-red-500"}`}>{authPopupMesaj}</p>}
                <button onClick={handleAuthPopupGiris} disabled={authPopupYukleniyor || (authPopupMod === "kayit" && !authPopupSozlesme)} className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white font-semibold py-3 rounded-xl text-sm transition-colors">
                  {authPopupYukleniyor ? "..." : authPopupMod === "kayit" ? "Ücretsiz Hesap Oluştur" : "Giriş Yap"}
                </button>
              </div>
            </div>
          </div>
        )}

        {paketModalAcik && kullanici && <PaketModal kullanici={kullanici} onKapat={() => setPaketModalAcik(false)} />}

        {/* Görsel indirme — kayıtlı kullanıcı kredi onayı */}
        {krediOnayAcik && kullanici && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => { setKrediOnayAcik(false); setKrediOnayIslem(null); }}>
            <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center" onClick={(e) => e.stopPropagation()}>
              <div className="text-4xl mb-4">🔄</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Denemeye devam et?</h3>
              <p className="text-sm text-gray-500 mb-1 leading-relaxed">
                Günlük ücretsiz indirme hakkın bitti.
              </p>
              <p className="text-sm font-semibold text-orange-600 mb-6">
                1 kredi düşeceğiz — 3 indirme hakkı daha açılır.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => { setKrediOnayAcik(false); setKrediOnayIslem(null); }}
                  className="flex-1 border border-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-colors"
                >
                  İptal
                </button>
                <button
                  onClick={krediOnayla}
                  disabled={!kullanici.is_admin && kullanici.kredi < 1}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
                >
                  {!kullanici.is_admin && kullanici.kredi < 1 ? "Kredi yetersiz" : "Onayla — 1 kredi"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Görsel indirme — günlük hak uyarısı */}
        {gorselUyariAcik && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setGorselUyariAcik(false)}>
            <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center" onClick={(e) => e.stopPropagation()}>
              <div className="text-4xl mb-4">🌙</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Bugün istediğini bulamadın mı?</h3>
              <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                Günlük görsel indirme hakkın doldu. Yarın tekrar deneyebilir ya da kredi satın alarak sınırsız indirebilirsin.
              </p>
              <div className="flex flex-col gap-2">
                <button onClick={() => { setGorselUyariAcik(false); paketModalAc(); }} className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors">
                  Kredi Satın Al
                </button>
                <button onClick={() => setGorselUyariAcik(false)} className="text-gray-400 hover:text-gray-600 text-sm py-2">
                  Yarın tekrar dene
                </button>
              </div>
            </div>
          </div>
        )}

        <ChatWidget />
      </div>
    </main>
  );
}




