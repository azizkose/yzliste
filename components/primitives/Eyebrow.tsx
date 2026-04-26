import React from "react";
import { cn } from "@/lib/utils";

export interface EyebrowProps extends React.HTMLAttributes<HTMLSpanElement> {
  icon?: React.ReactNode;
  color?: "primary" | "neutral" | "accent";
  children: React.ReactNode;
}

const colorClasses: Record<NonNullable<EyebrowProps["color"]>, string> = {
  primary: "text-rd-primary",
  neutral: "text-rd-neutral-400",
  accent: "text-rd-accent",
};

export function Eyebrow({
  icon,
  color = "primary",
  className,
  children,
  ...props
}: EyebrowProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5",
        "font-rd-body text-xs font-semibold tracking-[0.1em] uppercase",
        colorClasses[color],
        className
      )}
      {...props}
    >
      {icon && (
        <span className="shrink-0 w-3.5 h-3.5 flex items-center justify-center" aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
    </span>
  );
}

export default Eyebrow;

/*
Usage:
<Eyebrow>Özellikler</Eyebrow>
<Eyebrow color="accent" icon={<Zap size={14} />}>Yeni</Eyebrow>
<Eyebrow color="neutral">Bölüm başlığı</Eyebrow>
*/
