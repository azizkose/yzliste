export type SonucBolum = {
  baslik: string;
  ikon: string;
  icerik: string;
};

export function sonucuBolumle(sonuc: string): SonucBolum[] {
  if (!sonuc) return [];
  sonuc = sonuc.replace(/\*\*/g, "").replace(/\*/g, "");
  const bolumler: SonucBolum[] = [];
  const baslikMatch = sonuc.match(/(?:📌\s*)?(?:BAŞLIK|Başlık)[:\n]+([^\n🔹📄🏷]+)/i);
  const ozellikMatch = sonuc.match(/(?:🔹\s*)?(?:ÖZELLİKLER|Özellikler)[:\n]+([\s\S]+?)(?=📄|🏷|$)/i);
  const aciklamaMatch = sonuc.match(/(?:📄\s*)?(?:AÇIKLAMA|Açıklama)[:\n]+([\s\S]+?)(?=🏷|$)/i);
  const etiketMatch = sonuc.match(/(?:🏷️?\s*)?(?:ETİKETLER|Etiketler)[:\n]+([\s\S]+?)$/i);
  if (baslikMatch) bolumler.push({ baslik: "Başlık", ikon: "📌", icerik: baslikMatch[1].trim() });
  if (ozellikMatch) bolumler.push({ baslik: "Özellikler", ikon: "🔹", icerik: ozellikMatch[1].trim() });
  if (aciklamaMatch) bolumler.push({ baslik: "Açıklama", ikon: "📄", icerik: aciklamaMatch[1].trim() });
  if (etiketMatch) bolumler.push({ baslik: "Arama Etiketleri", ikon: "🏷️", icerik: etiketMatch[1].trim() });
  if (bolumler.length === 0) bolumler.push({ baslik: "İçerik", ikon: "📋", icerik: sonuc });
  return bolumler;
}

export async function docxIndir(bolumler: SonucBolum[], urunAdi: string) {
  const { Document, Packer, Paragraph, TextRun, HeadingLevel } = await import("docx");
  const { saveAs } = await import("file-saver");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const paragraflar: any[] = [];
  bolumler.forEach((bolum) => {
    paragraflar.push(new Paragraph({ text: `${bolum.ikon} ${bolum.baslik}`, heading: HeadingLevel.HEADING_2, spacing: { before: 300, after: 100 } }));
    bolum.icerik.split("\n").forEach((satir) => {
      if (satir.trim()) paragraflar.push(new Paragraph({ children: [new TextRun({ text: satir, size: 22 })], spacing: { after: 80 } }));
    });
  });
  const doc = new Document({ sections: [{ properties: {}, children: [new Paragraph({ text: `yzliste — ${urunAdi}`, heading: HeadingLevel.HEADING_1, spacing: { after: 200 } }), ...paragraflar] }] });
  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${urunAdi || "listing"}.docx`);
}
