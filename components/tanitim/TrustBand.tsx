import Link from "next/link";

export default function TrustBand() {
  return (
    <div className="bg-gray-50 border-t border-gray-100 px-4 py-3 text-center text-xs text-gray-400">
      <Link href="/hakkimizda" className="hover:text-gray-600 transition-colors">
        SIMOON PAZARLAMA LTD. ŞTİ.
      </Link>
      {" · İstanbul · 🔒 256-bit şifreleme · "}
      <a href="mailto:destek@yzliste.com" className="hover:text-gray-600 transition-colors">
        destek@yzliste.com
      </a>
    </div>
  );
}
