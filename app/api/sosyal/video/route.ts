import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { fal } from "@fal-ai/client";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

fal.config({ credentials: process.env.FAL_KEY });

const VIDEO_KREDI = 5;

export async function POST(req: NextRequest) {
  const { foto, prompt, userId } = await req.json();

  if (!userId) {
    return NextResponse.json({ hata: "Giris yapilmadi" }, { status: 401 });
  }

  if (!foto) {
    return NextResponse.json({ hata: "Fotograf gerekli" }, { status: 400 });
  }

  const { data: profil } = await supabaseAdmin
    .from("profiles")
    .select("kredi, is_admin")
    .eq("id", userId)
    .single();

  if (!profil) {
    return NextResponse.json({ hata: "Kullanici bulunamadi" }, { status: 404 });
  }

  const isAdmin = profil.is_admin === true;

  if (!isAdmin && profil.kredi < VIDEO_KREDI) {
    return NextResponse.json(
      { hata: `Video üretimi ${VIDEO_KREDI} kullanım hakkı gerektirir. Mevcut: ${profil.kredi}` },
      { status: 402 }
    );
  }

  // Base64'ü fal.ai storage'a yükle
  const base64Data = foto.split(",")[1];
  const mediaType = foto.split(";")[0].split(":")[1];
  const buffer = Buffer.from(base64Data, "base64");
  const blob = new Blob([buffer], { type: mediaType });
  const uploadResult = await fal.storage.upload(blob);
  const imageUrl = uploadResult;

  // Video prompt — kullanıcı yazmadıysa otomatik
  const videoPrompt = prompt?.trim() ||
    "Product showcase with smooth slow rotation, cinematic lighting, clean white background, professional e-commerce video";

  // Kling v2.1 standard — 5 saniyelik video
  const result = await fal.subscribe("fal-ai/kling-video/v2.1/standard/image-to-video", {
    input: {
      prompt: videoPrompt,
      image_url: imageUrl,
      duration: "5",
      aspect_ratio: "9:16", // Instagram Reels / TikTok formatı
      negative_prompt: "blur, distort, low quality, watermark, text overlay",
      cfg_scale: 0.5,
    },
  }) as { video: { url: string } };

  const videoUrl = result?.video?.url;

  if (!videoUrl) {
    return NextResponse.json({ hata: "Video üretilemedi, tekrar deneyin." }, { status: 500 });
  }

  // Kredi düş
  if (!isAdmin) {
    await supabaseAdmin
      .from("profiles")
      .update({ kredi: profil.kredi - VIDEO_KREDI })
      .eq("id", userId);
  }

  return NextResponse.json({ videoUrl, isAdmin });
}
