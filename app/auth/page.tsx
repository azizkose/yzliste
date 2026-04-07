"use client";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [sifre, setSifre] = useState("");
  const [mod, setMod] = useState<"giris" | "kayit">("kayit");
  const [yukleniyor, setYukleniyor] = useState(false);
  const [mesaj, setMesaj] = useState("");
  const [sozlesmeOnay, setSozlesmeOnay] = useState(false);
  const [oturum, setOturum] = useState<boolean | null>(null);
  const [modalAcik, setModalAcik] = useState(false);
  const [modalMod, setModalMod] = useState<"paket" | "uye">("paket");
  const [modalUyeMod, setModalUyeMod] = useState<"giris" | "kayit">("kayit");
  const [modalEmail, setModalEmail] = useState("");
  const [modalSifre, setModalSifre] = useState("");
  const [modalSozlesme, setModalSozlesme] = useState(false);
  const [modalMesaj, setModalMesaj] = useState("");
  const [modalYukleniyor, setModalYukleniyor] = useState(false);
  const [odemeYukleniyor, setOdemeYukleniyor] = useState(false);
  const [odemeForm, setOdemeForm] = useState<string | null>(null);
  const [seciliPaket, setSeciliPaket] = useState<string | null>(null);
  const [sifreSifirlamaGonderildi, setSifreSifirlamaGonderildi] = useState(false);
  const [sifreSifirlamaYukleniyor, setSifreSifirlamaYukleniyor] = useState(false);
  const odemeRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setOturum(!!user);
    });
  }, []);

  const turkceHata = (hata: string): string => {
    if (hata.includes("Password should be at least 6 characters")) return "Şifre en az 6 karakter olmalıdır.";
    if (hata.includes("Invalid login credentials")) return "E-posta veya şifre hatalı.";
    if (hata.includes("Email not confirmed")) return "E-posta adresinizi doğrulayın.";
    if (hata.includes("User already registered")) return "Bu e-posta adresi zaten kayıtlı.";
    if (hata.includes("invalid") && hata.includes("email")) return "Geçerli bir e-posta adresi girin.";
    if (hata.includes("rate limit") || hata.includes("too many")) return "Çok fazla deneme. Lütfen biraz bekleyin.";
    return "Bir hata oluştu. Lütfen tekrar deneyin.";
  };

  const handleSubmit = async () => {
    if (!email.trim()) { setMesaj("E-posta adresi girin."); return; }
    if (!sifre.trim()) { setMesaj("Şifre girin."); return; }
    if (mod === "kayit" && !sozlesmeOnay) { setMesaj("Devam etmek için sözleşmeleri kabul edin."); return; }
    setYukleniyor(true); setMesaj("");
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

  const handleSifreSifirla = async () => {
    if (!email.trim()) { setMesaj("Önce e-posta adresinizi girin."); return; }
    setSifreSifirlamaYukleniyor(true); setMesaj("");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/sifre-sifirla`,
    });
    if (error) { setMesaj("Şifre sıfırlama e-postası gönderilemedi."); }
    else { setSifreSifirlamaGonderildi(true); }
    setSifreSifirlamaYukleniyor(false);
  };

  const handleModDegistir = (yeniMod: "giris" | "kayit") => {
    setMod(yeniMod); setEmail(""); setSifre(""); setMesaj("");
    setSozlesmeOnay(false); setSifreSifirlamaGonderildi(false);
  };

      const hemenAlTikla = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      // Giriş yok — önce üye ekranını göster
      setModalMod("uye");
      setModalAcik(true);
      setOdemeForm(null);
      setSeciliPaket(null);
      setModalMesaj("");
      return;
    }
    // Giriş var — fatura kontrolü
    const { data: profil } = await supabase
      .from("profiles")
      .select("ad_soyad, fatura_tipi, tc_kimlik, vergi_no")
      .eq("id", user.id)
      .single();
    const eksik =
      !profil?.ad_soyad ||
      (profil?.fatura_tipi === "bireysel" && !profil?.tc_kimlik) ||
      (profil?.fatura_tipi === "kurumsal" && !profil?.vergi_no);
    if (eksik) {
      alert("Ödeme yapabilmek için önce profil sayfasından fatura bilgilerinizi doldurmanız gerekiyor. Bu alana yönlendirileceksiniz");
      window.location.href = "/profil";
      return;
    }
    // Her şey tamam — paket seçim ekranı
    setModalMod("paket");
    setModalAcik(true);
    setOdemeForm(null);
    setSeciliPaket(null);
    setModalMesaj("");
  };

  const modalUyeGiris = async () => {
    if (!modalEmail.trim()) { setModalMesaj("E-posta girin."); return; }
    if (!modalSifre.trim()) { setModalMesaj("Şifre girin."); return; }
    if (modalUyeMod === "kayit" && !modalSozlesme) { setModalMesaj("Sözleşmeleri kabul edin."); return; }
    setModalYukleniyor(true); setModalMesaj("");
    if (modalUyeMod === "kayit") {
      const { error } = await supabase.auth.signUp({ email: modalEmail, password: modalSifre });
      if (error) { setModalMesaj(turkceHata(error.message)); }
      else { setModalMesaj("Kayıt başarılı! E-postanızı doğrulayın."); }
    } else {
         const { error, data } = await supabase.auth.signInWithPassword({ email: modalEmail, password: modalSifre });
      if (error) { setModalMesaj("E-posta veya şifre hatalı."); }
      else {
        setOturum(true);
        // Fatura bilgisi kontrolü
        const { data: profil } = await supabase
          .from("profiles")
          .select("ad_soyad, fatura_tipi, tc_kimlik, vergi_no")
          .eq("id", data.user.id)
          .single();
        const eksik =
          !profil?.ad_soyad ||
          (profil?.fatura_tipi === "bireysel" && !profil?.tc_kimlik) ||
          (profil?.fatura_tipi === "kurumsal" && !profil?.vergi_no);
        if (eksik) {
          setModalAcik(false);
          alert("Ödeme yapabilmek için önce fatura bilgilerinizi doldurmanız gerekiyor.");
          window.location.href = "/profil";
          return;
        }
        setModalMod("paket");
        setModalMesaj("");
      }
    }
    setModalYukleniyor(false);
  };

  const odemeBaslat = async (paket: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setModalMod("uye"); return; }
    setSeciliPaket(paket); setOdemeYukleniyor(true); setOdemeForm(null);
    try {
      const res = await fetch("/api/odeme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paket, userId: user.id, email: user.email }),
      });
      const data = await res.json();
      if (data.checkoutFormContent) {
        setOdemeForm(data.checkoutFormContent);
        setTimeout(() => {
          if (odemeRef.current) {
            odemeRef.current.innerHTML = data.checkoutFormContent;
            const scriptlar = odemeRef.current.querySelectorAll("script");
            scriptlar.forEach((eskiScript) => {
              const yeniScript = document.createElement("script");
              if (eskiScript.src) { yeniScript.src = eskiScript.src; }
              else { yeniScript.textContent = eskiScript.textContent; }
              eskiScript.parentNode?.replaceChild(yeniScript, eskiScript);
            });
          }
        }, 100);
      } else { setModalMesaj(data.hata || "Ödeme başlatılamadı."); }
    } catch { setModalMesaj("Bir hata oluştu, tekrar deneyin."); }
    setOdemeYukleniyor(false);
  };

  const paketler = [
    { id: "baslangic", isim: "Başlangıç", fiyat: "₺29", kredi: "10 kredi", renk: "border-gray-200", butonRenk: "bg-gray-800 hover:bg-gray-900" },
    { id: "populer", isim: "Popüler", fiyat: "₺79", kredi: "30 kredi", renk: "border-orange-400 ring-2 ring-orange-400", butonRenk: "bg-orange-500 hover:bg-orange-600", rozet: true },
    { id: "buyuk", isim: "Büyük", fiyat: "₺149", kredi: "100 kredi", renk: "border-gray-200", butonRenk: "bg-gray-800 hover:bg-gray-900" },
  ];

  const yorumlar = [
    { isim: "Ayşe K.", magaza: "Trendyol satıcısı", yorum: "30 dakikada 50 ürünün listing'ini bitirdim. Daha önce günlük işti.", puan: 5 },
    { isim: "Mehmet T.", magaza: "Hepsiburada mağazası", yorum: "Fotoğraf yükleyince ürünü tanıyor ve harika metinler yazıyor. Barkod özelliği çok işime yarıyor.", puan: 5 },
    { isim: "Fatma D.", magaza: "Amazon TR satıcısı", yorum: "Görsel üretme özelliği muhteşem. Profesyonel fotoğraf çektirmek yerine artık yzliste kullanıyorum.", puan: 5 },
  ];

  // Örnek çıktı — bölümlü kutular
  const ornekBolumler = [
    {
      ikon: "📌",
      baslik: "Başlık",
      icerik: "Kütahya Porselen Çiçek Desenli Kahve Fincanı 6'lı Set | 80ml | Altın Yaldızlı | Dishwasher Safe",
      renk: "border-l-orange-400",
    },
    {
      ikon: "🔹",
      baslik: "Özellikler",
      icerik: `• 🏆 Birinci Kalite Porselen — Kurşunsuz, gıda güvenli materyal; zarif sunum sağlar.
• ☕ 80ml Espresso Hacmi — Türk kahvesi, espresso ve menengiç kahvesi için ideal boyut.
• 🌸 El Yapımı Çiçek Deseni + Altın Yaldız — Benzersiz baskı, özel gün hediyesi için ideal.
• 🎁 6 Kişilik Komple Set — Fincan ve tabaklar dahil, özel hediye kutusunda teslim.
• ✅ Bulaşık Makinesine Uyumlu — Yaldızlar bozulmadan yıkanabilir.`,
      renk: "border-l-blue-400",
    },
    {
      ikon: "📄",
      baslik: "Açıklama",
      icerik: "Kütahya'nın 500 yıllık porselen geleneğinden ilham alarak tasarlanan bu fincan seti, hem estetik hem işlevselliği bir arada sunar. Düğün, nişan ve doğum günü hediyesi olarak tercih edilen bu set, sevdiklerinize kalıcı bir değer sunmak isteyenler için biçilmiş kaftandır.",
      renk: "border-l-green-400",
    },
    {
      ikon: "🏷️",
      baslik: "Arama Etiketleri",
      icerik: "porselen fincan seti, kahve fincanı hediye, kütahya porselen, altın yaldızlı fincan, 6lı fincan seti, türk kahvesi fincanı, düğün hediyesi fincan, çeyiz fincan seti",
      renk: "border-l-purple-400",
    },
  ];

  return (
    <main className="min-h-screen bg-white font-sans">

      {/* MODAL */}
      {modalAcik && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) setModalAcik(false); }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">
                {modalMod === "uye" ? (modalUyeMod === "kayit" ? "Hesap Oluştur" : "Giriş Yap") : "Paket Seç"}
              </h2>
              <button onClick={() => setModalAcik(false)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
            </div>
            {modalMod === "uye" ? (
              <div className="p-6 space-y-4">
                <div className="flex gap-2">
                  <button onClick={() => setModalUyeMod("kayit")} className={`flex-1 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${modalUyeMod === "kayit" ? "bg-orange-500 text-white border-orange-500" : "bg-white text-orange-500 border-orange-200"}`}>🎁 Kayıt Ol</button>
                  <button onClick={() => setModalUyeMod("giris")} className={`flex-1 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${modalUyeMod === "giris" ? "bg-gray-800 text-white border-gray-800" : "bg-white text-gray-600 border-gray-200"}`}>Giriş Yap</button>
                </div>
                <input type="email" placeholder="E-posta" value={modalEmail} onChange={(e) => setModalEmail(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
                <input type="password" placeholder="Şifre" value={modalSifre} onChange={(e) => setModalSifre(e.target.value)} onKeyDown={(e) => e.key === "Enter" && modalUyeGiris()} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
                {modalUyeMod === "kayit" && (
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" checked={modalSozlesme} onChange={(e) => setModalSozlesme(e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-gray-300 flex-shrink-0" />
                    <span className="text-xs text-gray-500 leading-relaxed">
                      <a href="/gizlilik" target="_blank" className="text-orange-500 hover:underline">Gizlilik Politikası</a> ve <a href="/mesafeli-satis" target="_blank" className="text-orange-500 hover:underline">Mesafeli Satış Sözleşmesi</a>'ni okudum.
                    </span>
                  </label>
                )}
                {modalMesaj && <p className={`text-xs ${modalMesaj.includes("başarılı") ? "text-green-600" : "text-red-500"}`}>{modalMesaj}</p>}
                <button onClick={modalUyeGiris} disabled={modalYukleniyor || (modalUyeMod === "kayit" && !modalSozlesme)} className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white font-semibold py-3 rounded-xl text-sm transition-colors">
                  {modalYukleniyor ? "..." : modalUyeMod === "kayit" ? "Ücretsiz Hesap Oluştur" : "Giriş Yap"}
                </button>
              </div>
            ) : !odemeForm ? (
              <div className="p-6 space-y-4">
                {paketler.map((p) => (
                  <div key={p.id} className={`border-2 ${p.renk} rounded-2xl p-5 relative`}>
                    {p.rozet && <span className="absolute -top-3 left-4 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">En Popüler</span>}
                    <div className="flex items-center justify-between">
                      <div><p className="font-semibold text-gray-800">{p.isim}</p><p className="text-sm text-gray-500">{p.kredi}</p></div>
                      <p className="text-2xl font-bold text-gray-900">{p.fiyat}</p>
                    </div>
                    <button onClick={() => odemeBaslat(p.id)} disabled={odemeYukleniyor} className={`w-full mt-4 ${p.butonRenk} text-white font-semibold py-2.5 rounded-xl text-sm transition-colors disabled:bg-gray-300`}>
                      {odemeYukleniyor && seciliPaket === p.id ? "⏳ Yükleniyor..." : "Satın Al"}
                    </button>
                  </div>
                ))}
                {modalMesaj && <p className="text-xs text-red-500">{modalMesaj}</p>}
                <p className="text-xs text-gray-400 text-center">🔒 Güvenli ödeme — iyzico altyapısı</p>
              </div>
            ) : (
              <div className="p-4"><div ref={odemeRef} id="iyzipay-checkout-form" className="popup" /></div>
            )}
          </div>
        </div>
      )}

      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-100 px-4 sm:px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <a href="/auth"><img src="/yzliste_logo.png" alt="yzliste" className="h-8" /></a>
          <div className="flex gap-2">
            <button onClick={() => { handleModDegistir("giris"); document.getElementById("auth-form")?.scrollIntoView({ behavior: "smooth" }); }} className="text-sm text-gray-500 hover:text-gray-800 px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">Giriş Yap</button>
            <button onClick={() => { handleModDegistir("kayit"); document.getElementById("auth-form")?.scrollIntoView({ behavior: "smooth" }); }} className="text-sm bg-orange-500 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors font-medium">Ücretsiz Başla</button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="px-4 sm:px-6 pt-12 sm:pt-16 pb-10 text-center max-w-3xl mx-auto">
        <span className="inline-block bg-orange-100 text-orange-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-5 tracking-wide uppercase">Trendyol · Hepsiburada · Amazon TR · N11 · Etsy · Amazon USA</span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-5">
          E-ticaret listing için<br />
          <span className="text-orange-500">en kolay çözüm</span>
        </h1>
        <p className="text-base sm:text-lg text-gray-500 mb-4 max-w-2xl mx-auto leading-relaxed">
          Platforma ürün yüklemek için hem <strong className="text-gray-700">optimize metin</strong> hem de <strong className="text-gray-700">profesyonel görsel</strong> gerekir. yzliste ikisini de tek yerden üretir.
        </p>
        <p className="text-sm text-gray-400 mb-8 max-w-xl mx-auto">İster açıklama gir, ister ürün fotoğrafını yükle ya da barkod tara — gerisini YZ halleder.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={() => { handleModDegistir("kayit"); document.getElementById("auth-form")?.scrollIntoView({ behavior: "smooth" }); }} className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-4 rounded-xl text-base transition-colors shadow-lg shadow-orange-100">
            3 Ücretsiz İçerik Üretim Kredisi, Başla →
          </button>
          <button onClick={() => document.getElementById("nasil-calisir")?.scrollIntoView({ behavior: "smooth" })} className="text-gray-500 hover:text-gray-700 font-medium px-8 py-4 rounded-xl text-base transition-colors underline underline-offset-4">
            Nasıl çalışır?
          </button>
        </div>
      </section>

      {/* SOSYAL KANIT */}
      <section className="px-4 sm:px-6 py-10 bg-orange-50 border-y border-orange-100">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap justify-center gap-8 sm:gap-16 mb-10">
            {[
              { sayi: "500+", label: "Beta kullanıcısı" },
              { sayi: "10.000+", label: "Üretilen listing" },
              { sayi: "4.9/5", label: "Kullanıcı memnuniyeti" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl sm:text-3xl font-extrabold text-orange-500">{s.sayi}</div>
                <div className="text-xs text-gray-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {yorumlar.map((y, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-orange-100">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: y.puan }).map((_, j) => (
                    <span key={j} className="text-orange-400 text-sm">★</span>
                  ))}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">"{y.yorum}"</p>
                <div>
                  <p className="text-xs font-semibold text-gray-800">{y.isim}</p>
                  <p className="text-xs text-gray-400">{y.magaza}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3 SEÇENEK */}
      <section className="px-4 sm:px-6 py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Neye ihtiyacın var?</h2>
          <p className="text-center text-sm text-gray-400 mb-6">Metin, görsel ya da her ikisi — ayrı ayrı veya birlikte kullanabilirsin</p>
          <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-8 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">İçerik üretim kredileri nasıl çalışır?</h3>
            <ul className="space-y-2">
              {[
                { ikon: "🎁", metin: "Kayıt olunca 3 ücretsiz içerik üretim kredisi hediye edilir — kredi kartı gerekmez." },
                { ikon: "📝", metin: "Her listing metni üretimi 1 kredi tüketir. Başlık, özellikler, açıklama ve etiketlerin tamamı tek kredide gelir." },
                { ikon: "📷", metin: "Görsel üretimi stil başına 1 kredi tüketir. Her stilden 4 varyasyon üretilir — inceleme ücretsiz, sadece indirince kredi düşer. 1 stil → 4 görsel → 1 kredi · 2 stil → 8 görsel → 2 kredi." },
                { ikon: "💳", metin: "Kredilerin biter bitmez istediğin paketi satın al. 29₺'den başlayan paketler, abonelik yok." },
              ].map((m, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-500">
                  <span className="text-base flex-shrink-0">{m.ikon}</span>
                  <span>{m.metin}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
              <div className="bg-blue-50 px-5 pt-6 pb-4">
                <div className="text-2xl mb-2">📝</div>
                <h3 className="font-bold text-gray-800">Sadece Listing Metni</h3>
                <p className="text-xs text-gray-500 mt-1">1 kredi</p>
              </div>
              <div className="p-5 flex-1">
                <p className="text-sm text-gray-600 leading-relaxed mb-3">Platforma özel optimize başlık, madde madde özellikler, satışa dönen açıklama ve arama etiketleri.</p>
                <ul className="space-y-1.5">
                  {["Manuel metin girişi", "Fotoğraftan otomatik analiz", "Barkod ile ürün tanıma"].map(f => (
                    <li key={f} className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px]">✓</span>{f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
              <div className="bg-purple-50 px-5 pt-6 pb-4">
                <div className="text-2xl mb-2">📷</div>
                <h3 className="font-bold text-gray-800">Sadece Görsel</h3>
                <p className="text-xs text-gray-500 mt-1">Stil başına 1 kredi · Her stilden 4 varyasyon</p>
              </div>
              <div className="p-5 flex-1">
                <p className="text-sm text-gray-600 leading-relaxed mb-3">Tek fotoğraftan 3 farklı stüdyo görseli — her stilden 4 varyasyon. 1 stil → 4 görsel → 1 kredi. İnceleme ücretsiz, indirince kredi düşer.</p>
                <div className="grid grid-cols-3 gap-1.5 mb-3">
                  {[{ src: "/ornek_beyaz.jpg", label: "Beyaz" }, { src: "/ornek_koyu.jpg", label: "Koyu" }, { src: "/ornek_lifestyle.jpg", label: "Lifestyle" }].map(s => (
                    <div key={s.label} className="relative rounded-lg overflow-hidden">
                      <img src={s.src} alt={s.label} className="w-full aspect-square object-cover" />
                      <span className="absolute bottom-0 inset-x-0 bg-black/40 text-white text-[9px] text-center py-0.5">{s.label}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400">İnceleme ücretsiz · İndirince 1 kredi · 1 stil = 4 görsel</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl border-2 border-orange-200 shadow-sm overflow-hidden flex flex-col">
              <div className="bg-orange-50 px-5 pt-6 pb-4">
                <div className="text-2xl mb-2">✨</div>
                <h3 className="font-bold text-gray-800">Metin + Görsel</h3>
                <p className="text-xs text-gray-500 mt-1">Ayrı ayrı kredi</p>
              </div>
              <div className="p-5 flex-1">
                <p className="text-sm text-gray-600 leading-relaxed mb-3">Trendyol ve Hepsiburada'da hem metin hem görsel zorunlu. İkisini aynı anda üret.</p>
                <div className="space-y-2">
                  {["Optimize listing metni", "4 stüdyo görseli — beğendiğini indir", "Platforma hazır, düzenleme gerektirmez"].map((t, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-gray-600">
                      <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">{i + 1}</span>{t}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 text-center">
            <button onClick={hemenAlTikla} className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-10 py-4 rounded-2xl text-base transition-colors shadow-lg shadow-orange-100">
              Paket Satın Al — 29₺'den başlıyor
            </button>
            <p className="text-xs text-gray-400 mt-3">veya 3 ücretsiz içerik üretim kredisi ile başla, kredi kartı gerekmez</p>
          </div>
        </div>
      </section>

      {/* GÖRSEL ÖNCESİ / SONRASI */}
      <section className="px-4 sm:px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">📷 Tek fotoğraftan 3 farklı stüdyo görseli</h2>
          <p className="text-center text-sm text-gray-400 mb-10">AI arka planı kaldırır, istediğin ortama yerleştirir — her stilden 4 varyasyon üretir. İnceleme ücretsiz, indirince 1 kredi düşer.</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="space-y-2">
              <div className="relative rounded-2xl overflow-hidden border-2 border-gray-300">
                <img src="/ornek_once.jpg" alt="önce" className="w-full aspect-square object-cover" />
                <div className="absolute top-2 left-2"><span className="bg-gray-800/80 text-white text-[10px] px-2 py-1 rounded-full">Ham fotoğraf</span></div>
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
                  <div className="absolute top-2 left-2"><span className="bg-white/90 text-gray-700 text-[10px] px-2 py-1 rounded-full">{item.etiket}</span></div>
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

      {/* ÖRNEK LİSTİNG — BÖLÜMLÜ KUTULAR */}
      <section className="px-4 sm:px-6 py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Böyle bir metin alırsın</h2>
          <p className="text-center text-sm text-gray-400 mb-8">
            Her bölüm ayrı kutu — platforma yapıştırmaya hazır, tek tıkla kopyalanır
          </p>

          <div className="space-y-3">
            {/* Platform etiketi */}
            <div className="flex items-center gap-2 px-1">
              <span className="w-2 h-2 rounded-full bg-orange-400 flex-shrink-0" />
              <span className="text-xs font-semibold text-orange-700">Trendyol formatında örnek çıktı</span>
            </div>

            {ornekBolumler.map((bolum, i) => (
              <div key={i} className={`bg-white rounded-2xl shadow-sm border-l-4 ${bolum.renk} border border-gray-100 p-5`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-gray-700">{bolum.ikon} {bolum.baslik}</span>
                  <span className="text-xs bg-gray-100 text-gray-400 px-2 py-0.5 rounded-lg">Kopyala</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{bolum.icerik}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MARKA PROFİLİ TANITIM */}
      <section className="px-4 sm:px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-3xl border border-orange-100 p-8 sm:p-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="flex-1">
                <span className="inline-block bg-orange-100 text-orange-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">✨ Yeni özellik</span>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Marka bilgilerini gir,<br />
                  <span className="text-orange-500">sana özel içerikler al</span>
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Profilinden mağaza adını, hedef kitlenini ve metin tonunu belirle. Bundan sonra her üretimde AI bu bilgileri kullanır — metinler artık senin marka dilinle konuşur.
                </p>
                <div className="space-y-2">
                  {[
                    { ikon: "🏪", metin: "Mağaza adın ve marka kimliğin metne yansır" },
                    { ikon: "🎯", metin: "Hedef kitlenin dilinde yazar — '25-40 yaş kadınlar' dedin mi, o kitleye hitap eder" },
                    { ikon: "🎨", metin: "Samimi, profesyonel veya premium — tonunu seç, her üretimde uygular" },
                    { ikon: "💡", metin: "Hızlı kargo, yerli üretim gibi değerlerin her ürüne otomatik eklenir" },
                  ].map((m, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm text-gray-600">
                      <span className="flex-shrink-0">{m.ikon}</span>
                      <span>{m.metin}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sağ taraf — mini mockup */}
              <div className="w-full sm:w-72 flex-shrink-0">
                <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-5 space-y-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Marka Profili</p>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Mağaza adı</p>
                      <div className="bg-orange-50 border border-orange-200 rounded-lg px-3 py-2 text-sm text-orange-700 font-medium">Ayşe Tekstil</div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Metin tonu</p>
                      <div className="flex gap-2">
                        <div className="bg-orange-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg">Samimi</div>
                        <div className="bg-gray-100 text-gray-500 text-xs px-3 py-1.5 rounded-lg">Profesyonel</div>
                        <div className="bg-gray-100 text-gray-500 text-xs px-3 py-1.5 rounded-lg">Premium</div>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Hedef kitle</p>
                      <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600">25-40 yaş kadınlar</div>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-xs text-green-600 font-medium">✓ Her üretimde otomatik uygulanır</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NASIL ÇALIŞIR */}
      <section id="nasil-calisir" className="px-4 sm:px-6 py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-10">4 adımda hazır</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { no: "1", ikon: "📦", baslik: "Ürünü tanımla", aciklama: "Ürün adı yaz, fotoğraf yükle ya da barkod tara." },
              { no: "2", ikon: "🛒", baslik: "Platform seç", aciklama: "Trendyol, HB, Amazon TR, N11, Etsy veya Amazon USA." },
              { no: "3", ikon: "📝", baslik: "Listing metnini al", aciklama: "Optimize başlık, özellikler, açıklama ve etiketler." },
              { no: "4", ikon: "📷", baslik: "Görsel üret", aciklama: "3 stilde stüdyo görseli. Kendi prompt'unu gir." },
            ].map((adim) => (
              <div key={adim.no} className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
                <div className="text-2xl sm:text-3xl mb-3">{adim.ikon}</div>
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-orange-100 text-orange-600 text-xs font-bold flex items-center justify-center mb-3">{adim.no}</div>
                <h3 className="font-semibold text-gray-800 text-sm mb-1">{adim.baslik}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{adim.aciklama}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ÖZELLİKLER */}
      <section className="px-4 sm:px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-10">Neden yzliste?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { ikon: "📸", baslik: "Fotoğraftan analiz", aciklama: "Ürün fotoğrafını yükle, YZ ürünü tanısın ve listing metnini otomatik oluştursun." },
              { ikon: "📦", baslik: "Barkod tarama", aciklama: "Barkodu tarat, ürün bilgilerini veritabanından çek, listing üret." },
              { ikon: "🎯", baslik: "Platform şablonları", aciklama: "Trendyol, Hepsiburada, Amazon TR ve N11 için ayrı format." },
              { ikon: "📷", baslik: "AI görsel + prompt", aciklama: "Beyaz, koyu, lifestyle — her stilden 4 varyasyon. Kendi sahneni yaz." },
              { ikon: "💎", baslik: "Kredi sadece indirmede düşer", aciklama: "Görsel üretilir, beğenmezsen kredinizi kaybetmezsiniz." },
              { ikon: "💰", baslik: "Kullandığın kadar öde", aciklama: "Aylık abonelik yok. 3 ücretsiz deneme kredisi ile başla." },
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
      <section id="auth-form" className="px-4 sm:px-6 py-16 bg-gray-50">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 sm:p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {mod === "kayit" ? "Ücretsiz hesap oluştur" : "Tekrar hoş geldin"}
              </h2>
              <p className="text-sm text-gray-400">
                {mod === "kayit" ? "3 ücretsiz içerik üretim kredisi" : "Hesabına giriş yap"}
              </p>
            </div>

            {sifreSifirlamaGonderildi ? (
              <div className="text-center space-y-4 py-4">
                <div className="text-4xl">📧</div>
                <p className="text-sm font-semibold text-gray-800">Şifre sıfırlama e-postası gönderildi</p>
                <p className="text-xs text-gray-500"><strong>{email}</strong> adresine bağlantı gönderdik.</p>
                <button onClick={() => { setSifreSifirlamaGonderildi(false); setMod("giris"); }} className="text-xs text-orange-500 hover:text-orange-700 underline">
                  Giriş sayfasına dön
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <input type="email" placeholder="E-posta" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
                <div className="space-y-1">
                  <input type="password" placeholder="Şifre" value={sifre} onChange={(e) => setSifre(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    autoComplete={mod === "kayit" ? "new-password" : "current-password"}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
                  {mod === "giris" && (
                    <div className="flex justify-end">
                      <button onClick={handleSifreSifirla} disabled={sifreSifirlamaYukleniyor} className="text-xs text-gray-400 hover:text-orange-500 transition-colors disabled:opacity-50">
                        {sifreSifirlamaYukleniyor ? "Gönderiliyor..." : "Şifremi unuttum"}
                      </button>
                    </div>
                  )}
                </div>
                {mod === "kayit" && (
                  <label className="flex items-start gap-3 cursor-pointer mt-1">
                    <input type="checkbox" checked={sozlesmeOnay} onChange={(e) => setSozlesmeOnay(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-gray-300 flex-shrink-0" />
                    <span className="text-xs text-gray-500 leading-relaxed">
                      <a href="/gizlilik" target="_blank" className="text-orange-500 hover:underline font-medium">Gizlilik Politikası</a>,{" "}
                      <a href="/mesafeli-satis" target="_blank" className="text-orange-500 hover:underline font-medium">Mesafeli Satış Sözleşmesi</a> ve{" "}
                      <a href="/teslimat-iade" target="_blank" className="text-orange-500 hover:underline font-medium">Teslimat ve İade Şartları</a>'nı okudum, kabul ediyorum.
                    </span>
                  </label>
                )}
                {mesaj && <p className={`text-xs ${mesaj.includes("başarılı") ? "text-green-600" : "text-red-500"}`}>{mesaj}</p>}
                <button onClick={handleSubmit} disabled={yukleniyor || (mod === "kayit" && !sozlesmeOnay)}
                  className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white font-semibold py-3 rounded-xl transition-colors text-sm">
                  {yukleniyor ? "..." : mod === "kayit" ? "Ücretsiz Hesap Oluştur" : "Giriş Yap"}
                </button>
              </div>
            )}

            {!sifreSifirlamaGonderildi && (
              <>
                {mod === "kayit" && <p className="text-xs text-gray-400 text-center mt-4">Kayıt olunca 3 ücretsiz içerik üretim kredisi alırsınız</p>}
                <div className="text-center mt-5 pt-4 border-t border-gray-100">
                  <button onClick={() => handleModDegistir(mod === "giris" ? "kayit" : "giris")} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
                    {mod === "giris" ? "Hesabın yok mu? Kaydol →" : "Zaten hesabın var mı? Giriş yap →"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-100 px-4 sm:px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 text-xs text-gray-400">
            <a href="/hakkimizda" className="hover:text-orange-500">Hakkımızda</a>
            <span>·</span>
            <a href="/gizlilik" className="hover:text-orange-500">Gizlilik Politikası</a>
            <span>·</span>
            <a href="/mesafeli-satis" className="hover:text-orange-500">Mesafeli Satış</a>
            <span>·</span>
            <a href="/teslimat-iade" className="hover:text-orange-500">Teslimat ve İade</a>
            <span>·</span>
            <a href="mailto:destek@yzliste.com" className="hover:text-orange-500">destek@yzliste.com</a>
          </div>
          <div className="flex justify-center">
            <img src="/iyzico_footer_logo.png" alt="iyzico ile öde" className="h-10" />
          </div>
          <p className="text-center text-xs text-gray-400">© 2026 yzliste · SIMOON PAZARLAMA VE DANISMANLIK LIMITED SIRKETI</p>
        </div>
      </footer>

    </main>
  );
}
