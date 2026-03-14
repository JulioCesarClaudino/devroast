"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DiffLine } from "@/components/ui/diff-line";
import { ScoreRing } from "@/components/ui/score-ring";
import { TableRow } from "@/components/ui/table-row";
import { Toggle } from "@/components/ui/toggle";

export default function ComponentsPage() {
  const [roastMode, setRoastMode] = useState(false);

  return (
    <div className="min-h-screen bg-bg-page p-8">
      <div className="max-w-6xl mx-auto space-y-16">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold font-mono text-text-primary">
            $ ui_components
          </h1>
          <p className="text-lg text-text-secondary">
            All available UI components with their variants and configurations
          </p>
        </div>

        {/* Button Component */}
        <section className="space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold font-mono text-text-primary">
              // button_component
            </h2>
            <p className="text-text-secondary">
              Interactive button component with multiple variants, sizes, and states
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold font-mono text-text-primary">
                Primary Variant
              </h3>
              <p className="text-sm text-text-secondary">
                Default interactive button with green accent
              </p>
            </div>
            <div className="flex flex-wrap gap-4 p-6 bg-bg-surface rounded-lg border border-border-primary">
              <Button>$ roast_my_code</Button>
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
              <Button size="xl">Extra Large</Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold font-mono text-text-primary">
                Secondary Variant
              </h3>
              <p className="text-sm text-text-secondary">Alternative button style</p>
            </div>
            <div className="flex flex-wrap gap-4 p-6 bg-bg-surface rounded-lg border border-border-primary">
              <Button variant="secondary">$ share_roast</Button>
              <Button variant="secondary" size="sm">
                Small
              </Button>
              <Button variant="secondary" size="md">
                Medium
              </Button>
              <Button variant="secondary" size="lg">
                Large
              </Button>
              <Button variant="secondary" size="xl">
                Extra Large
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold font-mono text-text-primary">
                Link Variant
              </h3>
              <p className="text-sm text-text-secondary">
                Minimal button with border outline
              </p>
            </div>
            <div className="flex flex-wrap gap-4 p-6 bg-bg-surface rounded-lg border border-border-primary">
              <Button variant="outline">$ view_all &gt;&gt;</Button>
              <Button variant="outline" size="sm">
                Small
              </Button>
              <Button variant="outline" size="md">
                Medium
              </Button>
              <Button variant="outline" size="lg">
                Large
              </Button>
              <Button variant="outline" size="xl">
                Extra Large
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold font-mono text-text-primary">
                Ghost Variant
              </h3>
              <p className="text-sm text-text-secondary">
                Invisible button with hover effect
              </p>
            </div>
            <div className="flex flex-wrap gap-4 p-6 bg-bg-surface rounded-lg border border-border-primary">
              <Button variant="ghost">Ghost Button</Button>
              <Button variant="ghost" size="sm">
                Small
              </Button>
              <Button variant="ghost" size="md">
                Medium
              </Button>
              <Button variant="ghost" size="lg">
                Large
              </Button>
              <Button variant="ghost" size="xl">
                Extra Large
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold font-mono text-text-primary">
              Button States
            </h3>

            <div className="space-y-3">
              <h4 className="font-mono text-sm font-medium text-text-secondary">
                Disabled
              </h4>
              <div className="flex flex-wrap gap-4 p-6 bg-bg-surface rounded-lg border border-border-primary">
                <Button disabled>Primary</Button>
                <Button variant="secondary" disabled>
                  Secondary
                </Button>
                <Button variant="outline" disabled>
                  Outline
                </Button>
                <Button variant="ghost" disabled>
                  Ghost
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-mono text-sm font-medium text-text-secondary">
                Loading
              </h4>
              <div className="flex flex-wrap gap-4 p-6 bg-bg-surface rounded-lg border border-border-primary">
                <Button isLoading>Primary</Button>
                <Button variant="secondary" isLoading>
                  Secondary
                </Button>
                <Button variant="outline" isLoading>
                  Outline
                </Button>
                <Button variant="ghost" isLoading>
                  Ghost
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold font-mono text-text-primary">
              Custom Styling
            </h3>
            <div className="flex flex-col gap-4 p-6 bg-bg-surface rounded-lg border border-border-primary">
              <Button className="w-full">Full Width</Button>
              <Button className="rounded-full">Pill Button</Button>
              <Button className="w-32">Custom Width</Button>
            </div>
          </div>
        </section>

        {/* Badge Component */}
        <section className="space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold font-mono text-text-primary">
              // badge_component
            </h2>
            <p className="text-text-secondary">
              Status indicator with colored dot and optional label
            </p>
          </div>

          <div className="flex flex-wrap gap-6 p-6 bg-bg-surface rounded-lg border border-border-primary">
            <Badge variant="critical" label="Critical" />
            <Badge variant="warning" label="Warning" />
            <Badge variant="good" label="Good" />
            <Badge variant="verdict" label="Verdict" />
          </div>
        </section>

        {/* Card Component */}
        <section className="space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold font-mono text-text-primary">
              // card_component
            </h2>
            <p className="text-text-secondary">
              Container with header badge, title, description, and content
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 p-6 bg-bg-surface rounded-lg border border-border-primary">
            <Card
              status="critical"
              title="Critical Issue Found"
              description="The function does not handle edge cases properly. Missing null checks and error handling for invalid inputs."
            />
            <Card
              status="warning"
              title="Performance Warning"
              description="Potential performance issue detected. Consider optimizing the algorithm complexity from O(n²) to O(n log n)."
            />
            <Card
              status="good"
              title="Code Quality Good"
              description="Well-structured component with proper TypeScript types and comprehensive error handling."
            />
          </div>
        </section>

        {/* DiffLine Component */}
        <section className="space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold font-mono text-text-primary">
              // diff_line_component
            </h2>
            <p className="text-text-secondary">
              Code diff visualization with add/remove/context indicators
            </p>
          </div>

          <div className="p-0 bg-bg-surface rounded-lg border border-border-primary overflow-hidden">
            <DiffLine type="context" code="function calculateSum(arr) {" />
            <DiffLine type="removed" code="  return arr.reduce((a, b) => a + b);" />
            <DiffLine type="added" code="  return arr.reduce((a, b) => a + b, 0);" />
            <DiffLine type="context" code="}" />
          </div>
        </section>

        {/* TableRow Component */}
        <section className="space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold font-mono text-text-primary">
              // table_row_component
            </h2>
            <p className="text-text-secondary">
              Flexible row component for table-like layouts with customizable columns
            </p>
          </div>

          <div className="border border-border-primary rounded-lg overflow-hidden bg-bg-surface">
            <TableRow
              cells={[
                {
                  content: (
                    <span className="font-mono text-sm font-bold text-text-primary">
                      #1
                    </span>
                  ),
                  width: "40px",
                },
                {
                  content: <span className="font-mono text-sm font-bold text-accent-red">1250</span>,
                  width: "60px",
                },
                {
                  content: (
                    <span className="font-mono text-sm text-text-secondary">
                      console.log(&apos;hello&apos;)
                    </span>
                  ),
                },
                {
                  content: (
                    <span className="font-mono text-sm text-text-secondary">
                      JavaScript
                    </span>
                  ),
                  width: "100px",
                },
              ]}
            />
            <TableRow
              cells={[
                {
                  content: (
                    <span className="font-mono text-sm font-bold text-text-primary">
                      #2
                    </span>
                  ),
                  width: "40px",
                },
                {
                  content: <span className="font-mono text-sm font-bold text-accent-red">980</span>,
                  width: "60px",
                },
                {
                  content: (
                    <span className="font-mono text-sm text-text-secondary">
                      const greeting = &apos;Hi&apos;
                    </span>
                  ),
                },
                {
                  content: (
                    <span className="font-mono text-sm text-text-secondary">
                      TypeScript
                    </span>
                  ),
                  width: "100px",
                },
              ]}
            />
            <TableRow
              cells={[
                {
                  content: (
                    <span className="font-mono text-sm font-bold text-text-primary">
                      #3
                    </span>
                  ),
                  width: "40px",
                },
                {
                  content: <span className="font-mono text-sm font-bold text-accent-red">756</span>,
                  width: "60px",
                },
                {
                  content: (
                    <span className="font-mono text-sm text-text-secondary">
                      function* generator() {}
                    </span>
                  ),
                },
                {
                  content: (
                    <span className="font-mono text-sm text-text-secondary">
                      Python
                    </span>
                  ),
                  width: "100px",
                },
              ]}
            />
          </div>
        </section>

        {/* Toggle Component */}
        <section className="space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold font-mono text-text-primary">
              // toggle_component
            </h2>
            <p className="text-text-secondary">
              Switch component with optional label and dynamic styling
            </p>
          </div>

          <div className="flex flex-col gap-6 p-6 bg-bg-surface rounded-lg border border-border-primary">
            <div>
              <h3 className="text-sm font-mono text-text-secondary mb-3">Unchecked</h3>
              <Toggle checked={false} onCheckedChange={() => {}} label="roast mode" />
            </div>

            <div>
              <h3 className="text-sm font-mono text-text-secondary mb-3">Checked</h3>
              <Toggle checked={true} onCheckedChange={() => {}} label="roast mode" />
            </div>

            <div>
              <h3 className="text-sm font-mono text-text-secondary mb-3">
                Interactive
              </h3>
              <Toggle checked={roastMode} onCheckedChange={setRoastMode} label="roast mode" />
            </div>

            <div>
              <h3 className="text-sm font-mono text-text-secondary mb-3">Disabled</h3>
              <Toggle checked={false} onCheckedChange={() => {}} label="roast mode" disabled />
            </div>
          </div>
        </section>

        {/* ScoreRing Component */}
        <section className="space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold font-mono text-text-primary">
              // score_ring_component
            </h2>
            <p className="text-text-secondary">
              Circular score visualization with gradient arc and centered text
            </p>
          </div>

          <div className="flex flex-col gap-8 p-6 bg-bg-surface rounded-lg border border-border-primary items-center">
            <div>
              <h3 className="text-sm font-mono text-text-secondary mb-6 text-center">
                Score: 3.5/10
              </h3>
              <ScoreRing score={3.5} maxScore={10} size={180} />
            </div>

            <div>
              <h3 className="text-sm font-mono text-text-secondary mb-6 text-center">
                Score: 8.2/10
              </h3>
              <ScoreRing score={8.2} maxScore={10} size={180} />
            </div>

            <div>
              <h3 className="text-sm font-mono text-text-secondary mb-6 text-center">
                Score: 5.0/10
              </h3>
              <ScoreRing score={5.0} maxScore={10} size={180} />
            </div>
          </div>
        </section>

        {/* Usage Guide */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold font-mono text-text-primary">$ usage_guide</h2>

          <div className="bg-bg-surface p-6 rounded-lg border border-border-primary">
            <h3 className="font-mono font-semibold text-text-primary mb-4">
              Importing Components
            </h3>
            <pre className="bg-bg-input text-text-primary p-4 rounded overflow-x-auto text-sm font-mono">
              {`import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { DiffLine } from "@/components/ui/diff-line";
import { TableRow } from "@/components/ui/table-row";
import { Toggle } from "@/components/ui/toggle";
import { ScoreRing } from "@/components/ui/score-ring";`}
            </pre>
          </div>

          <div className="bg-bg-surface p-6 rounded-lg border border-border-primary">
            <h3 className="font-mono font-semibold text-text-primary mb-4">
              All Props Reference
            </h3>
            <pre className="bg-bg-input text-text-primary p-4 rounded overflow-x-auto text-sm font-mono">
              {`// Button
variant="primary" | "secondary" | "outline" | "ghost"
size="sm" | "md" | "lg" | "xl"
disabled, isLoading, className, ...HTMLButtonElement

// Badge
variant="critical" | "warning" | "good" | "verdict"
label?: ReactNode

// Card
status?: BadgeVariant
title: ReactNode (required)
description: ReactNode (required)
children?: ReactNode

// DiffLine
type="added" | "removed" | "context" (required)
code: string (required)

// TableRow
cells: Array<{ content: ReactNode, width?: string | number }>

// Toggle
checked: boolean (required)
onCheckedChange: (checked: boolean) => void (required)
label?: string
disabled?: boolean

// ScoreRing
score: number (required)
maxScore?: number (default: 10)
size?: number (default: 180)`}
            </pre>
          </div>
        </section>
      </div>
    </div>
  );
}
