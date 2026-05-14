import type { Kategori } from "./prompts/index"

export type ModelId =
  | "fal-ai/bria/product-shot"
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

function briaInput(i: BaseInput) {
  return {
    image_url: i.preparedImageUrl,
    scene_description: i.prompt,
    optimize_description: false,
    num_results: 1,
    fast: true,
    placement_type: "original",
    shot_size: i.shotSize,
    padding_values: [0, 0, 0, 0],
  }
}

/**
 * Kategori → model eşleşmesi.
 *
 * Whitelist: bria/product-shot, image-apps-v2/product-photography
 * Blacklist: flux-pro/kontext ve tüm image-edit modelleri
 *
 * Kural: ürün korunma garantisi — image-edit modelleri ürünü "yeniden yorumlayabilir"
 * (renk, desen, form değişimi riski). Bu kabul edilmez. Bria scene-compose mimarisi
 * ürünü as-is korur, sadece transparent alanı sahneye dönüştürür.
 */
export const KATEGORI_MODEL_MAP: Record<Kategori, ModelConfig> = {
  giyim: {
    primary: "fal-ai/bria/product-shot",
    fallback: "fal-ai/image-apps-v2/product-photography",
    buildInput: briaInput,
  },
  ayakkabi_canta: {
    primary: "fal-ai/bria/product-shot",
    fallback: "fal-ai/image-apps-v2/product-photography",
    buildInput: briaInput,
  },
  kozmetik: {
    primary: "fal-ai/bria/product-shot",
    fallback: "fal-ai/image-apps-v2/product-photography",
    buildInput: briaInput,
  },
  taki_aksesuar: {
    primary: "fal-ai/bria/product-shot",
    fallback: "fal-ai/image-apps-v2/product-photography",
    buildInput: briaInput,
  },
  genel: {
    primary: "fal-ai/bria/product-shot",
    fallback: "fal-ai/image-apps-v2/product-photography",
    buildInput: briaInput,
  },
}

export type { BaseInput, ModelConfig }
