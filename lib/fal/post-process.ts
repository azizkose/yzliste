/**
 * Pass 4 — Sharp post-process
 *
 * JPEG quality 90 encode + aspect ratio doğrulama.
 * İleride: bounding box detection + auto crop/expand (V2.1).
 *
 * Bağımlılık: sharp paketi gerektirir.
 * Kurulum: npm install sharp
 * Vercel'de sorunsuz çalışır (Next.js image optimization'da kullanılır).
 */

interface PostProcessResult {
  buffer: Buffer
  aspectRatioPreserved: boolean
}

/**
 * Görseli JPEG quality 90 olarak encode eder ve aspect ratio uyumunu kontrol eder.
 * Sharp yüklü değilse orijinal buffer döner (graceful fallback).
 */
export async function postProcessBuffer(
  inputBuffer: Buffer,
  inputAspectRatio: number
): Promise<PostProcessResult> {
  try {
    // Dinamik import — Sharp yüklü değilse graceful fallback
    const sharp = (await import("sharp")).default

    const meta = await sharp(inputBuffer).metadata()
    const outW = meta.width ?? 1
    const outH = meta.height ?? 1
    const outAspect = outW / outH

    // %5 tolerans ile aspect ratio koruma kontrolü
    const aspectDiff = Math.abs(outAspect - inputAspectRatio) / inputAspectRatio
    const aspectRatioPreserved = aspectDiff < 0.05

    const buffer = await sharp(inputBuffer).jpeg({ quality: 90 }).toBuffer()

    return { buffer, aspectRatioPreserved }
  } catch {
    // Sharp yoksa orijinal buffer döndür — üretim devam eder
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

  return {
    buffer,
    contentType: "image/jpeg",
    aspectRatioPreserved,
  }
}
