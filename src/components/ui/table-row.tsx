"use client";

import * as React from "react";
import { twMerge } from "tailwind-merge";

export interface TableCell {
  content: React.ReactNode;
  width?: string | number;
}

export interface TableRowProps extends React.HTMLAttributes<HTMLDivElement> {
  cells: TableCell[];
}

export const TableRow = React.forwardRef<HTMLDivElement, TableRowProps>(
  ({ className, cells, ...props }, ref) => (
    <div
      className={twMerge("flex gap-6 px-4 py-5 border-b border-border-primary", className)}
      ref={ref}
      {...props}
    >
      {cells.map((cell, index) => (
        <div
          key={index}
          style={{
            width: cell.width,
            flex: cell.width === undefined ? 1 : undefined,
          }}
        >
          {cell.content}
        </div>
      ))}
    </div>
  )
);

TableRow.displayName = "TableRow";
