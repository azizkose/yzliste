'use client'

import { useEffect } from 'react'
import { CheckCircle, AlertCircle, X } from 'lucide-react'

export interface ToastMessage {
  id: string
  type: 'success' | 'error'
  message: string
}

interface ToastProps {
  toast: ToastMessage | null
  onDismiss: () => void
}

export default function Toast({ toast, onDismiss }: ToastProps) {
  useEffect(() => {
    if (!toast) return
    const duration = toast.type === 'success' ? 3000 : 5000
    const t = setTimeout(onDismiss, duration)
    return () => clearTimeout(t)
  }, [toast, onDismiss])

  if (!toast) return null

  const isSuccess = toast.type === 'success'

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className={[
        'fixed bottom-20 right-4 z-50 flex items-start gap-3 px-4 py-3 rounded-xl animate-fade-in',
        'max-w-[calc(100vw-2rem)] sm:max-w-sm',
        isSuccess
          ? 'bg-rd-success-700 text-white'
          : 'bg-rd-danger-600 text-white',
      ].join(' ')}
    >
      {isSuccess
        ? <CheckCircle size={16} className="shrink-0 mt-0.5" />
        : <AlertCircle size={16} className="shrink-0 mt-0.5" />}
      <p className="text-sm leading-snug flex-1">{toast.message}</p>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Kapat"
        className="shrink-0 opacity-80 hover:opacity-100 transition-opacity"
      >
        <X size={14} />
      </button>
    </div>
  )
}
