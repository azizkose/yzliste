"use client";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import SiteFooter from "@/components/SiteFooter";

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
      // ?kayit=1 ile gelindi — modal'ı kayıt modunda aç
      const params = new URLSearchParams(window.location.search);
      if (params.get("kayit") === "1") {
        setModalUyeMod("kayit");
        setModalMod("uye");
        setModalAmac("auth");
        setModalAcik(true);
      } else if (params.get("giris") === "1") {
        setModalUyeMod("giris");
        setModalMod("uye");
        setModalAmac("auth");
        setModalAcik(true);
      }
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
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 flex items-center gap-2">
          <a href="/auth" className="flex-shrink-0 mr-1"><img src="/yzliste_logo.png" alt="yzliste" className="h-8" /></a>
          <nav className="hidden sm:flex items-center gap-0.5 text-xs sm:text-sm text-gray-500 flex-1">
            <a href="/auth" className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-orange-600 font-medium whitespace-nowrap">Ana Sayfa</a>
            <a href="/" className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-gray-100 hover:text-gray-800 transition-colors whitespace-nowrap">İçerik</a>
            <a href="/fiyatlar" className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-gray-100 hover:text-gray-800 transition-colors whitespace-nowrap">Fiyatlar</a>
            <a href="/blog" className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-gray-100 hover:text-gray-800 transition-colors whitespace-nowrap">Blog</a>
          </nav>
          <div className="flex gap-1 sm:gap-2 ml-auto items-center">
            {oturum && !anonimKullanici ? (
              <>
                <a href="/profil" className="hidden sm:block text-xs sm:text-sm text-gray-500 hover:text-gray-800 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap">Profil</a>
                <a href="/" className="hidden sm:block text-xs sm:text-sm bg-orange-500 text-white px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-orange-600 transition-colors font-medium whitespace-nowrap">İçerik Üret →</a>
              </>
            ) : (
              <>
                <button onClick={() => { setModalUyeMod("giris"); setModalMod("uye"); setModalAcik(true); }} className="hidden sm:block text-xs sm:text-sm text-gray-500 hover:text-gray-800 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap">Giriş Yap</button>
                <button onClick={() => { setModalUyeMod("kayit"); setModalMod("uye"); setModalAcik(true); }} className="hidden sm:block text-xs sm:text-sm bg-orange-500 text-white px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-orange-600 transition-colors font-medium whitespace-nowrap">Ücretsiz Başla →</button>
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
              <a href="/auth" onClick={() => setMenuAcik(false)} className="block px-3 py-2 rounded-lg text-sm text-orange-600 font-medium bg-orange-50">Ana Sayfa</a>
              <a href="/" onClick={() => setMenuAcik(false)} className="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors">İçerik</a>
              <a href="/fiyatlar" onClick={() => setMenuAcik(false)} className="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors">Fiyatlar</a>
              <a href="/blog" onClick={() => setMenuAcik(false)} className="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors">Blog</a>
              <div className="border-t border-gray-100 pt-2 mt-2 space-y-1">
                {oturum && !anonimKullanici ? (
                  <>
                    <a href="/profil" className="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors">Profil</a>
                    <a href="/" className="block px-3 py-2 rounded-lg text-sm font-medium bg-orange-500 text-white text-center hover:bg-orange-600 transition-colors">İçerik Üret →</a>
                  </>
                ) : (
                  <>
                    <button onClick={() => { setModalUyeMod("giris"); setModalMod("uye"); setModalAcik(true); setMenuAcik(false); }} className="block w-full text-left px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors">Giriş Yap</button>
                    <button onClick={() => { setModalUyeMod("kayit"); setModalMod("uye"); setModalAcik(true); setMenuAcik(false); }} className="block w-full text-center px-3 py-2 rounded-lg text-sm font-medium bg-orange-500 text-white hover:bg-orange-600 transition-colors">Ücretsiz Başla →</button>
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
          <span className="inline-block bg-orange-100 text-orange-700 text-xs font-semibold px-3 py-1.5 rounded-full tracking-wide">Trendyol · Hepsiburada · Amazon · N11 · Etsy</span>
          <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full tracking-wide">🆕 Video + Sosyal Medya</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-5">
          Ürünün için her içeriği<br />
          <span className="text-orange-500">tek platformda üret</span>
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
          <button onClick={() => { setModalUyeMod("kayit"); setModalMod("uye"); setModalAcik(true); }} className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-4 rounded-xl text-base transition-colors shadow-lg shadow-orange-100">
            Ücretsiz Başla — 3 Kredi Hediye →
          </button>
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
                aciklama: "7 stil, her stilden 4 varyasyon",
                kredi: "Stil başına 1 kredi",
                renk: "purple",
                ring: "ring-purple-400",
                bg: "bg-purple-50",
                badge: "text-purple-600 bg-purple-100",
              },
              {
                idx: 2,
                ikon: "🎬",
                baslik: "Video",
                aciklama: "Ürün tanıtım videosu, 1080p",
                kredi: "5sn veya 10sn",
                renk: "pink",
                ring: "ring-pink-400",
                bg: "bg-pink-50",
                badge: "text-pink-600 bg-pink-100",
              },
              {
                idx: 3,
                ikon: "📱",
                baslik: "Sosyal Medya",
                aciklama: "Caption + hashtag, tüm platformlar",
                kredi: "1 kredi",
                renk: "green",
                ring: "ring-green-400",
                bg: "bg-green-50",
                badge: "text-green-600 bg-green-100",
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
                  <span className="w-2 h-2 rounded-full bg-orange-400 flex-shrink-0" />
                  <span className="text-xs font-semibold text-orange-700">Trendyol formatında örnek çıktı</span>
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
                <p className="text-xs text-gray-400 mb-5">İnceleme ücretsiz — beğendiğini indirince 1 kredi düşer · Her stilden 4 varyasyon</p>
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
                      <div className="rounded-xl overflow-hidden border-2 border-green-200 bg-gray-50">
                        <img src={item.src} alt={item.etiket} className="w-full aspect-square object-contain" />
                      </div>
                      <div className="bg-green-50 rounded-lg p-2 border border-green-100 mt-2">
                        <p className="text-[11px] text-gray-700 font-semibold">{item.etiket}</p>
                        <p className="text-[10px] text-green-500 mt-0.5">4 varyasyon</p>
                      </div>
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
                      <div className="rounded-xl overflow-hidden border-2 border-green-200 bg-gray-50">
                        <img src={item.src} alt={item.etiket} className="w-full aspect-square object-contain" />
                      </div>
                      <div className="bg-green-50 rounded-lg p-2 border border-green-100 mt-2">
                        <p className="text-[11px] text-gray-700 font-semibold">{item.etiket}</p>
                        <p className="text-[10px] text-green-500 mt-0.5">4 varyasyon</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-5 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500 font-medium mb-2">3 farklı yöntemle sahne oluştur:</p>
                  <div className="flex flex-wrap gap-2">
                    {["Hazır stiller (Beyaz, Koyu…)", "Kendi promptunu yaz", "Arka plan fotoğrafı ver"].map((t, i) => (
                      <span key={i} className="text-xs bg-purple-50 text-purple-700 px-3 py-1 rounded-full border border-purple-100">{i + 1}. {t}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Video */}
            {ozellikTab === 2 && (
              <div className="p-5 sm:p-7">
                <p className="text-sm font-semibold text-gray-700 mb-1">Ürün fotoğrafından tanıtım videosu</p>
                <p className="text-xs text-gray-400 mb-6">Ürünü hareket ettiren, platform uyumlu dikey/kare video — MP4 olarak indir</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    {
                      ikon: "⏱️",
                      baslik: "5 saniyelik video",
                      aciklama: "Hızlı tanıtım, story ve reels için ideal. Ürün hareketi + efekt.",
                      etiket: "5 kredi",
                      renkBg: "bg-pink-50",
                      renkBorder: "border-pink-100",
                      renkText: "text-pink-600",
                    },
                    {
                      ikon: "🎬",
                      baslik: "10 saniyelik video",
                      aciklama: "Detay gösterimi, özellik vurgusu, ürün döndürme efekti.",
                      etiket: "8 kredi",
                      renkBg: "bg-pink-50",
                      renkBorder: "border-pink-100",
                      renkText: "text-pink-600",
                    },
                    {
                      ikon: "📐",
                      baslik: "Format seçimi",
                      aciklama: "Dikey (9:16 · Reels/TikTok), Kare (1:1 · Feed), Yatay (16:9 · YouTube).",
                      etiket: "Çok format",
                      renkBg: "bg-pink-50",
                      renkBorder: "border-pink-100",
                      renkText: "text-pink-600",
                    },
                  ].map((v, i) => (
                    <div key={i} className={`rounded-xl border ${v.renkBorder} ${v.renkBg} p-4`}>
                      <div className="text-2xl mb-2">{v.ikon}</div>
                      <p className="text-sm font-semibold text-gray-800 mb-1">{v.baslik}</p>
                      <p className="text-xs text-gray-500 leading-relaxed mb-2">{v.aciklama}</p>
                      <span className={`text-[11px] font-semibold ${v.renkText} bg-white border ${v.renkBorder} px-2 py-0.5 rounded-full`}>{v.etiket}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-5 pt-4 border-t border-gray-100 bg-gray-50 rounded-xl p-4">
                  <p className="text-xs font-semibold text-gray-600 mb-2">Nasıl çalışır?</p>
                  <div className="space-y-1.5">
                    {[
                      "Ürün fotoğrafını yükle",
                      "Süre ve format seç (5sn / 10sn · dikey / kare / yatay)",
                      "AI ürünü animasyonlu videoya dönüştürür",
                      "MP4 olarak indir, platforma yükle",
                    ].map((s, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-gray-600">
                        <span className="w-4 h-4 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center text-[9px] font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
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
                    <span key={p} className="text-xs bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-full font-medium">{p}</span>
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
                    <p className="text-sm text-green-700 leading-relaxed">
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

          {/* Kredi bilgisi */}
          <div className="mt-6 bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Kredi nasıl çalışır?</h3>
            <ul className="space-y-2">
              {[
                { ikon: "🎁", metin: "Kayıt olunca 3 ücretsiz kredi — kredi kartı gerekmez." },
                { ikon: "📝", metin: "Listing metni: 1 kredi → başlık + özellikler + açıklama + etiketler" },
                { ikon: "📷", metin: "Görsel: stil başına 1 kredi → 4 varyasyon. İnceleme ücretsiz, indirince düşer." },
                { ikon: "🎬", metin: "Video: 5sn veya 10sn — kredi miktarı süreye göre" },
                { ikon: "📱", metin: "Sosyal medya: 1 kredi → caption + hashtag seti, tüm platformlar" },
              ].map((m, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-500">
                  <span className="text-base flex-shrink-0">{m.ikon}</span>
                  <span>{m.metin}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 text-center">
            <button onClick={hemenAlTikla} className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-10 py-4 rounded-2xl text-base transition-colors shadow-lg shadow-orange-100">
              Paket Satın Al — 29₺&apos;den başlıyor
            </button>
            <p className="text-xs text-gray-400 mt-3">veya 3 ücretsiz kredi ile başla, kredi kartı gerekmez</p>
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
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Dakikalar içinde hazır</h2>
          <p className="text-center text-sm text-gray-400 mb-10">Metin, görsel, video, sosyal medya — hepsi aynı ürün bilgisinden</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { no: "1", ikon: "📦", baslik: "Ürünü tanımla", aciklama: "Ürün adı yaz, fotoğraf yükle ya da barkod tara. YZ ürünü otomatik analiz eder.", renk: "bg-blue-50 text-blue-600" },
              { no: "2", ikon: "🛒", baslik: "Platform seç", aciklama: "Trendyol, Hepsiburada, Amazon TR, N11, Etsy veya Amazon USA. Her platform için ayrı format.", renk: "bg-purple-50 text-purple-600" },
              { no: "3", ikon: "📝", baslik: "Listing metnini al", aciklama: "Optimize başlık, madde madde özellikler, açıklama ve arama etiketleri — tek kredide.", renk: "bg-orange-50 text-orange-600" },
              { no: "4", ikon: "📷", baslik: "Görsel üret", aciklama: "7 farklı stüdyo stili. Kendi sahne promptunu yaz ya da arka plan fotoğrafı ver.", renk: "bg-green-50 text-green-600" },
              { no: "5", ikon: "🎬", baslik: "Video üret", aciklama: "Ürün fotoğrafından 5sn/10sn tanıtım videosu. Dikey, kare veya yatay format — platforma hazır.", renk: "bg-pink-50 text-pink-600" },
              { no: "6", ikon: "📱", baslik: "Sosyal medya", aciklama: "Instagram, TikTok, Facebook, Twitter/X için caption + hashtag seti. Platform diline göre ayrı içerik.", renk: "bg-teal-50 text-teal-600" },
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
          <p className="text-center text-sm text-gray-400 mb-10">Rakipler tek bir şey yapar. yzliste dördünü birden yapar.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { ikon: "📸", baslik: "Fotoğraftan analiz", aciklama: "Ürün fotoğrafını yükle, YZ ürünü tanısın, listing metnini otomatik oluştursun." },
              { ikon: "📦", baslik: "Barkod tarama", aciklama: "Barkodu tarat, ürün bilgilerini veritabanından çek, listing üret — klavyeye gerek yok." },
              { ikon: "🎯", baslik: "6 platform desteği", aciklama: "Trendyol, Hepsiburada, Amazon TR, N11, Etsy, Amazon USA — her platform için ayrı format." },
              { ikon: "📷", baslik: "7 stilden görsel", aciklama: "Beyaz, koyu, lifestyle, mermer, ahşap, gradient, doğal — her stilden 4 varyasyon." },
              { ikon: "🎬", baslik: "Ürün videosu", aciklama: "5sn veya 10sn tanıtım videosu. Dikey/kare/yatay format. Reels, TikTok ve pazaryeri için hazır." },
              { ikon: "📱", baslik: "Sosyal medya içeriği", aciklama: "Instagram, TikTok, Facebook, Twitter/X için ayrı caption + hashtag seti." },
              { ikon: "💎", baslik: "Görsel kredi garantisi", aciklama: "Görsel üretilir, beğenmezsen indirmezsin — kredin yanmaz." },
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

      {/* SOSYAL KANIT / TESTİMONY */}
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
          <div className="hidden grid grid-cols-1 sm:grid-cols-3 gap-4">
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
          <div className="mt-10 text-center">
            <button onClick={() => { setModalUyeMod("kayit"); setModalMod("uye"); setModalAcik(true); }} className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-4 rounded-xl text-base transition-colors shadow-lg shadow-orange-100">
              Ücretsiz Hesap Oluştur →
            </button>
            <p className="text-xs text-gray-400 mt-3">3 ücretsiz içerik üretim kredisi · Kredi kartı gerekmez</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <SiteFooter />

    </main>
  );
}
