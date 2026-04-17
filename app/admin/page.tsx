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
  platformDagilim: Record<string, number>;
  girisTipiDagilim: Record<string, number>;
  sonKullanicilar: { email: string; kredi: number; created_at: string }[];
  sonUretimler: { urun_adi: string; platform: string; created_at: string; input_token: number; output_token: number }[];
};

export default function AdminPage() {
  const [metrik, setMetrik] = useState<Metrik | null>(null);
  const [yukleniyor, setYukleniyor] = useState(true);
  const router = useRouter();

  const metrikleriYukle = useCallback(async () => {
    setYukleniyor(true);

    const { count: toplamKullanici } = await supabase
      .from("profiles").select("*", { count: "exact", head: true });

    const { count: toplamUretim } = await supabase
      .from("uretimler").select("*", { count: "exact", head: true });

    const bugun = new Date(); bugun.setHours(0, 0, 0, 0);
    const { count: bugunUretim } = await supabase
      .from("uretimler").select("*", { count: "exact", head: true })
      .gte("created_at", bugun.toISOString());

    const haftaBasi = new Date(); haftaBasi.setDate(haftaBasi.getDate() - 7);
    const { count: buHaftaUretim } = await supabase
      .from("uretimler").select("*", { count: "exact", head: true })
      .gte("created_at", haftaBasi.toISOString());

    const { data: krediler } = await supabase.from("profiles").select("kredi");
    const toplamKredi = krediler?.reduce((acc, p) => acc + (p.kredi || 0), 0) || 0;

    const { data: tokenData } = await supabase
      .from("uretimler").select("input_token, output_token");
    const toplamInputToken = tokenData?.reduce((acc, u) => acc + (u.input_token || 0), 0) || 0;
    const toplamOutputToken = tokenData?.reduce((acc, u) => acc + (u.output_token || 0), 0) || 0;

    const { data: platformData } = await supabase.from("uretimler").select("platform");
    const platformDagilim: Record<string, number> = {};
    platformData?.forEach((u) => { platformDagilim[u.platform] = (platformDagilim[u.platform] || 0) + 1; });

    const { data: girisTipiData } = await supabase.from("uretimler").select("giris_tipi");
    const girisTipiDagilim: Record<string, number> = {};
    girisTipiData?.forEach((u) => { girisTipiDagilim[u.giris_tipi] = (girisTipiDagilim[u.giris_tipi] || 0) + 1; });

    const { data: sonKullanicilar } = await supabase
      .from("profiles").select("email, kredi, created_at")
      .order("created_at", { ascending: false }).limit(10);

    const { data: sonUretimler } = await supabase
      .from("uretimler").select("urun_adi, platform, created_at, input_token, output_token")
      .order("created_at", { ascending: false }).limit(10);

    setMetrik({
      toplamKullanici: toplamKullanici || 0,
      toplamUretim: toplamUretim || 0,
      bugunUretim: bugunUretim || 0,
      buHaftaUretim: buHaftaUretim || 0,
      toplamKredi,
      toplamInputToken,
      toplamOutputToken,
      platformDagilim,
      girisTipiDagilim,
      sonKullanicilar: sonKullanicilar || [],
      sonUretimler: sonUretimler || [],
    });

    setYukleniyor(false);
  }, []);

  const adminKontrol = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
      router.push("/");
      return;
    }
    metrikleriYukle();
  }, [router, metrikleriYukle]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { adminKontrol(); }, [adminKontrol]);

  if (yukleniyor) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-400">Yükleniyor...</div>
      </main>
    );
  }

  if (!metrik) return null;

  // Haiku fiyatları: input $1/MTok, output $5/MTok
  const inputMaliyet = (metrik.toplamInputToken / 1_000_000) * 1;
  const outputMaliyet = (metrik.toplamOutputToken / 1_000_000) * 5;
  const toplamMaliyet = inputMaliyet + outputMaliyet;
  const uretimBasiMaliyet = metrik.toplamUretim > 0 ? toplamMaliyet / metrik.toplamUretim : 0;

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
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Claude API Kullanımı & Maliyet</h3>
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
              <div className="text-xl font-bold text-red-600">${toplamMaliyet.toFixed(4)}</div>
              <div className="text-xs text-gray-500 mt-1">Toplam Maliyet</div>
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
            * Haiku 4.5 fiyatları: Input $1/MTok, Output $5/MTok. Gerçek Anthropic bakiyesi için console.anthropic.com kontrol edin.
          </p>
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