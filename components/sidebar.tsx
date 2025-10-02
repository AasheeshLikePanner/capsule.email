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
  LogOut,
  LifeBuoy,
  Zap,
  Settings,
} from "lucide-react";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getChatSessions } from "@/lib/actions/chat";
import { User } from "@supabase/supabase-js"; // Added import
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  const [userPlan, setUserPlan] = useState<string | null>(null); // Added state
  const [subscriptionExpiresAt, setSubscriptionExpiresAt] = useState<string | null>(null); // Added state
  const [isSubscriptionExpired, setIsSubscriptionExpired] = useState<boolean>(false); // Added state
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  useEffect(() => {
    const fetchChatSessions = async () => {
      try {
        setIsLoading(true);
        const data = await getChatSessions();
        setChatSessions(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching chat sessions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchUserData = async () => { // Added function to fetch user data
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: userData, error } = await supabase
          .from('users')
          .select('plan, subscription_expires_at')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error("Error fetching user data:", error);
        } else if (userData) {
          setUserPlan(userData.plan);
          setSubscriptionExpiresAt(userData.subscription_expires_at);
          setIsSubscriptionExpired(userData.subscription_expires_at && new Date(userData.subscription_expires_at).getTime() < Date.now());
        }
      }
    };

    if (isExpanded || !isDesktop) {
      fetchChatSessions();
    }
    fetchUserData(); // Call fetchUserData
  }, [isExpanded, isDesktop]);

  const navItems = [
    { href: "/create", icon: Home, label: "Home" },
    { href: "/brand-kit", icon: Briefcase, label: "Brand Kit" },
    { href: "/emails", icon: Mail, label: "Emails" },
  ];

  

  const calculateRemainingDays = (expiresAt: string) => {
    const now = new Date();
    const expiryDate = new Date(expiresAt);
    const diffTime = expiryDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? `${diffDays} days left` : "Expired";
  };

  const sidebarContent = (isMobile = false) => (
    <TooltipProvider>
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
          <Tooltip>
            <TooltipTrigger asChild>
              <Button asChild variant="ghost" className={cn(
                "w-full rounded-lg",
                pathname === "/create" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-accent",
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
            </TooltipTrigger>
            {!(isExpanded || isMobile) && (
              <TooltipContent side="right">
                <p>New Email</p>
              </TooltipContent>
            )}
          </Tooltip>
          <div className="my-2 border-t" />
          {navItems.map((item) => (
            <Tooltip key={item.href}>
              <TooltipTrigger asChild>
                <Button
                  key={item.href}
                  asChild
                  variant="ghost"
                  className={cn(
                    "w-full rounded-lg",
                    pathname === item.href
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent",
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
              </TooltipTrigger>
              {!(isExpanded || isMobile) && (
                <TooltipContent side="right">
                  <p>{item.label}</p>
                </TooltipContent>
              )}
            </Tooltip>
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
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
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
          <Tooltip>
            <TooltipTrigger asChild>
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
            </TooltipTrigger>
            {!(isExpanded || isMobile) && (
              <TooltipContent side="right">
                <p>Collapse</p>
              </TooltipContent>
            )}
          </Tooltip>
          {/*
          {userPlan === "pro" && !isSubscriptionExpired ? (
            // Active Pro Plan - Display "Subscribed" (no link)
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full rounded-lg",
                    "bg-accent text-accent-foreground",
                    !(isExpanded || isMobile) ? "justify-center" : "justify-start"
                  )}
                >
                  <Zap className="h-5 w-5 shrink-0" />
                  <span
                    className={cn(
                      "whitespace-nowrap transition-opacity ease-in-out duration-200",
                      (isExpanded || isMobile) ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
                    )}
                    aria-hidden={!(isExpanded || isMobile)}
                  >
                    Subscribed {subscriptionExpiresAt && `(${calculateRemainingDays(subscriptionExpiresAt)})`}
                  </span>
                </Button>
              </TooltipTrigger>
              {!(isExpanded || isMobile) && (
                <TooltipContent side="right">
                  <p>Subscribed</p>
                </TooltipContent>
              )}
            </Tooltip>
          ) : (userPlan === "pro" && isSubscriptionExpired) || userPlan !== "pro" ? (
            // Expired Pro Plan OR Free Plan - Display "Upgrade" button with link
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  asChild
                  variant="ghost"
                  className={cn(
                    "w-full rounded-lg",
                    pathname === "/upgrade"
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent",
                    !(isExpanded || isMobile) ? "justify-center" : "justify-start"
                  )}
                >
                  <Link
                    href="/upgrade"
                    className={cn(
                      "flex items-center",
                      (isExpanded || isMobile) && "gap-3",
                    )}
                  >
                    <Sparkles className="h-5 w-5 shrink-0" />
                    <span
                      className={cn(
                        "whitespace-nowrap transition-opacity ease-in-out duration-200",
                        (isExpanded || isMobile) ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
                      )}
                      aria-hidden={!(isExpanded || isMobile)}
                    >
                      Upgrade
                    </span>
                  </Link>
                </Button>
              </TooltipTrigger>
              {!(isExpanded || isMobile) && (
                <TooltipContent side="right">
                  <p>Upgrade</p>
                </TooltipContent>
              )}
            </Tooltip>
          ) : null}
          */}
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full rounded-lg",
                      "text-muted-foreground hover:text-foreground hover:bg-accent",
                      !(isExpanded || isMobile) ? "justify-center" : "justify-start"
                    )}
                  >
                    <Settings className="h-5 w-5 shrink-0" />
                    <span
                      className={cn(
                        "whitespace-nowrap transition-opacity ease-in-out duration-200",
                        (isExpanded || isMobile) ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
                      )}
                      aria-hidden={!(isExpanded || isMobile)}
                    >
                      Settings
                    </span>
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              {!(isExpanded || isMobile) && (
                <TooltipContent side="right">
                  <p>Settings</p>
                </TooltipContent>
              )}
            </Tooltip>
            <DropdownMenuContent className="w-48" align="end" forceMount>
              <DropdownMenuItem asChild>
                <Link href="/help" className="flex items-center gap-2 cursor-pointer">
                  <HelpCircle className="h-4 w-4" />
                  <span>Help</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href="mailto:ashishrathour1102@gmail.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 cursor-pointer">
                  <LifeBuoy className="h-4 w-4" />
                  <span>Support</span>
                </a>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                <LogOut className="h-4 w-4 mr-2" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
    </TooltipProvider>
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
