"use client";
import { useState } from "react";

export default function Home() {
  const [urunAdi, setUrunAdi] = useState("");
  const [kategori, setKategori] = useState("");
  const [ozellikler, setOzellikler] = useState("");
  const [platform, setPlatform] = useState("trendyol");
  const [sonuc, setSonuc] = useState("");
  const [yukleniyor, setYukleniyor] = useState(false);

  const icerikUret = async () => {
    if (!urunAdi || !kategori) return;
    setYukleniyor(true);
    setSonuc("");

    const res = await fetch("/api/uret", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ urunAdi, kategori, ozellikler, platform }),
    });

    const data = await res.json();
    setSonuc(data.icerik);
    setYukleniyor(false);
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        
        {/* Başlık */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            YZ<span className="text-orange-500">Liste</span>
          </h1>
          <p className="text-gray-500">E-ticaret satıcıları için AI içerik asistanı</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow p-6 space-y-4">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ürün Adı *
            </label>
            <input
              type="text"
              value={urunAdi}
              onChange={(e) => setUrunAdi(e.target.value)}
              placeholder="örn: Erkek Deri Bot"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kategori *
            </label>
            <input
              type="text"
              value={kategori}
              onChange={(e) => setKategori(e.target.value)}
              placeholder="örn: Ayakkabı / Giyim / Elektronik"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Özellikler (isteğe bağlı)
            </label>
            <textarea
              value={ozellikler}
              onChange={(e) => setOzellikler(e.target.value)}
              placeholder="örn: hakiki deri, su geçirmez, kışlık, siyah renk"
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Platform
            </label>
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
            disabled={yukleniyor || !urunAdi || !kategori}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            {yukleniyor ? "Üretiliyor..." : "İçerik Üret"}
          </button>
        </div>

        {/* Sonuç */}
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
            <pre className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
              {sonuc}
            </pre>
          </div>
        )}

      </div>
    </main>
  );
}