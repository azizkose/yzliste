"use client";
import { Download } from "lucide-react";

interface TryonVideoSonucProps {
  videoUrl: string;
  videoIlerleme: string;
  videoYukleniyor: boolean;
}

export function TryonVideoSonuc({ videoUrl, videoIlerleme, videoYukleniyor }: TryonVideoSonucProps) {
  if (videoYukleniyor) {
    return (
      <div className="flex items-center justify-center py-8 text-sm text-[#908E86]">
        {videoIlerleme || "Video oluşturuluyor..."}
      </div>
    );
  }

  if (!videoUrl) return null;

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-[#D8D6CE]">Video hazır</p>
      <div className="rounded-xl overflow-hidden border border-[#2A2A26] bg-[#1A1A17]">
        <video
          src={videoUrl}
          controls
          loop
          className="w-full"
          style={{ maxHeight: 480 }}
        />
      </div>
      <a
        href={videoUrl}
        download
        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-[#D8D6CE] text-[#D8D6CE] text-sm hover:bg-[#2A2A26] transition-colors"
      >
        <Download size={14} strokeWidth={1.5} />
        Video indir
      </a>
    </div>
  );
}
