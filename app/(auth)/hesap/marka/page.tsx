"use client";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

const KATEGORILER = [
  "Kadın Giyim", "Erkek Giyim", "Çocuk", "Kozmetik", "Elektronik",
  "Ev & Yaşam", "Gıda", "Takı & Aksesuar", "Spor", "Oto", "Kitap & Hobi", "Diğer",
];

const TESLIMAT_SECENEKLERI = [
  "Hızlı kargo", "Kolay iade", "Yerli üretim", "Organik/doğal",
  "Hediye paketi", "Garanti", "Taksit imkanı",
];

const FIYAT_BANTLARI = [
  { id: "ekonomik", label: "Ekonomik", alt: "0 – 100 TL" },
  { id: "orta",     label: "Orta",     alt: "100 – 500 TL" },
  { id: "premium",  label: "Premium",  alt: "500 TL+" },
];

export default function HesapMarkaPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [kaydediliyor, setKaydediliyor] = useState(false);
  const [mesaj, setMesaj] = useState("");

  const [markaAdi, setMarkaAdi] = useState("");
  const [ton, setTon] = useState("samimi");
  const [hedefKitle, setHedefKitle] = useState("");
  const [vurgulananlar, setVurgulananlar] = useState("");
  const [magazaKategorileri, setMagazaKategorileri] = useState<string[]>([]);
  const [fiyatBandi, setFiyatBandi] = useState("");
  const [teslimatVurgulari, setTeslimatVurgulari] = useState<string[]>([]);
  const [benchmarkMagaza, setBenchmarkMagaza] = useState("");

  const router = useRouter();

  const yukle = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/giris"); return; }
    setUserId(user.id);

    const { data } = await supabase
      .from("profiles")
      .select("marka_adi, ton, hedef_kitle, vurgulanan_ozellikler, magaza_kategorileri, fiyat_bandi, teslimat_vurgulari, benchmark_magaza")
      .eq("id", user.id)
      .single();

    if (data) {
      setMarkaAdi(data.marka_adi || "");
      setTon(data.ton || "samimi");
      setHedefKitle(data.hedef_kitle || "");
      setVurgulananlar(data.vurgulanan_ozellikler || "");
      setMagazaKategorileri(data.magaza_kategorileri || []);
      setFiyatBandi(data.fiyat_bandi || "");
      setTeslimatVurgulari(data.teslimat_vurgulari || []);
      setBenchmarkMagaza(data.benchmark_magaza || "");
    }
    setYukleniyor(false);
  }, [router]);

  useEffect(() => { yukle(); }, [yukle]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleKategori = (k: string) => {
    setMagazaKategorileri(prev =>
      prev.includes(k) ? prev.filter(x => x !== k) : prev.length < 3 ? [...prev, k] : prev
    );
  };

  const toggleTeslimat = (t: string) => {
    setTeslimatVurgulari(prev =>
      prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]
    );
  };

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
        vurgulanan_ozellikler: vurgulananlar || null,
        magaza_kategorileri: magazaKategorileri.length > 0 ? magazaKategorileri : null,
        fiyat_bandi: fiyatBandi || null,
        teslimat_vurgulari: teslimatVurgulari.length > 0 ? teslimatVurgulari : null,
        benchmark_magaza: benchmarkMagaza || null,
      })
      .eq("id", userId);

    if (error) {
      setMesaj("Kayıt sırasında hata oluştu.");
    } else {
      setMesaj("Marka profili kaydedildi.");
      setTimeout(() => setMesaj(""), 3000);
    }
    setKaydediliyor(false);
  };

  if (yukleniyor) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#D8D6CE] border-t-[#1E4DD8] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAFAF8]">
      <div className="py-8 px-4">
        <div className="max-w-2xl mx-auto space-y-6">

          <Link href="/hesap" className="text-sm text-[#908E86] hover:text-[#5A5852] transition-colors">← Hesap</Link>

          <div>
            <h1 className="text-xl font-medium text-[#1A1A17]">Marka profili</h1>
            <p className="text-sm text-[#908E86] mt-0.5">AI metinleri bu bilgilere göre kişiselleştirilir</p>
          </div>

          <div className="bg-white rounded-xl border border-[#D8D6CE] p-6 space-y-6">
            <div className="bg-[#F0F4FB] border border-[#BAC9EB] rounded-lg p-3 text-xs text-[#1E4DD8] leading-relaxed">
              Marka profilinizi doldurunca AI metinleri sizin dilinizde, hedef kitlenize göre yazar. Örn: &quot;Kadın modası, 25-35 yaş&quot; yazarsanız AI bu kitlenin anlayacağı bir dil kullanır.
            </div>

            {/* Marka adı */}
            <div>
              <label className="block text-sm font-medium text-[#1A1A17] mb-1">Mağaza / marka adı</label>
              <input
                type="text"
                value={markaAdi}
                onChange={(e) => setMarkaAdi(e.target.value)}
                placeholder="örn: Ayşe Tekstil, TechStore TR"
                className="w-full border border-[#D8D6CE] rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E4DD8]/20 focus:border-[#1E4DD8]"
              />
            </div>

            {/* Ton */}
            <div>
              <label className="block text-sm font-medium text-[#1A1A17] mb-2">Metin tonu</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "samimi",       label: "Samimi",       aciklama: "Sıcak, yakın dil" },
                  { id: "profesyonel",  label: "Profesyonel",  aciklama: "Resmi, kurumsal" },
                  { id: "premium",      label: "Premium",      aciklama: "Lüks, seçkin" },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTon(t.id)}
                    className={`p-3 rounded-lg border-2 text-left transition-all ${ton === t.id ? "border-[#1E4DD8] bg-[#F0F4FB]" : "border-[#D8D6CE] hover:border-[#1E4DD8]/40"}`}
                  >
                    <p className={`text-xs font-medium ${ton === t.id ? "text-[#1E4DD8]" : "text-[#1A1A17]"}`}>{t.label}</p>
                    <p className="text-xs text-[#908E86] mt-0.5">{t.aciklama}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Hedef kitle */}
            <div>
              <label className="block text-sm font-medium text-[#1A1A17] mb-1">
                Hedef kitle <span className="text-[#908E86] font-normal">(isteğe bağlı)</span>
              </label>
              <input
                type="text"
                value={hedefKitle}
                onChange={(e) => setHedefKitle(e.target.value)}
                placeholder="örn: 25-40 yaş kadınlar, ev hanımları, spor yapanlar"
                className="w-full border border-[#D8D6CE] rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E4DD8]/20 focus:border-[#1E4DD8]"
              />
            </div>

            {/* Vurgulanan özellikler */}
            <div>
              <label className="block text-sm font-medium text-[#1A1A17] mb-1">
                Öne çıkarmak istediğiniz özellikler <span className="text-[#908E86] font-normal">(isteğe bağlı)</span>
              </label>
              <textarea
                value={vurgulananlar}
                onChange={(e) => setVurgulananlar(e.target.value)}
                placeholder="örn: hızlı kargo, iade garantisi, yerli üretim, organik malzeme"
                rows={2}
                className="w-full border border-[#D8D6CE] rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E4DD8]/20 focus:border-[#1E4DD8]"
              />
              <p className="text-xs text-[#908E86] mt-1">Her üründe vurgulanmasını istediğiniz marka değerlerinizi yazın.</p>
            </div>

            <div className="border-t border-[#F1F0EB] pt-5 space-y-6">
              <p className="text-xs font-medium text-[#908E86] uppercase tracking-wide">Ek bilgiler</p>

              {/* Mağaza kategorileri */}
              <div>
                <label className="block text-sm font-medium text-[#1A1A17] mb-1">
                  Mağaza kategorileri <span className="text-[#908E86] font-normal">(max 3)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {KATEGORILER.map((k) => {
                    const secili = magazaKategorileri.includes(k);
                    const disabled = !secili && magazaKategorileri.length >= 3;
                    return (
                      <button
                        key={k}
                        type="button"
                        onClick={() => toggleKategori(k)}
                        disabled={disabled}
                        className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                          secili
                            ? "border-[#1E4DD8] bg-[#F0F4FB] text-[#1E4DD8]"
                            : disabled
                            ? "border-[#D8D6CE] text-[#D8D6CE] cursor-not-allowed"
                            : "border-[#D8D6CE] text-[#5A5852] hover:border-[#1E4DD8]/40"
                        }`}
                      >
                        {k}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Fiyat bandı */}
              <div>
                <label className="block text-sm font-medium text-[#1A1A17] mb-2">Fiyat bandı</label>
                <div className="grid grid-cols-3 gap-2">
                  {FIYAT_BANTLARI.map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setFiyatBandi(prev => prev === b.id ? "" : b.id)}
                      className={`p-3 rounded-lg border-2 text-left transition-all ${fiyatBandi === b.id ? "border-[#1E4DD8] bg-[#F0F4FB]" : "border-[#D8D6CE] hover:border-[#1E4DD8]/40"}`}
                    >
                      <p className={`text-xs font-medium ${fiyatBandi === b.id ? "text-[#1E4DD8]" : "text-[#1A1A17]"}`}>{b.label}</p>
                      <p className="text-xs text-[#908E86] mt-0.5">{b.alt}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Teslimat/hizmet vurguları */}
              <div>
                <label className="block text-sm font-medium text-[#1A1A17] mb-2">Hizmet vurguları</label>
                <div className="flex flex-wrap gap-2">
                  {TESLIMAT_SECENEKLERI.map((t) => {
                    const secili = teslimatVurgulari.includes(t);
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => toggleTeslimat(t)}
                        className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                          secili
                            ? "border-[#1E4DD8] bg-[#F0F4FB] text-[#1E4DD8]"
                            : "border-[#D8D6CE] text-[#5A5852] hover:border-[#1E4DD8]/40"
                        }`}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Benchmark mağaza */}
              <div>
                <label className="block text-sm font-medium text-[#1A1A17] mb-1">
                  Referans mağaza <span className="text-[#908E86] font-normal">(isteğe bağlı)</span>
                </label>
                <input
                  type="text"
                  value={benchmarkMagaza}
                  onChange={(e) => setBenchmarkMagaza(e.target.value)}
                  placeholder="Beğendiğin veya hedeflediğin bir mağaza adı"
                  className="w-full border border-[#D8D6CE] rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E4DD8]/20 focus:border-[#1E4DD8]"
                />
                <p className="text-xs text-[#908E86] mt-1">AI bu mağazanın tarzını referans alır.</p>
              </div>
            </div>

            {mesaj && (
              <div className={`rounded-lg p-3 text-sm text-center ${mesaj.includes("kaydedildi") ? "bg-[#E8F5EE] text-[#0F5132] border border-[#0F5132]/20" : "bg-[#FCECEC] text-[#7A1E1E] border border-[#7A1E1E]/20"}`}>
                {mesaj}
              </div>
            )}

            <button
              onClick={kaydet}
              disabled={kaydediliyor}
              className="w-full bg-[#1E4DD8] hover:bg-[#163B9E] disabled:bg-[#D8D6CE] text-white font-medium py-3 rounded-lg transition-colors"
            >
              {kaydediliyor ? "Kaydediliyor..." : "Marka profilini kaydet"}
            </button>
          </div>

        </div>
      </div>
    </main>
  );
}
