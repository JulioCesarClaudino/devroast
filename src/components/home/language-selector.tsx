"use client";

import React from "react";
import { LANGUAGE_LIST, type Language } from "@/lib/constants/languages";

interface LanguageSelectorProps {
  selectedLanguage: Language | null;
  onLanguageChange: (language: Language) => void;
  isLoading?: boolean;
}

/**
 * Componente para seleção de linguagem de programação
 * Dropdown com 8 linguagens suportadas ou auto-detecção automática
 *
 * @param selectedLanguage - Linguagem atualmente selecionada (null para auto-detect)
 * @param onLanguageChange - Callback ao selecionar nova linguagem
 * @param isLoading - Se está carregando a gramática da linguagem
 */
export const LanguageSelector = React.forwardRef<HTMLSelectElement, LanguageSelectorProps>(
  ({ selectedLanguage, onLanguageChange, isLoading = false }, ref) => {
    return (
      <div className="flex items-center gap-3">
        <label htmlFor="language-select" className="text-sm font-medium text-text-primary">
          Language:
        </label>
        <select
          ref={ref}
          id="language-select"
          value={selectedLanguage?.id || "none"}
          onChange={(e) => {
            if (e.target.value === "none") return;
            const language = LANGUAGE_LIST.find((lang) => lang.id === e.target.value);
            if (language) {
              onLanguageChange(language);
            }
          }}
          disabled={isLoading}
          className="rounded-md border border-border-primary bg-input px-3 py-2 text-sm text-text-primary disabled:cursor-not-allowed disabled:opacity-50 enabled:hover:border-accent-green focus:outline-none focus:ring-2 focus:ring-accent-green focus:ring-offset-0"
        >
          <option value="none">Auto-detect language</option>
          {LANGUAGE_LIST.map((language) => (
            <option key={language.id} value={language.id}>
              {language.name}
            </option>
          ))}
        </select>
        {isLoading && (
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-accent-green border-r-transparent" />
            <span className="text-xs text-text-secondary">Loading...</span>
          </div>
        )}
      </div>
    );
  }
);

LanguageSelector.displayName = "LanguageSelector";
