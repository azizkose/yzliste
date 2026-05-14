import type { Stil } from "./index"

export const TAKI_NEGATIVE =
  "no human hand or body part unless model wearing for scale, no duplicates, no extra jewelry, no hallucinated stones or details, preserve original metal color and gemstone exactly, no fake reflections, sharp macro detail"

export const TAKI_STIL: Record<Stil, string> = {
  beyaz:
    "single jewelry piece or accessory on solid pure white (#FFFFFF) seamless studio background, macro jewelry photography with shallow depth of field, soft diffused lighting that highlights metal shine and gemstone clarity, product centered filling 50-70% of frame depending on size, subtle contact shadow, professional luxury accessory photography, sharp focus on details",
  koyu:
    "single jewelry piece on solid pure black (#000000) seamless background, luxury jewelry editorial macro photography, soft directional lighting that emphasizes metal shine and gem brilliance, product fills 50-65% of frame, preserve metal color exactly (gold, silver, rose gold), no glowing artifacts",
  lifestyle:
    "single jewelry piece in modern minimalist setting, placed on velvet tray or marble vanity with subtle decorative elements, warm soft lighting, shallow macro depth of field, product fills 55-70% of frame, editorial luxury accessory photography, no human",
  mermer:
    "single jewelry piece on white marble surface with subtle gray veining, luxury jewelry editorial, soft overhead lighting that highlights gemstones, macro depth of field, product fills 60-75% of frame, premium aesthetic",
  ahsap:
    "single jewelry piece on warm natural wood surface, artisan and handmade jewelry photography, soft warm directional lighting, macro depth of field with blurred wood grain background, product fills 60-75% of frame, handcraft aesthetic",
  gradient:
    "single jewelry piece on smooth modern gradient background with soft pastel tones, contemporary minimalist accessory photography, soft even lighting that highlights metal and stones, product fills 65-80% of frame, clean modern brand aesthetic",
  dogal:
    "single jewelry piece on natural stone or moss with soft sunlight, organic accessory photography with macro depth of field, blurred green foliage background, product fills 60-75% of frame, fresh and earthy aesthetic",
}
