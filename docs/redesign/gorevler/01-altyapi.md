# RD-01: Altyapı — Font + İkon Sistemi Değişikliği

**Durum:** Bekliyor
**Tahmini süre:** 1-2 saat
**Bağımlılık:** Yok (ilk görev)

---

## Amaç

Design system v2'nin temel altyapısını kurmak. İki değişiklik:
1. **Geist → Inter** font geçişi (Türkçe karakter desteği + optik düzeltme)
2. **Lucide strokeWidth** standardını 2 → 1.5'e düşürmek (daha ince, profesyonel görünüm)

Bu görevde renk, spacing veya radius değişikliği **yapılmaz** — sadece font ve ikon altyapısı.

---

## Referans dosyalar

Oku ve uygula:
- `docs/redesign/yzliste-design-tokens.md` — Bölüm 2 (Tipografi) ve Bölüm 7 (İkonlar)

---

## Yapılacaklar

### 1. Font değişikliği

**`app/layout.tsx`:**
- Geist font import'unu kaldır (mevcut: `import { GeistSans } from 'geist/font/sans'` veya benzeri)
- Inter ekle:

```tsx
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin', 'latin-ext'], // latin-ext Türkçe karakterler için zorunlu
  variable: '--font-inter',
  display: 'swap',
})
```

- Body/html className'e `inter.variable` ekle
- Eski Geist class referanslarını temizle

**`tailwind.config.ts`:**
- `fontFamily.sans` değerine `'var(--font-inter)'` ekle:

```ts
theme: {
  extend: {
    fontFamily: {
      sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
    },
  },
}
```

### 2. Lucide strokeWidth standardı

- Projede Lucide ikon kullanan tüm dosyaları bul:
  ```bash
  grep -rl "from 'lucide-react'" --include="*.tsx" --include="*.ts"
  ```
- Her dosyadaki ikon kullanımlarında `strokeWidth={1.5}` prop'u ekle
- Zaten `strokeWidth` belirlenmiş olanları 1.5'e güncelle (2 olanlar)
- `strokeWidth={1.5}` olan bir default wrapper yazmak yerine her yerde explicit belirt (şimdilik)

### 3. Doğrulama

- `npm run build` hatasız geçmeli
- Tarayıcıda DevTools → Computed → `font-family` kontrol et: Inter görünmeli
- Türkçe karakterler (ğ, ş, ç, ı, ö, ü, İ, Ğ, Ş, Ç, Ö, Ü) doğru render edilmeli
- İkonlar gözle görülür derecede ince olmalı (2 → 1.5 farkı subtle ama belli)

---

## Kabul kriterleri

- [ ] Geist font kodu tamamen kaldırılmış
- [ ] Inter font yükleniyor (latin + latin-ext)
- [ ] Tailwind config Inter'e bağlı
- [ ] Tüm Lucide ikonları strokeWidth={1.5}
- [ ] `npm run build` başarılı
- [ ] Mevcut sayfa işlevselliği bozulmamış

---

## Notlar

- **Font ağırlıkları:** Sadece 400 (regular) ve 500 (medium) kullanılacak. 600/700 (semibold/bold) varsa ileride düzeltilecek ama bu görevde kapsam dışı.
- **Inter Display:** Şimdilik sadece Inter yeterli. Inter Display başlıklar için opsiyonel — ileride eklenebilir.
- Bu görev tamamlandığında RD-02 başlayabilir.
- **Başlamadan önce ve bitirmeden önce repo kökündeki CLAUDE.md dosyasındaki UI kurallarını oku. Kabul kontrol listesini geçmeden görevi tamamlandı sayma.**
