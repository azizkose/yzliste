import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId gerekli" }, { status: 400 });

  const [{ data: profile }, { data: referrals }] = await Promise.all([
    supabase.from("profiles").select("referral_code").eq("id", userId).single(),
    supabase
      .from("referrals")
      .select("id, status, reward_given, registered_at, completed_at")
      .eq("referrer_id", userId),
  ]);

  const refs = referrals ?? [];
  const kayit = refs.filter((r) => ["registered", "completed"].includes(r.status)).length;
  const tamamlanan = refs.filter((r) => r.status === "completed").length;
  const kazanilanKredi = refs.filter((r) => r.reward_given).length * 10;

  return NextResponse.json({
    referralCode: profile?.referral_code ?? null,
    kayit,
    tamamlanan,
    kazanilanKredi,
  });
}
