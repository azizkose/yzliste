import { describe, it, expect } from "vitest"
import sharp from "sharp"
import { compositeProductOnScene } from "@/lib/fal/post-process"

// 100x100 opak beyaz sahne
async function makeScene(w = 100, h = 100): Promise<Buffer> {
  return sharp({
    create: { width: w, height: h, channels: 3, background: { r: 255, g: 255, b: 255 } },
  })
    .jpeg({ quality: 90 })
    .toBuffer()
}

// 100x100 ürün canvas: merkezi 60x60 dolu, dış şeffaf
async function makeProductCanvas(w = 100, h = 100): Promise<Buffer> {
  const base = await sharp({
    create: { width: w, height: h, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .png()
    .toBuffer()

  const overlay = await sharp({
    create: { width: 60, height: 60, channels: 4, background: { r: 80, g: 120, b: 200, alpha: 255 } },
  })
    .png()
    .toBuffer()

  return sharp(base)
    .composite([{ input: overlay, top: 20, left: 20 }])
    .png()
    .toBuffer()
}

describe("compositeProductOnScene — Mod 1: programatik (beyaz/koyu)", () => {
  it("beyaz stil: JPEG döner, doğru boyut", async () => {
    const scene = await makeScene()
    const productCanvas = await makeProductCanvas()
    const result = await compositeProductOnScene({
      productCanvas, scene, width: 100, height: 100, stil: "beyaz",
    })
    const meta = await sharp(result).metadata()
    expect(meta.format).toBe("jpeg")
    expect(meta.width).toBe(100)
    expect(meta.height).toBe(100)
  })

  it("koyu stil: JPEG döner, doğru boyut", async () => {
    const scene = await makeScene()
    const productCanvas = await makeProductCanvas()
    const result = await compositeProductOnScene({
      productCanvas, scene, width: 100, height: 100, stil: "koyu",
    })
    const meta = await sharp(result).metadata()
    expect(meta.format).toBe("jpeg")
    expect(meta.width).toBe(100)
    expect(meta.height).toBe(100)
  })

  it("stil belirtilmez (V2.2 uyum): yine de çalışır", async () => {
    const scene = await makeScene()
    const productCanvas = await makeProductCanvas()
    const result = await compositeProductOnScene({
      productCanvas, scene, width: 100, height: 100,
    })
    const meta = await sharp(result).metadata()
    expect(meta.format).toBe("jpeg")
  })
})

describe("compositeProductOnScene — Mod 2: atmosferik (bria sahne)", () => {
  it("lifestyle stil: JPEG döner, doğru boyut", async () => {
    const scene = await makeScene()
    const productCanvas = await makeProductCanvas()
    const result = await compositeProductOnScene({
      productCanvas, scene, width: 100, height: 100, stil: "lifestyle",
    })
    const meta = await sharp(result).metadata()
    expect(meta.format).toBe("jpeg")
    expect(meta.width).toBe(100)
    expect(meta.height).toBe(100)
  })

  it("mermer stil: JPEG döner", async () => {
    const scene = await makeScene()
    const productCanvas = await makeProductCanvas()
    const result = await compositeProductOnScene({
      productCanvas, scene, width: 100, height: 100, stil: "mermer",
    })
    const meta = await sharp(result).metadata()
    expect(meta.format).toBe("jpeg")
  })
})

describe("compositeProductOnScene — ürün korunma garantisi", () => {
  it("ürün alpha alanı composite sonrası opak kalır (re-overlay koruması)", async () => {
    const scene = await makeScene()
    const productCanvas = await makeProductCanvas()

    const result = await compositeProductOnScene({
      productCanvas, scene, width: 100, height: 100, stil: "lifestyle",
    })

    // Kompozit JPEG — ürünün merkez pikseli (#50x50) saf beyazdan farklı olmalı
    // (ürün rengi #5078C8 overlay edildi)
    const { data } = await sharp(result).raw().toBuffer({ resolveWithObject: true })
    // Piksel @ (50,50): offset = (50*100 + 50) * 3 = 15150
    const offset = (50 * 100 + 50) * 3
    const r = data[offset]
    const g = data[offset + 1]
    const b = data[offset + 2]
    // Ürün varsa saf beyaz (255,255,255) olmamalı
    const isSolidWhite = r === 255 && g === 255 && b === 255
    expect(isSolidWhite).toBe(false)
  })
})
