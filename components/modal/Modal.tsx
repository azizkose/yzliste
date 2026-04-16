'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useCallback } from 'react'

interface ModalProps {
  title?: string
  children: React.ReactNode
}

export default function Modal({ title, children }: ModalProps) {
  const router = useRouter()

  const handleClose = useCallback(() => {
    router.back()
  }, [router])

  // Esc tuşu ile kapat
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [handleClose])

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose()
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">{title ?? ''}</h2>
          <button
            onClick={handleClose}
            aria-label="Kapat"
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}
