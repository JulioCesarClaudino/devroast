import * as React from "react";
import { ScoreRing } from "@/components/ui/score-ring";
import { Badge } from "@/components/ui/badge";

export interface RoastSummaryProps {
  score: number;
  verdict: "needs_serious_help" | "needs_work" | "okay" | "pretty_good" | "chef_kiss";
  roastTitle: string;
  language: string;
  lines: number;
}

const verdictConfig: Record<string, { label: string; variant: "critical" | "warning" | "good" }> = {
  needs_serious_help: { label: "verdict: needs_serious_help", variant: "critical" },
  needs_work: { label: "verdict: needs_work", variant: "critical" },
  okay: { label: "verdict: okay", variant: "warning" },
  pretty_good: { label: "verdict: pretty_good", variant: "good" },
  chef_kiss: { label: "verdict: chef_kiss", variant: "good" },
};

export const RoastSummary: React.FC<RoastSummaryProps> = ({
  score,
  verdict,
  roastTitle,
  language,
  lines,
}) => {
  const config = verdictConfig[verdict] || verdictConfig.needs_serious_help;

  return (
    <div className="flex flex-col md:flex-row gap-8 md:gap-12 w-full">
      {/* Score Ring */}
      <div className="flex-shrink-0">
        <ScoreRing score={score} maxScore={10} size={180} />
      </div>

      {/* Roast Summary */}
      <div className="flex flex-col gap-4 flex-1">
        {/* Badge */}
        <Badge variant={config.variant} label={config.label} />

        {/* Roast Title */}
        <p className="font-mono text-lg md:text-xl leading-relaxed text-text-primary">
          &quot;{roastTitle}&quot;
        </p>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-text-tertiary">
          <span>lang: {language}</span>
          <span>·</span>
          <span>{lines} lines</span>
        </div>
      </div>
    </div>
  );
};

RoastSummary.displayName = "RoastSummary";
