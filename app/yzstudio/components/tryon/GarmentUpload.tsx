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

  const chipBase = "text-xs px-3 py-1.5 rounded-lg border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rd-primary-500 focus-visible:ring-offset-1";
  const chipActive = "border-2 border-rd-primary-700 bg-rd-primary-50 text-rd-primary-700";
  const chipIdle = "border border-rd-neutral-300 text-rd-neutral-700 hover:border-rd-primary-400 hover:bg-rd-neutral-50";

  return (
    <div className="space-y-4">
      {/* P11-6: Ön/arka ayrı seans bilgisi */}
      <div className="rounded-lg border border-rd-neutral-200 bg-rd-neutral-50 px-4 py-3 text-xs text-rd-neutral-600 leading-relaxed">
        Kıyafetin ön ve arka tarafları farklıysa iki ayrı seans gerekiyor — bu modeli ön/arka için ayrı çalıştır. Yakında otomatik destek geliyor.
      </div>

      {/* Drop zone */}
      <div
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => !foto && inputRef.current?.click()}
        className={[
          "relative border rounded-xl overflow-hidden transition-colors bg-white",
          foto
            ? "border-rd-neutral-200"
            : "border-dashed border-rd-neutral-300 hover:border-rd-primary-500 cursor-pointer",
        ].join(" ")}
        style={{ minHeight: 260 }}
      >
        {foto ? (
          <div className="relative w-full" style={{ paddingBottom: "133%" }}>
            <Image src={foto} alt="Kıyafet" fill className="object-contain" />
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onFotoChange(null); }}
              aria-label="Fotoğrafı kaldır"
              className="absolute top-2 right-2 p-1 rounded bg-white/80 border border-rd-neutral-200 text-rd-neutral-600 hover:text-rd-neutral-900 transition-colors"
            >
              <X size={14} strokeWidth={1.5} aria-hidden="true" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 py-16 px-4 text-center">
            <div className="w-14 h-14 rounded-lg bg-rd-neutral-100 flex items-center justify-center mb-1">
              <ImageUp size={28} strokeWidth={1.5} className="text-rd-neutral-500" aria-hidden="true" />
            </div>
            <p className="text-sm font-medium text-rd-neutral-900">Fotoğraf yükle veya sürükle bırak</p>
            <p className="text-xs text-rd-neutral-500 mt-1">JPG, PNG — en fazla 10 MB</p>
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

      {/* Filters */}
      <div className="space-y-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-rd-neutral-500 mb-2">Fotoğraf tipi</p>
          <div className="flex gap-2 flex-wrap">
            {(["auto", "flat-lay", "model"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => onPhotoTypeChange(t)}
                aria-pressed={garmentPhotoType === t}
                className={`${chipBase} ${garmentPhotoType === t ? chipActive : chipIdle}`}
              >
                {t === "auto" ? "Otomatik" : t === "flat-lay" ? "Düz/askı" : "Mankendeki"}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-rd-neutral-500 mb-2">Kategori</p>
          <div className="flex gap-2 flex-wrap">
            {(["auto", "tops", "bottoms", "one-pieces"] as const).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => onCategoryChange(c)}
                aria-pressed={category === c}
                className={`${chipBase} ${category === c ? chipActive : chipIdle}`}
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
