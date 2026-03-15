import Link from "next/link";
import * as React from "react";

import { getLeaderboardAction } from "@/app/actions/roast-actions";

/**
 * LeaderboardPreview - Server Component
 * Fetches real leaderboard data from database
 */
export async function LeaderboardPreview() {
  const result = await getLeaderboardAction(3);

  if (!result.success) {
    return (
      <div className="w-full flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="font-mono text-lg sm:text-xl font-bold text-text-primary">
            <span className="text-accent-amber">//</span> shame_leaderboard
          </h2>
          <Link
            href="/leaderboard"
            className="font-mono text-xs sm:text-sm text-accent-green hover:text-accent-green/80 transition-colors"
          >
            $ view_all &gt;&gt;
          </Link>
        </div>

        <p className="font-mono text-xs sm:text-sm text-text-secondary">
          // the worst code on the internet, ranked by shame
        </p>

        <div className="w-full p-4 bg-bg-input rounded-lg border border-border-primary">
          <p className="font-mono text-sm text-text-secondary text-center">
            Nenhum roast encontrado. Seja o primeiro a enviar!
          </p>
        </div>
      </div>
    );
  }

  const roasts = result.data || [];

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-mono text-lg sm:text-xl font-bold text-text-primary">
          <span className="text-accent-amber">//</span> shame_leaderboard
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
        // the worst code on the internet, ranked by shame
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
        {roasts.length > 0 ? (
          roasts.map((roast: any, index: number) => {
            const rank = index + 1;
            const codePreview = roast.code
              ? roast.code.substring(0, 50) + (roast.code.length > 50 ? "..." : "")
              : "No code";

            return (
              <Link
                key={roast.id}
                href={`/roast/${roast.id}`}
                className="flex border-b border-border-primary last:border-b-0 hover:bg-bg-surface transition-colors"
              >
                <div className="w-12 flex-shrink-0 px-3 py-3 font-mono text-xs text-text-tertiary">
                  {rank === 1 ? <span className="text-accent-amber font-bold">{rank}</span> : rank}
                </div>
                <div className="w-20 flex-shrink-0 px-3 py-3 font-mono text-xs font-bold">
                  {rank === 1 ? (
                    <span className="text-accent-red">{roast.roastScore}</span>
                  ) : (
                    <span className="text-text-primary">{roast.roastScore}</span>
                  )}
                </div>
                <div className="flex-1 px-3 py-3 font-mono text-xs text-text-primary truncate sm:truncate-none">
                  {codePreview}
                </div>
                <div className="w-20 flex-shrink-0 px-3 py-3 font-mono text-xs text-text-secondary">
                  {roast.languageDisplayName || "unknown"}
                </div>
              </Link>
            );
          })
        ) : (
          <div className="flex border-b border-border-primary p-4 text-center justify-center">
            <p className="font-mono text-sm text-text-secondary">Nenhum roast encontrado</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <p className="text-center font-mono text-xs sm:text-sm text-text-tertiary">
        showing top {roasts.length} of {roasts.length} ·{" "}
        <Link
          href="/leaderboard"
          className="text-accent-green hover:text-accent-green/80 transition-colors"
        >
          view full leaderboard &gt;&gt;
        </Link>
      </p>
    </div>
  );
}

LeaderboardPreview.displayName = "LeaderboardPreview";
