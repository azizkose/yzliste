'use client'

import { Download } from 'lucide-react'
import Tooltip from '@/components/primitives/Tooltip'

interface DownloadButtonProps {
  text: string
  id: string
}

export default function DownloadButton({ text, id }: DownloadButtonProps) {
  const isEmpty = !text.trim()

  const handleDownload = () => {
    if (isEmpty) return
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `yzliste-uretim-${id.slice(0, 8)}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Tooltip content={isEmpty ? 'İçerik bulunamadı' : null}>
      <button
        type="button"
        onClick={handleDownload}
        aria-disabled={isEmpty || undefined}
        aria-label="İçeriği .txt olarak indir"
        className={[
          'inline-flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-lg border px-5 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rd-primary-500 focus-visible:ring-offset-2',
          isEmpty
            ? 'border-rd-neutral-200 bg-rd-neutral-100 text-rd-neutral-400 cursor-not-allowed'
            : 'border-rd-neutral-300 bg-white text-rd-neutral-700 hover:bg-rd-neutral-100',
        ].join(' ')}
      >
        <Download size={16} aria-hidden="true" />
        İndir (.txt)
      </button>
    </Tooltip>
  )
}
