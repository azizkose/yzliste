"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

interface Props {
  sessionId?: string;
  platform?: string;
  category?: string;
}

export default function GenerationFeedback({ sessionId, platform, category }: Props) {
  const [rating, setRating] = useState<"up" | "down" | null>(null);
  const [showComment, setShowComment] = useState(false);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleRate = async (value: "up" | "down") => {
    setRating(value);
    if (value === "down") {
      setShowComment(true);
      return;
    }
    await submitFeedback(value, "");
  };

  const submitFeedback = async (r: "up" | "down", c: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      await supabase.from("feedback").insert({
        session_id: sessionId || crypto.randomUUID(),
        rating: r,
        comment: c || null,
        page_url: "/uret",
        user_id: session?.user?.id || null,
      });

      if (typeof window !== "undefined" && (window as unknown as { posthog?: { capture: (e: string, p: object) => void } }).posthog) {
        (window as unknown as { posthog: { capture: (e: string, p: object) => void } }).posthog.capture("generation_feedback", {
          rating: r,
          platform,
          category,
          has_comment: !!c,
        });
      }
    } catch {
      // Feedback kaybı kritik değil
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-400 mt-4">
        <span>✓</span> Geri bildiriminiz alındı, teşekkürler!
      </div>
    );
  }

  return (
    <div className="mt-4 pt-4 border-t border-gray-100">
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-500">Bu sonuç faydalı oldu mu?</span>
        <button
          onClick={() => handleRate("up")}
          className={`p-2 rounded-lg text-lg hover:bg-green-50 transition-colors ${
            rating === "up" ? "bg-green-50 ring-2 ring-green-200" : ""
          }`}
          title="Evet, faydalı"
        >
          👍
        </button>
        <button
          onClick={() => handleRate("down")}
          className={`p-2 rounded-lg text-lg hover:bg-red-50 transition-colors ${
            rating === "down" ? "bg-red-50 ring-2 ring-red-200" : ""
          }`}
          title="Hayır, faydalı değil"
        >
          👎
        </button>
      </div>

      {showComment && (
        <div className="mt-3 flex gap-2">
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Ne eksik veya yanlış? (opsiyonel)"
            className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            maxLength={500}
          />
          <button
            onClick={() => submitFeedback("down", comment)}
            className="text-sm bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors"
          >
            Gönder
          </button>
        </div>
      )}
    </div>
  );
}
