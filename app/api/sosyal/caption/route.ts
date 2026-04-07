import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function POST(req: NextRequest) {
  const { urunAdi, kategori, ekBilgi, ton, userId } = await req.json();

  if (!userId) {
    return NextResponse.json({ hata: "Giris yapilmadi" }, { status: 401 });
  }

  const { data: profil } = await supabaseAdmin
    .from("profiles")
    .select("kredi, is_admin, marka_adi, hedef_kitle")
    .eq("id", userId)
    .single();

  if (!profil) {
    return NextResponse.json({ hata: "Kullanici bulunamadi" }, { status: 404 });
  }

  const isAdmin = profil.is_admin === true;

  if (!isAdmin && profil.kredi <= 0) {
    return NextResponse.json({ hata: "Krediniz bitti." }, { status: 402 });
  }

  const tonTanim: Record<string, string> = {
    tanitim: "Ürünü tanıtan, özelliklerini öne çıkaran, satın almaya teşvik eden profesyonel bir ton.",
    indirim: "Aciliyet hissi yaratan, fırsatı vurgulayan, sınırlı stok/süre mesajı içeren bir ton.",
    hikaye: "Ürünün hayata kattığı değeri anlatan, duygusal bağ kuran, samimi bir hikaye anlatıcısı tonu.",
  };

  const markaBilgisi = profil.marka_adi ? `Marka: ${profil.marka_adi}. ` : "";
  const hedefBilgisi = profil.hedef_kitle ? `Hedef kitle: ${profil.hedef_kitle}. ` : "";

  const sistemPrompt = `Sen bir Instagram pazarlama uzmanısın. Türk e-ticaret satıcıları için Instagram post caption'ları yazıyorsun.
${markaBilgisi}${hedefBilgisi}

GÖREV: Verilen ürün için Instagram caption yaz.

TON: ${tonTanim[ton] || tonTanim.tanitim}

KURALLAR:
- Caption 150-300 karakter arası olsun (link bio hariç)
- Emoji kullan, ama abartma (3-5 arası)
- 10-15 alakalı hashtag ekle — hem Türkçe hem İngilizce karışık
- Call-to-action ile bitir (örn: "Sipariş için bio'daki linke tıkla 👆")
- Hashtag'leri caption'dan ayrı satırda ver

CIKTI FORMATI — sadece bu yapıyı kullan:
CAPTION:
[caption metni]

HASHTAG:
[hashtag'ler]`;

  const kullaniciBilgi = `Ürün: ${urunAdi}\nKategori: ${kategori || "belirtilmedi"}\nEk bilgi: ${ekBilgi || "yok"}`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY || "",
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 800,
      system: sistemPrompt,
      messages: [{ role: "user", content: kullaniciBilgi }],
    }),
  });

  const data = await response.json();
  const icerik = data.content?.[0]?.text || "";

  if (!isAdmin) {
    await supabaseAdmin
      .from("profiles")
      .update({ kredi: profil.kredi - 1 })
      .eq("id", userId);
  }

  // Caption ve hashtag'i ayır
  const captionMatch = icerik.match(/CAPTION:\s*([\s\S]*?)(?=HASHTAG:|$)/i);
  const hashtagMatch = icerik.match(/HASHTAG:\s*([\s\S]*?)(?=$)/i);

  return NextResponse.json({
    caption: captionMatch?.[1]?.trim() || icerik,
    hashtag: hashtagMatch?.[1]?.trim() || "",
    isAdmin,
  });
}
