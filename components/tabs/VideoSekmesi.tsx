"use client";
import Link from "next/link";
import { VIDEO_PRESETLER, kategoriKoduHesapla } from "@/lib/constants";
import FotoThumbnail from "@/components/ui/FotoThumbnail";

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
  return (
    <div style={{ display: aktif ? "block" : "none" }} className="mt-4 bg-white rounded-2xl shadow p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-800">🎬 Ürün Videosu Üret</h2>
        <span className="text-xs text-amber-500 font-medium">5sn: 10 kredi · 10sn: 20 kredi</span>
      </div>
      <p className="text-xs text-gray-400">Ürün fotoğrafından kısa tanıtım videosu — pazaryerleri, Reels, TikTok ve YouTube için</p>

      {urunAdi && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 flex items-center gap-2">
          <span className="text-amber-400 text-sm">🔗</span>
          <p className="text-xs text-amber-700 flex-1 min-w-0 truncate">
            <span className="font-medium">{urunAdi}</span>
            {kategori && <span className="text-amber-500"> · {kategori}</span>}
          </p>
          <span className="text-xs text-amber-400 whitespace-nowrap">Metin sekmesinden</span>
        </div>
      )}

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
        <span className="text-amber-500 flex-shrink-0 mt-0.5">⚡</span>
        <div>
          <p className="text-xs font-semibold text-amber-700">Kredi üretilince düşer</p>
          <p className="text-xs text-amber-600 mt-0.5">Video AI işlem gücü gerektiriyor. Üretim ~2 dakika sürer.</p>
        </div>
      </div>

      {!fotolar[0] ? (
        <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-4 text-center text-xs text-gray-400">
          Yukarıdan ürün fotoğrafı yükle ↑
        </div>
      ) : (
        <FotoThumbnail src={fotolar[0]} onKaldir={() => { setFotolar([]); setGorselJoblar([]); }} renk="green" />
      )}

      {/* Format seçimi */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-2">Video Formatı</label>
        <div className="grid grid-cols-2 gap-2">
          {([
            { id: "9:16", label: "📱 Dikey (9:16)", aciklama: "Instagram Reels · TikTok" },
            { id: "16:9", label: "🖥️ Yatay (16:9)", aciklama: "YouTube · Facebook · Pazaryeri" },
          ] as { id: "9:16" | "16:9"; label: string; aciklama: string }[]).map((f) => (
            <button key={f.id} onClick={() => setVideoFormat(f.id)}
              className={`p-3 rounded-xl border-2 text-left transition-all ${videoFormat === f.id ? "border-amber-400 bg-amber-50" : "border-gray-200 hover:border-gray-300"}`}>
              <p className={`text-xs font-semibold ${videoFormat === f.id ? "text-amber-700" : "text-gray-700"}`}>{f.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{f.aciklama}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Süre seçimi */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-2">Video Süresi</label>
        <div className="grid grid-cols-2 gap-2">
          {([
            { id: "5", label: "⚡ 5 Saniye", kredi: 10, aciklama: "Hızlı tanıtım · Reels ideal" },
            { id: "10", label: "🎞️ 10 Saniye", kredi: 20, aciklama: "Detaylı showcase · Pazaryeri" },
          ] as { id: "5" | "10"; label: string; kredi: number; aciklama: string }[]).map((s) => (
            <button key={s.id} onClick={() => setVideoSure(s.id)}
              className={`p-3 rounded-xl border-2 text-left transition-all ${videoSure === s.id ? "border-amber-400 bg-amber-50" : "border-gray-200 hover:border-gray-300"}`}>
              <div className="flex items-center justify-between mb-0.5">
                <p className={`text-xs font-semibold ${videoSure === s.id ? "text-amber-700" : "text-gray-700"}`}>{s.label}</p>
                <span className={`text-xs font-bold ${videoSure === s.id ? "text-amber-500" : "text-gray-400"}`}>{s.kredi} kredi</span>
              </div>
              <p className="text-xs text-gray-400">{s.aciklama}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Hareket tarifi */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Hareket & sahne tarifi <span className="text-gray-400 font-normal">(isteğe bağlı — Türkçe yazabilirsin)</span></label>
        {(() => {
          const seciliKategoriKodu = kategoriKoduHesapla(kategori);
          const gosterilecekler = seciliKategoriKodu
            ? VIDEO_PRESETLER.filter(p => p.kategoriler.includes(seciliKategoriKodu) || p.kategoriler.includes("tumu")).slice(0, 6)
            : VIDEO_PRESETLER.filter(p => p.kategoriler.includes("tumu"));
          return (
            <div className="grid grid-cols-2 gap-2 mb-2">
              {gosterilecekler.map((p) => (
                <button key={p.etiket} onClick={() => { setVideoPrompt(p.deger); setVideoPromptGoster(p.goster); }}
                  className={`text-left p-2.5 rounded-xl border-2 transition-all ${videoPrompt === p.deger ? "border-amber-400 bg-amber-50" : "border-gray-200 hover:border-amber-200 hover:bg-amber-50/50"}`}>
                  <p className={`text-xs font-semibold ${videoPrompt === p.deger ? "text-amber-700" : "text-gray-700"}`}>{p.ikon} {p.etiket}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5 leading-relaxed">{p.aciklama}</p>
                </button>
              ))}
            </div>
          );
        })()}
        <textarea value={videoPromptGoster} onChange={(e) => { setVideoPromptGoster(e.target.value); setVideoPrompt(e.target.value); }} placeholder="örn: Ürün yavaşça dönsün, dramatik ışıklandırma, siyah arka plan" rows={2} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
        <p className="text-xs text-gray-400 mt-1">Boş bırakırsan marka bilgine göre otomatik oluşturulur — genellikle iyi sonuç verir</p>
        <Link href="/blog/ai-urun-videosu-hareket-secenekleri" className="inline-block mt-2 text-xs text-amber-500 hover:text-amber-700 hover:underline">Bu hareketler ne anlama gelir? Ürün kategorine göre hangisi uygun? →</Link>
      </div>

      <button onClick={videoUret} disabled={videoYukleniyor || fotolar.length === 0 || (kullanici !== null && !kullanici.is_admin && (kullanici?.kredi ?? 0) < (videoSure === "10" ? 20 : 10))}
        className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 text-white font-semibold py-3 rounded-xl transition-all">
        {videoYukleniyor ? "⏳ Video üretiliyor... (~2 dakika)" : fotolar.length === 0 ? "Önce fotoğraf ekle ↑" : !kullanici ? "✨ Video Üret — Giriş Gerekli" : `✨ Video Üret — ${kullanici.is_admin ? "∞" : (videoSure === "10" ? 20 : 10)} kredi`}
      </button>

      {kullanici && !kullanici.is_admin && (kullanici.kredi ?? 0) < (videoSure === "10" ? 20 : 10) && !videoYukleniyor && (
        <p className="text-center text-xs text-red-500">En az {videoSure === "10" ? 20 : 10} kredi gerekli. <button onClick={() => paketModalAc()} className="underline font-medium">Kredi satın al →</button></p>
      )}

      {videoYukleniyor && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center space-y-2">
          <div className="flex justify-center"><div className="w-8 h-8 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin" /></div>
          <p className="text-sm font-medium text-amber-700">AI videonuzu üretiyor</p>
          <p className="text-xs text-amber-500">Sayfayı kapatmayın, yaklaşık 2 dakika sürer</p>
        </div>
      )}

      {videoRequestId && !videoYukleniyor && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-sm font-semibold text-gray-800">✅ Videonuz Hazır</span>
            <span className="text-xs text-gray-400">{videoFormat} · {videoSure} saniye</span>
          </div>
          <button
            onClick={async () => {
              const res = await fetch(`/api/sosyal/video/download?requestId=${videoRequestId}`);
              if (!res.ok) { alert("Video indirilemedi. Tekrar deneyin."); return; }
              blobIndir(await res.blob(), "urun-video.mp4");
            }}
            className="w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-900 text-white font-semibold py-3 rounded-xl text-sm transition-colors"
          >
            ⬇️ Videoyu İndir
          </button>
          <button onClick={() => { setVideoRequestId(null); setVideoPrompt(""); }} className="w-full text-xs text-gray-400 hover:text-gray-600 py-2 transition-colors">Yeni video üret</button>
        </div>
      )}
    </div>
  );
}
