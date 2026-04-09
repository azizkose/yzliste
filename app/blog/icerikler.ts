import { loadBlogPostsFromMarkdown } from "@/lib/blog-parser";

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
// 1. app/blog/posts/ klasörüne {slug}.md dosyası oluştur
// 2. DETAYLI_SABLON.md'yi rehber olarak kullan
// 3. Metadata + içerik doldur
// 4. Bana gönder — otomatik parse edilip siteye eklenecek

/**
 * Tüm blog yazılarını app/blog/posts/*.md dosyalarından yükle
 * Build-time'da cached, ISR ile 1 saat sonra revalidate
 */
export async function getYazilar(): Promise<BlogYazisi[]> {
  return await loadBlogPostsFromMarkdown();
}

/**
 * Slug'a göre tek yazı döndür
 */
export async function yaziGetir(slug: string): Promise<BlogYazisi | undefined> {
  const yazilar = await getYazilar();
  return yazilar.find((y) => y.slug === slug);
}

/**
 * Kategori listesi
 */
export async function kategoriler(): Promise<string[]> {
  const yazilar = await getYazilar();
  return [...new Set(yazilar.map((y) => y.kategori))];
}
