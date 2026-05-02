# yzliste Backlog

Aşama: pre-traffic. Demo hazırlığı — içerik kalitesi 1 numara öncelik.

**Kurallar:**
- Her oturumun başında bu dosyayı oku, nerede kaldığımızı anla.
- Detaylı spec gerekiyorsa `archive/specs-completed/{ID}.md` dosyasını oku (29 Nis 2026 itibariyle specs/ klasörü arşive taşındı, sadece aktif spec'ler specs/'te kalır).
- Bir iş bittiğinde `- [ ]` → `- [x]` olarak güncelle. Yarım iş `[x]` olmaz.
- Tamamlanmış maddelerin detayı `BACKLOG-DONE.md` dosyasında.

---

## Açık işler — Öncelik sırasına göre

### P0 — Acil / Kritik

> 🚨 **30 Nis 2026 acil hotfix paketi (Cowork `icerik-kalite-testi` task'ından):** 3 P0 production bug tespit edildi. **Demo öncesi mutlaka düzeltilmeli.**

| ID | Başlık | Durum | Detay |
|---|---|---|---|
| **HOTFIX-01** | ~~🚨 `/api/uret` 404 "Kullanici bulunamadi" — text üretimi 7 pazaryerinde tamamen çökmüş~~ | ✅ Tamamlandı (2026-05-02) | `app/api/uret/route.ts` user lookup query farklı (`users` vs `profiles` veya RLS bug). `/api/sosyal` çalışıyor, sadece `/api/uret` etkilenmiş. Diff at `/api/uret` ile `/api/sosyal` arasında, çalışan pattern'i kopyala. UI'da error feedback YOK — kullanıcı sessiz fail görüyor (P0 da düzelt: toast/alert ekle). |
| **HOTFIX-02** | ~~🚨 `/api/sosyal` kredi düşürmüyor — revenue sızıntısı~~ | ✅ Tamamlandı (2026-05-02) | 4 başarılı sosyal üretim (3kr × 4 = 12kr düşmesi gerekirdi) **0 kredi düştü**. RPC `kredi_kullan` veya RLS policy bug. Production log'da çağrı çıktısına bak. Gerçek kullanıcılar bedava içerik üretiyor. |
| **HOTFIX-03** | ~~🚨 **`/hesap/*` TÜMü kalıcı "Yükleniyor..." kilidinde + header anonim'e düşüyor**~~ | ✅ Tamamlandı (2026-05-02) | **Tek kök neden, multi-impact:** Login → `/uret` (header doğru) → `/hesap/profil` (sonsuz Yükleniyor...) → `/uret` döndüğünde header **anonim** (kredi badge + Çıkış kayıp). Hiçbir Supabase REST/auth çağrısı tetiklenmiyor (DevTools Network boş, Console hata yok). Auth cookie korunuyor, server `/hesap` 200 dönüyor — sadece **client-side hydration mismatch**. `useUser()` hook sonsuz loading state'inde takılı veya AuthProvider context client'ta sıfırlanıyor. **Etki:** profil/krediler/ayarlar/faturalar TAMAMEN kullanılamaz + Çıkış butonu kayboluyor (güvenlik açığı, paylaşılan cihazda) + dashboard "TOPLAM 20" ama `/hesap/uretimler` boş. **%100 reproducible.** |
| **HOTFIX-04** | ~~🚨 `/fiyatlar` login'li kullanıcıda anonim CTA gösteriyor~~ | ✅ Tamamlandı (2026-05-02) | HOTFIX-03'ün türevi (aynı hydration mismatch). "Satın Al ₺49/₺129/₺299" → `/kayit` (yanlış, login'li için `/kredi-yukle` veya modal olmalı). HOTFIX-03 fix'i otomatik çözmesi muhtemel. T6R-NEW-3. |
| AUTH-01 | Mobilde kayıt engeli — Turnstile devre dışı | Kod OK, mobil test kaldı | inline |
| FY-01 | Fiyat artışı — 49/129/299 TL | Kod OK, test kaldı | inline |
| OPS-07 | Sentry error monitoring | Kısmen OK, DSN sonrası 3 madde | inline |
| CI-01 | CI lint hataları düzelt — 12 error (setState in effect + prototype dosyaları) | Tamamlandı (0 error) | inline |
| AI-01 | Chatbot SYSTEM_PROMPT güncelle — fiyat/platform/stil/yzstudio yanlış | Tamamlandı | [archive/specs-completed/ai-denetim-01.md](archive/specs-completed/ai-denetim-01.md) §P0-1 |
| AI-02 | Merkezi AI config — model + temperature + cost haritası (`lib/ai-config.ts`) | Tamamlandı | [archive/specs-completed/ai-denetim-01.md](archive/specs-completed/ai-denetim-01.md) §P0-2, P0-3 |

### P0.5 — Cowork test bulguları (30 Nis 2026, P1 öncelikli)

> **Kaynak:** Cowork `icerik-kalite-testi` task raporu. Sosyal medya üretim kalitesi 4.19/5 ortalama (4 ürün test). Halüsinasyon yok ama dilsel slip'ler ve eski tarih hashtag'leri var.

| ID | Başlık | Durum | Detay |
|---|---|---|---|
| AI-PROMPT-01 | AI sistem prompt'una **bugünün tarihi context** geç (Sonbahar2024 hashtag → 2026 sorunu) | Bekliyor | `lib/prompts/sosyal.ts` ve `lib/prompts/metin.ts` system prompt'una `Şu anki tarih: {YYYY-MM-DD}` veya benzer dinamik tarih ekle. LLM güncel takvim kullansın. |
| AI-PROMPT-02 | Türkçe yazım kontrolü post-process | Bekliyor | "stilish" → "şık", "hoşça deyin" → "hoşça kalın", "kütüphane" (giyim için) → "gardırop" gibi yaygın slip'ler için sözlük kontrolü veya prompt'a "yaygın yanlış kullanımlar" listesi |
| AI-PROMPT-03 | Hashtag uydurma engelleme | Bekliyor | "#KaliteBilir", "#BeşModası", "#TürkiyedeTeknoloji" gibi anlamsız uydurma hashtag'ler. Prompt'a "sadece gerçek kullanılan hashtag'ler kullan" + post-process whitelist |
| AI-PROMPT-04 | CTA güçlendirme | Bekliyor (P2) | "Senin olması bekleyen şey" gibi muğlak satış cümleleri yerine net CTA ("Hemen sepete ekle", "Sipariş ver") |
| TEST-01 | Smoke test'e `/api/uret` ekle — healthcheck endpoint tek tek tüm üretim API'larını çağırsın | Bekliyor | Production'da sessiz fail (HOTFIX-01 gibi) için CI'da otomatik test. Bu olmasaydı bug'ı yakalayamayacaktık. |
| **T6R-04** | Chatbot widget production'da yok | Bekliyor (P1) | Önceki tur stub vardı, mevcut build'de fixed-position chat widget yok. Karar: kasıtlı kaldırma mı yoksa kayıp component mi? |
| **T6R-05** | `/sifre-sifirla` `<title>` etiketi anasayfa title'ını gösteriyor | Bekliyor (P1) | Sayfa metadata `Şifreni sıfırla \| yzliste` olmalı. H1 doğru ("Şifreni sıfırla") ama `<title>` `yzliste — Ürünün için metin, görsel...` (root). |
| **T6R-06** | `/profil` (anonim) hâlâ 200 dönüyor + canonical = root | Bekliyor (P1) | Anonim ziyaretçi için içeriksiz 200 + root canonical → SEO duplicate content riski. Karar: 404 mü, 301 → `/` mi, gerçek landing mi? Login'liyken `/hesap/profil`'e redirect zaten OK. |
| **T6R-07** | Title'larda Title Case ihlali (P2) | Bekliyor | "Giriş Yap" → "Giriş yap", "E-ticaret Listing Üretici" → "e-ticaret listing üretici". CLAUDE.md sentence case kuralı title meta'da ihlal. |
| **T6R-08** | `/hesap/krediler` `<title>` "\| yzliste" suffix eksik (P2) | Bekliyor | Sadece "Krediler". Diğer sayfalarda "X \| yzliste" pattern var, brand tutarsızlığı. |

### P1 — Yakın vadeli

| ID | Başlık | Durum | Spec |
|---|---|---|---|
| NF-02 | yzstudio — premium araçlar sayfası | Faz 1-4 OK (kod), Faz 5 test + stok fotoğraf kaldı | [archive/specs-completed/nf-02-yzstudio.md](archive/specs-completed/nf-02-yzstudio.md) |
| DR-03 | /hakkimizda kurucu bölümü — kısa, profesyonel, şirket adı yok | Tamamlandı | [archive/specs-completed/dr-03-hakkimizda-yeniden-yaz.md](archive/specs-completed/dr-03-hakkimizda-yeniden-yaz.md) |
| DA-05 | /uret modern UX — monochrome çözümü | Tamamlandı | [archive/specs-completed/da-05-uret-modern-ux.md](archive/specs-completed/da-05-uret-modern-ux.md) |
| AI-04 | /duzenle marka bağlamı + kategori kuralları eksik | Tamamlandı (AI-14 ile) | [archive/specs-completed/ai-denetim-01.md](archive/specs-completed/ai-denetim-01.md) §P1-1 |
| AI-05 | Platform karakter limiti tutarsızlığı — Hepsiburada 100→150, tek kaynak | Tamamlandı | [archive/specs-completed/ai-denetim-01.md](archive/specs-completed/ai-denetim-01.md) §P1-2 |
| AI-06 | TON_TANIMLARI 3→7 ton genişlet, tek dosyaya taşı | Tamamlandı | [archive/specs-completed/ai-denetim-01.md](archive/specs-completed/ai-denetim-01.md) §P1-3 |
| AI-07 | max_tokens platforma göre + stop_reason:max_tokens yakala | Tamamlandı (AI-16 ile) | [archive/specs-completed/ai-denetim-01.md](archive/specs-completed/ai-denetim-01.md) §P1-4 |
| AI-08 | Çıktı doğrulama — karakter limiti aşımı + yasaklı kelime regex check | Tamamlandı | [archive/specs-completed/ai-denetim-01.md](archive/specs-completed/ai-denetim-01.md) §P1-5 |
| AI-13 | Blog paket/kredi/platform yanlışlarını düzelt — Pro/Enterprise yok, süresiz kredi, 6 platform | Tamamlandı | [archive/specs-completed/ai-denetim-02.md](archive/specs-completed/ai-denetim-02.md) §P1-1 |
| AI-14 | /uret/duzenle KATEGORI_KURALLARI + YASAKLI_KELIMELER ekle (AI-04 tamamlama) | Tamamlandı | [archive/specs-completed/ai-denetim-02.md](archive/specs-completed/ai-denetim-02.md) §P1-2 |
| AI-15 | /api/chat rate limit ekle — Upstash per-user 30 req/dk | Tamamlandı | [archive/specs-completed/ai-denetim-02.md](archive/specs-completed/ai-denetim-02.md) §P1-3 |
| UI-01 | Araçlar dropdown menüsünde ikonlar güncel değil — LP-11'deki Lucide ikonlarıyla eşitle | Tamamlandı | inline |
| UI-02 | /fiyatlar "Kredi nasıl çalışır?" bölümünü daha görünür yap | Tamamlandı | inline |
| OPS-20 | KVKK + yasal uyumluluk tamamlama | Aziz — hukuki | [archive/specs-completed/kume-11.md](archive/specs-completed/kume-11.md) |

### P2 — Orta vadeli

| ID | Başlık | Durum | Spec |
|---|---|---|---|
| AI-09 | Sosyal üretim DB kaydına prompt_version ekle | Tamamlandı | [archive/specs-completed/ai-denetim-01.md](archive/specs-completed/ai-denetim-01.md) §P2-1 |
| AI-10 | /toplu route sistemPromptOlustur paylaşsın (kategori+yasaklı+marka) | Tamamlandı | [archive/specs-completed/ai-denetim-01.md](archive/specs-completed/ai-denetim-01.md) §P2-2 |
| AI-11 | "Bilinen ürün özellikleri" kuralı kaldır — sadece kullanıcı verisini kullan | Tamamlandı | [archive/specs-completed/ai-denetim-01.md](archive/specs-completed/ai-denetim-01.md) §P2-3 |
| AI-12 | /studio/manken promptuna profil ton + hedef_kitle ekle | Tamamlandı | [archive/specs-completed/ai-denetim-01.md](archive/specs-completed/ai-denetim-01.md) §P2-4 |
| AI-16 | stop_reason:max_tokens yakala — 6 route'ta log + uyarı + truncated flag | Tamamlandı | [archive/specs-completed/ai-denetim-02.md](archive/specs-completed/ai-denetim-02.md) §P2-1 |
| AI-17 | ciktiDogrula helper'ı çıkar — /duzenle, /sosyal, /kit, /toplu'dan çağır | Tamamlandı | [archive/specs-completed/ai-denetim-02.md](archive/specs-completed/ai-denetim-02.md) §P2-2 |
| AI-18 | 3 küçük fix: kit DB log + toplu kategori param + chat fotoğraflı kit 4kr | Tamamlandı | [archive/specs-completed/ai-denetim-02.md](archive/specs-completed/ai-denetim-02.md) §P2-5 |
| AI-19 | GORSEL_STILLER emoji kaldır + PLATFORM_BILGI Tailwind default → proje paleti hex | Tamamlandı | [archive/specs-completed/ai-denetim-02.md](archive/specs-completed/ai-denetim-02.md) §P2-6 |
| OPS-14~19 | KÜME 11 — operasyonel olgunluk faz 2 | OPS-14/15/16/17/18/19 OK | [archive/specs-completed/kume-11.md](archive/specs-completed/kume-11.md) |

### P1.5 — Monitoring & Analytics setup (29 Nis 2026 — Aziz talebi)

> Pre-traffic dönemde hata izleme + analytics altyapısı kurulması. Trafik gelmeye başlamadan önce bitirilmesi kritik. Sıralı, her madde bir öncekine bağımlı değil ama önerilen sıra var.

| ID | Başlık | Durum | Süre | Kim |
|---|---|---|---|---|
| MON-01 | **Sentry hesap + DSN aktive** — sentry.io free plan, project oluştur, DSN al, `.env`'e koy (`NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_AUTH_TOKEN` source maps için), Vercel env'lere de ekle | Bekliyor | 30 dk | Aziz manuel |
| MON-02 | **Sentry alert + Source maps** — Code: `npm run build` source maps upload aktif, alert kuralı (her yeni issue → Aziz e-posta), Sentry DSN env'den okuma kontrolü, sentry.client/server/edge config doğru | Bekliyor | 30 dk | Code |
| MON-03 | **PostHog projeyi kur** — eu.posthog.com hesap, project oluştur, API key (`NEXT_PUBLIC_POSTHOG_KEY`), `.env` + Vercel env, KVKK için EU region | Bekliyor | 20 dk | Aziz manuel |
| MON-04 | **PostHog 12 event implement et** — `lib/analytics.ts` üzerinden capture: cta_clicked, signup_started/completed/dropped, email_verified, login_completed, uretim_started/completed/failed, paket_viewed, paket_purchased, $pageview otomatik. Property'ler: contentType, platform, source, error_type, paket_name, price_tl. User identify: email, signup_date, is_paying, total_generations, last_credit_balance | Bekliyor | 2-3 saat | Code |
| MON-05 | **Cookie consent gating** — vanilla-cookieconsent v3 zaten kurulmalı, reddedilirse PostHog event göndermesin (`analytics.consent === 'rejected'` guard) | Bekliyor | 30 dk | Code |
| MON-06 | **PostHog 3 funnel dashboard'a kur** — Funnel 1: Aktivasyon ($pageview → cta_clicked → signup_completed → uretim_completed). Funnel 2: Gelir (uretim_completed → paket_viewed → paket_purchased). Funnel 3: Anonim → kayıtlı dropoff | Bekliyor | 30 dk | Aziz manuel (PostHog UI) |
| MON-07 | **Daily Monitoring Agent** — Cowork scheduled task, her sabah 08:00 (TR saati) çalışır. Sentry + PostHog + Vercel + Supabase API'lerinden dünün verilerini çeker, Markdown rapor olarak `yzliste test/daily-reports/{YYYY-MM-DD}.md` dosyasına yazar | Bekliyor | 1-2 saat | Cowork (kurulum) |

#### MON-07 — Daily Monitoring Agent detayı

**Çalışma zamanı:** Her gün 08:00 (Europe/Istanbul, GMT+3)

**Kapsam (her sabah çekilecek metrikler):**

| Kaynak | Metrik | API/MCP |
|---|---|---|
| Sentry | Dün açılan yeni issue sayısı, en sık hata 5 tanesi, kaç kullanıcı etkilendi | Sentry REST API + token |
| Sentry | Resolved issue sayısı (dün düzeltildi) | Sentry REST API |
| PostHog | DAU (dün aktif kullanıcı), yeni signup sayısı, üretim sayısı (toplam + tipe göre) | PostHog Query API |
| PostHog | Funnel 1 dropoff: signup → ilk üretim oranı | PostHog Query API |
| PostHog | Top 3 popüler sayfa (dünün $pageview) | PostHog Query API |
| Vercel | Son 24 saat deploy sayısı, başarısız deploy var mı, build süresi ortalama | Vercel MCP (mevcut) |
| Supabase | Dün toplam kullanıcı (yeni + toplam), kredi yükleme sayısı + TL toplam, payment_failed sayısı | Supabase MCP (mevcut) |
| Hesaplama | Dün vs önceki gün kıyas (% değişim) | Cowork hesaplar |
| Hesaplama | Bu hafta vs geçen hafta trend | Cowork hesaplar |

**Çıktı formatı (`yzliste test/daily-reports/2026-04-30.md`):**

```markdown
# Günlük Monitoring — 30 Nis 2026 (Salı)

## Özet (3 satır)
- 🟢 / 🟡 / 🔴 sağlık durumu
- En önemli olay (yeni feature deployed / kritik hata / büyük çıkış)
- Bugün dikkat: <Aziz için 1-2 madde>

## Kullanıcı
- DAU: 142 (dün 138, +%2.9)
- Yeni signup: 8 (dün 5, +%60)
- E-posta doğrulama oranı: %62 (8/13)

## Üretim
- Toplam: 89 üretim (dün 72)
  - Metin: 45 | Görsel: 28 | Video: 12 | Sosyal: 4
- Başarı oranı: %94 (5 hata)

## Funnel
- Aktivasyon (sayfa → kayıt → üretim): %3.2 (dün %2.8)
- Gelir (üretim → ödeme): %1.1 (dün %0.9)

## Hatalar (Sentry)
🔴 Yeni issue (dün 0 → bugün 2):
  1. TypeError: Cannot read 'kredi' of null at /uret (3 kullanıcı etkilendi)
  2. NetworkError: fal.ai timeout (1 kullanıcı)
🟢 Düzeltilen: 1 (P3 video poll race condition)

## Gelir
- Kredi yükleme: 2 satış (149 TL)
- Toplam bugün: 149 TL
- Bu hafta: 487 TL (geçen hafta 312 TL, +%56)

## Deploy
- Son 24 saat: 3 başarılı deploy (Polish-9 hotfix)
- Build süresi ort: 2dk 14sn

## Bugün için Cowork önerisi
- 🔴 İlgilen: Sentry'deki "Cannot read 'kredi' of null" — 3 kullanıcıyı etkiledi, hızlı fix gerekli
- 🟡 Bak: Aktivasyon %3.2 — Polish-9 sonrası beklenen artış henüz olmadı, bir gün daha bekle

## Sources
- Sentry: https://sentry.io/organizations/.../issues/
- PostHog: https://eu.posthog.com/project/.../insights/
- Vercel: https://vercel.com/azizkoses-projects/yzliste/deployments
```

**MON-07 kurulum adımları (Cowork yapacak):**
1. **Bağımlılıklar:** Sentry API token, PostHog API key (MON-01 + MON-03 sonrası hazır olur)
2. **Scheduled task tanımla:** `cron: "0 5 * * *"` (UTC 05:00 = TR 08:00), `timezone: Europe/Istanbul`
3. **Task body:** Tek bir Cowork prompt — "Daily monitoring rapor üret" — agent şunları çağırır:
   - Sentry API: `GET /api/0/projects/{org}/{project}/issues/?statsPeriod=24h`
   - PostHog API: `POST /api/projects/{id}/query/` HogQL ile
   - Vercel MCP: `list_deployments` (son 24 saat)
   - Supabase MCP: `execute_sql` ile dün kayıt + ödeme query'leri
4. **Çıktıyı yaz:** `Write` tool ile `yzliste test/daily-reports/{date}.md`
5. **Aziz nereden okur:** OneDrive'da `yzliste test\daily-reports\` klasörü, ya da Cowork sabah açtığında "bugünkü rapor hazır mı" diye sor

**Kurulum sırası:**
- MON-01 + MON-03 → DSN/API key'ler hazır
- MON-02 + MON-04 → Sentry/PostHog'da gerçek veri akmaya başlar (~3-5 gün veri biriktirir)
- MON-07 → ondan sonra kurulur, anlamlı rapor için en az 1 hafta veri lazım

---

### P1.6 — Cowork Scheduled Tasks (öneriler — Aziz'in kendi listesi ile birleştirilecek, acil değil)

> **Durum (30 Nis 2026):** İlk Cowork scheduled task kuruldu (pazaryeri-kural-takip). Aziz'in kendi yaptığı/planladığı task'lar var, çakışanlar birleştirilecek. Bu liste Cowork önerisi, karar Aziz'de.

| ID | Task | Frequency | Ne işe yarar | Durum |
|---|---|---|---|---|
| ST-01 | **pazaryeri-kural-takip** | Aylık (1'i 09:00 TR) | 7 pazaryeri (Trendyol/Hepsi/Amazon TR/N11/Etsy/Amazon USA/Çiçeksepeti) listing kurallarını web search ile doğrula, değişiklik raporla. Çıktı: `yzliste test/pazaryeri-kural-takip/{YYYY-MM}-rapor.md` | ✅ Kuruldu (30 Nis) — Cowork sidebar `pazaryeri-kural-takip` |
| ST-02 | **fal.ai pricing takip** | Aylık | fal.ai modellerinin (FASHN tryon, Kling video, Imagen, Flux, vb.) fiyatları değişince yzliste'nin kredi modelini ayarlamak için bilgilendirme. Memory'deki `project_falai_pricing.md` referans güncel kalsın | Öneri |
| ST-03 | **MON-07 Daily Monitoring Agent** | Günlük 08:00 TR | Sentry + PostHog + Vercel + Supabase'den dünün verilerini derler, Markdown rapor `yzliste test/daily-reports/{date}.md`. Bağımlılık: MON-01~05 (Sentry+PostHog kurulum) | Bekliyor (BACKLOG.md P1.5 MON-07) |
| ST-04 | **Blog URL canlılık kontrolü** | Haftalık | 100+ blog post içindeki dış link'ler canlı mı (broken link audit). Çıktı: kırık link listesi + öneri | Öneri |
| ST-05 | **Vercel build health** | Haftalık | Son 7 günün build başarı oranı, ortalama süre, fail var mı. Vercel MCP ile çekilir. CI/CD durumu da dahil. | Öneri |
| ST-06 | **SEO keyword research** | Çeyrek dönem | "AI listing", "AI ürün açıklaması", "yapay zeka e-ticaret" keyword trends'i (search volume, rank). Blog stratejisi + landing page kelime hedeflemesi için. PostHog + Search Console + 3rd party tool ile. | Öneri |
| ST-07 | **Aziz'in mevcut task'ları** | TBD | Aziz'in kendi tasarladığı/planladığı task'lar var, listelenecek ve çakışanlar ST-02~06 ile birleştirilecek | TBD |

**Aksiyon (acil değil):**
1. Aziz mevcut task listesini paylaşsın (ST-07)
2. ST-02~06 ile karşılaştır — çakışan/benzer olanları birleştir
3. Final liste netleştirildiğinde Cowork sırayla ST'leri kurar
4. ST-03 (MON-07) için MON-01~05 önce tamamlanmalı

### P2b — Redesign sonrası açılan backend işleri

> Redesign branch'i main'e merge edilince bu ticket'lar aktif olur.

| ID | Başlık | Durum | Not |
|---|---|---|---|
| HD-01b | Hesap ayarları — profil fotoğrafı yükleme (Storage + avatar URL) | Bekliyor | /hesap/ayarlar sayfası hazır |
| HD-02b | profiles tablosuna TC kimlik / vergi numarası kolonları — iyzico fatura için zorunlu | Bekliyor | Migration gerekli |
| KR-02b | Kredi yükleme — iyzico ödeme tamamlama webhook idempotency | Bekliyor | /kredi-yukle sayfası hazır |
| OD-02b | Sipariş geçmişi — iyzico ödeme kayıtlarını listele | Bekliyor | UI placeholder var |
| UR-03b | /uret'te kalan kullanılmış kredi geçmişi tablosu | Bekliyor | DB log var, UI yok |
| SR-04b | Scheduled task reaktivasyon — `blog-seo-yazisi` cron'u production'da kapat, redesign merge sonrası aç | Bekliyor | Supabase scheduled task |
| FT-01 | Paraşüt e-Arşiv entegrasyonu — kredi satın alımında otomatik fatura | Bekliyor | Redesign ile bağımsız |
| YS-11 | yzstudio Faz 5 — production test + stok fotoğraf yükleme | Bekliyor | archive/specs-completed/nf-02-yzstudio.md |
| YS-12 | yzstudio çoklu fotoğraf workflow — kıyafet ön/arka 2 ayrı fashn job + sonuç birleştirme | Bekliyor (P3, sonra ele alınacak) | Aziz onaylı 30 Nis: "sonra ele alalım" |

### P3 — Gelecek / Ertelenmiş

| ID | Başlık | Durum | Spec |
|---|---|---|---|
| NF-01 | Video Kling 3.0 Pro + ses desteği | Ertelenmiş | [archive/specs-completed/nf-01.md](archive/specs-completed/nf-01.md) |
| NF-05 | Premium video — Seedance 2.0 | Ertelenmiş | inline |
| SC-07 | Product snippets — aggregateRating | Gerçek review gelince | inline |
| BLOG-01 | Scheduled task `blog-seo-yazisi` — toplu üretim moduna geçirildi (5-8 yazı/çalışma, çakışma kontrolü, 100 hedef) | Tamamlandı (2026-04-24) | inline |

#### Ertelenmiş / Eski backlog'dan aktarılan

| ID | Başlık | Durum | Spec |
|---|---|---|---|
| LP-08 | Araçlar dropdown — hero kartları + CTA | Ertelenmiş | — |
| REF-01 | Referans programı — davet et, +10 kredi | Ertelenmiş | — |
| UX-03 | Üretim sayfası navigasyon düzenlemesi | Ertelenmiş | — |
| LS-01 | Listing skor + ücretsiz revize | Ertelenmiş | — |
| HERO-VID | Hero video tam versiyon + kırpmasız | Ertelenmiş | — |

### Test kalan (kod tamamlandı)

| ID | Başlık | Test |
|---|---|---|
| PE-01 | RMBG video + kit'e ekle | Arka planlı fotoğrafla test |
| PE-02 | Düzenleme API'sine kredi düşümü + sistem prompt | Düzenleme yap → kredi 1 düşsün |
| PE-03 | Video prompt'una stilIpucu ekle | Farklı ton → prompt'ta stil ipucu |
| PE-05 | Video route profil sorgusunu genişlet | Marka profili dolu → video prompt'ta marka bilgisi |
| PE-06 | Sosyal caption ton önceliği | Form ton > profil ton |
| PE-07 | Görsel route'a marka_adi ekle | Scene description'da marka adı |
| PE-08 | Tüm kredi düşümlerini atomik yap | 2 eş zamanlı istek → biri 429 |
| PE-10 | Foto moduna eksik alanlar | Foto modu ek alanlar prompt'ta |
| PE-11 | tonEnMap güncellemesi | Her ton değeriyle test |
| RF-01 | Dead code temizliği | `npm run build && npm run lint` |
| DoD-K0 | KÜME 0 demo testi | 5 ürün × 3 platform = 15 listing |

---

## Inline spec'ler (küçük maddeler)

### AUTH-01: Mobilde Kayıt Engeli — Turnstile Devre Dışı

Kod tamamlandı: `turnstileEnabled = false`. Kalan test:
- [ ] Mobilde kayıt ol → e-posta doğrulama → giriş yap akışı çalışıyor mu?
- [ ] Giriş yap modunda da test

### FY-01: Fiyat Artışı — 49 / 129 / 299 TL

Kod tamamlandı: `lib/paketler.ts` güncellendi, chatbot prompt güncellendi. Kalan test:
- [ ] /fiyatlar sayfasında yeni fiyatlar
- [ ] PaketModal + kredi-yukle doğru fiyat
- [ ] iyzico ödeme doğru tutar

### OPS-07: Sentry Error Monitoring

`@sentry/nextjs` kuruldu. DSN alındıktan sonra:
- [ ] Source maps upload aktif et
- [ ] Alert kuralı: her yeni hata → e-posta
- [ ] Test: kasıtlı hata → Sentry'de görünsün

### CI-01: CI Lint Hataları — 12 Error

`npm run lint` 12 error veriyor, CI kırık. 2 kategori:

**A) `setState in effect` (5 error) — Next.js 15 strict mode kuralı:**
- [ ] `app/(auth)/hesap/marka/page.tsx:64` — setState'i effect dışına al veya `useLayoutEffect` kullan
- [ ] `components/RefBanner.tsx:17` — aynı pattern
- [ ] `components/tanitim/BenefitsGrid.tsx:20` — aynı pattern
- [ ] `components/tanitim/HowItWorks.tsx:18` — aynı pattern
- [ ] `lib/feature-flags.ts:25` — aynı pattern

**B) Prototype dosyaları `<a>` yerine `<Link>` (7 error):**
- [ ] `yzliste-uret-prototype.tsx` (root) — `.eslintignore`'a ekle veya sil
- [ ] `docs/redesign/yzliste-uret-prototype.tsx` — `.eslintignore`'a ekle veya sil

**En hızlı çözüm:** Prototype dosyalarını `.eslintignore`'a ekle (7 error gider), setState hatalarını `startTransition` veya koşullu çağrıya çevir (5 error gider).

### NF-05: Premium Video — Seedance 2.0

Ertelenmiş. Seedance 2.0 fal.ai'de mevcut, 2K@60fps, native audio. Maliyet ~$0.24-0.30/sn. Demo sonrası değerlendirilecek.

---

## DoD (Definition of Done) — Küme bazlı bekleyen testler

| Küme | DoD | Durum |
|---|---|---|
| K0 | 5 ürün × 3 platform = 15 listing, görsel + video | Test kaldı |
| K1 | Geri tuşu modal kapatıyor, /fiyatlar SSR, kredi 3 yerde aynı | Kısmen |
| K2 | PostHog 9 event + $pageview, consent reddi = 0 event | Audit kaldı |
| K3 | Sitemap submit, view-source farklı title, Rich Results pass | Kısmen |
| K4 | Security headers, 60. istekte 429, CSP raporu | Test kaldı |
| K5 | 3 belge hukukçu onayı | Aziz |
| K6 | Test ödeme → Paraşüt fatura → e-posta → indirme | Test kaldı |
| K7 | Platform kuralları, markalı ürün, dashboard metrikleri | Kısmen |
| K8 | Chatbot fiyatları doğru, feedback DB'ye düşüyor | Test kaldı |
| K10 | Sentry test hatası, npm test 5+ pass, CI main'de çalışıyor | Kısmen |

---

## Ertelenmiş (trafik eşiği gelince aç)

Eşik: 1.000 tekil/ay, 100 kayıtlı, 20 gerçek ödeme, 50 günlük üretim — 2'si gerçekleşince backlog'a al.

- F-05 Abonelik paketleri (iyzico subscription)
- F-24 iyzico webhook idempotency + signature verify
- F-15 Mobil QA matrisi (BrowserStack)
- F-27 Görsel/video moderasyon
- F-29 Destek widget + SSS genişletme
- F-21 A11y tam audit (Lighthouse 95+)
- F-32 /changelog + sürüm notu
- F-33 Kredi süre sınırı politikası
- DR-CRO: Sticky CTA + exit-intent modal + CTA sayısı azaltma
- DR-EMAIL: Welcome e-mail dizisi (1/3/7 gün)
- DR-VIRAL: "yzliste ile hazırlandı" rozeti (viral loop)
- DR-SOCIAL: Twitter Card meta + sosyal medya paylaşım önizlemesi
- DR-COMMUNITY: Satıcı topluluğu (Telegram/WhatsApp)
- DR-ANNUAL: Yıllık + kurumsal paket seçenekleri
- DR-CALC: Fiyat sayfası kredi hesaplayıcı widget
- DR-ONBOARD: Kayıt sonrası onboarding wizard (3-4 adım)
- DR-EEAT: Blog sticky tarih + yazar bilgisi (SEO EEAT)

---

## Search Console — Bekleyen aksiyonlar

### SC-02: 14 sayfa "Discovered — currently not indexed"
**Aziz manuel:** Search Console → URL Inspection → Request Indexing: `/blog`, `/fiyatlar`, blog yazıları. Sitemap yeniden submit.

---

## Notlar

- **Tamamlanan işler:** `BACKLOG-DONE.md` dosyasında (RD-01~RD-04, IC-01, LP-01~LP-12, DA-01~DA-04, DR-01~DR-05, PQ-01~PQ-34, QA-01~QA-21, KÜME 9, KÜME 12, ve daha fazlası).
- **AI denetim raporu:** `specs/ai-denetim-01.md` — 12 bulgu, AI-01~AI-12
- **yzstudio detaylı spec:** `specs/nf-02-yzstudio.md`
- **Design system referans:** `docs/redesign/yzliste-design-tokens.md`
                              