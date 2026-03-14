"use client";

import * as React from "react";
import { createHighlighter } from "shiki";

export interface CodeBlockProps {
  code: string;
  language: string;
  filename?: string;
  showLineNumbers?: boolean;
}

export const CodeBlock = async ({
  code,
  language,
  filename,
  showLineNumbers = true,
}: CodeBlockProps) => {
  const highlighter = await createHighlighter({
    themes: ["vesper"],
    langs: [language],
  });

  const html = await highlighter.codeToHtml(code, {
    lang: language,
    theme: "vesper",
  });

  const lines = code.split("\n");
  const lineCount = lines.length;

  return (
    <div className="bg-bg-input border border-border-primary rounded-lg overflow-hidden w-full">
      <div className="flex items-center h-10 px-4 border-b border-border-primary gap-3">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-accent-red" />
          <div className="w-3 h-3 rounded-full bg-accent-amber" />
          <div className="w-3 h-3 rounded-full bg-accent-green" />
        </div>
        <div className="flex-1" />
        {filename && <span className="font-mono text-xs text-text-tertiary">{filename}</span>}
      </div>

      <div className="flex overflow-x-auto">
        {showLineNumbers && (
          <div className="bg-bg-surface border-r border-border-primary px-3 py-3 text-right text-xs font-mono text-text-tertiary">
            {Array.from({ length: lineCount }, (_, i) => (
              <div key={i + 1} className="h-5 leading-5">
                {i + 1}
              </div>
            ))}
          </div>
        )}

        <div className="flex-1 px-3 py-3 font-mono text-xs overflow-x-auto">
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </div>
    </div>
  );
};

CodeBlock.displayName = "CodeBlock";
