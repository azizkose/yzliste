import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

const PLATFORM_KURALLARI: Record<string, {
  baslikLimit: number;
  ozellikSayisi: number;
  aciklamaKelime: number;
  etiketSayisi: number;
  emojiDestekli: boolean;
  notlar: string;
}> = {
  trendyol: {
    baslikLimit: 100,
    ozellikSayisi: 5,
    aciklamaKelime: 300,
    etiketSayisi: 10,
    emojiDestekli: true,
    notlar: "Trendyol'da baslik formati: Marka + Urun Adi + Ana Ozellik + Model/Renk. Ozellikler bullet point olarak girilir.",
  },
  hepsiburada: {
    baslikLimit: 150,
    ozellikSayisi: 5,
    aciklamaKelime: 350,
    etiketSayisi: 10,
    emojiDestekli: true,
    notlar: "Hepsiburada'da baslik daha uzun tutulabilir. Teknik ozellikler one cikarilmalidir.",
  },
  amazon: {
    baslikLimit: 200,
    ozellikSayisi: 5,
    aciklamaKelime: 400,
    etiketSayisi: 10,
    emojiDestekli: false,
    notlar: "Amazon TR'de baslik formati: Marka + Urun Tipi + Ana Ozellikler + Renk/Model. Bullet point ozellikler tam cumle olmali, fayda odakli yazilmali. Emoji kullanma.",
  },
  n11: {
    baslikLimit: 100,
    ozellikSayisi: 5,
    aciklamaKelime: 250,
    etiketSayisi: 8,
    emojiDestekli: true,
    notlar: "N11'de sade ve anlasılır bir dil kullanilmalidir.",
  },
};

const TON_ACIKLAMA: Record<string, string> = {
  samimi: "sicak, samimi ve yakin bir dil kullan. Okuyucuya direkt hitap et.",
  profesyonel: "resmi, kurumsal ve guvenilir bir dil kullan. Teknik detaylari on plana cikart.",
  premium: "lüks, seckin ve prestijli bir dil kullan. Kalite ve ayricaligi vurgula.",
};

function sistemPromptOlustur(
  platform: string,
  markaAdi?: string | null,
  ton?: string | null,
  hedefKitle?: string | null,
  vurgulananOzellikler?: string | null
): string {
  const kural = PLATFORM_KURALLARI[platform] || PLATFORM_KURALLARI.trendyol;
  const tonAciklama = TON_ACIKLAMA[ton || "samimi"] || TON_ACIKLAMA.samimi;

  let markaBilgisi = "";
  if (markaAdi || hedefKitle || vurgulananOzellikler) {
    markaBilgisi = `\nMARKA PROFİLİ:\n`;
    if (markaAdi) markaBilgisi += `- Magaza/Marka: ${markaAdi}\n`;
    if (hedefKitle) markaBilgisi += `- Hedef kitle: ${hedefKitle}\n`;
    if (vurgulananOzellikler) markaBilgisi += `- Her zaman vurgulanacak ozellikler: ${vurgulananOzellikler}\n`;
    markaBilgisi += `- Metin tonu: ${tonAciklama}\n`;
  }

  return `Sen bir Turk e-ticaret listing uzmanisın. Gorev: verilen urun icin ${platform.toUpperCase()} platformuna ozel, satis odakli, SEO ve GEO (uretken yapay zeka arama) optimizasyonlu icerik uret.
${markaBilgisi}
PLATFORM KURALLARI — ${platform.toUpperCase()}:
- Baslik: max ${kural.baslikLimit} karakter
- Ozellikler: ${kural.ozellikSayisi} madde, bullet point formatında
- Aciklama: yaklasik ${kural.aciklamaKelime} kelime
- Etiketler: ${kural.etiketSayisi} adet
- Emoji: ${kural.emojiDestekli ? "KULLAN — ozellik maddelerinde ve aciklamada uygun yerlerde" : "KULLANMA — Amazon emoji desteklemez"}
- ${kural.notlar}

SEO VE GEO OPTİMİZASYONU:
1. Turk alıcılarin bu urunu ararken kullandigi gercek sorgu kelimelerini baslik, ozellikler ve aciklamada dogal olarak gecir
2. Baslikta: marka (varsa) + urun adi + en onemli 2-3 ozellik (malzeme/renk/boyut/model) olsun
3. Ozelliklerde: her madde fayda odakli yazilsın
4. Aciklamada: urunun kim icin ideal oldugu, ne zaman / nerede kullanilacagi belirtilsin
5. Guvenlik / uyari bilgisi varsa mutlaka ekle
6. Etiketler: hem genel hem spesifik hem de uzun kuyruk kelimeler icersin

CIKTI FORMATI — kesinlikle bu yapiya uy:
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
  const { urunAdi, kategori, ozellikler, platform, fotolar, girisTipi, barkodBilgi, userId } =
    await req.json();

  if (!userId) {
    return NextResponse.json({ hata: "Giris yapilmadi" }, { status: 401 });
  }

  const { data: profil } = await supabaseAdmin
    .from("profiles")
    .select("kredi, is_admin, marka_adi, ton, hedef_kitle, vurgulanan_ozellikler")
    .eq("id", userId)
    .single();

  if (!profil) {
    return NextResponse.json({ hata: "Kullanici bulunamadi" }, { status: 404 });
  }

  const isAdmin = profil.is_admin === true;

  if (!isAdmin && profil.kredi <= 0) {
    return NextResponse.json(
      { hata: "Krediniz bitti. Lutfen kredi satin alin." },
      { status: 402 }
    );
  }

  const mesajIcerikleri: MessageContent[] = [];

  if (fotolar && fotolar.length > 0) {
    fotolar.slice(0, 3).forEach((foto: string) => {
      const base64 = foto.split(",")[1];
      const mediaType = foto.split(";")[0].split(":")[1];
      mesajIcerikleri.push({
        type: "image",
        source: { type: "base64", media_type: mediaType, data: base64 },
      });
    });
  }

  let kullaniciBilgi = "";

  if (girisTipi === "foto") {
    kullaniciBilgi = `Bu urun fotografina bakarak icerik uret.\nKategori: ${kategori || "belirtilmedi"}\nEk bilgi: ${ozellikler || "yok"}`;
  } else if (girisTipi === "barkod" && barkodBilgi) {
    kullaniciBilgi = `Urun adi: ${barkodBilgi.isim}\nMarka: ${barkodBilgi.marka || "belirtilmedi"}\nKategori: ${kategori || "belirtilmedi"}\nAciklama: ${barkodBilgi.aciklama || "yok"}\nRenk: ${barkodBilgi.renk || "belirtilmedi"}\nBoyut: ${barkodBilgi.boyut || "belirtilmedi"}`;
  } else {
    kullaniciBilgi = `Urun adi: ${urunAdi}\nKategori: ${kategori}\nEk ozellikler ve bilgiler: ${ozellikler || "belirtilmedi"}`;
  }

  mesajIcerikleri.push({ type: "text", text: kullaniciBilgi });

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY || "",
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 2000,
      system: sistemPromptOlustur(
        platform,
        profil.marka_adi,
        profil.ton,
        profil.hedef_kitle,
        profil.vurgulanan_ozellikler
      ),
      messages: [{ role: "user", content: mesajIcerikleri }],
    }),
  });

  const data = await response.json();
  const icerik = data.content?.[0]?.text || "Icerik uretilemedi, tekrar deneyin.";

  if (!isAdmin) {
    await supabaseAdmin
      .from("profiles")
      .update({ kredi: profil.kredi - 1 })
      .eq("id", userId);
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
