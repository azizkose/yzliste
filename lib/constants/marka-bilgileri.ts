// MB-01 — Marka Bilgileri Section Constants

import { Store, Target, Palette, Lightbulb } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const MB_HEADER = {
  eyebrow: "Yeni özellik",
  eyebrowColor: "accent" as const,
  title: "Marka bilgilerini gir, sana özel içerikler al",
  subtitle:
    "Profilinden mağaza adını, hedef kitlenini ve metin tonunu belirle. Bundan sonra her üretimde AI bu bilgileri kullanır.",
};

export interface BrandFeature {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const BRAND_FEATURES: BrandFeature[] = [
  {
    icon: Store,
    title: "Marka kimliği",
    description: "Mağaza adın ve marka kimliğin metne yansır",
  },
  {
    icon: Target,
    title: "Hedef kitle odaklı",
    description: "Hedef kitlenin dilinde yazar — doğru kitleye hitap eder",
  },
  {
    icon: Palette,
    title: "Ton seçimi",
    description:
      "Samimi, profesyonel veya premium — tonunu seç, her üretimde uygular",
  },
  {
    icon: Lightbulb,
    title: "Marka değerleri",
    description:
      "Hızlı kargo, yerli üretim gibi değerlerin her ürüne otomatik eklenir",
  },
];

export type ToneKey = "samimi" | "profesyonel" | "premium";

export interface ToneChip {
  key: ToneKey;
  label: string;
  output: string;
}

export const TONE_CHIPS: ToneChip[] = [
  {
    key: "samimi",
    label: "Samimi",
    output:
      "Bu tişört tam sana göre! Yumuşacık kumaşı ve şık kesimi ile her kombine uyum sağlar. Hemen sipariş ver, yarın kapında.",
  },
  {
    key: "profesyonel",
    label: "Profesyonel",
    output:
      "Premium pamuk karışımı kumaştan üretilmiş, ergonomik kesim tişört. Boyut tablosu için ürün detaylarını inceleyebilirsiniz.",
  },
  {
    key: "premium",
    label: "Premium",
    output:
      "Özenle seçilmiş Ege pamuğundan, sınırlı üretim koleksiyon parçası. Minimalist tasarımı ile gardırobunuzun vazgeçilmezi olacak.",
  },
];

export const BRAND_FORM_FIELDS = {
  storeName: { label: "Mağaza adı", value: "Ayşe Tekstil" },
  targetAudience: { label: "Hedef kitle", value: "25-40 yaş kadınlar" },
};

export const MB_CTA = {
  text: "Marka profilimi oluştur",
  href: "/uret",
};

export const MB_HINT = "Tonu değiştir, AI çıktısının nasıl değiştiğini gör";
