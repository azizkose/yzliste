"use client";
import Image from "next/image";
import { Download, RefreshCw, ChevronDown } from "lucide-react";
import { TryonVideoAyarlar } from "./TryonVideoAyarlar";
import { TryonVideoSonuc } from "./TryonVideoSonuc";

interface TryonSonucProps {
  sonuclar: { url: string; index: number }[];
  yukleniyor: boolean;
  ilerleme: string;
  videoAktif: boolean;
  videoPreset: string;
  videoSure: "5" | "10";
  videoKredi: number;
  kredi: number;
  videoYukleniyor: boolean;
  videoIlerleme: string;
  videoSonuc: { url: string } | null;
  onTekrar: () => void;
  onVideoAktifToggle: (v: boolean) => void;
  onVideoPresetChange: (v: string) => void;
  onVideoSureChange: (v: "5" | "10") => void;
  onVideoUret: (url: string) => void;
}

export function TryonSonuc({
  sonuclar, yukleniyor, ilerleme,
  videoAktif, videoPreset, videoSure, videoKredi, kredi,
  videoYukleniyor, videoIlerleme, videoSonuc,
  onTekrar, onVideoAktifToggle, onVideoPresetChange, onVideoSureChange, onVideoUret,
}: TryonSonucProps) {
  if (yukleniyor) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <div className="w-8 h-8 border-2 border-[#1E4DD8] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-[#908E86]">{ilerleme || "İşleniyor..."}</p>
      </div>
    );
  }

  if (sonuclar.length === 0) return null;

  const ilkSonuc = sonuclar[0];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-[#1A1A17]">
          Giydirme sonucu {sonuclar.length > 1 ? `(${sonuclar.length} varyasyon)` : ""}
        </p>
        <button
          onClick={onTekrar}
          className="flex items-center gap-1.5 text-xs text-[#908E86] hover:text-[#5A5852] transition-colors"
        >
          <RefreshCw size={12} strokeWidth={1.5} />
          Tekrar üret
        </button>
      </div>

      <div className={`grid gap-3 ${sonuclar.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
        {sonuclar.map((sonuc) => (
          <div key={sonuc.index} className="space-y-2">
            <div className="relative rounded-xl overflow-hidden border border-[#D8D6CE] bg-white" style={{ paddingBottom: "150%" }}>
              <Image src={sonuc.url} alt={`Giydirme sonucu ${sonuc.index + 1}`} fill className="object-contain" />
            </div>
            <a
              href={sonuc.url}
              download
              className="flex items-center justify-center gap-1.5 w-full py-2 rounded-lg border border-[#D8D6CE] text-[#908E86] text-xs hover:border-[#7B9BD9] hover:text-[#5A5852] transition-colors"
            >
              <Download size={12} strokeWidth={1.5} />
              İndir
            </a>
          </div>
        ))}
      </div>

      <button
        onClick={() => onVideoAktifToggle(!videoAktif)}
        className="flex items-center justify-between w-full py-2.5 px-3 rounded-lg border border-[#D8D6CE] text-sm text-[#908E86] hover:border-[#7B9BD9] hover:text-[#5A5852] transition-colors"
      >
        <span>Bu görseli videoya dönüştür</span>
        <ChevronDown
          size={14}
          strokeWidth={1.5}
          className={`transition-transform ${videoAktif ? "rotate-180" : ""}`}
        />
      </button>

      {videoAktif && (
        <div>
          <TryonVideoAyarlar
            preset={videoPreset}
            sure={videoSure}
            videoKredi={videoKredi}
            kredi={kredi}
            videoYukleniyor={videoYukleniyor}
            tryonImageUrl={ilkSonuc.url}
            onPresetChange={onVideoPresetChange}
            onSureChange={onVideoSureChange}
            onVideoUret={onVideoUret}
          />
          {(videoYukleniyor || videoSonuc) && (
            <div className="mt-4">
              <TryonVideoSonuc
                videoUrl={videoSonuc?.url || ""}
                videoIlerleme={videoIlerleme}
                videoYukleniyor={videoYukleniyor}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
