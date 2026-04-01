"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

type Profil = {
  email: string;
  kredi: number;
  ad_soyad: string | null;
  telefon: string | null;
  adres: string | null;
  fatura_tipi: string | null;
  tc_kimlik: string | null;
  vergi_no: string | null;
  vergi_dairesi: string | null;
};

export default function ProfilPage() {
  const [profil, setProfil] = useState<Profil | null>(null);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [kaydediliyor, setKaydediliyor] = useState(false);
  const [mesaj, setMesaj] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  // Form state
  const [adSoyad, setAdSoyad] = useState("");
  const [telefon, setTelefon] = useState("");
  const [adres, setAdres] = useState("");
  const [faturaTipi, setFaturaTipi] = useState("bireysel");
  const [tcKimlik, setTcKimlik] = useState("");
  const [vergiNo, setVergiNo] = useState("");
  const [vergiDairesi, setVergiDairesi] = useState("");

  useEffect(() => {
    profilYukle();
  }, []);

  const profilYukle = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/auth"); return; }
    setUserId(user.id);

    const { data } = await supabase
      .from("profiles")
      .select("email, kredi, ad_soyad, telefon, adres, fatura_tipi, tc_kimlik, vergi_no, vergi_dairesi")
      .eq("id", user.id)
      .single();

    if (data) {
      setProfil(data);
      setAdSoyad(data.ad_soyad || "");
      setTelefon(data.telefon || "");
      setAdres(data.adres || "");
      setFaturaTipi(data.fatura_tipi || "bireysel");
      setTcKimlik(data.tc_kimlik || "");
      setVergiNo(data.vergi_no || "");
      setVergiDairesi(data.vergi_dairesi || "");
    }
    setYukleniyor(false);
  };

  const kaydet = async () => {
    if (!userId) return;
    setKaydediliyor(true);
    setMesaj("");

    const { error } = await supabase
      .from("profiles")
      .update({
        ad_soyad: adSoyad,
        telefon,
        adres,
        fatura_tipi: faturaTipi,
        tc_kimlik: faturaTipi === "bireysel" ? tcKimlik : null,
        vergi_no: faturaTipi === "kurumsal" ? vergiNo : null,
        vergi_dairesi: faturaTipi === "kurumsal" ? vergiDairesi : null,
      })
      .eq("id", userId);

    if (error) {
      setMesaj("Hata olustu, tekrar deneyin.");
    } else {
      setMesaj("Bilgileriniz kaydedildi.");
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

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <a href="/" className="text-gray-400 hover:text-gray-600 text-sm">← Ana Sayfa</a>
            <span className="text-gray-300">|</span>
            <h1 className="text-lg font-bold text-gray-900">Profil ve Fatura Bilgileri</h1>
          </div>
          <div className="bg-orange-50 rounded-xl px-4 py-2 text-center">
            <div className="text-xl font-bold text-orange-500">{profil?.kredi ?? 0}</div>
            <div className="text-xs text-gray-500">Kalan hak</div>
          </div>
        </div>

        {/* Hesap Bilgisi */}
        <div className="bg-white rounded-2xl shadow p-6 mb-4">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Hesap Bilgisi</h2>
          <div className="bg-gray-50 rounded-xl px-4 py-3">
            <p className="text-xs text-gray-500">E-posta</p>
            <p className="text-sm font-medium text-gray-800">{profil?.email}</p>
          </div>
        </div>

        {/* Fatura Bilgileri */}
        <div className="bg-white rounded-2xl shadow p-6 space-y-4">
          <h2 className="text-sm font-semibold text-gray-700">Fatura Bilgileri</h2>
          <p className="text-xs text-gray-400">Bu bilgiler satın alma faturalarında kullanilacaktir.</p>

          {/* Ad Soyad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ad Soyad <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={adSoyad}
              onChange={(e) => setAdSoyad(e.target.value)}
              placeholder="Ad Soyad"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
            />
          </div>

          {/* Telefon */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
            <input
              type="tel"
              value={telefon}
              onChange={(e) => setTelefon(e.target.value)}
              placeholder="05xx xxx xx xx"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
            />
          </div>

          {/* Adres */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Adres</label>
            <textarea
              value={adres}
              onChange={(e) => setAdres(e.target.value)}
              placeholder="Fatura adresi"
              rows={2}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
            />
          </div>

          {/* Fatura Tipi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fatura Tipi</label>
            <div className="flex gap-3">
              <button
                onClick={() => setFaturaTipi("bireysel")}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${
                  faturaTipi === "bireysel"
                    ? "bg-orange-500 text-white border-orange-500"
                    : "bg-white text-gray-600 border-gray-200 hover:border-orange-300"
                }`}
              >
                Bireysel
              </button>
              <button
                onClick={() => setFaturaTipi("kurumsal")}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${
                  faturaTipi === "kurumsal"
                    ? "bg-orange-500 text-white border-orange-500"
                    : "bg-white text-gray-600 border-gray-200 hover:border-orange-300"
                }`}
              >
                Kurumsal
              </button>
            </div>
          </div>

          {/* Bireysel alanlar */}
          {faturaTipi === "bireysel" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                TC Kimlik No <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={tcKimlik}
                onChange={(e) => setTcKimlik(e.target.value.replace(/\D/g, "").slice(0, 11))}
                placeholder="11 haneli TC kimlik no"
                maxLength={11}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
              />
            </div>
          )}

          {/* Kurumsal alanlar */}
          {faturaTipi === "kurumsal" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vergi No <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={vergiNo}
                  onChange={(e) => setVergiNo(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  placeholder="10 haneli vergi no"
                  maxLength={10}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vergi Dairesi <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={vergiDairesi}
                  onChange={(e) => setVergiDairesi(e.target.value)}
                  placeholder="örn: Kadikoy"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
                />
              </div>
            </>
          )}

          {mesaj && (
            <p className={`text-sm font-medium ${mesaj.includes("kaydedildi") ? "text-green-600" : "text-red-500"}`}>
              {mesaj.includes("kaydedildi") ? "✓ " : "✗ "}{mesaj}
            </p>
          )}

          <button
            onClick={kaydet}
            disabled={kaydediliyor || !adSoyad}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white font-semibold py-3 rounded-lg transition-colors text-sm"
          >
            {kaydediliyor ? "Kaydediliyor..." : "Bilgileri Kaydet"}
          </button>
        </div>

        {/* Odeme Gecmisi linki */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-400">
            Odeme gecmisinizi görmek için{" "}
            <a href="/" className="text-orange-500 hover:underline">Ana Sayfa</a>'ya donun.
          </p>
        </div>
      </div>
    </main>
  );
}
