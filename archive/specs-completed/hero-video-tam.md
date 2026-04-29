# HERO VIDEO TAM VERSİYON + KIRPMASIZ GÖRÜNTÜLEME

**Durum:** Açık
**Öncelik:** P1

---

## Sorun

Şu an `public/hero-video.mp4` sadece ofisteki kadını gösteren 10 saniyelik kırpılmış versiyon. Overlay yazıları (Listing metni, Ürün görseli, Ürün videosu, Sosyal medya), kutu açan kadın sahnesi ve liman kapanışı yok. Ayrıca video `object-cover` ile kırpılıyor.

## Yapılacaklar

### 1. Video dosyasını değiştir

`yzliste test/hero-video-draft.mp4` → `public/hero-video.mp4` olarak kopyala (eski 10s dosyayı override et).
Yeni: 20sn, 1280x720, 6.6MB, h264, sessiz. 3 sahne + text overlay'ler + liman kapanışı.

### 2. Poster'ı güncelle

```bash
ffmpeg -y -ss 5 -i "yzliste test/hero-video-draft.mp4" -frames:v 1 -q:v 2 public/hero-poster.jpg
```

### 3. CSS: Videoyu kırpmadan göster (`AuthHero.tsx`)

```tsx
// ESKİ (kırpıyor):
<section className="relative overflow-hidden min-h-[80vh] md:min-h-[70vh] lg:aspect-video flex items-center bg-gray-900">
  <img ... className="absolute inset-0 w-full h-full object-cover brightness-[0.4] md:hidden" />
  <video ... className="absolute inset-0 w-full h-full object-cover brightness-[0.4] hidden md:block" />

// YENİ (kırpmaz):
<section className="relative overflow-hidden aspect-video flex items-center bg-gray-900">
  <img ... className="absolute inset-0 w-full h-full object-contain brightness-[0.4] md:hidden" />
  <video ... className="absolute inset-0 w-full h-full object-contain brightness-[0.4] hidden md:block" />
```

Değişiklikler:
- Container: `min-h-[80vh] md:min-h-[70vh] lg:aspect-video` → `aspect-video` (her ekranda 16:9)
- Video + img: `object-cover` → `object-contain` (kırpma yok, video tam görünür)
- `bg-gray-900` kalır

⚠️ Mobil not: `aspect-video` mobilde ~210px yükseklik verir (375px genişlikte). Metinler sığmazsa:
```tsx
<section className="relative overflow-hidden aspect-video min-h-[60vh] sm:min-h-0 flex items-center bg-gray-900">
```

## Test

- [ ] Desktop (1440px+): Video kırpılmadan tam gösteriliyor, 3 sahne + overlay'ler visible
- [ ] Tablet (768px): Video ve metinler dengeli
- [ ] Mobil (375px): Video tam görünüyor, metinler + butonlar sığıyor
- [ ] Video 20 saniyelik loop düzgün dönüyor
- [ ] Poster (mobilde) overlay yazıları gösteriyor

**Dosyalar:** `components/tanitim/AuthHero.tsx`, `public/hero-video.mp4`, `public/hero-poster.jpg`
