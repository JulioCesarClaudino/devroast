"use client";

import { Slot } from "@radix-ui/react-slot";
import * as React from "react";
import { tv, type VariantProps } from "tailwind-variants";

export const buttonVariants = tv({
  base: "inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  variants: {
    variant: {
      primary:
        "bg-accent-green text-bg-page enabled:hover:bg-green-600 active:bg-green-700 focus-visible:ring-accent-green",
      secondary:
        "bg-gray-200 text-gray-900 enabled:hover:bg-gray-300 active:bg-gray-400 dark:bg-gray-700 dark:text-gray-100 dark:enabled:hover:bg-gray-600 dark:active:bg-gray-500 focus-visible:ring-gray-500",
      outline:
        "border-2 border-gray-300 text-gray-700 enabled:hover:bg-gray-50 active:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:enabled:hover:bg-gray-900 dark:active:bg-gray-800 focus-visible:ring-gray-400",
      ghost:
        "text-gray-700 enabled:hover:bg-gray-100 active:bg-gray-200 dark:text-gray-300 dark:enabled:hover:bg-gray-900 dark:active:bg-gray-800 focus-visible:ring-gray-400",
    },
    size: {
      sm: "px-3 py-1.5 text-xs",
      md: "px-6 py-2.5 text-sm font-medium",
      lg: "px-8 py-3 text-base font-medium",
      xl: "px-10 py-4 text-lg font-medium",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, isLoading = false, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={buttonVariants({ variant, size, className })}
        ref={ref}
        disabled={isLoading || disabled}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
