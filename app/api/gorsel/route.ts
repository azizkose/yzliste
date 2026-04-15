import { NextRequest, NextResponse } from "next/server";
import { fal } from "@fal-ai/client";
import { createClient } from "@supabase/supabase-js";

fal.config({ credentials: process.env.FAL_KEY });

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

// sosyalFormat: "1:1" | "9:16" | "16:9" — sosyal medya görsel üretimi için
const FORMAT_BOYUT: Record<string, [number, number]> = {
  "1:1":  [1000, 1000],
  "9:16": [1000, 1778],
  "16:9": [1778, 1000],
};

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { foto, stiller, ekPrompt, userId, action, referansGorsel, sosyalFormat } = body;

  // Kredi dusurme - sadece indir aksiyonunda
  if (action === "indir") {
    if (!userId) return NextResponse.json({ hata: "Giris yapilmadi" }, { status: 401 });
    const { data: profil } = await supabaseAdmin.from("profiles").select("kredi, is_admin").eq("id", userId).single();
    if (!profil) return NextResponse.json({ hata: "Kullanici bulunamadi" }, { status: 404 });
    if (!profil.is_admin) {
      const { stilSayisi } = body;
      await supabaseAdmin.from("profiles").update({ kredi: Math.max(0, profil.kredi - (stilSayisi || 1)) }).eq("id", userId);
    }
    return NextResponse.json({ ok: true });
  }

  if (!foto) return NextResponse.json({ hata: "Fotograf gerekli" }, { status: 400 });

  let isAdmin = false;
  if (userId) {
    const { data: profil } = await supabaseAdmin.from("profiles").select("kredi, is_admin").eq("id", userId).single();
    if (profil) {
      isAdmin = profil.is_admin === true;
      if (!isAdmin && profil.kredi <= 0) {
        return NextResponse.json({ hata: "Krediniz bitti." }, { status: 402 });
      }
    }
  }

  // STİL SAHNELERİ — sadece arka planı/ortamı tanımla, ürüne dokunma
  // Kritik kural: fal.ai'ya sadece sahne/ortam bilgisi ver, ürünü değiştirme
  const stilSahneleri: Record<string, string> = {
    beyaz: "solid pure white (#FFFFFF) seamless studio cyclorama background, absolutely no gradients or off-white tones, professional e-commerce product photography, soft diffused even lighting from all sides, product centered and filling the frame prominently, very subtle soft contact shadow beneath product is allowed, keep the original product exactly as is, do not alter modify or reimagine the product",
    koyu: "solid pure black (#000000) seamless studio background, absolutely no dark gray or gradients, no color halos or glowing effects, luxury product photography, product sitting on the dark surface not floating, soft subtle overhead studio light only, no dramatic spotlights or rim lights, product centered and filling the frame prominently, subtle soft contact shadow beneath product, keep the original product exactly as is, do not alter modify or reimagine the product",
    lifestyle: "modern minimalist interior setting, product placed on a surface such as a table shelf or countertop not floating in air, warm natural daylight streaming from a large side window, shallow depth of field with softly blurred background featuring neutral decor and subtle greenery, product as the clear hero element filling the frame prominently, editorial lifestyle product photography, warm color palette, keep the original product exactly as is, do not alter modify or reimagine the product",
    mermer: "elegant white marble surface with subtle gray veining, clean and luxurious product photography, soft overhead studio lighting with gentle reflections on marble, product centered and filling the frame prominently, premium cosmetics and jewelry aesthetic, keep the original product exactly as is, do not alter modify or reimagine the product",
    ahsap: "warm natural wood table surface with visible grain texture, rustic artisan product photography, soft warm directional lighting from the side, shallow depth of field with blurred cozy background, product centered and filling the frame prominently, handcraft and organic aesthetic, keep the original product exactly as is, do not alter modify or reimagine the product",
    gradient: "smooth modern gradient background transitioning from soft pastel tones, contemporary minimalist product photography, even studio lighting, product centered and filling the frame prominently, clean tech and lifestyle brand aesthetic, keep the original product exactly as is, do not alter modify or reimagine the product",
    dogal: "outdoor natural setting with soft sunlight and green foliage in the background, shallow depth of field, product placed on a natural stone or wooden surface, fresh and organic product photography, product centered and filling the frame prominently, keep the original product exactly as is, do not alter modify or reimagine the product",
  };

  // Her stil için ürün yerleşim ve boyut ayarları
  const stilPadding: Record<string, number[]> = {
    beyaz: [50, 50, 50, 50],     // sıkı kırpım — ürün frame'in ~90%'ını kaplar
    koyu: [50, 50, 50, 50],      // sıkı kırpım — ürün büyük ve belirgin
    lifestyle: [100, 100, 80, 80], // biraz daha nefes alanı — ortam görünsün
    mermer: [60, 60, 60, 60],     // lüks his — ürün belirgin
    ahsap: [80, 80, 60, 60],     // yüzey görünsün ama ürün büyük
    gradient: [50, 50, 50, 50],   // temiz ve sıkı — modern his
    dogal: [100, 100, 80, 80],   // ortam atmosferi önemli
  };

  try {
    // Base64 → blob → fal storage
    const base64 = foto.split(",")[1];
    const mediaType = foto.split(";")[0].split(":")[1];
    const binaryStr = atob(base64);
    const bytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) bytes[i] = binaryStr.charCodeAt(i);
    const blob = new Blob([bytes], { type: mediaType });
    const imageUrl = await fal.storage.upload(blob);

    const stilListesi: string[] = stiller && stiller.length > 0 ? stiller : ["beyaz"];
    // Sosyal medya formatı varsa shot_size buna göre ayarla, yoksa varsayılan kare
    const shotSize: [number, number] = sosyalFormat ? (FORMAT_BOYUT[sosyalFormat] || [1000, 1000]) : [1000, 1000];

    const stilEtiketleri: Record<string, string> = {
      beyaz: "Beyaz Zemin",
      koyu: "Koyu Zemin",
      lifestyle: "Lifestyle",
      mermer: "Mermer",
      ahsap: "Ahşap",
      gradient: "Gradient",
      dogal: "Doğal",
      referans: "Referans Sahne",
    };

    // Referans görseli varsa fal storage'a yükle
    let refImageUrl: string | undefined;
    if (referansGorsel && stilListesi.includes("referans")) {
      const refBase64 = referansGorsel.split(",")[1];
      const refMediaType = referansGorsel.split(";")[0].split(":")[1];
      const refBinaryStr = atob(refBase64);
      const refBytes = new Uint8Array(refBinaryStr.length);
      for (let i = 0; i < refBinaryStr.length; i++) refBytes[i] = refBinaryStr.charCodeAt(i);
      const refBlob = new Blob([refBytes], { type: refMediaType });
      refImageUrl = await fal.storage.upload(refBlob);
    }

    const sonuclar = [];

    for (const s of stilListesi) {
      const padding = stilPadding[s] || stilPadding.beyaz;

      // Referans stili: ref_image_url kullan, scene_description yerine
      if (s === "referans" && refImageUrl) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = await fal.subscribe("fal-ai/bria/product-shot", {
          input: {
            image_url: imageUrl,
            ref_image_url: refImageUrl,
            optimize_description: true,
            num_results: 4,
            fast: false,
            placement_type: "manual_padding",
            padding_values: [80, 80, 80, 80],
            shot_size: shotSize,
          },
        }) as any;

        const gorseller =
          result?.data?.images?.map((img: any) => img.url) ||
          result?.images?.map((img: any) => img.url) ||
          [];
        sonuclar.push({ stil: s, label: stilEtiketleri[s] || s, gorseller });
        continue;
      }

      // Normal stiller: scene_description kullan
      let sahne = stilSahneleri[s] || stilSahneleri.beyaz;

      // Kullanıcı ek prompt vermişse ekle — ama ürünü değiştirme uyarısı koru
      if (ekPrompt && ekPrompt.trim()) {
        sahne = `${sahne}, ${ekPrompt.trim()}`;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await fal.subscribe("fal-ai/bria/product-shot", {
        input: {
          image_url: imageUrl,
          scene_description: sahne,
          optimize_description: true,
          num_results: 4,
          fast: false,
          placement_type: "manual_padding",
          padding_values: padding,
          shot_size: shotSize,
        },
      }) as any;

      const gorseller =
        result?.data?.images?.map((img: any) => img.url) ||
        result?.images?.map((img: any) => img.url) ||
        [];

      sonuclar.push({ stil: s, label: stilEtiketleri[s] || s, gorseller });
    }

    return NextResponse.json({ sonuclar, isAdmin });
  } catch (e: any) {
    console.error("FAL HATA:", e?.message || JSON.stringify(e));
    return NextResponse.json({ hata: "Gorsel uretim hatasi: " + (e?.message || "bilinmiyor") }, { status: 500 });
  }
}
