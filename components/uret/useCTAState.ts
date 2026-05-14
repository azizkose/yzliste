'use client'

import type { ActiveTab } from './useCalculateCredits'

interface CTAStateArgs {
  activeTab: ActiveTab
  productName?: string
  hasPhoto?: boolean
  selectedStylesCount?: number
  selectedPlatformsCount?: number
  isLoggedIn?: boolean
  hasUstKategori?: boolean
}

export interface CTAState {
  disabled: boolean
  reason: string | null
}

export function getCTAState(args: CTAStateArgs): CTAState {
  const {
    activeTab,
    productName = '',
    hasPhoto = false,
    selectedStylesCount = 0,
    selectedPlatformsCount = 0,
    isLoggedIn = true,
    hasUstKategori = false,
  } = args

  if (!isLoggedIn) return { disabled: true, reason: 'Önce giriş yap' }

  // Üst kategori tüm sekmeler için zorunlu
  if (!hasUstKategori) return { disabled: true, reason: 'Ürün tipini seç' }

  const productNameTrimmed = productName.trim()

  if (activeTab === 'metin') {
    if (!productNameTrimmed) return { disabled: true, reason: 'Önce ürün adını yaz' }
  }
  if (activeTab === 'gorsel') {
    if (!hasPhoto) return { disabled: true, reason: 'Önce fotoğraf yükle' }
    if (selectedStylesCount < 1) return { disabled: true, reason: 'En az bir stil seç' }
  }
  if (activeTab === 'video') {
    if (!hasPhoto) return { disabled: true, reason: 'Önce fotoğraf yükle' }
  }
  if (activeTab === 'sosyal') {
    if (!productNameTrimmed) return { disabled: true, reason: 'Önce ürün adını yaz' }
    if (selectedPlatformsCount < 1) return { disabled: true, reason: 'En az bir platform seç' }
  }

  return { disabled: false, reason: null }
}
