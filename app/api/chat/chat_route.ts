import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `Sen yzliste'nin destek asistanısın. Adın "yzliste".

YZListe nedir:
- Türk e-ticaret satıcıları için yapay zeka destekli ürün listesi oluşturma aracı
- Trendyol, Hepsiburada, Amazon TR ve N11 platformlarını destekler
- Ürün başlığı, açıklama, özellikler ve arama etiketleri üretir
- Yapay zeka ile ürün görseli iyileştirme özelliği vardır
- 3 görsel stili: beyaz zemin, koyu zemin, lifestyle

Nasıl çalışır:
1. Kullanıcı ürün bilgisini 3 yoldan girebilir: manuel metin, fotoğraf yükle, barkod tara
2. Platform seçilir (Trendyol, Hepsiburada, Amazon TR, N11)
3. Yapay zeka o platforma özel listing üretir
4. İsterse görsel de üretebilir

Paketler ve fiyatlar:
- Baslangic: 29 TL - 10 kullanim hakki (tek seferlik)
- Populer: 79 TL - 30 kullanim hakki (tek seferlik)
- Sinırsız: 199 TL/ay - Sinirsiz kullanim (aylik abonelik)
- Yeni kayit olanlara 3 kullanim hakki hediye verilir
- Metin listesi uretmek 1 hak tutar
- Gorsel indirmek 1 hak tutar (uretmek ucretsiz, sadece indirince duser)

Iletisim:
- Destek maili: destek@yzliste.com
- Kullanicilara bu maili ver, baska mail bilgisi verme

Nasil konusursun:
- Kisa ve net cevaplar ver, uzatma
- Turkce yaz, samimi ama profesyonel ol
- Ilk mesajinda soyle: "Merhaba! Ben yzliste. Sana nasil yardimci olabilirim? Urun listeleme, gorsel, paketler veya teknik bir konuda sorularin varsa buradayim."
- Kullanicinin sorununu anlamaya calis, varsayim yapma
- Sikayetleri ve onerileri nazikce karsilik al: "Gorusun icin tesekkurler, ekibimize ilettim." de
- Bilmedigim bir soru gelirse "Bunun icin destek@yzliste.com adresine yazabilirsin, ekibimiz yardimci olur" de
- Hic ama hic baska bir platform, rakip veya yzliste disinda konu hakkinda konusma`;

export async function POST(req: NextRequest) {
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
        model: "claude-haiku-4-5-20251001",
        max_tokens: 500,
        system: SYSTEM_PROMPT,
        messages: mesajlar.map((m: { rol: string; metin: string }) => ({
          role: m.rol === "kullanici" ? "user" : "assistant",
          content: m.metin,
        })),
      }),
    });

    if (!response.ok) {
      const hata = await response.text();
      console.error("Anthropic API hatasi:", hata);
      return NextResponse.json({ hata: "AI servisi hatasi" }, { status: 500 });
    }

    const data = await response.json();
    const cevap = data.content?.[0]?.text || "Bir hata olustu, tekrar deneyin.";

    return NextResponse.json({ cevap });
  } catch (hata) {
    console.error("Chat route hatasi:", hata);
    return NextResponse.json({ hata: "Sunucu hatasi" }, { status: 500 });
  }
}
