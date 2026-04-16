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

// İÇERİK KURALLARI — tüm promptlara eklenen kural seti
const ICERIK_KURALLARI = `
KRITIK KURALLAR — KESINLIKLE UY:

BILGI KULLANIMI:
- Kullanicinin verdigi bilgileri temel al. Elindeki bilgilerle mumkun olan en iyi icerigi uret.
- Kullanicidan ek bilgi isteme, soru sorma veya eksik bilgi oldugunu belirtme. Sessizce en iyisini yap.
- Urun tanınmis ve bilinen bir urunse (ornegin iPhone, Samsung Galaxy, Dyson supurge, KitchenAid mikser gibi), o urunun GENEL OLARAK BILINEN ozelliklerini kullanabilirsin. Ornegin iPhone'un Retina ekrani oldugu bilinir — bunu yazabilirsin.
- AMA: spesifik model numarasi, fiyat, garanti suresi, stok durumu, olcu/boyut gibi degisken bilgileri ASLA uydurma. Sadece kullanici verdiyse yaz.
- "Muhtemelen", "olabilir", "tahminimizce" gibi belirsiz ifadeler KULLANMA. Ya biliyorsun ya yazma.
- Rakip marka ismi yazma.
- Saglik iddiasi, tibbi oneri, "sertifikali", "onayli", "klinik kanitli" gibi dogrulanamaz ifade kullanma.
- Gorsel, fotograf, ikon veya placeholder yazma.

KOPYA KALITESI:
- Satis odakli, ikna edici ve profesyonel yaz. Pasif degil aktif cumle kur.
- Ozellik degil FAYDA vurgula: "paslanmaz celik" yerine "paslanmaz celik sayesinde yillarca dayanikli".
- Hedef kitleyi dusun: kim alir, neden alir, hangi sorunu cozer?
- Anahtar kelimeleri dogal olarak metne yerlestir, keyword stuffing yapma.
- Her platformun karakter/kelime limitine KESINLIKLE uy. Limiti asma.
`;

const TON_TANIMLARI: Record<string, { tr: string; en: string }> = {
  samimi: {
    tr: "Sicak, samimi ve yakin bir dil kullan. Seni-beni formunda yaz, gunluk konusma diline yakin ama profesyonellikten odun verme.",
    en: "Use a warm, friendly, approachable tone. Write conversationally but maintain professionalism.",
  },
  profesyonel: {
    tr: "Resmi, kurumsal ve guvene dayali bir dil kullan. Net, kesin ifadeler sec. Teknik terminolojiyi dogru kullan.",
    en: "Use a formal, corporate, trust-building tone. Choose precise, clear language. Use technical terminology correctly.",
  },
  premium: {
    tr: "Luks, seckin ve exclusive bir dil kullan. Urunu ozel ve degerli hissettir. Kisa, etkili cumleler kur. Gereksiz detaydan kacin.",
    en: "Use a luxury, exclusive, premium tone. Make the product feel special and valuable. Write concise, impactful sentences.",
  },
};

function sistemPromptOlustur(platform: Platform, dil: "tr" | "en", ton?: string): string {
  const kural = PLATFORM_KURALLARI[platform];
  const tonTanimi = ton && TON_TANIMLARI[ton] ? TON_TANIMLARI[ton][dil] : "";

  // --- ETSY (İngilizce) ---
  if (platform === "etsy") {
    return `You are an elite Etsy listing copywriter with deep expertise in Etsy's search algorithm and buyer psychology. You craft listings that rank high AND convert browsers into buyers.
${ICERIK_KURALLARI}
${tonTanimi ? `BRAND VOICE:\n${tonTanimi}\n` : ""}

ETSY LISTING RULES:

TITLE (max 140 chars):
- Front-load the primary search term buyers actually type (e.g. "Personalized Leather Wallet" not "Wallet Made of Leather")
- Structure: [Primary Keyword] + [Material/Style] + [Use Case or Recipient] + [Differentiator]
- Use commas to separate keyword clusters — each cluster targets a different search query
- No promotional phrases ("Best", "Amazing", "#1"), no ALL CAPS, no emojis, no shop name
- Good: "Handmade Ceramic Coffee Mug, Personalized Gift for Him, Large 16oz Pottery Cup"

DESCRIPTION (250-350 words):
- Opening hook (1-2 sentences): What makes this product special — speak directly to the buyer
- Details section: Materials, dimensions, care (only what's provided or commonly known)
- Gifting & use cases: Who would love this? What occasions fit?
- Close with: "Questions? We're happy to help!" then [SHIPPING NOTE] placeholder
- Tone: warm, authentic, like a maker talking to a friend — NOT corporate or salesy
- Naturally weave in search terms without forcing them
- Use short paragraphs and line breaks for easy scanning

TAGS (exactly 13 tags):
- Multi-word phrases only (2-4 words each), NO single words
- Strategy: mix broad discovery tags + specific long-tail tags
  - 4 tags: product type variations ("ceramic coffee mug", "handmade pottery cup")
  - 3 tags: occasion/recipient ("gift for coffee lover", "housewarming gift idea")
  - 3 tags: style/material ("rustic kitchen decor", "artisan stoneware")
  - 3 tags: long-tail buyer intent ("unique anniversary gift", "custom name mug")
- Do NOT repeat the exact title — use synonym variations
- Think like a buyer searching, not a seller describing

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
    return `You are an elite Amazon USA listing strategist. You deeply understand the A10 algorithm, conversion-optimized copywriting, and how to make listings that rank AND sell.
${ICERIK_KURALLARI}
${tonTanimi ? `BRAND VOICE:\n${tonTanimi}\n` : ""}

AMAZON USA LISTING RULES:

TITLE (max 200 chars):
- Format: [Brand] + [Product Type] + [Key Benefit/Feature] + [Material/Size] + [Use Case/Color]
- Title Case: capitalize every word except articles, prepositions, conjunctions (a, an, the, for, with, in, of)
- Front-load the highest-volume search keyword after brand
- No special characters (!, $, ?, *) unless part of brand name
- No promotional words ("Best", "Top Rated", "#1", "Sale"), no emojis
- No word repeated more than twice
- Good: "BrandX Stainless Steel Insulated Water Bottle 32oz, Leak-Proof Sports Flask for Gym and Travel, Midnight Black"

BULLET POINTS (5 bullets, 150-200 chars each):
- CRITICAL FORMAT: Start with 2-4 word ALL CAPS keyword phrase, colon, then benefit-first sentence
- Bullet 1: Primary benefit / unique selling proposition
- Bullet 2: Material quality or build
- Bullet 3: Key feature + how it helps the buyer
- Bullet 4: Versatility / use cases / who it's for
- Bullet 5: What's included / sizing / compatibility
- Each bullet answers: "Why should I buy THIS over alternatives?"
- No emojis, no pricing, no shipping info, no promotional superlatives

DESCRIPTION (3-4 paragraphs, ~400 words):
- Para 1: Paint a picture — who is this for and what problem does it solve?
- Para 2: Key features and materials with benefit framing (only verified info)
- Para 3: Versatile use scenarios — gift-giving, daily use, specific occasions
- Para 4 (if applicable): Care instructions, what's in the box, compatibility
- Write scannable text with natural keyword integration
- No emojis, professional but approachable English

BACKEND SEARCH TERMS (5 lines, max 200 chars each):
- Real buyer search queries — think "what would someone type into Amazon?"
- Do NOT repeat any word already in the title
- No commas — space-separated terms only
- Include: synonyms, related categories, common misspellings, Spanish equivalents if applicable
- Each line targets a different search intent

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
    return `Sen uzman bir Amazon TR listing stratejistisin. Amazon'un A9/A10 algoritmasini, Turk tuketici psikolojisini ve donusum optimizasyonunu cok iyi biliyorsun.
${ICERIK_KURALLARI}
${tonTanimi ? `MARKA TONU:\n${tonTanimi}\n` : ""}

AMAZON TR KURALLARI:

BASLIK (max 200 karakter):
- Format: [Marka] + [Urun Tipi] + [Ana Fayda/Ozellik] + [Malzeme/Boyut] + [Kullanim/Renk]
- Title Case: her kelimenin ilk harfi buyuk (edatlar haric: ve, ile, icin, veya)
- En yuksek arama hacimli kelimeyi marka sonrasina koy
- Ozel karakter (!, $, ?) yasak, emoji yasak
- "En iyi", "1 numara", "super" gibi superlative ifadeler yasak
- Ayni kelime en fazla 2 kez kullanilabilir

OZELLIKLER (5 madde, 150-200 karakter):
- FORMAT: BUYUK HARF ANAHTAR KELIME: Fayda odakli aciklama cumlesi.
- Madde 1: Ana satis noktasi — neden bu urun?
- Madde 2: Malzeme/yapi kalitesi
- Madde 3: Onemli ozellik + aliciya somut faydasi
- Madde 4: Kullanim alanlari / kimler icin ideal
- Madde 5: Kutu icerigi / boyut / uyumluluk
- Her madde soruyu cevaplar: "Neden rakip yerine BUNU alayim?"
- Emoji, fiyat, kargo bilgisi, promosyon ifadesi YASAK

ACIKLAMA (~400 kelime, 3-4 paragraf):
- Para 1: Hedef kitle ve cozdukleri problem — bir sahne ciz
- Para 2: Ozellikler ve malzeme — fayda cercevesinde anlat (sadece dogrulanmis bilgi)
- Para 3: Kullanim senaryolari — hediye, gunluk kullanim, ozel gunler
- Para 4: Bakim, kutu icerigi, uyumluluk (sadece biliniyorsa)
- Taranabilir, dogal, anahtar kelimeleri organik icerir
- Emoji kesinlikle kullanma

ARAMA TERIMLERI (5 satir, max 200 karakter):
- Gercek Turk alicilarin Amazon'a yazdigi arama sorguları
- Baslikta gecen kelimeleri TEKRAR ETME
- Virgul kullanma, boslukla ayir
- Esanlamlilar, ilgili kategoriler, yaygin yazim hatalari dahil et
- Her satir farkli bir arama niyetini hedeflesin

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
  return `Sen uzman bir Turk e-ticaret metin yazarisın. ${platform.toUpperCase()} platformunun arama algoritmasini, Turk tuketici psikolojisini ve donusum optimizasyonunu derinlemesine biliyorsun. Gorev: verilen urun icin en yuksek tiklama ve satis orani getirecek listing icerigi uret.
${ICERIK_KURALLARI}
${tonTanimi ? `MARKA TONU:\n${tonTanimi}\n` : ""}

PLATFORM KURALLARI — ${platform.toUpperCase()}:
- Baslik: max ${kural.baslikLimit} karakter — HER KARAKTERI DEGERLENDIR, limiti doldur ama ASMA
- Ozellikler: ${kural.ozellikSayisi} madde, bullet point formatinda
- Aciklama: yaklasik ${kural.aciklamaKelime} kelime
- Etiketler: ${kural.etiketSayisi} adet
- Emoji: ${kural.emojiDestekli ? "KULLAN — her ozellik maddesinin basinda ve aciklamada uygun yerlerde, ama abartma (madde basinda 1 emoji yeterli)" : "KULLANMA"}
- ${kural.notlar}

BASLIK STRATEJISI:
- Marka (varsa) + en cok aranan urun adi + en onemli 2-3 ozellik
- Turkiye'deki gercek arama trendlerini dusun: Turk alicilar nasil ariyor?
- Karakter limitini maksimum kullan — kisaltma, her kelime deger katmali
- Gereksiz kelime (satis, ozel, super) yazma

OZELLIK STRATEJISI:
- Her madde: OZELLIK → MUSTERIYE FAYDA formati
- Somut ve olculebilir yaz: "dayanikli" degil "gunluk yogun kullanimda 5+ yil omur"
- Alici endiselerini gider: "kolay temizlenir", "cocuklar icin guvenli" (sadece dogruysa)
- ${kural.emojiDestekli ? "Her maddenin basinda 1 uygun emoji ile dikkat cek" : "Emoji kullanma"}

ACIKLAMA STRATEJISI:
- Giris: Urunu bir ihtiyac/problem cercevesinde tanit — kime neden lazim?
- Gövde: Teknik detaylar + kullanim senaryolari + avantajlar (sadece dogrulanabilir bilgi)
- Kapanış: Satin alma motivasyonu — hediye onerileri, fırsat vurgusu (fiyat yazmadan)
- Kisa paragraflar, kolay okunan yapi
- Dogal SEO: anahtar kelimeleri zorlamadan metne yerlestir

ETIKET STRATEJISI:
- ${kural.etiketSayisi} etiket:
  - 3-4 adet genel kategori etiketleri (ornegin: "kupa bardak", "mutfak urunu")
  - 3-4 adet spesifik ozellik etiketleri (ornegin: "porselen kupa", "el yapimi")
  - Kalan: uzun kuyruk aramalar (ornegin: "anneler gunu hediyesi", "ofis icin bardak")
- Baslikta gecen kelimelerin esanlamlilarini kullan

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
    girisTipi, barkodBilgi, userId, dil, ton,
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
        model: "claude-sonnet-4-6",
        max_tokens: 2000,
        system: sistemPromptOlustur(platformKey, platformDil, ton),
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
