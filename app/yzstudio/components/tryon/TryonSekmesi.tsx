"use client";
import { useState, useCallback } from "react";
import { useCredits, useInvalidateCredits } from "@/lib/hooks/useCredits";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import { useTryonUretim } from "@/lib/hooks/useTryonUretim";
import { GarmentUpload } from "./GarmentUpload";
import { ModelPicker } from "./ModelPicker";
import { TryonAyarlar } from "./TryonAyarlar";
import { TryonSonuc } from "./TryonSonuc";

export function TryonSekmesi() {
  const { data: currentUser } = useCurrentUser();
  const { data: krediData } = useCredits();
  const invalidateCredits = useInvalidateCredits();
  const [hata, setHata] = useState<string | null>(null);
  const [localKredi, setLocalKredi] = useState<number | null>(null);

  const kredi = localKredi ?? krediData ?? 0;

  const setKredi = useCallback((fn: (k: number) => number) => {
    setLocalKredi(prev => fn(prev ?? krediData ?? 0));
  }, [krediData]);

  const paketModalAc = useCallback(() => {
    window.location.href = "/kredi-yukle";
  }, []);

  const { state, set, toplamKredi, videoKredi, tryonUret, videoUret } = useTryonUretim({
    userId: currentUser?.id ?? null,
    isAdmin: currentUser?.is_admin === true,
    kredi,
    paketModalAc,
    setHata,
    invalidateCredits,
    setKredi,
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {hata && (
        <div className="mb-6 px-4 py-3 rounded-lg border border-[#7A1E1E] bg-[#FCECEC] text-[#7A1E1E] text-sm flex items-start justify-between gap-3">
          <span>{hata}</span>
          <button onClick={() => setHata(null)} className="text-[#7A1E1E] opacity-60 hover:opacity-100 shrink-0">✕</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sol: Girdiler */}
        <div className="space-y-8">
          <GarmentUpload
            foto={state.garmentFoto}
            garmentPhotoType={state.garmentPhotoType}
            category={state.category}
            onFotoChange={(v) => set("garmentFoto", v)}
            onPhotoTypeChange={(v) => set("garmentPhotoType", v)}
            onCategoryChange={(v) => set("category", v)}
          />

          <ModelPicker
            modelKaynagi={state.modelKaynagi}
            modelStokId={state.modelStokId}
            modelOzelFoto={state.modelOzelFoto}
            onKaynagiChange={(v) => set("modelKaynagi", v)}
            onStokIdChange={(v) => set("modelStokId", v)}
            onOzelFotoChange={(v) => set("modelOzelFoto", v)}
          />

          <TryonAyarlar
            mode={state.mode}
            numSamples={state.numSamples}
            toplamKredi={toplamKredi}
            kredi={kredi}
            yukleniyor={state.yukleniyor}
            onModeChange={(v) => set("mode", v)}
            onNumSamplesChange={(v) => set("numSamples", v)}
            onUret={tryonUret}
          />
        </div>

        {/* Sağ: Sonuç */}
        <div>
          {(state.sonuclar.length > 0 || state.yukleniyor) ? (
            <TryonSonuc
              sonuclar={state.sonuclar}
              yukleniyor={state.yukleniyor}
              ilerleme={state.ilerleme}
              videoAktif={state.videoAktif}
              videoPreset={state.videoPreset}
              videoSure={state.videoSure}
              videoKredi={videoKredi}
              kredi={kredi}
              videoYukleniyor={state.videoYukleniyor}
              videoIlerleme={state.videoIlerleme}
              videoSonuc={state.videoSonuc}
              onTekrar={tryonUret}
              onVideoAktifToggle={(v) => set("videoAktif", v)}
              onVideoPresetChange={(v) => set("videoPreset", v)}
              onVideoSureChange={(v) => set("videoSure", v)}
              onVideoUret={videoUret}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full min-h-64 rounded-xl border border-dashed border-[#2A2A26] text-center px-6 py-12">
              <p className="text-sm text-[#5A5852]">Kıyafet fotoğrafı yükleyin, manken seçin ve giydirmeyi başlatın</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
