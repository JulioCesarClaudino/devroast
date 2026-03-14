"use client";

import * as React from "react";
import { tv, type VariantProps } from "tailwind-variants";

export const badgeVariants = tv({
  base: "inline-flex items-center gap-2 font-mono text-sm",
  variants: {
    variant: {
      critical: "[&_.dot]:bg-accent-red",
      warning: "[&_.dot]:bg-accent-amber",
      good: "[&_.dot]:bg-accent-green",
      verdict: "[&_.dot]:bg-accent-red",
    },
  },
  defaultVariants: {
    variant: "critical",
  },
});

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  label?: React.ReactNode;
}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, label, ...props }, ref) => (
    <div className={badgeVariants({ variant, className })} ref={ref} {...props}>
      <div className="dot w-2 h-2 rounded-full" />
      {label && <span>{label}</span>}
    </div>
  )
);

Badge.displayName = "Badge";
