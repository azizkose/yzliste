// P3-A4 — Basketbol topu (TR) + Bakır cezve (Etsy), tek kaynak
// RDFeaturesTabbed, InfoStrip ve MarkaBilgileriSection buradan beslenir

export const EXAMPLE_PRODUCT_TR = {
  brand: 'yzliste örnek',
  name: 'Profesyonel Basketbol Topu 7 Numara',
  category: 'Spor & Outdoor',
} as const

export const EXAMPLE_CONTENT_TR = {
  metin: {
    trendyol: {
      title: 'Profesyonel Kompozit Deri Basketbol Topu 7 Numara FIBA Onaylı İç-Dış Saha Antrenman Maç Topu',
      features: [
        'FIBA Onaylı Resmi Boyut — 7 numara, 75-78 cm çevre, 567-650 g ağırlık, profesyonel maç standardı',
        'Kompozit Deri Yüzey — Yüksek tutuş, ter emici dokulu kaplama; iç-dış saha kullanımına uygun',
        '8 Panel Sıkı Dikiş — Hava sızdırmaz iç tüp, uzun ömürlü performans, basınç stabilizasyonu',
        'Kuru Pompa Hediye — Set içinde kuru-tip pompa ve iğne; satın alır almaz kullanıma hazır',
        '7 Yaş Üstü Kullanıma Uygun — Antrenman, okul takımları, yarı-profesyonel ve hobi kullanım için ideal',
      ],
      description:
        'Profesyonel basketbol antrenman ve maç deneyimi için tasarlanmış 7 numara FIBA standardı kompozit deri basketbol topu. Ter emici dokulu yüzey kaplaması her hava koşulunda yüksek tutuş sağlarken, 8 panel sıkı dikişli yapı uzun ömürlü kullanımı garanti eder. İç saha parke ve dış saha asfalt zeminlerde aynı performansı sergileyen top, okul takımları, gençlik ligi ve hobi sporcular için tam profesyonel histir. Hediye kuru-tip pompa ve iğne ile birlikte gönderilir — kutudan çıkar çıkmaz oyuna hazır.',
      tags: [
        'basketbol topu',
        '7 numara basketbol',
        'FIBA onaylı top',
        'kompozit deri basketbol',
        'antrenman topu',
        'maç topu',
        'profesyonel basketbol',
        'dış saha basketbol topu',
        'iç saha basketbol topu',
        'basketbol topu pompalı',
      ],
    },
    amazon: {
      title:
        'Profesyonel Basketbol Topu 7 Numara | FIBA Onaylı Kompozit Deri Maç ve Antrenman Topu | İç-Dış Saha Kullanım | 8 Panel Sıkı Dikiş | Kuru Pompa Hediyeli | Okul Takımları için İdeal',
      features: [
        'FIBA STANDARTI 7 NUMARA — Resmi turnuva boyutu, 75-78 cm çevre, 567-650 g; profesyonel maç kalitesi',
        'HAVA KOŞULUNA DAYANIKLI YÜZEY — Ter emici kompozit deri kaplama; iç saha parke ve dış saha asfalt için optimize edilmiş tutuş',
        '8 PANEL HAVA SIZDIRMAZ — Sıkı dikişli panel yapısı, yüksek dayanımlı iç tüp; uzun ömürlü performans basıncı korur',
        'KUTUDA POMPA + İĞNE — Kuru-tip pompa ve iğne ile set halinde gelir; satın alır almaz oyuna hazır',
        'GENİŞ KULLANIM ARALIĞI — 7 yaş üstü, okul takımları, gençlik ligi, hobi ve yarı-profesyonel kullanım için uygundur',
      ],
      description:
        'Profesyonel basketbol antrenman ve maç deneyimi için tasarlanmış 7 numara FIBA standardı kompozit deri basketbol topu. Ter emici dokulu yüzey kaplaması her hava koşulunda yüksek tutuş sağlarken, 8 panel sıkı dikişli yapı uzun ömürlü kullanımı garanti eder. İç saha parke ve dış saha asfalt zeminlerde aynı performansı sergileyen top, okul takımları, gençlik ligi ve hobi sporcular için tam profesyonel histir. Hediye kuru-tip pompa ve iğne ile birlikte gönderilir — kutudan çıkar çıkmaz oyuna hazır.\n\nNeden bu top, neden Amazon? Hızlı teslimat, 30 gün iade garantisi ve Amazon satıcı güvencesiyle alışveriş yapın.',
      tags: [
        'basketbol topu',
        '7 numara basketbol',
        'FIBA onaylı top',
        'kompozit deri basketbol',
        'antrenman topu',
        'maç topu',
        'profesyonel basketbol',
        'dış saha basketbol topu',
        'iç saha basketbol topu',
        'basketbol topu pompalı',
        'okul basketbol topu',
        'gençlik basketbol topu',
      ],
    },
    etsy: {
      title:
        'Handmade Hammered Copper Turkish Coffee Pot Set — Cezve with 2 Porcelain Cups, Authentic Anatolian Craftsmanship, Wedding Gift',
      features: [
        'Hand-Hammered Copper Cezve — Each pot is individually hammered, making every piece one-of-a-kind',
        'Complete Set with 2 Cups — Copper cezve paired with two delicate porcelain cups',
        'Tin-Lined Interior — Food-safe tin lining preserves coffee flavor, traditional craft technique',
        'Made in Turkey (Gaziantep workshop) — From a family workshop with over a century of coppersmith heritage',
        'Includes Brewing Guide — Printed Turkish coffee brewing guide arrives with your set',
      ],
      description:
        "There's something quietly beautiful about copper that's been shaped by human hands. This Turkish coffee set — a hammered copper cezve paired with two delicate porcelain cups — comes from a tiny workshop in Gaziantep, where families have been hammering copper for more than a century. Every dent, every curve, every pattern is unique. It's the kind of piece that turns a five-minute coffee ritual into something you'll look forward to all day. Whether you're brewing for yourself or sharing with someone you love, this set arrives in a fitted gift box with a printed brewing guide.",
      tags: [
        'turkish coffee set',
        'copper cezve',
        'handmade copper pot',
        'anatolian craftsmanship',
        'hand hammered copper',
        'turkish coffee gift',
        'traditional coffee maker',
        'gift for coffee lover',
        'wedding gift set',
        'housewarming gift',
        'made in turkey',
        'artisan home goods',
        'copper kitchenware',
      ],
    },
  },
} as const

// Legacy alias — InfoStrip ve diğer mevcut componentler için geriye uyumluluk
export const EXAMPLE_PRODUCT = EXAMPLE_PRODUCT_TR

export const EXAMPLE_CONTENT = {
  metin: {
    trendyol: EXAMPLE_CONTENT_TR.metin.trendyol,
    'amazon-tr': EXAMPLE_CONTENT_TR.metin.amazon,
    etsy: EXAMPLE_CONTENT_TR.metin.etsy,
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
      '360° ürün dönüşü → detay zoom → dış saha kullanım → marka kapanışı',
  },
  sosyal: {
    instagram: {
      caption:
        'Sahaya çıkmadan önce doğru top şart. 7 numara FIBA standardı, kompozit deri, kuru pompa hediyeli.\n\nAntrenman için, maç için, hediye için — kutudan çıkar çıkmaz hazır.',
      hashtags: [
        '#basketbol',
        '#basketboltopu',
        '#spor',
        '#fibastandard',
        '#antrenman',
        '#okultakımı',
        '#sporhediye',
        '#kompozitderi',
        '#trendyolda',
      ],
    },
    tiktok: {
      caption:
        'FIBA onaylı 7 numara top, hediye kuru pompa ile — sahaya çıkmaya hazır mısın?',
      hashtags: ['#basketbol', '#spor', '#antrenman', '#trendyol'],
    },
    pinterest: {
      caption:
        'Professional basketball for training and matches — FIBA approved size 7, composite leather, pump included. Perfect gift for young athletes.',
      hashtags: ['#basketball', '#sportsgift', '#fibapro', '#youthsports'],
    },
  },
} as const
