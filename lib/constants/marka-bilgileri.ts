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
      "Bu fincan setini görünce aşık olacaksınız! Çiçek deseni ve altın yaldız detaylar hem sizi hem misafirlerinizi büyüler. Hediye kutusunda geliyor — doğum günü, düğün, her özel gün için hazır.",
  },
  {
    key: "profesyonel",
    label: "Profesyonel",
    output:
      "Selin Porselen Çiçek Desenli Kahve Fincanı 6'lı Set; 80 ml kapasite, el işçiliği 24 ayar altın yaldız ve bulaşık makinesine dayanıklı porselen yapısıyla günlük kullanım için tasarlanmıştır.",
  },
  {
    key: "premium",
    label: "Premium",
    output:
      "Her fincan üzerindeki el işçiliği altın yaldız detay, Selin Porselen atölyesinde tek tek uygulanır. Çiçek deseni ve 80 ml zarif yapısıyla bu set, sofranıza sanatsal bir dokunuş katar.",
  },
];

export const BRAND_FORM_FIELDS = {
  storeName: { label: "Mağaza adı", value: "Selin Porselen" },
  targetAudience: { label: "Hedef kitle", value: "25-45 yaş ev dekorasyonu ilgilenenler" },
};

export const MB_CTA = {
  text: "Marka profilimi oluştur",
  href: "/uret",
};

export const MB_HINT = "Tonu değiştir, AI çıktısının nasıl değiştiğini gör";
