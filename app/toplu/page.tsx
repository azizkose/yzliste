"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { parseExcel, excelOlustur, type ParseSonucu } from "@/lib/excel-parser";
import * as XLSX from "xlsx";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

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

      // Kullanıcı kontrolü — anonim de dahil, üye olmayan üretemez
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || user.is_anonymous) { window.location.href = "/auth?kayit=1"; return; }
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
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">

        <h1 className="text-xl font-bold text-gray-800 mb-6">Toplu İçerik Üretimi</h1>

        {hata && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center justify-between gap-3">
            <p className="text-sm text-red-700">{hata}</p>
            <button onClick={() => setHata(null)} className="text-red-400 hover:text-red-600 text-xl">×</button>
          </div>
        )}

        {/* ADIM 1 — Dosya Yükle */}
        {adim === "yukle" && (
          <div className="space-y-4">

            {/* Bilgilendirme kartları */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-2xl shadow p-4">
                <div className="text-2xl mb-2">💳</div>
                <p className="text-xs font-semibold text-gray-800 mb-1">Kredi nasıl işler?</p>
                <p className="text-xs text-gray-500">Her ürün için <span className="font-semibold text-orange-600">1 kredi</span> düşer. 50 ürünlük bir dosya 50 kredi harcar. İşlem başlamadan önce toplam kredi gösterilir.</p>
              </div>
              <div className="bg-white rounded-2xl shadow p-4">
                <div className="text-2xl mb-2">📊</div>
                <p className="text-xs font-semibold text-gray-800 mb-1">Ne alacaksın?</p>
                <p className="text-xs text-gray-500">Orijinal dosyan + üretilen listing metinleri tek bir <span className="font-semibold">.xlsx</span> dosyasında. Her ürün satırına platform içeriği eklenir.</p>
              </div>
              <div className="bg-white rounded-2xl shadow p-4">
                <div className="text-2xl mb-2">⚠️</div>
                <p className="text-xs font-semibold text-gray-800 mb-1">Sayfayı kapatma!</p>
                <p className="text-xs text-gray-500">İşlem sırasında bu sekmeyi kapatırsan üretim yarıda kesilir. Excel tamamlanana kadar bekle, sonra indir.</p>
              </div>
              <div className="bg-white rounded-2xl shadow p-4">
                <div className="text-2xl mb-2">🏷️</div>
                <p className="text-xs font-semibold text-gray-800 mb-1">Limit var mı?</p>
                <p className="text-xs text-gray-500">Tek seferde <span className="font-semibold">mevcut kredin kadar</span> ürün işleyebilirsin. Kredi yetersizse önce <Link href="/?paket=ac" className="text-orange-500 underline">İçerik Üretim Kredisi Al</Link>.</p>
              </div>
            </div>

            {/* Dosya formatı açıklaması */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
              <p className="text-xs font-semibold text-blue-800 mb-2">📋 Dosyanda ne olmalı?</p>
              <p className="text-xs text-blue-700 mb-3">Sütun adları Türkçe veya İngilizce olabilir — sistem otomatik algılar. Şablon indirmene gerek yok.</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                {[
                  ["Ürün Adı / Product Name", "zorunlu"],
                  ["Kategori / Category", "önerilir"],
                  ["Açıklama / Description", "önerilir"],
                  ["Marka / Brand", "isteğe bağlı"],
                  ["Renk / Color", "isteğe bağlı"],
                  ["Boyut / Size", "isteğe bağlı"],
                ].map(([alan, durum]) => (
                  <div key={alan} className="flex items-center gap-1.5 text-xs text-blue-700">
                    <span className={durum === "zorunlu" ? "text-green-600 font-bold" : durum === "önerilir" ? "text-blue-600" : "text-gray-400"}>•</span>
                    <span>{alan}</span>
                    <span className={`ml-auto text-[10px] ${durum === "zorunlu" ? "text-green-600 font-semibold" : "text-gray-400"}`}>{durum}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Dosya yükle kutusu */}
            <div className="bg-white rounded-2xl shadow p-8 text-center">
              <div className="text-4xl mb-4">📂</div>
              <h2 className="text-base font-semibold text-gray-800 mb-2">Excel veya CSV Yükle</h2>
              <p className="text-sm text-gray-500 mb-6">
                Dosyanızda ürün adı, kategori, açıklama gibi sütunlar varsa otomatik algılanır. Şablon gerekmez.
              </p>
              <button
                onClick={() => dosyaRef.current?.click()}
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
              >
                Dosya Seç
              </button>
              <input ref={dosyaRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={dosyaSec} />
              <p className="text-xs text-gray-400 mt-4">Desteklenen formatlar: .xlsx, .xls, .csv</p>
            </div>
          </div>
        )}

        {/* ADIM 2 — Önizleme & Ayarlar */}
        {adim === "onizleme" && parse && (
          <div className="space-y-4">

            {/* Tespit özeti */}
            <div className="bg-white rounded-2xl shadow p-6">
              <h2 className="text-base font-semibold text-gray-800 mb-4">Dosya Analizi</h2>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl font-bold text-orange-600">{parse.toplam}</span>
                <span className="text-sm text-gray-600">ürün bulundu</span>
              </div>
              <div className="space-y-1.5">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Algılanan Alanlar</p>
                {parse.kolonlar.map((k) => (
                  <div key={k.hedef} className="flex items-center gap-2 text-sm">
                    <span className="text-green-500">✓</span>
                    <span className="font-medium text-gray-700">{k.etiket}</span>
                    <span className="text-gray-400">← &quot;{k.kaynak}&quot;</span>
                  </div>
                ))}
                {parse.tespit_edilemeyen.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-gray-100">
                    <p className="text-xs text-gray-400">
                      Eşleşmeyen sütunlar (ek bilgi olarak dahil edilir):{" "}
                      {parse.tespit_edilemeyen.join(", ")}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Platform */}
            <div className="bg-white rounded-2xl shadow p-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Platform</h3>
              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(PLATFORM_ETIKET) as Platform[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPlatform(p)}
                    className={`py-2 px-3 rounded-xl text-sm font-medium border-2 transition-all ${
                      platform === p ? "border-orange-400 bg-orange-50 text-orange-700" : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    {PLATFORM_ETIKET[p]}
                  </button>
                ))}
              </div>
            </div>

            {/* Ton */}
            <div className="bg-white rounded-2xl shadow p-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Metin Tonu</h3>
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
                      ton === t.id ? "border-orange-400 bg-orange-50" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <p className={`text-xs font-semibold ${ton === t.id ? "text-orange-600" : "text-gray-700"}`}>{t.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{t.aciklama}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Marka uyarısı */}
            {!markaVarMi && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <p className="text-sm font-medium text-yellow-800 mb-2">
                  💡 Verilerinizde marka sütunu yok
                </p>
                <p className="text-xs text-yellow-700 mb-3">
                  Marka adı girerseniz AI tüm ürünlerde daha tutarlı ve kaliteli metin üretir.
                  Boş bırakırsanız profil bilginiz kullanılır.
                </p>
                <input
                  type="text"
                  value={markaOverride}
                  onChange={(e) => setMarkaOverride(e.target.value)}
                  placeholder="orn: Ayşe Tekstil, TechStore TR (isteğe bağlı)"
                  className="w-full border border-yellow-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white"
                />
              </div>
            )}

            {/* Kredi onayı */}
            <div className="bg-white rounded-2xl shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {parse.toplam} ürün işlenecek — {parse.toplam} kredi düşecek
                  </p>
                  {kredi !== null && kredi !== Infinity && (
                    <p className={`text-xs mt-1 ${kredi < parse.toplam ? "text-red-500 font-medium" : "text-gray-400"}`}>
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
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white font-semibold py-3 rounded-xl transition-colors"
              >
                Başlat →
              </button>
              <button
                onClick={() => { setParse(null); setAdim("yukle"); }}
                className="w-full mt-2 text-sm text-gray-400 hover:text-gray-600 py-2"
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
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
              <span className="text-xl flex-shrink-0">⚠️</span>
              <p className="text-sm text-amber-800">Üretim devam ediyor — bu sekmeyi kapatma veya sayfadan ayrılma. İşlem bitince Excel dosyası hazır olacak.</p>
            </div>
          )}
          <div className="bg-white rounded-2xl shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-800">
                {adim === "tamamlandi" ? "Tamamlandı" : "İşleniyor..."}
              </h2>
              <span className="text-sm text-gray-500">{tamamlanan} / {ilerlemeler.length}</span>
            </div>

            {/* Progress bar */}
            <div className="h-2 bg-gray-100 rounded-full mb-6 overflow-hidden">
              <div
                className="h-full bg-orange-500 rounded-full transition-all duration-500"
                style={{ width: ilerlemeler.length ? `${(tamamlanan / ilerlemeler.length) * 100}%` : "0%" }}
              />
            </div>

            {/* Ürün listesi */}
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {ilerlemeler.map((item) => (
                <div key={item.indeks} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                  <div className="w-5 flex-shrink-0 text-center">
                    {item.durum === "bekliyor" && <span className="text-gray-300">○</span>}
                    {item.durum === "isleniyor" && (
                      <span className="inline-block w-4 h-4 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
                    )}
                    {item.durum === "tamam" && <span className="text-green-500">✓</span>}
                    {item.durum === "hata" && <span className="text-red-400">✗</span>}
                  </div>
                  <span className={`text-sm flex-1 truncate ${
                    item.durum === "isleniyor" ? "text-orange-600 font-medium" :
                    item.durum === "tamam" ? "text-gray-700" :
                    item.durum === "hata" ? "text-red-500" : "text-gray-400"
                  }`}>
                    {item.urun}
                  </span>
                </div>
              ))}
            </div>

            {/* Tamamlandı özet */}
            {adim === "tamamlandi" && (
              <div className="mt-6 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-600 mb-4">
                  <span className="text-green-600 font-semibold">{tamam} başarılı</span>
                  {hatali > 0 && <span className="text-red-500 font-medium">, {hatali} hatalı</span>}
                </p>
                <button
                  onClick={excelIndir}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition-colors"
                >
                  Excel İndir (.xlsx)
                </button>
                <button
                  onClick={() => { setParse(null); setAdim("yukle"); setIlerlemeler([]); setTamamlanan(0); }}
                  className="w-full mt-2 text-sm text-gray-400 hover:text-gray-600 py-2"
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
