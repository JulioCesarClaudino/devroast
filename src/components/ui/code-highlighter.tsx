"use client";

import React, { useEffect, useState } from "react";
import type { Highlighter } from "shiki";
import type { Language } from "@/lib/constants/languages";

interface CodeHighlighterProps {
  code: string;
  language: Language;
  highlighter: Highlighter | null;
  className?: string;
  isDarkMode?: boolean;
}

/**
 * Componente que renderiza código com syntax highlighting usando Shiki
 * Renderiza HTML destacado abaixo de um textarea transparente (overlay pattern)
 *
 * @param code - Código a ser destacado
 * @param language - Objeto Language com id, name, fileExtension
 * @param highlighter - Instância do Shiki Highlighter
 * @param className - Classes CSS customizadas
 * @param isDarkMode - Se deve usar tema dark (padrão: false)
 */
export const CodeHighlighter = React.forwardRef<HTMLDivElement, CodeHighlighterProps>(
  ({ code, language, highlighter, className = "", isDarkMode = false }, ref) => {
    const [highlightedHtml, setHighlightedHtml] = useState<string>("");
    const [isHighlighting, setIsHighlighting] = useState(false);

    useEffect(() => {
      const highlightCode = async () => {
        // Se não temos highlighter ou código vazio, mostra plaintext
        if (!highlighter || !code) {
          setHighlightedHtml(escapeHtml(code));
          return;
        }

        try {
          setIsHighlighting(true);

          // Determina o nome do tema baseado no modo dark
          const themeName = isDarkMode ? "github-dark" : "github-light";

          // Gera HTML destacado
          const html = await highlighter.codeToHtml(code, {
            lang: language.id,
            theme: themeName,
          });

          setHighlightedHtml(html);
        } catch (error) {
          console.error("Error highlighting code:", error);
          // Fallback para plaintext em caso de erro
          setHighlightedHtml(escapeHtml(code));
        } finally {
          setIsHighlighting(false);
        }
      };

      highlightCode();
    }, [code, language, highlighter, isDarkMode]);

    return (
      <div
        ref={ref}
        className={`overflow-auto rounded-lg bg-page p-4 font-mono text-sm leading-relaxed ${className}`}
        dangerouslySetInnerHTML={{ __html: highlightedHtml }}
        style={{
          minHeight: "200px",
        }}
      />
    );
  }
);

CodeHighlighter.displayName = "CodeHighlighter";

/**
 * Escapa caracteres HTML para segurança
 */
function escapeHtml(text: string): string {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
