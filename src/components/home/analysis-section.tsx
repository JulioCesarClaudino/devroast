import * as React from "react";
import { Card } from "@/components/ui/card";

export interface IssueItem {
  status: "critical" | "warning" | "good";
  title: string;
  description: string;
}

export interface AnalysisSectionProps {
  issues: IssueItem[];
}

export const AnalysisSection: React.FC<AnalysisSectionProps> = ({ issues }) => {
  return (
    <div className="w-full flex flex-col gap-3">
      {/* Title Row */}
      <div className="flex items-center gap-2 font-mono text-sm md:text-base">
        <span className="text-accent-green font-bold">{"//"}</span>
        <span className="text-text-primary font-bold">detailed_analysis</span>
      </div>

      {/* Issues Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        {issues.map((issue, index) => (
          <Card
            key={index}
            status={issue.status}
            title={issue.title}
            description={issue.description}
          />
        ))}
      </div>
    </div>
  );
};

AnalysisSection.displayName = "AnalysisSection";
