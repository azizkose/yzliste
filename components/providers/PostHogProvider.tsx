'use client'

import { useEffect } from 'react'
import { analytics } from '@/lib/analytics'

export default function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    analytics.init()
  }, [])

  return <>{children}</>
}
