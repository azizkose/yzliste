import React from "react";
import { cn } from "@/lib/utils";
import { Eyebrow } from "./Eyebrow";

export interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  eyebrow?: string;
  eyebrowColor?: "primary" | "neutral" | "accent";
  eyebrowIcon?: React.ReactNode;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  maxWidth?: string;
}

const eyebrowBgColor: Record<NonNullable<SectionHeaderProps["eyebrowColor"]>, string> = {
  primary: "bg-rd-primary-50",
  neutral: "bg-rd-neutral-100",
  accent: "bg-rd-accent-50",
};

export function SectionHeader({
  eyebrow,
  eyebrowColor = "primary",
  eyebrowIcon,
  title,
  subtitle,
  align = "center",
  maxWidth = "760px",
  className,
  ...props
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-10",
        align === "center" && "text-center",
        align === "left" && "text-left",
        className
      )}
      style={align === "center" ? { maxWidth, marginLeft: "auto", marginRight: "auto" } : { maxWidth }}
      {...props}
    >
      {eyebrow && (
        <div className="mb-4">
          <Eyebrow
            color={eyebrowColor}
            icon={eyebrowIcon}
            className={cn(
              "px-3.5 py-1.5 rounded-full",
              eyebrowBgColor[eyebrowColor]
            )}
          >
            {eyebrow}
          </Eyebrow>
        </div>
      )}

      <h2
        className={cn(
          "font-rd-display font-extrabold leading-tight tracking-tight",
          "text-3xl md:text-4xl lg:text-5xl",
          "text-rd-neutral-900",
          subtitle && "mb-4"
        )}
      >
        {title}
      </h2>

      {subtitle && (
        <p className="font-rd-body font-normal text-lg leading-relaxed text-rd-neutral-600">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default SectionHeader;

/*
Usage:
<SectionHeader
  eyebrow="Özellikler"
  title="Her pazaryeri için tek araç"
  subtitle="Trendyol, Hepsiburada, Amazon ve daha fazlası için AI destekli listing üret."
/>

<SectionHeader
  eyebrow="Nasıl çalışır?"
  eyebrowColor="accent"
  title="3 adımda hazır"
  align="left"
  maxWidth="600px"
/>
*/
