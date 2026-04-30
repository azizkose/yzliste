// PZ-01 — Pazaryeri Demo Data
// Emoji YASAK: tüm ikonlar Lucide string referansı

export const CONTENT_TYPES = [
  {
    id: 'text',
    label: 'Listing Metni',
    shortLabel: 'Metin',
    icon: 'FileText',
    credit: '1 kredi',
    color: '#1E40AF',
    bgColor: '#EFF6FF',
    preview: 'Başlık, özellikler, açıklama, etiketler',
  },
  {
    id: 'image',
    label: 'Görsel',
    shortLabel: 'Görsel',
    icon: 'Image',
    credit: 'Stil başına 1 kredi',
    color: '#7C3AED',
    bgColor: '#F5F3FF',
    preview: 'Stüdyo veya lifestyle görseller',
  },
  {
    id: 'video',
    label: 'Video',
    shortLabel: 'Video',
    icon: 'Video',
    credit: '5sn / 10sn',
    color: '#DC2626',
    bgColor: '#FEF2F2',
    preview: 'Tanıtım videosu, sahne kurgulu',
  },
  {
    id: 'social',
    label: 'Sosyal Medya',
    shortLabel: 'Sosyal',
    icon: 'Share2',
    credit: 'Kit: 3 kredi',
    color: '#059669',
    bgColor: '#ECFDF5',
    preview: 'Caption + hashtag, çoklu platform',
  },
] as const

export type ContentTypeId = (typeof CONTENT_TYPES)[number]['id']

export const PLATFORMS = {
  trendyol:    { name: 'Trendyol',    letter: 'T', color: '#F27A1A', bgColor: '#FFF4ED' },
  hepsiburada: { name: 'Hepsiburada', letter: 'H', color: '#FF6000', bgColor: '#FFF3EE' },
  amazon:      { name: 'Amazon TR',   letter: 'a', color: '#FF9900', bgColor: '#FFF8EB' },
  n11:         { name: 'N11',         letter: 'N', color: '#7B2D8B', bgColor: '#F7EEF9' },
  etsy:        { name: 'Etsy',        letter: 'E', color: '#F1641E', bgColor: '#FEF2EC' },
  amazon_usa:  { name: 'Amazon USA',  letter: 'A', color: '#146EB4', bgColor: '#EBF5FF' },
  ciceksepeti: { name: 'Çiçeksepeti', letter: 'Ç', color: '#FF1493', bgColor: '#FFE4F1' },
} as const

export type PlatformId = keyof typeof PLATFORMS

// --- Type definitions ---

interface RuleItem {
  icon: string   // Lucide ikon adı
  text: string
}

interface TextDemoData {
  rules: RuleItem[]
  fields: {
    'Başlık': string
    'Özellikler': string[]
    'Açıklama': string
    'Arama Etiketleri': string[]
  }
}

interface GalleryItem {
  label: string
  icon: string   // Lucide ikon adı
  bg: string     // hex renk
}

interface ImageDemoData {
  rules: RuleItem[]
  gallery: GalleryItem[]
  styleNote: string
}

interface SceneItem {
  time: string
  text: string
  icon: string   // Lucide ikon adı
}

interface VideoDemoData {
  rules: RuleItem[]
  scenes: SceneItem[]
  spec: string
}

interface SocialPostData {
  caption: string
  hashtags?: string[]
}

interface SocialDemoData {
  rules: RuleItem[]
  instagram: SocialPostData
  tiktok?: SocialPostData
  pinterest?: SocialPostData
}

export type DemoDataMap = {
  text: Partial<Record<PlatformId, TextDemoData>>
  image: Partial<Record<PlatformId, ImageDemoData>>
  video: Partial<Record<PlatformId, VideoDemoData>>
  social: Partial<Record<PlatformId, SocialDemoData>>
}

// --- Demo Data ---

export const PAZARYERI_DEMO_DATA: DemoDataMap = {
  text: {
    trendyol: {
      rules: [
        { icon: 'Ruler', text: 'Başlık maks. 100 karakter' },
        { icon: 'Globe', text: 'Türkçe çıktı' },
        { icon: 'Key', text: '10 arama etiketi' },
        { icon: 'ClipboardList', text: '5 özellik maddesi' },
      ],
      fields: {
        'Başlık': "Selin Porselen Çiçek Desenli Kahve Fincanı 6'lı Set 80ml Altın Yaldızlı",
        'Özellikler': [
          '6 fincan + 6 tabak içerir',
          '80 ml kapasite, espresso ve Türk kahvesi uyumlu',
          '24 ayar altın yaldız, el işlemesi',
          'Bulaşık makinesine dayanıklı porselen',
          'Hediye kutusunda teslim',
        ],
        'Açıklama': 'Selin Porselen\'in çiçek desenli fincan seti, sofranıza zarafet katıyor. El işçiliğiyle hazırlanan altın yaldız detaylar ve dayanıklı porselen yapısıyla günlük kullanım ve özel günler için ideal.',
        'Arama Etiketleri': [
          'kahve fincanı seti', 'porselen fincan', 'altın yaldızlı fincan',
          'çiçek desenli fincan', 'türk kahvesi fincanı', 'hediye fincan seti',
          '6lı fincan seti', 'el yapımı fincan', 'porselen kahve seti', 'fincan tabak seti',
        ],
      },
    },
    amazon: {
      rules: [
        { icon: 'Ruler', text: 'Başlık maks. 200 karakter' },
        { icon: 'Globe', text: 'Türkçe çıktı' },
        { icon: 'Key', text: 'Arama terimleri (backend)' },
        { icon: 'ClipboardList', text: '5 bullet point' },
      ],
      fields: {
        'Başlık': "Selin Porselen 6'lı Çiçek Desenli Kahve Fincanı Takımı – 80ml, 24 Ayar Altın Yaldız, El İşlemesi, Hediye Kutulu",
        'Özellikler': [
          '6 fincan + 6 tabak: Tam takım, hemen kullanıma hazır',
          '80 ml kapasite: Espresso, Türk kahvesi ve ristretto için ideal boyut',
          'El işlemesi altın yaldız: Her parçada 24 ayar altın detay, benzersiz görünüm',
          'Üstün porselen kalite: Bulaşık makinesine dayanıklı, çizilmeye karşı dirençli',
          'Hediye kutusunda: Özel kutuda teslim, doğum günü ve özel günler için hazır',
        ],
        'Açıklama': 'Selin Porselen\'in bu zarif fincan takımı, geleneksel el işçiliği ile modern tasarımı bir arada sunuyor. Her fincan üzerindeki çiçek deseni ve altın yaldız detaylar, kahve ritüelinizi özel bir deneyime dönüştürüyor.',
        'Arama Etiketleri': [
          'porselen fincan seti', 'türk kahvesi fincanı', 'altın yaldızlı fincan seti',
          'hediye fincan takımı', '6lı kahve seti', 'el yapımı porselen fincan',
          'çiçek desenli fincan', 'espresso fincanı', 'kahve fincanı takımı', 'porselen kahve seti',
        ],
      },
    },
    etsy: {
      rules: [
        { icon: 'Ruler', text: 'Title max 140 characters' },
        { icon: 'Globe', text: 'English output' },
        { icon: 'Key', text: '13 search tags' },
        { icon: 'BookOpen', text: 'Handmade & story-driven' },
      ],
      fields: {
        'Başlık': "Handmade Porcelain Coffee Cup Set of 6 – Floral Design, 24K Gold Detail, 80ml, Gift Box",
        'Özellikler': [
          'Set of 6 cups + 6 saucers, 80ml capacity',
          '24K gold hand-painted detail on each piece',
          'Dishwasher safe, chip-resistant porcelain',
          'Suitable for espresso, Turkish coffee, and ristretto',
          'Arrives in a gift-ready presentation box',
        ],
        'Açıklama': 'These handcrafted porcelain coffee cups bring a touch of artisan elegance to every coffee moment. Each cup features delicate hand-painted florals and genuine 24K gold accents — no two pieces are exactly alike.',
        'Arama Etiketleri': [
          'porcelain coffee cup', 'turkish coffee cup', 'handmade cup set',
          'gold detail cup', 'floral coffee cup', 'espresso cup set',
          'gift cup set', 'ceramic coffee set', 'hand painted cup', 'artisan coffee cup',
          'porcelain tea cup', 'coffee lover gift', 'wedding gift cup',
        ],
      },
    },
  },

  image: {
    trendyol: {
      rules: [
        { icon: 'Maximize', text: 'Min. 1200×1200 px' },
        { icon: 'Sparkles', text: 'Beyaz zemin, gölgesiz' },
        { icon: 'Search', text: 'Zoom uyumlu (%400)' },
        { icon: 'Sun', text: 'Ürün 85% frame dolgu' },
      ],
      gallery: [
        { label: 'Ana görsel', icon: 'Coffee', bg: '#F8FAFC' },
        { label: 'Set görünümü', icon: 'Coffee', bg: '#F8FAFC' },
        { label: 'Ölçek referansı', icon: 'Ruler', bg: '#F1F5F9' },
        { label: 'Paket içeriği', icon: 'Package', bg: '#F8FAFC' },
        { label: 'Kullanım detayı', icon: 'Sparkles', bg: '#FFFBEB' },
        { label: 'Lifestyle sahne', icon: 'Leaf', bg: '#F0FDF4' },
      ],
      styleNote: 'Beyaz zemin · 1200×1200 px · JPEG %90',
    },
    amazon: {
      rules: [
        { icon: 'Maximize', text: 'Min. 1000×1000 px' },
        { icon: 'Sparkles', text: 'Saf beyaz zemin (#FFFFFF)' },
        { icon: 'Search', text: 'Zoom aktif gereksinimi' },
        { icon: 'Sun', text: 'Ürün %85 kare dolgu' },
      ],
      gallery: [
        { label: 'Ana görsel', icon: 'Coffee', bg: '#FFFFFF' },
        { label: 'Açı 2', icon: 'Coffee', bg: '#FFFFFF' },
        { label: 'El kullanımı', icon: 'Hand', bg: '#F8FAFC' },
        { label: 'Paket içeriği', icon: 'Package', bg: '#FFFFFF' },
        { label: 'Detay yakın', icon: 'Sparkles', bg: '#FFFBEB' },
        { label: 'Ambalaj', icon: 'Gift', bg: '#F8FAFC' },
      ],
      styleNote: 'Saf beyaz · 2000×2000 px · Zoom aktif',
    },
    etsy: {
      rules: [
        { icon: 'Maximize', text: '2000px uzun kenar önerilen' },
        { icon: 'Palette', text: 'Lifestyle vurgu, el yapımı hissi' },
        { icon: 'Sun', text: 'Doğal ışık tercih edilir' },
        { icon: 'BookOpen', text: 'Hikaye anlatan kompozisyon' },
      ],
      gallery: [
        { label: 'Hero lifestyle', icon: 'Coffee', bg: '#FAF4ED' },
        { label: 'El sanatı detay', icon: 'Palette', bg: '#FEF2EC' },
        { label: 'Zanaatkar detay', icon: 'Palette', bg: '#FAF4ED' },
        { label: 'Ambalaj', icon: 'Gift', bg: '#F8FAFC' },
        { label: 'Kullanım sahnesi', icon: 'Leaf', bg: '#F0FDF4' },
        { label: 'Ölçek göstergesi', icon: 'Ruler', bg: '#F8FAFC' },
      ],
      styleNote: 'Lifestyle · 2000×2000 px · Doğal ışık',
    },
  },

  video: {
    trendyol: {
      rules: [
        { icon: 'Timer', text: 'Maks. 30 saniye' },
        { icon: 'Maximize', text: '1080×1080 px (kare)' },
        { icon: 'Target', text: 'Ürün-merkezli, sade' },
        { icon: 'Sparkles', text: 'Marka logosu sonda' },
      ],
      scenes: [
        { time: '0–2s', text: 'Ürün beyaz zeminde beliriyor', icon: 'Coffee' },
        { time: '2–6s', text: '360° yavaş dönüş', icon: 'RotateCw' },
        { time: '6–10s', text: 'Altın yaldız detay zoom', icon: 'Search' },
        { time: '10–15s', text: 'El ile kullanım sahnesi', icon: 'Hand' },
        { time: '15–20s', text: 'Set tam görünümü', icon: 'Camera' },
        { time: '20–25s', text: 'Logo + marka adı overlay', icon: 'Tag' },
      ],
      spec: '1080×1080 · 25fps · H.264 · Maks. 30sn',
    },
    amazon: {
      rules: [
        { icon: 'Timer', text: 'Maks. 30 saniye' },
        { icon: 'Maximize', text: '1920×1080 px (yatay)' },
        { icon: 'ClipboardList', text: 'Özellik vurgulu anlatı' },
        { icon: 'Search', text: 'Detay zumu zorunlu' },
      ],
      scenes: [
        { time: '0–3s', text: 'Ürün öne doğru yaklaşıyor', icon: 'Coffee' },
        { time: '3–8s', text: 'Özellik metni: "6 fincan + 6 tabak"', icon: 'ClipboardList' },
        { time: '8–14s', text: 'Altın yaldız detay zoom', icon: 'Search' },
        { time: '14–20s', text: 'Paket içeriği üstten görünüm', icon: 'Package' },
        { time: '20–27s', text: 'Lifestyle kullanım sahnesi', icon: 'Coffee' },
        { time: '27–30s', text: 'Marka logosu + kapanış', icon: 'Tag' },
      ],
      spec: '1920×1080 · 30fps · H.264 · Maks. 30sn',
    },
    etsy: {
      rules: [
        { icon: 'Timer', text: 'Önerilen 15–30 saniye' },
        { icon: 'Maximize', text: '1080×1350 px (dikey) veya kare' },
        { icon: 'Palette', text: 'El yapımı hissi, doğal ışık' },
        { icon: 'BookOpen', text: 'Üretim sürecini göster' },
      ],
      scenes: [
        { time: '0–3s', text: 'Atölye masasında ürün', icon: 'Palette' },
        { time: '3–8s', text: 'El yapımı altın detay çizimi', icon: 'Sparkles' },
        { time: '8–14s', text: 'Fincan seti doğal ışıkta', icon: 'Sun' },
        { time: '14–20s', text: 'Lifestyle: kahve hazırlama', icon: 'Coffee' },
        { time: '20–25s', text: 'Hediye kutusu kapanışı', icon: 'Gift' },
        { time: '25–30s', text: 'Shop adı + "Handmade in Turkey"', icon: 'Tag' },
      ],
      spec: '1080×1080 · 30fps · MP4 · Doğal ışık vurgusu',
    },
  },

  social: {
    trendyol: {
      rules: [
        { icon: 'Smartphone', text: 'Instagram + TikTok uyumlu' },
        { icon: 'Hash', text: '20–30 hashtag önerilen' },
        { icon: 'Globe', text: 'Türkçe çıktı' },
        { icon: 'Target', text: 'Ürün linki bio\'ya yönlendir' },
      ],
      instagram: {
        caption: 'Sabah kahvenizi daha özel kılacak bir set var. Selin Porselen\'in çiçek desenli fincan setini her yudumda hissedebilirsiniz.\n\nAltın yaldız detaylar, el işçiliği ve dayanıklı porselen — hem sofralık hem hediyelik.\n\nLink bio\'da.',
        hashtags: [
          '#kahvefincanı', '#porselenfincan', '#altınyaldız', '#kahvetöreni', '#türkkahvesi',
          '#mutfakdekorasyonu', '#hediyelik', '#elyapımı', '#selinporselen', '#fincankoleksiyonu',
          '#kahveaşkı', '#fincanmodelleri', '#porselenset', '#sabahkahvesi', '#hediyefikirleri',
          '#kahveseverlere', '#trendyol', '#evdekorasyonu', '#kahvekeyfi', '#porselen',
        ],
      },
      tiktok: {
        caption: 'Kahvenizi sunma şekliniz de lüks olabilir. Selin Porselen fincan seti ile tanışın — altın yaldız, el işçiliği, Trendyol\'da.',
        hashtags: [
          '#kahveaşkı', '#porselenfincan', '#trendyolda', '#mutfakdekor', '#hediyefikirleri',
        ],
      },
    },
    amazon: {
      rules: [
        { icon: 'Smartphone', text: 'Instagram + Pinterest uyumlu' },
        { icon: 'Hash', text: '20–25 hashtag' },
        { icon: 'Globe', text: 'Türkçe + İngilizce seçenek' },
        { icon: 'Target', text: 'Amazon ürün linki' },
      ],
      instagram: {
        caption: 'Hediye almak için doğru yer: Amazon TR.\n\nSelin Porselen 6\'lı fincan seti — her parçasında el işçiliği, her detayında 24 ayar altın. Hediye kutusunda teslim.\n\nAmazon\'da bulabilirsiniz.',
        hashtags: [
          '#kahvefincanı', '#hediyefikirleri', '#amazon', '#porselenfincan', '#altınyaldız',
          '#doğumgünühediyesi', '#mutfakaksesuarı', '#elyapımı', '#fincankoleksiyonu', '#kahveaşkı',
          '#porselen', '#hediyeseti', '#mutfakdekorasyonu', '#kahvetöreni', '#türkkahvesi',
          '#lükshediye', '#amazontr', '#evdekorasyonu', '#kahveseverlere', '#fincanmodelleri',
        ],
      },
      pinterest: {
        caption: 'Handmade porcelain coffee cup set with 24K gold detail. Perfect gift for coffee lovers. Available on Amazon TR.',
        hashtags: [
          '#porcelain', '#coffeecup', '#handmade', '#giftidea', '#turkishcoffee',
        ],
      },
    },
    etsy: {
      rules: [
        { icon: 'Smartphone', text: 'Instagram + Pinterest uyumlu' },
        { icon: 'Hash', text: '25–30 hashtag' },
        { icon: 'Globe', text: 'İngilizce çıktı' },
        { icon: 'BookOpen', text: 'Hikaye + zanaatkar vurgu' },
      ],
      instagram: {
        caption: 'Every cup tells a story.\n\nThese handcrafted porcelain cups are painted by hand with real 24K gold — each one slightly different, all of them beautiful. Made in Turkey, shipped worldwide.\n\nFind them in our Etsy shop (link in bio).',
        hashtags: [
          '#handmade', '#porcelain', '#coffeecup', '#etsyshop', '#handcrafted',
          '#golddetail', '#turkishcoffee', '#coffeelover', '#ceramics', '#giftideas',
          '#weddinggift', '#artisancraft', '#shopsmall', '#etsyfinds', '#madeinturkey',
          '#coffeeset', '#homedecor', '#kitchenware', '#porcelainart', '#handpainted',
        ],
      },
      pinterest: {
        caption: 'Beautiful handmade porcelain coffee cup set with 24K gold hand-painted detail. A perfect gift for coffee lovers and collectors. Made in Turkey.',
        hashtags: [
          '#handmadeporcelain', '#coffeecupset', '#etsyfinds', '#giftideas', '#handcrafted',
        ],
      },
    },
  },
}

// --- Input Card Data ---

export const INPUT_METHODS = [
  { icon: 'Camera', label: 'Fotoğraftan analiz' },
  { icon: 'Pencil', label: 'Manuel giriş' },
  { icon: 'Barcode', label: 'Barkod tarama' },
] as const

export const SAMPLE_PRODUCT = {
  name: 'Porselen fincan seti',
  brand: 'Selin Porselen',
  category: 'Mutfak > Fincan',
  imageIcon: 'Coffee',
  specs: {
    weight: '320 g',
    material: 'Porselen',
    pieces: '12 parça',
    color: 'Beyaz / Altın',
  },
} as const
