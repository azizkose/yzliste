/**
 * GORSEL-V2: Kategori → model routing testleri
 * Araştırma kararları (2026-05-05 / 2026-05-06):
 * - FASHN kaldırıldı (try-on only, flat-lay output yok)
 * - bria/eraser kaldırıldı (mask zorunlu, text-based hedefleme yok)
 * - kontext kaldırıldı (V2.1.1: ürün korunma prensibi — image-edit riski)
 * - tüm kategoriler → bria/product-shot primary (bria-only pipeline)
 */
import { describe, it, expect } from "vitest"
import { KATEGORI_MODEL_MAP } from "@/lib/fal/product-shot-router"
import { buildPrompt, GORSEL_PROMPT_VERSION } from "@/lib/fal/prompts/index"
import { isGorselV2Enabled } from "@/lib/feature-flags-server"
import type { Kategori, Stil } from "@/lib/fal/prompts/index"

describe("GORSEL-V2: KATEGORI_MODEL_MAP", () => {
  it("giyim → primary bria/product-shot (kontext kaldırıldı V2.1.1)", () => {
    expect(KATEGORI_MODEL_MAP.giyim.primary).toBe("fal-ai/bria/product-shot")
  })

  it("giyim → fallback image-apps-v2", () => {
    expect(KATEGORI_MODEL_MAP.giyim.fallback).toBe("fal-ai/image-apps-v2/product-photography")
  })

  it("ayakkabi_canta → primary bria/product-shot", () => {
    expect(KATEGORI_MODEL_MAP.ayakkabi_canta.primary).toBe("fal-ai/bria/product-shot")
  })

  it("kozmetik → primary bria/product-shot", () => {
    expect(KATEGORI_MODEL_MAP.kozmetik.primary).toBe("fal-ai/bria/product-shot")
  })

  it("taki_aksesuar → primary bria/product-shot", () => {
    expect(KATEGORI_MODEL_MAP.taki_aksesuar.primary).toBe("fal-ai/bria/product-shot")
  })

  it("genel → primary bria/product-shot", () => {
    expect(KATEGORI_MODEL_MAP.genel.primary).toBe("fal-ai/bria/product-shot")
  })

  it("tüm kategoriler için primary ve fallback tanımlı", () => {
    const kategoriler: Kategori[] = ["giyim", "ayakkabi_canta", "kozmetik", "taki_aksesuar", "genel"]
    for (const k of kategoriler) {
      expect(KATEGORI_MODEL_MAP[k].primary).toBeTruthy()
      expect(KATEGORI_MODEL_MAP[k].fallback).toBeTruthy()
    }
  })

  it("giyim inputAdapter bria kullanır (kontext kaldırıldı V2.1.1)", () => {
    const input = KATEGORI_MODEL_MAP.giyim.buildInput({
      imageUrl: "https://example.com/img.jpg",
      cleanImageUrl: "https://example.com/clean.jpg",
      preparedImageUrl: "https://example.com/prepared.png",
      prompt: "test prompt",
      negativePrompt: "negative",
      shotSize: [1000, 1500],
      manualPlacement: "bottom_center",
    })
    expect(input.image_url).toBe("https://example.com/prepared.png")
    expect(input.placement_type).toBe("original")
    expect(input.shot_size).toEqual([1000, 1500])
  })

  it("bria inputAdapter preparedImageUrl kullanır + placement_type original", () => {
    const input = KATEGORI_MODEL_MAP.kozmetik.buildInput({
      imageUrl: "https://example.com/img.jpg",
      cleanImageUrl: "https://example.com/clean.jpg",
      preparedImageUrl: "https://example.com/prepared.png",
      prompt: "test",
      negativePrompt: "neg",
      shotSize: [1000, 1000],
      manualPlacement: "center_horizontal",
    })
    // V2.1: hazır canvas kullanılıyor
    expect(input.image_url).toBe("https://example.com/prepared.png")
    expect(input.shot_size).toEqual([1000, 1000])
    // V2.1: bria orijinal konumu korusun
    expect(input.placement_type).toBe("original")
    expect(input.padding_values).toEqual([0, 0, 0, 0])
  })
})

describe("GORSEL-V2: buildPrompt", () => {
  it("prompt version doğru", () => {
    expect(GORSEL_PROMPT_VERSION).toBe("gorsel-v2.0")
  })

  it("giyim × beyaz → hanger removal içeriyor", () => {
    const { positive } = buildPrompt({ kategori: "giyim", stil: "beyaz" })
    expect(positive).toContain("hanger")
    expect(positive).toContain("flat-lay")
  })

  it("giyim negatif prompt → hanger içeriyor", () => {
    const { negative } = buildPrompt({ kategori: "giyim", stil: "beyaz" })
    expect(negative).toContain("no clothes hanger")
    expect(negative).toContain("no mannequin")
  })

  it("kozmetik × mermer → label koruma içeriyor", () => {
    const { positive } = buildPrompt({ kategori: "kozmetik", stil: "mermer" })
    expect(positive).toContain("marble")
  })

  it("ekPrompt sonuna eklenir", () => {
    const { positive } = buildPrompt({ kategori: "genel", stil: "beyaz", ekPrompt: "sarı arka plan" })
    expect(positive).toContain("sarı arka plan")
  })

  it("brandContext prompt'a dahil olur", () => {
    const { positive } = buildPrompt({ kategori: "kozmetik", stil: "beyaz", brandContext: "brand: Testko" })
    expect(positive).toContain("Testko")
  })

  it("5 kategori × 7 stil = 35 kombinasyon hatasız üretilir", () => {
    const kategoriler: Kategori[] = ["giyim", "ayakkabi_canta", "kozmetik", "taki_aksesuar", "genel"]
    const stiller: Stil[] = ["beyaz", "koyu", "lifestyle", "mermer", "ahsap", "gradient", "dogal"]
    let count = 0
    for (const k of kategoriler) {
      for (const s of stiller) {
        const { positive, negative } = buildPrompt({ kategori: k, stil: s })
        expect(positive.length).toBeGreaterThan(20)
        expect(negative.length).toBeGreaterThan(20)
        count++
      }
    }
    expect(count).toBe(35)
  })
})

describe("GORSEL-V2: isGorselV2Enabled (server-side flag)", () => {
  // isGorselV2Enabled process.env'i runtime'da okur — env'i set edip direkt çağırıyoruz

  it("GORSEL_V2_PERCENT=0 iken false döner", () => {
    process.env.GORSEL_V2_PERCENT = "0"
    delete process.env.GORSEL_V2_ALL
    expect(isGorselV2Enabled("user-123")).toBe(false)
  })

  it("GORSEL_V2_ALL=true iken true döner", () => {
    process.env.GORSEL_V2_ALL = "true"
    expect(isGorselV2Enabled("user-123")).toBe(true)
    delete process.env.GORSEL_V2_ALL
  })

  it("userId yok → false döner", () => {
    process.env.GORSEL_V2_PERCENT = "100"
    expect(isGorselV2Enabled(undefined)).toBe(false)
    process.env.GORSEL_V2_PERCENT = "0"
  })

  it("GORSEL_V2_PERCENT=100 → true döner", () => {
    process.env.GORSEL_V2_PERCENT = "100"
    delete process.env.GORSEL_V2_ALL
    expect(isGorselV2Enabled("any-user")).toBe(true)
    process.env.GORSEL_V2_PERCENT = "0"
  })
})
