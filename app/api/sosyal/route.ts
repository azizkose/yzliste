import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  const { urunAdi, ekBilgi, platform, ton, userId } = await req.json();

  if (!urunAdi) {
    return NextResponse.json({ hata: "Ürün adı gerekli" }, { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );

  // Admin kontrolü
  const { data: profil } = await supabase
    .from("profiles")
    .select("kredi, is_admin")
    .eq("id", userId)
    .single();

  if (!profil) {
    return NextResponse.json({ hata: "Kullanıcı bulunamadı" }, { status: 401 });
  }

  if (!profil.is_admin && profil.kredi <= 0) {
    return NextResponse.json({ hata: "Yetersiz kredi" }, { status: 402 });
  }

  // Platform prompt
  const platformAdi =
    platform === "instagram_tiktok"
      ? "Instagram ve TikTok"
      : platform === "facebook"
      ? "Facebook"
      : "Twitter/X";

  const tonAciklama =
    ton === "tanitim"
      ? "ürünü tanıtan, özelliklerini öne çıkaran"
      : ton === "indirim"
      ? "kampanya ve indirimi vurgulayan, aciliyet hissi yaratan"
      : "duygusal bağ kuran, hikaye anlatan";

  const karakterLimit =
    platform === "twitter" ? "280 karakter altında" : "150-300 kelime";

  const sistem = `Sen bir e-ticaret sosyal medya uzmanısın. Türk e-ticaret satıcıları için ${platformAdi} paylaşım metni ve hashtag üretiyorsun.`;

  const prompt = `Şu ürün için ${platformAdi} paylaşım metni yaz:

Ürün: ${urunAdi}
${ekBilgi ? `Ek bilgi: ${ekBilgi}` : ""}

Kurallar:
- Ton: ${tonAciklama}
- Uzunluk: ${karakterLimit}
- Emoji kullan ama abartma
- Türkçe, doğal ve çekici dil
- Harekete geçirici son cümle (satın al, incele, DM at vb.)

Yanıtı tam olarak şu formatta ver:
CAPTION:
[paylaşım metni buraya]

HASHTAG:
[5-15 ilgili hashtag buraya, hepsi # ile başlasın]`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5",
      max_tokens: 1024,
      system: sistem,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data = await response.json();
  const metin = data.content?.[0]?.text || "";

  // Parse
  const captionMatch = metin.match(/CAPTION:\s*([\s\S]+?)(?=HASHTAG:|$)/i);
  const hashtagMatch = metin.match(/HASHTAG:\s*([\s\S]+?)$/i);

  const caption = captionMatch ? captionMatch[1].trim() : metin;
  const hashtag = hashtagMatch ? hashtagMatch[1].trim() : "";

  // Kredi düş (admin değilse)
  if (!profil.is_admin) {
    await supabase
      .from("profiles")
      .update({ kredi: profil.kredi - 1 })
      .eq("id", userId);
  }

  return NextResponse.json({ caption, hashtag });
}
