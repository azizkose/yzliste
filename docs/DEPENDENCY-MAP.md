# Component ve Hook Bağımlılık Haritası

Kritik bileşen ve hook'ların kullanım yerleri. Değiştirmeden önce etki matrisini kontrol et.

---

## Kritik Hook'lar

### `useCredits()` — `lib/hooks/useCredits.ts`
TanStack Query ile kredi bakiyesini çeker. Kullanıcı arayüzünde kredi göstergesi.

**Kullanım yerleri:**
- `app/(auth)/hesap/page.tsx`
- `components/KrediGostergesi.tsx`
- `components/KrediButon.tsx`

**Dikkat:** staleTime 10s. Kredi düşümünden sonra invalidate etmek için `invalidateCredits()` kullan.

### `useCurrentUser()` — `lib/hooks/useCurrentUser.ts`
Mevcut kullanıcı oturumunu çeker.

**Kullanım yerleri:**
- `app/(auth)/hesap/page.tsx`
- `app/(auth)/hesap/ayarlar/page.tsx`

### `useMetinUretim()` — `lib/hooks/useMetinUretim.ts`
`/api/uret` POST çağrısı + state yönetimi.

**Kullanım yerleri:**
- `components/tabs/MetinSekmesi.tsx`

**Bağımlılar:** `store/uretimStore.ts`

### `useGorselUretim()` — `lib/hooks/useGorselUretim.ts`
fal.ai queue submit + poll döngüsü.

**Kullanım yerleri:**
- `components/tabs/GorselSekmesi.tsx`

### `useVideoUretim()` — `lib/hooks/useVideoUretim.ts`
Kling queue submit + poll.

**Kullanım yerleri:**
- `components/tabs/VideoSekmesi.tsx`

### `useSosyalUretim()` — `lib/hooks/useSosyalUretim.ts`
`/api/sosyal` POST çağrısı.

**Kullanım yerleri:**
- `components/tabs/SosyalSekmesi.tsx`

---

## Kritik Lib Dosyaları

### `lib/ai-config.ts`
AI model isimleri, sıcaklık ve maliyet haritası. **Tüm AI route'ları buraya bağlı.**

Etkisi: `/api/uret`, `/api/uret/duzenle`, `/api/sosyal`, `/api/sosyal/kit`, `/api/toplu`, `/api/chat`, `/api/studio/*`

### `lib/prompts/metin.ts`
Listing prompt tek kaynağı. Platform kuralları, ton, kategori kuralları, yasaklı kelimeler.

Etkisi: `/api/uret`, `/api/uret/duzenle`, `/api/toplu`, `lib/output-validator.ts`

### `lib/paketler.ts`
Paket fiyat ve kredi miktarları. **Tek kaynak.**

Etkisi: `/app/fiyatlar`, `components/PaketModal.tsx`, `/api/odeme`, `lib/studio-constants.ts`, `/api/chat`

### `lib/output-validator.ts`
Platform karakter limiti + yasaklı kelime kontrolü.

Etkisi: `/api/uret`, `/api/uret/duzenle`

### `lib/credits.ts`
`krediDus()` + `krediIade()` atomik kredi işlemleri.

Etkisi: `/api/sosyal`, `/api/sosyal/kit`, `/api/sosyal/video`, `/api/studio/*`

---

## Kritik Store

### `store/uretimStore.ts` — Zustand
UI state: aktif sekme, platform, form değerleri.

Etkisi: `app/uret/page.tsx`, tüm sekme bileşenleri

---

## Etki Matrisi — "X değişirse Y etkilenir"

| Değişen | Etkilenen |
|---------|-----------|
| `lib/paketler.ts` fiyatlar | fiyatlar sayfası, PaketModal, odeme API, chat system prompt |
| `lib/ai-config.ts` model | Tüm AI route'lar, maliyetler |
| `lib/prompts/metin.ts` PLATFORM_KURALLARI | uret, duzenle, toplu, output-validator |
| `supabase/profiles` şeması | Tüm /hesap/* sayfaları, profil READ eden API'lar |
| `supabase/uretimler` şeması | uret route, hesap/uretimler sayfası |
