'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useCallback, useRef } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  title?: string
  children: React.ReactNode
}

export default function Modal({ title, children }: ModalProps) {
  const router = useRouter()
  const pathname = usePathname()
  const initialPathname = useRef(pathname)

  const handleClose = useCallback(() => {
    router.back()
  }, [router])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [handleClose])

  // Stale overlay güvenlik ağı
  useEffect(() => {
    if (pathname !== initialPathname.current) handleClose()
  }, [pathname, handleClose])

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center sm:p-4"
      onClick={(e) => { if (e.target === e.currentTarget) handleClose() }}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-baslik' : undefined}
    >
      <div className="bg-white w-full sm:max-w-md sm:rounded-xl border border-rd-neutral-200 max-h-[95vh] sm:max-h-[90vh] overflow-y-auto rounded-t-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-rd-neutral-100">
          {title && (
            <h2
              id="modal-baslik"
              className="text-base font-bold text-rd-neutral-900"
              style={{ fontFamily: 'var(--font-rd-display)' }}
            >
              {title}
            </h2>
          )}
          <button
            onClick={handleClose}
            aria-label="Kapat"
            className="ml-auto text-rd-neutral-400 hover:text-rd-neutral-700 transition-colors p-1 rounded-lg hover:bg-rd-neutral-100"
          >
            <X size={18} strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}
