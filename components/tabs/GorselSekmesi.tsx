"use client";
import { GORSEL_STILLER, kategoriKoduHesapla } from "@/lib/constants";
import FotoEkleAlani from "@/components/ui/FotoEkleAlani";
import FotoThumbnail from "@/components/ui/FotoThumbnail";

type Kullanici = {
  id: string;
  email: string | null;
  kredi: number;
  toplam_kullanilan: number;
  is_admin: boolean;
  anonim?: boolean;
  marka_adi?: string;
};

interface GorselSekmesiProps {
  aktif: boolean;
  urunAdi: string;
  kategori: string;
  fotolar: string[];
  fotoSec: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fotoKaldir: (i: number) => void;
  gorselEkPrompt: string;
  setGorselEkPrompt: (v: string) => void;
  seciliStiller: Set<string>;
  stilToggle: (id: string) => void;
  gorselYukleniyor: boolean;
  gorselJoblar: { requestId: string; label: string; stil: string }[];
  setGorselJoblar: (fn: (prev: { requestId: string; label: string; stil: string }[]) => { requestId: string; label: string; stil: string }[]) => void;
  referansGorsel: string | null;
  setReferansGorsel: (v: string | null) => void;
  kullanici: Kullanici | null;
  paketModalAc: () => void;
  gorselUret: () => void;
  blobIndir: (blob: Blob, dosyaAdi: string) => void;
  resizeFoto: (base64: string, maxSize?: number) => Promise<string>;
  invalidateCredits: () => void;
  setKullanici: (fn: (k: Kullanici | null) => Kullanici | null) => void;
}

export default function GorselSekmesi({
  aktif,
  urunAdi, kategori,
  fotolar, fotoSec, fotoKaldir,
  gorselEkPrompt, setGorselEkPrompt,
  seciliStiller, stilToggle,
  gorselYukleniyor, gorselJoblar, setGorselJoblar,
  referansGorsel, setReferansGorsel,
  kullanici, paketModalAc, gorselUret,
  blobIndir, resizeFoto, invalidateCredits, setKullanici,
}: GorselSekmesiProps) {
  return (
    <div style={{ display: aktif ? "block" : "none" }} className="mt-4 bg-white rounded-2xl shadow p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-800">🖼️ Ürün Görseli Üret</h2>
        <span className="text-xs text-violet-500 font-medium">Stil başına 1 kredi · 1 stil = 1 görsel</span>
      </div>

      {urunAdi && (
        <div className="bg-violet-50 border border-violet-200 rounded-xl px-3 py-2 flex items-center gap-2">
          <span className="text-violet-400 text-sm">🔗</span>
          <p className="text-xs text-violet-700 flex-1 min-w-0 truncate">
            <span className="font-medium">{urunAdi}</span>
            {kategori && <span className="text-violet-400"> · {kategori}</span>}
          </p>
          <span className="text-xs text-violet-400 whitespace-nowrap">Metin sekmesinden</span>
        </div>
      )}

      {kullanici && !kullanici.anonim && !kullanici.marka_adi && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 flex items-center justify-between gap-3">
          <p className="text-xs text-yellow-700">💡 <span className="font-semibold">Marka profili eksik</span> — Ton bilgisi girilince görsel stili markanla uyumlu hale getirilir.</p>
          <a href="/profil" className="text-xs text-yellow-700 font-semibold underline whitespace-nowrap">Profili doldur →</a>
        </div>
      )}

      <p className="text-xs text-gray-600">
        Tek fotoğraftan 7 farklı stüdyo stili. Seçtiğin her stil için 1 görsel üretilir, kredi üretimde düşer.{" "}
        <span className="text-xs text-gray-400">  <br /> Örnek: 1 stil seçersen → 1 görsel, 1 kredi <br />3 stil seçersen → 3 görsel, 3 kredi</span>
      </p>

      {fotolar.length === 0 ? (
        <FotoEkleAlani id="gorsel-foto-input" onChange={fotoSec} renk="purple" metin="Ürün fotoğrafı yükle" ikon="📷" altMetin="Arka planı kaldırıp 7 farklı stilde stüdyo görseli üretiriz" />
      ) : (
        <FotoThumbnail src={fotolar[0]} onKaldir={() => fotoKaldir(0)} renk="green" />
      )}
      <p className="text-xs text-gray-400">
        📸 En iyi sonuç için nasıl fotoğraf çekilmeli?{" "}
        <a href="/blog/e-ticaret-icin-ai-urun-fotografciligi" target="_blank" className="text-violet-500 hover:underline font-medium">
          Rehberi oku →
        </a>
      </p>

      <div>
        <p className="block text-xs font-medium text-gray-600 mb-2">Stil seç <span className="text-gray-400 font-normal">(1 stil = 1 görsel = 1 kredi)</span></p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(() => {
            const gorselKategoriKodu = kategoriKoduHesapla(kategori);
            const sirali = gorselKategoriKodu
              ? [
                  ...GORSEL_STILLER.filter(s => s.kategoriler.includes(gorselKategoriKodu)),
                  ...GORSEL_STILLER.filter(s => !s.kategoriler.includes(gorselKategoriKodu) && s.kategoriler.length > 0),
                  ...GORSEL_STILLER.filter(s => s.kategoriler.length === 0),
                ]
              : GORSEL_STILLER;
            return sirali.map((s) => (
              <button key={s.id} onClick={() => stilToggle(s.id)}
                className={`flex flex-col rounded-xl overflow-hidden border-2 transition-all text-left ${seciliStiller.has(s.id) ? "border-violet-500 shadow-md" : "border-gray-200 hover:border-violet-300"}`}>
                {s.img ? (
                  <div className="aspect-square w-full overflow-hidden relative bg-gray-50">
                    <img src={s.img} alt={s.label} className="w-full h-full object-contain" />
                    {seciliStiller.has(s.id) && <div className="absolute inset-0 bg-violet-500/20 flex items-center justify-center"><span className="bg-violet-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">✓</span></div>}
                  </div>
                ) : (
                  <div className={`aspect-square w-full flex items-center justify-center text-2xl ${seciliStiller.has(s.id) ? "bg-violet-100" : "bg-gray-50"}`}>{s.id === "ozel" ? "✏️" : "🖼️"}</div>
                )}
                <div className="p-2 bg-white w-full">
                  <p className={`text-xs font-semibold ${seciliStiller.has(s.id) ? "text-violet-600" : "text-gray-700"}`}>{s.label}</p>
                  <p className="text-xs text-gray-400">{s.aciklama}</p>
                </div>
              </button>
            ));
          })()}
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Görsel yönlendirmesi <span className="text-gray-400 font-normal">(isteğe bağlı)</span></label>
        <textarea value={gorselEkPrompt} onChange={(e) => setGorselEkPrompt(e.target.value)} placeholder="Sahneyi tanımla — örn: mermer masa üzerinde yumuşak pencere ışığı, yeşil bitkilerle / rustik ahşap raf, sıcak mum ışığı / pastel pembe gradyan arka plan, uçuşan balonlar" rows={2} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400" />
      </div>

      {seciliStiller.has("referans") && (
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Arka plan fotoğrafı <span className="text-gray-400 font-normal">(ürünü bu arka plana yerleştirelim)</span></label>
          {referansGorsel ? (
            <div className="relative w-32 h-32 rounded-xl overflow-hidden border-2 border-violet-300">
              <img src={referansGorsel} alt="Referans" className="w-full h-full object-cover" />
              <button onClick={() => setReferansGorsel(null)} aria-label="Referans görseli kaldır" className="absolute top-1 right-1 bg-red-500 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center">×</button>
            </div>
          ) : (
            <label className="flex items-center justify-center w-full h-24 border-2 border-dashed border-violet-300 rounded-xl cursor-pointer hover:bg-violet-50 transition-colors">
              <span className="text-sm text-violet-400">🖼️ Arka plan fotoğrafı yükle</span>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => setReferansGorsel(reader.result as string);
                reader.readAsDataURL(file);
              }} />
            </label>
          )}
        </div>
      )}

      <button onClick={gorselUret} disabled={gorselYukleniyor || seciliStiller.size === 0 || fotolar.length === 0}
        className="w-full bg-violet-500 hover:bg-violet-600 disabled:bg-gray-300 text-white font-semibold py-3 rounded-xl transition-colors">
        {gorselYukleniyor
          ? `⏳ ${seciliStiller.size} görsel üretiliyor...`
          : fotolar.length === 0
            ? "Önce fotoğraf ekle ↑"
            : seciliStiller.size === 0
              ? "Stil seç"
              : (!kullanici || kullanici.anonim)
                ? `✨ ${seciliStiller.size} Görsel Üret — Giriş Gerekli`
                : `✨ ${seciliStiller.size} Görsel Üret — ${kullanici.is_admin ? "∞" : seciliStiller.size} kredi`}
      </button>

      {gorselYukleniyor && (
        <p className="text-xs text-violet-600 text-center">Sayfayı kapatmayın — görsel üretimi yaklaşık 1 dakika sürer</p>
      )}

      <p className="text-xs text-gray-400 text-center">⚠️ AI hata yapabilir — üretilen görselleri yayınlamadan önce kontrol edin</p>

      {gorselJoblar.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <p className="text-xs text-gray-500 font-medium">✅ {gorselJoblar.length} görsel hazır</p>
            {gorselJoblar.length > 1 && (
              <button onClick={async () => {
                if (!kullanici) return;
                const res = await fetch("/api/gorsel/download", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ requestIds: gorselJoblar.map(j => j.requestId), userId: kullanici.id }),
                });
                blobIndir(await res.blob(), "yzliste-gorseller.zip");
              }}
                className="flex items-center gap-1.5 text-xs bg-violet-500 hover:bg-violet-600 text-white font-semibold px-3 py-1.5 rounded-lg transition-colors">
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
                  <button onClick={async () => {
                    if (!kullanici) return;
                    const res = await fetch("/api/gorsel/download", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ requestIds: [job.requestId], userId: kullanici.id }),
                    });
                    blobIndir(await res.blob(), `yzliste-${job.stil}.jpg`);
                  }}
                    className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 hover:bg-white text-violet-600 text-xs font-semibold px-2 py-1 rounded-lg shadow">
                    ⬇️ İndir
                  </button>
                </div>
                <div className="flex items-center justify-between px-1">
                  <p className="text-xs text-gray-500 font-medium">{job.label}</p>
                  <button onClick={async () => {
                    if (!kullanici) return;
                    if (!kullanici.is_admin && kullanici.kredi < 1) { paketModalAc(); return; }
                    const resizedFoto = await resizeFoto(fotolar[0]);
                    const res = await fetch("/api/gorsel", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ foto: resizedFoto, stiller: [job.stil], ekPrompt: gorselEkPrompt, userId: kullanici.id, referansGorsel }),
                    });
                    const data = await res.json();
                    if (!data.jobs?.[0]) return;
                    if (!kullanici.is_admin) {
                      setKullanici(k => k ? { ...k, kredi: Math.max(0, k.kredi - 1) } : k);
                      invalidateCredits();
                    }
                    const newJob = data.jobs[0];
                    for (let d = 0; d < 40; d++) {
                      await new Promise(r => setTimeout(r, 4000));
                      const pollRes = await fetch(`/api/gorsel/poll?requestId=${newJob.requestId}`);
                      const pollData = await pollRes.json();
                      if (pollData.status === "COMPLETED") {
                        setGorselJoblar(prev => prev.map(j => j.requestId === job.requestId ? newJob : j));
                        break;
                      }
                      if (pollData.status === "FAILED") {
                        alert(pollData.hata || "Görsel üretilemedi, tekrar deneyin.");
                        break;
                      }
                    }
                  }}
                    className="text-xs text-violet-400 hover:text-violet-600 transition-colors">
                    🔄 Tekrar (1 kr)
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
