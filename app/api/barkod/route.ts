import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const kod = req.nextUrl.searchParams.get("kod");
  if (!kod) return NextResponse.json({ hata: "Barkod girilmedi" }, { status: 400 });

  try {
    const res = await fetch(`https://api.upcitemdb.com/prod/trial/lookup?upc=${kod}`);
    const data = await res.json();

    if (data.items && data.items.length > 0) {
      const urun = data.items[0];
      return NextResponse.json({
        isim: urun.title || "",
        marka: urun.brand || "",
        aciklama: urun.description || "",
        kategori: urun.category || "",
        renk: urun.color || "",
        boyut: urun.size || "",
      });
    }

    return NextResponse.json({ hata: "Urun bulunamadi" }, { status: 404 });
  } catch {
    return NextResponse.json({ hata: "Sorgu hatasi" }, { status: 500 });
  }
}