# PostHog Event Kataloğu — 2026-05-05

**Toplam: 12 custom event**

Tüm eventler client-side `posthog-js` ile gönderilir. Cookie consent olmadan hiçbir şey gönderilmez (opt-out default, consent sonrası opt-in).

---

## Auth Eventleri

| Event | Tetikleyen yer | Properties |
|---|---|---|
| `signup_started` | `AuthForm.tsx` — form submit, kayit modu | — |
| `signup_completed` | `AuthForm.tsx` — signUp başarılı | `method: 'email' \| 'google'` |
| `login_completed` | `AuthForm.tsx` — signInWithPassword başarılı | `method: 'email' \| 'google'` |
| `logout_completed` | `SiteHeader.tsx` — cikisYap() | — |

**Not:** Google OAuth redirect flow olduğu için `login_completed(google)` şu an tetiklenemiyor (callback route yok). BACKLOG: callback route'a eklenebilir.

---

## Generation Eventleri

| Event | Tetikleyen yer | Properties |
|---|---|---|
| `generation_started` | useMetinUretim, useGorselUretim, useVideoUretim, useSosyalUretim | `platform`, `type: metin\|gorsel\|video\|sosyal`, `prompt_version?` |
| `generation_completed` | useMetinUretim, useGorselUretim, useVideoUretim, useSosyalUretim | `platform`, `type`, `credits_remaining`, `prompt_version?` |
| `generation_failed` | useMetinUretim, useGorselUretim, useVideoUretim, useSosyalUretim | `platform`, `type`, `error: string` |
| `generation_feedback` | `GenerationFeedback.tsx` | `type`, `platform?`, `rating: up\|down`, `comment?` |
| `credit_exhausted` | generation hooks — 402 response | — |

**prompt_version değerleri:** `metin-v1.4`, `sosyal-v1.2`. Gorsel/video hook'larında prompt_version yok (AI text prompt değil).

**Platform değerleri:**
- Metin: `trendyol`, `hepsiburada`, `amazon`, `n11`, `ciceksepeti`, `etsy`, `amazon_usa`
- Gorsel: `gorsel`
- Video: `video`
- Sosyal: `instagram`, `tiktok`, `facebook`, `twitter`, `linkedin`, `sosyal_kit`

---

## Kredi Eventleri

| Event | Tetikleyen yer | Properties |
|---|---|---|
| `credit_purchase_started` | `/fiyatlar` ödeme başlat butonu | `package_id`, `price` |
| `credit_purchase_completed` | `/odeme/basarili` | `package_id`, `price`, `credits` |

---

## Engagement Eventleri

| Event | Tetikleyen yer | Properties |
|---|---|---|
| `share_clicked` | `BlogPaylas.tsx` — X, LinkedIn, copy-link | `content_type: 'blog_post'` |

---

## Sistem Metodları (Event Değil)

| Metod | Açıklama |
|---|---|
| `analytics.init()` | PostHog init + opt_out_capturing (default) |
| `analytics.acceptAnalytics()` | Cookie consent onay → opt_in_capturing |
| `analytics.rejectAnalytics()` | Cookie consent red → opt_out_capturing + reset |
| `analytics.identify(userId, props)` | Giriş sonrası kullanıcı tanımlama |
| `analytics.reset()` | Çıkış sonrası kimlik temizleme |
| `analytics.pageView(url)` | App Router sayfa geçişi |

---

## Consent Gating

`CookieConsent.tsx` (vanilla-cookieconsent v3):
- İlk ziyaret → `posthog.opt_out_capturing()` aktif (init'te ayarlandı)
- Consent onayı → `analytics.acceptAnalytics()` → `posthog.opt_in_capturing()`
- Consent reddi → `analytics.rejectAnalytics()` → `posthog.opt_out_capturing()` + `posthog.reset()`

---

## Önerilen PostHog Dashboard'lar (MON-06)

1. **Acquisition Funnel:** signup_started → signup_completed → generation_started → generation_completed
2. **Generation Funnel:** generation_started → generation_completed (platform bazlı breakdown)
3. **Revenue Funnel:** credit_purchase_started → credit_purchase_completed (paket bazlı)
