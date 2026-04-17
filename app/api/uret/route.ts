import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { METIN_PROMPT_VERSION, Platform, sistemPromptOlustur } from "@/lib/prompts/metin";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

// Rate limiter — opsiyonel: Upstash env yoksa devre dışı
let ratelimit: Ratelimit | null = null;
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
  ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(60, "1 m"),
    prefix: "rl:uret",
  });
}


type MessageContent =
  | { type: "text"; text: string }
  | { type: "image"; source: { type: "base64"; media_type: string; data: string } };

export async function POST(req: NextRequest) {
  const {
    urunAdi, kategori, ozellikler, platform, fotolar,
    girisTipi, barkodBilgi, userId, dil,
  } = await req.json();

  if (!userId) return NextResponse.json({ hata: "Giris yapilmadi" }, { status: 401 });

  // Rate limiting — kullanıcı başına 60 istek/dk
  if (ratelimit) {
    const { success, limit, remaining, reset } = await ratelimit.limit(userId);
    if (!success) {
      return NextResponse.json(
        { hata: "Çok fazla istek gönderdiniz. Lütfen bir dakika bekleyin." },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": String(limit),
            "X-RateLimit-Remaining": String(remaining),
            "X-RateLimit-Reset": String(reset),
          },
        }
      );
    }
  }

  const { data: profil } = await supabaseAdmin
    .from("profiles")
    .select("kredi, is_admin, marka_adi, hedef_kitle, vurgulanan_ozellikler")
    .eq("id", userId)
    .single();

  if (!profil) return NextResponse.json({ hata: "Kullanici bulunamadi" }, { status: 404 });

  const isAdmin = profil.is_admin === true;

  // Atomik kredi düşme: kredi > 0 olanı tek sorguda düş, başarısız olursa 402
  if (!isAdmin) {
    const { data: updated } = await supabaseAdmin
      .from("profiles")
      .update({ kredi: profil.kredi - 1 })
      .eq("id", userId)
      .gt("kredi", 0)
      .select("kredi")
      .single();

    if (!updated) {
      return NextResponse.json({ hata: "Krediniz bitti. Lutfen kredi satin alin." }, { status: 402 });
    }
  }

  const mesajIcerikleri: MessageContent[] = [];

  // Fotoğraf varsa ekle
  if (fotolar && fotolar.length > 0) {
    fotolar.slice(0, 3).forEach((foto: string) => {
      const base64 = foto.split(",")[1];
      const mediaType = foto.split(";")[0].split(":")[1];
      mesajIcerikleri.push({ type: "image", source: { type: "base64", media_type: mediaType, data: base64 } });
    });
  }

  // Kullanıcı bilgisi
  let kullaniciBilgi = "";
  if (girisTipi === "foto") {
    kullaniciBilgi = `Generate listing from this product photo.\nCategory: ${kategori || "not specified"}\nExtra info: ${ozellikler || "none"}`;
    if (dil === "tr") kullaniciBilgi = `Bu urun fotografina bakarak icerik uret.\nKategori: ${kategori || "belirtilmedi"}\nEk bilgi: ${ozellikler || "yok"}`;
  } else if (girisTipi === "barkod" && barkodBilgi) {
    kullaniciBilgi = `Urun adi: ${barkodBilgi.isim}\nMarka: ${barkodBilgi.marka || "belirtilmedi"}\nKategori: ${kategori || "belirtilmedi"}\nAciklama: ${barkodBilgi.aciklama || "yok"}`;
  } else {
    const platformDil: "tr" | "en" = ["etsy", "amazon_usa"].includes(platform) ? "en" : (dil || "tr");
    if (platformDil === "en") {
      kullaniciBilgi = `Product name: ${urunAdi}\nCategory: ${kategori}\nAdditional details: ${ozellikler || "none provided"}`;
    } else {
      kullaniciBilgi = `Urun adi: ${urunAdi}\nKategori: ${kategori}\nEk ozellikler ve bilgiler: ${ozellikler || "belirtilmedi"}`;
    }
  }

  // Marka bağlamı — dolu olan alanlar prompta eklenir
  const platformDilOnceki: "tr" | "en" = ["etsy", "amazon_usa"].includes(platform) ? "en" : (dil || "tr");
  const markaBaglami: string[] = [];
  if (profil.marka_adi) markaBaglami.push(platformDilOnceki === "en" ? `Brand: ${profil.marka_adi}` : `Marka: ${profil.marka_adi}`);
  if (profil.hedef_kitle) markaBaglami.push(platformDilOnceki === "en" ? `Target audience: ${profil.hedef_kitle}` : `Hedef kitle: ${profil.hedef_kitle}`);
  if (profil.vurgulanan_ozellikler) markaBaglami.push(platformDilOnceki === "en" ? `Key selling points to emphasize: ${profil.vurgulanan_ozellikler}` : `Vurgulanacak ozellikler: ${profil.vurgulanan_ozellikler}`);
  if (markaBaglami.length > 0) {
    kullaniciBilgi += platformDilOnceki === "en"
      ? `\n\nBrand context:\n${markaBaglami.join("\n")}`
      : `\n\nMarka baglami:\n${markaBaglami.join("\n")}`;
  }

  mesajIcerikleri.push({ type: "text", text: kullaniciBilgi });

  const platformKey = (platform as Platform) || "trendyol";
  const platformDil: "tr" | "en" = ["etsy", "amazon_usa"].includes(platformKey) ? "en" : (dil || "tr");

  let llmResponse: Response;
  try {
    llmResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY || "",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 2000,
        system: sistemPromptOlustur(platformKey, platformDil),
        messages: [{ role: "user", content: mesajIcerikleri }],
      }),
    });
  } catch {
    // LLM isteği başarısız — krediyi geri yükle
    if (!isAdmin) {
      await supabaseAdmin
        .from("profiles")
        .update({ kredi: profil.kredi })
        .eq("id", userId);
    }
    return NextResponse.json({ hata: "İçerik üretilemedi, lütfen tekrar deneyin." }, { status: 502 });
  }

  const data = await llmResponse.json();
  const icerik = data.content?.[0]?.text;

  if (!icerik) {
    // LLM boş döndü — krediyi geri yükle
    if (!isAdmin) {
      await supabaseAdmin
        .from("profiles")
        .update({ kredi: profil.kredi })
        .eq("id", userId);
    }
    return NextResponse.json({ hata: "İçerik üretilemedi, lütfen tekrar deneyin." }, { status: 502 });
  }

  const { error: insertError } = await supabaseAdmin.from("uretimler").insert({
    user_id: userId,
    urun_adi: urunAdi || barkodBilgi?.isim || "Fotograf ile uretim",
    platform,
    sonuc: icerik,
    giris_tipi: girisTipi,
    prompt_version: METIN_PROMPT_VERSION,
  });

  if (insertError) {
    console.error("Üretim kaydı oluşturulamadı:", insertError.message);
    // Krediyi geri yükle — içerik üretildi ama kaydedilemedi
    if (!isAdmin) {
      await supabaseAdmin
        .from("profiles")
        .update({ kredi: profil.kredi })
        .eq("id", userId);
    }
    return NextResponse.json({ hata: "İçerik kaydedilemedi, lütfen tekrar deneyin." }, { status: 500 });
  }

  return NextResponse.json({ icerik, isAdmin });
}
