/**
 * Analytics — PostHog EU Cloud üzerinden.
 * Başlangıçta opt-out; cookie consent onaylanınca opt-in olur.
 */

import posthog from 'posthog-js'

function isClient() {
  return typeof window !== 'undefined'
}

export const analytics = {
  init() {
    if (!isClient()) return
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
    if (!key) return // Key ayarlanmamışsa sessizce geç

    posthog.init(key, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://eu.i.posthog.com',
      person_profiles: 'identified_only', // Anonim kullanıcı için profil oluşturma
      capture_pageview: false,            // Manuel $pageview (App Router için)
      capture_pageleave: true,
    })

    // Consent gelene kadar hiçbir şey gönderme
    posthog.opt_out_capturing()
  },

  // Cookie consent → Analitik kabul edildi
  acceptAnalytics() {
    if (!isClient()) return
    posthog.opt_in_capturing()
    // Google Consent Mode v2
    if ((window as { gtag?: (...args: unknown[]) => void }).gtag) {
      (window as { gtag?: (...args: unknown[]) => void }).gtag!('consent', 'update', { analytics_storage: 'granted' })
    }
  },

  // Cookie consent → Analitik reddedildi
  rejectAnalytics() {
    if (!isClient()) return
    posthog.opt_out_capturing()
    posthog.reset()
    if ((window as { gtag?: (...args: unknown[]) => void }).gtag) {
      (window as { gtag?: (...args: unknown[]) => void }).gtag!('consent', 'update', { analytics_storage: 'denied' })
    }
  },

  // App Router sayfa geçişlerinde manuel $pageview
  pageView(url: string) {
    if (!isClient()) return
    posthog.capture('$pageview', { $current_url: url })
  },

  // Giriş sonrası kullanıcıyı tanımla
  identify(userId: string, props: {
    email: string
    plan?: string
    signup_date?: string
    total_generations?: number
  }) {
    if (!isClient()) return
    posthog.identify(userId, props)
  },

  // Çıkış sonrası temizle
  reset() {
    if (!isClient()) return
    posthog.reset()
  },

  // ── 9 custom event ──────────────────────────────────────────

  signupStarted() {
    posthog.capture('signup_started')
  },

  signupCompleted(props: { method: 'email' | 'google' }) {
    posthog.capture('signup_completed', props)
  },

  generationStarted(props: { platform: string; type: 'metin' | 'gorsel' | 'video' | 'sosyal' }) {
    posthog.capture('generation_started', props)
  },

  generationCompleted(props: { platform: string; type: string; credits_remaining: number }) {
    posthog.capture('generation_completed', props)
  },

  generationFailed(props: { platform: string; type: string; error: string }) {
    posthog.capture('generation_failed', props)
  },

  creditPurchaseStarted(props: { package_id: string; price: number }) {
    posthog.capture('credit_purchase_started', props)
  },

  creditPurchaseCompleted(props: { package_id: string; price: number; credits: number }) {
    posthog.capture('credit_purchase_completed', props)
  },

  creditExhausted() {
    posthog.capture('credit_exhausted')
  },

  shareClicked(props: { content_type: string }) {
    posthog.capture('share_clicked', props)
  },
}
