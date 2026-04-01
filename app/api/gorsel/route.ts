import { NextRequest, NextResponse } from "next/server";
import { fal } from "@fal-ai/client";
import { createClient } from "@supabase/supabase-js";

fal.config({ credentials: process.env.FAL_KEY });

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function POST(req: NextRequest) {
  const { foto, stil, stiller, ekPrompt, ozellikler, userId } = await req.json();

  if (!foto) {
    return NextResponse.json({ hata: "Fotograf gerekli" }, { status: 400 });
  }

  // Admin kontrolu - userId varsa yap, yoksa devam et
  let isAdmin = false;
  if (userId) {
    const { data: profil } = await supabaseAdmin
      .from("profiles")
      .select("kredi, is_admin")
      .eq("id", userId)
      .single();

    if (profil) {
      isAdmin = profil.is_admin === true;
      if (!isAdmin && profil.kredi <= 0) {
        return NextResponse.json({ hata: "Krediniz bitti." }, { status: 402 });
      }
    }
  }

  const stilSahneleri: Record<string, string> = {
    beyaz: "pure white seamless background, clean studio lighting, professional e-commerce product photo, sharp focus",
    koyu: "dark black seamless background, dramatic studio lighting, soft spotlight on product, premium luxury product photography",
    lifestyle: "cozy modern living room, natural daylight from window, plants and home decor around, lifestyle interior photography",
  };

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

    // Hem stiller (array) hem stil (string) destekle
    const stilListesi: string[] = stiller && stiller.length > 0
      ? stiller
      : stil
      ? [stil]
      : ["beyaz"];

    const ekAciklama = ekPrompt || ozellikler || "";

    // Her stil icin gorsel uret
    const sonuclar = [];
    const stilEtiketleri: Record<string, string> = {
      beyaz: "Beyaz Zemin",
      koyu: "Koyu Zemin",
      lifestyle: "Lifestyle",
    };

    for (const s of stilListesi) {
      const sahne = ekAciklama
        ? `${stilSahneleri[s] || stilSahneleri.beyaz}, ${ekAciklama}`
        : stilSahneleri[s] || stilSahneleri.beyaz;

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

      const gorseller =
        result?.data?.images?.map((img: any) => img.url) ||
        result?.images?.map((img: any) => img.url) ||
        [];

      sonuclar.push({
        stil: s,
        label: stilEtiketleri[s] || s,
        gorseller,
      });
    }

    // Admin degilse kredi dusur (toplam kullanim = stil sayisi)
    if (!isAdmin && userId) {
      const { data: profil } = await supabaseAdmin
        .from("profiles")
        .select("kredi")
        .eq("id", userId)
        .single();

      if (profil) {
        await supabaseAdmin
          .from("profiles")
          .update({ kredi: Math.max(0, profil.kredi - stilListesi.length) })
          .eq("id", userId);
      }
    }

    // Hem eski (gorselUrl) hem yeni (sonuclar) formati destekle
    const ilkGorsel = sonuclar[0]?.gorseller?.[0];
    return NextResponse.json({
      sonuclar,
      gorselUrl: ilkGorsel,
      gorselUrller: sonuclar[0]?.gorseller || [],
      isAdmin,
    });

  } catch (e: any) {
    console.error("FAL HATA:", e?.message || JSON.stringify(e));
    return NextResponse.json({ hata: "Gorsel uretim hatasi: " + (e?.message || "bilinmiyor") }, { status: 500 });
  }
}
