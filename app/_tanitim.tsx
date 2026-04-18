"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { MIN_FIYAT } from "@/lib/paketler";
import AuthForm from "@/components/auth/AuthForm";
import AuthHero from "@/components/tanitim/AuthHero";
import FeaturesTabbed from "@/components/tanitim/FeaturesTabbed";
import FeatureCards from "@/components/tanitim/FeatureCards";
import BrandProfile from "@/components/tanitim/BrandProfile";
import HowItWorks from "@/components/tanitim/HowItWorks";
import BenefitsGrid from "@/components/tanitim/BenefitsGrid";

export default function TanitimSayfasi() {
  const [modalAcik, setModalAcik] = useState(false);
  const [modalUyeMod, setModalUyeMod] = useState<"giris" | "kayit">("kayit");
  const [modalAmac, setModalAmac] = useState<"auth" | "satin_al">("auth");
  const router = useRouter();

  const handleModalAuthSuccess = () => {
    if (modalAmac === "satin_al") {
      router.push("/uret?paket=ac");
    } else {
      router.push("/uret");
    }
  };

  const hemenAlTikla = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.is_anonymous) {
      setModalAmac("satin_al");
      setModalUyeMod("kayit");
      setModalAcik(true);
      return;
    }
    router.push("/uret?paket=ac");
  };

  return (
    <>
      {modalAcik && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setModalAcik(false); }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">
                {modalUyeMod === "kayit" ? "Hesap Oluştur" : "Giriş Yap"}
              </h2>
              <button onClick={() => setModalAcik(false)} aria-label="Kapat" className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
            </div>
            <div className="p-6">
              <AuthForm defaultMode={modalUyeMod} onSuccess={handleModalAuthSuccess} />
            </div>
          </div>
        </div>
      )}

      <SiteHeader aktifSayfa="ana" />
      <main className="min-h-screen bg-white font-sans">
        <AuthHero />
        <FeaturesTabbed />
        <FeatureCards minFiyat={MIN_FIYAT} onSatinAlClick={hemenAlTikla} />
        <BrandProfile />
        <HowItWorks />
        <BenefitsGrid />
        <SiteFooter />
      </main>
    </>
  );
}
