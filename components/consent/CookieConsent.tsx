'use client'

import { useEffect } from 'react'
import { analytics } from '@/lib/analytics'
import 'vanilla-cookieconsent/dist/cookieconsent.css'
import * as CookieConsent from 'vanilla-cookieconsent'

export default function CookieConsentBanner() {
  useEffect(() => {
    CookieConsent.run({
      guiOptions: {
        consentModal: {
          layout: 'box',
          position: 'bottom right',
          equalWeightButtons: true,
        },
      },

      categories: {
        necessary: {
          enabled: true,
          readOnly: true,
        },
        analytics: {
          autoClear: {
            cookies: [
              { name: /^ph_/ }, // PostHog
              { name: /^_ga/ }, // Google Analytics
            ],
          },
        },
        marketing: {},
      },

      language: {
        default: 'tr',
        translations: {
          tr: {
            consentModal: {
              title: '🍪 Çerezleri yönet',
              description:
                'Siteyi geliştirmek ve kullanımını anlamak için çerezler kullanıyoruz. Zorunlu çerezler her zaman aktiftir. Analitik çerezler için onayın gerekir.',
              acceptAllBtn: 'Tümünü kabul et',
              acceptNecessaryBtn: 'Sadece zorunlu',
              showPreferencesBtn: 'Tercihlerimi ayarla',
              footer:
                '<a href="/gizlilik">Gizlilik Politikası</a> · <a href="/cerez-politikasi">Çerez Politikası</a>',
            },
            preferencesModal: {
              title: 'Çerez tercihleri',
              acceptAllBtn: 'Tümünü kabul et',
              acceptNecessaryBtn: 'Sadece zorunlu',
              savePreferencesBtn: 'Seçimi kaydet',
              closeIconLabel: 'Kapat',
              sections: [
                {
                  title: 'Zorunlu Çerezler',
                  description:
                    'Oturum yönetimi ve güvenlik için gereklidir. Devre dışı bırakılamaz.',
                  linkedCategory: 'necessary',
                },
                {
                  title: 'Analitik Çerezler',
                  description:
                    'Siteyi nasıl kullandığınızı anlamak için PostHog kullanıyoruz. Veriler AB sunucularında saklanır ve anonim tutulur.',
                  linkedCategory: 'analytics',
                },
                {
                  title: 'Pazarlama Çerezleri',
                  description:
                    'Kişiselleştirilmiş reklamlar göstermek için kullanılır. Şu an aktif bir pazarlama aracı kullanmıyoruz.',
                  linkedCategory: 'marketing',
                },
              ],
            },
          },
        },
      },

      onFirstConsent: ({ cookie }) => {
        if (cookie.categories.includes('analytics')) {
          analytics.acceptAnalytics()
        }
      },

      onChange: ({ cookie }) => {
        if (cookie.categories.includes('analytics')) {
          analytics.acceptAnalytics()
        } else {
          analytics.rejectAnalytics()
        }
      },
    })
  }, [])

  return null
}
