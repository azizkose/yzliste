'use client'

import { useEffect, useRef, useCallback } from 'react'
import { X, Play } from 'lucide-react'

interface VideoModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function VideoModal({ isOpen, onClose }: VideoModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const triggerRef = useRef<HTMLElement | null>(null)

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose]
  )

  useEffect(() => {
    if (isOpen) {
      triggerRef.current = document.activeElement as HTMLElement
      document.body.style.overflow = 'hidden'
      document.addEventListener('keydown', handleKeyDown)
      requestAnimationFrame(() => closeRef.current?.focus())
    }
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handleKeyDown)
      triggerRef.current?.focus()
    }
  }, [isOpen, handleKeyDown])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-[modal-backdrop-in_200ms_ease-out]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Nasıl çalışır videosu"
        className="relative w-full max-w-[800px] aspect-video overflow-hidden rounded-xl bg-black animate-[modal-panel-in_300ms_ease-out]"
      >
        {/* X butonu */}
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white/80 transition-colors hover:bg-black/60 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          aria-label="Kapat"
        >
          <X size={18} strokeWidth={2} />
        </button>

        {/* Video placeholder */}
        <div className="relative flex h-full w-full items-center justify-center bg-slate-900">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
              <Play size={28} className="ml-1 text-white" fill="currentColor" />
            </div>
            <p className="text-sm text-white/80">Video yakında eklenecek</p>
          </div>
        </div>
      </div>
    </div>
  )
}
