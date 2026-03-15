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
  const [theme, setTheme] = React.useState<"light" | "dark">("dark");

  const { highlighter, isInitialized } = useHighlighter();
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const highlightedRef = React.useRef<HTMLDivElement>(null);

  // Sincronizar scroll
  const handleScroll = React.useCallback((e: React.UIEvent<HTMLTextAreaElement>) => {
    if (highlightedRef.current) {
      const scrollTop = e.currentTarget.scrollTop;
      const scrollLeft = e.currentTarget.scrollLeft;

      highlightedRef.current.scrollTop = scrollTop;
      highlightedRef.current.scrollLeft = scrollLeft;

      console.log("Scroll sincronizado:", { scrollTop, scrollLeft });
    }
  }, []);

  // Fazer highlight do código
  React.useEffect(() => {
    if (!highlighter || !isInitialized) {
      return;
    }

    try {
      const shikiTheme = theme === "light" ? "github-light" : "github-dark";
      const fullHtml = highlighter.codeToHtml(code, {
        lang: selectedLanguage.id,
        theme: shikiTheme,
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
  }, [code, selectedLanguage, highlighter, isInitialized, theme]);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const lines = code.split("\n");

  return (
    <div className="w-full">
      {/* Language Selector & Theme Toggle */}
      <div className="mb-4 flex items-center justify-between">
        <LanguageSelector
          selectedLanguage={selectedLanguage}
          onLanguageChange={setSelectedLanguage}
          isLoading={!isInitialized}
        />
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="px-3 py-1 rounded text-xs font-mono bg-gray-600 text-white hover:bg-gray-500 transition-colors"
            title={`Tema atual: ${theme}`}
          >
            {theme === "light" ? "☀️ Light" : "🌙 Dark"}
          </button>
          {!isInitialized && (
            <p className="text-xs text-text-secondary">Carregando highlighter...</p>
          )}
        </div>
      </div>

      {/* Editor Container */}
      <div className="border border-border-primary rounded-lg bg-bg-input overflow-hidden">
        {/* Header with status dots */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border-primary bg-bg-input">
          <div className="h-3 w-3 rounded-full bg-accent-red" />
          <div className="h-3 w-3 rounded-full bg-accent-amber" />
          <div className="h-3 w-3 rounded-full bg-accent-green" />
        </div>

        {/* Code Content Container */}
        <div className="relative flex overflow-hidden bg-bg-input" style={{ minHeight: "400px" }}>
          {/* Line Numbers */}
          <div className="flex-shrink-0 w-12 bg-bg-surface border-r border-border-primary px-2 py-4 text-right select-none">
            {lines.map((_, index) => (
              <div key={index} className="font-mono text-xs text-text-tertiary leading-6 h-6">
                {index + 1}
              </div>
            ))}
          </div>

          {/* Highlighted Code (Behind) */}
          <HighlightedCode ref={highlightedRef} html={highlightedHtml} theme={theme} />

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
              caretColor: theme === "light" ? "#000000" : "#ffffff",
            }}
            spellCheck="false"
          />
        </div>
      </div>
    </div>
  );
};

CodeEditor.displayName = "CodeEditor";
