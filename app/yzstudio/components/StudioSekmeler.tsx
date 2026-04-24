"use client";

interface StudioSekmelerProps {
  aktif: string;
  onChange: (id: string) => void;
}

export function StudioSekmeler({ aktif, onChange }: StudioSekmelerProps) {
  return (
    <div className="border-b border-[#D8D6CE] bg-white px-4">
      <div className="max-w-5xl mx-auto">
        <div role="tablist" className="flex gap-4">
          <button
            role="tab"
            aria-selected={aktif === "tryon"}
            onClick={() => onChange("tryon")}
            className={`py-3 border-b-2 text-sm font-medium transition-colors ${
              aktif === "tryon"
                ? "border-[#1E4DD8] text-[#1A1A17]"
                : "border-transparent text-[#908E86] hover:text-[#5A5852]"
            }`}
          >
            Mankene giydirme
          </button>
          <button
            role="tab"
            disabled
            className="py-3 border-b-2 border-transparent text-sm text-[#908E86] cursor-not-allowed"
            title="Yakında"
          >
            Stüdyo çekimi <span className="text-xs text-[#A87847] ml-1">yakında</span>
          </button>
          <button
            role="tab"
            disabled
            className="py-3 border-b-2 border-transparent text-sm text-[#908E86] cursor-not-allowed"
            title="Yakında"
          >
            Arka plan değiştirme <span className="text-xs text-[#A87847] ml-1">yakında</span>
          </button>
        </div>
      </div>
    </div>
  );
}
