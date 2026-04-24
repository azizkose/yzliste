/**
 * Merkezi ton haritaları — tüm API route'larında buradan import edilmeli.
 * Profil ton değerleri: samimi | profesyonel | premium | eglenceli | ciddi | lüks | minimal
 */

/** Görsel (Bria Product-Shot) için ton → İngilizce brand tone açıklaması */
export const TON_EN_MAP: Record<string, string> = {
  samimi:      "warm and friendly brand tone",
  profesyonel: "professional and premium brand tone",
  premium:     "premium and upscale brand tone",
  eglenceli:   "fun and playful brand tone",
  ciddi:       "serious and formal brand tone",
  lüks:        "luxury and elegant brand tone",
  minimal:     "clean and minimal brand tone",
};

/** Video (Kling) için ton → sinematik hareket/ışık tarifi */
export const TON_VIDEO_MAP: Record<string, string> = {
  samimi:      "friendly warm product showcase, camera slowly pushes in then holds steady, soft natural lighting, clean background",
  profesyonel: "clean professional product reveal, camera smoothly tracks right then stops, corporate studio lighting, white background",
  premium:     "luxury cinematic product film, dramatic light gradually illuminates the product then holds, dark elegant background, subtle reflections",
  eglenceli:   "energetic product showcase, quick pan then steady close-up, bright vibrant lighting, colorful background",
  ciddi:       "formal product presentation, static camera then slow pull back, even controlled lighting, neutral background",
  lüks:        "luxury cinematic product film, dramatic light gradually illuminates the product then holds, dark elegant background, subtle reflections",
  minimal:     "clean minimal product reveal, camera gently zooms in and holds, soft diffused lighting, pure white background",
};

/** Varsayılan video prompt (ton yoksa) */
export const TON_VIDEO_DEFAULT = "professional product showcase, camera slowly zooms in and holds on product, clean studio lighting, white background, high quality e-commerce video";
