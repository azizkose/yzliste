import { NextRequest, NextResponse } from "next/server";
import { fal } from "@fal-ai/client";

fal.config({ credentials: process.env.FAL_KEY });

const DEFAULT_ENDPOINT = "fal-ai/bria/product-shot";

const ALLOWED_ENDPOINTS = new Set([
  "fal-ai/bria/product-shot",
  "fal-ai/image-apps-v2/product-photography",
]);

export async function GET(req: NextRequest) {
  const requestId = req.nextUrl.searchParams.get("requestId");
  if (!requestId) {
    return NextResponse.json({ hata: "requestId gerekli" }, { status: 400 });
  }

  // V2.2 composite jobs: immediate=true, poll gelmez — ama gelirse anında COMPLETED döndür
  if (requestId.startsWith("composite-") || requestId.startsWith("failed-")) {
    return NextResponse.json({ status: "COMPLETED" });
  }

  const modelParam = req.nextUrl.searchParams.get("model");
  const endpoint =
    modelParam && ALLOWED_ENDPOINTS.has(modelParam) ? modelParam : DEFAULT_ENDPOINT;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const status = await fal.queue.status(endpoint, { requestId, logs: false }) as any;

  if (status.status === "FAILED") {
    const errMsg = status?.error?.message || status?.error || "Görsel üretim başarısız";
    return NextResponse.json({ status: "FAILED", hata: String(errMsg) });
  }

  return NextResponse.json({ status: status.status });
}
