"use client";
import { useState, useEffect, useCallback } from "react";
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
import { FileText, Image as ImageIcon, PlayCircle, Share2, ImagePlus } from "lucide-react";
import { useMetinUretim } from "@/lib/hooks/useMetinUretim";
import { useGorselUretim } from "@/lib/hooks/useGorselUretim";
import { useVideoUretim } from "@/lib/hooks/useVideoUretim";
import { useSosyalUretim } from "@/lib/hooks/useSosyalUretim";
import IntentBanner from "@/components/uret/IntentBanner";
import BrandProfileBlock from "@/components/uret/BrandProfileBlock";
import { calculateCredits, type ActiveTab } from "@/components/uret/useCalculateCredits";
import { getCTAState } from "@/components/uret/useCTAState";
import StickySubmitBar from "@/components/uret/StickySubmitBar";

type AnaSekme = "metin" | "gorsel" | "video" | "sosyal";

type Uretim = {
  id: string;
  urun_adi: string;
  platform: string;
  giris_tipi: string;
  sonuc: string;
  created_at: string;
};

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
  })
  const remainingCredits = kredilerHook ?? kullanici?.kredi ?? 0
  const isInsufficientCredit = !kullanici || kullanici.anonim || remainingCredits < cost

  const handleStickySubmit = () => {
    if (anaSekme === 'metin') metin.icerikUret()
    else if (anaSekme === 'gorsel') gorsel.gorselUret()
    else if (anaSekme === 'video') video.videoUret()
    else if (anaSekme === 'sosyal') sosyal.captionUret()
  }

  const isStickySubmitting =
    anaSekme === 'metin' ? metin.yukleniyor :
    anaSekme === 'gorsel' ? gorsel.gorselYukleniyor :
    anaSekme === 'video' ? video.videoYukleniyor :
    sosyal.captionYukleniyor

  const ctaState = getCTAState({
    activeTab: anaSekme as ActiveTab,
    productName: metin.urunAdi,
    hasPhoto: fotolar.length > 0,
    selectedStylesCount: gorsel.seciliStiller?.size,
    selectedPlatformsCount: 1,
    isLoggedIn: !!kullanici && !kullanici.anonim,
  })

  // Sync shared photo to sosyal tab (T7-07)
  useEffect(() => {
    if (fotolar[0] && !sosyal.sosyalFoto) {
      sosyal.setSosyalFoto(fotolar[0]);
    }
  }, [fotolar]);

  // ===== SHARED PHOTO HANDLERS =====
  const fotoSec = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dosyalar = Array.from(e.target.files || []);
    dosyalar.slice(0, 3 - fotolar.length).forEach((dosya) => {
      const reader = new FileReader();
      reader.onload = () => setFotolar((prev) => (prev.length >= 3 ? prev : [...prev, reader.result as string]));
      reader.readAsDataURL(dosya);
    });
    e.target.value = "";
  };

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

  return (
    <>
      <SiteHeader aktifSayfa="icerik" />
      <main className="min-h-screen bg-rd-neutral-50 pb-24 px-4">
      <div className="max-w-5xl mx-auto pt-6">

        {/* Auth-bağımlı bannerlar — yüklenirken skeleton göster */}
        {authYukleniyor ? (
          <div className="rounded-xl bg-rd-neutral-100 animate-pulse mb-5 h-14" />
        ) : (
          <>
            {/* Hero: giriş yapılmamış */}
            {(!kullanici || kullanici.anonim) && (
              <div className="bg-rd-neutral-100 border border-rd-neutral-200 rounded-xl px-6 py-7 mb-5 text-center">
                <h1 className="text-xl sm:text-2xl font-medium text-rd-neutral-900 mb-2">7 pazaryeri için AI içerik üreticisi</h1>
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

            {/* Hoş geldiniz — ilk ziyarette, bir kez */}
            {kullanici && !kullanici.anonim && kullanici.toplam_kullanilan === 0 && !metin.sonuc && !hosgeldiniBannerKapatildi && (
              <div className="mb-4 bg-rd-neutral-100 border border-rd-neutral-200 rounded-xl p-4 flex items-start gap-3">
                <div className="flex-1">
                  <p className="text-sm font-medium text-rd-neutral-900">Nasıl başlarsınız:</p>
                  <ol className="mt-1 space-y-0.5 text-xs text-rd-neutral-600">
                    <li>1. <span className="font-medium">Platform seç</span> — Trendyol, Amazon, Etsy vb.</li>
                    <li>2. <span className="font-medium">Ürün adı ve kategori gir</span> — mümkün olduğunca spesifik ol</li>
                    <li>3. <span className="font-medium">Üret butonuna bas</span> — AI 15-30 saniyede listing hazırlar</li>
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

        {/* Kredi düşük banner — auth-bağımsız, dinamik */}
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

        <div>

            <IntentBanner />
            <BrandProfileBlock />

            {/* SEKMELER */}
            <div role="tablist" aria-label="İçerik türü seçimi" className="bg-white border border-rd-neutral-200 rounded-xl p-1 flex gap-0.5">
              {([
                { id: "metin" as AnaSekme, label: "Metin", Icon: FileText },
                { id: "gorsel" as AnaSekme, label: "Görsel", Icon: ImageIcon },
                { id: "sosyal" as AnaSekme, label: "Sosyal medya", Icon: Share2 },
                { id: "video" as AnaSekme, label: "Video", Icon: PlayCircle },
              ]).map(({ id, label, Icon }) => (
                <button key={id}
                  role="tab"
                  aria-selected={anaSekme === id}
                  aria-controls={`sekme-panel-${id}`}
                  onClick={() => { setAnaSekme(id); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  className={`flex-1 py-2.5 rounded-lg text-xs sm:text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                    anaSekme === id
                      ? "bg-rd-primary-50 text-rd-primary-800 border border-rd-primary-200"
                      : "text-rd-neutral-600 hover:text-rd-neutral-900 hover:bg-rd-neutral-50"
                  }`}>
                  <Icon size={16} strokeWidth={1.5} />
                  <span>{label}</span>
                </button>
              ))}
            </div>

            {/* GLOBAL PLATFORM SEÇİMİ */}
            <div className="mt-3 bg-white border border-rd-neutral-200 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-rd-neutral-900 whitespace-nowrap flex-shrink-0">Platform</label>
                <select
                  value={metin.platform}
                  onChange={(e) => { metin.setPlatform(e.target.value); metin.setDil(PLATFORM_BILGI[e.target.value]?.dil || "tr"); }}
                  className="flex-1 border border-rd-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-rd-primary-800 focus:ring-2 focus:ring-rd-primary-800/20 transition-colors"
                >
                  <optgroup label="Türk pazaryerleri">
                    <option value="trendyol">Trendyol</option>
                    <option value="hepsiburada">Hepsiburada</option>
                    <option value="amazon">Amazon TR</option>
                    <option value="n11">N11</option>
                  </optgroup>
                  <optgroup label="Yabancı pazaryerleri (İngilizce)">
                    <option value="etsy">Etsy</option>
                    <option value="amazon_usa">Amazon USA</option>
                  </optgroup>
                </select>
              </div>
              {(() => {
                const bar = "mt-2 bg-rd-neutral-100 rounded-lg px-3 py-2 flex items-center gap-2 flex-wrap text-xs text-rd-neutral-600";
                const dot = <span className="text-rd-neutral-200">·</span>;
                if (anaSekme === "gorsel") {
                  return (
                    <div className={bar}>
                      <span>1:1 kare tercih</span>{dot}<span>7 stüdyo stili</span>{dot}<span>PNG çıktı</span>{dot}<span>Stil başına 1 kredi</span>
                    </div>
                  );
                }
                if (anaSekme === "video") {
                  return (
                    <div className={bar}>
                      <span>5sn 10kr · 10sn 20kr</span>{dot}<span>9:16 / 1:1 / 16:9</span>{dot}<span>MP4 çıktı</span>
                    </div>
                  );
                }
                if (anaSekme === "sosyal") {
                  return (
                    <div className={bar}>
                      <span>4 platform</span>{dot}<span>Caption ve hashtag</span>{dot}<span>Kit: 3 kredi</span>
                    </div>
                  );
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
              })()}
            </div>

            {/* PAYLAŞILAN ÜRÜN FOTOĞRAFI */}
            <div className={`mt-3 bg-white rounded-xl p-4 transition-colors ${fotolar[0] ? "border border-rd-neutral-200" : "border border-dashed border-rd-neutral-200 hover:border-rd-primary-800"}`}>
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

            {/* Tab content — key triggers fade animation on switch */}
            <div key={anaSekme} className="animate-tab-enter">

            {/* ===== METİN SEKMESİ ===== */}
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

            {/* ===== GÖRSEL SEKMESİ ===== */}
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

            {/* ===== VIDEO SEKMESİ ===== */}
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

            {/* ===== SOSYAL MEDYA SEKMESİ ===== */}
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

            </div> {/* /animate-tab-enter */}

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

      </div>
      <SiteFooter />
    </main>
    </>
  );
}
