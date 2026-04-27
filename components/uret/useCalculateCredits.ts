'use client'

export type ActiveTab = 'metin' | 'gorsel' | 'video' | 'sosyal'

interface CalculateCreditsArgs {
  activeTab: ActiveTab
  selectedStylesCount?: number   // gorsel için
  videoLengthSec?: 5 | 10        // video için
  selectedPlatformsCount?: number // sosyal için
}

export function calculateCredits(args: CalculateCreditsArgs): number {
  const { activeTab, selectedStylesCount = 0, videoLengthSec = 5, selectedPlatformsCount = 0 } = args

  if (activeTab === 'metin') return 1
  if (activeTab === 'gorsel') return Math.max(1, selectedStylesCount)
  if (activeTab === 'video') return videoLengthSec === 10 ? 20 : 10
  if (activeTab === 'sosyal') return Math.max(1, selectedPlatformsCount)
  return 1
}
