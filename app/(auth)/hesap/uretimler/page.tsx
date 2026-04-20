"use client";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Uretim = {
  id: string;
  urun_adi: string;
  platform: string;
  giris_tipi: string;
  sonuc: string;
  created_at: string;
};

type SonucBolum = { baslik: string; ikon: string; icerik: string };

function sonucuBolumle(sonuc: string): SonucBolum[] {
  if (!sonuc) return [];
  sonuc = sonuc.replace(/\*\*/g, "").replace(/\*/g, "");
  const bolumler: SonucBolum[] = [];
  const baslikMatch = sonuc.match(/(?:📌\s*)?(?:BAŞLIK|Başlık)[:\n]+([^\n🔹📄🏷]+)/i);
  const ozellikMatch = sonuc.match(/(?:🔹\s*)?(?:ÖZELLİKLER|Özellikler)[:\n]+([\s\S]+?)(?=📄|🏷|$)/i);
  const aciklamaMatch = sonuc.match(/(?:📄\s*)?(?:AÇIKLAMA|Açıklama)[:\n]+([\s\S]+?)(?=🏷|$)/i);
  const etiketMatch = sonuc.match(/(?:🏷️?\s*)?(?:ETİKETLER|Etiketler)[:\n]+([\s\S]+?)$/i);
  if (baslikMatch) bolumler.push({ baslik: "Başlık", ikon: "📌", icerik: baslikMatch[1].trim() });
  if (ozellikMatch) bolumler.push({ baslik: "Özellikler", ikon: "🔹", icerik: ozellikMatch[1].trim() });
  if (aciklamaMatch) bolumler.push({ baslik: "Açıklama", ikon: "📄", icerik: aciklamaMatch[1].trim() });
  if (etiketMatch) bolumler.push({ baslik: "Arama Etiketleri", ikon: "🏷️", icerik: etiketMatch[1].trim() });
  if (bolumler.length === 0) bolumler.push({ baslik: "İçerik", ikon: "📋", icerik: sonuc });
  return bolumler;
}

const platformRenk: Record<string, string> = {
  trendyol: "bg-orange-100 text-orange-700",
  hepsiburada: "bg-orange-100 text-orange-600",
  amazon: "bg-yellow-100 text-yellow-700",
  n11: "bg-blue-100 text-blue-700",
  etsy: "bg-rose-100 text-rose-700",
  amazon_usa: "bg-amber-100 text-amber-700",
};

const SAYFA_BOYUTU = 20;

export default function HesapUretimlerPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [uretimler, setUretimler] = useState<Uretim[]>([]);
  const [uretimYukleniyor, setUretimYukleniyor] = useState(false);
  const [seciliUretim, setSeciliUretim] = useState<Uretim | null>(null);
  const [sayfaNo, setSayfaNo] = useState(0);
  const [toplamSayfa, setToplamSayfa] = useState(0);

  const router = useRouter();

  const uretimYukle = useCallback(async (uid: string, sayfa: number) => {
    setUretimYukleniyor(true);
    const { data } = await supabase
      .from("uretimler")
      .select("*")
      .eq("user_id", uid)
      .order("created_at", { ascending: false })
      .range(sayfa * SAYFA_BOYUTU, (sayfa + 1) * SAYFA_BOYUTU - 1);
    if (data) {
      if (sayfa === 0) setUretimler(data);
      else setUretimler((prev) => [...prev, ...data]);
    }
    setUretimYukleniyor(false);
  }, []);

  const yukle = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/giris"); return; }
    setUserId(user.id);

    const { count } = await supabase
      .from("uretimler")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);
    setToplamSayfa(count || 0);

    await uretimYukle(user.id, 0);
    setYukleniyor(false);
  }, [router, uretimYukle]);

  useEffect(() => { yukle(); }, [yukle]);

  const dahaFazlaYukle = async () => {
    if (!userId) return;
    const yeniSayfa = sayfaNo + 1;
    setSayfaNo(yeniSayfa);
    await uretimYukle(userId, yeniSayfa);
  };

  if (yukleniyor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="py-8 px-4">
        <div className="max-w-3xl mx-auto space-y-6">

          <Link href="/hesap" className="text-sm text-gray-500 hover:text-gray-700">← Hesap</Link>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Üretim Geçmişi</h1>
              <p className="text-sm text-gray-500 mt-0.5">Toplam {toplamSayfa} üretim</p>
            </div>
            <Link href="/uret" className="bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors">
              + Yeni Üretim
            </Link>
          </div>

          {uretimler.length === 0 ? (
            <div className="bg-white rounded-2xl shadow p-12 text-center space-y-3">
              <div className="text-4xl">📝</div>
              <p className="text-sm text-gray-500">Henüz hiç içerik üretmediniz.</p>
              <Link href="/uret" className="inline-block bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors">
                İçerik Üret →
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow overflow-hidden">
              <div className="divide-y divide-gray-50">
                {uretimler.map((u) => {
                  const bolumler = sonucuBolumle(u.sonuc);
                  const acik = seciliUretim?.id === u.id;
                  return (
                    <div key={u.id} className={`transition-all ${acik ? "bg-indigo-50" : "hover:bg-gray-50"}`}>
                      <button onClick={() => setSeciliUretim(acik ? null : u)} className="w-full text-left p-4">
                        <div className="flex justify-between items-start gap-3">
                          <div className="flex-1 min-w-0">
                            <span className="text-sm font-medium text-gray-800 block truncate">{u.urun_adi || "İsimsiz ürün"}</span>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`text-xs px-2 py-0.5 rounded-full ${platformRenk[u.platform] || "bg-gray-100 text-gray-600"}`}>{u.platform}</span>
                              <span className="text-xs text-gray-400">
                                {new Date(u.created_at).toLocaleString("tr-TR", { timeZone: "Europe/Istanbul", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}
                              </span>
                            </div>
                          </div>
                          <span className={`text-xs text-gray-400 flex-shrink-0 transition-transform ${acik ? "rotate-180" : ""}`}>▼</span>
                        </div>
                      </button>
                      {acik && (
                        <div className="px-4 pb-4 space-y-2 border-t border-indigo-200 pt-3">
                          {bolumler.map((bolum, bi) => (
                            <div key={bi} className="bg-white rounded-xl border border-gray-100 p-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-semibold text-gray-700">{bolum.ikon} {bolum.baslik}</span>
                                <button
                                  onClick={() => navigator.clipboard.writeText(bolum.icerik)}
                                  className="text-xs text-indigo-500 hover:text-indigo-600 font-medium px-2 py-1 rounded-lg hover:bg-indigo-50 transition-colors"
                                >
                                  Kopyala
                                </button>
                              </div>
                              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{bolum.icerik}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              {uretimler.length >= (sayfaNo + 1) * SAYFA_BOYUTU && (
                <div className="px-5 py-4 border-t border-gray-50 text-center">
                  <button
                    onClick={dahaFazlaYukle}
                    disabled={uretimYukleniyor}
                    className="text-sm text-indigo-500 hover:text-indigo-700 font-medium disabled:opacity-50"
                  >
                    {uretimYukleniyor ? "Yükleniyor..." : "Daha fazla göster ↓"}
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </main>
  );
}
