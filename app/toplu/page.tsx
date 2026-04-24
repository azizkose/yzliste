"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { parseExcel, excelOlustur, type ParseSonucu } from "@/lib/excel-parser";
import * as XLSX from "xlsx";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { CreditCard, BarChart3, AlertTriangle, Tag, ClipboardList, FolderOpen, Lightbulb, Check, X as XIcon, Loader2, Download } from "lucide-react";

type Adim = "yukle" | "onizleme" | "islem" | "tamamlandi";
type Platform = "trendyol" | "hepsiburada" | "amazon" | "n11" | "etsy" | "amazon_usa";

type IlerlemeItem = {
  indeks: number;
  urun: string;
  durum: "bekliyor" | "isleniyor" | "tamam" | "hata";
  icerik?: string;
};

const PLATFORM_ETIKET: Record<Platform, string> = {
  trendyol: "Trendyol",
  hepsiburada: "Hepsiburada",
  amazon: "Amazon TR",
  n11: "N11",
  etsy: "Etsy",
  amazon_usa: "Amazon USA",
};

export default function TopluPage() {
  const [adim, setAdim] = useState<Adim>("yukle");
  const [parse, setParse] = useState<ParseSonucu | null>(null);
  const [platform, setPlatform] = useState<Platform>("trendyol");
  const [ton, setTon] = useState("samimi");
  const [markaOverride, setMarkaOverride] = useState("");
  const [ilerlemeler, setIlerlemeler] = useState<IlerlemeItem[]>([]);
  const [tamamlanan, setTamamlanan] = useState(0);
  const [hata, setHata] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [kredi, setKredi] = useState<number | null>(null);
  const dosyaRef = useRef<HTMLInputElement>(null);
  const sonuclarRef = useRef<string[]>([]);

  const dosyaSec = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setHata(null);
    const dosya = e.target.files?.[0];
    if (!dosya) return;

    const buffer = await dosya.arrayBuffer();
    try {
      const sonuc = parseExcel(buffer);
      if (sonuc.toplam === 0) { setHata("Dosyada geçerli ürün satırı bulunamadı."); return; }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user || user.is_anonymous) { window.location.href = "/kayit"; return; }
      const { data: profil } = await supabase.from("profiles").select("kredi, is_admin").eq("id", user.id).single();
      setUserId(user.id);
      setKredi(profil?.is_admin ? Infinity : (profil?.kredi ?? 0));
      setParse(sonuc);
      setAdim("onizleme");
    } catch {
      setHata("Dosya okunamadı. Excel (.xlsx) veya CSV formatında olduğundan emin olun.");
    }
    e.target.value = "";
  };

  const islemeBaslat = async () => {
    if (!parse || !userId) return;
    setHata(null);

    const basla: IlerlemeItem[] = parse.satirlar.map((s, i) => ({
      indeks: i,
      urun: s.urun_adi || s.aciklama || `Ürün ${i + 1}`,
      durum: "bekliyor",
    }));
    setIlerlemeler(basla);
    sonuclarRef.current = new Array(parse.satirlar.length).fill("");
    setTamamlanan(0);
    setAdim("islem");

    const res = await fetch("/api/toplu", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        satirlar: parse.satirlar,
        platform,
        ton,
        markaOverride: markaOverride.trim() || undefined,
        userId,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      setHata(err.hata || "Bir hata oluştu.");
      setAdim("onizleme");
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
            setIlerlemeler((prev) =>
              prev.map((it) => it.indeks === mesaj.mevcut - 1 ? { ...it, durum: "isleniyor" } : it)
            );
          } else if (mesaj.tip === "sonuc") {
            sonuclarRef.current[mesaj.indeks] = mesaj.icerik;
            setIlerlemeler((prev) =>
              prev.map((it) => it.indeks === mesaj.indeks ? { ...it, durum: "tamam", icerik: mesaj.icerik } : it)
            );
            setTamamlanan((t) => t + 1);
          } else if (mesaj.tip === "hata") {
            setIlerlemeler((prev) =>
              prev.map((it) => it.indeks === mesaj.indeks ? { ...it, durum: "hata" } : it)
            );
            setTamamlanan((t) => t + 1);
          } else if (mesaj.tip === "tamamlandi") {
            setAdim("tamamlandi");
          }
        } catch { /* kötü satır, atla */ }
      }
    }
  };

  const excelIndir = () => {
    if (!parse) return;
    const buffer = excelOlustur(parse.satirlar, sonuclarRef.current, platform);
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `toplu_${platform}_${Date.now()}.xlsx`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const markaVarMi = parse?.kolonlar.some((k) => k.hedef === "marka");
  const tamam = ilerlemeler.filter((i) => i.durum === "tamam").length;
  const hatali = ilerlemeler.filter((i) => i.durum === "hata").length;

  return (
    <>
    <SiteHeader aktifSayfa="toplu" />
    <div className="min-h-screen bg-[#FAFAF8] py-8 px-4">
      <div className="max-w-2xl mx-auto">

        <h1 className="text-xl font-medium text-[#1A1A17] mb-6">Toplu içerik üretimi</h1>

        {hata && (
          <div className="bg-[#FCECEC] border border-[#7A1E1E]/20 rounded-xl p-4 mb-6 flex items-center justify-between gap-3">
            <p className="text-sm text-[#7A1E1E]">{hata}</p>
            <button onClick={() => setHata(null)} className="text-[#7A1E1E]/60 hover:text-[#7A1E1E]">
              <XIcon size={16} strokeWidth={1.5} />
            </button>
          </div>
        )}

        {/* ADIM 1 — Dosya Yükle */}
        {adim === "yukle" && (
          <div className="space-y-4">

            {/* Bilgilendirme kartları */}
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  Ikon: CreditCard,
                  baslik: "Kredi nasıl işler?",
                  icerik: <>Her ürün için <span className="font-medium text-[#1E4DD8]">1 kredi</span> düşer. 50 ürünlük bir dosya 50 kredi harcar. İşlem başlamadan önce toplam kredi gösterilir.</>,
                },
                {
                  Ikon: BarChart3,
                  baslik: "Ne alacaksın?",
                  icerik: <>Orijinal dosyan + üretilen listing metinleri tek bir <span className="font-medium">.xlsx</span> dosyasında. Her ürün satırına platform içeriği eklenir.</>,
                },
                {
                  Ikon: AlertTriangle,
                  baslik: "Sayfayı kapatma!",
                  icerik: "İşlem sırasında bu sekmeyi kapatırsan üretim yarıda kesilir. Excel tamamlanana kadar bekle, sonra indir.",
                },
                {
                  Ikon: Tag,
                  baslik: "Limit var mı?",
                  icerik: <>Tek seferde <span className="font-medium">mevcut kredin kadar</span> ürün işleyebilirsin. Kredi yetersizse önce <Link href="/uret?paket=ac" className="text-[#1E4DD8] underline">İçerik Üretim Kredisi Al</Link>.</>,
                },
              ].map((kart, i) => (
                <div key={i} className="bg-white rounded-xl border border-[#D8D6CE] p-4">
                  <kart.Ikon size={22} strokeWidth={1.5} className="text-[#908E86] mb-2" />
                  <p className="text-xs font-medium text-[#1A1A17] mb-1">{kart.baslik}</p>
                  <p className="text-xs text-[#5A5852]">{kart.icerik}</p>
                </div>
              ))}
            </div>

            {/* Dosya formatı açıklaması */}
            <div className="bg-[#F0F4FB] border border-[#BAC9EB] rounded-xl p-5">
              <p className="text-xs font-medium text-[#1E4DD8] mb-2 flex items-center gap-1.5">
                <ClipboardList size={13} strokeWidth={1.5} />
                Dosyanda ne olmalı?
              </p>
              <p className="text-xs text-[#5A5852] mb-3">Sütun adları Türkçe veya İngilizce olabilir — sistem otomatik algılar. Şablon indirmene gerek yok.</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                {[
                  ["Ürün Adı / Product Name", "zorunlu"],
                  ["Kategori / Category", "önerilir"],
                  ["Açıklama / Description", "önerilir"],
                  ["Marka / Brand", "isteğe bağlı"],
                  ["Renk / Color", "isteğe bağlı"],
                  ["Boyut / Size", "isteğe bağlı"],
                ].map(([alan, durum]) => (
                  <div key={alan} className="flex items-center gap-1.5 text-xs text-[#5A5852]">
                    <span className={durum === "zorunlu" ? "text-[#0F5132] font-medium" : durum === "önerilir" ? "text-[#1E4DD8]" : "text-[#D8D6CE]"}>•</span>
                    <span>{alan}</span>
                    <span className={`ml-auto text-[10px] ${durum === "zorunlu" ? "text-[#0F5132] font-medium" : "text-[#908E86]"}`}>{durum}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Dosya yükle kutusu */}
            <div className="bg-white rounded-xl border border-[#D8D6CE] p-8 text-center">
              <FolderOpen size={40} strokeWidth={1.5} className="text-[#908E86] mx-auto mb-4" />
              <h2 className="text-base font-medium text-[#1A1A17] mb-2">Excel veya CSV yükle</h2>
              <p className="text-sm text-[#5A5852] mb-6">
                Dosyanızda ürün adı, kategori, açıklama gibi sütunlar varsa otomatik algılanır. Şablon gerekmez.
              </p>
              <button
                onClick={() => dosyaRef.current?.click()}
                className="bg-[#1E4DD8] hover:bg-[#163B9E] text-white font-medium px-8 py-3 rounded-xl transition-colors"
              >
                Dosya Seç
              </button>
              <input ref={dosyaRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={dosyaSec} />
              <p className="text-xs text-[#908E86] mt-4">Desteklenen formatlar: .xlsx, .xls, .csv</p>
            </div>
          </div>
        )}

        {/* ADIM 2 — Önizleme & Ayarlar */}
        {adim === "onizleme" && parse && (
          <div className="space-y-4">

            {/* Tespit özeti */}
            <div className="bg-white rounded-xl border border-[#D8D6CE] p-6">
              <h2 className="text-base font-medium text-[#1A1A17] mb-4">Dosya analizi</h2>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl font-medium text-[#1E4DD8]">{parse.toplam}</span>
                <span className="text-sm text-[#5A5852]">ürün bulundu</span>
              </div>
              <div className="space-y-1.5">
                <p className="text-xs font-medium text-[#908E86] uppercase tracking-wide mb-2">Algılanan alanlar</p>
                {parse.kolonlar.map((k) => (
                  <div key={k.hedef} className="flex items-center gap-2 text-sm">
                    <Check size={13} strokeWidth={2} className="text-[#0F5132]" />
                    <span className="font-medium text-[#5A5852]">{k.etiket}</span>
                    <span className="text-[#908E86]">← &quot;{k.kaynak}&quot;</span>
                  </div>
                ))}
                {parse.tespit_edilemeyen.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-[#F1F0EB]">
                    <p className="text-xs text-[#908E86]">
                      Eşleşmeyen sütunlar (ek bilgi olarak dahil edilir):{" "}
                      {parse.tespit_edilemeyen.join(", ")}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Platform */}
            <div className="bg-white rounded-xl border border-[#D8D6CE] p-6">
              <h3 className="text-sm font-medium text-[#5A5852] mb-3">Platform</h3>
              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(PLATFORM_ETIKET) as Platform[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPlatform(p)}
                    className={`py-2 px-3 rounded-xl text-sm font-medium border-2 transition-all ${
                      platform === p
                        ? "border-[#1E4DD8] bg-[#F0F4FB] text-[#1E4DD8]"
                        : "border-[#D8D6CE] text-[#5A5852] hover:border-[#1E4DD8]/40"
                    }`}
                  >
                    {PLATFORM_ETIKET[p]}
                  </button>
                ))}
              </div>
            </div>

            {/* Ton */}
            <div className="bg-white rounded-xl border border-[#D8D6CE] p-6">
              <h3 className="text-sm font-medium text-[#5A5852] mb-3">Metin tonu</h3>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "samimi", label: "Samimi", aciklama: "Sıcak, yakın" },
                  { id: "profesyonel", label: "Profesyonel", aciklama: "Resmi, kurumsal" },
                  { id: "premium", label: "Premium", aciklama: "Lüks, seçkin" },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTon(t.id)}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${
                      ton === t.id
                        ? "border-[#1E4DD8] bg-[#F0F4FB]"
                        : "border-[#D8D6CE] hover:border-[#1E4DD8]/40"
                    }`}
                  >
                    <p className={`text-xs font-medium ${ton === t.id ? "text-[#1E4DD8]" : "text-[#1A1A17]"}`}>{t.label}</p>
                    <p className="text-xs text-[#908E86] mt-0.5">{t.aciklama}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Marka uyarısı */}
            {!markaVarMi && (
              <div className="bg-[#FEF4E7] border border-[#8B4513]/20 rounded-xl p-4">
                <p className="text-sm font-medium text-[#8B4513] mb-2 flex items-center gap-1.5">
                  <Lightbulb size={14} strokeWidth={1.5} />
                  Verilerinizde marka sütunu yok
                </p>
                <p className="text-xs text-[#8B4513]/80 mb-3">
                  Marka adı girerseniz AI tüm ürünlerde daha tutarlı ve kaliteli metin üretir.
                  Boş bırakırsanız profil bilginiz kullanılır.
                </p>
                <input
                  type="text"
                  value={markaOverride}
                  onChange={(e) => setMarkaOverride(e.target.value)}
                  placeholder="orn: Ayşe Tekstil, TechStore TR (isteğe bağlı)"
                  className="w-full border border-[#8B4513]/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#8B4513]/40 bg-white"
                />
              </div>
            )}

            {/* Kredi onayı */}
            <div className="bg-white rounded-xl border border-[#D8D6CE] p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-[#1A1A17]">
                    {parse.toplam} ürün işlenecek — {parse.toplam} kredi düşecek
                  </p>
                  {kredi !== null && kredi !== Infinity && (
                    <p className={`text-xs mt-1 ${kredi < parse.toplam ? "text-[#7A1E1E] font-medium" : "text-[#908E86]"}`}>
                      {kredi < parse.toplam
                        ? `Yetersiz kredi (mevcut: ${kredi})`
                        : `Mevcut krediniz: ${kredi}`}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={islemeBaslat}
                disabled={kredi !== null && kredi !== Infinity && kredi < parse.toplam}
                className="w-full bg-[#1E4DD8] hover:bg-[#163B9E] disabled:bg-[#D8D6CE] text-white font-medium py-3 rounded-xl transition-colors"
              >
                Başlat →
              </button>
              <button
                onClick={() => { setParse(null); setAdim("yukle"); }}
                className="w-full mt-2 text-sm text-[#908E86] hover:text-[#5A5852] py-2"
              >
                Farklı dosya yükle
              </button>
            </div>
          </div>
        )}

        {/* ADIM 3 — İşlem */}
        {(adim === "islem" || adim === "tamamlandi") && (
          <div className="space-y-4">
          {adim === "islem" && (
            <div className="bg-[#FEF4E7] border border-[#8B4513]/20 rounded-xl p-4 flex items-start gap-3">
              <AlertTriangle size={18} strokeWidth={1.5} className="text-[#8B4513] flex-shrink-0 mt-0.5" />
              <p className="text-sm text-[#8B4513]">Üretim devam ediyor — bu sekmeyi kapatma veya sayfadan ayrılma. İşlem bitince Excel dosyası hazır olacak.</p>
            </div>
          )}
          <div className="bg-white rounded-xl border border-[#D8D6CE] p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-medium text-[#1A1A17]">
                {adim === "tamamlandi" ? "Tamamlandı" : "İşleniyor..."}
              </h2>
              <span className="text-sm text-[#908E86]">{tamamlanan} / {ilerlemeler.length}</span>
            </div>

            {/* Progress bar */}
            <div className="h-2 bg-[#F1F0EB] rounded-full mb-6 overflow-hidden">
              <div
                className="h-full bg-[#1E4DD8] rounded-full transition-all duration-500"
                style={{ width: ilerlemeler.length ? `${(tamamlanan / ilerlemeler.length) * 100}%` : "0%" }}
              />
            </div>

            {/* Ürün listesi */}
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {ilerlemeler.map((item) => (
                <div key={item.indeks} className="flex items-center gap-3 py-2 border-b border-[#F1F0EB] last:border-0">
                  <div className="w-5 flex-shrink-0 text-center flex items-center justify-center">
                    {item.durum === "bekliyor" && <span className="w-3 h-3 rounded-full border border-[#D8D6CE] block" />}
                    {item.durum === "isleniyor" && (
                      <Loader2 size={14} strokeWidth={1.5} className="text-[#1E4DD8] animate-spin" />
                    )}
                    {item.durum === "tamam" && <Check size={14} strokeWidth={2} className="text-[#0F5132]" />}
                    {item.durum === "hata" && <XIcon size={14} strokeWidth={2} className="text-[#7A1E1E]" />}
                  </div>
                  <span className={`text-sm flex-1 truncate ${
                    item.durum === "isleniyor" ? "text-[#1E4DD8] font-medium" :
                    item.durum === "tamam" ? "text-[#5A5852]" :
                    item.durum === "hata" ? "text-[#7A1E1E]" : "text-[#908E86]"
                  }`}>
                    {item.urun}
                  </span>
                </div>
              ))}
            </div>

            {/* Tamamlandı özet */}
            {adim === "tamamlandi" && (
              <div className="mt-6 pt-4 border-t border-[#F1F0EB]">
                <p className="text-sm text-[#5A5852] mb-4">
                  <span className="text-[#0F5132] font-medium">{tamam} başarılı</span>
                  {hatali > 0 && <span className="text-[#7A1E1E] font-medium">, {hatali} hatalı</span>}
                </p>
                <button
                  onClick={excelIndir}
                  className="w-full bg-[#0F5132] hover:bg-[#0a3d25] text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <Download size={16} strokeWidth={1.5} />
                  Excel İndir (.xlsx)
                </button>
                <button
                  onClick={() => { setParse(null); setAdim("yukle"); setIlerlemeler([]); setTamamlanan(0); }}
                  className="w-full mt-2 text-sm text-[#908E86] hover:text-[#5A5852] py-2"
                >
                  Yeni işlem başlat
                </button>
              </div>
            )}
          </div>
          </div>
        )}
      </div>
    </div>
    <SiteFooter />
    </>
  );
}
