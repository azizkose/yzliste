"use client";
import { TRYON_VIDEO_PRESETLER, VIDEO_KREDI } from "@/lib/studio-constants";

interface TryonVideoAyarlarProps {
  preset: string;
  sure: "5" | "10";
  videoKredi: number;
  kredi: number;
  videoYukleniyor: boolean;
  tryonImageUrl: string;
  onPresetChange: (v: string) => void;
  onSureChange: (v: "5" | "10") => void;
  onVideoUret: (url: string) => void;
}

export function TryonVideoAyarlar({
  preset, sure, videoKredi, kredi, videoYukleniyor, tryonImageUrl,
  onPresetChange, onSureChange, onVideoUret,
}: TryonVideoAyarlarProps) {
  const yetersizKredi = kredi < videoKredi;

  return (
    <div className="border-t border-[#2A2A26] pt-5 space-y-4 mt-2">
      <h4 className="text-sm font-medium text-[#D8D6CE]">Bu görseli videoya dönüştür</h4>

      <div>
        <p className="text-xs text-[#908E86] mb-2">Hareket stili</p>
        <div className="grid grid-cols-2 gap-2">
          {TRYON_VIDEO_PRESETLER.map((p) => (
            <button
              key={p.id}
              onClick={() => onPresetChange(p.id)}
              className={`text-left px-3 py-2.5 rounded-lg border transition-colors ${
                preset === p.id
                  ? "border-[#1E4DD8] bg-[#1E4DD8]/10 text-[#BAC9EB]"
                  : "border-[#2A2A26] text-[#5A5852] hover:border-[#3A3A36]"
              }`}
            >
              <div className="text-xs font-medium">{p.etiket}</div>
              <div className="text-[10px] opacity-70 mt-0.5">{p.aciklama}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs text-[#908E86] mb-2">Süre</p>
        <div className="flex gap-2">
          {(["5", "10"] as const).map((s) => (
            <button
              key={s}
              onClick={() => onSureChange(s)}
              className={`flex-1 py-2 rounded-lg border text-xs transition-colors ${
                sure === s
                  ? "border-[#1E4DD8] bg-[#1E4DD8]/10 text-[#BAC9EB]"
                  : "border-[#2A2A26] text-[#5A5852] hover:border-[#3A3A36]"
              }`}
            >
              {s} saniye — {VIDEO_KREDI[s]} kredi
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => onVideoUret(tryonImageUrl)}
        disabled={videoYukleniyor || yetersizKredi}
        className="w-full py-3 rounded-lg border border-[#1E4DD8] text-[#BAC9EB] text-sm font-medium hover:bg-[#1E4DD8]/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {videoYukleniyor ? "Video oluşturuluyor..." : `Videoya dönüştür — ${videoKredi} kredi`}
      </button>
      {yetersizKredi && (
        <p className="text-xs text-[#C0392B] text-center">Yetersiz kredi — {videoKredi} kredi gerekli</p>
      )}
    </div>
  );
}
