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
  if (!(await checkAdmin(req))) {
    return NextResponse.json({ hata: "Yetkisiz" }, { status: 403 });
  }

  const period = req.nextUrl.searchParams.get("period") || "all";

  let startDate: string | null = null;
  if (period === "today") {
    const d = new Date(); d.setHours(0, 0, 0, 0); startDate = d.toISOString();
  } else if (period === "week") {
    const d = new Date(); d.setDate(d.getDate() - 7); startDate = d.toISOString();
  } else if (period === "month") {
    const d = new Date(); d.setMonth(d.getMonth() - 1); startDate = d.toISOString();
  }

  const bugun = new Date(); bugun.setHours(0, 0, 0, 0);
  const haftaBasi = new Date(); haftaBasi.setDate(haftaBasi.getDate() - 7);

  const uretimlerCount = startDate
    ? supabaseAdmin.from("uretimler").select("*", { count: "exact", head: true }).gte("created_at", startDate)
    : supabaseAdmin.from("uretimler").select("*", { count: "exact", head: true });

  const tokenQuery = startDate
    ? supabaseAdmin.from("uretimler").select("input_token, output_token, api_cost").gte("created_at", startDate)
    : supabaseAdmin.from("uretimler").select("input_token, output_token, api_cost");

  const platformQuery = startDate
    ? supabaseAdmin.from("uretimler").select("platform").gte("created_at", startDate)
    : supabaseAdmin.from("uretimler").select("platform");

  const girisTipiQuery = startDate
    ? supabaseAdmin.from("uretimler").select("giris_tipi").gte("created_at", startDate)
    : supabaseAdmin.from("uretimler").select("giris_tipi");

  const [
    { count: toplamKullanici },
    { count: toplamUretim },
    { count: bugunUretim },
    { count: buHaftaUretim },
    { data: krediler },
    { data: tokenData },
    { data: platformData },
    { data: girisTipiData },
    { data: sonKullanicilar },
    { data: sonUretimler },
    { data: todayCostData },
  ] = await Promise.all([
    supabaseAdmin.from("profiles").select("*", { count: "exact", head: true }),
    uretimlerCount,
    supabaseAdmin.from("uretimler").select("*", { count: "exact", head: true }).gte("created_at", bugun.toISOString()),
    supabaseAdmin.from("uretimler").select("*", { count: "exact", head: true }).gte("created_at", haftaBasi.toISOString()),
    supabaseAdmin.from("profiles").select("kredi"),
    tokenQuery,
    platformQuery,
    girisTipiQuery,
    supabaseAdmin.from("profiles").select("email, kredi, created_at").order("created_at", { ascending: false }).limit(10),
    supabaseAdmin.from("uretimler").select("urun_adi, platform, created_at, input_token, output_token, api_cost").order("created_at", { ascending: false }).limit(10),
    supabaseAdmin.from("uretimler").select("api_cost").gte("created_at", bugun.toISOString()),
  ]);

  const toplamKredi = krediler?.reduce((acc, p) => acc + (p.kredi || 0), 0) || 0;
  const toplamInputToken = tokenData?.reduce((acc, u) => acc + (u.input_token || 0), 0) || 0;
  const toplamOutputToken = tokenData?.reduce((acc, u) => acc + (u.output_token || 0), 0) || 0;
  const toplamApiMaliyet = tokenData?.reduce((acc, u) => acc + (u.api_cost || 0), 0) || 0;
  const bugunMaliyet = todayCostData?.reduce((acc, u) => acc + (u.api_cost || 0), 0) || 0;

  const platformDagilim: Record<string, number> = {};
  platformData?.forEach((u) => { platformDagilim[u.platform] = (platformDagilim[u.platform] || 0) + 1; });

  const girisTipiDagilim: Record<string, number> = {};
  girisTipiData?.forEach((u) => { girisTipiDagilim[u.giris_tipi] = (girisTipiDagilim[u.giris_tipi] || 0) + 1; });

  return NextResponse.json({
    toplamKullanici: toplamKullanici || 0,
    toplamUretim: toplamUretim || 0,
    bugunUretim: bugunUretim || 0,
    buHaftaUretim: buHaftaUretim || 0,
    toplamKredi,
    toplamInputToken,
    toplamOutputToken,
    toplamApiMaliyet,
    bugunMaliyet,
    platformDagilim,
    girisTipiDagilim,
    sonKullanicilar: sonKullanicilar || [],
    sonUretimler: sonUretimler || [],
  });
}
