/**
 * Pass 2.5 — Ürünü hedef canvas'ın %85'ini doldurarak hazırlar.
 *
 * Bria/Kontext modeline güvenmek yerine, biz ürünü doğru boyutta
 * yerleştirip modele veririz. Model sadece transparent alanı sahneye dönüştürür.
 */
import sharp from "sharp"

export interface CanvasPrepareOptions {
  targetWidth: number
  targetHeight: number
  productFillRatio?: number // 0-1, ürünün canvas'ı doldurma oranı (default 0.85)
  pad?: number              // px, ürün etrafına minimum boşluk (default 40)
}

export interface CanvasPrepareResult {
  buffer: Buffer
  productBox: {
    x: number; y: number; width: number; height: number
  }
  inputBoundingBox: {
    x: number; y: number; width: number; height: number
  }
}

/**
 * RMBG sonrası transparent PNG'yi al, ürünü target canvas'ın %fillRatio'sını
 * doldurarak ortala. Aspect ratio korunur, kırpma yapılmaz.
 */
export async function prepareCanvas(
  rmbgPng: Buffer,
  opts: CanvasPrepareOptions
): Promise<CanvasPrepareResult> {
  const { targetWidth, targetHeight, productFillRatio = 0.85, pad = 40 } = opts

  // 1) Alpha kanalına göre bounding box bul + trim
  const trimmed = sharp(rmbgPng).trim({ threshold: 1 })
  const trimMeta = await trimmed.metadata()
  const trimBuffer = await trimmed.toBuffer()

  const productW = trimMeta.width ?? 1
  const productH = trimMeta.height ?? 1

  // 2) Canvas'ta ne kadar yer kaplayacak? (fillRatio + padding)
  const maxW = (targetWidth - pad * 2) * productFillRatio
  const maxH = (targetHeight - pad * 2) * productFillRatio

  const scaleW = maxW / productW
  const scaleH = maxH / productH
  const scale = Math.min(scaleW, scaleH)

  const finalW = Math.round(productW * scale)
  const finalH = Math.round(productH * scale)

  // 3) Ürünü resize et
  const resized = await sharp(trimBuffer)
    .resize(finalW, finalH, { fit: "inside", kernel: "lanczos3" })
    .png()
    .toBuffer()

  // 4) Transparent canvas oluştur, ürünü ortala
  const canvas = await sharp({
    create: {
      width: targetWidth,
      height: targetHeight,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{
      input: resized,
      left: Math.round((targetWidth - finalW) / 2),
      top: Math.round((targetHeight - finalH) / 2),
    }])
    .png()
    .toBuffer()

  return {
    buffer: canvas,
    productBox: {
      x: Math.round((targetWidth - finalW) / 2),
      y: Math.round((targetHeight - finalH) / 2),
      width: finalW,
      height: finalH,
    },
    inputBoundingBox: {
      x: 0, y: 0, width: productW, height: productH,
    },
  }
}
