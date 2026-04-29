'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

interface CopyButtonProps {
  text: string
  'aria-label'?: string
}

export default function CopyButton({ text, 'aria-label': ariaLabel }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={ariaLabel ?? 'İçeriği kopyala'}
      className={[
        'inline-flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-lg px-5 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rd-primary-500 focus-visible:ring-offset-2',
        copied
          ? 'bg-rd-success-700 text-white'
          : 'bg-rd-neutral-900 hover:bg-rd-neutral-800 text-white',
      ].join(' ')}
    >
      {copied ? (
        <Check size={16} aria-hidden="true" />
      ) : (
        <Copy size={16} aria-hidden="true" />
      )}
      {copied ? 'Kopyalandı' : 'Kopyala'}
      <span aria-live="polite" className="sr-only">
        {copied ? 'Kopyalandı' : ''}
      </span>
    </button>
  )
}
