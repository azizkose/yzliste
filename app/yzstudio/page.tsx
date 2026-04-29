"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import StudioHeader from "@/components/yzstudio/StudioHeader";
import BetaBanner from "@/components/yzstudio/BetaBanner";
import { useFeatureFlag, FF } from "@/lib/feature-flags";
import { TryonSekmesi } from "./components/tryon/TryonSekmesi";

const queryClient = new QueryClient();

function YzstudioContent() {
  const yzstudioEnabled = useFeatureFlag(FF.YZSTUDIO);

  if (yzstudioEnabled === false) {
    return (
      <div className="min-h-screen bg-rd-neutral-50 flex flex-col">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-sm">
            <p className="text-rd-neutral-900 font-medium mb-2">yzstudio şu an erişime kapalı</p>
            <p className="text-sm text-rd-neutral-500 mb-6">Yakında tekrar açılacak.</p>
            <Link href="/" className="text-sm text-rd-primary-700 hover:text-rd-primary-800">
              Ana sayfaya dön
            </Link>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-rd-neutral-50 flex flex-col">
      <SiteHeader />
      <StudioHeader />
      <BetaBanner />

      <main className="flex-1">
        <TryonSekmesi />
      </main>

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
