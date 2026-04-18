"use client";
import { useState } from "react";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import { useCredits } from "@/lib/hooks/useCredits";

type AktifSayfa = "ana" | "icerik" | "fiyatlar" | "blog" | "toplu" | "profil";

export default function SiteHeader({ aktifSayfa }: { aktifSayfa?: AktifSayfa }) {
  const [menuAcik, setMenuAcik] = useState(false);
  const { data: currentUser } = useCurrentUser();
  const { data: kredi } = useCredits();

  const girisVar = !!currentUser && !currentUser.anonim;

  const navLinks = [
    { href: "/auth", label: "Ana Sayfa", id: "ana" as AktifSayfa },
    { href: "/", label: "İçerik", id: "icerik" as AktifSayfa },
    { href: "/fiyatlar", label: "Fiyatlar", id: "fiyatlar" as AktifSayfa },
    { href: "/blog", label: "Blog", id: "blog" as AktifSayfa },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 flex items-center gap-2">
        {/* Logo */}
        <a href="/" className="flex-shrink-0 mr-1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/yzliste_logo.png" alt="yzliste" className="h-8" />
        </a>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-0.5 text-xs sm:text-sm text-gray-500 flex-1">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              className={`px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-colors whitespace-nowrap ${
                aktifSayfa === link.id
                  ? "text-indigo-600 font-medium"
                  : "hover:bg-gray-100 hover:text-gray-800"
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Auth buttons */}
        <div className="flex gap-1 sm:gap-2 ml-auto items-center">
          {girisVar ? (
            <>
              {kredi !== null && kredi !== undefined && (
                <a
                  href="/kredi-yukle"
                  className="hidden sm:flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors whitespace-nowrap"
                >
                  💳 {kredi} kredi
                </a>
              )}
              <a
                href="/profil"
                className="text-xs sm:text-sm text-gray-500 hover:text-gray-800 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap"
              >
                Profil
              </a>
              <a
                href="/"
                className="hidden sm:block text-xs sm:text-sm bg-indigo-500 text-white px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-indigo-600 transition-colors font-medium whitespace-nowrap"
              >
                İçerik Üret →
              </a>
            </>
          ) : (
            <>
              <a
                href="/giris"
                className="text-xs sm:text-sm text-gray-500 hover:text-gray-800 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap"
              >
                Giriş Yap
              </a>
              <a
                href="/kayit"
                className="hidden sm:block text-xs sm:text-sm bg-indigo-500 text-white px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-indigo-600 transition-colors font-medium whitespace-nowrap"
              >
                Ücretsiz Başla
              </a>
            </>
          )}
          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuAcik(!menuAcik)}
            className="sm:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            aria-label="Menü"
          >
            {menuAcik ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {menuAcik && (
        <div className="sm:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-lg z-50">
          <nav className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={() => setMenuAcik(false)}
                className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                  aktifSayfa === link.id
                    ? "text-indigo-600 font-medium bg-indigo-50"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                }`}
              >
                {link.label}
              </a>
            ))}
            <div className="border-t border-gray-100 pt-2 mt-2">
              <a
                href="/kayit"
                className="block px-3 py-2 rounded-lg text-sm font-medium bg-indigo-500 text-white text-center hover:bg-indigo-600 transition-colors"
              >
                Ücretsiz Başla
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
