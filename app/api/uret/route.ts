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
    notlar: "Trendyol'da başlık formatı genellikle: Marka + Ürün Adı + Ana Özellik + Model/Renk şeklindedir. Özellikler bullet point olarak girilir.",
  },
  hepsiburada: {
    baslikLimit: 150,
    ozellikSayisi: 5,
    aciklamaKelime: 350,
    etiketSayisi: 10,
    emojiDestekli: true,
    notlar: "Hepsiburada'da başlık daha uzun tutulabilir. Teknik özellikler öne çıkarılmalıdır.",
  },
  amazon: {
    baslikLimit: 200,
    ozellikSayisi: 5,
    aciklamaKelime: 400,
    etiketSayisi: 10,
    emojiDestekli: false,
    notlar: "Amazon TR'de başlık formatı: Marka + Ürün Tipi + Ana Özellikler (virgülle ayrılmış) + Renk/Model. Bullet point özellikler tam cümle olmalı, fayda odaklı yazılmalı. Emoji kullanma.",
  },
  n11: {
    baslikLimit: 100,
    ozellikSayisi: 5,
    aciklamaKelime: 250,
    etiketSayisi: 8,
    emojiDestekli: true,
    notlar: "N11'de sade ve anlaşılır bir dil kullanılmalıdır.",
  },
};

function sistemPromptOlustur(platform: string): string {
  const kural = PLATFORM_KURALLARI[platform] || PLATFORM_KURALLARI.trendyol;

  return `Sen bir Türk e-ticaret listing uzmanısın. Görevin verilen ürün için ${platform.toUpperCase()} platformuna özel, satışa hazır, SEO ve GEO (üretken yapay zeka arama) optimizasyonlu içerik üretmek.

PLATFORM KURALLARI — ${platform.toUpperCase()}:
- Başlık: max ${kural.baslikLimit} karakter
- Özellikler: ${kural.ozellikSayisi} madde, bullet point formatında
- Açıklama: yaklaşık ${kural.aciklamaKelime} kelime
- Etiketler: ${kural.etiketSayisi} adet
- Emoji: ${kural.emojiDestekli ? "KULLAN — özellik maddelerinde ve açıklamada uygun yerlerde" : "KULLANMA — Amazon emoji desteklemez"}
- ${kural.notlar}

SEO VE GEO OPTİMİZASYONU:
1. Türk alıcıların bu ürünü ararken kullandığı gerçek sorgu kelimelerini başlık, özellikler ve açıklamada doğal olarak geçir
2. Başlıkta: marka (varsa) + ürün adı + en önemli 2-3 özellik (malzeme/renk/boyut/model) olsun
3. Özelliklerde: her madde fayda odaklı yazılsın ("Deri malzeme" değil, "Hakiki deri malzeme — uzun ömürlü ve doğal görünüm")
4. Açıklamada: ürünün kim için ideal olduğu, ne zaman / nerede kullanılacağı, rakiplerinden farkı
5. Güvenlik / uyarı bilgisi varsa mutlaka ekle (özellikle elektrikli ürünler, bebek ürünleri, gıda)
6. Etiketler: hem genel ("bot") hem spesifik ("hakiki deri erkek bot") hem de uzun kuyruk ("kışlık su geçirmez erkek bot") kelimeler içersin

ÇIKTI FORMATI — kesinlikle bu yapıya uy:
📌 BAŞLIK:
[başlık — max ${kural.baslikLimit} karakter]

🔹 ÖZELLİKLER:
• [özellik 1 — fayda odaklı${kural.emojiDestekli ? ", emoji ile başla" : ""}]
• [özellik 2]
• [özellik 3]
• [özellik 4]
• [özellik 5]

📄 AÇIKLAMA:
[açıklama — paragraflar halinde, keyword'ler doğal geçişli]

🏷️ ETİKETLER:
[etiket1, etiket2, etiket3, ...]

Sadece bu formatı kullan. Başka açıklama ekleme.`;
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
    .select("kredi, is_admin")
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
    kullaniciBilgi = `Bu ürün fotoğrafına bakarak içerik üret.\nKategori: ${kategori || "belirtilmedi"}\nEk bilgi: ${ozellikler || "yok"}`;
  } else if (girisTipi === "barkod" && barkodBilgi) {
    kullaniciBilgi = `Ürün adı: ${barkodBilgi.isim}\nMarka: ${barkodBilgi.marka || "belirtilmedi"}\nKategori: ${kategori || "belirtilmedi"}\nAçıklama: ${barkodBilgi.aciklama || "yok"}\nRenk: ${barkodBilgi.renk || "belirtilmedi"}\nBoyut: ${barkodBilgi.boyut || "belirtilmedi"}`;
  } else {
    kullaniciBilgi = `Ürün adı: ${urunAdi}\nKategori: ${kategori}\nEk özellikler ve bilgiler: ${ozellikler || "belirtilmedi"}`;
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
      system: sistemPromptOlustur(platform),
      messages: [{ role: "user", content: mesajIcerikleri }],
    }),
  });

  const data = await response.json();
  const icerik = data.content?.[0]?.text || "İçerik üretilemedi, tekrar deneyin.";

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
