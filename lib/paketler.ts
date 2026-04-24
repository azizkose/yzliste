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
    renk: "border-[#D8D6CE]",
    butonRenk: "bg-[#1A1A17] hover:bg-[#2C2C29]",
    aciklama: "Birkaç ürün denemek isteyenler için ideal başlangıç noktası.",
    ozellikler: [
      "10 kredi (tüm içerik türlerinde kullan)",
      "Listing metni — 1 kredi / ürün",
      "AI görsel — 1 kredi / stil",
      "Video — 10 kredi (5sn) · 20 kredi (10sn)",
      "Sosyal medya — 1 kredi / platform",
      "Süre sınırı yok · Tüm platformlar",
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
    renk: "border-[#1E4DD8] ring-2 ring-[#1E4DD8]",
    butonRenk: "bg-[#1E4DD8] hover:bg-[#163B9E]",
    rozet: true,
    aciklama: "Aktif satıcılar için en çok tercih edilen paket.",
    ozellikler: [
      "30 kredi (tüm içerik türlerinde kullan)",
      "Listing metni — 1 kredi / ürün",
      "AI görsel — 1 kredi / stil",
      "Video — 10 kredi (5sn) · 20 kredi (10sn)",
      "Sosyal medya — 1 kredi / platform",
      "Süre sınırı yok · Tüm platformlar",
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
    renk: "border-[#D8D6CE]",
    butonRenk: "bg-[#1A1A17] hover:bg-[#2C2C29]",
    aciklama: "Toplu yükleme yapan mağazalar ve profesyonel satıcılar için.",
    ozellikler: [
      "100 kredi (tüm içerik türlerinde kullan)",
      "Listing metni — 1 kredi / ürün",
      "AI görsel — 1 kredi / stil",
      "Video — 10 kredi (5sn) · 20 kredi (10sn)",
      "Sosyal medya — 1 kredi / platform",
      "Süre sınırı yok · Toplu kullanım için en ekonomik",
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
