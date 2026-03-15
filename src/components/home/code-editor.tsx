"use client";

import * as React from "react";
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
  const preRef = React.useRef<HTMLPreElement>(null);

  // Gerar HTML colorido com Shiki
  React.useEffect(() => {
    if (!highlighter || !isInitialized || !code) {
      setHighlightedHtml("");
      return;
    }

    try {
      const html = highlighter.codeToHtml(code, {
        lang: selectedLanguage.id,
        theme: "github-light",
      });

      // Extrair o conteúdo interno da tag code
      const match = html.match(/<code[^>]*>([\s\S]*?)<\/code>/);
      const innerHtml = match ? match[1] : "";

      setHighlightedHtml(innerHtml);
    } catch (error) {
      console.error("Highlighting error:", error);
      setHighlightedHtml("");
    }
  }, [code, selectedLanguage, highlighter, isInitialized]);

  // Sincronizar scroll entre textarea e pre
  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (preRef.current) {
      preRef.current.scrollTop = e.currentTarget.scrollTop;
      preRef.current.scrollLeft = e.currentTarget.scrollLeft;
    }
  };

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
          isLoading={!isInitialized}
        />
        {!isInitialized && (
          <p className="text-xs text-text-secondary mt-2">Carregando highlighter...</p>
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

        {/* Code Content - Container com posição relativa */}
        <div className="relative flex overflow-hidden">
          {/* Line Numbers */}
          <div className="flex-shrink-0 w-12 bg-bg-surface border-r border-border-primary px-2 py-4 text-right pointer-events-none select-none">
            {lines.map((_, index) => (
              <div key={index} className="font-mono text-sm text-text-tertiary leading-7 h-7">
                {index + 1}
              </div>
            ))}
          </div>

          {/* Pre com código colorido - atrás */}
          <pre
            ref={preRef}
            className="absolute top-0 left-12 right-0 bottom-0 p-4 font-mono text-sm bg-transparent border-none outline-none overflow-auto leading-7 pointer-events-none"
            style={{
              margin: 0,
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
            }}
          >
            <code
              dangerouslySetInnerHTML={{ __html: highlightedHtml }}
              className="font-mono text-sm leading-7 text-transparent"
            />
          </pre>

          {/* Textarea transparente - na frente */}
          <textarea
            ref={textareaRef}
            value={code}
            onChange={handleInput}
            onScroll={handleScroll}
            className="relative flex-1 p-4 font-mono text-sm text-text-primary bg-transparent border-none outline-none resize-none overflow-auto leading-7"
            style={{
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
            }}
            spellCheck="false"
          />
        </div>
      </div>
    </div>
  );
};

CodeEditor.displayName = "CodeEditor";
