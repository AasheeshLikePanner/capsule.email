"use client";

import { ThemeProvider } from "next-themes";
import "./globals.css";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/sidebar";
import { usePathname } from "next/navigation";

import NextNProgressClient from "@/components/next-nprogress";
import { Toaster } from "sonner";


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
        <Toaster theme="dark" />
        <div className="flex h-full w-full ">
          {!noSidebarPaths.includes(pathname) && (
            <Sidebar
              isExpanded={isSidebarExpanded}
              setExpanded={setSidebarExpanded}
            />
          )}
          <main className={cn("flex flex-col flex-1 h-full w-0")}>
            <div className="flex-1 h-full overflow-y-auto">{children}</div>
          </main>
        </div>
      </NextNProgressClient>
    </ThemeProvider>
  );
}