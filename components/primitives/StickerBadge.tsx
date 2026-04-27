import React from 'react'
import { cn } from '@/lib/utils'

export interface StickerBadgeProps {
  icon: React.ReactNode
  label: string
  color: string
  borderColor: string
  className?: string
}

export function StickerBadge({ icon, label, color, borderColor, className }: StickerBadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full bg-white py-1.5 px-3 font-rd-body text-[11px] font-semibold [box-shadow:var(--shadow-rd-md)]',
        className
      )}
      style={{ border: `1px solid ${borderColor}` }}
    >
      <span style={{ color }}>{icon}</span>
      {label}
    </div>
  )
}

export default StickerBadge

/*
Usage:
<div className="relative">
  <StickerBadge
    icon={<Check size={14} strokeWidth={2} />}
    label="7 pazaryeri için optimize"
    color="#1E40AF"
    borderColor="#DBEAFE"
    className="absolute -top-3 right-5"
  />
</div>
*/
