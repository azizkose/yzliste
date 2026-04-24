"use client";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Store, ClipboardList } from "lucide-react";
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
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#BAC9EB] border-t-[#1E4DD8] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAFAF8]">
      <div className="py-8 px-4">
        <div className="max-w-2xl mx-auto space-y-6">

          <Link href="/hesap" className="text-sm text-[#908E86] hover:text-[#5A5852]">← Hesap</Link>

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-medium text-[#1A1A17]">Profilim</h1>
              <p className="text-sm text-[#908E86] mt-0.5">{profil?.email}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-[#F0F4FB] rounded-xl px-4 py-2 text-center">
                <div className={`text-xl font-medium ${profil?.is_admin ? "text-[#5A5852]" : "text-[#1E4DD8]"}`}>
                  {profil?.is_admin ? "∞" : (kredi ?? 0)}
                </div>
                <div className="text-xs text-[#908E86]">Kalan kredi</div>
              </div>
              <div className="bg-[#F1F0EB] rounded-xl px-4 py-2 text-center">
                <div className="text-xl font-medium text-[#5A5852]">{profil?.toplam_kullanilan ?? 0}</div>
                <div className="text-xs text-[#908E86]">Toplam üretim</div>
              </div>
              <Link href="/uret?paket=ac" className="bg-[#1E4DD8] hover:bg-[#163B9E] text-white text-xs font-medium px-4 py-2.5 rounded-lg whitespace-nowrap transition-colors">
                + Kredi al
              </Link>
            </div>
          </div>

          {/* Kişisel Bilgiler + Fatura Bilgileri */}
          <div id="fatura" className="bg-white rounded-xl border border-[#D8D6CE] p-6 space-y-5">
            <h2 className="text-base font-medium text-[#1A1A17]">Kişisel ve fatura bilgileri</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#5A5852] mb-1">Ad soyad</label>
                <input type="text" value={adSoyad} onChange={(e) => setAdSoyad(e.target.value)} placeholder="Ad Soyad"
                  className="w-full border border-[#D8D6CE] rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#BAC9EB]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#5A5852] mb-1">Telefon</label>
                <input type="tel" value={telefon} onChange={(e) => setTelefon(e.target.value)} placeholder="05xx xxx xx xx"
                  className="w-full border border-[#D8D6CE] rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#BAC9EB]" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#5A5852] mb-1">Adres</label>
              <textarea value={adres} onChange={(e) => setAdres(e.target.value)} placeholder="Tam adresiniz" rows={2}
                className="w-full border border-[#D8D6CE] rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#BAC9EB]" />
            </div>

            <div className="border-t border-[#D8D6CE] pt-4">
              <p className="text-sm font-medium text-[#5A5852] mb-3">Fatura tipi</p>
              <div className="flex gap-3 mb-4">
                {["bireysel", "kurumsal"].map((tip) => (
                  <button key={tip} onClick={() => setFaturaTipi(tip)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium border-2 transition-all ${faturaTipi === tip ? "border-[#1E4DD8] bg-[#F0F4FB] text-[#1E4DD8]" : "border-[#D8D6CE] text-[#5A5852] hover:border-[#BAC9EB]"}`}>
                    {tip === "bireysel" ? "Bireysel" : "Kurumsal"}
                  </button>
                ))}
              </div>
              {faturaTipi === "bireysel" ? (
                <div>
                  <label className="block text-sm font-medium text-[#5A5852] mb-1">TC kimlik no</label>
                  <input type="text" value={tcKimlik} onChange={(e) => setTcKimlik(e.target.value)} placeholder="11 haneli TC kimlik no" maxLength={11}
                    className="w-full border border-[#D8D6CE] rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#BAC9EB]" />
                  {tcKimlik && (
                    <label className="flex items-start gap-2 mt-2 cursor-pointer">
                      <input type="checkbox" checked={tcKvkkOnay} onChange={(e) => setTcKvkkOnay(e.target.checked)} className="mt-0.5 flex-shrink-0 accent-[#1E4DD8]" />
                      <span className="text-xs text-[#5A5852] leading-snug">
                        TC kimlik numaramın yalnızca e-Arşiv fatura düzenlenmesi amacıyla işlenmesine onay veriyorum.
                        Verilerim yasal zorunluluk kapsamında 10 yıl saklanır; silme, düzeltme ve itiraz hakkım saklıdır.{" "}
                        <a href="/kvkk-aydinlatma" target="_blank" className="text-[#1E4DD8] hover:underline">KVKK aydınlatma metni</a>
                      </span>
                    </label>
                  )}
                  <p className="text-xs text-[#908E86] mt-1">TC kimlik numaranız yalnızca e-Arşiv fatura için kullanılır, üçüncü taraflarla paylaşılmaz.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#5A5852] mb-1">Vergi no</label>
                    <input type="text" value={vergiNo} onChange={(e) => setVergiNo(e.target.value)} placeholder="10 haneli vergi no" maxLength={10}
                      className="w-full border border-[#D8D6CE] rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#BAC9EB]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#5A5852] mb-1">Vergi dairesi</label>
                    <input type="text" value={vergiDairesi} onChange={(e) => setVergiDairesi(e.target.value)} placeholder="Vergi dairesi adı"
                      className="w-full border border-[#D8D6CE] rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#BAC9EB]" />
                  </div>
                </div>
              )}
            </div>

            {mesaj && (
              <div className={`rounded-xl p-3 text-sm text-center ${mesaj.includes("başarı") || mesaj.includes("basarıyla") || mesaj.includes("basariyla") ? "bg-[#E8F5EE] text-[#0F5132] border border-[#0F5132]/20" : "bg-[#FCECEC] text-[#7A1E1E] border border-[#7A1E1E]/20"}`}>
                {mesaj}
              </div>
            )}
            <button onClick={kaydet} disabled={kaydediliyor}
              className="w-full bg-[#1E4DD8] hover:bg-[#163B9E] disabled:bg-[#D8D6CE] text-white font-medium py-3 rounded-lg transition-colors">
              {kaydediliyor ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </div>

          {/* Hızlı linkler */}
          <div className="grid grid-cols-2 gap-3">
            <Link href="/hesap/marka" className="bg-white rounded-xl border border-[#D8D6CE] p-4 hover:border-[#7B9BD9] transition-all group text-center">
              <div className="flex justify-center mb-2">
                <Store size={24} strokeWidth={1.5} className="text-[#908E86] group-hover:text-[#1E4DD8]" />
              </div>
              <p className="text-sm font-medium text-[#1A1A17] group-hover:text-[#1E4DD8]">Marka profili</p>
              <p className="text-xs text-[#908E86] mt-0.5">Ton, hedef kitle</p>
            </Link>
            <Link href="/hesap/uretimler" className="bg-white rounded-xl border border-[#D8D6CE] p-4 hover:border-[#7B9BD9] transition-all group text-center">
              <div className="flex justify-center mb-2">
                <ClipboardList size={24} strokeWidth={1.5} className="text-[#908E86] group-hover:text-[#1E4DD8]" />
              </div>
              <p className="text-sm font-medium text-[#1A1A17] group-hover:text-[#1E4DD8]">Üretimler</p>
              <p className="text-xs text-[#908E86] mt-0.5">{profil?.toplam_kullanilan ?? 0} üretim</p>
            </Link>
          </div>

        </div>
      </div>
    </main>
  );
}
