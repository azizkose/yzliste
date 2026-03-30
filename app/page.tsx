"use client";
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Home() {
  const [urunAdi, setUrunAdi] = useState("");
  const [kategori, setKategori] = useState("");
  const [ozellikler, setOzellikler] = useState("");
  const [platform, setPlatform] = useState("trendyol");
  const [sonuc, setSonuc] = useState("");
  const [yukleniyor, setYukleniyor] = useState(false);
  const [fotolar, setFotolar] = useState<string[]>([]);
  const [girisTipi, setGirisTipi] = useState<"manuel" | "foto" | "barkod">("manuel");
  const [barkod, setBarkod] = useState("");
  const [barkodYukleniyor, setBarkodYukleniyor] = useState(false);
  const [barkodBilgi, setBarkodBilgi] = useState<{isim: string, marka: string, aciklama: string, kategori: string, renk: string, boyut: string} | null>(null);
  const [kameraAcik, setKameraAcik] = useState(false);
  const [kullanici, setKullanici] = useState<{email: string, kredi: number} | null>(null);
  const scannerRef = useRef<unknown>(null);
  const scannerBaslatildi = useRef(false);
  const sorguCalisiyor = useRef(false);
  const router = useRouter();

  useEffect(() => {
    kullaniciyiKontrolEt();
    return () => { kameraKapat(); };
  }, []);

  const kullaniciyiKontrolEt = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/auth");
      return;
    }
    const { data: profil } = await supabase
      .from("profiles")
      .select("email, kredi")
      .eq("id", user.id)
      .single();
    if (profil) setKullanici(profil);
  };

  const cikisYap = async () => {
    await supabase.auth.signOut();
    router.push("/auth");
  };

  const fotoSec = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dosyalar = Array.from(e.target.files || []);
    dosyalar.slice(0, 3 - fotolar.length).forEach((dosya) => {
      const reader = new FileReader();
      reader.onload = () => {
        setFotolar((prev) => prev.length >= 3 ? prev : [...prev, reader.result as string]);
      };
      reader.readAsDataURL(dosya);
    });
    e.target.value = "";
  };

  const fotoKaldir = (index: number) => {
    setFotolar((prev) => prev.filter((_, i) => i !== index));
  };

  const barkodSorgula = async (kod: string) => {
    if (!kod || kod.length < 8) return;
    if (sorguCalisiyor.current) return;
    sorguCalisiyor.current = true;
    setBarkodYukleniyor(true);
    setBarkodBilgi(null);
    try {
      const res = await fetch(`/api/barkod?kod=${kod}`);
      const data = await res.json();
      if (data.bulunamadi) {
        alert("Bu ürün veritabanında bulunamadı. Lütfen ürün adı ve özelliklerini Manuel sekmesinden girin.");
        setGirisTipi("manuel");
        setBarkod("");
      } else if (data.isim) {
        setBarkodBilgi(data);
        setUrunAdi(data.isim);
        if (data.marka) setKategori(data.marka);
        if (data.aciklama) setOzellikler(data.aciklama);
        kameraKapat();
      } else {
        alert("Barkod sorgulanırken hata oluştu.");
      }
    } catch {
      alert("Barkod sorgulanırken hata oluştu.");
    }
    setBarkodYukleniyor(false);
    sorguCalisiyor.current = false;
  };

  const kameraAc = async () => {
    if (scannerBaslatildi.current) return;
    setKameraAcik(true);
    setTimeout(async () => {
      try {
        const { Html5Qrcode } = await import("html5-qrcode");
        const scanner = new Html5Qrcode("barkod-okuyucu");
        scannerRef.current = scanner;
        scannerBaslatildi.current = true;
        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 250, height: 150 } },
          (decodedText: string) => { setBarkod(decodedText); barkodSorgula(decodedText); },
          () => {}
        );
      } catch (e) {
        console.log(e);
        alert("Kamera açılamadı.");
        setKameraAcik(false);
        scannerBaslatildi.current = false;
      }
    }, 300);
  };

  const kameraKapat = async () => {
    if (scannerRef.current && scannerBaslatildi.current) {
      try {
        const scanner = scannerRef.current as { stop: () => Promise<void>; clear: () => void };
        await scanner.stop();
        scanner.clear();
      } catch (e) { console.log(e); }
      scannerRef.current = null;
      scannerBaslatildi.current = false;
    }
    setKameraAcik(false);
  };

  const icerikUret = async () => {
    if (!kullanici || kullanici.kredi <= 0) {
      alert("Krediniz bitti. Lütfen kredi satın alın.");
      return;
    }
    if (girisTipi === "manuel" && (!urunAdi || !kategori)) return;
    if (girisTipi === "foto" && fotolar.length === 0) return;
    if (girisTipi === "barkod" && !barkodBilgi) return;
    setYukleniyor(true);
    setSonuc("");

    const res = await fetch("/api/uret", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ urunAdi, kategori, ozellikler, platform, fotolar, girisTipi, barkodBilgi }),
    });

    const data = await res.json();
    setSonuc(data.icerik);

    // Kredi düş
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from("profiles")
        .update({ kredi: kullanici.kredi - 1 })
        .eq("id", user.id);
      setKullanici({ ...kullanici, kredi: kullanici.kredi - 1 });
    }

    setYukleniyor(false);
  };

  const uretButonAktif =
    !yukleniyor &&
    ((girisTipi === "manuel" && urunAdi && kategori) ||
     (girisTipi === "foto" && fotolar.length > 0) ||
     (girisTipi === "barkod" && barkodBilgi !== null));

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">

        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900">
            YZ<span className="text-orange-500">Liste</span>
          </h1>
          {kullanici && (
            <div className="flex items-center gap-4">
              <span className="text-sm bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-medium">
                {kullanici.kredi} kredi
              </span>
              <button onClick={cikisYap} className="text-sm text-gray-400 hover:text-gray-600">
                Çıkış
              </button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow p-6 space-y-4">

          <div className="flex gap-2">
            {(["manuel", "foto", "barkod"] as const).map((tip) => (
              <button
                key={tip}
                onClick={() => { setGirisTipi(tip); kameraKapat(); }}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                  girisTipi === tip ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {tip === "manuel" ? "Manuel" : tip === "foto" ? "📷 Fotoğraf" : "🔍 Barkod"}
              </button>
            ))}
          </div>

          {girisTipi === "manuel" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ürün Adı *</label>
                <input type="text" value={urunAdi} onChange={(e) => setUrunAdi(e.target.value)}
                  placeholder="örn: Erkek Deri Bot"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori *</label>
                <input type="text" value={kategori} onChange={(e) => setKategori(e.target.value)}
                  placeholder="örn: Ayakkabı / Giyim / Elektronik"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400" />
              </div>
            </>
          )}