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
    <div className="border-t border-rd-neutral-200 pt-5 space-y-4 mt-2">
      <h4
        className="text-base font-medium text-rd-neutral-900"
        style={{ fontFamily: 'var(--font-rd-display)' }}
      >
        Bu görseli videoya dönüştür
      </h4>

      <div>
        <p className="text-xs uppercase tracking-wide text-rd-neutral-500 mb-2">Hareket stili</p>
        <div className="grid grid-cols-2 gap-2">
          {TRYON_VIDEO_PRESETLER.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => onPresetChange(p.id)}
              aria-pressed={preset === p.id}
              className={[
                "text-left px-3 py-2.5 rounded-lg border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rd-primary-500 focus-visible:ring-offset-1",
                preset === p.id
                  ? "border-2 border-rd-primary-700 bg-rd-primary-50 text-rd-primary-700"
                  : "border border-rd-neutral-200 text-rd-neutral-700 hover:border-rd-primary-400 hover:bg-rd-neutral-50",
              ].join(" ")}
            >
              <div className="text-xs font-medium">{p.etiket}</div>
              <div className="text-[10px] opacity-70 mt-0.5">{p.aciklama}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs uppercase tracking-wide text-rd-neutral-500 mb-2">Süre</p>
        <div className="flex gap-2">
          {(["5", "10"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onSureChange(s)}
              aria-pressed={sure === s}
              className={[
                "flex-1 py-2 rounded-lg border text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rd-primary-500 focus-visible:ring-offset-1",
                sure === s
                  ? "border-2 border-rd-primary-700 bg-rd-primary-50 text-rd-primary-700"
                  : "border border-rd-neutral-200 text-rd-neutral-700 hover:border-rd-primary-400 hover:bg-rd-neutral-50",
              ].join(" ")}
            >
              {s} saniye — {VIDEO_KREDI[s]} kredi
            </button>
          ))}
        </div>
      </div>

      {onayAktif ? (
        <div className="rounded-lg border border-rd-primary-200 bg-rd-primary-50 px-4 py-3 space-y-3">
          <p className="text-sm text-rd-neutral-900">
            Bu işlem <span className="font-medium">{videoKredi} kredi</span> harcar. Devam?
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setOnayAktif(false)}
              className="flex-1 py-2 rounded-lg border border-rd-neutral-200 bg-white text-sm text-rd-neutral-700 hover:border-rd-neutral-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rd-primary-500 focus-visible:ring-offset-2"
            >
              İptal
            </button>
            <button
              type="button"
              onClick={() => { setOnayAktif(false); onVideoUret(tryonImageUrl); }}
              className="flex-1 py-2 rounded-lg bg-rd-primary-700 text-white text-sm font-medium hover:bg-rd-primary-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rd-primary-500 focus-visible:ring-offset-2"
            >
              Onayla
            </button>
          </div>
        </div>
      ) : (
        <>
          <button
            type="button"
            onClick={yetersizKredi || videoYukleniyor ? undefined : () => setOnayAktif(true)}
            disabled={videoYukleniyor}
            aria-disabled={yetersizKredi || videoYukleniyor || undefined}
            className={[
              "w-full py-3 rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rd-primary-500 focus-visible:ring-offset-2",
              yetersizKredi || videoYukleniyor
                ? "bg-rd-neutral-300 text-rd-neutral-500 cursor-not-allowed"
                : "bg-rd-primary-700 text-white hover:bg-rd-primary-800",
            ].join(" ")}
          >
            {videoYukleniyor ? "Video oluşturuluyor..." : `Videoya dönüştür — ${videoKredi} kredi`}
          </button>
          {yetersizKredi && (
            <p className="text-xs text-rd-danger-700 text-center">Yetersiz kredi — {videoKredi} kredi gerekli</p>
          )}
        </>
      )}
    </div>
  );
}
