"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Durum = "yukleniyor" | "giris_yok" | "giris_var";

export default function HeaderAuthButtons() {
  const [durum, setDurum] = useState<Durum>("yukleniyor");
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user || user.is_anonymous) {
        setDurum("giris_yok");
      } else {
        setEmail(user.email ?? null);
        setDurum("giris_var");
      }
    });
  }, []);

  if (durum === "yukleniyor") {
    return <div className="w-32 h-8" />;
  }

  if (durum === "giris_var") {
    return (
      <div className="flex gap-1 sm:gap-2 flex-shrink-0 items-center">
        <span className="hidden sm:block text-xs text-gray-400 max-w-[120px] truncate">{email}</span>
        <a
          href="/profil"
          className="text-xs sm:text-sm text-gray-500 hover:text-gray-800 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap"
        >
          Profil
        </a>
        <a
          href="/"
          className="text-xs sm:text-sm bg-orange-500 text-white px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-orange-600 transition-colors font-medium whitespace-nowrap"
        >
          İçerik Üret
        </a>
      </div>
    );
  }

  return (
    <div className="flex gap-1 sm:gap-2 flex-shrink-0">
      <a
        href="/auth?giris=1"
        className="text-xs sm:text-sm text-gray-500 hover:text-gray-800 px-2 sm:px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap"
      >
        Giriş Yap
      </a>
      <a
        href="/auth"
        className="text-xs sm:text-sm bg-orange-500 text-white px-2 sm:px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors font-medium whitespace-nowrap"
      >
        Ücretsiz Başla
      </a>
    </div>
  );
}
