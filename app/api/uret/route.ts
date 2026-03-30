import { NextRequest, NextResponse } from "next/server";

const istekSayaci = new Map<string, number>();

function gunlukLimitKontrol(ip: string): boolean {
  const bugun = new Date().toDateString();
  const anahtar = `${ip}-${bugun}`;
  const sayi = istekSayaci.get(anahtar) || 0;
  if (sayi >= 10) return false;
  istekSayaci.set(anahtar, sayi + 1);
  return true;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "bilinmiyor";
  if (!gunlukLimitKontrol(ip)) {
    return NextResponse.json(
      { icerik: "Gunluk deneme limitine ulastiniz. Lutfen yarin tekrar deneyin." },
      { status: 429 }
    );
  }

  const { urunAdi, kategori, ozellikler, platform, fotolar, girisTipi, barkodBilgi } = await req.json();

  const platformSablonlari: Record<string, string> = {
    trendyol: "Trendyol icin max 100 karakter baslik, 5 madde ozellik, 300 kelime aciklama ve 10 arama etiketi yaz.",
    hepsiburada: "Hepsiburada icin max 150 karakter baslik, 5 madde ozellik, 300 kelime aciklama ve 10 arama etiketi yaz.",
    amazon: "Amazon TR icin max 200 karakter baslik, 5 madde bullet point ozellik, 300 kelime aciklama ve 10 arama etiketi yaz.",
    n11: "N11 icin max 100 karakter baslik, 5 madde ozellik, 200 kelime aciklama ve 8 arama etiketi yaz.",
  };

  let messages;

  if (girisTipi === "foto" && fotolar && fotolar.length > 0) {
    const icerikler: object[] = [];

    fotolar.forEach((foto: string) => {
      const base64 = foto.split(",")[1];
      const mediaType = foto.split(";")[0].split(":")[1];
      icerikler.push({
        type: "image",
        source: { type: "base64", media_type: mediaType, data: base64 },
      });
    });

    icerikler.push({
      type: "text",
      text: `Bu urun fotograflarini analiz et. ${
        ozellikler ? `Ek bilgi: ${ozellikler}.` : ""
      } Asagidaki formatta Turkce icerik uret.

${platformSablonlari[platform] || platformSablonlari.trendyol}

Cikti formati:
BASLIK:
[baslik buraya]

OZELLIKLER:
- ozellik 1
- ozellik 2
- ozellik 3
- ozellik 4
- ozellik 5

ACIKLAMA:
[aciklama buraya]

ARAMA ETIKETLERI:
[etiket1, etiket2, etiket3]`,
    });

    messages = [{ role: "user", content: icerikler }];

  } else if (girisTipi === "barkod" && barkodBilgi) {
    messages = [
      {
        role: "user",
        content: `Sen bir e-ticaret icerik uzmanisın. Turk tuketiciye yonelik, satisa donusen icerikler yaziyorsun.

Urun bilgileri (barkoddan alindi):
Urun Adi: ${barkodBilgi.isim}
Marka: ${barkodBilgi.marka || "belirtilmedi"}
Kategori: ${barkodBilgi.kategori || "belirtilmedi"}
Renk: ${barkodBilgi.renk || "belirtilmedi"}
Boyut: ${barkodBilgi.boyut || "belirtilmedi"}
Aciklama: ${barkodBilgi.aciklama || "belirtilmedi"}
Ek bilgi: ${ozellikler || "belirtilmedi"}

${platformSablonlari[platform] || platformSablonlari.trendyol}

Cikti formati:
BASLIK:
[baslik buraya]

OZELLIKLER:
- ozellik 1
- ozellik 2
- ozellik 3
- ozellik 4
- ozellik 5

ACIKLAMA:
[aciklama buraya]

ARAMA ETIKETLERI:
[etiket1, etiket2, etiket3]`,
      },
    ];

  } else {
    messages = [
      {
        role: "user",
        content: `Sen bir e-ticaret icerik uzmanisın. Turk tuketiciye yonelik, satisa donusen icerikler yaziyorsun.

Urun: ${urunAdi}
Kategori: ${kategori}
Ek bilgi: ${ozellikler || "belirtilmedi"}

${platformSablonlari[platform] || platformSablonlari.trendyol}

Cikti formati:
BASLIK:
[baslik buraya]

OZELLIKLER:
- ozellik 1
- ozellik 2
- ozellik 3
- ozellik 4
- ozellik 5

ACIKLAMA:
[aciklama buraya]

ARAMA ETIKETLERI:
[etiket1, etiket2, etiket3]`,
      },
    ];
  }

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY || "",
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1000,
      messages,
    }),
  });

  const data = await response.json();
  const icerik = data.content?.[0]?.text || JSON.stringify(data);

  return NextResponse.json({ icerik });
}