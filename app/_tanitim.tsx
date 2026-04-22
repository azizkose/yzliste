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
        <HowItWorks />
        <BrandProfile />
        <BenefitsGrid />
        <LandingFAQ />
        <TrustBand />
        <SiteFooter />
      </main>
    </>
  );
}
