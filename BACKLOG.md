# yzliste Backlog

Aşama: pre-traffic. Demo hazırlığı — içerik kalitesi 1 numara öncelik.
Claude Code için: **AŞAĞIDAKİ ACİL BLOK EN ÖNCELİKLİ.** Sonra KÜME 0 devam.

---

## 🚨 AUTH-01: Mobilde Kayıt Engeli — Turnstile Devre Dışı Bırak (P0 — ACİL)

**Sorun:** Mobil tarayıcılarda e-posta ile kayıt olma çalışmıyor. Buton gri kalıyor, tıklanamıyor. PC'de sorun yok.

**Kök neden:** Cloudflare Turnstile widget'ı mobilde yüklenemediğinde `turnstileToken` null kalıyor → submit butonu sürekli disabled. Kullanıcıya hata mesajı gösterilmiyor.

**Karar:** Pre-traffic aşamasında Turnstile'ı tamamen devre dışı bırak. Trafik gelince timeout'lu fallback ile tekrar aktif edilecek.

**Yapılacaklar:**
- [x] `components/auth/AuthForm.tsx`: `turnstileEnabled` satırını `const turnstileEnabled = false` yap (veya Vercel env'den `NEXT_PUBLIC_TURNSTILE_SITE_KEY`'i kaldır)
- [x] `components/auth/TurnstileWidget.tsx`: dosya kalabilir ama render edilmeyecek (turnstileEnabled=false olunca zaten atlanıyor)
- [x] `app/api/turnstile/route.ts`: endpoint kalabilir, ileride tekrar aktif edilecek
- [ ] Mobilde test: kayıt ol → e-posta doğrulama → giriş yap akışı çalışıyor mu?
- [ ] Giriş yap modunda da test (Turnstile giriş modunu da etkiliyor)

**Claude Code prompt:**
```
BACKLOG.md'deki "### AUTH-01" spec'ini oku.
components/auth/AuthForm.tsx'de turnstileEnabled'ı false yap.
Mobil ve desktop'ta kayıt + giriş akışlarının çalıştığını doğrula.
```

**Not:** İleride Turnstile tekrar aktif edilecekse, widget 5sn içinde yüklenmezse graceful degradation yapılmalı (token olmadan devam et, sunucu tarafında opsiyonel kontrol).

---

## ✅ HERO VIDEO — DONE abe1656 (Arşiv: BACKLOG-DONE.md)

Tamamlandı. Detaylar: `BACKLOG-DONE.md` dosyasında.

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

### ✅ KF-02: Video Buton Admin "0 kredi" Sorunu (P1) — DONE (8dd3553)
`VideoSekmesi.tsx`: `kredi={kullanici.is_admin ? undefined : ...}` — `KrediButon` undefined krediyi label-only gösterir, onay dialog atlar.

### ✅ KF-03: Video İndirme UX — Loading/Spinner Ekle (P1) — DONE (8dd3553)
`VideoSekmesi.tsx`: `indiriliyor` state eklendi, "⏳ İndiriliyor..." label + disabled + finally reset.

### ✅ KF-04: Hero Video src Güncelle (P1) — DONE 01ac57a + 5768914

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

### ✅ KF-06: Kumaş Hareketi Preset "2 saniye" İfadesini Kaldır (P1) — DONE (90f97f4)

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

## 🧹 RF-01: Dead Code + Proje Hijyeni Temizliği (P2 — 15dk)

**Kaynak:** Kod sağlığı audit'i (22 Nisan 2026)

**3 Temizlik:**

1. **Orphan dosya sil:** `/uret_route.ts` — proje kökünde 347 satırlık eski route handler kopyası. Aktif route `app/api/uret/route.ts`'de. Bu dosya hiçbir yerden import edilmiyor.
   - [ ] `/uret_route.ts` dosyasını sil

2. **Unused component sil:** `/components/tanitim/FeatureCards.tsx` — LP-07'de `_tanitim.tsx`'den kaldırıldı ama dosya hâlâ duruyor. Hiçbir yerden import edilmiyor.
   - [ ] `components/tanitim/FeatureCards.tsx` dosyasını sil

3. **gitignore güncelle:** `tsconfig.tsbuildinfo` dosyası git'e girmamalı (build artifact).
   - [ ] `.gitignore`'a `tsconfig.tsbuildinfo` ekle
   - [ ] Zaten git'teyse: `git rm --cached tsconfig.tsbuildinfo`

**Test:**
- [ ] `npm run build` hatasız tamamlanıyor
- [ ] `npm run lint` geçiyor
- [ ] Silinen dosyalara referans kalmamış (grep ile doğrula)

**Dosyalar:** `/uret_route.ts` (sil), `components/tanitim/FeatureCards.tsx` (sil), `.gitignore`

**Claude Code Promptu:**
```
RF-01: Dead code temizliği — 3 adım

1. /uret_route.ts dosyasını sil (proje kökündeki orphan route handler, 347 satır)
2. components/tanitim/FeatureCards.tsx dosyasını sil (LP-07'de kullanımdan kaldırıldı)
3. .gitignore'a tsconfig.tsbuildinfo ekle, varsa git rm --cached

Silmeden önce her dosyanın gerçekten hiçbir yerden import edilmediğini grep ile doğrula.
Sonra npm run build && npm run lint çalıştır.
```

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

> **Detaylı spec:** `specs/nf-02-yzstudio.md` (549 satır — mimari, API, UI wireframe, implementasyon fazları)

**Özet:** Bağımsız `/yzstudio` sayfası — pahalı/deneysel modeller. Sekme tabanlı, koyu tema, auth zorunlu.
- Sekme 1: Mankene Giydirme (FASHN v1.6, 3 kredi/sample, num_samples 1-4)
- Video Try-On: giydirme sonucu → Kling v2.1 video (10/20 kredi, 4 fashion preset)
- 5 fazlı implementasyon: altyapı → API → frontend → assets → test

**Dosyalar:** `app/yzstudio/` (yeni), `app/api/studio/tryon/` (yeni, video/ dahil), `lib/studio-constants.ts`, `middleware.ts` güncelle


### ✅ NF-03: Admin Dashboard — Maliyet & Fiyatlama Tablosu (P1) — DONE 6bdfb4a

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

## 🔧 TUR 8 AUDIT BULGULARI — DONE (Arşiv: BACKLOG-DONE.md)

Tüm alt-maddeler DONE. Aktif kalan tek madde: HERO VIDEO tam versiyon (aşağıda).

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

*Diğer TUR 8 alt-maddeleri (Hero Responsive, Admin Panel, Giriş, Hesap, Dashboard D-01~D-05, 6→7 Pazaryeri, G-08, G-13): Tümü DONE — detay BACKLOG-DONE.md'de.*

## 🚨 ACİL — Hemen Yap — DONE (Arşiv: BACKLOG-DONE.md)
5 madde tamamlandı (19 Nisan 2026). Detaylar arşiv dosyasında.

---

## 🔥 KÜME 0 — İçerik Kalitesi (36/37 Tamamlandı — DoD Testi Kaldı)
Bu küme firmalara demo göstermek için gerekli idi. Diğer her şeyden önce geldi.
Detaylı içerikler arşiv dosyasında: **BACKLOG-DONE.md**

### ✅ Arşiv: P0-P3 Detaylı Maddeler → BACKLOG-DONE.md — Tüm maddeler DONE
> Detay: `BACKLOG-DONE.md`

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

### ✅ P0 — Sayfa Yapısı Refactor (SEO + UX kritik) — Tüm maddeler DONE
> Detay: `BACKLOG-DONE.md`

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

### ✅ QA Keşif Testi Bulguları (Tur 1 → Tur 3, 21 madde) — Tüm maddeler DONE
> Kaynak: Tur 1-3 raporları. QA-01~QA-21 tamamlandı. Detay: `BACKLOG-DONE.md`
- [ ] **QA-07** → QA-14 ile birleştirildi (auth-aware header kök neden). Açık bırakıldı.

### ✅ Haftalık Audit Bulguları (2026-04-18) — Tüm maddeler DONE
> Detay: `BACKLOG-DONE.md`

### ✅ Tur 4 Bulguları (2026-04-18) — Tüm maddeler DONE
> Detay: `BACKLOG-DONE.md`

### ✅ Tur 5 Bulguları (2026-04-19) — T5-01~T5-13 + TEST-INFRA DONE
> Kaynak: `health-reports/test-tur-5-icerik-disi-2026-04-19.md`. Detay: `BACKLOG-DONE.md`
- [ ] **TEST-MCP-01** — Mobil viewport tooling (Chrome MCP resize alternatif) — P3, zaman bulununca.

### ✅ Tur 7 Bulguları (2026-04-19 — Manuel A-Z Test) — Tüm maddeler DONE
> Detay: `BACKLOG-DONE.md`

### ✅ UX Tutarlılık + Değer İletişimi (2026-04-19 Cowork audit) — Tüm maddeler DONE
> Detay: `BACKLOG-DONE.md`

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

## 🛡️ KÜME 9 — Operasyonel Olgunluk, Faz 0: Acil Güçlendirme (KÜME 0 bitmeden başlayabilir)
> Bu küme kod özelliği değil, **proje güvenliği ve sürdürülebilirliği**. Hiçbiri büyük iş değil ama hepsi olmazsa olmaz.
> **Neden şimdi:** Kullanıcı gelmeden önce bu temeller atılmalı. Hata görünmezliği, dokümantasyon eksikliği, deploy güvensizliği — bunlar trafik gelince düzeltilecek şeyler değil.

### OPS-01: Global Error Boundary (P0 — 15dk)
**Sorun:** `app/error.tsx` yok. Bir sayfa runtime hatası verirse kullanıcı Next.js varsayılan hata sayfasını görür — beyaz sayfa, sıfır bilgi, profesyonel değil.
**Fix:**
- [x] `app/error.tsx` oluştur — "use client", hata mesajı + "Ana sayfaya dön" butonu + "Tekrar dene" butonu
- [x] `app/global-error.tsx` oluştur — root layout hataları için (Next.js 14+ gereksinimi)
- [x] Hata sayfası mevcut site tasarımına uygun olsun (logo, renk paleti)
**Dosyalar:** `app/error.tsx` (yeni), `app/global-error.tsx` (yeni)

### OPS-02: .env.example Dosyası (P0 — 10dk)
**Sorun:** Projeyi klonlayan biri hangi env değişkenlerini set etmesi gerektiğini bilemiyor. `.env.local` var ama `.env.example` yok.
**Fix:**
- [x] `.env.example` oluştur — tüm key isimleri, value yerine açıklayıcı placeholder:
  ```
  # Supabase
  NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
  SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

  # Auth
  NEXTAUTH_URL=http://localhost:3000
  NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32

  # AI
  ANTHROPIC_API_KEY=sk-ant-xxx
  FAL_KEY=your-fal-key

  # Ödeme
  IYZICO_API_KEY=your-key
  IYZICO_SECRET_KEY=your-secret

  # Analytics
  NEXT_PUBLIC_POSTHOG_KEY=phc_xxx
  ```
- [x] `.gitignore`'da `.env.example` hariç tutulmamış olduğunu doğrula
**Dosyalar:** `.env.example` (yeni)

### OPS-03: Mimari Dokümantasyon (P0 — Cowork hazırlar)
**Sorun:** Sistem mimarisini, veri akışını, route haritasını gösteren tek bir belge yok. Projeyi devralacak biri nereden başlayacağını bilemez.
**Fix:**
- [x] `docs/ARCHITECTURE.md` oluştur — içerik:
  - Sistem diyagramı (Next.js ↔ Supabase ↔ fal.ai ↔ Anthropic ↔ iyzico)
  - Route haritası (her route'un sorumluluğu, auth gereksinimi)
  - API endpoint listesi (path, method, kredi maliyeti, kısa açıklama)
  - Dosya yapısı kılavuzu (app/, lib/, components/, store/ ne içerir)
- [x] `docs/DB-SCHEMA.md` oluştur — Supabase tabloları, sütunlar, ilişkiler, RLS kuralları
- [x] `docs/SETUP.md` oluştur — yeni geliştirici onboarding:
  - Gerekli araçlar (Node, pnpm/npm, Supabase CLI)
  - `.env.example` → `.env.local` kopyala + değerleri doldur
  - `npm install && npm run dev`
  - Supabase local development (opsiyonel)
  - İlk test: giriş yap, 1 listing üret
**Dosyalar:** `docs/ARCHITECTURE.md` (yeni), `docs/DB-SCHEMA.md` (yeni), `docs/SETUP.md` (yeni)
**Sorumlu:** Cowork hazırlar → Claude Code doğrular

### OPS-04: Branching Stratejisi Belgele (P1 — 15dk)
**Sorun:** `main`, `preview-canli`, `preview`, `claude/*` branch'leri var ama hangisinin ne işe yaradığı belgelenmemiş.
**Fix:**
- [x] CLAUDE.md'ye ekle:
  ```
  ## Branch Stratejisi
  - `main` — production (Vercel auto-deploy → yzliste.com)
  - `preview` — staging (Vercel preview deploy → test URL)
  - `claude/*` — feature branch'ler (Claude Code çalışma alanı)
  - Akış: claude/xxx → preview (test) → main (production)
  - Direkt main'e push YAPMA — her zaman preview üzerinden geç
  ```
**Dosyalar:** `CLAUDE.md`

### OPS-05: Uptime Monitoring (P1 — Aziz yapar, 15dk)
**Sorun:** Site çökerse veya API erişilemez olursa bunu öğrenmenin yolu yok.
**Fix:**
- [x] UptimeRobot free tier hesap aç (50 monitor, 5dk arası)
- [x] Monitor ekle: `https://yzliste.com` (HTTP 200 kontrolü)
- [ ] Monitor ekle: `https://yzliste.com/api/health` (health endpoint — OPS-09'da oluşturulacak)
- [x] Alert: e-posta (azizkose@gmail.com)
**Sorumlu:** Aziz

### OPS-06: Deploy Akışı — Preview Staging (P0 — kritik süreç değişikliği)
> **Bu en önemli süreç değişikliği.** Şu an her push direkt production'a gidiyor. Kullanıcı gelince bu kabul edilemez.

**Mevcut durum (riskli):**
```
Claude Code commit → main → Vercel auto-deploy → yzliste.com (CANLI!)
```

**Hedef akış (güvenli):**
```
Claude Code commit → preview branch → Vercel Preview URL (test)
                                        ↓
                          Aziz veya Cowork test eder
                                        ↓
                              Sorun yoksa → main'e merge
                                        ↓
                          Vercel auto-deploy → yzliste.com
```

**Fix — 3 adım:**
- [ ] **OPS-06a** Vercel project settings: "Production Branch" = `main` olduğunu doğrula
- [ ] **OPS-06b** `preview` branch'ini Vercel'de "Preview" olarak ayarla — her push'ta otomatik preview URL oluşsun
- [x] **OPS-06c** CLAUDE.md'ye deploy kuralını ekle:
  ```
  ## Deploy Kuralı
  - Feature branch → preview branch'e merge → preview URL'de test → sorun yoksa main'e merge
  - Acil hotfix: direkt main'e push edilebilir AMA sadece 1-2 satırlık kritik fix için
  - Her main merge sonrası Vercel deployment'ı kontrol et (build hatası var mı?)
  ```
- [x] **OPS-06d** `vercel.json` oluştur (yoksa) — preview için temel config:
  ```json
  {
    "github": {
      "silent": true
    }
  }
  ```
**Dosyalar:** `CLAUDE.md`, `vercel.json` (kontrol et, varsa düzenle)

**DoD:** Claude Code artık direkt main'e push etmiyor. Preview URL'den test edilmeden production'a çıkmıyor.

---

## 🛡️ KÜME 10 — Operasyonel Olgunluk, Faz 1: Temel Süreç (KÜME 1'e paralel, 2 hafta)
> Hata izleme, otomatik test, CI/CD. Bunlar "olsa iyi olur" değil, **trafik öncesi zorunlu.**

### OPS-07: Sentry Error Monitoring (P0 — 1-2 saat)
**Sorun:** Production'da oluşan hatalardan habersizsiniz. PostHog event tracking var ama bu error monitoring değil — sadece bilinen event'leri izliyor.
**Fix:**
- [x] Sentry free tier hesap aç (5K events/ay, EU region) — Aziz tamamladı (21 Nisan)
- [x] `@sentry/nextjs` kur ve yapılandır:
  - `sentry.client.config.ts` + `sentry.server.config.ts` + `sentry.edge.config.ts`
  - `next.config.ts`'ye Sentry webpack plugin ekle
  - Env: `SENTRY_DSN`, `SENTRY_AUTH_TOKEN`
- [ ] Source maps upload aktif et (debug kolaylığı) — DSN sonrası
- [ ] Alert kuralı: her yeni hata → e-posta bildirimi — DSN sonrası
- [ ] Test: kasıtlı bir hata fırlat, Sentry'de göründüğünü doğrula — DSN sonrası
**Dosyalar:** `sentry.client.config.ts` (yeni), `sentry.server.config.ts` (yeni), `sentry.edge.config.ts` (yeni), `next.config.ts`, `package.json`

### OPS-08: Structured Logging (P1 — 2 saat)
**Sorun:** API route'larında dağınık `console.error()`. Ne zaman, hangi kullanıcı, hangi input'la, ne hatası aldı — bu bilgi kaybolup gidiyor.
**Fix:**
- [x] `pino` kur (lightweight, JSON logger)
- [x] `lib/logger.ts` oluştur — merkezi logger instance
- [x] Tüm API route'lardaki `console.error()` → `logger.error()` ile değiştir
- [x] Tüm API route'lardaki `console.log()` → `logger.info()` veya `logger.debug()` ile değiştir
- [ ] Kredi düşüm logları: `logger.info({ userId, action, credits_before, credits_after })`
- [ ] fal.ai API çağrı logları: `logger.info({ model, duration_ms, cost })`
**Dosyalar:** `lib/logger.ts` (yeni), tüm `app/api/*/route.ts` dosyaları

### OPS-09: Health Endpoint (P1 — 30dk)
**Sorun:** Uptime monitoring (OPS-05) için ve genel sağlık kontrolü için bir health endpoint yok.
**Fix:**
- [x] `app/api/health/route.ts` oluştur — edge runtime, Supabase bağlantı kontrolü, 200/503
- [x] Rate limit UYGULANMASIN (middleware'de rate limit yok, health endpoint güvenli)
**Dosyalar:** `app/api/health/route.ts` (yeni)

### OPS-10: Temel E2E Testler (P0 — 4-6 saat)
**Sorun:** Projede sıfır otomatik test var. Bir fix başka bir yeri kırabilir ve bunu ancak manuel test turunda fark ediyoruz.
**Fix:**
- [x] `vitest` + `@testing-library/react` kur (unit/integration testler için)
- [x] `vitest.config.ts` oluştur
- [x] Playwright kur (E2E testler için)
- [x] `playwright.config.ts` oluştur — `baseURL: 'http://localhost:3000'`
- [x] **5 kritik E2E test yaz:**
  1. `tests/e2e/auth.spec.ts` — giriş/kayıt sayfası yükleniyor, /uret redirect
  2. `tests/e2e/generation.spec.ts` — /uret auth gerektirir
  3. `tests/e2e/credits.spec.ts` — paket kartları + JSON-LD structured data
  4. `tests/e2e/navigation.spec.ts` — tüm public sayfalar 200, health endpoint, 404
  5. `tests/e2e/account.spec.ts` — /hesap auth redirect
- [x] `package.json`'a script ekle: `"test": "vitest run"`, `"test:e2e": "playwright test"`
- [ ] `npm run test` ile tüm testler geçiyor — Playwright chromium install sonrası
**Dosyalar:** `vitest.config.ts` (yeni), `playwright.config.ts` (yeni), `tests/` (yeni dizin), `package.json`

### OPS-11: CI/CD Pipeline — GitHub Actions (P0 — 2 saat)
**Sorun:** Her push direkt deploy oluyor, öncesinde lint/type-check/test kontrolü yok.
**Fix:**
- [x] `.github/workflows/ci.yml` oluştur — quality (tsc+lint) → test → e2e paralel
- [x] **CI FIX:** `npx next lint` → `npm run lint`, `node-version: 20` → `22`, ESLint error'ları düzeltildi, Vitest E2E exclude eklendi — Claude Code (caaa7c5, 5f27116, 04137d5)
- [ ] **E2E geçici devre dışı:** `if: false` ile kapatıldı — CI ortamında Supabase + env setup gerekiyor. **KÜME 11'de tekrar açılacak** (OPS-10 ile birlikte düzelt)
- [x] Branch protection rule: main'e "Unit Tests" + "Lint & Type Check" status check zorunluluğu eklendi (GitHub Settings → Branches) — Aziz, 21 Nisan 2026
**Dosyalar:** `.github/workflows/ci.yml` (yeni)

### OPS-12: Üretim Sonrası Inline Feedback (P1 — 1 saat)
**Sorun:** Kullanıcı listing üretiyor ama sonuçtan memnun mu bilinmiyor. Chatbot'ta feedback var ama üretim anında yok.
**Fix:**
- [x] Üretim sonucu gösterildikten sonra "Bu sonuç faydalı oldu mu?" 👍/👎 butonları ekle
- [x] Tıklama → `feedback` tablosuna kaydet (mevcut tablo, CB-02'de oluşturuldu)
- [x] 👎 tıklanırsa opsiyonel yorum alanı aç ("Ne eksik veya yanlış?")
- [x] PostHog event: `generation_feedback` (rating: up/down, platform, category)
**Dosyalar:** `components/GenerationFeedback.tsx` (yeni), `app/uret/page.tsx`

### OPS-13: Maliyet Dashboard İyileştirme (P1 — 2 saat)
**Mevcut durum:** `/app/admin/page.tsx`'de zaten temel maliyet takibi var: toplam API maliyet ($), üretim başı maliyet, statik marj tablosu (8 ürün tipi), son 10 üretimin api_cost detayı. API endpoint: `/api/admin/metrics/route.ts` — tüm üretimlerden token + api_cost toplamını çekiyor.
**Sorun:** Zaman filtresi yok (her şey aggregate), provider kırılımı yok, bütçe uyarısı yok.
**Fix:**
- [x] Mevcut admin sayfasına zaman filtresi ekle: Bugün / Bu Hafta / Bu Ay / Tümü toggle
- [x] `/api/admin/metrics` endpoint'ine `period` query param desteği ekle (filtrelenmiş veri dönsün)
- [x] Günlük maliyet $5'i geçerse admin sayfasında kırmızı banner göster
**Dosyalar:** `app/admin/page.tsx`, `app/api/admin/metrics/route.ts`

**DoD (KÜME 10):** Sentry'de test hatası görünüyor. `npm test` en az 5 test geçiriyor. CI pipeline main'e merge'den önce çalışıyor. Health endpoint 200 dönüyor. Logger tüm API route'larda aktif.

---

## 🛡️ KÜME 11 — Operasyonel Olgunluk, Faz 2: Ölçeklenme Hazırlığı (trafik yaklaşınca)
> Bunlar trafik yokken acil değil ama ilk gerçek kullanıcıdan önce hazır olmalı.

### OPS-14: Feature Flag Sistemi (P2 — 2 saat)
**Sorun:** Yeni özellik ya hep ya hiç deploy ediliyor. Kademeli rollout veya sorunlu feature'ı anında kapatma imkanı yok. yzstudio şu an "URL ile erişim" şeklinde manuel flag — ölçeklenebilir değil.
**Fix:**
- [ ] PostHog Feature Flags kullan (zaten PostHog kurulu, ek maliyet yok)
- [ ] `lib/feature-flags.ts` oluştur — server-side ve client-side flag check helper'ları
- [ ] yzstudio erişimini feature flag'e bağla (mevcut URL-based → flag-based)
- [ ] Yeni özellikler için flag template: `ff-{feature-name}` naming convention
**Dosyalar:** `lib/feature-flags.ts` (yeni), `middleware.ts`

### OPS-15: API Dokümantasyonu (P2 — Cowork hazırlar)
**Sorun:** 10+ API route var ama hiçbirinin request/response formatı, rate limit kuralları, hata kodları belgelenmemiş.
**Fix:**
- [ ] `docs/API.md` oluştur — her endpoint için:
  - Path + Method
  - Auth gereksinimi
  - Request body (TypeScript interface)
  - Response body (TypeScript interface)
  - Hata kodları ve mesajları
  - Kredi maliyeti
  - Rate limit
- [ ] Mevcut route dosyalarından extract et (Cowork okur, belgeler)
**Dosyalar:** `docs/API.md` (yeni)
**Sorumlu:** Cowork hazırlar

### OPS-16: Rollback Planı (P2 — Cowork hazırlar)
**Sorun:** Deploy sorun çıkarırsa ne yapılacağı belgelenmemiş.
**Fix:**
- [ ] `docs/ROLLBACK.md` oluştur:
  - Vercel rollback (önceki deployment'a dönme — 1 tıklama)
  - DB migration revert prosedürü (Supabase'de nasıl geri alınır)
  - fal.ai API key rotation (key leak durumunda)
  - Acil iletişim listesi (Vercel support, Supabase support)
**Dosyalar:** `docs/ROLLBACK.md` (yeni)

### OPS-17: Haftalık Sprint Döngüsü (P2 — süreç)
**Sorun:** İşler "acil olan yapılır" mantığıyla ilerliyor. Velocity izlenmiyor, ne zaman biter bilinmiyor.
**Fix:**
- [ ] Her Pazartesi: haftalık hedef belirle (max 5 madde, BACKLOG'dan seç)
- [ ] Her Cuma: ne bitti, ne kaldı, neden kaldı — 3 satırlık özet
- [ ] BACKLOG maddelerine T-shirt sizing ekle: S (< 1 saat), M (1-4 saat), L (4-8 saat), XL (8+ saat)
- [ ] Demo milestone tarihi belirle → geriye doğru planlama yap
**Sorumlu:** Aziz + Cowork

### OPS-18: Karar Günlüğü — ADR (P3 — sürekli)
**Sorun:** Önemli kararlar dağınık. "Neden Kling seçildi?", "Neden iyzico?", "Neden monolith?" — bunlar bir yerde toplanmalı.
**Fix:**
- [ ] `docs/decisions/` dizini oluştur
- [ ] Her önemli karar için 1 dosya: `YYYY-MM-DD-karar-basligi.md`
  ```
  # Karar: [başlık]
  **Tarih:** YYYY-MM-DD
  **Durum:** Kabul edildi / İptal edildi
  **Bağlam:** Neden bu karar gerekti?
  **Seçenekler:** Ne değerlendirildi?
  **Karar:** Ne seçildi?
  **Gerekçe:** Neden bu seçildi?
  ```
- [ ] Mevcut kararları geriye dönük belgele: Kling v2.1, FASHN v1.6, fal.ai pricing, monolith mimari
**Dosyalar:** `docs/decisions/` (yeni dizin)

### OPS-19: Component Bağımlılık Haritası (P2 — Cowork hazırlar)
**Sorun:** Bir hook veya component değiştiğinde neyi kırabileceğini gösteren harita yok. `useCredits()` 5 yerde, `KrediButon` 4 yerde, `sistemPromptOlustur()` 2 route'da kullanılıyor.
**Fix:**
- [ ] `docs/DEPENDENCY-MAP.md` oluştur:
  - Kritik shared hook'lar ve kullanım yerleri
  - Kritik shared component'lar ve kullanım yerleri
  - API route bağımlılıkları (hangi route hangi lib'i kullanıyor)
  - Değişiklik etki matrisi: "X'i değiştirirsen Y'yi de test et"
**Dosyalar:** `docs/DEPENDENCY-MAP.md` (yeni)
**Sorumlu:** Cowork hazırlar

### OPS-20: KVKK + Yasal Uyumluluk Tamamlama (P1 — Aziz, hukuki)
**Sorun:** KVKK consent mekanizması var ama tam uyumluluk eksik.
**Fix:**
- [ ] VERBİS kaydı yapıldı mı? Yapılmadıysa başvur (kvkk.gov.tr)
- [ ] Veri silme talebi prosedürü belgele: kullanıcı talep ederse ne silinecek, nasıl silinecek
- [ ] e-Arşiv fatura (Paraşüt) entegrasyonu aktif mi? İlk ödeme geldiğinde fatura kesilecek mi?
- [ ] Kullanım koşulları + gizlilik politikası son hukuki kontrol
**Sorumlu:** Aziz (gerekirse hukuki danışman)

**DoD (KÜME 11):** Feature flag'ler çalışıyor. API dökümantasyonu mevcut. Rollback planı belgelenmiş. Sprint döngüsü başlamış. En az 3 ADR yazılmış.

---

## ✅ KÜME 12 — Landing Page UX + Satış Optimizasyonu — DONE

> İlk dış kullanıcı geri bildirimi sonrası. Amaç: "ne sunuyorsunuz" sorusunu 5 saniyede cevaplamak, güven oluşturmak, aksiyona yönlendirmek.

### ✅ LP-01: Hero Revize — Başlık + 4 Aksiyon Kartı (P0 — 1-2 saat) — DONE
**Sorun:** Mevcut başlık "Fotoğraf yükle, pazaryerine hazır içeriğini al" — fotoğraf yüklemeyi zorunlu gibi gösteriyor (değil), ne üretileceği belirsiz.
**Fix:**
- [x] Başlığı değiştir → **"E-ticaret içeriğini AI ile üret"**
- [x] Alt metin → **"Ürün bilgini gir — listing metni, stüdyo görseli, tanıtım videosu ve sosyal medya içeriğini dakikalar içinde al."**
- [x] Hero'nun altına 4 aksiyon kartı ekle (yatay grid, tıklanabilir):
  - 📝 **Listing Metni** → `/uret?tab=metin`
  - 📷 **Stüdyo Görseli** → `/uret?tab=gorsel`
  - 🎬 **Ürün Videosu** → `/uret?tab=video`
  - 📱 **Sosyal Medya** → `/uret?tab=sosyal`
- [x] Her kartta 1 satır açıklama: "Platforma özel başlık, açıklama, etiket", "7 farklı stüdyo stili", "5sn veya 10sn tanıtım klibi", "Instagram, TikTok, Facebook, X"
- [x] Mevcut 2 CTA ("Ücretsiz Başla" + "Hemen Dene") kart grid'in altında kalsın
**Dosyalar:** `components/tanitim/AuthHero.tsx`

### ✅ LP-02: Sayfa Bölüm Sıralamasını Değiştir (P0 — 15dk) — DONE
**Sorun:** "Nasıl çalışır" bölümü 5. sırada, çok geç. Kullanıcı ürünü anlamadan detaya giriyor.
**Fix — `app/_tanitim.tsx` component sırasını değiştir:**
```
<SiteHeader />
<AuthHero />          ← (1) başlık + 4 aksiyon kartı
<HowItWorks />        ← (2) yukarı taşındı — 3 adım
<FeaturesTabbed />    ← (3) platform çıktı örnekleri
<FeatureCards />      ← (4) 4 ürün detay kartı
<BrandProfile />      ← (5) marka profili
<BenefitsGrid />      ← (6) neden yzliste
<LandingFAQ />        ← (7) YENİ — inline SSS
<TrustBand />         ← (8) YENİ — güven bandı
<SiteFooter />
```
**Dosyalar:** `app/_tanitim.tsx`

### ✅ LP-03: Inline FAQ Bölümü — Ana Sayfaya Ekle (P1 — 1 saat) — DONE
**Fix:**
- [x] `components/tanitim/LandingFAQ.tsx` oluşturuldu — 6 soru, accordion
- [x] Altında "Tüm sorular →" linki → `/sss`
- [x] `app/_tanitim.tsx`'e eklendi (BenefitsGrid'den sonra)

### ✅ LP-04: Güven Bandı (Trust Band) Ekle (P1 — 30dk) — DONE
**Fix:**
- [x] `components/tanitim/TrustBand.tsx` oluşturuldu
- [x] Şirket adı `/hakkimizda`'ya linkli
- [x] `app/_tanitim.tsx`'e eklendi (LandingFAQ'dan sonra)

### ✅ LP-05: /uret Sayfasında Tab Query Param Desteği (P1 — 30dk) — DONE
**Fix:**
- [x] `useSearchParams` ile `tab` param okunuyor
- [x] Geçerli değerler: `metin`, `gorsel`, `video`, `sosyal`

### ✅ LP-06: Video Kredi Bilgisi Bug Fix (P0 — 5dk) — DONE
**Fix:**
- [x] `5sn: 5 kredi · 10sn: 8 kredi` → `5sn: 10 kredi · 10sn: 20 kredi`

**DoD (KÜME 12):** Hero'da 4 aksiyon kartı tıklanıyor ve doğru tab'a yönlendiriyor. HowItWorks hero'nun hemen altında. FAQ accordion açılıp kapanıyor. Trust band footer üstünde görünüyor. Video kredi bilgisi doğru (10/20).

### ✅ LP-08: Header'a "Araçlar" Dropdown Menü + FeaturesTabbed CTA + Zenginleştirme (P1 — 2-3 saat) — DONE

**Amaç:** Ziyaretçi siteye girince "ne yapabilirim" sorusunu header'dan 1 tıkla cevaplayabilsin. Dropdown'dan direkt araca gidebilsin, merak ederse detay bölümüne scroll etsin, oradaki detayı okuyunca da "Hemen Dene" CTA'sıyla üretime geçebilsin.

**A) AuthHero'daki 4 aksiyon kartını kaldır, değer önermeleri ekle:**

Hero'nun işi artık "ne yapıyoruz" değil "neden biz" olmalı — araçlar dropdown'da ve FeaturesTabbed'de zaten var.

- [ ] KARTLAR dizisini ve grid'ini kaldır
- [ ] Yerine 4 değer önermesi badge'i ekle (video üstünde okunabilir, yarı-saydam arka plan):
  - ✓ Yazılım kurulumu veya entegrasyon yok — tarayıcıdan kullan
  - ✓ Aylık abonelik yok — sadece kullandığın kadar öde
  - ✓ 7 pazaryerinin kurallarını bilir — platforma özel üretir
  - ✓ Prompt yazmana gerek yok — formu doldur, butona bas
- [ ] İkinci CTA'yı değiştir: "Hemen Dene →" → "Araçları İncele ↓" (href="/#araclar", scroll to FeaturesTabbed)
- [ ] Üst badge'ler ("🆕 Video + Sosyal Medya") kalabilir

**B) SiteHeader'a "Araçlar" dropdown ekle:**

Desktop: `navLinks` dizisine `{ label: "Araçlar", id: "araclar" }` ekle (href yok, dropdown tetikler). Hover veya tıkla ile dropdown açılır:

```
Araçlar ▾
┌───────────────────────────────────────────────┐
│ 📝 Listing Metni                              │
│    Platforma özel başlık, özellikler, etiket  │
│    [Hemen Kullan →]  [Detaylar]               │
│───────────────────────────────────────────────│
│ 📷 Stüdyo Görseli                            │
│    Tek fotoğraftan 7 farklı stüdyo stili     │
│    [Hemen Kullan →]  [Detaylar]               │
│───────────────────────────────────────────────│
│ 🎬 Ürün Videosu                               │
│    5sn veya 10sn AI tanıtım klibi            │
│    [Hemen Kullan →]  [Detaylar]               │
│───────────────────────────────────────────────│
│ 📱 Sosyal Medya                               │
│    Instagram, TikTok, Facebook, X caption    │
│    [Hemen Kullan →]  [Detaylar]               │
└───────────────────────────────────────────────┘
```

- **"Hemen Kullan →"** → `/uret?tab=metin` (veya gorsel/video/sosyal)
- **"Detaylar"** → `/#arac-metin` (ana sayfada FeaturesTabbed'in ilgili sekmesine scroll + o sekmeyi aç)
- Dropdown dışına tıklayınca veya mouse çıkınca kapanır
- Stil: `bg-white rounded-xl shadow-xl border border-gray-100`, transparent header'da da beyaz dropdown

Mobil hamburger menüde: "Araçlar" tıklayınca accordion açılır, 4 alt madde görünür (her biri tıklanınca `/uret?tab=X` gider). Detay linki mobilde gösterilmeyebilir (opsiyonel).

**B) FeaturesTabbed'e anchor ID'ler + CTA butonları ekle:**

1. Section'a `id="araclar"` ekle
2. Her sekme içeriğinin sonuna CTA butonu ekle:
   ```tsx
   <div className="mt-5 pt-4 border-t border-gray-100 text-center">
     <a href="/uret?tab=metin" className="inline-block bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors">
       Listing Metni Üret →
     </a>
   </div>
   ```
   Her sekmede farklı CTA label ve link:
   - Sekme 0 (Metin): "Listing Metni Üret →" → `/uret?tab=metin`
   - Sekme 1 (Görsel): "Stüdyo Görseli Üret →" → `/uret?tab=gorsel`
   - Sekme 2 (Video): "Ürün Videosu Üret →" → `/uret?tab=video`
   - Sekme 3 (Sosyal): "Sosyal İçerik Üret →" → `/uret?tab=sosyal`

3. Dropdown'daki "Detaylar" linki tıklanınca:
   - `/#arac-metin` gibi hash ile sayfaya git
   - Sayfa `id="araclar"` bölümüne scroll etsin
   - İlgili sekme (ozellikTab) açılsın
   
   Bunu yapmak için: FeaturesTabbed, URL hash'i dinlesin. `useEffect` ile `window.location.hash` kontrol etsin:
   - `#arac-metin` → `setOzellikTab(0)` + scroll to `#araclar`
   - `#arac-gorsel` → `setOzellikTab(1)` + scroll
   - `#arac-video` → `setOzellikTab(2)` + scroll
   - `#arac-sosyal` → `setOzellikTab(3)` + scroll

**C) FeaturesTabbed sekme içeriklerini zenginleştir (opsiyonel, LP-08 sonrası yapılabilir):**

Şu an Listing Metni sekmesinde platform örnekleri var (detaylı, iyi). Ama Görsel, Video, Sosyal sekmelerinde "nasıl çalışır" + "ne üretir" daha kapsayıcı olabilir. Bu madde P2 — önce dropdown + CTA + anchor çalışsın.

**Test:**
- [ ] Desktop: "Araçlar" hover/tıkla → dropdown açılır, 4 araç listelenir
- [ ] Dropdown'da "Hemen Kullan →" tıkla → `/uret?tab=metin` açılır
- [ ] Dropdown'da "Detaylar" tıkla → ana sayfada FeaturesTabbed'e scroll + ilgili sekme açılır
- [ ] FeaturesTabbed her sekmede CTA butonu var → doğru `/uret?tab=X`'e gider
- [ ] Mobil hamburger → "Araçlar" accordion açılır, alt maddeler tıklanır
- [ ] Transparent header (hero üstü) → dropdown yine beyaz ve okunabilir
- [ ] Sayfada olmayan bir yerden (örn: /fiyatlar) "Detaylar" tıklayınca → ana sayfaya gidip scroll eder

**Dosyalar:** `components/SiteHeader.tsx`, `components/tanitim/FeaturesTabbed.tsx`, `app/_tanitim.tsx` (section id)

### ✅ LP-07: Landing Page Tekrar Temizliği (P1) — DONE (dosya silme RF-01'e taşındı)
**Sorun:** Aynı 4 içerik türü (metin, görsel, video, sosyal medya) sayfada 4 kez tekrarlanıyor:
1. AuthHero — 4 aksiyon kartı (📝📷🎬📱)
2. HowItWorks — alt başlıkta "Metin, görsel, video, sosyal medya"
3. FeaturesTabbed — 4 sekme (aynı 4 tür)
4. FeatureCards — 4 detay kartı (aynı 4 tür, aynı ikonlar)

Kullanıcı sayfanın yarısına gelmeden "bunu zaten gördüm" hissediyor.

**Fix — 2 adım:**
- [ ] **FeatureCards bölümünü kaldır:** `app/_tanitim.tsx`'den `<FeatureCards>` component'ini ve import'unu sil. AuthHero'daki 4 kart + FeaturesTabbed detaylı sekmeler zaten aynı işi yapıyor. FeatureCards tamamen gereksiz tekrar. `hemenAlTikla` fonksiyonu hâlâ AuthHero'da kullanılıyor, onu koruyun. `onSatinAlClick` prop'u artık gereksiz.
- [ ] **BenefitsGrid'deki tekrar eden kartı değiştir:** 📦 kartı ("Metin, görsel, video, sosyal medya — tek fotoğraftan") zaten 3 kez anlatılmış. Bu kartı farklı bir avantaja çevir:
  - ESKİ: `{ ikon: "📦", baslik: "Metin, görsel, video, sosyal medya — tek fotoğraftan", aciklama: "Ayrı ayrı araçlarla uğraşma. Bir ürün fotoğrafı yükle, 4 içerik türünü tek platformdan üret." }`
  - YENİ: `{ ikon: "⚡", baslik: "Dakikalar içinde hazır", aciklama: "Fotoğraf yükle veya ürün bilgisi gir — listing metni 30 saniyede, stüdyo görseli 1 dakikada, tanıtım videosu 2 dakikada hazır." }`

**Sonra sıralama:**
```
<AuthHero />       ← 4 aksiyon kartı (metin/görsel/video/sosyal)
<HowItWorks />     ← 3 adım (akış)
<FeaturesTabbed /> ← 4 sekme (detaylı örnekler)
<BrandProfile />   ← marka profili
<BenefitsGrid />   ← 4 farklı avantaj (tekrar yok)
<LandingFAQ />     ← SSS
<TrustBand />      ← güven bandı
```

**Test:**
- [ ] Sayfa yüklenince FeatureCards bölümü görünmemeli
- [ ] BenefitsGrid'de "⚡ Dakikalar içinde hazır" kartı çıkmalı
- [ ] "Paket Satın Al" CTA'sı kaybolmuyor (BenefitsGrid'deki "Hemen dene" bölümü hâlâ var)
- [ ] Sayfada aynı mesajın 2 kereden fazla tekrarı olmamalı

**Dosyalar:** `app/_tanitim.tsx`, `components/tanitim/BenefitsGrid.tsx`, `components/tanitim/FeatureCards.tsx` (kullanılmayan dosya kalabilir veya silinebilir)

### ✅ LP-09: FeaturesTabbed UX İyileştirmesi — DONE
5 değişiklik (sıra, açıklama paragrafı, cursor-pointer, aktif tab bağlantısı, intro metinleri). Detay: `BACKLOG-DONE.md`

### ✅ UX-01: Metin Üretme Sayfası UX Revize + Küçük Fixler — DONE
8 değişiklik (hızlı başla kaldırıldı, global platform, alanlar birleştirildi, collapse, step indicator, marka checkbox kaldır, video deselect fix, kompakt input tipi). Detay: `BACKLOG-DONE.md`

### ✅ KF-04: kredi-yukle Sayfası Fiyat Tutarsızlığı (P0) — DONE
Hardcoded 29/79/149 TL → `PAKET_LISTESI` import'una çevrildi. Detay: `BACKLOG-DONE.md`

### ✅ UX-01b: Metin Sekmesi UX Düzeltmeleri (P1) — DONE
7 değişiklik (step indicator kaldır, kategori zorunlu, platform badge tüm sekmelere, fotoğraf mesajı, görsel kutu kaldır, sosyal=metin kalıbı, video=görsel kalıbı). Detay: `BACKLOG-DONE.md`

### FY-01: Fiyat Artışı — 49 / 129 / 299 TL (P1 — 10dk)

**Bağlam:** Enflasyon telafisi + strateji raporu önerisi. Mevcut fiyatlar (39/99/249) reel olarak aşınmış. Tek seferlik kredi satışı olduğu için kullanıcı direnci düşük.

**Değişiklik:**
- [ ] `lib/paketler.ts`'de fiyatları güncelle:
  - Başlangıç: 39 → **49 TL** (10 kredi, birim 4,90 TL)
  - Popüler: 99 → **129 TL** (30 kredi, birim 4,30 TL)
  - Büyük: 249 → **299 TL** (100 kredi, birim 2,99 TL)
- [ ] `app/fiyatlar/page.tsx`'deki senaryo tablosunda hardcoded fiyat varsa güncelle
- [ ] KF-04 tamamlandığı için diğer tüm sayfalar otomatik güncellenir (PaketModal, kredi-yukle, API)
- [ ] **CB-01 chatbot system prompt'unu da güncelle:** `components/ChatWidget.tsx`'deki fiyat bilgisi hâlâ 39/99/249 TL diyor — yeni fiyatlarla (49/129/299) değiştirilmeli

**Test:**
- [ ] /fiyatlar sayfasında yeni fiyatlar görünmeli
- [ ] PaketModal'da yeni fiyatlar görünmeli
- [ ] kredi-yukle sayfasında yeni fiyatlar görünmeli
- [ ] iyzico ödeme 49/129/299 TL üzerinden işlenmeli
- [ ] Birim fiyat hesapları doğru gösterilmeli

**Dosyalar:** `lib/paketler.ts`, `app/fiyatlar/page.tsx` (senaryo tablosu)

**Claude Code Promptu:**
```
FY-01: Fiyat artışı — paketler.ts güncelle

lib/paketler.ts'de 3 paketin fiyatlarını güncelle:
- Başlangıç: 39 → 49 TL
- Popüler: 99 → 129 TL
- Büyük: 249 → 299 TL

Kredi miktarları aynı kalıyor (10/30/100).
Birim fiyat hesabı varsa güncelle.
app/fiyatlar/page.tsx'de senaryo tablosunda hardcoded fiyat varsa onu da güncelle.
components/ChatWidget.tsx'deki chatbot system prompt'unda fiyatları 49/129/299'a güncelle.
Projede grep ile eski fiyatların (39 TL, 99 TL, 249 TL) başka yerde kalmadığını doğrula.
```

### LP-10: Araçlar Dropdown — Buton Düzeni (P2 — 15dk)

**Bağlam:** Araçlar dropdown'unda "Kullan →" ve "Detaylar" linkleri var. Mevcut sıra: Kullan solda, Detaylar sağda. Kullanıcı CTA'yı sağda bekliyor.

**Değişiklik:**
- [ ] `components/SiteHeader.tsx`'de Araçlar dropdown'undaki her araç satırında:
  - **Detaylar** sola al (text link, muted renk)
  - **Kullan →** sağa al (buton hissi: bg-indigo-600 text-white px-3 py-1 rounded-md hover:bg-indigo-700, veya mevcut accent renk)
- [ ] Mobil hamburger menüdeki sırayı da aynı şekilde güncelle

**Test:**
- [ ] Desktop dropdown: Detaylar solda (link), Kullan sağda (buton görünümü)
- [ ] Mobil hamburger: aynı düzen
- [ ] Hover/tıklama çalışıyor, doğru sayfaya yönlendiriyor

**Dosyalar:** `components/SiteHeader.tsx`

**Claude Code Promptu:**
```
LP-10: Araçlar dropdown buton düzeni

components/SiteHeader.tsx'de Araçlar dropdown'unu güncelle:
1. Her araç satırında "Detaylar" sola, "Kullan →" sağa geçsin
2. "Kullan →" buton stili alsın: bg-indigo-600 text-white px-3 py-1 rounded-md text-sm hover:bg-indigo-700 transition
3. "Detaylar" muted link olarak kalsın: text-gray-500 text-sm hover:text-gray-700
4. Mobil hamburger'deki aynı bölümü de güncelle
```

### REF-01: Referans Programı — Davet Et, İkinize +10 Kredi (P1 — 4-6 saat)

**Amaç:** Mevcut kullanıcıların arkadaşlarını davet etmesiyle organik büyüme. Mikro satıcı WhatsApp/Facebook gruplarında paylaşım potansiyeli yüksek. CAC neredeyse sıfır.

**Mekanik:**
1. Her kullanıcıya benzersiz referans kodu/linki atanır: `yzliste.com/r/{kod}`
2. Davet edilen kişi bu linkle kayıt olur → referans ilişkisi kaydedilir
3. Davet edilen kişi **ilk satın almasını** yaptığında → **her iki tarafa +10 kredi** eklenir
4. Sadece kayıt yeterli DEĞİL — ilk ödeme şart (fraud koruması)

**DB şeması (Supabase migration):**
- [ ] `referrals` tablosu oluştur:
  ```sql
  create table referrals (
    id uuid primary key default gen_random_uuid(),
    referrer_id uuid references profiles(id) not null,      -- davet eden
    referred_id uuid references profiles(id),                -- davet edilen (kayıt olunca dolar)
    referral_code text unique not null,                      -- benzersiz kod
    referred_email text,                                     -- davet linki tıklanınca (opsiyonel)
    status text default 'pending' check (status in ('pending','registered','completed','expired')),
    reward_given boolean default false,                      -- kredi verildi mi
    created_at timestamptz default now(),
    registered_at timestamptz,                               -- kayıt tarihi
    completed_at timestamptz                                 -- ilk ödeme tarihi
  );
  ```
- [ ] `profiles` tablosuna `referral_code text unique` kolonu ekle (her kullanıcıya otomatik atanır)
- [ ] RLS politikaları: kullanıcı sadece kendi referanslarını görsün

**Referans kodu üretimi:**
- [ ] Kullanıcı ilk kayıt olduğunda `referral_code` otomatik atansın (6 harf, benzersiz, ör: `abc123`)
- [ ] Profil sayfasından veya /hesap'tan erişilebilir olsun

**Referans linki akışı:**
- [ ] `/r/[code]` route'u: kodu cookie'ye yaz (30 gün TTL) → ana sayfaya yönlendir
- [ ] Kayıt sırasında cookie'deki referans kodu okunur → `referrals` tablosuna `referred_id` yazılır, status → `registered`
- [ ] İlk ödeme callback'inde (`/api/odeme/callback`): referral status kontrol et, `completed` değilse:
  - Status → `completed`, `completed_at` = now(), `reward_given` = true
  - Davet eden +10 kredi
  - Davet edilen +10 kredi
  - Her ikisine de bildirim (toast veya e-posta)

**UI bileşenleri:**
- [ ] **Profil/Hesap sayfasında "Davet Et" bölümü:**
  - Referans linki göster + kopyala butonu
  - "Arkadaşın ilk satın almasını yapınca ikinize +10 kredi!"
  - Davet istatistikleri: X kişi kayıt oldu, Y kişi satın aldı, toplam Z kredi kazandın
- [ ] **Landing page'de referans kodu varsa banner:**
  - "🎁 Davet kodunla geldin! Kayıt ol ve ilk satın almanda +10 bonus kredi kazan"
- [ ] **İlk satın alma sonrası kutlama:**
  - Davet edilen: "🎉 +10 bonus kredi hesabına eklendi!"
  - Davet eden: "🎉 Arkadaşın [isim] ilk satın almasını yaptı — sana +10 kredi!"

**Fraud koruması:**
- [ ] Aynı IP'den 24 saatte max 3 referans kaydı
- [ ] Self-referral engeli (aynı e-posta domain kontrolü + aynı IP kontrolü)
- [ ] Kredi sadece ilk satın almada verilir, tekrar eden satın almalarda değil
- [ ] Referans kodu 90 gün geçerli (cookie TTL 30 gün, DB'de expire)

**Paylaşım kolaylığı:**
- [ ] Kopyala butonu yanında WhatsApp ve Twitter/X paylaşım butonları
- [ ] WhatsApp paylaşım metni: "yzliste.com ile pazaryeri içeriklerimi AI ile üretiyorum. Bu linkle kayıt ol, ilk satın almanda ikinize +10 kredi hediye 🎁 {link}"

**Test:**
- [ ] Referans linki ile gelen kullanıcı kayıt olabilmeli
- [ ] Sadece kayıt → kredi verilmemeli (status: registered)
- [ ] İlk satın alma → her iki tarafa +10 kredi eklenmeli
- [ ] İkinci satın almada tekrar kredi verilmemeli
- [ ] Profil sayfasında davet istatistikleri doğru
- [ ] Self-referral engellenmiş olmalı

**Dosyalar:** Yeni: `app/r/[code]/route.ts`, migration dosyası. Mevcut: `app/api/odeme/callback/route.ts`, `app/hesap/page.tsx` veya profil sayfası, `components/` altında yeni RefBanner ve RefShare bileşenleri.

**Claude Code Promptu:**
```
REF-01: Referans Programı — Davet Et, İkinize +10 Kredi

BACKLOG.md'deki "### REF-01" spec'ini oku ve sırayla uygula:

1. Supabase migration: referrals tablosu + profiles'a referral_code kolonu + RLS
2. /r/[code] route: cookie yaz → ana sayfaya redirect
3. Kayıt akışında cookie'den referans kodu oku → referrals tablosuna yaz
4. Ödeme callback'inde referral tamamlama → iki tarafa +10 kredi
5. Profil/hesap sayfasında "Davet Et" bölümü: link kopyala + WhatsApp paylaş + istatistikler
6. Landing page'de referans banner (cookie varsa)
7. Fraud koruması: IP limit, self-referral engeli, tek seferlik ödül

Migration için: supabase migration new add_referral_system
Mevcut auth ve ödeme akışlarını bozma.
```

### UX-03: Üretim Sayfası Navigasyon Düzenlemesi (P1 — 3-4 saat)

**Bağlam:** Sahadan feedback: Excel toplu üretim için başka sayfaya gidince "kayboldum" hissi. Ayrıca yzstudio sayfası planlanıyor. Tüm üretim deneyimini tek sayfada toplamak gerekiyor.

**4 Değişiklik:**

**1) Kredi/üretim bilgi kutusunu kaldır:**
- [ ] `/uret` sayfasının üstündeki "Kalan kredi: X · Toplam üretim: Y · + Kredi Al" kutusunu kaldır
- [ ] Kredi bilgisi zaten header'da görünüyor, tekrar gereksiz
- [ ] Açılan alan sekmelere ve form'a daha fazla nefes verir

**2) yzstudio'yu 5. sekme olarak ekle:**
- [ ] Mevcut 4 sekmenin (Metin, Görsel, Video, Sosyal) yanına 5. sekme: "✨ Studio"
- [ ] Sekme üstünde küçük badge: "Yakında" (bg-amber-100 text-amber-700 text-xs px-2 rounded-full)
- [ ] Tıklayınca teaser ekran göster (ayrı sayfaya gitmesin, aynı container içinde):
  ```
  ✨ yzstudio — Yakında
  
  👗 Mankene Giydirme
  Ürün fotoğrafını yükle, AI manken üzerinde görsün.
  
  🎬 Video Try-On
  Giydirilmiş görselden tanıtım videosu oluştur.
  
  [Hazır olunca haber ver →]  (email toplama butonu, opsiyonel)
  ```
- [ ] Teaser tasarımı: koyu tema (mevcut yzstudio stili ile tutarlı), gradient arka plan, blur efekt
- [ ] "Hazır olunca haber ver" butonu tıklayınca basit bir email/bildirim kaydı (Supabase'e kayıt veya sadece PostHog event)

**3) Toplu üretimi metin sekmesine göm:**
- [ ] Metin sekmesindeki giriş tipi "📊 Excel" tıklayınca artık `/toplu`'ya redirect etmesin
- [ ] Aynı sekme içinde Excel yükleme akışı açılsın:
  - Excel dosya yükleme alanı (drag & drop veya dosya seç)
  - Yüklenen dosyanın satır önizlemesi (ilk 5 satır tablo olarak)
  - Kolon eşleştirme: hangi kolon = ürün adı, hangisi = kategori, vb.
  - "Toplu Üret — X kredi" butonu
  - Sonuçlar aynı sayfada liste olarak (her satır için üretilen içerik)
- [ ] Mevcut `/toplu` sayfasının mantığını ve bileşenlerini metin sekmesine taşı veya import et
- [ ] `/toplu` route'unu koru ama `/uret?tab=metin&giris=excel` sayfasına redirect yap (SEO ve eski linkler için)

**4) Sekme düzeni güncelleme:**
- [ ] Yeni sekme sırası: [📝 Metin] [📷 Görsel] [🎬 Video] [📱 Sosyal] [✨ Studio ^Yakında]
- [ ] Mobilde 5 sekme sığmıyorsa horizontal scroll veya 2 satır düzeni
- [ ] Studio sekmesi diğerlerinden hafif farklı stilde (ör: border-dashed veya opacity-80) "henüz aktif değil" hissi vermek için

**Test:**
- [ ] Kredi kutusu `/uret` sayfasında görünmemeli
- [ ] 5 sekme görünmeli, Studio'da "Yakında" badge
- [ ] Studio tıklayınca teaser ekran, sayfa değişmemeli
- [ ] Metin sekmesinde Excel giriş tipi tıklayınca aynı sayfada kalmalı
- [ ] Excel yükle → önizle → toplu üret akışı çalışmalı
- [ ] `/toplu` URL'si `/uret?tab=metin&giris=excel`'e redirect etmeli
- [ ] Mobilde 5 sekme kullanılabilir olmalı (scroll veya wrap)
- [ ] Mevcut tekli üretim akışları bozulmamış olmalı

**Dosyalar:** `app/uret/page.tsx`, `components/tabs/MetinSekmesi.tsx`, yeni `components/tabs/StudioSekmesi.tsx` (teaser), mevcut `/app/toplu/` bileşenleri (taşıma/import), `app/toplu/page.tsx` (redirect)

**Claude Code Promptu:**
```
UX-03: Üretim Sayfası Navigasyon Düzenlemesi — 4 değişiklik

BACKLOG.md'deki "### UX-03" spec'ini oku ve sırayla uygula:

ÖNCELİK SIRASI:
1. Kredi/üretim bilgi kutusunu kaldır (hızlı, bağımsız)
2. 5. sekme "✨ Studio" ekle — teaser ekran (koyu tema, yakında badge)
3. Metin sekmesine Excel toplu üretimi göm (/toplu'dan taşı)
4. /toplu route'unu /uret?tab=metin&giris=excel'e redirect yap

Mevcut 4 sekmenin üretim akışlarını bozma.
Studio sekmesi sadece teaser — henüz gerçek işlevsellik yok.
Toplu üretim mevcut /toplu mantığını kullanabilir, sayfaya import et.
```

### KG-01: Kredi Geçmişi + Kullanım Analitiği Dashboard (P2 — 3-4 saat)

**Amaç:** Kullanıcıya "bu platformdan ne kadar değer aldığını" göstermek. Değer algısı = sonraki satın alma tetikleyici. Mevcut `/hesap` dashboard'u temel verileri gösteriyor ama görsel analitik ve değer mesajı eksik.

**Mevcut durum:** `/hesap/page.tsx`'de bu ay üretim sayısı, toplam üretim, platform dağılımı, son 5 üretim zaten var. `uretimler` tablosu her üretimi logluyor (platform, kategori, input/output tokens, api_cost, created_at). `/hesap/uretimler/page.tsx` tam liste, `/hesap/krediler/page.tsx` ödeme geçmişi.

**Eklenecekler:**

**1) İçerik türü bazlı dağılım:**
- [ ] Dashboard'da metin / görsel / video / sosyal medya üretim sayılarını ayrı ayrı göster
- [ ] Her tür için ikon + sayı: "📝 47 metin · 📷 12 görsel · 🎬 3 video · 📱 8 sosyal"
- [ ] `uretimler` tablosunda içerik türü ayrımı yoksa, API route veya tablo adından çıkar (metin/gorsel/video/sosyal)

**2) Aylık trend grafiği:**
- [ ] Son 3 ayın haftalık üretim trendi — basit bar chart veya spark line
- [ ] Recharts kullan (zaten projede mevcut olabilir, yoksa ekle)
- [ ] X ekseni: haftalar, Y ekseni: üretim sayısı

**3) Kredi tüketim özeti:**
- [ ] "Bu ay X kredi harcadın" + tür bazlı dağılım (metin: 12, görsel: 8, video: 30 kredi)
- [ ] Kalan kredi belirgin: "💰 Kalan: 23 kredi"
- [ ] Kredi azalınca uyarı: < 5 kredi → "Kredin azalıyor — paket al" CTA

**4) Değer mesajı:**
- [ ] Dashboard üstünde kısa değer özeti: "Bu ay 47 içerik ürettin — freelancer'a verseydin tahmini ₺14.100 öderdin"
- [ ] Hesaplama basit: metin başına ~₺300 (freelancer fiyatı), görsel ~₺500, video ~₺2.000 tahmini
- [ ] Bu rakamlar hardcoded tahmini, hassas olması gerekmez — algı yaratması yeterli

**5) Son üretimler listesini genişlet:**
- [ ] Mevcut 5 → 10'a çıkar
- [ ] Her satırda: tür ikonu + ürün adı + platform + tarih + harcanan kredi
- [ ] "Tümünü gör →" linki `/hesap/uretimler`'e gitsin

**Test:**
- [ ] Dashboard'da içerik türü dağılımı doğru
- [ ] Trend grafiği son 3 ayı gösteriyor (veri yoksa boş state)
- [ ] Kredi tüketim özeti doğru hesaplanıyor
- [ ] Değer mesajı görünüyor (pozitif rakam)
- [ ] Düşük kredide uyarı + CTA görünüyor

**Dosyalar:** `app/(auth)/hesap/page.tsx`, muhtemelen yeni `components/dashboard/` bileşenleri

**Claude Code Promptu:**
```
KG-01: Kredi Geçmişi + Kullanım Analitiği Dashboard

BACKLOG.md'deki "### KG-01" spec'ini oku ve uygula:
1. /hesap dashboard'una içerik türü bazlı dağılım ekle (metin/görsel/video/sosyal)
2. Aylık trend grafiği (Recharts bar chart, son 3 ay haftalık)
3. Kredi tüketim özeti + düşük kredi uyarısı
4. Değer mesajı ("freelancer'a verseydin X TL öderdin")
5. Son üretimler 5→10, tür ikonu + kredi bilgisi ekle

Mevcut dashboard yapısını koru, üstüne ekle. uretimler tablosundan veri çek.
```

### MP-01: Mağaza Profili Genişletme (P2 — 2 saat)

**Amaç:** Marka profiline ek alanlar ekleyerek üretim kalitesini artırmak. Daha fazla bağlam = daha iyi prompt = daha spesifik çıktı.

**Mevcut alanlar:** marka_adi, ton (samimi/profesyonel/premium), hedef_kitle, vurgulanan_ozellikler. Tümü prompt'a enjekte ediliyor.

**Eklenecek alanlar:**

**1) Mağaza kategorileri:**
- [ ] `profiles` tablosuna `magaza_kategorileri text[]` kolonu ekle (array)
- [ ] UI'da multi-select chip/tag seçimi: Kadın Giyim, Erkek Giyim, Çocuk, Kozmetik, Elektronik, Ev & Yaşam, Gıda, Takı & Aksesuar, Spor, Oto, Kitap & Hobi, Diğer
- [ ] Max 3 kategori seçilebilsin
- [ ] Prompt'a enjekte: "Bu mağaza şu kategorilerde satış yapıyor: [kategoriler]"

**2) Fiyat bandı:**
- [ ] `profiles` tablosuna `fiyat_bandi text` kolonu ekle
- [ ] UI'da 3 seçenek (mevcut fiyat segmenti gibi ama mağaza genelinde):
  - 💰 Ekonomik (ürünler genelde 0-100 TL)
  - ⚖️ Orta segment (100-500 TL)
  - 👑 Premium (500 TL+)
- [ ] Prompt'a enjekte: "Mağazanın fiyat bandı: [band] — dil ve ton buna uygun olmalı"

**3) Teslimat/hizmet vurguları:**
- [ ] `profiles` tablosuna `teslimat_vurgulari text[]` kolonu ekle (array)
- [ ] UI'da checkbox grubu: ✈️ Hızlı kargo, 🔄 Kolay iade, 🇹🇷 Yerli üretim, 🌿 Organik/doğal, 📦 Hediye paketi, 🛡️ Garanti, 💳 Taksit imkanı
- [ ] Seçilenler her üretimde otomatik vurgulanır
- [ ] Prompt'a enjekte: "Bu mağazanın vurguladığı değerler: [seçilenler]"

**4) Rakip/benchmark mağaza (opsiyonel):**
- [ ] `profiles` tablosuna `benchmark_magaza text` kolonu ekle
- [ ] UI'da text input: "Beğendiğin veya hedeflediğin bir mağaza var mı? (opsiyonel)"
- [ ] Placeholder: "örn: LCW, Koton, benzer bir mağaza adı"
- [ ] Prompt'a: "Kullanıcı şu mağazayı referans alıyor: [isim] — benzer profesyonellikte içerik üret"

**Migration:**
- [ ] `supabase migration new expand_brand_profile`
```sql
alter table profiles
  add column if not exists magaza_kategorileri text[],
  add column if not exists fiyat_bandi text,
  add column if not exists teslimat_vurgulari text[],
  add column if not exists benchmark_magaza text;
```

**Prompt entegrasyonu:**
- [ ] `/app/api/uret/route.ts` ve diğer üretim route'larında profil bağlamını genişlet
- [ ] Mevcut `ctxParcalar` array'ine yeni alanları ekle
- [ ] Boş alanlar prompt'a eklenmemeli (mevcut mantık korunur)

**Test:**
- [ ] Marka profili sayfasında yeni alanlar görünmeli
- [ ] Kaydedince DB'ye yazılmalı, sayfayı yenileyince korunmalı
- [ ] Metin üretiminde yeni profil bilgileri çıktıya yansımalı (ör: "hızlı kargo" seçildiyse listingde geçmeli)
- [ ] Boş bırakılan alanlar hata vermemeli

**Dosyalar:** Migration dosyası, `app/(auth)/hesap/marka/page.tsx`, üretim API route'ları (`/api/uret/route.ts`, `/api/gorsel/route.ts` vb.)

**Claude Code Promptu:**
```
MP-01: Mağaza Profili Genişletme — 4 yeni alan

BACKLOG.md'deki "### MP-01" spec'ini oku ve uygula:

1. Supabase migration: profiles tablosuna 4 yeni kolon (magaza_kategorileri, fiyat_bandi, teslimat_vurgulari, benchmark_magaza)
2. /hesap/marka sayfasına yeni alanları ekle (multi-select chips, radio buttons, checkboxes, text input)
3. Üretim API route'larında profil bağlamını genişlet — yeni alanları prompt'a enjekte et
4. Boş alan kontrolü: sadece dolu alanlar prompt'a eklensin

Migration: supabase migration new expand_brand_profile
Mevcut profil kaydetme akışını bozma.
```

### LS-01: Listing Skor + Ücretsiz Revize (P1 — 3-4 saat)

**Amaç:** Üretilen metin içeriğine kural bazlı skor vermek, eksik bilgileri önermek, düşük skorda ücretsiz revize hakkı tanımak. Kullanıcıya "seni yarıyolda bırakmayız" hissi vermek. Sıfır ek AI maliyeti (skor), minimal maliyet (revize ~₺0,01).

**Skor hesaplama (rule-based, AI yok):**
Aşağıdaki kurallar platformdan bağımsız temel kontroller + platforma özel kurallar:

**Temel kontroller (her platform):**
| Kural | Puan | Koşul |
|---|---|---|
| Başlık uzunluğu | 0-15 | Platform max limitine yakınlık (ör: Trendyol 100 kar → 80-100 arası = 15 puan) |
| Özellik/madde sayısı | 0-15 | Platform beklentisi kadar varsa tam puan (ör: Trendyol 5 madde) |
| Açıklama uzunluğu | 0-10 | Min 150 karakter = tam puan |
| Etiket sayısı | 0-10 | Platform limiti kadar varsa tam puan (ör: Trendyol 10 etiket) |
| Anahtar kelime kullanımı | 0-10 | Kullanıcının girdiği keyword'ler çıktıda var mı |
| Ürün detay zenginliği | 0-20 | Renk, malzeme, boyut, adet, ağırlık, garanti bilgisi var mı (her biri +4) |
| Kategori uyumu | 0-10 | Kategori seçilmiş + çıktıda yansımış mı |
| Fotoğraf kullanımı | 0-10 | Fotoğraf yüklenmişse +10 (AI daha iyi çıktı üretir) |
| **Toplam** | **0-100** | |

**Eksik bilgi önerileri (skor düşükse hangi alan eksik):**
- [ ] Skor hesaplanırken hangi kurallardan puan kaybedildiği kaydedilsin
- [ ] Her eksik kural için kullanıcıya somut öneri gösterilsin:
  - Renk eksik → "🎨 Ürünün rengini ekle — alıcılar renk bilgisi arar"
  - Malzeme eksik → "🧵 Malzeme bilgisi ekle — %100 pamuk, paslanmaz çelik vb."
  - Boyut/adet eksik → "📏 Boyut veya adet bilgisi ekle — 500ml, 3'lü set vb."
  - Fotoğraf yok → "📷 Fotoğraf ekle — metin kalitesi önemli ölçüde artar"
  - Keyword eksik → "🔍 Anahtar kelime ekle — arama sonuçlarında öne çıkarsın"

**UI — Skor gösterimi (sonuç ekranında):**
- [ ] Üretilen içeriğin üstüne skor barı ekle:
  - **75-100:** Yeşil bar → "✅ Harika listing! Pazaryerine hazır." (opsiyonel ücretli revize butonu)
  - **50-74:** Turuncu bar → "⚠️ İyileştirilebilir — seni yarıyolda bırakmayız!" + eksik bilgi listesi + "🔄 Ücretsiz Yeniden Üret" butonu
  - **0-49:** Kırmızı bar → "❌ Eksik bilgi çok fazla" + eksik bilgi listesi + "🔄 Ücretsiz Yeniden Üret" butonu
- [ ] Skor barı animasyonlu dolsun (0'dan hedefe, 1sn)
- [ ] Skor sayısı büyük font ile gösterilsin (ör: **72**/100)

**Ücretsiz revize akışı (skor < 75):**
- [ ] "🔄 Ücretsiz Yeniden Üret" butonu aktif — sarı/turuncu vurgulu
- [ ] Tıklayınca form'a geri dön, eksik alanlar highlight edilmiş (sarı border veya pulse)
- [ ] Kullanıcı eksik bilgileri girer → "Ücretsiz Yeniden Üret" butonuna tıklar
- [ ] Backend'de kontrol: `uretimId` ile ilişkili, `ucretsizRevize: true` flag'i
  - Kredi düşülmez
  - Yeni sonuç gösterilir + yeni skor hesaplanır
  - Sadece 1 kez ücretsiz hak (ikinci revize ücretli)
- [ ] Revize sonrası yeni skor gösterilsin — idealde artmış olur, kullanıcı farkı görür

**Mevcut revize sistemiyle entegrasyon:**
- [ ] Şu an zaten "🔁 Yeniden üret" butonu var (ücretli veya yenidenUretHakki ile)
- [ ] Ücretsiz skor revizesi bundan ayrı bir buton olsun — kafa karışmasın
- [ ] Skor < 75 → "Ücretsiz Yeniden Üret (bilgi ekle)" butonu göster
- [ ] Skor ≥ 75 → sadece mevcut ücretli "Yeniden üret" butonu

**API değişikliği:**
- [ ] `/api/uretim/metin` (veya ilgili route) response'una `skor` ve `oneriler` alanları ekle
- [ ] Skor hesaplama fonksiyonu ayrı util: `lib/listingSkor.ts`
  - Input: üretilen çıktı (başlık, özellikler, açıklama, etiketler) + kullanıcı inputları (kategori, keyword, fotoğraf var mı) + platform kuralları
  - Output: `{ skor: number, oneriler: string[], detay: { kural: string, puan: number, maxPuan: number }[] }`
- [ ] Ücretsiz revize endpoint'i: mevcut endpoint'e `ucretsizRevize: true` + `uretimId` parametresi ekle
  - Backend kontrol: bu uretimId için daha önce ücretsiz revize yapılmış mı? Yapılmışsa → normal ücretli akış

**Test:**
- [ ] Eksik bilgiyle üretim yap → skor < 75 → öneriler listesi görünmeli
- [ ] "Ücretsiz Yeniden Üret" tıkla → form'a dön → eksik alanlar highlight
- [ ] Bilgi ekle → ücretsiz üret → kredi düşmemeli
- [ ] Yeni skor hesaplanmalı (idealde yükselmiş)
- [ ] İkinci revize → ücretli olmalı (kredi düşmeli)
- [ ] Tüm bilgilerle üretim → skor ≥ 75 → ücretsiz revize butonu yok
- [ ] Skor barı animasyonu çalışıyor
- [ ] Farklı platformlarda (Trendyol vs Etsy) kurallar değişiyor, skor farklı

**Dosyalar:** Yeni: `lib/listingSkor.ts`. Mevcut: `components/tabs/MetinSekmesi.tsx` (sonuç ekranı), `/api/uretim/metin` veya ilgili API route.

**Claude Code Promptu:**
```
LS-01: Listing Skor + Ücretsiz Revize

BACKLOG.md'deki "### LS-01" spec'ini oku ve sırayla uygula:

1. lib/listingSkor.ts oluştur — kural bazlı skor hesaplama fonksiyonu (AI yok, string matching)
   - Platform kurallarını lib/paketler.ts veya mevcut platform config'den al
   - 8 kural kategorisi, toplam 100 puan
   - Eksik bilgi önerileri array olarak dönsün
2. API response'una skor + oneriler ekle
3. MetinSekmesi sonuç ekranına skor barı ekle (animasyonlu, renkli)
4. Skor < 75 → öneriler listesi + "Ücretsiz Yeniden Üret" butonu
5. Ücretsiz revize akışı: forma geri dön (highlight) → bilgi ekle → kredi düşmeden üret
6. Backend'de ücretsiz revize kontrolü (uretimId başına 1 hak)

Mevcut üretim akışını bozma. Skor hesaplama tamamen client-side veya API-side olabilir — ek AI çağrısı yapma.
```

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
- [x] **F-31** ~~Referral programı~~ → REF-01 olarak aktif backlog'a taşındı (ilk satın almada +10 kredi her iki tarafa)
- [ ] **F-21** A11y tam audit (Lighthouse 95+, focus trap, aria)
- [ ] **F-32** `/changelog` + haftalık sürüm notu
- [ ] **F-33** Kredi süre sınırı politikası — şu an krediler süresiz (güçlü pazarlama mesajı). Kullanıcı tabanı büyüyünce (10.000+ kullanılmamış kredi birikimi) cash-flow riski oluşabilir. O noktada değerlendir: 12 ay son kullanma, "süresiz saklama" premium özellik olarak ayrıştırma, veya büyük paketlere özel süresiz. Şimdilik dokunma — "kredin bitmez" Roketfy'a karşı en net fark.

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

### ✅ SC-05 🔴 P1 — `/auth` hâlâ indexlenmiş! — Tüm maddeler DONE
> Detay: `BACKLOG-DONE.md`

### ✅ SC-03 🟢 P3 — Sitemap eksik sayfalar — DONE (zaten ekliydi)

### SC-06 🔴 P1 — Merchant Listings: "image" field eksik (KRİTİK)
**Tespit:** 21 Nisan 2026, Google Search Console mesajları.
**Etkilenen URL:** `https://www.yzliste.com/fiyatlar` — item: "yzliste — AI E-ticaret Listing Üretici"
**Sorun:** `/fiyatlar` sayfasındaki Product structured data'da `image` property'si yok. Bu **kritik** — image olmadan Merchant Listings rich results'da (Google Shopping) görünmek mümkün değil.
**Fix (Claude Code):**
- [x] `/fiyatlar` sayfasının JSON-LD structured data'sına `"image"` field'ı ekle. Mevcut OG image veya yzliste logosu kullanılabilir: `"image": "https://www.yzliste.com/yzliste_og.png"` (ya da sayfaya özel bir ürün görseli)
- [x] Aynı JSON-LD'deki `"offers"` objesine `"hasMerchantReturnPolicy"` ekle (MerchantReturnPolicy type — returnPolicyCategory: `MerchantReturnFiniteReturnWindow` vb.)
- [x] Aynı JSON-LD'deki `"offers"` objesine `"shippingDetails"` ekle (OfferShippingDetails type — deliveryTime, shippingRate vb.)
- [x] Fix sonrası Google Rich Results Test ile doğrula: https://search.google.com/test/rich-results
**Not:** hasMerchantReturnPolicy ve shippingDetails non-critical ama appearance iyileştirmesi sağlıyor. Hepsini birlikte yapmak mantıklı.

### SC-07 🟡 P3 — Product Snippets: aggregateRating + review eksik
**Tespit:** 21 Nisan 2026, Google Search Console mesajları.
**Etkilenen URL:** `/fiyatlar` (aynı sayfa)
**Sorun:** Product structured data'da `aggregateRating` ve `review` field'ları yok. Bunlar non-critical (Google'da valid olarak sayılıyor) ama eklenmesi yıldız gösterimini (star ratings) aktive eder → daha yüksek CTR.
**Fix (Claude Code — ileride):**
- [ ] Gerçek kullanıcı review'ları toplanınca aggregateRating ve review field'ları ekle. Sahte/hardcode review verileri **kullanılmamalı** — Google bunu tespit edip ceza verebilir.
**Karar:** Bu madde şu an ileride (review sistemi kurulunca). Sahte veri girmeyelim.

### SC-01 Güncelleme (21 Nisan 2026)
SC-01 redirect validation durumu güncellendi: önceki "Failed" (4/18) sonrası yeni validation "Started" (4/20). 4 redirect URL değişmedi (http→https, non-www→www). Beklenen davranış — aksiyon gerekmez.

### SC-02 Güncelleme (21 Nisan 2026)
SC-02 "Discovered — currently not indexed" hâlâ 14 sayfa. Validation "Started" (4/19). 13 blog + /fiyatlar. Sitemap yeniden submit + URL Inspection "Request Indexing" yapılması bekleniyor (Aziz manuel).

### SC-04 🟢 P3 — Blog meta description güncelle
`app/blog/page.tsx` description'ı dar: sadece "listing yazma rehberleri, AI görsel kullanımı, platform karşılaştırmaları ve e-ticaret ipuçları" diyor. 40 blog yazısının kapsamı çok daha geniş: video, sosyal medya, TikTok, N11, fiyatlandırma, mankene giydirme, barkod, SEO, iade yönetimi vb.
**Fix:** Description'ı genişlet + keywords dizisini güncelle + OpenGraph/Twitter description'ları uyumlu hale getir + JSON-LD description güncelle.

---

## 📎 Notlar (Claude Code için)
- **Bu dosya iş takip listemiz.** Her oturumun başında oku, nerede kaldığımızı anla.
- Bir iş bittiğinde `- [ ]` → `- [x]` olarak güncelle. Yarım iş `[x]` olmaz.
- `~%XX` notları kısmen tamamlanmış item'ları gösterir — bunları tamamla, sonra `[x]` yap.
- Her küme tek PR değil. Küme içinde 3-5 PR olabilir ama aynı branch ailesinde.
- `[DECIDE]` olmayan her karar default'la git: **TanStack Query v5**, **PostHog EU Cloud**, **Upstash Redis**, **Clou
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           