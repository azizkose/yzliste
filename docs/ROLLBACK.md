# Rollback Planı

Acil durum prosedürleri — production'da kritik sorun çıktığında adım adım uygula.

---

## 1. Vercel Deployment Rollback

En hızlı yöntem. Kod hatası, build hatası, veya UI bozukluğunda uygula.

```bash
# Son başarılı deployment'ı bul
vercel ls --prod

# Belirli bir deployment'a rollback
vercel rollback [deployment-url]
```

**Dashboard yolu:**  
Vercel → yzliste project → Deployments → İstenen deployment → "..." → Promote to Production

**Süre:** ~30 saniye  
**Yan etki:** Yok (stateless app, DB değişmez)

---

## 2. Database Migration Revert

Supabase migration'ı geri almak için. **Dikkatli ol — veri kaybı olabilir.**

```bash
# Mevcut migration durumu
supabase migration list

# Son migration'ı geri al (local test için)
supabase db reset

# Production'da manuel revert — migration dosyasının down script'ini çalıştır
# supabase/migrations/{timestamp}_xxx.sql içindeki "-- ROLLBACK:" bölümü
```

**Kurallar:**
- Her migration dosyasında `-- ROLLBACK:` yorumu olmalı
- Prod'da down script'i Supabase dashboard SQL Editor'dan çalıştır
- Veri silen migration'lar geri alınamaz — önce backup al

---

## 3. API Key Rotation

Bir API anahtarı sızdıysa veya güvenlik ihlali şüphesi varsa:

| Servis | Nerede Değiştirirsin | Vercel Env Var |
|--------|---------------------|----------------|
| Supabase anon key | Supabase Dashboard → Settings → API | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| Supabase service key | Supabase Dashboard → Settings → API | `SUPABASE_SERVICE_ROLE_KEY` |
| fal.ai | fal.ai Dashboard → API Keys | `FAL_KEY` |
| iyzico | iyzico Dashboard → API Bilgileri | `IYZICO_API_KEY`, `IYZICO_SECRET_KEY` |
| Upstash Redis | Upstash Console → Database → Details | `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` |
| PostHog | PostHog → Project Settings → API Keys | `NEXT_PUBLIC_POSTHOG_KEY` |

**Sonra:** Vercel → Environment Variables → Güncelle → Redeploy

---

## 4. Feature Flag ile Acil Kapatma

Kodu deploy etmeden bir özelliği kapatmak için:

**PostHog Dashboard → Feature Flags → [flag-name] → Disable**

Mevcut flaglar:
- `ff-yzstudio` — yzstudio sayfasını kapat/aç

Bu yöntem rollback gerektirmez, ~1 dakika içinde aktif olur.

---

## 5. Acil İletişim

| Durum | İlk Adım |
|-------|----------|
| Site tamamen çöktü | Vercel rollback (bkz. §1) |
| Ödeme sistemi çalışmıyor | iyzico Dashboard → Status; iyzico destek: 0850 390 0 390 |
| DB erişilemiyor | Supabase Status: status.supabase.com |
| fal.ai AI yanıt vermiyor | fal.ai Status: status.fal.ai |
| Güvenlik ihlali | API key'leri döndür (bkz. §3), destek@yzliste.com'a bildir |

---

## Rollback Karar Ağacı

```
Sorun var mı?
├── UI/UX sorunu → Vercel rollback (§1)
├── API hatası (5xx) → Vercel rollback veya feature flag (§4)
├── DB sorunu → Supabase rollback (§2), Supabase status kontrol
├── Ödeme sorunu → iyzico dashboard, iyzico ile iletişim
└── Güvenlik ihlali → API key rotation (§3) + Vercel rollback
```
