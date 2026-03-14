"use client";

import * as React from "react";
import { tv, type VariantProps } from "tailwind-variants";

export const diffLineVariants = tv({
  base: "flex gap-2 px-4 py-2 font-mono text-sm",
  variants: {
    type: {
      added: "bg-[#0A1A0F]",
      removed: "bg-[#1A0A0A]",
      context: "bg-transparent",
    },
  },
  defaultVariants: {
    type: "context",
  },
});

export const diffLinePrefixVariants = tv({
  base: "w-4 flex-shrink-0 font-mono text-sm",
  variants: {
    type: {
      added: "text-accent-green",
      removed: "text-accent-red",
      context: "text-text-tertiary",
    },
  },
});

export const diffLineCodeVariants = tv({
  base: "flex-1 font-mono text-xs",
  variants: {
    type: {
      added: "text-text-primary",
      removed: "text-text-secondary",
      context: "text-text-secondary",
    },
  },
});

export interface DiffLineProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof diffLineVariants> {
  type: "added" | "removed" | "context";
  code: string;
}

export const DiffLine = React.forwardRef<HTMLDivElement, DiffLineProps>(
  ({ className, type, code, ...props }, ref) => {
    const prefix = type === "added" ? "+" : type === "removed" ? "-" : " ";

    return (
      <div className={diffLineVariants({ type, className })} ref={ref} {...props}>
        <span className={diffLinePrefixVariants({ type })}>{prefix}</span>
        <span className={diffLineCodeVariants({ type })}>{code}</span>
      </div>
    );
  }
);

DiffLine.displayName = "DiffLine";
