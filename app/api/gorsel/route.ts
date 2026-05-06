import { NextRequest, NextResponse } from "next/server";
import { fal } from "@fal-ai/client";
import { createClient } from "@supabase/supabase-js";
import * as Sentry from "@sentry/nextjs";
import { rmbgUygula, rmbgUygulaV2 } from "@/lib/fal/rmbg";
import { prepareCanvas } from "@/lib/fal/canvas-prepare";
import { TON_EN_MAP } from "@/lib/constants/ton";
import { isGorselV2Enabled } from "@/lib/feature-flags-server";
import { visionKategoriTespit } from "@/lib/fal/vision-classify";
import { KATEGORI_MODEL_MAP } from "@/lib/fal/product-shot-router";
import { buildPrompt, GORSEL_PROMPT_VERSION } from "@/lib/fal/prompts/index";
import type { Kategori, Stil } from "@/lib/fal/prompts/index";
import logger from "@/lib/logger";

export const maxDuration = 60;

fal.config({ credentials: process.env.FAL_KEY });

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

// ── V1 helpers (korunur — GORSEL_V2_PERCENT=0'da hâlâ çalışır) ─────────────

const FORMAT_BOYUT: Record<string, [number, number]> = {
  "1:1":  [1000, 1000],
  "9:16": [1000, 1778],
  "16:9": [1778, 1000],
};

function shotSizeFromAspect(width: number, height: number): [number, number] {
  const ratio = width / height;
  if (ratio < 0.85) return [1000, 1500];
  if (ratio > 1.15) return [1500, 1000];
  return [1000, 1000];
}

const NO_HANGER_PREFIX = "product only no hanger no clothes hanger no display stand no hook no mannequin floating isolated product, ";

const stilSahneleriV1: Record<string, string> = {
  beyaz:     NO_HANGER_PREFIX + "solid pure white (#FFFFFF) seamless studio cyclorama background, absolutely no gradients or off-white tones, professional e-commerce product photography, soft diffused even lighting from all sides, product centered and filling the frame prominently, very subtle soft contact shadow beneath product is allowed, keep the original product exactly as is, do not alter modify or reimagine the product",
  koyu:      NO_HANGER_PREFIX + "solid pure black (#000000) seamless studio background, absolutely no dark gray or gradients, no color halos or glowing effects, luxury product photography, product sitting on the dark surface not floating, soft subtle overhead studio light only, no dramatic spotlights or rim lights, product centered and filling the frame prominently, subtle soft contact shadow beneath product, keep the original product exactly as is, do not alter modify or reimagine the product",
  lifestyle: NO_HANGER_PREFIX + "modern minimalist interior setting, product placed on a surface such as a table shelf or countertop not floating in air, warm natural daylight streaming from a large side window, shallow depth of field with softly blurred background featuring neutral decor and subtle greenery, product as the clear hero element filling the frame prominently, editorial lifestyle product photography, warm color palette, keep the original product exactly as is, do not alter modify or reimagine the product",
  mermer:    NO_HANGER_PREFIX + "elegant white marble surface with subtle gray veining, clean and luxurious product photography, soft overhead studio lighting with gentle reflections on marble, product centered and filling the frame prominently, premium cosmetics and jewelry aesthetic, keep the original product exactly as is, do not alter modify or reimagine the product",
  ahsap:     NO_HANGER_PREFIX + "warm natural wood table surface with visible grain texture, rustic artisan product photography, soft warm directional lighting from the side, shallow depth of field with blurred cozy background, product centered and filling the frame prominently, handcraft and organic aesthetic, keep the original product exactly as is, do not alter modify or reimagine the product",
  gradient:  NO_HANGER_PREFIX + "smooth modern gradient background transitioning from soft pastel tones, contemporary minimalist product photography, even studio lighting, product centered and filling the frame prominently, clean tech and lifestyle brand aesthetic, keep the original product exactly as is, do not alter modify or reimagine the product",
  dogal:     NO_HANGER_PREFIX + "outdoor natural setting with soft sunlight and green foliage in the background, shallow depth of field, product placed on a natural stone or wooden surface, fresh and organic product photography, product centered and filling the frame prominently, keep the original product exactly as is, do not alter modify or reimagine the product",
};

const stilEtiketleri: Record<string, string> = {
  beyaz: "Beyaz zemin", koyu: "Koyu zemin", lifestyle: "Lifestyle",
  mermer: "Mermer", ahsap: "Ahşap", gradient: "Gradient",
  dogal: "Doğal", referans: "Referans sahne", ozel: "Özel sahne",
};

function pozisyonSec(stil: string, sosyalFormat?: string): string {
  if (sosyalFormat === "9:16") return "bottom_center";
  if (sosyalFormat === "16:9") return "center_horizontal";
  switch (stil) {
    case "beyaz":     return "center_horizontal";
    case "koyu":      return "center_horizontal";
    case "gradient":  return "center_horizontal";
    case "mermer":    return "bottom_center";
    case "ahsap":     return "bottom_center";
    case "lifestyle": return "center_vertical";
    case "dogal":     return "bottom_center";
    default:          return "center_horizontal";
  }
}

// ── Ortak: brand context ────────────────────────────────────────────────────

type ProfilRow = {
  kredi: number;
  is_admin: boolean;
  is_test: boolean;
  marka_adi: string | null;
  ton: string | null;
  hedef_kitle: string | null;
  magaza_kategorileri: string[] | null;
  fiyat_bandi: string | null;
};

function buildBrandContext(profil: ProfilRow): string {
  const parcalar: string[] = [];
  if (profil.marka_adi) parcalar.push(`brand: ${profil.marka_adi}`);
  if (profil.ton && TON_EN_MAP[profil.ton]) parcalar.push(TON_EN_MAP[profil.ton]);
  if (profil.hedef_kitle) parcalar.push(`targeted at: ${profil.hedef_kitle}`);
  if (profil.magaza_kategorileri?.length) parcalar.push(`product categories: ${profil.magaza_kategorileri.join(", ")}`);
  if (profil.fiyat_bandi) parcalar.push(`price segment: ${profil.fiyat_bandi}`);
  return parcalar.length > 0 ? parcalar.join(", ") : "";
}

// ── Kredi işlemleri ─────────────────────────────────────────────────────────

async function krediDus(userId: string, adet: number): Promise<boolean> {
  const { data: profil } = await supabaseAdmin
    .from("profiles").select("kredi").eq("id", userId).single();
  if (!profil) return false;
  const { data: updated } = await supabaseAdmin
    .from("profiles")
    .update({ kredi: profil.kredi - adet })
    .eq("id", userId)
    .gte("kredi", adet)
    .select("kredi").single();
  return !!updated;
}

async function krediIadeEt(userId: string, adet: number): Promise<void> {
  try {
    const { data: profil } = await supabaseAdmin.from("profiles").select("kredi").eq("id", userId).single();
    if (profil) await supabaseAdmin.from("profiles").update({ kredi: profil.kredi + adet }).eq("id", userId);
  } catch { /* loglarda görünür */ }
}

// ── Main handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { foto, stiller, stil, ekPrompt, userId, referansGorsel, sosyalFormat, inputBoyut, kategori } = body;

  const stilListesi: string[] = stiller || (stil ? [stil] : ["beyaz"]);

  if (!foto) return NextResponse.json({ hata: "Fotograf gerekli" }, { status: 400 });
  if (stilListesi.length === 0) return NextResponse.json({ hata: "En az 1 stil seçin" }, { status: 400 });
  if (stilListesi.length > 7) return NextResponse.json({ hata: "En fazla 7 stil seçilebilir" }, { status: 400 });

  let isAdmin = false;
  let profil: ProfilRow | null = null;

  if (userId) {
    const { data } = await supabaseAdmin
      .from("profiles")
      .select("kredi, is_admin, is_test, marka_adi, ton, hedef_kitle, magaza_kategorileri, fiyat_bandi")
      .eq("id", userId).single();

    if (!data) return NextResponse.json({ hata: "Kullanici bulunamadi" }, { status: 404 });
    profil = data as ProfilRow;
    isAdmin = profil.is_admin === true || profil.is_test === true;

    if (!isAdmin) {
      const yeterlimi = await krediDus(userId, stilListesi.length);
      if (!yeterlimi) {
        return NextResponse.json({
          hata: `Yetersiz kredi. ${stilListesi.length} görsel için ${stilListesi.length} kredi gerekli.`,
        }, { status: 402 });
      }
    }
  }

  const brandContext = profil ? buildBrandContext(profil) : "";

  try {
    // Fotoğraf upload
    const base64 = foto.split(",")[1];
    const mediaType = foto.split(";")[0].split(":")[1];
    const binaryStr = atob(base64);
    const bytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) bytes[i] = binaryStr.charCodeAt(i);
    const imageUrl = await fal.storage.upload(new Blob([bytes], { type: mediaType }));

    const shotSize: [number, number] = sosyalFormat
      ? (FORMAT_BOYUT[sosyalFormat] || [1000, 1000])
      : inputBoyut?.width && inputBoyut?.height
        ? shotSizeFromAspect(inputBoyut.width, inputBoyut.height)
        : [1000, 1000];

    // ── V2 pipeline ──────────────────────────────────────────────────────────
    const v2Aktif = !!kategori && isGorselV2Enabled(userId);

    if (v2Aktif) {
      return await handleV2(
        { imageUrl, shotSize, stilListesi, kategori: kategori as Kategori,
          ekPrompt, brandContext, userId, isAdmin },
        body
      );
    }

    // ── V1 pipeline (fallback) ───────────────────────────────────────────────
    return await handleV1(
      { imageUrl, shotSize, stilListesi, ekPrompt, brandContext, userId, isAdmin, referansGorsel, sosyalFormat },
      { isAdmin }
    );

  } catch (e: unknown) {
    if (userId && !isAdmin) await krediIadeEt(userId, stilListesi.length);
    const err = e as { message?: string };
    logger.error({ err: err?.message }, "fal.ai görsel hatası");
    Sentry.captureException(e);
    return NextResponse.json({ hata: "Gorsel uretim hatasi: " + (err?.message || "bilinmiyor") }, { status: 500 });
  }
}

// ── V1 handler ───────────────────────────────────────────────────────────────

async function handleV1(
  params: {
    imageUrl: string;
    shotSize: [number, number];
    stilListesi: string[];
    ekPrompt: string;
    brandContext: string;
    userId: string;
    isAdmin: boolean;
    referansGorsel: string | null;
    sosyalFormat: string | undefined;
  },
  _meta: { isAdmin: boolean }
) {
  const { imageUrl, shotSize, stilListesi, ekPrompt, brandContext, isAdmin, referansGorsel, sosyalFormat } = params;

  const cleanImageUrl = await rmbgUygula(imageUrl);

  let refUrl: string | null = null;
  if (referansGorsel) {
    const rb64 = referansGorsel.split(",")[1];
    const rmt = referansGorsel.split(";")[0].split(":")[1];
    const rbStr = atob(rb64);
    const rb = new Uint8Array(rbStr.length);
    for (let i = 0; i < rbStr.length; i++) rb[i] = rbStr.charCodeAt(i);
    refUrl = await fal.storage.upload(new Blob([rb], { type: rmt }));
  }

  const jobs = await Promise.all(
    stilListesi.map(async (secilenStil) => {
      let input: Record<string, unknown>;
      if (secilenStil === "referans" && refUrl) {
        input = {
          image_url: cleanImageUrl, ref_image_url: refUrl,
          optimize_description: true, num_results: 1, fast: true,
          placement_type: "manual_placement", manual_placement_selection: "bottom_center",
          shot_size: shotSize,
        };
      } else {
        let sahne: string;
        if (secilenStil === "ozel") {
          sahne = ekPrompt || "clean studio background, professional product photography, keep the original product exactly as is";
        } else {
          sahne = `${stilSahneleriV1[secilenStil] || stilSahneleriV1.beyaz}`;
          if (brandContext) sahne += `, ${brandContext}`;
          if (ekPrompt) sahne += `, ${ekPrompt}`;
        }
        input = {
          image_url: cleanImageUrl, scene_description: sahne,
          optimize_description: true, num_results: 1, fast: true,
          placement_type: "manual_placement",
          manual_placement_selection: pozisyonSec(secilenStil, sosyalFormat),
          shot_size: shotSize,
        };
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const queued = await fal.queue.submit("fal-ai/bria/product-shot", { input } as any);
      return {
        requestId: queued.request_id,
        label: stilEtiketleri[secilenStil] || secilenStil,
        stil: secilenStil,
        model: "fal-ai/bria/product-shot",
      };
    })
  );

  return NextResponse.json({ jobs, isAdmin, pipelineVersion: "v1" });
}

// ── V2 handler ───────────────────────────────────────────────────────────────

async function handleV2(
  params: {
    imageUrl: string;
    shotSize: [number, number];
    stilListesi: string[];
    kategori: Kategori;
    ekPrompt: string;
    brandContext: string;
    userId: string;
    isAdmin: boolean;
  },
  _body: Record<string, unknown>
) {
  const { imageUrl, shotSize, stilListesi, kategori, ekPrompt, brandContext, userId, isAdmin } = params;

  // Pass 1 — Vision (paralel başlat, RMBG ile çakışmasın)
  const visionPromise = visionKategoriTespit(imageUrl);

  // Pass 2 — RMBG (buffer da alınıyor — Pass 2.5 için)
  const { buffer: rmbgBuffer, url: cleanImageUrl } = await rmbgUygulaV2(imageUrl);

  // Pass 2.5 — Sharp ile canvas hazırla (ürün her zaman %85 dolu)
  const { buffer: preparedBuffer, productBox, rmbgZayıf } = await prepareCanvas(rmbgBuffer, {
    targetWidth: shotSize[0],
    targetHeight: shotSize[1],
    productFillRatio: 0.85,
    pad: 40,
  });

  // Hazırlanan canvas'ı fal storage'a yükle
  const preparedImageUrl = await fal.storage.upload(
    new Blob([new Uint8Array(preparedBuffer)], { type: "image/png" })
  );

  // Vision sonucu
  const visionResult = await visionPromise;
  const visionUyumsuz = visionResult.kategori !== kategori;

  if (visionUyumsuz) {
    Sentry.captureMessage(
      `vision-uyumsuz: kullanici=${kategori}, vision=${visionResult.kategori}`,
      "info"
    );
  }

  if (rmbgZayıf) {
    Sentry.captureMessage("rmbg-zayif: alpha-trim yetersiz", {
      level: "warning",
      extra: { kategori, productBox, shotSize, userId },
    });
  }

  Sentry.addBreadcrumb({
    category: "gorsel-v2.1",
    message: `Canvas prepared: product ${productBox.width}x${productBox.height} in ${shotSize[0]}x${shotSize[1]}`,
    data: { kategori, productBox, rmbgZayıf },
  });

  const config = KATEGORI_MODEL_MAP[kategori];

  // Pass 3 — Her stil için model routing + prompt
  const jobs = await Promise.all(
    stilListesi.map(async (secilenStil) => {
      const { positive, negative } = buildPrompt({
        kategori,
        stil: secilenStil as Stil,
        brandContext,
        ekPrompt,
      });

      const input = config.buildInput({
        imageUrl,
        cleanImageUrl,
        preparedImageUrl,
        prompt: positive,
        negativePrompt: negative,
        shotSize,
        manualPlacement: pozisyonSec(secilenStil),
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const queued = await fal.queue.submit(config.primary, { input } as any);

      // DB log — analytics + rollout metrikleri için
      supabaseAdmin.from("gorsel_uretim").insert({
        user_id: userId || null,
        request_id: queued.request_id,
        stil: secilenStil,
        label: stilEtiketleri[secilenStil] || secilenStil,
        kategori,
        model_kullanilan: config.primary,
        prompt_version: GORSEL_PROMPT_VERSION,
        pipeline_version: "v2.1",
        vision_classified_kategori: visionResult.kategori,
        user_kategori_overridden: visionUyumsuz,
      }).then(({ error }) => {
        if (error) logger.warn({ error }, "gorsel_uretim insert hatası");
      });

      return {
        requestId: queued.request_id,
        label: stilEtiketleri[secilenStil] || secilenStil,
        stil: secilenStil,
        model: config.primary,
      };
    })
  );

  return NextResponse.json({ jobs, isAdmin, pipelineVersion: "v2.1" });
}
