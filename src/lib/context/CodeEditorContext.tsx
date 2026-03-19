"use client";

import * as React from "react";

interface CodeEditorContextType {
  code: string;
  setCode: (code: string) => void;
  characterCount: number;
  isLimitExceeded: boolean;
  characterLimit: number;
}

export const CodeEditorContext = React.createContext<CodeEditorContextType | undefined>(undefined);

const CHARACTER_LIMIT = 5000;

export const CodeEditorProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [code, setCode] = React.useState("");
  const characterCount = code.length;
  const isLimitExceeded = characterCount > CHARACTER_LIMIT;

  const value: CodeEditorContextType = {
    code,
    setCode,
    characterCount,
    isLimitExceeded,
    characterLimit: CHARACTER_LIMIT,
  };

  return (
    <CodeEditorContext.Provider value={value}>
      {children}
    </CodeEditorContext.Provider>
  );
};

export const useCodeEditor = () => {
  const context = React.useContext(CodeEditorContext);
  if (context === undefined) {
    throw new Error("useCodeEditor must be used within CodeEditorProvider");
  }
  return context;
};
