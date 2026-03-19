"use client";

import { useEffect, useState } from "react";
import type { Highlighter } from "shiki";
import { createHighlighter } from "shiki";

interface UseHighlighterReturn {
  highlighter: Highlighter | null;
  isInitialized: boolean;
  isLoadingLanguage: boolean;
  error: Error | null;
}

/**
 * Hook para gerenciar a instância do Shiki Highlighter
 * Inicializa com WASM e precarrega 8 linguagens (JavaScript, Python, TypeScript, PHP, Java, Go, Rust, C++)
 *
 * @returns Objeto com highlighter, estados e handlers
 */
export function useHighlighter(): UseHighlighterReturn {
  const [highlighter, setHighlighter] = useState<Highlighter | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoadingLanguage, setIsLoadingLanguage] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const initializeHighlighter = async () => {
      try {
        const highlighter = await createHighlighter({
          themes: ["github-light", "github-dark"],
          langs: ["javascript", "python", "typescript", "php", "java", "go", "rust", "cpp"],
        });

        if (isMounted) {
          setHighlighter(highlighter);
          setIsInitialized(true);
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Failed to initialize highlighter");
        if (isMounted) {
          setError(error);
          console.error("Highlighter initialization error:", error);
        }
      }
    };

    initializeHighlighter();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    highlighter,
    isInitialized,
    isLoadingLanguage,
    error,
  };
}
