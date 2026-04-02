"use client";
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

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
  email: string;
  kredi: number;
  toplam_kullanilan: number;
  is_admin: boolean;
};

type SonucBolum = {
  baslik: string;
  ikon: string;
  icerik: string;
};

function sonucuBolumle(sonuc: string): SonucBolum[] {
  if (!sonuc) return [];
  const bolumler: SonucBolum[] = [];
  const baslikMatch = sonuc.match(/(?:📌\s*)?(?:Başlık|BAŞLIK)[:\n]+([^\n🔹📄🏷]+)/i);
  const ozellikMatch = sonuc.match(/(?:🔹\s*)?(?:Özellikler|ÖZELLİKLER)[:\n]+([\s\S]+?)(?=📄|🏷|$)/i);
  const aciklamaMatch = sonuc.match(/(?:📄\s*)?(?:Açıklama|AÇIKLAMA)[:\n]+([\s\S]+?)(?=🏷|$)/i);
  const etiketMatch = sonuc.match(/(?:🏷️?\s*)?(?:Etiketler|ETİKETLER)[:\n]+([\s\S]+?)$/i);
  if (baslikMatch) bolumler.push({ baslik: "Başlık", ikon: "📌", icerik: baslikMatch[1].trim() });
  if (ozellikMatch) bolumler.push({ baslik: "Özellikler", ikon: "🔹", icerik: ozellikMatch[1].trim() });
  if (aciklamaMatch) bolumler.push({ baslik: "Açıklama", ikon: "📄", icerik: aciklamaMatch[1].trim() });
  if (etiketMatch) bolumler.push({ baslik: "Etiketler", ikon: "🏷️", icerik: etiketMatch[1].trim() });
  if (bolumler.length === 0) bolumler.push({ baslik: "İçerik", ikon: "📋", icerik: sonuc });
  return bolumler;
}

function KopyalaButon({ metin }: { metin: string }) {
  const [kopyalandi, setKopyalandi] = useState(false);
  const kopyala = () => {
    navigator.clipboard.writeText(metin);
    setKopyalandi(true);
    setTimeout(() => setKopyalandi(false), 2000);
  };
  return (
    <button onClick={kopyala} className={`text-xs font-medium px-3 py-1 rounded-lg transition-colors ${kopyalandi ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500 hover:bg-orange-50 hover:text-orange-600"}`}>
      {kopyalandi ? "✓ Kopyalandı" : "Kopyala"}
    </button>
  );
}

const yukleniyorMesajlari = [
  "Ürün analiz ediliyor...",
  "Platform kuralları uygulanıyor...",
  "Türk alıcı psikolojisine göre optimize ediliyor...",
  "İçerik hazırlanıyor...",
];

function PaketModal({ kullanici, onKapat }: { kullanici: Kullanici; onKapat: () => void }) {
  const [seciliPaket, setSeciliPaket] = useState<string | null>(null);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [odemeAcik, setOdemeAcik] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const paketler = [
    { id: "baslangic", isim: "Başlangıç", fiyat: "₺29", kredi: "10 kullanım hakkı", renk: "border-gray-200", butonRenk: "bg-gray-800 hover:bg-gray-900" },
    { id: "populer", isim: "Popüler", fiyat: "₺79", kredi: "30 kullanım hakkı", renk: "border-orange-400 ring-2 ring-orange-400", butonRenk: "bg-orange-500 hover:bg-orange-600", rozet: true },
    { id: "sinırsiz", isim: "Sınırsız", fiyat: "₺199/ay", kredi: "Sınırsız kullanım", renk: "border-gray-200", butonRenk: "bg-gray-800 hover:bg-gray-900" },
  ];

  const odemeBaslat = async (paketId: string) => {
    setSeciliPaket(paketId);
    setYukleniyor(true);
    try {
      const res = await fetch("/api/odeme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paket: paketId, userId: kullanici.id, email: kullanici.email }),
      });
      const data = await res.json();
      if (data.checkoutFormContent) {
        setOdemeAcik(true);
        setTimeout(() => {
          if (formRef.current) {
            formRef.current.innerHTML = data.checkoutFormContent;
            const scriptlar = formRef.current.querySelectorAll("script");
            scriptlar.forEach((eskiScript) => {
              const yeniScript = document.createElement("script");
              if (eskiScript.src) {
                yeniScript.src = eskiScript.src;
              } else {
                yeniScript.textContent = eskiScript.textContent;
              }
              eskiScript.parentNode?.replaceChild(yeniScript, eskiScript);
            });
          }
        }, 100);
      } else {
        alert(data.hata || "Ödeme başlatılamadı, tekrar deneyin.");
      }
    } catch {
      alert("Bir hata oluştu, tekrar deneyin.");
    }
    setYukleniyor(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Paket Satın Al</h2>
            <p className="text-xs text-gray-500 mt-0.5">Mevcut hakkın: <span className="font-semibold text-orange-500">{kullanici.kredi}</span></p>
          </div>
          <button onClick={onKapat} className="text-gray-400 hover:text-gray-600 text-2xl font-light">×</button>
        </div>

        {!odemeAcik ? (
          <div className="p-6 space-y-4">
            {paketler.map((p) => (
              <div key={p.id} className={`border-2 ${p.renk} rounded-2xl p-5 relative`}>
                {p.rozet && (
                  <span className="absolute -top-3 left-4 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">En Popüler</span>
                )}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-800">{p.isim}</p>
                    <p className="text-sm text-gray-500">{p.kredi}</p>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{p.fiyat}</p>
                </div>
                <button
                  onClick={() => odemeBaslat(p.id)}
                  disabled={yukleniyor}
                  className={`w-full mt-4 ${p.butonRenk} text-white font-semibold py-2.5 rounded-xl text-sm transition-colors disabled:bg-gray-300`}
                >
                  {yukleniyor && seciliPaket === p.id ? "⏳ Yükleniyor..." : "Satın Al"}
                </button>
              </div>
            ))}
            <p className="text-xs text-gray-400 text-center pt-2">🔒 Güvenli ödeme — iyzico altyapısı</p>
          </div>
        ) : (
          <div className="p-4">
            <div ref={formRef} id="iyzipay-checkout-form" className="popup" />
          </div>
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
            {yukleniyor && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-100 px-3 py-2 rounded-xl text-xs text-gray-400">yazıyor...</div>
              </div>
            )}
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

export default function Home() {
  const [urunAdi, setUrunAdi] = useState("");
  const [kategori, setKategori] = useState("");
  const [ozellikler, setOzellikler] = useState("");
  const [platform, setPlatform] = useState("trendyol");
  const [sonuc, setSonuc] = useState("");
  const [yukleniyor, setYukleniyor] = useState(false);
  const [yukleniyorMesaj, setYukleniyorMesaj] = useState(0);
  const [fotolar, setFotolar] = useState<string[]>([]);
  const [girisTipi, setGirisTipi] = useState<"manuel" | "foto" | "barkod">("manuel");
  const [barkod, setBarkod] = useState("");
  const [barkodYukleniyor, setBarkodYukleniyor] = useState(false);
  const [barkodBilgi, setBarkodBilgi] = useState<{ isim: string; marka: string; aciklama: string; kategori: string; renk: string; boyut: string } | null>(null);
  const [kameraAcik, setKameraAcik] = useState(false);
  const [kullanici, setKullanici] = useState<Kullanici | null>(null);
  const [gecmis, setGecmis] = useState<Uretim[]>([]);
  const [seciliUretim, setSeciliUretim] = useState<Uretim | null>(null);
  const [gorselEkPrompt, setGorselEkPrompt] = useState("");
  const [seciliStiller, setSeciliStiller] = useState<string[]>([]);
  const [gorselYukleniyor, setGorselYukleniyor] = useState(false);
  const [gorselSonuclar, setGorselSonuclar] = useState<{ stil: string; label: string; gorseller: string[] }[]>([]);
  const [paketModalAcik, setPaketModalAcik] = useState(false);
  const scannerRef = useRef<unknown>(null);
  const scannerBaslatildi = useRef(false);
  const sorguCalisiyor = useRef(false);
  const mesajInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const router = useRouter();

  useEffect(() => {
    kullaniciyiKontrolEt();
    const params = new URLSearchParams(window.location.search);
    if (params.get("odeme") === "basarili") {
      alert("🎉 Ödeme başarılı! Kredileriniz hesabınıza eklendi.");
      window.history.replaceState({}, "", "/");
      kullaniciyiKontrolEt();
    } else if (params.get("odeme") === "hata") {
      alert("Ödeme tamamlanamadı. Tekrar deneyin.");
      window.history.replaceState({}, "", "/");
    }
    return () => {
      kameraKapat();
      if (mesajInterval.current) clearInterval(mesajInterval.current);
    };
  }, []);

  const kullaniciyiKontrolEt = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/auth"); return; }
    const { data: profil } = await supabase.from("profiles").select("email, kredi, is_admin").eq("id", user.id).single();
    const { count } = await supabase.from("uretimler").select("*", { count: "exact", head: true }).eq("user_id", user.id);
    if (profil) setKullanici({ id: user.id, email: profil.email, kredi: profil.kredi, toplam_kullanilan: count || 0, is_admin: profil.is_admin || false });
    gecmisiYukle(user.id);
  };

  const gecmisiYukle = async (userId: string) => {
    const { data } = await supabase.from("uretimler").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(10);
    if (data) setGecmis(data);
  };

  const cikisYap = async () => {
    await supabase.auth.signOut();
    router.push("/auth");
  };

  const fotoSec = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dosyalar = Array.from(e.target.files || []);
    dosyalar.slice(0, 3 - fotolar.length).forEach((dosya) => {
      const reader = new FileReader();
      reader.onload = () => { setFotolar((prev) => (prev.length >= 3 ? prev : [...prev, reader.result as string])); };
      reader.readAsDataURL(dosya);
    });
    e.target.value = "";
  };

  const fotoKaldir = (index: number) => {
    setFotolar((prev) => prev.filter((_, i) => i !== index));
    setGorselSonuclar([]);
  };

  const barkodSorgula = async (kod: string) => {
    if (!kod || kod.length < 8) return;
    if (sorguCalisiyor.current) return;
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

  const icerikUret = async () => {
    if (!kullanici || (!kullanici.is_admin && kullanici.kredi <= 0)) { setPaketModalAcik(true); return; }
    if (girisTipi === "manuel" && (!urunAdi || !kategori)) return;
    if (girisTipi === "foto" && fotolar.length === 0) return;
    if (girisTipi === "barkod" && !barkodBilgi) return;
    setYukleniyor(true);
    setSonuc("");
    setYukleniyorMesaj(0);
    mesajInterval.current = setInterval(() => { setYukleniyorMesaj((prev) => (prev + 1) % yukleniyorMesajlari.length); }, 1800);
    const res = await fetch("/api/uret", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ urunAdi, kategori, ozellikler, platform, fotolar, girisTipi, barkodBilgi, userId: kullanici.id }),
    });
    const data = await res.json();
    if (mesajInterval.current) clearInterval(mesajInterval.current);
    setSonuc(data.icerik);
    if (kullanici.is_admin) {
      setKullanici({ ...kullanici, toplam_kullanilan: kullanici.toplam_kullanilan + 1 });
    } else {
      setKullanici({ ...kullanici, kredi: kullanici.kredi - 1, toplam_kullanilan: kullanici.toplam_kullanilan + 1 });
    }
    gecmisiYukle(kullanici.id);
    setYukleniyor(false);
    setTimeout(() => { document.getElementById("sonuc-alani")?.scrollIntoView({ behavior: "smooth", block: "start" }); }, 100);
  };

  const gorselUret = async () => {
    if (fotolar.length === 0) { alert("Önce bir ürün fotoğrafı ekleyin."); return; }
    if (seciliStiller.length === 0) { alert("En az bir stil seçin."); return; }
    if (!kullanici || (!kullanici.is_admin && kullanici.kredi < seciliStiller.length)) { setPaketModalAcik(true); return; }
    setGorselYukleniyor(true);
    setGorselSonuclar([]);
    try {
      // Fotografi max 1024px resize et
      const resizeFoto = (base64: string, maxSize = 1024): Promise<string> => new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let w = img.width, h = img.height;
          if (w > maxSize || h > maxSize) {
            if (w > h) { h = Math.round(h * maxSize / w); w = maxSize; }
            else { w = Math.round(w * maxSize / h); h = maxSize; }
          }
          canvas.width = w; canvas.height = h;
          canvas.getContext("2d")?.drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL("image/jpeg", 0.85));
        };
        img.src = base64;
      });
      const resizedFoto = await resizeFoto(fotolar[0]);
      const res = await fetch("/api/gorsel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ foto: resizedFoto, ekPrompt: gorselEkPrompt, stiller: seciliStiller, userId: kullanici?.id }),
      });
      const data = await res.json();
      if (data.sonuclar) {
        setGorselSonuclar(data.sonuclar);
        if (!kullanici.is_admin) {
        // Kredi indirmede duser - setKullanici((prev) => prev ? { ...prev, kredi: prev.kredi - seciliStiller.length, toplam_kullanilan: prev.toplam_kullanilan + seciliStiller.length } : prev);
        }
      } else { alert("Görsel üretilemedi. Tekrar deneyin."); }
    } catch { alert("Hata oluştu."); }
    setGorselYukleniyor(false);
  };

  const uretButonAktif = !yukleniyor && ((girisTipi === "manuel" && urunAdi && kategori) || (girisTipi === "foto" && fotolar.length > 0) || (girisTipi === "barkod" && barkodBilgi !== null));
  const platformRenk: Record<string, string> = { trendyol: "bg-orange-100 text-orange-700", hepsiburada: "bg-orange-100 text-orange-600", amazon: "bg-yellow-100 text-yellow-700", n11: "bg-blue-100 text-blue-700" };
  const sonucBolumleri = sonucuBolumle(sonuc);

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <img src="/yzliste_logo.png" alt="yzliste" className="h-9" />
          {kullanici && (
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-400">{kullanici.email}</span>
              {kullanici.is_admin && <a href="/admin" className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-lg font-medium">Admin</a>}
              <a href="/profil" className="text-sm text-gray-400 hover:text-gray-600">Profil</a>
              <button onClick={cikisYap} className="text-sm text-gray-400 hover:text-gray-600">Çıkış</button>
            </div>
          )}
        </div>

        {/* Kullanım bilgi banner */}
        <div className="bg-white rounded-2xl shadow p-4 mb-6 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex items-start gap-3">
            <div className="text-2xl">💡</div>
            <div>
              <p className="text-sm font-semibold text-gray-800">Metin ve görsel üretimi ayrı kullanım hakkı tüketir</p>
              <p className="text-xs text-gray-500 mt-0.5">
                <span className="text-orange-600 font-medium">İçerik Üret</span> → 1 kullanım hakkı &nbsp;·&nbsp;
                <span className="text-purple-600 font-medium">Görsel Üret</span> → 1 kullanım hakkı
              </p>
            </div>
          </div>
          <div className="flex gap-3 text-center flex-shrink-0 items-center">
            <div className="bg-orange-50 rounded-xl px-4 py-2">
              <div className="text-xl font-bold text-orange-500">{kullanici?.is_admin ? "∞" : kullanici?.kredi ?? "–"}</div>
              <div className="text-xs text-gray-500">Kalan hak</div>
            </div>
            <div className="bg-gray-50 rounded-xl px-4 py-2">
              <div className="text-xl font-bold text-gray-700">{kullanici?.toplam_kullanilan ?? "–"}</div>
              <div className="text-xs text-gray-500">Kullanılan</div>
            </div>
            <button onClick={() => setPaketModalAcik(true)} className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors whitespace-nowrap">
              + Paket Al
            </button>
          </div>
        </div>

        <div className="flex gap-6 items-start flex-col lg:flex-row">
          <div className="flex-1 w-full space-y-4">

            {/* İçerik Üretim Formu */}
            <div className="bg-white rounded-2xl shadow p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-gray-800">📝 Listing İçeriği Üret</h2>
                <span className="text-xs bg-orange-50 text-orange-600 px-2 py-1 rounded-lg font-medium">1 kullanım hakkı</span>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-2 font-medium">Ürünü nasıl eklemek istersin?</p>
                <div className="flex gap-2">
                  {(["manuel", "foto", "barkod"] as const).map((tip) => (
                    <button key={tip} onClick={() => { setGirisTipi(tip); kameraKapat(); }}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${girisTipi === tip ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                      {tip === "manuel" ? "✏️ Manuel" : tip === "foto" ? "📷 Fotoğraf" : "🔍 Barkod"}
                    </button>
                  ))}
                </div>
              </div>

              {girisTipi === "manuel" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ürün Adı <span className="text-red-400">*</span></label>
                    <input type="text" value={urunAdi} onChange={(e) => setUrunAdi(e.target.value)} placeholder="örn: Erkek Hakiki Deri Bot" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kategori <span className="text-red-400">*</span></label>
                    <input type="text" value={kategori} onChange={(e) => setKategori(e.target.value)} placeholder="örn: Ayakkabı / Giyim / Elektronik" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400" />
                  </div>
                </>
              )}

              {girisTipi === "foto" && (
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">Ürün Fotoğrafları <span className="text-red-400">*</span><span className="text-gray-400 font-normal"> (max 3)</span></label>
                  {fotolar.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {fotolar.map((f, i) => (
                        <div key={i} className="relative">
                          <img src={f} alt={`Ürün ${i + 1}`} className="w-24 h-24 object-cover rounded-lg border border-gray-200" />
                          <button onClick={() => fotoKaldir(i)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">×</button>
                        </div>
                      ))}
                    </div>
                  )}
                  {fotolar.length < 3 && (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors">
                      <input type="file" accept="image/*" multiple onChange={fotoSec} className="hidden" id="foto-input" />
                      <label htmlFor="foto-input" className="cursor-pointer block space-y-2">
                        <div className="text-3xl">📷</div>
                        <p className="text-gray-500 text-sm">{fotolar.length === 0 ? "Fotoğraf seçmek için tıkla" : "Daha fazla ekle"}</p>
                        <p className="text-gray-400 text-xs">{3 - fotolar.length} fotoğraf daha eklenebilir</p>
                      </label>
                    </div>
                  )}
                </div>
              )}

              {girisTipi === "barkod" && (
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">Barkod <span className="text-red-400">*</span></label>
                  <div className="flex gap-2">
                    <input type="text" value={barkod} onChange={(e) => setBarkod(e.target.value)} onKeyDown={(e) => e.key === "Enter" && barkodSorgula(barkod)} placeholder="Barkod numarası (EAN/UPC)" className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400" />
                    <button onClick={() => barkodSorgula(barkod)} disabled={barkodYukleniyor || barkod.length < 8} className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg text-sm font-medium">{barkodYukleniyor ? "..." : "Sorgula"}</button>
                    <button onClick={kameraAcik ? kameraKapat : kameraAc} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${kameraAcik ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-700"}`}>{kameraAcik ? "Kapat" : "📷 Tara"}</button>
                  </div>
                  {kameraAcik && (<div className="space-y-2"><div id="barkod-okuyucu" className="w-full rounded-lg overflow-hidden" /><p className="text-xs text-gray-400 text-center">Barkodu çerçeve içine hizala</p></div>)}
                  {barkodBilgi && (<div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm"><p className="font-medium text-green-800">✓ Ürün bulundu</p><p className="text-green-700">{barkodBilgi.isim}</p>{barkodBilgi.marka && <p className="text-green-600 text-xs">Marka: {barkodBilgi.marka}</p>}</div>)}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ek Bilgi <span className="text-gray-400 font-normal">(isteğe bağlı)</span></label>
                <textarea value={ozellikler} onChange={(e) => setOzellikler(e.target.value)} placeholder="örn: renk, beden, malzeme, özel özellikler..." rows={4} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
                <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400">
                  <option value="trendyol">Trendyol</option>
                  <option value="hepsiburada">Hepsiburada</option>
                  <option value="amazon">Amazon TR</option>
                  <option value="n11">N11</option>
                </select>
              </div>

              <button onClick={icerikUret} disabled={!uretButonAktif} className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white font-semibold py-3 rounded-lg transition-colors">
                {yukleniyor ? "⏳ Üretiliyor..." : `İçerik Üret — ${kullanici?.is_admin ? "∞" : kullanici?.kredi || 0} kullanım hakkı kaldı`}
              </button>
            </div>

            {/* Görsel Üretim */}
            <div className="bg-white rounded-2xl shadow p-6 space-y-4">
              <div>
                <h2 className="text-base font-semibold text-gray-800">✨ Ürün Görseli Üret</h2>
                <p className="text-xs text-gray-400 mt-0.5">YZ bazen hata yapabilir — bu yüzden her stilden <strong>4 farklı varyasyon</strong> üretiyoruz. İnceleme ücretsiz, indirdiğinde 1 hak düşer.</p>
              </div>

              {fotolar.length === 0 ? (
                <div className="border-2 border-dashed border-purple-200 rounded-xl p-4 text-center hover:border-purple-400 transition-colors bg-purple-50">
                  <input type="file" accept="image/*" onChange={fotoSec} className="hidden" id="gorsel-foto-input" />
                  <label htmlFor="gorsel-foto-input" className="cursor-pointer block space-y-1">
                    <div className="text-2xl">📷</div>
                    <p className="text-sm font-medium text-purple-700">Ürün fotoğrafı ekle</p>
                    <p className="text-xs text-purple-400">Fotoğraf sekmesinden de ekleyebilirsin</p>
                  </label>
                </div>
              ) : (
                <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-3">
                  <img src={fotolar[0]} alt="Ürün" className="w-12 h-12 object-cover rounded-lg border border-green-200" />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-green-700">✓ Fotoğraf hazır</p>
                    <p className="text-xs text-green-500">{fotolar.length} fotoğraf yüklendi</p>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">Stil seç <span className="text-gray-400 font-normal">(birden fazla seçebilirsin — her biri 1 kullanım hakkı)</span></label>
                <div className="grid grid-cols-3 gap-2">
                  {([
                    { id: "beyaz", label: "⬜ Beyaz Zemin", aciklama: "Trendyol standart", img: "/ornek_beyaz.jpg" },
                    { id: "koyu", label: "⬛ Koyu Zemin", aciklama: "Premium / elektronik", img: "/ornek_koyu.jpg" },
                    { id: "lifestyle", label: "🏠 Lifestyle", aciklama: "Gerçek ortam", img: "/ornek_lifestyle.jpg" },
                  ] as const).map((s) => (
                    <button key={s.id} onClick={() => { setSeciliStiller((prev) => prev.includes(s.id) ? prev.filter((x) => x !== s.id) : [...prev, s.id]); }}
                      className={`rounded-xl overflow-hidden border-2 transition-all text-left ${seciliStiller.includes(s.id) ? "border-purple-500 shadow-md" : "border-gray-200 hover:border-purple-300"}`}>
                      <div className="aspect-video overflow-hidden relative">
                        <img src={s.img} alt={s.label} className="w-full h-full object-cover" />
                        {seciliStiller.includes(s.id) && (
                          <div className="absolute inset-0 bg-purple-500/20 flex items-center justify-center">
                            <span className="bg-purple-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">✓</span>
                          </div>
                        )}
                      </div>
                      <div className="p-2 bg-white">
                        <p className={`text-xs font-semibold ${seciliStiller.includes(s.id) ? "text-purple-600" : "text-gray-700"}`}>{s.label}</p>
                        <p className="text-xs text-gray-400">{s.aciklama}</p>
                      </div>
                    </button>
                  ))}
                </div>
                {seciliStiller.length > 0 && (
                  <p className="text-xs text-purple-600 font-medium mt-2 text-center">
                    {seciliStiller.length} stil seçildi → {seciliStiller.length * 4} görsel · {seciliStiller.length} kullanım hakkı
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Ek yönlendirme <span className="text-gray-400 font-normal">(isteğe bağlı)</span></label>
                <textarea value={gorselEkPrompt} onChange={(e) => setGorselEkPrompt(e.target.value)} placeholder="örn: parlak yüzey, gölge efekti, sonbahar tonları, minimalist..." rows={2} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" />
              </div>

              <button onClick={gorselUret} disabled={gorselYukleniyor || seciliStiller.length === 0 || fotolar.length === 0} className="w-full bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 text-white font-semibold py-3 rounded-lg transition-colors">
                {gorselYukleniyor ? `⏳ ${seciliStiller.length * 4} görsel üretiliyor...` : seciliStiller.length === 0 ? "Önce bir stil seç" : fotolar.length === 0 ? "Önce fotoğraf ekle" : `✨ ${seciliStiller.length * 4} Görsel Üret — ${seciliStiller.length} kullanım hakkı`}
              </button>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 leading-relaxed">
                <span className="font-semibold">💡 Nasıl çalışır?</span> YZ bazen tam istediğin sonucu üretemeyebilir — bu yüzden her stilden <span className="font-semibold">4 farklı varyasyon</span> veriyoruz, en az biri işe yarasın. Görselleri incelemek ücretsiz. <span className="font-semibold">Hepsini İndir</span> butonuna bastığında 1 kullanım hakkı düşer.
              </div>
              {gorselSonuclar.length > 0 && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500 font-medium">
                      ✅ {gorselSonuclar.reduce((t, s) => t + s.gorseller.length, 0)} görsel hazır
                    </p>
                    <button
                      onClick={async () => {
                        const tumGorseller = gorselSonuclar.flatMap(g => g.gorseller);
                        for (let i = 0; i < tumGorseller.length; i++) {
                          const url = tumGorseller[i];
                          try {
                            const res = await fetch(url);
                            const blob = await res.blob();
                            const a = document.createElement("a");
                            a.href = URL.createObjectURL(blob);
                            a.download = `gorsel-${i + 1}.jpg`;
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                            URL.revokeObjectURL(a.href);
                            await new Promise(r => setTimeout(r, 400));
                          } catch(e) { console.error(e); }
                        }
                        if (kullanici && !kullanici.is_admin) {
                          await fetch("/api/gorsel", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ action: "indir", userId: kullanici.id, stilSayisi: seciliStiller.length }),
                          });
                          setKullanici(prev => prev ? { ...prev, kredi: prev.kredi - seciliStiller.length, toplam_kullanilan: prev.toplam_kullanilan + seciliStiller.length } : prev);
                        }
                      }}
                      className="text-xs bg-purple-500 hover:bg-purple-600 text-white px-3 py-1.5 rounded-lg font-medium transition-colors"
                    >
                      ⬇ Hepsini İndir ({gorselSonuclar.reduce((t, s) => t + s.gorseller.length, 0)})
                    </button>
                  </div>
                  {gorselSonuclar.map((grup) => (
                    <div key={grup.stil}>
                      <p className="text-xs font-semibold text-gray-600 mb-2">
                        {grup.stil === "beyaz" ? "⬜" : grup.stil === "koyu" ? "⬛" : "🏠"} {grup.label}
                        <span className="text-gray-400 font-normal"> — {grup.gorseller.length} varyasyon</span>
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {grup.gorseller.map((url, i) => (
                          <div key={i} className="rounded-xl overflow-hidden border border-gray-100 aspect-square"
                            onContextMenu={(e) => e.preventDefault()}>
                            <img
                              src={url}
                              alt={`${grup.label} ${i + 1}`}
                              className="w-full h-full object-cover pointer-events-none select-none"
                              draggable={false}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {yukleniyor && (
              <div className="bg-white rounded-2xl shadow p-8 text-center" id="sonuc-alani">
                <div className="flex justify-center mb-4">
                  <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
                </div>
                <p className="text-gray-600 font-medium text-sm animate-pulse">{yukleniyorMesajlari[yukleniyorMesaj]}</p>
                <p className="text-gray-400 text-xs mt-2">Bu birkaç saniye sürebilir...</p>
              </div>
            )}

            {sonuc && !yukleniyor && (
              <div id="sonuc-alani" className="space-y-3">
                <div className="flex justify-between items-center px-1">
                  <h2 className="text-base font-semibold text-gray-800">✅ Üretilen İçerik</h2>
                  <KopyalaButon metin={sonuc} />
                </div>
                {sonucBolumleri.map((bolum, i) => (
                  <div key={i} className="bg-white rounded-2xl shadow p-5">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-semibold text-gray-700">{bolum.ikon} {bolum.baslik}</span>
                      <KopyalaButon metin={bolum.icerik} />
                    </div>
                    <pre className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed font-sans">{bolum.icerik}</pre>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sağ — Geçmiş */}
          <div className="w-full lg:w-72 space-y-4">
            <div className="bg-white rounded-2xl shadow p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Son Üretimler</h3>
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
                        {new Date(u.created_at).toLocaleDateString("tr-TR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </div>
                      {seciliUretim?.id === u.id && (
                        <div className="mt-3 pt-3 border-t border-orange-200">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs text-gray-500">İçerik</span>
                            <button onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(u.sonuc); }} className="text-xs text-orange-500 hover:text-orange-600">Kopyala</button>
                          </div>
                          <pre className="text-xs text-gray-600 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">{u.sonuc}</pre>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {paketModalAcik && kullanici && (
        <PaketModal kullanici={kullanici} onKapat={() => setPaketModalAcik(false)} />
      )}

      <ChatWidget />
    </main>
  );
}
