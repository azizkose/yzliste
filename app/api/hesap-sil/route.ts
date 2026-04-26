import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies, headers } from "next/headers";

export async function DELETE() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ hata: "Oturum bulunamadı" }, { status: 401 });

  const adminSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );

  // F-09c: Soft delete — deleted_at set et, 30 gün sonra cron siler
  const { error: softDeleteError } = await adminSupabase
    .from("profiles")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", user.id);

  if (softDeleteError) {
    return NextResponse.json({ hata: "Hesap silinemedi" }, { status: 500 });
  }

  // F-09d: KVKK denetim logu
  const reqHeaders = await headers();
  const ip = reqHeaders.get("x-forwarded-for")?.split(",")[0].trim()
    ?? reqHeaders.get("x-real-ip")
    ?? "unknown";
  const userAgent = reqHeaders.get("user-agent") ?? "";

  await adminSupabase.from("deletion_log").insert({
    user_id: user.id,
    email: user.email,
    ip_address: ip,
    user_agent: userAgent,
  });

  // Oturumu kapat
  await supabase.auth.signOut();

  return NextResponse.json({ basarili: true });
}
