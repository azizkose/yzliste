import { NextRequest, NextResponse } from "next/server";
import { fal } from "@fal-ai/client";
import { createClient } from "@supabase/supabase-js";

fal.config({ credentials: process.env.FAL_KEY });

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

// Sahne tanımları — sadece arka plan/ortam, ürüne dokunma
const STIL_SAHNELERI: Record<string, string> = {
  beyaz:    "solid pure white (#FFFFFF) seamless cyclorama studio background, soft diffused overhead lighting, no shadows, no gradients, professional e-commerce product photography, keep the original product exactly as is",
  koyu:     "solid matte black (#0A0A0A) seamless studio background, dramatic Rembrandt lighting with a single soft spotlight directly on product, luxury high-end product photography, keep the original product exactly as is",
  lifestyle: "cozy modern Scandinavian interior, warm natural side-window daylight, neutral linen textures, subtle houseplants in background, the product is the clear focal point, editorial lifestyle photography, keep the original product exactly as is",
  mermer:   "polished white Carrara marble surface, soft studio lighting with gentle reflection on the marble, minimalist luxury product photography, keep the original product exactly as is",
  ahsap:    "warm natural oak wood surface, soft diffused daylight, rustic artisan aesthetic, shallow depth of field background, keep the original product exactly as is",
  gradient: "smooth pastel gradient background transitioning from soft peach to light lavender, modern minimalist flat-lay product photography, keep the original product exactly as is",
  dogal:    "soft natural outdoor setting, gentle golden-hour sunlight filtering through leaves, fresh greenery in background, organic and earthy feel, keep the original product exactly as is",
};

const STIL_ETIKETLERI: Record<string, string> = {
  beyaz:    "Beyaz Zemin",
  koyu:     "Koyu Zemin",
  lifestyle: "Lifestyle",
  mermer:   "Mermer",
  ahsap:    "Ahşap",
  gradient: "Gradient",
  dogal:    "Doğal Ortam",
  ozel:     "Özel Sahne",
  referans: "Referans Stil",
};

// FAL bria product-shot shot_size mapping
const FORMAT_BOYUT: Record<string, { width: number; height: number }> = {
  "1:1":  { width: 1000, height: 1000 },
  "9:16": { width: 1000, height: 1778 },
  "16:9": { width: 1778, height: 1000 },
};

// Ton → İngilizce stil ipucu (FAL için)
const TON_INGILIZCE: Record<string, string> = {
  samimi:       "warm friendly approachable style",
  profesyonel:  "clean professional corporate style",
  premium:      "luxury high-end elegant aesthetic",
};

// Türkçe ekPrompt varsa Claude Haiku ile İngilizce'ye çevir
function turkceIceriyorMu(metin: string): boolean {
  return /[ığşçöüİĞŞÇÖÜ]/i.test(metin);
}

async function ingilizceyCevir(metin: string): Promise<string> {
  try {
    const resp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 150,
        messages: [{
          role: "user",
          content: `Translate this product photography scene description to English for an AI image generator. Return ONLY the English translation, no explanation: "${metin}"`,
        }],
      }),
    });
    const veri = await resp.json();
    return veri.content?.[0]?.text?.trim() || metin;
  } catch {
    return metin; // çeviri başarısız olursa orijinali kullan
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { foto, stiller, ekPrompt, userId, action, referansGorsel, sosyalFormat } = body;

  // Kredi düşürme — sadece indir aksiyonunda
  if (action === "indir") {
    if (!userId) return NextResponse.json({ hata: "Giris yapilmadi" }, { status: 401 });
    const { data: profil } = await supabaseAdmin.from("profiles").select("kredi, is_admin").eq("id", userId).single();
    if (!profil) return NextResponse.json({ hata: "Kullanici bulunamadi" }, { status: 404 });
    if (!profil.is_admin) {
      const { stilSayisi } = body;
      const adet = stilSayisi || 1;
      const { data: updated } = await supabaseAdmin
        .from("profiles")
        .update({ kredi: profil.kredi - adet })
        .eq("id", userId)
        .gt("kredi", 0)
        .select("kredi")
        .single();
      if (!updated) {
        return NextResponse.json({ hata: "Krediniz bitti." }, { status: 402 });
      }
    }
    return NextResponse.json({ ok: true });
  }

  if (!foto) return NextResponse.json({ hata: "Fotograf gerekli" }, { status: 400 });

  // Profil + kredi kontrolü + marka bilgisi
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

      // Marka bağlamını İngilizce sahne ipuçlarına dönüştür
      const ctxParcalar: string[] = [];
      if (profil.ton && TON_INGILIZCE[profil.ton]) {
        ctxParcalar.push(TON_INGILIZCE[profil.ton]);
      }
      if (profil.hedef_kitle) {
        // Hedef kitle Türkçeyse İngilizce'ye çevir
        const hedefEn = turkceIceriyorMu(profil.hedef_kitle)
          ? await ingilizceyCevir(`targeted at: ${profil.hedef_kitle}`)
          : `targeted at: ${profil.hedef_kitle}`;
        ctxParcalar.push(hedefEn);
      }
      if (ctxParcalar.length > 0) {
        brandContext = `, ${ctxParcalar.join(", ")}`;
      }
    }
  }

  // Kullanıcı ekPrompt'unu Türkçeyse çevir
  let ekPromptEn = "";
  if (ekPrompt && ekPrompt.trim()) {
    ekPromptEn = turkceIceriyorMu(ekPrompt.trim())
      ? await ingilizceyCevir(ekPrompt.trim())
      : ekPrompt.trim();
  }

  // shot_size (sosyal format varsa uygula)
  const shotSize = sosyalFormat ? FORMAT_BOYUT[sosyalFormat] : null;

  try {
    // Ana fotoğraf → FAL storage
    const base64 = foto.split(",")[1];
    const mediaType = foto.split(";")[0].split(":")[1];
    const binaryStr = atob(base64);
    const bytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) bytes[i] = binaryStr.charCodeAt(i);
    const blob = new Blob([bytes], { type: mediaType });
    const imageUrl = await fal.storage.upload(blob);

    // Referans görsel varsa yükle
    let referansUrl: string | null = null;
    if (referansGorsel) {
      const rb64 = referansGorsel.split(",")[1];
      const rmt = referansGorsel.split(";")[0].split(":")[1];
      const rbStr = atob(rb64);
      const rb = new Uint8Array(rbStr.length);
      for (let i = 0; i < rbStr.length; i++) rb[i] = rbStr.charCodeAt(i);
      referansUrl = await fal.storage.upload(new Blob([rb], { type: rmt }));
    }

    const stilListesi: string[] = stiller && stiller.length > 0 ? stiller : ["beyaz"];
    const sonuclar = [];

    for (const s of stilListesi) {
      let sahne: string;

      if (s === "ozel") {
        // Özel sahne: kullanıcının ekPrompt'u
        sahne = ekPromptEn || "clean studio background, professional product photography, keep the original product exactly as is";
      } else if (s === "referans") {
        // Referans stil: referans görselin stilini kopyala
        sahne = ekPromptEn
          ? `Match the style and lighting of the reference image, ${ekPromptEn}, keep the original product exactly as is`
          : "Match the background style and lighting conditions of the reference image, keep the original product exactly as is";
      } else {
        // Standart stiller + marka bağlamı + ek prompt
        sahne = `${STIL_SAHNELERI[s] || STIL_SAHNELERI.beyaz}${brandContext}`;
        if (ekPromptEn) sahne = `${sahne}, ${ekPromptEn}`;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const falInput: Record<string, any> = {
        image_url: imageUrl,
        scene_description: sahne,
        optimize_description: true,
        num_results: 4,
        fast: false,
      };

      if (referansUrl && s === "referans") {
        falInput.ref_image_url = referansUrl;
      }

      if (shotSize) {
        falInput.shot_size = [shotSize.width, shotSize.height];
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await fal.subscribe("fal-ai/bria/product-shot", { input: falInput as any }) as any;

      const gorseller =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (result as any)?.data?.images?.map((img: { url: string }) => img.url) ||
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (result as any)?.images?.map((img: { url: string }) => img.url) ||
        [];

      sonuclar.push({ stil: s, label: STIL_ETIKETLERI[s] || s, gorseller });
    }

    return NextResponse.json({ sonuclar, isAdmin });
  } catch (e: unknown) {
    const err = e as { message?: string };
    console.error("FAL HATA:", err?.message || JSON.stringify(e));
    const err2 = e as { message?: string };
    return NextResponse.json({ hata: "Gorsel uretim hatasi: " + (err2?.message || "bilinmiyor") }, { status: 500 });
  }
}
