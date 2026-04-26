// ─── Platform bilgileri ───────────────────────────────────────────────────────

export const PLATFORM_BILGI: Record<string, {
  baslikLimit: number;
  ozellikSayisi: number;
  aciklamaKelime: number;
  etiketSayisi: number;
  renk: string;
  aciklama: string;
  dil: "tr" | "en";
}> = {
  trendyol:    { baslikLimit: 100, ozellikSayisi: 5, aciklamaKelime: 300, etiketSayisi: 10, renk: "bg-[#FEF4E7] text-[#8B4513] border-[#D8D6CE]", aciklama: "Emoji destekli · Marka + Ürün + Özellik formatı", dil: "tr" },
  hepsiburada: { baslikLimit: 150, ozellikSayisi: 5, aciklamaKelime: 350, etiketSayisi: 10, renk: "bg-[#FEF4E7] text-[#8B4513] border-[#D8D6CE]", aciklama: "Emoji destekli · Teknik detay odaklı", dil: "tr" },
  amazon:      { baslikLimit: 200, ozellikSayisi: 5, aciklamaKelime: 400, etiketSayisi:  0, renk: "bg-[#EBF1FB] text-[#0E2558] border-[#BAC9EB]", aciklama: "Emoji kullanılmaz · Title Case · Backend arama terimleri", dil: "tr" },
  n11:         { baslikLimit: 100, ozellikSayisi: 5, aciklamaKelime: 250, etiketSayisi:  8, renk: "bg-[#EBF1FB] text-[#0E2558] border-[#BAC9EB]", aciklama: "Emoji destekli · Sade ve anlaşılır dil", dil: "tr" },
  etsy:        { baslikLimit: 140, ozellikSayisi: 0, aciklamaKelime: 300, etiketSayisi: 13, renk: "bg-[#FEF4E7] text-[#8B4513] border-[#D8D6CE]", aciklama: "Natural English · 13 multi-word tags · No keyword stuffing", dil: "en" },
  amazon_usa:  { baslikLimit: 200, ozellikSayisi: 5, aciklamaKelime: 400, etiketSayisi:  0, renk: "bg-[#EBF1FB] text-[#0E2558] border-[#BAC9EB]", aciklama: "Title Case · No emoji · Benefit-first bullets · Backend search terms", dil: "en" },
};

export const PLATFORM_PLACEHOLDER: Record<string, { urun: string; kategori: string; ozellik: string }> = {
  trendyol:    { urun: "örn: Columbia Erkek Su Geçirmez Outdoor Bot",          kategori: "örn: Ayakkabı & Çanta / Erkek Bot",              ozellik: "örn: 42 numara, kahverengi, hakiki deri, kışlık, garanti belgeli, kutusuyla" },
  hepsiburada: { urun: "örn: Samsung Galaxy S24 128GB Akıllı Telefon",         kategori: "örn: Cep Telefonu & Aksesuar / Akıllı Telefon",  ozellik: "örn: Siyah renk, 6.1 inç ekran, 50MP kamera, 4000mAh batarya, Türkiye garantili" },
  amazon:      { urun: "örn: Philips HD9250 Airfryer XXL",                     kategori: "örn: Küçük Ev Aletleri / Fritöz",                ozellik: "örn: 7.3L kapasite, dijital ekran, yağsız pişirme, 7 program, 2030W, CE belgeli" },
  n11:         { urun: "örn: Tefal Ingenio Tencere Seti 13 Parça",             kategori: "örn: Mutfak & Yemek / Tencere Seti",             ozellik: "örn: Alüminyum, yapışmaz kaplama, 18-28cm, indüksiyon uyumlu, fırına girer" },
  etsy:        { urun: "e.g. Handmade Copper Cezve Set, Turkish Coffee Pot",   kategori: "e.g. Kitchen & Dining / Coffee Accessories",     ozellik: "e.g. handmade, copper, 2-piece set, traditional Turkish style, gift idea" },
  amazon_usa:  { urun: "e.g. Turkish Copper Coffee Maker Set, 2 Piece",        kategori: "e.g. Kitchen & Dining / Coffee & Espresso",      ozellik: "e.g. Solid copper, handcrafted, 2-cup capacity, includes lid, food safe" },
};

// ─── Yükleniyor mesajları ─────────────────────────────────────────────────────

export const YUKLENIYOR_MESAJLARI = [
  "Ürün analiz ediliyor...",
  "Alıcı arama alışkanlıkları inceleniyor...",
  "Platform kuralları uygulanıyor...",
  "SEO ve GEO optimizasyonu yapılıyor...",
  "Anahtar kelimeler yerleştiriliyor...",
  "İçerik hazırlanıyor...",
];

// ─── Görsel stiller ───────────────────────────────────────────────────────────

export type GorselStil = {
  id: string;
  label: string;
  aciklama: string;
  img: string | null;
  kategoriler: string[];
};

export const GORSEL_STILLER: GorselStil[] = [
  { id: "beyaz",    label: "Beyaz Zemin",  aciklama: "Trendyol standart",      img: "/ornek_beyaz.jpg",     kategoriler: ["kozmetik","elektronik","cocuk","giyim"] },
  { id: "koyu",     label: "Koyu Zemin",   aciklama: "Premium / elektronik",   img: "/ornek_koyu.jpg",      kategoriler: ["elektronik","taki"] },
  { id: "lifestyle",label: "Lifestyle",    aciklama: "Gerçek ortam",           img: "/ornek_lifestyle.jpg", kategoriler: ["giyim","ev","gida"] },
  { id: "mermer",   label: "Mermer",       aciklama: "Lüks / kozmetik",        img: "/ornek_mermer.jpg",    kategoriler: ["kozmetik","taki"] },
  { id: "ahsap",    label: "Ahşap",        aciklama: "El yapımı / organik",    img: "/ornek_ahsap.jpg",     kategoriler: ["gida","ev","spor"] },
  { id: "gradient", label: "Gradient",     aciklama: "Modern / teknoloji",     img: "/ornek_gradient.jpg",  kategoriler: ["elektronik","cocuk","kozmetik"] },
  { id: "dogal",    label: "Doğal",        aciklama: "Açık hava / taze",       img: "/ornek_dogal.jpg",     kategoriler: ["gida","spor","ev"] },
  { id: "ozel",     label: "Sahneni Yaz",  aciklama: "Prompt ile tanımla",     img: null,                   kategoriler: [] },
  { id: "referans", label: "Arka Plan",    aciklama: "Fotoğraf yükle",         img: null,                   kategoriler: [] },
];

// ─── Video presetler ──────────────────────────────────────────────────────────

export type VideoPreset = {
  etiket: string;
  aciklama: string;
  ikon: string;
  goster: string;
  deger: string;
  kategoriler: string[];
};

export const VIDEO_PRESETLER: VideoPreset[] = [
  { etiket: "360° Dönüş",       aciklama: "Ürün kendi ekseni etrafında yavaşça döner. Tüm açılar görünür.",          ikon: "RotateCw",  goster: "Ürün temiz zemin üzerinde 180° yavaşça döner, yumuşak stüdyo ışığı, beyaz arka plan",                                                                                               deger: "Product slowly rotates 180 degrees on a clean surface, smooth and steady, then gently settles back to its original position, soft even studio lighting, white background",                                                                                                             kategoriler: ["tumu"] },
  { etiket: "Zoom Yaklaşım",    aciklama: "Kamera ürüne doğru yavaş yaklaşır. Detay ve doku hissi verir.",           ikon: "ZoomIn",    goster: "Kamera 3 saniyede ürüne yaklaşır, doku ve yüzey detayları ortaya çıkar, arka plan yumuşak odak dışı",                                                                                 deger: "Camera smoothly zooms in from medium shot to close-up over 3 seconds, revealing product texture and surface details, then holds steady for 2 seconds, soft focus background gradually blurs more",                                                                                      kategoriler: ["tumu"] },
  { etiket: "Dramatik Işık",    aciklama: "Karanlık sahnede spotlight açılır. Premium görünüm.",                      ikon: "Lightbulb", goster: "Karanlık sahne, yumuşak tepe ışığı 3 saniyede kademeli açılır, yüzeyde hafif yansıma, lüks sinematik his",                                                                            deger: "Dark scene, then soft overhead light gradually fades in illuminating the product over 3 seconds, light reaches full brightness and holds steady, subtle reflection on surface beneath product, luxury cinematic feel",                                                                      kategoriler: ["tumu"] },
  { etiket: "Doğal Ortam",      aciklama: "Açık havada altın saat ışığında huzurlu sunum.",                           ikon: "Leaf",      goster: "Ürün doğal taş zemin üzerinde, altın saat güneşi soldan sağa kayar, arka planda tek yaprak geçer, huzurlu son sahne",                                                                   deger: "Product sits on a natural stone surface outdoors, warm golden hour sunlight slowly shifts across the frame from left to right then settles, one single leaf gently drifts past in background and exits frame, scene becomes peaceful and still",                                           kategoriler: ["tumu"] },
  { etiket: "Detay Tarama",     aciklama: "Kamera yüzeyi tarayarak detayları gösterir.",                              ikon: "Search",    goster: "Kamera ürün yüzeyini soldan sağa yavaş tarar, doku detayları ortaya çıkar, sonra geri çekilerek tam görünüm",                                                                          deger: "Camera slowly tracks across the product surface from left to right revealing textures and details, then pulls back slightly to show full product and holds, clean studio lighting",                                                                                                        kategoriler: ["tumu","elektronik"] },
  { etiket: "Parıltı Reveal",   aciklama: "Altın parçacıklar arasında ürün beliriyor. Kozmetik & parfüm için.",       ikon: "Sparkles",  goster: "Kamera ürüne yaklaşırken altın parçacıklar 3 saniye yavaşça düşer ve solar, ürün odağa gelir, sıcak pembe güzellik ışığı",                                                              deger: "Camera slowly moves in toward the product as soft golden particles drift downward for 3 seconds then fade away, product comes into sharp focus and holds steady, warm pink-toned beauty lighting",                                                                                          kategoriler: ["kozmetik"] },
  { etiket: "Lüks Mermer",      aciklama: "Mermer yüzeyde zarif sunum. Premium kozmetik hissi.",                      ikon: "Gem",       goster: "Ürün beyaz mermer üzerinde, kamera 3 saniyede soldan merkeze kayar, mermer yüzeyde yumuşak yansıma, zarif minimal kompozisyon",                                                          deger: "Product sits on white marble surface, camera slowly pans from left to center over 3 seconds then stops, soft overhead light creates gentle reflection on marble, elegant minimal composition",                                                                                              kategoriler: ["kozmetik","taki"] },
  { etiket: "Tech Reveal",      aciklama: "Koyu arka planda LED vurgulu teknoloji sunumu.",                            ikon: "Cpu",       goster: "Koyu sahne, mavi LED ışık bir anda parlar ve beyaza döner, kamera sağa kayarak ürün profilini açar, koyu arka plan",                                                                        deger: "Dark scene, cool blue accent light glows briefly on one side of the product then fades to warm white, camera smoothly pans right revealing the product profile, then holds steady, dark background",                                                                                       kategoriler: ["elektronik"] },
  { etiket: "Kumaş Hareketi",   aciklama: "Hafif rüzgar kumaşı oynatır. Giyim & tekstil için.",                       ikon: "Wind",      goster: "Hafif esinti kumaşı doğal şekilde hareket ettirir, döküm ve sarkma oluşturur, sonra yerleşir, soldaki stüdyo ışığı, sabit kamera",                                                                 deger: "Soft breeze gently moves the fabric creating natural drape movement, then fabric settles smoothly into place, clean studio lighting from the left, camera stays steady on tripod",                                                                                           kategoriler: ["giyim"] },
  { etiket: "Lezzet Çekimi",    aciklama: "Üstten aşağı çekim, sıcak buhar efekti. Gıda için.",                      ikon: "Utensils",  goster: "Kamera sıcak ahşap yüzeydeki ürünün tam üstünden yavaş iner, hafif buhar çıkar ve dağılır, altın iştah açıcı ışıklandırma",                                                               deger: "Camera slowly descends from directly above looking down at the product on warm wooden surface, gentle wisp of steam rises briefly then dissipates, warm appetizing golden lighting, scene becomes still",                                                                                    kategoriler: ["gida"] },
  { etiket: "Taze His",         aciklama: "Doğal ışıkta taze ve organik sunum.",                                      ikon: "Sprout",    goster: "Ürünün yanında küçük yeşil ot dalı, doğal gün ışığı 2 saniyede parlar, taze minimal kompozisyon, yüzeyde tek su damlası",                                                                 deger: "Product on light surface with small green herb sprig beside it, soft natural daylight slowly brightens over 2 seconds then holds steady, fresh clean minimal composition, one water droplet visible on surface",                                                                           kategoriler: ["gida"] },
  { etiket: "Işıltı Dönüş",    aciklama: "Spotlight altında yavaş dönüş, pırıltı yansımaları.",                      ikon: "Star",      goster: "Ürün koyu kadife üzerinde 90° döner, tek spot ışık yüzeyde pırıltılar oluşturur, sonra yerleşir, lüks koyu arka plan",                                                                      deger: "Product on dark velvet surface rotates slowly 90 degrees, single spotlight creates sparkle reflections that shimmer across facets, then product settles and reflections calm, luxurious dark background",                                                                                   kategoriler: ["taki"] },
  { etiket: "Neşeli Sunum",     aciklama: "Renkli ve eğlenceli, çocuk ürünleri için.",                                ikon: "Gift",      goster: "Ürün yumuşak zemine hafifçe sekerler ve yerleşir, 3 renkli konfeti parçası kısa süre yağar ve kaybolur, neşeli stüdyo ışığı",                                                               deger: "Product bounces lightly once on soft surface and settles into place with a gentle wobble, 3 small colorful confetti pieces drift down briefly then scene clears, bright cheerful even studio lighting",                                                                                    kategoriler: ["cocuk"] },
  { etiket: "Dinamik Reveal",   aciklama: "Enerjik ve hızlı, spor ürünleri için.",                                    ikon: "Zap",       goster: "Dinamik kamera itiş ve geri çekiliş 3 saniyede tam görünümü açar, hareket bulanıklığı keskin odağa döner, enerjik stüdyo ışığı",                                                             deger: "Quick dynamic camera push toward the product then pulls back smoothly to reveal full view over 3 seconds, motion blur at start clears to sharp focus, energetic bright studio lighting, clean background",                                                                                  kategoriler: ["spor"] },
];

// ─── Kategori kodu hesapla ────────────────────────────────────────────────────

export function kategoriKoduHesapla(kategori: string): string | null {
  const k = (kategori || "").toLowerCase();
  if (/kozmetik|parfüm|cilt|bakım|makyaj|serum|krem|şampuan/i.test(k))            return "kozmetik";
  if (/elektron|telefon|bilgisayar|tablet|kulaklık|şarj|kamera|tv|monitör/i.test(k)) return "elektronik";
  if (/giyim|ayakkabı|çanta|elbise|tişört|pantolon|ceket|kazak|gömlek|bot|sneaker/i.test(k)) return "giyim";
  if (/gıda|yiyecek|içecek|kahve|çay|bal|zeytinyağı|baharat|atıştırmalık/i.test(k)) return "gida";
  if (/ev|mutfak|dekor|mobilya|aydınlatma|halı|perde|tencere|bardak/i.test(k))    return "ev";
  if (/spor|fitness|outdoor|kamp|bisiklet|yoga|koşu|dağ/i.test(k))                return "spor";
  if (/çocuk|bebek|oyuncak|mama|biberon/i.test(k))                                return "cocuk";
  if (/takı|mücevher|yüzük|kolye|bilezik|küpe/i.test(k))                          return "taki";
  return null;
}

export const KATEGORI_LISTESI = [
  "Kozmetik & Kişisel Bakım",
  "Elektronik & Aksesuar",
  "Giyim & Moda",
  "Ev & Yaşam",
  "Gıda & İçecek",
  "Takı & Aksesuar",
  "Spor & Outdoor",
  "Bebek & Çocuk",
  "Kitap & Kırtasiye",
  "Oto & Bahçe",
  "Diğer",
] as const;
