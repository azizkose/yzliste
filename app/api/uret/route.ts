import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Ratelimit } from "@upstash/ratelimit";
import logger from "@/lib/logger";
import { Redis } from "@upstash/redis";
import { METIN_PROMPT_VERSION, Platform, sistemPromptOlustur, kategoriKoduBul, PLATFORM_KURALLARI, YASAKLI_KELIMELER } from "@/lib/prompts/metin";
import { listingSkorHesapla } from "@/lib/listingSkor";
import { AI_MODELS, AI_TEMPERATURES, AI_COSTS } from "@/lib/ai-config";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

// Rate limiters — opsiyonel: Upstash env yoksa devre dışı
let rlDakika: Ratelimit | null = null; // per-user 60 req/dk
let rlGunluk: Ratelimit | null = null; // per-user 500 req/gün
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
  rlDakika = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(60, "1 m"),
    prefix: "rl:uret:dk",
  });
  rlGunluk = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(500, "1 d"),
    prefix: "rl:uret:gun",
  });
}


type MessageContent =
  | { type: "text"; text: string }
  | { type: "image"; source: { type: "base64"; media_type: string; data: string } };

export async function POST(req: NextRequest) {
  const {
    urunAdi, kategori, ozellikler, platform, fotolar,
    girisTipi, barkodBilgi, userId, dil, ton,
    hedefKitle, fiyatSegmenti, anahtarKelimeler, markaliUrun,
    ucretsizRevize, orijinalUretimId,
  } = await req.json();

  if (!userId) return NextResponse.json({ hata: "Giris yapilmadi" }, { status: 401 });

  // Rate limiting — per-user: 60 req/dk + 500 req/gün
  if (rlDakika) {
    const { success, limit, remaining, reset } = await rlDakika.limit(userId);
    if (!success) {
      return NextResponse.json(
        { hata: "Çok fazla istek gönderdiniz. Lütfen bir dakika bekleyin." },
        { status: 429, headers: { "X-RateLimit-Limit": String(limit), "X-RateLimit-Remaining": String(remaining), "X-RateLimit-Reset": String(reset) } }
      );
    }
  }
  if (rlGunluk) {
    const { success } = await rlGunluk.limit(userId);
    if (!success) {
      return NextResponse.json(
        { hata: "Günlük üretim limitine ulaştınız. Yarın tekrar deneyin." },
        { status: 429 }
      );
    }
  }

  const { data: profil } = await supabaseAdmin
    .from("profiles")
    .select("kredi, is_admin, is_test, marka_adi, hedef_kitle, vurgulanan_ozellikler, magaza_kategorileri, fiyat_bandi, teslimat_vurgulari, benchmark_magaza")
    .eq("id", userId)
    .single();

  if (!profil) return NextResponse.json({ hata: "Kullanici bulunamadi" }, { status: 404 });

  const isAdmin = profil.is_admin === true || profil.is_test === true;

  // Ücretsiz revize kontrolü
  let ucretsizRevizeGecerli = false;
  if (ucretsizRevize && orijinalUretimId) {
    const { data: orijinal } = await supabaseAdmin
      .from("uretimler")
      .select("id, user_id, ucretsiz_revize_kullanildi")
      .eq("id", orijinalUretimId)
      .eq("user_id", userId)
      .single();
    if (orijinal && !orijinal.ucretsiz_revize_kullanildi) {
      ucretsizRevizeGecerli = true;
      // Hakkı hemen kullanıldı olarak işaretle
      await supabaseAdmin.from("uretimler").update({ ucretsiz_revize_kullanildi: true }).eq("id", orijinalUretimId);
    }
  }

  // Atomik kredi düşme: kredi > 0 olanı tek sorguda düş, başarısız olursa 402
  if (!isAdmin && !ucretsizRevizeGecerli) {
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
    const fotoDil: "tr" | "en" = ["etsy", "amazon_usa"].includes(platform) ? "en" : (dil || "tr");
    if (fotoDil === "en") {
      kullaniciBilgi = `Generate listing from this product photo.\nCategory: ${kategori || "not specified"}\nExtra info: ${ozellikler || "none"}`;
      if (hedefKitle && hedefKitle !== "genel") kullaniciBilgi += `\nTarget audience: ${hedefKitle}`;
      if (fiyatSegmenti) kullaniciBilgi += `\nPrice segment: ${fiyatSegmenti}`;
      if (anahtarKelimeler) kullaniciBilgi += `\nPriority keywords: ${anahtarKelimeler}`;
    } else {
      kullaniciBilgi = `Bu urun fotografina bakarak icerik uret.\nKategori: ${kategori || "belirtilmedi"}\nEk bilgi: ${ozellikler || "yok"}`;
      if (hedefKitle && hedefKitle !== "genel") kullaniciBilgi += `\nHedef kitle: ${hedefKitle}`;
      if (fiyatSegmenti) kullaniciBilgi += `\nFiyat segmenti: ${fiyatSegmenti}`;
      if (anahtarKelimeler) kullaniciBilgi += `\nOncelikli anahtar kelimeler: ${anahtarKelimeler}`;
    }
  } else if (girisTipi === "barkod" && barkodBilgi) {
    kullaniciBilgi = `Urun adi: ${barkodBilgi.isim}\nMarka: ${barkodBilgi.marka || "belirtilmedi"}\nKategori: ${kategori || "belirtilmedi"}\nAciklama: ${barkodBilgi.aciklama || "yok"}`;
    if (hedefKitle && hedefKitle !== "genel") kullaniciBilgi += `\nHedef kitle: ${hedefKitle}`;
    if (fiyatSegmenti) kullaniciBilgi += `\nFiyat segmenti: ${fiyatSegmenti}`;
    if (anahtarKelimeler) kullaniciBilgi += `\nOncelikli anahtar kelimeler: ${anahtarKelimeler}`;
  } else {
    const platformDil: "tr" | "en" = ["etsy", "amazon_usa"].includes(platform) ? "en" : (dil || "tr");
    if (platformDil === "en") {
      kullaniciBilgi = `Product name: ${urunAdi}\nCategory: ${kategori}\nAdditional details: ${ozellikler || "none provided"}`;
      if (hedefKitle && hedefKitle !== "genel") kullaniciBilgi += `\nTarget audience: ${hedefKitle}`;
      if (fiyatSegmenti) kullaniciBilgi += `\nPrice segment: ${fiyatSegmenti}`;
      if (anahtarKelimeler) kullaniciBilgi += `\nPriority keywords (weave naturally into title and description): ${anahtarKelimeler}`;
    } else {
      kullaniciBilgi = `Urun adi: ${urunAdi}\nKategori: ${kategori}\nEk ozellikler ve bilgiler: ${ozellikler || "belirtilmedi"}`;
      if (hedefKitle && hedefKitle !== "genel") kullaniciBilgi += `\nHedef kitle: ${hedefKitle}`;
      if (fiyatSegmenti) kullaniciBilgi += `\nFiyat segmenti: ${fiyatSegmenti}`;
      if (anahtarKelimeler) kullaniciBilgi += `\nOncelikli anahtar kelimeler (bunlari dogal sekilde baslik ve aciklamaya yerlestir): ${anahtarKelimeler}`;
    }
  }

  // Marka bağlamı — dolu olan alanlar prompta eklenir
  const platformDilOnceki: "tr" | "en" = ["etsy", "amazon_usa"].includes(platform) ? "en" : (dil || "tr");
  const markaBaglami: string[] = [];
  if (profil.marka_adi) markaBaglami.push(platformDilOnceki === "en" ? `Brand: ${profil.marka_adi}` : `Marka: ${profil.marka_adi}`);
  if (profil.hedef_kitle) markaBaglami.push(platformDilOnceki === "en" ? `Target audience: ${profil.hedef_kitle}` : `Hedef kitle: ${profil.hedef_kitle}`);
  if (profil.vurgulanan_ozellikler) markaBaglami.push(platformDilOnceki === "en" ? `Key selling points to emphasize: ${profil.vurgulanan_ozellikler}` : `Vurgulanacak ozellikler: ${profil.vurgulanan_ozellikler}`);
  if (profil.magaza_kategorileri?.length) markaBaglami.push(platformDilOnceki === "en" ? `Store categories: ${profil.magaza_kategorileri.join(", ")}` : `Mağaza kategorileri: ${profil.magaza_kategorileri.join(", ")}`);
  if (profil.fiyat_bandi) markaBaglami.push(platformDilOnceki === "en" ? `Price segment: ${profil.fiyat_bandi}` : `Fiyat bandı: ${profil.fiyat_bandi}`);
  if (profil.teslimat_vurgulari?.length) markaBaglami.push(platformDilOnceki === "en" ? `Service highlights: ${profil.teslimat_vurgulari.join(", ")}` : `Hizmet vurguları: ${profil.teslimat_vurgulari.join(", ")}`);
  if (profil.benchmark_magaza) markaBaglami.push(platformDilOnceki === "en" ? `Reference store style: ${profil.benchmark_magaza}` : `Referans mağaza tarzı: ${profil.benchmark_magaza}`);
  if (markaBaglami.length > 0) {
    kullaniciBilgi += platformDilOnceki === "en"
      ? `\n\nBrand context:\n${markaBaglami.join("\n")}`
      : `\n\nMarka baglami:\n${markaBaglami.join("\n")}`;
  }

  mesajIcerikleri.push({ type: "text", text: kullaniciBilgi });

  const platformKey = (platform as Platform) || "trendyol";
  const platformDil: "tr" | "en" = ["etsy", "amazon_usa"].includes(platformKey) ? "en" : (dil || "tr");

  let response: Response;
  try {
    response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY || "",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: AI_MODELS.listing,
        temperature: AI_TEMPERATURES.listing,
        max_tokens: ["etsy", "amazon_usa", "amazon"].includes(platformKey) ? 2500 : 1800,
        system: sistemPromptOlustur(platformKey, platformDil, ton, kategoriKoduBul(kategori || ""), fiyatSegmenti, markaliUrun),
        messages: [{ role: "user", content: mesajIcerikleri }],
      }),
    });
  } catch {
    if (!isAdmin) {
      await supabaseAdmin.from("profiles").update({ kredi: profil.kredi }).eq("id", userId);
    }
    return NextResponse.json({ hata: "İçerik üretilemedi, lütfen tekrar deneyin." }, { status: 502 });
  }

  const data = await response.json();
  const icerik = data.content?.[0]?.text;

  const inputTokens: number = data.usage?.input_tokens || 0;
  const outputTokens: number = data.usage?.output_tokens || 0;
  const modelCost = AI_COSTS[AI_MODELS.listing] ?? AI_COSTS["claude-sonnet-4-6"];
  const apiCost = (inputTokens / 1_000_000) * modelCost.input + (outputTokens / 1_000_000) * modelCost.output;

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

  const { data: insertData, error: insertError } = await supabaseAdmin.from("uretimler").insert({
    user_id: userId,
    urun_adi: urunAdi || barkodBilgi?.isim || "Fotograf ile uretim",
    platform,
    sonuc: icerik,
    giris_tipi: girisTipi,
    prompt_version: METIN_PROMPT_VERSION,
    input_token: inputTokens,
    output_token: outputTokens,
    api_cost: apiCost,
  }).select("id").single();

  if (insertError || !insertData) {
    logger.error({ err: insertError?.message }, "Üretim kaydı oluşturulamadı");
    // Krediyi geri yükle — içerik üretildi ama kaydedilemedi
    if (!isAdmin) {
      await supabaseAdmin
        .from("profiles")
        .update({ kredi: profil.kredi })
        .eq("id", userId);
    }
    return NextResponse.json({ hata: "İçerik kaydedilemedi, lütfen tekrar deneyin." }, { status: 500 });
  }

  const { skor, oneriler } = listingSkorHesapla({
    icerik,
    platform: platformKey,
    urunAdi: urunAdi ?? barkodBilgi?.isim,
    kategori,
    ozellikler,
    anahtarKelimeler,
    fotolarVar: fotolar && fotolar.length > 0,
  });

  // Post-generation validation
  const uyarilar: string[] = [];
  const baslikMatch = icerik.match(/(?:📌\s*)?(?:BAŞLIK|BASLIK|TITLE)[:\n]+([^\n]+)/i);
  if (baslikMatch) {
    const baslik = baslikMatch[1].trim();
    const limit = PLATFORM_KURALLARI[platformKey]?.baslikLimit;
    if (limit && baslik.length > limit) {
      uyarilar.push(`Başlık ${baslik.length} karakter — limit ${limit} karakter aşıldı`);
    }
    const yasaklar = YASAKLI_KELIMELER[platformKey] ?? [];
    const bulunan = yasaklar.filter((k) => icerik.toLowerCase().includes(k.toLowerCase()));
    if (bulunan.length > 0) {
      uyarilar.push(`Yasaklı ifade tespit edildi: ${bulunan.slice(0, 3).join(", ")}`);
    }
  }

  return NextResponse.json({ icerik, isAdmin, uretimId: insertData.id, skor, oneriler, uyarilar });
}
