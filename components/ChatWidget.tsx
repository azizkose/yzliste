'use client'

import { useState } from 'react'

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
        <div className="mb-3 bg-white rounded-2xl shadow-xl border border-gray-100 w-80 flex flex-col overflow-hidden">
          <div className="bg-indigo-500 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
              <span className="text-white text-sm font-semibold">yzliste destek</span>
            </div>
            <button onClick={() => setAcik(false)} className="text-white/80 hover:text-white text-lg">
              ×
            </button>
          </div>
          <div className="flex-1 p-4 space-y-3 max-h-72 overflow-y-auto bg-gray-50">
            {mesajlar.map((m, i) => (
              <div key={i} className={`flex ${m.rol === 'kullanici' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-xl text-xs leading-relaxed ${
                    m.rol === 'kullanici'
                      ? 'bg-indigo-500 text-white'
                      : 'bg-white text-gray-700 border border-gray-100'
                  }`}
                >
                  {m.metin}
                </div>
              </div>
            ))}
            {yukleniyor && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-100 px-3 py-2 rounded-xl text-xs text-gray-400">
                  yazıyor...
                </div>
              </div>
            )}
          </div>
          <div className="p-3 border-t border-gray-100 bg-white flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && gonder()}
              placeholder="Mesajınızı yazın..."
              className="flex-1 text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-400"
            />
            <button
              onClick={gonder}
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-2 rounded-lg text-xs font-medium"
            >
              Gönder
            </button>
          </div>
        </div>
      )}
      <button
        onClick={() => setAcik(!acik)}
        className="bg-indigo-500 hover:bg-indigo-600 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl transition-all"
      >
        {acik ? '×' : '💬'}
      </button>
    </div>
  )
}
