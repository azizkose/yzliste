// IT-01 — İçerik Türleri Kartları Data
// Emoji YASAK: tüm ikonlar Lucide string referansı

export const ICERIK_TURLERI = [
  {
    id: 'text',
    icon: 'FileText',
    title: 'Listing Metni',
    tagline: 'Pazaryerine özel başlık ve açıklama',
    contains: ['Başlık', 'Özellikler', 'Açıklama', 'Arama Etiketleri'],
    pricing: '1 kredi / metin',
    duration: '~10 saniye',
    color: '#1E40AF',
    bgColor: '#EFF6FF',
    sample: {
      platform: 'Trendyol',
      title: "Selin Porselen Çiçek Desenli Kahve Fincanı 6'lı Set 80ml Altın Yaldızlı",
      snippet: "6 fincan + 6 tabak · 24 ayar altın yaldız · El işlemeli",
    },
  },
  {
    id: 'image',
    icon: 'Image',
    title: 'Görsel',
    tagline: 'Stüdyo veya lifestyle ürün fotoğrafı',
    contains: ['4 farklı açı', 'Beyaz zemin / lifestyle', 'Yüksek çözünürlük', 'Platforma özel oran'],
    pricing: 'Stil başına 1 kredi',
    duration: '~30 saniye',
    color: '#7C3AED',
    bgColor: '#F5F3FF',
    sample: {
      platform: 'Tüm platformlar',
      title: '4 farklı açıdan stüdyo görseli',
      snippet: 'Beyaz zemin, ürün ortalı, gölgesiz · 1200×1800 px',
    },
  },
  {
    id: 'video',
    icon: 'Video',
    title: 'Video',
    tagline: 'Ürün tanıtım videosu, sahne kurgusuyla',
    contains: ['5–30 saniye', 'Platforma özel oran (9:16, 16:9, 1:1)', '1080p MP4', 'Sahne planlı'],
    pricing: '5sn: 2 kredi · 10sn: 3 kredi',
    duration: '~2 dakika',
    color: '#DC2626',
    bgColor: '#FEF2F2',
    sample: {
      platform: 'Trendyol · Reels uyumlu',
      title: '10 saniyelik dikey ürün videosu',
      snippet: '360° dönüş + detay zoom + logo · 1080×1920',
    },
  },
  {
    id: 'social',
    icon: 'Share2',
    title: 'Sosyal Medya',
    tagline: 'Caption + hashtag, çoklu platform',
    contains: ['Instagram caption', 'TikTok / Pinterest metni', 'Hashtag seti', 'Marka tonuna uygun'],
    pricing: 'Kit: 3 kredi',
    duration: '~20 saniye',
    color: '#059669',
    bgColor: '#ECFDF5',
    sample: {
      platform: 'Instagram + TikTok',
      title: "Tam sosyal medya kit'i",
      snippet: 'Platformlara uygun caption, hashtag seti ve marka tonu',
    },
  },
] as const

export type IcerikTuruId = (typeof ICERIK_TURLERI)[number]['id']

export const BOTTOM_NOTE = {
  icon: 'Sparkles',
  text: 'Hepsini birlikte kullan, krediler her araçta geçerli.',
  linkText: 'Tüm araçlar',
  linkIcon: 'ArrowRight',
  linkHref: '/uret',
} as const
