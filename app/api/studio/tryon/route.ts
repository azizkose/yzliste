import { NextRequest, NextResponse } from "next/server";
import { fal } from "@fal-ai/client";
import { createClient } from "@supabase/supabase-js";
import { rmbgUygula } from "@/lib/fal/rmbg";
import { STUDIO_KREDI, STOK_MANKENLER } from "@/lib/studio-constants";
import logger from "@/lib/logger";

export const maxDuration = 120;

fal.config({ credentials: process.env.FAL_KEY });

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

async function base64ToUrl(base64: string): Promise<string> {
  const data = base64.split(",")[1];
  const mediaType = base64.split(";")[0].split(":")[1];
  const binaryStr = atob(data);
  const bytes = new Uint8Array(binaryStr.length);
  for (let i = 0; i < binaryStr.length; i++) bytes[i] = binaryStr.charCodeAt(i);
  return fal.storage.upload(new Blob([bytes], { type: mediaType }));
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    garmentImage,   // base64
    modelImage,     // base64 | null (özel yükleme)
    modelStokId,    // string | null (stok manken id)
    category = "auto",
    garmentPhotoType = "auto",
    mode = "balanced",
    numSamples = 1,
    userId,
  } = body;

  if (!garmentImage) {
    return NextResponse.json({ hata: "Kıyafet fotoğrafı gerekli" }, { status: 400 });
  }
  if (!modelImage && !modelStokId) {
    return NextResponse.json({ hata: "Manken seçimi gerekli" }, { status: 400 });
  }
  if (!userId) {
    return NextResponse.json({ hata: "Oturum gerekli" }, { status: 401 });
  }

  const gerekliKredi = STUDIO_KREDI.tryon.hesapla(numSamples);

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
    // Kıyafet görseli yükle + RMBG uygula
    const garmentRaw = await base64ToUrl(garmentImage);
    const garmentUrl = await rmbgUygula(garmentRaw);

    // Manken görseli: stok veya özel yükleme
    let modelUrl: string;
    if (modelStokId) {
      const stok = STOK_MANKENLER.find((m) => m.id === modelStokId);
      if (!stok) return NextResponse.json({ hata: "Geçersiz manken seçimi" }, { status: 400 });
      modelUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.yzliste.com"}${stok.url}`;
    } else {
      modelUrl = await base64ToUrl(modelImage);
    }

    const queued = await fal.queue.submit("fal-ai/fashn/tryon/v1.6", {
      input: {
        model_image: modelUrl,
        garment_image: garmentUrl,
        category,
        garment_photo_type: garmentPhotoType,
        mode,
        num_samples: numSamples,
        segmentation_free: true,
        moderation_level: "permissive",
      },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    return NextResponse.json({ requestId: queued.request_id, kullanilanKredi: gerekliKredi });
  } catch (e: unknown) {
    // Hata durumunda krediyi iade et
    if (!isAdmin) {
      try {
        const { data: p } = await supabaseAdmin.from("profiles").select("kredi").eq("id", userId).single();
        if (p) await supabaseAdmin.from("profiles").update({ kredi: p.kredi + gerekliKredi }).eq("id", userId);
      } catch { /* iade başarısız */ }
    }
    const err = e as { message?: string };
    logger.error({ err: err?.message }, "studio tryon hatası");
    return NextResponse.json({ hata: "Giydirme işlemi başlatılamadı: " + (err?.message || "bilinmiyor") }, { status: 500 });
  }
}
