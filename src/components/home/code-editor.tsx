"use client";

import * as React from "react";
import { HighlightedCode } from "@/components/home/highlighted-code";
import { LanguageSelector } from "@/components/home/language-selector";
import { DEFAULT_LANGUAGE, type Language } from "@/lib/constants/languages";
import { useHighlighter } from "@/lib/hooks/useHighlighter";

const DEFAULT_CODE = "// paste your code here...";

export const CodeEditor = () => {
  const [code, setCode] = React.useState(DEFAULT_CODE);
  const [selectedLanguage, setSelectedLanguage] = React.useState<Language>(DEFAULT_LANGUAGE);
  const [highlightedHtml, setHighlightedHtml] = React.useState<string>("");

  const { highlighter, isInitialized } = useHighlighter();
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const highlightedRef = React.useRef<HTMLDivElement>(null);

  // Sincronizar scroll
  const handleScroll = React.useCallback((e: React.UIEvent<HTMLTextAreaElement>) => {
    if (highlightedRef.current) {
      highlightedRef.current.scrollTop = e.currentTarget.scrollTop;
      highlightedRef.current.scrollLeft = e.currentTarget.scrollLeft;
    }
  }, []);

  // Fazer highlight do código
  React.useEffect(() => {
    if (!highlighter || !isInitialized) {
      return;
    }

    try {
      const fullHtml = highlighter.codeToHtml(code, {
        lang: selectedLanguage.id,
        theme: "github-light",
      });

      // Extrair conteúdo da tag <code>
      const match = fullHtml.match(/<code>([\s\S]*?)<\/code>/);
      const innerHtml = match ? match[1] : "";

      console.log("Shiki HTML gerado:", {
        fullHtml: fullHtml.substring(0, 100),
        innerHtml: innerHtml.substring(0, 100),
      });

      setHighlightedHtml(innerHtml);
    } catch (error) {
      console.error("Erro ao fazer highlight:", error);
      setHighlightedHtml("");
    }
  }, [code, selectedLanguage, highlighter, isInitialized]);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
  };

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
        {!isInitialized && <p className="text-xs text-text-secondary">Carregando highlighter...</p>}
      </div>

      {/* Editor Container */}
      <div className="border border-border-primary rounded-lg bg-white overflow-hidden">
        {/* Header with status dots */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border-primary bg-white">
          <div className="h-3 w-3 rounded-full bg-accent-red" />
          <div className="h-3 w-3 rounded-full bg-accent-amber" />
          <div className="h-3 w-3 rounded-full bg-accent-green" />
        </div>

        {/* Code Content Container */}
        <div className="relative flex overflow-hidden bg-white" style={{ minHeight: "400px" }}>
          {/* Line Numbers */}
          <div className="flex-shrink-0 w-12 bg-gray-50 border-r border-gray-200 px-2 py-4 text-right select-none">
            {lines.map((_, index) => (
              <div key={index} className="font-mono text-xs text-gray-500 leading-6 h-6">
                {index + 1}
              </div>
            ))}
          </div>

          {/* Highlighted Code (Behind) */}
          <HighlightedCode ref={highlightedRef} html={highlightedHtml} />

          {/* Textarea (On Top - Transparent) */}
          <textarea
            ref={textareaRef}
            value={code}
            onChange={handleInput}
            onScroll={handleScroll}
            className="relative flex-1 p-4 font-mono text-sm text-transparent bg-transparent border-none outline-none resize-none overflow-auto"
            style={{
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
              lineHeight: "1.5rem",
              caretColor: "black",
            }}
            spellCheck="false"
          />
        </div>
      </div>
    </div>
  );
};

CodeEditor.displayName = "CodeEditor";
