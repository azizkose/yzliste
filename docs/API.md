# yzliste API Dokümantasyonu

Internal Next.js API route'ları. Tüm endpoint'ler `/api/` prefix'i altında, Vercel Edge veya Node.js runtime'da çalışır.

**Base URL:** `https://www.yzliste.com`  
**Auth:** Supabase JWT (cookie-based). Korumalı endpoint'ler oturum gerektirir.  
**Rate limit:** Upstash Redis — genel 60 req/dk, AI endpoint'leri 10 req/dk per user.

---

## Listing Metni

### `POST /api/listing`

AI listing metni üretir (başlık + özellikler + açıklama + etiketler).

**Auth:** Gerekli  
**Kredi maliyeti:** 1  
**Rate limit:** 10/dk

**Request:**
```json
{
  "platform": "trendyol | hepsiburada | amazon | n11 | etsy | amazon_usa",
  "urunAdi": "string",
  "kategori": "string",
  "ozellikler": "string",
  "hedefKitle": "string (optional)",
  "ton": "profesyonel | samimi | heyecanli | bilgilendirici (optional)",
  "giris_tipi": "metin | fotograf | barkod",
  "foto_modu": "boolean (optional)"
}
```

**Response `200`:**
```json
{
  "baslik": "string",
  "ozellikler": ["string"],
  "aciklama": "string",
  "etiketler": ["string"],
  "uretim_id": "uuid",
  "prompt_version": "string"
}
```

**Hatalar:**
| Kod | Açıklama |
|-----|----------|
| 401 | Oturum yok |
| 402 | Yetersiz kredi |
| 429 | Rate limit aşıldı |
| 500 | AI servisi hatası |

---

## Görsel Üretimi

### `POST /api/gorsel`

Ürün fotoğrafından stüdyo görseli üretir (Bria RMBG + Flux).

**Auth:** Gerekli  
**Kredi maliyeti:** 2  
**Rate limit:** 10/dk  
**Max dosya boyutu:** 10 MB

**Request (multipart/form-data):**
```
foto: File (image/*)
platform: string
stil: "beyaz | soft-studio | lifestyle | outdoor | minimal | dark | warm"
marka_adi: string (optional)
```

**Response `200`:**
```json
{
  "gorsel_url": "https://...",
  "uretim_id": "uuid"
}
```

---

## Video Üretimi

### `POST /api/video`

Ürün fotoğrafından kısa tanıtım videosu üretir (Kling AI).

**Auth:** Gerekli  
**Kredi maliyeti:** 5 (5sn) / 8 (10sn)  
**Rate limit:** 5/dk  
**Timeout:** 120sn (async kuyruk)

**Request:**
```json
{
  "gorsel_url": "string",
  "sure": 5 | 10,
  "platform": "string",
  "ton": "string (optional)"
}
```

**Response `200`:**
```json
{
  "video_url": "https://...",
  "uretim_id": "uuid",
  "sure": 5
}
```

---

## Sosyal Medya Caption

### `POST /api/sosyal`

Platform-specific sosyal medya caption üretir.

**Auth:** Gerekli  
**Kredi maliyeti:** 1  
**Rate limit:** 10/dk

**Request:**
```json
{
  "platform": "instagram | tiktok | facebook | twitter",
  "urunAdi": "string",
  "aciklama": "string",
  "ton": "string (optional)"
}
```

**Response `200`:**
```json
{
  "caption": "string",
  "hashtags": ["string"],
  "uretim_id": "uuid"
}
```

---

## yzstudio — Try-on

### `POST /api/studio/tryon`

Ürün görselini manken üzerine giydirme (FASHN AI).

**Auth:** Gerekli  
**Kredi maliyeti:** 3  
**Rate limit:** 5/dk

**Request (multipart/form-data):**
```
urun_foto: File
manken_id: string (manken slug)
kategori: "tops | bottoms | one-pieces"
```

**Response `200`:**
```json
{
  "gorsel_url": "https://...",
  "uretim_id": "uuid"
}
```

---

## Kredi İşlemleri

### `GET /api/kredi`

Mevcut kredi bakiyesini döndürür.

**Auth:** Gerekli

**Response `200`:**
```json
{ "kredi": 42 }
```

---

### `POST /api/odeme/baslat`

iyzico ödeme oturumu başlatır.

**Auth:** Gerekli

**Request:**
```json
{
  "paket": "baslangic | populer | buyuk"
}
```

**Response `200`:**
```json
{
  "checkoutFormContent": "string (HTML)",
  "token": "string"
}
```

---

### `POST /api/odeme/callback`

iyzico ödeme sonucu webhook'u. iyzico tarafından çağrılır.

**Auth:** iyzico imza doğrulaması  
**Not:** Kullanıcı session'ı gerekmez.

---

## Listing Skor

### `POST /api/listing-skor`

Mevcut listing metnini analiz edip iyileştirme önerileri verir.

**Auth:** Gerekli  
**Kredi maliyeti:** 0 (ücretsiz)

**Request:**
```json
{
  "platform": "string",
  "baslik": "string",
  "aciklama": "string"
}
```

**Response `200`:**
```json
{
  "skor": 72,
  "guclu": ["string"],
  "zayif": ["string"],
  "oneriler": ["string"]
}
```

---

## OG Görseli

### `GET /api/og`

Blog yazıları için dinamik Open Graph görseli üretir.

**Auth:** Yok (public)  
**Cache:** 24 saat (CDN)

**Query params:**
```
title: string
kategori: string
```

**Response:** `image/png` (1200×630)

---

## Hata Formatı

Tüm hata yanıtları aynı formatı kullanır:

```json
{
  "error": "İnsan okunabilir hata mesajı",
  "code": "INSUFFICIENT_CREDITS | RATE_LIMITED | UNAUTHORIZED | ..."
}
```
