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
import PaketModal from "@/components/PaketModal";
import ChatWidget from "@/components/ChatWidget";
import MetinSekmesi from "@/components/tabs/MetinSekmesi";
import GorselSekmesi from "@/components/tabs/GorselSekmesi";
import VideoSekmesi from "@/components/tabs/VideoSekmesi";
import SosyalSekmesi from "@/components/tabs/SosyalSekmesi";
import Link from "next/link";
import { useMetinUretim } from "@/lib/hooks/useMetinUretim";
import { useGorselUretim } from "@/lib/hooks/useGorselUretim";
import { useVideoUretim } from "@/lib/hooks/useVideoUretim";
import { useSosyalUretim } from "@/lib/hooks/useSosyalUretim";

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
  const [profilBannerKapatildi, setProfilBannerKapatildi] = useState(false);
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
    if (paketParam || odemeParam) window.history.replaceState({}, "", "/");
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
    kullaniciyiKontrolEt();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <SiteHeader aktifSayfa="icerik" />
      <main className="min-h-screen bg-gray-50 pb-24 px-4">
      <div className="max-w-5xl mx-auto pt-6">

        {/* Compact hero */}
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
              <a href="/hesap/profil" className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-xl whitespace-nowrap transition-colors">Profili Düzenle</a>
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

        {/* F-23b: Onboarding banner */}
        {kullanici && !kullanici.anonim && kullanici.toplam_kullanilan === 0 && !metin.sonuc && (
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

            {/* PAYLAŞILAN ÜRÜN FOTOĞRAFI */}
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
                    <button onClick={() => { setFotolar([]); gorsel.setGorselJoblar([]); }} className="text-xs text-gray-400 hover:text-red-500 transition-colors">Kaldır</button>
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
              girisTipi={metin.girisTipi} setGirisTipi={metin.setGirisTipi}
              platform={metin.platform} setPlatform={metin.setPlatform} setDil={metin.setDil}
              urunAdi={metin.urunAdi} setUrunAdi={metin.setUrunAdi}
              kategori={metin.kategori} setKategori={metin.setKategori}
              ozellikler={metin.ozellikler} setOzellikler={metin.setOzellikler}
              hedefKitle={metin.hedefKitle} setHedefKitle={metin.setHedefKitle}
              fiyatSegmenti={metin.fiyatSegmenti} setFiyatSegmenti={metin.setFiyatSegmenti}
              anahtarKelimeler={metin.anahtarKelimeler} setAnahtarKelimeler={metin.setAnahtarKelimeler}
              markaliUrun={metin.markaliUrun} setMarkaliUrun={metin.setMarkaliUrun}
              fotolar={fotolar} fotoKaldir={fotoKaldir}
              kameraAcik={metin.kameraAcik} kameraAc={metin.kameraAc} kameraKapat={metin.kameraKapat}
              barkodYukleniyor={metin.barkodYukleniyor} barkodBilgi={metin.barkodBilgi} setBarkodBilgi={metin.setBarkodBilgi}
              yukleniyor={metin.yukleniyor} yukleniyorMesaj={metin.yukleniyorMesaj}
              sonuc={metin.sonuc} setSonuc={metin.setSonuc}
              duzenleYukleniyor={metin.duzenleYukleniyor} setDuzenleYukleniyor={metin.setDuzenleYukleniyor}
              uretimId={metin.uretimId} yenidenUretHakki={metin.yenidenUretHakki} setYenidenUretHakki={metin.setYenidenUretHakki}
              kullanici={kullanici} paketModalAc={paketModalAc} icerikUret={metin.icerikUret}
            />

            {/* ===== GÖRSEL SEKMESİ ===== */}
            <GorselSekmesi
              aktif={anaSekme === "gorsel"}
              urunAdi={metin.urunAdi} kategori={metin.kategori}
              fotolar={fotolar} fotoSec={fotoSec} fotoKaldir={fotoKaldir}
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
              sosyalKitYukleniyor={sosyal.sosyalKitYukleniyor}
              sosyalKitSonuc={sosyal.sosyalKitSonuc} setSosyalKitSonuc={sosyal.setSosyalKitSonuc}
              sosyalKitAcik={sosyal.sosyalKitAcik} setSosyalKitAcik={sosyal.setSosyalKitAcik}
              sosyalFoto={sosyal.sosyalFoto} setSosyalFoto={sosyal.setSosyalFoto}
              sosyalGorselStil={sosyal.sosyalGorselStil} setSosyalGorselStil={sosyal.setSosyalGorselStil}
              sosyalGorselFormat={sosyal.sosyalGorselFormat} setSosyalGorselFormat={sosyal.setSosyalGorselFormat}
              sosyalGorselYukleniyor={sosyal.sosyalGorselYukleniyor}
              sosyalGorselSonuclar={sosyal.sosyalGorselSonuclar} setSosyalGorselSonuclar={sosyal.setSosyalGorselSonuclar}
              sosyalGorselPrompt={sosyal.sosyalGorselPrompt} setSosyalGorselPrompt={sosyal.setSosyalGorselPrompt}
              kullanici={kullanici} paketModalAc={paketModalAc}
              captionUret={sosyal.captionUret} kitUret={sosyal.kitUret} sosyalGorselUret={sosyal.sosyalGorselUret}
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
                  {/* UX-21: Geçmiş üretimler linki */}
                  {!kullanici.anonim && gecmis.length > 0 && (
                    <Link href="/hesap/uretimler" className="w-full flex items-center justify-between text-xs text-gray-500 hover:text-indigo-600 py-1.5 border border-gray-200 rounded-xl px-2 hover:border-indigo-300 transition-colors">
                      <span>📋 Geçmiş Üretimlerim ({gecmis.length})</span>
                      <span>→</span>
                    </Link>
                  )}
                </>
              ) : (
                <div className="space-y-2 py-1">
                  <p className="text-xs font-semibold text-gray-600">💡 Nasıl çalışır?</p>
                  <p className="text-xs text-gray-500 leading-relaxed">Platform seç → Ürünü anlat → İçeriğini al</p>
                  <p className="text-xs text-gray-400">Metin, görsel, video ve sosyal medya tek yerden.</p>
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
