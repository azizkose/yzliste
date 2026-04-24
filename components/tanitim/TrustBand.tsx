import Link from "next/link";
import { Lock } from "lucide-react";

export default function TrustBand() {
  return (
    <div className="bg-[#FAFAF8] border-t border-[#D8D6CE] px-4 py-3 text-center text-xs text-[#908E86]">
      <Link href="/hakkimizda" className="hover:text-[#5A5852] transition-colors">
        SIMOON PAZARLAMA LTD. ŞTİ.
      </Link>
      {" · İstanbul · "}
      <Lock size={10} strokeWidth={1.5} className="inline -mt-0.5" />
      {" 256-bit şifreleme · "}
      <a href="mailto:destek@yzliste.com" className="hover:text-[#5A5852] transition-colors">
        destek@yzliste.com
      </a>
    </div>
  );
}
