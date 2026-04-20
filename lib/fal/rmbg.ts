import { fal } from "@fal-ai/client";

/** Arka planı kaldırır; hata olursa orijinal URL döner */
export async function rmbgUygula(imageUrl: string): Promise<string> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await fal.subscribe("fal-ai/bria/background/remove", {
      input: { image_url: imageUrl },
    }) as any;
    return result?.data?.image?.url || imageUrl;
  } catch {
    return imageUrl;
  }
}
