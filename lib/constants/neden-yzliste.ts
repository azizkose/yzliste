// NY-01 — Neden yzliste Section Constants

export const NEDEN_HEADER = {
  eyebrow: "Neden yzliste",
  eyebrowColor: "primary" as const,
  title: "Genel AI araçlarıyla aynı şey değil",
  subtitle:
    "ChatGPT, Claude ve Gemini genel amaçlı asistanlardır. yzliste e-ticaret için özel inşa edildi.",
};

export interface ComparisonRow {
  feature: string;
  generic: string;
  yzliste: string;
}

export const NEDEN_COMPARISONS: ComparisonRow[] = [
  {
    feature: "Pazaryeri uyumlu metin",
    generic: "Genel metin, format uyumsuz",
    yzliste: "Trendyol, Hepsiburada, Amazon formatında",
  },
  {
    feature: "SEO optimizasyonu",
    generic: "Anahtar kelime bilmez",
    yzliste: "Pazaryeri arama algoritmasına uygun",
  },
  {
    feature: "Ürün görseli",
    generic: "Görsel üretemez veya düşük kalite",
    yzliste: "Arka plan kaldırma, stüdyo çekim, manken giydirme",
  },
  {
    feature: "Ürün videosu",
    generic: "Video üretemez",
    yzliste: "AI ile ürün tanıtım videosu",
  },
  {
    feature: "Marka tonu",
    generic: "Her seferinde yeniden anlat",
    yzliste: "Profilde bir kez belirle, her üretimde uygulansın",
  },
  {
    feature: "Toplu üretim",
    generic: "Tek tek kopyala yapıştır",
    yzliste: "Excel yükle, yüzlerce ürünü tek seferde üret",
  },
];

export const NEDEN_TABLE_HEADERS = {
  generic: {
    eyebrow: "Genel AI araçları",
    subtitle: "ChatGPT, Claude, Gemini",
  },
  yzliste: {
    eyebrow: "yzliste",
    subtitle: "E-ticaret için özel inşa edildi",
  },
};

export const NEDEN_FOOTNOTE =
  "ChatGPT, Claude ve Gemini harika genel amaçlı asistanlardır. Ancak e-ticaret listing'i üretmek için tasarlanmamışlardır. yzliste bu ihtiyaç için sıfırdan inşa edildi.";
