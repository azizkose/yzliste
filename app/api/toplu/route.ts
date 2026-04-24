import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

type Platform = "trendyol" | "hepsiburada" | "amazon" | "n11" | "etsy" | "amazon_usa";

const PLATFORM_KURALLARI: Record<Platform, {
  baslikLimit: number; ozellikSayisi: number; aciklamaKelime: number;
  etiketSayisi: number; emojiDestekli: boolean; dil: "tr" | "en"; notlar: string;
}> = {
  trendyol:    { baslikLimit: 100, ozellikSayisi: 5, aciklamaKelime: 300, etiketSayisi: 10, emojiDestekli: true,  dil: "tr", notlar: "Trendyol baslik formati: Marka + Urun Adi + Ana Ozellik + Model/Renk." },
  hepsiburada: { baslikLimit: 150, ozellikSayisi: 5, aciklamaKelime: 350, etiketSayisi: 10, emojiDestekli: true,  dil: "tr", notlar: "Hepsiburada baslik daha uzun tutulabilir. Teknik ozellikler one cikarilmalidir." },
  amazon:      { baslikLimit: 200, ozellikSayisi: 5, aciklamaKelime: 400, etiketSayisi: 0,  emojiDestekli: false, dil: "tr", notlar: "Amazon TR: Title Case, emoji yok, bullet fayda odakli." },
  n11:         { baslikLimit: 100, ozellikSayisi: 5, aciklamaKelime: 250, etiketSayisi: 8,  emojiDestekli: true,  dil: "tr", notlar: "N11 icin sade ve anlasılir bir dil kullanilmalidir." },
  etsy:        { baslikLimit: 140, ozellikSayisi: 0, aciklamaKelime: 300, etiketSayisi: 13, emojiDestekli: false, dil: "en", notlar: "Etsy: natural conversational English, no keyword stuffing, gift-focused tags." },
  amazon_usa:  { baslikLimit: 200, ozellikSayisi: 5, aciklamaKelime: 400, etiketSayisi: 0,  emojiDestekli: false, dil: "en", notlar: "Amazon USA: Title Case, no emoji, benefit-first bullets, backend search terms." },
};

const ICERIK_KURALLARI = `
KRITIK KURALLAR — KESINLIKLE UY:
- Kullanicinin verdigi bilgileri temel al. Eksik bilgi oldugunu belirtme, sessizce en iyisini yap.
- Spesifik model numarasi, fiyat, garanti suresi gibi degisken bilgileri ASLA uydurma.
- "Muhtemelen", "olabilir" gibi belirsiz ifadeler KULLANMA.
- Rakip marka ismi yazma.
- Saglik iddiasi veya dogrulanamaz ifade kullanma.
- Satis odakli, ikna edici ve profesyonel yaz. Ozellik degil FAYDA vurgula.
- Her platformun karakter/kelime limitine KESINLIKLE uy.
`;

const TON_TANIMLARI: Record<string, { tr: string; en: string }> = {
  samimi:      { tr: "Sicak, samimi ve yakin bir dil kullan. Seni-beni formunda yaz.", en: "Use a warm, friendly, approachable tone. Write conversationally." },
  profesyonel: { tr: "Resmi, kurumsal ve guvene dayali bir dil kullan. Net, kesin ifadeler sec.", en: "Use a formal, corporate tone. Choose precise, clear language." },
  premium:     { tr: "Luks, seckin bir dil kullan. Urunu ozel hissettir. Kisa etkili cumleler kur.", en: "Use a luxury, exclusive tone. Make the product feel special." },
};

function sistemPromptOlustur(platform: Platform, dil: "tr" | "en", ton?: string): string {
  const kural = PLATFORM_KURALLARI[platform];
  const tonTanimi = ton && TON_TANIMLARI[ton] ? TON_TANIMLARI[ton][dil] : "";
  if (dil === "en") {
    return `You are a professional e-commerce copywriter for ${platform.toUpperCase()}.
Platform rules: title max ${kural.baslikLimit} chars, ${kural.ozellikSayisi > 0 ? kural.ozellikSayisi + " bullet points" : "no bullets"}, description max ${kural.aciklamaKelime} words${kural.etiketSayisi > 0 ? `, ${kural.etiketSayisi} tags` : ""}, ${kural.emojiDestekli ? "emojis allowed" : "no emojis"}.
${kural.notlar}
${ICERIK_KURALLARI}
${tonTanimi ? `BRAND VOICE:\n${tonTanimi}\n` : ""}
Output format — use these exact headers:
## Başlık
## Özellikler
## Açıklama
${kural.etiketSayisi > 0 ? "## Etiketler\n" : ""}`;
  }
  return `Sen ${platform.toUpperCase()} icin profesyonel bir e-ticaret metin yazarisin.
Platform kurallari: baslik max ${kural.baslikLimit} karakter, ${kural.ozellikSayisi > 0 ? kural.ozellikSayisi + " madde" : "madde yok"}, aciklama max ${kural.aciklamaKelime} kelime${kural.etiketSayisi > 0 ? `, ${kural.etiketSayisi} etiket` : ""}, ${kural.emojiDestekli ? "emoji kullanilabilir" : "emoji kullanilmaz"}.
${kural.notlar}
${ICERIK_KURALLARI}
${tonTanimi ? `MARKA TONU:\n${tonTanimi}\n` : ""}
Cikti formati — tam olarak bu basliklari kullan:
## Başlık
## Özellikler
## Açıklama
${kural.etiketSayisi > 0 ? "## Etiketler\n" : ""}`;
}

export async function POST(req: NextRequest) {
  const { satirlar, platform, ton, markaOverride, userId } = await req.json() as {
    satirlar: Record<string, string>[];
    platform: Platform;
    ton: string;
    markaOverride?: string;
    userId: string;
  };

  if (!userId) return new Response("Giris yapilmadi", { status: 401 });
  if (!satirlar?.length) return new Response("Satir bulunamadi", { status: 400 });

  const { data: profil } = await supabaseAdmin
    .from("profiles")
    .select("kredi, is_admin, marka_adi, hedef_kitle, vurgulanan_ozellikler, magaza_kategorileri, fiyat_bandi, teslimat_vurgulari, benchmark_magaza")
    .eq("id", userId)
    .single();

  if (!profil) return new Response("Kullanici bulunamadi", { status: 404 });

  const isAdmin = profil.is_admin === true;
  const gerekliKredi = satirlar.length;

  if (!isAdmin && profil.kredi < gerekliKredi) {
    return new Response(
      JSON.stringify({ hata: `Yetersiz kredi. Gereken: ${gerekliKredi}, Mevcut: ${profil.kredi}` }),
      { status: 402, headers: { "Content-Type": "application/json" } }
    );
  }

  const platformKey = platform || "trendyol";
  const dil: "tr" | "en" = ["etsy", "amazon_usa"].includes(platformKey) ? "en" : "tr";
  const sistemPrompt = sistemPromptOlustur(platformKey, dil, ton);

  // Marka bağlamı: override > profil
  const markaAdi = markaOverride || profil.marka_adi || null;
  const markaBaglami: string[] = [];
  if (markaAdi) markaBaglami.push(dil === "en" ? `Brand: ${markaAdi}` : `Marka: ${markaAdi}`);
  if (profil.hedef_kitle) markaBaglami.push(dil === "en" ? `Target audience: ${profil.hedef_kitle}` : `Hedef kitle: ${profil.hedef_kitle}`);
  if (profil.vurgulanan_ozellikler) markaBaglami.push(dil === "en" ? `Key selling points: ${profil.vurgulanan_ozellikler}` : `Vurgulanacak ozellikler: ${profil.vurgulanan_ozellikler}`);
  if (profil.magaza_kategorileri?.length) markaBaglami.push(dil === "en" ? `Store categories: ${profil.magaza_kategorileri.join(", ")}` : `Mağaza kategorileri: ${profil.magaza_kategorileri.join(", ")}`);
  if (profil.fiyat_bandi) markaBaglami.push(dil === "en" ? `Price segment: ${profil.fiyat_bandi}` : `Fiyat bandı: ${profil.fiyat_bandi}`);
  if (profil.teslimat_vurgulari?.length) markaBaglami.push(dil === "en" ? `Service highlights: ${profil.teslimat_vurgulari.join(", ")}` : `Hizmet vurguları: ${profil.teslimat_vurgulari.join(", ")}`);
  if (profil.benchmark_magaza) markaBaglami.push(dil === "en" ? `Reference store style: ${profil.benchmark_magaza}` : `Referans mağaza tarzı: ${profil.benchmark_magaza}`);

  const encoder = new TextEncoder();
  let islenenKredi = 0;

  const stream = new ReadableStream({
    async start(controller) {
      const gonder = (veri: object) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(veri)}\n\n`));
      };

      for (let i = 0; i < satirlar.length; i++) {
        const satir = satirlar[i];
        const urunAdi = satir.urun_adi || satir.aciklama || `Ürün ${i + 1}`;

        gonder({ tip: "ilerleme", mevcut: i + 1, toplam: satirlar.length, urun: urunAdi });

        // Kullanıcı bilgisi
        const parcalar: string[] = [];
        if (satir.urun_adi) parcalar.push(dil === "en" ? `Product name: ${satir.urun_adi}` : `Urun adi: ${satir.urun_adi}`);
        if (satir.kategori) parcalar.push(dil === "en" ? `Category: ${satir.kategori}` : `Kategori: ${satir.kategori}`);
        if (satir.aciklama) parcalar.push(dil === "en" ? `Description/features: ${satir.aciklama}` : `Aciklama/ozellikler: ${satir.aciklama}`);
        if (satir.marka) parcalar.push(dil === "en" ? `Brand: ${satir.marka}` : `Marka: ${satir.marka}`);
        if (satir.renk) parcalar.push(dil === "en" ? `Color: ${satir.renk}` : `Renk: ${satir.renk}`);
        if (satir.boyut) parcalar.push(dil === "en" ? `Size: ${satir.boyut}` : `Boyut: ${satir.boyut}`);
        if (satir.malzeme) parcalar.push(dil === "en" ? `Material: ${satir.malzeme}` : `Malzeme: ${satir.malzeme}`);

        // Ek sütunlar
        const ekler = Object.entries(satir)
          .filter(([k, v]) => k.startsWith("_ek_") && v)
          .map(([k, v]) => `${k.replace("_ek_", "")}: ${v}`);
        if (ekler.length) parcalar.push((dil === "en" ? "Additional info: " : "Ek bilgiler: ") + ekler.join(", "));

        // Marka bağlamı (satırda marka yoksa profil/override'dan)
        if (!satir.marka && markaBaglami.length > 0) {
          parcalar.push((dil === "en" ? "\nBrand context:\n" : "\nMarka baglami:\n") + markaBaglami.join("\n"));
        }

        const kullaniciBilgi = parcalar.join("\n");

        try {
          const res = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": process.env.ANTHROPIC_API_KEY || "",
              "anthropic-version": "2023-06-01",
            },
            body: JSON.stringify({
              model: "claude-sonnet-4-6",
              max_tokens: 2000,
              system: sistemPrompt,
              messages: [{ role: "user", content: kullaniciBilgi }],
            }),
          });

          const data = await res.json();
          const icerik = data.content?.[0]?.text || "";

          if (!isAdmin) {
            islenenKredi++;
            await supabaseAdmin
              .from("profiles")
              .update({ kredi: profil.kredi - islenenKredi })
              .eq("id", userId);
          }

          gonder({ tip: "sonuc", indeks: i, urun: urunAdi, icerik });
        } catch {
          gonder({ tip: "hata", indeks: i, urun: urunAdi, mesaj: "İşlenemedi" });
        }
      }

      gonder({ tip: "tamamlandi", toplam: satirlar.length, islenen: islenenKredi });
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}
