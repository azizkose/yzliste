"use client";
import { useRef, useCallback, useState } from "react";
import { Upload, Check, Loader } from "lucide-react";
import Image from "next/image";
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

  // Dinamik manken üretim state
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

  const sekmeler: { id: Sekme; label: string }[] = [
    { id: "hazir", label: "Hazır mankenler" },
    { id: "uret", label: `Manken oluştur (${MANKEN_KREDI} kredi)` },
    { id: "ozel-yukle", label: "Fotoğraf yükle" },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-[#D8D6CE]">Manken seçimi</h3>

      {/* Sekme navigasyon */}
      <div className="flex gap-1 p-1 rounded-lg bg-[#1A1A17] border border-[#2A2A26]">
        {sekmeler.map((s) => (
          <button
            key={s.id}
            onClick={() => setAktifSekme(s.id)}
            className={`flex-1 py-1.5 px-2 rounded text-xs font-medium transition-colors ${
              aktifSekme === s.id
                ? "bg-[#2A2A26] text-[#D8D6CE]"
                : "text-[#5A5852] hover:text-[#908E86]"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Hazır mankenler */}
      {aktifSekme === "hazir" && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {STOK_MANKENLER.map((manken) => {
            const secili = modelKaynagi === "stok" && modelStokId === manken.id;
            return (
              <button
                key={manken.id}
                onClick={() => { onKaynagiChange("stok"); onStokIdChange(manken.id); }}
                className={`relative aspect-[2/3] rounded-lg border overflow-hidden transition-colors ${
                  secili ? "border-[#1E4DD8] ring-1 ring-[#1E4DD8]" : "border-[#2A2A26] hover:border-[#3A3A36]"
                } bg-[#1A1A17]`}
              >
                <Image src={manken.url} alt={manken.label} fill className="object-cover object-top" />
                {secili && (
                  <div className="absolute top-1 right-1">
                    <span className="w-4 h-4 rounded-full bg-[#1E4DD8] flex items-center justify-center">
                      <Check size={10} strokeWidth={2.5} className="text-white" />
                    </span>
                  </div>
                )}
                <div className="absolute bottom-0 inset-x-0 bg-[#111110]/70 px-1 py-0.5">
                  <span className="text-[9px] text-[#908E86] block text-center">{manken.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Manken oluştur */}
      {aktifSekme === "uret" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {/* Cinsiyet */}
            <div>
              <p className="text-xs text-[#908E86] mb-1.5">Cinsiyet</p>
              <div className="flex gap-1.5">
                {MANKEN_SECENEKLER.cinsiyet.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setCinsiyet(c.id)}
                    className={`flex-1 py-1.5 text-xs rounded-lg border transition-colors ${
                      cinsiyet === c.id
                        ? "border-[#1E4DD8] bg-[#1E4DD8]/10 text-[#BAC9EB]"
                        : "border-[#2A2A26] text-[#5A5852] hover:border-[#3A3A36]"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Boy */}
            <div>
              <p className="text-xs text-[#908E86] mb-1.5">Boy</p>
              <div className="flex gap-1">
                {MANKEN_SECENEKLER.boy.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setBoy(b.id)}
                    className={`flex-1 py-1.5 text-xs rounded-lg border transition-colors ${
                      boy === b.id
                        ? "border-[#1E4DD8] bg-[#1E4DD8]/10 text-[#BAC9EB]"
                        : "border-[#2A2A26] text-[#5A5852] hover:border-[#3A3A36]"
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Ten rengi */}
          <div>
            <p className="text-xs text-[#908E86] mb-1.5">Ten rengi</p>
            <div className="flex gap-1.5 flex-wrap">
              {MANKEN_SECENEKLER.tenRengi.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTenRengi(t.id)}
                  className={`py-1.5 px-3 text-xs rounded-lg border transition-colors ${
                    tenRengi === t.id
                      ? "border-[#1E4DD8] bg-[#1E4DD8]/10 text-[#BAC9EB]"
                      : "border-[#2A2A26] text-[#5A5852] hover:border-[#3A3A36]"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Vücut tipi */}
          <div>
            <p className="text-xs text-[#908E86] mb-1.5">Vücut tipi</p>
            <div className="flex gap-1.5">
              {MANKEN_SECENEKLER.vucutTipi.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setVucutTipi(v.id)}
                  className={`flex-1 py-1.5 text-xs rounded-lg border transition-colors ${
                    vucutTipi === v.id
                      ? "border-[#1E4DD8] bg-[#1E4DD8]/10 text-[#BAC9EB]"
                      : "border-[#2A2A26] text-[#5A5852] hover:border-[#3A3A36]"
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>

          {/* Serbest metin */}
          <div>
            <p className="text-xs text-[#908E86] mb-1.5">Ek detay (opsiyonel)</p>
            <input
              type="text"
              value={serbest}
              onChange={(e) => setSerbest(e.target.value)}
              placeholder='örn. "kızıl saçlı, genç, gözlüklü"'
              className="w-full bg-[#1A1A17] border border-[#2A2A26] rounded-lg px-3 py-2 text-xs text-[#D8D6CE] placeholder:text-[#3A3A36] focus:outline-none focus:ring-2 focus:ring-[#1E4DD8]/20 focus:border-[#1E4DD8]"
            />
          </div>

          {/* Üretilen önizleme */}
          {modelUretilenUrl && modelKaynagi === "uretilen" && (
            <div className="relative aspect-[2/3] w-24 rounded-lg overflow-hidden border border-[#1E4DD8]">
              <Image src={modelUretilenUrl} alt="Üretilen manken" fill className="object-cover object-top" />
            </div>
          )}

          <button
            onClick={mankenUret}
            disabled={uretimYukleniyor || (!isAdmin && kredi < MANKEN_KREDI)}
            className="w-full py-2.5 rounded-lg bg-[#1E4DD8] text-white text-sm font-medium hover:bg-[#163B9E] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {uretimYukleniyor ? (
              <>
                <Loader size={14} strokeWidth={1.5} className="animate-spin" />
                Manken oluşturuluyor...
              </>
            ) : (
              `Manken oluştur — ${MANKEN_KREDI} kredi`
            )}
          </button>
          {!isAdmin && kredi < MANKEN_KREDI && (
            <p className="text-xs text-[#C0392B] text-center">Yetersiz kredi</p>
          )}
        </div>
      )}

      {/* Fotoğraf yükle */}
      {aktifSekme === "ozel-yukle" && (
        <div className="space-y-3">
          <div
            onClick={() => inputRef.current?.click()}
            className={`border rounded-xl overflow-hidden cursor-pointer transition-colors ${
              modelOzelFoto && modelKaynagi === "ozel"
                ? "border-[#1E4DD8]"
                : "border-dashed border-[#2A2A26] hover:border-[#3A3A36]"
            } bg-[#1A1A17]`}
          >
            {modelOzelFoto && modelKaynagi === "ozel" ? (
              <div className="relative w-full" style={{ paddingBottom: "150%" }}>
                <Image src={modelOzelFoto} alt="Özel manken" fill className="object-contain" />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 py-10 px-4 text-center">
                <Upload size={24} strokeWidth={1.5} className="text-[#5A5852]" />
                <p className="text-sm text-[#5A5852]">Manken fotoğrafı yükle</p>
                <p className="text-xs text-[#3A3A36]">Tam boy, açık arka plan, yüz görünür</p>
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
