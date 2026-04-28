"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import AuthForm from "@/components/auth/AuthForm";
import AuthHero from "@/components/tanitim/AuthHero";
import FeaturesTabbed from "@/components/tanitim/FeaturesTabbed";
import BrandProfile from "@/components/tanitim/BrandProfile";
import HowItWorks from "@/components/tanitim/HowItWorks";
import BenefitsGrid from "@/components/tanitim/BenefitsGrid";
import LandingFAQ from "@/components/tanitim/LandingFAQ";
import TrustBand from "@/components/tanitim/TrustBand";
import RefBanner from "@/components/RefBanner";
import IcerikTurleriSection from "@/components/sections/_archive/IcerikTurleriSection";
import PazaryeriSection from "@/components/sections/_archive/PazaryeriSection";

export default function TanitimSayfasi() {
  const [modalAcik, setModalAcik] = useState(false);
  const modalUyeMod = "kayit" as const;
  const router = useRouter();

  const handleModalAuthSuccess = () => {
    router.push("/uret");
  };

  return (
    <>
      {modalAcik && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setModalAcik(false); }}
        >
          <div className="bg-white rounded-xl border border-[#D8D6CE] w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-[#D8D6CE]">
              <h2 className="text-lg font-medium text-[#1A1A17]">
                {modalUyeMod === "kayit" ? "Hesap oluştur" : "Giriş yap"}
              </h2>
              <button onClick={() => setModalAcik(false)} aria-label="Kapat" className="text-[#908E86] hover:text-[#5A5852] text-2xl">×</button>
            </div>
            <div className="p-6">
              <AuthForm defaultMode={modalUyeMod} onSuccess={handleModalAuthSuccess} />
            </div>
          </div>
        </div>
      )}

      <SiteHeader aktifSayfa="ana" />
      <RefBanner />
      <main className="min-h-screen bg-white font-sans">
        <AuthHero />
        <FeaturesTabbed />
        <HowItWorks />
        <BrandProfile />
        <BenefitsGrid />
        <IcerikTurleriSection />
        <PazaryeriSection />
        <LandingFAQ />
        <TrustBand />
        <SiteFooter />
      </main>
    </>
  );
}
