"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Gift } from "lucide-react";

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
    <div className="bg-[#1E4DD8] text-white px-4 py-3 text-center text-sm flex items-center justify-center gap-2 flex-wrap">
      <Gift size={16} strokeWidth={1.5} className="flex-shrink-0" />
      <span className="font-medium">Davet linki ile geldin!</span>{" "}
      Kayıt ol ve ilk satın almanda{" "}
      <span className="font-medium underline">ikinize +10 bonus kredi</span> kazan.{" "}
      <Link href="/kayit" className="ml-2 bg-white text-[#1E4DD8] text-xs font-medium px-3 py-1 rounded-full hover:bg-[#F0F4FB] transition-colors">
        Hemen kayıt ol
      </Link>
    </div>
  );
}
