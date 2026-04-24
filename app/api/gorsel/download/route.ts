import { NextRequest, NextResponse } from "next/server";
import { fal } from "@fal-ai/client";
import JSZip from "jszip";

fal.config({ credentials: process.env.FAL_KEY });

const ENDPOINT = "fal-ai/bria/product-shot";

export async function POST(req: NextRequest) {
  const body = await req.json();
  // Backwards compat: tekil requestId → dizi
  const requestIds: string[] = body.requestIds || (body.requestId ? [body.requestId] : []);

  if (!requestIds || requestIds.length === 0)
    return NextResponse.json({ hata: "requestIds gerekli" }, { status: 400 });
  if (!body.userId)
    return NextResponse.json({ hata: "Giris yapilmadi" }, { status: 401 });

  // Kredi düşürme yok — üretimde zaten düştü

  // Tek görsel → direkt döndür
  if (requestIds.length === 1) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await fal.queue.result(ENDPOINT, { requestId: requestIds[0] }) as any;
    const images = result?.data?.images || [];
    if (!images[0]?.url) return NextResponse.json({ hata: "Görsel bulunamadı" }, { status: 404 });

    const imgRes = await fetch(images[0].url);
    const buffer = await imgRes.arrayBuffer();
    const contentType = imgRes.headers.get("content-type") || "image/jpeg";
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": "attachment; filename=yzliste-gorsel.jpg",
      },
    });
  }

  // Çoklu görsel → ZIP
  const zip = new JSZip();
  const folder = zip.folder("yzliste-gorseller")!;

  await Promise.all(
    requestIds.map(async (reqId: string, i: number) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await fal.queue.result(ENDPOINT, { requestId: reqId }) as any;
      const images = result?.data?.images || [];
      if (images[0]?.url) {
        const res = await fetch(images[0].url);
        const buffer = await res.arrayBuffer();
        folder.file(`gorsel-${i + 1}.jpg`, buffer);
      }
    })
  );

  const zipBuffer = await zip.generateAsync({ type: "arraybuffer" });
  return new NextResponse(zipBuffer, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": "attachment; filename=yzliste-gorseller.zip",
    },
  });
}
