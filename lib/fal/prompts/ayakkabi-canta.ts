import type { Stil } from "./index"

export const AYAKKABI_NEGATIVE =
  "no human feet inside shoes, no human body, no extra shoes unless pair, no duplicates, no shoeboxes unless explicitly requested, no shopping bags unless product is bag, no hallucinated accessories"

export const AYAKKABI_STIL: Record<Stil, string> = {
  beyaz:
    "single shoe or bag isolated on solid pure white (#FFFFFF) seamless studio cyclorama background, soft diffused even lighting, product centered and filling 75-85% of frame, very subtle contact shadow beneath, preserve original material texture and stitching detail, professional e-commerce footwear and accessory photography",
  koyu:
    "single shoe or bag on solid pure black (#000000) seamless studio background, luxury footwear or accessory photography, soft overhead spotlight, subtle contact shadow, product fills 70-80% of frame, preserve original material and hardware details, premium aesthetic, no glowing halos",
  lifestyle:
    "single shoe or bag styled in modern minimalist interior, placed on wooden console or marble shelf with neutral decor, warm natural daylight, shallow depth of field with blurred background, product fills 60-70% of frame, editorial lifestyle photography, no human",
  mermer:
    "single shoe or bag on white marble surface with subtle gray veining, luxury accessory photography, soft overhead studio lighting with gentle reflections on marble, product fills 70-80% of frame, premium fashion aesthetic",
  ahsap:
    "single shoe or bag on warm natural wood surface with visible grain, rustic artisan accessory photography, soft warm directional lighting from side, shallow depth of field, product fills 75-85% of frame, handcraft aesthetic",
  gradient:
    "single shoe or bag on smooth modern gradient background with soft pastel tones, contemporary minimalist photography, even studio lighting, product fills 80-90% of frame, clean tech and lifestyle brand aesthetic",
  dogal:
    "single shoe or bag in outdoor natural setting with soft sunlight and green foliage in blurred background, placed on natural stone or wooden surface, shallow depth of field, product fills 70-80% of frame, fresh and organic photography",
}
