"use client";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

type UserFeedback = {
  id: string;
  type: "bug" | "suggestion" | "complaint" | "other";
  message: string;
  email: string | null;
  page_url: string | null;
  created_at: string;
  status: "new" | "read" | "resolved";
};

type ChatFeedback = {
  id: string;
  session_id: string;
  rating: "up" | "down";
  comment: string | null;
  created_at: string;
};

const TUR_ETIKET: Record<string, { label: string; renk: string }> = {
  bug:        { label: "🐛 Hata",    renk: "bg-red-100 text-red-700" },
  suggestion: { label: "💡 Öneri",   renk: "bg-blue-100 text-blue-700" },
  complaint:  { label: "😟 Şikayet", renk: "bg-amber-100 text-amber-700" },
  other:      { label: "📝 Diğer",   renk: "bg-gray-100 text-gray-700" },
};

const DURUM_ETIKET: Record<string, { label: string; renk: string }> = {
  new:      { label: "Yeni",     renk: "bg-indigo-100 text-indigo-700" },
  read:     { label: "Okundu",   renk: "bg-gray-100 text-gray-600" },
  resolved: { label: "Çözüldü", renk: "bg-emerald-100 text-emerald-700" },
};

export default function AdminFeedbackPage() {
  const [userFeedback, setUserFeedback] = useState<UserFeedback[]>([]);
  const [chatFeedback, setChatFeedback] = useState<ChatFeedback[]>([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [turFiltre, setTurFiltre] = useState("");
  const [durumFiltre, setDurumFiltre] = useState("");
  const [acikId, setAcikId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.access_token) setToken(session.access_token);
    });
  }, []);

  const yukle = useCallback(async () => {
    if (!token) return;
    setYukleniyor(true);
    const params = new URLSearchParams();
    if (turFiltre) params.set("tur", turFiltre);
    if (durumFiltre) params.set("durum", durumFiltre);
    const res = await fetch(`/api/admin/feedback?${params}`, {
      headers: { authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      setUserFeedback(data.userFeedback ?? []);
      setChatFeedback(data.chatFeedback ?? []);
    }
    setYukleniyor(false);
  }, [token, turFiltre, durumFiltre]);

  useEffect(() => { yukle(); }, [yukle]);

  const durumGuncelle = async (id: string, status: string) => {
    if (!token) return;
    await fetch("/api/admin/feedback", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", authorization: `Bearer ${token}` },
      body: JSON.stringify({ id, status }),
    });
    setUserFeedback((prev) => prev.map((f) => f.id === id ? { ...f, status: status as UserFeedback["status"] } : f));
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin" className="text-sm text-gray-400 hover:text-gray-600">← Admin</Link>
          <h1 className="text-2xl font-bold text-gray-900">Geri Bildirimler</h1>
        </div>

        {/* Filtreler */}
        <div className="flex flex-wrap gap-3 mb-6">
          <select value={turFiltre} onChange={(e) => setTurFiltre(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400">
            <option value="">Tüm türler</option>
            <option value="bug">🐛 Hata</option>
            <option value="suggestion">💡 Öneri</option>
            <option value="complaint">😟 Şikayet</option>
            <option value="other">📝 Diğer</option>
          </select>
          <select value={durumFiltre} onChange={(e) => setDurumFiltre(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400">
            <option value="">Tüm durumlar</option>
            <option value="new">Yeni</option>
            <option value="read">Okundu</option>
            <option value="resolved">Çözüldü</option>
          </select>
        </div>

        {/* Kullanıcı Geri Bildirimleri */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-8">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">Kullanıcı Geri Bildirimleri ({userFeedback.length})</h2>
          </div>
          {yukleniyor ? (
            <div className="p-8 text-center text-sm text-gray-400">Yükleniyor...</div>
          ) : userFeedback.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-400">Geri bildirim yok.</div>
          ) : (
            <div className="divide-y divide-gray-50">
              {userFeedback.map((f) => {
                const tur = TUR_ETIKET[f.type] ?? TUR_ETIKET.other;
                const durum = DURUM_ETIKET[f.status] ?? DURUM_ETIKET.new;
                const acik = acikId === f.id;
                return (
                  <div key={f.id} className="px-5 py-4">
                    <div className="flex items-start gap-3 flex-wrap">
                      <div className="flex gap-2 flex-shrink-0">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${tur.renk}`}>{tur.label}</span>
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${durum.renk}`}>{durum.label}</span>
                      </div>
                      <p className="text-sm text-gray-500 flex-1">{new Date(f.created_at).toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                      <div className="flex gap-2 flex-shrink-0">
                        {f.status !== "read" && (
                          <button onClick={() => durumGuncelle(f.id, "read")} className="text-xs border border-gray-200 px-2.5 py-1 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors">Okundu</button>
                        )}
                        {f.status !== "resolved" && (
                          <button onClick={() => durumGuncelle(f.id, "resolved")} className="text-xs bg-emerald-500 hover:bg-emerald-600 text-white px-2.5 py-1 rounded-lg transition-colors">Çözüldü</button>
                        )}
                      </div>
                    </div>
                    <button onClick={() => setAcikId(acik ? null : f.id)} className="mt-2 text-left w-full">
                      <p className={`text-sm text-gray-700 ${acik ? "" : "line-clamp-2"} leading-relaxed`}>{f.message}</p>
                    </button>
                    {acik && f.email && (
                      <p className="text-xs text-gray-400 mt-1">📧 {f.email}</p>
                    )}
                    {acik && f.page_url && (
                      <p className="text-xs text-gray-400 mt-0.5">🔗 {f.page_url}</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Chat Feedback (thumbs) */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">Chatbot Değerlendirmeleri ({chatFeedback.length})</h2>
          </div>
          {chatFeedback.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-400">Değerlendirme yok.</div>
          ) : (
            <div className="divide-y divide-gray-50">
              {chatFeedback.map((f) => (
                <div key={f.id} className="px-5 py-3 flex items-start gap-3">
                  <span className="text-xl flex-shrink-0">{f.rating === "up" ? "👍" : "👎"}</span>
                  <div className="flex-1 min-w-0">
                    {f.comment && <p className="text-sm text-gray-700">{f.comment}</p>}
                    <p className="text-xs text-gray-400 mt-0.5">{new Date(f.created_at).toLocaleDateString("tr-TR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
