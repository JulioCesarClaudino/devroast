import * as React from "react";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  className = "",
}) => {
  return (
    <div className={`w-full px-4 sm:px-6 md:px-10 pb-12 sm:pb-16 md:pb-20 ${className}`}>
      <div className="mx-auto max-w-6xl flex flex-col gap-5">
        {children}
      </div>
    </div>
  );
};

PageContainer.displayName = "PageContainer";
