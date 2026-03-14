"use client";

import * as React from "react";
import { twMerge } from "tailwind-merge";

import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";

export const ActionsBar = () => {
  const [roastMode, setRoastMode] = React.useState(false);

  return (
    <div className="w-full">
      <div className={twMerge("flex items-center justify-between gap-4 sm:gap-8", "w-full")}>
        {/* Left Side - Toggle */}
        <div className="flex items-center gap-3">
          <Toggle checked={roastMode} onCheckedChange={setRoastMode} label="roast mode" />
          <span className="hidden sm:inline font-mono text-xs text-text-tertiary">
            // maximum sarcasm enabled
          </span>
        </div>

        {/* Right Side - Button */}
        <Button variant="primary" size="sm" className="whitespace-nowrap">
          $ roast_my_code
        </Button>
      </div>
    </div>
  );
};

ActionsBar.displayName = "ActionsBar";
