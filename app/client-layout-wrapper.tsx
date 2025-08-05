"use client";

import { PageTransition } from "@/components/page-transition";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/sidebar";
import { AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

import NextNProgressClient from "@/components/next-nprogress";

import { Navbar } from "@/components/navbar";

export function RootLayoutClient({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarExpanded, setSidebarExpanded] = useState(false);
  const pathname = usePathname();
  const noSidebarPaths = ["/", "/auth/login"];

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <NextNProgressClient>
        <Navbar />
        <div className="flex h-full w-full ">
          {!noSidebarPaths.includes(pathname) && (
            <Sidebar
              isExpanded={isSidebarExpanded}
              setExpanded={setSidebarExpanded}
            />
          )}
          <div className="flex flex-col flex-1 h-full mx-auto w-1/2 border-l border-r">
            <main className={cn("flex flex-col flex-1 h-full overflow-y-auto")}>
              {children}
            </main>
          </div>
        </div>
      </NextNProgressClient>
    </ThemeProvider>
  );
}