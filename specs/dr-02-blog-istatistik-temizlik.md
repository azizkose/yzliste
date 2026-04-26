# DR-02: Blog Kaynaksız İstatistik Temizliği + İçerik Kuralları

**Durum:** Açık
**Öncelik:** P0
**Tahmini süre:** 1-2 saat
**Kural:** Önce planı göster, onay al, sonra uygula.

---

## Blog içerik kuralı (kalıcı — CLAUDE.md'ye de eklenecek)

Blog yazılarında şu ifadeler YASAK:

1. **Kaynaksız istatistik/yüzde:** "%60", "%30", "%70", "yüzde X" gibi rakamlar kaynak dipnotsuz kullanılamaz
2. **Abartılı satış iddiaları:** "satışları katla", "X kat artır", "10 kat", "katlama"
3. **Kanıtsız üstünlük iddiaları:** "en çok", "en iyi", "en popüler", "en gelişmiş", "1 numara"
4. **Subjektif kalite iddiaları:** "stüdyo kalitesinde", "profesyonel kalitede" (kanıtsız bağlamda)
5. **Garantili sonuç iddiaları:** "kesin artış", "garantili dönüşüm"

**Alternatifler:**
- Rakam yerine nitel dil: "ciddi oranda", "belirgin şekilde", "önemli ölçüde"
- Kaynak varsa dipnot ekle: "(Kaynak: Baymard Institute, 2024)"
- Üstünlük yerine tavsiye: "en popüler" → "önerilen"

---

## Düzeltilecek 3 yazı

### 1. /blog/e-ticarette-gorsel-kalitenin-satis-etkisi

Sorunlu ifade: "Düşük kaliteli görseller satışı yüzde 60'a kadar düşürebilir"

- [ ] Kaynak ara: Baymard Institute, Forrester, Shopify raporları — "product image quality conversion" araması
- [ ] Kaynak bulunursa → dipnot ekle: "(Kaynak: [Kaynak adı], [yıl])"
- [ ] Kaynak bulunamazsa → "Düşük kaliteli görseller dönüşüm oranını ciddi oranda düşürebilir"
- [ ] Yazıdaki başka kaynaksız istatistik varsa aynı kurala tabi tut

### 2. /blog/musteri-yorumlari-satis-etkisi-yonetim-rehberi

Sorunlu ifade: "Olumsuz yorumlar satışı yüzde 30'a kadar düşürebilir"

- [ ] Kaynak ara: Yotpo, Trustpilot, BrightLocal raporları — "negative reviews sales impact" araması
- [ ] Kaynak bulunursa → dipnot ekle
- [ ] Kaynak bulunamazsa → "Olumsuz yorumlar satış performansını belirgin şekilde olumsuz etkileyebilir"

### 3. /blog/e-ticarette-mobil-optimizasyon-satis-artirma

Sorunlu ifade: "Satışların %70'i Telefondan Geliyor"

- [ ] Kaynak ara: Shopify "State of Commerce" raporu, Google "Think with Google" — "mobile commerce share" araması (bu veri genellikle kolay bulunur)
- [ ] Kaynak bulunursa → dipnot ekle (muhtemelen Statista veya Shopify'dan bulunacak)
- [ ] Kaynak bulunamazsa → "E-ticaret satışlarının büyük çoğunluğu mobil cihazlardan gerçekleşiyor"

---

## Tam blog taraması

Yukarıdaki 3 yazı dışında tüm blog yazılarını tara:

- [ ] `grep -ri "yüzde\|%[0-9]" src/app/blog/ content/ posts/` — kaynaksız rakam var mı?
- [ ] `grep -ri "katla\|kat art\|10 kat\|3 kat" src/app/blog/ content/ posts/` — abartılı iddia var mı?
- [ ] `grep -ri "en iyi\|en çok\|en gelişmiş\|1 numara\|en popüler" src/app/blog/ content/ posts/` — kanıtsız üstünlük var mı?
- [ ] Bulunan her maddeyi aynı kurala göre düzelt

---

## Doğrulama

```bash
# Kaynaksız yüzde kalmadı mı (kaynaklı olanlar hariç)
grep -rn "yüzde 60\|yüzde 30\|%70\|%60\|%30" src/app/blog/ content/ posts/

# "Satışları Katlama" kalmadı mı
grep -ri "katlama\|katla" src/app/blog/ content/ posts/

# Her düzeltilen yerde nitel dil veya kaynak dipnot var mı — manuel kontrol
```
