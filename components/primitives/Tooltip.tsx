'use client'

import { useState, useRef, useEffect, cloneElement, isValidElement, type ReactNode } from 'react'

interface TooltipProps {
  content: string | null
  children: ReactNode
  side?: 'top' | 'bottom'
  visible?: boolean
}

export default function Tooltip({ content, children, side = 'top', visible }: TooltipProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const tooltipId = useRef(`tt-${Math.random().toString(36).slice(2, 9)}`)

  const open = () => {
    if (!content) return
    setIsOpen(true)
  }
  const close = () => setIsOpen(false)

  const handleTouchStart = () => {
    if (!content) return
    setIsOpen(true)
    if (dismissTimer.current) clearTimeout(dismissTimer.current)
    dismissTimer.current = setTimeout(() => setIsOpen(false), 2000)
  }

  useEffect(() => {
    return () => {
      if (dismissTimer.current) clearTimeout(dismissTimer.current)
    }
  }, [])

  const show = visible ?? (isOpen && !!content)

  // Pass aria-describedby directly to the child element when tooltip is visible
  const child = isValidElement(children)
    ? cloneElement(children as React.ReactElement<Record<string, unknown>>, {
        'aria-describedby': show && content ? tooltipId.current : undefined,
      })
    : children

  return (
    <span className="relative inline-block">
      <span
        onMouseEnter={open}
        onMouseLeave={close}
        onFocus={open}
        onBlur={close}
        onTouchStart={handleTouchStart}
      >
        {child}
      </span>
      {show && content && (
        <span
          role="tooltip"
          id={tooltipId.current}
          className={[
            'pointer-events-none absolute left-1/2 z-50 -translate-x-1/2 max-w-[calc(100vw-2rem)] whitespace-normal sm:whitespace-nowrap rounded-lg bg-rd-neutral-900 px-3 py-1.5 text-[13px] font-medium text-white animate-fade-in',
            side === 'top' ? 'bottom-full mb-2' : 'top-full mt-2',
          ].join(' ')}
        >
          {content}
          <span
            aria-hidden="true"
            className={[
              'absolute left-1/2 -translate-x-1/2 border-[6px] border-transparent',
              side === 'top'
                ? 'top-full border-t-rd-neutral-900'
                : 'bottom-full border-b-rd-neutral-900',
            ].join(' ')}
          />
        </span>
      )}
    </span>
  )
}
