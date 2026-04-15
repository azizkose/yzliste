import * as XLSX from "xlsx";

export type TespitEdilenKolon = {
  hedef: string;        // "urun_adi", "kategori", vb.
  kaynak: string;       // orijinal sütun başlığı
  etiket: string;       // UI'da gösterilecek
};

export type ParseSonucu = {
  satirlar: Record<string, string>[];
  kolonlar: TespitEdilenKolon[];
  tespit_edilemeyen: string[];   // eşleşmeyen sütun başlıkları
  toplam: number;
};

// Hedef alan → olası başlık eşleşmeleri (küçük harf, trim'li)
const ESLESME: Record<string, string[]> = {
  urun_adi: [
    "ürün adı", "urun adi", "urun_adi", "ürün", "urun",
    "product name", "product", "ad", "isim", "name", "title", "başlık", "baslik",
  ],
  kategori: [
    "kategori", "category", "tip", "tür", "tur", "type", "cat",
  ],
  aciklama: [
    "açıklama", "aciklama", "açıklamalar", "description", "desc",
    "detay", "detail", "details", "özellikler", "ozellikler", "features",
    "bilgi", "info", "içerik", "icerik",
  ],
  marka: [
    "marka", "brand", "marka adı", "marka_adi", "markaadı",
  ],
  fiyat: [
    "fiyat", "price", "ücret", "ucret", "tutar",
  ],
  renk: [
    "renk", "color", "colour",
  ],
  boyut: [
    "boyut", "beden", "size", "ölçü", "olcu", "ebat",
  ],
  malzeme: [
    "malzeme", "material", "kumaş", "kumas", "fabric",
  ],
};

const ETIKETLER: Record<string, string> = {
  urun_adi: "Ürün Adı",
  kategori: "Kategori",
  aciklama: "Açıklama",
  marka: "Marka",
  fiyat: "Fiyat",
  renk: "Renk",
  boyut: "Boyut",
  malzeme: "Malzeme",
};

function normalize(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[_\-]/g, " ");
}

function kolonEslestir(baslik: string): string | null {
  const n = normalize(baslik);
  for (const [hedef, alternatifler] of Object.entries(ESLESME)) {
    if (alternatifler.includes(n)) return hedef;
  }
  // Kısmi eşleşme denemesi
  for (const [hedef, alternatifler] of Object.entries(ESLESME)) {
    if (alternatifler.some((a) => n.includes(a) || a.includes(n))) return hedef;
  }
  return null;
}

export function parseExcel(buffer: ArrayBuffer): ParseSonucu {
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows: Record<string, string>[] = XLSX.utils.sheet_to_json(sheet, {
    defval: "",
    raw: false,
  });

  if (rows.length === 0) return { satirlar: [], kolonlar: [], tespit_edilemeyen: [], toplam: 0 };

  const baslıklar = Object.keys(rows[0]);
  const kolonlar: TespitEdilenKolon[] = [];
  const tespit_edilemeyen: string[] = [];
  const kullanilan = new Set<string>();

  for (const baslik of baslıklar) {
    const hedef = kolonEslestir(baslik);
    if (hedef && !kullanilan.has(hedef)) {
      kullanilan.add(hedef);
      kolonlar.push({ hedef, kaynak: baslik, etiket: ETIKETLER[hedef] ?? hedef });
    } else {
      tespit_edilemeyen.push(baslik);
    }
  }

  // Satırları normalize et: hedef alan adlarıyla yeniden oluştur
  const satirlar = rows.map((row) => {
    const normalized: Record<string, string> = {};
    for (const k of kolonlar) {
      normalized[k.hedef] = String(row[k.kaynak] ?? "").trim();
    }
    // Eşleşmeyenleri de ekstra bilgi olarak tut
    for (const baslik of tespit_edilemeyen) {
      if (row[baslik]) {
        normalized[`_ek_${baslik}`] = String(row[baslik]).trim();
      }
    }
    return normalized;
  });

  // Boş urun_adi satırlarını filtrele
  const gecerli = satirlar.filter((s) => s.urun_adi || s.aciklama);

  return { satirlar: gecerli, kolonlar, tespit_edilemeyen, toplam: gecerli.length };
}

export function excelOlustur(
  satirlar: Record<string, string>[],
  sonuclar: string[],
  platform: string,
): ArrayBuffer {
  const veri = satirlar.map((satir, i) => ({
    ...Object.fromEntries(
      Object.entries(satir).filter(([k]) => !k.startsWith("_ek_"))
    ),
    [`${platform}_icerigi`]: sonuclar[i] ?? "",
  }));

  const ws = XLSX.utils.json_to_sheet(veri);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sonuclar");
  return XLSX.write(wb, { type: "array", bookType: "xlsx" });
}
