"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { STUDIO_KREDI, VIDEO_KREDI } from "@/lib/studio-constants";

interface TryonDeps {
  userId: string | null;
  isAdmin: boolean;
  kredi: number;
  paketModalAc: () => void;
  setHata: (v: string | null) => void;
  invalidateCredits: () => void;
  setKredi: (fn: (k: number) => number) => void;
}

interface TryonState {
  garmentFoto: string | null;
  garmentPhotoType: "auto" | "flat-lay" | "model";
  category: "auto" | "tops" | "bottoms" | "one-pieces";
  modelStokId: string | null;
  modelOzelFoto: string | null;
  modelUretilenUrl: string | null;
  modelKaynagi: "stok" | "ozel" | "uretilen";
  mode: "performance" | "balanced" | "quality";
  numSamples: number;

  sonuclar: { url: string; index: number }[];
  yukleniyor: boolean;
  ilerleme: string;

  videoAktif: boolean;
  videoPreset: string;
  videoSure: "5" | "10";
  videoSonuc: { url: string } | null;
  videoYukleniyor: boolean;
  videoIlerleme: string;
}

export function useTryonUretim(deps: TryonDeps) {
  const [state, setState] = useState<TryonState>({
    garmentFoto: null,
    garmentPhotoType: "auto",
    category: "auto",
    modelStokId: "kadin-1",
    modelOzelFoto: null,
    modelUretilenUrl: null,
    modelKaynagi: "stok",
    mode: "balanced",
    numSamples: 1,
    sonuclar: [],
    yukleniyor: false,
    ilerleme: "",
    videoAktif: false,
    videoPreset: "podyum",
    videoSure: "5",
    videoSonuc: null,
    videoYukleniyor: false,
    videoIlerleme: "",
  });

  const depsRef = useRef(deps);
  useEffect(() => { depsRef.current = deps; });

  const set = useCallback(<K extends keyof TryonState>(key: K, val: TryonState[K]) => {
    setState(prev => ({ ...prev, [key]: val }));
  }, []);

  const toplamKredi = STUDIO_KREDI.tryon.hesapla(state.numSamples);
  const videoKredi = VIDEO_KREDI[state.videoSure];

  const tryonUret = useCallback(async () => {
    const { userId, isAdmin, kredi, paketModalAc, setHata, invalidateCredits, setKredi } = depsRef.current;
    if (!userId) return;
    if (!state.garmentFoto) { setHata("Kıyafet fotoğrafı ekleyin."); return; }
    if (state.modelKaynagi === "stok" && !state.modelStokId) { setHata("Bir manken seçin."); return; }
    if (state.modelKaynagi === "ozel" && !state.modelOzelFoto) { setHata("Manken fotoğrafı yükleyin."); return; }
    if (state.modelKaynagi === "uretilen" && !state.modelUretilenUrl) { setHata("Manken oluşturun."); return; }

    const gerekliKredi = STUDIO_KREDI.tryon.hesapla(state.numSamples);
    if (!isAdmin && kredi < gerekliKredi) { paketModalAc(); return; }

    setState(prev => ({ ...prev, yukleniyor: true, sonuclar: [], ilerleme: "Kıyafet hazırlanıyor...", videoSonuc: null, videoAktif: false }));

    try {
      const res = await fetch("/api/studio/tryon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          garmentImage: state.garmentFoto,
          modelImage: state.modelKaynagi === "ozel" ? state.modelOzelFoto : null,
          modelImageUrl: state.modelKaynagi === "uretilen" ? state.modelUretilenUrl : null,
          modelStokId: state.modelKaynagi === "stok" ? state.modelStokId : null,
          category: state.category,
          garmentPhotoType: state.garmentPhotoType,
          mode: state.mode,
          numSamples: state.numSamples,
          userId,
        }),
      });

      const data = await res.json();

      if (res.status === 402) { paketModalAc(); setState(prev => ({ ...prev, yukleniyor: false, ilerleme: "" })); return; }
      if (!data.requestId) { setHata(data.hata || "Giydirme başlatılamadı."); setState(prev => ({ ...prev, yukleniyor: false, ilerleme: "" })); return; }

      if (!isAdmin) { setKredi(k => Math.max(0, k - (data.kullanilanKredi ?? gerekliKredi))); invalidateCredits(); }

      setState(prev => ({ ...prev, ilerleme: "Kıyafetiniz giydiriliyor..." }));

      for (let deneme = 0; deneme < 60; deneme++) {
        await new Promise(r => setTimeout(r, 3000));
        const pollRes = await fetch(`/api/studio/tryon/poll?requestId=${data.requestId}`);
        const pollData = await pollRes.json();

        if (pollData.status === "COMPLETED") {
          const gorselSonuclar = (pollData.images as { url: string }[]).map((img, i) => ({ url: img.url, index: i }));
          setState(prev => ({ ...prev, sonuclar: gorselSonuclar, yukleniyor: false, ilerleme: "" }));
          return;
        }
        if (pollData.status === "FAILED") {
          setHata(pollData.hata || "Giydirme başarısız oldu.");
          setState(prev => ({ ...prev, yukleniyor: false, ilerleme: "" }));
          return;
        }
        if (deneme === 10) setState(prev => ({ ...prev, ilerleme: "Sonuçlar hazırlanıyor..." }));
      }

      setHata("Zaman aşımı. Tekrar deneyin.");
    } catch {
      setHata("Bir hata oluştu. Lütfen tekrar deneyin.");
    }
    setState(prev => ({ ...prev, yukleniyor: false, ilerleme: "" }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.garmentFoto, state.garmentPhotoType, state.category, state.modelStokId, state.modelOzelFoto, state.modelUretilenUrl, state.modelKaynagi, state.mode, state.numSamples]);

  const videoUret = useCallback(async (tryonImageUrl: string) => {
    const { userId, isAdmin, kredi, paketModalAc, setHata, invalidateCredits, setKredi } = depsRef.current;
    if (!userId) return;

    const gerekliKredi = VIDEO_KREDI[state.videoSure];
    if (!isAdmin && kredi < gerekliKredi) { paketModalAc(); return; }

    setState(prev => ({ ...prev, videoYukleniyor: true, videoSonuc: null, videoIlerleme: "Video oluşturuluyor..." }));

    try {
      const res = await fetch("/api/studio/tryon/video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tryonImageUrl, preset: state.videoPreset, sure: state.videoSure, userId }),
      });

      const data = await res.json();

      if (res.status === 402) { paketModalAc(); setState(prev => ({ ...prev, videoYukleniyor: false, videoIlerleme: "" })); return; }
      if (!data.requestId) { setHata(data.hata || "Video başlatılamadı."); setState(prev => ({ ...prev, videoYukleniyor: false, videoIlerleme: "" })); return; }

      if (!isAdmin) { setKredi(k => Math.max(0, k - (data.kullanilanKredi ?? gerekliKredi))); invalidateCredits(); }

      for (let deneme = 0; deneme < 60; deneme++) {
        await new Promise(r => setTimeout(r, 5000));
        const pollRes = await fetch(`/api/studio/tryon/video/poll?requestId=${data.requestId}`);
        const pollData = await pollRes.json();

        if (pollData.status === "COMPLETED") {
          setState(prev => ({ ...prev, videoSonuc: { url: pollData.videoUrl }, videoYukleniyor: false, videoIlerleme: "" }));
          return;
        }
        if (pollData.status === "FAILED") {
          setHata(pollData.hata || "Video oluşturma başarısız.");
          setState(prev => ({ ...prev, videoYukleniyor: false, videoIlerleme: "" }));
          return;
        }
      }

      setHata("Video zaman aşımı. Tekrar deneyin.");
    } catch {
      setHata("Video oluşturulurken hata oluştu.");
    }
    setState(prev => ({ ...prev, videoYukleniyor: false, videoIlerleme: "" }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.videoPreset, state.videoSure]);

  return { state, set, toplamKredi, videoKredi, tryonUret, videoUret };
}
