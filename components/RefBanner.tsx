"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

export default function RefBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const code = getCookie("ref_code");
    if (code) setVisible(true);
  }, []);

  if (!visible) return null;

  return (
    <div className="bg-gradient-to-r from-indigo-500 to-violet-500 text-white px-4 py-3 text-center text-sm">
      <span className="font-semibold">🎁 Davet linki ile geldin!</span>{" "}
      Kayıt ol ve ilk satın almanda{" "}
      <span className="font-bold underline">ikinize +10 bonus kredi</span> kazan.{" "}
      <Link href="/kayit" className="ml-2 bg-white text-indigo-600 text-xs font-bold px-3 py-1 rounded-full hover:bg-indigo-50 transition-colors">
        Hemen Kayıt Ol →
      </Link>
    </div>
  );
}
