"use client";

import { cn } from "@/lib/utils";
import React from "react";

export function AuroraBackground({
  children,
  className,
  showRadialGradient = true,
}) {
  return (
    <div className="h-full w-full bg-[#0a192f] relative flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className={cn(
          "h-full w-full [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_80%)]",
          className
        )}>
          <div className="absolute inset-0 bg-gradient-to-r from-[#4c00ff] via-[#1cc4d7] to-[#4c00ff] opacity-20 blur-[100px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-[#1cc4d7] to-transparent opacity-20 blur-[100px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#4c00ff] to-transparent opacity-20 blur-[100px]" />
          <div className="absolute inset-0 animate-aurora" />
        </div>
      </div>
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
} 