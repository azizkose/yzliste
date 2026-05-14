import type { Stil } from "./index"

export const GENEL_NEGATIVE =
  "no duplicates, no extra products, no hallucinated objects, preserve original product shape and color, no fake details, no human unless product is interactive (toy held by hand etc.)"

export const GENEL_STIL: Record<Stil, string> = {
  beyaz:
    "single product on solid pure white (#FFFFFF) seamless studio cyclorama background, soft diffused even lighting from all sides, product centered filling 70-85% of frame, very subtle contact shadow, preserve original product color shape and material, professional e-commerce product photography",
  koyu:
    "single product on solid pure black (#000000) seamless studio background, luxury product photography, soft overhead lighting, product fills 65-80% of frame, subtle contact shadow, preserve original product details, no glowing halos or color shifts",
  lifestyle:
    "single product in modern minimalist interior setting, placed on appropriate surface (table for kitchenware, shelf for decor, desk for electronics), warm natural daylight, shallow depth of field with softly blurred background, product fills 55-70% of frame, editorial lifestyle product photography",
  mermer:
    "single product on white marble surface with subtle gray veining, clean luxury product photography, soft overhead studio lighting with gentle marble reflections, product fills 65-80% of frame, premium aesthetic",
  ahsap:
    "single product on warm natural wood surface with visible grain texture, rustic and organic product photography, soft warm directional lighting from side, shallow depth of field, product fills 70-85% of frame, handcraft and artisan aesthetic",
  gradient:
    "single product on smooth modern gradient background transitioning from soft pastel tones, contemporary minimalist product photography, even studio lighting, product fills 75-90% of frame, clean tech and lifestyle brand aesthetic",
  dogal:
    "single product in outdoor natural setting with soft sunlight and green foliage softly blurred in background, placed on natural stone or wooden surface, shallow depth of field, product fills 65-80% of frame, fresh and organic product photography",
}
