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
      <div className="flex h-screen w-full "> 
        <Sidebar isExpanded={isSidebarExpanded} setExpanded={setSidebarExpanded} />
        <main
          className={cn(
            "flex flex-col flex-1 h-full overflow-hidden w-0",
          )}
        >
          <div className="flex-1 h-full "> 
             <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
            {children}
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
}