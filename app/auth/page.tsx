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
  const [aktifOrnek, setAktifOrnek] = useState(0);
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
    { no: "1", baslik: "Urunu tanimla", aciklama: "Urun adi yaz, fotograf yukle ya da barkod tara", ikon: "📦" },
    { no: "2", baslik: "Platform sec", aciklama: "Trendyol, Hepsiburada, Amazon TR veya N11", ikon: "🛒" },
    { no: "3", baslik: "Listing al", aciklama: "Optimize baslik, ozellikler ve aciklama hazir", ikon: "✅" },
    { no: "4", baslik: "Gorseli profesyonellestir", aciklama: "Urun fotografini AI ile studyo kalitesine tasi", ikon: "✨" },
  ];

  // Gercek Unsplash mutfak urun fotograflari
  // Once: Evde cekilmis, arka plan dagitik hali
  // Sonra: Profesyonel studyo / beyaz zemin hali
  const gorselOrnekleri = [
    {
      kategori: "Elektrikli Kettle",
      etiket: "Mutfak Urunleri",
      // Mutfak tezgahinda gundelik ortamda cekilmis kettle
      once: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80",
      // Temiz beyaz zeminde profesyonel kettle cekim
      sonra: "https://images.unsplash.com/photo-1594385208974-2e75f8d7bb48?w=600&q=80",
      onceDurum: "Evde cep telefonu cekimi",
      sonraDurum: "AI ile studyo gorseli",
    },
    {
      kategori: "Kahve Makinesi",
      etiket: "Mutfak Urunleri",
      // Tezgah uzerinde donemsel fotograf
      once: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=600&q=80",
      // Profesyonel kahve makinesi cekim
      sonra: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80",
      onceDurum: "Evde cep telefonu cekimi",
      sonraDurum: "AI ile studyo gorseli",
    },
    {
      kategori: "Tencere Seti",
      etiket: "Mutfak Urunleri",
      // Mutfak tezgahinda tencere
      once: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=600&q=80",
      // Temiz profesyonel tencere cekim
      sonra: "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=600&q=80",
      onceDurum: "Evde cep telefonu cekimi",
      sonraDurum: "AI ile studyo gorseli",
    },
  ];

  const ornek = gorselOrnekleri[aktifOrnek];

  const ornekListing = `Baslik:
Arzum Okka Minio Pro Elektrikli Su Isitici | 1.5 Litre | Paslanmaz Celik | Beyaz

Ozellikler:
• 1500W Hizli Isitma — 1.5 litre suyu 3 dakikada kaynatir
• 360 Derece Donebilir Taban — Sol ve sag eliklilere esit kullanim kolayligi
• Otomatik Kapanma — Kaynar veya bos brakildikta guvenli kesinti
• Paslanmaz Celik Ic Yuzey — Koku ve tat gecirmez, kolay temizlik
• LED Aydinlatma — Calismada parlayan taban, seviye takibi kolaylastirir

Aciklama:
Arzum Okka Minio Pro, yogun mutfak kullaniminiz icin tasarlanmis kompakt ama guclu bir su isiticidir. 1500 watt gucu ile cay, filtre kahve veya anlık corba icin suyu hizla kaynatir. 360 derece donebilir ergonomik tasarim sayesinde mutfak tezgahinda her konumda rahatca kullanilabilir.`;

  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-white font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-100 px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900">
            YZ<span className="text-orange-500">Liste</span>
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setMod("giris")}
              className="text-sm text-gray-500 hover:text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Giris Yap
            </button>
            <button
              onClick={() => setMod("kayit")}
              className="text-sm bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors font-medium"
            >
              Ucretsiz Baslat
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="px-6 pt-16 pb-12 text-center max-w-3xl mx-auto">
        <span className="inline-block bg-orange-100 text-orange-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-5 tracking-wide uppercase">
          Trendyol • Hepsiburada • Amazon TR • N11
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-5">
          Saniyeler icinde{" "}
          <span className="text-orange-500">profesyonel</span>{" "}
          urun listesi
        </h1>
        <p className="text-lg text-gray-500 mb-8 max-w-xl mx-auto leading-relaxed">
          Urun adini yaz, fotoğraf yukle ya da barkod tara.
          YZListe platforma ozel optimize baslik, ozellikler ve aciklama uretir.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => {
              document.getElementById("auth-form")?.scrollIntoView({ behavior: "smooth" });
              setMod("kayit");
            }}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-4 rounded-xl text-base transition-colors shadow-lg shadow-orange-100"
          >
            3 Ucretsiz Kredi ile Baslat →
          </button>
          <button
            onClick={() => document.getElementById("nasil-calisir")?.scrollIntoView({ behavior: "smooth" })}
            className="text-gray-500 hover:text-gray-800 font-medium px-8 py-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors text-base"
          >
            Nasil calisir?
          </button>
        </div>
      </section>

      {/* ===== ONCE / SONRA GORSEL BOLUMU ===== */}
      <section className="px-6 pb-16">
        <div className="max-w-5xl mx-auto">
          {/* Bolum Basligi */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Cep telefonu cekimi → Studyo gorseli
            </h2>
            <p className="text-gray-400 text-sm">
              Fotoğrafini yukle, AI arka plani temizler ve profesyonel e-ticaret gorseli uretir
            </p>
          </div>

          {/* Kategori Secimleri */}
          <div className="flex gap-2 justify-center mb-6 flex-wrap">
            {gorselOrnekleri.map((g, i) => (
              <button
                key={i}
                onClick={() => setAktifOrnek(i)}
                className={`text-sm px-4 py-2 rounded-full border transition-colors font-medium ${
                  aktifOrnek === i
                    ? "bg-orange-500 text-white border-orange-500"
                    : "bg-white text-gray-500 border-gray-200 hover:border-orange-300"
                }`}
              >
                {g.kategori}
              </button>
            ))}
          </div>

          {/* Once / Sonra Karti */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2">
              {/* ONCE */}
              <div className="relative">
                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-gray-800/70 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur font-medium">
                    📱 {ornek.onceDurum}
                  </span>
                </div>
                <img
                  src={ornek.once}
                  alt={`${ornek.kategori} once`}
                  className="w-full aspect-square object-cover"
                />
                <div className="p-4 bg-red-50 border-t border-red-100">
                  <p className="text-xs text-red-600 font-medium flex items-center gap-1.5">
                    <span>✗</span>
                    Dagitik arka plan — platforma yuklenmez / reddedilir
                  </p>
                </div>
              </div>

              {/* SONRA */}
              <div className="relative border-t sm:border-t-0 sm:border-l border-gray-100">
                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-orange-500 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur font-medium">
                    ✨ {ornek.sonraDurum}
                  </span>
                </div>
                <img
                  src={ornek.sonra}
                  alt={`${ornek.kategori} sonra`}
                  className="w-full aspect-square object-cover"
                />
                <div className="p-4 bg-green-50 border-t border-green-100">
                  <p className="text-xs text-green-600 font-medium flex items-center gap-1.5">
                    <span>✓</span>
                    Beyaz zemin, studyo kalitesi — Trendyol standartlarina uygun
                  </p>
                </div>
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 mt-4">
            Gorseller temsilidir. Gercek sonuclar urune gore degisir.
          </p>
        </div>
      </section>

      {/* Nasil Calisir */}
      <section id="nasil-calisir" className="px-6 pb-16 bg-gray-50">
        <div className="max-w-4xl mx-auto pt-14">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-10">
            4 adimda hazir listing
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {adimlar.map((adim) => (
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

      {/* Ornek Listing Ciktisi */}
      <section className="px-6 pb-16">
        <div className="max-w-3xl mx-auto pt-10">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
            Boyle bir sonuc alacaksin
          </h2>
          <p className="text-center text-sm text-gray-400 mb-8">
            Gercek bir Trendyol listing ornegi — sifir duzenleme, direkt yapistir
          </p>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100 bg-orange-50">
              <span className="w-2 h-2 rounded-full bg-orange-400" />
              <span className="text-xs font-semibold text-orange-700">Trendyol formatinda ornek cikti</span>
            </div>
            <pre className="p-6 text-xs text-gray-700 leading-relaxed whitespace-pre-wrap font-mono overflow-x-auto">
              {ornekListing}
            </pre>
          </div>
        </div>
      </section>

      {/* Ozellikler */}
      <section className="px-6 pb-16 bg-gray-50">
        <div className="max-w-4xl mx-auto pt-10">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-10">Neden YZListe?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { ikon: "📸", baslik: "Fotograf ile giris", aciklama: "Metni elle yazmak zorunda degilsin. Urun fotografini yukle, gerisini YZ halletsin." },
              { ikon: "📦", baslik: "Barkod tarama", aciklama: "Barkodu tarat, urun bilgilerini aninda cek, listing uret. Depo hizinda calis." },
              { ikon: "🎯", baslik: "Platform secimli", aciklama: "Her platform farkli format ister. Trendyol, Hepsiburada, Amazon TR ve N11 icin ayri sablonlar." },
              { ikon: "🖼️", baslik: "AI gorsel iyilestirme", aciklama: "Cep telefonu cekimini 3 farkli stil ile studyo kalitesine donustur." },
              { ikon: "⚡", baslik: "Saniyeler icinde", aciklama: "Manuel yazmak yerine dakikalar degil saniyeler. Daha fazla urun, daha az zaman." },
              { ikon: "💰", baslik: "Pay-as-you-go", aciklama: "Abonelik yok. Ne kadar kullanirsan o kadar ode. 3 ucretsiz kredi ile baslat." },
            ].map((ozellik, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="text-2xl mb-3">{ozellik.ikon}</div>
                <h3 className="font-semibold text-gray-800 text-sm mb-1">{ozellik.baslik}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{ozellik.aciklama}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Auth Formu */}
      <section id="auth-form" className="px-6 py-16">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {mod === "kayit" ? "Ucretsiz hesap olustur" : "Tekrar hosgeldin"}
              </h2>
              <p className="text-sm text-gray-400">
                {mod === "kayit" ? "3 ucretsiz kredi hediye" : "Hesabina giris yap"}
              </p>
            </div>

            <div className="space-y-3">
              <input
                type="email"
                placeholder="E-posta"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              />
              <input
                type="password"
                placeholder="Sifre"
                value={sifre}
                onChange={(e) => setSifre(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              />
              {mesaj && (
                <p className={`text-xs ${mesaj.includes("basarili") ? "text-green-600" : "text-red-500"}`}>
                  {mesaj}
                </p>
              )}
              <button
                onClick={handleSubmit}
                disabled={yukleniyor || !email || !sifre}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
              >
                {yukleniyor ? "..." : mod === "kayit" ? "Ucretsiz Hesap Olustur" : "Giris Yap"}
              </button>
            </div>

            {mod === "kayit" && (
              <p className="text-xs text-gray-400 text-center mt-4">
                Kayit olunca 3 ucretsiz kredi alirsiniz
              </p>
            )}

            <div className="text-center mt-5 pt-4 border-t border-gray-100">
              <button
                onClick={() => setMod(mod === "giris" ? "kayit" : "giris")}
                className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
              >
                {mod === "giris" ? "Hesabin yok mu? Kaydol →" : "Zaten hesabin var mi? Giris yap →"}
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className="text-center py-6 text-xs text-gray-400 border-t border-gray-100">
        2026 YZListe
      </footer>
    </main>
  );
}
