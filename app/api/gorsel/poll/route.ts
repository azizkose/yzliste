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

  // URL'leri frontend'e yansıtma — proxy üzerinden erişilecek
  return NextResponse.json({ status: status.status });
}
