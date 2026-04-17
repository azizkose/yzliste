"use client";
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import { PAKET_LISTESI } from "@/lib/paketler";
import { useCredits, useInvalidateCredits } from "@/lib/hooks/useCredits";
import { analytics } from "@/lib/analytics";
import { useUretimStore } from "@/store/uretimStore";

type AnaSekme = "metin" | "gorsel" | "video" | "sosyal";
type SosyalPlatform = "instagram" | "tiktok" | "facebook" | "twitter";
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
    <button onClick={kopyala} className={`text-xs font-medium px-3 py-1 rounded-lg transition-all duration-200 ${kopyalandi ? "bg-green-100 text-green-700 border border-green-300 scale-95" : "bg-gray-100 text-gray-500 hover:bg-indigo-50 hover:text-indigo-600"}`}>
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

  // Paketler lib/paketler.ts'den geliyor
  const paketler = PAKET_LISTESI;

  const odemeBaslat = async (paketId: string) => {
    // Fatura bilgisi kontrolü — ödeme başlamadan önce
    const { data: profilKontrol } = await supabase.from("profiles").select("ad_soyad, fatura_tipi, tc_kimlik, vergi_no").eq("id", kullanici.id).single();
    const eksik = !profilKontrol?.ad_soyad || (profilKontrol?.fatura_tipi === "bireysel" && !profilKontrol?.tc_kimlik) || (profilKontrol?.fatura_tipi === "kurumsal" && !profilKontrol?.vergi_no);
    if (eksik) {
      onKapat();
      alert("Ödeme yapabilmek için önce profil sayfasından fatura bilgilerinizi doldurun.");
      window.location.href = "/profil";
      return;
    }
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
            <p className="text-xs text-gray-500 mt-0.5">Mevcut kredin: <span className="font-semibold text-indigo-500">{kullanici.kredi}</span></p>
          </div>
          <button onClick={onKapat} className="text-gray-400 hover:text-gray-600 text-2xl font-light">×</button>
        </div>
        {!odemeAcik ? (
          <div className="p-6 space-y-4">
            {paketler.map((p) => (
              <div key={p.id} className={`border-2 ${p.renk} rounded-2xl p-5 relative`}>
                {p.rozet && <span className="absolute -top-3 left-4 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full">En Popüler</span>}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-800">{p.isim}</p>
                    <p className="text-sm text-gray-500">{p.krediStr}</p>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{p.fiyatStr}</p>
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
          <div className="bg-indigo-500 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
              <span className="text-white text-sm font-semibold">yzliste destek</span>
            </div>
            <button onClick={() => setAcik(false)} className="text-white/80 hover:text-white text-lg">×</button>
          </div>
          <div className="flex-1 p-4 space-y-3 max-h-72 overflow-y-auto bg-gray-50">
            {mesajlar.map((m, i) => (
              <div key={i} className={`flex ${m.rol === "kullanici" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] px-3 py-2 rounded-xl text-xs leading-relaxed ${m.rol === "kullanici" ? "bg-indigo-500 text-white" : "bg-white text-gray-700 border border-gray-100"}`}>
                  {m.metin}
                </div>
              </div>
            ))}
            {yukleniyor && <div className="flex justify-start"><div className="bg-white border border-gray-100 px-3 py-2 rounded-xl text-xs text-gray-400">yazıyor...</div></div>}
          </div>
          <div className="p-3 border-t border-gray-100 bg-white flex gap-2">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && gonder()} placeholder="Mesajınızı yazın..." className="flex-1 text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-400" />
            <button onClick={gonder} className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-2 rounded-lg text-xs font-medium">Gönder</button>
          </div>
        </div>
      )}
      <button onClick={() => setAcik(!acik)} className="bg-indigo-500 hover:bg-indigo-600 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl transition-all">
        {acik ? "×" : "💬"}
      </button>
    </div>
  );
}

// ---- Yardımcı: Fotoğraf thumbnail bileşeni ----
function FotoThumbnail({ src, onKaldir, renk = "green" }: { src: string; onKaldir: () => void; renk?: string }) {
  const renkler: Record<string, string> = {
    green: "bg-green-50 border-green-200 text-green-700 text-green-500",
    red: "bg-amber-50 border-amber-200 text-amber-700 text-amber-400",
    pink: "bg-emerald-50 border-emerald-200 text-emerald-700 text-emerald-400",
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
    gray: "border-gray-300 hover:border-indigo-400 hover:bg-indigo-50",
    purple: "border-violet-300 hover:border-violet-400 hover:bg-violet-50",
    red: "border-amber-200 hover:border-amber-400 hover:bg-amber-50",
    pink: "border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50",
  };
  const metin_renk: Record<string, string> = {
    gray: "text-gray-500", purple: "text-violet-700", red: "text-amber-600", pink: "text-emerald-500",
  };
  const alt_renk: Record<string, string> = {
    gray: "text-gray-400", purple: "text-violet-400", red: "text-amber-400", pink: "text-emerald-400",
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
  const { data: kredilerHook } = useCredits();
  const { setPaylasim } = useUretimStore();

  // Mobil menü
  const [mobileMenuAcik, setMobileMenuAcik] = useState(false);

  // Sekme
  const [anaSekme, setAnaSekme] = useState<AnaSekme>("metin");

  // Kullanıcı
  const [kullanici, setKullanici] = useState<Kullanici | null>(null);
  const [gecmis, setGecmis] = useState<Uretim[]>([]);
  const [seciliUretim, setSeciliUretim] = useState<Uretim | null>(null);
  const [gecmisAcik, setGecmisAcik] = useState(false);
  const [gecmisPlatformFiltre, setGecmisPlatformFiltre] = useState("");
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
  const [hedefKitle, setHedefKitle] = useState("genel");
  const [fiyatSegmenti, setFiyatSegmenti] = useState<"butce" | "orta" | "premium">("orta");
  const [markaliUrun, setMarkaliUrun] = useState(false);
  const [anahtarKelimeler, setAnahtarKelimeler] = useState("");
  const [sonuc, setSonuc] = useState("");
  const [uretimId, setUretimId] = useState<string | null>(null);
  const [yenidenUretHakki, setYenidenUretHakki] = useState(3);
  const [duzenleYukleniyor, setDuzenleYukleniyor] = useState(false);
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
  const [seciliStiller, setSeciliStiller] = useState<Set<string>>(new Set());
  const [gorselYukleniyor, setGorselYukleniyor] = useState(false);
  const [gorselJoblar, setGorselJoblar] = useState<{ requestId: string; label: string; stil: string }[]>([]);
  const [referansGorsel, setReferansGorsel] = useState<string | null>(null);

  // Video sekmesi
  // videoFoto kaldırıldı — tüm sekmeler fotolar[0] paylaşır
  const [videoPrompt, setVideoPrompt] = useState("");
  const [videoPromptGoster, setVideoPromptGoster] = useState("");
  const [videoSure, setVideoSure] = useState<"5" | "10">("5");
  const [videoFormat, setVideoFormat] = useState<"9:16" | "16:9" | "1:1">("9:16");
  const [videoYukleniyor, setVideoYukleniyor] = useState(false);
  const [videoRequestId, setVideoRequestId] = useState<string | null>(null);

  // Sosyal sekmesi
  const [sosyalFoto, setSosyalFoto] = useState<string | null>(null);
  const [sosyalUrunAdi, setSosyalUrunAdi] = useState("");
  const [sosyalEkBilgi, setSosyalEkBilgi] = useState("");
  const [sosyalPlatform, setSosyalPlatform] = useState<SosyalPlatform>("instagram");
  const [sosyalTon, setSosyalTon] = useState<SosyalTon>("tanitim");
  const [captionYukleniyor, setCaptionYukleniyor] = useState(false);
  const [sosyalCaption, setSosyalCaption] = useState("");
  const [sosyalHashtag, setSosyalHashtag] = useState("");
  // Sosyal — görsel üretimi
  const [sosyalIcerikTipi, setSosyalIcerikTipi] = useState<"metin" | "gorsel">("metin");
  const [sosyalGorselStil, setSosyalGorselStil] = useState("beyaz");
  const [sosyalGorselFormat, setSosyalGorselFormat] = useState<"1:1" | "9:16" | "16:9">("1:1");
  const [sosyalGorselYukleniyor, setSosyalGorselYukleniyor] = useState(false);
  const [sosyalGorselSonuclar, setSosyalGorselSonuclar] = useState<{ stil: string; label: string; gorseller: string[] }[]>([]);
  const [sosyalGorselPrompt, setSosyalGorselPrompt] = useState("");
  const [sosyalSezon, setSosyalSezon] = useState("normal");
  // Sosyal medya kiti (4 platform birden)
  const [sosyalKitYukleniyor, setSosyalKitYukleniyor] = useState(false);
  const [sosyalKitSonuc, setSosyalKitSonuc] = useState<Record<string, { caption: string; hashtag: string }> | null>(null);
  const [sosyalKitAcik, setSosyalKitAcik] = useState<string | null>(null);

  // Refs
  const scannerRef = useRef<unknown>(null);
  const scannerBaslatildi = useRef(false);
  const sorguCalisiyor = useRef(false);
  const mesajInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  // Metin sekmesindeki değerleri store'a senkronize et
  useEffect(() => {
    setPaylasim({ urunAdi, kategori, platform });
  }, [urunAdi, kategori, platform, setPaylasim]);

  // Sosyal sekmesine geçince sosyalUrunAdi otomatik doldur
  useEffect(() => {
    if (anaSekme === "sosyal" && !sosyalUrunAdi && urunAdi) {
      setSosyalUrunAdi(urunAdi);
    }
  }, [anaSekme]); // eslint-disable-line react-hooks/exhaustive-deps

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
        setPaketModalAcik(true);
      }
    }
    setAuthPopupYukleniyor(false);
  };

  const handleGoogleGiris = async () => {
    const { data } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/` },
    });
    if (data?.url) window.location.href = data.url;
  };

  const paketModalAc = () => {
    if (!kullanici) {
      setAuthSonraAksiyon("paket");
      setAuthPopupMod("kayit");
      setAuthPopupAcik(true);
      return;
    }
    if (kullanici.anonim) {
      setAuthSonraAksiyon("paket");
      setAuthPopupMod("kayit");
      setAuthPopupAcik(true);
      return;
    }
    setPaketModalAcik(true);
  };

  const kullaniciyiKontrolEt = async () => {
    const params = new URLSearchParams(window.location.search);
    const paketParam = params.get("paket") === "ac";
    const odemeParam = params.get("odeme");
    if (paketParam || odemeParam) window.history.replaceState({}, "", "/");

    const { data: { user } } = await supabase.auth.getUser();

    if (odemeParam === "hata") setHata("Ödeme tamamlanamadı. Tekrar deneyin.");

    if (!user) {
      // Login olmadan sayfa göster — üret butonlarında kontrol yapılır
      if (paketParam) {
        setAuthSonraAksiyon("paket");
        setAuthPopupMod("kayit");
        setAuthPopupAcik(true);
      }
      return;
    }

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
        setPaketModalAcik(true);
      }
    }
  };

  // Üretim butonları için login kontrolü — giriş yoksa veya anonim ise popup aç
  const loginGerekli = (): boolean => {
    if (!kullanici || kullanici.anonim) {
      setAuthPopupMod("kayit");
      setAuthPopupAcik(true);
      return false;
    }
    return true;
  };

  useEffect(() => {
    kullaniciyiKontrolEt();
    return () => { kameraKapat(); if (mesajInterval.current) clearInterval(mesajInterval.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // PQ-15: Listing sekmesindeki ürün adını sosyal sekmeye senkronla
  useEffect(() => {
    if (urunAdi) setSosyalUrunAdi(urunAdi);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urunAdi]);

  const gecmisiYukle = async (userId: string) => {
    const { data } = await supabase.from("uretimler").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(10);
    if (data) setGecmis(data);
  };

  const cikisYap = async () => { analytics.reset(); await supabase.auth.signOut(); router.push("/auth"); };

  const fotoSec = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dosyalar = Array.from(e.target.files || []);
    dosyalar.slice(0, 3 - fotolar.length).forEach((dosya) => {
      const reader = new FileReader();
      reader.onload = () => setFotolar((prev) => (prev.length >= 3 ? prev : [...prev, reader.result as string]));
      reader.readAsDataURL(dosya);
    });
    e.target.value = "";
  };

  const fotoKaldir = (index: number) => { setFotolar((prev) => prev.filter((_, i) => i !== index)); setGorselJoblar([]); };

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
    reader.onload = () => { setFotolar([reader.result as string]); setGorselJoblar([]); };
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
    if (!loginGerekli()) return;
    if (!kullanici) return;
    if (!kullanici.is_admin && kullanici.kredi <= 0) { paketModalAc(); return; }
    if (!uretButonAktif) return;
    setYukleniyor(true);
    setSonuc("");
    setYukleniyorMesaj(0);
    analytics.generationStarted({ platform, type: 'metin' });
    mesajInterval.current = setInterval(() => setYukleniyorMesaj((prev) => (prev + 1) % yukleniyorMesajlari.length), 1800);
    try {
      const res = await fetch("/api/uret", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ urunAdi, kategori, ozellikler, platform, fotolar, girisTipi, barkodBilgi, userId: kullanici.id, dil: platformDil, ton: kullanici.ton, hedefKitle, fiyatSegmenti, anahtarKelimeler, markaliUrun }) });
      const data = await res.json();
      if (mesajInterval.current) clearInterval(mesajInterval.current);
      if (res.status === 402) { analytics.creditExhausted(); paketModalAc(); setYukleniyor(false); return; }
      setSonuc(data.icerik);
      setUretimId(data.uretimId ?? null);
      setYenidenUretHakki(3);
      if (kullanici.is_admin) setKullanici({ ...kullanici, toplam_kullanilan: kullanici.toplam_kullanilan + 1 });
      else setKullanici({ ...kullanici, kredi: kullanici.kredi - 1, toplam_kullanilan: kullanici.toplam_kullanilan + 1 });
      analytics.generationCompleted({ platform, type: 'metin', credits_remaining: kullanici.kredi - 1 });
      invalidateCredits();
      gecmisiYukle(kullanici.id);
    } catch { if (mesajInterval.current) clearInterval(mesajInterval.current); analytics.generationFailed({ platform, type: 'metin', error: 'network' }); setHata("İçerik üretilemedi. Lütfen tekrar deneyin."); }
    setYukleniyor(false);
    setTimeout(() => document.getElementById("sonuc-alani")?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  };

  const stilToggle = (stilId: string) => {
    setSeciliStiller(prev => {
      const next = new Set(prev);
      if (stilId === "ozel" || stilId === "referans") {
        return next.has(stilId) ? new Set() : new Set([stilId]);
      }
      next.delete("ozel");
      next.delete("referans");
      if (next.has(stilId)) next.delete(stilId);
      else next.add(stilId);
      return next;
    });
  };

  const gorselUret = async () => {
    if (!loginGerekli()) return;
    if (!kullanici) return;
    if (fotolar.length === 0) { alert("Önce bir ürün fotoğrafı ekleyin."); return; }
    if (seciliStiller.size === 0) { alert("En az bir stil seçin."); return; }
    const stilSayisi = seciliStiller.size;
    if (!kullanici.is_admin && kullanici.kredi < stilSayisi) { paketModalAc(); return; }
    setGorselYukleniyor(true);
    setGorselJoblar([]);
    try {
      const resizedFoto = await resizeFoto(fotolar[0]);
      const res = await fetch("/api/gorsel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          foto: resizedFoto,
          stiller: Array.from(seciliStiller),
          ekPrompt: gorselEkPrompt,
          userId: kullanici?.id,
          referansGorsel,
        }),
      });
      const data = await res.json();
      if (res.status === 402) { paketModalAc(); setGorselYukleniyor(false); return; }
      if (!data.jobs || data.jobs.length === 0) {
        setHata("Görsel üretilemedi. Tekrar deneyin.");
        setGorselYukleniyor(false);
        return;
      }

      if (!kullanici.is_admin) {
        setKullanici(k => k ? { ...k, kredi: Math.max(0, k.kredi - stilSayisi) } : k);
        invalidateCredits();
      }

      // Her iş için paralel poll — tamamlananlar anında gösterilir
      let tamamlananSayisi = 0;
      const hataMesajlari: string[] = [];
      await Promise.all(
        data.jobs.map(async (job: { requestId: string; label: string; stil: string }) => {
          for (let deneme = 0; deneme < 40; deneme++) {
            await new Promise(r => setTimeout(r, 4000));
            const pollRes = await fetch(`/api/gorsel/poll?requestId=${job.requestId}`);
            const pollData = await pollRes.json();
            if (pollData.status === "COMPLETED") {
              tamamlananSayisi++;
              setGorselJoblar(prev => [...prev, job]);
              break;
            }
            if (pollData.status === "FAILED") {
              const hataAciklama = pollData.hata || "Görsel üretilemedi";
              hataMesajlari.push(`${job.label}: ${hataAciklama}`);
              break;
            }
          }
        })
      );

      if (tamamlananSayisi === 0) {
        setHata(hataMesajlari.length > 0 ? hataMesajlari[0] : "Görsel üretilemedi, zaman aşımı.");
      } else if (hataMesajlari.length > 0) {
        setHata(`${hataMesajlari.length} görsel üretilemedi: ${hataMesajlari[0]}`);
      }
    } catch { setHata("Bir hata oluştu. Lütfen tekrar deneyin."); }
    setGorselYukleniyor(false);
  };

  const videoUret = async () => {
    if (!loginGerekli()) return;
    if (!fotolar[0]) { alert("Önce bir ürün fotoğrafı ekleyin."); return; }
    if (!kullanici) return;
    const videoKredi = videoSure === "10" ? 8 : 5;
    if (!kullanici.is_admin && kullanici.kredi < videoKredi) { paketModalAc(); return; }
    setVideoYukleniyor(true);
    setVideoRequestId(null);
    try {
      const resizedFoto = await resizeFoto(fotolar[0]);
      const res = await fetch("/api/sosyal/video", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ foto: resizedFoto, prompt: videoPrompt, userId: kullanici.id, sure: videoSure, format: videoFormat }) });
      const data = await res.json();
      if (res.status === 402) { paketModalAc(); setVideoYukleniyor(false); return; }
      if (!data.requestId) { setHata("Video üretilemedi. Tekrar deneyin."); setVideoYukleniyor(false); return; }

      // Kredi düşürüldü, kuyruğa alındı — poll et
      if (!kullanici.is_admin) { setKullanici({ ...kullanici, kredi: kullanici.kredi - (data.kullanilanKredi ?? videoKredi) }); invalidateCredits(); }

      let tamamlandi = false;
      for (let deneme = 0; deneme < 60; deneme++) {
        await new Promise(r => setTimeout(r, 5000));
        const pollRes = await fetch(`/api/sosyal/video/poll?requestId=${data.requestId}`);
        const pollData = await pollRes.json();
        if (pollData.status === "COMPLETED") {
          setVideoRequestId(data.requestId);
          tamamlandi = true;
          break;
        }
      }
      if (!tamamlandi) setHata("Video üretilemedi, zaman aşımı. Tekrar deneyin.");
    } catch { setHata("Bir hata oluştu. Lütfen tekrar deneyin."); }
    setVideoYukleniyor(false);
  };

  const captionUret = async () => {
    if (!loginGerekli()) return;
    if (!kullanici) return;
    if (!sosyalUrunAdi.trim()) return;
    if (!kullanici.is_admin && kullanici.kredi <= 0) { paketModalAc(); return; }
    setCaptionYukleniyor(true);
    setSosyalCaption("");
    setSosyalHashtag("");
    try {
      const res = await fetch("/api/sosyal", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ urunAdi: sosyalUrunAdi, ekBilgi: sosyalEkBilgi, platform: sosyalPlatform, ton: sosyalTon, sezon: sosyalSezon, userId: kullanici.id }) });
      const data = await res.json();
      if (data.caption) setSosyalCaption(data.caption);
      if (data.hashtag) setSosyalHashtag(data.hashtag);
      if (!kullanici.is_admin) { setKullanici({ ...kullanici, kredi: kullanici.kredi - 1 }); invalidateCredits(); }
    } catch { setHata("Paylaşım metni üretilemedi. Tekrar deneyin."); }
    setCaptionYukleniyor(false);
  };

  const kitUret = async () => {
    if (!loginGerekli()) return;
    if (!kullanici) return;
    if (!sosyalUrunAdi.trim()) return;
    const krediGereken = 4;
    if (!kullanici.is_admin && kullanici.kredi < krediGereken) { paketModalAc(); return; }
    setSosyalKitYukleniyor(true);
    setSosyalKitSonuc(null);
    setSosyalKitAcik(null);
    try {
      const res = await fetch("/api/sosyal/kit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urunAdi: sosyalUrunAdi, ekBilgi: sosyalEkBilgi, ton: sosyalTon, sezon: sosyalSezon, userId: kullanici.id }),
      });
      const data = await res.json();
      if (res.status === 402) { paketModalAc(); setSosyalKitYukleniyor(false); return; }
      if (data.captions) {
        setSosyalKitSonuc(data.captions);
        setSosyalKitAcik("instagram_tiktok");
        if (!kullanici.is_admin) { setKullanici({ ...kullanici, kredi: kullanici.kredi - (data.kullanilanKredi ?? krediGereken) }); invalidateCredits(); }
      }
    } catch { setHata("Kit üretilemedi. Tekrar deneyin."); }
    setSosyalKitYukleniyor(false);
  };

  const sosyalGorselUret = async () => {
    if (!kullanici || kullanici.anonim) { setAuthPopupMod("kayit"); setAuthPopupAcik(true); return; }
    if (!sosyalFoto) { alert("Önce ürün fotoğrafı yükle."); return; }
    if (!kullanici.is_admin && kullanici.kredi <= 0) { paketModalAc(); return; }
    setSosyalGorselYukleniyor(true);
    setSosyalGorselSonuclar([]);
    try {
      const resizedFoto = await resizeFoto(sosyalFoto);
      const res = await fetch("/api/gorsel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ foto: resizedFoto, stil: sosyalGorselStil, ekPrompt: sosyalGorselPrompt, sosyalFormat: sosyalGorselFormat, userId: kullanici.id }),
      });
      const data = await res.json();
      if (res.status === 402) { paketModalAc(); setSosyalGorselYukleniyor(false); return; }
      if (!data.requestId) { setHata("Görsel üretilemedi. Tekrar deneyin."); setSosyalGorselYukleniyor(false); return; }

      // Poll et — COMPLETED olunca proxy URL'lerle göster
      let tamamlandi = false;
      for (let deneme = 0; deneme < 40; deneme++) {
        await new Promise(r => setTimeout(r, 4000));
        const pollRes = await fetch(`/api/gorsel/poll?requestId=${data.requestId}`);
        const pollData = await pollRes.json();
        if (pollData.status === "COMPLETED") {
          const proxyGorseller = [0, 1, 2, 3].map((i) => `/api/gorsel/img?requestId=${data.requestId}&index=${i}`);
          setSosyalGorselSonuclar([{ stil: sosyalGorselStil, label: data.label, gorseller: proxyGorseller }]);
          tamamlandi = true;
          break;
        }
        if (pollData.status === "FAILED") {
          setHata(pollData.hata || "Görsel üretilemedi. Tekrar deneyin.");
          tamamlandi = true;
          break;
        }
      }
      if (!tamamlandi) setHata("Görsel üretilemedi, zaman aşımı. Tekrar deneyin.");
    } catch { setHata("Bir hata oluştu. Lütfen tekrar deneyin."); }
    setSosyalGorselYukleniyor(false);
  };

  return (
    <main className="min-h-screen bg-gray-50 pt-8 pb-24 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center gap-2">
            <Link href="/auth" className="flex-shrink-0">
              <img src="/yzliste_logo.png" alt="yzliste" className="h-9" />
            </Link>
            <nav className="hidden sm:flex items-center gap-0.5 text-sm text-gray-500 flex-1">
              <Link href="/auth" className="px-3 py-2 rounded-lg hover:bg-gray-100 hover:text-gray-800 transition-colors whitespace-nowrap">Ana Sayfa</Link>
              <Link href="/" className="px-3 py-2 rounded-lg text-indigo-600 font-medium whitespace-nowrap">İçerik</Link>
              <Link href="/fiyatlar" className="px-3 py-2 rounded-lg hover:bg-gray-100 hover:text-gray-800 transition-colors whitespace-nowrap">Fiyatlar</Link>
              <Link href="/blog" className="px-3 py-2 rounded-lg hover:bg-gray-100 hover:text-gray-800 transition-colors whitespace-nowrap">Blog</Link>
            </nav>
            <div className="flex items-center gap-2 flex-shrink-0">
              {kullanici ? (
                <>
                  <button onClick={() => paketModalAc()} className={`flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-full transition-colors ${kullanici.is_admin ? "bg-violet-100 text-violet-700" : krediDusuk ? "bg-amber-100 text-amber-600 animate-pulse" : "bg-indigo-100 text-indigo-600 hover:bg-indigo-200"}`}>
                    {kullanici.is_admin ? "∞" : (kredilerHook ?? kullanici.kredi)} kredi
                  </button>
                  {kullanici.anonim
                    ? <button onClick={() => { setAuthPopupMod("kayit"); setAuthPopupAcik(true); }} className="text-xs bg-indigo-500 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-indigo-600 transition-colors">Ücretsiz Başla</button>
                    : <span className="text-sm text-gray-400 hidden sm:block">{kullanici.email}</span>
                  }
                  {kullanici.is_admin && <a href="/admin" className="text-xs bg-violet-100 text-violet-600 px-2 py-1 rounded-lg font-medium">Admin</a>}
                  {!kullanici.anonim && <Link href="/profil" className="text-sm text-gray-400 hover:text-gray-600 hidden sm:block">Profil</Link>}
                  {!kullanici.anonim && <button onClick={cikisYap} className="text-sm text-gray-400 hover:text-gray-600 hidden sm:block">Çıkış</button>}
                </>
              ) : (
                <>
                  <button onClick={() => { setAuthPopupMod("giris"); setAuthPopupAcik(true); }} className="text-sm text-gray-500 hover:text-gray-700 font-medium hidden sm:block">Giriş Yap</button>
                  <button onClick={() => { setAuthPopupMod("kayit"); setAuthPopupAcik(true); }} className="text-sm bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-4 py-1.5 rounded-lg transition-colors hidden sm:block">Ücretsiz Başla</button>
                </>
              )}
              {/* Mobil hamburger */}
              <button
                onClick={() => setMobileMenuAcik(!mobileMenuAcik)}
                className="sm:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                aria-label="Menü"
              >
                {mobileMenuAcik ? "✕" : "☰"}
              </button>
            </div>
          </div>

          {/* Mobil dropdown */}
          {mobileMenuAcik && (
            <div className="sm:hidden mt-1 bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden">
              <nav className="px-2 py-3 space-y-1">
                <a href="/auth" onClick={() => setMobileMenuAcik(false)} className="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-colors">Ana Sayfa</a>
                <a href="/" onClick={() => setMobileMenuAcik(false)} className="block px-3 py-2 rounded-lg text-sm text-indigo-600 font-medium bg-indigo-50">İçerik</a>
                <a href="/fiyatlar" onClick={() => setMobileMenuAcik(false)} className="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-colors">Fiyatlar</a>
                <a href="/blog" onClick={() => setMobileMenuAcik(false)} className="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-colors">Blog</a>
                {kullanici && !kullanici.anonim && (
                  <div className="border-t border-gray-200 pt-2 mt-1 space-y-1">
                    <a href="/profil" className="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors">Profil</a>
                    <button onClick={cikisYap} className="block w-full text-left px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors">Çıkış</button>
                  </div>
                )}
                {(!kullanici || kullanici.anonim) && (
                  <div className="border-t border-gray-200 pt-2 mt-1 space-y-1">
                    <button onClick={() => { setAuthPopupMod("giris"); setAuthPopupAcik(true); setMobileMenuAcik(false); }} className="block w-full text-left px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors">Giriş Yap</button>
                    <button onClick={() => { setAuthPopupMod("kayit"); setAuthPopupAcik(true); setMobileMenuAcik(false); }} className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium bg-indigo-500 text-white text-center hover:bg-indigo-600 transition-colors rounded-lg">Ücretsiz Başla</button>
                  </div>
                )}
              </nav>
            </div>
          )}
        </div>

        {/* Compact hero — sadece giriş yapılmamışsa */}
        {(!kullanici || kullanici.anonim) && (
          <div className="bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 rounded-2xl px-6 py-7 mb-5 text-center">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">7 Pazaryeri için AI İçerik Üreticisi</h1>
            <p className="text-sm text-gray-500 mb-5">Trendyol, Hepsiburada, Amazon, Etsy ve daha fazlası için — başlık, açıklama, görsel ve video tek platformda.</p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <button onClick={() => { setAuthPopupMod("kayit"); setAuthPopupAcik(true); }} className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors">
                Ücretsiz Başla — 3 Kredi Hediye
              </button>
              <a href="/auth" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors">
                Detaylı bilgi →
              </a>
            </div>
          </div>
        )}

        {/* Giriş yok / anonim banner */}
        {(!kullanici || kullanici.anonim) && (
          <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 mb-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xl flex-shrink-0">🔒</span>
              <div>
                <p className="text-sm font-semibold text-indigo-800">İçerik üretmek için hesap gereklidir</p>
                <p className="text-xs text-indigo-600 mt-0.5">Ücretsiz hesap oluşturun, 3 kredi hediye edilsin — kredi kartı gerekmez.</p>
              </div>
            </div>
            <button onClick={() => { setAuthPopupMod("kayit"); setAuthPopupAcik(true); }} className="bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-semibold px-4 py-2 rounded-xl whitespace-nowrap transition-colors flex-shrink-0">
              Ücretsiz Başla
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
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xl">⚠️</span>
              <div>
                <p className="text-sm font-semibold text-amber-800">İçerik üretim krediniz azalıyor</p>
                <p className="text-xs text-amber-600 mt-0.5">{kullanici?.kredi} kredi kaldı — tükenince içerik üretemezsiniz.</p>
              </div>
            </div>
            <button onClick={() => paketModalAc()} className="bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-semibold px-4 py-2 rounded-xl whitespace-nowrap flex-shrink-0">Kredi Yükle</button>
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

        {/* F-23b: Onboarding banner — ilk kez kullananlar için */}
        {kullanici && !kullanici.anonim && kullanici.toplam_kullanilan === 0 && !sonuc && (
          <div className="mb-4 bg-indigo-50 border border-indigo-200 rounded-2xl p-4 flex items-start gap-3">
            <span className="text-2xl flex-shrink-0">🎉</span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-indigo-800">Hoş geldiniz! İşte nasıl başlayacağınız:</p>
              <ol className="mt-1 space-y-0.5 text-xs text-indigo-700">
                <li>1. <span className="font-medium">Platform seç</span> — Trendyol, Amazon, Etsy vb.</li>
                <li>2. <span className="font-medium">Ürün adı ve kategori gir</span> — mümkün olduğunca spesifik ol</li>
                <li>3. <span className="font-medium">Üret butonuna bas</span> — AI 15-30 saniyede listing hazırlar</li>
              </ol>
            </div>
            <button onClick={() => setKullanici(u => u ? { ...u, toplam_kullanilan: -1 } : null)} className="text-indigo-400 hover:text-indigo-600 text-lg flex-shrink-0">×</button>
          </div>
        )}

        <div className="flex gap-6 items-start flex-col lg:flex-row">
          <div className="flex-1 w-full">

            {/* SEKMELER */}
            <div className="bg-white rounded-2xl shadow p-1.5 flex gap-1">
              {([
                { id: "metin", label: "📝 Metin", renk: "bg-blue-500", aktif: true },
                { id: "gorsel", label: "📷 Görsel", renk: "bg-violet-500", aktif: true },
                { id: "sosyal", label: "📱 Sosyal Medya", renk: "bg-emerald-500", aktif: true },
                { id: "video", label: "🎬 Video", renk: "bg-amber-500", aktif: true },
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
                        { id: "metin", label: "📝 Metin", renk: "bg-blue-100 text-blue-600" },
                        { id: "gorsel", label: "📷 Görsel", renk: "bg-violet-100 text-violet-600" },
                        { id: "video", label: "🎬 Video", renk: "bg-amber-100 text-amber-600" },
                        { id: "sosyal", label: "📱 Sosyal", renk: "bg-emerald-100 text-emerald-600" },
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
                    <button onClick={() => { setFotolar([]); setGorselJoblar([]); }} className="text-xs text-gray-400 hover:text-red-500 transition-colors">Kaldır</button>
                  </div>
                </div>
              ) : (
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="w-14 h-14 rounded-xl border-2 border-dashed border-gray-200 group-hover:border-indigo-300 flex items-center justify-center transition-colors flex-shrink-0">
                    <span className="text-xl">📷</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 group-hover:text-indigo-600 transition-colors">Ürün fotoğrafı yükle</p>
                    <p className="text-xs text-gray-400 mt-0.5">Metin, Görsel, Video ve Sosyal sekmelerin hepsinde kullanılır</p>
                  </div>
                  <span className="text-xs text-gray-400 group-hover:text-indigo-500 transition-colors flex-shrink-0">Seç →</span>
                  <input type="file" accept="image/*" className="hidden" onChange={tekFotoSec} />
                </label>
              )}
            </div>

            {/* ===== METİN SEKMESİ ===== */}
            <div style={{display: anaSekme === "metin" ? "block" : "none"}} className="mt-4 bg-white rounded-2xl shadow p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-gray-800">📋 Listing İçeriği Üret</h2>
                <span className="text-xs text-blue-500 font-medium">1 içerik üretim kredisi</span>
              </div>

              {/* Giriş tipi */}
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Ürünü nasıl eklemek istersin?</p>
                <p className="text-xs text-gray-400 mb-2">İster yazarak, ister ürünün fotoğrafını çekerek, ister barkodunu taratarak, istersen Excel ile toplu yükleyerek içerik üretebilirsin.</p>
                <div className="grid grid-cols-4 gap-2">
                    {(["manuel", "foto", "barkod"] as const).map((tip) => (
                    <button key={tip} onClick={() => setGirisTipi(tip)}
                      className={`py-2 px-2 rounded-xl border-2 text-xs font-semibold transition-all ${girisTipi === tip ? "border-blue-400 bg-blue-50 text-blue-600" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}>
                      {tip === "manuel" ? "✏️ Manuel" : tip === "foto" ? "📷 Fotoğraf" : "🔍 Barkod"}
                    </button>
                  ))}
                  <a href="/toplu"
                    className="py-2 px-2 rounded-xl border-2 text-xs font-semibold transition-all border-gray-200 text-gray-500 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 text-center">
                    📊 Excel
                  </a>
                </div>
              </div>

              {/* Platform */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
                <select value={platform} onChange={(e) => { setPlatform(e.target.value); setDil(PLATFORM_BILGI[e.target.value]?.dil || "tr"); }} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
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

              {/* F-23a: Örnek ürün kartları */}
              {girisTipi === "manuel" && !urunAdi && (
                <div>
                  <p className="text-xs text-gray-400 mb-2">Hızlı başla — bir örnek seç:</p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { ikon: "🧴", label: "Kozmetik", urunAdi: "Hyaluronik Asit Nemlendirici Serum", kategori: "Cilt Bakımı / Kozmetik", ozellikler: "50ml, vegan formül, E vitamini ve aloe vera içerir, tüm cilt tipleri için, parfümsüz, doğrultanmış hyaluronik asit" },
                      { ikon: "👕", label: "Giyim", urunAdi: "Slim Fit Erkek Gömlek", kategori: "Giyim / Erkek", ozellikler: "% 100 pamuk, S/M/L/XL/XXL beden, beyaz/mavi/lacivert renk seçeneği, ütü gerektirmez, makinede yıkanabilir" },
                      { ikon: "🔌", label: "Elektronik", urunAdi: "65W GaN USB-C Hızlı Şarj Adaptörü", kategori: "Elektronik / Şarj Cihazı", ozellikler: "65W GaN teknoloji, 3 port (2×USB-C, 1×USB-A), tüm telefonlar/dizüstü uyumlu, akıllı güç yönetimi, UL sertifikalı" },
                    ].map((ornek) => (
                      <button key={ornek.label} onClick={() => { setUrunAdi(ornek.urunAdi); setKategori(ornek.kategori); setOzellikler(ornek.ozellikler); }}
                        className="text-left p-2.5 rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all">
                        <p className="text-base mb-0.5">{ornek.ikon}</p>
                        <p className="text-xs font-semibold text-gray-700">{ornek.label}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Manuel */}
              {girisTipi === "manuel" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ürün Adı <span className="text-red-400">*</span></label>
                    <input type="text" value={urunAdi} onChange={(e) => setUrunAdi(e.target.value)} placeholder={platformPh.urun} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kategori <span className="text-red-400">*</span> <span className="text-gray-400 font-normal text-xs">(fotoğraf yüklersen otomatik algılanır)</span></label>
                    <input type="text" value={kategori} onChange={(e) => setKategori(e.target.value)} placeholder={platformPh.kategori} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ek Bilgi <span className="text-gray-400 font-normal">(isteğe bağlı)</span></label>
                    <textarea value={ozellikler} onChange={(e) => setOzellikler(e.target.value)} placeholder={platformPh.ozellik} rows={3} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                    <p className="text-xs text-gray-400 mt-1">💡 Renk, beden, malzeme, garanti, kutu içeriği, güvenlik bilgisi — ne kadar çok bilgi girersen içerik o kadar spesifik olur; az bilgide sonuç genel kalabilir</p>
                  </div>

                  {/* Hedef Kitle */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hedef Kitle <span className="text-gray-400 font-normal">(isteğe bağlı)</span></label>
                    <select value={hedefKitle} onChange={(e) => setHedefKitle(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
                      <option value="genel">Genel</option>
                      <option value="kadinlar">Kadınlar</option>
                      <option value="erkekler">Erkekler</option>
                      <option value="gencler">Gençler (18-25)</option>
                      <option value="ebeveynler">Ebeveynler</option>
                      <option value="profesyoneller">Profesyoneller</option>
                      <option value="sporcular">Sporcular</option>
                    </select>
                  </div>

                  {/* Fiyat Segmenti */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fiyat Segmenti <span className="text-gray-400 font-normal">(isteğe bağlı)</span></label>
                    <div className="grid grid-cols-3 gap-2">
                      {(["butce", "orta", "premium"] as const).map((seg) => (
                        <button key={seg} type="button" onClick={() => setFiyatSegmenti(seg)}
                          className={`py-2 rounded-xl border-2 text-xs font-semibold transition-all ${fiyatSegmenti === seg ? "border-blue-400 bg-blue-50 text-blue-600" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}>
                          {seg === "butce" ? "💰 Bütçe" : seg === "orta" ? "⚖️ Orta" : "👑 Premium"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Anahtar Kelimeler */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Anahtar Kelimeler <span className="text-gray-400 font-normal">(isteğe bağlı)</span></label>
                    <input type="text" value={anahtarKelimeler} onChange={(e) => setAnahtarKelimeler(e.target.value)}
                      placeholder="örn: kışlık bot, su geçirmez ayakkabı, erkek outdoor"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                    <p className="text-xs text-gray-400 mt-1">💡 Arama sonuçlarında çıkmak istediğin kelimeler — AI bunları başlık ve açıklamaya doğal yerleştirir</p>
                  </div>

                  {/* F-11b: Markalı ürün checkbox */}
                  <label className="flex items-start gap-3 cursor-pointer bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                    <input type="checkbox" checked={markaliUrun} onChange={(e) => setMarkaliUrun(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-gray-300 text-amber-500 focus:ring-amber-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">Bu ürün markalı ve ben yetkili satıcıyım</p>
                      <p className="text-xs text-gray-500 mt-0.5">İşaretlersen AI marka adını içeriğe dahil edebilir. İşaretlemezsen jenerik ifadeler kullanır.</p>
                    </div>
                  </label>
                </>
              )}

              {/* Fotoğraf */}
              {girisTipi === "foto" && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kategori <span className="text-gray-400 font-normal">(isteğe bağlı)</span></label>
                    <input type="text" value={kategori} onChange={(e) => setKategori(e.target.value)} placeholder="örn: Ayakkabı & Çanta / Erkek Bot" className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
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
                    <textarea value={ozellikler} onChange={(e) => setOzellikler(e.target.value)} placeholder="örn: kışlık, su geçirmez, 42 numara, garanti belgeli" rows={2} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                  </div>
                </div>
              )}

              {/* Barkod */}
              {girisTipi === "barkod" && (
                <div className="space-y-3">
                  {!kameraAcik && !barkodBilgi && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-center space-y-3">
                      <div className="text-3xl">🔍</div>
                      <p className="text-sm text-gray-600">Ürünün barkodunu kameraya göster, bilgiler otomatik dolacak.</p>
                      <button onClick={kameraAc} className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-5 py-2 rounded-xl transition-colors">
                        📷 Kamerayı Aç
                      </button>
                    </div>
                  )}
                  {kameraAcik && (
                    <div className="space-y-2">
                      <div id="barkod-okuyucu" className="w-full rounded-xl overflow-hidden" />
                      {barkodYukleniyor && <p className="text-center text-sm text-gray-500 animate-pulse">🔄 Ürün sorgulanıyor...</p>}
                      <button onClick={kameraKapat} className="w-full text-xs text-gray-400 hover:text-gray-600 py-1 transition-colors">
                        ✕ Kamerayı Kapat
                      </button>
                    </div>
                  )}
                  {barkodBilgi && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 space-y-1">
                      <p className="text-sm font-semibold text-green-700">✅ Ürün Tanındı</p>
                      <p className="text-sm text-gray-700"><span className="font-medium">İsim:</span> {barkodBilgi.isim}</p>
                      {barkodBilgi.marka && <p className="text-sm text-gray-600"><span className="font-medium">Marka:</span> {barkodBilgi.marka}</p>}
                      {barkodBilgi.kategori && <p className="text-sm text-gray-600"><span className="font-medium">Kategori:</span> {barkodBilgi.kategori}</p>}
                      <button onClick={() => { setBarkodBilgi(null); setUrunAdi(""); setKategori(""); setOzellikler(""); }} className="text-xs text-blue-500 hover:text-blue-700 underline mt-1 transition-colors">
                        Tekrar Tara
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Üret butonu */}
              <button onClick={icerikUret} disabled={!uretButonAktif} className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-semibold py-3 rounded-xl transition-colors">
                {yukleniyor ? `⏳ ${yukleniyorMesajlari[yukleniyorMesaj]}` : `İçerik Üret — ${kullanici?.is_admin ? "∞" : "1"} kredi`}
              </button>

              <p className="text-xs text-gray-400 text-center">💡 yzliste her platformun karakter limiti ve SEO kuralına göre üretir ancak pazaryeri kuralları sık değişir — yayınlamadan önce içeriği kontrol etmeni öneririz</p>

              {!yukleniyor && !kullanici?.is_admin && (kullanici?.kredi ?? 0) <= 0 && (
                <p className="text-center text-xs text-red-500">İçerik üretim krediniz bitti. <button onClick={() => paketModalAc()} className="underline font-medium">Kredi satın al →</button></p>
              )}

              {yukleniyor && (
                <div className="bg-white rounded-2xl shadow p-8 text-center space-y-4">
                  <div className="flex justify-center"><div className="w-10 h-10 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin" /></div>
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

                  {/* F-12a: Mikro-aksiyonlar */}
                  {(() => {
                    const mikro = async (aksiyon: string) => {
                      if (!kullanici || duzenleYukleniyor) return;
                      setDuzenleYukleniyor(true);
                      const res = await fetch("/api/uret/duzenle", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ sonuc, aksiyon, userId: kullanici.id }),
                      });
                      const data = await res.json();
                      if (data.sonuc) setSonuc(data.sonuc);
                      setDuzenleYukleniyor(false);
                    };
                    return (
                      <div className="flex flex-wrap gap-2 px-1">
                        <button onClick={async () => {
                          if (!kullanici || yukleniyor || duzenleYukleniyor) return;
                          if (uretimId && yenidenUretHakki > 0) {
                            // Ücretsiz yeniden üret
                            setDuzenleYukleniyor(true);
                            const res = await fetch("/api/uret/duzenle", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sonuc, aksiyon: "yeniden_uret_context", userId: kullanici.id }) });
                            const data = await res.json();
                            if (data.sonuc) { setSonuc(data.sonuc); setYenidenUretHakki(h => h - 1); }
                            setDuzenleYukleniyor(false);
                          } else {
                            icerikUret();
                          }
                        }} disabled={yukleniyor || duzenleYukleniyor} className="flex items-center gap-1 text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-3 py-1.5 rounded-lg border border-indigo-200 transition-colors disabled:opacity-40">
                          🔁 Yeniden üret{uretimId && yenidenUretHakki > 0 ? ` (${yenidenUretHakki} ücretsiz)` : ""}
                        </button>
                        <button onClick={() => mikro("kisalt")} disabled={duzenleYukleniyor || yukleniyor} className="flex items-center gap-1 text-xs bg-gray-50 hover:bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg border border-gray-200 transition-colors disabled:opacity-40">
                          {duzenleYukleniyor ? "⏳" : "✂️"} Kısalt
                        </button>
                        <button onClick={() => mikro("genislet")} disabled={duzenleYukleniyor || yukleniyor} className="flex items-center gap-1 text-xs bg-gray-50 hover:bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg border border-gray-200 transition-colors disabled:opacity-40">
                          ➕ Genişlet
                        </button>
                        <button onClick={() => mikro("ton_samimi")} disabled={duzenleYukleniyor || yukleniyor} className="flex items-center gap-1 text-xs bg-gray-50 hover:bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg border border-gray-200 transition-colors disabled:opacity-40">
                          🎭 Samimi
                        </button>
                        <button onClick={() => mikro("ton_resmi")} disabled={duzenleYukleniyor || yukleniyor} className="flex items-center gap-1 text-xs bg-gray-50 hover:bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg border border-gray-200 transition-colors disabled:opacity-40">
                          🎭 Resmi
                        </button>
                      </div>
                    );
                  })()}

                  {/* F-10c: Platform uyumluluk rozeti */}
                  {(() => {
                    const baslik = sonucBolumleri.find(b => b.baslik === "Başlık")?.icerik ?? "";
                    const pb = platformBilgi;
                    const baslikUzunluk = baslik.length;
                    const baslikUygun = baslikUzunluk > 0 && baslikUzunluk <= pb.baslikLimit;
                    const platformAdi = { trendyol: "Trendyol", hepsiburada: "Hepsiburada", amazon: "Amazon TR", n11: "N11", etsy: "Etsy", amazon_usa: "Amazon USA" }[platform] ?? platform;
                    const tumuygun = baslikUygun;
                    if (!baslik) return null;
                    return (
                      <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium ${tumuygun ? "bg-emerald-50 border border-emerald-200 text-emerald-700" : "bg-amber-50 border border-amber-200 text-amber-700"}`}>
                        <span>{tumuygun ? "✓" : "⚠️"}</span>
                        <span className="flex-1">
                          {tumuygun
                            ? `${platformAdi} kurallarına uygun — Başlık ${baslikUzunluk}/${pb.baslikLimit} karakter`
                            : `Başlık ${baslikUzunluk} karakter — ${platformAdi} limiti ${pb.baslikLimit} karakter`}
                        </span>
                      </div>
                    );
                  })()}
                  {/* F-11d: Marka/IP uyarısı */}
                  {!markaliUrun && (() => {
                    const BILINEN_MARKALAR = /\b(Apple|Samsung|Nike|Adidas|Sony|LG|Philips|Tefal|Bosch|Siemens|Dyson|Stanley|Tupperware|Lego|Canon|Nikon|Braun|Arçelik|Vestel|Beko|Xiaomi|Huawei|Lenovo|Asus|Microsoft|Google)\b/gi;
                    const eslesmeler = sonuc.match(BILINEN_MARKALAR);
                    if (!eslesmeler) return null;
                    const tekil = [...new Set(eslesmeler.map(m => m.trim()))];
                    return (
                      <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-red-50 border border-red-200">
                        <span className="text-red-500 flex-shrink-0">⚠️</span>
                        <div>
                          <p className="text-xs font-semibold text-red-700">Marka/IP Uyarısı</p>
                          <p className="text-xs text-red-600 mt-0.5">Tespit edilen marka adı: <span className="font-medium">{tekil.join(", ")}</span>. Yetkili satıcı değilseniz içeriği gözden geçirin.</p>
                        </div>
                      </div>
                    );
                  })()}

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
                <span className="text-xs text-violet-500 font-medium">Stil başına 1 kredi · 1 stil = 1 görsel</span>
              </div>

              {/* Metin sekmesinden taşınan ürün bilgisi */}
              {urunAdi && (
                <div className="bg-violet-50 border border-violet-200 rounded-xl px-3 py-2 flex items-center gap-2">
                  <span className="text-violet-400 text-sm">🔗</span>
                  <p className="text-xs text-violet-700 flex-1 min-w-0 truncate">
                    <span className="font-medium">{urunAdi}</span>
                    {kategori && <span className="text-violet-400"> · {kategori}</span>}
                  </p>
                  <span className="text-xs text-violet-400 whitespace-nowrap">Metin sekmesinden</span>
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
                Tek fotoğraftan 7 farklı stüdyo stili. Seçtiğin her stil için 1 görsel üretilir, kredi üretimde düşer.{" "}
                <span className="text-xs text-gray-400">  <br /> Örnek: 1 stil seçersen → 1 görsel, 1 kredi <br />3 stil seçersen → 3 görsel, 3 kredi</span>
              </p>

              {fotolar.length === 0 ? (
                <FotoEkleAlani id="gorsel-foto-input" onChange={fotoSec} renk="purple" metin="Ürün fotoğrafı yükle" ikon="📷" altMetin="Arka planı kaldırıp 7 farklı stilde stüdyo görseli üretiriz" />
              ) : (
                <FotoThumbnail src={fotolar[0]} onKaldir={() => fotoKaldir(0)} renk="green" />
              )}
              <p className="text-xs text-gray-400">
                📸 En iyi sonuç için nasıl fotoğraf çekilmeli?{" "}
                <a href="/blog/ai-gorsel-uretimi-e-ticaret" target="_blank" className="text-violet-500 hover:underline font-medium">
                  Rehberi oku →
                </a>
              </p>

              <div>
                <p className="block text-xs font-medium text-gray-600 mb-2">Stil seç <span className="text-gray-400 font-normal">(1 stil = 1 görsel = 1 kredi)</span></p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(() => {
                    const GORSEL_STILLER = [
                      { id: "beyaz", label: "⬜ Beyaz Zemin", aciklama: "Trendyol standart", img: "/ornek_beyaz.jpg", kategoriler: ["kozmetik", "elektronik", "cocuk", "giyim"] },
                      { id: "koyu", label: "⬛ Koyu Zemin", aciklama: "Premium / elektronik", img: "/ornek_koyu.jpg", kategoriler: ["elektronik", "taki"] },
                      { id: "lifestyle", label: "🏠 Lifestyle", aciklama: "Gerçek ortam", img: "/ornek_lifestyle.jpg", kategoriler: ["giyim", "ev", "gida"] },
                      { id: "mermer", label: "🪨 Mermer", aciklama: "Lüks / kozmetik", img: "/ornek_mermer.jpg", kategoriler: ["kozmetik", "taki"] },
                      { id: "ahsap", label: "🪵 Ahşap", aciklama: "El yapımı / organik", img: "/ornek_ahsap.jpg", kategoriler: ["gida", "ev", "spor"] },
                      { id: "gradient", label: "🎨 Gradient", aciklama: "Modern / teknoloji", img: "/ornek_gradient.jpg", kategoriler: ["elektronik", "cocuk", "kozmetik"] },
                      { id: "dogal", label: "🌿 Doğal", aciklama: "Açık hava / taze", img: "/ornek_dogal.jpg", kategoriler: ["gida", "spor", "ev"] },
                      { id: "ozel", label: "✏️ Sahneni Yaz", aciklama: "Prompt ile tanımla", img: null as string | null, kategoriler: [] as string[] },
                      { id: "referans", label: "🖼️ Arka Plan", aciklama: "Fotoğraf yükle", img: null as string | null, kategoriler: [] as string[] },
                    ];
                    const gorselKategoriKodu = (() => {
                      const k = (kategori || "").toLowerCase();
                      if (/kozmetik|parfüm|cilt|bakım|makyaj|serum|krem|şampuan/i.test(k)) return "kozmetik";
                      if (/elektron|telefon|bilgisayar|tablet|kulaklık|şarj|kamera|tv|monitör/i.test(k)) return "elektronik";
                      if (/giyim|ayakkabı|çanta|elbise|tişört|pantolon|ceket|kazak|gömlek|bot|sneaker/i.test(k)) return "giyim";
                      if (/gıda|yiyecek|içecek|kahve|çay|bal|zeytinyağı|baharat|atıştırmalık/i.test(k)) return "gida";
                      if (/ev|mutfak|dekor|mobilya|aydınlatma|halı|perde|tencere|bardak/i.test(k)) return "ev";
                      if (/spor|fitness|outdoor|kamp|bisiklet|yoga|koşu|dağ/i.test(k)) return "spor";
                      if (/çocuk|bebek|oyuncak|mama|biberon/i.test(k)) return "cocuk";
                      if (/takı|mücevher|yüzük|kolye|bilezik|küpe/i.test(k)) return "taki";
                      return null;
                    })();
                    const sirali = gorselKategoriKodu
                      ? [
                          ...GORSEL_STILLER.filter(s => s.kategoriler.includes(gorselKategoriKodu)),
                          ...GORSEL_STILLER.filter(s => !s.kategoriler.includes(gorselKategoriKodu) && s.kategoriler.length > 0),
                          ...GORSEL_STILLER.filter(s => s.kategoriler.length === 0),
                        ]
                      : GORSEL_STILLER;
                    return sirali.map((s) => (
                    <button key={s.id} onClick={() => stilToggle(s.id)}
                      className={`flex flex-col rounded-xl overflow-hidden border-2 transition-all text-left ${seciliStiller.has(s.id) ? "border-violet-500 shadow-md" : "border-gray-200 hover:border-violet-300"}`}>
                      {s.img ? (
                        <div className="aspect-square w-full overflow-hidden relative bg-gray-50">
                          <img src={s.img} alt={s.label} className="w-full h-full object-contain" />
                          {seciliStiller.has(s.id) && <div className="absolute inset-0 bg-violet-500/20 flex items-center justify-center"><span className="bg-violet-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">✓</span></div>}
                        </div>
                      ) : (
                        <div className={`aspect-square w-full flex items-center justify-center text-2xl ${seciliStiller.has(s.id) ? "bg-violet-100" : "bg-gray-50"}`}>{s.id === "ozel" ? "✏️" : "🖼️"}</div>
                      )}
                      <div className="p-2 bg-white w-full">
                        <p className={`text-xs font-semibold ${seciliStiller.has(s.id) ? "text-violet-600" : "text-gray-700"}`}>{s.label}</p>
                        <p className="text-xs text-gray-400">{s.aciklama}</p>
                      </div>
                    </button>
                  ));
                  })()}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Görsel yönlendirmesi <span className="text-gray-400 font-normal">(isteğe bağlı)</span></label>
                <textarea value={gorselEkPrompt} onChange={(e) => setGorselEkPrompt(e.target.value)} placeholder="Sahneyi tanımla — örn: mermer masa üzerinde yumuşak pencere ışığı, yeşil bitkilerle / rustik ahşap raf, sıcak mum ışığı / pastel pembe gradyan arka plan, uçuşan balonlar" rows={2} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400" />
              </div>

              {seciliStiller.has("referans") && (
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Arka plan fotoğrafı <span className="text-gray-400 font-normal">(ürünü bu arka plana yerleştirelim)</span></label>
                  {referansGorsel ? (
                    <div className="relative w-32 h-32 rounded-xl overflow-hidden border-2 border-violet-300">
                      <img src={referansGorsel} alt="Referans" className="w-full h-full object-cover" />
                      <button onClick={() => setReferansGorsel(null)} className="absolute top-1 right-1 bg-red-500 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center">×</button>
                    </div>
                  ) : (
                    <label className="flex items-center justify-center w-full h-24 border-2 border-dashed border-violet-300 rounded-xl cursor-pointer hover:bg-violet-50 transition-colors">
                      <span className="text-sm text-violet-400">🖼️ Arka plan fotoğrafı yükle</span>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = () => setReferansGorsel(reader.result as string);
                        reader.readAsDataURL(file);
                      }} />
                    </label>
                  )}
                </div>
              )}

              <button onClick={gorselUret} disabled={gorselYukleniyor || seciliStiller.size === 0 || fotolar.length === 0}
                className="w-full bg-violet-500 hover:bg-violet-600 disabled:bg-gray-300 text-white font-semibold py-3 rounded-xl transition-colors">
                {gorselYukleniyor
                  ? `⏳ ${seciliStiller.size} görsel üretiliyor...`
                  : fotolar.length === 0
                    ? "Önce fotoğraf ekle ↑"
                    : seciliStiller.size === 0
                      ? "Stil seç"
                      : `✨ ${seciliStiller.size} Görsel Üret — ${seciliStiller.size} kredi`}
              </button>

              {gorselYukleniyor && (
                <p className="text-xs text-violet-600 text-center">Sayfayı kapatmayın — görsel üretimi yaklaşık 1 dakika sürer</p>
              )}

              <p className="text-xs text-gray-400 text-center">⚠️ AI hata yapabilir — üretilen görselleri yayınlamadan önce kontrol edin</p>

              {gorselJoblar.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <p className="text-xs text-gray-500 font-medium">✅ {gorselJoblar.length} görsel hazır</p>
                    {gorselJoblar.length > 1 && (
                      <button onClick={async () => {
                        if (!kullanici) return;
                        const res = await fetch("/api/gorsel/download", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ requestIds: gorselJoblar.map(j => j.requestId), userId: kullanici.id }),
                        });
                        const blob = await res.blob();
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url; a.download = "yzliste-gorseller.zip"; a.click();
                        URL.revokeObjectURL(url);
                      }}
                        className="flex items-center gap-1.5 text-xs bg-violet-500 hover:bg-violet-600 text-white font-semibold px-3 py-1.5 rounded-lg transition-colors">
                        📦 Tümünü İndir (ZIP)
                      </button>
                    )}
                  </div>
                  <div className={`grid gap-3 ${gorselJoblar.length === 1 ? "grid-cols-1" : gorselJoblar.length === 2 ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-3"}`}>
                    {gorselJoblar.map((job) => (
                      <div key={job.requestId} className="space-y-1.5">
                        <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-50 relative group">
                          <img
                            src={`/api/gorsel/img?requestId=${job.requestId}&index=0`}
                            alt={job.label}
                            className="w-full aspect-square object-cover select-none"
                            draggable={false}
                            onContextMenu={(e) => e.preventDefault()}
                          />
                          <button onClick={async () => {
                            if (!kullanici) return;
                            const res = await fetch("/api/gorsel/download", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ requestIds: [job.requestId], userId: kullanici.id }),
                            });
                            const blob = await res.blob();
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement("a");
                            a.href = url; a.download = `yzliste-${job.stil}.jpg`; a.click();
                            URL.revokeObjectURL(url);
                          }}
                            className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 hover:bg-white text-violet-600 text-xs font-semibold px-2 py-1 rounded-lg shadow">
                            ⬇️ İndir
                          </button>
                        </div>
                        <div className="flex items-center justify-between px-1">
                          <p className="text-xs text-gray-500 font-medium">{job.label}</p>
                          <button onClick={async () => {
                            if (!kullanici) return;
                            if (!kullanici.is_admin && kullanici.kredi < 1) { paketModalAc(); return; }
                            const resizedFoto = await resizeFoto(fotolar[0]);
                            const res = await fetch("/api/gorsel", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ foto: resizedFoto, stiller: [job.stil], ekPrompt: gorselEkPrompt, userId: kullanici.id, referansGorsel }),
                            });
                            const data = await res.json();
                            if (!data.jobs?.[0]) return;
                            if (!kullanici.is_admin) {
                              setKullanici(k => k ? { ...k, kredi: Math.max(0, k.kredi - 1) } : k);
                              invalidateCredits();
                            }
                            const newJob = data.jobs[0];
                            for (let d = 0; d < 40; d++) {
                              await new Promise(r => setTimeout(r, 4000));
                              const pollRes = await fetch(`/api/gorsel/poll?requestId=${newJob.requestId}`);
                              const pollData = await pollRes.json();
                              if (pollData.status === "COMPLETED") {
                                setGorselJoblar(prev => prev.map(j => j.requestId === job.requestId ? newJob : j));
                                break;
                              }
                              if (pollData.status === "FAILED") {
                                alert(pollData.hata || "Görsel üretilemedi, tekrar deneyin.");
                                break;
                              }
                            }
                          }}
                            className="text-xs text-violet-400 hover:text-violet-600 transition-colors">
                            🔄 Tekrar (1 kr)
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ===== VIDEO SEKMESİ ===== */}
            <div style={{display: anaSekme === "video" ? "block" : "none"}} className="mt-4 bg-white rounded-2xl shadow p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-gray-800">🎬 Ürün Videosu Üret</h2>
                <span className="text-xs text-amber-500 font-medium">{videoSure === "10" ? "8" : "5"} içerik üretim kredisi</span>
              </div>
              <p className="text-xs text-gray-400">Ürün fotoğrafından kısa tanıtım videosu — pazaryerleri, Reels, TikTok ve YouTube için</p>

              {/* Metin sekmesinden taşınan ürün bilgisi */}
              {urunAdi && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 flex items-center gap-2">
                  <span className="text-amber-400 text-sm">🔗</span>
                  <p className="text-xs text-amber-700 flex-1 min-w-0 truncate">
                    <span className="font-medium">{urunAdi}</span>
                    {kategori && <span className="text-amber-500"> · {kategori}</span>}
                  </p>
                  <span className="text-xs text-amber-400 whitespace-nowrap">Metin sekmesinden</span>
                </div>
              )}

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
                <span className="text-amber-500 flex-shrink-0 mt-0.5">⚡</span>
                <div>
                  <p className="text-xs font-semibold text-amber-700">Kredi üretilince düşer</p>
                  <p className="text-xs text-amber-600 mt-0.5">Video AI işlem gücü gerektiriyor. Üretim ~2 dakika sürer.</p>
                </div>
              </div>

              {!fotolar[0] ? (
                <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-4 text-center text-xs text-gray-400">
                  Yukarıdan ürün fotoğrafı yükle ↑
                </div>
              ) : (
                <FotoThumbnail src={fotolar[0]} onKaldir={() => { setFotolar([]); setGorselJoblar([]); }} renk="green" />
              )}

              {/* Format seçimi */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">Video Formatı</label>
                <div className="grid grid-cols-2 gap-2">
                  {([
                    { id: "9:16", label: "📱 Dikey (9:16)", aciklama: "Instagram Reels · TikTok" },
                    { id: "16:9", label: "🖥️ Yatay (16:9)", aciklama: "YouTube · Facebook · Pazaryeri" },
                  ] as { id: "9:16" | "16:9"; label: string; aciklama: string }[]).map((f) => (
                    <button key={f.id} onClick={() => setVideoFormat(f.id)}
                      className={`p-3 rounded-xl border-2 text-left transition-all ${videoFormat === f.id ? "border-amber-400 bg-amber-50" : "border-gray-200 hover:border-gray-300"}`}>
                      <p className={`text-xs font-semibold ${videoFormat === f.id ? "text-amber-700" : "text-gray-700"}`}>{f.label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{f.aciklama}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Süre seçimi */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">Video Süresi</label>
                <div className="grid grid-cols-2 gap-2">
                  {([
                    { id: "5", label: "⚡ 5 Saniye", kredi: 5, aciklama: "Hızlı tanıtım · Reels ideal" },
                    { id: "10", label: "🎞️ 10 Saniye", kredi: 8, aciklama: "Detaylı showcase · Pazaryeri" },
                  ] as { id: "5" | "10"; label: string; kredi: number; aciklama: string }[]).map((s) => (
                    <button key={s.id} onClick={() => setVideoSure(s.id)}
                      className={`p-3 rounded-xl border-2 text-left transition-all ${videoSure === s.id ? "border-amber-400 bg-amber-50" : "border-gray-200 hover:border-gray-300"}`}>
                      <div className="flex items-center justify-between mb-0.5">
                        <p className={`text-xs font-semibold ${videoSure === s.id ? "text-amber-700" : "text-gray-700"}`}>{s.label}</p>
                        <span className={`text-xs font-bold ${videoSure === s.id ? "text-amber-500" : "text-gray-400"}`}>{s.kredi} kredi</span>
                      </div>
                      <p className="text-xs text-gray-400">{s.aciklama}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Hareket tarifi */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Hareket & sahne tarifi <span className="text-gray-400 font-normal">(isteğe bağlı — Türkçe yazabilirsin)</span></label>
                {(() => {
                  const VIDEO_PRESETLER = [
                    { etiket: "360° Dönüş", aciklama: "Ürün kendi ekseni etrafında yavaşça döner. Tüm açılar görünür.", ikon: "🔄", goster: "Ürün temiz zemin üzerinde 180° yavaşça döner, yumuşak stüdyo ışığı, beyaz arka plan", deger: "Product slowly rotates 180 degrees on a clean surface, smooth and steady, then gently settles back to its original position, soft even studio lighting, white background", kategoriler: ["tumu"] },
                    { etiket: "Zoom Yaklaşım", aciklama: "Kamera ürüne doğru yavaş yaklaşır. Detay ve doku hissi verir.", ikon: "🔍", goster: "Kamera 3 saniyede ürüne yaklaşır, doku ve yüzey detayları ortaya çıkar, arka plan yumuşak odak dışı", deger: "Camera smoothly zooms in from medium shot to close-up over 3 seconds, revealing product texture and surface details, then holds steady for 2 seconds, soft focus background gradually blurs more", kategoriler: ["tumu"] },
                    { etiket: "Dramatik Işık", aciklama: "Karanlık sahnede spotlight açılır. Premium görünüm.", ikon: "💡", goster: "Karanlık sahne, yumuşak tepe ışığı 3 saniyede kademeli açılır, yüzeyde hafif yansıma, lüks sinematik his", deger: "Dark scene, then soft overhead light gradually fades in illuminating the product over 3 seconds, light reaches full brightness and holds steady, subtle reflection on surface beneath product, luxury cinematic feel", kategoriler: ["tumu"] },
                    { etiket: "Doğal Ortam", aciklama: "Açık havada altın saat ışığında huzurlu sunum.", ikon: "🌿", goster: "Ürün doğal taş zemin üzerinde, altın saat güneşi soldan sağa kayar, arka planda tek yaprak geçer, huzurlu son sahne", deger: "Product sits on a natural stone surface outdoors, warm golden hour sunlight slowly shifts across the frame from left to right then settles, one single leaf gently drifts past in background and exits frame, scene becomes peaceful and still", kategoriler: ["tumu"] },
                    { etiket: "Detay Tarama", aciklama: "Kamera yüzeyi tarayarak detayları gösterir.", ikon: "🔬", goster: "Kamera ürün yüzeyini soldan sağa yavaş tarar, doku detayları ortaya çıkar, sonra geri çekilerek tam görünüm", deger: "Camera slowly tracks across the product surface from left to right revealing textures and details, then pulls back slightly to show full product and holds, clean studio lighting", kategoriler: ["tumu", "elektronik"] },
                    { etiket: "Parıltı Reveal", aciklama: "Altın parçacıklar arasında ürün beliriyor. Kozmetik & parfüm için.", ikon: "✨", goster: "Kamera ürüne yaklaşırken altın parçacıklar 3 saniye yavaşça düşer ve solar, ürün odağa gelir, sıcak pembe güzellik ışığı", deger: "Camera slowly moves in toward the product as soft golden particles drift downward for 3 seconds then fade away, product comes into sharp focus and holds steady, warm pink-toned beauty lighting", kategoriler: ["kozmetik"] },
                    { etiket: "Lüks Mermer", aciklama: "Mermer yüzeyde zarif sunum. Premium kozmetik hissi.", ikon: "💎", goster: "Ürün beyaz mermer üzerinde, kamera 3 saniyede soldan merkeze kayar, mermer yüzeyde yumuşak yansıma, zarif minimal kompozisyon", deger: "Product sits on white marble surface, camera slowly pans from left to center over 3 seconds then stops, soft overhead light creates gentle reflection on marble, elegant minimal composition", kategoriler: ["kozmetik", "taki"] },
                    { etiket: "Tech Reveal", aciklama: "Koyu arka planda LED vurgulu teknoloji sunumu.", ikon: "🔵", goster: "Koyu sahne, mavi LED ışık bir anda parlar ve beyaza döner, kamera sağa kayarak ürün profilini açar, koyu arka plan", deger: "Dark scene, cool blue accent light glows briefly on one side of the product then fades to warm white, camera smoothly pans right revealing the product profile, then holds steady, dark background", kategoriler: ["elektronik"] },
                    { etiket: "Kumaş Hareketi", aciklama: "Hafif rüzgar kumaşı oynatır. Giyim & tekstil için.", ikon: "👕", goster: "Hafif esinti 2 saniye kumaşı hareket ettirir, doğal sarkma oluşturur, sonra yerleşir, soldaki stüdyo ışığı, sabit kamera", deger: "Soft breeze gently moves the fabric for 2 seconds creating natural drape movement, then fabric settles smoothly into place, clean studio lighting from the left, camera stays steady on tripod", kategoriler: ["giyim"] },
                    { etiket: "Lezzet Çekimi", aciklama: "Üstten aşağı çekim, sıcak buhar efekti. Gıda için.", ikon: "🍽️", goster: "Kamera sıcak ahşap yüzeydeki ürünün tam üstünden yavaş iner, hafif buhar çıkar ve dağılır, altın iştah açıcı ışıklandırma", deger: "Camera slowly descends from directly above looking down at the product on warm wooden surface, gentle wisp of steam rises briefly then dissipates, warm appetizing golden lighting, scene becomes still", kategoriler: ["gida"] },
                    { etiket: "Taze His", aciklama: "Doğal ışıkta taze ve organik sunum.", ikon: "🌱", goster: "Ürünün yanında küçük yeşil ot dalı, doğal gün ışığı 2 saniyede parlar, taze minimal kompozisyon, yüzeyde tek su damlası", deger: "Product on light surface with small green herb sprig beside it, soft natural daylight slowly brightens over 2 seconds then holds steady, fresh clean minimal composition, one water droplet visible on surface", kategoriler: ["gida"] },
                    { etiket: "Işıltı Dönüş", aciklama: "Spotlight altında yavaş dönüş, pırıltı yansımaları.", ikon: "💍", goster: "Ürün koyu kadife üzerinde 90° döner, tek spot ışık yüzeyde pırıltılar oluşturur, sonra yerleşir, lüks koyu arka plan", deger: "Product on dark velvet surface rotates slowly 90 degrees, single spotlight creates sparkle reflections that shimmer across facets, then product settles and reflections calm, luxurious dark background", kategoriler: ["taki"] },
                    { etiket: "Neşeli Sunum", aciklama: "Renkli ve eğlenceli, çocuk ürünleri için.", ikon: "🎈", goster: "Ürün yumuşak zemine hafifçe sekerler ve yerleşir, 3 renkli konfeti parçası kısa süre yağar ve kaybolur, neşeli stüdyo ışığı", deger: "Product bounces lightly once on soft surface and settles into place with a gentle wobble, 3 small colorful confetti pieces drift down briefly then scene clears, bright cheerful even studio lighting", kategoriler: ["cocuk"] },
                    { etiket: "Dinamik Reveal", aciklama: "Enerjik ve hızlı, spor ürünleri için.", ikon: "⚡", goster: "Dinamik kamera itiş ve geri çekiliş 3 saniyede tam görünümü açar, hareket bulanıklığı keskin odağa döner, enerjik stüdyo ışığı", deger: "Quick dynamic camera push toward the product then pulls back smoothly to reveal full view over 3 seconds, motion blur at start clears to sharp focus, energetic bright studio lighting, clean background", kategoriler: ["spor"] },
                  ];
                  const seciliKategoriKodu = (() => {
                    const k = (kategori || "").toLowerCase();
                    if (/kozmetik|parfüm|cilt|bakım|makyaj|serum|krem|şampuan/i.test(k)) return "kozmetik";
                    if (/elektron|telefon|bilgisayar|tablet|kulaklık|şarj|kamera|tv|monitör/i.test(k)) return "elektronik";
                    if (/giyim|ayakkabı|çanta|elbise|tişört|pantolon|ceket|kazak|gömlek|bot|sneaker/i.test(k)) return "giyim";
                    if (/gıda|yiyecek|içecek|kahve|çay|bal|zeytinyağı|baharat|atıştırmalık/i.test(k)) return "gida";
                    if (/spor|fitness|outdoor|kamp|bisiklet|yoga|koşu|dağ/i.test(k)) return "spor";
                    if (/çocuk|bebek|oyuncak|mama|biberon/i.test(k)) return "cocuk";
                    if (/takı|mücevher|yüzük|kolye|bilezik|küpe/i.test(k)) return "taki";
                    return null;
                  })();
                  const gosterilecekler = seciliKategoriKodu
                    ? VIDEO_PRESETLER.filter(p => p.kategoriler.includes(seciliKategoriKodu) || p.kategoriler.includes("tumu")).slice(0, 6)
                    : VIDEO_PRESETLER.filter(p => p.kategoriler.includes("tumu"));
                  return (
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      {gosterilecekler.map((p) => (
                        <button key={p.etiket} onClick={() => { setVideoPrompt(p.deger); setVideoPromptGoster(p.goster); }}
                          className={`text-left p-2.5 rounded-xl border-2 transition-all ${videoPrompt === p.deger ? "border-amber-400 bg-amber-50" : "border-gray-200 hover:border-amber-200 hover:bg-amber-50/50"}`}>
                          <p className={`text-xs font-semibold ${videoPrompt === p.deger ? "text-amber-700" : "text-gray-700"}`}>{p.ikon} {p.etiket}</p>
                          <p className="text-[10px] text-gray-500 mt-0.5 leading-relaxed">{p.aciklama}</p>
                        </button>
                      ))}
                    </div>
                  );
                })()}
                <textarea value={videoPromptGoster} onChange={(e) => { setVideoPromptGoster(e.target.value); setVideoPrompt(e.target.value); }} placeholder="örn: Ürün yavaşça dönsün, dramatik ışıklandırma, siyah arka plan" rows={2} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
                <p className="text-xs text-gray-400 mt-1">Boş bırakırsan marka bilgine göre otomatik oluşturulur — genellikle iyi sonuç verir</p>
                <Link href="/blog/ai-urun-videosu-hareket-secenekleri" className="inline-block mt-2 text-xs text-amber-500 hover:text-amber-700 hover:underline">Bu hareketler ne anlama gelir? Ürün kategorine göre hangisi uygun? →</Link>
              </div>

              <button onClick={videoUret} disabled={videoYukleniyor || fotolar.length === 0 || (kullanici !== null && !kullanici.is_admin && (kullanici?.kredi ?? 0) < (videoSure === "10" ? 8 : 5))}
                className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 text-white font-semibold py-3 rounded-xl transition-all">
                {videoYukleniyor ? "⏳ Video üretiliyor... (~2 dakika)" : fotolar.length === 0 ? "Önce fotoğraf ekle ↑" : !kullanici ? "🎬 Video Üret — Giriş Gerekli" : `🎬 Video Üret — ${kullanici.is_admin ? "∞" : (videoSure === "10" ? 8 : 5)} kredi`}
              </button>

              {kullanici && !kullanici.is_admin && (kullanici.kredi ?? 0) < (videoSure === "10" ? 8 : 5) && !videoYukleniyor && (
                <p className="text-center text-xs text-red-500">En az {videoSure === "10" ? 8 : 5} kredi gerekli. <button onClick={() => paketModalAc()} className="underline font-medium">Kredi satın al →</button></p>
              )}

              {videoYukleniyor && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center space-y-2">
                  <div className="flex justify-center"><div className="w-8 h-8 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin" /></div>
                  <p className="text-sm font-medium text-amber-700">AI videonuzu üretiyor</p>
                  <p className="text-xs text-amber-500">Sayfayı kapatmayın, yaklaşık 2 dakika sürer</p>
                </div>
              )}

              {videoRequestId && !videoYukleniyor && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-sm font-semibold text-gray-800">✅ Videonuz Hazır</span>
                    <span className="text-xs text-gray-400">{videoFormat} · {videoSure} saniye</span>
                  </div>
                  <button
                    onClick={async () => {
                      const res = await fetch(`/api/sosyal/video/download?requestId=${videoRequestId}`);
                      if (!res.ok) { alert("Video indirilemedi. Tekrar deneyin."); return; }
                      const blob = await res.blob();
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url; a.download = "urun-video.mp4"; a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-900 text-white font-semibold py-3 rounded-xl text-sm transition-colors"
                  >
                    ⬇️ Videoyu İndir
                  </button>
                  <button onClick={() => { setVideoRequestId(null); setVideoPrompt(""); }} className="w-full text-xs text-gray-400 hover:text-gray-600 py-2 transition-colors">Yeni video üret</button>
                </div>
              )}
            </div>

            {/* ===== SOSYAL MEDYA SEKMESİ ===== */}
            <div style={{display: anaSekme === "sosyal" ? "block" : "none"}} className="mt-4 space-y-4">

              {/* Video linki */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🎬</span>
                  <p className="text-xs text-amber-700 font-medium">Sosyal medya videosu üretmek için <span className="font-bold">Video sekmesini</span> kullan — Reels, TikTok ve Stories formatları destekleniyor.</p>
                </div>
                <button onClick={() => setAnaSekme("video")} className="text-xs bg-amber-500 hover:bg-amber-600 text-white font-semibold px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap">Video Sekmesi →</button>
              </div>

              {/* İçerik tipi: Metin / Görsel */}
              <div className="bg-white rounded-2xl shadow p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold text-gray-800">📱 Sosyal Medya İçeriği Üret</h2>
                  <span className="text-xs text-emerald-500 font-medium">1 kredi</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => setSosyalIcerikTipi("metin")}
                    className={`py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${sosyalIcerikTipi === "metin" ? "border-emerald-400 bg-emerald-50 text-emerald-700" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}>
                    ✍️ Caption + Hashtag
                  </button>
                  <button onClick={() => setSosyalIcerikTipi("gorsel")}
                    className={`py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${sosyalIcerikTipi === "gorsel" ? "border-emerald-400 bg-emerald-50 text-emerald-700" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}>
                    🖼️ Ürün Görseli
                  </button>
                </div>

                {/* Platform seçimi */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-2">Platform</label>
                  <div className="flex gap-2 flex-wrap">
                    {([
                      { id: "instagram", label: "📸 Instagram" },
                      { id: "tiktok", label: "🎵 TikTok" },
                      { id: "facebook", label: "👥 Facebook" },
                      { id: "twitter", label: "🐦 Twitter/X" },
                    ] as { id: SosyalPlatform; label: string }[]).map((p) => (
                      <button key={p.id} onClick={() => setSosyalPlatform(p.id)}
                        className={`flex-1 py-2 px-2 rounded-xl border-2 text-xs font-semibold transition-all ${sosyalPlatform === p.id ? "border-emerald-400 bg-emerald-50 text-emerald-600" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}>
                        {p.label}
                      </button>
                    ))}
                  </div>

                  {/* Platform boyut rehberi */}
                  {sosyalIcerikTipi === "gorsel" && (
                    <div className={`mt-2 rounded-xl border p-3 text-xs space-y-1 ${
                      (sosyalPlatform === "instagram" || sosyalPlatform === "tiktok") ? "bg-emerald-50 border-emerald-200" :
                      sosyalPlatform === "facebook" ? "bg-blue-50 border-blue-200" :
                      "bg-sky-50 border-sky-200"
                    }`}>
                      <p className="font-semibold text-gray-700">📐 Önerilen Boyutlar</p>
                      {sosyalPlatform === "instagram" && (
                        <div className="grid grid-cols-2 gap-2 text-gray-600 mt-1">
                          <div className="bg-white rounded-lg p-2 text-center border border-emerald-100">
                            <p className="font-bold text-emerald-600">1:1</p>
                            <p>Feed Post</p>
                            <p className="text-gray-400">1080×1080</p>
                          </div>
                          <div className="bg-white rounded-lg p-2 text-center border border-emerald-100">
                            <p className="font-bold text-emerald-600">9:16</p>
                            <p>Story / Reels</p>
                            <p className="text-gray-400">1080×1920</p>
                          </div>
                        </div>
                      )}
                      {sosyalPlatform === "tiktok" && (
                        <div className="grid grid-cols-2 gap-2 text-gray-600 mt-1">
                          <div className="bg-white rounded-lg p-2 text-center border border-emerald-100">
                            <p className="font-bold text-emerald-600">9:16</p>
                            <p>Dikey Video</p>
                            <p className="text-gray-400">1080×1920</p>
                          </div>
                          <div className="bg-white rounded-lg p-2 text-center border border-emerald-100">
                            <p className="font-bold text-emerald-600">1:1</p>
                            <p>Kare</p>
                            <p className="text-gray-400">1080×1080</p>
                          </div>
                        </div>
                      )}
                      {sosyalPlatform === "facebook" && (
                        <div className="grid grid-cols-2 gap-2 text-gray-600 mt-1">
                          <div className="bg-white rounded-lg p-2 text-center border border-blue-100">
                            <p className="font-bold text-blue-600">1:1</p>
                            <p>Post / Reklam</p>
                            <p className="text-gray-400">1200×1200</p>
                          </div>
                          <div className="bg-white rounded-lg p-2 text-center border border-blue-100">
                            <p className="font-bold text-blue-600">16:9</p>
                            <p>Link / Banner</p>
                            <p className="text-gray-400">1200×628</p>
                          </div>
                        </div>
                      )}
                      {sosyalPlatform === "twitter" && (
                        <div className="grid grid-cols-2 gap-2 text-gray-600 mt-1">
                          <div className="bg-white rounded-lg p-2 text-center border border-sky-100">
                            <p className="font-bold text-sky-600">16:9</p>
                            <p>Tweet Görseli</p>
                            <p className="text-gray-400">1200×675</p>
                          </div>
                          <div className="bg-white rounded-lg p-2 text-center border border-sky-100">
                            <p className="font-bold text-sky-600">1:1</p>
                            <p>Kare Görsel</p>
                            <p className="text-gray-400">1080×1080</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* METIN İÇERİĞİ */}
                {sosyalIcerikTipi === "metin" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ürün Adı <span className="text-red-400">*</span></label>
                      <input type="text" value={sosyalUrunAdi} onChange={(e) => setSosyalUrunAdi(e.target.value)} placeholder="örn: Bakır Cezve Set, Kadın Deri Çanta" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ek Bilgi <span className="text-gray-400 font-normal">(isteğe bağlı)</span></label>
                      <textarea value={sosyalEkBilgi} onChange={(e) => setSosyalEkBilgi(e.target.value)} placeholder="örn: %20 indirimde, yeni sezon, el yapımı, hediye seçeneği" rows={2} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Sezon / Etkinlik</label>
                      <select value={sosyalSezon} onChange={(e) => setSosyalSezon(e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white">
                        <option value="normal">Normal (sezon yok)</option>
                        <option value="anneler_gunu">💐 Anneler Günü</option>
                        <option value="babalar_gunu">👔 Babalar Günü</option>
                        <option value="bayram">🌙 Bayram</option>
                        <option value="yilbasi">🎉 Yılbaşı</option>
                        <option value="black_friday">🔥 Black Friday</option>
                        <option value="sevgililer_gunu">❤️ Sevgililer Günü</option>
                      </select>
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
                            className={`p-3 rounded-xl border-2 text-left transition-all ${sosyalTon === t.id ? "border-emerald-400 bg-emerald-50" : "border-gray-200 hover:border-gray-300"}`}>
                            <p className={`text-xs font-semibold ${sosyalTon === t.id ? "text-emerald-700" : "text-gray-700"}`}>{t.label}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{t.aciklama}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    <button onClick={captionUret} disabled={captionYukleniyor || sosyalKitYukleniyor || !sosyalUrunAdi.trim() || (kullanici !== null && !kullanici.is_admin && (kullanici?.kredi ?? 0) <= 0)}
                      className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-300 text-white font-semibold py-3 rounded-xl transition-all">
                      {captionYukleniyor ? "⏳ Üretiliyor..." : !kullanici ? "📱 Caption Üret — Giriş Gerekli" : `📱 ${["instagram","tiktok","facebook","twitter"].find(p => p === sosyalPlatform) ? (sosyalPlatform === "instagram" ? "Instagram" : sosyalPlatform === "tiktok" ? "TikTok" : sosyalPlatform === "facebook" ? "Facebook" : "Twitter/X") : "Caption"} Caption Üret — ${kullanici.is_admin ? "∞" : "1"} kredi`}
                    </button>

                    <button onClick={kitUret} disabled={sosyalKitYukleniyor || captionYukleniyor || !sosyalUrunAdi.trim() || (kullanici !== null && !kullanici.is_admin && (kullanici?.kredi ?? 0) < 4)}
                      className="w-full bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-300 text-white font-semibold py-3 rounded-xl transition-all">
                      {sosyalKitYukleniyor ? "⏳ Kit üretiliyor..." : !kullanici ? "🎁 Tüm Platformlar İçin Üret — Giriş Gerekli" : `🎁 Sosyal Medya Kiti — ${kullanici.is_admin ? "∞" : "4"} kredi`}
                    </button>
                    <p className="text-xs text-gray-400 text-center -mt-2">Instagram · TikTok · Facebook · Twitter/X aynı anda</p>

                    {kullanici && !kullanici.is_admin && (kullanici.kredi ?? 0) <= 0 && !captionYukleniyor && (
                      <p className="text-center text-xs text-red-500">İçerik üretim krediniz bitti. <button onClick={() => paketModalAc()} className="underline font-medium">Kredi satın al →</button></p>
                    )}

                    {(sosyalCaption || sosyalHashtag) && (
                      <div className="space-y-3">
                        {sosyalCaption && (
                          <div className="bg-gray-50 rounded-2xl p-5 border-l-4 border-l-emerald-400 border border-gray-100">
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-sm font-semibold text-gray-700">✍️ Paylaşım Metni</span>
                              <button onClick={() => navigator.clipboard.writeText(sosyalCaption)} className="text-xs font-medium px-3 py-1.5 rounded-lg bg-white text-gray-500 hover:bg-emerald-50 hover:text-emerald-600 transition-all border border-gray-200">Kopyala</button>
                            </div>
                            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{sosyalCaption}</p>
                          </div>
                        )}
                        {sosyalHashtag && (
                          <div className="bg-gray-50 rounded-2xl p-5 border-l-4 border-l-emerald-400 border border-gray-100">
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-sm font-semibold text-gray-700"># Hashtagler</span>
                              <button onClick={() => navigator.clipboard.writeText(sosyalHashtag)} className="text-xs font-medium px-3 py-1.5 rounded-lg bg-white text-gray-500 hover:bg-emerald-50 hover:text-emerald-600 transition-all border border-gray-200">Kopyala</button>
                            </div>
                            <p className="text-sm text-emerald-700 leading-relaxed">{sosyalHashtag}</p>
                          </div>
                        )}
                        <button onClick={() => { setSosyalCaption(""); setSosyalHashtag(""); }} className="w-full text-xs text-gray-400 hover:text-gray-600 py-2 transition-colors">Yeni metin üret</button>
                      </div>
                    )}

                    {/* Sosyal Medya Kiti sonuçları */}
                    {sosyalKitSonuc && (
                      <div className="space-y-3 mt-4">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold text-gray-700">🎁 Sosyal Medya Kiti</p>
                          <button onClick={() => { setSosyalKitSonuc(null); setSosyalKitAcik(null); }} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Temizle</button>
                        </div>
                        {([
                          { id: "instagram_tiktok", label: "📸 Instagram & TikTok" },
                          { id: "facebook", label: "👥 Facebook" },
                          { id: "twitter", label: "🐦 Twitter/X" },
                          { id: "linkedin", label: "💼 LinkedIn" },
                        ]).map(({ id, label }) => {
                          const sonuc = sosyalKitSonuc[id];
                          if (!sonuc) return null;
                          const acik = sosyalKitAcik === id;
                          return (
                            <div key={id} className="border border-gray-200 rounded-xl overflow-hidden">
                              <button onClick={() => setSosyalKitAcik(acik ? null : id)}
                                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left">
                                <span className="text-sm font-medium text-gray-700">{label}</span>
                                <span className="text-gray-400 text-xs">{acik ? "▲" : "▼"}</span>
                              </button>
                              {acik && (
                                <div className="p-4 space-y-3">
                                  {sonuc.caption && (
                                    <div>
                                      <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs font-medium text-gray-600">Paylaşım Metni</span>
                                        <button onClick={() => navigator.clipboard.writeText(sonuc.caption)} className="text-xs px-2 py-1 rounded bg-white border border-gray-200 text-gray-500 hover:text-emerald-600 hover:border-emerald-200 transition-all">Kopyala</button>
                                      </div>
                                      <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{sonuc.caption}</p>
                                    </div>
                                  )}
                                  {sonuc.hashtag && (
                                    <div>
                                      <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs font-medium text-gray-600">Hashtagler</span>
                                        <button onClick={() => navigator.clipboard.writeText(sonuc.hashtag)} className="text-xs px-2 py-1 rounded bg-white border border-gray-200 text-gray-500 hover:text-emerald-600 hover:border-emerald-200 transition-all">Kopyala</button>
                                      </div>
                                      <p className="text-sm text-emerald-700">{sonuc.hashtag}</p>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* GÖRSEL İÇERİĞİ */}
                {sosyalIcerikTipi === "gorsel" && (
                  <div className="space-y-4">
                    <p className="text-xs text-gray-500">Ürün fotoğrafından seçtiğin platform boyutunda profesyonel görsel üretilir — 1 görsel, 1 kredi.</p>

                    {!sosyalFoto ? (
                      <FotoEkleAlani id="sosyal-gorsel-foto-input" onChange={(e) => { const f = e.target.files?.[0]; if (f) { const r = new FileReader(); r.onload = () => setSosyalFoto(r.result as string); r.readAsDataURL(f); } }} renk="pink" metin="Ürün fotoğrafı yükle" ikon="📸" altMetin="Temiz arka planlı fotoğraf en iyi sonucu verir" />

                    ) : (
                      <FotoThumbnail src={sosyalFoto} onKaldir={() => { setSosyalFoto(null); setSosyalGorselSonuclar([]); }} renk="green" />
                    )}

                    {/* Boyut seçimi */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-2">Görsel Boyutu</label>
                      <div className="grid grid-cols-3 gap-2">
                        {([
                          { id: "1:1", label: "1:1", aciklama: "Feed / Post" },
                          { id: "9:16", label: "9:16", aciklama: "Story / Reels" },
                          { id: "16:9", label: "16:9", aciklama: "Banner / YouTube" },
                        ] as { id: "1:1" | "9:16" | "16:9"; label: string; aciklama: string }[]).map((b) => (
                          <button key={b.id} onClick={() => setSosyalGorselFormat(b.id)}
                            className={`p-2.5 rounded-xl border-2 text-center transition-all ${sosyalGorselFormat === b.id ? "border-emerald-400 bg-emerald-50" : "border-gray-200 hover:border-gray-300"}`}>
                            <p className={`text-sm font-bold ${sosyalGorselFormat === b.id ? "text-emerald-700" : "text-gray-700"}`}>{b.label}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{b.aciklama}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Stil seçimi */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-2">Arka Plan Stili</label>
                      <div className="grid grid-cols-4 gap-2">
                        {([
                          { id: "beyaz", label: "⬜ Beyaz" },
                          { id: "koyu", label: "⬛ Koyu" },
                          { id: "lifestyle", label: "🏠 Lifestyle" },
                          { id: "mermer", label: "🪨 Mermer" },
                          { id: "ahsap", label: "🪵 Ahşap" },
                          { id: "gradient", label: "🎨 Gradient" },
                          { id: "dogal", label: "🌿 Doğal" },
                        ]).map((s) => (
                          <button key={s.id} onClick={() => setSosyalGorselStil(s.id)}
                            className={`py-2 px-1 rounded-xl border-2 text-xs font-medium transition-all ${sosyalGorselStil === s.id ? "border-emerald-400 bg-emerald-50 text-emerald-700" : "border-gray-200 text-gray-600 hover:border-emerald-200"}`}>
                            {s.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-gray-600 font-medium block mb-1">Sahne açıklaması (isteğe bağlı)</label>
                      <textarea
                        value={sosyalGorselPrompt}
                        onChange={(e) => setSosyalGorselPrompt(e.target.value)}
                        placeholder="örn: Mermerli masada sofistike ışıklandırma, minimalist Japandi dekor..."
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
                        rows={2}
                      />
                    </div>

                    <button onClick={sosyalGorselUret} disabled={sosyalGorselYukleniyor || !sosyalFoto || (kullanici !== null && !kullanici.is_admin && (kullanici?.kredi ?? 0) < 1)}
                      className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-300 text-white font-semibold py-3 rounded-xl transition-all">
                      {sosyalGorselYukleniyor ? "⏳ Görsel üretiliyor..." : !kullanici ? "🖼️ Görsel Üret — Giriş Gerekli" : `🖼️ Sosyal Medya Görseli Üret — ${kullanici.is_admin ? "∞" : "1"} kredi`}
                    </button>

                    {sosyalGorselYukleniyor && (
                      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center space-y-2">
                        <div className="flex justify-center"><div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin" /></div>
                        <p className="text-sm font-medium text-emerald-700">Görsel üretiliyor...</p>
                        <p className="text-xs text-emerald-500">Bu birkaç saniye sürebilir</p>
                      </div>
                    )}

                    {sosyalGorselSonuclar.length > 0 && !sosyalGorselYukleniyor && (
                      <div className="space-y-3">
                        <p className="text-sm font-semibold text-gray-700 px-1">✅ Görseller Hazır — {sosyalGorselFormat} · {sosyalGorselStil}</p>
                        {sosyalGorselSonuclar.map((stil) => (
                          <div key={stil.stil} className="grid grid-cols-2 gap-2">
                            {stil.gorseller.map((url, i) => (
                              <div key={i} className="relative group rounded-xl overflow-hidden border border-gray-200">
                                <img src={url} alt={`${stil.label} ${i + 1}`} className="w-full object-cover" />
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <a href={url} download target="_blank" rel="noopener noreferrer" className="bg-white text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-lg shadow">⬇️ İndir</a>
                                </div>
                              </div>
                            ))}
                          </div>
                        ))}
                        <button onClick={() => { setSosyalGorselSonuclar([]); setSosyalFoto(null); }} className="w-full text-xs text-gray-400 hover:text-gray-600 py-2 transition-colors">Yeni görsel üret</button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Sağ panel — Mini widget */}
          <div className="w-full lg:w-56 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow p-4 space-y-3 sticky top-4">
              {kullanici ? (
                <>
                  <div className="flex gap-2">
                    <div className="flex-1 bg-indigo-50 rounded-xl px-2 py-2 text-center">
                      <div className={`text-lg font-bold ${kullanici.is_admin ? "text-violet-500" : krediDusuk ? "text-amber-500" : "text-indigo-500"}`}>
                        {kullanici.is_admin ? "∞" : kullanici.kredi}
                      </div>
                      <div className="text-xs text-gray-500">Kalan kredi</div>
                    </div>
                    <div className="flex-1 bg-gray-50 rounded-xl px-2 py-2 text-center">
                      <div className="text-lg font-bold text-gray-700">{kullanici.toplam_kullanilan}</div>
                      <div className="text-xs text-gray-500">Kullanılan</div>
                    </div>
                  </div>
                  <button onClick={() => paketModalAc()} className="w-full bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-semibold py-2 rounded-xl transition-colors">
                    + Kredi Al
                  </button>
                  {/* F-12c: Geçmiş sekmesi */}
                  {!kullanici.anonim && gecmis.length > 0 && (
                    <div>
                      <button onClick={() => setGecmisAcik(!gecmisAcik)} className="w-full flex items-center justify-between text-xs text-gray-500 hover:text-indigo-600 py-1.5 border border-gray-200 rounded-xl px-2 hover:border-indigo-300 transition-colors">
                        <span>📋 Geçmiş ({gecmis.length})</span>
                        <span>{gecmisAcik ? "▲" : "▼"}</span>
                      </button>
                      {gecmisAcik && (
                        <div className="mt-2 space-y-1">
                          <select value={gecmisPlatformFiltre} onChange={(e) => setGecmisPlatformFiltre(e.target.value)}
                            className="w-full text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-400">
                            <option value="">Tüm platformlar</option>
                            {["trendyol","hepsiburada","amazon","n11","etsy","amazon_usa"].map(p => (
                              <option key={p} value={p}>{p}</option>
                            ))}
                          </select>
                          <div className="max-h-40 overflow-y-auto space-y-1 mt-1">
                            {gecmis.filter(u => !gecmisPlatformFiltre || u.platform === gecmisPlatformFiltre).map(u => (
                              <button key={u.id} onClick={() => { setSonuc(u.sonuc); setAnaSekme("metin"); setGecmisAcik(false); }}
                                className="w-full text-left px-2 py-1.5 rounded-lg bg-gray-50 hover:bg-indigo-50 border border-transparent hover:border-indigo-200 transition-all">
                                <p className="text-xs font-medium text-gray-700 truncate">{u.urun_adi || "—"}</p>
                                <p className="text-xs text-gray-400">{u.platform} · {new Date(u.created_at).toLocaleDateString("tr-TR", { day: "numeric", month: "short" })}</p>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center space-y-2 py-1">
                  <p className="text-xs text-gray-500 leading-relaxed">Ücretsiz 3 kredi ile başla — kayıt gerekmiyor</p>
                  <button onClick={() => { setAuthPopupMod("kayit"); setAuthPopupAcik(true); }} className="w-full bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-semibold py-2 rounded-xl transition-colors">
                    🎁 Ücretsiz Başla
                  </button>
                  <button onClick={() => { setAuthPopupMod("giris"); setAuthPopupAcik(true); }} className="w-full text-xs text-gray-500 hover:text-gray-700 py-1 transition-colors">
                    Giriş Yap
                  </button>
                </div>
              )}
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
                <div className="flex gap-2">
                  <button onClick={() => setAuthPopupMod("kayit")} className={`flex-1 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${authPopupMod === "kayit" ? "bg-indigo-500 text-white border-indigo-500" : "bg-white text-indigo-500 border-indigo-200"}`}>🎁 Kayıt Ol</button>
                  <button onClick={() => setAuthPopupMod("giris")} className={`flex-1 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${authPopupMod === "giris" ? "bg-gray-800 text-white border-gray-800" : "bg-white text-gray-600 border-gray-200"}`}>Giriş Yap</button>
                </div>
                <button onClick={handleGoogleGiris} className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
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
                <input type="email" placeholder="E-posta" value={authPopupEmail} onChange={(e) => setAuthPopupEmail(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                <input type="password" placeholder="Şifre" value={authPopupSifre} onChange={(e) => setAuthPopupSifre(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAuthPopupGiris()} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                {authPopupMod === "kayit" && (
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" checked={authPopupSozlesme} onChange={(e) => setAuthPopupSozlesme(e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-gray-300 flex-shrink-0" />
                    <span className="text-xs text-gray-500 leading-relaxed">
                      <a href="/gizlilik" target="_blank" className="text-indigo-500 hover:underline">Gizlilik Politikası</a> ve <a href="/mesafeli-satis" target="_blank" className="text-indigo-500 hover:underline">Mesafeli Satış Sözleşmesi</a>&apos;ni okudum.
                    </span>
                  </label>
                )}
                {authPopupMesaj && <p className={`text-xs ${authPopupMesaj.includes("başarılı") || authPopupMesaj.includes("oluşturuldu") ? "text-green-600" : "text-red-500"}`}>{authPopupMesaj}</p>}
                <button onClick={handleAuthPopupGiris} disabled={authPopupYukleniyor || (authPopupMod === "kayit" && !authPopupSozlesme)} className="w-full bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-300 text-white font-semibold py-3 rounded-xl text-sm transition-colors">
                  {authPopupYukleniyor ? "..." : authPopupMod === "kayit" ? "Ücretsiz Hesap Oluştur" : "Giriş Yap"}
                </button>
              </div>
            </div>
          </div>
        )}

        {paketModalAcik && kullanici && <PaketModal kullanici={kullanici} onKapat={() => setPaketModalAcik(false)} />}

        <ChatWidget />
      </div>
      <SiteFooter />
    </main>
  );
}
