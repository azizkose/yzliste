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
    icon: Star,
    title: "Hizmet vurguları",
    description: "Hızlı kargo, ücretsiz iade, özel ambalaj — metinde güven artırır",
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
      "Sabah kahvene başlamadan bir bakar mısın? Bu cezve seninle kalmak için yapılmış. Gaziantep'te elle dövülmüş, kalay kaplı içi, hediye kutusunda — sevdiğine vermek için de tam zamanı.",
  },
  {
    key: "profesyonel",
    label: "Profesyonel",
    output:
      "El dövme bakır cezve; gıda güvenli kalay kaplı iç yüzey, 250 ml kapasite, 2 porselen fincan ile komple set. Gaziantep'te aile atölyesinden, her parça ayrı kalite kontrolünden geçer.",
  },
  {
    key: "premium",
    label: "Premium",
    output:
      "Bakırın sıcaklığı, sabah kahvesini bir ritüele dönüştürür. El dövme yüzeyin her dokunuşunda Gaziantep ustalarının izi var. Hediye kutusunda, kullanım rehberi ile birlikte — özel anlar için biçilmiş bir hediye.",
  },
];

export const BRAND_FORM_FIELDS = {
  storeName: { label: "Mağaza adı", value: "Anadolu Bakır" },
  targetAudience: { label: "Hedef kitle", value: "Türk kahvesi sevenler, hediye arayanlar" },
};

export const MB_CTA = {
  text: "Marka profilimi oluştur",
  href: "/uret",
};

export const MB_HINT = "Tonu değiştir, AI çıktısının nasıl değiştiğini gör";
