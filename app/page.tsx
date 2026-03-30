"use client";
import { useState } from "react";

export default function Home() {
  const [urunAdi, setUrunAdi] = useState("");
  const [kategori, setKategori] = useState("");
  const [ozellikler, setOzellikler] = useState("");
  const [platform, setPlatform] = useState("trendyol");
  const [sonuc, setSonuc] = useState("");
  const [yukleniyor, setYukleniyor] = useState(false);
  const [fotolar, setFotolar] = useState<string[]>([]);
  const [girisTipi, setGirisTipi] = useState<"manuel" | "foto">("manuel");

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

  const icerikUret = async () => {
    if (girisTipi === "manuel" && (!urunAdi || !kategori)) return;
    if (girisTipi === "foto" && fotolar.length === 0) return;
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
      }),
    });

    const data = await res.json();
    setSonuc(data.icerik);
    setYukleniyor(false);
  };

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
            <button
              onClick={() => setGirisTipi("manuel")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                girisTipi === "manuel"
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Manuel Giriş
            </button>
            <button
              onClick={() => setGirisTipi("foto")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                girisTipi === "foto"
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              📷 Fotoğraftan Üret
            </button>
          </div>

          {/* Manuel giriş */}
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

          {/* Fotoğraf girişi */}
          {girisTipi === "foto" && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Ürün Fotoğrafları * <span className="text-gray-400 font-normal">(max 3)</span>
              </label>

              {/* Fotoğraf önizlemeleri */}
              {fotolar.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {fotolar.map((f, i) => (
                    <div key={i} className="relative">
                      <img
                        src={f}
                        alt={`Ürün ${i + 1}`}
                        className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        onClick={() => fotoKaldir(i)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Yükleme alanı */}
              {fotolar.length < 3 && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={fotoSec}
                    className="hidden"
                    id="foto-input"
                  />
                  <label htmlFor="foto-input" className="cursor-pointer space-y-2 block">
                    <div className="text-3xl">📷</div>
                    <p className="text-gray-500 text-sm">
                      {fotolar.length === 0
                        ? "Fotoğraf seçmek için tıkla"
                        : "Daha fazla fotoğraf ekle"}
                    </p>
                    <p className="text-gray-400 text-xs">
                      {3 - fotolar.length} fotoğraf daha ekleyebilirsin
                    </p>
                  </label>
                </div>
              )}
            </div>
          )}

          {/* Ek bilgi — her iki modda da göster */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ek Bilgi <span className="text-gray-400 font-normal">(isteğe bağlı)</span>
            </label>
            <textarea
              value={ozellikler}
              onChange={(e) => setOzellikler(e.target.value)}
              placeholder="örn: hakiki deri, su geçirmez, kışlık, siyah renk, beden 42"
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
            disabled={
              yukleniyor ||
              (girisTipi === "manuel" && (!urunAdi || !kategori)) ||
              (girisTipi === "foto" && fotolar.length === 0)
            }
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