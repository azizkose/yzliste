import { useEffect, useState } from 'react'
import posthog from 'posthog-js'

/**
 * PostHog feature flag hook.
 * Returns true by default (fail-open) so missing/unloaded flags never block access.
 * Flag naming convention: ff-{feature-name}
 *
 * Usage:
 *   const yzstudioEnabled = useFeatureFlag('ff-yzstudio')
 *   if (yzstudioEnabled === null) return <Loading />  // still evaluating
 *   if (!yzstudioEnabled) return <AccessDenied />
 */
export function useFeatureFlag(flagName: string): boolean | null {
  const [value, setValue] = useState<boolean | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    // PostHog might not be initialized yet (e.g. consent not given, key missing)
    try {
      const flag = posthog.isFeatureEnabled(flagName)
      // undefined = not yet loaded, wait for onFeatureFlags callback
      if (flag !== undefined) {
        setValue(flag ?? true)
        return
      }

      posthog.onFeatureFlags(() => {
        const loaded = posthog.isFeatureEnabled(flagName)
        setValue(loaded ?? true) // flag missing in PostHog → treat as enabled
      })
    } catch {
      setValue(true) // PostHog not initialized → fail open
    }
  }, [flagName])

  return value
}

/**
 * Synchronous check — use only where you're sure flags are already loaded.
 * Falls back to true if unavailable.
 */
export function getFeatureFlag(flagName: string): boolean {
  if (typeof window === 'undefined') return true
  try {
    return posthog.isFeatureEnabled(flagName) ?? true
  } catch {
    return true
  }
}

// Known flags — type-safe constants
export const FF = {
  YZSTUDIO: 'ff-yzstudio',
} as const
