"use client";

import { PageTransition } from "@/components/page-transition";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/sidebar";
import { AnimatePresence } from "framer-motion";

import NextNProgressClient from "@/components/next-nprogress";

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
      <NextNProgressClient>
        <div className="flex h-full w-full ">
          <Sidebar
            isExpanded={isSidebarExpanded}
            setExpanded={setSidebarExpanded}
          />
          <main className={cn("flex flex-col flex-1 h-full w-0")}>
            <div className="flex-1 h-full overflow-y-auto">{children}</div>
          </main>
        </div>
      </NextNProgressClient>
    </ThemeProvider>
  );
}