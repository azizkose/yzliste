# DR-01: Denetim Raporu v2 — Hızlı Düzeltmeler

**Durum:** Açık
**Öncelik:** P0
**Tahmini süre:** 30-45 dk
**Kural:** Önce planı göster, onay al, sonra uygula.

---

## CLAUDE.md hatırlatması

Bu görev denetim raporundan çıkan hızlı düzeltmeleri içerir. Her madde bağımsız, sırayla yap. Bitirmeden önce her maddeyi doğrula.

## Önce oku

- `/CLAUDE.md`
- Bu dosyadaki 6 maddeyi

---

## Yapılacaklar

### 1. Schema.org iade süresi çelişkisi (KRİTİK — 5 dk)

`/fiyatlar` sayfasındaki Product Schema JSON'da `merchantReturnDays: 14` yazıyor. Site politikası (teslimat-iade ve mesafeli-satis sayfaları) 3 gün diyor. Google zengin snippet'te "14 gün iade" gösterir — yanıltıcı reklam riski.

- [ ] `merchantReturnDays` değerini `3` yap VEYA bu alanı tamamen kaldır (Google zorunlu tutmuyor)
- [ ] Mesafeli satış sözleşmesindeki "cayma hakkı yok + 3 gün kullanılmamış kredi iade" ifadesiyle tutarlılığı doğrula

Dosya: muhtemelen `src/app/fiyatlar/page.tsx` içindeki JSON-LD schema

### 2. /hakkimizda pazaryeri listesi tutarsızlığı (5 dk)

Sayfa "Trendyol, Hepsiburada, Amazon TR ve N11" diyor — Etsy ve Amazon USA eksik. Diğer tüm sayfalar 6 platform listeliyor.

- [ ] Metni güncelle: "Trendyol, Hepsiburada, Amazon TR, Amazon USA, N11 ve Etsy gibi yurt içi ve yurt dışı e-ticaret platformlarına özel"
- [ ] Sırayı diğer sayfalardaki ile tutarlı yap

Dosya: `src/app/hakkimizda/page.tsx`

### 3. Blog başlığı — "Satışları Katlama" (5 dk)

`/blog/cross-listing-coklu-pazaryeri-yonetimi` başlığında "Satışları Katlama Rehberi" yazıyor. Yanıltıcı reklam riski (v1'de de işaretlenmişti).

- [ ] Başlık: "Satışları Katlama" → "Satış Hacmini Artırma"
- [ ] Aynı ifade yazı içinde de geçiyorsa orada da düzelt
- [ ] Meta description'da da varsa düzelt

Dosya: ilgili blog MDX/JSON dosyası

### 4. /fiyatlar "En Popüler" rozeti (5 dk)

"En Popüler" kanıtlanmamış iddia. Gerçek veri yok.

- [ ] "En Popüler" → "Önerilen"
- [ ] "en çok tercih edilen paket" ifadesi varsa → "önerilen paket"
- [ ] "en ekonomik" ifadesi varsa → kaldır veya "uygun fiyatlı" yap

Dosya: muhtemelen `src/app/fiyatlar/page.tsx` veya `lib/paketler.ts`

### 5. Blog başlığı — "Stüdyo Kalitesinde" (5 dk)

`/blog/ai-urun-fotografciligi` başlığında "Stüdyo Kalitesinde" subjektif kalite iddiası var.

- [ ] "Stüdyo Kalitesinde" → "Profesyonel Görünümlü" veya sadece kaldır
- [ ] Yazı içinde de geçiyorsa aynı şekilde yumuşat

### 6. Eski blog URL'leri 404 — 301 redirect (15 dk)

Eski URL'ler (örn. `/blog/amazon-a9-algoritmasi-ile-satis-katlama`) 404 dönüyor. Eski backlink'ler ölü.

- [ ] Eski blog slug'larının listesini çıkar (git log'dan veya bilinen URL'lerden)
- [ ] `next.config.js` veya `middleware.ts`'de 301 redirect ekle
- [ ] Bilinen eski URL: `/blog/amazon-a9-algoritmasi-ile-satis-katlama` → en yakın yeni yazıya yönlendir

---

## Doğrulama

```bash
# Schema iade süresi düzeldi mi
grep -r "merchantReturnDays" src/app/fiyatlar/

# /hakkimizda'da 6 platform var mı
grep -r "Etsy" src/app/hakkimizda/

# "Satışları Katlama" kalmadı mı
grep -ri "katlama" src/app/blog/ content/ posts/

# "En Popüler" kalmadı mı
grep -ri "en popüler\|en çok tercih" src/app/fiyatlar/

# "Stüdyo Kalitesinde" kalmadı mı
grep -ri "stüdyo kalite" src/app/blog/ content/ posts/
```
