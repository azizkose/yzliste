"use client";
import { useCredits } from "@/lib/hooks/useCredits";
import { CreditCard } from "lucide-react";
import Link from "next/link";

export function StudioHeader() {
  const { data: kredi } = useCredits();

  return (
    <header className="bg-[#1A1A17] border-b border-[#2A2A26] px-4 h-14 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Link href="/yzstudio" className="flex items-center gap-2">
          <span className="text-[#BAC9EB] font-medium tracking-tight text-base">yzstudio</span>
          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-[#A87847]/20 text-[#A87847] border border-[#A87847]/30 leading-none">
            beta
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        {kredi !== undefined && kredi !== null && (
          <span className="text-sm text-[#908E86]">
            {kredi} kredi
          </span>
        )}
        <Link
          href="/kredi-yukle"
          className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg bg-[#1E4DD8] text-white hover:bg-[#163B9E] transition-colors"
        >
          <CreditCard size={14} strokeWidth={1.5} />
          Kredi yükle
        </Link>
      </div>
    </header>
  );
}
