// NY-01 — Neden yzliste Section Constants
// LP-09: Marka isimleri kaldırıldı (etik+yasal), tablo 4 satıra indirildi

export const NEDEN_HEADER = {
  eyebrow: "Neden yzliste",
  eyebrowColor: "primary" as const,
  title: "Genel AI araçlarıyla aynı şey değil",
  subtitle:
    "Genel amaçlı AI araçları içerik üretir — ama e-ticaret listing'i için tasarlanmamışlardır. yzliste bu ihtiyaç için sıfırdan inşa edildi.",
};

export interface ComparisonRow {
  feature: string;
  generic: string;
  yzliste: string;
}

export const NEDEN_COMPARISONS: ComparisonRow[] = [
  {
    feature: "Listing & SEO kuralları",
    generic: "Genel metin, format uyumsuz",
    yzliste: "Otomatik — 7 pazaryeri formatında",
  },
  {
    feature: "Görsel boyut & format",
    generic: "Manuel ayarla",
    yzliste: "Pazaryeri standardında üretilir",
  },
  {
    feature: "Marka tonu",
    generic: "Her seferinde yeniden anlat",
    yzliste: "Bir kez ayarla, her üretimde uygular",
  },
  {
    feature: "Üretim hızı",
    generic: "Saatler",
    yzliste: "Saniyeler",
  },
];

export const NEDEN_TABLE_HEADERS = {
  generic: {
    eyebrow: "Genel AI araçları",
    subtitle: "Pazaryeri-özel olmayan asistanlar",
  },
  yzliste: {
    eyebrow: "yzliste",
    subtitle: "E-ticaret için özel inşa edildi",
  },
};

export const NEDEN_FOOTNOTE =
  "Genel amaçlı AI araçları birçok konuda üretkendir; ancak pazaryeri listing'i, ürün görseli ve video üretimi için özelleşmemiştir. yzliste bu ihtiyaç için sıfırdan inşa edildi.";
