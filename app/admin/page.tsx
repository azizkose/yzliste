"use client";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Metrik = {
  toplamKullanici: number;
  toplamUretim: number;
  bugunUretim: number;
  buHaftaUretim: number;
  toplamKredi: number;
  toplamInputToken: number;
  toplamOutputToken: number;
  toplamApiMaliyet: number;
  platformDagilim: Record<string, number>;
  girisTipiDagilim: Record<string, number>;
  sonKullanicilar: { email: string; kredi: number; created_at: string }[];
  sonUretimler: { urun_adi: string; platform: string; created_at: string; input_token: number; output_token: number; api_cost: number }[];
};

export default function AdminPage() {
  const [metrik, setMetrik] = useState<Metrik | null>(null);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState<string | null>(null);
  const router = useRouter();

  const metrikleriYukle = useCallback(async () => {
    setYukleniyor(true);
    setHata(null);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { router.push("/giris"); return; }

    const res = await fetch("/api/admin/metrics", {
      headers: { Authorization: `Bearer ${session.access_token}` },
    });

    if (res.status === 403) { router.push("/"); return; }
    if (!res.ok) { setHata("Metrikler yüklenemedi."); setYukleniyor(false); return; }

    const data = await res.json();
    setMetrik(data);
    setYukleniyor(false);
  }, [router]);

  useEffect(() => { metrikleriYukle(); }, [metrikleriYukle]);

  if (yukleniyor) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-400">Yükleniyor...</div>
      </main>
    );
  }

  if (hata) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-500">{hata}</div>
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
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-400">YZListe — Sistem Metrikleri</p>
          </div>
          <div className="flex gap-3">
            <button onClick={metrikleriYukle}
              className="text-sm bg-white border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50">
              Yenile
            </button>
            <Link href="/" className="text-sm bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600">
              Uygulamaya Dön
            </Link>
          </div>
        </div>

        {/* Ana metrikler */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Toplam Kullanıcı", value: metrik.toplamKullanici, renk: "text-blue-600" },
            { label: "Toplam Üretim", value: metrik.toplamUretim, renk: "text-indigo-600" },
            { label: "Bugün Üretim", value: metrik.bugunUretim, renk: "text-green-600" },
            { label: "Bu Hafta", value: metrik.buHaftaUretim, renk: "text-violet-600" },
          ].map((m) => (
            <div key={m.label} className="bg-white rounded-2xl shadow p-5">
              <div className={`text-3xl font-bold ${m.renk}`}>{m.value}</div>
              <div className="text-sm text-gray-500 mt-1">{m.label}</div>
            </div>
          ))}
        </div>

        {/* Maliyet & Token */}
        <div className="bg-white rounded-2xl shadow p-5 mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">API Kullanımı & Maliyet (Gerçek)</h3>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="text-xl font-bold text-blue-600">{metrik.toplamInputToken.toLocaleString()}</div>
              <div className="text-xs text-gray-500 mt-1">Input Token</div>
            </div>
            <div className="bg-violet-50 rounded-xl p-4">
              <div className="text-xl font-bold text-violet-600">{metrik.toplamOutputToken.toLocaleString()}</div>
              <div className="text-xs text-gray-500 mt-1">Output Token</div>
            </div>
            <div className="bg-red-50 rounded-xl p-4">
              <div className="text-xl font-bold text-red-600">
                ${(toplamMaliyet > 0 ? toplamMaliyet : tokenMaliyet).toFixed(4)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Toplam Maliyet {toplamMaliyet === 0 && tokenMaliyet > 0 && <span className="text-gray-400">(tahmini)</span>}
              </div>
            </div>
            <div className="bg-yellow-50 rounded-xl p-4">
              <div className="text-xl font-bold text-yellow-600">${uretimBasiMaliyet.toFixed(5)}</div>
              <div className="text-xs text-gray-500 mt-1">Üretim Başı</div>
            </div>
            <div className="bg-indigo-50 rounded-xl p-4">
              <div className="text-xl font-bold text-indigo-600">{metrik.toplamKredi}</div>
              <div className="text-xs text-gray-500 mt-1">Kalan Kredi</div>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-3">
            * Metin: Sonnet 4.6 — $3/MTok input, $15/MTok output. Görsel: Bria $0.012/görsel. Video: Kling $0.28/5sn, $0.56/10sn.
          </p>
        </div>

        {/* Statik Fiyatlama & Marj Tablosu */}
        <div className="bg-white rounded-2xl shadow p-5 mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Ürün Maliyet & Marj Tablosu</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-400 border-b">
                  <th className="text-left pb-2 font-medium">Üretim Tipi</th>
                  <th className="text-right pb-2 font-medium">API Maliyet</th>
                  <th className="text-right pb-2 font-medium">Kredi</th>
                  <th className="text-right pb-2 font-medium">Birim Fiyat (Büyük)</th>
                  <th className="text-right pb-2 font-medium">Marj</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
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
                    <td className="py-2 text-gray-700">{r.tip}</td>
                    <td className="py-2 text-right text-gray-500 font-mono">{r.maliyet}</td>
                    <td className="py-2 text-right text-gray-500">{r.kredi} kr</td>
                    <td className="py-2 text-right text-gray-600">{r.fiyat}</td>
                    <td className={`py-2 text-right font-medium ${parseInt(r.marj) >= 200 ? "text-green-600" : parseInt(r.marj) >= 100 ? "text-yellow-600" : "text-orange-600"}`}>
                      {r.marj}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-2">* Büyük paket: ₺2.49/kredi. $ → ₺ kuru: ~₺35.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">

          {/* Platform dağılımı */}
          <div className="bg-white rounded-2xl shadow p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Platform Dağılımı</h3>
            <div className="space-y-2">
              {Object.entries(metrik.platformDagilim).map(([platform, sayi]) => (
                <div key={platform} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 capitalize">{platform}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-100 rounded-full h-2">
                      <div className="bg-indigo-400 h-2 rounded-full"
                        style={{ width: `${metrik.toplamUretim > 0 ? (sayi / metrik.toplamUretim) * 100 : 0}%` }} />
                    </div>
                    <span className="text-sm font-medium text-gray-700 w-6 text-right">{sayi}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Giriş tipi */}
          <div className="bg-white rounded-2xl shadow p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Giriş Tipi Dağılımı</h3>
            <div className="space-y-2">
              {Object.entries(metrik.girisTipiDagilim).map(([tip, sayi]) => (
                <div key={tip} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    {tip === "manuel" ? "✏️ Manuel" : tip === "foto" ? "📷 Fotoğraf" : "🔍 Barkod"}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-100 rounded-full h-2">
                      <div className="bg-indigo-400 h-2 rounded-full"
                        style={{ width: `${metrik.toplamUretim > 0 ? (sayi / metrik.toplamUretim) * 100 : 0}%` }} />
                    </div>
                    <span className="text-sm font-medium text-gray-700 w-6 text-right">{sayi}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Son kullanıcılar */}
          <div className="bg-white rounded-2xl shadow p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Son Kayıt Olan Kullanıcılar</h3>
            <div className="space-y-2">
              {metrik.sonKullanicilar.map((k, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <div className="text-sm text-gray-700">{k.email}</div>
                    <div className="text-xs text-gray-400">
                      {new Date(k.created_at).toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" })}
                    </div>
                  </div>
                  <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
                    {k.kredi} kredi
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Son üretimler */}
          <div className="bg-white rounded-2xl shadow p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Son Üretimler</h3>
            <div className="space-y-2">
              {metrik.sonUretimler.map((u, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <div className="text-sm text-gray-700 truncate max-w-40">{u.urun_adi}</div>
                    <div className="text-xs text-gray-400">
                      {new Date(u.created_at).toLocaleDateString("tr-TR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                      {u.input_token > 0 && <span className="ml-2 text-gray-300">{u.input_token + u.output_token} tok</span>}
                      {u.api_cost > 0 && <span className="ml-1 text-red-300">${u.api_cost.toFixed(5)}</span>}
                    </div>
                  </div>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full capitalize">
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
