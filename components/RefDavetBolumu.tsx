"use client";
import { useEffect, useState } from "react";
import { Gift, Smartphone, Check } from "lucide-react";

interface RefStats {
  referralCode: string | null;
  kayit: number;
  tamamlanan: number;
  kazanilanKredi: number;
}

export default function RefDavetBolumu({ userId }: { userId: string }) {
  const [stats, setStats] = useState<RefStats | null>(null);
  const [kopyalandi, setKopyalandi] = useState(false);

  useEffect(() => {
    fetch(`/api/referral/stats?userId=${userId}`)
      .then((r) => r.json())
      .then(setStats);
  }, [userId]);

  if (!stats?.referralCode) return null;

  const link = `${typeof window !== "undefined" ? window.location.origin : "https://yzliste.com"}/r/${stats.referralCode}`;
  const whatsappMetin = encodeURIComponent(
    `yzliste.com ile pazaryeri içeriklerimi AI ile üretiyorum. Bu linkle kayıt ol, ilk satın almanda ikimiz de +10 kredi kazanalım ${link}`
  );
  const twitterMetin = encodeURIComponent(
    `yzliste ile e-ticaret içeriklerimi AI üretiyor. İlk satın almanda ikinize +10 kredi hediye! ${link}`
  );

  const kopyala = async () => {
    await navigator.clipboard.writeText(link);
    setKopyalandi(true);
    setTimeout(() => setKopyalandi(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl border border-[#D8D6CE] p-5 mb-6">
      <div className="flex items-start gap-3 mb-4">
        <Gift size={20} strokeWidth={1.5} className="text-[#1E4DD8] flex-shrink-0 mt-0.5" />
        <div>
          <h2 className="text-sm font-medium text-[#1A1A17]">Arkadaşını davet et</h2>
          <p className="text-xs text-[#908E86] mt-0.5">Arkadaşın ilk satın almasını yapınca <strong className="font-medium">ikinize +10 kredi</strong> hediye!</p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <div className="flex-1 bg-[#F1F0EB] border border-[#D8D6CE] rounded-lg px-3 py-2 text-xs text-[#5A5852] truncate font-mono">
          {link}
        </div>
        <button
          onClick={kopyala}
          className="flex-shrink-0 bg-[#1E4DD8] hover:bg-[#163B9E] text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-1"
        >
          {kopyalandi ? (
            <>
              <Check size={12} strokeWidth={2} /> Kopyalandı
            </>
          ) : (
            "Kopyala"
          )}
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        <a
          href={`https://wa.me/?text=${whatsappMetin}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[#0F5132] hover:bg-[#0a3d25] text-white text-xs font-medium transition-colors"
        >
          <Smartphone size={14} strokeWidth={1.5} /> WhatsApp
        </a>
        <a
          href={`https://twitter.com/intent/tweet?text=${twitterMetin}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[#1E4DD8] hover:bg-[#163B9E] text-white text-xs font-medium transition-colors"
        >
          Twitter/X
        </a>
      </div>

      <div className="grid grid-cols-3 gap-3 text-center">
        {[
          { label: "Kayıt olan", deger: stats.kayit, renk: "text-[#1E4DD8]" },
          { label: "Satın alan", deger: stats.tamamlanan, renk: "text-[#0F5132]" },
          { label: "Kazanılan kredi", deger: stats.kazanilanKredi, renk: "text-[#A87847]" },
        ].map((m) => (
          <div key={m.label} className="bg-[#F1F0EB] rounded-lg p-3">
            <p className={`text-lg font-medium ${m.renk}`}>{m.deger}</p>
            <p className="text-xs text-[#908E86]">{m.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
