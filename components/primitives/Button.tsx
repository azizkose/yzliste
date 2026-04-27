"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-rd-primary text-white hover:bg-rd-primary-700",
  secondary:
    "bg-rd-neutral-100 text-rd-neutral-800 hover:bg-rd-neutral-200",
  ghost:
    "bg-transparent text-rd-neutral-600 hover:bg-rd-neutral-100",
  outline:
    "bg-transparent text-rd-primary border border-rd-primary/30 hover:bg-rd-primary-50",
};

const sizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
};

const Spinner = () => (
  <span
    className="inline-block w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin"
    aria-hidden="true"
  />
);

export function Button({
  variant = "primary",
  size = "md",
  icon,
  iconRight,
  loading = false,
  fullWidth = false,
  className,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 font-rd-body font-medium",
        "rounded-rd-button transition-all duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rd-primary/40 focus-visible:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && "w-full",
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Spinner /> : icon}
      {children}
      {!loading && iconRight}
    </button>
  );
}

export default Button;

/*
Usage:
<Button variant="primary" size="md">Üret</Button>
<Button variant="outline" size="sm" icon={<Plus size={14} />}>Ekle</Button>
<Button variant="secondary" loading>Yükleniyor</Button>
<Button fullWidth variant="primary">Giriş yap</Button>
*/
