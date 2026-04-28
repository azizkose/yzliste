"use client";
import { useState, useEffect, useCallback, useMemo, useRef, Fragment } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { useCredits, useInvalidateCredits } from "@/lib/hooks/useCredits";
import { analytics } from "@/lib/analytics";
import AuthForm from "@/components/auth/AuthForm";
import { resizeFoto } from "@/lib/listing-utils";
import type { Kullanici } from "@/lib/listing-utils";
import { PLATFORM_BILGI } from "@/lib/constants";
import PaketModal from "@/components/PaketModal";
import MetinSekmesi from "@/components/tabs/MetinSekmesi";
import GorselSekmesi from "@/components/tabs/GorselSekmesi";
import VideoSekmesi from "@/components/tabs/VideoSekmesi";
import SosyalSekmesi from "@/components/tabs/SosyalSekmesi";
import {
  FileText,
  Image as ImageIcon,
  PlayCircle,
  Share2,
  ImagePlus,
  Check,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";
import { useMetinUretim } from "@/lib/hooks/useMetinUretim";
import { useGorselUretim } from "@/lib/hooks/useGorselUretim";
import { useVideoUretim } from "@/lib/hooks/useVideoUretim";
import { useSosyalUretim } from "@/lib/hooks/useSosyalUretim";
import BrandProfileBlock from "@/components/uret/BrandProfileBlock";
import { calculateCredits, type ActiveTab } from "@/components/uret/useCalculateCredits";
import { getCTAState } from "@/components/uret/useCTAState";
import StickySubmitBar from "@/components/uret/StickySubmitBar";
import { cn } from "@/lib/utils";

type AnaSekme = "metin" | "gorsel" | "video" | "sosyal";

type Uretim = {
  id: string;
  urun_adi: string;
  platform: string;
  giris_tipi: string;
  sonuc: string;
  created_at: string;
};

const CONTENT_TYPES: { id: AnaSekme; label: string; Icon: LucideIcon; desc: string; credit: string }[] = [
  { id: "metin", label: "Listing metni", Icon: FileText, desc: "Başlık, özellikler, açıklama", credit: "1 kredi / ürün" },
  { id: "gorsel", label: "Ürün görseli", Icon: ImageIcon, desc: "7 stüdyo stili", credit: "1 kredi / stil" },
  { id: "video", label: "Ürün videosu", Icon: PlayCircle, desc: "5sn veya 10sn tanıtım", credit: "10–20 kredi" },
  { id: "sosyal", label: "Sosyal medya", Icon: Share2, desc: "Instagram, TikTok, Pinterest", credit: "3 kredi / kit" },
];

const PLATFORMS = [
  { id: "trendyol", label: "Trendyol" },
  { id: "hepsiburada", label: "Hepsiburada" },
  { id: "amazon", label: "Amazon TR" },
  { id: "n11", label: "N11" },
  { id: "etsy", label: "Etsy" },
  { id: "amazon_usa", label: "Amazon USA" },
];

export default function Home() {
  const router = useRouter();
  const invalidateCredits = useInvalidateCredits();
  const { data: kredilerHook } = useCredits();

  // ===== SHARED STATE =====
  const [anaSekme, setAnaSekme] = useState<AnaSekme>("metin");
  const [kullanici, setKullanici] = useState<Kullanici | null>(null);
  const [authYukleniyor, setAuthYukleniyor] = useState(true);
  const [gecmis, setGecmis] = useState<Uretim[]>([]);
  const [gecmisAcik, setGecmisAcik] = useState(false);
  const [gecmisPlatformFiltre, setGecmisPlatformFiltre] = useState("");
  const [paketModalAcik, setPaketModalAcik] = useState(false);
  const [hata, setHata] = useState<string | null>(null);
  const [hosgeldiniBannerKapatildi, setHosgeldiniBannerKapatildi] = useState(() =>
    typeof window !== "undefined" && localStorage.getItem("hbk") === "1"
  );
  const [authPopupAcik, setAuthPopupAcik] = useState(false);
  const [authPopupMod, setAuthPopupMod] = useState<"giris" | "kayit">("kayit");
  const [authSonraAksiyon, setAuthSonraAksiyon] = useState<"paket" | null>(null);
  const [fotolar, setFotolar] = useState<string[]>([]);

  // LP-12: step progress state
  const [step1Interacted, setStep1Interacted] = useState(false);
  const prevStep1DoneRef = useRef(false);
  const prevStep2DoneRef = useRef(false);

  const krediDusuk = kullanici && !kullanici.is_admin && (kredilerHook ?? kullanici.kredi) <= 2;

  // Stable functional-update wrapper so hooks get a stable reference
  const setKullaniciFn = useCallback((fn: (k: Kullanici | null) => Kullanici | null) => {
    setKullanici(fn);
  }, []);

  const loginGerekli = useCallback((): boolean => {
    if (!kullanici || kullanici.anonim) {
      setAuthPopupMod("kayit");
      setAuthPopupAcik(true);
      return false;
    }
    return true;
  }, [kullanici]);

  const paketModalAc = useCallback(() => {
    if (!kullanici || kullanici.anonim) {
      setAuthSonraAksiyon("paket");
      setAuthPopupMod("kayit");
      setAuthPopupAcik(true);
      return;
    }
    setPaketModalAcik(true);
  }, [kullanici]);

  const gecmisiYukle = useCallback(async (userId: string) => {
    const { data } = await supabase.from("uretimler").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(10);
    if (data) setGecmis(data);
  }, []);

  const blobIndir = (blob: Blob, dosyaAdi: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = dosyaAdi; a.click();
    URL.revokeObjectURL(url);
  };

  // ===== TAB HOOKS =====
  const metin = useMetinUretim({ fotolar, kullanici, setKullanici: setKullaniciFn, loginGerekli, paketModalAc, setHata, gecmisiYukle, invalidateCredits });
  const gorsel = useGorselUretim({ fotolar, kullanici, setKullanici: setKullaniciFn, loginGerekli, paketModalAc, setHata, invalidateCredits });
  const video = useVideoUretim({ fotolar, kullanici, setKullanici: setKullaniciFn, loginGerekli, paketModalAc, setHata, invalidateCredits });
  const sosyal = useSosyalUretim({ urunAdi: metin.urunAdi, kullanici, setKullanici: setKullaniciFn, loginGerekli, paketModalAc, setHata, invalidateCredits });

  // Sticky bar — cost + credit check
  const cost = calculateCredits({
    activeTab: anaSekme as ActiveTab,
    selectedStylesCount: gorsel.seciliStiller?.size,
    videoLengthSec: Number(video.videoSure) as 5 | 10,
    selectedPlatformsCount: 1,
  });
  const remainingCredits = kredilerHook ?? kullanici?.kredi ?? 0;
  const isInsufficientCredit = !kullanici || kullanici.anonim || remainingCredits < cost;

  const handleStickySubmit = () => {
    if (anaSekme === "metin") metin.icerikUret();
    else if (anaSekme === "gorsel") gorsel.gorselUret();
    else if (anaSekme === "video") video.videoUret();
    else if (anaSekme === "sosyal") sosyal.captionUret();
  };

  const isStickySubmitting =
    anaSekme === "metin" ? metin.yukleniyor :
    anaSekme === "gorsel" ? gorsel.gorselYukleniyor :
    anaSekme === "video" ? video.videoYukleniyor :
    sosyal.captionYukleniyor;

  const ctaState = getCTAState({
    activeTab: anaSekme as ActiveTab,
    productName: metin.urunAdi,
    hasPhoto: fotolar.length > 0,
    selectedStylesCount: gorsel.seciliStiller?.size,
    selectedPlatformsCount: 1,
    isLoggedIn: !!kullanici && !kullanici.anonim,
  });

  // LP-12: step progress derived state
  const step1Done = step1Interacted;
  const step2Done = fotolar.length > 0 || metin.urunAdi.trim() !== "";
  const currentStep = !step1Done ? 1 : !step2Done ? 2 : 3;

  // LP-12: step handlers
  const handleContentTypeChange = useCallback((tab: AnaSekme) => {
    setAnaSekme(tab);
    setStep1Interacted(true);
  }, []);

  const handlePlatformChange = useCallback((platformId: string) => {
    metin.setPlatform(platformId);
    metin.setDil(PLATFORM_BILGI[platformId]?.dil || "tr");
    setStep1Interacted(true);
  }, [metin]);

  // LP-12: auto-scroll when step completes
  useEffect(() => {
    if (!step1Done) return;
    if (prevStep1DoneRef.current) return;
    prevStep1DoneRef.current = true;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!prefersReduced) {
      document.getElementById("step-2")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [step1Done]);

  useEffect(() => {
    if (!step2Done || !step1Done) return;
    if (prevStep2DoneRef.current) return;
    prevStep2DoneRef.current = true;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!prefersReduced) {
      document.getElementById("step-3")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [step2Done, step1Done]);

  // Sync shared photo to sosyal tab (T7-07)
  useEffect(() => {
    if (fotolar[0] && !sosyal.sosyalFoto) {
      sosyal.setSosyalFoto(fotolar[0]);
    }
  }, [fotolar]); // eslint-disable-line react-hooks/exhaustive-deps

  // ===== SHARED PHOTO HANDLERS =====
  const fotoKaldir = (index: number) => {
    setFotolar((prev) => prev.filter((_, i) => i !== index));
    gorsel.setGorselJoblar([]);
  };

  const tekFotoSec = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dosya = e.target.files?.[0];
    if (!dosya) return;
    const reader = new FileReader();
    reader.onload = () => { setFotolar([reader.result as string]); gorsel.setGorselJoblar([]); };
    reader.readAsDataURL(dosya);
    e.target.value = "";
  };

  // ===== AUTH =====
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
    if (authSonraAksiyon === "paket") { setAuthSonraAksiyon(null); setPaketModalAcik(true); }
  }, [authSonraAksiyon, gecmisiYukle]);

  const kullaniciyiKontrolEt = async () => {
    const params = new URLSearchParams(window.location.search);
    const paketParam = params.get("paket") === "ac";
    const odemeParam = params.get("odeme");
    const tabParam = params.get("tab");
    const girisParam = params.get("giris");
    if (tabParam && (["metin", "gorsel", "video", "sosyal"] as AnaSekme[]).includes(tabParam as AnaSekme)) {
      setAnaSekme(tabParam as AnaSekme);
    }
    if (tabParam === "metin" && girisParam === "excel") {
      metin.setGirisTipi("excel");
    }
    if (paketParam || odemeParam || tabParam) window.history.replaceState({}, "", "/uret");
    const { data: { user } } = await supabase.auth.getUser();
    if (odemeParam === "hata") setHata("Ödeme tamamlanamadı. Tekrar deneyin.");
    if (!user) {
      if (paketParam) { setAuthSonraAksiyon("paket"); setAuthPopupMod("kayit"); setAuthPopupAcik(true); }
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
      if (anonim) { setAuthSonraAksiyon("paket"); setAuthPopupMod("kayit"); setAuthPopupAcik(true); }
      else setPaketModalAcik(true);
    }
    setAuthYukleniyor(false);
  };

  useEffect(() => {
    kullaniciyiKontrolEt(); // eslint-disable-line react-hooks/set-state-in-effect
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Platform info bar content (tab-dependent)
  const platformInfoBar = (() => {
    const bar = "mt-4 bg-rd-neutral-100 rounded-lg px-3 py-2 flex items-center gap-2 flex-wrap text-xs text-rd-neutral-600";
    const dot = <span className="text-rd-neutral-300">·</span>;
    if (anaSekme === "gorsel") {
      return <div className={bar}><span>1:1 kare tercih</span>{dot}<span>7 stüdyo stili</span>{dot}<span>PNG çıktı</span>{dot}<span>Stil başına 1 kredi</span></div>;
    }
    if (anaSekme === "video") {
      return <div className={bar}><span>5sn 10 kredi · 10sn 20 kredi</span>{dot}<span>9:16 / 1:1 / 16:9</span>{dot}<span>MP4 çıktı</span></div>;
    }
    if (anaSekme === "sosyal") {
      return <div className={bar}><span>4 platform</span>{dot}<span>Caption ve hashtag</span>{dot}<span>Kit: 3 kredi</span></div>;
    }
    const pb = PLATFORM_BILGI[metin.platform] || PLATFORM_BILGI.trendyol;
    const platformDil = pb.dil || "tr";
    return (
      <div className={bar}>
        <span>Başlık {pb.baslikLimit} karakter</span>
        {pb.ozellikSayisi > 0 && <>{dot}<span>{pb.ozellikSayisi} özellik maddesi</span></>}
        {pb.etiketSayisi > 0 && <>{dot}<span>{pb.etiketSayisi} arama etiketi</span></>}
        {dot}
        <span>{platformDil === "en" ? "İngilizce çıktı" : "Türkçe çıktı"}</span>
      </div>
    );
  })();

  return (
    <>
      <SiteHeader aktifSayfa="icerik" />
      <main className="min-h-screen bg-rd-neutral-50 pb-40">

        {/* Page header + ProgressIndicator */}
        <div className="max-w-5xl mx-auto pt-8 px-4 sm:px-6">
          <p
            className="text-xs font-medium text-rd-primary-600 uppercase tracking-wider text-center mb-2"
            style={{ fontFamily: 'var(--font-rd-display)' }}
          >
            İçerik üret
          </p>
          <h1
            className="text-2xl sm:text-3xl font-bold text-rd-neutral-900 text-center mb-6"
            style={{ fontFamily: 'var(--font-rd-display)', letterSpacing: '-0.01em' }}
          >
            Ürününü tanıt, AI senin için yapsın
          </h1>

          {/* ProgressIndicator */}
          <div
            className="flex items-center justify-center gap-2 max-w-xs mx-auto mb-8"
            aria-label={`İlerleme: ${currentStep}/3`}
          >
            {[1, 2, 3].map((step, i) => (
              <Fragment key={step}>
                <button
                  onClick={() => {
                    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
                    document.getElementById(`step-${step}`)?.scrollIntoView({
                      behavior: prefersReduced ? "auto" : "smooth",
                      block: "start",
                    });
                  }}
                  aria-label={
                    step < currentStep
                      ? `Adım ${step} tamamlandı`
                      : step === currentStep
                      ? `Adım ${step} — aktif`
                      : `Adım ${step}`
                  }
                  aria-current={step === currentStep ? "step" : undefined}
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rd-primary-700 focus-visible:ring-offset-2",
                    step < currentStep
                      ? "bg-rd-success-700 text-white"
                      : step === currentStep
                      ? "bg-rd-primary-700 text-white"
                      : "bg-rd-neutral-200 text-rd-neutral-500"
                  )}
                >
                  {step < currentStep ? <Check size={14} aria-hidden="true" /> : step}
                </button>
                {i < 2 && (
                  <div
                    className={cn("flex-1 h-0.5", step < currentStep ? "bg-rd-success-700" : "bg-rd-neutral-200")}
                    aria-hidden="true"
                  />
                )}
              </Fragment>
            ))}
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6">

          {/* Auth-bağımlı bannerlar */}
          {authYukleniyor ? (
            <div className="rounded-xl bg-rd-neutral-100 animate-pulse mb-5 h-14" />
          ) : (
            <>
              {/* Giriş yapılmamış banner */}
              {(!kullanici || kullanici.anonim) && (
                <div className="bg-rd-neutral-100 border border-rd-neutral-200 rounded-xl px-6 py-7 mb-5 text-center">
                  <p className="text-xl sm:text-2xl font-medium text-rd-neutral-900 mb-2">7 pazaryeri için AI içerik üreticisi</p>
                  <p className="text-sm text-rd-neutral-600 mb-1">Trendyol, Hepsiburada, Amazon, Etsy ve daha fazlası için — başlık, açıklama, görsel ve video tek platformda.</p>
                  <p className="text-xs text-rd-neutral-600 mb-5">İçerik üretmek için ücretsiz hesap gerekli — 3 kredi hediye, kredi kartı yok.</p>
                  <div className="flex items-center justify-center gap-3 flex-wrap">
                    <button onClick={() => { setAuthPopupMod("kayit"); setAuthPopupAcik(true); }} className="bg-rd-primary-800 hover:bg-rd-primary-900 text-white font-medium px-6 py-2.5 rounded-lg text-sm transition-colors">
                      Ücretsiz hesap oluştur — 3 kredi hediye
                    </button>
                    <button onClick={() => { setAuthPopupMod("giris"); setAuthPopupAcik(true); }} className="text-sm text-rd-primary-800 hover:text-rd-primary-900 font-medium transition-colors">
                      Giriş yap →
                    </button>
                  </div>
                </div>
              )}

              {/* Hoş geldiniz — ilk ziyarette */}
              {kullanici && !kullanici.anonim && kullanici.toplam_kullanilan === 0 && !metin.sonuc && !hosgeldiniBannerKapatildi && (
                <div className="mb-4 bg-rd-neutral-100 border border-rd-neutral-200 rounded-xl p-4 flex items-start gap-3">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-rd-neutral-900">Nasıl başlarsınız:</p>
                    <ol className="mt-1 space-y-0.5 text-xs text-rd-neutral-600">
                      <li>1. <span className="font-medium">İçerik türü seç</span> — metin, görsel, video veya sosyal medya</li>
                      <li>2. <span className="font-medium">Platform ve ürün bilgisi gir</span></li>
                      <li>3. <span className="font-medium">Üret butonuna bas</span> — AI 15-30 saniyede hazırlar</li>
                    </ol>
                  </div>
                  <button
                    onClick={() => { localStorage.setItem("hbk", "1"); setHosgeldiniBannerKapatildi(true); }}
                    aria-label="İpuçlarını kapat"
                    className="text-rd-neutral-400 hover:text-rd-neutral-600 text-lg flex-shrink-0 transition-colors"
                  >×</button>
                </div>
              )}
            </>
          )}

          {/* Kredi düşük banner */}
          {krediDusuk && (
            <div className="bg-rd-warning-50 border border-rd-neutral-200 rounded-xl p-4 mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-rd-warning-700">İçerik üretim krediniz azalıyor</p>
                <p className="text-xs text-rd-warning-700/80 mt-0.5">{kredilerHook ?? kullanici?.kredi} kredi kaldı — tükenince içerik üretemezsiniz.</p>
              </div>
              <button onClick={() => paketModalAc()} className="bg-rd-primary-800 hover:bg-rd-primary-900 text-white text-xs font-medium px-4 py-2 rounded-lg whitespace-nowrap flex-shrink-0 transition-colors">Kredi yükle</button>
            </div>
          )}

          {/* Hata banner */}
          {hata && (
            <div className="bg-rd-danger-50 border border-rd-neutral-200 rounded-xl p-4 mb-4 flex items-center justify-between gap-4">
              <p className="text-sm text-rd-danger-700 flex-1">{hata}</p>
              <button onClick={() => setHata(null)} aria-label="Hatayı kapat" className="text-rd-neutral-400 hover:text-rd-neutral-600 text-xl flex-shrink-0 transition-colors">×</button>
            </div>
          )}

          {/* ========== ADIM 1 ========== */}
          <section
            id="step-1"
            aria-labelledby="step-1-title"
            className={cn(
              "relative ml-5 md:ml-6 pl-12 md:pl-16 pb-10 border-l-2",
              currentStep === 1 ? "border-rd-primary-200" : "border-rd-neutral-200"
            )}
          >
            {/* Numbered circle */}
            <div
              className={cn(
                "absolute -left-5 md:-left-6 top-0 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-white text-sm font-medium transition-all",
                step1Done ? "bg-rd-success-700" : "bg-rd-warm-700",
                currentStep === 1 ? "animate-pulse-soft" : ""
              )}
              aria-hidden="true"
            >
              {step1Done ? <CheckCircle2 size={18} /> : 1}
            </div>

            <h2
              id="step-1-title"
              className="text-base md:text-lg font-medium text-rd-neutral-900 mb-5"
              style={{ fontFamily: 'var(--font-rd-display)' }}
            >
              1 · Ne üreteceksin?
            </h2>

            {/* ContentTypeGrid — 4 büyük kart, 2x2 / 1x4 */}
            <div
              role="tablist"
              aria-label="İçerik türü seçimi"
              className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5"
            >
              {CONTENT_TYPES.map(({ id, label, Icon, desc, credit }) => (
                <button
                  key={id}
                  role="tab"
                  aria-selected={anaSekme === id}
                  aria-controls={`sekme-panel-${id}`}
                  onClick={() => handleContentTypeChange(id)}
                  className={cn(
                    "flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rd-primary-700 focus-visible:ring-offset-2",
                    anaSekme === id
                      ? "border-2 border-rd-primary-700 bg-rd-primary-50"
                      : "border border-rd-neutral-200 bg-white hover:bg-rd-neutral-50"
                  )}
                >
                  <Icon
                    size={22}
                    strokeWidth={1.5}
                    className={anaSekme === id ? "text-rd-primary-700" : "text-rd-neutral-500"}
                    aria-hidden="true"
                  />
                  <div>
                    <p className={cn("text-sm font-medium", anaSekme === id ? "text-rd-primary-800" : "text-rd-neutral-900")}>
                      {label}
                    </p>
                    <p className="text-xs text-rd-neutral-500 mt-0.5">{desc}</p>
                    <p className="text-xs text-rd-neutral-400 mt-1">{credit}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* PlatformChips — horizontal scroll on mobile */}
            <div
              role="group"
              aria-label="Platform seçimi"
              className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide"
            >
              {PLATFORMS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handlePlatformChange(p.id)}
                  aria-pressed={metin.platform === p.id}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex-shrink-0",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rd-primary-700 focus-visible:ring-offset-2",
                    metin.platform === p.id
                      ? "bg-rd-primary-800 text-white"
                      : "bg-white border border-rd-neutral-200 text-rd-neutral-700 hover:bg-rd-neutral-50"
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Platform info bar */}
            {platformInfoBar}
          </section>

          {/* ========== ADIM 2 ========== */}
          <section
            id="step-2"
            aria-labelledby="step-2-title"
            className={cn(
              "relative ml-5 md:ml-6 pl-12 md:pl-16 pb-10 border-l-2 transition-opacity",
              !step1Done ? "opacity-50 pointer-events-none border-rd-neutral-200" :
              currentStep === 2 ? "border-rd-primary-200" : "border-rd-neutral-200"
            )}
          >
            {/* Numbered circle */}
            <div
              className={cn(
                "absolute -left-5 md:-left-6 top-0 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-white text-sm font-medium transition-all",
                step2Done ? "bg-rd-success-700" : step1Done ? "bg-rd-warm-700" : "bg-rd-neutral-300",
                currentStep === 2 ? "animate-pulse-soft" : ""
              )}
              aria-hidden="true"
            >
              {step2Done ? <CheckCircle2 size={18} /> : 2}
            </div>

            <h2
              id="step-2-title"
              className="text-base md:text-lg font-medium text-rd-neutral-900 mb-5"
              style={{ fontFamily: 'var(--font-rd-display)' }}
            >
              2 · Ürünü tanıt
            </h2>

            {/* BrandProfileBlock */}
            <div className="mb-4">
              <BrandProfileBlock />
            </div>

            {/* Paylaşılan ürün fotoğrafı */}
            <div className={`mb-4 bg-white rounded-xl p-4 transition-colors ${fotolar[0] ? "border border-rd-neutral-200" : "border border-dashed border-rd-neutral-200 hover:border-rd-primary-800"}`}>
              {fotolar[0] ? (
                <div className="flex items-center gap-3">
                  <img src={fotolar[0]} alt="ürün" className="w-14 h-14 rounded-xl object-cover border border-rd-neutral-200 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-rd-neutral-900">Ürün fotoğrafı</p>
                    <p className="text-xs text-rd-neutral-400 mt-0.5">Metin, Görsel, Video, Sosyal</p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                    <label className="text-xs text-rd-primary-800 hover:text-rd-primary-900 cursor-pointer font-medium transition-colors">
                      Değiştir
                      <input type="file" accept="image/*" className="hidden" onChange={tekFotoSec} />
                    </label>
                    <button onClick={() => { setFotolar([]); gorsel.setGorselJoblar([]); }} className="text-xs text-rd-neutral-400 hover:text-red-500 transition-colors">Kaldır</button>
                  </div>
                </div>
              ) : (
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="w-12 h-12 rounded-lg bg-rd-neutral-100 group-hover:bg-rd-primary-100 flex items-center justify-center flex-shrink-0 transition-colors">
                    <ImagePlus size={20} strokeWidth={1.5} className="text-rd-neutral-600 group-hover:text-rd-primary-800 transition-colors" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-rd-neutral-900">Ürün fotoğrafı yükle</p>
                    <p className="text-xs text-rd-neutral-400 mt-0.5">Tüm içerik türlerinde kullanılır</p>
                  </div>
                  <span className="text-xs text-rd-neutral-400 group-hover:text-rd-primary-800 transition-colors flex-shrink-0">Seç</span>
                  <input type="file" accept="image/*" className="hidden" onChange={tekFotoSec} />
                </label>
              )}
            </div>

            {/* Tab content */}
            <div key={anaSekme} className="animate-tab-enter">

              <MetinSekmesi
                aktif={anaSekme === "metin"}
                girisTipi={metin.girisTipi} setGirisTipi={metin.setGirisTipi}
                platform={metin.platform}
                urunAdi={metin.urunAdi} setUrunAdi={metin.setUrunAdi}
                kategori={metin.kategori} setKategori={metin.setKategori}
                ozellikler={metin.ozellikler} setOzellikler={metin.setOzellikler}
                hedefKitle={metin.hedefKitle} setHedefKitle={metin.setHedefKitle}
                fiyatSegmenti={metin.fiyatSegmenti} setFiyatSegmenti={metin.setFiyatSegmenti}
                fotolar={fotolar} fotoKaldir={fotoKaldir}
                kameraAcik={metin.kameraAcik} kameraAc={metin.kameraAc} kameraKapat={metin.kameraKapat}
                barkodYukleniyor={metin.barkodYukleniyor} barkodBilgi={metin.barkodBilgi} setBarkodBilgi={metin.setBarkodBilgi}
                yukleniyor={metin.yukleniyor} yukleniyorMesaj={metin.yukleniyorMesaj}
                sonuc={metin.sonuc} setSonuc={metin.setSonuc}
                duzenleYukleniyor={metin.duzenleYukleniyor} setDuzenleYukleniyor={metin.setDuzenleYukleniyor}
                uretimId={metin.uretimId} yenidenUretHakki={metin.yenidenUretHakki} setYenidenUretHakki={metin.setYenidenUretHakki}
                kullanici={kullanici} paketModalAc={paketModalAc} icerikUret={metin.icerikUret}
                onGirisAc={() => { setAuthPopupMod("giris"); setAuthPopupAcik(true); }}
                skor={metin.skor} oneriler={metin.oneriler}
                ucretsizRevizeKullanildi={metin.ucretsizRevizeKullanildi}
                ucretsizRevizeBaslat={metin.ucretsizRevizeBaslat}
              />

              <GorselSekmesi
                aktif={anaSekme === "gorsel"}
                urunAdi={metin.urunAdi} kategori={metin.kategori}
                fotolar={fotolar} fotoKaldir={fotoKaldir}
                gorselEkPrompt={gorsel.gorselEkPrompt} setGorselEkPrompt={gorsel.setGorselEkPrompt}
                seciliStiller={gorsel.seciliStiller} stilToggle={gorsel.stilToggle}
                gorselYukleniyor={gorsel.gorselYukleniyor} gorselJoblar={gorsel.gorselJoblar} setGorselJoblar={gorsel.setGorselJoblar}
                referansGorsel={gorsel.referansGorsel} setReferansGorsel={gorsel.setReferansGorsel}
                kullanici={kullanici} paketModalAc={paketModalAc} gorselUret={gorsel.gorselUret}
                blobIndir={blobIndir} resizeFoto={resizeFoto} invalidateCredits={invalidateCredits} setKullanici={setKullaniciFn}
              />

              <VideoSekmesi
                aktif={anaSekme === "video"}
                urunAdi={metin.urunAdi} kategori={metin.kategori}
                fotolar={fotolar} setFotolar={setFotolar} setGorselJoblar={gorsel.setGorselJoblar}
                videoSure={video.videoSure} setVideoSure={video.setVideoSure}
                videoFormat={video.videoFormat} setVideoFormat={video.setVideoFormat}
                videoPrompt={video.videoPrompt} setVideoPrompt={video.setVideoPrompt}
                videoPromptGoster={video.videoPromptGoster} setVideoPromptGoster={video.setVideoPromptGoster}
                videoYukleniyor={video.videoYukleniyor} videoRequestId={video.videoRequestId} setVideoRequestId={video.setVideoRequestId}
                kullanici={kullanici} paketModalAc={paketModalAc} videoUret={video.videoUret} blobIndir={blobIndir}
              />

              <SosyalSekmesi
                aktif={anaSekme === "sosyal"}
                sosyalIcerikTipi={sosyal.sosyalIcerikTipi} setSosyalIcerikTipi={sosyal.setSosyalIcerikTipi}
                sosyalPlatform={sosyal.sosyalPlatform} setSosyalPlatform={sosyal.setSosyalPlatform}
                sosyalTon={sosyal.sosyalTon} setSosyalTon={sosyal.setSosyalTon}
                sosyalSezon={sosyal.sosyalSezon} setSosyalSezon={sosyal.setSosyalSezon}
                sosyalUrunAdi={sosyal.sosyalUrunAdi} setSosyalUrunAdi={sosyal.setSosyalUrunAdi}
                sosyalEkBilgi={sosyal.sosyalEkBilgi} setSosyalEkBilgi={sosyal.setSosyalEkBilgi}
                captionYukleniyor={sosyal.captionYukleniyor}
                sosyalCaption={sosyal.sosyalCaption} setSosyalCaption={sosyal.setSosyalCaption}
                sosyalHashtag={sosyal.sosyalHashtag} setSosyalHashtag={sosyal.setSosyalHashtag}
                sosyalFoto={sosyal.sosyalFoto} setSosyalFoto={sosyal.setSosyalFoto}
                sosyalGorselStil={sosyal.sosyalGorselStil} setSosyalGorselStil={sosyal.setSosyalGorselStil}
                sosyalGorselFormat={sosyal.sosyalGorselFormat} setSosyalGorselFormat={sosyal.setSosyalGorselFormat}
                sosyalGorselYukleniyor={sosyal.sosyalGorselYukleniyor}
                sosyalGorselSonuclar={sosyal.sosyalGorselSonuclar} setSosyalGorselSonuclar={sosyal.setSosyalGorselSonuclar}
                sosyalGorselPrompt={sosyal.sosyalGorselPrompt} setSosyalGorselPrompt={sosyal.setSosyalGorselPrompt}
                kullanici={kullanici} paketModalAc={paketModalAc}
                captionUret={sosyal.captionUret} sosyalGorselUret={sosyal.sosyalGorselUret}
                setAnaSekme={setAnaSekme}
              />

            </div>
          </section>

          {/* ========== ADIM 3 ========== */}
          <section
            id="step-3"
            aria-labelledby="step-3-title"
            className={cn(
              "relative ml-5 md:ml-6 pl-12 md:pl-16 pb-8 border-l-2 border-transparent transition-opacity",
              !step1Done || !step2Done ? "opacity-40" : ""
            )}
          >
            {/* Numbered circle */}
            <div
              className={cn(
                "absolute -left-5 md:-left-6 top-0 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-white text-sm font-medium transition-all",
                step1Done && step2Done ? "bg-rd-warm-700" : "bg-rd-neutral-300",
                currentStep === 3 ? "animate-pulse-soft" : ""
              )}
              aria-hidden="true"
            >
              3
            </div>

            <h2
              id="step-3-title"
              className="text-base md:text-lg font-medium text-rd-neutral-900 mb-4"
              style={{ fontFamily: 'var(--font-rd-display)' }}
            >
              3 · Üret
            </h2>

            <div className="bg-white rounded-xl border border-rd-neutral-200 p-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-rd-neutral-900">
                  Maliyet: {cost} kredi
                </p>
                <p className="text-xs text-rd-neutral-500 mt-0.5">
                  Kalan bakiye: {remainingCredits} kredi
                </p>
              </div>
              <p className="text-xs text-rd-neutral-400 text-right">
                Aşağıdaki "Üret" butonu ile başlat
              </p>
            </div>
          </section>

          {/* StickySubmitBar — preserved at bottom */}
          <StickySubmitBar
            cost={cost}
            remainingCredits={remainingCredits}
            isInsufficientCredit={isInsufficientCredit}
            ctaState={ctaState}
            onSubmit={handleStickySubmit}
            isSubmitting={isStickySubmitting}
          />

        </div>

        {/* Auth Popup */}
        {authPopupAcik && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) setAuthPopupAcik(false); }}>
            <div className="bg-white rounded-xl border border-rd-neutral-200 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between p-5 border-b border-rd-neutral-200">
                <h2 className="text-lg font-medium text-rd-neutral-900">
                  {authPopupMod === "kayit" ? "Hesap oluştur" : "Giriş yap"}
                </h2>
                <button onClick={() => setAuthPopupAcik(false)} aria-label="Kapat" className="text-rd-neutral-400 hover:text-rd-neutral-600 text-2xl font-light">×</button>
              </div>
              <div className="p-5">
                <AuthForm defaultMode={authPopupMod} onSuccess={handleAuthSuccess} />
              </div>
            </div>
          </div>
        )}

        {paketModalAcik && kullanici && <PaketModal kullanici={kullanici} onKapat={() => setPaketModalAcik(false)} />}

      </main>
      <SiteFooter />
    </>
  );
}
