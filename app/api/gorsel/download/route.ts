import { NextRequest, NextResponse } from "next/server";
import { fal } from "@fal-ai/client";
import { createClient } from "@supabase/supabase-js";
import JSZip from "jszip";

fal.config({ credentials: process.env.FAL_KEY });

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

const ENDPOINT = "fal-ai/bria/product-shot";

export async function POST(req: NextRequest) {
  const { requestId, userId } = await req.json();

  if (!requestId) return NextResponse.json({ hata: "requestId gerekli" }, { status: 400 });
  if (!userId) return NextResponse.json({ hata: "Giris yapilmadi" }, { status: 401 });

  // Kredi kontrolü ve düşürme
  const { data: profil } = await supabaseAdmin
    .from("profiles")
    .select("kredi, is_admin")
    .eq("id", userId)
    .single();

  if (!profil) return NextResponse.json({ hata: "Kullanici bulunamadi" }, { status: 404 });

  if (!profil.is_admin) {
    const { data: updated } = await supabaseAdmin
      .from("profiles")
      .update({ kredi: profil.kredi - 1 })
      .eq("id", userId)
      .gt("kredi", 0)
      .select("kredi")
      .single();

    if (!updated) return NextResponse.json({ hata: "Krediniz bitti." }, { status: 402 });
  }

  // Fal'dan görselleri çek
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = await fal.queue.result(ENDPOINT, { requestId }) as any;
  const images: { url: string }[] = result?.data?.images || [];

  if (images.length === 0) {
    return NextResponse.json({ hata: "Görsel bulunamadı" }, { status: 404 });
  }

  // ZIP oluştur
  const zip = new JSZip();
  const folder = zip.folder("yzliste-gorseller")!;

  await Promise.all(
    images.map(async (img, i) => {
      const res = await fetch(img.url);
      const buffer = await res.arrayBuffer();
      folder.file(`gorsel-${i + 1}.jpg`, buffer);
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
