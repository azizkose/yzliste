import { describe, it, expect } from "vitest"
import { prepareCanvas } from "@/lib/fal/canvas-prepare"
import sharp from "sharp"

describe("prepareCanvas", () => {
  it("1000x500 ürünü 1000x1500 canvas'ın %85'ine yerleştirir", async () => {
    const mockProduct = await sharp({
      create: { width: 1000, height: 500, channels: 4, background: { r: 100, g: 100, b: 100, alpha: 1 } },
    }).png().toBuffer()

    const result = await prepareCanvas(mockProduct, {
      targetWidth: 1000,
      targetHeight: 1500,
      productFillRatio: 0.85,
    })

    // Ürün usable area'nın (canvas - padding) %85'ini doldurmalı
    // (1000 - 80) * 0.85 = 782 → threshold 770
    expect(result.productBox.width).toBeGreaterThan(770)
    // Ortalanmış olmalı
    expect(result.productBox.x).toBeGreaterThan(0)
    const meta = await sharp(result.buffer).metadata()
    expect(meta.width).toBe(1000)
    expect(meta.height).toBe(1500)
  })

  it("aspect ratio koruyor", async () => {
    // Dikey 500x1000 ürün → canvas 1000x1500 → ürün hâlâ 1:2 oranında
    const mockProduct = await sharp({
      create: { width: 500, height: 1000, channels: 4, background: { r: 100, g: 100, b: 100, alpha: 1 } },
    }).png().toBuffer()

    const result = await prepareCanvas(mockProduct, {
      targetWidth: 1000,
      targetHeight: 1500,
    })

    const ratio = result.productBox.width / result.productBox.height
    expect(ratio).toBeCloseTo(0.5, 1) // 1:2 oran korundu
  })

  it("transparent kenar olan input'u trim eder", async () => {
    // 1000x1000 canvas'ta merkezde 200x200 ürün (kenarlar transparent)
    const product200 = await sharp({
      create: { width: 200, height: 200, channels: 4, background: { r: 100, g: 100, b: 100, alpha: 1 } },
    }).png().toBuffer()

    const padded = await sharp({
      create: { width: 1000, height: 1000, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
    })
      .composite([{ input: product200, left: 400, top: 400 }])
      .png()
      .toBuffer()

    const result = await prepareCanvas(padded, {
      targetWidth: 1000,
      targetHeight: 1000,
      productFillRatio: 0.85,
    })

    // Trim sonrası küçük ürün usable area'nın %85'ini doldurmalı
    // (1000 - 80) * 0.85 = 782 → threshold 770
    expect(result.productBox.width).toBeGreaterThan(770)
  })
})
