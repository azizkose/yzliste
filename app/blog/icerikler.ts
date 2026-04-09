import { trendyolListingNasilYazilir } from "./posts/trendyol-listing-nasil-yazilir";
import { aiGorselUretimi } from "./posts/ai-gorsel-uretimi-e-ticaret";
import { etsyListingIngilizce } from "./posts/etsy-listing-ingilizce-nasil-yazilir";

export type BlogYazisi = {
  slug: string;
  baslik: string;
  ozet: string; // 150-160 karakter — meta description olarak kullanılır
  yayinTarihi: string; // ISO 8601: "2026-03-15"
  guncellemeTarihi?: string;
  yazarAdi: string;
  okumaSuresi: number; // dakika
  kategori: string;
  etiketler: string[];
  kapakGorsel?: string; // /blog/ altında bir dosya yolu
  icerik: BlogBolum[]; // yazının bölümleri
};

export type BlogBolum = {
  tip: "giris" | "baslik" | "paragraf" | "liste" | "bilgi-kutusu" | "sonuc";
  baslik?: string; // "baslik" tipi için
  metin?: string; // "paragraf", "giris", "bilgi-kutusu", "sonuc" için
  maddeler?: string[]; // "liste" tipi için
};

// YENİ YAZILARI EKLEMEK İÇİN:
// 1. app/blog/posts/ klasörüne {slug}.ts dosyası oluştur
// 2. BlogYazisi objesini export et (const adı camelCase)
// 3. Burada import et ve yazilar dizisine ekle

export const yazilar: BlogYazisi[] = [
  trendyolListingNasilYazilir,
  aiGorselUretimi,
  etsyListingIngilizce,
];

// Slug'a göre tek yazı döndür
export function yaziGetir(slug: string): BlogYazisi | undefined {
  return yazilar.find((y) => y.slug === slug);
}

// Kategori listesi
export function kategoriler(): string[] {
  return [...new Set(yazilar.map((y) => y.kategori))];
}
