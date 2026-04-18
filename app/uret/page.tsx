"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { useCredits, useInvalidateCredits } from "@/lib/hooks/useCredits";
import { analytics } from "@/lib/analytics";
import { useUretimStore } from "@/store/uretimStore";
import AuthForm from "@/components/auth/AuthForm";
import { PLATFORM_BILGI, PLATFORM_PLACEHOLDER, YUKLENIYOR_MESAJLARI, GORSEL_STILLER, VIDEO_PRESETLER, kategoriKoduHesapla } from "@/lib/constants";
import { sonucuBolumle, docxIndir } from "@/lib/listing-utils";
import KopyalaButon from "@/components/ui/KopyalaButon";
import FotoThumbnail from "@/components/ui/FotoThumbnail";
import FotoEkleAlani from "@/components/ui/FotoEkleAlani";
import PaketModal from "@/components/PaketModal";
import ChatWidget from "@/components/ChatWidget";
import MetinSekmesi from "@/components/tabs/MetinSekmesi";
import GorselSekmesi from "@/components/tabs/GorselSekmesi";
import VideoSekmesi from "@/components/tabs/VideoSekmesi";
import SosyalSekmesi from "@/components/tabs/SosyalSekmesi";

type AnaSekme = "metin" | "gorsel" | "video" | "sosyal";
type SosyalPlatform = "instagram" | "tiktok" | "facebook" | "twitter";
type SosyalTon = "tanitim" | "indirim" | "hikaye";

type Uretim = {
  id: string;
  urun_adi: string;
  platform: string;
  giris_tipi: string;
  sonuc: string;
  created_at: string;
};

type Kullanici = {
  id: string;
  email: string | null;
  kredi: number;
  toplam_kullanilan: number;
  is_admin: boolean;
  anonim?: boolean;
  ton?: string;
  marka_adi?: string;
};


export default function Home() {
  const router = useRouter();
  const invalidateCredits = useInvalidateCredits();
  const { data: kredilerHook } = useCredits();
  const { setPaylasim } = useUretimStore();

  // Sekme
  const [anaSekme, setAnaSekme] = useState<AnaSekme>("metin");

  // Kullanıcı
  const [kullanici, setKullanici] = useState<Kullanici | null>(null);
  const [authYukleniyor, setAuthYukleniyor] = useState(true);
  const [gecmis, setGecmis] = useState<Uretim[]>([]);
  const [seciliUretim, setSeciliUretim] = useState<Uretim | null>(null);
  const [gecmisAcik, setGecmisAcik] = useState(false);
  const [gecmisPlatformFiltre, setGecmisPlatformFiltre] = useState("");
  const [paketModalAcik, setPaketModalAcik] = useState(false);
  const [hata, setHata] = useState<string | null>(null);
  const [profilBannerKapatildi, setProfilBannerKapatildi] = useState(false);

  // Auth popup
  const [authPopupAcik, setAuthPopupAcik] = useState(false);
  const [authPopupMod, setAuthPopupMod] = useState<"giris" | "kayit">("kayit");
  const [authSonraAksiyon, setAuthSonraAksiyon] = useState<"paket" | null>(null);

  // Metin sekmesi
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
  const [duzenleYukleniyor, setDuzenleYukleniyor] = useState(false);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [yukleniyorMesaj, setYukleniyorMesaj] = useState(0);
  const [fotolar, setFotolar] = useState<string[]>([]);
  const [girisTipi, setGirisTipi] = useState<"manuel" | "foto" | "barkod">("manuel");
  const [barkod, setBarkod] = useState("");
  const [barkodYukleniyor, setBarkodYukleniyor] = useState(false);
  const [barkodBilgi, setBarkodBilgi] = useState<{ isim: string; marka: string; aciklama: string; kategori: string; renk: string; boyut: string } | null>(null);
  const [kameraAcik, setKameraAcik] = useState(false);

  // Görsel sekmesi
  const [gorselEkPrompt, setGorselEkPrompt] = useState("");
  const [seciliStiller, setSeciliStiller] = useState<Set<string>>(new Set());
  const [gorselYukleniyor, setGorselYukleniyor] = useState(false);
  const [gorselJoblar, setGorselJoblar] = useState<{ requestId: string; label: string; stil: string }[]>([]);
  const [referansGorsel, setReferansGorsel] = useState<string | null>(null);

  // Video sekmesi
  // videoFoto kaldırıldı — tüm sekmeler fotolar[0] paylaşır
  const [videoPrompt, setVideoPrompt] = useState("");
  const [videoPromptGoster, setVideoPromptGoster] = useState("");
  const [videoSure, setVideoSure] = useState<"5" | "10">("5");
  const [videoFormat, setVideoFormat] = useState<"9:16" | "16:9" | "1:1">("9:16");
  const [videoYukleniyor, setVideoYukleniyor] = useState(false);
  const [videoRequestId, setVideoRequestId] = useState<string | null>(null);

  // Sosyal sekmesi
  const [sosyalFoto, setSosyalFoto] = useState<string | null>(null);
  const [sosyalUrunAdi, setSosyalUrunAdi] = useState("");
  const [sosyalEkBilgi, setSosyalEkBilgi] = useState("");
  const [sosyalPlatform, setSosyalPlatform] = useState<SosyalPlatform>("instagram");
  const [sosyalTon, setSosyalTon] = useState<SosyalTon>("tanitim");
  const [captionYukleniyor, setCaptionYukleniyor] = useState(false);
  const [sosyalCaption, setSosyalCaption] = useState("");
  const [sosyalHashtag, setSosyalHashtag] = useState("");
  // Sosyal — görsel üretimi
  const [sosyalIcerikTipi, setSosyalIcerikTipi] = useState<"metin" | "gorsel">("metin");
  const [sosyalGorselStil, setSosyalGorselStil] = useState("beyaz");
  const [sosyalGorselFormat, setSosyalGorselFormat] = useState<"1:1" | "9:16" | "16:9">("1:1");
  const [sosyalGorselYukleniyor, setSosyalGorselYukleniyor] = useState(false);
  const [sosyalGorselSonuclar, setSosyalGorselSonuclar] = useState<{ stil: string; label: string; gorseller: string[] }[]>([]);
  const [sosyalGorselPrompt, setSosyalGorselPrompt] = useState("");
  const [sosyalSezon, setSosyalSezon] = useState("normal");
  // Sosyal medya kiti (4 platform birden)
  const [sosyalKitYukleniyor, setSosyalKitYukleniyor] = useState(false);
  const [sosyalKitSonuc, setSosyalKitSonuc] = useState<Record<string, { caption: string; hashtag: string }> | null>(null);
  const [sosyalKitAcik, setSosyalKitAcik] = useState<string | null>(null);

  // Refs
  const scannerRef = useRef<unknown>(null);
  const scannerBaslatildi = useRef(false);
  const sorguCalisiyor = useRef(false);
  const mesajInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  // Metin sekmesindeki değerleri store'a senkronize et
  useEffect(() => {
    setPaylasim({ urunAdi, kategori, platform });
  }, [urunAdi, kategori, platform, setPaylasim]);

  // Sosyal sekmesine geçince sosyalUrunAdi otomatik doldur
  useEffect(() => {
    if (anaSekme === "sosyal" && !sosyalUrunAdi && urunAdi) {
      setSosyalUrunAdi(urunAdi);
    }
  }, [anaSekme]); // eslint-disable-line react-hooks/exhaustive-deps

  const platformBilgi = PLATFORM_BILGI[platform] || PLATFORM_BILGI.trendyol;
  const platformPh = PLATFORM_PLACEHOLDER[platform] || PLATFORM_PLACEHOLDER.trendyol;
  const platformDil = platformBilgi.dil || "tr";
  const krediDusuk = kullanici && !kullanici.is_admin && (kredilerHook ?? kullanici.kredi) <= 2;
  const sonucBolumleri = sonucuBolumle(sonuc);
  const platformRenk: Record<string, string> = { trendyol: "bg-orange-100 text-orange-700", hepsiburada: "bg-orange-100 text-orange-600", amazon: "bg-yellow-100 text-yellow-700", n11: "bg-blue-100 text-blue-700" };


  const handleAuthSuccess = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const [{ data: profil }, { count }] = await Promise.all([
      supabase.from("profiles").select("email, kredi, is_admin, ton, marka_adi").eq("id", user.id).single(),
      supabase.from("uretimler").select("*", { count: "exact", head: true }).eq("user_id", user.id),
    ]);
    if (profil) setKullanici({ id: user.id, email: profil.email ?? null, kredi: profil.kredi, toplam_kullanilan: count || 0, is_admin: profil.is_admin || false, anonim: false, ton: profil.ton ?? undefined, marka_adi: profil.marka_adi ?? undefined });
    gecmisiYukle(user.id);
    setAuthPopupAcik(false);
    if (authSonraAksiyon === "paket") {
      setAuthSonraAksiyon(null);
      setPaketModalAcik(true);
    }
  }, [authSonraAksiyon]);

  const paketModalAc = () => {
    if (!kullanici) {
      setAuthSonraAksiyon("paket");
      setAuthPopupMod("kayit");
      setAuthPopupAcik(true);
      return;
    }
    if (kullanici.anonim) {
      setAuthSonraAksiyon("paket");
      setAuthPopupMod("kayit");
      setAuthPopupAcik(true);
      return;
    }
    setPaketModalAcik(true);
  };

  const kullaniciyiKontrolEt = async () => {
    const params = new URLSearchParams(window.location.search);
    const paketParam = params.get("paket") === "ac";
    const odemeParam = params.get("odeme");
    if (paketParam || odemeParam) window.history.replaceState({}, "", "/");

    const { data: { user } } = await supabase.auth.getUser();

    if (odemeParam === "hata") setHata("Ödeme tamamlanamadı. Tekrar deneyin.");

    if (!user) {
      // Login olmadan sayfa göster — üret butonlarında kontrol yapılır
      if (paketParam) {
        setAuthSonraAksiyon("paket");
        setAuthPopupMod("kayit");
        setAuthPopupAcik(true);
      }
      setAuthYukleniyor(false);
      return;
    }

    const anonim = user.is_anonymous ?? false;
    const { data: profil } = await supabase.from("profiles").select("email, kredi, is_admin, ton, marka_adi").eq("id", user.id).single();
    const { count } = await supabase.from("uretimler").select("*", { count: "exact", head: true }).eq("user_id", user.id);
    if (profil) {
      setKullanici({ id: user.id, email: profil.email ?? null, kredi: profil.kredi, toplam_kullanilan: count || 0, is_admin: profil.is_admin || false, anonim, ton: profil.ton ?? undefined, marka_adi: profil.marka_adi ?? undefined });
      if (!anonim) analytics.identify(user.id, { email: profil.email ?? '', total_generations: count || 0 });
    } else if (anonim) {
      await supabase.from("profiles").insert({ id: user.id, kredi: 3 });
      setKullanici({ id: user.id, email: null, kredi: 3, toplam_kullanilan: 0, is_admin: false, anonim: true });
    }
    gecmisiYukle(user.id);

    if (paketParam) {
      if (anonim) {
        setAuthSonraAksiyon("paket");
        setAuthPopupMod("kayit");
        setAuthPopupAcik(true);
      } else {
        setPaketModalAcik(true);
      }
    }
    setAuthYukleniyor(false);
  };

  // Blob'u tarayıcıda indir — tekrarlanan createObjectURL pattern'ini ortadan kaldırır
  const blobIndir = (blob: Blob, dosyaAdi: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = dosyaAdi; a.click();
    URL.revokeObjectURL(url);
  };

  // Üretim butonları için login kontrolü — giriş yoksa veya anonim ise popup aç
  const loginGerekli = (): boolean => {
    if (!kullanici || kullanici.anonim) {
      setAuthPopupMod("kayit");
      setAuthPopupAcik(true);
      return false;
    }
    return true;
  };

  useEffect(() => {
    kullaniciyiKontrolEt();
    return () => { kameraKapat(); if (mesajInterval.current) clearInterval(mesajInterval.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // PQ-15: Listing sekmesindeki ürün adını sosyal sekmeye senkronla
  useEffect(() => {
    if (urunAdi) setSosyalUrunAdi(urunAdi);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urunAdi]);

  const gecmisiYukle = async (userId: string) => {
    const { data } = await supabase.from("uretimler").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(10);
    if (data) setGecmis(data);
  };

  const cikisYap = async () => { analytics.reset(); await supabase.auth.signOut(); router.push("/"); };

  const fotoSec = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dosyalar = Array.from(e.target.files || []);
    dosyalar.slice(0, 3 - fotolar.length).forEach((dosya) => {
      const reader = new FileReader();
      reader.onload = () => setFotolar((prev) => (prev.length >= 3 ? prev : [...prev, reader.result as string]));
      reader.readAsDataURL(dosya);
    });
    e.target.value = "";
  };

  const fotoKaldir = (index: number) => { setFotolar((prev) => prev.filter((_, i) => i !== index)); setGorselJoblar([]); };

  // Fotoğraf boyutlandır — API'ye göndermeden önce
  const resizeFoto = (base64: string, maxSize = 1024): Promise<string> =>
    new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let w = img.width, h = img.height;
        if (w > maxSize || h > maxSize) { if (w > h) { h = Math.round(h * maxSize / w); w = maxSize; } else { w = Math.round(w * maxSize / h); h = maxSize; } }
        canvas.width = w; canvas.height = h;
        canvas.getContext("2d")?.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.src = base64;
    });

  // Tek fotoğraf seç — görsel/video/sosyal sekmeleri için (mevcut fotoğrafın üzerine yazar)
  const tekFotoSec = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dosya = e.target.files?.[0];
    if (!dosya) return;
    const reader = new FileReader();
    reader.onload = () => { setFotolar([reader.result as string]); setGorselJoblar([]); };
    reader.readAsDataURL(dosya);
    e.target.value = "";
  };

  const barkodSorgula = async (kod: string) => {
    if (!kod || kod.length < 8 || sorguCalisiyor.current) return;
    sorguCalisiyor.current = true;
    setBarkodYukleniyor(true);
    setBarkodBilgi(null);
    try {
      const res = await fetch(`/api/barkod?kod=${kod}`);
      const data = await res.json();
      if (data.bulunamadi) { alert("Bu ürün veritabanında bulunamadı."); setGirisTipi("manuel"); setBarkod(""); }
      else if (data.isim) { setBarkodBilgi(data); setUrunAdi(data.isim); if (data.marka) setKategori(data.marka); if (data.aciklama) setOzellikler(data.aciklama); kameraKapat(); }
    } catch { alert("Barkod sorgulanırken hata oluştu."); }
    setBarkodYukleniyor(false);
    sorguCalisiyor.current = false;
  };

  const kameraAc = async () => {
    if (scannerBaslatildi.current) return;
    setKameraAcik(true);
    setTimeout(async () => {
      try {
        const { Html5Qrcode } = await import("html5-qrcode");
        const scanner = new Html5Qrcode("barkod-okuyucu");
        scannerRef.current = scanner;
        scannerBaslatildi.current = true;
        await scanner.start({ facingMode: "environment" }, { fps: 10, qrbox: { width: 250, height: 150 } },
          (decodedText: string) => { setBarkod(decodedText); barkodSorgula(decodedText); }, () => {});
      } catch (e) { console.log(e); alert("Kamera açılamadı."); setKameraAcik(false); scannerBaslatildi.current = false; }
    }, 300);
  };

  const kameraKapat = async () => {
    if (scannerRef.current && scannerBaslatildi.current) {
      try { const s = scannerRef.current as { stop: () => Promise<void>; clear: () => void }; await s.stop(); s.clear(); } catch (e) { console.log(e); }
      scannerRef.current = null;
      scannerBaslatildi.current = false;
    }
    setKameraAcik(false);
  };

  const uretButonAktif = !yukleniyor && ((girisTipi === "manuel" && urunAdi && kategori) || (girisTipi === "foto" && fotolar.length > 0) || (girisTipi === "barkod" && barkodBilgi !== null));

  const icerikUret = async () => {
    if (!loginGerekli()) return;
    if (!kullanici) return;
    if (!kullanici.is_admin && kullanici.kredi <= 0) { paketModalAc(); return; }
    if (!uretButonAktif) return;
    setYukleniyor(true);
    setSonuc("");
    setYukleniyorMesaj(0);
    analytics.generationStarted({ platform, type: 'metin' });
    mesajInterval.current = setInterval(() => setYukleniyorMesaj((prev) => (prev + 1) % YUKLENIYOR_MESAJLARI.length), 1800);
    try {
      const res = await fetch("/api/uret", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ urunAdi, kategori, ozellikler, platform, fotolar, girisTipi, barkodBilgi, userId: kullanici.id, dil: platformDil, ton: kullanici.ton, hedefKitle, fiyatSegmenti, anahtarKelimeler, markaliUrun }) });
      const data = await res.json();
      if (mesajInterval.current) clearInterval(mesajInterval.current);
      if (res.status === 402) { analytics.creditExhausted(); paketModalAc(); setYukleniyor(false); return; }
      setSonuc(data.icerik);
      setUretimId(data.uretimId ?? null);
      setYenidenUretHakki(3);
      if (kullanici.is_admin) setKullanici({ ...kullanici, toplam_kullanilan: kullanici.toplam_kullanilan + 1 });
      else setKullanici({ ...kullanici, kredi: kullanici.kredi - 1, toplam_kullanilan: kullanici.toplam_kullanilan + 1 });
      analytics.generationCompleted({ platform, type: 'metin', credits_remaining: kullanici.kredi - 1 });
      invalidateCredits();
      gecmisiYukle(kullanici.id);
    } catch { if (mesajInterval.current) clearInterval(mesajInterval.current); analytics.generationFailed({ platform, type: 'metin', error: 'network' }); setHata("İçerik üretilemedi. Lütfen tekrar deneyin."); }
    setYukleniyor(false);
    setTimeout(() => document.getElementById("sonuc-alani")?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  };

  const stilToggle = (stilId: string) => {
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
  };

  const gorselUret = async () => {
    if (!loginGerekli()) return;
    if (!kullanici) return;
    if (fotolar.length === 0) { alert("Önce bir ürün fotoğrafı ekleyin."); return; }
    if (seciliStiller.size === 0) { alert("En az bir stil seçin."); return; }
    const stilSayisi = seciliStiller.size;
    if (!kullanici.is_admin && kullanici.kredi < stilSayisi) { paketModalAc(); return; }
    setGorselYukleniyor(true);
    setGorselJoblar([]);
    try {
      const resizedFoto = await resizeFoto(fotolar[0]);
      const res = await fetch("/api/gorsel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          foto: resizedFoto,
          stiller: Array.from(seciliStiller),
          ekPrompt: gorselEkPrompt,
          userId: kullanici?.id,
          referansGorsel,
        }),
      });
      const data = await res.json();
      if (res.status === 402) { paketModalAc(); setGorselYukleniyor(false); return; }
      if (!data.jobs || data.jobs.length === 0) {
        setHata("Görsel üretilemedi. Tekrar deneyin.");
        setGorselYukleniyor(false);
        return;
      }

      if (!kullanici.is_admin) {
        setKullanici(k => k ? { ...k, kredi: Math.max(0, k.kredi - stilSayisi) } : k);
        invalidateCredits();
      }

      // Her iş için paralel poll — tamamlananlar anında gösterilir
      let tamamlananSayisi = 0;
      const hataMesajlari: string[] = [];
      await Promise.all(
        data.jobs.map(async (job: { requestId: string; label: string; stil: string }) => {
          for (let deneme = 0; deneme < 40; deneme++) {
            await new Promise(r => setTimeout(r, 4000));
            const pollRes = await fetch(`/api/gorsel/poll?requestId=${job.requestId}`);
            const pollData = await pollRes.json();
            if (pollData.status === "COMPLETED") {
              tamamlananSayisi++;
              setGorselJoblar(prev => [...prev, job]);
              break;
            }
            if (pollData.status === "FAILED") {
              const hataAciklama = pollData.hata || "Görsel üretilemedi";
              hataMesajlari.push(`${job.label}: ${hataAciklama}`);
              break;
            }
          }
        })
      );

      if (tamamlananSayisi === 0) {
        setHata(hataMesajlari.length > 0 ? hataMesajlari[0] : "Görsel üretilemedi, zaman aşımı.");
      } else if (hataMesajlari.length > 0) {
        setHata(`${hataMesajlari.length} görsel üretilemedi: ${hataMesajlari[0]}`);
      }
    } catch { setHata("Bir hata oluştu. Lütfen tekrar deneyin."); }
    setGorselYukleniyor(false);
  };

  const videoUret = async () => {
    if (!loginGerekli()) return;
    if (!fotolar[0]) { alert("Önce bir ürün fotoğrafı ekleyin."); return; }
    if (!kullanici) return;
    const videoKredi = videoSure === "10" ? 8 : 5;
    if (!kullanici.is_admin && kullanici.kredi < videoKredi) { paketModalAc(); return; }
    setVideoYukleniyor(true);
    setVideoRequestId(null);
    try {
      const resizedFoto = await resizeFoto(fotolar[0]);
      const res = await fetch("/api/sosyal/video", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ foto: resizedFoto, prompt: videoPrompt, userId: kullanici.id, sure: videoSure, format: videoFormat }) });
      const data = await res.json();
      if (res.status === 402) { paketModalAc(); setVideoYukleniyor(false); return; }
      if (!data.requestId) { setHata("Video üretilemedi. Tekrar deneyin."); setVideoYukleniyor(false); return; }

      // Kredi düşürüldü, kuyruğa alındı — poll et
      if (!kullanici.is_admin) { setKullanici({ ...kullanici, kredi: kullanici.kredi - (data.kullanilanKredi ?? videoKredi) }); invalidateCredits(); }

      let tamamlandi = false;
      for (let deneme = 0; deneme < 60; deneme++) {
        await new Promise(r => setTimeout(r, 5000));
        const pollRes = await fetch(`/api/sosyal/video/poll?requestId=${data.requestId}`);
        const pollData = await pollRes.json();
        if (pollData.status === "COMPLETED") {
          setVideoRequestId(data.requestId);
          tamamlandi = true;
          break;
        }
      }
      if (!tamamlandi) setHata("Video üretilemedi, zaman aşımı. Tekrar deneyin.");
    } catch { setHata("Bir hata oluştu. Lütfen tekrar deneyin."); }
    setVideoYukleniyor(false);
  };

  const captionUret = async () => {
    if (!loginGerekli()) return;
    if (!kullanici) return;
    if (!sosyalUrunAdi.trim()) return;
    if (!kullanici.is_admin && kullanici.kredi <= 0) { paketModalAc(); return; }
    setCaptionYukleniyor(true);
    setSosyalCaption("");
    setSosyalHashtag("");
    try {
      const res = await fetch("/api/sosyal", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ urunAdi: sosyalUrunAdi, ekBilgi: sosyalEkBilgi, platform: sosyalPlatform, ton: sosyalTon, sezon: sosyalSezon, userId: kullanici.id }) });
      const data = await res.json();
      if (data.caption) setSosyalCaption(data.caption);
      if (data.hashtag) setSosyalHashtag(data.hashtag);
      if (!kullanici.is_admin) { setKullanici({ ...kullanici, kredi: kullanici.kredi - 1 }); invalidateCredits(); }
    } catch { setHata("Paylaşım metni üretilemedi. Tekrar deneyin."); }
    setCaptionYukleniyor(false);
  };

  const kitUret = async () => {
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
        if (!kullanici.is_admin) { setKullanici({ ...kullanici, kredi: kullanici.kredi - (data.kullanilanKredi ?? krediGereken) }); invalidateCredits(); }
      }
    } catch { setHata("Kit üretilemedi. Tekrar deneyin."); }
    setSosyalKitYukleniyor(false);
  };

  const sosyalGorselUret = async () => {
    if (!kullanici || kullanici.anonim) { setAuthPopupMod("kayit"); setAuthPopupAcik(true); return; }
    if (!sosyalFoto) { alert("Önce ürün fotoğrafı yükle."); return; }
    if (!kullanici.is_admin && kullanici.kredi <= 0) { paketModalAc(); return; }
    setSosyalGorselYukleniyor(true);
    setSosyalGorselSonuclar([]);
    try {
      const resizedFoto = await resizeFoto(sosyalFoto);
      const res = await fetch("/api/gorsel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ foto: resizedFoto, stil: sosyalGorselStil, ekPrompt: sosyalGorselPrompt, sosyalFormat: sosyalGorselFormat, userId: kullanici.id }),
      });
      const data = await res.json();
      if (res.status === 402) { paketModalAc(); setSosyalGorselYukleniyor(false); return; }
      if (!data.requestId) { setHata("Görsel üretilemedi. Tekrar deneyin."); setSosyalGorselYukleniyor(false); return; }

      // Poll et — COMPLETED olunca proxy URL'lerle göster
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
        if (pollData.status === "FAILED") {
          setHata(pollData.hata || "Görsel üretilemedi. Tekrar deneyin.");
          tamamlandi = true;
          break;
        }
      }
      if (!tamamlandi) setHata("Görsel üretilemedi, zaman aşımı. Tekrar deneyin.");
    } catch { setHata("Bir hata oluştu. Lütfen tekrar deneyin."); }
    setSosyalGorselYukleniyor(false);
  };

  return (
    <>
      <SiteHeader aktifSayfa="icerik" />
      <main className="min-h-screen bg-gray-50 pb-24 px-4">
      <div className="max-w-5xl mx-auto pt-6">

        {/* Compact hero — sadece giriş yapılmamışsa (authYukleniyor bitince göster) */}
        {!authYukleniyor && (!kullanici || kullanici.anonim) && (
          <div className="bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 rounded-2xl px-6 py-7 mb-5 text-center">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">7 Pazaryeri için AI İçerik Üreticisi</h1>
            <p className="text-sm text-gray-500 mb-1">Trendyol, Hepsiburada, Amazon, Etsy ve daha fazlası için — başlık, açıklama, görsel ve video tek platformda.</p>
            <p className="text-xs text-indigo-500 mb-5">İçerik üretmek için ücretsiz hesap gerekli — 3 kredi hediye, kredi kartı yok.</p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <button onClick={() => { setAuthPopupMod("kayit"); setAuthPopupAcik(true); }} className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors">
                Ücretsiz Hesap Oluştur — 3 Kredi Hediye
              </button>
              <button onClick={() => { setAuthPopupMod("giris"); setAuthPopupAcik(true); }} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors">
                Giriş yap →
              </button>
            </div>
          </div>
        )}

        {/* Profil eksik banner */}
        {kullanici && !kullanici.anonim && !kullanici.marka_adi && !profilBannerKapatildi && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xl flex-shrink-0">💡</span>
              <div>
                <p className="text-sm font-semibold text-blue-800">Marka profilinizi doldurun</p>
                <p className="text-xs text-blue-600 mt-0.5">Marka adı, hedef kitle ve ton bilgileri girilince AI metinleri ve görseller çok daha kaliteli sonuç verir.</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <a href="/profil" className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-xl whitespace-nowrap transition-colors">Profili Düzenle</a>
              <button onClick={() => setProfilBannerKapatildi(true)} aria-label="Bildirimi kapat" className="text-blue-400 hover:text-blue-600 text-xl leading-none">×</button>
            </div>
          </div>
        )}

        {/* Kredi düşük banner */}
        {krediDusuk && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xl">⚠️</span>
              <div>
                <p className="text-sm font-semibold text-amber-800">İçerik üretim krediniz azalıyor</p>
                <p className="text-xs text-amber-600 mt-0.5">{kredilerHook ?? kullanici?.kredi} kredi kaldı — tükenince içerik üretemezsiniz.</p>
              </div>
            </div>
            <button onClick={() => paketModalAc()} className="bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-semibold px-4 py-2 rounded-xl whitespace-nowrap flex-shrink-0">Kredi Yükle</button>
          </div>
        )}

        {/* Hata banner */}
        {hata && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xl flex-shrink-0">⚠️</span>
              <p className="text-sm text-red-700">{hata}</p>
            </div>
            <button onClick={() => setHata(null)} aria-label="Hatayı kapat" className="text-red-400 hover:text-red-600 text-xl flex-shrink-0">×</button>
          </div>
        )}

        {/* F-23b: Onboarding banner — ilk kez kullananlar için */}
        {kullanici && !kullanici.anonim && kullanici.toplam_kullanilan === 0 && !sonuc && (
          <div className="mb-4 bg-indigo-50 border border-indigo-200 rounded-2xl p-4 flex items-start gap-3">
            <span className="text-2xl flex-shrink-0">🎉</span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-indigo-800">Hoş geldiniz! İşte nasıl başlayacağınız:</p>
              <ol className="mt-1 space-y-0.5 text-xs text-indigo-700">
                <li>1. <span className="font-medium">Platform seç</span> — Trendyol, Amazon, Etsy vb.</li>
                <li>2. <span className="font-medium">Ürün adı ve kategori gir</span> — mümkün olduğunca spesifik ol</li>
                <li>3. <span className="font-medium">Üret butonuna bas</span> — AI 15-30 saniyede listing hazırlar</li>
              </ol>
            </div>
            <button onClick={() => setKullanici(u => u ? { ...u, toplam_kullanilan: -1 } : null)} aria-label="İpuçlarını kapat" className="text-indigo-400 hover:text-indigo-600 text-lg flex-shrink-0">×</button>
          </div>
        )}

        <div className="flex gap-6 items-start flex-col lg:flex-row">
          <div className="flex-1 w-full">

            {/* SEKMELER */}
            <div role="tablist" aria-label="İçerik türü seçimi" className="bg-white rounded-2xl shadow p-1.5 flex gap-1">
              {([
                { id: "metin", label: "📝 Metin", renk: "bg-blue-500", aktif: true },
                { id: "gorsel", label: "📷 Görsel", renk: "bg-violet-500", aktif: true },
                { id: "sosyal", label: "📱 Sosyal Medya", renk: "bg-emerald-500", aktif: true },
                { id: "video", label: "🎬 Video", renk: "bg-amber-500", aktif: true },
              ] as { id: AnaSekme; label: string; renk: string; aktif: boolean }[]).map((s) => (
                <button key={s.id}
                  role="tab"
                  aria-selected={anaSekme === s.id}
                  aria-controls={`sekme-panel-${s.id}`}
                  onClick={() => { if (s.aktif) { setAnaSekme(s.id); window.scrollTo({ top: 0, behavior: "smooth" }); } }}
                  disabled={!s.aktif}
                  className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    !s.aktif ? "text-gray-300 cursor-not-allowed" :
                    anaSekme === s.id ? `${s.renk} text-white shadow-sm` : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }`}>
                  <span>{s.label}</span>
                  {!s.aktif && <span className="block text-xs font-normal opacity-70">yakında</span>}
                </button>
              ))}
            </div>

            {/* PAYLAŞILAN ÜRÜN FOTOĞRAFI — tüm sekmelerde geçerli */}
            <div className="mt-3 bg-white rounded-2xl shadow p-4">
              {fotolar[0] ? (
                <div className="flex items-center gap-3">
                  <img src={fotolar[0]} alt="ürün" className="w-14 h-14 rounded-xl object-cover border border-gray-100 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-700">Ürün Fotoğrafı</p>
                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                      {[
                        { id: "metin", label: "📝 Metin", renk: "bg-blue-100 text-blue-600" },
                        { id: "gorsel", label: "📷 Görsel", renk: "bg-violet-100 text-violet-600" },
                        { id: "video", label: "🎬 Video", renk: "bg-amber-100 text-amber-600" },
                        { id: "sosyal", label: "📱 Sosyal", renk: "bg-emerald-100 text-emerald-600" },
                      ].map((s) => (
                        <span key={s.id} className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${s.renk}`}>{s.label}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                    <label className="text-xs text-blue-500 hover:text-blue-700 cursor-pointer font-medium">
                      Değiştir
                      <input type="file" accept="image/*" className="hidden" onChange={tekFotoSec} />
                    </label>
                    <button onClick={() => { setFotolar([]); setGorselJoblar([]); }} className="text-xs text-gray-400 hover:text-red-500 transition-colors">Kaldır</button>
                  </div>
                </div>
              ) : (
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="w-14 h-14 rounded-xl border-2 border-dashed border-gray-200 group-hover:border-indigo-300 flex items-center justify-center transition-colors flex-shrink-0">
                    <span className="text-xl">📷</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 group-hover:text-indigo-600 transition-colors">Ürün fotoğrafı yükle</p>
                    <p className="text-xs text-gray-400 mt-0.5">Metin, Görsel, Video ve Sosyal sekmelerin hepsinde kullanılır</p>
                  </div>
                  <span className="text-xs text-gray-400 group-hover:text-indigo-500 transition-colors flex-shrink-0">Seç →</span>
                  <input type="file" accept="image/*" className="hidden" onChange={tekFotoSec} />
                </label>
              )}
            </div>

            {/* ===== METİN SEKMESİ ===== */}
            <MetinSekmesi
              aktif={anaSekme === "metin"}
              girisTipi={girisTipi} setGirisTipi={setGirisTipi}
              platform={platform} setPlatform={setPlatform} setDil={setDil}
              urunAdi={urunAdi} setUrunAdi={setUrunAdi}
              kategori={kategori} setKategori={setKategori}
              ozellikler={ozellikler} setOzellikler={setOzellikler}
              hedefKitle={hedefKitle} setHedefKitle={setHedefKitle}
              fiyatSegmenti={fiyatSegmenti} setFiyatSegmenti={setFiyatSegmenti}
              anahtarKelimeler={anahtarKelimeler} setAnahtarKelimeler={setAnahtarKelimeler}
              markaliUrun={markaliUrun} setMarkaliUrun={setMarkaliUrun}
              fotolar={fotolar} fotoKaldir={fotoKaldir}
              kameraAcik={kameraAcik} kameraAc={kameraAc} kameraKapat={kameraKapat}
              barkodYukleniyor={barkodYukleniyor} barkodBilgi={barkodBilgi} setBarkodBilgi={setBarkodBilgi}
              yukleniyor={yukleniyor} yukleniyorMesaj={yukleniyorMesaj}
              sonuc={sonuc} setSonuc={setSonuc}
              duzenleYukleniyor={duzenleYukleniyor} setDuzenleYukleniyor={setDuzenleYukleniyor}
              uretimId={uretimId} yenidenUretHakki={yenidenUretHakki} setYenidenUretHakki={setYenidenUretHakki}
              kullanici={kullanici} paketModalAc={paketModalAc} icerikUret={icerikUret}
            />


            {/* ===== GÖRSEL SEKMESİ ===== */}
            <GorselSekmesi
              aktif={anaSekme === "gorsel"}
              urunAdi={urunAdi} kategori={kategori}
              fotolar={fotolar} fotoSec={fotoSec} fotoKaldir={fotoKaldir}
              gorselEkPrompt={gorselEkPrompt} setGorselEkPrompt={setGorselEkPrompt}
              seciliStiller={seciliStiller} stilToggle={stilToggle}
              gorselYukleniyor={gorselYukleniyor} gorselJoblar={gorselJoblar} setGorselJoblar={setGorselJoblar}
              referansGorsel={referansGorsel} setReferansGorsel={setReferansGorsel}
              kullanici={kullanici} paketModalAc={paketModalAc} gorselUret={gorselUret}
              blobIndir={blobIndir} resizeFoto={resizeFoto} invalidateCredits={invalidateCredits} setKullanici={setKullanici}
            />

            {/* ===== VIDEO SEKMESİ ===== */}
            <VideoSekmesi
              aktif={anaSekme === "video"}
              urunAdi={urunAdi} kategori={kategori}
              fotolar={fotolar} setFotolar={setFotolar} setGorselJoblar={setGorselJoblar}
              videoSure={videoSure} setVideoSure={setVideoSure}
              videoFormat={videoFormat} setVideoFormat={setVideoFormat}
              videoPrompt={videoPrompt} setVideoPrompt={setVideoPrompt}
              videoPromptGoster={videoPromptGoster} setVideoPromptGoster={setVideoPromptGoster}
              videoYukleniyor={videoYukleniyor} videoRequestId={videoRequestId} setVideoRequestId={setVideoRequestId}
              kullanici={kullanici} paketModalAc={paketModalAc} videoUret={videoUret} blobIndir={blobIndir}
            />

            {/* ===== SOSYAL MEDYA SEKMESİ ===== */}
            <SosyalSekmesi
              aktif={anaSekme === "sosyal"}
              sosyalIcerikTipi={sosyalIcerikTipi} setSosyalIcerikTipi={setSosyalIcerikTipi}
              sosyalPlatform={sosyalPlatform} setSosyalPlatform={setSosyalPlatform}
              sosyalTon={sosyalTon} setSosyalTon={setSosyalTon}
              sosyalSezon={sosyalSezon} setSosyalSezon={setSosyalSezon}
              sosyalUrunAdi={sosyalUrunAdi} setSosyalUrunAdi={setSosyalUrunAdi}
              sosyalEkBilgi={sosyalEkBilgi} setSosyalEkBilgi={setSosyalEkBilgi}
              captionYukleniyor={captionYukleniyor}
              sosyalCaption={sosyalCaption} setSosyalCaption={setSosyalCaption}
              sosyalHashtag={sosyalHashtag} setSosyalHashtag={setSosyalHashtag}
              sosyalKitYukleniyor={sosyalKitYukleniyor}
              sosyalKitSonuc={sosyalKitSonuc} setSosyalKitSonuc={setSosyalKitSonuc}
              sosyalKitAcik={sosyalKitAcik} setSosyalKitAcik={setSosyalKitAcik}
              sosyalFoto={sosyalFoto} setSosyalFoto={setSosyalFoto}
              sosyalGorselStil={sosyalGorselStil} setSosyalGorselStil={setSosyalGorselStil}
              sosyalGorselFormat={sosyalGorselFormat} setSosyalGorselFormat={setSosyalGorselFormat}
              sosyalGorselYukleniyor={sosyalGorselYukleniyor}
              sosyalGorselSonuclar={sosyalGorselSonuclar} setSosyalGorselSonuclar={setSosyalGorselSonuclar}
              sosyalGorselPrompt={sosyalGorselPrompt} setSosyalGorselPrompt={setSosyalGorselPrompt}
              kullanici={kullanici} paketModalAc={paketModalAc}
              captionUret={captionUret} kitUret={kitUret} sosyalGorselUret={sosyalGorselUret}
              setAnaSekme={setAnaSekme}
            />


          </div>

          {/* Sağ panel — Mini widget */}
          <div className="w-full lg:w-56 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow p-4 space-y-3 sticky top-4">
              {kullanici ? (
                <>
                  <div className="flex gap-2">
                    <div className="flex-1 bg-indigo-50 rounded-xl px-2 py-2 text-center">
                      <div className={`text-lg font-bold ${kullanici.is_admin ? "text-violet-500" : krediDusuk ? "text-amber-500" : "text-indigo-500"}`}>
                        {kullanici.is_admin ? "∞" : kullanici.kredi}
                      </div>
                      <div className="text-xs text-gray-500">Kalan kredi</div>
                    </div>
                    <div className="flex-1 bg-gray-50 rounded-xl px-2 py-2 text-center">
                      <div className="text-lg font-bold text-gray-700">{kullanici.toplam_kullanilan}</div>
                      <div className="text-xs text-gray-500">Toplam üretim</div>
                    </div>
                  </div>
                  <button onClick={() => paketModalAc()} className="w-full bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-semibold py-2 rounded-xl transition-colors">
                    + Kredi Al
                  </button>
                  {/* F-12c: Geçmiş sekmesi */}
                  {!kullanici.anonim && gecmis.length > 0 && (
                    <div>
                      <button onClick={() => setGecmisAcik(!gecmisAcik)} className="w-full flex items-center justify-between text-xs text-gray-500 hover:text-indigo-600 py-1.5 border border-gray-200 rounded-xl px-2 hover:border-indigo-300 transition-colors">
                        <span>📋 Geçmiş ({gecmis.length})</span>
                        <span>{gecmisAcik ? "▲" : "▼"}</span>
                      </button>
                      {gecmisAcik && (
                        <div className="mt-2 space-y-1">
                          <select value={gecmisPlatformFiltre} onChange={(e) => setGecmisPlatformFiltre(e.target.value)}
                            className="w-full text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-400">
                            <option value="">Tüm platformlar</option>
                            {["trendyol","hepsiburada","amazon","n11","etsy","amazon_usa"].map(p => (
                              <option key={p} value={p}>{p}</option>
                            ))}
                          </select>
                          <div className="max-h-40 overflow-y-auto space-y-1 mt-1">
                            {gecmis.filter(u => !gecmisPlatformFiltre || u.platform === gecmisPlatformFiltre).map(u => (
                              <button key={u.id} onClick={() => { setSonuc(u.sonuc); setAnaSekme("metin"); setGecmisAcik(false); }}
                                className="w-full text-left px-2 py-1.5 rounded-lg bg-gray-50 hover:bg-indigo-50 border border-transparent hover:border-indigo-200 transition-all">
                                <p className="text-xs font-medium text-gray-700 truncate">{u.urun_adi || "—"}</p>
                                <p className="text-xs text-gray-400">{u.platform} · {new Date(u.created_at).toLocaleDateString("tr-TR", { day: "numeric", month: "short" })}</p>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center space-y-2 py-1">
                  <p className="text-xs text-gray-500 leading-relaxed">3 ücretsiz kredi — kayıt olmadan başlayın</p>
                  <button onClick={() => { setAuthPopupMod("kayit"); setAuthPopupAcik(true); }} className="w-full bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-semibold py-2 rounded-xl transition-colors">
                    🎁 Hesap Oluştur
                  </button>
                  <button onClick={() => { setAuthPopupMod("giris"); setAuthPopupAcik(true); }} className="w-full text-xs text-gray-500 hover:text-gray-700 py-1 transition-colors">
                    Giriş Yap
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Auth Popup */}
        {authPopupAcik && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) setAuthPopupAcik(false); }}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">
                  {authPopupMod === "kayit" ? "Hesap Oluştur" : "Giriş Yap"}
                </h2>
                <button onClick={() => setAuthPopupAcik(false)} aria-label="Kapat" className="text-gray-400 hover:text-gray-600 text-2xl font-light">×</button>
              </div>
              <div className="p-5">
                <AuthForm defaultMode={authPopupMod} onSuccess={handleAuthSuccess} />
              </div>
            </div>
          </div>
        )}

        {paketModalAcik && kullanici && <PaketModal kullanici={kullanici} onKapat={() => setPaketModalAcik(false)} />}

        <ChatWidget />
      </div>
      <SiteFooter />
    </main>
    </>
  );
}
