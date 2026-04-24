'use client'

import { useState, useRef } from 'react'
import { Loader2, Lock, User, Building2, X } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { PAKET_LISTESI } from '@/lib/paketler'
import { analytics } from '@/lib/analytics'

type Kullanici = {
  id: string
  email: string | null
  kredi: number
  toplam_kullanilan: number
  is_admin: boolean
  anonim?: boolean
  ton?: string
  marka_adi?: string
}

interface PaketModalProps {
  kullanici: Kullanici
  onKapat: () => void
}

type Adim = 'paket' | 'fatura' | 'odeme'

export default function PaketModal({ kullanici, onKapat }: PaketModalProps) {
  // Adım yönetimi
  const [adim, setAdim] = useState<Adim>('paket')

  // Paket seçimi
  const [seciliPaket, setSeciliPaket] = useState<string | null>(null)
  const [yukleniyor, setYukleniyor] = useState(false)
  const [kosullarOnay, setKosullarOnay] = useState(false)
  const [mesafeliOnay, setMesafeliOnay] = useState(false)
  const [kvkkOnay, setKvkkOnay] = useState(false)
  const tumOnaylar = kosullarOnay && mesafeliOnay && kvkkOnay

  // Fatura bilgileri
  const [faturaTipi, setFaturaTipi] = useState<'bireysel' | 'kurumsal'>('bireysel')
  const [adSoyad, setAdSoyad] = useState('')
  const [tcKimlik, setTcKimlik] = useState('')
  const [vergiNo, setVergiNo] = useState('')
  const [vergiDairesi, setVergiDairesi] = useState('')
  const [adres, setAdres] = useState('')
  const [faturaHata, setFaturaHata] = useState<string | null>(null)
  const [faturaKaydediliyor, setFaturaKaydediliyor] = useState(false)

  // iyzico form
  const formRef = useRef<HTMLDivElement>(null)

  const paketler = PAKET_LISTESI

  // Fatura bilgilerini kontrol et, eksikse fatura adımına yönlendir
  const consentKaydet = async (odemeId?: string) => {
    try {
      await fetch('/api/consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kosullarOnay: kosullarOnay, mesafeliOnay: mesafeliOnay, kvkkOnay: kvkkOnay, odemeId: odemeId ?? null }),
      })
    } catch {
      // Log hatası ödemeyi engellememeli
    }
  }

  const paketSec = async (paketId: string) => {
    if (!tumOnaylar) return
    setSeciliPaket(paketId)
    // KVKK onaylarını DB'ye kaydet
    await consentKaydet()

    const { data: profil } = await supabase
      .from('profiles')
      .select('ad_soyad, fatura_tipi, tc_kimlik, vergi_no, adres')
      .eq('id', kullanici.id)
      .single()

    const faturaTamam =
      profil?.ad_soyad &&
      profil?.adres &&
      (profil?.fatura_tipi === 'bireysel' ? profil?.tc_kimlik : profil?.vergi_no)

    if (!faturaTamam) {
      // Mevcut verileri forma doldur
      if (profil?.ad_soyad) setAdSoyad(profil.ad_soyad)
      if (profil?.adres) setAdres(profil.adres)
      if (profil?.fatura_tipi === 'kurumsal') setFaturaTipi('kurumsal')
      if (profil?.tc_kimlik) setTcKimlik(profil.tc_kimlik)
      if (profil?.vergi_no) setVergiNo(profil.vergi_no)
      setAdim('fatura')
    } else {
      await odemeBaslat(paketId)
    }
  }

  // Fatura bilgilerini kaydet ve ödeme başlat
  const faturaKaydetVeOde = async () => {
    setFaturaHata(null)

    if (!adSoyad.trim()) { setFaturaHata('Ad/Unvan zorunludur.'); return }
    if (!adres.trim()) { setFaturaHata('Adres zorunludur.'); return }
    if (faturaTipi === 'bireysel' && !tcKimlik.trim()) { setFaturaHata('TC Kimlik No zorunludur.'); return }
    if (faturaTipi === 'bireysel' && tcKimlik.trim().length !== 11) { setFaturaHata('TC Kimlik No 11 haneli olmalıdır.'); return }
    if (faturaTipi === 'kurumsal' && !vergiNo.trim()) { setFaturaHata('Vergi Numarası zorunludur.'); return }
    if (faturaTipi === 'kurumsal' && !vergiDairesi.trim()) { setFaturaHata('Vergi Dairesi zorunludur.'); return }

    setFaturaKaydediliyor(true)
    const { error } = await supabase
      .from('profiles')
      .update({
        ad_soyad: adSoyad.trim(),
        fatura_tipi: faturaTipi,
        tc_kimlik: faturaTipi === 'bireysel' ? tcKimlik.trim() : null,
        vergi_no: faturaTipi === 'kurumsal' ? vergiNo.trim() : null,
        vergi_dairesi: faturaTipi === 'kurumsal' ? vergiDairesi.trim() : null,
        adres: adres.trim(),
      })
      .eq('id', kullanici.id)
    setFaturaKaydediliyor(false)

    if (error) { setFaturaHata('Bilgiler kaydedilemedi, tekrar deneyin.'); return }

    await odemeBaslat(seciliPaket!)
  }

  // iyzico ödeme başlat
  const odemeBaslat = async (paketId: string) => {
    setYukleniyor(true)
    const paket = PAKET_LISTESI.find((p) => p.id === paketId)
    analytics.creditPurchaseStarted({ package_id: paketId, price: paket?.fiyat ?? 0 })

    try {
      const res = await fetch('/api/odeme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paket: paketId, userId: kullanici.id, email: kullanici.email }),
      })
      const data = await res.json()
      if (data.checkoutFormContent) {
        setAdim('odeme')
        setTimeout(() => {
          if (formRef.current) {
            formRef.current.innerHTML = data.checkoutFormContent
            const scriptlar = formRef.current.querySelectorAll('script')
            scriptlar.forEach((eskiScript) => {
              const yeniScript = document.createElement('script')
              if (eskiScript.src) yeniScript.src = eskiScript.src
              else yeniScript.textContent = eskiScript.textContent
              eskiScript.parentNode?.replaceChild(yeniScript, eskiScript)
            })
          }
        }, 100)
      } else {
        alert(data.hata || 'Ödeme başlatılamadı, tekrar deneyin.')
      }
    } catch {
      alert('Bir hata oluştu, tekrar deneyin.')
    }
    setYukleniyor(false)
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl border border-[#D8D6CE] w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#D8D6CE]">
          <div>
            {adim === 'paket' && (
              <>
                <h2 className="text-lg font-medium text-[#1A1A17]">İçerik üretim kredisi satın al</h2>
                <p className="text-xs text-[#5A5852] mt-0.5">
                  Mevcut kredin:{' '}
                  <span className="font-medium text-[#1E4DD8]">{kullanici.kredi}</span>
                </p>
              </>
            )}
            {adim === 'fatura' && (
              <>
                <h2 className="text-lg font-medium text-[#1A1A17]">Fatura bilgileri</h2>
                <p className="text-xs text-[#5A5852] mt-0.5">e-Arşiv fatura için gerekli bilgiler</p>
              </>
            )}
            {adim === 'odeme' && (
              <h2 className="text-lg font-medium text-[#1A1A17]">Güvenli ödeme</h2>
            )}
          </div>
          <button onClick={onKapat} aria-label="Kapat" className="text-[#908E86] hover:text-[#5A5852] transition-colors">
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* Adım: Paket Seçimi */}
        {adim === 'paket' && (
          <div className="p-6 space-y-4">
            {paketler.map((p) => (
              <div key={p.id} className={`border-2 ${p.renk} rounded-xl p-5 relative`}>
                {p.rozet && (
                  <span className="absolute -top-3 left-4 bg-[#1E4DD8] text-white text-xs font-medium px-3 py-1 rounded-full">
                    En popüler
                  </span>
                )}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#1A1A17]">{p.isim}</p>
                    <p className="text-sm text-[#5A5852]">{p.krediStr}</p>
                  </div>
                  <p className="text-2xl font-medium text-[#1A1A17]">{p.fiyatStr}</p>
                </div>
                <button
                  onClick={() => paketSec(p.id)}
                  disabled={yukleniyor || !tumOnaylar}
                  className={`w-full mt-4 ${p.butonRenk} text-white font-medium py-2.5 rounded-xl text-sm transition-colors disabled:bg-[#D8D6CE] disabled:cursor-not-allowed`}
                >
                  {yukleniyor && seciliPaket === p.id ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 size={14} strokeWidth={1.5} className="animate-spin" />
                      Yükleniyor...
                    </span>
                  ) : !tumOnaylar ? (
                    'Onayları işaretle'
                  ) : (
                    'Satın Al'
                  )}
                </button>
              </div>
            ))}

            {/* F-07d: 3 zorunlu onay checkbox'ı */}
            <div className="space-y-2 border-t border-[#D8D6CE] pt-4">
              {[
                { state: kosullarOnay, set: setKosullarOnay, href: '/kosullar', metin: 'Kullanım Koşulları' },
                { state: mesafeliOnay, set: setMesafeliOnay, href: '/mesafeli-satis', metin: 'Mesafeli Satış Sözleşmesi' },
                { state: kvkkOnay, set: setKvkkOnay, href: '/kvkk-aydinlatma', metin: 'KVKK Aydınlatma Metni' },
              ].map(({ state, set, href, metin }) => (
                <label key={href} className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={state}
                    onChange={(e) => set(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-[#D8D6CE] flex-shrink-0"
                  />
                  <span className="text-xs text-[#5A5852]">
                    <a href={href} target="_blank" className="text-[#1E4DD8] hover:underline font-medium">
                      {metin}
                    </a>
                    &apos;ni okudum ve kabul ediyorum.
                  </span>
                </label>
              ))}
            </div>
            <p className="text-xs text-[#908E86] text-center pt-2 flex items-center justify-center gap-1.5">
              <Lock size={11} strokeWidth={1.5} />
              Güvenli ödeme — iyzico altyapısı
            </p>
          </div>
        )}

        {/* Adım: Fatura Bilgileri */}
        {adim === 'fatura' && (
          <div className="p-6 space-y-4">
            {/* Fatura tipi toggle */}
            <div className="flex rounded-xl overflow-hidden border border-[#D8D6CE]">
              <button
                onClick={() => setFaturaTipi('bireysel')}
                className={`flex-1 py-2 text-sm font-medium transition-colors flex items-center justify-center gap-1.5 ${faturaTipi === 'bireysel' ? 'bg-[#1E4DD8] text-white' : 'bg-white text-[#5A5852] hover:bg-[#FAFAF8]'}`}
              >
                <User size={14} strokeWidth={1.5} />
                Bireysel
              </button>
              <button
                onClick={() => setFaturaTipi('kurumsal')}
                className={`flex-1 py-2 text-sm font-medium transition-colors flex items-center justify-center gap-1.5 ${faturaTipi === 'kurumsal' ? 'bg-[#1E4DD8] text-white' : 'bg-white text-[#5A5852] hover:bg-[#FAFAF8]'}`}
              >
                <Building2 size={14} strokeWidth={1.5} />
                Kurumsal
              </button>
            </div>

            {/* Ad/Unvan */}
            <div>
              <label className="block text-xs font-medium text-[#5A5852] mb-1">
                {faturaTipi === 'bireysel' ? 'Ad Soyad' : 'Şirket Unvanı'} <span className="text-[#7A1E1E]">*</span>
              </label>
              <input
                type="text"
                value={adSoyad}
                onChange={(e) => setAdSoyad(e.target.value)}
                placeholder={faturaTipi === 'bireysel' ? 'Örn: Ayşe Kaya' : 'Örn: Kaya Tekstil Ltd. Şti.'}
                className="w-full border border-[#D8D6CE] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#BAC9EB]"
              />
            </div>

            {/* Bireysel: TC Kimlik */}
            {faturaTipi === 'bireysel' && (
              <div>
                <label className="block text-xs font-medium text-[#5A5852] mb-1">
                  TC Kimlik No <span className="text-[#7A1E1E]">*</span>
                </label>
                <input
                  type="text"
                  value={tcKimlik}
                  onChange={(e) => setTcKimlik(e.target.value.replace(/\D/g, '').slice(0, 11))}
                  placeholder="11 haneli TC Kimlik No"
                  maxLength={11}
                  className="w-full border border-[#D8D6CE] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#BAC9EB]"
                />
                <p className="text-xs text-[#908E86] mt-1">TC Kimlik numaranız yalnızca e-Arşiv fatura için kullanılır.</p>
              </div>
            )}

            {/* Kurumsal: Vergi No + Daire */}
            {faturaTipi === 'kurumsal' && (
              <>
                <div>
                  <label className="block text-xs font-medium text-[#5A5852] mb-1">
                    Vergi Numarası <span className="text-[#7A1E1E]">*</span>
                  </label>
                  <input
                    type="text"
                    value={vergiNo}
                    onChange={(e) => setVergiNo(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="10 haneli Vergi No"
                    maxLength={10}
                    className="w-full border border-[#D8D6CE] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#BAC9EB]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A5852] mb-1">
                    Vergi Dairesi <span className="text-[#7A1E1E]">*</span>
                  </label>
                  <input
                    type="text"
                    value={vergiDairesi}
                    onChange={(e) => setVergiDairesi(e.target.value)}
                    placeholder="Örn: Kadıköy VD"
                    className="w-full border border-[#D8D6CE] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#BAC9EB]"
                  />
                </div>
              </>
            )}

            {/* Adres */}
            <div>
              <label className="block text-xs font-medium text-[#5A5852] mb-1">
                Fatura Adresi <span className="text-[#7A1E1E]">*</span>
              </label>
              <textarea
                value={adres}
                onChange={(e) => setAdres(e.target.value)}
                placeholder="Açık adres (Mahalle, Sokak, No, İlçe, İl)"
                rows={3}
                className="w-full border border-[#D8D6CE] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#BAC9EB] resize-none"
              />
            </div>

            {faturaHata && (
              <p className="text-sm text-[#7A1E1E] bg-[#FCECEC] rounded-xl px-3 py-2">{faturaHata}</p>
            )}

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setAdim('paket')}
                className="flex-1 border border-[#D8D6CE] text-[#5A5852] font-medium py-2.5 rounded-xl text-sm hover:bg-[#FAFAF8] transition-colors"
              >
                ← Geri
              </button>
              <button
                onClick={faturaKaydetVeOde}
                disabled={faturaKaydediliyor}
                className="flex-1 bg-[#1E4DD8] hover:bg-[#163B9E] text-white font-medium py-2.5 rounded-xl text-sm transition-colors disabled:bg-[#D8D6CE] disabled:cursor-not-allowed"
              >
                {faturaKaydediliyor ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 size={14} strokeWidth={1.5} className="animate-spin" />
                    Kaydediliyor...
                  </span>
                ) : (
                  'Kaydet ve ödemeye geç →'
                )}
              </button>
            </div>
          </div>
        )}

        {/* Adım: iyzico Ödeme Formu */}
        {adim === 'odeme' && (
          <div className="p-4">
            <div ref={formRef} id="iyzipay-checkout-form" className="popup" />
          </div>
        )}
      </div>
    </div>
  )
}
