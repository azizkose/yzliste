"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, CreditCard } from "lucide-react";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import { useCredits } from "@/lib/hooks/useCredits";
import { supabase } from "@/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";
import { analytics } from "@/lib/analytics";
import { Icon3D } from "@/components/ui/Icon3D";

type AktifSayfa = "ana" | "icerik" | "fiyatlar" | "blog" | "toplu" | "profil";

const ARACLAR = [
  { ikon: "pencil" as const, baslik: "Listing Metni", aciklama: "Platforma özel başlık, özellikler, etiket", href: "/uret?tab=metin", detay: "/#arac-metin" },
  { ikon: "camera" as const, baslik: "Stüdyo Görseli", aciklama: "Tek fotoğraftan 7 farklı stüdyo stili", href: "/uret?tab=gorsel", detay: "/#arac-gorsel" },
  { ikon: "video-cam" as const, baslik: "Ürün Videosu", aciklama: "5sn veya 10sn AI tanıtım klibi", href: "/uret?tab=video", detay: "/#arac-video" },
  { ikon: "mobile" as const, baslik: "Sosyal Medya", aciklama: "Instagram, TikTok, Facebook, X caption", href: "/uret?tab=sosyal", detay: "/#arac-sosyal" },
];

export default function SiteHeader({ aktifSayfa }: { aktifSayfa?: AktifSayfa }) {
  const [menuAcik, setMenuAcik] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [araclarAcik, setAraclarAcik] = useState(false);
  const [mobilAraclarAcik, setMobilAraclarAcik] = useState(false);
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
    <header className={`sticky top-0 z-40 border-b transition-all duration-300 ${transparent ? "bg-black/25 backdrop-blur-sm border-transparent" : "bg-white/90 backdrop-blur border-[#D8D6CE]"}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 flex items-center gap-2">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0 mr-1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/yzliste_logo.png" alt="yzliste" className={`h-8 transition-all duration-300 ${transparent ? "brightness-0 invert" : ""}`} />
        </Link>

        {/* Desktop nav */}
        <nav className={`hidden sm:flex items-center gap-0.5 text-xs sm:text-sm flex-1 ${transparent ? "text-white/80" : "text-[#5A5852]"}`}>
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              className={`px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-colors whitespace-nowrap ${
                aktifSayfa === link.id
                  ? transparent ? "text-white font-medium" : "text-[#1E4DD8] font-medium"
                  : transparent ? "hover:bg-white/10 hover:text-white" : "hover:bg-[#F1F0EB] hover:text-[#1A1A17]"
              }`}
            >
              {link.label}
            </a>
          ))}
          <div className="relative" onMouseEnter={() => setAraclarAcik(true)} onMouseLeave={() => setAraclarAcik(false)}>
            <button
              type="button"
              className={`px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-colors whitespace-nowrap ${
                transparent ? "text-white/80 hover:bg-white/10 hover:text-white" : "text-[#5A5852] hover:bg-[#F1F0EB] hover:text-[#1A1A17]"
              }`}
            >
              Araçlar ▾
            </button>
            {araclarAcik && (
              <div className="absolute top-full left-0 mt-1 bg-white rounded-xl border border-[#D8D6CE] p-2 min-w-[320px] z-50">
                {ARACLAR.map((a) => (
                  <div key={a.href} className="flex items-start gap-3 p-3 rounded-lg hover:bg-[#FAFAF8] transition-colors">
                    <Icon3D name={a.ikon} size={32} className="flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#1A1A17]">{a.baslik}</p>
                      <p className="text-xs text-[#908E86] mt-0.5">{a.aciklama}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <a href={a.detay} className="text-xs text-[#908E86] hover:text-[#5A5852]">Detaylar</a>
                        <a href={a.href} className="text-xs font-medium bg-[#1E4DD8] hover:bg-[#163B9E] text-white px-3 py-1 rounded-lg transition-colors">Kullan →</a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Auth buttons */}
        <div className="flex gap-1 sm:gap-2 ml-auto items-center">
          {authYukleniyor ? null : girisVar ? (
            <>
              {kredi !== null && kredi !== undefined && (
                <a
                  href="/hesap/krediler"
                  className={`hidden sm:flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-full transition-colors whitespace-nowrap ${transparent ? "bg-white/20 text-white hover:bg-white/30" : "bg-[#F0F4FB] text-[#1E4DD8] hover:bg-[#BAC9EB]/30"}`}
                >
                  <CreditCard size={12} strokeWidth={1.5} />
                  {kredi} kredi
                </a>
              )}
              <a
                href="/hesap"
                className={`text-xs sm:text-sm px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-colors whitespace-nowrap ${transparent ? "text-white/80 hover:text-white hover:bg-white/10" : "text-[#5A5852] hover:text-[#1A1A17] hover:bg-[#F1F0EB]"}`}
              >
                Hesabım
              </a>
              <button
                onClick={cikisYap}
                className={`hidden sm:block text-xs sm:text-sm px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap ${transparent ? "text-white/60 hover:text-white hover:bg-white/10" : "text-[#908E86] hover:text-[#5A5852] hover:bg-[#F1F0EB]"}`}
              >
                Çıkış
              </button>
            </>
          ) : (
            <a
              href="/giris"
              className={`text-xs sm:text-sm px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-colors whitespace-nowrap ${transparent ? "text-white/80 hover:text-white hover:bg-white/10" : "text-[#5A5852] hover:text-[#1A1A17] hover:bg-[#F1F0EB]"}`}
            >
              Giriş Yap
            </a>
          )}
          <a
            href="/uret"
            className="hidden sm:block text-xs sm:text-sm bg-[#1E4DD8] text-white px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-[#163B9E] transition-colors font-medium whitespace-nowrap"
          >
            İçerik Üret →
          </a>
          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuAcik(!menuAcik)}
            className={`sm:hidden p-2 rounded-lg transition-colors ${transparent ? "text-white hover:bg-white/10" : "text-[#5A5852] hover:bg-[#F1F0EB]"}`}
            aria-label="Menü"
          >
            {menuAcik ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {menuAcik && (
        <div className="sm:hidden absolute top-full left-0 right-0 bg-white border-b border-[#D8D6CE] z-50">
          <nav className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={() => setMenuAcik(false)}
                className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                  aktifSayfa === link.id
                    ? "text-[#1E4DD8] font-medium bg-[#F0F4FB]"
                    : "text-[#5A5852] hover:bg-[#F1F0EB] hover:text-[#1A1A17]"
                }`}
              >
                {link.label}
              </a>
            ))}
            <div>
              <button
                type="button"
                onClick={() => setMobilAraclarAcik(!mobilAraclarAcik)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-[#5A5852] hover:bg-[#F1F0EB] transition-colors"
              >
                <span>Araçlar</span>
                <span className="text-xs text-[#908E86]">{mobilAraclarAcik ? "▾" : "▸"}</span>
              </button>
              {mobilAraclarAcik && (
                <div className="pl-4 space-y-0.5 pb-1">
                  {ARACLAR.map((a) => (
                    <div key={a.href} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#FAFAF8] transition-colors">
                      <Icon3D name={a.ikon} size={20} className="flex-shrink-0" />
                      <span className="text-sm text-[#5A5852] flex-1">{a.baslik}</span>
                      <a href={a.detay} onClick={() => setMenuAcik(false)} className="text-xs text-[#908E86] hover:text-[#5A5852] whitespace-nowrap">Detaylar</a>
                      <a href={a.href} onClick={() => setMenuAcik(false)} className="text-xs font-medium bg-[#1E4DD8] hover:bg-[#163B9E] text-white px-3 py-1 rounded-lg transition-colors whitespace-nowrap">Kullan →</a>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="border-t border-[#D8D6CE] pt-2 mt-2">
              {authYukleniyor ? null : girisVar ? (
                <>
                  {kredi !== null && kredi !== undefined && (
                    <a
                      href="/hesap/krediler"
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-[#1E4DD8] font-medium bg-[#F0F4FB] mb-1"
                    >
                      <CreditCard size={14} strokeWidth={1.5} />
                      {kredi} kredi
                    </a>
                  )}
                  <a
                    href="/hesap"
                    className="block px-3 py-2 rounded-lg text-sm text-[#5A5852] hover:bg-[#F1F0EB] hover:text-[#1A1A17] transition-colors mb-1"
                  >
                    Hesabım
                  </a>
                  <button
                    onClick={cikisYap}
                    className="block w-full text-left px-3 py-2 rounded-lg text-sm text-[#908E86] hover:bg-[#F1F0EB] hover:text-[#5A5852] transition-colors mb-1"
                  >
                    Çıkış Yap
                  </button>
                </>
              ) : (
                <a
                  href="/giris"
                  className="block px-3 py-2 rounded-lg text-sm text-[#5A5852] hover:bg-[#F1F0EB] hover:text-[#1A1A17] transition-colors mb-1"
                >
                  Giriş Yap
                </a>
              )}
              <a
                href="/uret"
                className="block px-3 py-2 rounded-lg text-sm font-medium bg-[#1E4DD8] text-white text-center hover:bg-[#163B9E] transition-colors"
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
