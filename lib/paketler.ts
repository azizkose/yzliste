/**
 * TEK KAYNAKLı FİYAT TANIMLAMALARI
 * Fiyat değişikliği için sadece bu dosyayı güncelle.
 * Tüm sayfalar, modal'lar ve ödeme API'si buradan çeker.
 */

export type PaketId = "baslangic" | "populer" | "buyuk";

export interface Paket {
  id: PaketId;
  isim: string;           // TR arayüz adı
  isimApi: string;        // iyzico'ya gönderilen ad (özel karakter yok)
  fiyat: number;          // ₺ tutar (sayısal)
  fiyatStr: string;       // Arayüz gösterimi, örn: "₺39"
  kredi: number;          // Kredi miktarı
  krediStr: string;       // Örn: "10 kredi"
  renk: string;           // Tailwind border sınıfı
  butonRenk: string;      // Tailwind buton sınıfı
  rozet?: boolean;        // "En Popüler" rozeti
  aciklama: string;       // Kısa açıklama
  ozellikler: string[];   // Özellik listesi (fiyatlar sayfası)
}

export const PAKETLER: Record<PaketId, Paket> = {
  baslangic: {
    id: "baslangic",
    isim: "Başlangıç",
    isimApi: "Baslangic Paketi",
    fiyat: 49,
    fiyatStr: "₺49",
    kredi: 10,
    krediStr: "10 kredi",
    renk: "border-gray-200",
    butonRenk: "bg-gray-800 hover:bg-gray-900",
    aciklama: "Birkaç ürün denemek isteyenler için ideal başlangıç noktası.",
    ozellikler: [
      "10 kredi (tüm içerik türlerinde kullan)",
      "📝 Listing metni — 1 kredi / ürün",
      "📷 AI görsel — 1 kredi / stil",
      "🎬 Video — 10 kredi (5sn) · 20 kredi (10sn)",
      "📱 Sosyal medya — 1 kredi / platform",
      "✅ Süre sınırı yok · Tüm platformlar",
    ],
  },
  populer: {
    id: "populer",
    isim: "Popüler",
    isimApi: "Populer Paket",
    fiyat: 129,
    fiyatStr: "₺129",
    kredi: 30,
    krediStr: "30 kredi",
    renk: "border-indigo-400 ring-2 ring-indigo-400",
    butonRenk: "bg-indigo-500 hover:bg-indigo-600",
    rozet: true,
    aciklama: "Aktif satıcılar için en çok tercih edilen paket.",
    ozellikler: [
      "30 kredi (tüm içerik türlerinde kullan)",
      "📝 Listing metni — 1 kredi / ürün",
      "📷 AI görsel — 1 kredi / stil",
      "🎬 Video — 10 kredi (5sn) · 20 kredi (10sn)",
      "📱 Sosyal medya — 1 kredi / platform",
      "✅ Süre sınırı yok · Tüm platformlar",
    ],
  },
  buyuk: {
    id: "buyuk",
    isim: "Büyük",
    isimApi: "Buyuk Paket",
    fiyat: 299,
    fiyatStr: "₺299",
    kredi: 100,
    krediStr: "100 kredi",
    renk: "border-gray-200",
    butonRenk: "bg-gray-800 hover:bg-gray-900",
    aciklama: "Toplu yükleme yapan mağazalar ve profesyonel satıcılar için.",
    ozellikler: [
      "100 kredi (tüm içerik türlerinde kullan)",
      "📝 Listing metni — 1 kredi / ürün",
      "📷 AI görsel — 1 kredi / stil",
      "🎬 Video — 10 kredi (5sn) · 20 kredi (10sn)",
      "📱 Sosyal medya — 1 kredi / platform",
      "✅ Süre sınırı yok · Toplu kullanım için en ekonomik",
    ],
  },
};

/** Dizi olarak (sıralı kullanım için) */
export const PAKET_LISTESI: Paket[] = [
  PAKETLER.baslangic,
  PAKETLER.populer,
  PAKETLER.buyuk,
];

/** En düşük fiyat (layout JSON-LD, hero metni vb. için) */
export const MIN_FIYAT = PAKETLER.baslangic.fiyat;

/** En yüksek fiyat (layout JSON-LD için) */
export const MAX_FIYAT = PAKETLER.buyuk.fiyat;
