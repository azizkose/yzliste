"use client";

import React, { useRef } from "react";
import { cn } from "@/lib/utils";

export interface TabListProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "pill" | "underline";
  children: React.ReactNode;
}

export interface TabItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean;
  color?: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  children: React.ReactNode;
}

export function TabList({
  variant = "pill",
  className,
  children,
  onKeyDown,
  ...props
}: TabListProps) {
  const ref = useRef<HTMLDivElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const tabs = ref.current?.querySelectorAll<HTMLButtonElement>(
      '[role="tab"]:not([disabled])'
    );
    if (!tabs || tabs.length === 0) return;

    const tabArray = Array.from(tabs);
    const focused = document.activeElement as HTMLButtonElement;
    const currentIndex = tabArray.indexOf(focused);

    let nextIndex: number | null = null;
    if (e.key === "ArrowRight") nextIndex = (currentIndex + 1) % tabArray.length;
    else if (e.key === "ArrowLeft") nextIndex = (currentIndex - 1 + tabArray.length) % tabArray.length;
    else if (e.key === "Home") nextIndex = 0;
    else if (e.key === "End") nextIndex = tabArray.length - 1;

    if (nextIndex !== null) {
      e.preventDefault();
      tabArray[nextIndex].focus();
    }

    onKeyDown?.(e);
  };

  return (
    <div
      ref={ref}
      role="tablist"
      onKeyDown={handleKeyDown}
      className={cn(
        variant === "pill" && "flex flex-wrap gap-2",
        variant === "underline" && "flex border-b border-rd-neutral-200",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function TabItem({
  isActive = false,
  color = "#2563EB",
  icon,
  badge,
  className,
  children,
  ...props
}: TabItemProps) {
  return (
    <button
      role="tab"
      aria-selected={isActive}
      tabIndex={isActive ? 0 : -1}
      style={
        isActive
          ? ({
              "--tab-color": color,
              borderColor: color,
              color: color,
              backgroundColor: `color-mix(in srgb, ${color} 8%, white)`,
            } as React.CSSProperties)
          : undefined
      }
      className={cn(
        "inline-flex items-center gap-2 font-rd-body text-sm transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rd-primary/40",
        // pill variant styles
        "px-4 py-2.5 rounded-xl",
        !isActive && [
          "bg-white border border-rd-neutral-200 text-rd-neutral-600 font-medium",
          "hover:bg-rd-neutral-50 hover:border-rd-neutral-300",
        ],
        isActive && "font-bold border-[1.5px]",
        className
      )}
      {...props}
    >
      {icon && (
        <span className="shrink-0 w-4 h-4 flex items-center justify-center" aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
      {badge && (
        <span
          className="pl-2 ml-2 border-l"
          style={isActive ? { borderColor: `color-mix(in srgb, ${color} 20%, transparent)` } : { borderColor: "transparent" }}
        >
          {badge}
        </span>
      )}
    </button>
  );
}

export function TabItemUnderline({
  isActive = false,
  color = "#2563EB",
  icon,
  className,
  children,
  ...props
}: TabItemProps) {
  return (
    <button
      role="tab"
      aria-selected={isActive}
      tabIndex={isActive ? 0 : -1}
      style={
        isActive
          ? { borderBottomColor: color, color: color }
          : undefined
      }
      className={cn(
        "inline-flex items-center gap-2 font-rd-body text-sm px-4 py-3 transition-all duration-200",
        "border-b-2 border-transparent -mb-px",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rd-primary/40",
        !isActive && "text-rd-neutral-600 font-medium bg-transparent hover:text-rd-neutral-800",
        isActive && "font-bold bg-white",
        className
      )}
      {...props}
    >
      {icon && (
        <span className="shrink-0 w-4 h-4 flex items-center justify-center" aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
    </button>
  );
}

export default TabItem;

/*
Usage (pill):
<TabList variant="pill">
  <TabItem isActive={active === 0} color="#2563EB" onClick={() => setActive(0)}>Metin</TabItem>
  <TabItem isActive={active === 1} color="#7C3AED" onClick={() => setActive(1)}>Görsel</TabItem>
</TabList>

Usage (underline):
<TabList variant="underline">
  <TabItemUnderline isActive={active === 0} color="#2563EB" onClick={() => setActive(0)}>Metin</TabItemUnderline>
  <TabItemUnderline isActive={active === 1} color="#7C3AED" onClick={() => setActive(1)}>Görsel</TabItemUnderline>
</TabList>
*/
