'use client'

export type ActiveTab = 'metin' | 'gorsel' | 'video' | 'sosyal'

interface CalculateCreditsArgs {
  activeTab: ActiveTab
  productName?: string
  hasPhoto?: boolean
  selectedStylesCount?: number
  videoLengthSec?: 5 | 10
  selectedPlatformsCount?: number
}

export function calculateCredits(args: CalculateCreditsArgs): number {
  const {
    activeTab,
    productName = '',
    hasPhoto = false,
    selectedStylesCount = 0,
    videoLengthSec = 5,
    selectedPlatformsCount = 0,
  } = args

  if (activeTab === 'metin') return productName.trim() || hasPhoto ? 1 : 0
  if (activeTab === 'gorsel') return selectedStylesCount
  if (activeTab === 'video') return hasPhoto ? (videoLengthSec === 10 ? 20 : 10) : 0
  if (activeTab === 'sosyal') return selectedPlatformsCount
  return 0
}
