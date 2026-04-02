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
  const [ornekAcik, setOrnekAcik] = useState(false);
  const [sozlesmeOnay, setSozlesmeOnay] = useState(false);
  const router = useRouter();

  const turkceHata = (hata: string): string => {
    if (hata.includes("Password should be at least 6 characters"))
      return "Şifre en az 6 karakter olmalıdır.";
    if (hata.includes("Invalid login credentials"))
      return "E-posta veya şifre hatalı.";
    if (hata.includes("Email not confirmed"))
      return "E-posta adresinizi doğrulayınız.";
    if (hata.includes("User already registered"))
      return "Bu e-posta adresi zaten kayıtlı.";
    if (hata.includes("invalid") && hata.includes("email"))
      return "Geçerli bir e-posta adresi giriniz.";
    if (hata.includes("rate limit") || hata.includes("too many"))
      return "Çok fazla deneme yapıldı. Lütfen biraz bekleyin.";
    return "Bir hata oluştu. Lütfen tekrar deneyin.";
  };

  const handleSubmit = async () => {
    if (!email.trim()) { setMesaj("E-posta adresi giriniz."); return; }
    if (!sifre.trim()) { setMesaj("Şifre giriniz."); return; }
    if (mod === "kayit" && !sozlesmeOnay) {
      setMesaj("Devam etmek için sözleşmeleri kabul etmelisiniz.");
      return;
    }
    setYukleniyor(true);
    setMesaj("");
    if (mod === "kayit") {
      const { error } = await supabase.auth.signUp({ email, password: sifre });
      if (error) setMesaj(turkceHata(error.message));
      else setMesaj("Kayıt başarılı! E-postanızı doğrulayın.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password: sifre });
      if (error) setMesaj("E-posta veya şifre hatalı.");
      else router.push("/");
    }
    setYukleniyor(false);
  };

  const handleModDegistir = (yeniMod: "giris" | "kayit") => {
    setMod(yeniMod);
    setEmail("");
    setSifre("");
    setMesaj("");
    setSozlesmeOnay(false);
  };

  const ornekMetin = `📌 BAŞLIK: Kütahya Porselen Çiçek Desenli Kahve Fincanı 6'lı Set | 80ml | Altın Yaldızlı | Dishwasher Safe 🔹 ÖZELLİKLER: • Birinci Kalite Porselen — Kurşunsuz, gıda güvenli materyal; keskin ve ince yapı sayesinde zarif sunum sağlar. • 80ml Espresso Hacmi — Türk kahvesi, espresso ve menengiç kahvesi için ideal boyut; ağza yayılmayan sıcaklık tutma özelliği. • El Yapımı Çiçek Deseni + Altın Yaldız — Her fincan benzersiz baskıyla işlenmiş; düğün, nişan ve özel gün hediyesi olarak tercih edilen estetik görünüm. • 6 Kişilik Komple Set — Fincan ve tabaklar dahil, ayrıca alım gerektirmez; özel hediye kutusunda teslim. • Bulaşık Makinesine Uyumlu — Yaldızlar bozulmadan yıkanabilir; günlük kullanıma dayanıklı üretim standardı. 📄 AÇIKLAMA: Kütahya'nın 500 yıllık porselen geleneğinden ilham alarak tasarlanan bu 6'lı fincan seti, hem estetik hem de işlevselliği bir arada sunar. 🏷️ ARAMA ETİKETLERİ: porselen fincan seti, kahve fincanı hediye, kütahya porselen, altın yaldızlı fincan, 6lı fincan seti, türk kahvesi fincanı, düğün hediyesi fincan`;

  return (
    <main className="min-h-screen bg-white font-sans">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100 px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <a href="/auth"><img src="/yzliste_logo.png" alt="yzliste" className="h-8" /></a>
          <div className="flex gap-2">
            <button
              onClick={() => { handleModDegistir("giris"); document.getElementById("auth-form")?.scrollIntoView({ behavior: "smooth" }); }}
              className="text-sm text-gray-500 hover:text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Giriş Yap
            </button>
            <button
              onClick={() => { handleModDegistir("kayit"); document.getElementById("auth-form")?.scrollIntoView({ behavior: "smooth" }); }}
              className="text-sm bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors font-medium"
            >
              Ücretsiz Başla
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
          E-ticaret listing'i için<br />
          <span className="text-orange-500">tek çözüm</span>
        </h1>
        <p className="text-lg text-gray-500 mb-4 max-w-2xl mx-auto leading-relaxed">
          Platforma ürün yüklemek için hem <strong className="text-gray-700">optimize metin</strong> hem de <strong className="text-gray-700">profesyonel görsel</strong> gerekir. yzliste ikisini de tek yerden, ayrı ayrı veya birlikte üretir.
        </p>
        <p className="text-sm text-gray-400 mb-8 max-w-xl mx-auto">
          Ürün fotoğrafını yükle ya da barkod tara — gerisini YZ halleder.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => { handleModDegistir("kayit"); document.getElementById("auth-form")?.scrollIntoView({ behavior: "smooth" }); }}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-4 rounded-xl text-base transition-colors shadow-lg shadow-orange-100"
          >
            3 Ücretsiz Hakla Başla →
          </button>
          <button
            onClick={() => document.getElementById("nasil-calisir")?.scrollIntoView({ behavior: "smooth" })}
            className="text-gray-500 hover:text-gray-800 font-medium px-8 py-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors text-base"
          >
            Nasıl çalışır?
          </button>
        </div>
      </section>

      {/* 3 SEÇENEK KUTUSU */}
      <section className="px-6 pb-16 bg-gray-50">
        <div className="max-w-5xl mx-auto pt-14">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Neye ihtiyacın var?</h2>
          <p className="text-center text-sm text-gray-400 mb-10">Metin, görsel ya da her ikisi — ayrı ayrı veya birlikte kullanabilirsin</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="bg-blue-50 px-5 pt-6 pb-4">
                <div className="text-2xl mb-2">📝</div>
                <h3 className="font-bold text-gray-800">Sadece Listing Metni</h3>
                <p className="text-xs text-gray-500 mt-1">1 kullanım hakkı</p>
              </div>
              <div className="p-5 space-y-3">
                <p className="text-sm text-gray-600 leading-relaxed">Platforma özel optimize başlık, madde madde özellikler, satışa dönen açıklama ve arama etiketleri — hazır yapıştır formatında.</p>
                <ul className="space-y-1.5">
                  {["Manuel metin girişi", "Fotoğraftan otomatik analiz", "Barkod ile ürün tanıma"].map(f => (
                    <li key={f} className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px]">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="bg-purple-50 px-5 pt-6 pb-4">
                <div className="text-2xl mb-2">🖼️</div>
                <h3 className="font-bold text-gray-800">Sadece Görsel</h3>
                <p className="text-xs text-gray-500 mt-1">Stil başına 1 hak · Her stilden 4 varyasyon</p>
              </div>
              <div className="p-5 space-y-3">
                <p className="text-sm text-gray-600 leading-relaxed">Tek fotoğraftan 3 farklı stilde stüdyo görseli. Beyazı Trendyol'a, koyuyu öne çıkan ürüne, lifestyle'ı sosyal medyaya kullan.</p>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { src: "/ornek_beyaz.jpg", label: "Beyaz" },
                    { src: "/ornek_koyu.jpg", label: "Koyu" },
                    { src: "/ornek_lifestyle.jpg", label: "Lifestyle" },
                  ].map(s => (
                    <div key={s.label} className="relative rounded-lg overflow-hidden">
                      <img src={s.src} alt={s.label} className="w-full aspect-square object-cover" />
                      <span className="absolute bottom-0 inset-x-0 bg-black/40 text-white text-[9px] text-center py-0.5">{s.label}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400">Beğendiğini indir — hak yalnızca indirmede düşer</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl border-2 border-orange-200 shadow-sm overflow-hidden">
              <div className="bg-orange-50 px-5 pt-6 pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">✨</span>
                  <span className="text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full font-medium">Önerilen</span>
                </div>
                <h3 className="font-bold text-gray-800">Metin + Görsel</h3>
                <p className="text-xs text-gray-500 mt-1">Ayrı ayrı kullanım hakkı · En yüksek değer</p>
              </div>
              <div className="p-5 space-y-3">
                <p className="text-sm text-gray-600 leading-relaxed">Trendyol ve Hepsiburada'da hem metin hem görsel zorunlu. İkisini aynı anda üret, platforma hazır hale gel.</p>
                <div className="space-y-2">
                  {[
                    { no: "1", text: "Optimize listing metni (başlık + özellik + açıklama + etiket)" },
                    { no: "2", text: "Seçtiğin stilde 4 stüdyo görseli — beğendiğini indir" },
                    { no: "3", text: "Platforma hazır, düzenleme gerektirmez" },
                  ].map(item => (
                    <div key={item.no} className="flex items-start gap-2 text-xs text-gray-600">
                      <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">{item.no}</span>
                      {item.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ÖNCE / SONRA GÖRSEL */}
      <section className="px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Tek fotoğraftan 3 farklı stüdyo görseli</h2>
          <p className="text-center text-sm text-gray-400 mb-3">AI arka planı kaldırır, istediğin ortama yerleştirir — her stilden 4 varyasyon</p>
          <p className="text-center text-xs text-orange-600 font-medium mb-10">💡 İstersen kendi prompt'unu da girebilirsin: "ahşap zemin, sonbahar tonları, minimalist..."</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="space-y-2">
              <div className="relative rounded-2xl overflow-hidden border-2 border-gray-300">
                <img src="/ornek_once.jpg" alt="önce" className="w-full aspect-square object-cover" />
                <div className="absolute top-2 left-2">
                  <span className="bg-gray-800/80 text-white text-[10px] px-2 py-1 rounded-full">📱 Ham fotoğraf</span>
                </div>
              </div>
              <div className="bg-red-50 rounded-xl p-2.5 border border-red-100">
                <p className="text-[11px] text-red-600 font-medium">✗ Dağınık arka plan</p>
                <p className="text-[10px] text-red-400 mt-0.5">Platform reddedebilir</p>
              </div>
            </div>
            {[
              { src: "/ornek_beyaz.jpg", etiket: "⬜ Beyaz Zemin", aciklama: "✓ Trendyol standart" },
              { src: "/ornek_koyu.jpg", etiket: "⬛ Koyu Zemin", aciklama: "✓ Premium his" },
              { src: "/ornek_lifestyle.jpg", etiket: "🏠 Lifestyle", aciklama: "✓ Doğal ortam" },
            ].map((item) => (
              <div key={item.etiket} className="space-y-2">
                <div className="relative rounded-2xl overflow-hidden border-2 border-green-200">
                  <img src={item.src} alt={item.etiket} className="w-full aspect-square object-cover" />
                  <div className="absolute top-2 left-2">
                    <span className="bg-white/90 text-gray-700 text-[10px] px-2 py-1 rounded-full">{item.etiket}</span>
                  </div>
                </div>
                <div className="bg-green-50 rounded-xl p-2.5 border border-green-100">
                  <p className="text-[11px] text-green-600 font-medium">{item.aciklama}</p>
                  <p className="text-[10px] text-green-400 mt-0.5">4 varyasyon üretilir</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ÖRNEK LİSTİNG */}
      <section className="px-6 py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Böyle bir metin alırsın</h2>
          <p className="text-center text-sm text-gray-400 mb-8">Gerçek bir Trendyol listing örneği — sıfır düzenleme, direkt yapıştır</p>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-orange-50">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-400" />
                <span className="text-xs font-semibold text-orange-700">Trendyol formatında örnek çıktı</span>
              </div>
              <button onClick={() => setOrnekAcik(!ornekAcik)} className="text-xs text-orange-600 hover:text-orange-800 font-medium">
                {ornekAcik ? "Küçült ▲" : "Tümünü gör ▼"}
              </button>
            </div>
            <div className={`overflow-hidden transition-all duration-300 ${ornekAcik ? "max-h-none" : "max-h-48"}`}>
              <pre className="p-5 text-xs text-gray-700 leading-relaxed whitespace-pre-wrap font-mono">{ornekMetin}</pre>
            </div>
            {!ornekAcik && <div className="h-12 bg-gradient-to-t from-white to-transparent -mt-12 relative pointer-events-none" />}
          </div>
        </div>
      </section>

      {/* NASIL ÇALIŞIR */}
      <section id="nasil-calisir" className="px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-10">4 adımda hazır</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {[
              { no: "1", ikon: "📦", baslik: "Ürünü tanımla", aciklama: "Ürün adı yaz, fotoğraf yükle ya da barkod tara. Hangi yöntemi seçersen seç, YZ analiz eder." },
              { no: "2", ikon: "🛒", baslik: "Platform seç", aciklama: "Trendyol, Hepsiburada, Amazon TR veya N11. Her platform için ayrı format ve karakter limitleri uygulanır." },
              { no: "3", ikon: "📝", baslik: "Listing metnini al", aciklama: "Optimize başlık, madde madde özellikler, satışa dönen açıklama ve arama etiketleri — direkt kopyala yapıştır." },
              { no: "4", ikon: "🖼️", baslik: "Görsel üret", aciklama: "İstersen aynı fotoğraftan 3 stilde stüdyo görseli çıkar. Kendi prompt'unu girerek sonucu yönlendir." },
            ].map((adim) => (
              <div key={adim.no} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="text-3xl mb-3">{adim.ikon}</div>
                <div className="w-7 h-7 rounded-full bg-orange-100 text-orange-600 text-xs font-bold flex items-center justify-center mb-3">{adim.no}</div>
                <h3 className="font-semibold text-gray-800 text-sm mb-2">{adim.baslik}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{adim.aciklama}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ÖZELLİKLER */}
      <section className="px-6 py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-10">Neden yzliste?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { ikon: "📸", baslik: "Fotoğraftan analiz", aciklama: "Ürün fotoğrafını yükle, YZ ürünü tanısın ve listing metnini otomatik oluştursun. Elle yazmaya gerek yok." },
              { ikon: "📦", baslik: "Barkod tarama", aciklama: "Barkodu tarat, ürün bilgilerini veritabanından çek, listing üret. Depo hızında çalış." },
              { ikon: "🎯", baslik: "Platform şablonları", aciklama: "Trendyol, Hepsiburada, Amazon TR ve N11 için ayrı format. Karakter sınırları ve alan gereksinimleri otomatik uygulanır." },
              { ikon: "🖼️", baslik: "AI görsel + prompt", aciklama: "Beyaz zemin, koyu zemin, lifestyle — her stilden 4 varyasyon. İstersen kendi sahneni yaz, AI onu uygular." },
              { ikon: "💎", baslik: "Hak sadece indirmede düşer", aciklama: "Görsel üretilir, beğenmezsen hakkını kaybetmezsin. Yalnızca indirdiğin görsel için hak düşer." },
              { ikon: "💰", baslik: "Kullandığın kadar öde", aciklama: "Aylık abonelik yok. Ürettiğin kadar öde. 3 ücretsiz hakla başla, ihtiyacın kadar devam et." },
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
      <section id="auth-form" className="px-6 py-16">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {mod === "kayit" ? "Ücretsiz hesap oluştur" : "Tekrar hoş geldin"}
              </h2>
              <p className="text-sm text-gray-400">
                {mod === "kayit" ? "3 ücretsiz kullanım hakkı hediye" : "Hesabına giriş yap"}
              </p>
            </div>
            <div className="space-y-3">
              <input
                type="email"
                placeholder="E-posta"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              />
              <input
                type="password"
                placeholder="Şifre"
                value={sifre}
                onChange={(e) => setSifre(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                autoComplete={mod === "kayit" ? "new-password" : "current-password"}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              />

              {/* Sözleşme onayı — sadece kayıt modunda */}
              {mod === "kayit" && (
                <label className="flex items-start gap-3 cursor-pointer mt-1">
                  <input
                    type="checkbox"
                    checked={sozlesmeOnay}
                    onChange={(e) => setSozlesmeOnay(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-400 cursor-pointer flex-shrink-0"
                  />
                  <span className="text-xs text-gray-500 leading-relaxed">
                    <a href="/gizlilik" target="_blank" className="text-orange-500 hover:underline font-medium">Gizlilik Politikası</a>
                    {" "}ve{" "}
                    <a href="/mesafeli-satis" target="_blank" className="text-orange-500 hover:underline font-medium">Mesafeli Satış Sözleşmesi</a>
                    {" "}ile{" "}
                    <a href="/teslimat-iade" target="_blank" className="text-orange-500 hover:underline font-medium">Teslimat ve İade Şartları</a>
                    'nı okudum ve kabul ediyorum.
                  </span>
                </label>
              )}

              {mesaj && (
                <p className={`text-xs ${mesaj.includes("başarılı") ? "text-green-600" : "text-red-500"}`}>{mesaj}</p>
              )}

              <button
                onClick={handleSubmit}
                disabled={yukleniyor || (mod === "kayit" && !sozlesmeOnay)}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
              >
                {yukleniyor ? "..." : mod === "kayit" ? "Ücretsiz Hesap Oluştur" : "Giriş Yap"}
              </button>
            </div>

            {mod === "kayit" && (
              <p className="text-xs text-gray-400 text-center mt-4">Kayıt olunca 3 ücretsiz kullanım hakkı alırsınız</p>
            )}
            <div className="text-center mt-5 pt-4 border-t border-gray-100">
              <button
                onClick={() => handleModDegistir(mod === "giris" ? "kayit" : "giris")}
                className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
              >
                {mod === "giris" ? "Hesabın yok mu? Kaydol →" : "Zaten hesabın var mı? Giriş yap →"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-400">
            <a href="/hakkimizda" className="hover:text-orange-500">Hakkımızda</a>
            <span>·</span>
            <a href="/gizlilik" className="hover:text-orange-500">Gizlilik Politikası</a>
            <span>·</span>
            <a href="/mesafeli-satis" className="hover:text-orange-500">Mesafeli Satış Sözleşmesi</a>
            <span>·</span>
            <a href="/teslimat-iade" className="hover:text-orange-500">Teslimat ve İade</a>
            <span>·</span>
            <a href="mailto:destek@yzliste.com" className="hover:text-orange-500">destek@yzliste.com</a>
          </div>
          {/* Sadece iyzico logosu — içinde zaten Visa/MC var */}
          <div className="flex justify-center">
            <img src="/iyzico_footer_logo.png" alt="iyzico ile öde" className="h-10" />
          </div>
          <p className="text-center text-xs text-gray-400">
            © 2026 yzliste · SIMOON PAZARLAMA VE DANISMANLIK LIMITED SIRKETI
          </p>
        </div>
      </footer>
    </main>
  );
}
