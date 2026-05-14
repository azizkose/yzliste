/**
 * Sahne üreteci — V2.3 hibrit pipeline.
 *
 * - beyaz / koyu: Sharp programatik canvas (garantili renk, ücretsiz, ~0ms)
 * - diğerleri: bria/product-shot scene compose (atmosfer üretir, productCanvas referans)
 *
 * V2.3 kritik notlar:
 * - Bria çıktısı sadece atmosfer kaynağı — ürün katmanı compositeProductOnScene'de re-overlay
 * - productCanvas olmadan atmosferik stil çağrısı hata fırlatır
 */
import sharp from "sharp"
import { fal } from "@fal-ai/client"

export type SceneSil = "beyaz" | "koyu" | "lifestyle" | "mermer" | "ahsap" | "gradient" | "dogal"

interface SceneOptions {
  stil: SceneSil
  width: number
  height: number
  productCanvas?: Buffer  // atmosferik stiller için zorunlu (bria referans)
}

const BRIA_SCENE_PROMPTS: Record<Exclude<SceneSil, "beyaz" | "koyu">, string> = {
  lifestyle: "modern minimalist interior background with subtle wall texture, soft natural daylight from a large window on the side, neutral warm tones, shallow depth of field with softly blurred background, professional editorial photography lighting, atmospheric depth and dimension",
  mermer: "elegant white marble surface and white wall background with subtle gray veining, soft overhead studio lighting with gentle reflections on marble, atmospheric depth, premium aesthetic",
  ahsap: "warm natural wood surface and softly lit wall background with visible wood grain texture, soft warm directional lighting from the side, shallow depth of field with subtle blur, rustic and atmospheric aesthetic",
  gradient: "smooth modern gradient background transitioning from soft pastel cream to off-white, even studio lighting with subtle vignette, atmospheric depth, contemporary minimalist aesthetic",
  dogal: "outdoor natural setting with soft sunlight and green foliage softly blurred in the background, natural stone or wooden surface, shallow depth of field, atmospheric depth and dimension, organic aesthetic",
}

/**
 * Stil bazlı sahne buffer üretir.
 *
 * beyaz/koyu → programatik (Sharp, atmosfer yok, Trendyol uyumlu saf renk)
 * diğerleri  → bria/product-shot (productCanvas referansıyla atmosfer üret)
 *
 * Bria çıktısı compositeProductOnScene'e "atmosfer kaynağı" olarak geçer;
 * ürün katmanı her zaman bizim prepareCanvas buffer'ımızdan re-overlay edilir.
 */
export async function generateScene(opts: SceneOptions): Promise<Buffer> {
  const { stil, width, height, productCanvas } = opts

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
        background: { r: 26, g: 26, b: 26 }, // #1A1A1A — doğal shadow uyumu için saf siyah değil
      },
    }).jpeg({ quality: 95 }).toBuffer()
  }

  // Atmosferik sahne — bria/product-shot ile üret
  if (!productCanvas) {
    throw new Error(`generateScene: "${stil}" stili için productCanvas gerekli (V2.3 bria atmosfer)`)
  }

  // productCanvas'ı fal storage'a yükle (bria URL bekliyor)
  const productUrl = await fal.storage.upload(
    new Blob([new Uint8Array(productCanvas)], { type: "image/png" })
  )

  const result = await fal.subscribe("fal-ai/bria/product-shot", {
    input: {
      image_url: productUrl,
      scene_description: BRIA_SCENE_PROMPTS[stil as Exclude<SceneSil, "beyaz" | "koyu">],
      optimize_description: true,
      num_results: 1,
      fast: true,
      placement_type: "original",
      shot_size: [width, height],
      padding_values: [0, 0, 0, 0],
    },
  }) as unknown as { data: { images: { url: string }[] } }

  const sceneUrl = result?.data?.images?.[0]?.url
  if (!sceneUrl) throw new Error(`Bria atmosfer sahnesi üretilemedi: ${stil}`)

  const sceneRes = await fetch(sceneUrl)
  if (!sceneRes.ok) throw new Error(`Bria sahnesi indirilemedi: ${sceneRes.status}`)

  return Buffer.from(await sceneRes.arrayBuffer())
}
