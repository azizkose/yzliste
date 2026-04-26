# yzliste.com — Geliştirici Kurulum Rehberi

**Son güncelleme:** 21 Nisan 2026

---

## Gereksinimler

- **Node.js** 18+ (önerilen: 20 LTS)
- **npm** 9+ (proje npm kullanıyor, pnpm/yarn değil)
- **Git**
- **Supabase hesabı** (DB + Auth)
- **API key'ler:** Anthropic, fal.ai, iyzico, PostHog (aşağıda detay)

## Hızlı Başlangıç

```bash
# 1. Repo'yu klonla
git clone https://github.com/[org]/yzliste.git
cd yzliste

# 2. Bağımlılıkları kur
npm install

# 3. Env dosyasını hazırla
cp .env.example .env.local
# .env.local dosyasını aç ve tüm değerleri doldur (aşağıdaki tabloya bak)

# 4. Geliştirme sunucusunu başlat
npm run dev

# 5. Tarayıcıda aç
# http://localhost:3000
```

## Ortam Değişkenleri

`.env.example` dosyasını `.env.local` olarak kopyala ve değerleri doldur:

| Değişken | Nereden alınır | Açıklama |
|----------|----------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard → Settings → API | Proje URL'si |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Dashboard → Settings → API | Anon (public) key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard → Settings → API | Service role key (gizli!) |
| `NEXTAUTH_URL` | — | `http://localhost:3000` (local dev) |
| `NEXTAUTH_SECRET` | `openssl rand -base64 32` ile üret | Auth session secret |
| `ANTHROPIC_API_KEY` | console.anthropic.com → API Keys | Claude API key |
| `FAL_KEY` | fal.ai Dashboard → Keys | fal.ai API key |
| `IYZICO_API_KEY` | iyzico merchant panel | Ödeme API key |
| `IYZICO_SECRET_KEY` | iyzico merchant panel | Ödeme secret key |
| `NEXT_PUBLIC_POSTHOG_KEY` | PostHog → Project Settings | Analytics key |
| `NEXT_PUBLIC_POSTHOG_HOST` | — | `https://eu.i.posthog.com` |
| `UPSTASH_REDIS_REST_URL` | Upstash Console → Database | Rate limit Redis URL |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Console → Database | Rate limit Redis token |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare Dashboard → Turnstile | Bot koruması site key |
| `TURNSTILE_SECRET_KEY` | Cloudflare Dashboard → Turnstile | Bot koruması secret key |

## Kullanılabilir Komutlar

| Komut | Açıklama |
|-------|----------|
| `npm run dev` | Geliştirme sunucusu (hot reload) |
| `npm run build` | Production build |
| `npm run start` | Production sunucusu |
| `npm run lint` | ESLint kontrolü |

## Proje Yapısı (Kısa)

```
app/           → Sayfalar ve API route'ları (Next.js App Router)
components/    → React component'ları
lib/           → İş mantığı, hook'lar, yardımcı fonksiyonlar
store/         → Zustand state management
supabase/      → DB migration dosyaları
public/        → Statik dosyalar (görseller, videolar)
docs/          → Proje dokümantasyonu
```

Detaylı mimari için: `docs/ARCHITECTURE.md`  
Veritabanı şeması için: `docs/DB-SCHEMA.md`

## İlk Test

Kurulum tamamlandıktan sonra:

1. `http://localhost:3000` açılıyor mu? → Landing page görünmeli
2. `/kayit` ile test hesabı oluştur
3. `/uret` sayfasına git → platform seç, ürün adı yaz, "Üret" tıkla
4. Listing üretildi mi? → Çalışıyorsa kurulum tamam

## Supabase Local Development (Opsiyonel)

Supabase'i lokal çalıştırmak isterseniz:

```bash
# Supabase CLI kur
npm install -g supabase

# Local Supabase başlat (Docker gerektirir)
supabase start

# Migration'ları uygula
supabase db push

# Local URL'leri .env.local'a yaz
# NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
# NEXT_PUBLIC_SUPABASE_ANON_KEY=<supabase start çıktısındaki anon key>
```

## Branch ve Deploy

- `main` → production (Vercel auto-deploy → yzliste.com)
- `preview` → staging (Vercel preview URL)
- `claude/*` → feature branch'ler

**Akış:** feature branch → `preview` (test) → `main` (production)

Detaylar: `CLAUDE.md` → Branch Stratejisi bölümü

## Önemli Dosyalar

| Dosya | Ne işe yarar |
|-------|-------------|
| `BACKLOG.md` | Tüm yapılacak işler — her oturumun başında oku |
| `CHANGELOG.md` | Değişiklik günlüğü |
| `CLAUDE.md` | AI agent kuralları (Claude Code için) |
| `PROMPT-REHBER.md` | Prompt mühendisliği rehberi (70KB, detaylı) |
| `TEST-PLAYBOOK.md` | Manuel test senaryoları |
| `middleware.ts` | Auth, CSP, bot koruması |
