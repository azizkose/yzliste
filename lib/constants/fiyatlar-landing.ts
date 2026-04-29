import { PAKET_LISTESI, type Paket } from '@/lib/paketler'

// Re-export — section component sadece bu dosyayı import etsin
export { PAKET_LISTESI }
export type { Paket }

export const FIYATLAR_HEADER = {
  eyebrow: 'Fiyatlandırma',
  title: 'Kullandıkça öde, abonelik yok',
  subtitle: 'Kredi paketini al, istediğin içerik türünde kullan. Süre sınırı yok.',
}

export const SLIDER_CONFIG = {
  min: 1,
  max: 100,
  defaultValue: 15,
  label: 'Aylık ürün sayısı',
}

// Kredi maliyetleri (landing page gösterimi için)
export const CREDIT_PER_PRODUCT = 1 // listing metni = 1 kredi
// Not: Video (10-20 kr) ve try-on (3 kr) farklı ama slider sadece listing bazlı hesap yapar

export const RECOMMENDATION_EYEBROW = 'Sana uygun paket'

export const TRUST_POINTS = [
  'Abonelik yok',
  'Krediler süresiz',
  'iyzico güvencesi',
  'e-Arşiv fatura',
] as const

export const FIYATLAR_CTA_ROUTE = '/fiyatlar'
