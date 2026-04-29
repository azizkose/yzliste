"use client";
import { useState } from "react";
import Link from "next/link";
import { RotateCw, ZoomIn, Lightbulb, Leaf, Search, Sparkles, Gem, Cpu, Wind, Utensils, Sprout, Star, Gift, Zap, CheckCircle, Download, type LucideIcon } from "lucide-react";
import { VIDEO_PRESETLER, kategoriKoduHesapla } from "@/lib/constants";
import FotoThumbnail from "@/components/ui/FotoThumbnail";
import KrediButon from "@/components/ui/KrediButon";

const PRESET_ICON_MAP: Record<string, LucideIcon> = {
  RotateCw, ZoomIn, Lightbulb, Leaf, Search, Sparkles, Gem, Cpu, Wind, Utensils, Sprout, Star, Gift, Zap,
};

type Kullanici = {
  id: string;
  email: string | null;
  kredi: number;
  toplam_kullanilan: number;
  is_admin: boolean;
  anonim?: boolean;
};

interface VideoSekmesiProps {
  aktif: boolean;
  urunAdi: string;
  kategori: string;
  fotolar: string[];
  setFotolar: (v: string[]) => void;
  setGorselJoblar: (v: { requestId: string; label: string; stil: string }[]) => void;
  videoSure: "5" | "10";
  setVideoSure: (v: "5" | "10") => void;
  videoFormat: "9:16" | "16:9" | "1:1";
  setVideoFormat: (v: "9:16" | "16:9" | "1:1") => void;
  videoPrompt: string;
  setVideoPrompt: (v: string) => void;
  videoPromptGoster: string;
  setVideoPromptGoster: (v: string) => void;
  videoYukleniyor: boolean;
  videoRequestId: string | null;
  setVideoRequestId: (v: string | null) => void;
  kullanici: Kullanici | null;
  paketModalAc: () => void;
  videoUret: () => void;
  blobIndir: (blob: Blob, dosyaAdi: string) => void;
}

export default function VideoSekmesi({
  aktif,
  urunAdi, kategori,
  fotolar, setFotolar, setGorselJoblar,
  videoSure, setVideoSure,
  videoFormat, setVideoFormat,
  videoPrompt, setVideoPrompt,
  videoPromptGoster, setVideoPromptGoster,
  videoYukleniyor, videoRequestId, setVideoRequestId,
  kullanici, paketModalAc, videoUret, blobIndir,
}: VideoSekmesiProps) {
  const [indiriliyor, setIndiriliyor] = useState(false);

  return (
    <div style={{ display: aktif ? "block" : "none" }} className="mt-4 bg-white border border-rd-neutral-200 rounded-xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-medium text-rd-neutral-900">Ürün videosu</h2>
        <span className="text-xs text-rd-neutral-600 font-mono">5sn: 10 kredi · 10sn: 20 kredi</span>
      </div>
      <p className="text-xs text-rd-neutral-400">Ürün fotoğrafından kısa tanıtım videosu — pazaryerleri, Reels, TikTok ve YouTube için</p>

      {urunAdi && (
        <div className="bg-rd-warning-50 border border-rd-warning-700/20 rounded-lg px-3 py-2 flex items-center gap-2">
          <Zap size={14} strokeWidth={1.5} className="text-rd-warning-700 flex-shrink-0" />
          <p className="text-xs text-rd-warning-700 flex-1 min-w-0 truncate">
            <span className="font-medium">{urunAdi}</span>
            {kategori && <span className="text-rd-warning-700/60"> · {kategori}</span>}
          </p>
          <span className="text-xs text-rd-warning-700/60 whitespace-nowrap">Metin sekmesinden</span>
        </div>
      )}

      <div className="bg-rd-warning-50 rounded-lg p-3 flex items-start gap-2.5">
        <Zap size={16} strokeWidth={1.5} className="text-rd-warning-700 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-rd-warning-700/80">AI işlem ~2 dakika sürer</p>
      </div>

      {!fotolar[0] ? (
        <div className="bg-rd-neutral-100 rounded-lg p-6 text-center">
          <p className="text-sm text-rd-neutral-600">Video üretmek için önce ürün fotoğrafı ekle</p>
          <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-sm text-rd-primary-800 hover:text-rd-primary-900 font-medium mt-2 block mx-auto transition-colors">
            Fotoğraf ekle
          </button>
        </div>
      ) : (
        <FotoThumbnail src={fotolar[0]} onKaldir={() => { setFotolar([]); setGorselJoblar([]); }} renk="green" />
      )}

      {/* Format seçimi */}
      <div>
        <label className="block text-xs font-medium text-rd-neutral-600 mb-2">Video formatı</label>
        <div className="grid grid-cols-2 gap-2">
          {([
            { id: "9:16", label: "Dikey (9:16)", aciklama: "Instagram Reels · TikTok" },
            { id: "16:9", label: "Yatay (16:9)", aciklama: "YouTube · Facebook · Pazaryeri" },
          ] as { id: "9:16" | "16:9"; label: string; aciklama: string }[]).map((f) => (
            <button key={f.id} onClick={() => setVideoFormat(f.id)}
              className={`p-3 rounded-xl text-left transition-all ${videoFormat === f.id ? "border-2 border-rd-primary-800 bg-rd-primary-100" : "border border-rd-neutral-200 hover:border-rd-primary-800"}`}>
              <p className={`text-xs font-medium ${videoFormat === f.id ? "text-rd-primary-800" : "text-rd-neutral-900"}`}>{f.label}</p>
              <p className="text-xs text-rd-neutral-400 mt-0.5">{f.aciklama}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Süre seçimi */}
      <div>
        <label className="block text-xs font-medium text-rd-neutral-600 mb-2">Video süresi</label>
        <div className="grid grid-cols-2 gap-2">
          {([
            { id: "5", label: "5 saniye", aciklama: "Hızlı tanıtım · Reels ideal" },
            { id: "10", label: "10 saniye", aciklama: "Detaylı showcase · Pazaryeri" },
          ] as { id: "5" | "10"; label: string; aciklama: string }[]).map((s) => (
            <button key={s.id} onClick={() => setVideoSure(s.id)}
              className={`p-3 rounded-xl text-left transition-all ${videoSure === s.id ? "border-2 border-rd-primary-800 bg-rd-primary-100" : "border border-rd-neutral-200 hover:border-rd-primary-800"}`}>
              <p className={`text-xs font-medium mb-0.5 ${videoSure === s.id ? "text-rd-primary-800" : "text-rd-neutral-900"}`}>{s.label}</p>
              <p className="text-xs text-rd-neutral-400">{s.aciklama}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Hareket tarifi */}
      <div>
        <label className="block text-xs font-medium text-rd-neutral-600 mb-1">Hareket & sahne tarifi <span className="text-rd-neutral-400 font-normal">(isteğe bağlı — Türkçe yazabilirsin)</span></label>
        {(() => {
          const seciliKategoriKodu = kategoriKoduHesapla(kategori);
          const gosterilecekler = seciliKategoriKodu
            ? VIDEO_PRESETLER.filter(p => p.kategoriler.includes(seciliKategoriKodu) || p.kategoriler.includes("tumu")).slice(0, 6)
            : VIDEO_PRESETLER.filter(p => p.kategoriler.includes("tumu"));
          return (
            <div className="grid grid-cols-2 gap-2 mb-2">
              {gosterilecekler.map((p) => {
                const PresetIcon = PRESET_ICON_MAP[p.ikon];
                const secili = videoPrompt === p.deger;
                return (
                  <button key={p.etiket} onClick={() => {
                      if (secili) { setVideoPrompt(""); setVideoPromptGoster(""); }
                      else { setVideoPrompt(p.deger); setVideoPromptGoster(p.goster); }
                    }}
                    className={`text-left p-2.5 rounded-xl transition-all ${secili ? "border-2 border-rd-primary-800 bg-rd-neutral-100" : "border border-rd-neutral-200 hover:border-rd-primary-800"}`}>
                    <div className="flex items-center gap-1.5 mb-0.5">
                      {PresetIcon && <PresetIcon size={14} strokeWidth={1.5} className={secili ? "text-rd-primary-800" : "text-rd-neutral-600"} />}
                      <p className={`text-xs font-medium ${secili ? "text-rd-neutral-900" : "text-rd-neutral-600"}`}>{p.etiket}</p>
                    </div>
                    <p className="text-[10px] text-rd-neutral-400 leading-relaxed">{p.aciklama}</p>
                  </button>
                );
              })}
            </div>
          );
        })()}
        <textarea value={videoPromptGoster} onChange={(e) => { setVideoPromptGoster(e.target.value); setVideoPrompt(e.target.value); }} placeholder="örn: Ürün yavaşça dönsün, dramatik ışıklandırma, siyah arka plan" rows={2} className="w-full border border-rd-neutral-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rd-primary-800/20 focus:border-rd-primary-800" />
        <p className="text-xs text-rd-neutral-400 mt-1">Boş bırakırsan marka bilgine göre otomatik oluşturulur — genellikle iyi sonuç verir</p>
        <Link href="/blog/ai-urun-videosu-hareket-secenekleri" className="inline-block mt-2 text-xs text-rd-primary-800 hover:text-rd-primary-900 hover:underline">Bu hareketler ne anlama gelir? Ürün kategorine göre hangisi uygun?</Link>
      </div>

      <button
        type="button"
        onClick={videoUret}
        disabled={videoYukleniyor || fotolar.length === 0}
        className="w-full bg-rd-primary-800 hover:bg-rd-primary-900 disabled:bg-rd-neutral-200 disabled:text-rd-neutral-400 text-white font-medium py-3 rounded-lg transition-colors"
      >
        {videoYukleniyor ? "Video üretiliyor..." : "İçerik üret"}
      </button>

      {videoYukleniyor && (
        <div className="bg-rd-warning-50 border border-rd-warning-700/20 rounded-xl p-4 text-center space-y-2">
          <div className="flex justify-center"><div className="w-8 h-8 border-4 border-rd-warning-700/20 border-t-rd-warning-700 rounded-full animate-spin" /></div>
          <p className="text-sm font-medium text-rd-warning-700">AI videonuzu üretiyor</p>
          <p className="text-xs text-rd-warning-700/70">Sayfayı kapatmayın, yaklaşık 2 dakika sürer</p>
        </div>
      )}

      {videoRequestId && !videoYukleniyor && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-sm font-medium text-rd-neutral-900 flex items-center gap-1.5"><CheckCircle size={14} strokeWidth={1.5} className="text-rd-success-700" /> Video hazır</span>
            <span className="text-xs text-rd-neutral-400">{videoFormat} · {videoSure} saniye</span>
          </div>
          <button
            onClick={async () => {
              setIndiriliyor(true);
              try {
                const res = await fetch(`/api/sosyal/video/download?requestId=${videoRequestId}`);
                if (!res.ok) { alert("Video indirilemedi. Tekrar deneyin."); return; }
                blobIndir(await res.blob(), "urun-video.mp4");
              } finally {
                setIndiriliyor(false);
              }
            }}
            disabled={indiriliyor}
            className="w-full flex items-center justify-center gap-2 bg-rd-neutral-900 hover:bg-rd-neutral-900 disabled:bg-rd-neutral-200 text-white font-medium py-3 rounded-lg text-sm transition-colors"
          >
            {indiriliyor ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                İndiriliyor...
              </>
            ) : (
              <>
                <Download size={14} strokeWidth={1.5} /> Videoyu indir
              </>
            )}
          </button>
          <button onClick={() => { setVideoRequestId(null); setVideoPrompt(""); }} className="w-full text-xs text-rd-neutral-400 hover:text-rd-neutral-600 py-2 transition-colors">Yeni video üret</button>
        </div>
      )}
    </div>
  );
}
