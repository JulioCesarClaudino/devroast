"use client";

import * as React from "react";

export const FooterHint = () => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
      <span className="font-mono text-xs sm:text-sm text-text-tertiary">2,847 codes roasted</span>
      <span className="hidden sm:inline text-text-tertiary">·</span>
      <span className="font-mono text-xs sm:text-sm text-text-tertiary">avg score: 4.2/10</span>
    </div>
  );
};

FooterHint.displayName = "FooterHint";
