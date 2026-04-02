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
  const [ornekAcik, setOrnekAcik] = useState(false);
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
    if (hata.includes("Password should be at least 6 characters")) return "Sifre en az 6 karakter olmalidir.";
    if (hata.includes("Invalid login credentials")) return "E-posta veya sifre hatali.";
    if (hata.includes("Email not confirmed")) return "E-posta adresinizi dogrulayin.";
    if (hata.includes("User already registered")) return "Bu e-posta adresi zaten kayitli.";
    if (hata.includes("invalid") && hata.includes("email")) return "Gecerli bir e-posta adresi giriniz.";
    if (hata.includes("rate limit") || hata.includes("too many")) return "Cok fazla deneme yapildi. Lutfen biraz bekleyin.";
    return "Bir hata olustu. Lutfen tekrar deneyin.";
  };

  const handleSubmit = async () => {
    if (!email.trim()) { setMesaj("E-posta adresi giriniz."); return; }
    if (!sifre.trim()) { setMesaj("Sifre giriniz."); return; }
    if (mod === "kayit" && !sozlesmeOnay) { setMesaj("Devam etmek icin sozlesmeleri kabul etmelisiniz."); return; }
    setYukleniyor(true);
    setMesaj("");
    if (mod === "kayit") {
      const { error } = await supabase.auth.signUp({ email, password: sifre });
      if (error) setMesaj(turkceHata(error.message));
      else setMesaj("Kayit basarili! E-postanizi dogrulayin.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password: sifre });
      if (error) setMesaj("E-posta veya sifre hatali.");
      else router.push("/");
    }
    setYukleniyor(false);
  };

  const handleSifreSifirla = async () => {
    if (!email.trim()) {
      setMesaj("Once e-posta adresinizi girin, sonra sifremi unuttum'a basin.");
      return;
    }
    setSifreSifirlamaYukleniyor(true);
    setMesaj("");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/sifre-sifirla`,
    });
    if (error) {
      setMesaj("Sifre sifirlama e-postasi gonderilemedi. Tekrar deneyin.");
    } else {
      setSifreSifirlamaGonderildi(true);
      setMesaj("");
    }
    setSifreSifirlamaYukleniyor(false);
  };

  const handleModDegistir = (yeniMod: "giris" | "kayit") => {
    setMod(yeniMod);
    setEmail("");
    setSifre("");
    setMesaj("");
    setSozlesmeOnay(false);
    setSifreSifirlamaGonderildi(false);
  };

  const hemenAlTikla = () => {
    if (oturum) { setModalMod("paket"); } else { setModalMod("uye"); }
    setModalAcik(true);
    setOdemeForm(null);
    setSeciliPaket(null);
    setModalMesaj("");
  };

  const modalUyeGiris = async () => {
    if (!modalEmail.trim()) { setModalMesaj("E-posta giriniz."); return; }
    if (!modalSifre.trim()) { setModalMesaj("Sifre giriniz."); return; }
    if (modalUyeMod === "kayit" && !modalSozlesme) { setModalMesaj("Sozlesmeleri kabul etmelisiniz."); return; }
    setModalYukleniyor(true);
    setModalMesaj("");
    if (modalUyeMod === "kayit") {
      const { error } = await supabase.auth.signUp({ email: modalEmail, password: modalSifre });
      if (error) { setModalMesaj(turkceHata(error.message)); }
      else { setModalMesaj("Kayit basarili! E-postanizi dogrulayin."); }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email: modalEmail, password: modalSifre });
      if (error) { setModalMesaj("E-posta veya sifre hatali."); }
      else { setOturum(true); setModalMod("paket"); setModalMesaj(""); }
    }
    setModalYukleniyor(false);
  };

  const odemeBaslat = async (paket: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setModalMod("uye"); return; }
    setSeciliPaket(paket);
    setOdemeYukleniyor(true);
    setOdemeForm(null);
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
      } else {
        setModalMesaj(data.hata || "Odeme baslatılamadı.");
      }
    } catch {
      setModalMesaj("Bir hata olustu, tekrar deneyin.");
    }
    setOdemeYukleniyor(false);
  };

  const ornekMetin = `📌 BAŞLIK: Kutahya Porselen Cicek Desenli Kahve Fincani 6'li Set | 80ml | Altin Yaldizli | Dishwasher Safe 🔹 OZELLIKLER: • Birinci Kalite Porselen — Kursunuz, gida guvenlimateryal; keskin ve ince yapi sayesinde zarif sunum saglar. • 80ml Espresso Hacmi — Turk kahvesi, espresso ve menengic kahvesi icin ideal boyut. • El Yapimi Cicek Deseni + Altin Yaldiz — Her fincan benzersiz baskiyla islenmis. • 6 Kisilik Komple Set — Fincan ve tabaklar dahil, ozel hediye kutusunda teslim. • Bulasik Makinesine Uyumlu — Yaldizlar bozulmadan yikanabilir. 📄 ACIKLAMA: Kutahya'nin 500 yillik porselen geleneginden ilham alarak tasarlanan bu 6'li fincan seti... 🏷️ ARAMA ETIKETLERI: porselen fincan seti, kahve fincani hediye, kutahya porselen, altin yaldizli fincan`;

  const paketler = [
    { id: "baslangic", isim: "Baslangic", fiyat: "₺29", kredi: "10 kullanim hakki", renk: "border-gray-200", butonRenk: "bg-gray-800 hover:bg-gray-900" },
    { id: "populer", isim: "Populer", fiyat: "₺79", kredi: "30 kullanim hakki", renk: "border-orange-400 ring-2 ring-orange-400", butonRenk: "bg-orange-500 hover:bg-orange-600", rozet: true },
    { id: "buyuk", isim: "Buyuk", fiyat: "₺149", kredi: "100 kullanim hakki", renk: "border-gray-200", butonRenk: "bg-gray-800 hover:bg-gray-900" },
  ];

  return (
    <main className="min-h-screen bg-white font-sans">

      {/* MODAL */}
      {modalAcik && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) setModalAcik(false); }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">
                {modalMod === "uye" ? (modalUyeMod === "kayit" ? "Hesap Olustur" : "Giris Yap") : "Paket Sec"}
              </h2>
              <button onClick={() => setModalAcik(false)} className="text-gray-400 hover:text-gray-600 text-2xl">x</button>
            </div>
            {modalMod === "uye" ? (
              <div className="p-6 space-y-4">
                <p className="text-sm text-gray-500">Devam etmek icin hesabiniza giris yapin veya ucretsiz kayit olun.</p>
                <div className="flex gap-2">
                  <button onClick={() => setModalUyeMod("kayit")} className={`flex-1 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${modalUyeMod === "kayit" ? "bg-orange-500 text-white border-orange-500" : "bg-white text-orange-500 border-orange-200"}`}>Kayit Ol</button>
                  <button onClick={() => setModalUyeMod("giris")} className={`flex-1 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${modalUyeMod === "giris" ? "bg-gray-800 text-white border-gray-800" : "bg-white text-gray-600 border-gray-200"}`}>Giris Yap</button>
                </div>
                <input type="email" placeholder="E-posta" value={modalEmail} onChange={(e) => setModalEmail(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
                <input type="password" placeholder="Sifre" value={modalSifre} onChange={(e) => setModalSifre(e.target.value)} onKeyDown={(e) => e.key === "Enter" && modalUyeGiris()} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
                {modalUyeMod === "kayit" && (
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" checked={modalSozlesme} onChange={(e) => setModalSozlesme(e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-gray-300 text-orange-500 flex-shrink-0" />
                    <span className="text-xs text-gray-500 leading-relaxed">
                      <a href="/gizlilik" target="_blank" className="text-orange-500 hover:underline">Gizlilik Politikasi</a> ve <a href="/mesafeli-satis" target="_blank" className="text-orange-500 hover:underline">Mesafeli Satis Sozlesmesi</a> okudum, kabul ediyorum.
                    </span>
                  </label>
                )}
                {modalMesaj && <p className={`text-xs ${modalMesaj.includes("basarili") ? "text-green-600" : "text-red-500"}`}>{modalMesaj}</p>}
                <button onClick={modalUyeGiris} disabled={modalYukleniyor || (modalUyeMod === "kayit" && !modalSozlesme)} className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white font-semibold py-3 rounded-xl text-sm transition-colors">
                  {modalYukleniyor ? "..." : modalUyeMod === "kayit" ? "Ucretsiz Hesap Olustur" : "Giris Yap"}
                </button>
              </div>
            ) : !odemeForm ? (
              <div className="p-6 space-y-4">
                {paketler.map((p) => (
                  <div key={p.id} className={`border-2 ${p.renk} rounded-2xl p-5 relative`}>
                    {p.rozet && <span className="absolute -top-3 left-4 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">En Populer</span>}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-800">{p.isim}</p>
                        <p className="text-sm text-gray-500">{p.kredi}</p>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">{p.fiyat}</p>
                    </div>
                    <button onClick={() => odemeBaslat(p.id)} disabled={odemeYukleniyor} className={`w-full mt-4 ${p.butonRenk} text-white font-semibold py-2.5 rounded-xl text-sm transition-colors disabled:bg-gray-300`}>
                      {odemeYukleniyor && seciliPaket === p.id ? "Yukleniyor..." : "Satin Al"}
                    </button>
                  </div>
                ))}
                {modalMesaj && <p className="text-xs text-red-500">{modalMesaj}</p>}
                <p className="text-xs text-gray-400 text-center">Guvenli odeme — iyzico altyapisi</p>
              </div>
            ) : (
              <div className="p-4">
                <div ref={odemeRef} id="iyzipay-checkout-form" className="popup" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-100 px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <a href="/auth"><img src="/yzliste_logo.png" alt="yzliste" className="h-8" /></a>
          <div className="flex gap-2">
            <button onClick={() => { handleModDegistir("giris"); document.getElementById("auth-form")?.scrollIntoView({ behavior: "smooth" }); }} className="text-sm text-gray-500 hover:text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">Giris Yap</button>
            <button onClick={() => { handleModDegistir("kayit"); document.getElementById("auth-form")?.scrollIntoView({ behavior: "smooth" }); }} className="text-sm bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors font-medium">Ucretsiz Basla</button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="px-6 pt-16 pb-10 text-center max-w-3xl mx-auto">
        <span className="inline-block bg-orange-100 text-orange-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-5 tracking-wide uppercase">Trendyol · Hepsiburada · Amazon TR · N11</span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-5">
          E-ticaret listing icin<br />
          <span className="text-orange-500">en kolay cozum</span>
        </h1>
        <p className="text-lg text-gray-500 mb-4 max-w-2xl mx-auto leading-relaxed">
          Platforma urun yuklemek icin hem <strong className="text-gray-700">optimize metin</strong> hem de <strong className="text-gray-700">profesyonel gorsel</strong> gerekir. yzliste ikisini de tek yerden, ayri ayri veya birlikte uretir.
        </p>
        <p className="text-sm text-gray-400 mb-8 max-w-xl mx-auto">Ister aciklama gir, ister urun fotografini yukle ya da barkod tara — gerisini YZ halleder.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => { handleModDegistir("kayit"); document.getElementById("auth-form")?.scrollIntoView({ behavior: "smooth" }); }}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-4 rounded-xl text-base transition-colors shadow-lg shadow-orange-100"
          >
            3 Ucretsiz Hakla Basla
          </button>
          <button
            onClick={() => document.getElementById("nasil-calisir")?.scrollIntoView({ behavior: "smooth" })}
            className="text-gray-500 hover:text-gray-700 font-medium px-8 py-4 rounded-xl text-base transition-colors underline underline-offset-4"
          >
            Nasil calisir?
          </button>
        </div>
      </section>

      {/* 3 SECNEK KUTUSU */}
      <section className="px-6 pb-16 bg-gray-50">
        <div className="max-w-5xl mx-auto pt-14">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Neye ihtiyacin var?</h2>
          <p className="text-center text-sm text-gray-400 mb-6">Metin, gorsel ya da her ikisi — ayri ayri veya birlikte kullanabilirsin</p>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-8 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Kullanim hakki nasil calisir?</h3>
            <ul className="space-y-2">
              {[
                { ikon: "🎁", metin: "Kayit olunca 3 ucretsiz kullanim hakki hediye edilir — kredi karti gerekmez." },
                { ikon: "📝", metin: "Her listing metni uretimi 1 hak tuketir. Baslik, ozellikler, aciklama ve etiketlerin tamami tek hakla gelir." },
                { ikon: "🖼️", metin: "Gorsel uretimi stil basina 1 hak tuketir. Her stilden 4 varyasyon uretilir — begenmezsen hak dusmez, sadece indirince duser." },
                { ikon: "💳", metin: "Haklar biter bitmez istedigin paketi satin al. 29TL'den baslayan paketler, abonelik yok." },
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
                <p className="text-xs text-gray-500 mt-1">1 kullanim hakki</p>
              </div>
              <div className="p-5 space-y-3 flex-1">
                <p className="text-sm text-gray-600 leading-relaxed">Platforma ozel optimize baslik, madde madde ozellikler, satisa donen aciklama ve arama etiketleri — hazir yapistir formatinda.</p>
                <ul className="space-y-1.5">
                  {["Manuel metin girisi", "Fotograftan otomatik analiz", "Barkod ile urun tanima"].map(f => (
                    <li key={f} className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px]">v</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
              <div className="bg-purple-50 px-5 pt-6 pb-4">
                <div className="text-2xl mb-2">🖼️</div>
                <h3 className="font-bold text-gray-800">Sadece Gorsel</h3>
                <p className="text-xs text-gray-500 mt-1">Stil basina 1 hak · Her stilden 4 varyasyon</p>
              </div>
              <div className="p-5 space-y-3 flex-1">
                <p className="text-sm text-gray-600 leading-relaxed">Tek fotograftan 3 farkli stilde studyo gorseli. Beyazi Trendyol'a, koyuyu one cikan urune, lifestyle'i sosyal medyaya kullan.</p>
                <div className="grid grid-cols-3 gap-1.5">
                  {[{ src: "/ornek_beyaz.jpg", label: "Beyaz" }, { src: "/ornek_koyu.jpg", label: "Koyu" }, { src: "/ornek_lifestyle.jpg", label: "Lifestyle" }].map(s => (
                    <div key={s.label} className="relative rounded-lg overflow-hidden">
                      <img src={s.src} alt={s.label} className="w-full aspect-square object-cover" />
                      <span className="absolute bottom-0 inset-x-0 bg-black/40 text-white text-[9px] text-center py-0.5">{s.label}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400">Begendigi indir — hak yalnizca indirmede duser</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border-2 border-orange-200 shadow-sm overflow-hidden flex flex-col">
              <div className="bg-orange-50 px-5 pt-6 pb-4">
                <div className="text-2xl mb-2">✨</div>
                <h3 className="font-bold text-gray-800">Metin + Gorsel</h3>
                <p className="text-xs text-gray-500 mt-1">Ayri ayri kullanim hakki · En yuksek deger</p>
              </div>
              <div className="p-5 space-y-3 flex-1">
                <p className="text-sm text-gray-600 leading-relaxed">Trendyol ve Hepsiburada'da hem metin hem gorsel zorunlu. Ikisini ayni anda uret, platforma hazir hale gel.</p>
                <div className="space-y-2">
                  {[
                    { no: "1", text: "Optimize listing metni (baslik + ozellik + aciklama + etiket)" },
                    { no: "2", text: "Sectigin stilde 4 studyo gorseli — begendigi indir" },
                    { no: "3", text: "Platforma hazir, duzenleme gerektirmez" },
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

          <div className="mt-8 text-center">
            <button onClick={hemenAlTikla} className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-10 py-4 rounded-2xl text-base transition-colors shadow-lg shadow-orange-100">
              Paket Satin Al — 29TL'den basliyor
            </button>
            <p className="text-xs text-gray-400 mt-3">veya 3 ucretsiz hakla basla, kredi karti gerekmez</p>
          </div>
        </div>
      </section>

      {/* GORSEL ONCE/SONRA */}
      <section className="px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Tek fotograftan 3 farkli studyo gorseli</h2>
          <p className="text-center text-sm text-gray-400 mb-3">AI arka plani kaldirir, istedigin ortama yerlestir — her stilden 4 varyasyon</p>
          <p className="text-center text-xs text-orange-600 font-medium mb-10">Istersen kendi prompt'unu da girebilirsin: "ahsap zemin, sonbahar tonlari, minimalist..."</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="space-y-2">
              <div className="relative rounded-2xl overflow-hidden border-2 border-gray-300">
                <img src="/ornek_once.jpg" alt="once" className="w-full aspect-square object-cover" />
                <div className="absolute top-2 left-2">
                  <span className="bg-gray-800/80 text-white text-[10px] px-2 py-1 rounded-full">Ham fotograf</span>
                </div>
              </div>
              <div className="bg-red-50 rounded-xl p-2.5 border border-red-100">
                <p className="text-[11px] text-red-600 font-medium">x Dagini arka plan</p>
                <p className="text-[10px] text-red-400 mt-0.5">Platform reddedebilir</p>
              </div>
            </div>
            {[
              { src: "/ornek_beyaz.jpg", etiket: "Beyaz Zemin", aciklama: "v Trendyol standart" },
              { src: "/ornek_koyu.jpg", etiket: "Koyu Zemin", aciklama: "v Premium his" },
              { src: "/ornek_lifestyle.jpg", etiket: "Lifestyle", aciklama: "v Dogal ortam" },
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
                  <p className="text-[10px] text-green-400 mt-0.5">4 varyasyon uretilir</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ORNEK LISTING */}
      <section className="px-6 py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Boyle bir metin alirsin</h2>
          <p className="text-center text-sm text-gray-400 mb-8">Gercek bir Trendyol listing ornegi — sifir duzenleme, direkt yapistir</p>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-orange-50">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-400" />
                <span className="text-xs font-semibold text-orange-700">Trendyol formatinda ornek cikti</span>
              </div>
              <button onClick={() => setOrnekAcik(!ornekAcik)} className="text-xs text-orange-600 hover:text-orange-800 font-medium">{ornekAcik ? "Kucult" : "Tumunu gor"}</button>
            </div>
            <div className={`overflow-hidden transition-all duration-300 ${ornekAcik ? "max-h-none" : "max-h-48"}`}>
              <pre className="p-5 text-xs text-gray-700 leading-relaxed whitespace-pre-wrap font-mono">{ornekMetin}</pre>
            </div>
            {!ornekAcik && <div className="h-12 bg-gradient-to-t from-white to-transparent -mt-12 relative pointer-events-none" />}
          </div>
        </div>
      </section>

      {/* NASIL CALISIR */}
      <section id="nasil-calisir" className="px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-10">4 adimda hazir</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {[
              { no: "1", ikon: "📦", baslik: "Urunu tanimla", aciklama: "Urun adi yaz, fotograf yukle ya da barkod tara. Hangi yontemi secersen sec, YZ analiz eder." },
              { no: "2", ikon: "🛒", baslik: "Platform sec", aciklama: "Trendyol, Hepsiburada, Amazon TR veya N11. Her platform icin ayri format ve karakter limitleri uygulanir." },
              { no: "3", ikon: "📝", baslik: "Listing metnini al", aciklama: "Optimize baslik, madde madde ozellikler, satisa donen aciklama ve arama etiketleri — direkt kopyala yapistir." },
              { no: "4", ikon: "🖼️", baslik: "Gorsel uret", aciklama: "Istersen ayni fotograftan 3 stilde studyo gorseli cikar. Kendi prompt'unu girerek sonucu yonlendir." },
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

      {/* OZELLIKLER */}
      <section className="px-6 py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-10">Neden yzliste?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { ikon: "📸", baslik: "Fotograftan analiz", aciklama: "Urun fotografini yukle, YZ urunu tanisın ve listing metnini otomatik olustur. Elle yazmaya gerek yok." },
              { ikon: "📦", baslik: "Barkod tarama", aciklama: "Barkodu tarat, urun bilgilerini veritabanindan cek, listing uret. Depo hizinda calis." },
              { ikon: "🎯", baslik: "Platform sablonlari", aciklama: "Trendyol, Hepsiburada, Amazon TR ve N11 icin ayri format. Karakter sinirlari otomatik uygulanir." },
              { ikon: "🖼️", baslik: "AI gorsel + prompt", aciklama: "Beyaz zemin, koyu zemin, lifestyle — her stilden 4 varyasyon. Istersen kendi sahneni yaz, AI uygular." },
              { ikon: "💎", baslik: "Hak sadece indirmede duser", aciklama: "Gorsel uretilir, begenmezsen hakkini kaybetmezsin. Yalnizca indirdigin gorsel icin hak duser." },
              { ikon: "💰", baslik: "Kullandigin kadar ode", aciklama: "Aylik abonelik yok. Urettigin kadar ode. 3 ucretsiz hakla basla, ihtiyacin kadar devam et." },
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
                {mod === "kayit" ? "Ucretsiz hesap olustur" : "Tekrar hos geldin"}
              </h2>
              <p className="text-sm text-gray-400">
                {mod === "kayit" ? "3 ucretsiz kullanim hakki hediye" : "Hesabina giris yap"}
              </p>
            </div>

            {sifreSifirlamaGonderildi ? (
              <div className="text-center space-y-4 py-4">
                <div className="text-4xl">📧</div>
                <p className="text-sm font-semibold text-gray-800">Sifre sifirlama e-postasi gonderildi</p>
                <p className="text-xs text-gray-500 leading-relaxed">
                  <strong>{email}</strong> adresine sifre sifirlama baglantisi gonderdik. E-postanizi kontrol edin.
                </p>
                <button
                  onClick={() => { setSifreSifirlamaGonderildi(false); setMod("giris"); }}
                  className="text-xs text-orange-500 hover:text-orange-700 underline"
                >
                  Giris sayfasina don
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="E-posta"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                />
                <div className="space-y-1">
                  <input
                    type="password"
                    placeholder="Sifre"
                    value={sifre}
                    onChange={(e) => setSifre(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    autoComplete={mod === "kayit" ? "new-password" : "current-password"}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                  />
                  {mod === "giris" && (
                    <div className="flex justify-end">
                      <button
                        onClick={handleSifreSifirla}
                        disabled={sifreSifirlamaYukleniyor}
                        className="text-xs text-gray-400 hover:text-orange-500 transition-colors disabled:opacity-50"
                      >
                        {sifreSifirlamaYukleniyor ? "Gonderiliyor..." : "Sifremi unuttum"}
                      </button>
                    </div>
                  )}
                </div>
                {mod === "kayit" && (
                  <label className="flex items-start gap-3 cursor-pointer mt-1">
                    <input
                      type="checkbox"
                      checked={sozlesmeOnay}
                      onChange={(e) => setSozlesmeOnay(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-400 cursor-pointer flex-shrink-0"
                    />
                    <span className="text-xs text-gray-500 leading-relaxed">
                      <a href="/gizlilik" target="_blank" className="text-orange-500 hover:underline font-medium">Gizlilik Politikasi</a>{" "}ve{" "}
                      <a href="/mesafeli-satis" target="_blank" className="text-orange-500 hover:underline font-medium">Mesafeli Satis Sozlesmesi</a>{" "}ile{" "}
                      <a href="/teslimat-iade" target="_blank" className="text-orange-500 hover:underline font-medium">Teslimat ve Iade Sartlari</a>'ni okudum ve kabul ediyorum.
                    </span>
                  </label>
                )}
                {mesaj && (
                  <p className={`text-xs ${mesaj.includes("basarili") ? "text-green-600" : "text-red-500"}`}>
                    {mesaj}
                  </p>
                )}
                <button
                  onClick={handleSubmit}
                  disabled={yukleniyor || (mod === "kayit" && !sozlesmeOnay)}
                  className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
                >
                  {yukleniyor ? "..." : mod === "kayit" ? "Ucretsiz Hesap Olustur" : "Giris Yap"}
                </button>
              </div>
            )}

            {!sifreSifirlamaGonderildi && (
              <>
                {mod === "kayit" && <p className="text-xs text-gray-400 text-center mt-4">Kayit olunca 3 ucretsiz kullanim hakki alirsiniz</p>}
                <div className="text-center mt-5 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => handleModDegistir(mod === "giris" ? "kayit" : "giris")}
                    className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {mod === "giris" ? "Hesabin yok mu? Kaydol" : "Zaten hesabin var mi? Giris yap"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-100 px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-400">
            <a href="/hakkimizda" className="hover:text-orange-500">Hakkimizda</a>
            <span>·</span>
            <a href="/gizlilik" className="hover:text-orange-500">Gizlilik Politikasi</a>
            <span>·</span>
            <a href="/mesafeli-satis" className="hover:text-orange-500">Mesafeli Satis Sozlesmesi</a>
            <span>·</span>
            <a href="/teslimat-iade" className="hover:text-orange-500">Teslimat ve Iade</a>
            <span>·</span>
            <a href="mailto:destek@yzliste.com" className="hover:text-orange-500">destek@yzliste.com</a>
          </div>
          <div className="flex justify-center">
            <img src="/iyzico_footer_logo.png" alt="iyzico ile ode" className="h-10" />
          </div>
          <p className="text-center text-xs text-gray-400">2026 yzliste · SIMOON PAZARLAMA VE DANISMANLIK LIMITED SIRKETI</p>
        </div>
      </footer>

    </main>
  );
}
