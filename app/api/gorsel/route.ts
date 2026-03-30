import { NextRequest, NextResponse } from "next/server";
import { fal } from "@fal-ai/client";

fal.config({ credentials: process.env.FAL_KEY });

export async function POST(req: NextRequest) {
  const { foto, stil } = await req.json();

  if (!foto) {
    return NextResponse.json({ hata: "Fotoğraf gerekli" }, { status: 400 });
  }

  try {
    const base64 = foto.split(",")[1];
    const mediaType = foto.split(";")[0].split(":")[1];

    const binaryStr = atob(base64);
    const bytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: mediaType });
    const imageUrl = await fal.storage.upload(blob);

    const stilPromptlari: Record<string, string> = {
      beyaz: "product photography, pure white background, professional studio lighting, sharp focus, clean, commercial quality",
      lifestyle: "product photography, modern lifestyle setting, natural daylight, professional quality",
      gradient: "product photography, soft pastel gradient background, studio lighting, elegant, commercial quality",
    };

    // Önce arka planı temizle
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const bgResult = await fal.subscribe("fal-ai/background-removal", {
      input: { image_url: imageUrl },
    }) as any;

    const temizGorsel = bgResult?.image?.url || imageUrl;

    // Sonra yeni arka plan ekle
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const gorselResult = await fal.subscribe("fal-ai/flux/dev/image-to-image", {
      input: {
        image_url: temizGorsel,
        prompt: stilPromptlari[stil] || stilPromptlari.beyaz,
        strength: 0.4,
        num_inference_steps: 28,
      },
    }) as any;

    const gorselUrl = gorselResult?.images?.[0]?.url;

    if (!gorselUrl) {
      return NextResponse.json({ hata: "Gorsel uretilemedi" }, { status: 500 });
    }

    return NextResponse.json({ gorselUrl });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ hata: "Gorsel uretim hatasi" }, { status: 500 });
  }
}