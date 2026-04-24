"use client";
import { useState } from "react";
import { Edit3, Camera, ScanLine, FileSpreadsheet, FileText, AlertTriangle, RotateCcw, Scissors } from "lucide-react";
import { PLATFORM_BILGI, PLATFORM_PLACEHOLDER, YUKLENIYOR_MESAJLARI, KATEGORI_LISTESI } from "@/lib/constants";
import { sonucuBolumle, docxIndir } from "@/lib/listing-utils";
import KopyalaButon from "@/components/ui/KopyalaButon";
import FotoThumbnail from "@/components/ui/FotoThumbnail";
import KrediButon from "@/components/ui/KrediButon";
import GenerationFeedback from "@/components/GenerationFeedback";

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

interface MetinSekmesiProps {
  aktif: boolean;
  girisTipi: "manuel" | "foto" | "barkod";
  setGirisTipi: (v: "manuel" | "foto" | "barkod") => void;
  platform: string;
  urunAdi: string;
  setUrunAdi: (v: string) => void;
  kategori: string;
  setKategori: (v: string) => void;
  ozellikler: string;
  setOzellikler: (v: string) => void;
  hedefKitle: string;
  setHedefKitle: (v: string) => void;
  fiyatSegmenti: "butce" | "orta" | "premium";
  setFiyatSegmenti: (v: "butce" | "orta" | "premium") => void;
  fotolar: string[];
  fotoKaldir: (i: number) => void;
  kameraAcik: boolean;
  kameraAc: () => void;
  kameraKapat: () => void;
  barkodYukleniyor: boolean;
  barkodBilgi: { isim: string; marka: string; aciklama: string; kategori: string; renk: string; boyut: string } | null;
  setBarkodBilgi: (v: null) => void;
  yukleniyor: boolean;
  yukleniyorMesaj: number;
  sonuc: string;
  setSonuc: (v: string) => void;
  duzenleYukleniyor: boolean;
  setDuzenleYukleniyor: (v: boolean) => void;
  uretimId: string | null;
  yenidenUretHakki: number;
  setYenidenUretHakki: (fn: (prev: number) => number) => void;
  kullanici: Kullanici | null;
  paketModalAc: () => void;
  icerikUret: () => void;
}

export default function MetinSekmesi({
  aktif,
  girisTipi, setGirisTipi,
  platform,
  urunAdi, setUrunAdi,
  kategori, setKategori,
  ozellikler, setOzellikler,
  hedefKitle, setHedefKitle,
  fiyatSegmenti, setFiyatSegmenti,
  fotolar, fotoKaldir,
  kameraAcik, kameraAc, kameraKapat,
  barkodYukleniyor, barkodBilgi, setBarkodBilgi,
  yukleniyor, yukleniyorMesaj,
  sonuc, setSonuc,
  duzenleYukleniyor, setDuzenleYukleniyor,
  uretimId, yenidenUretHakki, setYenidenUretHakki,
  kullanici, paketModalAc, icerikUret,
}: MetinSekmesiProps) {
  const platformBilgi = PLATFORM_BILGI[platform] || PLATFORM_BILGI.trendyol;
  const platformPh = PLATFORM_PLACEHOLDER[platform] || PLATFORM_PLACEHOLDER.trendyol;
  const [digerMod, setDigerMod] = useState(false);
  const [gelismisAcik, setGelismisAcik] = useState(false);

  const uretButonAktif = !yukleniyor && (
    (girisTipi === "manuel" && urunAdi.trim().length > 0 && kategori.trim().length > 0) ||
    (girisTipi === "foto" && fotolar.length > 0) ||
    (girisTipi === "barkod" && barkodBilgi !== null)
  );
  const sonucBolumleri = sonucuBolumle(sonuc);

  const GIRIS_TIPI_CONF = [
    { tip: "manuel" as const, label: "Manuel",   Icon: Edit3 },
    { tip: "foto"   as const, label: "Fotoğraf", Icon: Camera },
    { tip: "barkod" as const, label: "Barkod",   Icon: ScanLine },
  ];

  const GirisTipiChips = (
    <div className="flex items-center border-b border-[#D8D6CE]">
      {GIRIS_TIPI_CONF.map(({ tip, label, Icon }) => (
        <button key={tip} onClick={() => setGirisTipi(tip)}
          className={`flex items-center gap-1.5 py-2 px-3 text-xs font-medium transition-colors border-b-2 -mb-px ${
            girisTipi === tip
              ? "border-[#1E4DD8] text-[#1A1A17]"
              : "border-transparent text-[#908E86] hover:text-[#1A1A17]"
          }`}>
          <Icon size={14} strokeWidth={1.5} />
          <span>{label}</span>
        </button>
      ))}
      <a href="/toplu"
        className="flex items-center gap-1.5 py-2 px-3 text-xs font-medium transition-colors border-b-2 border-transparent -mb-px text-[#908E86] hover:text-[#1A1A17]">
        <FileSpreadsheet size={14} strokeWidth={1.5} />
        <span>Excel</span>
      </a>
    </div>
  );

  const GelismisAyarlar = (
    <div className="pt-1">
      <button type="button" onClick={() => setGelismisAcik(v => !v)}
        className="flex items-center gap-1 text-xs font-medium text-[#5A5852] hover:text-[#1A1A17] transition-colors">
        <span>{gelismisAcik ? "▾" : "▸"}</span>
        Daha fazla seçenek
      </button>
      {gelismisAcik && (
        <div className="mt-3 space-y-3">
          <div>
            <label className="block text-sm font-medium text-[#1A1A17] mb-1">Hedef kitle <span className="text-[#908E86] font-normal">(isteğe bağlı)</span></label>
            <select value={hedefKitle} onChange={(e) => setHedefKitle(e.target.value)} className="w-full border border-[#D8D6CE] rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E4DD8]/20 focus:border-[#1E4DD8]">
              <option value="genel">Genel</option>
              <option value="kadinlar">Kadınlar</option>
              <option value="erkekler">Erkekler</option>
              <option value="gencler">Gençler (18-25)</option>
              <option value="ebeveynler">Ebeveynler</option>
              <option value="profesyoneller">Profesyoneller</option>
              <option value="sporcular">Sporcular</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1A1A17] mb-1">Fiyat segmenti <span className="text-[#908E86] font-normal">(isteğe bağlı)</span></label>
            <div className="grid grid-cols-3 gap-2">
              {(["butce", "orta", "premium"] as const).map((seg) => (
                <button key={seg} type="button" onClick={() => setFiyatSegmenti(seg)}
                  className={`py-2 rounded-lg border text-xs font-medium transition-all ${fiyatSegmenti === seg ? "border-[#1E4DD8] bg-[#EBF1FB] text-[#1E4DD8]" : "border-[#D8D6CE] text-[#5A5852] hover:border-[#1E4DD8]"}`}>
                  {seg === "butce" ? "Bütçe" : seg === "orta" ? "Orta" : "Premium"}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div style={{ display: aktif ? "block" : "none" }} className="mt-4 bg-white border border-[#D8D6CE] rounded-xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-medium text-[#1A1A17]">Listing metni</h2>
        <span className="text-xs text-[#5A5852] font-mono">1 kredi</span>
      </div>

      {/* Manuel */}
      {girisTipi === "manuel" && (
        <>
          {GirisTipiChips}
          <div>
            <label className="block text-sm font-medium text-[#1A1A17] mb-1">Ürün adı <span className="text-[#7A1E1E]">*</span></label>
            <input type="text" value={urunAdi} onChange={(e) => setUrunAdi(e.target.value)} placeholder={platformPh.urun} className="w-full border border-[#D8D6CE] rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E4DD8]/20 focus:border-[#1E4DD8]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1A1A17] mb-1">Kategori <span className="text-[#7A1E1E]">*</span></label>
            <select
              value={digerMod ? "Diğer" : (kategori || "")}
              onChange={(e) => {
                if (e.target.value === "Diğer") { setDigerMod(true); setKategori(""); }
                else { setDigerMod(false); setKategori(e.target.value); }
              }}
              className="w-full border border-[#D8D6CE] rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E4DD8]/20 focus:border-[#1E4DD8]"
            >
              <option value="">— Seç (isteğe bağlı) —</option>
              {KATEGORI_LISTESI.map((k) => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
            {digerMod && (
              <input type="text" value={kategori} onChange={(e) => setKategori(e.target.value)}
                placeholder="Kategori yaz..." autoFocus
                className="mt-2 w-full border border-[#D8D6CE] rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E4DD8]/20 focus:border-[#1E4DD8]" />
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1A1A17] mb-1">Ürün detayları <span className="text-[#908E86] font-normal">(isteğe bağlı)</span></label>
            <textarea value={ozellikler} onChange={(e) => setOzellikler(e.target.value)}
              placeholder="Renk, beden, malzeme, öne çıkan özellikler, arama kelimeleri — ne kadar detay girersen içerik o kadar iyi olur"
              rows={3} className="w-full border border-[#D8D6CE] rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E4DD8]/20 focus:border-[#1E4DD8]" />
          </div>
          {GelismisAyarlar}
        </>
      )}

      {/* Fotoğraf */}
      {girisTipi === "foto" && (
        <div className="space-y-3">
          {GirisTipiChips}
          <div>
            <label className="block text-sm font-medium text-[#1A1A17] mb-1">Kategori <span className="text-[#908E86] font-normal">(isteğe bağlı)</span></label>
            <input type="text" value={kategori} onChange={(e) => setKategori(e.target.value)} placeholder="örn: Ayakkabı & Çanta / Erkek Bot" className="w-full border border-[#D8D6CE] rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E4DD8]/20 focus:border-[#1E4DD8]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1A1A17] mb-2">Ürün fotoğrafı</label>
            {fotolar.length === 0 ? (
              <div className="bg-[#EBF1FB] border border-[#1E4DD8]/20 rounded-lg p-4 text-center space-y-1">
                <p className="text-xs text-[#1E4DD8] flex items-center justify-center gap-1.5"><Camera size={14} strokeWidth={1.5} /> Fotoğraf metin kalitesini artırır — yukarıdan yükleyebilirsin</p>
                <button type="button" onClick={() => setGirisTipi("manuel")} className="text-xs text-[#1E4DD8] hover:text-[#163B9E] underline">Fotoğrafsız devam et</button>
              </div>
            ) : (
              <FotoThumbnail src={fotolar[0]} onKaldir={() => fotoKaldir(0)} renk="green" />
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1A1A17] mb-1">Ürün detayları <span className="text-[#908E86] font-normal">(isteğe bağlı)</span></label>
            <textarea value={ozellikler} onChange={(e) => setOzellikler(e.target.value)}
              placeholder="Renk, beden, malzeme, öne çıkan özellikler, arama kelimeleri — ne kadar detay girersen içerik o kadar iyi olur"
              rows={2} className="w-full border border-[#D8D6CE] rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E4DD8]/20 focus:border-[#1E4DD8]" />
          </div>
          {GelismisAyarlar}
        </div>
      )}

      {/* Barkod */}
      {girisTipi === "barkod" && (
        <div className="space-y-3">
          {GirisTipiChips}
          {!kameraAcik && !barkodBilgi && (
            <div className="bg-[#EBF1FB] border border-[#1E4DD8]/20 rounded-lg p-5 text-center space-y-3">
              <p className="text-sm text-[#5A5852]">Ürünün barkodunu kameraya göster, bilgiler otomatik dolacak.</p>
              <button onClick={kameraAc} className="bg-[#1E4DD8] hover:bg-[#163B9E] text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors flex items-center gap-1.5 mx-auto">
                <Camera size={14} strokeWidth={1.5} /> Kamerayı aç
              </button>
            </div>
          )}
          {kameraAcik && (
            <div className="space-y-2">
              <div id="barkod-okuyucu" className="w-full rounded-lg overflow-hidden" />
              {barkodYukleniyor && <p className="text-center text-sm text-[#5A5852] animate-pulse">Ürün sorgulanıyor...</p>}
              <button onClick={kameraKapat} className="w-full text-xs text-[#908E86] hover:text-[#5A5852] py-1 transition-colors">
                Kamerayı kapat
              </button>
            </div>
          )}
          {barkodBilgi && (
            <div className="bg-[#E8F5EE] border border-[#0F5132]/20 rounded-lg p-4 space-y-1">
              <p className="text-sm font-medium text-[#0F5132]">Ürün tanındı</p>
              <p className="text-sm text-[#1A1A17]"><span className="font-medium">İsim:</span> {barkodBilgi.isim}</p>
              {barkodBilgi.marka && <p className="text-sm text-[#5A5852]"><span className="font-medium">Marka:</span> {barkodBilgi.marka}</p>}
              {barkodBilgi.kategori && <p className="text-sm text-[#5A5852]"><span className="font-medium">Kategori:</span> {barkodBilgi.kategori}</p>}
              <button onClick={() => { setBarkodBilgi(null); setUrunAdi(""); setKategori(""); setOzellikler(""); }} className="text-xs text-[#1E4DD8] hover:text-[#163B9E] underline mt-1 transition-colors">
                Tekrar tara
              </button>
            </div>
          )}
        </div>
      )}

      {/* Üret butonu */}
      <KrediButon
        label={(!kullanici || kullanici.anonim) ? "Giriş yap ve başla" : "İçerik üret"}
        kredi={(!kullanici || kullanici.anonim || kullanici.is_admin) ? undefined : 1}
        kalanKredi={kullanici?.kredi}
        onClick={icerikUret}
        disabled={!uretButonAktif}
        yukleniyor={yukleniyor}
        yukleniyorLabel={YUKLENIYOR_MESAJLARI[yukleniyorMesaj]}
      />

      <p className="text-xs text-[#908E86] text-center">yzliste her platformun karakter limiti ve SEO kuralına göre üretir ancak pazaryeri kuralları sık değişir — yayınlamadan önce içeriği kontrol etmeni öneririz</p>

      {!yukleniyor && kullanici && !kullanici.anonim && !kullanici.is_admin && (kullanici.kredi ?? 0) <= 0 && (
        <p className="text-center text-xs text-[#7A1E1E]">İçerik üretim krediniz bitti. <button onClick={() => paketModalAc()} className="underline font-medium">Kredi satın al</button></p>
      )}

      {yukleniyor && (
        <div className="bg-white rounded-xl border border-[#D8D6CE] p-8 text-center space-y-4">
          <div className="flex justify-center"><div className="w-10 h-10 border-4 border-[#D8D6CE] border-t-[#1E4DD8] rounded-full animate-spin" /></div>
          <p className="text-[#5A5852] font-medium animate-pulse">{YUKLENIYOR_MESAJLARI[yukleniyorMesaj]}</p>
          <p className="text-[#908E86] text-sm">Bu birkaç saniye sürebilir...</p>
        </div>
      )}

      {sonuc && !yukleniyor && (
        <div id="sonuc-alani" className="space-y-3">
          <div className="flex justify-between items-center px-1">
            <h2 className="text-base font-medium text-[#1A1A17]">Üretilen içerik</h2>
            <button onClick={() => docxIndir(sonucBolumleri, urunAdi || "listing")} className="flex items-center gap-1.5 text-xs bg-[#EBF1FB] hover:bg-[#F0F4FB] text-[#1E4DD8] font-medium px-3 py-1.5 rounded-lg transition-colors border border-[#1E4DD8]/20">
              <FileText size={12} strokeWidth={1.5} /> Word indir
            </button>
          </div>

          {/* Mikro-aksiyonlar */}
          {(() => {
            const mikro = async (aksiyon: string) => {
              if (!kullanici || duzenleYukleniyor) return;
              setDuzenleYukleniyor(true);
              const res = await fetch("/api/uret/duzenle", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sonuc, aksiyon, userId: kullanici.id, platform, kategori }),
              });
              const data = await res.json();
              if (data.sonuc) setSonuc(data.sonuc);
              setDuzenleYukleniyor(false);
            };
            return (
              <div className="flex flex-wrap gap-2 px-1">
                <button onClick={async () => {
                  if (!kullanici || yukleniyor || duzenleYukleniyor) return;
                  if (uretimId && yenidenUretHakki > 0) {
                    setDuzenleYukleniyor(true);
                    const res = await fetch("/api/uret/duzenle", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sonuc, aksiyon: "yeniden_uret_context", userId: kullanici.id, platform, kategori }) });
                    const data = await res.json();
                    if (data.sonuc) { setSonuc(data.sonuc); setYenidenUretHakki(h => h - 1); }
                    setDuzenleYukleniyor(false);
                  } else {
                    icerikUret();
                  }
                }} disabled={yukleniyor || duzenleYukleniyor} className="flex items-center gap-1 text-xs bg-[#EBF1FB] hover:bg-[#F0F4FB] text-[#1E4DD8] px-3 py-1.5 rounded-lg border border-[#1E4DD8]/20 transition-colors disabled:opacity-40">
                  <RotateCcw size={12} strokeWidth={1.5} /> Yeniden üret{uretimId && yenidenUretHakki > 0 ? ` (${yenidenUretHakki} ücretsiz)` : ""}
                </button>
                <button onClick={() => mikro("kisalt")} disabled={duzenleYukleniyor || yukleniyor} className="flex items-center gap-1 text-xs bg-[#F1F0EB] hover:bg-[#D8D6CE]/40 text-[#5A5852] px-3 py-1.5 rounded-lg border border-[#D8D6CE] transition-colors disabled:opacity-40">
                  <Scissors size={12} strokeWidth={1.5} /> Kısalt
                </button>
                <button onClick={() => mikro("genislet")} disabled={duzenleYukleniyor || yukleniyor} className="flex items-center gap-1 text-xs bg-[#F1F0EB] hover:bg-[#D8D6CE]/40 text-[#5A5852] px-3 py-1.5 rounded-lg border border-[#D8D6CE] transition-colors disabled:opacity-40">
                  Genişlet
                </button>
                <button onClick={() => mikro("ton_samimi")} disabled={duzenleYukleniyor || yukleniyor} className="flex items-center gap-1 text-xs bg-[#F1F0EB] hover:bg-[#D8D6CE]/40 text-[#5A5852] px-3 py-1.5 rounded-lg border border-[#D8D6CE] transition-colors disabled:opacity-40">
                  Samimi
                </button>
                <button onClick={() => mikro("ton_resmi")} disabled={duzenleYukleniyor || yukleniyor} className="flex items-center gap-1 text-xs bg-[#F1F0EB] hover:bg-[#D8D6CE]/40 text-[#5A5852] px-3 py-1.5 rounded-lg border border-[#D8D6CE] transition-colors disabled:opacity-40">
                  Resmi
                </button>
              </div>
            );
          })()}

          {/* Platform uyumluluk rozeti */}
          {(() => {
            const baslik = sonucBolumleri.find(b => b.baslik === "Başlık")?.icerik ?? "";
            const pb = platformBilgi;
            const baslikUzunluk = baslik.length;
            const baslikUygun = baslikUzunluk > 0 && baslikUzunluk <= pb.baslikLimit;
            const platformAdi = { trendyol: "Trendyol", hepsiburada: "Hepsiburada", amazon: "Amazon TR", n11: "N11", etsy: "Etsy", amazon_usa: "Amazon USA" }[platform] ?? platform;
            if (!baslik) return null;
            return (
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium ${baslikUygun ? "bg-[#E8F5EE] border border-[#0F5132]/20 text-[#0F5132]" : "bg-[#FEF4E7] border border-[#8B4513]/20 text-[#8B4513]"}`}>
                {baslikUygun ? (
                  <span>✓</span>
                ) : (
                  <AlertTriangle size={14} strokeWidth={1.5} />
                )}
                <span className="flex-1">
                  {baslikUygun
                    ? `${platformAdi} kurallarına uygun — Başlık ${baslikUzunluk}/${pb.baslikLimit} karakter`
                    : `Başlık ${baslikUzunluk} karakter — ${platformAdi} limiti ${pb.baslikLimit} karakter`}
                </span>
              </div>
            );
          })()}

          {/* Marka/IP uyarısı */}
          {(() => {
            const BILINEN_MARKALAR = /\b(Apple|Samsung|Nike|Adidas|Sony|LG|Philips|Tefal|Bosch|Siemens|Dyson|Stanley|Tupperware|Lego|Canon|Nikon|Braun|Arçelik|Vestel|Beko|Xiaomi|Huawei|Lenovo|Asus|Microsoft|Google)\b/gi;
            const eslesmeler = sonuc.match(BILINEN_MARKALAR);
            if (!eslesmeler) return null;
            const tekil = [...new Set(eslesmeler.map(m => m.trim()))];
            return (
              <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-[#FCECEC] border border-[#7A1E1E]/20">
                <AlertTriangle size={14} strokeWidth={1.5} className="text-[#7A1E1E] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-[#7A1E1E]">Marka/IP uyarısı</p>
                  <p className="text-xs text-[#7A1E1E]/80 mt-0.5">Tespit edilen marka adı: <span className="font-medium">{tekil.join(", ")}</span>. Yetkili satıcı değilseniz içeriği gözden geçirin.</p>
                </div>
              </div>
            );
          })()}

          {sonucBolumleri.map((bolum, i) => {
            const ref = { current: null as HTMLDivElement | null };
            return (
              <div key={i} className="bg-white rounded-xl border border-[#D8D6CE] p-5">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium text-[#1A1A17]">{bolum.ikon} {bolum.baslik}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#D8D6CE] hidden sm:block">✎ düzenlenebilir</span>
                    <KopyalaButon metin={bolum.icerik} getDuzenlenmisMevin={() => ref.current?.innerText || bolum.icerik} />
                  </div>
                </div>
                <div ref={ref} contentEditable suppressContentEditableWarning
                  onFocus={(e) => { e.currentTarget.style.outline = "2px solid #1E4DD8"; e.currentTarget.style.borderRadius = "8px"; e.currentTarget.style.padding = "8px"; }}
                  onBlur={(e) => { e.currentTarget.style.outline = "none"; e.currentTarget.style.padding = "0"; }}
                  className="whitespace-pre-wrap text-sm text-[#5A5852] leading-relaxed font-sans cursor-text">
                  {bolum.icerik}
                </div>
              </div>
            );
          })}

          <GenerationFeedback platform={platform} category={kategori} />
        </div>
      )}
    </div>
  );
}
