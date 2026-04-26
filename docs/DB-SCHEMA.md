# yzliste.com — Veritabanı Şeması

**Son güncelleme:** 21 Nisan 2026  
**Veritabanı:** Supabase PostgreSQL (RLS aktif)

---

## Tablolar

### profiles
Kullanıcı profili. Supabase Auth `auth.users` ile 1:1 ilişkili.

| Sütun | Tip | Varsayılan | Açıklama |
|-------|-----|------------|----------|
| `id` | uuid | PK, auth.users FK | Kullanıcı ID |
| `email` | text | — | E-posta adresi |
| `kredi` | integer | 3 | Kredi bakiyesi (yeni kayıtta 3 ücretsiz) |
| `is_admin` | boolean | false | Admin yetkisi |
| `marka_adi` | text | null | Marka adı |
| `hedef_kitle` | text | null | Hedef kitle tanımı |
| `ton` | text | null | İçerik tonu (profesyonel, samimi, vb.) |
| `vurgulanan_ozellikler` | text | null | Ürün öne çıkan özellikleri |
| `ad` | text | null | Ad |
| `soyad` | text | null | Soyad |
| `telefon` | text | null | Telefon |
| `firma_adi` | text | null | Fatura firma adı |
| `vergi_no` | text | null | Vergi numarası |
| `vergi_dairesi` | text | null | Vergi dairesi |
| `tc_kimlik` | text | null | TC kimlik no (bireysel fatura) |
| `adres` | text | null | Fatura adresi |
| `il` | text | null | İl |
| `ilce` | text | null | İlçe |
| `deleted_at` | timestamptz | null | KVKK soft delete tarihi |
| `created_at` | timestamptz | now() | Kayıt tarihi |
| `updated_at` | timestamptz | now() | Son güncelleme |

**RLS:** Kullanıcı sadece kendi kaydını okur/günceller. Admin tüm kayıtları okuyabilir.

---

### uretimler (generations)
Her üretim isteğinin kaydı.

| Sütun | Tip | Varsayılan | Açıklama |
|-------|-----|------------|----------|
| `id` | uuid | gen_random_uuid() | PK |
| `user_id` | uuid | FK → profiles.id | Üreten kullanıcı |
| `platform` | text | — | Hedef platform (trendyol, etsy, vb.) |
| `kategori` | text | null | Ürün kategorisi |
| `urun_adi` | text | — | Ürün adı |
| `sonuc` | text | — | Üretilen listing metni |
| `prompt_version` | text | null | Kullanılan prompt sürümü |
| `input_tokens` | integer | null | Giriş token sayısı |
| `output_tokens` | integer | null | Çıkış token sayısı |
| `api_cost` | numeric | null | API maliyeti (USD) |
| `regenerate_count` | integer | 0 | Tekrar üretim sayısı (max 3 ücretsiz) |
| `created_at` | timestamptz | now() | Üretim tarihi |

**RLS:** Kullanıcı sadece kendi üretimlerini okur.

---

### payments (ödemeler)
iyzico ödeme kayıtları.

| Sütun | Tip | Varsayılan | Açıklama |
|-------|-----|------------|----------|
| `id` | uuid | gen_random_uuid() | PK |
| `user_id` | uuid | FK → profiles.id | Ödeme yapan |
| `amount` | numeric | — | Ödeme tutarı (TL) |
| `credits` | integer | — | Yüklenen kredi miktarı |
| `status` | text | 'pending' | Durum: pending / success / failure |
| `iyzico_token` | text | null | iyzico işlem token'ı |
| `iyzico_conversation_id` | text | null | iyzico konuşma ID |
| `parasut_fatura_id` | text | null | Paraşüt fatura ID |
| `fatura_email_gonderildi` | boolean | false | Fatura e-posta ile gönderildi mi? |
| `created_at` | timestamptz | now() | Ödeme tarihi |

**RLS:** Kullanıcı sadece kendi ödemelerini okur.

---

### feedback (chatbot değerlendirmesi)
Chatbot konuşma değerlendirmesi (thumbs up/down).

| Sütun | Tip | Varsayılan | Açıklama |
|-------|-----|------------|----------|
| `id` | uuid | gen_random_uuid() | PK |
| `session_id` | text | — | Chat session ID |
| `rating` | text | — | 'up' veya 'down' |
| `comment` | text | null | Opsiyonel yorum |
| `page_url` | text | null | Hangi sayfadan geldi |
| `user_id` | uuid | null | Kullanıcı (opsiyonel, anonim olabilir) |
| `created_at` | timestamptz | now() | Tarih |

**RLS:** INSERT herkes, SELECT/UPDATE sadece admin.

---

### user_feedback (kullanıcı geri bildirimi)
Bug raporları, öneriler, şikayetler.

| Sütun | Tip | Varsayılan | Açıklama |
|-------|-----|------------|----------|
| `id` | uuid | gen_random_uuid() | PK |
| `type` | text | — | 'bug' / 'suggestion' / 'complaint' / 'other' |
| `message` | text | — | Geri bildirim mesajı |
| `email` | text | null | İletişim e-postası (opsiyonel) |
| `page_url` | text | null | Hangi sayfadan geldi |
| `user_id` | uuid | null | Kullanıcı (opsiyonel) |
| `status` | text | 'new' | 'new' / 'read' / 'resolved' |
| `created_at` | timestamptz | now() | Tarih |

**RLS:** INSERT herkes, SELECT/UPDATE sadece admin.

---

### deletion_log (hesap silme audit)
KVKK uyumluluğu: hesap silme talepleri audit trail.

| Sütun | Tip | Varsayılan | Açıklama |
|-------|-----|------------|----------|
| `id` | uuid | gen_random_uuid() | PK |
| `user_id` | uuid | — | Silinen kullanıcı ID |
| `email` | text | — | Silinen e-posta |
| `ip_address` | text | null | İstek IP adresi |
| `user_agent` | text | null | Tarayıcı bilgisi |
| `requested_at` | timestamptz | now() | Silme talebi tarihi |
| `purged_at` | timestamptz | null | Verinin kalıcı silinme tarihi |

**RLS:** Sadece service role erişebilir.

---

### consent_log (ödeme onay kaydı)
Checkout sırasında verilen yasal onayların kaydı.

| Sütun | Tip | Varsayılan | Açıklama |
|-------|-----|------------|----------|
| `id` | uuid | gen_random_uuid() | PK |
| `user_id` | uuid | FK → profiles.id | Onay veren kullanıcı |
| `payment_id` | uuid | null | İlgili ödeme |
| `kosullar_onay` | boolean | false | Kullanım koşulları onayı |
| `mesafeli_satis_onay` | boolean | false | Mesafeli satış sözleşmesi onayı |
| `kvkk_onay` | boolean | false | KVKK aydınlatma onayı |
| `ip_address` | text | null | İstek IP adresi |
| `created_at` | timestamptz | now() | Onay tarihi |

**RLS:** INSERT kullanıcının kendisi, SELECT sadece admin/service role.

---

## Supabase Client Yapılandırması

| Kullanım | Dosya | Tip |
|----------|-------|-----|
| Client-side (browser) | `lib/supabase.ts` | `createBrowserClient` (@supabase/ssr) |
| Server-side (RSC/API) | `lib/supabase-server.ts` | `createServerClient` (cookie handling) |
| Admin (service role) | API route'larda inline | `SUPABASE_SERVICE_ROLE_KEY` ile |

## Migration Listesi

| # | Dosya | Açıklama |
|---|-------|----------|
| 1 | `20260416000001_kvkk_soft_delete.sql` | profiles.deleted_at + deletion_log tablosu |
| 2 | `20260417000002_add_prompt_version.sql` | uretimler.prompt_version sütunu |
| 3 | `20260417203103_feedback_tables.sql` | feedback + user_feedback tabloları |
| 4 | `20260417210034_add_regenerate_count.sql` | uretimler.regenerate_count sütunu |
| 5 | `20260418000001_payments_parasut_fatura.sql` | payments.parasut_fatura_id + fatura_email_gonderildi |
| 6 | `20260418000002_consent_log.sql` | consent_log tablosu |
| 7 | `20260418000003_test_accounts.sql` | Test hesapları insert |
| 8 | `20260420000001_add_api_cost.sql` | uretimler.api_cost + input/output_tokens |

## İlişki Diyagramı

```
auth.users
    │ 1:1
    ▼
profiles ──1:N──▶ uretimler
    │
    ├──1:N──▶ payments
    │
    ├──1:N──▶ consent_log
    │
    ├──1:N──▶ feedback (opsiyonel user_id)
    │
    ├──1:N──▶ user_feedback (opsiyonel user_id)
    │
    └──1:N──▶ deletion_log
```
