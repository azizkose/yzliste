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
        setMesaj("Kayıt başarılı! E-postanızı doğrulayın.");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password: sifre });
      if (error) {
        setMesaj("E-posta veya şifre hatalı.");
      } else {
        router.push("/");
      }
    }
    setYukleniyor(false);
  };

  const adimlar = [
    { no: "1", baslik: "Ürünü tanımla", aciklama: "Ürün adı yaz, fotoğraf yükle ya da barkod tara", ikon: "📝" },
    { no: "2", baslik: "Platform seç", aciklama: "Trendyol, Hepsiburada, Amazon TR veya N11", ikon: "🛒" },
    { no: "3", baslik: "Listing al", aciklama: "Optimize başlık, özellikler ve açıklama hazır", ikon: "✅" },
    { no: "4", baslik: "Görseli profesyonelleştir", aciklama: "İstersen ürün fotoğrafını AI ile stüdyo kalitesine taşı", ikon: "✨" },
  ];

  const ornekCikti = `📌 Başlık:
Lescon Erkek Nefes Alan Koşu Ayakkabısı | Hafif Taban | Gri-Siyah | 40-45

🔹 Özellikler:
• Örgü Üst Yüzey — Hava sirkülasyonu ile uzun koşularda terleme önler
• Ultra Hafif EVA Taban — 280g ağırlık, diz ve eklem yükünü %30 azaltır
• Kaymaz Dış Taban — Islak/kuru zeminde güvenli tutuş
• Anatomik İç Taban — Uzun süreli konfor, ayak şekline göre şekillenir
• Pişik Önleyici Dikiş Tasarımı — Maraton mesafesinde bile sürtünmesiz

📄 Açıklama:
Günlük koşu rutininden yarışma günlerine kadar performansını desteklemek için tasarlanan Lescon Erkek Koşu Ayakkabısı, gelişmiş nefes alabilir örgü yapısıyla ayağınızı serin ve kuru tutar. Ultra hafif EVA ara tabanlık teknolojisi sayesinde her adımda darbe emilimi sağlanır; diz, kalça ve bel üzerindeki yükü minimize eder. Kaymaz dış taban paterni, parkur veya şehir koşularında güvenli ve dengeli bir adım garantiler.

🏷️ Etiketler:
erkek koşu ayakkabısı, nefes alan spor ayakkabı, hafif koşu ayakkabısı, lescon erkek, maraton ayakkabısı, kaymaz taban, EVA taban`;

  const gorselOrnekleri = [
    {
      kategori: "Koltuk / Mobilya",
      once: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600",
      sonra: "/ornek_beyaz.jpg",
    },
    {
      kategori: "Mont / Giyim",
      once: "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=600",
      sonra: "/ornek_lifestyle.jpg",
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <img src="/yzliste_logo.png" alt="yzliste" className="h-8" />
          <button
            onClick={() => {
              setMod("giris");
              document.getElementById("auth-form")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="text-sm text-gray-600 hover:text-orange-500 font-medium transition-colors"
          >
            Zaten hesabım var →
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-white px-6 py-16 text-center border-b border-gray-100">
        <div className="max-w-2xl mx-auto">
          <span className="inline-block bg-orange-50 text-orange-600 text-xs font-semibold px-3 py-1 rounded-full mb-4 tracking-wide uppercase">
            Türk E-Ticaret Satıcıları İçin
          </span>
          <h2 className="text-4xl font-bold text-gray-900 leading-tight mb-4">
            30 saniyede mükemmel<br />
            <span className="text-orange-500">ürün listesi</span> oluştur
          </h2>
          <p className="text-lg text-gray-500 mb-8">
            Trendyol, Hepsiburada, Amazon TR ve N11 için yapay zeka destekli,
            Türk alıcı psikolojisine göre optimize edilmiş listing içerikleri.
          </p>
          <button
            onClick={() => {
              setMod("kayit");
              document.getElementById("auth-form")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3.5 rounded-xl text-base transition-colors shadow-sm"
          >
            Ücretsiz Dene — 3 Kredi Hediye 🎁
          </button>
          <p className="text-xs text-gray-400 mt-3">Kredi kartı gerekmez</p>
        </div>
      </section>

      {/* 4 Adım */}
      <section className="px-6 py-14">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-center text-xl font-bold text-gray-800 mb-10">Nasıl çalışır?</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {adimlar.map((adim, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center relative">
                {i < adimlar.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 text-gray-300 text-xl z-10">→</div>
                )}
                <div className="text-3xl mb-3">{adim.ikon}</div>
                <div className="inline-block bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full mb-2">
                  Adım {adim.no}
                </div>
                <h4 className="font-semibold text-gray-800 mb-1 text-sm">{adim.baslik}</h4>
                <p className="text-xs text-gray-500">{adim.aciklama}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Örnek Çıktı */}
      <section className="px-6 pb-14">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-center text-xl font-bold text-gray-800 mb-2">Böyle bir sonuç alacaksın</h3>
          <p className="text-center text-sm text-gray-400 mb-8">Gerçek bir Trendyol listing örneği — sıfır düzenleme, direkt yapıştır</p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            {/* Sol — Listing çıktısı */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-orange-100 text-orange-700 text-xs font-semibold px-3 py-1 rounded-full">Trendyol</span>
                <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">✓ Optimize</span>
                <span className="text-xs text-gray-400 ml-auto">~18 sn</span>
              </div>
              <pre className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed font-sans bg-gray-50 rounded-xl p-4 flex-1 overflow-y-auto" style={{maxHeight: "420px"}}>
                {ornekCikti}
              </pre>
              <div className="flex gap-4 mt-4 pt-4 border-t border-gray-100">
                <div className="text-center flex-1">
                  <div className="text-lg font-bold text-orange-500">94</div>
                  <div className="text-xs text-gray-400">SEO skoru</div>
                </div>
                <div className="text-center flex-1">
                  <div className="text-lg font-bold text-orange-500">5</div>
                  <div className="text-xs text-gray-400">özellik maddesi</div>
                </div>
                <div className="text-center flex-1">
                  <div className="text-lg font-bold text-orange-500">8</div>
                  <div className="text-xs text-gray-400">anahtar kelime</div>
                </div>
              </div>
            </div>

            {/* Sağ — AI Görsel tanıtımı */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full">✨ AI Görsel</span>
                <span className="text-xs text-gray-400 ml-auto">~30 sn · 1 kullanım hakkı</span>
              </div>
              <p className="text-xs text-gray-500 mb-4">
                Ürün fotoğrafını yükle — aynı fotoğraftan 3 farklı stil, her stilden 4 varyasyon
              </p>

              <div className="grid grid-cols-3 gap-2 flex-1">
                {[
                  { label: "⬜ Beyaz Zemin", aciklama: "Trendyol standart", img: "/ornek_beyaz.jpg" },
                  { label: "⬛ Koyu Zemin", aciklama: "Premium his", img: "/ornek_koyu.jpg" },
                  { label: "🏠 Lifestyle", aciklama: "Gerçek ortam", img: "/ornek_lifestyle.jpg" },
                ].map((s, i) => (
                  <div key={i} className="rounded-xl overflow-hidden border border-gray-100 flex flex-col">
                    <div className="flex-1 overflow-hidden">
                      <img src={s.img} alt={s.label} className="w-full h-full object-cover" style={{minHeight: "120px"}} />
                    </div>
                    <div className="p-2 bg-gray-50">
                      <p className="text-xs font-semibold text-gray-700">{s.label}</p>
                      <p className="text-xs text-gray-400">{s.aciklama}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="bg-purple-50 text-purple-600 px-2 py-1 rounded-lg font-medium">1 stil = 1 hak = 4 görsel</span>
                  <span>·</span>
                  <span>3 stil seçersen 12 görsel alırsın</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Özellikler */}
      <section className="bg-white px-6 py-14 border-t border-gray-100">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-center text-xl font-bold text-gray-800 mb-8">Neden YZListe?</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { ikon: "📷", baslik: "Fotoğraftan Listing", aciklama: "Ürün fotoğrafını yükle, AI analiz etsin" },
              { ikon: "🔍", baslik: "Barkod Tarama", aciklama: "Barkodu tara, ürün bilgileri otomatik gelsin" },
              { ikon: "🏪", baslik: "4 Platform", aciklama: "Her platform için ayrı optimize format" },
              { ikon: "⚡", baslik: "30 Saniye", aciklama: "Manuel yazmaya son, anında hazır" },
            ].map((f, i) => (
              <div key={i} className="text-center p-4">
                <div className="text-2xl mb-2">{f.ikon}</div>
                <div className="font-semibold text-sm text-gray-800 mb-1">{f.baslik}</div>
                <div className="text-xs text-gray-500">{f.aciklama}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Auth Form */}
      <section id="auth-form" className="px-6 py-16 bg-gray-50">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {mod === "kayit" ? "Hemen başla" : "Tekrar hoş geldin"}
            </h3>
            <p className="text-gray-500 text-sm">
              {mod === "kayit" ? "3 ücretsiz kredi ile dene, kredi kartı gerekmez" : "Hesabına giriş yap"}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow p-8">
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setMod("kayit")}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                  mod === "kayit" ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Kayıt Ol
              </button>
              <button
                onClick={() => setMod("giris")}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                  mod === "giris" ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Giriş Yap
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Şifre</label>
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
                <p className={`text-sm ${mesaj.includes("başarılı") ? "text-green-600" : "text-red-500"}`}>
                  {mesaj}
                </p>
              )}

              <button
                onClick={handleSubmit}
                disabled={yukleniyor || !email || !sifre}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white font-semibold py-3 rounded-lg transition-colors text-sm"
              >
                {yukleniyor ? "..." : mod === "kayit" ? "Ücretsiz Hesap Oluştur →" : "Giriş Yap →"}
              </button>
            </div>

            {mod === "kayit" && (
              <p className="text-xs text-gray-400 text-center mt-4">
                🎁 Kayıt olunca <strong>3 ücretsiz kredi</strong> alırsınız
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-xs text-gray-400 border-t border-gray-100">
        © 2026 YZListe · Türk e-ticaret satıcıları için yapay zeka asistanı
      </footer>
    </main>
  );
}
