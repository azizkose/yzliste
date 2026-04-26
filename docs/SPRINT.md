# yzliste — Haftalık Sprint Döngüsü

## Ritim

| Gün | Aksiyon |
|-----|---------|
| Pazartesi | Haftalık hedefler belirlenir — maks 5 madde, BACKLOG.md'den seçilir |
| Cuma | 3 satır retrospektif: ne bitti · ne kaldı · engel var mı? |

## T-shirt Sizing

| Boyut | Tahmini Süre | Örnek |
|-------|-------------|-------|
| S | < 1 saat | Tek dosyada küçük düzeltme, lint fix |
| M | 1-4 saat | Yeni API endpoint, küçük feature |
| L | 4-8 saat | Büyük bileşen refaktörü, yeni sayfa |
| XL | 1+ gün | Yeni modül, DB migration + UI + API |

## Kural: Maks 5 Haftalık Madde

Her sprint planında maksimum 5 madde. Tüm fikirler BACKLOG.md'de bekler; sprint planlamasında önceliklendirilir.

## Demo Milestone

Şu an: **pre-traffic** — içerik kalitesi ve güvenilirlik öncelikli.

Trafik eşiği açılma kriteri:
- 1.000 tekil ziyaretçi/ay
- 100 kayıtlı kullanıcı
- 20 gerçek ödeme
- 50 günlük üretim

Bu kriterlerin 2'si gerçekleşince `BACKLOG.md` ertelenmiş bölümündeki işler aktive edilir.

## Cuma Retrospektif Şablonu

```
## Hafta YYYY-WW

**Bitti:**
- [ item 1 ]
- [ item 2 ]

**Kaldı / Sürüklendi:**
- [ item ]

**Engel:**
- Yok / [varsa ne?]
```
