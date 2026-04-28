# Lighthouse Checklist — Redesign QA

Hedefler: Perf ≥85, A11y ≥90, Best Practices ≥90, SEO ≥90, CLS <0.1

## Sayfa listesi

| Sayfa | URL | Perf | A11y | BP | SEO | CLS | Durum |
|---|---|---|---|---|---|---|---|
| Anasayfa | / | — | — | — | — | — | Test bekliyor |
| Üret | /uret | — | — | — | — | — | Test bekliyor |
| Fiyatlar | /fiyatlar | — | — | — | — | — | Test bekliyor |
| Blog liste | /blog | — | — | — | — | — | Test bekliyor |
| Blog yazı (örnek) | /blog/[slug] | — | — | — | — | — | Test bekliyor |
| SSS | /sss | — | — | — | — | — | Test bekliyor |
| Hakkımızda | /hakkimizda | — | — | — | — | — | Test bekliyor |
| KVKK | /kvkk-aydinlatma | — | — | — | — | — | Test bekliyor |
| Gizlilik | /gizlilik | — | — | — | — | — | Test bekliyor |
| Koşullar | /kosullar | — | — | — | — | — | Test bekliyor |
| Çerez politikası | /cerez-politikasi | — | — | — | — | — | Test bekliyor |
| Mesafeli satış | /mesafeli-satis | — | — | — | — | — | Test bekliyor |
| Teslimat ve iade | /teslimat-iade | — | — | — | — | — | Test bekliyor |
| 404 | /olmayan-bir-sayfa | — | — | — | — | — | Test bekliyor |

## Nasıl çalıştırılır

1. Chrome DevTools → Lighthouse → Mobile modunda çalıştır
2. Veya: `npx lighthouse https://preview-url.vercel.app/ --output=html`
3. Her sayfa için sonuçları tabloya ekle

## Bilinen riskler

- **CLS**: Manrope font yüklenene kadar Inter fallback → FOUT riski. `font-display: swap` globals.css'te tanımlı, kontrol et.
- **LCP**: Hero bölümündeki büyük görsel varsa `priority` prop ekle.
- **A11y**: ChipSelector `role="radiogroup"` + `aria-checked` doğru set ediliyor, Accordion `aria-expanded` + `aria-controls` doğru — teyit et.
- **SEO**: Her sayfada `<title>` ve `<meta name="description">` var mı? `/blog/[slug]` dinamik meta?
