"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Durum = "yukleniyor" | "giris_yok" | "giris_var";

export default function HeaderAuthButtons() {
  const [durum, setDurum] = useState<Durum>("yukleniyor");

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setDurum(!user || user.is_anonymous ? "giris_yok" : "giris_var");
    });
  }, []);

  if (durum === "yukleniyor") return <div className="w-32 h-8" />;

  if (durum === "giris_var") {
    return (
      <div className="flex gap-1 sm:gap-2 items-center">
        <a href="/profil" className="text-xs sm:text-sm text-gray-500 hover:text-gray-800 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap">
          Profil
        </a>
        <Link
          href="/"
          className="hidden sm:block text-xs sm:text-sm bg-orange-500 text-white px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-orange-600 transition-colors font-medium whitespace-nowrap"
        >
          İçerik Üret →
        </Link>
      </div>
    );
  }

  return (
    <div className="flex gap-1 sm:gap-2 items-center">
      <a href="/auth?giris=1" className="text-xs sm:text-sm text-gray-500 hover:text-gray-800 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap">
        Giriş Yap
      </a>
      <a href="/auth?kayit=1" className="hidden sm:block text-xs sm:text-sm bg-orange-500 text-white px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-orange-600 transition-colors font-medium whitespace-nowrap">
        Ücretsiz Başla
      </a>
    </div>
  );
}
