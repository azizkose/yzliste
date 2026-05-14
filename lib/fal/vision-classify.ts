import type { Kategori } from "./prompts/index"
import logger from "@/lib/logger"

const KATEGORILER: Kategori[] = [
  "giyim",
  "ayakkabi_canta",
  "kozmetik",
  "taki_aksesuar",
  "genel",
]

/**
 * Anthropic Haiku ile ürün fotoğrafını kategorize eder.
 *
 * Pass 1 — Vision kategori doğrulama.
 * Kullanıcı seçimi ile karşılaştırılır; uyumsuzluk DB'ye loglanır.
 * V1'de kullanıcıya gösterilmez (silent), ileride uyarı banneri eklenecek.
 *
 * Maliyet: ~$0.0004/çağrı (claude-3-haiku-20240307)
 */
export async function visionKategoriTespit(imageUrl: string): Promise<{
  kategori: Kategori
  confidence: number
}> {
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": process.env.ANTHROPIC_API_KEY ?? "",
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-3-haiku-20240307",
        max_tokens: 10,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: { type: "url", url: imageUrl },
              },
              {
                type: "text",
                text: `Bu fotoğraftaki ürün tipi nedir? Sadece şu 5 kelimeden birini yaz:
giyim / ayakkabi_canta / kozmetik / taki_aksesuar / genel

Tek kelime, başka hiçbir şey yazma.`,
              },
            ],
          },
        ],
      }),
    })

    if (!res.ok) {
      logger.warn({ status: res.status }, "vision-classify: Anthropic API hatası")
      return { kategori: "genel", confidence: 0 }
    }

    const json = (await res.json()) as { content: Array<{ type: string; text: string }> }
    const cevap = json.content?.[0]?.text?.trim().toLowerCase() ?? "genel"

    const kategori = KATEGORILER.find((k) => cevap.includes(k)) ?? "genel"
    return { kategori, confidence: 0.9 }
  } catch (err) {
    logger.warn({ err }, "vision-classify: hata, fallback genel")
    return { kategori: "genel", confidence: 0 }
  }
}
