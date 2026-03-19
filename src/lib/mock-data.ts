import { RoastSummaryProps } from "@/components/home/roast-summary";
import { AnalysisSectionProps } from "@/components/home/analysis-section";
import { DiffSectionProps } from "@/components/home/diff-section";

export interface RoastData {
  id: string;
  summary: RoastSummaryProps;
  code: string;
  language: string;
  analysis: AnalysisSectionProps;
  diff: DiffSectionProps;
}

export const MOCK_ROASTS: Record<string, RoastData> = {
  "550e8400-e29b-41d4-a716-446655440000": {
    id: "550e8400-e29b-41d4-a716-446655440000",
    summary: {
      score: 3.5,
      verdict: "needs_serious_help",
      roastTitle: "this code looks like it was written during a power outage... in 2005.",
      language: "javascript",
      lines: 7,
    },
    code: `function getUser(id) {
  var user = null;
  for (var i = 0; i < users.length; i++) {
    if (users[i].id == id) {
      user = users[i];
    }
  }
  return user;
}`,
    language: "javascript",
    analysis: {
      issues: [
        {
          status: "critical",
          title: "Using var",
          description: "Modern JavaScript uses const/let for better scoping and predictability.",
        },
        {
          status: "critical",
          title: "Imperative Loop",
          description: "Use find() or filter() instead of manual loops for cleaner code.",
        },
        {
          status: "warning",
          title: "Loose Equality",
          description: "Use === instead of == to avoid unexpected type coercion.",
        },
        {
          status: "warning",
          title: "No Input Validation",
          description: "Always validate input parameters to prevent runtime errors.",
        },
      ],
    },
    diff: {
      fromFile: "getUser.js",
      toFile: "getUser.improved.js",
      diff: [
        {
          type: "context",
          code: "// Better approach using Array.find()",
        },
        {
          type: "removed",
          code: "function getUser(id) {",
        },
        {
          type: "removed",
          code: "  var user = null;",
        },
        {
          type: "removed",
          code: "  for (var i = 0; i < users.length; i++) {",
        },
        {
          type: "removed",
          code: "    if (users[i].id == id) {",
        },
        {
          type: "removed",
          code: "      user = users[i];",
        },
        {
          type: "removed",
          code: "    }",
        },
        {
          type: "removed",
          code: "  }",
        },
        {
          type: "added",
          code: "function getUser(id) {",
        },
        {
          type: "added",
          code: "  return users.find(user => user.id === id);",
        },
        {
          type: "added",
          code: "}",
        },
        {
          type: "context",
          code: "",
        },
      ],
    },
  },
};

export function getMockRoast(id: string): RoastData | undefined {
  return MOCK_ROASTS[id];
}

export function getAllMockRoastIds(): string[] {
  return Object.keys(MOCK_ROASTS);
}
