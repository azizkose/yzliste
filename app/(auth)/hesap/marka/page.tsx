"use client";
import {
  useState,
  useEffect,
  useCallback,
  useRef,
  startTransition,
  useId,
} from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronDown, Info, Heart, Briefcase, Crown } from "lucide-react";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import ChipSelector from "@/components/primitives/ChipSelector";
import BrandPreviewPanel from "@/components/marka/BrandPreviewPanel";
import StickySaveBar from "@/components/marka/StickySaveBar";
import Toast, { type ToastMessage } from "@/components/primitives/Toast";
import { TON_ACIKLAMALARI, type PreviewTone } from "@/lib/markaPreviewTemplates";

// ─── Sabit listeler ──────────────────────────────────────────────────────────

const KATEGORI_SECENEKLERI = [
  { id: "Ev & Yaşam", label: "Ev & Yaşam" },
  { id: "Moda", label: "Moda" },
  { id: "Elektronik", label: "Elektronik" },
  { id: "Kozmetik", label: "Kozmetik" },
  { id: "Yemek & İçecek", label: "Yemek & İçecek" },
  { id: "Bebek & Çocuk", label: "Bebek & Çocuk" },
  { id: "Spor & Outdoor", label: "Spor & Outdoor" },
  { id: "Hobi & Sanat", label: "Hobi & Sanat" },
  { id: "Diğer", label: "Diğer" },
];

const FIYAT_BANDI_SECENEKLERI = [
  { id: "ekonomik", label: "Ekonomik", description: "0 – 100 TL" },
  { id: "orta", label: "Orta segment", description: "100 – 500 TL" },
  { id: "premium", label: "Premium", description: "500 – 2000 TL" },
  { id: "luks", label: "Lüks", description: "2000 TL+" },
];

const HIZMET_SECENEKLERI = [
  { id: "Hızlı kargo", label: "Hızlı kargo" },
  { id: "Ücretsiz iade", label: "Ücretsiz iade" },
  { id: "Kapıda ödeme", label: "Kapıda ödeme" },
  { id: "Hediye paketi", label: "Hediye paketi" },
  { id: "Garanti", label: "Garanti" },
  { id: "Stüdyo fotoğraf", label: "Stüdyo fotoğraf" },
];

const TON_SECENEKLERI = [
  { id: "samimi", label: "Samimi", icon: <Heart size={14} /> },
  { id: "profesyonel", label: "Profesyonel", icon: <Briefcase size={14} /> },
  { id: "premium", label: "Premium", icon: <Crown size={14} /> },
];

const TOPLAM_ALAN = 8;

// ─── Form tipi ───────────────────────────────────────────────────────────────

interface MarkaForm {
  markaAdi: string;
  ton: PreviewTone;
  hedefKitle: string;
  vurgulananlar: string;
  magazaKategorileri: string[];
  fiyatBandi: string;
  hizmetVurgulari: string[];
  extraInfo: string;
}

const BOSH_FORM: MarkaForm = {
  markaAdi: "",
  ton: "samimi",
  hedefKitle: "",
  vurgulananlar: "",
  magazaKategorileri: [],
  fiyatBandi: "",
  hizmetVurgulari: [],
  extraInfo: "",
};

// ─── Yardımcı: dolu alan sayısı ──────────────────────────────────────────────

function countFilled(f: MarkaForm): number {
  return [
    f.markaAdi.trim().length > 0,
    f.ton.length > 0,
    f.hedefKitle.trim().length > 0,
    f.vurgulananlar.trim().length > 0,
    f.magazaKategorileri.length > 0,
    f.fiyatBandi.length > 0,
    f.hizmetVurgulari.length > 0,
    f.extraInfo.trim().length > 0,
  ].filter(Boolean).length;
}

// ─── Sayfa bileşeni ──────────────────────────────────────────────────────────

export default function HesapMarkaPage() {
  const router = useRouter();
  const { data: currentUser, isLoading: authLoading } = useCurrentUser();
  const markaAdiId = useId();
  const hedefKitleId = useId();
  const vurgulananlarId = useId();
  const extraInfoId = useId();

  const [yukleniyor, setYukleniyor] = useState(true);
  const [kaydediliyor, setKaydediliyor] = useState(false);
  const [form, setForm] = useState<MarkaForm>(BOSH_FORM);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [bannerAcik, setBannerAcik] = useState(false);

  const originalRef = useRef<string>("");
  const isDirty = JSON.stringify(form) !== originalRef.current;

  const filledCount = countFilled(form);
  const progressPct = Math.round((filledCount / TOPLAM_ALAN) * 100);

  // ─── Yükleme ───────────────────────────────────────────────────────────────

  const yukle = useCallback(async (uid: string) => {
    const { data } = await supabase
      .from("profiles")
      .select(
        "marka_adi, ton, hedef_kitle, vurgulanan_ozellikler, magaza_kategorileri, fiyat_bandi, teslimat_vurgulari, benchmark_magaza"
      )
      .eq("id", uid)
      .single();

    if (data) {
      const loaded: MarkaForm = {
        markaAdi: data.marka_adi || "",
        ton: (data.ton as PreviewTone) || "samimi",
        hedefKitle: data.hedef_kitle || "",
        vurgulananlar: data.vurgulanan_ozellikler || "",
        magazaKategorileri: data.magaza_kategorileri || [],
        fiyatBandi: data.fiyat_bandi || "",
        hizmetVurgulari: data.teslimat_vurgulari || [],
        extraInfo: data.benchmark_magaza || "",
      };
      setForm(loaded);
      originalRef.current = JSON.stringify(loaded);
    } else {
      originalRef.current = JSON.stringify(BOSH_FORM);
    }
    setYukleniyor(false);
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!currentUser) { router.push("/giris"); return; }
    startTransition(() => { yukle(currentUser.id); });
  }, [authLoading, currentUser, yukle, router]);

  // ─── beforeunload ──────────────────────────────────────────────────────────

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  // ─── Kaydet ────────────────────────────────────────────────────────────────

  const kaydet = async () => {
    const userId = currentUser?.id;
    if (!userId) return;
    setKaydediliyor(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        marka_adi: form.markaAdi || null,
        ton: form.ton,
        hedef_kitle: form.hedefKitle || null,
        vurgulanan_ozellikler: form.vurgulananlar || null,
        magaza_kategorileri:
          form.magazaKategorileri.length > 0 ? form.magazaKategorileri : null,
        fiyat_bandi: form.fiyatBandi || null,
        teslimat_vurgulari:
          form.hizmetVurgulari.length > 0 ? form.hizmetVurgulari : null,
        benchmark_magaza: form.extraInfo || null,
      })
      .eq("id", userId);

    if (error) {
      setToast({ id: Date.now().toString(), type: "error", message: "Kaydedilemedi: " + error.message });
    } else {
      originalRef.current = JSON.stringify(form);
      setToast({ id: Date.now().toString(), type: "success", message: "Marka profili kaydedildi." });
    }
    setKaydediliyor(false);
  };

  // ─── İptal ────────────────────────────────────────────────────────────────

  const iptalEt = () => {
    if (isDirty) {
      if (!confirm("Kaydedilmemiş değişiklikler kaybolacak. Devam?")) return;
    }
    setForm(JSON.parse(originalRef.current) as MarkaForm);
  };

  // ─── Yükleniyor ────────────────────────────────────────────────────────────

  if (authLoading || yukleniyor) {
    return (
      <div className="min-h-screen bg-rd-neutral-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-rd-neutral-300 border-t-rd-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  // ─── Progress bar rengi ─────────────────────────────────────────────────────

  const progressColor =
    progressPct === 100
      ? "bg-rd-success-700"
      : progressPct >= 50
      ? "bg-rd-primary-500"
      : "bg-rd-neutral-300";

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <main className="min-h-screen bg-rd-neutral-50 pb-32">
      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Geri */}
        <Link
          href="/hesap"
          className="inline-flex items-center gap-1 text-sm text-rd-neutral-500 hover:text-rd-neutral-800 transition-colors mb-6"
        >
          <ChevronLeft size={15} />
          Hesap
        </Link>

        {/* Başlık + Progress */}
        <div className="mb-6">
          <p className="text-[10px] uppercase tracking-[0.15em] font-medium text-rd-primary-700 mb-1">
            Marka profili
          </p>
          <h1 className="font-[family-name:var(--font-rd-display)] text-3xl md:text-4xl font-bold text-rd-neutral-900 leading-tight tracking-tight mb-2">
            Markanı tanıt, AI sana özel yazsın
          </h1>
          <p className="text-rd-neutral-600 text-sm mb-4">
            Doldurdukça sağdaki örnekte canlı görüyorsun. AI gerçek üretimde marka bilgilerini kullanır.
          </p>

          {/* Progress */}
          <div className="flex items-center gap-3">
            <div
              role="progressbar"
              aria-valuenow={filledCount}
              aria-valuemin={0}
              aria-valuemax={TOPLAM_ALAN}
              aria-label="Profil doluluk oranı"
              className="flex-1 h-1.5 bg-rd-neutral-200 rounded-full overflow-hidden"
            >
              <div
                className={`h-full rounded-full transition-all duration-300 ${progressColor}`}
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <span className="text-xs text-rd-neutral-500 shrink-0">
              {filledCount} / {TOPLAM_ALAN}
            </span>
          </div>
        </div>

        {/* Bilgi banner */}
        <div className="mb-6 bg-rd-primary-50 border border-rd-primary-200 rounded-lg px-4 py-2.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Info size={14} className="text-rd-primary-700 shrink-0" />
              <p className="text-sm text-rd-primary-800">
                Marka profili AI metinlerini kişiselleştirir.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setBannerAcik((v) => !v)}
              className="flex items-center gap-1 text-xs text-rd-primary-700 hover:text-rd-primary-900 transition-colors whitespace-nowrap"
            >
              Örnek göster
              <ChevronDown
                size={13}
                className={`transition-transform ${bannerAcik ? "rotate-180" : ""}`}
              />
            </button>
          </div>

          {bannerAcik && (
            <div className="mt-3 pt-3 border-t border-rd-primary-200 grid sm:grid-cols-2 gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.12em] text-rd-primary-600 mb-1">Profil olmadan</p>
                <p className="text-xs text-rd-neutral-700 leading-relaxed">
                  &quot;Porselen fincan, 6&apos;lı set, beyaz, 250ml.&quot;
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.12em] text-rd-primary-700 mb-1">Profil ile</p>
                <p className="text-xs text-rd-neutral-700 leading-relaxed">
                  &quot;Sabahlarını özelleştir — el yapımı porselen fincan setiyle güne sıcak bir başlangıç yap.&quot;
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 2-kolon layout */}
        <div className="grid lg:grid-cols-[1fr_400px] gap-8">

          {/* Sol: Form */}
          <div className="space-y-6">

            {/* 1. Mağaza adı */}
            <div>
              <label htmlFor={markaAdiId} className="block text-sm font-medium text-rd-neutral-900 mb-1.5">
                Mağaza / marka adı
              </label>
              <input
                id={markaAdiId}
                type="text"
                value={form.markaAdi}
                onChange={(e) => setForm((f) => ({ ...f, markaAdi: e.target.value }))}
                placeholder="örn: Selin Porselen, TechStore TR"
                className="w-full border border-rd-neutral-300 rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-rd-primary-500/30 focus:border-rd-primary-500 transition-colors"
              />
            </div>

            {/* 2. Ton */}
            <div>
              <p className="text-sm font-medium text-rd-neutral-900 mb-2">Metin tonu</p>
              <ChipSelector
                mode="single"
                options={TON_SECENEKLERI}
                value={form.ton}
                onChange={(v) => setForm((f) => ({ ...f, ton: v as PreviewTone }))}
                label="Metin tonu seç"
              />
              <p className="text-xs text-rd-neutral-500 mt-2">
                {TON_ACIKLAMALARI[form.ton]}
              </p>
            </div>

            {/* 3. Hedef kitle */}
            <div>
              <label htmlFor={hedefKitleId} className="block text-sm font-medium text-rd-neutral-900 mb-1.5">
                Hedef kitle{" "}
                <span className="text-rd-neutral-400 font-normal">(isteğe bağlı)</span>
              </label>
              <input
                id={hedefKitleId}
                type="text"
                value={form.hedefKitle}
                onChange={(e) => setForm((f) => ({ ...f, hedefKitle: e.target.value }))}
                placeholder="örn: 25-40 yaş ev hanımları, mobilya meraklıları"
                className="w-full border border-rd-neutral-300 rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-rd-primary-500/30 focus:border-rd-primary-500 transition-colors"
              />
            </div>

            {/* 4. Özellikler */}
            <div>
              <label htmlFor={vurgulananlarId} className="block text-sm font-medium text-rd-neutral-900 mb-1.5">
                Öne çıkarmak istediğin özellikler{" "}
                <span className="text-rd-neutral-400 font-normal">(isteğe bağlı)</span>
              </label>
              <textarea
                id={vurgulananlarId}
                value={form.vurgulananlar}
                onChange={(e) => setForm((f) => ({ ...f, vurgulananlar: e.target.value }))}
                placeholder="örn: altın yaldız, el yapımı, porselen, özel ambalaj"
                rows={2}
                className="w-full border border-rd-neutral-300 rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-rd-primary-500/30 focus:border-rd-primary-500 transition-colors resize-none"
              />
            </div>

            <div className="border-t border-rd-neutral-200 pt-6 space-y-6">
              <p className="text-[10px] uppercase tracking-[0.15em] font-medium text-rd-neutral-400">
                Ek bilgiler
              </p>

              {/* 5. Mağaza kategorileri */}
              <div>
                <p className="text-sm font-medium text-rd-neutral-900 mb-2">
                  Mağaza kategorileri{" "}
                  <span className="text-rd-neutral-400 font-normal text-xs">(max 3)</span>
                </p>
                <ChipSelector
                  mode="multi"
                  options={KATEGORI_SECENEKLERI}
                  value={form.magazaKategorileri}
                  onChange={(v) => setForm((f) => ({ ...f, magazaKategorileri: v }))}
                  label="Mağaza kategorileri"
                  max={3}
                />
              </div>

              {/* 6. Fiyat bandı */}
              <div>
                <p className="text-sm font-medium text-rd-neutral-900 mb-2">Fiyat bandı</p>
                <ChipSelector
                  mode="single"
                  options={FIYAT_BANDI_SECENEKLERI.map((b) => ({
                    id: b.id,
                    label: b.label,
                    description: b.description,
                  }))}
                  value={form.fiyatBandi}
                  onChange={(v) =>
                    setForm((f) => ({ ...f, fiyatBandi: f.fiyatBandi === v ? "" : v }))
                  }
                  label="Fiyat bandı"
                />
              </div>

              {/* 7. Hizmet vurguları */}
              <div>
                <p className="text-sm font-medium text-rd-neutral-900 mb-2">Hizmet vurguları</p>
                <ChipSelector
                  mode="multi"
                  options={HIZMET_SECENEKLERI}
                  value={form.hizmetVurgulari}
                  onChange={(v) => setForm((f) => ({ ...f, hizmetVurgulari: v }))}
                  label="Hizmet vurguları"
                />
              </div>

              {/* 8. Ekstra bilgi */}
              <div>
                <label htmlFor={extraInfoId} className="block text-sm font-medium text-rd-neutral-900 mb-1.5">
                  Eklemek istediğin başka bilgi{" "}
                  <span className="text-rd-neutral-400 font-normal">(isteğe bağlı)</span>
                </label>
                <textarea
                  id={extraInfoId}
                  value={form.extraInfo}
                  onChange={(e) => setForm((f) => ({ ...f, extraInfo: e.target.value }))}
                  placeholder="Referans mağaza, özel kitle, sezon notu..."
                  rows={2}
                  className="w-full border border-rd-neutral-300 rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-rd-primary-500/30 focus:border-rd-primary-500 transition-colors resize-none"
                />
              </div>
            </div>
          </div>

          {/* Sağ: Canlı önizleme */}
          <BrandPreviewPanel
            tone={form.ton}
            storeName={form.markaAdi}
            ozellik={form.vurgulananlar}
            kategori={form.magazaKategorileri[0] || ""}
            collapsibleOnMobile
          />
        </div>
      </div>

      {/* Sticky save bar */}
      <StickySaveBar
        filledCount={filledCount}
        totalCount={TOPLAM_ALAN}
        isDirty={isDirty}
        isSaving={kaydediliyor}
        onSave={kaydet}
        onCancel={iptalEt}
      />

      {/* Toast */}
      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </main>
  );
}
