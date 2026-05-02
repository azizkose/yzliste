'use client'

import { useCurrentUser } from '@/lib/hooks/useCurrentUser'

interface FiyatlarCtaProps {
  className?: string
  variant?: 'primary' | 'paket'
  paketButonRenk?: string
  paketFiyatStr?: string
}

export default function FiyatlarCta({ className, variant = 'primary', paketButonRenk, paketFiyatStr }: FiyatlarCtaProps) {
  const { data: currentUser, isLoading } = useCurrentUser()
  const girisVar = !isLoading && currentUser != null && !currentUser.anonim

  const paketLabel = paketFiyatStr ? `Satın Al — ${paketFiyatStr}` : 'Satın Al'

  if (girisVar) {
    if (variant === 'paket') {
      return (
        <a href="/kredi-yukle" className={`block text-center ${paketButonRenk} text-white font-medium py-3 rounded-xl text-sm transition-colors ${className ?? ''}`}>
          Satın Al →
        </a>
      )
    }
    return (
      <a href="/uret" className={className}>
        İçerik Üretmeye Başla →
      </a>
    )
  }

  if (variant === 'paket') {
    return (
      <a href="/kayit" className={`block text-center ${paketButonRenk} text-white font-medium py-3 rounded-xl text-sm transition-colors ${className ?? ''}`}>
        {paketLabel}
      </a>
    )
  }
  return (
    <a href="/kayit" className={className}>
      Ücretsiz Başla — 3 Kredi Hediye →
    </a>
  )
}
