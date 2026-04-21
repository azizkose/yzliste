"use client";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCredits } from "@/lib/hooks/useCredits";

type Profil = {
  email: string;
  is_admin?: boolean;
  toplam_kullanilan?: number;
  ad_soyad: string | null;
  telefon: string | null;
  adres: string | null;
  fatura_tipi: string | null;
  tc_kimlik: string | null;
  vergi_no: string | null;
  vergi_dairesi: string | null;
};

export default function HesapProfilPage() {
  const [profil, setProfil] = useState<Profil | null>(null);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [kaydediliyor, setKaydediliyor] = useState(false);
  const [mesaj, setMesaj] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  const [adSoyad, setAdSoyad] = useState("");
  const [telefon, setTelefon] = useState("");
  const [adres, setAdres] = useState("");
  const [faturaTipi, setFaturaTipi] = useState("bireysel");
  const [tcKimlik, setTcKimlik] = useState("");
  const [tcKvkkOnay, setTcKvkkOnay] = useState(false);
  const [vergiNo, setVergiNo] = useState("");
  const [vergiDairesi, setVergiDairesi] = useState("");

  const router = useRouter();
  const { data: kredi } = useCredits();

  const yukle = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/giris"); return; }
    setUserId(user.id);

    const { data } = await supabase
      .from("profiles")
      .select("email, is_admin, ad_soyad, telefon, adres, fatura_tipi, tc_kimlik, vergi_no, vergi_dairesi")
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
      setTcKvkkOnay(!!data.tc_kimlik);
      setVergiNo(data.vergi_no || "");
      setVergiDairesi(data.vergi_dairesi || "");
    }
    setYukleniyor(false);
  }, [router]);

  useEffect(() => { yukle(); }, [yukle]); // eslint-disable-line react-hooks/set-state-in-effect

  const kaydet = async () => {
    if (!userId) return;
    if (tcKimlik && !tcKvkkOnay) {
      setMesaj("TC Kimlik No kaydetmek için KVKK onay kutusunu işaretlemelisiniz.");
      return;
    }
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
      })
      .eq("id", userId);

    if (error) {
      setMesaj("Kayıt sırasında hata oluştu.");
    } else {
      setMesaj("Profil başarıyla kaydedildi.");
      setTimeout(() => setMesaj(""), 3000);
    }
    setKaydediliyor(false);
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
        <div className="max-w-2xl mx-auto space-y-6">

          <Link href="/hesap" className="text-sm text-gray-500 hover:text-gray-700">← Hesap</Link>

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Profilim</h1>
              <p className="text-sm text-gray-500 mt-0.5">{profil?.email}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-indigo-50 rounded-xl px-4 py-2 text-center">
                <div className={`text-xl font-bold ${profil?.is_admin ? "text-violet-500" : "text-indigo-500"}`}>
                  {profil?.is_admin ? "∞" : (kredi ?? 0)}
                </div>
                <div className="text-xs text-gray-500">Kalan kredi</div>
              </div>
              <div className="bg-gray-50 rounded-xl px-4 py-2 text-center">
                <div className="text-xl font-bold text-gray-700">{profil?.toplam_kullanilan ?? 0}</div>
                <div className="text-xs text-gray-500">Toplam üretim</div>
              </div>
              <Link href="/uret?paket=ac" className="bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl whitespace-nowrap transition-colors">
                + Kredi Al
              </Link>
            </div>
          </div>

          {/* Kişisel Bilgiler + Fatura Bilgileri */}
          <div id="fatura" className="bg-white rounded-2xl shadow p-6 space-y-5">
            <h2 className="text-base font-semibold text-gray-800">Kişisel ve Fatura Bilgileri</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad</label>
                <input type="text" value={adSoyad} onChange={(e) => setAdSoyad(e.target.value)} placeholder="Ad Soyad"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                <input type="tel" value={telefon} onChange={(e) => setTelefon(e.target.value)} placeholder="05xx xxx xx xx"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Adres</label>
              <textarea value={adres} onChange={(e) => setAdres(e.target.value)} placeholder="Tam adresiniz" rows={2}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            </div>

            <div className="border-t border-gray-100 pt-4">
              <p className="text-sm font-medium text-gray-700 mb-3">Fatura Tipi</p>
              <div className="flex gap-3 mb-4">
                {["bireysel", "kurumsal"].map((tip) => (
                  <button key={tip} onClick={() => setFaturaTipi(tip)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium border-2 transition-all ${faturaTipi === tip ? "border-indigo-400 bg-indigo-50 text-indigo-600" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}>
                    {tip === "bireysel" ? "Bireysel" : "Kurumsal"}
                  </button>
                ))}
              </div>
              {faturaTipi === "bireysel" ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">TC Kimlik No</label>
                  <input type="text" value={tcKimlik} onChange={(e) => setTcKimlik(e.target.value)} placeholder="11 haneli TC kimlik no" maxLength={11}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                  {tcKimlik && (
                    <label className="flex items-start gap-2 mt-2 cursor-pointer">
                      <input type="checkbox" checked={tcKvkkOnay} onChange={(e) => setTcKvkkOnay(e.target.checked)} className="mt-0.5 flex-shrink-0 accent-indigo-500" />
                      <span className="text-xs text-gray-600 leading-snug">
                        TC kimlik numaramın yalnızca e-Arşiv fatura düzenlenmesi amacıyla işlenmesine onay veriyorum.
                        Verilerim yasal zorunluluk kapsamında 10 yıl saklanır; silme, düzeltme ve itiraz hakkım saklıdır.{" "}
                        <a href="/kvkk-aydinlatma" target="_blank" className="text-indigo-500 hover:underline">KVKK Aydınlatma Metni</a>
                      </span>
                    </label>
                  )}
                  <p className="text-xs text-gray-400 mt-1">TC kimlik numaranız yalnızca e-Arşiv fatura için kullanılır, üçüncü taraflarla paylaşılmaz.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Vergi No</label>
                    <input type="text" value={vergiNo} onChange={(e) => setVergiNo(e.target.value)} placeholder="10 haneli vergi no" maxLength={10}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Vergi Dairesi</label>
                    <input type="text" value={vergiDairesi} onChange={(e) => setVergiDairesi(e.target.value)} placeholder="Vergi dairesi adı"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                  </div>
                </div>
              )}
            </div>

            {mesaj && (
              <div className={`rounded-xl p-3 text-sm text-center ${mesaj.includes("başarı") || mesaj.includes("basarıyla") || mesaj.includes("basariyla") ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                {mesaj}
              </div>
            )}
            <button onClick={kaydet} disabled={kaydediliyor}
              className="w-full bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-300 text-white font-semibold py-3 rounded-xl transition-colors">
              {kaydediliyor ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </div>

          {/* Hızlı linkler */}
          <div className="grid grid-cols-2 gap-3">
            <Link href="/hesap/marka" className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:border-indigo-200 hover:shadow-md transition-all group text-center">
              <div className="text-2xl mb-2">🏪</div>
              <p className="text-sm font-semibold text-gray-800 group-hover:text-indigo-600">Marka Profili</p>
              <p className="text-xs text-gray-400 mt-0.5">Ton, hedef kitle</p>
            </Link>
            <Link href="/hesap/uretimler" className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:border-indigo-200 hover:shadow-md transition-all group text-center">
              <div className="text-2xl mb-2">📋</div>
              <p className="text-sm font-semibold text-gray-800 group-hover:text-indigo-600">Üretimler</p>
              <p className="text-xs text-gray-400 mt-0.5">{profil?.toplam_kullanilan ?? 0} üretim</p>
            </Link>
          </div>

        </div>
      </div>
    </main>
  );
}
