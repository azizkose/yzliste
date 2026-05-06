import { describe, it, expect } from "vitest"
import sharp from "sharp"
import { compositeProductOnScene } from "@/lib/fal/post-process"

describe("compositeProductOnScene", () => {
  it("output JPEG, doğru boyut (1000x1000)", async () => {
    const product = await sharp({
      create: {
        width: 1000, height: 1000,
        channels: 4,
        background: { r: 100, g: 100, b: 100, alpha: 1 },
      },
    }).png().toBuffer()

    const scene = await sharp({
      create: {
        width: 1000, height: 1000,
        channels: 3,
        background: { r: 255, g: 255, b: 255 },
      },
    }).jpeg().toBuffer()

    const result = await compositeProductOnScene({
      productCanvas: product, scene, width: 1000, height: 1000,
    })

    const meta = await sharp(result).metadata()
    expect(meta.width).toBe(1000)
    expect(meta.height).toBe(1000)
    expect(meta.format).toBe("jpeg")
  })

  it("output JPEG, doğru boyut (1500x2000 dikey)", async () => {
    const product = await sharp({
      create: {
        width: 1500, height: 2000,
        channels: 4,
        background: { r: 80, g: 80, b: 80, alpha: 1 },
      },
    }).png().toBuffer()

    const scene = await sharp({
      create: {
        width: 1500, height: 2000,
        channels: 3,
        background: { r: 255, g: 255, b: 255 },
      },
    }).jpeg().toBuffer()

    const result = await compositeProductOnScene({
      productCanvas: product, scene, width: 1500, height: 2000,
    })

    const meta = await sharp(result).metadata()
    expect(meta.width).toBe(1500)
    expect(meta.height).toBe(2000)
    expect(meta.format).toBe("jpeg")
  })

  it("transparent ürün canvas ile graceful (shadow dahil)", async () => {
    // Ortada opak blok, kenarlar transparent
    const inner = await sharp({
      create: {
        width: 500, height: 500,
        channels: 4,
        background: { r: 200, g: 100, b: 50, alpha: 1 },
      },
    }).png().toBuffer()

    const product = await sharp({
      create: {
        width: 1000, height: 1000,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    })
      .composite([{ input: inner, left: 250, top: 250 }])
      .png()
      .toBuffer()

    const scene = await sharp({
      create: {
        width: 1000, height: 1000,
        channels: 3,
        background: { r: 255, g: 255, b: 255 },
      },
    }).jpeg().toBuffer()

    const result = await compositeProductOnScene({
      productCanvas: product, scene, width: 1000, height: 1000,
    })

    const meta = await sharp(result).metadata()
    expect(meta.format).toBe("jpeg")
    expect(meta.width).toBe(1000)
  })
})
