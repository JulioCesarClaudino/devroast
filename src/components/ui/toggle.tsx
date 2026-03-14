"use client";

import * as React from "react";
import { twMerge } from "tailwind-merge";

export interface ToggleProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export const Toggle = React.forwardRef<HTMLDivElement, ToggleProps>(
  ({ checked, onCheckedChange, label = "roast mode", disabled = false }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onCheckedChange(e.target.checked);
    };

    return (
      <div className="flex items-center gap-3" ref={ref}>
        <input
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          className="sr-only"
          aria-label={label}
        />
        <button
          onClick={() => !disabled && onCheckedChange(!checked)}
          disabled={disabled}
          className={twMerge(
            "inline-flex items-center p-1 rounded-full transition-colors",
            checked ? "bg-accent-green" : "bg-border-primary",
            disabled && "opacity-50 cursor-not-allowed",
            !disabled && "cursor-pointer"
          )}
          style={{
            width: "40px",
            height: "22px",
          }}
        >
          <div
            className={twMerge(
              "w-4 h-4 rounded-full transition-transform",
              checked ? "bg-black" : "bg-text-secondary"
            )}
            style={{
              transform: checked ? "translateX(18px)" : "translateX(0px)",
            }}
          />
        </button>
        {label && (
          <span
            className="font-mono text-xs"
            style={{
              color: checked ? "#10B981" : "#A3A3A3",
            }}
          >
            {label}
          </span>
        )}
      </div>
    );
  }
);

Toggle.displayName = "Toggle";
