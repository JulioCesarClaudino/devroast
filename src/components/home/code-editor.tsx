"use client";

import * as React from "react";
import { LanguageSelector } from "@/components/home/language-selector";
import { DEFAULT_LANGUAGE, type Language } from "@/lib/constants/languages";

const DEFAULT_CODE = "// paste your code here...";

export const CodeEditor = () => {
  const [code, setCode] = React.useState(DEFAULT_CODE);
  const [selectedLanguage, setSelectedLanguage] = React.useState<Language>(DEFAULT_LANGUAGE);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
  };

  const lines = code.split("\n");

  return (
    <div className="w-full">
      {/* Language Selector */}
      <div className="mb-4">
        <LanguageSelector
          selectedLanguage={selectedLanguage}
          onLanguageChange={setSelectedLanguage}
          isLoading={false}
        />
      </div>

      {/* Editor Container */}
      <div className="border border-border-primary rounded-lg bg-bg-input overflow-hidden">
        {/* Header with status dots */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border-primary bg-bg-input">
          <div className="h-3 w-3 rounded-full bg-accent-red" />
          <div className="h-3 w-3 rounded-full bg-accent-amber" />
          <div className="h-3 w-3 rounded-full bg-accent-green" />
        </div>

        {/* Code Content */}
        <div className="flex">
          {/* Line Numbers */}
          <div className="flex-shrink-0 w-12 bg-bg-surface border-r border-border-primary px-2 py-4 text-right">
            {lines.map((_, index) => (
              <div key={index} className="font-mono text-sm text-text-tertiary leading-7 h-7">
                {index + 1}
              </div>
            ))}
          </div>

          {/* Textarea Input */}
          <textarea
            value={code}
            onChange={handleInput}
            className="flex-1 p-4 font-mono text-sm text-text-primary bg-bg-input border-none outline-none resize-none whitespace-pre-wrap overflow-auto leading-7"
            spellCheck="false"
          />
        </div>
      </div>
    </div>
  );
};

CodeEditor.displayName = "CodeEditor";
