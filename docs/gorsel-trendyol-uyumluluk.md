# yzliste — Trendyol Görsel Standardı Uyumluluk

> **Pipeline:** V2.2 composite (Sharp + flux-schnell)
> **Tarih:** 6 May 2026

## Trendyol resmi kuralları — yzliste karşılaştırması

| Kural | Trendyol gereksinimi | yzliste V2.2 | Mekanizma |
|---|---|---|---|
| Zemin rengi | RGB (255, 255, 255) saf beyaz | ✅ Garantili | Sharp programatik `{r:255,g:255,b:255}` |
| Min boyut | 1200×1200 px | ✅ 1500×1500 | `safeShotSize = Math.max(shotSize, 1500)` |
| Önerilen boyut | 2000×2000 px | ⚠️ Şimdilik 1500×1500 | İhtiyaç halinde artırılabilir |
| Ürün doluluk | %80+ | ✅ %85 | `prepareCanvas(productFillRatio: 0.85)` |
| Tek ürün | Zorunlu | ✅ | Composite tek katman |
| Drop shadow | Kabul edilir | ✅ Subtle | Sharp blur 18px, %22 opacity, Y+20px |
| Watermark yok | Zorunlu | ✅ | Hiç yok |
| Format | JPEG tercih | ✅ | `quality: 92` |
| Color profile | sRGB | ✅ | Sharp default |
| Arka plan gradient/gölge | Yasak (beyaz stilde) | ✅ | Programatik saf beyaz, gradient yok |

## V2.2 stiller

| Stil | Arka plan | Maliyet/görsel | Trendyol |
|---|---|---|---|
| beyaz | #FFFFFF Sharp programatik | ~$0.01 (sadece RMBG) | ✅ Tam uyumlu |
| koyu | #1A1A1A Sharp programatik | ~$0.01 | Lifestyle görseli için uygun |
| lifestyle | flux-schnell interior sahne | ~$0.013 | Ek görsel için OK |
| mermer | flux-schnell marble sahne | ~$0.013 | Premium ürün için |
| ahsap | flux-schnell wood sahne | ~$0.013 | Doğal ürünler için |
| gradient | flux-schnell gradient | ~$0.013 | Sosyal medya için |
| dogal | flux-schnell outdoor | ~$0.013 | Outdoor/lifestyle için |

## Trendyol'a gönderim için önerilen akış

1. Kullanıcı **Beyaz** stili seçer → yzliste V2.2 → 1500×1500 JPEG, #FFFFFF, %85 doluluk
2. Trendyol panel → Ürün görseli → "Ana görsel" olarak yükle
3. Kontrol: Trendyol otomatik reddetmiyorsa (zemin beyaz kontrol) başarılı

## Bilinen sınırlamalar

- **Askı sorunu:** RMBG (`bria/background/remove`) kıyafet + askıyı tek nesne görüyorsa askı kalmaya devam eder. `rmbgZayıf: true` → Sentry warning. GORSEL-V2.1.2'de çözülecek.
- **1500×1500 sabit:** Kullanıcı dikey ürün gönderirse output kare olabilir. İleride aspect-aware safeShotSize.
- **flux-schnell kalitesi:** Lifestyle/mermer sahneler 4-step inference ile üretilir, premium kalite değil. A/B test planlandı (GORSEL-V2.2.3).
