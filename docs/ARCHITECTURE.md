# yzliste.com — Mimari Doküman

**Son güncelleme:** 24 Nisan 2026

## Sistem Genel Görünüm

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│  Tarayıcı   │────▶│  Vercel Edge │────▶│  Next.js 16     │
│  (React 19) │◀────│  (middleware) │◀────│  App Router     │
└─────────────┘     └──────────────┘     └────────┬────────┘
                                                   │
                    ┌──────────────────────────────┤
                    │              │                │
              ┌─────▼─────┐ ┌─────▼─────┐  ┌──────▼──────┐
              │ Supabase   │ │ fal.ai    │  │ Anthropic   │
              │ (Auth+DB)  │ │ (Görsel/  │  │ (Claude —   │
              │            │ │  Video)   │  │  metin/chat)│
              └────────────┘ └───────────┘  └─────────────┘
                    │
              ┌─────▼─────┐ ┌───────────┐  ┌─────────────┐
              │ iyzico     │ │ PostHog   │  │ Cloudflare  │
              │ (Ödeme)    │ │ (Analitik)│  │ Turnstile   │
              └────────────┘ └───────────┘  └─────────────┘
```

**Teknoloji seçimleri:**
- **Frontend:** Next.js 16 (App Router), React 19, Tailwind CSS v4, Geist font
- **State:** TanStack Query v5 (server state), Zustand (UI state)
- **Auth:** Supabase Auth (email + password, @supabase/ssr)
- **DB:** Supabase PostgreSQL (RLS aktif)
- **AI - Metin/Chat:** Anthropic Claude API (merkezi config: lib/ai-config.ts)
- **AI - Görsel:** fal.ai (Bria Product-Shot, RMBG background removal)
- **AI - Video:** fal.ai (Kling v2.1 Standard image-to-video)
- **AI - Try-on:** fal.ai (FASHN v1.6 virtual try-on) — yzstudio'da
- **Ödeme:** iyzico (tek seferlik kredi paketleri)
- **Fatura:** Paraşüt (e-Arşiv faturalama)
- **Analytics:** PostHog EU Cloud
- **Rate limit:** Upstash Redis
- **Bot koruması:** Cloudflare Turnstile
- **Cookie consent:** vanilla-cookieconsent v3 (KVKK)
- **Deploy:** Vercel (auto-deploy from main)

---

## Route Haritası

### Public Sayfalar (auth gerektirmez)

| Route | Tip | Açıklama |
|-------|-----|----------|
| `/` | SSR | Landing page — hero, özellikler, CTA |
| `/giris` | SSR | Giriş sayfası (tam sayfa) |
| `/kayit` | SSR | Kayıt sayfası (tam sayfa) |
| `/sifre-sifirla` | SSR | Şifre sıfırlama |
| `/fiyatlar` | SSR | Kredi paketleri ve fiyatlar |
| `/sss` | SSR | Sıkça sorulan sorular |
| `/blog` | SSR | Blog listesi |
| `/blog/[slug]` | SSR | Blog yazısı detay |
| `/hakkimizda` | SSR | Hakkımızda |
| `/gizlilik` | SSR | Gizlilik politikası |
| `/kosullar` | SSR | Kullanım koşulları |
| `/kvkk-aydinlatma` | SSR | KVKK aydınlatma metni |
| `/mesafeli-satis` | SSR | Mesafeli satış sözleşmesi |
| `/cerez-politikasi` | SSR | Çerez politikası |
| `/teslimat-iade` | SSR | Teslimat ve iade |
| `/odeme/basarili` | SSR | Ödeme başarılı |
| `/odeme/hata` | SSR | Ödeme hatası |
| `/@modal/(.)giris` | Client | Login modal (intercepting route) |
| `/@modal/(.)kayit` | Client | Register modal (intercepting route) |
| `/@modal/(.)kredi-yukle` | Client | Kredi yükleme modal |

### Auth Gerektiren Sayfalar

| Route | Tip | Açıklama |
|-------|-----|----------|
| `/uret` | Client | Ana araç — metin/görsel/video/sosyal üretimi (tab'lı) |
| `/toplu` | Client | Toplu ürün üretimi (CSV import) |
| `/hesap` | Client | Hesap dashboard — 6 kart (profil, marka, üretimler, krediler, faturalar, ayarlar) |
| `/hesap/profil` | Client | Kişisel + fatura bilgileri |
| `/hesap/marka` | Client | Marka profili (ad, ton, hedef kitle) |
| `/hesap/uretimler` | Client | Üretim geçmişi (sayfalı, expand/kopyala) |
| `/hesap/krediler` | Client | Kredi bakiyesi + geçmiş |
| `/hesap/faturalar` | Client | e-Arşiv faturaları |
| `/hesap/ayarlar` | Client | E-posta ve şifre değiştir |
| `/hesap/admin/feedback` | Client | Admin: feedback listesi + durum yönetimi |
| `/kredi-yukle` | Client | Kredi satın alma (tam sayfa) |
| `/yzstudio` | Client | Premium araçlar — mankene giydirme (henüz navigasyonda link yok) |

### Intercepting Route Mantığı
Modal'lar (`@modal` parallel route slot) soft navigation'da açılır. Direkt URL ile gelince tam sayfa versiyonu render olur. Geri tuşu modal'ı kapatır, siteyi kapatmaz.

---

## API Endpoint Haritası

### İçerik Üretimi

| Endpoint | Method | Kredi | Açıklama |
|----------|--------|-------|----------|
| `/api/uret` | POST | 1 | Metin listing üretimi (Anthropic Claude) |
| `/api/uret/duzenle` | POST | 1 | Mevcut listing düzenleme |
| `/api/gorsel` | POST | 1/stil | Ürün görseli üretimi (fal.ai Bria Product-Shot) |
| `/api/gorsel/img` | GET | — | Görsel üretim progress stream |
| `/api/gorsel/poll` | GET | — | Görsel üretim status polling |
| `/api/gorsel/download` | GET | — | Görsel indirme |
| `/api/sosyal` | POST | 1 | Sosyal medya caption üretimi |
| `/api/sosyal/video` | POST | 10/20 | Video üretimi (Kling v2.1, 5sn=10kr, 10sn=20kr) |
| `/api/sosyal/video/poll` | GET | — | Video üretim status polling |
| `/api/sosyal/video/download` | GET | — | Video indirme |
| `/api/sosyal/kit` | POST | 2 | Sosyal kit (caption + görsel bundle) |
| `/api/toplu` | POST | N | Toplu üretim (CSV'deki ürün sayısı kadar kredi) |
| `/api/barkod` | POST | — | Barkod/EAN tarama → ürün bilgisi |

### Ödeme ve Hesap

| Endpoint | Method | Açıklama |
|----------|--------|----------|
| `/api/odeme` | POST | iyzico ödeme başlat (checkout URL döner) |
| `/api/odeme/callback` | POST | iyzico webhook callback |
| `/api/fatura` | POST | Paraşüt e-Arşiv fatura oluştur |
| `/api/hesap/export` | POST | Kullanıcı verisi dışa aktar (KVKK hakkı) |
| `/api/hesap-sil` | POST | Hesap silme (soft delete + audit log) |
| `/api/consent` | POST | Cookie consent kayıt |
| `/api/turnstile` | POST | Cloudflare Turnstile doğrulama |

### Destek ve Admin

| Endpoint | Method | Açıklama |
|----------|--------|----------|
| `/api/chat` | POST | Chatbot (Anthropic Claude, yzliste system prompt) |
| `/api/chat/feedback` | POST | Chat değerlendirmesi (thumbs up/down) |
| `/api/chat/user-feedback` | POST | Kullanıcı geri bildirimi (bug/öneri/şikayet) |
| `/api/admin/feedback` | GET | Admin: tüm feedback listesi |
| `/api/admin/metrics` | GET | Admin: kullanım ve gelir metrikleri |
| `/api/og` | GET | Dinamik OG image üretimi |

### Rate Limiting
Upstash Redis ile — `/api/uret`: 60 istek/dakika, 500 istek/gün (kullanıcı bazlı).

### Kredi Sistemi
- Atomik düşüm: `lib/credits.ts` → `krediDus(userId, amount)` — Supabase `.gte("kredi", miktar)` ile race-condition safe
- Hata durumunda geri iade: `krediIade(userId, amount)`
- Üretim öncesi kontrol + düşüm, LLM/API çağrısı sonra

---

## Middleware (middleware.ts)

Tüm istekler middleware'den geçer:
1. **CSP headers** — nonce tabanlı Content Security Policy (iyzico, PostHog, GA, Cloudflare, Anthropic izinli)
2. **Bot koruması** — Crawler'lar korumalı path'lerde 404 alır
3. **Auth redirect** — `/uret`, `/hesap`, `/kredi-yukle`, `/admin` → giriş yapmamışsa `/giris?redirect=path`
4. **Session refresh** — Supabase SSR cookie middleware ile oturum yenileme
5. **Login gate** — Giriş yapmış kullanıcılar `/giris`, `/kayit`'e gelirse `/uret`'e yönlendirilir

---

## Dosya Yapısı Kılavuzu

```
yzliste/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Auth gerektiren route grubu
│   │   ├── hesap/          # Hesap sayfaları
│   │   ├── kredi-yukle/    # Kredi yükleme
│   │   └── uret/           # Ana üretim aracı
│   ├── @modal/             # Intercepting route modal'ları
│   ├── api/                # API route handler'ları
│   ├── blog/               # Blog sayfaları
│   ├── yzstudio/           # Premium araçlar (FASHN try-on)
│   ├── layout.tsx          # Root layout (providers, header, footer)
│   ├── page.tsx            # Landing page (/)
│   ├── not-found.tsx       # 404 sayfası
│   └── globals.css         # Global stiller
├── components/             # React component'ları
│   ├── auth/               # Auth formları
│   ├── consent/            # Cookie consent
│   ├── providers/          # Context provider'lar (Query, PostHog)
│   ├── tabs/               # /uret tab'ları (Metin, Görsel, Video, Sosyal)
│   ├── tanitim/            # Landing page bölümleri
│   ├── ui/                 # Paylaşılan UI component'lar
│   ├── ChatWidget.tsx      # Destek chatbot'u
│   ├── SiteHeader.tsx      # Navigasyon
│   └── SiteFooter.tsx      # Footer
├── lib/                    # İş mantığı ve yardımcı fonksiyonlar
│   ├── hooks/              # React hook'ları (useCredits, useCurrentUser, vb.)
│   ├── prompts/            # Sistem prompt şablonları (metin-v1.2, sosyal-v1.1)
│   ├── fal/                # fal.ai helper'ları (RMBG)
│   ├── constants/          # Sabitler (ton haritaları vb.)
│   ├── supabase.ts         # Client-side Supabase
│   ├── supabase-server.ts  # Server-side Supabase
│   ├── credits.ts          # Kredi düşüm/iade mantığı
│   ├── analytics.ts        # PostHog event tracking
│   ├── paketler.ts         # Kredi paket tanımları
│   ├── listing-utils.ts    # Platform-specific kurallar
│   └── blog-parser.ts      # Markdown → HTML
├── store/                  # Zustand store
│   └── uretimStore.ts      # Üretim context state
├── supabase/               # Supabase config + migrations
│   └── migrations/         # DB migration dosyaları (11 adet)
├── public/                 # Statik dosyalar (görseller, videolar)
├── docs/                   # Proje dokümantasyonu
├── health-reports/         # Test raporları (Tur 1-8)
├── specs/                  # Detaylı özellik spec'leri
├── middleware.ts            # Auth + CSP + bot koruması
├── BACKLOG.md              # İş takip listesi
├── BACKLOG-DONE.md         # Tamamlanan işler arşivi
├── CHANGELOG.md            # Değişiklik günlüğü
├── CLAUDE.md               # AI agent kuralları
├── PROMPT-REHBER.md        # Prompt mühendisliği rehberi (70KB)
└── TEST-PLAYBOOK.md        # Manuel test rehberi
```

---

## Veri Akışı: Listing Üretimi

```
Kullanıcı /uret'te form doldurur
         │
         ▼
MetinSekmesi.tsx → POST /api/uret
         │
         ▼
route.ts: krediDus(userId, 1) — atomik
         │
         ▼
sistemPromptOlustur() → lib/prompts/metin.ts (tek kaynak):
  1. Platform kuralları (baslik limiti, etiket sayısı, emoji vs.)
  2. ICERIK_KURALLARI (genel kalite + hallucination önleme)
  3. KATEGORI_KURALLARI (kozmetik/elektronik/giyim/gıda/ev/spor/çocuk/takı — 8 kategori)
  4. FIYAT_SEGMENT_YONLENDIRME (bütçe/orta/premium)
  5. YASAKLI_KELIMELER (platform bazlı — 6 liste)
  6. TON_TANIMLARI (7 ton: samimi/profesyonel/premium/eglenceli/ciddi/lüks/minimal)
  7. Marka bağlamı (DB'den: marka_adi, hedef_kitle, vurgulanan_ozellikler vb.)
         │
         ▼
Anthropic Claude API (streaming)
         │
         ▼
Sonuç → kullanıcıya stream edilir
         │
         ▼
uretimler tablosuna kayıt (platform, prompt_version, token count, api_cost)
```

## Veri Akışı: Görsel Üretimi

```
Kullanıcı fotoğraf yükler + stil seçer
         │
         ▼
GorselSekmesi.tsx → POST /api/gorsel
         │
         ▼
route.ts: krediDus(userId, secilenStiller.length)
         │
         ▼
fal.ai RMBG (background removal) → temiz ürün görseli
         │
         ▼
fal.ai Bria Product-Shot (manual_placement, num_results:1)
         │
         ▼
Sonuç URL → kullanıcıya gösterilir
```

## Veri Akışı: Video Üretimi

```
Kullanıcı fotoğraf yükler + hareket seçer + süre seçer
         │
         ▼
VideoSekmesi.tsx → POST /api/sosyal/video
         │
         ▼
route.ts: krediDus(userId, süre === "10" ? 20 : 10)
         │
         ▼
fal.ai RMBG → temiz ürün görseli
         │
         ▼
fal.ai Kling v2.1 Standard (image-to-video)
  - 5sn = $0.28 maliyet
  - 10sn = $0.56 maliyet
         │
         ▼
Poll ile durum takibi → tamamlanınca indirme URL
```
