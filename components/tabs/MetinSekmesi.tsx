"use client";
import { useState, useRef } from "react";
import { Edit3, Camera, ScanLine, FileSpreadsheet, FileText, AlertTriangle, RotateCcw, Scissors, FolderOpen, Check, X as XIcon, Loader2, Download, ClipboardList, BarChart3, CreditCard, Tag, Lightbulb } from "lucide-react";
import { PLATFORM_BILGI, PLATFORM_PLACEHOLDER, YUKLENIYOR_MESAJLARI, KATEGORI_LISTESI } from "@/lib/constants";
import { sonucuBolumle, docxIndir } from "@/lib/listing-utils";
import { parseExcel, excelOlustur, type ParseSonucu } from "@/lib/excel-parser";
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

type TopluAdim = "yukle" | "onizleme" | "islem" | "tamamlandi";
type TopluPlatform = "trendyol" | "hepsiburada" | "amazon" | "n11" | "etsy" | "amazon_usa";

type TopluIlerleme = {
  indeks: number;
  urun: string;
  durum: "bekliyor" | "isleniyor" | "tamam" | "hata";
};

const TOPLU_PLATFORM_ETIKET: Record<TopluPlatform, string> = {
  trendyol: "Trendyol",
  hepsiburada: "Hepsiburada",
  amazon: "Amazon TR",
  n11: "N11",
  etsy: "Etsy",
  amazon_usa: "Amazon USA",
};

interface MetinSekmesiProps {
  aktif: boolean;
  girisTipi: "manuel" | "foto" | "barkod" | "excel";
  setGirisTipi: (v: "manuel" | "foto" | "barkod" | "excel") => void;
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
  onGirisAc?: () => void;
  skor: number | null;
  oneriler: string[];
  ucretsizRevizeKullanildi: boolean;
  ucretsizRevizeBaslat: () => void;
}

function SkorBari({ skor, oneriler, ucretsizRevizeKullanildi, onUcretsizRevize }: {
  skor: number;
  oneriler: string[];
  ucretsizRevizeKullanildi: boolean;
  onUcretsizRevize: () => void;
}) {
  const [goster, setGoster] = useState(false);

  // Animasyon: mount'ta 0'dan başla
  const [animSkor, setAnimSkor] = useState(0);
  useState(() => { setTimeout(() => setGoster(true), 50); });
  if (goster && animSkor !== skor) setAnimSkor(skor);

  const { renk, bg, metin } = skor >= 75
    ? { renk: "bg-[#0F5132]", bg: "bg-[#E8F5EE] border-[#0F5132]/20", metin: "Harika listing! Pazaryerine hazır." }
    : skor >= 50
    ? { renk: "bg-[#8B4513]", bg: "bg-[#FEF4E7] border-[#8B4513]/20", metin: "İyileştirilebilir" }
    : { renk: "bg-[#7A1E1E]", bg: "bg-[#FCECEC] border-[#7A1E1E]/20", metin: "Eksik bilgi çok fazla" };

  const skorRenk = skor >= 75 ? "text-[#0F5132]" : skor >= 50 ? "text-[#8B4513]" : "text-[#7A1E1E]";

  return (
    <div className={`border rounded-lg p-4 space-y-3 ${bg}`}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <span className={`text-2xl font-medium ${skorRenk}`}>{animSkor}</span>
          <span className={`text-sm ${skorRenk}`}>/100</span>
          <p className={`text-xs font-medium mt-0.5 ${skorRenk}`}>{metin}</p>
        </div>
        <div className="flex-1 h-3 bg-white/60 rounded-full overflow-hidden">
          <div
            className={`h-full ${renk} rounded-full transition-all duration-1000`}
            style={{ width: `${goster ? skor : 0}%` }}
          />
        </div>
      </div>
      {skor < 75 && oneriler.length > 0 && (
        <div className="space-y-1">
          {oneriler.map((o, i) => (
            <p key={i} className={`text-xs flex items-start gap-1.5 ${skor >= 50 ? "text-[#8B4513]" : "text-[#7A1E1E]"}`}>
              <span className="mt-0.5 flex-shrink-0">•</span>{o}
            </p>
          ))}
        </div>
      )}
      {skor < 75 && !ucretsizRevizeKullanildi && (
        <button
          onClick={onUcretsizRevize}
          className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${skor >= 50 ? "bg-[#FEF4E7] border-[#8B4513]/30 text-[#8B4513] hover:bg-[#F9E8D0]" : "bg-[#FCECEC] border-[#7A1E1E]/30 text-[#7A1E1E] hover:bg-[#F9DCDC]"}`}
        >
          Ücretsiz yeniden üret
        </button>
      )}
    </div>
  );
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
  kullanici, paketModalAc, icerikUret, onGirisAc,
  skor, oneriler, ucretsizRevizeKullanildi, ucretsizRevizeBaslat,
}: MetinSekmesiProps) {
  const platformBilgi = PLATFORM_BILGI[platform] || PLATFORM_BILGI.trendyol;
  const platformPh = PLATFORM_PLACEHOLDER[platform] || PLATFORM_PLACEHOLDER.trendyol;
  const [digerMod, setDigerMod] = useState(false);
  const [gelismisAcik, setGelismisAcik] = useState(false);

  // Excel toplu üretim state
  const [topluAdim, setTopluAdim] = useState<TopluAdim>("yukle");
  const [topluParse, setTopluParse] = useState<ParseSonucu | null>(null);
  const [topluPlatform, setTopluPlatform] = useState<TopluPlatform>("trendyol");
  const [topluTon, setTopluTon] = useState("samimi");
  const [markaOverride, setMarkaOverride] = useState("");
  const [topluIlerlemeler, setTopluIlerlemeler] = useState<TopluIlerleme[]>([]);
  const [topluTamamlanan, setTopluTamamlanan] = useState(0);
  const [topluHata, setTopluHata] = useState<string | null>(null);
  const dosyaRef = useRef<HTMLInputElement>(null);
  const topluSonuclarRef = useRef<string[]>([]);

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
      <button
        onClick={() => setGirisTipi("excel")}
        className={`flex items-center gap-1.5 py-2 px-3 text-xs font-medium transition-colors border-b-2 -mb-px ${
          girisTipi === "excel"
            ? "border-[#1E4DD8] text-[#1A1A17]"
            : "border-transparent text-[#908E86] hover:text-[#1A1A17]"
        }`}>
        <FileSpreadsheet size={14} strokeWidth={1.5} />
        <span>Excel</span>
      </button>
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

  const topluDosyaSec = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setTopluHata(null);
    const dosya = e.target.files?.[0];
    if (!dosya) return;
    const buffer = await dosya.arrayBuffer();
    try {
      const sonuc = parseExcel(buffer);
      if (sonuc.toplam === 0) { setTopluHata("Dosyada geçerli ürün satırı bulunamadı."); return; }
      if (!kullanici || kullanici.anonim) { window.location.href = "/giris?redirect=/uret"; return; }
      setTopluParse(sonuc);
      setTopluAdim("onizleme");
    } catch {
      setTopluHata("Dosya okunamadı. Excel (.xlsx) veya CSV formatında olduğundan emin olun.");
    }
    e.target.value = "";
  };

  const topluIslemeBaslat = async () => {
    if (!topluParse || !kullanici || kullanici.anonim) return;
    setTopluHata(null);
    const basla: TopluIlerleme[] = topluParse.satirlar.map((s, i) => ({
      indeks: i,
      urun: s.urun_adi || s.aciklama || `Ürün ${i + 1}`,
      durum: "bekliyor",
    }));
    setTopluIlerlemeler(basla);
    topluSonuclarRef.current = new Array(topluParse.satirlar.length).fill("");
    setTopluTamamlanan(0);
    setTopluAdim("islem");

    const res = await fetch("/api/toplu", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        satirlar: topluParse.satirlar,
        platform: topluPlatform,
        ton: topluTon,
        markaOverride: markaOverride.trim() || undefined,
        userId: kullanici.id,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      setTopluHata(err.hata || "Bir hata oluştu.");
      setTopluAdim("onizleme");
      return;
    }

    const reader = res.body!.getReader();
    const decoder = new TextDecoder();
    let tampon = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      tampon += decoder.decode(value, { stream: true });
      const satirlar = tampon.split("\n\n");
      tampon = satirlar.pop() ?? "";
      for (const satir of satirlar) {
        if (!satir.startsWith("data: ")) continue;
        try {
          const mesaj = JSON.parse(satir.slice(6));
          if (mesaj.tip === "ilerleme") {
            setTopluIlerlemeler((prev) => prev.map((it) => it.indeks === mesaj.mevcut - 1 ? { ...it, durum: "isleniyor" } : it));
          } else if (mesaj.tip === "sonuc") {
            topluSonuclarRef.current[mesaj.indeks] = mesaj.icerik;
            setTopluIlerlemeler((prev) => prev.map((it) => it.indeks === mesaj.indeks ? { ...it, durum: "tamam" } : it));
            setTopluTamamlanan((t) => t + 1);
          } else if (mesaj.tip === "hata") {
            setTopluIlerlemeler((prev) => prev.map((it) => it.indeks === mesaj.indeks ? { ...it, durum: "hata" } : it));
            setTopluTamamlanan((t) => t + 1);
          } else if (mesaj.tip === "tamamlandi") {
            setTopluAdim("tamamlandi");
          }
        } catch { /* kötü satır */ }
      }
    }
  };

  const topluExcelIndir = () => {
    if (!topluParse) return;
    const buffer = excelOlustur(topluParse.satirlar, topluSonuclarRef.current, topluPlatform);
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `toplu_${topluPlatform}_${Date.now()}.xlsx`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const topluMarkaVarMi = topluParse?.kolonlar.some((k) => k.hedef === "marka");
  const topluTamam = topluIlerlemeler.filter((i) => i.durum === "tamam").length;
  const topluHatali = topluIlerlemeler.filter((i) => i.durum === "hata").length;

  const TopluExcelUI = (
    <div className="space-y-4">
      {GirisTipiChips}

      {topluHata && (
        <div className="bg-[#FCECEC] border border-[#7A1E1E]/20 rounded-lg p-4 flex items-center justify-between gap-3">
          <p className="text-sm text-[#7A1E1E]">{topluHata}</p>
          <button onClick={() => setTopluHata(null)} className="text-[#7A1E1E]/60 hover:text-[#7A1E1E]">
            <XIcon size={16} strokeWidth={1.5} />
          </button>
        </div>
      )}

      {/* ADIM 1 — Dosya Yükle */}
      {topluAdim === "yukle" && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {[
              { Ikon: CreditCard, baslik: "Kredi nasıl işler?", icerik: "Her ürün için 1 kredi düşer. İşlem başlamadan önce toplam kredi gösterilir." },
              { Ikon: BarChart3, baslik: "Ne alacaksın?", icerik: "Orijinal dosyan + üretilen listing metinleri tek bir .xlsx dosyasında." },
              { Ikon: AlertTriangle, baslik: "Sayfayı kapatma!", icerik: "İşlem sırasında bu sekmeyi kapatırsan üretim yarıda kesilir." },
              { Ikon: Tag, baslik: "Limit var mı?", icerik: "Tek seferde mevcut kredin kadar ürün işleyebilirsin." },
            ].map((kart, i) => (
              <div key={i} className="bg-[#F1F0EB] rounded-lg border border-[#D8D6CE] p-3">
                <kart.Ikon size={18} strokeWidth={1.5} className="text-[#908E86] mb-1.5" />
                <p className="text-xs font-medium text-[#1A1A17] mb-1">{kart.baslik}</p>
                <p className="text-xs text-[#5A5852]">{kart.icerik}</p>
              </div>
            ))}
          </div>

          <div className="bg-[#F0F4FB] border border-[#BAC9EB] rounded-lg p-4">
            <p className="text-xs font-medium text-[#1E4DD8] mb-2 flex items-center gap-1.5">
              <ClipboardList size={13} strokeWidth={1.5} />
              Dosyanda ne olmalı?
            </p>
            <p className="text-xs text-[#5A5852] mb-2">Sütun adları Türkçe veya İngilizce olabilir — sistem otomatik algılar.</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              {[["Ürün Adı / Product Name", "zorunlu"], ["Kategori / Category", "önerilir"], ["Açıklama / Description", "önerilir"], ["Marka / Brand", "isteğe bağlı"]].map(([alan, durum]) => (
                <div key={alan} className="flex items-center gap-1.5 text-xs text-[#5A5852]">
                  <span className={durum === "zorunlu" ? "text-[#0F5132] font-medium" : durum === "önerilir" ? "text-[#1E4DD8]" : "text-[#D8D6CE]"}>•</span>
                  <span>{alan}</span>
                  <span className={`ml-auto text-[10px] ${durum === "zorunlu" ? "text-[#0F5132] font-medium" : "text-[#908E86]"}`}>{durum}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-[#D8D6CE] rounded-lg p-6 text-center">
            <FolderOpen size={32} strokeWidth={1.5} className="text-[#908E86] mx-auto mb-3" />
            <p className="text-sm font-medium text-[#1A1A17] mb-1">Excel veya CSV yükle</p>
            <p className="text-xs text-[#5A5852] mb-4">Şablon gerekmez — sütunlar otomatik algılanır</p>
            <button
              onClick={() => dosyaRef.current?.click()}
              className="bg-[#1E4DD8] hover:bg-[#163B9E] text-white font-medium px-6 py-2.5 rounded-lg transition-colors text-sm"
            >
              Dosya seç
            </button>
            <input ref={dosyaRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={topluDosyaSec} />
            <p className="text-xs text-[#908E86] mt-3">Desteklenen formatlar: .xlsx, .xls, .csv</p>
          </div>
        </div>
      )}

      {/* ADIM 2 — Önizleme & Ayarlar */}
      {topluAdim === "onizleme" && topluParse && (
        <div className="space-y-3">
          <div className="border border-[#D8D6CE] rounded-lg p-4">
            <p className="text-sm font-medium text-[#1A1A17] mb-3">Dosya analizi</p>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl font-medium text-[#1E4DD8]">{topluParse.toplam}</span>
              <span className="text-sm text-[#5A5852]">ürün bulundu</span>
            </div>
            <div className="space-y-1.5">
              {topluParse.kolonlar.map((k) => (
                <div key={k.hedef} className="flex items-center gap-2 text-sm">
                  <Check size={13} strokeWidth={2} className="text-[#0F5132]" />
                  <span className="font-medium text-[#5A5852]">{k.etiket}</span>
                  <span className="text-[#908E86]">← &quot;{k.kaynak}&quot;</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-[#D8D6CE] rounded-lg p-4">
            <p className="text-xs font-medium text-[#5A5852] mb-2">Platform</p>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(TOPLU_PLATFORM_ETIKET) as TopluPlatform[]).map((p) => (
                <button key={p} onClick={() => setTopluPlatform(p)}
                  className={`py-2 px-2 rounded-lg text-xs font-medium border transition-all ${topluPlatform === p ? "border-[#1E4DD8] bg-[#F0F4FB] text-[#1E4DD8]" : "border-[#D8D6CE] text-[#5A5852] hover:border-[#1E4DD8]/40"}`}>
                  {TOPLU_PLATFORM_ETIKET[p]}
                </button>
              ))}
            </div>
          </div>

          <div className="border border-[#D8D6CE] rounded-lg p-4">
            <p className="text-xs font-medium text-[#5A5852] mb-2">Metin tonu</p>
            <div className="grid grid-cols-3 gap-2">
              {[{ id: "samimi", label: "Samimi" }, { id: "profesyonel", label: "Profesyonel" }, { id: "premium", label: "Premium" }].map((t) => (
                <button key={t.id} onClick={() => setTopluTon(t.id)}
                  className={`py-2 rounded-lg border text-xs font-medium transition-all ${topluTon === t.id ? "border-[#1E4DD8] bg-[#F0F4FB] text-[#1E4DD8]" : "border-[#D8D6CE] text-[#5A5852] hover:border-[#1E4DD8]/40"}`}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {!topluMarkaVarMi && (
            <div className="bg-[#FEF4E7] border border-[#8B4513]/20 rounded-lg p-4">
              <p className="text-xs font-medium text-[#8B4513] mb-2 flex items-center gap-1.5">
                <Lightbulb size={13} strokeWidth={1.5} /> Marka sütunu bulunamadı
              </p>
              <input type="text" value={markaOverride} onChange={(e) => setMarkaOverride(e.target.value)}
                placeholder="Marka adı gir (isteğe bağlı)"
                className="w-full border border-[#8B4513]/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#8B4513]/40 bg-white" />
            </div>
          )}

          <div className="border border-[#D8D6CE] rounded-lg p-4">
            <p className="text-sm font-medium text-[#1A1A17] mb-1">
              {topluParse.toplam} ürün işlenecek — {topluParse.toplam} kredi düşecek
            </p>
            {kullanici && !kullanici.is_admin && (
              <p className={`text-xs mb-3 ${(kullanici.kredi ?? 0) < topluParse.toplam ? "text-[#7A1E1E] font-medium" : "text-[#908E86]"}`}>
                {(kullanici.kredi ?? 0) < topluParse.toplam
                  ? `Yetersiz kredi (mevcut: ${kullanici.kredi})`
                  : `Mevcut krediniz: ${kullanici.kredi}`}
              </p>
            )}
            <button onClick={topluIslemeBaslat}
              disabled={kullanici ? (!kullanici.is_admin && (kullanici.kredi ?? 0) < topluParse.toplam) : false}
              className="w-full bg-[#1E4DD8] hover:bg-[#163B9E] disabled:bg-[#D8D6CE] text-white font-medium py-3 rounded-lg transition-colors text-sm">
              Başlat
            </button>
            <button onClick={() => { setTopluParse(null); setTopluAdim("yukle"); }}
              className="w-full mt-2 text-sm text-[#908E86] hover:text-[#5A5852] py-2">
              Farklı dosya yükle
            </button>
          </div>
        </div>
      )}

      {/* ADIM 3 & 4 — İşlem & Tamamlandı */}
      {(topluAdim === "islem" || topluAdim === "tamamlandi") && (
        <div className="space-y-3">
          {topluAdim === "islem" && (
            <div className="bg-[#FEF4E7] border border-[#8B4513]/20 rounded-lg p-4 flex items-start gap-3">
              <AlertTriangle size={16} strokeWidth={1.5} className="text-[#8B4513] flex-shrink-0 mt-0.5" />
              <p className="text-sm text-[#8B4513]">Üretim devam ediyor — bu sekmeyi kapatma.</p>
            </div>
          )}
          <div className="border border-[#D8D6CE] rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-[#1A1A17]">{topluAdim === "tamamlandi" ? "Tamamlandı" : "İşleniyor..."}</p>
              <span className="text-xs text-[#908E86]">{topluTamamlanan} / {topluIlerlemeler.length}</span>
            </div>
            <div className="h-2 bg-[#F1F0EB] rounded-full mb-4 overflow-hidden">
              <div className="h-full bg-[#1E4DD8] rounded-full transition-all duration-500"
                style={{ width: topluIlerlemeler.length ? `${(topluTamamlanan / topluIlerlemeler.length) * 100}%` : "0%" }} />
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {topluIlerlemeler.map((item) => (
                <div key={item.indeks} className="flex items-center gap-3 py-1.5 border-b border-[#F1F0EB] last:border-0">
                  <div className="w-5 flex-shrink-0 flex items-center justify-center">
                    {item.durum === "bekliyor" && <span className="w-3 h-3 rounded-full border border-[#D8D6CE] block" />}
                    {item.durum === "isleniyor" && <Loader2 size={14} strokeWidth={1.5} className="text-[#1E4DD8] animate-spin" />}
                    {item.durum === "tamam" && <Check size={14} strokeWidth={2} className="text-[#0F5132]" />}
                    {item.durum === "hata" && <XIcon size={14} strokeWidth={2} className="text-[#7A1E1E]" />}
                  </div>
                  <span className={`text-sm flex-1 truncate ${item.durum === "isleniyor" ? "text-[#1E4DD8] font-medium" : item.durum === "tamam" ? "text-[#5A5852]" : item.durum === "hata" ? "text-[#7A1E1E]" : "text-[#908E86]"}`}>
                    {item.urun}
                  </span>
                </div>
              ))}
            </div>
            {topluAdim === "tamamlandi" && (
              <div className="mt-4 pt-4 border-t border-[#F1F0EB]">
                <p className="text-sm text-[#5A5852] mb-3">
                  <span className="text-[#0F5132] font-medium">{topluTamam} başarılı</span>
                  {topluHatali > 0 && <span className="text-[#7A1E1E] font-medium">, {topluHatali} hatalı</span>}
                </p>
                <button onClick={topluExcelIndir}
                  className="w-full bg-[#0F5132] hover:bg-[#0a3d25] text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm">
                  <Download size={15} strokeWidth={1.5} /> Excel indir (.xlsx)
                </button>
                <button onClick={() => { setTopluParse(null); setTopluAdim("yukle"); setTopluIlerlemeler([]); setTopluTamamlanan(0); }}
                  className="w-full mt-2 text-sm text-[#908E86] hover:text-[#5A5852] py-2">
                  Yeni işlem başlat
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div id="giris-formu" style={{ display: aktif ? "block" : "none" }} className="mt-4 bg-white border border-[#D8D6CE] rounded-xl p-6 space-y-4">
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

      {/* Excel toplu üretim */}
      {girisTipi === "excel" && TopluExcelUI}

      {/* Üret butonu + sonuçlar — sadece tekli modlar için */}
      {girisTipi !== "excel" && (
        <>
      <KrediButon
        label={(!kullanici || kullanici.anonim) ? "Ücretsiz başla — 3 kredi hediye" : "İçerik üret"}
        kredi={(!kullanici || kullanici.anonim || kullanici.is_admin) ? undefined : 1}
        kalanKredi={kullanici?.kredi}
        onClick={icerikUret}
        disabled={!uretButonAktif}
        yukleniyor={yukleniyor}
        yukleniyorLabel={YUKLENIYOR_MESAJLARI[yukleniyorMesaj]}
      />
      {(!kullanici || kullanici.anonim) && (
        <p className="text-xs text-center text-[#908E86]">
          Hesabın var mı?{" "}
          <button onClick={onGirisAc} className="text-[#1E4DD8] hover:text-[#163B9E] transition-colors">
            Giriş yap →
          </button>
        </p>
      )}

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
          {/* Listing skor barı */}
          {skor !== null && <SkorBari skor={skor} oneriler={oneriler} ucretsizRevizeKullanildi={ucretsizRevizeKullanildi} onUcretsizRevize={() => { ucretsizRevizeBaslat(); document.getElementById("giris-formu")?.scrollIntoView({ behavior: "smooth" }); }} />}

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
        </>
      )}
    </div>
  );
}
