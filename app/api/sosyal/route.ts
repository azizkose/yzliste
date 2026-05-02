import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { captionSistemPrompt, captionCiktiParse } from "@/lib/prompts/sosyal";
import { krediDus, krediIade } from "@/lib/credits";
import { AI_MODELS, AI_TEMPERATURES } from "@/lib/ai-config";
import { SOSYAL_PROMPT_VERSION } from "@/lib/prompts/sosyal";
import logger from "@/lib/logger";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

let rlDakika: Ratelimit | null = null;
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  const redis = new Redis({ url: process.env.UPSTASH_REDIS_REST_URL, token: process.env.UPSTASH_REDIS_REST_TOKEN });
  rlDakika = new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(60, "1 m"), prefix: "rl:sosyal:dk" });
}

export async function POST(req: NextRequest) {
  const { urunAdi, ekBilgi, platform, ton, userId, sezon = "normal" } = await req.json();

  if (!userId) return NextResponse.json({ hata: "Giriş yapılmadı" }, { status: 401 });
  if (!urunAdi) return NextResponse.json({ hata: "Ürün adı gerekli" }, { status: 400 });

  if (rlDakika) {
    const { success } = await rlDakika.limit(userId);
    if (!success) return NextResponse.json({ hata: "Çok fazla istek gönderdiniz. Lütfen bir dakika bekleyin." }, { status: 429 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );

  const { data: profil, error: profilError } = await supabase
    .from("profiles")
    .select("kredi, is_admin, is_test, marka_adi, hedef_kitle, vurgulanan_ozellikler, ton, magaza_kategorileri, teslimat_vurgulari")
    .eq("id", userId)
    .single();

  if (profilError) {
    logger.error({ err: profilError.message, userId }, "sosyal: profil sorgusu başarısız");
    return NextResponse.json({ hata: "Kullanıcı bilgileri alınamadı, lütfen tekrar deneyin." }, { status: 500 });
  }
  if (!profil) {
    return NextResponse.json({ hata: "Kullanıcı bulunamadı. Lütfen tekrar giriş yapın." }, { status: 404 });
  }

  const isAdmin = profil.is_admin === true || profil.is_test === true;

  // Atomik kredi düşümü — LLM çağrısından ÖNCE
  if (!isAdmin) {
    const sonuc = await krediDus(userId, 1);
    if (!sonuc.success) {
      return NextResponse.json({ hata: "Yetersiz kredi" }, { status: 402 });
    }
  }

  const markaBaglami = [
    profil.marka_adi ? `Marka adı: ${profil.marka_adi}` : "",
    profil.hedef_kitle ? `Hedef kitle: ${profil.hedef_kitle}` : "",
    profil.vurgulanan_ozellikler ? `Öne çıkarılacak özellikler: ${profil.vurgulanan_ozellikler}` : "",
    (ton || profil.ton) ? `Marka tonu: ${ton || profil.ton}` : "",
    profil.magaza_kategorileri?.length ? `Mağaza kategorileri: ${profil.magaza_kategorileri.join(", ")}` : "",
    profil.teslimat_vurgulari?.length ? `Hizmet vurguları: ${profil.teslimat_vurgulari.join(", ")}` : "",
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
        model: AI_MODELS.social,
        temperature: AI_TEMPERATURES.social,
        max_tokens: 1024,
        system: sistem,
        messages: [{ role: "user", content: kullanici }],
      }),
    });
    const data = await response.json();
    metin = data.content?.[0]?.text || "";
    if (data.stop_reason === "max_tokens") {
      logger.warn({ userId, platform }, "sosyal stop_reason:max_tokens — çıktı kesildi");
    }
  } catch {
    if (!isAdmin) await krediIade(userId, 1);
    return NextResponse.json({ hata: "İçerik üretilemedi, lütfen tekrar deneyin." }, { status: 502 });
  }

  if (!metin) {
    if (!isAdmin) await krediIade(userId, 1);
    return NextResponse.json({ hata: "İçerik üretilemedi, lütfen tekrar deneyin." }, { status: 502 });
  }

  const { caption, hashtag } = captionCiktiParse(metin);

  // Fire-and-forget DB log — failure doesn't block response
  supabase.from("sosyal_uretimler").insert({
    user_id: userId,
    urun_adi: urunAdi,
    platform,
    caption,
    hashtag,
    prompt_version: SOSYAL_PROMPT_VERSION,
  }).then();

  return NextResponse.json({ caption, hashtag });
}
