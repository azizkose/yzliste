// UA-01 — 3 Adımda Hazır Section Constants

export type MockupType = 'input' | 'selection' | 'output'

export interface UcAdimStep {
  number: 1 | 2 | 3
  title: string
  description: string
  duration: string
  mockupType: MockupType
}

export const UC_ADIM_STEPS: UcAdimStep[] = [
  {
    number: 1,
    title: 'Ürün bilgisini gir',
    description:
      'Fotoğraf yükle, barkod tarat ya da bilgileri manuel gir. Marka profilini bir kez kaydet, her üretimde otomatik gelsin.',
    duration: 'Birkaç saniyede',
    mockupType: 'input',
  },
  {
    number: 2,
    title: 'Pazaryeri ve içerik seç',
    description:
      'Hangi pazaryerleri ve içerik türlerini istediğini seç. Trendyol, Amazon, Etsy ve daha fazlası — tek tıkla birden fazlasını seçebilirsin.',
    duration: 'Birkaç saniyede',
    mockupType: 'selection',
  },
  {
    number: 3,
    title: 'İçeriğini al',
    description:
      'Seçtiğin pazaryeri ve içerik kombinasyonları hazır. Kopyala, indir ya da doğrudan kullan.',
    duration: 'Kısa sürede',
    mockupType: 'output',
  },
]

export const TOTAL_TIME = 'Saniyeler içinde tamamlanır'
