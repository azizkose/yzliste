import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { createClient } from "@supabase/supabase-js";

/**
 * POST /api/consent
 * KVKK checkout onaylarını timestamp + IP ile kaydeder.
 */
export async function POST(req: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  const body = await req.json();
  const { kosullarOnay, mesafeliOnay, kvkkOnay, odemeId } = body;

  if (!kosullarOnay || !mesafeliOnay || !kvkkOnay) {
    return NextResponse.json({ hata: "Tüm onaylar gerekli" }, { status: 400 });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  const userAgent = req.headers.get("user-agent") ?? "unknown";

  const adminSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );

  const { error } = await adminSupabase.from("consent_log").insert({
    user_id: user?.id ?? null,
    odeme_id: odemeId ?? null,
    kosullar_onay: kosullarOnay,
    mesafeli_onay: mesafeliOnay,
    kvkk_onay: kvkkOnay,
    ip_adresi: ip,
    user_agent: userAgent,
  });

  if (error) {
    console.error("Consent log hatası:", error);
    // Log hatası ödemeyi engellememeli
  }

  return NextResponse.json({ ok: true });
}
