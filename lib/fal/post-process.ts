/**
 * Pass 4 — Sharp post-process
 *
 * - postProcessBuffer: JPEG quality 90 encode + aspect ratio doğrulama (V1)
 * - compositeProductOnScene: sahne + drop shadow + ürün → final JPEG (V2.2+)
 *
 * V2.3 değişikliği: compositeProductOnScene artık `stil` parametresi alıyor.
 * beyaz/koyu → standart shadow (blur 18px, %22 opacity)
 * atmosferik  → hafif shadow (blur 12px, %15 opacity) — bria doğal gölgesiyle uyumlu
 */
import sharp from "sharp"
import type { SceneSil } from "@/lib/fal/scene-generator"

interface PostProcessResult {
  buffer: Buffer
  aspectRatioPreserved: boolean
}

/**
 * Görseli JPEG quality 90 olarak encode eder ve aspect ratio uyumunu kontrol eder.
 * V1 pipeline ve img/route.ts tarafından kullanılır.
 */
export async function postProcessBuffer(
  inputBuffer: Buffer,
  inputAspectRatio: number
): Promise<PostProcessResult> {
  try {
    const meta = await sharp(inputBuffer).metadata()
    const outW = meta.width ?? 1
    const outH = meta.height ?? 1
    const outAspect = outW / outH
    const aspectDiff = Math.abs(outAspect - inputAspectRatio) / inputAspectRatio
    const aspectRatioPreserved = aspectDiff < 0.05
    const buffer = await sharp(inputBuffer).jpeg({ quality: 90 }).toBuffer()
    return { buffer, aspectRatioPreserved }
  } catch {
    return { buffer: inputBuffer, aspectRatioPreserved: true }
  }
}

/**
 * URL'den görsel indir + post-process uygula.
 * img/route.ts'de kullanılır.
 */
export async function fetchAndProcess(
  imageUrl: string,
  inputAspectRatio: number
): Promise<{ buffer: Buffer; contentType: string; aspectRatioPreserved: boolean }> {
  const res = await fetch(imageUrl)
  if (!res.ok) throw new Error(`Görsel indirilemedi: ${res.status}`)
  const rawBuffer = Buffer.from(await res.arrayBuffer())
  const { buffer, aspectRatioPreserved } = await postProcessBuffer(rawBuffer, inputAspectRatio)
  return { buffer, contentType: "image/jpeg", aspectRatioPreserved }
}

// ── V2.2 / V2.3 Composite pipeline ──────────────────────────────────────────

interface CompositeOptions {
  productCanvas: Buffer  // prepareCanvas çıktısı: ürün %85 dolu transparent PNG
  scene: Buffer          // generateScene çıktısı: opak sahne (JPEG veya PNG)
  width: number
  height: number
  stil?: SceneSil        // V2.3: beyaz/koyu programatik shadow, diğerleri atmosferik (hafif)
}

interface ShadowOptions {
  blur?: number     // default 18px
  opacity?: number  // default 0.22
  offsetY?: number  // default 20px
}

/**
 * Subtle drop shadow oluşturur — ürünün altına Y+offsetY px, soft blur.
 *
 * Yöntem: raw pixel manipulation (Sharp blend mode'larına bağımlı değil).
 */
async function generateDropShadow(
  productCanvas: Buffer,
  width: number,
  height: number,
  shadowOpts: ShadowOptions = {}
): Promise<Buffer> {
  const blur = shadowOpts.blur ?? 18
  const opacity = shadowOpts.opacity ?? 0.22
  const offsetY = shadowOpts.offsetY ?? 20

  // 1. RGBA raw data al
  const rawData = await sharp(productCanvas)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const pixelCount = width * height
  const rgba = rawData.data

  // 2. Alpha kanalını grayscale buffer'a çıkar
  const alphaOnly = Buffer.alloc(pixelCount)
  for (let i = 0; i < pixelCount; i++) {
    alphaOnly[i] = rgba[i * 4 + 3]
  }

  // 3. Alpha mask'i blur et
  const blurredAlpha = await sharp(alphaOnly, {
    raw: { width, height, channels: 1 },
  })
    .blur(blur)
    .raw()
    .toBuffer()

  // 4. RGBA shadow buffer: siyah piksel + opacity*blurred alpha
  const shadowRgba = Buffer.alloc(pixelCount * 4, 0)
  for (let i = 0; i < pixelCount; i++) {
    shadowRgba[i * 4 + 3] = Math.round(blurredAlpha[i] * opacity)
  }

  // 5. offsetY px: shadow ürünün biraz altına düşsün
  return sharp({
    create: {
      width, height,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{
      input: shadowRgba,
      raw: { width, height, channels: 4 },
      top: offsetY,
      left: 0,
    }])
    .png()
    .toBuffer()
}

/**
 * Sahne + drop shadow + ürün canvas → final JPEG composite.
 *
 * V2.3 iki mod:
 * - Programatik (beyaz/koyu): blur 18px, %22 opacity — belirgin studio shadow
 * - Atmosferik (bria sahne):  blur 12px, %15 opacity — bria doğal gölgesiyle uyumlu hafif shadow
 *
 * Her iki modda ürün productCanvas'ı MUTLAK korumalı — bria pseudo product re-overlay ile gömülür.
 *
 * Graceful fallback: shadow üretimi hatası olursa shadowsuz composite.
 */
export async function compositeProductOnScene(opts: CompositeOptions): Promise<Buffer> {
  const { productCanvas, scene, width, height, stil } = opts

  const isAtmospheric = stil && stil !== "beyaz" && stil !== "koyu"

  const shadowOpts: ShadowOptions = isAtmospheric
    ? { blur: 12, opacity: 0.15, offsetY: 15 }
    : { blur: 18, opacity: 0.22, offsetY: 20 }

  let shadow: Buffer | null = null
  try {
    shadow = await generateDropShadow(productCanvas, width, height, shadowOpts)
  } catch {
    shadow = null
  }

  const layers: sharp.OverlayOptions[] = []
  if (shadow) layers.push({ input: shadow, blend: "over" })
  layers.push({ input: productCanvas, blend: "over" })

  return sharp(scene)
    .resize(width, height, { fit: "fill" })
    .composite(layers)
    .jpeg({ quality: 92 })
    .toBuffer()
}
