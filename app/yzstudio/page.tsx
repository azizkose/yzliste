"use client";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CreditCard } from "lucide-react";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { useCredits } from "@/lib/hooks/useCredits";
import { StudioSekmeler } from "./components/StudioSekmeler";
import { TryonSekmesi } from "./components/tryon/TryonSekmesi";

const queryClient = new QueryClient();

function YzstudioContent() {
  const [aktifSekme, setAktifSekme] = useState("tryon");
  const { data: kredi } = useCredits();

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex flex-col">
      <SiteHeader />

      <div className="border-b border-[#D8D6CE] bg-white">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="font-medium text-2xl tracking-[-0.01em] text-[#1A1A17]">yzstudio</h1>
            <span className="bg-[#FAF4ED] text-[#3D2710] text-xs font-medium px-2.5 py-0.5 rounded">
              Premium · Beta
            </span>
          </div>
          <div className="flex items-center gap-3">
            {kredi !== undefined && kredi !== null && (
              <span className="text-sm text-[#908E86]">{kredi} kredi</span>
            )}
            <Link
              href="/kredi-yukle"
              className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg bg-[#1E4DD8] text-white hover:bg-[#163B9E] transition-colors"
            >
              <CreditCard size={14} strokeWidth={1.5} />
              Kredi yükle
            </Link>
          </div>
        </div>
      </div>

      <StudioSekmeler aktif={aktifSekme} onChange={setAktifSekme} />

      <main className="flex-1">
        {aktifSekme === "tryon" && <TryonSekmesi />}
      </main>

      <div className="max-w-5xl mx-auto px-4 w-full mt-8">
        <div className="bg-[#FAF4ED] border border-[#EED8BD] rounded-lg px-4 py-2 text-center mb-4">
          <p className="text-xs text-[#7D5630]">yzstudio beta sürümünde — sonuçlar değişkenlik gösterebilir</p>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}

export default function YzstudioPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <YzstudioContent />
    </QueryClientProvider>
  );
}
