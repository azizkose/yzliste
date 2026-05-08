import type { Kategori as GorselKategori } from "@/lib/fal/prompts/index"

// METİN ve UI için genişletilmiş üst kategori (9 enum)
export type UstKategori =
  | "giyim"
  | "ayakkabi_canta"
  | "kozmetik"
  | "taki_aksesuar"
  | "ev_dekor"
  | "elektronik"
  | "bebek_oyuncak"
  | "gida_hediye"
  | "diger"

// UI label'ları
export const UST_KATEGORI_LABELS: Record<UstKategori, string> = {
  giyim: "Giyim",
  ayakkabi_canta: "Ayakkabı / Çanta",
  kozmetik: "Kozmetik / Bakım",
  taki_aksesuar: "Takı / Aksesuar",
  ev_dekor: "Ev & Dekor",
  elektronik: "Elektronik",
  bebek_oyuncak: "Bebek & Oyuncak",
  gida_hediye: "Gıda & Hediye",
  diger: "Diğer",
}

// AI prompt'unda kullanılır — kısa label yerine örneklerle zengin açıklama
export const UST_KATEGORI_PROMPT_LABELS: Record<UstKategori, string> = {
  giyim: "Giyim (tişört, gömlek, kazak, elbise, pantolon, ceket, etek, iç giyim, mayo, bikini, spor giyim)",
  ayakkabi_canta: "Ayakkabı/Çanta (ayakkabı, bot, sneakers, sandalet, terlik, topuklu, çanta, sırt çantası, cüzdan, bavul)",
  kozmetik: "Kozmetik/Bakım (krem, serum, parfüm, makyaj, şampuan, saç bakım, vücut losyonu, deodorant, cilt bakım seti)",
  taki_aksesuar: "Takı/Aksesuar (kolye, küpe, yüzük, bilezik, saat, akıllı saat, gözlük, şapka, atkı, kemer)",
  ev_dekor: "Ev & Dekor (mutfak eşyası, tencere, bardak, mum, vazo, çerçeve, halı, yastık, yatak tekstili, banyo tekstili, aydınlatma, saksı)",
  elektronik: "Elektronik (telefon aksesuarı, kulaklık, bluetooth hoparlör, şarj cihazı, powerbank, kılıf, küçük ev aleti, kişisel bakım aleti)",
  bebek_oyuncak: "Bebek & Oyuncak (bebek bakım, biberon, emzik, bebek arabası, oyuncak, eğitici oyuncak, peluş, yapboz, çocuk kitabı)",
  gida_hediye: "Gıda & Hediye (çikolata, kuruyemiş, kahve, çay, reçel, bal, hediye sepeti, hediye kutusu, çiçek, buket)",
  diger: "Diğer (spor aleti, yoga/pilates, outdoor/kamp, bisiklet, evcil hayvan ürünleri, otomotiv aksesuar, ofis/kırtasiye, hobi/sanat, müzik aleti)",
}

// Görsel API'sine fallback map (METİN 9 → GÖRSEL 5)
export const UST_TO_GORSEL_KATEGORI: Record<UstKategori, GorselKategori> = {
  giyim: "giyim",
  ayakkabi_canta: "ayakkabi_canta",
  kozmetik: "kozmetik",
  taki_aksesuar: "taki_aksesuar",
  ev_dekor: "genel",
  elektronik: "genel",
  bebek_oyuncak: "genel",
  gida_hediye: "genel",
  diger: "genel",
}

// Üst kategori → alt kategori listesi
export const ALT_KATEGORI_MAP: Record<UstKategori, string[]> = {
  giyim: [
    "Kadın Tişört", "Erkek Tişört", "Çocuk Tişört",
    "Kadın Gömlek", "Erkek Gömlek",
    "Kadın Elbise", "Kadın Etek", "Kadın Tulum",
    "Kadın Pantolon", "Erkek Pantolon", "Çocuk Pantolon",
    "Kadın Ceket", "Erkek Ceket", "Mont", "Kaban",
    "Kazak", "Hırka", "Sweatshirt", "Eşofman",
    "İç Giyim", "Pijama", "Çorap",
    "Mayo", "Bikini", "Spor Giyim",
    "Polar & Kürk", "Yelek",
  ],
  ayakkabi_canta: [
    "Kadın Ayakkabı", "Erkek Ayakkabı", "Çocuk Ayakkabı",
    "Kadın Bot", "Erkek Bot",
    "Spor Ayakkabı", "Sneakers", "Yürüyüş Ayakkabısı",
    "Sandalet", "Terlik", "Topuklu Ayakkabı", "Loafer",
    "Kadın Çanta", "Erkek Çanta", "Sırt Çantası",
    "El Çantası", "Omuz Çantası", "Cüzdan",
    "Bavul", "Valiz", "Laptop Çantası",
  ],
  kozmetik: [
    "Yüz Bakım", "Yüz Kremi", "Nemlendirici", "Serum",
    "Güneş Kremi", "Maske",
    "Saç Bakım", "Şampuan", "Saç Kremi", "Saç Maskesi", "Saç Boyası",
    "Makyaj", "Fondöten", "Ruj", "Maskara", "Far", "Allık",
    "Parfüm", "Kolonya", "Deodorant",
    "Vücut Bakım", "Duş Jeli", "Losyon", "Sabun",
    "Cilt Bakım Seti",
  ],
  taki_aksesuar: [
    "Kadın Kolye", "Erkek Kolye",
    "Küpe", "Halka Küpe", "Sallantılı Küpe",
    "Yüzük", "Bilezik", "Bileklik", "Halhal",
    "Saat", "Akıllı Saat",
    "Gözlük", "Güneş Gözlüğü", "Optik Çerçeve",
    "Şapka", "Bere", "Atkı", "Kemer",
    "Kravat", "Papyon",
  ],
  ev_dekor: [
    "Mutfak Eşyası", "Tencere/Tava", "Yemek Takımı", "Bardak/Kupa",
    "Kahve/Çay Aksesuarı",
    "Ev Dekor", "Mum", "Vazo", "Çerçeve", "Tablo",
    "Halı/Kilim", "Yastık/Kırlent", "Battaniye",
    "Yatak Tekstili", "Nevresim", "Havlu",
    "Banyo Tekstili",
    "Aydınlatma", "Saksı/Bitki",
  ],
  elektronik: [
    "Telefon Aksesuarı", "Kulaklık", "Bluetooth Hoparlör",
    "Şarj Cihazı", "Powerbank", "Kablo",
    "Tablet/Telefon Kılıfı", "Ekran Koruyucu",
    "Akıllı Ev (priz, lamba)",
    "Küçük Ev Aleti (mikser, blender, tost)",
    "Kişisel Bakım Aleti (saç kurutma, traş makinesi)",
  ],
  bebek_oyuncak: [
    "Bebek Bakım", "Bebek Bezi", "Bebek Şampuanı",
    "Biberon/Emzik", "Mama Sandalyesi",
    "Bebek Arabası", "Oto Koltuğu",
    "Oyuncak", "Eğitici Oyuncak", "Peluş",
    "Yapboz", "Boyama Kitabı",
    "Çocuk Kitabı",
  ],
  gida_hediye: [
    "Çikolata", "Şekerleme",
    "Kuruyemiş", "Kuru Meyve",
    "Kahve", "Çay", "Bitki Çayı",
    "Reçel/Bal", "Zeytinyağı",
    "Hediye Sepeti", "Hediye Kutusu",
    "Çiçek", "Buket", "Saksı Çiçeği",
  ],
  diger: [
    "Spor Aleti", "Yoga/Pilates",
    "Outdoor (kamp, balıkçılık)",
    "Bisiklet/Scooter",
    "Evcil Hayvan (yem, oyuncak, aksesuar)",
    "Otomotiv (aksesuar, bakım)",
    "Ofis/Kırtasiye", "Defter/Ajanda",
    "Hobi/Sanat (boya, fırça, kağıt)",
    "Müzik Aleti",
    "Kitap (roman, dergi, akademik)",
  ],
}

export function getAltKategoriler(ust: UstKategori | null): string[] {
  if (!ust) return []
  return ALT_KATEGORI_MAP[ust] ?? []
}

// Barkod/foto auto-detect: string kategoriden 9 üst kategoriye eşle
export function inferUstKategori(altText: string): UstKategori | null {
  const t = (altText || "").toLowerCase()
  if (/giyim|tişört|gömlek|elbise|pantolon|ceket|kazak|hırka|pijama|mayo|bikini|spor.giy|iç giyim/.test(t)) return "giyim"
  if (/ayakkabı|bot|sandalet|terlik|sneaker|topuklu|loafer|çanta|cüzdan|sırt çantası|bavul|valiz|laptop çantası/.test(t)) return "ayakkabi_canta"
  if (/kozmetik|krem|serum|parfüm|makyaj|şampuan|saç kremi|saç boyası|losyon|deodorant|maske|fondöten|ruj|maskara|cilt bakım/.test(t)) return "kozmetik"
  if (/kolye|küpe|yüzük|bilezik|saat|gözlük|şapka|atkı|kemer|takı|mücevher/.test(t)) return "taki_aksesuar"
  if (/mutfak|tencere|tabak|kupa|dekor|mum|vazo|halı|yastık|battaniye|aydınlatma|saksı|nevresim|havlu/.test(t)) return "ev_dekor"
  if (/telefon|kulaklık|şarj|powerbank|kılıf|elektronik|mikser|blender|saç kurut|hoparlör|akıllı ev/.test(t)) return "elektronik"
  if (/bebek|oyuncak|biberon|emzik|peluş|yapboz|boyama|eğitici|mama sandalyesi/.test(t)) return "bebek_oyuncak"
  if (/çikolata|şekerleme|kuruyemiş|kahve|çay|reçel|bal|zeytinyağı|çiçek|buket|hediye/.test(t)) return "gida_hediye"
  if (/spor|yoga|kamp|bisiklet|evcil|otomotiv|ofis|kırtasiye|hobi|kitap|müzik/.test(t)) return "diger"
  return null
}
