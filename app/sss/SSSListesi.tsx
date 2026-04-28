"use client";
import { useState, useMemo } from "react";
import { Search, X, Mail } from "lucide-react";
import ChipSelector from "@/components/primitives/ChipSelector";
import Accordion, { type AccordionItem } from "@/components/primitives/Accordion";

export interface SSSItem {
  s: string;
  c: string;
  kategori: string;
}

interface Props {
  sorular: SSSItem[];
}

export default function SSSListesi({ sorular }: Props) {
  const [aramaMetni, setAramaMetni] = useState("");
  const [aktifKategori, setAktifKategori] = useState("tümü");

  const kategoriler = useMemo(
    () => [...new Set(sorular.map((s) => s.kategori))],
    [sorular]
  );

  const chipOptions = useMemo(
    () => [
      { id: "tümü", label: "Tümü" },
      ...kategoriler.map((k) => ({ id: k, label: k })),
    ],
    [kategoriler]
  );

  const filtrelenmis = useMemo(() => {
    return sorular.filter((item) => {
      const aramaUyumu =
        aramaMetni.trim() === "" ||
        item.s.toLowerCase().includes(aramaMetni.toLowerCase()) ||
        item.c.toLowerCase().includes(aramaMetni.toLowerCase());
      const kategoriUyumu =
        aktifKategori === "tümü" || item.kategori === aktifKategori;
      return aramaUyumu && kategoriUyumu;
    });
  }, [sorular, aramaMetni, aktifKategori]);

  const accordionItems: AccordionItem[] = useMemo(
    () =>
      filtrelenmis.map((item, i) => ({
        id: `sss-item-${i}`,
        trigger: item.s,
        content: item.c,
      })),
    [filtrelenmis]
  );

  return (
    <>
      {/* Filter */}
      <div className="space-y-4 mb-8">
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
            onChange={(e) => setAramaMetni(e.target.value)}
            placeholder="Soru ara..."
            className="w-full pl-9 pr-9 py-2.5 text-sm border border-rd-neutral-200 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-rd-primary-500 bg-white"
            aria-label="SSS'te ara"
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

        <div className="overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
          <ChipSelector
            mode="single"
            label="Kategori filtresi"
            options={chipOptions}
            value={aktifKategori}
            onChange={setAktifKategori}
          />
        </div>
      </div>

      {/* Accordion */}
      {filtrelenmis.length > 0 ? (
        <Accordion
          key={`${aktifKategori}-${aramaMetni}`}
          items={accordionItems}
          idPrefix="sss"
        />
      ) : (
        <div className="text-center py-12">
          <p className="text-sm text-rd-neutral-500">Soru bulunamadı.</p>
          <button
            onClick={() => {
              setAramaMetni("");
              setAktifKategori("tümü");
            }}
            className="mt-3 text-xs text-rd-primary-600 hover:underline"
          >
            Filtreyi temizle
          </button>
        </div>
      )}

      {/* CTA */}
      <div className="mt-12 rounded-lg bg-rd-neutral-50 border border-rd-neutral-200 p-6 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
        <Mail
          className="h-5 w-5 text-rd-neutral-400 flex-shrink-0"
          aria-hidden="true"
        />
        <div className="flex-1">
          <p className="text-sm font-medium text-rd-neutral-700">
            Cevabını bulamadın mı?
          </p>
          <p className="text-xs text-rd-neutral-500 mt-0.5">
            Yanıt süremiz 24 saattir.
          </p>
        </div>
        <a
          href="mailto:destek@yzliste.com"
          className="text-sm font-medium text-rd-primary-600 hover:text-rd-primary-700 transition-colors"
        >
          destek@yzliste.com
        </a>
      </div>
    </>
  );
}
