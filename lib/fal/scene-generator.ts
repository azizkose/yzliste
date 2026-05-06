/**
 * Sahne üreteci — V2.2 composite pipeline.
 *
 * - beyaz / koyu: Sharp programatik canvas (garantili renk, ücretsiz, ~0ms)
 * - diğerleri: flux-schnell text-to-image ($0.003/görsel, ~4-5sn)
 *
 * Bria/product-shot scene compose kaldırıldı (6 May 2026).
 * Sebep: ürün boyutu garantilemiyor, off-white background veriyor.
 */
import sharp from "sharp"
import { fal } from "@fal-ai/client"

export type SceneSil = "beyaz" | "koyu" | "lifestyle" | "mermer" | "ahsap" | "gradient" | "dogal"

interface SceneOptions {
  stil: SceneSil
  width: number
  height: number
}

const GENERATIVE_PROMPTS: Record<Exclude<SceneSil, "beyaz" | "koyu">, string> = {
  lifestyle: "modern minimalist interior, soft natural daylight from large window, neutral wall, warm tones, NO products, NO objects, NO clothing, just empty room scene, shallow depth of field, professional photography, high resolution",
  mermer: "elegant white marble surface with subtle gray veining, soft overhead studio lighting, NO products, NO objects, just empty marble background, luxury aesthetic, high resolution",
  ahsap: "warm natural wood table surface with visible grain texture, soft warm directional lighting from side, NO products, NO objects, just empty wood background, rustic aesthetic, shallow depth of field",
  gradient: "smooth modern gradient background transitioning from soft pastel tones, even studio lighting, NO products, NO objects, just empty gradient background, contemporary aesthetic, high resolution",
  dogal: "outdoor natural setting, soft sunlight, green foliage in soft focus, natural stone surface, NO products, NO objects, just empty outdoor scene, organic aesthetic, shallow depth of field",
}

/**
 * Stil bazlı sahne buffer üretir.
 * beyaz/koyu → programatik (Sharp), diğerleri → flux-schnell.
 */
export async function generateScene(opts: SceneOptions): Promise<Buffer> {
  const { stil, width, height } = opts

  if (stil === "beyaz") {
    return sharp({
      create: {
        width, height,
        channels: 3,
        background: { r: 255, g: 255, b: 255 }, // #FFFFFF — Trendyol-uyumlu saf beyaz
      },
    }).jpeg({ quality: 95 }).toBuffer()
  }

  if (stil === "koyu") {
    return sharp({
      create: {
        width, height,
        channels: 3,
        background: { r: 26, g: 26, b: 26 }, // #1A1A1A — natural shadow uyumu için saf siyah değil
      },
    }).jpeg({ quality: 95 }).toBuffer()
  }

  // Generative sahne — flux-schnell
  const prompt = GENERATIVE_PROMPTS[stil as Exclude<SceneSil, "beyaz" | "koyu">]

  const result = await fal.subscribe("fal-ai/flux/schnell", {
    input: {
      prompt,
      image_size: { width, height },
      num_inference_steps: 4,
      num_images: 1,
      enable_safety_checker: false,
    },
  }) as unknown as { data: { images: { url: string }[] } }

  const sceneUrl = result?.data?.images?.[0]?.url
  if (!sceneUrl) throw new Error(`Sahne üretilemedi: ${stil}`)

  const sceneRes = await fetch(sceneUrl)
  if (!sceneRes.ok) throw new Error(`Sahne indirilemedi: ${sceneRes.status}`)

  return Buffer.from(await sceneRes.arrayBuffer())
}
