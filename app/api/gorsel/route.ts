import { NextRequest, NextResponse } from "next/server";
import { fal } from "@fal-ai/client";
import { createClient } from "@supabase/supabase-js";

fal.config({ credentials: process.env.FAL_KEY });

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function POST(req: NextRequest) {
  const { foto, stil, ozellikler, userId } = await req.json();

  if (!foto) {
    return NextResponse.json({ hata: "Fotograf gerekli" }, { status: 400 });
  }

  if (!userId) {
    return NextResponse.json({ hata: "Giris yapilmadi" }, { status: 401 });
  }

  // Kullanici bilgisini ve admin durumunu cek
  const { data: profil } = await supabaseAdmin
    .from("profiles")
    .select("kredi, is_admin")
    .eq("id", userId)
    .single();

  if (!profil) {
    return NextResponse.json({ hata: "Kullanici bulunamadi" }, { status: 404 });
  }

  const isAdmin = profil.is_admin === true;

  // Admin degilse kredi kontrolu yap
  if (!isAdmin && profil.kredi <= 0) {
    return NextResponse.json({ hata: "Krediniz bitti. Lutfen kredi satin alin." }, { status: 402 });
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

    const stilSahneleri: Record<string, string> = {
      beyaz: "pure white seamless background, clean studio lighting, professional e-commerce product photo, sharp focus",
      koyu: "dark black seamless background, dramatic studio lighting, soft spotlight on product, premium luxury product photography",
      lifestyle: "cozy modern living room, natural daylight from window, plants and home decor around, lifestyle interior photography",
    };

    const sahne = ozellikler
      ? `${stilSahneleri[stil] || stilSahneleri.beyaz}, ${ozellikler}`
      : stilSahneleri[stil] || stilSahneleri.beyaz;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await fal.subscribe("fal-ai/bria/product-shot", {
      input: {
        image_url: imageUrl,
        scene_description: sahne,
        optimize_description: true,
        num_results: 4,
        fast: false,
      },
    }) as any;

    const gorselUrller =
      result?.data?.images?.map((img: any) => img.url) ||
      result?.images?.map((img: any) => img.url) ||
      [];

    if (!gorselUrller.length) {
      return NextResponse.json({ hata: "Gorsel uretilemedi" }, { status: 500 });
    }

    // Admin degilse kredi dusur
    if (!isAdmin) {
      await supabaseAdmin
        .from("profiles")
        .update({ kredi: profil.kredi - 1 })
        .eq("id", userId);
    }

    return NextResponse.json({ gorselUrller, isAdmin });
  } catch (e) {
    console.error("FAL HATA:", JSON.stringify(e, null, 2));
    return NextResponse.json({ hata: "Gorsel uretim hatasi" }, { status: 500 });
  }
}
