import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function POST(req: NextRequest) {
  const { type, message, email, pageUrl, userId } = await req.json();
  if (!type || !message) {
    return NextResponse.json({ hata: "type ve message gerekli" }, { status: 400 });
  }
  const { error } = await supabaseAdmin.from("user_feedback").insert({
    type,
    message,
    email: email || null,
    page_url: pageUrl || null,
    user_id: userId || null,
  });
  if (error) return NextResponse.json({ hata: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
