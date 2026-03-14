import * as React from "react";

import { HeroSection } from "@/components/home/hero-section";
import { CodeEditor } from "@/components/home/code-editor";
import { ActionsBar } from "@/components/home/actions-bar";
import { FooterHint } from "@/components/home/footer-hint";
import { LeaderboardPreview } from "@/components/home/leaderboard-preview";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-page">
      {/* Content Container with max-width and centered */}
      <div className="w-full px-4 sm:px-6 md:px-10 py-12 sm:py-16 md:py-20">
        <div className="mx-auto max-w-6xl flex flex-col gap-8 sm:gap-10 md:gap-12">
          {/* Hero Section */}
          <section>
            <HeroSection />
          </section>

          {/* Code Editor */}
          <section className="flex justify-center">
            <CodeEditor />
          </section>

          {/* Actions Bar */}
          <section className="flex justify-center">
            <ActionsBar />
          </section>

          {/* Footer Hint */}
          <section>
            <FooterHint />
          </section>

          {/* Spacer */}
          <div className="h-8 sm:h-12 md:h-16" />

          {/* Leaderboard Preview */}
          <section>
            <LeaderboardPreview />
          </section>

          {/* Bottom Padding */}
          <div className="h-12 sm:h-16 md:h-20" />
        </div>
      </div>
    </main>
  );
}
