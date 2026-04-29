import React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "bordered";
  padding?: "none" | "sm" | "md" | "lg";
  children: React.ReactNode;
}

const variantClasses: Record<NonNullable<CardProps["variant"]>, string> = {
  default: "bg-white border border-rd-neutral-200",
  elevated: "bg-white border border-rd-neutral-200 shadow-rd-sm",
  bordered: "bg-white border-2 border-rd-primary/20",
};

const paddingClasses: Record<NonNullable<CardProps["padding"]>, string> = {
  none: "",
  sm: "p-4",
  md: "p-5",
  lg: "p-6",
};

export function Card({
  variant = "default",
  padding = "md",
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-rd-card overflow-hidden",
        variantClasses[variant],
        paddingClasses[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;

/*
Usage:
<Card>Varsayılan kart</Card>
<Card variant="elevated" padding="lg">Gölgeli kart</Card>
<Card variant="bordered" padding="sm">Kenarlıklı kart</Card>
*/
