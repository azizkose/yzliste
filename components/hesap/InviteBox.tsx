'use client'

import { useEffect, useState } from 'react'
import { UserPlus, Check, Copy, MessageCircle, Send } from 'lucide-react'

interface InviteStats {
  referralCode: string | null
  kayit: number
  tamamlanan: number
  kazanilanKredi: number
}

export default function InviteBox({ userId }: { userId: string }) {
  const [stats, setStats] = useState<InviteStats | null>(null)
  const [kopyalandi, setKopyalandi] = useState(false)

  useEffect(() => {
    fetch(`/api/referral/stats?userId=${userId}`)
      .then((r) => r.json())
      .then(setStats)
      .catch(() => setStats({ referralCode: null, kayit: 0, tamamlanan: 0, kazanilanKredi: 0 }))
  }, [userId])

  if (!stats) return null

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://yzliste.com'
  const link = stats.referralCode ? `${origin}/r/${stats.referralCode}` : null
  const davetSayisi = stats.kayit

  const kopyala = async () => {
    if (!link) return
    await navigator.clipboard.writeText(link)
    setKopyalandi(true)
    setTimeout(() => setKopyalandi(false), 2000)
  }

  return (
    <div className="bg-rd-primary-50 border border-rd-primary-200 rounded-xl p-5">
      <div className="flex items-start gap-3 mb-4">
        <UserPlus size={24} className="text-rd-primary-700 shrink-0 mt-0.5" aria-hidden="true" />
        <div>
          <h2 className="font-medium text-rd-neutral-900 mb-0.5">Arkadaşını davet et</h2>
          {davetSayisi === 0 ? (
            <p className="text-sm text-rd-neutral-600">
              Sen ve arkadaşın{' '}
              <span className="font-medium text-rd-primary-700">+10 kredi</span>{' '}
              kazanır.
            </p>
          ) : (
            <p className="text-sm text-rd-neutral-600">
              <span className="font-medium text-rd-primary-700">{davetSayisi} arkadaş</span>{' '}
              davet ettin,{' '}
              <span className="font-medium text-rd-primary-700">+{stats.kazanilanKredi} kredi</span>{' '}
              kazandın.
            </p>
          )}
        </div>
      </div>

      {link ? (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="flex-1 min-w-0 bg-white border border-rd-primary-200 rounded-lg px-3 py-2 text-xs text-rd-neutral-600 truncate font-mono">
              {link}
            </div>
            <button
              onClick={kopyala}
              className="shrink-0 inline-flex items-center gap-1.5 text-sm font-medium text-white bg-rd-primary-700 hover:bg-rd-primary-800 px-4 py-2 rounded-lg transition-colors"
              aria-label="Davet linkini kopyala"
            >
              {kopyalandi ? (
                <><Check size={14} aria-hidden="true" />Kopyalandı</>
              ) : (
                <><Copy size={14} aria-hidden="true" />Kopyala</>
              )}
            </button>
          </div>
          <div className="flex gap-2">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`yzliste'yi dene — AI ile e-ticaret içerikleri: ${link}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-white bg-[#25D366] hover:bg-[#1ebe5d] px-3 py-1.5 rounded-lg transition-colors"
            >
              <MessageCircle size={13} aria-hidden="true" />
              WhatsApp
            </a>
            <a
              href={`https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent('yzliste — AI ile e-ticaret içerikleri')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-white bg-[#2AABEE] hover:bg-[#1a9fd8] px-3 py-1.5 rounded-lg transition-colors"
            >
              <Send size={13} aria-hidden="true" />
              Telegram
            </a>
          </div>
        </div>
      ) : (
        <p className="text-xs text-rd-neutral-400">Davet linki yükleniyor…</p>
      )}

      {davetSayisi >= 1 && (
        <div className="grid grid-cols-3 gap-3 mt-4">
          {[
            { etiket: 'Kayıt olan', deger: stats.kayit },
            { etiket: 'Satın alan', deger: stats.tamamlanan },
            { etiket: 'Kazanılan kredi', deger: stats.kazanilanKredi },
          ].map((m) => (
            <div key={m.etiket} className="bg-rd-primary-100/60 rounded-lg p-3 text-center">
              <p className="font-[family-name:var(--font-rd-display)] text-lg font-medium text-rd-primary-800">
                {m.deger}
              </p>
              <p className="text-xs text-rd-primary-700 mt-0.5">{m.etiket}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
