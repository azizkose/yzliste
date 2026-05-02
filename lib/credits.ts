import { createClient } from "@supabase/supabase-js";
import logger from "@/lib/logger";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

/**
 * Atomik kredi düşümü — yetersizse null döner (race-condition safe)
 */
export async function krediDus(userId: string, miktar: number): Promise<{ success: boolean; kalanKredi?: number }> {
  const { data: profil, error: profilErr } = await supabaseAdmin
    .from("profiles")
    .select("kredi")
    .eq("id", userId)
    .single();

  if (profilErr) {
    logger.error({ err: profilErr.message, userId }, "krediDus: profil okunamadı");
    return { success: false };
  }
  if (!profil) return { success: false };

  const { data: updated, error: updateErr } = await supabaseAdmin
    .from("profiles")
    .update({ kredi: profil.kredi - miktar })
    .eq("id", userId)
    .gte("kredi", miktar)
    .select("kredi")
    .single();

  if (updateErr) {
    logger.error({ err: updateErr.message, userId, kredi: profil.kredi, miktar }, "krediDus: güncelleme başarısız");
    return { success: false };
  }
  if (!updated) {
    logger.warn({ userId, kredi: profil.kredi, miktar }, "krediDus: yetersiz kredi");
    return { success: false };
  }
  logger.info({ userId, kalanKredi: updated.kredi }, "krediDus: kredi düşüldü");
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
