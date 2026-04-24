"use client";
import { useState } from "react";

interface KrediButonProps {
  label: string;
  kredi?: number;        // undefined → admin/ücretsiz mod (kredi gösterilmez, onay yok)
  kalanKredi?: number;
  onClick: () => void;
  disabled?: boolean;
  yukleniyor?: boolean;
  yukleniyorLabel?: string;
  renk?: "primary" | "amber" | "green" | "gray";
  className?: string;
}

const renkSinif: Record<string, string> = {
  primary: "bg-[#1E4DD8] hover:bg-[#163B9E]",
  amber:   "bg-[#A87847] hover:bg-[#7D5630]",
  green:   "bg-[#0F5132] hover:bg-[#0a3d25]",
  gray:    "bg-[#1A1A17] hover:bg-[#333330]",
};

export default function KrediButon({
  label, kredi, kalanKredi, onClick, disabled = false,
  yukleniyor = false, yukleniyorLabel, renk = "primary", className = "",
}: KrediButonProps) {
  const [onayAcik, setOnayAcik] = useState(false);

  const handleClick = () => {
    if (kredi !== undefined && kredi >= 2 && !disabled && !yukleniyor) {
      setOnayAcik(true);
    } else if (!disabled && !yukleniyor) {
      onClick();
    }
  };

  const handleOnayla = () => {
    setOnayAcik(false);
    onClick();
  };

  const butonLabel = yukleniyor
    ? (yukleniyorLabel ?? "Yükleniyor...")
    : kredi !== undefined
      ? `${label} — ${kredi} kredi`
      : label;

  return (
    <>
      <button
        onClick={handleClick}
        disabled={disabled || yukleniyor}
        className={`w-full ${renkSinif[renk]} disabled:bg-[#D8D6CE] text-white font-medium py-3 rounded-lg transition-all ${className}`}
      >
        {butonLabel}
      </button>

      {onayAcik && kredi !== undefined && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-xl border border-[#D8D6CE] p-6 max-w-sm w-full space-y-4">
            <p className="text-sm font-medium text-[#1A1A17]">
              Bu işlem <span className="text-[#1E4DD8]">{kredi} kredi</span> harcar.
            </p>
            {kalanKredi !== undefined && (
              <p className="text-xs text-[#908E86]">Kalan krediniz: {kalanKredi}</p>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => setOnayAcik(false)}
                className="flex-1 border border-[#D8D6CE] text-[#5A5852] text-sm font-medium py-2.5 rounded-lg hover:bg-[#F1F0EB] transition-colors"
              >
                Vazgeç
              </button>
              <button
                onClick={handleOnayla}
                className="flex-1 bg-[#1E4DD8] hover:bg-[#163B9E] text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
              >
                Devam Et
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
