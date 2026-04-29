"use client";
import { useState, useCallback } from "react";
import { Shirt, UserRound, Sparkles, ChevronRight, ImageIcon, X } from "lucide-react";
import { useCredits, useInvalidateCredits } from "@/lib/hooks/useCredits";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import { useTryonUretim } from "@/lib/hooks/useTryonUretim";
import { GarmentUpload } from "./GarmentUpload";
import { ModelPicker } from "./ModelPicker";
import { TryonSonuc } from "./TryonSonuc";
import StudioStickyBar from "@/components/yzstudio/StudioStickyBar";

function OrnekCiktilar() {
  return (
    <div className="space-y-5">
      {/* How it works card */}
      <div className="bg-white border border-rd-neutral-200 rounded-xl p-5 md:p-6">
        <p className="text-[10px] uppercase tracking-[0.15em] text-rd-warm-700 font-medium mb-2">
          NASIL ÇALIŞIYOR
        </p>
        <h3
          className="text-lg md:text-xl font-medium text-rd-neutral-900 mb-5"
          style={{ fontFamily: 'var(--font-rd-display)' }}
        >
          AI saniyeler içinde giydirir
        </h3>
        <div className="flex items-start gap-2 md:gap-3">
          <div className="flex flex-col items-center gap-2 flex-1">
            <div className="w-10 h-10 rounded-lg bg-rd-warm-50 border border-rd-warm-200 flex items-center justify-center">
              <Shirt size={18} strokeWidth={1.5} className="text-rd-warm-700" aria-hidden="true" />
            </div>
            <span className="text-xs text-rd-neutral-600 text-center">Kıyafet</span>
          </div>
          <ChevronRight size={14} className="text-rd-neutral-300 flex-shrink-0 mt-3" aria-hidden="true" />
          <div className="flex flex-col items-center gap-2 flex-1">
            <div className="w-10 h-10 rounded-lg bg-rd-warm-50 border border-rd-warm-200 flex items-center justify-center">
              <UserRound size={18} strokeWidth={1.5} className="text-rd-warm-700" aria-hidden="true" />
            </div>
            <span className="text-xs text-rd-neutral-600 text-center">Manken</span>
          </div>
          <ChevronRight size={14} className="text-rd-neutral-300 flex-shrink-0 mt-3" aria-hidden="true" />
          <div className="flex flex-col items-center gap-2 flex-1">
            <div className="w-10 h-10 rounded-lg bg-rd-warm-50 border border-rd-warm-200 flex items-center justify-center">
              <Sparkles size={18} strokeWidth={1.5} className="text-rd-warm-700" aria-hidden="true" />
            </div>
            <span className="text-xs text-rd-neutral-600 text-center">Sonuç</span>
          </div>
        </div>
      </div>

      {/* Example placeholders */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { etiket: 'Düz tişört → Kadın 1' },
          { etiket: 'Askıda gömlek → Erkek 2' },
        ].map((ornek, i) => (
          <div key={i} className="space-y-2">
            <div className="flex items-center gap-1.5">
              <div className="flex-1 aspect-[2/3] rounded-lg bg-rd-neutral-100 border border-rd-neutral-200 flex items-center justify-center">
                <ImageIcon size={18} strokeWidth={1.5} className="text-rd-neutral-400" aria-hidden="true" />
              </div>
              <ChevronRight size={12} className="text-rd-neutral-300 flex-shrink-0" aria-hidden="true" />
              <div className="flex-1 aspect-[2/3] rounded-lg bg-rd-neutral-100 border border-rd-neutral-200 flex items-center justify-center">
                <ImageIcon size={18} strokeWidth={1.5} className="text-rd-neutral-400" aria-hidden="true" />
              </div>
            </div>
            <p className="text-xs text-rd-neutral-400 text-center">{ornek.etiket}</p>
          </div>
        ))}
      </div>
      <p className="text-xs text-rd-neutral-400 text-center">Örnek görseller yakında</p>
    </div>
  );
}

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

  const stepCircleBase = "absolute top-0 size-10 md:size-12 rounded-full bg-rd-warm-700 text-white text-base md:text-xl font-medium flex items-center justify-center";
  const stepHeadingBase = "text-lg md:text-xl font-medium text-rd-neutral-900 mb-4";

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {hata && (
        <div
          role="alert"
          className="mb-6 px-4 py-3 rounded-lg border border-rd-danger-600 bg-rd-danger-50 text-rd-danger-700 text-sm flex items-start justify-between gap-3"
        >
          <span>{hata}</span>
          <button
            type="button"
            onClick={() => setHata(null)}
            aria-label="Hatayı kapat"
            className="text-rd-danger-700 opacity-60 hover:opacity-100 shrink-0 transition-opacity"
          >
            <X size={14} strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Left column: numbered steps */}
        <div>
          {/* Step 1 */}
          <section
            aria-labelledby="adim-1-baslik"
            className="relative ml-5 md:ml-6 pl-12 md:pl-16 pb-8 border-l-2 border-rd-neutral-200"
          >
            <div
              className={`${stepCircleBase} -left-5 md:-left-6`}
              style={{ fontFamily: 'var(--font-rd-display)' }}
              aria-hidden="true"
            >
              1
            </div>
            <h2
              id="adim-1-baslik"
              className={stepHeadingBase}
              style={{ fontFamily: 'var(--font-rd-display)' }}
            >
              Kıyafet fotoğrafı
            </h2>
            <GarmentUpload
              foto={state.garmentFoto}
              garmentPhotoType={state.garmentPhotoType}
              category={state.category}
              onFotoChange={(v) => set("garmentFoto", v)}
              onPhotoTypeChange={(v) => set("garmentPhotoType", v)}
              onCategoryChange={(v) => set("category", v)}
            />
          </section>

          {/* Step 2 */}
          <section
            aria-labelledby="adim-2-baslik"
            className="relative ml-5 md:ml-6 pl-12 md:pl-16 pb-0 border-l-2 border-transparent"
          >
            <div
              className={`${stepCircleBase} -left-5 md:-left-6`}
              style={{ fontFamily: 'var(--font-rd-display)' }}
              aria-hidden="true"
            >
              2
            </div>
            <h2
              id="adim-2-baslik"
              className={stepHeadingBase}
              style={{ fontFamily: 'var(--font-rd-display)' }}
            >
              Manken seç
            </h2>
            <ModelPicker
              modelKaynagi={state.modelKaynagi}
              modelStokId={state.modelStokId}
              modelOzelFoto={state.modelOzelFoto}
              modelUretilenUrl={state.modelUretilenUrl}
              kredi={kredi}
              userId={currentUser?.id ?? null}
              isAdmin={currentUser?.is_admin === true}
              onKaynagiChange={(v) => set("modelKaynagi", v)}
              onStokIdChange={(v) => set("modelStokId", v)}
              onOzelFotoChange={(v) => set("modelOzelFoto", v)}
              onUretilenUrlChange={(v) => set("modelUretilenUrl", v)}
              onKrediDus={(miktar) => setKredi(k => Math.max(0, k - miktar))}
              onHata={setHata}
            />
          </section>
        </div>

        {/* Right column: result or empty state */}
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
            <OrnekCiktilar />
          )}
        </div>
      </div>

      {/* Sticky bottom bar — replaces TryonAyarlar */}
      <StudioStickyBar
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
  );
}
