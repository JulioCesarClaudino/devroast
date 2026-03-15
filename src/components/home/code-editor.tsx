"use client";

import * as React from "react";
import { LanguageSelector } from "@/components/home/language-selector";
import { DEFAULT_LANGUAGE, type Language } from "@/lib/constants/languages";
import { useHighlighter } from "@/lib/hooks/useHighlighter";

const DEFAULT_CODE = "paste your code here...";

export const CodeEditor = () => {
  const [code, setCode] = React.useState(DEFAULT_CODE);
  const [selectedLanguage, setSelectedLanguage] = React.useState<Language>(DEFAULT_LANGUAGE);
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [highlightedHtml, setHighlightedHtml] = React.useState<string>("");

  const { highlighter, isInitialized } = useHighlighter();
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const highlightedRef = React.useRef<HTMLPreElement>(null);

  // Detecta modo dark quando o componente monta
  React.useEffect(() => {
    setIsDarkMode(document.documentElement.classList.contains("dark"));

    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
  };

  // Synchronize scroll between textarea and highlighted code
  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (highlightedRef.current) {
      highlightedRef.current.scrollTop = e.currentTarget.scrollTop;
      highlightedRef.current.scrollLeft = e.currentTarget.scrollLeft;
    }
  };

  // Generate syntax-highlighted HTML using Shiki
  React.useEffect(() => {
    if (!highlighter || !isInitialized) {
      setHighlightedHtml("");
      return;
    }

    try {
      const html = highlighter.codeToHtml(code, {
        lang: selectedLanguage.id,
        theme: isDarkMode ? "github-dark" : "github-light",
      });

      // Extract just the inner HTML from the pre/code tags
      const match = html.match(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/);
      const cleanHtml = match ? match[1] : "";

      setHighlightedHtml(cleanHtml);
    } catch (error) {
      console.error("Syntax highlighting error:", error);
      setHighlightedHtml("");
    }
  }, [code, selectedLanguage, isDarkMode, highlighter, isInitialized]);

  const lines = code.split("\n");

  return (
    <div className="w-full">
      {/* Language Selector */}
      <div className="mb-4 flex items-center justify-between">
        <LanguageSelector
          selectedLanguage={selectedLanguage}
          onLanguageChange={setSelectedLanguage}
          isLoading={!isInitialized}
        />
        {!isInitialized && (
          <div className="text-xs text-text-secondary">Initializing syntax highlighter...</div>
        )}
      </div>

      {/* Editor Container */}
      <div className="border border-border-primary rounded-lg bg-bg-input overflow-hidden">
        {/* Header with status dots */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border-primary bg-bg-input">
          <div className="h-3 w-3 rounded-full bg-accent-red" />
          <div className="h-3 w-3 rounded-full bg-accent-amber" />
          <div className="h-3 w-3 rounded-full bg-accent-green" />
        </div>

        {/* Code Content - Dual Layer */}
        <div className="relative flex">
          {/* Line Numbers */}
          <div className="flex-shrink-0 w-12 bg-bg-surface border-r border-border-primary px-2 py-4 text-right pointer-events-none">
            {lines.map((_, index) => (
              <div key={index} className="font-mono text-sm text-text-tertiary leading-7 h-7">
                {index + 1}
              </div>
            ))}
          </div>

          {/* Highlighted Code Layer (Behind) */}
          <pre
            ref={highlightedRef}
            className="absolute inset-0 ml-12 p-4 font-mono text-sm bg-transparent border-none outline-none resize-none whitespace-pre-wrap break-words overflow-auto leading-7 pointer-events-none"
            style={{
              margin: 0,
            }}
          >
            <code
              dangerouslySetInnerHTML={{ __html: highlightedHtml }}
              className="font-mono text-sm leading-7"
            />
          </pre>

          {/* Textarea Input Layer (On Top) */}
          <textarea
            ref={textareaRef}
            value={code}
            onChange={handleInput}
            onScroll={handleScroll}
            className="relative flex-1 p-4 font-mono text-sm text-transparent bg-transparent border-none outline-none resize-none whitespace-pre-wrap break-words overflow-auto leading-7"
            style={{
              caretColor: isDarkMode ? "white" : "black",
            }}
            spellCheck="false"
          />
        </div>
      </div>
    </div>
  );
};

CodeEditor.displayName = "CodeEditor";
