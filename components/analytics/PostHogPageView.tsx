'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { analytics } from '@/lib/analytics'

// App Router'da otomatik $pageview yoktur — her route değişiminde biz tetikleriz.
// Bu component root layout'ta Suspense içinde render edilmeli.
function PageViewTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const url =
      window.location.origin +
      pathname +
      (searchParams.toString() ? '?' + searchParams.toString() : '')
    analytics.pageView(url)
  }, [pathname, searchParams])

  return null
}

import { Suspense } from 'react'

export default function PostHogPageView() {
  return (
    <Suspense fallback={null}>
      <PageViewTracker />
    </Suspense>
  )
}
