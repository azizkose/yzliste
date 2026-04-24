import { NextRequest, NextResponse } from "next/server";
import { fal } from "@fal-ai/client";

fal.config({ credentials: process.env.FAL_KEY });

const ENDPOINT = "fal-ai/fashn/tryon/v1.6";

export async function GET(req: NextRequest) {
  const requestId = req.nextUrl.searchParams.get("requestId");
  if (!requestId) {
    return NextResponse.json({ hata: "requestId gerekli" }, { status: 400 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const status = await fal.queue.status(ENDPOINT, { requestId, logs: false }) as any;

  if (status.status === "COMPLETED") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await fal.queue.result(ENDPOINT, { requestId }) as any;
    const images: { url: string }[] = result?.data?.images || [];
    return NextResponse.json({ status: "COMPLETED", images });
  }

  if (status.status === "FAILED") {
    const errMsg = status?.error?.message || status?.error || "Giydirme işlemi başarısız";
    return NextResponse.json({ status: "FAILED", hata: String(errMsg) });
  }

  return NextResponse.json({ status: status.status });
}
