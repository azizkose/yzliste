"use client";
import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { Search, X, FileText } from "lucide-react";
import ChipSelector from "@/components/primitives/ChipSelector";
import type { BlogYazisi } from "./icerikler";

interface Props {
  yazilar: BlogYazisi[];
  kategoriler: string[];
}

const SAYFA_BOYUTU = 12;

export default function BlogListesi({ yazilar, kategoriler }: Props) {
  const [aramaMetni, setAramaMetni] = useState("");
  const [aktifKategori, setAktifKategori] = useState("tümü");
  const [sayfa, setSayfa] = useState(1);

  const chipOptions = useMemo(
    () => [
      { id: "tümü", label: "Tümü" },
      ...kategoriler.map((k) => ({ id: k, label: k })),
    ],
    [kategoriler]
  );

  const handleKategoriDegis = useCallback((v: string) => {
    setAktifKategori(v);
    setSayfa(1);
  }, []);

  const filtrelenmis = useMemo(() => {
    return yazilar.filter((y) => {
      const aramaUyumu =
        aramaMetni.trim() === "" ||
        y.baslik.toLowerCase().includes(aramaMetni.toLowerCase()) ||
        y.ozet.toLowerCase().includes(aramaMetni.toLowerCase());
      const kategoriUyumu =
        aktifKategori === "tümü" || y.kategori === aktifKategori;
      return aramaUyumu && kategoriUyumu;
    });
  }, [yazilar, aramaMetni, aktifKategori]);

  const gosterilen = filtrelenmis.slice(0, sayfa * SAYFA_BOYUTU);
  const dahaVar = gosterilen.length < filtrelenmis.length;

  return (
    <>
      {/* ARAMA + KATEGORİ */}
      <section className="px-4 sm:px-6 pb-6">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="relative">
            <Search
              size={16}
              strokeWidth={1.5}
              aria-hidden="true"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-rd-neutral-400"
            />
            <input
              type="search"
              value={aramaMetni}
              onChange={(e) => {
                setAramaMetni(e.target.value);
                setSayfa(1);
              }}
              placeholder="Yazı ara..."
              className="w-full pl-9 pr-9 py-2.5 text-sm border border-rd-neutral-200 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-rd-primary-500 bg-white"
              aria-label="Blog yazılarında ara"
            />
            {aramaMetni && (
              <button
                onClick={() => setAramaMetni("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-rd-neutral-400 hover:text-rd-neutral-600"
                aria-label="Aramayı temizle"
              >
                <X size={14} strokeWidth={1.5} aria-hidden="true" />
              </button>
            )}
          </div>

          {kategoriler.length > 1 && (
            <div className="overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
              <ChipSelector
                mode="single"
                label="Kategori filtresi"
                options={chipOptions}
                value={aktifKategori}
                onChange={handleKategoriDegis}
              />
            </div>
          )}
        </div>
      </section>

      {/* YAZI LİSTESİ */}
      <section className="px-4 sm:px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {gosterilen.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gosterilen.map((yazi) => {
                  const titleId = `blog-kart-${yazi.slug}`;
                  return (
                    <article key={yazi.slug} aria-labelledby={titleId}>
                      <Link
                        href={`/blog/${yazi.slug}`}
                        className="group rounded-xl border border-rd-neutral-200 bg-white overflow-hidden flex flex-col h-full hover:border-rd-primary-300 hover:-translate-y-0.5 transition-all"
                      >
                        {yazi.kapakGorsel ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={yazi.kapakGorsel}
                            alt={yazi.baslik}
                            className="w-full aspect-video object-cover"
                          />
                        ) : (
                          <div className="w-full aspect-video bg-rd-neutral-100 flex items-center justify-center">
                            <FileText
                              size={24}
                              strokeWidth={1.5}
                              className="text-rd-neutral-300"
                              aria-hidden="true"
                            />
                          </div>
                        )}
                        <div className="p-5 flex flex-col flex-1">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-xs bg-rd-warm-50 text-rd-warm-700 border border-rd-warm-200 px-2 py-0.5 rounded font-medium">
                              {yazi.kategori}
                            </span>
                            <span className="text-xs text-rd-neutral-400">
                              {yazi.okumaSuresi} dk okuma
                            </span>
                          </div>
                          <h2
                            id={titleId}
                            className="font-medium text-rd-neutral-900 text-base leading-snug mb-2 group-hover:text-rd-primary-700 transition-colors line-clamp-3"
                            style={{ fontFamily: "var(--font-rd-display)" }}
                          >
                            {yazi.baslik}
                          </h2>
                          <p className="text-sm text-rd-neutral-500 leading-relaxed flex-1 line-clamp-2">
                            {yazi.ozet}
                          </p>
                          <div className="flex items-center justify-between mt-4 pt-3 border-t border-rd-neutral-100">
                            <span className="text-xs text-rd-neutral-400">
                              {new Date(yazi.yayinTarihi).toLocaleDateString(
                                "tr-TR",
                                {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                }
                              )}
                            </span>
                            <span className="text-xs text-rd-primary-600 font-medium">
                              Oku →
                            </span>
                          </div>
                        </div>
                      </Link>
                    </article>
                  );
                })}
              </div>

              {dahaVar && (
                <div className="mt-10 text-center">
                  <button
                    onClick={() => setSayfa((s) => s + 1)}
                    className="px-6 py-2.5 text-sm font-medium border border-rd-neutral-300 rounded-lg text-rd-neutral-700 hover:border-rd-primary-400 hover:text-rd-primary-700 transition-colors"
                  >
                    Daha fazla yükle
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <FileText
                size={32}
                strokeWidth={1.5}
                className="text-rd-neutral-300 mx-auto mb-4"
                aria-hidden="true"
              />
              <p className="text-sm text-rd-neutral-500">
                {aramaMetni
                  ? `"${aramaMetni}" için sonuç bulunamadı.`
                  : "Bu kategoride yazı yok."}
              </p>
              <button
                onClick={() => {
                  setAramaMetni("");
                  setAktifKategori("tümü");
                }}
                className="mt-4 text-xs text-rd-primary-600 hover:underline"
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
