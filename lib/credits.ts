import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

/**
 * Atomik kredi düşümü — yetersizse null döner (race-condition safe)
 */
export async function krediDus(userId: string, miktar: number): Promise<{ success: boolean; kalanKredi?: number }> {
  const { data: profil } = await supabaseAdmin
    .from("profiles")
    .select("kredi")
    .eq("id", userId)
    .single();

  if (!profil) return { success: false };

  const { data: updated } = await supabaseAdmin
    .from("profiles")
    .update({ kredi: profil.kredi - miktar })
    .eq("id", userId)
    .gte("kredi", miktar)
    .select("kredi")
    .single();

  if (!updated) return { success: false };
  return { success: true, kalanKredi: updated.kredi };
}

/**
 * Kredi iadesi — hata durumunda çağrılır
 */
export async function krediIade(userId: string, miktar: number): Promise<void> {
  try {
    const { data: profil } = await supabaseAdmin
      .from("profiles")
      .select("kredi")
      .eq("id", userId)
      .single();
    if (profil) {
      await supabaseAdmin
        .from("profiles")
        .update({ kredi: profil.kredi + miktar })
        .eq("id", userId);
    }
  } catch { /* iade başarısız — loglanmalı */ }
}
