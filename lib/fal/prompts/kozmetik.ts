import type { Stil } from "./index"

export const KOZMETIK_NEGATIVE =
  "no human hand or body part unless holding the product purposefully, no duplicates, no extra cosmetics, no medical claims visible in scene, no hallucinated label text changes, preserve original packaging and label exactly"

export const KOZMETIK_STIL: Record<Stil, string> = {
  beyaz:
    "single cosmetic or skincare product on solid pure white (#FFFFFF) seamless studio background, clean beauty product photography, soft diffused even lighting, product centered filling 65-75% of frame, subtle contact shadow, preserve original label text and packaging colors, sharp focus on label, professional e-commerce beauty photography",
  koyu:
    "single cosmetic product on solid pure black (#000000) seamless background, luxury beauty editorial photography, soft top lighting, product fills 60-70% of frame, preserve label and packaging exactly, premium aesthetic with subtle highlights on glass or plastic surface",
  lifestyle:
    "single beauty product in modern bathroom or vanity setting, placed on marble counter or wooden tray with subtle skincare ritual elements like rolled towel or eucalyptus sprig, warm natural light, shallow depth of field with softly blurred background, product fills 50-60% of frame, editorial beauty lifestyle photography, no human face, preserve original label",
  mermer:
    "single beauty product on white marble surface with subtle gray veining, luxury beauty editorial, soft overhead studio lighting with gentle marble reflections, product fills 65-75% of frame, premium spa and skincare aesthetic",
  ahsap:
    "single beauty product on warm natural wood surface with visible grain, organic and natural beauty aesthetic, soft warm directional lighting, shallow depth of field, product fills 70-80% of frame, artisan and clean beauty vibe",
  gradient:
    "single beauty product on smooth modern gradient background with soft pastel beauty tones, contemporary minimalist beauty photography, even studio lighting, product fills 75-85% of frame, clean modern brand aesthetic",
  dogal:
    "single beauty product in outdoor natural setting with soft sunlight and green foliage softly blurred, placed on natural stone, shallow depth of field, product fills 65-75% of frame, organic and natural beauty photography",
}
