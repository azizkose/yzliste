import { NextRequest, NextResponse } from "next/server";
import { fal } from "@fal-ai/client";
import { createClient } from "@supabase/supabase-js";
import { VIDEO_KREDI, TRYON_VIDEO_PRESETLER } from "@/lib/studio-constants";
import logger from "@/lib/logger";

export const maxDuration = 120;

fal.config({ credentials: process.env.FAL_KEY });

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    tryonImageUrl,
    preset,
    sure,
    userId,
  }: { tryonImageUrl: string; preset: string; sure: "5" | "10"; userId: string } = body;

  if (!tryonImageUrl || !tryonImageUrl.startsWith("https://")) {
    return NextResponse.json({ hata: "Geçerli giydirme görseli URL'i gerekli" }, { status: 400 });
  }
  if (!preset || !sure || !userId) {
    return NextResponse.json({ hata: "Eksik parametre" }, { status: 400 });
  }

  const presetData = TRYON_VIDEO_PRESETLER.find((p) => p.id === preset);
  if (!presetData) {
    return NextResponse.json({ hata: "Geçersiz video stili" }, { status: 400 });
  }

  const gerekliKredi = VIDEO_KREDI[sure];

  const { data: profil } = await supabaseAdmin
    .from("profiles")
    .select("kredi, is_admin, is_test")
    .eq("id", userId)
    .single();

  if (!profil) return NextResponse.json({ hata: "Kullanıcı bulunamadı" }, { status: 404 });

  const isAdmin = profil.is_admin === true || profil.is_test === true;

  if (!isAdmin) {
    const { data: updated } = await supabaseAdmin
      .from("profiles")
      .update({ kredi: profil.kredi - gerekliKredi })
      .eq("id", userId)
      .gte("kredi", gerekliKredi)
      .select("kredi")
      .single();

    if (!updated) {
      return NextResponse.json({
        hata: `Yetersiz kredi. Bu işlem için ${gerekliKredi} kredi gerekli.`
      }, { status: 402 });
    }
  }

  try {
    const queued = await fal.queue.submit("fal-ai/kling-video/v2.1/standard/image-to-video", {
      input: {
        image_url: tryonImageUrl,
        prompt: presetData.prompt,
        duration: sure,
        aspect_ratio: "9:16",
      },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    return NextResponse.json({ requestId: queued.request_id, kullanilanKredi: gerekliKredi });
  } catch (e: unknown) {
    if (!isAdmin) {
      try {
        const { data: p } = await supabaseAdmin.from("profiles").select("kredi").eq("id", userId).single();
        if (p) await supabaseAdmin.from("profiles").update({ kredi: p.kredi + gerekliKredi }).eq("id", userId);
      } catch { /* iade başarısız */ }
    }
    const err = e as { message?: string };
    logger.error({ err: err?.message }, "studio tryon video hatası");
    return NextResponse.json({ hata: "Video oluşturulamadı: " + (err?.message || "bilinmiyor") }, { status: 500 });
  }
}
