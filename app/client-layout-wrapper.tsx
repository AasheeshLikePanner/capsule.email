"use client";

import { ThemeProvider } from "next-themes";
import "./globals.css";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/sidebar";

export function RootLayoutClient({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarExpanded, setSidebarExpanded] = useState(false);

  return (
    <ThemeProvider
      attribute="class" 
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="flex min-h-screen w-full flex-col    overflow-hidden">
        <Sidebar isExpanded={isSidebarExpanded} setExpanded={setSidebarExpanded} />
        <main
          className={cn(
            "flex flex-col sm:gap-4 sm:py-2 rounded-l-2xl bg-background",
            isSidebarExpanded ? "sm:pl-56" : "sm:pl-16"
          )}
        >
          <div className="flex-1 bg-muted/40 rounded-l-2xl">
            {children}
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
}
