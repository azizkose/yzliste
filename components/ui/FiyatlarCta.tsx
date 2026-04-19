'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface FiyatlarCtaProps {
  className?: string
  variant?: 'primary' | 'paket'
  paketButonRenk?: string
  paketFiyatStr?: string
}

export default function FiyatlarCta({ className, variant = 'primary', paketButonRenk, paketFiyatStr }: FiyatlarCtaProps) {
  const [girisVar, setGirisVar] = useState<boolean | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setGirisVar(!!user && !user.is_anonymous)
    })
  }, [])

  const paketLabel = paketFiyatStr ? `Satın Al — ${paketFiyatStr}` : 'Satın Al'

  if (girisVar) {
    if (variant === 'paket') {
      return (
        <a href="/kredi-yukle" className={`block text-center ${paketButonRenk} text-white font-semibold py-3 rounded-xl text-sm transition-colors ${className ?? ''}`}>
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
      <a href="/kayit" className={`block text-center ${paketButonRenk} text-white font-semibold py-3 rounded-xl text-sm transition-colors ${className ?? ''}`}>
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
