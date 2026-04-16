import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { fal } from "@fal-ai/client";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

fal.config({ credentials: process.env.FAL_KEY });

// sure: "5" → 5 kredi, "10" → 8 kredi
const VIDEO_KREDI: Record<string, number> = { "5": 5, "10": 8 };

export async function POST(req: NextRequest) {
  const { foto, prompt, userId, sure = "5", format = "9:16" } = await req.json();

  if (!userId) {
    return NextResponse.json({ hata: "Giris yapilmadi" }, { status: 401 });
  }

  if (!foto) {
    return NextResponse.json({ hata: "Fotograf gerekli" }, { status: 400 });
  }

  const sureDeger = ["5", "10"].includes(sure) ? sure : "5";
  const formatDeger = ["9:16", "16:9", "1:1"].includes(format) ? format : "9:16";
  const gereken_kredi = VIDEO_KREDI[sureDeger] ?? 5;

  const { data: profil } = await supabaseAdmin
    .from("profiles")
    .select("kredi, is_admin, marka_adi, ton")
    .eq("id", userId)
    .single();

  if (!profil) {
    return NextResponse.json({ hata: "Kullanici bulunamadi" }, { status: 404 });
  }

  const isAdmin = profil.is_admin === true;

  if (!isAdmin && profil.kredi < gereken_kredi) {
    return NextResponse.json(
      { hata: `Video üretimi ${gereken_kredi} kredi gerektirir. Mevcut: ${profil.kredi}` },
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

  // Video prompt — kullanıcı yazmadıysa marka bilgisine göre otomatik
  let videoPrompt: string;
  if (prompt?.trim()) {
    videoPrompt = prompt.trim();
  } else {
    const TON_VIDEO: Record<string, string> = {
      samimi: "friendly warm product showcase",
      profesyonel: "clean professional corporate product video",
      premium: "luxury cinematic high-end product film",
    };
    const stilIpucu = profil.ton ? (TON_VIDEO[profil.ton] || "professional product showcase") : "professional product showcase";
    const markaIpucu = profil.marka_adi ? ` for ${profil.marka_adi}` : "";
    videoPrompt = `${stilIpucu}${markaIpucu}, smooth cinematic camera movement, professional lighting, clean background, high quality e-commerce video`;
  }

  // Kling v2.1 standard
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = await fal.subscribe("fal-ai/kling-video/v2.1/standard/image-to-video", {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    input: {
      prompt: videoPrompt,
      image_url: imageUrl,
      duration: sureDeger,
      aspect_ratio: formatDeger,
      negative_prompt: "blur, distort, low quality, watermark, text overlay",
      cfg_scale: 0.5,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any,
  }) as unknown as { video: { url: string } };

  const videoUrl = result?.video?.url;

  if (!videoUrl) {
    return NextResponse.json({ hata: "Video üretilemedi, tekrar deneyin." }, { status: 500 });
  }

  // Kredi düş
  if (!isAdmin) {
    await supabaseAdmin
      .from("profiles")
      .update({ kredi: profil.kredi - gereken_kredi })
      .eq("id", userId);
  }

  return NextResponse.json({ videoUrl, isAdmin, kullanilanKredi: gereken_kredi });
}
