"use client";
import { useRef, useCallback } from "react";
import { ImageUp, X } from "lucide-react";
import Image from "next/image";

interface GarmentUploadProps {
  foto: string | null;
  garmentPhotoType: "auto" | "flat-lay" | "model";
  category: "auto" | "tops" | "bottoms" | "one-pieces";
  onFotoChange: (v: string | null) => void;
  onPhotoTypeChange: (v: "auto" | "flat-lay" | "model") => void;
  onCategoryChange: (v: "auto" | "tops" | "bottoms" | "one-pieces") => void;
}

export function GarmentUpload({
  foto, garmentPhotoType, category,
  onFotoChange, onPhotoTypeChange, onCategoryChange,
}: GarmentUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => onFotoChange(e.target?.result as string);
    reader.readAsDataURL(file);
  }, [onFotoChange]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) handleFile(file);
  }, [handleFile]);

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-[#1A1A17]">Kıyafet fotoğrafı</h3>

      <div
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => !foto && inputRef.current?.click()}
        className={`relative border rounded-xl overflow-hidden transition-colors ${
          foto
            ? "border-[#D8D6CE]"
            : "border-dashed border-[#D8D6CE] hover:border-[#1E4DD8] cursor-pointer"
        } bg-white`}
        style={{ minHeight: 160 }}
      >
        {foto ? (
          <div className="relative w-full" style={{ paddingBottom: "133%" }}>
            <Image src={foto} alt="Kıyafet" fill className="object-contain" />
            <button
              onClick={(e) => { e.stopPropagation(); onFotoChange(null); }}
              className="absolute top-2 right-2 p-1 rounded bg-white/80 border border-[#D8D6CE] text-[#5A5852] hover:text-[#1A1A17] transition-colors"
            >
              <X size={14} strokeWidth={1.5} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 py-12 px-4 text-center">
            <div className="w-14 h-14 rounded-lg bg-[#F1F0EB] flex items-center justify-center mb-1">
              <ImageUp size={24} strokeWidth={1.5} className="text-[#5A5852]" />
            </div>
            <p className="text-sm font-medium text-[#1A1A17]">Fotoğraf yükle veya sürükle bırak</p>
            <p className="text-xs text-[#908E86] mt-1">JPG, PNG — en fazla 10 MB</p>
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
      />

      <div className="space-y-3">
        <div>
          <p className="text-xs text-[#908E86] mb-2">Fotoğraf tipi</p>
          <div className="flex gap-2 flex-wrap">
            {(["auto", "flat-lay", "model"] as const).map((t) => (
              <button
                key={t}
                onClick={() => onPhotoTypeChange(t)}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                  garmentPhotoType === t
                    ? "border-[#1E4DD8] bg-[#1E4DD8] text-white"
                    : "border-[#D8D6CE] text-[#5A5852] hover:border-[#7B9BD9]"
                }`}
              >
                {t === "auto" ? "Otomatik" : t === "flat-lay" ? "Düz/askı" : "Mankendeki"}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs text-[#908E86] mb-2">Kategori</p>
          <div className="flex gap-2 flex-wrap">
            {(["auto", "tops", "bottoms", "one-pieces"] as const).map((c) => (
              <button
                key={c}
                onClick={() => onCategoryChange(c)}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                  category === c
                    ? "border-[#1E4DD8] bg-[#1E4DD8] text-white"
                    : "border-[#D8D6CE] text-[#5A5852] hover:border-[#7B9BD9]"
                }`}
              >
                {c === "auto" ? "Otomatik" : c === "tops" ? "Üst" : c === "bottoms" ? "Alt" : "Tek parça"}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
