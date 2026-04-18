'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface FiyatlarCtaProps {
  className?: string
  variant?: 'primary' | 'paket'
  paketButonRenk?: string
}

export default function FiyatlarCta({ className, variant = 'primary', paketButonRenk }: FiyatlarCtaProps) {
  const [girisVar, setGirisVar] = useState<boolean | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setGirisVar(!!user && !user.is_anonymous)
    })
  }, [])

  // Loading state — show same as logged-out to avoid layout shift
  if (girisVar === null) {
    if (variant === 'paket') {
      return (
        <a href="/kayit" className={`block text-center ${paketButonRenk} text-white font-semibold py-3 rounded-xl text-sm transition-colors ${className ?? ''}`}>
          Başla
        </a>
      )
    }
    return (
      <a href="/kayit" className={className}>
        Ücretsiz Başla — 3 Kredi Hediye →
      </a>
    )
  }

  if (girisVar) {
    if (variant === 'paket') {
      return (
        <a href="/" className={`block text-center ${paketButonRenk} text-white font-semibold py-3 rounded-xl text-sm transition-colors ${className ?? ''}`}>
          İçerik Üret →
        </a>
      )
    }
    return (
      <a href="/" className={className}>
        İçerik Üretmeye Başla →
      </a>
    )
  }

  if (variant === 'paket') {
    return (
      <a href="/kayit" className={`block text-center ${paketButonRenk} text-white font-semibold py-3 rounded-xl text-sm transition-colors ${className ?? ''}`}>
        Başla
      </a>
    )
  }
  return (
    <a href="/kayit" className={className}>
      Ücretsiz Başla — 3 Kredi Hediye →
    </a>
  )
}
