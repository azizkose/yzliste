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
    <div style={{ display: aktif ? "block" : "none" }} className="mt-4 bg-white border border-[#D8D6CE] rounded-xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-medium text-[#1A1A17]">Ürün videosu</h2>
        <span className="text-xs text-[#5A5852] font-mono">5sn: 10 kr · 10sn: 20 kr</span>
      </div>
      <p className="text-xs text-[#908E86]">Ürün fotoğrafından kısa tanıtım videosu — pazaryerleri, Reels, TikTok ve YouTube için</p>

      {urunAdi && (
        <div className="bg-[#FEF4E7] border border-[#8B4513]/20 rounded-lg px-3 py-2 flex items-center gap-2">
          <Zap size={14} strokeWidth={1.5} className="text-[#8B4513] flex-shrink-0" />
          <p className="text-xs text-[#8B4513] flex-1 min-w-0 truncate">
            <span className="font-medium">{urunAdi}</span>
            {kategori && <span className="text-[#8B4513]/60"> · {kategori}</span>}
          </p>
          <span className="text-xs text-[#8B4513]/60 whitespace-nowrap">Metin sekmesinden</span>
        </div>
      )}

      <div className="bg-[#FEF4E7] rounded-lg p-3 flex items-start gap-2.5">
        <Zap size={16} strokeWidth={1.5} className="text-[#8B4513] flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-medium text-[#8B4513]">Kredi üretim anında düşer</p>
          <p className="text-xs text-[#8B4513]/80 mt-0.5">AI işlem ~2 dakika sürer</p>
        </div>
      </div>

      {!fotolar[0] ? (
        <div className="bg-[#F1F0EB] rounded-lg p-6 text-center">
          <p className="text-sm text-[#5A5852]">Video üretmek için önce ürün fotoğrafı ekle</p>
          <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-sm text-[#1E4DD8] hover:text-[#163B9E] font-medium mt-2 block mx-auto transition-colors">
            Fotoğraf ekle
          </button>
        </div>
      ) : (
        <FotoThumbnail src={fotolar[0]} onKaldir={() => { setFotolar([]); setGorselJoblar([]); }} renk="green" />
      )}

      {/* Format seçimi */}
      <div>
        <label className="block text-xs font-medium text-[#5A5852] mb-2">Video formatı</label>
        <div className="grid grid-cols-2 gap-2">
          {([
            { id: "9:16", label: "Dikey (9:16)", aciklama: "Instagram Reels · TikTok" },
            { id: "16:9", label: "Yatay (16:9)", aciklama: "YouTube · Facebook · Pazaryeri" },
          ] as { id: "9:16" | "16:9"; label: string; aciklama: string }[]).map((f) => (
            <button key={f.id} onClick={() => setVideoFormat(f.id)}
              className={`p-3 rounded-xl text-left transition-all ${videoFormat === f.id ? "border-2 border-[#1E4DD8] bg-[#EBF1FB]" : "border border-[#D8D6CE] hover:border-[#1E4DD8]"}`}>
              <p className={`text-xs font-medium ${videoFormat === f.id ? "text-[#1E4DD8]" : "text-[#1A1A17]"}`}>{f.label}</p>
              <p className="text-xs text-[#908E86] mt-0.5">{f.aciklama}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Süre seçimi */}
      <div>
        <label className="block text-xs font-medium text-[#5A5852] mb-2">Video süresi</label>
        <div className="grid grid-cols-2 gap-2">
          {([
            { id: "5", label: "5 saniye", kredi: 10, aciklama: "Hızlı tanıtım · Reels ideal" },
            { id: "10", label: "10 saniye", kredi: 20, aciklama: "Detaylı showcase · Pazaryeri" },
          ] as { id: "5" | "10"; label: string; kredi: number; aciklama: string }[]).map((s) => (
            <button key={s.id} onClick={() => setVideoSure(s.id)}
              className={`p-3 rounded-xl text-left transition-all ${videoSure === s.id ? "border-2 border-[#1E4DD8] bg-[#EBF1FB]" : "border border-[#D8D6CE] hover:border-[#1E4DD8]"}`}>
              <div className="flex items-center justify-between mb-0.5">
                <p className={`text-xs font-medium ${videoSure === s.id ? "text-[#1E4DD8]" : "text-[#1A1A17]"}`}>{s.label}</p>
                <span className={`text-xs font-medium ${videoSure === s.id ? "text-[#1E4DD8]" : "text-[#908E86]"}`}>{s.kredi} kredi</span>
              </div>
              <p className="text-xs text-[#908E86]">{s.aciklama}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Hareket tarifi */}
      <div>
        <label className="block text-xs font-medium text-[#5A5852] mb-1">Hareket & sahne tarifi <span className="text-[#908E86] font-normal">(isteğe bağlı — Türkçe yazabilirsin)</span></label>
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
                    className={`text-left p-2.5 rounded-xl transition-all ${secili ? "border-2 border-[#1E4DD8] bg-[#F1F0EB]" : "border border-[#D8D6CE] hover:border-[#1E4DD8]"}`}>
                    <div className="flex items-center gap-1.5 mb-0.5">
                      {PresetIcon && <PresetIcon size={14} strokeWidth={1.5} className={secili ? "text-[#1E4DD8]" : "text-[#5A5852]"} />}
                      <p className={`text-xs font-medium ${secili ? "text-[#1A1A17]" : "text-[#5A5852]"}`}>{p.etiket}</p>
                    </div>
                    <p className="text-[10px] text-[#908E86] leading-relaxed">{p.aciklama}</p>
                  </button>
                );
              })}
            </div>
          );
        })()}
        <textarea value={videoPromptGoster} onChange={(e) => { setVideoPromptGoster(e.target.value); setVideoPrompt(e.target.value); }} placeholder="örn: Ürün yavaşça dönsün, dramatik ışıklandırma, siyah arka plan" rows={2} className="w-full border border-[#D8D6CE] rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E4DD8]/20 focus:border-[#1E4DD8]" />
        <p className="text-xs text-[#908E86] mt-1">Boş bırakırsan marka bilgine göre otomatik oluşturulur — genellikle iyi sonuç verir</p>
        <Link href="/blog/ai-urun-videosu-hareket-secenekleri" className="inline-block mt-2 text-xs text-[#1E4DD8] hover:text-[#163B9E] hover:underline">Bu hareketler ne anlama gelir? Ürün kategorine göre hangisi uygun?</Link>
      </div>

      {!kullanici ? (
        <button disabled className="w-full bg-[#D8D6CE] text-[#908E86] font-medium py-3 rounded-lg">
          Video üret — giriş gerekli
        </button>
      ) : fotolar.length === 0 ? (
        <button disabled className="w-full bg-[#D8D6CE] text-[#908E86] font-medium py-3 rounded-lg">
          Önce fotoğraf ekle
        </button>
      ) : (
        <KrediButon
          label="Video üret"
          kredi={kullanici.is_admin ? undefined : (videoSure === "10" ? 20 : 10)}
          kalanKredi={kullanici.is_admin ? undefined : kullanici.kredi}
          onClick={videoUret}
          disabled={videoYukleniyor || (!kullanici.is_admin && (kullanici.kredi ?? 0) < (videoSure === "10" ? 20 : 10))}
          yukleniyor={videoYukleniyor}
          yukleniyorLabel="Video üretiliyor..."
          renk="primary"
        />
      )}

      {kullanici && !kullanici.is_admin && (kullanici.kredi ?? 0) < (videoSure === "10" ? 20 : 10) && !videoYukleniyor && (
        <p className="text-center text-xs text-[#7A1E1E]">En az {videoSure === "10" ? 20 : 10} kredi gerekli. <button onClick={() => paketModalAc()} className="underline font-medium">Kredi satın al</button></p>
      )}

      {videoYukleniyor && (
        <div className="bg-[#FEF4E7] border border-[#8B4513]/20 rounded-xl p-4 text-center space-y-2">
          <div className="flex justify-center"><div className="w-8 h-8 border-4 border-[#8B4513]/20 border-t-[#8B4513] rounded-full animate-spin" /></div>
          <p className="text-sm font-medium text-[#8B4513]">AI videonuzu üretiyor</p>
          <p className="text-xs text-[#8B4513]/70">Sayfayı kapatmayın, yaklaşık 2 dakika sürer</p>
        </div>
      )}

      {videoRequestId && !videoYukleniyor && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-sm font-medium text-[#1A1A17] flex items-center gap-1.5"><CheckCircle size={14} strokeWidth={1.5} className="text-[#0F5132]" /> Video hazır</span>
            <span className="text-xs text-[#908E86]">{videoFormat} · {videoSure} saniye</span>
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
            className="w-full flex items-center justify-center gap-2 bg-[#1A1A17] hover:bg-[#0E0E0C] disabled:bg-[#D8D6CE] text-white font-medium py-3 rounded-lg text-sm transition-colors"
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
          <button onClick={() => { setVideoRequestId(null); setVideoPrompt(""); }} className="w-full text-xs text-[#908E86] hover:text-[#5A5852] py-2 transition-colors">Yeni video üret</button>
        </div>
      )}
    </div>
  );
}
