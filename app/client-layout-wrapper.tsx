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
      <div className="flex h-screen w-full border-4 border-red-500"> {/* Debug Border */}
        <Sidebar isExpanded={isSidebarExpanded} setExpanded={setSidebarExpanded} />
        <main
          className={cn(
            "flex flex-col flex-1 h-full overflow-hidden w-0 border-4 border-green-500", /* Debug Border */
          )}
        >
          <div className="flex-1 h-full border-4 border-blue-500"> {/* Debug Border */}
            {children}
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
}