"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

type Metrik = {
  toplamKullanici: number;
  toplamUretim: number;
  bugunUretim: number;
  buHaftaUretim: number;
  toplamKredi: number;
  platformDagilim: Record<string, number>;
  girisTipiDagilim: Record<string, number>;
  sonKullanicilar: { email: string; kredi: number; created_at: string }[];
  sonUretimler: { urun_adi: string; platform: string; created_at: string }[];
};

export default function AdminPage() {
  const [metrik, setMetrik] = useState<Metrik | null>(null);
  const [yukleniyor, setYukleniyor] = useState(true);
  const router = useRouter();

  useEffect(() => {
    adminKontrol();
  }, []);

  const adminKontrol = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
      router.push("/");
      return;
    }
    metrikleriYukle();
  };

  const metrikleriYukle = async () => {
    setYukleniyor(true);

    const { count: toplamKullanici } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true });

    const { count: toplamUretim } = await supabase
      .from("uretimler")
      .select("*", { count: "exact", head: true });

    const bugun = new Date();
    bugun.setHours(0, 0, 0, 0);
    const { count: bugunUretim } = await supabase
      .from("uretimler")
      .select("*", { count: "exact", head: true })
      .gte("created_at", bugun.toISOString());

    const haftaBasi = new Date();
    haftaBasi.setDate(haftaBasi.getDate() - 7);
    const { count: buHaftaUretim } = await supabase
      .from("uretimler")
      .select("*", { count: "exact", head: true })
      .gte("created_at", haftaBasi.toISOString());

    const { data: krediler } = await supabase
      .from("profiles")
      .select("kredi");
    const toplamKredi = krediler?.reduce((acc, p) => acc + (p.kredi || 0), 0) || 0;

    const { data: platformData } = await supabase
      .from("uretimler")
      .select("platform");
    const platformDagilim: Record<string, number> = {};
    platformData?.forEach((u) => {
      platformDagilim[u.platform] = (platformDagilim[u.platform] || 0) + 1;
    });

    const { data: girisTipiData } = await supabase
      .from("uretimler")
      .select("giris_tipi");
    const girisTipiDagilim: Record<string, number> = {};
    girisTipiData?.forEach((u) => {
      girisTipiDagilim[u.giris_tipi] = (girisTipiDagilim[u.giris_tipi] || 0) + 1;
    });

    const { data: sonKullanicilar } = await supabase
      .from("profiles")
      .select("email, kredi, created_at")
      .order("created_at", { ascending: false })
      .limit(10);

    const { data: sonUretimler } = await supabase
      .from("uretimler")
      .select("urun_adi, platform, created_at")
      .order("created_at", { ascending: false })
      .limit(10);

    setMetrik({
      toplamKullanici: toplamKullanici || 0,
      toplamUretim: toplamUretim || 0,
      bugunUretim: bugunUretim || 0,
      buHaftaUretim: buHaftaUretim || 0,
      toplamKredi,
      platformDagilim,
      girisTipiDagilim,
      sonKullanicilar: sonKullanicilar || [],
      sonUretimler: sonUretimler || [],
    });

    setYukleniyor(false);
  };

  if (yukleniyor) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-400">Yükleniyor...</div>
      </main>
    );
  }

  if (!metrik) return null;

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
            <a href="/"
              className="text-sm bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600">
              Uygulamaya Dön
            </a>
          </div>
        </div>

        {/* Ana metrikler */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Toplam Kullanıcı", value: metrik.toplamKullanici, renk: "text-blue-600", bg: "bg-blue-50" },
            { label: "Toplam Üretim", value: metrik.toplamUretim, renk: "text-orange-600", bg: "bg-orange-50" },
            { label: "Bugün Üretim", value: metrik.bugunUretim, renk: "text-green-600", bg: "bg-green-50" },
            { label: "Bu Hafta", value: metrik.buHaftaUretim, renk: "text-purple-600", bg: "bg-purple-50" },
          ].map((m) => (
            <div key={m.label} className="bg-white rounded-2xl shadow p-5">
              <div className={`text-3xl font-bold ${m.renk}`}>{m.value}</div>
              <div className="text-sm text-gray-500 mt-1">{m.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">

          {/* Kalan kredi */}
          <div className="bg-white rounded-2xl shadow p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Sistem Kredisi</h3>
            <div className="text-3xl font-bold text-orange-500">{metrik.toplamKredi}</div>
            <div className="text-sm text-gray-400">Kullanıcılarda kalan toplam kredi</div>
          </div>

          {/* Platform dağılımı */}
          <div className="bg-white rounded-2xl shadow p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Platform Dağılımı</h3>
            <div className="space-y-2">
              {Object.entries(metrik.platformDagilim).map(([platform, sayi]) => (
                <div key={platform} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 capitalize">{platform}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-orange-400 h-2 rounded-full"
                        style={{ width: `${(sayi / metrik.toplamUretim) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-700 w-6 text-right">{sayi}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Giriş tipi dağılımı */}
          <div className="bg-white rounded-2xl shadow p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Giriş Tipi</h3>
            <div className="space-y-2">
              {Object.entries(metrik.girisTipiDagilim).map(([tip, sayi]) => (
                <div key={tip} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    {tip === "manuel" ? "✏️ Manuel" : tip === "foto" ? "📷 Fotoğraf" : "🔍 Barkod"}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-orange-400 h-2 rounded-full"
                        style={{ width: `${(sayi / metrik.toplamUretim) * 100}%` }}
                      />
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
                  <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
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
                    <div className="text-sm text-gray-700 truncate max-w-48">{u.urun_adi}</div>
                    <div className="text-xs text-gray-400">
                      {new Date(u.created_at).toLocaleDateString("tr-TR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
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