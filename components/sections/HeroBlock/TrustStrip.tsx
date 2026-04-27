'use client'

import { Flag, Lock, Zap } from 'lucide-react'
import { TRUST_STRIP_ITEMS } from '@/lib/constants/hero'

const TRUST_STRIP_ICONS: Record<string, React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>> = {
  Flag,
  Lock,
  Zap,
}

export default function TrustStrip() {
  return (
    <div className="border-b border-slate-200 bg-rd-neutral-50">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-center gap-x-8 gap-y-1 px-6 py-2.5">
        {TRUST_STRIP_ITEMS.map((item, i) => {
          const Icon = TRUST_STRIP_ICONS[item.icon]
          return (
            <div key={i} className="flex items-center gap-1.5">
              {Icon && (
                <Icon size={13} strokeWidth={2} className="text-slate-400" aria-hidden="true" />
              )}
              <span className="text-xs text-slate-500">{item.label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
