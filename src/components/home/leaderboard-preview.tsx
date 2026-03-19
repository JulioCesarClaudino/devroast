"use client";

import Link from "next/link";
import * as React from "react";

const LEADERBOARD_DATA = [
  {
    rank: 1,
    score: "1.2*",
    code: "eval(prompt('enter code'))",
    language: "js",
  },
  {
    rank: 2,
    score: "1.8",
    code: "if (x == true) { return true; } else if...",
    language: "ts",
  },
  {
    rank: 3,
    score: "2.1",
    code: "SELECT * FROM users WHERE 1=1",
    language: "sql",
  },
];

export const LeaderboardPreview = () => {
  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-mono text-lg sm:text-xl font-bold text-text-primary">
          {/* shame_leaderboard */}
        </h2>
        <Link
          href="/leaderboard"
          className="font-mono text-xs sm:text-sm text-accent-green hover:text-accent-green/80 transition-colors"
        >
          $ view_all &gt;&gt;
        </Link>
      </div>

      {/* Description */}
      <p className="font-mono text-xs sm:text-sm text-text-secondary">
        {/* the worst code on the internet, ranked by shame */}
      </p>

      {/* Table */}
      <div className="w-full overflow-x-auto border border-border-primary rounded-lg bg-bg-input">
        {/* Table Header */}
        <div className="flex border-b border-border-primary">
          <div className="w-12 flex-shrink-0 px-3 py-3 font-mono text-xs text-text-tertiary font-bold">
            #
          </div>
          <div className="w-20 flex-shrink-0 px-3 py-3 font-mono text-xs text-text-tertiary font-bold">
            score
          </div>
          <div className="flex-1 px-3 py-3 font-mono text-xs text-text-tertiary font-bold">
            code
          </div>
          <div className="w-20 flex-shrink-0 px-3 py-3 font-mono text-xs text-text-tertiary font-bold">
            lang
          </div>
        </div>

        {/* Table Rows */}
        {LEADERBOARD_DATA.map((row, index) => (
          <div
            key={index}
            className="flex border-b border-border-primary last:border-b-0 hover:bg-bg-surface transition-colors"
          >
            <div className="w-12 flex-shrink-0 px-3 py-3 font-mono text-xs text-text-tertiary">
              {row.rank === 1 ? (
                <span className="text-accent-amber font-bold">{row.rank}</span>
              ) : (
                row.rank
              )}
            </div>
            <div className="w-20 flex-shrink-0 px-3 py-3 font-mono text-xs font-bold">
              {row.rank === 1 ? (
                <span className="text-accent-red">{row.score}</span>
              ) : (
                <span className="text-text-primary">{row.score}</span>
              )}
            </div>
            <div className="flex-1 px-3 py-3 font-mono text-xs text-text-primary truncate sm:truncate-none">
              {row.code}
            </div>
            <div className="w-20 flex-shrink-0 px-3 py-3 font-mono text-xs text-text-secondary">
              {row.language}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <p className="text-center font-mono text-xs sm:text-sm text-text-tertiary">
        showing top 3 of 2,847 ·{" "}
        <Link
          href="/leaderboard"
          className="text-accent-green hover:text-accent-green/80 transition-colors"
        >
          view full leaderboard &gt;&gt;
        </Link>
      </p>
    </div>
  );
};

LeaderboardPreview.displayName = "LeaderboardPreview";
