import { NextRequest, NextResponse } from "next/server";
import { fal } from "@fal-ai/client";

fal.config({ credentials: process.env.FAL_KEY });

export async function POST(req: NextRequest) {
  const { foto, stil, ozellikler } = await req.json();

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
      beyaz: "professional product photo, pure white background, studio lighting, sharp focus, commercial quality, no shadows",
      lifestyle: "professional product photo, modern lifestyle setting, natural daylight, interior design background, commercial quality",
      gradient: "professional product photo, soft gradient background, studio lighting, elegant, commercial quality",
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await fal.subscribe("fal-ai/flux-pro/v1/redux", {
      input: {
        image_url: imageUrl,
        prompt: `${stilPromptlari[stil] || stilPromptlari.beyaz}${ozellikler ? `, ${ozellikler}` : ""}`,
        num_inference_steps: 25,
        guidance_scale: 3.5,
      },
    }) as any;

    const gorselUrl = result?.data?.images?.[0]?.url || result?.images?.[0]?.url;

    if (!gorselUrl) {
      return NextResponse.json({ hata: "Gorsel uretilemedi" }, { status: 500 });
    }

    return NextResponse.json({ gorselUrl });
  } catch (e) {
    console.log("FAL HATA:", JSON.stringify(e, null, 2));
    return NextResponse.json({ hata: "Gorsel uretim hatasi" }, { status: 500 });
  }
}