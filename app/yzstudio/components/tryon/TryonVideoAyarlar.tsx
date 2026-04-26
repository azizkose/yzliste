"use client";
import { useState } from "react";
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
  const [onayAktif, setOnayAktif] = useState(false);

  return (
    <div className="border-t border-[#D8D6CE] pt-5 space-y-4 mt-2">
      <h4 className="text-sm font-medium text-[#1A1A17]">Bu görseli videoya dönüştür</h4>

      <div>
        <p className="text-xs text-[#908E86] mb-2">Hareket stili</p>
        <div className="grid grid-cols-2 gap-2">
          {TRYON_VIDEO_PRESETLER.map((p) => (
            <button
              key={p.id}
              onClick={() => onPresetChange(p.id)}
              className={`text-left px-3 py-2.5 rounded-lg border transition-colors ${
                preset === p.id
                  ? "border-[#1E4DD8] bg-[#1E4DD8] text-white"
                  : "border-[#D8D6CE] text-[#5A5852] hover:border-[#7B9BD9]"
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
                  ? "border-[#1E4DD8] bg-[#1E4DD8] text-white"
                  : "border-[#D8D6CE] text-[#5A5852] hover:border-[#7B9BD9]"
              }`}
            >
              {s} saniye — {VIDEO_KREDI[s]} kredi
            </button>
          ))}
        </div>
      </div>

      {onayAktif ? (
        <div className="rounded-lg border border-[#BAC9EB] bg-[#F0F4FB] px-4 py-3 space-y-3">
          <p className="text-sm text-[#1A1A17]">
            Bu işlem <span className="font-medium">{videoKredi} kredi</span> harcar. Devam?
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setOnayAktif(false)}
              className="flex-1 py-2 rounded-lg border border-[#D8D6CE] bg-white text-sm text-[#5A5852] hover:border-[#7B9BD9] transition-colors"
            >
              İptal
            </button>
            <button
              onClick={() => { setOnayAktif(false); onVideoUret(tryonImageUrl); }}
              className="flex-1 py-2 rounded-lg bg-[#1E4DD8] text-white text-sm hover:bg-[#163B9E] transition-colors"
            >
              Onayla
            </button>
          </div>
        </div>
      ) : (
        <>
          <button
            onClick={yetersizKredi ? () => {} : () => setOnayAktif(true)}
            disabled={videoYukleniyor || yetersizKredi}
            className="w-full py-3 rounded-lg bg-[#1E4DD8] text-white text-sm font-medium hover:bg-[#163B9E] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {videoYukleniyor ? "Video oluşturuluyor..." : `Videoya dönüştür — ${videoKredi} kredi`}
          </button>
          {yetersizKredi && (
            <p className="text-xs text-[#7A1E1E] text-center">Yetersiz kredi — {videoKredi} kredi gerekli</p>
          )}
        </>
      )}
    </div>
  );
}
