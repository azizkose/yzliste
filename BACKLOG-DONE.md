# yzliste Backlog — Tamamlanan Maddeler (Arşiv)

Bu dosya BACKLOG.md'den arşivlenen tamamlanmış maddeleri içerir.
Aktif iş takibi için → BACKLOG.md

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
- [x] Mobil (375px): Video kırpılması minimal, metinler + butonlar tam görünür
- [x] Tablet (768px): Video ve metinler dengeli
- [x] Desktop (1440px): Video tam oranında veya minimal kırpılmayla görünür
- [x] Çok geniş ekran (1920px+): Video çirkin gerilmez

**Dosya:** `components/tanitim/AuthHero.tsx`

**Yeni video dosyaları hazır — `yzliste test/` klasöründe:**
- `hero-video.mp4` — 1280x720, 10sn, 1.4MB, overlay'sız temiz video, fade in/out döngü uyumlu, h264, sessiz
- `hero-poster.jpg` — 1280x720, 93KB, en iyi kareden still (mobilde statik olarak kullanılacak)

### ✅ ADMIN PANELİ YENİDEN YAPI (P0 — kırık + güvenlik) — DONE 4a02806
Admin paneli (`/admin`) çalışmıyor. `azizkose@gmail.com` ile giriş yapılsa bile sayfa yükleniyor ama veri gelmiyor veya anasayfaya yönlendiriyor.

**Kök sebepler:**
1. **RLS engelliyor:** Sayfa `supabase` client (anon key) ile `profiles.select("*")` ve `uretimler.select("*")` çalıştırıyor. RLS her kullanıcının sadece kendi verisini görmesine izin veriyor → admin tüm kullanıcıların verisini çekemiyor → count=0 veya hata → sayfa boş/crash.
2. **Client-side kontrol güvensiz:** Admin kontrolü `user.email !== NEXT_PUBLIC_ADMIN_EMAIL` ile browser'da yapılıyor. Bu bypass edilebilir. `NEXT_PUBLIC_` prefix'i admin email'ini client bundle'a expose ediyor.
3. **Middleware koruması yok:** `/admin` `PROTECTED_PATHS`'de değil. Giriş yapmamış biri bile URL'e erişebilir.

**Çözüm — Server Component + API Route mimarisi:**
Admin panelini server-side'a taşı. Bu hem RLS sorununu çözer (service key kullanılır) hem güvenliği sağlar.

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

### ✅ 4. `/profil` hesap silme eski pattern + duplikasyon (T7-09 — P1) — DONE
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

## 🔥 KÜME 0 — İçerik Kalitesi (36/37 Tamamlandı — DoD Testi Kaldı)
Bu küme firmalara demo göstermek için gerekli idi. Diğer her şeyden önce geldi.

**Küme 0 Özeti:**
- PQ-00 → PQ-38: Tamamlandı (37 alt-madde)
- QA testi & DoD demo testi: Kaldı

### P0 — Acil (maliyet + kredi modeli değişikliği)
- [x] **PQ-00** ÇOKLU STİL SEÇİMİ + MALİYET OPTİMİZASYONU
- [x] **PQ-01** Video şablonlarını hang-safe yap
- [x] **PQ-02** Eski caption route'u kaldır

### P0 — SEO Acil (Search Console bulguları — indeksleme sorunları)
- [x] **PQ-24** Canonical tag eksikliği + www tutarsızlığı
- [x] **PQ-25** Sitemap'ten korumalı sayfaları çıkar
- [x] **PQ-26** Auth redirect'i Google-safe yap
- [x] **PQ-27** MANUEL AKSİYON — Search Console'da reindex istenmeli

### P1 — Görsel Pipeline (kaliteyi 2x artırır)
- [x] **PQ-03** Görsel pipeline'a RMBG ekle
- [x] **PQ-04** IPTAL — automatic 10x maliyet artırır
- [x] **PQ-05** Kategori → stil önceliklendirme

### P1 — Metin Kalitesi (içerik farkını yaratır)
- [x] **PQ-06** Metin formuna 3 yeni input ekle
- [x] **PQ-07** Kategori-bazlı prompt katmanı
- [x] **PQ-08** Platform yasaklı kelime listelerini genişlet

### P1 — UX Düzeltmeleri (kullanıcı deneyimi + hata yönetimi)
- [x] **PQ-16** Video textarea TR gösterimi
- [x] **PQ-17** Görsel hata yönetimi
- [x] **PQ-18** Hesap silme UX sadeleştirme
- [x] **PQ-19** Ana sayfaya compact hero ekle
- [x] **PQ-20** `/auth` sahte sosyal kanıt kaldır

### P2 — Video Kategorileri + Sosyal İyileştirme
- [x] **PQ-09** Video şablonlarını kategoriye göre çoğalt
- [x] **PQ-10** Video negative_prompt'u genişlet
- [x] **PQ-11** Video'ya 1:1 format ekle
- [x] **PQ-12** Sosyal Medya Kiti
- [x] **PQ-13** Sezon/etkinlik modu

### P0 — Sayfa Yapısı Refactor (SEO + UX kritik)
- [x] **PQ-35** Sayfa yapısı refactor — `/` tanıtım, `/uret` engine ayrımı
- [x] **PQ-36** Header ve CTA link düzeltmeleri
- [x] **PQ-37** Login/kayıt sonrası /uret yönlendirme
- [x] **PQ-38** Navigasyon ve auth akışı düzeltmeleri

### P3 — Mimari İyileştirme
- [x] **PQ-14** Sekmeler arası bilgi taşıma
- [x] **PQ-15** Prompt versiyonlama
- [x] **PQ-28** Monolith refactor
- [x] **PQ-29** Gri overlay bug fix
- [x] **PQ-30** Dosya truncation riski (çalışma kuralı)
- [x] **PQ-31** Auth page inline modal
- [x] **PQ-32** page.tsx auth popup tekrarlı kod temizliği
- [x] **PQ-33** @modal/(.)kredi-yukle/page.tsx paket fiyatlarını merkezi kaynaktan al
- [x] **PQ-34** Dark mode CSS devre dışı bırak veya düzgün destekle

### QA Keşif Testi Bulguları (Tur 1 → Tur 3 konsolide)
**Düzelenler (Tur 3'te onaylandı):**
- [x] **QA-01** P0 — Logo `/auth`'a gidiyordu
- [x] **QA-02** P1 — Profil linki tıklanamıyordu
- [x] **QA-03** P1 — 'İçerik' menü karmaşası
- [x] **QA-08** P3 — CTA 3 yerde tekrardı

**Kısmen düzelenler / hala açık:**
- [x] **QA-04** P1 — TC Kimlik KVKK eksik
- [x] **QA-05** P2 — Çelişen CTA mesajları
- [x] **QA-06** P2 — Kredi/üretim sayacı etiket tutarsızlığı
- [x] **QA-09** P3 — Logged-out form gösterimi
- [x] **QA-10** P0 — Şifre sıfırlama backend 400 hatası
- [x] **QA-11** P1 — Modal × kapatma davranışı (PQ-29 ile çözüldü)
- [x] **QA-12** P2 — /fiyatlar CTA sabit responsive
- [x] **QA-13** P3 — Video süresi <5s seçilirse hata göster
- [x] **QA-14** P0 — Auth-aware header (giriş sonrası header doğru state'e geçiyor)
- [x] **QA-15** P3 — Görsel indirme .zip yapısı
- [x] **QA-16** P3 — Tahmin süresi göster
- [x] **QA-17** P3 — Keyboard shortcuts
- [x] **QA-18** P3 — @media screen AND (prefers-reduced-motion)
- [x] **QA-19** P3 — Görsel hata retry mekanizması
- [x] **QA-20** P3 — Dark mode user-select-none metin
- [x] **QA-21** P2 — Mobile sidebar scroll

**DoD Demo Testi:**
- [ ] Demo testi: 5 farklı ürün (kozmetik, elektronik, giyim, gıda, takı) × 3 platform (Trendyol, Amazon, Etsy) = 15 listing üret. Her biri için görsel + video.

---

## 📊 KÜME 1 — Foundation (Tamamlandı — DoD Testleri Kaldı)

- [x] **F-01a** Next.js App Router dizin yapısını kur
- [x] **F-01b** `@modal` parallel route slot + intercepting routes
- [x] **F-01c** Auth middleware
- [x] **F-01d** Eski URL'ler için 301 redirects
- [x] **F-01e** Özel `/not-found` sayfası
- [x] **F-14a** TanStack Query v5 kur
- [x] **F-14b** `useCredits()` hook
- [x] **F-14c** `useCurrentUser()` hook
- [x] **F-14d** Üretim mutation invalidate
- [x] **F-14e** Header + app içi kredi sayacını tek hook'a bağla

**DoD Testleri:**
- [ ] **F-13** 3 test hesabı (DB insert)
- [ ] **DoD** Geri tuşu modal'ı kapatıyor; `/fiyatlar` SSR; kredi sayacı tutarlı

---

## 📊 KÜME 2 — Analytics + Consent (Tamamlandı — DoD Testleri Kaldı)

- [x] **F-28a** PostHog EU Cloud hesap aç
- [x] **F-28b** `posthog-js` kur
- [x] **F-28c** `PostHogPageView` component
- [x] **F-28d** Login/logout'ta identify/reset
- [x] **F-28e** 9 custom event
- [x] **F-08a** Cookie consent banner
- [x] **F-08b** Google Consent Mode v2
- [x] **F-08c** Consent analytics opt-in
- [x] **F-08d** `/gizlilik` KVKK formatı
- [x] **F-08e** `/cerez-politikasi` + `/kvkk-aydinlatma`

**DoD Testleri:**
- [ ] PostHog dashboard'da 9 event + pageview; consent reddedilirse event gitmez

---

## 🌐 KÜME 3 — SEO Foundation (Tamamlandı — DoD Testleri Kaldı)

- [x] **F-19a** Her public route için metadata
- [x] **F-19b** Root layout metadataBase
- [x] **F-19c** Twitter card
- [x] **F-18a** Organization JSON-LD
- [x] **F-18b** SoftwareApplication JSON-LD
- [x] **F-18c** `/fiyatlar` Product+Offer JSON-LD
- [x] **F-18d** `/sss` FAQPage JSON-LD
- [x] **F-02a** `/fiyatlar` sayfası tam SSR
- [x] **F-02b** `/sss` sayfası oluştur
- [x] **F-02c** `app/sitemap.ts`
- [x] **F-02d** `app/robots.ts`

**DoD Testleri:**
- [ ] Search Console sitemap submit; Google Rich Results Test geçiyor

---

## 🔒 KÜME 4 — Güvenlik + Abuse Prevention (Tamamlandı — DoD Testleri Kaldı)

- [x] **F-26a** Upstash Redis hesap
- [x] **F-26b** `@upstash/ratelimit`
- [x] **F-26c** `/api/generate` rate limit + atomik kredi düşürme
- [x] **F-26d** Cloudflare Turnstile
- [x] **F-17a** Security headers
- [x] **F-17b** CSP middleware (nonce-based)
- [x] **F-16** Geist font

**DoD Testleri:**
- [ ] Tüm security header'lar var; rate limiting 429 dönüyor; CSP raporlar Sentry'ye

---

## ⚖️ KÜME 5 — Yasal Belgeler (Tamamlandı — DoD Testleri Kaldı)

- [x] **F-07a** Kullanım Koşulları metni
- [x] **F-07b** Mesafeli Satış Sözleşmesi
- [x] **F-07c** İade Politikası
- [x] **F-07d** Checkout'ta 3 checkbox
- [x] **F-07e** Footer'da 4 link
- [x] **DoD kısmi** Consent log kaydediliyor

---

## 👤 KÜME 6 — Hesap Ayarları + Fatura (Tamamlandı — DoD Testleri Kaldı)

- [x] **F-09a** `/hesap/ayarlar`: E-posta + Şifre değişimi
- [x] **F-09b** "Verilerimi indir" → JSON export
- [x] **F-09c** "Hesabı sil" akışı: soft delete + 30 gün sonra kalıcı sil
- [x] **F-09d** Silme talebi log tablosu
- [x] **F-25a** Paraşüt hesabı + API key
- [x] **F-25b** Checkout "Fatura Bilgileri" adımı
- [x] **F-25c** iyzico webhook → Paraşüt e-Arşiv
- [x] **F-25d** `/hesap/faturalar`

**DoD Testleri:**
- [ ] Test ödeme → Paraşüt fatura oluşuyor + e-posta + indir

---

## ✨ KÜME 7 — Ürün Çekirdeği (Tamamlandı — DoD Testleri Kaldı)

- [x] **F-10a** `platformConfig` objesi
- [x] **F-10b** Platform dropdown → sağ panel kuralları
- [x] **F-10c** Üretim sonrası platform uygunluk rozeti
- [x] **F-11a** LLM system prompt markalı ürün kuralı
- [x] **F-11b** Form "Bu ürün markalı mı?" checkbox
- [x] **F-11c** Platform yasaklı kelime listesi
- [x] **F-11d** Çıktıda "Marka/IP Uyarısı" component
- [x] **F-23a** Form üstünde 3 örnek kart
- [x] **F-23b** İlk giriş onboarding tooltip
- [x] **F-23c** "Son üretimin" shortcut'ı
- [x] **F-22a** `/hesap` dashboard 4 metrik kartı
- [x] **F-22b** Kredi %20 altına banner
- [x] **F-22c** Son 3 üretim shortcut'ı
- [x] **F-12a** Çıktı mikro-aksiyonları
- [x] **F-12b** `generations` tablosu
- [x] **F-12c** Sol menüye "Geçmiş" sekmesi
- [x] **F-12d** Her kredide 3 ücretsiz "yeniden üret" hakkı
- [x] **F-20b** Marka sesi kısa kitapçık

**DoD Testleri:**
- [ ] Platform seçince kurallar sağda; markalı ürün kapat → marka geçmiyor; `/hesap` metrikleri doğru

---

## 💬 KÜME 8 — Chatbot Geliştirme (Tamamlandı — DoD Testleri Kaldı)

- [x] **CB-01** Chatbot system prompt güncelle
- [x] **CB-02** `feedback` tablosu migration
- [x] **CB-03** `user_feedback` tablosu migration
- [x] **CB-04** Chatbot thumbs up/down component
- [x] **CB-05** Chatbot "öneri/şikayet" modu
- [x] **CB-06** `/hesap/admin/feedback` sayfası
- [x] **CB-07** Chatbot açılış mesajı

**DoD Testleri:**
- [ ] Chatbot fiyatlar doğru; 👍/👎 DB'ye düşüyor; şikayet formu; admin panel filtrelenebilir

---

## 📎 Arşiv Notları
- Bu dosya 2026-04-21'de BACKLOG.md'den arşivlenmiştir.
- KÜME 0 — KÜME 8 ve tüm pre-traffic hazırlık maddeleri tamamlanmıştır.
- Devam eden işler BACKLOG.md'de yer almaktadır.
- Her kümenin DoD (Definition of Done) testleri henüz çalıştırılmamıştır.

---

## Arşivlenen DONE Bölümleri (21 Nisan 2026 — BACKLOG hafifletme)

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

### ✅ ADMIN PANELİ YENİDEN YAPI — DONE 4a02806 (Arşiv: BACKLOG-DONE.md)

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

### ✅ SC-03 🟢 P3 — Sitemap eksik sayfalar — DONE (zaten ekliydi)
Sitemap'te olan ama indexlenmeyen "yasal" sayfalar (/mesafeli-satis, /teslimat-iade) var olabilir. Bunlar sitemap'te YOK ama olmalı:
- `/mesafeli-satis` — Google tarafından bulunabilir ama sitemap'te değil
- `/teslimat-iade` — Aynı

**Fix:** `app/sitemap.ts`'ye `/mesafeli-satis` ve `/teslimat-iade` ekle (priority 0.3, changeFrequency monthly).

---

## Arşivlenen DONE Bölümleri (21 Nisan 2026)

### ✅ KF-01: Video + Try-on Kredi Değerlerini Güncelle (P0 — acil) — DONE (0128faf)

### ✅ KF-04: Hero Video src Güncelle (P1) — DONE 01ac57a + 5768914

### ✅ KF-05-FIX: Blog Yazısı Kırık — 3 Acil Fix (P0 — canlı sitede kırık) — DONE (ce648a0, cf77708)

### ✅ KF-06: Kumaş Hareketi Preset "2 saniye" İfadesini Kaldır (P1) — DONE (90f97f4)

### ✅ NF-03: Admin Dashboard — Maliyet & Fiyatlama Tablosu (P1) — DONE 6bdfb4a

### ✅ ÖRNEK İÇERİK REVİZYONU (P1 — yasal risk + etki artışı) — DONE a81ef53 + 367ea04

### ✅ A-02: Footer'a KVKK + Çerez linki ekle (P1 — yasal zorunluluk) — DONE a81ef53

### ✅ G-09: Fiyat kartları CTA netliği (P1) — DONE a81ef53

### ✅ G-12 / UX-16: Video kredi başlığı dinamik olsun (P1) — DONE (zaten dinamikti, doğrulandı)

### ✅ OG IMAGE (Sosyal Paylaşım Görseli) DEĞİŞTİR (P1) — DONE 41f2729

### ✅ HERO VIDEO RESPONSIVE FIX v1 (P1 — eski) — DONE 1a3607b

### ✅ ADMIN PANELİ YENİDEN YAPI — DONE 4a02806 (Arşiv: BACKLOG-DONE.md)

### ✅ GİRİŞ SAYFASI TEMİZLİK (P2 — UX) — DONE 6315411

### ✅ HESAP MERKEZİ BİRLEŞTİRME — `/profil` → `/hesap/profil` (P1 — yapısal) — DONE 2d2fcbd

### ✅ "6 Pazaryeri" → "7 Pazaryeri" düzeltmesi (P1 — tüm site) — DONE a81ef53

### ✅ G-08: Kredi başına maliyet vurgusu (P2) — DONE a81ef53 (tüm kartlarda X,XX₺/kredi)

### ✅ G-13: /hesap empty state (P2) — DONE 23fe4d2

### ✅ SC-03 🟢 P3 — Sitemap eksik sayfalar — DONE (zaten ekliydi)



---

## Konsolide Arşiv (21 Nisan 2026 — context hafifletme)

### Arşiv: P0-P3 Detaylı Maddeler → BACKLOG-DONE.md
- [x] **PQ-00** ⚠️ ÇOKLU STİL SEÇİMİ + MALİYET OPTİMİZASYONU
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


---

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


---

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


---

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


---

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


---

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


---

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

---

## ✅ LP-09: FeaturesTabbed UX İyileştirmesi — DONE (22 Nisan 2026)

5 değişiklik uygulandı:
1. `app/_tanitim.tsx`'de FeaturesTabbed ile HowItWorks sırası değiştirildi
2. Bölüm başlığının altına açıklama paragrafı eklendi
3. Tab butonlarına cursor-pointer eklendi
4. Aktif tab ile içerik paneli arasına görsel bağlantı (renk uyumlu border) eklendi
5. Her sekmenin üstüne intro açıklama metni eklendi (4 metin: listing, görsel, video, sosyal)

Dosyalar: `app/_tanitim.tsx`, `components/tanitim/FeaturesTabbed.tsx`

---

## ✅ UX-01: Metin Üretme Sayfası UX Revize + Küçük Fixler — DONE (22 Nisan 2026)

8 değişiklik uygulandı:
1. "Hızlı başla — bir örnek seç" bölümü kaldırıldı (MetinSekmesi)
2. Platform seçimi global yapıldı (tüm sekmeler için, uret/page.tsx'e taşındı)
3. "Ek bilgi" + "Anahtar kelimeler" tek "Ürün Detayları" textarea'sına birleştirildi
4. Hedef Kitle + Fiyat Segmenti "Daha fazla seçenek" collapse altına alındı
5. Sol tarafta dikey step indicator eklendi (desktop only) — sonra UX-01b ile kaldırıldı
6. Markalı ürün checkbox'u kaldırıldı
7. Video hareket tipi deselect fix (toggle mantığı eklendi)
8. Giriş tipi butonları kompakt chip/pill stiline çevrildi

Dosyalar: `app/uret/page.tsx`, `components/tabs/MetinSekmesi.tsx`, `components/tabs/VideoSekmesi.tsx`

---

## ✅ UX-01b: Metin Sekmesi UX Düzeltmeleri — DONE (22 Nisan 2026)

7 değişiklik uygulandı:
1. Sol step indicator tamamen kaldırıldı (sayfayı daraltıyordu)
2. Kategori alanı zorunlu + dropdown yapıldı
3. Platform bilgi badge'i tüm sekmelere genişletildi
4. Metin sekmesi fotoğraf mesajı iyileştirildi
5. Görsel sekmesindeki gereksiz fotoğraf kutusu kaldırıldı
6. Sosyal medya sekmesi metin kalıbına uyumlandı
7. Video sekmesi görsel kalıbına uyumlandı

Dosyalar: `app/uret/page.tsx`, 4 sekme component'i

---

## ✅ KF-04: kredi-yukle Sayfası Fiyat Tutarsızlığı — DONE (22 Nisan 2026)

Bug: `/app/(auth)/kredi-yukle/page.tsx` hardcoded fiyatlar 29/79/149 TL → gerçek fiyatlar 39/99/249 TL.
Fix: Hardcoded array kaldırıldı, `import { PAKET_LISTESI } from '@/lib/paketler'` ile değiştirildi.

Dosyalar: `app/(auth)/kredi-yukle/page.tsx`, `lib/paketler.ts`

---

## ✅ Toplu Arşiv — 24 Nisan 2026 BACKLOG Temizliği

Aşağıdaki maddeler BACKLOG.md'den taşındı (tamamlanmış):

### P0 tamamlanan
- DR-01: Denetim raporu hızlı düzeltmeler — 6 madde → [specs/dr-01-hizli-duzeltmeler.md](specs/dr-01-hizli-duzeltmeler.md)
- DR-02: Blog kaynaksız istatistik temizliği + içerik kuralları → [specs/dr-02-blog-istatistik-temizlik.md](specs/dr-02-blog-istatistik-temizlik.md)

### P1 tamamlanan
- LP-08: Araçlar dropdown — hero kartları + CTA → [specs/lp-08.md](specs/lp-08.md)
- NF-06: Kredi tüketim UX — bilgilendirme + onay → [specs/nf-06.md](specs/nf-06.md)
- REF-01: Referans programı — davet et, +10 kredi → [specs/ref-01.md](specs/ref-01.md)
- UX-03: Üretim sayfası navigasyon düzenlemesi → [specs/ux-03.md](specs/ux-03.md)
- LS-01: Listing skor + ücretsiz revize → [specs/ls-01.md](specs/ls-01.md)
- HERO-VID: Hero video tam versiyon + kırpmasız → [specs/hero-video-tam.md](specs/hero-video-tam.md)
- DA-01: /uret sayfası tasarım denetimi — 8 düzeltme → [specs/da-01-uret-tasarim-denetimi.md](specs/da-01-uret-tasarim-denetimi.md)
- DA-02: Ana sayfa tasarım denetimi — 9 düzeltme → [specs/da-02-anasayfa-tasarim-denetimi.md](specs/da-02-anasayfa-tasarim-denetimi.md)
- DA-03: /giris sayfası UX revizyonu → [specs/da-03-giris-sayfasi-redesign.md](specs/da-03-giris-sayfasi-redesign.md)
- DA-04: /yzstudio dark→light + UX revizyonu — 10 madde → [specs/da-04-yzstudio-tasarim-denetimi.md](specs/da-04-yzstudio-tasarim-denetimi.md)
- DR-05: /uret "Giriş yap ve başla" CTA düzeltmesi → [specs/dr-05-uret-cta-duzeltme.md](specs/dr-05-uret-cta-duzeltme.md)
- LP-11: Landing page section revizyonları — 4 madde → [specs/lp-11-landing-section-revizyonlari.md](specs/lp-11-landing-section-revizyonlari.md)
- LP-12: /fiyatlar "Kredi nasıl çalışır?" kısaltma → [specs/lp-12-fiyatlar-kredi-kisalt.md](specs/lp-12-fiyatlar-kredi-kisalt.md)

### P2 tamamlanan
- KF-05: Blog yazısı güncelle — video hareket → [specs/kf-05.md](specs/kf-05.md)
- LP-10: Araçlar dropdown — buton düzeni (inline)
- KG-01: Kredi geçmişi + kullanım analitiği → [specs/kg-01.md](specs/kg-01.md)
- MP-01: Mağaza profili genişletme — 4 yeni alan → [specs/mp-01.md](specs/mp-01.md)
- OVERSCROLL: Sayfa sonu overscroll / boş alan temizliği (inline)
- KREDİ-SYNC: Kredi gösterimi tutarsızlığı — tek kaynak (inline)
- SC-04: Blog meta description güncelle (inline)
- NF-04: fal.ai model takip scheduled task — her Pazartesi 09:00 (inline)
- DR-04: Blog iç link stratejisi — yazılar arası cross-link → [specs/dr-04-blog-ic-link.md](specs/dr-04-blog-ic-link.md)

### Search Console tamamlanan
- SC-06: Merchant Listings — image field

---
