"use client";

import * as React from "react";

export interface ScoreRingProps {
  score: number;
  maxScore?: number;
  size?: number;
}

export const ScoreRing = React.forwardRef<SVGSVGElement, ScoreRingProps>(
  ({ score, maxScore = 10, size = 180 }, ref) => {
    const radius = size / 2 - 8;
    const circumference = 2 * Math.PI * radius;
    const percentage = Math.min(Math.max(score / maxScore, 0), 1);
    const strokeDashoffset = circumference - circumference * percentage;

    return (
      <div className="flex flex-col items-center justify-center" style={{ width: size, height: size }}>
        <div className="relative" style={{ width: size, height: size }}>
          {/* Outer ring (border) */}
          <svg
            ref={ref}
            viewBox={`0 0 ${size} ${size}`}
            width={size}
            height={size}
            className="absolute inset-0"
          >
            {/* Background circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              className="text-border-primary"
            />

            {/* Gradient arc */}
            <defs>
              <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" className="text-accent-green" stopColor="#10b981" />
                <stop offset="35%" className="text-accent-amber" stopColor="#f59e0b" />
                <stop offset="36%" stopColor="transparent" />
              </linearGradient>
            </defs>

            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="url(#scoreGradient)"
              strokeWidth="4"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{
                transform: `rotate(-90deg)`,
                transformOrigin: `${size / 2}px ${size / 2}px`,
                transition: "stroke-dashoffset 0.3s ease",
              }}
            />
          </svg>

          {/* Center content */}
          <div className="absolute inset-0 flex items-center justify-center flex-col gap-1">
            <div className="flex items-baseline gap-0.5">
              <span className="font-mono text-5xl font-bold text-text-primary">{score.toFixed(1)}</span>
              <span className="font-mono text-sm text-text-tertiary">/{maxScore}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

ScoreRing.displayName = "ScoreRing";
