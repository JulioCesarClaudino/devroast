"use client";

export type Language = {
  id: string;
  name: string;
  fileExtension: string;
};

export const LANGUAGES = {
  javascript: {
    id: "javascript",
    name: "JavaScript",
    fileExtension: ".js",
  },
  python: {
    id: "python",
    name: "Python",
    fileExtension: ".py",
  },
  typescript: {
    id: "typescript",
    name: "TypeScript",
    fileExtension: ".ts",
  },
} as const;

export const DEFAULT_LANGUAGE = LANGUAGES.javascript;

export const LANGUAGE_LIST = Object.values(LANGUAGES);
