import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const { urunAdi, kategori, ozellikler, platform, fotolar, girisTipi, barkodBilgi, userId } = await req.json();

  if (!userId) {
    return NextResponse.json({ hata: "Giris yapilmadi" }, { status: 401 });
  }

  const { data: profil } = await supabaseAdmin
    .from("profiles")
    .select("kredi, is_admin")
    .eq("id", userId)
    .single();

  if (!profil) {
    return NextResponse.json({ hata: "Kullanici bulunamadi" }, { status: 404 });
  }

  const isAdmin = profil.is_admin === true;

  if (!isAdmin && profil.kredi <= 0) {
    return NextResponse.json({ hata: "Krediniz bitti. Lutfen kredi satin alin." }, { status: 402 });
  }

  const platformSablonlari: Record<string, string> = {
    trendyol: "Trendyol icin max 100 karakter baslik, 5 madde ozellik, 300 kelime aciklama ve 10 arama etiketi yaz.",
    hepsiburada: "Hepsiburada icin max 150 karakter baslik, 5 madde ozellik, 300 kelime aciklama ve 10 arama etiketi yaz.",
    amazon: "Amazon TR icin max 200 karakter baslik, 5 madde bullet point ozellik, 300 kelime aciklama ve 10 arama etiketi yaz.",
    n11: "N11 icin max 100 karakter baslik, 5 madde ozellik, 200 kelime aciklama ve 8 arama etiketi yaz.",
  };

  type MessageContent =
    | { type: "text"; text: string }
    | { type: "image"; source: { type: "base64"; media_type: string; data: string } };

  const mesajIcerikleri: MessageContent[] = [];

  if (fotolar && fotolar.length > 0) {
    fotolar.slice(0, 3).forEach((foto: string) => {
      const base64 = foto.split(",")[1];
      const mediaType = foto.split(";")[0].split(":")[1];
      mesajIcerikleri.push({ type: "image", source: { type: "base64", media_type: mediaType, data: base64 } });
    });
  }

  let promptMetin = "";
  if (girisTipi === "foto") {
    promptMetin = `Bu urun fotografina bakarak ${platformSablonlari[platform] || platformSablonlari.trendyol}\n\nKategori: ${kategori || "belirtilmedi"}\nEk ozellikler: ${ozellikler || "yok"}`;
  } else if (girisTipi === "barkod" && barkodBilgi) {
    promptMetin = `Urun: ${barkodBilgi.isim}\nMarka: ${barkodBilgi.marka || "belirtilmedi"}\nKategori: ${kategori || "belirtilmedi"}\nBarkod bilgisi: ${barkodBilgi.aciklama || ""}\n\n${platformSablonlari[platform] || platformSablonlari.trendyol}`;
  } else {
    promptMetin = `Urun: ${urunAdi}\nKategori: ${kategori}\nOzellikler: ${ozellikler || "belirtilmedi"}\n\n${platformSablonlari[platform] || platformSablonlari.trendyol}`;
  }

  promptMetin += "\n\nCikti formati:\nBASLIK:\n[baslik]\n\nOZELLIKLER:\n- [ozellik 1]\n- [ozellik 2]\n- [ozellik 3]\n- [ozellik 4]\n- [ozellik 5]\n\nACIKLAMA:\n[aciklama]\n\nARAMA ETIKETLERI:\n[etiket1, etiket2, etiket3]";

  mesajIcerikleri.push({ type: "text", text: promptMetin });

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY || "",
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1500,
      system: "Sen bir Turk e-ticaret icerik uzmanisin. Sadece istenen formatta cikti uret.",
      messages: [{ role: "user", content: mesajIcerikleri }],
    }),
  });

  const data = await response.json();
  const icerik = data.content?.[0]?.text || "Hata olustu.";

  if (!isAdmin) {
    await supabaseAdmin
      .from("profiles")
      .update({ kredi: profil.kredi - 1 })
      .eq("id", userId);
  }

  await supabaseAdmin.from("uretimler").insert({
    user_id: userId,
    urun_adi: urunAdi || barkodBilgi?.isim || "Fotograf ile uretim",
    platform,
    sonuc: icerik,
    giris_tipi: girisTipi,
  });

  return NextResponse.json({ icerik, isAdmin });
}
