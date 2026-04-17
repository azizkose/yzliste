import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Platform bazında detaylı kurallar
const PLATFORM_KURALLAR: Record<string, {
  adi: string;
  uzunluk: string;
  hashtagSayisi: string;
  hashtagStrateji: string;
  format: string;
  ekKurallar: string;
}> = {
  instagram: {
    adi: "Instagram",
    uzunluk: "150-220 kelime. İlk 125 karakter çok önemli — 'daha fazla' katlanmadan önce görünen kısım bu.",
    hashtagSayisi: "7-10 hashtag",
    hashtagStrateji: "Karışım: 2-3 yüksek hacimli (#moda, #alisveris), 3-4 orta niş (#turkishfashion, #trendyolda), 2-3 çok spesifik (#yazlikelbise2025). Bitişik yaz, her biri yeni satıra değil.",
    format: "Hook cümlesi (soru veya güçlü iddia) → Ürün faydaları → Duygusal bağ → CTA",
    ekKurallar: "İlk cümle dikkat çekici olmalı. Görseli tamamlar metin yaz, görsel ile aynı şeyi tekrarlama.",
  },
  tiktok: {
    adi: "TikTok",
    uzunluk: "80-120 kelime. Kısa, enerjik ve hızlı okunabilir olmalı.",
    hashtagSayisi: "5-7 hashtag",
    hashtagStrateji: "TikTok'ta trend ve niş tagları karıştır: 2-3 trend (#fyp, #kesfet, #viral), 3-4 ürün/kategori (#moda, #alışveriş). Kısa taglar tercih edilir.",
    format: "Dikkat çekici ilk cümle → Ürün özelliği/faydası → Kıtlık/merak ögesi → CTA",
    ekKurallar: "Kısa cümleler ve paragraflar. Konuşma dili. Trend bir soru veya challenge ile bitirebilirsin.",
  },
  facebook: {
    adi: "Facebook",
    uzunluk: "200-300 kelime. Facebook uzun form içeriği destekler.",
    hashtagSayisi: "3-5 hashtag",
    hashtagStrateji: "Facebook'ta hashtag algoritma etkisi düşük — sadece en ilgili 3-5 etiketi ekle. Kalite > miktar.",
    format: "Hikaye/bağlam → Ürün özellikleri → Sosyal kanıt önerisi → CTA",
    ekKurallar: "Okuyucuyla konuşur gibi yaz. Yorum veya paylaşım teşvik eden bir soru ile bitir.",
  },
  twitter: {
    adi: "Twitter/X",
    uzunluk: "MAKSIMUM 280 karakter (boşluklar ve emojiler dahil). Aşma.",
    hashtagSayisi: "2-3 hashtag",
    hashtagStrateji: "Sadece en güçlü 2-3 hashtagı seç. Twitter'da hashtag içine gömülü kullanılabilir.",
    format: "Güçlü açılış → Ürün değeri → CTA — hepsi 280 karakterde",
    ekKurallar: "Özlü ve punch-line formatı. Her kelime değer taşımalı.",
  },
};

export async function POST(req: NextRequest) {
  const { urunAdi, ekBilgi, platform, ton, userId } = await req.json();

  if (!urunAdi) {
    return NextResponse.json({ hata: "Ürün adı gerekli" }, { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );

  // Admin kontrolü + marka bilgisi
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

  const kural = PLATFORM_KURALLAR[platform] ?? PLATFORM_KURALLAR.instagram;

  const tonAciklama =
    ton === "tanitim"
      ? "ürünü tanıtan, özelliklerini ve avantajlarını net şekilde öne çıkaran"
      : ton === "indirim"
      ? "kampanya ve indirimi vurgulayan, kıtlık/aciliyet hissi yaratan ('Son 2 gün!', 'Sınırlı stok' gibi)"
      : "duygusal bağ kuran, ürünün hayata kattığı değeri hikaye ile anlatan";

  // Marka bağlamı
  const markaSatiri = profil.marka_adi ? `Marka adı: ${profil.marka_adi}` : "";
  const hedefSatiri = profil.hedef_kitle ? `Hedef kitle: ${profil.hedef_kitle}` : "";
  const vurgulananSatiri = profil.vurgulanan_ozellikler ? `Öne çıkarılacak özellikler: ${profil.vurgulanan_ozellikler}` : "";
  const profilTonu = profil.ton || ton;
  const tonSatiri = profilTonu ? `Marka tonu: ${profilTonu}` : "";
  const markaBaglami = [markaSatiri, hedefSatiri, vurgulananSatiri, tonSatiri].filter(Boolean).join("\n");

  const sistem = `Sen bir Türk e-ticaret sosyal medya uzmanısın. ${kural.adi} için satış odaklı, özgün paylaşım metni ve hashtag üretiyorsun.

HALLUCINATION KURALLARI — KESİNLİKLE UYACAKSIN:
- Sadece kullanıcının verdiği bilgileri kullan
- Ürün hakkında tahmin veya varsayım YAPMA
- Boyut, renk, malzeme, fiyat gibi belirtilmeyen detayları UYDURMA
- Belirtilmeyen özellikler için genel ifadeler kullan ("kaliteli malzeme", "özenle üretilmiş" gibi)
${markaBaglami ? `\nMarka bilgileri:\n${markaBaglami}` : ""}`;

  const prompt = `Şu ürün için ${kural.adi} paylaşım metni ve hashtag üret:

Ürün: ${urunAdi}
${ekBilgi ? `Ek bilgi: ${ekBilgi}` : ""}

PLATFORM KURALLARI — ${kural.adi.toUpperCase()}:
- Uzunluk: ${kural.uzunluk}
- Hashtag: ${kural.hashtagSayisi} — ${kural.hashtagStrateji}
- Format: ${kural.format}
- Ek: ${kural.ekKurallar}

İÇERİK KURALLARI:
- Ton: ${tonAciklama}
- Emoji: doğal yerlerde kullan, abartma (max 4-5 emoji)
- Türkçe, sade, çekici ve doğal bir dil
- Harekete geçirici son cümle (satın al, linke tıkla, DM at, profili ziyaret et vb.)
${markaBaglami ? "- Marka bilgilerini metne doğal şekilde yansıt, zorlamadan" : ""}

ÇIKTI FORMATI — TAM OLARAK BU YAPIDA VER:
CAPTION:
[paylaşım metni buraya — sadece metin, hashtag yok]

HASHTAG:
[hashtagler buraya, her biri # ile başlasın, boşlukla ayrılsın]`;

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
        messages: [{ role: "user", content: prompt }],
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

  const captionMatch = metin.match(/CAPTION:\s*([\s\S]+?)(?=HASHTAG:|$)/i);
  const hashtagMatch = metin.match(/HASHTAG:\s*([\s\S]+?)$/i);

  const caption = captionMatch ? captionMatch[1].trim() : metin;
  const hashtag = hashtagMatch ? hashtagMatch[1].trim() : "";

  // Atomik kredi düşme: sadece kredi > 0 olanı güncelle
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
