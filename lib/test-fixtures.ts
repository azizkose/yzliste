// TEST-INFRA-02: 5 product fixtures for demo testing
// DoD: 5 ürün × 3 platform = 15 listing

export type TestFixture = {
  ad: string;
  kategori: string;
  ozellikler: string;
  platform: string;
  hedefKitle: string;
  fiyatSegmenti: string;
};

export const TEST_FIXTURES: TestFixture[] = [
  {
    ad: "Vitamin C Aydınlatıcı Serum 30ml",
    kategori: "kozmetik",
    ozellikler: "C vitamini %15, hyalüronik asit, niasinamid içerir. Leke ve ton eşitsizliğini giderir. Tüm cilt tipleri için uygundur. Paraben ve alkol içermez.",
    platform: "trendyol",
    hedefKitle: "kadin",
    fiyatSegmenti: "orta",
  },
  {
    ad: "Bluetooth Kablosuz Kulaklık ANC Pro",
    kategori: "elektronik",
    ozellikler: "Aktif gürültü engelleme, 30 saat pil ömrü, katlanabilir tasarım, USB-C şarj. Multipoint bağlantı ile 2 cihaza aynı anda bağlanır.",
    platform: "amazon_tr",
    hedefKitle: "genel",
    fiyatSegmenti: "premium",
  },
  {
    ad: "Oversize Organik Pamuklu Basic T-shirt",
    kategori: "giyim",
    ozellikler: "100% organik pamuk, GOTS sertifikalı. Unisex oversize kesim. S-XXL arası bedenler. 10 renk seçeneği. Makine yıkamaya uygun.",
    platform: "trendyol",
    hedefKitle: "gencler",
    fiyatSegmenti: "butce",
  },
  {
    ad: "Soğuk Sıkım Ham Fıstık Ezmesi 350g",
    kategori: "gida",
    ozellikler: "Şekersiz, tuzsuz, katkısız. Sadece kavrulmuş fıstık. Sporcu ve diyet dostu. Cam kavanozda. Soğuk sıkım yöntemi ile üretilmiştir.",
    platform: "hepsiburada",
    hedefKitle: "sporcular",
    fiyatSegmenti: "orta",
  },
  {
    ad: "El Yapımı 925 Ayar Gümüş Ay Kolye",
    kategori: "taki",
    ozellikler: "Sterling gümüş, el işçiliği. Hilal ve yıldız motifi. 45cm zincir dahil. Kutu hediye paketi. Nikel içermez, alerjik değildir.",
    platform: "etsy",
    hedefKitle: "kadin",
    fiyatSegmenti: "orta",
  },
];
