import { Clock, Check, Mail, AlertCircle } from 'lucide-react'

export type StatusType = 'preparing' | 'ready' | 'sent' | 'error'

interface StatusConfig {
  label: string
  icon: React.ElementType
  className: string
  ariaLabel: string
}

const STATUS_CONFIG: Record<StatusType, StatusConfig> = {
  preparing: {
    label: 'Hazırlanıyor',
    icon: Clock,
    className: 'bg-rd-warning-50 text-rd-warning-700 border-rd-warning-200',
    ariaLabel: 'Durum: Hazırlanıyor',
  },
  ready: {
    label: 'Hazır',
    icon: Check,
    className: 'bg-rd-success-50 text-rd-success-700 border-rd-success-200',
    ariaLabel: 'Durum: Hazır — indirilebilir',
  },
  sent: {
    label: 'Gönderildi',
    icon: Mail,
    className: 'bg-rd-primary-50 text-rd-primary-700 border-rd-primary-200',
    ariaLabel: 'Durum: E-posta ile gönderildi',
  },
  error: {
    label: 'Hata',
    icon: AlertCircle,
    className: 'bg-rd-danger-50 text-rd-danger-700 border-rd-danger-200',
    ariaLabel: 'Durum: Hata — düzeltme gerekiyor',
  },
}

interface StatusBadgeProps {
  status: StatusType
  label?: string
}

export default function StatusBadge({ status, label }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status]
  const Icon = config.icon
  const displayLabel = label ?? config.label
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${config.className}`}
      aria-label={label ? `Durum: ${label}` : config.ariaLabel}
    >
      <Icon size={12} strokeWidth={2} aria-hidden="true" />
      {displayLabel}
    </span>
  )
}
