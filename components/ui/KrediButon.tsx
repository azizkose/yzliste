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
  renk?: "primary" | "secondary" | "amber" | "green" | "gray";
  className?: string;
}

const renkSinif: Record<string, string> = {
  primary:   "bg-rd-primary-800 hover:bg-rd-primary-900 text-white",
  secondary: "bg-white border border-rd-neutral-200 text-rd-neutral-900 hover:bg-rd-neutral-100",
  amber:     "bg-[#A87847] hover:bg-[#7D5630] text-white",
  green:     "bg-rd-success-700 hover:bg-rd-success-700 text-white",
  gray:      "bg-rd-neutral-900 hover:bg-rd-neutral-900 text-white",
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
        className={`w-full ${renkSinif[renk]} disabled:bg-rd-neutral-200 disabled:text-rd-neutral-400 disabled:border-0 font-medium py-3 rounded-lg transition-all ${className}`}
      >
        {butonLabel}
      </button>

      {onayAcik && kredi !== undefined && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-xl border border-rd-neutral-200 p-6 max-w-sm w-full space-y-4">
            <p className="text-sm font-medium text-rd-neutral-900">
              Bu işlem <span className="text-rd-primary-800">{kredi} kredi</span> harcar.
            </p>
            {kalanKredi !== undefined && (
              <p className="text-xs text-rd-neutral-400">Kalan krediniz: {kalanKredi}</p>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => setOnayAcik(false)}
                className="flex-1 border border-rd-neutral-200 text-rd-neutral-600 text-sm font-medium py-2.5 rounded-lg hover:bg-rd-neutral-100 transition-colors"
              >
                Vazgeç
              </button>
              <button
                onClick={handleOnayla}
                className="flex-1 bg-rd-primary-800 hover:bg-rd-primary-900 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
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
