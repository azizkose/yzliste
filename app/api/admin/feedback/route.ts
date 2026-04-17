import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

async function checkAdmin(req: NextRequest): Promise<boolean> {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) return false;
  const token = authHeader.replace("Bearer ", "");
  const { data: { user } } = await createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ).auth.getUser(token);
  if (!user) return false;
  const { data } = await supabaseAdmin.from("profiles").select("is_admin").eq("id", user.id).single();
  return data?.is_admin === true;
}

export async function GET(req: NextRequest) {
  if (!(await checkAdmin(req))) return NextResponse.json({ hata: "Yetkisiz" }, { status: 403 });

  const { searchParams } = req.nextUrl;
  const tur = searchParams.get("tur");
  const durum = searchParams.get("durum");

  let query = supabaseAdmin
    .from("user_feedback")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  if (tur) query = query.eq("type", tur);
  if (durum) query = query.eq("status", durum);

  const { data, error } = await query;
  if (error) return NextResponse.json({ hata: error.message }, { status: 500 });

  // Chat feedback (thumbs)
  const { data: chatFeedback } = await supabaseAdmin
    .from("feedback")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  return NextResponse.json({ userFeedback: data, chatFeedback: chatFeedback ?? [] });
}

export async function PATCH(req: NextRequest) {
  if (!(await checkAdmin(req))) return NextResponse.json({ hata: "Yetkisiz" }, { status: 403 });

  const { id, status } = await req.json();
  if (!id || !status) return NextResponse.json({ hata: "id ve status gerekli" }, { status: 400 });

  const { error } = await supabaseAdmin.from("user_feedback").update({ status }).eq("id", id);
  if (error) return NextResponse.json({ hata: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
