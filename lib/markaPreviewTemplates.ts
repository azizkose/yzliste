export type PreviewTone = 'samimi' | 'profesyonel' | 'premium'

interface PreviewInputs {
  brand?: string
  ozellik?: string
  kategori?: string
}

const TEMPLATES: Record<PreviewTone, { listing: (i: PreviewInputs) => string; sosyal: (i: PreviewInputs) => string }> = {
  samimi: {
    listing: ({ brand, ozellik, kategori }) =>
      `${brand} olarak size en iyisini sunmaktan mutluluk duyuyoruz. ${kategori ? `${kategori} kategorisinde ` : ''}${ozellik ? `${ozellik} gibi özellikleriyle ` : ''}her ihtiyacınıza uygun ürünlerimiz sizi bekliyor.`,
    sosyal: ({ brand, kategori }) =>
      `${brand} ailesiyle tanışın! ${kategori ? `${kategori} ürünlerimizle ` : ''}günlük hayatınıza küçük bir dokunuş katmak için buradayız.`,
  },
  profesyonel: {
    listing: ({ brand, ozellik, kategori }) =>
      `${brand} — ${kategori || 'ürün'} kategorisinde güvenilir çözümler sunan marka. ${ozellik ? `${ozellik} ile ` : ''}kalite ve işlevselliği bir arada deneyimleyin.`,
    sosyal: ({ brand, kategori }) =>
      `${brand} | ${kategori ? `${kategori} alanında ` : ''}fark yaratan kalite. Ürün detayları için profil biyografisindeki bağlantıya göz atın.`,
  },
  premium: {
    listing: ({ brand, ozellik, kategori }) =>
      `${brand}. ${kategori ? `${kategori}'nin ` : ''}yeniden tanımı. ${ozellik ? `${ozellik} ile ` : ''}özenle tasarlanmış, kalıcı değer sunan ürünler.`,
    sosyal: ({ brand, kategori }) =>
      `${brand} — ${kategori ? `${kategori}. ` : ''}Sıradan değil.`,
  },
}

export function generatePreview(
  tone: PreviewTone,
  contentType: 'listing' | 'sosyal',
  inputs: PreviewInputs
): string {
  const safe: PreviewInputs = {
    brand: inputs.brand?.trim() || 'Markanız',
    ozellik: inputs.ozellik?.trim() || '',
    kategori: inputs.kategori?.trim() || '',
  }
  return TEMPLATES[tone][contentType](safe)
}

export const TON_ACIKLAMALARI: Record<PreviewTone, string> = {
  samimi: 'Yakın, içten dil — sevgili ve aile pazarı için',
  profesyonel: 'Güvenilir, kurumsal dil — B2B ve bilinçli alıcılar için',
  premium: 'Seçkin, minimalist dil — lüks ve butik pazarı için',
}
