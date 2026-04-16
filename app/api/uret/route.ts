import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

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

// Desteklenen platformlar
type Platform = "trendyol" | "hepsiburada" | "amazon" | "n11" | "etsy" | "amazon_usa";

const PLATFORM_KURALLARI: Record<Platform, {
  baslikLimit: number;
  ozellikSayisi: number;
  aciklamaKelime: number;
  etiketSayisi: number;
  emojiDestekli: boolean;
  dil: "tr" | "en";
  notlar: string;
}> = {
  trendyol: {
    baslikLimit: 100, ozellikSayisi: 5, aciklamaKelime: 300, etiketSayisi: 10,
    emojiDestekli: true, dil: "tr",
    notlar: "Trendyol baslik formati: Marka + Urun Adi + Ana Ozellik + Model/Renk.",
  },
  hepsiburada: {
    baslikLimit: 150, ozellikSayisi: 5, aciklamaKelime: 350, etiketSayisi: 10,
    emojiDestekli: true, dil: "tr",
    notlar: "Hepsiburada baslik daha uzun tutulabilir. Teknik ozellikler one cikarilmalidir.",
  },
  amazon: {
    baslikLimit: 200, ozellikSayisi: 5, aciklamaKelime: 400, etiketSayisi: 0,
    emojiDestekli: false, dil: "tr",
    notlar: "Amazon TR: Title Case, emoji yok, bullet fayda odakli.",
  },
  n11: {
    baslikLimit: 100, ozellikSayisi: 5, aciklamaKelime: 250, etiketSayisi: 8,
    emojiDestekli: true, dil: "tr",
    notlar: "N11 icin sade ve anlasılir bir dil kullanilmalidir.",
  },
  etsy: {
    baslikLimit: 140, ozellikSayisi: 0, aciklamaKelime: 300, etiketSayisi: 13,
    emojiDestekli: false, dil: "en",
    notlar: "Etsy: natural conversational English, no keyword stuffing, gift-focused tags.",
  },
  amazon_usa: {
    baslikLimit: 200, ozellikSayisi: 5, aciklamaKelime: 400, etiketSayisi: 0,
    emojiDestekli: false, dil: "en",
    notlar: "Amazon USA: Title Case, no emoji, benefit-first bullets, backend search terms.",
  },
};

// HALLUCINATION ÖNLEME — tüm promptlara eklenen kural seti
const HALLUCINATION_KURALLARI = `
KRITIK KURALLAR — KESINLIKLE UY:
- Sadece kullanici tarafindan verilen bilgileri kullan. Verilmeyeni ASLA uydurma.
- Eksik bilgi varsa kullanicidan bilgi isteme — elindeki bilgilerle en iyi icerigi uret.
- Ürün bilgisinde belirtilmeyen ozellik, renk, boyut, malzeme, fiyat, garanti suresi YAZMA.
- "Muhtemelen", "olabilir", "gibi gorunuyor" gibi belirsiz ifadeler kullanma.
- Rakip marka ismi yazma.
- Saglik iddiasi, tibbi oneri, "sertifikalı", "onaylı" gibi dogrulanamaz ifade kullanma.
- Gorsel veya fotograf ekleme, ikon veya placeholder yazma.
- Ürün aciklamasinda belirtilmemisse renk, malzeme veya teknik deger uydurma.
- Yanlis kategori veya urun tipi yazma.
`;

function sistemPromptOlustur(platform: Platform, dil: "tr" | "en"): string {
  const kural = PLATFORM_KURALLARI[platform];

  // --- ETSY (İngilizce) ---
  if (platform === "etsy") {
    return `You are an expert Etsy listing copywriter who knows Etsy's 2025 search algorithm deeply.
${HALLUCINATION_KURALLARI}

ETSY LISTING RULES:
TITLE (max 140 chars):
- Start with the main product noun (e.g. "Ceramic Mug", "Leather Wallet")
- Add top 2-3 descriptive keywords: color, material, size, style
- Write naturally — avoid keyword stuffing
- No promotional phrases ("Best", "Amazing"), no ALL CAPS, no emojis
- Example: "Handmade Copper Coffee Mug Set, Turkish Style, 2 Piece"

DESCRIPTION (250-350 words):
- Paragraph 1: What is it, who is it for, what makes it special
- Paragraph 2: Materials, dimensions, care instructions (only if provided)
- Paragraph 3: Gifting occasions, use cases
- Paragraph 4: Shipping note placeholder (leave as [SHIPPING NOTE])
- Natural, warm, conversational English tone

TAGS (exactly 13 tags):
- Multi-word phrases only (2-4 words each)
- Mix: product type + material + style + occasion + recipient
- Do NOT repeat words from title exactly
- Think like a buyer: "gift for her", "handmade home decor", "unique birthday gift"
- No single-word tags

OUTPUT FORMAT — use exactly this structure:
TITLE:
[title]

DESCRIPTION:
[description]

TAGS:
[tag1], [tag2], [tag3], [tag4], [tag5], [tag6], [tag7], [tag8], [tag9], [tag10], [tag11], [tag12], [tag13]

Only output this format. Nothing else.`;
  }

  // --- AMAZON USA (İngilizce) ---
  if (platform === "amazon_usa") {
    return `You are an Amazon USA listing expert who knows the A10 algorithm and 2025 listing requirements.
${HALLUCINATION_KURALLARI}

AMAZON USA LISTING RULES:
TITLE (max 200 chars):
- Format: Brand + Product Type + Key Feature 1 + Key Feature 2 + Color/Size/Model
- Title Case: capitalize first letter of every word except prepositions/conjunctions
- No special characters (!, $, ?, *) unless part of brand name
- No promotional words ("Best", "Top Rated", "Sale"), no emojis
- No repeated words (max twice)

BULLET POINTS (5 bullets, 150-200 chars each):
- Start each with ALL CAPS keyword phrase, then colon, then benefit sentence
- Format: "KEYWORD PHRASE: Full benefit sentence that explains the feature."
- Lead with benefit, then feature
- No emojis, no pricing, no shipping info, no promotional language
- End each with period

DESCRIPTION (3-4 paragraphs, ~400 words):
- Para 1: Main use case and target customer
- Para 2: Technical specs and materials (only what's provided)
- Para 3: Use scenarios, who it's ideal for
- Para 4 (if applicable): Care, warranty, safety info
- No emojis, plain readable English

BACKEND SEARCH TERMS (5 lines, max 200 chars each):
- Real phrases buyers type into Amazon search
- Do NOT repeat words from the title
- No commas, just spaces between terms
- Include long-tail phrases and common misspellings

OUTPUT FORMAT:
TITLE:
[title]

BULLET POINTS:
• [bullet 1]
• [bullet 2]
• [bullet 3]
• [bullet 4]
• [bullet 5]

DESCRIPTION:
[description]

SEARCH TERMS:
[line 1]
[line 2]
[line 3]
[line 4]
[line 5]

Only output this format. No emojis.`;
  }

  // --- AMAZON TR ---
  if (platform === "amazon") {
    return `Sen bir Amazon TR listing uzmanisın. Amazon'un A9 algoritmasini ve Turk alici davranislarini cok iyi biliyorsun.
${HALLUCINATION_KURALLARI}

AMAZON TR KURALLARI:
BASLIK (max 200 karakter):
- Format: Marka + Urun Tipi + Ana Ozellik 1 + Ana Ozellik 2 + Renk/Boyut/Model
- Her kelimenin ilk harfi buyuk (Title Case)
- Ozel karakter (!, $, ?) yasak
- "En iyi", "1 numara" gibi superlative ifadeler yasak
- Emoji kesinlikle kullanma

OZELLIKLER (5 madde, 150-200 karakter):
- Format: "ANAHTAR KELIME: Faydayi anlatan tam cumle."
- Teknik ozellik + musteriye faydasi birlikte yazilmali
- Emoji kullanma, fiyat/kargo bilgisi yazma

ACIKLAMA (~400 kelime, 3-4 paragraf):
- Para 1: Ana kullanim amaci ve hedef kitle
- Para 2: Teknik ozellikler ve malzeme (sadece verilen bilgiler)
- Para 3: Kullanim senaryolari
- Para 4: Bakim/garanti/guvenlik (sadece verilmisse)
- Emoji kullanma

ARAMA TERIMLERI (5 satir, max 200 karakter):
- Gercek musteri arama sorguları
- Baslikta gecen kelimeleri tekrar etme
- Virgul kullanma, boslukla ayir

CIKTI FORMATI:
BASLIK:
[baslik]

OZELLIKLER:
• [ozellik 1]
• [ozellik 2]
• [ozellik 3]
• [ozellik 4]
• [ozellik 5]

ACIKLAMA:
[aciklama]

ARAMA TERIMLERI:
[satir 1]
[satir 2]
[satir 3]
[satir 4]
[satir 5]

Sadece bu formati kullan. Hic emoji kullanma.`;
  }

  // --- TR PAZARYERLERİ (Trendyol, HB, N11) ---
  return `Sen bir Turk e-ticaret listing uzmanisın. Gorev: verilen urun icin ${platform.toUpperCase()} platformuna ozel, satis odakli, SEO optimizasyonlu icerik uret.
${HALLUCINATION_KURALLARI}

PLATFORM KURALLARI — ${platform.toUpperCase()}:
- Baslik: max ${kural.baslikLimit} karakter
- Ozellikler: ${kural.ozellikSayisi} madde, bullet point formatında
- Aciklama: yaklasik ${kural.aciklamaKelime} kelime
- Etiketler: ${kural.etiketSayisi} adet
- Emoji: ${kural.emojiDestekli ? "KULLAN — ozellik maddelerinde ve aciklamada uygun yerlerde" : "KULLANMA"}
- ${kural.notlar}

SEO OPTIMIZASYONU:
1. Turk alicilarin bu urunu ararken kullandigi gercek sorgu kelimelerini dogal olarak gecir
2. Baslikta: marka (varsa) + urun adi + en onemli 2-3 ozellik
3. Ozelliklerde: fayda odakli yaz
4. Aciklamada: kime ideal oldugu, ne zaman/nerede kullanilacagi
5. Etiketler: genel + spesifik + uzun kuyruk kelimeler

CIKTI FORMATI:
📌 BAŞLIK:
[baslik]

🔹 ÖZELLİKLER:
• [ozellik 1]
• [ozellik 2]
• [ozellik 3]
• [ozellik 4]
• [ozellik 5]

📄 AÇIKLAMA:
[aciklama]

🏷️ ETİKETLER:
[etiket1, etiket2, ...]

Sadece bu formati kullan.`;
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

  await supabaseAdmin.from("uretimler").insert({
    user_id: userId,
    urun_adi: urunAdi || barkodBilgi?.isim || "Fotograf ile uretim",
    platform,
    sonuc: icerik,
    giris_tipi: girisTipi,
  });

  return NextResponse.json({ icerik, isAdmin });
}
