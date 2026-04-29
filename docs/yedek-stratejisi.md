# Yedek Stratejisi — yzliste

> **Bu dosyanın amacı:** Aziz "yedek nasıldı, nereye baktım, eski versiyonu nasıl açarım" diye sorduğunda Cowork buradan cevap verir.
>
> **Son güncelleme:** 29 Nis 2026

---

## 1. Git tag'leri (kalıcı snapshot'lar)

| Tag | Ne zaman | Ne içerir | Restore komutu |
|---|---|---|---|
| `v1.0-pre-redesign` | 29 Nis 2026, redesign main merge ÖNCESİ | Mevcut canlı yzliste.com versiyonu — eski tasarım, eski kod, redesign yapılmadan önceki state | `git checkout v1.0-pre-redesign` |
| `pre-cleanup-2026-04-29` | 29 Nis 2026, klasör temizlik öncesi | specs/ taşıma + BACKLOG split öncesi state. Cowork temizliği bozarsa buradan geri al | `git reset --hard pre-cleanup-2026-04-29` |

**Tag listesini görmek için:**
```bash
git tag -l
```

**Tag içeriğini incelemek için:**
```bash
git show v1.0-pre-redesign --stat
git log v1.0-pre-redesign --oneline -10
```

---

## 2. Lokal yedek klasörü (canlı v1)

`yzliste-v1-archive` klasörü = `v1.0-pre-redesign` tag noktasının çalışan kopyası.

**Konum:**
```
C:\Users\catha\OneDrive\Documents\yzliste-v1-archive
```

**Nasıl oluşturuldu (referans):**
```bash
git worktree add C:\Users\catha\OneDrive\Documents\yzliste-v1-archive v1.0-pre-redesign
```

**Bu klasörde ne yapabilirsin:**
```bash
cd C:\Users\catha\OneDrive\Documents\yzliste-v1-archive
npm install
npm run build
npm run dev
# → localhost:3000'de eski canlı versiyon açılır
```

**Önemli:**
- Bu klasörde **commit YAPMA**. Donmuş kalsın.
- Acil hotfix gerekirse ayrı branch aç (`git checkout -b hotfix/v1-acil`).
- Klasörü silmek istersen: `git worktree remove ../yzliste-v1-archive`

---

## 3. Vercel deployment'ları (online erişim — opsiyonel)

Vercel her commit için preview deployment tutar. URL'ler kalıcıdır.

**Mevcut canlı (production):** yzliste.com → main branch → Vercel auto-deploy

**Redesign main'e merge edilince:**
- yzliste.com → yeni redesign
- Eski versiyona ait Vercel preview URL'leri "rollback candidate" olarak kalır
- Vercel dashboard → Deployments listesi → eski deployment'lar görünür

**Eski versiyon URL'i bulmak için:**
1. Vercel dashboard → yzliste project
2. Deployments sekmesi
3. Tarih: 29 Nis 2026 öncesi commit'leri filtrele
4. URL formatı: `yzliste-{hash}-azizkoses-projects.vercel.app`

**Online subdomain istenirse (gelecekte):**
- Vercel domain settings → `eski.yzliste.com` ekle
- Branch: `legacy/v1` (önce `git branch legacy/v1 v1.0-pre-redesign` ve push)
- DNS provider'da CNAME `eski.yzliste.com` → cname.vercel-dns.com
- Supabase auth redirect URLs'e ekle: `https://eski.yzliste.com/**`

(Bu adımlar Aziz'in talebine göre 29 Nis'te **uygulanmadı** — sadece lokal yedek istendi.)

---

## 4. OneDrive senkronizasyonu

Tüm `C:\Users\catha\OneDrive\Documents\yzliste*` klasörleri OneDrive ile sync edilir. Yani lokal kopya + OneDrive bulutu = ek otomatik yedek.

**OneDrive klasörü:** `C:\Users\catha\OneDrive\Documents`

**Sync kontrolü:** Sistem tepsisinde OneDrive ikonu yeşil tik olmalı.

---

## 5. Disaster recovery senaryoları

### Senaryo A: Yanlışlıkla bir dosya silindi
```bash
# Eğer commit edilmediyse:
git checkout HEAD -- yol/dosya.tsx

# Eğer önce commit edildiyse, daha eski commit'ten al:
git checkout HEAD~5 -- yol/dosya.tsx
```

### Senaryo B: Yanlış branch'e merge yapıldı
```bash
git reflog                          # Son 30 commit'i listele
git reset --hard HEAD@{5}            # 5 hareket geri git
```

### Senaryo C: redesign bozuk geldi, eski canlıya dön
```bash
git checkout main
git revert <merge-commit-hash>      # Merge'i geri al
git push origin main
# Vercel otomatik deploy → eski versiyon canlıda
```

### Senaryo D: Lokal disk çöktü
- GitHub remote: `https://github.com/azizkose/yzliste`
- OneDrive cloud: dosyalar otomatik sync
- `git clone https://github.com/azizkose/yzliste.git` ile geri al

---

## 6. Tag'leri push edip etmediğini kontrol

```bash
# Lokal tag'ler
git tag -l

# Remote tag'ler (GitHub'a push edildi mi?)
git ls-remote --tags origin
```

İkisi eşleşmiyorsa → `git push origin --tags`

---

## 7. Bu dosyanın güncellenmesi

Yeni bir önemli tag, branch, snapshot oluşturulduğunda **bu dosya güncellensin**. Aziz Cowork'a "yedek nasıldı" diye sorduğunda bu dosyayı okusun, cevap doğru olsun.

Önemli olaylar:
- Yeni snapshot tag'i (örn. `v2.0-post-redesign`)
- Branch silme/oluşturma (legacy/v1, vb.)
- Vercel domain değişikliği
- DNS değişikliği
- Critical incident sonrası restore noktaları
