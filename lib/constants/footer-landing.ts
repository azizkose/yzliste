// lib/constants/footer-landing.ts

export const FOOTER_BRAND = {
  name: 'yzliste',
  tagline: 'Pazaryeri içeriklerini AI ile üret',
  location: 'Türkiye',
}

export const FOOTER_COLUMNS = [
  {
    title: 'Ürün',
    links: [
      { label: 'Fiyatlar', href: '/fiyatlar' },
      { label: 'Blog', href: '/blog' },
      { label: 'Sık sorulan sorular', href: '/sss' },
    ],
  },
  {
    title: 'Şirket',
    links: [
      { label: 'Hakkımızda', href: '/hakkimizda' },
      { label: 'İletişim', href: 'mailto:destek@yzliste.com' },
    ],
  },
  {
    title: 'Yasal',
    links: [
      { label: 'Kullanım koşulları', href: '/kosullar' },
      { label: 'Gizlilik politikası', href: '/gizlilik' },
      { label: 'Mesafeli satış', href: '/mesafeli-satis' },
      { label: 'Teslimat ve iade', href: '/teslimat-iade' },
      { label: 'KVKK aydınlatma', href: '/kvkk-aydinlatma' },
      { label: 'Çerez politikası', href: '/cerez-politikasi' },
    ],
  },
] as const

export const FOOTER_COPYRIGHT = '© 2026 yzliste · SIMOON PAZARLAMA VE DANISMANLIK LIMITED SIRKETI'

export const FOOTER_DISCLAIMER = 'yzliste; Trendyol, Hepsiburada, Amazon, N11, Etsy, Amazon USA ve Çiçeksepeti ile resmi bir iş birliği içinde değildir. Belirtilen marka adları yalnızca desteklenen pazaryerlerini tanımlamak için kullanılmaktadır. Tüm markalar kendi sahiplerine aittir.'

export const FOOTER_IYZICO_LOGO = '/iyzico_footer_logo.png'
