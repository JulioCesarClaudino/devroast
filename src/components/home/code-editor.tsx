"use client";

import * as React from "react";
import { HighlightedCode } from "@/components/home/highlighted-code";
import { LanguageSelector } from "@/components/home/language-selector";
import { DEFAULT_LANGUAGE, type Language } from "@/lib/constants/languages";
import { useHighlighter } from "@/lib/hooks/useHighlighter";
import { detectLanguage } from "@/lib/utils/detectLanguage";

const DEFAULT_CODE = "// paste your code here...";

export const CodeEditor = () => {
  const [code, setCode] = React.useState(DEFAULT_CODE);
  const [selectedLanguage, setSelectedLanguage] =
    React.useState<Language | null>(null);
  const [userSelectedLanguage, setUserSelectedLanguage] = React.useState(false);
  const [highlightedHtml, setHighlightedHtml] = React.useState<string>("");
  const [theme, setTheme] = React.useState<"light" | "dark">("dark");

  const { highlighter, isInitialized } = useHighlighter();
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const highlightedRef = React.useRef<HTMLDivElement>(null);

  // Sincronizar scroll
  const handleScroll = React.useCallback(
    (e: React.UIEvent<HTMLTextAreaElement>) => {
      if (highlightedRef.current) {
        const scrollTop = e.currentTarget.scrollTop;
        const scrollLeft = e.currentTarget.scrollLeft;

        highlightedRef.current.scrollTop = scrollTop;
        highlightedRef.current.scrollLeft = scrollLeft;

        console.log("Scroll sincronizado:", { scrollTop, scrollLeft });
      }
    },
    [],
  );

  // Handler para mudança de linguagem (marca como seleção manual)
  const handleLanguageChange = React.useCallback((language: Language) => {
    setSelectedLanguage(language);
    setUserSelectedLanguage(true);
  }, []);

  // Efeito de detecção automática de linguagem
  React.useEffect(() => {
    if (userSelectedLanguage) return; // Não detectar se usuário selecionou manualmente

    const detected = detectLanguage(code);
    if (detected && detected.id !== selectedLanguage?.id) {
      setSelectedLanguage(detected);
      console.log("Linguagem auto-detectada:", detected.name);
    }
  }, [code, userSelectedLanguage, selectedLanguage]);

  // Fazer highlight do código
  React.useEffect(() => {
    if (!highlighter || !isInitialized) {
      return;
    }

    try {
      const shikiTheme = theme === "light" ? "github-light" : "github-dark";
      const languageId = selectedLanguage?.id || DEFAULT_LANGUAGE.id;
      const fullHtml = highlighter.codeToHtml(code, {
        lang: languageId,
        theme: shikiTheme,
      });

      // Extrair conteúdo da tag <code>
      const match = fullHtml.match(/<code>([\s\S]*?)<\/code>/);
      const innerHtml = match ? match[1] : "";

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
          onLanguageChange={handleLanguageChange}
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
            <p className="text-xs text-text-secondary">
              Carregando highlighter...
            </p>
          )}
        </div>
      </div>

      {/* Editor Container */}
      <div className="flex flex-col max-h-96 md:max-h-[500px] border border-border-primary rounded-lg bg-bg-input overflow-hidden">
        {/* Header with status dots */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border-primary bg-bg-input">
          <div className="h-3 w-3 rounded-full bg-accent-red" />
          <div className="h-3 w-3 rounded-full bg-accent-amber" />
          <div className="h-3 w-3 rounded-full bg-accent-green" />
        </div>

        {/* Code Content Container */}
        <div className="flex overflow-hidden flex-1 bg-bg-input">
          {/* Line Numbers */}
          <div className="flex-shrink-0 w-12 bg-bg-surface border-r border-border-primary px-2 py-4 text-right select-none overflow-hidden">
            {lines.map((_, index) => (
              <div
                key={index}
                className="font-mono text-xs text-text-tertiary leading-6 h-6"
              >
                {index + 1}
              </div>
            ))}
          </div>

          {/* Wrapper para textarea e highlighted code */}
          <div className="flex flex-1 relative overflow-hidden">
            {/* Textarea (On Top - Transparent, Absolute) */}
            <textarea
              ref={textareaRef}
              value={code}
              onChange={handleInput}
              onScroll={handleScroll}
              className="absolute inset-0 p-4 font-mono text-sm text-transparent bg-transparent border-none outline-none resize-none overflow-auto"
              style={{
                whiteSpace: "pre-wrap",
                wordWrap: "break-word",
                lineHeight: "1.5rem",
                caretColor: theme === "light" ? "#000000" : "#ffffff",
              }}
              spellCheck="false"
            />

            {/* Highlighted Code (Behind - flex-1) */}
            <HighlightedCode
              ref={highlightedRef}
              html={highlightedHtml}
              theme={theme}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

CodeEditor.displayName = "CodeEditor";
