"use client";
import { useEffect, useState } from "react";

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
    `yzliste.com ile pazaryeri içeriklerimi AI ile üretiyorum. Bu linkle kayıt ol, ilk satın almanda ikinize +10 kredi hediye 🎁 ${link}`
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
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
      <div className="flex items-start gap-3 mb-4">
        <span className="text-2xl flex-shrink-0">🎁</span>
        <div>
          <h2 className="text-sm font-semibold text-gray-800">Arkadaşını Davet Et</h2>
          <p className="text-xs text-gray-500 mt-0.5">Arkadaşın ilk satın almasını yapınca <strong>ikinize +10 kredi</strong> hediye!</p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-700 truncate font-mono">
          {link}
        </div>
        <button
          onClick={kopyala}
          className="flex-shrink-0 bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
        >
          {kopyalandi ? "✓ Kopyalandı" : "Kopyala"}
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        <a
          href={`https://wa.me/?text=${whatsappMetin}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold transition-colors"
        >
          <span>📲</span> WhatsApp
        </a>
        <a
          href={`https://twitter.com/intent/tweet?text=${twitterMetin}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold transition-colors"
        >
          <span>🐦</span> Twitter/X
        </a>
      </div>

      <div className="grid grid-cols-3 gap-3 text-center">
        {[
          { label: "Kayıt Olan", deger: stats.kayit, renk: "text-indigo-500" },
          { label: "Satın Alan", deger: stats.tamamlanan, renk: "text-emerald-500" },
          { label: "Kazanılan Kredi", deger: stats.kazanilanKredi, renk: "text-amber-500" },
        ].map((m) => (
          <div key={m.label} className="bg-gray-50 rounded-xl p-3">
            <p className={`text-lg font-bold ${m.renk}`}>{m.deger}</p>
            <p className="text-xs text-gray-400">{m.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
