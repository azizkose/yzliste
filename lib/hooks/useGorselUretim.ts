"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { resizeFoto } from "@/lib/listing-utils";
import type { Kullanici } from "@/lib/listing-utils";

interface GorselDeps {
  fotolar: string[];
  kullanici: Kullanici | null;
  setKullanici: (fn: (k: Kullanici | null) => Kullanici | null) => void;
  loginGerekli: () => boolean;
  paketModalAc: () => void;
  setHata: (v: string | null) => void;
  invalidateCredits: () => void;
}

export function useGorselUretim(deps: GorselDeps) {
  const [gorselEkPrompt, setGorselEkPrompt] = useState("");
  const [seciliStiller, setSeciliStiller] = useState<Set<string>>(new Set());
  const [gorselYukleniyor, setGorselYukleniyor] = useState(false);
  const [gorselJoblar, setGorselJoblar] = useState<{ requestId: string; label: string; stil: string }[]>([]);
  const [referansGorsel, setReferansGorsel] = useState<string | null>(null);

  const depsRef = useRef(deps);
  useEffect(() => { depsRef.current = deps; });

  const stilToggle = useCallback((stilId: string) => {
    setSeciliStiller(prev => {
      const next = new Set(prev);
      if (stilId === "ozel" || stilId === "referans") {
        return next.has(stilId) ? new Set() : new Set([stilId]);
      }
      next.delete("ozel");
      next.delete("referans");
      if (next.has(stilId)) next.delete(stilId);
      else next.add(stilId);
      return next;
    });
  }, []);

  const gorselUret = useCallback(async () => {
    const { fotolar, kullanici, loginGerekli, paketModalAc, setHata, invalidateCredits, setKullanici } = depsRef.current;
    if (!loginGerekli()) return;
    if (!kullanici) return;
    if (fotolar.length === 0) { alert("Önce bir ürün fotoğrafı ekleyin."); return; }
    if (seciliStiller.size === 0) { alert("En az bir stil seçin."); return; }
    const stilSayisi = seciliStiller.size;
    if (!kullanici.is_admin && kullanici.kredi < stilSayisi) { paketModalAc(); return; }
    setGorselYukleniyor(true);
    setGorselJoblar([]);
    try {
      const resized = await resizeFoto(fotolar[0]);
      const res = await fetch("/api/gorsel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ foto: resized, stiller: Array.from(seciliStiller), ekPrompt: gorselEkPrompt, userId: kullanici.id, referansGorsel }),
      });
      const data = await res.json();
      if (res.status === 402) { paketModalAc(); setGorselYukleniyor(false); return; }
      if (!data.jobs || data.jobs.length === 0) { setHata("Görsel üretilemedi. Tekrar deneyin."); setGorselYukleniyor(false); return; }
      if (!kullanici.is_admin) { setKullanici(k => k ? { ...k, kredi: Math.max(0, k.kredi - stilSayisi) } : k); invalidateCredits(); }
      let tamamlananSayisi = 0;
      const hataMesajlari: string[] = [];
      await Promise.all(
        data.jobs.map(async (job: { requestId: string; label: string; stil: string }) => {
          for (let deneme = 0; deneme < 40; deneme++) {
            await new Promise(r => setTimeout(r, 4000));
            const pollRes = await fetch(`/api/gorsel/poll?requestId=${job.requestId}`);
            const pollData = await pollRes.json();
            if (pollData.status === "COMPLETED") { tamamlananSayisi++; setGorselJoblar(prev => [...prev, job]); break; }
            if (pollData.status === "FAILED") { hataMesajlari.push(`${job.label}: ${pollData.hata || "Görsel üretilemedi"}`); break; }
          }
        })
      );
      if (tamamlananSayisi === 0) setHata(hataMesajlari.length > 0 ? hataMesajlari[0] : "Görsel üretilemedi, zaman aşımı.");
      else if (hataMesajlari.length > 0) setHata(`${hataMesajlari.length} görsel üretilemedi: ${hataMesajlari[0]}`);
    } catch { setHata("Bir hata oluştu. Lütfen tekrar deneyin."); }
    setGorselYukleniyor(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seciliStiller, gorselEkPrompt, referansGorsel]);

  return {
    gorselEkPrompt, setGorselEkPrompt,
    seciliStiller, stilToggle,
    gorselYukleniyor,
    gorselJoblar, setGorselJoblar,
    referansGorsel, setReferansGorsel,
    gorselUret,
  };
}
