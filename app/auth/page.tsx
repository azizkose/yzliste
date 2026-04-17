"use client";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import { PAKET_LISTESI, MIN_FIYAT } from "@/lib/paketler";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [sifre, setSifre] = useState("");
  const [mod, setMod] = useState<"giris" | "kayit">("kayit");
  const [yukleniyor, setYukleniyor] = useState(false);
  const [mesaj, setMesaj] = useState("");
  const [sozlesmeOnay, setSozlesmeOnay] = useState(false);
  const [oturum, setOturum] = useState<boolean | null>(null);
  const [menuAcik, setMenuAcik] = useState(false);
  const [ozellikTab, setOzellikTab] = useState(0);
  const [modalAcik, setModalAcik] = useState(false);
  const [modalMod, setModalMod] = useState<"paket" | "uye">("paket");
  const [modalUyeMod, setModalUyeMod] = useState<"giris" | "kayit">("kayit");
  const [modalAmac, setModalAmac] = useState<"auth" | "satin_al">("auth");
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
  const [anonimKullanici, setAnonimKullanici] = useState(false);
  const odemeRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setOturum(!!user);
      const anonim = user?.is_anonymous ?? false;
      setAnonimKullanici(anonim);
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

  const handleGoogleGiris = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/` },
    });
    if (error) {
      setModalMesaj("Google ile giriş başlatılamadı: " + error.message);
      return;
    }
    if (data?.url) window.location.href = data.url;
  };

  const hemenAlTikla = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.is_anonymous) {
      // Giriş yok veya anonim — önce üye ekranını göster
      setModalAmac("satin_al");
      setModalUyeMod("giris");
      setModalMod("uye");
      setModalAcik(true);
      setOdemeForm(null);
      setSeciliPaket(null);
      setModalMesaj("");
      return;
    }
    setModalAmac("satin_al");
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
      window.location.href = "/profil#fatura";
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
      if (anonimKullanici) {
        // Anonim hesabı gerçek hesaba bağla (user ID ve krediler korunur)
        const { error } = await supabase.auth.updateUser({ email: modalEmail, password: modalSifre });
        if (error) { setModalMesaj(turkceHata(error.message)); }
        else { setModalMesaj("Hesabınız oluşturuldu! E-postanızı doğrulayın, ardından giriş yapın."); }
      } else {
        const { error } = await supabase.auth.signUp({ email: modalEmail, password: modalSifre });
        if (error) { setModalMesaj(turkceHata(error.message)); }
        else { setModalMesaj("Kayıt başarılı! E-postanızı doğrulayın."); }
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email: modalEmail, password: modalSifre });
      if (error) { setModalMesaj("E-posta veya şifre hatalı."); }
      else {
        setOturum(true);
        if (modalAmac === "auth") {
          router.push("/");
        } else {
          setModalMod("paket");
          setModalMesaj("");
        }
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

  // Paketler lib/paketler.ts'den geliyor
  const paketler = PAKET_LISTESI;

  // Örnek çıktı — bölümlü kutular
  const ornekBolumler = [
    {
      ikon: "📌",
      baslik: "Başlık",
      icerik: "Kütahya Porselen Çiçek Desenli Kahve Fincanı 6'lı Set | 80ml | Altın Yaldızlı | Dishwasher Safe",
      renk: "border-l-blue-400",
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
      renk: "border-l-violet-400",
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
                <button
                  onClick={handleGoogleGiris}
                  className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Google ile Devam Et
                </button>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-gray-100" />
                  <span className="text-xs text-gray-400">veya e-posta ile</span>
                  <div className="flex-1 h-px bg-gray-100" />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setModalUyeMod("kayit")} className={`flex-1 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${modalUyeMod === "kayit" ? "bg-indigo-500 text-white border-indigo-500" : "bg-white text-indigo-500 border-indigo-200"}`}>🎁 Kayıt Ol</button>
                  <button onClick={() => setModalUyeMod("giris")} className={`flex-1 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${modalUyeMod === "giris" ? "bg-gray-800 text-white border-gray-800" : "bg-white text-gray-600 border-gray-200"}`}>Giriş Yap</button>
                </div>
                <input type="email" placeholder="E-posta" value={modalEmail} onChange={(e) => setModalEmail(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                <input type="password" placeholder="Şifre" value={modalSifre} onChange={(e) => setModalSifre(e.target.value)} onKeyDown={(e) => e.key === "Enter" && modalUyeGiris()} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                {modalUyeMod === "kayit" && (
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" checked={modalSozlesme} onChange={(e) => setModalSozlesme(e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-gray-300 flex-shrink-0" />
                    <span className="text-xs text-gray-500 leading-relaxed">
                      <a href="/gizlilik" target="_blank" className="text-indigo-500 hover:underline">Gizlilik Politikası</a> ve <a href="/mesafeli-satis" target="_blank" className="text-indigo-500 hover:underline">Mesafeli Satış Sözleşmesi</a>&apos;ni okudum.
                    </span>
                  </label>
                )}
                {modalMesaj && <p className={`text-xs ${modalMesaj.includes("başarılı") ? "text-green-600" : "text-red-500"}`}>{modalMesaj}</p>}
                <button onClick={modalUyeGiris} disabled={modalYukleniyor || (modalUyeMod === "kayit" && !modalSozlesme)} className="w-full bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-300 text-white font-semibold py-3 rounded-xl text-sm transition-colors">
                  {modalYukleniyor ? "..." : modalUyeMod === "kayit" ? "Ücretsiz Hesap Oluştur" : "Giriş Yap"}
                </button>
              </div>
            ) : !odemeForm ? (
              <div className="p-6 space-y-4">
                {paketler.map((p) => (
                  <div key={p.id} className={`border-2 ${p.renk} rounded-2xl p-5 relative`}>
                    {p.rozet && <span className="absolute -top-3 left-4 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full">En Popüler</span>}
                    <div className="flex items-center justify-between">
                      <div><p className="font-semibold text-gray-800">{p.isim}</p><p className="text-sm text-gray-500">{p.krediStr}</p></div>
                      <p className="text-2xl font-bold text-gray-900">{p.fiyatStr}</p>
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
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-100 px-4 sm:px-6 py-2.5">
        <div className="max-w-6xl mx-auto flex items-center gap-2">
          <Link href="/auth" className="flex-shrink-0 mr-1"><img src="/yzliste_logo.png" alt="yzliste" className="h-8" /></Link>
          <nav className="flex items-center gap-0.5 text-xs sm:text-sm text-gray-500">
            <Link href="/auth" className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-indigo-600 font-medium whitespace-nowrap">Ana Sayfa</Link>
            <Link href="/" className="hidden sm:block px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-gray-100 hover:text-gray-800 transition-colors whitespace-nowrap">İçerik</Link>
            <Link href="/fiyatlar" className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-gray-100 hover:text-gray-800 transition-colors whitespace-nowrap">Fiyatlar</Link>
            <Link href="/blog" className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-gray-100 hover:text-gray-800 transition-colors whitespace-nowrap">Blog</Link>
          </nav>
          <div className="flex gap-1 sm:gap-2 ml-auto items-center">
            {oturum && !anonimKullanici ? (
              <>
                <Link href="/profil" className="hidden sm:block text-xs sm:text-sm text-gray-500 hover:text-gray-800 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap">Profil</Link>
                <Link href="/" className="hidden sm:block text-xs sm:text-sm bg-indigo-500 text-white px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-indigo-600 transition-colors font-medium whitespace-nowrap">İçerik Üret →</Link>
              </>
            ) : (
              <>
                <Link href="/giris" className="hidden sm:block text-xs sm:text-sm text-gray-500 hover:text-gray-800 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap">Giriş Yap</Link>
                <Link href="/kayit" className="hidden sm:block text-xs sm:text-sm bg-indigo-500 text-white px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-indigo-600 transition-colors font-medium whitespace-nowrap">Ücretsiz Başla →</Link>
              </>
            )}
            {/* Mobil hamburger */}
            <button
              onClick={() => setMenuAcik(!menuAcik)}
              className="sm:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
              aria-label="Menü"
            >
              {menuAcik ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobil dropdown */}
        {menuAcik && (
          <div className="sm:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-lg z-50">
            <nav className="px-4 py-3 space-y-1">
              <a href="/auth" onClick={() => setMenuAcik(false)} className="block px-3 py-2 rounded-lg text-sm text-indigo-600 font-medium bg-indigo-50">Ana Sayfa</a>
              <a href="/" onClick={() => setMenuAcik(false)} className="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors">İçerik</a>
              <a href="/fiyatlar" onClick={() => setMenuAcik(false)} className="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors">Fiyatlar</a>
              <a href="/blog" onClick={() => setMenuAcik(false)} className="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors">Blog</a>
              <div className="border-t border-gray-100 pt-2 mt-2 space-y-1">
                {oturum && !anonimKullanici ? (
                  <>
                    <a href="/profil" className="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors">Profil</a>
                    <a href="/" className="block px-3 py-2 rounded-lg text-sm font-medium bg-indigo-500 text-white text-center hover:bg-indigo-600 transition-colors">İçerik Üret →</a>
                  </>
                ) : (
                  <>
                    <Link href="/giris" onClick={() => setMenuAcik(false)} className="block w-full text-left px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors">Giriş Yap</Link>
                    <Link href="/kayit" onClick={() => setMenuAcik(false)} className="block w-full text-center px-3 py-2 rounded-lg text-sm font-medium bg-indigo-500 text-white hover:bg-indigo-600 transition-colors">Ücretsiz Başla →</Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* HERO */}
      <section className="px-4 sm:px-6 pt-12 sm:pt-16 pb-12 text-center max-w-3xl mx-auto">
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1.5 rounded-full tracking-wide">Trendyol · Hepsiburada · Amazon TR · N11 · Etsy · Amazon USA</span>
          <span className="inline-block bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-full tracking-wide">🆕 Video + Sosyal Medya</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-5">
          Ürünün için her içeriği<br />
          <span className="text-indigo-500">tek platformda üret</span>
        </h1>
        <p className="text-base sm:text-lg text-gray-500 mb-6 max-w-2xl mx-auto leading-relaxed">
          Listing metni, stüdyo görseli, ürün videosu, sosyal medya içeriği —<br className="hidden sm:block" />
          <strong className="text-gray-700">fotoğraf yükle ya da barkod tara</strong>, gerisini YZ halleder.
        </p>
        {/* 4 özellik rozeti */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {[
            { ikon: "📝", label: "Listing Metni", sub: "1 kredi" },
            { ikon: "📷", label: "AI Görsel", sub: "1 kredi / stil" },
            { ikon: "🎬", label: "Video", sub: "5–8 kredi" },
            { ikon: "📱", label: "Sosyal Medya", sub: "1 kredi" },
          ].map((f) => (
            <div key={f.label} className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-3 py-1.5 shadow-sm">
              <span className="text-base">{f.ikon}</span>
              <span className="text-xs font-semibold text-gray-700">{f.label}</span>
              <span className="text-[11px] text-gray-400">· {f.sub}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/kayit" className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-8 py-4 rounded-xl text-base transition-colors shadow-lg shadow-indigo-100">
            Ücretsiz Başla — 3 Kredi Hediye →
          </Link>
          <button onClick={() => document.getElementById("nasil-calisir")?.scrollIntoView({ behavior: "smooth" })} className="text-gray-500 hover:text-gray-700 font-medium px-8 py-4 rounded-xl text-base transition-colors border border-gray-200 hover:border-gray-300">
            Nasıl çalışır?
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-4">Kredi kartı gerekmez · Hesap oluşturunca 3 kredi hemen tanımlanır</p>
      </section>

      {/* 4 ÖZELLİK + TAB ÖRNEKLERİ */}
      <section className="px-4 sm:px-6 py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Tek platformda 4 içerik türü</h2>
          <p className="text-center text-sm text-gray-400 mb-8">İhtiyacın olanı seç — örnek çıktıyı hemen gör</p>

          {/* 4 Kutu */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            {[
              {
                idx: 0,
                ikon: "📝",
                baslik: "Listing Metni",
                aciklama: "Başlık, özellikler, açıklama, etiketler",
                kredi: "1 kredi",
                renk: "blue",
                ring: "ring-blue-400",
                bg: "bg-blue-50",
                badge: "text-blue-600 bg-blue-100",
              },
              {
                idx: 1,
                ikon: "📷",
                baslik: "Görsel",
                aciklama: "7 stil, stil başına 1 görsel",
                kredi: "Stil başına 1 kredi",
                renk: "purple",
                ring: "ring-violet-400",
                bg: "bg-violet-50",
                badge: "text-violet-600 bg-violet-100",
              },
              {
                idx: 2,
                ikon: "🎬",
                baslik: "Video",
                aciklama: "Ürün tanıtım videosu, 1080p",
                kredi: "5sn veya 10sn",
                renk: "amber",
                ring: "ring-amber-400",
                bg: "bg-amber-50",
                badge: "text-amber-600 bg-amber-100",
              },
              {
                idx: 3,
                ikon: "📱",
                baslik: "Sosyal Medya",
                aciklama: "Caption + hashtag, tüm platformlar",
                kredi: "1 kredi",
                renk: "emerald",
                ring: "ring-emerald-400",
                bg: "bg-emerald-50",
                badge: "text-emerald-600 bg-emerald-100",
              },
            ].map((k) => (
              <button
                key={k.idx}
                onClick={() => setOzellikTab(k.idx)}
                className={`text-left rounded-2xl border-2 overflow-hidden transition-all shadow-sm hover:shadow-md ${
                  ozellikTab === k.idx ? `border-transparent ring-2 ${k.ring} ${k.bg}` : "border-gray-100 bg-white hover:border-gray-200"
                }`}
              >
                <div className="px-4 pt-5 pb-4">
                  <div className="text-2xl mb-2">{k.ikon}</div>
                  <p className="font-bold text-gray-800 text-sm">{k.baslik}</p>
                  <p className="text-xs text-gray-400 mt-1 leading-snug">{k.aciklama}</p>
                  <span className={`inline-block mt-2 text-[11px] font-semibold px-2 py-0.5 rounded-full ${k.badge}`}>{k.kredi}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Tab içeriği */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

            {/* Listing Metni */}
            {ozellikTab === 0 && (
              <div className="p-5 sm:p-7">
                <div className="flex items-center gap-2 mb-5">
                  <span className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
                  <span className="text-xs font-semibold text-blue-700">Trendyol formatında örnek çıktı</span>
                </div>
                <div className="space-y-3">
                  {ornekBolumler.map((bolum, i) => (
                    <div key={i} className={`rounded-xl border-l-4 ${bolum.renk} border border-gray-100 bg-gray-50 p-4`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-700">{bolum.ikon} {bolum.baslik}</span>
                        <span className="text-xs bg-white border border-gray-200 text-gray-400 px-2 py-0.5 rounded-lg">Kopyala</span>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{bolum.icerik}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-5 pt-4 border-t border-gray-100 flex flex-wrap gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[9px]">✓</span>Manuel metin girişi</span>
                  <span className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[9px]">✓</span>Fotoğraftan otomatik analiz</span>
                  <span className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[9px]">✓</span>Barkod ile ürün tanıma</span>
                  <span className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[9px]">✓</span>6 platform desteği</span>
                </div>
              </div>
            )}

            {/* Görsel */}
            {ozellikTab === 1 && (
              <div className="p-5 sm:p-7">
                <p className="text-sm font-semibold text-gray-700 mb-1">Tek fotoğraftan 7 farklı stüdyo stili</p>
                <p className="text-xs text-gray-400 mb-5">Stil başına 1 kredi · Üretimde düşer, indirme bedava</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="flex flex-col">
                    <div className="relative rounded-xl overflow-hidden border-2 border-gray-200 bg-gray-100">
                      <img src="/ornek_once.jpg" alt="önce" className="w-full aspect-square object-contain" />
                      <div className="absolute top-2 left-2"><span className="bg-gray-800/80 text-white text-[10px] px-2 py-1 rounded-full">Ham fotoğraf</span></div>
                    </div>
                    <div className="bg-red-50 rounded-lg p-2 border border-red-100 mt-2">
                      <p className="text-[11px] text-red-600 font-medium">✗ Dağınık arka plan</p>
                    </div>
                  </div>
                  {[
                    { src: "/ornek_beyaz.jpg", etiket: "⬜ Beyaz Zemin" },
                    { src: "/ornek_koyu.jpg", etiket: "⬛ Koyu Zemin" },
                    { src: "/ornek_lifestyle.jpg", etiket: "🏠 Lifestyle" },
                  ].map((item) => (
                    <div key={item.etiket} className="flex flex-col">
                      <div className="rounded-xl overflow-hidden border-2 border-violet-200 bg-gray-50">
                        <img src={item.src} alt={item.etiket} className="w-full aspect-square object-contain" />
                      </div>
                      <p className="text-[11px] text-gray-700 font-semibold text-center mt-1.5">{item.etiket}</p>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
                  {[
                    { src: "/ornek_mermer.jpg", etiket: "🪨 Mermer" },
                    { src: "/ornek_ahsap.jpg", etiket: "🪵 Ahşap" },
                    { src: "/ornek_gradient.jpg", etiket: "🎨 Gradient" },
                    { src: "/ornek_dogal.jpg", etiket: "🌿 Doğal" },
                  ].map((item) => (
                    <div key={item.etiket} className="flex flex-col">
                      <div className="rounded-xl overflow-hidden border-2 border-violet-200 bg-gray-50">
                        <img src={item.src} alt={item.etiket} className="w-full aspect-square object-contain" />
                      </div>
                      <p className="text-[11px] text-gray-700 font-semibold text-center mt-1.5">{item.etiket}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-5 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500 font-medium mb-2">3 farklı yöntemle sahne oluştur:</p>
                  <div className="flex flex-wrap gap-2">
                    {["Hazır stiller (Beyaz, Koyu…)", "Kendi promptunu yaz", "Arka plan fotoğrafı ver"].map((t, i) => (
                      <span key={i} className="text-xs bg-violet-50 text-violet-700 px-3 py-1 rounded-full border border-violet-100">{i + 1}. {t}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Video */}
            {ozellikTab === 2 && (
              <div className="p-5 sm:p-7">
                <p className="text-sm font-semibold text-gray-700 mb-1">Ürün fotoğrafından tanıtım videosu</p>
                <p className="text-xs text-gray-400 mb-5">Ürünü hareket ettiren, platform uyumlu dikey/kare video — MP4 olarak indir</p>

                {/* Hareket örnekleri — video + açıklama yan yana */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                  {[
                    { src: "/video-ornekler/360-donus.mp4", ikon: "🔄", baslik: "360° Dönüş", aciklama: "Ürün kendi ekseni etrafında döner. Tüm açılar görünür. Takı, aksesuar, elektronik için ideal." },
                    { src: "/video-ornekler/zoom-yaklasim.mp4", ikon: "🔍", baslik: "Zoom Yaklaşım", aciklama: "Kamera ürüne doğru yaklaşır. Doku ve detay hissi. El yapımı ve tekstil ürünler için güçlü." },
                    { src: "/video-ornekler/dramatik-isik.mp4", ikon: "💡", baslik: "Dramatik Işık", aciklama: "Karanlık sahnede spotlight açılır. Premium ve lüks his. Kozmetik ve elektronik için etkili." },
                    { src: "/video-ornekler/dogal-ortam.mp4", ikon: "🌿", baslik: "Doğal Ortam", aciklama: "Yapraklar sallanır, ışık oynar. Organik ve sıcak his. Gıda, bitki, doğal ürünler için ideal." },
                  ].map((v, i) => (
                    <div key={i} className="flex gap-3 rounded-xl border border-amber-100 bg-amber-50 p-3">
                      <video
                        src={v.src}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-24 h-24 rounded-lg object-cover flex-shrink-0 bg-black"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-gray-800 mb-1">{v.ikon} {v.baslik}</p>
                        <p className="text-[11px] text-gray-500 leading-relaxed">{v.aciklama}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Süre + format kartları */}
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {[
                    { ikon: "⏱️", baslik: "5 saniyelik", aciklama: "Story · Reels", etiket: "5 kredi" },
                    { ikon: "🎞️", baslik: "10 saniyelik", aciklama: "Showcase · Pazaryeri", etiket: "8 kredi" },
                    { ikon: "📐", baslik: "3 format", aciklama: "9:16 · 1:1 · 16:9", etiket: "Tüm platformlar" },
                  ].map((v, i) => (
                    <div key={i} className="rounded-xl border border-amber-100 bg-amber-50 p-3 text-center">
                      <div className="text-xl mb-1">{v.ikon}</div>
                      <p className="text-xs font-semibold text-gray-800">{v.baslik}</p>
                      <p className="text-[10px] text-gray-400 mb-1">{v.aciklama}</p>
                      <span className="text-[10px] font-semibold text-amber-600 bg-white border border-amber-100 px-1.5 py-0.5 rounded-full">{v.etiket}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs font-semibold text-gray-600 mb-2">Nasıl çalışır?</p>
                  <div className="space-y-1.5">
                    {["Ürün fotoğrafını yükle", "Süre ve format seç", "AI ürünü animasyonlu videoya dönüştürür (~2 dk)", "MP4 olarak indir, platforma yükle"].map((s, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-gray-600">
                        <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-[9px] font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                        {s}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Sosyal Medya */}
            {ozellikTab === 3 && (
              <div className="p-5 sm:p-7">
                <p className="text-sm font-semibold text-gray-700 mb-1">Platform uyumlu caption + hashtag seti</p>
                <p className="text-xs text-gray-400 mb-5">Instagram, TikTok, Facebook, Twitter/X — her platform için ayrı format · 1 kredi</p>

                {/* Platform sekmeleri görünümü */}
                <div className="flex gap-2 mb-4 flex-wrap">
                  {["📸 Instagram", "🎵 TikTok", "👥 Facebook", "🐦 Twitter/X"].map((p) => (
                    <span key={p} className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full font-medium">{p}</span>
                  ))}
                </div>

                {/* Örnek çıktı */}
                <div className="space-y-3">
                  <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-gray-600">📸 Instagram Caption</span>
                      <span className="text-xs bg-white border border-gray-200 text-gray-400 px-2 py-0.5 rounded-lg">Kopyala</span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      Kütahya&apos;nın 500 yıllık geleneğiyle yapılmış bu porselen fincan setini görünce kendinizi bir Osmanlı sarayında hissedeceksiniz ✨☕{"\n\n"}
                      El yapımı çiçek deseni ve altın yaldızlarıyla her sofrayı şölen sofrasına dönüştürün. Sevdiklerinize en güzel hediye — 6 kişilik komple set, özel kutusunda! 🎁
                    </p>
                  </div>
                  <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-gray-600">🏷️ Hashtag Seti</span>
                      <span className="text-xs bg-white border border-gray-200 text-gray-400 px-2 py-0.5 rounded-lg">Kopyala</span>
                    </div>
                    <p className="text-sm text-emerald-700 leading-relaxed">
                      #porselen #kahvefincanı #kütahyaporselen #altınyaldız #hediye #türkkahvesi #elyapımı #fincanSeti #çeyiz #düğünhediyesi #porseleneserleri #handmade
                    </p>
                  </div>
                  <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-gray-600">🐦 Twitter/X (280 karakter)</span>
                      <span className="text-xs bg-white border border-gray-200 text-gray-400 px-2 py-0.5 rounded-lg">Kopyala</span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      Kütahya porseleni + altın yaldız + 6 kişilik set = mükemmel hediye 🎁☕ Her sipariş özel kutusunda geliyor. #porselen #hediye
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 4 İçerik Türü Detay Kartları */}
          <h3 className="text-lg font-bold text-gray-800 mt-8 mb-4">Ne üretebilirsin?</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Listing Metni */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
              <div className="bg-blue-50 px-5 pt-6 pb-4">
                <div className="text-2xl mb-2">📝</div>
                <h3 className="font-bold text-gray-800">Listing Metni</h3>
                <p className="text-xs text-gray-500 mt-1">1 kredi / ürün</p>
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
            {/* Görsel */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
              <div className="bg-violet-50 px-5 pt-6 pb-4">
                <div className="text-2xl mb-2">📷</div>
                <h3 className="font-bold text-gray-800">Stüdyo Görseli</h3>
                <p className="text-xs text-gray-500 mt-1">Stil başına 1 kredi</p>
              </div>
              <div className="p-5 flex-1">
                <p className="text-sm text-gray-600 leading-relaxed mb-3">Tek fotoğraftan 7 farklı stüdyo stili. 1 stil = 1 görsel = 1 kredi.</p>
                <div className="grid grid-cols-3 gap-1.5 mb-3">
                  {[{ src: "/ornek_beyaz.jpg", label: "Beyaz" }, { src: "/ornek_koyu.jpg", label: "Koyu" }, { src: "/ornek_lifestyle.jpg", label: "Lifestyle" }].map(s => (
                    <div key={s.label} className="rounded-lg overflow-hidden">
                      <img src={s.src} alt={s.label} className="w-full aspect-square object-cover rounded-lg" />
                      <p className="text-[9px] text-center text-gray-500 mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400">+ Mermer, Ahşap, Gradient, Doğal</p>
              </div>
            </div>
            {/* Video */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
              <div className="bg-amber-50 px-5 pt-6 pb-4">
                <div className="text-2xl mb-2">🎬</div>
                <h3 className="font-bold text-gray-800">Ürün Videosu</h3>
                <p className="text-xs text-gray-500 mt-1">5sn: 5 kredi · 10sn: 8 kredi</p>
              </div>
              <div className="p-5 flex-1">
                <p className="text-sm text-gray-600 leading-relaxed mb-3">Ürün fotoğrafından profesyonel tanıtım videosu. Reels, TikTok ve pazaryeri için hazır.</p>
                <ul className="space-y-1.5">
                  {["Dikey (9:16) · Reels / TikTok", "Kare (1:1) · Feed / Pazaryeri", "Yatay (16:9) · YouTube"].map(f => (
                    <li key={f} className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-[10px]">✓</span>{f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {/* Sosyal Medya */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
              <div className="bg-emerald-50 px-5 pt-6 pb-4">
                <div className="text-2xl mb-2">📱</div>
                <h3 className="font-bold text-gray-800">Sosyal Medya</h3>
                <p className="text-xs text-gray-500 mt-1">1 kredi / platform seti</p>
              </div>
              <div className="p-5 flex-1">
                <p className="text-sm text-gray-600 leading-relaxed mb-3">Her platform için ayrı caption ve hashtag seti. Ürün fotoğrafından veya metinden üretilir.</p>
                <ul className="space-y-1.5">
                  {["Instagram · Caption + Hashtag", "TikTok · Kısa açıklama", "Facebook · Paylaşım metni", "Twitter/X · Tweet metni"].map(f => (
                    <li key={f} className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px]">✓</span>{f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-8 text-center">
            <button onClick={hemenAlTikla} className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold px-10 py-4 rounded-2xl text-base transition-colors shadow-lg shadow-indigo-100">
              Paket Satın Al — {MIN_FIYAT}₺&apos;den başlıyor
            </button>
            <p className="text-xs text-gray-400 mt-3">veya 3 ücretsiz kredi ile başla, kredi kartı gerekmez</p>
          </div>
        </div>
      </section>

      {/* MARKA PROFİLİ TANITIM */}
      <section className="px-4 sm:px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-3xl border border-indigo-100 p-8 sm:p-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="flex-1">
                <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">✨ Yeni özellik</span>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Marka bilgilerini gir,<br />
                  <span className="text-indigo-500">sana özel içerikler al</span>
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
                <div className="bg-white rounded-2xl shadow-sm border border-indigo-100 p-5 space-y-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Marka Profili</p>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Mağaza adı</p>
                      <div className="bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-2 text-sm text-indigo-700 font-medium">Ayşe Tekstil</div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Metin tonu</p>
                      <div className="flex gap-2">
                        <div className="bg-indigo-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg">Samimi</div>
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
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Dakikalar içinde hazır</h2>
          <p className="text-center text-sm text-gray-400 mb-10">Metin, görsel, video, sosyal medya — hepsi aynı ürün bilgisinden</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { no: "1", ikon: "📦", baslik: "Ürünü tanımla", aciklama: "Ürün adı yaz, fotoğraf yükle ya da barkod tara. YZ ürünü otomatik analiz eder.", renk: "bg-blue-50 text-blue-600" },
              { no: "2", ikon: "🛒", baslik: "Platform seç", aciklama: "Trendyol, Hepsiburada, Amazon TR, N11, Etsy veya Amazon USA. Her platform için ayrı format.", renk: "bg-violet-50 text-violet-600" },
              { no: "3", ikon: "📝", baslik: "Listing metnini al", aciklama: "Optimize başlık, madde madde özellikler, açıklama ve arama etiketleri — tek kredide.", renk: "bg-indigo-50 text-indigo-600" },
              { no: "4", ikon: "📷", baslik: "Görsel üret", aciklama: "7 farklı stüdyo stili. Kendi sahne promptunu yaz ya da arka plan fotoğrafı ver.", renk: "bg-violet-50 text-violet-600" },
              { no: "5", ikon: "🎬", baslik: "Video üret", aciklama: "Ürün fotoğrafından 5sn/10sn tanıtım videosu. Dikey, kare veya yatay format — platforma hazır.", renk: "bg-amber-50 text-amber-600" },
              { no: "6", ikon: "📱", baslik: "Sosyal medya", aciklama: "Instagram, TikTok, Facebook, Twitter/X için caption + hashtag seti. Platform diline göre ayrı içerik.", renk: "bg-emerald-50 text-emerald-600" },
            ].map((adim) => (
              <div key={adim.no} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex gap-4">
                <div className={`w-10 h-10 rounded-xl ${adim.renk} flex items-center justify-center text-xl flex-shrink-0`}>{adim.ikon}</div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${adim.renk}`}>{adim.no}</span>
                    <h3 className="font-semibold text-gray-800 text-sm">{adim.baslik}</h3>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">{adim.aciklama}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ÖZELLİKLER */}
      <section className="px-4 sm:px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-3">Neden yzliste?</h2>
          <p className="text-center text-sm text-gray-400 mb-10">ChatGPT&apos;ye &quot;listing yaz&quot; demekten farkımız</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { ikon: "🧠", baslik: "Pazaryerini bilen AI", aciklama: "Genel AI araçları pazaryeri kurallarını bilmez. yzliste her platformun karakter limiti, yasak kelime ve SEO kuralına göre üretir." },
              { ikon: "📸", baslik: "Fotoğraf yükle, gerisini bırak", aciklama: "Ürün fotoğrafını yükle — AI ürünü tanır, kategori belirler, listing metnini ve görseli otomatik üretir." },
              { ikon: "📦", baslik: "Barkod tara, klavyeye dokunma", aciklama: "Barkodu tarat, ürün bilgilerini veritabanından çek, listing üret — tek tıkla." },
              { ikon: "🎯", baslik: "6 platform, 6 farklı format", aciklama: "Trendyol, Hepsiburada, Amazon TR, N11, Etsy, Amazon USA — her birinin kuralına göre ayrı çıktı." },
              { ikon: "💎", baslik: "Şeffaf kredi sistemi", aciklama: "Kredi üretimde düşer, indirme bedava. Ne kadar harcadığını her zaman görürsün." },
              { ikon: "💰", baslik: "Kullandığın kadar öde", aciklama: "Aylık abonelik yok. 3 ücretsiz kredi ile başla, istediğin zaman paket al." },
            ].map((o, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="text-2xl mb-3">{o.ikon}</div>
                <h3 className="font-semibold text-gray-800 text-sm mb-1">{o.baslik}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{o.aciklama}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-4 sm:px-6 py-12 bg-indigo-50 border-y border-indigo-100 text-center">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Hemen dene</h2>
        <p className="text-sm text-gray-500 mb-6">3 ücretsiz kredi ile listing metni, görsel veya video üret. Kredi kartı gerekmez.</p>
        <Link href="/kayit" className="inline-block bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-8 py-4 rounded-xl text-base transition-colors shadow-lg shadow-indigo-100">
          Ücretsiz Hesap Oluştur →
        </Link>
      </section>

      {/* FOOTER */}
      <SiteFooter />

    </main>
  );
}
  