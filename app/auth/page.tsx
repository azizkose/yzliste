"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [sifre, setSifre] = useState("");
  const [mod, setMod] = useState<"giris" | "kayit">("kayit");
  const [yukleniyor, setYukleniyor] = useState(false);
  const [mesaj, setMesaj] = useState("");
  const router = useRouter();

  const handleSubmit = async () => {
    if (!email || !sifre) return;
    setYukleniyor(true);
    setMesaj("");
    if (mod === "kayit") {
      const { error } = await supabase.auth.signUp({ email, password: sifre });
      if (error) {
        setMesaj(error.message);
      } else {
        setMesaj("Kayit basarili! E-postanizi dogrulayin.");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password: sifre });
      if (error) {
        setMesaj("E-posta veya sifre hatali.");
      } else {
        router.push("/");
      }
    }
    setYukleniyor(false);
  };

  const adimlar = [
    { no: "1", baslik: "Urunu tanimla", aciklama: "Urun adi yaz, fotograf yukle ya da barkod tara", ikon: "pencil" },
    { no: "2", baslik: "Platform sec", aciklama: "Trendyol, Hepsiburada, Amazon TR veya N11", ikon: "store" },
    { no: "3", baslik: "Listing al", aciklama: "Optimize baslik, ozellikler ve aciklama hazir", ikon: "check" },
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            YZ<span className="text-orange-500">Liste</span>
          </h1>
          <button
            onClick={() => { setMod("giris"); document.getElementById("auth-form")?.scrollIntoView({ behavior: "smooth" }); }}
            className="text-sm text-gray-600 hover:text-orange-500 font-medium transition-colors"
          >
            Zaten hesabim var
          </button>
        </div>
      </header>

      <section className="bg-white px-6 py-16 text-center border-b border-gray-100">
        <div className="max-w-2xl mx-auto">
          <span className="inline-block bg-orange-50 text-orange-600 text-xs font-semibold px-3 py-1 rounded-full mb-4 tracking-wide uppercase">
            Turk E-Ticaret Saticilari Icin
          </span>
          <h2 className="text-4xl font-bold text-gray-900 leading-tight mb-4">
            30 saniyede mukemmel<br />
            <span className="text-orange-500">urun listesi</span> olustur
          </h2>
          <p className="text-lg text-gray-500 mb-8">
            Trendyol, Hepsiburada, Amazon TR ve N11 icin yapay zeka destekli,
            Turk alici psikolojisine gore optimize edilmis listing icerikleri.
          </p>
          <button
            onClick={() => { setMod("kayit"); document.getElementById("auth-form")?.scrollIntoView({ behavior: "smooth" }); }}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3.5 rounded-xl text-base transition-colors shadow-sm"
          >
            Ucretsiz Dene - 3 Kredi Hediye
          </button>
          <p className="text-xs text-gray-400 mt-3">Kredi karti gerekmez</p>
        </div>
      </section>

      <section className="px-6 py-14">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-center text-xl font-bold text-gray-800 mb-10">Nasil calisir?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {adimlar.map((adim, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center relative">
                {i < adimlar.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 text-gray-300 text-xl z-10">-&gt;</div>
                )}
                <div className="inline-block bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full mb-3">
                  Adim {adim.no}
                </div>
                <h4 className="font-semibold text-gray-800 mb-1">{adim.baslik}</h4>
                <p className="text-sm text-gray-500">{adim.aciklama}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-14 border-t border-gray-100">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-center text-xl font-bold text-gray-800 mb-8">Neden YZListe?</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { ikon: "photo", baslik: "Fotograftan Listing", aciklama: "Urun fotografini yukle, AI analiz etsin" },
              { ikon: "scan", baslik: "Barkod Tarama", aciklama: "Barkodu tara, urun bilgileri otomatik gelsin" },
              { ikon: "store", baslik: "4 Platform", aciklama: "Her platform icin ayri optimize format" },
              { ikon: "bolt", baslik: "30 Saniye", aciklama: "Manuel yazmaya son, aninda hazir" },
            ].map((f, i) => (
              <div key={i} className="text-center p-4">
                <div className="font-semibold text-sm text-gray-800 mb-1">{f.baslik}</div>
                <div className="text-xs text-gray-500">{f.aciklama}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="auth-form" className="px-6 py-16 bg-gray-50">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {mod === "kayit" ? "Hemen basla" : "Tekrar hos geldin"}
            </h3>
            <p className="text-gray-500 text-sm">
              {mod === "kayit" ? "3 ucretsiz kredi ile dene, kredi karti gerekmez" : "Hesabina giris yap"}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow p-8">
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setMod("kayit")}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${mod === "kayit" ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              >
                Kayit Ol
              </button>
              <button
                onClick={() => setMod("giris")}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${mod === "giris" ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              >
                Giris Yap
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ornek@email.com"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sifre</label>
                <input
                  type="password"
                  value={sifre}
                  onChange={(e) => setSifre(e.target.value)}
                  placeholder="En az 6 karakter"
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
                />
              </div>

              {mesaj && (
                <p className={`text-sm ${mesaj.includes("basarili") ? "text-green-600" : "text-red-500"}`}>
                  {mesaj}
                </p>
              )}

              <button
                onClick={handleSubmit}
                disabled={yukleniyor || !email || !sifre}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white font-semibold py-3 rounded-lg transition-colors text-sm"
              >
                {yukleniyor ? "..." : mod === "kayit" ? "Ucretsiz Hesap Olustur" : "Giris Yap"}
              </button>
            </div>

            {mod === "kayit" && (
              <p className="text-xs text-gray-400 text-center mt-4">
                Kayit olunca 3 ucretsiz kredi alirsiniz
              </p>
            )}
          </div>
        </div>
      </section>

      <footer className="text-center py-6 text-xs text-gray-400 border-t border-gray-100">
        2026 YZListe - Turk e-ticaret saticilari icin yapay zeka asistani
      </footer>
    </main>
  );
}
