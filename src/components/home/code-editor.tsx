"use client";

import * as React from "react";

const DEFAULT_CODE = "paste your code here...";

export const CodeEditor = () => {
  const [code, setCode] = React.useState(DEFAULT_CODE);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
  };

  const syncScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (textareaRef.current) {
      const scrollElement = e.currentTarget;
      textareaRef.current.scrollTop = scrollElement.scrollTop;
      textareaRef.current.scrollLeft = scrollElement.scrollLeft;
    }
  };

  const lines = code.split("\n");

  return (
    <div className="w-full">
      {/* Editor Container */}
      <div className="border border-border-primary rounded-lg bg-bg-input overflow-hidden">
        {/* Header with status dots */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border-primary bg-bg-input">
          <div className="h-3 w-3 rounded-full bg-accent-red" />
          <div className="h-3 w-3 rounded-full bg-accent-amber" />
          <div className="h-3 w-3 rounded-full bg-accent-green" />
        </div>

        {/* Code Content - Editable */}
        <div className="relative flex">
          {/* Line Numbers */}
          <div className="flex-shrink-0 w-12 bg-bg-surface border-r border-border-primary px-2 py-4 text-right pointer-events-none">
            {lines.map((_, index) => (
              <div key={index} className="font-mono text-sm text-text-tertiary leading-7 h-7">
                {index + 1}
              </div>
            ))}
          </div>

          {/* Textarea Input - Overlaid */}
          <textarea
            ref={textareaRef}
            value={code}
            onChange={handleInput}
            onScroll={syncScroll}
            className="absolute inset-0 ml-12 p-4 font-mono text-sm text-text-primary bg-transparent border-none outline-none resize-none whitespace-pre-wrap break-words overflow-x-auto leading-7"
            style={{
              color: "transparent",
              caretColor: "white",
            }}
            spellCheck="false"
          />

          {/* Code Display - Read-only Display */}
          <div className="flex-1 px-4 py-4 font-mono text-sm text-text-primary whitespace-pre-wrap break-words">
            <div className="leading-7 space-y-0 pointer-events-none">
              {lines.map((line, index) => (
                <div key={index} className="h-7 flex items-center">
                  {line || " "}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

CodeEditor.displayName = "CodeEditor";
