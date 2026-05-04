"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { YUKLENIYOR_MESAJLARI, PLATFORM_BILGI } from "@/lib/constants";
import { analytics } from "@/lib/analytics";
import { useUretimStore } from "@/store/uretimStore";
import { resizeFoto } from "@/lib/listing-utils";
import type { Kullanici } from "@/lib/listing-utils";

interface MetinDeps {
  fotolar: string[];
  kullanici: Kullanici | null;
  setKullanici: (fn: (k: Kullanici | null) => Kullanici | null) => void;
  loginGerekli: () => boolean;
  paketModalAc: () => void;
  setHata: (v: string | null) => void;
  gecmisiYukle: (userId: string) => void;
  invalidateCredits: () => void;
}

export function useMetinUretim(deps: MetinDeps) {
  const { setPaylasim } = useUretimStore();

  const [urunAdi, setUrunAdi] = useState("");
  const [kategori, setKategori] = useState("");
  const [ozellikler, setOzellikler] = useState("");
  const [platform, setPlatform] = useState("trendyol");
  const [dil, setDil] = useState<"tr" | "en">("tr");
  const [hedefKitle, setHedefKitle] = useState("genel");
  const [fiyatSegmenti, setFiyatSegmenti] = useState<"butce" | "orta" | "premium">("orta");
  const [markaliUrun, setMarkaliUrun] = useState(false);
  const [anahtarKelimeler, setAnahtarKelimeler] = useState("");
  const [sonuc, setSonuc] = useState("");
  const [uretimId, setUretimId] = useState<string | null>(null);
  const [yenidenUretHakki, setYenidenUretHakki] = useState(3);
  const [skor, setSkor] = useState<number | null>(null);
  const [oneriler, setOneriler] = useState<string[]>([]);
  const [ucretsizRevizeKullanildi, setUcretsizRevizeKullanildi] = useState(false);
  const [duzenleYukleniyor, setDuzenleYukleniyor] = useState(false);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [yukleniyorMesaj, setYukleniyorMesaj] = useState(0);
  const [girisTipi, setGirisTipi] = useState<"manuel" | "foto" | "barkod" | "excel">("manuel");
  const [barkod, setBarkod] = useState("");
  const [barkodYukleniyor, setBarkodYukleniyor] = useState(false);
  const [barkodBilgi, setBarkodBilgi] = useState<{ isim: string; marka: string; aciklama: string; kategori: string; renk: string; boyut: string } | null>(null);
  const [kameraAcik, setKameraAcik] = useState(false);
  const [etiketler, setEtiketler] = useState<string[]>([]);
  const [backendTerimler, setBackendTerimler] = useState("");

  const scannerRef = useRef<unknown>(null);
  const scannerBaslatildi = useRef(false);
  const sorguCalisiyor = useRef(false);
  const mesajInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const ucretsizRevizeAktifRef = useRef(false);
  const uretimIdRef = useRef<string | null>(null);

  // Keep deps in a ref so async functions always see fresh values
  const depsRef = useRef(deps);
  useEffect(() => { depsRef.current = deps; });

  useEffect(() => {
    setPaylasim({ urunAdi, kategori, platform });
  }, [urunAdi, kategori, platform, setPaylasim]);

  const platformBilgi = PLATFORM_BILGI[platform] || PLATFORM_BILGI.trendyol;
  const platformDil = platformBilgi.dil || "tr";

  const kameraKapat = useCallback(async () => {
    if (scannerRef.current && scannerBaslatildi.current) {
      try {
        const s = scannerRef.current as { stop: () => Promise<void>; clear: () => void };
        await s.stop(); s.clear();
      } catch (e) { console.log(e); }
      scannerRef.current = null;
      scannerBaslatildi.current = false;
    }
    setKameraAcik(false);
  }, []);

  const barkodSorgula = useCallback(async (kod: string) => {
    if (!kod || kod.length < 8 || sorguCalisiyor.current) return;
    sorguCalisiyor.current = true;
    setBarkodYukleniyor(true);
    setBarkodBilgi(null);
    try {
      const res = await fetch(`/api/barkod?kod=${kod}`);
      const data = await res.json();
      if (data.bulunamadi) {
        alert("Bu ürün veritabanında bulunamadı.");
        setGirisTipi("manuel");
        setBarkod("");
      } else if (data.isim) {
        setBarkodBilgi(data);
        setUrunAdi(data.isim);
        if (data.marka) setKategori(data.marka);
        if (data.aciklama) setOzellikler(data.aciklama);
        kameraKapat();
      }
    } catch { alert("Barkod sorgulanırken hata oluştu."); }
    setBarkodYukleniyor(false);
    sorguCalisiyor.current = false;
  }, [kameraKapat]);

  const kameraAc = useCallback(async () => {
    if (scannerBaslatildi.current) return;
    setKameraAcik(true);
    setTimeout(async () => {
      try {
        const { Html5Qrcode } = await import("html5-qrcode");
        const scanner = new Html5Qrcode("barkod-okuyucu");
        scannerRef.current = scanner;
        scannerBaslatildi.current = true;
        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 250, height: 150 } },
          (decodedText: string) => { setBarkod(decodedText); barkodSorgula(decodedText); },
          () => {}
        );
      } catch (e) {
        console.log(e);
        alert("Kamera açılamadı.");
        setKameraAcik(false);
        scannerBaslatildi.current = false;
      }
    }, 300);
  }, [barkodSorgula]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      kameraKapat();
      if (mesajInterval.current) clearInterval(mesajInterval.current);
    };
  }, [kameraKapat]);

  const icerikUret = useCallback(async () => {
    const { fotolar, kullanici, loginGerekli, paketModalAc, setHata, gecmisiYukle, invalidateCredits, setKullanici } = depsRef.current;
    if (!loginGerekli()) return;
    if (!kullanici) return;
    if (!kullanici.is_admin && kullanici.kredi <= 0) { paketModalAc(); return; }
    const uretButonAktif = (girisTipi === "manuel" && urunAdi && kategori) || (girisTipi === "foto" && fotolar.length > 0) || (girisTipi === "barkod" && barkodBilgi !== null);
    if (!uretButonAktif) return;
    setYukleniyor(true);
    setSonuc("");
    setYukleniyorMesaj(0);
    analytics.generationStarted({ platform, type: "metin" });
    mesajInterval.current = setInterval(() => setYukleniyorMesaj((prev) => (prev + 1) % YUKLENIYOR_MESAJLARI.length), 1800);
    try {
      const fotolarResized = fotolar.length > 0
        ? await Promise.all(fotolar.slice(0, 3).map(f => resizeFoto(f)))
        : [];
      const res = await fetch("/api/uret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          urunAdi, kategori, ozellikler, platform, fotolar: fotolarResized, girisTipi, barkodBilgi,
          userId: kullanici.id, dil: platformDil, ton: kullanici.ton,
          hedefKitle, fiyatSegmenti, anahtarKelimeler, markaliUrun,
          etiketler: etiketler.length > 0 ? etiketler : undefined,
          backendTerimler: backendTerimler || undefined,
          ucretsizRevize: ucretsizRevizeAktifRef.current,
          orijinalUretimId: ucretsizRevizeAktifRef.current ? uretimIdRef.current : undefined,
        }),
      });
      ucretsizRevizeAktifRef.current = false;
      const data = await res.json();
      if (mesajInterval.current) clearInterval(mesajInterval.current);
      if (res.status === 402) { analytics.creditExhausted(); paketModalAc(); setYukleniyor(false); return; }
      if (!res.ok) {
        analytics.generationFailed({ platform, type: "metin", error: `http_${res.status}` });
        setHata(data.hata || "İçerik üretilemedi. Lütfen tekrar deneyin.");
        setYukleniyor(false);
        return;
      }
      setSonuc(data.icerik);
      setSkor(data.skor ?? null);
      setOneriler(data.oneriler ?? []);
      const prevUretimId = uretimIdRef.current;
      setUretimId(data.uretimId ?? null);
      uretimIdRef.current = data.uretimId ?? null;
      setUcretsizRevizeKullanildi(prevUretimId === data.uretimId);
      setYenidenUretHakki(3);
      if (kullanici.is_admin) setKullanici(k => k ? { ...k, toplam_kullanilan: k.toplam_kullanilan + 1 } : k);
      else setKullanici(k => k ? { ...k, kredi: k.kredi - 1, toplam_kullanilan: k.toplam_kullanilan + 1 } : k);
      analytics.generationCompleted({ platform, type: "metin", credits_remaining: kullanici.kredi - 1 });
      invalidateCredits();
      gecmisiYukle(kullanici.id);
    } catch {
      if (mesajInterval.current) clearInterval(mesajInterval.current);
      analytics.generationFailed({ platform, type: "metin", error: "network" });
      setHata("İçerik üretilemedi. Lütfen tekrar deneyin.");
    }
    setYukleniyor(false);
    setTimeout(() => document.getElementById("sonuc-alani")?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urunAdi, kategori, ozellikler, platform, platformDil, hedefKitle, fiyatSegmenti, anahtarKelimeler, markaliUrun, girisTipi, barkodBilgi, etiketler, backendTerimler]);

  return {
    urunAdi, setUrunAdi,
    kategori, setKategori,
    ozellikler, setOzellikler,
    platform, setPlatform,
    dil, setDil,
    hedefKitle, setHedefKitle,
    fiyatSegmenti, setFiyatSegmenti,
    markaliUrun, setMarkaliUrun,
    anahtarKelimeler, setAnahtarKelimeler,
    sonuc, setSonuc,
    uretimId, setUretimId,
    yenidenUretHakki, setYenidenUretHakki,
    duzenleYukleniyor, setDuzenleYukleniyor,
    yukleniyor,
    yukleniyorMesaj,
    girisTipi, setGirisTipi,
    barkod, setBarkod,
    barkodYukleniyor,
    barkodBilgi, setBarkodBilgi,
    kameraAcik,
    kameraAc, kameraKapat,
    etiketler, setEtiketler,
    backendTerimler, setBackendTerimler,
    icerikUret,
    skor, oneriler,
    ucretsizRevizeKullanildi,
    ucretsizRevizeBaslat: () => { ucretsizRevizeAktifRef.current = true; },
  };
}
