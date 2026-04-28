import { ShoppingCart, Gift, Undo2, Minus } from 'lucide-react'

export type IslemTuru = 'satin_alim' | 'hediye' | 'iade' | 'kullanim'

interface TransactionConfig {
  label: string
  Icon: React.ElementType
  className: string
}

const TRANSACTION_CONFIG: Record<IslemTuru, TransactionConfig> = {
  satin_alim: {
    label: 'Satın alım',
    Icon: ShoppingCart,
    className: 'bg-rd-primary-50 text-rd-primary-700 border-rd-primary-200',
  },
  hediye: {
    label: 'Hediye',
    Icon: Gift,
    className: 'bg-rd-success-50 text-rd-success-700 border-rd-success-200',
  },
  iade: {
    label: 'İade',
    Icon: Undo2,
    className: 'bg-rd-warning-50 text-rd-warning-700 border-rd-warning-200',
  },
  kullanim: {
    label: 'Kullanım',
    Icon: Minus,
    className: 'bg-rd-neutral-100 text-rd-neutral-600 border-rd-neutral-200',
  },
}

interface TransactionBadgeProps {
  tur: IslemTuru
  label?: string
}

export default function TransactionBadge({ tur, label }: TransactionBadgeProps) {
  const config = TRANSACTION_CONFIG[tur]
  const { Icon } = config
  const displayLabel = label ?? config.label
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border ${config.className}`}
      aria-label={`İşlem türü: ${displayLabel}`}
    >
      <Icon size={11} strokeWidth={2} aria-hidden="true" />
      {displayLabel}
    </span>
  )
}
