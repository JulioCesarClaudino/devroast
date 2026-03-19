import * as React from "react";
import { CodeBlock } from "@/components/ui/code-block";

export interface LeaderboardEntryData {
  rank: number;
  score: string;
  language: string;
  lines: number;
  code: string;
}

interface LeaderboardEntryProps {
  entry: LeaderboardEntryData;
}

export const LeaderboardEntry = async ({
  entry,
}: LeaderboardEntryProps) => {
  const isFirstRank = entry.rank === 1;

  return (
    <div className="border border-border-primary rounded-lg overflow-hidden bg-bg-page">
      {/* Meta Row */}
      <div className="flex items-center justify-between h-12 px-5 border-b border-border-primary bg-bg-input">
        <div className="flex items-center gap-6">
          {/* Rank */}
          <div className="flex items-center gap-1">
            <span className="font-mono text-sm text-text-tertiary">#</span>
            <span
              className={
                isFirstRank
                  ? "font-mono text-sm font-bold text-accent-amber"
                  : "font-mono text-sm text-text-primary"
              }
            >
              {entry.rank}
            </span>
          </div>

          {/* Score */}
          <div className="flex items-center gap-1">
            <span className="font-mono text-xs text-text-tertiary">score:</span>
            <span className="font-mono text-sm font-bold text-accent-red">
              {entry.score}
            </span>
          </div>
        </div>

        {/* Right side: language + lines */}
        <div className="flex items-center gap-8">
          <span className="font-mono text-sm text-text-secondary">
            {entry.language}
          </span>
          <span className="font-mono text-sm text-text-tertiary">
            {entry.lines} lines
          </span>
        </div>
      </div>

      {/* Code Block */}
      <div className="max-h-32 overflow-hidden">
        <CodeBlock
          code={entry.code}
          language={entry.language}
          showLineNumbers={true}
        />
      </div>
    </div>
  );
};
