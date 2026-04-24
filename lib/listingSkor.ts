export type ListingSkorSonucu = {
  skor: number;
  oneriler: string[];
  detay: { kural: string; puan: number; maksimum: number }[];
};

const PLATFORM_LIMIT: Record<string, { baslik: number; ozellik: number; aciklama: number; etiket: number }> = {
  trendyol:    { baslik: 100, ozellik: 5,  aciklama: 150, etiket: 10 },
  hepsiburada: { baslik: 150, ozellik: 5,  aciklama: 150, etiket: 10 },
  amazon:      { baslik: 200, ozellik: 5,  aciklama: 150, etiket: 0  },
  n11:         { baslik: 100, ozellik: 5,  aciklama: 150, etiket: 8  },
  etsy:        { baslik: 140, ozellik: 0,  aciklama: 150, etiket: 13 },
  amazon_usa:  { baslik: 200, ozellik: 5,  aciklama: 150, etiket: 0  },
};

export function listingSkorHesapla(params: {
  icerik: string;
  platform: string;
  urunAdi?: string;
  kategori?: string;
  ozellikler?: string;
  anahtarKelimeler?: string;
  fotolarVar?: boolean;
}): ListingSkorSonucu {
  const { icerik, platform, urunAdi, kategori, ozellikler, anahtarKelimeler, fotolarVar } = params;
  const limit = PLATFORM_LIMIT[platform] ?? PLATFORM_LIMIT.trendyol;
  const icerikLower = icerik.toLowerCase();

  const detay: ListingSkorSonucu["detay"] = [];
  const oneriler: string[] = [];

  // 1. Başlık uzunluğu (0-15)
  const baslikMatch = icerik.match(/(?:BAŞLIK:|BASLIK:|TITLE:)\s*\n?(.+)/i);
  const baslik = baslikMatch?.[1]?.trim() ?? "";
  const baslikUzunluk = baslik.length;
  let baslikPuan = 0;
  if (baslikUzunluk > 0) {
    const oran = baslikUzunluk / limit.baslik;
    if (oran >= 0.85) baslikPuan = 15;
    else if (oran >= 0.6) baslikPuan = 10;
    else if (oran >= 0.3) baslikPuan = 5;
    else baslikPuan = 2;
  }
  detay.push({ kural: "Başlık uzunluğu", puan: baslikPuan, maksimum: 15 });

  // 2. Özellik/madde sayısı (0-15)
  const maddelar = (icerik.match(/^•\s/gm) ?? []).length;
  let ozellikPuan = 0;
  if (limit.ozellik > 0) {
    if (maddelar >= limit.ozellik) ozellikPuan = 15;
    else if (maddelar >= 3) ozellikPuan = 10;
    else if (maddelar >= 1) ozellikPuan = 5;
  } else {
    ozellikPuan = 15; // platform özellik gerektirmiyorsa tam puan
  }
  detay.push({ kural: "Özellik/madde sayısı", puan: ozellikPuan, maksimum: 15 });

  // 3. Açıklama uzunluğu (0-10)
  const aciklamaMatch = icerik.match(/(?:AÇIKLAMA:|ACIKLAMA:|DESCRIPTION:)\s*\n?([\s\S]*?)(?:\n[A-ZÜŞĞÇÖI🏷📌🔹]+[:\s]|$)/i);
  const aciklama = aciklamaMatch?.[1]?.trim() ?? "";
  const aciklamaPuan = aciklama.length >= limit.aciklama ? 10 : aciklama.length >= 80 ? 6 : aciklama.length > 0 ? 3 : 0;
  detay.push({ kural: "Açıklama uzunluğu", puan: aciklamaPuan, maksimum: 10 });

  // 4. Etiket sayısı (0-10)
  let etiketPuan = 0;
  if (limit.etiket > 0) {
    const etiketMatch = icerik.match(/(?:ETİKETLER:|ETIKETLER:|TAGS:)\s*\n?(.+)/i);
    const etiketler = etiketMatch?.[1]?.split(/[,،]/)?.filter(e => e.trim().length > 0) ?? [];
    if (etiketler.length >= limit.etiket) etiketPuan = 10;
    else if (etiketler.length >= Math.floor(limit.etiket * 0.7)) etiketPuan = 7;
    else if (etiketler.length >= 3) etiketPuan = 4;
    else if (etiketler.length > 0) etiketPuan = 2;
  } else {
    etiketPuan = 10;
  }
  detay.push({ kural: "Etiket sayısı", puan: etiketPuan, maksimum: 10 });

  // 5. Anahtar kelime kullanımı (0-10)
  let keywordPuan = 0;
  if (anahtarKelimeler && anahtarKelimeler.trim()) {
    const keywords = anahtarKelimeler.split(/[,\s]+/).filter(k => k.trim().length > 2);
    const bulunan = keywords.filter(k => icerikLower.includes(k.toLowerCase().trim()));
    const oran = keywords.length > 0 ? bulunan.length / keywords.length : 0;
    keywordPuan = Math.round(oran * 10);
    if (keywords.length > 0 && bulunan.length < keywords.length) {
      oneriler.push("Anahtar kelimelerini içeriğe ekle — arama sonuçlarında öne çıkarsın");
    }
  } else {
    keywordPuan = 10; // keyword girilmemişse bu kural skip
  }
  detay.push({ kural: "Anahtar kelime kullanımı", puan: keywordPuan, maksimum: 10 });

  // 6. Ürün detay zenginliği (0-20) — renk, malzeme, boyut, adet, ağırlık, garanti
  const detayKontroller = [
    { kelimeler: ["renk", "color", "renkl", "lacivert", "beyaz", "siyah", "kırmızı", "mavi", "yeşil", "sarı", "gri", "pembe"], oneri: "Ürünün rengini ekle — alıcılar renk bilgisi arar" },
    { kelimeler: ["malzeme", "kumaş", "çelik", "ahşap", "plastik", "pamuk", "deri", "metal", "cam", "porselen", "materyal", "material", "cotton", "steel", "leather"], oneri: "Malzeme bilgisi ekle — %100 pamuk, paslanmaz çelik vb." },
    { kelimeler: ["cm", "mm", "boyut", "ölçü", "uzunluk", "genişlik", "yükseklik", "size", "inch", "ml", "lt", "litre", "gr", "kg", "gram", "kilogram"], oneri: "Boyut veya ağırlık bilgisi ekle — 500ml, 3'lü set vb." },
    { kelimeler: ["adet", "set", "paket", "takım", "piece", "pack", "kit", "çift"], oneri: "Adet veya set bilgisi ekle" },
    { kelimeler: ["ağırlık", "hafif", "weight", "gram", "kilogram", "kg", "gr"], oneri: null },
    { kelimeler: ["garanti", "warranty", "guarantee", "ay", "yıl garanti"], oneri: null },
  ];

  let zenginlikPuan = 0;
  const birlesikMetin = `${icerikLower} ${(ozellikler ?? "").toLowerCase()} ${(urunAdi ?? "").toLowerCase()}`;
  for (const kontrol of detayKontroller) {
    if (kontrol.kelimeler.some(k => birlesikMetin.includes(k))) {
      zenginlikPuan += 4;
    } else if (kontrol.oneri) {
      oneriler.push(kontrol.oneri);
    }
  }
  zenginlikPuan = Math.min(zenginlikPuan, 20);
  detay.push({ kural: "Ürün detay zenginliği", puan: zenginlikPuan, maksimum: 20 });

  // 7. Kategori uyumu (0-10)
  let kategoriPuan = 0;
  if (kategori && kategori.trim().length > 0) {
    const kategoriKelimeler = kategori.toLowerCase().split(/[\s,&/]+/).filter(k => k.length > 2);
    const kategoriBulunan = kategoriKelimeler.some(k => icerikLower.includes(k));
    kategoriPuan = kategoriBulunan ? 10 : 5; // kategori seçilmişse en az 5 (girilen bilgi var)
  } else {
    oneriler.push("Kategori seç — platform doğru kategoriye yerleştirir, arama görünürlüğü artar");
  }
  detay.push({ kural: "Kategori uyumu", puan: kategoriPuan, maksimum: 10 });

  // 8. Fotoğraf kullanımı (0-10)
  const fotoPuan = fotolarVar ? 10 : 0;
  if (!fotolarVar) oneriler.push("Fotoğraf ekle — metin kalitesi önemli ölçüde artar");
  detay.push({ kural: "Fotoğraf kullanımı", puan: fotoPuan, maksimum: 10 });

  const skor = detay.reduce((acc, d) => acc + d.puan, 0);

  // Tekrar eden önerileri temizle
  const teksilOneri = [...new Set(oneriler)];

  return { skor, oneriler: teksilOneri, detay };
}
