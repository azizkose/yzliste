# Input → Prompt Audit — 2026-05-05

**Branch:** `claude/ai-prompt-paketi`  
**Kapsam:** 4 sekme (Metin, Görsel, Video, Sosyal) — frontend input'tan AI prompt'a kadar izleme.

---

## Metin Sekmesi

| Frontend input | API'ya gidiyor mu? | AI prompt'una giriyor mu? | Kullanım yeri |
|---|---|---|---|
| `urunAdi` | ✅ | ✅ | `kullaniciBilgi` user message |
| `kategori` | ✅ | ✅ | `kullaniciBilgi` + `kategoriKoduBul()` → sistem prompt |
| `ozellikler` | ✅ | ✅ | `kullaniciBilgi` ("Ek özellikler ve bilgiler") |
| `hedefKitle` | ✅ | ✅ | `kullaniciBilgi` ("Hedef kitle") — "genel" ise eklenmez |
| `fiyatSegmenti` | ✅ | ✅ | `sistemPromptOlustur()` → `FIYAT_SEGMENT_YONLENDIRME` bloğu |
| `ton` | ✅ | ✅ | `sistemPromptOlustur()` → `TON_TANIMLARI` bloğu |
| `markaliUrun` | ✅ | ✅ | `sistemPromptOlustur()` → `markaEki` bloğu |
| `fotolar` | ✅ | ✅ | Anthropic API `image` content block |
| `girisTipi` | ✅ | ✅ | Kontrol akışı → `kullaniciBilgi` şablonu |
| `barkodBilgi` | ✅ | ✅ | `kullaniciBilgi` (isim + marka + açıklama) |
| `anahtarKelimeler` | ✅ | ✅ | `kullaniciBilgi` — **ancak UI alanı yok, her zaman ""** |
| `etiketler` | ✅ | ✅ | `kullaniciBilgi` — **ancak UI alanı yok, her zaman []** |
| `backendTerimler` | ✅ | ✅ | `kullaniciBilgi` — **ancak UI alanı yok, her zaman ""** |
| `platform` | ✅ | ✅ | `sistemPromptOlustur()` → platform kuralları |
| `dil` | ✅ | ✅ | `sistemPromptOlustur()` + `kullaniciBilgi` dil seçimi |
| `marka profili - marka_adi` | ✅ | ✅ | `kullaniciBilgi` marka bağlamı bloğu |
| `marka profili - hedef_kitle` | ✅ | ✅ | `kullaniciBilgi` marka bağlamı bloğu |
| `marka profili - vurgulanan_ozellikler` | ✅ | ✅ | `kullaniciBilgi` marka bağlamı bloğu |
| `marka profili - magaza_kategorileri` | ✅ | ✅ | `kullaniciBilgi` marka bağlamı bloğu |
| `marka profili - fiyat_bandi` | ✅ | ✅ | `kullaniciBilgi` marka bağlamı bloğu |
| `marka profili - teslimat_vurgulari` | ✅ | ✅ | `kullaniciBilgi` marka bağlamı bloğu |
| `marka profili - benchmark_magaza` | ✅ | ✅ | `kullaniciBilgi` marka bağlamı bloğu |
| `marka profili - ek_notlar` | ✅ | ✅ | `kullaniciBilgi` marka bağlamı bloğu |

---

## Görsel Sekmesi

| Frontend input | API'ya gidiyor mu? | AI prompt'una giriyor mu? | Kullanım yeri |
|---|---|---|---|
| `foto` (base64) | ✅ | NA (image2image) | fal.ai `image_url` input |
| `stil` | ✅ | NA | fal.ai prompt string'e dönüşüyor |
| `ekPrompt` (sahne açıklaması) | ✅ | NA | fal.ai prompt'a ekleniyor |
| `sosyalFormat` | ✅ | NA | fal.ai `image_size` parametresi |

---

## Video Sekmesi

| Frontend input | API'ya gidiyor mu? | AI prompt'una giriyor mu? | Kullanım yeri |
|---|---|---|---|
| `foto` (base64) | ✅ | NA (Kling) | fal.ai video input |
| `sure` (5sn/10sn) | ✅ | NA | Kling `duration` parametresi |
| `ekPrompt` | ✅ | NA | Kling motion/scene prompt |

---

## Sosyal Sekmesi

| Frontend input | API'ya gidiyor mu? | AI prompt'una giriyor mu? | Kullanım yeri |
|---|---|---|---|
| `sosyalUrunAdi` | ✅ | ✅ | `captionSistemPrompt()` kullanici mesajı |
| `sosyalEkBilgi` | ✅ | ✅ | `captionSistemPrompt()` kullanici mesajı — **ancak UI alanı yok** |
| `sosyalPlatform` | ✅ | ✅ | `PLATFORM_KURALLAR[platform]` bloğu |
| `sosyalTon` | ✅ | ✅ | `tonAciklama` bloğu |
| `sosyalSezon` | ✅ | ✅ | `SEZON_CONTEXT[sezon]` bloğu |
| `marka profili - marka_adi` | ✅ | ✅ | `markaBaglami` sistem mesajı |
| `marka profili - hedef_kitle` | ✅ | ✅ | `markaBaglami` sistem mesajı |
| `marka profili - vurgulanan_ozellikler` | ✅ | ✅ | `markaBaglami` sistem mesajı |
| `marka profili - magaza_kategorileri` | ✅ | ✅ | `markaBaglami` sistem mesajı |
| `marka profili - teslimat_vurgulari` | ✅ | ✅ | `markaBaglami` sistem mesajı |
| `marka profili - ton` (profil) | ✅ | ✅ | `markaBaglami` "Marka tonu" satırı |
| `sosyalGorselStil` | ✅ | NA | fal.ai görsel prompt |
| `sosyalGorselFormat` | ✅ | NA | fal.ai `image_size` |
| `sosyalGorselPrompt` | ✅ | NA | fal.ai prompt eki |

---

## EKSİKLİK RAPORU

### Kritik (input toplanıyor veya prompta girmeye hazır ama UI alanı hiç yok)

- **[Sosyal] `sosyalEkBilgi`** — Hook'da state var, `captionUret`/`kitUret` API çağrısına ekleniyor, `captionSistemPrompt()` prompta yansıtıyor. Ancak `SosyalSekmesi.tsx`'de bu alanı doldurmak için textarea yok. Kullanıcı ürün hakkında ek detay giremez; ekBilgi her zaman `""`. **Fix edildi bu commit'te.**

### Orta (input API'ya gidiyor ama amacına tam ulaşmıyor)

- **[Metin] `anahtarKelimeler`, `etiketler`, `backendTerimler`** — Hook'da state var, API route'a gönderiliyor, prompta da ekleniyor. Ancak `MetinSekmesi.tsx`'de ayrı UI alanları yok. Kullanıcı bunları `ozellikler` textarea'sına yazarak dolaylı geçirebilir. Ayrı alanlar UX açısından iyileştirme olur ama prompt pipeline sağlıklı. → **BACKLOG P2 önerisi.**

- **[Metin] `markaliUrun` default `false`** — Prompt'a "hiçbir marka adı kullanma" kısıtlaması ekliyor. Profilde `marka_adi` varken bu kısıt çelişiyor. UI toggle yok. → **BACKLOG P2 önerisi.**

### Düşük (input toplanıyor, prompta giriyor, fix gerekmez)

- Tüm marka profili alanları: Supabase'den çekiliyor, user message (metin) veya sistem mesajı (sosyal) içine ekleniyor. Pipeline sağlıklı.
- Görsel/Video sekmesi: AI metin prompta değil fal.ai parametrelerine gidiyor. NA.

---

## Önerilen BACKLOG Ticket'ları

| ID | Konu | Öncelik |
|---|---|---|
| AI-PROMPT-06 | `MetinSekmesi` — anahtar kelime + etiket + backend terim UI alanları ekle | P2 |
| AI-PROMPT-07 | `markaliUrun` — profilde `marka_adi` varsa otomatik `true`, yoksa UI toggle ekle | P2 |
