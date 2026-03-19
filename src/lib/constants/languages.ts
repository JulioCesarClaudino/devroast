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
  php: {
    id: "php",
    name: "PHP",
    fileExtension: ".php",
  },
  java: {
    id: "java",
    name: "Java",
    fileExtension: ".java",
  },
  go: {
    id: "go",
    name: "Go",
    fileExtension: ".go",
  },
  rust: {
    id: "rust",
    name: "Rust",
    fileExtension: ".rs",
  },
  cpp: {
    id: "cpp",
    name: "C++",
    fileExtension: ".cpp",
  },
} as const;

export const DEFAULT_LANGUAGE = LANGUAGES.javascript;

export const LANGUAGE_LIST = Object.values(LANGUAGES);
