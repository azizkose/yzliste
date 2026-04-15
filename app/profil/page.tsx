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
  marka_adi: string | null;
  ton: string | null;
  hedef_kitle: string | null;
  vurgulanan_ozellikler: string | null;
};

export default function ProfilPage() {
  const [profil, setProfil] = useState<Profil | null>(null);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [kaydediliyor, setKaydediliyor] = useState(false);
  const [mesaj, setMesaj] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
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
      .select("email, kredi, ad_soyad, telefon, adres, fatura_tipi, tc_kimlik, vergi_no, vergi_dairesi, marka_adi, ton, hedef_kitle, vurgulanan_ozellikler")
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
      setMarkaAdi(data.marka_adi || "");
      setTon(data.ton || "samimi");
      setHedefKitle(data.hedef_kitle || "");
      setVurgulananlar(data.vurgulanan_ozellikler || "");
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

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Profilim</h1>
            <p className="text-sm text-gray-500 mt-0.5">{profil?.email}</p>
          </div>
          <a href="/" className="text-sm text-gray-400 hover:text-gray-600">
            Ana sayfaya don
          </a>
        </div>

        {/* Kredi ozeti */}
        <div className="bg-white rounded-2xl shadow p-5 flex items-center gap-4">
          <div className="bg-orange-50 rounded-xl px-5 py-3 text-center">
            <div className="text-2xl font-bold text-orange-500">{profil?.kredi ?? 0}</div>
            <div className="text-xs text-gray-500">Kalan kredi</div>
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-600">Kullanim haklariniz metin ve gorsel uretimi icin kullanilir.</p>
          </div>
          <a href="/?paket=ac" className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold px-4 py-2 rounded-xl whitespace-nowrap">
            İçerik Üretim Kredisi Al
          </a>
        </div>

        {/* Marka Profili - EN USTE ALINDI */}
        <div className="bg-white rounded-2xl shadow p-6 space-y-4">
          <div>
            <h2 className="text-base font-semibold text-gray-800">Marka Profili</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Bu bilgiler her uretimde AI prompta otomatik eklenir — cikti kalitenizi arttirir.
            </p>
          </div>

          <div className="bg-orange-50 border border-orange-100 rounded-xl p-3 text-xs text-orange-700 leading-relaxed">
            Marka profilinizi doldurunca AI metinleri sizin dilinizde, hedef kitlenize gore yazar. Orn: "Kadin modasi, 25-35 yas" yazarsaniz AI bu kitlenin anlayacagi bir dil kullanir.
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Magaza / Marka Adi</label>
            <input
              type="text"
              value={markaAdi}
              onChange={(e) => setMarkaAdi(e.target.value)}
              placeholder="orn: Ayse Tekstil, TechStore TR"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Metin Tonu</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "samimi", label: "Samimi", aciklama: "Sıcak, yakın dil" },
                { id: "profesyonel", label: "Profesyonel", aciklama: "Resmi, kurumsal" },
                { id: "premium", label: "Premium", aciklama: "Lüks, seçkin" },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTon(t.id)}
                  className={`p-3 rounded-xl border-2 text-left transition-all ${
                    ton === t.id
                      ? "border-orange-400 bg-orange-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <p className={`text-xs font-semibold ${ton === t.id ? "text-orange-600" : "text-gray-700"}`}>
                    {t.label}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{t.aciklama}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hedef Kitle <span className="text-gray-400 font-normal">(istege bagli)</span>
            </label>
            <input
              type="text"
              value={hedefKitle}
              onChange={(e) => setHedefKitle(e.target.value)}
              placeholder="orn: 25-40 yas kadinlar, ev hanımlari, spor yapanlar"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              One Cikarmak Istediginiz Ozellikler <span className="text-gray-400 font-normal">(istege bagli)</span>
            </label>
            <textarea
              value={vurgulananlalar}
              onChange={(e) => setVurgulananlar(e.target.value)}
              placeholder="orn: hizli kargo, iade garantisi, yerli uretim, organik malzeme"
              rows={2}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <p className="text-xs text-gray-400 mt-1">Her urunde vurgulanmasini istediginiz marka degerlerinizi yazin.</p>
          </div>
        </div>

        {/* Kisisel Bilgiler */}
        <div id="fatura" className="bg-white rounded-2xl shadow p-6 space-y-4">
          <h2 className="text-base font-semibold text-gray-800">Kisisel Bilgiler</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad</label>
              <input
                type="text"
                value={adSoyad}
                onChange={(e) => setAdSoyad(e.target.value)}
                placeholder="Ad Soyad"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
              <input
                type="tel"
                value={telefon}
                onChange={(e) => setTelefon(e.target.value)}
                placeholder="05xx xxx xx xx"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Adres</label>
            <textarea
              value={adres}
              onChange={(e) => setAdres(e.target.value)}
              placeholder="Tam adresiniz"
              rows={2}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
        </div>

        {/* Fatura Bilgileri */}
        <div className="bg-white rounded-2xl shadow p-6 space-y-4">
          <h2 className="text-base font-semibold text-gray-800">Fatura Bilgileri</h2>

          <div className="flex gap-3">
            {["bireysel", "kurumsal"].map((tip) => (
              <button
                key={tip}
                onClick={() => setFaturaTipi(tip)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium border-2 transition-all ${
                  faturaTipi === tip
                    ? "border-orange-400 bg-orange-50 text-orange-600"
                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                {tip === "bireysel" ? "Bireysel" : "Kurumsal"}
              </button>
            ))}
          </div>

          {faturaTipi === "bireysel" ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">TC Kimlik No</label>
              <input
                type="text"
                value={tcKimlik}
                onChange={(e) => setTcKimlik(e.target.value)}
                placeholder="11 haneli TC kimlik no"
                maxLength={11}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vergi No</label>
                <input
                  type="text"
                  value={vergiNo}
                  onChange={(e) => setVergiNo(e.target.value)}
                  placeholder="10 haneli vergi no"
                  maxLength={10}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vergi Dairesi</label>
                <input
                  type="text"
                  value={vergiDairesi}
                  onChange={(e) => setVergiDairesi(e.target.value)}
                  placeholder="Vergi dairesi adi"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
            </div>
          )}
        </div>

        {/* Kaydet */}
        {mesaj && (
          <div className={`rounded-xl p-3 text-sm text-center ${
            mesaj.includes("basarı") || mesaj.includes("basarıyla") || mesaj.includes("basariyla")
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}>
            {mesaj}
          </div>
        )}

        <button
          onClick={kaydet}
          disabled={kaydediliyor}
          className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white font-semibold py-3 rounded-xl transition-colors"
        >
          {kaydediliyor ? "Kaydediliyor..." : "Kaydet"}
        </button>

      </div>
    </main>
  );
}
