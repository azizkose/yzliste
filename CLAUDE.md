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
