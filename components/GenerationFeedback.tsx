"use client";

import { useState } from "react";
import { Check, ThumbsUp, ThumbsDown } from "lucide-react";
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
      <div className="flex items-center gap-2 text-sm text-[#908E86] mt-4">
        <Check size={14} strokeWidth={2} /> Geri bildiriminiz alındı, teşekkürler!
      </div>
    );
  }

  return (
    <div className="mt-4 pt-4 border-t border-[#D8D6CE]">
      <div className="flex items-center gap-3">
        <span className="text-sm text-[#5A5852]">Bu sonuç faydalı oldu mu?</span>
        <button
          onClick={() => handleRate("up")}
          className={`p-2 rounded-lg hover:bg-[#E8F5EE] transition-colors ${
            rating === "up" ? "bg-[#E8F5EE] ring-2 ring-[#0F5132]/20" : ""
          }`}
          title="Evet, faydalı"
        >
          <ThumbsUp size={16} strokeWidth={1.5} className={rating === "up" ? "text-[#0F5132]" : "text-[#908E86]"} />
        </button>
        <button
          onClick={() => handleRate("down")}
          className={`p-2 rounded-lg hover:bg-[#FCECEC] transition-colors ${
            rating === "down" ? "bg-[#FCECEC] ring-2 ring-[#7A1E1E]/20" : ""
          }`}
          title="Hayır, faydalı değil"
        >
          <ThumbsDown size={16} strokeWidth={1.5} className={rating === "down" ? "text-[#7A1E1E]" : "text-[#908E86]"} />
        </button>
      </div>

      {showComment && (
        <div className="mt-3 flex gap-2">
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Ne eksik veya yanlış? (opsiyonel)"
            className="flex-1 text-sm border border-[#D8D6CE] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#BAC9EB]"
            maxLength={500}
          />
          <button
            onClick={() => submitFeedback("down", comment)}
            className="text-sm bg-[#1E4DD8] text-white px-4 py-2 rounded-lg hover:bg-[#163B9E] transition-colors"
          >
            Gönder
          </button>
        </div>
      )}
    </div>
  );
}
