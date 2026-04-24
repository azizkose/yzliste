import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import logger from "@/lib/logger";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function POST(req: NextRequest) {
  const { userId, refCode } = await req.json();
  if (!userId || !refCode) return NextResponse.json({ ok: false });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  // Kod geçerli mi? Referrer bul
  const { data: referrer } = await supabase
    .from("profiles")
    .select("id")
    .eq("referral_code", refCode)
    .single();

  if (!referrer) return NextResponse.json({ ok: false, reason: "invalid_code" });

  // Self-referral engeli
  if (referrer.id === userId) return NextResponse.json({ ok: false, reason: "self_referral" });

  // Bu kullanıcı zaten başka referral'a bağlı mı?
  const { data: existing } = await supabase
    .from("referrals")
    .select("id")
    .eq("referred_id", userId)
    .single();
  if (existing) return NextResponse.json({ ok: false, reason: "already_linked" });

  // Aynı IP'den 24 saatte max 3 referral (fraud koruma)
  const yesterday = new Date(Date.now() - 86400000).toISOString();
  const { count: ipCount } = await supabase
    .from("referrals")
    .select("*", { count: "exact", head: true })
    .eq("ip_address", ip)
    .gte("created_at", yesterday);

  if ((ipCount ?? 0) >= 3) {
    logger.warn({ ip, userId }, "REF-01: IP rate limit aşıldı");
    return NextResponse.json({ ok: false, reason: "ip_rate_limit" });
  }

  // Referrer'ın bekleyen referral kaydı var mı? Varsa güncelle, yoksa oluştur
  const { data: pendingRef } = await supabase
    .from("referrals")
    .select("id")
    .eq("referrer_id", referrer.id)
    .eq("referred_id", null)
    .eq("status", "pending")
    .gte("expires_at", new Date().toISOString())
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (pendingRef) {
    await supabase
      .from("referrals")
      .update({ referred_id: userId, status: "registered", registered_at: new Date().toISOString(), ip_address: ip })
      .eq("id", pendingRef.id);
  } else {
    await supabase.from("referrals").insert({
      referrer_id: referrer.id,
      referred_id: userId,
      referral_code: refCode,
      status: "registered",
      registered_at: new Date().toISOString(),
      ip_address: ip,
    });
  }

  return NextResponse.json({ ok: true });
}
