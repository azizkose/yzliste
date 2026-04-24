"use client";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StudioHeader } from "./components/StudioHeader";
import { StudioSekmeler } from "./components/StudioSekmeler";
import { TryonSekmesi } from "./components/tryon/TryonSekmesi";

const queryClient = new QueryClient();

export default function YzstudioPage() {
  const [aktifSekme, setAktifSekme] = useState("tryon");

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-[#111110] flex flex-col">
        <StudioHeader />
        <StudioSekmeler aktif={aktifSekme} onChange={setAktifSekme} />
        <main className="flex-1">
          {aktifSekme === "tryon" && <TryonSekmesi />}
        </main>
        <footer className="py-3 px-4 text-center text-xs text-[#5A5852] border-t border-[#2A2A26]">
          yzstudio deneysel araçlar içerir — sonuçlar değişkenlik gösterebilir
        </footer>
      </div>
    </QueryClientProvider>
  );
}
