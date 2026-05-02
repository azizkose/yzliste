'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useCurrentUser } from '@/lib/hooks/useCurrentUser'
import {
  ChevronLeft,
  Info,
  Receipt,
  Download,
  Mail,
  AlertCircle,
  ChevronRight,
  Loader2,
  RefreshCw,
} from 'lucide-react'
import StatusBadge, { type StatusType } from '@/components/primitives/StatusBadge'
import Toast, { type ToastMessage } from '@/components/primitives/Toast'
import { FATURALAR_DEMO } from '@/lib/feature-flags'

// ─── Tipler ──────────────────────────────────────────────────────────────────

interface Fatura {
  id: string
  paket: string
  tutar: number
  tarih: string           // ISO string
  yil: number
  status: StatusType
  parasutFaturaId: string | null
  faturaEmailGonderildi: boolean
  tahminiHazirTarih?: string
  errorReason?: string
}

// ─── Paket isimleri ───────────────────────────────────────────────────────────

const PAKET_ISIM: Record<string, string> = {
  baslangic: 'Başlangıç Paketi — 10 Kredi',
  populer: 'Popüler Paket — 30 Kredi',
  buyuk: 'Büyük Paket — 100 Kredi',
}

// ─── Status derivasyonu (gerçek Supabase verisi için) ────────────────────────

function deriveStatus(
  parasutFaturaId: string | null,
  faturaEmailGonderildi: boolean
): StatusType {
  if (!parasutFaturaId) return 'preparing'
  if (faturaEmailGonderildi) return 'sent'
  return 'ready'
}

// ─── Mock data (FF.FATURALAR_DEMO = true) ────────────────────────────────────

const MOCK_FATURALAR: Fatura[] = [
  {
    id: 'mock-1',
    paket: 'populer',
    tutar: 129,
    tarih: '2026-04-01T10:00:00Z',
    yil: 2026,
    status: 'sent',
    parasutFaturaId: 'parasut-001',
    faturaEmailGonderildi: true,
  },
  {
    id: 'mock-2',
    paket: 'baslangic',
    tutar: 49,
    tarih: '2026-03-15T14:30:00Z',
    yil: 2026,
    status: 'ready',
    parasutFaturaId: 'parasut-002',
    faturaEmailGonderildi: false,
  },
  {
    id: 'mock-3',
    paket: 'buyuk',
    tutar: 299,
    tarih: '2026-02-20T09:15:00Z',
    yil: 2026,
    status: 'preparing',
    parasutFaturaId: null,
    faturaEmailGonderildi: false,
    tahminiHazirTarih: '2026-04-30',
  },
  {
    id: 'mock-4',
    paket: 'baslangic',
    tutar: 49,
    tarih: '2026-01-10T16:45:00Z',
    yil: 2026,
    status: 'error',
    parasutFaturaId: null,
    faturaEmailGonderildi: false,
    errorReason: 'Adres eksik',
  },
  {
    id: 'mock-5',
    paket: 'populer',
    tutar: 129,
    tarih: '2025-12-05T11:00:00Z',
    yil: 2025,
    status: 'sent',
    parasutFaturaId: 'parasut-003',
    faturaEmailGonderildi: true,
  },
]

// ─── Filtre seçenekleri ───────────────────────────────────────────────────────

const YIL_OPTIONS = ['Tümü', '2026', '2025', '2024']

const DURUM_OPTIONS: { value: string; label: string }[] = [
  { value: 'tumu', label: 'Tümü' },
  { value: 'ready', label: 'Hazır' },
  { value: 'preparing', label: 'Hazırlanıyor' },
  { value: 'sent', label: 'Gönderildi' },
  { value: 'error', label: 'Hata' },
]

// ─── Sayfa ───────────────────────────────────────────────────────────────────

export default function FaturalarPage() {
  const { data: currentUser, isLoading: authLoading } = useCurrentUser()
  const [faturalar, setFaturalar] = useState<Fatura[]>([])
  const [yukleniyor, setYukleniyor] = useState(!FATURALAR_DEMO)
  const [fetchHata, setFetchHata] = useState(false)
  const [yilFiltre, setYilFiltre] = useState('Tümü')
  const [durumFiltre, setDurumFiltre] = useState('tumu')
  const [aksiyonDurum, setAksiyonDurum] = useState<Record<string, 'pdf' | 'email' | null>>({})
  const [toast, setToast] = useState<ToastMessage | null>(null)

  // ─── Veri yükle ────────────────────────────────────────────────────────────

  const yukle = async () => {
    if (FATURALAR_DEMO) {
      setFaturalar(MOCK_FATURALAR)
      setYukleniyor(false)
      return
    }

    setYukleniyor(true)
    setFetchHata(false)
    try {
      if (!currentUser) return

      const { data, error } = await supabase
        .from('payments')
        .select('id, paket, kredi, tutar, durum, parasut_fatura_id, fatura_email_gonderildi, created_at')
        .eq('user_id', currentUser.id)
        .eq('durum', 'basarili')
        .order('created_at', { ascending: false })

      if (error) throw error

      const mapped: Fatura[] = (data ?? []).map((o) => ({
        id: o.id,
        paket: o.paket,
        tutar: o.tutar,
        tarih: o.created_at,
        yil: new Date(o.created_at).getFullYear(),
        status: deriveStatus(o.parasut_fatura_id, o.fatura_email_gonderildi),
        parasutFaturaId: o.parasut_fatura_id,
        faturaEmailGonderildi: o.fatura_email_gonderildi,
      }))
      setFaturalar(mapped)
    } catch {
      setFetchHata(true)
    } finally {
      setYukleniyor(false)
    }
  }

  useEffect(() => {
    if (!FATURALAR_DEMO && authLoading) return
    yukle()
  }, [authLoading, currentUser]) // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Filtreli liste ─────────────────────────────────────────────────────────

  const filtreliListe = useMemo(() => {
    return faturalar.filter((f) => {
      const yilOk = yilFiltre === 'Tümü' || f.yil === parseInt(yilFiltre)
      const durumOk = durumFiltre === 'tumu' || f.status === durumFiltre
      return yilOk && durumOk
    })
  }, [faturalar, yilFiltre, durumFiltre])

  // ─── Yıllık toplam (filtre yılına göre) ────────────────────────────────────

  const yillikToplam = useMemo(() => {
    const listForTotal = yilFiltre === 'Tümü'
      ? faturalar
      : faturalar.filter((f) => f.yil === parseInt(yilFiltre))
    const tutar = listForTotal.reduce((s, f) => s + f.tutar, 0)
    const adet = listForTotal.length
    return { tutar, adet }
  }, [faturalar, yilFiltre])

  // ─── Aksiyon: İndir ────────────────────────────────────────────────────────

  const pdfIndir = async (fatura: Fatura) => {
    if (!fatura.parasutFaturaId) return

    setAksiyonDurum((p) => ({ ...p, [fatura.id]: 'pdf' }))
    try {
      const res = await fetch(`/api/fatura?odemeId=${fatura.id}&action=pdf`)
      const data = await res.json()
      if (data.pdf_url) {
        window.open(data.pdf_url, '_blank')
      } else {
        setToast({
          id: Date.now().toString(),
          type: 'error',
          message: 'Fatura PDF\'i Paraşüt entegrasyonu ile gelecek. Şimdilik destek@yzliste.com\'a yazabilirsin.',
        })
      }
    } catch {
      setToast({
        id: Date.now().toString(),
        type: 'error',
        message: 'PDF alınamadı. Lütfen destek@yzliste.com\'a yazın.',
      })
    }
    setAksiyonDurum((p) => ({ ...p, [fatura.id]: null }))
  }

  // ─── Aksiyon: E-posta gönder ───────────────────────────────────────────────

  const epostaGonder = async (fatura: Fatura) => {
    if (!fatura.parasutFaturaId) return
    if (!confirm('Fatura e-posta adresinize gönderilsin mi?')) return

    setAksiyonDurum((p) => ({ ...p, [fatura.id]: 'email' }))
    try {
      const res = await fetch(`/api/fatura?odemeId=${fatura.id}&action=email`)
      const data = await res.json()
      if (data.ok) {
        setFaturalar((prev) =>
          prev.map((f) => f.id === fatura.id ? { ...f, faturaEmailGonderildi: true, status: 'sent' } : f)
        )
        setToast({ id: Date.now().toString(), type: 'success', message: 'Fatura e-postanıza gönderildi.' })
      } else {
        setToast({
          id: Date.now().toString(),
          type: 'error',
          message: 'E-posta gönderilemedi. Lütfen destek@yzliste.com\'a yazın.',
        })
      }
    } catch {
      setToast({
        id: Date.now().toString(),
        type: 'error',
        message: 'E-posta gönderilemedi. Lütfen destek@yzliste.com\'a yazın.',
      })
    }
    setAksiyonDurum((p) => ({ ...p, [fatura.id]: null }))
  }

  // ─── Yardımcılar ───────────────────────────────────────────────────────────

  const formatTarih = (iso: string) =>
    new Date(iso).toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' })

  const formatTahminiTarih = (iso: string) =>
    new Date(iso).toLocaleDateString('tr-TR', { day: '2-digit', month: 'long' })

  const yilEtiketi = yilFiltre === 'Tümü' ? 'Tüm zamanlar' : `${yilFiltre} yılı`

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <main
      className="min-h-screen bg-rd-neutral-50 pb-16"
      aria-labelledby="faturalar-baslik"
    >
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
            Faturalar
          </p>
          <h1
            id="faturalar-baslik"
            className="font-[family-name:var(--font-rd-display)] text-3xl md:text-4xl font-medium text-rd-neutral-900 leading-tight tracking-tight mb-2"
          >
            Fatura ve ödemelerin
          </h1>
          <p className="text-sm text-rd-neutral-600">
            e-Arşiv faturaların burada görünür ve indirebilirsin.
          </p>
        </div>

        {/* Bilgi banner */}
        <div className="flex items-start gap-2.5 bg-rd-primary-50 border border-rd-primary-200 rounded-lg px-4 py-3 mb-6">
          <Info size={15} className="text-rd-primary-700 shrink-0 mt-0.5" />
          <p className="text-sm text-rd-primary-800 leading-relaxed">
            Faturalar ödeme sonrası 1–3 iş günü içinde otomatik oluşturulur ve e-postanıza gönderilir.
            Hazır olanları aşağıdan indirebilirsin.
          </p>
        </div>

        {/* Yıllık toplam rozeti */}
        {!yukleniyor && !fetchHata && faturalar.length > 0 && (
          <div className="flex items-center justify-between bg-rd-neutral-50 border border-rd-neutral-200 rounded-xl p-4 mb-5">
            <div>
              <p className="text-[10px] uppercase tracking-[0.15em] font-medium text-rd-neutral-400 mb-0.5">
                {yilEtiketi} toplam
              </p>
              <p className="font-[family-name:var(--font-rd-display)] text-xl font-medium text-rd-neutral-900">
                {yillikToplam.adet} fatura
                <span className="text-rd-neutral-500 font-medium text-base ml-2">
                  · ₺{yillikToplam.tutar.toLocaleString('tr-TR')}
                </span>
              </p>
            </div>
            <div className="text-right hidden sm:block">
              <Receipt size={20} className="text-rd-neutral-300 ml-auto mb-1" />
              <p className="text-xs text-rd-neutral-400">KDV dahil</p>
            </div>
          </div>
        )}

        {/* Filtre satırı */}
        {!yukleniyor && !fetchHata && faturalar.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
            <select
              aria-label="Yıl filtrele"
              value={yilFiltre}
              onChange={(e) => setYilFiltre(e.target.value)}
              className="w-full sm:w-auto border border-rd-neutral-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-rd-primary-500/30 focus:border-rd-primary-500"
            >
              {YIL_OPTIONS.map((y) => (
                <option key={y} value={y}>{y === 'Tümü' ? 'Tüm yıllar' : y}</option>
              ))}
            </select>

            <select
              aria-label="Durum filtrele"
              value={durumFiltre}
              onChange={(e) => setDurumFiltre(e.target.value)}
              className="w-full sm:w-auto border border-rd-neutral-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-rd-primary-500/30 focus:border-rd-primary-500"
            >
              {DURUM_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>

            <p className="text-sm text-rd-neutral-500 sm:ml-auto">
              {filtreliListe.length} fatura
            </p>
          </div>
        )}

        {/* ── İçerik ──────────────────────────────────────────────────────── */}

        {yukleniyor ? (
          /* Skeleton */
          <div className="space-y-3" aria-label="Faturalar yükleniyor">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-rd-neutral-200 p-5 animate-pulse">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-rd-neutral-100 rounded w-3/5" />
                    <div className="h-3 bg-rd-neutral-100 rounded w-2/5" />
                    <div className="h-5 bg-rd-neutral-100 rounded w-20 mt-2" />
                  </div>
                  <div className="h-8 bg-rd-neutral-100 rounded w-24" />
                </div>
              </div>
            ))}
          </div>

        ) : fetchHata ? (
          /* Fetch hatası */
          <div className="bg-white rounded-xl border border-rd-neutral-200 p-10 text-center">
            <AlertCircle size={36} className="text-rd-danger-300 mx-auto mb-3" />
            <p className="text-sm font-medium text-rd-neutral-800 mb-1">Faturalar yüklenemedi</p>
            <p className="text-xs text-rd-neutral-500 mb-4">Bağlantını kontrol et ve tekrar dene.</p>
            <button
              onClick={yukle}
              className="inline-flex items-center gap-2 text-sm text-rd-primary-700 hover:text-rd-primary-900 font-medium"
            >
              <RefreshCw size={14} />
              Tekrar dene
            </button>
          </div>

        ) : faturalar.length === 0 ? (
          /* Boş state */
          <div className="bg-white rounded-xl border border-rd-neutral-200 p-12 text-center max-w-sm mx-auto">
            <Receipt size={40} strokeWidth={1.5} className="text-rd-neutral-300 mx-auto mb-3" />
            <h3 className="font-medium text-rd-neutral-900 mb-1">Henüz faturanız yok</h3>
            <p className="text-sm text-rd-neutral-500 mb-5">
              İlk paket aldığınızda burada görünecek.
            </p>
            <Link
              href="/fiyatlar"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-white bg-rd-primary-700 hover:bg-rd-primary-800 px-5 py-2.5 rounded-lg transition-colors"
            >
              Paketleri görüntüle
            </Link>
          </div>

        ) : filtreliListe.length === 0 ? (
          /* Filtre sonucu boş */
          <div className="bg-white rounded-xl border border-rd-neutral-200 p-10 text-center">
            <p className="text-sm font-medium text-rd-neutral-800 mb-1">Filtrelere uyan fatura yok</p>
            <button
              onClick={() => { setYilFiltre('Tümü'); setDurumFiltre('tumu') }}
              className="text-sm text-rd-primary-700 hover:text-rd-primary-900 font-medium mt-2"
            >
              Filtreleri temizle
            </button>
          </div>

        ) : (
          /* Fatura listesi */
          <ul role="list" className="space-y-3">
            {filtreliListe.map((fatura) => {
              const aksiyonYukleniyor = aksiyonDurum[fatura.id]
              const paketAdi = PAKET_ISIM[fatura.paket] ?? fatura.paket
              const tarihStr = formatTarih(fatura.tarih)
              const canAction = fatura.status === 'ready' || fatura.status === 'sent'

              return (
                <li
                  key={fatura.id}
                  role="listitem"
                  className="bg-white rounded-xl border border-rd-neutral-200 overflow-hidden"
                >
                  <div className="p-5">
                    {/* Üst satır: paket + tutar */}
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <p className="font-medium text-rd-neutral-900 text-sm leading-snug">
                        {paketAdi}
                      </p>
                      <p className="font-[family-name:var(--font-rd-display)] font-medium text-rd-neutral-900 shrink-0">
                        ₺{fatura.tutar.toLocaleString('tr-TR')}
                      </p>
                    </div>

                    {/* Orta satır: tarih + status badge */}
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <p className="text-sm text-rd-neutral-500">{tarihStr}</p>
                      <StatusBadge status={fatura.status} />
                    </div>

                    {/* Alt satır: durum bağımlı */}
                    {fatura.status === 'preparing' && fatura.tahminiHazirTarih && (
                      <p className="text-xs italic text-rd-neutral-400">
                        Tahmini hazır: {formatTahminiTarih(fatura.tahminiHazirTarih)}
                      </p>
                    )}

                    {canAction && (
                      <div className="flex flex-col sm:flex-row gap-2">
                        <button
                          onClick={() => pdfIndir(fatura)}
                          disabled={!!aksiyonYukleniyor}
                          aria-label={`Faturayı indir: ${paketAdi} — ${tarihStr}`}
                          className="flex items-center justify-center gap-1.5 text-sm font-medium text-white bg-rd-neutral-900 hover:bg-rd-neutral-800 px-4 py-2 rounded-lg transition-colors disabled:opacity-50 sm:w-auto w-full"
                        >
                          {aksiyonYukleniyor === 'pdf'
                            ? <Loader2 size={14} className="animate-spin" />
                            : <Download size={14} />}
                          İndir
                        </button>

                        {fatura.status !== 'sent' && (
                          <button
                            onClick={() => epostaGonder(fatura)}
                            disabled={!!aksiyonYukleniyor}
                            aria-label={`E-posta ile gönder: ${paketAdi} — ${tarihStr}`}
                            className="flex items-center justify-center gap-1.5 text-sm font-medium text-rd-neutral-700 border border-rd-neutral-300 hover:border-rd-neutral-400 hover:bg-rd-neutral-50 px-4 py-2 rounded-lg transition-colors disabled:opacity-50 sm:w-auto w-full"
                          >
                            {aksiyonYukleniyor === 'email'
                              ? <Loader2 size={14} className="animate-spin" />
                              : <Mail size={14} />}
                            E-postama gönder
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Hata bloğu (FT-04) */}
                  {fatura.status === 'error' && (
                    <div className="border-t border-rd-danger-200 bg-rd-danger-50 px-5 py-3">
                      <div className="flex items-start gap-2 mb-2">
                        <AlertCircle size={14} className="text-rd-danger-600 shrink-0 mt-0.5" />
                        <p className="text-sm text-rd-danger-700">
                          Bu faturada bilgi sorunu var:{' '}
                          <span className="font-medium">{fatura.errorReason ?? 'Bilgi eksik'}</span>
                        </p>
                      </div>
                      <Link
                        href="/hesap/profil"
                        className="inline-flex items-center gap-1 text-sm font-medium text-rd-primary-700 hover:text-rd-primary-900 transition-colors"
                      >
                        Profili düzenle
                        <ChevronRight size={13} />
                      </Link>
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        )}

        {/* Alt not */}
        <p className="text-xs text-rd-neutral-400 text-center mt-8">
          Fatura ile ilgili sorunlar için{' '}
          <a href="mailto:destek@yzliste.com" className="text-rd-primary-700 hover:underline">
            destek@yzliste.com
          </a>
        </p>

      </div>

      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </main>
  )
}
