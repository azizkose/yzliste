"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [sifre, setSifre] = useState("");
  const [mod, setMod] = useState<"giris" | "kayit">("giris");
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

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow p-8 w-full max-w-md">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            YZ<span className="text-orange-500">Liste</span>
          </h1>
          <p className="text-gray-500 mt-1">E-ticaret içerik asistanı</p>
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setMod("giris")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              mod === "giris" ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-600"
            }`}
          >
            Giriş Yap
          </button>
          <button
            onClick={() => setMod("kayit")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              mod === "kayit" ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-600"
            }`}
          >
            Kayıt Ol
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
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
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
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
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
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            {yukleniyor ? "..." : mod === "giris" ? "Giriş Yap" : "Kayıt Ol"}
          </button>
        </div>

        {mod === "kayit" && (
          <p className="text-xs text-gray-400 text-center mt-4">
            Kayıt olunca 3 ücretsiz kredi alırsınız.
          </p>
        )}
      </div>
    </main>
  );
}