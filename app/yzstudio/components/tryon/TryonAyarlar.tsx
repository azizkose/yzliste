"use client";
import { Minus, Plus } from "lucide-react";
import { STUDIO_KREDI } from "@/lib/studio-constants";
import KrediButon from "@/components/ui/KrediButon";

interface TryonAyarlarProps {
  mode: "performance" | "balanced" | "quality";
  numSamples: number;
  toplamKredi: number;
  kredi: number;
  yukleniyor: boolean;
  onModeChange: (v: "performance" | "balanced" | "quality") => void;
  onNumSamplesChange: (v: number) => void;
  onUret: () => void;
}

const MODLAR = [
  { id: "performance" as const, etiket: "Hızlı", sure: "~15 sn" },
  { id: "balanced" as const, etiket: "Dengeli", sure: "~25 sn" },
  { id: "quality" as const, etiket: "En iyi", sure: "~45 sn" },
];

export function TryonAyarlar({
  mode, numSamples, toplamKredi, kredi, yukleniyor,
  onModeChange, onNumSamplesChange, onUret,
}: TryonAyarlarProps) {
  const { minSamples, maxSamples } = STUDIO_KREDI.tryon;
  const yetersizKredi = kredi < toplamKredi;

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-medium text-[#1A1A17] mb-2">Kalite modu</p>
        <div className="flex gap-2">
          {MODLAR.map((m) => (
            <button
              key={m.id}
              onClick={() => onModeChange(m.id)}
              className={`flex-1 py-2 px-3 rounded-lg border text-xs transition-colors ${
                mode === m.id
                  ? "border-[#1E4DD8] bg-[#1E4DD8] text-white"
                  : "bg-white border-[#D8D6CE] text-[#5A5852] hover:border-[#7B9BD9]"
              }`}
            >
              <div className="font-medium">{m.etiket}</div>
              <div className="text-[10px] opacity-70 mt-0.5">{m.sure}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-[#1A1A17] mb-2">Varyasyon sayısı</p>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNumSamplesChange(Math.max(minSamples, numSamples - 1))}
            disabled={numSamples <= minSamples}
            className="w-8 h-8 rounded-lg border border-[#D8D6CE] flex items-center justify-center text-[#908E86] hover:border-[#7B9BD9] disabled:text-[#D8D6CE] disabled:cursor-not-allowed transition-colors"
          >
            <Minus size={14} strokeWidth={1.5} />
          </button>
          <span className="text-base font-medium text-[#1A1A17] w-4 text-center">{numSamples}</span>
          <button
            onClick={() => onNumSamplesChange(Math.min(maxSamples, numSamples + 1))}
            disabled={numSamples >= maxSamples}
            className="w-8 h-8 rounded-lg border border-[#D8D6CE] flex items-center justify-center text-[#908E86] hover:border-[#7B9BD9] disabled:text-[#D8D6CE] disabled:cursor-not-allowed transition-colors"
          >
            <Plus size={14} strokeWidth={1.5} />
          </button>
          <span className="text-xs text-[#5A5852]">{numSamples} varyasyon = {toplamKredi} kredi</span>
        </div>
      </div>

      <div className="pt-1">
        <KrediButon
          label="Mankene giydirme"
          kredi={toplamKredi}
          kalanKredi={kredi}
          onClick={onUret}
          disabled={yetersizKredi}
          yukleniyor={yukleniyor}
          yukleniyorLabel="Hazırlanıyor..."
        />
        {yetersizKredi && (
          <p className="text-xs text-[#7A1E1E] text-center mt-2">
            Yetersiz kredi — {toplamKredi} kredi gerekli
          </p>
        )}
      </div>
    </div>
  );
}
