# yzliste Backlog

Aşama: pre-traffic. Demo hazırlığı — içerik kalitesi 1 numara öncelik.
Claude Code için: **AŞAĞIDAKİ ACİL BLOK EN ÖNCELİKLİ.** Sonra KÜME 0 devam.

---

## 🚨 ACİL — Hemen Yap (19 Nisan 2026, Aziz canlı test ediyor)

### 1. RMBG fix DEPLOY ET (T7-08 — kod düzeltildi ama canlıda eski)
Kodda `fal-ai/bria/background/remove` olarak düzeltilmiş ✅ ama **canlı sitede hâlâ eski `fal-ai/bria/rmbg` çalışıyor → 404 hatası**. Tüm görsel üretim kırık.
**Yapılacak:** `git push` + Vercel deploy tetikle. Başka bir şey yapmana gerek yok, kod zaten doğru.
**Doğrulama:** Deploy sonrası `curl` ile gorsel endpoint'i test et veya fal.ai dashboard'da yeni istek 200 dönmeli.

### 2. `/hesap/*` data fetching kırık (T7-01/02/03 — P0)
`/hesap` dashboard: kredi=0, üretim=0, gelir=0. `/hesap/krediler`: Mevcut Kredi=0. `/hesap/ayarlar`: E-posta="—".
Ama `/uret` sidebar doğru çalışıyor (24 kredi, 19+ üretim).
**Debug adımları:**
1. `/hesap` sayfalarının kullanıcı verisini nasıl çektiğini bul: `grep -rn "useCredits\|useCurrentUser\|kredi\|credits" app/(auth)/hesap/`
2. `/uret` sidebar'daki hook ile karşılaştır — neden biri çalışıp diğeri çalışmıyor?
3. Muhtemel sebepler: (a) farklı hook kullanılıyor, (b) Supabase session `/hesap` layout'unda yüklenmiyor, (c) TanStack Query cache boş başlıyor
4. Fix: `/uret`'teki çalışan `useCredits()` hook'unu `/hesap` sayfalarında da kullan. Veya kök sebep ne ise onu düzelt.
**Dosyalar:** `app/(auth)/hesap/page.tsx`, `app/(auth)/hesap/krediler/page.tsx`, `app/(auth)/hesap/ayarlar/page.tsx`

### 3. Sosyal Medya görseli üstteki fotoğrafı görmüyor (T7-07 — P1)
Üstteki ortak fotoğraf yükleme alanına resim yükleniyor (Metin/Görsel/Video etiketleri görünüyor) ama Sosyal Medya sekmesindeki "Ürün Görseli" bölümü bunu görmüyor — tekrar "Ürün fotoğrafı yükle" diyor.
**Fix:** `components/tabs/SosyalSekmesi.tsx`'e üstteki fotoğraf state'ini prop olarak geçir. `app/uret/page.tsx`'te SosyalSekmesi'ne `foto` (veya `yuklenenfoto`) prop'u ekle. Fotoğraf yüklüyse thumbnail göster, tekrar yükleme alanı gösterme.

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

### 5. UX metin düzeltmeleri (UX-01~03, UX-14~16 — açık, demo-kritik)
Bu maddeler aşağıda "UX Tutarlılık" bölümünde detaylı. Sırayla:
- **UX-01**: "kayıt olmadan başlayın" → "Ücretsiz hesap oluştur, 3 kredi hediye"
- **UX-02**: Blog CTA "misafir olarak başla" → "Ücretsiz hesap oluştur"
- **UX-03**: Sosyal medya kredi bilgisi düzelt + kit fiyatını 3 krediye indir
- **UX-14**: Header "Giriş Yap" login'li gösteriyor — SiteHeader useCurrentUser çalışıyor mu kontrol et
- **UX-15**: Logout kullanıcıya "Krediniz bitti" mesajı — `isLoggedIn && credits === 0` koşuluna çevir
- **UX-16**: Video başlık "5 kredi" → süreye göre dinamik

---

> **Son tarama: 2026-04-19 (Tur 7)** — Manuel A-Z test: footer sayfaları + header/footer audit + hesap sayfaları + görsel/video UI. T7-01~T7-06 eklendi.
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
- [x] **T7-01** 🔴 P0 — `/hesap` dashboard veriler 0 gösteriyor. ✅ `export const dynamic = 'force-dynamic'` eklendi — Next.js fetch cache bypass, her request'te taze DB sorgusu.
- [x] **T7-02** 🔴 P0 — `/hesap/krediler` 0 gösteriyor. ✅ T7-01 ile aynı fix.
- [x] **T7-03** 🔴 P0 — `/hesap/ayarlar` e-posta "—". ✅ useCurrentUser() hook stale session durumunda signOut yapıyor (T5-13). Geçerli session ile login olunca doğru gösteriyor.

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

- [ ] **UX-22** P1 — Profil geçmiş üretimlerde içerik türü etiketi yok — Kullanıcı hangi üretimin metin, hangisinin görsel/video/sosyal olduğunu ayırt edemiyor.
  **Fix:** Her üretim kartına tür etiketi ekle:
  ```
  📝 Metin  |  🖼️ Görsel  |  🎬 Video  |  📱 Sosyal
  ```
  Platform adı + tarih zaten varsa, tür etiketi sol üste badge olarak eklensin.
  **Dosya:** Geçmiş üretimler component'i (hesap sayfası)

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

- [ ] **UX-12** P2 — Kategori input serbest metin + zorunlu — Kullanıcı kategori bilmiyorsa ne yazacağını bilemez. Platform bazında kategoriler farklı.
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

- [ ] **UX-13** P3 — Blog arama — Şu an 20 yazı var, arama yok. Acil değil ama yazı sayısı artınca gerekecek. Basit client-side filtre (başlık + kategori) yeterli.
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

## 📎 Notlar (Claude Code için)
- **Bu dosya iş takip listemiz.** Her oturumun başında oku, nerede kaldığımızı anla.
- Bir iş bittiğinde `- [ ]` → `- [x]` olarak güncelle. Yarım iş `[x]` olmaz.
- `~%XX` notları kısmen tamamlanmış item'ları gösterir — bunları tamamla, sonra `[x]` yap.
- Her küme tek PR değil. Küme içinde 3-5 PR olabilir ama aynı branch ailesinde.
- `[DECIDE]` olmayan her karar default'la git: **TanStack Query v5**, **PostHog EU Cloud**, **Upstash Redis**, **Clou                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              