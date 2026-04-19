"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import { useCredits } from "@/lib/hooks/useCredits";
import { supabase } from "@/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";
import { analytics } from "@/lib/analytics";

type AktifSayfa = "ana" | "icerik" | "fiyatlar" | "blog" | "toplu" | "profil";

export default function SiteHeader({ aktifSayfa }: { aktifSayfa?: AktifSayfa }) {
  const [menuAcik, setMenuAcik] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { data: currentUser, isLoading: authYukleniyor } = useCurrentUser();
  const { data: kredi } = useCredits();
  const router = useRouter();
  const queryClient = useQueryClient();

  const girisVar = !!currentUser && !currentUser.anonim;
  const isHeroPage = aktifSayfa === "ana";
  const transparent = isHeroPage && !scrolled;

  useEffect(() => {
    if (!isHeroPage) return;
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHeroPage]);

  const cikisYap = async () => {
    await supabase.auth.signOut();
    analytics.reset();
    queryClient.clear();
    router.push('/');
  };

  const navLinks = [
    { href: "/", label: "Ana Sayfa", id: "ana" as AktifSayfa },
    { href: "/fiyatlar", label: "Fiyatlar", id: "fiyatlar" as AktifSayfa },
    { href: "/blog", label: "Blog", id: "blog" as AktifSayfa },
  ];

  return (
    <header className={`sticky top-0 z-40 border-b transition-all duration-300 ${transparent ? "bg-black/25 backdrop-blur-sm border-transparent" : "bg-white/90 backdrop-blur border-gray-100"}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 flex items-center gap-2">
        {/* Logo */}
        <a href="/" className="flex-shrink-0 mr-1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/yzliste_logo.png" alt="yzliste" className={`h-8 transition-all duration-300 ${transparent ? "brightness-0 invert" : ""}`} />
        </a>

        {/* Desktop nav */}
        <nav className={`hidden sm:flex items-center gap-0.5 text-xs sm:text-sm flex-1 ${transparent ? "text-white/80" : "text-gray-500"}`}>
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              className={`px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-colors whitespace-nowrap ${
                aktifSayfa === link.id
                  ? transparent ? "text-white font-medium" : "text-indigo-600 font-medium"
                  : transparent ? "hover:bg-white/10 hover:text-white" : "hover:bg-gray-100 hover:text-gray-800"
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Auth buttons */}
        <div className="flex gap-1 sm:gap-2 ml-auto items-center">
          {authYukleniyor ? null : girisVar ? (
            <>
              {kredi !== null && kredi !== undefined && (
                <a
                  href="/hesap/krediler"
                  className={`hidden sm:flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-full transition-colors whitespace-nowrap ${transparent ? "bg-white/20 text-white hover:bg-white/30" : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"}`}
                >
                  💳 {kredi} kredi
                </a>
              )}
              <a
                href="/hesap"
                className={`text-xs sm:text-sm px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-colors whitespace-nowrap ${transparent ? "text-white/80 hover:text-white hover:bg-white/10" : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"}`}
              >
                Hesabım
              </a>
              <button
                onClick={cikisYap}
                className={`hidden sm:block text-xs sm:text-sm px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap ${transparent ? "text-white/60 hover:text-white hover:bg-white/10" : "text-gray-400 hover:text-gray-700 hover:bg-gray-100"}`}
              >
                Çıkış
              </button>
            </>
          ) : (
            <a
              href="/giris"
              className={`text-xs sm:text-sm px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-colors whitespace-nowrap ${transparent ? "text-white/80 hover:text-white hover:bg-white/10" : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"}`}
            >
              Giriş Yap
            </a>
          )}
          <a
            href="/uret"
            className="hidden sm:block text-xs sm:text-sm bg-indigo-500 text-white px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-indigo-600 transition-colors font-medium whitespace-nowrap"
          >
            İçerik Üret →
          </a>
          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuAcik(!menuAcik)}
            className={`sm:hidden p-2 rounded-lg transition-colors ${transparent ? "text-white hover:bg-white/10" : "text-gray-500 hover:bg-gray-100"}`}
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
              {authYukleniyor ? null : girisVar ? (
                <>
                  {kredi !== null && kredi !== undefined && (
                    <a
                      href="/hesap/krediler"
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-indigo-600 font-semibold bg-indigo-50 mb-1"
                    >
                      💳 {kredi} kredi
                    </a>
                  )}
                  <a
                    href="/hesap"
                    className="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-colors mb-1"
                  >
                    Hesabım
                  </a>
                  <button
                    onClick={cikisYap}
                    className="block w-full text-left px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors mb-1"
                  >
                    Çıkış Yap
                  </button>
                </>
              ) : (
                <a
                  href="/giris"
                  className="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-colors mb-1"
                >
                  Giriş Yap
                </a>
              )}
              <a
                href="/uret"
                className="block px-3 py-2 rounded-lg text-sm font-medium bg-indigo-500 text-white text-center hover:bg-indigo-600 transition-colors"
              >
                İçerik Üret →
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
