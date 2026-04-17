import { NextRequest, NextResponse } from "next/server";
import { fal } from "@fal-ai/client";

fal.config({ credentials: process.env.FAL_KEY });

const ENDPOINT = "fal-ai/kling-video/v2.1/standard/image-to-video";

export async function GET(req: NextRequest) {
  const requestId = req.nextUrl.searchParams.get("requestId");
  if (!requestId) {
    return NextResponse.json({ hata: "requestId gerekli" }, { status: 400 });
  }

  const status = await fal.queue.status(ENDPOINT, { requestId, logs: false });

  if (status.status === "COMPLETED") {
    const result = await fal.queue.result(ENDPOINT, { requestId }) as unknown as { data: { video: { url: string } } };
    const videoUrl = result?.data?.video?.url;
    if (!videoUrl) {
      return NextResponse.json({ hata: "Video URL alınamadı" }, { status: 500 });
    }
    return NextResponse.json({ status: "COMPLETED", videoUrl });
  }

  return NextResponse.json({ status: status.status });
}
