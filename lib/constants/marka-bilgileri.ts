// MB-01 — Marka Bilgileri Section Constants

import { Store, Target, Palette, Lightbulb, Tag, Banknote, Star, FileText } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const MB_HEADER = {
  eyebrow: "Marka profili",
  eyebrowColor: "accent" as const,
  title: "Marka bilgilerini gir, sana özel içerikler al",
  subtitle:
    "8 alanlık profilinden mağaza adını, hedef kitlenini, metin tonunu ve hizmet vurgularını belirle. Bundan sonra her üretimde AI bu bilgileri otomatik uygular.",
};

export interface BrandFeature {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const BRAND_FEATURES: BrandFeature[] = [
  {
    icon: Store,
    title: "Mağaza adı ve kimlik",
    description: "Mağaza adın ve marka sesi metne yansır — her üretimde tutarlı",
  },
  {
    icon: Target,
    title: "Hedef kitle odaklı",
    description: "Hedef kitlenin dilinde yazar — doğru kitleye doğru mesaj",
  },
  {
    icon: Palette,
    title: "Ton ve ses seçimi",
    description: "Samimi, profesyonel veya premium — tonunu seç, her üretimde uygular",
  },
  {
    icon: Lightbulb,
    title: "Ürün kategorisi ve fiyat",
    description: "Kategori ve fiyat segmenti rekabetçi konumlandırma sağlar",
  },
  {
    icon: Tag,
    title: "Öne çıkan özellikler",
    description: "Yerli üretim, organik materyal, 2 yıl garanti — her ürüne otomatik eklenir",
  },
  {
    icon: Banknote,
    title: "Fiyat bandı",
    description: "Bütçe, orta veya premium segment — dile getirme tarzı değişir",
  },
  {
    icon: Star,
    title: "Hizmet vurguları",
    description: "Hızlı kargo, ücretsiz iade, özel ambalaj — metinde güven artırır",
  },
  {
    icon: FileText,
    title: "Ek bilgi ve notlar",
    description: "Özel istekler, marka sloganı veya dikkat çekilecek noktalar",
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
      "Bu topu görünce anlarsınız — FIBA onaylı, kompozit deri, ve kutudan çıkar çıkmaz oyuna hazır. Okul takımından hobi sporcusuna, herkese uygun tam boyutlu bir top. Kuru pompa hediye geliyor!",
  },
  {
    key: "profesyonel",
    label: "Profesyonel",
    output:
      "7 numara FIBA standardı kompozit deri basketbol topu; 75-78 cm çevre, 567-650 g ağırlık, 8 panel sıkı dikişli yapı ve hava sızdırmaz iç tüp ile profesyonel kullanım gereksinimlerini karşılar. Kuru pompa ve iğne set içinde.",
  },
  {
    key: "premium",
    label: "Premium",
    output:
      "Turnuva standardında üretilen bu top, yalnızca performans arayanlar için. Kompozit deri yüzeyin ter emici dokusu ve 8 panel dikişin mühendislik hassasiyeti, her dokunuşta sahayı hissettir.",
  },
];

export const BRAND_FORM_FIELDS = {
  storeName: { label: "Mağaza adı", value: "SportZone TR" },
  targetAudience: { label: "Hedef kitle", value: "Okul takımları, gençlik ligi, hobi sporcular" },
};

export const MB_CTA = {
  text: "Marka profilimi oluştur",
  href: "/uret",
};

export const MB_HINT = "Tonu değiştir, AI çıktısının nasıl değiştiğini gör";
