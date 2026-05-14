import { NextRequest, NextResponse } from "next/server";
import { fal } from "@fal-ai/client";
import logger from "@/lib/logger";
import { fetchAndProcess } from "@/lib/fal/post-process";

fal.config({ credentials: process.env.FAL_KEY });

const DEFAULT_ENDPOINT = "fal-ai/bria/product-shot";

const ALLOWED_ENDPOINTS = new Set([
  "fal-ai/bria/product-shot",
  "fal-ai/image-apps-v2/product-photography",
]);

export async function GET(req: NextRequest) {
  const requestId = req.nextUrl.searchParams.get("requestId");
  const index = parseInt(req.nextUrl.searchParams.get("index") || "0", 10);
  const aspectParam = parseFloat(req.nextUrl.searchParams.get("aspect") || "0");

  if (!requestId) {
    return NextResponse.json({ hata: "requestId gerekli" }, { status: 400 });
  }

  const modelParam = req.nextUrl.searchParams.get("model");
  const endpoint =
    modelParam && ALLOWED_ENDPOINTS.has(modelParam) ? modelParam : DEFAULT_ENDPOINT;

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await fal.queue.result(endpoint, { requestId }) as any;
    const images: { url: string }[] = result?.data?.images || [];

    if (index >= images.length || !images[index]?.url) {
      return new NextResponse("Görsel bulunamadı", { status: 404 });
    }

    // Pass 4 — Sharp post-process (JPEG quality 90 + aspect ratio check)
    // aspect param gönderilmişse aspect ratio koruma kontrolü de yapılır
    const inputAspectRatio = aspectParam > 0 ? aspectParam : 1;
    const { buffer, contentType } = await fetchAndProcess(images[index].url, inputAspectRatio);

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch (e: unknown) {
    const err = e as { message?: string };
    logger.error({ err: err?.message }, "Görsel proxy hatası");
    return new NextResponse("Görsel yüklenemedi", { status: 500 });
  }
}
