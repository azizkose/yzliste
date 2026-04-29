import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "success" | "warning" | "danger" | "neutral" | "accent";
  size?: "sm" | "md";
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const variantClasses: Record<NonNullable<BadgeProps["variant"]>, string> = {
  primary: "bg-rd-primary-50 text-rd-primary-800",
  success: "bg-emerald-50 text-emerald-800",
  warning: "bg-amber-50 text-amber-800",
  danger: "bg-red-50 text-red-800",
  neutral: "bg-rd-neutral-100 text-rd-neutral-700",
  accent: "bg-rd-accent-50 text-rd-accent-700",
};

const sizeClasses: Record<NonNullable<BadgeProps["size"]>, string> = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-xs",
};

export function Badge({
  variant = "neutral",
  size = "md",
  icon,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-rd-body font-medium",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {icon && (
        <span className="shrink-0 w-3 h-3 flex items-center justify-center" aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
    </span>
  );
}

export default Badge;

/*
Usage:
<Badge variant="primary">Yeni</Badge>
<Badge variant="success" size="sm">Aktif</Badge>
<Badge variant="danger" icon={<AlertCircle size={12} />}>Hata</Badge>
*/
