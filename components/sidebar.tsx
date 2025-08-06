"use client";

import { useMediaQuery } from "@/lib/hooks/use-media-query";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";
import {
  Home,
  PlusCircle,
  Briefcase,
  CircleUser,
  HelpCircle,
  PanelLeft,
  PanelRight,
  Mail,
  Sparkles,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import Image from "next/image";
import axios from 'axios';
import { useEffect, useState } from "react";

interface SidebarProps {
  isExpanded: boolean;
  setExpanded: (expanded: boolean) => void;
}

interface ChatSession {
  id: string;
  title: string;
}

export function Sidebar({ isExpanded, setExpanded }: SidebarProps) {
  const pathname = usePathname();
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    const fetchChatSessions = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get<ChatSession[]>('/api/chats');
        setChatSessions(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching chat sessions:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (isExpanded || !isDesktop) {
      fetchChatSessions();
    }
  }, [isExpanded, isDesktop]);

  const navItems = [
    { href: "/create", icon: Home, label: "Home" },
    { href: "/brand-kit", icon: Briefcase, label: "Brand Kit" },
    { href: "/emails", icon: Mail, label: "Emails" },
  ];

  const bottomNavItems = [
    { href: "/upgrade", icon: Sparkles, label: "Upgrade" },
    { href: "/help", icon: HelpCircle, label: "Help" },
    { href: "/profile", icon: CircleUser, label: "Profile" },
  ];

  const sidebarContent = (isMobile = false) => (
    <div className="flex flex-col h-full  border-r">
      <div
        className={cn(
          "flex items-center",
          (isExpanded || isMobile) ? "h-[60px] justify-start px-3" : "h-[60px] justify-center"
        )}
      >
        <Link
          href="/create"
          className={cn(
            "group flex items-center gap-2 font-semibold text-foreground select-none outline-none",
            (isExpanded || isMobile) ? "rounded-md px-3 py-2" : "h-9 w-9 shrink-0 justify-center rounded-full md:h-8 md:w-8"
          )}
        >
          <Image src="/icon.svg" alt="RenderPart Logo" width={40} height={40} />
          <span
            className={cn(
              "whitespace-nowrap transition-opacity ease-in-out duration-200",
              (isExpanded || isMobile) ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
            )}
            aria-hidden={!(isExpanded || isMobile)}
          >
            Capsule.Email
          </span>
        </Link>
      </div>
      <nav className="flex flex-col gap-2 p-2 flex-1 overflow-hidden">
        <Button asChild variant="ghost" className={cn(
          "w-full rounded-lg",
          pathname === "/create" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-sidebar-hover",
          !(isExpanded || isMobile) ? "justify-center" : "justify-start",
        )}>
          <Link
            href="/create"
            className={cn(
              "flex items-center",
              (isExpanded || isMobile) ? "justify-start gap-3" : "justify-center",
            )}
          >
            <PlusCircle className="h-5 w-5 shrink-0" />
            <span
              className={cn(
                "whitespace-nowrap transition-opacity ease-in-out duration-200",
                (isExpanded || isMobile) ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
              )}
              aria-hidden={!(isExpanded || isMobile)}
            >
              New Email
            </span>
          </Link>
        </Button>
        <div className="my-2 border-t" />
        {navItems.map((item) => (
          <Button
            key={item.href}
            asChild
            variant="ghost"
            className={cn(
              "w-full rounded-lg",
              pathname === item.href
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-sidebar-hover",
              !(isExpanded || isMobile) ? "justify-center" : "justify-start"
            )}
          >
            <Link
              href={item.href}
              className={cn(
                "flex items-center",
                (isExpanded || isMobile) && "gap-3",
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              <span
                className={cn(
                  "whitespace-nowrap transition-opacity ease-in-out duration-200",
                  (isExpanded || isMobile) ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
                )}
                aria-hidden={!(isExpanded || isMobile)}
              >
                {item.label}
              </span>
            </Link>
          </Button>
        ))}
        {chatSessions.length > 0 && (
          <>
            <div className="my-2 border-t" />
            <h3
              className={cn(
                "text-xs font-semibold text-muted-foreground px-3 mb-1",
                (isExpanded || isMobile) ? "block" : "hidden"
              )}
            >
              Chat Sessions
            </h3>
            <div className={cn("flex-1", (isExpanded || isMobile) ? "overflow-y-auto" : "overflow-hidden")}>
            {isLoading ?
              <div className={cn("flex items-center justify-center self-center", (isExpanded || isMobile) ? 'block': 'hidden')}>
                <Image src="/icon.svg" alt="Loading..." width={30} height={30} className="animate-spin-slow" />
              </div>
              : chatSessions.map((session: ChatSession) => (
                <Button
                  key={session.id}
                  asChild
                  variant="ghost"
                  className={cn(
                    "w-full rounded-lg",
                    !(isExpanded || isMobile) ? "justify-center" : "justify-start",
                    pathname === `/chats/${session.id}`
                      ? (isExpanded || isMobile ? "bg-muted text-foreground" : "text-foreground")
                      : "text-muted-foreground hover:text-foreground hover:bg-sidebar-hover"
                  )}
                >
                  <Link
                    href={`/chats/${session.id}`}
                    className={cn(
                      "flex items-center",
                      (isExpanded || isMobile) ? "gap-3" : "justify-center",
                      !(isExpanded || isMobile) && "pointer-events-none"
                    )}
                  >
                    <span
                      className={cn(
                        "whitespace-nowrap transition-opacity ease-in-out duration-200 text-ellipsis overflow-hidden",
                        (isExpanded || isMobile) ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
                      )}
                      aria-hidden={!(isExpanded || isMobile)}
                    >
                      {session.title}
                    </span>
                  </Link>
                </Button>
              ))}
            </div>
          </>
        )}
      </nav>
      <nav className="mt-auto flex flex-col gap-2 p-2">
        <Button
          variant="ghost"
          className={cn(
            "flex items-center rounded-lg text-muted-foreground transition-colors hover:text-foreground hover:bg-accent",
            !(isExpanded || isMobile) ? "justify-center" : "justify-start"
          )}
          onClick={() => setExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <PanelLeft className="h-5 w-5 shrink-0" />
          ) : (
            <PanelRight className="h-5 w-5 shrink-0" />
          )}
          <span
            className={cn(
              "whitespace-nowrap transition-opacity ease-in-out duration-200",
              (isExpanded || isMobile) ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
            )}
            aria-hidden={!(isExpanded || isMobile)}
          >
            Collapse
          </span>
        </Button>
        {bottomNavItems.map((item) => (
          <Button
            key={item.href}
            asChild
            variant="ghost"
            className={cn(
              "w-full rounded-lg",
              pathname === item.href
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-sidebar-hover",
              !(isExpanded || isMobile) ? "justify-center" : "justify-start"
            )}
          >
            <Link
              href={item.href}
              className={cn(
                "flex items-center",
                (isExpanded || isMobile) && "gap-3",
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              <span
                className={cn(
                  "whitespace-nowrap transition-opacity ease-in-out duration-200",
                  (isExpanded || isMobile) ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
                )}
                aria-hidden={!(isExpanded || isMobile)}
              >
                {item.label}
              </span>
            </Link>
          </Button>
        ))}
      </nav>
    </div>
  );

  if (isDesktop) {
    return (
      <aside
        className={cn(
          "hidden flex-col bg-sidebar transition-[width] ease-in-out duration-300 sm:flex",
          isExpanded ? "w-56" : "w-16"
        )}
      >
        {sidebarContent(false)}
      </aside>
    );
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden fixed top-3 left-3 z-50 bg-background">
          <PanelRight className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-56">
        {sidebarContent(true)}
      </SheetContent>
    </Sheet>
  );
}
