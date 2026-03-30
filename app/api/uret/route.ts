import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const istekSayaci = new Map<string, number>();

function gunlukLimitKontrol(ip: string): boolean {
  const bugun = new Date().toDateString();
  const anahtar = `${ip}-${bugun}`;
  const sayi = istekSayaci.get(anahtar) || 0;
  if (sayi >= 20) return false;
  istekSayaci.set(anahtar, sayi + 1);
  return true;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "bilinmiyor";
  if (!gunlukLimitKontrol(ip)) {
    return NextResponse.json(
      { icerik: "Gunluk deneme limitine ulastiniz." },
      { status: 429 }
    );
  }

  const { urunAdi, kategori, ozellikler, platform, fotolar, girisTipi, barkodBilgi, userId } = await req.json();

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
      icerikler.push({ type: "image", source: { type: "base64", media_type: mediaType, data: base64 } });
    });
    icerikler.push({
      type: "text",
      text: `Bu urun fotograflarini analiz et. ${ozellikler ? `Ek bilgi: ${ozellikler}.` : ""} Asagidaki formatta Turkce icerik uret.\n\n${platformSablonlari[platform] || platformSablonlari.trendyol}\n\nCikti formati:\nBASLIK:\n[baslik buraya]\n\nOZELLIKLER:\n- ozellik 1\n- ozellik 2\n- ozellik 3\n- ozellik 4\n- ozellik 5\n\nACIKLAMA:\n[aciklama buraya]\n\nARAMA ETIKETLERI:\n[etiket1, etiket2, etiket3]`,
    });
    messages = [{ role: "user", content: icerikler }];
  } else if (girisTipi === "barkod" && barkodBilgi) {
    messages = [{
      role: "user",
      content: `Sen bir e-ticaret icerik uzmanisın.\n\nUrun bilgileri:\nAdi: ${barkodBilgi.isim}\nMarka: ${barkodBilgi.marka || "belirtilmedi"}\nKategori: ${barkodBilgi.kategori || "belirtilmedi"}\nAciklama: ${barkodBilgi.aciklama || "belirtilmedi"}\nEk bilgi: ${ozellikler || "belirtilmedi"}\n\n${platformSablonlari[platform] || platformSablonlari.trendyol}\n\nCikti formati:\nBASLIK:\n[baslik buraya]\n\nOZELLIKLER:\n- ozellik 1\n- ozellik 2\n- ozellik 3\n- ozellik 4\n- ozellik 5\n\nACIKLAMA:\n[aciklama buraya]\n\nARAMA ETIKETLERI:\n[etiket1, etiket2, etiket3]`,
    }];
  } else {
    messages = [{
      role: "user",
      content: `Sen bir e-ticaret icerik uzmanisın.\n\nUrun: ${urunAdi}\nKategori: ${kategori}\nEk bilgi: ${ozellikler || "belirtilmedi"}\n\n${platformSablonlari[platform] || platformSablonlari.trendyol}\n\nCikti formati:\nBASLIK:\n[baslik buraya]\n\nOZELLIKLER:\n- ozellik 1\n- ozellik 2\n- ozellik 3\n- ozellik 4\n- ozellik 5\n\nACIKLAMA:\n[aciklama buraya]\n\nARAMA ETIKETLERI:\n[etiket1, etiket2, etiket3]`,
    }];
  }

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY || "",
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({ model: "claude-haiku-4-5-20251001", max_tokens: 1000, messages }),
  });

  const data = await response.json();
  const icerik = data.content?.[0]?.text || JSON.stringify(data);

  // Supabase'e kaydet
  if (userId) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!
    );

    const urunAdiKayit = girisTipi === "foto" ? "Fotoğraftan üretim" :
                         girisTipi === "barkod" ? barkodBilgi?.isim || "Barkod" :
                         urunAdi;

    await supabase.from("uretimler").insert({
      user_id: userId,
      platform,
      giris_tipi: girisTipi,
      urun_adi: urunAdiKayit,
      sonuc: icerik,
    });

    await supabase.from("profiles")
      .select("kredi")
      .eq("id", userId)
      .single()
      .then(async ({ data: profil }) => {
        if (profil) {
          await supabase.from("profiles")
            .update({ kredi: profil.kredi - 1 })
            .eq("id", userId);
        }
      });
  }

  return NextResponse.json({ icerik });
}