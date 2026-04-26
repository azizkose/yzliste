# Architecture Decision Records (ADR)

Bu klasör yzliste'deki teknik ve ürün kararlarını belgeler.

## Şablon

```
# ADR-XXX: [Başlık]

**Tarih:** YYYY-MM-DD
**Durum:** Kabul edildi | Reddedildi | Değiştirildi (ADR-YYY ile)

## Bağlam
Neden bu kararı almak gerekti?

## Karar
Ne yapıldı?

## Sonuçlar
**Olumlu:** ...
**Olumsuz / Trade-off:** ...
```

---

## Alınan Kararlar

| ID | Başlık | Tarih | Durum |
|----|--------|-------|-------|
| ADR-001 | Next.js App Router + Supabase stack seçimi | 2025-10 | Kabul |
| ADR-002 | fal.ai queue pattern (submit → poll, Vercel timeout aşımı) | 2025-11 | Kabul |
| ADR-003 | /hesap/* sayfaları "use client" zorunlu | 2026-01 | Kabul |
| ADR-004 | Worktree kullanımını yasaklama | 2026-04-17 | Kabul |
| ADR-005 | AI config merkezi lib/ai-config.ts | 2026-04-24 | Kabul |
| ADR-006 | Prompt tek kaynak lib/prompts/metin.ts | 2026-04-24 | Kabul |
| ADR-007 | Kredi sistemi: atomik DB update (gt/gte) | 2026-03 | Kabul |
