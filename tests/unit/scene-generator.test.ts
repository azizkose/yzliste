import { describe, it, expect, vi, beforeEach } from "vitest"
import sharp from "sharp"
import { generateScene } from "@/lib/fal/scene-generator"

// fal mock — bria çağrısını test ortamında simüle et
vi.mock("@fal-ai/client", () => ({
  fal: {
    storage: {
      upload: vi.fn().mockResolvedValue("https://fal.storage/test-product.png"),
    },
    subscribe: vi.fn().mockResolvedValue({
      data: {
        images: [{ url: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AJQAB/9k=" }],
      },
    }),
    config: vi.fn(),
  },
}))

// fetch mock — bria URL'den görsel indirme simülasyonu
const mockJpegBuffer = async () =>
  sharp({ create: { width: 100, height: 100, channels: 3, background: { r: 200, g: 200, b: 200 } } })
    .jpeg({ quality: 80 })
    .toBuffer()

beforeEach(() => {
  global.fetch = vi.fn().mockImplementation(async () => ({
    ok: true,
    arrayBuffer: async () => {
      const buf = await mockJpegBuffer()
      return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength)
    },
  })) as typeof fetch
})

describe("generateScene — programatik sahneler (V2.3)", () => {
  it("beyaz: tüm pikseller #FFFFFF (Trendyol uyumlu)", async () => {
    const buf = await generateScene({ stil: "beyaz", width: 100, height: 100 })
    const { data } = await sharp(buf).raw().toBuffer({ resolveWithObject: true })
    for (let i = 0; i < 30; i += 3) {
      expect(data[i]).toBe(255)
      expect(data[i + 1]).toBe(255)
      expect(data[i + 2]).toBe(255)
    }
  })

  it("koyu: tüm pikseller #1A1A1A", async () => {
    const buf = await generateScene({ stil: "koyu", width: 100, height: 100 })
    const { data } = await sharp(buf).raw().toBuffer({ resolveWithObject: true })
    expect(data[0]).toBe(26)
    expect(data[1]).toBe(26)
    expect(data[2]).toBe(26)
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

  it("koyu: JPEG format döner", async () => {
    const buf = await generateScene({ stil: "koyu", width: 100, height: 100 })
    const meta = await sharp(buf).metadata()
    expect(meta.format).toBe("jpeg")
  })
})

describe("generateScene — atmosferik sahneler (V2.3 bria)", () => {
  const makeProductCanvas = async (w = 100, h = 100): Promise<Buffer> =>
    sharp({
      create: { width: w, height: h, channels: 4, background: { r: 100, g: 100, b: 200, alpha: 255 } },
    })
      .png()
      .toBuffer()

  it("lifestyle: productCanvas olmadan hata fırlatır", async () => {
    await expect(
      generateScene({ stil: "lifestyle", width: 100, height: 100 })
    ).rejects.toThrow("productCanvas gerekli")
  })

  it("mermer: productCanvas olmadan hata fırlatır", async () => {
    await expect(
      generateScene({ stil: "mermer", width: 100, height: 100 })
    ).rejects.toThrow("productCanvas gerekli")
  })

  it("lifestyle: productCanvas ile bria çağırır ve Buffer döner", async () => {
    const productCanvas = await makeProductCanvas()
    const buf = await generateScene({ stil: "lifestyle", width: 100, height: 100, productCanvas })
    expect(Buffer.isBuffer(buf)).toBe(true)
    expect(buf.length).toBeGreaterThan(0)
  })

  it("ahsap: productCanvas ile fal.subscribe çağrılır", async () => {
    const { fal } = await import("@fal-ai/client")
    const productCanvas = await makeProductCanvas()
    await generateScene({ stil: "ahsap", width: 100, height: 100, productCanvas })
    expect(fal.subscribe).toHaveBeenCalledWith(
      "fal-ai/bria/product-shot",
      expect.objectContaining({
        input: expect.objectContaining({ placement_type: "original" }),
      })
    )
  })
})
