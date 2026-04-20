"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { resizeFoto } from "@/lib/listing-utils";
import type { Kullanici } from "@/lib/listing-utils";

interface VideoDeps {
  fotolar: string[];
  kullanici: Kullanici | null;
  setKullanici: (fn: (k: Kullanici | null) => Kullanici | null) => void;
  loginGerekli: () => boolean;
  paketModalAc: () => void;
  setHata: (v: string | null) => void;
  invalidateCredits: () => void;
}

export function useVideoUretim(deps: VideoDeps) {
  const [videoPrompt, setVideoPrompt] = useState("");
  const [videoPromptGoster, setVideoPromptGoster] = useState("");
  const [videoSure, setVideoSure] = useState<"5" | "10">("5");
  const [videoFormat, setVideoFormat] = useState<"9:16" | "16:9" | "1:1">("9:16");
  const [videoYukleniyor, setVideoYukleniyor] = useState(false);
  const [videoRequestId, setVideoRequestId] = useState<string | null>(null);

  const depsRef = useRef(deps);
  useEffect(() => { depsRef.current = deps; });

  const videoUret = useCallback(async () => {
    const { fotolar, kullanici, loginGerekli, paketModalAc, setHata, invalidateCredits, setKullanici } = depsRef.current;
    if (!loginGerekli()) return;
    if (!fotolar[0]) { alert("Önce bir ürün fotoğrafı ekleyin."); return; }
    if (!kullanici) return;
    const videoKredi = videoSure === "10" ? 20 : 10;
    if (!kullanici.is_admin && kullanici.kredi < videoKredi) { paketModalAc(); return; }
    setVideoYukleniyor(true);
    setVideoRequestId(null);
    try {
      const resized = await resizeFoto(fotolar[0]);
      const res = await fetch("/api/sosyal/video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ foto: resized, prompt: videoPrompt, userId: kullanici.id, sure: videoSure, format: videoFormat }),
      });
      const data = await res.json();
      if (res.status === 402) { paketModalAc(); setVideoYukleniyor(false); return; }
      if (!data.requestId) { setHata("Video üretilemedi. Tekrar deneyin."); setVideoYukleniyor(false); return; }
      if (!kullanici.is_admin) { setKullanici(k => k ? { ...k, kredi: k.kredi - (data.kullanilanKredi ?? videoKredi) } : k); invalidateCredits(); }
      let tamamlandi = false;
      for (let deneme = 0; deneme < 60; deneme++) {
        await new Promise(r => setTimeout(r, 5000));
        const pollRes = await fetch(`/api/sosyal/video/poll?requestId=${data.requestId}`);
        const pollData = await pollRes.json();
        if (pollData.status === "COMPLETED") { setVideoRequestId(data.requestId); tamamlandi = true; break; }
      }
      if (!tamamlandi) setHata("Video üretilemedi, zaman aşımı. Tekrar deneyin.");
    } catch { setHata("Bir hata oluştu. Lütfen tekrar deneyin."); }
    setVideoYukleniyor(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoPrompt, videoSure, videoFormat]);

  return {
    videoPrompt, setVideoPrompt,
    videoPromptGoster, setVideoPromptGoster,
    videoSure, setVideoSure,
    videoFormat, setVideoFormat,
    videoYukleniyor,
    videoRequestId, setVideoRequestId,
    videoUret,
  };
}
