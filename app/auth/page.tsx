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
      if (error) setMesaj(error.message);
      else setMesaj("Kayit basarili! E-postanizi dogrulayin.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password: sifre });
      if (error) setMesaj("E-posta veya sifre hatali.");
      else router.push("/");
    }
    setYukleniyor(false);
  };

  return (
    <main className="min-h-screen bg-white font-sans">

      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100 px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <img src="/yzliste_logo.png" alt="yzliste" className="h-8" />
          <div className="flex gap-2">
            <button onClick={() => { setMod("giris"); document.getElementById("auth-form")?.scrollIntoView({ behavior: "smooth" }); }}
              className="text-sm text-gray-500 hover:text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
              Giris Yap
            </button>
            <button onClick={() => { setMod("kayit"); document.getElementById("auth-form")?.scrollIntoView({ behavior: "smooth" }); }}
              className="text-sm bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors font-medium">
              Ucretsiz Baslat
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="px-6 pt-16 pb-10 text-center max-w-3xl mx-auto">
        <span className="inline-block bg-orange-100 text-orange-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-5 tracking-wide uppercase">
          Trendyol · Hepsiburada · Amazon TR · N11
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-5">
          Urun listesi ve<br />
          <span className="text-orange-500">profesyonel gorsel</span>{" "}
          — ikisi birden
        </h1>
        <p className="text-lg text-gray-500 mb-8 max-w-xl mx-auto leading-relaxed">
          Urun fotografini yukle ya da barkod tara. yzliste optimize listing metni uretir,
          istersen ayni fotograftan 3 farkli stilde studyo gorseli de cikarir.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={() => { setMod("kayit"); document.getElementById("auth-form")?.scrollIntoView({ behavior: "smooth" }); }}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-4 rounded-xl text-base transition-colors shadow-lg shadow-orange-100">
            3 Ucretsiz Kredi ile Baslat →
          </button>
          <button onClick={() => document.getElementById("nasil-calisir")?.scrollIntoView({ behavior: "smooth" })}
            className="text-gray-500 hover:text-gray-800 font-medium px-8 py-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors text-base">
            Nasil calisir?
          </button>
        </div>
      </section>

      {/* NE ALABİLİRSİN — 3 KUTU */}
      <section className="px-6 pb-16 bg-gray-50">
        <div className="max-w-5xl mx-auto pt-14">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-3">
            Tek fotograftan 3 farkli cikti
          </h2>
          <p className="text-center text-sm text-gray-400 mb-10">
            Metin, gorsel ya da ikisini birden — istedigin kombinasyonu sec
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

            {/* Kutu 1: Sadece Metin */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="bg-blue-50 px-5 pt-6 pb-4">
                <div className="text-2xl mb-2">📝</div>
                <h3 className="font-bold text-gray-800 text-sm">Sadece Listing Metni</h3>
                <p className="text-xs text-gray-500 mt-1">1 kullanim hakki</p>
              </div>
              <div className="p-5 space-y-2">
                <div className="text-xs text-gray-600 bg-gray-50 rounded-lg p-3 leading-relaxed font-mono">
                  <div className="font-semibold text-gray-800 mb-1">Baslik:</div>
                  <div className="text-gray-600">Porselen Cay Fincan Seti | Cicek Desen | 6 Kisilik</div>
                  <div className="font-semibold text-gray-800 mt-2 mb-1">Ozellikler:</div>
                  <div className="text-gray-600">• Kursunsuz porselen<br />• Dishwasher safe<br />• 180ml hacim</div>
                </div>
                <p className="text-xs text-gray-400">Baslik, ozellikler, aciklama, etiketler</p>
              </div>
            </div>

            {/* Kutu 2: Sadece Görsel */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="bg-purple-50 px-5 pt-6 pb-4">
                <div className="text-2xl mb-2">🖼️</div>
                <h3 className="font-bold text-gray-800 text-sm">Sadece Gorsel</h3>
                <p className="text-xs text-gray-500 mt-1">Stil basina 1 kullanim hakki · 4 varyasyon</p>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-3 gap-1.5 mb-3">
                  <div className="relative">
                    <img src="/ornek_beyaz.png" alt="beyaz zemin" className="w-full aspect-square object-cover rounded-lg" />
                    <span className="absolute bottom-1 left-1 text-[9px] bg-white/80 px-1 rounded">Beyaz</span>
                  </div>
                  <div className="relative">
                    <img src="/ornek_koyu.png" alt="koyu zemin" className="w-full aspect-square object-cover rounded-lg" />
                    <span className="absolute bottom-1 left-1 text-[9px] bg-white/80 px-1 rounded">Koyu</span>
                  </div>
                  <div className="relative">
                    <img src="/ornek_lifestyle.png" alt="lifestyle" className="w-full aspect-square object-cover rounded-lg" />
                    <span className="absolute bottom-1 left-1 text-[9px] bg-white/80 px-1 rounded">Lifestyle</span>
                  </div>
                </div>
                <p className="text-xs text-gray-400">Her stilden 4 varyasyon</p>
              </div>
            </div>

            {/* Kutu 3: İkisi Birden */}
            <div className="bg-white rounded-2xl border-2 border-orange-200 shadow-sm overflow-hidden">
              <div className="bg-orange-50 px-5 pt-6 pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="text-2xl">✨</div>
                  <span className="text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full font-medium">Populer</span>
                </div>
                <h3 className="font-bold text-gray-800 text-sm">Metin + Gorsel</h3>
                <p className="text-xs text-gray-500 mt-1">Ayri ayri kullanim hakki · En cok deger</p>
              </div>
              <div className="p-5 space-y-2">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold flex-shrink-0">1</span>
                  Optimize listing metni (baslik, ozellik, aciklama)
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-[10px] font-bold flex-shrink-0">2</span>
                  Sectigin stilde 4 studyo gorseli
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-[10px] font-bold flex-shrink-0">3</span>
                  Platforma hazir, direkt yukle
                </div>
                <p className="text-xs text-orange-600 font-medium mt-2 pt-2 border-t border-orange-100">
                  Trendyol'a hem metin hem gorsel sartli →
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ONCE / SONRA GORSEL BOLUMU */}
      <section className="px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-3">
            Cep telefonu cekimi → 3 farkli studyo gorseli
          </h2>
          <p className="text-center text-sm text-gray-400 mb-10">
            Tek fotograftan beyaz zemin, koyu zemin ve lifestyle — hepsi ayni anda
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 items-start">

            {/* ONCE */}
            <div className="space-y-2">
              <div className="relative rounded-2xl overflow-hidden border-2 border-gray-200">
                <img src="/ornek_once.jpg" alt="once" className="w-full aspect-square object-cover" />
                <div className="absolute top-2 left-2">
                  <span className="bg-gray-800/75 text-white text-[10px] px-2 py-1 rounded-full backdrop-blur">
                    📱 Ham fotograf
                  </span>
                </div>
              </div>
              <div className="bg-red-50 rounded-xl p-2.5 border border-red-100">
                <p className="text-[11px] text-red-600 font-medium">✗ Dagitik arka plan</p>
                <p className="text-[10px] text-red-400 mt-0.5">Platform reddedebilir</p>
              </div>
            </div>

            {/* SONRA 1: Beyaz */}
            <div className="space-y-2">
              <div className="relative rounded-2xl overflow-hidden border-2 border-green-200">
                <img src="/ornek_beyaz.png" alt="beyaz zemin" className="w-full aspect-square object-cover" />
                <div className="absolute top-2 left-2">
                  <span className="bg-white/90 text-gray-700 text-[10px] px-2 py-1 rounded-full">
                    ⬜ Beyaz Zemin
                  </span>
                </div>
              </div>
              <div className="bg-green-50 rounded-xl p-2.5 border border-green-100">
                <p className="text-[11px] text-green-600 font-medium">✓ Trendyol standart</p>
                <p className="text-[10px] text-green-400 mt-0.5">Ana gorsel icin ideal</p>
              </div>
            </div>

            {/* SONRA 2: Koyu */}
            <div className="space-y-2">
              <div className="relative rounded-2xl overflow-hidden border-2 border-green-200">
                <img src="/ornek_koyu.png" alt="koyu zemin" className="w-full aspect-square object-cover" />
                <div className="absolute top-2 left-2">
                  <span className="bg-white/90 text-gray-700 text-[10px] px-2 py-1 rounded-full">
                    ⬛ Koyu Zemin
                  </span>
                </div>
              </div>
              <div className="bg-green-50 rounded-xl p-2.5 border border-green-100">
                <p className="text-[11px] text-green-600 font-medium">✓ Premium his</p>
                <p className="text-[10px] text-green-400 mt-0.5">Ek gorsel icin ideal</p>
              </div>
            </div>

            {/* SONRA 3: Lifestyle */}
            <div className="space-y-2">
              <div className="relative rounded-2xl overflow-hidden border-2 border-green-200">
                <img src="/ornek_lifestyle.png" alt="lifestyle" className="w-full aspect-square object-cover" />
                <div className="absolute top-2 left-2">
                  <span className="bg-white/90 text-gray-700 text-[10px] px-2 py-1 rounded-full">
                    🏠 Lifestyle
                  </span>
                </div>
              </div>
              <div className="bg-green-50 rounded-xl p-2.5 border border-green-100">
                <p className="text-[11px] text-green-600 font-medium">✓ Dogal ortam</p>
                <p className="text-[10px] text-green-400 mt-0.5">Sosyal medya icin ideal</p>
              </div>
            </div>

          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            Gorseller gercek yzliste ciktisidir — herhangi bir duzenleme yapilmamistir
          </p>
        </div>
      </section>

      {/* NASIL CALISIR */}
      <section id="nasil-calisir" className="px-6 py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-10">4 adimda hazir</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {[
              { no: "1", ikon: "📦", baslik: "Urunu tanimla", aciklama: "Urun adi yaz, fotograf yukle ya da barkod tara" },
              { no: "2", ikon: "🛒", baslik: "Platform sec", aciklama: "Trendyol, Hepsiburada, Amazon TR veya N11" },
              { no: "3", ikon: "📝", baslik: "Listing al", aciklama: "Optimize baslik, ozellikler ve aciklama hazir" },
              { no: "4", ikon: "🖼️", baslik: "Gorsel uret", aciklama: "Istersen ayni fotograftan 3 farkli studyo gorseli" },
            ].map((adim) => (
              <div key={adim.no} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
                <div className="text-3xl mb-3">{adim.ikon}</div>
                <div className="w-7 h-7 rounded-full bg-orange-100 text-orange-600 text-xs font-bold flex items-center justify-center mx-auto mb-3">
                  {adim.no}
                </div>
                <h3 className="font-semibold text-gray-800 text-sm mb-1">{adim.baslik}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{adim.aciklama}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OZELLIKLER */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-10">Neden yzliste?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { ikon: "📸", baslik: "Fotograf ile giris", aciklama: "Metni elle yazmak zorunda degilsin. Urun fotografini yukle, gerisini YZ halletsin." },
              { ikon: "📦", baslik: "Barkod tarama", aciklama: "Barkodu tarat, urun bilgilerini aninda cek, listing uret. Depo hizinda calis." },
              { ikon: "🎯", baslik: "Platform secimli", aciklama: "Her platform farkli format ister. Trendyol, Hepsiburada, Amazon TR ve N11 icin ayri sablonlar." },
              { ikon: "🖼️", baslik: "AI gorsel", aciklama: "Cep telefonu cekimini 3 farkli stil ile studyo kalitesine donustur. Her stilden 4 varyasyon." },
              { ikon: "⚡", baslik: "Saniyeler icinde", aciklama: "Manuel yazmak yerine dakikalar degil saniyeler. Daha fazla urun, daha az zaman." },
              { ikon: "💰", baslik: "Kullantigin kadar ode", aciklama: "Abonelik yok. Ne kadar kullanirsan o kadar ode. 3 ucretsiz hakla baslat." },
            ].map((o, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="text-2xl mb-3">{o.ikon}</div>
                <h3 className="font-semibold text-gray-800 text-sm mb-1">{o.baslik}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{o.aciklama}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AUTH FORMU */}
      <section id="auth-form" className="px-6 py-16 bg-gray-50">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {mod === "kayit" ? "Ucretsiz hesap olustur" : "Tekrar hosgeldin"}
              </h2>
              <p className="text-sm text-gray-400">
                {mod === "kayit" ? "3 ucretsiz kullanim hakki hediye" : "Hesabina giris yap"}
              </p>
            </div>
            <div className="space-y-3">
              <input type="email" placeholder="E-posta" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent" />
              <input type="password" placeholder="Sifre" value={sifre} onChange={(e) => setSifre(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent" />
              {mesaj && <p className={`text-xs ${mesaj.includes("basarili") ? "text-green-600" : "text-red-500"}`}>{mesaj}</p>}
              <button onClick={handleSubmit} disabled={yukleniyor || !email || !sifre}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white font-semibold py-3 rounded-xl transition-colors text-sm">
                {yukleniyor ? "..." : mod === "kayit" ? "Ucretsiz Hesap Olustur" : "Giris Yap"}
              </button>
            </div>
            {mod === "kayit" && <p className="text-xs text-gray-400 text-center mt-4">Kayit olunca 3 ucretsiz kullanim hakki alirsiniz</p>}
            <div className="text-center mt-5 pt-4 border-t border-gray-100">
              <button onClick={() => setMod(mod === "giris" ? "kayit" : "giris")}
                className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
                {mod === "giris" ? "Hesabin yok mu? Kaydol →" : "Zaten hesabin var mi? Giris yap →"}
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className="text-center py-6 text-xs text-gray-400 border-t border-gray-100">
        2026 yzliste
      </footer>
    </main>
  );
}
