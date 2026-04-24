"use client";
import { useRef, useCallback } from "react";
import { Upload, Check } from "lucide-react";
import Image from "next/image";
import { STOK_MANKENLER } from "@/lib/studio-constants";

interface ModelPickerProps {
  modelKaynagi: "stok" | "ozel";
  modelStokId: string | null;
  modelOzelFoto: string | null;
  onKaynagiChange: (v: "stok" | "ozel") => void;
  onStokIdChange: (v: string) => void;
  onOzelFotoChange: (v: string | null) => void;
}

export function ModelPicker({
  modelKaynagi, modelStokId, modelOzelFoto,
  onKaynagiChange, onStokIdChange, onOzelFotoChange,
}: ModelPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => onOzelFotoChange(e.target?.result as string);
    reader.readAsDataURL(file);
  }, [onOzelFotoChange]);

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-[#D8D6CE]">Manken seçimi</h3>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {STOK_MANKENLER.map((manken) => (
          <button
            key={manken.id}
            onClick={() => { onKaynagiChange("stok"); onStokIdChange(manken.id); }}
            className={`relative aspect-[2/3] rounded-lg border overflow-hidden transition-colors ${
              modelKaynagi === "stok" && modelStokId === manken.id
                ? "border-[#1E4DD8] ring-1 ring-[#1E4DD8]"
                : "border-[#2A2A26] hover:border-[#3A3A36]"
            } bg-[#1A1A17]`}
          >
            <Image
              src={manken.url}
              alt={manken.label}
              fill
              className="object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
            <div className="absolute inset-0 flex flex-col justify-between p-2">
              <div className="flex justify-end">
                {modelKaynagi === "stok" && modelStokId === manken.id && (
                  <span className="w-5 h-5 rounded-full bg-[#1E4DD8] flex items-center justify-center">
                    <Check size={12} strokeWidth={2} className="text-white" />
                  </span>
                )}
              </div>
              <span className="text-[10px] text-[#908E86] bg-[#111110]/80 px-1.5 py-0.5 rounded self-start">
                {manken.label}
              </span>
            </div>
          </button>
        ))}

        {/* Özel yükleme */}
        <button
          onClick={() => { onKaynagiChange("ozel"); inputRef.current?.click(); }}
          className={`relative aspect-[2/3] rounded-lg border overflow-hidden transition-colors ${
            modelKaynagi === "ozel"
              ? "border-[#1E4DD8] ring-1 ring-[#1E4DD8]"
              : "border-dashed border-[#2A2A26] hover:border-[#3A3A36]"
          } bg-[#1A1A17] flex flex-col items-center justify-center gap-1`}
        >
          {modelOzelFoto && modelKaynagi === "ozel" ? (
            <Image src={modelOzelFoto} alt="Kendi manken" fill className="object-cover" />
          ) : (
            <>
              <Upload size={20} strokeWidth={1.5} className="text-[#5A5852]" />
              <span className="text-[10px] text-[#5A5852] text-center px-1">Kendi mankeninizi yükleyin</span>
            </>
          )}
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
      />

      <p className="text-xs text-[#5A5852]">
        Özel manken: tam boy, beyaz/açık gri arka plan, yüz görünür olmalı
      </p>
    </div>
  );
}
