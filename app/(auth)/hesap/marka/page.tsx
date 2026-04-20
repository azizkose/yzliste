"use client";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export const metadata = undefined; // client component — metadata app/layout'tan gelir

export default function HesapMarkaPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [kaydediliyor, setKaydediliyor] = useState(false);
  const [mesaj, setMesaj] = useState("");

  const [markaAdi, setMarkaAdi] = useState("");
  const [ton, setTon] = useState("samimi");
  const [hedefKitle, setHedefKitle] = useState("");
  const [vurgulananlalar, setVurgulananlar] = useState("");

  const router = useRouter();

  const yukle = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/giris"); return; }
    setUserId(user.id);

    const { data } = await supabase
      .from("profiles")
      .select("marka_adi, ton, hedef_kitle, vurgulanan_ozellikler")
      .eq("id", user.id)
      .single();

    if (data) {
      setMarkaAdi(data.marka_adi || "");
      setTon(data.ton || "samimi");
      setHedefKitle(data.hedef_kitle || "");
      setVurgulananlar(data.vurgulanan_ozellikler || "");
    }
    setYukleniyor(false);
  }, [router]);

  useEffect(() => { yukle(); }, [yukle]);

  const kaydet = async () => {
    if (!userId) return;
    setKaydediliyor(true);
    setMesaj("");
    const { error } = await supabase
      .from("profiles")
      .update({
        marka_adi: markaAdi || null,
        ton,
        hedef_kitle: hedefKitle || null,
        vurgulanan_ozellikler: vurgulananlalar || null,
      })
      .eq("id", userId);

    if (error) {
      setMesaj("Kayıt sırasında hata oluştu.");
    } else {
      setMesaj("Marka profili başarıyla kaydedildi.");
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

          <div>
            <h1 className="text-xl font-bold text-gray-900">Marka Profili</h1>
            <p className="text-sm text-gray-500 mt-0.5">AI metinleri bu bilgilere göre kişiselleştirilir</p>
          </div>

          <div className="bg-white rounded-2xl shadow p-6 space-y-5">
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3 text-xs text-indigo-700 leading-relaxed">
              Marka profilinizi doldurunca AI metinleri sizin dilinizde, hedef kitlenize göre yazar. Örn: &quot;Kadın modası, 25-35 yaş&quot; yazarsanız AI bu kitlenin anlayacağı bir dil kullanır.
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mağaza / Marka Adı</label>
              <input
                type="text"
                value={markaAdi}
                onChange={(e) => setMarkaAdi(e.target.value)}
                placeholder="örn: Ayşe Tekstil, TechStore TR"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Metin Tonu</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "samimi", label: "Samimi", aciklama: "Sıcak, yakın dil" },
                  { id: "profesyonel", label: "Profesyonel", aciklama: "Resmi, kurumsal" },
                  { id: "premium", label: "Premium", aciklama: "Lüks, seçkin" },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTon(t.id)}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${ton === t.id ? "border-indigo-400 bg-indigo-50" : "border-gray-200 hover:border-gray-300"}`}
                  >
                    <p className={`text-xs font-semibold ${ton === t.id ? "text-indigo-600" : "text-gray-700"}`}>{t.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{t.aciklama}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hedef Kitle <span className="text-gray-400 font-normal">(isteğe bağlı)</span>
              </label>
              <input
                type="text"
                value={hedefKitle}
                onChange={(e) => setHedefKitle(e.target.value)}
                placeholder="örn: 25-40 yaş kadınlar, ev hanımları, spor yapanlar"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Öne Çıkarmak İstediğiniz Özellikler <span className="text-gray-400 font-normal">(isteğe bağlı)</span>
              </label>
              <textarea
                value={vurgulananlalar}
                onChange={(e) => setVurgulananlar(e.target.value)}
                placeholder="örn: hızlı kargo, iade garantisi, yerli üretim, organik malzeme"
                rows={2}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <p className="text-xs text-gray-400 mt-1">Her üründe vurgulanmasını istediğiniz marka değerlerinizi yazın.</p>
            </div>

            {mesaj && (
              <div className={`rounded-xl p-3 text-sm text-center ${mesaj.includes("başarı") ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                {mesaj}
              </div>
            )}

            <button
              onClick={kaydet}
              disabled={kaydediliyor}
              className="w-full bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-300 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              {kaydediliyor ? "Kaydediliyor..." : "Marka Profilini Kaydet"}
            </button>
          </div>

        </div>
      </div>
    </main>
  );
}
