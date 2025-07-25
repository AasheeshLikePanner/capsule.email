'use client';

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
} from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import Image from "next/image";

interface SidebarProps {
  isExpanded: boolean;
  setExpanded: (expanded: boolean) => void;
}

export function Sidebar({ isExpanded, setExpanded }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { href: "/create", icon: Home, label: "Home" },
    { href: "/brand-kit", icon: Briefcase, label: "Brand Kit" },
    { href: "/emails", icon: Mail, label: "Emails" },
  ];

  const bottomNavItems = [
    { href: "/help", icon: HelpCircle, label: "Help" },
    { href: "/profile", icon: CircleUser, label: "Profile" },
  ];

  return (
    <aside
      className={cn(
        "hidden flex-col bg-background transition-[width] ease-in-out duration-300 sm:flex",
        isExpanded ? "w-56" : "w-16"
      )}
    >
      <div
        className={cn(
          "flex items-center",
          isExpanded ? "h-[60px] justify-start px-3" : "h-[60px] justify-center"
        )}
      >
        <Link
          href="#"
          className={cn(
            "group flex items-center gap-2 font-semibold text-foreground hover:bg-accent hover:text-primary",
            isExpanded ? "rounded-md px-3 py-2" : "h-9 w-9 shrink-0 justify-center rounded-full md:h-8 md:w-8"
          )}
        >
          <Image src="/icon.svg" alt="RenderPart Logo" width={40} height={40}/>
          <span
            className={cn(
              `whitespace-nowrap transition-opacity ease-in-out duration-200`,
              isExpanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
            )}
            aria-hidden={!isExpanded}
          >
            RenderPart
          </span>
        </Link>
      </div>
      <nav className="flex flex-col gap-2 p-2">
        <Button asChild variant="ghost" className={cn(
            "w-full rounded-lg",
            pathname === "/create" && "bg-muted text-foreground",
            !isExpanded ? "justify-center" : "justify-start",
            isExpanded && "hover:bg-accent/80"
          )}>
          <Link
            href="/create"
            className={cn(
              "flex items-center",
              isExpanded && "gap-3",
            )}
          >
            <PlusCircle className="h-5 w-5 shrink-0" />
            <span
              className={cn(
                `whitespace-nowrap transition-opacity ease-in-out duration-200`,
                isExpanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
              )}
              aria-hidden={!isExpanded}
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
              isExpanded && "gap-3",
              pathname === item.href && "bg-muted text-foreground",
              !isExpanded ? "justify-center" : "justify-start"
            )}
          >
            <Link
              href={item.href}
              className={cn(
                "flex items-center",
                isExpanded && "gap-3",
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              <span
                className={cn(
                  `whitespace-nowrap transition-opacity ease-in-out duration-200`,
                  isExpanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
                )}
                aria-hidden={!isExpanded}
              >
                {item.label}
              </span>
            </Link>
          </Button>
        ))}
      </nav>
      <nav className="mt-auto flex flex-col gap-2 p-2">
        <Button
          variant="ghost"
            className={cn(
            "flex items-center rounded-lg text-muted-foreground transition-colors hover:text-primary hover:bg-accent",
            isExpanded && "gap-3",
            !isExpanded ? "justify-center" : "justify-start"
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
              `whitespace-nowrap transition-opacity ease-in-out duration-200`,
              isExpanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
            )}
            aria-hidden={!isExpanded}
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
              !isExpanded ? "justify-center" : "justify-start"
            )}
          >
            <Link
              href={item.href}
              className={cn(
                "flex items-center",
                isExpanded && "gap-3",
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              <span
                className={cn(
                  `whitespace-nowrap transition-opacity ease-in-out duration-200`,
                  isExpanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
                )}
                aria-hidden={!isExpanded}
              >
                {item.label}
              </span>
            </Link>
          </Button>
        ))}
      </nav>
    </aside>
  );
}