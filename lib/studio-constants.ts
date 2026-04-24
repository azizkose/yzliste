export const STUDIO_KREDI = {
  tryon: {
    birimKredi: 3,
    minSamples: 1,
    maxSamples: 4,
    hesapla: (numSamples: number) => numSamples * 3,
  },
} as const;

export const VIDEO_KREDI: Record<"5" | "10", number> = {
  "5": 10,
  "10": 20,
};

export const STOK_MANKENLER = [
  { id: "kadin-1", label: "Kadın 1", url: "/mankenler/kadin-1.jpg", cinsiyet: "kadin" as const },
  { id: "kadin-2", label: "Kadın 2", url: "/mankenler/kadin-2.jpg", cinsiyet: "kadin" as const },
  { id: "erkek-1", label: "Erkek 1", url: "/mankenler/erkek-1.jpg", cinsiyet: "erkek" as const },
  { id: "erkek-2", label: "Erkek 2", url: "/mankenler/erkek-2.jpg", cinsiyet: "erkek" as const },
] as const;

export type StokMankenId = (typeof STOK_MANKENLER)[number]["id"];

export const STUDIO_TOOLS = [
  { id: "tryon", etiket: "Mankene Giydirme", aciklama: "Kıyafeti stok veya kendi mankeninizde deneyin" },
] as const;

export const TRYON_VIDEO_PRESETLER = [
  {
    id: "podyum",
    etiket: "Podyum Yürüyüşü",
    aciklama: "Manken kameraya doğru özgüvenli yürür",
    prompt: "Fashion model walking confidently towards camera on a clean white runway, professional catwalk stride, subtle hip movement, garment flowing naturally with each step, studio lighting, fashion show atmosphere",
  },
  {
    id: "donus",
    etiket: "360° Dönüş",
    aciklama: "Manken yerinde dönerek kıyafeti her açıdan gösterir",
    prompt: "Fashion model slowly turning 360 degrees in place, showing the garment from all angles, smooth rotation, clean studio background, soft directional lighting, full body visible",
  },
  {
    id: "dogal",
    etiket: "Doğal Poz",
    aciklama: "Hafif hareketlerle doğal duruş",
    prompt: "Fashion model in a relaxed natural pose, subtle weight shifting, gentle hand movement, soft smile, clean studio background, lifestyle feel, natural lighting",
  },
  {
    id: "ruzgar",
    etiket: "Rüzgar Efekti",
    aciklama: "Kumaş rüzgarda hareketlenir, dramatik his",
    prompt: "Fashion model standing with wind blowing through the garment, fabric flowing dramatically, hair moving gently, cinematic studio lighting, editorial fashion photography feel",
  },
] as const;

export type TryonVideoPresetId = (typeof TRYON_VIDEO_PRESETLER)[number]["id"];
