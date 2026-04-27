/**
 * FY-01: Fiyat artışı doğrulama testleri — 49/129/299 TL
 * Her iki yerde de (UI kaynağı + ödeme API kaynağı) tek kaynak: lib/paketler.ts
 */
import { describe, it, expect } from "vitest";
import { PAKETLER, PAKET_LISTESI, MIN_FIYAT, MAX_FIYAT } from "@/lib/paketler";

describe("FY-01: Paket fiyatları", () => {
  it("Başlangıç paketi 49 TL / 10 kredi olmalı", () => {
    expect(PAKETLER.baslangic.fiyat).toBe(49);
    expect(PAKETLER.baslangic.fiyatStr).toBe("₺49");
    expect(PAKETLER.baslangic.kredi).toBe(10);
    expect(PAKETLER.baslangic.krediStr).toBe("10 kredi");
  });

  it("Popüler paketi 129 TL / 30 kredi olmalı", () => {
    expect(PAKETLER.populer.fiyat).toBe(129);
    expect(PAKETLER.populer.fiyatStr).toBe("₺129");
    expect(PAKETLER.populer.kredi).toBe(30);
    expect(PAKETLER.populer.krediStr).toBe("30 kredi");
  });

  it("Büyük paketi 299 TL / 100 kredi olmalı", () => {
    expect(PAKETLER.buyuk.fiyat).toBe(299);
    expect(PAKETLER.buyuk.fiyatStr).toBe("₺299");
    expect(PAKETLER.buyuk.kredi).toBe(100);
    expect(PAKETLER.buyuk.krediStr).toBe("100 kredi");
  });

  it("MIN_FIYAT ve MAX_FIYAT doğru olmalı", () => {
    expect(MIN_FIYAT).toBe(49);
    expect(MAX_FIYAT).toBe(299);
  });

  it("PAKET_LISTESI sıralanmış ve 3 paket içermeli", () => {
    expect(PAKET_LISTESI).toHaveLength(3);
    expect(PAKET_LISTESI[0].id).toBe("baslangic");
    expect(PAKET_LISTESI[1].id).toBe("populer");
    expect(PAKET_LISTESI[2].id).toBe("buyuk");
  });

  it("Tüm paketlerde kredi başına fiyat azalıyor olmalı (hacim indirimi)", () => {
    const birimFiyatlar = PAKET_LISTESI.map((p) => p.fiyat / p.kredi);
    for (let i = 1; i < birimFiyatlar.length; i++) {
      expect(birimFiyatlar[i]).toBeLessThan(birimFiyatlar[i - 1]);
    }
  });

  it("isimApi değerleri özel karakter içermemeli (iyzico uyumluluğu)", () => {
    for (const paket of PAKET_LISTESI) {
      expect(paket.isimApi).toMatch(/^[a-zA-Z0-9 ]+$/);
    }
  });

  it("fiyatStr değerleri fiyat sayısal değeriyle örtüşmeli", () => {
    for (const paket of PAKET_LISTESI) {
      const sayisal = parseInt(paket.fiyatStr.replace("₺", ""), 10);
      expect(sayisal).toBe(paket.fiyat);
    }
  });

  it("krediStr değerleri kredi sayısal değeriyle örtüşmeli", () => {
    for (const paket of PAKET_LISTESI) {
      const sayisal = parseInt(paket.krediStr.split(" ")[0], 10);
      expect(sayisal).toBe(paket.kredi);
    }
  });
});

describe("FY-01: Ödeme API — tutar doğruluğu", () => {
  it("Ödeme API'sinin okuduğu tutarlar doğru olmalı", () => {
    // api/odeme/route.ts şu ifadeyi kullanır:
    // tutar: PAKET_TANIM.baslangic.fiyat
    // Bu test, kaynak değerin doğruluğunu güvence altına alır.
    const odemeMap: Record<string, { kredi: number; tutar: number }> = {
      baslangic: { kredi: PAKETLER.baslangic.kredi, tutar: PAKETLER.baslangic.fiyat },
      populer:   { kredi: PAKETLER.populer.kredi,   tutar: PAKETLER.populer.fiyat   },
      buyuk:     { kredi: PAKETLER.buyuk.kredi,      tutar: PAKETLER.buyuk.fiyat     },
    };

    expect(odemeMap.baslangic.tutar).toBe(49);
    expect(odemeMap.populer.tutar).toBe(129);
    expect(odemeMap.buyuk.tutar).toBe(299);

    // iyzico price string formatı: toFixed(2)
    expect(odemeMap.baslangic.tutar.toFixed(2)).toBe("49.00");
    expect(odemeMap.populer.tutar.toFixed(2)).toBe("129.00");
    expect(odemeMap.buyuk.tutar.toFixed(2)).toBe("299.00");
  });
});
