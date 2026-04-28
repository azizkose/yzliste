'use client'

import { Loader2 } from 'lucide-react'

interface StickySaveBarProps {
  filledCount: number
  totalCount: number
  isDirty: boolean
  isSaving: boolean
  onSave: () => void
  onCancel: () => void
}

export default function StickySaveBar({
  filledCount,
  totalCount,
  isDirty,
  isSaving,
  onSave,
  onCancel,
}: StickySaveBarProps) {
  if (!isDirty) return null

  return (
    <div className="sticky bottom-0 z-40 bg-white border-t border-rd-neutral-200">
      <div className="max-w-5xl mx-auto px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-sm text-rd-neutral-600">
          <span className="font-medium text-rd-neutral-900">{filledCount}</span>
          {' / '}
          {totalCount} alan dolu
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSaving}
            className="px-4 py-2 rounded-lg text-sm text-rd-neutral-700 hover:bg-rd-neutral-100 transition-colors disabled:opacity-50"
          >
            İptal
          </button>

          <button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            aria-busy={isSaving}
            className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium text-white bg-rd-primary-700 hover:bg-rd-primary-800 transition-colors disabled:opacity-60"
          >
            {isSaving && <Loader2 size={14} className="animate-spin" />}
            {isSaving ? 'Kaydediliyor...' : 'Marka profilini kaydet'}
          </button>
        </div>
      </div>
    </div>
  )
}
