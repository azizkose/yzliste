'use client'

import { type ReactNode, useId } from 'react'

interface ChipOption {
  id: string
  label: string
  description?: string
  icon?: ReactNode
}

interface ChipSelectorSingleProps {
  mode: 'single'
  options: ChipOption[]
  value: string
  onChange: (value: string) => void
  label?: string
  disabled?: boolean
}

interface ChipSelectorMultiProps {
  mode: 'multi'
  options: ChipOption[]
  value: string[]
  onChange: (value: string[]) => void
  label?: string
  disabled?: boolean
  max?: number
}

type ChipSelectorProps = ChipSelectorSingleProps | ChipSelectorMultiProps

export default function ChipSelector(props: ChipSelectorProps) {
  const groupId = useId()

  if (props.mode === 'single') {
    const { options, value, onChange, label, disabled } = props
    return (
      <div
        role="radiogroup"
        aria-label={label}
        className="flex flex-wrap gap-2"
      >
        {options.map((opt) => {
          const isActive = value === opt.id
          return (
            <button
              key={opt.id}
              type="button"
              role="radio"
              aria-checked={isActive}
              disabled={disabled}
              onClick={() => onChange(opt.id)}
              onKeyDown={(e) => {
                if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                  e.preventDefault()
                  const idx = options.findIndex((o) => o.id === opt.id)
                  const next = options[(idx + 1) % options.length]
                  onChange(next.id)
                  ;(e.currentTarget.parentElement?.querySelector(`[data-id="${next.id}"]`) as HTMLElement)?.focus()
                }
                if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                  e.preventDefault()
                  const idx = options.findIndex((o) => o.id === opt.id)
                  const prev = options[(idx - 1 + options.length) % options.length]
                  onChange(prev.id)
                  ;(e.currentTarget.parentElement?.querySelector(`[data-id="${prev.id}"]`) as HTMLElement)?.focus()
                }
              }}
              tabIndex={isActive ? 0 : -1}
              data-id={opt.id}
              className={[
                'flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm transition-all',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-rd-primary-500 focus-visible:ring-offset-1',
                disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
                isActive
                  ? 'bg-rd-primary-50 border-2 border-rd-primary-700 text-rd-primary-700 font-medium'
                  : 'bg-white border border-rd-neutral-300 text-rd-neutral-700 hover:border-rd-primary-400 hover:bg-rd-neutral-50',
              ].join(' ')}
            >
              {opt.icon && <span className="shrink-0 [&>svg]:size-4">{opt.icon}</span>}
              {opt.label}
            </button>
          )
        })}
      </div>
    )
  }

  // multi mode
  const { options, value, onChange, label, disabled, max } = props
  return (
    <div
      role="group"
      aria-label={label}
      id={groupId}
      className="flex flex-wrap gap-2"
    >
      {options.map((opt) => {
        const isActive = value.includes(opt.id)
        const isDisabled = disabled || (!isActive && max !== undefined && value.length >= max)
        return (
          <button
            key={opt.id}
            type="button"
            role="checkbox"
            aria-checked={isActive}
            disabled={isDisabled}
            onClick={() => {
              if (isActive) {
                onChange(value.filter((v) => v !== opt.id))
              } else if (!isDisabled) {
                onChange([...value, opt.id])
              }
            }}
            className={[
              'flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm transition-all',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-rd-primary-500 focus-visible:ring-offset-1',
              isDisabled && !isActive ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer',
              isActive
                ? 'bg-rd-primary-50 border-2 border-rd-primary-700 text-rd-primary-700 font-medium'
                : 'bg-white border border-rd-neutral-300 text-rd-neutral-700 hover:border-rd-primary-400 hover:bg-rd-neutral-50',
            ].join(' ')}
          >
            {opt.icon && <span className="shrink-0 [&>svg]:size-4">{opt.icon}</span>}
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
