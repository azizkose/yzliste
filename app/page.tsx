"use client";
import { useState, useRef, useEffect } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";

export default function Home() {
  const [urunAdi, setUrunAdi] = useState("");
  const [kategori, setKategori] = useState("");
  const [ozellikler, setOzellikler] = useState("");
  const [platform, setPlatform] = useState("trendyol");
  const [sonuc, setSonuc] = useState("");
  const [yukleniyor, setYukleniyor] = useState(false);
  const [fotolar, setFotolar] = useState<string[]>([]);
  const [girisTipi, setGirisTipi] = useState<"manuel" | "foto" | "barkod">("manuel");
  const [barkod, setBarkod] = useState("");
  const [barkodYukleniyor, setBarkodYukleniyor] = useState(false);
  const [barkodBilgi, setBarkodBilgi] = useState<{isim: string, marka: string, aciklama: string, kategori: string, renk: string, boyut: string} | null>(null);
  const [kameraAcik, setKameraAcik] = useState(false);
  const [taramaAktif, setTaramaAktif] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);

  useEffect(() => {
    return () => {
      if (readerRef.current) {
        readerRef.current.reset();
      }
    };
  }, []);

  const fotoSec = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dosyalar = Array.from(e.target.files || []);
    dosyalar.slice(0, 3 - fotolar.length).forEach((dosya) => {
      const reader = new FileReader();
      reader.onload = () => {
        setFotolar((prev) => {
          if (prev.length >= 3) return prev;
          return [...prev, reader.result as string];
        });
      };
      reader.readAsDataURL(dosya);
    });
    e.target.value = "";
  };

  const fotoKaldir = (index: number) => {
    setFotolar((prev) => prev.filter((_, i) => i !== index));
  };

  const barkodSorgula = async (kod: string) => {
    if (!kod || kod.length < 8) return;
    setBarkodYukleniyor(true);
    setBarkodBilgi(null);
    try {
      const res = await fetch(`/api/barkod?kod=${kod}`);
      const data = await res.json();
      if (data.isim) {
        setBarkodBilgi(data);
        setUrunAdi(data.isim);
        if (data.marka) setKategori(data.marka);
        if (data.aciklama) setOzellikler(data.aciklama);
        kameraKapat();
      } else {
        alert("Ürün bulunamadı. Lütfen manuel giriş yapın.");
      }
    } catch {
      alert("Barkod sorgulanırken hata oluştu.");
    }
    setBarkodYukleniyor(false);
  };

  const kameraAc = async () => {
    try {
      setKameraAcik(true);
      setTaramaAktif(true);
      const codeReader = new BrowserMultiFormatReader();
      readerRef.current = codeReader;

      setTimeout(async () => {
        if (!videoRef.current) return;
        try {
          await codeReader.decodeFromVideoDevice(
            undefined,
            videoRef.current,
            (result, err) => {
              if (result) {
                const kod = result.getText();
                setBarkod(kod);
                setTaramaAktif(false);
                codeReader.reset();
                barkodSorgula(kod);
              }
              if (err && err.name !== "NotFoundException") {
                console.log(err);
              }
            }
          );
        } catch (e) {
          console.log(e);
          alert("Kamera açılamadı.");
          setKameraAcik(false);
          setTaramaAktif(false);
        }
      }, 200);
    } catch {
      alert("Kamera erişimi reddedildi.");
      setKameraAcik(false);
      setTaramaAktif(false);
    }
  };

  const kameraKapat = () => {
    if (readerRef.current) {
      readerRef.current.reset();
      readerRef.current = null;
    }
    setKameraAcik(false);
    setTaramaAktif(false);
  };

  const icerikUret = async () => {
    if (girisTipi === "manuel" && (!urunAdi || !kategori)) return;
    if (girisTipi === "foto" && fotolar.length === 0) return;
    if (girisTipi === "barkod" && !barkodBilgi) return;
    setYukleniyor(true);
    setSonuc("");

    const res = await fetch("/api/uret", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        urunAdi,
        kategori,
        ozellikler,
        platform,
        fotolar,
        girisTipi,
        barkodBilgi,
      }),
    });

    const data = await res.json();
    setSonuc(data.icerik);
    setYukleniyor(false);
  };

  const uretButonAktif =
    !yukleniyor &&
    ((girisTipi === "manuel" && urunAdi && kategori) ||
     (girisTipi === "foto" && fotolar.length > 0) ||
     (girisTipi === "barkod" && barkodBilgi !== null));

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">

        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            YZ<span className="text-orange-500">Liste</span>
          </h1>
          <p className="text-gray-500">E-ticaret satıcıları için AI içerik asistanı</p>
        </div>

        <div className="bg-white rounded-2xl shadow p-6 space-y-4">

          {/* Giriş tipi */}
          <div className="flex gap-2">
            {(["manuel", "foto", "barkod"] as const).map((tip) => (
              <button
                key={tip}
                onClick={() => { setGirisTipi(tip); kameraKapat(); }}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                  girisTipi === tip
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {tip === "manuel" ? "Manuel" : tip === "foto" ? "📷 Fotoğraf" : "🔍 Barkod"}
              </button>
            ))}
          </div>

          {/* Manuel */}
          {girisTipi === "manuel" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ürün Adı *</label>
                <input
                  type="text"
                  value={urunAdi}
                  onChange={(e) => setUrunAdi(e.target.value)}
                  placeholder="örn: Erkek Deri Bot"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori *</label>
                <input
                  type="text"
                  value={kategori}
                  onChange={(e) => setKategori(e.target.value)}
                  placeholder="örn: Ayakkabı / Giyim / Elektronik"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
            </>
          )}

          {/* Fotoğraf */}
          {girisTipi === "foto" && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Ürün Fotoğrafları * <span className="text-gray-400 font-normal">(max 3)</span>
              </label>
              {fotolar.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {fotolar.map((f, i) => (
                    <div key={i} className="relative">
                      <img src={f} alt={`Ürün ${i + 1}`} className="w-24 h-24 object-cover rounded-lg border border-gray-200" />
                      <button
                        onClick={() => fotoKaldir(i)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                      >×</button>
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

          {/* Barkod */}
          {girisTipi === "barkod" && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">Barkod *</label>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={barkod}
                  onChange={(e) => setBarkod(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && barkodSorgula(barkod)}
                  placeholder="Barkod numarası (EAN/UPC)"
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                <button
                  onClick={() => barkodSorgula(barkod)}
                  disabled={barkodYukleniyor || barkod.length < 8}
                  className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  {barkodYukleniyor ? "..." : "Sorgula"}
                </button>
                <button
                  onClick={kameraAcik ? kameraKapat : kameraAc}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    kameraAcik ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {kameraAcik ? "Kapat" : "📷 Tara"}
                </button>
              </div>

              {kameraAcik && (
                <div className="relative rounded-lg overflow-hidden">
                  <video ref={videoRef} className="w-full rounded-lg" playsInline muted />
                  {taramaAktif && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-48 h-48 border-2 border-orange-400 rounded-lg relative">
                        <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-orange-500 rounded-tl"></div>
                        <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-orange-500 rounded-tr"></div>
                        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-orange-500 rounded-bl"></div>
                        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-orange-500 rounded-br"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-full h-0.5 bg-orange-400 opacity-70 animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <p className="text-xs text-gray-400 text-center mt-2">Barkodu çerçeve içine hizala</p>
                </div>
              )}

              {barkodBilgi && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm">
                  <p className="font-medium text-green-800">✓ Ürün bulundu</p>
                  <p className="text-green-700">{barkodBilgi.isim}</p>
                  {barkodBilgi.marka && <p className="text-green-600 text-xs">Marka: {barkodBilgi.marka}</p>}
                </div>
              )}
            </div>
          )}

          {/* Ek bilgi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ek Bilgi <span className="text-gray-400 font-normal">(isteğe bağlı)</span>
            </label>
            <textarea
              value={ozellikler}
              onChange={(e) => setOzellikler(e.target.value)}
              placeholder="örn: renk, beden, malzeme, özel özellikler..."
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {/* Platform */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              <option value="trendyol">Trendyol</option>
              <option value="hepsiburada">Hepsiburada</option>
              <option value="amazon">Amazon TR</option>
              <option value="n11">N11</option>
            </select>
          </div>

          <button
            onClick={icerikUret}
            disabled={!uretButonAktif}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            {yukleniyor ? "Üretiliyor..." : "İçerik Üret"}
          </button>
        </div>

        {sonuc && (
          <div className="bg-white rounded-2xl shadow p-6 mt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Üretilen İçerik</h2>
              <button
                onClick={() => navigator.clipboard.writeText(sonuc)}
                className="text-sm text-orange-500 hover:text-orange-600 font-medium"
              >
                Kopyala
              </button>
            </div>
            <pre className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">{sonuc}</pre>
          </div>
        )}

      </div>
    </main>
  );
}