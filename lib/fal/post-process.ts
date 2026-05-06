/**
 * Pass 4 — Sharp post-process
 *
 * - postProcessBuffer: JPEG quality 90 encode + aspect ratio doğrulama (V1)
 * - compositeProductOnScene: sahne + drop shadow + ürün → final JPEG (V2.2)
 */
import sharp from "sharp"

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

// ── V2.2 Composite pipeline ──────────────────────────────────────────────────

interface CompositeOptions {
  productCanvas: Buffer  // prepareCanvas çıktısı: ürün %85 dolu transparent PNG
  scene: Buffer          // generateScene çıktısı: opak sahne (JPEG veya PNG)
  width: number
  height: number
}

/**
 * Subtle drop shadow oluşturur — ürünün altına Y+20px offset, soft blur.
 * Trendyol standardı: dramatik değil, zeminde bağlantı için yeterli.
 *
 * Yöntem: raw pixel manipulation (Sharp blend mode'larına bağımlı değil).
 */
async function generateDropShadow(
  productCanvas: Buffer,
  width: number,
  height: number
): Promise<Buffer> {
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

  // 3. Alpha mask'i blur et (18px soft blur)
  const blurredAlpha = await sharp(alphaOnly, {
    raw: { width, height, channels: 1 },
  })
    .blur(18)
    .raw()
    .toBuffer()

  // 4. RGBA shadow buffer: siyah piksel + %22 opacity blurred alpha
  const shadowRgba = Buffer.alloc(pixelCount * 4, 0)
  for (let i = 0; i < pixelCount; i++) {
    // R=0, G=0, B=0 (zaten 0), sadece alpha kanalını set et
    shadowRgba[i * 4 + 3] = Math.round(blurredAlpha[i] * 0.22)
  }

  // 5. Y+20px offset: shadow ürünün biraz altına düşsün
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
      top: 20,
      left: 0,
    }])
    .png()
    .toBuffer()
}

/**
 * Sahne + drop shadow + ürün canvas → final JPEG composite.
 *
 * Katman sırası: scene (base) → shadow (blend over) → product (blend over)
 * Graceful fallback: shadow üretimi hatası olursa shadowsuz composite.
 */
export async function compositeProductOnScene(opts: CompositeOptions): Promise<Buffer> {
  const { productCanvas, scene, width, height } = opts

  let shadow: Buffer | null = null
  try {
    shadow = await generateDropShadow(productCanvas, width, height)
  } catch {
    // Shadow opsiyonel — hata olursa shadowsuz devam
    shadow = null
  }

  const layers: sharp.OverlayOptions[] = []
  if (shadow) layers.push({ input: shadow, blend: "over" })
  layers.push({ input: productCanvas, blend: "over" })

  return sharp(scene)
    .resize(width, height, { fit: "fill" }) // sahneyi tam boyuta getir
    .composite(layers)
    .jpeg({ quality: 92 })
    .toBuffer()
}
