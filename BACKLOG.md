# yzliste Backlog

Aşama: pre-traffic. Demo hazırlığı — içerik kalitesi 1 numara öncelik.
Claude Code için: **AŞAĞIDAKİ ACİL BLOK EN ÖNCELİKLİ.** Sonra KÜME 0 devam.

---

## ✅ HERO VIDEO — Ana Sayfa Arka Plan Video (19 Nisan 2026) — DONE abe1656

Video dosyası hazır: `public/hero-video.mp4` olarak eklenecek (20sn, 720p, 6.5MB, h264, sessiz).
Kaynak: `yzliste test/hero-video-draft.mp4` — bu dosyayı `public/hero-video.mp4` olarak kopyala.

### Yerleşim: Opsiyon B — Video arka plan
Mevcut AuthHero bileşenini (veya `_tanitim.tsx` hero bölümünü) şu şekilde değiştir:

**Yapı:**
```tsx
<section className="relative overflow-hidden">
  {/* Arka plan video */}
  <video
    autoPlay loop muted playsInline
    className="absolute inset-0 w-full h-full object-cover brightness-[0.4]"
    src="/hero-video.mp4"
  />
  
  {/* İçerik overlay */}
  <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-24 md:py-32">
    {/* Badge'ler */}
    <div className="flex gap-2 flex-wrap justify-center mb-4">
      <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/30 text-indigo-200">
        Trendyol · Hepsiburada · Amazon TR · N11 · Etsy · Amazon USA
      </span>
      <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/30 text-emerald-200">
        🆕 Video + Sosyal Medya
      </span>
    </div>
    
    {/* Başlık */}
    <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4">
      Fotoğraf yükle,<br/>
      <span className="text-indigo-300">pazaryerine hazır içeriğini al</span>
    </h1>
    
    {/* Alt metin */}
    <p className="text-white/80 text-lg max-w-xl mb-1">
      Listing, görsel, video ve sosyal medya — dakikalar içinde, tüm pazaryerleri için.
    </p>
    <p className="text-white/50 text-sm mb-6">
      Entegrasyon yok, yazılım yok — sadece yükle ve al.
    </p>
    
    {/* CTA butonları */}
    <div className="flex gap-3 mb-3">
      <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-7 py-3.5 rounded-xl font-semibold text-base">
        Ücretsiz Başla — 3 Kredi Hediye →
      </button>
      <button className="border-2 border-white text-white hover:bg-white/10 px-7 py-3.5 rounded-xl font-semibold text-base">
        Hemen Dene →
      </button>
    </div>
    <p className="text-white/40 text-xs">Kredi kartı gerekmez</p>
  </div>
</section>
```

**SiteHeader değişikliği:** Video arka planlı hero'da header'ın da transparan olması gerekiyor:
- Hero bölümündeyken: `bg-transparent text-white` (logo beyaz, linkler beyaz/soluk)
- Scroll edince: mevcut `bg-white/90 backdrop-blur` — sticky header olarak kalır
- `sticky top-0 z-40` yapısı korunur, sadece renk koşullu olur (IntersectionObserver veya scroll listener ile)

**Metinler (mevcut → yeni):**
- Başlık: aynı kalıyor ("Fotoğraf yükle, pazaryerine hazır içeriğini al")
- Subtitle ESKİ: "Trendyol'un karakter limitini... Sen sadece ürününü anlat — listing, görsel, video ve sosyal medya içeriğin dakikalar içinde hazır."
- Subtitle YENİ satır 1: "Listing, görsel, video ve sosyal medya — dakikalar içinde, tüm pazaryerleri için."
- Subtitle YENİ satır 2 (küçük, soluk): "Entegrasyon yok, yazılım yok — sadece yükle ve al."
- Feature pill'leri KALDIR (video zaten anlatıyor)

**Mobil dikkat:**
- Video `object-cover` ile mobilde de kırpılarak doldurur
- Mobilde py-16 yeterli (masaüstünde py-24/py-32)
- Butonlar mobilde dikey (`flex-col sm:flex-row`)

**Dosyalar:** `components/AuthHero.tsx` (veya `app/_tanitim.tsx` hero bölümü), `components/SiteHeader.tsx`, `public/hero-video.mp4`

---

### SAYFA SONU OVERSCROLL / BOŞ ALAN TEMİZLİĞİ (P2 — UX polish)

Tüm sayfalarda içerik bittikten sonra aşağı scroll edildiğinde boş alan görünmemeli. İki ayrı sorun:

**1. iOS/Safari elastic bounce scroll engelleme:**
`app/globals.css` veya root layout'a ekle:
```css
html, body {
  overscroll-behavior: none;
}
```
Bu, sayfa sonunda (ve başında) "zıplama" efektini engeller. Tüm sayfalarda geçerli olur.

**2. Kısa içerikli sayfalarda sticky footer:**
`/giris`, `/kayit` sayfaları footer'sız, sadece form gösteriyor — bu OK (bilinçli).
Ama yasal sayfalar (`/cerez-politikasi`, `/teslimat-iade`) kısa içerik + `min-h-screen` = alt kısımda geniş boşluk. Fix: `min-h-screen` yerine sticky footer pattern kullan:
```tsx
// Root layout (veya yasal sayfaların layout'u):
<body className="min-h-screen flex flex-col">
  <header>...</header>
  <main className="flex-1">...</main>  {/* flex-1 = kalan alanı doldurur */}
  <footer>...</footer>
</body>
```
`min-h-screen` `<main>` yerine `<body>` üzerinde, `<main>` ise `flex-1` ile esner. İçerik kısa olsa bile footer her zaman viewport'un altına yapışır — arada boşluk olmaz.

**Kontrol edilecek sayfalar:**
- [ ] `/giris`, `/kayit` — footer yok, `min-h-screen` ile ekrana oturuyor (mevcut durumu koru)
- [ ] `/cerez-politikasi`, `/teslimat-iade` — kısa içerik, footer'a kadar boşluk var → `flex-1` ile düzelt
- [ ] `/hakkimizda`, `/kosullar`, `/gizlilik` vb. — uzun içerik, doğal scroll → sorun yok
- [x] Tüm sayfalar — `overscroll-behavior: none` eklendikten sonra iOS bounce yok

**Dosyalar:** `app/globals.css`, `app/layout.tsx` (veya ilgili layout dosyaları)

---

### HESAP YAPISINI YENİDEN DÜZENLE — Marka + Üretimler Ayrı Sayfa (P2 — UX)

**Sorun:** Marka bilgileri ve önceki üretimler `/hesap/profil` sayfasında tab olarak gizli. Kullanıcı `/hesap` ana sayfasından "Profil"e tıklayıp sonra tab'a geçmek zorunda. Bu iki özellik kendi başına birer temel sayfa olmalı.

**Mevcut yapı:**
```
/hesap
  /hesap/profil     → Kişisel/Fatura + Tabs(🏪 Marka Profili | 📋 Önceki Üretimler)
  /hesap/krediler
  /hesap/faturalar
  /hesap/ayarlar
```

**Hedef yapı:**
```
/hesap
  /hesap/profil     → Sadece kişisel bilgiler + fatura bilgileri (tab'sız)
  /hesap/marka      → Marka Profili (YENİ route)
  /hesap/uretimler  → Önceki Üretimler (YENİ route)
  /hesap/krediler
  /hesap/faturalar
  /hesap/ayarlar
```

**Fix — 4 adım:**

1. **Yeni route oluştur: `/hesap/marka/page.tsx`**
   - `profil/page.tsx`'teki "Marka Profili" tab içeriğini (satır 320-362) buraya taşı
   - Aynı marka form alanları: marka_adi, ton, hedef_kitle, vurgulanan_ozellikler
   - Aynı Kaydet butonu ve mesaj gösterimi
   - Üstte `← Hesap` linki + "Marka Profili" başlığı

2. **Yeni route oluştur: `/hesap/uretimler/page.tsx`**
   - `profil/page.tsx`'teki "Önceki Üretimler" tab içeriğini (satır 365-424) buraya taşı
   - Sayfalama (SAYFA_BOYUTU=20), üretim kartları, expand/collapse, kopyala butonları
   - `sonucuBolumle()` ve `platformRenk` helper'ları da taşınacak
   - Üstte `← Hesap` linki + "Üretim Geçmişi" başlığı

3. **`/hesap/profil/page.tsx`'den tab yapısını kaldır:**
   - `profilSekme` state'ini sil
   - Tab bar'ı (satır 307-318) sil
   - Sadece "Kişisel ve Fatura Bilgileri" bölümü (satır 224-305) kalsın
   - Header'daki kredi + toplam üretim widget'ı kalabilir

4. **`/hesap/page.tsx` hızlı linkler gridi güncelle (satır 193-206):**
   ```tsx
   // Mevcut 4 kart → 6 kart
   { href: '/hesap/profil', baslik: 'Profil', aciklama: 'Kişisel ve fatura bilgileri', ikon: '👤' },
   { href: '/hesap/marka', baslik: 'Marka', aciklama: 'Marka profili ve metin tonu', ikon: '🏪' },
   { href: '/hesap/uretimler', baslik: 'Üretimler', aciklama: 'Tüm üretim geçmişi', ikon: '📋' },
   { href: '/hesap/krediler', baslik: 'Krediler', aciklama: 'Kredi geçmişi ve satın alma', ikon: '💳' },
   { href: '/hesap/faturalar', baslik: 'Faturalar', aciklama: 'e-Arşiv fatura indir ve gönder', ikon: '🧾' },
   { href: '/hesap/ayarlar', baslik: 'Ayarlar', aciklama: 'E-posta ve şifre değiştir', ikon: '⚙️' },
   ```
   Grid: `grid-cols-2 sm:grid-cols-3` (6 kart 3'lü sığar)

5. **Referans güncellemeleri:**
   - `/hesap/page.tsx` satır 177: "Tüm üretim geçmişini gör" linki → `/hesap/uretimler`
   - `/app/uret/page.tsx` satır 427: "📋 Geçmiş Üretimlerim" linki → `/hesap/uretimler`
   - SiteHeader'da profil linki değişmez (zaten `/hesap` gidiyor)

**Test:**
- [x] `/hesap` 6 kart doğru gösteriliyor, tüm linkler çalışıyor
- [x] `/hesap/profil` tab yok, sadece kişisel + fatura bilgileri
- [x] `/hesap/marka` form çalışıyor, kaydet başarılı
- [x] `/hesap/uretimler` sayfalama + expand/kopyala çalışıyor
- [x] Eski `/hesap/profil`'e gelen bookmark'lar çalışmaya devam ediyor (redirect gerekebilir)

**Dosyalar:** `app/(auth)/hesap/profil/page.tsx`, `app/(auth)/hesap/marka/page.tsx` (yeni), `app/(auth)/hesap/uretimler/page.tsx` (yeni), `app/(auth)/hesap/page.tsx`

---

### KREDİ GÖSTERİMİ TUTARSIZLIĞI (P2 — UX güvenilirlik)

**Sorun:** Kredi miktarı 4+ farklı yerde bağımsız sorguyla gösterildiğinden, eşzamanlılık veya cache nedeniyle uyumsuzluk olabiliyor:

| Yer | Kaynak | Tip |
|-----|--------|-----|
| SiteHeader (nav) | `useCredits()` → TanStack Query, 10sn staleTime | Client |
| /hesap dashboard | `profiles.kredi` → Server Component | RSC (cache'lenebilir) |
| /hesap/profil | `profiles.kredi` → doğrudan supabase | Client |
| /hesap/krediler | `profiles.kredi` → doğrudan supabase | Client |
| /uret sidebar | `kullanici.kredi` → kendi fetch'i | Client |

Ana risk: `/hesap` sayfası RSC olduğu için Next.js cache'leyebilir. Kredi harcandıktan veya satın alındıktan sonra `/hesap`'a dönünce eski değer görünür. SiteHeader'daki TanStack Query ise 10sn sonra yenilenir.

**Fix — 2 adım:**

1. **Tüm kredi gösterimlerini tek kaynağa bağla:**
   - Zaten `useCredits()` hook'u var ve TanStack Query ile cache'liyor — bunu tüm client component'larda kullan
   - `/hesap/profil/page.tsx` ve `/hesap/krediler/page.tsx`'de `useCredits()` hook'unu import et, profil sorgusundan krediyi ayır
   - `/uret/page.tsx`'de de `useCredits()` kullan

2. **`/hesap/page.tsx` (RSC) için kredi gösterimini client component'a çevir:**
   - Metrik kartlarından "Kalan Kredi" kartını ayrı bir `<KrediKart />` client component'a al
   - Bu component `useCredits()` hook'unu kullansın
   - Kredi uyarı banner'ını da aynı client component'ta render et
   - Böylece sayfa RSC olsa bile kredi her zaman taze

3. **`useCredits()` staleTime'ı düşür veya invalidate ekle:**
   - Üretim sonrası `useInvalidateCredits()` çağır (zaten var mı kontrol et)
   - Ödeme sonrası da invalidate çağır
   - staleTime 10sn → 5sn olabilir veya 0 yapılabilir (kredi kritik bilgi)

**Test:**
- [ ] Üretim yap → kredi SiteHeader'da hemen düşsün
- [ ] Kredi satın al → tüm sayfalarda yeni değer göstersin
- [ ] `/hesap` → `/hesap/profil` → geri → aynı kredi göstersin

**Dosyalar:** `lib/hooks/useCredits.ts`, `components/SiteHeader.tsx`, `app/(auth)/hesap/page.tsx`, `app/(auth)/hesap/profil/page.tsx`, `app/(auth)/hesap/krediler/page.tsx`, `app/uret/page.tsx`

---

## 🔴 KREDİ FİYATLAMA GÜNCELLEMESİ — Claude Code İçin (20 Nisan 2026)

Maliyet analizi sonucu (Kling v2.1 Standard: $0.28/5sn, $0.56/10sn). Büyük paket bazında min %100 kar hedefi.

### ✅ KF-01: Video + Try-on Kredi Değerlerini Güncelle (P0 — acil) — DONE (0128faf)

**Değişecek dosyalar:**

1. **`lib/paketler.ts`** — özellikler dizisinde video satırını güncelle:
   - ESKİ: `"🎬 Video — 5 kredi (5sn) · 8 kredi (10sn)"`
   - YENİ: `"🎬 Video — 10 kredi (5sn) · 20 kredi (10sn)"`
   - YENİ satır ekle: `"👗 Mankene giydirme — 3 kredi / görsel"` (NF-02 hazır olunca)

2. **`app/api/sosyal/video/route.ts`** — kredi düşüm miktarını güncelle:
   - 5sn video: 5 → 10 kredi
   - 10sn video: 8 → 20 kredi

3. **`app/api/sosyal/video/poll/route.ts`** ve **`download/route.ts`** — kredi referansı varsa güncelle

4. **Frontend video sekmesi** — kredi gösterimi varsa güncelle

**Fix:**
- [x] `lib/paketler.ts` tüm 3 pakette video özellik satırını güncelle (5→10, 8→20)
- [x] Video API route'unda kredi düşüm miktarlarını güncelle
- [x] Frontend'de video kredi gösterimini güncelle (VideoSekmesi.tsx satır 108-109, 159, 162, 169-170 doğru: 10/20)
- [x] `lib/hooks/useVideoUretim.ts` satır 32 — düzeltildi: `videoSure === "10" ? 20 : 10`
- [x] `app/fiyatlar/page.tsx` — krediAciklamalari + SSS + senaryo tablosu güncellendi
- [x] `components/tanitim/FeaturesTabbed.tsx` — 5sn/10sn etiketleri güncellendi
- [x] Test: video üretimi → kredi sayacı ve API doğrulandı

### KF-02: Video Buton Admin "0 kredi" Sorunu (P1)
**Sorun:** `VideoSekmesi.tsx` satır 159: `kredi={kullanici.is_admin ? 0 : ...}` — admin kullanıcıda buton "✨ Video Üret — 0 kredi" gösteriyor. Demo'da kötü görünür.
**Fix:** Admin için kredi gösterme ya da "Admin — ücretsiz" yaz. Öneri:
```tsx
// ESKİ:
kredi={kullanici.is_admin ? 0 : (videoSure === "10" ? 20 : 10)}
// YENİ seçenek 1: Admin'de kredi gizle
kredi={kullanici.is_admin ? undefined : (videoSure === "10" ? 20 : 10)}
// YENİ seçenek 2: Gerçek maliyeti göster ama "(ücretsiz)" ekle — KrediButon'da bu desteği ekle
```
**Dosya:** `components/tabs/VideoSekmesi.tsx` satır 159 + `components/KrediButon.tsx` (admin desteği)

### KF-03: Video İndirme UX — Loading/Spinner Ekle (P1)
**Sorun:** "⬇️ Videoyu İndir" butonuna tıklanınca `fetch` ile blob çekiliyor (video dosyası ~2-4MB). Bu süre boyunca buton değişmiyor, kullanıcı tıklandığını anlamıyor. Saat dönsün veya "İndiriliyor..." yazısı çıksın.
**Fix:**
```tsx
// VideoSekmesi.tsx satır 187-196
// 1. State ekle: const [indiriliyor, setIndiriliyor] = useState(false);
// 2. onClick'e setIndiriliyor(true) ekle, finally'de false yap
// 3. Buton label: indiriliyor ? "⏳ İndiriliyor..." : "⬇️ Videoyu İndir"
// 4. disabled={indiriliyor} ekle
```
**Dosya:** `components/tabs/VideoSekmesi.tsx` satır 187-196

### ✅ KF-04: Hero Video src Güncelle (P1) — DONE 01ac57a + 5768914
Aziz `public/hero-video-full.mp4` (20sn, yazılı versiyon, 6.5MB) dosyasını manuel olarak public'e kopyaladı.
**Dosya:** `components/tanitim/AuthHero.tsx` satır 20
**Değişiklik:**
```tsx
// ESKİ (satır 20):
src="/hero-video.mp4"
// YENİ:
preload="metadata"
src="/hero-video-full.mp4"
```
**Neden `preload="metadata"`:** Eski dosya 1.4MB idi, yeni dosya 6.5MB. `preload="metadata"` ile tarayıcı sadece video süre/boyut bilgisini çeker, tam dosyayı viewport'a girince yükler. Mobilde zaten `<img>` poster gösteriliyor (satır 7-11), video sadece `md:block` (tablet+) — bu yüzden mobilde 6.5MB yüklenmez.

### 🔴 KF-05: Blog Yazısı Güncelle — Video Hareket Seçenekleri (P2) — REOPENED
**Dosya:** `app/blog/posts/ai-urun-videosu-hareket-secenekleri.md`
Blog yazısında şu an 4 hareket anlatılıyor (360° Dönüş, Zoom Yaklaşım, Dramatik Işık, Doğal Ortam).
Eksik olan 2 hareket eklenmeli: **Detay Tarama** ve **Kumaş Hareketi**.

**1) 🔬 Detay Tarama bölümünü ekle (Doğal Ortam'dan sonra):**

```markdown
## 🔬 Detay Tarama — "Yüzeyi Keşfet"

Kamera ürünün yüzeyini soldan sağa yavaşça tarar. Doku, işçilik, malzeme kalitesi ortaya çıkar. Sonra hafifçe geri çekilerek tam görünüm verir.

**Ne zaman kullan:** Ürünün yüzey kalitesi, malzeme ve işçiliği öne çıkarılması gerektiğinde. Zoom yaklaşımdan farkı: zoom tek noktaya odaklanır, detay tarama yüzeyin genelini gösterir.

**Uygun ürün kategorileri:**
- Elektronik cihazlar (telefon kılıfı, laptop sticker, aksesuar)
- Deri ürünler (cüzdan, çanta yüzeyi)
- Seramik, porselen, cam ürünler
- Kumaş dokusu önemli olan tekstil
- Gravür, baskı ve yüzey deseni olan ürünler

**İpucu:** Yüzeyinde desen, doku veya detay olan her üründe iyi çalışır. Düz, monoton yüzeyli ürünlerde tercih etme — o zaman zoom yaklaşım veya 360° dönüş daha etkili.

## Video Örneği
- /video-ornekler/detay-tarama.mp4|🔬 Detay Tarama
```

**2) 👕 Kumaş Hareketi bölümünü ekle (Detay Tarama'dan sonra):**

```markdown
## 👕 Kumaş Hareketi — "Kumaşı Hisset"

Hafif bir esinti kumaşı doğal şekilde hareket ettirir. Kumaşın akışkanlığı, düşüşü ve dokusu ortaya çıkar. Sonra kumaş yerleşir ve sahnede durağanlaşır.

**Ne zaman kullan:** Ürünün kumaş kalitesi, döküm ve yumuşaklığını hissettirmek istediğinde. Statik fotoğrafta görünmeyen kumaş hareketini göstermenin en etkili yolu.

**Uygun ürün kategorileri:**
- Elbise, etek, gömlek, şal
- Perde, nevresim, masa örtüsü
- İpek, şifon, keten gibi hafif kumaşlar
- Plaj havlusu, battaniye
- Kadın giyim ve özellikle dökümlü parçalar

**İpucu:** Hafif ve dökümlü kumaşlarda en iyi sonucu verir. Kalın, sert yapılı kumaşlarda (kot, deri) rüzgar efekti doğal görünmeyebilir — o ürünler için 360° dönüş tercih et.

## Foto ve Video Örneği
- /video-ornekler/still-life-with-classic-shirts-hanger.jpg|👕 Kumaş Hareketi — Örnek Fotoğraf
- /video-ornekler/kumas-hareketi.mp4|👕 Kumaş Hareketi — Video
```

**3) Video dosyası isimlendirme (Claude Code yapacak):**
- `public/video-ornekler/Detay Tarama.mp4` → `public/video-ornekler/detay-tarama.mp4` olarak rename et (boşluklu dosya adı URL'de sorun çıkarır)
- `public/video-ornekler/urun-video (9).mp4` → `public/video-ornekler/kumas-hareketi.mp4` olarak rename et

### ✅ KF-05-FIX: Blog Yazısı Kırık — 3 Acil Fix (P0 — canlı sitede kırık) — DONE (ce648a0, cf77708)

**Durum:** KF-05 "DONE" olarak işaretlenmiş ama blog yazısı hâlâ kırık. 3 sorun:

**Bug 1 — Markdown dosyası truncated:**
`app/blog/posts/ai-urun-videosu-hareket-secenekleri.md` satır 123'te kesiliyor.
Kumaş Hareketi bölümü "Statik fotoğrafta görünme" cümlesinin ortasında bitiyor.
Eksik olan parçalar:
- Kumaş Hareketi'nin geri kalanı (kategori listesi, ipucu, foto/video örnekleri)
- "Boş Bırakırsan Ne Olur?" bölümü
- "Hangi Süre? 5 Saniye mi, 10 Saniye mi?" bölümü
- SONUÇ bölümü (bu olmadan blog parser hata verir — SONUÇ zorunlu)

**Fix:** Dosyayı tamamla. BACKLOG'daki KF-05 içeriğini referans al. Tüm orijinal bölümleri geri ekle.

**Bug 2 — Blog parser "Foto ve Video Örneği" başlığını tanımıyor:**
`lib/blog-parser.ts` satır 121: `heading.match(/^V[İI]DEO/i)` → başlık "Video" ile başlamalı.
Ama Kumaş Hareketi bölümünde `## Foto ve Video Örneği` yazıyor — bu "Foto" ile başlıyor.
Parser bunu `video-grid` değil normal `baslik` olarak parse ediyor → foto/video render edilmiyor, düz text oluyor.

**Fix iki seçenekten biri:**
- A) Parser regex'ini genişlet: `heading.match(/^(V[İI]DEO|FOTO)/i)` → hem "Video" hem "Foto" ile başlayanları yakala
- B) Markdown'daki başlığı `## Video Örneği` olarak değiştir (fotoğrafı da video-grid'de gösterebilir, jpg'leri `<img>` olarak render etsin)
- **Önerilen: A seçeneği** — parser'ı genişlet, böylece ileride başka yazılarda da "Foto" başlığı kullanılabilir

**Ek gereksinim:** video-grid renderer'ı (`app/blog/[slug]/page.tsx` satır 165-190) şu an sadece `<video>` tag'ı kullanıyor. `.jpg`/`.png` dosyaları için `<img>` tag'ına fallback etmeli:
```typescript
// Dosya uzantısına göre video veya img render et
const isVideo = src?.trim().match(/\.(mp4|webm|mov)$/i);
if (isVideo) {
  return <video src={src} autoPlay loop muted playsInline ... />;
} else {
  return <img src={src} alt={etiket} ... />;
}
```

**Bug 3 — Ana sayfa "Ürün fotoğrafından tanıtım videosu" bölümünde Detay Tarama ve Kumaş Hareketi yok:**
Bu bölüm muhtemelen hardcoded veya bir constant'tan besleniyor. Son 2 preset'i (Detay Tarama, Kumaş Hareketi) ekle.
Kontrol edilecek dosya: `app/` altındaki tanıtım/landing page component'i — `_tanitim.tsx` veya benzeri.

**Fix sırası:** Bug 1 → Bug 2 → Bug 3 (blog parser fix'i olmadan markdown düzeltmesi işe yaramaz)

### ✅ KF-06: Kumaş Hareketi Preset "2 saniye" İfadesini Kaldır (P1) — DONE (90f97f4)
**Dosya:** `lib/constants.ts` satır 82
"Kumaş Hareketi" preset'inin `goster` ve `deger` alanlarında "2 saniye" / "for 2 seconds" ifadesi var. Ama kullanıcı 5 veya 10 sn seçebiliyor — AI modeli seçilen süreye göre üretiyor, "2 saniye" yanıltıcı.

**Değişiklik:**
```typescript
// ESKİ goster:
"Hafif esinti 2 saniye kumaşı hareket ettirir, doğal sarkma oluşturur, sonra yerleşir, soldaki stüdyo ışığı, sabit kamera"
// YENİ goster:
"Hafif esinti kumaşı doğal şekilde hareket ettirir, döküm ve sarkma oluşturur, sonra yerleşir, soldaki stüdyo ışığı, sabit kamera"

// ESKİ deger:
"Soft breeze gently moves the fabric for 2 seconds creating natural drape movement, then fabric settles smoothly into place, clean studio lighting from the left, camera stays steady on tripod"
// YENİ deger:
"Soft breeze gently moves the fabric creating natural drape movement, then fabric settles smoothly into place, clean studio lighting from the left, camera stays steady on tripod"
```

---

## 🔧 PROMPT ENGINE OPTİMİZASYONU — Claude Code İçin (19 Nisan 2026)

Derin prompt engine analizinden çıkan 14 bulgu. Detaylı rapor: `yzliste test/prompt-engine-analiz-raporu.docx`

### PE-01: Video + Sosyal Kit'e RMBG Ekle (P0 — kritik)

**Sorun:** `app/api/sosyal/video/route.ts` ve `app/api/sosyal/kit/route.ts` dosyalarında RMBG (fal-ai/bria/background/remove) hiç çağrılmıyor. Ham fotoğraf direkt Kling'e / Bria Product-Shot'a gönderiliyor. Görsel route'unda (`app/api/gorsel/route.ts` satır 120) düzgün çalışıyor.

**Fix:**
- [x] Ortak bir RMBG helper fonksiyonu yaz (`lib/fal/rmbg.ts`)
- [x] `app/api/gorsel/route.ts`'deki mevcut RMBG çağrısını bu helper'a taşı
- [x] `app/api/sosyal/video/route.ts`'de Kling'e göndermeden önce RMBG helper'ı çağır
- [x] `app/api/sosyal/kit/route.ts`'de Bria Product-Shot'a göndermeden önce RMBG helper'ı çağır
- [ ] Test: video ve kit endpoint'lerine arka planlı fotoğraf gönder, temizlenmiş çıktı geldiğini doğrula

**Dosyalar:** `app/api/sosyal/video/route.ts`, `app/api/sosyal/kit/route.ts`, `app/api/gorsel/route.ts`

### PE-02: Düzenleme API'sine Kredi Düşümü + Sistem Prompt Ekle (P0 — kritik)

**Sorun 1 (B-02):** `app/api/uret/duzenle/route.ts` satır 51'de kredi kontrol ediliyor ama hiç düşülmüyor. Sınırsız ücretsiz düzenleme mümkün.
**Sorun 2 (B-06):** Aynı endpoint'e hiç sistem prompt'u gönderilmiyor. Platform kuralları, marka bilgisi, yasaklı kelimeler — hiçbiri yok.

**Karar:** Her düzenleme 1 kredi harcasın. Ana üretimin sistemPromptOlustur()'u düzenleme için de kullanılsın.

**Fix:**
- [x] Atomik kredi düşümü ekle (1 kredi, LLM öncesi atomik düşüm)
- [x] Hata durumunda refund mekanizması ekle
- [x] Düzenleme sistem prompt'u eklendi (DUZENLE_SISTEM_PROMPT sabiti)
- [x] Frontend'den platform ve kategori bilgisini de gönder (şu an sadece action + content geliyor)
- [ ] Test: düzenleme yap → kredi 1 düşsün, prompt kalitesi korunsun

**Dosyalar:** `app/api/uret/duzenle/route.ts`, `app/api/uret/route.ts` (sistemPromptOlustur import)

### PE-03: Video Prompt'una stilIpucu Ekle (P0 — kritik)

**Sorun:** `app/api/sosyal/video/route.ts` satır 63-68'de stilIpucu hesaplanıyor ama satır 70'teki template string bunu kullanmıyor. Prompt sadece "professional product showcase, camera slowly zooms in..." diyor.

**Fix:**
- [x] Satır 70'teki default prompt template'ine `${stilIpucu}` eklendi
- [x] Marka ipucusu (markaIpucu) ile birlikte stilIpucu da aktif
- [ ] Test: farklı ton değerleriyle video üret, prompt'ta stil ipucunun geçtiğini logla

**Dosyalar:** `app/api/sosyal/video/route.ts`

### PE-04: Dead Code Temizliği — lib/prompts/metin.ts (P1 — bakım)

**Sorun:** `lib/prompts/metin.ts` dosyasındaki `sistemPromptOlustur()`, `PLATFORM_KURALLARI`, `HALLUCINATION_KURALLARI` hiç kullanılmıyor. Route.ts kendi 7-katmanlı versiyonunu tanımlıyor. Sadece `METIN_PROMPT_VERSION` import ediliyor.

**Fix:**
- [x] `lib/prompts/metin.ts`'den kullanılmayan fonksiyon ve sabitleri sil (sistemPromptOlustur, PLATFORM_KURALLARI, HALLUCINATION_KURALLARI)
- [x] Sadece `METIN_PROMPT_VERSION` export'u kalsın
- [x] `app/api/uret/route.ts`'deki import'un hâlâ çalıştığını doğrula

**Dosyalar:** `lib/prompts/metin.ts`, `app/api/uret/route.ts`

### PE-05: Video Route Profil Sorgusunu Genişlet (P1 — kalite)

**Sorun:** `app/api/sosyal/video/route.ts` profil sorgusunda sadece `kredi, is_admin, marka_adi, ton` çekiliyor. `hedef_kitle` ve `vurgulanan_ozellikler` eksik. Frontend (useVideoUretim) de hiç ton/marka bilgisi göndermiyor.

**Karar:** Tam profil çek + frontend'den de ton gönder.

**Fix:**
- [x] Profil sorgusuna `hedef_kitle, vurgulanan_ozellikler` ekle
- [x] `lib/hooks/useVideoUretim.ts`'den ton bilgisini (kullanici.ton) body'ye ekle
- [x] Video prompt'unu bu verilerle zenginleştir (PE-03 ile birlikte yapılabilir)
- [ ] Test: marka profili dolu olan hesapla video üret, prompt'ta marka bilgisi geçsin

**Dosyalar:** `app/api/sosyal/video/route.ts`, `lib/hooks/useVideoUretim.ts`

### PE-06: Sosyal Caption Ton Önceliğini Düzelt (P1 — UX)

**Sorun:** `app/api/sosyal/route.ts` satır 35'te `profil.ton || ton` yazıyor. Profildeki ton, form'dan gelen ton'u eziyor. Kullanıcı formda "eğlenceli" seçse bile profilde "profesyonel" varsa o kullanılıyor.

**Karar:** Form ton'u öncelikli, profil ton'u fallback.

**Fix:**
- [x] Satır 35'teki önceliği tersine çevir: `ton || profil.ton` (form önce, profil fallback)
- [ ] Test: profilde "profesyonel" olan hesapla formda "eğlenceli" seç → caption eğlenceli tonda çıksın

**Dosyalar:** `app/api/sosyal/route.ts`

### PE-07: Görsel Route'a marka_adi Ekle (P1 — kalite)

**Sorun:** `app/api/gorsel/route.ts`'de marka_adi profil sorgusunda çekiliyor ama `ctxParcalar` dizisine eklenmiyor. Bria Product-Shot marka adından habersiz.

**Fix:**
- [x] `ctxParcalar` oluşturulurken `profil.marka_adi` varsa diziye ekle
- [ ] Test: marka profili dolu hesapla görsel üret, scene description'da marka adının geçtiğini logla

**Dosyalar:** `app/api/gorsel/route.ts`

### PE-08: Tüm Kredi Düşümlerini Atomik Yap (P1 — güvenlik)

**Sorun:**
- Video (`app/api/sosyal/video/route.ts` satır 74-78): `.gte()` condition yok, eş zamanlı isteklerde negatife düşebilir.
- Sosyal caption (`app/api/sosyal/route.ts` satır 76-88): Kredi LLM başarısından SONRA düşüyor, race condition.
- Metin route'undaki pattern doğru (önce atomik düş, hata olursa refund).

**Karar:** Tüm route'ları metin route'undaki atomik pattern'e çevir. Ortak helper fonksiyon yaz.

**Fix:**
- [x] Ortak kredi helper'ı yaz: `lib/credits.ts` → `deductCredit(userId, amount)` + `refundCredit(userId, amount)`
- [x] `deductCredit`: `.update({ kredi: rpc veya raw sql }).eq("id", userId).gt("kredi", amount-1)` pattern
- [x] Hata durumunda `refundCredit` çağrısı
- [x] `app/api/sosyal/video/route.ts` → helper kullan, Kling çağrısından ÖNCE düş
- [x] `app/api/sosyal/route.ts` → helper kullan, LLM çağrısından ÖNCE düş
- [x] `app/api/sosyal/kit/route.ts` → kontrol et, aynı pattern uygula
- [x] `app/api/uret/route.ts` → mevcut pattern'i helper'a taşı (opsiyonel, çalışıyor ama DRY için)
- [x] `app/api/uret/duzenle/route.ts` → PE-02'de zaten eklenecek, helper kullansın
- [ ] Test: 2 eş zamanlı istek → sadece birinin başarılı olması, diğerinin "kredi yetersiz" döndürmesi

**Dosyalar:** `lib/credits.ts` (yeni), `app/api/sosyal/video/route.ts`, `app/api/sosyal/route.ts`, `app/api/sosyal/kit/route.ts`, `app/api/uret/route.ts`, `app/api/uret/duzenle/route.ts`

### ~~PE-09: Kling v2.1 → v2.6 Upgrade~~ — GEÇERSİZ (NF-01 ile değiştirildi)

**Not:** Model upgrade sonraya bırakıldı (NF-01 P3). Mevcut Kling v2.1 Standard ile devam. Video kredi fiyatlaması maliyet analizine göre güncellendi: 5sn=10kr, 10sn=20kr.

### PE-10: Foto Moduna Eksik Alanları Ekle (P2 — kalite)

**Sorun:** `components/tabs/MetinSekmesi.tsx` foto modunda kullanıcı sadece kategori + ek bilgi girebiliyor. Manuel modda olan hedefKitle, fiyatSegmenti, anahtarKelimeler alanları foto modda yok.

**Fix:**
- [x] Foto moduna hedefKitle, fiyatSegmenti, anahtarKelimeler alanlarını ekle
- [x] Bu alanlar opsiyonel olsun (foto modu hızlı mod, zorunlu alan ekleme)
- [x] API route'una bu alanları da gönder
- [ ] Test: foto modunda ek alanları doldurup üret → prompt'ta geçtiğini doğrula

**Dosyalar:** `components/tabs/MetinSekmesi.tsx`, `lib/hooks/useMetinUretim.ts`

### PE-11: tonEnMap Güncellemesi (P2 — tutarlılık)

**Sorun:** `app/api/gorsel/route.ts`'deki tonEnMap'te sadece 'eglenceli'→'playful', 'lüks'→'luxurious', 'minimal'→'minimalist' var. Profilde kullanılan ton değerleri (samimi, profesyonel, premium) map'te yok. 'premium' fallback'e düşüyor.

**Karar:** Tüm profil ton değerlerini ekle + merkezi bir yere taşı.

**Fix:**
- [x] `lib/constants/ton.ts` (veya benzeri) oluştur, tonEnMap'i tüm değerlerle tanımla:
  - samimi → friendly/warm
  - profesyonel → professional/corporate
  - premium → premium/upscale
  - eglenceli → playful/fun
  - ciddi → serious/formal
  - lüks → luxurious
  - minimal → minimalist
- [x] `app/api/gorsel/route.ts` ve `app/api/sosyal/video/route.ts`'den bu merkezi map'i import et
- [ ] Test: her ton değeriyle görsel üret, İngilizce çevirinin prompt'ta doğru geçtiğini doğrula

**Dosyalar:** `lib/constants/ton.ts` (yeni), `app/api/gorsel/route.ts`, `app/api/sosyal/video/route.ts`

---

## 🚀 YENİ ÖZELLİKLER + ALTYAPI — Claude Code İçin (19 Nisan 2026)

### NF-01: Video Kling 3.0 Pro + Ses Desteği (P3 — gelecek, öncelikli değil)

**Mevcut:** Kling v2.1 Standard (sessiz). Maliyet: $0.28/5sn, $0.56/10sn.
**Hedef:** İleride Kling 3.0 Pro'ya geçiş + opsiyonel ses toggle'ı.

**Karar (20 Nisan):** Önce mevcut v2.1 Standard ile devam. Kredi fiyatlaması mevcut maliyete göre belirlendi:
- Video 5sn = 10 kredi (maliyet ₺12.56, satış ₺24.90 @ Büyük paket → %98 marj)
- Video 10sn = 20 kredi (maliyet ₺25.12, satış ₺49.80 @ Büyük paket → %98 marj)

**Kling 3.0 geçildiğinde tekrar fiyatlama yapılacak:**
- Kling 3.0 sessiz: ~$0.07/sn → 5sn ≈ $0.35 (v2.1'den %25 pahalı)
- Kling 3.0 sesli: ~$0.14/sn → 5sn ≈ $0.70 (2x)

**Fix:**
- [ ] `app/api/sosyal/video/route.ts`'de model adını `fal-ai/kling-video/v3/pro/image-to-video` olarak güncelle (fal.ai docs'tan doğru endpoint'i kontrol et)
- [ ] Parametre doğrulaması: v3 API'sindeki duration, aspect_ratio, audio parametrelerini kontrol et
- [ ] Frontend'e (`components/tabs/VideoSekmesi.tsx` veya ilgili) "Sesli Video" toggle'ı ekle
- [ ] Toggle açıksa API'ye `audio: true` (veya ilgili param) gönder
- [ ] Sesli video için ek kredi düşümü belirle (PE-08'deki ortak helper kullanılsın)
- [ ] Kredi fiyatlamasını Kling 3.0 maliyetine göre tekrar hesapla
- [ ] Test: sessiz ve sesli video üret, kalite + maliyet doğrula

**Dosyalar:** `app/api/sosyal/video/route.ts`, `lib/hooks/useVideoUretim.ts`, ilgili frontend component

### NF-02: yzstudio — Premium / Deneysel Araçlar Sayfası (P1 — yeni sayfa)

> **KARAR (20 Nisan 2026):** Eski NF-02 (görsel sekmesine try-on ekleme) iptal edildi.
> Yerine: bağımsız `/yzstudio` sayfası — pahalı/deneysel modeller burada yaşar.
> Ana site (`/uret`) standart araçlarla sınırlı kalır, yzstudio premium tier olur.

---

#### MİMARİ GENEL BAKIŞ

**İsim:** yzstudio (marka kimliği — "premium" geçici his verir, "studio" kalıcı)

**Erişim:**
- URL: `/yzstudio` — şimdilik navigasyonda link yok, sadece URL ile erişim
- Auth zorunlu (middleware'e ekle)
- İleride ana sayfadan "🧪 yzstudio" badge'i ile keşfedilebilir

**Sayfa yapısı — Sekme tabanlı multi-tool:**
```
/yzstudio
├── Sekme 1: 👗 Mankene Giydirme (Virtual Try-On) ← ilk model
├── Sekme 2: [gelecek model — örn. Seedance Premium Video]
├── Sekme 3: [gelecek model — örn. AI Background Replace]
└── ...genişleyebilir
```

Her sekme bağımsız bir tool — kendi input/output/kredi mantığı var.
Sekmeler arası paylaşılan: auth, kredi bakiyesi, kredi yükleme modal, header.

**Neden ayrı sayfa (ve /uret içine gömmemek):**
1. Maliyet farkı çok büyük: try-on 3 kredi, görsel 1 kredi — aynı arayüzde karışır
2. İleride başka premium modeller eklenecek (Seedance, background replace, vb.)
3. UX: ana üretim akışı basit kalmalı, deneysel araçlar ayrı bir "lab" hissi vermeli
4. Fiyatlama esnekliği: yzstudio araçları farklı kredi paketleriyle fiyatlanabilir

---

#### ROUTE & DOSYA YAPISI

```
app/
├── yzstudio/
│   ├── layout.tsx          ← Auth guard + yzstudio shell (header, kredi, sekmeler)
│   ├── page.tsx             ← Ana sayfa: sekme yönetimi + içerik render
│   └── components/
│       ├── StudioHeader.tsx  ← "yzstudio" logosu + kredi bakiye + sekme nav
│       ├── StudioSekmeler.tsx ← Sekme listesi (dinamik, STUDIO_TOOLS constant'tan)
│       └── tryon/
│           ├── TryonSekmesi.tsx      ← Ana try-on UI (tüm akış)
│           ├── GarmentUpload.tsx     ← Kıyafet fotoğrafı yükleme alanı
│           ├── ModelPicker.tsx       ← Manken seçimi (stok grid + özel yükleme)
│           ├── TryonAyarlar.tsx      ← Kategori, kalite modu, num_samples seçimi
│           ├── TryonSonuc.tsx        ← Sonuç galerisi + indirme
│           └── useTryonUretim.ts     ← Custom hook (state + API çağrıları)
│
api/
├── studio/
│   └── tryon/
│       ├── route.ts          ← POST: kredi düş → fal.ai FASHN çağır → requestId dön
│       └── poll/route.ts     ← GET: job durumu sorgula → sonuç URL'leri dön
```

**Neden `api/studio/tryon/` (ve `api/gorsel/tryon/` değil):**
yzstudio araçları ana üretim API'sinden ayrı namespace'te olmalı. İleride `api/studio/premium-video/`, `api/studio/bg-replace/` vb. eklenecek.

---

#### FASHN v1.6 API — TAM PARAMETRE HARİTASI

**Endpoint:** `fal-ai/fashn/tryon/v1.6`
**Maliyet:** $0.075/görsel (num_samples'tan bağımsız — her sample ayrı ücret)
**Çıktı:** 864×1296 px native (v1.6), PNG URL array

| Parametre | Tip | Varsayılan | Kullanıcıya Aç | Açıklama |
|---|---|---|---|---|
| `model_image` | URL | zorunlu | ✅ stok seç veya yükle | Manken fotoğrafı |
| `garment_image` | URL | zorunlu | ✅ yükle | Kıyafet fotoğrafı |
| `category` | enum | `"auto"` | ✅ dropdown | `tops`, `bottoms`, `one-pieces`, `auto` |
| `garment_photo_type` | enum | `"auto"` | ✅ radio | `model` (mankendeki), `flat-lay` (düz/askı), `auto` |
| `mode` | enum | `"balanced"` | ✅ radio | `performance` (hızlı), `balanced` (önerilen), `quality` (en iyi) |
| `num_samples` | int | 1 | ✅ slider 1-4 | Üretilecek varyasyon sayısı |
| `seed` | int | random | ❌ gizli | Tekrarlanabilirlik için (sadece debug) |
| `segmentation_free` | bool | true | ❌ gizli | v1.6'da her zaman true |
| `moderation_level` | enum | `"permissive"` | ❌ gizli | İçerik denetimi — biz "permissive" sabit tutarız |

---

#### KREDİ & FİYATLAMA — DİNAMİK HESAPLAMA

**Temel birim:** 3 kredi = 1 görsel (1 sample)
**num_samples ile ölçekleme:**

| num_samples | API Maliyeti | Kredi | Büyük Paket Fiyatı | Marj |
|---|---|---|---|---|
| 1 | $0.075 | 3 kredi | ₺7.47 | +122% |
| 2 | $0.150 | 6 kredi | ₺14.94 | +122% |
| 3 | $0.225 | 9 kredi | ₺22.41 | +122% |
| 4 | $0.300 | 12 kredi | ₺29.88 | +122% |

**Dinamik hesaplama formülü:**
```typescript
// lib/constants.ts veya lib/studio-constants.ts
export const STUDIO_KREDI = {
  tryon: {
    birimKredi: 3,  // 1 sample = 3 kredi
    minSamples: 1,
    maxSamples: 4,
    hesapla: (numSamples: number) => numSamples * 3,
  },
  // gelecek modeller buraya eklenir
} as const;
```

**Frontend'de gerçek zamanlı kredi gösterimi:**
Kullanıcı num_samples slider'ını kaydırdıkça buton dinamik güncellenir:
- `num_samples=1` → `[Mankene Giydirme — 3 kredi]`
- `num_samples=2` → `[Mankene Giydirme — 6 kredi]`
- `num_samples=4` → `[Mankene Giydirme — 12 kredi]`

**Not:** `mode` (performance/balanced/quality) fiyatı ETKİLEMEZ — sadece hız/kalite tradeoff. API maliyeti aynı.

---

#### KULLANICI AKIŞI (TryonSekmesi.tsx)

**Adım 1 — Kıyafet Fotoğrafı:**
```
┌─────────────────────────────────────────────┐
│  👕 Kıyafet Fotoğrafı                       │
│  ┌─────────────────────────────┐            │
│  │                             │            │
│  │   [Fotoğraf yükle veya     │            │
│  │    sürükle bırak]          │            │
│  │                             │            │
│  └─────────────────────────────┘            │
│                                              │
│  Fotoğraf Tipi: (●) Otomatik  ○ Düz/Askı   │
│                 ○ Mankendeki                 │
│                                              │
│  Kategori: (●) Otomatik ○ Üst ○ Alt        │
│            ○ Tek Parça (elbise/tulum)       │
└─────────────────────────────────────────────┘
```

**Adım 2 — Manken Seçimi:**
```
┌─────────────────────────────────────────────┐
│  👤 Manken Seçimi                            │
│                                              │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐       │
│  │Kadın │ │Kadın │ │Erkek │ │Erkek │       │
│  │  1   │ │  2   │ │  1   │ │  2   │       │
│  │  ✓   │ │      │ │      │ │      │       │
│  └──────┘ └──────┘ └──────┘ └──────┘       │
│                                              │
│  ┌──────┐                                    │
│  │  +   │  Kendi mankeninizi yükleyin       │
│  └──────┘                                    │
└─────────────────────────────────────────────┘
```

**Adım 3 — Ayarlar + Üret:**
```
┌─────────────────────────────────────────────┐
│  ⚙️ Ayarlar                                  │
│                                              │
│  Kalite: ○ Hızlı  (●) Dengeli  ○ En İyi    │
│                                              │
│  Varyasyon: [===●======] 1                   │
│             1 varyasyon = 3 kredi            │
│                                              │
│  ┌─────────────────────────────────────┐    │
│  │  👗 Mankene Giydirme — 3 kredi      │    │
│  └─────────────────────────────────────┘    │
│                                              │
│  ℹ️ Kalan bakiye: 27 kredi                   │
└─────────────────────────────────────────────┘
```

**Adım 4 — Sonuç:**
```
┌─────────────────────────────────────────────┐
│  ✅ Sonuç (1/1 varyasyon)                    │
│                                              │
│  ┌─────────────────────┐                    │
│  │                     │                    │
│  │   [Giydirme sonucu] │                    │
│  │   864×1296 px       │                    │
│  │                     │                    │
│  └─────────────────────┘                    │
│                                              │
│  [⬇️ İndir]  [🔄 Tekrar Üret]              │
└─────────────────────────────────────────────┘
```

---

#### API ROUTE — `app/api/studio/tryon/route.ts`

```typescript
// POST /api/studio/tryon
// Input: { garmentImage: base64, modelImage: base64|stockId, category, garmentPhotoType, mode, numSamples, userId }

// Akış:
// 1. Auth doğrula (supabase admin)
// 2. Stok manken mi özel yükleme mi? → stockId ise public/mankenler/ URL'i al
// 3. Her iki görseli fal.storage.upload() ile yükle
// 4. Opsiyonel: garment_image'a RMBG uygula (arka plan temizleme — kaliteyi artırır)
// 5. Kredi hesapla: numSamples * 3
// 6. Atomik kredi düşümü (mevcut krediDus helper)
// 7. fal.queue.submit("fal-ai/fashn/tryon/v1.6", { input: { ... } })
// 8. Hata durumunda: krediIade()
// 9. Return { requestId, kullanilanKredi }
```

**Stok manken yönetimi:**
```typescript
// lib/studio-constants.ts
export const STOK_MANKENLER = [
  { id: "kadin-1", label: "Kadın 1", url: "/mankenler/kadin-1.jpg", cinsiyet: "kadin" },
  { id: "kadin-2", label: "Kadın 2", url: "/mankenler/kadin-2.jpg", cinsiyet: "kadin" },
  { id: "erkek-1", label: "Erkek 1", url: "/mankenler/erkek-1.jpg", cinsiyet: "erkek" },
  { id: "erkek-2", label: "Erkek 2", url: "/mankenler/erkek-2.jpg", cinsiyet: "erkek" },
] as const;
```

**Stok fotoğraf gereksinimleri:**
- Tam boy (baş-ayak), düz arka plan (beyaz veya açık gri)
- 1000×1500 px minimum, dikey oryantasyon
- Doğal poz — cepheden, hafif açı OK, oturma yok
- Yüz görünür (FASHN identity koruma için gerekli)
- Ticari lisanslı stok fotoğraf (Unsplash, Pexels veya satın alınmış)
- 4 adet: kadın×2 (farklı vücut tipi), erkek×2 (farklı vücut tipi)
- Dosya yolu: `public/mankenler/kadin-1.jpg`, `kadin-2.jpg`, `erkek-1.jpg`, `erkek-2.jpg`

---

#### POLL ROUTE — `app/api/studio/tryon/poll/route.ts`

```typescript
// GET /api/studio/tryon/poll?requestId=xxx
// Mevcut gorsel/poll pattern'ini takip et:
// fal.queue.status() → { status, result }
// status: "IN_QUEUE" | "IN_PROGRESS" | "COMPLETED" | "FAILED"
// result.images: [{ url, content_type }]
```

**Frontend polling (useTryonUretim.ts):**
- Interval: 3 saniye (FASHN v1.6 balanced ~15-30 sn, quality ~30-60 sn)
- Max retry: 60 (= 3 dakika timeout)
- Progress feedback: "Kıyafetiniz giydiriliyor..." → "Sonuçlar hazırlanıyor..."

---

#### HOOK — `useTryonUretim.ts`

```typescript
interface TryonState {
  // Input
  garmentFoto: string | null;           // base64
  garmentPhotoType: "auto" | "flat-lay" | "model";
  category: "auto" | "tops" | "bottoms" | "one-pieces";
  modelSecimi: string | null;           // stockId veya base64 (özel yükleme)
  modelKaynagi: "stok" | "ozel";
  mode: "performance" | "balanced" | "quality";
  numSamples: number;                   // 1-4

  // Output
  sonuclar: { url: string; index: number }[];
  yukleniyor: boolean;
  hata: string | null;
  ilerleme: string;                     // "Kıyafet hazırlanıyor..." vb.

  // Computed
  toplamKredi: number;                  // numSamples * 3
}
```

---

#### VIDEO TRY-ON — 2 Aşamalı Pipeline (FASHN → Kling)

> **Konsept:** Tek seferde video try-on yapan bir model yok. Ama çok daha iyi bir şey var:
> FASHN ile giydirme sonucu al (statik görsel) → o görseli Kling v2.1'e ver → manken kıyafetle yürüsün.
> Kullanıcı önce statik sonucu görür, beğenirse "Videoya Dönüştür" der.

**Neden ayrı sekme DEĞİL:**
Bu, try-on'un doğal uzantısı — ayrı bir araç değil. Kullanıcı try-on sonucunu gördükten sonra "bunu videoya çevir" demek istiyor. Ayrı sekmeye gidip tekrar aynı görseli yüklemek anlamsız.

**Akış (TryonSonuc.tsx içinde):**

```
┌─────────────────────────────────────────────┐
│  ✅ Giydirme Sonucu                          │
│                                              │
│  ┌─────────────────────┐                    │
│  │                     │                    │
│  │   [Manken + kıyafet]│                    │
│  │   864×1296 px       │                    │
│  │                     │                    │
│  └─────────────────────┘                    │
│                                              │
│  [⬇️ İndir]  [🔄 Tekrar Üret]              │
│                                              │
│  ────────────────────────────────────────    │
│                                              │
│  🎬 Bu görseli videoya dönüştür              │
│                                              │
│  Hareket Stili:                              │
│  (●) Podyum Yürüyüşü   ○ 360° Dönüş       │
│  ○ Doğal Poz            ○ Rüzgar Efekti     │
│                                              │
│  Süre: (●) 5 saniye [10 kredi]              │
│        ○ 10 saniye [20 kredi]               │
│                                              │
│  ┌─────────────────────────────────────┐    │
│  │  🎬 Videoya Dönüştür — 10 kredi     │    │
│  └─────────────────────────────────────┘    │
│                                              │
│  ℹ️ Giydirme sonucu videoda canlandırılır    │
└─────────────────────────────────────────────┘
```

**Video sonrası:**
```
┌─────────────────────────────────────────────┐
│  🎬 Video Hazır                              │
│                                              │
│  ┌─────────────────────┐                    │
│  │                     │                    │
│  │   ▶ [Video player]  │                    │
│  │   5 sn              │                    │
│  │                     │                    │
│  └─────────────────────┘                    │
│                                              │
│  [⬇️ Video İndir]                           │
└─────────────────────────────────────────────┘
```

**Teknik pipeline:**
1. Kullanıcı try-on sonucunu alır (FASHN v1.6 → statik görsel, 3 kredi zaten harcanmış)
2. "Videoya Dönüştür" tıklar → hareket stili + süre seçer
3. API: try-on sonuç URL'ini alır → Kling v2.1 Standard image-to-video'ya gönderir
4. Prompt: hareket stiline göre fashion-specific prompt (aşağıda detay)
5. Sonuç: 5 veya 10 saniyelik video

**Maliyet tablosu:**

| İşlem | API Maliyeti | Kredi | Açıklama |
|---|---|---|---|
| Try-on (statik) | $0.075 | 3 kredi | FASHN v1.6 |
| Video 5sn | $0.28 | 10 kredi | Kling v2.1 Std |
| Video 10sn | $0.56 | 20 kredi | Kling v2.1 Std |
| **Toplam: try-on + 5sn video** | **$0.355** | **13 kredi** | **₺32.37 @ Büyük** |
| **Toplam: try-on + 10sn video** | **$0.635** | **23 kredi** | **₺57.27 @ Büyük** |

**Neden krediyi ayrı düşüyoruz (kombine paket DEĞİL):**
- Kullanıcı her try-on'u videoya dönüştürmek istemeyebilir
- Önce statik sonucu görüp kaliteyi değerlendirmeli
- Kombine paket "ya video kötü çıkarsa" riskini kullanıcıya yıkar

**Fashion Video Presets (moda-spesifik promptlar):**

```typescript
// lib/studio-constants.ts
export const TRYON_VIDEO_PRESETLER = [
  {
    id: "podyum",
    etiket: "Podyum Yürüyüşü",
    ikon: "👠",
    aciklama: "Manken kameraya doğru özgüvenli yürür",
    prompt: "Fashion model walking confidently towards camera on a clean white runway, professional catwalk stride, subtle hip movement, garment flowing naturally with each step, studio lighting, fashion show atmosphere",
  },
  {
    id: "donus",
    etiket: "360° Dönüş",
    ikon: "🔄",
    aciklama: "Manken yerinde dönerek kıyafeti her açıdan gösterir",
    prompt: "Fashion model slowly turning 360 degrees in place, showing the garment from all angles, smooth rotation, clean studio background, soft directional lighting, full body visible",
  },
  {
    id: "dogal",
    etiket: "Doğal Poz",
    ikon: "🧍",
    aciklama: "Hafif hareketlerle doğal duruş",
    prompt: "Fashion model in a relaxed natural pose, subtle weight shifting, gentle hand movement, soft smile, clean studio background, lifestyle feel, natural lighting",
  },
  {
    id: "ruzgar",
    etiket: "Rüzgar Efekti",
    ikon: "💨",
    aciklama: "Kumaş rüzgarda hareketlenir, dramatik his",
    prompt: "Fashion model standing with wind blowing through the garment, fabric flowing dramatically, hair moving gently, cinematic studio lighting, editorial fashion photography feel",
  },
] as const;
```

**API Route — `app/api/studio/tryon/video/route.ts`:**

```typescript
// POST /api/studio/tryon/video
// Input: { tryonImageUrl: string, preset: string, sure: "5"|"10", userId: string }

// Akış:
// 1. Auth doğrula
// 2. tryonImageUrl geçerli mi kontrol et (fal.ai URL olmalı)
// 3. Kredi hesapla: VIDEO_KREDI[sure] (10 veya 20)
// 4. Atomik kredi düşümü
// 5. TRYON_VIDEO_PRESETLER'den prompt al
// 6. fal.queue.submit("fal-ai/kling-video/v2.1/standard/image-to-video", {
//      input: {
//        image_url: tryonImageUrl,
//        prompt: preset.prompt,
//        duration: sure === "5" ? "5" : "10",
//        aspect_ratio: "9:16",  // dikey — moda için en uygun
//      }
//    })
// 7. Return { requestId, kullanilanKredi }
```

**Poll:** Mevcut `api/studio/tryon/poll/route.ts` yeniden kullanılabilir — veya ayrı `api/studio/tryon/video/poll/route.ts` endpoint.

**Hook güncellemesi — `useTryonUretim.ts` genişletmesi:**

```typescript
interface TryonState {
  // ... mevcut try-on state (yukarıda tanımlı)

  // Video ek state
  videoAktif: boolean;              // "Videoya Dönüştür" bölümü açık mı
  videoPreset: string;              // "podyum" | "donus" | "dogal" | "ruzgar"
  videoSure: "5" | "10";
  videoSonuc: { url: string } | null;
  videoYukleniyor: boolean;
  videoHata: string | null;
  videoIlerleme: string;
  videoKredi: number;               // computed: VIDEO_KREDI[videoSure]
}
```

---

#### DOSYA YAPISI GÜNCELLEMESİ (Video Try-On dahil)

```
app/
├── yzstudio/
│   ├── layout.tsx
│   ├── page.tsx
│   └── components/
│       ├── StudioHeader.tsx
│       ├── StudioSekmeler.tsx
│       └── tryon/
│           ├── TryonSekmesi.tsx
│           ├── GarmentUpload.tsx
│           ├── ModelPicker.tsx
│           ├── TryonAyarlar.tsx
│           ├── TryonSonuc.tsx          ← statik sonuç + "Videoya Dönüştür" bölümü
│           ├── TryonVideoAyarlar.tsx   ← YENİ: preset seçimi, süre, kredi gösterimi
│           ├── TryonVideoSonuc.tsx     ← YENİ: video player + indirme
│           └── useTryonUretim.ts       ← genişletildi: video state + API
│
api/
├── studio/
│   └── tryon/
│       ├── route.ts                    ← POST: FASHN try-on (statik)
│       ├── poll/route.ts               ← GET: try-on job polling
│       └── video/
│           ├── route.ts                ← POST: Kling video (try-on sonucundan)
│           └── poll/route.ts           ← GET: video job polling
```

---

#### LAYOUT — `app/yzstudio/layout.tsx`

```typescript
// Auth guard + yzstudio shell
// 1. Server-side: kullanıcı yoksa /giris?redirect=/yzstudio
// 2. Ortak header: "yzstudio" logo + kredi bakiye + kredi yükle butonu
// 3. Ortak footer: bilgi notu "yzstudio deneysel araçlar içerir"
// 4. Children render (page.tsx sekme içeriği)
```

**StudioHeader tasarımı:**
- Sol: "yzstudio" yazısı (Geist font, indigo-400, küçük "beta" badge)
- Orta: Sekme navigasyon (tek sekme şimdilik, ileride büyüyecek)
- Sağ: Kredi bakiyesi + [Kredi Yükle] butonu
- Stil: koyu arka plan (slate-900), ana siteden farklı his — "lab" ortamı

---

#### MIDDLEWARE GÜNCELLEMESİ

`middleware.ts` → PROTECTED_PATHS dizisine `/yzstudio` ekle:
```typescript
const PROTECTED_PATHS = ['/app', '/hesap', '/kredi-yukle', '/admin', '/yzstudio']
```

---

#### İMPLEMENTASYON SIRASI (Claude Code İçin)

**Faz 1 — Altyapı (önce yap):**
- [ ] `middleware.ts` → `/yzstudio` koruma ekle
- [ ] `lib/studio-constants.ts` → STUDIO_KREDI, STOK_MANKENLER, STUDIO_TOOLS tanımla
- [ ] `app/yzstudio/layout.tsx` → Auth guard + shell
- [ ] `app/yzstudio/page.tsx` → Sekme yönetimi (şimdilik tek sekme: tryon)
- [ ] `app/yzstudio/components/StudioHeader.tsx` → Logo + kredi + sekme nav

**Faz 2 — API (backend):**
- [ ] `app/api/studio/tryon/route.ts` → POST handler (kredi düş → fal FASHN çağır)
- [ ] `app/api/studio/tryon/poll/route.ts` → GET handler (job durumu sorgula)
- [ ] `app/api/studio/tryon/video/route.ts` → POST handler (try-on sonucu → Kling video)
- [ ] `app/api/studio/tryon/video/poll/route.ts` → GET handler (video job polling)
- [ ] RMBG ön-işleme: garment_image'a `rmbgUygula()` çağır (mevcut helper)
- [ ] Stok manken URL'lerini fal.storage'a yükleme logic'i (veya public URL direkt kullan)

**Faz 3 — Frontend (UI):**
- [ ] `app/yzstudio/components/tryon/GarmentUpload.tsx` → Drag-drop kıyafet yükleme
- [ ] `app/yzstudio/components/tryon/ModelPicker.tsx` → Stok grid + özel yükleme
- [ ] `app/yzstudio/components/tryon/TryonAyarlar.tsx` → Kategori, mod, num_samples
- [ ] `app/yzstudio/components/tryon/TryonSonuc.tsx` → Sonuç galerisi + indirme + "Videoya Dönüştür" bölümü
- [ ] `app/yzstudio/components/tryon/TryonVideoAyarlar.tsx` → Video preset seçimi, süre, dinamik kredi
- [ ] `app/yzstudio/components/tryon/TryonVideoSonuc.tsx` → Video player + indirme
- [ ] `app/yzstudio/components/tryon/TryonSekmesi.tsx` → Ana container (tüm parçaları birleştir)
- [ ] `lib/hooks/useTryonUretim.ts` → Custom hook (try-on + video state + API + polling)

**Faz 4 — Assets + Polish:**
- [ ] Stok manken görselleri hazırla: `public/mankenler/` (4 adet, ticari lisanslı)
- [ ] Kredi onay dialogu (NF-06 pattern'i): "Bu işlem X kredi harcar. Devam?"
- [ ] Hata mesajları Türkçe: yetersiz kredi, yükleme hatası, API timeout
- [ ] Loading state: skeleton/spinner + ilerleme mesajları
- [ ] Responsive: mobilde de çalışsın (tek kolon layout)

**Faz 5 — Test:**
- [ ] Flat-lay kıyafet + stok manken → try-on kalite değerlendir
- [ ] On-model kıyafet + stok manken → try-on kalite değerlendir
- [ ] Kullanıcı yüklediği manken ile test
- [ ] num_samples=2 ile test (birden fazla sonuç)
- [ ] Try-on sonucu → "Videoya Dönüştür" → podyum yürüyüşü 5sn test
- [ ] Try-on sonucu → "Videoya Dönüştür" → 360° dönüş 10sn test
- [ ] Video preset'lerinin hepsini test et (doğal poz, rüzgar efekti)
- [ ] Kredi düşümü doğrulama: try-on (3 kredi) + video (10 kredi) = ayrı ayrı düşmeli
- [ ] Yetersiz kredi durumu (try-on için yeterli ama video için yetersiz)
- [ ] Büyük dosya yükleme (10MB+ görsel)
- [ ] Mobile responsive test

**Dosyalar:** `app/yzstudio/` (tüm yeni), `app/api/studio/tryon/` (yeni, video/ alt-route dahil), `lib/studio-constants.ts` (yeni), `lib/hooks/useTryonUretim.ts` (yeni), `middleware.ts` (güncelle), `public/mankenler/` (yeni assets)

### ✅ NF-03: Admin Dashboard — Maliyet & Fiyatlama Tablosu (P1) — DONE 6bdfb4a

**2 bileşen:**

**A) Statik maliyet tablosu:**

| Üretim Tipi | API Maliyeti | Kredi | Büyük Paket Marj |
|---|---|---|---|
| Metin (GPT-4o) | ~$0.005/üretim | 1 kredi | +1010% |
| Metin düzenleme | ~$0.003/üretim | 1 kredi | +1500%+ |
| Görsel (RMBG + Bria) | ~$0.012/görsel | 1 kredi | +363% |
| Video 5sn (Kling v2.1 Std) | $0.28/5sn | 10 kredi | +98% |
| Video 10sn (Kling v2.1 Std) | $0.56/10sn | 20 kredi | +98% |
| Sosyal caption | ~$0.003/caption | 1 kredi | +1500%+ |
| Sosyal kit (caption + görsel) | ~$0.017/kit | 2 kredi | +553% |
| Virtual try-on (FASHN) | ~$0.075/görsel | 3 kredi | +122% |
| Try-on + Video 5sn (FASHN→Kling) | ~$0.355 | 13 kredi (3+10) | +62% |
| Try-on + Video 10sn (FASHN→Kling) | ~$0.635 | 23 kredi (3+20) | +63% |

(Büyük paket bazında: ₺2.49/kredi, min %100 kar hedefi sağlanıyor)
(Kling 3.0 ve Seedance geçişi sonraya bırakıldı — NF-01 P3, NF-05 P3)

**B) Canlı maliyet loglama:**
- [x] Her API çağrısında maliyet verisini logla: `uretimler` tablosuna `api_cost` kolonu ekle (decimal)
- [x] Anthropic API: input/output token sayısından maliyet hesapla (Sonnet $3/$15/MTok)
- [x] Admin sayfasında statik fiyat/marj tablosu + gerçek api_cost kartı
- [ ] fal.ai response maliyet loglama (Bria/Kling — async queue, sabit maliyet tablodan)
- [ ] Günlük/haftalık/aylık toplam maliyet grafiği (P3)

**Fix:**
- [x] DB migration: `uretimler` tablosuna `api_cost DECIMAL(10,6)` kolonu eklendi + Supabase'e uygulandı
- [x] uret/route.ts — token parse + api_cost kayıt
- [x] Admin dashboard sayfasına maliyet bölümü + statik fiyat tablosu eklendi

**Dosyalar:** Migration (yeni), tüm API route'ları, admin dashboard sayfası

### NF-04: fal.ai Model Takip Scheduled Task (P2 — operasyon)

**Amaç:** fal.ai'deki kullandığımız modellerin yeni versiyonlarını haftalık kontrol et.

**Takip edilecek modeller:**
- `fal-ai/kling-video/*` → video üretim
- `fal-ai/bria/*` → RMBG + Product-Shot
- `fal-ai/fashn/*` → virtual try-on (NF-02 sonrası)
- `fal-ai/seedance/*` → premium video (NF-05 sonrası)

**Fix:**
- [ ] Cowork scheduled task oluştur: haftalık, Pazartesi
- [ ] Task: fal.ai'deki ilgili model endpoint'lerini kontrol et
- [ ] Yeni versiyon varsa: maliyet farkı, özellik farkı, breaking change kontrolü raporla
- [ ] Rapor formatı: "Güncel vs Yeni" karşılaştırma tablosu

### NF-05: Premium Video Tier — Seedance 2.0 (P3 — gelecek, yzstudio'nun 2. sekmesi olabilir)

**Karar (19 Nisan):** Şimdilik eklenmeyecek. Önce Kling 3.0 standart entegrasyonu mükemmelleştirilecek. Kullanıcı geldikten sonra talep olursa değerlendirilecek.

**Fırsat:** Seedance 2.0 fal.ai'de mevcut. 2K@60fps, native audio sync, 15sn'ye kadar. Sinematik kalite.
**Gerçek maliyet:** Fast tier ~$0.24/sn → 5sn = ~$1.21, standart ~$0.30/sn → 5sn = ~$1.50. Ses dahil, ek maliyet yok.
**Endpoint:** `bytedance/seedance-2.0/image-to-video` (fotoğraf → video destekliyor)
**Prompt tarzı:** Sinematografik — kamera terimleri (dolly, tracking, aerial), shot bazlı yapı, tek aksiyon/shot kuralı. Kling'den farklı prompt şablonu gerekir.

**Konumlandırma (gelecek):**
- Standart video: Kling v2.1 Std (mevcut) → 10 kredi (5sn) / 20 kredi (10sn)
- Premium video: Seedance 2.0 → kredi TBD (maliyet yüksek, ayrıca fiyatlanacak)

**Fix:**
- [ ] Yeni API route: `app/api/sosyal/video/premium/route.ts` (veya mevcut route'a tier parametresi ekle)
- [ ] fal.ai endpoint: `fal-ai/seedance/v2` (doğru endpoint'i docs'tan kontrol et)
- [ ] Frontend'de video sekmesine "Standart / Premium" seçeneği ekle
- [ ] Premium seçildiğinde kredi uyarısı göster ("Bu üretim 3 kredi harcar")
- [ ] Seedance parametreleri: resolution, duration, audio ayarları
- [ ] Test: aynı ürün fotoğrafıyla Kling vs Seedance karşılaştır

**Not:** Demo sonrası değerlendirilebilir. Fiyat noktası ($0.62) sürdürülebilir ama kredi/TL dengesine dikkat.

**Dosyalar:** `app/api/sosyal/video/route.ts` (veya yeni route), frontend video component

### NF-06: Kredi Tüketim UX — Bilgilendirme + Onay (P1 — UX)

**Amaç:** Kullanıcı her işlemde kaç kredi harcayacağını net görsün. Teknik terimler yok, sade dil.

**A) Tüm üretim butonlarına kredi badge'i:**

Her "Üret" butonunda kredi bilgisi yazılsın:
- `[İçerik Üret — 1 kredi]`
- `[Görsel Üret — 1 kredi]`
- `[Düzenle — 1 kredi]`
- `[Sosyal Paylaşım Üret — 1 kredi]`
- `[Sosyal Kit Üret — 2 kredi]`
- `[Mankene Giydirme — X kredi]` (yzstudio sayfasında, NF-02 — dinamik: num_samples × 3)
- Video butonları:
  - 5sn: `[Video Üret — 10 kredi]`
  - 10sn: `[Video Üret — 20 kredi]`

Badge stili: butonun sağında veya altında küçük, soluk text. Örn: `text-xs text-gray-400` veya buton içinde `— 1 kredi` şeklinde.

**B) Video sekmesinde süre seçimi:**

Süre seçimi zaten mevcut (5sn/10sn). Kredi badge'i seçime göre dinamik güncellenir:
- 5sn seçili: "Video Üret — 10 kredi"
- 10sn seçili: "Video Üret — 20 kredi"
(Ses toggle'ı ve model seçimi şimdilik yok — NF-01 P3, NF-05 P3.)

**C) 2+ kredi işlemlerde onay dialogu:**

Video (10-20 kredi), sosyal kit (2 kredi), yzstudio mankene giydirme (3-12 kredi) gibi 2+ kredi harcayan işlemlerde üretim öncesi onay:

```
┌─────────────────────────────────┐
│  Bu işlem 3 kredi harcar.       │
│  Kalan krediniz: 12             │
│                                 │
│  [Vazgeç]  [Devam Et]          │
└─────────────────────────────────┘
```

1 kredi işlemlerde dialog gösterilMEZ (akışı yavaşlatır).

**Fix:**
- [x] Ortak `<KrediButon>` component'i yaz: `label`, `kredi`, `onClick`, `disabled` props
- [x] Buton içinde kredi bilgisi render et (örn: `{label} — {kredi} kredi`)
- [x] `kredi >= 2` ise onClick'te onay dialog'u göster (confirm modal veya alert dialog)
- [x] Dialog: "Bu işlem {kredi} kredi harcar. Kalan krediniz: {kalan}. Devam?" + Vazgeç/Devam butonları
- [ ] Tüm üretim butonlarını `<KrediButon>` ile değiştir:
  - `components/tabs/MetinSekmesi.tsx` — içerik üret butonu
  - `components/tabs/GorselSekmesi.tsx` — görsel üret butonu  
  - `components/tabs/VideoSekmesi.tsx` — video üret butonu + model seçimi
  - `components/tabs/SosyalSekmesi.tsx` — caption üret + kit üret butonları
  - Düzenleme butonları (kısalt, genişlet, ton değiştir vb.)
- [ ] Video sekmesinde süre seçimine göre buton kredi badge'ini dinamik güncelle (5sn→10kr, 10sn→20kr)
- [ ] Mankene giydirme butonunda 3 kredi badge'i göster
- [ ] Test: her üretim tipinde doğru kredi gösterilsin, 2+ kredide dialog çıksın

**Dosyalar:** `components/ui/KrediButon.tsx` (yeni), tüm sekme component'leri, video sekmesi

---

## 🔧 TUR 8 AUDIT BULGULARI — Claude Code İçin (19 Nisan 2026)

### ✅ ÖRNEK İÇERİK REVİZYONU (P1 — yasal risk + etki artışı) — DONE a81ef53 + 367ea04
Ana sayfadaki demo listing örneği "Kütahya Porselen Çiçek Desenli Kahve Fincanı 6'lı Set" kullanıyordu.
**Sorun 1 — Yasal:** "Kütahya Porselen" tescilli marka (Güral Porselen A.Ş.). İzinsiz kullanım ihtarname riski taşır, site indekslendiğinde tespit edilebilir.
**Sorun 2 — Etki:** Tek pazaryeri formatında gösteriliyor. yzliste'nin asıl değer önerisi (aynı üründen 7 farklı pazaryeri çıktısı) görünmüyor.

**Fix — 3 adım:**

1. **Marka değişikliği:** "Kütahya Porselen" → hayali marka kullan. Öneri: "Anadolu Seramik" veya "Selin Porselen". Tüm başlık, açıklama ve etiketlerdeki "kütahya porselen" referanslarını değiştir.
   ```
   grep -rni "kütahya\|kutahya" app/ components/ --include="*.tsx" --include="*.ts" --include="*.json"
   ```

2. **Çoklu pazaryeri karşılaştırması:** Tek çıktı yerine 2-3 tab/kart göster: Trendyol formatı vs Amazon TR formatı vs Etsy formatı. Her birinde farklı karakter limiti, farklı SEO yapısı, farklı başlık formatı olsun. Bu yzliste'nin "her pazaryerine özel uyarlama" gücünü somut gösterir.
   - Trendyol: kısa başlık (max 100 karakter), Türkçe bullet'lar, fiyat odaklı
   - Amazon TR: uzun başlık (200 karakter), keyword-stuffed, A+ feature bullet'lar
   - Etsy: hikaye anlatımı, SEO tag'leri, İngilizce
   Bu tab yapısı zaten mevcut tasarım dilinden türetilebilir (fiyat kartları gibi pill/tab).

3. **Dosyalar:** `components/tanitim/FeaturesTabbed.tsx` — mevcut `ornekBolumler` array'i ve `ozellikTab === 0` bloğu.

**HAZIR VERİ:** `yzliste test/pazaryeri-listing-verileri.md` dosyasında 3 platform için tüm içerikler ve UI wireframe mevcut. Direkt oradan kopyala.

**Uygulama:**
- Mevcut `ornekBolumler` → sil, yerine `platformVerileri` objesini koy (Trendyol / Amazon TR / Etsy)
- `ozellikTab === 0` bloğuna 3 pill alt-tab ekle (Trendyol | Amazon TR | Etsy), yeni bir `useState` ile kontrol
- Her tab kendi platform rengiyle render edilsin (orange / amber / rose)
- Alt kısma küçük bilgi notu: "Her pazaryerinin kuralları farklı — yzliste hepsini tek fotoğraftan üretir."
- Etsy tab'ında section başlıkları İngilizce kalacak (Title, Features, Description, Tags)


### ✅ A-02: Footer'a KVKK + Çerez linki ekle (P1 — yasal zorunluluk) — DONE a81ef53
Footer link listesinde KVKK Aydınlatma ve Çerez Politikası linkleri eksik. Sayfalar var (/kvkk-aydinlatma, /cerez-politikasi) ama footer'dan erişilemiyor.
**Fix:** `components/Footer.tsx` (veya footer bileşeni neredeyse) link listesine ekle:
```tsx
<a href="/kvkk-aydinlatma">KVKK Aydınlatma</a>
<a href="/cerez-politikasi">Çerez Politikası</a>
```
Mevcut footer linkleri: Fiyatlar, Blog, Hakkımızda, Kullanım Koşulları, Gizlilik Politikası, Mesafeli Satış, Teslimat ve İade. Bunların arasına ekle.

### ✅ G-09: Fiyat kartları CTA netliği (P1) — DONE a81ef53
Fiyat kartlarında CTA "Başla" yazıyor — ne olacağı belli değil. Fiyatı dahil et.
**Fix:** `app/fiyatlar/page.tsx` veya fiyat bileşenindeki butonları değiştir:
- "Başla" → "Satın Al — 39₺" (Başlangıç)
- "Başla" → "Satın Al — 99₺" (Popüler)
- "Başla" → "Satın Al — 249₺" (Büyük)

### ✅ G-12 / UX-16: Video kredi başlığı dinamik olsun (P1) — DONE (zaten dinamikti, doğrulandı)
Video sekmesinde başlık "5 içerik üretim kredisi" yazıyor ama 10sn seçince 8 kredi. Yanıltıcı.
**Fix:** Video süre seçimine göre başlığı dinamik yap:
```tsx
// Şu an sabit: "5 içerik üretim kredisi"
// Yeni: süreye göre değişsin
const videoKredi = sureSec === "5" ? 5 : 8;
// Başlık: `${videoKredi} içerik üretim kredisi`
```
**Dosya:** Muhtemelen `components/tabs/VideoSekmesi.tsx` veya `/uret` page.tsx video bölümü.

### ✅ OG IMAGE (Sosyal Paylaşım Görseli) DEĞİŞTİR (P1) — DONE 41f2729
Mevcut `/public/og-image.png` turuncu arka planlı, eski metin ("E-ticaret listing için en kolay çözüm"), brand renk paletiyle uyumsuz.
**Yeni görsel hazır:** `yzliste test/og-image-new.png` — indigo gradient, Poppins font, 1200x630, 37KB.
İçerik: "yzliste / Ürününü anlat, içeriğini al / Metin · Görsel · Video · Sosyal Medya Postu" — büyük fontlar (logo 96px, tagline 46px, alt 28px), WhatsApp thumbnail'da bile okunur
**Fix:**
1. `cp yzliste\ test/og-image-new.png public/og-image.png` (eski görseli override et)
2. Meta description'ları güncelle — şu an "listing metni ve stüdyo görseli üret" yazıyor, yeni: "metin, görsel, video ve post içeriği üret"
3. Güncellenmesi gereken dosyalar:
   - `app/layout.tsx` → `description` ve `openGraph.description` alanları
   - `app/page.tsx` → `description` ve `openGraph.description` alanları
4. Deploy sonrası `https://www.opengraph.xyz/` ile test et

### HERO VIDEO TAM VERSİYON + KIRPMASIZ GÖRÜNTÜLEME (P1 — 19 Nisan 2026)

**Sorun:** Şu an `public/hero-video.mp4` sadece ofisteki kadını gösteren 10 saniyelik kırpılmış versiyon. Overlay yazıları (Listing metni, Ürün görseli, Ürün videosu, Sosyal medya), kutu açan kadın sahnesi ve liman kapanışı yok. Ayrıca video `object-cover` ile kırpılıyor.

**Fix — 3 adım:**

1. **Video dosyasını değiştir:**
   `yzliste test/hero-video-draft.mp4` → `public/hero-video.mp4` olarak kopyala (eski 10s dosyayı override et).
   Yeni: 20sn, 1280x720, 6.6MB, h264, sessiz. 3 sahne + text overlay'ler + liman kapanışı.

2. **Poster'ı güncelle:**
   `public/hero-poster.jpg` olarak aşağıdaki komutu çalıştır:
   ```bash
   ffmpeg -y -ss 5 -i "yzliste test/hero-video-draft.mp4" -frames:v 1 -q:v 2 public/hero-poster.jpg
   ```
   Bu 5. saniyedeki kareyi alır — overlay yazıları görünür durumda.

3. **CSS: Videoyu kırpmadan göster (`AuthHero.tsx`):**
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
   - `bg-gray-900` kalır — eğer kenarlardan boşluk olursa koyu arka plan gösterir
   - İçerik overlay (`z-10` div): padding'leri kontrol et, mobilde `py-8` yeterli olabilir (aspect-video mobilde daha kısa)

   ⚠️ Mobil not: `aspect-video` mobilde ~210px yükseklik verir (375px genişlikte). Bu az gelebilir — metinler + butonlar sığmazsa mobilde min-h ekle:
   ```tsx
   <section className="relative overflow-hidden aspect-video min-h-[60vh] sm:min-h-0 flex items-center bg-gray-900">
   ```
   `min-h-[60vh]` sadece mobilde devreye girer (sm:min-h-0 ile sıfırlanır). Mobilde video `object-contain` ile yukarıda gösterilir, altta koyu alan kalır.

**Test:**
- [ ] Desktop (1440px+): Video kırpılmadan tam gösteriliyor, 3 sahne + overlay'ler visible
- [ ] Tablet (768px): Video ve metinler dengeli
- [ ] Mobil (375px): Video tam görünüyor (ya da kırpılma minimal), metinler + butonlar sığıyor
- [ ] Video 20 saniyelik loop düzgün dönüyor
- [ ] Poster (mobilde) overlay yazıları gösteriyor

**Dosyalar:** `components/tanitim/AuthHero.tsx`, `public/hero-video.mp4`, `public/hero-poster.jpg`

---

### ✅ HERO VIDEO RESPONSIVE FIX v1 (P1 — eski) — DONE 1a3607b
`components/tanitim/AuthHero.tsx` — hero video mobilde sadece ortası görünüyor (metinler kayıp), desktop'ta üst-alttan kırpılıyor.

**Kök sebep:**
- Container: `min-h-[520px] sm:min-h-[580px]` sabit yükseklik
- Video: `object-cover` → video container'ı doldurmaya zorlanıyor, oran uyumsuzluğunda kırpılıyor
- Video dosyası: 1280x720 (16:9), container genişlik/yükseklik oranı farklı olunca kırpılma kaçınılmaz
- Mobilde container çok kısa kalıyor, metinler + butonlar sığmayabiliyor

**Fix — `components/tanitim/AuthHero.tsx`:**

1. **Container'a aspect-ratio ekle, min-h'yi esnet:**
```tsx
// ESKİ:
<section className="relative overflow-hidden min-h-[520px] sm:min-h-[580px] flex items-center bg-gray-900">

// YENİ:
<section className="relative overflow-hidden min-h-[80vh] md:min-h-[70vh] lg:aspect-video flex items-center bg-gray-900">
```
- Mobilde `min-h-[80vh]` → ekranın %80'i, metinler rahat sığar
- Desktop'ta `lg:aspect-video` → 16:9 oran, video tam oturur
- `object-cover` kalabilir ama kırpılma çok azalır çünkü container video ile aynı orana yaklaşır

2. **Alternatif yaklaşım — object-contain + bg:**
Eğer videonun hiç kırpılmaması isteniyorsa:
```tsx
// Video element:
<video className="absolute inset-0 w-full h-full object-contain bg-gray-900 brightness-[0.4]" />
```
`object-contain` video'yu tam gösterir, kenarlardan boşluk kalırsa `bg-gray-900` kaplar. Ama bu durumda mobilde video çok küçük kalabilir.

3. **En iyi hibrit çözüm:**
```tsx
<section className="relative overflow-hidden flex items-center bg-gray-900"
  style={{ minHeight: 'max(520px, 60vh)' }}>
  <video
    autoPlay loop muted playsInline
    className="absolute inset-0 w-full h-full object-cover brightness-[0.4]"
    style={{ objectPosition: 'center 40%' }}
    src="/hero-video.mp4"
  />
```
- `minHeight: max(520px, 60vh)` → hem küçük ekranlarda hem büyük ekranlarda uyumlu
- `objectPosition: center 40%` → kırpılma yukarıdan daha az, aşağıdan daha çok olur (genelde önemli içerik ortada/üstte)

4. **Mobil metin okunabilirliği:**
- Kontrol et: `text-4xl md:text-5xl` mobilde yeterince büyük mü?
- `px-6` padding mobilde yeterli mi? `px-4` daha iyi olabilir.
- CTA butonları `flex-col sm:flex-row` — mobilde alt alta, doğru.

**Test:**
- [ ] Mobil (375px): Video kırpılması minimal, metinler + butonlar tam görünür
- [ ] Tablet (768px): Video ve metinler dengeli
- [ ] Desktop (1440px): Video tam oranında veya minimal kırpılmayla görünür
- [ ] Çok geniş ekran (1920px+): Video çirkin gerilmez

**Dosya:** `components/tanitim/AuthHero.tsx`

**Yeni video dosyaları hazır — `yzliste test/` klasöründe:**
- `hero-video.mp4` — 1280x720, 10sn, 1.4MB, overlay'sız temiz video, fade in/out döngü uyumlu, h264, sessiz
- `hero-poster.jpg` — 1280x720, 93KB, en iyi kareden still (mobilde statik olarak kullanılacak)

**Claude Code talimatı:**
1. `yzliste test/hero-video.mp4` → `public/hero-video.mp4` olarak kopyala (eski 6.8MB dosyayı override eder — yeni 1.4MB)
2. `yzliste test/hero-poster.jpg` → `public/hero-poster.jpg` olarak kopyala
3. `AuthHero.tsx`'deki `<video>` tag'ine poster ekle ve mobilde statik göster:
```tsx
{/* Mobilde statik poster (performans), desktop'ta video */}
<img
  src="/hero-poster.jpg" alt=""
  className="absolute inset-0 w-full h-full object-cover brightness-[0.4] md:hidden"
/>
<video
  autoPlay loop muted playsInline
  poster="/hero-poster.jpg"
  className="absolute inset-0 w-full h-full object-cover brightness-[0.4] hidden md:block"
  src="/hero-video.mp4"
/>
```

---

### ✅ ADMIN PANELİ YENİDEN YAPI (P0 — kırık + güvenlik) — DONE 4a02806
Admin paneli (`/admin`) çalışmıyor. `azizkose@gmail.com` ile giriş yapılsa bile sayfa yükleniyor ama veri gelmiyor veya anasayfaya yönlendiriyor.

**Kök sebepler:**
1. **RLS engelliyor:** Sayfa `supabase` client (anon key) ile `profiles.select("*")` ve `uretimler.select("*")` çalıştırıyor. RLS her kullanıcının sadece kendi verisini görmesine izin veriyor → admin tüm kullanıcıların verisini çekemiyor → count=0 veya hata → sayfa boş/crash.
2. **Client-side kontrol güvensiz:** Admin kontrolü `user.email !== NEXT_PUBLIC_ADMIN_EMAIL` ile browser'da yapılıyor. Bu bypass edilebilir. `NEXT_PUBLIC_` prefix'i admin email'ini client bundle'a expose ediyor.
3. **Middleware koruması yok:** `/admin` `PROTECTED_PATHS`'de değil. Giriş yapmamış biri bile URL'e erişebilir.

**Çözüm — Server Component + API Route mimarisi:**

Admin panelini server-side'a taşı. Bu hem RLS sorununu çözer (service key kullanılır) hem güvenliği sağlar.

**Adım 1 — Admin API route oluştur**
`app/api/admin/metrics/route.ts` — yeni dosya:
```ts
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

// Mevcut feedback route'taki checkAdmin() fonksiyonunu buraya da kopyala
// (is_admin flag'ini DB'den kontrol eden güvenli versiyon)

export async function GET(req: NextRequest) {
  if (!(await checkAdmin(req))) {
    return NextResponse.json({ hata: "Yetkisiz" }, { status: 403 });
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!  // Service key — RLS bypass
  );

  // Mevcut metrikleriYukle() içindeki tüm sorguları buraya taşı:
  // toplamKullanici, toplamUretim, bugunUretim, buHaftaUretim,
  // toplamKredi, tokenData, platformDagilim, girisTipiDagilim,
  // sonKullanicilar, sonUretimler

  return NextResponse.json(metrikler);
}
```
**Referans:** `app/api/admin/feedback/route.ts` — `checkAdmin()` fonksiyonu zaten burada var, aynı pattern'i kullan.

**Adım 2 — Admin sayfasını güncelle**
`app/admin/page.tsx` değişiklikleri:
- Email kontrolünü KALDIR. Yerine API route'a fetch yap — API zaten `is_admin` kontrolü yapıyor.
- `supabase.from("profiles").select(...)` gibi direkt DB sorgularını KALDIR. Yerine:
```ts
const res = await fetch("/api/admin/metrics", {
  headers: { Authorization: `Bearer ${session.access_token}` }
});
if (!res.ok) { router.push("/"); return; }
const data = await res.json();
setMetrik(data);
```
- `NEXT_PUBLIC_ADMIN_EMAIL` env değişkenini kullanmayı bırak.

**Adım 3 — Middleware'e `/admin` ekle**
`middleware.ts` → `PROTECTED_PATHS` dizisine `/admin` ekle:
```ts
const PROTECTED_PATHS = ['/app', '/hesap', '/kredi-yukle', '/profil', '/admin']
```

**Adım 4 — `is_admin` flag'ini doğrula**
Supabase'de `azizkose@gmail.com` kullanıcısının `profiles.is_admin = true` olduğunu kontrol et:
```sql
SELECT id, email, is_admin FROM auth.users u JOIN public.profiles p ON u.id = p.id WHERE u.email = 'azizkose@gmail.com';
```
Eğer `is_admin` false veya null ise → true yap:
```sql
UPDATE public.profiles SET is_admin = true WHERE id = (SELECT id FROM auth.users WHERE email = 'azizkose@gmail.com');
```

**Adım 5 — NEXT_PUBLIC_ADMIN_EMAIL kaldır**
`.env.local` ve `.env` dosyalarından `NEXT_PUBLIC_ADMIN_EMAIL` satırını sil. Artık kullanılmıyor.

**Adım 6 — Robots.ts güncelle**
`app/robots.ts` → disallow listesine `/admin` ekle (zaten olabilir, kontrol et):
```ts
disallow: ["/api/", "/admin", "/hesap", ...]
```

**Doğrulama:**
- [ ] `/admin` — `azizkose@gmail.com` ile giriş yapınca metrikler yükleniyor
- [ ] `/admin` — başka kullanıcı ile giriş yapınca anasayfaya yönleniyor
- [ ] `/admin` — giriş yapmadan erişilemiyor (middleware redirect)
- [ ] Tüm metrikler doğru (toplam kullanıcı, üretim, token, maliyet)
- [ ] `NEXT_PUBLIC_ADMIN_EMAIL` env'den kaldırılmış

---

### ✅ GİRİŞ SAYFASI TEMİZLİK (P2 — UX) — DONE 6315411
`/giris` sayfasında "Hesabın yok mu? Ücretsiz oluştur" metni gereksiz — hemen altında zaten "🎁 Kayıt Ol" tab butonu var. İkisi aynı şeyi söylüyor.
**Fix:** "Hesabın yok mu? Ücretsiz oluştur" satırını kaldır. "Kayıt Ol" tab'ı yeterli.
**Dosya:** `app/giris/page.tsx` veya auth modal bileşeni — `grep -rn "Hesabın yok mu" app/ components/` ile bul.

---

### ✅ HESAP MERKEZİ BİRLEŞTİRME — `/profil` → `/hesap/profil` (P1 — yapısal) — DONE 2d2fcbd
`/profil` bağımsız route'ta duruyor ama mantıken `/hesap` ailesine ait. Şifre değiştirme hem `/profil` hem `/hesap/ayarlar`'da var. Üretim geçmişi 2 yerde. Kredi bilgisi 3 farklı değer gösteriyor. Title tag'ler eksik. Yapıyı tek çatı altında topla.

**Hedef yapı:**
```
/hesap              → Dashboard (mevcut, değişmez)
/hesap/profil       → Kişisel/fatura bilgileri + Marka profili (yeni, /profil'den taşınacak)
/hesap/krediler     → Kredi bakiye + ödeme geçmişi (mevcut, değişmez)
/hesap/faturalar    → e-Arşiv faturalar (mevcut, değişmez)
/hesap/ayarlar      → Email, şifre, çıkış, veri indir, hesap sil (mevcut, değişmez)
/profil             → 301 redirect → /hesap/profil (eski URL korunur)
```

---

**Adım 1 — `/hesap/profil` sayfasını oluştur**
`app/(auth)/hesap/profil/page.tsx` dosyasını değiştir — mevcut redirect'i kaldır, `app/profil/page.tsx` kodunu taşı.
Taşırken şu değişiklikler:
- **Şifre değiştirme bölümünü KALDIRIN** (satır ~458-488). Zaten `/hesap/ayarlar`'da var.
- **"Hesap Güvenliği" bölümünü KALDIRIN** (hesap silme linki dahil). Zaten `/hesap/ayarlar`'da var.
- Metadata ekle: `title: "Profil | yzliste"`, `description: "Kişisel bilgiler, fatura ayarları ve marka profili"`
- Sayfa üstüne `← Hesap` geri butonu ekle (diğer alt sayfalarla tutarlı):
```tsx
<Link href="/hesap" className="text-sm text-gray-500 hover:text-gray-700">← Hesap</Link>
```

---

**Adım 2 — `/profil`'i redirect'e çevir**
`app/profil/page.tsx` — tüm kodu sil, sadece redirect bırak:
```tsx
import { redirect } from "next/navigation";
export default function OldProfilPage() {
  redirect("/hesap/profil");
}
```
`app/profil/layout.tsx` varsa sil veya minimal tut (redirect için layout gerekmez).

---

**Adım 3 — Linkleri güncelle (5 dosya)**
```bash
grep -rn 'href="/profil"' app/ components/ --include="*.tsx"
```
Bilinen referanslar:
1. `app/(auth)/hesap/page.tsx` (satır ~177) — Profil kartı href → `/hesap/profil`
2. `app/uret/page.tsx` (satır ~214) — Profil eksik uyarısı linki → `/hesap/profil`
3. `app/uret/page.tsx` (satır ~427) — İkinci profil linki → `/hesap/profil`
4. `components/tabs/GorselSekmesi.tsx` (satır ~72) — Profil linki → `/hesap/profil`
5. **Tüm diğer geçişleri grep ile bul ve güncelle**

---

**Adım 4 — Middleware güncelle**
`middleware.ts` (satır ~4): `PROTECTED_PATHS` dizisinden `/profil`'i kaldır. `/hesap` zaten korumalı, `/hesap/profil` otomatik olarak korunacak.
```ts
// ESKİ: const PROTECTED_PATHS = ['/app', '/hesap', '/profil', '/kredi-yukle']
// YENİ: const PROTECTED_PATHS = ['/app', '/hesap', '/kredi-yukle']
```

---

**Adım 5 — Title tag'leri düzelt**
Şu anda `/hesap/ayarlar` ve `/hesap/faturalar` generic title gösteriyor ("yzliste — Ürünün için metin...").
Her alt sayfaya metadata ekle:
- `app/(auth)/hesap/ayarlar/page.tsx` → `export const metadata = { title: "Ayarlar | yzliste" }`
- `app/(auth)/hesap/faturalar/` → `export const metadata = { title: "Faturalar | yzliste" }`
- `app/(auth)/hesap/krediler/page.tsx` → kontrol et, yoksa ekle

---

**Adım 6 — Üretim geçmişi linki düzelt**
`/hesap` dashboard'daki "Tüm üretim geçmişini gör →" linki nereye gidiyor kontrol et:
- Eğer `/profil`'e gidiyorsa → `/hesap/profil` olarak güncelle
- Eğer tıklanamıyorsa (span/div) → `<a href="/hesap/profil">` yap

---

**Adım 7 — Robots.ts güncelle**
`app/robots.ts` (satır ~8): `/profil` disallow kuralını kaldır (artık `/hesap` altında zaten disallow).

---

**Adım 8 — Doğrulama**
Tüm değişiklik sonrası kontrol listesi:
- [ ] `/hesap` → Profil kartı → `/hesap/profil` açılıyor
- [ ] `/profil` → otomatik `/hesap/profil`'e yönleniyor
- [ ] `/hesap/profil` — kişisel bilgiler, fatura, marka profili çalışıyor
- [ ] `/hesap/profil` — şifre bölümü YOK (sadece `/hesap/ayarlar`'da)
- [ ] `/hesap/ayarlar` — title "Ayarlar | yzliste"
- [ ] `/hesap/faturalar` — title "Faturalar | yzliste"
- [ ] `/uret` — profil eksik uyarısı `/hesap/profil`'e yönlendiriyor
- [ ] Middleware: `/hesap/*` auth koruması çalışıyor
- [ ] Header "Hesabım" → `/hesap` → tüm alt sayfalara sorunsuz navigasyon

**Etkilenen dosyalar (toplam ~8-11):**
`app/(auth)/hesap/profil/page.tsx`, `app/profil/page.tsx`, `app/(auth)/hesap/page.tsx`, `app/uret/page.tsx`, `components/tabs/GorselSekmesi.tsx`, `middleware.ts`, `app/robots.ts`, `app/(auth)/hesap/ayarlar/page.tsx`, `app/(auth)/hesap/faturalar/*/page.tsx`, `app/(auth)/hesap/krediler/page.tsx`

**Kırılma riskleri:**
- Middleware path değişimi sırasında geçici auth sorunu olabilir → tüm değişiklikleri tek commit'te yap
- `/profil` bookmark'ı olan kullanıcılar → redirect ile korunur
- Supabase sorguları aynı kalıyor, veri katmanı etkilenmez

### DASHBOARD İYİLEŞTİRMELERİ (P2 — UX + dönüşüm) — D-01/D-02 DONE 3b2efc1
`/hesap` dashboard çalışıyor ve veri doğru besleniyor. Ama bir SaaS dashboard'u olarak eksikleri var:

**✅ D-01: "Tahmini Tasarruf" kartını kaldır veya düzelt (P2) — DONE 3b2efc1**
"Toplam Üretim" kartıyla değiştirildi. Gerçek sayı uretimler tablosundan geliyor.

**✅ D-02: Kredi 0 olduğunda dashboard'a CTA banner ekle (P1) — DONE 3b2efc1**
Kırmızı banner (kredi=0) + amber banner (düşük kredi) ayrı state olarak eklendi. Banner sadece profil verisi geldiğinde gösteriliyor (false-positive düzeltildi — commit 61eb41d).

**✅ D-03: Platform dağılımı göster (P2) — DONE 2f2b434**
Horizontal bar chart, son üretimler üzerinde, tüm platformlar sıralı.

**✅ D-04: Son üretimlere "Tümünü Gör" linki ekle (P2) — DONE 2f2b434**
"Tüm üretim geçmişini gör →" linki /profil'e eklendi.

**✅ D-05: Krediler sayfasında paket bilgisi göster (P2) — DONE 2f2b434**
"Son Satın Alınan" indigo kartı eklendi. payments tablosundan son başarılı ödeme çekiliyor.

### ✅ "6 Pazaryeri" → "7 Pazaryeri" düzeltmesi (P1 — tüm site) — DONE a81ef53
Site genelinde "6 pazaryeri" yazıyor ama gerçekte 7 platform destekleniyor:
Trendyol, Hepsiburada, Amazon TR, N11, Etsy, Amazon USA = 6 ayrı seçenek ama Amazon TR + Amazon USA ayrı sayılır → **7 pazaryeri**.

**Fix:** Aşağıdaki dosyalarda "6" → "7" değiştir:
1. `/uret` sayfası: `heading "6 Pazaryeri için AI İçerik Üreticisi"` → `"7 Pazaryeri için AI İçerik Üreticisi"`
2. Landing page badge: varsa "6 platform desteği" → "7 platform desteği"
3. `grep -rn "6 [Pp]azaryeri\|6 platform" app/ components/` ile tüm geçişleri bul ve düzelt.
4. Meta description, title tag veya schema'da varsa orada da düzelt.

### ✅ G-08: Kredi başına maliyet vurgusu (P2) — DONE a81ef53 (tüm kartlarda X,XX₺/kredi)
Fiyat kartlarında kredi başına fiyat yok. Büyük pakette (249₺/100 kredi = 2.49₺/kredi) tasarruf belli değil.
**Fix:** Her paketin altına küçük yazıyla kredi başına fiyat ekle:
- Başlangıç: "3.90₺ / kredi"
- Popüler: "3.30₺ / kredi"
- Büyük: "2.49₺ / kredi — en ekonomik"

### ✅ G-13: /hesap empty state (P2) — DONE 23fe4d2
Hiç üretim yapmamış kullanıcı için /hesap sayfası boş tablo gösteriyor.
**Fix:** Üretim sayısı 0 ise tablo yerine motivasyon mesajı göster:
```tsx
{uretimSayisi === 0 ? (
  <div className="text-center py-12">
    <p className="text-gray-500 mb-4">Henüz üretim yapmadın</p>
    <a href="/uret" className="bg-indigo-500 text-white px-6 py-3 rounded-xl">
      İlk içeriğini üret →
    </a>
  </div>
) : (
  // mevcut tablo
)}
```

---

## 🚨 ACİL — Hemen Yap (19 Nisan 2026, Aziz canlı test ediyor)

### ✅ 1. RMBG fix DEPLOY ET (T7-08) — DONE 6eaed50 push ile canlıya alındı

### ✅ 2. `/hesap/*` data fetching kırık (T7-01/02/03 — P0) — DONE (e032172: useCredits() + useCurrentUser() hook'larına bağlandı)
`/hesap` dashboard: kredi=0, üretim=0, gelir=0. `/hesap/krediler`: Mevcut Kredi=0. `/hesap/ayarlar`: E-posta="—".
Ama `/uret` sidebar doğru çalışıyor (24 kredi, 19+ üretim).
**Debug adımları:**
1. `/hesap` sayfalarının kullanıcı verisini nasıl çektiğini bul: `grep -rn "useCredits\|useCurrentUser\|kredi\|credits" app/(auth)/hesap/`
2. `/uret` sidebar'daki hook ile karşılaştır — neden biri çalışıp diğeri çalışmıyor?
3. Muhtemel sebepler: (a) farklı hook kullanılıyor, (b) Supabase session `/hesap` layout'unda yüklenmiyor, (c) TanStack Query cache boş başlıyor
4. Fix: `/uret`'teki çalışan `useCredits()` hook'unu `/hesap` sayfalarında da kullan. Veya kök sebep ne ise onu düzelt.
**Dosyalar:** `app/(auth)/hesap/page.tsx`, `app/(auth)/hesap/krediler/page.tsx`, `app/(auth)/hesap/ayarlar/page.tsx`

### ✅ 3. Sosyal Medya görseli üstteki fotoğrafı görmüyor (T7-07 — P1) — DONE

### 4. ✅ `/profil` hesap silme eski pattern + duplikasyon (T7-09 — P1) — DONE
`/profil` sayfasında "Hesabı Sil" bölümü kaldırıldı, `/hesap/ayarlar`'a link ile değiştirildi. `/hesap/ayarlar`'da ise checkbox + modal ile düzgün yapılmış.
**Sorun:** Hesap silme iki yerde var — kullanıcı hangisini kullanacağını bilmiyor + biri eski UX.
**Fix:** `/profil/page.tsx`'teki "Hesabı Sil" bölümünü (satır ~500-510) tamamen kaldır. Yerine `/hesap/ayarlar`'a yönlendiren bir link koy:
```tsx
// ESKİ: SİL yazdırma + buton (satır 500-510 civarı)
// YENİ:
<p className="text-sm text-gray-500">Hesap ayarlarını değiştirmek veya hesabını silmek için 
  <a href="/hesap/ayarlar" className="text-indigo-600 hover:underline ml-1">Hesap Ayarları</a>'na git.
</p>
```
**Dosya:** `app/profil/page.tsx` — "Hesabı Sil" bölümü (satır 498-510) + ilgili state'ler (silmeOnayMetni, silmeMesaj, siliniyor) temizlensin.

### ✅ 5. UX metin düzeltmeleri (UX-01~03, UX-14~16) — DONE
UX-01~03, UX-14~16 hepsi tamamlandı. Detaylar aşağıda "UX Tutarlılık" bölümünde [x] işaretli.

---

> **Son tarama: 2026-04-19 (Tur 8)** — Audit + Growth denetimi (son deploy). A-01~A-12 + G-01~G-16 bulguları. Skor 5.0→6.6/10. "6 pazaryeri"→"7 pazaryeri" düzeltmesi eklendi.
> **Tur 7: 2026-04-19** — Manuel A-Z test: footer sayfaları + header/footer audit + hesap sayfaları + görsel/video UI. T7-01~T7-06 eklendi.
> **Küme 0 güncellemesi: 2026-04-17** — PQ-01~PQ-10 tamamlandı.
> **QA Tur 3 konsolide (2026-04-18):** 28 bulgu (Tur 1: 14, Tur 2 regresyon, Tur 3: 5 yeni). 6 düzeldi, 3 kısmen, 13 açık, 1 kötüleşti. QA-01~QA-21 olarak konsolide edildi. En kritik: QA-10 (şifre sıfırlama 400), QA-14 (auth-aware header kök neden).
> **Haftalık audit (2026-04-18):** 13/13 sayfa 200 ✅, SSL OK, ort. 0.75s. 6 uyarı → HC-01~HC-06 eklendi. QA-12 (/fiyatlar CTA) düzelmiş. /auth sitemap'te hâlâ var.
> **Cowork audit notu (2026-04-18):** Bazı yerel dosyalar truncate durumda (Cowork+Claude Code çakışması). Git HEAD doğru — `git checkout -- .` ile restore edilmeli (`index.lock` silinmeli önce).

---

## 🔥 KÜME 0 — İçerik Kalitesi (EN ÖNCELİKLİ — Demo için kritik)
Bu küme firmalara demo göstermek için gerekli. Diğer her şeyden önce gelir.
Detaylı prompt içerikleri ve implementasyon rehberi: **PROMPT-REHBER.md** dosyasına bak.

### P0 — Acil (maliyet + kredi modeli değişikliği)
- [x] **PQ-00** ⚠️ ÇOKLU STİL SEÇİMİ + MALİYET OPTİMİZASYONU — Büyük değişiklik, 5 dosya etkileniyor.
  **Konsept:** Kullanıcı birden çok stil seçebilsin. Her stil = 1 görsel = 1 kredi. Kredi üretimde düşer, indirme bedava.
  **API (`app/api/gorsel/route.ts`):**
  1. `stiller: string[]` (dizi) kabul et, tek `stil: string` yerine (geriye uyumluluk: tek string gelirse diziye çevir)
  2. Kredi kontrolü: `stiller.length` kadar kredi gerekli — atomik kontrol (`gte("kredi", stiller.length)`)
  3. Kredi düşürmeyi ÜRETİMDE yap (download'da değil!)
  4. Her stil için ayrı `fal.queue.submit` → requestId dizisi döndür
  5. `placement_type: "manual_placement"` + `pozisyonSec(stil, sosyalFormat)` — ⛔ `automatic` KULLANMA (10x maliyet!)
  6. `num_results: 1` + `fast: true` — her çağrı = 1 görsel = ~$0.012
  7. Response: `{ jobs: [{ requestId, label, stil }...], isAdmin }`
  **Download (`app/api/gorsel/download/route.ts`):**
  8. Kredi düşürme KALDIR — indirme artık bedava
  9. Birden çok requestId kabul et → ZIP'le
  **Frontend (`app/page.tsx`):**
  10. `seciliStil: string` → `seciliStiller: Set<string>` (çoklu seçim)
  11. "özel" ve "referans" stilleri exclusive kalsın (diğerleriyle birlikte seçilemez)
  12. Buton: "✨ X Görsel Üret — X kredi" (seçili stil sayısına göre dinamik)
  13. `gorselJob` → `gorselJoblar: Array` (çoklu iş)
  14. Sonuç: N görsel, her biri stil etiketiyle + tekli indirme butonu
  15. `indirmeHakki` sistemi kaldır (artık gereksiz — kredi üretimde düşüyor)
  16. Her görsel altında "🔄 Beğenmedim" butonu → sadece O stili yeniden üret (1 kredi)
  **Poll (`app/api/gorsel/poll/route.ts`):**
  17. Birden çok requestId'yi tek çağrıda poll edebilsin (veya frontend paralel poll etsin)
  ⚠️ UI metinleri (açıklama paragrafları, tooltip'ler) şimdilik değişmeyebilir — metin revizyonu ayrı yapılacak. Ama buton ve sayaç metinleri fonksiyonel olduğu için güncellenMELİ.
  Detay: `PROMPT-REHBER.md § Çoklu Stil Seçimi + Maliyet Optimizasyonu`
- [x] **PQ-01** Video şablonlarını hang-safe yap: 4 mevcut şablonun prompt'larını güncelle (`app/page.tsx` video preset'leri + `app/api/sosyal/video/route.ts` otomatik prompt). Her harekete bitiş noktası ekle. Detay: `PROMPT-REHBER.md § Video Şablonları`
- [x] **PQ-02** Eski caption route'u kaldır: `app/api/sosyal/caption/route.ts` sil. `app/api/sosyal/route.ts` zaten daha gelişmiş ve 4 platform destekliyor. Frontend'de bu route'a istek atan kodu bul ve sosyal/route.ts'e yönlendir

### P0 — SEO Acil (Search Console bulguları — indeksleme sorunları)
- [x] **PQ-24** Canonical tag eksikliği + www tutarsızlığı giderildi:
  - `/auth/layout.tsx` oluşturuldu — metadata + canonical eklendi
  - Root `layout.tsx`'e canonical eklendi (`https://www.yzliste.com`)
  - `/fiyatlar`, `/blog`, `/blog/[slug]` canonical'ları `www.yzliste.com`'a düzeltildi
  - Sitemap'te `/auth` priority 1→0.8'e düşürüldü, `/` en üstte
- [x] **PQ-25** Sitemap'ten korumalı sayfaları çıkar: `/hesap/*`, `/odeme/*` sitemap'ten çıkarıldı. ⚠️ **Eksik:** `/auth` hâlâ sitemap'te (priority 0.8) — kaldırılmalı çünkü login olmayan kullanıcıları `/giris`'e redirect ediyor.
- [x] **PQ-26** Auth redirect'i Google-safe yap: Korumalı sayfalara Googlebot geldiğinde redirect yerine 403/404 dönmeli veya sitemap'ten çıkarılmalı. "Page with redirect" sorununu çözer.
- [x] **PQ-27** ~~`http://www.yzliste.com/` "Crawled – not indexed"~~ **MANUEL AKSİYON** — Search Console'da "URL Denetimi"nden reindex istenmeli. Aziz'in yapması gereken: `search.google.com/search-console → URL Denetimi → https://www.yzliste.com/ → "Dizine Eklenmeyi İste"`. Kod tarafında yapılacak iş yok.

### P1 — Görsel Pipeline (kaliteyi 2x artırır)
- [x] **PQ-03** Görsel pipeline'a RMBG ekle: `fal-ai/bria/rmbg` endpoint'ini çağır, arka planı kaldır, SONRA product-shot'a gönder. `app/api/gorsel/route.ts`'de foto upload sonrası RMBG adımı ekle. Detay: `PROMPT-REHBER.md § Görsel Pipeline`
- [x] **PQ-04** ~~Görsel'de placement_type'ı "automatic" yap~~ **İPTAL — automatic 10x maliyet artırır.** ⚠️ Şu an kodda `automatic` aktif! PQ-00 bunu düzeltecek → `manual_placement` + `pozisyonSec()`. PQ-00 yapılınca otomatik çözülür.
- [x] **PQ-05** Kategori → stil önceliklendirme: Kategori seçiliyse stil kartlarını önerilen sıraya göre sırala. Mapping: `PROMPT-REHBER.md § Kategori-Stil Eşleştirme`

### P1 — Metin Kalitesi (içerik farkını yaratır)
- [x] **PQ-06** Metin formuna 3 yeni input ekle — tüm platform'larda geçerli:
  1. `hedefKitle` dropdown: Genel / Kadınlar / Erkekler / Gençler / Ebeveynler / Profesyoneller / Sporcular
  2. `fiyatSegmenti` radio: Bütçe / Orta / Premium
  3. `anahtarKelimeler` input: Virgülle ayrılmış serbest metin
  Bu 3 alan sistemPromptOlustur()'a parametre olarak gidecek ve prompt'a eklenecek. Detay: `PROMPT-REHBER.md § Yeni Input Prompt Entegrasyonu`
- [x] **PQ-07** Kategori-bazlı prompt katmanı: `KATEGORI_KURALLARI` objesi oluştur (7 kategori). Kullanıcının seçtiği kategoriye göre ICERIK_KURALLARI'na ek kurallar inject et. Detay: `PROMPT-REHBER.md § Kategori Prompt Katmanı`
- [x] **PQ-08** Platform yasaklı kelime listelerini genişlet: Her platform için ayrı bannedWords[] dizisi. Prompt'a "Bu kelimeleri ASLA kullanma:" olarak inject et. Detay: `PROMPT-REHBER.md § Yasaklı Kelimeler`

### P1 — UX Düzeltmeleri (kullanıcı deneyimi + hata yönetimi)
- [x] **PQ-16** Video textarea TR gösterimi: Preset'e tıklayınca textarea'da İngilizce prompt görünüyor — kullanıcı bunu görmemeli. `app/page.tsx` video preset yapısına `goster` (TR) alanı ekle. Textarea'da TR metin göster, API'ye EN `deger` gönder. Kullanıcı kendi metin yazarsa fal.ai'a olduğu gibi gider (Kling TR'yi anlıyor). Detay: `PROMPT-REHBER.md § Video Textarea TR Gösterimi`
- [x] **PQ-17** Görsel hata yönetimi: fal.ai hataları (300x300 minimum boyut vb.) sessizce yutulup kullanıcı ~160s boşa bekliyor. 3 dosya:
  1. `app/api/gorsel/poll/route.ts` — `FAILED` status'ta hata mesajını da döndür
  2. `app/page.tsx` gorselUret poll döngüsü — `FAILED` kontrol et, hata göster, döngüyü kes
  3. `app/api/gorsel/route.ts` — fal.queue.submit hatasını yakala ve anlamlı Türkçe mesaj döndür
  Detay: `PROMPT-REHBER.md § Görsel Hata Yönetimi`
- [x] **PQ-18** Hesap silme UX sadeleştirme: `app/(auth)/hesap/ayarlar/page.tsx` — "SİL" yazdırma paterni soft delete için gereksiz ağır. Text input yerine checkbox'a çevir: "Hesabımı silmek istediğimi onaylıyorum". Detay: `PROMPT-REHBER.md § Hesap Silme UX`
- [x] **PQ-19** Ana sayfaya (`/`) compact hero ekle: Login olmamış ziyaretçiler için aracın üstüne kısa hero bölümü — başlık + 1 satır açıklama + CTA + "Detaylı bilgi →" linki `/auth`'a. Login olunca hero gizlensin. Detay: `PROMPT-REHBER.md § Ana Sayfa Compact Hero`
- [x] **PQ-20** `/auth` sahte sosyal kanıt kaldır: Sahte rakamlar (500+, 10.000+, 4.9/5) ve yorumlar tamamen silindi. Temiz CTA bölümü ile değiştirildi.

### P2 — Video Kategorileri + Sosyal İyileştirme
- [x] **PQ-09** Video şablonlarını kategoriye göre çoğalt: 7 kategori × 2-3 şablon = ~18 preset. Frontend'de kategori seçiliyse ilgili preset'leri göster. Detay: `PROMPT-REHBER.md § Kategori Video Şablonları`
- [x] **PQ-10** Video negative_prompt'u genişlet: mevcut + "static, jerky, pixelated, morphing, unnatural movement"
- [x] **PQ-11** Video'ya 1:1 format ekle (pazaryeri kare video için). `app/page.tsx` video format seçeneklerine ekle + API'de destekle
- [x] **PQ-12** Sosyal Medya Kiti: Tek butonla 1 görsel (sosyal format) + 4 platform caption birden üret. Yeni endpoint veya mevcut endpoint'leri orchestrate et *(endpoint `app/api/sosyal/kit/route.ts` var, UI entegrasyonu eksik — kötü merge sonrası page.tsx 24d5ef7'e döndürüldü)*
- [x] **PQ-13** Sezon/etkinlik modu: Sosyal caption'da dropdown — Normal / Anneler Günü / Babalar Günü / Bayram / Yılbaşı / Black Friday / Sevgililer Günü. Prompt'a mevsimsel context ekle *(sosyal/route.ts 24d5ef7'e döndürüldü, `lib/prompts/sosyal.ts` var)*

### P0 — Sayfa Yapısı Refactor (SEO + UX kritik)
- [x] **PQ-35** 🔴 Sayfa yapısı refactor — `/` tanıtım, `/uret` engine ayrımı:

  **SORUN:** Şu an `/` direkt engine (araç formu) gösteriyor. Yeni gelen ziyaretçi ürünün ne olduğunu anlamıyor. Tanıtım içeriği `/auth`'ta ama menüden erişilemiyor. SEO açısından en güçlü sayfa (`/`) tanıtım içeriği barındırmıyor.

  **HEDEF:** `/` = tanıtım (landing), `/uret` = engine (araç formu). İki ayrı sayfa, iki ayrı amaç.

  **⚠️ ÖNEMLİ KURALLAR:**
  - Bu iş 7 ADIM. Her adım bağımsız commit olmalı.
  - Mevcut dosya İÇERİKLERİNE dokunma — sadece taşı/yeniden adlandır.
  - Auth/tanıtım sayfasının hero, özellikler, "Neden yzliste?", nasıl çalışır, CTA bölümleri AYNEN kalmalı.
  - Engine sayfasının tüm form/sekme/üretim mantığı AYNEN kalmalı.
  - Hiçbir CSS, component, state değişikliği YAPMA.
  - Test: her adımdan sonra `npx tsc --noEmit` çalıştır, hata varsa düzelt.

  ---

  **ADIM 1 — `/uret` route'u oluştur (engine taşınması):**
  1. `app/uret/page.tsx` oluştur — mevcut `app/page.tsx`'in TAMAMI buraya taşınacak (kopyala, yapıştır)
  2. `app/uret/page.tsx` içinde herhangi bir değişiklik YAPMA — sadece dosya konumu değişiyor
  3. ⚠️ `app/page.tsx`'i henüz SİLME — 3. adımda yeni içerik alacak
  4. Commit: `refactor: engine page.tsx → app/uret/page.tsx taşındı`

  **ADIM 2 — `/uret` route'u korumalı yap (opsiyonel):**
  Engine sayfasına logged-out kullanıcılar da erişebilmeli (senin isteğin "logout da gidebilsin"). Bu yüzden:
  1. `/uret` route'u `(auth)/` route group'unun DIŞINDA kalmalı — koruma YOK
  2. `app/uret/page.tsx` zaten kendi içinde auth kontrolü yapıyor (compact hero, loginGerekli fonksiyonu) — bu yeterli
  3. Sadece dosyanın `app/uret/page.tsx` olarak durduğunu doğrula (`app/(auth)/uret/` DEĞİL)
  4. Commit: `chore: /uret route auth kontrolü doğrulandı`

  **ADIM 3 — `/` tanıtım sayfası yap:**
  1. Mevcut `app/auth/page.tsx`'in içeriğini `app/page.tsx`'e TAŞI (kopyala, yapıştır)
  2. `app/page.tsx` artık tanıtım sayfası — hero, özellikler, demo çıktılar, CTA, footer
  3. Metadata güncelle:
     ```tsx
     export const metadata: Metadata = {
       title: "yzliste — AI ile E-ticaret Listing, Görsel ve Video Üret",
       description: "Trendyol, Hepsiburada, Amazon, Etsy ve N11 için AI destekli listing metni, stüdyo görseli, ürün videosu ve sosyal medya içeriği üret. Fotoğraf yükle, gerisini YZ halleder.",
       alternates: { canonical: "https://www.yzliste.com" },
     };
     ```
  4. ⚠️ `app/page.tsx` `"use client"` olacak (mevcut auth/page.tsx client component) — bu OK
  5. Tanıtım sayfasındaki tüm CTA'lar (`/kayit`, "Ücretsiz Başla" vb.) AYNEN kalsın
  6. Tanıtım sayfasındaki "İçerik Üret →" veya benzeri butonlar → `/uret`'e yönlendirilecek
  7. Commit: `refactor: / artık tanıtım sayfası (auth/page.tsx içeriği taşındı)`

  **ADIM 4 — `/auth` → `/` 301 redirect:**
  1. `next.config.ts` `redirects` array'ine ekle:
     ```ts
     { source: "/auth", destination: "/", permanent: true },
     ```
  2. `app/auth/page.tsx` dosyasını SİL (artık gereksiz — içerik `/`'e taşındı)
  3. `app/auth/layout.tsx` dosyasını SİL (auth route group'u artık yok)
  4. ⚠️ Sitemap'ten `/auth`'ı çıkar (zaten HC-04'te talep edilmişti)
  5. Commit: `fix: /auth → / 301 redirect, auth route kaldırıldı`

  **ADIM 5 — Header linklerini güncelle:**
  `components/SiteHeader.tsx` değişiklikleri:
  1. `navLinks` array'inde `{ href: "/", label: "Ana Sayfa" }` → AYNEN kalır (artık tanıtım sayfası)
  2. Logged-in kullanıcı için "İçerik Üret →" butonu: `href="/"` → `href="/uret"` olarak değiştir
  3. Logged-out kullanıcı için "Ücretsiz Başla" butonu: AYNEN kalır (`/kayit`'e gider)
  4. Logo linki: AYNEN kalır (`/`'e gider — artık tanıtım sayfası)
  5. Commit: `fix: header İçerik Üret linki /uret'e güncellendi`

  **ADIM 6 — Tüm `/auth` referanslarını temizle:**
  Sitewide grep yap: `grep -rn "/auth" app/ components/ lib/`
  Bulunan her `/auth` linkini duruma göre değiştir:
  - Login/kayıt amaçlı → `/giris` veya `/kayit`
  - Tanıtım amaçlı → `/`
  - Engine amaçlı → `/uret`
  ⚠️ Supabase auth API endpoint'lerine (`/auth/v1/`, `/auth/callback`) DOKUNMA — bunlar farklı
  Commit: `fix: kalan /auth referansları temizlendi`

  **ADIM 7 — SEO + doğrulama:**
  1. `app/sitemap.ts`'e `/uret` ekle (priority 0.9) — ama noindex DEĞİL (logged-out da kullanabiliyor)
  2. `/`'in canonical'ı `https://www.yzliste.com` olmalı (zaten öyle)
  3. `/uret`'in canonical'ı `https://www.yzliste.com/uret` olmalı
  4. Test: `npx tsc --noEmit` — sıfır hata
  5. Test: tüm sayfaları `curl -s -o /dev/null -w "%{http_code}"` ile kontrol et
  6. `/auth` → 301 → `/` döndüğünü doğrula
  7. Commit: `chore: sitemap + SEO doğrulama`

  ---

  **DOKUNULMAYACAK DOSYALAR:** `components/auth/AuthForm.tsx`, `components/PaketModal.tsx`, `components/ChatWidget.tsx`, `app/@modal/*`, `app/(auth)/*`, `lib/*`, `app/api/*`

  **SONUÇ:**
  | URL | İçerik | Auth | SEO |
  |-----|--------|------|-----|
  | `/` | Tanıtım (hero, özellikler, CTA) | Herkese açık | Tam SEO, primary landing |
  | `/uret` | Engine (form, sekmeler, üretim) | Herkese açık (login formu yerleşik) | Sitemap'te, canonical var |
  | `/auth` | 301 → `/` | — | Redirect |
  | `/giris` | Login formu | Herkese açık | — |
  | `/kayit` | Kayıt formu | Herkese açık | — |

- [x] **PQ-36** Header ve CTA link düzeltmeleri (İçerik Üret herkese görünür, tanıtım CTA, eski linkler)
- [x] **PQ-37** Login/kayıt sonrası /uret yönlendirme + eski link düzeltmeleri
- [x] **PQ-38** Navigasyon ve auth akışı düzeltmeleri (FiyatlarCta, aktifSayfa, logout, ölü kod)

### P3 — Mimari İyileştirme
- [x] **PQ-14** Sekmeler arası bilgi taşıma: Metin'de girilen urunAdi + kategori + platform → Görsel/Video/Sosyal sekmelerine otomatik taşı. Zustand store veya React context ile *(page.tsx 24d5ef7'e döndürüldü)*
- [x] **PQ-15** Prompt versiyonlama: Tüm prompt'ları `/lib/prompts/` altına taşı. Her prompt dosyası version numarası içersin. DB'ye uretim kaydında prompt_version ekle *(`lib/prompts/metin.ts` + `sosyal.ts` var; uret/route.ts'e entegre, migration dosyası mevcut)*
- [x] **PQ-28** Monolith refactor — `page.tsx` (2065 satır) ve `auth/page.tsx` (886 satır) parçalanacak: ✅ Tamamlandı: uret/page.tsx 487 satıra düştü, sekmeler component'lere ayrıldı (MetinSekmesi, GorselSekmesi, VideoSekmesi, SosyalSekmesi), state hook'lara taşındı, tanıtım sayfası section component'lerine bölündü.
  **page.tsx:**
  1. Sekmeleri component'lere ayır: `components/tabs/MetinSekmesi.tsx`, `GorselSekmesi.tsx`, `VideoSekmesi.tsx`, `SosyalSekmesi.tsx`
  2. State yönetimini custom hook'lara taşı: `hooks/useMetinUretim.ts`, `useGorselUretim.ts`, `useVideoUretim.ts`, `useSosyalUretim.ts`
  3. [x] Tekrarlanan sabitleri `lib/constants.ts`'e taşı: platform isimleri, kredi değerleri, stil listesi, video preset'leri *(tamamlandı: PLATFORM_BILGI, PLATFORM_PLACEHOLDER, YUKLENIYOR_MESAJLARI, GORSEL_STILLER, VIDEO_PRESETLER, kategoriKoduHesapla)*
  4. [x] Ortak UI component'leri çıkar: `FotoEkleAlani`, `FotoThumbnail`, `KopyalaButon` → `components/ui/` *(tamamlandı)*
  4b. [x] `lib/listing-utils.ts` — `sonucuBolumle()` + `docxIndir()` *(tamamlandı)*
  4c. [x] `components/PaketModal.tsx`, `components/ChatWidget.tsx` *(tamamlandı)*
  4d. [x] `page.tsx` inline tanımları kaldırıldı → import'a çevrildi. 2180→1848 satır *(tamamlandı)*
  5. [x] Tekrarlanan blob indirme handler'ları `blobIndir()` helper'a çıkarıldı (1848→1840 satır)
  6. [x] Accessibility: modal × butonlarına aria-label, sekme nav'a role="tablist" + aria-selected eklendi
  7. [x] auth/page.tsx inline ödeme modalı kaldırıldı → /?paket=ac redirect. 750→666 satır *(tamamlandı)*
  **page.tsx (eski auth/page.tsx → tanıtım sayfası, PQ-35 sonrası):**
  8. [x] Section component'leri: `AuthHero`, `FeaturesTabbed`, `FeatureCards`, `BrandProfile`, `HowItWorks`, `BenefitsGrid`
  9. [x] Platform listesi, özellik kartları, örnek çıktılar → sabit dosyalara (component içinde sabit const olarak)
  **uret/page.tsx (eski page.tsx → engine sayfası, PQ-35 sonrası):**
  10. [x] Sekmeleri component'lere ayır (sub-1): `MetinSekmesi.tsx`, `GorselSekmesi.tsx`, `VideoSekmesi.tsx`, `SosyalSekmesi.tsx`
  11. [x] State yönetimini hook'lara taşı (sub-2): `useMetinUretim.ts`, `useGorselUretim.ts` vb.
  Hedef: Hiçbir component 300 satırı geçmesin, state her component'te max 5-6 değişken
  ⚠️ PQ-28 sub-1~11 PQ-35 tamamlandıktan SONRA yapılacak

- [x] **PQ-29** Gri overlay bug fix — `@modal` intercepting route'larda giriş sonrası overlay takılıyor:
  **Sorun:** `AuthForm` giriş başarılı olunca `router.push('/')` yapıyor ama kullanıcı zaten `/`'de. Next.js parallel route slot'u `@modal`'ı kapatmıyor → `fixed inset-0 bg-black/60 z-50` overlay ekranda kalıyor, hiçbir yere tıklanamıyor.
  **Fix (3 dosya):**
  1. `app/@modal/(.)giris/page.tsx` → `'use client'` yap, `useRouter` import et, `AuthForm`'a `onSuccess={() => { router.back(); setTimeout(() => router.replace('/'), 100) }}` geç
  2. `app/@modal/(.)kayit/page.tsx` → aynı şekilde
  3. `components/modal/Modal.tsx` → `usePathname` + `useRef` ile pathname değişimini dinle, farklılaşırsa `handleClose()` çağır (stale overlay güvenlik ağı)
  **Neden `router.back()` zorunlu:** Intercepted route'larda `router.push` yeni history entry ekler ama parallel route slot'u resetlemeyebilir. `router.back()` history'yi geri alarak modal slot'u doğru şekilde kapatır.
- [x] **PQ-30** ~~Dosya truncation riski~~ **ÇALIŞMA KURALI OLARAK UYGULANMAKTA** — Cowork koda dokunmaz, sadece BACKLOG/analiz/memory yazar. Claude Code implement eder. Ayrı backlog maddesi gerektirmiyor, memory'de feedback olarak kayıtlı.

- [ ] **DoD** Demo testi: 5 farklı ürün (kozmetik, elektronik, giyim, gıda, takı) × 3 platform (Trendyol, Amazon, Etsy) = 15 listing üret. Her biri için görsel + video. Sonuçlar tutarlı, halüsinasyonsuz ve platforma uygun olmalı.
  **⚠️ Hatırlatma: `lib/test-fixtures.ts` içinde 5 ürün hazır. test-normal@yzliste.com ile giriş yap, her fixture için test et.**

- [x] **PQ-31** Auth page inline modal → AuthForm component'ine geçir:
  `app/auth/page.tsx` kendi modal state'ini yönetiyor (modalAcik, modalMod, modalEmail, modalSifre, modalSozlesme, modalMesaj, modalYukleniyor — 7 state). İçinde ayrı `modalUyeGiris` fonksiyonu var. Bunun yerine `AuthForm` component'ini kullanmalı — aynı mantık orada zaten var. Tekrarlanan kod ~60 satır silinir, bug riski azalır.
- [x] **PQ-32** `page.tsx` auth popup tekrarlı kod temizliği:
  `page.tsx` de kendi auth popup'ını yönetiyor (authPopupAcik, authPopupMod, authPopupEmail, authPopupSifre, authPopupSozlesme, authPopupMesaj, authPopupYukleniyor — 7 state + handleAuthPopupGiris fonksiyonu + handleGoogleGiris). `AuthForm` component'i zaten aynı işi yapıyor. Popup'ı `AuthForm` ile değiştir → ~80 satır ve 7 state kaldırılır.
- [x] **PQ-33** `@modal/(.)kredi-yukle/page.tsx` paket fiyatlarını `lib/paketler.ts`'ten al:
  Şu an hardcoded fiyatlar var (₺29, ₺79, ₺149). `PAKET_LISTESI` zaten merkezi kaynak — oradan çekmeli. Fiyat değişikliğinde 2 yeri güncellemek yerine 1 yer yeterli olur.

- [x] **PQ-34** Dark mode CSS'i devre dışı bırak veya düzgün destekle:
  `globals.css`'te `@media (prefers-color-scheme: dark)` ile `--background: #0a0a0a` ayarlanıyor ama hiçbir component dark mode desteklemiyor (hepsi `bg-white`, `text-gray-900` hardcoded). Sistem dark mode'da olan kullanıcılarda body siyah, component'ler beyaz → garip görünüm. Ya dark mode media query'yi kaldır ya da `html` tag'ine `class="light"` + `color-scheme: light` ekle.

### QA Keşif Testi Bulguları (Tur 1 → Tur 3 konsolide)
> Kaynak: Tur 1 `yzliste-bulgu-raporu.docx`, Tur 3 `yzliste-tur-3-rapor.docx` — Claude in Chrome.
> Son güncelleme: Tur 3 (2026-04-18). Toplam: 28 bulgu → 6 düzeldi, 3 kısmen, 13 açık, 1 kötüleşti, 5 yeni.

**Düzelenler (Tur 3'te onaylandı):**
- [x] **QA-01** P0 — Logo `/auth`'a gidiyordu (B-001): ✅ Logo href artık `/`. Düzeldi.
- [x] **QA-02** P1 — Profil linki tıklanamıyordu (B-003 + B-004): ✅ Düzeldi, regresyon yok.
- [x] **QA-03** P1 — 'İçerik' menü karmaşası (B-005 + B-012): ✅ Ayrı link kaldırıldı.
- [x] **QA-08** P3 — CTA 3 yerde tekrardı (B-013): ✅ 1'e indi.

**Kısmen düzelenler / hala açık:**

- [x] **QA-04** P1 — TC Kimlik KVKK eksik (B-007 + B-025):
  TC Kimlik girilince "TC kimlik numaramın e-Arşiv fatura amacıyla işlenmesine onay veriyorum" checkbox gösteriliyor (default unchecked). Saklama süresi (10 yıl) + silme/düzeltme/itiraz hakkı + KVKK Aydınlatma Metni linki eklendi. Checkbox işaretsizken kaydet → hata mesajı. Mevcut TC Kimlik olanlara checkbox otomatik işaretli başlıyor.

- [x] **QA-05** P2 — Çelişen CTA mesajları (B-008): Hero + banner birleştirildi. "İçerik üretmek için hesap gerekli" bilgisi hero subtitle'a taşındı, ayrı info banner kaldırıldı.

- [x] **QA-06** P2 — Kredi/üretim sayacı etiket tutarsızlığı (B-010):
  ✅ Tamamlandı: Anasayfa sidebar'da "Kullanılan" → "Toplam üretim" olarak güncellendi. Hesap/profil sayfalarıyla tutarlı.

- [ ] **QA-07** → QA-14 ile birleştirildi (auth-aware header kök neden).

- [x] **QA-09** P3 — Logged-out form gösterimi (B-014): Tüm sekmelerde "Giriş Gerekli" buton etiketi eklendi. GorselSekmesi eksikti — düzeltildi. Üret'e tıklayınca kayıt popup'ı açılıyor.

**Yeni bulgular — P0:**
- [x] **QA-10** 🔴 P0 — Şifre sıfırlama backend 400 hatası (B-015 + B-028):
  'Şifremi unuttum' UI'da var ama Supabase `/auth/v1/recover` 400 dönüyor. "Şifre sıfırlama e-postası gönderilemedi" hatası.
  **Kök neden (doğrulandı):** İKİ sorun var:
  1. `/sifre-sifirla` Next.js route'u HİÇ YOK — `AuthForm.tsx` satır 112'de `redirectTo: ${window.location.origin}/sifre-sifirla` gönderiyor ama sayfa tanımsız.
  2. Supabase Redirect URLs whitelist'te bu URL yok → 400 hatası.
  **Fix:** 1) `app/sifre-sifirla/page.tsx` oluştur (Supabase token'ı parse et, yeni şifre formu göster). 2) Supabase Dashboard → Authentication → URL Configuration → Redirect URLs'e `https://*.vercel.app/sifre-sifirla` ve `https://yzliste.com/sifre-sifirla` ekle. 3) Test et.

**Yeni bulgular — P1:**
- [x] **QA-11** P1 — 'Ana Sayfa' linki diğer sayfalarda hala `/auth`'a (B-002 kalan + B-016):
  Logo düzeldi ama `/profil`, `/fiyatlar`, `/blog` sayfalarında logged-out marketing header'da 'Ana Sayfa' hala `/auth`'a gidiyor.
  **İlişki:** QA-14 (auth-aware header) çözülünce otomatik düzelir.

- [x] **QA-12** P1 — Fiyatlar CTA'ları tutarsız rota (B-017):
  Hero 'Ücretsiz Başla' → `/kayit`, paket 'Başla' butonları → `/auth?kayit=1`. Tek rotaya sabitle ya da redirect ekle.

- [x] **QA-13** P1 — Login'li kullanıcıya kayıt CTA'ları gösteriliyor (B-018):
  `/fiyatlar`'da `FiyatlarCta` client component eklendi. Login'li: "İçerik Üret →" → `/`, login'siz: "Ücretsiz Başla" → `/kayit`.

**Yeni bulgular — P2 (kök neden grubu):**
- [x] **QA-14** P1 — İki farklı header implementasyonu. ✅ a586ed4'de /hesap/* sayfalarına SiteHeader+SiteFooter eklendi. ⚠️ UX-14: /uret SiteHeader'ın login state'i hâlâ hatalı — ayrı issue olarak açık.

- [x] **QA-15** P2 — Login'li kullanıcı /giris'te login formu görüyor (B-019):
  Oturum cookie var ama `/giris` login formu gösteriyor. Auth check ile redirect.
  **İlişki:** QA-14 middleware çözülünce otomatik düzelir.

- [x] **QA-16** P2 — Kayıt formunda `required` attribute yok (B-020):
  Email, şifre HTML `required` değil. Native validation çalışmıyor. `required={true}` ekle.

- [x] **QA-17** P2 — KVKK checkbox zorunlu değil (B-021):
  ~~Checkbox işaretsiz submit edilebiliyor.~~ ✅ Doğrulama: `AuthForm.tsx` satır 218'de `disabled={... mod === 'kayit' && !sozlesme}` ile submit zaten engellenmiş. HTML `required` yok ama fonksiyonel olarak korunuyor. Kapandı.

- [x] **QA-18** P2 — Kayıt onay metni yanlış sözleşme (B-022 + B-024, kötüleşti):
  **Doğrulandı:** `AuthForm.tsx` satır 188-189'da "Gizlilik Politikası ve Mesafeli Satış Sözleşmesi" yazıyor. Mesafeli Satış ücretsiz kayıtta uygulanmaz, Kullanım Koşulları referansı kaybolmuş.
  **Fix:** `AuthForm.tsx` satır 188-189: "Kullanım Koşulları ve Gizlilik Politikası'nı okudum, kabul ediyorum" olarak değiştir. Mesafeli Satış Sözleşmesi → ödeme/checkout ekranına taşınsın.

- [x] **QA-19** P2 — Blog tarihleri hala gelecek tarihli (B-006):
  **Doğrulandı:** 7 blog post gelecek tarihli (19-25 Nisan 2026). Dosya adları: `amazonda-satis-artiran...` (19), `hepsiburada-katalog...` (20), `e-ticarette-iade...` (21), `n11-satis-rehberi...` (22), `instagram-butikleri...` (23), `global-pazar...` (24), `e-ticarette-is-yukunu...` (25).
  **Fix:** `app/blog/icerikler.ts` (veya ilgili MD dosyaları) içindeki tarihleri 18 Nisan öncesine çek. Veya blog listesinde `WHERE date <= today` filtresi ekle.

**Yeni bulgular — P3:**
- [x] **QA-20** P3 — 404 sayfası `<title>` anasayfa title'ı (B-023):
  **Doğrulandı:** `not-found.tsx` metadata export etmiyor, root layout default title'ı kullanıyor.
  **Fix:** `app/not-found.tsx`'e ekle: `export const metadata = { title: 'Sayfa Bulunamadı | yzliste' }`.

- [x] **QA-21** P3 — Cookie banner buton hiyerarşisi eşitsiz (B-027):
  'Tümünü kabul et' primary, 'Sadece zorunlu' secondary. KVKK/GDPR'a göre ikisi aynı görsel ağırlıkta olmalı.

### Haftalık Audit Bulguları (2026-04-18)
> Kaynak: Otomatik haftalık deep audit — Vercel MCP + Chrome.
> 13/13 sayfa 200 ✅, SSL OK, ort. 0.75s. 6 uyarı aşağıda.

- [x] **HC-01** P1 — Canonical tag yanlış sayfalarda homepage'e işaret ediyor: ⚠️ Tur 4 regresyon
  `/giris`, `/kayit`, `/sss` sayfalarının canonical tag'ı `https://www.yzliste.com/` (homepage) gösteriyor. Her sayfanın canonical'ı kendi URL'si olmalı.
  **Fix:** Her üç sayfanın metadata'sına `alternates: { canonical: '...' }` eklendi. Doğrulandı: grep ile koda karşı kontrol edildi.

- [x] **HC-02** P2 — Kırık iç linkler (404 dönen): ⚠️ Tur 4 regresyon
  1. `/video` → kodda `href="/video"` bulunamadı, audit FP.
  2. `/blog/ai-gorsel-uretimi-e-ticaret` → `/blog/e-ticaret-icin-ai-urun-fotografciligi` olarak güncellendi. Doğrulandı: stale link kodda yok.

- [x] **HC-03** P2 — OG image (sosyal medya önizleme görseli) eksik:
  **Fix:** `/fiyatlar`, `/blog`, `/auth` (layout) openGraph bloğuna `images: ['/og-image.png']` eklendi.

- [x] **HC-04** P1 — `/auth` hâlâ sitemap.xml'de:
  **Fix:** `app/sitemap.ts`'ten `/auth` entry'si kaldırıldı.

- [x] **HC-05** P2 — Anasayfada hâlâ 1 adet `/auth` linki:
  **Fix:** `page.tsx` `cikisYap()` fonksiyonundaki `router.push("/auth")` → `router.push("/giris")` olarak güncellendi.

- [x] **HC-06** P3 — `/sss` sitemap'te yok:
  **Fix:** `app/sitemap.ts`'e `/sss` eklendi (priority: 0.5, changefreq: monthly).

### Tur 4 Bulguları (2026-04-18)
> Kaynak: `health-reports/test-tur-4-2026-04-18.md` — Vercel preview üzerinde test edildi.
> Toplam: 8 P0, 7 P1, 4 P2. QA-14, HC-01, HC-02 regresyon olarak yeniden açıldı.

**P0 (bu hafta):**
- [x] **T4-01** — `/giris` AuthForm `<form>` wrapper eksik. ✅ T5-01 ile birlikte de121ca'da düzeltildi.
- [x] **T4-03** — Giriş sonrası header hâlâ "Giriş Yap" gösteriyor, "Çıkış" butonu yok. ⚠️ QA-14 regresyon. Fix: AuthForm login sonrası currentUser+credits query invalidate eder → header anında güncellenir.
- [x] **T4-05** — `/profil` 44 kredi, `/hesap/krediler` 0 kredi gösteriyor. Fix: stale TanStack cache yerine direkt DB değeri gösteriliyor.
- [x] **T4-09** — `/profil` `robots: index, follow` — kullanıcı profili arama motoruna sızabilir. Fix: `app/profil/layout.tsx` noindex var (zaten tamamdı).
- [x] **T4-10** — Canonical tag regresyonu. ✅ T5-03 ile birlikte de121ca'da düzeltildi.
- [x] **T4-11** — Tüm sayfalarda çift "yzliste" başlık (`X — yzliste | yzliste`). Fix: 10 sayfada `— yzliste` suffix kaldırıldı, template `| yzliste` ekliyor.
- [x] **T4-12** — Blog yazılarında `og:image`. ✅ T5-05 ile birlikte 1f743bf'de slug-based OG endpoint ile düzeltildi.
- [x] **T4-13** — 404 sayfası canonical. ✅ T5-03 ile birlikte de121ca'da düzeltildi.

**P1 (2 hafta):**
- [x] **T4-02** — Preview env'de `/giris` ve `/kayit` GET fetch status 0 dönüyor. Middleware'e env var guard eklendi: `NEXT_PUBLIC_SUPABASE_URL` veya `NEXT_PUBLIC_SUPABASE_ANON_KEY` yoksa Supabase bloğu skip ediliyor — unhandled throw önlendi.
  **⚠️ Hatırlatma: Vercel Dashboard → yzliste → Settings → Environment Variables → Preview ortamında `NEXT_PUBLIC_SUPABASE_URL` ve `NEXT_PUBLIC_SUPABASE_ANON_KEY` tanımlı mı kontrol et.**
- [x] **T4-04** — Header'a kredi sayacı rozeti ekle. (önceki oturumda tamamlandı)
- [x] **T4-07** — `/iletisim` 404 dönüyor. Kontrol: hiçbir component'te link yok, audit FP.
- [x] **T4-14** — HTML entity title'larda literal. Kontrol: kaynak kodda `&amp;`/`&#x27;` metadata'da yok, audit FP.
- [x] **T4-15** — hreflang kısmi regresyon. ✅ T5-07 ile birlikte c6e5a76'da tüm sayfalara explicit hreflang eklendi.

**P2:**
- [x] **T4-06** — `/hesap/profil` ↔ `/profil` route çakışması. Kontrol: `/hesap/profil` → `redirect('/profil')` yapıyor, çakışma yok, intentional backward-compat redirect.
- [x] **T4-08** — `/demo` referanslarını grep-kontrol et. Sonuç: kod tabanında `/demo` linki yok.
- [x] **T4-17** — JSON-LD Organization duplication temizliği. Fix: blog/page.tsx + blog/[slug]/page.tsx inline Organization → `@id` referansa çevrildi.

### Tur 5 Bulguları (2026-04-19)
> Kaynak: `health-reports/test-tur-5-icerik-disi-2026-04-19.md` — Otonom scheduled task.
> Toplam: 3 P0, 6 P1, 3 P2. 7/18 blok LOGIN BAŞARISIZ nedeniyle atlandı (test@gmail.com şifresi bilinmiyor + QA-10 açık).
> T4-11 ✅, T4-14 ✅, T4-17 ✅ doğrulandı. T4-10/12/13/15/01 regresyon — yukarıda yeniden açıldı.

**P0 (bu hafta — kullanıcı-blocking):**
- [x] **T5-01** 🔴 P0 — `/giris` ve `/kayit` `<form>` wrapper eksik. ✅ de121ca'da düzeltildi.
- [x] **T5-02** 🔴 P0 — "Şifremi unuttum" işlevsiz. ✅ de121ca'da `/sifre-sifirla` sayfası + resetPasswordForEmail handler eklendi.
- [x] **T5-03** 🔴 P0 — Canonical tag kırık. ✅ de121ca'da tüm sayfalar düzeltildi.

**P1 (2 hafta):**
- [x] **T5-04** P1 — `/kayit` `<form>` wrapper eksik. ✅ de121ca'da T5-01 ile birlikte düzeltildi.
- [x] **T5-05** P1 — Blog `og:image` jenerik. ✅ 1f743bf'de slug-based dinamik OG endpoint (next/og) eklendi.
- [x] **T5-06** P1 — `og:title` çoğu sayfada jenerik. ✅ c6e5a76'da tüm sayfalara sayfa-özgü og:title eklendi.
- [x] **T5-07** P1 — hreflang root layout'tan miras kalmıyor. ✅ c6e5a76'da tüm sayfalara explicit hreflang eklendi.
- [x] **T5-08** P1 — Sitemap'te yasal + hakkımızda sayfaları yok. ✅ b0346e7'de eklendi.
- [x] **T5-09** P1 — `/profil` server 200 dönüyor. ✅ 06d2ef1'de middleware server-side redirect eklendi.

**P2 (fırsat bulunca):**
- [x] **T5-10** P2 — `/fiyatlar` JSON-LD `AggregateOffer` → `Product` + `Offer`. ✅ d212a8d'de düzeltildi.
- [x] **T5-11** P2 — `X-Frame-Options` SAMEORIGIN → DENY. ✅ d212a8d'de düzeltildi.
- [x] **T5-12** P2 — `robots.txt` explicit Disallow. ✅ d212a8d'de eklendi.

**Yeni — Auth/Session:**
- [x] **T5-13** P1 — Stale Supabase session cookie fix. ✅ 06d2ef1'de useCurrentUser() hook'una authError → signOut() eklendi.

**Test Altyapısı:**
- [x] **TEST-INFRA-01** — Test hesap bayrağı (`is_test` flag) — ödeme geçmişi filtrele + sınırsız kredi. Migration uygulandı, 3 test hesabı işaretlendi. API'lerde is_test → is_admin gibi kredi bypass yapıyor.
- [x] **TEST-INFRA-02** — 5 sabit ürün fixture'ı. `lib/test-fixtures.ts` oluşturuldu (kozmetik, elektronik, giyim, gıda, takı).
- [x] **TEST-AUTH-01** — Login-gerektiren test blokları. ✅ T5-02 (şifre sıfırlama) düzeltildi; test@gmail.com şifresi memory'de kayıtlı (111111).
- [ ] **TEST-MCP-01** — Mobil viewport tooling (Chrome MCP resize alternatif) — Layer B tamamlansın.
  **⚠️ Hatırlatma: Bu tooling setup'ı, bir test oturumunda Chrome MCP ile mobil boyutları test etmek için yapılacak. Zaman bulununca ayrı bir oturumda ele al.**

### Tur 7 Bulguları (2026-04-19 — Manuel A-Z Test)
> Kaynak: `health-reports/test-tur-7-manuel-2026-04-19.md` — Claude in Chrome ile footer/header/hesap audit.
> Tüm footer sayfaları + görsel/video UI + hesap sayfaları kontrol edildi.

**P0 — Hesap sayfaları data fetching kırık:**
- [x] **T7-01** ✅ DONE (e032172) — `/hesap` page client component'e dönüştürüldü. Kredi useCredits() + useCurrentUser() hook'larından geliyor.
- [x] **T7-02** ✅ DONE (cdcefc9) — `/hesap/krediler` client component'e dönüştürüldü.
- [x] **T7-03** ✅ DONE (cdcefc9) — `/hesap/ayarlar` e-posta supabase.auth.getUser() direkt çağrısıyla düzeltildi.

**P1 — Header/Footer tutarsızlığı (yasal sayfalar):**
- [x] **T7-04** 🟡 P1 — Yasal sayfaların 3'ünde SiteHeader yok. ✅ /hakkimizda, /mesafeli-satis, /teslimat-iade + /kosullar, /kvkk-aydinlatma, /cerez-politikasi'na SiteHeader eklendi.
- [x] **T7-05** 🟡 P1 — Yasal sayfaların 3'ünde Footer yok. ✅ /kosullar, /kvkk-aydinlatma, /cerez-politikasi'na SiteFooter eklendi.
- [x] **T7-06** 🟡 P1 — `/profil` title tag jenerik. ✅ app/profil/layout.tsx'e `title: 'Profilim'` eklendi.
- [x] **T7-07** 🟡 P1 — Sosyal Medya "Ürün Görseli" bölümü yüklenen fotoğrafı tanımıyor. ✅ uret/page.tsx'e useEffect ile fotolar[0] → sosyal.setSosyalFoto sync eklendi. Üstteki genel fotoğraf yükleme alanına resim yükleniyor (Metin/Görsel/Video/Sosyal etiketleri görünüyor) ama Sosyal Medya sekmesindeki "Ürün Görseli" alt bölümü bunu görmüyor — tekrar "Ürün fotoğrafı yükle" diyor.
  **Kök neden tahmini:** Sosyal sekmesinin "Ürün Görseli" bölümü ayrı bir file state kullanıyor, üstteki ortak fotoğraf yükleme state'ini okumuyor.
  **Fix:** `components/tabs/SosyalSekmesi.tsx` — üstten yüklenen fotoğraf state'ini (muhtemelen `foto` veya `yuklenenfoto`) prop olarak alsın ve yüklüyse "fotoğraf yükle" yerine thumbnail göstersin. Tüm sekmeler ortak fotoğrafı paylaşıyor olmalı (PQ-14'teki gibi).
  **Dosya:** `components/tabs/SosyalSekmesi.tsx`, `app/uret/page.tsx` (prop geçirme)
- [x] **T7-08** 🔴 P0 — RMBG endpoint'i 404. ✅ `fal-ai/bria/rmbg` → `fal-ai/bria/background/remove` olarak güncellendi. fal.ai dashboard'da `fal-ai/bria/rmbg` endpoint'ine yapılan istek **404 "Path /rmbg not found"** hatası veriyor. Bu, PQ-03'te eklenen RMBG adımı. fal.ai bu endpoint'i kaldırmış veya URL değiştirmiş.
  **Etki:** RMBG görsel pipeline'ın İLK adımı — bu çalışmadan ne normal görsel ne sosyal görsel üretilebiliyor. Tüm görsel üretim zinciri kırık.
  **Input:** Sadece `{ "image_url": "https://v3b.fal.media/files/..." }` gidiyor — doğru, RMBG sadece resim alır.
  **Kök neden bulundu:** fal.ai endpoint URL'i değişmiş:
  ```
  ESKİ (404): fal-ai/bria/rmbg
  YENİ (doğru): fal-ai/bria/background/remove
  ```
  **Fix (tek satır):** `app/api/gorsel/route.ts` satır 120:
  ```ts
  // ESKİ:
  const rmbgResult = await fal.subscribe("fal-ai/bria/rmbg", { input: { image_url: imageUrl } })
  // YENİ:
  const rmbgResult = await fal.subscribe("fal-ai/bria/background/remove", { input: { image_url: imageUrl } })
  ```
  Ayrıca response yapısı değişmiş olabilir — `rmbgResult?.data?.image?.url` yerine yeni API'nin döndüğü field'ı kontrol et (muhtemelen aynı ama doğrula).
  Sosyal görsel endpoint'inde de aynı RMBG çağrısı varsa orayı da güncelle (`grep -rn "bria/rmbg"` ile bul).
  **Dosya:** `app/api/gorsel/route.ts` satır 120 (+ varsa sosyal görsel endpoint)

### UX Tutarlılık + Değer İletişimi (2026-04-19 Cowork audit)
> Kaynak: Aziz + Cowork mantıksal denetim. Kod değişikliği değil, copy + UX kararları.
> Bu maddeler demo öncesi kritik — kullanıcının siteyi ilk 30 saniyede anlaması lazım.

**P0 — Yanlış/Yanıltıcı İfadeler (hemen düzelt):**

- [x] **UX-01** 🔴 "Kayıt olmadan başlayın" yanıltıcı. ✅ → "Ücretsiz hesap oluştur, 3 kredi hediye".
- [x] **UX-02** 🔴 Blog alt CTA eskiden kalma. ✅ → "Ücretsiz Hesap Oluştur →" + doğru açıklama, link /kayit.

- [x] **UX-03** 🔴 Sosyal medya kredi bilgisi yanıltıcı. ✅ Hero "1+ kredi", FeaturesTabbed "1 kredi / platform · Kit: 3 kredi", fiyatlar güncellendi. Kit backend 4→3 kredi (fotosuz), 5→4 (fotolu).
- [x] **UX-14** 🔴 Login'li header "Giriş Yap". ✅ useCurrentUser() hook'u yalnızca gerçek auth hatalarında (401/invalid/expired) signOut yapacak şekilde düzeltildi.
- [x] **UX-15** 🔴 Logout kullanıcıya "Krediniz bitti". ✅ MetinSekmesi koşuluna `kullanici && !kullanici.anonim` eklendi.

- [x] **UX-16** P1 — Video sekmesi kredi tutarsızlığı. ✅ "5sn: 5 kredi · 10sn: 8 kredi" sabit metin.
- [x] **UX-17** P2 — Markalı checkbox "jenerik" metni. ✅ → "Markasız veya el yapımı ürünlerde malzeme, teknik ve hikaye öne çıkar".

- [x] **UX-18** P2 — "7 pazaryeri" vs UI'da 6 platform. ✅ /uret compact hero "7 Pazaryeri" → "6 Pazaryeri" olarak güncellendi. — Hero ve marketing metinlerde "7 pazaryeri" yazıyor ama dropdown'da 6 seçenek var (Trendyol, Hepsiburada, Amazon TR, N11, Etsy, Amazon USA). Amazon TR + USA ayrı sayılıyorsa "7" doğru ama kullanıcı 6 sayıyor. Karar ver ve hizala.
  **Dosyalar:** `components/tanitim/AuthHero.tsx`, `components/tanitim/BenefitsGrid.tsx`

- [x] **UX-19** P2 — Görsel sekmesinde "1 stil = 1 kredi" 3 kez tekrar. ✅ Başlık badgesi kaldırıldı, açıklama paragrafında 1 kez kalıyor. — Başlıkta, alt başlıkta ve stil seçim alanında. Bilgi yükü.
  **Fix:** Sadece stil seçim alanında 1 kez göster, başlıktan kaldır.

- [x] **UX-20** P2 — "Hızlı başla" örneklerine Gıda + Takı ekle. ✅ MetinSekmesi 3→5 örnek (+🫒 Gıda, +💎 Takı). — Şu an 3 örnek (Kozmetik, Giyim, Elektronik). Test fixture'larıyla hizala: +🫒 Gıda, +💎 Takı/Aksesuar.
  **Dosya:** `app/uret/page.tsx` veya ilgili component

- [x] **UX-21** P1 — `/uret` "Geçmiş Üretimler" tıklanınca kullanıcı ne değiştiğini anlamıyor. ✅ Inline toggle → "📋 Geçmiş Üretimlerim →" linki /hesap/profil'e. — Sayfa içi bir toggle/açılır alan gibi davranıyorsa, kullanıcı context kaybediyor. Geçmiş üretimler profil sayfasında yaşamalı.
  **Fix:** `/uret` sayfasındaki "Geçmiş Üretimler" linkini `/hesap/uretimler` (veya `/hesap/profil#uretimler`) sayfasına yönlendir. `/uret` formu üretim aracı olarak sade kalsın.
  ```
  ESKİ: /uret içinde geçmiş üretimler inline toggle
  YENİ: "📋 Geçmiş Üretimlerim →" linki → /hesap/profil#uretimler
  ```
  **Dosya:** `app/uret/page.tsx` + hesap sayfası


**P1 — Buton Tekrarı + CTA Temizliği:**

- [x] **UX-04** P1 — `/uret` logout buton tekrarı. ✅ Sidebar auth CTA → araç açıklaması "💡 Nasıl çalışır?" ile değiştirildi. — Kullanıcı aynı anda 4 yerden "hesap oluştur / giriş yap" görüyor (compact hero, sidebar, header, üret butonu). Baskı hissi yaratıyor.
  **Fix:** Sidebar auth CTA bloğunu kaldır. Yerine kısa araç açıklaması koy:
  ```
  ESKİ sidebar (logout):
    "3 ücretsiz kredi — kayıt olmadan başlayın"
    [🎁 Hesap Oluştur]  [Giriş Yap]

  YENİ sidebar (logout):
    "💡 Nasıl çalışır?"
    "Platform seç → Ürünü anlat → İçeriğini al"
    "Metin, görsel, video ve sosyal medya tek yerden."
  ```
  **Dosya:** `app/uret/page.tsx` — sidebar render bloğu (logout durumu)

- [x] **UX-05** P1 — Sekme buton ifadeleri tutarsız. ✅ Tüm sekmelerde ✨ emoji + "— X kredi" pattern. — Metin: "✨ X Metin Üret", Video: "🎬 Video Üret", Sosyal: "Üret — 1 kredi". Emoji, format ve kredi gösterimi farklı.
  **Fix:** Tüm sekmelerde tek pattern:
  ```
  Metin:  "✨ Metin Üret — 1 kredi"    (veya "Giriş Gerekli")
  Görsel: "✨ Görsel Üret — X kredi"
  Video:  "✨ Video Üret — X kredi"
  Sosyal: "✨ Caption Üret — 1 kredi"  |  "✨ Kit Üret — 3 kredi"
  ```
  Hepsinde ✨ emoji, hepsinde "— X kredi" suffix. Kredi yetersizse kırmızı uyarı ayrı satırda.
  **Dosyalar:** `components/tabs/MetinSekmesi.tsx`, `GorselSekmesi.tsx`, `VideoSekmesi.tsx`, `SosyalSekmesi.tsx`

**P1 — Değer İletişimi (demo öncesi kritik):**

- [x] **UX-06** P1 — Ana sayfa hero generic. ✅ "Fotoğraf yükle, pazaryerine hazır içeriğini al" + değer odaklı alt metin. — "Ürünün için her içeriği tek platformda üret" ne olduğunu söylüyor ama neden önemli olduğunu söylemiyor. ChatGPT'den farkı belirsiz.
  **Fix:** Hero mesajını değer odaklı yap:
  ```
  ESKİ başlık: "Ürünün için her içeriği tek platformda üret"
  ESKİ alt metin: "Listing metni, stüdyo görseli, ürün videosu, sosyal medya içeriği — fotoğraf yükle ya da barkod tara, gerisini YZ halleder."

  YENİ başlık: "Fotoğraf yükle, pazaryerine hazır içeriğini al"
  YENİ alt metin: "Trendyol'un karakter limitini, Amazon'un yasaklı kelimelerini, Etsy'nin SEO kurallarını biz biliriz. Sen sadece ürününü anlat — listing, görsel, video ve sosyal medya içeriğin dakikalar içinde hazır."
  ```
  **Dosya:** `components/tanitim/AuthHero.tsx`

- [x] **UX-07** P1 — "Neden yzliste?" bölümü özellik listesi, değer önerisi değil. ✅ 6→4 madde, rakip karşılaştırması ile değer önerisi formatına geçildi. — "Barkod tara", "Şeffaf kredi sistemi" gibi maddeler kullanıcıyı ikna etmiyor. Rakip karşılaştırması yok.
  **Fix:** 6 maddeyi 4'e indir, her biri bir rakibe karşı pozisyon alsın:
  ```
  ESKİ 6 madde:
    1. Pazaryerini bilen AI
    2. Fotoğraf yükle, gerisini bırak
    3. Barkod tara, klavyeye dokunma
    4. 6 platform, 6 farklı format
    5. Şeffaf kredi sistemi
    6. Kullandığın kadar öde

  YENİ 4 madde:
    1. 🧠 "ChatGPT Trendyol'un 65 karakter başlık limitini bilmez"
       "yzliste her platformun karakter limiti, yasaklı kelime ve kategori kuralına göre üretir. Çıktıyı kopyala, yapıştır — düzeltmeye gerek yok."

    2. 📦 "Metin, görsel, video, sosyal medya — tek fotoğraftan"
       "Ayrı ayrı araçlarla uğraşma. Bir ürün fotoğrafı yükle, 4 içerik türünü tek platformdan üret."

    3. 🎯 "Senin markanı, senin dilini konuşur"
       "Mağaza adını, hedef kitlenin yaşını, metin tonunu bir kere gir — her üretimde otomatik uygulanır."

    4. 💰 "Abonelik yok, teknik bilgi gerekmiyor"
       "Aylık ödeme yok, API entegrasyonu yok, prompt mühendisliği yok. Formu doldur, butona bas — içeriğin hazır."
  ```
  **Dosya:** `components/tanitim/BenefitsGrid.tsx`

- [x] **UX-08** P1 — "Dakikalar içinde hazır" bölümü tekrar. ✅ 6 adım → 3 yatay kart ("3 adımda hazır"). — 6 adımın 4'ü zaten "Tek platformda 4 içerik türü" bölümünde anlatılıyor. Sayfa uzuyor, kullanıcı kaydırmaktan sıkılıyor.
  **Fix:** 6 adımı 3'e indir, inline banner formatına geç:
  ```
  ESKİ: 6 adımlı dikey akış (ürün tanımla → platform seç → listing al → görsel üret → video üret → sosyal medya)

  YENİ başlık: "3 adımda hazır"
  YENİ adımlar (yatay, yan yana 3 kart):
    1. 📦 "Ürünü anlat" — "Fotoğraf yükle, barkod tara veya elle yaz"
    2. 🛒 "Platform seç" — "Trendyol, Amazon, Etsy... kurallar otomatik uygulanır"
    3. ✨ "İçeriğini al" — "Metin, görsel, video, sosyal — hepsi tek seferde"
  ```
  **Dosya:** `components/tanitim/HowItWorks.tsx`

**P1 — Fiyatlar Sayfası Temizliği:**

- [x] **UX-09** P1 — "Kredi nasıl çalışır" 10 kart, duplikasyon var. ✅ 8→5 kart + özet satır "✅ Krediler tüm içerik türlerinde kullanılır · Süre sınırı yok · Abonelik yok". — Video ve Sosyal medya kartları 2 kez tekrarlanıyor (kart 4=kart 6, kart 5=kart 7). Kullanıcı için çok uzun.
  **Fix:** 10 kartı 5'e indir:
  ```
  KALACAK 5 KART:
    1. 🎁 "3 ücretsiz kredi ile başla" (mevcut kart 1, aynen kalsın)
    2. 📝 "Listing metni — 1 kredi" (mevcut kart 2, aynen kalsın)
    3. 📷 "AI görsel — stil başına 1 kredi" (mevcut kart 3, aynen kalsın)
    4. 🎬 "Video — 5 kredi (5sn) veya 8 kredi (10sn)" (kart 4 ve 6 birleştirilecek)
    5. 📱 "Sosyal medya — 1 kredi / platform · Kit: 3 kredi" (kart 5 ve 7 birleştirilecek, yeni fiyat)

  KALDIRILAN KARTLAR:
    - Kart 6 (Video tekrarı)
    - Kart 7 (Sosyal tekrarı)
    - Kart 8 ("Tüm içerik türleri aynı krediden" — hero'da söyleniyor)
    - Kart 9 ("Süre sınırı yok" — paket kartlarında yazıyor)
    - Kart 10 ("Aylık abonelik yok" — sayfa başlığı zaten bu)

  Kaldırılan kartların bilgisi tek satır özete dönüşsün (5 kartın altına):
    "✅ Krediler tüm içerik türlerinde kullanılır · Süre sınırı yok · Abonelik yok"
  ```
  **Dosya:** `app/fiyatlar/page.tsx` — kredi kartları bölümü

- [x] **UX-10** P1 — Paket kartlarında tutarsız birim/toplam dili. ✅ lib/paketler.ts tüm paketlerde birim fiyat formatı standartlaştırıldı. — Başlangıç paketi "1 kredi / ürün" (birim), Popüler "30 ürün" (toplam), Büyük "100 ürün" (toplam). Aynı sayfada iki dil. "100 ürün" yanıltıcı — 100 metin VEYA 100 görsel, ikisi birden değil.
  **Fix:** Tüm paketlerde aynı format — birim fiyat göster, toplam kapasite gösterme:
  ```
  TÜM PAKETLERDE AYNI ÖZELLİK LİSTESİ:
    - {X} kredi (tüm içerik türlerinde kullan)
    - 📝 Listing metni — 1 kredi / ürün
    - 📷 AI görsel — 1 kredi / stil
    - 🎬 Video — 5 kredi (5sn) · 8 kredi (10sn)
    - 📱 Sosyal medya — 1 kredi / platform
    - ✅ Süre sınırı yok · Tüm platformlar

  ESKİ (Popüler):
    "📝 Listing metni: 30 ürün"
    "📷 AI görsel: 30 stil · stil başına 1 görsel"
    "🎬 Video: 6 adet 5sn video veya 3 adet 10sn video"

  YENİ (Popüler):
    "30 kredi (tüm içerik türlerinde kullan)"
    "📝 Listing metni — 1 kredi / ürün"
    "📷 AI görsel — 1 kredi / stil"
    "🎬 Video — 5 kredi (5sn) · 8 kredi (10sn)"
    "📱 Sosyal medya — 1 kredi / platform"
    "✅ Süre sınırı yok · Tüm platformlar"
  ```
  Senaryo tablosu (zaten var, iyi çalışıyor) toplam kapasiteyi göstermeye devam etsin.
  **Dosyalar:** `lib/paketler.ts` özellikleri güncelle, `app/fiyatlar/page.tsx` paket kartları

**P2 — Blog + Kategori:**

- [x] **UX-11** P2 — Blog kartlarında boş fotoğraf kutusu. ✅ Placeholder emoji kutusu kaldırıldı. — Hiçbir yazıda `kapakGorsel` yok, emoji placeholder görünüyor. Placeholder kaldırılsın, sadece başlık + özet + tarih kalsın. İleride fotoğraf eklenince tekrar açılır.
  **Fix:** Blog kart render'ında `kapakGorsel` kontrolünü kaldır — fotoğraf alanını tamamen gizle:
  ```
  ESKİ: kapakGorsel varsa göster, yoksa 📝 emoji placeholder (176px kutu)
  YENİ: kapakGorsel varsa göster, yoksa hiçbir şey gösterme (kutu yok)
  ```
  **Dosya:** `app/blog/page.tsx` — blog kart render bölümü

- [x] **UX-12** P2 — Kategori input serbest metin + zorunlu. ✅ Dropdown (11 kategori + Diğer fallback text input), opsiyonel yapıldı. — Kullanıcı kategori bilmiyorsa ne yazacağını bilemez. Platform bazında kategoriler farklı.
  **Fix 3 adım:**
  1. Kategoriyi **opsiyonel** yap (zorunlu yıldızı kaldır)
  2. Serbest metin → **dropdown** + "Diğer" seçeneği (serbest metin fallback)
  3. Ürün adı girilince AI kategori **önersin** (dropdown'da otomatik seçilsin, kullanıcı değiştirebilsin)

  Dropdown seçenekleri (platformlar arası ortak üst kategoriler):
  ```
  Kozmetik & Kişisel Bakım | Elektronik & Aksesuar | Giyim & Moda |
  Ev & Yaşam | Gıda & İçecek | Takı & Aksesuar | Spor & Outdoor |
  Bebek & Çocuk | Kitap & Kırtasiye | Oto & Bahçe | Diğer
  ```

  Platform-bazlı mapping (ileride): Kullanıcı "Kozmetik" seçince + Trendyol seçiliyse → prompt'a "Trendyol Kozmetik kategorisi kuralları" inject et (mevcut KATEGORI_KURALLARI sistemiyle uyumlu).
  **Dosyalar:** `components/tabs/MetinSekmesi.tsx` (form alanı), `lib/constants.ts` (kategori listesi), `app/api/uret/route.ts` (opsiyonel kontrol)

- [x] **UX-13** P3 — Blog arama — DONE 577ea7c — BlogListesi.tsx client component: text arama (başlık+özet) + kategori pill filtresi.
  **Dosya:** `app/blog/page.tsx`

### P3+ — UI Polish Pass (KÜME 0 bittikten sonra, demo öncesi)
> Bu bölüm KÜME 0 içerik işleri tamamlandıktan sonra yapılacak. Redesign değil, cilalama.

- [x] **PQ-21** Renk paleti revizyonu — brand rengi indigo'ya geçiş. Tüm `orange-*` brand kullanımlarını `indigo-*` ile değiştir. Sekme renkleri: Metin=blue, Görsel=violet, Video=amber, Sosyal=emerald. `red-*` sadece hata/uyarı için — video sekmesinden tamamen kaldır. 10+ dosyada find-replace. Detay: `PROMPT-REHBER.md § Renk Paleti Revizyonu`
- [x] **PQ-22** Genel UI polish: border-radius tutarlılığı (her yerde rounded-xl), shadow standardizasyonu, spacing düzeltmeleri, hover/focus state'leri, loading skeleton'lar, buton boyut tutarlılığı. Full design system değil, mevcut component'lerin cilalanması
- [x] **PQ-23** `/auth` landing page'i yeni renk paletine güncelle — hero, CTA butonları, özellik kartları, badge renkleri hep indigo-temelli olacak
- [ ] **DoD-Polish** 3 kişiye (e-ticaret satıcısı) ekran görüntüsü göster, "profesyonel görünüyor mu" sor. Tarayıcıda renk tutarsızlığı yok — her yerde aynı palet.

---

## 🏗️ KÜME 1 — Foundation (HEPSİ birlikte, bu sırayla)
Bu küme bitmeden aşağıdakiler boşa gider. Tek branch üzerinde yap.

- [x] **F-01a** Next.js App Router dizin yapısını kur: `/`, `/giris`, `/kayit`, `/fiyatlar`, `/sss`, `/gizlilik`, `/kosullar`, `/app`, `/app/sonuc/[id]`, `/kredi-yukle`, `/hesap`, `/hesap/profil`, `/hesap/krediler`, `/hesap/ayarlar`, `/odeme/basarili`, `/odeme/hata`, `/not-found`
- [x] **F-01b** `@modal` parallel route slot + intercepting routes: `(.)giris`, `(.)kayit`, `(.)kredi-yukle`. Direk ziyarette fallback tam sayfa.
- [x] **F-01c** Auth middleware: `(auth)/` route group → login değilse `/giris`'e redirect
- [x] **F-01d** Eski URL'ler için 301 redirects (`next.config.js`): `/login→/giris`, `/register→/kayit`, `/pricing→/fiyatlar`, `/privacy→/gizlilik`
- [x] **F-01e** Özel `/not-found` sayfası + ana sayfaya CTA
- [x] **F-14a** TanStack Query v5 kur, root layout'ta `QueryClientProvider`
- [x] **F-14b** `useCredits()` hook — `GET /api/credits`, staleTime 10s
- [x] **F-14c** `useCurrentUser()` hook — `GET /api/me`, staleTime 60s
- [x] **F-14d** Üretim mutation — `onSuccess`'te `['credits']` invalidate *(~%80: invalidateCredits 14 yerde çağrılıyor ama formal useMutation hook yok, imperative logic page.tsx içinde dağınık)*
- [x] **F-14e** Header + app içi + profil sayfalarında kredi sayacını tek hook'a bağla *(SiteHeader'da useCredits ile kredi rozeti; page.tsx krediDusuk + banner → kredilerHook'a bağlandı)*
- [ ] **F-13** 3 test hesabı (DB insert): `test-normal@yzliste.com` (10 kredi), `test-zero@yzliste.com` (0 kredi), `test-new@yzliste.com` (her sprint reset). Credentials 1Password/Bitwarden vault'a.
- [ ] **DoD** Geri tuşu modal'ı kapatıyor (siteyi kapatmıyor). `/fiyatlar` direk linkle SSR açılıyor. `/app/sonuc/[id]` paylaşılabilir. Kredi sayacı 3 yerde aynı.

---

## 📊 KÜME 2 — Analytics + Consent (Küme 1'den sonra)
PostHog'u consent altyapısıyla birlikte kur — sonradan geri ekleme külfeti olmasın.

- [x] **F-28a** PostHog EU Cloud hesap aç. Env: `NEXT_PUBLIC_POSTHOG_KEY`, `api_host=https://eu.i.posthog.com`
- [x] **F-28b** `posthog-js` kur. Root provider. `person_profiles: 'identified_only'`, `capture_pageview: false`, başlangıçta `opt_out_capturing()`
- [x] **F-28c** `PostHogPageView` component (App Router için manuel `$pageview` tetikleme — `usePathname` + `useSearchParams`)
- [x] **F-28d** Login/logout'ta `identify()` / `reset()`. Properties: `email, plan, signup_date, total_generations` *(~%80: identify() çalışıyor. ⚠️ signOut sonrası analytics.reset() eksik — logout'ta PostHog person karışabilir)*
- [x] **F-28e** 9 custom event: `signup_started`, `signup_completed`, `generation_started`, `generation_completed`, `generation_failed`, `credit_purchase_started`, `credit_purchase_completed`, `credit_exhausted`, `share_clicked`. Her biri doğru yerde + doğru property ile.
- [x] **F-08a** Cookie consent banner (`vanilla-cookieconsent` v3). 3 kategori: Zorunlu / Analitik / Pazarlama. Default: hepsi KAPALI.
- [x] **F-08b** Google Consent Mode v2: `gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied' })`
- [x] **F-08c** Consent 'accept analytics' olunca `posthog.opt_in_capturing()` + `gtag('consent', 'update', { analytics_storage: 'granted' })`
- [x] **F-08d** `/gizlilik` içeriğini KVKK formatına yeniden yaz (veri sorumlusu, kategori, amaç, hukuki sebep, aktarım, saklama, Madde 11 hakları, başvuru yolu)
- [x] **F-08e** Ayrı `/cerez-politikasi` ve `/kvkk-aydinlatma` sayfaları
- [ ] **DoD** PostHog dashboard'da 9 event + `$pageview` görünüyor. Consent reddedilirse hiçbir event gitmiyor (network tab ile doğrula). ⚠️ **Audit:** analytics.ts'te 9 event tanımlı + opt-out logic var, ama UI component'lerinde `analytics.capture()` çağrılarının gerçekten tetiklendiği doğrulanmalı.

---

## 🌐 KÜME 3 — SEO Foundation (Küme 1'den sonra, Küme 2'ye paralel)

- [x] **F-19a** Her public route için `generateMetadata`/`metadata`: özgün `title`, `description`, `og:title`, `og:description`, `og:image`, `og:url`
- [x] **F-19b** Root layout'ta `metadataBase: new URL('https://www.yzliste.com')`
- [x] **F-19c** `twitter:card = summary_large_image` + her sayfa için özel og image
- [x] **F-18a** Organization JSON-LD (root layout)
- [x] **F-18b** SoftwareApplication JSON-LD (ana sayfa) — `aggregateRating` şimdilik yoksa ekleme
- [x] **F-18c** `/fiyatlar` için Product[]+Offer JSON-LD (3 paket, TRY)
- [x] **F-18d** `/sss` için FAQPage JSON-LD (en az 8 soru-cevap)
- [x] **F-02a** `/fiyatlar` sayfasını tam SSR (modal değil, gerçek sayfa). Fiyat kartları + özellikler tablosu.
- [x] **F-02b** `/sss` sayfası oluştur — ilk 8-10 soru: "kredim ne zaman expire olur", "iade nasıl", "Trendyol'a nasıl yüklerim", vb.
- [x] **F-02c** `app/sitemap.ts` — tüm public route'ları listele
- [x] **F-02d** `app/robots.ts` — allow all, sitemap referansı
- [ ] **DoD** Search Console'da sitemap submit edildi. `view-source` her sayfada farklı title gösteriyor. Google Rich Results Test tüm JSON-LD'leri geçiyor.

---

## 🔒 KÜME 4 — Güvenlik + Abuse Prevention (Küme 1 sonrası, bağımsız paralel)

- [x] **F-26a** Upstash Redis hesap + Vercel env bağla
- [x] **F-26b** `@upstash/ratelimit`: per-user 60req/dk + 500req/gün; per-IP anonim 30req/dk
- [x] **F-26c** `/api/generate` route handler: Rate limit → kredi atomik düş (Supabase RPC veya transaction) → LLM çağrı → başarısızsa kredi geri yükle
- [x] **F-26d** Cloudflare Turnstile: `/giris` + `/kayit` formlarında. Server-side verify.
- [x] **F-17a** `next.config.js` headers: `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`
- [x] **F-17b** CSP middleware (nonce-based): nonce üretimi middleware'de, x-nonce header ile layout'a iletiliyor, gtag script'e nonce uygulandı, strict-dynamic ile third-party script uyumu sağlandı
- [x] **F-16** Font: `import { GeistSans } from 'geist/font/sans'` + `className={GeistSans.variable}`. Hero görselde `priority={true}`.
- [ ] **DoD** `curl -I https://yzliste.com` tüm header'ları gösteriyor. 100 istek/dk'da 60. istekten sonra 429. CSP ihlal raporu Sentry'ye düşüyor (varsa).

---

## ⚖️ KÜME 5 — Yasal Belgeler (Paralel, kod gerektirmez — metin işi)
Hukuki kontrol gerek. Küme 1'e bağlı değil ama route'lar açılınca yayına al.

- [x] **F-07a** Kullanım Koşulları metni → `/kosullar`
- [x] **F-07b** Mesafeli Satış Sözleşmesi → `/mesafeli-satis`
- [x] **F-07c** İade Politikası (kredi expire süresi net, cayma hakkı istisnası) → `/teslimat-iade` *(route adı /iade yerine /teslimat-iade olarak oluşturulmuş — OK)*
- [x] **F-07d** Checkout'ta 3 checkbox (açık rıza): Koşullar / Mesafeli Satış / KVKK. İşaretlenmeden satın alma disable.
- [x] **F-07e** Footer'da 4 link: Kullanım / Mesafeli Satış / İade / Gizlilik ✅ Tüm 4 link mevcut.
- [x] **DoD kısmi** Checkout onayları artık DB'ye kaydediliyor: `consent_log` tablosu migration oluşturuldu (timestamp + IP + user_agent). `/api/consent` endpoint. PaketModal `paketSec()` sırasında çağırıyor. ⚠️ Hâlâ açık: 3 belge hukukçu onayı.

---

## 👤 KÜME 6 — Hesap Ayarları + Fatura (Küme 1'den sonra)

- [x] **F-09a** `/hesap/ayarlar`: E-posta değiştir, Şifre değiştir
- [x] **F-09b** "Verilerimi indir" → JSON export (kullanıcı + üretim geçmişi + ödeme kayıtları)
- [x] **F-09c** "Hesabı sil" akışı: onay modal → DB'de `deleted_at` set (soft delete) → 30 gün sonra cron job ile kalıcı sil
- [x] **F-09d** Silme talebi log tablosu (KVKK denetim için)
- [x] **F-25a** Paraşüt hesabı + API key
- [x] **F-25b** Checkout'a "Fatura Bilgileri" adımı: Ad/Unvan, TC/VKN, Adres, Fatura tipi (bireysel/kurumsal)
  **Fix:** PaketModal 3 adımlı akışa çevrildi: paket seçimi → fatura bilgileri (profil doluysa atlanır) → iyzico formu. Profil tabloya kaydedilir.
- [x] **F-25c** iyzico webhook handler içinde Paraşüt API çağrı → e-Arşiv oluştur → PDF link kaydet
- [x] **F-25d** `/hesap/faturalar` — kullanıcı PDF indirebilir + e-posta olarak gönder
  **Fix:** `/hesap/faturalar/page.tsx` oluşturuldu. Başarılı ödemeler listeleniyor. parasut_fatura_id varsa PDF İndir + E-postayla Gönder butonları aktif. Migration: payments.parasut_fatura_id + fatura_email_gonderildi. Callback güncellendi: fatura ID payments'a kaydediliyor.
- [ ] **DoD** Test ödeme sonrası Paraşüt'te fatura otomatik oluşuyor, e-posta geliyor, `/hesap/faturalar`'dan indirilebiliyor.

---

## ✨ KÜME 7 — Ürün Çekirdeği (Küme 1 + Küme 2 sonrası)

- [x] **F-10a** `platformConfig` objesi: her pazaryeri için `{titleMaxLength, descMaxLength, bannedWords[], requiredFields[]}`
- [x] **F-10b** Platform dropdown değişince sağ panelde "Kurallar" kutusu render et
- [x] **F-10c** Üretim sonrası "Trendyol kurallarına uygun ✓" rozeti (otomatik kontrol)
- [x] **F-11a** LLM system prompt: "Marka adı yalnızca kullanıcı 'markalı ürün satıyorum' bayrağı açıksa geçer. Aksi halde jenerik ifade." *(~%60: ICERIK_KURALLARI var, markaliUrun param API'ye gidiyor ama prompt text'te "markalı değilse marka adı kullanma" kuralı açık değil)*
- [x] **F-11b** Form'a "Bu ürün markalı mı? (Yetkili satıcı mısın)" checkbox
- [x] **F-11c** Platform yasaklı kelime listesini sistem prompt'a inject et (en iyi, %100, şifalı, vb.)
- [x] **F-11d** Çıktıda "Marka/IP Uyarısı" component — tespit edilmiş marka varsa göster
- [x] **F-23a** Form üstünde 3 "örnek kart": 🧴 Kozmetik · 👕 Giyim · 🔌 Elektronik → tıklayınca form dolsun
- [x] **F-23b** İlk girişte (kullanıcının `total_generations = 0`) onboarding tooltip dizisi (sade banner, react-joyride gerekmedi)
- [x] **F-23c** "Son üretimin" shortcut'ı — F-12c geçmiş listesi kapıyor
- [x] **F-22a** `/hesap` dashboard'ında 4 metrik kartı: bu ay üretim, kalan kredi, favori platform, toplam tasarruf (~X saat)
- [x] **F-22b** Kredi %20 altına inince üst banner: "+50 kredi %15 indirimle"
- [x] **F-22c** Son 3 üretim shortcut'ı
- [x] **F-12a** Çıktı bloğuna mikro-aksiyonlar: 🔁 Yeniden üret · ✂️ Kısalt · ➕ Genişlet · 🎭 Ton değiştir *(💾 Favori hâlâ eksik — generations tablosu var ama UI'da favori butonu yok)*
- [x] **F-12b** `generations` tablosu (id, user_id, platform, prompt, output, created_at, is_favorite)
- [x] **F-12c** Sol menüye "Geçmiş" sekmesi — tarih/platform/başlık filtresi
- [x] **F-12d** Her kredide 3 ücretsiz "yeniden üret" hakkı (DB'de `regenerate_count`)
- [ ] **F-20a** `messages/tr.json` — tüm UI metinleri tek dosyada. ⚠️ Şu an tüm stringler hardcoded. i18n altyapısı yok.
- [x] **F-20b** Marka sesi kısa kitapçık — DONE — `docs/marka-sesi.md`: ton, yasaklı kelimeler, her UI durumu için örnek metin, rakip farklılaştırma, chatbot ses tonu.
- [ ] **DoD** Platform seçince kurallar sağda görünüyor. Markalı ürün checkbox kapalıysa çıktıda "Stanley" gibi marka geçmiyor. `/hesap` dashboard kullanıcı başına metrikleri gösteriyor.

---

## 💬 KÜME 8 — Chatbot Geliştirme (Küme 1 sonrası)
Mevcut jenerik chatbot'u yzliste'ye özel hale getir + feedback/şikayet toplama sistemi kur.

- [x] **CB-01** Chatbot system prompt güncelle: yzliste nedir (7 pazaryeri AI listing üretici), fiyatlar (39₺/10kr, 99₺/30kr, 249₺/100kr), 1 kredi = 1 tam listing, 4 sekme (Metin/Görsel/Sosyal/Video), ChatGPT farkı (platform kurallarını bilir: Trendyol 65 karakter başlık, yasaklı kelimeler vb.), bilmediği soruda "destek@yzliste.com'a yaz" desin
- [x] **CB-02** DB migration: `feedback` tablosu → `id, session_id, rating ('up'|'down'), comment (nullable), page_url, created_at, user_id (nullable)`. RLS: insert herkes, read sadece admin
- [x] **CB-03** DB migration: `user_feedback` tablosu → `id, type ('bug'|'suggestion'|'complaint'|'other'), message, email (nullable), page_url, user_id (nullable), created_at, status ('new'|'read'|'resolved')`. RLS: insert herkes, read/update sadece admin
- [x] **CB-04** Chatbot'a thumbs up/down component: konuşma 3+ mesajı geçince otomatik göster. Tıklayınca opsiyonel yorum alanı aç. `feedback` tablosuna kaydet
- [x] **CB-05** Chatbot'a "öneri/şikayet" modu: kullanıcı "öneri", "şikayet", "bug" yazınca mod değişsin. Konu dropdown (bug/öneri/şikayet/diğer) + mesaj + e-posta (opsiyonel). `user_feedback` tablosuna kaydet. Sonunda "Teşekkürler, geri bildirimini aldık" mesajı
- [x] **CB-06** `/hesap/admin/feedback` sayfası: shadcn/ui Table. Sütunlar: tarih, tür (renk badge), mesaj (truncate + expand), rating, durum. Filtre: tür + durum + tarih aralığı. Her satırda "Okundu" / "Çözüldü" butonu (status update)
- [x] **CB-07** Chatbot açılış mesajını değiştir: "Merhaba! yzliste hakkında sorularını cevaplayabilirim. Bir önerim veya şikayetin varsa 'öneri' veya 'şikayet' yaz."
- [ ] **DoD** Chatbot yzliste fiyatlarını doğru söylüyor. 👍/👎 tıklanınca DB'ye düşüyor. "şikayet" yazınca form açılıyor. Admin panelde feedback listesi filtrelenebilir, durum güncellenebilir.

---

## 🔄 ERTELE — Trafik Eşiği Gelince Aç
Aşağıdaki eşiklerden 2'si gerçekleşince backlog'a al: **1.000 tekil/ay, 100 kayıtlı, 20 gerçek ödeme, 50 günlük üretim.**

- [ ] **F-05** Abonelik paketleri (iyzico subscription)
- [x] **F-06** ~~Ödeme butonu state machine düzeltmesi~~ PaketModal 3 adımlı akışa çevrildi (F-25b ile). State machine mevcut. Trafik yoksa öncelik düşük — pre-traffic aşamada geçerli değil.
- [ ] **F-24** iyzico webhook idempotency + signature verify + polling fallback
- [ ] **F-15** Mobil QA matrisi (BrowserStack, iPhone SE / 14 Pro Max / Galaxy S22 / iPad)
- [ ] **F-27** Görsel/video moderasyon (OpenAI moderation veya Google Safe Search)
- [ ] **F-29** Crisp/Tidio destek widget + SSS genişletme
- [ ] **F-30** Ana sayfa sosyal kanıt sayaçları (DB'den agg)
- [ ] **F-31** Referral programı (`/r/[code]`, davet eden + edilene 20 kredi)
- [ ] **F-21** A11y tam audit (Lighthouse 95+, focus trap, aria)
- [ ] **F-32** `/changelog` + haftalık sürüm notu

---

## 🔍 Search Console — Coverage Raporu (20 Nisan 2026)
Kaynak: Google Search Console coverage raporu, 17 Nisan 2026 verisi.
**Durum:** 10 indexed / 18 not indexed. Impressions çok düşük (1-5/gün).

### SC-01 🟡 P2 — 4 redirect sayfası "Failed" validation (Started: 4/12, Failed: 4/18)
Search Console'dan doğrulanmış URL'ler:
1. `http://yzliste.com/` — HTTP→HTTPS + non-www→www redirect (normal)
2. `https://yzliste.com/blog/global-pazar-yerlerine-acilmanin-anahtari-ai-listeleme` — non-www→www redirect (normal)
3. `http://www.yzliste.com/` — HTTP→HTTPS redirect (normal)
4. `https://yzliste.com/blog/trendyol-listing-nasil-yazilir` — non-www→www redirect (normal)

**Analiz:** Bunlar `/auth`, `/login` gibi eski route'lar değil — normal HTTP→HTTPS ve non-www→www redirect'leri. Vercel otomatik yapıyor. "Failed" çıkma sebebi: Google validation sırasında hâlâ redirect gördüğü için "düzeltilmedi" diyor ama bu beklenen davranış.
**Aksiyon:** Bir şey yapmana gerek yok. Bu redirect'ler olması gereken redirect'ler. Google zamanla bunları "not indexed" olarak kabul edecek. İstersen Search Console'da "Validate fix" butonunu kullanma — zaten redirect olmaları doğru.

### SC-02 🟡 P2 — 14 sayfa "Discovered — currently not indexed"
Search Console'dan doğrulanmış URL listesi (hepsi Last crawled: N/A):
1. `/blog` — ⚠️ Ana blog sayfası bile index'te yok!
2. `/blog/amazonda-satis-artiran-listing-stratejileri`
3. `/blog/e-ticarette-iade-oranlarini-icerikle-dusurun`
4. `/blog/e-ticarette-is-yukunu-azaltma-stratejileri`
5. `/blog/e-ticarette-yapay-zeka-ile-listeleme-donemi`
6. `/blog/hepsiburada-buybox-kazanma-stratejileri`
7. `/blog/hepsiburada-katalog-ve-listing-kurallari`
8. `/blog/instagram-butikleri-icin-ai-icerik-yonetimi`
9. `/blog/instagram-satis-artiran-ai-stratejileri`
10. `/blog/n11-magaza-puani-yukseltme-yollari`
11. `/blog/n11-satis-rehberi-magaza-puani-ve-listing`
12. `/blog/profesyonel-urun-fotografi-ai-stüdyo`
13. `/blog/trendyol-satis-artirma-seo-rehberi`
14. `/fiyatlar` — ⚠️ Önemli sayfa, sitemap'te var ama index'te yok

**Not:** 20 yeni blog yazısı daha eklendi (20 Nisan) — bunlar henüz Google'ın sitemap'i yeniden taramasıyla keşfedilecek.

**Yapılacaklar (Aziz manuel):**
- [ ] Search Console → URL Inspection ile şu öncelikli sayfaları manuel "Request Indexing" yap: `/blog`, `/fiyatlar`, ve her blog yazısı
- [ ] Search Console → Sitemaps → `sitemap.xml`'i yeniden submit et (yeni 20 blog + /mesafeli-satis + /teslimat-iade eklendi)

**Yapılacaklar (Claude Code):**
- [x] Blog yazıları arasına ilgili yazılara internal link ekle — etiket+kategori skoruyla "İlgili yazılar" bölümü (ef03381) ✅
- [x] `robots.ts`'de `/sifre-sifirla`, `/profil`, `/toplu`, `/kredi-yukle` disallow'a eklenmeli — session 9'da yapıldı ✅

### SC-05 🔴 P1 — `/auth` hâlâ indexlenmiş!
Search Console indexed sayfalar listesinde `/auth` var (Last crawled: Apr 18, 2026). Bu sayfa `/`'e 301 redirect ediyor (next.config.ts). Google hâlâ index'te tutuyor.
**Indexed 10 sayfa:**
1. `https://www.yzliste.com/auth` — ❌ redirect ediyor, index'te olmamalı
2. `https://www.yzliste.com/sss`
3. `https://www.yzliste.com/`
4. `/blog/global-pazar-yerlerine-acilmanin-anahtari-ai-listeleme`
5. `/blog/barkod-tara-listele-operasyon-hizi`
6. `/blog/trendyol-listing-nasil-yazilir`
7. `/blog/amazon-a9-algoritmasi-ile-satis-katlama`
8. `/blog/e-ticaret-icin-ai-urun-fotografciligi`
9. `/blog/barkod-tarama-ile-hizli-urun-listeleme`
10. `https://yzliste.com/` (non-www versiyon — www'ye redirect ediyor)

**Yapılan (20 Nisan 2026 — Cowork Chrome ile):**
- [x] Search Console → Sitemaps → sitemap.xml yeniden gönderildi (submitted Apr 20)
- [x] Search Console → URL Inspection → `/blog` için "Request Indexing" yapıldı ✅
- [x] Search Console → URL Inspection → `/fiyatlar` için "Request Indexing" yapıldı ✅
- [x] Search Console → Removals → `/auth` URL kaldırma talebi gönderildi (Processing request)
- [x] `/blog/trendyol-urun-listeleme-rehberi` → 404 düzeltildi — next.config.ts'e 301 redirect eklendi → `/blog/trendyol-listing-nasil-yazilir` — commit ff91ca9

### ✅ SC-03 🟢 P3 — Sitemap eksik sayfalar — DONE (zaten ekliydi)
Sitemap'te olan ama indexlenmeyen "yasal" sayfalar (/mesafeli-satis, /teslimat-iade) var olabilir. Bunlar sitemap'te YOK ama olmalı:
- `/mesafeli-satis` — Google tarafından bulunabilir ama sitemap'te değil
- `/teslimat-iade` — Aynı

**Fix:** `app/sitemap.ts`'ye `/mesafeli-satis` ve `/teslimat-iade` ekle (priority 0.3, changeFrequency monthly).

### SC-04 🟢 P3 — Blog meta description güncelle
`app/blog/page.tsx` description'ı dar: sadece "listing yazma rehberleri, AI görsel kullanımı, platform karşılaştırmaları ve e-ticaret ipuçları" diyor. 40 blog yazısının kapsamı çok daha geniş: video, sosyal medya, TikTok, N11, fiyatlandırma, mankene giydirme, barkod, SEO, iade yönetimi vb.
**Fix:** Description'ı genişlet + keywords dizisini güncelle + OpenGraph/Twitter description'ları uyumlu hale getir + JSON-LD description güncelle.

---

## 📎 Notlar (Claude Code için)
- **Bu dosya iş takip listemiz.** Her oturumun başında oku, nerede kaldığımızı anla.
- Bir iş bittiğinde `- [ ]` → `- [x]` olarak güncelle. Yarım iş `[x]` olmaz.
- `~%XX` notları kısmen tamamlanmış item'ları gösterir — bunları tamamla, sonra `[x]` yap.
- Her küme tek PR değil. Küme içinde 3-5 PR olabilir ama aynı branch ailesinde.
- `[DECIDE]` olmayan her karar default'la git: **TanStack Query v5**, **PostHog EU Cloud**, **Upstash Redis**, **Clou                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        