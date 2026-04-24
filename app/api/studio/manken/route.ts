import { NextRequest, NextResponse } from "next/server";
import { fal } from "@fal-ai/client";
import { createClient } from "@supabase/supabase-js";
import { MANKEN_KREDI, MANKEN_SECENEKLER } from "@/lib/studio-constants";
import logger from "@/lib/logger";

export const maxDuration = 60;

fal.config({ credentials: process.env.FAL_KEY });

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

function promptOlustur(params: {
  cinsiyet: string;
  tenRengi: string;
  vucutTipi: string;
  boy: string;
  serbest: string;
}): string {
  const cinsiyetStr = params.cinsiyet === "erkek" ? "male man" : "female woman";

  const tenSec = MANKEN_SECENEKLER.tenRengi.find(t => t.id === params.tenRengi);
  const vucutSec = MANKEN_SECENEKLER.vucutTipi.find(v => v.id === params.vucutTipi);
  const boySec = MANKEN_SECENEKLER.boy.find(b => b.id === params.boy);

  const tenPrompt = tenSec?.prompt ?? "medium skin";
  const vucutPrompt = vucutSec?.prompt ?? "average build";
  const boyPrompt = boySec?.prompt ?? "average height";

  const extra = params.serbest?.trim() ? `, ${params.serbest.trim()}` : "";

  return `full length fashion model photo showing entire body from top of head to feet, legs fully visible, feet on ground, ${cinsiyetStr}, ${tenPrompt}, ${vucutPrompt}, ${boyPrompt}, white seamless studio background, soft studio lighting, face clearly visible, standing straight, arms at sides, wearing simple neutral solid color outfit, editorial fashion photography, professional studio shot${extra}`;
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    cinsiyet = "kadin",
    tenRengi = "bugday",
    vucutTipi = "orta",
    boy = "orta",
    serbest = "",
    userId,
  } = body;

  if (!userId) {
    return NextResponse.json({ hata: "Oturum gerekli" }, { status: 401 });
  }

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
      .update({ kredi: profil.kredi - MANKEN_KREDI })
      .eq("id", userId)
      .gte("kredi", MANKEN_KREDI)
      .select("kredi")
      .single();

    if (!updated) {
      return NextResponse.json({
        hata: `Yetersiz kredi. Manken üretimi için ${MANKEN_KREDI} kredi gerekli.`
      }, { status: 402 });
    }
  }

  try {
    const prompt = promptOlustur({ cinsiyet, tenRengi, vucutTipi, boy, serbest });

    const result = await fal.subscribe("fal-ai/flux-pro/v1.1", {
      input: {
        prompt,
        image_size: { width: 768, height: 1280 },
        num_inference_steps: 28,
        guidance_scale: 3.5,
        num_images: 1,
        safety_tolerance: "5",
      },
      logs: false,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const imageUrl = (result as any)?.data?.images?.[0]?.url;
    if (!imageUrl) throw new Error("Görsel URL'i alınamadı");

    return NextResponse.json({ imageUrl, kullanilanKredi: MANKEN_KREDI });
  } catch (e: unknown) {
    if (!isAdmin) {
      try {
        const { data: p } = await supabaseAdmin.from("profiles").select("kredi").eq("id", userId).single();
        if (p) await supabaseAdmin.from("profiles").update({ kredi: p.kredi + MANKEN_KREDI }).eq("id", userId);
      } catch { /* iade başarısız */ }
    }
    const err = e as { message?: string };
    logger.error({ err: err?.message }, "studio manken üretim hatası");
    return NextResponse.json({ hata: "Manken üretilemedi: " + (err?.message || "bilinmiyor") }, { status: 500 });
  }
}
