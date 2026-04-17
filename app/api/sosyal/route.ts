import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { captionSistemPrompt, captionCiktiParse } from "@/lib/prompts/sosyal";

export async function POST(req: NextRequest) {
  const { urunAdi, ekBilgi, platform, ton, userId, sezon = "normal" } = await req.json();

  if (!urunAdi) {
    return NextResponse.json({ hata: "Ürün adı gerekli" }, { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );

  const { data: profil } = await supabase
    .from("profiles")
    .select("kredi, is_admin, marka_adi, hedef_kitle, vurgulanan_ozellikler, ton")
    .eq("id", userId)
    .single();

  if (!profil) {
    return NextResponse.json({ hata: "Kullanıcı bulunamadı" }, { status: 401 });
  }

  if (!profil.is_admin && profil.kredi <= 0) {
    return NextResponse.json({ hata: "Yetersiz kredi" }, { status: 402 });
  }

  const markaBaglami = [
    profil.marka_adi ? `Marka adı: ${profil.marka_adi}` : "",
    profil.hedef_kitle ? `Hedef kitle: ${profil.hedef_kitle}` : "",
    profil.vurgulanan_ozellikler ? `Öne çıkarılacak özellikler: ${profil.vurgulanan_ozellikler}` : "",
    (profil.ton || ton) ? `Marka tonu: ${profil.ton || ton}` : "",
  ].filter(Boolean).join("\n");

  const { sistem, kullanici } = captionSistemPrompt({
    platform,
    urunAdi,
    ekBilgi: ekBilgi || "",
    ton: ton || "tanitim",
    sezon,
    markaBaglami,
  });

  let metin: string;
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1024,
        system: sistem,
        messages: [{ role: "user", content: kullanici }],
      }),
    });
    const data = await response.json();
    metin = data.content?.[0]?.text || "";
  } catch {
    return NextResponse.json({ hata: "İçerik üretilemedi, lütfen tekrar deneyin." }, { status: 502 });
  }

  if (!metin) {
    return NextResponse.json({ hata: "İçerik üretilemedi, lütfen tekrar deneyin." }, { status: 502 });
  }

  const { caption, hashtag } = captionCiktiParse(metin);

  // Atomik kredi düşme
  if (!profil.is_admin) {
    const { data: updated } = await supabase
      .from("profiles")
      .update({ kredi: profil.kredi - 1 })
      .eq("id", userId)
      .gt("kredi", 0)
      .select("kredi")
      .single();

    if (!updated) {
      return NextResponse.json({ hata: "Krediniz bitti." }, { status: 402 });
    }
  }

  return NextResponse.json({ caption, hashtag });
}
