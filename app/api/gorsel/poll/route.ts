import { NextRequest, NextResponse } from "next/server";
import { fal } from "@fal-ai/client";

fal.config({ credentials: process.env.FAL_KEY });

const ENDPOINT = "fal-ai/bria/product-shot";

export async function GET(req: NextRequest) {
  const requestId = req.nextUrl.searchParams.get("requestId");
  if (!requestId) {
    return NextResponse.json({ hata: "requestId gerekli" }, { status: 400 });
  }

  const status = await fal.queue.status(ENDPOINT, { requestId, logs: false });

  if (status.status === "COMPLETED") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await fal.queue.result(ENDPOINT, { requestId }) as any;
    const gorseller: string[] = result?.data?.images?.map((img: { url: string }) => img.url) || [];
    return NextResponse.json({ status: "COMPLETED", gorseller });
  }

  return NextResponse.json({ status: status.status });
}
