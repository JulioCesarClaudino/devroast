"use client";

import * as React from "react";

interface HighlightedCodeProps {
  html: string;
}

export const HighlightedCode = React.forwardRef<HTMLDivElement, HighlightedCodeProps>(
  ({ html }, ref) => {
    return (
      <div
        ref={ref}
        className="p-4 font-mono text-sm leading-6 whitespace-pre-wrap break-words overflow-auto pointer-events-none"
        style={{
          position: "absolute",
          inset: 0,
          marginLeft: "48px",
          backgroundColor: "transparent",
          color: "inherit",
        }}
      >
        <pre style={{ margin: 0, whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
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
