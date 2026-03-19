import * as React from "react";
import { DiffLine } from "@/components/ui/diff-line";

export interface DiffItem {
  type: "added" | "removed" | "context";
  code: string;
}

export interface DiffSectionProps {
  fromFile: string;
  toFile: string;
  diff: DiffItem[];
}

export const DiffSection: React.FC<DiffSectionProps> = ({
  fromFile,
  toFile,
  diff,
}) => {
  return (
    <div className="w-full flex flex-col gap-3">
      {/* Title Row */}
      <div className="flex items-center gap-2 font-mono text-sm md:text-base">
        <span className="text-accent-green font-bold">{"//"}</span>
        <span className="text-text-primary font-bold">suggested_fix</span>
      </div>

      {/* Diff Block */}
      <div className="overflow-hidden rounded-lg border border-border-primary bg-bg-input w-full">
        {/* Diff Header */}
        <div className="flex items-center h-10 px-4 border-b border-border-primary">
          <span className="font-mono text-xs md:text-sm text-text-secondary">
            {fromFile} → {toFile}
          </span>
        </div>

        {/* Diff Body */}
        <div className="overflow-x-auto">
          {diff.map((line, index) => (
            <DiffLine
              key={index}
              type={line.type}
              code={line.code}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

DiffSection.displayName = "DiffSection";
