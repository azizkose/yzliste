# yzliste Prompt & Şablon Uygulama Rehberi

Bu dosya BACKLOG.md Küme 0 (PQ-01 ~ PQ-15) item'larının implementasyon detaylarını içerir.
Claude Code: bu dosyayı referans al, kodu ona göre yaz.

---

## § Çoklu Stil Seçimi + Maliyet Optimizasyonu (PQ-00) ⚠️ EN ÖNCELİKLİ

### Genel Bakış

**ESKİ MODEL:** 1 stil seç → 4 görsel üret (bedava) → ZIP indir = 1 kredi
**YENİ MODEL:** N stil seç → her stil 1 görsel üret = N kredi (üretimde düşer) → indirme bedava

**fal.ai kural:** Per-image faturalandırma. `automatic` placement = num_results × 10 görsel = 10x maliyet!
Doğru: `manual_placement` + `num_results: 1` + `fast: true` = ~$0.012/görsel

---

### ADIM 1: API — Çoklu stil + kredi üretimde düşsün

**Dosya: `app/api/gorsel/route.ts`**

```typescript
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { foto, stiller, stil, ekPrompt, userId, referansGorsel, sosyalFormat } = body;

  // Geriye uyumluluk: tek stil gelirse diziye çevir
  const stilListesi: string[] = stiller || (stil ? [stil] : ["beyaz"]);

  if (!foto) return NextResponse.json({ hata: "Fotograf gerekli" }, { status: 400 });
  if (stilListesi.length === 0) return NextResponse.json({ hata: "En az 1 stil seçin" }, { status: 400 });
  if (stilListesi.length > 7) return NextResponse.json({ hata: "En fazla 7 stil seçilebilir" }, { status: 400 });

  // ── Kredi kontrolü + atomik düşürme (ÜRETİMDE) ──
  let isAdmin = false;
  if (userId) {
    const { data: profil } = await supabaseAdmin
      .from("profiles")
      .select("kredi, is_admin, marka_adi, ton, hedef_kitle")
      .eq("id", userId)
      .single();

    if (!profil) return NextResponse.json({ hata: "Kullanici bulunamadi" }, { status: 404 });
    isAdmin = profil.is_admin === true;

    if (!isAdmin) {
      // Atomik: sadece yeterli kredi varsa düşür
      const { data: updated } = await supabaseAdmin
        .from("profiles")
        .update({ kredi: profil.kredi - stilListesi.length })
        .eq("id", userId)
        .gte("kredi", stilListesi.length)  // ← stilListesi.length kadar kredi lazım
        .select("kredi")
        .single();

      if (!updated) {
        return NextResponse.json({
          hata: `Yetersiz kredi. ${stilListesi.length} görsel için ${stilListesi.length} kredi gerekli.`
        }, { status: 402 });
      }
    }

    // brandContext oluştur (mevcut kod aynı kalır)
    // ...
  }

  try {
    // ── Fotoğraf upload + RMBG (1 kez, tüm stiller için ortak) ──
    const base64 = foto.split(",")[1];
    const mediaType = foto.split(";")[0].split(":")[1];
    const binaryStr = atob(base64);
    const bytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) bytes[i] = binaryStr.charCodeAt(i);
    const imageUrl = await fal.storage.upload(new Blob([bytes], { type: mediaType }));

    const shotSize: [number, number] = sosyalFormat
      ? (FORMAT_BOYUT[sosyalFormat] || [1000, 1000])
      : [1000, 1000];

    // RMBG — arka planı kaldır (1 kez)
    let cleanImageUrl = imageUrl;
    try {
      const rmbgResult = await fal.subscribe("fal-ai/bria/rmbg", {
        input: { image_url: imageUrl },
      }) as any;
      cleanImageUrl = rmbgResult?.data?.image?.url || imageUrl;
    } catch {
      cleanImageUrl = imageUrl;
    }

    // ── Referans görsel (varsa, 1 kez upload) ──
    let refUrl: string | null = null;
    if (referansGorsel) {
      const rb64 = referansGorsel.split(",")[1];
      const rmt = referansGorsel.split(";")[0].split(":")[1];
      const rbStr = atob(rb64);
      const rb = new Uint8Array(rbStr.length);
      for (let i = 0; i < rbStr.length; i++) rb[i] = rbStr.charCodeAt(i);
      refUrl = await fal.storage.upload(new Blob([rb], { type: rmt }));
    }

    // ── Her stil için paralel fal.queue.submit ──
    const jobs = await Promise.all(
      stilListesi.map(async (secilenStil) => {
        let input: Record<string, unknown>;

        if (secilenStil === "referans" && refUrl) {
          input = {
            image_url: cleanImageUrl,
            ref_image_url: refUrl,
            optimize_description: true,
            num_results: 1,
            fast: true,
            placement_type: "manual_placement",
            manual_placement_selection: "bottom_center",
            shot_size: shotSize,
          };
        } else {
          let sahne: string;
          if (secilenStil === "ozel") {
            sahne = ekPrompt || "clean studio background, professional product photography, keep the original product exactly as is";
          } else {
            sahne = `${stilSahneleri[secilenStil] || stilSahneleri.beyaz}${brandContext}`;
            if (ekPrompt) sahne = `${sahne}, ${ekPrompt}`;
          }
          input = {
            image_url: cleanImageUrl,
            scene_description: sahne,
            optimize_description: true,
            num_results: 1,                              // ← TEK GÖRSEL
            fast: true,                                  // ← hızlı mod
            placement_type: "manual_placement",          // ← ⛔ ASLA "automatic"!
            manual_placement_selection: pozisyonSec(secilenStil, sosyalFormat),
            shot_size: shotSize,
          };
        }

        const queued = await fal.queue.submit("fal-ai/bria/product-shot", { input } as any);
        return {
          requestId: queued.request_id,
          label: stilEtiketleri[secilenStil] || secilenStil,
          stil: secilenStil,
        };
      })
    );

    return NextResponse.json({ jobs, isAdmin });
  } catch (e: unknown) {
    // Hata durumunda krediyi geri yükle
    if (userId && !isAdmin) {
      await supabaseAdmin.rpc("kredi_geri_yukle", {
        p_user_id: userId,
        p_miktar: stilListesi.length,
      });
      // RPC yoksa alternatif:
      // const { data: profil } = await supabaseAdmin.from("profiles").select("kredi").eq("id", userId).single();
      // if (profil) await supabaseAdmin.from("profiles").update({ kredi: profil.kredi + stilListesi.length }).eq("id", userId);
    }
    const err = e as { message?: string };
    console.error("FAL HATA:", err?.message || JSON.stringify(e));
    return NextResponse.json({ hata: "Gorsel uretim hatasi: " + (err?.message || "bilinmiyor") }, { status: 500 });
  }
}
```

### Pozisyon seçim fonksiyonu (API dosyasına ekle)

```typescript
function pozisyonSec(stil: string, sosyalFormat?: string): string {
  if (sosyalFormat === "9:16") return "bottom_center";
  if (sosyalFormat === "16:9") return "center_horizontal";
  switch (stil) {
    case "beyaz":     return "center_horizontal";
    case "koyu":      return "center_horizontal";
    case "gradient":  return "center_horizontal";
    case "mermer":    return "bottom_center";
    case "ahsap":     return "bottom_center";
    case "lifestyle": return "center_vertical";
    case "dogal":     return "bottom_center";
    default:          return "center_horizontal";
  }
}
```

---

### ADIM 2: Download — Kredi düşürmeyi kaldır

**Dosya: `app/api/gorsel/download/route.ts`**

Kredi zaten üretimde düştü. Download artık bedava. Birden çok requestId kabul et:

```typescript
export async function POST(req: NextRequest) {
  const { requestIds, userId } = await req.json();
  // requestIds: string[] — her stil için ayrı requestId

  if (!requestIds || requestIds.length === 0)
    return NextResponse.json({ hata: "requestIds gerekli" }, { status: 400 });
  if (!userId)
    return NextResponse.json({ hata: "Giris yapilmadi" }, { status: 401 });

  // ❌ KREDİ DÜŞÜRME YOK — üretimde zaten düştü

  // Tek görsel → direkt döndür
  if (requestIds.length === 1) {
    const result = await fal.queue.result(ENDPOINT, { requestId: requestIds[0] }) as any;
    const images = result?.data?.images || [];
    if (!images[0]?.url) return NextResponse.json({ hata: "Görsel bulunamadı" }, { status: 404 });

    const imgRes = await fetch(images[0].url);
    const buffer = await imgRes.arrayBuffer();
    const contentType = imgRes.headers.get("content-type") || "image/jpeg";
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": "attachment; filename=yzliste-gorsel.jpg",
      },
    });
  }

  // Çoklu görsel → ZIP
  const zip = new JSZip();
  const folder = zip.folder("yzliste-gorseller")!;

  await Promise.all(
    requestIds.map(async (reqId: string, i: number) => {
      const result = await fal.queue.result(ENDPOINT, { requestId: reqId }) as any;
      const images = result?.data?.images || [];
      if (images[0]?.url) {
        const res = await fetch(images[0].url);
        const buffer = await res.arrayBuffer();
        folder.file(`gorsel-${i + 1}.jpg`, buffer);
      }
    })
  );

  const zipBuffer = await zip.generateAsync({ type: "arraybuffer" });
  return new NextResponse(zipBuffer, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": "attachment; filename=yzliste-gorseller.zip",
    },
  });
}
```

Geriye uyumluluk: eski `requestId` (tekil) parametresi gelirse `requestIds: [requestId]` olarak çevir.

---

### ADIM 3: Frontend — Çoklu stil seçimi + sonuç gösterimi

**Dosya: `app/page.tsx`**

#### 3a. State değişiklikleri

```typescript
// ESKİ:
// const [seciliStil, setSeciliStil] = useState<string>("");
// const [gorselJob, setGorselJob] = useState<{ requestId: string; label: string } | null>(null);

// YENİ:
const [seciliStiller, setSeciliStiller] = useState<Set<string>>(new Set());
const [gorselJoblar, setGorselJoblar] = useState<{ requestId: string; label: string; stil: string }[]>([]);
```

#### 3b. Stil toggle mantığı

```typescript
const stilToggle = (stilId: string) => {
  setSeciliStiller(prev => {
    const next = new Set(prev);

    // "özel" ve "referans" exclusive — diğerleriyle birlikte seçilemez
    if (stilId === "ozel" || stilId === "referans") {
      // Zaten seçiliyse kaldır, değilse tek başına seç
      return next.has(stilId) ? new Set() : new Set([stilId]);
    }

    // Normal stil toggle
    next.delete("ozel");
    next.delete("referans");
    if (next.has(stilId)) next.delete(stilId);
    else next.add(stilId);
    return next;
  });
};
```

#### 3c. Stil kartlarında çoklu seçim gösterimi

```tsx
<button key={s.id} onClick={() => stilToggle(s.id)}
  className={`flex flex-col rounded-xl overflow-hidden border-2 transition-all text-left
    ${seciliStiller.has(s.id) ? "border-purple-500 shadow-md" : "border-gray-200 hover:border-purple-300"}`}>
  {/* ... mevcut kart içeriği ... */}
  {/* Seçim badge'i: */}
  {seciliStiller.has(s.id) && (
    <div className="absolute inset-0 bg-purple-500/20 flex items-center justify-center">
      <span className="bg-purple-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">✓</span>
    </div>
  )}
</button>
```

#### 3d. Üret butonu — dinamik kredi gösterimi

```tsx
<button onClick={gorselUret}
  disabled={gorselYukleniyor || seciliStiller.size === 0 || fotolar.length === 0}
  className="w-full bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 text-white font-semibold py-3 rounded-xl transition-colors">
  {gorselYukleniyor
    ? `⏳ ${seciliStiller.size} görsel üretiliyor...`
    : fotolar.length === 0
      ? "Önce fotoğraf ekle ↑"
      : seciliStiller.size === 0
        ? "Stil seç"
        : `✨ ${seciliStiller.size} Görsel Üret — ${seciliStiller.size} kredi`}
</button>
```

#### 3e. gorselUret fonksiyonu — çoklu iş

```typescript
const gorselUret = async () => {
  if (!loginGerekli()) return;
  if (!kullanici) return;
  if (fotolar.length === 0) { alert("Önce bir ürün fotoğrafı ekleyin."); return; }
  if (seciliStiller.size === 0) { alert("En az bir stil seçin."); return; }

  const stilSayisi = seciliStiller.size;
  if (!kullanici.is_admin && kullanici.kredi < stilSayisi) { paketModalAc(); return; }

  setGorselYukleniyor(true);
  setGorselJoblar([]);

  try {
    const resizedFoto = await resizeFoto(fotolar[0]);
    const res = await fetch("/api/gorsel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        foto: resizedFoto,
        stiller: Array.from(seciliStiller),  // ← dizi olarak gönder
        ekPrompt: gorselEkPrompt,
        userId: kullanici.id,
        referansGorsel,
        sosyalFormat: undefined,  // görsel sekmesinde sosyal format yok
      }),
    });
    const data = await res.json();
    if (res.status === 402) { paketModalAc(); setGorselYukleniyor(false); return; }
    if (!data.jobs || data.jobs.length === 0) {
      setHata("Görsel üretilemedi. Tekrar deneyin.");
      setGorselYukleniyor(false);
      return;
    }

    // Kredi UI güncelle (optimistic)
    if (!kullanici.is_admin) {
      setKullanici(k => k ? { ...k, kredi: Math.max(0, k.kredi - stilSayisi) } : k);
      invalidateCredits();
    }

    // Her iş için paralel poll
    const tamamlananlar: typeof gorselJoblar = [];
    await Promise.all(
      data.jobs.map(async (job: { requestId: string; label: string; stil: string }) => {
        for (let deneme = 0; deneme < 40; deneme++) {
          await new Promise(r => setTimeout(r, 4000));
          const pollRes = await fetch(`/api/gorsel/poll?requestId=${job.requestId}`);
          const pollData = await pollRes.json();
          if (pollData.status === "COMPLETED") {
            tamamlananlar.push(job);
            // Her tamamlanan görseli anında göster (incremental):
            setGorselJoblar(prev => [...prev, job]);
            break;
          }
        }
      })
    );

    if (tamamlananlar.length === 0) setHata("Görsel üretilemedi, zaman aşımı.");
  } catch {
    setHata("Bir hata oluştu. Lütfen tekrar deneyin.");
  }
  setGorselYukleniyor(false);
};
```

#### 3f. Sonuç gösterimi — her stil ayrı kart

```tsx
{gorselJoblar.length > 0 && (
  <div className="space-y-3">
    <div className="flex items-center justify-between px-1">
      <p className="text-xs text-gray-500 font-medium">
        ✅ {gorselJoblar.length} görsel hazır
      </p>
      {/* Tümünü indir (birden çoksa ZIP, tekse direkt) */}
      {gorselJoblar.length > 1 && (
        <button onClick={async () => {
          const res = await fetch("/api/gorsel/download", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              requestIds: gorselJoblar.map(j => j.requestId),
              userId: kullanici?.id,
            }),
          });
          const blob = await res.blob();
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url; a.download = "yzliste-gorseller.zip"; a.click();
          URL.revokeObjectURL(url);
        }}
          className="flex items-center gap-1.5 text-xs bg-purple-500 hover:bg-purple-600 text-white font-semibold px-3 py-1.5 rounded-lg transition-colors">
          📦 Tümünü İndir (ZIP)
        </button>
      )}
    </div>

    <div className={`grid gap-3 ${gorselJoblar.length === 1 ? "grid-cols-1" : gorselJoblar.length === 2 ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-3"}`}>
      {gorselJoblar.map((job) => (
        <div key={job.requestId} className="space-y-1.5">
          <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-50 relative group">
            <img
              src={`/api/gorsel/img?requestId=${job.requestId}&index=0`}
              alt={job.label}
              className="w-full aspect-square object-cover select-none"
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
            />
            {/* Hover'da indirme butonu */}
            <button onClick={async () => {
              const res = await fetch("/api/gorsel/download", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ requestIds: [job.requestId], userId: kullanici?.id }),
              });
              const blob = await res.blob();
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url; a.download = `yzliste-${job.stil}.jpg`; a.click();
              URL.revokeObjectURL(url);
            }}
              className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 hover:bg-white text-purple-600 text-xs font-semibold px-2 py-1 rounded-lg shadow">
              ⬇️ İndir
            </button>
          </div>
          <div className="flex items-center justify-between px-1">
            <p className="text-xs text-gray-500 font-medium">{job.label}</p>
            {/* Tekrar üret (sadece bu stil, 1 kredi) */}
            <button onClick={async () => {
              // Bu stili tek başına yeniden üret
              if (!kullanici) return;
              if (!kullanici.is_admin && kullanici.kredi < 1) { paketModalAc(); return; }
              const resizedFoto = await resizeFoto(fotolar[0]);
              const res = await fetch("/api/gorsel", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  foto: resizedFoto, stiller: [job.stil], ekPrompt: gorselEkPrompt,
                  userId: kullanici.id, referansGorsel,
                }),
              });
              const data = await res.json();
              if (!data.jobs?.[0]) return;
              if (!kullanici.is_admin) {
                setKullanici(k => k ? { ...k, kredi: Math.max(0, k.kredi - 1) } : k);
                invalidateCredits();
              }
              // Poll ve replace
              for (let d = 0; d < 40; d++) {
                await new Promise(r => setTimeout(r, 4000));
                const pollRes = await fetch(`/api/gorsel/poll?requestId=${data.jobs[0].requestId}`);
                const pollData = await pollRes.json();
                if (pollData.status === "COMPLETED") {
                  setGorselJoblar(prev =>
                    prev.map(j => j.requestId === job.requestId ? data.jobs[0] : j)
                  );
                  break;
                }
              }
            }}
              className="text-xs text-purple-400 hover:text-purple-600 transition-colors">
              🔄 Tekrar (1 kr)
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
)}
```

#### 3g. Kaldırılacaklar

- `indirmeHakiKullan()`, `indirmeHakkiVarMi()`, `indirmeHakiSifirla()` fonksiyonları SİL — artık gereksiz
- `krediOnayla()` fonksiyonunu güncelle veya kaldır — kredi üretimde düşüyor
- `gorselUyariAcik` state'i kaldır (anonim kullanıcı uyarısı loginGerekli() ile yeterli)
- `krediOnayAcik` / `krediOnayIslem` state'leri kaldır — görsel için ayrı onay yok (buton zaten krediyi gösteriyor)

---

### ADIM 4: Referans ve Özel stil — exclusive mantık

"referans" ve "ozel" stilleri diğerleriyle birlikte seçilemez:
- "referans" seçildiğinde: referans görsel upload alanı göster, diğer stiller deselect
- "ozel" seçildiğinde: ekPrompt textarea zorunlu hale gelir, diğer stiller deselect
- Normal stil seçildiğinde: "referans" ve "ozel" deselect olur

Bu mantık `stilToggle()` fonksiyonunda zaten var (yukarıda).

---

### Maliyet karşılaştırması

```
ESKİ (şu anki kod):
  automatic, num_results=1  → 10 görsel üretilir → ~$0.23/istek, 1 istek = 1 kredi
  Kullanıcı aslında 10 görsel için para ödüyor ama 4'ünü görüyor

YENİ (çoklu stil):
  manual_placement, num_results=1, fast=true → 1 görsel/stil → ~$0.012/stil
  3 stil seçen kullanıcı: 3 × $0.012 = $0.036 → 3 kredi
  Maliyet düşer, gelir artar, kullanıcı daha fazla değer alır ✅
```

---

## § Renk Paleti Revizyonu (PQ-21) — UI Polish Pass

### Yeni Palet

```
BRAND:
  Primary:  indigo-500 (#6366f1) → CTA butonları, aktif nav, logo accent
  Hover:    indigo-600 (#4f46e5) → buton hover
  Light:    indigo-50  (#eef2ff) → arka plan vurgular, banner bg
  Badge:    indigo-100 (#e0e7ff) → kredi sayacı, rozet bg
  Text:     indigo-700 (#4338ca) → vurgulu metin

SEKMELER (her biri kendi rengi):
  Metin:    blue-500 / blue-50 / blue-100  (değişiklik yok)
  Görsel:   violet-500 / violet-50 / violet-100  (purple → violet, daha modern)
  Video:    amber-500 / amber-50 / amber-100  (red → amber, BÜYÜK DEĞİŞİKLİK)
  Sosyal:   emerald-500 / emerald-50 / emerald-100  (green/pink → emerald, tutarlı)

SEMANTİK (değişmez):
  Hata:     red-500 / red-50  → SADECE hatalar ve uyarılar
  Başarı:   green-500 / green-50  → başarı mesajları, ✓ ikonları
  Bilgi:    blue-500 / blue-50  → info banner'lar
  Uyarı:    amber-500 / amber-50  → dikkat mesajları (kredi düşük vb.)

NÖTR:
  Metin:    gray-900, gray-700, gray-500, gray-400 (değişiklik yok)
  Arka:     white, gray-50, gray-100 (değişiklik yok)
  Border:   gray-200, gray-300 (değişiklik yok)

PLATFORM BADGE'LERİ (özel):
  Trendyol:    orange-50 / orange-700  (turuncu burada kalır — Trendyol'un markası)
  Hepsiburada: orange-50 / orange-600
  Amazon TR:   yellow-50 / yellow-700
  N11:         blue-50 / blue-700
  Etsy:        orange-50 / orange-800
  Amazon USA:  blue-50 / blue-800
```

### Find-Replace Haritası

⚠️ DİKKAT: Körü körüne find-replace yapma. Her değişikliği bağlam içinde kontrol et.

#### 1. Brand orange → indigo (en büyük değişiklik)

Bu DEĞİŞECEK (brand/CTA kullanımları):
```
bg-orange-500     → bg-indigo-500      (CTA butonları)
bg-orange-600     → bg-indigo-600      (hover)
bg-orange-50      → bg-indigo-50       (banner arka planlar)
bg-orange-100     → bg-indigo-100      (badge, kredi sayacı)
text-orange-500   → text-indigo-500    (vurgu metinler)
text-orange-600   → text-indigo-600    (link, aktif state)
text-orange-700   → text-indigo-700    (koyu vurgu)
text-orange-800   → text-indigo-800    (başlıklar)
border-orange-200 → border-indigo-200  (banner border)
border-orange-400 → border-indigo-400  (aktif input)
ring-orange-400   → ring-indigo-400    (focus ring)
shadow-orange-100 → shadow-indigo-100  (buton shadow)
hover:bg-orange-*  → hover:bg-indigo-* (hover state'ler)
```

Bu DEĞİŞMEYECEK (platform badge'leri — hâlâ orange):
```
PLATFORM_BILGI içindeki renk değerleri → AYNEN KALIR
/auth sayfasında platform badge'leri → AYNEN KALIR
```

#### 2. Görsel sekmesi: purple → violet

```
bg-purple-500    → bg-violet-500
bg-purple-50     → bg-violet-50
bg-purple-100    → bg-violet-100
text-purple-500  → text-violet-500
text-purple-600  → text-violet-600
text-purple-700  → text-violet-700
border-purple-*  → border-violet-*
ring-purple-400  → ring-violet-400
hover:bg-purple-* → hover:bg-violet-*
```

#### 3. Video sekmesi: red → amber (KRİTİK — red'i hata için boşalt)

Video sekmesi bağlamındaki red'ler:
```
bg-red-500 (sekme) → bg-amber-500
bg-red-50          → bg-amber-50
bg-red-100         → bg-amber-100
text-red-500       → text-amber-500
text-red-600       → text-amber-600
text-red-700       → text-amber-700
border-red-400 (video seçim) → border-amber-400
ring-red-400       → ring-amber-400
from-orange-500 to-red-500 (video CTA gradient) → bg-amber-500 hover:bg-amber-600
```

DOKUNMA — bunlar hata/uyarı red'leri, kalacak:
```
bg-red-50 border-red-200 (hata banner)   → KALIR
text-red-500 (hata mesajı)               → KALIR
text-red-400 (zorunlu alan yıldızı *)    → KALIR
bg-red-500 (silme butonları, × kapatma)  → KALIR
```

#### 4. Sosyal sekmesi: pink → emerald

```
bg-pink-500      → bg-emerald-500
bg-pink-50       → bg-emerald-50
text-pink-500    → text-emerald-500
text-pink-600    → text-emerald-600
```

#### 5. Kredi düşük uyarısı: red → amber

Kredi uyarısı hata değil, dikkat çekme — amber daha uygun:
```
bg-red-100 text-red-600 animate-pulse (kredi sayacı düşük) → bg-amber-100 text-amber-600 animate-pulse
bg-red-50 border-red-200 (kredi banner) → bg-amber-50 border-amber-200
text-red-800 (kredi banner başlık) → text-amber-800
bg-red-500 "Kredi Yükle" butonu → bg-indigo-500 (brand CTA olmalı)
```

### Etkilenen dosyalar (tahmini)

1. `app/page.tsx` — en büyük (50+ değişiklik)
2. `app/auth/page.tsx` — landing page (30+ değişiklik)
3. `components/SiteFooter.tsx` — footer linkleri
4. `app/(auth)/hesap/ayarlar/page.tsx` — hesap ayarları
5. `app/profil/page.tsx` — profil sayfası
6. `app/fiyatlar/page.tsx` — fiyat kartları
7. `app/(auth)/kredi-yukle/page.tsx` — ödeme
8. `app/sss/page.tsx` — SSS sayfası
9. `app/globals.css` — varsa global stiller
10. `tailwind.config.ts` — varsa custom renkler

### Uygulama sırası

1. Önce `tailwind.config.ts`'de custom renk tanımı gerekip gerekmediğini kontrol et (gerekmiyor — Tailwind default indigo, violet, amber, emerald hep var)
2. `app/page.tsx` ile başla — ana araç, en çok etkilenen dosya
3. `app/auth/page.tsx` — landing page
4. Diğer sayfaları sırayla geç
5. Son adım: tarayıcıda her sayfayı kontrol et, renk tutarsızlığı arama

### PQ-19 Hero güncelleme

Compact hero spec'inde (aşağıda) orange referansları var → onları da indigo'ya çevir:
- `bg-orange-100 text-orange-700` badge → `bg-indigo-100 text-indigo-700`
- `text-orange-500` span → `text-indigo-500`
- `bg-orange-500` CTA → `bg-indigo-500`
- `shadow-orange-100` → `shadow-indigo-100`

---

## § Ana Sayfa Compact Hero (PQ-19)

### Konsept
`/` sayfasına gelen login olmamış ziyaretçi şu an sadece "İçerik üretmek için hesap gereklidir" banner'ı ve çıplak aracı görüyor. Ürünün ne olduğunu anlamıyor. Kısa bir hero ekleyerek ilk izlenimi düzeltiyoruz.

- Login olmamış → hero görünür (araç altında kalır, kullanıcı scroll'la görür)
- Login olmuş → hero gizli, direkt araç

### Dosya: `app/page.tsx`

#### Mevcut "giriş yok" banner'ını hero ile değiştir (~satır 900-914)

Mevcut kod:
```tsx
{(!kullanici || kullanici.anonim) && (
  <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 mb-5 ...">
    🔒 İçerik üretmek için hesap gereklidir ...
  </div>
)}
```

Yeni compact hero — aynı koşulda render et, banner yerine:

```tsx
{(!kullanici || kullanici.anonim) && (
  <div className="text-center mb-8 pt-2">
    {/* Kısa badge */}
    <div className="flex justify-center gap-2 mb-4">
      <span className="inline-block bg-orange-100 text-orange-700 text-xs font-semibold px-3 py-1 rounded-full">
        Trendyol · Hepsiburada · Amazon · N11 · Etsy
      </span>
    </div>

    {/* Başlık */}
    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight mb-3">
      Ürünün için metin, görsel, video —{" "}
      <span className="text-orange-500">tek platformda</span>
    </h1>

    {/* Tek satır açıklama */}
    <p className="text-sm sm:text-base text-gray-500 mb-5 max-w-lg mx-auto">
      Fotoğraf yükle veya barkod tara, pazaryerine hazır içerikleri saniyede üret.
    </p>

    {/* CTA'lar */}
    <div className="flex flex-col sm:flex-row gap-2 justify-center mb-3">
      <button
        onClick={() => { setAuthPopupMod("kayit"); setAuthPopupAcik(true); }}
        className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors shadow-md shadow-orange-100"
      >
        Ücretsiz Başla — 3 Kredi Hediye
      </button>
      <a
        href="/auth"
        className="text-gray-500 hover:text-gray-700 font-medium px-6 py-3 rounded-xl text-sm transition-colors border border-gray-200 hover:border-gray-300"
      >
        Nasıl çalışır? →
      </a>
    </div>
    <p className="text-xs text-gray-400">Kredi kartı gerekmez · Aşağıda aracı inceleyebilirsin</p>
  </div>
)}
```

### Tasarım notları
- Hero yüksekliği compact tutulmalı (~200px) — çok scroll ettirmesin, araç hemen altında görünsün
- h1 etiketi SEO için önemli — şu an `/` sayfasında h1 yok
- "Nasıl çalışır?" butonu `/auth`'a yönlendiriyor — orada detaylı anlatım var
- "Aşağıda aracı inceleyebilirsin" ifadesi kullanıcıya aracın hemen altta olduğunu söylüyor
- Login olunca hero tamamen kaybolur — gereksiz alan kaplamaz

### Ek: Araç bölümünün üstüne mini context satırı (login olmuş kullanıcı için de)

Mevcut sekmelerin hemen üstüne opsiyonel bir satır eklenebilir:

```tsx
{/* Sekmelerin hemen üstünde — her zaman görünür */}
<p className="text-xs text-gray-400 mb-3 text-center">
  Fotoğraf yükle ya da barkod tara → platform seç → içeriğini üret
</p>
```

Bu opsiyonel — login olmuş kullanıcılar için de hızlı bir hatırlatma olur.

---

## § Sosyal Kanıt Kaldırma (PQ-20)

### Dosya: `app/auth/page.tsx`

#### Kaldırılacak bölüm (~satır 881-919)

Tüm `{/* SOSYAL KANIT / TESTİMONY */}` section'ını sil:

```tsx
// BU BÖLÜMÜ TAMAMEN SİL:
<section className="px-4 sm:px-6 py-10 bg-orange-50 border-y border-orange-100">
  <div className="max-w-4xl mx-auto">
    <div className="flex flex-wrap justify-center gap-8 sm:gap-16 mb-10">
      {/* "500+ Beta kullanıcısı", "10.000+ Üretilen listing", "4.9/5" */}
      ...
    </div>
    <div className="hidden grid ...">
      {/* yorumlar / testimonials */}
      ...
    </div>
    <div className="mt-10 text-center">
      {/* CTA butonu */}
      ...
    </div>
  </div>
</section>
```

#### CTA'yı "Neden yzliste?" section'ının altına taşı

Sosyal kanıt section'ındaki CTA butonu ("Ücretsiz Hesap Oluştur →") hâlâ lazım. Onu "Neden yzliste?" section'ının sonuna ekle:

```tsx
{/* "Neden yzliste?" section'ının sonunda, grid'den sonra */}
<div className="mt-10 text-center">
  <Link href="/kayit" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-4 rounded-xl text-base transition-colors shadow-lg shadow-orange-100">
    Ücretsiz Hesap Oluştur →
  </Link>
  <p className="text-xs text-gray-400 mt-3">Ücretsiz kayıt · Kredi kartı gerekmez · 3 kredi hediye</p>
</div>
```

#### Kaldırılacak değişkenler

Eğer `yorumlar` dizisi sadece bu section'da kullanılıyorsa, onu da sil (gereksiz kod).

### Ne zaman geri koyulur?

Sosyal kanıt gerçek veri olduğunda geri eklenir:
- Supabase'den canlı sayı çek: `SELECT COUNT(*) FROM profiles`, `SELECT COUNT(*) FROM generations`
- Gerçek kullanıcı yorumları topla (chatbot feedback sistemi — CB-04/CB-05 yapılınca)
- O zamana kadar bu bölüm yok

---

## § Video Textarea TR Gösterimi (PQ-16)

### Sorun
Video sekmesinde preset'e tıklayınca textarea'da İngilizce prompt görünüyor (`"Product slowly rotates 180 degrees..."`). Kullanıcı bu metni görünce ne olduğunu anlamıyor veya "bozuk" sanıyor.

### Çözüm
Her preset'e `goster` (Türkçe) alanı ekle. Textarea'da TR metin göster, API'ye EN `deger` gönder.

### Dosya: `app/page.tsx` — Video preset yapısı (~satır 1483-1498)

#### Adım 1: Preset'lere `goster` alanı ekle

```typescript
const VIDEO_PRESETLER = [
  {
    etiket: "360° Dönüş",
    aciklama: "Ürün kendi ekseni etrafında yavaşça döner. Tüm açılar görünür.",
    ikon: "🔄",
    goster: "Ürün temiz bir yüzeyde yavaşça 180 derece döner, sabit stüdyo ışığı, beyaz arka plan",
    deger: "Product slowly rotates 180 degrees on a clean surface, smooth and steady, then gently settles back to its original position, soft even studio lighting, white background",
    kategoriler: ["tumu"],
  },
  {
    etiket: "Zoom Yaklaşım",
    aciklama: "Kamera ürüne doğru yavaş yaklaşır. Detay ve doku hissi verir.",
    ikon: "🔍",
    goster: "Kamera 3 saniyede yakın çekime geçer, ürün dokusu ve yüzey detayları ortaya çıkar, arka plan yumuşak bulanıklaşır",
    deger: "Camera smoothly zooms in from medium shot to close-up over 3 seconds, revealing product texture and surface details, then holds steady for 2 seconds, soft focus background gradually blurs more",
    kategoriler: ["tumu"],
  },
  {
    etiket: "Dramatik Işık",
    aciklama: "Karanlık sahnede spotlight açılır. Premium görünüm.",
    ikon: "💡",
    goster: "Karanlık sahne, sonra yumuşak ışık 3 saniyede ürünü aydınlatır, yüzeyde hafif yansıma, sinematik lüks hissi",
    deger: "Dark scene, then soft overhead light gradually fades in illuminating the product over 3 seconds, light reaches full brightness and holds steady, subtle reflection on surface beneath product, luxury cinematic feel",
    kategoriler: ["tumu"],
  },
  {
    etiket: "Doğal Ortam",
    aciklama: "Açık havada altın saat ışığında huzurlu sunum.",
    ikon: "🌿",
    goster: "Ürün dış mekanda doğal taş yüzeyde, altın saat güneş ışığı soldan sağa kayar, bir yaprak arka planda geçer",
    deger: "Product sits on a natural stone surface outdoors, warm golden hour sunlight slowly shifts across the frame from left to right then settles, one single leaf gently drifts past in background and exits frame, scene becomes peaceful and still",
    kategoriler: ["tumu"],
  },
  // ... diğer tüm preset'lere de `goster` alanı ekle (TR açıklama)
  // Kural: `goster` sahnenin Türkçe özeti (1-2 cümle), kullanıcının anlayacağı dilde
  // `deger` ise fal.ai'a giden İngilizce prompt (mevcut haliyle kalır)
];
```

#### Adım 2: State ayrımı — gösterilen vs gönderilen

```typescript
// ESKİ: tek state
// const [videoPrompt, setVideoPrompt] = useState("");

// YENİ: iki state
const [videoGosterMetni, setVideoGosterMetni] = useState(""); // textarea'da görünen (TR)
const [videoApiPrompt, setVideoApiPrompt] = useState("");     // API'ye gidecek (EN veya TR)
const [seciliVideoPreset, setSeciliVideoPreset] = useState<string | null>(null); // seçili preset etiket
```

#### Adım 3: Preset tıklama

```typescript
// Preset kartına tıklayınca:
<button key={p.etiket} onClick={() => {
  setVideoGosterMetni(p.goster);  // textarea'da TR göster
  setVideoApiPrompt(p.deger);     // API'ye EN gönder
  setSeciliVideoPreset(p.etiket);
}} ...>
```

#### Adım 4: Textarea değişince (kullanıcı düzenleme)

```tsx
<textarea
  value={videoGosterMetni}
  onChange={(e) => {
    setVideoGosterMetni(e.target.value);
    setVideoApiPrompt(e.target.value); // kullanıcı yazdıysa, ne yazdıysa onu gönder
    setSeciliVideoPreset(null);        // preset seçimini kaldır
  }}
  placeholder="örn: Ürün yavaşça dönsün, dramatik ışıklandırma, siyah arka plan"
  rows={2}
  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
/>
```

#### Adım 5: API çağrısında

```typescript
// videoUret fonksiyonundaki fetch body'de:
body: JSON.stringify({
  foto: resizedFoto,
  prompt: videoApiPrompt,  // ← videoPrompt yerine videoApiPrompt
  userId: kullanici.id,
  sure: videoSure,
  format: videoFormat,
}),
```

> **Not:** Kullanıcı kendi Türkçe metin yazarsa, fal.ai/Kling modeli TR'yi anlıyor — çeviri gerekmez.
> Ama preset seçildiyse optimize edilmiş EN prompt gider (daha iyi sonuç).

---

## § Görsel Hata Yönetimi (PQ-17)

### Sorun
fal.ai hata verdiğinde (300×300 minimum boyut, geçersiz format vb.) kullanıcı ~160 saniye boşa bekliyor. Poll döngüsü sadece "COMPLETED" kontrol ediyor, "FAILED" durumunu yok sayıyor.

### 3 dosyada düzeltme gerekli:

#### Dosya 1: `app/api/gorsel/poll/route.ts` — FAILED durumunda hata döndür

```typescript
import { NextRequest, NextResponse } from "next/server";
import { fal } from "@fal-ai/client";

fal.config({ credentials: process.env.FAL_KEY });

const ENDPOINT = "fal-ai/bria/product-shot";

export async function GET(req: NextRequest) {
  const requestId = req.nextUrl.searchParams.get("requestId");
  if (!requestId) {
    return NextResponse.json({ hata: "requestId gerekli" }, { status: 400 });
  }

  try {
    const status = await fal.queue.status(ENDPOINT, { requestId, logs: true });

    // FAILED durumunda hata detayını da döndür
    if (status.status === "FAILED") {
      // fal.ai hata mesajını loglardan çıkarmaya çalış
      const logs = (status as any).logs || [];
      const sonLog = logs[logs.length - 1]?.message || "";
      return NextResponse.json({
        status: "FAILED",
        hata: hataMesajiCevir(sonLog),
      });
    }

    return NextResponse.json({ status: status.status });
  } catch (e: unknown) {
    const err = e as { message?: string };
    return NextResponse.json({
      status: "FAILED",
      hata: hataMesajiCevir(err?.message || ""),
    });
  }
}

// fal.ai İngilizce hatalarını kullanıcı-dostu Türkçeye çevir
function hataMesajiCevir(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes("300") || m.includes("minimum") || m.includes("too small") || m.includes("resolution"))
    return "Fotoğraf çok küçük. En az 300×300 piksel olmalı — daha yüksek çözünürlüklü bir fotoğraf yükleyin.";
  if (m.includes("invalid image") || m.includes("format") || m.includes("decode"))
    return "Fotoğraf formatı desteklenmiyor. JPG veya PNG formatında yükleyin.";
  if (m.includes("timeout") || m.includes("timed out"))
    return "İşlem zaman aşımına uğradı. Tekrar deneyin.";
  if (m.includes("quota") || m.includes("rate limit"))
    return "Sistem meşgul, lütfen birkaç dakika sonra tekrar deneyin.";
  if (m.includes("nsfw") || m.includes("safety") || m.includes("content policy"))
    return "Bu fotoğraf güvenlik politikası nedeniyle işlenemiyor.";
  return "Görsel üretilemedi. Farklı bir fotoğraf deneyin veya tekrar deneyin.";
}
```

#### Dosya 2: `app/page.tsx` — gorselUret poll döngüsünde FAILED kontrol et

```typescript
// gorselUret fonksiyonu içindeki poll döngüsünde:
for (let deneme = 0; deneme < 40; deneme++) {
  await new Promise(r => setTimeout(r, 4000));
  const pollRes = await fetch(`/api/gorsel/poll?requestId=${data.requestId}`);
  const pollData = await pollRes.json();

  if (pollData.status === "COMPLETED") {
    setGorselJob({ requestId: data.requestId, label: data.label });
    tamamlandi = true;
    break;
  }

  // ← YENİ: FAILED kontrol
  if (pollData.status === "FAILED") {
    setHata(pollData.hata || "Görsel üretilemedi. Tekrar deneyin.");
    break; // Döngüyü hemen kır — kullanıcı beklemesini
  }
}
```

Video poll için de aynı pattern uygulanmalı (`app/api/sosyal/video/poll/route.ts` veya mevcut video poll mekanizması neredeyse).

#### Dosya 3: `app/api/gorsel/route.ts` — submit hatasını yakala

Mevcut catch bloğu zaten var ama hata mesajı jenerik. fal.ai'dan gelen spesifik hatayı Türkçeye çevir:

```typescript
} catch (e: unknown) {
  const err = e as { message?: string; body?: { detail?: string } };
  const falMesaj = err?.body?.detail || err?.message || "";

  // Krediyi geri yükle (çoklu stil senaryosunda)
  // ... (mevcut geri yükleme kodu)

  console.error("FAL HATA:", falMesaj);
  return NextResponse.json({
    hata: hataMesajiCevir(falMesaj),  // ← aynı çeviri fonksiyonu
  }, { status: 500 });
}
```

`hataMesajiCevir` fonksiyonunu ortak bir utils'e taşı: `lib/utils/fal-errors.ts`

---

## § Hesap Silme UX (PQ-18)

### Sorun
Hesap silme modal'ında "SİL" yazdırma paterni var — bu kalıcı silme (hard delete) için uygun bir güvenlik adımı. Ama yzliste'de hesap silme **soft delete** (30 gün geri alma süresi). Bu kadar ağır bir onay mekanizması gereksiz ve kullanıcıyı korkutuyor.

### Dosya: `app/(auth)/hesap/ayarlar/page.tsx`

#### Mevcut (ağır):
```tsx
// Text input: "SİL" yazdır → handleHesapSil
<input type="text" value={silmeOnay} onChange={(e) => setSilmeOnay(e.target.value.toUpperCase())} placeholder="SİL" .../>
// Validasyon: if (silmeOnay !== 'SİL') { setSilmeMesaj('"SİL" yazmanız gerekiyor.'); return }
```

#### Yeni (basit checkbox):

State değişikliği:
```typescript
// ESKİ:
// const [silmeOnay, setSilmeOnay] = useState('')

// YENİ:
const [silmeOnay, setSilmeOnay] = useState(false)
```

Modal içeriği:
```tsx
{silmeModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
    <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
      <h3 className="font-bold text-gray-900 mb-2">Hesabı silmek istediğinizden emin misiniz?</h3>
      <p className="text-xs text-gray-500 mb-4">
        Hesabınız silinmek üzere işaretlenecek. Kalan krediler ve veriler <strong>30 gün içinde</strong> kalıcı olarak silinir.
        Bu süre içinde <strong>destek@yzliste.com</strong> adresine yazarak geri alabilirsiniz.
      </p>

      {/* Checkbox onay */}
      <label className="flex items-start gap-3 p-3 bg-red-50 rounded-xl border border-red-100 cursor-pointer mb-4">
        <input
          type="checkbox"
          checked={silmeOnay}
          onChange={(e) => setSilmeOnay(e.target.checked)}
          className="mt-0.5 w-4 h-4 text-red-500 border-gray-300 rounded focus:ring-red-400"
        />
        <span className="text-xs text-red-700 font-medium">
          Hesabımı ve tüm verilerimi silmek istediğimi onaylıyorum
        </span>
      </label>

      {silmeMesaj && <p className="text-xs text-red-500 mb-3">{silmeMesaj}</p>}
      <div className="flex gap-3">
        <button
          onClick={() => setSilmeModal(false)}
          className="flex-1 border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium py-2.5 rounded-xl text-sm transition-colors"
        >
          Vazgeç
        </button>
        <button
          onClick={handleHesapSil}
          disabled={!silmeOnay || silmeYukleniyor}
          className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-red-200 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
        >
          {silmeYukleniyor ? '...' : 'Hesabı Sil'}
        </button>
      </div>
    </div>
  </div>
)}
```

handleHesapSil validasyonu:
```typescript
const handleHesapSil = async () => {
  if (!silmeOnay) { setSilmeMesaj('Onay kutusunu işaretleyin.'); return }
  // ... geri kalanı aynı
}
```

Modal açılışını da güncelle:
```typescript
onClick={() => { setSilmeModal(true); setSilmeOnay(false); setSilmeMesaj('') }}
```

---

## § Video Şablonları (PQ-01)

### Dosya: `app/page.tsx` — video preset dizisi (~satır 1386)

Mevcut 4 preset'in `deger` alanlarını aşağıdakilerle DEĞİŞTİR. Türkçe label ve açıklamalar aynı kalabilir.

```
360° Dönüş:
"Product slowly rotates 180 degrees on a clean surface, smooth and steady, then gently settles back to its original position, soft even studio lighting, white background"

Zoom Yaklaşım:
"Camera smoothly zooms in from medium shot to close-up over 3 seconds, revealing product texture and surface details, then holds steady for 2 seconds, soft focus background gradually blurs more"

Dramatik Işık:
"Dark scene, then soft overhead light gradually fades in illuminating the product over 3 seconds, light reaches full brightness and holds steady, subtle reflection on surface beneath product, luxury cinematic feel"

Doğal Ortam:
"Product sits on a natural stone surface outdoors, warm golden hour sunlight slowly shifts across the frame from left to right then settles, one single leaf gently drifts past in the background and exits frame, scene becomes peaceful and still"
```

### Dosya: `app/api/sosyal/video/route.ts` — otomatik prompt (~satır 63-70)

Mevcut `TON_VIDEO` objesini ve default prompt'u güncelle:

```typescript
const TON_VIDEO: Record<string, string> = {
  samimi: "friendly warm product showcase, camera slowly pushes in then holds steady, soft natural lighting, clean background",
  profesyonel: "clean professional product reveal, camera smoothly tracks right then stops, corporate studio lighting, white background",
  premium: "luxury cinematic product film, dramatic light gradually illuminates the product then holds, dark elegant background, subtle reflections",
};

// Default (ton yoksa):
videoPrompt = `professional product showcase${markaIpucu}, camera slowly zooms in and holds on product, clean studio lighting, white background, high quality e-commerce video`;
```

### negative_prompt güncellemesi (PQ-10)

Dosya: `app/api/sosyal/video/route.ts` ~satır 89

```typescript
negative_prompt: "blur, distort, low quality, watermark, text overlay, static, jerky, pixelated, morphing, unnatural movement, deformed product",
```

---

## § Kategori Video Şablonları (PQ-09)

### Dosya: `app/page.tsx` — video preset dizisini kategoriye göre genişlet

Yeni yapı: preset'lere `kategoriler` alanı ekle. Kullanıcı metin sekmesinde kategori seçtiyse (veya yeni bir dropdown ile), sadece ilgili preset'ler gösterilsin. Kategori seçilmemişse hepsi gösterilsin.

```typescript
const VIDEO_PRESETLER = [
  // GENEL (tüm kategoriler)
  {
    etiket: "360° Dönüş",
    aciklama: "Ürün kendi ekseni etrafında yavaşça döner. Tüm açılar görünür.",
    ikon: "🔄",
    deger: "Product slowly rotates 180 degrees on a clean surface, smooth and steady, then gently settles back to its original position, soft even studio lighting, white background",
    kategoriler: ["tumu"],
  },
  {
    etiket: "Zoom Yaklaşım",
    aciklama: "Kamera ürüne doğru yavaş yaklaşır. Detay ve doku hissi verir.",
    ikon: "🔍",
    deger: "Camera smoothly zooms in from medium shot to close-up over 3 seconds, revealing product texture and surface details, then holds steady for 2 seconds, soft focus background gradually blurs more",
    kategoriler: ["tumu"],
  },
  // KOZMETİK
  {
    etiket: "Parıltı Reveal",
    aciklama: "Yumuşak parçacıklar arasında ürün beliriyor. Kozmetik ve parfüm için ideal.",
    ikon: "✨",
    deger: "Camera slowly moves in toward the product as soft golden particles drift downward for 3 seconds then fade away, product comes into sharp focus and holds steady, warm pink-toned beauty lighting",
    kategoriler: ["kozmetik"],
  },
  {
    etiket: "Lüks Mermer",
    aciklama: "Mermer yüzeyde zarif sunum. Premium kozmetik hissi.",
    ikon: "💎",
    deger: "Product sits on white marble surface, camera slowly pans from left to center over 3 seconds then stops, soft overhead light creates gentle reflection on marble, elegant minimal composition",
    kategoriler: ["kozmetik", "taki"],
  },
  // ELEKTRONİK
  {
    etiket: "Tech Reveal",
    aciklama: "Koyu arka planda LED vurgulu teknoloji sunumu.",
    ikon: "💡",
    deger: "Dark scene, cool blue accent light glows briefly on one side of the product then fades to warm white, camera smoothly pans right revealing the product profile, then holds steady, dark background",
    kategoriler: ["elektronik"],
  },
  {
    etiket: "Detay Tarama",
    aciklama: "Kamera ürünün üzerinde kayarak detayları gösterir.",
    ikon: "🔬",
    deger: "Camera slowly tracks across the product surface from left to right revealing textures and details, then pulls back slightly to show full product and holds, clean studio lighting",
    kategoriler: ["elektronik", "tumu"],
  },
  // GİYİM
  {
    etiket: "Kumaş Hareketi",
    aciklama: "Hafif rüzgar kumaşı hafifçe oynatır. Giyim ve tekstil için.",
    ikon: "👕",
    deger: "Soft breeze gently moves the fabric for 2 seconds creating natural drape movement, then fabric settles smoothly into place, clean studio lighting from the left, camera stays steady on tripod",
    kategoriler: ["giyim"],
  },
  // GIDA
  {
    etiket: "Lezzet Çekimi",
    aciklama: "Üstten aşağı çekim, sıcak buhar efekti. Gıda ve içecek için.",
    ikon: "🍽️",
    deger: "Camera slowly descends from directly above looking down at the product on warm wooden surface, gentle wisp of steam rises briefly then dissipates, warm appetizing golden lighting, scene becomes still",
    kategoriler: ["gida"],
  },
  {
    etiket: "Taze His",
    aciklama: "Doğal ışıkta taze ve organik sunum.",
    ikon: "🌿",
    deger: "Product on light surface with small green herb sprig beside it, soft natural daylight slowly brightens over 2 seconds then holds steady, fresh clean minimal composition, one water droplet visible on surface",
    kategoriler: ["gida"],
  },
  // TAKI/MÜCEVHER
  {
    etiket: "Işıltı Dönüş",
    aciklama: "Spotlight altında yavaş dönüş, pırıltı yansımaları.",
    ikon: "💍",
    deger: "Product on dark velvet surface rotates slowly 90 degrees, single spotlight creates sparkle reflections that shimmer across facets, then product settles and reflections calm, luxurious dark background",
    kategoriler: ["taki"],
  },
  // ÇOCUK
  {
    etiket: "Neşeli Sunum",
    aciklama: "Renkli ve eğlenceli, çocuk ürünleri için.",
    ikon: "🎈",
    deger: "Product bounces lightly once on soft surface and settles into place with a gentle wobble, 3 small colorful confetti pieces drift down briefly then scene clears, bright cheerful even studio lighting",
    kategoriler: ["cocuk"],
  },
  // SPOR
  {
    etiket: "Dinamik Reveal",
    aciklama: "Enerjik ve hızlı, spor ürünleri için.",
    ikon: "⚡",
    deger: "Quick dynamic camera push toward the product then pulls back smoothly to reveal full view over 3 seconds, motion blur at start clears to sharp focus, energetic bright studio lighting, clean background",
    kategoriler: ["spor"],
  },
  // DOĞAL ORTAM (genel)
  {
    etiket: "Doğal Ortam",
    aciklama: "Açık havada altın saat ışığında huzurlu sunum.",
    ikon: "🌿",
    deger: "Product sits on a natural stone surface outdoors, warm golden hour sunlight slowly shifts across the frame from left to right then settles, one single leaf gently drifts past in background and exits frame, scene becomes peaceful and still",
    kategoriler: ["tumu"],
  },
  // DRAMATİK (genel)
  {
    etiket: "Dramatik Işık",
    aciklama: "Karanlık sahnede ürüne spotlight açılır. Premium görünüm.",
    ikon: "💡",
    deger: "Dark scene, then soft overhead light gradually fades in illuminating the product over 3 seconds, light reaches full brightness and holds steady, subtle reflection on surface beneath product, luxury cinematic feel",
    kategoriler: ["tumu"],
  },
];

// Frontend filtre mantığı:
// const gosterilecekler = seciliKategori
//   ? VIDEO_PRESETLER.filter(p => p.kategoriler.includes(seciliKategori) || p.kategoriler.includes("tumu"))
//   : VIDEO_PRESETLER;
```

---

## § Görsel Pipeline — RMBG Entegrasyonu (PQ-03)

### Dosya: `app/api/gorsel/route.ts`

Mevcut akış: foto → FAL storage upload → product-shot
Yeni akış: foto → FAL storage upload → **RMBG** → product-shot

fal.storage.upload sonrası, product-shot'a göndermeden ÖNCE arka plan kaldır:

```typescript
// 1. Önce RMBG ile arka planı kaldır
const rmbgResult = await fal.subscribe("fal-ai/bria/rmbg", {
  input: { image_url: imageUrl },
}) as any;
const cleanImageUrl = rmbgResult?.data?.image?.url || imageUrl; // fallback: orijinal

// 2. Temiz görsel ile product-shot'a gönder
input = {
  image_url: cleanImageUrl, // ← imageUrl yerine cleanImageUrl
  scene_description: sahne,
  // ... geri kalan aynı
};
```

Not: `fal.subscribe` RMBG için senkron çalışır (~2-5 saniye). Queue gerekmiyor. Hata olursa orijinal görselle devam et (graceful fallback).

---

## § Görsel — Placement (PQ-04) ⛔ İPTAL EDİLDİ

> **ÖNCEKİ ÖNERİ YANLIŞ VE İPTAL EDİLMİŞTİR.**
> `placement_type: "automatic"` kullanmak `num_results × 10` görsel üretir ve 10x maliyet çıkarır.
> Eğer bu değişiklik uygulandıysa GERİ AL.
>
> Doğru yaklaşım: `placement_type: "manual_placement"` + `manual_placement_selection: "bottom_center"` + `num_results: 1`
>
> Detay için yukarıdaki **§ fal.ai Tek Görsel Optimizasyonu (PQ-00)** bölümüne bak.

---

## § Kategori-Stil Eşleştirme (PQ-05)

### Dosya: `app/page.tsx` — stil kartları bölümü

Stil kartlarına `kategoriler` alanı ekle. Kategori seçiliyse önerilen stiller üstte gösterilsin:

```typescript
const GORSEL_STILLER = [
  { id: "beyaz", label: "⬜ Beyaz Zemin", kategoriler: ["kozmetik", "elektronik", "cocuk", "giyim"] },
  { id: "koyu", label: "⬛ Koyu Zemin", kategoriler: ["elektronik", "taki"] },
  { id: "lifestyle", label: "🏠 Lifestyle", kategoriler: ["giyim", "ev", "gida"] },
  { id: "mermer", label: "🪨 Mermer", kategoriler: ["kozmetik", "taki"] },
  { id: "ahsap", label: "🪵 Ahşap", kategoriler: ["gida", "ev", "spor"] },
  { id: "gradient", label: "🎨 Gradient", kategoriler: ["elektronik", "cocuk", "kozmetik"] },
  { id: "dogal", label: "🌿 Doğal", kategoriler: ["gida", "spor", "ev"] },
  { id: "ozel", label: "✏️ Sahneni Yaz", kategoriler: ["tumu"] },
  { id: "referans", label: "🖼️ Arka Plan", kategoriler: ["tumu"] },
];

// Sıralama: seçilen kategoriye uyan stiller önce
// const sirali = seciliKategori
//   ? [...stiller.filter(s => s.kategoriler.includes(seciliKategori)), ...stiller.filter(s => !s.kategoriler.includes(seciliKategori) && s.kategoriler[0] !== "tumu")]
//   : stiller;
```

---

## § Yeni Input Prompt Entegrasyonu (PQ-06)

### Dosya: `app/api/uret/route.ts`

POST body'den yeni alanları al:

```typescript
const {
  urunAdi, kategori, ozellikler, platform, fotolar,
  girisTipi, barkodBilgi, userId, dil, ton,
  hedefKitle, fiyatSegmenti, anahtarKelimeler,  // ← YENİ
} = await req.json();
```

`kullaniciBilgi` oluşturulurken (manuel mod, ~satır 429-434) yeni alanları ekle:

```typescript
// TR platformlar
kullaniciBilgi = `Urun adi: ${urunAdi}\nKategori: ${kategori}\nEk ozellikler ve bilgiler: ${ozellikler || "belirtilmedi"}`;
if (hedefKitle && hedefKitle !== "genel") kullaniciBilgi += `\nHedef kitle: ${hedefKitle}`;
if (fiyatSegmenti) kullaniciBilgi += `\nFiyat segmenti: ${fiyatSegmenti}`;
if (anahtarKelimeler) kullaniciBilgi += `\nOncelikli anahtar kelimeler (bunlari dogal sekilde baslik ve aciklamaya yerlestir): ${anahtarKelimeler}`;

// EN platformlar (etsy, amazon_usa)
kullaniciBilgi = `Product name: ${urunAdi}\nCategory: ${kategori}\nAdditional details: ${ozellikler || "none provided"}`;
if (hedefKitle && hedefKitle !== "genel") kullaniciBilgi += `\nTarget audience: ${hedefKitle}`;
if (fiyatSegmenti) kullaniciBilgi += `\nPrice segment: ${fiyatSegmenti}`;
if (anahtarKelimeler) kullaniciBilgi += `\nPriority keywords (weave naturally into title and description): ${anahtarKelimeler}`;
```

Fiyat segmenti prompt tonu etkisi — `sistemPromptOlustur()` içinde:

```typescript
const FIYAT_SEGMENT_YONLENDIRME: Record<string, { tr: string; en: string }> = {
  butce: {
    tr: "Bu bütçe segmenti bir ürün. Fiyat-performans vurgula. 'Uygun fiyatlı', 'ekonomik', 'hesaplı' gibi ifadeler kullan. Premium dil kullanma.",
    en: "This is a budget product. Emphasize value for money. Use terms like 'affordable', 'great value', 'budget-friendly'. Avoid premium language.",
  },
  orta: {
    tr: "Bu orta segment bir ürün. Kalite ve güvenilirlik vurgula. Dengeli bir dil kullan — ne ucuz ne lüks hissettir.",
    en: "This is a mid-range product. Emphasize quality and reliability. Use balanced language — neither cheap nor luxury.",
  },
  premium: {
    tr: "Bu premium segment bir ürün. Kalite, özel tasarım, dayanıklılık ve prestij vurgula. Seçkin, özenli bir dil kullan.",
    en: "This is a premium product. Emphasize quality, craftsmanship, durability and prestige. Use refined, sophisticated language.",
  },
};
```

### Dosya: `app/page.tsx` — form alanları (metin sekmesi, ~satır 1037-1053 arası)

Mevcut "Ek Bilgi" textarea'dan sonra 3 yeni alan ekle:

```tsx
{/* Hedef Kitle */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">Hedef Kitle <span className="text-gray-400 font-normal">(isteğe bağlı)</span></label>
  <select value={hedefKitle} onChange={(e) => setHedefKitle(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
    <option value="genel">Genel</option>
    <option value="kadinlar">Kadınlar</option>
    <option value="erkekler">Erkekler</option>
    <option value="gencler">Gençler (18-25)</option>
    <option value="ebeveynler">Ebeveynler</option>
    <option value="profesyoneller">Profesyoneller</option>
    <option value="sporcular">Sporcular</option>
  </select>
</div>

{/* Fiyat Segmenti */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">Fiyat Segmenti <span className="text-gray-400 font-normal">(isteğe bağlı)</span></label>
  <div className="grid grid-cols-3 gap-2">
    {(["butce", "orta", "premium"] as const).map((seg) => (
      <button key={seg} onClick={() => setFiyatSegmenti(seg)}
        className={`py-2 rounded-xl border-2 text-xs font-semibold transition-all ${fiyatSegmenti === seg ? "border-orange-400 bg-orange-50 text-orange-600" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}>
        {seg === "butce" ? "💰 Bütçe" : seg === "orta" ? "⚖️ Orta" : "👑 Premium"}
      </button>
    ))}
  </div>
</div>

{/* Anahtar Kelimeler */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">Anahtar Kelimeler <span className="text-gray-400 font-normal">(isteğe bağlı)</span></label>
  <input type="text" value={anahtarKelimeler} onChange={(e) => setAnahtarKelimeler(e.target.value)}
    placeholder="örn: kışlık bot, su geçirmez ayakkabı, erkek outdoor"
    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
  <p className="text-xs text-gray-400 mt-1">💡 Arama sonuçlarında çıkmak istediğin kelimeler — AI bunları başlık ve açıklamaya doğal yerleştirir</p>
</div>
```

State tanımları (page.tsx üst kısım):

```typescript
const [hedefKitle, setHedefKitle] = useState("genel");
const [fiyatSegmenti, setFiyatSegmenti] = useState<"butce" | "orta" | "premium">("orta");
const [anahtarKelimeler, setAnahtarKelimeler] = useState("");
```

API çağrısına ekleme (icerikUret fonksiyonu, fetch body):

```typescript
body: JSON.stringify({
  urunAdi, kategori, ozellikler, platform, fotolar,
  girisTipi, barkodBilgi, userId: kullanici.id, dil, ton,
  hedefKitle, fiyatSegmenti, anahtarKelimeler,  // ← YENİ
}),
```

---

## § Kategori Prompt Katmanı (PQ-07)

### Dosya: `app/api/uret/route.ts`

ICERIK_KURALLARI'ndan sonra yeni obje ekle:

```typescript
const KATEGORI_KURALLARI: Record<string, { tr: string; en: string }> = {
  kozmetik: {
    tr: `KOZMETIK KURALLARI:
- Tibbi iddia YAPMA: "sifalı", "tedavi eder", "cildi gençleştirir", "klinik kanıtlı" YASAK
- Kullanılabilecek ifadeler: "nem dengesi sağlar", "bakımlı görünüm", "cilt bariyerini destekler"
- İçerik/formül bilgisi varsa teknik ama anlaşılır yaz (Hyaluronic Acid → "nemlendirici hyaluronik asit")
- Cilt tipi, yaş aralığı ve kullanım sıklığı belirtilmişse metne doğal ekle
- Koku notu, doku (jel/krem/serum) gibi detaylar önemli — varsa vurgula
- Vegan, cruelty-free, paraben-free gibi sertifikalar SADECE kullanıcı belirttiyse yaz`,
    en: `COSMETICS RULES:
- NO medical claims: "heals", "cures", "anti-aging miracle", "clinically proven" are BANNED
- Acceptable: "supports skin barrier", "hydrating formula", "helps maintain moisture balance"
- If ingredients mentioned, write technically but accessibly
- Include skin type, texture, scent notes if provided
- Only mention certifications (vegan, cruelty-free) if user specified`,
  },
  elektronik: {
    tr: `ELEKTRONIK KURALLARI:
- Spesifikasyonları doğru ve net yaz — sayıları yuvarlama, "yaklaşık" deme, kullanıcı verdiyse aynen yaz
- Uyumluluk bilgisi kritik: hangi cihazlarla çalışır, voltaj, bağlantı tipi
- "En hızlı", "en iyi performans" gibi kanıtlanamaz iddialar YASAK — somut spec ver
- Kutu içeriği ve garanti süresi belirtilmişse mutlaka ekle
- Karşılaştırmalı fayda yaz: "X mAh batarya sayesinde 2 gün şarjsız kullanım" (spec → fayda)
- CE, TSE, garanti belgesi SADECE kullanıcı belirttiyse yaz`,
    en: `ELECTRONICS RULES:
- Write specifications precisely — don't round numbers or use "approximately"
- Compatibility info is critical: what devices it works with, voltage, connector type
- NO unprovable claims like "fastest", "best performance" — use concrete specs
- Include box contents and warranty if provided
- Write comparative benefits: "5000mAh battery for 2 days of use" (spec → benefit)`,
  },
  giyim: {
    tr: `GIYIM KURALLARI:
- Beden bilgisi kritik: beden aralığı, kalıp tipi (regular/slim/oversize) belirtilmişse yaz
- Kumaş bilgisi fayda olarak yaz: "%100 pamuk" → "%100 pamuk kumaşıyla gün boyu nefes alır"
- Yıkama/bakım talimatı varsa kısa ekle
- Sezon ve kombin önerisi vur: "kış aylarında mont altına ideal" (kullanım senaryosu)
- "Orjinal" yazım hatası YAPMA, "orijinal" yaz. "Replika" veya "A kalite" GİBİ ifadeler YASAK
- Renk ve desen açıklamaları net olsun: "lacivert" yeterli değil → "koyu lacivert, slim fit kesim"`,
    en: `CLOTHING RULES:
- Size info is critical: size range, fit type (regular/slim/oversized) if provided
- Write fabric as benefit: "100% cotton" → "breathable 100% cotton for all-day comfort"
- Include care instructions if provided
- Add season and styling suggestions as use cases
- Color and pattern descriptions should be specific and vivid`,
  },
  gida: {
    tr: `GIDA KURALLARI:
- Sağlık iddiası YASAK: "zayıflatır", "bağışıklığı güçlendirir", "şifalı" KULLANMA
- Allerjen uyarısı belirtilmişse MUTLAKA yaz (gluten, fındık, süt, yumurta)
- Tat profili ve kullanım önerisi yaz: "kahvaltıda taze ekmekle", "soğuk servis edilir"
- Gramaj, porsiyon sayısı, son kullanma bilgisi varsa ekle
- Organik, GDO'suz, helal, vegan gibi sertifikalar SADECE kullanıcı belirttiyse
- "Ev yapımı tat" gibi duygusal ifadeler kullanılabilir ama abartma`,
    en: `FOOD RULES:
- NO health claims: "helps lose weight", "boosts immunity", "medicinal" are BANNED
- Allergen warnings MUST be included if provided (gluten, nuts, dairy, eggs)
- Write taste profile and serving suggestions
- Include weight, servings, shelf life if provided
- Only mention certifications (organic, non-GMO, halal) if user specified`,
  },
  ev: {
    tr: `EV & YAŞAM KURALLARI:
- Ölçüler net olsun: cm/mm cinsinden, "büyük boy" gibi göreceli ifadeler yetersiz
- Malzeme ve dayanıklılık faydaya çevir: "paslanmaz çelik" → "paslanmaz çelik gövdesiyle uzun ömürlü"
- Montaj bilgisi kritik: montaj gerekli mi, araçlar dahil mi, süre tahmini
- Oda/ortam önerisi vur: "salon, yatak odası veya ofis için ideal boyut"
- Ağırlık ve taşınabilirlik varsa belirt
- Ateşe/suya dayanıklılık gibi güvenlik iddialarını SADECE kullanıcı belirttiyse yaz`,
    en: `HOME & LIVING RULES:
- Dimensions must be precise in cm/inches — avoid relative terms like "large"
- Convert materials to benefits: "stainless steel" → "durable stainless steel body"
- Assembly info is critical: required?, tools included?, estimated time?
- Suggest room/setting: "perfect size for living room, bedroom or office"`,
  },
  spor: {
    tr: `SPOR & OUTDOOR KURALLARI:
- Performans faydası somut olsun: "hafif" → "sadece 280g ile uzun parkurlarda yorulmaz"
- Aktivite tipi ve seviye belirt: "başlangıç seviyesi koşucular için" veya "profesyonel kullanıma uygun"
- Hava koşulu/mevsim uyumu: "yağmura dayanıklı", "kış sporları için termal yalıtım"
- "Profesyonel sporcu" ibaresi dikkatli kullan — sadece gerçekten o seviyedeyse
- Bakım ve temizlik bilgisi varsa ekle`,
    en: `SPORTS & OUTDOOR RULES:
- Performance benefits must be concrete: "lightweight" → "only 280g for fatigue-free long runs"
- Specify activity type and level if provided
- Weather/season compatibility is important
- Use "professional-grade" carefully — only if truly applicable`,
  },
  cocuk: {
    tr: `ÇOCUK & BEBEK KURALLARI:
- Yaş aralığı ZORUNLU belirt (kullanıcı verdiyse): "3-6 yaş", "0-12 ay" vb.
- Güvenlik vurgusu kritik: "BPA-free", "küçük parça içermez", "CE belgeli" — SADECE kullanıcı belirttiyse
- Eğitici/gelişimsel fayda yazılabilir: "ince motor becerilerini geliştirir" (genel kabul görmüş ifadeler OK)
- Ebeveyn perspektifinden yaz: "annenin güvenle tercih edebileceği"
- Parlak renk, eğlenceli dil kullan ama abartma
- "Kesinlikle güvenli" gibi mutlak güvenlik iddiaları YASAK — "güvenlik standartlarına uygun" OK`,
    en: `KIDS & BABY RULES:
- Age range REQUIRED if provided: "ages 3-6", "0-12 months"
- Safety emphasis critical: "BPA-free", "no small parts" — ONLY if user specified
- Educational benefits OK if generally accepted: "develops fine motor skills"
- Write from parent perspective
- Avoid absolute safety claims — "meets safety standards" is OK`,
  },
};
```

### Kullanım: `sistemPromptOlustur()` fonksiyonunda

Kategori bilgisi POST body'den gelecek. Kategoriye göre ek kuralları system prompt'a append et:

```typescript
function sistemPromptOlustur(platform: Platform, dil: "tr" | "en", ton?: string, kategoriKodu?: string): string {
  // ... mevcut kod ...

  // Kategori kurallarını ekle
  let kategoriEki = "";
  if (kategoriKodu && KATEGORI_KURALLARI[kategoriKodu]) {
    kategoriEki = `\n\n${KATEGORI_KURALLARI[kategoriKodu][dil]}`;
  }

  // TR pazaryerleri return'ünde:
  return `Sen uzman bir Turk e-ticaret metin yazarisin...
${ICERIK_KURALLARI}${kategoriEki}
${tonTanimi ? `MARKA TONU:\n${tonTanimi}\n` : ""}
...`;
}
```

### Frontend: Kategori → kod eşlemesi

Kullanıcının serbest yazdığı kategori metninden otomatik kategori kodu çıkarmak için basit keyword matching:

```typescript
function kategoriKoduBul(kategoriMetni: string): string | undefined {
  const k = kategoriMetni.toLowerCase();
  if (/kozmetik|parfüm|cilt|bakım|makyaj|serum|krem|şampuan/i.test(k)) return "kozmetik";
  if (/elektron|telefon|bilgisayar|tablet|kulaklık|şarj|kamera|tv|monitör/i.test(k)) return "elektronik";
  if (/giyim|ayakkabı|çanta|elbise|tişört|pantolon|ceket|kazak|gömlek|bot|sneaker/i.test(k)) return "giyim";
  if (/gıda|yiyecek|içecek|kahve|çay|bal|zeytinyağı|baharat|atıştırmalık/i.test(k)) return "gida";
  if (/ev|mutfak|dekor|mobilya|aydınlatma|halı|perde|tencere|bardak/i.test(k)) return "ev";
  if (/spor|fitness|outdoor|kamp|bisiklet|yoga|koşu|dağ/i.test(k)) return "spor";
  if (/çocuk|bebek|oyuncak|mama|biberon|oto koltuk/i.test(k)) return "cocuk";
  return undefined; // bilinmeyen kategori → ek kural eklenmez
}
```

---

## § Yasaklı Kelimeler (PQ-08)

### Dosya: `app/api/uret/route.ts`

Platform bazlı yasaklı kelime listeleri. Prompt'a "Bu kelimeleri ASLA kullanma:" olarak inject edilecek:

```typescript
const YASAKLI_KELIMELER: Record<Platform, string[]> = {
  trendyol: [
    "en iyi", "en ucuz", "en kaliteli", "1 numara", "birinci", "lider",
    "garantili iade", "ücretsiz kargo", "hemen al", "kaçırma", "son fırsat",
    "orijinal ürün" /* yanıltıcı olabilir */, "replika", "A kalite", "süper",
    "mucize", "şifalı", "%100 etkili", "kesin sonuç", "birebir aynı",
    "stoklar tükeniyor" /* manipülatif */, "sadece bugün",
  ],
  hepsiburada: [
    "en iyi", "en ucuz", "1 numara", "birinci", "süper fırsat",
    "replika", "A kalite", "muadil", "şifalı", "tedavi",
    "%100 sonuç", "kesin çözüm", "mucize", "sihirli",
  ],
  amazon: [
    "en iyi", "birinci", "#1", "bestseller" /* Amazon kendi verir */,
    "ücretsiz", "indirimli", "kampanya", "fırsat", "promosyon",
    "replika", "sahte", "taklit", "şifalı", "tedavi eder",
  ],
  n11: [
    "en iyi", "en ucuz", "süper", "harika", "muhteşem",
    "replika", "A kalite", "şifalı", "kesin sonuç", "mucize",
  ],
  etsy: [
    "best", "cheapest", "#1", "guaranteed results", "miracle",
    "cure", "heal", "FDA approved" /* unless true */, "replica",
    "knock-off", "inspired by" /* IP risk */, "dupe",
    "free shipping" /* Etsy handles this */, "sale", "discount",
  ],
  amazon_usa: [
    "best", "#1", "top rated" /* Amazon badge, not seller claim */,
    "cheapest", "guaranteed", "free", "bonus", "limited time",
    "miracle", "cure", "FDA approved", "clinically proven",
    "replica", "knock-off", "authentic" /* risky without proof */,
  ],
};

// Prompt'a ekleme (sistemPromptOlustur içinde):
const yasaklar = YASAKLI_KELIMELER[platform];
const yasakMetni = yasaklar.length > 0
  ? `\n\nYASAKLI KELİMELER — bu ifadeleri KESİNLİKLE KULLANMA:\n${yasaklar.map(k => `- "${k}"`).join("\n")}`
  : "";
// ... return `...${ICERIK_KURALLARI}${kategoriEki}${yasakMetni}...`;
```

---

## § Sekmeler Arası Bilgi Taşıma (PQ-14)

### Yaklaşım: Zustand store

```typescript
// lib/stores/urunOturumu.ts
import { create } from "zustand";

interface UrunOturumu {
  urunAdi: string;
  kategori: string;
  kategoriKodu: string | undefined;
  platform: string;
  fotolar: string[];
  setUrunBilgi: (data: Partial<UrunOturumu>) => void;
  reset: () => void;
}

export const useUrunOturumu = create<UrunOturumu>((set) => ({
  urunAdi: "",
  kategori: "",
  kategoriKodu: undefined,
  platform: "trendyol",
  fotolar: [],
  setUrunBilgi: (data) => set((state) => ({ ...state, ...data })),
  reset: () => set({ urunAdi: "", kategori: "", kategoriKodu: undefined, platform: "trendyol", fotolar: [] }),
}));
```

Metin sekmesinde girilen bilgiler store'a yazılır. Görsel/Video/Sosyal sekmeleri store'dan okur.
Bu sayede kullanıcı metin sekmesinde "Samsung Galaxy S24" + "Elektronik" yazarsa, video sekmesinde otomatik olarak elektronik preset'leri gösterilir ve görsel sekmesinde koyu/gradient stiller öne çıkar.
