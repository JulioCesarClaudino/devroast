"use client";

import * as React from "react";
import { twMerge } from "tailwind-merge";

import { Badge, type BadgeProps } from "./badge";

export interface CardProps {
  status?: BadgeProps["variant"];
  title: React.ReactNode;
  description: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, status = "critical", title, description, children, ...props }, ref) => (
    <div
      className={twMerge("flex flex-col gap-3 p-5 border border-border-primary rounded-lg", className)}
      ref={ref}
      {...props}
    >
      {status && <Badge variant={status} />}
      <h3 className="font-mono text-base text-text-primary">{title}</h3>
      <p className="font-mono text-sm text-text-secondary" style={{ lineHeight: 1.5 }}>
        {description}
      </p>
      {children}
    </div>
  )
);

Card.displayName = "Card";
