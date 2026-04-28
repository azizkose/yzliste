"use client";
import { useState, useMemo } from "react";
import { Search, X, ChevronDown, Mail } from "lucide-react";
import ChipSelector from "@/components/primitives/ChipSelector";

export interface SSSItem {
  s: string;
  c: string;
  kategori: string;
}

interface Props {
  sorular: SSSItem[];
}

function AccordionItem({
  soru,
  cevap,
  isOpen,
  onToggle,
  id,
}: {
  soru: string;
  cevap: string;
  isOpen: boolean;
  onToggle: () => void;
  id: string;
}) {
  return (
    <div role="listitem">
      <button
        id={`${id}-trigger`}
        aria-expanded={isOpen}
        aria-controls={`${id}-panel`}
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 py-5 text-left transition-colors hover:text-rd-primary-600"
      >
        <span className="text-sm font-medium text-rd-neutral-900">{soru}</span>
        <ChevronDown
          className={`h-4 w-4 flex-shrink-0 text-rd-neutral-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </button>
      <div
        id={`${id}-panel`}
        role="region"
        aria-labelledby={`${id}-trigger`}
        className="grid transition-[grid-template-rows] duration-200 ease-out"
        style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <p className="pb-5 text-sm leading-relaxed text-rd-neutral-500">
            {cevap}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SSSListesi({ sorular }: Props) {
  const [aramaMetni, setAramaMetni] = useState("");
  const [aktifKategori, setAktifKategori] = useState("tümü");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

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

  const toggle = (i: number) =>
    setOpenIndex((prev) => (prev === i ? null : i));

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
            onChange={(e) => {
              setAramaMetni(e.target.value);
              setOpenIndex(null);
            }}
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
            onChange={(v) => {
              setAktifKategori(v);
              setOpenIndex(null);
            }}
          />
        </div>
      </div>

      {/* Accordion */}
      {filtrelenmis.length > 0 ? (
        <div className="divide-y divide-rd-neutral-200" role="list">
          {filtrelenmis.map((item, i) => (
            <AccordionItem
              key={i}
              id={`sss-item-${i}`}
              soru={item.s}
              cevap={item.c}
              isOpen={openIndex === i}
              onToggle={() => toggle(i)}
            />
          ))}
        </div>
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
