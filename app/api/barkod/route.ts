import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const kod = req.nextUrl.searchParams.get("kod");
  if (!kod) return NextResponse.json({ hata: "Barkod girilmedi" }, { status: 400 });

  try {
    // Önce UPCitemdb dene
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

    // Open Food Facts dene (gıda ürünleri için)
    const res2 = await fetch(`https://world.openfoodfacts.org/api/v0/product/${kod}.json`);
    const data2 = await res2.json();

    if (data2.status === 1 && data2.product) {
      const p = data2.product;
      return NextResponse.json({
        isim: p.product_name_tr || p.product_name || "",
        marka: p.brands || "",
        aciklama: p.ingredients_text_tr || p.ingredients_text || "",
        kategori: p.categories || "",
        renk: "",
        boyut: p.quantity || "",
      });
    }

    // Bulunamadı
    return NextResponse.json({ bulunamadi: true }, { status: 404 });

  } catch {
    return NextResponse.json({ hata: "Sorgu hatasi" }, { status: 500 });
  }
}