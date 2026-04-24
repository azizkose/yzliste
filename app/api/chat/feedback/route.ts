import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function POST(req: NextRequest) {
  const { sessionId, rating, comment, pageUrl, userId } = await req.json();
  if (!sessionId || !rating) {
    return NextResponse.json({ hata: "sessionId ve rating gerekli" }, { status: 400 });
  }
  const { error } = await supabaseAdmin.from("feedback").insert({
    session_id: sessionId,
    rating,
    comment: comment || null,
    page_url: pageUrl || null,
    user_id: userId || null,
  });
  if (error) return NextResponse.json({ hata: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
