"use client";
import { useState } from "react";
import FotoEkleAlani from "@/components/ui/FotoEkleAlani";
import FotoThumbnail from "@/components/ui/FotoThumbnail";
type SosyalPlatform = "instagram" | "tiktok" | "facebook" | "twitter";
type SosyalTon = "tanitim" | "indirim" | "hikaye";

type Kullanici = {
  id: string;
  email: string | null;
  kredi: number;
  toplam_kullanilan: number;
  is_admin: boolean;
  anonim?: boolean;
};

interface SosyalSekmesiProps {
  aktif: boolean;
  sosyalUretimModu: "sade" | "gorsel-ile";
  setSosyalUretimModu: (v: "sade" | "gorsel-ile") => void;
  sosyalPlatform: SosyalPlatform;
  setSosyalPlatform: (v: SosyalPlatform) => void;
  sosyalTon: SosyalTon;
  setSosyalTon: (v: SosyalTon) => void;
  sosyalSezon: string;
  setSosyalSezon: (v: string) => void;
  sosyalUrunAdi: string;
  setSosyalUrunAdi: (v: string) => void;
  sosyalEkBilgi: string;
  setSosyalEkBilgi: (v: string) => void;
  captionYukleniyor: boolean;
  sosyalCaption: string;
  setSosyalCaption: (v: string) => void;
  sosyalHashtag: string;
  setSosyalHashtag: (v: string) => void;
  sosyalFoto: string | null;
  setSosyalFoto: (v: string | null) => void;
  sosyalGorselStil: string;
  setSosyalGorselStil: (v: string) => void;
  sosyalGorselFormat: "1:1" | "9:16" | "16:9";
  setSosyalGorselFormat: (v: "1:1" | "9:16" | "16:9") => void;
  sosyalGorselYukleniyor: boolean;
  sosyalGorselSonuclar: { stil: string; label: string; gorseller: string[] }[];
  setSosyalGorselSonuclar: (v: { stil: string; label: string; gorseller: string[] }[]) => void;
  sosyalGorselPrompt: string;
  setSosyalGorselPrompt: (v: string) => void;
  kullanici: Kullanici | null;
  paketModalAc: () => void;
  captionUret: () => void;
  sosyalGorselUret: () => void;
  setAnaSekme: (v: "video") => void;
}

export default function SosyalSekmesi({
  aktif,
  sosyalUretimModu, setSosyalUretimModu,
  sosyalPlatform, setSosyalPlatform,
  sosyalTon, setSosyalTon,
  sosyalSezon, setSosyalSezon,
  sosyalUrunAdi, setSosyalUrunAdi,
  sosyalEkBilgi, setSosyalEkBilgi,
  captionYukleniyor,
  sosyalCaption, setSosyalCaption,
  sosyalHashtag, setSosyalHashtag,
  sosyalFoto, setSosyalFoto,
  sosyalGorselStil, setSosyalGorselStil,
  sosyalGorselFormat, setSosyalGorselFormat,
  sosyalGorselYukleniyor,
  sosyalGorselSonuclar, setSosyalGorselSonuclar,
  sosyalGorselPrompt, setSosyalGorselPrompt,
  kullanici, paketModalAc,
  captionUret, sosyalGorselUret, setAnaSekme,
}: SosyalSekmesiProps) {
  const [gelismisAcik, setGelismisAcik] = useState(false);

  return (
    <div style={{ display: aktif ? "block" : "none" }} className="mt-4 space-y-4">

      {/* Video linki */}
      <div className="bg-rd-neutral-100 border border-rd-neutral-200 rounded-xl p-3 flex items-center justify-between gap-3">
        <p className="text-xs text-rd-neutral-600">Sosyal medya videosu üretmek için <span className="font-medium text-rd-neutral-900">Video sekmesini</span> kullan — Reels, TikTok ve Stories formatları destekleniyor.</p>
        <button onClick={() => setAnaSekme("video")} className="text-xs bg-rd-primary-800 hover:bg-rd-primary-900 text-white font-medium px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap">Video sekmesi →</button>
      </div>

      <div className="bg-white rounded-xl border border-rd-neutral-200 p-6 space-y-4">
        <h2 className="text-base font-medium text-rd-neutral-900">Sosyal medya içeriği üret</h2>

        {/* Platform seçimi — sosyal platformlar */}
        <div>
          <label className="block text-xs font-medium text-rd-neutral-600 mb-2">Platform</label>
          <div className="flex gap-2 flex-wrap">
            {([
              { id: "instagram", label: "Instagram" },
              { id: "tiktok", label: "TikTok" },
              { id: "facebook", label: "Facebook" },
              { id: "twitter", label: "Twitter/X" },
            ] as { id: SosyalPlatform; label: string }[]).map((p) => (
              <button key={p.id} onClick={() => setSosyalPlatform(p.id)}
                className={`flex-1 py-2 px-2 rounded-xl border-2 text-xs font-medium transition-all ${sosyalPlatform === p.id ? "border-rd-primary-800 bg-rd-neutral-100 text-rd-neutral-900" : "border-rd-neutral-200 text-rd-neutral-600 hover:border-rd-primary-800"}`}>
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Form — her zaman görünür */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-rd-neutral-900 mb-1">Ürün adı <span className="text-rd-danger-600">*</span></label>
            <input type="text" value={sosyalUrunAdi} onChange={(e) => setSosyalUrunAdi(e.target.value)} placeholder="örn: Bakır Cezve Set, Kadın Deri Çanta" className="w-full border border-rd-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rd-primary-800/30" />
          </div>

          <div>
            <label className="block text-sm font-medium text-rd-neutral-900 mb-1">Ek bilgi <span className="text-rd-neutral-400 font-normal">(isteğe bağlı)</span></label>
            <textarea value={sosyalEkBilgi} onChange={(e) => setSosyalEkBilgi(e.target.value)} placeholder="örn: %20 indirimde, yeni sezon, el yapımı, hediye seçeneği" rows={2} className="w-full border border-rd-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rd-primary-800/30" />
          </div>

          <button type="button" onClick={() => setGelismisAcik(v => !v)}
            className="flex items-center gap-1.5 text-xs text-rd-neutral-600 hover:text-rd-neutral-900 transition-colors cursor-pointer">
            <span>{gelismisAcik ? "▾" : "▸"}</span>
            <span>Daha fazla seçenek</span>
            {!gelismisAcik && (sosyalTon !== "tanitim" || sosyalSezon !== "normal") && (
              <span className="text-rd-success-700 font-medium">• değiştirildi</span>
            )}
          </button>

          {gelismisAcik && (
            <div className="space-y-4 pl-1 border-l-2 border-rd-neutral-200">
              <div>
                <label className="block text-sm font-medium text-rd-neutral-900 mb-2">Ton</label>
                <div className="grid grid-cols-3 gap-2">
                  {([
                    { id: "tanitim", label: "Tanıtım", aciklama: "Ürünü öne çıkar" },
                    { id: "indirim", label: "İndirim", aciklama: "Fırsatı vurgula" },
                    { id: "hikaye", label: "Hikaye", aciklama: "Duygu bağı kur" },
                  ] as { id: SosyalTon; label: string; aciklama: string }[]).map((t) => (
                    <button key={t.id} onClick={() => setSosyalTon(t.id)}
                      className={`p-3 rounded-xl border-2 text-left transition-all ${sosyalTon === t.id ? "border-rd-primary-800 bg-rd-neutral-100" : "border-rd-neutral-200 hover:border-rd-primary-800"}`}>
                      <p className={`text-xs font-medium ${sosyalTon === t.id ? "text-rd-neutral-900" : "text-rd-neutral-600"}`}>{t.label}</p>
                      <p className="text-xs text-rd-neutral-400 mt-0.5">{t.aciklama}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-rd-neutral-900 mb-2">Sezon / Etkinlik</label>
                <select value={sosyalSezon} onChange={(e) => setSosyalSezon(e.target.value)}
                  className="w-full border border-rd-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rd-primary-800/30 bg-white">
                  <option value="normal">Normal (sezon yok)</option>
                  <option value="anneler_gunu">Anneler Günü</option>
                  <option value="babalar_gunu">Babalar Günü</option>
                  <option value="bayram">Bayram</option>
                  <option value="yilbasi">Yılbaşı</option>
                  <option value="black_friday">Black Friday</option>
                  <option value="sevgililer_gunu">Sevgililer Günü</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* İki üretim butonu */}
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => { setSosyalUretimModu("sade"); captionUret(); }}
            disabled={captionYukleniyor || !sosyalUrunAdi.trim()}
            className="w-full border-2 border-rd-primary-800 bg-white hover:bg-rd-primary-50 disabled:border-rd-neutral-200 disabled:bg-rd-neutral-50 disabled:text-rd-neutral-400 text-rd-primary-800 font-medium py-3 px-4 rounded-xl transition-colors text-left"
          >
            <p className="text-sm font-medium leading-snug">Sadece metin</p>
            <p className="text-xs text-rd-neutral-500 mt-0.5">Caption + hashtag · 1 kredi/platform</p>
          </button>
          <button
            type="button"
            onClick={() => setSosyalUretimModu("gorsel-ile")}
            disabled={captionYukleniyor}
            className={`w-full border-2 disabled:border-rd-neutral-200 disabled:bg-rd-neutral-50 disabled:text-rd-neutral-400 font-medium py-3 px-4 rounded-xl transition-colors text-left ${sosyalUretimModu === "gorsel-ile" ? "border-rd-primary-800 bg-rd-primary-50 text-rd-primary-800" : "border-rd-neutral-200 bg-white hover:border-rd-primary-800 text-rd-neutral-700"}`}
          >
            <p className="text-sm font-medium leading-snug">Metin + Görsel</p>
            <p className="text-xs text-rd-neutral-500 mt-0.5">+1 kredi görsel için</p>
          </button>
        </div>

        {/* Görsel upload — sadece gorsel-ile modunda */}
        {sosyalUretimModu === "gorsel-ile" && (
          <div className="space-y-4 border-t border-rd-neutral-200 pt-4">
            <p className="text-xs text-rd-neutral-600">Ürün fotoğrafından seçtiğin platform boyutunda görsel üretilir.</p>

            {!sosyalFoto ? (
              <FotoEkleAlani id="sosyal-gorsel-foto-input" onChange={(e) => { const f = e.target.files?.[0]; if (f) { const r = new FileReader(); r.onload = () => setSosyalFoto(r.result as string); r.readAsDataURL(f); } }} renk="pink" metin="Ürün fotoğrafı yükle" altMetin="Temiz arka planlı fotoğraf en iyi sonucu verir" />
            ) : (
              <FotoThumbnail src={sosyalFoto} onKaldir={() => { setSosyalFoto(null); setSosyalGorselSonuclar([]); }} renk="green" />
            )}

            {/* Platform boyut rehberi */}
            <div className="rounded-xl border border-rd-neutral-200 bg-rd-neutral-100 p-3 text-xs space-y-1">
              <p className="font-medium text-rd-neutral-900">Önerilen boyutlar</p>
              {sosyalPlatform === "instagram" && (
                <div className="grid grid-cols-2 gap-2 text-rd-neutral-600 mt-1">
                  <div className="bg-white rounded-lg p-2 text-center border border-rd-neutral-200">
                    <p className="font-medium text-rd-primary-800">1:1</p>
                    <p>Feed Post</p>
                    <p className="text-rd-neutral-400">1080×1080</p>
                  </div>
                  <div className="bg-white rounded-lg p-2 text-center border border-rd-neutral-200">
                    <p className="font-medium text-rd-primary-800">9:16</p>
                    <p>Story / Reels</p>
                    <p className="text-rd-neutral-400">1080×1920</p>
                  </div>
                </div>
              )}
              {sosyalPlatform === "tiktok" && (
                <div className="grid grid-cols-2 gap-2 text-rd-neutral-600 mt-1">
                  <div className="bg-white rounded-lg p-2 text-center border border-rd-neutral-200">
                    <p className="font-medium text-rd-primary-800">9:16</p>
                    <p>Dikey Video</p>
                    <p className="text-rd-neutral-400">1080×1920</p>
                  </div>
                  <div className="bg-white rounded-lg p-2 text-center border border-rd-neutral-200">
                    <p className="font-medium text-rd-primary-800">1:1</p>
                    <p>Kare</p>
                    <p className="text-rd-neutral-400">1080×1080</p>
                  </div>
                </div>
              )}
              {sosyalPlatform === "facebook" && (
                <div className="grid grid-cols-2 gap-2 text-rd-neutral-600 mt-1">
                  <div className="bg-white rounded-lg p-2 text-center border border-rd-neutral-200">
                    <p className="font-medium text-rd-primary-800">1:1</p>
                    <p>Post / Reklam</p>
                    <p className="text-rd-neutral-400">1200×1200</p>
                  </div>
                  <div className="bg-white rounded-lg p-2 text-center border border-rd-neutral-200">
                    <p className="font-medium text-rd-primary-800">16:9</p>
                    <p>Link / Banner</p>
                    <p className="text-rd-neutral-400">1200×628</p>
                  </div>
                </div>
              )}
              {sosyalPlatform === "twitter" && (
                <div className="grid grid-cols-2 gap-2 text-rd-neutral-600 mt-1">
                  <div className="bg-white rounded-lg p-2 text-center border border-rd-neutral-200">
                    <p className="font-medium text-rd-primary-800">16:9</p>
                    <p>Tweet Görseli</p>
                    <p className="text-rd-neutral-400">1200×675</p>
                  </div>
                  <div className="bg-white rounded-lg p-2 text-center border border-rd-neutral-200">
                    <p className="font-medium text-rd-primary-800">1:1</p>
                    <p>Kare Görsel</p>
                    <p className="text-rd-neutral-400">1080×1080</p>
                  </div>
                </div>
              )}
            </div>

            {/* Boyut seçimi */}
            <div>
              <label className="block text-xs font-medium text-rd-neutral-600 mb-2">Görsel boyutu</label>
              <div className="grid grid-cols-3 gap-2">
                {([
                  { id: "1:1", label: "1:1", aciklama: "Feed / Post" },
                  { id: "9:16", label: "9:16", aciklama: "Story / Reels" },
                  { id: "16:9", label: "16:9", aciklama: "Banner / YouTube" },
                ] as { id: "1:1" | "9:16" | "16:9"; label: string; aciklama: string }[]).map((b) => (
                  <button key={b.id} onClick={() => setSosyalGorselFormat(b.id)}
                    className={`p-2.5 rounded-xl border-2 text-center transition-all ${sosyalGorselFormat === b.id ? "border-rd-primary-800 bg-rd-neutral-100" : "border-rd-neutral-200 hover:border-rd-primary-800"}`}>
                    <p className={`text-sm font-medium ${sosyalGorselFormat === b.id ? "text-rd-neutral-900" : "text-rd-neutral-600"}`}>{b.label}</p>
                    <p className="text-xs text-rd-neutral-400 mt-0.5">{b.aciklama}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Stil seçimi */}
            <div>
              <label className="block text-xs font-medium text-rd-neutral-600 mb-2">Arka plan stili</label>
              <div className="grid grid-cols-4 gap-2">
                {([
                  { id: "beyaz", label: "Beyaz" },
                  { id: "koyu", label: "Koyu" },
                  { id: "lifestyle", label: "Lifestyle" },
                  { id: "mermer", label: "Mermer" },
                  { id: "ahsap", label: "Ahşap" },
                  { id: "gradient", label: "Gradient" },
                  { id: "dogal", label: "Doğal" },
                ]).map((s) => (
                  <button key={s.id} onClick={() => setSosyalGorselStil(s.id)}
                    className={`py-2 px-1 rounded-xl border-2 text-xs font-medium transition-all ${sosyalGorselStil === s.id ? "border-rd-primary-800 bg-rd-neutral-100 text-rd-neutral-900" : "border-rd-neutral-200 text-rd-neutral-600 hover:border-rd-primary-800"}`}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-rd-neutral-600 font-medium block mb-1">Sahne açıklaması (isteğe bağlı)</label>
              <textarea
                value={sosyalGorselPrompt}
                onChange={(e) => setSosyalGorselPrompt(e.target.value)}
                placeholder="örn: Mermerli masada sofistike ışıklandırma, minimalist Japandi dekor..."
                className="w-full border border-rd-neutral-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rd-primary-800/30 resize-none"
                rows={2}
              />
            </div>

            <button
              type="button"
              onClick={sosyalGorselUret}
              disabled={sosyalGorselYukleniyor || !sosyalFoto || !sosyalUrunAdi.trim()}
              className="w-full bg-rd-primary-800 hover:bg-rd-primary-900 disabled:bg-rd-neutral-200 disabled:text-rd-neutral-400 text-white font-medium py-3 rounded-xl transition-colors"
            >
              {sosyalGorselYukleniyor ? "Görsel üretiliyor..." : "Metin + görsel üret"}
            </button>

            {sosyalGorselYukleniyor && (
              <div className="bg-rd-neutral-100 border border-rd-neutral-200 rounded-xl p-4 text-center space-y-2">
                <div className="flex justify-center"><div className="w-8 h-8 border-4 border-rd-neutral-200 border-t-rd-primary-800 rounded-full animate-spin" /></div>
                <p className="text-sm font-medium text-rd-neutral-900">Görsel üretiliyor...</p>
                <p className="text-xs text-rd-neutral-600">Bu birkaç saniye sürebilir</p>
              </div>
            )}

            {sosyalGorselSonuclar.length > 0 && !sosyalGorselYukleniyor && (
              <div className="space-y-3">
                <p className="text-sm font-medium text-rd-neutral-900 px-1">Görseller hazır — {sosyalGorselFormat} · {sosyalGorselStil}</p>
                {sosyalGorselSonuclar.map((stil) => (
                  <div key={stil.stil} className="grid grid-cols-2 gap-2">
                    {stil.gorseller.map((url, i) => (
                      <div key={i} className="relative group rounded-xl overflow-hidden border border-rd-neutral-200">
                        <img src={url} alt={`${stil.label} ${i + 1}`} className="w-full object-cover" />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <a href={url} download target="_blank" rel="noopener noreferrer" className="bg-white text-rd-neutral-900 text-xs font-medium px-3 py-1.5 rounded-lg border border-rd-neutral-200">İndir</a>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
                <button onClick={() => { setSosyalGorselSonuclar([]); setSosyalFoto(null); }} className="w-full text-xs text-rd-neutral-400 hover:text-rd-neutral-600 py-2 transition-colors">Yeni görsel üret</button>
              </div>
            )}
          </div>
        )}

        {/* Caption/hashtag sonuçları */}
        {(sosyalCaption || sosyalHashtag) && (
          <div className="space-y-3 border-t border-rd-neutral-200 pt-4">
            {sosyalCaption && (
              <div className="bg-rd-neutral-50 rounded-xl p-5 border-l-4 border-l-rd-primary-800 border border-rd-neutral-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-rd-neutral-900">Paylaşım metni</span>
                  <button onClick={() => navigator.clipboard.writeText(sosyalCaption)} className="text-xs font-medium px-3 py-1.5 rounded-lg bg-white text-rd-neutral-600 hover:bg-rd-neutral-100 hover:text-rd-neutral-900 transition-all border border-rd-neutral-200">Kopyala</button>
                </div>
                <p className="text-sm text-rd-neutral-600 leading-relaxed whitespace-pre-line">{sosyalCaption}</p>
              </div>
            )}
            {sosyalHashtag && (
              <div className="bg-rd-neutral-50 rounded-xl p-5 border-l-4 border-l-rd-primary-800 border border-rd-neutral-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-rd-neutral-900"># Hashtagler</span>
                  <button onClick={() => navigator.clipboard.writeText(sosyalHashtag)} className="text-xs font-medium px-3 py-1.5 rounded-lg bg-white text-rd-neutral-600 hover:bg-rd-neutral-100 hover:text-rd-neutral-900 transition-all border border-rd-neutral-200">Kopyala</button>
                </div>
                <p className="text-sm text-rd-primary-800 leading-relaxed">{sosyalHashtag}</p>
              </div>
            )}
            <button onClick={() => { setSosyalCaption(""); setSosyalHashtag(""); }} className="w-full text-xs text-rd-neutral-400 hover:text-rd-neutral-600 py-2 transition-colors">Yeni metin üret</button>
          </div>
        )}
      </div>
    </div>
  );
}
