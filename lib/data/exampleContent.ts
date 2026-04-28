// AS-04 — Selin Porselen örnek verisi, tek kaynak
// InfoStrip ve gelecekteki anasayfa komponentleri buradan beslenir

export const EXAMPLE_PRODUCT = {
  brand: 'Selin Porselen',
  name: "Selin Porselen Çiçek Desenli Kahve Fincanı 6'lı Set",
  shortDescription: "6'lı set · 80 ml · altın yaldızlı",
} as const

export const EXAMPLE_CONTENT = {
  metin: {
    trendyol: {
      title: "Selin Porselen Çiçek Desenli Kahve Fincanı 6'lı Set 80ml Altın Yaldızlı",
      features: [
        '6 fincan + 6 tabak içerir',
        '80 ml kapasite, espresso ve Türk kahvesi uyumlu',
        '24 ayar altın yaldız, el işlemesi',
        'Bulaşık makinesine dayanıklı porselen',
        'Hediye kutusunda teslim',
      ],
      description:
        "Selin Porselen'in çiçek desenli fincan seti, sofranıza zarafet katıyor. El işçiliğiyle hazırlanan altın yaldız detaylar ve dayanıklı porselen yapısıyla günlük kullanım ve özel günler için ideal.",
      tags: [
        'kahve fincanı seti',
        'porselen fincan',
        'altın yaldızlı fincan',
        'çiçek desenli fincan',
        'türk kahvesi fincanı',
        'hediye fincan seti',
        '6lı fincan seti',
        'el yapımı fincan',
        'porselen kahve seti',
        'fincan tabak seti',
      ],
    },
    'amazon-tr': {
      title:
        "Selin Porselen 6'lı Çiçek Desenli Kahve Fincanı Takımı – 80ml, 24 Ayar Altın Yaldız, El İşlemesi, Hediye Kutulu",
      features: [
        '6 fincan + 6 tabak: Tam takım, hemen kullanıma hazır',
        '80 ml kapasite: Espresso, Türk kahvesi ve ristretto için ideal boyut',
        'El işlemesi altın yaldız: Her parçada 24 ayar altın detay, benzersiz görünüm',
        'Üstün porselen kalite: Bulaşık makinesine dayanıklı, çizilmeye karşı dirençli',
        'Hediye kutusunda: Özel kutuda teslim, doğum günü ve özel günler için hazır',
      ],
      description:
        "Selin Porselen'in bu zarif fincan takımı, geleneksel el işçiliği ile modern tasarımı bir arada sunuyor. Her fincan üzerindeki çiçek deseni ve altın yaldız detaylar, kahve ritüelinizi özel bir deneyime dönüştürüyor.",
      tags: [
        'porselen fincan seti',
        'türk kahvesi fincanı',
        'altın yaldızlı fincan seti',
        'hediye fincan takımı',
        '6lı kahve seti',
        'el yapımı porselen fincan',
        'çiçek desenli fincan',
        'espresso fincanı',
        'kahve fincanı takımı',
        'porselen kahve seti',
      ],
    },
    etsy: {
      title:
        'Handmade Porcelain Coffee Cup Set of 6 – Floral Design, 24K Gold Detail, 80ml, Gift Box',
      features: [
        'Set of 6 cups + 6 saucers, 80ml capacity',
        '24K gold hand-painted detail on each piece',
        'Dishwasher safe, chip-resistant porcelain',
        'Suitable for espresso, Turkish coffee, and ristretto',
        'Arrives in a gift-ready presentation box',
      ],
      description:
        'These handcrafted porcelain coffee cups bring a touch of artisan elegance to every coffee moment. Each cup features delicate hand-painted florals and genuine 24K gold accents — no two pieces are exactly alike.',
      tags: [
        'porcelain coffee cup',
        'turkish coffee cup',
        'handmade cup set',
        'gold detail cup',
        'floral coffee cup',
        'espresso cup set',
        'gift cup set',
        'ceramic coffee set',
        'hand painted cup',
        'artisan coffee cup',
        'porcelain tea cup',
        'coffee lover gift',
        'wedding gift cup',
      ],
    },
  },

  gorsel: {
    placeholders: [
      'Ana görsel',
      'Set görünümü',
      'Ölçek referansı',
      'Paket içeriği',
      'Kullanım detayı',
      'Lifestyle sahne',
    ],
    standard: 'Trendyol stüdyo standardı: 1200×1200 px, beyaz zemin',
  },

  video: {
    duration: '5–30 saniye',
    aspect: '9:16 dikey veya 1:1 kare',
    sceneDescription:
      '360° ürün dönüşü → altın yaldız detay zoom → lifestyle kullanım → marka kapanışı',
  },

  // Gerçek AI üretim çıktısı örnekleri (PazaryeriSection'dan taşındı)
  sosyal: {
    instagram: {
      caption:
        "Sabah kahvenizi daha özel kılacak bir set var. Selin Porselen'in çiçek desenli fincan setini her yudumda hissedebilirsiniz.\n\nAltın yaldız detaylar, el işçiliği ve dayanıklı porselen — hem sofralık hem hediyelik.\n\nLink bio'da.",
      hashtags: [
        '#kahvefincanı',
        '#porselenfincan',
        '#altınyaldız',
        '#kahvetöreni',
        '#türkkahvesi',
        '#mutfakdekorasyonu',
        '#hediyelik',
        '#elyapımı',
        '#selinporselen',
        '#fincankoleksiyonu',
        '#kahveaşkı',
        '#fincanmodelleri',
        '#porselenset',
        '#sabahkahvesi',
        '#hediyefikirleri',
      ],
    },
    tiktok: {
      caption:
        "Kahvenizi sunma şekliniz de lüks olabilir. Selin Porselen fincan seti ile tanışın — altın yaldız, el işçiliği, Trendyol'da.",
      hashtags: ['#kahveaşkı', '#porselenfincan', '#trendyolda', '#mutfakdekor', '#hediyefikirleri'],
    },
    pinterest: {
      caption:
        'Beautiful handmade porcelain coffee cup set with 24K gold hand-painted detail. A perfect gift for coffee lovers and collectors. Made in Turkey.',
      hashtags: ['#handmadeporcelain', '#coffeecupset', '#etsyfinds', '#giftideas', '#handcrafted'],
    },
  },
} as const
