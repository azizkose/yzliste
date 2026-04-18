# yzliste Backlog

Aşama: pre-traffic. Demo hazırlığı — içerik kalitesi 1 numara öncelik.
Claude Code için: **KÜME 0 EN ÖNCELİKLİ.** Üstten aşağı yap. Küme içindeki item'lar bağımlıdır → sırayla.

> **Son tarama: 2026-04-18** — Cowork tam audit. Tüm [x] maddeler koda karşı doğrulandı.
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
- [ ] **PQ-27** `http://www.yzliste.com/` "Crawled – not indexed": Canonical eklendi — Search Console'da "URL Denetimi"nden reindex iste. Deploy sonrası manuel aksiyon.

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
- [ ] **PQ-28** Monolith refactor — `page.tsx` (2065 satır) ve `auth/page.tsx` (886 satır) parçalanacak:
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
- [ ] **PQ-30** Dosya truncation riski — çoklu araç çakışma önlemi:
  Cowork + Claude Code aynı anda aynı dosyaya yazarsa truncation olabiliyor (page.tsx 2322→2052 satıra düşmüş, hesap/ayarlar/page.tsx de kesilmiş). `.git/index.lock` stale kalıyor.
  **Kural:** Kod yazan tek araç Claude Code olsun. Cowork analiz/planlama/BACKLOG yazımı yapsın, koda dokunmasın.
  **Kontrol:** Deploy öncesi `git diff --stat` ile tüm dosyaların doğru satır sayısında olduğunu doğrula.

- [ ] **DoD** Demo testi: 5 farklı ürün (kozmetik, elektronik, giyim, gıda, takı) × 3 platform (Trendyol, Amazon, Etsy) = 15 listing üret. Her biri için görsel + video. Sonuçlar tutarlı, halüsinasyonsuz ve platforma uygun olmalı.

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

- [ ] **QA-04** P1 — TC Kimlik KVKK eksik (B-007 + B-025):
  ⚠️ Kısmen düzeldi: Aydınlatma cümlesi eklendi ("TC kimlik numaranız yalnızca e-Arşiv fatura için kullanılır"). Ama:
  1. Açık rıza checkbox'ı yok (KVKK 5/1 gereği zorunlu)
  2. Saklama süresi beyanı yok
  3. Veri sahibi hakları bilgisi yok
  **Gerekli:** "TC Kimlik verimi e-Arşiv fatura amacıyla işlenmesine açık rıza veriyorum" checkbox (default unchecked) + saklama süresi (örn. 10 yıl) + silme/düzeltme hakkı bilgisi. Hukukçu görüşü alınmalı.

- [x] **QA-05** P2 — Çelişen CTA mesajları (B-008): Hero + banner birleştirildi. "İçerik üretmek için hesap gerekli" bilgisi hero subtitle'a taşındı, ayrı info banner kaldırıldı.

- [x] **QA-06** P2 — Kredi/üretim sayacı etiket tutarsızlığı (B-010):
  ✅ Tamamlandı: Anasayfa sidebar'da "Kullanılan" → "Toplam üretim" olarak güncellendi. Hesap/profil sayfalarıyla tutarlı.

- [ ] **QA-07** → QA-14 ile birleştirildi (auth-aware header kök neden).

- [ ] **QA-09** P3 — Logged-out form gösterimi (B-014): Hala açık. Form tam görünüyor, "Üret" deyince ne olacağı belirsiz.

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
- [ ] **QA-14** P1 — İki farklı header implementasyonu → tutarsız deneyim (B-026): ⚠️ Tur 4 regresyon
  🔑 **3 bulgunun kök nedeni:** B-011 (farklı header), B-018 (login'liye kayıt CTA), B-019 (login'li /giris formu).
  **Doğrulama:** `SiteHeader.tsx` aslında auth-aware (useCurrentUser + useCredits). Ama `page.tsx` kendi inline header'ını kullanıyor (satır 850+). İki ayrı header = iki ayrı davranış.
  **Fix:** page.tsx inline header'ı kaldır, SiteHeader'ı kullan. Root layout'a SiteHeader ekle (her sayfada tek header). Middleware ile `/giris`, `/kayit`'te logged-in → `/` redirect.
  **İlişki:** PQ-28 monolith refactor ile birlikte çözülmeli.

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

- [ ] **HC-01** P1 — Canonical tag yanlış sayfalarda homepage'e işaret ediyor: ⚠️ Tur 4 regresyon
  `/giris`, `/kayit`, `/sss` sayfalarının canonical tag'ı `https://www.yzliste.com/` (homepage) gösteriyor. Her sayfanın canonical'ı kendi URL'si olmalı.
  **Fix:** Her üç sayfanın metadata'sına `alternates: { canonical: '...' }` eklendi.

- [ ] **HC-02** P2 — Kırık iç linkler (404 dönen): ⚠️ Tur 4 regresyon
  1. `/video` → kodda `href="/video"` bulunamadı, audit kaynaklı FP olabilir.
  2. `/blog/ai-gorsel-uretimi-e-ticaret` → `page.tsx` satır 1083'te link vardı. `/blog/e-ticaret-icin-ai-urun-fotografciligi` olarak güncellendi.

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
- [ ] **T4-01** — `/giris` tab switcher butonları `type="button"` değil, çift submit oluşuyor. Fix: AuthForm.tsx'te tab butonlarına `type="button"` ekle.
- [x] **T4-03** — Giriş sonrası header hâlâ "Giriş Yap" gösteriyor, "Çıkış" butonu yok. ⚠️ QA-14 regresyon. Fix: AuthForm login sonrası currentUser+credits query invalidate eder → header anında güncellenir.
- [x] **T4-05** — `/profil` 44 kredi, `/hesap/krediler` 0 kredi gösteriyor. Fix: stale TanStack cache yerine direkt DB değeri gösteriliyor.
- [x] **T4-09** — `/profil` `robots: index, follow` — kullanıcı profili arama motoruna sızabilir. Fix: `app/profil/layout.tsx` noindex var (zaten tamamdı).
- [x] **T4-10** — `/kosullar`, `/gizlilik` canonical ana sayfaya kırılmış. ⚠️ HC-01 regresyon. Fix: zaten doğru canonical'lar mevcut (önceki commit'te düzelti).
- [x] **T4-11** — Tüm sayfalarda çift "yzliste" başlık (`X — yzliste | yzliste`). Fix: 10 sayfada `— yzliste` suffix kaldırıldı, template `| yzliste` ekliyor.
- [x] **T4-12** — Blog yazılarında `og:image` eksik/jenerik. ⚠️ HC-02/HC-03 regresyon. Fix: og+twitter image kapakGorsel → og-image.png fallback ile tamamlandı.
- [x] **T4-13** — 404 sayfası `robots: index, follow` ve canonical var. Fix: zaten `robots: { index: false }` + `{ absolute: '...' }` title mevcut.

**P1 (2 hafta):**
- [ ] **T4-02** — Preview env'de `/giris` ve `/kayit` GET fetch status 0 dönüyor. (Preview env config sorunu, prod'da OK)
- [ ] **T4-04** — Header'a kredi sayacı rozeti ekle.
- [x] **T4-07** — `/iletisim` 404 dönüyor. Kontrol: hiçbir component'te link yok, audit FP.
- [x] **T4-14** — HTML entity title'larda literal. Kontrol: kaynak kodda `&amp;`/`&#x27;` metadata'da yok, audit FP.
- [x] **T4-15** — hreflang eksik. Kontrol: `<html lang="tr">` + `alternates.languages` `tr`/`x-default` zaten mevcut.

**P2:**
- [ ] **T4-06** — `/hesap/profil` ↔ `/profil` route çakışması — mimari karar.
- [x] **T4-08** — `/demo` referanslarını grep-kontrol et. Sonuç: kod tabanında `/demo` linki yok.
- [ ] **T4-17** — JSON-LD Organization duplication temizliği.

**Test Altyapısı:**
- [ ] **TEST-INFRA-01** — Test hesap bayrağı (`is_test` flag) — ödeme geçmişi filtrele + sınırsız kredi.
- [ ] **TEST-INFRA-02** — 5 sabit ürün fixture'ı.
- [ ] **TEST-MCP-01** — Mobil viewport tooling (Chrome MCP resize alternatif) — Layer B tamamlansın.

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
- [ ] **F-20b** Marka sesi kısa kitapçık: ton (arkadaşça+uzman, "sen" dili), yasaklı kelimeler, her state için örnek metin. ⚠️ Henüz hiç doküman yok.
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
- [ ] **F-06** Ödeme butonu state machine düzeltmesi (trafik yoksa boş bug)
- [ ] **F-24** iyzico webhook idempotency + signature verify + polling fallback
- [ ] **F-15** Mobil QA matrisi (BrowserStack, iPhone SE / 14 Pro Max / Galaxy S22 / iPad)
- [ ] **F-27** Görsel/video moderasyon (OpenAI moderation veya Google Safe Search)
- [ ] **F-29** Crisp/Tidio destek widget + SSS genişletme
- [ ] **F-30** Ana sayfa sosyal kanıt sayaçları (DB'den agg)
- [ ] **F-31** Referral programı (`/r/[code]`, davet eden + edilene 20 kredi)
- [ ] **F-21** A11y tam audit (Lighthouse 95+, focus trap, aria)
- [ ] **F-32** `/changelog` + haftalık sürüm notu

---

## 📎 Notlar (Claude Code için)
- **Bu dosya iş takip listemiz.** Her oturumun başında oku, nerede kaldığımızı anla.
- Bir iş bittiğinde `- [ ]` → `- [x]` olarak güncelle. Yarım iş `[x]` olmaz.
- `~%XX` notları kısmen tamamlanmış item'ları gösterir — bunları tamamla, sonra `[x]` yap.
- Her küme tek PR değil. Küme içinde 3-5 PR olabilir ama aynı branch ailesinde.
- `[DECIDE]` olmayan her karar default'la git: **TanStack Query v5**, **PostHog EU Cloud**, **Upstash Redis**, **Clou                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        