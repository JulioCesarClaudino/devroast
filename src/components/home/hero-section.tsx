"use client";

import * as React from "react";

export const HeroSection = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-3 text-center">
      <h1 className="font-mono text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
        <span className="text-accent-green">$</span>{" "}
        <span className="text-text-primary">paste your code. get roasted.</span>
      </h1>
      <p className="font-mono text-sm sm:text-base text-text-secondary max-w-2xl">
        {/* drop your code below and we&apos;ll rate it — brutally honest or full roast mode */}
      </p>
    </div>
  );
};

HeroSection.displayName = "HeroSection";
