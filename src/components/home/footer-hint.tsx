"use client";

import * as React from "react";

interface FooterHintProps {
  roastCount?: number;
  avgScore?: number;
}

export const FooterHint: React.FC<FooterHintProps> = ({
  roastCount = 2847,
  avgScore = 4.2,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
      <span className="font-mono text-xs sm:text-sm text-text-tertiary">
        {roastCount} codes roasted
      </span>
      <span className="hidden sm:inline text-text-tertiary">·</span>
      <span className="font-mono text-xs sm:text-sm text-text-tertiary">
        avg score: {avgScore.toFixed(1)}/10
      </span>
    </div>
  );
};

FooterHint.displayName = "FooterHint";
