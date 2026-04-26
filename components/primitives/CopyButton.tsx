"use client";

import React, { useState, useRef, useCallback } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CopyButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  text: string;
  label?: string;
  copiedLabel?: string;
  size?: "sm" | "md";
  variant?: "default" | "minimal";
}

const sizeClasses: Record<NonNullable<CopyButtonProps["size"]>, string> = {
  sm: "px-2 py-1 text-xs",
  md: "px-3 py-1.5 text-sm",
};

const iconSize: Record<NonNullable<CopyButtonProps["size"]>, number> = {
  sm: 12,
  md: 14,
};

async function copyToClipboard(text: string): Promise<boolean> {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // fall through to execCommand
    }
  }
  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.cssText = "position:fixed;top:-9999px;left:-9999px;opacity:0;";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const success = document.execCommand("copy");
    document.body.removeChild(textarea);
    return success;
  } catch {
    return false;
  }
}

export function CopyButton({
  text,
  label = "Kopyala",
  copiedLabel = "Kopyalandı",
  size = "md",
  variant = "default",
  className,
  ...props
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClick = useCallback(async () => {
    const success = await copyToClipboard(text);
    if (!success) {
      console.warn("CopyButton: clipboard API failed");
      return;
    }
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setCopied(true);
    timeoutRef.current = setTimeout(() => setCopied(false), 1500);
  }, [text]);

  const icon = copied
    ? <Check size={iconSize[size]} aria-hidden="true" />
    : <Copy size={iconSize[size]} aria-hidden="true" />;

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "inline-flex items-center gap-1.5 font-rd-body font-medium rounded-lg",
        "transition-all duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rd-primary/40",
        sizeClasses[size],
        variant === "default" && !copied && "border border-rd-neutral-200 bg-white text-rd-neutral-600 hover:border-rd-neutral-300 hover:text-rd-neutral-800",
        variant === "default" && copied && "border border-emerald-200 bg-emerald-50 text-emerald-600",
        variant === "minimal" && !copied && "text-rd-neutral-600 hover:text-rd-neutral-800",
        variant === "minimal" && copied && "text-emerald-600",
        className
      )}
      {...props}
    >
      {icon}
      {label && (
        <span>{copied ? copiedLabel : label}</span>
      )}
      <span aria-live="polite" className="sr-only">
        {copied ? copiedLabel : ""}
      </span>
    </button>
  );
}

export default CopyButton;

/*
Usage:
<CopyButton text="Kopyalanacak metin" />
<CopyButton text={listingText} size="sm" label="Kopyala" copiedLabel="Kopyalandı" />
<CopyButton text={content} variant="minimal" size="sm" />
*/
