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
  renk?: "indigo" | "amber" | "green" | "gray";
  className?: string;
}

const renkSinif: Record<string, string> = {
  indigo: "bg-indigo-500 hover:bg-indigo-600",
  amber:  "bg-amber-500 hover:bg-amber-600",
  green:  "bg-green-500 hover:bg-green-600",
  gray:   "bg-gray-800 hover:bg-gray-900",
};

export default function KrediButon({
  label, kredi, kalanKredi, onClick, disabled = false,
  yukleniyor = false, yukleniyorLabel, renk = "indigo", className = "",
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
    ? (yukleniyorLabel ?? "⏳ Üretiliyor...")
    : kredi !== undefined
      ? `${label} — ${kredi} kredi`
      : label;

  return (
    <>
      <button
        onClick={handleClick}
        disabled={disabled || yukleniyor}
        className={`w-full ${renkSinif[renk]} disabled:bg-gray-300 text-white font-semibold py-3 rounded-xl transition-all ${className}`}
      >
        {butonLabel}
      </button>

      {onayAcik && kredi !== undefined && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full space-y-4">
            <p className="text-sm font-semibold text-gray-800">
              Bu işlem <span className="text-indigo-600">{kredi} kredi</span> harcar.
            </p>
            {kalanKredi !== undefined && (
              <p className="text-xs text-gray-500">Kalan krediniz: {kalanKredi}</p>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => setOnayAcik(false)}
                className="flex-1 border border-gray-200 text-gray-600 text-sm font-medium py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Vazgeç
              </button>
              <button
                onClick={handleOnayla}
                className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium py-2.5 rounded-xl transition-colors"
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
