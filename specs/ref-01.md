# REF-01: Referans Programı — Davet Et, İkinize +10 Kredi

**Durum:** Açık
**Öncelik:** P1
**Tahmini süre:** 4-6 saat

---

## Mekanik

1. Her kullanıcıya benzersiz referans kodu/linki atanır: `yzliste.com/r/{kod}`
2. Davet edilen kişi bu linkle kayıt olur → referans ilişkisi kaydedilir
3. Davet edilen kişi **ilk satın almasını** yaptığında → **her iki tarafa +10 kredi** eklenir
4. Sadece kayıt yeterli DEĞİL — ilk ödeme şart (fraud koruması)

## DB şeması (Supabase migration)

```sql
create table referrals (
  id uuid primary key default gen_random_uuid(),
  referrer_id uuid references profiles(id) not null,
  referred_id uuid references profiles(id),
  referral_code text unique not null,
  referred_email text,
  status text default 'pending' check (status in ('pending','registered','completed','expired')),
  reward_given boolean default false,
  created_at timestamptz default now(),
  registered_at timestamptz,
  completed_at timestamptz
);
```

- `profiles` tablosuna `referral_code text unique` kolonu ekle
- RLS politikaları: kullanıcı sadece kendi referanslarını görsün

## Referans kodu üretimi

- Kullanıcı ilk kayıt olduğunda `referral_code` otomatik atansın (6 harf, benzersiz)
- Profil sayfasından veya /hesap'tan erişilebilir olsun

## Referans linki akışı

- `/r/[code]` route'u: kodu cookie'ye yaz (30 gün TTL) → ana sayfaya yönlendir
- Kayıt sırasında cookie'deki referans kodu okunur → `referrals` tablosuna `referred_id` yazılır, status → `registered`
- İlk ödeme callback'inde (`/api/odeme/callback`): referral status kontrol et, `completed` değilse:
  - Status → `completed`, `completed_at` = now(), `reward_given` = true
  - Davet eden +10 kredi
  - Davet edilen +10 kredi
  - Her ikisine de bildirim

## UI bileşenleri

- **Profil/Hesap sayfasında "Davet Et" bölümü:** link kopyala + WhatsApp paylaş + istatistikler
- **Landing page'de referans kodu varsa banner:** "Davet kodunla geldin! Kayıt ol ve ilk satın almanda +10 bonus kredi kazan"
- **İlk satın alma sonrası kutlama:** her iki tarafa bildirim

## Fraud koruması

- Aynı IP'den 24 saatte max 3 referans kaydı
- Self-referral engeli (aynı e-posta domain + aynı IP kontrolü)
- Kredi sadece ilk satın almada verilir
- Referans kodu 90 gün geçerli

## Paylaşım

- Kopyala butonu + WhatsApp ve Twitter/X paylaşım butonları
- WhatsApp metni: "yzliste.com ile pazaryeri içeriklerimi AI ile üretiyorum. Bu linkle kayıt ol, ilk satın almanda ikinize +10 kredi hediye {link}"

## Test

- [ ] Referans linki ile kayıt olunabilmeli
- [ ] Sadece kayıt → kredi verilmemeli
- [ ] İlk satın alma → her iki tarafa +10 kredi
- [ ] İkinci satın almada tekrar kredi verilmemeli
- [ ] Self-referral engellenmiş olmalı

## Claude Code promptu

```
REF-01: Referans Programı. specs/ref-01.md dosyasını oku ve sırayla uygula:
1. Supabase migration: referrals tablosu + profiles'a referral_code + RLS
2. /r/[code] route: cookie yaz → redirect
3. Kayıt akışında cookie'den referans kodu oku → referrals'a yaz
4. Ödeme callback'inde referral tamamla → iki tarafa +10 kredi
5. Hesap sayfasında "Davet Et" bölümü
6. Landing page'de referans banner
7. Fraud koruması
```

**Dosyalar:** `app/r/[code]/route.ts` (yeni), migration, `app/api/odeme/callback/route.ts`, hesap sayfası, yeni RefBanner/RefShare bileşenleri
