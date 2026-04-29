// components/sections/FooterSection.tsx
import Link from 'next/link'
import { MapPin } from 'lucide-react'
import {
  FOOTER_BRAND,
  FOOTER_COLUMNS,
  FOOTER_COPYRIGHT,
  FOOTER_DISCLAIMER,
  FOOTER_IYZICO_LOGO,
} from '@/lib/constants/footer-landing'

export default function FooterSection() {
  return (
    <footer className="border-t border-rd-neutral-200 bg-rd-neutral-50 pt-12 pb-8" role="contentinfo">
      <div className="mx-auto max-w-6xl px-5">

        {/* Top grid: brand + 3 link columns */}
        <div className="grid gap-8 md:grid-cols-4">

          {/* Brand column */}
          <div>
            <p
              className="text-lg font-medium text-rd-neutral-900"
              style={{ fontFamily: 'var(--font-rd-display)' }}
            >
              {FOOTER_BRAND.name}
            </p>
            <p className="mt-2 text-sm text-rd-neutral-500">{FOOTER_BRAND.tagline}</p>
            <p className="mt-3 flex items-center gap-1.5 text-xs text-rd-neutral-400">
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              {FOOTER_BRAND.location}
            </p>
          </div>

          {/* Link columns */}
          {FOOTER_COLUMNS.map(col => (
            <div key={col.title}>
              <p className="text-xs font-medium text-rd-neutral-400 uppercase tracking-wider">
                {col.title}
              </p>
              <ul className="mt-3 space-y-2" role="list">
                {col.links.map(link => (
                  <li key={link.href}>
                    {link.href.startsWith('mailto:') ? (
                      <a
                        href={link.href}
                        className="text-sm text-rd-neutral-600 transition-colors hover:text-rd-primary-600"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-rd-neutral-600 transition-colors hover:text-rd-primary-600"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="mt-10 border-t border-rd-neutral-200" aria-hidden="true" />

        {/* FooterMid: copyright + iyzico */}
        <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <p className="text-xs text-rd-neutral-400">{FOOTER_COPYRIGHT}</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={FOOTER_IYZICO_LOGO}
            alt="iyzico ile güvenli ödeme"
            className="h-6 w-auto"
          />
        </div>

        {/* Disclaimer */}
        <p className="mt-6 mx-auto max-w-3xl text-center text-xs italic text-rd-neutral-400 leading-relaxed">
          {FOOTER_DISCLAIMER}
        </p>

      </div>
    </footer>
  )
}
