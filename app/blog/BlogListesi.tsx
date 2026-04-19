"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import type { BlogYazisi } from "./icerikler";

interface Props {
  yazilar: BlogYazisi[];
  kategoriler: string[];
}

export default function BlogListesi({ yazilar, kategoriler }: Props) {
  const [aramaMetni, setAramaMetni] = useState("");
  const [aktifKategori, setAktifKategori] = useState<string | null>(null);

  const filtrelenmis = useMemo(() => {
    return yazilar.filter((y) => {
      const aramaUyumu =
        aramaMetni.trim() === "" ||
        y.baslik.toLowerCase().includes(aramaMetni.toLowerCase()) ||
        y.ozet.toLowerCase().includes(aramaMetni.toLowerCase());
      const kategoriUyumu =
        aktifKategori === null || y.kategori === aktifKategori;
      return aramaUyumu && kategoriUyumu;
    });
  }, [yazilar, aramaMetni, aktifKategori]);

  return (
    <>
      {/* ARAMA + KATEGORİ */}
      <section className="px-4 sm:px-6 pb-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {/* Arama kutusu */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
            <input
              type="search"
              value={aramaMetni}
              onChange={(e) => setAramaMetni(e.target.value)}
              placeholder="Yazılarda ara..."
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
            />
            {aramaMetni && (
              <button
                onClick={() => setAramaMetni("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg leading-none"
                aria-label="Aramayı temizle"
              >
                ×
              </button>
            )}
          </div>

          {/* Kategori pilleri */}
          {kategoriler.length > 1 && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setAktifKategori(null)}
                className={`text-xs px-3 py-1.5 rounded-full font-medium border transition-colors ${
                  aktifKategori === null
                    ? "bg-indigo-500 text-white border-indigo-500"
                    : "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100"
                }`}
              >
                Tümü
              </button>
              {kategoriler.map((k) => (
                <button
                  key={k}
                  onClick={() => setAktifKategori(aktifKategori === k ? null : k)}
                  className={`text-xs px-3 py-1.5 rounded-full font-medium border transition-colors ${
                    aktifKategori === k
                      ? "bg-indigo-500 text-white border-indigo-500"
                      : "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100"
                  }`}
                >
                  {k}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* YAZI LİSTESİ */}
      <section className="px-4 sm:px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {filtrelenmis.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtrelenmis.map((yazi) => (
                <Link
                  key={yazi.slug}
                  href={`/blog/${yazi.slug}`}
                  className="group bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col"
                >
                  {yazi.kapakGorsel && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={yazi.kapakGorsel}
                      alt={yazi.baslik}
                      style={{ width: "100%", height: "176px", objectFit: "cover", display: "block" }}
                    />
                  )}
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs bg-indigo-50 text-indigo-600 border border-indigo-100 px-2 py-0.5 rounded-full font-medium">
                        {yazi.kategori}
                      </span>
                      <span className="text-xs text-gray-400">{yazi.okumaSuresi} dk okuma</span>
                    </div>
                    <h2 className="font-bold text-gray-800 text-sm leading-snug mb-2 group-hover:text-indigo-600 transition-colors line-clamp-3">
                      {yazi.baslik}
                    </h2>
                    <p className="text-xs text-gray-500 leading-relaxed flex-1 line-clamp-3">
                      {yazi.ozet}
                    </p>
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                      <span className="text-xs text-gray-400">
                        {new Date(yazi.yayinTarihi).toLocaleDateString("tr-TR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                      <span className="text-xs text-indigo-500 font-medium group-hover:underline">
                        Oku →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-400">
              <div className="text-4xl mb-4">🔍</div>
              <p className="text-sm">
                {aramaMetni
                  ? `"${aramaMetni}" için sonuç bulunamadı.`
                  : "Bu kategoride yazı yok."}
              </p>
              <button
                onClick={() => { setAramaMetni(""); setAktifKategori(null); }}
                className="mt-4 text-xs text-indigo-500 hover:underline"
              >
                Filtreyi temizle
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
