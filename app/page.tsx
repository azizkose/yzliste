"use client";
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

type Uretim = {
  id: string;
  urun_adi: string;
  platform: string;
  giris_tipi: string;
  sonuc: string;
  created_at: string;
};

type Kullanici = {
  id: string;
  email: string;
  kredi: number;
  toplam_kullanilan: number;
};

export default function Home() {
  const [urunAdi, setUrunAdi] = useState("");
  const [kategori, setKategori] = useState("");
  const [ozellikler, setOzellikler] = useState("");
  const [platform, setPlatform] = useState("trendyol");
  const [sonuc, setSonuc] = useState("");
  const [yukleniyor, setYukleniyor] = useState(false);
  const [fotolar, setFotolar] = useState<string[]>([]);
  const [girisTipi, setGirisTipi] = useState<"manuel" | "foto" | "barkod">("manuel");
  const [barkod, setBarkod] = useState("");
  const [barkodYukleniyor, setBarkodYukleniyor] = useState(false);
  const [barkodBilgi, setBarkodBilgi] = useState<{isim: string, marka: string, aciklama: string, kategori: string, renk: string, boyut: string} | null>(null);
  const [kameraAcik, setKameraAcik] = useState(false);
  const [kullanici, setKullanici] = useState<Kullanici | null>(null);
  const [gecmis, setGecmis] = useState<Uretim[]>([]);
  const [seciliUretim, setSeciliUretim] = useState<Uretim | null>(null);
  const [gorselStil, setGorselStil] = useState("beyaz");
  const [gorselYukleniyor, setGorselYukleniyor] = useState(false);
  const [uretilmisGorsel, setUretilmisGorsel] = useState<string | null>(null);
  const scannerRef = useRef<unknown>(null);
  const scannerBaslatildi = useRef(false);
  const sorguCalisiyor = useRef(false);
  const router = useRouter();

  useEffect(() => {
    kullaniciyiKontrolEt();
    return () => { kameraKapat(); };
  }, []);

  const kullaniciyiKontrolEt = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/auth"); return; }

    const { data: profil } = await supabase
      .from("profiles")
      .select("email, kredi")
      .eq("id", user.id)
      .single();

    const { count } = await supabase
      .from("uretimler")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    if (profil) {
      setKullanici({ id: user.id, email: profil.email, kredi: profil.kredi, toplam_kullanilan: count || 0 });
    }

    gecmisiYukle(user.id);
  };

  const gecmisiYukle = async (userId: string) => {
    const { data } = await supabase
      .from("uretimler")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(10);
    if (data) setGecmis(data);
  };

  const cikisYap = async () => {
    await supabase.auth.signOut();
    router.push("/auth");
  };

  const fotoSec = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dosyalar = Array.from(e.target.files || []);
    dosyalar.slice(0, 3 - fotolar.length).forEach((dosya) => {
      const reader = new FileReader();
      reader.onload = () => {
        setFotolar((prev) => prev.length >= 3 ? prev : [...prev, reader.result as string]);
      };
      reader.readAsDataURL(dosya);
    });
    e.target.value = "";
  };

  const fotoKaldir = (index: number) => {
    setFotolar((prev) => prev.filter((_, i) => i !== index));
    setUretilmisGorsel(null);
  };

  const barkodSorgula = async (kod: string) => {
    if (!kod || kod.length < 8) return;
    if (sorguCalisiyor.current) return;
    sorguCalisiyor.current = true;
    setBarkodYukleniyor(true);
    setBarkodBilgi(null);
    try {
      const res = await fetch(`/api/barkod?kod=${kod}`);
      const data = await res.json();
      if (data.bulunamadi) {
        alert("Bu ürün veritabanında bulunamadı. Lütfen Manuel sekmesinden girin.");
        setGirisTipi("manuel");
        setBarkod("");
      } else if (data.isim) {
        setBarkodBilgi(data);
        setUrunAdi(data.isim);
        if (data.marka) setKategori(data.marka);
        if (data.aciklama) setOzellikler(data.aciklama);
        kameraKapat();
      }
    } catch { alert("Barkod sorgulanırken hata oluştu."); }
    setBarkodYukleniyor(false);
    sorguCalisiyor.current = false;
  };

  const kameraAc = async () => {
    if (scannerBaslatildi.current) return;
    setKameraAcik(true);
    setTimeout(async () => {
      try {
        const { Html5Qrcode } = await import("html5-qrcode");
        const scanner = new Html5Qrcode("barkod-okuyucu");
        scannerRef.current = scanner;
        scannerBaslatildi.current = true;
        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 250, height: 150 } },
          (decodedText: string) => { setBarkod(decodedText); barkodSorgula(decodedText); },
          () => {}
        );
      } catch (e) {
        console.log(e);
        alert("Kamera açılamadı.");
        setKameraAcik(false);
        scannerBaslatildi.current = false;
      }
    }, 300);
  };

  const kameraKapat = async () => {
    if (scannerRef.current && scannerBaslatildi.current) {
      try {
        const scanner = scannerRef.current as { stop: () => Promise<void>; clear: () => void };
        await scanner.stop();
        scanner.clear();
      } catch (e) { console.log(e); }
      scannerRef.current = null;
      scannerBaslatildi.current = false;
    }
    setKameraAcik(false);
  };

  const icerikUret = async () => {
    if (!kullanici || kullanici.kredi <= 0) {
      alert("Krediniz bitti. Lütfen kredi satın alın.");
      return;
    }
    if (girisTipi === "manuel" && (!urunAdi || !kategori)) return;
    if (girisTipi === "foto" && fotolar.length === 0) return;
    if (girisTipi === "barkod" && !barkodBilgi) return;
    setYukleniyor(true);
    setSonuc("");

    const res = await fetch("/api/uret", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        urunAdi, kategori, ozellikler, platform,
        fotolar, girisTipi, barkodBilgi,
        userId: kullanici.id,
      }),
    });

    const data = await res.json();
    setSonuc(data.icerik);
    setKullanici({ ...kullanici, kredi: kullanici.kredi - 1, toplam_kullanilan: kullanici.toplam_kullanilan + 1 });
    gecmisiYukle(kullanici.id);
    setYukleniyor(false);
  };

  const gorselUret = async () => {
    if (fotolar.length === 0) return;
    setGorselYukleniyor(true);
    setUretilmisGorsel(null);
    try {
      const res = await fetch("/api/gorsel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ foto: fotolar[0], stil: gorselStil, ozellikler }),
      });
      const data = await res.json();
      if (data.gorselUrl) {
        setUretilmisGorsel(data.gorselUrl);
      } else {
        alert("Görsel üretilemedi. Tekrar deneyin.");
      }
    } catch {
      alert("Hata oluştu.");
    }
    setGorselYukleniyor(false);
  };

  const uretButonAktif =
    !yukleniyor &&
    ((girisTipi === "manuel" && urunAdi && kategori) ||
     (girisTipi === "foto" && fotolar.length > 0) ||
     (girisTipi === "barkod" && barkodBilgi !== null));

  const platformRenk: Record<string, string> = {
    trendyol: "bg-orange-100 text-orange-700",
    hepsiburada: "bg-orange-100 text-orange-600",
    amazon: "bg-yellow-100 text-yellow-700",
    n11: "bg-blue-100 text-blue-700",
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            YZ<span className="text-orange-500">Liste</span>
          </h1>
          {kullanici && (
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-400">{kullanici.email}</span>
              <button onClick={cikisYap} className="text-sm text-gray-400 hover:text-gray-600">Çıkış</button>
            </div>
          )}
        </div>

        <div className="flex gap-6 items-start flex-col lg:flex-row">

          {/* Sol — Form */}
          <div className="flex-1 w-full space-y-4">
            <div className="bg-white rounded-2xl shadow p-6 space-y-4">

              <div className="flex gap-2">
                {(["manuel", "foto", "barkod"] as const).map((tip) => (
                  <button key={tip}
                    onClick={() => { setGirisTipi(tip); kameraKapat(); }}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                      girisTipi === tip ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}>
                    {tip === "manuel" ? "Manuel" : tip === "foto" ? "📷 Fotoğraf" : "🔍 Barkod"}
                  </button>
                ))}
              </div>

              {girisTipi === "manuel" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ürün Adı *</label>
                    <input type="text" value={urunAdi} onChange={(e) => setUrunAdi(e.target.value)}
                      placeholder="örn: Erkek Deri Bot"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kategori *</label>
                    <input type="text" value={kategori} onChange={(e) => setKategori(e.target.value)}
                      placeholder="örn: Ayakkabı / Giyim / Elektronik"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400" />
                  </div>
                </>
              )}

              {girisTipi === "foto" && (
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Ürün Fotoğrafları * <span className="text-gray-400 font-normal">(max 3)</span>
                  </label>
                  {fotolar.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {fotolar.map((f, i) => (
                        <div key={i} className="relative">
                          <img src={f} alt={`Ürün ${i + 1}`} className="w-24 h-24 object-cover rounded-lg border border-gray-200" />
                          <button onClick={() => fotoKaldir(i)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">×</button>
                        </div>
                      ))}
                    </div>
                  )}
                  {fotolar.length < 3 && (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors">
                      <input type="file" accept="image/*" multiple onChange={fotoSec} className="hidden" id="foto-input" />
                      <label htmlFor="foto-input" className="cursor-pointer block space-y-2">
                        <div className="text-3xl">📷</div>
                        <p className="text-gray-500 text-sm">{fotolar.length === 0 ? "Fotoğraf seçmek için tıkla" : "Daha fazla ekle"}</p>
                        <p className="text-gray-400 text-xs">{3 - fotolar.length} fotoğraf daha eklenebilir</p>
                      </label>
                    </div>
                  )}
                </div>
              )}

              {girisTipi === "barkod" && (
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">Barkod *</label>
                  <div className="flex gap-2">
                    <input type="text" value={barkod} onChange={(e) => setBarkod(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && barkodSorgula(barkod)}
                      placeholder="Barkod numarası (EAN/UPC)"
                      className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400" />
                    <button onClick={() => barkodSorgula(barkod)}
                      disabled={barkodYukleniyor || barkod.length < 8}
                      className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg text-sm font-medium">
                      {barkodYukleniyor ? "..." : "Sorgula"}
                    </button>
                    <button onClick={kameraAcik ? kameraKapat : kameraAc}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        kameraAcik ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-700"
                      }`}>
                      {kameraAcik ? "Kapat" : "📷 Tara"}
                    </button>
                  </div>
                  {kameraAcik && (
                    <div className="space-y-2">
                      <div id="barkod-okuyucu" className="w-full rounded-lg overflow-hidden" />
                      <p className="text-xs text-gray-400 text-center">Barkodu çerçeve içine hizala</p>
                    </div>
                  )}
                  {barkodBilgi && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm">
                      <p className="font-medium text-green-800">✓ Ürün bulundu</p>
                      <p className="text-green-700">{barkodBilgi.isim}</p>
                      {barkodBilgi.marka && <p className="text-green-600 text-xs">Marka: {barkodBilgi.marka}</p>}
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ek Bilgi <span className="text-gray-400 font-normal">(isteğe bağlı)</span>
                </label>
                <textarea value={ozellikler} onChange={(e) => setOzellikler(e.target.value)}
                  placeholder="örn: renk, beden, malzeme, özel özellikler..."
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
                <select value={platform} onChange={(e) => setPlatform(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400">
                  <option value="trendyol">Trendyol</option>
                  <option value="hepsiburada">Hepsiburada</option>
                  <option value="amazon">Amazon TR</option>
                  <option value="n11">N11</option>
                </select>
              </div>

              <button onClick={icerikUret} disabled={!uretButonAktif}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white font-semibold py-3 rounded-lg transition-colors">
                {yukleniyor ? "Üretiliyor..." : `İçerik Üret (${kullanici?.kredi || 0} kredi)`}
              </button>
            </div>

            {/* Görsel Üretim — sadece fotoğraf modunda */}
            {girisTipi === "foto" && fotolar.length > 0 && (
              <div className="bg-white rounded-2xl shadow p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">✨ Ürün Görseli Üret</h2>
                <p className="text-xs text-gray-400 mb-3">Ürün fotoğrafını profesyonel e-ticaret görseline dönüştür</p>
                <div className="flex gap-2 mb-4">
                  {[
                    { id: "beyaz", label: "⬜ Beyaz" },
                    { id: "lifestyle", label: "🏠 Lifestyle" },
                    { id: "gradient", label: "🎨 Gradient" },
                  ].map((s) => (
                    <button key={s.id} onClick={() => setGorselStil(s.id)}
                      className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${
                        gorselStil === s.id ? "bg-purple-500 text-white" : "bg-gray-100 text-gray-600"
                      }`}>
                      {s.label}
                    </button>
                  ))}
                </div>
                <button onClick={gorselUret} disabled={gorselYukleniyor}
                  className="w-full bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 text-white font-semibold py-3 rounded-lg transition-colors">
                  {gorselYukleniyor ? "Görsel üretiliyor... (~30sn)" : "✨ Görsel Üret"}
                </button>
                {uretilmisGorsel && (
                  <div className="mt-4">
                    <img src={uretilmisGorsel} alt="Üretilen görsel" className="w-full rounded-xl border border-gray-100" />
                    <a href={uretilmisGorsel} download target="_blank"
                      className="block text-center text-sm text-purple-500 hover:text-purple-600 mt-2 font-medium">
                      ⬇️ İndir
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* İçerik sonucu */}
            {sonuc && (
              <div className="bg-white rounded-2xl shadow p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">Üretilen İçerik</h2>
                  <button onClick={() => navigator.clipboard.writeText(sonuc)}
                    className="text-sm text-orange-500 hover:text-orange-600 font-medium">
                    Kopyala
                  </button>
                </div>
                <pre className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">{sonuc}</pre>
              </div>
            )}
          </div>

          {/* Sağ — Kredi & Geçmiş */}
          <div className="w-full lg:w-72 space-y-4">

            {kullanici && (
              <div className="bg-white rounded-2xl shadow p-5">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Kredi Durumu</h3>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-orange-50 rounded-xl p-3">
                    <div className="text-2xl font-bold text-orange-500">{kullanici.kredi}</div>
                    <div className="text-xs text-gray-500 mt-1">Kalan</div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <div className="text-2xl font-bold text-gray-700">{kullanici.toplam_kullanilan}</div>
                    <div className="text-xs text-gray-500 mt-1">Kullanılan</div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <div className="text-2xl font-bold text-gray-700">{kullanici.kredi + kullanici.toplam_kullanilan}</div>
                    <div className="text-xs text-gray-500 mt-1">Toplam</div>
                  </div>
                </div>
                {kullanici.kredi <= 1 && (
                  <div className="mt-3 text-xs text-orange-600 bg-orange-50 rounded-lg p-2 text-center">
                    ⚠️ Krediniz azalıyor
                  </div>
                )}
              </div>
            )}

            <div className="bg-white rounded-2xl shadow p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Son Üretimler</h3>
              {gecmis.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-4">Henüz üretim yapılmadı</p>
              ) : (
                <div className="space-y-2">
                  {gecmis.map((u) => (
                    <button key={u.id} onClick={() => setSeciliUretim(seciliUretim?.id === u.id ? null : u)}
                      className={`w-full text-left p-3 rounded-xl border transition-colors ${
                        seciliUretim?.id === u.id ? "border-orange-300 bg-orange-50" : "border-gray-100 hover:bg-gray-50"
                      }`}>
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-xs font-medium text-gray-700 truncate flex-1">{u.urun_adi}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${platformRenk[u.platform] || "bg-gray-100 text-gray-600"}`}>
                          {u.platform}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {new Date(u.created_at).toLocaleDateString("tr-TR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </div>
                      {seciliUretim?.id === u.id && (
                        <div className="mt-3 pt-3 border-t border-orange-200">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs text-gray-500">İçerik</span>
                            <button onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(u.sonuc); }}
                              className="text-xs text-orange-500 hover:text-orange-600">
                              Kopyala
                            </button>
                          </div>
                          <pre className="text-xs text-gray-600 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">{u.sonuc}</pre>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}