import { GIYIM_STIL, GIYIM_NEGATIVE } from "./giyim"
import { AYAKKABI_STIL, AYAKKABI_NEGATIVE } from "./ayakkabi-canta"
import { KOZMETIK_STIL, KOZMETIK_NEGATIVE } from "./kozmetik"
import { TAKI_STIL, TAKI_NEGATIVE } from "./taki-aksesuar"
import { GENEL_STIL, GENEL_NEGATIVE } from "./genel"
import { COMMON_POSITIVE_SUFFIX, COMMON_NEGATIVE_BASE } from "./_common"

export type Kategori = "giyim" | "ayakkabi_canta" | "kozmetik" | "taki_aksesuar" | "genel"
export type Stil = "beyaz" | "koyu" | "lifestyle" | "mermer" | "ahsap" | "gradient" | "dogal"

export const GORSEL_PROMPT_VERSION = "gorsel-v2.0"

const KATEGORI_PROMPTS: Record<Kategori, { stiller: Record<Stil, string>; negative: string }> = {
  giyim:          { stiller: GIYIM_STIL,    negative: GIYIM_NEGATIVE },
  ayakkabi_canta: { stiller: AYAKKABI_STIL, negative: AYAKKABI_NEGATIVE },
  kozmetik:       { stiller: KOZMETIK_STIL, negative: KOZMETIK_NEGATIVE },
  taki_aksesuar:  { stiller: TAKI_STIL,     negative: TAKI_NEGATIVE },
  genel:          { stiller: GENEL_STIL,    negative: GENEL_NEGATIVE },
}

export function buildPrompt({
  kategori,
  stil,
  brandContext,
  ekPrompt,
}: {
  kategori: Kategori
  stil: Stil
  brandContext?: string
  ekPrompt?: string
}): { positive: string; negative: string } {
  const config = KATEGORI_PROMPTS[kategori]
  const basePrompt = config.stiller[stil]

  const parts = [basePrompt, brandContext, COMMON_POSITIVE_SUFFIX]
  if (ekPrompt) parts.push(`Ek talep: ${ekPrompt}`)

  return {
    positive: parts.filter(Boolean).join(", "),
    negative: `${COMMON_NEGATIVE_BASE}, ${config.negative}`,
  }
}

export { COMMON_POSITIVE_SUFFIX, COMMON_NEGATIVE_BASE }
