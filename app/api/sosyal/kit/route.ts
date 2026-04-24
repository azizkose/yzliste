import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { fal } from "@fal-ai/client";
import { captionSistemPrompt, captionCiktiParse } from "@/lib/prompts/sosyal";
import { rmbgUygula } from "@/lib/fal/rmbg";
import { AI_MODELS, AI_TEMPERATURES } from "@/lib/ai-config";

fal.config({ credentials: process.env.FAL_KEY });

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

const STIL_SAHNELERI: Record<string, string> = {
  beyaz:     "solid pure white (#FFFFFF) seamless cyclorama studio background, soft diffused overhead lighting, no shadows, professional e-commerce product photography, keep the original product exactly as is",
  lifestyle: "cozy modern Scandinavian interior, warm natural side-window daylight, neutral linen textures, the product is the clear focal point, editorial lifestyle photography, keep the original product exactly as is",
  gradient:  "smooth pastel gradient background transitioning from soft peach to light lavender, modern minimalist flat-lay product photography, keep the original product exactly as is",
  koyu:      "solid matte black (#0A0A0A) seamless studio background, dramatic Rembrandt lighting, luxury high-end product photography, keep the original product exactly as is",
};

const FORMAT_BOYUT: Record<string, { width: number; height: number }> = {
  "1:1":  { width: 1000, height: 1000 },
  "9:16": { width: 1000, height: 1778 },
  "16:9": { width: 1778, height: 1000 },
};

async function captionUret(params: {
  platform: string; urunAdi: string; ekBilgi: string; ton: string;
  markaBaglami: string; sezon: string;
}): Promise<{ caption: string; hashtag: string }> {
  const { sistem, kullanici } = captionSistemPrompt(params);
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: AI_MODELS.social,
      temperature: AI_TEMPERATURES.social,
      max_tokens: 1024,
      system: sistem,
      messages: [{ role: "user", content: kullanici }],
    }),
  });
  const data = await response.json();
  return captionCiktiParse(data.content?.[0]?.text || "");
}

export async function POST(req: NextRequest) {
  const { urunAdi, ekBilgi = "", ton = "tanitim", userId, foto, gorselFormat = "1:1", gorselStil = "beyaz", sezon = "normal" } = await req.json();

  if (!urunAdi) return NextResponse.json({ hata: "Ürün adı gerekli" }, { status: 400 });
  if (!userId) return NextResponse.json({ hata: "Giriş yapılmadı" }, { status: 401 });

  const hasFoto = !!foto;
  const krediGereken = hasFoto ? 4 : 3;

  const { data: profil } = await supabaseAdmin
    .from("profiles")
    .select("kredi, is_admin, marka_adi, hedef_kitle, vurgulanan_ozellikler, ton, magaza_kategorileri, teslimat_vurgulari")
    .eq("id", userId)
    .single();

  if (!profil) return NextResponse.json({ hata: "Kullanıcı bulunamadı" }, { status: 404 });

  const isAdmin = profil.is_admin === true;

  if (!isAdmin && profil.kredi < krediGereken) {
    return NextResponse.json(
      { hata: `Sosyal Medya Kiti ${krediGereken} kredi gerektirir. Mevcut: ${profil.kredi}` },
      { status: 402 }
    );
  }

  if (!isAdmin) {
    const { data: updated } = await supabaseAdmin
      .from("profiles")
      .update({ kredi: profil.kredi - krediGereken })
      .eq("id", userId)
      .gte("kredi", krediGereken)
      .select("kredi")
      .single();

    if (!updated) return NextResponse.json({ hata: "Kredi düşülemedi, yeniden deneyin." }, { status: 402 });
  }

  const markaBaglami = [
    profil.marka_adi ? `Marka adı: ${profil.marka_adi}` : "",
    profil.hedef_kitle ? `Hedef kitle: ${profil.hedef_kitle}` : "",
    profil.vurgulanan_ozellikler ? `Öne çıkarılacak özellikler: ${profil.vurgulanan_ozellikler}` : "",
    (profil.ton || ton) ? `Marka tonu: ${profil.ton || ton}` : "",
    profil.magaza_kategorileri?.length ? `Mağaza kategorileri: ${profil.magaza_kategorileri.join(", ")}` : "",
    profil.teslimat_vurgulari?.length ? `Hizmet vurguları: ${profil.teslimat_vurgulari.join(", ")}` : "",
  ].filter(Boolean).join("\n");

  const captionParams = { urunAdi, ekBilgi, ton, markaBaglami, sezon };
  const platformlar = ["instagram_tiktok", "facebook", "twitter", "linkedin"] as const;
  const captionPromises = platformlar.map((p) =>
    captionUret({ platform: p, ...captionParams }).catch(() => ({ caption: "", hashtag: "" }))
  );

  if (hasFoto) {
    const gorselPromise = (async () => {
      try {
        const base64 = foto.split(",")[1];
        const mediaType = foto.split(";")[0].split(":")[1];
        const binaryStr = atob(base64);
        const bytes = new Uint8Array(binaryStr.length);
        for (let i = 0; i < binaryStr.length; i++) bytes[i] = binaryStr.charCodeAt(i);
        const blob = new Blob([bytes], { type: mediaType });
        const imageUrl = await fal.storage.upload(blob);

        // RMBG — Bria Product-Shot'a göndermeden önce arka planı temizle
        const cleanImageUrl = await rmbgUygula(imageUrl);

        const shotSize = FORMAT_BOYUT[gorselFormat] ?? FORMAT_BOYUT["1:1"];
        const sahne = STIL_SAHNELERI[gorselStil] ?? STIL_SAHNELERI.beyaz;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = await fal.subscribe("fal-ai/bria/product-shot", {
          input: {
            image_url: cleanImageUrl,
            scene_description: sahne,
            optimize_description: true,
            num_results: 2,
            fast: false,
            shot_size: [shotSize.width, shotSize.height],
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }) as any;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (result?.data?.images ?? result?.images ?? []).map((img: { url: string }) => img.url) as string[];
      } catch {
        return [];
      }
    })();

    const [captionResults, gorselUrls] = await Promise.all([Promise.all(captionPromises), gorselPromise]);
    const captions = Object.fromEntries(platformlar.map((p, i) => [p, captionResults[i]]));
    return NextResponse.json({ captions, gorselUrls, kullanilanKredi: krediGereken, isAdmin });
  }

  const captionResults = await Promise.all(captionPromises);
  const captions = Object.fromEntries(platformlar.map((p, i) => [p, captionResults[i]]));
  return NextResponse.json({ captions, gorselUrls: [], kullanilanKredi: krediGereken, isAdmin });
}
