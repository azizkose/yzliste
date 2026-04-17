import { NextRequest, NextResponse } from "next/server";
import { fal } from "@fal-ai/client";
import { createClient } from "@supabase/supabase-js";

export const maxDuration = 60; // fal storage upload + RMBG (~5s) + queue.submit — GPU bekleme yok

fal.config({ credentials: process.env.FAL_KEY });

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

const FORMAT_BOYUT: Record<string, [number, number]> = {
  "1:1":  [1000, 1000],
  "9:16": [1000, 1778],
  "16:9": [1778, 1000],
};

const stilSahneleri: Record<string, string> = {
  beyaz: "solid pure white (#FFFFFF) seamless studio cyclorama background, absolutely no gradients or off-white tones, professional e-commerce product photography, soft diffused even lighting from all sides, product centered and filling the frame prominently, very subtle soft contact shadow beneath product is allowed, keep the original product exactly as is, do not alter modify or reimagine the product",
  koyu: "solid pure black (#000000) seamless studio background, absolutely no dark gray or gradients, no color halos or glowing effects, luxury product photography, product sitting on the dark surface not floating, soft subtle overhead studio light only, no dramatic spotlights or rim lights, product centered and filling the frame prominently, subtle soft contact shadow beneath product, keep the original product exactly as is, do not alter modify or reimagine the product",
  lifestyle: "modern minimalist interior setting, product placed on a surface such as a table shelf or countertop not floating in air, warm natural daylight streaming from a large side window, shallow depth of field with softly blurred background featuring neutral decor and subtle greenery, product as the clear hero element filling the frame prominently, editorial lifestyle product photography, warm color palette, keep the original product exactly as is, do not alter modify or reimagine the product",
  mermer: "elegant white marble surface with subtle gray veining, clean and luxurious product photography, soft overhead studio lighting with gentle reflections on marble, product centered and filling the frame prominently, premium cosmetics and jewelry aesthetic, keep the original product exactly as is, do not alter modify or reimagine the product",
  ahsap: "warm natural wood table surface with visible grain texture, rustic artisan product photography, soft warm directional lighting from the side, shallow depth of field with blurred cozy background, product centered and filling the frame prominently, handcraft and organic aesthetic, keep the original product exactly as is, do not alter modify or reimagine the product",
  gradient: "smooth modern gradient background transitioning from soft pastel tones, contemporary minimalist product photography, even studio lighting, product centered and filling the frame prominently, clean tech and lifestyle brand aesthetic, keep the original product exactly as is, do not alter modify or reimagine the product",
  dogal: "outdoor natural setting with soft sunlight and green foliage in the background, shallow depth of field, product placed on a natural stone or wooden surface, fresh and organic product photography, product centered and filling the frame prominently, keep the original product exactly as is, do not alter modify or reimagine the product",
};


const stilEtiketleri: Record<string, string> = {
  beyaz: "Beyaz Zemin", koyu: "Koyu Zemin", lifestyle: "Lifestyle",
  mermer: "Mermer", ahsap: "Ahşap", gradient: "Gradient",
  dogal: "Doğal", referans: "Referans Sahne", ozel: "Özel Sahne",
};

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { foto, stil, ekPrompt, userId, referansGorsel, sosyalFormat } = body;

  if (!foto) return NextResponse.json({ hata: "Fotograf gerekli" }, { status: 400 });

  let isAdmin = false;
  let brandContext = "";

  if (userId) {
    const { data: profil } = await supabaseAdmin
      .from("profiles")
      .select("kredi, is_admin, marka_adi, ton, hedef_kitle")
      .eq("id", userId)
      .single();

    if (profil) {
      isAdmin = profil.is_admin === true;
      if (!isAdmin && profil.kredi <= 0) {
        return NextResponse.json({ hata: "Krediniz bitti." }, { status: 402 });
      }
      const tonEnMap: Record<string, string> = {
        profesyonel: "professional and premium brand tone",
        samimi: "warm and friendly brand tone",
        eglenceli: "fun and playful brand tone",
        lüks: "luxury and elegant brand tone",
        minimal: "clean and minimal brand tone",
      };
      const ctxParcalar: string[] = [];
      if (profil.ton && tonEnMap[profil.ton]) ctxParcalar.push(tonEnMap[profil.ton]);
      if (profil.hedef_kitle) ctxParcalar.push(`targeted at: ${profil.hedef_kitle}`);
      if (ctxParcalar.length > 0) brandContext = `, ${ctxParcalar.join(", ")}`;
    }
  }

  try {
    // Ana fotoğraf → FAL storage
    const base64 = foto.split(",")[1];
    const mediaType = foto.split(";")[0].split(":")[1];
    const binaryStr = atob(base64);
    const bytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) bytes[i] = binaryStr.charCodeAt(i);
    const imageUrl = await fal.storage.upload(new Blob([bytes], { type: mediaType }));

    const secilenStil: string = stil || "beyaz";
    const shotSize: [number, number] = sosyalFormat ? (FORMAT_BOYUT[sosyalFormat] || [1000, 1000]) : [1000, 1000];

    // RMBG — arka planı kaldır, sonra product-shot'a temiz görsel gönder
    let cleanImageUrl = imageUrl;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rmbgResult = await fal.subscribe("fal-ai/bria/rmbg", { input: { image_url: imageUrl } }) as any;
      cleanImageUrl = rmbgResult?.data?.image?.url || imageUrl;
    } catch {
      // RMBG başarısız → orijinal görselle devam et
      cleanImageUrl = imageUrl;
    }

    let input: Record<string, unknown>;

    if (secilenStil === "referans" && referansGorsel) {
      const rb64 = referansGorsel.split(",")[1];
      const rmt = referansGorsel.split(";")[0].split(":")[1];
      const rbStr = atob(rb64);
      const rb = new Uint8Array(rbStr.length);
      for (let i = 0; i < rbStr.length; i++) rb[i] = rbStr.charCodeAt(i);
      const refUrl = await fal.storage.upload(new Blob([rb], { type: rmt }));
      input = {
        image_url: cleanImageUrl,
        ref_image_url: refUrl,
        optimize_description: true,
        num_results: 1,
        fast: false,
        placement_type: "automatic",
        shot_size: shotSize,
      };
    } else {
      let sahne: string;
      if (secilenStil === "ozel") {
        sahne = ekPrompt || "clean studio background, professional product photography, keep the original product exactly as is";
      } else {
        sahne = `${stilSahneleri[secilenStil] || stilSahneleri.beyaz}${brandContext}`;
        if (ekPrompt) sahne = `${sahne}, ${ekPrompt}`;
      }
      input = {
        image_url: cleanImageUrl,
        scene_description: sahne,
        optimize_description: true,
        num_results: 1,
        fast: false,
        placement_type: "automatic",
        shot_size: shotSize,
      };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const queued = await fal.queue.submit("fal-ai/bria/product-shot", { input } as any);
    const label = stilEtiketleri[secilenStil] || secilenStil;

    return NextResponse.json({ requestId: queued.request_id, label, isAdmin });
  } catch (e: unknown) {
    const err = e as { message?: string };
    console.error("FAL HATA:", err?.message || JSON.stringify(e));
    return NextResponse.json({ hata: "Gorsel uretim hatasi: " + (err?.message || "bilinmiyor") }, { status: 500 });
  }
}
