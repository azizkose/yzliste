'use client'

import { useState } from 'react'
import { MessageCircle, X } from 'lucide-react'

export default function ChatWidget() {
  const [acik, setAcik] = useState(false)
  const [mesajlar, setMesajlar] = useState<{ rol: string; metin: string }[]>([
    { rol: 'asistan', metin: 'Merhaba! Listing veya görsel üretim konusunda soru sormak ister misiniz?' },
  ])
  const [input, setInput] = useState('')
  const [yukleniyor, setYukleniyor] = useState(false)

  const gonder = async () => {
    if (!input.trim()) return
    setMesajlar((prev) => [...prev, { rol: 'kullanici', metin: input }])
    setInput('')
    setYukleniyor(true)
    setTimeout(() => {
      setMesajlar((prev) => [
        ...prev,
        {
          rol: 'asistan',
          metin: "Bu özellik yakında aktif olacak! Şimdilik yzliste'nin tüm özelliklerini deneyebilirsiniz.",
        },
      ])
      setYukleniyor(false)
    }, 1000)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {acik && (
        <div className="mb-3 bg-white rounded-xl border border-[#D8D6CE] w-80 flex flex-col overflow-hidden">
          <div className="bg-[#1A1A17] px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
              <span className="text-white text-sm font-medium">yzliste destek</span>
            </div>
            <button onClick={() => setAcik(false)} className="text-white/60 hover:text-white transition-colors">
              <X size={16} strokeWidth={1.5} />
            </button>
          </div>
          <div className="flex-1 p-4 space-y-3 max-h-72 overflow-y-auto bg-[#FAFAF8]">
            {mesajlar.map((m, i) => (
              <div key={i} className={`flex ${m.rol === 'kullanici' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-xl text-xs leading-relaxed ${
                    m.rol === 'kullanici'
                      ? 'bg-[#1A1A17] text-white'
                      : 'bg-white text-[#5A5852] border border-[#D8D6CE]'
                  }`}
                >
                  {m.metin}
                </div>
              </div>
            ))}
            {yukleniyor && (
              <div className="flex justify-start">
                <div className="bg-white border border-[#D8D6CE] px-3 py-2 rounded-xl text-xs text-[#908E86]">
                  yazıyor...
                </div>
              </div>
            )}
          </div>
          <div className="p-3 border-t border-[#D8D6CE] bg-white flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && gonder()}
              placeholder="Mesajınızı yazın..."
              className="flex-1 text-xs border border-[#D8D6CE] rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#1E4DD8]"
            />
            <button
              onClick={gonder}
              className="bg-[#1A1A17] hover:bg-[#2C2C29] text-white px-3 py-2 rounded-lg text-xs font-medium transition-colors"
            >
              Gönder
            </button>
          </div>
        </div>
      )}
      <button
        onClick={() => setAcik(!acik)}
        className="bg-[#1A1A17] hover:bg-[#2C2C29] text-white w-12 h-12 rounded-full flex items-center justify-center transition-colors"
      >
        {acik ? <X size={20} strokeWidth={1.5} /> : <MessageCircle size={20} strokeWidth={1.5} />}
      </button>
    </div>
  )
}
