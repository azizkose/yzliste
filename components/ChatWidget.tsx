"use client";

import { useState, useRef, useEffect } from "react";

interface Mesaj {
  rol: "kullanici" | "asistan";
  metin: string;
}

const KARSILAMA = "Merhaba! Sana nasil yardimci olabilirim? Urun listeleme, gorsel, paketler veya teknik bir konuda sorularin varsa buradayim.";

export default function ChatWidget() {
  const [acik, setAcik] = useState(false);
  const [mesajlar, setMesajlar] = useState<Mesaj[]>([
    { rol: "asistan", metin: KARSILAMA },
  ]);
  const [input, setInput] = useState("");
  const [yukleniyor, setYukleniyor] = useState(false);
  const mesajSonuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (mesajSonuRef.current) {
      mesajSonuRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [mesajlar, yukleniyor]);

  useEffect(() => {
    if (acik && inputRef.current) {
      inputRef.current.focus();
    }
  }, [acik]);

  const gonder = async () => {
    const metin = input.trim();
    if (!metin || yukleniyor) return;

    const yeniMesaj: Mesaj = { rol: "kullanici", metin };
    const guncelMesajlar = [...mesajlar, yeniMesaj];
    setMesajlar(guncelMesajlar);
    setInput("");
    setYukleniyor(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mesajlar: guncelMesajlar }),
      });
      const data = await res.json();
      if (data.cevap) {
        setMesajlar((prev) => [...prev, { rol: "asistan", metin: data.cevap }]);
      } else {
        throw new Error("bos cevap");
      }
    } catch {
      setMesajlar((prev) => [
        ...prev,
        {
          rol: "asistan",
          metin: "Bir hata olustu. destek@yzliste.com adresine yazabilirsin.",
        },
      ]);
    }
    setYukleniyor(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {acik && (
        <div className="mb-3 bg-white rounded-2xl shadow-2xl border border-gray-100 w-80 flex flex-col overflow-hidden">
          <div className="bg-indigo-500 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
              <span className="text-white text-sm font-semibold">yzliste</span>
            </div>
            <button
              onClick={() => setAcik(false)}
              className="text-white/80 hover:text-white text-xl leading-none"
            >
              x
            </button>
          </div>

          <div className="flex-1 p-4 space-y-3 h-72 overflow-y-auto bg-gray-50">
            {mesajlar.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.rol === "kullanici" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-xl text-xs leading-relaxed whitespace-pre-wrap ${
                    m.rol === "kullanici"
                      ? "bg-indigo-500 text-white"
                      : "bg-white text-gray-700 border border-gray-100 shadow-sm"
                  }`}
                >
                  {m.metin}
                </div>
              </div>
            ))}
            {yukleniyor && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-100 shadow-sm px-3 py-2 rounded-xl">
                  <span className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </span>
                </div>
              </div>
            )}
            <div ref={mesajSonuRef} />
          </div>

          <div className="p-3 border-t border-gray-100 bg-white flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && gonder()}
              placeholder="Mesajinizi yazin..."
              disabled={yukleniyor}
              className="flex-1 text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-400 disabled:bg-gray-50"
            />
            <button
              onClick={gonder}
              disabled={yukleniyor || !input.trim()}
              className="bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-300 text-white px-3 py-2 rounded-lg text-xs font-medium transition-colors"
            >
              Gonder
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setAcik(!acik)}
        className="bg-indigo-500 hover:bg-indigo-600 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl transition-all hover:scale-105"
        title="yzliste destek"
      >
        💬
      </button>
    </div>
  );
}
