# LP-08: Header'a "Araçlar" Dropdown Menü + FeaturesTabbed CTA + Zenginleştirme

**Durum:** Kısmen yapıldı (dropdown var, hero kartları ve CTA kısmı açık)
**Öncelik:** P1
**Tahmini süre:** 2-3 saat

---

## A) AuthHero'daki 4 aksiyon kartını kaldır, değer önermeleri ekle

Hero'nun işi artık "ne yapıyoruz" değil "neden biz" olmalı — araçlar dropdown'da ve FeaturesTabbed'de zaten var.

- [ ] KARTLAR dizisini ve grid'ini kaldır
- [ ] Yerine 4 değer önermesi badge'i ekle (video üstünde okunabilir, yarı-saydam arka plan):
  - Yazılım kurulumu veya entegrasyon yok — tarayıcıdan kullan
  - Aylık abonelik yok — sadece kullandığın kadar öde
  - 7 pazaryerinin kurallarını bilir — platforma özel üretir
  - Prompt yazmana gerek yok — formu doldur, butona bas
- [ ] İkinci CTA'yı değiştir: "Hemen Dene →" → "Araçları İncele ↓" (href="/#araclar", scroll to FeaturesTabbed)

## B) FeaturesTabbed'e anchor ID'ler + CTA butonları ekle

1. Section'a `id="araclar"` ekle
2. Her sekme içeriğinin sonuna CTA butonu ekle:
   - Sekme 0: "Listing Metni Üret →" → `/uret?tab=metin`
   - Sekme 1: "Stüdyo Görseli Üret →" → `/uret?tab=gorsel`
   - Sekme 2: "Ürün Videosu Üret →" → `/uret?tab=video`
   - Sekme 3: "Sosyal İçerik Üret →" → `/uret?tab=sosyal`
3. FeaturesTabbed, URL hash'i dinlesin (`#arac-metin` → sekme 0, vb.)

## Test

- [ ] Dropdown'da "Detaylar" tıkla → FeaturesTabbed'e scroll + ilgili sekme açılır
- [ ] FeaturesTabbed her sekmede CTA butonu var → doğru `/uret?tab=X`'e gider
- [ ] Hero'da değer önermeleri badge'leri görünür
- [ ] Sayfada olmayan bir yerden "Detaylar" tıklayınca → ana sayfaya gidip scroll eder

## Claude Code promptu

```
LP-08: Hero değer önermeleri + FeaturesTabbed CTA
specs/lp-08.md dosyasını oku ve uygula:
1. AuthHero'dan KARTLAR grid'ini kaldır, 4 değer önermesi badge ekle
2. İkinci CTA'yı "Araçları İncele ↓" yap (scroll to #araclar)
3. FeaturesTabbed'e id="araclar" + her sekmeye CTA butonu + hash listener
```

**Dosyalar:** `components/tanitim/AuthHero.tsx`, `components/tanitim/FeaturesTabbed.tsx`, `app/_tanitim.tsx`
