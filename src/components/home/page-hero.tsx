import * as React from "react";

interface StatItem {
  label: string;
  value: string | number;
  highlight?: boolean;
}

interface PageHeroProps {
  title: string;
  titlePrefix?: string;
  subtitle?: string;
  stats?: StatItem[];
}

export const PageHero: React.FC<PageHeroProps> = ({
  title,
  titlePrefix,
  subtitle,
  stats,
}) => {
  return (
    <div className="w-full px-4 sm:px-6 md:px-10 py-12 sm:py-16 md:py-20">
      <div className="mx-auto max-w-6xl flex flex-col gap-4">
        {/* Title */}
        <h1 className="font-mono text-4xl sm:text-5xl md:text-6xl font-bold">
          {titlePrefix && (
            <span className="text-accent-green">{titlePrefix}</span>
          )}{" "}
          <span className="text-text-primary">{title}</span>
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p className="font-mono text-sm sm:text-base text-text-secondary">
            {subtitle}
          </p>
        )}

        {/* Stats */}
        {stats && stats.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-xs sm:text-sm font-mono text-text-tertiary">
            {stats.map((stat, index) => (
              <div key={index}>
                <span className={stat.highlight ? "text-accent-red font-bold" : "text-text-secondary"}>
                  {stat.value}
                </span>{" "}
                {stat.label}
                {stat.highlight && " 🔥"}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

PageHero.displayName = "PageHero";
