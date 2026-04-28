"use client";

import { useState, useId, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

export interface AccordionItem {
  id: string;
  trigger: string;
  content: ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  defaultOpen?: number | null;
  idPrefix?: string;
}

function AccordionItemComponent({
  item,
  isOpen,
  onToggle,
  triggerId,
  panelId,
}: {
  item: AccordionItem;
  isOpen: boolean;
  onToggle: () => void;
  triggerId: string;
  panelId: string;
}) {
  return (
    <div role="listitem">
      <button
        id={triggerId}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 py-5 text-left transition-colors hover:text-rd-primary-600"
      >
        <span className="text-sm font-medium text-rd-neutral-900">
          {item.trigger}
        </span>
        <ChevronDown
          className={`h-4 w-4 flex-shrink-0 text-rd-neutral-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </button>
      <div
        id={panelId}
        role="region"
        aria-labelledby={triggerId}
        className="grid transition-[grid-template-rows] duration-200 ease-out"
        style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div className="pb-5 text-sm leading-relaxed text-rd-neutral-500">
            {item.content}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Accordion({
  items,
  defaultOpen = null,
  idPrefix,
}: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpen);
  const generatedId = useId();
  const prefix = idPrefix ?? generatedId.replace(/:/g, "");

  const toggle = (i: number) =>
    setOpenIndex((prev) => (prev === i ? null : i));

  return (
    <div className="divide-y divide-rd-neutral-200" role="list">
      {items.map((item, i) => (
        <AccordionItemComponent
          key={item.id}
          item={item}
          isOpen={openIndex === i}
          onToggle={() => toggle(i)}
          triggerId={`${prefix}-${item.id}-trigger`}
          panelId={`${prefix}-${item.id}-panel`}
        />
      ))}
    </div>
  );
}
