"use client";
import { useRef, useCallback, useState } from "react";
import { Upload, Check, Loader } from "lucide-react";
import Image from "next/image";
import Tooltip from "@/components/primitives/Tooltip";
import { STOK_MANKENLER, MANKEN_SECENEKLER, MANKEN_KREDI } from "@/lib/studio-constants";

interface ModelPickerProps {
  modelKaynagi: "stok" | "ozel" | "uretilen";
  modelStokId: string | null;
  modelOzelFoto: string | null;
  modelUretilenUrl: string | null;
  kredi: number;
  userId: string | null;
  isAdmin: boolean;
  onKaynagiChange: (v: "stok" | "ozel" | "uretilen") => void;
  onStokIdChange: (v: string) => void;
  onOzelFotoChange: (v: string | null) => void;
  onUretilenUrlChange: (v: string | null) => void;
  onKrediDus: (miktar: number) => void;
  onHata: (v: string | null) => void;
}

type Sekme = "hazir" | "ozel-yukle" | "uret";

export function ModelPicker({
  modelKaynagi, modelStokId, modelOzelFoto, modelUretilenUrl,
  kredi, userId, isAdmin,
  onKaynagiChange, onStokIdChange, onOzelFotoChange, onUretilenUrlChange,
  onKrediDus, onHata,
}: ModelPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [aktifSekme, setAktifSekme] = useState<Sekme>("hazir");
  const [uretimYukleniyor, setUretimYukleniyor] = useState(false);

  const [cinsiyet, setCinsiyet] = useState("kadin");
  const [tenRengi, setTenRengi] = useState("bugday");
  const [vucutTipi, setVucutTipi] = useState("orta");
  const [boy, setBoy] = useState("orta");
  const [serbest, setSerbest] = useState("");

  const handleFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      onOzelFotoChange(e.target?.result as string);
      onKaynagiChange("ozel");
    };
    reader.readAsDataURL(file);
  }, [onOzelFotoChange, onKaynagiChange]);

  const mankenUret = useCallback(async () => {
    if (!userId) return;
    if (!isAdmin && kredi < MANKEN_KREDI) { onHata("Manken üretimi için yetersiz kredi."); return; }

    setUretimYukleniyor(true);
    onHata(null);
    try {
      const res = await fetch("/api/studio/manken", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cinsiyet, tenRengi, vucutTipi, boy, serbest, userId }),
      });
      const data = await res.json();
      if (res.status === 402) { onHata("Yetersiz kredi."); return; }
      if (!data.imageUrl) { onHata(data.hata || "Manken üretilemedi."); return; }
      onUretilenUrlChange(data.imageUrl);
      onKaynagiChange("uretilen");
      if (!isAdmin) onKrediDus(data.kullanilanKredi ?? MANKEN_KREDI);
    } catch {
      onHata("Manken üretiminde hata oluştu.");
    } finally {
      setUretimYukleniyor(false);
    }
  }, [userId, isAdmin, kredi, cinsiyet, tenRengi, vucutTipi, boy, serbest, onUretilenUrlChange, onKaynagiChange, onKrediDus, onHata]);

  const sekmeler: { id: Sekme; label: string; labelKisa: string }[] = [
    { id: "hazir", label: "Hazır mankenler", labelKisa: "Hazır" },
    { id: "uret", label: `Oluştur (${MANKEN_KREDI} kr)`, labelKisa: `Oluştur ${MANKEN_KREDI}kr` },
    { id: "ozel-yukle", label: "Fotoğraf yükle", labelKisa: "Fotoğraf" },
  ];

  const chipBase = "py-1.5 px-3 text-sm rounded-lg border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rd-primary-500 focus-visible:ring-offset-1";
  const chipActive = "border-2 border-rd-primary-700 bg-rd-primary-50 text-rd-primary-700";
  const chipIdle = "border border-rd-neutral-300 text-rd-neutral-700 hover:border-rd-primary-400 hover:bg-rd-neutral-50";

  return (
    <div className="space-y-4">
      {/* 3-tab segmented control */}
      <div
        role="tablist"
        aria-label="Manken kaynağı"
        className="flex gap-1 p-1 rounded-lg bg-rd-neutral-100 border border-rd-neutral-200"
      >
        {sekmeler.map((s) => (
          <button
            key={s.id}
            role="tab"
            aria-selected={aktifSekme === s.id}
            onClick={() => setAktifSekme(s.id)}
            className={[
              "flex-1 py-1.5 px-2 rounded text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rd-primary-500 focus-visible:ring-offset-1",
              aktifSekme === s.id
                ? "bg-white text-rd-neutral-900 shadow-rd-xs"
                : "text-rd-neutral-600 hover:text-rd-neutral-900",
            ].join(" ")}
          >
            <span className="hidden sm:inline">{s.label}</span>
            <span className="sm:hidden">{s.labelKisa}</span>
          </button>
        ))}
      </div>

      {/* Hazır mankenler */}
      {aktifSekme === "hazir" && (
        <div
          role="radiogroup"
          aria-label="Hazır manken seç"
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2"
        >
          {STOK_MANKENLER.map((manken) => {
            const secili = modelKaynagi === "stok" && modelStokId === manken.id;
            return (
              <div key={manken.id} className="flex flex-col">
                <button
                  type="button"
                  role="radio"
                  aria-checked={secili}
                  onClick={() => { onKaynagiChange("stok"); onStokIdChange(manken.id); }}
                  className={[
                    "relative aspect-[2/3] rounded-lg border overflow-hidden transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rd-primary-500 focus-visible:ring-offset-1 bg-white",
                    secili
                      ? "border-2 border-rd-primary-700"
                      : "border border-rd-neutral-200 hover:border-rd-primary-400 hover:-translate-y-0.5",
                  ].join(" ")}
                >
                  <Image src={manken.url} alt={manken.label} fill className="object-cover object-top" />
                  {secili && (
                    <div className="absolute top-1 right-1">
                      <span className="w-4 h-4 rounded-full bg-rd-primary-700 flex items-center justify-center">
                        <Check size={10} strokeWidth={2.5} className="text-white" aria-hidden="true" />
                      </span>
                    </div>
                  )}
                </button>
                <p className="text-xs font-medium text-rd-neutral-900 mt-2 text-center">{manken.label}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* AI manken üret */}
      {aktifSekme === "uret" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-sm font-medium text-rd-neutral-700 mb-2">Cinsiyet</p>
              <div className="flex gap-1.5">
                {MANKEN_SECENEKLER.cinsiyet.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCinsiyet(c.id)}
                    aria-pressed={cinsiyet === c.id}
                    className={`flex-1 ${chipBase} ${cinsiyet === c.id ? chipActive : chipIdle}`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-rd-neutral-700 mb-2">Boy</p>
              <div className="flex gap-1">
                {MANKEN_SECENEKLER.boy.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setBoy(b.id)}
                    aria-pressed={boy === b.id}
                    className={`flex-1 ${chipBase} ${boy === b.id ? chipActive : chipIdle}`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-rd-neutral-700 mb-2">Ten rengi</p>
            <div className="flex gap-1.5 flex-wrap">
              {MANKEN_SECENEKLER.tenRengi.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTenRengi(t.id)}
                  aria-pressed={tenRengi === t.id}
                  className={`${chipBase} ${tenRengi === t.id ? chipActive : chipIdle}`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-rd-neutral-700 mb-2">Vücut tipi</p>
            <div className="flex gap-1.5">
              {MANKEN_SECENEKLER.vucutTipi.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setVucutTipi(v.id)}
                  aria-pressed={vucutTipi === v.id}
                  className={`flex-1 ${chipBase} ${vucutTipi === v.id ? chipActive : chipIdle}`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-rd-neutral-700 mb-2 block" htmlFor="manken-serbest">
              Ek detay <span className="font-normal text-rd-neutral-500">(opsiyonel)</span>
            </label>
            <input
              id="manken-serbest"
              type="text"
              value={serbest}
              onChange={(e) => setSerbest(e.target.value)}
              placeholder='örn. "kızıl saçlı, genç, gözlüklü"'
              className="w-full bg-white border border-rd-neutral-200 rounded-lg px-4 py-2.5 text-sm text-rd-neutral-900 placeholder:text-rd-neutral-400 focus:outline-none focus:ring-2 focus:ring-rd-primary-500 focus:border-rd-primary-500 transition-colors"
            />
          </div>

          {modelUretilenUrl && modelKaynagi === "uretilen" && (
            <div className="relative aspect-[2/3] w-24 rounded-lg overflow-hidden border border-rd-primary-700">
              <Image src={modelUretilenUrl} alt="Üretilen manken" fill className="object-cover object-top" />
            </div>
          )}

          <Tooltip content={!isAdmin && kredi < MANKEN_KREDI ? "Yetersiz kredi · Paket al" : null}>
            <button
              type="button"
              onClick={uretimYukleniyor || (!isAdmin && kredi < MANKEN_KREDI) ? undefined : mankenUret}
              aria-disabled={uretimYukleniyor || (!isAdmin && kredi < MANKEN_KREDI) || undefined}
              disabled={uretimYukleniyor}
              className={[
                "w-full py-2.5 rounded-lg text-white text-sm font-medium transition-colors flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rd-primary-500 focus-visible:ring-offset-2",
                uretimYukleniyor || (!isAdmin && kredi < MANKEN_KREDI)
                  ? "bg-rd-neutral-300 text-rd-neutral-500 cursor-not-allowed"
                  : "bg-rd-primary-700 hover:bg-rd-primary-800",
              ].join(" ")}
            >
              {uretimYukleniyor ? (
                <>
                  <Loader size={14} strokeWidth={1.5} className="animate-spin" aria-hidden="true" />
                  Manken oluşturuluyor...
                </>
              ) : (
                `Manken oluştur — ${MANKEN_KREDI} kredi`
              )}
            </button>
          </Tooltip>
        </div>
      )}

      {/* Özel fotoğraf yükle */}
      {aktifSekme === "ozel-yukle" && (
        <div className="space-y-3">
          <div
            onClick={() => inputRef.current?.click()}
            className={[
              "border rounded-xl overflow-hidden cursor-pointer transition-colors bg-white",
              modelOzelFoto && modelKaynagi === "ozel"
                ? "border-rd-primary-700"
                : "border-dashed border-rd-neutral-300 hover:border-rd-primary-500",
            ].join(" ")}
            style={{ minHeight: 200 }}
          >
            {modelOzelFoto && modelKaynagi === "ozel" ? (
              <div className="relative w-full" style={{ paddingBottom: "150%" }}>
                <Image src={modelOzelFoto} alt="Özel manken" fill className="object-contain" />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 py-14 px-4 text-center">
                <div className="w-14 h-14 rounded-lg bg-rd-neutral-100 flex items-center justify-center mb-1">
                  <Upload size={28} strokeWidth={1.5} className="text-rd-neutral-500" aria-hidden="true" />
                </div>
                <p className="text-sm font-medium text-rd-neutral-900">Manken fotoğrafı yükle</p>
                <p className="text-xs text-rd-neutral-500">Tam boy, açık arka plan, yüz görünür</p>
              </div>
            )}
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
          />
        </div>
      )}
    </div>
  );
}
