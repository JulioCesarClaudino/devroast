"use client";

import * as React from "react";
import { CodeBlock } from "@/components/ui/code-block";

export interface SubmittedCodeSectionProps {
  code: string;
  language: string;
}

export const SubmittedCodeSection: React.FC<SubmittedCodeSectionProps> = ({
  code,
  language,
}) => {
  return (
    <div className="w-full flex flex-col gap-4">
      {/* Title Row */}
      <div className="flex items-center gap-2 font-mono text-sm md:text-base">
        <span className="text-accent-green font-bold">{"//"}</span>
        <span className="text-text-primary font-bold">your_submission</span>
      </div>

      {/* Code Preview */}
      <div className="overflow-hidden rounded-lg h-80 md:h-96 max-h-[424px] w-full">
        <CodeBlock code={code} language={language} showLineNumbers={true} />
      </div>
    </div>
  );
};

SubmittedCodeSection.displayName = "SubmittedCodeSection";
