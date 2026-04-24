"use client";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertTriangle, Pencil, Camera, Search } from "lucide-react";

type Metrik = {
  toplamKullanici: number;
  toplamUretim: number;
  bugunUretim: number;
  buHaftaUretim: number;
  toplamKredi: number;
  toplamInputToken: number;
  toplamOutputToken: number;
  toplamApiMaliyet: number;
  bugunMaliyet: number;
  platformDagilim: Record<string, number>;
  girisTipiDagilim: Record<string, number>;
  sonKullanicilar: { email: string; kredi: number; created_at: string }[];
  sonUretimler: { urun_adi: string; platform: string; created_at: string; input_token: number; output_token: number; api_cost: number }[];
};

export default function AdminPage() {
  const [metrik, setMetrik] = useState<Metrik | null>(null);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState<string | null>(null);
  const [period, setPeriod] = useState("all");
  const router = useRouter();

  const metrikleriYukle = useCallback(async () => {
    setYukleniyor(true);
    setHata(null);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { router.push("/giris"); return; }

    const res = await fetch(`/api/admin/metrics?period=${period}`, {
      headers: { Authorization: `Bearer ${session.access_token}` },
    });

    if (res.status === 403) { router.push("/"); return; }
    if (!res.ok) { setHata("Metrikler yüklenemedi."); setYukleniyor(false); return; }

    const data = await res.json();
    setMetrik(data);
    setYukleniyor(false);
  }, [router, period]);

  useEffect(() => { metrikleriYukle(); }, [metrikleriYukle, period]); // eslint-disable-line react-hooks/set-state-in-effect

  if (yukleniyor) {
    return (
      <main className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
        <div className="text-[#908E86]">Yükleniyor...</div>
      </main>
    );
  }

  if (hata) {
    return (
      <main className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
        <div className="text-[#7A1E1E]">{hata}</div>
      </main>
    );
  }

  if (!metrik) return null;

  // Gerçek api_cost DB'den geliyor (uret route'da Sonnet 4.6: $3/$15/MTok)
  const toplamMaliyet = metrik.toplamApiMaliyet || 0;
  const uretimBasiMaliyet = metrik.toplamUretim > 0 ? toplamMaliyet / metrik.toplamUretim : 0;
  // Token tabanlı tahmini (api_cost yoksa fallback)
  const tokenMaliyet = (metrik.toplamInputToken / 1_000_000) * 3 + (metrik.toplamOutputToken / 1_000_000) * 15;

  return (
    <main className="min-h-screen bg-[#FAFAF8] py-8 px-4">
      <div className="max-w-5xl mx-auto">

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-medium text-[#1A1A17]">Admin dashboard</h1>
            <p className="text-sm text-[#908E86]">YZListe — Sistem metrikleri</p>
          </div>
          <div className="flex gap-3">
            <button onClick={metrikleriYukle}
              className="text-sm bg-white border border-[#D8D6CE] px-4 py-2 rounded-lg hover:bg-[#F1F0EB] transition-colors">
              Yenile
            </button>
            <Link href="/" className="text-sm bg-[#1E4DD8] text-white px-4 py-2 rounded-lg hover:bg-[#163B9E] transition-colors">
              Uygulamaya dön
            </Link>
          </div>
        </div>

        {/* Bütçe uyarısı */}
        {metrik && metrik.bugunMaliyet > 5 && (
          <div className="bg-[#FCECEC] border border-[#7A1E1E]/20 rounded-xl p-4 mb-6 flex items-center gap-3">
            <AlertTriangle size={16} strokeWidth={1.5} className="text-[#7A1E1E] flex-shrink-0" />
            <div>
              <div className="text-sm font-medium text-[#7A1E1E]">Günlük maliyet uyarısı</div>
              <div className="text-xs text-[#7A1E1E]/70">
                Bugünkü API maliyeti ${metrik.bugunMaliyet.toFixed(2)} — $5 limitini aştı!
              </div>
            </div>
          </div>
        )}

        {/* Ana metrikler */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Toplam kullanıcı", value: metrik.toplamKullanici },
            { label: "Toplam üretim", value: metrik.toplamUretim },
            { label: "Bugün üretim", value: metrik.bugunUretim },
            { label: "Bu hafta", value: metrik.buHaftaUretim },
          ].map((m) => (
            <div key={m.label} className="bg-white rounded-xl border border-[#D8D6CE] p-5">
              <div className="text-3xl font-medium text-[#1E4DD8]">{m.value}</div>
              <div className="text-sm text-[#908E86] mt-1">{m.label}</div>
            </div>
          ))}
        </div>

        {/* Maliyet & Token */}
        <div className="bg-white rounded-xl border border-[#D8D6CE] p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-[#5A5852]">API kullanımı & maliyet (gerçek)</h3>
            <div className="flex gap-2">
              {[
                { key: "today", label: "Bugün" },
                { key: "week", label: "Bu hafta" },
                { key: "month", label: "Bu ay" },
                { key: "all", label: "Tümü" },
              ].map((p) => (
                <button
                  key={p.key}
                  onClick={() => setPeriod(p.key)}
                  className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                    period === p.key
                      ? "bg-[#1E4DD8] text-white"
                      : "bg-[#F1F0EB] text-[#5A5852] hover:bg-[#D8D6CE]"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-[#F0F4FB] rounded-xl p-4">
              <div className="text-xl font-medium text-[#1E4DD8]">{metrik.toplamInputToken.toLocaleString()}</div>
              <div className="text-xs text-[#908E86] mt-1">Input token</div>
            </div>
            <div className="bg-[#F1F0EB] rounded-xl p-4">
              <div className="text-xl font-medium text-[#5A5852]">{metrik.toplamOutputToken.toLocaleString()}</div>
              <div className="text-xs text-[#908E86] mt-1">Output token</div>
            </div>
            <div className="bg-[#FCECEC] rounded-xl p-4">
              <div className="text-xl font-medium text-[#7A1E1E]">
                ${(toplamMaliyet > 0 ? toplamMaliyet : tokenMaliyet).toFixed(4)}
              </div>
              <div className="text-xs text-[#908E86] mt-1">
                Toplam maliyet {toplamMaliyet === 0 && tokenMaliyet > 0 && <span className="text-[#D8D6CE]">(tahmini)</span>}
              </div>
            </div>
            <div className="bg-[#FEF4E7] rounded-xl p-4">
              <div className="text-xl font-medium text-[#8B4513]">${uretimBasiMaliyet.toFixed(5)}</div>
              <div className="text-xs text-[#908E86] mt-1">Üretim başı</div>
            </div>
            <div className="bg-[#F0F4FB] rounded-xl p-4">
              <div className="text-xl font-medium text-[#1E4DD8]">{metrik.toplamKredi}</div>
              <div className="text-xs text-[#908E86] mt-1">Kalan kredi</div>
            </div>
          </div>
          <p className="text-xs text-[#908E86] mt-3">
            * Metin: Sonnet 4.6 — $3/MTok input, $15/MTok output. Görsel: Bria $0.012/görsel. Video: Kling $0.28/5sn, $0.56/10sn.
          </p>
        </div>

        {/* Statik Fiyatlama & Marj Tablosu */}
        <div className="bg-white rounded-xl border border-[#D8D6CE] p-5 mb-6">
          <h3 className="text-sm font-medium text-[#5A5852] mb-4">Ürün maliyet & marj tablosu</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-[#908E86] border-b border-[#F1F0EB]">
                  <th className="text-left pb-2 font-medium">Üretim tipi</th>
                  <th className="text-right pb-2 font-medium">API maliyet</th>
                  <th className="text-right pb-2 font-medium">Kredi</th>
                  <th className="text-right pb-2 font-medium">Birim fiyat (büyük)</th>
                  <th className="text-right pb-2 font-medium">Marj</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F0EB]">
                {[
                  { tip: "Metin (Sonnet 4.6)", maliyet: "$0.005", kredi: 1, fiyat: "₺2.49", marj: "+1010%" },
                  { tip: "Metin düzenleme", maliyet: "$0.003", kredi: 1, fiyat: "₺2.49", marj: "+1500%+" },
                  { tip: "Görsel (RMBG+Bria)", maliyet: "$0.012", kredi: 1, fiyat: "₺2.49", marj: "+363%" },
                  { tip: "Video 5sn (Kling v2.1)", maliyet: "$0.28", kredi: 10, fiyat: "₺24.90", marj: "+98%" },
                  { tip: "Video 10sn (Kling v2.1)", maliyet: "$0.56", kredi: 20, fiyat: "₺49.80", marj: "+98%" },
                  { tip: "Sosyal caption", maliyet: "$0.003", kredi: 1, fiyat: "₺2.49", marj: "+1500%+" },
                  { tip: "Sosyal kit (caption+görsel)", maliyet: "$0.017", kredi: 2, fiyat: "₺4.98", marj: "+553%" },
                  { tip: "Virtual try-on (FASHN)", maliyet: "$0.075", kredi: 3, fiyat: "₺7.47", marj: "+122%" },
                ].map((r) => (
                  <tr key={r.tip} className="text-sm">
                    <td className="py-2 text-[#5A5852]">{r.tip}</td>
                    <td className="py-2 text-right text-[#908E86] font-mono">{r.maliyet}</td>
                    <td className="py-2 text-right text-[#908E86]">{r.kredi} kr</td>
                    <td className="py-2 text-right text-[#5A5852]">{r.fiyat}</td>
                    <td className={`py-2 text-right font-medium ${parseInt(r.marj) >= 200 ? "text-[#0F5132]" : parseInt(r.marj) >= 100 ? "text-[#8B4513]" : "text-[#7A1E1E]"}`}>
                      {r.marj}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-[#908E86] mt-2">* Büyük paket: ₺2.49/kredi. $ → ₺ kuru: ~₺35.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">

          {/* Platform dağılımı */}
          <div className="bg-white rounded-xl border border-[#D8D6CE] p-5">
            <h3 className="text-sm font-medium text-[#5A5852] mb-3">Platform dağılımı</h3>
            <div className="space-y-2">
              {Object.entries(metrik.platformDagilim).map(([platform, sayi]) => (
                <div key={platform} className="flex justify-between items-center">
                  <span className="text-sm text-[#5A5852] capitalize">{platform}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-[#F1F0EB] rounded-full h-2">
                      <div className="bg-[#7B9BD9] h-2 rounded-full"
                        style={{ width: `${metrik.toplamUretim > 0 ? (sayi / metrik.toplamUretim) * 100 : 0}%` }} />
                    </div>
                    <span className="text-sm font-medium text-[#1A1A17] w-6 text-right">{sayi}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Giriş tipi */}
          <div className="bg-white rounded-xl border border-[#D8D6CE] p-5">
            <h3 className="text-sm font-medium text-[#5A5852] mb-3">Giriş tipi dağılımı</h3>
            <div className="space-y-2">
              {Object.entries(metrik.girisTipiDagilim).map(([tip, sayi]) => (
                <div key={tip} className="flex justify-between items-center">
                  <span className="text-sm text-[#5A5852] flex items-center gap-1.5">
                    {tip === "manuel"
                      ? <Pencil size={12} strokeWidth={1.5} className="text-[#908E86]" />
                      : tip === "foto"
                      ? <Camera size={12} strokeWidth={1.5} className="text-[#908E86]" />
                      : <Search size={12} strokeWidth={1.5} className="text-[#908E86]" />
                    }
                    {tip === "manuel" ? "Manuel" : tip === "foto" ? "Fotoğraf" : "Barkod"}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-[#F1F0EB] rounded-full h-2">
                      <div className="bg-[#7B9BD9] h-2 rounded-full"
                        style={{ width: `${metrik.toplamUretim > 0 ? (sayi / metrik.toplamUretim) * 100 : 0}%` }} />
                    </div>
                    <span className="text-sm font-medium text-[#1A1A17] w-6 text-right">{sayi}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Son kullanıcılar */}
          <div className="bg-white rounded-xl border border-[#D8D6CE] p-5">
            <h3 className="text-sm font-medium text-[#5A5852] mb-3">Son kayıt olan kullanıcılar</h3>
            <div className="space-y-2">
              {metrik.sonKullanicilar.map((k, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-[#F1F0EB] last:border-0">
                  <div>
                    <div className="text-sm text-[#1A1A17]">{k.email}</div>
                    <div className="text-xs text-[#908E86]">
                      {new Date(k.created_at).toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" })}
                    </div>
                  </div>
                  <span className="text-xs bg-[#F0F4FB] text-[#1E4DD8] px-2 py-1 rounded-full">
                    {k.kredi} kredi
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Son üretimler */}
          <div className="bg-white rounded-xl border border-[#D8D6CE] p-5">
            <h3 className="text-sm font-medium text-[#5A5852] mb-3">Son üretimler</h3>
            <div className="space-y-2">
              {metrik.sonUretimler.map((u, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-[#F1F0EB] last:border-0">
                  <div>
                    <div className="text-sm text-[#1A1A17] truncate max-w-40">{u.urun_adi}</div>
                    <div className="text-xs text-[#908E86]">
                      {new Date(u.created_at).toLocaleDateString("tr-TR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                      {u.input_token > 0 && <span className="ml-2 text-[#D8D6CE]">{u.input_token + u.output_token} tok</span>}
                      {u.api_cost > 0 && <span className="ml-1 text-[#7A1E1E]/50">${u.api_cost.toFixed(5)}</span>}
                    </div>
                  </div>
                  <span className="text-xs bg-[#F1F0EB] text-[#5A5852] px-2 py-1 rounded-full capitalize">
                    {u.platform}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
