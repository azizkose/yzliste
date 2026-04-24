"use client";
import { STUDIO_TOOLS } from "@/lib/studio-constants";

interface StudioSekmelerProps {
  aktif: string;
  onChange: (id: string) => void;
}

export function StudioSekmeler({ aktif, onChange }: StudioSekmelerProps) {
  return (
    <nav className="flex gap-1 px-4 border-b border-[#2A2A26] bg-[#1A1A17]">
      {STUDIO_TOOLS.map((tool) => (
        <button
          key={tool.id}
          onClick={() => onChange(tool.id)}
          className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
            aktif === tool.id
              ? "border-[#1E4DD8] text-[#BAC9EB]"
              : "border-transparent text-[#908E86] hover:text-[#D8D6CE]"
          }`}
        >
          {tool.etiket}
        </button>
      ))}
    </nav>
  );
}
