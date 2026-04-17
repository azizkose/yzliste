import { NextRequest, NextResponse } from "next/server";
import { fal } from "@fal-ai/client";

fal.config({ credentials: process.env.FAL_KEY });

const ENDPOINT = "fal-ai/bria/product-shot";

export async function GET(req: NextRequest) {
  const requestId = req.nextUrl.searchParams.get("requestId");
  const index = parseInt(req.nextUrl.searchParams.get("index") || "0", 10);

  if (!requestId) {
    return NextResponse.json({ hata: "requestId gerekli" }, { status: 400 });
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await fal.queue.result(ENDPOINT, { requestId }) as any;
    const images: { url: string }[] = result?.data?.images || [];

    if (index >= images.length || !images[index]?.url) {
      return new NextResponse("Görsel bulunamadı", { status: 404 });
    }

    const imgRes = await fetch(images[index].url);
    const contentType = imgRes.headers.get("content-type") || "image/jpeg";
    const buffer = await imgRes.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch (e: unknown) {
    const err = e as { message?: string };
    console.error("IMG PROXY HATA:", err?.message);
    return new NextResponse("Görsel yüklenemedi", { status: 500 });
  }
}
