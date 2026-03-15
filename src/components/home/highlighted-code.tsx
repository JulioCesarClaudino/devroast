"use client";

import * as React from "react";

interface HighlightedCodeProps {
  html: string;
  theme?: "light" | "dark";
}

export const HighlightedCode = React.forwardRef<HTMLDivElement, HighlightedCodeProps>(
  ({ html, theme = "dark" }, ref) => {
    const isLight = theme === "light";
    const bgColor = isLight ? "#ffffff" : "#111111";

    return (
      <div
        ref={ref}
        className="flex-1 font-mono text-sm leading-6 whitespace-pre-wrap break-words overflow-auto pointer-events-none"
        style={{
          backgroundColor: bgColor,
          padding: "16px",
        }}
      >
        <pre
          style={{
            margin: 0,
            whiteSpace: "pre-wrap",
            wordWrap: "break-word",
            fontFamily: "inherit",
            fontSize: "inherit",
            lineHeight: "inherit",
          }}
        >
          <code
            dangerouslySetInnerHTML={{ __html: html }}
            style={{ fontFamily: "inherit", fontSize: "inherit" }}
          />
        </pre>
      </div>
    );
  }
);

HighlightedCode.displayName = "HighlightedCode";
