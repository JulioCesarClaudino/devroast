import * as React from "react";

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

export const LeaderboardEntry = ({ entry }: LeaderboardEntryProps) => {
  const isFirstRank = entry.rank === 1;
  const lineArray = entry.code.split("\n");

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

      {/* Code Preview */}
      <div className="bg-bg-input max-h-32 overflow-hidden">
        <div className="flex">
          {/* Line Numbers */}
          <div className="bg-bg-surface border-r border-border-primary px-3 py-3 text-right text-xs font-mono text-text-tertiary">
            {lineArray.map((_, i) => (
              <div key={i + 1} className="h-5 leading-5">
                {i + 1}
              </div>
            ))}
          </div>

          {/* Code */}
          <div className="flex-1 px-3 py-3 font-mono text-xs overflow-x-auto">
            {lineArray.map((line, i) => (
              <div key={i} className="h-5 leading-5 text-text-primary">
                {line || " "}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
