import { describe, it, expect } from "vitest"
import sharp from "sharp"
import { generateScene } from "@/lib/fal/scene-generator"

describe("generateScene — programatik sahneler", () => {
  it("beyaz: tüm pikseller #FFFFFF (Trendyol uyumlu)", async () => {
    const buf = await generateScene({ stil: "beyaz", width: 100, height: 100 })
    const { data } = await sharp(buf).raw().toBuffer({ resolveWithObject: true })
    // İlk 30 piksel: R, G, B hepsi 255 olmalı
    for (let i = 0; i < 30; i += 3) {
      expect(data[i]).toBe(255)     // R
      expect(data[i + 1]).toBe(255) // G
      expect(data[i + 2]).toBe(255) // B
    }
  })

  it("koyu: tüm pikseller #1A1A1A", async () => {
    const buf = await generateScene({ stil: "koyu", width: 100, height: 100 })
    const { data } = await sharp(buf).raw().toBuffer({ resolveWithObject: true })
    expect(data[0]).toBe(26)  // R
    expect(data[1]).toBe(26)  // G
    expect(data[2]).toBe(26)  // B
  })

  it("beyaz: doğru boyut", async () => {
    const buf = await generateScene({ stil: "beyaz", width: 1500, height: 2000 })
    const meta = await sharp(buf).metadata()
    expect(meta.width).toBe(1500)
    expect(meta.height).toBe(2000)
  })

  it("koyu: doğru boyut", async () => {
    const buf = await generateScene({ stil: "koyu", width: 800, height: 1000 })
    const meta = await sharp(buf).metadata()
    expect(meta.width).toBe(800)
    expect(meta.height).toBe(1000)
  })

  it("beyaz: JPEG format döner", async () => {
    const buf = await generateScene({ stil: "beyaz", width: 100, height: 100 })
    const meta = await sharp(buf).metadata()
    expect(meta.format).toBe("jpeg")
  })
})
