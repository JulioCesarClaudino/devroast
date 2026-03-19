import * as React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getMockRoast } from "@/lib/mock-data";
import { RoastSummary } from "@/components/home/roast-summary";
import { SubmittedCodeSection } from "@/components/home/submitted-code-section";
import { AnalysisSection } from "@/components/home/analysis-section";
import { DiffSection } from "@/components/home/diff-section";
import { FooterHint } from "@/components/home/footer-hint";

interface RoastPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function RoastPage({ params }: RoastPageProps) {
  const { id } = await params;
  const roastData = getMockRoast(id);

  if (!roastData) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-bg-page flex flex-col">
      {/* Navigation */}
      <nav className="w-full h-14 border-b border-border-primary bg-bg-page flex items-center px-4 sm:px-6 md:px-10">
        <div className="mx-auto max-w-6xl w-full flex items-center justify-between">
          <Link
            href="/"
            className="font-mono text-lg font-bold text-accent-green hover:text-accent-green/80 transition-colors"
          >
            💀 devroast
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 w-full">
        <div className="w-full px-4 sm:px-6 md:px-10 py-8 sm:py-12 md:py-16">
          <div className="mx-auto max-w-6xl flex flex-col gap-8">
            {/* Score Hero Section */}
            <section>
              <RoastSummary {...roastData.summary} />
            </section>

            {/* Divider */}
            <div className="w-full h-px bg-border-primary" />

            {/* Submitted Code Section */}
            <section>
              <SubmittedCodeSection
                code={roastData.code}
                language={roastData.language}
              />
            </section>

            {/* Divider + Extra Space */}
            <div className="w-full flex flex-col gap-8">
              <div className="w-full h-px bg-border-primary" />
            </div>

            {/* Analysis Section */}
            <section>
              <AnalysisSection issues={roastData.analysis.issues} />
            </section>

            {/* Divider */}
            <div className="w-full h-px bg-border-primary" />

            {/* Diff Section */}
            <section>
              <DiffSection {...roastData.diff} />
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <FooterHint roastCount={1250} avgScore={6.2} />
    </div>
  );
}

export function generateStaticParams() {
  return [{ id: "550e8400-e29b-41d4-a716-446655440000" }];
}
