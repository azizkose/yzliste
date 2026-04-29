# DR-04: Blog İç Link Stratejisi

**Durum:** Açık
**Öncelik:** P2
**Tahmini süre:** 2-3 saat
**Kural:** Önce planı göster, onay al, sonra uygula.

---

## Sorun

39 blog yazısı var ama yazılar arası cross-link neredeyse yok. Her yazıda "yzliste ile dene" CTA var ama ilgili yazılara kontekstsel link yok. SEO açısından iç link matrisi önemli — Google'ın crawl'u derinleşir, kullanıcı sitede daha uzun kalır.

## Yapılacaklar

- [ ] Tüm blog yazılarının listesini çıkar (başlık + kategori + slug)
- [ ] Her yazı için 2-3 ilgili yazı belirle (aynı kategori veya tamamlayıcı konu)
- [ ] Her yazının sonuna "İlgili yazılar" bölümü ekle VEYA yazı içinde doğal bağlamda link ver
- [ ] Link metni doğal olsun: "Trendyol'da listing yazmak hakkında detaylı rehberimize bakın" gibi

## Kurallar

- Her yazıda en az 2, en fazla 4 iç link
- Link metni doğal cümle içinde olsun, "buraya tıklayın" gibi generic anchor text kullanma
- Sadece gerçekten ilgili yazılara link ver — zorla link atma
- CTA ("yzliste ile dene") zaten var, ona dokunma

## Doğrulama

```bash
# Her blog yazısında en az 1 /blog/ linki var mı
grep -r "/blog/" content/ posts/ | grep -v "node_modules"
```
