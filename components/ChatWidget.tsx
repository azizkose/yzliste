"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface Mesaj {
  rol: "kullanici" | "asistan";
  metin: string;
}

type FeedbackDurum = "bekleniyor" | "verildi";
type FormMod = "yok" | "form";

const KARSILAMA =
  "Merhaba! yzliste hakkında sorularını cevaplayabilirim. Bir önerim veya şikayetin varsa 'öneri' veya 'şikayet' yaz.";

const SESSION_ID = Math.random().toString(36).slice(2);

const SIKAYET_TETIKLEYICI = /\b(öneri|önerim|şikayet|şikayetim|bug|hata|sorun|problem|suggestion|complaint)\b/i;

export default function ChatWidget() {
  const [acik, setAcik] = useState(false);
  const [mesajlar, setMesajlar] = useState<Mesaj[]>([
    { rol: "asistan", metin: KARSILAMA },
  ]);
  const [input, setInput] = useState("");
  const [yukleniyor, setYukleniyor] = useState(false);

  // CB-04: thumbs up/down
  const [feedbackDurum, setFeedbackDurum] = useState<FeedbackDurum>("bekleniyor");
  const [feedbackYorum, setFeedbackYorum] = useState("");
  const [feedbackAcik, setFeedbackAcik] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState<"up" | "down" | null>(null);

  // CB-05: öneri/şikayet form modu
  const [formMod, setFormMod] = useState<FormMod>("yok");
  const [formTur, setFormTur] = useState<"bug" | "suggestion" | "complaint" | "other">("suggestion");
  const [formMesaj, setFormMesaj] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formGonderildi, setFormGonderildi] = useState(false);
  const [formYukleniyor, setFormYukleniyor] = useState(false);

  const mesajSonuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    mesajSonuRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mesajlar, yukleniyor, feedbackAcik]);

  useEffect(() => {
    if (acik) inputRef.current?.focus();
  }, [acik]);

  const gonder = useCallback(async () => {
    const metin = input.trim();
    if (!metin || yukleniyor) return;

    // CB-05: keyword detection
    if (SIKAYET_TETIKLEYICI.test(metin)) {
      setMesajlar((prev) => [
        ...prev,
        { rol: "kullanici", metin },
        { rol: "asistan", metin: "Tabii! Geri bildirimini aşağıdaki formu doldurarak iletebilirsin 👇" },
      ]);
      setInput("");
      const tur = /\b(bug|hata|sorun|problem)\b/i.test(metin)
        ? "bug"
        : /\b(şikayet|complaint)\b/i.test(metin)
        ? "complaint"
        : "suggestion";
      setFormTur(tur);
      setFormMod("form");
      setFormGonderildi(false);
      setFormMesaj("");
      return;
    }

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
        { rol: "asistan", metin: "Bir hata oluştu. destek@yzliste.com adresine yazabilirsin." },
      ]);
    }
    setYukleniyor(false);
  }, [input, yukleniyor, mesajlar]);

  const thumbsTikla = async (rating: "up" | "down") => {
    setFeedbackRating(rating);
    setFeedbackAcik(true);
  };

  const feedbackGonder = async () => {
    if (!feedbackRating) return;
    setFeedbackDurum("verildi");
    setFeedbackAcik(false);
    await fetch("/api/chat/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: SESSION_ID,
        rating: feedbackRating,
        comment: feedbackYorum || null,
        pageUrl: window.location.pathname,
      }),
    }).catch(() => null);
  };

  const formGonder = async () => {
    if (!formMesaj.trim()) return;
    setFormYukleniyor(true);
    await fetch("/api/chat/user-feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: formTur,
        message: formMesaj,
        email: formEmail || null,
        pageUrl: window.location.pathname,
      }),
    }).catch(() => null);
    setFormYukleniyor(false);
    setFormGonderildi(true);
    setFormMod("yok");
    setMesajlar((prev) => [
      ...prev,
      { rol: "asistan", metin: "Teşekkürler, geri bildirimini aldık! En kısa sürede inceleyeceğiz. 🙏" },
    ]);
  };

  const gosterFeedback = mesajlar.length >= 4 && feedbackDurum === "bekleniyor";

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {acik && (
        <div className="mb-3 bg-white rounded-2xl shadow-2xl border border-gray-100 w-80 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-indigo-500 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
              <span className="text-white text-sm font-semibold">yzliste</span>
            </div>
            <button onClick={() => setAcik(false)} className="text-white/80 hover:text-white text-xl leading-none">
              ×
            </button>
          </div>

          {/* Mesaj alanı */}
          <div className="flex-1 p-4 space-y-3 h-72 overflow-y-auto bg-gray-50">
            {mesajlar.map((m, i) => (
              <div key={i} className={`flex ${m.rol === "kullanici" ? "justify-end" : "justify-start"}`}>
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

            {/* CB-05: Öneri/Şikayet Formu */}
            {formMod === "form" && !formGonderildi && (
              <div className="bg-white border border-indigo-100 rounded-xl p-3 space-y-2.5 shadow-sm">
                <p className="text-xs font-semibold text-gray-700">Geri Bildirim Formu</p>
                <select
                  value={formTur}
                  onChange={(e) => setFormTur(e.target.value as typeof formTur)}
                  className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-400"
                >
                  <option value="suggestion">💡 Öneri</option>
                  <option value="bug">🐛 Hata / Bug</option>
                  <option value="complaint">😟 Şikayet</option>
                  <option value="other">📝 Diğer</option>
                </select>
                <textarea
                  value={formMesaj}
                  onChange={(e) => setFormMesaj(e.target.value)}
                  placeholder="Mesajın..."
                  rows={3}
                  className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs resize-none focus:outline-none focus:ring-1 focus:ring-indigo-400"
                />
                <input
                  type="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="E-posta (isteğe bağlı)"
                  className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-400"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setFormMod("yok")}
                    className="flex-1 text-xs border border-gray-200 rounded-lg py-1.5 text-gray-500 hover:bg-gray-50 transition-colors"
                  >
                    İptal
                  </button>
                  <button
                    onClick={formGonder}
                    disabled={!formMesaj.trim() || formYukleniyor}
                    className="flex-1 text-xs bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-300 text-white rounded-lg py-1.5 font-medium transition-colors"
                  >
                    {formYukleniyor ? "..." : "Gönder"}
                  </button>
                </div>
              </div>
            )}

            {/* CB-04: Thumbs up/down — 3+ mesajdan sonra */}
            {gosterFeedback && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-center gap-3">
                  <p className="text-[10px] text-gray-400">Yardımcı oldu mu?</p>
                  <button
                    onClick={() => thumbsTikla("up")}
                    className={`text-base transition-transform hover:scale-125 ${feedbackRating === "up" ? "opacity-100" : "opacity-60 hover:opacity-100"}`}
                  >
                    👍
                  </button>
                  <button
                    onClick={() => thumbsTikla("down")}
                    className={`text-base transition-transform hover:scale-125 ${feedbackRating === "down" ? "opacity-100" : "opacity-60 hover:opacity-100"}`}
                  >
                    👎
                  </button>
                </div>
                {feedbackAcik && (
                  <div className="bg-white border border-gray-100 rounded-xl p-2.5 space-y-2 shadow-sm">
                    <textarea
                      value={feedbackYorum}
                      onChange={(e) => setFeedbackYorum(e.target.value)}
                      placeholder="Yorum ekle (isteğe bağlı)..."
                      rows={2}
                      className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs resize-none focus:outline-none focus:ring-1 focus:ring-indigo-400"
                    />
                    <button
                      onClick={feedbackGonder}
                      className="w-full text-xs bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg py-1.5 font-medium transition-colors"
                    >
                      Gönder
                    </button>
                  </div>
                )}
              </div>
            )}

            {feedbackDurum === "verildi" && (
              <p className="text-center text-[10px] text-gray-400">Geri bildirim için teşekkürler! 🙏</p>
            )}

            <div ref={mesajSonuRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-100 bg-white flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && gonder()}
              placeholder="Mesajınızı yazın..."
              disabled={yukleniyor}
              className="flex-1 text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-400 disabled:bg-gray-50"
            />
            <button
              onClick={gonder}
              disabled={yukleniyor || !input.trim()}
              className="bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-300 text-white px-3 py-2 rounded-lg text-xs font-medium transition-colors"
            >
              Gönder
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
