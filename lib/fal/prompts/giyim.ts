import type { Stil } from "./index"

export const GIYIM_NEGATIVE =
  "no clothes hanger, no display rack, no hook, no human figure unless explicitly requested, no mannequin unless explicitly requested, no body parts, no extra clothing items, no stacked garments, no folded duplicates, no hallucinated garments, no shadows that imply person wearing it"

export const GIYIM_STIL: Record<Stil, string> = {
  beyaz:
    "remove any clothes hanger or display rack, flat-lay clothing photography, single garment isolated on solid pure white (#FFFFFF) seamless studio cyclorama background, soft diffused even lighting from all sides, garment fills 80-90% of frame, preserve original fabric texture pattern color and detail, garment laid flat or floating naturally, no model no mannequin no hanger",
  koyu:
    "remove any clothes hanger or display rack, single garment on solid pure black (#000000) seamless studio background, luxury apparel photography, dramatic moody lighting from above, soft subtle contact shadow only, garment fills 75-85% of frame, preserve original fabric and details, no glowing halos, no model no mannequin no hanger",
  lifestyle:
    "remove any clothes hanger or display rack, single garment styled in modern minimalist interior, draped naturally on a wooden bench or marble counter, warm natural daylight from large window, shallow depth of field with softly blurred background featuring neutral decor and subtle greenery, garment as clear hero filling 65-75% of frame, editorial fashion lifestyle photography, no human, no hanger, no mannequin",
  mermer:
    "remove any clothes hanger or display rack, single garment laid elegantly on white marble surface with subtle gray veining, luxury fashion editorial photography, soft overhead studio lighting with gentle reflections, garment fills 70-80% of frame, preserve original fabric details, premium aesthetic, no hanger no model no mannequin",
  ahsap:
    "remove any clothes hanger or display rack, single garment laid on warm natural wood surface with visible grain texture, rustic artisan fashion photography, soft warm directional lighting from the side, shallow depth of field, garment fills 75-85% of frame, handcraft and organic aesthetic, no hanger no model no mannequin",
  gradient:
    "remove any clothes hanger or display rack, single garment floating on smooth modern gradient background transitioning from soft pastel tones, contemporary minimalist fashion photography, even studio lighting, garment fills 80-90% of frame, clean lifestyle brand aesthetic, no hanger no model no mannequin",
  dogal:
    "remove any clothes hanger or display rack, single garment styled in outdoor natural setting with soft sunlight and green foliage in blurred background, draped on a natural stone or wooden surface, shallow depth of field, garment fills 70-80% of frame, fresh and organic fashion photography, no human no hanger no mannequin",
}
