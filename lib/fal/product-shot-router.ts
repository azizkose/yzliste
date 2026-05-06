import type { Kategori } from "./prompts/index"

export type ModelId =
  | "fal-ai/bria/product-shot"
  | "fal-ai/flux-pro/kontext"
  | "fal-ai/image-apps-v2/product-photography"

interface BaseInput {
  imageUrl: string         // orijinal (RMBG öncesi)
  cleanImageUrl: string    // RMBG sonrası (V1 fallback için)
  preparedImageUrl: string // V2.1: Sharp ile hazırlanmış canvas (ürün %85 dolu)
  prompt: string
  negativePrompt: string
  shotSize: [number, number] // [width, height]
  manualPlacement: string
}

interface ModelConfig {
  primary: ModelId
  fallback: ModelId
  buildInput: (i: BaseInput) => Record<string, unknown>
}

/**
 * [width, height] → kontext'in beklediği aspect_ratio string
 * Örn: [1000, 1500] → "2:3"
 */
function toKontextAspectRatio(w: number, h: number): string {
  const ratio = w / h
  const presets: Array<[string, number]> = [
    ["1:1", 1],
    ["4:3", 4 / 3],
    ["3:2", 3 / 2],
    ["16:9", 16 / 9],
    ["21:9", 21 / 9],
    ["3:4", 3 / 4],
    ["2:3", 2 / 3],
    ["9:16", 9 / 16],
    ["9:21", 9 / 21],
  ]
  const closest = presets.reduce((best, curr) =>
    Math.abs(curr[1] - ratio) < Math.abs(best[1] - ratio) ? curr : best
  )
  return closest[0]
}

function briaInput(i: BaseInput) {
  return {
    image_url: i.preparedImageUrl,  // V2.1: hazır canvas, ürün %85 dolu
    scene_description: i.prompt,
    optimize_description: false,    // model prompt'a daha sıkı uysun
    num_results: 1,
    fast: true,
    placement_type: "original",     // bizim yerleştirdiğimiz konumu koru
    shot_size: i.shotSize,
    padding_values: [0, 0, 0, 0],   // bria ekstra boşluk eklemesin
  }
}

function kontextInput(i: BaseInput) {
  return {
    image_url: i.preparedImageUrl,  // V2.1: hazır canvas (RMBG + alpha-trim + resize)
    prompt: i.prompt,
    aspect_ratio: toKontextAspectRatio(i.shotSize[0], i.shotSize[1]),
    guidance_scale: 4.5,            // prompt'a daha sıkı uy
    num_images: 1,
    output_format: "jpeg",
  }
}

/**
 * Kategori → model eşleşmesi.
 * FASHN tryon/v1.5 kaldırıldı: flat-lay output modu yok, try-on only.
 * bria/eraser kaldırıldı: mask zorunlu, text-based hanger silme yok.
 * Giyim için kontext prompt'u hanger silmeyi halleder.
 */
export const KATEGORI_MODEL_MAP: Record<Kategori, ModelConfig> = {
  giyim: {
    primary: "fal-ai/flux-pro/kontext",
    fallback: "fal-ai/bria/product-shot",
    buildInput: kontextInput,
  },
  ayakkabi_canta: {
    primary: "fal-ai/bria/product-shot",
    fallback: "fal-ai/flux-pro/kontext",
    buildInput: briaInput,
  },
  kozmetik: {
    primary: "fal-ai/bria/product-shot",
    fallback: "fal-ai/image-apps-v2/product-photography",
    buildInput: briaInput,
  },
  taki_aksesuar: {
    primary: "fal-ai/bria/product-shot",
    fallback: "fal-ai/flux-pro/kontext",
    buildInput: briaInput,
  },
  genel: {
    primary: "fal-ai/bria/product-shot",
    fallback: "fal-ai/image-apps-v2/product-photography",
    buildInput: briaInput,
  },
}

export type { BaseInput, ModelConfig }
