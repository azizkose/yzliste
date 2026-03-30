"use client";
import { useState } from "react";

export default function Home() {
  const [urunAdi, setUrunAdi] = useState("");
  const [kategori, setKategori] = useState("");
  const [ozellikler, setOzellikler] = useState("");
  const [platform, setPlatform] = useState("trendyol");
  const [sonuc, setSonuc] = useState("");
  const [yukleniyor, setYukleniyor] = useState(false);
  const [foto, setFoto] = useState<string | null>(null);
  const [girisTipi, setGirisTipi] = useState<"manuel" | "foto">("manuel");

  const fotoSec = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dosya = e.target.files?.[0];
    if (!dosya) return;
    const reader = new FileReader();
    reader.onload = () => setFoto(reader.result as string);
    reader.readAsDataURL(dosya);
  };

  const icerikUret = async () => {
    if (girisTipi === "manuel" && (!urunAdi || !kategori)) return;
    if (girisTipi === "foto" && !foto) return;
    setYukleniyor(true);
    setSonuc("");

    const res = await fetch("/api/uret", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ urunAdi, kategori, ozellikler, platform, foto, girisTipi }),
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

          {/* Giriş tipi seçimi */}
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Özellikler (isteğe bağlı)</label>
                <textarea
                  value={ozellikler}
                  onChange={(e) => setOzellikler(e.target.value)}
                  placeholder="örn: hakiki deri, su geçirmez, kışlık, siyah renk"
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
            </>
          )}

          {/* Fotoğraf girişi */}
          {girisTipi === "foto" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ürün Fotoğrafı *</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={fotoSec}
                  className="hidden"
                  id="foto-input"
                />
                <label htmlFor="foto-input" className="cursor-pointer">
                  {foto ? (
                    <img src={foto} alt="Seçilen ürün" className="max-h-48 mx-auto rounded-lg object-contain" />
                  ) : (
                    <div className="space-y-2">
                      <div className="text-4xl">📷</div>
                      <p className="text-gray-500 text-sm">Fotoğraf seçmek için tıkla</p>
                      <p className="text-gray-400 text-xs">JPG, PNG desteklenir</p>
                    </div>
                  )}
                </label>
              </div>
              {foto && (
                <button
                  onClick={() => setFoto(null)}
                  className="mt-2 text-xs text-red-400 hover:text-red-500"
                >
                  Fotoğrafı kaldır
                </button>
              )}
            </div>
          )}

          {/* Platform seçimi — her iki modda da göster */}
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
              (girisTipi === "foto" && !foto)
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