import { fal } from "@fal-ai/client";

/** Arka planı kaldırır; hata olursa orijinal URL döner */
export async function rmbgUygula(imageUrl: string): Promise<string> {
  try {
    const result = await fal.subscribe("fal-ai/bria/background/remove", {
      input: { image_url: imageUrl },
    }) as unknown as { data: { image: { url: string } } };
    return result?.data?.image?.url || imageUrl;
  } catch {
    return imageUrl;
  }
}

/**
 * V2 için: RMBG uygula + buffer da döndür (Sharp pipeline için).
 */
export async function rmbgUygulaV2(imageUrl: string): Promise<{
  url: string
  buffer: Buffer
}> {
  try {
    const result = await fal.subscribe("fal-ai/bria/background/remove", {
      input: { image_url: imageUrl },
    }) as unknown as { data: { image: { url: string } } };

    const url = result?.data?.image?.url || imageUrl;
    const res = await fetch(url);
    const buffer = Buffer.from(await res.arrayBuffer());

    return { url, buffer };
  } catch {
    // Fallback: orijinal URL'i indir
    const res = await fetch(imageUrl);
    const buffer = Buffer.from(await res.arrayBuffer());
    return { url: imageUrl, buffer };
  }
}
