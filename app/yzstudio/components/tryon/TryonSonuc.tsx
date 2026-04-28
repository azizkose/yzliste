"use client";
import Image from "next/image";
import { Download, RefreshCw, PlayCircle } from "lucide-react";
import { VIDEO_KREDI } from "@/lib/studio-constants";
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
      <div className="space-y-3">
        <div
          className="relative rounded-xl overflow-hidden border border-rd-neutral-200 bg-rd-neutral-100 animate-pulse"
          style={{ paddingBottom: "150%" }}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-2 border-rd-primary-700 border-t-transparent rounded-full animate-spin" aria-hidden="true" />
            <p className="text-sm text-rd-neutral-500">{ilerleme || "İşleniyor..."}</p>
          </div>
        </div>
        <div className="h-8 rounded-lg bg-rd-neutral-100 animate-pulse" />
      </div>
    );
  }

  if (sonuclar.length === 0) return null;

  const ilkSonuc = sonuclar[0];

  return (
    <div className="space-y-4">
      {/* Başlık + tekrar */}
      <div className="flex items-center justify-between">
        <p
          className="text-lg md:text-xl font-medium text-rd-neutral-900"
          style={{ fontFamily: 'var(--font-rd-display)' }}
        >
          Giydirme sonucu {sonuclar.length > 1 ? `(${sonuclar.length} varyasyon)` : ""}
        </p>
        <button
          type="button"
          onClick={onTekrar}
          className="flex items-center gap-1.5 text-xs text-rd-neutral-500 hover:text-rd-neutral-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rd-primary-500 focus-visible:ring-offset-1 rounded"
        >
          <RefreshCw size={12} strokeWidth={1.5} aria-hidden="true" />
          Tekrar üret
        </button>
      </div>

      {/* Sonuç görseller */}
      <div className={`grid gap-3 ${sonuclar.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
        {sonuclar.map((sonuc) => (
          <div key={sonuc.index} className="space-y-2">
            <div
              className="relative rounded-xl overflow-hidden border border-rd-neutral-200 bg-white"
              style={{ paddingBottom: "150%" }}
            >
              <Image
                src={sonuc.url}
                alt={`Giydirme sonucu ${sonuc.index + 1}`}
                fill
                className="object-contain"
              />
            </div>
            <a
              href={sonuc.url}
              download
              className="flex items-center justify-center gap-1.5 w-full py-2 rounded-lg border border-rd-neutral-200 text-rd-neutral-500 text-xs hover:border-rd-neutral-300 hover:text-rd-neutral-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rd-primary-500 focus-visible:ring-offset-1"
            >
              <Download size={12} strokeWidth={1.5} aria-hidden="true" />
              İndir
            </a>
          </div>
        ))}
      </div>

      {/* Video kart — göster ya da TryonVideoAyarlar */}
      {!videoAktif ? (
        <article
          aria-labelledby="video-kart-baslik"
          className="rounded-xl border-2 border-rd-warm-200 bg-rd-warm-50 p-5 md:p-6"
        >
          <div className="flex items-start gap-4">
            <div className="size-12 rounded-lg bg-white border border-rd-warm-200 flex items-center justify-center flex-shrink-0">
              <PlayCircle size={24} strokeWidth={1.5} className="text-rd-warm-700" aria-hidden="true" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] uppercase tracking-[0.15em] text-rd-warm-700 font-medium mb-1">
                PREMIUM
              </p>
              <h3
                id="video-kart-baslik"
                className="text-base md:text-lg font-medium text-rd-neutral-900 mb-1"
                style={{ fontFamily: 'var(--font-rd-display)' }}
              >
                Şimdi videoyu da üret
              </h3>
              <p className="text-sm text-rd-neutral-600 mb-3">
                Görseli kısa videoya dönüştür — sosyal medyaya direkt yükle
              </p>
              <div className="flex items-center gap-3 text-xs text-rd-neutral-500 mb-4">
                <span>5sn · {VIDEO_KREDI["5"]} kredi</span>
                <span className="text-rd-neutral-300">·</span>
                <span>10sn · {VIDEO_KREDI["10"]} kredi</span>
              </div>
              <button
                type="button"
                onClick={() => onVideoAktifToggle(true)}
                className="bg-rd-primary-700 hover:bg-rd-primary-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rd-primary-500 focus-visible:ring-offset-2"
              >
                Video üret
              </button>
            </div>
          </div>
        </article>
      ) : (
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
