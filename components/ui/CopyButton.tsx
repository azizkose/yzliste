'use client'

import { useState } from 'react'

export default function CopyButton({ text }: { text: string }) {
  const [kopyalandi, setKopyalandi] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setKopyalandi(true)
    setTimeout(() => setKopyalandi(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl transition-colors"
    >
      {kopyalandi ? '✓ Kopyalandı' : 'Kopyala'}
    </button>
  )
}
