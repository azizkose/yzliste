@AGENTS.md

# yzliste — Proje Kuralları

## Proje
yzliste.com — 7 pazaryeri (Trendyol, Hepsiburada, Amazon TR, N11, Etsy, Amazon USA) için AI listing üretici SaaS. Next.js 14/15 + Vercel + Supabase + iyzico.

## İş takibi
- **BACKLOG.md** → kısa takip listesi (açık işler, öncelik, durum).
- **specs/{ID}.md** → her işin detaylı spec'i (yapılacaklar, test, prompt).
- **BACKLOG-DONE.md** → tamamlanan işlerin arşivi.
- Her oturumun başında BACKLOG.md'yi oku, nerede kaldığımızı anla.
- Detaylı bilgi gerekiyorsa `specs/{ID}.md` dosyasını oku.
- Bir iş bittiğinde `- [ ]` → `- [x]` olarak güncelle. Yarım iş `[x]` olmaz.

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
  - **Inter font** (next/font/google, latin + latin-ext)
- Her küme bittiğinde CHANGELOG.md'ye 1 satır not ekle

## Dil
- Kod: İngilizce (değişken, fonksiyon, commit mesajları)
- UI metinleri: Türkçe (`messages/tr.json` hazırlanınca oradan besle)
- Route isimleri: Türkçe slug (örn: /fiyatlar, /giris, /hesap)

## Blog içerik kuralları
Blog yazılarında şu ifadeler YASAK:
- **Kaynaksız istatistik/yüzde:** "%60", "yüzde X" gibi rakamlar kaynak dipnotsuz kullanılamaz
- **Abartılı satış iddiaları:** "satışları katla", "X kat artır", "katlama"
- **Kanıtsız üstünlük iddiaları:** "en çok", "en iyi", "en popüler", "en gelişmiş", "1 numara"
- **Subjektif kalite iddiaları:** "stüdyo kalitesinde", "profesyonel kalitede" (kanıtsız bağlamda)
- **Garantili sonuç iddiaları:** "kesin artış", "garantili dönüşüm"
- Rakam yerine nitel dil kullan: "ciddi oranda", "belirgin şekilde", "önemli ölçüde"
- Kaynak varsa dipnot ekle: "(Kaynak: Baymard Institute, 2024)"

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

---

# yzliste — UI değişiklikleri için kalıcı kurallar

Bu dosya tüm UI/frontend görevleri için geçerlidir. Başlamadan önce oku, bitirmeden önce kabul kontrol listesini geç.

## Asla yapma

1. **Emoji yok.** UI'da hiçbir yere emoji ekleme — sekme başlığı, buton, uyarı kutusu, rozet, info bar, hiçbiri. Lucide ikon kullan (`lucide-react` paketi). Stroke 1.5, currentColor.
2. **Gölge yok.** `shadow-sm`, `shadow`, `shadow-md`, `shadow-lg`, `shadow-xl`, `shadow-2xl` kullanılmaz. Sadece form input'larında focus ring olabilir.
3. **font-semibold ve font-bold yok.** Sadece `font-normal` (400) ve `font-medium` (500). 600/700 ağırlık heavy durur.
4. **rounded-2xl, rounded-3xl yok.** Sadece `rounded` (4px), `rounded-lg` (8px), `rounded-xl` (12px). `rounded-full` sadece avatar gibi yuvarlak öğelerde.
5. **Title Case yok.** Tüm başlıklar sentence case: "Listing metni" doğru, "Listing Metni" yanlış.
6. **Tanımsız renk yok.** Sadece şu paletten kullan:
   - Primary: `#1E4DD8`, `#163B9E`, `#7B9BD9`, `#BAC9EB`, `#F0F4FB`, `#0E2558`
   - Accent (sadece premium kontekstinde — Yzstudio, Pro, Enterprise): `#A87847`, `#7D5630`, `#FAF4ED`, `#3D2710`
   - Neutral: `#FAFAF8` (bg), `#F1F0EB` (surface), `#D8D6CE` (border), `#908E86` (muted), `#5A5852` (secondary), `#1A1A17` (primary)
   - Semantik: success `#0F5132`/`#E8F5EE`, warning `#8B4513`/`#FEF4E7`, danger `#7A1E1E`/`#FCECEC`, info `#0E2558`/`#EBF1FB`
   - Tailwind'in default `bg-blue-500`, `text-indigo-600`, `bg-violet-*`, `bg-amber-*`, `bg-emerald-*` sınıfları kullanılmaz.
7. **Stage direction metni yok.** "↑ Önce fotoğraf yükle" gibi yön gösteren metinler yerine UI kendi kendini anlatsın (boş durum kutusu, açıklayıcı placeholder).
8. **Modül başına farklı renk yok.** Mavi her yerde primary. Warm earth sadece premium kontekstinde.
9. **Border kalınlığı 1px.** Vurgulu kart için sadece featured durumda 2px primary border (örn. "önerilen paket"). 2px her yerde değil.

## Tipografi

- Font: Inter (gövde) + Inter Display (başlık 18px ve üstü)
- Tracking: başlıklar -0.01em, display -0.02em
- Line-height: body 1.6, başlık 1.3-1.4

## Spacing ve radius

- Padding: 4/8/12/16/24/32/48 (Tailwind default), arbitrary değer kullanma
- Radius: sadece 4 (rozet), 8 (buton/input), 12 (kart)

## Her görev sonunda kabul kontrolü

Görevi "tamamlandı" demeden önce şunları kontrol et. Her madde için "evet/hayır" yanıt ver. Bir tane bile "hayır" varsa düzelt, tekrar bak. Hepsi "evet" olmadan bitirme:

- [ ] Değişen dosyalarda hiç emoji yok mu?
- [ ] `shadow-*` Tailwind sınıfı eklenmedi mi?
- [ ] `font-semibold` veya `font-bold` kullanılmadı mı?
- [ ] `rounded-2xl`, `rounded-3xl` kullanılmadı mı?
- [ ] Tailwind default `bg-blue-*`, `bg-indigo-*`, `bg-violet-*`, `bg-amber-*`, `bg-emerald-*` sınıfları yok mu?
- [ ] Tüm başlıklar sentence case mi?
- [ ] Mevcut fonksiyonalite çalışıyor mu (sayfa açılıyor, butonlar tıklanıyor)?
- [ ] Mobil viewport'ta (375px) düzgün görünüyor mu?

Sonra şu raporu ver: hangi dosyaları değiştirdin, hangi branch'e commitledin, lokalde nasıl test edileceği.

## Önemli

İçten gelen "burada bir emoji koyayım yumuşatsın", "burada bir gölge koyayım vurgu olsun" gibi sezgilerini bastır. Bu kurallar tasarım kararıdı