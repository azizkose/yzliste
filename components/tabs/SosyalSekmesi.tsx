"use client";
import { useState } from "react";
import FotoEkleAlani from "@/components/ui/FotoEkleAlani";
import FotoThumbnail from "@/components/ui/FotoThumbnail";
import KrediButon from "@/components/ui/KrediButon";

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
  sosyalIcerikTipi: "metin" | "gorsel";
  setSosyalIcerikTipi: (v: "metin" | "gorsel") => void;
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
  sosyalKitYukleniyor: boolean;
  sosyalKitSonuc: Record<string, { caption: string; hashtag: string }> | null;
  setSosyalKitSonuc: (v: null) => void;
  sosyalKitAcik: string | null;
  setSosyalKitAcik: (v: string | null) => void;
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
  kitUret: () => void;
  sosyalGorselUret: () => void;
  setAnaSekme: (v: "video") => void;
}

export default function SosyalSekmesi({
  aktif,
  sosyalIcerikTipi, setSosyalIcerikTipi,
  sosyalPlatform, setSosyalPlatform,
  sosyalTon, setSosyalTon,
  sosyalSezon, setSosyalSezon,
  sosyalUrunAdi, setSosyalUrunAdi,
  sosyalEkBilgi, setSosyalEkBilgi,
  captionYukleniyor,
  sosyalCaption, setSosyalCaption,
  sosyalHashtag, setSosyalHashtag,
  sosyalKitYukleniyor,
  sosyalKitSonuc, setSosyalKitSonuc,
  sosyalKitAcik, setSosyalKitAcik,
  sosyalFoto, setSosyalFoto,
  sosyalGorselStil, setSosyalGorselStil,
  sosyalGorselFormat, setSosyalGorselFormat,
  sosyalGorselYukleniyor,
  sosyalGorselSonuclar, setSosyalGorselSonuclar,
  sosyalGorselPrompt, setSosyalGorselPrompt,
  kullanici, paketModalAc,
  captionUret, kitUret, sosyalGorselUret, setAnaSekme,
}: SosyalSekmesiProps) {
  const [gelismisAcik, setGelismisAcik] = useState(false);

  return (
    <div style={{ display: aktif ? "block" : "none" }} className="mt-4 space-y-4">

      {/* Video linki */}
      <div className="bg-[#F1F0EB] border border-[#D8D6CE] rounded-xl p-3 flex items-center justify-between gap-3">
        <p className="text-xs text-[#5A5852]">Sosyal medya videosu üretmek için <span className="font-medium text-[#1A1A17]">Video sekmesini</span> kullan — Reels, TikTok ve Stories formatları destekleniyor.</p>
        <button onClick={() => setAnaSekme("video")} className="text-xs bg-[#1E4DD8] hover:bg-[#163B9E] text-white font-medium px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap">Video sekmesi →</button>
      </div>

      {/* İçerik tipi: Metin / Görsel */}
      <div className="bg-white rounded-xl border border-[#D8D6CE] p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-medium text-[#1A1A17]">Sosyal medya içeriği üret</h2>
          <span className="text-xs text-[#5A5852] font-mono">1 kredi</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => setSosyalIcerikTipi("metin")}
            className={`py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${sosyalIcerikTipi === "metin" ? "border-[#1E4DD8] bg-[#F1F0EB] text-[#1A1A17]" : "border-[#D8D6CE] text-[#5A5852] hover:border-[#1E4DD8]"}`}>
            Caption + hashtag
          </button>
          <button onClick={() => setSosyalIcerikTipi("gorsel")}
            className={`py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${sosyalIcerikTipi === "gorsel" ? "border-[#1E4DD8] bg-[#F1F0EB] text-[#1A1A17]" : "border-[#D8D6CE] text-[#5A5852] hover:border-[#1E4DD8]"}`}>
            Ürün görseli
          </button>
        </div>

        {/* Platform seçimi */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-2">Platform</label>
          <div className="flex gap-2 flex-wrap">
            {([
              { id: "instagram", label: "Instagram" },
              { id: "tiktok", label: "TikTok" },
              { id: "facebook", label: "Facebook" },
              { id: "twitter", label: "Twitter/X" },
            ] as { id: SosyalPlatform; label: string }[]).map((p) => (
              <button key={p.id} onClick={() => setSosyalPlatform(p.id)}
                className={`flex-1 py-2 px-2 rounded-xl border-2 text-xs font-medium transition-all ${sosyalPlatform === p.id ? "border-[#1E4DD8] bg-[#F1F0EB] text-[#1A1A17]" : "border-[#D8D6CE] text-[#5A5852] hover:border-[#1E4DD8]"}`}>
                {p.label}
              </button>
            ))}
          </div>

          {/* Platform boyut rehberi */}
          {sosyalIcerikTipi === "gorsel" && (
            <div className="mt-2 rounded-xl border border-[#D8D6CE] bg-[#F1F0EB] p-3 text-xs space-y-1">
              <p className="font-medium text-[#1A1A17]">Önerilen boyutlar</p>
              {sosyalPlatform === "instagram" && (
                <div className="grid grid-cols-2 gap-2 text-[#5A5852] mt-1">
                  <div className="bg-white rounded-lg p-2 text-center border border-[#D8D6CE]">
                    <p className="font-medium text-[#1E4DD8]">1:1</p>
                    <p>Feed Post</p>
                    <p className="text-[#908E86]">1080×1080</p>
                  </div>
                  <div className="bg-white rounded-lg p-2 text-center border border-[#D8D6CE]">
                    <p className="font-medium text-[#1E4DD8]">9:16</p>
                    <p>Story / Reels</p>
                    <p className="text-[#908E86]">1080×1920</p>
                  </div>
                </div>
              )}
              {sosyalPlatform === "tiktok" && (
                <div className="grid grid-cols-2 gap-2 text-[#5A5852] mt-1">
                  <div className="bg-white rounded-lg p-2 text-center border border-[#D8D6CE]">
                    <p className="font-medium text-[#1E4DD8]">9:16</p>
                    <p>Dikey Video</p>
                    <p className="text-[#908E86]">1080×1920</p>
                  </div>
                  <div className="bg-white rounded-lg p-2 text-center border border-[#D8D6CE]">
                    <p className="font-medium text-[#1E4DD8]">1:1</p>
                    <p>Kare</p>
                    <p className="text-[#908E86]">1080×1080</p>
                  </div>
                </div>
              )}
              {sosyalPlatform === "facebook" && (
                <div className="grid grid-cols-2 gap-2 text-[#5A5852] mt-1">
                  <div className="bg-white rounded-lg p-2 text-center border border-[#D8D6CE]">
                    <p className="font-medium text-[#1E4DD8]">1:1</p>
                    <p>Post / Reklam</p>
                    <p className="text-[#908E86]">1200×1200</p>
                  </div>
                  <div className="bg-white rounded-lg p-2 text-center border border-[#D8D6CE]">
                    <p className="font-medium text-[#1E4DD8]">16:9</p>
                    <p>Link / Banner</p>
                    <p className="text-[#908E86]">1200×628</p>
                  </div>
                </div>
              )}
              {sosyalPlatform === "twitter" && (
                <div className="grid grid-cols-2 gap-2 text-[#5A5852] mt-1">
                  <div className="bg-white rounded-lg p-2 text-center border border-[#D8D6CE]">
                    <p className="font-medium text-[#1E4DD8]">16:9</p>
                    <p>Tweet Görseli</p>
                    <p className="text-[#908E86]">1200×675</p>
                  </div>
                  <div className="bg-white rounded-lg p-2 text-center border border-[#D8D6CE]">
                    <p className="font-medium text-[#1E4DD8]">1:1</p>
                    <p>Kare Görsel</p>
                    <p className="text-[#908E86]">1080×1080</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* METIN İÇERİĞİ */}
        {sosyalIcerikTipi === "metin" && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ürün Adı <span className="text-red-400">*</span></label>
              <input type="text" value={sosyalUrunAdi} onChange={(e) => setSosyalUrunAdi(e.target.value)} placeholder="örn: Bakır Cezve Set, Kadın Deri Çanta" className="w-full border border-[#D8D6CE] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E4DD8]/30" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ek Bilgi <span className="text-gray-400 font-normal">(isteğe bağlı)</span></label>
              <textarea value={sosyalEkBilgi} onChange={(e) => setSosyalEkBilgi(e.target.value)} placeholder="örn: %20 indirimde, yeni sezon, el yapımı, hediye seçeneği" rows={2} className="w-full border border-[#D8D6CE] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E4DD8]/30" />
            </div>

            <button type="button" onClick={() => setGelismisAcik(v => !v)}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors cursor-pointer">
              <span>{gelismisAcik ? "▾" : "▸"}</span>
              <span>Daha fazla seçenek</span>
              {!gelismisAcik && (sosyalTon !== "tanitim" || sosyalSezon !== "normal") && (
                <span className="text-emerald-500 font-medium">• değiştirildi</span>
              )}
            </button>

            {gelismisAcik && (
              <div className="space-y-4 pl-1 border-l-2 border-gray-100">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ton</label>
                  <div className="grid grid-cols-3 gap-2">
                    {([
                      { id: "tanitim", label: "Tanıtım", aciklama: "Ürünü öne çıkar" },
                      { id: "indirim", label: "İndirim", aciklama: "Fırsatı vurgula" },
                      { id: "hikaye", label: "Hikaye", aciklama: "Duygu bağı kur" },
                    ] as { id: SosyalTon; label: string; aciklama: string }[]).map((t) => (
                      <button key={t.id} onClick={() => setSosyalTon(t.id)}
                        className={`p-3 rounded-xl border-2 text-left transition-all ${sosyalTon === t.id ? "border-[#1E4DD8] bg-[#F1F0EB]" : "border-[#D8D6CE] hover:border-[#1E4DD8]"}`}>
                        <p className={`text-xs font-medium ${sosyalTon === t.id ? "text-[#1A1A17]" : "text-[#5A5852]"}`}>{t.label}</p>
                        <p className="text-xs text-[#908E86] mt-0.5">{t.aciklama}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sezon / Etkinlik</label>
                  <select value={sosyalSezon} onChange={(e) => setSosyalSezon(e.target.value)}
                    className="w-full border border-[#D8D6CE] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E4DD8]/30 bg-white">
                    <option value="normal">Normal (sezon yok)</option>
                    <option value="anneler_gunu">💐 Anneler Günü</option>
                    <option value="babalar_gunu">👔 Babalar Günü</option>
                    <option value="bayram">🌙 Bayram</option>
                    <option value="yilbasi">🎉 Yılbaşı</option>
                    <option value="black_friday">🔥 Black Friday</option>
                    <option value="sevgililer_gunu">❤️ Sevgililer Günü</option>
                  </select>
                </div>
              </div>
            )}

            <button onClick={captionUret} disabled={captionYukleniyor || sosyalKitYukleniyor || !sosyalUrunAdi.trim() || (kullanici !== null && !kullanici.is_admin && (kullanici?.kredi ?? 0) <= 0)}
              className="w-full bg-[#1E4DD8] hover:bg-[#163B9E] disabled:bg-[#D8D6CE] disabled:text-[#908E86] text-white font-medium py-3 rounded-xl transition-colors">
              {captionYukleniyor ? "Üretiliyor..." : !kullanici ? "Caption üret — giriş gerekli" : `${sosyalPlatform === "instagram" ? "Instagram" : sosyalPlatform === "tiktok" ? "TikTok" : sosyalPlatform === "facebook" ? "Facebook" : "Twitter/X"} caption üret — ${kullanici.is_admin ? "∞" : "1"} kredi`}
            </button>

            {!kullanici ? (
              <button disabled className="w-full bg-[#D8D6CE] text-[#908E86] font-medium py-3 rounded-xl">
                Sosyal medya kiti — giriş gerekli
              </button>
            ) : (
              <KrediButon
                label="Sosyal medya kiti"
                kredi={kullanici.is_admin ? 0 : (sosyalFoto ? 4 : 3)}
                kalanKredi={kullanici.is_admin ? undefined : kullanici.kredi}
                onClick={kitUret}
                disabled={sosyalKitYukleniyor || captionYukleniyor || !sosyalUrunAdi.trim() || (!kullanici.is_admin && (kullanici.kredi ?? 0) < (sosyalFoto ? 4 : 3))}
                yukleniyor={sosyalKitYukleniyor}
                yukleniyorLabel="Kit üretiliyor..."
              />
            )}
            <p className="text-xs text-gray-400 text-center -mt-2">Instagram · TikTok · Facebook · Twitter/X aynı anda</p>

            {kullanici && !kullanici.is_admin && (kullanici.kredi ?? 0) <= 0 && !captionYukleniyor && (
              <p className="text-center text-xs text-red-500">İçerik üretim krediniz bitti. <button onClick={() => paketModalAc()} className="underline font-medium">Kredi satın al →</button></p>
            )}

            {(sosyalCaption || sosyalHashtag) && (
              <div className="space-y-3">
                {sosyalCaption && (
                  <div className="bg-[#FAFAF8] rounded-xl p-5 border-l-4 border-l-[#1E4DD8] border border-[#D8D6CE]">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-[#1A1A17]">Paylaşım metni</span>
                      <button onClick={() => navigator.clipboard.writeText(sosyalCaption)} className="text-xs font-medium px-3 py-1.5 rounded-lg bg-white text-[#5A5852] hover:bg-[#F1F0EB] hover:text-[#1A1A17] transition-all border border-[#D8D6CE]">Kopyala</button>
                    </div>
                    <p className="text-sm text-[#5A5852] leading-relaxed whitespace-pre-line">{sosyalCaption}</p>
                  </div>
                )}
                {sosyalHashtag && (
                  <div className="bg-[#FAFAF8] rounded-xl p-5 border-l-4 border-l-[#1E4DD8] border border-[#D8D6CE]">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-[#1A1A17]"># Hashtagler</span>
                      <button onClick={() => navigator.clipboard.writeText(sosyalHashtag)} className="text-xs font-medium px-3 py-1.5 rounded-lg bg-white text-[#5A5852] hover:bg-[#F1F0EB] hover:text-[#1A1A17] transition-all border border-[#D8D6CE]">Kopyala</button>
                    </div>
                    <p className="text-sm text-[#1E4DD8] leading-relaxed">{sosyalHashtag}</p>
                  </div>
                )}
                <button onClick={() => { setSosyalCaption(""); setSosyalHashtag(""); }} className="w-full text-xs text-gray-400 hover:text-gray-600 py-2 transition-colors">Yeni metin üret</button>
              </div>
            )}

            {/* Sosyal Medya Kiti sonuçları */}
            {sosyalKitSonuc && (
              <div className="space-y-3 mt-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-[#1A1A17]">Sosyal medya kiti</p>
                  <button onClick={() => { setSosyalKitSonuc(null); setSosyalKitAcik(null); }} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Temizle</button>
                </div>
                {([
                  { id: "instagram_tiktok", label: "Instagram & TikTok" },
                  { id: "facebook", label: "Facebook" },
                  { id: "twitter", label: "Twitter/X" },
                  { id: "linkedin", label: "LinkedIn" },
                ]).map(({ id, label }) => {
                  const sonuc = sosyalKitSonuc[id];
                  if (!sonuc) return null;
                  const acik = sosyalKitAcik === id;
                  return (
                    <div key={id} className="border border-[#D8D6CE] rounded-xl overflow-hidden">
                      <button onClick={() => setSosyalKitAcik(acik ? null : id)}
                        className="w-full flex items-center justify-between px-4 py-3 bg-[#FAFAF8] hover:bg-[#F1F0EB] transition-colors text-left">
                        <span className="text-sm font-medium text-[#1A1A17]">{label}</span>
                        <span className="text-[#908E86] text-xs">{acik ? "▲" : "▼"}</span>
                      </button>
                      {acik && (
                        <div className="p-4 space-y-3">
                          {sonuc.caption && (
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-medium text-[#5A5852]">Paylaşım metni</span>
                                <button onClick={() => navigator.clipboard.writeText(sonuc.caption)} className="text-xs px-2 py-1 rounded bg-white border border-[#D8D6CE] text-[#5A5852] hover:text-[#1A1A17] hover:border-[#1E4DD8] transition-all">Kopyala</button>
                              </div>
                              <p className="text-sm text-[#5A5852] whitespace-pre-line leading-relaxed">{sonuc.caption}</p>
                            </div>
                          )}
                          {sonuc.hashtag && (
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-medium text-[#5A5852]">Hashtagler</span>
                                <button onClick={() => navigator.clipboard.writeText(sonuc.hashtag)} className="text-xs px-2 py-1 rounded bg-white border border-[#D8D6CE] text-[#5A5852] hover:text-[#1A1A17] hover:border-[#1E4DD8] transition-all">Kopyala</button>
                              </div>
                              <p className="text-sm text-[#1E4DD8]">{sonuc.hashtag}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* GÖRSEL İÇERİĞİ */}
        {sosyalIcerikTipi === "gorsel" && (
          <div className="space-y-4">
            <p className="text-xs text-[#5A5852]">Ürün fotoğrafından seçtiğin platform boyutunda profesyonel görsel üretilir — 1 görsel, 1 kredi.</p>

            {!sosyalFoto ? (
              <FotoEkleAlani id="sosyal-gorsel-foto-input" onChange={(e) => { const f = e.target.files?.[0]; if (f) { const r = new FileReader(); r.onload = () => setSosyalFoto(r.result as string); r.readAsDataURL(f); } }} renk="pink" metin="Ürün fotoğrafı yükle" ikon="📸" altMetin="Temiz arka planlı fotoğraf en iyi sonucu verir" />
            ) : (
              <FotoThumbnail src={sosyalFoto} onKaldir={() => { setSosyalFoto(null); setSosyalGorselSonuclar([]); }} renk="green" />
            )}

            {/* Boyut seçimi */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">Görsel Boyutu</label>
              <div className="grid grid-cols-3 gap-2">
                {([
                  { id: "1:1", label: "1:1", aciklama: "Feed / Post" },
                  { id: "9:16", label: "9:16", aciklama: "Story / Reels" },
                  { id: "16:9", label: "16:9", aciklama: "Banner / YouTube" },
                ] as { id: "1:1" | "9:16" | "16:9"; label: string; aciklama: string }[]).map((b) => (
                  <button key={b.id} onClick={() => setSosyalGorselFormat(b.id)}
                    className={`p-2.5 rounded-xl border-2 text-center transition-all ${sosyalGorselFormat === b.id ? "border-[#1E4DD8] bg-[#F1F0EB]" : "border-[#D8D6CE] hover:border-[#1E4DD8]"}`}>
                    <p className={`text-sm font-medium ${sosyalGorselFormat === b.id ? "text-[#1A1A17]" : "text-[#5A5852]"}`}>{b.label}</p>
                    <p className="text-xs text-[#908E86] mt-0.5">{b.aciklama}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Stil seçimi */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">Arka Plan Stili</label>
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
                    className={`py-2 px-1 rounded-xl border-2 text-xs font-medium transition-all ${sosyalGorselStil === s.id ? "border-[#1E4DD8] bg-[#F1F0EB] text-[#1A1A17]" : "border-[#D8D6CE] text-[#5A5852] hover:border-[#1E4DD8]"}`}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-600 font-medium block mb-1">Sahne açıklaması (isteğe bağlı)</label>
              <textarea
                value={sosyalGorselPrompt}
                onChange={(e) => setSosyalGorselPrompt(e.target.value)}
                placeholder="örn: Mermerli masada sofistike ışıklandırma, minimalist Japandi dekor..."
                className="w-full border border-[#D8D6CE] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E4DD8]/30 resize-none"
                rows={2}
              />
            </div>

            <button onClick={sosyalGorselUret} disabled={sosyalGorselYukleniyor || !sosyalFoto || (kullanici !== null && !kullanici.is_admin && (kullanici?.kredi ?? 0) < 1)}
              className="w-full bg-[#1E4DD8] hover:bg-[#163B9E] disabled:bg-[#D8D6CE] disabled:text-[#908E86] text-white font-medium py-3 rounded-xl transition-colors">
              {sosyalGorselYukleniyor ? "Görsel üretiliyor..." : !kullanici ? "Görsel üret — giriş gerekli" : `Sosyal medya görseli üret — ${kullanici.is_admin ? "∞" : "1"} kredi`}
            </button>

            {sosyalGorselYukleniyor && (
              <div className="bg-[#F1F0EB] border border-[#D8D6CE] rounded-xl p-4 text-center space-y-2">
                <div className="flex justify-center"><div className="w-8 h-8 border-4 border-[#D8D6CE] border-t-[#1E4DD8] rounded-full animate-spin" /></div>
                <p className="text-sm font-medium text-[#1A1A17]">Görsel üretiliyor...</p>
                <p className="text-xs text-[#5A5852]">Bu birkaç saniye sürebilir</p>
              </div>
            )}

            {sosyalGorselSonuclar.length > 0 && !sosyalGorselYukleniyor && (
              <div className="space-y-3">
                <p className="text-sm font-medium text-[#1A1A17] px-1">✅ Görseller hazır — {sosyalGorselFormat} · {sosyalGorselStil}</p>
                {sosyalGorselSonuclar.map((stil) => (
                  <div key={stil.stil} className="grid grid-cols-2 gap-2">
                    {stil.gorseller.map((url, i) => (
                      <div key={i} className="relative group rounded-xl overflow-hidden border border-gray-200">
                        <img src={url} alt={`${stil.label} ${i + 1}`} className="w-full object-cover" />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <a href={url} download target="_blank" rel="noopener noreferrer" className="bg-white text-[#1A1A17] text-xs font-medium px-3 py-1.5 rounded-lg border border-[#D8D6CE]">İndir</a>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
                <button onClick={() => { setSosyalGorselSonuclar([]); setSosyalFoto(null); }} className="w-full text-xs text-gray-400 hover:text-gray-600 py-2 transition-colors">Yeni görsel üret</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
