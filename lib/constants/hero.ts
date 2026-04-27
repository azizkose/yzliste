// HR-01 — Hero Section Constants

// ---- Trust Strip ----

export interface TrustStripItem {
  icon: string
  label: string
}

export const TRUST_STRIP_ITEMS: TrustStripItem[] = [
  { icon: 'Flag', label: "Türkiye'de geliştirildi" },
  { icon: 'Lock', label: '256-bit SSL' },
  { icon: 'Zap', label: 'Saniyeler içinde üretim' },
]

// ---- Nav ----

export interface NavLink {
  href: string
  label: string
}

export const NAV_LINKS: NavLink[] = [
  { href: '/uret', label: 'Araçlar' },
  { href: '/fiyatlar', label: 'Fiyatlar' },
  { href: '/blog', label: 'Blog' },
]

export const NAV_BRAND = {
  name: 'yzliste',
  betaBadge: true,
} as const

export const NAV_CTAS = {
  login: { href: '/giris', label: 'Giriş yap' },
  primary: { href: '/kayit', label: 'İçerik üret' },
} as const

// ---- Hero Copy ----

export const HERO_COPY = {
  eyebrow: '7 pazaryeri için içerik üretir',
  h1Pre: 'E-ticaret içeriğini',
  h1Highlight: 'AI ile',
  h1Post: 'üret.',
  sub: 'Ürün fotoğrafını yükle — listing metni, stüdyo görseli, tanıtım videosu ve sosyal medya içeriği dakikalar içinde hazır. Aylık abonelik yok.',
  ctaPrimary: 'Ücretsiz başla — 3 kredi hediye',
  ctaSecondary: 'Nasıl çalışır?',
  reassurance: 'Kredi kartı gerekmez · 30 saniyede ilk içeriğin hazır',
} as const

// ---- Trust Pills ----

export interface TrustPill {
  icon: string
  label: string
}

export const HERO_TRUST_PILLS: TrustPill[] = [
  { icon: 'Plug', label: 'Kurulum yok' },
  { icon: 'CreditCard', label: 'Abonelik yok' },
  { icon: 'Target', label: '7 pazaryeri' },
  { icon: 'Zap', label: 'Saniyeler içinde' },
]

// ---- Sticker Badges ----

export const HERO_BADGES = {
  topRight: { icon: 'Check', label: '7 pazaryeri için optimize' },
  bottomLeft: { icon: 'Zap', label: 'Saniyeler içinde üretildi' },
} as const

// ---- App Screenshot Mockup ----

export const MOCKUP_STEPS = [
  { number: 1, label: 'Ürün bilgisi', active: true },
  { number: 2, label: 'İçerik seç', active: true },
  { number: 3, label: 'Üret', active: false },
] as const

export const MOCKUP_INPUT_METHODS = [
  { icon: 'Camera', label: 'Fotoğraf', selected: true },
  { icon: 'Pencil', label: 'Manuel', selected: false },
  { icon: 'ScanLine', label: 'Barkod', selected: false },
] as const
