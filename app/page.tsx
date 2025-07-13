'use client';

import { Hero } from "@/components/hero";
import { Sidebar } from "@/components/sidebar";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function Home() {
  const [isSidebarExpanded, setSidebarExpanded] = useState(false);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Sidebar isExpanded={isSidebarExpanded} setExpanded={setSidebarExpanded} />
      <main
        className={cn(
          "flex flex-col sm:gap-4 sm:py-4 transition-all duration-300",
          isSidebarExpanded ? "sm:pl-56" : "sm:pl-16"
        )}
      >
        <div className="flex-1 flex flex-col gap-20 max-w-5xl p-5">
          <Hero />
        </div>
      </main>
    </div>
  );
}
