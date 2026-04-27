'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { NAV_LINKS, NAV_BRAND, NAV_CTAS } from '@/lib/constants/hero'
import Button from '@/components/primitives/Button'
import Badge from '@/components/primitives/Badge'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const hamburgerRef = useRef<HTMLButtonElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (menuOpen) {
      closeRef.current?.focus()
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false)
        hamburgerRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  const closeMenu = () => {
    setMenuOpen(false)
    hamburgerRef.current?.focus()
  }

  return (
    <>
      <nav
        className={cn(
          'sticky top-0 z-40 transition-all duration-200',
          scrolled
            ? [
                'border-b border-slate-200',
                'bg-white/80',
                'backdrop-blur-md',
                '[-webkit-backdrop-filter:blur(12px)]',
              ]
            : 'bg-white/0'
        )}
        aria-label="Ana navigasyon"
      >
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-3">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rd-primary/40"
          >
            <span className="font-rd-display font-bold text-xl tracking-tight text-slate-900">
              {NAV_BRAND.name}
            </span>
            {NAV_BRAND.betaBadge && (
              <Badge variant="primary" size="sm">
                Beta
              </Badge>
            )}
          </Link>

          {/* Desktop nav links */}
          <div className="hidden items-center gap-6 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded text-sm text-slate-600 transition-colors hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rd-primary/40"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden items-center gap-2 md:flex">
            <Link href={NAV_CTAS.login.href} tabIndex={-1}>
              <Button variant="outline" size="sm">
                {NAV_CTAS.login.label}
              </Button>
            </Link>
            <Link href={NAV_CTAS.primary.href} tabIndex={-1}>
              <Button variant="primary" size="sm">
                {NAV_CTAS.primary.label}
              </Button>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            ref={hamburgerRef}
            className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rd-primary/40 md:hidden"
            onClick={() => setMenuOpen(true)}
            aria-label="Menüyü aç"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <Menu size={20} aria-hidden="true" />
          </button>
        </div>
      </nav>

      {/* Mobile overlay menu */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="fixed inset-0 z-50 md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Mobil navigasyon"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/40"
            onClick={closeMenu}
            aria-hidden="true"
          />

          {/* Panel */}
          <div className="absolute right-0 top-0 flex h-full w-72 flex-col bg-white">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <span className="font-rd-display font-bold text-lg tracking-tight text-slate-900">
                {NAV_BRAND.name}
              </span>
              <button
                ref={closeRef}
                className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rd-primary/40"
                onClick={closeMenu}
                aria-label="Menüyü kapat"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>

            {/* Nav links */}
            <div className="flex flex-col gap-1 px-4 py-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-lg px-3 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rd-primary/40"
                  onClick={closeMenu}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* CTAs */}
            <div className="mt-auto flex flex-col gap-2 px-4 pb-8">
              <Link
                href={NAV_CTAS.login.href}
                onClick={closeMenu}
                tabIndex={-1}
              >
                <Button variant="outline" size="md" fullWidth>
                  {NAV_CTAS.login.label}
                </Button>
              </Link>
              <Link
                href={NAV_CTAS.primary.href}
                onClick={closeMenu}
                tabIndex={-1}
              >
                <Button variant="primary" size="md" fullWidth>
                  {NAV_CTAS.primary.label}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
