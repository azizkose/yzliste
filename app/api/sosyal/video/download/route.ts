import { NextRequest, NextResponse } from "next/server";
import { fal } from "@fal-ai/client";
import logger from "@/lib/logger";

fal.config({ credentials: process.env.FAL_KEY });

const ENDPOINT = "fal-ai/kling-video/v2.1/standard/image-to-video";

export async function GET(req: NextRequest) {
  const requestId = req.nextUrl.searchParams.get("requestId");
  if (!requestId) {
    return NextResponse.json({ hata: "requestId gerekli" }, { status: 400 });
  }

  try {
    const result = await fal.queue.result(ENDPOINT, { requestId }) as unknown as { data: { video: { url: string } } };
    const videoUrl = result?.data?.video?.url;

    if (!videoUrl) {
      return new NextResponse("Video bulunamadı", { status: 404 });
    }

    const videoRes = await fetch(videoUrl);
    const buffer = await videoRes.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "video/mp4",
        "Content-Disposition": "attachment; filename=urun-video.mp4",
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch (e: unknown) {
    const err = e as { message?: string };
    logger.error({ err: err?.message }, "Video download hatası");
    return new NextResponse("Video indirilemedi", { status: 500 });
  }
}
