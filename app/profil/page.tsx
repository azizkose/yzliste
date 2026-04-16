"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

type Profil = {
  email: string;
  kredi: number;
  is_admin?: boolean;
  toplam_kullanilan?: number;
  ad_soyad: string | null;
  telefon: string | null;
  adres: string | null;
  fatura_tipi: string | null;
  tc_kimlik: string | null;
  vergi_no: string | null;
  vergi_dairesi: string | null;
  marka_adi: string | null;
  ton: string | null;
  hedef_kitle: string | null;
  vurgulanan_ozellikler: string | null;
};

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
};

export default function ProfilPage() {
  const [profil, setProfil] = useState<Profil | null>(null);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [kaydediliyor, setKaydediliyor] = useState(false);
  const [mesaj, setMesaj] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  // Uretimler
  const [uretimler, setUretimler] = useState<Uretim[]>([]);
  const [uretimYukleniyor, setUretimYukleniyor] = useState(false);
  const [seciliUretim, setSeciliUretim] = useState<Uretim | null>(null);
  const [sayfaNo, setSayfaNo] = useState(0);
  const SAYFA_BOYUTU = 20;

  const router = useRouter();

  // Kisisel bilgi alanlari
  const [adSoyad, setAdSoyad] = useState("");
  const [telefon, setTelefon] = useState("");
  const [adres, setAdres] = useState("");
  const [faturaTipi, setFaturaTipi] = useState("bireysel");
  const [tcKimlik, setTcKimlik] = useState("");
  const [vergiNo, setVergiNo] = useState("");
  const [vergiDairesi, setVergiDairesi] = useState("");

  // Marka profili alanlari
  const [markaAdi, setMarkaAdi] = useState("");
  const [ton, setTon] = useState("samimi");
  const [hedefKitle, setHedefKitle] = useState("");
  const [vurgulananlalar, setVurgulananlar] = useState("");

  useEffect(() => {
    yukle();
  }, []);

  const yukle = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/auth"); return; }
    setUserId(user.id);

    const { data } = await supabase
      .from("profiles")
      .select("email, kredi, is_admin, ad_soyad, telefon, adres, fatura_tipi, tc_kimlik, vergi_no, vergi_dairesi, marka_adi, ton, hedef_kitle, vurgulanan_ozellikler")
      .eq("id", user.id)
      .single();

    const { count } = await supabase
      .from("uretimler")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    if (data) {
      setProfil({ ...data, toplam_kullanilan: count || 0 });
      setAdSoyad(data.ad_soyad || "");
      setTelefon(data.telefon || "");
      setAdres(data.adres || "");
      setFaturaTipi(data.fatura_tipi || "bireysel");
      setTcKimlik(data.tc_kimlik || "");
      setVergiNo(data.vergi_no || "");
      setVergiDairesi(data.vergi_dairesi || "");
      setMarkaAdi(data.marka_adi || "");
      setTon(data.ton || "samimi");
      setHedefKitle(data.hedef_kitle || "");
      setVurgulananlar(data.vurgulanan_ozellikler || "");
    }

    // Üretimleri de yükle
    await uretimYukle(user.id, 0);
    setYukleniyor(false);
  };

  const uretimYukle = async (uid: string, sayfa: number) => {
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
  };

  const dahaFazlaYukle = async () => {
    if (!userId) return;
    const yeniSayfa = sayfaNo + 1;
    setSayfaNo(yeniSayfa);
    await uretimYukle(userId, yeniSayfa);
  };

  const kaydet = async () => {
    if (!userId) return;
    setKaydediliyor(true);
    setMesaj("");

    const { error } = await supabase
      .from("profiles")
      .update({
        ad_soyad: adSoyad || null,
        telefon: telefon || null,
        adres: adres || null,
        fatura_tipi: faturaTipi,
        tc_kimlik: tcKimlik || null,
        vergi_no: vergiNo || null,
        vergi_dairesi: vergiDairesi || null,
        marka_adi: markaAdi || null,
        ton: ton,
        hedef_kitle: hedefKitle || null,
        vurgulanan_ozellikler: vurgulananlalar || null,
      })
      .eq("id", userId);

    if (error) {
      setMesaj("Kayit sirasinda hata olustu.");
    } else {
      setMesaj("Profil basariyla kaydedildi.");
      setTimeout(() => setMesaj(""), 3000);
    }
    setKaydediliyor(false);
  };

  if (yukleniyor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
      </div>
    );
  }

  const [profilSekme, setProfilSekme] = useState<"marka" | "uretimler">("marka");

  return (
    <main className="min-h-screen bg-gray-50">
      <SiteHeader aktifSayfa="profil" />
      <div className="py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header + Kullanım Özeti */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Profilim</h1>
            <p className="text-sm text-gray-500 mt-0.5">{profil?.email}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-orange-50 rounded-xl px-4 py-2 text-center">
              <div className={`text-xl font-bold ${profil?.is_admin ? "text-purple-500" : "text-orange-500"}`}>
                {profil?.is_admin ? "∞" : (profil?.kredi ?? 0)}
              </div>
              <div className="text-xs text-gray-500">Kalan kredi</div>
            </div>
            <div className="bg-gray-50 rounded-xl px-4 py-2 text-center">
              <div className="text-xl font-bold text-gray-700">{profil?.toplam_kullanilan ?? 0}</div>
              <div className="text-xs text-gray-500">Toplam üretim</div>
            </div>
            <a href="/?paket=ac" className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl whitespace-nowrap transition-colors">
              + Kredi Al
            </a>
          </div>
        </div>

        {/* Kişisel Bilgiler + Fatura Bilgileri — TEK KART */}
        <div id="fatura" className="bg-white rounded-2xl shadow p-6 space-y-5">
          <h2 className="text-base font-semibold text-gray-800">Kişisel ve Fatura Bilgileri</h2>

          {/* Kişisel */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad</label>
              <input type="text" value={adSoyad} onChange={(e) => setAdSoyad(e.target.value)} placeholder="Ad Soyad"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
              <input type="tel" value={telefon} onChange={(e) => setTelefon(e.target.value)} placeholder="05xx xxx xx xx"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Adres</label>
            <textarea value={adres} onChange={(e) => setAdres(e.target.value)} placeholder="Tam adresiniz" rows={2}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
          </div>

          {/* Fatura */}
          <div className="border-t border-gray-100 pt-4">
            <p className="text-sm font-medium text-gray-700 mb-3">Fatura Tipi</p>
            <div className="flex gap-3 mb-4">
              {["bireysel", "kurumsal"].map((tip) => (
                <button key={tip} onClick={() => setFaturaTipi(tip)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border-2 transition-all ${faturaTipi === tip ? "border-orange-400 bg-orange-50 text-orange-600" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}>
                  {tip === "bireysel" ? "Bireysel" : "Kurumsal"}
                </button>
              ))}
            </div>
            {faturaTipi === "bireysel" ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">TC Kimlik No</label>
                <input type="text" value={tcKimlik} onChange={(e) => setTcKimlik(e.target.value)} placeholder="11 haneli TC kimlik no" maxLength={11}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vergi No</label>
                  <input type="text" value={vergiNo} onChange={(e) => setVergiNo(e.target.value)} placeholder="10 haneli vergi no" maxLength={10}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vergi Dairesi</label>
                  <input type="text" value={vergiDairesi} onChange={(e) => setVergiDairesi(e.target.value)} placeholder="Vergi dairesi adı"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
                </div>
              </div>
            )}
          </div>

          {/* Kaydet */}
          {mesaj && (
            <div className={`rounded-xl p-3 text-sm text-center ${mesaj.includes("basarı") || mesaj.includes("basarıyla") || mesaj.includes("basariyla") ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
              {mesaj}
            </div>
          )}
          <button onClick={kaydet} disabled={kaydediliyor}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white font-semibold py-3 rounded-xl transition-colors">
            {kaydediliyor ? "Kaydediliyor..." : "Kaydet"}
          </button>
        </div>

        {/* TABS: Marka Profili | Önceki Üretimler */}
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <div className="flex border-b border-gray-100">
            <button onClick={() => setProfilSekme("marka")}
              className={`flex-1 py-3.5 text-sm font-semibold transition-colors ${profilSekme === "marka" ? "text-orange-600 border-b-2 border-orange-500 bg-orange-50" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}>
              🏪 Marka Profili
            </button>
            <button onClick={() => setProfilSekme("uretimler")}
              className={`flex-1 py-3.5 text-sm font-semibold transition-colors ${profilSekme === "uretimler" ? "text-orange-600 border-b-2 border-orange-500 bg-orange-50" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}>
              📋 Önceki Üretimler <span className="text-xs text-gray-400 font-normal">({profil?.toplam_kullanilan ?? 0})</span>
            </button>
          </div>

          {/* Marka Profili Tab */}
          {profilSekme === "marka" && (
            <div className="p-6 space-y-4">
              <div className="bg-orange-50 border border-orange-100 rounded-xl p-3 text-xs text-orange-700 leading-relaxed">
                Marka profilinizi doldurunca AI metinleri sizin dilinizde, hedef kitlenize göre yazar. Örn: "Kadın modası, 25-35 yaş" yazarsanız AI bu kitlenin anlayacağı bir dil kullanır.
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mağaza / Marka Adı</label>
                <input type="text" value={markaAdi} onChange={(e) => setMarkaAdi(e.target.value)} placeholder="örn: Ayşe Tekstil, TechStore TR"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Metin Tonu</label>
                <div className="grid grid-cols-3 gap-2">
                  {[{ id: "samimi", label: "Samimi", aciklama: "Sıcak, yakın dil" }, { id: "profesyonel", label: "Profesyonel", aciklama: "Resmi, kurumsal" }, { id: "premium", label: "Premium", aciklama: "Lüks, seçkin" }].map((t) => (
                    <button key={t.id} onClick={() => setTon(t.id)}
                      className={`p-3 rounded-xl border-2 text-left transition-all ${ton === t.id ? "border-orange-400 bg-orange-50" : "border-gray-200 hover:border-gray-300"}`}>
                      <p className={`text-xs font-semibold ${ton === t.id ? "text-orange-600" : "text-gray-700"}`}>{t.label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{t.aciklama}</p>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hedef Kitle <span className="text-gray-400 font-normal">(isteğe bağlı)</span></label>
                <input type="text" value={hedefKitle} onChange={(e) => setHedefKitle(e.target.value)} placeholder="örn: 25-40 yaş kadınlar, ev hanımları, spor yapanlar"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Öne Çıkarmak İstediğiniz Özellikler <span className="text-gray-400 font-normal">(isteğe bağlı)</span></label>
                <textarea value={vurgulananlalar} onChange={(e) => setVurgulananlar(e.target.value)} placeholder="örn: hızlı kargo, iade garantisi, yerli üretim, organik malzeme" rows={2}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
                <p className="text-xs text-gray-400 mt-1">Her ürünlede vurgulanmasını istediğiniz marka değerlerinizi yazın.</p>
              </div>
              {mesaj && (
                <div className={`rounded-xl p-3 text-sm text-center ${mesaj.includes("basarı") || mesaj.includes("basarıyla") || mesaj.includes("basariyla") ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                  {mesaj}
                </div>
              )}
              <button onClick={kaydet} disabled={kaydediliyor}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white font-semibold py-3 rounded-xl transition-colors">
                {kaydediliyor ? "Kaydediliyor..." : "Marka Profilini Kaydet"}
              </button>
            </div>
          )}

          {/* Önceki Üretimler Tab */}
          {profilSekme === "uretimler" && (
            <div className="p-6">
              {uretimler.length === 0 ? (
                <div className="text-center py-10 space-y-3">
                  <div className="text-4xl">📝</div>
                  <p className="text-sm text-gray-500">Henüz hiç içerik üretmediniz.</p>
                  <a href="/" className="inline-block bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors">İçerik Üret →</a>
                </div>
              ) : (
                <div className="space-y-2">
                  {uretimler.map((u) => {
                    const bolumler = sonucuBolumle(u.sonuc);
                    const acik = seciliUretim?.id === u.id;
                    return (
                      <div key={u.id} className={`rounded-xl border transition-all ${acik ? "border-orange-300 bg-orange-50" : "border-gray-100 bg-white hover:bg-gray-50"}`}>
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
                          <div className="px-4 pb-4 space-y-2 border-t border-orange-200 pt-3">
                            {bolumler.map((bolum, bi) => (
                              <div key={bi} className="bg-white rounded-xl border border-gray-100 p-4">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm font-semibold text-gray-700">{bolum.ikon} {bolum.baslik}</span>
                                  <button onClick={() => navigator.clipboard.writeText(bolum.icerik)}
                                    className="text-xs text-orange-500 hover:text-orange-600 font-medium px-2 py-1 rounded-lg hover:bg-orange-50 transition-colors">
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
                  {uretimler.length >= (sayfaNo + 1) * SAYFA_BOYUTU && (
                    <div className="text-center pt-2">
                      <button onClick={dahaFazlaYukle} disabled={uretimYukleniyor}
                        className="text-sm text-orange-500 hover:text-orange-700 font-medium disabled:opacity-50">
                        {uretimYukleniyor ? "Yükleniyor..." : "Daha fazla göster ↓"}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

      </div>
      </div>
      <SiteFooter />
    </main>
  );
}
