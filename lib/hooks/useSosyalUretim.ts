"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { resizeFoto } from "@/lib/listing-utils";
import type { Kullanici } from "@/lib/listing-utils";

type SosyalPlatform = "instagram" | "tiktok" | "facebook" | "twitter";
type SosyalTon = "tanitim" | "indirim" | "hikaye";

interface SosyalDeps {
  urunAdi: string;
  kullanici: Kullanici | null;
  setKullanici: (fn: (k: Kullanici | null) => Kullanici | null) => void;
  loginGerekli: () => boolean;
  paketModalAc: () => void;
  setHata: (v: string | null) => void;
  invalidateCredits: () => void;
}

export function useSosyalUretim(deps: SosyalDeps) {
  const [sosyalFoto, setSosyalFoto] = useState<string | null>(null);
  const [sosyalUrunAdi, setSosyalUrunAdi] = useState("");
  const [sosyalEkBilgi, setSosyalEkBilgi] = useState("");
  const [sosyalPlatform, setSosyalPlatform] = useState<SosyalPlatform>("instagram");
  const [sosyalTon, setSosyalTon] = useState<SosyalTon>("tanitim");
  const [captionYukleniyor, setCaptionYukleniyor] = useState(false);
  const [sosyalCaption, setSosyalCaption] = useState("");
  const [sosyalHashtag, setSosyalHashtag] = useState("");
  const [sosyalUretimModu, setSosyalUretimModu] = useState<"sade" | "gorsel-ile">("sade");
  const [sosyalGorselStil, setSosyalGorselStil] = useState("beyaz");
  const [sosyalGorselFormat, setSosyalGorselFormat] = useState<"1:1" | "9:16" | "16:9">("1:1");
  const [sosyalGorselYukleniyor, setSosyalGorselYukleniyor] = useState(false);
  const [sosyalGorselSonuclar, setSosyalGorselSonuclar] = useState<{ stil: string; label: string; gorseller: string[] }[]>([]);
  const [sosyalGorselPrompt, setSosyalGorselPrompt] = useState("");
  const [sosyalSezon, setSosyalSezon] = useState("normal");
  const [sosyalKitYukleniyor, setSosyalKitYukleniyor] = useState(false);
  const [sosyalKitSonuc, setSosyalKitSonuc] = useState<Record<string, { caption: string; hashtag: string }> | null>(null);
  const [sosyalKitAcik, setSosyalKitAcik] = useState<string | null>(null);

  const depsRef = useRef(deps);
  useEffect(() => { depsRef.current = deps; });

  // Sync urunAdi from metin tab → sosyal tab
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (deps.urunAdi) setSosyalUrunAdi(deps.urunAdi);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deps.urunAdi]);

  const captionUret = useCallback(async () => {
    const { kullanici, loginGerekli, paketModalAc, setHata, invalidateCredits, setKullanici } = depsRef.current;
    if (!loginGerekli()) return;
    if (!kullanici) return;
    if (!sosyalUrunAdi.trim()) return;
    if (!kullanici.is_admin && kullanici.kredi <= 0) { paketModalAc(); return; }
    setCaptionYukleniyor(true);
    setSosyalCaption("");
    setSosyalHashtag("");
    try {
      const res = await fetch("/api/sosyal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urunAdi: sosyalUrunAdi, ekBilgi: sosyalEkBilgi, platform: sosyalPlatform, ton: sosyalTon, sezon: sosyalSezon, userId: kullanici.id }),
      });
      const data = await res.json();
      if (data.caption) setSosyalCaption(data.caption);
      if (data.hashtag) setSosyalHashtag(data.hashtag);
      if (!kullanici.is_admin) { setKullanici(k => k ? { ...k, kredi: k.kredi - 1 } : k); invalidateCredits(); }
    } catch { setHata("Paylaşım metni üretilemedi. Tekrar deneyin."); }
    setCaptionYukleniyor(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sosyalUrunAdi, sosyalEkBilgi, sosyalPlatform, sosyalTon, sosyalSezon]);

  const kitUret = useCallback(async () => {
    const { kullanici, loginGerekli, paketModalAc, setHata, invalidateCredits, setKullanici } = depsRef.current;
    if (!loginGerekli()) return;
    if (!kullanici) return;
    if (!sosyalUrunAdi.trim()) return;
    const krediGereken = 4;
    if (!kullanici.is_admin && kullanici.kredi < krediGereken) { paketModalAc(); return; }
    setSosyalKitYukleniyor(true);
    setSosyalKitSonuc(null);
    setSosyalKitAcik(null);
    try {
      const res = await fetch("/api/sosyal/kit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urunAdi: sosyalUrunAdi, ekBilgi: sosyalEkBilgi, ton: sosyalTon, sezon: sosyalSezon, userId: kullanici.id }),
      });
      const data = await res.json();
      if (res.status === 402) { paketModalAc(); setSosyalKitYukleniyor(false); return; }
      if (data.captions) {
        setSosyalKitSonuc(data.captions);
        setSosyalKitAcik("instagram_tiktok");
        if (!kullanici.is_admin) { setKullanici(k => k ? { ...k, kredi: k.kredi - (data.kullanilanKredi ?? krediGereken) } : k); invalidateCredits(); }
      }
    } catch { setHata("Kit üretilemedi. Tekrar deneyin."); }
    setSosyalKitYukleniyor(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sosyalUrunAdi, sosyalEkBilgi, sosyalTon, sosyalSezon]);

  const sosyalGorselUret = useCallback(async () => {
    const { kullanici, loginGerekli, paketModalAc, setHata, invalidateCredits, setKullanici } = depsRef.current;
    if (!loginGerekli()) return;
    if (!kullanici) return;
    if (!sosyalFoto) { alert("Önce ürün fotoğrafı yükle."); return; }
    if (!kullanici.is_admin && kullanici.kredi <= 0) { paketModalAc(); return; }
    setSosyalGorselYukleniyor(true);
    setSosyalGorselSonuclar([]);
    try {
      const resized = await resizeFoto(sosyalFoto);
      const res = await fetch("/api/gorsel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ foto: resized, stil: sosyalGorselStil, ekPrompt: sosyalGorselPrompt, sosyalFormat: sosyalGorselFormat, userId: kullanici.id }),
      });
      const data = await res.json();
      if (res.status === 402) { paketModalAc(); setSosyalGorselYukleniyor(false); return; }
      if (!data.requestId) { setHata("Görsel üretilemedi. Tekrar deneyin."); setSosyalGorselYukleniyor(false); return; }
      let tamamlandi = false;
      for (let deneme = 0; deneme < 40; deneme++) {
        await new Promise(r => setTimeout(r, 4000));
        const pollRes = await fetch(`/api/gorsel/poll?requestId=${data.requestId}`);
        const pollData = await pollRes.json();
        if (pollData.status === "COMPLETED") {
          const proxyGorseller = [0, 1, 2, 3].map((i) => `/api/gorsel/img?requestId=${data.requestId}&index=${i}`);
          setSosyalGorselSonuclar([{ stil: sosyalGorselStil, label: data.label, gorseller: proxyGorseller }]);
          tamamlandi = true;
          break;
        }
        if (pollData.status === "FAILED") { setHata(pollData.hata || "Görsel üretilemedi. Tekrar deneyin."); tamamlandi = true; break; }
      }
      if (!tamamlandi) setHata("Görsel üretilemedi, zaman aşımı. Tekrar deneyin.");
    } catch { setHata("Bir hata oluştu. Lütfen tekrar deneyin."); }
    setSosyalGorselYukleniyor(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sosyalFoto, sosyalGorselStil, sosyalGorselPrompt, sosyalGorselFormat]);

  return {
    sosyalFoto, setSosyalFoto,
    sosyalUrunAdi, setSosyalUrunAdi,
    sosyalEkBilgi, setSosyalEkBilgi,
    sosyalPlatform, setSosyalPlatform,
    sosyalTon, setSosyalTon,
    captionYukleniyor,
    sosyalCaption, setSosyalCaption,
    sosyalHashtag, setSosyalHashtag,
    sosyalUretimModu, setSosyalUretimModu,
    sosyalGorselStil, setSosyalGorselStil,
    sosyalGorselFormat, setSosyalGorselFormat,
    sosyalGorselYukleniyor,
    sosyalGorselSonuclar, setSosyalGorselSonuclar,
    sosyalGorselPrompt, setSosyalGorselPrompt,
    sosyalSezon, setSosyalSezon,
    sosyalKitYukleniyor,
    sosyalKitSonuc, setSosyalKitSonuc,
    sosyalKitAcik, setSosyalKitAcik,
    captionUret, kitUret, sosyalGorselUret,
  };
}
