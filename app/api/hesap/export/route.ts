import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET() {
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

  const [profileRes, generationsRes, paymentsRes] = await Promise.all([
    adminSupabase.from("profiles").select("*").eq("id", user.id).single(),
    adminSupabase.from("generations").select("id, platform, sonuc, created_at").eq("user_id", user.id).order("created_at", { ascending: false }),
    adminSupabase.from("payments").select("id, amount, status, created_at").eq("user_id", user.id).order("created_at", { ascending: false }),
  ]);

  const exportData = {
    meta: {
      export_date: new Date().toISOString(),
      user_id: user.id,
      email: user.email,
    },
    profil: profileRes.data ?? {},
    uretimler: generationsRes.data ?? [],
    odemeler: paymentsRes.data ?? [],
  };

  return new NextResponse(JSON.stringify(exportData, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="yzliste-verilerim-${new Date().toISOString().split("T")[0]}.json"`,
    },
  });
}
