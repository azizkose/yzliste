import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { fal } from "@fal-ai/client";
import { rmbgUygula } from "@/lib/fal/rmbg";
import { krediDus, krediIade } from "@/lib/credits";

export const maxDuration = 30; // sadece fal storage upload + queue.submit — GPU bekleme yok

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

fal.config({ credentials: process.env.FAL_KEY });

// sure: "5" → 10 kredi, "10" → 20 kredi
const VIDEO_KREDI: Record<string, number> = { "5": 10, "10": 20 };

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
    .select("kredi, is_admin, marka_adi, ton, hedef_kitle, vurgulanan_ozellikler")
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

  // Base64 → FAL storage
  const base64Data = foto.split(",")[1];
  const mediaType = foto.split(";")[0].split(":")[1];
  const buffer = Buffer.from(base64Data, "base64");
  const blob = new Blob([buffer], { type: mediaType });
  const imageUrl = await fal.storage.upload(blob);

  // RMBG — Kling'e göndermeden önce arka planı temizle
  const cleanImageUrl = await rmbgUygula(imageUrl);

  // Video prompt — kullanıcı yazmadıysa marka bilgisine göre otomatik
  let videoPrompt: string;
  if (prompt?.trim()) {
    videoPrompt = prompt.trim();
  } else {
    const TON_VIDEO: Record<string, string> = {
      samimi: "friendly warm product showcase, camera slowly pushes in then holds steady, soft natural lighting, clean background",
      profesyonel: "clean professional product reveal, camera smoothly tracks right then stops, corporate studio lighting, white background",
      premium: "luxury cinematic product film, dramatic light gradually illuminates the product then holds, dark elegant background, subtle reflections",
    };
    const stilIpucu = profil.ton ? (TON_VIDEO[profil.ton] || "professional product showcase") : "professional product showcase";
    const markaIpucu = profil.marka_adi ? ` for ${profil.marka_adi}` : "";
    const hedefIpucu = profil.hedef_kitle ? `, appealing to ${profil.hedef_kitle}` : "";
    const ozellikIpucu = profil.vurgulanan_ozellikler ? `, highlighting ${profil.vurgulanan_ozellikler}` : "";
    videoPrompt = `${stilIpucu}${markaIpucu}${hedefIpucu}${ozellikIpucu}, camera slowly zooms in and holds on product, clean studio lighting, white background, high quality e-commerce video`;
  }

  // Krediyi atomik olarak önceden düş
  if (!isAdmin) {
    const sonuc = await krediDus(userId, gereken_kredi);
    if (!sonuc.success) {
      return NextResponse.json(
        { hata: `Video üretimi ${gereken_kredi} kredi gerektirir. Yetersiz kredi.` },
        { status: 402 }
      );
    }
  }

  let queued: { request_id: string };
  try {
  // Kling v2.1 standard — kuyruğa gönder, GPU bekleme
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  queued = await fal.queue.submit("fal-ai/kling-video/v2.1/standard/image-to-video", {
    input: {
      prompt: videoPrompt,
      image_url: cleanImageUrl,
      duration: sureDeger,
      aspect_ratio: formatDeger,
      negative_prompt: "blur, distort, low quality, watermark, text overlay, static, jerky, pixelated, morphing, unnatural movement, deformed product",
      cfg_scale: 0.5,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any,
  });
  } catch (e) {
    if (!isAdmin) await krediIade(userId, gereken_kredi);
    const err = e as { message?: string };
    return NextResponse.json({ hata: "Video kuyruğa eklenemedi: " + (err?.message || "bilinmiyor") }, { status: 500 });
  }

  return NextResponse.json({ requestId: queued.request_id, isAdmin, kullanilanKredi: gereken_kredi });
}
