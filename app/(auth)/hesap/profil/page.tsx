"use client";
import {
  useState,
  useEffect,
  useCallback,
  useRef,
  useId,
} from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Store, ClipboardList } from "lucide-react";
import { useCredits } from "@/lib/hooks/useCredits";
import StickySaveBar from "@/components/primitives/StickySaveBar";
import Toast, { type ToastMessage } from "@/components/primitives/Toast";
import { ILLER, ILCELER } from "@/lib/data/turkiye-il-ilce";

// ─── Adres: JSON yapısı (profiles.adres kolonuna serialize edilir) ───────────
// Schema notu: profiles.adres TEXT kolonu var. JSON string olarak kaydediyoruz.
// Production'da e-Fatura için ayrı kolonlar (mahalle, cadde_sokak, bina_no,
// daire, posta_kodu, ilce, il) önerilir — migration gerektirir.

interface AdresForm {
  mahalle: string;
  caddeSokak: string;
  binaNo: string;
  daire: string;
  postaKodu: string;
  ilceAd: string;
  ilId: string;
}

const BOSH_ADRES: AdresForm = {
  mahalle: "",
  caddeSokak: "",
  binaNo: "",
  daire: "",
  postaKodu: "",
  ilceAd: "",
  ilId: "",
};

function parseAdres(raw: string | null): AdresForm {
  if (!raw) return BOSH_ADRES;
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && "mahalle" in parsed) {
      return { ...BOSH_ADRES, ...parsed };
    }
  } catch {
    if (process.env.NODE_ENV === "development") {
      console.warn("[profil] Eski adres formatı, yapılandırılmış alanlar boş bırakıldı:", raw);
    }
  }
  return BOSH_ADRES;
}

function serializeAdres(a: AdresForm): string | null {
  const hasAny = Object.values(a).some((v) => v.trim().length > 0);
  if (!hasAny) return null;
  return JSON.stringify(a);
}

// ─── Form tipi ───────────────────────────────────────────────────────────────

interface ProfilForm {
  adSoyad: string;
  telefon: string;
  adres: AdresForm;
  faturaTipi: string;
  tcKimlik: string;
  tcKvkkOnay: boolean;
  vergiNo: string;
  vergiDairesi: string;
}

const BOSH_FORM: ProfilForm = {
  adSoyad: "",
  telefon: "",
  adres: BOSH_ADRES,
  faturaTipi: "bireysel",
  tcKimlik: "",
  tcKvkkOnay: false,
  vergiNo: "",
  vergiDairesi: "",
};

// ─── Dolu alan sayısı — zorunlu alanlar ─────────────────────────────────────
// Zorunlu sayılan: adSoyad, telefon, mahalle, caddeSokak, binaNo, postaKodu, il (7)
const TOPLAM_ALAN = 7;

function countFilled(f: ProfilForm): number {
  return [
    f.adSoyad.trim().length > 0,
    f.telefon.trim().length > 0,
    f.adres.mahalle.trim().length > 0,
    f.adres.caddeSokak.trim().length > 0,
    f.adres.binaNo.trim().length > 0,
    f.adres.postaKodu.trim().length > 0,
    f.adres.ilId.length > 0,
  ].filter(Boolean).length;
}

// ─── Sayfa ───────────────────────────────────────────────────────────────────

export default function HesapProfilPage() {
  const router = useRouter();

  // alan id'leri (a11y)
  const adSoyadId = useId();
  const telefonId = useId();
  const mahalleId = useId();
  const caddeSokakId = useId();
  const binaNoId = useId();
  const daireId = useId();
  const postaKoduId = useId();
  const postaKoduErrorId = useId();
  const ilId = useId();
  const ilceId = useId();
  const tcKimlikId = useId();
  const vergiNoId = useId();
  const vergiDairesiId = useId();

  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [toplamUretim, setToplamUretim] = useState(0);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [kaydediliyor, setKaydediliyor] = useState(false);
  const [form, setForm] = useState<ProfilForm>(BOSH_FORM);
  const [postaKoduHata, setPostaKoduHata] = useState("");
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const originalRef = useRef<string>("");
  const isDirty = JSON.stringify(form) !== originalRef.current;

  const filledCount = countFilled(form);
  const progressPct = Math.round((filledCount / TOPLAM_ALAN) * 100);

  // İlçe listesi — il'e göre filtreli
  const ilceler = form.adres.ilId ? (ILCELER[form.adres.ilId] ?? []) : [];

  // useCredits — PR-02: loading'de "—" göstermek için isLoading kullan
  const { data: kredi, isLoading: krediYukleniyor } = useCredits();

  // ─── Yükleme ─────────────────────────────────────────────────────────────

  const yukle = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/giris");
      return;
    }
    setUserId(user.id);

    const { data } = await supabase
      .from("profiles")
      .select(
        "email, is_admin, ad_soyad, telefon, adres, fatura_tipi, tc_kimlik, vergi_no, vergi_dairesi"
      )
      .eq("id", user.id)
      .single();

    const { count } = await supabase
      .from("uretimler")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    if (data) {
      setEmail(data.email ?? "");
      setIsAdmin(!!data.is_admin);
      setToplamUretim(count ?? 0);

      const loaded: ProfilForm = {
        adSoyad: data.ad_soyad ?? "",
        telefon: data.telefon ?? "",
        adres: parseAdres(data.adres),
        faturaTipi: data.fatura_tipi ?? "bireysel",
        tcKimlik: data.tc_kimlik ?? "",
        tcKvkkOnay: !!data.tc_kimlik,
        vergiNo: data.vergi_no ?? "",
        vergiDairesi: data.vergi_dairesi ?? "",
      };
      setForm(loaded);
      originalRef.current = JSON.stringify(loaded);
    } else {
      originalRef.current = JSON.stringify(BOSH_FORM);
    }
    setYukleniyor(false);
  }, [router]);

  useEffect(() => {
    yukle();
  }, [yukle]);

  // ─── beforeunload ────────────────────────────────────────────────────────

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

  // ─── Posta kodu validation ────────────────────────────────────────────────

  const validatePostaKodu = (val: string) => {
    if (val && !/^\d{5}$/.test(val)) {
      setPostaKoduHata("Posta kodu 5 haneli rakam olmalı");
    } else {
      setPostaKoduHata("");
    }
  };

  // ─── Kaydet ──────────────────────────────────────────────────────────────

  const kaydet = async () => {
    if (!userId) return;
    if (form.tcKimlik && !form.tcKvkkOnay) {
      setToast({
        id: Date.now().toString(),
        type: "error",
        message: "TC Kimlik No kaydetmek için KVKK onay kutusunu işaretleyin.",
      });
      return;
    }
    if (postaKoduHata) {
      setToast({ id: Date.now().toString(), type: "error", message: "Posta kodu hatalı." });
      return;
    }

    setKaydediliyor(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        ad_soyad: form.adSoyad || null,
        telefon: form.telefon || null,
        adres: serializeAdres(form.adres),
        fatura_tipi: form.faturaTipi,
        tc_kimlik: form.tcKimlik || null,
        vergi_no: form.vergiNo || null,
        vergi_dairesi: form.vergiDairesi || null,
      })
      .eq("id", userId);

    if (error) {
      setToast({ id: Date.now().toString(), type: "error", message: "Kaydedilemedi: " + error.message });
    } else {
      originalRef.current = JSON.stringify(form);
      setToast({ id: Date.now().toString(), type: "success", message: "Profilin kaydedildi." });
    }
    setKaydediliyor(false);
  };

  // ─── İptal ───────────────────────────────────────────────────────────────

  const iptalEt = () => {
    if (isDirty && !confirm("Kaydedilmemiş değişiklikler kaybolacak. Devam?")) return;
    setForm(JSON.parse(originalRef.current) as ProfilForm);
    setPostaKoduHata("");
  };

  // ─── Helpers ─────────────────────────────────────────────────────────────

  const setAdresField = <K extends keyof AdresForm>(key: K, value: AdresForm[K]) => {
    setForm((f) => ({ ...f, adres: { ...f.adres, [key]: value } }));
  };

  // ─── Yükleniyor ──────────────────────────────────────────────────────────

  if (yukleniyor) {
    return (
      <div className="min-h-screen bg-rd-neutral-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-rd-neutral-300 border-t-rd-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  // ─── Progress bar rengi ──────────────────────────────────────────────────

  const progressColor =
    progressPct === 100
      ? "bg-rd-success-700"
      : progressPct >= 50
      ? "bg-rd-primary-500"
      : "bg-rd-neutral-300";

  // ─── KPI: kredi gösterimi (PR-02 bug fix) ────────────────────────────────
  // Admin = gerçek ∞ (intentional), loading = "—", yüklendi = sayı
  const krediGoster = isAdmin
    ? "∞"
    : krediYukleniyor
    ? "—"
    : (kredi ?? 0).toString();

  // ─── Render ──────────────────────────────────────────────────────────────

  const inputCls =
    "w-full border border-rd-neutral-300 rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-rd-primary-500/30 focus:border-rd-primary-500 transition-colors";

  const selectCls =
    "w-full border border-rd-neutral-300 rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-rd-primary-500/30 focus:border-rd-primary-500 transition-colors";

  return (
    <main className="min-h-screen bg-rd-neutral-50 pb-32">
      <div className="max-w-3xl mx-auto px-4 py-8">

        {/* Geri */}
        <Link
          href="/hesap"
          className="inline-flex items-center gap-1 text-sm text-rd-neutral-500 hover:text-rd-neutral-800 transition-colors mb-6"
        >
          <ChevronLeft size={15} />
          Hesap
        </Link>

        {/* Başlık */}
        <div className="mb-6">
          <p className="text-[10px] uppercase tracking-[0.15em] font-medium text-rd-primary-700 mb-1">
            Profil
          </p>
          <h1 className="font-[family-name:var(--font-rd-display)] text-3xl md:text-4xl font-bold text-rd-neutral-900 leading-tight tracking-tight mb-2">
            Kişisel ve fatura bilgilerin
          </h1>
          <p className="text-rd-neutral-600 text-sm mb-2">
            {email}
          </p>
          <p className="text-xs text-rd-neutral-500">
            Bu bilgiler fatura kesimi ve KVKK uyumu için saklanır. Doldurmasan da çoğu üretim çalışır.
          </p>
        </div>

        {/* KPI rozetleri — PR-02: tıklanabilir, "∞" bug fix */}
        <div className="flex flex-wrap gap-3 mb-6">
          <Link
            href="/kredi-yukle"
            className="flex items-center gap-2 bg-rd-primary-50 hover:bg-rd-primary-100 border border-rd-primary-200 rounded-xl px-4 py-2.5 transition-colors group"
          >
            <div className="text-center">
              <div
                className={`text-xl font-medium ${
                  isAdmin ? "text-rd-neutral-500" : "text-rd-primary-700"
                } ${krediYukleniyor ? "opacity-40" : ""}`}
              >
                {krediGoster}
              </div>
              <div className="text-xs text-rd-neutral-500">Kalan kredi</div>
            </div>
            <ChevronRight size={14} className="text-rd-neutral-400 group-hover:text-rd-primary-600 transition-colors" />
          </Link>

          <div className="bg-rd-neutral-100 border border-rd-neutral-200 rounded-xl px-4 py-2.5">
            <div className="text-xl font-medium text-rd-neutral-700">{toplamUretim}</div>
            <div className="text-xs text-rd-neutral-500">Toplam üretim</div>
          </div>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-3 mb-8">
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

        {/* ── Grup 1: Kişisel bilgiler ─────────────────────────────────── */}
        <section aria-labelledby="kisisel-baslik" className="space-y-4 mb-8">
          <h2
            id="kisisel-baslik"
            className="text-[10px] uppercase tracking-[0.15em] font-medium text-rd-neutral-400"
          >
            Kişisel bilgiler
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor={adSoyadId} className="block text-sm font-medium text-rd-neutral-900 mb-1.5">
                Ad soyad
              </label>
              <input
                id={adSoyadId}
                type="text"
                value={form.adSoyad}
                onChange={(e) => setForm((f) => ({ ...f, adSoyad: e.target.value }))}
                placeholder="Ad Soyad"
                className={inputCls}
              />
            </div>
            <div>
              <label htmlFor={telefonId} className="block text-sm font-medium text-rd-neutral-900 mb-1.5">
                Telefon
              </label>
              <input
                id={telefonId}
                type="tel"
                value={form.telefon}
                onChange={(e) => setForm((f) => ({ ...f, telefon: e.target.value }))}
                placeholder="05xx xxx xx xx"
                className={inputCls}
              />
            </div>
          </div>
        </section>

        {/* ── Grup 2: Adres bilgileri ───────────────────────────────────── */}
        <section aria-labelledby="adres-baslik" className="space-y-4 mb-8">
          <div className="mb-1">
            <h2
              id="adres-baslik"
              className="text-[10px] uppercase tracking-[0.15em] font-medium text-rd-neutral-400"
            >
              Adres bilgileri
            </h2>
            <p className="text-xs text-rd-neutral-500 mt-0.5">
              Faturalandırma için gerekli. KVKK uyumlu olarak saklanır.
            </p>
          </div>

          {/* Mahalle */}
          <div>
            <label htmlFor={mahalleId} className="block text-sm font-medium text-rd-neutral-900 mb-1.5">
              Mahalle
            </label>
            <input
              id={mahalleId}
              type="text"
              value={form.adres.mahalle}
              onChange={(e) => setAdresField("mahalle", e.target.value)}
              placeholder="Mahalle adı"
              maxLength={100}
              className={inputCls}
            />
          </div>

          {/* Cadde / Sokak */}
          <div>
            <label htmlFor={caddeSokakId} className="block text-sm font-medium text-rd-neutral-900 mb-1.5">
              Cadde / Sokak
            </label>
            <input
              id={caddeSokakId}
              type="text"
              value={form.adres.caddeSokak}
              onChange={(e) => setAdresField("caddeSokak", e.target.value)}
              placeholder="Cadde veya sokak adı"
              maxLength={100}
              className={inputCls}
            />
          </div>

          {/* Bina No + Daire */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label htmlFor={binaNoId} className="block text-sm font-medium text-rd-neutral-900 mb-1.5">
                Bina no
              </label>
              <input
                id={binaNoId}
                type="text"
                value={form.adres.binaNo}
                onChange={(e) => setAdresField("binaNo", e.target.value)}
                placeholder="No"
                maxLength={10}
                className={inputCls}
              />
            </div>
            <div>
              <label htmlFor={daireId} className="block text-sm font-medium text-rd-neutral-900 mb-1.5">
                Daire{" "}
                <span className="text-rd-neutral-400 font-normal">(opt.)</span>
              </label>
              <input
                id={daireId}
                type="text"
                value={form.adres.daire}
                onChange={(e) => setAdresField("daire", e.target.value)}
                placeholder="No"
                maxLength={10}
                className={inputCls}
              />
            </div>

            {/* Posta kodu */}
            <div className="col-span-2">
              <label htmlFor={postaKoduId} className="block text-sm font-medium text-rd-neutral-900 mb-1.5">
                Posta kodu
              </label>
              <input
                id={postaKoduId}
                type="text"
                inputMode="numeric"
                value={form.adres.postaKodu}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, "").slice(0, 5);
                  setAdresField("postaKodu", v);
                  validatePostaKodu(v);
                }}
                placeholder="34000"
                maxLength={5}
                aria-invalid={!!postaKoduHata}
                aria-describedby={postaKoduHata ? postaKoduErrorId : undefined}
                className={`${inputCls} ${postaKoduHata ? "border-rd-danger-600 focus:border-rd-danger-600 focus:ring-rd-danger-600/20" : ""}`}
              />
              {postaKoduHata && (
                <p id={postaKoduErrorId} className="mt-1 text-xs text-rd-danger-700">
                  {postaKoduHata}
                </p>
              )}
            </div>
          </div>

          {/* İl + İlçe */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor={ilId} className="block text-sm font-medium text-rd-neutral-900 mb-1.5">
                İl
              </label>
              <select
                id={ilId}
                aria-label="İl seç"
                value={form.adres.ilId}
                onChange={(e) => {
                  setAdresField("ilId", e.target.value);
                  setAdresField("ilceAd", ""); // il değişince ilçe sıfırla
                }}
                className={selectCls}
              >
                <option value="">İl seçin</option>
                {ILLER.map((il) => (
                  <option key={il.id} value={il.id}>
                    {il.ad}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor={ilceId} className="block text-sm font-medium text-rd-neutral-900 mb-1.5">
                İlçe{" "}
                <span className="text-rd-neutral-400 font-normal">(opt.)</span>
              </label>
              <select
                id={ilceId}
                aria-label="İlçe seç"
                aria-disabled={!form.adres.ilId}
                disabled={!form.adres.ilId}
                value={form.adres.ilceAd}
                onChange={(e) => setAdresField("ilceAd", e.target.value)}
                className={`${selectCls} ${!form.adres.ilId ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <option value="">
                  {form.adres.ilId ? "İlçe seçin" : "Önce il seçin"}
                </option>
                {ilceler.map((ilce) => (
                  <option key={ilce} value={ilce}>
                    {ilce}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* ── Grup 3: Fatura bilgileri ──────────────────────────────────── */}
        <section aria-labelledby="fatura-baslik" className="space-y-4 mb-8">
          <h2
            id="fatura-baslik"
            className="text-[10px] uppercase tracking-[0.15em] font-medium text-rd-neutral-400"
          >
            Fatura bilgileri
          </h2>

          {/* Fatura tipi */}
          <div>
            <p className="text-sm font-medium text-rd-neutral-900 mb-2">Fatura tipi</p>
            <div className="flex gap-3">
              {["bireysel", "kurumsal"].map((tip) => (
                <button
                  key={tip}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, faturaTipi: tip }))}
                  aria-pressed={form.faturaTipi === tip}
                  className={[
                    "flex-1 py-2.5 rounded-lg text-sm border-2 transition-all",
                    form.faturaTipi === tip
                      ? "border-rd-primary-700 bg-rd-primary-50 text-rd-primary-700 font-medium"
                      : "border-rd-neutral-300 text-rd-neutral-700 hover:border-rd-primary-400",
                  ].join(" ")}
                >
                  {tip === "bireysel" ? "Bireysel" : "Kurumsal"}
                </button>
              ))}
            </div>
          </div>

          {form.faturaTipi === "bireysel" ? (
            <div>
              <label htmlFor={tcKimlikId} className="block text-sm font-medium text-rd-neutral-900 mb-1.5">
                TC kimlik no{" "}
                <span className="text-rd-neutral-400 font-normal">(isteğe bağlı)</span>
              </label>
              <input
                id={tcKimlikId}
                type="text"
                inputMode="numeric"
                value={form.tcKimlik}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    tcKimlik: e.target.value.replace(/\D/g, "").slice(0, 11),
                  }))
                }
                placeholder="11 haneli TC kimlik no"
                maxLength={11}
                className={inputCls}
              />
              {form.tcKimlik && (
                <label className="flex items-start gap-2 mt-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.tcKvkkOnay}
                    onChange={(e) => setForm((f) => ({ ...f, tcKvkkOnay: e.target.checked }))}
                    className="mt-0.5 shrink-0 accent-rd-primary-700"
                  />
                  <span className="text-xs text-rd-neutral-600 leading-snug">
                    TC kimlik numaramın yalnızca e-Arşiv fatura düzenlenmesi amacıyla işlenmesine onay veriyorum.{" "}
                    <Link href="/kvkk-aydinlatma" target="_blank" className="text-rd-primary-700 hover:underline">
                      KVKK aydınlatma metni
                    </Link>
                  </span>
                </label>
              )}
              <p className="text-xs text-rd-neutral-400 mt-1">
                TC kimlik numaranız yalnızca e-Arşiv fatura için kullanılır.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor={vergiNoId} className="block text-sm font-medium text-rd-neutral-900 mb-1.5">
                  Vergi no
                </label>
                <input
                  id={vergiNoId}
                  type="text"
                  inputMode="numeric"
                  value={form.vergiNo}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      vergiNo: e.target.value.replace(/\D/g, "").slice(0, 10),
                    }))
                  }
                  placeholder="10 haneli vergi no"
                  maxLength={10}
                  className={inputCls}
                />
              </div>
              <div>
                <label htmlFor={vergiDairesiId} className="block text-sm font-medium text-rd-neutral-900 mb-1.5">
                  Vergi dairesi
                </label>
                <input
                  id={vergiDairesiId}
                  type="text"
                  value={form.vergiDairesi}
                  onChange={(e) => setForm((f) => ({ ...f, vergiDairesi: e.target.value }))}
                  placeholder="Vergi dairesi adı"
                  className={inputCls}
                />
              </div>
            </div>
          )}
        </section>

        {/* ── Grup 4: Hızlı linkler ─────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/hesap/marka"
            className="bg-white rounded-xl border border-rd-neutral-200 p-4 hover:border-rd-primary-400 transition-all group text-center"
          >
            <div className="flex justify-center mb-2">
              <Store size={22} strokeWidth={1.5} className="text-rd-neutral-400 group-hover:text-rd-primary-700" />
            </div>
            <p className="text-sm font-medium text-rd-neutral-900 group-hover:text-rd-primary-700">
              Marka profili
            </p>
            <p className="text-xs text-rd-neutral-500 mt-0.5">Ton, hedef kitle</p>
          </Link>
          <Link
            href="/hesap/uretimler"
            className="bg-white rounded-xl border border-rd-neutral-200 p-4 hover:border-rd-primary-400 transition-all group text-center"
          >
            <div className="flex justify-center mb-2">
              <ClipboardList size={22} strokeWidth={1.5} className="text-rd-neutral-400 group-hover:text-rd-primary-700" />
            </div>
            <p className="text-sm font-medium text-rd-neutral-900 group-hover:text-rd-primary-700">
              Üretimler
            </p>
            <p className="text-xs text-rd-neutral-500 mt-0.5">{toplamUretim} üretim</p>
          </Link>
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
        saveLabel="Profilini kaydet"
      />

      {/* Toast */}
      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </main>
  );
}
