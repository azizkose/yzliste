import { NextRequest, NextResponse } from "next/server";
import { fal } from "@fal-ai/client";

fal.config({ credentials: process.env.FAL_KEY });

const STILLER = [
  {
    id: "beyaz",
    label: "Beyaz Zemin",
    sahne: "pure white background, clean studio lighting, professional e-commerce product photo, no shadows, minimal",
  },
  {
    id: "koyu",
    label: "Koyu Zemin",
    sahne: "dark charcoal black background, dramatic studio lighting, soft spotlight on product, premium luxury product photography",
  },
  {
    id: "lifestyle",
    label: "Lifestyle",
    sahne: "cozy modern living room, natural daylight from window, plants and home decor in background, lifestyle interior photography, product in natural environment",
  },
];

export async function POST(req: NextRequest) {
  const { foto, ekPrompt, stiller: seciliStiller } = await req.json();
  if (!foto) {
    return NextResponse.json({ hata: "Fotoğraf gerekli" }, { status: 400 });
  }

  try {
    // Base64 → blob → fal storage
    const base64 = foto.split(",")[1];
    const mediaType = foto.split(";")[0].split(":")[1];
    const binaryStr = atob(base64);
    const bytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: mediaType });
    const imageUrl = await fal.storage.upload(blob);

    // Sadece seçili stilleri üret — her biri 4 görsel
    const aktifStiller = seciliStiller?.length > 0
      ? STILLER.filter(s => seciliStiller.includes(s.id))
      : STILLER;

    const sonuclar = await Promise.all(
      aktifStiller.map(async (stil) => {
        const sahne = ekPrompt ? `${stil.sahne}, ${ekPrompt}` : stil.sahne;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = await fal.subscribe("fal-ai/bria/product-shot", {
          input: {
            image_url: imageUrl,
            scene_description: sahne,
            optimize_description: true,
            num_results: 4,
            fast: true,
          },
        }) as any;

        const images = result?.data?.images || result?.images || [];

        return {
          stil: stil.id,
          label: stil.label,
          gorseller: images.map((img: { url: string }) => img.url),
        };
      })
    );

    return NextResponse.json({ sonuclar });
  } catch (e) {
    console.log("FAL HATA:", JSON.stringify(e, null, 2));
    return NextResponse.json({ hata: "Gorsel uretim hatasi" }, { status: 500 });
  }
}