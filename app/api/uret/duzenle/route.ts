import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import logger from "@/lib/logger";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

const DUZENLE_SISTEM_PROMPT = `Sen bir e-ticaret içerik düzenleme uzmanısın. Aşağıdaki içeriği verilen talimata göre düzenle.

KRİTİK KURALLAR:
- Bölüm formatını ve sırasını koru (Başlık, Özellikler, Açıklama, Etiketler)
- Karakter/kelime limitlerini aşma
- Rakip marka ismi yazma
- Sağlık iddiası, "sertifikalı", "onaylı", "klinik kanıtlı" gibi doğrulanamaz ifade kullanma
- "Muhtemelen", "olabilir", "tahminimizce" gibi belirsiz ifadeler KULLANMA
- Satış odaklı, ikna edici ve profesyonel yaz`;

const AKSIYON_PROMPTLARI: Record<string, string> = {
  yeniden_uret_context: `Aşağıdaki ürün içeriğini biraz farklı bir versiyonla YENİDEN YAZ:
- Aynı bilgileri kullan, ama farklı kelimeler ve cümle yapıları seç
- Başlık yakın ama farklı bir formülasyon dene
- Açıklamada farklı vurgu noktaları öne çıkar
- Bölüm formatını ve sırasını koru`,

  kisalt: `Aşağıdaki ürün içeriğini KISALT. Bölümlerin formatını koru:
- Başlık: değiştirme
- Özellikler: en güçlü 3 maddeye indir
- Açıklama: yaklaşık yarısına kısalt, ana mesajı koru
- Etiketler/Arama Terimleri: 5-6 en güçlüyü tut`,

  genislet: `Aşağıdaki ürün içeriğini GENİŞLET. Bölümlerin formatını koru:
- Başlık: değiştirme
- Özellikler: 2 madde daha ekle
- Açıklama: %50 daha uzat, kullanım senaryoları ekle
- Etiketler/Arama Terimleri: 3-5 ekstra ekle`,

  ton_samimi: `Aşağıdaki ürün içeriğinin TONUNU DEĞİŞTİR — samimi ve sıcak yap:
"Sen" dili kullan, dostça hitap et. Başlık formatını koru. Bölüm formatını koru.`,

  ton_resmi: `Aşağıdaki ürün içeriğinin TONUNU DEĞİŞTİR — profesyonel ve resmi yap:
Teknik ifadeler ve olgusal dil kullan, duygusal ifadeleri kaldır. Bölüm formatını koru.`,
};

const PLATFORM_CONTEXT: Record<string, string> = {
  trendyol:    "Platform: Trendyol — başlık max 100 karakter, 5 özellik maddesi, Türkçe",
  hepsiburada: "Platform: Hepsiburada — başlık max 100 karakter, 5 özellik maddesi, Türkçe",
  amazon:      "Platform: Amazon TR — başlık max 200 karakter, 5 bullet point, Türkçe",
  n11:         "Platform: N11 — başlık max 100 karakter, 5 özellik maddesi, Türkçe",
  etsy:        "Platform: Etsy — başlık max 140 karakter, 13 etiket, İngilizce",
  amazon_usa:  "Platform: Amazon USA — başlık max 200 karakter, 5 bullet point, İngilizce",
};

export async function POST(req: NextRequest) {
  const { sonuc, aksiyon, userId, platform, kategori } = await req.json();

  if (!userId) return NextResponse.json({ hata: "Giriş yapılmadı" }, { status: 401 });
  if (!sonuc || !aksiyon) return NextResponse.json({ hata: "sonuc ve aksiyon gerekli" }, { status: 400 });

  const prompt = AKSIYON_PROMPTLARI[aksiyon];
  if (!prompt) return NextResponse.json({ hata: "Geçersiz aksiyon" }, { status: 400 });

  const { data: profil } = await supabaseAdmin
    .from("profiles")
    .select("is_admin, kredi")
    .eq("id", userId)
    .single();

  if (!profil) return NextResponse.json({ hata: "Kullanıcı bulunamadı" }, { status: 404 });

  const isAdmin = profil.is_admin === true;

  // Atomik kredi düşümü — LLM çağrısından ÖNCE
  if (!isAdmin) {
    const { data: updated } = await supabaseAdmin
      .from("profiles")
      .update({ kredi: profil.kredi - 1 })
      .eq("id", userId)
      .gte("kredi", 1)
      .select("kredi")
      .single();

    if (!updated) {
      return NextResponse.json({ hata: "Krediniz bitti." }, { status: 402 });
    }
  }

  let yeniSonuc = "";
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 2048,
        system: [
          DUZENLE_SISTEM_PROMPT,
          platform && PLATFORM_CONTEXT[platform] ? PLATFORM_CONTEXT[platform] : "",
          kategori ? `Ürün kategorisi: ${kategori}` : "",
        ].filter(Boolean).join("\n"),
        messages: [{ role: "user", content: `${prompt}\n\n---\n\n${sonuc}` }],
      }),
    });

    const data = await res.json();
    yeniSonuc = data.content?.[0]?.text ?? "";
  } catch (e) {
    // Hata durumunda krediyi geri yükle
    if (!isAdmin) {
      await supabaseAdmin
        .from("profiles")
        .update({ kredi: profil.kredi })
        .eq("id", userId);
    }
    logger.error({ err: e }, "Düzenleme LLM hatası");
    return NextResponse.json({ hata: "İçerik düzenlenemedi, lütfen tekrar deneyin." }, { status: 500 });
  }

  return NextResponse.json({ sonuc: yeniSonuc });
}
