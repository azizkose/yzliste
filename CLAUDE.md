@AGENTS.md

# yzliste — Proje Kuralları

## Proje
yzliste.com — 7 pazaryeri (Trendyol, Hepsiburada, Amazon TR, N11, Etsy, Amazon USA) için AI listing üretici SaaS. Next.js 14/15 + Vercel + Supabase + iyzico.

## İş takibi
Tüm yapılacak işler **BACKLOG.md** dosyasında.
- Her oturumun başında BACKLOG.md'yi oku, nerede kaldığımızı anla.
- Bir iş bittiğinde `- [ ]` → `- [x]` olarak güncelle. Yarım iş `[x]` olmaz.
- Sırayı takip et: küme içi sıralı, kümeler arası paralel gidilebilir.
- Küme 1 (Foundation) bitmeden diğer kümeler boşa gider.

## Kod kuralları
- DB şema değişiklikleri için migration yaz — direkt SQL çalıştırma
- Supabase kullanıyoruz: `supabase migration new xxx`
- Default teknoloji seçimleri (sorma, direkt kullan):
  - **TanStack Query v5** (server state)
  - **Zustand** (UI state)
  - **PostHog EU Cloud** (analytics)
  - **Upstash Redis** (rate limit)
  - **Cloudflare Turnstile** (bot protection)
  - **vanilla-cookieconsent v3** (KVKK consent)
  - **Paraşüt** (e-Arşiv faturalama)
  - **Geist font** (next/font)
- Her küme bittiğinde CHANGELOG.md'ye 1 satır not ekle

## Dil
- Kod: İngilizce (değişken, fonksiyon, commit mesajları)
- UI metinleri: Türkçe (`messages/tr.json` hazırlanınca oradan besle)
- Route isimleri: Türkçe slug (örn: /fiyatlar, /giris, /hesap)

## Commit
- Conventional commits: `feat:`, `fix:`, `chore:`, `docs:`
- Türkçe açıklama OK: `feat: fiyatlar sayfası SSR olarak eklendi`

## Branch Stratejisi
- `main` — production (Vercel auto-deploy → yzliste.com)
- `preview` — staging (Vercel preview deploy → test URL'de doğrulama)
- `claude/*` — feature branch'ler (Claude Code çalışma alanı)
- Akış: `claude/xxx` → `preview`'a merge (test) → sorun yoksa `main`'e merge
- **Direkt `main`'e push YAPMA** — her zaman `preview` üzerinden geç
- İstisna: 1-2 satırlık acil hotfix direkt `main`'e gidebilir
- Her `main` merge sonrası Vercel deployment dashboard'ı kontrol et (build hatası var mı?)

## Deploy Kuralı
- Her feature branch `preview`'a merge edilir → Vercel preview URL oluşur
- Preview URL'de test edilir (Cowork veya Aziz)
- Sorun yoksa `preview` → `main` merge edilir
- Production deploy otomatik (Vercel)
