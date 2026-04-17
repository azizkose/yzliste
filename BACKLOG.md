# yzliste Backlog

Aşama: pre-traffic. Demo hazırlığı — içerik kalitesi 1 numara öncelik.
Claude Code için: **KÜME 0 EN ÖNCELİKLİ.** Üstten aşağı yap. Küme içindeki item'lar bağımlıdır → sırayla.

> **Son tarama: 2026-04-17** — Kod taranarak güncellenmiştir. `~` işareti = kısmen yapılmış, eksik kısmı parantezde.
> **Küme 0 güncellemesi: 2026-04-17** — PQ-01~PQ-10 tamamlandı.

---

## 🔥 KÜME 0 — İçerik Kalitesi (EN ÖNCELİKLİ — Demo için kritik)
Bu küme firmalara demo göstermek için gerekli. Diğer her şeyden önce gelir.
Detaylı prompt içerikleri ve implementasyon rehberi: **PROMPT-REHBER.md** dosyasına bak.

### P0 — Acil (kredi kaybını önler)
- [x] **PQ-01** Video şablonlarını hang-safe yap: 4 mevcut şablonun prompt'larını güncelle (`app/page.tsx` video preset'leri + `app/api/sosyal/video/route.ts` otomatik prompt). Her harekete bitiş noktası ekle. Detay: `PROMPT-REHBER.md § Video Şablonları`
- [x] **PQ-02** Eski caption route'u kaldır: `app/api/sosyal/caption/route.ts` sil. `app/api/sosyal/route.ts` zaten daha gelişmiş ve 4 platform destekliyor. Frontend'de bu route'a istek atan kodu bul ve sosyal/route.ts'e yönlendir

### P1 — Görsel Pipeline (kaliteyi 2x artırır)
- [x] **PQ-03** Görsel pipeline'a RMBG ekle: `fal-ai/bria/rmbg` endpoint'ini çağır, arka planı kaldır, SONRA product-shot'a gönder. `app/api/gorsel/route.ts`'de foto upload sonrası RMBG adımı ekle. Detay: `PROMPT-REHBER.md § Görsel Pipeline`
- [x] **PQ-04** Görsel'de placement_type'ı "automatic" yap (şu an manual_padding). API her görsel için 10 pozisyon önerir, en iyi 4'ünü döndür
- [x] **PQ-05** Kategori → stil önceliklendirme: Kategori seçiliyse stil kartlarını önerilen sıraya göre sırala. Mapping: `PROMPT-REHBER.md § Kategori-Stil Eşleştirme`

### P1 — Metin Kalitesi (içerik farkını yaratır)
- [x] **PQ-06** Metin formuna 3 yeni input ekle — tüm platform'larda geçerli:
  1. `hedefKitle` dropdown: Genel / Kadınlar / Erkekler / Gençler / Ebeveynler / Profesyoneller / Sporcular
  2. `fiyatSegmenti` radio: Bütçe / Orta / Premium
  3. `anahtarKelimeler` input: Virgülle ayrılmış serbest metin
  Bu 3 alan sistemPromptOlustur()'a parametre olarak gidecek ve prompt'a eklenecek. Detay: `PROMPT-REHBER.md § Yeni Input Prompt Entegrasyonu`
- [x] **PQ-07** Kategori-bazlı prompt katmanı: `KATEGORI_KURALLARI` objesi oluştur (7 kategori). Kullanıcının seçtiği kategoriye göre ICERIK_KURALLARI'na ek kurallar inject et. Detay: `PROMPT-REHBER.md § Kategori Prompt Katmanı`
- [x] **PQ-08** Platform yasaklı kelime listelerini genişlet: Her platform için ayrı bannedWords[] dizisi. Prompt'a "Bu kelimeleri ASLA kullanma:" olarak inject et. Detay: `PROMPT-REHBER.md § Yasaklı Kelimeler`

### P2 — Video Kategorileri + Sosyal İyileştirme
- [x] **PQ-09** Video şablonlarını kategoriye göre çoğalt: 7 kategori × 2-3 şablon = ~18 preset. Frontend'de kategori seçiliyse ilgili preset'leri göster. Detay: `PROMPT-REHBER.md § Kategori Video Şablonları`
- [x] **PQ-10** Video negative_prompt'u genişlet: mevcut + "static, jerky, pixelated, morphing, unnatural movement"
- [x] **PQ-11** Video'ya 1:1 format ekle (pazaryeri kare video için). `app/page.tsx` video format seçeneklerine ekle + API'de destekle
- [x] **PQ-12** Sosyal Medya Kiti: Tek butonla 1 görsel (sosyal format) + 4 platform caption birden üret. Yeni endpoint veya mevcut endpoint'leri orchestrate et
- [x] **PQ-13** Sezon/etkinlik modu: Sosyal caption'da dropdown — Normal / Anneler Günü / Babalar Günü / Bayram / Yılbaşı / Black Friday / Sevgililer Günü. Prompt'a mevsimsel context ekle

### P3 — Mimari İyileştirme
- [x] **PQ-14** Sekmeler arası bilgi taşıma: Metin'de girilen urunAdi + kategori + platform → Görsel/Video/Sosyal sekmelerine otomatik taşı. Zustand store veya React context ile
- [x] **PQ-15** Prompt versiyonlama: Tüm prompt'ları `/lib/prompts/` altına taşı. Her prompt dosyası version numarası içersin. DB'ye uretim kaydında prompt_version ekle

- [ ] **DoD** Demo testi: 5 farklı ürün (kozmetik, elektronik, giyim, gıda, takı) × 3 platform (Trendyol, Amazon, Etsy) = 15 listing üret. Her biri için görsel + video. Sonuçlar tutarlı, halüsinasyonsuz ve platforma uygun olmalı.

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
- [ ] **F-14d** Üretim mutation — `onSuccess`'te `['credits']` invalidate *(~%80: invalidateCredits çağrılıyor ama formal useMutation hook yok, imperative logic page.tsx içinde)*
- [ ] **F-14e** Header + app içi + profil sayfalarında kredi sayacını tek hook'a bağla (Context/prop drilling kaldır) *(~%50: useCredits hook var ama header'da kullanılmıyor, page.tsx'te local state)*
- [ ] **F-13** 3 test hesabı (DB insert): `test-normal@yzliste.com` (10 kredi), `test-zero@yzliste.com` (0 kredi), `test-new@yzliste.com` (her sprint reset). Credentials 1Password/Bitwarden vault'a.
- [ ] **DoD** Geri tuşu modal'ı kapatıyor (siteyi kapatmıyor). `/fiyatlar` direk linkle SSR açılıyor. `/app/sonuc/[id]` paylaşılabilir. Kredi sayacı 3 yerde aynı.

---

## 📊 KÜME 2 — Analytics + Consent (Küme 1'den sonra)
PostHog'u consent altyapısıyla birlikte kur — sonradan geri ekleme külfeti olmasın.

- [x] **F-28a** PostHog EU Cloud hesap aç. Env: `NEXT_PUBLIC_POSTHOG_KEY`, `api_host=https://eu.i.posthog.com`
- [x] **F-28b** `posthog-js` kur. Root provider. `person_profiles: 'identified_only'`, `capture_pageview: false`, başlangıçta `opt_out_capturing()`
- [x] **F-28c** `PostHogPageView` component (App Router için manuel `$pageview` tetikleme — `usePathname` + `useSearchParams`)
- [ ] **F-28d** Login/logout'ta `identify()` / `reset()`. Properties: `email, plan, signup_date, total_generations` *(~%80: identify() çalışıyor, ama signOut sonrası analytics.reset() eksik)*
- [x] **F-28e** 9 custom event: `signup_started`, `signup_completed`, `generation_started`, `generation_completed`, `generation_failed`, `credit_purchase_started`, `credit_purchase_completed`, `credit_exhausted`, `share_clicked`. Her biri doğru yerde + doğru property ile.
- [x] **F-08a** Cookie consent banner (`vanilla-cookieconsent` v3). 3 kategori: Zorunlu / Analitik / Pazarlama. Default: hepsi KAPALI.
- [x] **F-08b** Google Consent Mode v2: `gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied' })`
- [x] **F-08c** Consent 'accept analytics' olunca `posthog.opt_in_capturing()` + `gtag('consent', 'update', { analytics_storage: 'granted' })`
- [x] **F-08d** `/gizlilik` içeriğini KVKK formatına yeniden yaz (veri sorumlusu, kategori, amaç, hukuki sebep, aktarım, saklama, Madde 11 hakları, başvuru yolu)
- [x] **F-08e** Ayrı `/cerez-politikasi` ve `/kvkk-aydinlatma` sayfaları
- [ ] **DoD** PostHog dashboard'da 9 event + `$pageview` görünüyor. Consent reddedilirse hiçbir event gitmiyor (network tab ile doğrula).

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
- [ ] **F-17b** CSP middleware (nonce-based): `default-src 'self'; script-src 'self' 'nonce-XXX' ...` *(~%60: CSP header next.config.ts'de var ama nonce-based değil, unsafe-inline kullanıyor)*
- [x] **F-16** Font: `import { GeistSans } from 'geist/font/sans'` + `className={GeistSans.variable}`. Hero görselde `priority={true}`.
- [ ] **DoD** `curl -I https://yzliste.com` tüm header'ları gösteriyor. 100 istek/dk'da 60. istekten sonra 429. CSP ihlal raporu Sentry'ye düşüyor (varsa).

---

## ⚖️ KÜME 5 — Yasal Belgeler (Paralel, kod gerektirmez — metin işi)
Hukuki kontrol gerek. Küme 1'e bağlı değil ama route'lar açılınca yayına al.

- [x] **F-07a** Kullanım Koşulları metni → `/kosullar`
- [x] **F-07b** Mesafeli Satış Sözleşmesi → `/mesafeli-satis`
- [x] **F-07c** İade Politikası (kredi expire süresi net, cayma hakkı istisnası) → `/teslimat-iade` *(route adı /iade yerine /teslimat-iade olarak oluşturulmuş — OK)*
- [ ] **F-07d** Checkout'ta 3 checkbox (açık rıza): Koşullar / Mesafeli Satış / KVKK. İşaretlenmeden satın alma disable. *(~%30: auth formunda 1 checkbox var ama checkout akışında 3 ayrı checkbox yok)*
- [ ] **F-07e** Footer'da 4 link: Kullanım / Mesafeli Satış / İade / Gizlilik *(~%75: Gizlilik + Mesafeli Satış + Teslimat İade var, Kullanım Koşulları linki eksik)*
- [ ] **DoD** 3 belge hukukçu onayı ile yayında. Checkout akışında 3 checkbox kayıtlı (DB'de timestamp + IP).

---

## 👤 KÜME 6 — Hesap Ayarları + Fatura (Küme 1'den sonra)

- [x] **F-09a** `/hesap/ayarlar`: E-posta değiştir, Şifre değiştir
- [x] **F-09b** "Verilerimi indir" → JSON export (kullanıcı + üretim geçmişi + ödeme kayıtları)
- [x] **F-09c** "Hesabı sil" akışı: onay modal → DB'de `deleted_at` set (soft delete) → 30 gün sonra cron job ile kalıcı sil
- [x] **F-09d** Silme talebi log tablosu (KVKK denetim için)
- [x] **F-25a** Paraşüt hesabı + API key
- [ ] **F-25b** Checkout'a "Fatura Bilgileri" adımı: Ad/Unvan, TC/VKN, Adres, Fatura tipi (bireysel/kurumsal)
- [x] **F-25c** iyzico webhook handler içinde Paraşüt API çağrı → e-Arşiv oluştur → PDF link kaydet
- [ ] **F-25d** `/hesap/faturalar` — kullanıcı PDF indirebilir + e-posta olarak gönder
- [ ] **DoD** Test ödeme sonrası Paraşüt'te fatura otomatik oluşuyor, e-posta geliyor, `/hesap/faturalar`'dan indirilebiliyor.

---

## ✨ KÜME 7 — Ürün Çekirdeği (Küme 1 + Küme 2 sonrası)

- [x] **F-10a** `platformConfig` objesi: her pazaryeri için `{titleMaxLength, descMaxLength, bannedWords[], requiredFields[]}`
- [x] **F-10b** Platform dropdown değişince sağ panelde "Kurallar" kutusu render et
- [ ] **F-10c** Üretim sonrası "Trendyol kurallarına uygun ✓" rozeti (otomatik kontrol)
- [ ] **F-11a** LLM system prompt: "Marka adı yalnızca kullanıcı 'markalı ürün satıyorum' bayrağı açıksa geçer. Aksi halde jenerik ifade." *(~%40: ICERIK_KURALLARI var ama marka bayrağı mantığı eksik)*
- [ ] **F-11b** Form'a "Bu ürün markalı mı? (Yetkili satıcı mısın)" checkbox
- [ ] **F-11c** Platform yasaklı kelime listesini sistem prompt'a inject et (en iyi, %100, şifalı, vb.)
- [ ] **F-11d** Çıktıda "Marka/IP Uyarısı" component — tespit edilmiş marka varsa göster
- [ ] **F-23a** Form üstünde 3 "örnek kart": 🧴 Kozmetik · 👕 Giyim · 🔌 Elektronik → tıklayınca form dolsun
- [ ] **F-23b** İlk girişte (kullanıcının `total_generations = 0`) onboarding tooltip dizisi (react-joyride veya basit bir state machine)
- [ ] **F-23c** "Son üretimin" shortcut'ı (auth'lu kullanıcı için)
- [ ] **F-22a** `/hesap` dashboard'ında 4 metrik kartı: bu ay üretim, kalan kredi, favori platform, toplam tasarruf (~X saat)
- [ ] **F-22b** Kredi %20 altına inince üst banner: "+50 kredi %15 indirimle"
- [ ] **F-22c** Son 3 üretim shortcut'ı
- [ ] **F-12a** Çıktı bloğuna mikro-aksiyonlar: 🔁 Yeniden üret · ✂️ Kısalt · ➕ Genişlet · 🎭 Ton değiştir · 💾 Favori
- [x] **F-12b** `generations` tablosu (id, user_id, platform, prompt, output, created_at, is_favorite)
- [ ] **F-12c** Sol menüye "Geçmiş" sekmesi — tarih/platform/başlık filtresi
- [ ] **F-12d** Her kredide 3 ücretsiz "yeniden üret" hakkı (DB'de `regenerate_count`)
- [ ] **F-20a** `messages/tr.json` — tüm UI metinleri tek dosyada
- [ ] **F-20b** Marka sesi kısa kitapçık: ton (arkadaşça+uzman, "sen" dili), yasaklı kelimeler, her state için örnek metin
- [ ] **DoD** Platform seçince kurallar sağda görünüyor. Markalı ürün checkbox kapalıysa çıktıda "Stanley" gibi marka geçmiyor. `/hesap` dashboard kullanıcı başına metrikleri gösteriyor.

---

## 💬 KÜME 8 — Chatbot Geliştirme (Küme 1 sonrası)
Mevcut jenerik chatbot'u yzliste'ye özel hale getir + feedback/şikayet toplama sistemi kur.

- [x] **CB-01** Chatbot system prompt güncelle: yzliste nedir (7 pazaryeri AI listing üretici), fiyatlar (39₺/10kr, 99₺/30kr, 249₺/100kr), 1 kredi = 1 tam listing, 4 sekme (Metin/Görsel/Sosyal/Video), ChatGPT farkı (platform kurallarını bilir: Trendyol 65 karakter başlık, yasaklı kelimeler vb.), bilmediği soruda "destek@yzliste.com'a yaz" desin
- [ ] **CB-02** DB migration: `feedback` tablosu → `id, session_id, rating ('up'|'down'), comment (nullable), page_url, created_at, user_id (nullable)`. RLS: insert herkes, read sadece admin
- [ ] **CB-03** DB migration: `user_feedback` tablosu → `id, type ('bug'|'suggestion'|'complaint'|'other'), message, email (nullable), page_url, user_id (nullable), created_at, status ('new'|'read'|'resolved')`. RLS: insert herkes, read/update sadece admin
- [ ] **CB-04** Chatbot'a thumbs up/down component: konuşma 3+ mesajı geçince otomatik göster. Tıklayınca opsiyonel yorum alanı aç. `feedback` tablosuna kaydet
- [ ] **CB-05** Chatbot'a "öneri/şikayet" modu: kullanıcı "öneri", "şikayet", "bug" yazınca mod değişsin. Konu dropdown (bug/öneri/şikayet/diğer) + mesaj + e-posta (opsiyonel). `user_feedback` tablosuna kaydet. Sonunda "Teşekkürler, geri bildirimini aldık" mesajı
- [ ] **CB-06** `/hesap/admin/feedback` sayfası: shadcn/ui Table. Sütunlar: tarih, tür (renk badge), mesaj (truncate + expand), rating, durum. Filtre: tür + durum + tarih aralığı. Her satırda "Okundu" / "Çözüldü" butonu (status update)
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
- `[DECIDE]` olmayan her karar default'la git: **TanStack Query v5**, **PostHog EU Cloud**, **Upstash Redis**, **Cloudflare Turnstile**, **vanilla-cookieconsent**, **Paraşüt**, **Geist font (next/font)**.
- DB şema değişiklikleri için migration yaz — direkt SQL çalıştırma. Supabase'deysek `supabase migration new xxx`.
- Her küme bittiğinde `CHANGELOG.md`'ye 1 satır not.
- Audit raporundaki `[F-XX]` kodları bu dosyayla aynı. Detay için `yzliste-audit-raporu.docx` Bölüm B'ye bak.
