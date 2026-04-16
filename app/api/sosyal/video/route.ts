import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { fal } from "@fal-ai/client";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

fal.config({ credentials: process.env.FAL_KEY });

// Kredi: 5s → 5 kredi, 10s → 8 kredi
const SURE_KREDI: Record<string, number> = {
  "5": 5,
  "10": 8,
};

// Ton → İngilizce video stil ipucu
const TON_VIDEO: Record<string, string> = {
  samimi:      "friendly warm product showcase",
  profesyonel: "clean professional corporate product video",
  premium:     "luxury cinematic high-end product film",
};

export async function POST(req: NextRequest) {
  const { foto, prompt, userId, sure = "5", format = "9:16" } = await req.json();

  if (!userId) {
    return NextResponse.json({ hata: "Giris yapilmadi" }, { status: 401 });
  }

  if (!foto) {
    return NextResponse.json({ hata: "Fotograf gerekli" }, { status: 400 });
  }

  const kullanilanKredi = SURE_KREDI[sure] ?? 5;

  const { data: profil } = await supabaseAdmin
    .from("profiles")
    .select("kredi, is_admin, marka_adi, ton, hedef_kitle")
    .eq("id", userId)
    .single();

  if (!profil) {
    return NextResponse.json({ hata: "Kullanici bulunamadi" }, { status: 404 });
  }

  const isAdmin = profil.is_admin === true;

  if (!isAdmin && profil.kredi < kullanilanKredi) {
    return NextResponse.json(
      { hata: `Video üretimi ${kullanilanKredi} kullanım hakkı gerektirir. Mevcut: ${profil.kredi}` },
      { status: 402 }
    );
  }

  // Base64 → FAL storage
  const base64Data = foto.split(",")[1];
  const mediaType = foto.split(";")[0].split(":")[1];
  const buffer = Buffer.from(base64Data, "base64");
  const blob = new Blob([buffer], { type: mediaType });
  const imageUrl = await fal.storage.upload(blob);

  // Video prompt oluştur
  let videoPrompt: string;
  if (prompt?.trim()) {
    videoPrompt = prompt.trim();
  } else {
    // Marka bilgisine göre otomatik prompt
    const stilIpucu = profil.ton ? (TON_VIDEO[profil.ton] || "professional product showcase") : "professional product showcase";
    const markaIpucu = profil.marka_adi ? ` for ${profil.marka_adi}` : "";
    videoPrompt = `${stilIpucu}${markaIpucu}, smooth cinematic camera movement, professional lighting, clean background, high quality e-commerce video`;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = await fal.subscribe("fal-ai/kling-video/v2.1/standard/image-to-video", {
    input: {
      prompt: videoPrompt,
      image_url: imageUrl,
      duration: sure as "5" | "10",
      aspect_ratio: format,
      negative_prompt: "blur, distort, low quality, watermark, text overlay, shaky camera",
      cfg_scale: 0.5,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any,
  }) as unknown as { video: { url: string } };

  const videoUrl = result?.video?.url;

  if (!videoUrl) {
    return NextResponse.json({ hata: "Video üretilemedi, tekrar deneyin." }, { status: 500 });
  }

  if (!isAdmin) {
    await supabaseAdmin
      .from("profiles")
      .update({ kredi: profil.kredi - kullanilanKredi })
      .eq("id", userId);
  }

  return NextResponse.json({ videoUrl, isAdmin, kullanilanKredi });
}
