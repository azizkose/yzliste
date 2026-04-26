import { NextRequest, NextResponse } from "next/server";
import logger from "@/lib/logger";
import { AI_MODELS, AI_TEMPERATURES } from "@/lib/ai-config";
import { PAKET_LISTESI } from "@/lib/paketler";
import { VIDEO_KREDI, STUDIO_KREDI } from "@/lib/studio-constants";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Rate limiter — opsiyonel: Upstash env yoksa devre dışı
let rlChat: Ratelimit | null = null;
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
  rlChat = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(30, "1 m"),
    prefix: "rl:chat:dk",
  });
}

function buildChatSystemPrompt(): string {
  const paketler = PAKET_LISTESI.map(
    (p) => `- ${p.isim}: ${p.fiyatStr} — ${p.kredi} kredi (tek seferlik)`
  ).join("\n");

  return `Sen yzliste'nin destek asistanısın. Adın "yzliste".

yzliste nedir:
- Trendyol, Hepsiburada, Amazon TR, N11, Etsy ve Amazon USA için yapay zeka destekli içerik üretici
- Ürün başlığı, özellikler, açıklama ve arama etiketleri (listing metni) üretir
- Yapay zeka ile 7 farklı stüdyo görseli üretir: beyaz zemin, koyu zemin, lifestyle, mermer, ahşap, gradient, doğal (+ özel prompt ve referans arka plan seçenekleri)
- Ürün fotoğrafından tanıtım videosu üretir
- Sosyal medya için caption ve hashtag üretir
- yzstudio ile kıyafeti mankene giydirme ve özel manken üretimi yapılır

Nasıl çalışır:
1. Kullanıcı ürün bilgisini 3 yoldan girebilir: manuel metin, fotoğraf yükle, barkod tara
2. Platform seçilir (Trendyol, Hepsiburada, Amazon TR, N11, Etsy, Amazon USA)
3. Yapay zeka o platforma özel içerik üretir

Kredi sistemi:
- Yeni kayıtta 3 kredi hediye verilir — kredi kartı gerekmez
- Listing metni: 1 kredi
- AI görsel: stil başına 1 kredi (indirme ücretsiz, üretimde düşer)
- Video: 5sn = ${VIDEO_KREDI["5"]} kredi · 10sn = ${VIDEO_KREDI["10"]} kredi
- Sosyal medya: 1 kredi/platform · Kit (4 platform, fotoğrafsız): 3 kredi · Kit (fotoğraflı): 4 kredi
- yzstudio mankene giydirme: ${STUDIO_KREDI.tryon.birimKredi} kredi/görsel
- yzstudio manken üretimi: 1 kredi

Paketler ve fiyatlar:
${paketler}
- Krediler süresizdir, sona ermez

Referans programı:
- Arkadaşını davet et → her ikisi de +10 kredi hediye kazanır
- /hesap/profil sayfasından davet linki alınabilir

İletişim:
- Destek maili: destek@yzliste.com — başka mail bilgisi verme

Nasıl konuşursun:
- Kısa ve net cevaplar ver, uzatma
- Türkçe yaz, samimi ama profesyonel ol
- İlk mesajında söyle: "Merhaba! Sana nasıl yardımci olabilirim? Ürün listeleme, görsel, paketler veya teknik bir konuda soruların varsa buradayım."
- Kullanıcının sorununu anlamaya çalış, varsayım yapma
- Şikayetleri ve önerileri nazikçe karşılık al: "Görüşün için teşekkürler, ekibimize ilettim." de
- Bilmediğin bir soru gelirse "Bunun için destek@yzliste.com adresine yazabilirsin, ekibimiz yardımcı olur" de
- Hiç ama hiç başka bir platform, rakip veya yzliste dışında konu hakkında konuşma`;
}

export async function POST(req: NextRequest) {
  // Rate limiting — per-IP 30 req/dk
  if (rlChat) {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim()
      ?? req.headers.get("x-real-ip")
      ?? "anonymous";
    const { success } = await rlChat.limit(ip);
    if (!success) {
      return NextResponse.json(
        { hata: "Çok fazla mesaj gönderdiniz. Lütfen bir dakika bekleyin." },
        { status: 429 }
      );
    }
  }

  try {
    const { mesajlar } = await req.json();

    if (!mesajlar || !Array.isArray(mesajlar)) {
      return NextResponse.json({ hata: "Gecersiz istek" }, { status: 400 });
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: AI_MODELS.chat,
        temperature: AI_TEMPERATURES.chat,
        max_tokens: 500,
        system: buildChatSystemPrompt(),
        messages: mesajlar.map((m: { rol: string; metin: string }) => ({
          role: m.rol === "kullanici" ? "user" : "assistant",
          content: m.metin,
        })),
      }),
    });

    if (!response.ok) {
      const hata = await response.text();
      logger.error({ err: hata }, "Anthropic API hatası");
      return NextResponse.json({ hata: "AI servisi hatasi" }, { status: 500 });
    }

    const data = await response.json();
    const cevap = data.content?.[0]?.text || "Bir hata olustu, tekrar deneyin.";

    return NextResponse.json({ cevap });
  } catch (hata) {
    logger.error({ err: hata }, "Chat route hatası");
    return NextResponse.json({ hata: "Sunucu hatasi" }, { status: 500 });
  }
}
