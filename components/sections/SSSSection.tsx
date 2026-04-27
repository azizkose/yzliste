'use client'

import { useState } from 'react'
import SectionHeader from '@/components/primitives/SectionHeader'
import { ChevronDown, Mail, ArrowRight } from 'lucide-react'
import { SSS_HEADER, FAQ_ITEMS, CONTACT_NOTE } from '@/lib/constants/sss-landing'

function FAQItem({
  question,
  answer,
  isOpen,
  onToggle,
  index,
}: {
  question: string
  answer: string
  isOpen: boolean
  onToggle: () => void
  index: number
}) {
  const id = `faq-${index}`

  return (
    <div role="listitem">
      <button
        id={`${id}-trigger`}
        aria-expanded={isOpen}
        aria-controls={`${id}-panel`}
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 py-5 text-left transition-colors hover:text-rd-primary-600"
      >
        <span className="text-sm font-medium text-rd-neutral-900">{question}</span>
        <ChevronDown
          className={`h-4 w-4 flex-shrink-0 text-rd-neutral-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      <div
        id={`${id}-panel`}
        role="region"
        aria-labelledby={`${id}-trigger`}
        className="grid transition-[grid-template-rows] duration-200 ease-out"
        style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <p className="pb-5 text-sm leading-relaxed text-rd-neutral-500">
            {answer}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function SSSSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggle = (i: number) => {
    setOpenIndex(prev => (prev === i ? null : i))
  }

  return (
    <section className="py-20 md:py-28 bg-white" aria-labelledby="sss-heading">
      <div className="mx-auto max-w-3xl px-5">
        <SectionHeader
          eyebrow={SSS_HEADER.eyebrow}
          eyebrowColor="primary"
          title={SSS_HEADER.title}
          subtitle={SSS_HEADER.subtitle}
          id="sss-heading"
        />

        {/* FAQ list */}
        <div className="mt-12 divide-y divide-rd-neutral-200" role="list">
          {FAQ_ITEMS.map((item, i) => (
            <FAQItem
              key={i}
              question={item.question}
              answer={item.answer}
              isOpen={openIndex === i}
              onToggle={() => toggle(i)}
              index={i}
            />
          ))}
        </div>

        {/* ContactNote */}
        <div className="mt-10 flex flex-col items-center gap-3 rounded-lg bg-rd-neutral-50 p-6 text-center sm:flex-row sm:justify-between sm:text-left">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-rd-neutral-400" aria-hidden="true" />
            <div>
              <p className="text-sm font-medium text-rd-neutral-700">{CONTACT_NOTE.text}</p>
              <a
                href={`mailto:${CONTACT_NOTE.email}`}
                className="text-sm text-rd-primary-600 hover:text-rd-primary-700 transition-colors"
              >
                {CONTACT_NOTE.email}
              </a>
            </div>
          </div>
          <a
            href={CONTACT_NOTE.allQuestionsLink}
            className="inline-flex items-center gap-1 text-sm text-rd-primary-600 hover:text-rd-primary-700 transition-colors"
          >
            {CONTACT_NOTE.allQuestionsText}
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  )
}
